"""
Gemini Intent Detector - Separate intent detection layer
Prevents sales-heavy responses and enables proper tool routing
"""

import os
import json
import re
from pathlib import Path
from dotenv import load_dotenv

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

load_dotenv(Path(__file__).parent / ".env")

# Initialize providers
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-pro")
GROQ_KEY = os.environ.get("GROQ_API_KEY")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")

if GEMINI_AVAILABLE and GEMINI_KEY:
    intent_model = create_gemini_model(GEMINI_KEY, GEMINI_MODEL)
else:
    intent_model = None

if GROQ_AVAILABLE and GROQ_KEY:
    groq_client = Groq(api_key=GROQ_KEY)
else:
    groq_client = None

VALID_INTENTS = [
    "seo_audit", "image_generation", "landing_page_demo",
    "pricing_query", "consultation_booking", "quote_request",
    "general_question", "greeting", "help",
    "confirmation_yes", "confirmation_no",
]

INTENT_DETECTION_PROMPT = """
Classify the user's message into ONE of the following intents:

Intents:
- seo_audit: User wants SEO analysis, website audit, performance check
- image_generation: User wants to generate image, logo, design, mockup
- landing_page_demo: User wants to see demo, example, landing page, website preview
- pricing_query: User asks about cost, price, packages, budget, how much
- consultation_booking: User wants to schedule meeting, book call, consultation
- quote_request: User wants project quote, estimate, proposal
- general_question: General questions about services, technology, company
- greeting: Hello, hi, hey, greetings
- help: User needs help, confused, doesn't understand
- confirmation_yes: User says yes, haan, okay, sure, proceed
- confirmation_no: User says no, nahi, cancel, stop

Priority rules (VERY IMPORTANT):
1) If message asks for landing page, website demo, static preview, mockup, "dikhaiye", "create page", classify as landing_page_demo.
2) If message asks to generate design/image/mockup/banner/logo, classify as image_generation.
3) Do NOT classify landing page demo requests as quote_request unless user explicitly asks cost/price/quote.

CRITICAL: Respond ONLY in valid JSON. No markdown. No explanation. No extra text.

User message: {message}

Return format (STRICT):
{{"intent": "intent_name", "confidence": 0.95, "extracted_data": {{}}}}
"""

SYSTEM_PROMPT = """
You are Vibha Prints' senior website chat assistant.

Company:
- Vibha Prints / Vibha Art
- Contact: info@vibhaprints.com, +91 86249 48046, https://www.vibhaprints.com/
- Main work: graphic design, branding, printing, web design/development and digital marketing.

Language rules:
- Default reply in natural Hinglish using Roman script.
- Do not use Devanagari unless user explicitly asks.
- If user writes in English, reply in simple professional English.

Services:
- Logo design and brand identity
- Business card design and printing
- Brochure, booklet, pamphlet, flyer, poster, catalog and company profile
- Product packaging, labels, stickers, hangtags and lanyards
- Corporate stationery and branding collaterals
- Flex, vinyl, banner and large-format printing
- Bags, T-shirts and merchandise printing
- Social media creatives, website design/development, landing pages, ecommerce
- SEO, paid ads, email marketing and digital marketing support

Pricing rules:
- Give estimates only, never fake exact pricing.
- Logo design: Rs 5,000-15,000+ depending on concepts/revisions.
- Business cards: Rs 2,000-5,000+ depending on design, paper, finish and quantity.
- Brochures/pamphlets: Rs 3,000-10,000+ depending on pages/design/print quantity.
- Printing, packaging, websites and digital marketing require specs before final quote.

Response rules:
1. Answer the user question first.
2. Then ask the next useful question or suggest WhatsApp/call/contact form.
3. Ask maximum 2 questions at a time.
4. Keep response concise: 3-6 short sentences or bullets.
5. Never invent delivery dates, discounts, stock, guarantees or client names.
6. For quote requests, ask for item type, size, quantity, material/paper, finish, delivery city and deadline.
7. If out of scope, politely redirect to design/printing/web/digital marketing help.
8. Be helpful and professional, not pushy.
"""


def safe_json_parse(json_string: str):
    """Safe JSON parser with error handling."""
    try:
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return None


def _normalize_intent_result(result: dict) -> dict:
    if not isinstance(result, dict):
        result = {}
    if result.get("intent") not in VALID_INTENTS:
        result["intent"] = "general_question"
    result.setdefault("confidence", 0.8)
    result.setdefault("extracted_data", {})
    return result


def detect_intent_with_groq(message: str) -> dict:
    """Fallback intent detection using Groq when Gemini is unavailable/quota-limited."""
    if not groq_client:
        return {"intent": "general_question", "confidence": 0.5, "extracted_data": {}}

    prompt = INTENT_DETECTION_PROMPT.format(message=message)
    completion = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        temperature=0.2,
        max_tokens=220,
        messages=[
            {"role": "system", "content": "Return strict JSON only."},
            {"role": "user", "content": prompt},
        ],
    )

    text = (completion.choices[0].message.content or "").strip()
    parsed = safe_json_parse(text)
    if not parsed:
        intent_match = re.search(r'"intent"\s*:\s*"([^"]+)"', text)
        if intent_match:
            parsed = {
                "intent": intent_match.group(1),
                "confidence": 0.7,
                "extracted_data": {},
            }
        else:
            parsed = {"intent": "general_question", "confidence": 0.5, "extracted_data": {}}
    return _normalize_intent_result(parsed)


