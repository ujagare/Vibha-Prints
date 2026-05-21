"""
Inbound Email Handler - Automatically read and reply to client emails
Features:
- Read emails from Zoho IMAP
- Generate AI-powered replies
- Send automatic responses
- Track conversations
- Prevent duplicate replies
- Support for multiple email threads
"""

import os
import imaplib
import email
from email.header import decode_header
from email.utils import parseaddr
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import json
import logging
import requests
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
from typing import List, Dict, Optional

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("inbound_email_handler")

# IMAP Configuration
IMAP_HOST = os.environ.get("IMAP_HOST", "imap.zoho.in")
IMAP_PORT = int(os.environ.get("IMAP_PORT", "993"))
IMAP_USER = os.environ.get("IMAP_USER", "info@vibhaprints.com")
IMAP_PASS = os.environ.get("IMAP_PASS", "")

# SMTP Configuration
SMTP_HOST = os.environ.get("ZOHO_SMTP_HOST", "smtp.zoho.in")
SMTP_PORT = int(os.environ.get("ZOHO_SMTP_PORT", "587"))
SMTP_USER = os.environ.get("ZOHO_SMTP_USER", "info@vibhaprints.com")
SMTP_PASS = os.environ.get("ZOHO_SMTP_PASS", "")
SMTP_TIMEOUT_SECONDS = int(os.environ.get("SMTP_TIMEOUT_SECONDS", "45"))
MAIL_FROM = os.environ.get("MAIL_FROM", "info@vibhaprints.com")
EMAIL_PROVIDER = os.environ.get("EMAIL_PROVIDER", "smtp").strip().lower()
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
RESEND_FROM = os.environ.get("RESEND_FROM", MAIL_FROM)
RESEND_API_URL = os.environ.get("RESEND_API_URL", "https://api.resend.com/emails")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
INBOUND_SKIP_DOMAINS = {
    domain.strip().lower()
    for domain in os.environ.get(
        "INBOUND_SKIP_DOMAINS",
        "zohocorp.com,zohocreator.com,zohoworkplace.com",
    ).split(",")
    if domain.strip()
}

# AI Clients
groq_client = None
gemini_client = None

if GROQ_AVAILABLE and os.environ.get("GROQ_API_KEY"):
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

if GEMINI_AVAILABLE and os.environ.get("GEMINI_API_KEY"):
    gemini_client = create_gemini_model(
        os.environ.get("GEMINI_API_KEY"),
        os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
    )

# Data directory for tracking
DATA_DIR = Path(__file__).parent / "data"
PROCESSED_EMAILS_LOG = DATA_DIR / "processed_emails.json"
DATA_DIR.mkdir(exist_ok=True)


