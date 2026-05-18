"""
Automation Hub for Vibha Prints MCP

Runs scheduled business automations:
- Supabase lead sync
- Hot lead alerts (email + webhook)
- Daily/weekly KPI digest
- Email automation
- Uptime + SSL checks

Features:
- Retry logic for webhooks
- Better logging
- Safe date comparison
- Email failure logging
- Graceful None handling
"""

from __future__ import annotations

import json
import logging
import os
import smtplib
import ssl
import time
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path
from typing import Dict, List
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from followup_scheduler import run_daily_followup_scheduler
from inbound_email_ai_agent import process_unread

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)
logger = logging.getLogger("automation_hub")

# Paths
load_dotenv(Path(__file__).parent / ".env")

DATA_DIR = Path(__file__).parent / "data"
STATE_FILE = DATA_DIR / "automation_state.json"
BACKUP_DIR = DATA_DIR / "backups"
LOG_FILE = DATA_DIR / "automation_hub.log"
LOCK_FILE = DATA_DIR / "automation_hub.lock"

DATA_DIR.mkdir(exist_ok=True)
file_handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
file_handler.setFormatter(
    logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
)
logger.addHandler(file_handler)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat() + "Z"


def safe_max(a: str, b: str) -> str:
    """Safely compare two ISO date strings, handling None/empty values."""
    if not a:
        return b or ""
    if not b:
        return a or ""
    try:
        return max(a, b)
    except Exception:
        return a


def load_state() -> Dict:
    if not STATE_FILE.exists():
        return {
            "last_sheets_sync": "",
            "last_daily_digest": "",
            "last_weekly_digest": "",
            "last_weekly_seo": "",
            "last_backup": "",
            "last_inbound_email_poll": "",
            "last_followup_scheduler": "",
            "hot_alerted_ids": [],
        }
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except Exception as e:
        logger.error(f"Failed to load state: {e} - using fresh state")
        return {}


def save_state(state: Dict):
    DATA_DIR.mkdir(exist_ok=True)
    try:
        STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")
    except Exception as e:
        logger.error(f"Failed to save state: {e}")


def acquire_lock():
    if LOCK_FILE.exists():
        lock_age = time.time() - LOCK_FILE.stat().st_mtime
        if lock_age < 3600:
            raise RuntimeError("Another automation_hub instance is already running.")
        logger.warning("Stale automation lock found. Removing it.")
        LOCK_FILE.unlink(missing_ok=True)
    LOCK_FILE.write_text(str(os.getpid()), encoding="utf-8")
    logger.info("Automation lock acquired.")


def release_lock():
    if LOCK_FILE.exists():
        LOCK_FILE.unlink(missing_ok=True)
        logger.info("Automation lock released.")


def get_db():
    if not PYMONGO_AVAILABLE:
        logger.warning("pymongo not installed - DB unavailable")
        return None
    uri = os.environ.get("MONGODB_URI", "").strip()
    db_name = os.environ.get("MONGODB_DB", "codesunny").strip()
    if not uri:
        logger.warning("MONGODB_URI not set")
        return None
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=10000)
        client.admin.command("ping")
        logger.info(f"MongoDB connected: {db_name}")
        return client[db_name]
    except Exception as e:
        logger.error(f"Mongo unavailable: {e}")
        return None


def send_email(subject: str, body: str, to_email: str = "") -> bool:
    host = os.environ.get("SMTP_HOST", "").strip()
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER", "").strip()
    password = os.environ.get("SMTP_PASS", "").strip()
    sender = os.environ.get("SMTP_FROM", "").strip()
    target = (to_email or os.environ.get("LEADS_EMAIL_TO", "")).strip()

    missing = [
        k
        for k, v in {
            "SMTP_HOST": host,
            "SMTP_USER": user,
            "SMTP_PASS": password,
            "SMTP_FROM": sender,
            "target": target,
        }.items()
        if not v
    ]

    if missing:
        logger.warning(f"send_email skipped - missing config: {missing}")
        return False

    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = target
    msg["Subject"] = subject
    msg.set_content(body)

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
        logger.info(f"Email sent: '{subject}' -> {target}")
        return True
    except Exception as e:
        logger.error(f"send_email failed for '{subject}': {e}")
        return False


