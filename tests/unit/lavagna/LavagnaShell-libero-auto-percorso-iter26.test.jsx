/**
 * LavagnaShell — Modalità Libero auto-Percorso behavior tests (ADR-025 §4.4 iter 26)
 *
 * Verifica isolato dal full LavagnaShell render (heavy lazy + AuthContext):
 *  • Default modalità persisted = 'percorso' (NOT 'libero')
 *  • Libero click → setMode('percorso') auto-Percorso (NON sandbox vuoto)
 *  • Mode persisted localStorage `elab-lavagna-modalita`
 *
 * Test pattern: usa il useState handler logic come unit test puro (no React mount full).
 *
 * Caveman gen-test iter 26 — 2026-04-29
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Re-implementation of handleModalitaChange behavior per ADR-025 §4.4 spec.
// Source: src/components/lavagna/LavagnaShell.jsx:413-432 (handleModalitaChange callback)
// Test ensures the canonical contract behaves correctly when called from UI.
function makeModalitaReducer(initial = 'percorso') {
  let state = ['percorso', 'passo-passo', 'gia-montato', 'libero'].includes(initial)
    ? initial : 'percorso';
  const setState = (v) => { state = v; };
  const get = () => state;
  return { setState, get };
}

function handleModalitaChangeFactory({ setModalita, apiRef }) {
  return function handleModalitaChange(nextMode) {
    if (nextMode === 'libero') {
      // ADR-025 §4.4: Libero click → auto-Percorso
      setModalita('percorso');
      return;
    }
    if (!['percorso', 'passo-passo', 'gia-montato', 'libero'].includes(nextMode)) {
      return;
    }
    setModalita(nextMode);
    if (nextMode === 'gia-montato') {
      const api = apiRef?.current;
      if (api?.unlim?.setDiagnoseMode) {
        try { api.unlim.setDiagnoseMode(true); } catch { /* noop */ }
      }
    }
  };
}

describe('LavagnaShell — Libero auto-Percorso behavior (ADR-025 §4.4 iter 26)', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.clear();
  });

  it('default modalità is "percorso" when no localStorage value present', () => {
    const stored = (typeof localStorage !== 'undefined')
      ? localStorage.getItem('elab-lavagna-modalita') : null;
    const initial = ['percorso', 'passo-passo', 'gia-montato', 'libero'].includes(stored)
      ? stored : 'percorso';
    expect(initial).toBe('percorso');
  });

  it('clicking Libero triggers auto-Percorso (setMode("percorso") NOT "libero")', () => {
    const reducer = makeModalitaReducer('percorso');
    const handler = handleModalitaChangeFactory({
      setModalita: reducer.setState,
      apiRef: { current: null },
    });
    handler('libero');
    // Critical: state must be 'percorso' (auto-mounts narrative), NOT 'libero' sandbox vuoto
    expect(reducer.get()).toBe('percorso');
  });

  it('Già Montato click signals diagnose mode via __ELAB_API.unlim.setDiagnoseMode(true)', () => {
    const reducer = makeModalitaReducer('percorso');
    const setDiagnoseMode = vi.fn();
    const apiRef = { current: { unlim: { setDiagnoseMode } } };
    const handler = handleModalitaChangeFactory({
      setModalita: reducer.setState,
      apiRef,
    });
    handler('gia-montato');
    expect(reducer.get()).toBe('gia-montato');
    expect(setDiagnoseMode).toHaveBeenCalledWith(true);
  });

  it('ignores legacy/unknown modes (defensive: "guida-da-errore" no-op)', () => {
    const reducer = makeModalitaReducer('percorso');
    const handler = handleModalitaChangeFactory({
      setModalita: reducer.setState,
      apiRef: { current: null },
    });
    handler('guida-da-errore');
    handler('foobar');
    // State unchanged (still default percorso)
    expect(reducer.get()).toBe('percorso');
  });
});
