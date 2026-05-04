/**
 * Integration test for unlim-session-description Edge Function (iter 35
 * Phase 2 Atom I3).
 *
 * Scope:
 *   - Validates the prompt-assembly contract (helpers + LLM client signature).
 *   - The serve() handler in index.ts is exercised at deploy-time only; this
 *     test covers the runtime-agnostic surface (helpers + CORS/auth contract
 *     constants from guards.ts).
 *
 * NOT in scope:
 *   - Live HTTP smoke against deployed Edge Function (defer post-deploy curl
 *     gate per CoV step 4 documented in audit doc).
 *   - Supabase row fetch (mocked indirectly via SessionRow shape contract).
 *
 * Pattern follows tests/integration/unlim-chat-prompt-v3.test.js (Sprint S
 * iter 2) — shared helpers tested under Node, Edge Function tested via
 * curl smoke in audit handoff.
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

// NOTE: guards.ts imports an https://esm.sh URL which the Node ESM loader
// cannot resolve. We assert the integration boundary by reading the guards.ts
// source file and grep-asserting that verifyElabApiKey + getCorsHeaders +
// getSecurityHeaders + checkBodySize are exported (deploy-time verified
// separately via curl smoke documented in audit handoff).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const GUARDS_PATH = resolve(__dirname, '../../supabase/functions/_shared/guards.ts');
const guardsSource = readFileSync(GUARDS_PATH, 'utf-8');

describe('unlim-session-description — Edge Function contract integration', () => {
  it('exports buildPrompt + fallbackSummary + MAX_CHARS from _helpers.ts', () => {
    expect(typeof buildPrompt).toBe('function');
    expect(typeof fallbackSummary).toBe('function');
    expect(MAX_CHARS).toBe(80);
    expect(MAX_TRANSCRIPT_CHARS).toBe(500);
  });

  it('guards.ts source exports verifyElabApiKey + headers helpers (integration boundary)', () => {
    // grep-style assertion: integration boundary is preserved at deploy-time.
    // If guards.ts ever drops one of these exports, the Edge Function build
    // fails fast (deno deploy import error). Source-grep test catches it
    // even before Deno runtime sees it.
    expect(guardsSource).toMatch(/export function verifyElabApiKey\b/);
    expect(guardsSource).toMatch(/export function getCorsHeaders\b/);
    expect(guardsSource).toMatch(/export function getSecurityHeaders\b/);
    expect(guardsSource).toMatch(/export function checkBodySize\b/);
  });

  it('guards.ts verifyElabApiKey fail-open behavior documented (deploy-friendly)', () => {
    // Per guards.ts:67-72 contract: when ELAB_API_KEY env not configured,
    // verifyElabApiKey returns { ok: true } (fail-open) so first deploy of
    // unlim-session-description doesn't 401 before secret is rolled out.
    expect(guardsSource).toMatch(/Fail-open/);
    expect(guardsSource).toMatch(/return \{ ok: true \}/);
  });

  it('guards.ts CORS allowlist includes elabtutor.school production domains', () => {
    // The Edge Function must respond to www.elabtutor.school + elabtutor.school
    // origins per CORS allowlist. Source-grep ensures this contract holds.
    expect(guardsSource).toMatch(/www\.elabtutor\.school/);
    expect(guardsSource).toMatch(/elabtutor\.school/);
  });

  it('end-to-end prompt+fallback flow: missing LLM result triggers safe fallback', () => {
    const row = {
      id: 'sess-int-1',
      experiment_id: 'v3-cap6-semaforo',
      modalita: 'percorso',
      started_at: '2026-05-04T08:00:00Z',
      ended_at: '2026-05-04T08:42:00Z',
      events: Array(7).fill({ k: 'event' }),
      description_unlim: null,
    };

    // Step 1: prompt builds correctly with optional transcript context.
    const transcript = 'Docente: «Il LED si accende quando la corrente passa.» — Vol.1 cap.6';
    const { systemPrompt, message } = buildPrompt(row, transcript);
    expect(systemPrompt).toMatch(/MAX 80 caratteri/);
    expect(message).toContain('Estratto trascritto');
    expect(message).toContain('Vol.1 cap.6');

    // Step 2: when LLM unavailable, fallback contract fires + ≤80 chars.
    const fallback = fallbackSummary(row);
    expect(fallback.length).toBeLessThanOrEqual(MAX_CHARS);
    expect(fallback).toMatch(/v3-cap6-semaforo/);
    expect(fallback).toMatch(/42 min/);
    expect(fallback).toMatch(/7 eventi/);
  });

  it('input validation: invalid transcript_excerpt type does not crash buildPrompt', () => {
    const row = {
      id: 'sess-int-2',
      experiment_id: 'v1-cap1-esp1',
      modalita: 'libero',
      started_at: null,
      ended_at: null,
      events: null,
      description_unlim: null,
    };
    // Defensive: even though Edge Function index.ts coerces non-string to '',
    // helper itself must not crash on undefined/null.
    expect(() => buildPrompt(row)).not.toThrow();
    expect(() => buildPrompt(row, undefined)).not.toThrow();
    expect(() => buildPrompt(row, '')).not.toThrow();
  });
});
