"""
Global Rate Limiting - Multi-tier protection
Prevents API abuse, cost overruns, and DDoS attacks
"""

from collections import defaultdict
from typing import Tuple, Optional
import time
from datetime import datetime

# ============================================================================
# RATE LIMIT CONFIGURATION
# ============================================================================

RATE_LIMITS = {
    "default": {
        "requests": 100,
        "window": 60,  # per minute
        "description": "General tools"
    },
    "payment": {
        "requests": 5,
        "window": 300,  # per 5 minutes
        "description": "Financial operations (strict)"
    },
    "ai": {
        "requests": 10,
        "window": 60,  # per minute
        "description": "AI API calls"
    },
    "email": {
        "requests": 10,
        "window": 300,  # per 5 minutes
        "description": "Email sending"
    },
    "image": {
        "requests": 20,
        "window": 3600,  # per hour
        "description": "Image generation"
    },
    "proposal": {
        "requests": 10,
        "window": 3600,  # per hour
        "description": "Proposal generation"
    }
}

# ============================================================================
# RATE LIMITER CLASS
# ============================================================================

class RateLimiter:
    """
    Multi-tier rate limiter with per-user tracking
    """
    
    def __init__(self):
        # Store: {user_id:tier: [timestamps]}
        self.requests = defaultdict(list)
        self.blocked_users = {}  # {user_id: unblock_time}
    
    def check_limit(
        self,
        user_id: str,
        tier: str = "default"
    ) -> Tuple[bool, str]:
        """
        Check if user is within rate limit
        
        Args:
            user_id: User identifier (email, IP, session ID)
            tier: Rate limit tier (default, payment, ai, email, image, proposal)
        
        Returns:
            (is_allowed, error_message)
        """
        # Check if user is blocked
        if user_id in self.blocked_users:
            unblock_time = self.blocked_users[user_id]
            if time.time() < unblock_time:
                remaining = int(unblock_time - time.time())
                return False, f"User temporarily blocked. Try again in {remaining}s"
            else:
                # Unblock user
                del self.blocked_users[user_id]
        
        # Get rate limit config
        if tier not in RATE_LIMITS:
            tier = "default"
        
        config = RATE_LIMITS[tier]
        max_requests = config["requests"]
        window = config["window"]
        
        # Get user's request history for this tier
        key = f"{user_id}:{tier}"
        now = time.time()
        
        # Clean old requests outside window
        self.requests[key] = [
            req_time for req_time in self.requests[key]
            if now - req_time < window
        ]
        
        # Check if limit exceeded
        if len(self.requests[key]) >= max_requests:
            # Calculate retry after time
            oldest_request = self.requests[key][0]
            retry_after = int(window - (now - oldest_request))
            
            return False, (
                f"Rate limit exceeded for {tier} tier. "
                f"Limit: {max_requests} requests per {window}s. "
                f"Try again in {retry_after}s"
            )
        
        # Add current request
        self.requests[key].append(now)
        
        return True, ""
    
    def block_user(self, user_id: str, duration: int = 3600):
        """
        Temporarily block a user
        
        Args:
            user_id: User identifier
            duration: Block duration in seconds (default: 1 hour)
        """
        self.blocked_users[user_id] = time.time() + duration
    
    def unblock_user(self, user_id: str):
        """Unblock a user"""
        if user_id in self.blocked_users:
            del self.blocked_users[user_id]
    
    def get_usage(self, user_id: str, tier: str = "default") -> dict:
        """
        Get current usage for user
        
        Returns:
            {
                "current_requests": int,
                "max_requests": int,
                "window": int,
                "remaining": int,
                "reset_in": int
            }
        """
        config = RATE_LIMITS.get(tier, RATE_LIMITS["default"])
        key = f"{user_id}:{tier}"
        now = time.time()
        
        # Clean old requests
        self.requests[key] = [
            req_time for req_time in self.requests[key]
            if now - req_time < config["window"]
        ]
        
        current = len(self.requests[key])
        remaining = max(0, config["max_requests"] - current)
        
        # Calculate reset time
        if self.requests[key]:
            oldest = self.requests[key][0]
            reset_in = int(config["window"] - (now - oldest))
        else:
            reset_in = 0
        
        return {
            "current_requests": current,
            "max_requests": config["max_requests"],
            "window": config["window"],
            "remaining": remaining,
            "reset_in": reset_in,
            "tier": tier
        }
    
    def get_all_limits(self) -> dict:
        """Get all rate limit configurations"""
        return RATE_LIMITS.copy()
    
    def reset_user(self, user_id: str, tier: Optional[str] = None):
        """
        Reset rate limit for user
        
        Args:
            user_id: User identifier
            tier: Specific tier to reset, or None for all tiers
        """
        if tier:
            key = f"{user_id}:{tier}"
            if key in self.requests:
                del self.requests[key]
        else:
            # Reset all tiers for user
            keys_to_delete = [
                key for key in self.requests.keys()
                if key.startswith(f"{user_id}:")
            ]
            for key in keys_to_delete:
                del self.requests[key]


