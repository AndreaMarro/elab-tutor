/**
 * Sprint 4 Day 26 — wiki-query-core unit tests.
 *
 * Covers validateRequest input guardrails, scoreDoc determinism,
 * retrieveWikiEntries ranking + volume filter, buildResponse envelope.
 */

import { describe, it, expect } from 'vitest';
import {
  VERSION,
  MAX_TOP_K,
  DEFAULT_TOP_K,
  MAX_QUERY_LEN,
  SEED_CORPUS,
  tokens,
  scoreDoc,
  validateRequest,
  retrieveWikiEntries,
  buildResponse,
} from '../../scripts/wiki-query-core.mjs';

describe('wiki-query-core constants', () => {
  it('exposes scaffold version + sane defaults', () => {
    expect(VERSION).toMatch(/scaffold.*day\d+/);
    expect(DEFAULT_TOP_K).toBe(5);
    expect(MAX_TOP_K).toBe(20);
    expect(MAX_QUERY_LEN).toBe(500);
  });

  it('seed corpus covers all three volumes', () => {
    const vols = new Set(SEED_CORPUS.map(d => d.volume));
    expect(vols).toEqual(new Set([1, 2, 3]));
    expect(SEED_CORPUS.length).toBeGreaterThanOrEqual(3);
    for (const doc of SEED_CORPUS) {
      expect(doc.id).toMatch(/^v[1-3]-/);
      expect(doc.page).toBeGreaterThan(0);
      expect(doc.content.length).toBeGreaterThan(0);
    }
  });
});

describe('wiki-query-core tokens', () => {
  it('strips stop words, lowercases, discards short tokens', () => {
    const out = tokens('Il LED rosso con resistenza');
    expect(out).toContain('led');
    expect(out).toContain('rosso');
    expect(out).toContain('resistenza');
    expect(out).not.toContain('il');
    expect(out).not.toContain('con');
  });

  it('handles accented + punctuation gracefully', () => {
    const out = tokens('Perché, così, è: LED?');
    // Should not explode, at minimum returns something
    expect(Array.isArray(out)).toBe(true);
    expect(out).toContain('led');
  });

  it('returns empty for empty input', () => {
    expect(tokens('')).toEqual([]);
    expect(tokens('il la le')).toEqual([]);
  });
});

describe('wiki-query-core scoreDoc', () => {
  it('returns 0 for empty query tokens', () => {
    expect(scoreDoc([], SEED_CORPUS[0])).toBe(0);
  });

  it('returns non-zero hit rate for matching terms', () => {
    const doc = SEED_CORPUS.find(d => d.id === 'v1-cap6-esp1');
    const s = scoreDoc(['led', 'rosso'], doc);
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThanOrEqual(1);
  });

  it('returns 1.0 when every query token present', () => {
    const doc = SEED_CORPUS.find(d => d.id === 'v3-cap2-esp2');
    const s = scoreDoc(['servo', 'sg90'], doc);
    expect(s).toBe(1);
  });

  it('returns 0 for complete miss', () => {
    const doc = SEED_CORPUS.find(d => d.id === 'v1-cap6-esp1');
    expect(scoreDoc(['arduino', 'wifi', 'bluetooth'], doc)).toBe(0);
  });
});

