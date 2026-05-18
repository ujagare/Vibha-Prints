"""
Follow-up Email Scheduler.

Runs the no-response email sequence:
- Day 1 follow-up
- Day 2 follow-up

The scheduler checks Supabase lead activity before sending. If a client has
replied, booked, accepted a quote, unsubscribed, or moved to a terminal status,
the follow-up is skipped and the pipeline is updated.
"""

from __future__ import annotations

import json
import logging
from datetime import datetime, timedelta
from pathlib import Path

from dotenv import load_dotenv

from email_lead_automation import send_followup_email
from supabase_client import (
    add_lead_activity,
    ensure_pipeline_entry,
    is_supabase_configured,
    supabase,
    update_pipeline_status,
)

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("followup_scheduler")

FOLLOWUP_SCHEDULE = {
    1: {"subject": "Quick Question About Your Design Needs", "enabled": True},
    2: {"subject": "Should We Prepare a Quote?", "enabled": True},
    3: {"subject": "Special Offer for You!", "enabled": False},
    7: {"subject": "Last Chance - Let's Create Something Amazing!", "enabled": False},
    14: {"subject": "We Miss You!", "enabled": False},
    30: {"subject": "One More Thing Before We Close Your Lead", "enabled": False},
}

TERMINAL_STATUSES = {
    "client_replied",
    "converted",
    "appointment_booked",
    "quote_accepted",
    "lost",
    "unsubscribed",
    "closed",
}

CLIENT_RESPONSE_EVENTS = {
    "inbound_email_received",
    "client_replied",
    "quote_accepted",
    "appointment_booked",
}

DATA_DIR = Path(__file__).parent / "data"
FOLLOWUP_LOG = DATA_DIR / "followup_log.json"
DATA_DIR.mkdir(exist_ok=True)


def load_followup_log() -> dict:
    if not FOLLOWUP_LOG.exists():
        return {}
    try:
        return json.loads(FOLLOWUP_LOG.read_text(encoding="utf-8"))
    except Exception as e:
        logger.error("Error loading follow-up log: %s", e)
        return {}


def save_followup_log(log: dict):
    try:
        FOLLOWUP_LOG.write_text(json.dumps(log, indent=2), encoding="utf-8")
    except Exception as e:
        logger.error("Error saving follow-up log: %s", e)


def is_already_sent(lead_email: str, days_since: int) -> bool:
    key = f"{lead_email.lower()}_{days_since}"
    return key in load_followup_log()


def mark_as_sent(lead_email: str, days_since: int, success: bool = True):
    log = load_followup_log()
    key = f"{lead_email.lower()}_{days_since}"
    log[key] = {
        "sent_at": datetime.now().isoformat(),
        "success": success,
        "days_since": days_since,
    }
    save_followup_log(log)


def get_pipeline_status(lead_id: str) -> str:
    if not is_supabase_configured():
        return ""
    try:
        response = (
            supabase.table("lead_pipeline")
            .select("*")
            .eq("lead_id", lead_id)
            .eq("lead_type", "contact")
            .limit(1)
            .execute()
        )
        row = (response.data or [{}])[0]
        return row.get("status", "")
    except Exception as e:
        logger.error("Error reading pipeline status for %s: %s", lead_id, e)
        return ""


def has_client_response_activity(lead_id: str) -> bool:
    if not is_supabase_configured():
        return False
    try:
        response = (
            supabase.table("lead_activity")
            .select("*")
            .eq("lead_id", lead_id)
            .eq("lead_type", "contact")
            .limit(100)
            .execute()
        )
        return any((row.get("event") or "") in CLIENT_RESPONSE_EVENTS for row in response.data or [])
    except Exception as e:
        logger.error("Error reading lead activity for %s: %s", lead_id, e)
        return False


def should_send_no_response_followup(lead: dict, days_since: int) -> bool:
    lead_id = lead.get("id")
    email = (lead.get("email") or "").strip().lower()
    if not lead_id or not email:
        return False
    if is_already_sent(email, days_since):
        return False

    status = get_pipeline_status(lead_id)
    if status in TERMINAL_STATUSES:
        return False

    if has_client_response_activity(lead_id):
        update_pipeline_status(
            lead_id,
            "contact",
            "client_replied",
            notes="Follow-up skipped: client response detected",
        )
        return False

    return True


