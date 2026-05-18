#!/usr/bin/env python3
"""
Gemini CLI - Command Line Interface for Google Gemini AI
Simple and powerful CLI tool for interacting with Gemini models
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_colored(text, color):
    """Print colored text to terminal"""
    print(f"{color}{text}{Colors.RESET}")


def initialize_gemini():
    """Initialize Gemini API"""
    if not GEMINI_AVAILABLE:
        print_colored("Error: Gemini SDK not installed", Colors.RED)
        print_colored("Install it: pip install google-genai", Colors.YELLOW)
        sys.exit(1)

    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        print_colored("Error: GEMINI_API_KEY not configured", Colors.RED)
        print_colored("Get your API key from: https://makersuite.google.com/app/apikey", Colors.YELLOW)
        print_colored("Add it to mcp-server/.env file", Colors.YELLOW)
        sys.exit(1)

    try:
        model = create_gemini_model(GEMINI_API_KEY, GEMINI_MODEL)
        if not model:
            raise RuntimeError("Failed to initialize Gemini model")
        return model
    except Exception as e:
        print_colored(f"Error initializing Gemini: {e}", Colors.RED)
        sys.exit(1)


def chat_mode(model):
    """Interactive chat mode"""
    print_colored("\nGemini Chat Mode", Colors.BOLD + Colors.BLUE)
    print_colored("Type 'exit' or 'quit' to end chat\n", Colors.YELLOW)

    chat = model.start_chat(history=[])

    while True:
        try:
            user_input = input(f"{Colors.GREEN}You: {Colors.RESET}")

            if user_input.lower() in ["exit", "quit", "q"]:
                print_colored("\nGoodbye!", Colors.BLUE)
                break

            if not user_input.strip():
                continue

            print(f"{Colors.BLUE}Gemini: {Colors.RESET}", end="")
            response = chat.send_message(user_input)
            print(response.text)
            print()

        except KeyboardInterrupt:
            print_colored("\n\nChat ended", Colors.YELLOW)
            break
        except Exception as e:
            print_colored(f"\nError: {e}", Colors.RED)


def single_prompt(model, prompt):
    """Single prompt mode"""
    try:
        response = model.generate_content(prompt)
        print_colored("\nGemini Response:", Colors.BLUE)
        print(response.text)
    except Exception as e:
        print_colored(f"Error: {e}", Colors.RED)
        sys.exit(1)


def analyze_image(model, image_path, prompt="Describe this image"):
    """Analyze image with Gemini Vision"""
    try:
        from PIL import Image

        if not os.path.exists(image_path):
            print_colored(f"Error: Image not found: {image_path}", Colors.RED)
            sys.exit(1)

        img = Image.open(image_path)
        response = model.generate_content([prompt, img])

        print_colored("\nImage Analysis:", Colors.BLUE)
        print(response.text)

    except ImportError:
        print_colored("Error: Pillow not installed", Colors.RED)
        print_colored("Install it: pip install Pillow", Colors.YELLOW)
        sys.exit(1)
    except Exception as e:
        print_colored(f"Error: {e}", Colors.RED)
        sys.exit(1)


def show_help():
    """Show help message"""
    help_text = f"""
{Colors.BOLD}{Colors.BLUE}Gemini CLI - Google Gemini AI Command Line Interface{Colors.RESET}

{Colors.BOLD}Usage:{Colors.RESET}
  python gemini_cli.py [options]

{Colors.BOLD}Options:{Colors.RESET}
  {Colors.GREEN}chat{Colors.RESET}                    Start interactive chat mode
  {Colors.GREEN}prompt \"text\"{Colors.RESET}           Send single prompt
  {Colors.GREEN}image <path> [prompt]{Colors.RESET}   Analyze image
  {Colors.GREEN}help{Colors.RESET}                    Show this help message

{Colors.BOLD}Examples:{Colors.RESET}
  {Colors.YELLOW}# Interactive chat{Colors.RESET}
  python gemini_cli.py chat

  {Colors.YELLOW}# Single prompt{Colors.RESET}
  python gemini_cli.py prompt \"Explain quantum computing\"

  {Colors.YELLOW}# Analyze image{Colors.RESET}
  python gemini_cli.py image photo.jpg \"What's in this image?\"

{Colors.BOLD}Configuration:{Colors.RESET}
  API Key: Set GEMINI_API_KEY in mcp-server/.env
  Model: {GEMINI_MODEL}
  Get API key: https://makersuite.google.com/app/apikey
"""
    print(help_text)


def main():
    """Main CLI entry point"""
    if len(sys.argv) < 2:
        show_help()
        sys.exit(0)

    command = sys.argv[1].lower()

    if command in ["help", "-h", "--help"]:
        show_help()
        sys.exit(0)

    model = initialize_gemini()
    print_colored(f"Gemini initialized: {GEMINI_MODEL}", Colors.GREEN)

    if command == "chat":
        chat_mode(model)

    elif command == "prompt":
        if len(sys.argv) < 3:
            print_colored("Error: Prompt text required", Colors.RED)
            print_colored("Usage: python gemini_cli.py prompt \"your prompt here\"", Colors.YELLOW)
            sys.exit(1)
        prompt = " ".join(sys.argv[2:])
        single_prompt(model, prompt)

    elif command == "image":
        if len(sys.argv) < 3:
            print_colored("Error: Image path required", Colors.RED)
            print_colored("Usage: python gemini_cli.py image <path> [prompt]", Colors.YELLOW)
            sys.exit(1)

        image_path = sys.argv[2]
        prompt = " ".join(sys.argv[3:]) if len(sys.argv) > 3 else "Describe this image in detail"
        analyze_image(model, image_path, prompt)

    else:
        print_colored(f"Unknown command: {command}", Colors.RED)
        print_colored("Run 'python gemini_cli.py help' for usage", Colors.YELLOW)
        sys.exit(1)


if __name__ == "__main__":
    main()
