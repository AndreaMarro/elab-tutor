import { describe, it, expect } from 'vitest';
import {
  alreadyCitesBook,
  buildCitationSuffix,
  ensureBookCitation,
} from '../../src/services/bookCitation';

describe('bookCitation — UNLIM cites the ELAB book for known experiments', () => {
  // ── alreadyCitesBook ────────────────────────────
  describe('alreadyCitesBook', () => {
    it('detects "pagina N"', () => {
      expect(alreadyCitesBook('Come dice il libro a pagina 29, il LED...')).toBe(true);
    });

    it('detects "pag. N"', () => {
      expect(alreadyCitesBook('Vedi pag. 45 del volume.')).toBe(true);
    });

    it('detects "Vol. N"', () => {
      expect(alreadyCitesBook('Nel Vol. 2 trovi il transistor.')).toBe(true);
    });

    it('detects "volume N"', () => {
      expect(alreadyCitesBook('Il volume 3 parla di Arduino.')).toBe(true);
    });

    it('detects the V1P45 shorthand used by RAG citations', () => {
      expect(alreadyCitesBook('[V1P45] Il fotoresistore...')).toBe(true);
    });

    it('returns false when no citation is present', () => {
      expect(alreadyCitesBook('Il LED si accende quando la corrente scorre.')).toBe(false);
    });

    it('returns false for non-string input (defensive)', () => {
      expect(alreadyCitesBook(null)).toBe(false);
      expect(alreadyCitesBook(undefined)).toBe(false);
      expect(alreadyCitesBook(42)).toBe(false);
      expect(alreadyCitesBook({})).toBe(false);
    });

    it('is case-insensitive', () => {
      expect(alreadyCitesBook('VOLUME 1 pagina 10')).toBe(true);
      expect(alreadyCitesBook('Pagina 10 del libro')).toBe(true);
    });
  });

  // ── buildCitationSuffix ─────────────────────────
  describe('buildCitationSuffix', () => {
    it('returns a formatted "(Riferimento: Vol. N, pag. M del libro ELAB.)" for a known experiment', () => {
      // v1-cap6-esp1 → volume 1 page 29 per volume-references.js
      const suffix = buildCitationSuffix('v1-cap6-esp1');
      expect(suffix).toBe('(Riferimento: Vol. 1, pag. 29 del libro ELAB.)');
    });

    it('returns null for an unknown experiment id', () => {
      expect(buildCitationSuffix('unknown-xyz')).toBeNull();
    });

    it('returns null for null/undefined input', () => {
      expect(buildCitationSuffix(null)).toBeNull();
      expect(buildCitationSuffix(undefined)).toBeNull();
    });
  });

  // ── ensureBookCitation ──────────────────────────
  describe('ensureBookCitation', () => {
    it('passes through when no experimentId', () => {
      expect(ensureBookCitation('Il LED si accende.', null)).toBe('Il LED si accende.');
      expect(ensureBookCitation('Il LED si accende.', undefined)).toBe('Il LED si accende.');
      expect(ensureBookCitation('Il LED si accende.', '')).toBe('Il LED si accende.');
    });

    it('passes through when the reply already cites the book', () => {
      const reply = 'Come dice il libro a pagina 29, il LED è come una porta.';
      expect(ensureBookCitation(reply, 'v1-cap6-esp1')).toBe(reply);
    });

    it('appends a citation when the reply does NOT cite the book', () => {
      const reply = 'Il LED si accende quando la corrente scorre dal + al -.';
      const out = ensureBookCitation(reply, 'v1-cap6-esp1');
      expect(out).toContain(reply.trimEnd());
      expect(out).toContain('Vol. 1');
      expect(out).toContain('pag. 29');
      expect(alreadyCitesBook(out)).toBe(true);
    });

    it('keeps a single space when the reply ends with sentence punctuation', () => {
      const out = ensureBookCitation('Perfetto!', 'v1-cap6-esp1');
      expect(out).toBe('Perfetto! (Riferimento: Vol. 1, pag. 29 del libro ELAB.)');
    });

    it('adds a period when the reply does not end with punctuation', () => {
      const out = ensureBookCitation('Controlla il verso del LED', 'v1-cap6-esp1');
      expect(out.startsWith('Controlla il verso del LED. ')).toBe(true);
      expect(out).toContain('Vol. 1');
    });

    it('does not crash on non-string input (pass-through)', () => {
      expect(ensureBookCitation(null, 'v1-cap6-esp1')).toBeNull();
      expect(ensureBookCitation(undefined, 'v1-cap6-esp1')).toBeUndefined();
      expect(ensureBookCitation(42, 'v1-cap6-esp1')).toBe(42);
    });

    it('handles unknown experimentId defensively', () => {
      const reply = 'Ciao ragazzi!';
      expect(ensureBookCitation(reply, 'unknown-id-xyz')).toBe(reply);
    });

    it('achieves >=80% citation rate on 10 simulated replies for v1-cap6-esp1 (PDR target)', () => {
      const replies = [
        'Il LED si accende quando la corrente fluisce.',
        'Prova a girare il LED: la gamba lunga va verso il +.',
        'La resistenza è come un tubo stretto per la corrente.',
        'Controlla il collegamento della breadboard.',
        'Serve la batteria da 9 volt.',
        'Il circuito è pronto, ora compila il codice!',
        'Perfetto! Adesso il LED dovrebbe lampeggiare.',
        'Attenzione, potresti aver invertito il LED.',
        'digitalWrite(13, HIGH) accende il pin 13.',
        'Non funziona? Prova a rimettere il cavo sul bus +.',
      ];
      const cited = replies
        .map(r => ensureBookCitation(r, 'v1-cap6-esp1'))
        .filter(r => alreadyCitesBook(r));
      expect(cited.length).toBeGreaterThanOrEqual(8); // PDR TASK 7 target
      expect(cited.length).toBe(10); // In fact 10/10 because the helper is deterministic
    });
  });
});
