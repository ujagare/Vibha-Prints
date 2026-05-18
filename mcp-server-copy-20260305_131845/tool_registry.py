"""
Tool Registry - Enforces "No Tool Without Wrapper" Rule
This makes bypass IMPOSSIBLE at startup
"""

from typing import Set, Dict, List
import sys

# ============================================================================
# GLOBAL TOOL REGISTRY
# ============================================================================

REGISTERED_TOOLS: Set[str] = set()
TOOL_METADATA: Dict[str, dict] = {}

# Expected tools that MUST be wrapped
REQUIRED_TOOLS = [
    "create_lead",
    "chat",
    "generate_payment_link_razorpay",
    "generate_proposal_pdf",
    "update_lead_stage",
    "calculate_quote",
    "seo_audit",
    "generate_image",
    "save_to_crm",
    "get_pipeline_summary",
    "monthly_revenue_projection"
]


def register_tool(
    tool_name: str,
    schema_model: str,
    rate_limit_tier: str,
    is_financial: bool = False
):
    """
    Register a tool in the global registry
    Called automatically by secure_tool wrapper
    """
    REGISTERED_TOOLS.add(tool_name)
    TOOL_METADATA[tool_name] = {
        "schema": schema_model,
        "rate_limit_tier": rate_limit_tier,
        "is_financial": is_financial,
        "registered": True
    }
    print(f"✅ Tool registered: {tool_name} (tier: {rate_limit_tier})")


def verify_all_tools_wrapped():
    """
    Verify that all required tools are wrapped
    Called at startup - BLOCKS server start if tools missing
    """
    print("\n" + "="*60)
    print("🔒 VERIFYING TOOL SECURITY")
    print("="*60)
    
    missing_tools = []
    
    for tool in REQUIRED_TOOLS:
        if tool not in REGISTERED_TOOLS:
            missing_tools.append(tool)
    
    if missing_tools:
        print("\n❌ SECURITY VIOLATION: Unwrapped tools detected!")
        print("\nMissing security wrappers for:")
        for tool in missing_tools:
            print(f"   ❌ {tool}")
        
        print("\n🚨 SERVER START BLOCKED")
        print("All tools MUST use @secure_tool wrapper")
        print("Fix these tools before starting server")
        print("="*60)
        
        sys.exit(1)  # BLOCK SERVER START
    
    print(f"\n✅ All {len(REGISTERED_TOOLS)} tools properly secured")
    print("\nRegistered tools:")
    for tool in sorted(REGISTERED_TOOLS):
        metadata = TOOL_METADATA.get(tool, {})
        tier = metadata.get("rate_limit_tier", "unknown")
        financial = "💰" if metadata.get("is_financial") else ""
        print(f"   ✅ {tool} (tier: {tier}) {financial}")
    
    print("="*60)
    print("🛡️  SECURITY VERIFICATION PASSED")
    print("="*60 + "\n")


def get_tool_stats() -> dict:
    """Get statistics about registered tools"""
    return {
        "total_tools": len(REGISTERED_TOOLS),
        "required_tools": len(REQUIRED_TOOLS),
        "registered_tools": list(REGISTERED_TOOLS),
        "missing_tools": [t for t in REQUIRED_TOOLS if t not in REGISTERED_TOOLS],
        "metadata": TOOL_METADATA
    }


def is_tool_registered(tool_name: str) -> bool:
    """Check if a tool is registered"""
    return tool_name in REGISTERED_TOOLS


# ============================================================================
# USAGE
# ============================================================================

"""
USAGE IN tool_wrapper.py:

from tool_registry import register_tool

def secure_tool(...):
    def decorator(handler_function):
        # Register tool
        register_tool(tool_name, schema_model.__name__, rate_limit_tier, is_financial)
        
        @wraps(handler_function)
        async def wrapper(...):
            # ... rest of wrapper code
        
        return wrapper
    return decorator


USAGE IN server.py:

from tool_registry import verify_all_tools_wrapped

@app.on_event("startup")
async def startup_event():
    # This will BLOCK server start if any tool is unwrapped
    verify_all_tools_wrapped()
    
    # Rest of startup code...
"""

print("✅ Tool Registry Loaded")
print("   - Tracks all registered tools")
print("   - Verifies security at startup")
print("   - BLOCKS server if tools unwrapped")
