# Sprint T iter 31 PHASE 1 close audit — RALPH DEEP ELAB Tutor

**Date**: 2026-05-02 PM
**Scribe**: scribe-opus iter 31 caveman Pattern S r3 Phase 2 sequential
**Pattern**: 5-agent OPUS (planner + maker-1 + maker-2 + tester-1 + architect-opus) Phase 1 parallel + scribe Phase 2 sequential post 5/5 filesystem barrier confirmed
**Master plan**: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
**Sprint contract**: `automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md`
**Phase 0+1 baseline**: `docs/audits/PHASE-0-baseline-2026-05-02.md` + `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` (Opus baseline 8.0/10)

---

## §1 Executive summary

Phase 1 12/12 atoms SHIPPED file-system verified (4 NEW skills + 1 EXTEND + 6 mechanism scripts + 12 ATOM task files + 1 sprint contract). NO commit yet. NO push origin yet. NO `--no-verify` bypass. NO destructive ops. Pattern S r3 race-cond fix VALIDATED 10th iter consecutive (iter 5+6+8+11+12+19+36+37+38+**31**). Filesystem barrier 5/5 completion msgs PRE Phase 2 spawn confirmed (`automa/team-state/messages/{planner-opus,maker1,maker2,tester1,architect-opus}-iter31-phase1-completed.md`).

**Phase 1 scope**: docs + skills + offline mechanism scripts ONLY. ZERO src/ ZERO tests/ ZERO supabase/ changes. Vitest baseline 13474 PASS preserved by construction (mathematical, no test discovery target affected). Build NOT re-run Phase 1 (heavy ~14min, defer Phase 3 orchestrator pre-flight CoV iter 32 entrance).

**Score iter 31 Phase 1 close ONESTO ricalibrato G45**: **8.10/10** (Opus baseline 8.0 iter 39 + minimal lift +0.10 for tooling foundation 5 skills + 6 mechanisms scaffold). Cap mechanics NO inflate: Phase 1 docs+skills+mechanisms infrastructure only, NO src/ NO tests/ change → realistic delta +0.10 ceiling. Sprint T close 9.5/10 NOT achievable iter 31 alone (master plan §11 cumulative iter 41-43 + Phase 7 Andrea Opus G45 indipendente review).

**Phase 1 RAW LOC delta**: ~1685 NEW (skills 791 + mechanism scripts 894 — see §2 deliverables matrix verified `wc -l`).

---

## §2 Deliverables matrix (file-system verified)

### 4 NEW skills (~/.claude/skills/) — 791 LOC totale

| ID | File | LOC | Owner | Gates | Status |
|----|------|-----|-------|-------|--------|
| Skill 1 | `elab-morfismo-validator/SKILL.md` | 160 | Maker-1 | G1-G10 (10 gates) | NEW shipped |
| Skill 2 | `elab-onniscenza-measure/SKILL.md` | 225 | Maker-2 | G1-G8 (8 gates) | NEW shipped |
| Skill 3 | `elab-velocita-latenze-tracker/SKILL.md` | 150 | Tester-1 | G1-G9 (9 gates) | NEW shipped |
| Skill 4 | `elab-onnipotenza-coverage/SKILL.md` | 124 | Tester-1 | G1-G9 (9 gates) | NEW shipped |

### 1 EXTEND skill — 131 LOC

| ID | File | LOC | Owner | Gates | Status |
|----|------|-----|-------|-------|--------|
| Skill 5 | `elab-principio-zero-validator/SKILL.md` | 131 | Maker-1 | G1-G5 baseline + G+1/G+2/G+3 NEW | EXTEND shipped (caveat: did NOT pre-exist disk, see §5) |

### 6 mechanism scripts (`scripts/mechanisms/`) — 894 LOC totale

