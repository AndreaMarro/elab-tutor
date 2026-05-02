---
id: ADR-034 (rag-page-metadata-extraction-strategy)
supersedes: none
collision_resolution: renamed from ADR-033 to ADR-034 (existing ADR-033-onniscenza-v2-cross-attention-budget.md REVERTED V1 commit 02b5c03 retained for historical record)
title: RAG page metadata extraction strategy for Voyage re-ingest pipeline
status: PROPOSED
date: 2026-05-02
authors:
  - Andrea Marro
  - Architect Opus subagent (Phase 2 Agent A)
sprint: T close — Phase 2 PRINCIPIO ZERO Vol/pag verbatim 95%
context-tags:
  - rag-ingest
  - page-metadata
  - voyage-re-ingest
  - r6-recall-blocker
  - r7-canonical-citation-blocker
  - principio-zero-vol-pag-verbatim
related:
  - ADR-015 (Hybrid RAG retriever BM25+dense+RRF k=60) — consumer of page metadata in citation post-filter
  - ADR-021 (Box 3 RAG 1881 chunks coverage redefine prep) — predecessor on coverage scope
  - ADR-027 (Volumi narrative refactor schema) — chapter/section taxonomy
  - PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md §Phase 2 (entrance gate)
namespace-note: |
  An ADR-033 already exists at `docs/adrs/ADR-033-onniscenza-v2-cross-attention-budget.md`
  (Onniscenza V2 cross-attention budget, REVERTED V1 per commit 02b5c03). This ADR ships
  under a separate filename (`ADR-033-rag-page-metadata-extraction-strategy.md`) per
  Andrea explicit Phase 2 output spec. Numbering collision SHOULD be resolved at Phase 7
  ratify (rename to ADR-034 if both kept; OR supersede the Onniscenza V2 ADR with the
  REGRESSION REVERT note already documented). Andrea ratify queue item 0 below.
input-files:
  - scripts/rag-ingest-voyage-batch.mjs (180 LOC, iter 7 — current ingest, no page extraction)
  - supabase/migrations/20260501073000_rag_chunks_metadata_backfill.sql (Path A backfill, 87 LOC)
  - docs/audits/iter-39-rag-metadata-backfill-coverage.md (2026-05-01 NOTICE: page=0% chapter=8.7%)
  - docs/audits/PHASE-0-baseline-2026-05-02.md §7 (page filled 0/2061 = 0.0%)
  - docs/audits/PHASE-0-discovery-2026-05-02.md §1 finding 5 (R6 page=0% structural blocker)
  - /VOLUME 3/CONTENUTI/volumi-pdf/VOL1_ITA_ COMPLETO V.0.1 GP.pdf (27.7 MB, source of truth Vol1)
  - /VOLUME 3/CONTENUTI/volumi-pdf/VOL2_ITA_COMPLETO GP V 0.1.pdf (17.6 MB, source of truth Vol2)
  - /VOLUME 3/CONTENUTI/volumi-pdf/Manuale VOLUME 3 V0.8.1.pdf (18.2 MB, source of truth Vol3)
  - /VOLUME 3/CONTENUTI/volumi-pdf/vol{1,2,3}.txt (current ingest input, page boundaries lost)
output-files:
  - docs/adrs/ADR-033-rag-page-metadata-extraction-strategy.md (this file)
  - HANDOFF Maker-1 B atom: scripts/rag-ingest-voyage-batch-v2.mjs (NEW, owned by Maker-1)
  - HANDOFF Migration: supabase/migrations/{ts}_rag_chunks_page_metadata_v2.sql (NEW, owned by Maker-1)
  - HANDOFF Tester-2 atom: docs/audits/{ts}_rag_page_coverage_verify.md (NEW, post re-ingest)
---

# ADR-033 — RAG page metadata extraction strategy

> Restore `metadata.page` (and refine `metadata.volume_id` / `metadata.chapter` / `metadata.section_title`) on the Voyage re-ingest pipeline so PRINCIPIO ZERO Vol/pag verbatim 95% becomes measurable, R6 recall@5 exits the 0.067 floor, and R7 canonical citations stop falling back to opaque content_preview heuristics.

---

## 1. Status

