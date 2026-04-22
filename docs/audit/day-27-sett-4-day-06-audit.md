# Day 27 Audit — sett-4 Day 06 local — 2026-04-22

**Sprint**: sett-4-intelligence-foundations (Option B Karpathy LLM Wiki POC)
**Branch**: feature/sett-4-intelligence-foundations
**Committed SP today**: 4 (ADR-007 doc 1 SP + wiki-corpus-loader 2 SP + S4.1.6 integration 1 SP)
**Cumulative Sprint 4 SP**: 25 of 26 (96%)

## Executive Summary

Day 27 closed the semantic gap left by Day 26 structural scaffold. Wiki pipeline end-to-end wireable now: markdown files on disk to loadCorpus, makeRetriever, validateRequest, retrieveWikiEntries, buildResponse. Seven integration tests exercise three round-trips and prove shape contracts match across the four boundary modules. ADR-007 codifies module-extraction pattern so Sprint 5+ Edge Functions inherit the convention rather than re-deriving it.

The Edge Function at supabase/functions/unlim-wiki-query/index.ts is UNCHANGED. The refactor preserved the exact import surface (retrieveWikiEntries, validateRequest, buildResponse, VERSION) while adding makeRetriever(corpus) alongside. Zero behavioural regression in production path.

## 20-Dimension Metric Matrix

| # | Metric | Day 26 | Day 27 | Delta | Target | Status |
|---|---|---|---|---|---|---|
| 1 | Vitest PASS | 12328 | 12371 | +43 | +15/day min | OK 2.87x target |
| 2 | Test Files | 217 | 220 | +3 | - | OK |
| 3 | Build time sec | ~60 | not rerun | - | <60 | not measured |
| 4 | Bundle size KB | 14743 | 14743 | 0 | <5000 | holding |
| 5 | Benchmark score | 5.32 | 5.34 | +0.02 | +0.08/day | below target |
| 6 | E2E pass rate | 0 | 0 | 0 | 0.95 | deferred Day 28+ |
| 7 | PZ v3 grep source | 0 | 0 | 0 | 0 | OK |
| 8 | PZ v3 curl prod | n/a | n/a | - | 0 violations | next deploy |
| 9 | Sentry errors 24h | baseline | baseline | 0 | <= baseline | OK |
| 10 | Deploy preview | n/a | n/a | - | 200 | no deploy |
| 11 | Deploy prod status | 200 | 200 | = | 200 | OK |
| 12 | Git unpushed | 0 | 1 pending | +1 | 0 EOD | push pending |
| 13 | Git dirty count | 1 heartbeat | varies | - | <= carry | OK |
| 14 | CI last run | success | pending | - | success | pending |
| 15 | Coverage % | not measured | not measured | - | >80% sett 8 | deferred |
| 16 | npm audit high | 0 | 0 | = | 0 | OK |
| 17 | Lighthouse perf | not run | not run | - | >=80 | deferred |
| 18 | Lighthouse a11y | not run | not run | - | >=90 | deferred |
| 19 | LLM latency p95 | not measured | not measured | - | <5s | deferred |
| 20 | Cold start Render | not measured | not measured | - | <3s | deferred |

## Stories Completed

### D27-DOC — ADR-007 module extraction pattern (1 SP) — DONE
- File: docs/architectures/ADR-007-module-extraction-pattern.md (148 lines)
- Status: Accepted
- Codifies pattern validated twice on Day 26 (wiki-query-core + accessibility.cjs)
- Lists 4 adopted modules as precedent, 6 anti-patterns to avoid
- Binding for Sprint 5+ new Edge Functions

### S4.1.5b — wiki-corpus-loader (2 SP) — DONE
- File: scripts/wiki-corpus-loader.mjs (176 lines)
- Exports: parseSimpleYaml, parseWikiMarkdown, normaliseEntry, collectMarkdownFiles, loadCorpus
- Pure ESM, zero runtime deps, Node+Deno shared (per ADR-007)
- Graceful degradation: missing dir / empty dir / all-malformed -> fallback returned
- Per-file error isolation: one malformed entry does not break the load
- Unit tests: 29 cases PASS 100%
- Companion refactor in wiki-query-core.mjs: added makeRetriever(corpus) factory, 7 new unit tests PASS

