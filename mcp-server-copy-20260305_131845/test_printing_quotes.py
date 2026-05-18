"""
Test script for printing quote generator
Tests quote calculation, PDF generation, and email sending
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

from printing_quote_generator import (
    calculate_quote,
    generate_quote_pdf,
    save_quote_log,
    get_available_products,
    get_product_details,
    get_quote_history,
)

def test_available_products():
    """Test getting available products"""
    print("\n" + "="*60)
    print("TEST 1: Available Products")
    print("="*60)
    
    try:
        products = get_available_products()
        print(f"✅ Found {len(products)} products:")
        for product in products:
            print(f"   - {product}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_product_details():
    """Test getting product details"""
    print("\n" + "="*60)
    print("TEST 2: Product Details")
    print("="*60)
    
    try:
        product = get_product_details("visiting_cards")
        if not product:
            print("❌ Product not found")
            return False
        
        print(f"✅ Product: {product['name']}")
        print(f"   Description: {product['description']}")
        print(f"   Available sizes:")
        for size_id, size_info in product['sizes'].items():
            print(f"      - {size_info['name']} (₹{size_info['base_price']})")
        print(f"   Paper types:")
        for paper_id, paper_info in product['paper_types'].items():
            print(f"      - {paper_info['name']} (x{paper_info['price_multiplier']})")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_quote_calculation():
    """Test quote calculation"""
    print("\n" + "="*60)
    print("TEST 3: Quote Calculation")
    print("="*60)
    
    test_cases = [
        {
            "name": "500 Visiting Cards (Glossy)",
            "product_id": "visiting_cards",
            "size": "90x50mm",
            "quantity": 500,
            "paper_type": "glossy",
        },
        {
            "name": "1000 Visiting Cards (Premium)",
            "product_id": "visiting_cards",
            "size": "90x50mm",
            "quantity": 1000,
            "paper_type": "premium",
        },
        {
            "name": "100 Brochures (A4 Tri-fold, Matte)",
            "product_id": "brochures",
            "size": "a4_trifold",
            "quantity": 100,
            "paper_type": "matte",
        },
        {
            "name": "1 Banner (3x5, Vinyl)",
            "product_id": "banners",
            "size": "3x5",
            "quantity": 1,
            "material_type": "vinyl",
        },
    ]
    
    all_passed = True
    
    for test_case in test_cases:
        try:
            name = test_case.pop("name")
            result = calculate_quote(**test_case)
            
            if result.get("success"):
                quote = result["quote"]
                print(f"\n✅ {name}")
                print(f"   Quantity: {quote['quantity']} {quote['unit']}")
                print(f"   Unit Price: ₹{quote['unit_price']}")
                print(f"   Subtotal: ₹{quote['subtotal']}")
                print(f"   Discount: {quote['discount_percent']}% (-₹{quote['discount_amount']})")
                print(f"   After Discount: ₹{quote['subtotal_after_discount']}")
                print(f"   GST (18%): ₹{quote['gst_18_percent']}")
                print(f"   TOTAL: ₹{quote['total']}")
            else:
                print(f"❌ {name}: {result.get('error')}")
                all_passed = False
        
        except Exception as e:
            print(f"❌ Error in test case: {e}")
            all_passed = False
    
    return all_passed


def test_pdf_generation():
    """Test PDF generation"""
    print("\n" + "="*60)
    print("TEST 4: PDF Generation")
    print("="*60)
    
    try:
        # Calculate quote
        quote_result = calculate_quote(
            product_id="visiting_cards",
            size="90x50mm",
            quantity=500,
            paper_type="glossy"
        )
        
        if not quote_result.get("success"):
            print(f"❌ Quote calculation failed: {quote_result.get('error')}")
            return False
        
        # Generate PDF
        pdf_path = generate_quote_pdf(
            quote_result,
            "Raj Kumar",
            "raj@example.com"
        )
        
        if pdf_path and Path(pdf_path).exists():
            file_size = Path(pdf_path).stat().st_size
            print(f"✅ PDF generated successfully")
            print(f"   Path: {pdf_path}")
            print(f"   Size: {file_size} bytes")
            return True
        else:
            print(f"❌ PDF generation failed")
            return False
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_quote_logging():
    """Test quote logging"""
    print("\n" + "="*60)
    print("TEST 5: Quote Logging")
    print("="*60)
    
    try:
        # Calculate quote
        quote_result = calculate_quote(
            product_id="visiting_cards",
            size="90x50mm",
            quantity=500,
            paper_type="glossy"
        )
        
        # Generate PDF
        pdf_path = generate_quote_pdf(
            quote_result,
            "Priya Singh",
            "priya@example.com"
        )
        
        # Save to log
        save_quote_log(
            quote_result,
            "Priya Singh",
            "priya@example.com",
            pdf_path
        )
        
        # Get history
        history = get_quote_history(limit=5)
        
        print(f"✅ Quote logged successfully")
        print(f"   Total quotes in history: {len(history)}")
        
        if history:
            latest = history[0]
            print(f"   Latest quote:")
            print(f"      Client: {latest['client_name']}")
            print(f"      Product: {latest['product']}")
            print(f"      Total: ₹{latest['total']}")
        
        return True
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("PRINTING QUOTE GENERATOR - TEST SUITE")
    print("="*60)
    
    tests = [
        ("Available Products", test_available_products),
        ("Product Details", test_product_details),
        ("Quote Calculation", test_quote_calculation),
        ("PDF Generation", test_pdf_generation),
        ("Quote Logging", test_quote_logging),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ Test '{test_name}' failed with error: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Printing quote generator is ready!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check configuration.")
    
    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