**PROPOSED** 2026-05-02 — Andrea ratify required before Maker-1 spawns the B atom (`scripts/rag-ingest-voyage-batch-v2.mjs`). No code or DB change is committed by this ADR; it only fixes the strategy.

This ADR is **architecture-only**. Implementation specification (CLI flags, exact SQL, error-mode handling at the byte level) belongs to the Maker-1 atom and is intentionally NOT redacted here per the architect/maker separation enforced since Pattern S iter 5.

---

## 2. Context

### 2.1 The page=0% blocker — measured, not estimated

Per `docs/audits/PHASE-0-baseline-2026-05-02.md:21` (§7) and the NOTICE block in
`docs/audits/iter-39-rag-metadata-backfill-coverage.md:11-13`, the production
`rag_chunks` table contains:

| Field | Filled | % | Required for |
|-------|--------|---|--------------|
| total chunks | 2061 | 100% | — |
| `metadata->>'page'` | **0** | **0.0%** | R6 page-match condition (a); R7 Vol/pag verbatim citation; Hybrid retriever post-filter |
| `metadata->>'chapter'` | 180 | 8.7% | Hybrid retriever chapter-aware boost; Onniscenza L1 chunk ordering |
| `metadata->>'section_title'` | 180 | 8.7% | Citation human-readable label; Cycle-2 fallback ordering |

The Path A backfill migration (`supabase/migrations/20260501073000_rag_chunks_metadata_backfill.sql:50-69`) ran successfully and is idempotent, but the `page` column did not move because the **source data never had page boundaries to recover**:

- `scripts/rag-ingest-voyage-batch.mjs:35-43` chunks raw `vol{N}.txt` by `CHUNK_SIZE = 500` chars with `CHUNK_OVERLAP = 100` (line 30-31). The text files are flat poppler exports (`/VOLUME 3/CONTENUTI/volumi-pdf/vol{1,2,3}.txt`, 80–118 KB each — see `ls -la` evidence in §10) with no form-feed delimiters and no page anchors.
- `scripts/rag-ingest-voyage-batch.mjs:88-95` writes only `chunk_index`, `char_start`, `char_end`, `source_type` into `metadata`. No `page`, no `chapter`, no `section_title`.
- The Path A migration Step 4 (`...metadata_backfill.sql:37-43`) tries to recover via fuzzy regex `cap(\d+)` / `pag(\d+)` over `metadata->>'chunk_id'`, but the ingest never wrote `chunk_id` in fixture-aligned format — so 0 rows match.

### 2.2 Two downstream gates this blocker freezes

**R6 recall@5 = 0.067 (target ≥ 0.55)** — `docs/audits/PHASE-0-baseline-2026-05-02.md:18` and `iter-39-rag-metadata-backfill-coverage.md:42-48`. The R6 fixture honors a chunk as "matching" iff (a) `page == metadata.pag` AND keyword overlap, OR (b) keyword in content_preview. With (a) structurally impossible (page is always NULL), only (b) fires; 48/100 prompts fall through to L2 template_shortcut and are excluded from the average; the residual 52 score 0.067 on keyword overlap alone.

**R7 canonical citation = 3.6% / combined 46.2% (target canonical ≥80%)** — `PHASE-0-discovery-2026-05-02.md:80` and `PHASE-0-baseline-2026-05-02.md:19`. Even when the L2 router is widened, `[INTENT:cite]` calls cannot bind a real page number and the model hallucinates "pag. <text excerpt>" instead of "pag. 42" — visible 20/20 in the Sprint U Cycle 1 audit (`PHASE-0-discovery-2026-05-02.md:97`).

### 2.3 Why backfill alone cannot fix this

The Path A migration is correct as a salvage step (idempotent, additive, COALESCE-guarded). It moved chapter from 0% → 8.7% by reading whatever the Voyage ingest happened to write. There is **no jsonb key, no `chunk_id` pattern, no derivable signal** in the existing 2061 chunks that encodes which printed page each piece of text came from. The information was destroyed at the flat-text export step and the chunker never had it.

Recovering page metadata therefore requires **re-extracting from the source PDFs** with a page-aware loop, then re-running the Voyage embedding pipeline. The cost (~$1, ~50min) and complexity (one extraction script + one ingest pass + one verify) are bounded; the only question this ADR resolves is **which extraction tool**.

