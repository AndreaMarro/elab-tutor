# Anti-Regression + Anti-Inflation Mechanisms — Iter 30 docs-only

**Date**: 2026-05-02
**Mode**: docs-only iter 30 (Andrea explicit "no fix")
**Scope**: meccanismi forti anti-regressione + anti-inflazione G45 — ready-paste iter 31+ deploy
**Cross-link**: master plan `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
**Anti-inflation G45 cap mandate enforced**: NO claim "mechanism LIVE" senza prod-verify + 24h soak.

---

## §1. Executive summary

Stato iter 30: anti-regression + anti-inflation **manuali** + disciplina umana. Gaps critici:
- Score claim manuale → drift inflato (iter 39 Opus indipendente trovato 3 inflation flags vs 8.45 prior claim)
- Vitest baseline preservata via pre-commit hook ma R5/R6/R7 stress NON gated
- Mac Mini cron findings JSON snapshot solo, NO diff cycle-vs-cycle regression detection
- Lighthouse perf ≥90 NON gated (iter 38 perf 26+23 FAIL ammesso)
- ToolSpec count drift detected only post-fact (iter 28 said 62, iter 37 reverify 57)
- Wiki concept hallucination 45-55% rate — NON gate prima di ingest LIVE

Iter 31+ deploy 12 meccanismi (5 anti-regression + 5 anti-inflation + 2 cross-cutting):

### §1.1 Top-3 ROI mechanisms (deploy iter 31 Phase 1)

1. **M-AR-01 Auto-revert hook pre-commit** — vitest baseline + R5 stress delta machine check. Failure → AUTO-REVERT + investigation systematic-debugging mandate
2. **M-AI-01 Score audit trail registry** — `automa/state/score-history.jsonl` append-only ogni iter close + `inflation-flags.jsonl` machine-readable. Score claim DEVE link evidence file
3. **M-CC-01 Documentation drift detector** — `scripts/detect-doc-drift.sh` ToolSpec count + RAG chunks count + Wiki count cross-doc consistency check

---

## §2. Anti-Regression mechanisms (5 atoms)

### §2.1 M-AR-01 Auto-revert pre-commit hook ENHANCED

**Scope**: estende pre-commit hook attuale `automa/baseline-tests.txt` check. Adds R5 stress delta gate (smoke 5/5) + bundle size gate.

**Gap iter 30**: pre-commit verifica solo vitest count delta. NO R5 stress check, NO bundle size gate, NO build PASS verify (defer pre-push hook).

**Mechanism design**:

```bash
#!/bin/bash
# .git/hooks/pre-commit (enhanced iter 31+)
# Mechanism: M-AR-01 Auto-revert pre-commit gate
# Gates: vitest baseline + R5 smoke + bundle size + build PASS

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Gate 1 — Vitest baseline preserve
echo "[pre-commit] Gate 1 vitest baseline check"
EXPECTED_TESTS=$(cat automa/baseline-tests.txt | head -1)
ACTUAL_TESTS=$(npx vitest run --reporter=basic 2>&1 | grep -E "Tests +[0-9]+ passed" | grep -oE "[0-9]+ passed" | grep -oE "[0-9]+" | head -1)
if [ -z "$ACTUAL_TESTS" ] || [ "$ACTUAL_TESTS" -lt "$EXPECTED_TESTS" ]; then
  echo "[pre-commit] REGRESSION: vitest passed=$ACTUAL_TESTS < baseline=$EXPECTED_TESTS"
  echo "[pre-commit] AUTO-REVERT mandate: git stash + investigate systematic-debugging"
  echo "[pre-commit] After fix: git stash pop && retry commit"
  exit 1
fi

# Gate 2 — Bundle size budget
echo "[pre-commit] Gate 2 bundle size budget"
BUDGET_KB=4900
ACTUAL_KB=$(du -sk dist/assets 2>/dev/null | awk '{print $1}' || echo 0)
if [ "$ACTUAL_KB" -gt "$BUDGET_KB" ]; then
  echo "[pre-commit] BUDGET EXCEEDED: bundle=${ACTUAL_KB}KB > budget=${BUDGET_KB}KB"
  echo "[pre-commit] Lazy-load chunks via vite.config.js modulePreload filter"
  exit 1
fi

# Gate 3 — R5 smoke (only if Edge Function modified)
EDGE_MOD=$(git diff --cached --name-only | grep -cE "^supabase/functions/")
if [ "$EDGE_MOD" -gt 0 ] && [ -n "${ELAB_API_KEY:-}" ]; then
  echo "[pre-commit] Gate 3 R5 smoke 5-prompt"
  SMOKE_PASS=$(node scripts/bench/run-r5-smoke.mjs 2>&1 | grep -c "PASS" || echo 0)
  if [ "$SMOKE_PASS" -lt 5 ]; then
    echo "[pre-commit] R5 SMOKE REGRESSION: $SMOKE_PASS/5 PASS"
    exit 1
  fi
fi

echo "[pre-commit] All gates PASS"
exit 0
```

**Acceptance criteria**:
- pre-commit hook auto-rejects regression — NO `--no-verify` ever
- Andrea ratify Phase 0 master plan iter 31 entrance
- Bundle size budget 4900KB documented (current iter 38 = 4825KB precache)
- R5 smoke runner `scripts/bench/run-r5-smoke.mjs` ships iter 31 Phase 1 atom

**Anti-pattern**:
- ❌ NO `--no-verify` shortcut (Andrea iter 21 mandate)
- ❌ NO env-skip gates (e.g., always-skip Gate 3) — ELAB_API_KEY env must be present iter 31+ entrance

---

### §2.2 M-AR-02 Score history registry append-only

**Scope**: machine-readable score history. Ogni iter close DEVE append entry. Cross-validation iter-by-iter.

**Gap iter 30**: score storia in CLAUDE.md sprint history footer testuale, not parseable. Iter 39 Opus indipendente review trovato 3 inflation flags vs 8.45 prior claim — NO machine record evidence trail.

**Mechanism design**:

File: `automa/state/score-history.jsonl` (append-only)

Format JSON Lines:

```jsonl
{"iter":29,"date":"2026-04-30","commit":"be93d8d","score_claim":8.0,"score_opus_review":null,"box_subtotal":8.40,"bonus":2.10,"cap_reason":"G45 anti-inflation: aggregator NOT wired prod","gates_pass":7,"gates_fail":3,"evidence":{"r5_pass_pct":"94.9","r5_p95_ms":3380,"vitest_count":13212,"build_pass":true,"deploy_verified":true}}
{"iter":38,"date":"2026-05-01","commit":"792acf8","score_claim":8.5,"score_opus_review":null,"box_subtotal":12.05,"bonus":0.30,"cap_reason":"G45: Lighthouse perf FAIL + R7 canonical 3.6%","gates_pass":11,"gates_fail":3,"evidence":{"r5_avg_ms":1607,"r5_p95_ms":3380,"r5_pz_v3_pct":"94.2","vitest_count":13474,"r6_recall_at_5":0.067,"r7_canonical_pct":"3.6","lighthouse_perf_chatbot":26,"lighthouse_perf_easter":23}}
{"iter":39,"date":"2026-05-02","commit":"d152aa2","score_claim":8.45,"score_opus_review":8.0,"box_subtotal":11.25,"bonus":0.25,"cap_reason":"G45 Opus indipendente review: 3 inflation flags (V2 reverted, dispatcher 0%, R5 BROKEN)","gates_pass":8,"gates_fail":4,"evidence":{"r5_latest":"BROKEN","onniscenza_v2_revert_commit":"eb4a11b","canary_dispatch_pct":0,"vitest_count":13474}}
```

**Validator script** `scripts/validate-score-history.sh`:

```bash
#!/bin/bash
# M-AR-02 score history validator
# Checks: no inflation drift > 0.5 between consecutive iters w/o explicit Opus review

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
HISTORY="$REPO_ROOT/automa/state/score-history.jsonl"

