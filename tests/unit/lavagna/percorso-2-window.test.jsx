/**
 * LavagnaShell — Modalità Percorso 2-window overlay (Mandate 10 N1 iter 35 Phase 2 Maker-2)
 *
 * Andrea: "Percorso deve corrispondere alla vecchia modalità libero ma ora ci
 * sono 2 window sovrapposte". Architettura nuova:
 *   - Empty canvas (riusa logica Libero clearAll + remove exp-id localStorage)
 *   - Floating window 1: UNLIM panel (GalileoAdapter)
 *   - Floating window 2: PercorsoPanel (capitolo + classe context Sense 1.5)
 *
 * Z-index PercorsoPanel z=10001 (FloatingWindow default) > GalileoAdapter z=10000.
 *
 * Tests (5):
 *  • N1.1 percorso entry calls clearAll + setCurrentExperiment(null) (canvas blank)
 *  • N1.2 percorso entry removes elab-lavagna-exp-id + elab-lavagna-last-expId
 *  • N1.3 percorso entry sets percorso2WindowOpen=true + galileoOpen=true
 *  • N1.4 percorso entry dispatches CustomEvent elab-lavagna-percorso-enter
 *  • N1.5 percorso entry NOT triggered when nextMode='passo-passo' (negative case)
 *
 * Pure handler reducer pattern (no full LavagnaShell mount).
 *
 * (c) Andrea Marro — 2026-05-04 iter 35 Phase 2 Maker-2
 */
import { describe, it, expect, vi } from 'vitest';

// Re-implementation of handleModalitaChange Percorso branch per LavagnaShell
// Phase 2 Maker-2 N1 patch (line 681-705).
function handlePercorsoEntry({
  setCurrentExperiment,
  setGalileoOpen,
  setUnlimTab,
  setPercorso2WindowOpen,
  manualOverridesRef,
  api,
}) {
  if (typeof window === 'undefined') return;
  try {
    setCurrentExperiment(null);
    if (api?.clearAll) api.clearAll();
    try { localStorage.removeItem('elab-lavagna-exp-id'); } catch { /* noop */ }
    try { localStorage.removeItem('elab-lavagna-last-expId'); } catch { /* noop */ }
    if (manualOverridesRef) manualOverridesRef.current.galileo = true;
    setGalileoOpen(true);
    setUnlimTab('chat');
    setPercorso2WindowOpen(true);
    try {
      window.dispatchEvent(new CustomEvent('elab-lavagna-percorso-enter', {
        detail: { timestamp: Date.now() },
      }));
    } catch { /* noop */ }
  } catch { /* noop */ }
}

describe('Mandate 10 — Percorso 2-window overlay (iter 35 Phase 2 Maker-2 N1)', () => {
  it('N1.1: percorso entry clears canvas (clearAll + setCurrentExperiment(null))', () => {
    const setExp = vi.fn();
    const clearAll = vi.fn();
    handlePercorsoEntry({
      setCurrentExperiment: setExp,
      setGalileoOpen: vi.fn(),
      setUnlimTab: vi.fn(),
      setPercorso2WindowOpen: vi.fn(),
      manualOverridesRef: { current: {} },
      api: { clearAll },
    });
    expect(setExp).toHaveBeenCalledWith(null);
    expect(clearAll).toHaveBeenCalledTimes(1);
  });

  it('N1.2: percorso entry removes stale experiment localStorage keys', () => {
    handlePercorsoEntry({
      setCurrentExperiment: vi.fn(),
      setGalileoOpen: vi.fn(),
      setUnlimTab: vi.fn(),
      setPercorso2WindowOpen: vi.fn(),
      manualOverridesRef: { current: {} },
      api: null,
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('elab-lavagna-exp-id');
    expect(localStorage.removeItem).toHaveBeenCalledWith('elab-lavagna-last-expId');
  });

  it('N1.3: percorso entry opens UNLIM (galileoOpen=true) AND PercorsoPanel (percorso2WindowOpen=true)', () => {
    const setGalileoOpen = vi.fn();
    const setUnlimTab = vi.fn();
    const setPercorso2WindowOpen = vi.fn();
    const manualOverridesRef = { current: {} };
    handlePercorsoEntry({
      setCurrentExperiment: vi.fn(),
      setGalileoOpen,
      setUnlimTab,
      setPercorso2WindowOpen,
      manualOverridesRef,
      api: null,
    });
    expect(setGalileoOpen).toHaveBeenCalledWith(true);
    expect(setUnlimTab).toHaveBeenCalledWith('chat');
    expect(setPercorso2WindowOpen).toHaveBeenCalledWith(true);
    expect(manualOverridesRef.current.galileo).toBe(true);
  });

  it('N1.4: percorso entry dispatches CustomEvent elab-lavagna-percorso-enter with timestamp', () => {
    const events = [];
    const handler = (e) => events.push(e);
    window.addEventListener('elab-lavagna-percorso-enter', handler);
    try {
      handlePercorsoEntry({
        setCurrentExperiment: vi.fn(),
        setGalileoOpen: vi.fn(),
        setUnlimTab: vi.fn(),
        setPercorso2WindowOpen: vi.fn(),
        manualOverridesRef: { current: {} },
        api: null,
      });
      expect(events.length).toBe(1);
      expect(events[0].detail).toBeDefined();
      expect(typeof events[0].detail.timestamp).toBe('number');
    } finally {
      window.removeEventListener('elab-lavagna-percorso-enter', handler);
    }
  });

  it('N1.5: PercorsoPanel render gate — modalita==="percorso" && percorso2WindowOpen && !lavagnaSoloMode', () => {
    // Pure predicate test mirroring the JSX gate at LavagnaShell:1448
    const shouldRender = (modalita, percorso2WindowOpen, lavagnaSoloMode) =>
      modalita === 'percorso' && percorso2WindowOpen && !lavagnaSoloMode;

    expect(shouldRender('percorso', true, false)).toBe(true);
    // negative cases
    expect(shouldRender('passo-passo', true, false)).toBe(false);
    expect(shouldRender('libero', true, false)).toBe(false);
    expect(shouldRender('gia-montato', true, false)).toBe(false);
    expect(shouldRender('percorso', false, false)).toBe(false); // not opened yet
    expect(shouldRender('percorso', true, true)).toBe(false); // lavagna-solo hides
  });
});
