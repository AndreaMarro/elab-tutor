"""
Galileo Brain — Local Qwen3-4B routing via Ollama.

Shadow mode: runs in parallel with regex classifier, logs predictions,
does NOT control routing until explicitly activated.

Usage:
    brain = GalileoBrain()
    result = await brain.classify(message)
    # result = {"intent": "circuit", "entities": [...], "actions": [...], ...}
"""
import os
import json
import time
import asyncio
import httpx
from datetime import datetime

# ── Configuration ────────────────────────────────────────
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
BRAIN_MODEL = os.environ.get("BRAIN_MODEL", "galileo-brain")
BRAIN_MODE = os.environ.get("BRAIN_MODE", "shadow")  # "shadow" | "active" | "off"
BRAIN_TIMEOUT = float(os.environ.get("BRAIN_TIMEOUT", "5.0"))  # seconds

# Shadow mode log (in-memory, last 1000 predictions)
_shadow_log = []
_MAX_LOG = 1000


class GalileoBrain:
    """Local Brain router via Ollama API."""

    def __init__(self):
        self.url = f"{OLLAMA_URL}/api/chat"
        self.model = BRAIN_MODEL
        self.mode = BRAIN_MODE
        self.timeout = BRAIN_TIMEOUT
        self._available = None  # None = not checked yet

    async def is_available(self) -> bool:
        """Check if Ollama is running and model is loaded."""
        if self._available is not None:
            return self._available
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(f"{OLLAMA_URL}/api/tags")
                if resp.status_code == 200:
                    models = [m["name"] for m in resp.json().get("models", [])]
                    self._available = any(self.model in m for m in models)
                    if self._available:
                        print(f"[BRAIN] ✅ Model '{self.model}' available via Ollama")
                    else:
                        print(f"[BRAIN] ❌ Model '{self.model}' not found. Available: {models}")
                else:
                    self._available = False
        except Exception as e:
            print(f"[BRAIN] Ollama not reachable: {e}")
            self._available = False
        return self._available

    async def classify(self, message: str, system_prompt: str = None) -> dict | None:
        """Send message to Brain, get JSON routing response.

        Returns parsed JSON dict or None on failure.
        Enforced timeout ensures this never blocks the main routing path.
        """
        if self.mode == "off":
            return None

        if not await self.is_available():
            return None

        if system_prompt is None:
            system_prompt = (
                "Sei il BRAIN di ELAB Tutor. Rispondi SOLO in JSON con: "
                "intent, entities, actions, needs_llm, response, llm_hint."
            )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            "stream": False,
            "options": {
                "temperature": 0.1,
                "top_p": 0.95,
                "num_predict": 512,
            },
        }

        start = time.monotonic()
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(self.url, json=payload)
                elapsed_ms = (time.monotonic() - start) * 1000

                if resp.status_code != 200:
                    print(f"[BRAIN] Ollama error {resp.status_code}: {resp.text[:100]}")
                    return None

                content = resp.json().get("message", {}).get("content", "")
                parsed = self._parse_json(content)

                if parsed:
                    parsed["_brain_latency_ms"] = round(elapsed_ms, 1)
                    print(f"[BRAIN] {self.mode} | intent={parsed.get('intent')} | {elapsed_ms:.0f}ms")

                return parsed

        except asyncio.TimeoutError:
            elapsed_ms = (time.monotonic() - start) * 1000
            print(f"[BRAIN] Timeout after {elapsed_ms:.0f}ms")
            return None
        except Exception as e:
            print(f"[BRAIN] Error: {e}")
            return None

    def _parse_json(self, content: str) -> dict | None:
        """Extract JSON from Brain response, handling thinking tokens."""
        content = content.strip()

        # Direct JSON
        if content.startswith("{"):
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                # Try first line only
                try:
                    return json.loads(content.split("\n")[0])
                except:
                    pass

        # Find first { in response (skip thinking tokens)
        idx = content.find("{")
        if idx >= 0:
            try:
                return json.loads(content[idx:])
            except json.JSONDecodeError:
                try:
                    return json.loads(content[idx:].split("\n")[0])
                except:
                    pass

        print(f"[BRAIN] JSON parse failed: {content[:100]}...")
        return None

    async def shadow_classify(self, message: str, regex_intent: str) -> dict | None:
        """Shadow mode: classify and log comparison with regex classifier.

        Does NOT affect routing — only logs for monitoring.
        Returns Brain prediction or None.
        """
        if self.mode != "shadow":
            return None

        brain_result = await self.classify(message)
        if brain_result is None:
            return None

        brain_intent = brain_result.get("intent", "?")
        match = brain_intent == regex_intent

        entry = {
            "ts": datetime.utcnow().isoformat(),
            "message": message[:100],
            "regex_intent": regex_intent,
            "brain_intent": brain_intent,
            "match": match,
            "latency_ms": brain_result.get("_brain_latency_ms", 0),
        }

        _shadow_log.append(entry)
        if len(_shadow_log) > _MAX_LOG:
            _shadow_log.pop(0)

        if not match:
            print(f"[BRAIN] ⚠️  MISMATCH: regex={regex_intent} brain={brain_intent} "
                  f"msg='{message[:50]}...'")

        return brain_result

    def get_shadow_stats(self) -> dict:
        """Get shadow mode comparison statistics."""
        if not _shadow_log:
            return {"total": 0, "match_rate": 0, "mismatches": []}

        total = len(_shadow_log)
        matches = sum(1 for e in _shadow_log if e["match"])
        avg_latency = sum(e["latency_ms"] for e in _shadow_log) / total

        # Recent mismatches for debugging
        mismatches = [e for e in _shadow_log if not e["match"]][-10:]

        return {
            "total": total,
            "matches": matches,
            "match_rate": round(100 * matches / total, 1),
            "avg_latency_ms": round(avg_latency, 1),
            "recent_mismatches": mismatches,
            "mode": self.mode,
        }


# ── Singleton ────────────────────────────────────────────
_brain_instance = None


def get_brain() -> GalileoBrain:
    """Get or create singleton Brain instance."""
    global _brain_instance
    if _brain_instance is None:
        _brain_instance = GalileoBrain()
    return _brain_instance
