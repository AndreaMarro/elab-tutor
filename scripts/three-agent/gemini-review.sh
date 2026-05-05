#!/usr/bin/env bash
# Three-Agent Pipeline vendor #2 review: Gemini 2.5 Flash deep critique
# Iter 39 Step 1 — wrapper parità mistral-review.sh pattern.
#
# Auto-injects ELAB context preamble (M-AI-08) PRIMA briefing.
# Outputs JSON HIGH/MEDIUM/LOW findings stdout.
#
# Usage: ./gemini-review.sh <briefing-file> [model]
# Default model: gemini-2.5-flash (Pro Andrea sub).

set -euo pipefail

BRIEFING_FILE="${1:-}"
MODEL="${2:-gemini-2.5-flash}"

if [[ -z "$BRIEFING_FILE" ]]; then
  echo "Usage: $0 <briefing-file> [model]" >&2
  echo "  briefing-file: markdown file with atom briefing" >&2
  echo "  model: gemini-2.5-flash (default) | gemini-2.5-pro | gemini-3-flash-preview" >&2
  exit 1
fi

if [[ ! -f "$BRIEFING_FILE" ]]; then
  echo "Error: briefing file not found: $BRIEFING_FILE" >&2
  exit 2
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
INJECTOR="$REPO_ROOT/scripts/mechanisms/M-AI-08-vendor-context-injector.sh"

if [[ ! -x "$INJECTOR" ]]; then
  echo "Error: M-AI-08 injector missing or not executable: $INJECTOR" >&2
  exit 3
fi

# Inject ELAB context preamble + briefing
PROMPT="$(bash "$INJECTOR" "$BRIEFING_FILE" "Gemini DeepThink critique")"

# Append output schema directive
PROMPT="$PROMPT

---
Output ONLY JSON: {decision: accept|revise|reject, findings: [{severity:HIGH|MEDIUM|LOW, file_line, issue, fix}], critical_concern: 80_words}"

# Call Gemini CLI
echo "$PROMPT" | GEMINI_CLI_TRUST_WORKSPACE=true gemini -m "$MODEL" --skip-trust 2>&1
