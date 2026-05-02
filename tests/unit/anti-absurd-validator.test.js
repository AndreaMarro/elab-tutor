// Iter 41 Phase B Task B4 — Anti-absurd validator post-LLM
// User mandate: "no risposte assurde". NER cross-ref RAG chunks + Arduino Nano pin validity.
// Plan §Phase B Task B4.

import { describe, it, expect } from 'vitest';
import { validateAbsurd } from '../../supabase/functions/_shared/anti-absurd-validator.ts';

describe('Anti-absurd validator (iter 41 B4)', () => {
  // ── Pin validity ──
  it('detects nonsense pin reference D17 (Arduino Nano max D13)', () => {
    const result = validateAbsurd({
      response: 'Ragazzi, collegate al pin D17 del Nano',
      ragChunks: [],
    });
    expect(result.suspicious).toBe(true);
    expect(result.reasons).toEqual(expect.arrayContaining([expect.stringContaining('invalid_pin:D17')]));
  });

  it('passes valid Nano pin D13', () => {
    const result = validateAbsurd({
      response: 'Ragazzi, collegate al pin D13',
      ragChunks: [{ content: 'pin D13' }],
    });
    expect(result.reasons).not.toEqual(expect.arrayContaining([expect.stringContaining('invalid_pin')]));
  });

  it('passes valid Nano pin A0-A7', () => {
    const result = validateAbsurd({
      response: 'Pin A0 e A7',
      ragChunks: [],
    });
    expect(result.reasons.filter((r) => r.startsWith('invalid_pin')).length).toBe(0);
  });

  it('detects A8+ as invalid (Nano max A7)', () => {
    const result = validateAbsurd({
      response: 'pin A8 invalido',
      ragChunks: [],
    });
    expect(result.suspicious).toBe(true);
    expect(result.reasons).toEqual(expect.arrayContaining([expect.stringContaining('invalid_pin:A8')]));
  });

  // ── Component NER cross-ref ──
  it('detects fabricated component when RAG chunks lack it', () => {
    const result = validateAbsurd({
      response: 'Ragazzi, collegate il transistor 2N3055 al breadboard',
      ragChunks: [{ content: 'Vol.1 LED + resistore 220Ω in serie' }],
    });
    expect(result.suspicious).toBe(true);
    expect(result.reasons.some((r) => r.includes('ner_unmatched_component'))).toBe(true);
  });

  it('passes when component mentioned exists in chunks', () => {
    const result = validateAbsurd({
      response: 'Ragazzi, il LED rosso si accende',
      ragChunks: [{ content: 'LED rosso pin D13 resistore' }],
    });
    expect(result.reasons.filter((r) => r.includes('ner_unmatched')).length).toBe(0);
  });

  it('passes when chunks reference component family even with variation', () => {
    const result = validateAbsurd({
      response: 'Il LED si accende',
      ragChunks: [{ content: 'LED basics introduction' }],
    });
    expect(result.suspicious).toBe(false);
  });

  // ── Empty / edge ──
  it('returns suspicious=false for empty response', () => {
    const result = validateAbsurd({ response: '', ragChunks: [] });
    expect(result.suspicious).toBe(false);
    expect(result.reasons).toEqual([]);
  });

  it('returns suspicious=false for short generic Italian text', () => {
    const result = validateAbsurd({
      response: 'Ragazzi, ciao',
      ragChunks: [],
    });
    expect(result.suspicious).toBe(false);
  });

  it('handles undefined ragChunks gracefully', () => {
    const result = validateAbsurd({ response: 'Ragazzi, ciao' });
    expect(result.suspicious).toBe(false);
  });

  // ── Score range ──
  it('returns score between 0 and 1', () => {
    const r1 = validateAbsurd({ response: 'pin D17 transistor 2N3055', ragChunks: [] });
    expect(r1.score).toBeGreaterThanOrEqual(0);
    expect(r1.score).toBeLessThanOrEqual(1);
  });

  it('higher reasons count → lower score', () => {
    const clean = validateAbsurd({ response: 'Ragazzi', ragChunks: [] });
    const dirty = validateAbsurd({ response: 'pin D17 D18 D19 transistor 2N3055', ragChunks: [] });
    expect(dirty.score).toBeLessThan(clean.score);
  });

  // ── Special pins ──
  it('accepts GND / VCC / 5V / 3V3 / RESET as valid', () => {
    const result = validateAbsurd({
      response: 'Collegate GND e VCC e 5V e RESET',
      ragChunks: [],
    });
    expect(result.reasons.filter((r) => r.startsWith('invalid_pin')).length).toBe(0);
  });

  // ── Output shape ──
  it('returns suspicious + reasons + score shape', () => {
    const result = validateAbsurd({ response: 'test', ragChunks: [] });
    expect(result).toHaveProperty('suspicious');
    expect(result).toHaveProperty('reasons');
    expect(result).toHaveProperty('score');
    expect(Array.isArray(result.reasons)).toBe(true);
  });

  // ── Real-world case: PRINCIPIO ZERO + PZ V3 compliant response ──
  it('accepts realistic UNLIM Italian K-12 response with kit ELAB mention', () => {
    const result = validateAbsurd({
      response: 'Ragazzi, «Il LED è un componente che emette luce» — Vol.1 pag.27. Provate sul vostro kit ELAB.',
      ragChunks: [{ content: 'Vol.1 cap.6 LED diodo emette luce kit ELAB' }],
    });
    expect(result.suspicious).toBe(false);
  });
});
