"""
Supabase client initialization and utilities for MCP server.
Production-ready implementation using REST API with proper error handling.
"""

import os
import requests
import json
import logging
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from urllib.parse import quote
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("supabase_client")

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")
load_dotenv()

# Supabase configuration
SUPABASE_URL = (os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL", "")).rstrip("/")
SUPABASE_KEY = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    or os.environ.get("SUPABASE_SERVICE_KEY")
    or os.environ.get("VITE_SUPABASE_ANON_KEY", "")
)

# Request timeout
REQUEST_TIMEOUT = 10


class SupabaseError(Exception):
    """Custom exception for Supabase errors"""
    pass


class SupabaseClient:
    """Production-ready Supabase REST client"""
    
    def __init__(self, url: str, key: str):
        if not url or not key:
            raise SupabaseError("Supabase URL and key are required")
        
        self.url = url
        self.key = key
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    
    def table(self, table_name: str) -> "SupabaseTable":
        """Get a table reference"""
        return SupabaseTable(self.url, self.headers, table_name)
    
    def health_check(self) -> bool:
        """Check if Supabase is accessible"""
        try:
            response = requests.get(
                f"{self.url}/rest/v1/",
                headers=self.headers,
                timeout=REQUEST_TIMEOUT
            )
            return response.status_code in [200, 204]
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False


class SupabaseTable:
    """Table operations"""
    
    def __init__(self, url: str, headers: Dict, table_name: str):
        self.url = url
        self.headers = headers
        self.table_name = table_name
    
    def insert(self, data: Dict[str, Any]) -> "SupabaseInsert":
        """Insert a record"""
        return SupabaseInsert(self.url, self.headers, self.table_name, data)
    
    def select(self, columns: str = "*") -> "SupabaseSelect":
        """Select records"""
        return SupabaseSelect(self.url, self.headers, self.table_name, columns)

    def update(self, data: Dict[str, Any]) -> "SupabaseUpdate":
        """Update records"""
        return SupabaseUpdate(self.url, self.headers, self.table_name, data)


class SupabaseInsert:
    """Insert operation"""
    
    def __init__(self, url: str, headers: Dict, table_name: str, data: Dict):
        self.url = url
        self.headers = headers
        self.table_name = table_name
        self.data = data
    
    def execute(self) -> "SupabaseResponse":
        """Execute insert"""
        try:
            response = requests.post(
                f"{self.url}/rest/v1/{self.table_name}",
                headers=self.headers,
                json=self.data,
                timeout=REQUEST_TIMEOUT
            )
            
            if response.status_code in [200, 201]:
                return SupabaseResponse(response.json(), response.status_code)
            else:
                error_msg = response.text or f"HTTP {response.status_code}"
                logger.error(f"Insert failed: {error_msg}")
                return SupabaseResponse(None, response.status_code, error_msg)
        
        except requests.Timeout:
            error = "Request timeout"
            logger.error(error)
            return SupabaseResponse(None, 504, error)
        except Exception as e:
            error = str(e)
            logger.error(f"Insert error: {error}")
            return SupabaseResponse(None, 500, error)


class SupabaseSelect:
    """Select operation"""
    
    def __init__(self, url: str, headers: Dict, table_name: str, columns: str):
        self.url = url
        self.headers = headers
        self.table_name = table_name
        self.columns = columns
        self.filters = []
        self.limit_count = None
        self.order_column = None
        self.order_desc = False
    
    def gte(self, column: str, value: str) -> "SupabaseSelect":
        """Greater than or equal filter"""
        self.filters.append(f"{quote(column)}=gte.{quote(str(value), safe=':TZ+-.')}")
        return self
    
    def lte(self, column: str, value: str) -> "SupabaseSelect":
        """Less than or equal filter"""
        self.filters.append(f"{quote(column)}=lte.{quote(str(value), safe=':TZ+-.')}")
        return self
    
    def eq(self, column: str, value: str) -> "SupabaseSelect":
        """Equal filter"""
        self.filters.append(f"{quote(column)}=eq.{quote(str(value), safe='')}")
        return self
    
    def limit(self, count: int) -> "SupabaseSelect":
        """Limit results"""
        self.limit_count = count
        return self
    
    def order(self, column: str, desc: bool = False) -> "SupabaseSelect":
        """Order results"""
        self.order_column = column
        self.order_desc = desc
        return self
    
    def execute(self) -> "SupabaseResponse":
        """Execute select"""
        try:
            query = f"{self.url}/rest/v1/{self.table_name}?select={self.columns}"
            
            for f in self.filters:
                query += f"&{f}"
            
            if self.limit_count:
                query += f"&limit={self.limit_count}"
            
            if self.order_column:
                order = "desc" if self.order_desc else "asc"
                query += f"&order={self.order_column}.{order}"
            
            response = requests.get(query, headers=self.headers, timeout=REQUEST_TIMEOUT)
            
            if response.status_code in [200, 204]:
                data = response.json() if response.text else []
                return SupabaseResponse(data, response.status_code)
            else:
                error_msg = response.text or f"HTTP {response.status_code}"
                logger.error(f"Select failed: {error_msg}")
                return SupabaseResponse(None, response.status_code, error_msg)
        
        except requests.Timeout:
            error = "Request timeout"
            logger.error(error)
            return SupabaseResponse(None, 504, error)
        except Exception as e:
            error = str(e)
            logger.error(f"Select error: {error}")
            return SupabaseResponse(None, 500, error)


