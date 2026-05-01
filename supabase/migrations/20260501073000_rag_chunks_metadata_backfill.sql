-- iter 38 carryover (iter 13 P0 prep) — RAG metadata backfill Path A fuzzy match
--
-- ROOT CAUSE (memory obs 1218): 100% of rag_chunks have chapter/page/section_title NULL
-- in production despite the columns existing per migration 20260426160000_rag_chunks_hybrid.sql.
-- The Voyage ingest pipeline (scripts/rag-ingest-voyage-batch.mjs) populated the metadata
-- jsonb field with `chunk_index`/`source_file`/etc but did NOT populate the typed columns,
-- so R6 hybrid RAG recall@5 measurement reads NULL and template-shortcuts score 0.000.
--
-- PATH A FIX (fuzzy match): backfill from chunk_id pattern `vol{N}_cap{N}_pag{N}_*` OR
-- from metadata jsonb keys `page`/`chapter`/`section_title` if present.
--
-- This migration is IDEMPOTENT (uses COALESCE guards) and can be re-run safely.
-- Apply via: SUPABASE_ACCESS_TOKEN="<token>" npx supabase db push --linked
--
-- iter 38 owner: orchestrator inline (Maker-1 BG agent unavailable post org limit)

BEGIN;

-- Step 1: Backfill page from metadata jsonb if available (Voyage ingest may have written it)
UPDATE rag_chunks
SET page = COALESCE(page, NULLIF(metadata->>'page', '')::int)
WHERE page IS NULL AND metadata->>'page' IS NOT NULL;

-- Step 2: Backfill chapter from metadata jsonb if available
UPDATE rag_chunks
SET chapter = COALESCE(chapter, NULLIF(metadata->>'chapter', '')::int)
WHERE chapter IS NULL AND metadata->>'chapter' IS NOT NULL;

-- Step 3: Backfill section_title from metadata jsonb if available
UPDATE rag_chunks
SET section_title = COALESCE(section_title, NULLIF(metadata->>'section_title', ''))
WHERE section_title IS NULL AND metadata->>'section_title' IS NOT NULL;

-- Step 4: Path A fuzzy match via metadata->>'chunk_id' if Voyage ingest stored it
-- Schema (20260426160000_rag_chunks_hybrid.sql): NO `chunk_id` column on table.
-- Fuzzy fallback uses jsonb `metadata->>'chunk_id'` IF present (fixture-aligned ingest).
UPDATE rag_chunks
SET
  chapter = COALESCE(chapter, NULLIF(substring(metadata->>'chunk_id' from 'cap(\d+)'), '')::int),
  page    = COALESCE(page,    NULLIF(substring(metadata->>'chunk_id' from 'pag(\d+)'), '')::int)
WHERE (chapter IS NULL OR page IS NULL)
  AND metadata->>'chunk_id' IS NOT NULL
  AND metadata->>'chunk_id' ~ 'cap\d+_pag\d+';

-- Step 5: Source canonical normalization — `vol1`/`vol2`/`vol3` lowercase
UPDATE rag_chunks
SET source = lower(source)
WHERE source ~ '^Vol[123]$' OR source ~ '^VOL[123]$';

-- Step 6: Coverage report (idempotent SELECT, written to migration log)
DO $$
DECLARE
    total_count int;
    page_filled int;
    chapter_filled int;
    section_filled int;
    by_source text;
BEGIN
    SELECT COUNT(*) INTO total_count FROM rag_chunks;
    SELECT COUNT(*) INTO page_filled FROM rag_chunks WHERE page IS NOT NULL;
    SELECT COUNT(*) INTO chapter_filled FROM rag_chunks WHERE chapter IS NOT NULL;
    SELECT COUNT(*) INTO section_filled FROM rag_chunks WHERE section_title IS NOT NULL;

    RAISE NOTICE 'rag_chunks backfill iter 38 — total=% page=%(% pct) chapter=%(% pct) section=%(% pct)',
        total_count,
        page_filled, ROUND((page_filled::numeric / NULLIF(total_count, 0)::numeric) * 100, 1),
        chapter_filled, ROUND((chapter_filled::numeric / NULLIF(total_count, 0)::numeric) * 100, 1),
        section_filled, ROUND((section_filled::numeric / NULLIF(total_count, 0)::numeric) * 100, 1);
END $$;

COMMIT;

-- Post-migration verify (run separately):
--   SELECT source,
--          COUNT(*) AS total,
--          COUNT(page) AS page_filled,
--          COUNT(chapter) AS chapter_filled
--     FROM rag_chunks
--    GROUP BY source
--    ORDER BY source;
--
-- Expected post-backfill (R6 recall@5 ≥0.55 unblock):
--   - vol1: ~700 rows, page_filled ≥80%, chapter_filled ≥80%
--   - vol2: ~600 rows, page_filled ≥80%, chapter_filled ≥80%
--   - vol3: ~400 rows, page_filled ≥80%, chapter_filled ≥80%
--   - wiki: ~180 rows, page_filled NULL acceptable (wiki concepts have no page anchor)
