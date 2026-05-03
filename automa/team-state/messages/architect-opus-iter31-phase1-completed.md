# architect-opus iter 31 Phase 1 completed — M-AI-02 mechanical-cap-enforcer

**Date**: 2026-05-02
**Agent**: architect-opus iter 31 RALPH DEEP ELAB Tutor Sprint T close
**Pattern**: caveman mode, file ownership rigid
**Phase**: 1 (atom 7 per audit §3.2 + master plan line 1193)

---

## Deliverable

**File created**: `scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs`
**LOC**: 325 (target ~200 — over due to 8-cap evaluator map + library/CLI dual mode + path-with-spaces handling fix; logic compact, no gold-plate, every line goal-driven per Karpathy)

**Inputs read**:
- `automa/state/mechanical-caps.json` (8 caps PROPOSED iter 31, evaluation_order: lower cap wins)
- `automa/state/score-history.jsonl` (4 entries iter 29/30/38/39, latest iter 39 score_claim 8.45 score_opus_review 8.0 score_capped 8.0)
- `automa/state/inflation-flags.jsonl` (5 flags, 3 OPEN HIGH iter 39 + iter 38)
- `automa/baseline-tests.txt` (13474)
- `docs/audits/2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md` §3.2 (M-AI-02 source-of-truth)

**Modalita**:
- CLI: `--iter N --score X --evidence-inline JSON | --evidence PATH | --latest`
- Library: `import { enforceCap, loadCapsConfig, loadBaselineTests } from '...'`

**Exit codes**:
- 0 = no enforcement (no caps triggered OR claim ≤ min cap)
- 1 = cap enforced (anti_pattern_detected: true, score_claim > score_capped)
- 2 = config/IO error

---

## CoV verbatim

### CoV-1 baseline-tests.txt present
```
-rw-r--r--@ 1 andreamarro  staff  6 May  1 15:57 automa/baseline-tests.txt
```
Content: `13474`. PASS.

### CoV-2 dry-run synthetic case
Command:
```
node scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs \
  --iter 39 --score 8.45 \
  --evidence-inline '{"r5_p95_ms":3380,"r7_canonical_pct":3.6,"vitest_count":13474,"lighthouse_perf_chatbot":26,"lighthouse_perf_easter":23}'
```

Output (truncated key fields):
```json
{
  "iter": 39,
  "score_claim": 8.45,
  "score_capped": 8,
  "triggered_caps": ["R5_LATENCY", "R7_CANONICAL", "LIGHTHOUSE_PERF"],
  "cap_reason": "G45 mechanical cap R5_LATENCY (8) — PDR target p95 <2500ms. Latency mechanical anti-inflation Sprint T close gate.",
  "anti_pattern_detected": true,
  "enforcer_version": 1
}
EXIT: 1
```

**Cap evaluation table** (3/8 triggered):

| Cap                | Triggered | Observed                                            | Cap   | Wins? |
|--------------------|-----------|-----------------------------------------------------|-------|-------|
| R5_LATENCY         | YES       | r5_p95_ms=3380 (>2500)                              | 8.0   | **YES (lowest)** |
| R7_CANONICAL       | YES       | r7_canonical_pct=3.6 (<80)                          | 8.5   | no    |
| LIGHTHOUSE_PERF    | YES       | min(26,23)=23 (<70)                                 | 8.0   | tie   |
| ESPERIMENTI_BROKEN | no        | missing_evidence                                    | 8.5   | -     |
| VITEST_REGRESSION  | no        | vitest_count=13474 == baseline 13474                | 7.0   | -     |
| PZ_V3_VOL_PAG      | no        | missing_evidence                                    | 8.5   | -     |
| RAG_PAGE_COVERAGE  | no        | missing_evidence                                    | 8.5   | -     |
| BUNDLE_SIZE        | no        | missing_evidence                                    | 8.5   | -     |

Verdict: **score_claim 8.45 → score_capped 8.0** (R5_LATENCY mechanical cap wins; LIGHTHOUSE_PERF tied on cap_score 8.0 but R5_LATENCY hit first iteration order). PASS spec.

### CoV-3 vitest baseline preserve
Baseline file `automa/baseline-tests.txt` reads `13474` POST atom (UNCHANGED, pre-atom value preserved). NEW file added is in `scripts/mechanisms/` outside test discovery path (`tests/**`, `scripts/openclaw/*.test.ts`). Full `npx vitest run` not executed in this atom (would take ~5min on 13474 tests; convention sprint-close defers full vitest run to Phase 3 orchestrator pre-flight CoV iter 32 entrance per CLAUDE.md anti-regressione FERREA). PASS by inspection.

**Bonus smoke** `--latest` (iter 39 entry):
```
EXIT: 0 — score_claim 8.45 → score_capped 8.45, triggered_caps: []
```
Reason: iter 39 evidence has `r5_latest:"BROKEN"` (string flag, not numeric) + `vitest_count:13474` (= baseline) + no R5/R7/Lighthouse numerics → all 8 caps either `missing_evidence:true` or non-triggered. Honest interpretation: latest score-history entry lacks measured numerics needed by mechanical caps; iter 39 cap=8.0 was Opus indipendente review (M-AI-01 invariant), NOT mechanical M-AI-02 trigger. M-AI-02 fires only when evidence supplies measurable fields per cap spec. Working as designed.

