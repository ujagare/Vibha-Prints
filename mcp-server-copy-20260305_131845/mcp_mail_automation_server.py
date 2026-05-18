"""
MCP Mail Automation Server - Python
Features:
1. Contact form auto-reply (thank-you email)
2. Brochure email with attachment
3. Follow-up email scheduling (1-2 days later)
"""

import asyncio
import json
import logging
import os
import smtplib
from datetime import datetime, timedelta
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from dotenv import load_dotenv
from mcp import types
from mcp.server import Server
from mcp.server.stdio import stdio_server

# Load env from local MCP folder and parent project root.
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mcp-mail")

# SMTP config
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.yourdomain.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "your@email.com")
SMTP_PASS = os.getenv("SMTP_PASS", "your_password")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@yourdomain.com")
BROCHURE_PATH = os.getenv("BROCHURE_PATH", "./brochure.pdf")

# Scheduler (for follow-up)
scheduler = AsyncIOScheduler()

# MCP server
server = Server("mail-automation")


def send_smtp_email(to: str, subject: str, html_body: str, attachment_path: str | None = None) -> None:
    """Core SMTP email sender."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to
    msg.attach(MIMEText(html_body, "html"))

    if attachment_path and os.path.exists(attachment_path):
        with open(attachment_path, "rb") as file:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(file.read())
            encoders.encode_base64(part)
            filename = os.path.basename(attachment_path)
            part.add_header("Content-Disposition", f'attachment; filename="{filename}"')
            msg.attach(part)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USER, SMTP_PASS)
        smtp.send_message(msg)
        logger.info("Email sent to %s | Subject: %s", to, subject)


@server.call_tool()
async def contact_form_auto_reply(name: str, email: str, message: str) -> str:
    """
    On contact form submission:
    - Send thank-you email to user
    - Send notification email to admin
    """
    user_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Shukriya, {name} ji!</h2>
        <p>Aapka message humein mil gaya hai. Hum jald hi aapse sampark karenge.</p>
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
            <strong>Aapka Message:</strong>
            <p style="color: #555;">{message}</p>
        </div>
        <p>Agar aapko koi urgent sawaal hai, toh seedha call karein.</p>
        <br>
        <p style="color: #888; font-size: 12px;">Yeh ek automatic email hai.</p>
    </div>
    """
    send_smtp_email(
        to=email,
        subject=f"Shukriya {name} ji - Aapka message mila",
        html_body=user_html,
    )

    admin_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h3>Naya Contact Form Submission</h3>
        <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Naam</strong></td><td style="padding: 8px; border: 1px solid #ddd;">{name}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">{email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #ddd;">{message}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">{datetime.now().strftime('%d %b %Y, %I:%M %p')}</td></tr>
        </table>
    </div>
    """
    send_smtp_email(
        to=ADMIN_EMAIL,
        subject=f"New Contact: {name} ({email})",
        html_body=admin_html,
    )

    return json.dumps(
        {
            "status": "success",
            "message": f"Auto-reply sent to {email}, admin notified",
        }
    )


@server.call_tool()
async def send_brochure_email(name: str, email: str) -> str:
    """Send brochure PDF attachment based on user request."""
    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Namaste {name} ji!</h2>
        <p>Aapne hamare brochure ki request ki thi. Yeh lijiye.</p>
        <p>Is brochure mein aapko milega:</p>
        <ul style="color: #555; line-height: 1.8;">
            <li>Hamare products/services ki jankari</li>
            <li>Pricing details</li>
            <li>Contact information</li>
        </ul>
        <div style="background: #eaf4fb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Brochure attached hai.</strong> Please download karein.</p>
        </div>
        <p>Koi bhi sawaal ho toh reply karein. Hum madad ke liye taiyar hain.</p>
        <br>
        <p style="color: #888; font-size: 12px;">Yeh ek automatic email hai.</p>
    </div>
    """
    send_smtp_email(
        to=email,
        subject=f"Aapka Brochure - {name} ji",
        html_body=html_body,
        attachment_path=BROCHURE_PATH,
    )

    return json.dumps({"status": "success", "message": f"Brochure sent to {email}"})


@server.call_tool()
async def schedule_followup_email(name: str, email: str, days: int = 1) -> str:
    """
    Schedule a follow-up email after 1 or 2 days.
    days: 1 = tomorrow, 2 = day after tomorrow
    """
    safe_days = 1 if days not in (1, 2) else days
    send_time = datetime.now() + timedelta(days=safe_days)

    def send_followup() -> None:
        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Namaste {name} ji!</h2>
            <p>Humne kuch din pehle aapse baat ki thi. Bas check karna tha ki kya aapke mann mein koi sawaal hai?</p>
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Kya aapko hamare baare mein aur jankari chahiye?</strong></p>
                <p>Hum aapko free consultation de sakte hain.</p>
            </div>
            <a href="mailto:{SMTP_USER}"
               style="background: #3498db; color: white; padding: 10px 20px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
                Abhi Reply Karein
            </a>
            <br><br>
            <p style="color: #888; font-size: 12px;">Agar aap follow-up nahi chahte toh is email ko ignore karein.</p>
        </div>
        """
        send_smtp_email(
            to=email,
            subject=f"Hi {name} ji - Koi sawaal?",
            html_body=html_body,
        )
        logger.info("Follow-up sent to %s", email)

    scheduler.add_job(
        send_followup,
        "date",
        run_date=send_time,
        id=f"followup_{email}_{int(send_time.timestamp())}",
    )

    return json.dumps(
        {
            "status": "scheduled",
            "message": f"Follow-up scheduled for {name} ({email}) on {send_time.strftime('%d %b %Y, %I:%M %p')}",
            "scheduled_time": send_time.isoformat(),
        }
    )


@server.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="contact_form_auto_reply",
            description="Contact form submit hone par user ko thank-you aur admin ko notification bhejo",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "User ka naam"},
                    "email": {"type": "string", "description": "User ka email"},
                    "message": {"type": "string", "description": "Contact form message"},
                },
                "required": ["name", "email", "message"],
            },
        ),
        types.Tool(
            name="send_brochure_email",
            description="User ko brochure PDF attachment ke saath email bhejo",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "User ka naam"},
                    "email": {"type": "string", "description": "User ka email"},
                },
                "required": ["name", "email"],
            },
        ),
        types.Tool(
            name="schedule_followup_email",
            description="1 ya 2 din baad follow-up email schedule karo",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "User ka naam"},
                    "email": {"type": "string", "description": "User ka email"},
                    "days": {"type": "integer", "description": "Kitne din baad (1 ya 2)", "default": 1},
                },
                "required": ["name", "email"],
            },
        ),
    ]


async def main() -> None:
    logger.info("MCP Mail Automation Server starting...")
    if not scheduler.running:
        scheduler.start()
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
