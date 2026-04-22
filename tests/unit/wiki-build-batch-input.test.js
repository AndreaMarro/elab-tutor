/**
 * tests/unit/wiki-build-batch-input.test.js — sett-4 S4.1.3 Day 24
 *
 * Covers the deterministic JSONL emitter for Together AI Batch API.
 * Script lives at `scripts/wiki-build-batch-input.mjs`.
 */

import { describe, it, expect } from 'vitest';
import {
  buildSystemPrompt,
  buildExperimentUserPrompt,
  buildLessonUserPrompt,
  buildExperimentRecords,
  buildLessonRecords,
  buildBatch,
  serialize,
  loadData,
} from '../../scripts/wiki-build-batch-input.mjs';
const ROOT = process.cwd();

const FIXTURE_VOLUMES = {
  'v1-cap6-esp1': {
    volume: 1,
    bookPage: 29,
    chapter: "Capitolo 6 — LED",
    chapterPage: 27,
    bookText: 'Per accendere il LED serve un resistore.',
    bookInstructions: ['Collega la batteria.', 'Inserisci il LED con polarità corretta.'],
    bookQuote: 'Il LED si è acceso!',
    bookContext: 'Primo esperimento del libro.',
  },
  'v1-cap6-esp2': {
    volume: 1,
    bookPage: 30,
    chapter: "Capitolo 6 — LED",
    chapterPage: 27,
    bookText: 'Cambia il LED con uno di colore diverso.',
    bookInstructions: ['Sostituisci il LED.'],
  },
};

const FIXTURE_LESSONS = {
  'v1-accendi-led': {
    title: 'Accendi il LED',
    concept: 'Circuito base: batteria + resistore + LED',
    volume: 1,
    chapter: 6,
    icon: '💡',
    experiments: ['v1-cap6-esp1', 'v1-cap6-esp2'],
  },
};

