"""
Inbound Email AI Agent (Vibha Prints)

Reads unread client emails from inbox and sends AI-generated replies with:
- self-mail and auto-generated mail filters
- duplicate/reply-loop prevention via Message-ID tracking
- fallback replies when AI is unavailable
"""

import email
import imaplib
import json
import logging
import os
import re
import smtplib
from datetime import datetime, timezone
from email.header import decode_header
from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv
from email_workflow import clean_email, clean_name, record_inbound_workflow

try:
    from groq import Groq

    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

SERVICES = [
    "Graphic Design",
    "Logo Design",
    "Business Card Design & Printing",
    "Brochure & Pamphlet Design",
    "Packaging Design",
    "Digital & Offset Printing",
]

BRAND_SIGNATURE_EN = (
    "Best regards,\n"
    "Vibha Prints Team\n"
    "Design & Printing Solutions\n"
    "Email: info@vibhaprints.com | Phone: +91 86259 48046 | https://vibhaprints.com"
)

BRAND_SIGNATURE_HI = (
    "Dhanyavaad,\n"
    "Vibha Prints Team\n"
    "Design & Printing Solutions\n"
    "Email: info@vibhaprints.com | Phone: +91 86259 48046 | https://vibhaprints.com"
)

DATA_DIR = Path(__file__).parent / "data"
PROCESSED_IDS_FILE = DATA_DIR / "processed_inbound_message_ids.json"
MAX_TRACKED_IDS = 5000

logger = logging.getLogger("inbound_email_ai_agent")


def decode_text(value: str) -> str:
    if not value:
        return ""
    parts = decode_header(value)
    out = []
    for chunk, enc in parts:
        if isinstance(chunk, bytes):
            out.append(chunk.decode(enc or "utf-8", errors="ignore"))
        else:
            out.append(chunk)
    return "".join(out).strip()


def extract_plain_text(msg) -> str:
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            disp = str(part.get("Content-Disposition", ""))
            if ctype == "text/plain" and "attachment" not in disp:
                payload = part.get_payload(decode=True)
                if payload:
                    return payload.decode(errors="ignore").strip()
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            return payload.decode(errors="ignore").strip()
    return ""


def load_processed_ids() -> list[str]:
    if not PROCESSED_IDS_FILE.exists():
        return []
    try:
        return json.loads(PROCESSED_IDS_FILE.read_text(encoding="utf-8"))
    except Exception:
        return []


def save_processed_ids(ids: list[str]):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    trimmed = ids[-MAX_TRACKED_IDS:]
    PROCESSED_IDS_FILE.write_text(json.dumps(trimmed, indent=2), encoding="utf-8")


def get_ai_client():
    groq_client = None
    gemini_client = None

    groq_key = os.environ.get("GROQ_API_KEY", "").strip()
    if GROQ_AVAILABLE and groq_key:
        groq_client = Groq(api_key=groq_key)

    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if GEMINI_AVAILABLE and gemini_key:
        gemini_client = create_gemini_model(
            gemini_key,
            os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
        )

    return groq_client, gemini_client


def detect_language(text: str) -> str:
    content = text or ""
    if re.search(r"[\u0900-\u097F]", content):
        return "hi"
    roman_hi_markers = [
        "namaste",
        "nahi",
        "hai",
        "hume",
        "mujhe",
        "chahiye",
        "kripya",
        "aap",
        "karna",
        "kijiye",
        "kaise",
        "kitna",
        "sampark",
    ]
    if any(token in content.lower() for token in roman_hi_markers):
        return "hi"
    return "en"


def sanitize_claims(text: str) -> str:
    return re.sub(
        r"\b\d+\s*%\s+(increase|decrease|growth|boost|improvement)\b",
        "measurable improvement",
        text,
        flags=re.IGNORECASE,
    )


def enforce_professional_reply(
    client_name: str, subject: str, body: str, language: str
) -> tuple[str, str]:
    out_subject = (subject or "").strip()
    if out_subject and not out_subject.lower().startswith("re:"):
        out_subject = f"Re: {out_subject}"
    if not out_subject:
        out_subject = "Re: Your Query - Vibha Prints"

    out_body = (body or "").strip()
    out_body = out_body.replace("Dear Prospect,", f"Hi {client_name},")
    out_body = out_body.replace("Dear Client,", f"Hi {client_name},")
    out_body = sanitize_claims(out_body)

    if not out_body.lower().startswith(f"hi {client_name.lower()}"):
        out_body = f"Hi {client_name},\n\n{out_body}"

    signature = BRAND_SIGNATURE_HI if language == "hi" else BRAND_SIGNATURE_EN
    if "vibha prints team" not in out_body.lower():
        out_body = f"{out_body}\n\n{signature}"

    return out_subject, out_body


