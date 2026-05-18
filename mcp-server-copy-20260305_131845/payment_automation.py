"""
Payment & Invoice Automation for CodeSunny
Auto-generate invoices, send reminders, track payments
"""

import os
import json
from pathlib import Path
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

try:
    from pymongo import MongoClient
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False

load_dotenv(Path(__file__).parent / ".env")

# Data storage
DATA_DIR = Path(__file__).parent / "data"
INVOICES_FILE = DATA_DIR / "invoices.json"
PAYMENTS_FILE = DATA_DIR / "payments.json"


def ensure_data_files():
    """Create data files if not exist"""
    DATA_DIR.mkdir(exist_ok=True)
    if not INVOICES_FILE.exists():
        INVOICES_FILE.write_text("[]", encoding="utf-8")
    if not PAYMENTS_FILE.exists():
        PAYMENTS_FILE.write_text("[]", encoding="utf-8")


def get_mongo_db():
    """Get MongoDB connection"""
    if not PYMONGO_AVAILABLE:
        return None
    
    uri = os.environ.get("MONGODB_URI", "").strip()
    db_name = os.environ.get("MONGODB_DB", "codesunny").strip()
    
    if not uri:
        return None
    
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        return client[db_name]
    except Exception:
        return None


def generate_invoice_number():
    """Generate unique invoice number"""
    now = datetime.now(timezone.utc)
    return f"INV-{now.strftime('%Y%m%d')}-{now.strftime('%H%M%S')}"


def create_invoice(lead_id, amount, services, due_days=15):
    """Create invoice"""
    ensure_data_files()
    
    invoice = {
        "invoice_number": generate_invoice_number(),
        "lead_id": lead_id,
        "amount": amount,
        "services": services if isinstance(services, list) else [services],
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat() + "Z",
        "due_date": (datetime.now(timezone.utc) + timedelta(days=due_days)).isoformat() + "Z",
        "payment_reminders_sent": 0
    }
    
    # Save to MongoDB if available
    db = get_mongo_db()
    if db is not None:
        try:
            col = db["invoices"]
            result = col.insert_one(dict(invoice))
            invoice["_id"] = str(result.inserted_id)
        except Exception:
            pass
    
    # Save to JSON (remove _id if present)
    invoices = json.loads(INVOICES_FILE.read_text(encoding="utf-8"))
    invoice_copy = dict(invoice)
    if "_id" in invoice_copy:
        del invoice_copy["_id"]
    invoices.append(invoice_copy)
    INVOICES_FILE.write_text(json.dumps(invoices, indent=2), encoding="utf-8")
    
    print(f"✅ Invoice created: {invoice['invoice_number']}")
    return invoice


def send_invoice_email(invoice, recipient_email, recipient_name="Client"):
    """Send invoice via email"""
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    
    if not all([host, user, password, email_from]):
        print("❌ SMTP not configured")
        return False
    
    # Create email
    msg = MIMEMultipart("alternative")
    msg["From"] = f"CodeSunny <{email_from}>"
    msg["To"] = recipient_email
    msg["Subject"] = f"Invoice {invoice['invoice_number']} - CodeSunny"
    
    # HTML content
    services_html = "<br>".join([f"• {s}" for s in invoice["services"]])
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                Invoice {invoice['invoice_number']}
            </h2>
            
            <p>Dear {recipient_name},</p>
            
            <p>Thank you for choosing CodeSunny! Please find your invoice details below:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Invoice Number:</strong> {invoice['invoice_number']}</p>
                <p><strong>Date:</strong> {invoice['created_at'][:10]}</p>
                <p><strong>Due Date:</strong> {invoice['due_date'][:10]}</p>
                <p><strong>Amount:</strong> ₹{invoice['amount']:,}</p>
            </div>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #475569;">Services:</h3>
                <p>{services_html}</p>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1e40af;">Payment Details:</h3>
                <p><strong>Bank:</strong> HDFC Bank</p>
                <p><strong>Account Name:</strong> CodeSunny</p>
                <p><strong>Account Number:</strong> 50200012345678</p>
                <p><strong>IFSC Code:</strong> HDFC0001234</p>
                <p><strong>UPI:</strong> codesunny@hdfcbank</p>
            </div>
            
            <p>Please make payment by <strong>{invoice['due_date'][:10]}</strong></p>
            
            <p>For any queries, contact us at:</p>
            <ul>
                <li>Email: information@codesunny.in</li>
                <li>Phone: +91 89758075789</li>
            </ul>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #64748b; font-size: 12px;">
                <p>This is an automated invoice from CodeSunny.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text = f"""
Invoice {invoice['invoice_number']}

Dear {recipient_name},

Thank you for choosing CodeSunny!

Invoice Details:
- Invoice Number: {invoice['invoice_number']}
- Date: {invoice['created_at'][:10]}
- Due Date: {invoice['due_date'][:10]}
- Amount: ₹{invoice['amount']:,}

Services:
{chr(10).join([f"- {s}" for s in invoice["services"]])}

Payment Details:
Bank: HDFC Bank
Account: 50200012345678
IFSC: HDFC0001234
UPI: codesunny@hdfcbank

Contact: information@codesunny.in | +91 89758075789

Best regards,
CodeSunny Team
"""
    
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))
    
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
        
        print(f"✅ Invoice sent to {recipient_email}")
        return True
    except Exception as e:
        print(f"❌ Email error: {e}")
        return False


