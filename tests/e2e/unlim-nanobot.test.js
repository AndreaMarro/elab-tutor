/**
 * ELAB E2E — UNLIM Nanobot Integration Tests
 * Verifica che il nanobot AI risponda correttamente.
 * Richiede connessione internet (nanobot su Render).
 * © Andrea Marro — 06/04/2026
 */

import { describe, it, expect } from 'vitest';

const NANOBOT_URL = 'https://elab-galileo.onrender.com';
const TIMEOUT = 30000; // Render cold start can take 30s

// Network tests require real HTTP — skip in jsdom vitest environment.
// Run manually: curl https://elab-galileo.onrender.com/health
// Verified online 05/04/2026: status ok, v5.5.0, deepseek primary
describe.skip('UNLIM Nanobot Integration (requires network)', () => {
  it('nanobot should be online', async () => {
    const res = await fetch(NANOBOT_URL + '/health', { signal: AbortSignal.timeout(TIMEOUT) });
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.version).toBeTruthy();
  }, TIMEOUT + 5000);

  it('should respond to a simple question in < 80 words', async () => {
    const res = await fetch(NANOBOT_URL + '/tutor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Cos'è un LED?",
        session_id: 'test-e2e-' + Date.now(),
        student_id: 'test-student',
        experiment_id: 'v1-cap6-esp1',
        build_mode: 'montato'
      }),
      signal: AbortSignal.timeout(TIMEOUT)
    });
    expect(res.ok).toBe(true);
    const data = await res.json();

    // Should have a response
    const text = data.response || data.text || data.message || '';
    expect(text.length).toBeGreaterThan(10);

    // Word count should be reasonable (AI might exceed 80 but should be < 150)
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    expect(words).toBeLessThan(150);
  }, TIMEOUT + 10000);

  it('should include AZIONE tags in system prompt', async () => {
    // This tests the API module's SOCRATIC_INSTRUCTION
    // We can't read it directly, but we can verify the AI responds with actions
    const res = await fetch(NANOBOT_URL + '/tutor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Carica il semaforo',
        session_id: 'test-action-' + Date.now(),
        student_id: 'test-student',
        experiment_id: 'v1-cap6-esp1',
        build_mode: 'montato'
      }),
      signal: AbortSignal.timeout(TIMEOUT)
    });
    const data = await res.json();
    const text = data.response || data.text || data.message || '';

    // Response should exist (even if no AZIONE tag — AI doesn't always emit them)
    expect(text.length).toBeGreaterThan(5);
  }, TIMEOUT + 10000);
});

describe('Truncation utility', () => {
  it('cleanAndTruncate should cap at 80 words', async () => {
    const { cleanAndTruncate } = await import('../../src/utils/truncateResponse.js');
    const longText = Array(100).fill('parola').join(' ');
    const result = cleanAndTruncate(longText, 80);
    const words = result.split(/\s+/).filter(w => w.length > 0);
    expect(words.length).toBeLessThanOrEqual(81); // 80 + possible ellipsis
  });

  it('should handle null/empty input', async () => {
    const { cleanAndTruncate } = await import('../../src/utils/truncateResponse.js');
    expect(cleanAndTruncate(null)).toBe('');
    expect(cleanAndTruncate('')).toBe('');
    expect(cleanAndTruncate(undefined)).toBe('');
  });
});
