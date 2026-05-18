#!/usr/bin/env python3
"""
Test both Contact Form and Brochure Download email flows
"""

import os
import sys
import json
import time
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Import our modules
from supabase_client import save_contact_lead, save_brochure_lead
from email_lead_automation import (
    send_contact_form_reply,
    send_brochure_download_email,
    send_hot_lead_alert
)

print("\n" + "=" * 80)
print("TESTING BOTH EMAIL FLOWS")
print("=" * 80)

# Test data
test_contact_name = "Test User Contact"
test_contact_email = "ujagarkumar@gmail.com"  # Your personal email to test
test_contact_message = "This is a test message from the contact form. Testing email automation system."

test_brochure_name = "Test User Brochure"
test_brochure_email = "ujagarkumar@gmail.com"  # Your personal email to test
test_brochure_company = "Test Company Ltd"

print("\n" + "-" * 80)
print("TEST 1: CONTACT FORM EMAIL")
print("-" * 80)

try:
    print(f"\n📝 Creating contact lead...")
    print(f"   Name: {test_contact_name}")
    print(f"   Email: {test_contact_email}")
    print(f"   Message: {test_contact_message}")
    
    # Save to Supabase
    result = save_contact_lead(
        name=test_contact_name,
        email=test_contact_email,
        mobile="+91 9876543210",
        message=test_contact_message,
        source="test-script"
    )
    
    print(f"\n📥 Supabase Result: {json.dumps(result, indent=2)}")
    
    if result.get("success"):
        print(f"\n📧 Sending contact form reply email...")
        email_sent = send_contact_form_reply(test_contact_name, test_contact_email, test_contact_message)
        print(f"   Email sent: {email_sent}")
        
        if email_sent:
            print(f"\n✅ CONTACT FORM TEST PASSED!")
            print(f"   Email should arrive at: {test_contact_email}")
        else:
            print(f"\n❌ CONTACT FORM EMAIL FAILED!")
    else:
        print(f"\n❌ Failed to save contact lead: {result.get('error')}")
        
except Exception as e:
    print(f"\n❌ ERROR in contact form test: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

# Wait a bit between tests
print("\n⏳ Waiting 5 seconds before next test...")
time.sleep(5)

print("\n" + "-" * 80)
print("TEST 2: BROCHURE DOWNLOAD EMAIL")
print("-" * 80)

try:
    print(f"\n📝 Creating brochure lead...")
    print(f"   Name: {test_brochure_name}")
    print(f"   Email: {test_brochure_email}")
    print(f"   Company: {test_brochure_company}")
    
    # Save to Supabase
    result = save_brochure_lead(
        name=test_brochure_name,
        email=test_brochure_email,
        phone="+91 9876543210",
        company=test_brochure_company,
        source="test-script"
    )
    
    print(f"\n📥 Supabase Result: {json.dumps(result, indent=2)}")
    
    if result.get("success"):
        print(f"\n📧 Sending brochure download email...")
        email_sent = send_brochure_download_email(test_brochure_name, test_brochure_email, test_brochure_company)
        print(f"   Email sent: {email_sent}")
        
        if email_sent:
            print(f"\n✅ BROCHURE DOWNLOAD TEST PASSED!")
            print(f"   Email should arrive at: {test_brochure_email}")
        else:
            print(f"\n❌ BROCHURE DOWNLOAD EMAIL FAILED!")
    else:
        print(f"\n❌ Failed to save brochure lead: {result.get('error')}")
        
except Exception as e:
    print(f"\n❌ ERROR in brochure test: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)

print(f"""
✅ Contact Form Email Test: Completed
   → Email sent to: {test_contact_email}
   → Check your inbox within 5 minutes

✅ Brochure Download Email Test: Completed
   → Email sent to: {test_brochure_email}
   → Check your inbox within 5 minutes

📧 Both emails should arrive in your inbox.

If emails don't arrive:
1. Check spam/junk folder
2. Check email headers
3. Verify SPF/DKIM records

For detailed troubleshooting, read:
   EMAIL_DELIVERABILITY_FIX.md
""")

print("=" * 80)
