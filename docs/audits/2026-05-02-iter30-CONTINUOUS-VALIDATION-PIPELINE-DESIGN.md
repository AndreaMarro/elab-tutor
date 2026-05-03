# Continuous Validation Pipeline (CVP) Design — Workflow Robusto + Potente

**Date**: 2026-05-02 (iter 30 docs-only)
**Mode**: design analisi — workflow autonomous H24 lavoro+test+ricerca+validazione massive scale
**Anti-inflation**: G45 cap. NO claim "CVP LIVE" senza phased deploy iter 32+ + Andrea ratify + 24h soak.
**Cross-link**: estende 12 mechanisms `2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md` + 5 metric skills + master plan iter 31

---

## §1. Goal

Workflow lavora autonomo H24 → produce + testa + ricerca + valida MASSIVE scale → Andrea solo dev capacity x10. Honest verifiable, NO marketing inflation.

---

## §2. 3-Tier Architecture

### §2.1 Tier 1 — Active Sync (Andrea-driven, 4-8h/giorno)

```
Andrea MacBook Claude Code Opus 4.7 1M
   ↓
Pattern S 6-agent OPUS PHASE-PHASE r3 caveman
   ↓
12 atoms / iter via planner-opus decomposition
   ↓
Maker-1 + Maker-2 + Tester-1 parallel atoms
   ↓
Scribe-opus sequential audit + handoff
   ↓
Phase 7 commit + push + Opus G45 review distinct
```

**Cadenza**: 1 iter/giorno wall-clock attivo. ~26h dev wall-clock per iter (split 5 giorni).

### §2.2 Tier 2 — Continuous H24 (Mac Mini autonomous)

```
Mac Mini Strambino Tailscale SSH
   ↓
6 cron entries parallel
   ↓
- */10 audit single esperimento rotation 94
- 0 */2 R5 smoke 5-prompt
- 0 */4 doc drift detector + claim-reality gap
- 0 */6 R5+R6 stress 50+100 prompt
- 0 0 daily fullsweep 94 esperimenti + Lighthouse 4 routes
- 0 6 daily aggregate dashboard + git push
   ↓
Output JSON + screenshots → docs/audits/auto-mac-mini/
   ↓
Auto-commit + push GitHub branch mac-mini/audit-* visibility Andrea mobile
```

**Cadenza**: 144 cycles/24h + 4 stress + 6 drift checks + 1 fullsweep + 1 dashboard daily.

### §2.3 Tier 3 — Cross-iter Research + Validation (BG agents weekly)

```
BG Agent dispatch ogni domenica 22:00 CEST
   ↓
- A1 Competitor analysis (Tinkercad/Wokwi/LabsLand pricing+features)
- A2 Latency Pareto (R5+R6+R7 history diff trend)
- A3 Hallucination spot-check (10 wiki concepts random Vol/pag verify)
- A4 Marketing research (Reddit + HN + Twitter "ELAB Tutor" + "Arduino education K-12")
- A5 Tea coordination report (UAT progress aggregate + critical findings)
- A6 Andrea Opus G45 review M-AI-05 distinct context-zero session iter close
   ↓
Output: docs/research/weekly/{date}/A{N}-*.md
   ↓
Andrea reads weekly Sunday review (~30min)
```

**Cadenza**: 6 BG agents weekly. ~2h Andrea wall-clock weekly review.

---

## §3. 3 Continuous Validation Streams

### §3.1 STREAM A — Unit + Integration Tests

**Mandate**: vitest 13474+ baseline NEVER scendere. Ogni atom delta tests.

```
┌─────────────────────────────────────────────────┐
│ Stream A — Unit + Integration                   │
├─────────────────────────────────────────────────┤
│ Layer 1: vitest watch mode (Andrea local dev)   │
│ Layer 2: pre-commit hook M-AR-01 enhanced gate  │
│ Layer 3: CI matrix multi-job M-CC-02 GitHub     │
│ Layer 4: coverage thresholds enforced (NEW)     │
│ Layer 5: mutation testing Stryker.js iter 33+   │
└─────────────────────────────────────────────────┘
```