def detect_intent_with_gemini(message: str) -> dict:
    """
    Use Gemini to detect user intent with strict JSON mode.
    Gemini failure/quota immediately falls back to Groq.
    """
    msg = (message or "").lower()
    landing_keywords = [
        "landing page", "landing pag", "website demo", "website preview",
        "static landing", "mockup", "dikhaiye", "create page", "demo page"
    ]
    pricing_keywords = ["price", "pricing", "quote", "cost", "budget", "how much"]
    service_only_keywords = [
        "digital marketing", "marketing", "seo", "website development",
        "web development", "ecommerce", "e-commerce", "ui ux", "ui/ux",
        "design", "automation", "ai solutions"
    ]
    image_keywords = ["generate image", "create image", "image", "banner", "logo", "mockup design"]
    seo_keywords = ["seo", "audit", "analyze my site", "website audit", "site performance"]
    consultation_keywords = ["book call", "consultation", "schedule meeting", "schedule call", "meeting"]
    greeting_keywords = ["hi", "hello", "hey", "namaste"]
    help_keywords = ["help", "madad", "assist"]

    # Deterministic high-signal routing
    url_match = re.search(r"https?://[^\s]+", message or "", re.IGNORECASE)
    bare_domain_match = re.search(r"\b(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:/[^\s]*)?\b", message or "", re.IGNORECASE)
    if url_match:
        return {"intent": "seo_audit", "confidence": 0.99, "extracted_data": {"url": url_match.group(0)}}
    if bare_domain_match and any(k in msg for k in ["seo", "audit", "analyze", "test"]):
        domain = bare_domain_match.group(0)
        if not domain.startswith(("http://", "https://")):
            domain = f"https://{domain}"
        return {"intent": "seo_audit", "confidence": 0.96, "extracted_data": {"url": domain}}

    if any(k in msg for k in landing_keywords) and not any(k in msg for k in pricing_keywords):
        return {"intent": "landing_page_demo", "confidence": 0.98, "extracted_data": {}}
    if any(k in msg for k in image_keywords) and not any(k in msg for k in pricing_keywords):
        return {"intent": "image_generation", "confidence": 0.95, "extracted_data": {}}
    if any(k in msg for k in seo_keywords):
        return {"intent": "seo_audit", "confidence": 0.95, "extracted_data": {}}
    if any(k in msg for k in consultation_keywords):
        return {"intent": "consultation_booking", "confidence": 0.95, "extracted_data": {}}
    if any(k in msg for k in pricing_keywords):
        return {"intent": "quote_request", "confidence": 0.9, "extracted_data": {}}

    # Service-only short messages should go to quote flow directly.
    if any(k in msg for k in service_only_keywords) and len(msg.split()) <= 6:
        return {"intent": "quote_request", "confidence": 0.9, "extracted_data": {}}
    if msg.strip() in greeting_keywords:
        return {"intent": "greeting", "confidence": 0.95, "extracted_data": {}}
    if any(k in msg for k in help_keywords):
        return {"intent": "help", "confidence": 0.9, "extracted_data": {}}

    if not intent_model:
        if groq_client:
            return detect_intent_with_groq(message)
        return {"intent": "general_question", "confidence": 0.5, "extracted_data": {}}

    try:
        generation_config = {
            "temperature": 0.3,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 200,
        }

        prompt = INTENT_DETECTION_PROMPT.format(message=message)
        response = intent_model.generate_content(prompt, generation_config=generation_config)
        text = (response.text or "").strip()

        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        result = safe_json_parse(text)
        if not result:
            retry_prompt = f"Fix this to valid JSON only:\n{text}"
            retry_response = intent_model.generate_content(retry_prompt)
            result = safe_json_parse((retry_response.text or "").strip())

        if not result:
            intent_match = re.search(r'"intent"\s*:\s*"([^"]+)"', text)
            if intent_match:
                result = {"intent": intent_match.group(1), "confidence": 0.7, "extracted_data": {}}
            else:
                raise ValueError("Could not parse intent from response")

        return _normalize_intent_result(result)

    except Exception as e:
        print(f"Intent detection error: {e}")
        if groq_client:
            try:
                return detect_intent_with_groq(message)
            except Exception as ge:
                print(f"Groq intent fallback failed: {ge}")

        url_fallback = re.search(r"https?://[^\s]+", message or "", re.IGNORECASE)
        if url_fallback:
            return {"intent": "seo_audit", "confidence": 0.9, "extracted_data": {"url": url_fallback.group(0)}}
        return {"intent": "general_question", "confidence": 0.5, "extracted_data": {}}