if [ ! -f "$HISTORY" ]; then
  echo "[validator] FATAL: $HISTORY missing"
  exit 1
fi

# Parse last 2 entries
LAST=$(tail -1 "$HISTORY")
PREV=$(tail -2 "$HISTORY" | head -1)

LAST_SCORE=$(echo "$LAST" | jq -r '.score_claim')
PREV_SCORE=$(echo "$PREV" | jq -r '.score_claim')
LAST_OPUS=$(echo "$LAST" | jq -r '.score_opus_review // "null"')

# Drift check
DRIFT=$(echo "$LAST_SCORE - $PREV_SCORE" | bc)
DRIFT_ABS=$(echo "$DRIFT" | tr -d '-')
DRIFT_GT_05=$(echo "$DRIFT_ABS > 0.5" | bc)

if [ "$DRIFT_GT_05" = "1" ] && [ "$LAST_OPUS" = "null" ]; then
  echo "[validator] FAIL: score drift $DRIFT > 0.5 without Opus indipendente review"
  echo "[validator] Mandate: spawn Opus context-zero session per Phase 7 master plan"
  exit 1
fi

# Cap reason check
LAST_CAP_REASON=$(echo "$LAST" | jq -r '.cap_reason // ""')
if [ -z "$LAST_CAP_REASON" ]; then
  echo "[validator] FAIL: cap_reason empty — G45 mandate requires explicit cap reason"
  exit 1
fi

echo "[validator] PASS: score history consistent"
```

**Acceptance criteria**:
- Append-only file (immutable history)
- Machine-readable JSON Lines format
- Drift >0.5 between iters mandates Opus G45 review
- Cap reason field MANDATORY

**Anti-pattern**:
- ❌ NO retroactive edit `score-history.jsonl` past entries
- ❌ NO score claim senza evidence field populated
- ❌ NO cap_reason empty

---

### §2.3 M-AR-03 Mac Mini cron regression diff detector

**Scope**: Mac Mini cron `*/10 * * * *` produces JSON ogni cycle. Detector `scripts/mac-mini-detect-regression.sh` confronta cycle N vs N-1 issue counts. New HIGH issue → flag.

**Gap iter 30**: Mac Mini cron findings JSON snapshot solo. NO diff cycle-vs-cycle. Andrea cannot see "what changed" between cycles.

**Mechanism design**:

```bash
#!/bin/bash
# M-AR-03 Mac Mini regression diff detector
# Usage: scripts/mac-mini-detect-regression.sh [EXP_ID]

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

EXP_ID="${1:-v1-cap6-esp1}"
AUDIT_DIR="docs/audits/auto-mac-mini/$EXP_ID"
CURRENT_FILE="$AUDIT_DIR/audit-data.json"
PREV_FILE="$AUDIT_DIR/audit-data.prev.json"

if [ ! -f "$CURRENT_FILE" ]; then
  echo "[regression] SKIP: $CURRENT_FILE missing"
  exit 0
fi

if [ ! -f "$PREV_FILE" ]; then
  echo "[regression] FIRST_RUN: no prev cycle, copy current as prev"
  cp "$CURRENT_FILE" "$PREV_FILE"
  exit 0
fi

# Diff issue counts
CURRENT_HIGH=$(jq '.issues.HIGH | length' "$CURRENT_FILE")
PREV_HIGH=$(jq '.issues.HIGH | length' "$PREV_FILE")
DELTA_HIGH=$((CURRENT_HIGH - PREV_HIGH))

CURRENT_MEDIUM=$(jq '.issues.MEDIUM | length' "$CURRENT_FILE")
PREV_MEDIUM=$(jq '.issues.MEDIUM | length' "$PREV_FILE")
DELTA_MEDIUM=$((CURRENT_MEDIUM - PREV_MEDIUM))

if [ "$DELTA_HIGH" -gt 0 ]; then
  echo "[regression] FAIL $EXP_ID: NEW HIGH issues +$DELTA_HIGH (was $PREV_HIGH, now $CURRENT_HIGH)"
  jq -r '.issues.HIGH[]' "$CURRENT_FILE" | grep -vFf <(jq -r '.issues.HIGH[]' "$PREV_FILE") || true
  
  # Auto-flag GitHub issue draft
  cat > "$AUDIT_DIR/regression-flag-$(date +%Y%m%d-%H%M).md" <<EOF
# Mac Mini Regression Flag $EXP_ID

**Date**: $(date -u +%FT%TZ)
**Cycle**: current vs prev
**Severity**: HIGH (+$DELTA_HIGH new issues)

## New issues this cycle

$(jq -r '.issues.HIGH[]' "$CURRENT_FILE" | grep -vFf <(jq -r '.issues.HIGH[]' "$PREV_FILE") || echo "(diff failed)")

## Recommended action

- Investigate via systematic-debugging skill
- Check recent commits affecting $EXP_ID
- Re-run audit to confirm reproducibility
EOF
  
  exit 1
fi

if [ "$DELTA_MEDIUM" -gt 2 ]; then
  echo "[regression] WARN $EXP_ID: NEW MEDIUM issues +$DELTA_MEDIUM (threshold 2)"
fi

# Rotate prev for next cycle
cp "$CURRENT_FILE" "$PREV_FILE"
echo "[regression] PASS $EXP_ID: HIGH=$CURRENT_HIGH (was $PREV_HIGH), MEDIUM=$CURRENT_MEDIUM (was $PREV_MEDIUM)"
```

**Cron integration**:

```bash
# crontab Mac Mini side (enhanced iter 31+)
*/10 * * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-audit-experiment.sh $(cat /tmp/audit-next-exp.txt) >> /tmp/audit-cron.log 2>&1 && bash scripts/mac-mini-detect-regression.sh $(cat /tmp/audit-next-exp.txt) >> /tmp/regression.log 2>&1
```

**Acceptance criteria**:
- Detector runs ogni cron cycle post-audit
- New HIGH → auto-flag md file in `docs/audits/auto-mac-mini/$EXP_ID/regression-flag-*.md`
- Andrea visibility GitHub mobile (regression flag commits visible)

**Anti-pattern**:
- ❌ NO ignore regression flag (must investigate via systematic-debugging)
- ❌ NO baseline reset post-flag (preserve evidence)

---

### §2.4 M-AR-04 Lighthouse perf gate per deploy

**Scope**: Vercel deploy hook che blocca production promote se Lighthouse perf <70 (intermediate target iter 31, ≥90 final iter 42+).

**Gap iter 30**: Lighthouse perf 26+23 FAIL ammesso iter 38, NO gate. Atom 42-A modulePreload shipped iter 41+ ma NO gate post-deploy.

**Mechanism design**:

```bash
#!/bin/bash
# M-AR-04 Lighthouse perf gate
# Usage: scripts/lighthouse-deploy-gate.sh <deploy_url>

