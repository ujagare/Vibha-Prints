"""
Printing Quote Generator - Automatic quote generation for printing services
Features:
- Product catalog management
- Dynamic price calculation
- PDF quote generation
- Email delivery
- Lead tracking
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from typing import Dict, List, Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("printing_quote_generator")

# Email configuration
MAIL_FROM = os.environ.get("MAIL_FROM", "info@vibhaprints.com")
BRAND_NAME = "Vibha Prints"
BRAND_EMAIL = "info@vibhaprints.com"
BRAND_PHONE = "+91 86259 48046"
BRAND_WEBSITE = "http://localhost:5173"

# Data directory
DATA_DIR = Path(__file__).parent / "data"
PRODUCTS_FILE = DATA_DIR / "printing_products.json"
QUOTES_LOG = DATA_DIR / "quotes_log.json"
DATA_DIR.mkdir(exist_ok=True)


# Default product catalog
DEFAULT_PRODUCTS = {
    "visiting_cards": {
        "name": "Visiting Cards",
        "description": "Professional business cards",
        "unit": "cards",
        "sizes": {
            "90x50mm": {"name": "Standard (90x50mm)", "base_price": 2.0},
            "85x55mm": {"name": "Custom (85x55mm)", "base_price": 2.5},
        },
        "paper_types": {
            "matte": {"name": "Matte", "price_multiplier": 1.0},
            "glossy": {"name": "Glossy", "price_multiplier": 1.2},
            "premium": {"name": "Premium (350gsm)", "price_multiplier": 1.5},
        },
        "min_quantity": 100,
        "max_quantity": 10000,
    },
    "brochures": {
        "name": "Brochures",
        "description": "Tri-fold or bi-fold brochures",
        "unit": "pieces",
        "sizes": {
            "a4_trifold": {"name": "A4 Tri-fold", "base_price": 15.0},
            "a4_bifold": {"name": "A4 Bi-fold", "base_price": 12.0},
            "a5_trifold": {"name": "A5 Tri-fold", "base_price": 10.0},
        },
        "paper_types": {
            "matte": {"name": "Matte 150gsm", "price_multiplier": 1.0},
            "glossy": {"name": "Glossy 150gsm", "price_multiplier": 1.1},
            "premium": {"name": "Premium 200gsm", "price_multiplier": 1.3},
        },
        "min_quantity": 50,
        "max_quantity": 5000,
    },
    "banners": {
        "name": "Banners",
        "description": "Vinyl or flex banners",
        "unit": "sq.ft",
        "sizes": {
            "2x3": {"name": "2ft × 3ft", "base_price": 150.0},
            "3x5": {"name": "3ft × 5ft", "base_price": 250.0},
            "4x6": {"name": "4ft × 6ft", "base_price": 350.0},
            "6x10": {"name": "6ft × 10ft", "base_price": 600.0},
        },
        "material_types": {
            "vinyl": {"name": "Vinyl", "price_multiplier": 1.0},
            "flex": {"name": "Flex", "price_multiplier": 1.2},
            "canvas": {"name": "Canvas", "price_multiplier": 1.5},
        },
        "min_quantity": 1,
        "max_quantity": 100,
    },
    "stickers": {
        "name": "Stickers",
        "description": "Custom printed stickers",
        "unit": "stickers",
        "sizes": {
            "2x2": {"name": "2\" × 2\"", "base_price": 0.5},
            "3x3": {"name": "3\" × 3\"", "base_price": 0.8},
            "4x4": {"name": "4\" × 4\"", "base_price": 1.2},
        },
        "finish_types": {
            "matte": {"name": "Matte", "price_multiplier": 1.0},
            "glossy": {"name": "Glossy", "price_multiplier": 1.1},
            "holographic": {"name": "Holographic", "price_multiplier": 1.5},
        },
        "min_quantity": 100,
        "max_quantity": 50000,
    },
    "labels": {
        "name": "Labels",
        "description": "Product labels and stickers",
        "unit": "labels",
        "sizes": {
            "2x3": {"name": "2\" × 3\"", "base_price": 1.0},
            "3x4": {"name": "3\" × 4\"", "base_price": 1.5},
            "4x5": {"name": "4\" × 5\"", "base_price": 2.0},
        },
        "material_types": {
            "paper": {"name": "Paper", "price_multiplier": 1.0},
            "vinyl": {"name": "Vinyl", "price_multiplier": 1.3},
            "metallic": {"name": "Metallic", "price_multiplier": 1.6},
        },
        "min_quantity": 100,
        "max_quantity": 10000,
    },
}


def load_products() -> Dict:
    """Load product catalog"""
    if PRODUCTS_FILE.exists():
        try:
            with open(PRODUCTS_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading products: {e}")
            return DEFAULT_PRODUCTS
    else:
        # Create default products file
        save_products(DEFAULT_PRODUCTS)
        return DEFAULT_PRODUCTS


def save_products(products: Dict):
    """Save product catalog"""
    try:
        with open(PRODUCTS_FILE, 'w') as f:
            json.dump(products, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving products: {e}")


def get_available_products() -> List[str]:
    """Get list of available products"""
    products = load_products()
    return list(products.keys())


def get_product_details(product_id: str) -> Optional[Dict]:
    """Get product details"""
    products = load_products()
    return products.get(product_id)


def calculate_quote(
    product_id: str,
    size: str,
    quantity: int,
    paper_type: str = None,
    material_type: str = None,
    finish_type: str = None,
) -> Dict:
    """
    Calculate quote for printing product
    
    Args:
        product_id: Product ID (visiting_cards, brochures, etc.)
        size: Size variant
        quantity: Quantity
        paper_type: Paper type (for brochures, labels)
        material_type: Material type (for banners, labels)
        finish_type: Finish type (for stickers)
    
    Returns:
        dict with quote details
    """
    
    products = load_products()
    
    if product_id not in products:
        return {"success": False, "error": f"Product '{product_id}' not found"}
    
    product = products[product_id]
    
    # Validate quantity
    if quantity < product["min_quantity"]:
        return {
            "success": False,
            "error": f"Minimum quantity is {product['min_quantity']}"
        }
    
    if quantity > product["max_quantity"]:
        return {
            "success": False,
            "error": f"Maximum quantity is {product['max_quantity']}"
        }
    
    # Get size price
    if size not in product["sizes"]:
        return {"success": False, "error": f"Size '{size}' not available"}
    
    size_info = product["sizes"][size]
    base_price = size_info["base_price"]
    
    # Apply paper/material/finish multiplier
    multiplier = 1.0
    
    if paper_type and "paper_types" in product:
        if paper_type not in product["paper_types"]:
            return {"success": False, "error": f"Paper type '{paper_type}' not available"}
        multiplier *= product["paper_types"][paper_type]["price_multiplier"]
    
    if material_type and "material_types" in product:
        if material_type not in product["material_types"]:
            return {"success": False, "error": f"Material type '{material_type}' not available"}
        multiplier *= product["material_types"][material_type]["price_multiplier"]
    
    if finish_type and "finish_types" in product:
        if finish_type not in product["finish_types"]:
            return {"success": False, "error": f"Finish type '{finish_type}' not available"}
        multiplier *= product["finish_types"][finish_type]["price_multiplier"]
    
    # Calculate prices
    unit_price = base_price * multiplier
    subtotal = unit_price * quantity
    
    # Apply bulk discount
    discount_percent = 0
    if quantity >= 1000:
        discount_percent = 10
    elif quantity >= 500:
        discount_percent = 5
    elif quantity >= 250:
        discount_percent = 2
    
    discount_amount = subtotal * (discount_percent / 100)
    total = subtotal - discount_amount
    
    # GST (18%)
    gst = total * 0.18
    final_total = total + gst
    
    return {
        "success": True,
        "quote": {
            "product_id": product_id,
            "product_name": product["name"],
            "size": size_info["name"],
            "quantity": quantity,
            "unit": product["unit"],
            "unit_price": round(unit_price, 2),
            "subtotal": round(subtotal, 2),
            "discount_percent": discount_percent,
            "discount_amount": round(discount_amount, 2),
            "subtotal_after_discount": round(total, 2),
            "gst_18_percent": round(gst, 2),
            "total": round(final_total, 2),
            "generated_at": datetime.now().isoformat(),
        }
    }


def generate_quote_pdf(quote_data: Dict, client_name: str, client_email: str) -> Optional[str]:
    """
    Generate PDF quote
    
    Args:
        quote_data: Quote data from calculate_quote()
        client_name: Client name
        client_email: Client email
    
    Returns:
        Path to generated PDF
    """
    
    try:
        quote = quote_data["quote"]
        
        # Create PDF
        pdf_path = DATA_DIR / f"quote_{quote['product_id']}_{int(datetime.now().timestamp())}.pdf"
        doc = SimpleDocTemplate(str(pdf_path), pagesize=letter)
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#6A11CB'),
            spaceAfter=30,
            alignment=TA_CENTER,
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=12,
            textColor=colors.HexColor('#6A11CB'),
            spaceAfter=10,
        )
        
        # Content
        elements = []
        
        # Header
        elements.append(Paragraph(f"{BRAND_NAME}", title_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Quote info
        quote_info = [
            ["Quote Details", ""],
            ["Quote ID:", f"QT-{int(datetime.now().timestamp())}"],
            ["Date:", datetime.now().strftime("%d-%m-%Y")],
            ["Valid Until:", datetime.now().strftime("%d-%m-%Y")],
        ]
        
        # Client info
        client_info = [
            ["Client Information", ""],
            ["Name:", client_name],
            ["Email:", client_email],
        ]
        
        # Product details
        product_details = [
            ["Product Details", ""],
            ["Product:", quote["product_name"]],
            ["Size:", quote["size"]],
            ["Quantity:", f"{quote['quantity']} {quote['unit']}"],
            ["Unit Price:", f"₹{quote['unit_price']}"],
        ]
        
        # Pricing
        pricing = [
            ["Pricing Breakdown", ""],
            ["Subtotal:", f"₹{quote['subtotal']}"],
            [f"Discount ({quote['discount_percent']}%):", f"-₹{quote['discount_amount']}"],
            ["After Discount:", f"₹{quote['subtotal_after_discount']}"],
            ["GST (18%):", f"₹{quote['gst_18_percent']}"],
            ["Total Amount:", f"₹{quote['total']}"],
        ]
        
        # Create table
        all_data = (
            [["QUOTE INFORMATION", ""]] +
            quote_info[1:] +
            [["", ""]] +
            [["CLIENT INFORMATION", ""]] +
            client_info[1:] +
            [["", ""]] +
            [["PRODUCT DETAILS", ""]] +
            product_details[1:] +
            [["", ""]] +
            [["PRICING BREAKDOWN", ""]] +
            pricing[1:]
        )
        
        table = Table(all_data, colWidths=[3*inch, 3*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6A11CB')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, -6), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#6A11CB')),
            ('TEXTCOLOR', (0, -1), (-1, -1), colors.whitesmoke),
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Footer
        footer_text = f"""
        <b>Terms & Conditions:</b><br/>
        • Payment: 50% advance, 50% on delivery<br/>
        • Delivery: 5-7 working days<br/>
        • Revisions: 2 free revisions included<br/>
        <br/>
        <b>Contact Us:</b><br/>
        {BRAND_EMAIL} | {BRAND_PHONE}<br/>
        {BRAND_WEBSITE}
        """
        
        elements.append(Paragraph(footer_text, styles['Normal']))
        
        # Build PDF
        doc.build(elements)
        
        logger.info(f"✅ PDF quote generated: {pdf_path}")
        return str(pdf_path)
    
    except Exception as e:
        logger.error(f"❌ Error generating PDF: {e}")
        return None


def save_quote_log(quote_data: Dict, client_name: str, client_email: str, pdf_path: str):
    """Save quote to log"""
    try:
        log = {}
        if QUOTES_LOG.exists():
            with open(QUOTES_LOG, 'r') as f:
                log = json.load(f)
        
        quote_id = f"QT-{int(datetime.now().timestamp())}"
        log[quote_id] = {
            "client_name": client_name,
            "client_email": client_email,
            "product": quote_data["quote"]["product_name"],
            "quantity": quote_data["quote"]["quantity"],
            "total": quote_data["quote"]["total"],
            "pdf_path": pdf_path,
            "created_at": datetime.now().isoformat(),
        }
        
        with open(QUOTES_LOG, 'w') as f:
            json.dump(log, f, indent=2)
        
        logger.info(f"✅ Quote logged: {quote_id}")
    
    except Exception as e:
        logger.error(f"Error saving quote log: {e}")


def get_quote_history(limit: int = 100) -> List[Dict]:
    """Get quote history"""
    if not QUOTES_LOG.exists():
        return []
    
    try:
        with open(QUOTES_LOG, 'r') as f:
            log = json.load(f)
        
        quotes = list(log.values())
        return sorted(quotes, key=lambda x: x["created_at"], reverse=True)[:limit]
    
    except Exception as e:
        logger.error(f"Error reading quote history: {e}")
        return []


# Example usage
if __name__ == "__main__":
    # Calculate quote
    quote = calculate_quote(
        product_id="visiting_cards",
        size="90x50mm",
        quantity=500,
        paper_type="glossy"
    )
    
    print("Quote Calculation:")
    print(json.dumps(quote, indent=2))
    
    if quote["success"]:
        # Generate PDF
        pdf_path = generate_quote_pdf(quote, "Raj Kumar", "raj@example.com")
        
        if pdf_path:
            # Save to log
            save_quote_log(quote, "Raj Kumar", "raj@example.com", pdf_path)
            print(f"\n✅ Quote PDF generated: {pdf_path}")