def send_payment_reminder(invoice, recipient_email, recipient_name="Client", reminder_type="gentle"):
    """Send payment reminder"""
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    
    if not all([host, user, password, email_from]):
        return False
    
    # Reminder messages
    messages = {
        "gentle": {
            "subject": f"Friendly Reminder: Invoice {invoice['invoice_number']}",
            "greeting": "Just a friendly reminder about your pending invoice.",
            "tone": "We understand you might be busy!"
        },
        "urgent": {
            "subject": f"Urgent: Payment Due - Invoice {invoice['invoice_number']}",
            "greeting": "This is an urgent reminder about your overdue invoice.",
            "tone": "Please prioritize this payment."
        },
        "final": {
            "subject": f"Final Notice: Invoice {invoice['invoice_number']}",
            "greeting": "This is our final reminder about your overdue invoice.",
            "tone": "Please settle this immediately to avoid service interruption."
        }
    }
    
    msg_data = messages.get(reminder_type, messages["gentle"])
    
    msg = MIMEMultipart("alternative")
    msg["From"] = f"CodeSunny <{email_from}>"
    msg["To"] = recipient_email
    msg["Subject"] = msg_data["subject"]
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #f59e0b;">Payment Reminder</h2>
            
            <p>Dear {recipient_name},</p>
            
            <p>{msg_data['greeting']}</p>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Invoice:</strong> {invoice['invoice_number']}</p>
                <p><strong>Amount:</strong> ₹{invoice['amount']:,}</p>
                <p><strong>Due Date:</strong> {invoice['due_date'][:10]}</p>
            </div>
            
            <p>{msg_data['tone']}</p>
            
            <p>Payment Details:<br>
            UPI: codesunny@hdfcbank<br>
            Account: 50200012345678 (HDFC Bank)</p>
            
            <p>Contact: information@codesunny.in | +91 89758075789</p>
        </div>
    </body>
    </html>
    """
    
    text = f"""
Payment Reminder

Dear {recipient_name},

{msg_data['greeting']}

Invoice: {invoice['invoice_number']}
Amount: ₹{invoice['amount']:,}
Due Date: {invoice['due_date'][:10]}

{msg_data['tone']}

Payment: codesunny@hdfcbank or 50200012345678 (HDFC)
Contact: information@codesunny.in