---

## 3. Decision drivers

In priority order (highest first), drivers for choosing among Options A/B/C below:

1. **Extraction accuracy on the three real volumes** — measured by spot-checking ≥5 sample pages per volume against the printed copy held by Andrea, with an explicit calibration table for cover pages / ToC offset (see §8 Risk 1). Coverage gate ≥ 80% page-filled is a hard gate (`PHASE-0-baseline-2026-05-02.md:21`); accuracy is the upstream condition.
2. **Idempotency and re-runnability** — the script must produce identical chunk hashes and `metadata.page` values on a second run with the same PDFs (so re-running after a wiki-only delta does not nuke the volumes). This drives toward deterministic page numbering (1-based PDF page index, calibrated once) over OCR confidence sampling.
3. **Cost / time stay inside the existing iter 38 carryover budget** — Voyage tier limits 50min wall-clock and ~$1 Together contextualization budget per `iter-39-rag-metadata-backfill-coverage.md:56-66` are already allocated. The extraction step must add ≤ 5min wall-clock on M4 MPS and zero net token cost (no LLM in extraction).
4. **Dependency footprint on Andrea M4 / Mac Mini autonomous environment** — must run with tooling already trusted in the repo or installable via brew/npm without GPU. No new Python venv beyond what `scripts/rag-ingest-local.py` (deferred path, `iter-39-rag-metadata-backfill-coverage.md:60-66`) implies. No native compilers required for first-time setup.
5. **Error modes are observable + recoverable** — every extraction failure (encrypted PDF, image-only page, malformed font) must surface with the offending page number so Andrea can repair manually OR exclude that page from the corpus; silent zero-text returns are a hard reject criterion.

Secondary drivers (tie-breakers): tooling stability across Apple Silicon major version bumps; the same tool being usable later for image-extraction (figures, schematics) without re-architecture.

---

## 4. Options analysis

The options below extract page-aware text from `/VOLUME 3/CONTENUTI/volumi-pdf/` and feed the chunker with `{text, page}` records. The chunker (`scripts/rag-ingest-voyage-batch.mjs:35-43`) is then minimally amended to forward `page` into `metadata` (Maker-1 atom B).

### 4.1 Option A — `pdfjs-dist` (Node, JavaScript native)

Library: `pdfjs-dist` (Mozilla). Used as Node module from a Maker-1 owned script `scripts/rag-ingest-voyage-batch-v2.mjs`.

- **Approach**: load the PDF, iterate `pdfDocument.numPages`, call `getPage(n).getTextContent()` per page, concatenate text items by reading order, emit `{volume_id, page: n, text}`. Chunk per page (boundaries collapse to a primary page) before passing to contextualizer.
- **Accuracy expectation on these 3 PDFs**: high for Vol1+Vol2 (digital-native), moderate for Vol3 (mixed; the file is `Manuale VOLUME 3 V0.8.1.pdf` 18 MB — DRAFT v0.8.1, may have late-stage edits). Reading-order quirks on multi-column layouts and sidebars are the main accuracy risk; spot-check protocol in §6.A.
- **Cost / time M4 MPS**: ~10–30s per volume, single-threaded, pure JS. No GPU, no cloud.
- **Idempotency**: deterministic — page index is the PDF page count, identical across runs.
- **Error modes**: rendering exceptions surface as caught errors per page (try/catch around `getPage(n)`); image-only pages return empty text (handler can log and skip OR fall back to a placeholder chunk).
- **Dependency footprint**: one `npm install pdfjs-dist` (~3 MB unpacked). Runs in same Node toolchain as the existing `rag-ingest-voyage-batch.mjs`. Andrea ratify needed for new dep per CLAUDE.md "MAI aggiungere dipendenze npm senza approvazione di Andrea" — explicitly listed in §9 Andrea ratify queue.
- **Pros**: same language as existing ingest (one-process pipeline, easy delta inspection); maintained by Mozilla; works without native compile; trivial to reason about page boundaries.
- **Cons**: reading-order on text in figures/footers can leak across pages if not filtered; needs a small wrapper to dedupe header/footer chrome.