### §3.2 STREAM B — E2E + UAT

**Mandate**: Playwright 94 esperimenti audit + persona-prof + 9-cell STT + wake word + Lavagna persistence + Fumetto E2E.

```
┌─────────────────────────────────────────────────┐
│ Stream B — E2E + UAT                            │
├─────────────────────────────────────────────────┤
│ Layer 1: Mac Mini cron */10 audit single exp    │
│ Layer 2: persona-prof spec Stages 1-7 atomic    │
│ Layer 3: 9-cell STT matrix monthly              │
│ Layer 4: Lavagna persistence + Fumetto + Vision │
│ Layer 5: Tea UAT manual weekly Vol1/2/3         │
│ Layer 6: regression diff detector M-AR-03 NEW   │
└─────────────────────────────────────────────────┘
```

### §3.3 STREAM C — Production Benchmark + Research

**Mandate**: R5+R6+R7 stress continuous + 5 metric skills + competitor + Lighthouse + Edge logs aggregation.

```
┌─────────────────────────────────────────────────┐
│ Stream C — Bench + Research                     │
├─────────────────────────────────────────────────┤
│ Layer 1: R5 cron 0 */6 50-prompt (4×/day)      │
│ Layer 2: R6 cron 0 0 100-prompt (daily)        │
│ Layer 3: R7 cron 0 0 1 * 200-prompt (monthly)  │
│ Layer 4: 5 metric skills cron 0 */12           │
│ Layer 5: Lighthouse cron 0 0 4 routes daily    │
│ Layer 6: Edge logs anti-absurd + intent rate   │
│ Layer 7: BG weekly competitor + research       │
└─────────────────────────────────────────────────┘
```

---

## §4. 8 NEW Mechanisms (estensione 12 esistenti)

### §4.1 M-NEW-13 Continuous bench differ

**Scope**: confronta cycle N vs N-1 bench output. Auto-flag regression >10% any metric.

```bash
#!/bin/bash
# scripts/bench-diff-detector.sh
# M-NEW-13 continuous bench differ

set -euo pipefail
BENCH_DIR="scripts/bench/output"
CURRENT=$(ls -t "$BENCH_DIR"/r5-stress-*.json | head -1)
PREV=$(ls -t "$BENCH_DIR"/r5-stress-*.json | sed -n '2p')

[ -z "$PREV" ] && { echo "FIRST_RUN no diff"; exit 0; }

CURRENT_P95=$(jq '.p95_ms' "$CURRENT")
PREV_P95=$(jq '.p95_ms' "$PREV")
DELTA_PCT=$(echo "scale=2; ($CURRENT_P95 - $PREV_P95) * 100 / $PREV_P95" | bc)

if (( $(echo "$DELTA_PCT > 10" | bc -l) )); then
  echo "REGRESSION p95: $PREV_P95 → $CURRENT_P95 (+$DELTA_PCT%)"
  cat > "$BENCH_DIR/regression-flag-$(date +%Y%m%d-%H%M).md" <<EOF
# Bench Regression Flag

**Metric**: R5 p95 latency
**Delta**: $PREV_P95 → $CURRENT_P95 (+$DELTA_PCT%)
**Threshold**: >10% trigger
**Action required**: invoke superpowers:systematic-debugging
EOF
  exit 1
fi
echo "BENCH OK: p95 delta $DELTA_PCT%"
```

**Acceptance**:
- Runs ogni R5/R6/R7 cron tick
- Auto-flag md file regression detected
- Andrea visibility GitHub mobile

### §4.2 M-NEW-14 Multi-source research aggregator

**Scope**: weekly BG agent scan Reddit + HN + Twitter + arxiv per "ELAB Tutor competitor" + "Arduino K-12 IT".

