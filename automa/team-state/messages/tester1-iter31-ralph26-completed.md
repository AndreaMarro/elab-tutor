# Tester-1 iter 31 ralph 26 Phase 4 Atom 27.1 — R8 NEW 100-prompt stress fixture COMPLETED

**Date**: 2026-05-03
**Agent**: Tester-1 (single-agent inline normal mode, NOT caveman)
**Sprint**: T close target ADVANCED 9.0/10 ONESTO
**Atom**: 27.1 R8 NEW UI action context awareness fixture + runner per ADR-042 §6

## Deliverables (file-system verified)

### 1. NEW `scripts/bench/r8-fixture.jsonl`
- **Path absolute**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/r8-fixture.jsonl`
- **LOC**: 100 lines (1 prompt per line, JSONL canonical)
- **Lines parse**: 100/100 valid JSON (verified `node JSON.parse`)
- **Schema per line**:
  ```json
  {"id":"r8-{cat}-{NNN}","category":"{cat}","prompt":"...","expected_action":"{action}","expected_target":"{target}","ui_state_required":true|false}
  ```

### 2. NEW `scripts/bench/run-sprint-r8-stress.mjs`
- **Path absolute**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/run-sprint-r8-stress.mjs`
- **LOC**: 624 (within target band ~200-300 task spec; expanded to 624 includes synthetic UI state generator covering 5 categories x 4 variants + 3-rubric scorer + per-category breakdown report — readability + audit trail justification per pattern of run-sprint-r7-stress.mjs 465 LOC)
- **Syntax**: `node --check` PASS
- **Gate-out without env**: PASS (graceful exit code 1 with iter 26 caveat msg + activation hint)

## 100 prompts breakdown 5 categories x 20 each (verified `grep -c '"category":"X"'`)

| Category | Count | Sample |
|----------|-------|--------|
| `state_query` | 20 | "Cosa vedo sulla schermata adesso?" / "Quali finestre sono aperte?" / "A che passo del percorso sono arrivato?" |
| `ui_action_propose` | 20 | "Voglio chiudere la lavagna" / "Chiudi la finestra Passo Passo" / "Riduci la chat UNLIM al minimo" |
| `voice_control` | 20 | "Pausa la spiegazione" / "Spiega di nuovo" / "Alza il volume" / "Cambia voce, scegli quella di Davide" |
| `navigation` | 20 | "Vai al chatbot" / "Torna alla home" / "Modalita Percorso" / "Apri il capitolo 6 del Volume 1" |
| `lesson_path_step` | 20 | "Prossimo passo" / "Ricomincia da capo" / "Vai al passo 5" / "Torna al passo precedente" |
| **Total** | **100** | — |

## Runner pattern verify

Modeled directly on `scripts/bench/run-sprint-r7-stress.mjs` (Tester-2 iter 37 200-prompt INTENT exec rate runner, 465 LOC):
- ✅ Same fixture loader pattern (`fs.readFileSync(FIXTURE).split('\n').map(JSON.parse)`)
- ✅ Same auth pattern (apikey + Authorization Bearer + optional X-Elab-Api-Key)
- ✅ Same Edge Function POST (`UNLIM_EDGE_URL` default prod elab-unlim)
- ✅ Same cold-start retry + timeout retry pattern (45s timeout, 15s cold retry, MAX_TOTAL_FAILURES 30)
- ✅ Same makeSessionId + buildHeaders helpers
- ✅ Same per-prompt streaming JSONL output + final scores.json + report.md
- ✅ Same per-category breakdown table in report
- ✅ Same honesty caveats section
- ✅ Pacing delay env-configurable `R8_PACING_DELAY_MS` default 800ms (vs r5/r7 pattern)
- **Extended** vs r7: NEW `makeSyntheticUIState(category, idx)` 4-variant permutation generator per ADR-042 §6.4 ("synthetic UI state injection") + NEW request body field `ui_state` per ADR-042 §4.2 + NEW 3-rubric scorer (UI context accuracy 0.5 + PZ V3 0.3 + no-hallucination 0.2) per ADR-042 §6.2.

## CoV results 3-step

### CoV-1 (PRE atom)
**Vitest baseline read**: `automa/baseline-tests.txt` = **13474** (file-system).
**Note**: task spec references baseline 13752 (post iter 25 Atom 26.1) — **discrepancy flagged, file-system 13474 is current truth per `automa/baseline-tests.txt` last update**. NOT re-running full vitest (~5min) since this atom touches ZERO files under vitest discovery (`tests/**/*.{test,spec}.{js,jsx}`).

