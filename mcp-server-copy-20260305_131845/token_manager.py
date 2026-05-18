"""
Token Management & Context Compression
Prevents context overflow and controls AI costs
"""

from collections import defaultdict
from typing import List, Dict, Optional
import json

# ============================================================================
# CONFIGURATION
# ============================================================================

MAX_HISTORY_MESSAGES = 20  # Maximum messages to keep in history
MAX_TOKENS_PER_CONVERSATION = 4000  # Maximum tokens per conversation
MAX_OUTPUT_TOKENS = 800  # Maximum tokens in AI response
TOKENS_PER_CHAR = 0.25  # Rough estimation: 1 token ≈ 4 characters

# ============================================================================
# TOKEN MANAGER CLASS
# ============================================================================

class TokenManager:
    """
    Manage conversation tokens and prevent context overflow
    """
    
    def __init__(
        self,
        max_tokens: int = MAX_TOKENS_PER_CONVERSATION,
        max_messages: int = MAX_HISTORY_MESSAGES
    ):
        self.max_tokens = max_tokens
        self.max_messages = max_messages
        self.conversations = defaultdict(list)
        self.token_usage = defaultdict(int)
    
    def estimate_tokens(self, text: str) -> int:
        """
        Estimate token count from text
        Rough estimation: 1 token ≈ 4 characters
        """
        return int(len(text) * TOKENS_PER_CHAR)
    
    def add_message(
        self,
        user_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict] = None
    ):
        """
        Add message to conversation history
        
        Args:
            user_id: User identifier
            role: Message role (system, user, assistant)
            content: Message content
            metadata: Optional metadata
        """
        tokens = self.estimate_tokens(content)
        
        message = {
            "role": role,
            "content": content,
            "tokens": tokens,
            "metadata": metadata or {}
        }
        
        self.conversations[user_id].append(message)
        self.token_usage[user_id] += tokens
        
        # Trim if needed
        self._trim_conversation(user_id)
    
    def _trim_conversation(self, user_id: str):
        """
        Trim conversation to stay within limits
        Keeps system message and recent messages
        """
        messages = self.conversations[user_id]
        
        # Check message count limit
        if len(messages) > self.max_messages:
            # Keep system message (if exists) and recent messages
            system_messages = [msg for msg in messages if msg["role"] == "system"]
            other_messages = [msg for msg in messages if msg["role"] != "system"]
            
            # Keep last N messages
            keep_count = self.max_messages - len(system_messages)
            trimmed = system_messages + other_messages[-keep_count:]
            
            self.conversations[user_id] = trimmed
            self._recalculate_tokens(user_id)
        
        # Check token limit
        while self.token_usage[user_id] > self.max_tokens and len(self.conversations[user_id]) > 2:
            # Remove oldest non-system message
            messages = self.conversations[user_id]
            for i, msg in enumerate(messages):
                if msg["role"] != "system":
                    removed = messages.pop(i)
                    self.token_usage[user_id] -= removed["tokens"]
                    break
    
    def _recalculate_tokens(self, user_id: str):
        """Recalculate total tokens for user"""
        self.token_usage[user_id] = sum(
            msg["tokens"] for msg in self.conversations[user_id]
        )
    
    def get_conversation(
        self,
        user_id: str,
        include_metadata: bool = False
    ) -> List[Dict]:
        """
        Get conversation history for AI API
        
        Args:
            user_id: User identifier
            include_metadata: Whether to include metadata
        
        Returns:
            List of messages in format: [{"role": "user", "content": "..."}]
        """
        if include_metadata:
            return self.conversations[user_id]
        else:
            return [
                {"role": msg["role"], "content": msg["content"]}
                for msg in self.conversations[user_id]
            ]
    
    def get_token_usage(self, user_id: str) -> Dict:
        """
        Get token usage statistics for user
        
        Returns:
            {
                "total_tokens": int,
                "max_tokens": int,
                "remaining_tokens": int,
                "message_count": int,
                "max_messages": int
            }
        """
        return {
            "total_tokens": self.token_usage[user_id],
            "max_tokens": self.max_tokens,
            "remaining_tokens": max(0, self.max_tokens - self.token_usage[user_id]),
            "message_count": len(self.conversations[user_id]),
            "max_messages": self.max_messages,
            "usage_percentage": round(
                (self.token_usage[user_id] / self.max_tokens) * 100, 1
            )
        }
    
    def clear_conversation(self, user_id: str):
        """Clear conversation history for user"""
        self.conversations[user_id] = []
        self.token_usage[user_id] = 0
    
    def summarize_and_compress(self, user_id: str) -> str:
        """
        Summarize old messages to compress context
        
        Returns:
            Summary text
        """
        messages = self.conversations[user_id]
        
        if len(messages) <= 5:
            return ""
        
        # Get messages to summarize (exclude recent 5)
        to_summarize = messages[:-5]
        
        # Create simple summary
        summary_parts = []
        for msg in to_summarize:
            if msg["role"] == "user":
                summary_parts.append(f"User asked: {msg['content'][:100]}")
            elif msg["role"] == "assistant":
                summary_parts.append(f"Assistant replied: {msg['content'][:100]}")
        
        summary = "Previous conversation summary:\n" + "\n".join(summary_parts)
        
        # Replace old messages with summary
        system_messages = [msg for msg in messages if msg["role"] == "system"]
        recent_messages = messages[-5:]
        
        summary_message = {
            "role": "system",
            "content": summary,
            "tokens": self.estimate_tokens(summary),
            "metadata": {"type": "summary"}
        }
        
        self.conversations[user_id] = system_messages + [summary_message] + recent_messages
        self._recalculate_tokens(user_id)
        
        return summary
    
    def should_compress(self, user_id: str) -> bool:
        """Check if conversation should be compressed"""
        usage = self.get_token_usage(user_id)
        return usage["usage_percentage"] > 80  # Compress at 80% usage


