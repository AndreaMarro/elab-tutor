# Handoff iter 31 → iter 32 — Sprint T close path RALPH DEEP ELAB Tutor

**Date**: 2026-05-02 PM
**Scribe**: scribe-opus iter 31 Phase 2 sequential
**Audit close**: `docs/audits/2026-05-02-iter-31-PHASE1-CLOSE-audit.md`
**Score iter 31 Phase 1 close ONESTO**: 8.10/10 (Opus baseline 8.0 iter 39 + lift +0.10 tooling foundation)
**Iter 32 score target**: 8.40-8.60/10 ONESTO (conditional Phase 2 Sprint U Cycle 2 fix close)

---

## §1 ACTIVATION STRING paste-ready iter 32 entrance

```
You are iter 32 RALPH DEEP ELAB Tutor Sprint T close. Caveman mode (terse, drop articles/filler/pleasantries, fragments OK, technical terms exact, code/commits NORMAL).

CONTEXT: Working dir `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder`. Iter 31 Phase 1 12/12 atoms SHIPPED close `docs/audits/2026-05-02-iter-31-PHASE1-CLOSE-audit.md` (5 skills + 6 mechanism scripts + 12 ATOM tasks + sprint contract). Score iter 31 Phase 1 close ONESTO 8.10/10 G45 cap (Opus baseline 8.0 iter 39 + lift +0.10 tooling foundation). Pattern S r3 race-cond fix VALIDATED 10th iter consecutive. NO commit yet, NO push origin yet.

PRE-FLIGHT CoV iter 32 entrance MANDATORY:
1. vitest 13474 PASS file `automa/baseline-tests.txt` byte-identical (~3-5min `npx vitest run`)
2. build PASS (~14min heavy `npm run build`)
3. Verify Phase 1 deliverables 5 skills + 6 mechanisms file-system present (audit §2 deliverables matrix)
4. Verify 5 completion msgs file-system present `automa/team-state/messages/{planner-opus,maker1,maker2,tester1,architect-opus}-iter31-phase1-completed.md`

ANDREA SETUP STEPS iter 32 entrance ~10 min:
1. Review Phase 1 audit §5 honesty caveats (11 caveats critical)
2. Override 8 G45 defaults `iter-31-andrea-flags.jsonl` se applicabile (master plan §6 decisioni matrix)
3. Env keys check: SUPABASE_SERVICE_ROLE_KEY + VOYAGE_API_KEY + CF_API_TOKEN + TOGETHER_API_KEY + PSI_API_KEY + ELAB_API_KEY (skill 2 G3+G6+G7+G8 + skill 3 G2-G9 + M-AI-03 G_efv+G_rag+G_canary need env)
4. Decisione caveat 1 PZ validator pre-existed gap: accept Maker-1 full create OR rewrite
5. Decisione caveat 6 score-history.jsonl schema: fix legacy 4 entries OR widen schema enum
6. Decisione caveat 8 pre-commit hook M-AR-01 wire `.husky/pre-commit`

PHASE 2-7 PRIORITIES ROI ORDERED iter 32 entrance:
- Phase 2 (P0): Sprint U Cycle 2 fix L2 router catch-all `clawbot-template-router.ts:121-153` (93/94 esperimenti broken) + 73 lesson-paths singolare imperative codemod + 94 unlimPrompts docente framing + 91/94 teacher_messages "Ragazzi," opener prepend + v3-cap8-serial bb1 fix + 5 vol3 mismatches
- Phase 3 (P0): Mac Mini persona-prof autonomous loop retry (Sprint U Cycle 1 stall 600s)
- Phase 4 (P0): Phase E Voyage re-ingest with page metadata gated ADR-033 ratify Andrea (~50min ~$1, R6 unblock recall@5 ≥0.55 current 0.067)
- Phase 5 (P1): Onniscenza V2.1 hybrid retriever fusion fix (V2 reverted iter 39 -1.0pp PZ V3 + 36% slower)
- Phase 6 (P1): Wake word "Ehi UNLIM" mic permission browser-flow E2E Playwright spec
- Phase 7 (P0 Sprint T close gate): Andrea Opus G45 indipendente review G45 mandate (NOT iter 32 single-shot)

PATTERN S R3 PHASE-PHASE iter 32+:
- Phase 1 4-6 agents OPUS parallel (file ownership rigid disjoint)
- Phase 1 each agent CoV 3-step + emit completion msg `automa/team-state/messages/{agent}-iter32-phase1-completed.md`
- Phase 2 scribe sequential AFTER 4-6/4-6 filesystem barrier completion msgs (NO race-cond)
- Phase 3 orchestrator post Phase 2: vitest + build + commit + push origin (NO push main, NO `--no-verify`)

ANTI-PATTERN ENFORCED iter 32+:
- NO emoji
- NO claim "score X" senza score-history.jsonl entry validated M-AI-01
- NO claim "LIVE" senza claim-reality verify M-AI-03
- NO inflate score: G45 mechanical cap M-AI-02 verify per atom
- NO claim Phase 2-7 done senza file-system verify
- NO write outside file ownership rigid disjoint sprint contract
- NO --no-verify bypass
- NO destructive ops (no `rm -rf`, no `git reset --hard`, no force push)
- Pattern S filesystem barrier mandatory PRE Phase 2 spawn
- scribe Phase 2 sequential mandatory POST 4-6/4-6 completion msgs

Score iter 32 target: 8.10 → 8.40-8.60/10 ONESTO conditional Phase 2 Sprint U Cycle 2 fix close.
Sprint T close projection iter 41-43 cumulative + Phase 7 Andrea Opus G45 indipendente review G45 mandate (9.5/10 ONESTO).

CAVEMAN MODE: drop articles, fragments OK, technical terms exact, anti-pattern enforced, NO compiacenza, NO inflate, NO claim done senza file:line verify.
```

