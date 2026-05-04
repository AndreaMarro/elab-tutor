# ADR-040 — Percorso 2-window overlay architecture Morfismo Sense 1.5

**Status**: PROPOSED iter 35 (Andrea ratify Phase 1 entrance)
**Date**: 2026-05-04
**Iter**: 35 mandates 6 + 10
**Deciders**: Andrea Marro
**Author**: Claude Opus 4.7

---

## Context

Andrea explicit 2026-05-04 PM:
- **Mandate 6**: "La modalità percorso era pensata per adattarsi al contesto della lezione e al contesto della classe e delle sessioni precedenti"
- **Mandate 10**: "la modalità percorso deve corrispondere alla vecchia modalità libero ma ora ci sono 2 window sovrapposte"

Architettura semantica Andrea:
- **Percorso = vecchia Libero** (empty canvas blank, NO experiment pre-mounted)
- **+ 2 finestre flottanti sovrapposte**:
  1. **UNLIM panel** (chat + voice + INTENT dispatch via GalileoAdapter existing)
  2. **Percorso lesson panel** (capitolo + esperimento corrente + memoria classe Morfismo Sense 1.5)
- Adatta a contesto: docente specifico + classe specifica + sessioni precedenti + capitolo corrente

Morfismo Sense 1.5 (CLAUDE.md §1.5):
- Per docente: linguaggio plurale "Ragazzi" INVARIANTE + dettagli adattati esperienza docente
- Per classe: età studenti + livello competenza memoria classe Supabase + kit specifico + capitolo corrente lesson-paths
- Funzioni morfiche: stesso `__ELAB_API` ma presentazione adatta contesto
- Finestre morfiche: dimensione + posizione + contenuto + gerarchia VISUALE adattano workflow corrente

## Decision

**Percorso entry transitions canvas to vecchia Libero state + opens 2 FloatingWindow overlay**:

1. **N1 Percorso entry** (LavagnaShell.jsx `handleModalitaChange('percorso')` 80 LOC Maker-2 Three-Agent gate):
```jsx
if (nextMode === 'percorso' && typeof window !== 'undefined') {
  // Reuse Libero clear logic (G1+G2+G3 gates)
  const api = window.__ELAB_API;
  setCurrentExperiment(null);
  if (api?.clearAll) api.clearAll();
  localStorage.removeItem('elab-lavagna-exp-id');
  localStorage.removeItem('elab-lavagna-last-expId');
  // Sentinel for Percorso mode (different from libero-active)
  localStorage.setItem('elab-lavagna-percorso-active', 'true');
  // Open 2 FloatingWindow
  window.dispatchEvent(new CustomEvent('elab-lavagna-percorso-enter'));
}
```

2. **N2 PercorsoPanel scaffold** (lavagna/PercorsoPanel.jsx 60 LOC WebDesigner-1 Three-Agent gate):
- Lesson context display:
  - Capitolo header: Vol.X + Capitolo title (currentVolume + currentVolumePage from LavagnaShell)
  - Esperimento corrente: currentExperiment.title + Vol/pag citation
  - "Ultima sessione": session_description from `student_progress` Supabase (UNLIM-generated I3 Edge Function backfill)
  - "Suggerimenti memoria classe": top-3 relevant from class_key memory iter 31 ralph
- Wrapped in `<FloatingWindow>` component (iter 36 NEW 225 LOC reusable)
- localStorage persist `elab-floatwin-percorso-panel`

3. **N3 UNLIM + Percorso z-index hierarchy** (GalileoAdapter.jsx + PercorsoPanel.jsx CSS 30 LOC WebDesigner-1):
- UNLIM panel z=10000 (existing GalileoAdapter)
- PercorsoPanel z=10001 (Andrea Percorso primary focus iter 35)
- Initial position no overlap (1920x1080 LIM):
  - UNLIM: right-bottom 30vw × 50vh
  - PercorsoPanel: left-top 30vw × 50vh
- Mobile <768px: stacked vertical (Percorso top, UNLIM bottom)

4. **J1 Percorso context payload** (api.js 100 LOC Maker-2 Three-Agent gate Sense 1.5):
- Edge Function `unlim-chat` accepts NEW field `percorso_context`:
```typescript
{
  class_key: string,         // localStorage existing
  recent_intents: Array<{action, ts}>,  // last 5 from memory iter 31 ralph
  currentExperiment: { id, title, capitolo, volume, page, buildMode },
  lesson_context: {
    capitolo_active: { id, title, vol, page },
    completed_experiments: Array<{ id, last_session_at }>,
    next_recommended: { id, reason }, // Morfismo Sense 1.5
  },
}
```
- Wire when `modalita === 'percorso'` ONLY

5. **J2 BASE_PROMPT inject Percorso context block** (system-prompt.ts 40 LOC Maker-1 coordination):
- §7 NEW: "Contesto Percorso classe — usa per personalizzare risposta"
- Inject capitolo + esperimento + completed history + memoria classe summary
- Maker-1 owns system-prompt.ts (Maker-2 sends coordination msg)

## Alternatives considered

### A. Single unified panel (rejected)
- Merge UNLIM chat + Percorso lesson into one floating window
- Pros: less screen real estate
- Cons: violates Andrea explicit "2 window sovrapposte" + Morfismo Sense 1.5 separation chat vs lesson context
- **Rejected**