set -euo pipefail
DEPLOY_URL="${1:-https://www.elabtutor.school}"
THRESHOLD_INTERMEDIATE=70
THRESHOLD_FINAL=90  # iter 42+

REPORT_DIR="docs/audits/lighthouse"
mkdir -p "$REPORT_DIR"
TS=$(date -u +%Y-%m-%dT%H-%M)

ROUTES=("#chatbot-only" "#about-easter" "#lavagna")
FAIL=0

for ROUTE in "${ROUTES[@]}"; do
  URL="${DEPLOY_URL}/${ROUTE}"
  REPORT="$REPORT_DIR/lighthouse-${TS}-${ROUTE//[^a-z0-9]/-}.json"
  
  echo "[lighthouse] Measuring $URL"
  npx lighthouse "$URL" --only-categories=performance --output=json --quiet --chrome-flags="--headless" > "$REPORT" 2>/dev/null || true
  
  PERF=$(jq '.categories.performance.score * 100 | floor' "$REPORT" 2>/dev/null || echo 0)
  echo "[lighthouse] $ROUTE perf=$PERF"
  
  if [ "$PERF" -lt "$THRESHOLD_INTERMEDIATE" ]; then
    echo "[lighthouse] FAIL: $ROUTE perf=$PERF < threshold=$THRESHOLD_INTERMEDIATE"
    FAIL=$((FAIL+1))
  fi
done

if [ "$FAIL" -gt 0 ]; then
  echo "[lighthouse] DEPLOY GATE FAIL: $FAIL/${#ROUTES[@]} routes below threshold"
  exit 1
fi

echo "[lighthouse] DEPLOY GATE PASS: all ${#ROUTES[@]} routes ≥$THRESHOLD_INTERMEDIATE"
```

**Vercel integration** (`.github/workflows/lighthouse-gate.yml`):

```yaml
name: Lighthouse deploy gate
on:
  deployment_status:
jobs:
  lighthouse:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: bash scripts/lighthouse-deploy-gate.sh ${{ github.event.deployment_status.target_url }}
```

**Acceptance criteria**:
- Gate runs post-Vercel deploy preview
- Threshold 70 intermediate iter 31, raise 90 iter 42+
- 3 routes measured (#chatbot-only + #about-easter + #lavagna)
- Failure blocks production promote

**Anti-pattern**:
- ❌ NO bypass gate via Vercel dashboard manual promote
- ❌ NO threshold reduction senza Andrea ratify

---

### §2.5 M-AR-05 Smart rollback machinery

**Scope**: `scripts/rollback-to-tag.sh` + `automa/state/baseline-tags.jsonl` registry. Rollback last-good-known state in <30s.

**Gap iter 30**: rollback manuale via `git revert` OR `git reset --hard` (DANGEROUS). NO immutable last-good-tag registry.

**Mechanism design**:

```bash
#!/bin/bash
# M-AR-05 Smart rollback machinery
# Pre-commit auto-tag baseline-iter{N}-{HHMM}
# scripts/rollback-to-last-good.sh restores last GREEN baseline

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

REGISTRY="automa/state/baseline-tags.jsonl"

# Auto-tag command (run via pre-commit AFTER all gates pass)
auto_tag() {
  local TAG="baseline-iter$(get_current_iter)-$(date +%H%M)"
  local SHA=$(git rev-parse HEAD)
  local TIMESTAMP=$(date -u +%FT%TZ)
  local VITEST_COUNT=$(cat automa/baseline-tests.txt | head -1)
  
  git tag -a "$TAG" -m "Baseline auto-tag $TAG vitest=$VITEST_COUNT"
  
  echo "{\"tag\":\"$TAG\",\"sha\":\"$SHA\",\"timestamp\":\"$TIMESTAMP\",\"vitest\":$VITEST_COUNT,\"iter\":\"$(get_current_iter)\"}" >> "$REGISTRY"
  echo "[auto-tag] Created $TAG"
}

# Rollback command
rollback_to_last_good() {
  if [ ! -f "$REGISTRY" ]; then
    echo "[rollback] FATAL: $REGISTRY missing"
    exit 1
  fi
  
  local LAST_GOOD=$(tail -1 "$REGISTRY" | jq -r '.tag')
  local LAST_SHA=$(tail -1 "$REGISTRY" | jq -r '.sha')
  
  echo "[rollback] Last good baseline: $LAST_GOOD ($LAST_SHA)"
  echo "[rollback] WARN: this resets working tree to $LAST_SHA"
  echo "[rollback] Type 'YES' to confirm:"
  read -r CONFIRM
  
  if [ "$CONFIRM" != "YES" ]; then
    echo "[rollback] aborted"
    exit 0
  fi
  
  # Stash current changes (preserve evidence)
  git stash push -u -m "rollback-evidence-$(date +%FT%T)" || true
  
  # Reset to tag (NOT --hard, just checkout)
  git checkout "$LAST_GOOD"
  
  echo "[rollback] Restored to $LAST_GOOD"
  echo "[rollback] Stash preserves working changes (recover via git stash list/pop)"
}

get_current_iter() {
  # Parse latest iter from CLAUDE.md sprint history footer
  grep -oE "Sprint T iter [0-9]+" CLAUDE.md | tail -1 | grep -oE "[0-9]+" | head -1
}

case "${1:-}" in
  --auto-tag) auto_tag ;;
  --rollback) rollback_to_last_good ;;
  *)
    echo "Usage: $0 [--auto-tag | --rollback]"
    exit 1
    ;;