---

## §2 Setup steps Andrea iter 32 entrance ~10 min

### 1. G45 defaults review iter-31-andrea-flags.jsonl + override 8 decisioni se applicabile
Master plan §6 decisioni matrix Andrea (8 default G45 cap):
- D1 score iter 31 Phase 1 close cap mechanism: 8.10 default vs ratify higher/lower
- D2 PZ validator pre-existed gap (audit caveat 1): accept full create vs rewrite
- D3 LOC over budget M-AI-04 +140 (audit caveat 2): accept vs split into 2 modules
- D4 LOC over budget M-AI-02 +125 (audit caveat 3): accept vs split into 2 modules
- D5 score-history.jsonl schema mismatch (audit caveat 6): fix legacy entries vs widen schema enum
- D6 pre-commit hook M-AR-01 wire (audit caveat 8): wire now vs defer iter 33+
- D7 G2 NanoR4Board SHA-256 baseline bootstrap (audit caveat 7): accept lazy first-run vs pre-populate iter 32 entrance
- D8 M-AI-03 stale claims cleanup (audit caveat 11): start iter 32 cleanup mandate vs defer

### 2. Env keys check (audit caveat 4)
- SUPABASE_SERVICE_ROLE_KEY (skill 2 G3+G6+G7+G8 + M-AI-03 probes)
- VOYAGE_API_KEY (Phase 4 re-ingest)
- CF_API_TOKEN (skill 3 G4 STT)
- TOGETHER_API_KEY (skill 3 G6+G7)
- PSI_API_KEY (skill 3 G8+G9 Lighthouse PageSpeed)
- ELAB_API_KEY (R5+R6+R7 bench)
- SUPABASE_ACCESS_TOKEN (Edge Function deploy + M-AI-03 reality probes)

### 3. Pre-flight CoV iter 32 entrance
```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
npx vitest run 2>&1 | tail -5  # target 13474 PASS
cat automa/baseline-tests.txt   # = 13474 byte-identical
npm run build                    # ~14min heavy PASS verify
git status                       # working tree state
ls automa/team-state/messages/*iter31-phase1-completed.md  # 5 msgs verify
```

