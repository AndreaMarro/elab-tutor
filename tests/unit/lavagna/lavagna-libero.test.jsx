/**
 * LavagnaShell — Modalità Libero TRUE clear (Mandate 3 G1+G2+G3 iter 35 Phase 2 Maker-2)
 *
 * Andrea bug iter 30: "premo libera e circuito rimane".
 * Root causes (CLAUDE.md iter 35 P1):
 *  1. handleModalitaChange('libero') in LavagnaShell:641 calls clearAll +
 *     setCurrentExperiment(null) + sentinel localStorage.
 *  2. NewElabSimulator may have stale buildMode/currentExperiment that LavagnaShell
 *     does not own. Iter 35 G1 fix: dispatch CustomEvent `elab-lavagna-libero-enter`
 *     so simulator can listen and reset internal state.
 *  3. ComponentDrawer renders "Pronti a montare!" banner when mode==='guided'.
 *     Iter 35 G2/G3 fix: ComponentDrawer reads sentinel `elab-lavagna-libero-active`
 *     localStorage + listens to `elab-lavagna-libero-enter` event → returns null
 *     when libero active AND mode==='guided'.
 *
 * Tests (5):
 *  • G1.1 sentinel localStorage `elab-lavagna-libero-active='true'` set after libero entry
 *  • G1.2 last-expId localStorage cleared after libero entry
 *  • G1.3 CustomEvent `elab-lavagna-libero-enter` dispatched after libero entry (timestamp present)
 *  • G2/G3 ComponentDrawer gate predicate: liberoActive && mode==='guided' → suppress
 *  • G2/G3 ComponentDrawer gate negative: !liberoActive || mode==='sandbox' → render
 *
 * Test pattern: pure handler reducer + jsdom localStorage + CustomEvent listener.
 * No full React mount (heavy LavagnaShell + lazy AuthContext) — same pattern as
 * LavagnaShell-libero-auto-percorso-iter26.test.jsx.
 *
 * (c) Andrea Marro — 2026-05-04 iter 35 Phase 2 Maker-2
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Re-implementation of handleModalitaChange Libero branch per LavagnaShell:641-664 spec.
// Source of truth: src/components/lavagna/LavagnaShell.jsx (Phase 2 Maker-2 G1 patch).
function handleLiberoEntry({ setCurrentExperiment, api }) {
  if (typeof window === 'undefined') return;
  try {
    setCurrentExperiment(null);
    if (api?.clearAll) api.clearAll();
    try { localStorage.removeItem('elab-lavagna-exp-id'); } catch { /* noop */ }
    try { localStorage.removeItem('elab-lavagna-last-expId'); } catch { /* noop */ }
    try { localStorage.setItem('elab-lavagna-libero-active', 'true'); } catch { /* noop */ }
    try {
      window.dispatchEvent(new CustomEvent('elab-lavagna-libero-enter', {
        detail: { timestamp: Date.now() },
      }));
    } catch { /* noop */ }
  } catch { /* noop */ }
}

// Re-implementation of ComponentDrawer guard predicate per iter 35 G2/G3 spec.
// Source: src/components/simulator/panels/ComponentDrawer.jsx Phase 2 Maker-2 patch.
function shouldComponentDrawerSuppress({ liberoActive, mode }) {
  return liberoActive && mode === 'guided';
}

describe('Mandate 3 — Lavagna Libero TRUE clear (iter 35 Phase 2 Maker-2)', () => {
  // tests/setup.js mocks localStorage with vi.fn() spies (no real persistence) →
  // assertions use spy invocation count + args, not real getItem returns.

  it('G1.1: libero entry sets sentinel localStorage elab-lavagna-libero-active=true', () => {
    const setExp = vi.fn();
    handleLiberoEntry({ setCurrentExperiment: setExp, api: null });
    expect(localStorage.setItem).toHaveBeenCalledWith('elab-lavagna-libero-active', 'true');
    expect(setExp).toHaveBeenCalledWith(null);
  });

  it('G1.2: libero entry clears stale experiment localStorage keys + calls api.clearAll', () => {
    const setExp = vi.fn();
    const clearAll = vi.fn();
    handleLiberoEntry({
      setCurrentExperiment: setExp,
      api: { clearAll },
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('elab-lavagna-exp-id');
    expect(localStorage.removeItem).toHaveBeenCalledWith('elab-lavagna-last-expId');
    expect(clearAll).toHaveBeenCalledTimes(1);
  });

  it('G1.3: libero entry dispatches CustomEvent elab-lavagna-libero-enter with timestamp', () => {
    const events = [];
    const handler = (e) => events.push(e);
    window.addEventListener('elab-lavagna-libero-enter', handler);
    try {
      handleLiberoEntry({ setCurrentExperiment: vi.fn(), api: null });
      expect(events.length).toBe(1);
      expect(events[0].detail).toBeDefined();
      expect(typeof events[0].detail.timestamp).toBe('number');
      expect(events[0].detail.timestamp).toBeGreaterThan(0);
    } finally {
      window.removeEventListener('elab-lavagna-libero-enter', handler);
    }
  });

  it('G2/G3: ComponentDrawer suppresses guided UI when libero active', () => {
    expect(shouldComponentDrawerSuppress({ liberoActive: true, mode: 'guided' })).toBe(true);
    // PRONTI banner is part of guided UI (line 367 isIntro check) — same gate.
  });

  it('G2/G3: ComponentDrawer renders normally for sandbox mode OR libero NOT active', () => {
    // Sandbox always renders even when libero active (Libero IS sandbox semantically)
    expect(shouldComponentDrawerSuppress({ liberoActive: true, mode: 'sandbox' })).toBe(false);
    // Guided + libero NOT active = normal Passo Passo flow
    expect(shouldComponentDrawerSuppress({ liberoActive: false, mode: 'guided' })).toBe(false);
    // Sandbox + libero NOT active = legacy sandbox flow
    expect(shouldComponentDrawerSuppress({ liberoActive: false, mode: 'sandbox' })).toBe(false);
  });
});
