# Phase 0 Measured Baseline — 2026-05-02

**Author**: Subagent 2 (Phase 0 measured baseline)
**Sprint**: Sprint T close 11-fasi Andrea solo dev
**Working dir**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/`
**HEAD**: `3ac4aec2adc7d052eaf5a13ab9c9c0968364960d` on `e2e-bypass-preview`
**Mandate**: ZERO assumptions — measure or document blocked-with-reason.

---

## Executive Summary Table

| # | Metric | Value | Target | Gap | Source |
|---|--------|-------|--------|-----|--------|
| 1 | Vitest PASS count | **13474 PASS** + 15 skip + 8 todo (13497 total, 269/270 files) | 14000 (Sprint 8 PDR) | -526 | live `npx vitest run` 2026-05-02T11:55:31, 150.58s; matches `automa/baseline-tests.txt` line 1 |
| 2 | Build status | **DEFERRED** — last known PASS iter 37 PHASE 3 close (heavy ~14min) | PASS pre-commit | unverified iter 38+ | iter 37 audit + iter 38 carryover doc; CLAUDE.md Sprint T iter 37 §"Phase 3 orchestrator" |
| 3 | R5 stress (latency + PZ V3) | **Latest 2026-05-02T07:28:58: ZERO success 0/8** (50-prompt SEED fixture, ADR-011 pending). Best valid run **2026-05-01T07:43**: avg 1607ms / p95 3380ms / PZ V3 94.2% | avg ≤1800ms p95 ≤3500ms PZ V3 ≥85% | Latest run BROKEN (8/8 fail), prior run PASS | `scripts/bench/output/r5-stress-report-2026-05-02T07-28-58-859Z.md` lines 1-7 + CLAUDE.md iter 38 carryover §"R5 v56 PASS" |
| 4 | R6 stress (recall@5) | **avg recall@5 0.067 / 100 prompts FAIL** (48 template-shortcut + 52 measured); p95 latency 5071ms | recall@5 ≥0.55 | -0.483 (BLOCKED page=0% Voyage ingest gap) | `scripts/bench/output/r6-stress-report-2026-04-30T18-53-28-013Z.md` lines 16-34 |
| 5 | R7 stress (INTENT canonical %) | **Canonical 3.6% / Combined 46.2% / 200 prompts FAIL**; avg 1630ms p95 3315ms | Canonical ≥80% | -76.4pp | `scripts/bench/output/r7-stress-report-2026-05-01T07-43-03-043Z.md` lines 16-34 |
| 6 | Lighthouse | **chatbot-only: perf 0.26 / a11y 1.0 / SEO 1.0 / BP 0.96** ; **easter-modal: perf 0.23 / a11y 1.0 / SEO 1.0 / BP 0.96** | perf ≥0.90 a11y ≥0.95 SEO 1.0 BP ≥0.95 | perf -0.64/-0.67 FAIL, others PASS | `docs/audits/iter-38-lighthouse-{chatbot-only,easter-modal}.json` (lighthouse-easter-modal.json categories) |
| 7 | RAG metadata coverage (page %) | **Total chunks 2061 / page filled 0 (0.0%) / chapter 180 (8.7%) / section_title 180 (8.7%)** | page ≥80% (per R6 unblock) | page -80pp | `docs/audits/iter-39-rag-metadata-backfill-coverage.md` lines 9-21 |
| 8 | 94 esperimenti audit (E2E) | **Spec EXISTS 396 LOC NOT EXECUTED** (Phase 4 H Tester-1 deferred) | 94/94 audited, broken count REAL ≤10 | execution pending | `tests/e2e/29-92-esperimenti-audit.spec.js` (`wc -l` = 396 — 87 canonical + 7 extras) |
| 9 | Edge Function unlim-chat | **Latest commit `1feda3c` fix(iter-39-A3): surface dispatcher_results in response payload** ; v50/v54/v55/v56 chain documented iter 38 carryover | v54 baseline → v56 LIVE (3.6% R7 canonical) | iter 39 A3 dispatcher_results NEW | `git log --oneline -20 supabase/functions/unlim-chat/` (top 4 entries) |
| 10 | Git baseline branch | **branch `e2e-bypass-preview` HEAD `3ac4aec`** ("docs(plan): Sprint T close 11-fasi Andrea solo dev ratify 2026-05-02"); working tree DIRTY (3 modified + 18 untracked bench outputs) | clean tree pre-Phase 1 | working tree dirty | `git status` + `git rev-parse HEAD` |

---

## §1 Vitest baseline

### Command
```bash
npx vitest run --reporter=basic 2>&1 | tail -30
```

### Output (last 8 lines)
```
 Test Files  269 passed | 1 skipped (270)
      Tests  13474 passed | 15 skipped | 8 todo (13497)
   Start at  11:55:31
   Duration  150.58s (transform 17.91s, setup 55.68s, collect 68.55s, tests 63.25s, environment 282.08s, prepare 49.10s)
