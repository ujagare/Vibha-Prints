"""
Tool Flows - Controlled Business Logic
Deterministic flows for each CTA (no LLM over-control)
"""

from session_manager import update_session


def schedule_meeting_flow(session: dict, message: str = "") -> dict:
    """
    Meeting scheduling flow
    Direct, no over-qualification
    """
    session_id = session["session_id"]
    
    # Mark meeting requested
    update_session(session_id, "meeting_requested", True)
    update_session(session_id, "stage", "scheduling")
    
    return {
        "reply": "Great! I'd love to schedule a call with you.\n\n"
                "Please share:\n"
                "• Your preferred date and time\n"
                "• Your email (for calendar invite)\n\n"
                "Or visit: https://vibhaprints.com/contact",
        "action": "meeting_requested",
        "next_step": "collect_contact"
    }


def seo_audit_ask_url_flow(session: dict) -> dict:
    """Ask for URL for SEO audit"""
    session_id = session["session_id"]
    
    update_session(session_id, "stage", "seo_waiting_url")
    update_session(session_id, "seo_audit_requested", True)
    
    return {
        "reply": "I'll run a free SEO audit for you! 🔍\n\n"
                "Just share your website URL (e.g., https://example.com)",
        "action": "seo_audit_pending",
        "next_step": "waiting_url"
    }


def seo_audit_execute_flow(session: dict, url: str, seo_audit_tool) -> dict:
    """Execute SEO audit"""
    session_id = session["session_id"]
    
    # Call SEO audit tool
    result = seo_audit_tool(url=url)
    
    # Parse result
    audit_data = result.get("content", [{}])[0].get("text", "{}")
    import json
    try:
        audit = json.loads(audit_data)
    except:
        audit = {}
    
    update_session(session_id, "stage", "seo_completed")
    update_session(session_id, "tools_used", session.get("tools_used", []) + ["seo_audit"])
    
    # Format response
    reply = f"🔍 SEO Audit Results for {url}\n\n"
    reply += f"📊 Overall Score: {audit.get('overall_score', 'N/A')}/100\n\n"
    
    if audit.get("priority_actions"):
        reply += "Priority Actions:\n"
        for action in audit["priority_actions"][:3]:
            reply += f"• {action}\n"
    
    reply += f"\n{audit.get('cta', 'Want professional SEO optimization? Contact us!')}"
    
    return {
        "reply": reply,
        "action": "seo_completed",
        "data": audit
    }


def quote_ask_services_flow(session: dict) -> dict:
    """Ask what services user needs"""
    session_id = session["session_id"]
    
    update_session(session_id, "stage", "quote_collecting")
    update_session(session_id, "quote_requested", True)
    
    return {
        "reply": "I'll help you get an instant quote! 💰\n\n"
                "What do you need?\n"
                "• Website Development\n"
                "• E-commerce Store\n"
                "• SEO Optimization\n"
                "• UI/UX Design\n"
                "• Full Package\n\n"
                "Just tell me what you're looking for!",
        "action": "quote_pending",
        "next_step": "waiting_services"
    }


def quote_execute_flow(session: dict, services: str, calculate_quote_tool) -> dict:
    """Execute quote calculation"""
    session_id = session["session_id"]
    
    # Call quote tool
    result = calculate_quote_tool(services=services, requirements="")
    
    # Parse result
    quote_data = result.get("content", [{}])[0].get("text", "{}")
    import json
    try:
        quote = json.loads(quote_data)
    except:
        quote = {}
    
    update_session(session_id, "stage", "quote_provided")
    update_session(session_id, "services_interested", services.split(","))
    update_session(session_id, "tools_used", session.get("tools_used", []) + ["calculate_quote"])
    
    # Format response
    reply = "💰 Here's your instant quote:\n\n"
    
    if quote.get("services"):
        for svc in quote["services"]:
            reply += f"• {svc.get('name', 'Service')}: ₹{svc.get('price', 0):,}\n"
    
    reply += f"\n💵 Total: ₹{quote.get('final_price', quote.get('total_price', 0)):,}\n"
    
    if quote.get("discount"):
        reply += f"🎉 You save: ₹{quote.get('discount', 0):,}\n"
    
    reply += f"\n⏱️ Timeline: {quote.get('estimated_duration', '4-6 weeks')}\n\n"
    reply += "Want a detailed proposal? Just say 'yes'!"
    
    return {
        "reply": reply,
        "action": "quote_provided",
        "data": quote,
        "next_step": "proposal_or_meeting"
    }