def load_processed_emails() -> dict:
    """Load log of already processed emails"""
    if not PROCESSED_EMAILS_LOG.exists():
        return {}
    try:
        with open(PROCESSED_EMAILS_LOG, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading processed emails log: {e}")
        return {}


def save_processed_emails(log: dict):
    """Save processed emails log"""
    try:
        with open(PROCESSED_EMAILS_LOG, 'w') as f:
            json.dump(log, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving processed emails log: {e}")


def mark_email_processed(email_id: str, from_email: str, subject: str):
    """Mark email as processed to avoid duplicate replies"""
    log = load_processed_emails()
    log[email_id] = {
        "from": from_email,
        "subject": subject,
        "processed_at": datetime.now().isoformat(),
        "replied": True
    }
    save_processed_emails(log)


def is_email_processed(email_id: str) -> bool:
    """Check if email already has a reply"""
    log = load_processed_emails()
    return email_id in log


def clean_email_address(value: str) -> str:
    """Extract the mailbox from a From/To header."""
    return parseaddr(value or "")[1].strip().lower()


def should_skip_sender(from_email: str, msg) -> bool:
    """Avoid replying to our own account, no-reply senders, and automated mail."""
    sender = clean_email_address(from_email)
    own_addresses = {
        clean_email_address(IMAP_USER),
        clean_email_address(SMTP_USER),
        clean_email_address(MAIL_FROM),
        "info@vibhaprints.com",
    }
    if sender in own_addresses:
        return True

    if any(token in sender for token in ("no-reply", "noreply", "mailer-daemon", "postmaster")):
        return True
    if sender.split("@")[-1] in INBOUND_SKIP_DOMAINS:
        return True

    precedence = (msg.get("Precedence") or "").strip().lower()
    auto_submitted = (msg.get("Auto-Submitted") or "").strip().lower()
    list_headers = [msg.get("List-Unsubscribe"), msg.get("List-Id")]
    if precedence in {"bulk", "junk", "list", "auto_reply"}:
        return True
    if auto_submitted and auto_submitted != "no":
        return True
    if any(list_headers):
        return True

    return False


def record_client_reply_activity(sender_email: str, subject: str, message_id: str):
    """Mark matching leads as replied so no-response follow-ups stop."""
    try:
        from supabase_client import (
            add_lead_activity,
            is_supabase_configured,
            supabase,
            update_pipeline_status,
        )

        sender = clean_email_address(sender_email)
        if not sender or not is_supabase_configured():
            return

        response = (
            supabase.table("contact_leads")
            .select("*")
            .eq("email", sender)
            .limit(1)
            .execute()
        )
        leads = response.data or []
        if not leads:
            return

        lead_id = leads[0].get("id")
        if not lead_id:
            return

        meta = {"from": sender, "subject": subject, "message_id": message_id}
        add_lead_activity(lead_id, "contact", "inbound_email_received", meta)
        add_lead_activity(lead_id, "contact", "client_replied", meta)
        update_pipeline_status(
            lead_id,
            "contact",
            "client_replied",
            notes="Client replied by email; automatic no-response follow-up stopped",
        )
    except Exception as e:
        logger.warning(f"Could not record inbound reply activity: {e}")


def decode_email_header(header_value: str) -> str:
    """Decode email header (handles encoding)"""
    if not header_value:
        return ""
    
    decoded_parts = []
    for part, encoding in decode_header(header_value):
        if isinstance(part, bytes):
            try:
                decoded_parts.append(part.decode(encoding or 'utf-8'))
            except:
                decoded_parts.append(part.decode('utf-8', errors='ignore'))
        else:
            decoded_parts.append(str(part))
    
    return ''.join(decoded_parts)


def get_email_body(msg) -> str:
    """Extract email body from message"""
    body = ""
    
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                try:
                    body = part.get_payload(decode=True).decode('utf-8')
                    break
                except:
                    body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    break
    else:
        try:
            body = msg.get_payload(decode=True).decode('utf-8')
        except:
            body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
    
    return body.strip()


def generate_ai_reply(from_name: str, from_email: str, subject: str, body: str) -> str:
    """Generate AI-powered reply to client email"""
    
    prompt = f"""
You are a professional customer service representative for Vibha Prints, a design and printing company.

A client has sent you an email. Generate a professional, helpful, and personalized reply.

Client Details:
- Name: {from_name}
- Email: {from_email}
- Subject: {subject}

Client's Message:
{body}

Guidelines:
1. Be professional but friendly
2. Address their specific concerns/questions
3. Offer solutions or next steps
4. Include call-to-action (schedule consultation, send quote, etc.)
5. Use Hinglish where appropriate for better connection
6. Keep it concise (2-3 paragraphs)
7. Sign off professionally

Generate ONLY the email body (no subject line, no greeting with name - just the body text).
"""
    
    try:
        if groq_client:
            response = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        
        elif gemini_client:
            response = gemini_client.generate_content(prompt)
            return response.text.strip()
        
        else:
            # Fallback response
            return f"""Thank you for reaching out to Vibha Prints!

We appreciate your interest and will review your requirements carefully. 

Our team will get back to you within 24 hours with more details and a customized solution for your needs.

In the meantime, feel free to check out our portfolio and services on our website.

Best regards,
Vibha Prints Team"""
    
    except Exception as e:
        logger.error(f"Error generating AI reply: {e}")
        return f"""Thank you for contacting Vibha Prints!

We appreciate your message and will respond shortly with more information.

Best regards,
Vibha Prints Team"""


def send_reply_email(to_email: str, to_name: str, subject: str, body: str, original_message_id: str = "") -> bool:
    """Send reply email to client"""
    clean_to_email = clean_email_address(to_email)
    
    logger.info(f"📧 Sending reply to {to_email}")
    
    if EMAIL_PROVIDER != "resend" and (not SMTP_HOST or not SMTP_USER or not SMTP_PASS):
        logger.error("❌ SMTP credentials not configured")
        return False
    
    try:
        # Create reply subject
        reply_subject = f"Re: {subject}" if not subject.startswith("Re:") else subject
        
        # Create HTML content
        html_content = f"""
        <html>
            <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <p style='font-size: 15px; margin: 15px 0;'>
                        {body.replace(chr(10), '<br/>')}
                    </p>
                    
                    <div style='margin-top:30px;padding-top:20px;border-top:2px solid #6A11CB;'>
                        <p style='margin:0;font-size:14px;color:#333;line-height:1.8;'>
                            <strong style='color:#6A11CB;'>Vibha Prints</strong><br/>
                            Design &amp; Printing Solutions<br/>
                            📧 <a href='mailto:info@vibhaprints.com' style='color:#6A11CB;text-decoration:none;'>info@vibhaprints.com</a><br/>
                            📱 <a href='tel:+918624948046' style='color:#6A11CB;text-decoration:none;'>+91 86249 48046</a><br/>
                            🌐 <a href='https://www.vibhaprints.com/' style='color:#6A11CB;text-decoration:none;'>https://www.vibhaprints.com/</a>
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """

        if EMAIL_PROVIDER == "resend":
            return send_reply_email_resend(clean_to_email, reply_subject, body, html_content)
        
        msg = MIMEMultipart("alternative")
        msg["Subject"] = reply_subject
        msg["From"] = MAIL_FROM
        msg["To"] = clean_to_email or to_email
        msg["Reply-To"] = MAIL_FROM
        msg["In-Reply-To"] = original_message_id
        msg["References"] = original_message_id
        
        msg.attach(MIMEText(body, "plain"))
        msg.attach(MIMEText(html_content, "html"))
        
        # Send via SMTP
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=SMTP_TIMEOUT_SECONDS) as server:
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=SMTP_TIMEOUT_SECONDS) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)
        
        logger.info(f"✅ Reply sent successfully to {to_email}")
        return True
    
    except Exception as e:
        logger.error(f"❌ Failed to send reply: {e}")
        return False


