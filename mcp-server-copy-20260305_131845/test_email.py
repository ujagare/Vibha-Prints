#!/usr/bin/env python3
"""
Test script to verify email configuration and send test email
"""

import os
import sys
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
MAIL_TO = os.environ.get("MAIL_TO", "")

print("=" * 60)
print("EMAIL CONFIGURATION TEST")
print("=" * 60)

# Check configuration
print("\n📋 Configuration Check:")
print(f"  ZOHO_SMTP_HOST: {ZOHO_SMTP_HOST}")
print(f"  ZOHO_SMTP_PORT: {ZOHO_SMTP_PORT}")
print(f"  ZOHO_SMTP_USER: {ZOHO_SMTP_USER if ZOHO_SMTP_USER else '❌ NOT SET'}")
print(f"  ZOHO_SMTP_PASS: {'✅ SET' if ZOHO_SMTP_PASS else '❌ NOT SET'}")
print(f"  MAIL_FROM: {MAIL_FROM if MAIL_FROM else '❌ NOT SET'}")
print(f"  MAIL_TO: {MAIL_TO if MAIL_TO else '❌ NOT SET'}")

# Validate configuration
if not all([ZOHO_SMTP_USER, ZOHO_SMTP_PASS, MAIL_FROM, MAIL_TO]):
    print("\n❌ ERROR: Missing required configuration!")
    print("   Please set these environment variables in .env:")
    print("   - ZOHO_SMTP_USER")
    print("   - ZOHO_SMTP_PASS")
    print("   - MAIL_FROM")
    print("   - MAIL_TO")
    sys.exit(1)

# Test connection
print("\n🔌 Testing SMTP Connection...")
try:
    print(f"  Connecting to {ZOHO_SMTP_HOST}:{ZOHO_SMTP_PORT}...")
    
    if ZOHO_SMTP_PORT == 465:
        with smtplib.SMTP_SSL(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10) as server:
            print("  ✅ Connected!")
            
            print(f"  Logging in as {ZOHO_SMTP_USER}...")
            server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
            print("  ✅ Logged in!")
    else:
        with smtplib.SMTP(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10) as server:
            print("  ✅ Connected!")
            
            print(f"  Starting TLS...")
            server.starttls()
            print("  ✅ TLS started!")
            
            print(f"  Logging in as {ZOHO_SMTP_USER}...")
            server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
            print("  ✅ Logged in!")
        
except smtplib.SMTPAuthenticationError as e:
    print(f"  ❌ Authentication failed: {e}")
    print("     Check your ZOHO_SMTP_USER and ZOHO_SMTP_PASS")
    sys.exit(1)
except Exception as e:
    print(f"  ❌ Connection failed: {e}")
    sys.exit(1)

# Send test email
print("\n📧 Sending Test Email...")
try:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Test Email from Vibha Prints MCP Server"
    msg["From"] = f"Vibha Prints <{MAIL_FROM}>"
    msg["To"] = MAIL_TO
    msg["Reply-To"] = MAIL_FROM
    
    text_content = """
    Test Email from Vibha Prints MCP Server
    
    If you received this email, your SMTP configuration is working correctly!
    
    Best regards,
    Vibha Prints Team
    """
    
    html_content = """
    <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2 style='color: #6A11CB;'>Test Email from Vibha Prints MCP Server</h2>
            <p>If you received this email, your SMTP configuration is working correctly!</p>
            <hr style='border: 1px solid #6A11CB;'>
            <p style='color: #666; font-size: 12px;'>
                Best regards,<br/>
                Vibha Prints Team<br/>
                info@vibhaprints.com
            </p>
        </body>
    </html>
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
    
    print(f"  ✅ Test email sent to {MAIL_TO}")
    
except Exception as e:
    print(f"  ❌ Failed to send email: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ EMAIL CONFIGURATION TEST PASSED!")
print("=" * 60)
print("\nYour email configuration is working correctly.")
print(f"Test email has been sent to: {MAIL_TO}")
print("\nYou should receive it within a few minutes.")
