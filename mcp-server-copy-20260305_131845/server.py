from mcp.server.fastmcp import FastMCP
import inspect
import json
import os
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables:
# 1) local .env beside this file
# 2) parent project .env (fallback)
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Optional providers
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model


def _get_transport_security():
    try:
        from mcp.server.lowlevel.server import TransportSecuritySettings
    except Exception:
        return None

    is_render = any(
        os.environ.get(k)
        for k in ("RENDER_EXTERNAL_HOSTNAME", "RENDER", "RENDER_SERVICE_ID")
    )
    if is_render and "MCP_DISABLE_DNS_REBINDING" not in os.environ:
        os.environ["MCP_DISABLE_DNS_REBINDING"] = "true"

    disable = os.environ.get("MCP_DISABLE_DNS_REBINDING", "").strip().lower()
    if disable in ("1", "true", "yes"):
        return TransportSecuritySettings(enable_dns_rebinding_protection=False)

    allowed_hosts = []
    render_host = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
    if render_host:
        allowed_hosts.extend([render_host, f"{render_host}:*"])

    extra_hosts = os.environ.get("MCP_ALLOWED_HOSTS", "")
    for h in [x.strip() for x in extra_hosts.split(",") if x.strip()]:
        allowed_hosts.append(h)

    if not allowed_hosts:
        return None

    return TransportSecuritySettings(
        enable_dns_rebinding_protection=True,
        allowed_hosts=allowed_hosts,
    )


def _build_mcp():
    kwargs = {}
    try:
        params = inspect.signature(FastMCP).parameters
        if "transport_security" in params:
            ts = _get_transport_security()
            if ts is not None:
                kwargs["transport_security"] = ts
    except Exception:
        pass

    return FastMCP("Vibha Prints MCP", **kwargs)


mcp = _build_mcp()

# Provider setup (priority: Groq > Gemini)
groq_key = os.environ.get("GROQ_API_KEY")
gemini_key = os.environ.get("GEMINI_API_KEY")

groq_client = (
    Groq(api_key=groq_key)
    if GROQ_AVAILABLE and groq_key and groq_key != "your_groq_api_key_here"
    else None
)

gemini_client = None
if GEMINI_AVAILABLE and gemini_key and gemini_key != "your_gemini_api_key_here":
    gemini_model = os.environ.get("GEMINI_MODEL", "gemini-1.5-pro")
    gemini_client = create_gemini_model(gemini_key, gemini_model)

client = groq_client or gemini_client
client_type = "groq" if groq_client else ("gemini" if gemini_client else None)

print("AI Client initialized:", client_type)


@mcp.tool()
def chat(message: str, session_id: str = "", client_email: str = ""):
    """
    Chatbot-only MCP tool.
    Uses Gemini handler if available, otherwise falls back to llm_handler.
    """
    from session_manager import get_session, add_to_history
    from chatbot_context import (
        clean_reply,
        get_context_for_reply,
        guardrail_reply,
        save_chat_activity,
        save_chat_history,
    )

    session = get_session(session_id)
    session_id = session["session_id"]
    context = get_context_for_reply(client_email, session)
    session["client_context"] = context

    blocked_reply = guardrail_reply(message)
    if blocked_reply:
        add_to_history(session_id, "user", message)
        add_to_history(session_id, "assistant", blocked_reply)
        save_chat_activity(context, message, blocked_reply)
        save_chat_history(context, session_id, message, blocked_reply, session)
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "reply": blocked_reply,
                    "session_id": session_id,
                    "action": "forward_to_team",
                    "pipeline_stage": context.get("pipeline_stage"),
                })
            }]
        }

    add_to_history(session_id, "user", message)

    # Preferred flow: specialized Gemini chat handler
    try:
        from gemini_chat_handler import handle_chat_with_gemini

        response = handle_chat_with_gemini(message, session)
        reply_text = clean_reply(response.get("reply", "How can I help you today?"))

        add_to_history(session_id, "assistant", reply_text)
        save_chat_activity(context, message, reply_text)
        save_chat_history(context, session_id, message, reply_text, session)

        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "reply": reply_text,
                    "session_id": session_id,
                    "client_name": context.get("client_name"),
                    "pipeline_stage": context.get("pipeline_stage"),
                    "intent": response.get("intent"),
                    "action": response.get("action"),
                    "confidence": response.get("confidence"),
                })
            }]
        }

    except Exception:
        # Generic fallback chat
        from llm_handler import chat_with_llm

        from chatbot_context import build_contextual_user_prompt

        response = chat_with_llm(build_contextual_user_prompt(message, context), session)
        reply_text = clean_reply(response.get("reply", "How can I help you today?"))

        add_to_history(session_id, "assistant", reply_text)
        save_chat_activity(context, message, reply_text)
        save_chat_history(context, session_id, message, reply_text, session)

        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "reply": reply_text,
                    "session_id": session_id,
                    "client_name": context.get("client_name"),
                    "pipeline_stage": context.get("pipeline_stage"),
                    "action": response.get("action"),
                    "next_step": response.get("next_step"),
                })
            }]
        }


