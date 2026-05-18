#!/usr/bin/env python3
"""
Test SSL connection to Zoho SMTP
"""

import os
import smtplib
import socket
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

ZOHO_SMTP_HOST = os.environ.get("ZOHO_SMTP_HOST", "smtppro.zoho.in")
ZOHO_SMTP_PORT = int(os.environ.get("ZOHO_SMTP_PORT", "465"))

print(f"\n🔌 Testing SSL connection to {ZOHO_SMTP_HOST}:{ZOHO_SMTP_PORT}")

# Test 1: Basic socket connection
print(f"\n1️⃣  Testing basic socket connection...")
try:
    sock = socket.create_connection((ZOHO_SMTP_HOST, ZOHO_SMTP_PORT), timeout=5)
    print(f"   ✅ Socket connection successful")
    sock.close()
except Exception as e:
    print(f"   ❌ Socket connection failed: {e}")

# Test 2: SSL connection
print(f"\n2️⃣  Testing SSL connection...")
try:
    with smtplib.SMTP_SSL(ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, timeout=5) as server:
        print(f"   ✅ SSL connection successful")
except Exception as e:
    print(f"   ❌ SSL connection failed: {e}")

# Test 3: TLS connection (for comparison)
print(f"\n3️⃣  Testing TLS connection (port 587)...")
try:
    with smtplib.SMTP("smtppro.zoho.in", 587, timeout=5) as server:
        server.starttls()
        print(f"   ✅ TLS connection successful")
except Exception as e:
    print(f"   ❌ TLS connection failed: {e}")

print("\n" + "=" * 60)
