#!/usr/bin/env bash
# Test harness for scripts/validate-tasks-board.sh
# Runs 3 cases: valid fixture, invalid fixture, SKIP_SCHEMA bypass.

set -u
cd "$(dirname "$0")/../.."

VALIDATOR=scripts/validate-tasks-board.sh
PASS=0
FAIL=0

assert_exit() {
  local label="$1" expected="$2" actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "  PASS: $label (exit=$actual)"
    PASS=$((PASS + 1))
  else
    echo "  FAIL: $label (expected exit=$expected, got=$actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Case 1: valid fixture should exit 0 ==="
TASKS_BOARD_FILE=tests/fixtures/tasks-board/valid-minimal.json bash "$VALIDATOR" >/dev/null 2>&1
assert_exit "valid fixture" 0 $?

echo "=== Case 2: invalid fixture should exit 1 ==="
TASKS_BOARD_FILE=tests/fixtures/tasks-board/invalid-task-enum.json bash "$VALIDATOR" >/dev/null 2>&1
assert_exit "invalid fixture" 1 $?

echo "=== Case 3: SKIP_SCHEMA=1 bypass should exit 0 on invalid ==="
SKIP_SCHEMA=1 TASKS_BOARD_FILE=tests/fixtures/tasks-board/invalid-task-enum.json bash "$VALIDATOR" >/dev/null 2>&1
assert_exit "SKIP_SCHEMA bypass" 0 $?

echo "=== Case 4: missing file should exit 1 ==="
TASKS_BOARD_FILE=/tmp/does-not-exist.json bash "$VALIDATOR" >/dev/null 2>&1
assert_exit "missing file" 1 $?

echo ""
echo "=== Summary: $PASS pass / $FAIL fail ==="
[ "$FAIL" -eq 0 ]