### 4.2 Option B — `pdftotext` (poppler-utils CLI)

Tool: `pdftotext -layout -f N -l N <pdf> -` invoked once per page from Node via `child_process.execFile` (parameterized, NOT shell-string concatenation; see Risk 5).

- **Approach**: spawn one child per page; capture stdout; emit `{volume_id, page: n, text}`. Same downstream chunking as Option A.
- **Accuracy expectation**: poppler is the same engine that produced the existing `vol{1,2,3}.txt` flat dumps (per `iter-39-rag-metadata-backfill-coverage.md:56` reference and `pdftotext` lineage in CLAUDE.md "Volumi fisici" rule). Layout mode (`-layout`) preserves columns better than default; page-by-page invocation guarantees boundaries are correct by construction.
- **Cost / time M4 MPS**: ~50ms × ~200 pages × 3 vols ≈ 30s wall-clock per ingest. Fork overhead per page is the dominant cost; trivially below the 50min Voyage budget.
- **Idempotency**: deterministic across same poppler version.
- **Error modes**: non-zero exit per page is captured per invocation. CLI errors surface stderr; encrypted PDFs return error code 1; image-only pages return empty stdout (same handler path as A).
- **Dependency footprint**: requires `brew install poppler` on M4. Andrea-trusted (already used to produce `vol{1,2,3}.txt` per CLAUDE.md "Testo estratto" rule). No npm dep, no Python venv.
- **Pros**: Andrea can re-run any single page from the shell to diff against PDF reader output; matches the text format already in the corpus (so re-ingest does not silently shift word boundaries against the embeddings already trained on poppler output); zero new deps inside Node.
- **Cons**: per-page child spawn is wasteful (~30s vs ~10s); shell-safe path handling required (note the space in `VOL1_ITA_ COMPLETO V.0.1 GP.pdf`); loses figure positions vs A.

### 4.3 Option C — `pypdf` / `pdfplumber` (Python script + JSON output)

Tool: a small Python 3.11 script (`scripts/extract-pages-py.py` — Maker-1 atom B sub-deliverable) that emits `[{volume_id, page, text}, ...]` JSON to stdout, consumed by the Node ingest.

- **Approach**: `for page_num, page in enumerate(reader.pages, start=1): yield {page: page_num, text: page.extract_text() or ""}`. JSON dumped once per volume.
- **Accuracy expectation**: pypdf reading-order is generally weaker than poppler's `-layout` mode on multi-column. `pdfplumber` (built on pypdf) has stronger heuristics but doubles the dep weight. CLAUDE.md "Volumi fisici" rule already canonicalizes poppler output, which biases against introducing a different extractor mid-corpus.
- **Cost / time M4 MPS**: ~5–10s per volume (in-process Python, no fork-per-page).
- **Idempotency**: deterministic per pypdf version, but cross-language toolchain adds a version pin surface.
- **Error modes**: pypdf raises specific exceptions per page; JSON delimits failures clearly. `extract_text()` returning `None` is the silent-failure mode (drivers §3.5 hard reject) and must be promoted to an error log entry.
- **Dependency footprint**: Python 3.11 venv + pip pypdf. Per `iter-39-rag-metadata-backfill-coverage.md:60-66` and CLAUDE.md "Volumi fisici" §"pdftotext", Python is **not** the primary toolchain in this repo; introducing it for one extractor adds a maintenance vector.
- **Pros**: pdfplumber gives bounding-box positions (useful later for figure linking); ecosystem (pypdf maintained, large community).
- **Cons**: cross-language interface (Node ⇄ Python JSON); two languages to debug under autonomous Mac Mini cron; word-boundary drift vs the poppler-based legacy `vol{N}.txt` could disturb embedding similarity assumptions on chunks that survive overlap windows; no first-class Andrea ratify precedent (vs poppler which is already trusted).

---

## 5. Recommended decision — **Option B (`pdftotext` poppler CLI)**

### 5.1 Rationale grounded in §3 drivers

