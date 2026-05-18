"""
Gemini Chat Handler - Improved architecture with intent-based routing
Prevents sales-heavy responses and enables proper tool execution
Professional error handling and user-friendly messages
"""

import json
import re
from service_extractor import extract_quote_services
from gemini_intent_detector import (
    detect_intent_with_gemini,
    generate_response_with_gemini,
    generate_image_prompt
)
from error_handler import handle_error, detect_language
from session_manager import update_session
from system_prompts import build_sales_system_prompt


def _extract_design_brief(message: str, existing: dict | None = None) -> dict:
    """Extract reusable design brief fields from free-form user text."""
    text = (message or "").strip()
    low = text.lower()
    brief = dict(existing or {})

    # Product / niche extraction (simple and robust)
    product_patterns = [
        r"(?:my|mera|meri)\s+product(?:\s+is|\s*[:\-])?\s+([a-z0-9\s&,\-]+)",
        r"(?:for|ke liye)\s+([a-z0-9\s&,\-]+)\s+(?:product|products|store|website)",
    ]
    for p in product_patterns:
        m = re.search(p, low, re.IGNORECASE)
        if m and m.group(1).strip():
            brief["product_focus"] = m.group(1).strip()
            break

    # Industry inference
    if re.search(r"(nursery|nursory|plant|garden|gardening|sapling|indoor plant)", low):
        brief["industry"] = "nursery and plants"
        brief["color_direction"] = "green, earthy, natural tones"
        brief["hero_elements"] = "plant categories, best sellers, care guides, delivery highlights"
    elif re.search(r"(beauty|skincare|cosmetic|makeup)", low):
        brief["industry"] = "beauty and skincare"
        brief["color_direction"] = "soft pastel beauty palette"
        brief["hero_elements"] = "ingredients, social proof, offers, product benefits"
    elif re.search(r"(fashion|clothing|apparel)", low):
        brief["industry"] = "fashion"
        brief["color_direction"] = "clean editorial palette"
        brief["hero_elements"] = "new arrivals, category highlights, offer strip"
    elif re.search(r"(electronics|gadgets|mobile|laptop)", low):
        brief["industry"] = "electronics"
        brief["color_direction"] = "modern high-contrast tech palette"
        brief["hero_elements"] = "feature highlights, comparisons, trust badges"

    # Target audience
    audience_patterns = [
        r"(?:target audience|audience|for)\s+(?:is|are|:)?\s*([a-z0-9\s,&\-]+)",
        r"(students?|young people|parents|professionals|homeowners|garden lovers)",
    ]
    for p in audience_patterns:
        m = re.search(p, low, re.IGNORECASE)
        if m and m.group(1).strip():
            brief["target_audience"] = m.group(1).strip()
            break

    # Page goal
    if re.search(r"(showcase|display|catalog)", low):
        brief["goal"] = "product showcase"
    elif re.search(r"(lead|enquiry|inquiry|contact|form)", low):
        brief["goal"] = "lead generation"
    elif re.search(r"(sell|sales|checkout|buy|purchase|ecommerce|e-commerce)", low):
        brief["goal"] = "ecommerce sales"

    return brief


def _build_dynamic_landing_prompt(message: str, session: dict) -> str:
    """Build a dynamic prompt from persisted brief + current message."""
    existing = session.get("design_brief", {})
    brief = _extract_design_brief(message, existing)
    session["design_brief"] = brief
    if session.get("session_id"):
        update_session(session["session_id"], "design_brief", brief)

    industry = brief.get("industry", "general ecommerce")
    product_focus = brief.get("product_focus", "store products")
    audience = brief.get("target_audience", "online shoppers")
    color_direction = brief.get("color_direction", "modern neutral palette")
    hero_elements = brief.get("hero_elements", "hero product showcase, trust badges, offer banner")
    goal = brief.get("goal", "high conversion")

    return (
        f"A modern, clean, premium ecommerce landing page UI mockup for {industry}, "
        f"focused on {product_focus}, targeting {audience}. "
        f"Primary goal: {goal}. "
        f"Include {hero_elements}, sticky navigation, featured products grid, category cards, "
        "customer reviews, FAQ snippet, and clear CTA buttons. "
        f"Use {color_direction}, mobile-first responsive layout, and professional conversion-focused design."
    )


