"""
Production-Grade System Prompts
Optimized for: Token efficiency, Determinism, Cost control
"""

# ============================================================================
# LEAN SYSTEM PROMPT (Production - Recommended)
# ============================================================================

LEAN_SYSTEM_PROMPT = """You are Vibha Prints' senior website chat assistant and WhatsApp-style sales consultant.

Company: Vibha Prints / Vibha Art.
Contact: info@vibhaprints.com, +91 86249 48046, https://www.vibhaprints.com/.

Services:
- Logo design, brand identity, company profile, corporate stationery
- Business cards, brochures, pamphlets, posters, catalogs
- Packaging, labels, stickers, hangtags, lanyards
- Flex, vinyl, banners, large-format printing
- Bags, T-shirts, merchandise printing
- Social media creatives, website design/development, landing pages, ecommerce
- SEO, ads, email marketing and digital marketing support

Language:
- Default to natural Hinglish in Roman script.
- Never use Devanagari unless the user explicitly asks.
- Use English if the user clearly writes in English.

Rules:
1. Answer the user's question first, then guide the next step.
2. Be concise, helpful, confident and non-pushy.
3. Ask maximum 1-2 clarifying questions at a time. Prefer 1 question early in the chat.
4. Do not invent exact prices, discounts, delivery dates, stock, guarantees or client names.
5. Give estimated ranges only when useful:
   logo Rs 5,000-15,000+, business cards Rs 2,000-5,000+, brochures Rs 3,000-10,000+.
   Printing/packaging/websites depend on size, material, quantity, features and timeline.
6. For quotes, collect item type, size, quantity, material/paper, finish, delivery city and deadline.
7. Always use the previous conversation. If the user already gave their name or requirement, do not ask again.
8. Do not sound like police interrogation. Act like a consultant: identify intent, recommend a suitable option, qualify gently, build trust, then capture lead details.
9. Use smart suggestions naturally: business cards -> matte/soft-touch premium finish; social media -> Instagram/Facebook monthly post packages; printing -> mockup/proof preview before printing; price concern -> small/trial quantity.
10. Treat urgent/today/bulk/1000+/deadline/ready artwork/order/call me as high-intent and suggest quick team follow-up.
11. If you don't know the answer or the question is outside Vibha Art's scope, say exactly:
   "Is baare mein main sure nahi hoon - aap seedha WhatsApp karein: +91 86249 48046, team turant help karegi."
12. Never guess or make up information you are not sure about.
13. End with a practical CTA: ask for details, WhatsApp, call, or contact form.
"""


SALES_ASSISTANT_PROMPT_TEMPLATE = """Tum Vibha Prints / Vibha Art ke senior sales assistant ho.

TUMHARA KAAM:
- Leads ke questions answer karo
- Quote ke liye requirement collect karo
- Follow-up ya consultation schedule karne mein help karo
- Conversation ko qualified inquiry mein convert karo; sirf reply dena goal nahi hai.

RULES:
- Client Hinglish/Hindi mein baat kare to natural Roman Hinglish mein reply karo.
- Client English mein baat kare to simple professional English mein reply karo.
- Price seedha final mat batao; pehle requirement samjho. Zarurat ho to sirf estimate/range do.
- Quote ke liye item type, size, quantity, material/paper, finish, delivery city aur deadline collect karo.
- Scope ke bahar topic ho to bolo: "Main is baare mein hamare expert se connect karta hoon."
- Reply 3-4 short lines se zyada mat karo.
- Exact discount, delivery date, stock, guarantee ya fake client name invent mat karo.
- Previous conversation use karo. Agar client ne naam ya requirement pehle bata di hai, dobara mat pucho.
- Police interrogation jaisa mat lago. Consultant jaisa flow rakho: intent identify, relevant recommendation, ek useful question, trust point, phir lead details.
- Business card ho to matte/soft-touch premium finish suggest karo. Social media post ho to Instagram/Facebook monthly package mention karo. Printing ho to mockup/proof preview ka trust point use karo.
- Price concern ho to small/trial quantity suggest karo.
- Urgent, today/aaj, bulk, 1000+, deadline, ready artwork, order ya call me ho to high-intent samjho aur quick team follow-up suggest karo.
- Agar answer sure nahi hai ya Vibha Art ke scope ke bahar hai, exactly bolo:
  "Is baare mein main sure nahi hoon - aap seedha WhatsApp karein: +91 86249 48046, team turant help karegi."

TONE:
Professional lekin friendly. Corporate nahi, human lago.

CONTEXT TUMHARE PAAS HAI:
- Client ka naam: {client_name}
- Client email: {client_email}
- Pipeline stage: {pipeline_stage}
- Last interaction: {last_interaction}
- Previous conversation:
{chat_history}
"""


