/**
 * Unit tests for unlim-session-description _helpers.ts (iter 35 Phase 2 Atom I3).
 *
 * Validates pure helpers (buildPrompt + fallbackSummary + MAX_CHARS):
 *   - prompt assembly with optional transcript_excerpt (≤500 chars enforced)
 *   - prompt mentions Italian K-12 + 80-char cap + impersonal plural tone
 *   - fallback summary respects ≤80 char output cap
 *   - empty/missing fields handled defensively
 *
 * NO Deno imports (extracted from index.ts so vitest Node runtime works).
 *
 * (c) Andrea Marro 2026-05-04 — ELAB Tutor iter 35 Phase 2
 */

import { describe, it, expect } from 'vitest';
import {
  buildPrompt,
  fallbackSummary,
  MAX_CHARS,
  MAX_TRANSCRIPT_CHARS,
} from '../../supabase/functions/unlim-session-description/_helpers.ts';

describe('unlim-session-description — fallbackSummary', () => {
  const baseRow = {
    id: 'sess-uuid-1',
    experiment_id: 'v1-cap6-esp1',
    modalita: 'percorso',
    started_at: '2026-05-04T14:00:00Z',
    ended_at: '2026-05-04T14:25:00Z',
    events: [{ k: 'click' }, { k: 'wire' }, { k: 'compile' }],
    description_unlim: null,
  };

  it('returns a string ≤MAX_CHARS (80)', () => {
    const out = fallbackSummary(baseRow);
    expect(typeof out).toBe('string');
    expect(out.length).toBeLessThanOrEqual(MAX_CHARS);
  });

  it('includes experiment_id when present', () => {
    expect(fallbackSummary(baseRow)).toMatch(/v1-cap6-esp1/);
  });

  it('includes minutes duration when started+ended present', () => {
    expect(fallbackSummary(baseRow)).toMatch(/25 min/);
  });

  it('includes event count when events array non-empty', () => {
    expect(fallbackSummary(baseRow)).toMatch(/3 eventi/);
  });

  it('handles missing experiment_id gracefully (no crash)', () => {
    const row = { ...baseRow, experiment_id: null };
    expect(fallbackSummary(row)).toMatch(/esperimento/);
  });

  it('handles non-array events gracefully (count=0, omitted)', () => {
    const row = { ...baseRow, events: null };
    const out = fallbackSummary(row);
    expect(out).not.toMatch(/eventi/);
  });
});

describe('unlim-session-description — buildPrompt (Andrea-explicit Italian)', () => {
  const baseRow = {
    id: 'sess-uuid-2',
    experiment_id: 'v2-cap3-esp4',
    modalita: 'libero',
    started_at: '2026-05-04T10:00:00Z',
    ended_at: '2026-05-04T10:18:00Z',
    events: [{ k: 'click' }],
    description_unlim: null,
  };

  it('produces system + user prompts (non-empty strings)', () => {
    const { systemPrompt, message } = buildPrompt(baseRow);
    expect(typeof systemPrompt).toBe('string');
    expect(typeof message).toBe('string');
    expect(systemPrompt.length).toBeGreaterThan(50);
    expect(message.length).toBeGreaterThan(20);
  });

  it('system prompt mandates 80-char cap + Italian tone', () => {
    const { systemPrompt } = buildPrompt(baseRow);
    expect(systemPrompt).toMatch(/MAX 80 caratteri/);
    expect(systemPrompt).toMatch(/italiano/i);
    // Impersonal plural verbs (ELAB-specific tone — not "Ragazzi" because
    // this is metadata, not a docente-facing instruction).
    expect(systemPrompt).toMatch(/(Esplorato|Costruito|Verificato)/);
  });

  it('system prompt forbids saluti / imperativi / emoji', () => {
    const { systemPrompt } = buildPrompt(baseRow);
    expect(systemPrompt).toMatch(/NIENTE saluti/);
    expect(systemPrompt).toMatch(/NIENTE imperativi/);
    expect(systemPrompt).toMatch(/NIENTE emoji/);
  });

  it('user message includes esperimento + modalità + duration + events', () => {
    const { message } = buildPrompt(baseRow);
    expect(message).toMatch(/Esperimento: v2-cap3-esp4/);
    expect(message).toMatch(/Modalità: libero/);
    expect(message).toMatch(/Durata: 18 min/);
    expect(message).toMatch(/Eventi recenti:/);
  });

  it('user message OMITS transcript section when excerpt empty', () => {
    const { message } = buildPrompt(baseRow);
    expect(message).not.toMatch(/Estratto trascritto:/);
  });

  it('user message OMITS transcript section when excerpt is whitespace only', () => {
    const { message } = buildPrompt(baseRow, '   \t\n  ');
    expect(message).not.toMatch(/Estratto trascritto:/);
  });

  it('user message INCLUDES transcript when excerpt provided', () => {
    const excerpt = 'Docente: ragazzi vediamo il LED. UNLIM: avete collegato anodo e catodo correttamente?';
    const { message } = buildPrompt(baseRow, excerpt);
    expect(message).toMatch(/Estratto trascritto:/);
    expect(message).toContain('LED');
    expect(message).toContain('catodo');
  });

  it('transcript excerpt is capped at MAX_TRANSCRIPT_CHARS (500)', () => {
    const longExcerpt = 'Ragazzi '.repeat(200); // 1600 chars
    const { message } = buildPrompt(baseRow, longExcerpt);
    // The transcript portion should be sliced to 500 chars.
    const idx = message.indexOf('Estratto trascritto: ');
    expect(idx).toBeGreaterThan(-1);
    const tail = message.slice(idx + 'Estratto trascritto: '.length);
    // tail may have trailing prompt instruction, so cap section is exactly 500.
    const transcriptOnly = tail.split('\n')[0];
    expect(transcriptOnly.length).toBeLessThanOrEqual(MAX_TRANSCRIPT_CHARS);
  });

  it('handles row with null experiment_id (uses sconosciuto fallback)', () => {
    const { message } = buildPrompt({ ...baseRow, experiment_id: null });
    expect(message).toMatch(/Esperimento: sconosciuto/);
  });

  it('handles row missing started_at/ended_at (no Durata line)', () => {
    const { message } = buildPrompt({ ...baseRow, started_at: null, ended_at: null });
    expect(message).not.toMatch(/Durata:/);
  });
});
