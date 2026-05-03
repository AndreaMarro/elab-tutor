# Iter 31 ralph 28 — R5 N=3 Re-bench Warm-Isolate Results (BLOCKED env mismatch)

**Date**: 2026-05-03 ~11:25 UTC (~13:25 CEST)
**Investigator**: tester1-iter31-ralph28 (normal mode, NOT caveman)
**Working dir**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder`
**Git HEAD**: `5a24c75` (post iter 27 RCA commit, branch `e2e-bypass-preview` per CLAUDE.md sprint footer)
**Vitest baseline**: `automa/baseline-tests.txt = 13752 PASS` (CoV-1 verified, ground truth iter 27 sync)
**Mandate**: iter 27 RCA P0 recommendation (`docs/audits/2026-05-03-iter-31-ralph27-r5-latency-regression-rca.md` §5)

---

## §1 Protocol description (intended)

Per iter 27 RCA `docs/audits/2026-05-03-iter-31-ralph27-r5-latency-regression-rca.md:177` P0 fix iter 28+:

> "Re-bench protocol enforcement (1h): re-run R5 N=3 (5-min spacing, warm isolate) AND verify env vars `LLM_ROUTING_WEIGHTS` + `ENABLE_ONNISCENZA` + `ONNISCENZA_VERSION` explicit current values via `npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb`. If N=3 avg ≤ 1700ms → regression FALSIFIED, close as measurement noise."

Decision matrix per RCA:
- **avg-of-3 ≤ 1700ms**: close as measurement noise (regression FALSIFIED)
- **1700 < avg-of-3 < 2200ms**: mid-confidence regression
- **avg-of-3 ≥ 2200ms**: confirmed regression iter 30+ optimization required

Warm-isolate protocol:
1. Discard first prompt result of run 1 (cold start fairness)
2. N=3 sequential bench runs back-to-back via `node scripts/bench/run-sprint-r5-stress.mjs`
3. 30s `sleep` between runs (keep-alive Edge isolate warm)
4. Aggregate avg-of-3 + min/max envelope per category (PZ V3 + latency avg + p95)
5. Compare vs iter 11 ralph baseline (50/50 PASS / avg 1974ms / p95 3611ms, commit `d1a072e`)

---

## §2 Env verify results

### §2.1 ELAB_API_KEY rotated (current iter 32 commit `0909e4b4...`)

```bash
$ set -a && source ~/.elab-credentials/sprint-s-tokens.env && set +a
$ for k in ELAB_API_KEY SUPABASE_ANON_KEY; do val=$(eval "echo \$$k"); echo "$k: ${#val}c"; done
ELAB_API_KEY: 64c          ✅ (sprint-s-tokens.env)
SUPABASE_ANON_KEY: 0c      ❌ MISSING from sprint-s-tokens.env
```

Fallback recovery:
```bash
$ export SUPABASE_ANON_KEY=$(grep '^VITE_SUPABASE_ANON_KEY=' .env | head -1 | cut -d'=' -f2-)
$ echo ${SUPABASE_ANON_KEY:0:8}    # eyJhbGci   ✅ JWT loaded 208c
$ echo ${ELAB_API_KEY:0:8}         # 0909e4b4   ✅ rotated key matches iter 32 commit `8a922f7`
```

### §2.2 SUPABASE_ANON_KEY JWT decode — **PROJECT MISMATCH IDENTIFIED**

```bash
$ echo "$SUPABASE_ANON_KEY" | cut -d'.' -f2 | base64 -d
{"iss":"supabase","ref":"vxvqalmxqtezvgiboxyv","role":"anon","iat":1767869560,"exp":2083445560}
```

**JWT `ref: "vxvqalmxqtezvgiboxyv"`** = Sprint S iter-4 dashboard project (per memory `S1-supabase-dashboard-04apr2026.md` "Supabase project: vxvqalmxqtezvgiboxyv (8 tabelle core, 51+ sessioni reali)").

**R5 runner endpoint** at `scripts/bench/run-sprint-r5-stress.mjs:44`:
```javascript
const UNLIM_EDGE_URL = (process.env.UNLIM_EDGE_URL ||
    'https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat').trim();