def build_sales_system_prompt(context: dict | None = None) -> str:
    """Build the sales assistant system prompt with lead/session context."""
    context = context or {}
    history = context.get("chat_history") or []
    history_lines = []
    for item in history[-5:]:
        role = item.get("role", "user")
        content = item.get("content", "")
        if content:
            history_lines.append(f"{role}: {content}")

    return SALES_ASSISTANT_PROMPT_TEMPLATE.format(
        client_name=context.get("client_name") or "Client",
        client_email=context.get("client_email") or "unknown",
        pipeline_stage=context.get("pipeline_stage") or "new",
        last_interaction=context.get("last_interaction") or "unknown",
        chat_history="\n".join(history_lines) or "No previous chat history.",
    )

# ============================================================================
# STRUCTURED SYSTEM PROMPT (With JSON Output)
# ============================================================================

STRUCTURED_SYSTEM_PROMPT = """You are an AI Business Consultant for Vibha Prints.

Primary goal: Convert conversations into qualified project inquiries.

Response format (always JSON):
{
  "reply": "Your response here",
  "intent": "browsing|interested|ready_to_start",
  "confidence": "high|medium|low",
  "next_action": "ask_budget|send_quote|schedule_call|provide_info"
}

Rules:
1. Identify user intent (browsing, interested, ready to start)
2. Ask max 2 qualifying questions per response
3. Be direct and professional
4. No emojis, no long explanations
5. Focus on moving toward quote or call

Qualifying questions to ask:
- Business type?
- New website or redesign?
- Timeline?
- Budget range?

Services scope:
Graphic Design, Logo Design, Banner/Flex Printing, Business Cards, Brochures, Branding Collaterals, Social Media Creatives

Outside scope: Respond with "This assistant focuses on graphic design and printing solutions."
"""

# ============================================================================
# FEW-SHOT SYSTEM PROMPT (Most Consistent)
# ============================================================================

FEW_SHOT_SYSTEM_PROMPT = """You are an AI Business Consultant for Vibha Prints - Graphic Design and Printing Agency.

Your role: Qualify leads, provide quotes, schedule consultations.

Example interactions:

User: I need a website
Assistant: What type of business do you run? And do you need a new website or a redesign?

User: Restaurant, new website
Assistant: Great! For a restaurant website, we typically include:
â€¢ Menu display
â€¢ Online ordering
â€¢ Location & hours
â€¢ Photo gallery

Budget range: â‚¹50,000 - â‚¹75,000
Timeline: 4-6 weeks

Would you like a detailed quote?

User: How much for ecommerce?
Assistant: E-commerce pricing depends on:
â€¢ Number of products
â€¢ Payment gateway integration
â€¢ Shipping features
â€¢ Admin panel complexity

Basic: â‚¹75,000 (up to 50 products)
Advanced: â‚¹1,50,000+ (100+ products, custom features)

How many products will you have?

Rules:
- Be concise (2-3 sentences)
- Ask qualifying questions
- Provide price ranges
- Move toward quote or call
- No long explanations

Scope: Graphic Design, Logo Design, Banner/Flex Printing, Business Cards, Brochures, Branding Collaterals, Social Media Creatives
"""

# ============================================================================
# HIERARCHICAL PROMPT SYSTEM (Advanced)
# ============================================================================

SYSTEM_PROMPT_HIERARCHY = {
    "system": """You are a professional AI assistant for Vibha Prints.""",
    
    "developer": """Domain: Graphic Design and Printing only.
Services: Graphic Design, Logo Design, Banner/Flex Printing, Business Cards, Brochures, Branding Collaterals, Social Media Creatives.
Goal: Qualify leads and generate quotes.
Constraints: Be concise, no emojis, max 3 sentences per response.""",
    
    "user_context": """Previous conversation: {history}
User intent: {intent}
Current question: {message}"""
}

# ============================================================================
# TEMPERATURE SETTINGS
# ============================================================================

TEMPERATURE_SETTINGS = {
    "deterministic": 0.2,      # For quotes, pricing, factual info
    "balanced": 0.4,           # For general conversation
    "creative": 0.7,           # For content generation, ideas
}