def post_with_retry(
    url: str, payload: Dict, retries: int = 3, backoff: float = 2.0
) -> bool:
    """POST JSON payload with exponential backoff retry."""
    for attempt in range(1, retries + 1):
        try:
            res = requests.post(url, json=payload, timeout=10)
            if res.ok:
                return True
            logger.warning(f"Webhook attempt {attempt} failed: HTTP {res.status_code}")
        except Exception as e:
            logger.warning(f"Webhook attempt {attempt} error: {e}")
        if attempt < retries:
            sleep_time = backoff**attempt
            logger.info(f"Retrying in {sleep_time:.1f}s...")
            time.sleep(sleep_time)
    logger.error(f"Webhook failed after {retries} attempts: {url}")
    return False


def fetch_new_leads_since(db, last_sync_iso: str) -> List[Dict]:
    col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
    query = {}
    if last_sync_iso:
        query["updated_at"] = {"$gt": last_sync_iso}
    leads = list(col.find(query).sort("updated_at", 1).limit(500))
    logger.info(f"Fetched {len(leads)} new leads since '{last_sync_iso or 'beginning'}'")
    return leads


def sync_to_google_sheets(db, state: Dict):
    webhook = os.environ.get("GOOGLE_SHEETS_WEBHOOK_URL", "").strip()
    if not webhook:
        logger.info("GOOGLE_SHEETS_WEBHOOK_URL not set - skipping sheets sync")
        return

    leads = fetch_new_leads_since(db, state.get("last_sheets_sync", ""))
    if not leads:
        logger.info("No new leads to sync to Google Sheets")
        return

    last_seen = state.get("last_sheets_sync", "")
    success = 0
    failed = 0

    for lead in leads:
        payload = {
            "event": "lead_sync",
            "source": "automation_hub",
            "lead": {
                "name": lead.get("name", ""),
                "email": lead.get("email", ""),
                "message": lead.get("message", ""),
                "lead_score": lead.get("lead_score", 0),
                "quality": lead.get("quality", ""),
                "status": lead.get("status", "new"),
                "services_interested": lead.get("services_interested", []),
                "created_at": lead.get("created_at", ""),
                "updated_at": lead.get("updated_at", ""),
            },
        }
        if post_with_retry(webhook, payload):
            last_seen = safe_max(last_seen, lead.get("updated_at") or "")
            success += 1
        else:
            failed += 1

    state["last_sheets_sync"] = last_seen
    logger.info(f"Sheets sync complete - success: {success}, failed: {failed}")


def process_hot_lead_alerts(db, state: Dict):
    webhook = os.environ.get("LEAD_AUTOMATION_WEBHOOK_URL", "").strip()
    col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]

    hot_leads = list(col.find({"quality": "hot"}).sort("updated_at", -1).limit(200))
    alerted = set(state.get("hot_alerted_ids", []))
    new_alerts = 0

    for lead in hot_leads:
        lid = str(lead.get("_id"))
        if lid in alerted:
            continue

        summary = (
            "Hot Lead Detected - CodeSunny\n"
            f"Name:    {lead.get('name', 'N/A')}\n"
            f"Email:   {lead.get('email', 'N/A')}\n"
            f"Score:   {lead.get('lead_score', 0)}\n"
            f"Status:  {lead.get('status', 'new')}\n"
            f"Message: {(lead.get('message') or '')[:500]}"
        )
        send_email("Hot Lead Alert - CodeSunny", summary)

        if webhook:
            post_with_retry(
                webhook,
                {
                    "event": "hot_lead",
                    "lead": {
                        k: str(v) if k == "_id" else v for k, v in lead.items()
                    },
                    "timestamp": now_iso(),
                },
            )

        alerted.add(lid)
        new_alerts += 1

    state["hot_alerted_ids"] = list(alerted)[-1000:]
    logger.info(f"Hot lead alerts sent: {new_alerts}")