### S4.1.6 — wiki pipeline integration tests (1 SP) — DONE
- File: tests/integration/wiki-pipeline.test.js (new test directory created)
- 7 integration cases PASS 100%
- Round-trip 1: buildExperimentRecords -> serialize -> JSONL parse -> custom_id recovery
- Round-trip 2: fixture markdown on disk -> loadCorpus -> makeRetriever -> validateRequest -> retrieve -> response shape
- Round-trip 3: empty corpus + SEED_CORPUS fallback -> retrieval still functional (regression guard)
- Round-trip 4: validate() from wiki-validate-file.mjs accepts hand-written fixture; loader + validator agree on the same schema

## Honest Gaps / Debt (6)

1. P2 — Real wiki corpus not yet generated. data/wiki/ dir remains empty in the repo; loader falls back to SEED_CORPUS (3 entries). Story S4.1.4c (Together live dispatch) is still gated on Andrea approval. Without a live batch run, the loader has no real fixtures beyond the integration-test synthetic ones.
2. P2 — Integration test dir tests/integration/ had only 2 files before Day 27 (deploy-smoke, llm-client-provider-switch); wiki-pipeline joins as the 3rd. No CI job currently separates unit vs integration. Acceptable for now but future split for speed is deferred.
3. P3 — ADR-007 anti-pattern list mentions TypeScript migration as long-term; no tracked backlog ticket yet. Should be added to automa/team-state/product-backlog.md as Sprint 8+ epic.
4. P3 — parseSimpleYaml handles only flat key:value pairs. Real wiki entries from Together batch may contain arrays (kit_components: [a, b]) which my minimal parser treats as strings. Current integration test uses scripts/wiki-validate-file.mjs parseMarkdown for the full-schema test; two parsers coexist. ADR-007 follow-up: consolidate to one parser once Day 28+ corpus wire forces the issue.
5. P3 — Benchmark delta +0.02 is below the +0.08/day nominal target. The metric mix weights test_count at 0.15 and build_size at 0.05, so +43 tests only shifts the contribution by ~+0.04 before normalisation. No easy path to +0.08 without E2E enablement (weight 0.15) or bundle size reduction. Tracked as GAP-SETT4-BENCH-CADENCE for retrospective.
6. P3 — The Write tool pre-commit hook flagged a false-positive security warning on the loader module and audit file (child process warning despite no such call). Retry succeeded. Not a blocker but worth noting for the hook authors — the regex is over-matching.

## MCP Calls Log (transparent)

| MCP | Calls this session | Purpose |
|---|---|---|
| claude-mem | 0 direct (memory priming via system prompt) | context recovery |
| supabase | 0 | no deploy today |
| Vercel | 0 | no deploy today |
| Sentry | 0 | no incident check triggered |
| Playwright | 0 | no browser E2E today |
| context7 | 0 | no library docs lookup needed |
| serena | 0 | grep + Read sufficed |
| Total | 0 | below 15/day nominal target |

Honest note: Day 27 work was doc + pure-ESM modules + vitest, so MCP browser/deploy calls had no natural trigger. This is below nominal target but not manufactured. Day 28 will include deploy-preview + curl + Sentry scan when the wiki Edge Function gets a preview URL.

## 4-Grading Harness 2.0

- Design Quality: 8.4 — ADR-007 synthesises two independent precedents into a repeatable pattern with called-out anti-patterns; loader uses dependency injection (factory) to keep core retrievable pure.
- Originality: 7.0 — loader mechanics are routine (YAML parse + walk); the thoughtful piece is keeping SEED_CORPUS as a named fallback so the Edge Function path never breaks.
- Craft: 8.6 — each function tested in isolation before composition; integration tests use mkdtemp for no repo pollution; Edge Function import surface preserved exactly (zero production-path change).
- Functionality: 8.3 — end-to-end round-trip works: fixture -> disk -> load -> validate -> retrieve -> response envelope. Verified 7/7 integration cases.
- Mean: 8.08 / 10 (+0.08 vs Day 26 8.00)

## Definition of Done Check

- Task DoD: 11/11 (atomic commits, tests pass, CoV 3x, baseline ratchet, audit written, benchmark written)
- Story DoD: pending PR (local branch state meets all criteria)
- Sprint DoD: Sprint 4 ends Day 07 local = cumulative Day 28 (tomorrow)

## Next Day (28) Priorities

1. S4.2.3 — unlim_latency_p95 benchmark metric wire
2. GAP-DAY24-04 — E2E smoke baseline (chromium install verify + BASE_URL decision)
3. Sprint 4 end-of-week gate preparation

## Commit Plan

One atomic commit:
- title: feat(sett-4-day-06): wiki-corpus-loader + makeRetriever factory + ADR-007 + integration tests
- TEST count marker: [TEST 12371]