def send_reply_email_resend(to_email: str, subject: str, text_content: str, html_content: str) -> bool:
    """Send AI reply using Resend HTTP API."""
    if not RESEND_API_KEY:
        logger.error("RESEND_API_KEY not configured")
        return False
    if not to_email:
        logger.error("Reply recipient email is empty or invalid")
        return False

    try:
        response = requests.post(
            RESEND_API_URL,
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": RESEND_FROM,
                "to": [to_email],
                "subject": subject,
                "text": text_content,
                "html": html_content,
            },
            timeout=30,
        )
        if 200 <= response.status_code < 300:
            logger.info(f"Reply sent via Resend to {to_email}")
            return True

        logger.error(f"Resend reply failed ({response.status_code}): {response.text[:500]}")
        return False
    except Exception as e:
        logger.error(f"Resend reply error: {type(e).__name__}: {e}")
        return False


def fetch_unread_emails() -> List[Dict]:
    """Fetch unread emails from IMAP"""
    
    logger.info("📬 Fetching unread emails from IMAP...")
    
    if not IMAP_HOST or not IMAP_USER or not IMAP_PASS:
        logger.error("❌ IMAP credentials not configured")
        return []
    
    unread_emails = []
    
    try:
        # Connect to IMAP
        logger.info(f"🔌 Connecting to {IMAP_HOST}:{IMAP_PORT}")
        mail = imaplib.IMAP4_SSL(IMAP_HOST, IMAP_PORT, timeout=10)
        
        logger.info(f"🔑 Logging in as {IMAP_USER}")
        mail.login(IMAP_USER, IMAP_PASS)
        
        # Select INBOX
        mail.select("INBOX")
        
        # Search for unread emails
        status, messages = mail.search(None, "UNSEEN")
        
        if status != "OK":
            logger.error("❌ Failed to search for unread emails")
            mail.close()
            mail.logout()
            return []
        
        email_ids = messages[0].split()
        logger.info(f"📧 Found {len(email_ids)} unread emails")
        
        max_emails = int(os.environ.get("INBOUND_EMAIL_MAX_PER_RUN", "20"))
        email_ids = email_ids[-max_emails:]  # Get last N emails
        
        for email_id in email_ids:
            try:
                status, msg_data = mail.fetch(email_id, "(RFC822)")
                
                if status != "OK":
                    continue
                
                msg = email.message_from_bytes(msg_data[0][1])
                
                # Extract email details
                from_email = msg.get("From", "")
                from_name = decode_email_header(msg.get("From", ""))
                subject = decode_email_header(msg.get("Subject", ""))
                message_id = msg.get("Message-ID", "")
                body = get_email_body(msg)
                
                # Skip if already processed
                if is_email_processed(email_id.decode()):
                    logger.info(f"⏭️  Skipping already processed email: {subject}")
                    continue
                
                # Skip own, no-reply, and automated/bulk emails to avoid reply loops.
                if should_skip_sender(from_email, msg):
                    logger.info(f"⏭️  Skipping own email: {subject}")
                    continue
                
                unread_emails.append({
                    "email_id": email_id.decode(),
                    "from_email": from_email,
                    "from_name": from_name,
                    "subject": subject,
                    "body": body,
                    "message_id": message_id,
                    "received_at": msg.get("Date", "")
                })
                
                logger.info(f"✅ Fetched email: {subject} from {from_email}")
            
            except Exception as e:
                logger.error(f"Error processing email {email_id}: {e}")
                continue
        
        mail.close()
        mail.logout()
        
        return unread_emails
    
    except imaplib.IMAP4.error as e:
        logger.error(f"❌ IMAP error: {e}")
        return []
    except Exception as e:
        logger.error(f"❌ Error fetching emails: {e}")
        return []


