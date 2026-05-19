"""
WhatsApp Automation - Send automated messages to clients
Features:
- Lead notifications
- Quote confirmations
- Order updates
- Follow-up messages
- Delivery notifications
"""

import os
import json
import logging
import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from typing import Dict, Optional
from urllib.parse import quote

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("whatsapp_automation")

# WhatsApp Configuration
WHATSAPP_PHONE = os.environ.get("WHATSAPP_PHONE_NUMBER", "8624948046")
WHATSAPP_API_URL = os.environ.get("WHATSAPP_API_URL", "https://api.whatsapp.com/send")
WHATSAPP_ENABLED = os.environ.get("WHATSAPP_ENABLED", "true").lower() in ("true", "1", "yes")
GREEN_API_INSTANCE_ID = os.environ.get("GREEN_API_INSTANCE_ID", "").strip()
GREEN_API_TOKEN = os.environ.get("GREEN_API_TOKEN", "").strip()
GREEN_API_BASE_URL = os.environ.get("GREEN_API_BASE_URL", "https://api.green-api.com").rstrip("/")

# Business info
BUSINESS_NAME = "Vibha Prints"
BUSINESS_PHONE = "+91 86259 48046"
BUSINESS_EMAIL = "info@vibhaprints.com"

# Data directory
DATA_DIR = Path(__file__).parent / "data"
WHATSAPP_LOG = DATA_DIR / "whatsapp_log.json"
DATA_DIR.mkdir(exist_ok=True)


