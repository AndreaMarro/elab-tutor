#!/bin/bash
# M-AI-05 — Multi-vote G45 gate (anti-inflation mechanism)
#
# Iter close gate: REJECT score claim IF <4 vendor votes present.
# Source: plan doc §6.3 Atom 3.3 + frammenti chat M-AI-NEW-8.
#
# Usage: bash scripts/mechanisms/M-AI-05-multi-vote-G45-gate.sh <iter-N>
#
# Reads: docs/audits/g45-multi-vote-iter-{N}/vote-{vendor}.md (1+ files)
# Validates: ≥4 vendor present
# Computes: aggregate via scripts/g45/multi-vote-aggregator-manual.mjs
# Output: stdout result + exit code
#
# Exit codes:
#   0 = PASS consensus spread <=1.5
#   2 = RE-PROMPT spread >1.5 <=2.5 (disagreement context required)
#   1 = ESCALATE Andrea (severe spread OR <4 vendors)
#
# Anti-pattern G45 enforced:
#   - REJECT iter close score claim WITHOUT 4-vendor consensus
#   - APPLY bias correction (provider-bias-matrix.json)
#   - LOG firing → automa/state/mechanism-firing-log.jsonl

set -euo pipefail

ITER="${1:-}"
if [ -z "$ITER" ]; then
  echo "Usage: $0 <iter-N>" >&2
  echo "Example: $0 32" >&2
  exit 1
fi

VOTE_DIR="docs/audits/g45-multi-vote-iter-${ITER}"

if [ ! -d "$VOTE_DIR" ]; then
  echo "[M-AI-05 FAIL] vote dir $VOTE_DIR not found — iter $ITER NOT validated multi-vote G45" >&2
  echo "  Action: spawn 4+ vendor vote agents, paste results vote-{vendor}.md, retry mechanism" >&2
  echo "  Required: vote-claude.md + vote-codex.md + vote-gemini.md + vote-kimi.md OR vote-mistral.md" >&2
  exit 1
fi

VOTE_COUNT=$(ls "$VOTE_DIR"/vote-*.md 2>/dev/null | wc -l | tr -d ' ')

if [ "$VOTE_COUNT" -lt 4 ]; then
  echo "[M-AI-05 FAIL] insufficient vendor votes: got $VOTE_COUNT/4 minimum" >&2
  echo "  Vendors present: $(ls "$VOTE_DIR"/vote-*.md 2>/dev/null | sed 's|.*/vote-||;s|.md||' | tr '\n' ',' | sed 's/,$//')" >&2
  echo "  Action: spawn additional vendor vote agents to reach 4+ minimum" >&2
  # Append firing log
  mkdir -p automa/state
  echo "{\"date\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"mechanism\":\"M-AI-05\",\"iter\":\"$ITER\",\"fired\":true,\"reason\":\"insufficient_vendors_${VOTE_COUNT}_of_4\"}" >> automa/state/mechanism-firing-log.jsonl
  exit 1
fi

echo "[M-AI-05] $VOTE_COUNT/$VOTE_COUNT+ vendor votes present — proceeding aggregator"

if [ ! -x "scripts/g45/multi-vote-aggregator-manual.mjs" ]; then
  echo "[M-AI-05 FAIL] aggregator script missing or not executable" >&2
  echo "  Required: scripts/g45/multi-vote-aggregator-manual.mjs (chmod +x)" >&2
  exit 1
fi

set +e
node scripts/g45/multi-vote-aggregator-manual.mjs "$VOTE_DIR"
AGG_EXIT=$?
set -e

# Append firing log
mkdir -p automa/state
case "$AGG_EXIT" in
  0) DECISION="PASS" ;;
  2) DECISION="RE-PROMPT" ;;
  *) DECISION="ESCALATE" ;;
esac
echo "{\"date\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"mechanism\":\"M-AI-05\",\"iter\":\"$ITER\",\"fired\":true,\"vendors\":$VOTE_COUNT,\"decision\":\"$DECISION\"}" >> automa/state/mechanism-firing-log.jsonl

exit $AGG_EXIT
