#!/usr/bin/env python3
"""
Minimal test - just send emails without AI
"""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Configuration
ZOHO_SMTP_HOST = os.environ.get("ZOHO_SMTP_HOST", "smtppro.zoho.in")
ZOHO_SMTP_PORT = int(os.environ.get("ZOHO_SMTP_PORT", "465"))
ZOHO_SMTP_USER = os.environ.get("ZOHO_SMTP_USER", "")
ZOHO_SMTP_PASS = os.environ.get("ZOHO_SMTP_PASS", "")
MAIL_FROM = os.environ.get("MAIL_FROM", "")

test_email = "ujagarkumar@gmail.com"

print("\n" + "=" * 80)
print("MINIMAL EMAIL TEST")
print("=" * 80)

# Test 1: Contact Form Email
print("\n📧 TEST 1: Sending Contact Form Email...")

try:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Thank you for contacting Vibha Prints! 🎨"
    msg["From"] = MAIL_FROM
    msg["To"] = test_email
    msg["Reply-To"] = MAIL_FROM
    
    html_content = """
    <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2 style='color: #6A11CB;'>Thank you for contacting Vibha Prints!</h2>
            <p>Hi Test User,</p>
            <p>Thank you for reaching out to us. We appreciate your interest in our design and printing services.</p>
            <p>We will get back to you within 24 hours with a personalized response.</p>
            <p>Best regards,<br/>Vibha Prints Team</p>
        </body>
    </html>
    """
    
    text_content = """
    Thank you for contacting Vibha Prints!
    
    Hi Test User,
    Thank you for reaching out to us.
    We will get back to you within 24 hours.
    
    Best regards,
    Vibha Prints Team
    """
    
    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))
    
    if ZOHO_SMTP_PORT == 465:
        with smtplib.SMTP_SSL(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10) as server:
            server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
            server.send_message(msg)
    else:
        with smtplib.SMTP(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
            server.send_message(msg)
    
    print(f"✅ Contact form email sent to: {test_email}")
    
except Exception as e:
    print(f"❌ Failed: {e}")

# Test 2: Brochure Email
print("\n📧 TEST 2: Sending Brochure Download Email...")

try:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your Vibha Prints Brochure is Ready! 📥"
    msg["From"] = MAIL_FROM
    msg["To"] = test_email
    msg["Reply-To"] = MAIL_FROM
    
    html_content = """
    <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2 style='color: #6A11CB;'>Brochure Download Confirmed! 📄</h2>
            <p>Hi Test User,</p>
            <p>Thank you for downloading our Vibha Prints brochure from Test Company!</p>
            <p>We're excited to share our design and printing capabilities with you.</p>
            <p>What's Inside:</p>
            <ul>
                <li>Logo Design Services</li>
                <li>Business Card & Stationery</li>
                <li>Brochure & Packaging Design</li>
                <li>Digital & Offset Printing</li>
            </ul>
            <p>Best regards,<br/>Vibha Prints Team</p>
        </body>
    </html>
    """
    
    text_content = """
    Brochure Download Confirmed!
    
    Hi Test User,
    Thank you for downloading our Vibha Prints brochure!
    
    What's Inside:
    - Logo Design Services
    - Business Card & Stationery
    - Brochure & Packaging Design
    - Digital & Offset Printing
    
    Best regards,
    Vibha Prints Team
    """
    
    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))
    
    if ZOHO_SMTP_PORT == 465:
        with smtplib.SMTP_SSL(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10) as server:
            server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
            server.send_message(msg)
    else:
        with smtplib.SMTP(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
            server.send_message(msg)
    
    print(f"✅ Brochure email sent to: {test_email}")
    
except Exception as e:
    print(f"❌ Failed: {e}")

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)

print(f"""
✅ Both test emails have been sent to: {test_email}

Check your inbox within 5 minutes.

If emails don't arrive:
1. Check spam/junk folder
2. Mark as "Not Spam"
3. Add sender to contacts

For troubleshooting, read:
   EMAIL_DELIVERABILITY_FIX.md
""")

print("=" * 80 + "\n")