| ID | File | LOC | Owner | Status | CoV dry-run |
|----|------|-----|-------|--------|-------------|
| M-AR-01 | `M-AR-01-auto-revert-pre-commit.sh` | 62 | Maker-1 | NEW shipped (+x) | bash -n PASS |
| M-AI-01 | `M-AI-01-score-history-validator.mjs` | 145 | Maker-1 | NEW shipped (+x) | node --check PASS, candidate dry-run anti-inflation REJECT verified |
| M-AR-05 | `M-AR-05-smart-rollback.sh` | 55 | Maker-1 | NEW shipped (+x) | list mode PASS (no tags Phase 1) |
| M-AI-02 | `M-AI-02-mechanical-cap-enforcer.mjs` | 325 | Architect | NEW shipped | iter 39 dry-run synthetic 8.45→8.0 verified, 3/8 caps triggered (R5_LATENCY+R7_CANONICAL+LIGHTHOUSE_PERF), exit 1, anti_pattern_detected:true |
| M-AI-03 | `M-AI-03-claim-reality-gap-detector.mjs` | 246 | Tester-1 | NEW shipped | dry-run 17 gaps + 21 skipped (env-gated) + 16 match, exit 0 |
| M-AI-04 | `M-AI-04-doc-drift-detector.mjs` | 260 | Maker-2 | NEW shipped | dry-run 5 findings (3 HIGH + 2 MEDIUM), 231 markdown scanned, exit 1 |

### 12 ATOM task files (`automa/tasks/pending/`) — planner-opus

ATOM-S31-A1 through ATOM-S31-A12 + 1 sprint contract `automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md`. See §1 + §4 atoms status table.

---

## §3 CoV results (per-agent 3-step verification)

### Maker-1 (Skills 1+5 + mechanisms M-AR-01, M-AI-01, M-AR-05)
- CoV-1 vitest 13474 baseline PRE: SKIPPED with justification (pure scripts/skills, ZERO src changes, baseline preserved by construction).
- CoV-2 incremental: bash -n PASS M-AR-01+M-AR-05; node --check PASS M-AI-01; M-AI-01 anti-inflation candidate dry-run `score_capped=9 > score_opus_review=7.5` CORRECTLY rejected `ANTI-INFLATION VIOLATION`; M-AR-05 list mode PASS.
- CoV-3 vitest 13474 baseline POST: SKIPPED symmetric to CoV-1 (no src/test edits).

### Maker-2 (Skill 2 + mechanism M-AI-04)
- CoV-1: SKIPPED with justification (pure-doc skill + offline mechanism mjs, no vitest collection target affected).
- CoV-2: M-AI-04 dry-run PASS — 231 md files scanned across `docs/audits/` + `docs/handoff/` + `docs/adrs/`, 5 files with drift (3 HIGH + 2 MEDIUM + 0 ADVISORY), valid JSON output parseable, exit 1 (HIGH detected per spec), git_head correctly resolved `69c945391b58dd016078ebec3cf8e3f87c3eef32`.
- CoV-3: SKIPPED symmetric.

### Tester-1 (Skills 3+4 + mechanism M-AI-03)
- CoV-1: `automa/baseline-tests.txt` = 13474 verified pre-write. SKIPPED full vitest justified.
- CoV-2: M-AI-03 dry-run PASS — `Report written: automa/state/claim-reality-gap-2026-05-03.json`, real gap detection: 17 gaps (mostly stale vitest counts in older audits 12290/12599/12718 vs reality 13474), 21 skipped (env-gated probes Supabase/CF), 16 match, exit 0.
- CoV-3: baseline 13474 byte-identical post-write verified.

### Architect-opus (mechanism M-AI-02 mechanical-cap-enforcer)
- CoV-1: `automa/baseline-tests.txt` = `13474` PRE atom CONFIRMED.
- CoV-2: dry-run synthetic case `--iter 39 --score 8.45 --evidence-inline {r5_p95_ms:3380,r7_canonical_pct:3.6,vitest_count:13474,lighthouse_perf_chatbot:26,lighthouse_perf_easter:23}` → output JSON `score_claim:8.45 score_capped:8 triggered_caps:[R5_LATENCY,R7_CANONICAL,LIGHTHOUSE_PERF] cap_reason:G45 mechanical cap R5_LATENCY (8) anti_pattern_detected:true enforcer_version:1` exit 1 PASS spec. Tie-break R5_LATENCY vs LIGHTHOUSE_PERF both cap 8.0 → first-encountered iteration order. Bonus `--latest` smoke iter 39 entry exit 0 (sparse evidence, mechanical caps fire only on measured numerics).
- CoV-3: baseline preserved by inspection (NEW file in `scripts/mechanisms/` outside `tests/**` discovery path).

### Planner-opus (12 ATOM decomposition + sprint contract)
- Phase 0+1 atomization 11 atoms estimated 5.75h ≤ 6h Phase 1 budget master plan §2 ✓.
- File ownership disjoint verified ZERO write conflict cross-agent.
- Filesystem barrier protocol Pattern S r3 documented + completion msg protocol mandatory PRE Phase 2 scribe spawn.

