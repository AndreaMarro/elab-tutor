#!/usr/bin/env bash
# cegis-plus-orchestrator.sh — Iter 41 CEGIS-PLUS 8-round tmux 5-window orchestrator
#
# Pattern: M-AI-07 6-round + R0 PRE-FLIGHT + R4 REPOMIX cross-vendor + R7 MAC MINI smoke + R8 VERIFICATION gate
# Wall-clock: ~6m sequential + 90s MM parallel
# Cost: ~$0.013/atom
#
# Reference:
#   docs/audits/2026-05-05-iter-41-OPTIMAL-WORKFLOW-synthesis.md §3 §4
#
# Usage:
#   bash scripts/mechanisms/cegis-plus-orchestrator.sh <atom-name> <briefing-file>
#
# Example:
#   bash scripts/mechanisms/cegis-plus-orchestrator.sh \
#        step-back-validate /tmp/atom-step-back-briefing.md
#
# Exit codes:
#   0 — session attached (manual exit)
#   1 — usage error (missing args)
#   2 — pre-flight FAIL (R0 abort: vitest red OR critical files dirty)

set -euo pipefail

ATOM="${1:-}"
BRIEF="${2:-}"
SESSION="elab-iter41"

if [[ -z "$ATOM" || -z "$BRIEF" ]]; then
  echo "usage: $0 <atom-name> <briefing-file>" >&2
  echo "  atom-name: short identifier (e.g., 'step-back-validate')" >&2
  echo "  briefing-file: markdown atom briefing (problem + constraints + acceptance)" >&2
  exit 1
fi

if [[ ! -f "$BRIEF" ]]; then
  echo "Error: briefing file not found: $BRIEF" >&2
  exit 1
fi

# Pre-flight R0 — fail-fast prima di consumare vendor tokens
echo "[R0 PRE-FLIGHT] git status + vitest baseline + repomix snapshot..."

GIT_DIRTY=$(git status --porcelain | wc -l | tr -d ' ')
if [[ "$GIT_DIRTY" -gt 30 ]]; then
  echo "⚠️  R0 ABORT: $GIT_DIRTY dirty files >30 threshold (run git status, commit/stash first)" >&2
  exit 2
fi

# Verify critical engine files clean (Sprint S iter 32 mandate)
CRITICAL_DIRTY=$(git status --porcelain | grep -E "(CircuitSolver\.js|AVRBridge\.js|PlacementEngine\.js|vite\.config\.js)$" || true)
if [[ -n "$CRITICAL_DIRTY" ]]; then
  echo "⚠️  R0 ABORT: critical engine files dirty:" >&2
  echo "$CRITICAL_DIRTY" >&2
  exit 2
fi

# Capture baseline state
GIT_SHA=$(git rev-parse HEAD)
mkdir -p automa/state/m-ai-07
mkdir -p automa/team-state/messages
echo "{\"atom\":\"$ATOM\",\"git_sha\":\"$GIT_SHA\",\"dirty_files\":$GIT_DIRTY,\"ts_utc\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
  > "automa/state/m-ai-07/${ATOM}-r0-preflight.json"
touch "automa/team-state/messages/r0-completed.md"

echo "[R0 PASS] git_sha=$GIT_SHA dirty=$GIT_DIRTY"

# Bootstrap tmux session
tmux kill-session -t "$SESSION" 2>/dev/null || true
tmux new-session -d -s "$SESSION" -n "main"

# w0 main: orchestrator R1/R2/R3a/R3b/R5
tmux send-keys -t "$SESSION:main" \
  "source ~/.elab-credentials/sprint-s-tokens.env && bash scripts/mechanisms/M-AI-07-multi-vendor-anti-bias.sh '$ATOM' '$BRIEF'" C-m

# w1 vendors-3: parallel mistral+kimi tail
tmux new-window -t "$SESSION" -n "vendors-3"
tmux send-keys -t "$SESSION:vendors-3" \
  "tail -F /tmp/m-ai-07-${ATOM}-r3a.json /tmp/m-ai-07-${ATOM}-r3b.json 2>/dev/null" C-m

# w2 r4-repomix: cross-vendor consistency check (NEW iter 41)
tmux new-window -t "$SESSION" -n "r4-repomix"
tmux send-keys -t "$SESSION:r4-repomix" \
  "until [ -f automa/team-state/messages/r3-completed.md ]; do sleep 5; done; \
   bash scripts/mechanisms/cegis-r4-repomix-cross.sh '$ATOM'" C-m

# w3 mac-mini: ssh smoke + lint parallel (NEW iter 41 R7)
tmux new-window -t "$SESSION" -n "mac-mini"
tmux send-keys -t "$SESSION:mac-mini" \
  "until [ -f automa/team-state/messages/r5-completed.md ]; do sleep 5; done; \
   ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59 \
   'cd elab-builder && bash scripts/mac-mini-cegis-runner.sh ${ATOM}' && \
   touch automa/team-state/messages/r7-completed.md" C-m

# w4 r8-gate: verification + cap enforcer (NEW iter 41 R8)
tmux new-window -t "$SESSION" -n "r8-gate"
tmux send-keys -t "$SESSION:r8-gate" \
  "until [ -f automa/team-state/messages/r5-completed.md ]; do sleep 5; done; \
   echo '[R8 VERIFICATION GATE]' && \
   node scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs --atom='$ATOM' && \
   node scripts/mechanisms/M-AI-03-claim-reality-gap-detector.mjs && \
   node scripts/mechanisms/M-AI-04-doc-drift-detector.mjs && \
   touch automa/team-state/messages/r8-completed.md && \
   echo '[R8 PASS]'" C-m

echo ""
echo "[CEGIS-PLUS] tmux session '$SESSION' bootstrapped — 5 windows"
echo "  main         — orchestrator R1-R5"
echo "  vendors-3    — mistral+kimi tail"
echo "  r4-repomix   — cross-vendor (NEW)"
echo "  mac-mini     — Playwright smoke parallel R7 (NEW)"
echo "  r8-gate      — verification + cap enforcer (NEW)"
echo ""
echo "Attach: tmux attach -t $SESSION"
echo "Detach: C-b d"
echo "Status: ls automa/team-state/messages/r*-completed.md"

# Auto-attach if interactive
if [[ -t 1 ]]; then
  tmux attach -t "$SESSION"
fi