def generate_response_with_groq(message: str, history: list, intent: str, system_prompt: str | None = None) -> str:
    """Fallback response generation using Groq when Gemini is unavailable/quota-limited."""
    if not groq_client:
        return "I'm here to help! How can I assist you today?"

    history_text = ""
    for msg in history[-5:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        history_text += f"{role}: {content}\n"

    user_prompt = f"{history_text}\n[User Intent: {intent}]\n{message}"

    completion = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        temperature=0.3,
        max_tokens=300,
        messages=[
            {"role": "system", "content": system_prompt or SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )
    return (completion.choices[0].message.content or "").strip() or "I'm here to help!"


def generate_response_with_gemini(message: str, history: list, intent: str, system_prompt: str | None = None) -> str:
    """
    Generate contextual response using Gemini with intent awareness.
    Gemini failure/quota immediately falls back to Groq.
    """
    response_model = intent_model
    if GEMINI_AVAILABLE and GEMINI_KEY and system_prompt:
        response_model = create_gemini_model(GEMINI_KEY, GEMINI_MODEL, system_instruction=system_prompt) or intent_model

    if not response_model:
        if groq_client:
            return generate_response_with_groq(message, history, intent, system_prompt)
        return "I'm here to help! How can I assist you today?"

    try:
        generation_config = {
            "temperature": 0.3,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 300,
        }

        conversation_parts = []

        for msg in history[-5:]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "assistant":
                role = "model"
            elif role != "user":
                role = "user"
            conversation_parts.append({"role": role, "parts": [content]})

        intent_context = f"[User Intent: {intent}]\n{message}"
        chat = response_model.start_chat(history=conversation_parts)
        response = chat.send_message(intent_context, generation_config=generation_config)
        return (response.text or "").strip()

    except Exception as e:
        print(f"Response generation error: {e}")
        if groq_client:
            try:
                return generate_response_with_groq(message, history, intent, system_prompt)
            except Exception as ge:
                print(f"Groq response fallback error: {ge}")

        err = str(e).lower()
        if "quota" in err or "rate limit" in err or "429" in err:
            return "System busy hai, please 5 seconds baad retry karein."
        if "timeout" in err:
            return "Response generate ho rahi hai, thoda wait karein..."
        return "Temporary issue. Please try again or rephrase your question."


def generate_image_prompt(user_message: str) -> str:
    """Generate detailed image generation prompt from user request."""
    user_message = (user_message or "").strip()

    # Deterministic prompt for landing page style requests.
    landing_signal = re.search(r"(landing\s*page|website\s*preview|website\s*demo|static\s*landing)", user_message, re.IGNORECASE)
    if landing_signal:
        msg = user_message.lower()
        product_domain = "general ecommerce products"
        color_direction = "modern neutral palette"
        hero_elements = "product showcase, trust badges, offer banner, testimonials"

        if re.search(r"(nursery|nursory|plant|garden|gardening|sapling|indoor plants?)", msg):
            product_domain = "nursery and indoor plants"
            color_direction = "green, earthy, natural tones"
            hero_elements = "plant categories, best sellers, care guides, delivery highlights"
        elif re.search(r"(beauty|skincare|cosmetic|makeup)", msg):
            product_domain = "beauty and skincare products"
            color_direction = "soft pastel beauty brand colors"
            hero_elements = "before/after highlights, ingredients, social proof, offers"
        elif re.search(r"(fashion|clothing|apparel)", msg):
            product_domain = "fashion products"
            color_direction = "clean editorial palette"
            hero_elements = "new arrivals, category cards, size highlights, discount strip"

        return (
            f"A modern, clean, premium ecommerce landing page UI mockup for {product_domain}, "
            f"hero section with {hero_elements}, clear call-to-action buttons, sticky top navigation, "
            "featured products grid, category cards, customer reviews, FAQ snippet, and footer with contact details, "
            f"mobile-first responsive layout, {color_direction}, professional web design, high conversion focused."
        )

    prompt = f"""
Create a detailed AI image generation prompt for:
"{user_message}"

Requirements:
- Style: modern, clean, premium, professional
- Format: landing page UI mockup or design element
- Include: colors, layout, mood, specific elements
- Make it detailed and specific

Return ONLY the image generation prompt (no explanations).
"""

    if intent_model:
        try:
            response = intent_model.generate_content(prompt)
            return (response.text or "").strip() or user_message
        except Exception as e:
            print(f"Image prompt generation error (Gemini): {e}")

    if groq_client:
        try:
            resp = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                temperature=0.5,
                max_tokens=260,
                messages=[{"role": "user", "content": prompt}],
            )
            return (resp.choices[0].message.content or "").strip() or user_message
        except Exception as e:
            print(f"Image prompt generation error (Groq): {e}")

    return user_message


# Test function
if __name__ == "__main__":
    test_messages = [
        "Hello! What services do you offer?",
        "Can you analyze my website SEO?",
        "Generate a landing page for my startup",
        "How much does an e-commerce website cost?",
        "I want to schedule a consultation",
    ]

    print("Testing Gemini Intent Detector\n")

    for msg in test_messages:
        print(f"Message: {msg}")
        result = detect_intent_with_gemini(msg)
        print(f"Intent: {result['intent']} (confidence: {result['confidence']})")
        print()
