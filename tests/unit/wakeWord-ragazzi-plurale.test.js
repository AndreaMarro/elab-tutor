// Iter 41 Phase D Task D1 — Wake word "Ragazzi" plurale compound trigger.
// PRINCIPIO ZERO §1 plurale "Ragazzi" mandate. Andrea iter 21 carryover.
// Plan §Phase D Task D1.

import { describe, it, expect } from 'vitest';

// Mirror WAKE_PHRASES from src/services/wakeWord.js (iter 41 D1 update).
// Tests verify behavior matches the source array — keep in sync.
const WAKE_PHRASES = [
  'ehi unlim', 'hey unlim', 'ei unlim', 'ehi un lim',
  'hey un lim', 'ei un lim', 'e unlim', 'ehi anelim',
  'hey anelim', 'ehi online', 'hey online',
  'ragazzi unlim', 'ragazzi un lim', 'ragazzi anelim',
];

function detectWakeWord(transcript) {
  const lower = (transcript || '').toLowerCase().trim();
  return WAKE_PHRASES.some((phrase) => lower.includes(phrase));
}

function extractCommandAfterWake(transcript) {
  const lower = (transcript || '').toLowerCase().trim();
  for (const phrase of WAKE_PHRASES) {
    const idx = lower.indexOf(phrase);
    if (idx >= 0) return lower.substring(idx + phrase.length).trim();
  }
  return '';
}

describe('Wake word "Ragazzi" plurale compound (iter 41 D1)', () => {
  it('triggers on "ragazzi unlim guardate il LED"', () => {
    expect(detectWakeWord('ragazzi unlim guardate il LED')).toBe(true);
    expect(extractCommandAfterWake('ragazzi unlim guardate il LED')).toBe('guardate il led');
  });

  it('triggers on "Ragazzi UNLIM" case-insensitive', () => {
    expect(detectWakeWord('Ragazzi UNLIM')).toBe(true);
  });

  it('triggers on "ragazzi anelim" speech-recognition variant', () => {
    expect(detectWakeWord('ragazzi anelim verifica')).toBe(true);
    expect(extractCommandAfterWake('ragazzi anelim verifica')).toBe('verifica');
  });

  it('triggers on "ragazzi un lim" word-split variant', () => {
    expect(detectWakeWord('ragazzi un lim mostra il pin D13')).toBe(true);
  });

  it('does NOT trigger on plain "Ragazzi, vediamo il LED" (no UNLIM compound)', () => {
    expect(detectWakeWord('Ragazzi, vediamo il LED')).toBe(false);
  });

  it('does NOT trigger on singolare "Ragazzo" (PRINCIPIO ZERO plurale only)', () => {
    expect(detectWakeWord('Ragazzo guarda')).toBe(false);
  });

  it('does NOT trigger on "Ragazzi, ehi" (without UNLIM compound)', () => {
    expect(detectWakeWord('Ragazzi, ehi')).toBe(false);
  });

  it('preserves backward compat "ehi unlim" trigger (iter 36)', () => {
    expect(detectWakeWord('ehi unlim')).toBe(true);
  });

  it('preserves backward compat "hey unlim" trigger', () => {
    expect(detectWakeWord('hey unlim')).toBe(true);
  });

  it('extracts command after "ragazzi unlim" compound', () => {
    expect(extractCommandAfterWake('ragazzi unlim diagnostica il MOSFET')).toBe('diagnostica il mosfet');
  });

  it('returns empty command when transcript is exactly the wake phrase', () => {
    expect(extractCommandAfterWake('ragazzi unlim')).toBe('');
  });

  it('handles whitespace + punctuation around "ragazzi unlim"', () => {
    expect(detectWakeWord('  Ragazzi unlim, guardate qui  ')).toBe(true);
    expect(extractCommandAfterWake('  Ragazzi unlim, guardate qui  ')).toBe(', guardate qui');
  });
});
