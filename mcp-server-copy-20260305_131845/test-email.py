"""
Email Configuration Test Script
Tests Zoho Mail SMTP connection
"""

import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")

def test_email():
    """Test email configuration"""
    
    print("\n" + "="*60)
    print("📧 EMAIL CONFIGURATION TEST")
    print("="*60 + "\n")
    
    # Get configuration
    host = os.environ.get("SMTP_HOST")
    port = os.environ.get("SMTP_PORT", "587")
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    email_to = os.environ.get("LEADS_EMAIL_TO")
    
    # Display configuration (hide password)
    print("📋 Configuration:")
    print(f"  SMTP Host: {host}")
    print(f"  SMTP Port: {port}")
    print(f"  SMTP User: {user}")
    print(f"  SMTP Pass: {'*' * len(password) if password else 'NOT SET'}")
    print(f"  From: {email_from}")
    print(f"  To: {email_to}")
    print()
    
    # Validate configuration
    if not all([host, port, user, password, email_from, email_to]):
        print("❌ ERROR: Missing configuration!")
        print("\nPlease check mcp-server/.env file:")
        if not host: print("  - SMTP_HOST is missing")
        if not port: print("  - SMTP_PORT is missing")
        if not user: print("  - SMTP_USER is missing")
        if not password: print("  - SMTP_PASS is missing")
        if not email_from: print("  - SMTP_FROM is missing")
        if not email_to: print("  - LEADS_EMAIL_TO is missing")
        return False
    
    # Check for placeholder values
    if "YOUR_" in password.upper() or "your_" in password:
        print("❌ ERROR: Password not configured!")
        print("\nPlease update SMTP_PASS in mcp-server/.env file")
        print("Replace 'YOUR_ZOHO_PASSWORD_HERE' with actual password")
        return False
    
    # Create test email
    msg = EmailMessage()
    msg["Subject"] = "🧪 Test Email - CodeSunny Chatbot"
    msg["From"] = email_from
    msg["To"] = email_to
    
    # HTML content
    html_content = """
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; border: 2px solid #2563eb; border-radius: 10px; padding: 20px;">
            <h2 style="color: #2563eb;">🧪 Email Test Successful!</h2>
            <p>This is a test email from your CodeSunny chatbot.</p>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>✅ SMTP Configuration Working</strong></p>
                <p>Your email system is properly configured and ready to receive lead notifications.</p>
            </div>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #64748b; font-size: 12px;">
                Sent from CodeSunny MCP Server<br>
                Time: {timestamp}
            </p>
        </div>
    </body>
    </html>
    """
    
    from datetime import datetime
    html_content = html_content.format(timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    
    msg.set_content("Email test successful! Your SMTP configuration is working.")
    msg.add_alternative(html_content, subtype='html')
    
    # Send email
    print("📤 Sending test email...")
    print()
    
    try:
        # Check if using SSL (port 465) or TLS (port 587)
        port_int = int(port)
        
        if port_int == 465:
            # Use SMTP_SSL for port 465
            import smtplib
            with smtplib.SMTP_SSL(host, port_int) as server:
                print("  → Connecting to SMTP server (SSL)...")
                
                server.login(user, password)
                print("  → Authentication successful...")
                
                server.send_message(msg)
                print("  → Email sent!")
        else:
            # Use SMTP with STARTTLS for port 587
            with smtplib.SMTP(host, port_int) as server:
                print("  → Connecting to SMTP server...")
                server.starttls()
                print("  → Starting TLS encryption...")
                
                server.login(user, password)
                print("  → Authentication successful...")
                
                server.send_message(msg)
                print("  → Email sent!")
            
        print()
        print("="*60)
        print("✅ SUCCESS! Email sent successfully!")
        print("="*60)
        print()
        print(f"📬 Check inbox: {email_to}")
        print("   (Also check spam folder)")
        print()
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print()
        print("="*60)
        print("❌ AUTHENTICATION FAILED")
        print("="*60)
        print()
        print("Possible reasons:")
        print("  1. Wrong password")
        print("  2. 2FA enabled - need App Password")
        print("  3. Email account locked")
        print()
        print("Solutions:")
        print("  1. Double-check password in .env file")
        print("  2. If 2FA enabled:")
        print("     - Go to Zoho Mail → Settings → Security")
        print("     - Generate App Password")
        print("     - Use that password in .env")
        print()
        print(f"Error details: {e}")
        return False
        
    except smtplib.SMTPException as e:
        print()
        print("="*60)
        print("❌ SMTP ERROR")
        print("="*60)
        print()
        print(f"Error: {e}")
        print()
        print("Check:")
        print("  - SMTP_HOST: smtp.zoho.com")
        print("  - SMTP_PORT: 587")
        print("  - Internet connection")
        return False
        
    except Exception as e:
        print()
        print("="*60)
        print("❌ UNEXPECTED ERROR")
        print("="*60)
        print()
        print(f"Error: {type(e).__name__}: {e}")
        return False


if __name__ == "__main__":
    success = test_email()
    exit(0 if success else 1)
