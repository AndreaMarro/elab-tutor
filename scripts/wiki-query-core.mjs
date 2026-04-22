/**
 * UNLIM Wiki Query — core logic (shared Deno Edge Function + Node vitest).
 *
 * Sprint 4 Day 26 scaffold: validation + seed-corpus retrieval.
 * Pure ESM, no runtime deps — both Deno and Node can import.
 *
 * Day 27 (S4.1.6): swap SEED_CORPUS for data/wiki/*.md entries + embedding scoring.
 */

export const VERSION = 'scaffold-0.1.0-day26';
export const MAX_TOP_K = 20;
export const DEFAULT_TOP_K = 5;
export const MAX_QUERY_LEN = 500;

/**
 * @typedef {Object} WikiQueryRequest
 * @property {string} query
 * @property {number} topK
 * @property {{ volume?: 1|2|3 }} [filter]
 */

/**
 * @typedef {Object} WikiEntry
 * @property {string} id
 * @property {string} title
 * @property {1|2|3} [volume]
 * @property {string} [chapter]
 * @property {number} [page]
 * @property {string} excerpt
 * @property {number} score
 */

export const SEED_CORPUS = [
  {
    id: 'v1-cap6-esp1',
    title: 'LED rosso con resistenza 470 ohm',
    volume: 1,
    chapter: 'Capitolo 6',
    page: 29,
    content: 'Collega il LED rosso in serie con la resistenza 470 ohm: il LED si accende quando la corrente scorre dal pin digitale.',
  },
  {
    id: 'v2-cap3-esp4',
    title: 'Pulsante digitale con pull-down',
    volume: 2,
    chapter: 'Capitolo 3',
    page: 44,
    content: 'Il pulsante collegato al pin digitale legge HIGH quando premuto, LOW a riposo, grazie alla resistenza di pull-down da 10k.',
  },
  {
    id: 'v3-cap2-esp2',
    title: 'Servo motore SG90 con potenziometro',
    volume: 3,
    chapter: 'Capitolo 2',
    page: 18,
    content: 'Il servo motore SG90 muove il braccio tra 0 e 180 gradi seguendo la posizione del potenziometro letto su pin analogico A0.',
  },
];

const STOP_WORDS = new Set([
  'il', 'la', 'le', 'lo', 'gli', 'un', 'una', 'uno', 'e', 'o', 'di', 'da', 'a', 'in',
  'per', 'con', 'che', 'come', 'cosa', 'non', 'del', 'della', 'dei', 'delle', 'quando',
]);

export function tokens(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t));
}

export function scoreDoc(queryTokens, doc) {
  if (!Array.isArray(queryTokens) || queryTokens.length === 0) return 0;
  const hay = tokens(`${doc.title} ${doc.content}`);
  const haySet = new Set(hay);
  let hits = 0;
  for (const qt of queryTokens) {
    if (haySet.has(qt)) hits += 1;
  }
  return hits / queryTokens.length;
}

/**
 * @param {unknown} body
 * @returns {{ ok: true, data: WikiQueryRequest } | { ok: false, error: string }}
 */
export function validateRequest(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'body must be object' };
  }
  const query = body.query;
  if (typeof query !== 'string' || query.trim().length === 0) {
    return { ok: false, error: 'query required (non-empty string)' };
  }
  if (query.length > MAX_QUERY_LEN) {
    return { ok: false, error: `query too long (max ${MAX_QUERY_LEN})` };
  }
  const topK = body.topK === undefined ? DEFAULT_TOP_K : body.topK;
  if (typeof topK !== 'number' || !Number.isFinite(topK) || topK < 1 || topK > MAX_TOP_K) {
    return { ok: false, error: `topK must be integer 1..${MAX_TOP_K}` };
  }
  const filter = body.filter;
  if (filter !== undefined) {
    if (typeof filter !== 'object' || filter === null) {
      return { ok: false, error: 'filter must be object' };
    }
    const fv = filter.volume;
    if (fv !== undefined && (typeof fv !== 'number' || ![1, 2, 3].includes(fv))) {
      return { ok: false, error: 'filter.volume must be 1|2|3' };
    }
  }
  return {
    ok: true,
    data: {
      query: query.trim(),
      topK: Math.floor(topK),
      filter: filter || undefined,
    },
  };
}

/**
 * @param {WikiQueryRequest} req
 * @returns {Promise<WikiEntry[]>}
 */
export async function retrieveWikiEntries(req) {
  const qTokens = tokens(req.query);
  const filterVolume = req.filter?.volume;

  const scored = [];
  for (const doc of SEED_CORPUS) {
    if (filterVolume !== undefined && doc.volume !== filterVolume) continue;
    const score = scoreDoc(qTokens, doc);
    if (score > 0) {
      scored.push({ doc, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, req.topK).map(({ doc, score }) => ({
    id: doc.id,
    title: doc.title,
    volume: doc.volume,
    chapter: doc.chapter,
    page: doc.page,
    excerpt: doc.content.slice(0, 160),
    score: Math.round(score * 1000) / 1000,
  }));
}

/**
 * @param {WikiQueryRequest} req
 * @param {WikiEntry[]} entries
 * @param {number} startedAt
 */
export function buildResponse(req, entries, startedAt) {
  return {
    results: entries,
    metrics: {
      latency_ms: Date.now() - startedAt,
      source: 'mock-day26',
      source_count: entries.length,
    },
    version: VERSION,
    query: req.query,
  };
}