def load_whatsapp_log() -> dict:
    """Load WhatsApp message log"""
    if not WHATSAPP_LOG.exists():
        return {}
    try:
        with open(WHATSAPP_LOG, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading WhatsApp log: {e}")
        return {}


def save_whatsapp_log(log: dict):
    """Save WhatsApp message log"""
    try:
        with open(WHATSAPP_LOG, 'w') as f:
            json.dump(log, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving WhatsApp log: {e}")


def _normalize_chat_id(phone_number: str) -> str:
    """Return a Green API chatId for a phone number or existing chatId."""
    phone_number = (phone_number or "").strip()
    if phone_number.endswith("@c.us") or phone_number.endswith("@g.us"):
        return phone_number
    digits = "".join(ch for ch in phone_number if ch.isdigit())
    if digits and not digits.startswith("91"):
        digits = "91" + digits
    return f"{digits}@c.us"


def _green_api_configured() -> bool:
    return bool(GREEN_API_INSTANCE_ID and GREEN_API_TOKEN and GREEN_API_BASE_URL)


def _send_green_api_message(chat_id: str, message: str) -> Dict:
    url = (
        f"{GREEN_API_BASE_URL}/waInstance{GREEN_API_INSTANCE_ID}"
        f"/sendMessage/{GREEN_API_TOKEN}"
    )
    response = requests.post(
        url,
        json={"chatId": chat_id, "message": message},
        headers={"Content-Type": "application/json"},
        timeout=30,
    )
    try:
        payload = response.json()
    except Exception:
        payload = {"raw": response.text}
    if response.status_code >= 400:
        raise RuntimeError(f"Green API send failed: {response.status_code} {payload}")
    return payload


def send_whatsapp_message(phone_number: str, message: str, message_type: str = "text") -> Dict:
    """
    Send WhatsApp message
    
    Args:
        phone_number: Recipient phone number (with country code, e.g., 919876543210)
        message: Message text
        message_type: Type of message (text, quote, order_update, etc.)
    
    Returns:
        dict with success status
    """
    
    if not WHATSAPP_ENABLED:
        logger.warning("WhatsApp automation is disabled")
        return {
            "success": False,
            "error": "WhatsApp automation is disabled"
        }
    
    chat_id = _normalize_chat_id(phone_number)
    display_phone = chat_id.replace("@c.us", "")
    
    logger.info(f"📱 Sending WhatsApp message to {phone_number}")
    logger.info(f"   Type: {message_type}")
    logger.info(f"   Message: {message[:50]}...")
    
    try:
        green_response = None
        delivery_status = "pending"
        if _green_api_configured():
            green_response = _send_green_api_message(chat_id, message)
            delivery_status = "sent"

        # Create WhatsApp link as a fallback/debug value
        encoded_message = quote(message)
        whatsapp_link = f"{WHATSAPP_API_URL}?phone={display_phone}&text={encoded_message}"
        
        # Log message
        log = load_whatsapp_log()
        message_id = f"WA-{int(datetime.now().timestamp())}"
        log[message_id] = {
            "phone": display_phone,
            "chat_id": chat_id,
            "message": message,
            "type": message_type,
            "sent_at": datetime.now().isoformat(),
            "link": whatsapp_link,
            "status": delivery_status,
            "green_api": green_response
        }
        save_whatsapp_log(log)
        
        logger.info(f"✅ WhatsApp message prepared: {message_id}")
        logger.info(f"   Link: {whatsapp_link}")
        
        return {
            "success": True,
            "message_id": message_id,
            "phone": display_phone,
            "chat_id": chat_id,
            "link": whatsapp_link,
            "message": message,
            "type": message_type,
            "delivery": delivery_status,
            "green_api": green_response
        }
    
    except Exception as e:
        logger.error(f"❌ Error sending WhatsApp message: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def send_lead_notification(name: str, phone: str, email: str, message: str) -> Dict:
    """
    Send WhatsApp notification for new lead
    
    Args:
        name: Lead name
        phone: Lead phone number
        email: Lead email
        message: Lead message
    
    Returns:
        dict with success status
    """
    
    whatsapp_message = f"""
Namaste {name}! 👋

Thank you for contacting {BUSINESS_NAME}!

We received your inquiry and will get back to you shortly.

📧 Email: {email}
📱 Phone: {phone}

For urgent matters, you can reach us at:
{BUSINESS_PHONE}

Best regards,
{BUSINESS_NAME} Team
    """.strip()
    
    return send_whatsapp_message(phone, whatsapp_message, "lead_notification")


def send_quote_notification(name: str, phone: str, product: str, total: float, quote_id: str) -> Dict:
    """
    Send WhatsApp notification for quote
    
    Args:
        name: Client name
        phone: Client phone number
        product: Product name
        total: Quote total amount
        quote_id: Quote ID
    
    Returns:
        dict with success status
    """
    
    whatsapp_message = f"""
Hi {name}! 📋

Your quote is ready!

Product: {product}
Total Amount: ₹{total}
Quote ID: {quote_id}

Next Steps:
1. Review the quote (check your email)
2. Confirm your requirements
3. We'll send design proof within 24 hours

Payment Terms: 50% advance, 50% on delivery
Delivery: 5-7 working days

Questions? Reply to this message or call:
{BUSINESS_PHONE}

Best regards,
{BUSINESS_NAME}
    """.strip()
    
    return send_whatsapp_message(phone, whatsapp_message, "quote_notification")


def send_order_confirmation(name: str, phone: str, order_id: str, product: str, amount: float) -> Dict:
    """
    Send WhatsApp order confirmation
    
    Args:
        name: Client name
        phone: Client phone number
        order_id: Order ID
        product: Product name
        amount: Order amount
    
    Returns:
        dict with success status
    """
    
    whatsapp_message = f"""
Hi {name}! ✅

Your order has been confirmed!

Order ID: {order_id}
Product: {product}
Amount: ₹{amount}

Status: Design Phase
Expected Delivery: 5-7 working days

We'll keep you updated on every step.

Track your order: {BUSINESS_PHONE}

Thank you for choosing {BUSINESS_NAME}!
    """.strip()
    
    return send_whatsapp_message(phone, whatsapp_message, "order_confirmation")


def send_order_update(name: str, phone: str, order_id: str, status: str, message: str) -> Dict:
    """
    Send WhatsApp order status update
    
    Args:
        name: Client name
        phone: Client phone number
        order_id: Order ID
        status: Order status (design, printing, quality_check, ready, delivered)
        message: Custom message
    
    Returns:
        dict with success status
    """
    
    status_emoji = {
        "design": "🎨",
        "printing": "🖨️",
        "quality_check": "✅",
        "ready": "📦",
        "delivered": "🚚"
    }.get(status, "📌")
    
    whatsapp_message = f"""
Hi {name}! {status_emoji}

Order Update

Order ID: {order_id}
Status: {status.replace('_', ' ').title()}

{message}

We'll notify you once the next step is complete.

Questions? Call us: {BUSINESS_PHONE}

{BUSINESS_NAME}
    """.strip()
    
    return send_whatsapp_message(phone, whatsapp_message, f"order_update_{status}")


def send_delivery_notification(name: str, phone: str, order_id: str, tracking_info: str = "") -> Dict:
    """
    Send WhatsApp delivery notification
    
    Args:
        name: Client name
        phone: Client phone number
        order_id: Order ID
        tracking_info: Tracking information
    
    Returns:
        dict with success status
    """
    
    whatsapp_message = f"""
Hi {name}! 🚚

Your order is on the way!

Order ID: {order_id}
Status: Out for Delivery

{f"Tracking: {tracking_info}" if tracking_info else ""}

Expected Delivery: Today or Tomorrow

Thank you for your business!

{BUSINESS_NAME}
{BUSINESS_PHONE}
    """.strip()
    
    return send_whatsapp_message(phone, whatsapp_message, "delivery_notification")


def send_followup_message(name: str, phone: str, days_since: int) -> Dict:
    """
    Send WhatsApp follow-up message
    
    Args:
        name: Client name
        phone: Client phone number
        days_since: Days since initial contact
    
    Returns:
        dict with success status
    """
    
    followup_messages = {
        1: f"""
Hi {name}! 👋

Just checking in! Did you get a chance to review our services?

We specialize in:
✓ Logo Design & Branding
✓ Business Cards & Stationery
✓ Brochures & Packaging
✓ Digital & Offset Printing

Let's create something amazing together!

{BUSINESS_PHONE}
        """,
        3: f"""
Hi {name}! 🎁

Special offer this week:
✓ Free design consultation
✓ 2 free revision rounds
✓ Quick turnaround (3-5 days)

Limited slots available!

Book your consultation: {BUSINESS_PHONE}
        """,
        7: f"""
Hi {name}! ✨

Last chance to grab our special offer!

Don't miss out on professional design services at competitive rates.

Limited slots available this month.

Let's talk: {BUSINESS_PHONE}
        """,
    }
    
    message = followup_messages.get(days_since, followup_messages[1])
    
    return send_whatsapp_message(phone, message.strip(), f"followup_day_{days_since}")


def send_review_request(name: str, phone: str, order_id: str) -> Dict:
    """
    Send WhatsApp review request
    
    Args:
        name: Client name
        phone: Client phone number
        order_id: Order ID
    
    Returns:
        dict with success status
    """
    
    whatsapp_message = f"""
Hi {name}! ⭐

We hope you're happy with your order!

Order ID: {order_id}

Could you please share your feedback?

Your review helps us improve and helps others discover our services.

Thank you for choosing {BUSINESS_NAME}!

{BUSINESS_PHONE}
    """.strip()
    
    return send_whatsapp_message(phone, whatsapp_message, "review_request")


def get_whatsapp_link(phone_number: str, message: str) -> str:
    """
    Get WhatsApp link for manual sending
    
    Args:
        phone_number: Phone number
        message: Message text
    
    Returns:
        WhatsApp link
    """
    
    if not phone_number.startswith("+"):
        if not phone_number.startswith("91"):
            phone_number = "91" + phone_number
        phone_number = "+" + phone_number
    
    encoded_message = quote(message)
    return f"{WHATSAPP_API_URL}?phone={phone_number.replace('+', '')}&text={encoded_message}"


def get_whatsapp_history(limit: int = 100) -> list:
    """Get WhatsApp message history"""
    log = load_whatsapp_log()
    messages = list(log.values())
    return sorted(messages, key=lambda x: x["sent_at"], reverse=True)[:limit]


def get_whatsapp_stats() -> Dict:
    """Get WhatsApp statistics"""
    log = load_whatsapp_log()
    
    stats = {
        "total_messages": len(log),
        "by_type": {},
        "by_phone": {}
    }
    
    for msg in log.values():
        msg_type = msg.get("type", "unknown")
        phone = msg.get("phone", "unknown")
        
        stats["by_type"][msg_type] = stats["by_type"].get(msg_type, 0) + 1
        stats["by_phone"][phone] = stats["by_phone"].get(phone, 0) + 1
    
    return stats


if __name__ == "__main__":
    # Test
    result = send_lead_notification(
        "Raj Kumar",
        "9876543210",
        "raj@example.com",
        "Need logo design"
    )
    print(json.dumps(result, indent=2))