esac
```

**Pre-commit integration** (additional gate post all PASS):

```bash
# .git/hooks/post-commit (M-AR-05 auto-tag)
bash scripts/rollback-machinery.sh --auto-tag
```

**Acceptance criteria**:
- Auto-tag ogni commit GREEN (post pre-commit gates)
- `automa/state/baseline-tags.jsonl` immutable registry
- Rollback command requires confirmation prompt
- NO `git reset --hard` (uses checkout)
- Stash preserves evidence pre-rollback

**Anti-pattern**:
- ❌ NO `git reset --hard` ever (M-AR-05 uses checkout + stash)
- ❌ NO delete tags retroactive
- ❌ NO rollback senza explicit user "YES" confirmation

---

## §3. Anti-Inflation mechanisms (5 atoms)

### §3.1 M-AI-01 Inflation flag registry append-only

**Scope**: machine-readable inflation flag log. Iter 39 Opus indipendente review trovato 3 inflation flags — registry per future cross-validation.

**Gap iter 30**: inflation flags in CLAUDE.md sprint history footer testuali, non parseable.

**Mechanism design**:

File: `automa/state/inflation-flags.jsonl` (append-only)

Format JSON Lines:

```jsonl
{"iter":39,"date":"2026-05-02","claim":"Onniscenza V2 LIVE","reality":"V2 reverted iter 39 commit eb4a11b -1.0pp PZ V3 + 36% slower","flag_severity":"HIGH","cap_delta":-0.30,"reviewer":"opus-indipendente","evidence_file":"docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md","status":"resolved"}
{"iter":39,"date":"2026-05-02","claim":"12-tool Deno dispatcher LIVE","reality":"fire-rate 0% (CANARY_DENO_DISPATCH_PERCENT=0 default safe commit 1feda3c, L2 template router dominance)","flag_severity":"HIGH","cap_delta":-0.20,"reviewer":"opus-indipendente","evidence_file":"docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md","status":"open"}
{"iter":39,"date":"2026-05-02","claim":"R5 latency cap REMOVED","reality":"latest 2026-05-02T07:28 0/8 BROKEN, iter 39 commits not re-benched","flag_severity":"HIGH","cap_delta":-0.10,"reviewer":"opus-indipendente","evidence_file":"docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md","status":"open"}
```

**Validator script** `scripts/validate-inflation-flags.sh`:

```bash
#!/bin/bash
# M-AI-01 inflation flag validator
# Checks: every "score_claim" requires zero open HIGH flags OR explicit accept

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
FLAGS="$REPO_ROOT/automa/state/inflation-flags.jsonl"
HISTORY="$REPO_ROOT/automa/state/score-history.jsonl"

if [ ! -f "$FLAGS" ]; then
  echo "[validator] No flags registry yet — first iter, OK"
  exit 0
fi

OPEN_HIGH=$(jq -s 'map(select(.status == "open" and .flag_severity == "HIGH")) | length' "$FLAGS")

if [ "$OPEN_HIGH" -gt 0 ]; then
  LATEST_ITER=$(tail -1 "$HISTORY" | jq -r '.iter')
  echo "[validator] WARN: $OPEN_HIGH open HIGH inflation flags at iter $LATEST_ITER"
  echo "[validator] Mandate: resolve flags OR explicit Andrea ratify accept-with-cap"
  jq -r 'select(.status == "open" and .flag_severity == "HIGH") | "  - \(.claim) (iter \(.iter))"' "$FLAGS"
  exit 1
fi

echo "[validator] PASS: 0 open HIGH inflation flags"
```

**Acceptance criteria**:
- Append-only JSON Lines file
- Per ogni flag: claim + reality + severity + cap_delta + reviewer + evidence_file + status
- Score claim iter close DEVE check 0 open HIGH flags
- Status transitions: open → investigating → resolved (NO retroactive delete)

**Anti-pattern**:
- ❌ NO retroactive edit past flag entries
- ❌ NO claim "score 8.5" senza inflation flag check
- ❌ NO status = resolved senza evidence file linking fix commit

---

### §3.2 M-AI-02 Mechanical cap enforcer

**Scope**: applies G45 mechanical caps automatically. PDR §4 R5 latency cap, R7 canonical cap, Lighthouse perf cap, esperimenti broken count cap.

**Gap iter 30**: cap enforcement manuale (e.g., iter 38 cap 8.0 PDR §4 R5 latency mechanical TRIGGERED → cap enforced ONESTO ma manuale).

**Mechanism design**:

File: `automa/state/mechanical-caps.json`:

```json
{
  "version": 1,
  "caps": [
    {
      "name": "R5_LATENCY",
      "trigger_condition": "r5_p95_ms > 2500",
      "cap_score": 8.0,
      "rationale": "PDR target p95 <2500ms. Latency mechanical anti-inflation."
    },
    {
      "name": "R7_CANONICAL",
      "trigger_condition": "r7_canonical_pct < 80",
      "cap_score": 8.5,
      "rationale": "INTENT canonical schema rate <80% indicates Onnipotenza Sprint T close blocker."
    },
    {
      "name": "LIGHTHOUSE_PERF",
      "trigger_condition": "lighthouse_perf_min < 70",
      "cap_score": 8.0,
      "rationale": "Lighthouse perf <70 across any route indicates frontend regression iter 38 baseline 26+23 FAIL."
    },
    {
      "name": "ESPERIMENTI_BROKEN",
      "trigger_condition": "esperimenti_broken_count > 10",
      "cap_score": 8.5,
      "rationale": "Sprint T close gate Andrea iter 21 mandate 94 esperimenti audit."
    },
    {
      "name": "VITEST_REGRESSION",
      "trigger_condition": "vitest_count < baseline",
      "cap_score": 7.0,
      "rationale": "Test regression hard cap — anti-regressione mandate FERREA."
    }
  ]
}
```

Enforcer script `scripts/enforce-g45-cap.sh`:

```bash
#!/bin/bash
# M-AI-02 Mechanical cap enforcer
# Reads latest score-history.jsonl entry + caps + applies max cap

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
HISTORY="$REPO_ROOT/automa/state/score-history.jsonl"
CAPS_FILE="$REPO_ROOT/automa/state/mechanical-caps.json"

LATEST=$(tail -1 "$HISTORY")
RAW_SCORE=$(echo "$LATEST" | jq -r '.score_claim')
EVIDENCE=$(echo "$LATEST" | jq -c '.evidence')

CAP_APPLIED="$RAW_SCORE"
TRIGGERED_CAPS=()

# Iterate caps
while IFS= read -r CAP; do
  NAME=$(echo "$CAP" | jq -r '.name')
  CONDITION=$(echo "$CAP" | jq -r '.trigger_condition')
  CAP_SCORE=$(echo "$CAP" | jq -r '.cap_score')
  
  # Evaluate condition (basic eval — production needs sandboxed expr)
  case "$NAME" in
    R5_LATENCY)
      P95=$(echo "$EVIDENCE" | jq -r '.r5_p95_ms // 0')
      [ "$P95" -gt 2500 ] && TRIGGERED=1 || TRIGGERED=0
      ;;
    R7_CANONICAL)
      RATE=$(echo "$EVIDENCE" | jq -r '.r7_canonical_pct // 100' | cut -d. -f1)
      [ "$RATE" -lt 80 ] && TRIGGERED=1 || TRIGGERED=0
      ;;
    LIGHTHOUSE_PERF)
      MIN=$(echo "$EVIDENCE" | jq -r '[.lighthouse_perf_chatbot, .lighthouse_perf_easter] | min // 100')
      [ "$MIN" -lt 70 ] && TRIGGERED=1 || TRIGGERED=0
      ;;
    ESPERIMENTI_BROKEN)
      COUNT=$(echo "$EVIDENCE" | jq -r '.esperimenti_broken_count // 0')
      [ "$COUNT" -gt 10 ] && TRIGGERED=1 || TRIGGERED=0
      ;;
    VITEST_REGRESSION)
      ACTUAL=$(echo "$EVIDENCE" | jq -r '.vitest_count // 0')
      BASELINE=$(cat automa/baseline-tests.txt | head -1)
      [ "$ACTUAL" -lt "$BASELINE" ] && TRIGGERED=1 || TRIGGERED=0
      ;;
  esac
  
  if [ "$TRIGGERED" = "1" ]; then
    TRIGGERED_CAPS+=("$NAME=$CAP_SCORE")
    if [ "$(echo "$CAP_APPLIED > $CAP_SCORE" | bc)" = "1" ]; then
      CAP_APPLIED="$CAP_SCORE"
    fi
  fi