@mcp.tool()
def chat_reply(message: str, client_email: str = "", session_id: str = ""):
    """
    Context-aware chatbot reply tool.
    Fetches Supabase lead context, applies guardrails, saves chat history/activity,
    and returns a short client-ready reply.
    """
    return chat(message=message, session_id=session_id, client_email=client_email)


@mcp.tool()
def create_lead(name: str, email: str, message: str = "", phone: str = "", company: str = "", lead_type: str = "contact"):
    """
    Create a lead in Supabase database and send automated emails.
    
    Args:
        name: Lead name
        email: Lead email
        message: Lead message (optional)
        phone: Lead phone number (optional)
        company: Company name (optional)
        lead_type: Type of lead - 'contact' or 'brochure' (default: contact)
    
    Returns:
        MCP tool response with success status
    """
    from supabase_client import (
        save_contact_lead,
        save_brochure_lead,
        create_pipeline_entry,
        add_lead_activity,
    )
    from email_lead_automation import (
        send_contact_form_reply,
        send_brochure_download_email,
        send_hot_lead_alert,
        send_internal_lead_notification,
    )
    import logging
    
    logger = logging.getLogger("create_lead")
    
    def _extract_lead_id(result_payload):
        data = result_payload.get("data")
        if isinstance(data, list) and data:
            return data[0].get("id")
        if isinstance(data, dict):
            return data.get("id")
        return None

    try:
        logger.info(f"📝 Creating lead: {name} ({email})")
        
        # Save to Supabase
        if lead_type == "brochure":
            logger.info(f"📥 Saving brochure lead...")
            result = save_brochure_lead(
                name=name,
                email=email,
                phone=phone or "",
                company=company or "",
                source="mcp-server"
            )
            
            # Send brochure confirmation email
            if result.get("success"):
                logger.info(f"📧 Sending brochure confirmation email...")
                email_sent = send_brochure_download_email(name, email, company)
                logger.info(f"📧 Brochure email sent: {email_sent}")
            else:
                logger.error(f"❌ Failed to save brochure lead: {result.get('error')}")
        else:
            logger.info(f"📥 Saving contact lead...")
            result = save_contact_lead(
                name=name,
                email=email,
                mobile=phone or "",
                message=message or "",
                source="mcp-server"
            )
            
            # Send contact form reply
            if result.get("success"):
                logger.info(f"📧 Sending contact form reply email...")
                email_sent = send_contact_form_reply(name, email, message or "")
                logger.info(f"📧 Contact email sent: {email_sent}")
            else:
                logger.error(f"❌ Failed to save contact lead: {result.get('error')}")

        # Send hot lead alert if applicable
        if result.get("success"):
            logger.info(f"📧 Sending internal lead notification...")
            internal_alert_sent = send_internal_lead_notification(
                name=name,
                email=email,
                message=message or "",
                phone=phone or "",
                company=company or "",
                lead_type=lead_type,
            )
            logger.info(f"📧 Internal lead notification sent: {internal_alert_sent}")

            logger.info(f"🔥 Checking for hot lead...")
            alert_sent = send_hot_lead_alert(name, email, message or "", lead_type)

            lead_id = _extract_lead_id(result) or ""
            if lead_id:
                create_pipeline_entry(lead_id, lead_type, status="new")
                add_lead_activity(lead_id, lead_type, "lead_created")
                add_lead_activity(lead_id, lead_type, "email_sent")
                if internal_alert_sent:
                    add_lead_activity(lead_id, lead_type, "internal_lead_notification")
                if lead_type == "brochure":
                    add_lead_activity(lead_id, lead_type, "brochure_sent")
                if alert_sent:
                    add_lead_activity(lead_id, lead_type, "hot_lead_alert")
        
        logger.info(f"✅ Lead creation complete")
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(result)
            }]
        }
    
    except Exception as e:
        logger.error(f"❌ Error in create_lead: {type(e).__name__}: {e}")
        import traceback
        logger.error(traceback.format_exc())
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": False,
                    "error": str(e)
                })
            }]
        }


@mcp.tool()
def send_followup_email(email: str, name: str, days_since: int = 1):
    """
    Send follow-up email to a lead.
    
    Args:
        email: Lead email
        name: Lead name
        days_since: Days since initial contact (1, 3, or 7)
    
    Returns:
        MCP tool response with success status
    """
    from email_lead_automation import send_followup_email as send_followup
    
    try:
        success = send_followup(name, email, days_since)
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": success,
                    "message": f"Follow-up email sent to {email}" if success else "Failed to send email",
                    "days_since": days_since
                })
            }]
        }
    
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": False,
                    "error": str(e)
                })
            }]
        }


