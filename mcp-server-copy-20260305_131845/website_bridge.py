"""
Simple REST bridge for website integration with Supabase.

This exposes MCP tools as regular HTTP APIs for the React frontend:
- POST /api/chat
- POST /api/create-lead
- GET  /health
"""

from __future__ import annotations

import json
import os
import sys
import threading
import time
from typing import Any, Dict

from flask import Flask, jsonify, request

# Force UTF-8 console output to avoid unicode print crashes from imported modules.
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

from server import chat as mcp_chat
from server import create_lead as mcp_create_lead
from server import send_followup_email as mcp_send_followup
from server import score_lead_tool as mcp_score_lead
from server import run_followup_scheduler as mcp_run_scheduler
from server import get_followup_status as mcp_get_followup_status
from server import get_scheduler_stats as mcp_get_scheduler_stats
from server import update_pipeline_status_tool as mcp_update_pipeline_status
from server import log_lead_activity_tool as mcp_log_activity
from server import create_quote_request_tool as mcp_create_quote_request
from server import create_appointment_tool as mcp_create_appointment
from supabase_client import is_supabase_configured
from inbound_email_handler import process_inbound_emails
from printing_quote_generator import (
    calculate_quote,
    generate_quote_pdf,
    save_quote_log,
    get_available_products,
    get_product_details,
    get_quote_history,
)
from email_lead_automation import send_email
from whatsapp_automation import (
    send_whatsapp_message,
    send_lead_notification,
    send_quote_notification,
    send_order_confirmation,
    send_order_update,
    send_delivery_notification,
    send_followup_message,
    send_review_request,
    get_whatsapp_link,
    get_whatsapp_history,
    get_whatsapp_stats,
)
from whatsapp_chatbot import (
    handle_whatsapp_message,
    get_conversation_history,
    clear_conversation,
    get_all_conversations,
    get_conversation_stats,
)
from social_media_automation import (
    create_social_post,
    schedule_social_post,
    get_social_posts,
    get_social_stats,
    generate_portfolio_update,
    auto_post_to_instagram,
    auto_post_to_facebook,
)

app = Flask(__name__)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("BRIDGE_ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
]
FOLLOWUP_SCHEDULER_ENABLED = os.environ.get("FOLLOWUP_SCHEDULER_ENABLED", "").strip().lower() in {
    "1", "true", "yes"
}
FOLLOWUP_SCHEDULER_TIME = os.environ.get("FOLLOWUP_SCHEDULER_TIME", "09:00").strip()
INBOUND_EMAIL_POLL_ENABLED = os.environ.get(
    "INBOUND_EMAIL_POLL_ENABLED",
    os.environ.get("INBOUND_AUTO_REPLY_ENABLED", "false"),
).strip().lower() in {"1", "true", "yes"}
INBOUND_EMAIL_POLL_SECONDS = max(60, int(os.environ.get("INBOUND_EMAIL_POLL_SECONDS", "120")))
GREEN_API_PROCESSED_MESSAGES = set()


def _positive_int_env(name: str, default: int, minimum: int) -> int:
    try:
        return max(minimum, int(os.environ.get(name, str(default))))
    except Exception:
        return max(minimum, default)


WEBSITE_WHATSAPP_SESSIONS: dict[str, float] = {}
MANUAL_PAUSED_WHATSAPP_SESSIONS: dict[str, float] = {}
WHATSAPP_WEBSITE_AUTO_REPLY_ONLY = os.environ.get(
    "WHATSAPP_WEBSITE_AUTO_REPLY_ONLY",
    "true",
).strip().lower() in {"1", "true", "yes"}
WHATSAPP_WEBSITE_SESSION_TTL_SECONDS = _positive_int_env(
    "WHATSAPP_WEBSITE_SESSION_TTL_SECONDS",
    86400,
    300,
)
WHATSAPP_MANUAL_TAKEOVER_TTL_SECONDS = _positive_int_env(
    "WHATSAPP_MANUAL_TAKEOVER_TTL_SECONDS",
    WHATSAPP_WEBSITE_SESSION_TTL_SECONDS,
    300,
)
WHATSAPP_REPLY_MODE = os.environ.get("WHATSAPP_REPLY_MODE", "auto").strip().lower()
if WHATSAPP_REPLY_MODE not in {"auto", "manual", "draft"}:
    WHATSAPP_REPLY_MODE = "auto"


@app.after_request
def add_cors_headers(response):
    request_origin = request.headers.get("Origin", "")
    if "*" in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = "*"
    elif request_origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = request_origin
        response.headers["Vary"] = "Origin"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-API-Key"
    return response


def _normalize_mcp_output(result: Dict[str, Any]) -> Dict[str, Any]:
    """Extract JSON payload from MCP tool output shape."""
    try:
        payload_text = result["content"][0]["text"]
        parsed = json.loads(payload_text)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass
    return {"error": "invalid_mcp_output", "raw": result}


def _json_error(message: str, status_code: int):
    return jsonify({"success": False, "error": message}), status_code