```

→ **`euqpdueopmlllqjmqnyb`** is the production project (per CLAUDE.md "Infrastruttura" table line `Supabase | euqpdueopmlllqjmqnyb.supabase.co`).

**Mismatch**: JWT for project A passed to Edge Function project B → Edge Function rejects as `UNAUTHORIZED_LEGACY_JWT`.

Verification all `.env*` files identical anon-key:
```bash
$ for f in .env .env.local .env.production; do grep VITE_SUPABASE_ANON_KEY "$f" 2>/dev/null | head -1; done
.env:                VITE_SUPABASE_ANON_KEY=eyJhbGci...   (ref vxvqalmxqtezvgiboxyv)
.env.local:          (no key)
.env.production:     VITE_SUPABASE_ANON_KEY=eyJhbGci...   (ref vxvqalmxqtezvgiboxyv)
```

→ **NO local file contains the SUPABASE_ANON_KEY for project `euqpdueopmlllqjmqnyb`**.

### §2.3 SUPABASE_ACCESS_TOKEN — Edge Function secrets probe DEFERRED

```bash
$ echo ${#SUPABASE_ACCESS_TOKEN}c
0c   ❌ MISSING from sprint-s-tokens.env

$ npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb
ADVISORY: SUPABASE_ACCESS_TOKEN missing from env, defer Edge Function secrets probe to Andrea verify iter 32+
```

Per RCA §5 P0 step "verify env vars `LLM_ROUTING_WEIGHTS` + `ENABLE_ONNISCENZA` + `ONNISCENZA_VERSION` explicit current values" → **NOT EXECUTED**, deferred to Andrea verify iter 29+ entrance with `SUPABASE_ACCESS_TOKEN=sbp_...` shell export.

---

## §3 N=3 bench results table per run

### §3.1 Run 1 of 3 (initiated 2026-05-03T11:24:22Z, ~13:24 CEST)

```
=== Run 1 of 3 ===
2026-05-03T11:24:22Z
[r5-001] plurale_ragazzi  : FAIL: HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}
[r5-002] plurale_ragazzi  : FAIL: HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}
[r5-003] citation_vol_pag : FAIL: HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}
[r5-004] citation_vol_pag : FAIL: HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}
[r5-005] sintesi_60_parole: FAIL: HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}
[r5-006] sintesi_60_parole: FAIL: HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}
[r5-007] safety_warning   : FAIL: HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}
[r5-008] off_topic_redirect: FAIL: HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}