def process_inbound_emails() -> Dict:
    """Main function to process inbound emails and send replies"""
    
    logger.info("=" * 60)
    logger.info("Starting inbound email processing")
    logger.info("=" * 60)
    
    # Fetch unread emails
    emails = fetch_unread_emails()
    
    if not emails:
        logger.info("No unread emails to process")
        return {
            "success": True,
            "processed": 0,
            "replied": 0,
            "failed": 0
        }
    
    processed_count = 0
    replied_count = 0
    failed_count = 0
    
    for email_data in emails:
        try:
            logger.info(f"\n📧 Processing: {email_data['subject']}")
            logger.info(f"   From: {email_data['from_email']}")
            
            # Generate AI reply
            logger.info("🤖 Generating AI reply...")
            reply_body = generate_ai_reply(
                from_name=email_data['from_name'],
                from_email=email_data['from_email'],
                subject=email_data['subject'],
                body=email_data['body']
            )
            
            # Send reply
            logger.info("📤 Sending reply...")
            success = send_reply_email(
                to_email=email_data['from_email'],
                to_name=email_data['from_name'],
                subject=email_data['subject'],
                body=reply_body,
                original_message_id=email_data['message_id']
            )
            
            if success:
                record_client_reply_activity(
                    email_data['from_email'],
                    email_data['subject'],
                    email_data['message_id'],
                )
                # Mark as processed
                mark_email_processed(
                    email_data['email_id'],
                    email_data['from_email'],
                    email_data['subject']
                )
                replied_count += 1
                logger.info(f"✅ Reply sent successfully")
            else:
                failed_count += 1
                logger.error(f"❌ Failed to send reply")
            
            processed_count += 1
        
        except Exception as e:
            failed_count += 1
            logger.error(f"❌ Error processing email: {e}")
            import traceback
            logger.error(traceback.format_exc())
    
    logger.info("\n" + "=" * 60)
    logger.info(f"Processing complete:")
    logger.info(f"  Processed: {processed_count}")
    logger.info(f"  Replied: {replied_count}")
    logger.info(f"  Failed: {failed_count}")
    logger.info("=" * 60)
    
    return {
        "success": True,
        "processed": processed_count,
        "replied": replied_count,
        "failed": failed_count,
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    result = process_inbound_emails()
    print(json.dumps(result, indent=2))