```

### automa/baseline-tests.txt
```
13474
```

**Match**: live measure (13474) === baseline file (13474) — ZERO drift detected.

**Phase 1+ target**: preserve 13474 PASS. Pre-commit hook gates delta in `.husky/pre-commit` (per CLAUDE.md "Anti-regressione FERREA").

---

## §2 Build status

### Decision: DEFERRED Phase 0
**Reason**: heavy ~14min compile (esbuild + obfuscation + PWA precache 33 entries). Subagent 2 mandate-allowed defer with last-known-PASS reference.

**Last successful build**: iter 37 PHASE 3 close 2026-04-30. Per CLAUDE.md Sprint T iter 37 §"Activation iter 38": "iter 38 entrance pre-flight CoV: vitest 13256+ + build PASS" — build was a PHASE 3 orchestrator gate at iter 37 close.

**Iter 38 close**: build NOT re-run (CLAUDE.md iter 38 PHASE 3 §5 caveat). Iter 38 carryover deploy chain: build presumed-PASS based on Vercel deploy LIVE (`dpl_xQyNLzWEf3HGi6oXzMv8PxnJEHQW` aliases www.elabtutor.school 2026-05-01 07:48:51 UTC) — Vercel rejects builds that fail.

**Phase 1 entrance gate**: `npm run build 2>&1 | tail -30` MANDATORY before any commit. If FAIL: revert and investigate before proceeding.

---

## §3 R5 stress (latency + PZ V3 quality)

### Latest run (2026-05-02T07:28:58)
File: `scripts/bench/output/r5-stress-report-2026-05-02T07-28-58-859Z.md` (8 lines, full content):
```
# R5 Stress FAILURE — 2026-05-02T07-28-58-859Z

Zero successful responses against https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat.
Failures: 8/8