# ============================================================================
# GLOBAL RATE LIMITER INSTANCE
# ============================================================================

rate_limiter = RateLimiter()


# ============================================================================
# DECORATOR FOR RATE LIMITING
# ============================================================================

def rate_limit(tier: str = "default", user_id_param: str = "email"):
    """
    Decorator to apply rate limiting to functions
    
    Args:
        tier: Rate limit tier
        user_id_param: Parameter name to use as user ID
    
    Usage:
        @rate_limit(tier="payment", user_id_param="client_email")
        def generate_payment_link(client_email: str, amount: int):
            # Your code
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Extract user ID from kwargs
            user_id = kwargs.get(user_id_param, "anonymous")
            
            # Check rate limit
            allowed, error_msg = rate_limiter.check_limit(user_id, tier)
            
            if not allowed:
                return {
                    "error": "rate_limit_exceeded",
                    "message": error_msg,
                    "tier": tier
                }
            
            # Execute function
            return func(*args, **kwargs)
        
        return wrapper
    return decorator


# ============================================================================
# IP-BASED RATE LIMITING (for FastAPI)
# ============================================================================

async def ip_rate_limiter(request, tier: str = "default"):
    """
    FastAPI middleware for IP-based rate limiting
    
    Usage in FastAPI:
        from fastapi import Request, HTTPException
        
        @app.post("/api/chat")
        async def chat(request: Request, message: str):
            await ip_rate_limiter(request, "ai")
            # Your code
    """
    ip = request.client.host
    allowed, error_msg = rate_limiter.check_limit(ip, tier)
    
    if not allowed:
        from fastapi import HTTPException
        raise HTTPException(status_code=429, detail=error_msg)


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
USAGE IN server.py:

from rate_limiter import rate_limiter, rate_limit

# Example 1: Manual rate limit check
@mcp.tool()
def create_lead(name: str, email: str, message: str = ""):
    # Check rate limit
    allowed, error_msg = rate_limiter.check_limit(email, "default")
    if not allowed:
        logger.warning("rate_limit_exceeded", error_msg, email=email)
        return {"error": "rate_limit_exceeded", "message": error_msg}
    
    # Your logic here
    # ...


# Example 2: Using decorator
@mcp.tool()
@rate_limit(tier="payment", user_id_param="client_email")
def generate_payment_link(client_email: str, amount: int):
    # Rate limit automatically checked
    # Your logic here
    # ...


# Example 3: Strict rate limit for financial operations
@mcp.tool()
def generate_payment_link_razorpay(client_email: str, amount: int):
    # STRICT rate limit for payments
    allowed, error_msg = rate_limiter.check_limit(client_email, "payment")
    if not allowed:
        logger.warning(
            "payment_rate_limit",
            "Payment rate limit exceeded",
            email=client_email,
            amount=amount
        )
        return {
            "error": "rate_limit_exceeded",
            "message": error_msg,
            "note": "For security, payment links are limited to 5 per 5 minutes"
        }
    
    # Proceed with payment link generation
    # ...


# Example 4: Check usage
def get_user_limits(email: str):
    usage = {
        "default": rate_limiter.get_usage(email, "default"),
        "payment": rate_limiter.get_usage(email, "payment"),
        "ai": rate_limiter.get_usage(email, "ai"),
        "email": rate_limiter.get_usage(email, "email")
    }
    return usage


# Example 5: Block abusive user
def block_abusive_user(email: str):
    rate_limiter.block_user(email, duration=3600)  # Block for 1 hour
    logger.warning("user_blocked", f"User blocked for abuse", email=email)
"""

print("✅ Rate Limiter Loaded")
print("   - Multi-tier rate limiting")
print("   - Per-user tracking")
print("   - Configurable limits:")
for tier, config in RATE_LIMITS.items():
    print(f"     • {tier}: {config['requests']} requests per {config['window']}s")
