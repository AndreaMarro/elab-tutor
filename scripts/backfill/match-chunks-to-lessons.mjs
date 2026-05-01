// ELAB Iter 14 P0 — Fuzzy match helpers for RAG metadata backfill
//
// Strategy (Path A):
//   1. For each chunk.content_raw, find best lesson in volume-references.js
//   2. Filter candidates by chunk.source ('vol1' → only v1-* lessons)
//   3. Score = max overlap of:
//        a) bookText substring containment (weight 0.5)
//        b) bookInstructions token overlap (weight 0.3)
//        c) chapter title token overlap (weight 0.2)
//   4. Best candidate wins; tie-break by lower bookPage (earlier in book)
//
// NOTE: this is intentionally SIMPLE. Path B (re-ingest with PDF page tracking)
//       is the proper fix; this is the iter-14 12h-budget compromise.

const VOLUME_PREFIX = { vol1: 'v1-', vol2: 'v2-', vol3: 'v3-' };

// ─────────────────────────────────────────────────
// Tokenizer — italian-friendly
// ─────────────────────────────────────────────────
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòùç\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 4);  // skip stopword-ish short tokens
}

// ─────────────────────────────────────────────────
// Jaccard token overlap
// ─────────────────────────────────────────────────
function jaccard(a, b) {
  if (!a.length || !b.length) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  const union = setA.size + setB.size - inter;
  return union === 0 ? 0 : inter / union;
}

// ─────────────────────────────────────────────────
// Substring containment (chunk includes bookText excerpt)
// ─────────────────────────────────────────────────
function substringScore(chunkText, bookText) {
  if (!chunkText || !bookText) return 0;
  const chunkLower = chunkText.toLowerCase();
  const bookLower = bookText.toLowerCase();
  // try first 80 chars of bookText as needle (often the distinctive opening)
  const needle = bookLower.slice(0, 80).trim();
  if (needle.length < 20) return 0;
  if (chunkLower.includes(needle)) return 1.0;
  // fallback: shorter needle 40 chars
  const needle2 = bookLower.slice(0, 40).trim();
  if (needle2.length >= 20 && chunkLower.includes(needle2)) return 0.6;
  return 0;
}

// ─────────────────────────────────────────────────
// Extract chapter integer from "Capitolo 6 - Cos'è il diodo LED?"
// ─────────────────────────────────────────────────
function extractChapterInt(chapterText) {
  const m = (chapterText || '').match(/Capitolo\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

// ─────────────────────────────────────────────────
// MAIN scorer
// ─────────────────────────────────────────────────
export function scoreMatch(chunk, lessonId, lesson) {
  const chunkTokens = tokenize(chunk.content_raw);
  const bookTextTokens = tokenize(lesson.bookText || '');
  const bookInstrTokens = tokenize((lesson.bookInstructions || []).join(' '));
  const chapterTokens = tokenize(lesson.chapter || '');

  const subScore = substringScore(chunk.content_raw, lesson.bookText);
  const instrScore = jaccard(chunkTokens, bookInstrTokens);
  const chapterScore = jaccard(chunkTokens, chapterTokens);
  const bookTextScore = jaccard(chunkTokens, bookTextTokens);

  // weighted sum
  const score = (
    subScore * 0.4 +
    bookTextScore * 0.25 +
    instrScore * 0.20 +
    chapterScore * 0.15
  );

  return {
    lessonId,
    score,
    breakdown: { subScore, bookTextScore, instrScore, chapterScore },
  };
}

// ─────────────────────────────────────────────────
// Find best lesson for a chunk
// ─────────────────────────────────────────────────
export function fuzzyMatchChunkToLesson(chunk, refs) {
  const sourcePrefix = VOLUME_PREFIX[chunk.source];
  if (!sourcePrefix) return null;  // wiki/glossary/etc. → no v-* mapping yet

  let best = null;
  for (const lessonId of Object.keys(refs)) {
    if (!lessonId.startsWith(sourcePrefix)) continue;
    const lesson = refs[lessonId];
    const result = scoreMatch(chunk, lessonId, lesson);
    if (!best || result.score > best.score ||
        (result.score === best.score && lesson.bookPage < refs[best.lessonId].bookPage)) {
      best = { ...result, lesson };
    }
  }

  if (!best || best.score === 0) return null;

  return {
    lessonId: best.lessonId,
    chapter: best.lesson.chapter,
    chapterInt: extractChapterInt(best.lesson.chapter),
    page: best.lesson.bookPage,
    sectionTitle: best.lesson.chapter,   // reuse chapter title as section_title
    score: best.score,
    breakdown: best.breakdown,
  };
}

// ─────────────────────────────────────────────────
// CLI test mode (manual verification)
// ─────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('match-chunks-to-lessons.mjs — helper module. Not directly executable.');
  console.log('Use via: node scripts/backfill/rag-metadata-backfill-iter14.mjs --dry-run');
  process.exit(0);
}
