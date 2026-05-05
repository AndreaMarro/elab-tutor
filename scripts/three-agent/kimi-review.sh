#!/usr/bin/env bash
# Three-Agent Pipeline vendor #4 review: Kimi K2.6 256K anti-bias
# Iter 39 Step 1 — wrapper parità mistral-review.sh pattern.
#
# Auto-injects ELAB context preamble (M-AI-08) PRIMA briefing.
# Specializza anti-bias check 256K context (catch findings 3-vendor missed).
# Outputs JSON anti-bias structure.
#
# Reads KIMI_API_KEY + KIMI_BASE_URL from ~/.elab-credentials.env (chmod 600).
# Endpoint: api.moonshot.ai/anthropic (international region — NOT cn).
# Model: kimi-k2.6 (256K context, multimodal, reasoning).
#
# Usage: ./kimi-review.sh <briefing-file>

set -euo pipefail

BRIEFING_FILE="${1:-}"

if [[ -z "$BRIEFING_FILE" ]]; then
  echo "Usage: $0 <briefing-file>" >&2
  echo "  briefing-file: markdown file with atom briefing" >&2
  exit 1
fi

if [[ ! -f "$BRIEFING_FILE" ]]; then
  echo "Error: briefing file not found: $BRIEFING_FILE" >&2
  exit 2
fi

if [[ -z "${KIMI_API_KEY:-}" ]]; then
  echo "Error: KIMI_API_KEY not loaded — source ~/.elab-credentials.env" >&2
  exit 3
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
INJECTOR="$REPO_ROOT/scripts/mechanisms/M-AI-08-vendor-context-injector.sh"

if [[ ! -x "$INJECTOR" ]]; then
  echo "Error: M-AI-08 injector missing or not executable: $INJECTOR" >&2
  exit 4
fi

# Inject ELAB context preamble + briefing
PROMPT="$(bash "$INJECTOR" "$BRIEFING_FILE" "Kimi K2.6 256K ANTI-BIAS REVIEW")

---
Anti-bias check 256K context:
1. Did Codex/Gemini/Mistral miss any critical Principio Zero violation?
2. Did they miss Morfismo Sense 2 coerenza issue (kit Omaric / volumi cartacei)?
3. NEW finding non identificato dai 3?
4. Reject consensus if violates CLAUDE.md principi.

Output JSON SOLO: {decision: accept|revise|reject_with_alternative, agreed_with_consensus: bool, new_finding: 80_words, rejected_concerns: [3_bullets], anti_bias_check: 60_words}"

KIMI_BASE="${KIMI_BASE_URL:-https://api.moonshot.ai/anthropic}"
KIMI_MODEL="${KIMI_MODEL:-kimi-k2.6}"

# Call Kimi K2.6 Anthropic-compat endpoint
RESPONSE=$(curl -s -X POST "$KIMI_BASE/v1/messages" \
  -H "x-api-key: $KIMI_API_KEY" \
  -H "content-type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d "$(jq -nR --arg msg "$PROMPT" --arg model "$KIMI_MODEL" '{model:$model,max_tokens:1500,messages:[{role:"user",content:$msg}]}')")

# Extract content text
echo "$RESPONSE" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    if 'content' in d and isinstance(d['content'], list) and len(d['content']) > 0:
        print(d['content'][0].get('text', '{\"error\":\"no_text\"}'))
    elif 'error' in d:
        print(json.dumps({'error': d['error']}))
    else:
        print(json.dumps({'error': 'no_content', 'raw': str(d)[:500]}))
except Exception as e:
    print(json.dumps({'error': f'parse_fail: {e}'}))
"