def _normalize_website_chat_id(value: str) -> str:
    value = (value or "").strip()
    if value.endswith("@c.us") or value.endswith("@g.us"):
        return value
    digits = "".join(ch for ch in value if ch.isdigit())
    if digits and not digits.startswith("91"):
        digits = "91" + digits
    return f"{digits}@c.us" if digits else ""


def _remember_website_whatsapp_session(phone_or_chat_id: str):
    chat_id = _normalize_website_chat_id(phone_or_chat_id)
    if chat_id:
        WEBSITE_WHATSAPP_SESSIONS[chat_id] = time.time()


def _forget_website_whatsapp_session(phone_or_chat_id: str):
    chat_id = _normalize_website_chat_id(phone_or_chat_id)
    if chat_id:
        WEBSITE_WHATSAPP_SESSIONS.pop(chat_id, None)


def _prune_whatsapp_sessions(sessions: dict[str, float], ttl_seconds: int):
    now = time.time()
    expired = [
        key for key, seen_at in sessions.items()
        if now - seen_at > ttl_seconds
    ]
    for key in expired:
        sessions.pop(key, None)


def _has_recent_website_whatsapp_session(chat_id: str) -> bool:
    if not chat_id:
        return False

    _prune_whatsapp_sessions(
        WEBSITE_WHATSAPP_SESSIONS,
        WHATSAPP_WEBSITE_SESSION_TTL_SECONDS,
    )

    seen_at = WEBSITE_WHATSAPP_SESSIONS.get(chat_id)
    return bool(seen_at and time.time() - seen_at <= WHATSAPP_WEBSITE_SESSION_TTL_SECONDS)


def _pause_whatsapp_auto_reply_for_manual_takeover(phone_or_chat_id: str) -> str:
    chat_id = _normalize_website_chat_id(phone_or_chat_id)
    if not chat_id:
        return ""
    MANUAL_PAUSED_WHATSAPP_SESSIONS[chat_id] = time.time()
    _forget_website_whatsapp_session(chat_id)
    return chat_id


def _is_whatsapp_auto_reply_paused(phone_or_chat_id: str) -> bool:
    chat_id = _normalize_website_chat_id(phone_or_chat_id)
    if not chat_id:
        return False
    _prune_whatsapp_sessions(
        MANUAL_PAUSED_WHATSAPP_SESSIONS,
        WHATSAPP_MANUAL_TAKEOVER_TTL_SECONDS,
    )
    paused_at = MANUAL_PAUSED_WHATSAPP_SESSIONS.get(chat_id)
    return bool(paused_at and time.time() - paused_at <= WHATSAPP_MANUAL_TAKEOVER_TTL_SECONDS)


def _is_website_origin_whatsapp_message(data: Dict[str, Any], message: str) -> bool:
    sender_data = data.get("senderData") or {}
    message_data = data.get("messageData") or {}
    text = " ".join(
        str(value or "").lower()
        for value in [
            data.get("source"),
            data.get("origin"),
            data.get("mode"),
            data.get("referrer"),
            data.get("utm_source"),
            sender_data.get("source"),
            sender_data.get("origin"),
            message_data.get("source"),
            message,
        ]
    )

    website_markers = [
        "website",
        "vibha-prints-website",
        "vibhaprints.com",
        "vibha prints website",
        "vibha art website",
        "website chat",
        "sent from vibha art website",
        "contacting you from your website",
        "from your website",
    ]
    return any(marker in text for marker in website_markers)


WEBSITE_WHATSAPP_INTRO_REPLY = (
    "Namaste! Vibha Art / Vibha Prints Pune me graphic design, printing, branding, packaging, "
    "social media creatives, website development aur digital marketing services provide karta hai.\n"
    "Hum logo, business cards, brochures, pamphlets, posters, catalogs, labels, stickers, "
    "flex/banner, stationery aur custom print work me help karte hain.\n"
    "Aap info@vibhaprints.com par email ya +91 86249 48046 par call/WhatsApp kar sakte hain.\n"
    "Main aapki kis prakar madad kar sakti hu?"
)


def _is_website_intro_request(message: str) -> bool:
    text = (message or "").lower()
    return (
        "website" in text
        and any(marker in text for marker in ("jankari", "jaankari", "services", "service"))
    )


def _parse_time_hhmm(value: str) -> tuple[int, int]:
    parts = value.split(":")
    if len(parts) != 2:
        return (9, 0)
    try:
        hour = int(parts[0])
        minute = int(parts[1])
        if 0 <= hour <= 23 and 0 <= minute <= 59:
            return (hour, minute)
    except Exception:
        pass
    return (9, 0)


def _seconds_until_next_run(hour: int, minute: int) -> float:
    now = time.localtime()
    target = time.struct_time((
        now.tm_year, now.tm_mon, now.tm_mday,
        hour, minute, 0,
        now.tm_wday, now.tm_yday, now.tm_isdst
    ))
    now_ts = time.time()
    target_ts = time.mktime(target)
    if target_ts <= now_ts:
        # Next day
        target_ts += 24 * 60 * 60
    return max(1.0, target_ts - now_ts)


