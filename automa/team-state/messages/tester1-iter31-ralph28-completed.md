# Tester-1 iter 31 ralph 28 — R5 N=3 Re-bench Warm-Isolate (BLOCKED env stale-key)

**From**: tester1 iter 31 ralph 28 (normal mode)
**To**: orchestrator
**Date**: 2026-05-03 ~11:27 UTC (~13:27 CEST)
**Status**: **PARTIAL — BLOCKED env stale-key**, deferred iter 29+ Andrea verify per task brief
**Score impact iter 31 ralph 28**: NONE (no measurement obtained, no claim made)

---

## Summary

Per iter 27 RCA P0 recommendation, executed R5 re-bench N=3 warm-isolate protocol against `unlim-chat` v72+ (commit `5a24c75`) targeting `euqpdueopmlllqjmqnyb`. Bench halted Run 1 of 3 at 8/8 HTTP 401 `UNAUTHORIZED_LEGACY_JWT` failures (runner threshold `MAX_TOTAL_FAILURES=8`).

Root cause: SUPABASE_ANON_KEY in `.env`/`/.env.production` issued for project `vxvqalmxqtezvgiboxyv` (Sprint S iter-4 dashboard project), R5 runner endpoint hardcoded to `euqpdueopmlllqjmqnyb` (production). JWT decoded `ref` claim confirms project mismatch.

Per task brief anti-pattern enforcement: NO claim "regression"; NO claim "noise"; NO fabrication. Iter 11 ralph regression status remains **INDETERMINATE** pending iter 29+ correct anon-key provision by Andrea.

---

## CoV results

| Step | Status | Value |
|------|--------|-------|
| CoV-1 PRIMA atom | ✅ PASS | `automa/baseline-tests.txt = 13752 PASS` (file authoritative source) |
| CoV-2 DURANTE | ✅ PASS | Read-only investigation; no src/ test/ supabase/ edits; only `docs/audits/` + `automa/team-state/messages/` writes per task scope |
| CoV-3 POST atom | ✅ PASS | `13752` preserved by construction (mathematical invariant, no edits) |

---

## Deliverables shipped

1. **Audit doc**: `docs/audits/2026-05-03-iter-31-ralph28-r5-rebench-n3-results.md` (227 LOC, §1-§8 complete with file:line evidence + verbatim error + recommended fix iter 29+)
2. **Bench output (failure)**: `scripts/bench/output/r5-stress-responses-2026-05-03T11-24-22-717Z.jsonl` (8 FAIL entries, no scorer report generated)
3. **This completion message**: `automa/team-state/messages/tester1-iter31-ralph28-completed.md`

---

## Env probe results

```
ELAB_API_KEY: 64c (prefix 0909e4b4 — matches iter 32 commit 8a922f7 rotated key) ✅
SUPABASE_ANON_KEY: 208c (loaded from .env fallback, JWT ref vxvqalmxqtezvgiboxyv) ❌ wrong project
SUPABASE_ACCESS_TOKEN: 0c (missing from sprint-s-tokens.env) ❌

Edge Function secrets probe: DEFERRED — npx supabase secrets list requires SUPABASE_ACCESS_TOKEN
RCA §5 P0 verify env vars (LLM_ROUTING_WEIGHTS, ENABLE_ONNISCENZA, ONNISCENZA_VERSION,
LLM_PROVIDER, ENABLE_INTENT_TOOLS_SCHEMA, INCLUDE_UI_STATE_IN_ONNISCENZA, TOGETHER_AI_FALLBACK)
NOT EXECUTED → Andrea verify iter 29+ entrance.
```

---

## N=3 bench results

| Run | Successful | Failures | PZ V3 | Avg latency | p95 |
|-----|-----------:|---------:|------:|------------:|----:|
| Run 1 | **0/8** (HALT MAX_TOTAL_FAILURES) | 8/8 HTTP 401 | N/A | N/A | N/A |
| Run 2 | NOT EXECUTED (sequential bench would yield identical 401) | — | — | — | — |
| Run 3 | NOT EXECUTED (sequential bench would yield identical 401) | — | — | — | — |

**Aggregate**: NOT COMPUTABLE.

**Comparison vs baselines**:
- iter 38 carryover (`792acf8`): 30/38 PASS / avg 1607ms / p95 3380ms
- iter 11 ralph (`d1a072e`): 50/50 PASS / avg 1974ms / p95 3611ms
- **iter 28**: 0/8 BLOCKED env stale-key — **no comparison possible**

---

## Decision verdict per RCA §5

**BLOCKED — protocol NOT executable; deferred iter 29+ Andrea verify**.

NOT noise (no avg-of-3 evidence). NOT mid-confidence regression (no avg-of-3 evidence). NOT confirmed regression (no avg-of-3 evidence). The +22.8% avg / +6.8% p95 regression flagged iter 11 ralph remains INDETERMINATE pending re-bench unblock.

---

## Blocker file:line + error verbatim

**File 1**: `.env:7` (and identical `.env.production:14`)
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
JWT payload decode: `{"iss":"supabase","ref":"vxvqalmxqtezvgiboxyv","role":"anon",...}`

**File 2**: `scripts/bench/run-sprint-r5-stress.mjs:44`
```javascript
const UNLIM_EDGE_URL = (process.env.UNLIM_EDGE_URL ||
    'https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat').trim();
```

**Error verbatim** (8x identical, all 8 R5 prompts):
```
HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}
```

---

## Recommended action iter 29+ entrance

Andrea ~5min unblock:
1. Source SUPABASE_ANON_KEY for project `euqpdueopmlllqjmqnyb` (production) — likely on Andrea's local shell history OR Supabase Dashboard → Project Settings → API → anon public JWT OR `npx supabase projects api-keys --project-ref euqpdueopmlllqjmqnyb` (requires SUPABASE_ACCESS_TOKEN)
2. Source SUPABASE_ACCESS_TOKEN (`sbp_...`) for Edge Function secrets probe
3. Verify both: `echo ${#SUPABASE_ANON_KEY}c` (~208) + `echo ${#SUPABASE_ACCESS_TOKEN}c` (~64)
4. Re-spawn iter 29 protocol: ~30min N=3 bench + 2min env probe

Expected iter 29 outcome (per RCA §5 H1+H4+H5 most-likely root cause Medium ~65% confidence): avg-of-3 will likely fall in range **1700-2100ms** based on iter 11 ralph 1974ms single-sample + provider variability ±10-15% → most-likely verdict "**mid-confidence regression**" (close iter 11 regression as primarily measurement noise, with H1 module-load overhead contributing minor cumulative drift; defer P1 module preload audit Sprint U+).

---

## Anti-pattern compliance

- ✅ NO claim "regression" without N=3 statistical significance (admitted INDETERMINATE)
- ✅ NO claim "noise" without avg-of-3 evidence (admitted INDETERMINATE)
- ✅ NO fabricate numbers (Run 2+3 explicitly NOT EXECUTED, no synthesis)
- ✅ NO inflate (Run 1 = 0/8 HALT, audit doc explicit BLOCKED)
- ✅ NO modify Edge Function deploy
- ✅ NO `--no-verify` (no commits attempted)
- ✅ NO destructive ops (read-only investigation + 2 doc writes)
- ✅ NO compiacenza (acknowledged Andrea env provision required, deferred iter 29+ honestly)
- ✅ NO write outside `docs/audits/` + `automa/team-state/messages/` + `scripts/bench/output/` (3 writes total: 1 audit + 1 message + 1 bench output JSONL auto by runner)

---

**End completion message.**
