"""
Gemini compatibility layer.

Primary backend: google.genai (new SDK)
Fallback backend: google.generativeai (legacy SDK, warning-suppressed)
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional
import warnings

GEMINI_AVAILABLE = False
_BACKEND = None

_new_genai = None
_new_types = None
_legacy_genai = None

try:
    from google import genai as _new_genai  # type: ignore
    from google.genai import types as _new_types  # type: ignore
    GEMINI_AVAILABLE = True
    _BACKEND = "new"
except Exception:
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", FutureWarning)
            import google.generativeai as _legacy_genai  # type: ignore
        GEMINI_AVAILABLE = True
        _BACKEND = "legacy"
    except Exception:
        GEMINI_AVAILABLE = False
        _BACKEND = None


@dataclass
class GeminiResponse:
    text: str
    raw: Any = None


def _extract_text_new(response: Any) -> str:
    text = getattr(response, "text", None)
    if text:
        return text

    candidates = getattr(response, "candidates", None) or []
    parts: List[str] = []
    for candidate in candidates:
        content = getattr(candidate, "content", None)
        if content is None:
            continue
        content_parts = getattr(content, "parts", None) or []
        for part in content_parts:
            part_text = getattr(part, "text", None)
            if part_text:
                parts.append(part_text)
    return "\n".join(parts).strip()


def _normalize_part(part: Any) -> Any:
    if isinstance(part, dict):
        return part
    if isinstance(part, str):
        return {"text": part}
    if _new_types and hasattr(part, "size") and hasattr(part, "mode"):
        try:
            return _new_types.Part.from_image(image=part)
        except Exception:
            return {"text": str(part)}
    return {"text": str(part)}


def _normalize_contents(contents: Any) -> Any:
    if isinstance(contents, str):
        return contents

    if isinstance(contents, dict):
        role = contents.get("role", "user")
        parts = contents.get("parts")
        if parts is None:
            parts = [contents.get("content", "")]
        return {"role": role, "parts": [_normalize_part(p) for p in parts]}

    if isinstance(contents, (list, tuple)):
        normalized = []
        for item in contents:
            if isinstance(item, dict) and "role" in item:
                normalized.append(_normalize_contents(item))
            elif isinstance(item, str):
                normalized.append(item)
            elif _new_types and hasattr(item, "size") and hasattr(item, "mode"):
                try:
                    normalized.append(_new_types.Part.from_image(image=item))
                except Exception:
                    normalized.append(str(item))
            else:
                normalized.append(item)
        return normalized

    return str(contents)


def _build_config(generation_config: Optional[Dict[str, Any]]) -> Any:
    if not generation_config:
        return None
    if _new_types:
        try:
            return _new_types.GenerateContentConfig(**generation_config)
        except Exception:
            return generation_config
    return generation_config


class GeminiChatCompat:
    def __init__(self, model: "GeminiModelCompat", history: Optional[List[Dict[str, Any]]] = None):
        self._model = model
        self._history = [_normalize_contents(h) for h in (history or [])]

        self._legacy_chat = None
        if model.backend == "legacy":
            self._legacy_chat = model._legacy_model.start_chat(history=history or [])

    def send_message(self, message: str, generation_config: Optional[Dict[str, Any]] = None) -> GeminiResponse:
        if self._model.backend == "legacy":
            raw = self._legacy_chat.send_message(message, generation_config=generation_config)
            return GeminiResponse(text=getattr(raw, "text", "") or "", raw=raw)

        user_turn = {"role": "user", "parts": [{"text": message}]}
        convo = list(self._history) + [user_turn]
        kwargs = {
            "model": self._model.model_name,
            "contents": convo,
        }
        config = _build_config(generation_config)
        if self._model.system_instruction and self._model.backend == "new":
            config_data = dict(generation_config or {})
            config_data.setdefault("system_instruction", self._model.system_instruction)
            config = _build_config(config_data)
        if config is not None:
            kwargs["config"] = config

        try:
            raw = self._model._client.models.generate_content(**kwargs)
        except TypeError:
            kwargs.pop("config", None)
            raw = self._model._client.models.generate_content(**kwargs)

        text = _extract_text_new(raw)
        self._history.append(user_turn)
        self._history.append({"role": "model", "parts": [{"text": text}]})
        return GeminiResponse(text=text, raw=raw)


class GeminiModelCompat:
    def __init__(self, api_key: str, model_name: str, system_instruction: str | None = None):
        self.model_name = model_name
        self.backend = _BACKEND
        self.system_instruction = system_instruction

        self._client = None
        self._legacy_model = None

        if self.backend == "new":
            self._client = _new_genai.Client(api_key=api_key)
        elif self.backend == "legacy":
            _legacy_genai.configure(api_key=api_key)
            kwargs = {"model_name": model_name}
            if system_instruction:
                kwargs["system_instruction"] = system_instruction
            self._legacy_model = _legacy_genai.GenerativeModel(**kwargs)
        else:
            raise RuntimeError("Gemini SDK is not available")

    def generate_content(self, contents: Any, generation_config: Optional[Dict[str, Any]] = None) -> GeminiResponse:
        if self.backend == "legacy":
            raw = self._legacy_model.generate_content(
                contents,
                generation_config=generation_config,
            )
            return GeminiResponse(text=getattr(raw, "text", "") or "", raw=raw)

        kwargs = {
            "model": self.model_name,
            "contents": _normalize_contents(contents),
        }
        config = _build_config(generation_config)
        if self.system_instruction and self.backend == "new":
            config_data = dict(generation_config or {})
            config_data.setdefault("system_instruction", self.system_instruction)
            config = _build_config(config_data)
        if config is not None:
            kwargs["config"] = config

        try:
            raw = self._client.models.generate_content(**kwargs)
        except TypeError:
            kwargs.pop("config", None)
            raw = self._client.models.generate_content(**kwargs)

        return GeminiResponse(text=_extract_text_new(raw), raw=raw)

    def start_chat(self, history: Optional[List[Dict[str, Any]]] = None) -> GeminiChatCompat:
        return GeminiChatCompat(self, history=history)


def create_gemini_model(api_key: str, model_name: str, system_instruction: str | None = None) -> Optional[GeminiModelCompat]:
    if not GEMINI_AVAILABLE or not api_key:
        return None
    try:
        return GeminiModelCompat(api_key=api_key, model_name=model_name, system_instruction=system_instruction)
    except Exception:
        return None