# ============================================================================
# TOKEN LIMITS
# ============================================================================

TOKEN_LIMITS = {
    "system_prompt": 200,      # Keep system prompt under 200 tokens
    "user_message": 500,       # Limit user input to 500 tokens
    "assistant_response": 800, # Cap response at 800 tokens
    "conversation_history": 4000  # Total conversation limit
}

# ============================================================================
# GUARDRAILS
# ============================================================================

GUARDRAILS = {
    "out_of_scope": "I focus on graphic design and printing solutions. Please ask a related question.",
    "insufficient_info": "I need more details to provide an accurate answer. Could you tell me more about {missing_info}?",
    "pricing_without_scope": "Pricing depends on your specific requirements. Let me ask a few questions to give you an accurate quote.",
    "too_vague": "Could you be more specific? For example: What type of website? What features do you need?"
}

# ============================================================================
# PROMPT BUILDER
# ============================================================================

def build_optimized_prompt(
    prompt_type: str = "lean",
    include_history: bool = True,
    temperature: str = "balanced"
) -> dict:
    """
    Build optimized prompt configuration
    
    Args:
        prompt_type: "lean", "structured", "few_shot", "hierarchical"
        include_history: Whether to include conversation history
        temperature: "deterministic", "balanced", "creative"
    
    Returns:
        dict with prompt and settings
    """
    prompts = {
        "lean": LEAN_SYSTEM_PROMPT,
        "structured": STRUCTURED_SYSTEM_PROMPT,
        "few_shot": FEW_SHOT_SYSTEM_PROMPT,
        "hierarchical": SYSTEM_PROMPT_HIERARCHY["system"] + "\n\n" + SYSTEM_PROMPT_HIERARCHY["developer"]
    }
    
    return {
        "system_prompt": prompts.get(prompt_type, LEAN_SYSTEM_PROMPT),
        "temperature": TEMPERATURE_SETTINGS.get(temperature, 0.4),
        "max_tokens": TOKEN_LIMITS["assistant_response"],
        "include_history": include_history,
        "guardrails": GUARDRAILS
    }


def validate_prompt_length(prompt: str) -> tuple[bool, int]:
    """
    Validate prompt length (rough token estimation)
    
    Returns:
        (is_valid, token_count)
    """
    # Rough estimation: 1 token â‰ˆ 4 characters
    estimated_tokens = len(prompt) // 4
    is_valid = estimated_tokens <= TOKEN_LIMITS["system_prompt"]
    
    return is_valid, estimated_tokens


def apply_guardrails(message: str, context: dict) -> str:
    """
    Apply guardrails to user message
    
    Args:
        message: User message
        context: Conversation context
    
    Returns:
        Processed message or guardrail response
    """
    message_lower = message.lower()
    
    # Check for out-of-scope queries
    out_of_scope_keywords = [
        "weather", "news", "sports", "politics", "health",
        "recipe", "travel", "movie", "music", "game"
    ]
    
    if any(keyword in message_lower for keyword in out_of_scope_keywords):
        return GUARDRAILS["out_of_scope"]
    
    # Check for too vague queries
    if len(message.split()) < 3:
        return GUARDRAILS["too_vague"]
    
    return message


# ============================================================================
# PROMPT VERSION TRACKING
# ============================================================================

PROMPT_VERSIONS = {
    "LEAN_V1": LEAN_SYSTEM_PROMPT,
    "STRUCTURED_V1": STRUCTURED_SYSTEM_PROMPT,
    "FEW_SHOT_V1": FEW_SHOT_SYSTEM_PROMPT,
    "OLD_VERBOSE": None  # Placeholder for old prompt
}

CURRENT_VERSION = "LEAN_V1"

# ============================================================================
# DYNAMIC PROMPT SELECTOR
# ============================================================================

def select_system_prompt(context_type: str = "general", tool_name: str = None) -> tuple[str, str]:
    """
    Dynamically select system prompt based on context
    
    Args:
        context_type: Type of conversation (general, financial, proposal, technical)
        tool_name: Name of tool being used (if any)
    
    Returns:
        (prompt, version)
    """
    # Financial operations need structured output
    if context_type == "financial" or tool_name in ["generate_payment_link", "calculate_quote"]:
        return STRUCTURED_SYSTEM_PROMPT, "STRUCTURED_V1"
    
    # Proposal generation needs structured output
    elif context_type == "proposal" or tool_name == "generate_proposal":
        return STRUCTURED_SYSTEM_PROMPT, "STRUCTURED_V1"
    
    # Technical discussions benefit from few-shot examples
    elif context_type == "technical":
        return FEW_SHOT_SYSTEM_PROMPT, "FEW_SHOT_V1"
    
    # Default: Use lean prompt for efficiency
    else:
        return LEAN_SYSTEM_PROMPT, "LEAN_V1"