### 4. Phase 3 orchestrator commit + push origin (post Andrea ratify)
```bash
git add ~/.claude/skills/elab-{morfismo,onniscenza-measure,velocita-latenze-tracker,onnipotenza-coverage,principio-zero}-validator/SKILL.md  # NOTE: ~/.claude/skills outside repo, separate consideration
git add scripts/mechanisms/M-{AR-01,AI-01,AR-05,AI-02,AI-03,AI-04}*
git add automa/tasks/pending/ATOM-S31-A*.md
git add automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md
git add automa/team-state/messages/*iter31-phase1-completed.md
git add docs/audits/2026-05-02-iter-31-PHASE1-CLOSE-audit.md
git add docs/handoff/2026-05-02-iter-31-to-iter-32-handoff.md
git add CLAUDE.md
git commit -m "feat(iter-31): Phase 1 close 12/12 atoms — 5 skills + 6 mechanisms tooling foundation

Score iter 31 Phase 1 close ONESTO 8.10/10 G45 cap (Opus baseline 8.0 iter 39 + lift +0.10).
Pattern S r3 race-cond fix VALIDATED 10th iter consecutive (filesystem barrier 5/5 msgs).
NO src/ NO tests/ NO supabase/ changes Phase 1. Vitest 13474 PASS preserved.

11 honesty caveats §5 audit: PZ validator pre-existed gap, M-AI-04+M-AI-02 LOC over budget,
env G3+G6+G7+G8+G2-G9 require key provision Andrea iter 32+ skip-with-advisory.

Phase 2-7 priorities iter 32+ entrance: Sprint U Cycle 2 fix + Mac Mini persona-prof retry +
Phase E Voyage re-ingest + Onniscenza V2.1 + wake word + Phase 7 Andrea Opus G45 indipendente
review (Sprint T close 9.5 cumulative iter 41-43 path NOT iter 32 single-shot)."
git push origin <feature-branch>  # NO push main, NO --no-verify
```

---

## §3 Phase 2-7 priorities ordered ROI