def get_leads_for_followup(days_since: int) -> list:
    if not is_supabase_configured():
        logger.error("Supabase not configured")
        return []

    try:
        target_date = datetime.now() - timedelta(days=days_since)
        start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = target_date.replace(hour=23, minute=59, second=59, microsecond=999999)

        response = (
            supabase.table("contact_leads")
            .select("*")
            .gte("created_at", start_of_day.isoformat())
            .lte("created_at", end_of_day.isoformat())
            .execute()
        )

        leads = [
            lead
            for lead in response.data or []
            if should_send_no_response_followup(lead, days_since)
        ]
        logger.info("Found %s no-response leads for day %s follow-up", len(leads), days_since)
        return leads
    except Exception as e:
        logger.error("Error fetching leads for follow-up: %s", e)
        return []


def send_followup_batch(days_since: int) -> dict:
    schedule = FOLLOWUP_SCHEDULE.get(days_since)
    if not schedule:
        return {"success": False, "error": f"Day {days_since} not in schedule", "sent": 0, "failed": 0}
    if not schedule["enabled"]:
        return {"success": True, "message": f"Day {days_since} follow-up is disabled", "sent": 0, "failed": 0}

    leads = get_leads_for_followup(days_since)
    sent_count = 0
    failed_count = 0

    for lead in leads:
        email = lead["email"]
        try:
            success = send_followup_email(
                name=lead["name"],
                email=email,
                days_since=days_since,
            )

            mark_as_sent(email, days_since, success)
            if success:
                status = f"followup_day_{days_since}_sent"
                ensure_pipeline_entry(lead["id"], "contact", status=status, notes="No-response follow-up sequence")
                update_pipeline_status(
                    lead["id"],
                    "contact",
                    status,
                    notes=f"Automatic no-response follow-up day {days_since} sent",
                )
                add_lead_activity(
                    lead["id"],
                    "contact",
                    status,
                    {"email": email, "days_since": days_since, "subject": schedule["subject"]},
                )
                sent_count += 1
                logger.info("Follow-up sent to %s (day %s)", email, days_since)
            else:
                failed_count += 1
                logger.error("Failed to send follow-up to %s (day %s)", email, days_since)
        except Exception as e:
            failed_count += 1
            logger.error("Error sending follow-up to %s: %s", email, e)

    return {
        "success": True,
        "day": days_since,
        "sent": sent_count,
        "failed": failed_count,
        "total": len(leads),
    }


def run_daily_followup_scheduler():
    logger.info("Starting daily no-response follow-up scheduler")
    results = {}
    total_sent = 0
    total_failed = 0

    for days_since in sorted(FOLLOWUP_SCHEDULE.keys()):
        result = send_followup_batch(days_since)
        results[f"day_{days_since}"] = result
        total_sent += result.get("sent", 0)
        total_failed += result.get("failed", 0)
        logger.info("Day %s: sent=%s failed=%s", days_since, result.get("sent", 0), result.get("failed", 0))

    return {
        "success": True,
        "timestamp": datetime.now().isoformat(),
        "total_sent": total_sent,
        "total_failed": total_failed,
        "details": results,
    }


def get_followup_status(email: str) -> dict:
    log = load_followup_log()
    status = {"email": email, "followups": {}}
    for days_since in FOLLOWUP_SCHEDULE.keys():
        key = f"{email.lower()}_{days_since}"
        status["followups"][f"day_{days_since}"] = log.get(
            key,
            {"sent_at": None, "success": False, "status": "pending"},
        )
    return status


def get_scheduler_stats() -> dict:
    log = load_followup_log()
    return {
        "total_followups_sent": len(log),
        "successful": sum(1 for v in log.values() if v.get("success")),
        "failed": sum(1 for v in log.values() if not v.get("success")),
        "by_day": {
            f"day_{day}": sum(1 for _, v in log.items() if v.get("days_since") == day)
            for day in FOLLOWUP_SCHEDULE.keys()
        },
    }


if __name__ == "__main__":
    print(json.dumps(run_daily_followup_scheduler(), indent=2))
    print(json.dumps(get_scheduler_stats(), indent=2))
