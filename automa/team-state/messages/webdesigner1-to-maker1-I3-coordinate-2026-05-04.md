# WebDesigner-1 → Maker-1 — Coordination atom I3 session description backfill

**Date**: 2026-05-04
**From**: WebDesigner-1 (HomePage SVG + Cronologia + PercorsoPanel)
**To**: Maker-1 (Edge Functions + Supabase)
**Atom**: I3 (Cronologia trigger session description backfill)

## Context

`HomeCronologia.jsx` ora espone (iter 35 atom I3) un bottone
"Genera descrizioni (N)" visibile soltanto quando:

1. `missingDescCount > 0` (almeno una sessione con `messages.length>0`
   ma senza `description_unlim` cached).
2. `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` configurati env build.
3. La sessione ha un `id` UUID-compatibile (regex `[0-9a-f-]{8,}`).

Il click chiama in batch sequenziale (max 10 entries / call):

```js
POST ${SUPABASE_URL}/functions/v1/unlim-session-description
Headers: Content-Type: application/json
         Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}
         X-Elab-Client: home-cronologia
Body: { session_id: '<uuid>' }
```

Risposta attesa già nello schema Maker-1 iter 35:
`{ success: true, description: "<≤200 chars italiano plurale>" }`

Il client salva in `localStorage` (chiave `elab_unlim_sessions`) il
campo `description_unlim` per tutte le sessioni aggiornate (cache offline).

## Action items per Maker-1

1. **Verifica esistenza Edge Function `unlim-session-description`**:
   - `supabase/functions/unlim-session-description/index.ts`
   - Se assente → crearla con contratto `{ session_id }` → `{ success, description }`.
   - Se esistente → confermare contratto invariato.

2. **PRINCIPIO ZERO**: descrizione generata DEVE essere plurale "Ragazzi,"
   + cita Vol/pag se possibile + ≤200 caratteri (clamp client-side già).
   Few-shot system prompt suggested:
   ```
   Generate a max-200-char Italian summary of this UNLIM teacher session.
   Start with "Ragazzi," when natural. Cite Vol.X pag.Y if visible in
   conversation. NO imperative singolare ("fai", "monta").
   ```

3. **Rate limiting**: client invia max 10 chiamate sequenziali per click.
   Se Edge Function rate-limit aggressivo (>10 RPS) → coordinarsi via
   issue inverso (`maker1-to-webdesigner1-I3-rate-2026-05-XX.md`) per
   ridurre batch a 5.

4. **Caching Supabase server-side**: se `unlim_sessions.description_unlim`
   già presente nel row → ritornarla SENZA Gemini call (cost saving).

## Caveats

- Atom I3 lato WebDesigner-1 SHIPPED iter 35 (UI + handler + test).
  L'integrazione END-TO-END dipende dalla Edge Function lato Maker-1.
- Se Edge Function non ancora deployata, il bottone non apparirà
  perché `canGenerate` richiede `SUPABASE_URL` env.
- Test unit `tests/unit/components/home/cronologia.test.jsx` verifica
  che il bottone NON appaia quando env mancante (graceful degrade).

## Files touched

- `src/components/HomeCronologia.jsx` (+~70 LOC: handler + button + state)
- `tests/unit/components/home/cronologia.test.jsx` (NEW, 7 tests I2/I3/I4)

— WebDesigner-1, iter 35 Phase 2