### Phase 2 (P0 ROI HIGH) — Sprint U Cycle 2 fix carryover
**Cross-link**: Sprint U Cycle 1 audit close 2026-05-01 `docs/audits/sprint-u-cycle1-iter1-CONSOLIDATED-audit.md` + handoff `docs/handoff/sprint-u-cycle2-iter1-handoff.md`
- L2 catch-all router fix `clawbot-template-router.ts:121-153` (93/94 esperimenti broken Sprint U Cycle 1 finding #1, Morfismo Sense 2 broken)
- 73 lesson-paths singolare imperative codemod ("Premi Play" ×~50 + "fai/clicca/monta/collega" ×~23) → plurale "Premete/fate/cliccate/montate/collegate" PRINCIPIO ZERO §1
- 94 unlimPrompts docente framing refactor ("studente" → "docente leggi ai Ragazzi") PRINCIPIO ZERO §1
- 91/94 teacher_messages "Ragazzi," opener prepend
- v3-cap8-serial circuit fix (missing bb1)
- 4 vol3 title/ID mismatches + 1 vol3 content mismatch (v3-cap6-esp4 prompt vs title)

### Phase 3 (P0 Mac Mini autonomous) — persona-prof retry
- Sprint U Cycle 1 persona agent FAILED stall 600s
- Mac Mini USER-SIM CURRICULUM cron entries already LIVE (iter 36 carryover L1+L2+L3+aggregator)
- iter 32+ Mac Mini retry post org-limit-reset session

### Phase 4 (P0 Voyage re-ingest) — Phase E Mistral page metadata
- ADR-033 page metadata extraction strategy ratify Andrea
- `node scripts/rag-ingest-voyage-batch-v2.mjs` (~50min, ~$1)
- Verify page coverage ≥80% (current 0% Voyage ingest gap iter 38 carryover)
- R6 unblock recall@5 ≥0.55 (current 0.067 FAIL)

### Phase 5 (P1) — Onniscenza V2.1 fusion fix
- V2 reverted iter 39 (`ONNISCENZA_VERSION=v1` env active prod)
- Hybrid retriever BM25+dense+RRF k=60 fusion bug iter 39 regression
- Telemetry `prompt_class` per-category extension iter 36 classifier 6 categorie

### Phase 6 (P1) — Wake word browser-flow E2E
- "Ehi UNLIM" mic permission iter 32+ pending
- MicPermissionNudge.jsx LIVE iter 38 + plurale "Ragazzi, autorizza il microfono"
- Browser-mic flow E2E Playwright spec missing

### Phase 7 (P0 Sprint T close gate) — Andrea Opus G45 indipendente review
- Mandate G45 ratify post all gates met (master plan §11 cumulative iter 41-43 path)
- NO claim Sprint T close 9.5 senza Opus indipendente subagent context-zero review
- Reference template iter 39 baseline 8.0/10: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`

---

## §4 Phase 1 deliverables file paths reference

### 4 NEW skills (~/.claude/skills/)
- `~/.claude/skills/elab-morfismo-validator/SKILL.md` 160 LOC — Maker-1 G1-G10 morfismo validation
- `~/.claude/skills/elab-onniscenza-measure/SKILL.md` 225 LOC — Maker-2 G1-G8 onniscenza 7-layer measurement
- `~/.claude/skills/elab-velocita-latenze-tracker/SKILL.md` 150 LOC — Tester-1 G1-G9 latency tracker p50/p95
- `~/.claude/skills/elab-onnipotenza-coverage/SKILL.md` 124 LOC — Tester-1 G1-G9 onnipotenza L0-L3 coverage

### 1 EXTEND skill
- `~/.claude/skills/elab-principio-zero-validator/SKILL.md` 131 LOC — Maker-1 G1-G5 baseline + G+1/G+2/G+3 NEW (caveat full create disk pre-existed gap)

### 6 mechanism scripts (`scripts/mechanisms/`)
- `M-AR-01-auto-revert-pre-commit.sh` 62 LOC — Maker-1 (+x) bash auto-revert pre-commit hook (NOT wired husky yet caveat 8)
- `M-AI-01-score-history-validator.mjs` 145 LOC — Maker-1 (+x) score history JSONL registry strict schema + anti-inflation invariant
- `M-AR-05-smart-rollback.sh` 55 LOC — Maker-1 (+x) bash smart rollback by tag (no tags Phase 1)
- `M-AI-02-mechanical-cap-enforcer.mjs` 325 LOC — Architect (+x) 8-cap evaluator map dual CLI/library mode + iter 39 dry-run verified
- `M-AI-03-claim-reality-gap-detector.mjs` 246 LOC — Tester-1 (+x) 5 claim patterns scan docs/audits/ + CLAUDE.md cross-ref reality probes
- `M-AI-04-doc-drift-detector.mjs` 260 LOC — Maker-2 (+x) 4 patterns drift detect docs vs filesystem/Supabase truth

### 12 ATOM task files
- `automa/tasks/pending/ATOM-S31-A1-elab-morfismo-validator.md` through `ATOM-S31-A12-sprint-T-iter-31-contract.md`

### 1 sprint contract
- `automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md` 6-agent file ownership matrix + Pattern S r3 protocol + 12 ATOM cross-ref

### 5 completion msgs Phase 1
- `automa/team-state/messages/planner-opus-iter31-phase1-completed.md`
- `automa/team-state/messages/maker1-iter31-phase1-completed.md`
- `automa/team-state/messages/maker2-iter31-phase1-completed.md`
- `automa/team-state/messages/tester1-iter31-phase1-completed.md`
- `automa/team-state/messages/architect-opus-iter31-phase1-completed.md`

### Phase 2 deliverables (this turn)
- `docs/audits/2026-05-02-iter-31-PHASE1-CLOSE-audit.md` (this audit ~500 LOC)
- `docs/handoff/2026-05-02-iter-31-to-iter-32-handoff.md` (this handoff ~280 LOC)
- `automa/team-state/messages/scribe-opus-iter31-phase2-completed.md` (scribe completion msg this turn)
- CLAUDE.md sprint history footer APPEND (~80 LOC)

---

## §5 CoV mandate iter 32+ entrance

### vitest 13474 preserve
- File `automa/baseline-tests.txt` reads `13474`
- Pre-flight CoV iter 32 entrance: `npx vitest run` ~3-5min target 13474 PASS NEVER scendere
- If regression flagged: REVERT IMMEDIATO + investigate flakiness (NEVER hide)
- Per CLAUDE.md anti-regressione FERREA + master plan §3 mandate

### build PASS heavy ~14min defer iter 32 entrance
- `npm run build` ~14min heavy obfuscation + esbuild CSS warnings non-fatal
- Defer Phase 1 close (NEW skills + mechanisms outside build entry points)
- Mandatory Phase 3 orchestrator pre-flight CoV iter 32 entrance gate
- If build FAIL: investigate root cause + fix BEFORE commit (NO `--no-verify` bypass)

### Pre-commit hook (audit caveat 8)
- M-AR-01-auto-revert-pre-commit.sh NOT wired `.husky/pre-commit` Phase 1
- Iter 32 entrance Andrea decision D6: wire now vs defer iter 33+
- One-line install: `echo 'bash scripts/mechanisms/M-AR-01-auto-revert-pre-commit.sh' >> .husky/pre-commit`

### Pre-push hook (CLAUDE.md anti-regressione FERREA)
- NEVER bypass `--no-verify` push (iter 32 P0 release ratchet)
- Pre-push hook quick regression test must PASS
- NO push diretto su main, only PR via `gh pr create`

---

## §6 Anti-pattern checklist iter 32+

- [ ] NO compiacenza score (audit §6 + 11 caveats §5 model — ricalibrare honestly)
- [ ] NO inflate score: G45 mechanical cap M-AI-02 verify per atom + Opus indipendente review Phase 7
- [ ] all atoms CoV 3-step (PRE baseline preserve + incremental dry-run/test + POST baseline preserve verify)
- [ ] Pattern S filesystem barrier mandatory PRE Phase 2 spawn (NO race-cond stale-state risk validated 10th iter consecutive)
- [ ] scribe Phase 2 sequential mandatory POST 4-6/4-6 completion msgs barrier (NO parallel write conflict)
- [ ] file ownership rigid disjoint per sprint contract (NO write conflict cross-agent)
- [ ] NO emoji
- [ ] NO claim "X done" senza file:line verify
- [ ] NO claim "LIVE" senza M-AI-03 claim-reality verify
- [ ] NO claim "score X" senza score-history.jsonl entry validated M-AI-01
- [ ] NO commit con `--no-verify` (pre-commit hook protezione)
- [ ] NO push main directly (only PR via `gh pr create`)
- [ ] NO destructive ops (no `rm -rf`, no `git reset --hard`, no force push)
- [ ] NO write outside ownership rigid (sprint contract file ownership matrix)
- [ ] All 11 honesty caveats §5 audit acknowledged + Andrea ratify queue closed iter 32 entrance

---

## §7 Cross-link master plan + decisioni matrix + 8 G45 defaults + Opus baseline G45 iter 39

### Master plan
- `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md` — Phase 0-7 architecture, 6-agent OPUS Pattern S r3, 12 atoms decomposition, §6 decisioni matrix Andrea, §11 cumulative iter 41-43 Sprint T close path

### 8 G45 defaults
- `iter-31-andrea-flags.jsonl` — Andrea ratify queue iter 32 entrance (D1-D8 decisioni master plan §6)
- D1 score iter 31 Phase 1 close cap: 8.10 default
- D2 PZ validator pre-existed gap accept full create vs rewrite
- D3 LOC M-AI-04 +140 accept readability vs split modules
- D4 LOC M-AI-02 +125 accept readability vs split modules
- D5 score-history.jsonl schema mismatch fix legacy vs widen enum
- D6 pre-commit hook M-AR-01 wire now vs defer
- D7 G2 NanoR4Board SHA-256 baseline lazy first-run vs pre-populate
- D8 M-AI-03 stale claims cleanup mandate iter 32 vs defer

### Sprint contract Pattern S r3
- `automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md` — file ownership matrix + filesystem barrier protocol + Pattern S r3 race-cond fix VALIDATED 10th iter consecutive

### Phase 0+1 baseline
- `docs/audits/PHASE-0-baseline-2026-05-02.md` — vitest 13474 + R5 latest 0/8 BROKEN + R6 0.067 + R7 3.6% canonical/46.2% combined + Lighthouse perf 26+23 + RAG 2061 chunks page=0%/chapter=8.7% + 94 spec EXISTS NOT executed + Edge Function v50→v72 chain
- `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` — Opus baseline 8.0/10 G45 cap iter 39 (delta vs prior claim 8.45 = -0.45, 3 inflation flags: Onniscenza V2 reverted + 12-tool Deno fire-rate 0% + R5 latency cap NOT survives iter 39 churn)

### Sprint T close projection
- iter 41-43 cumulative + Phase 7 Andrea Opus G45 indipendente review G45 mandate
- 9.5/10 ONESTO conditional all gates met (Sprint U Cycle 2 + Voyage re-ingest + Onniscenza V2.1 + wake word + Onnipotenza Deno port + canary 100% + 94 esperimenti audit + linguaggio codemod + Vol3 narrative)
- NOT iter 32 single-shot, NOT iter 31 Phase 1 alone

---

**Handoff close**: scribe-opus iter 31 Phase 2 sequential. Iter 32 entrance pre-flight CoV mandatory. NO compiacenza. Pattern S r3 race-cond fix mandate. 11 honesty caveats audit §5 Andrea ratify queue iter 32 entrance.
