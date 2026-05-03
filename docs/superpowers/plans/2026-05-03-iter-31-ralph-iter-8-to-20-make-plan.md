# Iter 31 Ralph Loop iter 8-20 Plan — Sprint T close path

**Date**: 2026-05-03
**Source**: `/make-plan` reflection iter 31 ralph iter 7
**Sprint T close target**: 8.5/10 ONESTO realistic iter 41-43 cumulative + Andrea Opus G45 review Phase 7
**Current iter 31 ralph iter 6 close**: 8.10/10 ONESTO baseline

---

## Phase 0 — Documentation Discovery (already complete iter 5)

State map verified iter 31 ralph iter 1-6:
- **Iter 5 dry-run findings**: `docs/audits/2026-05-03-iter-31-ralph5-skills-dry-run.md`
- **Master plan iter 31**: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- **Phase 1 close audit**: `docs/audits/2026-05-02-iter-31-PHASE1-CLOSE-audit.md`
- **G45 Opus baseline iter 39**: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` (8.0/10)
- **Andrea ratify queue**: `automa/state/iter-31-andrea-flags.jsonl` (10 entries: 9 flagged + 1 resolved env)
- **Sprint U Cycle 1 audit**: `docs/audits/sprint-u-cycle1-iter1-CONSOLIDATED-audit.md`

State current iter 31 ralph iter 6 close:
- 6 commit landed branch `e2e-bypass-preview`: `ee4ab56` + `cb87617` + `fe37c81` + `5be1bde` + `48ffc31` + iter 6 commit pending
- Vitest baseline 13665 PASS preserved (iter 4 codemod added 12 wake word tests)
- Mac Mini cron user-sim curriculum L1+L2+L3+aggregator ACTIVE 96 branches/24h
- Skills V1 shipped + 5 calibration fixes shipped iter 6 (3 deferred iter 32+)

Real gaps surfaced (NOT skill bugs):
- TRUE GAP 1 HIGH IMPACT: palette token migration 8/183 files (175 hardcoded hex)
- TRUE GAP 2 MEDIUM: data-elab/morfismo markers 5/10
- TRUE GAP 3 carryover: Sprint U Cycle 2 atom 2.4 v3-cap8-serial bb1 (intentional vs audit conflict, Andrea decide)

---

## Phase 1 — Iter 7-8: Palette token migration codemod top-10 components (4-6h)

**Goal**: convert 175 hardcoded hex files to CSS var tokens per CLAUDE.md rule 16 (Sense 2 Morfismo triplet coerenza palette stampa volumi).

**Approach surgical** (NOT blanket):
1. Spawn Maker-1: identify top-10 most-used components (highest hex hardcoded count) via grep+sort
2. Define CSS var tokens in `src/styles/elab-palette.css` (NEW or extend existing):
   - `--elab-navy: #1E4D8C`
   - `--elab-lime: #4A7A25`
   - `--elab-orange: #E8941C`
   - `--elab-red: #E54B3D`
   - + 4-6 derived tokens (lighter/darker shades per WCAG AA)
3. Spawn Maker-1 surgical replace top-10 components: hex literal → `var(--elab-*)` tokens
4. CoV: vitest 13665 PASS + visual smoke regression (Lighthouse contrast WCAG 4.5:1 maintained)
5. Iter 8 close: 10 file done, 165 file remain — defer iter 9+ batch

**Anti-pattern**:
- NO blanket sed replace senza visual verify
- NO add new colors (palette FIXED Navy/Lime/Orange/Red per CLAUDE.md)
- NO modify NanoR4Board SVG palette (Sense 2 visual identity preserve)

**Verification checklist**:
- `grep -rEl "#1E4D8C\|#4A7A25\|#E8941C\|#E54B3D" src/components/{top10}/` → 0 results post fix
- `grep -rE "var\(--elab-(navy\|lime\|orange\|red)\)" src/components/{top10}/` → ≥10 results
- Lighthouse contrast WCAG AA preserved (Navy on white 7.2:1, Lime on white 5.1:1)
- Visual diff Playwright screenshots BEFORE/AFTER NO regression

---

## Phase 2 — Iter 9: Skill calibration 3 deferred bugs (1-2h)

**Goal**: complete Phase 1 V1 calibration per iter 5 dry-run §4 deferred items.

3 fix:
1. Morfismo G2 shasum: handle empty output gracefully (PATH issue) → wrap in `[ -z "$HASH" ] && echo "ERROR_EMPTY"` guard
2. Morfismo G9 Vol/pag regex relax: support enriched bookText format `Vol\.?\s*[0-9]+.*?(cap\.?\s*[0-9]+\s*)?pag\.?\s*[0-9]+` OR JSON field `volume_references[].vol_pag` count
3. Onnipotenza L2 clawbot-templates inlined: read actual `clawbot-templates.ts` array structure → fix regex per real export pattern