class SupabaseUpdate:
    """Update operation"""
    
    def __init__(self, url: str, headers: Dict, table_name: str, data: Dict):
        self.url = url
        self.headers = headers
        self.table_name = table_name
        self.data = data
        self.filters = []
    
    def eq(self, column: str, value: str) -> "SupabaseUpdate":
        """Equal filter"""
        self.filters.append(f"{quote(column)}=eq.{quote(str(value), safe='')}")
        return self
    
    def execute(self) -> "SupabaseResponse":
        """Execute update"""
        try:
            query = f"{self.url}/rest/v1/{self.table_name}"
            if self.filters:
                query += "?" + "&".join(self.filters)
            
            response = requests.patch(
                query,
                headers=self.headers,
                json=self.data,
                timeout=REQUEST_TIMEOUT
            )
            
            if response.status_code in [200, 204]:
                data = response.json() if response.text else []
                return SupabaseResponse(data, response.status_code)
            else:
                error_msg = response.text or f"HTTP {response.status_code}"
                logger.error(f"Update failed: {error_msg}")
                return SupabaseResponse(None, response.status_code, error_msg)
        
        except requests.Timeout:
            error = "Request timeout"
            logger.error(error)
            return SupabaseResponse(None, 504, error)
        except Exception as e:
            error = str(e)
            logger.error(f"Update error: {error}")
            return SupabaseResponse(None, 500, error)


class SupabaseResponse:
    """Response wrapper"""
    
    def __init__(self, data: Optional[Any], status_code: int, error: Optional[str] = None):
        self.data = data
        self.status_code = status_code
        self.error = error
    
    def execute(self) -> "SupabaseResponse":
        """For compatibility with chaining"""
        return self


# Initialize Supabase client
supabase: Optional[SupabaseClient] = None
is_supabase_configured = False

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = SupabaseClient(SUPABASE_URL, SUPABASE_KEY)
        
        # Test connection
        if supabase.health_check():
            is_supabase_configured = True
            logger.info("✅ Supabase client initialized successfully")
        else:
            logger.warning("⚠️  Supabase health check failed")
    except SupabaseError as e:
        logger.error(f"❌ Failed to initialize Supabase: {e}")
    except Exception as e:
        logger.error(f"❌ Unexpected error initializing Supabase: {e}")
else:
    logger.warning("⚠️  Supabase credentials not found in environment variables")


# Helper functions for common operations
def save_contact_lead(name: str, email: str, mobile: str, message: str, source: str = "mcp-server") -> Dict:
    """Save contact lead to Supabase"""
    if not is_supabase_configured or not supabase:
        return {"success": False, "error": "Supabase not configured"}
    
    try:
        data = {
            "name": name,
            "email": email,
            "mobile": mobile,
            "message": message,
            "source": source,
        }
        
        response = supabase.table("contact_leads").insert(data).execute()
        
        if response.status_code in [200, 201]:
            return {
                "success": True,
                "data": response.data,
                "message": "Contact lead saved successfully"
            }
        else:
            return {
                "success": False,
                "error": response.error or "Failed to save lead"
            }
    except Exception as e:
        logger.error(f"Error saving contact lead: {e}")
        return {"success": False, "error": str(e)}