def image_ask_prompt_flow(session: dict) -> dict:
    """Ask for image description"""
    session_id = session["session_id"]
    
    update_session(session_id, "stage", "image_waiting_prompt")
    update_session(session_id, "image_requested", True)
    
    return {
        "reply": "I'll generate an AI image for you! 🎨\n\n"
                "Describe what you want:\n"
                "• Professional hero image\n"
                "• Product mockup\n"
                "• Social media graphic\n"
                "• Website background\n\n"
                "Be specific for best results!",
        "action": "image_pending",
        "next_step": "waiting_prompt"
    }


def image_execute_flow(session: dict, prompt: str, generate_image_tool) -> dict:
    """Execute image generation"""
    session_id = session["session_id"]
    
    # Call image generation tool
    result = generate_image_tool(prompt=prompt, style="digital-art", size="1024x1024")
    
    # Parse result
    image_data = result.get("content", [{}])[0].get("text", "{}")
    import json
    try:
        image = json.loads(image_data)
    except:
        image = {}
    
    update_session(session_id, "stage", "image_generated")
    update_session(session_id, "tools_used", session.get("tools_used", []) + ["generate_image"])
    
    # Format response
    if image.get("success") and image.get("images"):
        img_url = image["images"][0].get("url", "")
        reply = f"🎨 Image generated successfully!\n\n"
        reply += f"Prompt: {image.get('prompt', prompt)}\n\n"
        reply += f"Download: {img_url}\n\n"
        reply += "Need another image or want to discuss your project?"
    else:
        reply = "Image generation is temporarily unavailable.\n\n"
        reply += "Our design team can create custom graphics for you!\n"
        reply += "Want to discuss your design needs?"
    
    return {
        "reply": reply,
        "action": "image_generated",
        "data": image
    }


def capture_lead_flow(session: dict, name: str, email: str, message: str, create_lead_tool) -> dict:
    """Capture lead information"""
    session_id = session["session_id"]
    
    # Call create_lead tool
    result = create_lead_tool(name=name, email=email, message=message)
    
    update_session(session_id, "lead_captured", True)
    update_session(session_id, "stage", "lead_captured")
    
    return {
        "reply": f"Thanks {name}! 🎉\n\n"
                "I've saved your information. Our team will reach out within 24 hours.\n\n"
                "In the meantime, would you like:\n"
                "• Free SEO audit\n"
                "• Instant quote\n"
                "• AI image generation",
        "action": "lead_captured",
        "next_step": "offer_services"
    }


def greeting_flow(session: dict) -> dict:
    """Handle greeting"""
    return {
        "reply": "Hi! 👋 I'm your AI assistant from Vibha Prints.\n\n"
                "I can help you with:\n"
                "🎨 Graphic design suggestions\n"
                "🖨️ Printing guidance\n"
                "💰 Instant project quotes\n"
                "📞 Schedule a consultation\n\n"
                "What brings you here today?",
        "action": "greeting",
        "next_step": "identify_need"
    }


def confirmation_yes_flow(session: dict) -> dict:
    """Handle 'yes' confirmation based on context"""
    stage = session.get("stage")
    
    if stage == "quote_provided":
        return {
            "reply": "Perfect! I'll prepare a detailed proposal for you.\n\n"
                    "Please share your email so I can send it over.",
            "action": "proposal_requested",
            "next_step": "collect_email"
        }
    
    elif stage == "seo_completed":
        return {
            "reply": "Great! Our SEO package starts at ₹35,000.\n\n"
                    "Would you like to schedule a call to discuss your needs?",
            "action": "seo_interested",
            "next_step": "schedule_or_quote"
        }
    
    else:
        return {
            "reply": "Awesome! How can I help you further?",
            "action": "confirmed",
            "next_step": "continue"
        }


def confirmation_no_flow(session: dict) -> dict:
    """Handle 'no' response"""
    return {
        "reply": "No problem! Is there anything else I can help you with?\n\n"
                "• Free SEO audit\n"
                "• Generate AI images\n"
                "• Get instant quote\n"
                "• Schedule a call",
        "action": "declined",
        "next_step": "offer_alternatives"
    }


print("✅ Tool Flows Loaded")
print("   - 9 deterministic flows")
print("   - No LLM over-control")
print("   - Direct CTA execution")
print("   - Context-aware responses")