## Note
Fixture is 50-prompt SEED (full 50 pending ADR-011).
```

**Status**: BROKEN run — 0/8 prompts successful, no latency or PZ V3 metric extractable.

### Prior valid baseline (2026-05-01T07:43)
Per CLAUDE.md iter 38 carryover §"R5 v56 PASS":
- avg **1607ms** / p95 **3380ms** / PZ V3 **94.2%**
- Lift -64% avg / -66% p95 vs iter 37 baseline (4496/10096)

### Phase 1 implications
- Latest run failure must be investigated (Edge endpoint 4xx? auth header drift? Supabase Pro tier rate-limit?)
- Phase 1 entrance: re-run R5 against `https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat` with valid `apikey + Authorization Bearer + X-Elab-Api-Key` (per R6/R7 runner pattern) before claiming any latency lift.

### Recent run inventory (`ls -t scripts/bench/output/r5-stress-*.md | head -5`)
- 2026-05-02T07-28-58 (FAIL 0/8)
- 2026-05-01T22-24-50
- 2026-05-01T07-43-04 (last documented PASS 94.2%)
- 2026-04-30T16-30-22
- 2026-04-30T14-09-03

---

## §4 R6 stress (recall@5)

### Latest run (2026-04-30T18:53:28)
File: `scripts/bench/output/r6-stress-report-2026-04-30T18-53-28-013Z.md` lines 16-34

| Metric | Value | Threshold | Verdict |
|--------|-------|-----------|---------|
| Successful | 100/100 | — | — |
| Template-shortcut (RAG bypassed) | 48 | — | — |
| Measured (with debug_retrieval) | 52 | — | — |
| **avg recall@5 (measured)** | **0.067** | ≥0.55 | **FAIL** |

### Latency
- Avg 2256ms / p50 1592ms / p95 5071ms / p99 8346ms

### Per-category (worst)
- `off_topic_redirect` 0.000 (10/10 measured)
- `vision_describe` 0.000 (3/10 measured, 7 template-shortcut)
- `clawbot_composite` 0.000 (3/10 measured)
- `deep_concept` 0.000 (5/10 measured)

### Root cause
Per `docs/audits/iter-39-rag-metadata-backfill-coverage.md` §3:
> "With page=0% filled, condition (a) NEVER matches. Falls back to condition (b) keyword overlap only. Many R6 prompts trigger L2 template router → template_shortcut bucket excluded from average. Pre-iter-38 baseline: R6 avg recall@5 = 0.067 FAIL. Post-iter-38 backfill projected: marginal lift to ~0.08-0.12."

**R6 BLOCKED until Voyage re-ingest with page metadata** (~$1, 50min) per `iter-39-rag-metadata-backfill-coverage.md` §4 Path 1.

---

## §5 R7 stress (INTENT exec rate)

### Latest run (2026-05-01T07:43:03)
File: `scripts/bench/output/r7-stress-report-2026-05-01T07-43-03-043Z.md` lines 16-34

| Metric | Value | Threshold | Verdict |
|--------|-------|-----------|---------|
| Successful | 197/200 | — | — |
| Canonical `intents_parsed` (≥1 valid) | 7 | — | — |
| Legacy `[AZIONE:...]` only | 84 | — | — |
| No actionable signal | 106 | — | — |
| **Canonical INTENT exec rate** | **3.6%** | ≥80% | **FAIL** |
| Combined (canonical + legacy AZIONE) | **46.2%** | ≥80% | FAIL |

### Intent quality (across 19 canonical intents)
- Shape valid 100% / Whitelist match 100% / Params shape valid 36.8%

### Latency
- Avg 1630ms / p50 1656ms / p95 3315ms / p99 4623ms

### Per-category canonical (worst)
- `off_topic_redirect` 0.0% (0/20)
- `clawbot_composite` 0.0% (0/18)
- `plurale_ragazzi` 0.0% (0/20, 14 legacy AZIONE)
- `citation_vol_pag` 0.0% (0/20, 20/20 legacy AZIONE = 100% combined)

### Root cause per CLAUDE.md iter 38 carryover caveat 2
> "L2 template router (clawbot-template-router.ts) short-circuits 95%+ of fixture prompts BEFORE Mistral function calling fires. Canary ON achieves nothing measurable for canonical %. iter 40+ requires reducing L2 template scope OR widening shouldUseIntentSchema OR disabling L2 for action-heavy categories."

---

## §6 Lighthouse

### chatbot-only route (`docs/audits/iter-38-lighthouse-chatbot-only.json`)
| Category | Score |
|----------|-------|
| Performance | **0.26** FAIL |
| Accessibility | 1.00 PASS |
| SEO | 1.00 PASS |
| Best Practices | 0.96 PASS |

### easter-modal route (`docs/audits/iter-38-lighthouse-easter-modal.json`)
| Category | Score |
|----------|-------|
| Performance | **0.23** FAIL |
| Accessibility | 1.00 PASS |
| SEO | 1.00 PASS |
| Best Practices | 0.96 PASS |

### Sprint U Cycle 1 finding
Per CLAUDE.md Sprint U Cycle 1 close: "Lighthouse perf=43 (react-pdf 407KB + mammoth 70KB eager-loaded, lazy-load fix needed)". Note: `0.43` was different route (likely homepage `iter-38-lighthouse-home.json` NOT measured Phase 0 — different file).

### Phase 1 implications
- a11y 100/SEO 100/BP 96 already MEET targets — preserve, don't degrade.
- perf gap: -0.64 (chatbot-only) and -0.67 (easter-modal). Optim atoms iter 38 P0.10 deferred → iter 39+: lazy mount route components, defer non-critical chunks, image optimization, font preload.

---

## §7 Page metadata RAG count

### Source (Supabase query NOT executed — env not provided to subagent)
File: `docs/audits/iter-39-rag-metadata-backfill-coverage.md` lines 9-21

```
NOTICE: rag_chunks backfill iter 38 — total=2061 page=0(0.0 pct) chapter=180(8.7 pct) section=180(8.7 pct)
```

| Metric | Count | % | Source path |
|--------|-------|---|-------------|
| Total chunks | 2061 | 100% | `rag_chunks` row count |
| `page` filled | **0** | **0.0%** | `metadata->>'page'` NULL across all chunks |
| `chapter` filled | 180 | **8.7%** | `metadata->>'chapter'` present |
| `section_title` filled | 180 | 8.7% | `metadata->>'section_title'` present |

### Root cause
Voyage AI RAG ingest pipeline (`scripts/rag-ingest-voyage-batch.mjs` per memory iter 7 close 1881 chunks) populated `metadata` jsonb but never had page-level metadata to source from. Path A fuzzy match Step 4 (regex `cap{N}_pag{N}` on `metadata->>'chunk_id'`) yielded 0 matches because Voyage stored chunk_id as opaque hash NOT fixture-aligned format.

### Resolution path (defer iter 40+)
Per audit §4: Path 1 Voyage re-ingest with page metadata (recommended, ~$1, ~50min) OR Path 2 R6 fixture v3 schema rebuild (~3h).

---

## §8 94 esperimenti audit (E2E spec)

### File existence
```
tests/e2e/29-92-esperimenti-audit.spec.js
wc -l: 396
```

### Shape (lines 1-60 read)
- Spec author: Andrea Marro 2026-04-29 iter 29 Sprint T (per file header)
- Andrea iter 21 mandate response: "MOLTI ESPERIMENTI NON FUNZIONANO"
- Iterates 87 canonical lesson-paths (`v[123]-cap*-esp*`) + 7 extras (morse/semaforo/mini/serial/extras)
- Captures per esperimento: mount strategy, SVG render count, components count vs expected JSON, wires count, component types match, console errors, page errors, failed requests, compile button availability, screenshot
- Pass criteria: WORKING / PARTIAL / BROKEN tri-state with explicit thresholds (svg ≥ 5, components ≥ 0, expected match within 80%, 0 page errors)
- Output: `automa/state/iter-29-92-esperimenti/results.jsonl` + `docs/audits/iter-29-92-esperimenti-screenshots/`

### Status
**NOT EXECUTED Phase 0** — defer Phase 4 H Tester-1 (per subagent task spec). Mac Mini autonomous plan iter 39+ Task 3 also assigns this (`docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md`) ~3h headless local-run.

---

## §9 Edge Function unlim-chat version chain

### Command
```bash
git log --oneline -20 supabase/functions/unlim-chat/ | head -25
```

### Output (top 10 entries)
```
1feda3c fix(iter-39-A3): surface dispatcher_results in response payload
0d545fb feat(iter-39-A3-OpenClaw-Deno): 12-tool server-safe dispatcher MVP per ADR-032
027d04f feat(iter-39-A4-Onniscenza-V2): cross-attention + 8-chunk budget per ADR-033
e84a169 feat(iter-39-ralph): 5 atoms partial — A1 SSE backend+frontend + A3+A4 ADRs + A2+A5 audits
223d1c6 feat(iter-39-A1-SSE): import callMistralChatStream into unlim-chat (wire branch iter 2)
e265e74 feat(iter-39): cap_words 60→150 + Onniscenza re-enabled
a9755af feat(iter-39-mac-mini-handoff): Tier 1 cache LIVE v56 + R5 -64% lift
f21c227 feat(iter-38): Mistral function calling INTENT canonical + Latency Tier 1 + Wake word UX + PWA prompt-update
a10e98c feat(iter-37-PHASE-3-CLOSE): Sprint T close lifts + 14 carryover chiusi + 5 deploy + dual fix INTENT + STT v2
f9628c1 feat(iter-36): bug sweep + INTENT parser + Mac Mini USER-SIM curriculum
```

### Version mapping per audit context
- **v50** = iter 37 PHASE 3 (commit `a10e98c`)
- **v54** = iter 38 entrance baseline canary OFF (R7 canonical 4.1%)
- **v55** = canary partial
- **v56** = iter 38 carryover canary ON (`SEMANTIC_CACHE_ENABLED=true` + Mistral function calling, R7 canonical **3.6% UNCHANGED FAIL** despite canary ON)
- **iter 39 chain** = `e265e74` cap_words 150 + `223d1c6` SSE wire + `e84a169` 5-atom partial + `027d04f` Onniscenza V2 ADR-033 + `0d545fb` 12-tool dispatcher MVP ADR-032 + `1feda3c` dispatcher_results surface

### Phase 1 implication
Iter 39 ADR-032 (12-tool dispatcher) + ADR-033 (Onniscenza V2 cross-attention) are NEW vs PHASE 0 audit context. R5/R6/R7 latest runs (§3-§5) PRE-DATE these commits. Re-bench mandatory before claiming any iter 39 lift.

---

## §10 Git baseline

### branch + HEAD
```
branch: e2e-bypass-preview
HEAD:   3ac4aec2adc7d052eaf5a13ab9c9c0968364960d
```

### Top 5 commits
```
3ac4aec docs(plan): Sprint T close 11-fasi Andrea solo dev ratify 2026-05-02
8205fe4 docs(iter-39-carryover): #20 Mac Mini HALT IGNORED investigation
430659a feat(iter-39-carryover): Vercel SSE LIVE + Sprint U Cycle 2 PRINCIPIO ZERO 100%
02b5c03 docs(iter-39-A4-REGRESSION): V2 Onniscenza REVERTED to V1 — bench shows -1.0pp PZ V3 + 36% slower
e8dd53e docs(iter-40-handoff): Andrea ratify queue paste-ready iter 40 entrance
```

### Working tree status
```
Modified:
- automa/state/heartbeat
- automa/state/iter-19-harness-2.0-results.json
- scripts/bench/workloads/sprint-r0-score-results.json

