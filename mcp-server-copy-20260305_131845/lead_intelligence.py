"""
Lead Intelligence - Advanced Scoring, Enrichment & Qualification
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

try:
    from pymongo import MongoClient
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")

# Data paths
DATA_DIR = Path(__file__).parent / "data"
LEADS_PATH = DATA_DIR / "leads.json"
INTELLIGENCE_LOG = DATA_DIR / "lead_intelligence.json"

# AI clients
groq_client = None
gemini_client = None

if GROQ_AVAILABLE and os.environ.get("GROQ_API_KEY"):
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
if GEMINI_AVAILABLE and os.environ.get("GEMINI_API_KEY"):
    gemini_client = create_gemini_model(
        os.environ.get("GEMINI_API_KEY"),
        os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    )


def get_mongo_db():
    """Get MongoDB connection"""
    if not PYMONGO_AVAILABLE:
        return None
    
    uri = os.environ.get("MONGODB_URI", "").strip()
    db_name = os.environ.get("MONGODB_DB", "codesunny").strip()
    
    if not uri:
        return None
    
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        return client[db_name]
    except Exception as e:
        print(f"❌ MongoDB error: {e}")
        return None


def load_leads():
    """Load leads from MongoDB or JSON"""
    db = get_mongo_db()
    
    if db is not None:
        try:
            col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
            leads = list(col.find({}))
            for lead in leads:
                lead["_id"] = str(lead.get("_id", ""))
            return leads
        except Exception as e:
            print(f"⚠️  MongoDB read failed: {e}")
    
    # Fallback to JSON
    if LEADS_PATH.exists():
        return json.loads(LEADS_PATH.read_text(encoding="utf-8"))
    return []


def save_lead(lead):
    """Save lead to MongoDB or JSON"""
    db = get_mongo_db()
    
    if db is not None:
        try:
            col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
            email = lead.get("email")
            if email:
                col.update_one(
                    {"email": email},
                    {"$set": lead},
                    upsert=True
                )
                return True
        except Exception as e:
            print(f"⚠️  MongoDB save failed: {e}")
    
    # Fallback to JSON
    leads = load_leads()
    email = lead.get("email")
    found = False
    for i, l in enumerate(leads):
        if l.get("email") == email:
            leads[i] = lead
            found = True
            break
    if not found:
        leads.append(lead)
    
    DATA_DIR.mkdir(exist_ok=True)
    LEADS_PATH.write_text(json.dumps(leads, indent=2), encoding="utf-8")
    return True


def calculate_advanced_score(lead):
    """
    Advanced lead scoring algorithm
    Returns: (score, quality, factors)
    """
    score = 0
    factors = []
    
    # Email quality (0-20 points)
    email = (lead.get("email") or "").lower()
    if email:
        if any(domain in email for domain in ["gmail.com", "yahoo.com", "hotmail.com"]):
            score += 5
            factors.append("Personal email (+5)")
        elif "@" in email:
            score += 15
            factors.append("Business email (+15)")
    
    # Message quality (0-30 points)
    message = (lead.get("message") or "").strip()
    if message:
        msg_len = len(message)
        if msg_len > 200:
            score += 30
            factors.append("Detailed message (+30)")
        elif msg_len > 100:
            score += 20
            factors.append("Good message length (+20)")
        elif msg_len > 40:
            score += 10
            factors.append("Basic message (+10)")
    
    # High-intent keywords (0-25 points)
    high_intent = [
        "urgent", "immediately", "asap", "budget", "quote", "pricing",
        "start", "begin", "launch", "deadline", "timeline", "payment"
    ]
    msg_lower = message.lower()
    intent_count = sum(1 for kw in high_intent if kw in msg_lower)
    if intent_count >= 3:
        score += 25
        factors.append(f"High intent keywords ({intent_count}) (+25)")
    elif intent_count >= 1:
        score += 15
        factors.append(f"Intent keywords ({intent_count}) (+15)")
    
    # Budget indicators (0-20 points)
    budget_keywords = ["50000", "100000", "₹50", "₹100", "lakh", "50k", "100k"]
    if any(kw in msg_lower for kw in budget_keywords):
        score += 20
        factors.append("Budget mentioned (+20)")
    
    # Services interested (0-15 points)
    services = lead.get("services_interested", [])
    if len(services) >= 3:
        score += 15
        factors.append(f"Multiple services ({len(services)}) (+15)")
    elif len(services) >= 1:
        score += 10
        factors.append(f"Services specified ({len(services)}) (+10)")
    
    # Company indicators (0-10 points)
    company_keywords = ["company", "business", "startup", "enterprise", "organization"]
    if any(kw in msg_lower for kw in company_keywords):
        score += 10
        factors.append("Company/business mentioned (+10)")
    
    # Determine quality
    if score >= 75:
        quality = "hot"
    elif score >= 50:
        quality = "warm"
    elif score >= 25:
        quality = "cool"
    else:
        quality = "cold"
    
    return score, quality, factors


def enrich_lead_data(lead):
    """
    Enrich lead with additional data
    """
    enriched = dict(lead)
    email = lead.get("email", "")
    
    # Email validation
    if email and "@" in email:
        domain = email.split("@")[1].lower()
        enriched["email_domain"] = domain
        
        # Detect email type
        free_domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
        enriched["email_type"] = "personal" if domain in free_domains else "business"
    
    # Extract phone if present in message
    message = lead.get("message", "")
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, message)
    if phones:
        enriched["phone_extracted"] = phones[0]
    
    # Detect language
    if re.search(r'[\u0900-\u097F]', message):
        enriched["language"] = "hindi"
    else:
        enriched["language"] = "english"
    
    # Timestamp enrichment
    enriched["enriched_at"] = datetime.now(timezone.utc).isoformat() + "Z"
    
    return enriched


def qualify_lead(lead, threshold=50):
    """
    Qualify lead based on BANT criteria
    Budget, Authority, Need, Timeline
    """
    score, quality, factors = calculate_advanced_score(lead)
    message = (lead.get("message") or "").lower()
    
    qualification = {
        "qualified": score >= threshold,
        "score": score,
        "quality": quality,
        "factors": factors,
        "bant": {
            "budget": any(kw in message for kw in ["budget", "price", "cost", "₹", "rs"]),
            "authority": any(kw in message for kw in ["owner", "ceo", "founder", "director", "manager"]),
            "need": len(lead.get("services_interested", [])) > 0,
            "timeline": any(kw in message for kw in ["urgent", "asap", "deadline", "timeline", "when"])
        }
    }
    
    # BANT score
    bant_score = sum(qualification["bant"].values()) * 5
    qualification["bant_score"] = bant_score
    qualification["final_score"] = score + bant_score
    
    return qualification


def ai_analyze_lead(lead):
    """Use AI to analyze lead intent and potential"""
    message = lead.get("message", "")
    name = lead.get("name", "Unknown")
    
    if not message or not (groq_client or gemini_client):
        return None
    
    prompt = f"""
