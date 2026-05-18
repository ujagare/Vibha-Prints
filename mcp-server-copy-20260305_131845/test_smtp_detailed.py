#!/usr/bin/env python3
"""
Detailed SMTP test with full logging
"""

import os
import sys
import smtplib
import logging
from pathlib import Path
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Setup detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("smtp_test")

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Configuration
ZOHO_SMTP_HOST = os.environ.get("ZOHO_SMTP_HOST", "smtp.zoho.in")
ZOHO_SMTP_PORT = int(os.environ.get("ZOHO_SMTP_PORT", "587"))
ZOHO_SMTP_USER = os.environ.get("ZOHO_SMTP_USER", "")
ZOHO_SMTP_PASS = os.environ.get("ZOHO_SMTP_PASS", "")
MAIL_FROM = os.environ.get("MAIL_FROM", "")

test_email = "ujagarkumar@gmail.com"

print("\n" + "=" * 80)
print("DETAILED SMTP TEST WITH FULL LOGGING")
print("=" * 80)

print(f"\n📋 Configuration:")
print(f"   Host: {ZOHO_SMTP_HOST}")
print(f"   Port: {ZOHO_SMTP_PORT}")
print(f"   User: {ZOHO_SMTP_USER}")
print(f"   From: {MAIL_FROM}")
print(f"   To: {test_email}")

print(f"\n🔌 Connecting to SMTP server...")

try:
    # Enable debug output
    server = smtplib.SMTP(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10)
    server.set_debuglevel(2)  # Enable debug output
    
    logger.info("Connected to SMTP server")
    print("✅ Connected")
    
    logger.info("Starting TLS...")
    server.starttls()
    print("✅ TLS started")
    
    logger.info(f"Logging in as {ZOHO_SMTP_USER}...")
    server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
    print("✅ Logged in")
    
    # Create message
    logger.info("Creating email message...")
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Test Email - Detailed SMTP Test"
    msg["From"] = MAIL_FROM
    msg["To"] = test_email
    msg["Reply-To"] = MAIL_FROM
    msg["X-Mailer"] = "Vibha Prints Test"
    
    text_content = "This is a test email from detailed SMTP test."
    html_content = "<html><body><h2>Test Email</h2><p>This is a test email from detailed SMTP test.</p></body></html>"
    
    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))
    
    logger.info(f"Sending email to {test_email}...")
    print(f"\n📧 Sending email...")
    
    # Send with detailed output
    result = server.send_message(msg)
    
    logger.info(f"Send result: {result}")
    print(f"✅ Email sent")
    print(f"   Result: {result}")
    
    server.quit()
    logger.info("Connection closed")
    print("✅ Connection closed")
    
    print("\n" + "=" * 80)
    print("✅ TEST COMPLETED SUCCESSFULLY")
    print("=" * 80)
    print(f"\nEmail should arrive at: {test_email}")
    print("Check inbox within 5 minutes.")
    
except smtplib.SMTPAuthenticationError as e:
    logger.error(f"Authentication failed: {e}")
    print(f"\n❌ Authentication failed: {e}")
    sys.exit(1)
    
except smtplib.SMTPException as e:
    logger.error(f"SMTP error: {e}")
    print(f"\n❌ SMTP error: {e}")
    sys.exit(1)
    
except Exception as e:
    logger.error(f"Error: {type(e).__name__}: {e}", exc_info=True)
    print(f"\n❌ Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 80 + "\n")