# ============================================================================
# GLOBAL TOKEN MANAGER INSTANCE
# ============================================================================

token_manager = TokenManager()


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def cap_output_tokens(max_tokens: int = MAX_OUTPUT_TOKENS) -> int:
    """
    Get capped output token limit for AI calls
    
    Usage:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=cap_output_tokens()
        )
    """
    return min(max_tokens, MAX_OUTPUT_TOKENS)


def estimate_cost(tokens: int, model: str = "groq") -> float:
    """
    Estimate cost for token usage
    
    Args:
        tokens: Number of tokens
        model: Model provider (groq, openai, gemini)
    
    Returns:
        Estimated cost in USD
    """
    # Rough cost estimates (per 1M tokens)
    costs = {
        "groq": 0.10,  # Very cheap
        "gemini": 0.15,  # gemini-pro
        "minmax": 0.20   # estimated
    }
    
    cost_per_million = costs.get(model, 0.50)
    return (tokens / 1_000_000) * cost_per_million


# ============================================================================
# CONVERSATION CONTEXT BUILDER
# ============================================================================

class ConversationContext:
    """Build optimized conversation context for AI"""
    
    @staticmethod
    def build_context(
        system_prompt: str,
        user_message: str,
        conversation_history: List[Dict],
        max_history: int = 5
    ) -> List[Dict]:
        """
        Build optimized conversation context
        
        Args:
            system_prompt: System prompt
            user_message: Current user message
            conversation_history: Previous messages
            max_history: Maximum history messages to include
        
        Returns:
            Optimized message list for AI
        """
        messages = []
        
        # Add system prompt
        messages.append({
            "role": "system",
            "content": system_prompt
        })
        
        # Add recent conversation history
        if conversation_history:
            recent_history = conversation_history[-max_history:]
            messages.extend(recent_history)
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        return messages


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
USAGE IN server.py:

from token_manager import (
    token_manager, cap_output_tokens, estimate_cost,
    ConversationContext
)

# Example 1: Basic conversation management
@mcp.tool()
def chat(message: str, user_id: str = "default"):
    # Add user message
    token_manager.add_message(user_id, "user", message)
    
    # Check if compression needed
    if token_manager.should_compress(user_id):
        summary = token_manager.summarize_and_compress(user_id)
        logger.info("conversation_compressed", f"Compressed conversation", 
                   user_id=user_id, summary_length=len(summary))
    
    # Get conversation for AI
    conversation = token_manager.get_conversation(user_id)
    
    # Call AI with token limit
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=conversation,
        max_tokens=cap_output_tokens(),  # Capped at 800
        temperature=0.4
    )
    
    reply = response.choices[0].message.content
    
    # Add assistant response
    token_manager.add_message(user_id, "assistant", reply)
    
    # Log token usage
    usage = token_manager.get_token_usage(user_id)
    logger.info("token_usage", "Conversation tokens", **usage)
    
    return {"reply": reply, "token_usage": usage}


# Example 2: Build optimized context
@mcp.tool()
def chat_with_context(message: str, user_id: str = "default"):
    system_prompt = "You are a helpful AI assistant for CodeSunny."
    
    # Get conversation history
    history = token_manager.get_conversation(user_id)
    
    # Build optimized context
    messages = ConversationContext.build_context(
        system_prompt,
        message,
        history,
        max_history=5  # Only last 5 messages
    )
    
    # Call AI
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=cap_output_tokens()
    )
    
    return response


# Example 3: Monitor costs
def get_conversation_cost(user_id: str):
    usage = token_manager.get_token_usage(user_id)
    cost = estimate_cost(usage["total_tokens"], "groq")
    
    return {
        "tokens": usage["total_tokens"],
        "estimated_cost_usd": cost,
        "estimated_cost_inr": cost * 83  # Rough conversion
    }


# Example 4: Clear old conversations
def cleanup_old_conversations():
    # Clear conversations older than 1 hour
    # (You'd need to track timestamps for this)
    pass
"""

print("✅ Token Manager Loaded")
print(f"   - Max tokens per conversation: {MAX_TOKENS_PER_CONVERSATION}")
print(f"   - Max messages: {MAX_HISTORY_MESSAGES}")
print(f"   - Max output tokens: {MAX_OUTPUT_TOKENS}")
print("   - Auto-compression at 80% usage")
print("   - Cost estimation")
