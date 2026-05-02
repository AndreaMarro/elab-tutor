// Iter 41 Phase A Task A1 — Mistral routing narrow Large triggers
// Goal: short simple prompts route Small only, Large fires only on multi-step + complex diagnostic.
// Reference: docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md §Phase A Task A1
// Lift target: -2000ms cap on complex prompts (Large 5.4s → Small 2-3s when not multi-step).

import { describe, it, expect } from 'vitest';
import { selectMistralModel } from '../../supabase/functions/_shared/llm-client.ts';

describe('Mistral routing narrow Large triggers (iter 41 A1)', () => {
  it('returns mistral-small-latest for short simple prompts (<50 words)', () => {
    const result = selectMistralModel({
      message: 'Cosa fa il LED?',
    });
    expect(result.model).toBe('mistral-small-latest');
    expect(result.routing_reason).toMatch(/short|simple|default/);
  });

  it('returns mistral-large-latest only for multi-step + diagnostic complex prompts', () => {
    const result = selectMistralModel({
      message: 'Verifica il circuito Arduino e diagnostica passo per passo eventuali errori sui pin digitali',
    });
    expect(result.model).toBe('mistral-large-latest');
    expect(result.routing_reason).toMatch(/multi-step.*diagnostic|diagnostic.*multi-step/);
  });

  it('falls back to mistral-small-latest for verifica-only single step', () => {
    const result = selectMistralModel({
      message: 'Verifica il LED',
    });
    expect(result.model).toBe('mistral-small-latest');
  });

  it('returns mistral-large-latest for long prompts >50 words even without multi-step', () => {
    const longPrompt = Array.from({ length: 60 }, (_, i) => `parola${i}`).join(' ');
    const result = selectMistralModel({
      message: longPrompt,
    });
    expect(result.model).toBe('mistral-large-latest');
    expect(result.routing_reason).toMatch(/long-prompt-50w/);
  });

  it('detects multi-step "passo per passo" trigger', () => {
    const result = selectMistralModel({
      message: 'Spiega passo per passo come collegare il LED',
    });
    // Has multi-step but NOT complex diagnostic → small (only when both)
    expect(result.model).toBe('mistral-small-latest');
  });

  it('detects complex diagnostic via "controlla la sequenza" trigger', () => {
    const result = selectMistralModel({
      message: 'Controlla la sequenza degli errori e diagnostica le cause',
    });
    // Has complex diagnostic but NOT explicit multi-step → small
    expect(result.model).toBe('mistral-small-latest');
  });

  it('returns mistral-large-latest when hasMultiStep + hasComplexDiagnostic explicit override', () => {
    const result = selectMistralModel({
      message: 'short',
      hasMultiStep: true,
      hasComplexDiagnostic: true,
    });
    expect(result.model).toBe('mistral-large-latest');
  });

  it('returns mistral-small-latest by default with no overrides on minimal input', () => {
    const result = selectMistralModel({
      message: '',
    });
    expect(result.model).toBe('mistral-small-latest');
  });

  it('exposes routing_reason for telemetry observability', () => {
    const result = selectMistralModel({ message: 'test' });
    expect(typeof result.routing_reason).toBe('string');
    expect(result.routing_reason.length).toBeGreaterThan(0);
  });

  it('counts words correctly (50 word boundary)', () => {
    const exactly50 = Array.from({ length: 50 }, (_, i) => `w${i}`).join(' ');
    const exactly51 = Array.from({ length: 51 }, (_, i) => `w${i}`).join(' ');
    expect(selectMistralModel({ message: exactly50 }).model).toBe('mistral-small-latest');
    expect(selectMistralModel({ message: exactly51 }).model).toBe('mistral-large-latest');
  });
});
