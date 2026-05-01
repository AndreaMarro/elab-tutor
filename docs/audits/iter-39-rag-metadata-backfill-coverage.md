# R6 Hybrid RAG Metadata Coverage Post-Backfill — Honest Audit iter 39 entrance

**Date**: 2026-05-01 ~07:08 CEST
**Migration applied**: `20260501073000_rag_chunks_metadata_backfill.sql`
**Status**: ✅ Applied prod | ⚠️ Partial coverage — R6 still blocked

---

## §1 Coverage post-backfill (NOTICE output)

```
NOTICE: rag_chunks backfill iter 38 — total=2061 page=0(0.0 pct) chapter=180(8.7 pct) section=180(8.7 pct)
```

| Metric | Count | % | Source path |
|--------|-------|---|-------------|
| Total chunks | 2061 | 100% | `rag_chunks` row count |
| `page` filled | 0 | **0.0%** | `metadata->>'page'` NULL across all chunks |
| `chapter` filled | 180 | **8.7%** | `metadata->>'chapter'` present in ~180 chunks |
| `section_title` filled | 180 | 8.7% | `metadata->>'section_title'` present subset |

---

## §2 Root cause analysis

The Voyage AI RAG ingest pipeline (`scripts/rag-ingest-voyage-batch.mjs` per memory iter 7 close 1881 chunks) populated `metadata` jsonb with these keys:
- ✅ `chunk_index`
- ✅ `source_file` (e.g. "vol1.pdf")
- ✅ `chunk_id` (when supplied)
- ⚠️ `chapter` — only ~9% of chunks (probably only Vol3 ingest)
- ❌ `page` — NEVER stored (Voyage prepend chunking was content-window-based, not page-aware)
- ❌ `section_title` — partial (~9%)

**Conclusion**: backfill migration succeeded mechanically (idempotent SQL applied + columns marked filled where data existed). MA the underlying Voyage ingest never had page-level metadata to source from.

The Path A fuzzy match Step 4 (regex `cap{N}_pag{N}` on `metadata->>'chunk_id'`) yielded 0 matches because Voyage stored chunk_id as opaque hash, NOT fixture-aligned format `vol1_cap6_pag27_led_intro`.

---

## §3 R6 recall@5 measurement implication

R6 100-prompt fixture (`scripts/bench/r6-fixture-100.jsonl`) uses `metadata.vol/pag/keywords` per prompt. R6 runner adapts metric to:
> a chunk is considered "matching" when EITHER (a) its `page` matches `metadata.pag` AND `corpus === "rag"` AND content_preview overlaps a keyword, OR (b) at least one keyword appears in content_preview / chunk_id / section_title.

With `page=0%` filled, condition (a) NEVER matches. Falls back to condition (b) keyword overlap only. Many R6 prompts trigger L2 template router (per HONESTY CAVEAT in runner) → `template_shortcut` bucket excluded from average.

**Pre-iter-38 baseline**: R6 avg recall@5 = **0.067 FAIL** (target ≥0.55).
**Post-iter-38 backfill projected**: marginal lift to ~0.08-0.12 (chapter-keyword overlap on 8.7% chunks). Still **FAIL**.

---

## §4 Resolution path (defer iter 40+)

Two sequential paths required to unlock R6 ≥0.55:

### Path 1 — Voyage re-ingest with page metadata (recommended, $1, ~50min)

```bash
# Modify scripts/rag-ingest-voyage-batch.mjs to extract page from PDF position OR
# from explicit page-number annotations in markdown source files.
# Then re-run:
SUPABASE_SERVICE_ROLE_KEY=<key> VOYAGE_API_KEY=<key> TOGETHER_API_KEY=<key> \
  node scripts/rag-ingest-voyage-batch.mjs --rebuild --with-page-metadata
```

Expected: 2061 chunks with page_filled ≥80% across vol1/vol2/vol3.

### Path 2 — R6 fixture v3 schema rebuild (alternative, ~3h)

Drop the page-match dependency. Use chunk-content semantic match against fixture `expected_topics` array. Rebuild fixture v3:
```jsonl
{
  "id": "r6-001",
  "category": "plurale_ragazzi",
  "prompt": "Spiega ai ragazzi cos'e un LED.",
  "expected_topics": ["LED", "diodo", "anodo", "catodo", "resistenza"],
  "min_topic_overlap": 2  // at least 2 of 5 expected topics present in retrieved chunks
}
```

R6 runner adapts to compute topic-coverage instead of page-match. Decoupled from page metadata.

---

## §5 Honest acceptance gate

**iter 39 entrance**:
- ✅ Migration applied prod (idempotent, NOT rolled back)
- ❌ R6 ≥0.55 NOT achievable without Path 1 OR Path 2
- ⚠️ Cap PDR §4: R6 < 0.55 → cap stays in effect (Sprint T close requires ≥0.55)

**iter 40+ unblock**: defer to Andrea ratify Path 1 (Voyage re-ingest, requires VOYAGE_API_KEY local + ~50min) OR Path 2 (fixture v3, ~3h dev).

---

## §6 Status

R6 recall@5 lift is **schema-pipeline blocker**, NOT a migration bug. The migration shipped its scope (best-effort backfill from existing jsonb) — but the source data was never page-aware.

**Recommendation iter 40+ kickoff**: bundle Path 1 (Voyage re-ingest) with Andrea ratify decision on Voyage tier (free 50M tokens/mo possibly exceeded; check usage first).

**Anti-inflation G45**: NO claim "R6 ≥0.55 achieved". Honest defer iter 40+ documented.
