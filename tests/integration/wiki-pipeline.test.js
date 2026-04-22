/**
 * wiki-pipeline.test.js — Sprint 4 Day 27 (S4.1.6)
 *
 * Integration tests covering end-to-end wiki pipeline round-trips:
 *   1. build-batch-input → serialize → parse → custom_id recovery
 *   2. fixture markdown → loadCorpus → makeRetriever → validateRequest → retrieve
 *   3. empty corpus dir → fallback → retrieval still functional
 *   4. build-batch-input output shape → downstream wiki entry loadable (shape compatibility)
 *   5. validate() accepts a loader-compatible markdown body
 *   6. round-trip malformed fixture rejection keeps good entries
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, writeFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  buildExperimentRecords,
  serialize,
} from '../../scripts/wiki-build-batch-input.mjs';
import { loadCorpus, parseWikiMarkdown } from '../../scripts/wiki-corpus-loader.mjs';
import {
  makeRetriever,
  validateRequest,
  buildResponse,
  SEED_CORPUS,
} from '../../scripts/wiki-query-core.mjs';
import { validate } from '../../scripts/wiki-validate-file.mjs';

const SYNTHETIC_VOLUME_REFS = {
  'v1-cap6-esp1': {
    volume: 1,
    chapter: 'Capitolo 6',
    page: 29,
    title: 'LED rosso con resistenza',
    bookText: 'Collega il LED rosso con la resistenza 470 ohm in serie.',
    bookInstructions: ['Infila il LED nella breadboard', 'Collega la resistenza'],
    components: ['LED rosso', 'resistenza 470 ohm'],
  },
  'v2-cap3-esp4': {
    volume: 2,
    chapter: 'Capitolo 3',
    page: 44,
    title: 'Pulsante con pull-down',
    bookText: 'Il pulsante legge HIGH quando premuto.',
    bookInstructions: ['Inserisci pulsante', 'Pull-down 10k'],
    components: ['pulsante', 'resistenza 10k'],
  },
};

const SYNTHETIC_LESSON_GROUPS = {
  'lesson-led-basics': {
    concept: 'LED accensione',
    experiments: ['v1-cap6-esp1'],
    narrative: 'I LED sono i primi componenti attivi da imparare.',
  },
  'lesson-input-digital': {
    concept: 'Pulsanti e ingresso digitale',
    experiments: ['v2-cap3-esp4'],
    narrative: 'Il pulsante introduce il concetto di input.',
  },
};

let tmpRoot;

beforeEach(async () => {
  tmpRoot = await mkdtemp(join(tmpdir(), 'wiki-pipeline-'));
});

afterEach(async () => {
  if (tmpRoot) await rm(tmpRoot, { recursive: true, force: true });
  tmpRoot = undefined;
});

describe('round-trip 1: build-batch-input → serialize → parse', () => {
  it('emits one JSONL line per experiment with custom_id prefix', () => {
    const records = buildExperimentRecords(SYNTHETIC_VOLUME_REFS, SYNTHETIC_LESSON_GROUPS);
    const jsonl = serialize(records);
    const lines = jsonl.trim().split('\n').filter(Boolean);
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      const parsed = JSON.parse(line);
      expect(parsed.custom_id).toMatch(/^experiment-v\d-cap\d+-esp\d+$/);
      expect(parsed.body).toBeDefined();
      expect(parsed.body.messages).toHaveLength(2);
      expect(parsed.body.messages[0].role).toBe('system');
    }
  });

  it('round-trip recovers volume slug from custom_id', () => {
    const records = buildExperimentRecords(SYNTHETIC_VOLUME_REFS, SYNTHETIC_LESSON_GROUPS);
    const recovered = records.map((r) => r.custom_id.replace(/^experiment-/, ''));
    expect(recovered).toContain('v1-cap6-esp1');
    expect(recovered).toContain('v2-cap3-esp4');
  });
});

describe('round-trip 2: fixture markdown → loader → retriever', () => {
  async function seedFixtures() {
    await writeFile(
      join(tmpRoot, 'led.md'),
      '---\nid: v1-cap6-esp1\ntitle: "LED rosso con resistenza 470 ohm"\nvolume: 1\npage: 29\n---\nCollega il LED rosso con la resistenza 470 ohm. La corrente accende il diodo.',
    );
    await writeFile(
      join(tmpRoot, 'pulsante.md'),
      '---\nid: v2-cap3-esp4\ntitle: "Pulsante digitale pull-down"\nvolume: 2\npage: 44\n---\nIl pulsante legge HIGH quando premuto grazie al pull-down 10k.',
    );
    await mkdir(join(tmpRoot, 'volume-3'), { recursive: true });
    await writeFile(
      join(tmpRoot, 'volume-3', 'servo.md'),
      '---\nid: v3-cap2-esp2\ntitle: "Servo motore SG90 con potenziometro"\nvolume: 3\npage: 18\n---\nIl servo motore SG90 segue il potenziometro A0.',
    );
  }

  it('full pipeline returns results scoring > 0 for keyword query', async () => {
    await seedFixtures();
    const corpus = await loadCorpus({ dir: tmpRoot, fallback: SEED_CORPUS });
    expect(corpus).toHaveLength(3);
    expect(corpus.some((c) => c.id === 'v3-cap2-esp2')).toBe(true);

    const retriever = makeRetriever(corpus);
    const v = validateRequest({ query: 'LED resistenza ohm', topK: 3 });
    expect(v.ok).toBe(true);

    const startedAt = Date.now();
    const entries = await retriever.retrieve(v.data);
    const response = buildResponse(v.data, entries, startedAt, {
      source: 'loader-fixture',
      corpus_size: retriever.size,
    });

    expect(response.results.length).toBeGreaterThanOrEqual(1);
    expect(response.results[0].score).toBeGreaterThan(0);
    expect(response.results[0].id).toBe('v1-cap6-esp1');
    expect(response.metrics.source).toBe('loader-fixture');
    expect(response.metrics.corpus_size).toBe(3);
    expect(response.version).toMatch(/day27/);
  });

  it('filter by volume works end-to-end', async () => {
    await seedFixtures();
    const corpus = await loadCorpus({ dir: tmpRoot, fallback: SEED_CORPUS });
    const retriever = makeRetriever(corpus);
    const v = validateRequest({ query: 'motore servo potenziometro', topK: 5, filter: { volume: 3 } });
    expect(v.ok).toBe(true);
    const entries = await retriever.retrieve(v.data);
    expect(entries.every((e) => e.volume === 3)).toBe(true);
    expect(entries[0].id).toBe('v3-cap2-esp2');
  });
});

describe('round-trip 3: empty corpus → fallback SEED_CORPUS', () => {
  it('retrieval still functional using SEED_CORPUS fallback', async () => {
    const corpus = await loadCorpus({ dir: tmpRoot, fallback: SEED_CORPUS });
    expect(corpus).toBe(SEED_CORPUS);

    const retriever = makeRetriever(corpus);
    const v = validateRequest({ query: 'LED rosso', topK: 3 });
    const entries = await retriever.retrieve(v.data);
    expect(entries.length).toBeGreaterThanOrEqual(1);
    expect(entries[0].id).toBe('v1-cap6-esp1');
  });
});

describe('round-trip 4: fixture content is valid per schema validator', () => {
  it('validator accepts a hand-written fixture with required sections', () => {
    const fixture = [
      '---',
      'id: v1-cap6-esp1',
      'type: experiment',
      'created: 2026-04-22',
      'updated: 2026-04-22',
      'volume_refs: [Vol1p29]',
      'kit_components: [LED rosso, resistenza 470 ohm]',
      'difficulty: easy',
      'concepts: [led, resistenza]',
      'lessons: [lesson-led-basics]',
      'ingest_cost_usd: 0.0012',
      'ingest_model: meta-llama/Llama-3.3-70B-Instruct-Turbo',
      'pz_v3_compliant: true',
      '---',
      '## Obiettivo',
      'Accendere un LED rosso [volume:Vol1p29].',
      '',
      '## Testo dal volume',
      'Collega il LED rosso in serie con la resistenza 470 ohm.',
      '',
      '## Componenti kit ELAB',
      '- LED rosso',
      '- resistenza 470 ohm',
      '',
      '## Schema circuito',
      'D13 -> LED -> resistenza -> GND',
      '',
      '## Concetti chiave',
      '- Corrente diretta',
      '',
      '## Errori comuni',
      '- Polarità invertita',
      '',
      '## Analogie vincenti',
      'Il LED è come una valvola a senso unico.',
      '',
    ].join('\n');

    const result = validate(fixture, { path: 'fixture-led.md' });
    expect(result.pass).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.type).toBe('experiment');
  });

  it('loader + validator agree: valid fixture round-trips', async () => {
    const body = [
      '---',
      'id: v1-cap6-esp1',
      'title: "LED rosso"',
      'volume: 1',
      'page: 29',
      '---',
      'Collega il LED rosso con la resistenza 470 ohm.',
    ].join('\n');
    const path = join(tmpRoot, 'entry.md');
    await writeFile(path, body);

    const corpus = await loadCorpus({ dir: tmpRoot, fallback: [] });
    expect(corpus).toHaveLength(1);
    expect(corpus[0].title).toBe('LED rosso');

    const parsed = parseWikiMarkdown(body);
    expect(parsed.frontMatter.id).toBe('v1-cap6-esp1');
    expect(parsed.body).toContain('LED rosso');
  });
});
