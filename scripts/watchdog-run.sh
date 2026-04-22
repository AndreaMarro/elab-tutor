#!/usr/bin/env bash
# Watchdog orchestrator (portable). Reads .watchdog-config.json,
# delegates project-specific checks to scripts/watchdog-checks.sh.
# Exports log_anomaly() + log_ok() helpers for checks.
# Always exits 0 (non-blocking).

set -uo pipefail

RUN_TYPE="${1:-regular}"
CONFIG_FILE=".watchdog-config.json"
MONTH=$(date -u +%Y-%m)
LOG_FILE="docs/audits/errors-log-${MONTH}.md"
REPORT_FILE="/tmp/watchdog-report.md"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Required tools
for cmd in jq curl git gh; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "WARN: missing required command: $cmd"
  fi
done

if [ ! -f "$CONFIG_FILE" ]; then
  echo "ERROR: $CONFIG_FILE not found. Skipping watchdog."
  exit 0
fi

PROJECT=$(jq -r '.project // "unknown"' "$CONFIG_FILE")
SOURCE=$(jq -r '.source // "watchdog"' "$CONFIG_FILE")

# Ensure log file exists
mkdir -p "$(dirname "$LOG_FILE")"
if [ ! -f "$LOG_FILE" ]; then
  cat > "$LOG_FILE" <<EOF
# Errors log $MONTH

**Project**: $PROJECT
**Source**: $SOURCE

## Entries

EOF
fi

# Reset report
: > "$REPORT_FILE"

ANOMALY_COUNT=0
OK_COUNT=0

# ADR-005 state files (noise suppression: severity + threshold + cooldown + auto-close)
STREAKS_FILE="${WATCHDOG_STREAKS_FILE:-automa/state/watchdog-streaks.json}"
COOLDOWN_FILE="${WATCHDOG_COOLDOWN_FILE:-automa/state/watchdog-cooldown.json}"
NOW_EPOCH="${WATCHDOG_MOCK_EPOCH:-$(date -u +%s)}"
mkdir -p "$(dirname "$STREAKS_FILE")" 2>/dev/null || true
[ -f "$STREAKS_FILE" ] || echo '{}' > "$STREAKS_FILE"
[ -f "$COOLDOWN_FILE" ] || echo '{}' > "$COOLDOWN_FILE"

# Cooldown window defaults (seconds). Override via env.
WATCHDOG_COOLDOWN_ERROR="${WATCHDOG_COOLDOWN_ERROR:-7200}"   # 2h
WATCHDOG_COOLDOWN_WARN="${WATCHDOG_COOLDOWN_WARN:-86400}"    # 24h
WATCHDOG_THRESHOLD_WARN="${WATCHDOG_THRESHOLD_WARN:-3}"      # consecutive warn before GH issue

_wd_json_set() {
  local file="$1" key="$2" val="$3"
  local tmp
  tmp=$(mktemp)
  jq --arg k "$key" --argjson v "$val" '.[$k] = $v' "$file" > "$tmp" && mv "$tmp" "$file"
}

_wd_json_get() {
  local file="$1" key="$2" default="${3:-null}"
  jq -r --arg k "$key" --arg d "$default" '.[$k] // $d' "$file" 2>/dev/null
}

_wd_streak_inc() {
  local type="$1"
  local prev
  prev=$(jq -r --arg k "$type" '.[$k].streak // 0' "$STREAKS_FILE")
  local new=$((prev + 1))
  local tmp
  tmp=$(mktemp)
  jq --arg k "$type" --argjson s "$new" --arg ts "$TIMESTAMP" \
    '.[$k] = {streak: $s, last_run: $ts}' "$STREAKS_FILE" > "$tmp" && mv "$tmp" "$STREAKS_FILE"
  echo "$new"
}

_wd_streak_reset() {
  local type="$1"
  local tmp
  tmp=$(mktemp)
  jq --arg k "$type" 'del(.[$k])' "$STREAKS_FILE" > "$tmp" && mv "$tmp" "$STREAKS_FILE"
}

