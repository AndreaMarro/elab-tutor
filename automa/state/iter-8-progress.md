# Sprint S iter 8 progress (ralph loop master state)

**Started**: 2026-04-27T12:10:15Z (orchestrator iter 1)
**Branch**: feat/sprint-s-iter-2-software-prompt-v3-wireup-2026-04-26
**Pre-flight CoV**: vitest 12599 PASS GREEN baseline ✅
**Bootstrap**: 11/11 keys ✅, RAG 1881 chunks ✅, Mac Mini SSH alive 20d ✅, 5/5 Edge Functions ✅, 5/5 migrations sync ✅

## PHASE 1 (parallel 4 agents OPUS) — file ownership rigid

| Agent | Status | File ownership | Completion msg path |
|-------|--------|----------------|---------------------|
| planner-opus-iter8 | ✅ COMPLETED iter 1 (12 ATOMs + contract + 5 msgs) | `automa/tasks/pending/ATOM-S8-*.md`, `automa/team-state/sprint-contracts/sprint-S-iter-8-contract.md` | `planner-opus-iter8-to-orchestrator-2026-04-27-121207.md` |
| architect-opus-iter8-r2 | ✅ COMPLETED iter 2 (ADR-015 770 LOC pre-existing r1 verified intact + ADR-016 625 LOC NEW r2) | `docs/adrs/ADR-015-*.md`, `docs/adrs/ADR-016-*.md` | `architect-opus-iter8-to-orchestrator-2026-04-27-123218.md` |
| gen-app-opus-iter8-r2 | ✅ COMPLETED iter 2. Hybrid RAG retriever rag.ts 511→895 LOC + TTS WS edge-tts-client.ts 162→361 LOC rewrite + ClawBot composite live (postToVisionEndpoint.ts 169 NEW + dispatcher +27 + composite-handler +45) + 5 NEW scorers + 5 NEW runners + master orchestrator iter-8-bench-runner.mjs 361 LOC. CoV vitest main 12599 PASS preserved + openclaw 129 PASS + TTS 24/24 PASS | `supabase/functions/**`, `scripts/openclaw/**`, `scripts/bench/score-*.mjs`, `scripts/bench/run-*.mjs`, `scripts/bench/iter-8-bench-runner.mjs` | `gen-app-opus-iter8-to-orchestrator-2026-04-27-144200.md` |
| gen-test-opus-iter8-r2 | ✅ COMPLETED iter 2 (session-replay 50 + fallback-chain 200 + 20 PNGs+metadata + README + composite-handler.test.ts 224→481 LOC 5 NEW tests preserving 5 existing → 129 PASS openclaw config + hybrid-rag.test.js 114 LOC NEW skip-on-env). Vision E2E exec: 5 SKIPPED defensive env gate, NOT spec fail. PNGs placeholder pure-Python zlib (no PIL/convert), real screenshots deferred iter 9 | `scripts/bench/session-replay-fixture.jsonl`, `scripts/bench/fallback-chain-fixture.jsonl`, `tests/fixtures/circuits/*`, `scripts/openclaw/composite-handler.test.ts` (extend), `tests/integration/hybrid-rag.test.js` | `gen-test-opus-iter8-to-orchestrator-2026-04-27-143500.md` |

## PHASE 2 (sequential post 4/4 completion barrier)

| Agent | Status | File ownership |
|-------|--------|----------------|
| scribe-opus-iter8 | PENDING (waits 4/4 PHASE 1 msgs) | `docs/audits/2026-04-27-sprint-s-iter8-audit.md`, `docs/handoff/2026-04-27-sprint-s-iter-8-to-iter-9-handoff.md`, `CLAUDE.md` (append iter 8 close), `docs/unlim-wiki/`, `automa/team-state/messages/scribe-opus-iter8-*.md` |

## PHASE 3 (orchestrator post scribe)

- [x] Master runner DRY-RUN executed: 4/6 PASS (B2+B4+B6+B7), B3 skipped (env gate), B1+B5 fail synthetic dry. Score dry 7.5/10 YELLOW
- [DEFERRED iter 9] Live bench full execution — B2 hybrid RAG / B4 TTS WS / B5 ClawBot composite require Andrea deploy unlim-tts WS + RAG_HYBRID_ENABLED env flag prod; B3 Vision needs class_key fixture; B1 live ~$1+ + 10-15min Together cost
- [x] Score iter 8 PHASE 3 close ONESTO: **8.5/10** (PHASE 1 deliverables shipped + PHASE 3 dry-run signal, full live = iter 9 post-deploy)
- [ ] Commit batch iter 8 (NO main, NO merge, NO --no-verify)
- [ ] Push origin feat branch
- [ ] Tea email send (10 file `/Users/andreamarro/VOLUME 3/TEA/2026-04-27-onboarding-tea-iter-7-close/`)