def _followup_scheduler_loop():
    hour, minute = _parse_time_hhmm(FOLLOWUP_SCHEDULER_TIME)
    print(f"Follow-up scheduler enabled. Daily at {hour:02d}:{minute:02d}")
    while True:
        sleep_for = _seconds_until_next_run(hour, minute)
        time.sleep(sleep_for)
        try:
            result = mcp_run_scheduler()
            payload = _normalize_mcp_output(result)
            print("Follow-up scheduler run result:", payload)
        except Exception as exc:
            print("Follow-up scheduler error:", exc)


def _start_followup_scheduler():
    if not FOLLOWUP_SCHEDULER_ENABLED:
        return
    thread = threading.Thread(target=_followup_scheduler_loop, daemon=True)
    thread.start()


def _inbound_email_poll_loop():
    print(f"Inbound email auto-reply enabled. Polling every {INBOUND_EMAIL_POLL_SECONDS}s")
    while True:
        try:
            result = process_inbound_emails()
            print("Inbound email poll result:", result)
        except Exception as exc:
            print("Inbound email poll error:", exc)
        time.sleep(INBOUND_EMAIL_POLL_SECONDS)


def _start_inbound_email_poller():
    if not INBOUND_EMAIL_POLL_ENABLED:
        return
    thread = threading.Thread(target=_inbound_email_poll_loop, daemon=True)
    thread.start()


@app.route("/health", methods=["GET"])
def health():
    supabase_status = "connected" if is_supabase_configured() else "disconnected"
    return jsonify({
        "status": "ok",
        "service": "mcp-website-bridge",
        "supabase": supabase_status
    })


@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "status": "ok",
        "service": "vibha-art-backend",
        "health": "/health"
    })