def build_kpi_digest(db, label: str) -> str:
    col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
    total = col.count_documents({})
    status_counts = {}
    quality_counts = {}
    scores = []

    for lead in col.find({}, {"status": 1, "quality": 1, "lead_score": 1}):
        s = lead.get("status") or "new"
        q = lead.get("quality") or "cold"
        status_counts[s] = status_counts.get(s, 0) + 1
        quality_counts[q] = quality_counts.get(q, 0) + 1
        score = lead.get("lead_score")
        if isinstance(score, (int, float)):
            scores.append(score)

    avg_score = (sum(scores) / len(scores)) if scores else 0.0

    lines = [
        f"{'=' * 40}",
        f"{label} KPI Digest - CodeSunny",
        f"Generated: {now_iso()}",
        f"{'=' * 40}",
        "",
        f"Total Leads   : {total}",
        f"Avg Lead Score: {avg_score:.1f}",
        "",
        "Status Breakdown:",
    ]
    for k, v in sorted(status_counts.items()):
        lines.append(f"  {k:<20} {v}")

    lines += ["", "Quality Breakdown:"]
    for k, v in sorted(quality_counts.items()):
        lines.append(f"  {k:<20} {v}")

    lines += [
        "",
        "Recommended Actions:",
        "  Contact all hot leads within 1 hour.",
        "  Move contacted leads to qualified/proposal stage.",
        "  Review lost leads and capture reason.",
        "",
    ]
    return "\n".join(lines)


def maybe_send_digests(db, state: Dict):
    today = datetime.now(timezone.utc).date().isoformat()
    weekday = datetime.now(timezone.utc).weekday()

    if state.get("last_daily_digest") != today:
        body = build_kpi_digest(db, "Daily")
        if send_email("Daily KPI Digest - CodeSunny", body):
            state["last_daily_digest"] = today

    if weekday == 0 and state.get("last_weekly_digest") != today:
        body = build_kpi_digest(db, "Weekly")
        if send_email("Weekly KPI Digest - CodeSunny", body):
            state["last_weekly_digest"] = today


def run_weekly_seo_report(state: Dict):
    key = os.environ.get("GOOGLE_PAGESPEED_API_KEY", "").strip()
    urls_raw = os.environ.get("SEO_REPORT_URLS", "").strip()
    if not key or not urls_raw:
        logger.info(
            "SEO report skipped - GOOGLE_PAGESPEED_API_KEY or SEO_REPORT_URLS not set"
        )
        return

    today = datetime.now(timezone.utc).date().isoformat()
    weekday = datetime.now(timezone.utc).weekday()
    if weekday != 0 or state.get("last_weekly_seo") == today:
        return

    urls = [u.strip() for u in urls_raw.split(",") if u.strip()]
    report_lines = [f"Weekly SEO Report - {today}", ""]

    for u in urls[:20]:
        try:
            r = requests.get(
                "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
                params={"url": u, "strategy": "mobile", "key": key},
                timeout=30,
            )
            if not r.ok:
                report_lines.append(f"  {u}: failed (HTTP {r.status_code})")
                continue
            lhr = r.json().get("lighthouseResult", {}).get("categories", {})
            perf = int(round((lhr.get("performance", {}).get("score") or 0) * 100))
            seo = int(round((lhr.get("seo", {}).get("score") or 0) * 100))
            status = "OK" if perf >= 70 and seo >= 80 else "WARN"
            report_lines.append(
                f"  [{status}] {u}: Performance {perf}/100, SEO {seo}/100"
            )
        except Exception as e:
            report_lines.append(f"  {u}: error - {e}")

    report_lines += [
        "",
        "Priority Actions:",
        "  Fix pages with Performance < 70 first.",
        "  Improve metadata and internal linking for SEO < 80.",
    ]

    if send_email("Weekly SEO Report - CodeSunny", "\n".join(report_lines)):
        state["last_weekly_seo"] = today


def check_uptime_and_ssl():
    domains_raw = os.environ.get("MONITOR_DOMAINS", "").strip()
    if not domains_raw:
        logger.info("Uptime check skipped - MONITOR_DOMAINS not set")
        return

    domains = [d.strip() for d in domains_raw.split(",") if d.strip()]
    alerts = []

    for d in domains[:30]:
        url = d if d.startswith("http") else f"https://{d}"
        try:
            r = requests.get(url, timeout=12, allow_redirects=True)
            if r.status_code >= 400:
                alerts.append(f"{url} returned HTTP {r.status_code}")
                logger.warning(f"Uptime check failed for {url}: HTTP {r.status_code}")
            else:
                logger.info(f"{url} is up (HTTP {r.status_code})")

            host = urlparse(url).hostname
            if host:
                context = ssl.create_default_context()
                with ssl.create_connection((host, 443), timeout=10) as sock:
                    with context.wrap_socket(sock, server_hostname=host) as ssock:
                        cert = ssock.getpeercert()
                        if not cert:
                            alerts.append(f"{url} SSL certificate missing or invalid")
        except Exception as e:
            alerts.append(f"{url} check failed: {e}")
            logger.error(f"Uptime/SSL check error for {url}: {e}")

    if alerts:
        send_email("Uptime/SSL Alert - CodeSunny", "\n".join(alerts))
        logger.warning(f"Uptime/SSL alerts sent: {len(alerts)} issues found")
    else:
        logger.info("All uptime/SSL checks passed")


