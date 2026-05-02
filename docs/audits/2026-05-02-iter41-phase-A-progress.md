# Iter 41 Phase A Progress Audit — 2026-05-02 PM

**Ralph loop iteration 1 close.** Plan: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md`.

## Phase A Latency Tier 1 — atoms shipped this iter

| Atom | Status | Commit | LOC | CoV | Notes |
|------|--------|--------|-----|-----|-------|
| **A1 standalone** selectMistralModel narrow Large heuristic | ✅ shipped | `47e3395` | +120 | 10/10 PASS vitest 13549 | Tests: short simple + long-prompt 50w boundary + multi-step+diagnostic + override + telemetry |
| **A1 wire-up** narrow Large downgrade canary | ✅ shipped | `cd3ffa2` | +19 | 75/75 PASS adjacent | Gate `MISTRAL_NARROW_LARGE_ENABLED` default false. Andrea env required iter 41 ratify. |
| **A2 SSE streaming wire client** | ✅ already shipped iter 39 (commit `430659a`) | n/a | n/a | verified server `unlim-chat:602-607` + client `useGalileoChat:757` | Plan A2 noop — infra already live. |
| **A5 standalone** Onniscenza V1 cache TTL FNV1a 5min LRU 100 | ✅ shipped | (TBD A5 BG) | +95 | 10/10 PASS vitest 13559 | Module separable from onniscenza-bridge.ts |
| **A5 wire-up** aggregateOnniscenza cache pre-fetch + post-fuse store | ✅ shipped | (TBD A5b BG) | +25 | 40/40 PASS adjacent | Gate `ONNISCENZA_CACHE_ENABLED` default false. |

## Phase A atoms remaining

| Atom | Status | Blocker | Next iter |
|------|--------|---------|-----------|
| **A3** T1.3 student-context single RPC schema audit + apply | NOT started | Andrea schema audit `student_progress` columns (iter 38 BLOCKED `completed_experiments` not found) | Andrea action then write migration + impl |
| **A4** Hedged Mistral 100ms stagger ENABLE_HEDGED_LLM | NOT started | Andrea cost ratify ADR-038 (+30% LLM cost) | Write code + tests + ADR-038 |
| **A6** Phase A close R5 50-prompt re-bench post deploy v75 | NOT started | Andrea: deploy Edge Function v75 + set env `MISTRAL_NARROW_LARGE_ENABLED=true ONNISCENZA_CACHE_ENABLED=true` | Andrea action then bench |

## Andrea ratify queue iter 41 entrance (5 voci)

1. **MISTRAL_NARROW_LARGE_ENABLED=true** env set → deploy unlim-chat v75 (estimated -2000ms cap on complex prompts). Single command:
   ```bash
   npx supabase secrets set MISTRAL_NARROW_LARGE_ENABLED=true --project-ref euqpdueopmlllqjmqnyb
   npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb
   ```
2. **ONNISCENZA_CACHE_ENABLED=true** env set (no separate deploy needed if combined with above). Estimated -100-200ms repeat queries.
3. **A3 schema audit** Andrea inspect `student_progress` columns:
   ```bash
   npx supabase db query --linked "SELECT column_name FROM information_schema.columns WHERE table_name = 'student_progress';"
   ```
4. **A4 hedged Mistral cost ratify** ADR-038 +30% LLM cost (~+$0.0003/request). Decide YES/NO before iter 41 atom A4 implementation.
5. **VOYAGE_API_KEY + SUPABASE_SERVICE_ROLE_KEY** env provision for ADR-034 Voyage re-ingest (Phase E gate).

## CoV ledger this iter (3 cycles)

| Check | Cycle 1 (A1 standalone) | Cycle 2 (A1 wire-up) | Cycle 3 (A5 module + wire-up) |
|-------|-------------------------|----------------------|-------------------------------|
| vitest baseline | 13539 → 13549 (+10 NEW) | 13549 preserved | 13549 → 13559 (+10 NEW) |
| pre-commit hook | ✓ PASS 11958 | ✓ PASS 11958 | ✓ PASS 11958 |
| pre-push hook | ✓ PASS 13549 | ✓ PASS 13549 | (BG running — verify next iter) |
| build | NOT re-run (heavy) | NOT re-run | NOT re-run — defer Phase A close |
| smoke prod | NOT re-run | NOT re-run | NOT re-run — gated Andrea deploy v75 |

## Anti-inflation G45 mandate enforced

- ✅ A1 narrow Large code shipped + tested (10/10 PASS) MA NOT yet active prod (env=false default safe)
- ✅ A2 SSE infra verified already shipped iter 39 (NO claim "newly shipped")
- ✅ A5 cache TTL code shipped + tested (10/10 PASS) MA NOT yet active prod (env=false default safe)
- ❌ NO claim "Phase A close" senza R5 50-prompt re-bench post deploy v75 evidence
- ❌ NO claim "latency lift achieved" senza Andrea env set + smoke evidence
- ❌ NO claim "Onniscenza cache LIVE" senza prod telemetry `onniscenza_cache_hit` events
- ✅ Test coverage delta verified: +20 NEW tests (A1 standalone 10 + A5 module 10)

## Estimated Phase A close projection (post Andrea ratify queue execution)

| Metric | Iter 40 v74 baseline | Phase A target | Projection post A1+A5 deploy |
|--------|---------------------|----------------|------------------------------|
| R5 avg | 3130ms | ≤1500ms | ~2200-2600ms (depends Large fire rate post narrow) |
| R5 p95 | 5400ms | ≤2500ms | ~3000-3500ms (Large complex prompts still hit Large) |
| R5 PZ V3 | 94.2% (iter 38 carryover v56) | ≥91.45% | preserve (no prompt change) |
| Onniscenza cache hit-rate | 0% (no cache) | NEW telemetry | track via `onniscenza_cache_hit` events |

**Phase A target NOT achievable without A3+A4+A6**:
- A3 RPC fix → -250-500ms p95 (depends Andrea schema audit)
- A4 hedged Mistral → -600-1100ms p95 (depends Andrea cost ratify)
- A6 R5 re-bench Phase A close gate

Realistic Phase A close: ralph iter 2-3 (A3+A4 next iter, A6 final iter).

## Iter 41 ralph loop next iteration priorities

1. **A4 hedged Mistral** code + tests + ADR-038 (independent of Andrea — code only ships, env gate keeps off)
2. **A3 schema audit** Andrea action (cannot self-execute)
3. **B1 ADR-035 V2.1 conversational fusion design** (architect doc work, no env blocker)
4. **B2 conversation history embed module** (Voyage embed wrapper, code+tests)
5. **C1 robust JSON parser ADR-036 + impl** (regression-prevention pre-req for re-wire widened heuristic)

Continue ralph loop until promise 9 boxes met OR Andrea HALT.

---

**Cross-ref**:
- Plan: `docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md`
- Phase 0 baseline: `docs/audits/PHASE-0-baseline-2026-05-02.md` (R5 0/8 BROKEN diagnosed bench env, prod stable)
- G45 Opus indipendente: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` (8.0/10 ONESTO)
