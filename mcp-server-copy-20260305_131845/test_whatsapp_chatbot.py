"""
Test script for WhatsApp AI Chatbot
Tests real conversations with AI responses
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

from whatsapp_chatbot import (
    handle_whatsapp_message,
    get_conversation_history,
    clear_conversation,
    get_all_conversations,
    get_conversation_stats,
)

def test_basic_conversation():
    """Test basic conversation"""
    print("\n" + "="*60)
    print("TEST 1: Basic Conversation")
    print("="*60)
    
    try:
        phone = "9876543210"
        name = "Raj Kumar"
        
        # Clear previous conversation
        clear_conversation(phone)
        
        # Message 1
        print("\n👤 User: Hi! I need a logo design for my startup.")
        result1 = handle_whatsapp_message(phone, "Hi! I need a logo design for my startup.", name)
        
        if result1.get("success"):
            print(f"🤖 Bot: {result1['response']}")
            print(f"✅ Message 1 sent successfully")
        else:
            print(f"❌ Error: {result1.get('error')}")
            return False
        
        # Message 2
        print("\n👤 User: What's your pricing for logo design?")
        result2 = handle_whatsapp_message(phone, "What's your pricing for logo design?", name)
        
        if result2.get("success"):
            print(f"🤖 Bot: {result2['response']}")
            print(f"✅ Message 2 sent successfully")
        else:
            print(f"❌ Error: {result2.get('error')}")
            return False
        
        # Message 3
        print("\n👤 User: How long does it take?")
        result3 = handle_whatsapp_message(phone, "How long does it take?", name)
        
        if result3.get("success"):
            print(f"🤖 Bot: {result3['response']}")
            print(f"✅ Message 3 sent successfully")
            return True
        else:
            print(f"❌ Error: {result3.get('error')}")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_conversation_history():
    """Test conversation history"""
    print("\n" + "="*60)
    print("TEST 2: Conversation History")
    print("="*60)
    
    try:
        phone = "9876543210"
        history = get_conversation_history(phone)
        
        print(f"✅ Retrieved {len(history)} messages")
        
        for i, msg in enumerate(history, 1):
            role = "👤 User" if msg["role"] == "user" else "🤖 Bot"
            print(f"\n{i}. {role}:")
            print(f"   {msg['content'][:100]}...")
        
        return len(history) > 0
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_multiple_conversations():
    """Test multiple conversations"""
    print("\n" + "="*60)
    print("TEST 3: Multiple Conversations")
    print("="*60)
    
    try:
        conversations = [
            ("9876543210", "Raj Kumar", "I need business cards"),
            ("9876543211", "Priya Singh", "Can you design a brochure?"),
            ("9876543212", "Amit Patel", "What about printing services?"),
        ]
        
        for phone, name, message in conversations:
            result = handle_whatsapp_message(phone, message, name)
            
            if result.get("success"):
                print(f"✅ {name}: {result['response'][:50]}...")
            else:
                print(f"❌ {name}: {result.get('error')}")
                return False
        
        return True
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_conversation_stats():
    """Test conversation statistics"""
    print("\n" + "="*60)
    print("TEST 4: Conversation Statistics")
    print("="*60)
    
    try:
        stats = get_conversation_stats()
        
        print(f"✅ Total conversations: {stats['total_conversations']}")
        print(f"✅ Total messages: {stats['total_messages']}")
        
        if stats['conversations']:
            print(f"\nConversations:")
            for phone, conv in stats['conversations'].items():
                print(f"  {phone}:")
                print(f"    Messages: {conv['message_count']}")
                print(f"    Last: {conv['last_message']}")
        
        return True
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_context_awareness():
    """Test context-aware responses"""
    print("\n" + "="*60)
    print("TEST 5: Context-Aware Responses")
    print("="*60)
    
    try:
        phone = "9999999999"
        clear_conversation(phone)
        
        # Conversation flow
        messages = [
            "Hi, I'm interested in your services",
            "I need a logo design",
            "My budget is 5000 rupees",
            "Can you do it in 3 days?",
            "Great! How do I proceed?",
        ]
        
        print(f"\n📱 Conversation with context awareness:\n")
        
        for i, msg in enumerate(messages, 1):
            print(f"{i}. 👤 User: {msg}")
            result = handle_whatsapp_message(phone, msg, "Test User")
            
            if result.get("success"):
                print(f"   🤖 Bot: {result['response']}\n")
            else:
                print(f"   ❌ Error: {result.get('error')}\n")
                return False
        
        return True
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_clear_conversation():
    """Test clearing conversation"""
    print("\n" + "="*60)
    print("TEST 6: Clear Conversation")
    print("="*60)
    
    try:
        phone = "9876543210"
        
        # Get history before clear
        history_before = get_conversation_history(phone)
        print(f"✅ Messages before clear: {len(history_before)}")
        
        # Clear
        success = clear_conversation(phone)
        
        if success:
            print(f"✅ Conversation cleared")
            
            # Get history after clear
            history_after = get_conversation_history(phone)
            print(f"✅ Messages after clear: {len(history_after)}")
            
            return len(history_after) == 0
        else:
            print(f"❌ Failed to clear")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("WHATSAPP AI CHATBOT - TEST SUITE")
    print("="*60)
    
    tests = [
        ("Basic Conversation", test_basic_conversation),
        ("Conversation History", test_conversation_history),
        ("Multiple Conversations", test_multiple_conversations),
        ("Conversation Statistics", test_conversation_stats),
        ("Context-Aware Responses", test_context_awareness),
        ("Clear Conversation", test_clear_conversation),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ Test '{test_name}' failed: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! WhatsApp AI Chatbot is ready!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed.")
    
    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
