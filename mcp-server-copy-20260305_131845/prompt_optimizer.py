"""
Complete Prompt Optimization System
Includes: Token tracking, Version control, Dynamic selection, A/B testing
"""

import json
import time
from pathlib import Path
from collections import defaultdict
from typing import Optional, Tuple, Dict

from system_prompts import (
    LEAN_SYSTEM_PROMPT,
    STRUCTURED_SYSTEM_PROMPT,
    FEW_SHOT_SYSTEM_PROMPT,
    select_system_prompt,
    select_prompt_ab_test,
    log_token_usage,
    get_prompt_analytics
)
from logger import logger

# ============================================================================
# ENHANCED CHAT HANDLER WITH FULL TRACKING
# ============================================================================

async def optimized_chat_handler(
    message: str,
    user_id: str = "default",
    context_type: str = "general",
    tool_name: Optional[str] = None,
    enable_ab_test: bool = False,
    groq_client = None
):
    """
    Chat handler with complete prompt optimization
    
    Features:
    - Dynamic prompt selection
    - Token usage tracking
    - Prompt version logging
    - A/B testing support
    - Cost tracking
    
    Args:
        message: User message
        user_id: User identifier
        context_type: Context type (general, financial, proposal, technical)
        tool_name: Tool being used (if any)
        enable_ab_test: Enable A/B testing
        groq_client: Groq client instance
    
    Returns:
        Response dict with reply and metadata
    """
    start_time = time.time()
    
    # Select prompt (dynamic or A/B test)
    if enable_ab_test:
        system_prompt, prompt_version = select_prompt_ab_test(user_id)
    else:
        system_prompt, prompt_version = select_system_prompt(context_type, tool_name)
    
    # Log prompt selection
    logger.info(
        "prompt_selected",
        f"Using prompt version: {prompt_version}",
        user_id=user_id,
        context_type=context_type,
        tool_name=tool_name,
        prompt_version=prompt_version
    )
    
    # Build messages
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": message}
    ]
    
    try:
        # Call AI
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.4,
            max_tokens=800
        )
        
        # Extract response
        reply = response.choices[0].message.content
        
        # Extract token usage
        usage = response.usage
        input_tokens = usage.prompt_tokens
        output_tokens = usage.completion_tokens
        total_tokens = usage.total_tokens
        
        # Log token usage
        log_token_usage(
            prompt_version=prompt_version,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=total_tokens,
            tool_name=tool_name,
            user_id=user_id
        )
        
        # Calculate execution time
        execution_time = time.time() - start_time
        
        # Log success
        logger.info(
            "chat_success",
            "Chat completed successfully",
            user_id=user_id,
            prompt_version=prompt_version,
            execution_time=execution_time,
            total_tokens=total_tokens
        )
        
        return {
            "reply": reply,
            "metadata": {
                "prompt_version": prompt_version,
                "tokens": {
                    "input": input_tokens,
                    "output": output_tokens,
                    "total": total_tokens
                },
                "execution_time": execution_time,
                "context_type": context_type
            }
        }
        
    except Exception as e:
        logger.error(
            "chat_failed",
            "Chat failed",
            error=e,
            user_id=user_id,
            prompt_version=prompt_version
        )
        
        return {
            "error": "Chat failed",
            "message": str(e)
        }


# ============================================================================
# PROMPT COMPARISON TOOL
# ============================================================================

async def compare_prompts(
    test_messages: list,
    groq_client
) -> dict:
    """
    Compare different prompts on same messages
    
    Args:
        test_messages: List of test messages
        groq_client: Groq client instance
    
    Returns:
        Comparison results
    """
    from system_prompts import PROMPT_VERSIONS
    
    results = defaultdict(lambda: {
        "total_tokens": 0,
        "avg_tokens": 0,
        "total_time": 0,
        "avg_time": 0,
        "responses": []
    })
    
    for version_name, prompt in PROMPT_VERSIONS.items():
        if prompt is None:
            continue
        
        print(f"\nTesting {version_name}...")
        
        for message in test_messages:
            start_time = time.time()
            
            try:
                response = groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": prompt},
                        {"role": "user", "content": message}
                    ],
                    temperature=0.4,
                    max_tokens=800
                )
                
                execution_time = time.time() - start_time
                tokens = response.usage.total_tokens
                
                results[version_name]["total_tokens"] += tokens
                results[version_name]["total_time"] += execution_time
                results[version_name]["responses"].append({
                    "message": message,
                    "tokens": tokens,
                    "time": execution_time,
                    "reply": response.choices[0].message.content[:100] + "..."
                })
                
            except Exception as e:
                print(f"Error with {version_name}: {e}")
        
        # Calculate averages
        count = len(test_messages)
        results[version_name]["avg_tokens"] = results[version_name]["total_tokens"] / count
        results[version_name]["avg_time"] = results[version_name]["total_time"] / count
    
    return dict(results)


