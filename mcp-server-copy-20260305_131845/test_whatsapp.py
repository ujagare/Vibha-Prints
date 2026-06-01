"""
Test script for WhatsApp automation
Tests message sending, links, and history
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Keep tests from consuming Green API quota unless explicitly requested.
os.environ.setdefault("WHATSAPP_DRY_RUN", "true")
if os.environ.get("WHATSAPP_TEST_SEND_REAL", "").lower() in ("true", "1", "yes"):
    os.environ["WHATSAPP_DRY_RUN"] = "false"

from whatsapp_automation import (
    send_whatsapp_message,
    send_lead_notification,
    send_quote_notification,
    send_order_confirmation,
    send_order_update,
    send_delivery_notification,
    send_followup_message,
    send_review_request,
    get_whatsapp_link,
    get_whatsapp_history,
    get_whatsapp_stats,
)

def test_send_message():
    """Test sending basic message"""
    print("\n" + "="*60)
    print("TEST 1: Send Basic Message")
    print("="*60)
    
    try:
        result = send_whatsapp_message(
            "9876543210",
            "Hello! This is a test message from Vibha Prints.",
            "test"
        )
        
        if result.get("success"):
            print(f"✅ Message sent successfully")
            print(f"   Message ID: {result.get('message_id')}")
            print(f"   Link: {result.get('link')}")
            return True
        else:
            print(f"❌ Error: {result.get('error')}")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_lead_notification():
    """Test lead notification"""
    print("\n" + "="*60)
    print("TEST 2: Lead Notification")
    print("="*60)
    
    try:
        result = send_lead_notification(
            "Raj Kumar",
            "9876543210",
            "raj@example.com",
            "Need logo design for startup"
        )
        
        if result.get("success"):
            print(f"✅ Lead notification sent")
            print(f"   Message ID: {result.get('message_id')}")
            return True
        else:
            print(f"❌ Error: {result.get('error')}")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_quote_notification():
    """Test quote notification"""
    print("\n" + "="*60)
    print("TEST 3: Quote Notification")
    print("="*60)
    
    try:
        result = send_quote_notification(
            "Priya Singh",
            "9876543211",
            "Visiting Cards (500 pcs)",
            1200.00,
            "QT-1234567890"
        )
        
        if result.get("success"):
            print(f"✅ Quote notification sent")
            print(f"   Message ID: {result.get('message_id')}")
            return True
        else:
            print(f"❌ Error: {result.get('error')}")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_order_confirmation():
    """Test order confirmation"""
    print("\n" + "="*60)
    print("TEST 4: Order Confirmation")
    print("="*60)
    
    try:
        result = send_order_confirmation(
            "Amit Patel",
            "9876543212",
            "ORD-001",
            "Brochures (100 pcs)",
            2500.00
        )
        
        if result.get("success"):
            print(f"✅ Order confirmation sent")
            print(f"   Message ID: {result.get('message_id')}")
            return True
        else:
            print(f"❌ Error: {result.get('error')}")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_order_updates():
    """Test order status updates"""
    print("\n" + "="*60)
    print("TEST 5: Order Status Updates")
    print("="*60)
    
    statuses = [
        ("design", "Your design is being created"),
        ("printing", "Your order is being printed"),
        ("quality_check", "Quality check in progress"),
        ("ready", "Your order is ready for delivery"),
    ]
    
    all_passed = True
    
    for status, message in statuses:
        try:
            result = send_order_update(
                "Raj Kumar",
                "9876543210",
                "ORD-001",
                status,
                message
            )
            
            if result.get("success"):
                print(f"✅ {status.replace('_', ' ').title()} update sent")
            else:
                print(f"❌ {status}: {result.get('error')}")
                all_passed = False
        
        except Exception as e:
            print(f"❌ Error: {e}")
            all_passed = False
    
    return all_passed


def test_delivery_notification():
    """Test delivery notification"""
    print("\n" + "="*60)
    print("TEST 6: Delivery Notification")
    print("="*60)
    
    try:
        result = send_delivery_notification(
            "Priya Singh",
            "9876543211",
            "ORD-001",
            "Tracking: DHL-123456"
        )
        
        if result.get("success"):
            print(f"✅ Delivery notification sent")
            print(f"   Message ID: {result.get('message_id')}")
            return True
        else:
            print(f"❌ Error: {result.get('error')}")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_followup_messages():
    """Test follow-up messages"""
    print("\n" + "="*60)
    print("TEST 7: Follow-up Messages")
    print("="*60)
    
    days = [1, 3, 7]
    all_passed = True
    
    for day in days:
        try:
            result = send_followup_message(
                "Amit Patel",
                "9876543212",
                day
            )
            
            if result.get("success"):
                print(f"✅ Day {day} follow-up sent")
            else:
                print(f"❌ Day {day}: {result.get('error')}")
                all_passed = False
        
        except Exception as e:
            print(f"❌ Error: {e}")
            all_passed = False
    
    return all_passed


def test_review_request():
    """Test review request"""
    print("\n" + "="*60)
    print("TEST 8: Review Request")
    print("="*60)
    
    try:
        result = send_review_request(
            "Raj Kumar",
            "9876543210",
            "ORD-001"
        )
        
        if result.get("success"):
            print(f"✅ Review request sent")
            print(f"   Message ID: {result.get('message_id')}")
            return True
        else:
            print(f"❌ Error: {result.get('error')}")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_whatsapp_link():
    """Test WhatsApp link generation"""
    print("\n" + "="*60)
    print("TEST 9: WhatsApp Link Generation")
    print("="*60)
    
    try:
        link = get_whatsapp_link(
            "9876543210",
            "Hello! I'm interested in your services."
        )
        
        if link:
            print(f"✅ WhatsApp link generated")
            print(f"   Link: {link}")
            return True
        else:
            print(f"❌ Failed to generate link")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_history_and_stats():
    """Test history and statistics"""
    print("\n" + "="*60)
    print("TEST 10: History & Statistics")
    print("="*60)
    
    try:
        history = get_whatsapp_history(limit=10)
        stats = get_whatsapp_stats()
        
        print(f"✅ History retrieved: {len(history)} messages")
        print(f"✅ Statistics:")
        print(f"   Total messages: {stats.get('total_messages', 0)}")
        print(f"   By type: {stats.get('by_type', {})}")
        
        return True
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("WHATSAPP AUTOMATION - TEST SUITE")
    print("="*60)
    
    tests = [
        ("Send Basic Message", test_send_message),
        ("Lead Notification", test_lead_notification),
        ("Quote Notification", test_quote_notification),
        ("Order Confirmation", test_order_confirmation),
        ("Order Status Updates", test_order_updates),
        ("Delivery Notification", test_delivery_notification),
        ("Follow-up Messages", test_followup_messages),
        ("Review Request", test_review_request),
        ("WhatsApp Link", test_whatsapp_link),
        ("History & Stats", test_history_and_stats),
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
        print("\n🎉 All tests passed! WhatsApp automation is ready!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed.")
    
    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
