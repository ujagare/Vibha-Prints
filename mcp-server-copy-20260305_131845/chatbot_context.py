"""
Context and guardrails for Vibha Prints chatbot replies.

Keeps replies specific by injecting Supabase lead data, pipeline stage,
and recent chat history before the model is called.
"""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

BLOCKED_TOPICS = [
    "competitor price",
    "legal",
    "lawsuit",
    "refund policy",
    "refund",
    "payment dispute",
    "complaint escalation",
]

SAFE_FORWARD_REPLY = (
    "Ye matter main humari team ko forward kar raha hoon. "
    "Aap apna name, phone number aur order/project details share kar dijiye, team aapko directly guide karegi."
)


def guardrail_reply(user_message: str) -> str:
    text = (user_message or "").lower()
    if any(topic in text for topic in BLOCKED_TOPICS):
        return SAFE_FORWARD_REPLY
    return ""


def _supabase_modules():
    try:
        from supabase_client import add_lead_activity, is_supabase_configured, supabase

        if not is_supabase_configured() or not supabase:
            return None
        return {"supabase": supabase, "add_lead_activity": add_lead_activity}
    except Exception:
        return None


def get_context_for_reply(client_email: str = "", session: dict | None = None) -> dict:
    session = session or {}
    email = (client_email or session.get("user_email") or "").strip().lower()
    context = {
        "client_name": session.get("user_name") or "Client",
        "client_email": email,
        "pipeline_stage": session.get("stage") or "new",
        "last_interaction": session.get("last_active") or "",
        "chat_history": (session.get("history") or [])[-5:],
        "lead_id": "",
        "lead_type": "contact",
    }

    modules = _supabase_modules()
    if not modules or not email:
        return context

    supabase = modules["supabase"]
    try:
        chat_response = (
            supabase.table("chat_sessions")
            .select("*")
            .eq("user_email", email)
            .order("last_activity", desc=True)
            .limit(1)
            .execute()
        )
        chat_session = (chat_response.data or [{}])[0]
        if chat_session:
            saved_messages = chat_session.get("messages") or []
            if saved_messages:
                context["chat_history"] = saved_messages[-5:]
            context["last_interaction"] = (
                chat_session.get("last_activity")
                or chat_session.get("updated_at")
                or context["last_interaction"]
            )

        lead_response = (
            supabase.table("contact_leads")
            .select("*")
            .eq("email", email)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        lead = (lead_response.data or [{}])[0]
        if not lead:
            return context

        context["client_name"] = lead.get("name") or context["client_name"]
        context["lead_id"] = lead.get("id") or ""
        context["last_interaction"] = lead.get("created_at") or context["last_interaction"]

        if context["lead_id"]:
            pipeline_response = (
                supabase.table("lead_pipeline")
                .select("*")
                .eq("lead_id", context["lead_id"])
                .eq("lead_type", "contact")
                .limit(1)
                .execute()
            )
            pipeline = (pipeline_response.data or [{}])[0]
            context["pipeline_stage"] = pipeline.get("status") or context["pipeline_stage"]
    except Exception:
        return context

    return context


def build_contextual_user_prompt(message: str, context: dict) -> str:
    history_lines = []
    for item in context.get("chat_history", [])[-5:]:
        role = item.get("role", "user")
        content = item.get("content", "")
        if content:
            history_lines.append(f"{role}: {content}")

    history_text = "\n".join(history_lines) or "No previous chat history."
    return (
        f"Client message: {message}\n\n"
        "Client context:\n"
        f"- Client name: {context.get('client_name') or 'Client'}\n"
        f"- Client email: {context.get('client_email') or 'unknown'}\n"
        f"- Pipeline stage: {context.get('pipeline_stage') or 'new'}\n"
        f"- Last interaction: {context.get('last_interaction') or 'unknown'}\n\n"
        f"Previous conversation:\n{history_text}\n\n"
        "Reply with the system rules. Be specific to this client if context is available."
    )


def clean_reply(reply: str, max_chars: int = 500) -> str:
    text = (reply or "").strip()
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if len(lines) > 4:
        text = "\n".join(lines[:4])
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rsplit(" ", 1)[0].rstrip() + "..."


def save_chat_activity(context: dict, user_message: str, assistant_reply: str) -> None:
    modules = _supabase_modules()
    lead_id = context.get("lead_id")
    lead_type = context.get("lead_type") or "contact"
    if not modules or not lead_id:
        return

    try:
        modules["add_lead_activity"](
            lead_id,
            lead_type,
            "chat_reply_sent",
            {
                "client_email": context.get("client_email"),
                "pipeline_stage": context.get("pipeline_stage"),
                "user_message": (user_message or "")[:500],
                "assistant_reply": (assistant_reply or "")[:500],
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )
    except Exception:
        pass


def save_chat_history(
    context: dict,
    session_id: str,
    user_message: str,
    assistant_reply: str,
    session: dict | None = None,
) -> None:
    """Persist the latest exchange in Supabase chat_sessions.messages."""
    modules = _supabase_modules()
    if not modules:
        return

    email = (context.get("client_email") or "").strip().lower()
    session_id = (session_id or "").strip()
    if not email and not session_id:
        return

    supabase = modules["supabase"]
    now = datetime.now(timezone.utc).isoformat()
    new_messages = [
        {"role": "user", "content": (user_message or "")[:1000], "timestamp": now},
        {"role": "assistant", "content": (assistant_reply or "")[:1000], "timestamp": now},
    ]

    try:
        existing = []
        if session_id:
            existing = (
                supabase.table("chat_sessions")
                .select("*")
                .eq("session_id", session_id)
                .limit(1)
                .execute()
                .data
                or []
            )
        if not existing and email:
            existing = (
                supabase.table("chat_sessions")
                .select("*")
                .eq("user_email", email)
                .order("last_activity", desc=True)
                .limit(1)
                .execute()
                .data
                or []
            )

        payload = {
            "user_email": email or None,
            "user_name": context.get("client_name") if context.get("client_name") != "Client" else None,
            "messages": ((existing[0].get("messages") or []) if existing else [])[-48:] + new_messages,
            "last_activity": now,
            "updated_at": now,
        }
        if session:
            payload["payload"] = {"local_session_id": session.get("session_id"), "stage": session.get("stage")}

        if existing:
            row_session_id = existing[0].get("session_id")
            if row_session_id:
                supabase.table("chat_sessions").update(payload).eq("session_id", row_session_id).execute()
            else:
                supabase.table("chat_sessions").update(payload).eq("id", existing[0].get("id")).execute()
        else:
            payload["session_id"] = session_id or f"chat-{uuid4()}"
            supabase.table("chat_sessions").insert(payload).execute()
    except Exception:
        pass
