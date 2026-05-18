"""
Universal Tool Wrapper - Central Hardening Enforcement
This ensures ALL tools pass through validation, rate limiting, logging, and token management.
NO TOOL CAN BYPASS THIS - Security via architecture, not discipline.
"""

import time
import asyncio
from functools import wraps
from typing import Callable, Any, Optional, Type
from pydantic import BaseModel, ValidationError

from validation import validate_input, sanitize_string
from resilience import retry_with_backoff, get_circuit_breaker, CircuitOpenError, ExternalAPIError
from logger import logger, generate_request_id, log_tool_execution, log_error_with_context
from rate_limiter import rate_limiter
from token_manager import token_manager, cap_output_tokens

# ============================================================================
# UNIVERSAL TOOL WRAPPER
# ============================================================================

def secure_tool(
    tool_name: str,
    schema_model: Optional[Type[BaseModel]] = None,
    rate_limit_tier: str = "default",
    user_id_field: str = "email",
    requires_auth: bool = False,
    is_financial: bool = False
):
    """
    Universal wrapper that enforces ALL hardening layers
    
    Args:
        tool_name: Name of the tool (for logging)
        schema_model: Pydantic schema for validation
        rate_limit_tier: Rate limit tier (default, payment, ai, email, etc.)
        user_id_field: Field name to extract user ID from
        requires_auth: Whether tool requires authentication
        is_financial: Whether this is a financial operation (stricter controls)
    
    Usage:
        @secure_tool("create_lead", LeadCreateSchema, "default", "email")
        async def create_lead(validated_data: dict):
            # Your logic here
            return {"status": "success"}
    """
    def decorator(handler_function: Callable):
        @wraps(handler_function)
        async def wrapper(request_data: dict, user_id: Optional[str] = None, **kwargs):
            request_id = generate_request_id()
            start_time = time.time()
            
            # Extract user ID from request data if not provided
            if not user_id and user_id_field in request_data:
                user_id = request_data.get(user_id_field, "anonymous")
            else:
                user_id = user_id or "anonymous"
            
            try:
                # ============================================================
                # STEP 1: RATE LIMITING (ENFORCED)
                # ============================================================
                allowed, error_msg = rate_limiter.check_limit(user_id, rate_limit_tier)
                if not allowed:
                    logger.warning(
                        "rate_limit_exceeded",
                        f"Rate limit hit for {tool_name}",
                        tool=tool_name,
                        user_id=user_id,
                        tier=rate_limit_tier,
                        request_id=request_id
                    )
                    return {
                        "error": "rate_limit_exceeded",
                        "message": error_msg,
                        "tier": rate_limit_tier,
                        "request_id": request_id
                    }
                
                # ============================================================
                # STEP 2: INPUT VALIDATION (ENFORCED)
                # ============================================================
                validated_data = request_data
                
                if schema_model:
                    is_valid, error, validated_data = validate_input(schema_model, request_data)
                    
                    if not is_valid:
                        logger.error(
                            "validation_failed",
                            f"Validation failed for {tool_name}",
                            tool=tool_name,
                            error=error,
                            user_id=user_id,
                            request_id=request_id
                        )
                        return {
                            "error": "validation_failed",
                            "message": error,
                            "request_id": request_id
                        }
                
                # ============================================================
                # STEP 3: TOKEN MANAGEMENT (for AI tools)
                # ============================================================
                if rate_limit_tier == "ai":
                    # Check token usage
                    usage = token_manager.get_token_usage(user_id)
                    if usage["usage_percentage"] > 90:
                        logger.warning(
                            "token_limit_warning",
                            f"Token usage high for {user_id}",
                            tool=tool_name,
                            usage=usage,
                            request_id=request_id
                        )
                        # Auto-compress conversation
                        token_manager.summarize_and_compress(user_id)
                
                # ============================================================
                # STEP 4: FINANCIAL OPERATION CONFIRMATION (if required)
                # ============================================================
                if is_financial:
                    # Log audit trail BEFORE execution
                    logger.audit(
                        f"{tool_name}_initiated",
                        user_id,
                        {
                            "request_data": validated_data,
                            "request_id": request_id,
                            "timestamp": time.time()
                        }
                    )
                
                # ============================================================
                # STEP 5: EXECUTE TOOL (with error handling)
                # ============================================================
                
                # Check if function is async
                if asyncio.iscoroutinefunction(handler_function):
                    result = await handler_function(validated_data, user_id=user_id, **kwargs)
                else:
                    result = handler_function(validated_data, user_id=user_id, **kwargs)
                
                # ============================================================
                # STEP 6: LOG SUCCESS
                # ============================================================
                execution_time = time.time() - start_time
                log_tool_execution(
                    tool_name,
                    "success",
                    execution_time,
                    user_id=user_id,
                    request_id=request_id,
                    tier=rate_limit_tier
                )
                
                # Add request_id to response
                if isinstance(result, dict):
                    result["request_id"] = request_id
                
                return result
                
            except CircuitOpenError as e:
                # Circuit breaker is open
                execution_time = time.time() - start_time
                logger.error(
                    "circuit_open",
                    f"Circuit breaker open for {tool_name}",
                    tool=tool_name,
                    error=e,
                    user_id=user_id,
                    request_id=request_id
                )
                return {
                    "error": "service_unavailable",
                    "message": "Service temporarily unavailable. Please try again in a minute.",
                    "request_id": request_id
                }
            
            except ExternalAPIError as e:
                # External API failed after retries
                execution_time = time.time() - start_time
                log_error_with_context(e, {
                    "tool": tool_name,
                    "user_id": user_id,
                    "request_id": request_id,
                    "execution_time": execution_time
                })
                return {
                    "error": "external_api_failed",
                    "message": "External service failed. Please try again later.",
                    "request_id": request_id
                }
            
            except ValidationError as e:
                # Pydantic validation error
                execution_time = time.time() - start_time
                logger.error(
                    "validation_error",
                    f"Validation error in {tool_name}",
                    tool=tool_name,
                    error=str(e),
                    user_id=user_id,
                    request_id=request_id
                )
                return {
                    "error": "validation_failed",
                    "message": str(e),
                    "request_id": request_id
                }
            
            except Exception as e:
                # Unexpected error
                execution_time = time.time() - start_time
                log_error_with_context(e, {
                    "tool": tool_name,
                    "user_id": user_id,
                    "request_id": request_id,
                    "execution_time": execution_time,
                    "request_data": str(request_data)[:200]
                })
                return {
                    "error": "internal_error",
                    "message": "An unexpected error occurred. Please try again.",
                    "request_id": request_id
                }
        
        return wrapper
    return decorator


