#!/usr/bin/env bash
# Three-Agent Pipeline step 2 vendor #3: Mistral La Plateforme review
# Usage: ./mistral-review.sh <prompt-file> [model]
# Default model: mistral-small-latest (cheap, 32K context, ~$0.0007/1k tokens)
# Alternatives: mistral-medium-latest (~$0.0027/1k), mistral-large-latest (~$0.008/1k)
#
# Reads MISTRAL_API_KEY from env (Andrea Scale tier €18/mo subscription).
# Outputs JSON response to stdout. Errors to stderr.
#
# Iter 36 close prep: step 2 hybrid 3-vendor cycle (Codex + Gemini + Mistral).
# Andrea explicit ratify: Mistral La Plateforme primary review vendor #3 (already integrated ELAB prod).

set -euo pipefail

PROMPT_FILE="${1:-}"
MODEL="${2:-mistral-small-latest}"

if [[ -z "$PROMPT_FILE" ]]; then
  echo "Usage: $0 <prompt-file> [model]" >&2
  echo "  prompt-file: path to file containing the review prompt (markdown OR plain text)" >&2
  echo "  model: mistral-small-latest (default) | mistral-medium-latest | mistral-large-latest" >&2
  exit 1
fi

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Error: prompt file not found: $PROMPT_FILE" >&2
  exit 2
fi

if [[ -z "${MISTRAL_API_KEY:-}" ]]; then
  echo "Error: MISTRAL_API_KEY env var required (Andrea Scale tier sub)" >&2
  echo "  Set via: export MISTRAL_API_KEY=\"...\"  (NOT printed conversation per security)" >&2
  exit 3
fi

PROMPT_CONTENT=$(cat "$PROMPT_FILE")

# JSON-escape prompt (newlines + quotes + backslashes via jq)
if ! command -v jq &>/dev/null; then
  echo "Error: jq required for JSON encoding (brew install jq)" >&2
  exit 4
fi

REQUEST_BODY=$(jq -n \
  --arg model "$MODEL" \
  --arg content "$PROMPT_CONTENT" \
  '{
    model: $model,
    messages: [
      {role: "system", content: "You are a code reviewer. Output ONLY structured JSON findings: {HIGH:[...], MEDIUM:[...], LOW:[...]}. Each finding includes title, file_line, issue, suggested_fix. NO prose intro/outro."},
      {role: "user", content: $content}
    ],
    temperature: 0.2,
    max_tokens: 4096,
    response_format: {type: "json_object"}
  }')

RESPONSE=$(curl -sS \
  -X POST https://api.mistral.ai/v1/chat/completions \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$REQUEST_BODY")

# Extract content from Mistral response (choices[0].message.content)
if echo "$RESPONSE" | jq -e '.error' >/dev/null 2>&1; then
  echo "Mistral API error:" >&2
  echo "$RESPONSE" | jq '.error' >&2
  exit 5
fi

CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content // empty')

if [[ -z "$CONTENT" ]]; then
  echo "Error: empty Mistral response content" >&2
  echo "Raw response:" >&2
  echo "$RESPONSE" >&2
  exit 6
fi

# Output structured JSON to stdout for pipe consumption
echo "$CONTENT"
