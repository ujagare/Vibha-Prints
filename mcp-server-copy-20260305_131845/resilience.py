"""
Resilience Layer - Retry, Timeout, Circuit Breaker
Handles transient failures and prevents cascading failures
"""

from tenacity import (
    retry, stop_after_attempt, wait_exponential,
    retry_if_exception_type, before_sleep_log
)
import requests
import time
import logging
from functools import wraps
from typing import Callable, Any
from collections import defaultdict

# Setup logging
logger = logging.getLogger("resilience")

# ============================================================================
# CUSTOM EXCEPTIONS
# ============================================================================

class ExternalAPIError(Exception):
    """External API call failed"""
    pass


class RateLimitError(Exception):
    """Rate limit exceeded"""
    pass


class CircuitOpenError(Exception):
    """Circuit breaker is open"""
    pass


# ============================================================================
# RETRY MECHANISM
# ============================================================================

def retry_with_backoff(
    max_attempts: int = 3,
    min_wait: int = 2,
    max_wait: int = 10,
    multiplier: int = 2
):
    """
    Retry decorator with exponential backoff
    
    Args:
        max_attempts: Maximum number of retry attempts
        min_wait: Minimum wait time between retries (seconds)
        max_wait: Maximum wait time between retries (seconds)
        multiplier: Backoff multiplier
    
    Usage:
        @retry_with_backoff(max_attempts=3)
        def call_external_api():
            return requests.get("https://api.example.com")
    """
    return retry(
        stop=stop_after_attempt(max_attempts),
        wait=wait_exponential(multiplier=multiplier, min=min_wait, max=max_wait),
        retry=retry_if_exception_type((
            requests.exceptions.Timeout,
            requests.exceptions.ConnectionError,
            ExternalAPIError,
            RateLimitError
        )),
        before_sleep=before_sleep_log(logger, logging.WARNING),
        reraise=True
    )


# ============================================================================
# SAFE API CALL WITH TIMEOUT
# ============================================================================

@retry_with_backoff(max_attempts=3, min_wait=2, max_wait=10)
def safe_api_call(
    url: str,
    method: str = "POST",
    payload: dict = None,
    headers: dict = None,
    timeout: int = 10
) -> dict:
    """
    Safe API call with retry and timeout
    
    Args:
        url: API endpoint URL
        method: HTTP method (GET, POST, PUT, DELETE)
        payload: Request payload
        headers: Request headers
        timeout: Request timeout in seconds
    
    Returns:
        API response as dict
    
    Raises:
        ExternalAPIError: If API call fails after retries
    """
    try:
        if method.upper() == "GET":
            response = requests.get(url, params=payload, headers=headers, timeout=timeout)
        elif method.upper() == "POST":
            response = requests.post(url, json=payload, headers=headers, timeout=timeout)
        elif method.upper() == "PUT":
            response = requests.put(url, json=payload, headers=headers, timeout=timeout)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers, timeout=timeout)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        # Check for rate limiting
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 60))
            raise RateLimitError(f"Rate limit exceeded. Retry after {retry_after}s")
        
        # Raise for HTTP errors
        response.raise_for_status()
        
        return response.json()
        
    except requests.exceptions.Timeout:
        logger.error(f"API call timeout: {url}")
        raise ExternalAPIError(f"Request timeout after {timeout}s")
    
    except requests.exceptions.ConnectionError:
        logger.error(f"API connection error: {url}")
        raise ExternalAPIError("Failed to connect to API")
    
    except requests.exceptions.HTTPError as e:
        logger.error(f"API HTTP error: {url} - {e}")
        raise ExternalAPIError(f"API returned error: {e}")
    
    except Exception as e:
        logger.error(f"API call failed: {url} - {e}")
        raise ExternalAPIError(str(e))


# ============================================================================
# CIRCUIT BREAKER
# ============================================================================

