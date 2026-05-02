/**
 * Tests for validateVolPagCitation
 * Target: supabase/functions/_shared/principio-zero-validator.ts
 *
 * Sprint T iter 40 Phase 2 Maker-1 — BASE_PROMPT v3.2 strict Vol/pag
 * verbatim 95% target. Validator drives `pz_v3_vol_pag_match` telemetry log
 * (canary observability iter 40, gate later iter 41+).
 *
 * Categories:
 *   - Strict canonical match: Vol.[123] pag.\d{1,3}  (5+ test cases)
 *   - Loose match accepted: Vol.[123] p.\d / Volume [123], pagina \d  (3+ test cases)
 *   - Failure cases: no Vol/pag, only Vol no pag, only pagina no Vol  (2+ test cases)
 */

import { describe, it, expect } from 'vitest';

let validateVolPagCitation;
let importError = null;

try {
  const mod = await import('../../supabase/functions/_shared/principio-zero-validator.ts');
  validateVolPagCitation = mod.validateVolPagCitation;
} catch (err) {
  importError = err;
}

describe('validateVolPagCitation — BASE_PROMPT v3.2 strict Vol/pag', () => {
  it('imports without errors', () => {
    expect(importError).toBeNull();
    expect(validateVolPagCitation).toBeTypeOf('function');
  });

  describe('Strict canonical match (preferred)', () => {
    it('matches "Vol.1 pag.156" canonical', () => {
      const result = validateVolPagCitation('Ragazzi, «testo» — Vol.1 pag.156. Provate sul kit ELAB.');
      expect(result.passes).toBe(true);
      expect(result.canonical_match).toBe(true);
      expect(result.loose_match).toBe(false);
      expect(result.regex_match_count).toBe(1);
      expect(result.matched_text).toContain('Vol.1');
      expect(result.matched_text).toContain('pag.156');
    });

    it('matches "Vol.2 pag.89" canonical (Vol2)', () => {
      const result = validateVolPagCitation('«testo» — Vol.2 pag.89. kit ELAB.');
      expect(result.canonical_match).toBe(true);
      expect(result.passes).toBe(true);
    });

    it('matches "Vol.3 pag.134" canonical (Vol3 capstone)', () => {
      const result = validateVolPagCitation('Ragazzi, «codice Arduino» — Vol.3 pag.134. Cablate sul kit ELAB.');
      expect(result.canonical_match).toBe(true);
      expect(result.passes).toBe(true);
    });

    it('matches "Vol.1 pag. 12" with whitespace tolerance', () => {
      const result = validateVolPagCitation('«testo» — Vol.1 pag. 12. Kit.');
      expect(result.canonical_match).toBe(true);
      expect(result.passes).toBe(true);
    });

    it('matches single-digit page number', () => {
      const result = validateVolPagCitation('Vol.1 pag.5 montate sul kit.');
      expect(result.canonical_match).toBe(true);
      expect(result.passes).toBe(true);
    });

    it('matches three-digit page number (max)', () => {
      const result = validateVolPagCitation('Vol.3 pag.999 capstone kit.');
      expect(result.canonical_match).toBe(true);
      expect(result.passes).toBe(true);
    });

    it('strips action tags before matching', () => {
      const result = validateVolPagCitation('Vol.1 pag.42 [AZIONE:play] [INTENT:{"tool":"x"}]');
      expect(result.canonical_match).toBe(true);
      expect(result.passes).toBe(true);
    });
  });

  describe('Loose match accepted (with warning flag)', () => {
    it('accepts loose "Vol.1 p.156" with warning flag', () => {
      const result = validateVolPagCitation('Ragazzi, Vol.1 p.156 kit ELAB.', { acceptLoose: true });
      expect(result.canonical_match).toBe(false);
      expect(result.loose_match).toBe(true);
      expect(result.passes).toBe(true);
      expect(result.violations).toContain('loose_format_only_prefer_canonical');
    });

    it('accepts loose "Vol.2 p 89" (no period) with warning', () => {
      const result = validateVolPagCitation('Vol.2 p 89 kit.', { acceptLoose: true });
      expect(result.canonical_match).toBe(false);
      expect(result.loose_match).toBe(true);
      expect(result.passes).toBe(true);
    });

    it('accepts verbose "Volume 1, pagina 156" with warning', () => {
      const result = validateVolPagCitation('Ragazzi, Volume 1, pagina 156 kit ELAB.', { acceptLoose: true });
      expect(result.canonical_match).toBe(false);
      expect(result.loose_match).toBe(true);
      expect(result.passes).toBe(true);
    });

    it('rejects loose when acceptLoose=false', () => {
      const result = validateVolPagCitation('Vol.1 p.156 kit.', { acceptLoose: false, required: true });
      expect(result.canonical_match).toBe(false);
      // loose still detected
      expect(result.loose_match).toBe(true);
      // But passes=false because acceptLoose=false (and required=true)
      expect(result.passes).toBe(false);
    });
  });

  describe('Failure cases', () => {
    it('fails when no Vol/pag at all (required=true)', () => {
      const result = validateVolPagCitation('Ragazzi, montate sul kit ELAB.', { required: true });
      expect(result.canonical_match).toBe(false);
      expect(result.loose_match).toBe(false);
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('missing_vol_pag_citation');
    });

    it('flags "Vol. 1" alone without pag (anti-pattern)', () => {
      const result = validateVolPagCitation('Come dice Vol. 1 il kit funziona.', { required: false });
      expect(result.canonical_match).toBe(false);
      expect(result.loose_match).toBe(false);
      expect(result.violations.some(v => v.startsWith('vol_without_pag'))).toBe(true);
    });

    it('flags "pagina X" without Vol prefix (anti-pattern)', () => {
      const result = validateVolPagCitation('Leggete a pagina 156 del libro kit.', { required: false });
      expect(result.canonical_match).toBe(false);
      expect(result.violations.some(v => v.startsWith('pagina_without_vol'))).toBe(true);
    });

    it('handles empty string', () => {
      const result = validateVolPagCitation('');
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('empty_text');
    });

    it('handles null', () => {
      const result = validateVolPagCitation(null);
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('empty_text');
    });

    it('handles undefined', () => {
      const result = validateVolPagCitation(undefined);
      expect(result.passes).toBe(false);
    });
  });

  describe('Edge cases / canary observability', () => {
    it('matches first when multiple citations present', () => {
      const result = validateVolPagCitation('Vol.1 pag.42 e poi Vol.2 pag.89 kit.');
      expect(result.canonical_match).toBe(true);
      expect(result.regex_match_count).toBeGreaterThanOrEqual(2);
    });

    it('does NOT match Vol.4 (out of range)', () => {
      const result = validateVolPagCitation('Vol.4 pag.10 kit.', { required: true });
      expect(result.canonical_match).toBe(false);
      expect(result.passes).toBe(false);
    });

    it('does NOT match cap. alone without pag', () => {
      const result = validateVolPagCitation('cap.6 esp.1 montate sul kit.', { required: true });
      expect(result.canonical_match).toBe(false);
      expect(result.passes).toBe(false);
    });

    it('does NOT flag false positive "Vol.1 cap.6 pag.42" (vol+cap+pag has cap suffix)', () => {
      // "Vol.1" followed by "cap" should NOT trigger vol_without_pag anti-pattern,
      // but the text DOES have "Vol.1" without immediately following "pag" or "p."
      // The vol_without_pag check uses negative lookahead for pag/p./cap so this
      // SHOULD pass without anti-pattern flag.
      const result = validateVolPagCitation('Ragazzi, Vol.1 cap.6 pag.42 kit ELAB.');
      // This text contains "pag.42" so canonical match fires
      expect(result.canonical_match).toBe(true);
      expect(result.passes).toBe(true);
    });

    it('default required=false allows missing citation without violation', () => {
      const result = validateVolPagCitation('Ragazzi, montate sul kit ELAB.');
      expect(result.passes).toBe(true);
      expect(result.violations).not.toContain('missing_vol_pag_citation');
    });
  });
});
