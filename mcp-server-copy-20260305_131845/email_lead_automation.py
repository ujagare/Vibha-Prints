"""
Email Lead Automation System for Vibha Prints
Features:
- Auto-reply to contact form submissions
- Brochure download confirmation emails
- Lead scoring and hot lead alerts
- Follow-up sequences (Day 1, 3, 7)
- AI-powered personalized responses
- Unsubscribe tracking
- Email templates with branding
"""

import os
import json
import smtplib
import re
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path
from datetime import datetime, timedelta
from dotenv import load_dotenv
import logging

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
logger = logging.getLogger("email_automation")

# Zoho SMTP Configuration
ZOHO_SMTP_HOST = os.environ.get("ZOHO_SMTP_HOST", "smtp.zoho.in")
ZOHO_SMTP_PORT = int(os.environ.get("ZOHO_SMTP_PORT", "587"))
ZOHO_SMTP_USER = os.environ.get("ZOHO_SMTP_USER", "info@vibhaprints.com")
ZOHO_SMTP_PASS = os.environ.get("ZOHO_SMTP_PASS", "")
MAIL_FROM = os.environ.get("MAIL_FROM", "info@vibhaprints.com")
BROCHURE_PATH = os.environ.get("BROCHURE_PATH", "")

# Vibha Prints Branding
BRAND_NAME = "Vibha Prints"
BRAND_EMAIL = "info@vibhaprints.com"
BRAND_PHONE = "+91 86259 48046"
BRAND_WEBSITE = (
    os.environ.get("BUSINESS_WEBSITE")
    or os.environ.get("VITE_APP_URL")
    or "https://vibha-prints.vercel.app"
).rstrip("/")

BRAND_SIGNATURE_HTML = f"""
<div style='margin-top:30px;padding-top:20px;border-top:2px solid #6A11CB;'>
    <p style='margin:0;font-size:14px;color:#333;line-height:1.8;'>
        <strong style='color:#6A11CB;'>{BRAND_NAME}</strong><br/>
        Design &amp; Printing Solutions<br/>
        📧 <a href='mailto:{BRAND_EMAIL}' style='color:#6A11CB;text-decoration:none;'>{BRAND_EMAIL}</a><br/>
        📱 <a href='tel:{BRAND_PHONE}' style='color:#6A11CB;text-decoration:none;'>{BRAND_PHONE}</a><br/>
        🌐 <a href='{BRAND_WEBSITE}' style='color:#6A11CB;text-decoration:none;'>{BRAND_WEBSITE}</a>
    </p>
</div>
"""

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


