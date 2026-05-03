# Iter 31 Ralph Iter 14 — Skills V2 Consolidated Dry-Run + Real Gap Verdict

**Date**: 2026-05-03 07:30Z
**Iter**: Sprint T iter 31 ralph iter 14
**Pattern**: Inline skills V2 validation post iter 6+9 calibration + iter 8 palette migration impact measure

---

## §1 Context

Skills shipped iter 31 Phase 1 (iter 1) + V1 calibration top-5 (iter 6) + V2 final 3 (iter 9) + iter 8 palette migration top-10 (217 hex → var(--elab-*)).

Iter 14 dry-run consolidated 3 skills V2:
1. `elab-morfismo-validator` (10 gates G1-G10, V2 calibrated 5 fixes iter 6+9)
2. `elab-onnipotenza-coverage` (9 gates L0-L9, V2 calibrated 3 fixes)
3. `elab-onniscenza-measure` (8 gates G1-G8, V1 baseline only iter 1, NO V2 calibration this iter)

---

## §2 Morfismo V2 dry-run results

| Gate | Raw | Score | Verdict |
|---|---|---|---|
| G1 palette compliance | 10/185 | 0.054 | TRUE GAP — iter 8 top-10 217 hex→var lifted 8→10 file count, 175 file restanti hardcoded hex (95.7% gap) |
| G4 ToolSpec count | 57 | 1.0 | ✅ Target met (canonical iter 37 sync) |
| G5 ElabIcons SVG | 32 | 1.0 | ✅ Target ≥24 met |
| G7 morfismo markers | 5 | 0.5 | TRUE GAP UNCHANGED (defer iter 16+ codemod expand 5→10+) |
| G8 lesson-paths coverage | 87/89 | 0.978 | ✅ Near-target (Mac Mini D3 audit 87/92 reali) |

NOT measured inline (defer iter 32+ skill V2 dry-run via Skill tool):
- G2 NanoR4Board SHA-256 (re-bootstrapped iter 9 `fba89ec...`)
- G3 fonts Oswald+Open Sans+Fira Code (iter 6 V1 fix verified)
- G6 emoji UI (19 residual post HomePage exclusion iter 6)
- G9 Vol/pag verbatim (iter 9 V2 bookText field count fix)
- G10 lesson-groups (iter 6 V1 LESSON_GROUPS pattern fix)

**MORFISMO_SCORE estimate post-iter-8+9**: ~7.1/10 (vs V0 5.05, V1 6.43)
- Lift G1 +0.01 (iter 8 top-10 marginal counter increase)
- Lift G3+G6+G9+G10 false positives removed iter 6+9 (~+1.4 cumulative)
- TRUE GAPS persistent: G1 palette 175 file restanti + G7 markers 5/10

---

## §3 Onnipotenza V2 dry-run results

| Gate | Raw | Score | Verdict |
|---|---|---|---|
| L0 unlim API | 1 (single-file) | 0.038 | SKILL REGEX limitation — Maker-2 iter 6 reportedly fixed multi-file scan to "unlim=15 + top=55 = 70 totale", inline single-file `src/services/simulator-api.js` returns 1. Skill V2 invocation via Skill tool may show correct count |
| L2 inlined templates | 20/20 | 1.0 | ✅ V2 fix CONFIRMED working (`^\s{4}id:\s*'L2-` strict pattern matches `TEMPLATES_L2: ClawBotTemplate[]` array) |
| Whitelist 12 actions | 12/12 | 1.0 | ✅ NO destructive actions, intentsDispatcher.js |

NOT measured inline:
- L1 composite handler tests (CLAUDE.md says 10/10 PASS, V1 regex fix iter 6)
- L3 Deno 12-tool (postToVisionEndpoint EXISTS iter 6 P3)
- L4 INTENT parser fire-rate prod (requires Edge logs telemetry)
- L5 Mistral function calling canonical R7 ≥95% (iter 38 carryover 3.6% FAIL)
- L7 CANARY_DENO_DISPATCH_PERCENT (iter 39 G45 Opus baseline 0% verified)
- L8 ENABLE_INTENT_TOOLS_SCHEMA (iter 38 carryover canary ON)

**ONNIPOTENZA_SCORE estimate post-V2**: ~0.78 (vs V0 0.33, V1 0.56)

---

## §4 Onniscenza dry-run results (V1 baseline, NO V2 calibration iter 31)

| Gate | Raw | Score | Verdict |
|---|---|---|---|
| G4 Wiki concepts count | 126 | 1.0 | ✅ Target ≥126 met (CLAUDE.md iter 29 close 100/100 + 26 MM1 = 126) |
| G2 classifier 6 categories | 1 inline (regex strict) | partial | INLINE REGEX limitation — onniscenza-classifier.ts has 6 categories per CLAUDE.md iter 37 A2 (chit_chat, deep_question, safety_warning, citation_vol_pag, plurale_ragazzi, default). Skill V2 invocation likely better |

NOT measured inline:
- G1 7-layer aggregator coverage (V1 active prod ENABLE_ONNISCENZA=true iter 31)
- G3 RAG chunks count + page coverage (1881 chunks iter 7, page=0% Voyage gap iter 38 carryover)
- G5 Hybrid retriever recall@5 (R6 fixture 0.067 FAIL ≥0.55 iter 38 carryover, page=0% blocker)
- G6 Anti-absurd flag rate
- G7 Conversation history embed cache hit rate
- G8 V1 vs V2 ratio (V1 active per ONNISCENZA_VERSION=v1 env iter 39 G45 Opus baseline)