def save_brochure_lead(name: str, email: str, phone: str, company: str = "", 
                       brochure_name: str = "Vibha_Printing Media", 
                       source: str = "mcp-server") -> Dict:
    """Save brochure lead to Supabase"""
    if not is_supabase_configured or not supabase:
        return {"success": False, "error": "Supabase not configured"}
    
    try:
        data = {
            "name": name,
            "email": email,
            "phone": phone,
            "company": company,
            "brochure_name": brochure_name,
            "source": source,
        }
        
        response = supabase.table("brochure_download_leads").insert(data).execute()
        
        if response.status_code in [200, 201]:
            return {
                "success": True,
                "data": response.data,
                "message": "Brochure lead saved successfully"
            }
        else:
            return {
                "success": False,
                "error": response.error or "Failed to save lead"
            }
    except Exception as e:
        logger.error(f"Error saving brochure lead: {e}")
        return {"success": False, "error": str(e)}


def get_contact_leads(limit: int = 100) -> Dict:
    """Retrieve contact leads from Supabase"""
    if not is_supabase_configured or not supabase:
        return {"success": False, "error": "Supabase not configured"}
    
    try:
        response = supabase.table("contact_leads").select("*").limit(limit).order("created_at", desc=True).execute()
        
        if response.status_code in [200, 204]:
            return {
                "success": True,
                "data": response.data or [],
                "count": len(response.data) if response.data else 0
            }
        else:
            return {
                "success": False,
                "error": response.error or "Failed to retrieve leads"
            }
    except Exception as e:
        logger.error(f"Error retrieving contact leads: {e}")
        return {"success": False, "error": str(e)}


def get_brochure_leads(limit: int = 100) -> Dict:
    """Retrieve brochure leads from Supabase"""
    if not is_supabase_configured or not supabase:
        return {"success": False, "error": "Supabase not configured"}
    
    try:
        response = supabase.table("brochure_download_leads").select("*").limit(limit).order("created_at", desc=True).execute()
        
        if response.status_code in [200, 204]:
            return {
                "success": True,
                "data": response.data or [],
                "count": len(response.data) if response.data else 0
            }
        else:
            return {
                "success": False,
                "error": response.error or "Failed to retrieve leads"
            }
    except Exception as e:
        logger.error(f"Error retrieving brochure leads: {e}")
        return {"success": False, "error": str(e)}


def is_supabase_configured() -> bool:
    """Check if Supabase is properly configured."""
    return supabase is not None


def save_contact_lead(name: str, email: str, mobile: str, message: str, source: str = "mcp-server") -> dict:
    """
    Save contact lead to Supabase contact_leads table.
    
    Args:
        name: Lead name
        email: Lead email
        mobile: Lead phone number
        message: Lead message
        source: Source of the lead (default: mcp-server)
    
    Returns:
        dict with success status and data/error
    """
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}
    
    try:
        data = {
            "name": name,
            "email": email,
            "mobile": mobile,
            "message": message,
            "source": source,
        }
        
        response = supabase.table("contact_leads").insert(data).execute()
        
        return {
            "success": True,
            "data": response.data,
            "message": "Contact lead saved successfully"
        }
    except Exception as e:
        print(f"❌ Error saving contact lead: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def save_brochure_lead(name: str, email: str, phone: str, company: str = "", 
                       brochure_name: str = "Vibha_Printing Media", 
                       source: str = "mcp-server") -> dict:
    """
    Save brochure download lead to Supabase brochure_download_leads table.
    
    Args:
        name: Lead name
        email: Lead email
        phone: Lead phone number
        company: Company name (optional)
        brochure_name: Name of brochure (default: Vibha_Printing Media)
        source: Source of the lead (default: mcp-server)
    
    Returns:
        dict with success status and data/error
    """
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}
    
    try:
        data = {
            "name": name,
            "email": email,
            "phone": phone,
            "company": company,
            "brochure_name": brochure_name,
            "source": source,
        }
        
        response = supabase.table("brochure_download_leads").insert(data).execute()
        
        return {
            "success": True,
            "data": response.data,
            "message": "Brochure lead saved successfully"
        }
    except Exception as e:
        print(f"❌ Error saving brochure lead: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def get_contact_leads(limit: int = 100) -> dict:
    """
    Retrieve contact leads from Supabase.
    
    Args:
        limit: Maximum number of leads to retrieve
    
    Returns:
        dict with success status and leads data
    """
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}
    
    try:
        response = supabase.table("contact_leads").select("*").limit(limit).order("created_at", desc=True).execute()
        
        return {
            "success": True,
            "data": response.data,
            "count": len(response.data)
        }
    except Exception as e:
        print(f"❌ Error retrieving contact leads: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def get_brochure_leads(limit: int = 100) -> dict:
    """
    Retrieve brochure leads from Supabase.
    
    Args:
        limit: Maximum number of leads to retrieve
    
    Returns:
        dict with success status and leads data
    """
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}
    
    try:
        response = supabase.table("brochure_download_leads").select("*").limit(limit).order("created_at", desc=True).execute()
        
        return {
            "success": True,
            "data": response.data,
            "count": len(response.data)
        }
    except Exception as e:
        print(f"❌ Error retrieving brochure leads: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def create_pipeline_entry(lead_id: str, lead_type: str, status: str = "new", assigned_to: str = "", notes: str = "") -> dict:
    """Create pipeline entry for a lead."""
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}

    try:
        data = {
            "lead_id": lead_id,
            "lead_type": lead_type,
            "status": status,
            "assigned_to": assigned_to or None,
            "notes": notes or None,
        }
        response = supabase.table("lead_pipeline").insert(data).execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        print(f"? Error creating pipeline entry: {e}")
        return {"success": False, "error": str(e)}