_wd_cooldown_active() {
  local type="$1" severity="$2"
  local prev_epoch window
  prev_epoch=$(jq -r --arg k "$type" '.[$k].created_epoch // 0' "$COOLDOWN_FILE")
  [ "$prev_epoch" = "0" ] && return 1
  case "$severity" in
    error) window="$WATCHDOG_COOLDOWN_ERROR" ;;
    *)     window="$WATCHDOG_COOLDOWN_WARN" ;;
  esac
  local delta=$((NOW_EPOCH - prev_epoch))
  [ "$delta" -lt "$window" ]
}

_wd_cooldown_record() {
  local type="$1"
  local tmp
  tmp=$(mktemp)
  jq --arg k "$type" --argjson e "$NOW_EPOCH" --arg ts "$TIMESTAMP" \
    '.[$k] = {created_epoch: $e, created_at: $ts}' "$COOLDOWN_FILE" > "$tmp" && mv "$tmp" "$COOLDOWN_FILE"
}

log_anomaly() {
  local type="$1"
  local detail="$2"
  local pattern_hint="${3:-}"
  local severity="${4:-warn}"  # ADR-005: info|warn|error, default warn
  ANOMALY_COUNT=$((ANOMALY_COUNT + 1))

  # Layer A — INFO filter (report/log only, no GH issue unless verbose)
  if [ "$severity" = "info" ] && [ "${WATCHDOG_VERBOSE:-0}" != "1" ]; then
    echo "- ℹ️ **$type** (info, suppressed): $detail" >> "$REPORT_FILE"
    _wd_streak_reset "$type"
    return 0
  fi
  # Verbose promotion: treat info as warn (runs through threshold/cooldown pipeline)
  if [ "$severity" = "info" ] && [ "${WATCHDOG_VERBOSE:-0}" = "1" ]; then
    severity="warn"
  fi

  # Always append to Markdown errors log (human audit trail preserved)
  {
    echo ""
    echo "### $TIMESTAMP — $type [$severity]"
    echo ""
    echo "**Detail**: $detail"
    if [ -n "$pattern_hint" ]; then
      echo ""
      echo "**Pattern hint**: $pattern_hint"
    fi
    echo ""
    echo "**Severity**: $severity | **Run**: ${RUN_TYPE:-unknown} | **Source**: ${SOURCE:-watchdog}"
  } >> "$LOG_FILE"

  local icon
  case "$severity" in
    error) icon="🔥" ;;
    warn)  icon="⚠️" ;;
    *)     icon="ℹ️" ;;
  esac
  echo "- $icon **$type** [$severity]: $detail" >> "$REPORT_FILE"

  # Layer B — threshold check (warn only; error bypasses)
  if [ "$severity" = "warn" ]; then
    local streak
    streak=$(_wd_streak_inc "$type")
    if [ "$streak" -lt "$WATCHDOG_THRESHOLD_WARN" ]; then
      echo "  (streak $streak/$WATCHDOG_THRESHOLD_WARN — no GH issue yet)" >> "$REPORT_FILE"
      return 0
    fi
  fi

  # Layer C — cooldown check
  if _wd_cooldown_active "$type" "$severity"; then
    echo "  (cooldown active — suppressed, log-only)" >> "$REPORT_FILE"
    return 0
  fi

  # Emit decision taken: record cooldown + streak reset BEFORE gh call so state
  # reflects the decision even in dry-run / gh-missing environments.
  _wd_cooldown_record "$type"
  [ "$severity" = "warn" ] && _wd_streak_reset "$type"

  # Actual GH issue creation (skipped in dry-run or when gh missing)
  if command -v gh >/dev/null 2>&1 && [ "${WATCHDOG_DRY_RUN:-0}" != "1" ]; then
    local SAFE_TITLE="[watchdog][$severity] ${type}: ${detail:0:80}"
    local EXISTING
    EXISTING=$(gh issue list --label watchdog-alert --state open --json title --limit 50 2>/dev/null \
      | jq -r --arg t "$type" '.[] | select(.title | contains($t)) | .title' | head -1)
    if [ -z "$EXISTING" ]; then
      gh issue create \
        --title "$SAFE_TITLE" \
        --label watchdog-alert \
        --body "Detected $TIMESTAMP by ELAB Watchdog ($RUN_TYPE run).

**Severity**: $severity
**Type**: $type
**Detail**: $detail
**Pattern hint**: ${pattern_hint:-N/A}

