// Iter 41 Phase B Task B3 — Onniscenza V2.1 conversational fusion impl tests.
// Plan §Phase B Task B3 + ADR-035 4 boost factors capped +0.50.

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Onniscenza V2.1 conversational fusion (iter 41 B3)', () => {
  let fusion;

  beforeEach(async () => {
    vi.resetModules();
    vi.unstubAllGlobals();
    fusion = await import('../../supabase/functions/_shared/onniscenza-conversational-fusion.ts');
  });

  // ── experiment-anchor +0.15 ──
  it('boosts experiment-anchor +0.15 when chunk experimentId matches query', async () => {
    const chunks = [
      { id: 'c1', score: 0.5, content: 'Generic content', experimentId: 'v1-cap6-esp1' },
      { id: 'c2', score: 0.5, content: 'Other content', experimentId: 'v2-cap8-esp3' },
    ];
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: chunks, query: 'LED', experimentId: 'v1-cap6-esp1' });
    const c1 = result.find((r) => r.id === 'c1');
    expect(c1.boostBreakdown.experiment_anchor).toBe(0.15);
    expect(c1.finalScore).toBeCloseTo(0.65, 3);
  });

  it('NO experiment-anchor boost when experimentId NOT provided', async () => {
    const chunks = [{ id: 'c1', score: 0.5, content: 'x', experimentId: 'v1-cap6-esp1' }];
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: chunks, query: 'LED' });
    expect(result[0].boostBreakdown.experiment_anchor).toBeUndefined();
  });

  // ── kit-mention +0.10 ──
  it('boosts kit-mention +0.10 when chunk content contains LED', async () => {
    const chunks = [{ id: 'c1', score: 0.5, content: 'Il LED rosso lampeggia' }];
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: chunks, query: 'q' });
    expect(result[0].boostBreakdown.kit_mention).toBe(0.10);
  });

  it('boosts kit-mention +0.10 for breadboard / nano / arduino / mosfet / etc.', async () => {
    const components = ['breadboard', 'nano', 'arduino', 'resistore', 'condensatore', 'mosfet', 'diodo', 'pulsante', 'potenziometro', 'buzzer'];
    for (const comp of components) {
      const result = await fusion.aggregateOnniscenzaV21({
        ragChunks: [{ id: 'c1', score: 0.5, content: `Il ${comp} fa qualcosa` }],
        query: 'q',
      });
      expect(result[0].boostBreakdown.kit_mention).toBe(0.10);
    }
  });

  it('NO kit-mention boost on chunk without component refs', async () => {
    const chunks = [{ id: 'c1', score: 0.5, content: 'Plain text no components' }];
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: chunks, query: 'q' });
    expect(result[0].boostBreakdown.kit_mention).toBeUndefined();
  });

  // ── recent-history +0.20 × cosineSim ──
  it('boosts recent-history when conversation embed cosine > 0.6', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'fake' : '' } });
    const sameVec = Array.from({ length: 1024 }, () => 1 / Math.sqrt(1024)); // unit vec
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ embedding: sameVec }] }),
    }));

    const chunks = [{ id: 'c1', score: 0.5, content: 'x', metadata: { embedding: sameVec } }];
    const result = await fusion.aggregateOnniscenzaV21({
      ragChunks: chunks,
      query: 'q',
      conversationMessages: [{ role: 'user', content: 'history' }],
    });
    expect(result[0].boostBreakdown.recent_history).toBeGreaterThan(0);
    expect(result[0].boostBreakdown.recent_history).toBeLessThanOrEqual(0.20);
  });

  it('NO recent-history boost when conversation messages empty', async () => {
    const chunks = [{ id: 'c1', score: 0.5, content: 'x', metadata: { embedding: [1, 0, 0] } }];
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: chunks, query: 'q', conversationMessages: [] });
    expect(result[0].boostBreakdown.recent_history).toBeUndefined();
  });

  it('NO recent-history boost when chunk metadata.embedding missing', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'fake' : '' } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ embedding: new Array(1024).fill(0.1) }] }),
    }));
    const chunks = [{ id: 'c1', score: 0.5, content: 'x' }];
    const result = await fusion.aggregateOnniscenzaV21({
      ragChunks: chunks,
      query: 'q',
      conversationMessages: [{ role: 'user', content: 'h' }],
    });
    expect(result[0].boostBreakdown.recent_history).toBeUndefined();
  });

  // ── docente-stylistic +0.05 ──
  it('boosts docente-stylistic esperto +0.05 on advanced content', async () => {
    const chunks = [{ id: 'c1', score: 0.5, content: 'Approfondimento avanzato bonus' }];
    const result = await fusion.aggregateOnniscenzaV21({
      ragChunks: chunks,
      query: 'q',
      docenteStyle: { esperto: true },
    });
    expect(result[0].boostBreakdown.docente_stylistic).toBe(0.05);
  });

  it('boosts docente-stylistic primoAnno +0.05 on analogy content', async () => {
    const chunks = [{ id: 'c1', score: 0.5, content: 'Una analogia: come un campanello' }];
    const result = await fusion.aggregateOnniscenzaV21({
      ragChunks: chunks,
      query: 'q',
      docenteStyle: { primoAnno: true },
    });
    expect(result[0].boostBreakdown.docente_stylistic).toBe(0.05);
  });

  it('NO docente-stylistic boost when docenteStyle undefined', async () => {
    const chunks = [{ id: 'c1', score: 0.5, content: 'avanzato approfondimento' }];
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: chunks, query: 'q' });
    expect(result[0].boostBreakdown.docente_stylistic).toBeUndefined();
  });

  // ── Cap +0.50 ──
  it('caps total boost at +0.50 even when all factors trigger', async () => {
    vi.stubGlobal('Deno', { env: { get: (k) => k === 'VOYAGE_API_KEY' ? 'fake' : '' } });
    const sameVec = Array.from({ length: 1024 }, () => 1 / Math.sqrt(1024));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ embedding: sameVec }] }),
    }));
    const chunks = [{
      id: 'c1', score: 0.3,
      content: 'LED breadboard avanzato approfondimento',
      experimentId: 'v1-cap6-esp1',
      metadata: { embedding: sameVec },
    }];
    const result = await fusion.aggregateOnniscenzaV21({
      ragChunks: chunks,
      query: 'q',
      experimentId: 'v1-cap6-esp1',
      conversationMessages: [{ role: 'user', content: 'h' }],
      docenteStyle: { esperto: true },
    });
    // Total potential: 0.15 + 0.10 + 0.20 + 0.05 = 0.50 (exactly cap)
    expect(result[0].finalScore).toBeLessThanOrEqual(0.3 + 0.50);
    expect(result[0].finalScore).toBeGreaterThan(0.3);
  });

  // ── Sort ──
  it('sorts result descending by finalScore', async () => {
    const chunks = [
      { id: 'low', score: 0.3, content: 'plain' },
      { id: 'mid', score: 0.5, content: 'plain' },
      { id: 'high', score: 0.7, content: 'plain' },
    ];
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: chunks, query: 'q' });
    expect(result.map((r) => r.id)).toEqual(['high', 'mid', 'low']);
  });

  // ── Preserve RRF base ──
  it('preserves RRF k=60 base score for chunks without boost factors', async () => {
    const chunks = [{ id: 'c1', score: 0.5, content: 'plain text no kit' }];
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: chunks, query: 'q' });
    expect(result[0].finalScore).toBe(0.5);
    expect(result[0].boostBreakdown.rrf_base).toBe(0.5);
  });

  // ── Empty input ──
  it('returns empty array for empty ragChunks', async () => {
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: [], query: 'q' });
    expect(result).toEqual([]);
  });

  // ── cosineSimilarity utility ──
  it('cosineSimilarity returns 1 for identical unit vectors', () => {
    const v = [1, 0, 0];
    expect(fusion.cosineSimilarity(v, v)).toBeCloseTo(1, 5);
  });

  it('cosineSimilarity returns 0 for orthogonal vectors', () => {
    expect(fusion.cosineSimilarity([1, 0, 0], [0, 1, 0])).toBeCloseTo(0, 5);
  });

  it('cosineSimilarity returns -1 for opposite vectors', () => {
    expect(fusion.cosineSimilarity([1, 0, 0], [-1, 0, 0])).toBeCloseTo(-1, 5);
  });

  it('cosineSimilarity returns 0 for zero vector (defensive)', () => {
    expect(fusion.cosineSimilarity([0, 0, 0], [1, 0, 0])).toBe(0);
  });

  it('cosineSimilarity handles different-length vectors gracefully', () => {
    expect(fusion.cosineSimilarity([1, 0], [1, 0, 0])).toBe(0);
  });

  // ── Output shape ──
  it('returns id + finalScore + boostBreakdown shape preserved', async () => {
    const chunks = [{ id: 'c1', score: 0.5, content: 'LED' }];
    const result = await fusion.aggregateOnniscenzaV21({ ragChunks: chunks, query: 'q' });
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('finalScore');
    expect(result[0]).toHaveProperty('boostBreakdown');
    expect(typeof result[0].boostBreakdown).toBe('object');
  });
});
