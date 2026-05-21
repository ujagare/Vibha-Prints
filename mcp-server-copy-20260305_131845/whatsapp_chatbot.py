"""
WhatsApp AI Chatbot - Real human-like conversations
Features:
- AI-powered responses using Groq/Gemini
- Conversation history tracking
- Context-aware replies
- Natural language understanding
- Lead qualification
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from typing import Dict, Optional, List

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("whatsapp_chatbot")

# AI Configuration
groq_client = None
gemini_client = None

if GROQ_AVAILABLE and os.environ.get("GROQ_API_KEY"):
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

if GEMINI_AVAILABLE and os.environ.get("GEMINI_API_KEY"):
    gemini_client = create_gemini_model(
        os.environ.get("GEMINI_API_KEY"),
        os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
    )

# Business info
BUSINESS_NAME = "Vibha Prints"
BUSINESS_PHONE = "+91 86249 48046"
BUSINESS_EMAIL = "info@vibhaprints.com"
BUSINESS_WEBSITE = (
    os.environ.get("BUSINESS_WEBSITE")
    or os.environ.get("VITE_APP_URL")
    or "https://www.vibhaprints.com/"
).rstrip("/")

# Data directory
DATA_DIR = Path(__file__).parent / "data"
CONVERSATIONS_DIR = DATA_DIR / "whatsapp_conversations"
CONVERSATIONS_DIR.mkdir(parents=True, exist_ok=True)

# System prompt for AI
SYSTEM_PROMPT = f"""
You are {BUSINESS_NAME}' AI sales assistant for WhatsApp.

Primary goal:
- Convert conversations into qualified project inquiries, not just reply.
- Act like a professional consultant: identify intent, recommend, qualify gently, build trust, then capture lead details gradually.

Services:
- Logo design, brand identity, company profile and corporate stationery
- Business cards, brochures, pamphlets, posters, catalogs
- Packaging, labels, stickers, hangtags, lanyards
- Digital/offset printing, flex, vinyl, banners and large-format printing
- Bags, T-shirts and merchandise printing
- Social media creatives, website design/development, landing pages, ecommerce
- SEO, paid ads, email marketing and digital marketing support

Conversation flow:
1. Identify intent naturally.
2. Recommend one useful option or package.
3. Ask only 1-2 qualification questions.
4. Build trust with process proof, such as mockup preview before printing.
5. Capture name, business type and contact details when the user is ready.

Tone rules:
- Natural friendly Hindi + English mix in Roman script by default.
- Use English if the user writes clearly in English.
- Keep every reply short for WhatsApp: 2-4 short lines.
- Do not sound like police interrogation or a menu bot.
- Avoid repeating greetings and avoid asking the same requirement again.
- Use previous conversation. If user already said "business card", ask finish/quantity next.

Smart suggestions:
- Business cards: suggest matte or soft-touch laminated finish for premium impression.
- Social media posts: suggest Instagram/Facebook monthly post packages and ask business category.
- Printing: ask item, quantity, size/finish only as needed.
- Price concern: suggest small quantity or trial order where possible.
- Objections about quality: mention mockup preview/proof before printing.
- Objections about delivery: ask deadline and city, then say team can check priority.
- High-intent signals: urgent, today, bulk, 1000+, deadline, ready artwork, order, call me. For these, suggest quick human follow-up.

Safety:
- Do not invent exact prices, delivery dates, discounts, guarantees, stock or client names.
- Give only broad estimates if useful; final quote depends on specs.
- Contact when relevant: {BUSINESS_PHONE}
- Website: {BUSINESS_WEBSITE}
- If you don't know or it is outside scope, say exactly:
  "Is baare mein main sure nahi hoon - aap seedha WhatsApp karein: {BUSINESS_PHONE}, team turant help karegi."
