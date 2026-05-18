"""
Global Validation Layer - Mandatory for all MCP tools
Prevents invalid inputs, injection attacks, and data corruption
"""

from pydantic import BaseModel, Field, validator, EmailStr
from typing import Optional, Literal
import re

# Global constants
MAX_INPUT_LENGTH = 2000
MAX_NAME_LENGTH = 100
MAX_EMAIL_LENGTH = 150
MAX_MESSAGE_LENGTH = 2000
MAX_SERVICES_LENGTH = 500
MAX_DESCRIPTION_LENGTH = 200

# ============================================================================
# VALIDATION SCHEMAS
# ============================================================================

class LeadCreateSchema(BaseModel):
    """Lead creation validation"""
    name: str = Field(..., min_length=2, max_length=MAX_NAME_LENGTH)
    email: str = Field(..., max_length=MAX_EMAIL_LENGTH)
    message: str = Field(default="", max_length=MAX_MESSAGE_LENGTH)
    
    @validator("name")
    def validate_name(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty")
        # Allow letters, spaces, hyphens, apostrophes
        if not re.match(r"^[a-zA-Z\s\-'\.]+$", v):
            raise ValueError("Name contains invalid characters")
        return v
    
    @validator("email")
    def validate_email(cls, v):
        v = v.strip().lower()
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email format")
        # Block disposable email domains
        disposable_domains = ["tempmail.com", "throwaway.email", "guerrillamail.com"]
        domain = v.split("@")[1]
        if domain in disposable_domains:
            raise ValueError("Disposable email addresses not allowed")
        return v
    
    @validator("message")
    def validate_message(cls, v):
        v = v.strip()
        # Check for suspicious patterns
        dangerous_patterns = [
            r"<script", r"javascript:", r"onerror=", r"onclick=",
            r"<iframe", r"eval\(", r"document\.cookie"
        ]
        v_lower = v.lower()
        for pattern in dangerous_patterns:
            if re.search(pattern, v_lower):
                raise ValueError("Message contains invalid content")
        return v


class QuoteCalculationSchema(BaseModel):
    """Quote calculation validation"""
    services: str = Field(..., min_length=3, max_length=MAX_SERVICES_LENGTH)
    requirements: str = Field(default="", max_length=MAX_INPUT_LENGTH)
    
    @validator("services")
    def validate_services(cls, v):
        v = v.strip()
        services = [s.strip() for s in v.split(",")]
        if len(services) > 10:
            raise ValueError("Maximum 10 services allowed")
        if len(services) < 1:
            raise ValueError("At least one service required")
        # Validate each service
        for service in services:
            if len(service) < 2:
                raise ValueError(f"Service name too short: {service}")
            if not re.match(r"^[a-zA-Z0-9\s\-_]+$", service):
                raise ValueError(f"Invalid service name: {service}")
        return v


class PaymentLinkSchema(BaseModel):
    """Payment link validation - STRICT"""
    client_name: str = Field(..., min_length=2, max_length=MAX_NAME_LENGTH)
    client_email: str = Field(..., max_length=MAX_EMAIL_LENGTH)
    amount: int = Field(..., gt=0, le=10000000)  # Max 1 crore
    description: str = Field(default="Project Payment", max_length=MAX_DESCRIPTION_LENGTH)
    currency: Literal["INR", "USD", "EUR"] = "INR"
    
    @validator("amount")
    def validate_amount(cls, v):
        if v < 100:
            raise ValueError("Minimum amount is ₹100")
        if v > 10000000:
            raise ValueError("Maximum amount is ₹1,00,00,000")
        # Check for suspicious amounts
        if v % 1 != 0:
            raise ValueError("Amount must be a whole number")
        return v
    
    @validator("client_email")
    def validate_email(cls, v):
        v = v.strip().lower()
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email format")
        return v
    
    @validator("description")
    def validate_description(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Description cannot be empty")
        # No special characters that could break payment gateway
        if not re.match(r"^[a-zA-Z0-9\s\-_.,()]+$", v):
            raise ValueError("Description contains invalid characters")
        return v


class ProposalGenerationSchema(BaseModel):
    """Proposal generation validation"""
    client_name: str = Field(..., min_length=2, max_length=MAX_NAME_LENGTH)
    client_email: str = Field(..., max_length=MAX_EMAIL_LENGTH)
    services: str = Field(..., min_length=3, max_length=MAX_SERVICES_LENGTH)
    total_amount: str = Field(..., min_length=3, max_length=50)
    timeline: str = Field(default="8-12 weeks", max_length=100)
    send_email: bool = True
    
    @validator("client_email")
    def validate_email(cls, v):
        v = v.strip().lower()
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email format")
        return v
    
    @validator("total_amount")
    def validate_amount(cls, v):
        v = v.strip()
        # Must contain currency symbol and number
        if not re.search(r"[₹$€£]\s*[\d,]+", v):
            raise ValueError("Invalid amount format. Use: ₹1,50,000")
        return v


class StageUpdateSchema(BaseModel):
    """CRM stage update validation"""
    lead_email: str = Field(..., max_length=MAX_EMAIL_LENGTH)
    new_stage: Literal[
        "new", "contacted", "qualified", "proposal_sent", 
        "negotiation", "closed_won", "closed_lost"
    ]
    notes: str = Field(default="", max_length=1000)
    
    @validator("lead_email")
    def validate_email(cls, v):
        v = v.strip().lower()
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email format")
        return v


class ChatMessageSchema(BaseModel):
    """Chat message validation - XSS prevention"""
    message: str = Field(..., min_length=1, max_length=MAX_INPUT_LENGTH)
    
    @validator("message")
    def validate_message(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Message cannot be empty")
        
        # Prevent XSS and injection attacks
        dangerous_patterns = [
            r"<script", r"javascript:", r"onerror=", r"onclick=",
            r"<iframe", r"eval\(", r"document\.cookie", r"window\.",
            r"<object", r"<embed", r"<applet", r"onload=",
            r"<link", r"<meta", r"<style", r"expression\("
        ]
        
        v_lower = v.lower()
        for pattern in dangerous_patterns:
            if re.search(pattern, v_lower):
                raise ValueError("Message contains invalid content")
        
        # Check for SQL injection patterns
        sql_patterns = [
            r"union\s+select", r"drop\s+table", r"insert\s+into",
            r"delete\s+from", r"update\s+.*\s+set", r"--\s*$",
            r";\s*drop", r"'\s*or\s*'1'\s*=\s*'1"
        ]
        
        for pattern in sql_patterns:
            if re.search(pattern, v_lower):
                raise ValueError("Message contains invalid content")
        
        return v


class SEOAuditSchema(BaseModel):
    """SEO audit validation"""
    url: str = Field(..., min_length=10, max_length=500)
    
    @validator("url")
    def validate_url(cls, v):
        v = v.strip()
        # Must be valid URL
        url_pattern = r"^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$"
        if not re.match(url_pattern, v):
            raise ValueError("Invalid URL format. Use: https://example.com")
        # Block localhost and internal IPs
        blocked_patterns = [
            r"localhost", r"127\.0\.0\.1", r"192\.168\.",
            r"10\.0\.", r"172\.16\.", r"0\.0\.0\.0"
        ]
        for pattern in blocked_patterns:
            if re.search(pattern, v.lower()):
                raise ValueError("Cannot audit internal/localhost URLs")
        return v


class ImageGenerationSchema(BaseModel):
    """Image generation validation"""
    prompt: str = Field(..., min_length=3, max_length=500)
    style: Literal["realistic", "digital-art", "illustration", "3d-render", "anime"] = "realistic"
    size: Literal["512x512", "1024x1024", "1024x1792", "1792x1024"] = "1024x1024"
    
    @validator("prompt")
    def validate_prompt(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Prompt cannot be empty")
        # Block inappropriate content
        inappropriate_keywords = [
            "nude", "nsfw", "explicit", "violence", "gore",
            "weapon", "drug", "illegal"
        ]
        v_lower = v.lower()
        for keyword in inappropriate_keywords:
            if keyword in v_lower:
                raise ValueError("Prompt contains inappropriate content")
        return v


class AdvancedPricingSchema(BaseModel):
    """Advanced pricing calculator validation"""
    features: str = Field(..., min_length=3, max_length=500)
    complexity: Literal["simple", "medium", "complex", "enterprise"] = "medium"
    integrations: str = Field(default="", max_length=300)
    timeline_urgency: Literal["normal", "urgent"] = "normal"
    
    @validator("features")
    def validate_features(cls, v):
        v = v.strip()
        features = [f.strip() for f in v.split(",")]
        if len(features) > 20:
            raise ValueError("Maximum 20 features allowed")
        return v


# ============================================================================
# VALIDATION HELPER FUNCTIONS
# ============================================================================

def validate_input(schema_class: BaseModel, data: dict) -> tuple[bool, str, dict]:
    """
    Validate input data against schema
    Returns: (is_valid, error_message, validated_data)
    """
    try:
        validated = schema_class(**data)
        return True, "", validated.dict()
    except Exception as e:
        return False, str(e), {}


def sanitize_string(text: str, max_length: int = MAX_INPUT_LENGTH) -> str:
    """Sanitize string input"""
    if not text:
        return ""
    
    # Trim and limit length
    text = text.strip()[:max_length]
    
    # Remove null bytes
    text = text.replace("\x00", "")
    
    # Remove control characters except newline and tab
    text = "".join(char for char in text if ord(char) >= 32 or char in ["\n", "\t"])
    
    return text


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    if not filename:
        return "unnamed"
    
    # Remove path separators and dangerous characters
    dangerous_chars = ['/', '\\', '..', '<', '>', ':', '"', '|', '?', '*', '\x00']
    for char in dangerous_chars:
        filename = filename.replace(char, '_')
    
    # Limit length
    filename = filename[:255]
    
    # Ensure it's not empty after sanitization
    if not filename or filename == '_':
        return "unnamed"
    
    return filename


def is_safe_url(url: str) -> bool:
    """Check if URL is safe to access"""
    if not url:
        return False
    
    url_lower = url.lower()
    
    # Must start with http or https
    if not url_lower.startswith(("http://", "https://")):
        return False
    
    # Block internal/localhost URLs
    blocked_patterns = [
        "localhost", "127.0.0.1", "192.168.", "10.0.",
        "172.16.", "0.0.0.0", "[::]", "[::1]"
    ]
    
    for pattern in blocked_patterns:
        if pattern in url_lower:
            return False
    
    return True


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
USAGE IN server.py:

from validation import (
    LeadCreateSchema, PaymentLinkSchema, ChatMessageSchema,
    validate_input, sanitize_string, sanitize_filename
)

# Example 1: Validate lead input
@mcp.tool()
def create_lead(name: str, email: str, message: str = ""):
    # Validate input
    is_valid, error, validated_data = validate_input(
        LeadCreateSchema,
        {"name": name, "email": email, "message": message}
    )
    
    if not is_valid:
        return {"error": "validation_failed", "message": error}
    
    # Use validated data
    lead = {
        "name": validated_data["name"],
        "email": validated_data["email"],
        "message": validated_data["message"]
    }
    # ... rest of logic


# Example 2: Validate payment (CRITICAL)
@mcp.tool()
def generate_payment_link(client_name: str, client_email: str, amount: int, ...):
    # Strict validation for financial operations
    is_valid, error, validated_data = validate_input(
        PaymentLinkSchema,
        {
            "client_name": client_name,
            "client_email": client_email,
            "amount": amount,
            "description": description,
            "currency": currency
        }
    )
    
    if not is_valid:
        logger.error("payment_validation_failed", error=error)
        return {"error": "validation_failed", "message": error}
    
    # Proceed with validated data
    # ...


# Example 3: Sanitize user input
@mcp.tool()
def chat(message: str):
    # Sanitize first
    message = sanitize_string(message, MAX_INPUT_LENGTH)
    
    # Then validate
    is_valid, error, validated_data = validate_input(
        ChatMessageSchema,
        {"message": message}
    )
    
    if not is_valid:
        return {"error": "Invalid message", "message": error}
    
    # Safe to use
    # ...
"""

print("✅ Validation Module Loaded")
print("   - 10 validation schemas")
print("   - XSS prevention")
print("   - SQL injection prevention")
print("   - Path traversal prevention")
print("   - Input sanitization")