class CircuitBreaker:
    """
    Circuit breaker pattern implementation
    
    States:
    - CLOSED: Normal operation, requests pass through
    - OPEN: Too many failures, requests fail fast
    - HALF_OPEN: Testing if service recovered
    
    Usage:
        breaker = CircuitBreaker(failure_threshold=5, recovery_time=60)
        result = breaker.call(my_function, arg1, arg2)
    """
    
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_time: int = 60,
        expected_exception: type = Exception
    ):
        """
        Initialize circuit breaker
        
        Args:
            failure_threshold: Number of failures before opening circuit
            recovery_time: Time to wait before attempting recovery (seconds)
            expected_exception: Exception type to catch
        """
        self.failure_threshold = failure_threshold
        self.recovery_time = recovery_time
        self.expected_exception = expected_exception
        
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        
        logger.info(f"Circuit breaker initialized: threshold={failure_threshold}, recovery={recovery_time}s")
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        """
        Execute function with circuit breaker protection
        
        Args:
            func: Function to execute
            *args: Function arguments
            **kwargs: Function keyword arguments
        
        Returns:
            Function result
        
        Raises:
            CircuitOpenError: If circuit is open
        """
        # Check if circuit is open
        if self.state == "OPEN":
            if self._should_attempt_reset():
                self.state = "HALF_OPEN"
                logger.info("Circuit breaker: HALF_OPEN - attempting recovery")
            else:
                time_remaining = int(self.recovery_time - (time.time() - self.last_failure_time))
                raise CircuitOpenError(
                    f"Circuit breaker is OPEN. Service unavailable. "
                    f"Retry in {time_remaining}s"
                )
        
        try:
            # Execute function
            result = func(*args, **kwargs)
            
            # Success - reset circuit
            if self.state == "HALF_OPEN":
                self._reset()
                logger.info("Circuit breaker: CLOSED - service recovered")
            
            return result
            
        except self.expected_exception as e:
            # Failure - increment counter
            self._record_failure()
            logger.warning(f"Circuit breaker: failure recorded ({self.failure_count}/{self.failure_threshold})")
            
            # Open circuit if threshold reached
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
                logger.error(f"Circuit breaker: OPEN - threshold reached ({self.failure_count} failures)")
            
            raise e
    
    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to attempt reset"""
        return (
            self.last_failure_time is not None and
            time.time() - self.last_failure_time >= self.recovery_time
        )
    
    def _record_failure(self):
        """Record a failure"""
        self.failure_count += 1
        self.last_failure_time = time.time()
    
    def _reset(self):
        """Reset circuit breaker"""
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"
    
    def get_state(self) -> dict:
        """Get current circuit breaker state"""
        return {
            "state": self.state,
            "failure_count": self.failure_count,
            "failure_threshold": self.failure_threshold,
            "last_failure_time": self.last_failure_time
        }


# ============================================================================
# GLOBAL CIRCUIT BREAKERS
# ============================================================================

# Create circuit breakers for different services
circuit_breakers = {
    "groq_api": CircuitBreaker(failure_threshold=5, recovery_time=60),
    "openai_api": CircuitBreaker(failure_threshold=5, recovery_time=60),
    "razorpay_api": CircuitBreaker(failure_threshold=3, recovery_time=120),
    "freepik_api": CircuitBreaker(failure_threshold=5, recovery_time=60),
    "smtp_server": CircuitBreaker(failure_threshold=3, recovery_time=300),
}


def get_circuit_breaker(service_name: str) -> CircuitBreaker:
    """Get or create circuit breaker for service"""
    if service_name not in circuit_breakers:
        circuit_breakers[service_name] = CircuitBreaker(
            failure_threshold=5,
            recovery_time=60
        )
    return circuit_breakers[service_name]


# ============================================================================
# TIMEOUT DECORATOR
# ============================================================================

def with_timeout(seconds: int = 10):
    """
    Timeout decorator for functions
    
    Usage:
        @with_timeout(seconds=5)
        def slow_function():
            time.sleep(10)  # Will timeout after 5 seconds
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            import signal
            
            def timeout_handler(signum, frame):
                raise TimeoutError(f"Function {func.__name__} timed out after {seconds}s")
            
            # Set timeout (Unix only)
            try:
                signal.signal(signal.SIGALRM, timeout_handler)
                signal.alarm(seconds)
                result = func(*args, **kwargs)
                signal.alarm(0)  # Cancel alarm
                return result
            except AttributeError:
                # Windows doesn't support SIGALRM, just run normally
                return func(*args, **kwargs)
        
        return wrapper
    return decorator


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
USAGE IN server.py:

from resilience import (
    retry_with_backoff, safe_api_call, get_circuit_breaker,
    ExternalAPIError, CircuitOpenError
)

# Example 1: Retry AI API call
@retry_with_backoff(max_attempts=3, min_wait=2, max_wait=10)
def call_groq_api(prompt: str):
    breaker = get_circuit_breaker("groq_api")
    
    def make_call():
        return groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4
        )
    
    return breaker.call(make_call)


# Example 2: Safe external API call
def call_razorpay_api(payload: dict):
    breaker = get_circuit_breaker("razorpay_api")
    
    def make_call():
        return safe_api_call(
            url="https://api.razorpay.com/v1/payment_links",
            method="POST",
            payload=payload,
            headers={"Authorization": f"Bearer {RAZORPAY_KEY}"},
            timeout=10
        )
    
    try:
        return breaker.call(make_call)
    except CircuitOpenError as e:
        logger.error(f"Razorpay circuit open: {e}")
        return {"error": "Payment service temporarily unavailable"}
    except ExternalAPIError as e:
        logger.error(f"Razorpay API error: {e}")
        return {"error": "Failed to generate payment link"}


# Example 3: Email with retry
@retry_with_backoff(max_attempts=3)
def send_email_with_retry(to: str, subject: str, body: str):
    breaker = get_circuit_breaker("smtp_server")
    
    def send():
        # Your SMTP code here
        pass
    
    return breaker.call(send)
"""

print("✅ Resilience Module Loaded")
print("   - Retry with exponential backoff")
print("   - Circuit breaker pattern")
print("   - Safe API calls with timeout")
print("   - Global circuit breakers for services")