done < <(jq -c '.caps[]' "$CAPS_FILE")

if [ "$(echo "$CAP_APPLIED < $RAW_SCORE" | bc)" = "1" ]; then
  echo "[cap-enforcer] CAP APPLIED: raw=$RAW_SCORE → cap=$CAP_APPLIED"
  echo "[cap-enforcer] Triggered: ${TRIGGERED_CAPS[*]}"
  
  # Update score-history with cap applied
  TIMESTAMP=$(date -u +%FT%TZ)
  echo "$LATEST" | jq --arg cap "$CAP_APPLIED" --arg triggered "$(echo "${TRIGGERED_CAPS[*]}")" \
    '.score_capped = ($cap | tonumber) | .triggered_caps = ($triggered | split(" "))' \
    >> "$HISTORY.tmp"
  mv "$HISTORY.tmp" "$HISTORY"
else
  echo "[cap-enforcer] No caps triggered, score $RAW_SCORE preserved"
fi
```

**Acceptance criteria**:
- Caps definitions in single JSON source of truth
- Enforcer runs post-iter-close ALL atoms verified
- Triggered caps logged to score-history
- Lower cap wins (most restrictive)

**Anti-pattern**:
- ❌ NO override cap manually senza Andrea Opus G45 review
- ❌ NO change cap_score values senza ADR ratify
- ❌ NO disable enforcer

---

### §3.3 M-AI-03 Claim-reality gap detector

**Scope**: greps documentation per phrase "LIVE" / "DEPLOYED" / "COMPLETE" / "ACHIEVED" / "FIXED" + cross-checks file system + Edge Function deployment + bench output.

**Gap iter 30**: many docs claim "LIVE" or "DEPLOYED" senza file system verify. Iter 39 Opus found "Onniscenza V2 LIVE" claim was FALSE (V2 reverted).

**Mechanism design**:

```bash
#!/bin/bash
# M-AI-03 Claim-reality gap detector
# Greps docs for high-confidence claims + verifies against file system + Supabase + bench

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

CLAIMS_FILE=$(mktemp)
GAPS_FILE="docs/audits/iter-31-claim-reality-gaps.md"
mkdir -p docs/audits

# Pattern 1 — "LIVE prod"
grep -rn "LIVE prod" docs/ CLAUDE.md 2>/dev/null | head -50 > "$CLAIMS_FILE"

# Pattern 2 — "DEPLOYED"
grep -rn "DEPLOYED" docs/ CLAUDE.md 2>/dev/null | head -50 >> "$CLAIMS_FILE"

# Pattern 3 — "ACHIEVED"
grep -rn "ACHIEVED" docs/ CLAUDE.md 2>/dev/null | head -50 >> "$CLAIMS_FILE"

# Pattern 4 — "≥XX% PASS"
grep -rnE "≥[0-9]+%\s*PASS" docs/ CLAUDE.md 2>/dev/null | head -50 >> "$CLAIMS_FILE"

cat > "$GAPS_FILE" <<EOF
# Claim-Reality Gap Detector Iter 31

**Date**: $(date -u +%FT%TZ)
**Total claims surfaced**: $(wc -l < "$CLAIMS_FILE")

## Methodology

