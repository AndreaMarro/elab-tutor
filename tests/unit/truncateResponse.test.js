import { cleanAndTruncate } from '../../src/utils/truncateResponse';
import { describe, it, expect } from 'vitest';

describe('cleanAndTruncate', () => {
  it('tronca a 60 parole di default', () => {
    const long = Array(100).fill('parola').join(' ');
    const result = cleanAndTruncate(long);
    const wordCount = result.replace('...', '').trim().split(/\s+/).length;
    expect(wordCount).toBeLessThanOrEqual(60);
    expect(result).toContain('...');
  });

  it('tronca a N parole custom', () => {
    const long = Array(100).fill('parola').join(' ');
    const result = cleanAndTruncate(long, 40);
    const wordCount = result.replace('...', '').trim().split(/\s+/).length;
    expect(wordCount).toBeLessThanOrEqual(40);
  });

  it('rimuove hallucination immagine', () => {
    const text = "Ciao! Ho analizzato l'immagine che hai inviato. Il circuito ha un LED.";
    const result = cleanAndTruncate(text);
    expect(result).not.toContain('immagine');
    expect(result).toContain('Ciao');
    expect(result).toContain('LED');
  });

  it('non tronca testi corti', () => {
    const short = 'Il LED si accende solo in un verso.';
    expect(cleanAndTruncate(short)).toBe(short);
  });

  it('gestisce null/undefined', () => {
    expect(cleanAndTruncate(null)).toBe('');
    expect(cleanAndTruncate(undefined)).toBe('');
    expect(cleanAndTruncate('')).toBe('');
  });

  it('preserva tag [AZIONE:...] anche quando tronca', () => {
    const long = Array(80).fill('parola').join(' ') + ' [AZIONE:highlight:led1] [AZIONE:play]';
    const result = cleanAndTruncate(long);
    expect(result).toContain('[AZIONE:highlight:led1]');
    expect(result).toContain('[AZIONE:play]');
    // Le parole di testo sono troncate a 60
    const textOnly = result.replace(/\[AZIONE:[^\]]+\]/g, '').trim();
    const wordCount = textOnly.split(/\s+/).filter(w => w.length > 0).length;
    expect(wordCount).toBeLessThanOrEqual(60);
  });

  it('non conta tag [AZIONE:...] nel limite parole', () => {
    const text = Array(55).fill('parola').join(' ') + ' [AZIONE:highlight:led1]';
    const result = cleanAndTruncate(text);
    // 55 words < 60, so text should NOT be truncated
    expect(result).not.toContain('...');
    expect(result).toContain('[AZIONE:highlight:led1]');
  });
});
