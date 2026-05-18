"""
Intent Router - Deterministic Intent Detection
Routes user messages to appropriate handlers WITHOUT LLM
"""

import re
from typing import Optional, Tuple
from service_extractor import extract_quote_services


def _extract_quote_services(msg: str) -> list:
    """Extract quote services from free text with ecommerce priority."""
    return extract_quote_services(msg)


def detect_intent(message: str, session: dict = None) -> Tuple[str, dict]:
    """
    Detect user intent deterministically
    
    Returns:
        (intent, extracted_data)
    """
    msg = message.lower().strip()
    extracted = {}
    
    # ========================================================================
    # PRIORITY 1: URL Detection (SEO Audit)
    # ========================================================================
    url_pattern = r'https?://[^\s]+'
    urls = re.findall(url_pattern, message)
    
    if urls or any(k in msg for k in ["seo audit", "audit my site", "check my seo", "analyze my site"]):
        if urls:
            extracted["url"] = urls[0]
            return "seo_audit_execute", extracted
        else:
            return "seo_audit_ask_url", extracted
    
    # ========================================================================
    # PRIORITY 2: Meeting/Call Request
    # ========================================================================
    meeting_keywords = [
        "schedule meeting", "book call", "schedule call", "meeting",
        "talk to someone", "speak with", "consultation", "demo",
        "schedule a call", "book a meeting", "arrange call"
    ]
    
    if any(k in msg for k in meeting_keywords):
        return "schedule_meeting", extracted
    
    # ========================================================================
    # PRIORITY 3: Quote/Pricing Request
    # ========================================================================
    quote_keywords = [
        "quote", "pricing", "how much", "cost", "price",
        "budget", "estimate", "quotation"
    ]
    
    if any(k in msg for k in quote_keywords):
        # Check if services mentioned
        services = _extract_quote_services(msg)
        
        if services:
            extracted["services"] = ",".join(services)
            return "quote_execute", extracted
        else:
            return "quote_ask_services", extracted
    
    # ========================================================================
    # PRIORITY 4: Image Generation
    # ========================================================================
    image_keywords = [
        "generate image", "create image", "make image",
        "generate picture", "create picture", "design image",
        "generate hero", "create banner", "make graphic"
    ]
    
    if any(k in msg for k in image_keywords):
        # Extract prompt (everything after the command)
        prompt = message
        for keyword in image_keywords:
            if keyword in msg:
                parts = message.split(keyword, 1)
                if len(parts) > 1 and parts[1].strip():
                    prompt = parts[1].strip()
                    break
        
        if len(prompt) > 10:
            extracted["prompt"] = prompt
            return "image_execute", extracted
        else:
            return "image_ask_prompt", extracted
    
    # ========================================================================
    # PRIORITY 5: Lead Capture (Contact Info)
    # ========================================================================
    # Check if message contains email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, message)
    
    if emails:
        extracted["email"] = emails[0]
        # Try to extract name (words before email or capitalized words)
        words = message.split()
        name_candidates = [w for w in words if w[0].isupper() and '@' not in w]
        if name_candidates:
            extracted["name"] = " ".join(name_candidates[:2])
        return "capture_lead", extracted
    
    # ========================================================================
    # PRIORITY 6: Yes/No/Confirmation
    # ========================================================================
    if msg in ["yes", "yeah", "yep", "sure", "ok", "okay", "y"]:
        return "confirm_yes", extracted
    
    if msg in ["no", "nope", "nah", "n"]:
        return "confirm_no", extracted
    
    # ========================================================================
    # PRIORITY 7: Greeting
    # ========================================================================
    greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]
    if msg in greetings or msg.startswith(tuple(greetings)):
        return "greeting", extracted
    
    # ========================================================================
    # DEFAULT: Open Chat (use LLM)
    # ========================================================================
    return "chat", extracted


def get_next_question(session: dict) -> Optional[str]:
    """
    Get next qualifying question based on session state
    Returns None if enough info collected
    """
    # Check what info is missing
    if not session.get("business_type"):
        return "What type of business do you run?"
    
    if not session.get("services_interested"):
        return "What services are you interested in? (Website, E-commerce, SEO, Design)"
    
    if not session.get("timeline"):
        return "What's your expected timeline?"
    
    if not session.get("budget_range"):
        return "What's your budget range?"
    
    # All info collected
    return None


def extract_business_info(message: str) -> dict:
    """Extract business information from message"""
    msg = message.lower()
    extracted = {}
    
    # Business types
    business_types = {
        "restaurant": ["restaurant", "cafe", "food", "dining"],
        "ecommerce": ["ecommerce", "e-commerce", "online store", "shop"],
        "saas": ["saas", "software", "app", "platform"],
        "agency": ["agency", "consulting", "services"],
        "local": ["local business", "small business"]
    }
    
    for biz_type, keywords in business_types.items():
        if any(k in msg for k in keywords):
            extracted["business_type"] = biz_type
            break
    
    # Timeline
    if "urgent" in msg or "asap" in msg or "immediately" in msg:
        extracted["timeline"] = "urgent"
    elif "month" in msg:
        extracted["timeline"] = "1-2 months"
    elif "week" in msg:
        extracted["timeline"] = "2-4 weeks"
    
    # Budget (rough extraction)
    numbers = re.findall(r'\d+', msg)
    if numbers and any(k in msg for k in ["budget", "rupees", "₹", "rs"]):
        extracted["budget_range"] = f"₹{numbers[0]}"
    
    return extracted


print("✅ Intent Router Loaded")
print("   - Deterministic intent detection")
print("   - No LLM for routing")
print("   - 7 priority intents")
print("   - Pattern-based extraction")