# ============================================================================
# ANALYTICS DASHBOARD
# ============================================================================

def print_prompt_analytics():
    """Print prompt analytics dashboard"""
    analytics = get_prompt_analytics()
    
    if not analytics:
        print("No analytics data available yet")
        return
    
    print("\n" + "="*60)
    print("📊 PROMPT ANALYTICS DASHBOARD")
    print("="*60)
    
    for version, data in analytics.items():
        print(f"\n{version}:")
        print(f"  Total Requests: {data['total_requests']}")
        print(f"  Avg Tokens: {data['avg_tokens']:.1f}")
        print(f"  Avg Input: {data['avg_input_tokens']:.1f}")
        print(f"  Avg Output: {data['avg_output_tokens']:.1f}")
        print(f"  Total Cost: ${data['total_cost']:.4f}")
        print(f"  Avg Cost: ${data['avg_cost']:.6f}")
    
    # Compare versions
    if len(analytics) > 1:
        print("\n" + "-"*60)
        print("COMPARISON:")
        
        versions = list(analytics.keys())
        if len(versions) >= 2:
            v1, v2 = versions[0], versions[1]
            
            token_diff = analytics[v1]["avg_tokens"] - analytics[v2]["avg_tokens"]
            cost_diff = analytics[v1]["total_cost"] - analytics[v2]["total_cost"]
            
            print(f"\n{v1} vs {v2}:")
            print(f"  Token difference: {token_diff:+.1f} tokens")
            print(f"  Cost difference: ${cost_diff:+.4f}")
            
            if token_diff > 0:
                savings_pct = (token_diff / analytics[v1]["avg_tokens"]) * 100
                print(f"  {v2} saves {savings_pct:.1f}% tokens")
    
    print("\n" + "="*60 + "\n")


# ============================================================================
# GUARDRAILS WITH TOOL CALLING PROTECTION
# ============================================================================

def enhanced_guardrails(message: str) -> Optional[str]:
    """
    Enhanced guardrails with tool calling protection
    
    Returns:
        None if message is valid, error message if invalid
    """
    message_lower = message.lower()
    
    # Out of scope check
    out_of_scope = ["weather", "news", "sports", "politics", "health", "recipe"]
    if any(word in message_lower for word in out_of_scope):
        return "I focus on web and digital solutions. Please ask a related question."
    
    # Too vague check
    if len(message.split()) < 3:
        return "Could you provide more details about your project?"
    
    # Tool fabrication prevention
    # This is added to system prompt, not here
    
    return None


# ============================================================================
# USAGE EXAMPLE
# ============================================================================

"""
COMPLETE USAGE IN server.py:

from prompt_optimizer import optimized_chat_handler, print_prompt_analytics

# Example 1: Use optimized chat handler
@secure_tool("chat", ChatMessageSchema, "ai", "user_id")
async def chat_handler(validated_data: dict, user_id: str = "default"):
    message = validated_data["message"]
    
    # Use optimized handler with full tracking
    result = await optimized_chat_handler(
        message=message,
        user_id=user_id,
        context_type="general",
        enable_ab_test=False,  # Set to True for A/B testing
        groq_client=groq_client
    )
    
    return result


# Example 2: Financial context (uses structured prompt)
@secure_tool("generate_payment_link", PaymentLinkSchema, "payment", "client_email")
async def payment_link_handler(validated_data: dict, user_id: str = None):
    # This will automatically use STRUCTURED_SYSTEM_PROMPT
    result = await optimized_chat_handler(
        message=f"Generate payment link for {validated_data['amount']}",
        user_id=user_id,
        context_type="financial",
        tool_name="generate_payment_link",
        groq_client=groq_client
    )
    
    return result


# Example 3: View analytics
@app.get("/api/prompt-analytics")
async def get_analytics():
    print_prompt_analytics()
    return get_prompt_analytics()


# Example 4: Compare prompts
@app.post("/api/compare-prompts")
async def compare_prompts_endpoint():
    test_messages = [
        "I need a website",
        "How much for ecommerce?",
        "Can you do SEO?"
    ]
    
    results = await compare_prompts(test_messages, groq_client)
    return results
"""

print("✅ Prompt Optimizer Loaded")
print("   - Dynamic prompt selection")
print("   - Token usage tracking")
print("   - Prompt version logging")
print("   - A/B testing support")
print("   - Analytics dashboard")
print("   - Cost tracking")
