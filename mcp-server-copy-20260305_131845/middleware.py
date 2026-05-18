"""
Global Middleware - Enforces hardening at HTTP layer
This runs BEFORE any tool execution, ensuring global protection
"""

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import time
from collections import defaultdict

from rate_limiter import rate_limiter
from logger import logger, generate_request_id

# ============================================================================
# GLOBAL RATE LIMITING MIDDLEWARE
# ============================================================================

async def rate_limit_middleware(request: Request, call_next):
    """
    Global rate limiting middleware
    Applies to ALL HTTP requests before they reach tools
    """
    # Get client IP
    client_ip = request.client.host
    
    # Check global rate limit (100 requests per minute per IP)
    allowed, error_msg = rate_limiter.check_limit(client_ip, "default")
    
    if not allowed:
        logger.warning(
            "global_rate_limit",
            "Global rate limit exceeded",
            ip=client_ip,
            path=request.url.path
        )
        return JSONResponse(
            status_code=429,
            content={
                "error": "rate_limit_exceeded",
                "message": error_msg
            }
        )
    
    # Continue to next middleware/handler
    response = await call_next(request)
    return response


# ============================================================================
# REQUEST LOGGING MIDDLEWARE
# ============================================================================

async def logging_middleware(request: Request, call_next):
    """
    Log all incoming requests
    """
    request_id = generate_request_id()
    start_time = time.time()
    
    # Add request ID to request state
    request.state.request_id = request_id
    
    # Log request
    logger.info(
        "http_request",
        f"{request.method} {request.url.path}",
        method=request.method,
        path=request.url.path,
        ip=request.client.host,
        request_id=request_id
    )
    
    # Process request
    response = await call_next(request)
    
    # Log response
    execution_time = time.time() - start_time
    logger.info(
        "http_response",
        f"{request.method} {request.url.path} - {response.status_code}",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        execution_time=execution_time,
        request_id=request_id
    )
    
    # Add request ID to response headers
    response.headers["X-Request-ID"] = request_id
    
    return response


# ============================================================================
# GLOBAL EXCEPTION HANDLER
# ============================================================================

async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch all unhandled exceptions
    Prevents stack traces from leaking to users
    """
    request_id = getattr(request.state, "request_id", "unknown")
    
    logger.error(
        "unhandled_exception",
        f"Unhandled exception: {str(exc)}",
        error=exc,
        path=request.url.path,
        method=request.method,
        request_id=request_id
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_error",
            "message": "An unexpected error occurred. Please try again.",
            "request_id": request_id
        }
    )


# ============================================================================
# CORS MIDDLEWARE (if needed)
# ============================================================================

async def cors_middleware(request: Request, call_next):
    """
    Handle CORS for frontend requests
    """
    response = await call_next(request)
    
    # Add CORS headers
    response.headers["Access-Control-Allow-Origin"] = "*"  # Configure properly in production
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    
    return response


# ============================================================================
# SECURITY HEADERS MIDDLEWARE
# ============================================================================

async def security_headers_middleware(request: Request, call_next):
    """
    Add security headers to all responses
    """
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    
    return response


# ============================================================================
# USAGE IN MAIN APP
# ============================================================================

"""
USAGE IN server.py or main.py:

from fastapi import FastAPI
from middleware import (
    rate_limit_middleware,
    logging_middleware,
    global_exception_handler,
    cors_middleware,
    security_headers_middleware
)

app = FastAPI()

# Add exception handler
app.add_exception_handler(Exception, global_exception_handler)

# Add middlewares (order matters - first added runs last)
app.middleware("http")(security_headers_middleware)
app.middleware("http")(cors_middleware)
app.middleware("http")(logging_middleware)
app.middleware("http")(rate_limit_middleware)

# Now ALL requests will:
# 1. Be rate limited globally
# 2. Be logged with request ID
# 3. Have security headers
# 4. Have CORS headers
# 5. Have exception handling

@app.post("/api/create-lead")
async def create_lead_endpoint(data: dict):
    # This will automatically pass through all middlewares
    return await create_lead_handler(data)
"""

print("✅ Global Middleware Loaded")
print("   - Rate limiting middleware")
print("   - Logging middleware")
print("   - Exception handler")
print("   - CORS middleware")
print("   - Security headers middleware")