Analyze this lead:
Name: {name}
Message: {message}

Provide:
1. Intent (what they want)
2. Urgency (low/medium/high)
3. Budget estimate (low/medium/high)
4. Conversion probability (0-100%)
5. Recommended action

Return JSON only:
{{
  "intent": "...",
  "urgency": "...",
  "budget_estimate": "...",
  "conversion_probability": 0,
  "recommended_action": "..."
}}
""".strip()

    try:
        if groq_client:
            resp = groq_client.chat.completions.create(
                model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                temperature=0.3,
                max_tokens=300,
                messages=[
                    {"role": "system", "content": "You are a lead analysis expert. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ]
            )
            raw = resp.choices[0].message.content
        elif gemini_client:
            resp = gemini_client.generate_content(prompt)
            raw = resp.text
        else:
            return None
        
        # Extract JSON
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1:
            return json.loads(raw[start:end+1])
    except Exception as e:
        print(f"⚠️  AI analysis failed: {e}")
    
    return None


def score_all_leads():
    """Score all leads"""
    leads = load_leads()
    print(f"\n📊 Scoring {len(leads)} leads...\n")
    
    scored = []
    for lead in leads:
        score, quality, factors = calculate_advanced_score(lead)
        lead["lead_score"] = score
        lead["quality"] = quality
        lead["score_factors"] = factors
        lead["scored_at"] = datetime.now(timezone.utc).isoformat() + "Z"
        
        save_lead(lead)
        scored.append({
            "email": lead.get("email"),
            "name": lead.get("name"),
            "score": score,
            "quality": quality
        })
        
        print(f"✅ {lead.get('name', 'Unknown'):20s} | Score: {score:3d} | Quality: {quality:4s}")
    
    return scored


def enrich_all_leads():
    """Enrich all leads"""
    leads = load_leads()
    print(f"\n🔍 Enriching {len(leads)} leads...\n")
    
    for lead in leads:
        enriched = enrich_lead_data(lead)
        save_lead(enriched)
        print(f"✅ Enriched: {lead.get('name', 'Unknown')}")
    
    print(f"\n✅ Enriched {len(leads)} leads")


def qualify_all_leads(threshold=50):
    """Qualify all leads"""
    leads = load_leads()
    print(f"\n✔️  Qualifying {len(leads)} leads (threshold: {threshold})...\n")
    
    qualified = []
    for lead in leads:
        qual = qualify_lead(lead, threshold)
        lead["qualification"] = qual
        save_lead(lead)
        
        if qual["qualified"]:
            qualified.append(lead)
            print(f"✅ QUALIFIED: {lead.get('name', 'Unknown'):20s} | Score: {qual['final_score']:3d}")
        else:
            print(f"❌ Not qualified: {lead.get('name', 'Unknown'):20s} | Score: {qual['final_score']:3d}")
    
    print(f"\n✅ {len(qualified)}/{len(leads)} leads qualified")
    return qualified


if __name__ == "__main__":
    import sys
    
    print("\n🧠 Lead Intelligence System")
    print("=" * 60)
    
    if len(sys.argv) < 2:
        print("\nUsage:")
        print("  python lead_intelligence.py score")
        print("  python lead_intelligence.py enrich")
        print("  python lead_intelligence.py qualify [threshold]")
        print("\nExamples:")
        print("  python lead_intelligence.py score")
        print("  python lead_intelligence.py qualify 70")
        sys.exit(0)
    
    command = sys.argv[1].lower()
    
    if command == "score":
        score_all_leads()
    
    elif command == "enrich":
        enrich_all_leads()
    
    elif command == "qualify":
        threshold = int(sys.argv[2]) if len(sys.argv) > 2 else 50
        qualify_all_leads(threshold)
    
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)
    
    print("\n✅ Done!\n")