@mcp.tool()
def score_lead_tool(name: str, email: str, message: str, lead_type: str = "contact"):
    """
    Score a lead based on engagement and message content.
    
    Args:
        name: Lead name
        email: Lead email
        message: Lead message
        lead_type: Type of lead - 'contact' or 'brochure'
    
    Returns:
        MCP tool response with lead score and priority
    """
    from email_lead_automation import score_lead
    
    try:
        lead_score = score_lead(name, email, message, lead_type)
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": True,
                    "lead": {
                        "name": name,
                        "email": email,
                        "type": lead_type
                    },
                    "score": lead_score["score"],
                    "priority": lead_score["priority"],
                    "indicators": lead_score["indicators"]
                })
            }]
        }
    
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": False,
                    "error": str(e)
                })
            }]
        }


@mcp.tool()
def run_followup_scheduler():
    """
    Run the daily follow-up email scheduler.
    Sends all scheduled follow-up emails (Day 1, 3, 7, 14, 30).
    
    Returns:
        MCP tool response with scheduler results
    """
    from followup_scheduler import run_daily_followup_scheduler
    
    try:
        result = run_daily_followup_scheduler()
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(result)
            }]
        }
    
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": False,
                    "error": str(e)
                })
            }]
        }


@mcp.tool()
def get_followup_status(email: str):
    """
    Get follow-up email status for a specific lead.
    
    Args:
        email: Lead email address
    
    Returns:
        MCP tool response with follow-up status
    """
    from followup_scheduler import get_followup_status
    
    try:
        status = get_followup_status(email)
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": True,
                    "data": status
                })
            }]
        }
    
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": False,
                    "error": str(e)
                })
            }]
        }


@mcp.tool()
def get_scheduler_stats():
    """
    Get overall follow-up scheduler statistics.
    
    Returns:
        MCP tool response with scheduler stats
    """
    from followup_scheduler import get_scheduler_stats
    
    try:
        stats = get_scheduler_stats()
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": True,
                    "data": stats
                })
            }]
        }
    
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "success": False,
                    "error": str(e)
                })
            }]
        }


def run_http_server():
    """Start the MCP HTTP server after every tool has been registered."""
    port = int(os.environ.get("PORT", "8000"))

    ts = _get_transport_security()
    if hasattr(mcp, "streamable_http_app"):
        try:
            app = mcp.streamable_http_app(transport_security=ts) if ts else mcp.streamable_http_app()
        except TypeError:
            app = mcp.streamable_http_app()
    else:
        try:
            app = mcp.http_app(transport_security=ts) if ts else mcp.http_app()
        except TypeError:
            app = mcp.http_app()

    import uvicorn

    print(f"Starting MCP server on http://0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)

@mcp.tool()
def update_pipeline_status_tool(lead_id: str, lead_type: str, status: str, assigned_to: str = "", notes: str = ""):
    """Update lead pipeline status."""
    from supabase_client import update_pipeline_status
    try:
        result = update_pipeline_status(lead_id, lead_type, status, assigned_to, notes)
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(result)
            }]
        }
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({"success": False, "error": str(e)})
            }]
        }


@mcp.tool()
def log_lead_activity_tool(lead_id: str, lead_type: str, event: str, meta_json: str = ""):
    """Log lead activity event."""
    from supabase_client import add_lead_activity
    try:
        meta = None
        if meta_json:
            meta = json.loads(meta_json)
        result = add_lead_activity(lead_id, lead_type, event, meta)
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(result)
            }]
        }
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({"success": False, "error": str(e)})
            }]
        }


@mcp.tool()
def create_quote_request_tool(lead_id: str, lead_type: str, requirements: str, estimated_budget: float = 0, status: str = "new", quote_draft: str = ""):
    """Create quote request entry."""
    from supabase_client import create_quote_request
    try:
        budget_value = estimated_budget if estimated_budget and estimated_budget > 0 else None
        result = create_quote_request(lead_id, lead_type, requirements, budget_value, status, quote_draft)
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(result)
            }]
        }
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({"success": False, "error": str(e)})
            }]
        }


@mcp.tool()
def create_appointment_tool(lead_id: str, lead_type: str, calendar_provider: str = "", booking_link: str = "", time_slot: str = "", reminder_status: str = "pending"):
    """Create appointment entry."""
    from supabase_client import create_appointment
    try:
        time_value = time_slot if time_slot else None
        result = create_appointment(lead_id, lead_type, calendar_provider, booking_link, time_value, reminder_status)
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(result)
            }]
        }
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({"success": False, "error": str(e)})
            }]
        }


if __name__ == "__main__":
    run_http_server()