describe('wiki-build-batch-input — system prompt', () => {
  it('includes all 5 Principio Zero v3 rules', () => {
    const sp = buildSystemPrompt({ type: 'experiment' });
    expect(sp).toMatch(/Docente, leggi/);
    expect(sp).toMatch(/bambini 8-14/);
    expect(sp).toMatch(/\[volume:VolNpM\]/);
    expect(sp).toMatch(/kit ELAB/);
    expect(sp).toMatch(/3 frasi \+ 1 analogia/);
  });

  it('includes experiment-specific required sections when type=experiment', () => {
    const sp = buildSystemPrompt({ type: 'experiment' });
    expect(sp).toMatch(/## Obiettivo/);
    expect(sp).toMatch(/## Testo dal volume/);
    expect(sp).toMatch(/## Componenti kit ELAB/);
    expect(sp).toMatch(/## Schema circuito/);
    expect(sp).toMatch(/## Concetti chiave/);
    expect(sp).toMatch(/## Errori comuni/);
    expect(sp).toMatch(/## Analogie vincenti/);
  });

  it('includes lesson-specific required sections when type=lesson', () => {
    const sp = buildSystemPrompt({ type: 'lesson' });
    expect(sp).toMatch(/## Obiettivo lezione/);
    expect(sp).toMatch(/## Esperimenti raggruppati/);
    expect(sp).toMatch(/## Flusso narrativo libro/);
    expect(sp).not.toMatch(/## Schema circuito/);
  });
});

describe('wiki-build-batch-input — user prompts', () => {
  it('experiment user prompt embeds bookText literal + volume citation marker', () => {
    const prompt = buildExperimentUserPrompt(
      'v1-cap6-esp1',
      FIXTURE_VOLUMES['v1-cap6-esp1'],
      { lessonId: 'v1-accendi-led', lesson: FIXTURE_LESSONS['v1-accendi-led'] },
    );
    expect(prompt).toContain('Per accendere il LED serve un resistore.');
    expect(prompt).toContain('[volume:Vol1p29]');
    expect(prompt).toContain('volume_refs: ["Vol1:p.29"]');
    expect(prompt).toContain('lessons: ["v1-accendi-led"]');
  });

  it('experiment user prompt uses empty lessons when no lesson link', () => {
    const prompt = buildExperimentUserPrompt('v1-cap6-esp2', FIXTURE_VOLUMES['v1-cap6-esp2'], null);
    expect(prompt).toContain('lessons: []');
  });

  it('lesson user prompt embeds experiments array + volume+chapter citation', () => {
    const prompt = buildLessonUserPrompt('v1-accendi-led', FIXTURE_LESSONS['v1-accendi-led']);
    expect(prompt).toContain('experiments: ["v1-cap6-esp1","v1-cap6-esp2"]');
    expect(prompt).toContain('Vol1:cap.6');
  });
});

describe('wiki-build-batch-input — record builders', () => {
  it('builds one experiment record per input entry with stable custom_id', () => {
    const records = buildExperimentRecords(FIXTURE_VOLUMES, FIXTURE_LESSONS);
    expect(records).toHaveLength(2);
    expect(records[0].custom_id).toBe('experiment-v1-cap6-esp1');
    expect(records[1].custom_id).toBe('experiment-v1-cap6-esp2');
    expect(records[0].body.model).toBe('meta-llama/Llama-3.3-70B-Instruct-Turbo');
    expect(records[0].body.messages).toHaveLength(2);
    expect(records[0].body.messages[0].role).toBe('system');
    expect(records[0].body.messages[1].role).toBe('user');
  });

  it('builds one lesson record per lesson entry', () => {
    const records = buildLessonRecords(FIXTURE_LESSONS);
    expect(records).toHaveLength(1);
    expect(records[0].custom_id).toBe('lesson-v1-accendi-led');
  });

  it('respects --type filter in buildBatch', async () => {
    const expOnly = await buildBatch({
      type: 'experiments',
      volumeRefs: FIXTURE_VOLUMES,
      lessonGroups: FIXTURE_LESSONS,
    });
    expect(expOnly.every((r) => r.custom_id.startsWith('experiment-'))).toBe(true);

    const lessonsOnly = await buildBatch({
      type: 'lessons',
      volumeRefs: FIXTURE_VOLUMES,
      lessonGroups: FIXTURE_LESSONS,
    });
    expect(lessonsOnly.every((r) => r.custom_id.startsWith('lesson-'))).toBe(true);
  });

  it('respects --limit flag', async () => {
    const limited = await buildBatch({
      type: 'all',
      limit: 2,
      volumeRefs: FIXTURE_VOLUMES,
      lessonGroups: FIXTURE_LESSONS,
    });
    expect(limited).toHaveLength(2);
  });
});

describe('wiki-build-batch-input — serialisation', () => {
  it('emits deterministic JSONL (sorted keys, stable order)', async () => {
    const records = await buildBatch({
      type: 'all',
      volumeRefs: FIXTURE_VOLUMES,
      lessonGroups: FIXTURE_LESSONS,
    });
    const once = serialize(records);
    const twice = serialize(records);
    expect(once).toBe(twice);
    expect(once.split('\n').filter(Boolean)).toHaveLength(records.length);
    const parsed = JSON.parse(once.split('\n')[0]);
    expect(parsed).toHaveProperty('custom_id');
    expect(parsed).toHaveProperty('body.model');
  });
});

describe('wiki-build-batch-input — real data contract (integration)', () => {
  it('loads real VOLUME_REFERENCES (92) + LESSON_GROUPS (25)', async () => {
    const { volumeRefs, lessonGroups } = await loadData(ROOT);
    expect(Object.keys(volumeRefs)).toHaveLength(92);
    expect(Object.keys(lessonGroups).length).toBeGreaterThanOrEqual(25);
  });

  it('emits 92 experiment + N lesson records for type=all against real data', async () => {
    const { volumeRefs, lessonGroups } = await loadData(ROOT);
    const all = await buildBatch({ type: 'all', volumeRefs, lessonGroups });
    const experiments = all.filter((r) => r.custom_id.startsWith('experiment-'));
    const lessons = all.filter((r) => r.custom_id.startsWith('lesson-'));
    expect(experiments).toHaveLength(92);
    expect(lessons.length).toBe(Object.keys(lessonGroups).length);
  });
});
