#!/usr/bin/env bash
# M-AI-08 Vendor Context Injector (iter 39 Step 1, anti-inflation)
#
# Helper script enforcing ELAB context preamble injection PRIMA OGNI vendor call.
# Reads scripts/three-agent/elab-context-preamble.md + atom briefing,
# concatenates them, and outputs unified prompt ready per vendor stdin.
#
# Used by:
# - M-AI-07 multi-vendor-anti-bias.sh (Round 1-5 vendor calls)
# - Wrapper scripts: kimi-review.sh, gemini-review.sh, codex-review.sh, mistral-review.sh
# - Standalone manual vendor calls
#
# Anti-pattern enforce:
# - Preamble missing → exit 2 (block vendor call)
# - Briefing empty → exit 3
# - Output stdin format clean (preamble + separator + briefing)
#
# Usage:
#   bash scripts/mechanisms/M-AI-08-vendor-context-injector.sh <briefing-file> [round-label]
#   echo "$(bash M-AI-08...)" | <vendor-cli>

set -euo pipefail

BRIEFING_FILE="${1:-}"
ROUND_LABEL="${2:-}"

if [[ -z "$BRIEFING_FILE" ]]; then
  echo "Usage: $0 <briefing-file> [round-label]" >&2
  echo "  briefing-file: markdown file with atom briefing" >&2
  echo "  round-label: optional Round N descriptor (e.g., '1 IMPLEMENT', '2 CRITIQUE')" >&2
  exit 1
fi

if [[ ! -f "$BRIEFING_FILE" ]]; then
  echo "Error: briefing file not found: $BRIEFING_FILE" >&2
  exit 3
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
PREAMBLE="$REPO_ROOT/scripts/three-agent/elab-context-preamble.md"

if [[ ! -f "$PREAMBLE" ]]; then
  echo "Error: ELAB context preamble missing: $PREAMBLE" >&2
  echo "Cannot proceed without context (anti-inflation enforce)." >&2
  exit 2
fi

# Output unified prompt to stdout
cat "$PREAMBLE"
echo ""
echo "---"
echo ""
if [[ -n "$ROUND_LABEL" ]]; then
  echo "# Round $ROUND_LABEL"
  echo ""
fi
cat "$BRIEFING_FILE"
