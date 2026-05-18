"""
Structured JSON Logging - Production Grade
Non-blocking, rotating logs with request tracking
"""

import logging
import json
from logging.handlers import RotatingFileHandler
from pathlib import Path
from datetime import datetime
import traceback
from typing import Any, Optional
import hashlib
import time

# ============================================================================
# LOGGER CONFIGURATION
# ============================================================================

# Create logs directory
LOG_DIR = Path(__file__).parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

# Log file paths
MAIN_LOG = LOG_DIR / "mcp_server.log"
ERROR_LOG = LOG_DIR / "errors.log"
AUDIT_LOG = LOG_DIR / "audit.log"

# ============================================================================
# STRUCTURED LOGGER CLASS
# ============================================================================

class StructuredLogger:
    """
    Production-grade structured logger with JSON output
    """
    
    def __init__(self, name: str = "mcp_server"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # Prevent duplicate handlers
        if self.logger.handlers:
            return
        
        # Main log handler (rotating, 5MB max, 3 backups)
        main_handler = RotatingFileHandler(
            MAIN_LOG,
            maxBytes=5_000_000,  # 5MB
            backupCount=3,
            encoding='utf-8'
        )
        main_handler.setLevel(logging.INFO)
        main_formatter = logging.Formatter('%(message)s')
        main_handler.setFormatter(main_formatter)
        
        # Error log handler (rotating, 5MB max, 5 backups)
        error_handler = RotatingFileHandler(
            ERROR_LOG,
            maxBytes=5_000_000,
            backupCount=5,
            encoding='utf-8'
        )
        error_handler.setLevel(logging.ERROR)
        error_formatter = logging.Formatter('%(message)s')
        error_handler.setFormatter(error_formatter)
        
        # Console handler (for development)
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        console_handler.setFormatter(console_formatter)
        
        # Add handlers
        self.logger.addHandler(main_handler)
        self.logger.addHandler(error_handler)
        self.logger.addHandler(console_handler)
    
    def _create_log_entry(
        self,
        level: str,
        event_type: str,
        message: str,
        **kwargs
    ) -> dict:
        """Create structured log entry"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": level,
            "event_type": event_type,
            "message": message,
        }
        
        # Add additional fields
        for key, value in kwargs.items():
            # Convert non-serializable objects to strings
            try:
                json.dumps(value)
                log_entry[key] = value
            except (TypeError, ValueError):
                log_entry[key] = str(value)
        
        return log_entry
    
    def info(self, event_type: str, message: str, **kwargs):
        """Log info level message"""
        log_entry = self._create_log_entry("INFO", event_type, message, **kwargs)
        self.logger.info(json.dumps(log_entry))
    
    def warning(self, event_type: str, message: str, **kwargs):
        """Log warning level message"""
        log_entry = self._create_log_entry("WARNING", event_type, message, **kwargs)
        self.logger.warning(json.dumps(log_entry))
    
    def error(
        self,
        event_type: str,
        message: str,
        error: Optional[Exception] = None,
        **kwargs
    ):
        """Log error level message with stack trace"""
        log_entry = self._create_log_entry("ERROR", event_type, message, **kwargs)
        
        if error:
            log_entry["error_type"] = type(error).__name__
            log_entry["error_message"] = str(error)
            log_entry["stack_trace"] = traceback.format_exc()
        
        self.logger.error(json.dumps(log_entry))
    
    def audit(self, action: str, user: str, details: dict):
        """Log audit trail for sensitive operations"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "type": "AUDIT",
            "action": action,
            "user": user,
            "details": details
        }
        
        # Write to audit log
        with open(AUDIT_LOG, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry) + "\n")


# ============================================================================
# GLOBAL LOGGER INSTANCE
# ============================================================================

logger = StructuredLogger()


# ============================================================================
# CONVENIENCE FUNCTIONS
# ============================================================================

def log_event(event_type: str, data: dict):
    """
    Simple event logging function
    
    Usage:
        log_event("tool_execution", {
            "tool": "create_lead",
            "status": "success",
            "execution_time": 0.45
        })
    """
    logger.info(event_type, json.dumps(data), **data)


def log_tool_execution(
    tool_name: str,
    status: str,
    execution_time: float,
    **kwargs
):
    """
    Log tool execution with standard format
    
    Usage:
        log_tool_execution(
            "create_lead",
            "success",
            0.45,
            email="user@example.com"
        )
    """
    logger.info(
        "tool_execution",
        f"Tool {tool_name} {status}",
        tool=tool_name,
        status=status,
        execution_time=execution_time,
        **kwargs
    )


def log_api_call(
    service: str,
    endpoint: str,
    status_code: int,
    response_time: float,
    **kwargs
):
    """
    Log external API call
    
    Usage:
        log_api_call(
            "groq",
            "/chat/completions",
            200,
            1.23,
            model="llama-3.3-70b-versatile"
        )
    """
    logger.info(
        "api_call",
        f"API call to {service}",
        service=service,
        endpoint=endpoint,
        status_code=status_code,
        response_time=response_time,
        **kwargs
    )


def log_error_with_context(
    error: Exception,
    context: dict
):
    """
    Log error with full context
    
    Usage:
        try:
            # some code
        except Exception as e:
            log_error_with_context(e, {
                "tool": "create_lead",
                "input": {"email": "user@example.com"}
            })
    """
    logger.error(
        "error_occurred",
        f"Error: {str(error)}",
        error=error,
        **context
    )