@app.route("/api/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    session_id = (data.get("session_id") or "").strip()
    client_email = (data.get("client_email") or data.get("email") or "").strip()
    conversation_history = data.get("messages") or data.get("conversationHistory") or []

    if not message:
        return jsonify({"error": "message_required"}), 400

    response = mcp_chat(
        message=message,
        session_id=session_id,
        client_email=client_email,
        conversation_history=json.dumps(conversation_history),
    )
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/create-lead", methods=["POST", "OPTIONS"])
@app.route("/api/leads/contact", methods=["POST", "OPTIONS"])
def create_lead():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()
    phone = (data.get("phone") or data.get("mobile") or "").strip()
    company = (data.get("company") or "").strip()
    lead_type = (data.get("lead_type") or "contact").strip()

    if not name or not email:
        return _json_error("name_and_email_required", 400)

    response = mcp_create_lead(
        name=name,
        email=email,
        message=message,
        phone=phone,
        company=company,
        lead_type=lead_type
    )
    payload = _normalize_mcp_output(response)
    status_code = 200 if payload.get("success", True) else 502
    return jsonify(payload), status_code


@app.route("/api/send-followup", methods=["POST", "OPTIONS"])
def send_followup():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    name = (data.get("name") or "").strip()
    days_since = int(data.get("days_since", 1))

    if not email or not name:
        return jsonify({"error": "email_and_name_required"}), 400

    response = mcp_send_followup(email=email, name=name, days_since=days_since)
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/score-lead", methods=["POST", "OPTIONS"])
def score_lead():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()
    lead_type = (data.get("lead_type") or "contact").strip()

    if not name or not email:
        return jsonify({"error": "name_and_email_required"}), 400

    response = mcp_score_lead(name=name, email=email, message=message, lead_type=lead_type)
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/run-scheduler", methods=["POST", "OPTIONS"])
def run_scheduler():
    if request.method == "OPTIONS":
        return ("", 204)

    response = mcp_run_scheduler()
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/followup-status/<email>", methods=["GET", "OPTIONS"])
def followup_status(email):
    if request.method == "OPTIONS":
        return ("", 204)

    if not email:
        return jsonify({"error": "email_required"}), 400

    response = mcp_get_followup_status(email=email)
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/scheduler-stats", methods=["GET", "OPTIONS"])
def scheduler_stats():
    if request.method == "OPTIONS":
        return ("", 204)

    response = mcp_get_scheduler_stats()
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/pipeline/update", methods=["POST", "OPTIONS"])
def update_pipeline():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    lead_id = (data.get("lead_id") or "").strip()
    lead_type = (data.get("lead_type") or "").strip()
    status = (data.get("status") or "").strip()
    assigned_to = (data.get("assigned_to") or "").strip()
    notes = (data.get("notes") or "").strip()

    if not lead_id or not lead_type or not status:
        return jsonify({"error": "lead_id_lead_type_status_required"}), 400

    response = mcp_update_pipeline_status(
        lead_id=lead_id,
        lead_type=lead_type,
        status=status,
        assigned_to=assigned_to,
        notes=notes
    )
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/activity/log", methods=["POST", "OPTIONS"])
def log_activity():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    lead_id = (data.get("lead_id") or "").strip()
    lead_type = (data.get("lead_type") or "").strip()
    event = (data.get("event") or "").strip()
    meta = data.get("meta") or None

    if not lead_id or not lead_type or not event:
        return jsonify({"error": "lead_id_lead_type_event_required"}), 400

    response = mcp_log_activity(
        lead_id=lead_id,
        lead_type=lead_type,
        event=event,
        meta_json=json.dumps(meta) if meta is not None else ""
    )
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/quote-request", methods=["POST", "OPTIONS"])
def quote_request():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    lead_id = (data.get("lead_id") or "").strip()
    lead_type = (data.get("lead_type") or "").strip()
    requirements = (data.get("requirements") or "").strip()
    estimated_budget = float(data.get("estimated_budget") or 0)
    status = (data.get("status") or "new").strip()
    quote_draft = (data.get("quote_draft") or "").strip()

    if not lead_id or not lead_type or not requirements:
        return jsonify({"error": "lead_id_lead_type_requirements_required"}), 400

    response = mcp_create_quote_request(
        lead_id=lead_id,
        lead_type=lead_type,
        requirements=requirements,
        estimated_budget=estimated_budget,
        status=status,
        quote_draft=quote_draft
    )
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/appointments", methods=["POST", "OPTIONS"])
def appointments():
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json(silent=True) or {}
    lead_id = (data.get("lead_id") or "").strip()
    lead_type = (data.get("lead_type") or "").strip()
    calendar_provider = (data.get("calendar_provider") or "").strip()
    booking_link = (data.get("booking_link") or "").strip()
    time_slot = (data.get("time_slot") or "").strip()
    reminder_status = (data.get("reminder_status") or "pending").strip()

    if not lead_id or not lead_type:
        return jsonify({"error": "lead_id_lead_type_required"}), 400

    response = mcp_create_appointment(
        lead_id=lead_id,
        lead_type=lead_type,
        calendar_provider=calendar_provider,
        booking_link=booking_link,
        time_slot=time_slot,
        reminder_status=reminder_status
    )
    payload = _normalize_mcp_output(response)
    return jsonify(payload)


@app.route("/api/process-inbound-emails", methods=["POST", "OPTIONS"])
def process_inbound():
    """Process inbound emails and send AI-powered replies"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        result = process_inbound_emails()
        return jsonify({
            "success": True,
            "data": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/printing/products", methods=["GET", "OPTIONS"])
def get_printing_products():
    """Get available printing products"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        products = get_available_products()
        return jsonify({
            "success": True,
            "products": products
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/printing/product/<product_id>", methods=["GET", "OPTIONS"])
def get_printing_product(product_id):
    """Get product details"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        product = get_product_details(product_id)
        if not product:
            return jsonify({
                "success": False,
                "error": f"Product '{product_id}' not found"
            }), 404

        return jsonify({
            "success": True,
            "product": product
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/printing/calculate-quote", methods=["POST", "OPTIONS"])
def calculate_printing_quote():
    """Calculate printing quote"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        product_id = (data.get("product_id") or "").strip()
        size = (data.get("size") or "").strip()
        quantity = int(data.get("quantity") or 0)
        paper_type = (data.get("paper_type") or "").strip() or None
        material_type = (data.get("material_type") or "").strip() or None
        finish_type = (data.get("finish_type") or "").strip() or None

        if not product_id or not size or quantity <= 0:
            return jsonify({
                "success": False,
                "error": "product_id, size, and quantity required"
            }), 400

        result = calculate_quote(
            product_id=product_id,
            size=size,
            quantity=quantity,
            paper_type=paper_type,
            material_type=material_type,
            finish_type=finish_type
        )

        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/printing/generate-quote", methods=["POST", "OPTIONS"])
def generate_printing_quote():
    """Generate and send quote PDF"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        product_id = (data.get("product_id") or "").strip()
        size = (data.get("size") or "").strip()
        quantity = int(data.get("quantity") or 0)
        client_name = (data.get("client_name") or "").strip()
        client_email = (data.get("client_email") or "").strip()
        paper_type = (data.get("paper_type") or "").strip() or None
        material_type = (data.get("material_type") or "").strip() or None
        finish_type = (data.get("finish_type") or "").strip() or None

        if not all([product_id, size, quantity, client_name, client_email]):
            return jsonify({
                "success": False,
                "error": "product_id, size, quantity, client_name, client_email required"
            }), 400

        # Calculate quote
        quote_result = calculate_quote(
            product_id=product_id,
            size=size,
            quantity=quantity,
            paper_type=paper_type,
            material_type=material_type,
            finish_type=finish_type
        )

        if not quote_result.get("success"):
            return jsonify(quote_result), 400

        # Generate PDF
        pdf_path = generate_quote_pdf(quote_result, client_name, client_email)

        if not pdf_path:
            return jsonify({
                "success": False,
                "error": "Failed to generate PDF"
            }), 500

        # Save to log
        save_quote_log(quote_result, client_name, client_email, pdf_path)

        # Send email
        quote_data = quote_result["quote"]
        email_body = f"""
        Dear {client_name},

        Thank you for your interest in {quote_data['product_name']}!

        Here are your quote details:
        - Product: {quote_data['product_name']}
        - Size: {quote_data['size']}
        - Quantity: {quote_data['quantity']} {quote_data['unit']}
        - Unit Price: ₹{quote_data['unit_price']}
        - Subtotal: ₹{quote_data['subtotal']}
        - Discount ({quote_data['discount_percent']}%): -₹{quote_data['discount_amount']}
        - After Discount: ₹{quote_data['subtotal_after_discount']}
        - GST (18%): ₹{quote_data['gst_18_percent']}
        - TOTAL: ₹{quote_data['total']}

        Please find the detailed quote attached.

        Next Steps:
        1. Review the quote
        2. Confirm your requirements
        3. We'll send you the design proof within 24 hours

        For any questions, feel free to contact us.

        Best regards,
        Vibha Prints Team
        """

        html_body = f"""
        <html>
            <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <h2 style='color: #6A11CB;'>Your Quote is Ready! 📋</h2>
                    
                    <p>Dear {client_name},</p>
                    
                    <p>Thank you for your interest in <strong>{quote_data['product_name']}</strong>!</p>
                    
                    <div style='background-color: #f5f5f5; padding: 15px; border-left: 4px solid #6A11CB; margin: 20px 0;'>
                        <h3 style='color: #6A11CB; margin-top: 0;'>Quote Summary</h3>
                        <table style='width: 100%; border-collapse: collapse;'>
                            <tr>
                                <td style='padding: 8px;'><strong>Product:</strong></td>
                                <td style='padding: 8px;'>{quote_data['product_name']}</td>
                            </tr>
                            <tr style='background-color: #fff;'>
                                <td style='padding: 8px;'><strong>Size:</strong></td>
                                <td style='padding: 8px;'>{quote_data['size']}</td>
                            </tr>
                            <tr>
                                <td style='padding: 8px;'><strong>Quantity:</strong></td>
                                <td style='padding: 8px;'>{quote_data['quantity']} {quote_data['unit']}</td>
                            </tr>
                            <tr style='background-color: #fff;'>
                                <td style='padding: 8px;'><strong>Unit Price:</strong></td>
                                <td style='padding: 8px;'>₹{quote_data['unit_price']}</td>
                            </tr>
                            <tr style='border-top: 2px solid #6A11CB;'>
                                <td style='padding: 8px;'><strong>Subtotal:</strong></td>
                                <td style='padding: 8px;'>₹{quote_data['subtotal']}</td>
                            </tr>
                            <tr style='background-color: #fff;'>
                                <td style='padding: 8px;'><strong>Discount ({quote_data['discount_percent']}%):</strong></td>
                                <td style='padding: 8px; color: green;'>-₹{quote_data['discount_amount']}</td>
                            </tr>
                            <tr>
                                <td style='padding: 8px;'><strong>After Discount:</strong></td>
                                <td style='padding: 8px;'>₹{quote_data['subtotal_after_discount']}</td>
                            </tr>
                            <tr style='background-color: #fff;'>
                                <td style='padding: 8px;'><strong>GST (18%):</strong></td>
                                <td style='padding: 8px;'>₹{quote_data['gst_18_percent']}</td>
                            </tr>
                            <tr style='background-color: #6A11CB; color: white; font-size: 16px;'>
                                <td style='padding: 12px;'><strong>TOTAL AMOUNT:</strong></td>
                                <td style='padding: 12px;'><strong>₹{quote_data['total']}</strong></td>
                            </tr>
                        </table>
                    </div>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Review the detailed quote (attached)</li>
                        <li>Confirm your requirements</li>
                        <li>We'll send you the design proof within 24 hours</li>
                    </ol>
                    
                    <p style='color: #666; font-size: 14px;'>
                        <strong>Terms:</strong> 50% advance payment, 50% on delivery. Delivery in 5-7 working days.
                    </p>
                    
                    <div style='margin-top:30px;padding-top:20px;border-top:2px solid #6A11CB;'>
                        <p style='margin:0;font-size:14px;color:#333;line-height:1.8;'>
                            <strong style='color:#6A11CB;'>Vibha Prints</strong><br/>
                            Design &amp; Printing Solutions<br/>
                            📧 <a href='mailto:info@vibhaprints.com' style='color:#6A11CB;text-decoration:none;'>info@vibhaprints.com</a><br/>
                            📱 <a href='tel:+918624948046' style='color:#6A11CB;text-decoration:none;'>+91 86249 48046</a><br/>
                            🌐 <a href='{os.environ.get("BUSINESS_WEBSITE") or os.environ.get("VITE_APP_URL") or "https://www.vibhaprints.com/"}' style='color:#6A11CB;text-decoration:none;'>https://www.vibhaprints.com/</a>
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """

        send_email(
            to_email=client_email,
            subject=f"Your {quote_data['product_name']} Quote - ₹{quote_data['total']}",
            html_content=html_body,
            text_content=email_body,
            cc_email=MAIL_FROM,
            attachment_path=pdf_path
        )

        return jsonify({
            "success": True,
            "message": "Quote generated and sent successfully",
            "quote": quote_data,
            "pdf_path": pdf_path
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/printing/quote-history", methods=["GET", "OPTIONS"])
def get_printing_quote_history():
    """Get quote history"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        limit = int(request.args.get("limit", 100))
        history = get_quote_history(limit)
        return jsonify({
            "success": True,
            "quotes": history
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/send", methods=["POST", "OPTIONS"])
def send_whatsapp():
    """Send WhatsApp message"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        phone = (data.get("phone") or "").strip()
        message = (data.get("message") or "").strip()
        message_type = (data.get("type") or "text").strip()

        if not phone or not message:
            return jsonify({
                "success": False,
                "error": "phone and message required"
            }), 400

        result = send_whatsapp_message(phone, message, message_type)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/lead-notification", methods=["POST", "OPTIONS"])
def whatsapp_lead_notification():
    """Send lead notification via WhatsApp"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        phone = (data.get("phone") or "").strip()
        email = (data.get("email") or "").strip()
        message = (data.get("message") or "").strip()

        if not all([name, phone, email]):
            return jsonify({
                "success": False,
                "error": "name, phone, email required"
            }), 400

        result = send_lead_notification(name, phone, email, message)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/quote-notification", methods=["POST", "OPTIONS"])
def whatsapp_quote_notification():
    """Send quote notification via WhatsApp"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        phone = (data.get("phone") or "").strip()
        product = (data.get("product") or "").strip()
        total = float(data.get("total") or 0)
        quote_id = (data.get("quote_id") or "").strip()

        if not all([name, phone, product, total, quote_id]):
            return jsonify({
                "success": False,
                "error": "name, phone, product, total, quote_id required"
            }), 400

        result = send_quote_notification(name, phone, product, total, quote_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/order-confirmation", methods=["POST", "OPTIONS"])
def whatsapp_order_confirmation():
    """Send order confirmation via WhatsApp"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        phone = (data.get("phone") or "").strip()
        order_id = (data.get("order_id") or "").strip()
        product = (data.get("product") or "").strip()
        amount = float(data.get("amount") or 0)

        if not all([name, phone, order_id, product, amount]):
            return jsonify({
                "success": False,
                "error": "name, phone, order_id, product, amount required"
            }), 400

        result = send_order_confirmation(name, phone, order_id, product, amount)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/order-update", methods=["POST", "OPTIONS"])
def whatsapp_order_update():
    """Send order status update via WhatsApp"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        phone = (data.get("phone") or "").strip()
        order_id = (data.get("order_id") or "").strip()
        status = (data.get("status") or "").strip()
        message = (data.get("message") or "").strip()

        if not all([name, phone, order_id, status]):
            return jsonify({
                "success": False,
                "error": "name, phone, order_id, status required"
            }), 400

        result = send_order_update(name, phone, order_id, status, message)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/delivery-notification", methods=["POST", "OPTIONS"])
def whatsapp_delivery_notification():
    """Send delivery notification via WhatsApp"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        phone = (data.get("phone") or "").strip()
        order_id = (data.get("order_id") or "").strip()
        tracking_info = (data.get("tracking_info") or "").strip()

        if not all([name, phone, order_id]):
            return jsonify({
                "success": False,
                "error": "name, phone, order_id required"
            }), 400

        result = send_delivery_notification(name, phone, order_id, tracking_info)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/followup", methods=["POST", "OPTIONS"])
def whatsapp_followup():
    """Send follow-up message via WhatsApp"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        phone = (data.get("phone") or "").strip()
        days_since = int(data.get("days_since") or 1)

        if not all([name, phone]):
            return jsonify({
                "success": False,
                "error": "name, phone required"
            }), 400

        result = send_followup_message(name, phone, days_since)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/review-request", methods=["POST", "OPTIONS"])
def whatsapp_review_request():
    """Send review request via WhatsApp"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        phone = (data.get("phone") or "").strip()
        order_id = (data.get("order_id") or "").strip()

        if not all([name, phone, order_id]):
            return jsonify({
                "success": False,
                "error": "name, phone, order_id required"
            }), 400

        result = send_review_request(name, phone, order_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/link", methods=["POST", "OPTIONS"])
def whatsapp_link():
    """Get WhatsApp link for manual sending"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        phone = (data.get("phone") or "").strip()
        message = (data.get("message") or "").strip()

        if not all([phone, message]):
            return jsonify({
                "success": False,
                "error": "phone and message required"
            }), 400

        link = get_whatsapp_link(phone, message)
        return jsonify({
            "success": True,
            "link": link,
            "phone": phone
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/history", methods=["GET", "OPTIONS"])
def whatsapp_history():
    """Get WhatsApp message history"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        limit = int(request.args.get("limit", 100))
        history = get_whatsapp_history(limit)
        return jsonify({
            "success": True,
            "messages": history
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/stats", methods=["GET", "OPTIONS"])
def whatsapp_stats():
    """Get WhatsApp statistics"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        stats = get_whatsapp_stats()
        return jsonify({
            "success": True,
            "stats": stats
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/chat", methods=["POST", "OPTIONS"])
def whatsapp_chat():
    """Send message and get AI response"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        phone = (data.get("phone") or "").strip()
        message = (data.get("message") or "").strip()
        name = (data.get("name") or "").strip()
        source = (data.get("source") or "vibha-prints-website").strip()

        if not phone or not message:
            return jsonify({
                "success": False,
                "error": "phone and message required"
            }), 400

        _remember_website_whatsapp_session(phone)
        result = handle_whatsapp_message(phone, message, name)
        if isinstance(result, dict):
            result["source"] = source
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


def _extract_green_api_text(message_data):
    if not isinstance(message_data, dict):
        return ""
    text_data = message_data.get("textMessageData") or {}
    if isinstance(text_data, dict) and text_data.get("textMessage"):
        return str(text_data.get("textMessage") or "").strip()
    extended = message_data.get("extendedTextMessageData") or {}
    if isinstance(extended, dict):
        return str(
            extended.get("text")
            or extended.get("description")
            or extended.get("caption")
            or ""
        ).strip()
    return ""


def _extract_green_api_chat_id(data):
    sender_data = data.get("senderData") or {}
    message_data = data.get("messageData") or {}
    recipient_data = data.get("recipientData") or {}
    return (
        sender_data.get("chatId")
        or data.get("chatId")
        or message_data.get("chatId")
        or recipient_data.get("chatId")
        or ""
    ).strip()


def _is_manual_outgoing_green_api_webhook(data):
    type_webhook = str(data.get("typeWebhook") or "")
    if not type_webhook or "api" in type_webhook.lower():
        return False
    return type_webhook == "outgoingMessageReceived"


@app.route("/api/green-api/webhook", methods=["POST", "OPTIONS"])
@app.route("/api/whatsapp/green-webhook", methods=["POST", "OPTIONS"])
@app.route("/webhook", methods=["POST", "OPTIONS"])
def green_api_webhook():
    """Receive Green API incoming WhatsApp messages and send AI auto-replies."""
    if request.method == "OPTIONS":
        return ("", 204)

    if os.environ.get("WHATSAPP_AUTO_REPLY_ENABLED", "true").strip().lower() not in {
        "1", "true", "yes"
    }:
        return jsonify({"success": True, "skipped": "auto_reply_disabled"})

    data = request.get_json(silent=True) or {}
    if data.get("body") and isinstance(data.get("body"), dict):
        data = data["body"]

    if _is_manual_outgoing_green_api_webhook(data):
        paused_chat_id = _pause_whatsapp_auto_reply_for_manual_takeover(
            _extract_green_api_chat_id(data)
        )
        return jsonify({
            "success": True,
            "paused": "manual_takeover",
            "chat_id": paused_chat_id,
        })

    if data.get("typeWebhook") != "incomingMessageReceived":
        return jsonify({"success": True, "skipped": data.get("typeWebhook", "unknown")})

    sender_data = data.get("senderData") or {}
    message_data = data.get("messageData") or {}
    chat_id = _extract_green_api_chat_id(data)
    sender_name = (sender_data.get("senderName") or "").strip()
    message = _extract_green_api_text(message_data)
    message_id = (data.get("idMessage") or message_data.get("idMessage") or "").strip()

    if not chat_id or not message:
        return jsonify({"success": True, "skipped": "no_chat_or_text"})

    if _is_whatsapp_auto_reply_paused(chat_id):
        return jsonify({
            "success": True,
            "skipped": "manual_takeover_active",
            "chat_id": chat_id,
        })

    is_website_origin = (
        _has_recent_website_whatsapp_session(chat_id)
        or _is_website_origin_whatsapp_message(data, message)
    )
    if WHATSAPP_WEBSITE_AUTO_REPLY_ONLY and not is_website_origin:
        return jsonify({
            "success": True,
            "skipped": "not_website_origin",
            "chat_id": chat_id,
        })
    if is_website_origin:
        _remember_website_whatsapp_session(chat_id)

    if message_id:
        dedupe_key = f"{chat_id}:{message_id}"
        if dedupe_key in GREEN_API_PROCESSED_MESSAGES:
            return jsonify({"success": True, "skipped": "duplicate", "message_id": message_id})
        GREEN_API_PROCESSED_MESSAGES.add(dedupe_key)
        if len(GREEN_API_PROCESSED_MESSAGES) > 500:
            GREEN_API_PROCESSED_MESSAGES.clear()

    if _is_website_intro_request(message):
        reply = WEBSITE_WHATSAPP_INTRO_REPLY
    else:
        result = handle_whatsapp_message(chat_id, message, sender_name)
        reply = (result.get("response") or "").strip()
    if not reply:
        return jsonify({"success": False, "error": "empty_ai_reply"}), 500

    if WHATSAPP_REPLY_MODE in {"manual", "draft"}:
        return jsonify({
            "success": True,
            "chat_id": chat_id,
            "reply": reply,
            "drafted": True,
            "send_result": {
                "success": True,
                "delivery": "manual_draft",
                "message": "Auto-send disabled by WHATSAPP_REPLY_MODE",
            },
        })

    send_result = send_whatsapp_message(chat_id, reply, "auto_reply")
    return jsonify({
        "success": bool(send_result.get("success")),
        "chat_id": chat_id,
        "reply": reply,
        "send_result": send_result,
    })


@app.route("/api/whatsapp/conversation/<phone>", methods=["GET", "OPTIONS"])
def whatsapp_conversation(phone):
    """Get conversation history"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        limit = int(request.args.get("limit", 20))
        history = get_conversation_history(phone, limit)
        return jsonify({
            "success": True,
            "phone": phone,
            "messages": history
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/conversation/<phone>", methods=["DELETE", "OPTIONS"])
def clear_whatsapp_conversation(phone):
    """Clear conversation history"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        success = clear_conversation(phone)
        return jsonify({
            "success": success,
            "message": "Conversation cleared" if success else "Failed to clear"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/conversations", methods=["GET", "OPTIONS"])
def whatsapp_conversations():
    """Get all conversations"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        conversations = get_all_conversations()
        return jsonify({
            "success": True,
            "conversations": conversations
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/whatsapp/conversation-stats", methods=["GET", "OPTIONS"])
def whatsapp_conversation_stats():
    """Get conversation statistics"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        stats = get_conversation_stats()
        return jsonify({
            "success": True,
            "stats": stats
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/social-media/create-post", methods=["POST", "OPTIONS"])
def create_social_media_post():
    """Create social media post"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        title = (data.get("title") or "").strip()
        description = (data.get("description") or "").strip()
        post_type = (data.get("type") or "general").strip()
        image_url = (data.get("image_url") or "").strip()
        hashtags = data.get("hashtags") or []

        if not all([title, description]):
            return jsonify({
                "success": False,
                "error": "title and description required"
            }), 400

        post = create_social_post(title, description, post_type, image_url, hashtags)
        return jsonify({
            "success": True,
            "post": post
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/social-media/schedule-post", methods=["POST", "OPTIONS"])
def schedule_social_media_post():
    """Schedule social media post"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        title = (data.get("title") or "").strip()
        description = (data.get("description") or "").strip()
        post_type = (data.get("type") or "general").strip()
        image_url = (data.get("image_url") or "").strip()
        schedule_time = (data.get("schedule_time") or "").strip()

        if not all([title, description]):
            return jsonify({
                "success": False,
                "error": "title and description required"
            }), 400

        post = schedule_social_post(title, description, post_type, image_url, schedule_time)
        return jsonify({
            "success": True,
            "post": post
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/social-media/posts", methods=["GET", "OPTIONS"])
def get_social_media_posts():
    """Get all social media posts"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        limit = int(request.args.get("limit", 100))
        posts = get_social_posts(limit)
        return jsonify({
            "success": True,
            "posts": posts,
            "count": len(posts)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/social-media/stats", methods=["GET", "OPTIONS"])
def get_social_media_stats():
    """Get social media statistics"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        stats = get_social_stats()
        return jsonify({
            "success": True,
            "stats": stats
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/social-media/portfolio-update", methods=["POST", "OPTIONS"])
def create_portfolio_update():
    """Create portfolio update with multiple projects"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        projects = data.get("projects") or []

        if not projects:
            return jsonify({
                "success": False,
                "error": "projects array required"
            }), 400

        portfolio = generate_portfolio_update(projects)
        return jsonify({
            "success": True,
            "portfolio": portfolio
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/social-media/post-to-instagram", methods=["POST", "OPTIONS"])
def post_to_instagram():
    """Post to Instagram"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        post_id = (data.get("post_id") or "").strip()

        if not post_id:
            return jsonify({
                "success": False,
                "error": "post_id required"
            }), 400

        # Get post from log
        from social_media_automation import get_post_by_id
        post = get_post_by_id(post_id)

        if not post:
            return jsonify({
                "success": False,
                "error": "Post not found"
            }), 404

        result = auto_post_to_instagram(post)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/social-media/post-to-facebook", methods=["POST", "OPTIONS"])
def post_to_facebook():
    """Post to Facebook"""
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        data = request.get_json(silent=True) or {}
        post_id = (data.get("post_id") or "").strip()

        if not post_id:
            return jsonify({
                "success": False,
                "error": "post_id required"
            }), 400

        # Get post from log
        from social_media_automation import get_post_by_id
        post = get_post_by_id(post_id)

        if not post:
            return jsonify({
                "success": False,
                "error": "Post not found"
            }), 404

        result = auto_post_to_facebook(post)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    _start_followup_scheduler()
    _start_inbound_email_poller()
    port = int(os.environ.get("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=False)