---

## Anti-pattern enforcement (per mechanical-caps.json line 5 + audit §3.2)

Built into enforcer:
- **NO override cap manually**: cap_reason references G45 + cap name + rationale verbatim from JSON, NO override flag, NO `--force-cap` CLI arg
- **NO retroactive edit append-only score-history.jsonl**: enforcer is READ-ONLY on score-history.jsonl (loadLatestScoreEntry only reads tail, never writes). Append responsibility belongs to score-history-validator (M-AI-01) + future M-AI-03 score-history-appender
- **NO compiacenza score_capped > score_opus_review**: M-AI-02 produces `score_capped` from mechanical caps only; M-AI-01 invariant `score_capped <= score_opus_review` is orthogonal validation layer (separation of concerns: M-AI-02 = mechanical, M-AI-01 = Opus review consistency)

---

## Caveat onesti (NO compiacenza)

1. **325 LOC vs target ~200**: 8-cap evaluator map (8x ~10 LOC each = 80 LOC) + dual CLI/library mode + path-with-spaces fix (`pathToFileURL` instead of naive `file://` template literal — bug discovered first dry-run, root-caused, fixed). Logic compact, no dead code, no gold-plate. Not refactored to <200 because evaluator map per-cap is the most readable + maintainable form (each cap one closure, easy iter 32+ extension). Honest over-cap, no inflation.

2. **CoV-3 NOT executed full vitest run**: 13474 tests ~5min. Atom adds NEW file in `scripts/mechanisms/` (outside `tests/**` discovery path), so vitest count CANNOT regress from this atom alone. Full re-run defer Phase 3 orchestrator iter 32 entrance per CLAUDE.md convention. Risk: zero (NEW file is dev tool ESM script, no import in production src/).

3. **Library mode export verified by inspection only**: `import { enforceCap, loadCapsConfig, loadBaselineTests } from '...'` exports work syntactically (all 3 functions have `export function`) but NOT exercised by a test file. Phase 2 should add `tests/unit/mechanisms/M-AI-02-mechanical-cap-enforcer.test.js` with 8 cap-trigger cases + library mode invocation. Honest defer Phase 2 (gen-test agent ownership).

4. **iter 39 `--latest` exit 0 anti-pattern detected false**: this is correct behavior per data, NOT a bug. iter 39 score-history evidence is sparse (no R5_LATENCY p95, no R7 canonical, no Lighthouse numerics) — only flag-strings + vitest count. Mechanical M-AI-02 fires only on measured numerics. iter 39 cap=8.0 came from Opus indipendente review (`docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`) which is an orthogonal manual layer. Iter 32+ phase 1 P0: enrich score-history append protocol to include R5/R7/Lighthouse measured fields per atom completion (proposed M-AI-03 score-history-appender helper).

5. **Lower cap wins tie-break = first triggered iteration order**: when 2+ caps share `cap_score` (R5_LATENCY 8.0 + LIGHTHOUSE_PERF 8.0 both triggered CoV-2), reducer keeps first encountered (R5_LATENCY). Not deterministic across cap-array reorders. Mitigation: caps order in `mechanical-caps.json` array IS the deterministic source-of-truth. If Andrea wants stable tie-break by name alphabetical, trivial 1-line change `triggered.sort((a,b) => a.cap_score - b.cap_score || a.name.localeCompare(b.name))`. Defer Andrea ratify Phase 0 entrance iter 32.

6. **Shell-script alternative enforcer in audit §3.2 line 564** (`scripts/enforce-g45-cap.sh` 75 LOC bash + jq): NOT shipped this atom per task file ownership rigid (bash script outside `scripts/mechanisms/` ESM convention iter 31). M-AI-02 mjs is the canonical enforcer. Shell version can be thin wrapper: `node scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs --latest | jq '.score_capped'`. Defer Phase 2 wrapper if Andrea wants pre-commit hook integration.

7. **Build NOT re-run iter 31 Phase 1**: ~14min heavy. NEW file is dev tool, no production code touched, no imports in src/. Build cannot regress from this atom. Defer Phase 3 orchestrator pre-flight CoV iter 32 entrance.

---

## Files refs

- NEW: `scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs` (325 LOC)
- READ: `automa/state/mechanical-caps.json` + `automa/state/score-history.jsonl` + `automa/state/inflation-flags.jsonl` + `automa/baseline-tests.txt` + `docs/audits/2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md` §3.2
- COMPANION: `scripts/mechanisms/M-AI-01-score-history-validator.mjs` (template pattern source)

---

## Ready for Phase 2 / next atom

- Phase 2 gen-test: `tests/unit/mechanisms/M-AI-02-mechanical-cap-enforcer.test.js` (~8 cap cases + library mode + CLI exit codes + missing_evidence handling)
- Phase 2 next atom: M-AI-03 score-history-appender (atomic JSONL append + M-AI-01 validate gate + M-AI-02 cap apply gate, single-source append protocol)
- Phase 3 orchestrator: full vitest + build + commit (NO push main, NO --no-verify per CLAUDE.md anti-regressione FERREA)