def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: str = "",
    cc_email: str = "",
    attachment_path: str = "",
) -> bool:
    """
    Send email using Zoho SMTP
    
    Args:
        to_email: Recipient email
        subject: Email subject
        html_content: HTML email body
        text_content: Plain text fallback
        cc_email: CC email address (optional)
    
    Returns:
        True if sent successfully, False otherwise
    """
    logger.info(f"📧 Attempting to send email to {to_email}")
    if cc_email:
        logger.info(f"   CC: {cc_email}")
    logger.info(f"ZOHO_SMTP_HOST: {ZOHO_SMTP_HOST}")
    logger.info(f"ZOHO_SMTP_PORT: {ZOHO_SMTP_PORT}")
    logger.info(f"ZOHO_SMTP_USER: {ZOHO_SMTP_USER}")
    logger.info(f"MAIL_FROM: {MAIL_FROM}")
    
    if not ZOHO_SMTP_HOST:
        logger.error("❌ ZOHO_SMTP_HOST not configured")
        return False
    
    if not ZOHO_SMTP_USER:
        logger.error("❌ ZOHO_SMTP_USER not configured")
        return False
    
    if not ZOHO_SMTP_PASS:
        logger.error("❌ ZOHO_SMTP_PASS not configured")
        return False
    
    try:
        logger.info(f"🔌 Connecting to {ZOHO_SMTP_HOST}:{ZOHO_SMTP_PORT}")
        
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = MAIL_FROM
        msg["To"] = to_email
        if cc_email:
            msg["Cc"] = cc_email
        msg["Reply-To"] = MAIL_FROM
        msg["X-Mailer"] = "Vibha Prints MCP Server"
        msg["X-Priority"] = "3"
        
        # Add text and HTML parts
        if text_content:
            msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))
        
        # Attach file if provided and exists
        if attachment_path and os.path.exists(attachment_path):
            try:
                with open(attachment_path, "rb") as file:
                    part = MIMEBase("application", "octet-stream")
                    part.set_payload(file.read())
                encoders.encode_base64(part)
                filename = os.path.basename(attachment_path)
                part.add_header("Content-Disposition", f'attachment; filename="{filename}"')
                msg.attach(part)
                logger.info(f"📎 Attachment added: {filename}")
            except Exception as e:
                logger.error(f"❌ Failed to attach file: {attachment_path} ({e})")

        # Send via Zoho - Use SSL for port 465, TLS for port 587
        if ZOHO_SMTP_PORT == 465:
            logger.info(f"🔐 Starting SSL connection...")
            with smtplib.SMTP_SSL(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10) as server:
                logger.info(f"🔑 Logging in as {ZOHO_SMTP_USER}...")
                server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
                logger.info(f"📤 Sending email...")
                server.send_message(msg)
        else:
            logger.info(f"🔐 Starting TLS connection...")
            with smtplib.SMTP(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=10) as server:
                server.starttls()
                logger.info(f"🔑 Logging in as {ZOHO_SMTP_USER}...")
                server.login(ZOHO_SMTP_USER, ZOHO_SMTP_PASS)
                logger.info(f"📤 Sending email...")
                server.send_message(msg)
        
        logger.info(f"✅ Email sent successfully to {to_email}")
        if cc_email:
            logger.info(f"   CC sent to {cc_email}")
        return True
    
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"❌ SMTP Authentication failed: {e}")
        logger.error(f"   Check ZOHO_SMTP_USER and ZOHO_SMTP_PASS")
        return False
    
    except smtplib.SMTPException as e:
        logger.error(f"❌ SMTP error: {e}")
        return False
    
    except Exception as e:
        logger.error(f"❌ Failed to send email to {to_email}: {type(e).__name__}: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False


def generate_ai_response(lead_name: str, lead_message: str, lead_type: str = "contact") -> str:
    """
    Generate personalized response
    
    Args:
        lead_name: Lead's name
        lead_message: Lead's message
        lead_type: Type of lead (contact or brochure)
    
    Returns:
        Personalized response text
    """
    
    # Simple template-based response (no AI dependency)
    if lead_type == "brochure":
        return f"Namaste {lead_name}! Thank you for downloading our brochure. We're excited to share our design and printing capabilities with you. Agar koi sawal ho to directly contact kar sakte ho!"
    else:
        return f"Namaste {lead_name}! Thank you for reaching out to {BRAND_NAME}. We appreciate your interest and will get back to you shortly with more details about our services. Aapke message ko dekh kar hum aapko best solution provide karenge!"


def send_contact_form_reply(name: str, email: str, message: str) -> bool:
    """
    Send auto-reply to contact form submission
    
    Args:
        name: Lead name
        email: Lead email
        message: Lead message
    
    Returns:
        True if email sent successfully
    """
    # Generate personalized response
    ai_response = generate_ai_response(name, message, "contact")
    
    html_content = f"""
    <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #6A11CB;'>Namaste {name}! 👋</h2>
                
                <p style='font-size: 15px; margin: 15px 0;'>
                    {ai_response}
                </p>
                
                <div style='background-color: #f5f5f5; padding: 15px; border-left: 4px solid #6A11CB; margin: 20px 0;'>
                    <p style='margin: 0; font-size: 14px;'>
                        <strong>Your Message:</strong><br/>
                        {message}
                    </p>
                </div>
                
                <p style='font-size: 14px; color: #666; margin: 20px 0;'>
                    Aap se jald hi contact karenge. Agar koi urgent matter hai toh directly call kar sakte ho.
                </p>
                
                {BRAND_SIGNATURE_HTML}
            </div>
        </body>
    </html>
    """
    
    text_content = f"""
    Namaste {name}!
    
    {ai_response}
    
    Your Message:
    {message}
    
    Aap se jald hi contact karenge. Agar koi urgent matter hai toh directly call kar sakte ho.
    
    Best regards,
    {BRAND_NAME}
    {BRAND_EMAIL}
    {BRAND_PHONE}
    """
    
    subject = f"Thank you for contacting {BRAND_NAME}! 🎨"
    
    # Send to user and CC admin
    return send_email(
        email,
        subject,
        html_content,
        text_content,
        cc_email=MAIL_FROM,
        attachment_path=BROCHURE_PATH,
    )


def send_internal_lead_notification(
    name: str,
    email: str,
    message: str = "",
    phone: str = "",
    company: str = "",
    lead_type: str = "contact",
) -> bool:
    """Send an internal notification for every saved website lead."""
    internal_email = (
        os.environ.get("MAIL_TO")
        or os.environ.get("LEADS_EMAIL_TO")
        or os.environ.get("HOT_LEAD_ALERT_EMAIL")
        or BRAND_EMAIL
    )
    lead_score = score_lead(name, email, message, lead_type)

    html_content = f"""
    <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 640px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #6A11CB;'>New Website Lead</h2>
                <div style='background-color: #f7f4ff; padding: 16px; border-radius: 6px;'>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Phone:</strong> {phone or "-"}</p>
                    <p><strong>Company:</strong> {company or "-"}</p>
                    <p><strong>Type:</strong> {lead_type}</p>
                    <p><strong>Score:</strong> {lead_score['score']}/100 ({lead_score['priority'].upper()})</p>
                </div>
                <div style='margin-top: 16px; padding: 16px; border-left: 4px solid #6A11CB; background: #fafafa;'>
                    <p><strong>Message:</strong></p>
                    <p>{message or "-"}</p>
                </div>
            </div>
        </body>
    </html>
    """

    text_content = f"""
    New Website Lead

    Name: {name}
    Email: {email}
    Phone: {phone or "-"}
    Company: {company or "-"}
    Type: {lead_type}
    Score: {lead_score['score']}/100 ({lead_score['priority'].upper()})

    Message:
    {message or "-"}
    """

    logger.info(f"Internal lead notification channel: email -> {internal_email}")
    return send_email(
        internal_email,
        f"New Website Lead: {name} - {lead_type.upper()}",
        html_content,
        text_content,
    )


def send_brochure_download_email(name: str, email: str, company: str = "") -> bool:
    """
    Send brochure download confirmation email
    
    Args:
        name: Lead name
        email: Lead email
        company: Company name (optional)
    
    Returns:
        True if email sent successfully
    """
    company_text = f" from {company}" if company else ""
    
    html_content = f"""
    <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #6A11CB;'>Brochure Download Confirmed! 📄</h2>
                
                <p style='font-size: 15px; margin: 15px 0;'>
                    Hi {name},<br/>
                    Thank you for downloading our Vibha Prints brochure{company_text}! 
                    We're excited to share our design and printing capabilities with you.
                </p>
                
                <div style='background-color: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                    <h3 style='color: #6A11CB; margin-top: 0;'>What's Inside:</h3>
                    <ul style='margin: 10px 0; padding-left: 20px;'>
                        <li>Logo Design Services</li>
                        <li>Business Card & Stationery</li>
                        <li>Brochure & Packaging Design</li>
                        <li>Digital & Offset Printing</li>
                        <li>Portfolio & Case Studies</li>
                    </ul>
                </div>
                
                <p style='font-size: 14px; margin: 15px 0;'>
                    <strong>Next Steps:</strong><br/>
                    1. Review the brochure<br/>
                    2. Check our portfolio on website<br/>
                    3. Schedule a free consultation call
                </p>
                
                <a href='{BRAND_WEBSITE}/contact' style='display: inline-block; background-color: #6A11CB; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;'>
                    Schedule Consultation
                </a>
                
                <p style='font-size: 13px; color: #666; margin: 20px 0;'>
                    Kisi bhi sawal ke liye directly contact kar sakte ho. Hum 24 hours mein reply denge.
                </p>
                
                {BRAND_SIGNATURE_HTML}
            </div>
        </body>
    </html>
    """
    
    text_content = f"""
    Brochure Download Confirmed!
    
    Hi {name},
    Thank you for downloading our Vibha Prints brochure{company_text}!
    
    What's Inside:
    - Logo Design Services
    - Business Card & Stationery
    - Brochure & Packaging Design
    - Digital & Offset Printing
    - Portfolio & Case Studies
    
    Next Steps:
    1. Review the brochure
    2. Check our portfolio on website
    3. Schedule a free consultation call
    
    Kisi bhi sawal ke liye directly contact kar sakte ho.
    
    Best regards,
    {BRAND_NAME}
    {BRAND_EMAIL}
    {BRAND_PHONE}
    {BRAND_WEBSITE}
    """
    
    subject = f"Your {BRAND_NAME} Brochure is Ready! 📥"
    
    # Send to user and CC admin
    return send_email(
        email,
        subject,
        html_content,
        text_content,
        cc_email=MAIL_FROM,
        attachment_path=BROCHURE_PATH,
    )


def send_followup_email(name: str, email: str, days_since: int = 1) -> bool:
    """
    Send follow-up email based on days since initial contact
    
    Args:
        name: Lead name
        email: Lead email
        days_since: Days since initial contact (1, 3, or 7)
    
    Returns:
        True if email sent successfully
    """
    followup_messages = {
        1: {
            "subject": "Quick Question About Your Design Needs 🎨",
            "body": f"""
            Hi {name},
            
            Just checking in! Did you get a chance to review our services?
            
            We specialize in:
            ✓ Logo Design & Branding
            ✓ Business Cards & Stationery
            ✓ Brochures & Packaging
            ✓ Digital & Offset Printing
            
            Agar koi specific project hai toh hum free consultation de sakte hain.
            """
        },
        2: {
            "subject": "Should We Prepare a Quote?",
            "body": f"""
            Hi {name},

            Just following up once more. If you are still exploring design or printing support, we can prepare a clear quote for you.

            Please reply with:
            - Service required
            - Quantity or scope
            - Timeline
            - Delivery city, if printing is required

            Agar aap interested nahi hain, no problem. Hum follow-up stop kar denge.
            """
        },
        3: {
            "subject": "Special Offer for You! 🎁",
            "body": f"""
            Hi {name},
            
            We'd love to help bring your design vision to life!
            
            This week, we're offering:
            ✓ Free design consultation
            ✓ 2 free revision rounds
            ✓ Quick turnaround (3-5 days)
            
            Interested? Let's chat!
            """
        },
        7: {
            "subject": "Last Chance - Let's Create Something Amazing! ✨",
            "body": f"""
            Hi {name},
            
            We noticed you haven't scheduled a consultation yet.
            
            Don't miss out on professional design services at competitive rates!
            
            Limited slots available this month. Book your free call now.
            """
        }
    }
    
    followup = followup_messages.get(days_since, followup_messages[1])
    
    html_content = f"""
    <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #6A11CB;'>{followup['subject']}</h2>
                
                <p style='font-size: 15px; white-space: pre-wrap; margin: 15px 0;'>
                    {followup['body']}
                </p>
                
                <a href='{BRAND_WEBSITE}/contact' style='display: inline-block; background-color: #6A11CB; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;'>
                    Schedule Free Consultation
                </a>
                
                {BRAND_SIGNATURE_HTML}
            </div>
        </body>
    </html>
    """
    
    text_content = f"""
    {followup['subject']}
    
    {followup['body']}
    
    Schedule Free Consultation: {BRAND_WEBSITE}/contact
    
    Best regards,
    {BRAND_NAME}
    {BRAND_EMAIL}
    {BRAND_PHONE}
    """
    
    return send_email(email, followup['subject'], html_content, text_content)


def score_lead(name: str, email: str, message: str, lead_type: str = "contact") -> dict:
    """
    Score lead based on engagement and message content
    
    Args:
        name: Lead name
        email: Lead email
        message: Lead message
        lead_type: Type of lead
    
    Returns:
        dict with score and priority
    """
    score = 0
    indicators = []
    
    # Message length (more detailed = higher score)
    if len(message) > 100:
        score += 30
        indicators.append("detailed_message")
    elif len(message) > 50:
        score += 15
    
    # Keywords indicating high intent
    high_intent_keywords = [
        "urgent", "asap", "immediately", "jaldi", "quickly",
        "project", "budget", "timeline", "deadline",
        "quote", "pricing", "cost", "investment"
    ]
    
    for keyword in high_intent_keywords:
        if keyword.lower() in message.lower():
            score += 20
            indicators.append(f"keyword_{keyword}")
            break
    
    # Lead type
    if lead_type == "brochure":
        score += 25
        indicators.append("brochure_download")
    
    # Email domain (business email = higher score)
    if "@" in email:
        domain = email.split("@")[1]
        if domain not in ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]:
            score += 15
            indicators.append("business_email")
    
    # Determine priority
    if score >= 70:
        priority = "hot"
    elif score >= 40:
        priority = "warm"
    else:
        priority = "cold"
    
    return {
        "score": min(score, 100),
        "priority": priority,
        "indicators": indicators
    }