### CoV-2 (incremental)
**File ownership rigid honored**:
- `scripts/bench/r8-fixture.jsonl` NEW (.jsonl extension, NOT under `tests/` dir, NOT discovered by vitest)
- `scripts/bench/run-sprint-r8-stress.mjs` NEW (.mjs extension, NOT in vitest include pattern `*.{test,spec}.{js,jsx}`)
- ZERO src/ edits, ZERO supabase/ edits, ZERO tests/ edits, ZERO vitest config edits
- Vitest baseline 13474 mathematically PRESERVED by construction (no test discovery touched)

### CoV-3 (POST atom)
**Vitest baseline 13474 PRESERVED** (mathematical preservation, no need to re-run). Task spec citation "13752" reflects orchestrator's expected target post iter 25; `automa/baseline-tests.txt` reads 13474 — flagged discrepancy for orchestrator review, NOT regression introduced by this atom.

## Anti-pattern enforced (per task mandate)

- ✅ **NO claim "R8 ≥80% UI context accuracy LIVE"** — fixture+runner only iter 26, exec deferred iter 28+ canary stage per ADR-042 §6.3 + §7.1 thresholds
- ✅ **NO fabricate scores** — runner outputs real scoring rubric from response text, no synthetic results written iter 26
- ✅ **NO `--no-verify`** — no commits attempted (orchestrator commits Phase 3 per task)
- ✅ **NO destructive ops** — only Write to 3 NEW files (fixture + runner + this msg)
- ✅ **NO compiacenza** — caveats §1-§5 in runner report template explicit (synthetic state mock, simplified PZ V3 subset, latency overhead vs V1 baseline deferred, no-hallucination heuristic loose, full Playwright bootstrap deferred)
- ✅ **NO write outside file ownership** — strictly 3 files in approved paths, ZERO modifications to `supabase/functions/unlim-chat/index.ts` (Maker-1 ownership Atom 26.2 parallel)
- ✅ **NO commit by this atom** — orchestrator commits Phase 3 per task

## Honesty caveats critical (5 per ADR-042 §6 spec compliance)

1. **R8 NOT executed iter 26** — fixture+runner shipping only. Live exec deferred iter 28+ canary stage post Andrea env provision (`SUPABASE_ANON_KEY` + `ELAB_API_KEY` + `INCLUDE_UI_STATE_IN_ONNISCENZA=true` canary 5% opt-in per ADR-042 §7.1 ramp protocol).
2. **Synthetic UI state injection** — `makeSyntheticUIState(category, idx)` generates 4 variants per category (16 unique state combos × 5 cat = ~20 distinct snapshots covering route/modalita/modals/opened_panels/lesson_path_step/focused permutations). REAL Playwright bootstrap + `window.__ELAB_API.ui.getState()` (per ADR-036 + ADR-042 §4.1) deferred iter 28+ Tester-2 + Maker-1 scope.
3. **PRINCIPIO ZERO V3 simplified subset** — full 12-rule scoring requires `scripts/bench/score-unlim-quality.mjs` integration (deferred iter 28+). This runner uses 3-rule shortcut (Ragazzi 0.4 + Vol/pag 0.3 + kit ELAB 0.3) for inline scoring per-prompt during bench loop.
4. **Latency overhead vs V1 baseline 3380ms NOT measured iter 26** — per ADR-042 §6.3 target <100ms overhead requires R5 paired re-run post-deploy. This runner reports absolute latency (avg/p50/p95/p99); paired comparison deferred iter 28+ Tester-1 Atom 28.x ownership.
5. **No-hallucination heuristic loose** — regex-based detection of "modal X is open" / "panel X open" patterns when `ui.modals` empty. Production deploy needs stricter LLM-as-judge or NER-based hallucination detection (defer iter 30+ Tester-2 scope).

## Files refs

- NEW: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/r8-fixture.jsonl` (100 LOC)
- NEW: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/run-sprint-r8-stress.mjs` (624 LOC)
- NEW: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/automa/team-state/messages/tester1-iter31-ralph26-completed.md` (this msg)
- INPUT read: `docs/adrs/ADR-042-onniscenza-ui-state-snapshot-integration.md` §6 R8 spec + §6.2 scoring rubric + §6.4 runner spec
- PATTERN read: `scripts/bench/run-sprint-r7-stress.mjs` (465 LOC, runner pattern reference)
- PATTERN read: `scripts/bench/r5-fixture.jsonl` + `r6-fixture.jsonl` + `r7-fixture.jsonl` (fixture format reference)

## Status

**Atom 27.1 SHIPPED** — fixture (100 prompts, 5 cat x 20) + runner (624 LOC) + completion msg. CoV mathematical preservation by file ownership rigid. R8 live exec deferred iter 28+ canary stage. Orchestrator Phase 3 commits this atom together with parallel Atom 26.2 deliverables (Maker-1 Edge Function unlim-chat/index.ts ui_state read + inject per ADR-042 §4.3, NOT touched by this atom).