- **Driver 1 (accuracy)** — poppler is the same extractor that produced the trusted text in `/VOLUME 3/CONTENUTI/volumi-pdf/vol{1,2,3}.txt`. Re-extracting page-by-page with the same engine **prevents word-boundary drift against the existing chunk content** that the Hybrid retriever (ADR-015) already tunes against. Switching to A or C would silently shift token boundaries in ways the bench can't detect.
- **Driver 2 (idempotency)** — `pdftotext -f N -l N` is deterministic per (PDF, poppler version). Pinning poppler in a calibration record (Andrea ratify item §9.4) bounds drift risk.
- **Driver 3 (cost / time)** — ~30s per volume × 3 vols = ~90s extraction overhead, well inside the 50min Voyage budget.
- **Driver 4 (dependency footprint)** — `brew install poppler` is already implicit in CLAUDE.md "Volumi fisici → pdftotext". No new npm dep, no new venv; this avoids the explicit "MAI aggiungere dipendenze npm senza approvazione di Andrea" gate (CLAUDE.md "Qualita'" §13).
- **Driver 5 (error modes)** — per-page invocation produces per-page exit codes. Encrypted/image-only pages are isolated; the surrounding pages still ingest. Andrea can `pdftotext -f 42 -l 42 vol1.pdf -` from a terminal to reproduce any single failure.

### 5.2 Trade-offs accepted

- The per-page child-spawn overhead (~30s/vol total) is wasted compared to Option A's in-process iteration. **Accepted** because driver 1 (accuracy parity) and driver 4 (no new dep) outweigh ~90s of one-time extraction cost.
- Multi-column reading order in Vol3 mid-section may be inferior to pdfjs-dist's structured output. **Accepted** because the printed copy reads in the same order as `-layout`, and PRINCIPIO ZERO citations target page numbers (not in-page coordinates); column drift inside a page does not move the page number.
- Future figure / schematic extraction will need a separate tool. **Accepted** as out-of-scope for ADR-033 (which is page metadata only).

### 5.3 Anti-pattern guard

This ADR explicitly **does not claim**: (a) Voyage re-ingest "will pass ≥80% page coverage" until the calibration §8 risk 1 is closed and the verify SQL §7.3 reports ≥80% on real data; (b) R6 recall@5 will lift to ≥ 0.55 on the very next bench (the page metadata is necessary, not sufficient — keyword overlap and L2 template scope reduction are independent factors). G45 cap §11 references must be honored at every projection.

---

## 6. Implementation plan (phased, owned by Maker-1 B atom)

This ADR scopes architecture only. The following four phases delineate the handoff to Maker-1 so the architect/maker separation stays clean.

### Phase A — extraction script standalone test on a single PDF
- Maker-1 produces `scripts/extract-pages-pdftotext.mjs` (or inlines the loop into v2 ingest), runs it against `VOL1_ITA_ COMPLETO V.0.1 GP.pdf` (note the space in the filename — see Risk 5), emits `{volume_id: 1, page, text}[]` to stdout JSON.
- Acceptance for Phase A: 5 sample pages across Vol1 (cover, ToC, mid-cap6, schematic-heavy, last printed) hand-verified by Andrea against the printed copy. Page count of script output equals `pdfinfo VOL1_ITA_… | grep Pages`.

### Phase B — integrate into `scripts/rag-ingest-voyage-batch-v2.mjs`
- Maker-1 forks `scripts/rag-ingest-voyage-batch.mjs` to v2. Replaces the flat-text reader (`fs.readFileSync(SOURCES[vol])` line 144) with the page-aware extractor from Phase A. Chunker (`chunkText` lines 35-43) gains a `page` parameter and emits `metadata.page` (single primary page; multi-page chunk strategy per §8 Risk 2).
- The `metadata.volume_id` (1|2|3) and `metadata.chapter` (string e.g. "cap6") and `metadata.section_title` (string) MUST be present; the chapter detector reuses the regex pattern already in the Path A backfill SQL (`cap(\d+)`).
- Wiki ingest (`SOURCES.wiki`, lines 28 + 150–158) is untouched — wiki concepts have no page anchor (`metadata_backfill.sql:86`).