def handle_chat_with_gemini(message: str, session: dict) -> dict:
    """
    Main chat handler with intent detection and tool routing
    Professional error handling with user-friendly messages
    
    Architecture:
    1. Detect intent using Gemini
    2. Route to appropriate tool/handler
    3. Generate final response with context
    4. Handle errors gracefully
    
    Returns: {
        "reply": "response text",
        "intent": "detected_intent",
        "action": "tool_to_execute",
        "data": {},
        "error": False
    }
    """
    
    try:
        # Keep evolving client brief in session for multi-turn personalization.
        current_brief = _extract_design_brief(message, session.get("design_brief", {}))
        if current_brief != session.get("design_brief", {}):
            session["design_brief"] = current_brief
            if session.get("session_id"):
                update_session(session["session_id"], "design_brief", current_brief)

        # Step 1: Detect Intent
        intent_result = detect_intent_with_gemini(message)
        intent = intent_result["intent"]
        confidence = intent_result.get("confidence", 0.5)
        
        print(f"Detected Intent: {intent} (confidence: {confidence})")
        
        # Step 2: Route based on intent
        response = route_intent(intent, message, session)
        
        # Add intent info to response
        response["intent"] = intent
        response["confidence"] = confidence
        response["error"] = False
        
        return response
        
    except Exception as e:
        # Professional error handling
        print(f"Chat handler error: {e}")
        return handle_error(e, {"message": message, "session": session.get("session_id")}, message)


