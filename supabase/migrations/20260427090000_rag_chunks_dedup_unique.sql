-- Sprint S iter 7 close → iter 8 P0 entrance
-- Dedup rag_chunks duplicates from iter 7 delta re-run + add unique constraint
-- Apply: npx supabase db push --linked

BEGIN;

-- Step 1: Delete duplicates (keep first by created_at NULL last + lowest id)
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY source, content_raw
           ORDER BY created_at NULLS LAST, id
         ) AS rn
  FROM rag_chunks
)
DELETE FROM rag_chunks
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Step 2: Add unique constraint to prevent future duplicates
-- (source + content_raw combination must be unique)
ALTER TABLE rag_chunks
  ADD CONSTRAINT rag_chunks_source_content_unique
  UNIQUE (source, content_raw);

-- Step 3: Add index on metadata for chunk_index lookups (iter 8 Hybrid RAG)
CREATE INDEX IF NOT EXISTS idx_rag_chunks_metadata_chunk_index
  ON rag_chunks ((metadata->>'chunk_index'));

-- Step 4: Add fts column for BM25 italian (iter 8 P0 Hybrid RAG retriever)
ALTER TABLE rag_chunks
  ADD COLUMN IF NOT EXISTS content_fts tsvector
  GENERATED ALWAYS AS (to_tsvector('italian', content)) STORED;

CREATE INDEX IF NOT EXISTS idx_rag_chunks_content_fts
  ON rag_chunks USING gin(content_fts);

COMMIT;

-- Verification queries (run after apply):
-- SELECT COUNT(*) FROM rag_chunks; -- atteso ~1881 (post-dedup)
-- SELECT source, COUNT(*) FROM rag_chunks GROUP BY source ORDER BY COUNT(*) DESC LIMIT 10;
-- SELECT pg_size_pretty(pg_total_relation_size('rag_chunks'));
