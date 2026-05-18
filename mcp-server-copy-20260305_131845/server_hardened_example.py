"""
COMPLETE HARDENED SERVER EXAMPLE
This shows how to properly integrate ALL hardening layers
Copy this pattern to your actual server.py
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")

# ============================================================================
# IMPORT HARDENING MODULES
# ============================================================================

from tool_wrapper import secure_tool, safe_external_call, async_log
from middleware import (
    rate_limit_middleware,
    logging_middleware,
    global_exception_handler,
    cors_middleware,
    security_headers_middleware
)
from validation import (
    LeadCreateSchema,
    PaymentLinkSchema,
    ChatMessageSchema,
    ProposalGenerationSchema,
    StageUpdateSchema
)
from resilience import get_circuit_breaker, CircuitOpenError
from logger import logger
from rate_limiter import rate_limiter
from token_manager import token_manager, cap_output_tokens

# ============================================================================
# INITIALIZE APP
# ============================================================================

app = FastAPI(title="CodeSunny MCP Server - Hardened")

# Add global exception handler
app.add_exception_handler(Exception, global_exception_handler)

# Add middlewares (order matters - first added runs LAST)
app.middleware("http")(security_headers_middleware)
app.middleware("http")(cors_middleware)
app.middleware("http")(logging_middleware)
app.middleware("http")(rate_limit_middleware)

# ============================================================================
# INITIALIZE AI CLIENTS (with circuit breakers)
# ============================================================================

try:
    from groq import Groq
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    GROQ_AVAILABLE = True
except:
    GROQ_AVAILABLE = False

# ============================================================================
# TOOL HANDLERS (Hardened with wrapper)
# ============================================================================

# Example 1: Create Lead (Hardened)
@secure_tool(
    tool_name="create_lead",
    schema_model=LeadCreateSchema,
    rate_limit_tier="default",
    user_id_field="email"
)
async def create_lead_handler(validated_data: dict, user_id: str = None):
    """
    Create lead with full hardening:
    - Input validated (LeadCreateSchema)
    - Rate limited (100/min)
    - Logged automatically
    - Error handled automatically
    """
    lead = {
        "name": validated_data["name"],
        "email": validated_data["email"],
        "message": validated_data["message"],
        "created_at": "2024-01-01T00:00:00Z"
    }
    
    # Save lead (your logic here)
    # append_lead(lead)
    
    # Send email with retry and circuit breaker
    @safe_external_call("smtp_server", max_attempts=3)
    def send_email():
        # Your email sending logic
        return True
    
    try:
        emailed = send_email()
    except:
        emailed = False
    
    return {
        "status": "success",
        "lead": lead,
        "emailed": emailed
    }


# Example 2: Chat (AI with token management)
@secure_tool(
    tool_name="chat",
    schema_model=ChatMessageSchema,
    rate_limit_tier="ai",
    user_id_field="user_id"
)
async def chat_handler(validated_data: dict, user_id: str = "default"):
    """
    Chat with AI:
    - Input validated (XSS prevention)
    - Rate limited (10/min for AI)
    - Token managed (auto-compression)
    - Retry on failure
    - Circuit breaker protection
    """
    message = validated_data["message"]
    
    # Add to token manager
    token_manager.add_message(user_id, "user", message)
    
    # Check if compression needed
    if token_manager.should_compress(user_id):
        token_manager.summarize_and_compress(user_id)
    
    # Get conversation
    conversation = token_manager.get_conversation(user_id)
    
    if not GROQ_AVAILABLE:
        return {"reply": "AI service not configured"}
    
    # Call AI with retry and circuit breaker
    @safe_external_call("groq_api", max_attempts=3)
    def call_ai():
        return groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=conversation,
            max_tokens=cap_output_tokens(),  # Capped at 800
            temperature=0.4
        )
    
    try:
        response = call_ai()
        reply = response.choices[0].message.content
        
        # Add response to token manager
        token_manager.add_message(user_id, "assistant", reply)
        
        return {"reply": reply}
        
    except CircuitOpenError:
        return {"reply": "AI service temporarily unavailable. Please try again in a minute."}
    except Exception as e:
        logger.error("chat", "AI call failed", error=e)
        return {"reply": "I'm having trouble right now. Please try again."}


# Example 3: Payment Link (STRICT hardening)
@secure_tool(
    tool_name="generate_payment_link",
    schema_model=PaymentLinkSchema,
    rate_limit_tier="payment",  # STRICT: 5 per 5 minutes
    user_id_field="client_email",
    is_financial=True  # Audit trail enabled
)
async def payment_link_handler(validated_data: dict, user_id: str = None):
    """
    Generate payment link:
    - STRICT validation (amount > 0, reasonable limits)
    - STRICT rate limiting (5 per 5 minutes)
    - Audit trail (all operations logged)
    - Retry on failure
    - Circuit breaker protection
    """
    # Simulated Razorpay call
    @safe_external_call("razorpay_api", max_attempts=3)
    def create_link():
        # Your Razorpay logic here
        return {
            "id": "link_123",
            "short_url": "https://rzp.io/l/abc123"
        }
    
    try:
        result = create_link()
        
        return {
            "status": "success",
            "payment_link": result["short_url"],
            "payment_id": result["id"],
            "amount": validated_data["amount"],
            "currency": validated_data["currency"]
        }
        
    except CircuitOpenError:
        return {"error": "Payment service temporarily unavailable"}
    except Exception as e:
        logger.error("payment_link", "Failed to create payment link", error=e)
        return {"error": "Failed to generate payment link"}


# Example 4: Update Lead Stage (CRM)
@secure_tool(
    tool_name="update_lead_stage",
    schema_model=StageUpdateSchema,
    rate_limit_tier="default",
    user_id_field="lead_email"
)
async def update_lead_stage_handler(validated_data: dict, user_id: str = None):
    """
    Update CRM lead stage:
    - Validated stage values
    - Rate limited
    - Logged automatically
    """
    # Your CRM update logic here
    return {
        "status": "updated",
        "email": validated_data["lead_email"],
        "new_stage": validated_data["new_stage"],
        "notes": validated_data["notes"]
    }


# ============================================================================
# API ENDPOINTS (Register handlers)
# ============================================================================

@app.post("/api/create-lead")
async def create_lead_endpoint(request: Request):
    """
    Create lead endpoint
    Automatically protected by:
    - Global rate limiting (middleware)
    - Request logging (middleware)
    - Tool-specific validation (wrapper)
    - Tool-specific rate limiting (wrapper)
    """
    data = await request.json()
    return await create_lead_handler(data)


@app.post("/api/chat")
async def chat_endpoint(request: Request):
    """Chat endpoint with full AI protection"""
    data = await request.json()
    user_id = data.get("user_id", "default")
    return await chat_handler(data, user_id=user_id)


@app.post("/api/generate-payment-link")
async def payment_link_endpoint(request: Request):
    """Payment link endpoint with STRICT protection"""
    data = await request.json()
    return await payment_link_handler(data)


@app.post("/api/update-lead-stage")
async def update_lead_stage_endpoint(request: Request):
    """Update lead stage endpoint"""
    data = await request.json()
    return await update_lead_stage_handler(data)


# ============================================================================
# HEALTH CHECK & MONITORING ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "groq": GROQ_AVAILABLE,
            "rate_limiter": "active",
            "logger": "active"
        }
    }


@app.get("/api/rate-limits")
async def get_rate_limits():
    """Get rate limit configurations"""
    return rate_limiter.get_all_limits()


@app.get("/api/circuit-breakers")
async def get_circuit_breakers():
    """Get circuit breaker states"""
    from resilience import circuit_breakers
    return {
        name: breaker.get_state()
        for name, breaker in circuit_breakers.items()
    }


# ============================================================================
# STARTUP & SHUTDOWN
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info("server_startup", "MCP Server starting up")
    print("=" * 60)
    print("🛡️  HARDENED MCP SERVER STARTED")
    print("=" * 60)
    print("✅ Global rate limiting: ACTIVE")
    print("✅ Request logging: ACTIVE")
    print("✅ Input validation: ACTIVE")
    print("✅ Circuit breakers: ACTIVE")
    print("✅ Token management: ACTIVE")
    print("✅ Security headers: ACTIVE")
    print("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("server_shutdown", "MCP Server shutting down")


# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    
    print(f"\n🚀 Starting server on http://0.0.0.0:{port}")
    print(f"📊 Logs: mcp-server/logs/")
    print(f"🔒 All endpoints protected with hardening layers\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
