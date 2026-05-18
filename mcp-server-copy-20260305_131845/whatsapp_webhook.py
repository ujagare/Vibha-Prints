"""
WhatsApp Webhook Handler
Receives incoming messages from Twilio and sends AI-powered replies
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")

app = Flask(__name__)

# AI clients
groq_client = None
gemini_client = None

if GROQ_AVAILABLE and os.environ.get("GROQ_API_KEY"):
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
if GEMINI_AVAILABLE and os.environ.get("GEMINI_API_KEY"):
    gemini_client = create_gemini_model(
        os.environ.get("GEMINI_API_KEY"),
        os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    )


def generate_ai_reply(customer_message, customer_phone):
    """Generate AI-powered reply based on customer message"""
    
    # Service detection
    services_mentioned = []
    msg_lower = customer_message.lower()
    
    if any(word in msg_lower for word in ["website", "web", "site", "static"]):
        services_mentioned.append("Website Development")
    if any(word in msg_lower for word in ["ecommerce", "e-commerce", "shop", "store"]):
        services_mentioned.append("E-commerce")
    if any(word in msg_lower for word in ["seo", "ranking", "google"]):
        services_mentioned.append("SEO")
    if any(word in msg_lower for word in ["design", "ui", "ux", "logo"]):
        services_mentioned.append("Design")
    
    # Generate contextual prompt
    prompt = f"""
You are CodeSunny's WhatsApp assistant. A customer sent this message:

"{customer_message}"

Services they might be interested in: {', '.join(services_mentioned) if services_mentioned else 'General inquiry'}

Generate a helpful, professional reply (max 100 words) that:
1. Acknowledges their specific request
2. Provides relevant information
3. Asks 1-2 clarifying questions
4. Includes contact: information@codesunny.in or +91 89758075789

Be conversational and helpful. Return only the reply text.
""".strip()

    try:
        if groq_client:
            resp = groq_client.chat.completions.create(
                model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                temperature=0.6,
                max_tokens=150,
                messages=[
                    {"role": "system", "content": "You are a helpful WhatsApp assistant for CodeSunny."},
                    {"role": "user", "content": prompt}
                ]
            )
            return resp.choices[0].message.content.strip()
        elif gemini_client:
            resp = gemini_client.generate_content(prompt)
            return resp.text.strip()
        else:
            # Fallback response
            if services_mentioned:
                return f"Thank you for your interest in {', '.join(services_mentioned)}! I'd love to help. Could you share more details about your requirements? Call us: +91 89758075789 or email: information@codesunny.in"
            else:
                return "Thank you for contacting CodeSunny! How can we help you today? We offer Web Development, E-commerce, SEO, and Design services. Call: +91 89758075789"
    except Exception as e:
        print(f"AI error: {e}")
        return "Thank you for your message! Our team will respond shortly. For urgent queries: +91 89758075789 or information@codesunny.in"


@app.route("/whatsapp", methods=['POST'])
def whatsapp_webhook():
    """Handle incoming WhatsApp messages"""
    
    # Get message details
    incoming_msg = request.values.get('Body', '').strip()
    sender = request.values.get('From', '')
    
    print(f"\n📨 Incoming message from {sender}: {incoming_msg}")
    
    # Generate AI reply
    reply_text = generate_ai_reply(incoming_msg, sender)
    
    print(f"🤖 AI Reply: {reply_text}\n")
    
    # Create Twilio response
    resp = MessagingResponse()
    resp.message(reply_text)
    
    return str(resp)


@app.route("/health", methods=['GET'])
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "whatsapp-webhook"}


if __name__ == "__main__":
    port = int(os.environ.get("WEBHOOK_PORT", 5001))
    print(f"\n🚀 WhatsApp Webhook Server Starting...")
    print(f"📡 Listening on port {port}")
    print(f"🔗 Webhook URL: http://localhost:{port}/whatsapp")
    print(f"\nTo expose publicly, use ngrok:")
    print(f"  ngrok http {port}")
    print(f"\nThen configure Twilio webhook with ngrok URL\n")
    
    app.run(host='0.0.0.0', port=port, debug=True)