See \`${LOG_FILE:-docs/audits/errors-log.md}\` for full log." 2>/dev/null || echo "Issue creation failed (non-blocking)."
    else
      echo "Skipping issue (similar exists): $EXISTING"
    fi
  fi
}

log_ok() {
  local check="$1"
  local detail="${2:-OK}"
  OK_COUNT=$((OK_COUNT + 1))
  echo "- ✅ **$check**: $detail" >> "$REPORT_FILE"
}

# ADR-005 Layer D — auto-close on 3x OK streak
log_ok_streak() {
  local check="$1"
  local detail="${2:-OK}"
  OK_COUNT=$((OK_COUNT + 1))
  echo "- ✅ **$check**: $detail" >> "$REPORT_FILE"

  local prev_ok
  prev_ok=$(jq -r --arg k "$check" '.[$k].ok_streak // 0' "$STREAKS_FILE")
  local new_ok=$((prev_ok + 1))
  local tmp
  tmp=$(mktemp)
  jq --arg k "$check" --argjson s "$new_ok" --arg ts "$TIMESTAMP" \
    '.[$k] = (.[$k] // {}) + {ok_streak: $s, last_ok: $ts}' "$STREAKS_FILE" > "$tmp" && mv "$tmp" "$STREAKS_FILE"

  if [ "$new_ok" -ge 3 ] && command -v gh >/dev/null 2>&1 && [ "${WATCHDOG_DRY_RUN:-0}" != "1" ]; then
    local TARGET
    TARGET=$(gh issue list --label watchdog-alert --state open --json number,title --limit 50 2>/dev/null \
      | jq -r --arg t "$check" '.[] | select(.title | contains($t)) | .number' | head -1)
    if [ -n "$TARGET" ]; then
      gh issue comment "$TARGET" --body "auto-close: 3× OK streak confirmed at $TIMESTAMP, resolution stable." 2>/dev/null || true
      gh issue close "$TARGET" 2>/dev/null || true
      tmp=$(mktemp)
      jq --arg k "$check" 'del(.[$k])' "$STREAKS_FILE" > "$tmp" && mv "$tmp" "$STREAKS_FILE"
    fi
  fi
}

export -f log_anomaly log_ok log_ok_streak _wd_json_set _wd_json_get _wd_streak_inc _wd_streak_reset _wd_cooldown_active _wd_cooldown_record
export RUN_TYPE TIMESTAMP LOG_FILE REPORT_FILE ANOMALY_COUNT OK_COUNT PROJECT SOURCE
export STREAKS_FILE COOLDOWN_FILE NOW_EPOCH WATCHDOG_COOLDOWN_ERROR WATCHDOG_COOLDOWN_WARN WATCHDOG_THRESHOLD_WARN WATCHDOG_VERBOSE WATCHDOG_DRY_RUN

# Library mode: test harnesses source this file to reuse log_anomaly/log_ok helpers
# without invoking the check runner or writing the report footer.
if [ "${WATCHDOG_LIB_MODE:-0}" = "1" ]; then
  return 0 2>/dev/null || exit 0
fi

# Header for report
{
  echo "## Watchdog run $TIMESTAMP ($RUN_TYPE)"
  echo ""
  echo "**Project**: $PROJECT"
  echo ""
} > "$REPORT_FILE"

# Delegate to project-specific checks
if [ -x scripts/watchdog-checks.sh ]; then
  bash scripts/watchdog-checks.sh "$RUN_TYPE"
else
  echo "ERROR: scripts/watchdog-checks.sh not executable or missing."
fi

# Count from report (subshell counter fix)
OK_COUNT=$(grep -c '^- ✅' "$REPORT_FILE" 2>/dev/null || echo 0)
ANOMALY_COUNT=$(grep -c '^- ⚠️' "$REPORT_FILE" 2>/dev/null || echo 0)

# Footer
{
  echo ""
  echo "**Summary**: $OK_COUNT OK, $ANOMALY_COUNT anomaly"
} >> "$REPORT_FILE"

echo ""
echo "Watchdog run complete. OK=$OK_COUNT Anomaly=$ANOMALY_COUNT"
exit 0