### Phase C — idempotent page-metadata migration
- Maker-1 ships `supabase/migrations/{ts}_rag_chunks_page_metadata_v2.sql`, a sibling/successor to `20260501073000_rag_chunks_metadata_backfill.sql`. The migration: (a) ADDS no new columns (the schema already supports `metadata->>'page'` jsonb; per the existing migration COALESCE pattern, idempotent additive); (b) records a coverage NOTICE post-re-ingest using the same RAISE NOTICE pattern as `metadata_backfill.sql:50-69`. The migration MUST NOT delete or rewrite existing rows — re-ingest is an UPSERT path on `(source, chunk_index)` performed by the Maker-1 v2 script, not by the SQL.

### Phase D — re-ingest validation
- Maker-1 runs the v2 ingest (Voyage 3 RPM batch 15, ~50min, ~$1) with `VOYAGE_API_KEY` + `TOGETHER_API_KEY` + `SUPABASE_SERVICE_ROLE_KEY` provisioned by Andrea.
- Coverage verify SQL §7.3 runs immediately after.
- Tester-2 atom (separate from Maker-1) runs R6 + R7 re-bench with the new `metadata.page` available and reports the delta. **No claim of "≥80% achieved" appears until the SQL output is captured in `docs/audits/{ts}_rag_page_coverage_verify.md`.**

---

## 7. Test strategy

### 7.1 Unit — page extraction accuracy
For each volume (Vol1, Vol2, Vol3), 5 sample pages are extracted via the Phase A script and diffed against a hand-typed extract of the printed copy:
- Cover / first content page (calibration anchor — see §8 Risk 1)
- Table of Contents page
- A schematic-heavy page (Vol1 cap6 LED, Vol2 cap8 MOSFET, Vol3 cap8 Serial)
- A pure-prose page mid-volume
- Last printed page

Pass criterion: ≥ 90% token overlap (Jaccard on whitespace tokens) between extractor output and the hand-typed reference. Any page below 90% is logged and either repaired manually OR excluded from the corpus by Andrea ratify.

### 7.2 Integration — single-chapter end-to-end
Restrict the v2 ingest to a single chapter (Vol1 cap6 LED) via a CLI flag. Run, measure: number of chunks emitted, distribution of `metadata.page` values, presence of `metadata.chapter == "cap6"`, embedding count returned by Voyage. Compare against the existing iter-7 ingest of the same chapter (same total chunk order modulo page-aware splits).

### 7.3 Coverage verification SQL
Run after Phase D ingest completes:
```sql
SELECT
  COUNT(*)                                                                AS total,
  COUNT(*) FILTER (WHERE metadata->>'page'          IS NOT NULL)          AS page_filled,
  ROUND(100.0 * COUNT(*) FILTER (WHERE metadata->>'page' IS NOT NULL)
              / NULLIF(COUNT(*), 0), 1)                                   AS page_pct,
  COUNT(*) FILTER (WHERE metadata->>'chapter'       IS NOT NULL)          AS chapter_filled,
  COUNT(*) FILTER (WHERE metadata->>'volume_id'     IS NOT NULL)          AS volume_filled,
  COUNT(*) FILTER (WHERE metadata->>'section_title' IS NOT NULL)          AS section_filled
FROM rag_chunks
WHERE source IN ('vol1','vol2','vol3');
```

Acceptance gate Phase 2: `page_pct >= 80.0`. Wiki rows (`source NOT IN ('vol1','vol2','vol3')`) are excluded from the gate per `metadata_backfill.sql:86`.

### 7.4 Anti-regression
The Hybrid retriever unit tests (per ADR-015) must continue to pass after re-ingest. Vitest `13474 PASS` baseline (`PHASE-0-baseline-2026-05-02.md:14`) MUST be preserved by the Maker-1 atom — re-ingest is a data change, not a code change, but any chunker fork v2 that touches shared modules MUST go through the standard pre-commit hook.

---

## 8. Risks and mitigations

### Risk 1 — PDF page numbering vs printed page numbering offset (cover, ToC, blank)
The PDF page index is 1-based from the front cover; the printed page numbering typically starts at "1" several pages in. PRINCIPIO ZERO Vol/pag verbatim 95% targets the **printed** number, not the PDF index. Mitigation:
- Maker-1 builds a per-volume **calibration table** (1 row × 3 volumes) recording `{volume_id, pdf_page_of_printed_1, max_printed_page, notes_on_unnumbered_pages}`. Andrea fills this table by hand from the printed copy; without it, no ingest runs.
- The v2 ingest writes both `metadata.page` (printed) and `metadata.pdf_page` (1-based PDF index). Citations cite the printed; debugging uses the PDF index.
- Calibration values are stored in `scripts/rag-ingest-config.json` (NEW, owned by Maker-1) and version-controlled. Drift risk is bounded to "Andrea typed the wrong number once."