def generate_ai_reply(client_name: str, subject: str, body: str) -> tuple[str, str]:
    groq_client, gemini_client = get_ai_client()
    language = detect_language(f"{subject}\n{body}")

    prompt = f"""
You are Vibha Prints's email assistant.

Client name: {client_name or "Client"}
Client subject: {subject}
Client email body:
{body[:2500]}

Available services:
{", ".join(SERVICES)}
Output language: {"Hindi/Hinglish" if language == "hi" else "English"}

Task:
1) Understand client requirement.
2) Reply professionally and clearly.
3) Mention only relevant services.
4) Ask max 2 clarifying questions if needed.
5) Add one CTA: schedule call or request details.
6) Opening must be "Hi {client_name},"
7) Do not use fake claims or unsupported percentages.

Return only JSON:
{{
  "body": "..."
}}
""".strip()

    raw = ""
    if groq_client:
        model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
        resp = groq_client.chat.completions.create(
            model=model,
            temperature=0.4,
            max_tokens=550,
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
        fallback_subject = f"Re: {subject}" if subject else "Re: Your Query - Vibha Prints"
        fallback_body = (
            "Thank you for reaching out. Please share your exact requirements, preferred timeline, and budget so we can suggest the best package for you."
        )
        return enforce_professional_reply(client_name, fallback_subject, fallback_body, language)

    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1 or end <= start:
        fallback_subject = f"Re: {subject}" if subject else "Re: Your Query - Vibha Prints"
        fallback_body = (
            "Thank you for your email. We reviewed your requirement and our team can help. Please share your timeline and budget so we can send a precise proposal."
        )
        return enforce_professional_reply(client_name, fallback_subject, fallback_body, language)

    data = json.loads(raw[start : end + 1])
    out_subject = f"Re: {subject}" if subject else "Re: Your Query - Vibha Prints"
    out_body = (data.get("body") or "").strip() or (
        "Thank you for your message. We can help. Please share key details to proceed."
    )
    return enforce_professional_reply(client_name, out_subject, out_body, language)


def send_reply(to_email: str, subject: str, body: str):
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    if not all([host, user, password, email_from]):
        raise RuntimeError("SMTP not configured")

    msg = EmailMessage()
    msg["From"] = f"Vibha Prints Team <{email_from}>"
    msg["To"] = to_email
    clean_subject = re.sub(r"[^\w\s\-\|\:\,\.\(\)\/&+]", "", subject or "").strip()
    msg["Subject"] = clean_subject or "Re: Your Query - Vibha Prints"
    msg["Reply-To"] = email_from
    msg.set_content(body)
    html_body = (
        f"<div style='font-family:Arial,sans-serif;line-height:1.7;color:#1f2937;'>"
        f"<p>{body.replace(chr(10), '<br/>')}</p>"
        f"<div style='margin-top:20px;padding-top:14px;border-top:1px solid #e5e7eb;'>"
        f"<p style='margin:0;font-size:13px;color:#334155;line-height:1.6;'>"
        f"<strong>Vibha Prints Team</strong><br/>"
        f"Design &amp; Printing Solutions<br/>"
        f"Email: <a href='mailto:info@vibhaprints.com'>info@vibhaprints.com</a> | "
        f"Phone: <a href='tel:+918625948046'>+91 86259 48046</a><br/>"
        f"<a href='https://vibhaprints.com'>vibhaprints.com</a>"
        f"</p></div></div>"
    )
    msg.add_alternative(html_body, subtype="html")

    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=30) as server:
            server.login(user, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=30) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)


def is_auto_or_system_email(msg, sender_email: str) -> bool:
    auto_submitted = (msg.get("Auto-Submitted", "") or "").lower()
    if auto_submitted and auto_submitted != "no":
        return True

    precedence = (msg.get("Precedence", "") or "").lower()
    if precedence in {"bulk", "junk", "list", "auto_reply"}:
        return True

    if any(
        token in sender_email
        for token in ["mailer-daemon", "postmaster", "no-reply", "noreply"]
    ):
        return True

    return False