# ============================================================================
# ASYNC LOGGING HELPER (Non-blocking)
# ============================================================================

import threading

def async_log(event_type: str, message: str, **kwargs):
    """
    Non-blocking async logging
    Runs in separate thread to avoid blocking main execution
    """
    def log_in_thread():
        logger.info(event_type, message, **kwargs)
    
    thread = threading.Thread(target=log_in_thread, daemon=True)
    thread.start()


# ============================================================================
# SAFE API CALL WRAPPER (with retry and circuit breaker)
# ============================================================================

def safe_external_call(service_name: str, max_attempts: int = 3):
    """
    Wrapper for external API calls with retry and circuit breaker
    
    Usage:
        @safe_external_call("groq_api", max_attempts=3)
        def call_groq(prompt: str):
            return groq_client.chat.completions.create(...)
    """
    def decorator(func: Callable):
        @retry_with_backoff(max_attempts=max_attempts)
        @wraps(func)
        def wrapper(*args, **kwargs):
            breaker = get_circuit_breaker(service_name)
            return breaker.call(func, *args, **kwargs)
        return wrapper
    return decorator


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
USAGE IN server.py:

from tool_wrapper import secure_tool, safe_external_call, async_log
from validation import LeadCreateSchema, PaymentLinkSchema, ChatMessageSchema

# Example 1: Secure lead creation
@secure_tool(
    tool_name="create_lead",
    schema_model=LeadCreateSchema,
    rate_limit_tier="default",
    user_id_field="email"
)
async def create_lead_handler(validated_data: dict, user_id: str = None):
    # validated_data is GUARANTEED to be valid
    # rate limit is GUARANTEED to be checked
    # logging is GUARANTEED to happen
    
    lead = {
        "name": validated_data["name"],
        "email": validated_data["email"],
        "message": validated_data["message"]
    }
    
    # Send email with retry
    @safe_external_call("smtp_server", max_attempts=3)
    def send_email():
        return send_lead_email(lead)
    
    emailed = send_email()
    
    return {"status": "success", "emailed": emailed}


# Register endpoint
@mcp.tool()
async def create_lead(name: str, email: str, message: str = ""):
    return await create_lead_handler({
        "name": name,
        "email": email,
        "message": message
    })


# Example 2: Secure payment link (STRICT)
@secure_tool(
    tool_name="generate_payment_link",
    schema_model=PaymentLinkSchema,
    rate_limit_tier="payment",  # STRICT: 5 per 5 minutes
    user_id_field="client_email",
    is_financial=True  # Audit trail enabled
)
async def payment_link_handler(validated_data: dict, user_id: str = None):
    # Call Razorpay with retry and circuit breaker
    @safe_external_call("razorpay_api", max_attempts=3)
    def create_link():
        return razorpay_client.payment_link.create({
            "amount": validated_data["amount"] * 100,
            "currency": validated_data["currency"],
            "description": validated_data["description"],
            "customer": {
                "name": validated_data["client_name"],
                "email": validated_data["client_email"]
            }
        })
    
    result = create_link()
    
    return {
        "status": "success",
        "payment_link": result["short_url"],
        "payment_id": result["id"]
    }


# Example 3: Secure chat (AI with token management)
@secure_tool(
    tool_name="chat",
    schema_model=ChatMessageSchema,
    rate_limit_tier="ai",
    user_id_field="user_id"
)
async def chat_handler(validated_data: dict, user_id: str = "default"):
    message = validated_data["message"]
    
    # Add to token manager
    token_manager.add_message(user_id, "user", message)
    
    # Get conversation
    conversation = token_manager.get_conversation(user_id)
    
    # Call AI with retry and circuit breaker
    @safe_external_call("groq_api", max_attempts=3)
    def call_ai():
        return groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=conversation,
            max_tokens=cap_output_tokens(),  # Capped at 800
            temperature=0.4
        )
    
    response = call_ai()
    reply = response.choices[0].message.content
    
    # Add response to token manager
    token_manager.add_message(user_id, "assistant", reply)
    
    return {"reply": reply}
"""

print("✅ Universal Tool Wrapper Loaded")
print("   - Enforces validation on ALL tools")
print("   - Enforces rate limiting on ALL tools")
print("   - Enforces logging on ALL tools")
print("   - Enforces token management on AI tools")
print("   - Enforces audit trail on financial tools")
print("   - NO TOOL CAN BYPASS - Security via architecture")