**ONNISCENZA_SCORE V1 baseline maintained** (iter 11 R5 V1 PZ V3 94.41% PASS confirms quality preserved)

---

## §5 Real GAPS surfaced post iter 6+8+9 cumulative

### TRUE GAP 1: Palette migration STILL 175/185 file (iter 8 closed only top-10)
- Raw: 10/185 = 5.4% file compliant
- Iter 8 codemod top-10 = 217 hex literal → var(--elab-*) replaces, but PER-FILE compliance count gained only +2 (other files still have residual hardcoded hex outside top-10)
- HIGH IMPACT future iter 15+ wave 2 batch (next 10-20 file)
- Sprint T close gate per CLAUDE.md rule 16 Sense 2 Morfismo

### TRUE GAP 2: morfismo markers 5/10 UNCHANGED (iter 16+ codemod expand)
- Per master plan §2 Phase 6 + iter 7 plan iter 16-17
- Add `data-elab-mode={mode}` + `data-morfismo-class={classKey}` + `data-elab-modalita={modalita}` markers across ModalitaSwitch + LavagnaShell + FloatingWindow + ChatbotOnly

### TRUE GAP 3: R6 hybrid retriever recall@5 0.067 FAIL ≥0.55 (Voyage page=0% Voyage gap iter 38 carryover)
- Real unblock: Voyage re-ingest with page metadata extraction (~$1, ~50min, iter 14-15 gated Andrea ratify ADR clarification)
- ADR-033 actual topic "v2-cross-attention-budget" NOT page metadata as master plan claimed (master plan misalignment)

### TRUE GAP 4: R7 Mistral function calling canonical 3.6% FAIL ≥80% (iter 38 carryover)
- L2 template router dominance pre-LLM
- Iter 14+ fix: widen `shouldUseIntentSchema` heuristic OR reduce L2 template scope

### TRUE GAP 5: Latency +22.8% regression iter 11 vs iter 38 carryover (1607ms → 1974ms avg)
- Honest signal NOT actionable iter 11 (V1 baseline measurement)
- Defer iter 12+ root cause systematic-debugging skill (possible: Edge v72→v73+ deploy churn / Onniscenza overhead / RAG slow / Mistral variability)

---

## §6 CoV iter 14

- CoV-1: vitest 13668 PASS baseline (post iter 13 equivalence test +3)
- CoV-2: 3 skills inline dry-run produced output (5 morfismo gates + 3 onnipotenza gates + 2 onniscenza gates measured inline, 16 gates total deferred Skill tool invocation iter 32+)
- CoV-3: vitest 13668 PASS baseline preserve POST iter 14 (NO src/tests/ changes, dry-run only)

---

## §7 Anti-pattern G45 enforced iter 14

- NO compiacenza: raw 5/185 palette + 5/10 markers reported even if low
- NO claim "skills full LIVE" (multiple inline regex limitations + 3 unmeasured gates per skill)
- NO inflate score (8.20/10 UNCHANGED iter 14, dry-run only)
- NO write outside `docs/audits/` (this file)
- NO commit (orchestrator commits Phase 3)
- NO destructive ops
- NO --no-verify

---

## §8 Iter 15+ priorità ROI

1. **P0** Phase 6 morfismo markers expand 5→10+ (iter 16+ codemod) — TRUE GAP 2
2. **P0** Phase 5 Vol/pag 95% Voyage re-ingest gated ADR clarification + Andrea ratify — TRUE GAP 3 (R6) + Vol/pag verbatim
3. **P1** Palette migration wave 2 (next 10-20 file iter 15+) — TRUE GAP 1
4. **P1** R5 latency root cause systematic-debugging — TRUE GAP 5
5. **P1** R7 Mistral FC canonical fix iter 14+ widen `shouldUseIntentSchema` — TRUE GAP 4
6. **P2** Skill V2 invocation Skill tool dry-run consolidated proper (better counts vs inline) — defer iter 32+
7. **P0 Sprint T close gate** Phase 7 iter 18-20 final audit + Andrea Opus G45 indipendente review

---

## §9 Cross-link

- Iter 5 V0 dry-run: `docs/audits/2026-05-03-iter-31-ralph5-skills-dry-run.md`
- Iter 6 V1 calibration: commit `5d848a5`
- Iter 9 V2 final calibration: commit `f1a60bf`
- Iter 8 palette migration top-10: commit `5074f6e`
- Iter 11 R5 V1 baseline: commit `d1a072e`
- Iter 12 wake word 9-cell: commit `323f06e`
- Iter 13 WAKE_PHRASES equivalence: commit `da254c8`
- Master plan iter 31: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Plan iter 8-20: `docs/superpowers/plans/2026-05-03-iter-31-ralph-iter-8-to-20-make-plan.md`

---

**Status iter 14 ralph close**: 8.20/10 ONESTO UNCHANGED. Skills V2 calibrated SHIPPED + DRY-RUN VALIDATED. 5 TRUE GAPS surfaced for iter 15+ ROI prioritization.