### B. Sidebar PercorsoCapitoloView extension (rejected)
- Use existing PercorsoCapitoloView side panel + UNLIM panel
- Pros: reuses existing component
- Cons: PercorsoCapitoloView is fixed sidebar (ADR-038 hide LEFT in Passo Passo) NOT floating + draggable, Andrea wants overlapping
- **Rejected**

### C. Two FloatingWindow architecture (CHOSEN)
- New PercorsoPanel.jsx component wrapped in FloatingWindow
- UNLIM panel (existing GalileoAdapter) wrapped in FloatingWindow
- Both floating, draggable, resizable, persistent localStorage
- z-index hierarchy + initial position no-overlap
- **Chosen** — matches Andrea explicit "2 window sovrapposte" + reuses iter 36 FloatingWindow 225 LOC

## Consequences

### Positive
- Andrea explicit Sense 1.5 architecture realized
- Morfismo runtime: PercorsoPanel adatta capitolo + memoria classe + suggerimenti contestuali
- Reuse iter 36 FloatingWindow 225 LOC (DRY)
- localStorage persist position/size per-finestra (Morfismo Sense 1.5 finestre morfiche)
- Andrea ratify queue clear path

### Negative
- Architectural complexity: 4 atoms 80+60+30+100 = 270 LOC (largest mandate iter 35)
- J1 Percorso context payload → Edge Function unlim-chat MODIFIED → Andrea ratify deploy v82+
- J2 BASE_PROMPT v3.4 §7 NEW Percorso block → Maker-1 coordination required
- Mitigation: J3 PercorsoPanel UX (80 LOC) + J4 Sense 1.5 detailed wire DEFER iter 36 IF >5h budget exceeded
- Risk Sense 1.5 wire complete (J1+J2+J3) is multi-iter — defer iter 36 acceptable

### Neutral
- Existing Percorso button in ModalitaSwitch unchanged (already shipped iter 36)
- Existing PercorsoCapitoloView side panel preserved for Già Montato + Passo Passo modes (ADR-038 hides only in Passo Passo)
- Existing GalileoAdapter UNLIM panel preserved (just wrap in FloatingWindow N3)

## Verification

Testing:
1. **N1 E2E spec** `tests/e2e/08-percorso-2-window.spec.js` NEW (Tester-1 60 LOC Three-Agent gate):
   - Navigate `/lavagna` → ModalitaSwitch Percorso
   - Assert canvas blank (components count=0)
   - Assert PercorsoPanel rendered (`[data-testid=percorso-panel]`)
   - Assert UNLIM panel rendered (`[data-testid=galileo-adapter]`)
   - Drag both panels — assert no overlap
2. **N2 unit test** `tests/unit/components/lavagna/PercorsoPanel.test.jsx` (WebDesigner-1):
   - Render with mocked context props
   - Assert capitolo header + esperimento + ultima sessione present
3. **J1 integration test**: Edge Function `unlim-chat` smoke prod with `percorso_context` payload — assert response uses context (e.g. cites previous experiment)
4. **Smoke prod** Andrea Chrome MCP visual: Percorso mode → 2 finestre floating + canvas empty + drag without overlap

## File changes

- `src/components/lavagna/LavagnaShell.jsx` — N1 entry handler 80 LOC (Maker-2)
- `src/components/lavagna/PercorsoPanel.jsx` NEW or extend — N2 60 LOC + J3 80 LOC (WebDesigner-1)
- `src/components/lavagna/GalileoAdapter.jsx` — N3 z-index + initial position 30 LOC (WebDesigner-1)
- `src/services/api.js` — J1 Percorso context payload 100 LOC (Maker-2)
- `supabase/functions/_shared/system-prompt.ts` — J2 §7 Percorso block 40 LOC (Maker-1 coordination)
- `tests/e2e/08-percorso-2-window.spec.js` NEW (Tester-1)
- `tests/unit/components/lavagna/PercorsoPanel.test.jsx` NEW (WebDesigner-1)

## Cross-link

- CLAUDE.md §1.5 Morfismo Sense 1.5 docente + classe + UI/funzioni
- ADR-019 Sense 1.5 Morfismo runtime docente/classe (iter 12 PROPOSED 320 LOC)
- Master plan iter 35: §1 mandates 6+10 + §3 + §8 N1+N2+N3+J1+J2+J3 atoms
- iter 36 FloatingWindow.jsx NEW 225 LOC reusable component
- iter 31 ralph 32 close Onnipotenza UI namespace L0b ADR-041 ACCEPTED (related Sense 1.5 contesto UI snapshot)

## Open questions

1. **Andrea ratify J1 Edge Function unlim-chat MODIFY**: deploy v82+ post Phase 4 commit (queue entry P0 priority)
2. **Andrea ratify J2 BASE_PROMPT v3.4 §7**: subjective interpretation Percorso block → Andrea review draft pre-deploy
3. **PercorsoPanel mobile <768px stacked**: confirm Andrea preferenza vs side-by-side narrow vs hidden mobile
4. **Memoria classe Supabase `class_memory` table**: schema existing iter 31 ralph 32 ACCEPTED OR NEW migration iter 36+
5. **next_recommended Morfismo Sense 1.5**: heuristic algorithm Andrea ratify (capitolo successivo? esperimento più simile completed? oldest non-completed?)