```bash
#!/bin/bash
# scripts/research-aggregator-weekly.sh
# M-NEW-14 multi-source research

WEEK=$(date +%Y-W%V)
OUTPUT_DIR="docs/research/weekly/$WEEK"
mkdir -p "$OUTPUT_DIR"

# Spawn BG Agent via Claude Code subagent
# Agent prompt: search "Arduino education K-12 italiano" + competitor pricing changes
# Output: $OUTPUT_DIR/A4-marketing-research.md

echo "Dispatch BG Agent research-aggregator week $WEEK"
# Implementation: dispatch via Agent tool subagent_type general-purpose
```

**Acceptance**:
- Weekly cron Sunday 22:00
- Output `docs/research/weekly/{week}/`
- Andrea reads Sunday review

### §4.3 M-NEW-15 Self-healing test pattern

**Scope**: Playwright spec fail → BG agent diagnosis → env retry / selector update PR / regression escalate.

```bash
# scripts/test-self-healer.sh
# M-NEW-15 self-healing tests

FAILED_SPEC="$1"
DIAGNOSIS=$(node scripts/diagnose-test-fail.js "$FAILED_SPEC" 2>/dev/null)

case "$(echo "$DIAGNOSIS" | jq -r '.category')" in
  "env_missing")
    echo "RETRY: env recovery + retry x3"
    ;;
  "selector_drift")
    echo "PR: open auto-PR with suggested selector update"
    ;;
  "genuine_regression")
    echo "ESCALATE: halt loop + flag Andrea via iter-31-andrea-flags.jsonl"
    exit 1
    ;;
esac
```

**Acceptance**:
- Categorize fail type via heuristics
- Auto-retry env issues
- Auto-PR selector drift
- Halt + escalate genuine regression

### §4.4 M-NEW-16 Coverage enforcer

**Scope**: vitest coverage thresholds enforced pre-commit + CI.

```javascript
// vitest.config.js (proposed)
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          statements: 70,
          branches: 65,
          functions: 70,
          lines: 70
        },
        // src/services/** stricter
        'src/services/**': {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        },
        // scripts/openclaw/** strictest
        'scripts/openclaw/**': {
          statements: 85,
          branches: 80,
          functions: 85,
          lines: 85
        }
      }
    }
  }
});
```

**Acceptance**:
- Coverage thresholds in vitest.config.js
- Pre-commit fails if coverage drops
- Weekly trend report `docs/audits/coverage-trend-{week}.md`

### §4.5 M-NEW-17 Bundle size watchdog

**Scope**: Vite plugin track chunk sizes. Pre-commit gate budget. Weekly trend.

```javascript
// vite.config.js (proposed addition)
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({
    filename: 'docs/audits/bundle-stats.html',
    template: 'treemap',
    gzipSize: true,
    brotliSize: true
  })
]
```

```bash
# scripts/bundle-size-watchdog.sh
BUDGET_KB=4900
PRECACHE_KB=$(du -sk dist/assets | awk '{print $1}')
[ "$PRECACHE_KB" -gt "$BUDGET_KB" ] && {
  echo "BUDGET EXCEEDED: $PRECACHE_KB > $BUDGET_KB"
  echo "Suggested: lazy-load via vite.config modulePreload filter"
  exit 1
}
```

**Acceptance**:
- Visualizer treemap docs/audits/bundle-stats.html
- Weekly trend `docs/audits/bundle-trend-{week}.md`

### §4.6 M-NEW-18 Performance budget per route

**Scope**: Lighthouse perf per route history JSONL. Per-route budget. CI gate.

```json
// automa/state/perf-budget.json
{
  "routes": [
    {"route": "#chatbot-only", "perf_min": 70, "perf_target": 90},
    {"route": "#about-easter", "perf_min": 70, "perf_target": 90},
    {"route": "#lavagna", "perf_min": 80, "perf_target": 95},
    {"route": "/", "perf_min": 85, "perf_target": 95}
  ]
}
```

```bash
# scripts/lighthouse-budget-gate.sh
# Iterate 4 routes, fail if perf < perf_min
```

**Acceptance**:
- 4 routes monitored
- Per-route budget enforced
- History `automa/state/lighthouse-history.jsonl` append-only

### §4.7 M-NEW-19 Anti-hallucination wiki gate

**Scope**: per Wiki concept commit, regex check Vol/pag valid (page ≤ vol max).