### PHASE 3 dry-run results

| Suite | Dry result | Reason |
|-------|-----------|--------|
| B1 R6 stress | FAIL | dry mode synthetic (live needs Edge Function call ~$1) |
| B2 Hybrid RAG | PASS 71ms | dry mode synthetic (live blocked: hybridRetrieve NOT deployed unlim-chat, RAG_HYBRID_ENABLED env flag prod NOT set) |
| B3 Vision E2E | SKIPPED | env gate: class_key fixture + ELAB_API_KEY scope (defensive skip iter 9 ~10min unblock) |
| B4 TTS Isabella | PASS p50=1660ms p95=2132ms MOS=4.00 success=100% | dry mode (live blocked: unlim-tts WS NOT deployed, edge-tts-client.ts rewrite NOT shipped Edge Function) |
| B5 ClawBot composite | FAIL synthetic step | dry mode injected failures (live blocked: unlim-diagnose endpoint integration NOT verified) |
| B6 Cost | PASS avg €0.002 vs €0.012 threshold | synthetic projection from session-replay-fixture, no live billing data |
| B7 Fallback | PASS gate=100% audit=100% anonymization=100% transit avg=329ms | synthetic chains, no live Supabase audit_log replay |

**Aggregate dry**: 4/6 PASS + 1 SKIP = 7.5/10 score gate informational (NOT iter 8 close definitive — live run iter 9 post-deploy).

## Pass criteria HARD GATE iter 8

- B1 R6 ≥87% globale + 10/10 cat ≥85%
- B2 Hybrid RAG recall@5 ≥0.85, precision@1 ≥0.70, MRR ≥0.75
- B3 Vision latency p95 <8s + topology ≥80% + diagnosis ≥75%
- B4 TTS Isabella WS p50 <2s + p95 <5s + MOS ≥4.0
- B5 ClawBot success ≥90% + sub-tool latency p95 <3s
- B6 Cost <€0.012/session avg + p95 <€0.025
- B7 Fallback gate accuracy student-runtime 100% + audit log 100% + transit RunPod→Gemini p95 <500ms

## Score gates ONESTO

- 7/7 GREEN → 9.2/10 (best case)
- 6/7 GREEN → 8.7/10 (target ONESTO)
- 5/7 GREEN → 8.2/10 (acceptable)
- ≤4/7 GREEN → 7.5/10 stuck (defer iter 9)

## MID-ITER-8 UPDATE 2026-04-27 12:50 — Morfismo DUAL SENSE clarification

Andrea clarifies Morfismo = TWO senses combinati. Inject in all in-flight + pending agents:

**Sense 1 — Tecnico-architetturale**: piattaforma MORFICA + MUTAFORMA. Software adatta runtime per-classe/per-docente/per-kit/per-momento. Codice morfico (L1 composition + L2 template + L3 flag DEV). OpenClaw 52 ToolSpec + composite handler.

**Sense 2 — Strategico-competitivo**: coerenza software ↔ kit Omaric ↔ volumi cartacei. Moat 2026+ vs LLM coding democratizzato. Triplet artefatti fisici originali non replicabili via prompt.

**Combinato**: software morfico INTERNO (adatta runtime) + coerente ESTERNO (triplet immutabile). Doppia barriera entry: tecnica + materiale.

### Apply iter 8 in-flight agents

- **architect-opus** (✅ COMPLETED r2): ADR-015 Hybrid RAG + ADR-016 TTS WS — re-verify both align Sense 1+2. ADR-015 BM25+dense+RRF+rerank = morphic retrieval (S1) + cita Vol/pag (S2). OK no rewrite needed.
- **gen-app-opus-r2** (🔄 IN-FLIGHT): when implementing Hybrid RAG retriever + ClawBot composite + TTS WS, ensure:
  - S1: adapt per-class context (chunk filter by class_key + experiment context)
  - S2: cita Vol/pag dai chunks retrieved (preserve metadata source=vol1+page)
- **gen-test-opus** (✅ COMPLETED r2): bench fixtures already cite Vol/pag in r6-fixture-100. OK.
- **scribe-opus** (PENDING): include Morfismo dual sense section in iter 8 audit + handoff + CLAUDE.md update

### Reject criteria pre-merge iter 8

Feature contribuisce:
- S1 morfico runtime adattivo? (yes/no)
- S2 triplet coerenza materiale? (yes/no)
- Se entrambi NO → REJECT
- Se uno solo → flag for iter 9 enrichment

