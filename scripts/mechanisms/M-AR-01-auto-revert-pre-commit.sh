#!/usr/bin/env bash
# M-AR-01 Auto-Revert Pre-Commit (iter 31 RALPH DEEP)
# Companion to .husky/pre-commit. Runs vitest, diffs against baseline-tests.txt.
# If test count DROPS, REVERT working tree changes (git stash) — refuse commit.
# NO --no-verify bypass tolerated (caller MUST NOT pass it).
# Logs to automa/state/auto-revert-log.jsonl.
#
# Usage: scripts/mechanisms/M-AR-01-auto-revert-pre-commit.sh
# Exit 0 = baseline preserved or grew, commit proceeds.
# Exit 1 = baseline regressed, working tree stashed, commit aborted.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

BASELINE_FILE="automa/baseline-tests.txt"
LOG_FILE="automa/state/auto-revert-log.jsonl"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
COMMIT_PARENT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")

mkdir -p "$(dirname "$LOG_FILE")"

if [ ! -f "$BASELINE_FILE" ]; then
  echo "[M-AR-01] FATAL: baseline file missing: $BASELINE_FILE" >&2
  echo "{\"ts\":\"$TIMESTAMP\",\"event\":\"baseline_missing\",\"commit_parent\":\"$COMMIT_PARENT\",\"action\":\"abort\"}" >> "$LOG_FILE"
  exit 1
fi

BASELINE=$(cat "$BASELINE_FILE" | tr -d '[:space:]')
echo "[M-AR-01] baseline: $BASELINE tests"

# Run vitest (passWithNoTests false). Capture summary line.
echo "[M-AR-01] running vitest..."
VITEST_OUT=$(npx vitest run --reporter=default 2>&1 || true)
CURRENT=$(echo "$VITEST_OUT" | grep -E "Tests\s+[0-9]+\s+passed" | tail -1 | grep -oE "[0-9]+\s+passed" | grep -oE "[0-9]+" | head -1)
CURRENT=${CURRENT:-0}

echo "[M-AR-01] current: $CURRENT tests passed"

if [ "$CURRENT" -lt "$BASELINE" ]; then
  echo "[M-AR-01] REGRESSION DETECTED: $CURRENT < $BASELINE"
  echo "[M-AR-01] stashing working tree..."
  STASH_MSG="M-AR-01 auto-revert iter31 $TIMESTAMP regression $CURRENT vs $BASELINE"
  git stash push -u -m "$STASH_MSG" >&2 || echo "[M-AR-01] WARN: stash failed (no changes?)"
  echo "{\"ts\":\"$TIMESTAMP\",\"event\":\"regression_revert\",\"commit_parent\":\"$COMMIT_PARENT\",\"baseline\":$BASELINE,\"current\":$CURRENT,\"delta\":$((CURRENT-BASELINE)),\"action\":\"stash_and_abort\",\"stash_msg\":\"$STASH_MSG\"}" >> "$LOG_FILE"
  echo "[M-AR-01] commit ABORTED. Restore changes via: git stash pop" >&2
  echo "[M-AR-01] NO --no-verify bypass. Fix tests, re-stage, retry." >&2
  exit 1
fi

if [ "$CURRENT" -gt "$BASELINE" ]; then
  echo "[M-AR-01] BASELINE GREW: $CURRENT > $BASELINE — consider updating baseline-tests.txt"
  echo "{\"ts\":\"$TIMESTAMP\",\"event\":\"baseline_grew\",\"commit_parent\":\"$COMMIT_PARENT\",\"baseline\":$BASELINE,\"current\":$CURRENT,\"delta\":$((CURRENT-BASELINE)),\"action\":\"allow\"}" >> "$LOG_FILE"
fi

if [ "$CURRENT" -eq "$BASELINE" ]; then
  echo "[M-AR-01] OK: baseline preserved at $BASELINE"
  echo "{\"ts\":\"$TIMESTAMP\",\"event\":\"baseline_ok\",\"commit_parent\":\"$COMMIT_PARENT\",\"baseline\":$BASELINE,\"current\":$CURRENT,\"action\":\"allow\"}" >> "$LOG_FILE"
fi

exit 0