Untracked (selected):
- scripts/bench/output/imggen-20-flux/
- scripts/bench/output/iter-29-massive/
- scripts/bench/output/iter-30-massive-test/
- scripts/bench/output/pixtral-20-image/
- scripts/bench/output/voxtral-20-sample/
- scripts/bench/output/r{5,6,7}-stress-{report,responses,scores}-* (recent runs)
```

**Phase 1 implication**: working tree DIRTY before any work. Stash or commit untracked bench outputs before introducing new changes (avoid `git add -A` accidentally including unwanted state per CLAUDE.md anti-regressione FERREA).

### iter 39-A4-REGRESSION note
Commit `02b5c03` reveals an iter 39 attempt: "V2 Onniscenza REVERTED to V1 — bench shows -1.0pp PZ V3 + 36% slower". This means current HEAD (`3ac4aec`) likely includes the V1 fallback, NOT V2 cross-attention from `027d04f`. Confirms the R5/R6/R7 latest baselines (§3-§5) measure V1 Onniscenza behavior.

---

## §11 Anti-pattern list — claims NOT supported by Phase 0 evidence

The following claims that appear in CLAUDE.md, audits, or PDR docs are **NOT verified by Phase 0 evidence** and must be re-measured before being repeated:

1. **"INTENT canonical ≥80% achievable iter 38 carryover"** — R7 latest 3.6% canonical (§5). Canary ON measured iter 38 carryover: 3.6% UNCHANGED vs canary OFF 4.1%. L2 template router dominance not yet mitigated.

2. **"R6 ≥0.55 recall@5 unblock by metadata backfill iter 38"** — recall@5 stays 0.067 (§4). Coverage 0% page (§7). Backfill migration shipped its job (idempotent SQL applied), but Voyage ingest never had page data to source from. Real unblock = re-ingest, not backfill.

3. **"Sprint T close 9.5/10 ONESTO achieved iter 38"** — A10 Onnipotenza Deno port status iter 39: ADR-032 12-tool dispatcher MVP shipped (commit `0d545fb`) but R5/R6/R7 latest baselines pre-date this commit. Measurement gap.

4. **"R5 latency cap removed iter 38 carryover (1607/3380)"** — TRUE for 2026-05-01 run (CLAUDE.md), but latest 2026-05-02T07:28 run is BROKEN 0/8 (§3). Regression risk between iter 38 carryover and iter 39 commits unverified.

5. **"Lighthouse perf ≥90 achieved Sprint T close"** — chatbot-only 0.26, easter-modal 0.23, both FAIL ≥0.90 (§6). A6 acceptance gate iter 38 P0.10 admits defer. NO Phase 0 evidence of any Lighthouse perf optim shipped between iter 38 measurement (2026-05-01) and HEAD (2026-05-02).

6. **"94 esperimenti broken count REAL ≤10"** — spec exists 396 LOC but NEVER executed (§8). All claims about broken count come from Andrea iter 21 mandate verbal estimate "MOLTI ESPERIMENTI NON FUNZIONANO" — not measured.

7. **"Build PASS pre-commit verified iter 38+"** — DEFERRED §2. Last documented PASS iter 37 PHASE 3. Vercel deploy LIVE indicates a build PASSED somewhere between iter 38 and iter 39, but no local verify on HEAD `3ac4aec`.

8. **"vitest 13256+ baseline preserved iter 38+"** — TRUE per Phase 0 measure 13474 (§1) which exceeds 13256. But automa/baseline-tests.txt also reads 13474 (synced). Drift 0 confirmed.

9. **"Onniscenza V2 cross-attention LIVE prod"** — Reverted V1 (commit `02b5c03`). NOT live.

10. **"R7 canonical lift via canary ON"** — Falsified by §5 + iter 38 carryover caveat 2.

---

## §12 Phase 1+ recommendations

1. **Phase 1 entrance pre-flight CoV** (mandatory before any code change):
   - `npx vitest run --reporter=basic` MUST equal 13474 PASS
   - `npm run build` MUST PASS (~14min)
   - Working tree CLEAN (commit or stash dirty state)

2. **Re-bench R5 valid before iter 39+ claims**:
   - Investigate 2026-05-02T07:28 0/8 failure (auth header? Edge endpoint? rate limit?)
   - Restore PASS baseline equivalent to 2026-05-01T07:43 (avg 1607ms p95 3380ms PZ V3 94.2%)

3. **R7 canonical fix ROI estimate**: reduce L2 template router scope OR widen `shouldUseIntentSchema` heuristic — measure delta canonical % before/after (currently 3.6% baseline).

4. **R6 unblock**: Voyage re-ingest with page metadata extraction (~$1, ~50min) per `iter-39-rag-metadata-backfill-coverage.md` §4 Path 1. Will lift recall@5 from 0.067 toward 0.55 target.

5. **Lighthouse perf optim (Phase 4 atoms)**: lazy-load react-pdf 407KB + mammoth 70KB (Sprint U Cycle 1 finding) — restore perf from 0.23-0.26 toward 0.90.

6. **94 esperimenti audit Phase 4 H Tester-1 execution mandatory** — Sprint T close gate per CLAUDE.md iter 21+ Andrea mandate carryover. ~3h Mac Mini autonomous OR local headless run.

---

## §13 Files cited (canonical paths)

- `automa/baseline-tests.txt` (13474)
- `scripts/bench/output/r5-stress-report-2026-05-02T07-28-58-859Z.md` (latest R5 BROKEN)
- `scripts/bench/output/r5-stress-report-2026-05-01T07-43-04-636Z.md` (last PASS R5)
- `scripts/bench/output/r6-stress-report-2026-04-30T18-53-28-013Z.md` (R6)
- `scripts/bench/output/r7-stress-report-2026-05-01T07-43-03-043Z.md` (R7)
- `docs/audits/iter-38-lighthouse-chatbot-only.json` (Lighthouse chatbot perf 0.26)
- `docs/audits/iter-38-lighthouse-easter-modal.json` (Lighthouse easter perf 0.23)
- `docs/audits/iter-39-rag-metadata-backfill-coverage.md` (page=0%/chapter=8.7%)
- `tests/e2e/29-92-esperimenti-audit.spec.js` (396 LOC, NOT executed)
- `supabase/functions/unlim-chat/index.ts` (Edge Function v50→v56→iter39 chain)
- `docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md` (autonomous Tasks 1-10)
- `CLAUDE.md` (orchestration source of truth, sprint T iter 36/37/38 + carryover)

---

**End of Phase 0 baseline measurement. Subagent 2 mandate: ZERO assumptions enforced.**
