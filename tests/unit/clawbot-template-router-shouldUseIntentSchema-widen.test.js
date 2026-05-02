/**
 * Tests for shouldUseIntentSchema widened heuristic (iter 40 Phase 2).
 * Target: supabase/functions/_shared/clawbot-template-router.ts
 *
 * Sprint T close iter 40 BASE_PROMPT v3.2 — Phase 2 Maker-1 widen
 * `shouldUseIntentSchema` per Sprint U Cycle 1 evidence (R7 fixture v53
 * Tester-6 95%+ passes WITHOUT schema mode due narrow heuristic).
 *
 * 5+ NEW heuristic categories vs canonical narrow ACTION_TRIGGER_RE:
 *   1. EXPLANATION (spiega, descrivi, illustra)
 *   2. DIAGNOSTIC (diagnos*, controlla, verifica, errore, perché non)
 *   3. VERIFICATION (guarda, osserva, esamina, ispeziona)
 *   4. STEP-BY-STEP (passo passo, step by step, come si fa)
 *   5. INTERACTIVE (prova, testa, simula)
 *
 * Backward compat: superset of ACTION_TRIGGER_RE narrow patterns from
 * intent-tools-schema.ts.
 */

import { describe, it, expect } from 'vitest';

let shouldUseIntentSchema;
let categorizeIntentTriggers;
let SHOULD_USE_INTENT_SCHEMA_VERSION;
let importError = null;

try {
  const mod = await import('../../supabase/functions/_shared/clawbot-template-router.ts');
  shouldUseIntentSchema = mod.shouldUseIntentSchema;
  categorizeIntentTriggers = mod.categorizeIntentTriggers;
  SHOULD_USE_INTENT_SCHEMA_VERSION = mod.SHOULD_USE_INTENT_SCHEMA_VERSION;
} catch (err) {
  importError = err;
}