# ============================================================================
# A/B TESTING
# ============================================================================

import random

def select_prompt_ab_test(user_id: str = None) -> tuple[str, str]:
    """
    A/B test between prompts
    Uses consistent assignment per user (if user_id provided)
    
    Args:
        user_id: User identifier for consistent assignment
    
    Returns:
        (prompt, version)
    """
    # Consistent assignment per user
    if user_id:
        # Use hash for consistent assignment
        import hashlib
        hash_val = int(hashlib.md5(user_id.encode()).hexdigest(), 16)
        variant = hash_val % 2
    else:
        # Random assignment
        variant = random.randint(0, 1)
    
    if variant == 0:
        return LEAN_SYSTEM_PROMPT, "LEAN_V1"
    else:
        return FEW_SHOT_SYSTEM_PROMPT, "FEW_SHOT_V1"


# ============================================================================
# TOKEN USAGE TRACKING
# ============================================================================

def log_token_usage(
    prompt_version: str,
    input_tokens: int,
    output_tokens: int,
    total_tokens: int,
    tool_name: str = None,
    user_id: str = None
):
    """
    Log token usage for analysis
    
    Args:
        prompt_version: Version of prompt used
        input_tokens: Input tokens
        output_tokens: Output tokens
        total_tokens: Total tokens
        tool_name: Tool name (if applicable)
        user_id: User ID (if applicable)
    """
    from logger import logger
    
    logger.info(
        "token_usage",
        "Token usage tracked",
        prompt_version=prompt_version,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        total_tokens=total_tokens,
        tool_name=tool_name,
        user_id=user_id,
        cost_usd=calculate_cost(total_tokens)
    )


def calculate_cost(tokens: int, provider: str = "groq") -> float:
    """Calculate cost for token usage"""
    costs_per_million = {
        "groq": 0.10,
        "openai": 0.50,
        "gemini": 0.15
    }
    
    cost_per_million = costs_per_million.get(provider, 0.50)
    return (tokens / 1_000_000) * cost_per_million


# ============================================================================
# PROMPT ANALYTICS
# ============================================================================

def get_prompt_analytics(log_file: str = "logs/mcp_server.log") -> dict:
    """
    Analyze prompt performance from logs
    
    Returns:
        Analytics dict with metrics per prompt version
    """
    import json
    from pathlib import Path
    from collections import defaultdict
    
    analytics = defaultdict(lambda: {
        "total_requests": 0,
        "total_tokens": 0,
        "avg_tokens": 0,
        "total_cost": 0.0,
        "input_tokens": 0,
        "output_tokens": 0
    })
    
    log_path = Path(log_file)
    if not log_path.exists():
        return {}
    
    try:
        with open(log_path, 'r') as f:
            for line in f:
                try:
                    entry = json.loads(line)
                    if entry.get("event_type") == "token_usage":
                        version = entry.get("prompt_version", "unknown")
                        
                        analytics[version]["total_requests"] += 1
                        analytics[version]["total_tokens"] += entry.get("total_tokens", 0)
                        analytics[version]["input_tokens"] += entry.get("input_tokens", 0)
                        analytics[version]["output_tokens"] += entry.get("output_tokens", 0)
                        analytics[version]["total_cost"] += entry.get("cost_usd", 0.0)
                
                except json.JSONDecodeError:
                    continue
    except Exception as e:
        print(f"Error reading logs: {e}")
    
    # Calculate averages
    for version, data in analytics.items():
        if data["total_requests"] > 0:
            data["avg_tokens"] = data["total_tokens"] / data["total_requests"]
            data["avg_input_tokens"] = data["input_tokens"] / data["total_requests"]
            data["avg_output_tokens"] = data["output_tokens"] / data["total_requests"]
            data["avg_cost"] = data["total_cost"] / data["total_requests"]
    
    return dict(analytics)


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
USAGE IN server.py:

from system_prompts import (
    build_optimized_prompt,
    validate_prompt_length,
    apply_guardrails,
    LEAN_SYSTEM_PROMPT
)

