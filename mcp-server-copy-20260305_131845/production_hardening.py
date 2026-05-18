"""
PHASE 4: PRODUCTION HARDENING LAYER
Critical security, validation, and reliability improvements
"""

from pydantic import BaseModel, EmailStr, Field, validator, constr, conint
from typing import Optional, List, Literal
import logging
import json
from datetime import datetime
from pathlib import Path
import time
from collections import defaultdict
from functools import wraps
import hashlib

# ============================================================================
# 1. STRUCTURED LOGGING
# ============================================================================

class StructuredLogger:
    """JSON-based structured logging with request tracking"""
    
    def __init__(self, log_dir: Path):
        self.log_dir = log_dir
        self.log_dir.mkdir(exist_ok=True)
        
        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(message)s',
            handlers=[
                logging.FileHandler(log_dir / "mcp_server.log"),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger("mcp_server")
    
    def log(self, level: str, tool_name: str, message: str, **kwargs):
        """Log structured JSON entry"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": level,
            "tool": tool_name,
            "message": message,
            **kwargs
        }
        
        if level == "ERROR":
            self.logger.error(json.dumps(log_entry))
        elif level == "WARNING":
            self.logger.warning(json.dumps(log_entry))
        else:
            self.logger.info(json.dumps(log_entry))
    
    def info(self, tool_name: str, message: str, **kwargs):
        self.log("INFO", tool_name, message, **kwargs)
    
    def error(self, tool_name: str, message: str, error: Exception = None, **kwargs):
        error_data = {
            "error_type": type(error).__name__ if error else "Unknown",
            "error_message": str(error) if error else message
        }
        self.log("ERROR", tool_name, message, **{**kwargs, **error_data})
    
    def warning(self, tool_name: str, message: str, **kwargs):
        self.log("WARNING", tool_name, message, **kwargs)


# Initialize logger
LOG_DIR = Path(__file__).parent / "logs"
logger = StructuredLogger(LOG_DIR)


# ============================================================================
# 2. INPUT VALIDATION SCHEMAS (Pydantic)
# ============================================================================

class LeadInput(BaseModel):
    """Validated lead input"""
    name: constr(min_length=2, max_length=100, strip_whitespace=True)
    email: EmailStr
    message: constr(max_length=2000, strip_whitespace=True) = ""
    
    @validator('name')
    def validate_name(cls, v):
        if not v.replace(' ', '').isalpha():
            raise ValueError('Name must contain only letters and spaces')
        return v


class QuoteInput(BaseModel):
    """Validated quote calculation input"""
    services: constr(min_length=3, max_length=500, strip_whitespace=True)
    requirements: constr(max_length=2000, strip_whitespace=True) = ""
    
    @validator('services')
    def validate_services(cls, v):
        services = [s.strip() for s in v.split(',')]
        if len(services) > 10:
            raise ValueError('Maximum 10 services allowed')
        return v


class PaymentLinkInput(BaseModel):
    """Validated payment link input"""
    client_name: constr(min_length=2, max_length=100, strip_whitespace=True)
    client_email: EmailStr
    amount: conint(gt=0, le=10000000)  # Max 1 crore
    description: constr(max_length=200, strip_whitespace=True) = "Project Payment"
    currency: Literal["INR", "USD", "EUR"] = "INR"
    
    @validator('amount')
    def validate_amount(cls, v):
        if v < 100:  # Minimum ₹100
            raise ValueError('Amount must be at least ₹100')
        return v


class ProposalInput(BaseModel):
    """Validated proposal generation input"""
    client_name: constr(min_length=2, max_length=100, strip_whitespace=True)
    client_email: EmailStr
    services: constr(min_length=3, max_length=500, strip_whitespace=True)
    total_amount: constr(min_length=3, max_length=50, strip_whitespace=True)
    timeline: constr(max_length=100, strip_whitespace=True) = "8-12 weeks"
    send_email: bool = True


class StageUpdateInput(BaseModel):
    """Validated CRM stage update input"""
    lead_email: EmailStr
    new_stage: Literal["new", "contacted", "qualified", "proposal_sent", "negotiation", "closed_won", "closed_lost"]
    notes: constr(max_length=1000, strip_whitespace=True) = ""


class ChatInput(BaseModel):
    """Validated chat input"""
    message: constr(min_length=1, max_length=2000, strip_whitespace=True)
    
    @validator('message')
    def validate_message(cls, v):
        # Prevent injection attempts
        dangerous_patterns = ['<script', 'javascript:', 'onerror=', 'onclick=']
        v_lower = v.lower()
        for pattern in dangerous_patterns:
            if pattern in v_lower:
                raise ValueError('Invalid characters in message')
        return v


# ============================================================================
# 3. RATE LIMITING
# ============================================================================

class RateLimiter:
    """Advanced rate limiting with multiple tiers"""
    
    def __init__(self):
        self.requests = defaultdict(list)
        self.limits = {
            "default": {"window": 60, "max_requests": 20},
            "payment": {"window": 300, "max_requests": 5},  # Stricter for payments
            "ai": {"window": 60, "max_requests": 10},  # Stricter for AI calls
            "email": {"window": 300, "max_requests": 10}
        }
    
    def check_limit(self, user_id: str, tier: str = "default") -> tuple[bool, str]:
        """Check if request is within rate limit"""
        now = time.time()
        limit_config = self.limits.get(tier, self.limits["default"])
        window = limit_config["window"]
        max_requests = limit_config["max_requests"]
        
        # Clean old requests
        user_requests = [
            req_time for req_time in self.requests[f"{user_id}:{tier}"]
            if now - req_time < window
        ]
        self.requests[f"{user_id}:{tier}"] = user_requests
        
        if len(user_requests) >= max_requests:
            retry_after = int(window - (now - user_requests[0]))
            return False, f"Rate limit exceeded. Try again in {retry_after} seconds."
        
        # Add current request
        self.requests[f"{user_id}:{tier}"].append(now)
        return True, ""


rate_limiter = RateLimiter()


# ============================================================================
# 4. RETRY MECHANISM
# ============================================================================

def retry_with_backoff(max_attempts: int = 3, backoff_factor: float = 2.0):
    """Decorator for retry with exponential backoff"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempt = 0
            last_exception = None
            
            while attempt < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempt += 1
                    last_exception = e
                    
                    if attempt < max_attempts:
                        wait_time = backoff_factor ** attempt
                        logger.warning(
                            func.__name__,
                            f"Attempt {attempt} failed, retrying in {wait_time}s",
                            error=str(e)
                        )
                        time.sleep(wait_time)
                    else:
                        logger.error(
                            func.__name__,
                            f"All {max_attempts} attempts failed",
                            error=e
                        )
            
            raise last_exception
        
        return wrapper
    return decorator


# ============================================================================
# 5. TOKEN MANAGEMENT
# ============================================================================

class TokenManager:
    """Manage conversation tokens and prevent context overflow"""
    
    def __init__(self, max_tokens: int = 4000):
        self.max_tokens = max_tokens
        self.conversations = defaultdict(list)
    
    def estimate_tokens(self, text: str) -> int:
        """Rough token estimation (1 token ≈ 4 chars)"""
        return len(text) // 4
    
    def add_message(self, user_id: str, role: str, content: str):
        """Add message to conversation history"""
        self.conversations[user_id].append({
            "role": role,
            "content": content,
            "tokens": self.estimate_tokens(content)
        })
        
        # Trim if exceeds limit
        self._trim_conversation(user_id)
    
    def _trim_conversation(self, user_id: str):
        """Trim conversation to stay within token limit"""
        messages = self.conversations[user_id]
        total_tokens = sum(msg["tokens"] for msg in messages)
        
        # Keep system message and recent messages
        while total_tokens > self.max_tokens and len(messages) > 2:
            # Remove oldest user message (keep system message)
            if messages[1]["role"] == "user":
                removed = messages.pop(1)
                total_tokens -= removed["tokens"]
            else:
                break
    
    def get_conversation(self, user_id: str) -> List[dict]:
        """Get conversation history"""
        return [
            {"role": msg["role"], "content": msg["content"]}
            for msg in self.conversations[user_id]
        ]
    
    def clear_conversation(self, user_id: str):
        """Clear conversation history"""
        self.conversations[user_id] = []


token_manager = TokenManager()


# ============================================================================
# 6. CIRCUIT BREAKER
# ============================================================================

class CircuitBreaker:
    """Circuit breaker for external API calls"""
    
    def __init__(self, failure_threshold: int = 5, timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failures = defaultdict(int)
        self.last_failure_time = defaultdict(float)
        self.state = defaultdict(lambda: "closed")  # closed, open, half_open
    
    def call(self, service_name: str, func, *args, **kwargs):
        """Execute function with circuit breaker protection"""
        
        # Check if circuit is open
        if self.state[service_name] == "open":
            if time.time() - self.last_failure_time[service_name] > self.timeout:
                self.state[service_name] = "half_open"
                logger.info("circuit_breaker", f"{service_name} circuit half-open, trying request")
            else:
                raise Exception(f"{service_name} circuit breaker is OPEN. Service temporarily unavailable.")
        
        try:
            result = func(*args, **kwargs)
            
            # Success - reset failures
            if self.state[service_name] == "half_open":
                self.state[service_name] = "closed"
                self.failures[service_name] = 0
                logger.info("circuit_breaker", f"{service_name} circuit closed, service recovered")
            
            return result
            
        except Exception as e:
            self.failures[service_name] += 1
            self.last_failure_time[service_name] = time.time()
            
            if self.failures[service_name] >= self.failure_threshold:
                self.state[service_name] = "open"
                logger.error("circuit_breaker", f"{service_name} circuit OPENED after {self.failures[service_name]} failures")
            
            raise e


circuit_breaker = CircuitBreaker()


# ============================================================================
# 7. SANITIZATION UTILITIES
# ============================================================================

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    # Remove path separators and dangerous characters
    dangerous_chars = ['/', '\\', '..', '<', '>', ':', '"', '|', '?', '*']
    for char in dangerous_chars:
        filename = filename.replace(char, '_')
    return filename[:255]  # Limit length


def sanitize_html(text: str) -> str:
    """Basic HTML sanitization"""
    replacements = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def generate_request_id() -> str:
    """Generate unique request ID for tracking"""
    return hashlib.sha256(
        f"{time.time()}{datetime.utcnow().isoformat()}".encode()
    ).hexdigest()[:16]


# ============================================================================
# 8. VALIDATION DECORATOR
# ============================================================================

def validate_input(schema: BaseModel):
    """Decorator to validate tool inputs"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            request_id = generate_request_id()
            
            try:
                # Validate input
                validated = schema(**kwargs)
                logger.info(
                    func.__name__,
                    "Input validated successfully",
                    request_id=request_id
                )
                
                # Call function with validated data
                return func(*args, **validated.dict())
                
            except Exception as e:
                logger.error(
                    func.__name__,
                    "Input validation failed",
                    error=e,
                    request_id=request_id,
                    input_data=str(kwargs)[:200]  # Log first 200 chars
                )
                return {
                    "content": [{
                        "type": "text",
                        "text": json.dumps({
                            "error": "validation_failed",
                            "message": str(e),
                            "request_id": request_id
                        })
                    }]
                }
        
        return wrapper
    return decorator


# ============================================================================
# 9. USAGE EXAMPLES
# ============================================================================

"""
USAGE IN server.py:

from production_hardening import (
    logger, rate_limiter, retry_with_backoff, 
    validate_input, LeadInput, PaymentLinkInput,
    circuit_breaker, token_manager, sanitize_filename
)

# Example 1: Validated tool with rate limiting
@mcp.tool()
@validate_input(LeadInput)
def create_lead(name: str, email: str, message: str = ""):
    # Check rate limit
    allowed, error_msg = rate_limiter.check_limit(email, "default")
    if not allowed:
        return {"error": error_msg}
    
    # Your logic here
    logger.info("create_lead", "Lead created", email=email)
    return {"status": "success"}


# Example 2: AI call with retry and circuit breaker
@retry_with_backoff(max_attempts=3)
def call_ai_api(prompt: str):
    return circuit_breaker.call(
        "groq_api",
        lambda: groq_client.chat.completions.create(...)
    )


# Example 3: Payment with strict validation
@mcp.tool()
@validate_input(PaymentLinkInput)
def generate_payment_link(client_name: str, client_email: str, amount: int, ...):
    # Check strict rate limit for payments
    allowed, error_msg = rate_limiter.check_limit(client_email, "payment")
    if not allowed:
        logger.warning("generate_payment_link", "Rate limit hit", email=client_email)
        return {"error": error_msg}
    
    # Your payment logic
    logger.info("generate_payment_link", "Payment link generated", 
                amount=amount, email=client_email)
"""

print("✅ Production Hardening Module Loaded")
print("   - Structured Logging")
print("   - Input Validation (Pydantic)")
print("   - Rate Limiting (Multi-tier)")
print("   - Retry Mechanism")
print("   - Token Management")
print("   - Circuit Breaker")
print("   - Sanitization Utils")