def log_audit_trail(action: str, user: str, details: dict):
    """
    Log audit trail for sensitive operations
    
    Usage:
        log_audit_trail(
            "payment_link_generated",
            "user@example.com",
            {"amount": 150000, "client": "Acme Corp"}
        )
    """
    logger.audit(action, user, details)


# ============================================================================
# PERFORMANCE TRACKING
# ============================================================================

class PerformanceTracker:
    """Track execution time of functions"""
    
    def __init__(self, operation_name: str):
        self.operation_name = operation_name
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        execution_time = time.time() - self.start_time
        
        if exc_type is None:
            logger.info(
                "performance",
                f"{self.operation_name} completed",
                operation=self.operation_name,
                execution_time=execution_time,
                status="success"
            )
        else:
            logger.error(
                "performance",
                f"{self.operation_name} failed",
                operation=self.operation_name,
                execution_time=execution_time,
                status="failed",
                error=exc_val
            )


def track_performance(func):
    """
    Decorator to track function performance
    
    Usage:
        @track_performance
        def my_function():
            # code
    """
    def wrapper(*args, **kwargs):
        with PerformanceTracker(func.__name__):
            return func(*args, **kwargs)
    return wrapper


# ============================================================================
# REQUEST ID GENERATION
# ============================================================================

def generate_request_id() -> str:
    """Generate unique request ID for tracking"""
    timestamp = str(time.time())
    random_data = str(datetime.utcnow().timestamp())
    return hashlib.sha256(f"{timestamp}{random_data}".encode()).hexdigest()[:16]


# ============================================================================
# LOG ANALYSIS HELPERS
# ============================================================================

def get_recent_errors(count: int = 10) -> list:
    """Get recent error logs"""
    try:
        with open(ERROR_LOG, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            return [json.loads(line) for line in lines[-count:]]
    except Exception:
        return []


def get_tool_stats() -> dict:
    """Get tool execution statistics"""
    stats = {
        "total_calls": 0,
        "successful": 0,
        "failed": 0,
        "by_tool": {}
    }
    
    try:
        with open(MAIN_LOG, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    entry = json.loads(line)
                    if entry.get("event_type") == "tool_execution":
                        tool = entry.get("tool", "unknown")
                        status = entry.get("status", "unknown")
                        
                        stats["total_calls"] += 1
                        
                        if status == "success":
                            stats["successful"] += 1
                        elif status == "failed":
                            stats["failed"] += 1
                        
                        if tool not in stats["by_tool"]:
                            stats["by_tool"][tool] = {"success": 0, "failed": 0}
                        
                        if status == "success":
                            stats["by_tool"][tool]["success"] += 1
                        elif status == "failed":
                            stats["by_tool"][tool]["failed"] += 1
                
                except json.JSONDecodeError:
                    continue
    
    except Exception:
        pass
    
    return stats


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
USAGE IN server.py:

from logger import (
    logger, log_event, log_tool_execution, log_api_call,
    log_error_with_context, log_audit_trail, PerformanceTracker,
    track_performance, generate_request_id
)

# Example 1: Log tool execution
@mcp.tool()
def create_lead(name: str, email: str, message: str = ""):
    request_id = generate_request_id()
    start_time = time.time()
    
    try:
        # Your logic here
        lead = {"name": name, "email": email}
        
        execution_time = time.time() - start_time
        log_tool_execution(
            "create_lead",
            "success",
            execution_time,
            request_id=request_id,
            email=email
        )
        
        return {"status": "success"}
        
    except Exception as e:
        execution_time = time.time() - start_time
        log_error_with_context(e, {
            "tool": "create_lead",
            "request_id": request_id,
            "input": {"name": name, "email": email}
        })
        return {"error": "Failed to create lead"}


# Example 2: Log API call
def call_groq_api(prompt: str):
    start_time = time.time()
    
    try:
        response = groq_client.chat.completions.create(...)
        response_time = time.time() - start_time
        
        log_api_call(
            "groq",
            "/chat/completions",
            200,
            response_time,
            model="llama-3.3-70b-versatile",
            tokens=len(prompt)//4
        )
        
        return response
        
    except Exception as e:
        response_time = time.time() - start_time
        log_api_call(
            "groq",
            "/chat/completions",
            500,
            response_time,
            error=str(e)
        )
        raise


# Example 3: Audit trail for financial operations
@mcp.tool()
def generate_payment_link(client_email: str, amount: int):
    # Generate payment link
    link = create_razorpay_link(amount)
    
    # Log audit trail
    log_audit_trail(
        "payment_link_generated",
        client_email,
        {
            "amount": amount,
            "link_id": link["id"],
            "timestamp": datetime.utcnow().isoformat()
        }
    )
    
    return link


# Example 4: Performance tracking
@track_performance
def expensive_operation():
    # This will automatically log execution time
    time.sleep(2)
    return "done"


# Example 5: Manual performance tracking
def my_function():
    with PerformanceTracker("database_query"):
        # Your code here
        pass
"""

print("✅ Structured Logger Loaded")
print(f"   - Main log: {MAIN_LOG}")
print(f"   - Error log: {ERROR_LOG}")
print(f"   - Audit log: {AUDIT_LOG}")
print("   - JSON format")
print("   - Rotating logs (5MB max)")
print("   - Request ID tracking")
print("   - Performance tracking")
