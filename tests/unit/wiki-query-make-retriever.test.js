import { describe, it, expect } from 'vitest';
import { makeRetriever, VERSION } from '../../scripts/wiki-query-core.mjs';

const customCorpus = [
  {
    id: 'c1',
    title: 'Condensatore elettrolitico',
    volume: 1,
    chapter: 'Capitolo 4',
    page: 12,
    content: 'Il condensatore elettrolitico immagazzina carica elettrica e si carica in pochi secondi.',
  },
  {
    id: 'c2',
    title: 'Motore passo-passo 28BYJ-48',
    volume: 3,
    chapter: 'Capitolo 5',
    page: 22,
    content: 'Il motore passo-passo 28BYJ-48 si muove con impulsi precisi sui quattro pin di controllo.',
  },
  {
    id: 'c3',
    title: 'Buzzer piezo attivo',
    volume: 2,
    chapter: 'Capitolo 7',
    page: 35,
    content: 'Il buzzer piezo attivo produce un suono fisso quando riceve tensione sul pin digitale.',
  },
];

describe('makeRetriever', () => {
  it('throws on non-array corpus', () => {
    expect(() => makeRetriever(null)).toThrow(TypeError);
    expect(() => makeRetriever({})).toThrow(TypeError);
  });

  it('exposes size reflecting valid docs only', () => {
    const retriever = makeRetriever([
      ...customCorpus,
      { id: 'bad1' },
      null,
      { id: 'bad2', title: 't' },
    ]);
    expect(retriever.size).toBe(3);
  });

  it('retrieves docs matching query tokens', async () => {
    const retriever = makeRetriever(customCorpus);
    const results = await retriever.retrieve({
      query: 'condensatore elettrolitico carica',
      topK: 5,
    });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].id).toBe('c1');
    expect(results[0].score).toBeGreaterThan(0);
  });

  it('filters by volume when requested', async () => {
    const retriever = makeRetriever(customCorpus);
    const results = await retriever.retrieve({
      query: 'motore',
      topK: 5,
      filter: { volume: 1 },
    });
    expect(results.every((r) => r.volume === 1)).toBe(true);
  });

  it('honours topK cap', async () => {
    const retriever = makeRetriever(customCorpus);
    const results = await retriever.retrieve({
      query: 'pin digitale',
      topK: 1,
    });
    expect(results.length).toBeLessThanOrEqual(1);
  });

  it('returns empty array when no docs score > 0', async () => {
    const retriever = makeRetriever(customCorpus);
    const results = await retriever.retrieve({
      query: 'quantum photon wavefunction',
      topK: 5,
    });
    expect(results).toEqual([]);
  });

  it('is independent of SEED_CORPUS (module VERSION pinned)', () => {
    expect(typeof VERSION).toBe('string');
    expect(VERSION).toMatch(/day27/);
  });
});
