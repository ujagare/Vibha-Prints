#!/usr/bin/env python3
"""
Comprehensive Email Diagnosis Script
Identifies exactly why emails aren't being sent
"""

import os
import sys
import smtplib
import json
from pathlib import Path
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

print("\n" + "=" * 70)
print("EMAIL SYSTEM DIAGNOSTIC TOOL")
print("=" * 70)

# Configuration
ZOHO_SMTP_HOST = os.environ.get("ZOHO_SMTP_HOST", "smtp.zoho.in")
ZOHO_SMTP_PORT = int(os.environ.get("ZOHO_SMTP_PORT", "587"))
ZOHO_SMTP_USER = os.environ.get("ZOHO_SMTP_USER", "")
ZOHO_SMTP_PASS = os.environ.get("ZOHO_SMTP_PASS", "")
MAIL_FROM = os.environ.get("MAIL_FROM", "")
MAIL_TO = os.environ.get("MAIL_TO", "")

# Step 1: Configuration Check
print("\n📋 STEP 1: Configuration Check")
print("-" * 70)

config_ok = True

print(f"  ZOHO_SMTP_HOST: {ZOHO_SMTP_HOST}")
if not ZOHO_SMTP_HOST:
    print("    ❌ ERROR: Not configured")
    config_ok = False
else:
    print("    ✅ OK")

print(f"  ZOHO_SMTP_PORT: {ZOHO_SMTP_PORT}")
if ZOHO_SMTP_PORT != 587:
    print(f"    ⚠️  WARNING: Expected 587, got {ZOHO_SMTP_PORT}")
else:
    print("    ✅ OK")

print(f"  ZOHO_SMTP_USER: {ZOHO_SMTP_USER}")
if not ZOHO_SMTP_USER:
    print("    ❌ ERROR: Not configured")
    config_ok = False
else:
    print("    ✅ OK")

print(f"  ZOHO_SMTP_PASS: {'*' * len(ZOHO_SMTP_PASS) if ZOHO_SMTP_PASS else 'NOT SET'}")
if not ZOHO_SMTP_PASS:
    print("    ❌ ERROR: Not configured")
    config_ok = False
elif len(ZOHO_SMTP_PASS) < 8:
    print(f"    ⚠️  WARNING: Password seems too short ({len(ZOHO_SMTP_PASS)} chars)")
    print("    💡 TIP: Zoho app passwords are usually 16+ characters")
else:
    print("    ✅ OK")

print(f"  MAIL_FROM: {MAIL_FROM}")
if not MAIL_FROM:
    print("    ❌ ERROR: Not configured")
    config_ok = False
else:
    print("    ✅ OK")

print(f"  MAIL_TO: {MAIL_TO}")
if not MAIL_TO:
    print("    ❌ ERROR: Not configured")
    config_ok = False
else:
    print("    ✅ OK")

if not config_ok:
    print("\n❌ Configuration incomplete. Please update .env file.")
    sys.exit(1)

# Step 2: Connection Test
print("\n🔌 STEP 2: SMTP Connection Test")
print("-" * 70)

try:
    print(f"  Connecting to {ZOHO_SMTP_HOST}:{ZOHO_SMTP_PORT}...")
    server = smtplib.SMTP(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10)
    print("  ✅ Connected!")
    
    print(f"  Starting TLS...")
    server.starttls()
    print("  ✅ TLS started!")
    
    print(f"  Logging in as {ZOHO_SMTP_USER}...")
    server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
    print("  ✅ Logged in successfully!")
    
    server.quit()
    connection_ok = True
    
except smtplib.SMTPAuthenticationError as e:
    print(f"  ❌ AUTHENTICATION FAILED: {e}")
    print("\n  💡 DIAGNOSIS:")
    print("     This means your password is incorrect or not an app password.")
    print("     Zoho requires app-specific passwords for SMTP.")
    print("\n  🔧 FIX:")
    print("     1. Go to https://accounts.zoho.in/")
    print("     2. Login with info@vibhaprints.com")
    print("     3. Go to Security → App Passwords")
    print("     4. Generate a new app password for Mail")
    print("     5. Update ZOHO_SMTP_PASS in .env with the new password")
    connection_ok = False
    
except smtplib.SMTPException as e:
    print(f"  ❌ SMTP ERROR: {e}")
    print("\n  💡 DIAGNOSIS:")
    print("     SMTP server returned an error.")
    print("     This could be a server issue or configuration problem.")
    connection_ok = False
    
except Exception as e:
    print(f"  ❌ CONNECTION FAILED: {type(e).__name__}: {e}")
    print("\n  💡 DIAGNOSIS:")
    print("     Could not connect to SMTP server.")
    print("     Check your internet connection and firewall settings.")
    connection_ok = False

if not connection_ok:
    print("\n❌ Connection test failed. Cannot proceed.")
    sys.exit(1)

# Step 3: Email Sending Test
print("\n📧 STEP 3: Email Sending Test")
print("-" * 70)

try:
    print(f"  Creating email message...")
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Diagnostic Test Email from Vibha Prints"
    msg["From"] = f"Vibha Prints <{MAIL_FROM}>"
    msg["To"] = MAIL_TO
    msg["Reply-To"] = MAIL_FROM
    
    text_content = """
    Diagnostic Test Email
    
    If you received this email, your SMTP configuration is working correctly!
    
    This email was sent from the MCP Server diagnostic tool.
    
    Best regards,
    Vibha Prints Team
    """
    
    html_content = """
    <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2 style='color: #6A11CB;'>Diagnostic Test Email</h2>
            <p>If you received this email, your SMTP configuration is working correctly!</p>
            <p>This email was sent from the MCP Server diagnostic tool.</p>
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
    
    print(f"  Sending email to {MAIL_TO}...")
    with smtplib.SMTP(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10) as server:
        server.starttls()
        server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
        server.send_message(msg)
    
    print(f"  ✅ Email sent successfully!")
    email_ok = True
    
except Exception as e:
    print(f"  ❌ FAILED TO SEND: {type(e).__name__}: {e}")
    email_ok = False

# Step 4: Summary
print("\n" + "=" * 70)
print("DIAGNOSTIC SUMMARY")
print("=" * 70)

if config_ok and connection_ok and email_ok:
    print("\n✅ ALL TESTS PASSED!")
    print("\nYour email configuration is working correctly.")
    print(f"Test email has been sent to: {MAIL_TO}")
    print("\nNext steps:")
    print("1. Check your email inbox for the test message")
    print("2. Restart the MCP server: npm run dev:all")
    print("3. Test by submitting a contact form or downloading a brochure")
    print("4. Check your Zoho inbox for automated replies")
    
elif config_ok and connection_ok:
    print("\n⚠️  PARTIAL SUCCESS")
    print("Configuration and connection are OK, but email sending failed.")
    print("This might be a temporary issue. Try again in a few moments.")
    
else:
    print("\n❌ TESTS FAILED")
    print("See the diagnostic messages above for details.")
    print("\nMost common issue: Using regular password instead of app password")
    print("Solution: Generate app password from Zoho account settings")

print("\n" + "=" * 70)
