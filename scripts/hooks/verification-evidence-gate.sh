#!/usr/bin/env bash
# verification-evidence-gate.sh — Iter 41 anti-inflation Stop hook
#
# Purpose: mechanical anti-inflation gate per superpowers:verification-before-completion
# Pattern: blocca close se ultimo summary contiene score >= 7 ma manca pattern
#          [Run: <command>] [See: <output evidence>] in last 3 transcript turns
#
# Anti-pattern caught:
# - G43 self-score 8.6 → real 6.4 (no bracketed evidence)
# - G45 self-score 8.6 → real 5.8 (no bracketed evidence)
# - iter 39 inflation pattern (handoff doc-drift mammoth false alarm)
#
# Wire-up:
#   .claude/settings.local.json
#   {"hooks":{"Stop":[{"matcher":"*","hooks":[
#     {"type":"command","command":"bash scripts/hooks/verification-evidence-gate.sh"}
#   ]}]}}
#
# Exit codes:
#   0 — pass (no inflation flag OR evidence present)
#   2 — block (Stop blocked, ask user to verify before close)
#
# Reference:
#   docs/audits/2026-05-05-iter-41-OPTIMAL-WORKFLOW-synthesis.md §2 §10

set -euo pipefail

# Read transcript from environment (set by harness)
TRANSCRIPT_FILE="${CLAUDE_TRANSCRIPT_PATH:-/dev/null}"

# Defensive: if transcript not available, pass (don't block when can't read)
if [[ ! -f "$TRANSCRIPT_FILE" ]]; then
  exit 0
fi

# Last ~3000 chars of transcript (covers ~3 turns)
LAST_TURNS=$(tail -c 3000 "$TRANSCRIPT_FILE" 2>/dev/null || echo "")

# Pattern 1: numeric score in claim (e.g., "8.6/10", "9.0/10", "score 8.5")
SCORE_PATTERN='[Ss]core[[:space:]]*[:=]?[[:space:]]*([7-9]\.[0-9]|10\.0|[7-9])'
HAS_HIGH_SCORE=$(echo "$LAST_TURNS" | grep -E "$SCORE_PATTERN" || echo "")

if [[ -z "$HAS_HIGH_SCORE" ]]; then
  # No high score claim → no inflation risk
  exit 0
fi

# Pattern 2: bracketed evidence required when score >= 7
EVIDENCE_PATTERN='\[(Run|See|Verified|File|Test|Curl|HTTP|Bench|Hash):'
HAS_EVIDENCE=$(echo "$LAST_TURNS" | grep -E "$EVIDENCE_PATTERN" || echo "")

if [[ -z "$HAS_EVIDENCE" ]]; then
  cat >&2 <<'EOF'
⚠️  VERIFICATION EVIDENCE GATE — BLOCKED
Last 3 turns contain score >= 7 BUT NO bracketed evidence pattern found.

Required evidence pattern: [Run: <cmd>] [See: <output>] [File: <path>] [Hash: <sha>]
                          [Test: <name>] [Curl: <url>] [HTTP: <code>] [Bench: <metric>]

Anti-pattern G45 enforce — historical inflation:
  G43: self-score 8.6 → real 6.4 (no evidence)
  G45: self-score 8.6 → real 5.8 (no evidence)

Cite SPECIFIC evidence inline before claiming completion. Examples:
  [Run: vitest] [See: 13474/13474 PASS]
  [File: docs/audits/iter40.md:12 honest 8.6 cap G45]
  [Curl: https://www.elabtutor.school] [HTTP: 200]
  [Bench: R5 91.80% PZ V3 PASS]

To override (NOT recommended): add `# verification-skip: <reason>` to last message.
EOF
  exit 2
fi

exit 0