def route_intent(intent: str, message: str, session: dict) -> dict:
    """
    Route to appropriate handler based on intent
    Handles conversation state and context
    """
    
    # Detect language
    msg_lower = message.lower()
    has_hindi_words = any(word in msg_lower for word in ['namaste', 'kya', 'hai', 'mujhe', 'chahiye', 'kaise', 'aap'])
    has_mixed_words = any(word in msg_lower for word in ['kya', 'hai', 'mujhe']) and any(word in msg_lower for word in ['hello', 'hi', 'website', 'help'])
    is_hindi = False  # Force Roman Hinglish instead of Devanagari Hindi
    is_hinglish = has_hindi_words or has_mixed_words
    client_context = session.get("client_context") or {}
    system_prompt = build_sales_system_prompt(client_context)
    
    # Handle confirmation (yes/no) based on previous context
    if intent in ["confirmation_yes", "confirmation_no"]:
        previous_stage = session.get("stage")
        
        if intent == "confirmation_yes":
            if previous_stage == "quote_presented":
                if is_hindi:
                    reply = "🎉 Bahut badhiya! Main aapke liye consultation schedule karta hoon.\n\nKaunsa date aur time best rahega?"
                elif is_hinglish:
                    reply = "🎉 Great! Main aapke liye consultation schedule karta hoon.\n\nKaunsa date aur time suit karega?"
                else:
                    reply = "🎉 Great! Let me schedule a consultation for you.\n\nWhat date and time works best?"
                
                return {"reply": reply, "action": "schedule_meeting", "data": {}}
            
            elif previous_stage == "seo_waiting_url":
                if is_hindi:
                    reply = "Kripya apni website ka URL share karein (jaise: https://example.com)"
                elif is_hinglish:
                    reply = "Please apni website ka URL share karein (e.g., https://example.com)"
                else:
                    reply = "Please share your website URL (e.g., https://example.com)"
                
                return {"reply": reply, "action": "seo_audit_ask_url", "data": {}}
            
            else:
                if is_hindi:
                    reply = "Zaroor! Main aapki kaise madad kar sakta hoon?"
                elif is_hinglish:
                    reply = "Sure! Main aapki kaise help kar sakta hoon?"
                else:
                    reply = "Sure! How can I help you?"
                
                return {"reply": reply, "action": None}
        
        else:  # confirmation_no
            if is_hindi:
                reply = "Koi baat nahi! Kya main kisi aur cheez mein madad kar sakta hoon?"
            elif is_hinglish:
                reply = "No problem! Kya main kisi aur cheez mein help kar sakta hoon?"
            else:
                reply = "No problem! Is there anything else I can help you with?"
            
            return {"reply": reply, "action": None}
    
    if intent == "greeting":
        client_name = client_context.get("client_name")
        name_prefix = f"{client_name}, " if client_name and client_name != "Client" else ""
        if is_hinglish:
            greeting_prefix = f"Namaste {name_prefix}" if name_prefix else "Namaste, "
            reply = (
                f"{greeting_prefix}main Vibha Prints se hoon.\n"
                "Design, printing, website ya digital marketing mein help kar sakta hoon.\n"
                "Aapko kis service ke liye requirement discuss karni hai?"
            )
        else:
            reply = (
                f"Hi {name_prefix}I'm from Vibha Prints.\n"
                "I can help with design, printing, websites or digital marketing.\n"
                "Which service would you like to discuss?"
            )
        return {"reply": reply, "action": None}

    # Greeting
    if intent == "greeting":
        if is_hindi:
            reply = (
                "Namaste! Main Vibha Prints ka sales assistant hoon.\n"
                "Design, printing, website aur digital marketing mein help kar sakta hoon.\n"
                "Aapko kis service ke liye requirement share karni hai?"
            )
        elif is_hinglish:
            reply = (
                "Hey! Main Vibha Prints ka sales assistant hoon.\n"
                "Design, printing, website aur digital marketing ke liye guide kar sakta hoon.\n"
                "Aapko kis cheez ki requirement hai?"
            )
        else:
            reply = (
                "Hello! I'm Vibha Prints' sales assistant.\n"
                "I can help with design, printing, websites and digital marketing.\n"
                "What requirement would you like to discuss?"
            )
        
        return {
            "reply": reply,
            "action": None
        }

    if intent == "pricing_query":
        if is_hinglish:
            reply = (
                "Pricing requirement par depend karti hai, isliye pehle scope samajhna zaroori hai.\n"
                "Please item/service type aur quantity/features share karein.\n"
                "Uske baad main aapko accurate estimate guide kar dunga."
            )
        else:
            reply = (
                "Pricing depends on the exact requirement, so I need the scope first.\n"
                "Please share the service/item type and quantity or key features.\n"
                "Then I can guide you with a proper estimate."
            )
        return {"reply": reply, "action": "quote_ask_services", "data": {}}

    if intent == "quote_request":
        services = extract_services(message)
        if services:
            service_text = ", ".join(services)
            if is_hinglish:
                reply = (
                    f"Sure, {service_text} ke liye quote prepare kar sakta hoon.\n"
                    "Please quantity/features, city aur deadline share karein.\n"
                    "Printing ho to size, material aur finish bhi bata dijiye."
                )
            else:
                reply = (
                    f"Sure, I can prepare a quote for {service_text}.\n"
                    "Please share quantity/features, city and deadline.\n"
                    "For printing, also share size, material and finish."
                )
            return {"reply": reply, "action": "quote_ask_details", "data": {"services": ",".join(services)}}

        if is_hinglish:
            reply = (
                "Sure, quote ke liye thodi details chahiye.\n"
                "Kaunsi service/item chahiye aur quantity/features kya rahenge?\n"
                "Printing ho to size, material, finish, city aur deadline bhi share karein."
            )
        else:
            reply = (
                "Sure, I can help with a quote.\n"
                "Which service/item do you need, and what quantity or features should I consider?\n"
                "For printing, please also share size, material, finish, city and deadline."
            )
        return {"reply": reply, "action": "quote_ask_services", "data": {}}

    if intent == "consultation_booking":
        if is_hinglish:
            reply = (
                "Great, consultation schedule kar dete hain.\n"
                "Team Monday-Friday 10 AM-6 PM IST aur Saturday 10 AM-2 PM IST available hai.\n"
                "Aapko kaunsa date aur time suit karega?"
            )
        else:
            reply = (
                "Great, we can schedule a consultation.\n"
                "Our team is available Monday-Friday 10 AM-6 PM IST and Saturday 10 AM-2 PM IST.\n"
                "What date and time works best?"
            )
        return {"reply": reply, "action": "schedule_meeting", "data": {}}

    if intent == "help":
        if is_hinglish:
            reply = (
                "Bilkul, main help karta hoon.\n"
                "Design, printing, website, SEO ya digital marketing mein se kis cheez par baat karni hai?\n"
                "Aap requirement bata den, main next step guide kar dunga."
            )
        else:
            reply = (
                "Sure, I can help.\n"
                "Do you want to discuss design, printing, websites, SEO or digital marketing?\n"
                "Share your requirement and I'll guide the next step."
            )
        return {"reply": reply, "action": None}
    
    # SEO Audit
    elif intent == "seo_audit":
        # Check if URL provided
        url_pattern = r'https?://[^\s]+'
        urls = re.findall(url_pattern, message)
        if not urls:
            bare_domain_pattern = r'\b(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:/[^\s]*)?\b'
            domains = re.findall(bare_domain_pattern, message, flags=re.IGNORECASE)
            if domains:
                normalized = domains[0]
                if not normalized.startswith(("http://", "https://")):
                    normalized = f"https://{normalized}"
                urls = [normalized]
        
        if urls:
            if is_hindi:
                reply = f"🔍 {urls[0]} ka analysis kar raha hoon...\n\nMain ek detailed SEO audit karunga."
            elif is_hinglish:
                reply = f"🔍 {urls[0]} ko analyze kar raha hoon...\n\nMain comprehensive SEO audit karunga."
            else:
                reply = f"🔍 Analyzing {urls[0]}...\n\nI'll perform a comprehensive SEO audit."
            
            return {
                "reply": reply,
                "action": "seo_audit",
                "data": {"url": urls[0]}
            }
        else:
            if is_hindi:
                reply = "🔍 Main aapke liye free SEO audit kar sakta hoon!\n\nKripya apni website ka URL share karein (jaise: https://example.com)"
            elif is_hinglish:
                reply = "🔍 Main aapke liye free SEO audit kar sakta hoon!\n\nPlease apni website ka URL share karein (e.g., https://example.com)"
            else:
                reply = "🔍 I can perform a free SEO audit for you!\n\nPlease share your website URL (e.g., https://example.com)"
            
            return {
                "reply": reply,
                "action": "seo_audit_ask_url",
                "data": {}
            }
    
    # Image Generation
    elif intent == "image_generation":
        # If user context hints landing page/ecommerce, use persistent dynamic brief prompt.
        if re.search(r"(landing\s*page|website|e-?commerce|store|product)", message, re.IGNORECASE):
            image_prompt = _build_dynamic_landing_prompt(message, session)
        else:
            image_prompt = generate_image_prompt(message)
        
        if is_hindi:
            reply = f"🎨 Aapke request ke basis par image generate kar raha hoon...\n\nPrompt: {image_prompt[:100]}..."
        elif is_hinglish:
            reply = f"🎨 Aapke request ke basis par image generate kar raha hoon...\n\nPrompt: {image_prompt[:100]}..."
        else:
            reply = f"🎨 Generating image based on your request...\n\nPrompt: {image_prompt[:100]}..."
        
        return {
            "reply": reply,
            "action": "generate_image",
            "data": {"prompt": image_prompt}
        }
    
    # Landing Page Demo
    elif intent == "landing_page_demo":
        demo_prompt = _build_dynamic_landing_prompt(message, session)

        if is_hindi:
            reply = "Theek hai, main aapke liye static landing page demo visual generate kar raha hoon.\n\nAapko abhi preview image dikh jayegi."
        elif is_hinglish:
            reply = "Perfect, main aapke liye static landing page demo visual generate kar raha hoon.\n\nAbhi preview image dikhata hoon."
        else:
            reply = "Great, I'm generating a static landing page demo visual for you.\n\nYou'll see the preview image now."

        return {
            "reply": reply,
            "action": "generate_image",
            "data": {"prompt": demo_prompt, "type": "landing_page"}
        }

    # Pricing Query
    elif intent == "pricing_query":
        if is_hindi:
            reply = (
                "Pricing requirement par depend karti hai, isliye final price seedha batana sahi nahi hoga.\n"
                "Please item/service, quantity/size aur deadline share karein.\n"
                "Uske basis par main accurate quote ke liye details collect kar dunga."
            )
        elif is_hinglish:
            reply = (
                "Pricing aapki exact requirement par depend karti hai.\n"
                "Please service/item, size ya quantity, finish/material aur deadline share karein.\n"
                "Phir main quote ke liye right details ready kar dunga."
            )
        else:
            reply = (
                "Pricing depends on the exact requirement.\n"
                "Please share the service/item, size or quantity, material/finish and deadline.\n"
                "Then I can collect the right details for an accurate quote."
            )
        
        return {
            "reply": reply,
            "action": "quote_ask_services",
            "data": {}
        }
    
    # Quote Request
    elif intent == "quote_request":
        # Try to extract services
        services = extract_services(message)
        
        if services:
            if is_hindi:
                reply = f"💰 Quote calculate kar raha hoon: {', '.join(services)}..."
            elif is_hinglish:
                reply = f"💰 Quote calculate kar raha hoon: {', '.join(services)}..."
            else:
                reply = f"💰 Calculating quote for: {', '.join(services)}..."
            
            return {
                "reply": reply,
                "action": "calculate_quote",
                "data": {"services": ",".join(services)}
            }
        else:
            if is_hindi:
                reply = (
                    "Zaroor, quote ke liye pehle requirement clear karte hain.\n"
                    "Kaunsi service/item chahiye aur quantity/size kya rahega?\n"
                    "Deadline aur delivery city bhi share kar dijiye."
                )
            elif is_hinglish:
                reply = (
                    "Sure, quote ke liye pehle requirement clear karte hain.\n"
                    "Kaunsi service/item chahiye aur quantity/size kya hoga?\n"
                    "Deadline aur delivery city bhi share kar dijiye."
                )
            else:
                reply = (
                    "Sure, let's clarify the requirement first.\n"
                    "Which service/item do you need, and what size or quantity?\n"
                    "Please also share the deadline and delivery city."
                )
            
            return {
                "reply": reply,
                "action": "quote_ask_services",
                "data": {}
            }
    
    # Consultation Booking
    elif intent == "consultation_booking":
        if is_hindi:
            reply = (
                "📅 Bahut badhiya! Main aapke liye consultation schedule kar sakta hoon.\n\n"
                "Hamari team available hai:\n"
                "• Monday - Friday: 10 AM - 6 PM IST\n"
                "• Saturday: 10 AM - 2 PM IST\n\n"
                "Aapko kaunsa date aur time suit karega?"
            )
        elif is_hinglish:
            reply = (
                "📅 Great! Main aapke liye consultation schedule kar sakta hoon.\n\n"
                "Hamari team available hai:\n"
                "• Monday - Friday: 10 AM - 6 PM IST\n"
                "• Saturday: 10 AM - 2 PM IST\n\n"
                "Kaunsa date aur time best rahega?"
            )
        else:
            reply = (
                "📅 Great! I'd love to schedule a consultation for you.\n\n"
                "Our team is available:\n"
                "• Monday - Friday: 10 AM - 6 PM IST\n"
                "• Saturday: 10 AM - 2 PM IST\n\n"
                "What date and time works best for you?"
            )
        
        return {
            "reply": reply,
            "action": "schedule_meeting",
            "data": {}
        }
    
    # Help
    elif intent == "help":
        if is_hindi:
            reply = (
                "Main design, printing, website aur digital marketing queries mein help kar sakta hoon.\n"
                "Quote chahiye ho to item/service, quantity/size aur deadline bhej dijiye.\n"
                "Kis requirement se start karein?"
            )
        elif is_hinglish:
            reply = (
                "Main design, printing, website aur digital marketing queries mein help kar sakta hoon.\n"
                "Quote ke liye service/item, quantity/size aur deadline share karein.\n"
                "Kis requirement se start karein?"
            )
        else:
            reply = (
                "I can help with design, printing, website and digital marketing queries.\n"
                "For a quote, share the service/item, quantity or size, and deadline.\n"
                "Which requirement should we start with?"
            )
        
        return {
            "reply": reply,
            "action": None
        }
    
    # General Question - if user is iterating design request, keep generating with saved brief.
    elif intent == "general_question":
        # Service-only follow-ups (e.g. "digital marketing") should continue quote flow.
        short_services = extract_services(message)
        if short_services and len((message or "").split()) <= 6:
            if is_hindi:
                reply = f"💰 Quote calculate kar raha hoon: {', '.join(short_services)}..."
            elif is_hinglish:
                reply = f"💰 Quote calculate kar raha hoon: {', '.join(short_services)}..."
            else:
                reply = f"💰 Calculating quote for: {', '.join(short_services)}..."
            return {
                "reply": reply,
                "action": "calculate_quote",
                "data": {"services": ",".join(short_services)},
            }

        if session.get("design_brief") and re.search(
            r"(make|show|generate|create|dikh|demo|image|landing|website|page|for)",
            message,
            re.IGNORECASE,
        ):
            image_prompt = _build_dynamic_landing_prompt(message, session)
            if is_hindi:
                reply = "Theek hai, updated requirements ke hisaab se naya ecommerce landing page demo generate kar raha hoon."
            elif is_hinglish:
                reply = "Perfect, updated requirement ke hisaab se naya ecommerce landing page demo generate kar raha hoon."
            else:
                reply = "Great, generating an updated ecommerce landing page demo based on your new requirements."
            return {
                "reply": reply,
                "action": "generate_image",
                "data": {"prompt": image_prompt, "type": "landing_page"},
            }

        history = session.get("history", [])
        reply = generate_response_with_gemini(message, history, intent, system_prompt)

        return {
            "reply": reply,
            "action": None
        }

    # General Question - Use Gemini for contextual response
    else:
        history = session.get("history", [])
        reply = generate_response_with_gemini(message, history, intent, system_prompt)
        
        return {
            "reply": reply,
            "action": None
        }


def extract_services(message: str) -> list:
    """
    Extract service types from message
    """
    return extract_quote_services(message)


# Test function
if __name__ == "__main__":
    test_cases = [
        "Hello! What can you do?",
        "Can you check my website SEO? https://example.com",
        "Generate a landing page for my coffee shop",
        "How much for an e-commerce website?",
        "I want to book a consultation"
    ]
    
    print("Testing Gemini Chat Handler\n")
    
    for msg in test_cases:
        print(f"User: {msg}")
        result = handle_chat_with_gemini(msg, {"history": []})
        print(f"Intent: {result['intent']}")
        print(f"Reply: {result['reply'][:100]}...")
        print(f"Action: {result.get('action')}")
        print()
