# Day 25 Sprint Contract — sett-4 Day 04 (Harness 2.0)

**Cumulative**: Day 25 / sett-4 local Day 04
**Date**: 2026-04-25
**Branch**: `feature/sett-4-intelligence-foundations`
**Baseline pre**: tests 12248, benchmark 4.79 (carry Day 22), 0 P0/P1 blockers
**Sprint**: sett-4-intelligence-foundations (Karpathy LLM Wiki POC — LOCKED Option B)

---

## Goal atomic

Deliver S4.1.4 Together AI Batch dispatcher (DRY-RUN default, no auto-paid POST), clear 6 Day 24 gaps (npm audit fix non-breaking, benchmark re-run, E2E smoke with axe integration, MCP discipline), zero regression tests 12248 floor. Day 04 Harness 2.0 composite >=7.5/10.

## Stories in scope

| Story | SP | Deliverable |
|-------|----|-------------|
| S4.1.4a wiki-dispatch-batch.mjs (native fetch, no SDK dep) | 2 | Native-fetch dispatcher: validate JSONL → POST /v1/files → POST /v1/batches → poll → download. `--dry-run` DEFAULT (validates + cost estimate only). `--execute` required for paid POST. |
| S4.1.4b dispatcher unit tests | 1 | Pure-function tests for cost estimator, JSONL line validator, error-code mapper. Zero network in unit tests. |
| GAP-DAY24-02 fix npm audit non-breaking | 0.5 | `npm audit fix` (no `--force`, no major bump). Document residual `vite-plugin-pwa` major as Andrea decision. |
| GAP-DAY24-04 E2E smoke + axe integration | 1 | `tests/e2e/wiki-smoke.spec.js` (2 specs: homepage loads + axe accessibility baseline). Wires `runAxeScan` from Day 24 helper. |
| GAP-DAY24-05 benchmark write | 0.5 | `node scripts/benchmark.cjs --write` end-of-day capture. Verify test_count metric contribution. |

**SP day 25**: 5 (matches day-04 plan 5 SP target)

## Acceptance criteria (pre-implementation)

### S4.1.4a wiki-dispatch-batch.mjs

- [ ] Script reads JSONL input path (default `/tmp/wiki-batch-all.jsonl`)
- [ ] Validates each line: valid JSON + required fields (`custom_id`, `body.model`, `body.messages`)
- [ ] Cost estimate: tokens input (sum max_tokens output + input tokens estimate from prompt length) × Together batch rate (Llama 3.3 70B Instruct Turbo batch pricing)
- [ ] **DRY-RUN default**: prints line count + cost estimate + sample 1 record redacted, DOES NOT POST
- [ ] `--execute` flag + `TOGETHER_API_KEY` env var both required for actual POST
- [ ] POST `/v1/files` with JSONL (purpose=`batch-api`) via native `fetch`
- [ ] POST `/v1/batches` with `{input_file_id, endpoint:'/v1/chat/completions', completion_window:'24h'}`
- [ ] Poll `GET /v1/batches/{id}` every 30s (configurable) until status `completed`/`failed`/`expired`
- [ ] Download output file via `GET /v1/files/{id}/content`
- [ ] Error handling: 400 BadRequest / 401 Auth / 403 Perm / 404 NotFound / 422 Unprocessable / 429 RateLimit / >=500 InternalServer with clear messages
- [ ] Zero external deps (no `together-ai` npm install — per CLAUDE.md rule 13)
- [ ] Exit 0 PASS, 1 FAIL, 2 DRY_RUN_ONLY

### S4.1.4b unit tests

- [ ] 8+ cases: cost estimator (3 scenarios), JSONL validator (valid/missing-custom_id/malformed-json), error mapper (7 codes), guard `--execute` requires env key
- [ ] Zero network (no actual fetch calls)

### GAP-DAY24-02 npm audit

- [ ] Run `npm audit fix` (non-breaking only)
- [ ] Compare audit before/after, document delta
- [ ] If `vite-plugin-pwa` major still required: log as Andrea-decision, do NOT auto-upgrade
- [ ] Post-fix: `npm run build` must still succeed
- [ ] Post-fix: CoV 1x vitest pre-commit must pass

### GAP-DAY24-04 E2E smoke + axe

- [ ] `tests/e2e/wiki-smoke.spec.js` with 2 specs
- [ ] Spec 1: homepage loads + title present (smoke)
- [ ] Spec 2: homepage axe scan → report violations count + summary
- [ ] Uses `tests/e2e/helpers/axe-helper.js` `runAxeScan` + `summariseAxeResults` from Day 24
- [ ] Playwright config auto-discovers spec (no testIgnore block)
- [ ] Run command: `npx playwright test tests/e2e/wiki-smoke.spec.js`
- [ ] Output: pass baseline + JSON summary of violations (no fail on finding — baseline)

### GAP-DAY24-05 benchmark write

- [ ] Run `node scripts/benchmark.cjs --write`
- [ ] Verify `automa/state/benchmark.json` updated with fresh sha
- [ ] test_count metric should reflect 12248 (not stale)
- [ ] Document composite score delta vs Day 22 carry 4.79

## Deferred to Day 26+

- S4.1.4c actual `--execute` LIVE dispatch (Andrea approval required before first paid POST)
- S4.1.5 Edge Function `unlim-wiki-query` (needs wiki content first)
- S4.1.6 wiki pipeline integration tests
- S4.2.2 `accessibility_wcag` benchmark metric wire
- S4.2.3 `unlim_latency_p95` pipeline
- GAP-DAY24-01 lesson count reconcile (25 vs 27) — Andrea decision needed
- GAP-DAY24-03 PTC `code_execution` container `.claude/tools-config.json`
- GAP-DAY24-06 MCP discipline tracking file (today addresses via live ≥10 calls)

## Rollback plan

- Any Day 25 change breaks tests or build: `git reset --hard 946aafb` (last clean commit Day 24)
- `npm audit fix` regression: `git checkout HEAD -- package.json package-lock.json && npm install`
- New scripts orphan: scripts live in `scripts/` with isolation from `src/`, orphaning is safe (no importers)

## Success metrics (Harness 2.0 4-grading targets)

| Criterion | Target Day 25 | Day 24 actual |
|-----------|---------------|---------------|
| Design Quality | >=7.5 | 8.0 |
| Originality | >=7.0 | 7.0 |
| Craft | >=8.0 | 8.0 |
| Functionality | >=7.5 | 7.5 |
| **Composite** | **>=7.7** | 7.6 |

Additional gates:
- Tests: >=12263 (+15 floor from 12248)
- MCP explicit calls: >=10 (clears GAP-DAY24-06)
- npm audit: high count from 13 → <=5 preferred (some require major bump, that's Andrea gate)
- Benchmark: fresh run, composite score captured

## Risk watch

- Together AI Batch API endpoint path uncertainty (docs say `/v1/batches` but path may differ if Together keeps OpenAI-compat): DRY-RUN default mitigates. Actual live test requires Andrea green light.
- `npm audit fix` may pin deps in unexpected ways: run `npm run build` + `vitest run` immediately after.
- Playwright E2E may need server running: use `playwright.config.js` webServer directive or direct URL to www.elabtutor.school (live) — prefer dev server on localhost for determinism.

## Out of scope (explicit)

- Any `--execute` paid Together AI POST Day 25 (Andrea approval gate)
- Any major-version dep bump Day 25 (Andrea approval gate)
- Any `src/components/simulator/engine/**` modification (engine lock intact)
- Any prod Supabase / Vercel deploy config change
