#!/usr/bin/env python3
"""
Quick test script for Gemini CLI
Tests if Gemini is properly configured
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

# Load environment
load_dotenv(Path(__file__).parent / ".env")


def test_gemini():
    """Test Gemini configuration"""
    print("Testing Gemini CLI Setup...\n")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        print("GEMINI_API_KEY not configured")
        print("Get your API key from: https://makersuite.google.com/app/apikey")
        print("Add it to mcp-server/.env file")
        return False

    print(f"API Key found: {api_key[:20]}...")

    if not GEMINI_AVAILABLE:
        print("Gemini SDK not installed")
        print("Install it: pip install google-genai")
        return False

    try:
        model = create_gemini_model(api_key, os.getenv("GEMINI_MODEL", "gemini-2.5-flash"))
        if not model:
            raise RuntimeError("Failed to initialize model")

        print("Testing API connection...")
        response = model.generate_content("Say 'Hello from Gemini!' in one line")

        print(f"API working! Response: {response.text[:50]}...")
        print("\nAll tests passed! Gemini CLI is ready to use.")
        print("\nUsage:")
        print("   python gemini_cli.py chat          # Interactive chat")
        print("   python gemini_cli.py prompt \"hi\"   # Single prompt")
        print("   python gemini_cli.py help          # Show help")
        return True

    except Exception as e:
        print(f"API test failed: {e}")
        print("Check your API key and internet connection")
        return False


if __name__ == "__main__":
    success = test_gemini()
    sys.exit(0 if success else 1)