```bash
# .git/hooks/pre-commit (additional)
# M-NEW-19 anti-hallucination wiki gate
WIKI_MOD=$(git diff --cached --name-only | grep "docs/unlim-wiki/concepts/")
for FILE in $WIKI_MOD; do
  CITATIONS=$(grep -oE "Vol\.\s*\d+\s*pag\.?\s*\d+" "$FILE")
  while IFS= read -r CITE; do
    VOL=$(echo "$CITE" | grep -oE "Vol\.\s*\d+" | grep -oE "\d+")
    PAG=$(echo "$CITE" | grep -oE "pag\.?\s*\d+" | grep -oE "\d+")
    MAX_PAG=$(node scripts/get-vol-max-page.js "$VOL")
    if [ "$PAG" -gt "$MAX_PAG" ]; then
      echo "HALLUCINATION: $FILE cites Vol.$VOL pag.$PAG (max $MAX_PAG)"
      exit 1
    fi
  done <<< "$CITATIONS"
done
```

**Acceptance**:
- Pre-commit hook catches hc-sr04-style hallucinations
- Vol max pages: Vol1 (~150), Vol2 (~120), Vol3 (~114) verified

### §4.8 M-NEW-20 Cross-session memory enforcer

**Scope**: claude-mem snapshot per iter close. Restore on session start. Memory drift detector.

```bash
# scripts/memory-snapshot-iter-close.sh
# M-NEW-20 cross-session memory enforcer

ITER=$1
SNAPSHOT_DIR="automa/state/memory-snapshots"
mkdir -p "$SNAPSHOT_DIR"

# Trigger claude-mem snapshot
# Output: $SNAPSHOT_DIR/iter-$ITER-$(date +%Y%m%dT%H%M).json

# Drift detector: diff CLAUDE.md sprint history vs claude-mem entries
node scripts/detect-memory-drift.js > "$SNAPSHOT_DIR/iter-$ITER-drift.md"
```

**Acceptance**:
- Snapshot per iter close
- Drift detected if CLAUDE.md vs claude-mem inconsistent
- Restore mechanism for fresh session bootstrap

---

## §5. Mac Mini Consolidated Cron Schedule (proposed iter 32+)

```cron
# Mac Mini Strambino crontab iter 32+ deploy

# Stream B Layer 1: audit single esperimento rotation
*/10 * * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-audit-experiment.sh $(cat /tmp/audit-next-exp.txt) >> /tmp/audit-cron.log 2>&1

# Stream B Layer 6: rotate next esperimento every 4h
0 */4 * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-rotate-next-exp.sh

# Stream C Layer 1: R5 50-prompt 4x/day
0 */6 * * * cd $HOME/elab-builder-audit && bash scripts/run-r5-stress.sh && bash scripts/bench-diff-detector.sh

# Stream A Layer 4: doc drift + claim-reality gap every 4h
0 */4 * * * cd $HOME/elab-builder-audit && bash scripts/detect-doc-drift.sh && bash scripts/detect-claim-reality-gap.sh

# Stream C Layer 4: 5 metric skills 2x/day
0 */12 * * * cd $HOME/elab-builder-audit && bash scripts/run-5-metric-skills.sh

# Stream B Layer 1: daily fullsweep 94 esperimenti
0 0 * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-audit-experiment.sh --all >> /tmp/audit-fullsweep.log 2>&1

# Stream C Layer 5: daily Lighthouse 4 routes
0 0 * * * cd $HOME/elab-builder-audit && bash scripts/lighthouse-budget-gate.sh

# Stream C Layer 2: daily R6 100-prompt
0 1 * * * cd $HOME/elab-builder-audit && bash scripts/run-r6-stress.sh && bash scripts/bench-diff-detector.sh r6

# Stream B+C aggregate dashboard daily
0 6 * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-aggregate-dashboard.sh

# Auto-commit + push GitHub deploy key
0 7 * * * cd $HOME/elab-builder-audit && bash scripts/mac-mini-audit-commit.sh

# Stream C Layer 3: monthly R7 200-prompt 1° giorno mese
0 0 1 * * cd $HOME/elab-builder-audit && bash scripts/run-r7-stress.sh

# Stream C Layer 7: weekly research aggregator Sunday 22:00
0 22 * * 0 cd $HOME/elab-builder-audit && bash scripts/research-aggregator-weekly.sh

# Stream A Layer 3: daily CI matrix simulation locally
0 3 * * * cd $HOME/elab-builder-audit && bash scripts/local-ci-simulation.sh
```

