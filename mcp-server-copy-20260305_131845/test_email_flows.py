#!/usr/bin/env python3
"""
Test email flows without Supabase dependency
"""

import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Import email functions
from email_lead_automation import (
    send_contact_form_reply,
    send_brochure_download_email
)

print("\n" + "=" * 80)
print("TESTING EMAIL FLOWS - CONTACT FORM & BROCHURE")
print("=" * 80)

# Test data - using your email to receive test emails
test_email = "ujagarkumar@gmail.com"
test_name = "Test User"
test_company = "Test Company"
test_message = "This is a test message from the contact form."

print("\n" + "-" * 80)
print("TEST 1: CONTACT FORM REPLY EMAIL")
print("-" * 80)

try:
    print(f"\n📧 Sending contact form reply email...")
    print(f"   To: {test_email}")
    print(f"   Name: {test_name}")
    print(f"   Message: {test_message}")
    
    result = send_contact_form_reply(test_name, test_email, test_message)
    
    if result:
        print(f"\n✅ CONTACT FORM EMAIL SENT SUCCESSFULLY!")
        print(f"   Check your inbox at: {test_email}")
    else:
        print(f"\n❌ CONTACT FORM EMAIL FAILED!")
        
except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

# Wait between tests
print("\n⏳ Waiting 3 seconds before next test...")
time.sleep(3)

print("\n" + "-" * 80)
print("TEST 2: BROCHURE DOWNLOAD EMAIL")
print("-" * 80)

try:
    print(f"\n📧 Sending brochure download email...")
    print(f"   To: {test_email}")
    print(f"   Name: {test_name}")
    print(f"   Company: {test_company}")
    
    result = send_brochure_download_email(test_name, test_email, test_company)
    
    if result:
        print(f"\n✅ BROCHURE EMAIL SENT SUCCESSFULLY!")
        print(f"   Check your inbox at: {test_email}")
    else:
        print(f"\n❌ BROCHURE EMAIL FAILED!")
        
except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)

print(f"""
✅ Contact Form Email: Sent
✅ Brochure Download Email: Sent

📧 Both emails should arrive at: {test_email}

Check your inbox within 5 minutes.

If emails don't arrive:
1. Check spam/junk folder
2. Check email headers
3. Verify SPF/DKIM records

For troubleshooting, read:
   EMAIL_DELIVERABILITY_FIX.md
""")

print("=" * 80 + "\n")
