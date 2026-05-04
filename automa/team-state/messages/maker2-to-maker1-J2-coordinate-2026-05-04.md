# Maker-2 → Maker-1 coordination — J2 BASE_PROMPT Percorso block (iter 35 Phase 2)

**Date**: 2026-05-04 PM
**From**: Maker-2 Lavagna refactor
**To**: Maker-1 (owner of `supabase/functions/_shared/system-prompt.ts`)
**Mandate**: 6 — Percorso adaptive Morfismo Sense 1.5
**Atom**: J2 — BASE_PROMPT inject Percorso-specific context block (40 LOC)

## Context

Andrea iter 35 mandate 6: "Percorso era pensata per adattarsi al contesto della
lezione + classe + sessioni precedenti" (Morfismo Sense 1.5).

Maker-2 has already shipped J1 (client-side payload `percorsoContext` in
`src/services/api.js`) and N1 (LavagnaShell wires `modalita==='percorso'` →
opens 2-window UNLIM + PercorsoPanel + clears canvas).

J2 needs to be done by **Maker-1** because file ownership boundary:
- Maker-1 owns: `supabase/functions/_shared/system-prompt.ts` + Edge Functions
- Maker-2 owns: `src/services/api.js` + `src/components/lavagna/*`

## What Maker-2 already shipped (J1, ready for J2)

`src/services/api.js` line 789-815 (sendChat options):

```js
export async function sendChat(message, images = [], options = {}) {
    const {
        signal, socraticMode, experimentContext, circuitState, experimentId,
        simulatorContext,
        // J1 NEW iter 35:
        percorsoContext = null, // when present: classKey + recentIntents + activeCapitolo + lastSessionDescriptions + kitLevel
    } = options;
```

`src/services/api.js` lines ~893-930 emit `[CONTESTO PERCORSO — MORFISMO SENSE 1.5]` block when `percorsoContext` non-null:

```
[CONTESTO PERCORSO — MORFISMO SENSE 1.5]
Classe: aula-3a-ferrari
Capitolo corrente: I LED (Vol. 1)
Ultime azioni docente: highlightComponent → mountExperiment → captureScreenshot
Memoria sessioni recenti classe: 2026-05-01 LED accensione | 2026-04-28 Resistore in serie | 2026-04-25 Pulsante
Kit dotazione classe: Omaric base
Adatta tono + dettaglio + esempi a questo contesto. Cita Vol/pag VERBATIM. Italiano scuola plurale "Ragazzi,".
```

This is sent to Edge Function `unlim-chat` as part of the prompt body.

## What Maker-1 must do (J2)

Update `supabase/functions/_shared/system-prompt.ts` BASE_PROMPT v3.3 § 7
(NEW Percorso block) to instruct UNLIM how to USE the contextual `[CONTESTO PERCORSO — MORFISMO SENSE 1.5]` block when present in the user prompt.

### Suggested § 7 Percorso block content

```
§ 7 — MODALITÀ PERCORSO (MORFISMO SENSE 1.5)

Quando il prompt contiene il blocco "[CONTESTO PERCORSO — MORFISMO SENSE 1.5]":
1. Leggi le righe Classe, Capitolo, Ultime azioni docente, Memoria sessioni.
2. Adatta il tono al livello docente:
   - Docente esperto (memoria sessioni > 5 esperimenti completati) → meno
     analogie base, più spunti avanzati e collegamenti tra capitoli.
   - Docente al primo anno (memoria sessioni < 3) → più analogie esplicite,
     ripetizione concetti, micro-step.
3. Adatta il contesto alla classe:
   - Cita SEMPRE il capitolo corrente quando rispondi (Es. "Come abbiamo visto
     nel Cap. 6 — I LED...").
   - Se la memoria sessioni include esperimenti già fatti, NON ripetere il
     materiale di base; suggerisci il next step coerente con il percorso.
4. Suggerisci PROSSIMO ESPERIMENTO se il docente è al termine di un capitolo:
   menziona l'esperimento successivo nel volume (NON inventato).
5. Italiano scuola plurale: "Ragazzi, oggi vediamo..." (mai "Tu" docente
   diretto). Cita Vol/pag VERBATIM dai volumi (NON parafrasare).
6. Cap parole categoria deep_question = 400 parole MAX (cap normale § 6).
7. Se il blocco Percorso è ASSENTE, comportati come modalità default
   (ignora § 7 — modalità libera/passo-passo/già-montato non hanno questo
   contesto extra).
```

## Verification per Maker-1

- [ ] Edit `supabase/functions/_shared/system-prompt.ts` BASE_PROMPT v3.3 add § 7 Percorso block (~40 LOC mandate per master plan §1 mandate 6 J2)
- [ ] Update version constant from v3.2 → v3.3
- [ ] Smoke test: send sample prompt with `[CONTESTO PERCORSO — MORFISMO SENSE 1.5]` block → verify response cites capitolo, adapts tono based on memoria sessioni count, plurale "Ragazzi,"
- [ ] Update test fixture for `tests/integration/system-prompt.test.js` if exists

## NOT in scope J2 (defer iter 36+)

- Backfill memoria classe Supabase migration (Maker-1 separate atom J3 if needed)
- Wire `useGalileoChat` to populate `percorsoContext` from Supabase aggregator (J3+)
- E2E test coverage (Tester-1 owns)

## Files referenced (read-only for Maker-1 to understand J1)

- `src/services/api.js` lines 789-820 (sendChat options destructure)
- `src/services/api.js` lines ~893-930 (Percorso block construction)
- `src/components/lavagna/LavagnaShell.jsx` line ~681-705 (handleModalitaChange Percorso branch)

## Caveat

J1+J2 mandate full Sense 1.5 wire is deferred to iter 36 per master plan §1
mandate 6 J4 ("Defer J1-J3 detailed wire iter 36+ complex Sense 1.5"). Maker-2
shipped only J1 client-side scaffold (40 LOC sendChat option + ~40 LOC block
construction). The actual Supabase memoria classe aggregator + useGalileoChat
wire-up is iter 36 atom.

— Maker-2, 2026-05-04 PM