describe('shouldUseIntentSchema widened (iter 40 Phase 2)', () => {
  it('imports without errors', () => {
    expect(importError).toBeNull();
    expect(shouldUseIntentSchema).toBeTypeOf('function');
    expect(SHOULD_USE_INTENT_SCHEMA_VERSION).toBe('2.0-iter40-widened');
  });

  describe('Backward compat — narrow ACTION_TRIGGER_RE patterns still match', () => {
    it('matches "mostra" (canonical narrow)', () => {
      expect(shouldUseIntentSchema('mostra il LED')).toBe(true);
    });

    it('matches "evidenzia" (canonical narrow)', () => {
      expect(shouldUseIntentSchema('evidenzia il resistore')).toBe(true);
    });

    it('matches "carica" (canonical narrow)', () => {
      expect(shouldUseIntentSchema('carica esperimento v1-cap6-esp1')).toBe(true);
    });

    it('matches "screenshot" (canonical narrow)', () => {
      expect(shouldUseIntentSchema('cattura uno screenshot')).toBe(true);
    });

    it('matches "monta" (canonical narrow)', () => {
      expect(shouldUseIntentSchema('monta il circuito')).toBe(true);
    });
  });

  describe('CATEGORY 1 — Explanation requests (NEW iter 40)', () => {
    it('matches "spiega"', () => {
      expect(shouldUseIntentSchema('spiega come funziona il LED')).toBe(true);
    });

    it('matches "spiegami"', () => {
      expect(shouldUseIntentSchema('spiegami il PWM')).toBe(true);
    });

    it('matches "descrivi"', () => {
      expect(shouldUseIntentSchema('descrivi il circuito')).toBe(true);
    });

    it('matches "illustra"', () => {
      expect(shouldUseIntentSchema('illustra il funzionamento')).toBe(true);
    });
  });

  describe('CATEGORY 2 — Diagnostic requests (NEW iter 40)', () => {
    it('matches "diagnostica"', () => {
      expect(shouldUseIntentSchema('diagnostica il problema')).toBe(true);
    });

    it('matches "diagnosti" stem (diagnosi/diagnostica)', () => {
      expect(shouldUseIntentSchema('fai diagnosi del circuito')).toBe(true);
    });

    it('matches "controlla"', () => {
      expect(shouldUseIntentSchema('controlla le connessioni')).toBe(true);
    });

    it('matches "verifica"', () => {
      expect(shouldUseIntentSchema('verifica il codice')).toBe(true);
    });

    it('matches "controlliamo" plurale', () => {
      expect(shouldUseIntentSchema('controlliamo insieme')).toBe(true);
    });

    it('matches "perché non funziona"', () => {
      expect(shouldUseIntentSchema('perché non funziona il LED?')).toBe(true);
    });

    it('matches "errore"', () => {
      expect(shouldUseIntentSchema('c\'è un errore nel circuito')).toBe(true);
    });
  });

  describe('CATEGORY 3 — Circuit verification (NEW iter 40)', () => {
    it('matches "guarda"', () => {
      expect(shouldUseIntentSchema('guarda il circuito')).toBe(true);
    });

    it('matches "osserva"', () => {
      expect(shouldUseIntentSchema('osserva i collegamenti')).toBe(true);
    });

    it('matches "esamina"', () => {
      expect(shouldUseIntentSchema('esamina la breadboard')).toBe(true);
    });

    it('matches "ispeziona"', () => {
      expect(shouldUseIntentSchema('ispeziona i pin Arduino')).toBe(true);
    });
  });

  describe('CATEGORY 4 — Step-by-step requests (NEW iter 40)', () => {
    it('matches "passo passo"', () => {
      expect(shouldUseIntentSchema('mostrami passo passo')).toBe(true);
    });

    it('matches "step by step"', () => {
      expect(shouldUseIntentSchema('explain step by step')).toBe(true);
    });

    it('matches "come si fa"', () => {
      expect(shouldUseIntentSchema('come si fa a montare?')).toBe(true);
    });

    it('matches "come faccio"', () => {
      expect(shouldUseIntentSchema('come faccio a collegare?')).toBe(true);
    });
  });

  describe('CATEGORY 5 — Interactive verbs (NEW iter 40)', () => {
    it('matches "prova"', () => {
      expect(shouldUseIntentSchema('prova il circuito')).toBe(true);
    });

    it('matches "proviamo"', () => {
      expect(shouldUseIntentSchema('proviamo insieme')).toBe(true);
    });

    it('matches "testa"', () => {
      expect(shouldUseIntentSchema('testa la connessione')).toBe(true);
    });

    it('matches "simula"', () => {
      expect(shouldUseIntentSchema('simula il comportamento')).toBe(true);
    });
  });

  describe('Negative cases — pure chit-chat / pure explanation should still NOT match', () => {
    it('does NOT match pure greeting', () => {
      expect(shouldUseIntentSchema('Ciao!')).toBe(false);
    });

    it('does NOT match thank-you', () => {
      expect(shouldUseIntentSchema('grazie mille')).toBe(false);
    });

    it('does NOT match plain factual (no trigger verb)', () => {
      expect(shouldUseIntentSchema('Il LED è un diodo')).toBe(false);
    });

    it('handles null gracefully', () => {
      expect(shouldUseIntentSchema(null)).toBe(false);
    });

    it('handles undefined gracefully', () => {
      expect(shouldUseIntentSchema(undefined)).toBe(false);
    });

    it('handles empty string', () => {
      expect(shouldUseIntentSchema('')).toBe(false);
    });

    it('handles non-string input', () => {
      expect(shouldUseIntentSchema(42)).toBe(false);
      expect(shouldUseIntentSchema({})).toBe(false);
    });
  });

  describe('categorizeIntentTriggers — telemetry helper', () => {
    it('returns empty array for non-matching message', () => {
      const cats = categorizeIntentTriggers('ciao!');
      expect(cats).toEqual([]);
    });

    it('returns "narrow_action" for narrow-action verb', () => {
      const cats = categorizeIntentTriggers('mostra il LED');
      expect(cats).toContain('narrow_action');
    });

    it('returns "explanation" for spiega', () => {
      const cats = categorizeIntentTriggers('spiega il PWM');
      expect(cats).toContain('explanation');
    });

    it('returns "diagnostic" for verifica', () => {
      const cats = categorizeIntentTriggers('verifica il circuito');
      expect(cats).toContain('diagnostic');
    });

    it('returns "step_by_step" for passo passo', () => {
      const cats = categorizeIntentTriggers('mostrami passo passo');
      expect(cats).toContain('step_by_step');
    });

    it('returns multiple categories for compound message', () => {
      const cats = categorizeIntentTriggers('spiega passo passo come funziona');
      expect(cats).toContain('explanation');
      expect(cats).toContain('step_by_step');
    });
  });
});
