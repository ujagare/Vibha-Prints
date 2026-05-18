"""
Professional Error Handler
Provides user-friendly error messages and proper logging
"""

import json
import traceback
from datetime import datetime


class ChatbotError(Exception):
    """Base exception for chatbot errors"""
    pass


class APIError(ChatbotError):
    """API related errors"""
    pass


class TimeoutError(ChatbotError):
    """Timeout errors"""
    pass


class ParseError(ChatbotError):
    """JSON parsing errors"""
    pass


def log_error(error_type: str, error: Exception, context: dict = None):
    """
    Log error with context for debugging
    """
    timestamp = datetime.utcnow().isoformat()
    
    error_log = {
        "timestamp": timestamp,
        "type": error_type,
        "error": str(error),
        "traceback": traceback.format_exc(),
        "context": context or {}
    }
    
    print(f"\n{'='*60}")
    print(f"❌ ERROR LOG - {timestamp}")
    print(f"{'='*60}")
    print(f"Type: {error_type}")
    print(f"Error: {error}")
    if context:
        print(f"Context: {json.dumps(context, indent=2)}")
    print(f"{'='*60}\n")
    
    return error_log


def get_user_friendly_message(error: Exception, language: str = "english") -> str:
    """
    Convert technical error to user-friendly message
    Supports Hindi, Hinglish, and English
    """
    error_str = str(error).lower()
    
    # Timeout errors
    if "timeout" in error_str or isinstance(error, TimeoutError):
        if language == "hindi":
            return "⏳ Response generate ho rahi hai, thoda wait karein... Kripya 10 seconds baad retry karein."
        elif language == "hinglish":
            return "⏳ Response generate ho rahi hai, please thoda wait karein... 10 seconds baad retry karein."
        else:
            return "⏳ Processing is taking longer than expected. Please try again in 10 seconds."
    
    # Rate limit / Quota errors
    elif "quota" in error_str or "rate limit" in error_str:
        if language == "hindi":
            return "⚠️ System busy hai abhi. Kripya 5 seconds baad retry karein."
        elif language == "hinglish":
            return "⚠️ System busy hai right now. Please 5 seconds baad retry karein."
        else:
            return "⚠️ System is busy. Please try again in 5 seconds."
    
    # API errors
    elif "api" in error_str or isinstance(error, APIError):
        if language == "hindi":
            return "🔧 Temporary technical issue hai. Kripya thodi der baad try karein."
        elif language == "hinglish":
            return "🔧 Temporary technical issue hai. Please thodi der baad try karein."
        else:
            return "🔧 Temporary technical issue. Please try again shortly."
    
    # JSON parsing errors
    elif "json" in error_str or isinstance(error, ParseError):
        if language == "hindi":
            return "🔄 Response process ho rahi hai... Kripya apna message dobara bhejein."
        elif language == "hinglish":
            return "🔄 Response process ho rahi hai... Please apna message dobara send karein."
        else:
            return "🔄 Processing your request... Please send your message again."
    
    # Network errors
    elif "connection" in error_str or "network" in error_str:
        if language == "hindi":
            return "🌐 Connection issue hai. Kripya apna internet check karein aur retry karein."
        elif language == "hinglish":
            return "🌐 Connection issue hai. Please apna internet check karein aur retry karein."
        else:
            return "🌐 Connection issue. Please check your internet and try again."
    
    # Generic error
    else:
        if language == "hindi":
            return "❓ Kripya apna message thoda alag tarike se likhein ya phir se try karein."
        elif language == "hinglish":
            return "❓ Please apna message thoda differently likhein ya phir se try karein."
        else:
            return "❓ Could you rephrase your message or try again?"


def detect_language(message: str) -> str:
    """
    Detect language from message for appropriate error response
    """
    msg_lower = message.lower()
    
    hindi_words = ['namaste', 'kya', 'hai', 'mujhe', 'chahiye', 'kaise', 'aap', 'kripya', 'zaroor']
    hinglish_indicators = ['kya', 'hai', 'mujhe'] and ['hello', 'hi', 'website', 'help']
    
    if any(word in msg_lower for word in hindi_words):
        if any(word in msg_lower for word in ['hello', 'hi', 'website', 'help', 'please']):
            return "hinglish"
        return "hindi"
    
    return "english"


def handle_error(error: Exception, context: dict = None, user_message: str = "") -> dict:
    """
    Main error handler - logs error and returns user-friendly response
    
    Args:
        error: The exception that occurred
        context: Additional context for debugging
        user_message: Original user message for language detection
    
    Returns:
        dict with user-friendly error message
    """
    # Log error for debugging
    error_type = type(error).__name__
    log_error(error_type, error, context)
    
    # Detect language
    language = detect_language(user_message) if user_message else "english"
    
    # Get user-friendly message
    friendly_message = get_user_friendly_message(error, language)
    
    return {
        "reply": friendly_message,
        "error": True,
        "error_type": error_type,
        "timestamp": datetime.utcnow().isoformat()
    }


# Test function
if __name__ == "__main__":
    print("🧪 Testing Error Handler\n")
    
    test_cases = [
        (TimeoutError("Request timeout"), "hello"),
        (APIError("API quota exceeded"), "namaste"),
        (ParseError("Invalid JSON"), "hey, mujhe help chahiye"),
        (Exception("Connection refused"), "what services do you offer?")
    ]
    
    for error, message in test_cases:
        print(f"Message: {message}")
        result = handle_error(error, {"test": True}, message)
        print(f"Response: {result['reply']}")
        print()