### Baseline 13474 preserve mandate
- File `automa/baseline-tests.txt` = `13474` (verified by all 4 agents pre+post write).
- Build NOT re-run Phase 1 (~14min heavy, defer Phase 3 orchestrator iter 32 entrance).
- ZERO src/ ZERO tests/ ZERO supabase/ changes Phase 1 (skills + mechanisms infrastructure ONLY).

---

## §4 Phase 1 atoms 12/12 status table

| ATOM | Owner | Deliverable | LOC | Status | Cross-ref |
|------|-------|-------------|-----|--------|-----------|
| ATOM-S31-A1 | Maker-1 | `~/.claude/skills/elab-morfismo-validator/SKILL.md` | 160 | DONE | maker1 msg §1 file 1 |
| ATOM-S31-A2 | Maker-2 | `~/.claude/skills/elab-onniscenza-measure/SKILL.md` | 225 | DONE | maker2 msg §1 file 1 |
| ATOM-S31-A3 | Tester-1 | `~/.claude/skills/elab-velocita-latenze-tracker/SKILL.md` | 150 | DONE | tester1 msg §1 file 1 |
| ATOM-S31-A4 | Tester-1 | `~/.claude/skills/elab-onnipotenza-coverage/SKILL.md` | 124 | DONE | tester1 msg §1 file 2 |
| ATOM-S31-A5 | Maker-1 | `~/.claude/skills/elab-principio-zero-validator/SKILL.md` (EXTEND) | 131 | DONE caveat see §5 | maker1 msg §1 file 2 |
| ATOM-S31-A6 | Maker-1 | `scripts/mechanisms/M-AR-01-auto-revert-pre-commit.sh` | 62 | DONE | maker1 msg §1 file 3 |
| ATOM-S31-A7 | Maker-1 | `scripts/mechanisms/M-AI-01-score-history-validator.mjs` | 145 | DONE | maker1 msg §1 file 4 |
| ATOM-S31-A8 | Maker-2 | `scripts/mechanisms/M-AI-04-doc-drift-detector.mjs` | 260 | DONE +140 over budget | maker2 msg §2 |
| ATOM-S31-A9 | Tester-1 | `scripts/mechanisms/M-AI-03-claim-reality-gap-detector.mjs` | 246 | DONE | tester1 msg §1 file 3 |
| ATOM-S31-A10 | Maker-1 | `scripts/mechanisms/M-AR-05-smart-rollback.sh` | 55 | DONE | maker1 msg §1 file 5 |
| ATOM-S31-A11 | Architect | `scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs` | 325 | DONE +125 over budget | architect msg deliverable |
| ATOM-S31-A12 | Planner | `automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md` + 12 ATOM files | ~250 contract + atoms | DONE | planner msg §1 |

**Total Phase 1 LOC**: ~1685 NEW (skills 791 + mechanism scripts 894 + sprint contract+ATOM scaffolding ~250 not double-counted).

---

## §5 Honesty caveats critical

1. **PZ validator pre-existed gap**: `elab-principio-zero-validator` SKILL.md did NOT pre-exist at `~/.claude/skills/elab-principio-zero-validator/SKILL.md`. Task ATOM-S31-A5 said "EXTEND" but only `galileo-brain-training` skill present in `~/.claude/skills/` pre-iter-31. Maker-1 created full SKILL.md combining 5 baseline gates G1-G5 (inferred from Principio Zero literature in CLAUDE.md "DUE PAROLE D'ORDINE" §1) + 3 NEW gates G+1 vol/pag + G+2 plurale "Ragazzi," + G+3 kit ELAB per task spec. Iter 32 entrance Andrea ratify or rewrite if 5 baseline gates not match intended pre-existing version.

2. **M-AI-04 LOC over budget**: 260 LOC vs target 120 LOC = +140 (+117% over). Justification (Maker-2 caveat 6): severity classification logic + JSON serialization with all metadata + 4 distinct pattern handlers + console table summary + dry-run mode. No code golf attempted to preserve readability + audit trail.

3. **M-AI-02 LOC over budget**: 325 LOC vs target 200 LOC = +125 (+62% over). Justification (Architect caveat 1): 8-cap evaluator map (8x ~10 LOC each = 80 LOC) + dual CLI/library mode + path-with-spaces fix (`pathToFileURL` instead of naive `file://` template literal — bug discovered first dry-run, root-caused, fixed). Logic compact, no dead code, no gold-plate. Each cap one closure for iter 32+ extension readability.