"""


SERVICE_PATTERNS = {
    "business_cards": ["business card", "visiting card", "name card"],
    "social_media": ["social media", "instagram", "facebook", "post", "reel", "creative"],
    "printing": ["print", "printing", "banner", "flex", "vinyl", "sticker", "brochure", "pamphlet"],
    "logo": ["logo", "brand identity", "branding"],
    "packaging": ["packaging", "package", "label", "box", "hangtag"],
    "website": ["website", "web", "ecommerce", "landing page", "seo"],
}

HIGH_INTENT_KEYWORDS = [
    "urgent",
    "today",
    "aaj",
    "asap",
    "jaldi",
    "bulk",
    "1000",
    "5000",
    "deadline",
    "ready artwork",
    "artwork ready",
    "order",
    "call me",
    "quote",
    "price",
    "pricing",
]


def _detect_service_intent(text: str) -> str:
    low = (text or "").lower()
    for service, patterns in SERVICE_PATTERNS.items():
        if any(pattern in low for pattern in patterns):
            return service
    return ""


def _detect_previous_service(conversation_history: List[Dict]) -> str:
    for msg in reversed(conversation_history or []):
        service = _detect_service_intent(msg.get("content", ""))
        if service:
            return service
    return ""


def _is_high_intent(message: str) -> bool:
    low = (message or "").lower()
    return any(keyword in low for keyword in HIGH_INTENT_KEYWORDS)


def _notify_admin_for_hot_lead(phone_number: str, user_name: str, message: str, service: str) -> bool:
    """Best-effort admin alert for urgent/high-intent WhatsApp conversations."""
    try:
        from email_lead_automation import send_hot_lead_alert

        lead_name = user_name or f"WhatsApp {phone_number}"
        alert_message = (
            f"High-intent WhatsApp lead.\n"
            f"Phone: {phone_number}\n"
            f"Service: {service or 'unknown'}\n"
            f"Message: {message}"
        )
        score_override = {
            "score": 90,
            "priority": "hot",
            "indicators": ["whatsapp_high_intent", service or "service_unknown"],
        }
        return bool(
            send_hot_lead_alert(
                lead_name,
                "",
                alert_message,
                "whatsapp",
                force_send=True,
                score_override=score_override,
            )
        )
    except Exception as exc:
        logger.warning(f"Admin hot lead alert skipped: {exc}")
        return False


def _rule_based_reply(user_message: str, conversation_history: Optional[List[Dict]] = None) -> str:
    """Useful fallback when AI providers are unavailable."""
    text = (user_message or "").lower()
    conversation_history = conversation_history or []
    service = _detect_service_intent(user_message) or _detect_previous_service(conversation_history)
    high_intent = _is_high_intent(user_message)

    if service == "business_cards":
        if high_intent:
            return (
                "Business card printing ke liye team priority check kar sakti hai.\n"
                "Matte ya soft-touch finish premium look deti hai.\n"
                "Aap quantity, city aur deadline share kar dijiye."
            )
        return (
            "Business cards ke liye matte aur soft-touch finishes kaafi premium lagti hain.\n"
            "Aapko approx kitni quantity chahiye?"
        )
    if service == "social_media":
        return (
            "Instagram aur Facebook ke liye monthly post packages available hain.\n"
            "Aap kis business category ke liye posts chahte hain?"
        )
    if service == "packaging":
        return (
            "Packaging/labels ke liye product type aur quantity se best material suggest hota hai.\n"
            "Aap product category aur approx quantity share kar dijiye."
        )
    if service == "printing":
        return (
            "Sure, printing ke liye help kar denge.\n"
            "Aap item aur approx quantity share kar dijiye.\n"
            "Mockup/proof preview bhi printing se pehle share ho sakta hai."
        )
    if service == "logo":
        return (
            "Logo design ke liye hum brand style ke hisaab se concepts bana sakte hain.\n"
            "Aapka business type kya hai?"
        )
    if service == "website":
        return (
            "Website/digital work ke liye suitable package business goal par depend karta hai.\n"
            "Aap new website chahte hain ya redesign?"
        )
    return (
        "Sure, main guide kar deta hoon.\n"
        "Aapko printing, branding, website ya digital marketing me kis type ki help chahiye?"
    )


def load_conversation(phone_number: str) -> List[Dict]:
    """Load conversation history for a phone number"""
    conv_file = CONVERSATIONS_DIR / f"{phone_number}.json"
    
    if not conv_file.exists():
        return []
    
    try:
        with open(conv_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading conversation: {e}")
        return []


def save_conversation(phone_number: str, messages: List[Dict]):
    """Save conversation history"""
    conv_file = CONVERSATIONS_DIR / f"{phone_number}.json"
    
    try:
        with open(conv_file, 'w') as f:
            json.dump(messages, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving conversation: {e}")


def add_message(phone_number: str, role: str, content: str):
    """Add message to conversation history"""
    messages = load_conversation(phone_number)
    
    messages.append({
        "role": role,
        "content": content,
        "timestamp": datetime.now().isoformat()
    })
    
    # Keep last 50 messages to avoid token limit
    if len(messages) > 50:
        messages = messages[-50:]
    
    save_conversation(phone_number, messages)


def get_ai_response(user_message: str, phone_number: str, user_name: str = "") -> Dict:
    """
    Get AI response using Groq or Gemini
    
    Args:
        user_message: User's message
        phone_number: User's phone number (for conversation history)
        user_name: User's name (optional)
    
    Returns:
        dict with response and metadata
    """
    
    logger.info(f"📱 Processing WhatsApp message from {phone_number}")
    logger.info(f"   Message: {user_message}")
    
    # Load conversation history
    conversation_history = load_conversation(phone_number)
    service_intent = _detect_service_intent(user_message) or _detect_previous_service(conversation_history)
    is_high_intent = _is_high_intent(user_message)
    admin_alert_sent = False
    if is_high_intent:
        admin_alert_sent = _notify_admin_for_hot_lead(
            phone_number,
            user_name,
            user_message,
            service_intent,
        )
    
    # Add user message to history
    add_message(phone_number, "user", user_message)
    
    # Prepare messages for AI
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]
    
    # Add conversation history (last 10 messages)
    for msg in conversation_history[-10:]:
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    
    # Add current user message
    messages.append({
        "role": "user",
        "content": user_message
    })
    
    try:
        # Try Groq first
        if groq_client:
            logger.info("🤖 Using Groq for response")
            response = groq_client.chat.completions.create(
                model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                messages=messages,
                max_tokens=220,
                temperature=0.7,
            )
            ai_response = response.choices[0].message.content.strip()
        
        # Fallback to Gemini
        elif gemini_client:
            logger.info("🤖 Using Gemini for response")
            # Format messages for Gemini
            gemini_messages = "\n".join([
                f"{msg['role'].upper()}: {msg['content']}"
                for msg in messages
            ])
            response = gemini_client.generate_content(gemini_messages)
            ai_response = response.text.strip()
        
        # Fallback response
        else:
            logger.warning("⚠️  No AI client available, using fallback")
            ai_response = _rule_based_reply(user_message, conversation_history)
        
        # Add AI response to history
        add_message(phone_number, "assistant", ai_response)
        
        logger.info(f"✅ Response generated: {ai_response[:50]}...")
        
        return {
            "success": True,
            "response": ai_response,
            "phone": phone_number,
            "name": user_name,
            "timestamp": datetime.now().isoformat(),
            "conversation_length": len(load_conversation(phone_number)),
            "service_intent": service_intent,
            "lead_priority": "hot" if is_high_intent else "normal",
            "human_handoff_recommended": is_high_intent,
            "admin_alert_sent": admin_alert_sent,
        }
    
    except Exception as e:
        logger.error(f"❌ Error generating response: {e}")
        fallback = _rule_based_reply(user_message, conversation_history)
        add_message(phone_number, "assistant", fallback)
        
        return {
            "success": False,
            "error": str(e),
            "response": fallback,
            "phone": phone_number,
            "service_intent": service_intent,
            "lead_priority": "hot" if is_high_intent else "normal",
            "human_handoff_recommended": is_high_intent,
            "admin_alert_sent": admin_alert_sent,
        }


def handle_whatsapp_message(phone_number: str, message: str, user_name: str = "") -> Dict:
    """
    Main handler for WhatsApp messages
    
    Args:
        phone_number: Sender's phone number
        message: Message text
        user_name: Sender's name (optional)
    
    Returns:
        dict with response
    """
    
    if not message or not message.strip():
        return {
            "success": False,
            "error": "Empty message"
        }
    
    # Get AI response
    result = get_ai_response(message.strip(), phone_number, user_name)
    
    return result


def get_conversation_history(phone_number: str, limit: int = 20) -> List[Dict]:
    """Get conversation history for a phone number"""
    messages = load_conversation(phone_number)
    return messages[-limit:]


def clear_conversation(phone_number: str) -> bool:
    """Clear conversation history"""
    conv_file = CONVERSATIONS_DIR / f"{phone_number}.json"
    
    try:
        if conv_file.exists():
            conv_file.unlink()
        logger.info(f"✅ Conversation cleared for {phone_number}")
        return True
    except Exception as e:
        logger.error(f"Error clearing conversation: {e}")
        return False


def get_all_conversations() -> Dict:
    """Get all active conversations"""
    conversations = {}
    
    try:
        for conv_file in CONVERSATIONS_DIR.glob("*.json"):
            phone = conv_file.stem
            messages = load_conversation(phone)
            
            if messages:
                conversations[phone] = {
                    "message_count": len(messages),
                    "last_message": messages[-1]["content"][:50],
                    "last_timestamp": messages[-1]["timestamp"],
                    "first_message": messages[0]["content"][:50]
                }
    
    except Exception as e:
        logger.error(f"Error getting conversations: {e}")
    
    return conversations


def get_conversation_stats() -> Dict:
    """Get statistics about all conversations"""
    conversations = get_all_conversations()
    
    stats = {
        "total_conversations": len(conversations),
        "total_messages": sum(c["message_count"] for c in conversations.values()),
        "conversations": conversations
    }
    
    return stats


if __name__ == "__main__":
    # Test
    result = handle_whatsapp_message(
        "9876543210",
        "Hi! I need a logo design for my startup. What's your pricing?",
        "Raj Kumar"
    )
    print(json.dumps(result, indent=2))
    
    # Get history
    history = get_conversation_history("9876543210")
    print("\nConversation History:")
    for msg in history:
        print(f"{msg['role'].upper()}: {msg['content']}")
