"""
Email Automation System - Production Grade
Features:
- Behavior-based follow-ups (Day 2, 4, 7, 10)
- Rate limiting with hourly reset
- Cron overlap prevention (lock file)
- Bounce tracking
- Hot lead alerts (once only)
- Stage-based logic (stops if converted)
- Unsubscribe support
- Duplicate prevention
"""

import os
import json
import smtplib
import re
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
import time
import sys

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")

LEADS_PATH = Path(__file__).parent / "data" / "leads.json"
BOUNCE_LOG = Path(__file__).parent / "data" / "email_bounces.json"
LOCK_FILE = Path(__file__).parent / "data" / "email_automation.lock"
RATE_LIMIT_FILE = Path(__file__).parent / "data" / "rate_limit.json"

# Zoho Safe Limits (10GB paid plan)
MAX_EMAILS_PER_HOUR = 100
DELAY_BETWEEN_EMAILS = 1  # seconds
SERVICES = [
    "Web Development",
    "E-commerce Solutions",
    "UI/UX Design",
    "SEO Optimization",
    "Digital Marketing",
    "AI Solutions & Chatbots",
]
BRAND_SIGNATURE_TEXT_EN = (
    "Best regards,\n"
    "CodeSunny Team\n"
    "Web & Digital Solutions\n"
    "Email: information@codesunny.in | Phone: +91 89758075789 | https://codesunny.com"
)
BRAND_SIGNATURE_TEXT_HI = (
    "Dhanyavaad,\n"
    "CodeSunny Team\n"
    "Web & Digital Solutions\n"
    "Email: information@codesunny.in | Phone: +91 89758075789 | https://codesunny.com"
)
BRAND_SIGNATURE_HTML = (
    "<hr style='border:1px solid #e5e7eb;margin-top:20px;margin-bottom:14px;'/>"
    "<p style='margin:0;line-height:1.6;'>"
    "<strong>CodeSunny Team</strong><br/>"
    "Web &amp; Digital Solutions<br/>"
    "Email: <a href='mailto:information@codesunny.in'>information@codesunny.in</a><br/>"
    "Phone: <a href='tel:+918975807578'>+91 89758075789</a><br/>"
    "<a href='https://codesunny.com'>codesunny.com</a>"
    "</p>"
)
PROFESSIONAL_FOOTER_HTML = (
    "<div style='margin-top:20px;padding-top:14px;border-top:1px solid #e5e7eb;'>"
    "<p style='margin:0;font-size:13px;color:#334155;line-height:1.6;'>"
    "<strong>CodeSunny Team</strong><br/>"
    "Web &amp; Digital Solutions<br/>"
    "Email: <a href='mailto:information@codesunny.in'>information@codesunny.in</a> | "
    "Phone: <a href='tel:+918975807578'>+91 89758075789</a><br/>"
    "<a href='https://codesunny.com'>codesunny.com</a>"
    "</p>"
    "</div>"
)

groq_client = None
gemini_client = None
if GROQ_AVAILABLE and os.environ.get("GROQ_API_KEY"):
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
if GEMINI_AVAILABLE and os.environ.get("GEMINI_API_KEY"):
    gemini_client = create_gemini_model(
        os.environ.get("GEMINI_API_KEY"),
        os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
    )


def acquire_lock():
    """Prevent concurrent runs"""
    if LOCK_FILE.exists():
        # Check if lock is stale (older than 1 hour)
        lock_age = time.time() - LOCK_FILE.stat().st_mtime
        if lock_age < 3600:  # 1 hour
            print("❌ Another instance is running. Exiting.")
            sys.exit(0)
        else:
            print("⚠️  Removing stale lock file")
            LOCK_FILE.unlink()
    
    LOCK_FILE.write_text(str(os.getpid()))
    print("✅ Lock acquired")


def release_lock():
    """Release lock file"""
    if LOCK_FILE.exists():
        LOCK_FILE.unlink()
        print("✅ Lock released")