# Example 1: Use lean prompt (recommended for production)
@secure_tool("chat", ChatMessageSchema, "ai", "user_id")
async def chat_handler(validated_data: dict, user_id: str = "default"):
    message = validated_data["message"]
    
    # Apply guardrails
    processed_message = apply_guardrails(message, {})
    if processed_message != message:
        return {"reply": processed_message}
    
    # Build optimized prompt
    config = build_optimized_prompt(
        prompt_type="lean",
        temperature="balanced"
    )
    
    # Add to token manager
    token_manager.add_message(user_id, "user", message)
    
    # Get conversation
    conversation = token_manager.get_conversation(user_id)
    
    # Prepend system prompt
    messages = [
        {"role": "system", "content": config["system_prompt"]},
        *conversation
    ]
    
    # Call AI with optimized settings
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=config["temperature"],
        max_tokens=config["max_tokens"]
    )
    
    reply = response.choices[0].message.content
    token_manager.add_message(user_id, "assistant", reply)
    
    return {"reply": reply}


# Example 2: Use structured prompt (for JSON output)
config = build_optimized_prompt(
    prompt_type="structured",
    temperature="deterministic"
)

response = groq_client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": config["system_prompt"]},
        {"role": "user", "content": message}
    ],
    temperature=config["temperature"],
    max_tokens=config["max_tokens"],
    response_format={"type": "json_object"}  # Force JSON output
)


# Example 3: Validate prompt length
is_valid, token_count = validate_prompt_length(LEAN_SYSTEM_PROMPT)
if not is_valid:
    print(f"Warning: System prompt too long ({token_count} tokens)")


# Example 4: Use few-shot for consistency
config = build_optimized_prompt(
    prompt_type="few_shot",
    temperature="balanced"
)
"""

# ============================================================================
# PROMPT COMPARISON
# ============================================================================

PROMPT_COMPARISON = """
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ PROMPT TYPE COMPARISON                                      â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                             â”‚
â”‚ LEAN (Recommended for Production)                          â”‚
â”‚ âœ… Token efficient (~150 tokens)                           â”‚
â”‚ âœ… Fast response                                           â”‚
â”‚ âœ… Low cost                                                â”‚
â”‚ âœ… Clear constraints                                       â”‚
â”‚ âš ï¸  Less consistent than few-shot                          â”‚
â”‚                                                             â”‚
â”‚ STRUCTURED (For JSON Output)                               â”‚
â”‚ âœ… Parseable output                                        â”‚
â”‚ âœ… Deterministic format                                    â”‚
â”‚ âœ… Easy backend integration                                â”‚
â”‚ âš ï¸  Slightly more tokens (~180)                            â”‚
â”‚                                                             â”‚
â”‚ FEW-SHOT (Most Consistent)                                 â”‚
â”‚ âœ… Highest consistency                                     â”‚
â”‚ âœ… Best quality responses                                  â”‚
â”‚ âš ï¸  More tokens (~250)                                     â”‚
â”‚ âš ï¸  Higher cost                                            â”‚
â”‚                                                             â”‚
â”‚ HIERARCHICAL (Advanced Control)                            â”‚
â”‚ âœ… Maximum control                                         â”‚
â”‚ âœ… Flexible                                                â”‚
â”‚ âš ï¸  Complex to manage                                      â”‚
â”‚ âš ï¸  Most tokens (~200)                                     â”‚
â”‚                                                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

RECOMMENDATION:
- Production SaaS: Use LEAN
- WhatsApp Bot: Use STRUCTURED (JSON output)
- High-quality chatbot: Use FEW-SHOT
- Complex automation: Use HIERARCHICAL
"""

print("âœ… System Prompts Module Loaded")
print("\nAvailable prompts:")
print("  - LEAN_SYSTEM_PROMPT (recommended)")
print("  - STRUCTURED_SYSTEM_PROMPT (JSON output)")
print("  - FEW_SHOT_SYSTEM_PROMPT (most consistent)")
print("  - SYSTEM_PROMPT_HIERARCHY (advanced)")
print("\nToken limits enforced:")
print(f"  - System prompt: {TOKEN_LIMITS['system_prompt']} tokens")
print(f"  - User message: {TOKEN_LIMITS['user_message']} tokens")
print(f"  - Assistant response: {TOKEN_LIMITS['assistant_response']} tokens")

