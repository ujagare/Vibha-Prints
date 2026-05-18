"""
Full email automation workflow helpers for Vibha Prints.

Connects inbound email replies, AI drafts, hot lead alerts, quote requests,
follow-up activity, and Supabase lead pipeline state.
"""

from __future__ import annotations

import logging
import os
import re
from datetime import datetime, timezone
from email.utils import parseaddr

from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

logger = logging.getLogger("email_workflow")

HOT_LEAD_KEYWORDS = [
    "urgent",
    "asap",
    "immediately",
    "today",
    "tomorrow",
    "jaldi",
    "budget",
    "ready",
    "final",
    "start",
    "deadline",
    "advance",
]

QUOTE_KEYWORDS = [
    "quote",
    "quotation",
    "estimate",
    "pricing",
    "price",
    "cost",
    "rate",
    "budget",
    "proposal",
    "kitna",
    "charges",
]


def clean_email(raw_sender: str) -> str:
    return parseaddr(raw_sender or "")[1].strip().lower()


def clean_name(raw_sender: str, fallback: str = "Client") -> str:
    name = parseaddr(raw_sender or "")[0].strip().strip('"')
    return name or fallback


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def classify_email(subject: str, body: str) -> dict:
    text = f"{subject or ''}\n{body or ''}".lower()
    hot_hits = [k for k in HOT_LEAD_KEYWORDS if k in text]
    quote_hits = [k for k in QUOTE_KEYWORDS if k in text]
    score = 25
    score += min(len(body or "") // 80, 25)
    score += 30 if quote_hits else 0
    score += 30 if hot_hits else 0
    score = min(score, 100)

    if score >= 70:
        priority = "hot"
    elif score >= 45:
        priority = "warm"
    else:
        priority = "cold"

    return {
        "score": score,
        "priority": priority,
        "is_hot": priority == "hot",
        "wants_quote": bool(quote_hits),
        "indicators": sorted(set(hot_hits + quote_hits)),
    }


def _supabase_modules():
    try:
        from supabase_client import (
            add_lead_activity,
            create_quote_request,
            ensure_pipeline_entry,
            is_supabase_configured,
            save_contact_lead,
            supabase,
            update_pipeline_status,
        )

        if not is_supabase_configured() or not supabase:
            return None
        return {
            "add_lead_activity": add_lead_activity,
            "create_quote_request": create_quote_request,
            "ensure_pipeline_entry": ensure_pipeline_entry,
            "save_contact_lead": save_contact_lead,
            "supabase": supabase,
            "update_pipeline_status": update_pipeline_status,
        }
    except Exception as error:
        logger.warning("Supabase workflow unavailable: %s", error)
        return None


def find_or_create_contact_lead(name: str, email: str, message: str) -> dict | None:
    modules = _supabase_modules()
    if not modules or not email:
        return None

    supabase = modules["supabase"]
    try:
        existing = (
            supabase.table("contact_leads")
            .select("*")
            .eq("email", email)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        if existing.data:
            return existing.data[0]

        saved = modules["save_contact_lead"](
            name=name or "Client",
            email=email,
            mobile="email-inbox",
            message=message[:2500] or "Inbound email lead",
            source="inbound-email",
        )
        data = saved.get("data") or []
        return data[0] if data else None
    except Exception as error:
        logger.error("Lead lookup/create failed for %s: %s", email, error)
        return None


def save_reply_draft(lead_id: str, lead_type: str, to_email: str, subject: str, body: str, meta: dict | None = None) -> bool:
    modules = _supabase_modules()
    if not modules:
        return False
    try:
        data = {
            "lead_id": lead_id,
            "lead_type": lead_type,
            "to_email": to_email,
            "subject": subject,
            "body": body,
            "status": "draft",
            "meta": meta or None,
        }
        response = modules["supabase"].table("email_reply_drafts").insert(data).execute()
        return response.status_code in [200, 201]
    except Exception as error:
        logger.error("Failed to save reply draft for %s: %s", to_email, error)
        return False


def activity_exists(lead_id: str, lead_type: str, event: str, message_id: str = "") -> bool:
    """Check whether a workflow activity already exists for idempotent retries."""
    modules = _supabase_modules()
    if not modules:
        return False
    try:
        response = (
            modules["supabase"]
            .table("lead_activity")
            .select("*")
            .eq("lead_id", lead_id)
            .eq("lead_type", lead_type)
            .eq("event", event)
            .limit(100)
            .execute()
        )
        rows = response.data or []
        if not message_id:
            return bool(rows)
        return any(((row.get("meta") or {}).get("message_id") == message_id) for row in rows)
    except Exception as error:
        logger.warning("Activity idempotency check failed for %s/%s: %s", lead_id, event, error)
        return False


def get_alert_channel() -> dict:
    """Return the configured hot-lead alert channel details."""
    mail_to = (
        os.environ.get("HOT_LEAD_ALERT_EMAIL")
        or os.environ.get("MAIL_TO")
        or os.environ.get("LEADS_EMAIL_TO")
        or ""
    ).strip()
    webhook_url = os.environ.get("LEAD_AUTOMATION_WEBHOOK_URL", "").strip()
    channels = []
    if mail_to:
        channels.append("email")
    if webhook_url:
        channels.append("webhook")
    return {
        "channels": channels or ["not_configured"],
        "email_to": mail_to,
        "webhook_configured": bool(webhook_url),
    }


def create_quote_email_draft(client_name: str, subject: str, body: str, reply_body: str) -> str:
    requirement = re.sub(r"\s+", " ", f"{subject or ''} {body or ''}").strip()
    return (
        f"Hi {client_name},\n\n"
        "Thank you for sharing your requirement. Based on your message, we can prepare a proper quote for this work.\n\n"
        f"Requirement noted: {requirement[:600] or 'Design/printing requirement'}\n\n"
        "Please share quantity, size/specifications, delivery location, and preferred timeline. Once we have these details, "
        "we will send the final quotation with pricing, GST, and delivery timeline.\n\n"
        f"{reply_body}"
    )


def record_inbound_workflow(
    sender_name: str,
    sender_email: str,
    subject: str,
    body: str,
    reply_subject: str,
    reply_body: str,
    reply_mode: str,
    sent: bool,
    message_id: str = "",
) -> dict:
    lead = find_or_create_contact_lead(sender_name, sender_email, body)
    classification = classify_email(subject, body)
    result = {
        "lead_id": lead.get("id") if lead else None,
        "lead_type": "contact",
        "classification": classification,
        "draft_saved": False,
        "quote_created": False,
        "hot_alert_sent": False,
        "alert_channel": get_alert_channel(),
    }

    modules = _supabase_modules()
    if not modules or not lead:
        return result

    lead_id = lead["id"]
    status = "hot_lead" if classification["is_hot"] else "client_replied"
    modules["ensure_pipeline_entry"](lead_id, "contact", status=status, notes="Created from inbound email")
    modules["update_pipeline_status"](
        lead_id,
        "contact",
        status=status,
        notes=f"Inbound email processed via {reply_mode}; score={classification['score']}",
    )
    if not activity_exists(lead_id, "contact", "inbound_email_received", message_id):
        modules["add_lead_activity"](
            lead_id,
            "contact",
            "inbound_email_received",
            {
                "from": sender_email,
                "subject": subject,
                "message_id": message_id,
                "classification": classification,
            },
        )

    reply_event = "email_reply_sent" if sent else "email_reply_drafted"
    if not activity_exists(lead_id, "contact", reply_event, message_id):
        modules["add_lead_activity"](
            lead_id,
            "contact",
            reply_event,
            {
                "to": sender_email,
                "subject": reply_subject,
                "mode": reply_mode,
                "message_id": message_id,
            },
        )

    if reply_mode == "draft":
        if activity_exists(lead_id, "contact", "email_reply_draft_saved", message_id):
            result["draft_saved"] = True
        else:
            result["draft_saved"] = save_reply_draft(
                lead_id,
                "contact",
                sender_email,
                reply_subject,
                reply_body,
                {"message_id": message_id, "classification": classification},
            )
            if result["draft_saved"]:
                modules["add_lead_activity"](
                    lead_id,
                    "contact",
                    "email_reply_draft_saved",
                    {"to": sender_email, "subject": reply_subject, "message_id": message_id},
                )

    if classification["wants_quote"]:
        if activity_exists(lead_id, "contact", "quote_email_generated", message_id):
            result["quote_created"] = True
        else:
            quote_draft = create_quote_email_draft(sender_name, subject, body, reply_body)
            quote = modules["create_quote_request"](
                lead_id=lead_id,
                lead_type="contact",
                requirements=body[:2500] or subject or "Quote requested by email",
                status="draft",
                quote_draft=quote_draft,
            )
            result["quote_created"] = bool(quote.get("success"))
            modules["add_lead_activity"](
                lead_id,
                "contact",
                "quote_email_generated",
                {
                    "subject": reply_subject,
                    "quote_request_created": result["quote_created"],
                    "message_id": message_id,
                },
            )

    if classification["is_hot"]:
        if activity_exists(lead_id, "contact", "hot_lead_alert_sent", message_id):
            result["hot_alert_sent"] = True
        else:
            try:
                from email_lead_automation import send_hot_lead_alert

                result["hot_alert_sent"] = send_hot_lead_alert(
                    sender_name,
                    sender_email,
                    body,
                    "inbound_email",
                    force_send=True,
                    score_override={
                        "score": classification["score"],
                        "priority": classification["priority"],
                        "indicators": classification["indicators"],
                    },
                )
                if result["hot_alert_sent"]:
                    modules["add_lead_activity"](
                        lead_id,
                        "contact",
                        "hot_lead_alert_sent",
                        {
                            "message_id": message_id,
                            "channel": result["alert_channel"],
                            "score": classification["score"],
                        },
                    )
            except Exception as error:
                logger.error("Hot lead alert failed for %s: %s", sender_email, error)

    return result