**Total**: 12 cron entries → workflow continuo H24.

---

## §6. BG Agent Weekly Schedule (proposed iter 33+)

| Agent | Cadenza | Owner skill | Output |
|---|---|---|---|
| A1 Competitor analysis | Sunday 22:00 | elab-competitor-analyzer | `docs/research/weekly/{week}/A1-competitor.md` |
| A2 Latency Pareto | Sunday 22:00 | elab-velocita-latenze-tracker | `docs/research/weekly/{week}/A2-latency-pareto.md` |
| A3 Wiki hallucination spot-check | Sunday 22:00 | elab-onniscenza-measure G6+G3 | `docs/research/weekly/{week}/A3-wiki-spot-check.md` |
| A4 Marketing research multi-source | Sunday 22:00 | general-purpose subagent | `docs/research/weekly/{week}/A4-marketing.md` |
| A5 Tea coordination aggregate | Sunday 22:00 | scribe-opus | `docs/research/weekly/{week}/A5-tea-progress.md` |
| A6 Andrea Opus G45 review | iter close ad-hoc | M-AI-05 distinct context-zero | `docs/audits/G45-OPUS-INDIPENDENTE-iter{N}-{date}.md` |

---

## §7. Cost Analysis Onesto

### §7.1 Costo aggiunto CVP (mese, scale ELAB iter 31)

| Componente | Costo/mese | Razionale |
|---|---|---|
| Mac Mini elettricità (M4 16GB always-on) | €5-8 | already in budget |
| Anthropic API (BG agents weekly + M-AI-05 G45) | €5-15 | ~50K input + 20K output token/week = ~$3-8/mese |
| Mistral La Plateforme (R5+R6+R7 stress 144+30+1 calls/mese) | €4-10 | ~200K token/mese = $4-10 |
| CF Workers AI (Vision + STT + imagegen Mac Mini) | €1-3 | low volume background |
| Voyage AI (PARTIAL pivot Mistral mistral-embed) | €0-1 | Mistral primary embed |
| GitHub Actions (M-CC-02 CI multi-job) | €0-15 | free tier 2000min/mese, scale-out €15 |
| Lighthouse CI cloud (alternative local) | €0-10 | local Mac Mini free, cloud €10 |
| **TOTALE CVP add-on** | **€15-62/mese** | scale-dependent |

**Current Andrea baseline**: €40/mese Claude Pro.

**Total con CVP attivo**: €55-100/mese.

**Verdict cost/value**: ROI alto se ELAB scale 10+ scuole. Sotto, sovra-engineerato.

### §7.2 Tempo Andrea risparmiato (settimana stimato)

| Atom auto-CVP | Tempo Andrea pre-CVP | Tempo Andrea post-CVP | Risparmio |
|---|---|---|---|
| Verify R5 stress | 30min × 4 = 2h | 5min review | -1h55min |
| Verify Lighthouse perf | 20min × 7 = 2h20min | 5min review | -2h15min |
| 94 esperimenti audit | 8h manual | 30min review | -7h30min |
| Wiki hallucination check | 4h Tea-coord | 30min review | -3h30min |
| Competitor research | 3h Andrea | 30min review | -2h30min |
| Bench diff trending | 1h | 5min auto | -55min |
| **TOTALE settimana** | **~20h** | **~2h45min** | **-17h** |

**Verdict ROI**: Andrea recupera ~17h/settimana → equivale +1 dev parziale. Sprint T close 4-5 settimane → +85h budget = realistic +1 sprint scope cap.

---

## §8. Implementation Phases