### Risk 2 — Multi-page chunks (long sections span pages)
A `CHUNK_SIZE = 500` chars chunk can straddle a page boundary, especially in prose-heavy sections. Per the Phase 0 finding that R6 condition (a) requires a single page match, the v2 ingest writes a **primary page** field (the page where the majority of the chunk's characters sit) plus an optional `metadata.pages_spanned: int[]` list. Mitigation:
- Default chunking strategy: page-respecting splits — a chunk never crosses a page boundary; if the residual at end of a page is < 100 chars (the existing minimum from `rag-ingest-voyage-batch.mjs:39`), it is dropped (same behavior as today).
- This raises chunk count modestly (estimate +5–10% across 1881 → ~1980-2070 chunks). Voyage budget already reserved for 2061; well within free tier 50M tokens/mo.

### Risk 3 — Voyage rate limit 3 RPM batch 15 — 50min budget
Per `rag-ingest-voyage-batch.mjs:32-33` and §3 driver 3, the existing 50min budget is preserved as long as Phase A extraction stays under 5min. Mitigation:
- Phase A extraction is sequential per page but parallelizable across volumes if needed (Node `Promise.all` over the 3 volumes); on M4 the full extraction is ~90s and parallelization is unnecessary.
- The Voyage embedding step in v2 is byte-identical to v1 (same `embedBatch` body, lines 64-72), so rate-limit characteristics are preserved.

### Risk 4 — Vol3 is DRAFT v0.8.1
The Vol3 PDF filename is `Manuale VOLUME 3 V0.8.1.pdf` — a draft version per `ls -la` evidence. Re-ingesting against a draft means future final-version Vol3 will require a re-re-ingest. Mitigation: ADR-027 (Vol3 narrative refactor) is the Davide co-author track; ADR-033 v2 ingest is **scoped to the draft** explicitly, with a re-ingest planned at Vol3 v1.0 release. Recorded in §10 cross-references.

### Risk 5 — Filename whitespace / accents in PDF paths
`VOL1_ITA_ COMPLETO V.0.1 GP.pdf` contains a space inside the basename. Mitigation: the Maker-1 atom B uses the parameterized child-process API (argv array, NOT a single command string) so the path arrives at poppler as one argv slot regardless of whitespace; paths are sourced from `scripts/rag-ingest-config.json` rather than constructed via string concatenation. This rule is also applied to the existing repo helper `src/utils/execFileNoThrow` family wherever applicable.

---

## 9. Acceptance gates Phase 2 alignment + Andrea ratify queue

### 9.1 Acceptance gates Phase 2 (this ADR)

- ADR-033 status PROPOSED at commit time of this file.
- ADR is read-only architecture. No script, SQL, or env change introduced by ADR-033 itself.
- Maker-1 B atom handoff is unambiguous: §6 phases A–D are fully scoped without re-reading this ADR.
- The "anti-pattern" guard §5.3 is explicit: no projection becomes a claim until §7.3 SQL output exists.

### 9.2 Andrea ratify checklist (5 items)

| # | Checkpoint | Why |
|---|------------|-----|
| 0 | **Numbering collision: rename this ADR to ADR-034 OR mark `ADR-033-onniscenza-v2-cross-attention-budget.md` as SUPERSEDED.** | Two ADR-033 files coexist on disk (per `ls docs/adrs/`). The Onniscenza V2 ADR is documented REVERTED V1 per commit `02b5c03`. Andrea decides which gets the canonical 033 slot before Maker-1 references this ADR by number. |
| 1 | **Provision env keys for Phase D**: `VOYAGE_API_KEY` (Voyage account), `TOGETHER_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Supabase Dashboard). Confirm Voyage free tier 50M tokens/mo not exhausted (`iter-39-rag-metadata-backfill-coverage.md:100`). | Re-ingest cannot start without these; ADR-033 is otherwise blocked at Maker-1 atom. |
| 2 | **Approve `npm install pdfjs-dist` IF Option A is later substituted; else N/A under Option B (poppler `brew install`).** Per CLAUDE.md "MAI aggiungere dipendenze npm senza approvazione di Andrea" §13. | Option B (recommended) needs only `brew install poppler` and Andrea has used it (CLAUDE.md "Volumi fisici" rule). Andrea ratifies the choice on record. |
| 3 | **Confirm $1 cost cap and 50min wall-clock cap** for the Phase D re-ingest (Voyage embeddings free + Together Llama 3.3 70B contextualization ~$1 per `iter-39-rag-metadata-backfill-coverage.md:56-66`). Andrea has the option to cap at ≤ $2 for headroom on retries. | Cost discipline per CLAUDE.md "Anti-regressione FERREA" + Mac Mini autonomous cost discipline. |
| 4 | **Idempotency / rollback ack**: confirm that the v2 ingest does NOT delete existing rows, only UPSERTs by `(source, chunk_index)`; and that a rollback path exists (DELETE from `rag_chunks` WHERE source IN ('vol1','vol2','vol3') + re-run v1 if v2 fails). Captured in §7 + Phase C. | Anti-pattern G45: never claim irreversible re-ingest is "safe" without an explicit revert path. |
| 5 | **Page coverage gate ≥ 80%**: confirm the §7.3 SQL output is the gate signal, not an internal Maker-1 estimate or commit message. Without this, no claim of Phase 2 page-metadata completion. | Phase 2 entrance gate per `PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md` Phase 2 + `PHASE-0-baseline-2026-05-02.md:21` target. |

---

## 10. Cross-references

- **ADR-015** (Hybrid RAG retriever BM25+dense+RRF k=60, 2026-04-27) — the consumer of `metadata.page`. Once page metadata is restored, ADR-015 §4 schema citation post-filter switches from "match content_preview keywords" to "match `(volume_id, page)` exact". This ADR is a precondition for ADR-015 reaching its design intent.
- **ADR-021** (Box 3 RAG 1881 chunks coverage redefine prep) — predecessor on RAG coverage scope. ADR-021 set the 1881-chunk corpus as the canonical extent; ADR-033 is the missing field within that extent.
- **ADR-027** (Volumi narrative refactor schema, Davide co-author iter 33+ deferred) — chapter / section taxonomy. ADR-033 emits `metadata.chapter` strings (e.g. `"cap6"`); ADR-027's eventual schema may rename or refine these (e.g. `"v1-cap6-led"`). Coordination point: the `chapter` regex in v2 ingest must be updatable without re-ingest if ADR-027 lands.
- **PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md §Phase 2** — the parent plan. ADR-033 is the Phase 2 entrance architecture deliverable.
- **`docs/audits/iter-39-rag-metadata-backfill-coverage.md`** §3-§5 — the Path A migration audit, which §2 of this ADR cites as the page=0% root cause evidence.
- **`docs/audits/PHASE-0-discovery-2026-05-02.md`** §1 finding 5 + §7 anti-pattern 13 — the Phase 0 discovery's R6 page=0% structural blocker call-out + the explicit "NO Voyage re-ingest skip" anti-pattern that this ADR fulfills.
- **`docs/audits/PHASE-0-baseline-2026-05-02.md`** §7 + §11 anti-pattern 2 — the measured baseline `page filled 0/2061` and the anti-pattern "R6 ≥0.55 unblock by metadata backfill iter 38" claim that ADR-033's re-ingest path replaces with measured Phase D output.
- **`scripts/rag-ingest-voyage-batch.mjs`:35-95** — the v1 ingest, source for the v2 fork. v2 owns `scripts/rag-ingest-voyage-batch-v2.mjs` (NEW under Maker-1).
- **`supabase/migrations/20260501073000_rag_chunks_metadata_backfill.sql`** — the Path A backfill, kept in place. The v2 page-metadata migration is additive sibling, not replacement.

---

**End ADR-033 — RAG page metadata extraction strategy (PROPOSED 2026-05-02)**

Maker-1 B atom is now fully scoped. Architect handoff complete pending Andrea ratify queue items 0–5 in §9.2. No code committed by this ADR.