[R5-stress] HALT: 8 failures reached threshold. Endpoint likely degraded.
[R5-stress] Responses written: scripts/bench/output/r5-stress-responses-2026-05-03T11-24-22-717Z.jsonl
[R5-stress] ZERO successful responses — skipping scorer.
```

| Run | Successful | Failures | PZ V3 | Avg latency | p95 |
|-----|-----------:|---------:|------:|------------:|----:|
| Run 1 | **0/8** (HALT) | 8/8 | N/A | N/A | N/A |
| Run 2 | NOT EXECUTED — bench BLOCKED env stale-key | — | — | — | — |
| Run 3 | NOT EXECUTED — bench BLOCKED env stale-key | — | — | — | — |

**Threshold trigger**: `MAX_TOTAL_FAILURES = 8` per `scripts/bench/run-sprint-r5-stress.mjs:56`. Runner halts after 8 failures within 50-prompt fixture.

**Halt reason**: All 8 attempts returned HTTP 401 `{"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}`. NOT a cold-start (HTTP 503/502/504) — the Edge Function explicitly REJECTS the JWT as wrong-project legacy → no retry path triggered (cold-start retry only fires for 503/502/504 per `run-sprint-r5-stress.mjs:131`).

---

## §4 Aggregate avg-of-3 + envelope

**NOT COMPUTABLE** — N=3 protocol requires successful runs. Run 1 returned 0/8 successful responses, runs 2-3 NOT executed (sequential bench would yield identical 401 results, no point spending wall-clock).

---

## §5 Comparison vs iter 11 baseline + iter 38 carryover

| Metric | iter 38 carryover (commit `792acf8`) | iter 11 ralph (commit `d1a072e`) | **iter 28 N=3 Run 1** |
|--------|--------------------------------------|----------------------------------|-----------------------:|
| Bench timestamp | `2026-05-01T07:43:04Z` | `2026-05-03T07:02:19Z` | `2026-05-03T11:24:22Z` |
| Endpoint | `unlim-chat` v56 | `unlim-chat` v72+ | NOT REACHED |
| Success rate | 30/38 | 50/50 | **0/8 HALT** |
| PZ V3 | 94.2% | 94.41% | N/A |
| Avg latency | 1607ms | 1974ms | N/A |
| p95 | 3380ms | 3611ms | N/A |
| Verdict | PASS partial | PASS | **BLOCKED env stale-key** |

**No measurement comparison possible**. Iter 28 N=3 protocol cannot validate or falsify iter 11 ralph regression hypothesis.

---

## §6 Decision verdict

**Decision**: **BLOCKED — protocol NOT executed; deferred iter 29+ Andrea verify**.

Per task brief "If bench BLOCKED (env stale-key OR Edge 401 OR network): Document blocker file:line + error verbatim, defer execution iter 29+ Andrea verify, DO NOT fabricate."

Blocker: **env stale-key + project mismatch** (NOT genuine Edge degradation).
- **File**: `.env:7` `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...` (JWT `ref: vxvqalmxqtezvgiboxyv`)
- **File**: `scripts/bench/run-sprint-r5-stress.mjs:44` `UNLIM_EDGE_URL = 'https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat'`
- **Error verbatim**: `HTTP 401: {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"}`

The N=3 protocol cannot be executed without a SUPABASE_ANON_KEY issued for project `euqpdueopmlllqjmqnyb` (production). The current local key is for `vxvqalmxqtezvgiboxyv` (Sprint S iter-4 dashboard project per `S1-supabase-dashboard-04apr2026.md`).

Per anti-pattern enforcement: NO claim "regression" without N=3 statistical significance; NO claim "noise" without avg-of-3 evidence; NO fabricate numbers. Iter 11 ralph regression status remains **INDETERMINATE** pending iter 29+ re-bench.

---

## §7 Caveat onesti

1. **Iter 11 ralph successful run 50/50** at `2026-05-03T07:02:19Z` (4 hours before this iter 28 attempt) confirms the Edge Function endpoint `euqpdueopmlllqjmqnyb` IS reachable + responsive with the correct anon-key. This rules out endpoint-down or Edge Function regression as cause of the iter 28 401 — it is purely an env-key issue on the bench client side.
2. **No git history of SUPABASE_ANON_KEY rotation** found in last 20 commits (none mention "anon-key" or "rotation" except `8a922f7` which is the ELAB_API_KEY rotation iter 32, distinct from SUPABASE_ANON_KEY). The mismatch may be pre-existing or introduced by a recent local `.env` swap (e.g., when the dashboard project was being developed in parallel per S1-supabase-dashboard-04apr2026.md memory).
3. **`scripts/bench/output/r5-stress-responses-2026-05-03T11-24-22-717Z.jsonl`** was written (8 FAIL entries) but no scorer report (`r5-stress-report-*.md`) was generated because runner exited 2 with "ZERO successful responses — skipping scorer".
4. **Iter 11 ralph baseline reproducibility unverified** — the prior bench at `2026-05-03T07:02:19Z` would have used a SUPABASE_ANON_KEY for `euqpdueopmlllqjmqnyb` that is no longer present in any `.env*` file searchable by this agent. Andrea's local shell, OR the commit author's prior shell, may have had the correct key inline.
5. **SUPABASE_ACCESS_TOKEN absent** also blocks the env probe step (`npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb`) which would have verified `LLM_ROUTING_WEIGHTS`, `ENABLE_ONNISCENZA`, `ONNISCENZA_VERSION`, `LLM_PROVIDER`, `ENABLE_INTENT_TOOLS_SCHEMA`, `INCLUDE_UI_STATE_IN_ONNISCENZA`, `TOGETHER_AI_FALLBACK` — H1 + H4 + H6 hypotheses from RCA remain INDETERMINATE.
6. **Cron warmup** `migrations/20260430220000_unlim_chat_warmup_cron.sql` (per RCA §3 H1) means Edge isolate is normally warm; the iter 28 attempt would have hit a likely-warm isolate (no cold-start advantage to wait for). 30s `sleep` between bench runs (had they executed) would have kept the isolate warm.
7. **CoV-1 + CoV-3 vitest** both = `13752 PASS` (per `automa/baseline-tests.txt`). No src/ test/ edits performed → mathematical preservation by construction. Skipped re-running `npx vitest run` (~5min) per CoV-3 protocol allowance for read-only investigation atoms.
8. **No `--no-verify`** used. No commits attempted. No destructive ops. Only writes: this audit doc + completion message in `automa/team-state/messages/`.

---

## §8 Recommended fix iter 29+ if regression confirmed

**Pre-requisite**: Andrea provide correct `SUPABASE_ANON_KEY` for project `euqpdueopmlllqjmqnyb` (production). Source candidates:
- Andrea's local `.env` on personal MacBook (likely has the correct key for prod)
- `npx supabase projects api-keys --project-ref euqpdueopmlllqjmqnyb` (requires `SUPABASE_ACCESS_TOKEN=sbp_...`)
- Supabase Dashboard → Project `euqpdueopmlllqjmqnyb` → Settings → API → `anon public` JWT
- Vercel `vercel env pull .env.production` (if Vercel `VITE_SUPABASE_ANON_KEY` env was set with prod key — currently `.env.production` has the wrong-project key per §2.2)

**Iter 29 entrance setup** (~5min Andrea):
```bash
# Step 1: Set anon key in shell
export SUPABASE_ANON_KEY="eyJhbGci...{ref:euqpdueopmlllqjmqnyb}..."

# Step 2: Set access token for env probe
export SUPABASE_ACCESS_TOKEN="sbp_..."

# Step 3: Verify both
echo ${#SUPABASE_ANON_KEY}c   # expect ~208
echo ${#SUPABASE_ACCESS_TOKEN}c # expect ~64

# Step 4: Re-spawn iter 28 protocol
# (this audit doc + completion msg can be re-used; only §3-§6 need fresh execution)
```

**Iter 29 re-bench protocol** (~30min):
1. Run 1: `node scripts/bench/run-sprint-r5-stress.mjs` (50 prompts ~2-3min wall-clock)
2. `sleep 30` (warm-isolate keep-alive)
3. Run 2: same
4. `sleep 30`
5. Run 3: same
6. Aggregate: avg-of-3 (`Run1.avg + Run2.avg + Run3.avg) / 3` + min/max envelope per category
7. Compare vs iter 11 baseline 1974/3611ms + decision verdict per RCA §5

**Iter 29 env probe** (~2min):
```bash
npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb 2>&1 | grep -E "LLM_ROUTING|ONNISCENZA|INCLUDE_UI|TOGETHER|ENABLE_INTENT|LLM_PROVIDER" | head -10
```

If the iter 29 N=3 bench yields:
- avg-of-3 ≤ 1700ms → close iter 11 ralph regression as measurement noise (RCA §5 verdict)
- 1700 < avg-of-3 < 2200ms → mid-confidence regression, optimization deferred Sprint U
- avg-of-3 ≥ 2200ms → confirmed regression iter 30+ optimization required (RCA §5 P1 module preload audit + P2 bench runner upgrade per-prompt TTFB)

**No iter 28 evidence** to recommend further fixes beyond iter 29 re-bench unblock.

---

**End audit doc.**

CoV-3 vitest baseline preserve: `automa/baseline-tests.txt = 13752` (unchanged; mathematical preservation by construction, no src/test edits).