describe('wiki-query-core validateRequest', () => {
  it('rejects non-object body', () => {
    expect(validateRequest(null).ok).toBe(false);
    expect(validateRequest('string').ok).toBe(false);
    expect(validateRequest(42).ok).toBe(false);
  });

  it('rejects missing/empty query', () => {
    expect(validateRequest({}).ok).toBe(false);
    expect(validateRequest({ query: '' }).ok).toBe(false);
    expect(validateRequest({ query: '   ' }).ok).toBe(false);
    expect(validateRequest({ query: 42 }).ok).toBe(false);
  });

  it('rejects over-long query', () => {
    const q = 'a'.repeat(MAX_QUERY_LEN + 1);
    const r = validateRequest({ query: q });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/too long/);
  });

  it('applies DEFAULT_TOP_K when topK absent', () => {
    const r = validateRequest({ query: 'led' });
    expect(r.ok).toBe(true);
    expect(r.data.topK).toBe(DEFAULT_TOP_K);
  });

  it('rejects topK outside 1..MAX_TOP_K', () => {
    expect(validateRequest({ query: 'led', topK: 0 }).ok).toBe(false);
    expect(validateRequest({ query: 'led', topK: -1 }).ok).toBe(false);
    expect(validateRequest({ query: 'led', topK: MAX_TOP_K + 1 }).ok).toBe(false);
    expect(validateRequest({ query: 'led', topK: 'five' }).ok).toBe(false);
    expect(validateRequest({ query: 'led', topK: NaN }).ok).toBe(false);
  });

  it('accepts valid filter.volume values only', () => {
    expect(validateRequest({ query: 'led', filter: { volume: 1 } }).ok).toBe(true);
    expect(validateRequest({ query: 'led', filter: { volume: 4 } }).ok).toBe(false);
    expect(validateRequest({ query: 'led', filter: { volume: 'one' } }).ok).toBe(false);
    expect(validateRequest({ query: 'led', filter: null }).ok).toBe(false);
  });

  it('trims query + floors topK', () => {
    const r = validateRequest({ query: '  led  ', topK: 3.7 });
    expect(r.ok).toBe(true);
    expect(r.data.query).toBe('led');
    expect(r.data.topK).toBe(3);
  });
});

describe('wiki-query-core retrieveWikiEntries', () => {
  it('returns empty for zero-hit query', async () => {
    const out = await retrieveWikiEntries({ query: 'zebra wifi bluetooth', topK: 5 });
    expect(out).toEqual([]);
  });

  it('returns ranked matches with score', async () => {
    const out = await retrieveWikiEntries({ query: 'led rosso resistenza', topK: 5 });
    expect(out.length).toBeGreaterThanOrEqual(1);
    expect(out[0].id).toBe('v1-cap6-esp1');
    expect(out[0].score).toBeGreaterThan(0);
    // Ensures descending order
    for (let i = 1; i < out.length; i++) {
      expect(out[i - 1].score).toBeGreaterThanOrEqual(out[i].score);
    }
  });

  it('respects topK cap', async () => {
    const out = await retrieveWikiEntries({ query: 'led pulsante servo', topK: 1 });
    expect(out.length).toBeLessThanOrEqual(1);
  });

  it('filters by volume when provided', async () => {
    const out = await retrieveWikiEntries({
      query: 'motore gradi posizione',
      topK: 5,
      filter: { volume: 3 },
    });
    for (const e of out) {
      expect(e.volume).toBe(3);
    }
  });

  it('truncates excerpt to 160 chars', async () => {
    const out = await retrieveWikiEntries({ query: 'led resistenza', topK: 5 });
    for (const e of out) {
      expect(e.excerpt.length).toBeLessThanOrEqual(160);
    }
  });

  it('rounds score to 3 decimals', async () => {
    const out = await retrieveWikiEntries({ query: 'led rosso', topK: 5 });
    for (const e of out) {
      const asStr = String(e.score);
      // Match 0, 1, or up to 3 decimals
      expect(asStr).toMatch(/^[01](\.[0-9]{1,3})?$|^0\.[0-9]{1,3}$/);
    }
  });
});

describe('wiki-query-core buildResponse', () => {
  it('builds envelope with metrics + version + echoed query', async () => {
    const req = { query: 'led', topK: 3 };
    const entries = await retrieveWikiEntries(req);
    const t0 = Date.now();
    const resp = buildResponse(req, entries, t0 - 50);
    expect(resp.version).toBe(VERSION);
    expect(resp.query).toBe('led');
    expect(resp.results).toBe(entries);
    expect(resp.metrics.source_count).toBe(entries.length);
    expect(resp.metrics.latency_ms).toBeGreaterThanOrEqual(0);
    expect(resp.metrics.source).toBe('mock-day26');
  });

  it('handles zero-result case cleanly', () => {
    const resp = buildResponse({ query: 'zz', topK: 5 }, [], Date.now());
    expect(resp.results).toEqual([]);
    expect(resp.metrics.source_count).toBe(0);
  });
});