Best regards,
CodeSunny Team
"""
    
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))
    
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
        
        # Update reminder count
        ensure_data_files()
        invoices = json.loads(INVOICES_FILE.read_text(encoding="utf-8"))
        for inv in invoices:
            if inv["invoice_number"] == invoice["invoice_number"]:
                inv["payment_reminders_sent"] = inv.get("payment_reminders_sent", 0) + 1
                inv["last_reminder_at"] = datetime.now(timezone.utc).isoformat() + "Z"
                inv["last_reminder_type"] = reminder_type
        INVOICES_FILE.write_text(json.dumps(invoices, indent=2), encoding="utf-8")
        
        print(f"✅ {reminder_type.capitalize()} reminder sent")
        return True
    except Exception as e:
        print(f"❌ Reminder error: {e}")
        return False


def check_overdue_invoices():
    """Check and send reminders for overdue invoices"""
    ensure_data_files()
    invoices = json.loads(INVOICES_FILE.read_text(encoding="utf-8"))
    now = datetime.now(timezone.utc)
    
    print(f"\n📊 Checking {len(invoices)} invoices...\n")
    
    for invoice in invoices:
        if invoice["status"] != "pending":
            continue
        
        due_date = datetime.fromisoformat(invoice["due_date"].replace("Z", "+00:00"))
        days_overdue = (now - due_date).days
        
        if days_overdue <= 0:
            continue
        
        reminders_sent = invoice.get("payment_reminders_sent", 0)
        
        # Reminder schedule
        if days_overdue >= 21 and reminders_sent < 3:
            print(f"⚠️  Final notice: {invoice['invoice_number']} ({days_overdue} days overdue)")
            # send_payment_reminder(invoice, "client@example.com", "Client", "final")
        elif days_overdue >= 14 and reminders_sent < 2:
            print(f"⚠️  Urgent reminder: {invoice['invoice_number']} ({days_overdue} days overdue)")
            # send_payment_reminder(invoice, "client@example.com", "Client", "urgent")
        elif days_overdue >= 7 and reminders_sent < 1:
            print(f"📧 Gentle reminder: {invoice['invoice_number']} ({days_overdue} days overdue)")
            # send_payment_reminder(invoice, "client@example.com", "Client", "gentle")


def mark_invoice_paid(invoice_number, payment_method="bank_transfer"):
    """Mark invoice as paid"""
    ensure_data_files()
    invoices = json.loads(INVOICES_FILE.read_text(encoding="utf-8"))
    
    for invoice in invoices:
        if invoice["invoice_number"] == invoice_number:
            invoice["status"] = "paid"
            invoice["paid_at"] = datetime.now(timezone.utc).isoformat() + "Z"
            invoice["payment_method"] = payment_method
            
            INVOICES_FILE.write_text(json.dumps(invoices, indent=2), encoding="utf-8")
            
            # Log payment
            payments = json.loads(PAYMENTS_FILE.read_text(encoding="utf-8"))
            payments.append({
                "invoice_number": invoice_number,
                "amount": invoice["amount"],
                "payment_method": payment_method,
                "timestamp": datetime.now(timezone.utc).isoformat() + "Z"
            })
            PAYMENTS_FILE.write_text(json.dumps(payments, indent=2), encoding="utf-8")
            
            print(f"✅ Invoice {invoice_number} marked as paid")
            return True
    
    print(f"❌ Invoice {invoice_number} not found")
    return False


def get_revenue_stats(month=None):
    """Get revenue statistics"""
    ensure_data_files()
    payments = json.loads(PAYMENTS_FILE.read_text(encoding="utf-8"))
    
    if month:
        payments = [p for p in payments if p["timestamp"].startswith(month)]
    
    total = sum(p["amount"] for p in payments)
    count = len(payments)
    
    print(f"\n💰 Revenue Stats{' for ' + month if month else ''}:")
    print(f"  Total: ₹{total:,}")
    print(f"  Payments: {count}")
    print(f"  Average: ₹{total//count if count > 0 else 0:,}")
    
    return {"total": total, "count": count}


if __name__ == "__main__":
    import sys
    
    print("\n💳 Payment & Invoice Automation")
    print("=" * 60)
    
    if len(sys.argv) < 2:
        print("\nUsage:")
        print("  python payment_automation.py invoice <lead_id> <amount> <services>")
        print("  python payment_automation.py remind")
        print("  python payment_automation.py paid <invoice_number>")
        print("  python payment_automation.py stats [month]")
        print("\nExamples:")
        print('  python payment_automation.py invoice 123 50000 "Web Development"')
        print("  python payment_automation.py remind")
        print("  python payment_automation.py paid INV-20260224-120000")
        print("  python payment_automation.py stats 2026-02")
        sys.exit(0)
    
    command = sys.argv[1].lower()
    
    if command == "invoice":
        if len(sys.argv) < 5:
            print("❌ lead_id, amount, and services required")
            sys.exit(1)
        lead_id = sys.argv[2]
        amount = int(sys.argv[3])
        services = " ".join(sys.argv[4:])
        create_invoice(lead_id, amount, services)
    
    elif command == "remind":
        check_overdue_invoices()
    
    elif command == "paid":
        if len(sys.argv) < 3:
            print("❌ invoice_number required")
            sys.exit(1)
        invoice_number = sys.argv[2]
        mark_invoice_paid(invoice_number)
    
    elif command == "stats":
        month = sys.argv[2] if len(sys.argv) > 2 else None
        get_revenue_stats(month)
    
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)
    
    print("\n✅ Done!\n")