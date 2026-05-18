"""
Test script for inbound email automation
Tests IMAP connection, email reading, and reply generation
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

from inbound_email_handler import (
    fetch_unread_emails,
    generate_ai_reply,
    process_inbound_emails
)

def test_imap_connection():
    """Test IMAP connection"""
    print("\n" + "="*60)
    print("TEST 1: IMAP Connection")
    print("="*60)
    
    imap_host = os.environ.get("IMAP_HOST")
    imap_user = os.environ.get("IMAP_USER")
    imap_pass = os.environ.get("IMAP_PASS")
    
    print(f"IMAP Host: {imap_host}")
    print(f"IMAP User: {imap_user}")
    print(f"IMAP Pass: {'*' * len(imap_pass) if imap_pass else 'NOT SET'}")
    
    if not imap_host or not imap_user or not imap_pass:
        print("❌ IMAP credentials not configured")
        return False
    
    print("✅ IMAP credentials configured")
    return True


def test_fetch_emails():
    """Test fetching unread emails"""
    print("\n" + "="*60)
    print("TEST 2: Fetch Unread Emails")
    print("="*60)
    
    try:
        emails = fetch_unread_emails()
        print(f"✅ Successfully fetched {len(emails)} unread emails")
        
        for i, email in enumerate(emails, 1):
            print(f"\n  Email {i}:")
            print(f"    From: {email['from_email']}")
            print(f"    Subject: {email['subject']}")
            print(f"    Body Preview: {email['body'][:100]}...")
        
        return len(emails) > 0
    
    except Exception as e:
        print(f"❌ Error fetching emails: {e}")
        return False


def test_ai_reply_generation():
    """Test AI reply generation"""
    print("\n" + "="*60)
    print("TEST 3: AI Reply Generation")
    print("="*60)
    
    try:
        # Sample email
        reply = generate_ai_reply(
            from_name="Test User",
            from_email="test@example.com",
            subject="Need logo design",
            body="Hi, we need a professional logo design for our startup. Budget is 50k. Timeline is 1 week."
        )
        
        print("✅ AI reply generated successfully")
        print(f"\nGenerated Reply:\n{reply}")
        
        return len(reply) > 0
    
    except Exception as e:
        print(f"❌ Error generating reply: {e}")
        return False


def test_full_process():
    """Test full inbound email processing"""
    print("\n" + "="*60)
    print("TEST 4: Full Email Processing")
    print("="*60)
    
    try:
        result = process_inbound_emails()
        
        print(f"✅ Processing complete")
        print(f"  Processed: {result.get('processed', 0)}")
        print(f"  Replied: {result.get('replied', 0)}")
        print(f"  Failed: {result.get('failed', 0)}")
        
        return result.get('success', False)
    
    except Exception as e:
        print(f"❌ Error processing emails: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("INBOUND EMAIL AUTOMATION - TEST SUITE")
    print("="*60)
    
    tests = [
        ("IMAP Connection", test_imap_connection),
        ("Fetch Emails", test_fetch_emails),
        ("AI Reply Generation", test_ai_reply_generation),
        ("Full Processing", test_full_process),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ Test '{test_name}' failed with error: {e}")
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
        print("\n🎉 All tests passed! Inbound email automation is ready!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check configuration.")
    
    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
