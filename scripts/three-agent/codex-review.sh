#!/usr/bin/env bash
# Three-Agent Pipeline vendor #1 review: Codex CLI implementation/critique
# Iter 39 Step 1 — wrapper parità mistral-review.sh pattern.
#
# Auto-injects ELAB context preamble (M-AI-08) PRIMA briefing.
# Outputs raw code OR JSON findings depending on briefing instruction.
#
# Usage: ./codex-review.sh <briefing-file> [mode]
# Modes: implement (default) | review | finalize
#
# Reads ChatGPT Plus quota Andrea (no API key — OAuth via codex CLI).

set -euo pipefail

BRIEFING_FILE="${1:-}"
MODE="${2:-implement}"

if [[ -z "$BRIEFING_FILE" ]]; then
  echo "Usage: $0 <briefing-file> [mode]" >&2
  echo "  briefing-file: markdown file with atom briefing" >&2
  echo "  mode: implement (default) | review | finalize" >&2
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

# Mode-specific round label + output directive
case "$MODE" in
  implement)
    ROUND_LABEL="Codex IMPLEMENT (Round 1 CEGIS)"
    DIRECTIVE="Output codice implementation per atom. Format pulito + commenti italiani docente."
    ;;
  review)
    ROUND_LABEL="Codex REVIEW (Round 2 critique)"
    DIRECTIVE="Output JSON: {decision: accept|revise|reject, findings: [{severity, file_line, issue, fix}], summary}"
    ;;
  finalize)
    ROUND_LABEL="Codex ITER 2 FINALIZE (Round 5 CEGIS)"
    DIRECTIVE="Output codice COMPLETE integrato findings (NO diffs, full file content)."
    ;;
  *)
    echo "Error: invalid mode '$MODE'. Use: implement | review | finalize" >&2
    exit 1
    ;;
esac

# Inject ELAB context preamble + briefing
PROMPT="$(bash "$INJECTOR" "$BRIEFING_FILE" "$ROUND_LABEL")

---
$DIRECTIVE"

# Call Codex CLI
echo "$PROMPT" | codex exec --skip-git-repo-check 2>&1