1. Grep docs/ + CLAUDE.md for high-confidence claim phrases
2. Cross-check each claim against:
   - File system (file exists OR symbol present)
   - Supabase Edge Function deployment status (npx supabase functions list)
   - Bench output ID (scripts/bench/output/*.{json,jsonl})
3. Flag GAP if claim NOT verifiable against reality

## Verification table

| # | Claim location | Claim text | Verification | Status |
|---|----------------|------------|--------------|--------|
EOF

# For each claim, attempt verification
LINE=0
while IFS= read -r CLAIM_LINE; do
  LINE=$((LINE+1))
  [ "$LINE" -gt 30 ] && break  # Cap manual review
  
  FILE=$(echo "$CLAIM_LINE" | cut -d: -f1)
  LINE_NUM=$(echo "$CLAIM_LINE" | cut -d: -f2)
  TEXT=$(echo "$CLAIM_LINE" | cut -d: -f3- | head -c 100)
  
  echo "| $LINE | $FILE:$LINE_NUM | $TEXT | TODO manual cross-check | OPEN |" >> "$GAPS_FILE"
done < "$CLAIMS_FILE"

cat >> "$GAPS_FILE" <<EOF

## Recommendations

- For each OPEN claim, manually verify against:
  1. File system: \`grep -rn "<symbol>" src/ supabase/\`
  2. Supabase deploy: \`npx supabase functions list --project-ref euqpdueopmlllqjmqnyb\`
  3. Bench output: \`ls scripts/bench/output/ | tail -5\`
  4. Vercel deploy: \`vercel ls --prod\`
- Flag false claims as inflation in \`automa/state/inflation-flags.jsonl\`
- Update doc to honest status (e.g., "PROPOSED" / "DEFERRED" / "REVERTED")
EOF

rm -f "$CLAIMS_FILE"

echo "[gap-detector] Output: $GAPS_FILE"
echo "[gap-detector] Manual cross-check 30 claims required iter 31+ entrance"
```

**Acceptance criteria**:
- Runs ogni iter close
- Surfaces all "LIVE" / "DEPLOYED" / "ACHIEVED" claims
- Per claim: location + text + status (open / verified / flagged)
- Manual cross-check 30 claims/run realistic budget

**Anti-pattern**:
- ❌ NO mark verified senza explicit cross-check (file system OR bench OR deploy)
- ❌ NO ignore OPEN claims in iter close
- ❌ NO "LIVE" claim senza commit reference + bench output ID

---

### §3.4 M-AI-04 Documentation drift detector

**Scope**: ToolSpec count + RAG chunks count + Wiki concepts count + lesson-paths count cross-doc consistency check.

**Gap iter 30**: iter 28 docs claimed ToolSpec=62, iter 37 reverify =57 (5-count drift). Iter 38 docs claim "RAG 1881 chunks" + iter 41 Phase E "718 chunks NEW" = drift unclear total.

**Mechanism design**:

```bash
#!/bin/bash
# M-AI-04 Documentation drift detector
# Counts ground-truth file system + cross-greps docs for matching numbers

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

REPORT="docs/audits/iter-31-doc-drift-detector.md"
mkdir -p docs/audits

# Ground truth measurements
TOOLSPEC_GT=$(grep -cE "^  name: ['\"]" scripts/openclaw/tools-registry.ts)
LESSON_PATHS_GT=$(ls src/data/lesson-paths/v[1-3]-cap*-esp*.json 2>/dev/null | wc -l | tr -d ' ')
WIKI_GT=$(ls docs/unlim-wiki/concepts/*.md 2>/dev/null | wc -l | tr -d ' ')
LEZIONI_GT=$(grep -c "name:" src/data/lesson-groups.js 2>/dev/null || echo 0)
EXPERIMENTS_GT=$(grep -c "id:" src/data/experiments-vol*.js 2>/dev/null | awk -F: '{s+=$2} END {print s}')

cat > "$REPORT" <<EOF
# Documentation Drift Detector Iter 31

**Date**: $(date -u +%FT%TZ)

## Ground truth file system measurements

| Metric | Ground truth | Method |
|---|---|---|
| ToolSpec count | $TOOLSPEC_GT | grep \`name:\` tools-registry.ts |
| Lesson-paths count | $LESSON_PATHS_GT | ls v[1-3]-cap*-esp*.json |
| Wiki concepts count | $WIKI_GT | ls docs/unlim-wiki/concepts/*.md |
| Lezioni groups | $LEZIONI_GT | grep name: lesson-groups.js |
| Experiments aggregate | $EXPERIMENTS_GT | grep id: experiments-vol*.js |

## Doc claims cross-check

EOF

check_drift() {
  local NAME="$1"
  local GT="$2"
  local PATTERN="$3"
  
  echo "" >> "$REPORT"
  echo "### $NAME (ground truth $GT)" >> "$REPORT"
  echo "" >> "$REPORT"
  echo "| Doc | Line | Claim | Drift |" >> "$REPORT"
  echo "|---|---|---|---|" >> "$REPORT"
  
  grep -rn "$PATTERN" docs/ CLAUDE.md 2>/dev/null | head -20 | while IFS= read -r LINE; do
    FILE=$(echo "$LINE" | cut -d: -f1)
    LINE_NUM=$(echo "$LINE" | cut -d: -f2)
    TEXT=$(echo "$LINE" | cut -d: -f3- | head -c 80)
    
    # Extract number near pattern
    CLAIMED=$(echo "$TEXT" | grep -oE '[0-9]+' | head -1)
    
    if [ -n "$CLAIMED" ]; then
      DELTA=$((CLAIMED - GT))
      DELTA_ABS=${DELTA#-}
      
      if [ "$DELTA_ABS" -gt 0 ]; then
        echo "| $FILE | $LINE_NUM | $TEXT | $DELTA |" >> "$REPORT"
      fi
    fi
  done
}

check_drift "ToolSpec count" "$TOOLSPEC_GT" "ToolSpec"
check_drift "Lesson-paths count" "$LESSON_PATHS_GT" "lesson-paths"
check_drift "Wiki concepts count" "$WIKI_GT" "wiki concept"
check_drift "Experiments count" "$EXPERIMENTS_GT" "esperimenti"

cat >> "$REPORT" <<EOF

## Recommendations

- For each drift entry, update doc OR flag in inflation-flags.jsonl
- ToolSpec count canonical = file system grep, NOT manual count
- Wiki concepts count canonical = ls glob, NOT memorized
- Lesson-paths count canonical = ls glob, NOT iter-summary

## Anti-pattern

- ❌ NO claim "X items" senza file system grep verify
- ❌ NO retroactive edit doc count post-fact (track via baseline-tag commit)
EOF

echo "[drift-detector] Output: $REPORT"
```

**Acceptance criteria**:
- Runs ogni iter close
- Ground truth = file system grep / ls
- Doc claims cross-checked
- Drift >0 → flag inflation

**Anti-pattern**:
- ❌ NO claim count from memory (always grep)
- ❌ NO retroactive edit doc count
- ❌ NO ignore drift >5 entries

---

### §3.5 M-AI-05 Opus G45 review automation

**Scope**: spawn distinct Claude session context-zero per Phase 7 master plan iter close. Review iter close baseline + 14 boxes + bonus + cap reasons + flag inflations.

**Gap iter 30**: Phase 1 Opus indipendente review iter 39 manual. Repeat per ogni Sprint close pattern.

**Mechanism design**:

File: `scripts/spawn-opus-g45-review.sh`:

```bash
#!/bin/bash
# M-AI-05 Opus G45 review spawner
# Usage: bash scripts/spawn-opus-g45-review.sh [iter_N]

set -euo pipefail
ITER="${1:-$(grep -oE 'Sprint T iter [0-9]+' CLAUDE.md | tail -1 | grep -oE '[0-9]+')}"
DATE=$(date -u +%Y-%m-%d)
OUTPUT_FILE="docs/audits/G45-OPUS-INDIPENDENTE-iter${ITER}-${DATE}.md"
PROMPT_FILE="docs/handoff/g45-opus-prompt-iter${ITER}.md"

# Generate prompt context-zero
cat > "$PROMPT_FILE" <<EOF
# G45 Opus Indipendente Review Iter $ITER

**Date**: $DATE
**Mode**: context-zero (NO prior session memory)
**Mandate**: ONESTO, NO compiacenza, G45 cap

## Required reading (in order)

1. \`docs/audits/PHASE-0-discovery-${DATE}.md\` — discovery baseline
2. \`docs/audits/PHASE-0-baseline-${DATE}.md\` — measured baseline
3. \`automa/state/score-history.jsonl\` — last 5 entries
4. \`automa/state/inflation-flags.jsonl\` — open flags
5. CLAUDE.md sprint history footer iter $ITER close section
6. \`docs/audits/iter-${ITER}-doc-drift-detector.md\` — drift findings
7. \`docs/audits/iter-${ITER}-claim-reality-gaps.md\` — gap findings

## Review tasks

1. Verify each Sprint T iter $ITER claim against:
   - File system grep
   - Git log + git blame
   - Phase 0 baseline measurements
   - Bench output ID
   - Supabase deploy status
2. Issue independent score 0-10 ONESTO
3. NO compiacenza — explicit caveat where claims unverifiable
4. Flag ≥3 inflations OR justify score senza flag con razionale concreto

## Output

\`$OUTPUT_FILE\` — minimum 500+ righe, 12 sections required:
- §1 Executive summary score Opus indipendente
- §2 Methodology
- §3 Claim verification table (file:line citations)
- §4 Inflation flags identified (or absence justified)
- §5 Score box-by-box rationale 14 boxes
- §6 Cap mechanics applied
- §7 Honest gaps
- §8 Recommendations iter $((ITER+1))+
- §9 Anti-pattern checklist
- §10 Score final justification
- §11 Cross-link
- §12 Status

## Acceptance gates

- [ ] Opus distinct conversation context-zero (NO prior memory)
- [ ] Doc shipped + committed origin
- [ ] Score Opus ≤ score_claim OR justified ≥ con razionale concreto
- [ ] CLAUDE.md sprint history footer recalibrate post review
- [ ] \`automa/state/score-history.jsonl\` entry updated with score_opus_review field
EOF

cat <<INSTRUCTIONS

============================================
M-AI-05 Opus G45 Review prompt generated:
$PROMPT_FILE
============================================

To execute:
1. Open NEW Claude Code conversation (NOT this one — context-zero mandate)
2. Paste contents of $PROMPT_FILE as initial prompt
3. Output saved to $OUTPUT_FILE
4. Update automa/state/score-history.jsonl with score_opus_review field
5. Commit + push origin
INSTRUCTIONS
```

**Acceptance criteria**:
- Distinct conversation context-zero (current session does NOT review own work)
- Output minimum 500 LOC
- 12 sections required
- Score Opus ≤ score_claim OR justified ≥
- CLAUDE.md footer recalibrated post review

**Anti-pattern**:
- ❌ NO same-session self-review (defeats Opus indipendente purpose)
- ❌ NO score Opus = score_claim auto-pass
- ❌ NO skip Phase 7 master plan review

---

## §4. Cross-cutting mechanisms (2 atoms)

### §4.1 M-CC-01 Skill execution log + digest signing

**Scope**: ogni invoke skill output → JSON Lines log + SHA-256 digest. Immutable audit trail per skill measurement.

**Gap iter 30**: skill outputs ephemeral, NOT archived. Cannot reproduce score history.

**Mechanism design**:

```bash
#!/bin/bash
# M-CC-01 Skill execution log + digest
# Wrap skill invocations with logging

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
LOG_FILE="$REPO_ROOT/automa/state/skill-runs.jsonl"

invoke_skill_with_log() {
  local SKILL_NAME="$1"
  local OUTPUT_FILE="/tmp/skill-output-$(date +%s).md"
  
  echo "[skill-log] Invoking $SKILL_NAME"
  # Pseudo: actual invoke depends on Claude Code Skill tool integration
  # Output captured to OUTPUT_FILE
  
  local DIGEST=$(shasum -a 256 "$OUTPUT_FILE" | cut -d' ' -f1)
  local TIMESTAMP=$(date -u +%FT%TZ)
  local SHA=$(git rev-parse HEAD)
  
  # Append log entry
  jq -n \
    --arg skill "$SKILL_NAME" \
    --arg ts "$TIMESTAMP" \
    --arg sha "$SHA" \
    --arg digest "$DIGEST" \
    --arg output_path "$OUTPUT_FILE" \
    '{skill:$skill, timestamp:$ts, commit:$sha, digest:$digest, output_path:$output_path}' \
    >> "$LOG_FILE"
  
  echo "[skill-log] Logged $SKILL_NAME digest=$DIGEST"
  cat "$OUTPUT_FILE"
}

invoke_skill_with_log "$@"
```

**Acceptance criteria**:
- Append-only `automa/state/skill-runs.jsonl`
- Per entry: skill name + timestamp + commit SHA + output digest + path
- Output files archived `docs/audits/skill-runs/{skill}-{timestamp}.md`
- Reproduce score: cross-reference skill-runs by digest

**Anti-pattern**:
- ❌ NO claim "skill measured X" senza skill-runs.jsonl entry
- ❌ NO retroactive edit log entries
- ❌ NO bypass digest signing

---

### §4.2 M-CC-02 CI workflow GitHub Actions multi-gate

**Scope**: GitHub Actions workflow ogni PR triggers ALL gates: vitest + build + R5 smoke + Lighthouse + drift + flags + claim-gap.

**Gap iter 30**: pre-commit + pre-push hook locale solo. NO CI per cross-developer (Tea + Andrea). PRs may merge senza gates.

**Mechanism design**:

File: `.github/workflows/iter-31-anti-regression-gates.yml`:

```yaml
name: Iter 31+ Anti-Regression + Anti-Inflation Gates

on:
  pull_request:
    branches: [main, e2e-bypass-preview]
  push:
    branches: [e2e-bypass-preview]

jobs:
  vitest-baseline:
    name: Vitest baseline preserve
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: |
          EXPECTED=$(cat automa/baseline-tests.txt | head -1)
          npx vitest run --reporter=basic 2>&1 | tee /tmp/vitest.log
          ACTUAL=$(grep -oE "[0-9]+ passed" /tmp/vitest.log | head -1 | grep -oE "[0-9]+")
          if [ "$ACTUAL" -lt "$EXPECTED" ]; then
            echo "REGRESSION: $ACTUAL < $EXPECTED"
            exit 1
          fi

  build:
    name: Build PASS
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run build

  bundle-size:
    name: Bundle size budget
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - run: |
          BUDGET_KB=4900
          ACTUAL_KB=$(du -sk dist/assets | awk '{print $1}')
          if [ "$ACTUAL_KB" -gt "$BUDGET_KB" ]; then
            echo "BUDGET EXCEEDED: $ACTUAL_KB > $BUDGET_KB"
            exit 1
          fi

  r5-smoke:
    name: R5 smoke 5-prompt
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.changed_files, 'supabase/functions/')
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - env:
          ELAB_API_KEY: ${{ secrets.ELAB_API_KEY }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: |
          PASS=$(node scripts/bench/run-r5-smoke.mjs 2>&1 | grep -c "PASS")
          if [ "$PASS" -lt 5 ]; then
            echo "R5 SMOKE REGRESSION: $PASS/5 PASS"
            exit 1
          fi

  drift-detector:
    name: Documentation drift
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bash scripts/detect-doc-drift.sh
      - run: |
          DRIFT_COUNT=$(grep -c "^| docs" docs/audits/iter-*-doc-drift-detector.md 2>/dev/null | tail -1 | cut -d: -f2 || echo 0)
          if [ "$DRIFT_COUNT" -gt 5 ]; then
            echo "DRIFT EXCESSIVE: $DRIFT_COUNT entries > 5 threshold"
            exit 1
          fi

  inflation-flags:
    name: Open inflation flags check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bash scripts/validate-inflation-flags.sh

  claim-reality-gap:
    name: Claim-reality gap
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bash scripts/detect-claim-reality-gap.sh

  score-history-validate:
    name: Score history validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bash scripts/validate-score-history.sh

  lighthouse-gate:
    name: Lighthouse perf gate
    runs-on: ubuntu-latest
    if: github.event_name == 'deployment_status'
    steps:
      - uses: actions/checkout@v4
      - run: bash scripts/lighthouse-deploy-gate.sh ${{ github.event.deployment_status.target_url }}

  status-required:
    name: All gates required
    runs-on: ubuntu-latest
    needs:
      - vitest-baseline
      - build
      - bundle-size
      - drift-detector
      - inflation-flags
      - claim-reality-gap
      - score-history-validate
    steps:
      - run: echo "All required gates PASS"
```

**Branch protection** GitHub repo settings:
- main + e2e-bypass-preview branches REQUIRE all 7 status checks (vitest + build + bundle + drift + flags + claim-gap + score-history)
- 1 reviewer approval required
- Dismiss stale reviews on push
- NO force-push allowed

**Acceptance criteria**:
- All 7 gates required for PR merge
- Tea + Andrea PRs both gated
- Failure on ANY gate → PR blocked
- GitHub branch protection LIVE post atom 4.2 deploy

**Anti-pattern**:
- ❌ NO override branch protection senza Andrea explicit
- ❌ NO admin merge bypass gates
- ❌ NO disable gate workflows

---

## §5. Deployment plan iter 31+ entrance

### §5.1 Phase 1 atoms (must-deploy iter 31 entrance, ~6h)

| # | Mechanism | Owner | Estimate | Blocker |
|---|---|---|---|---|
| 1 | M-AR-01 Auto-revert pre-commit ENHANCED | Maker-1 | 1h | Andrea ratify Phase 0 |
| 2 | M-AI-01 Score history registry | Maker-1 | 30min | None |
| 3 | M-AI-01 inflation-flags.jsonl bootstrap | Maker-2 | 30min | None |
| 4 | M-AI-04 Doc drift detector | Maker-2 | 1h | None |
| 5 | M-AI-03 Claim-reality gap detector | Tester-1 | 1h | None |
| 6 | M-AR-05 Smart rollback machinery | Maker-1 | 1h | None |
| 7 | M-AI-02 mechanical-caps.json + enforcer | Architect | 1h | None |

### §5.2 Phase 2 atoms (deploy iter 32+ post Andrea ratify)

| # | Mechanism | Owner | Estimate | Blocker |
|---|---|---|---|---|
| 8 | M-AR-03 Mac Mini regression diff | Maker-1 | 1h | M-AR-01 + Mac Mini cron LIVE |
| 9 | M-AR-04 Lighthouse gate | Maker-2 | 1.5h | Vercel deploy hook integration |
| 10 | M-CC-02 GitHub Actions workflow | Maker-1 | 2h | M-AR-01 + secrets configured |
| 11 | M-CC-01 Skill execution log | Tester-1 | 1.5h | Skill tool integration |
| 12 | M-AI-05 Opus G45 review automation | Tester-2 | 1h | Andrea Opus session distinct |

---

## §6. CoV mandate for mechanisms themselves

Per ogni mechanism deployment, CoV 3-step:

1. **CoV-1 dry-run**: bash script -h help OR --dry-run mode produces expected output
2. **CoV-2 unit tests**: `tests/unit/scripts/{mechanism}.test.js` 5+ cases
3. **CoV-3 integration**: real iter close runs mechanism + emits audit log entry

Failure ANY CoV → revert mechanism + investigate via systematic-debugging.

---

## §7. Anti-pattern checklist (cross all mechanisms)

- ❌ NO `--no-verify` ever (Andrea iter 21 mandate ferreo)
- ❌ NO `git push --force` ever (M-AR-05 uses checkout + stash)
- ❌ NO `git reset --hard` ever (preserve evidence)
- ❌ NO retroactive edit append-only registries (`score-history.jsonl`, `inflation-flags.jsonl`, `skill-runs.jsonl`, `baseline-tags.jsonl`)
- ❌ NO claim "score X" senza score-history.jsonl entry + evidence field
- ❌ NO claim "LIVE" senza claim-reality-gap detector verify + cross-check
- ❌ NO score Opus = score_claim auto-pass (Phase 7 mandate distinct review)
- ❌ NO disable enforcer scripts senza Andrea ratify
- ❌ NO change cap thresholds senza ADR ratify
- ❌ NO bypass GitHub branch protection
- ❌ NO override Lighthouse gate manual Vercel promote
- ❌ NO ignore Mac Mini regression flag
- ❌ NO cherry-pick R5 smoke 5/5 skip 50-prompt full distribution

---

## §8. State machine — score iter close

```
Iter close trigger
   ↓
Phase 6 close — all atoms complete
   ↓
M-AI-04 doc drift detector
   ↓ (drift > 5 → BLOCK)
M-AI-03 claim-reality gap detector
   ↓ (open claims > 5 → MANUAL CROSS-CHECK)
M-AR-01 pre-commit gates
   ↓ (vitest regression OR bundle exceed → BLOCK)
M-AR-04 Lighthouse gate (post-deploy)
   ↓ (perf < 70 → CAP TRIGGER)
M-AI-02 mechanical cap enforcer
   ↓ (caps applied → score_capped < score_claim)
M-AI-01 score-history.jsonl entry append
   ↓
Phase 7 — M-AI-05 Opus G45 review
   ↓ (score_opus_review ≤ score_claim OR justified)
M-AI-01 update score_opus_review field
   ↓
Iter close FINAL = max(score_capped, score_opus_review)
   ↓
CLAUDE.md sprint history footer recalibrate
   ↓
M-CC-02 commit + push (gates re-verify CI)
```

---

## §9. Glossary

- **G45 cap**: Andrea anti-inflation mandate — score honest cap, NO claim above ceiling without explicit reasoning
- **CoV** (Chain of Verification): 3-step verify ogni atom (baseline + incremental + finale)
- **Mechanical cap**: machine-enforced ceiling triggered by metric thresholds (R5/R7/Lighthouse/etc.)
- **Inflation flag**: documented gap between claim and reality, tracked in registry
- **Drift**: number/count claimed in doc differs from file system ground truth
- **Opus G45 review**: distinct context-zero session reviewing iter close ONESTO
- **Score history**: append-only JSON Lines registry of all iter close scores
- **Skill-runs log**: digest-signed audit trail of skill measurement outputs
- **Baseline tag**: git tag auto-created post pre-commit GREEN gates pass
- **Phase 7**: master plan iter 31+ final phase — Opus review + commit + push

---

## §10. Cross-link

- Master plan iter 31: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`
- 13 decisioni priority matrix: `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md`
- Andrea baseline mandate: CLAUDE.md "Anti-regressione (FERREA)"
- G45 mandate origin: `docs/audits/G45-audit-brutale.md` iter 39 + Phase 1 Opus indipendente baseline
- 5 metric skills: `.claude/skills/elab-{morfismo,onniscenza,velocita,onnipotenza,principio-zero}-*/SKILL.md`
- Tea brief iter 31: `docs/handoff/2026-05-02-tea-iter-31-brief.md` §5 CoV mandate Tea contributions
- Mac Mini persona-prof: `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md` §4 CoV mandate ogni cycle

---

## §11. Status

**Iter 30 docs-only**: 12 mechanisms documented + scripts ready-paste. NO deploy iter 30 (Andrea no-fix mandate). Iter 31+ entrance Phase 1 atoms 1-7 priority deploy ~6h Maker-1 + Maker-2 + Architect + Tester-1.

**Anti-inflation G45 cap mandate enforced** on this doc itself:
- ❌ NO claim "mechanisms LIVE" — all PROPOSED iter 31+
- ❌ NO claim "regression eliminated" — mechanisms reduce regression risk, NOT eliminate
- ❌ NO claim "inflation impossible post-deploy" — humans + agents still author claims, mechanisms detect drift post-fact
- ❌ NO claim "Opus G45 review automatable end-to-end" — distinct Claude session required (NO same-session self-review)

**Realistic impact projection**:
- M-AR-01: pre-commit gates catch 95%+ vitest regressions
- M-AI-01 + M-AI-02: score inflation drift >0.5 always flagged + capped
- M-AI-03 + M-AI-04: documentation drift surfaces 80%+ claims gap
- M-AR-03: Mac Mini regression flag ≤10min lag
- M-CC-02: cross-developer (Tea + Andrea) PRs uniformly gated

**Residual gap** (mechanism limits):
- Subtle hallucinations in NEW claims NOT covered by drift detector (e.g., novel feature LIVE claim)
- Opus G45 review still requires Andrea wall-clock budget ≥30min/iter
- Mac Mini cron false-positives possible (gap analysis defects 1-3 iter 30 still apply pre-fix)
- LLM-based claim-reality gap detector NOT implemented (regex heuristic only)