**Spawn**: Maker-2 (file ownership `~/.claude/skills/elab-{morfismo,onnipotenza}-*/SKILL.md`)

**Verification**:
- Re-invoke skills dry-run → all 10 morfismo gates + 9 onnipotenza gates produce reasonable counts (no "MISSING" / "0" false negatives from skill bugs)
- Document V2 score lift in `docs/audits/2026-05-XX-iter-31-ralph-9-skills-V2-dry-run.md`

---

## Phase 3 — Iter 10-11: Onniscenza V2.1 fair comparison vs V1 (4-6h)

**Goal**: master plan §2 Phase 5 Atom 5.1 — V2.1 conversational fusion fair design + bench.

**Iter 10** (Architect):
- Read `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` (V2 -1.0pp PZ V3 + 36% slower per G45 Opus baseline)
- Design V2.1 fair comparison protocol: same fixture R6 100-prompt against V1 vs V2.1
- Output `docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md` (~400 LOC)
- Wire-up reference `aggregateOnniscenzaV21` already shipped iter 41 commit `2abe26d` per master plan §2 Phase 5 Atom 5.1.2

**Iter 11** (Tester-1):
- Bench R5 V1 baseline + V2.1 canary 5% (gated Andrea env SUPABASE_SERVICE_ROLE_KEY + VOYAGE_API_KEY)
- Measure: PZ V3 % + latency p95 + recall@5
- Decision matrix: V2.1 stays canary 5% OR ramp 25%→100% OR revert (per master plan §2 Phase 5 Atom 5.1.4)
- Update inflation-flags.jsonl post-decision

**Anti-pattern**:
- NO claim "Onniscenza V2.1 LIVE" senza 24h soak + Opus G45 review
- NO override `ONNISCENZA_VERSION=v1` env senza V2.1 bench PASS

---

## Phase 4 — Iter 12-13: Wake word 9-cell STT matrix execution (2-3h)

**Goal**: master plan §2 Phase 6 Atom 6.1 — execute 9-cell matrix (3 STT engines × 3 mic permission states).

**Iter 12** (Tester-1):
- Execute `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js` (if exists, else create)
- 9 cells = (CF Whisper + Voxtral STT + Browser native) × (granted + denied + prompt)
- Output: 9-cell matrix table results

**Iter 13** (Maker-1 if regressions):
- Document failures + root cause via systematic-debugging skill
- Fix 9-cell failures iteratively (1 cell per atom)

**Verification**:
- 9/9 PASS OR documented failures with file:line root cause
- MicPermissionNudge UX iter 38 verify still LIVE

---

## Phase 5 — Iter 14-15: Phase 4 master plan PRINCIPIO ZERO Vol/pag verbatim 95% (gated Andrea)

**Gating**: Andrea actions sequential queue ~90min per master plan §2 Phase 4:
1. Ratify ADR-033 page metadata extraction strategy (15min)
2. Env provision VOYAGE_API_KEY + SUPABASE_SERVICE_ROLE_KEY (5min)
3. `node scripts/rag-ingest-voyage-batch-v2.mjs` (50min, ~$1)
4. Verify page coverage ≥80%
5. Deploy Edge Function v73+ con BASE_PROMPT v3.2 (5→8 few-shot + post-LLM regex validator stricter + L2 widen)
6. Smoke 5 prompts cherry-pick verify Vol/pag verbatim
7. Trigger Tester-2 R7 200-prompt re-bench (target ≥80% canonical)

**Iter 14** (Architect): ADR-033 design (if not already shipped iter 39 carryover)
**Iter 15** (Maker-1): Voyage re-ingest impl + Edge v73+ deploy gated

**Verification**:
- G+1 Vol/pag verbatim ≥95% gate PASS
- G3 Onniscenza measure RAG chunks coverage ≥80% PASS
- R7 200-prompt canonical ≥80% verified post-deploy

---

## Phase 6 — Iter 16-17: morfismo markers expand + final calibration (2h)

**Goal**: TRUE GAP 2 surfaced iter 5 — data-elab/morfismo markers 5 → 10+.

**Iter 16** (Maker-2):
- Identify components needing morphic markers per Sense 1.5 (per-docente/classe runtime)
- Codemod surgical add `data-elab-mode={mode}` + `data-morfismo-class={classKey}` + `data-elab-modalita={modalita}` per ModalitaSwitch / LavagnaShell / FloatingWindow / ChatbotOnly
- Target: 10+ data-elab/morfismo markers across 5+ components

**Iter 17** (Tester-2):
- Re-invoke morfismo skill dry-run V2 (post-iter-9 calibration + iter 16 markers)
- Document score lift V0 5.05 → V1 6.43 → V2 ~7.5+ honest
- 19 emoji TRUE residual decision: Andrea ratify whitelist OR codemod ElabIcons replace

