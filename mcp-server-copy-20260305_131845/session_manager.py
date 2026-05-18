"""
Session Manager - Persistent Memory for Chatbot
Primary storage: Supabase (optional)
Fallback storage: local JSON files
"""

import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict
from urllib.parse import quote

import requests

# In-memory cache
SESSION_STORE: Dict[str, dict] = {}

# Local fallback/backup storage
SESSION_DIR = Path(__file__).parent / "data" / "sessions"
SESSION_DIR.mkdir(exist_ok=True, parents=True)

# Supabase config
SUPABASE_URL = (
    os.environ.get("SUPABASE_URL", "").strip()
    or os.environ.get("VITE_SUPABASE_URL", "").strip()
).rstrip("/")
SUPABASE_KEY = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    or os.environ.get("SUPABASE_ANON_KEY", "").strip()
    or os.environ.get("VITE_SUPABASE_ANON_KEY", "").strip()
)
SUPABASE_TABLE = os.environ.get("SUPABASE_SESSIONS_TABLE", "chat_sessions").strip() or "chat_sessions"


def _supabase_enabled() -> bool:
    return bool(SUPABASE_URL and SUPABASE_KEY)


def _supabase_headers() -> dict:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }


def _session_defaults(session_id: str) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    return {
        "session_id": session_id,
        "created_at": now,
        "last_active": now,
        # State tracking
        "stage": None,
        "intent": None,
        # User data
        "business_type": None,
        "budget_range": None,
        "timeline": None,
        "services_interested": [],
        # Action flags
        "meeting_requested": False,
        "quote_requested": False,
        "seo_audit_requested": False,
        "image_requested": False,
        "lead_captured": False,
        # Conversation history
        "history": [],
        # Metadata
        "message_count": 0,
        "tools_used": [],
    }


def _load_from_supabase(session_id: str):
    if not _supabase_enabled():
        return None

    try:
        sid = quote(session_id, safe="")
        url = f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}?session_id=eq.{sid}&select=payload&limit=1"
        res = requests.get(url, headers=_supabase_headers(), timeout=8)
        if not res.ok:
            return None

        rows = res.json()
        if not rows:
            return None

        payload = rows[0].get("payload")
        return payload if isinstance(payload, dict) else None
    except Exception:
        return None


def _save_to_supabase(session: dict) -> None:
    if not _supabase_enabled():
        return

    try:
        url = f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}"
        headers = _supabase_headers()
        headers["Prefer"] = "resolution=merge-duplicates,return=minimal"

        data = [{
            "session_id": session.get("session_id"),
            "payload": session,
        }]
        requests.post(url, headers=headers, data=json.dumps(data), timeout=8)
    except Exception:
        pass


def _delete_from_supabase(session_id: str) -> None:
    if not _supabase_enabled():
        return

    try:
        sid = quote(session_id, safe="")
        url = f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}?session_id=eq.{sid}"
        requests.delete(url, headers=_supabase_headers(), timeout=8)
    except Exception:
        pass


def generate_session_id() -> str:
    """Generate unique session ID."""
    return str(uuid.uuid4())


def get_session(session_id: str) -> dict:
    """
    Get or create session.

    Priority:
    1) In-memory cache
    2) Supabase (if configured)
    3) Local disk file
    4) Fresh session
    """
    if not session_id:
        session_id = generate_session_id()

    if session_id not in SESSION_STORE:
        loaded = _load_from_supabase(session_id)

        if loaded is None:
            session_file = SESSION_DIR / f"{session_id}.json"
            if session_file.exists():
                try:
                    with open(session_file, "r", encoding="utf-8") as f:
                        loaded = json.load(f)
                except Exception:
                    loaded = None

        if loaded is None:
            loaded = _session_defaults(session_id)

        SESSION_STORE[session_id] = loaded

    SESSION_STORE[session_id]["last_active"] = datetime.now(timezone.utc).isoformat()
    save_session(session_id)
    return SESSION_STORE[session_id]


def update_session(session_id: str, key: str, value) -> None:
    """Update session field."""
    if session_id in SESSION_STORE:
        SESSION_STORE[session_id][key] = value
        save_session(session_id)


def add_to_history(session_id: str, role: str, content: str) -> None:
    """Add message to conversation history (keep last 10)."""
    session = get_session(session_id)
    session["history"].append(
        {
            "role": role,
            "content": content,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    )

    if len(session["history"]) > 10:
        session["history"] = session["history"][-10:]

    session["message_count"] += 1
    save_session(session_id)


def save_session(session_id: str) -> None:
    """Persist session to Supabase (if enabled) and local JSON backup."""
    if session_id not in SESSION_STORE:
        return

    session = SESSION_STORE[session_id]
    _save_to_supabase(session)

    session_file = SESSION_DIR / f"{session_id}.json"
    with open(session_file, "w", encoding="utf-8") as f:
        json.dump(session, f, indent=2)


def clear_session(session_id: str) -> None:
    """Clear session from cache + storage."""
    if session_id in SESSION_STORE:
        del SESSION_STORE[session_id]

    session_file = SESSION_DIR / f"{session_id}.json"
    if session_file.exists():
        session_file.unlink()

    _delete_from_supabase(session_id)


def get_session_context(session_id: str) -> str:
    """Get formatted session context for LLM."""
    session = get_session(session_id)

    context_parts = []

    if session["business_type"]:
        context_parts.append(f"Business type: {session['business_type']}")

    if session["services_interested"]:
        context_parts.append(f"Interested in: {', '.join(session['services_interested'])}")

    if session["budget_range"]:
        context_parts.append(f"Budget: {session['budget_range']}")

    if session["timeline"]:
        context_parts.append(f"Timeline: {session['timeline']}")

    if context_parts:
        return "User context: " + " | ".join(context_parts)

    return ""


print("Session Manager Loaded")
print(f"  Session storage (disk backup): {SESSION_DIR}")
print(f"  Supabase session storage: {'enabled' if _supabase_enabled() else 'disabled'}")
