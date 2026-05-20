"""
LLM Handler - Controlled AI Responses
LLM is ONLY used for open conversation, NOT for business logic
"""

import json
import os
from pathlib import Path
import requests

# Import from server.py
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

# Initialize clients
groq_key = os.environ.get("GROQ_API_KEY")
gemini_key = os.environ.get("GEMINI_API_KEY")
minmax_key = os.environ.get("MINMAX_API_KEY")

groq_client = Groq(api_key=groq_key) if GROQ_AVAILABLE and groq_key else None

gemini_client = None
if GEMINI_AVAILABLE and gemini_key:
    gemini_model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    gemini_client = create_gemini_model(gemini_key, gemini_model)

minmax_client = "configured" if minmax_key and minmax_key != "your_minmax_api_key_here" else None

# Priority: Groq > Gemini > MinMax
client = groq_client or gemini_client or minmax_client
client_type = "groq" if groq_client else ("gemini" if gemini_client else ("minmax" if minmax_client else None))

print(f"🤖 LLM Handler: {client_type or 'fallback'}")


def rank_docs(query: str, limit: int = 3):
    """Search and rank documentation"""
    from server import load_docs, normalize
    
    docs = load_docs()
    q = normalize(query)
    if not q:
        return []
    
    ranked = []
    for doc in docs:
        hay = normalize(f"{doc.get('title','')} {doc.get('text','')}")
        score = hay.count(q)
        if score > 0:
            ranked.append((score, doc))
    
    ranked.sort(key=lambda x: x[0], reverse=True)
    return [d[1] for d in ranked[:limit]]


def chat_with_llm(message: str, session: dict) -> dict:
    """
    Call LLM for open conversation ONLY
    Business logic is handled by tool_flows.py
    """
    # Get relevant docs
    docs = rank_docs(message, limit=3)
    
    # Build context from session
    from session_manager import get_session_context
    session_context = get_session_context(session["session_id"])
    
    # Build conversation history
    history = session.get("history", [])[-5:]  # Last 5 messages
    
    # Fallback response if no LLM
    def build_fallback():
        if docs:
            intro = "Here's what I found:\n\n"
            results = []
            for i, doc in enumerate(docs, 1):
                snippet = doc.get('text', '')[:100] + '...'
                results.append(f"{i}. {doc['title']}\n   {snippet}\n   🔗 {doc['url']}")
            return intro + "\n\n".join(results)
        else:
            return (
                "I'm here to help with:\n"
                "🎨 AI Image Generation\n"
                "🔍 Free SEO Audits\n"
                "💰 Instant Quotes\n"
                "📞 Schedule Consultations\n\n"
                "What would you like to explore?"
            )
    
    if not client:
        return {"reply": build_fallback()}
    
    # Build system prompt (LEAN and FOCUSED)
    system = (
        "You are Vibha Prints' senior website chat assistant.\n"
        "\n"
        "CONTACT: info@vibhaprints.com, +91 86249 48046, https://www.vibhaprints.com/.\n"
        "\n"
        "SERVICES: Logo design, brand identity, business cards, brochures, pamphlets, packaging, labels, stickers, hangtags, corporate stationery, flex/vinyl/banner printing, bags/T-shirts, social media creatives, website design/development, ecommerce, SEO, ads, email marketing.\n"
        "\n"
        "YOUR ROLE:\n"
        "- Answer client questions clearly and accurately\n"
        "- Qualify requirements naturally\n"
        "- Guide toward quote, WhatsApp, call, contact form, SEO audit or design demo\n"
        "- Stay concise (3-6 short sentences max)\n"
        "\n"
        "RULES:\n"
        "- Default to Roman Hinglish; use English if user writes English\n"
        "- Never use Devanagari unless asked\n"
        "- Do not invent exact prices, discounts, delivery dates, guarantees, stock or client names\n"
        "- Give estimates only: logo Rs 5,000-15,000+, business cards Rs 2,000-5,000+, brochures Rs 3,000-10,000+\n"
        "- For final quote ask item type, size, quantity, material/paper, finish, delivery city and deadline\n"
        "- Ask maximum 2 questions at a time\n"
        "- Read conversation history\n"
        "- If user says 'yes/interested' → refer to previous topic\n"
        "- If the answer is unknown or outside Vibha Art's scope, say exactly: \"Is baare mein main sure nahi hoon - aap seedha WhatsApp karein: +91 86249 48046, team turant help karegi.\"\n"
        "- Never guess or make up information you are not sure about\n"
        "- Suggest tools: calculate_quote(), seo_audit(), generate_image()\n"
        "\n"
        "TONE: Warm, professional, helpful, not pushy"
    )
    
    # Build context
    context_parts = []
    if session_context:
        context_parts.append(session_context)
    
    if docs:
        doc_context = "\n".join([f"- {d['title']}: {d['text'][:200]}" for d in docs])
        context_parts.append(f"Relevant info:\n{doc_context}")
    
    if history:
        history_text = "\n".join([f"{h['role']}: {h['content']}" for h in history[-3:]])
        context_parts.append(f"Previous conversation:\n{history_text}")
    
    context = "\n\n".join(context_parts)
    user_prompt = f"{context}\n\nUser: {message}"
    
    # Determine model
    if client_type == "groq":
        model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
    elif client_type == "minmax":
        model = os.environ.get("MINMAX_MODEL", "abab6.5-chat")
    elif client_type == "gemini":
        model = None
    else:
        model = None
    
    try:
        if client_type == "minmax":
            # MinMax API
            minmax_url = os.environ.get("MINMAX_API_URL", "https://api.minimax.chat/v1/text/chatcompletion_v2")
            headers = {
                "Authorization": f"Bearer {minmax_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.4,
                "max_tokens": 300
            }
            
            response = requests.post(minmax_url, headers=headers, json=payload, timeout=30)
            if response.status_code == 200:
                data = response.json()
                text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            else:
                raise Exception(f"MinMax error: {response.status_code}")
        
        elif client_type == "gemini":
            prompt = f"{system}\n\n{user_prompt}"
            response = client.generate_content(prompt)
            text = response.text or ""
        
        else:
            # Groq
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.4,
                max_tokens=300
            )
            text = response.choices[0].message.content or ""
        
        # Add to history
        from session_manager import add_to_history
        add_to_history(session["session_id"], "assistant", text)
        
        return {"reply": text}
    
    except Exception as e:
        print(f"❌ LLM Error ({client_type}): {e}")
        return {"reply": build_fallback()}


print("✅ LLM Handler Ready")
print("   - Controlled LLM usage")
print("   - Fallback responses")
print("   - Session-aware")