def maybe_backup_mongo(db, state: Dict, chunk_size: int = 1000):
    today = datetime.now(timezone.utc).date().isoformat()
    if state.get("last_backup") == today:
        logger.info("Backup already done today - skipping")
        return

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
    backup_file = BACKUP_DIR / f"leads_backup_{today}.json"
    total = 0

    try:
        with backup_file.open("w", encoding="utf-8") as f:
            f.write("[\n")
            cursor = col.find({})
            first = True
            chunk = []

            for doc in cursor:
                doc["_id"] = str(doc.get("_id"))
                chunk.append(doc)
                if len(chunk) >= chunk_size:
                    for d in chunk:
                        if not first:
                            f.write(",\n")
                        f.write(json.dumps(d))
                        first = False
                    total += len(chunk)
                    chunk = []

            for d in chunk:
                if not first:
                    f.write(",\n")
                f.write(json.dumps(d))
                first = False
            total += len(chunk)

            f.write("\n]")

        state["last_backup"] = today
        logger.info(f"Backup complete: {total} docs -> {backup_file}")

        backups = sorted(BACKUP_DIR.glob("leads_backup_*.json"))
        for old in backups[:-30]:
            old.unlink()
            logger.info(f"Old backup removed: {old.name}")

    except Exception as e:
        logger.error(f"Backup failed: {e}")


def maybe_run_inbound_auto_reply(state: Dict):
    poll_seconds = int(os.environ.get("INBOUND_EMAIL_POLL_SECONDS", "120"))
    now = datetime.now(timezone.utc)
    last_polled = state.get("last_inbound_email_poll", "")

    if last_polled:
        try:
            last_dt = datetime.fromisoformat(last_polled.replace("Z", "+00:00"))
            elapsed = (now - last_dt).total_seconds()
            if elapsed < poll_seconds:
                logger.info(
                    "Inbound poll skipped; next run in %.0fs.",
                    poll_seconds - elapsed,
                )
                return
        except Exception:
            logger.warning("Invalid last_inbound_email_poll state. Resetting poll timer.")

    stats = process_unread()
    state["last_inbound_email_poll"] = now.isoformat() + "Z"
    logger.info("Inbound auto-reply stats: %s", stats)


def maybe_run_followup_scheduler(state: Dict):
    enabled = os.environ.get("FOLLOWUP_SCHEDULER_ENABLED", "true").strip().lower()
    if enabled not in {"1", "true", "yes", "on"}:
        logger.info("Follow-up scheduler disabled by FOLLOWUP_SCHEDULER_ENABLED.")
        return

    today = datetime.now(timezone.utc).date().isoformat()
    if state.get("last_followup_scheduler") == today:
        logger.info("Follow-up scheduler already ran today.")
        return

    stats = run_daily_followup_scheduler()
    if stats.get("success"):
        state["last_followup_scheduler"] = today
    logger.info("Follow-up scheduler stats: %s", stats)


def run_once():
    logger.info("-- Automation cycle starting --")
    state = load_state()
    db = get_db()

    if db is None:
        logger.warning("MongoDB not available - skipping DB-dependent tasks.")
    else:
        sync_to_google_sheets(db, state)
        process_hot_lead_alerts(db, state)
        maybe_send_digests(db, state)
        maybe_backup_mongo(db, state)

    run_weekly_seo_report(state)
    check_uptime_and_ssl()
    maybe_run_inbound_auto_reply(state)
    maybe_run_followup_scheduler(state)

    save_state(state)
    logger.info("-- Automation cycle complete --")


if __name__ == "__main__":
    mode = os.environ.get("AUTOMATION_HUB_MODE", "once").strip().lower()
    poll = int(os.environ.get("AUTOMATION_POLL_SECONDS", "120"))

    try:
        acquire_lock()
        if mode == "loop":
            logger.info(f"Loop mode - running every {poll} seconds")
            while True:
                try:
                    run_once()
                except Exception as e:
                    logger.error(f"Cycle error: {e}")
                time.sleep(max(30, poll))
        else:
            run_once()
    finally:
        release_lock()
