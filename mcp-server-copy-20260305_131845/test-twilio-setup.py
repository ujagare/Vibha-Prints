"""
Test Twilio WhatsApp Setup
Checks if credentials are configured correctly
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

print("\n" + "="*60)
print("TWILIO WHATSAPP SETUP - CONFIGURATION CHECK")
print("="*60 + "\n")

# Check if Twilio is installed
try:
    from twilio.rest import Client
    print("✅ Twilio library installed")
except ImportError:
    print("❌ Twilio library NOT installed")
    print("   Run: python -m pip install twilio")
    exit(1)

# Check credentials
account_sid = os.environ.get("TWILIO_ACCOUNT_SID", "").strip()
auth_token = os.environ.get("TWILIO_AUTH_TOKEN", "").strip()
whatsapp_from = os.environ.get("TWILIO_WHATSAPP_FROM", "").strip()

print("\nCredentials Check:")
print("-" * 60)

if account_sid and not account_sid.startswith("#"):
    print(f"✅ Account SID: {account_sid[:10]}...{account_sid[-4:]}")
else:
    print("❌ Account SID: NOT CONFIGURED")
    print("   Add to .env: TWILIO_ACCOUNT_SID=AC...")

if auth_token and not auth_token.startswith("#"):
    print(f"✅ Auth Token: {auth_token[:10]}...{auth_token[-4:]}")
else:
    print("❌ Auth Token: NOT CONFIGURED")
    print("   Add to .env: TWILIO_AUTH_TOKEN=...")

if whatsapp_from and not whatsapp_from.startswith("#"):
    print(f"✅ WhatsApp From: {whatsapp_from}")
else:
    print("❌ WhatsApp From: NOT CONFIGURED")
    print("   Add to .env: TWILIO_WHATSAPP_FROM=+14155238886")

print("\n" + "="*60)

# Test connection if credentials exist
if account_sid and auth_token and whatsapp_from:
    if not account_sid.startswith("#") and not auth_token.startswith("#"):
        print("\nTesting Twilio Connection...")
        print("-" * 60)
        
        try:
            client = Client(account_sid, auth_token)
            
            # Get account info
            account = client.api.accounts(account_sid).fetch()
            print(f"✅ Connection successful!")
            print(f"   Account: {account.friendly_name}")
            print(f"   Status: {account.status}")
            print(f"   Type: {account.type}")
            
            # Check balance
            try:
                balance = client.balance.fetch()
                print(f"   Balance: ${balance.balance} {balance.currency}")
            except Exception:
                print("   Balance: Unable to fetch")
            
            print("\n" + "="*60)
            print("\n✅ SETUP COMPLETE!")
            print("\nYou can now send WhatsApp messages automatically!")
            print("\nTest command:")
            print('  python whatsapp_automation.py send +919876543210 "Test"')
            print("\nNote: Replace +919876543210 with your number")
            print("      (Must have joined sandbox first)")
            
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            print("\nPossible issues:")
            print("  - Check Account SID is correct")
            print("  - Check Auth Token is correct")
            print("  - Check internet connection")
            print("\nGet credentials from: https://console.twilio.com")
else:
    print("\n⚠️  SETUP INCOMPLETE")
    print("\nTo enable Twilio WhatsApp:")
    print("1. Create account: https://www.twilio.com/try-twilio")
    print("2. Get credentials from console")
    print("3. Add to mcp-server/.env file")
    print("4. Run this test again")
    print("\nDetailed guide: TWILIO_SETUP_STEPS.txt")

print("\n" + "="*60 + "\n")
