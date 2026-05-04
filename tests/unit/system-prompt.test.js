/**
 * Unit tests for system-prompt.ts (Sprint T iter 35 Phase 2 Atom E3).
 *
 * Validates BASE_PROMPT v3.3 §6 paletti expansion (Andrea-explicit
 * "deve poter andare anche un po' oltre al contenuto elab, mantenendo dei paletti")
 * + getCategoryCapWordsBlock helper (iter 34 A1 baseline preserved).
 *
 * Smoke prompt assertions (NOT LLM call): regex on prompt content.
 *  - § 6 OK list contains: matematica, fisica, biologia, scienze, chimica, geografia, storia
 *  - § 6 NO HARD DEFLECT list contains: politica, religione, NSFW
 *  - § 6 SOFT PIVOT bridge pattern present (analogia educational)
 *  - PRINCIPIO ZERO §1 plurale "Ragazzi" invariant present
 *  - Kit ELAB closing invite invariant present
 *
 * (c) Andrea Marro 2026-05-04 — ELAB Tutor iter 35 Phase 2
 */

import { describe, it, expect } from 'vitest';
import {
  buildSystemPrompt,
  getCategoryCapWordsBlock,
} from '../../supabase/functions/_shared/system-prompt.ts';

describe('system-prompt — buildSystemPrompt baseline (iter 35 E3)', () => {
  it('produces a non-empty Italian prompt with UNLIM persona', () => {
    const p = buildSystemPrompt(null);
    expect(typeof p).toBe('string');
    expect(p.length).toBeGreaterThan(2000);
    expect(p).toMatch(/UNLIM/);
    expect(p).toMatch(/ELAB/);
  });

  it('contains PRINCIPIO ZERO §1 plurale "Ragazzi" invariant', () => {
    const p = buildSystemPrompt(null);
    expect(p).toMatch(/Ragazzi/);
  });

  it('contains kit ELAB physical mention invariant', () => {
    const p = buildSystemPrompt(null);
    expect(p).toMatch(/kit ELAB/i);
  });
});

describe('system-prompt — §6 paletti v3.3 OK list (iter 35 E3)', () => {
  it('§6 OK explicit lists: matematica, fisica, biologia, scienze, chimica, geografia, storia', () => {
    const p = buildSystemPrompt(null);
    // All 7 Andrea-explicit OK educational categories present.
    expect(p).toMatch(/matematica/i);
    expect(p).toMatch(/fisica/i);
    expect(p).toMatch(/biologia/i);
    expect(p).toMatch(/chimica/i);
    expect(p).toMatch(/scienze/i);
    expect(p).toMatch(/geografia/i);
    expect(p).toMatch(/storia/i);
  });

  it('§6 OK list mentions analogical bridge pattern to kit ELAB (Sense 2 Morfismo)', () => {
    const p = buildSystemPrompt(null);
    // Bridge pattern keywords: "ponte analogico" OR "analogia" near kit ELAB.
    expect(p).toMatch(/(ponte analogico|analogia)/i);
  });
});

describe('system-prompt — §6 paletti v3.3 NO HARD DEFLECT list (iter 35 E3)', () => {
  it('§6 HARD NO explicit lists: politica, religione, NSFW/adulti, violenza, illegali', () => {
    const p = buildSystemPrompt(null);
    expect(p).toMatch(/politica/i);
    expect(p).toMatch(/religione/i);
    // NSFW content: "adulti" OR "sessualità" OR "NSFW".
    expect(p).toMatch(/(adulti|sessualit|NSFW)/i);
    expect(p).toMatch(/violenza/i);
    expect(p).toMatch(/illegali/i);
  });

  it('§6 HARD NO redirect pattern: warm tone + kit ELAB redirect (NEVER giudicante)', () => {
    const p = buildSystemPrompt(null);
    // The hard-no pattern must include a redirect to kit ELAB.
    expect(p).toMatch(/Torniamo all.esperimento.*kit ELAB/);
  });
});

describe('system-prompt — §6 paletti v3.3 SOFT PIVOT (iter 35 E3)', () => {
  it('§6 SOFT PIVOT lists: sport, gaming, social, meteo, calcio', () => {
    const p = buildSystemPrompt(null);
    expect(p).toMatch(/sport/i);
    expect(p).toMatch(/gaming/i);
    expect(p).toMatch(/social/i);
    expect(p).toMatch(/meteo/i);
    expect(p).toMatch(/calcio/i);
  });

  it('§6 SOFT PIVOT shows worked example with kit ELAB invite', () => {
    const p = buildSystemPrompt(null);
    // Soft pivot worked examples reference kit + LED/sensori.
    expect(p).toMatch(/sensori|LED/);
  });
});

describe('system-prompt — getCategoryCapWordsBlock (iter 34 A1 preserved)', () => {
  it('returns empty string for invalid category or capWords <=0', () => {
    expect(getCategoryCapWordsBlock('', 60)).toBe('');
    expect(getCategoryCapWordsBlock('default', 0)).toBe('');
    expect(getCategoryCapWordsBlock('default', -10)).toBe('');
  });

  it('returns block with category name + capWords for chit_chat', () => {
    const block = getCategoryCapWordsBlock('chit_chat', 30);
    expect(block).toMatch(/chit_chat/);
    expect(block).toMatch(/30 parole/);
    expect(block).toMatch(/Ragazzi/);
  });

  it('returns block with deep_question instructions for deep category', () => {
    // iter 35 E2 capWords now 400, but helper is value-driven (just renders capWords).
    const block = getCategoryCapWordsBlock('deep_question', 400);
    expect(block).toMatch(/deep_question/);
    expect(block).toMatch(/400 parole/);
    // Deep questions should mandate Vol/pag citation + analogia.
    expect(block).toMatch(/Vol.pag/i);
    expect(block).toMatch(/analogia/i);
  });

  it('returns block with off_topic soft-deflect kit pattern', () => {
    const block = getCategoryCapWordsBlock('off_topic', 80);
    expect(block).toMatch(/off_topic/);
    expect(block).toMatch(/80 parole/);
    expect(block).toMatch(/kit/i);
  });
});