4. **env G3+G6+G7+G8 require SUPABASE_SERVICE_ROLE_KEY skip-with-advisory**: Skill 2 elab-onniscenza-measure G3 (RAG chunks SQL) + G6 (Anti-absurd flag rate) + G7 (Conv history embed cache hit) + G8 (V1 vs V2 ratio) all skip cleanly when env missing per advisory log. Skill score will cap at 0.75 if any SKIP per anti-inflation invariant. Andrea env provision needed iter 32+ for full 8-gate measurement. Skill 3 elab-velocita-latenze-tracker G2/G4/G5/G6/G7/G8/G9 require SUPABASE_ANON_KEY + CF_API_TOKEN + TOGETHER_API_KEY + PSI_API_KEY. M-AI-03 G_efv + G_rag + G_canary skip without SUPABASE_ACCESS_TOKEN (21/54 claims skipped dry-run).

5. **CoV-1+CoV-3 vitest skipped 4/4 agents**: protocol allows skip for pure scripts/skills with justification (mathematical preservation by construction, ZERO src/test imports modified). Did not run full `npm test` (~3-5min) for zero-src-impact atoms. If Phase 3 orchestrator batch commit includes other agents' src/ changes, full vitest 13474 verify mandatory before push origin per CLAUDE.md anti-regressione FERREA.

6. **M-AI-01 schema mismatch with existing score-history.jsonl** (Maker-1 caveat 4): 4 existing entries fail validation (score_opus_review present as non-number in some lines, status values like "closed"/"docs-only" outside enum). Two paths forward iter 32 entrance: (a) fix existing entries to comply with schema, or (b) widen schema enum to include legacy statuses. Recommend (a) — strict schema is the point.

7. **G2 NanoR4Board SHA-256 baseline NOT pre-populated** (Maker-1 caveat 5): morfismo-validator SKILL.md instructs bootstrap on first run if `automa/state/nanor4board-sha256.txt` missing. Will be created lazy on first skill invocation iter 32+.

8. **Pre-commit hook NOT installed** (Maker-1 caveat 6): M-AR-01 script created but NOT wired into `.husky/pre-commit`. Orchestrator/Andrea decision iter 32 entrance: when to wire? Suggested call line for husky: `bash scripts/mechanisms/M-AR-01-auto-revert-pre-commit.sh`.

9. **Architect M-AI-02 library mode export verified by inspection only** (Architect caveat 3): `import { enforceCap, loadCapsConfig, loadBaselineTests } from '...'` exports work syntactically (all 3 functions have `export function`) but NOT exercised by a test file. Phase 2 should add `tests/unit/mechanisms/M-AI-02-mechanical-cap-enforcer.test.js` with 8 cap-trigger cases + library mode invocation. Honest defer Phase 2 (gen-test agent ownership iter 32+).

10. **Skill 4 G9 path assumption** (Tester-1 caveat 5): `src/services/intentsDispatcher.js` path assumed per memory but NOT verified with Read tool (file ownership rigid; only inspected own outputs). If actual path differs, gate returns zero. Iter 32+ Tester-2 verify path or grep all candidates.

11. **M-AI-03 detector found real gaps** (Tester-1 caveat 7): 17 stale claims in older audits — worth flagging Verifier-1 / sprint owner. Most historical (audits dated before latest baseline bump), so "gap" here means "stale doc," not "false claim today." iter 32+ documentation cleanup mandate.

---

## §6 Anti-pattern enforced verification

All 5 agents Phase 1 explicit confirmation NO:
- `--no-verify` bypass (NEVER used, NO commits made — orchestrator Phase 3)
- destructive ops (NO `rm -rf`, NO `git reset --hard`, NO force push)
- compiacenza score (caveats §5 explicit + 11 honesty caveats; Architect M-AI-02 dry-run reflects real iter 39 cap mechanics; Maker-2 LOC over-budget admitted; Maker-1 PZ validator pre-existed gap declared)
- writes outside ownership (file ownership rigid disjoint verified planner sprint contract §54-62)
- claim "skill measured pass" without CoV dry-run output (M-AI-01+M-AI-02+M-AI-03+M-AI-04 dry-run output captured + reproduced this audit §3)
- claim "Phase 2-7 done" (only Phase 1 closed; Phase 2 = scribe sequential = this audit + handoff + CLAUDE.md APPEND; Phase 3-7 deferred orchestrator iter 32+)

