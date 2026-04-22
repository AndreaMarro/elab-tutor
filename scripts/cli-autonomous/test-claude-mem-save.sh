#!/usr/bin/env bash
#
# test-claude-mem-save.sh — Smoke test for claude-mem-save.sh
#
# Exits 0 on PASS, 1 on FAIL.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="$ROOT_DIR/scripts/cli-autonomous/claude-mem-save.sh"
PENDING_DIR="$ROOT_DIR/automa/state/claude-mem-pending"

FAILS=0

check() {
  local name="$1"; shift
  if "$@" >/dev/null 2>&1; then
    echo "PASS: $name"
  else
    echo "FAIL: $name"
    FAILS=$((FAILS + 1))
  fi
}

# 1. Script exists + executable
check "script exists" test -f "$SCRIPT"
check "script executable" test -x "$SCRIPT"

# 2. Invalid event rejected
check "invalid event rejected" bash -c "! $SCRIPT frobnicate 2>/dev/null"

# 3. Missing event rejected
check "missing event rejected" bash -c "! $SCRIPT 2>/dev/null"

# 4. Valid events write payload
for ev in commit end-day end-week decision blocker audit; do
  OUT="$("$SCRIPT" "$ev" test-tag-$ev 2>&1)"
  PAYLOAD_PATH="$(echo "$OUT" | sed -n 's/^Payload written: //p' | head -1)"
  if [ -n "$PAYLOAD_PATH" ] && [ -f "$PAYLOAD_PATH" ]; then
    if grep -q "\"event\": \"$ev\"" "$PAYLOAD_PATH" 2>/dev/null; then
      echo "PASS: event=$ev payload written + valid"
    else
      echo "FAIL: event=$ev payload malformed"
      FAILS=$((FAILS + 1))
    fi
    if grep -q "test-tag-$ev" "$PAYLOAD_PATH" 2>/dev/null; then
      echo "PASS: event=$ev extra-tag included"
    else
      echo "FAIL: event=$ev extra-tag missing"
      FAILS=$((FAILS + 1))
    fi
    # Stats field present all events (A-502 enrichment)
    if grep -q '"stats"' "$PAYLOAD_PATH" 2>/dev/null; then
      echo "PASS: event=$ev stats field present"
    else
      echo "FAIL: event=$ev stats field missing"
      FAILS=$((FAILS + 1))
    fi
    # Subject field present all events (A-502 enrichment)
    if grep -q '"subject"' "$PAYLOAD_PATH" 2>/dev/null; then
      echo "PASS: event=$ev subject field present"
    else
      echo "FAIL: event=$ev subject field missing"
      FAILS=$((FAILS + 1))
    fi
    rm -f "$PAYLOAD_PATH"
  else
    echo "FAIL: event=$ev no payload path emitted"
    FAILS=$((FAILS + 1))
  fi
done

# 4b. Commit event stats numeric (files_changed integer not string)
OUT="$("$SCRIPT" commit stats-numeric-check 2>&1)"
PAYLOAD_PATH="$(echo "$OUT" | sed -n 's/^Payload written: //p' | head -1)"
if [ -f "$PAYLOAD_PATH" ]; then
  # files_changed: NUMBER not "NUMBER" (no quotes around int value)
  if grep -qE '"files_changed": [0-9]+' "$PAYLOAD_PATH"; then
    echo "PASS: stats.files_changed is numeric (not string)"
  else
    echo "FAIL: stats.files_changed not numeric"
    FAILS=$((FAILS + 1))
  fi
  if grep -qE '"insertions": [0-9]+' "$PAYLOAD_PATH"; then
    echo "PASS: stats.insertions is numeric"
  else
    echo "FAIL: stats.insertions not numeric"
    FAILS=$((FAILS + 1))
  fi
  rm -f "$PAYLOAD_PATH"
fi

# 5. Pending dir exists
check "pending dir exists" test -d "$PENDING_DIR"

# 5b. Post-commit hook exists + executable + non-blocking (A-502)
POST_COMMIT_HOOK="$ROOT_DIR/.githooks/post-commit"
check "post-commit hook tracked" test -f "$POST_COMMIT_HOOK"
check "post-commit hook executable" test -x "$POST_COMMIT_HOOK"
# Non-blocking: if save script is missing, hook returns 0 still
if [ -x "$POST_COMMIT_HOOK" ]; then
  # Sim missing save script: temporarily rename
  BACKUP="$SCRIPT.bak.$$"
  mv "$SCRIPT" "$BACKUP"
  # Run hook in a controlled env (use parent shell cwd)
  if (cd "$ROOT_DIR" && bash "$POST_COMMIT_HOOK") >/dev/null 2>&1; then
    echo "PASS: post-commit non-blocking when save script missing"
  else
    echo "FAIL: post-commit BLOCKED when save script missing"
    FAILS=$((FAILS + 1))
  fi
  mv "$BACKUP" "$SCRIPT"
fi

# 5c. Installer script present + executable
INSTALLER="$ROOT_DIR/scripts/hooks/install-git-hooks.sh"
check "installer exists" test -f "$INSTALLER"
check "installer executable" test -x "$INSTALLER"
check "installer --status runs" bash "$INSTALLER" --status

# 6. Cleanup stale test payloads (if any)
find "$PENDING_DIR" -name "*.json" -newer "$SCRIPT" -mmin -10 2>/dev/null | while read -r f; do
  if grep -q 'test-tag' "$f" 2>/dev/null; then
    rm -f "$f"
  fi
done

echo ""
if [ "$FAILS" -eq 0 ]; then
  echo "ALL PASS"
  exit 0
else
  echo "FAILS: $FAILS"
  exit 1
fi