def ensure_pipeline_entry(lead_id: str, lead_type: str, status: str = "new", notes: str = "") -> dict:
    """Create a pipeline entry if one does not already exist."""
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}

    try:
        existing = (
            supabase.table("lead_pipeline")
            .select("*")
            .eq("lead_id", lead_id)
            .eq("lead_type", lead_type)
            .limit(1)
            .execute()
        )
        if existing.data:
            return {"success": True, "data": existing.data, "created": False}
        result = create_pipeline_entry(lead_id, lead_type, status=status, notes=notes)
        result["created"] = bool(result.get("success"))
        return result
    except Exception as e:
        print(f"? Error ensuring pipeline entry: {e}")
        return {"success": False, "error": str(e)}


def update_pipeline_status(lead_id: str, lead_type: str, status: str, assigned_to: str = "", notes: str = "") -> dict:
    """Update pipeline status for a lead."""
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}

    try:
        data = {
            "status": status,
            "assigned_to": assigned_to or None,
            "notes": notes or None,
        }
        response = (
            supabase.table("lead_pipeline")
            .update(data)
            .eq("lead_id", lead_id)
            .eq("lead_type", lead_type)
            .execute()
        )
        return {"success": True, "data": response.data}
    except Exception as e:
        print(f"? Error updating pipeline: {e}")
        return {"success": False, "error": str(e)}


def add_lead_activity(lead_id: str, lead_type: str, event: str, meta: dict | None = None) -> dict:
    """Log lead activity."""
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}

    try:
        data = {
            "lead_id": lead_id,
            "lead_type": lead_type,
            "event": event,
            "meta": meta or None,
        }
        response = supabase.table("lead_activity").insert(data).execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        print(f"? Error logging lead activity: {e}")
        return {"success": False, "error": str(e)}


def create_quote_request(
    lead_id: str,
    lead_type: str,
    requirements: str,
    estimated_budget: float | None = None,
    status: str = "new",
    quote_draft: str = "",
) -> dict:
    """Create quote request."""
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}

    try:
        data = {
            "lead_id": lead_id,
            "lead_type": lead_type,
            "requirements": requirements,
            "estimated_budget": estimated_budget,
            "status": status,
            "quote_draft": quote_draft or None,
        }
        response = supabase.table("quote_requests").insert(data).execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        print(f"? Error creating quote request: {e}")
        return {"success": False, "error": str(e)}


def create_appointment(
    lead_id: str,
    lead_type: str,
    calendar_provider: str = "",
    booking_link: str = "",
    time_slot: str | None = None,
    reminder_status: str = "pending",
) -> dict:
    """Create appointment."""
    if not is_supabase_configured():
        return {"success": False, "error": "Supabase not configured"}

    try:
        data = {
            "lead_id": lead_id,
            "lead_type": lead_type,
            "calendar_provider": calendar_provider or None,
            "booking_link": booking_link or None,
            "time_slot": time_slot,
            "reminder_status": reminder_status,
        }
        response = supabase.table("appointments").insert(data).execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        print(f"? Error creating appointment: {e}")
        return {"success": False, "error": str(e)}