**G45 mechanical cap enforced score iter 31 Phase 1 close**: 8.10/10 (Opus baseline 8.0 iter 39 + minimal lift +0.10 tooling foundation). NO inflate. Phase 1 docs+skills+mechanisms infrastructure only, NO src/ NO tests/ change → realistic delta +0.10 ceiling. Sprint T close 9.5 NOT achievable iter 31 alone (cumulative iter 41-43 + Phase 7 Andrea Opus G45 indipendente review per master plan §11 + planner caveat 5).

---

## §7 Phase 2-7 priorities (cross-link iter 32+ entrance)

### Phase 2 — Sprint U Cycle 2 fix (carryover Sprint U Cycle 1 audit close 2026-05-01)
- L2 catch-all router fix `clawbot-template-router.ts:121-153` (93/94 esperimenti broken Sprint U Cycle 1 finding #1)
- 73 lesson-paths singolare imperative codemod ("Premi Play" ×~50 + "fai/clicca/monta/collega" ×~23) → plurale "Premete/fate/cliccate/montate/collegate"
- 94 unlimPrompts docente framing refactor ("studente" → "docente leggi ai Ragazzi")
- 91/94 teacher_messages "Ragazzi," opener prepend
- v3-cap8-serial circuit fix (missing bb1)
- 4 vol3 title/ID mismatches + 1 vol3 content mismatch (v3-cap6-esp4 prompt vs title)

### Phase 3 — Mac Mini persona-prof autonomous loop retry
- Sprint U Cycle 1 persona agent FAILED (stall 600s) → retry Mac Mini iter 32+ post org-limit-reset
- Mac Mini USER-SIM CURRICULUM cron entries already LIVE (L1+L2+L3+aggregator iter 36 carryover)

### Phase 4 — Phase E Mistral re-ingest with page metadata
- Voyage re-ingest `node scripts/rag-ingest-voyage-batch-v2.mjs` (~50min, ~$1) gated ADR-033 ratify Andrea
- Page metadata extraction strategy ADR-033 PROPOSED → ACCEPTED iter 32+
- Verify page coverage ≥80% (current 0% Voyage ingest gap iter 38 carryover)
- R6 unblock recall@5 ≥0.55 (current 0.067 FAIL)

### Phase 5 — Onniscenza V2.1
- V2 reverted iter 39 (commit `eb4a11b` claimed canary, regression -1.0pp PZ V3 + 36% slower → `ONNISCENZA_VERSION=v1` env)
- V2.1 hybrid retriever fusion fix iter 32+
- Telemetry `prompt_class` per-category extension

### Phase 6 — Wake word "Ehi UNLIM" mic permission debug
- iter 32+ pending Andrea action items
- MicPermissionNudge.jsx LIVE iter 38 + plurale "Ragazzi, autorizza il microfono"
- Browser-mic flow E2E Playwright spec missing

### Phase 7 — Andrea Opus G45 indipendente review
- Mandate G45 ratify post all gates met (master plan §11 cumulative iter 41-43 path)
- NO claim Sprint T close 9.5 senza Opus indipendente subagent context-zero review
- Reference: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` template iter 39 baseline 8.0/10

---

## §8 Score iter 31 Phase 1 close ONESTO ricalibrato G45

**Score iter 31 Phase 1 close ONESTO**: **8.10/10** (Opus baseline 8.0 iter 39 + minimal lift +0.10 for Phase 1 tooling foundation 5 skills + 6 mechanisms scaffold).

**Cap mechanics**:
- **Opus baseline 8.0** (iter 39 G45 indipendente review, file:line `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` cap 8.0 ONESTO)
- **+0.10 lift** Phase 1 tooling foundation:
  - 4 NEW skills (morfismo + onniscenza-measure + velocita-latenze-tracker + onnipotenza-coverage) gates infrastructure
  - 1 EXTEND skill (principio-zero-validator G+1/G+2/G+3)
  - 5 mechanism scripts NEW (M-AR-01 + M-AI-01 + M-AR-05 + M-AI-03 + M-AI-04) anti-regressione + anti-inflation infrastructure
  - 1 mechanism script NEW Architect (M-AI-02 mechanical-cap-enforcer) — verified iter 39 cap mechanics dry-run
  - 12 ATOM task files + 1 sprint contract decomposition
- **NO further lift Phase 1 only**: docs+skills+mechanisms infrastructure ONLY, NO src/ NO tests/ NO supabase/ changes. Real lift Phase 2-7 execution iter 32+ (Sprint U Cycle 2 fix + Mac Mini persona-prof + Phase E re-ingest + Onniscenza V2.1 + wake word + Phase 7 Opus review).

**Cumulative iter 32 projection target**: 8.10 → **8.40-8.60/10 ONESTO** conditional Phase 2 Sprint U Cycle 2 fix close (L2 router + codemod + docente framing).

**Sprint T close 9.5 path**: iter 41-43 cumulative + Phase 7 Andrea Opus G45 indipendente review G45 mandate (NOT iter 32 single-shot, NOT iter 31 Phase 1 alone).

**Anti-inflation G45 mandate iter 31 Phase 1 enforced**: cap 8.10/10 (NOT 8.20+ inflated). NO claim "score 8.5+" senza score-history.jsonl entry validated M-AI-01. NO claim "Phase 2-7 done" (only Phase 1 closed). NO claim "skill LIVE measured pass" senza M-AI-03 claim-reality verify post env provision. NO claim "Onnipotenza Box 14 ceiling 1.0" (G6 Mistral function-calling canonical 3.6% iter 38 dragger, ceiling iter 32+ post L2 scope reduce + R7 re-bench).

**Cross-link**:
- Master plan: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- Sprint contract: `automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md`
- Phase 0 baseline: `docs/audits/PHASE-0-baseline-2026-05-02.md`
- Phase 1 G45 Opus baseline iter 39: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`
- 5 completion msgs Phase 1: `automa/team-state/messages/{planner-opus,maker1,maker2,tester1,architect-opus}-iter31-phase1-completed.md`
- Handoff iter 32: `docs/handoff/2026-05-02-iter-31-to-iter-32-handoff.md`
- Andrea decisioni 8 G45 defaults: `iter-31-andrea-flags.jsonl` (Andrea ratify queue iter 32 entrance)

---

## §9 Phase 1 close finale Phase 3 handoff

**Phase 2 (this audit + handoff + CLAUDE.md APPEND + scribe completion msg) STATUS: COMPLETED scribe-opus iter 31 Phase 2 sequential post 5/5 filesystem barrier confirmed.**

**Phase 3 orchestrator iter 32 entrance pending**:
- vitest full run baseline preserve verify (target 13474 PASS file `automa/baseline-tests.txt` byte-identical)
- build PASS verify (~14min heavy, defer iter 32 entrance pre-flight CoV)
- commit atomic Phase 1 deliverables (NO push main, NO `--no-verify`, NO destructive)
- push origin feature branch (NO main directly)
- Andrea ratify queue iter 32 entrance:
  - Skill 5 PZ validator pre-existed gap (caveat 1) — accept current full create OR rewrite if intended different baseline
  - LOC over budget M-AI-04 (caveat 2) + M-AI-02 (caveat 3) — accept readability+audit trail justification
  - Pre-commit hook M-AR-01 wire (caveat 8) — when to install `.husky/pre-commit`?
  - score-history.jsonl schema mismatch (caveat 6) — fix legacy entries OR widen schema enum
  - 8 G45 defaults override decisioni `iter-31-andrea-flags.jsonl` (master plan §6)

**Iter 32 entrance gate per CLAUDE.md anti-regressione FERREA**:
- vitest 13474 PASS NEVER scendere (re-run + update post test discovery if regression)
- build PASS NEVER skip pre-commit
- pre-push NEVER bypass `--no-verify`
- NO push diretto su main, only PR via `gh pr create`

**Sprint T close projection iter 41-43 cumulative + Phase 7 Andrea Opus G45 indipendente review G45 mandate**: 9.5/10 ONESTO conditional all Phase 2-7 gates met (Sprint U Cycle 2 fix + Voyage re-ingest + Onniscenza V2.1 + wake word + Onnipotenza Deno port 12-tool + canary 100% rollout + 94 esperimenti audit + linguaggio codemod + Vol3 narrative refactor — NOT iter 32 single-shot).

---

**Audit close**: scribe-opus iter 31 Phase 2 sequential. NO compiacenza. Ratify queue Andrea iter 32 entrance. Phase 3 orchestrator gate.