### Phase A iter 32 entrance (~16h dev)

Deploy 12 esistenti + M-NEW-13 + M-NEW-14:
- M-AR-01 enhanced pre-commit + R5 smoke gate (Maker-1 1h)
- M-AI-01 score-history validator (Maker-1 30min)
- M-AI-02 mechanical caps enforcer (Architect 1h)
- M-AI-03 claim-reality gap detector (Tester-1 1h)
- M-AI-04 doc drift detector (Maker-2 1h)
- M-AR-05 smart rollback machinery (Maker-1 1h)
- M-AI-05 Opus G45 review automation (Tester-2 1h)
- M-NEW-13 bench differ (Tester-1 1.5h)
- M-NEW-14 research aggregator (Architect 2h)
- Mac Mini cron deploy 12 entries (Maker-1 2h post Decisione #1 ratify)
- GitHub deploy key + auto-push (Andrea 30min + Maker-1 30min)

### Phase B iter 33-34 (~12h dev)

Deploy M-NEW-15 + M-NEW-16 + M-NEW-17:
- M-NEW-15 self-healing test pattern (Maker-2 3h)
- M-NEW-16 coverage enforcer (Tester-1 2h)
- M-NEW-17 bundle size watchdog (Maker-1 1.5h)
- Lighthouse weekly trend (Tester-2 1h)
- Stryker.js mutation testing scaffolding (Maker-2 2h, defer iter 35+)

### Phase C iter 35+ (~10h dev)

Deploy M-NEW-18 + M-NEW-19 + M-NEW-20:
- M-NEW-18 perf budget per route (Tester-1 2h)
- M-NEW-19 anti-hallucination wiki gate (Maker-1 2h)
- M-NEW-20 cross-session memory enforcer (Maker-2 3h)
- BG weekly research aggregator full deploy (Architect 2h)
- Tea UAT progress dashboard (Scribe 1h)

---

## §9. ROI vs Current iter 30 State

| Capability | Iter 30 status | Post CVP iter 35 |
|---|---|---|
| R5 stress | ad-hoc Andrea trigger | 4×/day auto + diff regression |
| R6 stress | runner non built | daily auto + recall@5 trend |
| R7 stress | runner non built | monthly auto + canonical trend |
| 94 esperimenti audit | Mac Mini broken (4 defects) | daily fullsweep + per-cycle 10min |
| Wiki hallucination | 45-55% rate (76 unaudited) | pre-commit gate + weekly spot-check |
| Lighthouse perf | iter 38 fail 26+23 ammesso | daily 4 routes + per-route budget |
| Competitor analysis | manual ad-hoc | weekly auto |
| Latency Pareto | Andrea hand-calc | weekly auto + suggested optim |
| Bench regression detect | nessuno | per-cycle auto-flag >10% |
| Test self-healing | nessuno | env-retry + selector-drift PR |
| Coverage enforcement | nessuno | pre-commit + CI threshold |
| Bundle size enforcement | nessuno | pre-commit + weekly trend |
| Cross-session memory | claude-mem ad-hoc | iter-close snapshot + drift detector |

---

## §10. Anti-Pattern Checklist CVP

- ❌ NO claim "CVP LIVE" senza phased deploy + 24h soak per phase
- ❌ NO cron entry deploy senza wrapper script + log + retry
- ❌ NO BG agent dispatch senza output validation
- ❌ NO bench auto-flag false-positive (threshold 10% conservative)
- ❌ NO self-healing test auto-fix senza Andrea PR review (auto-PR yes, auto-merge NO)
- ❌ NO coverage threshold loosening per pass build
- ❌ NO bundle budget raise senza Andrea ratify ADR
- ❌ NO Lighthouse perf budget reduce senza ratify
- ❌ NO wiki hallucination gate disable
- ❌ NO memory snapshot retroactive edit
- ❌ NO Mac Mini cron senza GitHub deploy key configured
- ❌ NO weekly research dispatch senza Andrea Sunday review

---

## §11. Risks + Mitigations Onesti

| Risk | Probabilità | Impact | Mitigation |
|---|---|---|---|
| Mac Mini cron false-positive flood | HIGH | LOW | conservative thresholds + dedup + weekly aggregate |
| BG agent token budget overrun | MEDIUM | MEDIUM | weekly cron only (NOT daily) + skill-runs.jsonl monitor |
| Self-healing auto-PR noise | MEDIUM | MEDIUM | Andrea PR review NEVER auto-merge + label `cvp-auto` |
| Coverage threshold blocks legitimate | LOW | HIGH | per-module thresholds (src/services strict, components looser) |
| Bundle budget too tight | MEDIUM | LOW | budget review per major release, raise allowed via ADR |
| Cron entry conflict | LOW | HIGH | explicit hours not overlapping + log review weekly |
| GitHub Actions free tier exceed | LOW | LOW | 2000min/mese cap, monitor usage |
| Wiki gate false-positive (verbatim quotes) | MEDIUM | LOW | whitelist exception via `<!-- cvp-allow-cite -->` comment |
| Memory drift detector false-flag | LOW | LOW | snapshot comparison week-to-week threshold |
| Mac Mini disk fill | MEDIUM | HIGH | retention policy (keep 30 day audit JSONs) + weekly cleanup cron |

---

## §12. Test della Verità (Sprint T close projection)

CVP attivo iter 35+ permette:
- Andrea capacity +17h/settimana
- 4 stream paralleli auto
- 12 cron entries Mac Mini H24
- 6 BG agent weekly
- 20 mechanisms total (12 esistenti + 8 NEW)
- 5 metric skills + harness 94 esperimenti continuo

Sprint T close target ricalibrato:
- Iter 30 → 8.0/10 cap G45 (ONESTO)
- Iter 35 con CVP completo → 9.0/10 cap G45 ONESTO realistico
- Iter 38 Sprint T close finale → 9.5/10 cap G45 ONESTO conditional Opus review distinct
- Iter 42+ Sprint U entrance → CVP scaled 50 scuole + auto-deploy gates + Tea UAT continuous

---

## §13. Anti-pattern enforced this design

- ❌ NO claim "CVP automa-ready iter 31" (Phase A iter 32+ deploy)
- ❌ NO claim "Andrea +17h/settimana automatic" (post Phase A 24h soak verify)
- ❌ NO claim "ROI +85h Sprint T close" (projection ONESTO, NOT verified)
- ❌ NO claim "20 mechanisms LIVE iter 30" (8 NEW PROPOSED, deploy iter 32+)
- ❌ NO claim "weekly BG agents free" (Anthropic API token cost +€5-15/mese real)
- ❌ NO claim "Mac Mini disk infinite" (retention policy mandatory)

---

## §14. Cross-link

- 12 mechanisms originale: `docs/audits/2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md`
- 5 metric skills: `.claude/skills/elab-{morfismo,onniscenza,velocita,onnipotenza,principio-zero}-*/SKILL.md`
- Master plan iter 31: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Mac Mini persona-prof: `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md`
- Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`
- Tea brief iter 31: `docs/handoff/2026-05-02-tea-iter-31-brief.md`
- Tools+plugins inventory: `docs/audits/2026-05-02-iter-31-tools-plugins-inventory.md`
- ADR-040 Leonardo: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md`
- Andrea ratify checklist: `docs/handoff/2026-05-02-iter-31-ANDREA-RATIFY-CHECKLIST.md`
- Activation prompt: `docs/handoff/2026-05-02-iter-31-AUTONOMOUS-ACTIVATION-FINAL.md`

---

**Status**: PROPOSED iter 30 docs-only design. Phase A iter 32+ deploy gated Andrea ratify Decisione #1 + Decisione #10 + Decisione #12 (cascade Mac Mini cron + Vercel + Phase E). Phase B iter 33-34. Phase C iter 35+. Sprint U entrance iter 42+ scale 50 scuole.

**Anti-inflation G45 cap mandate enforced**: NO claim "CVP LIVE" iter 30. PROPOSED design only. Realistic ROI +17h/settimana Andrea capacity post 24h soak verify each phase.
