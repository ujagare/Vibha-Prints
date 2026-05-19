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
BUSINESS_PHONE = "+91 86259 48046"
BUSINESS_EMAIL = "info@vibhaprints.com"
BUSINESS_WEBSITE = (
    os.environ.get("BUSINESS_WEBSITE")
    or os.environ.get("VITE_APP_URL")
    or "https://vibha-prints.vercel.app"
).rstrip("/")

# Data directory
DATA_DIR = Path(__file__).parent / "data"
CONVERSATIONS_DIR = DATA_DIR / "whatsapp_conversations"
CONVERSATIONS_DIR.mkdir(parents=True, exist_ok=True)

# System prompt for AI
SYSTEM_PROMPT = f"""
You are a friendly and professional customer service representative for {BUSINESS_NAME}, 
a design and printing company.

Your responsibilities:
1. Answer customer questions about our services
2. Provide quotes and pricing information
3. Help with order inquiries
4. Provide design consultation
5. Handle complaints professionally
6. Qualify leads and understand their needs

Services offered:
- Logo Design & Branding
- Business Cards & Stationery
- Brochures & Packaging Design
- Digital & Offset Printing
- Social Media Graphics
- Website Design

Important guidelines:
- Be friendly, professional, and helpful
- Use Hinglish (mix of Hindi and English) when appropriate
- Keep responses concise (2-3 sentences max for WhatsApp)
- Ask clarifying questions to understand customer needs
- Offer solutions and next steps
- If you don't know something, offer to connect with the team
- Always include contact info when relevant: {BUSINESS_PHONE}
- Website: {BUSINESS_WEBSITE}

Remember: You're having a real conversation, not sending templates!
"""


def _rule_based_reply(user_message: str) -> str:
    """Useful fallback when AI providers are unavailable."""
    text = (user_message or "").lower()
    if any(word in text for word in ["print", "printing", "card", "brochure", "banner", "flex", "vinyl", "sticker"]):
        return (
            "Namaste! Printing ke liye zaroor help karenge. "
            "Please quantity, size, material aur delivery location share kar dijiye, "
            "hum aapko best quote bhej denge."
        )
    if any(word in text for word in ["logo", "design", "branding", "packaging"]):
        return (
            "Namaste! Design requirement ke liye please brand name, style reference, "
            "aur timeline share kar dijiye. Team aapko next steps aur quote bata degi."
        )
    if any(word in text for word in ["website", "web", "ecommerce", "seo"]):
        return (
            "Namaste! Website/digital work ke liye please project type, pages/features, "
            "aur timeline share kar dijiye. Hum suitable package suggest karenge."
        )
    return (
        "Namaste! Thanks for contacting Vibha Prints. "
        "Please apni requirement, quantity/timeline aur contact details share kar dijiye. "
        f"Urgent ho to call: {BUSINESS_PHONE}"
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
            ai_response = _rule_based_reply(user_message)
        
        # Add AI response to history
        add_message(phone_number, "assistant", ai_response)
        
        logger.info(f"✅ Response generated: {ai_response[:50]}...")
        
        return {
            "success": True,
            "response": ai_response,
            "phone": phone_number,
            "name": user_name,
            "timestamp": datetime.now().isoformat(),
            "conversation_length": len(load_conversation(phone_number))
        }
    
    except Exception as e:
        logger.error(f"❌ Error generating response: {e}")
        fallback = _rule_based_reply(user_message)
        add_message(phone_number, "assistant", fallback)
        
        return {
            "success": False,
            "error": str(e),
            "response": fallback,
            "phone": phone_number
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
