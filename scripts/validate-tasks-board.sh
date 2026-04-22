#!/usr/bin/env bash
# ADR-008 Phase 1 validator — jq+bash fallback (no Ajv dep)
# Validates automa/team-state/tasks-board.json against ADR-008 draft-07 schema.
# Exit 0 pass, 1 fail. Use SKIP_SCHEMA=1 to bypass (emergencies only).
# Reference: docs/architectures/ADR-008-tasks-board-schema.md §7

set -u

FILE="${TASKS_BOARD_FILE:-automa/team-state/tasks-board.json}"

if [ "${SKIP_SCHEMA:-0}" = "1" ]; then
  echo "[validate-tasks-board] SKIP_SCHEMA=1 — bypass (emergency mode)"
  exit 0
fi

if [ ! -f "$FILE" ]; then
  echo "[validate-tasks-board] FAIL: $FILE not found"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "[validate-tasks-board] FAIL: jq required but not installed"
  exit 1
fi

if ! jq empty "$FILE" 2>/dev/null; then
  echo "[validate-tasks-board] FAIL: $FILE is not valid JSON"
  exit 1
fi

ERRORS=0
report() {
  echo "  - $1"
  ERRORS=$((ERRORS + 1))
}

echo "[validate-tasks-board] checking $FILE against ADR-008 schema"

# Root-level required keys (per ADR-008 §2.2)
for key in sprint_ref updated_at current_day columns; do
  if ! jq -e "has(\"$key\")" "$FILE" >/dev/null 2>&1; then
    report "root missing required key: $key"
  fi
done

# sprint_ref shape
if jq -e '.sprint_ref' "$FILE" >/dev/null 2>&1; then
  for sk in number name period_start period_end contract_path; do
    jq -e ".sprint_ref | has(\"$sk\")" "$FILE" >/dev/null 2>&1 \
      || report "sprint_ref missing: $sk"
  done
  jq -e '.sprint_ref.name | test("^sett-[0-9]+")' "$FILE" >/dev/null 2>&1 \
    || report "sprint_ref.name pattern mismatch (expect ^sett-[0-9]+)"
fi

# current_day shape (object, not string)
if jq -e '.current_day | type == "object"' "$FILE" >/dev/null 2>&1; then
  for ck in sprint_day cumulative_day date; do
    jq -e ".current_day | has(\"$ck\")" "$FILE" >/dev/null 2>&1 \
      || report "current_day missing: $ck"
  done
elif jq -e '.current_day' "$FILE" >/dev/null 2>&1; then
  report "current_day expected object, found $(jq -r '.current_day | type' "$FILE")"
fi

# updated_at ISO-8601
if jq -e '.updated_at' "$FILE" >/dev/null 2>&1; then
  jq -e '.updated_at | test("^[0-9]{4}-[0-9]{2}-[0-9]{2}T")' "$FILE" >/dev/null 2>&1 \
    || report "updated_at not ISO-8601 datetime"
fi

# owner shape (object, not string)
if jq -e '.owner' "$FILE" >/dev/null 2>&1; then
  jq -e '.owner | type == "object"' "$FILE" >/dev/null 2>&1 \
    || report "owner expected object with primary + collaborators, found $(jq -r '.owner | type' "$FILE")"
fi

# columns required sub-keys
if jq -e '.columns' "$FILE" >/dev/null 2>&1; then
  for col in backlog in_progress done; do
    jq -e ".columns | has(\"$col\")" "$FILE" >/dev/null 2>&1 \
      || report "columns missing: $col"
  done
fi

# Per-task validation (applies across all columns)
VALID_STATUS='["backlog","in_progress","blocked","review","done"]'
VALID_OWNER='["team-architect","team-dev","team-tester","team-reviewer","team-auditor","team-tpm","andrea","tea"]'
VALID_SP='[1,2,3,5,8,13,21]'

TASK_ERRORS=$(jq -r --argjson status "$VALID_STATUS" \
                   --argjson owner "$VALID_OWNER" \
                   --argjson sp "$VALID_SP" '
  [.columns // {} | to_entries[] | .key as $col | .value // [] | to_entries[] |
    .key as $idx | .value as $t |
    [
      (if ($t | has("id") | not) then "col=\($col)[\($idx)]: missing id" else empty end),
      (if ($t | has("id")) and (($t.id | test("^(T|S|A)-?[0-9]+(-[0-9]+)*$")) | not) then "col=\($col)[\($idx)] id=\($t.id // "?"): id pattern mismatch" else empty end),
      (if ($t | has("status") | not) then "col=\($col)[\($idx)] id=\($t.id // "?"): missing status" else empty end),
      (if ($t | has("status")) and (($status | index($t.status)) == null) then "col=\($col)[\($idx)] id=\($t.id // "?"): status \"\($t.status)\" not in enum" else empty end),
      (if ($t | has("owner") | not) then "col=\($col)[\($idx)] id=\($t.id // "?"): missing owner" else empty end),
      (if ($t | has("owner")) and (($owner | index($t.owner)) == null) then "col=\($col)[\($idx)] id=\($t.id // "?"): owner \"\($t.owner)\" not in enum" else empty end),
      (if ($t | has("story_points") | not) then "col=\($col)[\($idx)] id=\($t.id // "?"): missing story_points" else empty end),
      (if ($t | has("story_points")) and (($sp | index($t.story_points)) == null) then "col=\($col)[\($idx)] id=\($t.id // "?"): story_points \($t.story_points) not in fibonacci" else empty end)
    ] | .[]
  ] | .[]
' "$FILE" 2>/dev/null)

if [ -n "$TASK_ERRORS" ]; then
  while IFS= read -r line; do
    [ -n "$line" ] && report "$line"
  done <<< "$TASK_ERRORS"
fi

echo "[validate-tasks-board] $ERRORS violation(s) found"

if [ "$ERRORS" -eq 0 ]; then
  echo "[validate-tasks-board] PASS"
  exit 0
fi

echo "[validate-tasks-board] FAIL — see docs/architectures/ADR-008-tasks-board-schema.md"
exit 1
