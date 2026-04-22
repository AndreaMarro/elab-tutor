# CoV 3x — Day 27 (sett-4 Day 06 local) — 2026-04-22

Chain-of-Verification regression guard: full vitest suite executed 3x sequentially, identical PASS count required for ratchet.

## Results

| Run | Test Files | Tests PASS | Duration | Timestamp |
|-----|-----------|-----------:|---------:|-----------|
| 1 | 220 / 220 | **12371** | — | 2026-04-22 ~11:46 GMT+8 |
| 2 | 220 / 220 | **12371** | — | 2026-04-22 ~11:47 GMT+8 |
| 3 | 220 / 220 | **12371** | — | 2026-04-22 ~11:48 GMT+8 |

**Verdict**: 3/3 runs identical. Zero flaky tests. Baseline ratchets from **12328 → 12371** (+43 tests).

## New test modules (Day 27)

| File | Cases | Purpose |
|---|---:|---|
| `tests/unit/wiki-corpus-loader.test.js` | 29 | parseSimpleYaml (8) + parseWikiMarkdown (5) + normaliseEntry (5) + collectMarkdownFiles (5) + loadCorpus (6) |
| `tests/unit/wiki-query-make-retriever.test.js` | 7 | Factory contract: throw on bad input, size accounting, retrieval, filter, topK cap, empty, VERSION tag |
| `tests/integration/wiki-pipeline.test.js` | 7 | Round-trip 1 build-batch-input JSONL, 2 fixture markdown → retrieve, 3 fallback, 4 validator agreement |
| **Total new** | **43** | — |

## Fixed regressions in-flight

- `tests/unit/wiki-query-core.test.js` VERSION regex loosened from `/scaffold.*day26/` → `/scaffold.*day\d+/` after Day 27 bump to `scaffold-0.2.0-day27`. Not a behavioural regression; assertion tightness was the bug.

## Command

```bash
for i in 1 2 3; do
  echo "=== CoV $i ==="
  npx vitest run --reporter=default 2>&1 | grep -E "Test Files|Tests\s+[0-9]"
done
```

## Conclusion

Ratchet approved. `automa/baseline-tests.txt` updated to `12371`. No carry-over blockers from this CoV.