---

## Phase 7 — Iter 18-20: Sprint T close finalization + Andrea Opus G45 review

**Iter 18** (Tester-1):
- R5 + R6 + R7 final bench post-deploy + Lighthouse perf optim final pass
- Mac Mini cron 24h soak verify (96 branches/24h continuity)

**Iter 19** (Scribe + Architect):
- Aggregate audit: invoke 5 skills (V2 calibrated) → produce `docs/audits/iter-31-FINAL-audit.md` consolidated
- Sprint T close projection cumulative score iter 41-43 path

**Iter 20** (Andrea action — orchestrator support):
- Spawn Opus G45 indipendente review session context-zero post Phase 6 close
- Verify cumulative score ONESTO ≤ 8.5 (Sprint T close target ONESTO 10gg per Decisione #7)
- CLAUDE.md sprint history footer recalibrate post Opus
- Andrea ratify queue Batch 1 (10 decisioni) closed

---

## CoV mandate ogni atom (3-step) — INVARIANT

1. CoV-1 baseline preserve: `npx vitest run` PRIMA atom must PASS baseline 13665
2. CoV-2 incremental: `npx vitest run tests/unit/{newscope}` post atom must PASS new tests
3. CoV-3 finale: `npx vitest run` POST atom must PASS baseline + delta tests

Failure CoV ANY step → REVERT IMMEDIATO + investigation systematic-debugging skill.

---

## Anti-pattern checklist iter 8-20 INVARIANT

- NO `--no-verify` mai
- NO push origin senza Phase 7 finale (carryover Andrea ratify)
- NO destructive ops (rm -rf, git reset --hard outside baseline tag)
- NO compiacenza score (raw numbers reported even if low)
- NO inflate score senza Opus G45 indipendente review
- NO claim "atom shipped" senza file-system verify post agent return
- NO claim "LIVE" senza prod smoke verify (claim-reality M-AI-03 mechanism)
- NO blanket replace narrativo (Sense 2 Morfismo voice intentional preserve)
- NO write outside file ownership rigid
- NO cron job permanenti senza Andrea explicit ratify (cron `*/20 Mac Mini check` session-only OK)

---

## Spawn pattern Pattern S r3 6-agent OPUS PHASE-PHASE caveman (or normal mode)

Iter 7+: orchestrator main session + agents background paralleli (max 2-3 parallel per iter to avoid org limit per CLAUDE.md iter 38 caveat).

File ownership rigid disjoint (no write conflict):
- Maker-1: `src/styles/` + `src/components/{top10}/` palette + lesson-paths v3 schema
- Maker-2: `~/.claude/skills/` + `src/data/lesson-paths/v*.json` codemod
- Tester-1: `tests/e2e/` + `scripts/bench/` + bench output
- Architect: `docs/adrs/` + `docs/architectures/`
- Scribe: `docs/audits/` + `docs/handoff/` + CLAUDE.md sprint history footer
- Documenter: `automa/team-state/messages/` completion msgs

---

## Sprint T close cascade target

| Iter | Target ONESTO | Lift | Cumulative |
|---|---|---|---|
| 31 ralph iter 6 close | 8.10/10 | baseline | — |
| 8 (palette top-10) | 8.20 | +0.10 | 8.20 |
| 9 (skill calibration V2) | 8.20 | +0.0 (calibration only) | 8.20 |
| 10-11 (Onniscenza V2.1) | 8.30 | +0.10 (canary 5%) | 8.30 |
| 12-13 (wake word 9-cell) | 8.35 | +0.05 | 8.35 |
| 14-15 (Vol/pag 95% gated Andrea) | 8.65 | +0.30 (HIGH IMPACT) | 8.65 |
| 16-17 (markers expand + caveats) | 8.70 | +0.05 | 8.70 |
| 18-19 (final bench + audit) | 8.70 | +0.0 | 8.70 |
| 20 (Andrea Opus G45 review) | 8.5 | -0.20 G45 cap likely | 8.50 ONESTO ✓ |

Sprint T close 8.5/10 ONESTO realistic iter 20 (NOT iter 41-43 inflated estimate originale).

---

## Cross-link

- Iter 5 findings: `docs/audits/2026-05-03-iter-31-ralph5-skills-dry-run.md`
- Master plan iter 31 originale: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Phase 1 close audit: `docs/audits/2026-05-02-iter-31-PHASE1-CLOSE-audit.md`
- G45 Opus baseline iter 39: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`
- Andrea ratify queue: `automa/state/iter-31-andrea-flags.jsonl`
- Sprint U Cycle 1 audit: `docs/audits/sprint-u-cycle1-iter1-CONSOLIDATED-audit.md`

---

**Status**: PROPOSED iter 31 ralph iter 7. Andrea optional review — orchestrator continua autonomous Phase 1 (palette migration) iter 8 spawn next.