def process_unread(max_per_run: int | None = None) -> dict:
    enabled = os.environ.get("INBOUND_AUTO_REPLY_ENABLED", "true").strip().lower()
    if enabled not in {"1", "true", "yes", "on"}:
        logger.info("Inbound auto-reply disabled by INBOUND_AUTO_REPLY_ENABLED.")
        return {"processed": 0, "replied": 0, "skipped": 0, "errors": 0}

    imap_host = os.environ.get("IMAP_HOST", "").strip()
    imap_port = int(os.environ.get("IMAP_PORT", "993"))
    imap_user = os.environ.get("IMAP_USER", "").strip()
    imap_pass = os.environ.get("IMAP_PASS", "").strip()
    own_email = (os.environ.get("SMTP_FROM", "") or "").strip().lower()
    per_run_limit = max_per_run or int(os.environ.get("INBOUND_EMAIL_MAX_PER_RUN", "20"))
    reply_mode = os.environ.get("INBOUND_REPLY_MODE", "auto").strip().lower()
    if reply_mode not in {"auto", "draft"}:
        logger.warning("Invalid INBOUND_REPLY_MODE=%s; falling back to auto.", reply_mode)
        reply_mode = "auto"

    if not all([imap_host, imap_user, imap_pass]):
        logger.warning("IMAP not configured. Set IMAP_HOST/IMAP_USER/IMAP_PASS")
        return {"processed": 0, "replied": 0, "skipped": 0, "errors": 0}

    processed_ids = load_processed_ids()
    processed_set = set(processed_ids)

    stats = {
        "processed": 0,
        "replied": 0,
        "drafted": 0,
        "quote_created": 0,
        "hot_alerts": 0,
        "skipped": 0,
        "errors": 0,
    }

    with imaplib.IMAP4_SSL(imap_host, imap_port) as mail:
        mail.login(imap_user, imap_pass)
        mail.select("INBOX")
        status, data = mail.search(None, "UNSEEN")
        if status != "OK":
            logger.error("Failed to search inbox")
            return stats

        ids = data[0].split()
        if not ids:
            logger.info("No unread emails.")
            return stats

        for msg_id in ids[:per_run_limit]:
            status, msg_data = mail.fetch(msg_id, "(RFC822)")
            if status != "OK" or not msg_data:
                stats["skipped"] += 1
                continue

            stats["processed"] += 1
            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)

            sender = decode_text(msg.get("From", ""))
            subject = decode_text(msg.get("Subject", ""))
            body = extract_plain_text(msg)
            message_id = (msg.get("Message-ID", "") or "").strip()

            sender_email = clean_email(sender)
            if not sender_email or sender_email == own_email:
                stats["skipped"] += 1
                continue

            if is_auto_or_system_email(msg, sender_email):
                stats["skipped"] += 1
                continue

            if message_id and message_id in processed_set:
                stats["skipped"] += 1
                continue

            client_name = clean_name(sender)
            try:
                reply_subject, reply_body = generate_ai_reply(client_name, subject, body)
                sent = False
                if reply_mode == "auto":
                    send_reply(sender_email, reply_subject, reply_body)
                    sent = True
                    stats["replied"] += 1
                else:
                    stats["drafted"] += 1

                workflow = record_inbound_workflow(
                    sender_name=client_name,
                    sender_email=sender_email,
                    subject=subject,
                    body=body,
                    reply_subject=reply_subject,
                    reply_body=reply_body,
                    reply_mode=reply_mode,
                    sent=sent,
                    message_id=message_id,
                )
                if workflow.get("quote_created"):
                    stats["quote_created"] += 1
                if workflow.get("hot_alert_sent"):
                    stats["hot_alerts"] += 1
                logger.info(
                    "[%s] Inbound %s for %s | Subject: %s | Lead: %s",
                    datetime.now(timezone.utc).isoformat(),
                    "replied" if sent else "drafted",
                    sender_email,
                    reply_subject,
                    workflow.get("lead_id") or "not-synced",
                )
            except Exception as error:
                stats["errors"] += 1
                logger.error("Inbound workflow failed for %s: %s", sender_email, error)
                continue

            if message_id:
                processed_ids.append(message_id)
                processed_set.add(message_id)

    save_processed_ids(processed_ids)
    logger.info(
        "Inbound cycle complete | processed=%s replied=%s drafted=%s quotes=%s hot_alerts=%s skipped=%s errors=%s",
        stats["processed"],
        stats["replied"],
        stats["drafted"],
        stats["quote_created"],
        stats["hot_alerts"],
        stats["skipped"],
        stats["errors"],
    )
    return stats


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    )
    process_unread()
