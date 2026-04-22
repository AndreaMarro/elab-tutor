# Sprint Contract — Day 27 (sett-4 Day 06 local) — Harness 2.0

**Sprint**: sett-4-intelligence-foundations (Option B Karpathy LLM Wiki POC)
**Logical date**: 2026-04-22 (cumulative day 27, local sett-4 day 06)
**Committed SP**: 4 (ADR-007 doc 1 SP + wiki-corpus-loader 2 SP + S4.1.6 integration tests 1 SP)

## Rationale

Day 26 delivered wiki-query scaffold with inline SEED_CORPUS mock + accessibility metric wire + axe-baseline generator. The scaffold is *structurally* ready but *semantically* empty — three hand-written entries carry no real wiki content. Day 27 closes the gap with a file-based corpus loader (reads `data/wiki/*.md` front-matter + body if present) and verifies end-to-end pipeline wiring via integration tests. ADR-007 captures the module-extraction pattern already validated twice (wiki-query-core.mjs Day 26, accessibility.cjs Day 26) so future Edge Functions follow the same Deno+Node shared-core convention without re-deriving the rationale.

## Pre-Implementation Acceptance Criteria

### Story S4.1.5b — `scripts/wiki-corpus-loader.mjs` (2 SP)
- [ ] New module `scripts/wiki-corpus-loader.mjs` exporting `loadCorpus({ dir, fallback })` + `parseWikiMarkdown(raw)`
- [ ] `parseWikiMarkdown` extracts YAML front-matter (id, title, volume, chapter, page) + body
- [ ] `loadCorpus` walks `dir` recursively for `*.md`, parses each, returns array `{ id, title, volume, chapter, page, content }`
- [ ] Empty dir / missing dir → returns `fallback` array unchanged (no throw)
- [ ] Malformed front-matter in a file → warning to stderr, file skipped, other files processed
- [ ] Pure ESM, no runtime deps, Deno+Node shared
- [ ] Refactor `wiki-query-core.mjs`: export `makeRetriever(corpus)` factory; default export keeps SEED_CORPUS behaviour for back-compat
- [ ] Unit tests ≥18 cases: parseWikiMarkdown 8 (valid front-matter, missing field, malformed YAML, no front-matter, empty body, multiline value, comment lines, CRLF line endings) + loadCorpus 6 (dir OK with 2 files, empty dir, missing dir, malformed file skipped, nested dir flatten, fallback arg honoured) + makeRetriever 4 (custom corpus, filter by volume, score>0 filter, topK respect)

### Story S4.1.6 — wiki pipeline integration tests (1 SP)
- [ ] New file `tests/integration/wiki-pipeline.test.js`
- [ ] Round-trip 1: build-batch-input emits JSONL → parse one custom_id line → recover volume/experiment slug
- [ ] Round-trip 2: fixture markdown → loadCorpus → validateRequest → retrieveWikiEntries with custom corpus → response has results ≥1 scoring ≥0.3 for keyword-matching query
- [ ] Round-trip 3: corpus empty + fallback SEED_CORPUS → retrieval still functional (regression guard)
- [ ] Uses tmp dir for fixture generation (no repo pollution)
- [ ] ≥6 integration cases total

### Story D27-DOC — ADR-007 module extraction pattern (1 SP)
- [ ] New file `docs/architectures/ADR-007-module-extraction-pattern.md`
- [ ] Status: Accepted
- [ ] Context: Edge Functions in Supabase run Deno; benchmark + dispatchers run Node. Logic shared between them needs a no-deps ESM module that both runtimes can `import`
- [ ] Decision: pure-ESM `scripts/*.mjs` or `scripts/benchmark-metrics/*.cjs` with zero runtime deps, direct unit-testable via vitest, imported by Deno Edge Function via relative path
- [ ] Consequences: positives (testability, speed, portability, no bundler) + negatives (code duplication risk, type drift without TS, manual sync)
- [ ] Examples: link `wiki-query-core.mjs`, `accessibility.cjs`, `wiki-build-batch-input.mjs`, forthcoming `wiki-corpus-loader.mjs`
- [ ] Anti-patterns called out: heavy npm deps in shared modules, CommonJS-only syntax, hidden global state

## Test Strategy
- Vitest unit: target +25 new tests (18 loader unit + ~7 integration)
- CoV 3x full suite: identical PASS count (target 12328 + new → ~12353)
- Integration tests live in `tests/integration/` (new dir if absent)

## Rollback Plan
- Each story = atomic commit; if GATE fails, `git revert` the offending commit
- wiki-query-core.mjs refactor preserves default export → existing callers unaffected
- ADR-007 is doc-only, zero runtime impact

## 4-Grading Targets (Harness 2.0)
- Design Quality: 8.3 (ADR codifies repeatable pattern, loader follows established convention)
- Originality: 7.0 (loader mechanics routine; ADR synthesis is the thoughtful piece)
- Craft: 8.5 (pure ESM, unit-test-first, graceful degradation on malformed input)
- Functionality: 8.2 (file-based corpus working end-to-end, integration tests guard regression)
- **Target mean**: 8.0/10 (hold Day 26 level)

## Success Metrics
- test_count delta ≥ +25
- benchmark score ≥ 5.32 (no regression)
- Zero CI red
- CoV 3x identical
- Commit SHA captured in claude-progress.txt