def get_rate_limit_counter():
    """Get current hour's email count"""
    if not RATE_LIMIT_FILE.exists():
        return {"hour": datetime.utcnow().hour, "count": 0}
    
    with open(RATE_LIMIT_FILE, 'r') as f:
        data = json.load(f)
    
    current_hour = datetime.utcnow().hour
    
    # Reset counter if hour changed
    if data.get("hour") != current_hour:
        data = {"hour": current_hour, "count": 0}
    
    return data


def increment_rate_limit():
    """Increment email counter for current hour"""
    data = get_rate_limit_counter()
    data["count"] += 1
    
    with open(RATE_LIMIT_FILE, 'w') as f:
        json.dump(data, f)
    
    return data["count"]


def load_leads():
    """Load all leads"""
    if not LEADS_PATH.exists():
        return []
    with open(LEADS_PATH, 'r') as f:
        return json.load(f)


def save_leads(leads):
    """Save leads"""
    with open(LEADS_PATH, 'w') as f:
        json.dump(leads, f, indent=2)


def log_bounce(email, reason):
    """Log bounced emails"""
    bounces = []
    if BOUNCE_LOG.exists():
        with open(BOUNCE_LOG, 'r') as f:
            bounces = json.load(f)
    
    bounces.append({
        "email": email,
        "reason": reason,
        "timestamp": datetime.utcnow().isoformat() + 'Z'
    })
    
    with open(BOUNCE_LOG, 'w') as f:
        json.dump(bounces, f, indent=2)


