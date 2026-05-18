"""Invoice generation helpers.

The previous file was truncated, which broke Python imports. This module keeps a
small, valid surface until full invoice PDF generation is implemented.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any


def create_invoice_payload(
    customer_name: str,
    customer_email: str,
    items: list[dict[str, Any]],
    currency: str = "INR",
) -> dict[str, Any]:
    subtotal = sum(float(item.get("amount", 0) or 0) for item in items)
    return {
        "success": True,
        "invoice": {
            "customer_name": customer_name,
            "customer_email": customer_email,
            "items": items,
            "currency": currency,
            "subtotal": subtotal,
            "total": subtotal,
            "created_at": datetime.utcnow().isoformat() + "Z",
        },
    }
