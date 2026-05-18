"""
Shared service extraction utilities.
Keeps intent router, chat handler, and server fallback in sync.
"""

from __future__ import annotations

import re
from typing import List


def extract_quote_services(message: str) -> List[str]:
    """
    Extract normalized service slugs from free text.

    Returns ordered list from this set:
    - web
    - ecommerce
    - seo
    - design
    - marketing
    - automation
    """
    text = (message or "").lower()
    services: List[str] = []

    has_ecommerce = any(
        [
            re.search(r"\be[\s\-]?commerce\b", text),
            re.search(r"\becom\b", text),
            "online store" in text,
            "shopping cart" in text,
            "payment gateway" in text,
            "product catalog" in text,
            "woocommerce" in text,
            "shopify" in text,
            "store" in text,
        ]
    )
    if has_ecommerce:
        services.append("ecommerce")

    if any(
        [
            "seo" in text,
            "search engine" in text,
            "ranking" in text,
            "organic traffic" in text,
            "google ranking" in text,
        ]
    ):
        services.append("seo")

    if any(
        [
            "ui" in text,
            "ux" in text,
            "design" in text,
            "wireframe" in text,
            "figma" in text,
            "prototype" in text,
            "landing page design" in text,
        ]
    ):
        services.append("design")

    if any(
        [
            "marketing" in text,
            "digital marketing" in text,
            "google ads" in text,
            "meta ads" in text,
            "facebook ads" in text,
            "campaign" in text,
            "lead generation" in text,
        ]
    ):
        services.append("marketing")

    if any(
        [
            re.search(r"\bai\b", text),
            "automation" in text,
            "chatbot" in text,
            "agent" in text,
            "workflow automation" in text,
            "n8n" in text,
        ]
    ):
        services.append("automation")

    # Generic web service (only if ecommerce was not detected)
    has_web = any(
        [
            "website" in text,
            "websit" in text,  # common typo
            re.search(r"\bweb\b", text),
            "landing page" in text,
            "portfolio site" in text,
            "company website" in text,
        ]
    )
    if has_web and not has_ecommerce:
        services.append("web")

    # De-duplicate while preserving order
    deduped: List[str] = []
    for svc in services:
        if svc not in deduped:
            deduped.append(svc)
    return deduped
