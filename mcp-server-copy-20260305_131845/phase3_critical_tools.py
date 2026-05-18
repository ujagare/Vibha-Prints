"""
PHASE 3: CRITICAL REVENUE AUTOMATION TOOLS
These tools complete the revenue automation pipeline.
"""

from pathlib import Path
import json
from datetime import datetime, timedelta
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os
import re
from collections import defaultdict
import time

# Rate limiting
rate_limit_store = defaultdict(list)
RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX_REQUESTS = 20


def check_rate_limit(user_id: str = "default") -> bool:
    """Check if user has exceeded rate limit"""
    now = time.time()
    user_requests = rate_limit_store[user_id]
    user_requests = [req_time for req_time in user_requests if now - req_time < RATE_LIMIT_WINDOW]
    rate_limit_store[user_id] = user_requests
    
    if len(user_requests) >= RATE_LIMIT_MAX_REQUESTS:
        return False
    
    rate_limit_store[user_id].append(now)
    return True


def log_tool_usage(tool_name: str, status: str, error: str = ""):
    """Log tool usage for monitoring"""
    log_entry = {
        "tool": tool_name,
        "status": status,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "error": error
    }
    
    log_file = Path(__file__).parent / "data" / "tool_usage.log"
    log_file.parent.mkdir(exist_ok=True)
    with log_file.open("a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")


# Add these tools to your server.py by importing and registering them
# Or copy-paste the @mcp.tool() decorated functions into server.py

print("Phase 3 Critical Tools Module Loaded")
print("Tools: generate_proposal_pdf, update_lead_stage, get_pipeline_summary")
print("       generate_payment_link_razorpay, monthly_revenue_projection")
