# Day 24 Sprint Contract — sett-4 Day 03 (Harness 2.0)

**Cumulative**: Day 24 / sett-4 local Day 03
**Date**: 2026-04-24
**Branch**: `feature/sett-4-intelligence-foundations`
**Baseline**: tests 12220, benchmark 4.79 (carry Day 22), 0 P0/P1 blockers
**Sprint**: sett-4-intelligence-foundations (Karpathy LLM Wiki POC — LOCKED Option B)

---

## Goal atomic

Deliver S4.1.3 ingest-script infrastructure (non-ejecuting, batch-ready) + S4.2.1 axe-core devDep install + PTC CoV 5x catch-up. Zero regression tests 12220 floor. Day 03 Harness 2.0 composite >=7.5/10.

## Stories in scope

| Story | SP | Deliverable |
|-------|----|-------------|
| S4.1.3a wiki-build-batch-input.mjs | 2 | Script emits Together AI Batch API JSONL from VOLUME_REFERENCES+LESSON_GROUPS, with SCHEMA system-prompt, PZ v3 user-prompt |
| S4.1.3b wiki-validate-file.mjs | 1 | Standalone validator: PZ v3 grep + YAML front-matter schema + required sections + citation format |
| S4.2.1 axe-core devDep | 0.5 | `@axe-core/playwright` installed + basic config `tests/e2e/helpers/axe-helper.js` stub |
| PTC CoV 5x catch-up | 0.5 | Document CoV 5x via serial Bash (PTC container deferred Day 04, same semantics) |
| Unit tests new scripts | 1 | `tests/unit/wiki-build-batch-input.test.js` + `tests/unit/wiki-validate-file.test.js` |

**SP day 24**: 5 (matches day-03 plan 5 SP target)

## Acceptance criteria (pre-implementation)

### S4.1.3a
- [ ] Script reads `src/data/volume-references.js` (92 entries)
- [ ] Script reads `src/data/lesson-groups.js` (27 entries)
- [ ] Script reads `docs/unlim-wiki/SCHEMA.md` for system prompt
- [ ] Output: `/tmp/wiki-batch-input.jsonl` with 92 experiment lines + 27 lesson lines
- [ ] Each JSONL line: `{ custom_id, body: { model, messages: [system, user], max_tokens, temperature } }`
- [ ] Model: `meta-llama/Llama-3.3-70B-Instruct-Turbo` (per ADR-006)
- [ ] System prompt encodes PZ v3 enforcement + required body sections + front-matter schema
- [ ] User prompt varies per id (includes bookText literal, kit_components, lesson linkage)
- [ ] Idempotent: re-run produces byte-identical output (deterministic ordering)
- [ ] CLI flags: `--out <path>`, `--limit <n>`, `--type experiments|lessons|all`
- [ ] Unit tests: 6+ cases (count, schema, PZ v3 in prompts, idempotent, limit flag, type filter)

### S4.1.3b
- [ ] Script validates single markdown file given path
- [ ] Check 1: PZ v3 grep `/Docente,?\s*leggi|Insegnante,?\s*fai/i` → 0 matches
- [ ] Check 2: Front-matter YAML valid + required fields per SCHEMA.md §1.3
- [ ] Check 3: Required body sections per type (experiment=7, lesson=4, concept=5) per SCHEMA.md §1.4
- [ ] Check 4: `[volume:VolNpM]` marker present if `volume_refs` non-empty
- [ ] Output: JSON `{ path, type, pass: bool, errors: [{ check, severity, message }] }`
- [ ] Exit code: 0 PASS, 1 FAIL
- [ ] Unit tests: 8+ cases (valid experiment, invalid PZ v3, missing front-matter, missing section, valid concept, invalid citation, wrong type, exit code)

### S4.2.1
- [ ] `npm install -D @axe-core/playwright` (Andrea APPROVED 2026-04-22)
- [ ] `tests/e2e/helpers/axe-helper.js` stub with `runAxeScan(page)` signature
- [ ] No actual test wired (S4.2.2 Day 04 will wire to benchmark)
- [ ] Zero impact bundle size (devDep only)

### PTC CoV 5x catch-up
- [ ] Run `npx vitest run --reporter=dot` 5× serial (PTC container deferred)
- [ ] All 5 runs: test count == 12220 identical
- [ ] Log to `docs/audit/cov-5x-day-24.md` (5 timestamps + durations + counts)

## Test strategy

- Unit: vitest `tests/unit/wiki-build-batch-input.test.js` + `tests/unit/wiki-validate-file.test.js` (happy path + edge cases + error paths)
- Integration: run scripts end-to-end against real data files (assert JSONL line count = 92 + 27, validator rejects crafted bad sample)
- CoV: 5× vitest ≥ 12220 baseline (ratchet +15 this day via new tests)

## Rollback plan

- Scripts are isolated (no src/ import). Revert commits if validator false positive.
- axe-core devDep: `npm uninstall @axe-core/playwright` + `package.json` revert if install flaky.
- No deploy triggered (scripts + devDep only).

## Success metrics (Harness 2.0 4-grading)

Target composite Day 24 >= 7.5/10.

- Design Quality: ≥8 — scripts idempotent, CLI ergonomic, schema-aligned
- Originality: ≥7 — PZ v3 validator unique to ELAB, batch-input emitter designed for Together AI Batch API
- Craft: ≥8 — strict separation concerns, unit-tested, zero src/ coupling
- Functionality: ≥7 — runnable tonight (JSONL emitted + validator rejects crafted bad files)

## MCP usage target

≥10 calls Day 24:
- claude-mem smart_search × 2 (wiki-ingest-pattern + Together-AI-batch-api)
- claude-mem save_observation × 3 (day-start + mid-day + end-day)
- serena get_symbols_overview × 2 (src/data volume-references + lesson-groups)
- context7 query-docs × 2 (Together AI node SDK + axe-core/playwright)
- WebSearch × 1 (fallback Together AI Batch API 2026)

## Blockers risk watch

- Together AI Batch API schema drift (mitigate: context7 + WebSearch)
- Front-matter YAML parser choice (pick `yaml` npm if needed, or inline regex parser if avoid dep)

---

**Contract negotiated**: inline TPM (Harness 2.0 pre-implementation pattern). Review Day 24 end-of-day audit.