def send_email(to_email, subject, html_content, text_content):
    """
    Send email using Zoho SMTP with best practices
    """
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    
    if not all([host, user, password, email_from]):
        print("❌ SMTP not configured")
        return False
    
    # Create multipart message
    msg = MIMEMultipart("alternative")
    clean_subject = re.sub(r"[^\w\s\-\|\:\,\.\(\)\/&+]", "", subject or "").strip()
    msg["Subject"] = clean_subject or "CodeSunny Update"
    msg["From"] = f"CodeSunny Team <{email_from}>"  # Branded sender
    msg["To"] = to_email
    msg["Reply-To"] = email_from
    
    # Force professional footer + unsubscribe block
    if "codesunny team" not in (text_content or "").lower():
        text_content = f"{(text_content or '').strip()}\n\n{BRAND_SIGNATURE_TEXT_EN}"
    html_content = f"{(html_content or '').strip()}{PROFESSIONAL_FOOTER_HTML}"

    # Add unsubscribe link
    unsubscribe_link = f"https://codesunny.com/unsubscribe?email={to_email}"
    text_content += f"\n\nUnsubscribe: {unsubscribe_link}"
    html_content += f'<p style="font-size: 11px; color: #999; margin-top: 30px;">If you don\'t wish to receive further emails, <a href="{unsubscribe_link}">click here</a>.</p>'
    
    # Attach both plain text and HTML
    part1 = MIMEText(text_content, "plain")
    part2 = MIMEText(html_content, "html")
    msg.attach(part1)
    msg.attach(part2)
    
    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, timeout=30) as server:
                server.login(user, password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(host, port, timeout=30) as server:
                server.starttls()
                server.login(user, password)
                server.send_message(msg)
        
        # Increment rate limit counter
        increment_rate_limit()
        
        # Rate limiting (Zoho safe)
        time.sleep(DELAY_BETWEEN_EMAILS)
        return True
        
    except smtplib.SMTPRecipientsRefused as e:
        print(f"❌ Recipient refused: {to_email}")
        log_bounce(to_email, "recipient_refused")
        return False
    except Exception as e:
        print(f"❌ Email error: {e}")
        log_bounce(to_email, str(e))
        return False


def detect_services_from_lead(lead):
    text = " ".join(
        [
            str(lead.get("message", "")),
            " ".join(lead.get("services_interested", [])),
            str(lead.get("service", "")),
        ]
    ).lower()

    matched = []
    if any(k in text for k in ["web", "website", "landing"]):
        matched.append("Web Development")
    if any(k in text for k in ["ecommerce", "e-commerce", "store", "shop"]):
        matched.append("E-commerce Solutions")
    if any(k in text for k in ["ui", "ux", "design", "figma"]):
        matched.append("UI/UX Design")
    if any(k in text for k in ["seo", "ranking", "organic", "pagespeed"]):
        matched.append("SEO Optimization")
    if any(k in text for k in ["marketing", "ads", "meta ads", "google ads"]):
        matched.append("Digital Marketing")
    if any(k in text for k in ["ai", "chatbot", "automation", "agent"]):
        matched.append("AI Solutions & Chatbots")

    return matched or SERVICES[:2]


def detect_language(text: str) -> str:
    content = (text or "").strip()
    if re.search(r"[\u0900-\u097F]", content):
        return "hi"
    roman_hi_markers = [
        "namaste", "nahi", "hai", "hume", "mujhe", "chahiye", "kripya",
        "aap", "karna", "kijiye", "kaise", "kitna", "sampark",
    ]
    if any(token in content.lower() for token in roman_hi_markers):
        return "hi"
    return "en"


def sanitize_percent_claims(text: str) -> str:
    return re.sub(
        r"\b\d+\s*%\s+(increase|decrease|growth|boost|improvement)\b",
        "measurable improvement",
        text,
        flags=re.IGNORECASE,
    )


def enforce_brand_format(name: str, subject: str, html: str, text: str, language: str):
    subj = (subject or "").strip() or "CodeSunny Update"
    txt = (text or "").strip()
    htm = (html or "").strip()

    txt = txt.replace("Dear Prospect,", f"Hi {name},")
    txt = txt.replace("Dear Client,", f"Hi {name},")
    txt = sanitize_percent_claims(txt)
    htm = sanitize_percent_claims(htm)

    if not txt.lower().startswith(f"hi {name.lower()}"):
        txt = f"Hi {name},\n\n{txt}"

    signature = BRAND_SIGNATURE_TEXT_HI if language == "hi" else BRAND_SIGNATURE_TEXT_EN
    if "codesunny team" not in txt.lower():
        txt = f"{txt}\n\n{signature}"

    if "<html" not in htm.lower():
        htm = f"<p>{txt.replace(chr(10), '<br/>')}</p>"
    if "codesunny team" not in htm.lower():
        htm = f"{htm}{BRAND_SIGNATURE_HTML}"

    return subj, htm, txt


def generate_ai_followup_email(lead, stage_key):
    """
    Generate stage-specific follow-up content using Groq/Gemini.
    Returns (subject, html, text) or None on failure.
    """
    lead_name = lead.get("name", "there")
    lead_msg = lead.get("message", "")
    services = detect_services_from_lead(lead)
    language = detect_language(lead_msg)

    stage_instruction = {
        "day2": "Send value-first follow-up with one relevant case-study angle and soft CTA.",
        "day4": "Send gentle check-in with one clear next step.",
        "day7": "Send limited-time offer follow-up with urgency but no pressure.",
        "day10": "Send final polite check-in and keep door open.",
    }.get(stage_key, "Send concise follow-up with clear CTA.")

    prompt = f"""
You write sales follow-up emails for CodeSunny.

Allowed services: {", ".join(SERVICES)}
Lead interested services: {", ".join(services)}
Lead name: {lead_name}
Lead message: {lead_msg}
Stage: {stage_key}
Output language: {"Hindi/Hinglish" if language == "hi" else "English"}
Instruction: {stage_instruction}

Return ONLY JSON in this exact shape:
{{
  "subject": "...",
  "html": "<p>...</p>",
  "text": "..."
}}

Rules:
- 120-180 words max
- Personalized to lead requirement
- Strictly professional and concise
- Opening should be "Hi {lead_name},"
- Do not invent guarantees or fake performance stats
- Do not use random numbers like 300% unless explicitly present in lead message
- Include one CTA
""".strip()

    raw = ""
    try:
        if groq_client:
            model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
            resp = groq_client.chat.completions.create(
                model=model,
                temperature=0.4,
                max_tokens=500,
                messages=[
                    {"role": "system", "content": "Return valid JSON only."},
                    {"role": "user", "content": prompt},
                ],
            )
            raw = resp.choices[0].message.content or ""
        elif gemini_client:
            resp = gemini_client.generate_content(prompt)
            raw = resp.text or ""
        else:
            return None

        start = raw.find("{")
        end = raw.rfind("}")
        if start == -1 or end == -1 or end <= start:
            return None

        data = json.loads(raw[start : end + 1])
        subject = (data.get("subject") or "").strip()
        html = (data.get("html") or "").strip()
        text = (data.get("text") or "").strip()
        if not (subject and html and text):
            return None

        return enforce_brand_format(lead_name, subject, html, text, language)
    except Exception as e:
        print(f"AI follow-up generation failed ({stage_key}): {e}")
        return None


def send_followup_day2(lead):
    """Day 2: Value email (case study)"""
    name = lead.get('name', 'there')
    email = lead.get('email', '')
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">How We Helped Similar Businesses</h2>
            
            <p>Hi {name},</p>
            
            <p>I wanted to share a quick success story that might interest you.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h3 style="margin-top: 0; color: #2563eb;">Case Study: E-commerce Success</h3>
                <p><strong>Client:</strong> Fashion Retail Store</p>
                <p><strong>Challenge:</strong> Low online sales, poor mobile experience</p>
                <p><strong>Solution:</strong> Modern e-commerce platform with AI recommendations</p>
                <p><strong>Result:</strong> 300% increase in online sales within 3 months</p>
            </div>
            
            <p>We can create a similar solution tailored to your needs.</p>
            
            <p><a href="https://codesunny.com/case-studies" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View More Case Studies</a></p>
            
            <p>Questions? Just reply to this email.</p>
            
            <p>Best regards,<br>
            <strong>CodeSunny Team</strong></p>
        </div>
    </body>
    </html>
    """
    
    text = f"Hi {name},\n\nSharing a success story: Fashion retail client saw 300% sales increase with our e-commerce solution.\n\nWe can help you too!\n\nBest regards,\nCodeSunny Team"
    
    ai = generate_ai_followup_email(lead, "day2")
    if ai:
        return send_email(email, ai[0], ai[1], ai[2])
    return send_email(email, "How We Helped Similar Businesses - CodeSunny", html, text)


def send_followup_day4(lead):
    """Day 4: Gentle follow-up"""
    name = lead.get('name', 'there')
    email = lead.get('email', '')
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Quick Check-In</h2>
            
            <p>Hi {name},</p>
            
            <p>I wanted to check if you had any questions about our services.</p>
            
            <p>Here are some quick resources that might help:</p>
            
            <ul>
                <li>📱 <a href="https://codesunny.com/book-call">Schedule a free consultation</a></li>
                <li>💰 <a href="https://codesunny.com/quote">Get instant quote</a></li>
                <li>🔍 <a href="https://codesunny.com/seo-audit">Free SEO audit</a></li>
            </ul>
            
            <p>No pressure - just here to help when you're ready!</p>
            
            <p>Best regards,<br>
            <strong>CodeSunny Team</strong></p>
        </div>
    </body>
    </html>
    """
    
    text = f"Hi {name},\n\nJust checking in! Let me know if you have any questions.\n\nQuick links:\n- Schedule call: codesunny.com/book-call\n- Get quote: codesunny.com/quote\n\nBest regards,\nCodeSunny Team"
    
    ai = generate_ai_followup_email(lead, "day4")
    if ai:
        return send_email(email, ai[0], ai[1], ai[2])
    return send_email(email, "Quick Check-In - CodeSunny", html, text)


def send_followup_day7(lead):
    """Day 7: Limited offer"""
    name = lead.get('name', 'there')
    email = lead.get('email', '')
    budget = lead.get('budget_range', '')
    
    # Personalize discount based on budget
    discount = "10% OFF"
    if budget and any(x in str(budget) for x in ['50000', '100000', '₹50', '₹100']):
        discount = "15% OFF"
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Special Offer Just for You</h2>
            
            <p>Hi {name},</p>
            
            <p>I wanted to share an exclusive offer before we close your inquiry:</p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin: 20px 0; text-align: center;">
                <h3 style="margin: 0; color: white; font-size: 28px;">{discount}</h3>
                <p style="font-size: 18px; margin: 10px 0;">On your first project with us!</p>
                <p style="margin: 0; font-size: 14px;">Valid for 48 hours only</p>
            </div>
            
            <p>This is a limited-time offer exclusively for you.</p>
            
            <p><a href="https://codesunny.com/contact" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">Claim Your Discount Now</a></p>
            
            <p>Questions? Reply to this email or call us at +91 89758075789</p>
            
            <p>Best regards,<br>
            <strong>CodeSunny Team</strong></p>
        </div>
    </body>
    </html>
    """
    
    text = f"Hi {name},\n\nSpecial offer: {discount} on your first project!\n\nValid for 48 hours only.\n\nClaim now: codesunny.com/contact\n\nBest regards,\nCodeSunny Team"
    
    ai = generate_ai_followup_email(lead, "day7")
    if ai:
        return send_email(email, ai[0], ai[1], ai[2])
    return send_email(email, f"Exclusive Offer: {discount} - CodeSunny", html, text)


def send_followup_day10(lead):
    """Day 10: Final reminder"""
    name = lead.get('name', 'there')
    email = lead.get('email', '')
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Final Check-In</h2>
            
            <p>Hi {name},</p>
            
            <p>This is my last email - I don't want to spam you!</p>
            
            <p>If you're still interested in working together, I'm here to help. If not, no worries at all.</p>
            
            <p>Either way, I wish you the best with your project!</p>
            
            <p>Feel free to reach out anytime:</p>
            <ul>
                <li>📧 Email: information@codesunny.in</li>
                <li>📱 Phone: +91 89758075789</li>
                <li>🌐 Website: codesunny.com</li>
            </ul>
            
            <p>Best regards,<br>
            <strong>CodeSunny Team</strong></p>
        </div>
    </body>
    </html>
    """
    
    text = f"Hi {name},\n\nFinal check-in! If you're interested, I'm here to help. If not, no worries!\n\nContact: information@codesunny.in | +91 89758075789\n\nBest regards,\nCodeSunny Team"
    
    ai = generate_ai_followup_email(lead, "day10")
    if ai:
        return send_email(email, ai[0], ai[1], ai[2])
    return send_email(email, "Final Check-In - CodeSunny", html, text)


def send_admin_alert(lead, reason):
    """Send alert to admin for hot leads"""
    admin_email = os.environ.get("LEADS_EMAIL_TO")
    if not admin_email:
        return
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #f59e0b; border-radius: 8px;">
            <h2 style="color: #f59e0b;">🔥 Hot Lead Alert!</h2>
            
            <p><strong>Reason:</strong> {reason}</p>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Name:</strong> {lead.get('name', 'N/A')}</p>
                <p><strong>Email:</strong> {lead.get('email', 'N/A')}</p>
                <p><strong>Budget:</strong> {lead.get('budget_range', 'N/A')}</p>
                <p><strong>Services:</strong> {', '.join(lead.get('services_interested', []))}</p>
            </div>
            
            <p><strong>Action Required:</strong> Personal follow-up recommended</p>
        </div>
    </body>
    </html>
    """
    
    text = f"Hot Lead Alert!\n\nName: {lead.get('name')}\nEmail: {lead.get('email')}\nReason: {reason}\n\nAction required!"
    
    send_email(admin_email, f"🔥 Hot Lead: {lead.get('name')} - Action Required", html, text)


def check_and_send_followups():
    """Smart follow-up system with behavior-based logic"""
    leads = load_leads()
    now = datetime.utcnow()
    
    # Get current rate limit
    rate_data = get_rate_limit_counter()
    emails_sent_this_hour = rate_data["count"]
    
    print(f"📊 Rate limit: {emails_sent_this_hour}/{MAX_EMAILS_PER_HOUR} emails sent this hour")
    
    emails_sent_now = 0
    
    for lead in leads:
        # Skip if no email
        email = lead.get('email', '')
        if not email:
            continue
        
        # STOP if converted
        if lead.get('stage') == 'closed_won':
            continue
        
        # Skip if unsubscribed
        if lead.get('unsubscribed'):
            continue
        
        # Calculate days since creation
        created_at_str = lead.get('created_at', '')
        if not created_at_str:
            continue
            
        try:
            created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
        except:
            continue
            
        days_ago = (now - created_at).days
        
        # Rate limit check (Zoho safe)
        if emails_sent_this_hour + emails_sent_now >= MAX_EMAILS_PER_HOUR:
            print(f"⚠️  Rate limit reached ({MAX_EMAILS_PER_HOUR}/hour). Stopping.")
            break
        
        # Day 2: Value email
        if days_ago == 2 and not lead.get('followup_day2_sent'):
            print(f"📧 Sending Day 2 value email to {email}")
            if send_followup_day2(lead):
                lead['followup_day2_sent'] = True
                lead['followup_day2_date'] = now.isoformat() + 'Z'
                emails_sent_now += 1
        
        # Day 4: Gentle follow-up
        elif days_ago == 4 and not lead.get('followup_day4_sent'):
            print(f"📧 Sending Day 4 follow-up to {email}")
            if send_followup_day4(lead):
                lead['followup_day4_sent'] = True
                lead['followup_day4_date'] = now.isoformat() + 'Z'
                emails_sent_now += 1
        
        # Day 7: Limited offer
        elif days_ago == 7 and not lead.get('followup_day7_sent'):
            print(f"📧 Sending Day 7 offer to {email}")
            if send_followup_day7(lead):
                lead['followup_day7_sent'] = True
                lead['followup_day7_date'] = now.isoformat() + 'Z'
                emails_sent_now += 1
        
        # Day 10: Final reminder
        elif days_ago == 10 and not lead.get('followup_day10_sent'):
            print(f"📧 Sending Day 10 final reminder to {email}")
            if send_followup_day10(lead):
                lead['followup_day10_sent'] = True
                lead['followup_day10_date'] = now.isoformat() + 'Z'
                emails_sent_now += 1
        
        # Hot lead detection (ONCE ONLY)
        budget = lead.get('budget_range', '')
        if budget and any(x in str(budget) for x in ['50000', '100000', '₹50', '₹100']):
            if days_ago >= 5 and not lead.get('admin_alerted'):
                print(f"🔥 Hot lead detected: {email}")
                send_admin_alert(lead, f"High budget ({budget}), no response in {days_ago} days")
                lead['admin_alerted'] = True
                # Don't count admin alerts in rate limit
    
    save_leads(leads)
    print(f"\n✅ Sent {emails_sent_now} emails this run")
    print(f"📊 Total this hour: {emails_sent_this_hour + emails_sent_now}/{MAX_EMAILS_PER_HOUR}")


if __name__ == "__main__":
    try:
        print("\n" + "="*60)
        print("🤖 EMAIL AUTOMATION SYSTEM - PRODUCTION GRADE")
        print("="*60 + "\n")
        
        # Acquire lock to prevent concurrent runs
        acquire_lock()
        
        print("Features:")
        print("  ✅ Behavior-based follow-ups")
        print("  ✅ Rate limiting with hourly reset")
        print("  ✅ Cron overlap prevention")
        print("  ✅ Bounce tracking")
        print("  ✅ Hot lead alerts (once only)")
        print("  ✅ Stage-based logic")
        print("  ✅ Unsubscribe support")
        print("\nChecking for follow-ups...\n")
        
        check_and_send_followups()
        
        print("\n✅ Done!\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
    finally:
        # Always release lock
        release_lock()