def send_hot_lead_alert(
    name: str,
    email: str,
    message: str,
    lead_type: str = "contact",
    force_send: bool = False,
    score_override: dict | None = None,
) -> bool:
    """
    Send internal alert for hot leads
    
    Args:
        name: Lead name
        email: Lead email
        message: Lead message
        lead_type: Type of lead
    
    Returns:
        True if alert sent successfully
    """
    lead_score = score_override or score_lead(name, email, message, lead_type)
    
    if not force_send and lead_score["priority"] != "hot":
        return False
    
    alert_html = f"""
    <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #d32f2f; background-color: #ffebee; padding: 15px; border-radius: 5px;'>
                    🔥 HOT LEAD ALERT!
                </h2>
                
                <div style='background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;'>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Type:</strong> {lead_type}</p>
                    <p><strong>Score:</strong> {lead_score['score']}/100 ({lead_score['priority'].upper()})</p>
                    <p><strong>Indicators:</strong> {', '.join(lead_score['indicators'])}</p>
                </div>
                
                <div style='background-color: #fff3e0; padding: 15px; margin: 15px 0; border-left: 4px solid #ff9800;'>
                    <p><strong>Message:</strong></p>
                    <p>{message}</p>
                </div>
                
                <p style='color: #d32f2f; font-weight: bold;'>
                    ⚡ ACTION REQUIRED: Contact this lead immediately!
                </p>
            </div>
        </body>
    </html>
    """
    
    alert_text = f"""
    🔥 HOT LEAD ALERT!
    
    Name: {name}
    Email: {email}
    Type: {lead_type}
    Score: {lead_score['score']}/100 ({lead_score['priority'].upper()})
    Indicators: {', '.join(lead_score['indicators'])}
    
    Message:
    {message}
    
    ⚡ ACTION REQUIRED: Contact this lead immediately!
    """
    
    # Send to internal email
    internal_email = (
        os.environ.get("HOT_LEAD_ALERT_EMAIL")
        or os.environ.get("MAIL_TO")
        or os.environ.get("LEADS_EMAIL_TO")
        or BRAND_EMAIL
    )
    logger.info(f"Hot lead alert channel: email -> {internal_email}")
    return send_email(
        internal_email,
        f"🔥 HOT LEAD: {name} - {lead_type.upper()}",
        alert_html,
        alert_text
    )
