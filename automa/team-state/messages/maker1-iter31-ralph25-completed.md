# Maker-1 iter 31 ralph 25 Phase 4 Atom 26.1 — completed

**Date**: 2026-05-03
**Atom**: 26.1 — extend `aggregateOnniscenza` add `ui` key per ADR-042 §3 UIStateSnapshot schema
**Pattern**: Modalità normale (NOT caveman)
**Sprint**: T close target ADVANCED 9.0/10 ONESTO

---

## Files modified (3)

1. `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/onniscenza-bridge.ts`
   - **LOC delta**: +86 LOC (target +50-80, +6 over due to verbose UIStateSnapshot interface comments + defensive PII strip per ADR-042 §8.2)
   - Changes:
     - Added `UIStateSnapshot` interface (7 fields per ADR-042 §3)
     - Added `ui?: UIStateSnapshot | null` to `OnniscenzaInput`
     - Added `ui?: UIStateSnapshot` optional field to `OnniscenzaSnapshot`
     - Added `INCLUDE_UI_STATE_IN_ONNISCENZA` env-gated attach block in `aggregateOnniscenza` body (default false → skip ui key entirely, V1 baseline preserved)
     - Defensive PII strip in attach block (allowlist focused.tag/id/ariaLabel/dataElabAction only; never input value text per ADR-042 §8.2)
     - try/catch around attach so malformed UI input never breaks aggregator

2. `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/system-prompt.ts`
   - **LOC delta**: +79 LOC (target +30-50, +29 over due to detailed Italian `buildUIContextBlock` covering all 7 fields verbatim per ADR-042 §5 + 4-bullet usage instructions)
   - Changes:
     - Imported `UIStateSnapshot` type from `onniscenza-bridge.ts`
     - Added exported `buildUIContextBlock(ui)` function — returns Italian per-turn UI state context block per ADR-042 §5 BASE_PROMPT v3.3 extension OR empty string when ui null/undefined
     - Extended `buildSystemPrompt` signature with optional `uiState?: UIStateSnapshot | null` 6th parameter
     - Conditional injection at end of parts assembly (LAST so route/mode/modalita freshest signal seen by LLM)
     - PRINCIPIO ZERO compliant: "Ragazzi" plurale never violated; null fields admitted ("non ho contesto"); NO hallucination

3. `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/services/api.js`
   - **LOC delta**: +29 LOC (target +10-20, +9 over due to mirroring SSE path required for completeness — both code paths LIVE prod)
   - Changes:
     - In `tryNanobot` (REST path): try/catch read `window.__ELAB_API.ui.getState()` + attach as `payload.ui` when available, defensive fallback skip on missing/error
     - In `chatWithAIStream` (SSE path): identical defensive attach block (mirror)
     - Both paths: `if (typeof window !== 'undefined' && window.__ELAB_API && window.__ELAB_API.ui && typeof window.__ELAB_API.ui.getState === 'function')` guard chain
     - NEVER breaks chat on UI snapshot failure (silent fallback)

**Total LOC delta**: +194 LOC (vs target ~90-150 cumulative; +44 over due to verbose ADR-042 §3+§5 verbatim adherence + defensive PII strip + dual SSE/REST mirror — onesto admitted, mandate prioritizes completeness)

---

## 7-field UIStateSnapshot schema verify (ADR-042 §3)

✅ All 7 fields present in `UIStateSnapshot` interface (`onniscenza-bridge.ts`):

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | `route` | `string \| null` | Active hash route (lavagna/tutor/chatbot-only/etc.) |
| 2 | `mode` | `string \| null` | Derived mode enum |
| 3 | `focused` | `{tag, id, ariaLabel, dataElabAction} \| null` | PII-safe structural summary, NEVER input value |
| 4 | `modals` | `Array<{title, modal}>` | Open dialogs via [role="dialog"] |
| 5 | `modalita` | `string \| null` | Lavagna modalita 4-enum or null when not lavagna |
| 6 | `lesson_path_step` | `number \| null` | Best-effort current step index |
| 7 | `opened_panels` | `string[]` | Visible RetractablePanel/FloatingWindow titles |

Schema matches exactly the frontend producer `src/services/elab-ui-api.js:206-301 buildStateSnapshot()` 7-field output (verified Read).

---

## Env flag wire-up verify

✅ `INCLUDE_UI_STATE_IN_ONNISCENZA` read in `onniscenza-bridge.ts:aggregateOnniscenza`:

```ts
const includeUiState = (Deno.env.get('INCLUDE_UI_STATE_IN_ONNISCENZA') || 'false').toLowerCase() === 'true';
if (includeUiState && input.ui && typeof input.ui === 'object') {
  // attach ui to snapshot.ui with PII strip
}
```

- Default `'false'` → skip ui key entirely (no perf overhead, V1 baseline shape preserved for 95% non-canary requests)
- When `true`: attach with defensive PII strip (allowlist 4 focused fields only)
- Canary opt-in deferred Phase 5 iter 28-29 per ADR-042 §2 + §7 decision matrix

---

## BASE_PROMPT v3.3 extension verify (ADR-042 §5)

✅ `buildUIContextBlock(ui)` returns Italian context block matching ADR-042 §5 spec:

- Header `## STATO UI ATTUALE (Sense 1.5 morfismo runtime)`
- Bullet list 6 fields (route+mode | modalità | lesson-path step | pannelli | finestre | focalizzato)
- "USA QUESTO CONTESTO PER" 4-bullet usage instructions (1. cosa-vedo / 2. ambiguità / 3. no-op / 4. coerenza contesto)
- Closing NOTA explicit anti-hallucination ("Se un campo è null... ammettilo onestamente")
- Empty string returned when `ui` null/undefined → V1 baseline preserved

Conditional injection in `buildSystemPrompt`:
```ts
if (uiState) {
  const uiBlock = buildUIContextBlock(uiState);
  if (uiBlock) parts.push(uiBlock);
}
```

Position: appended LAST (after BASE_PROMPT + studentContext + capitoloFragment + circuitState + experimentContext + intentSchema override) — ensures route/mode are freshest signal seen by LLM.

---

## api.js wire-up verify (ADR-042 §4)

✅ Frontend reads `__ELAB_API.ui.getState()` and passes `ui` field in chat request body:

- **REST path** (`tryNanobot`): try/catch defensive attach to payload before fetch
- **SSE path** (`chatWithAIStream`): mirror defensive attach (both code paths active in prod)
- Guards: `typeof window !== 'undefined' && window.__ELAB_API && window.__ELAB_API.ui && typeof window.__ELAB_API.ui.getState === 'function'`
- Fallback: silent skip if api missing → NEVER breaks chat
- L0b namespace `__ELAB_API.ui` mounted iter 22 per ADR-041 §3 + §12 (verified `simulator-api.js:30+46-51`)

---

## CoV results 3-step

### CoV-1 (vitest baseline PRE atom)
- **Result**: ✅ PASS
- **Count**: 13752 passed | 15 skipped | 8 todo (13775 total)
- **Files**: 282 passed | 1 skipped (283)
- **Duration**: 378.53s
- **Source**: `/private/tmp/claude-501/...b1wz3olrp.output` tail

### CoV-2 (incremental anti-regression on affected modules)
- **Result**: ✅ PASS
- **Count**: 77 passed | 4 skipped (81 total)
- **Files**: 4 passed (api-retry + onniscenza-conversational-fusion + onniscenza-classifier + onniscenza-cache-ttl)
- **Duration**: 4.56s
- ZERO regressions on existing onniscenza-bridge consumers + api.js retry tests

### CoV-3 (vitest full preserve POST atom)
- **Result**: ✅ PASS
- **Count**: 13752 passed | 15 skipped | 8 todo (13775 total) — IDENTICAL TO BASELINE
- **Files**: 282 passed | 1 skipped (283)
- **Duration**: 371.41s
- **Source**: `/private/tmp/claude-501/...bsukcb9k6.output` tail
- **Verified**: ZERO regressions, baseline 13752 preserved EXACTLY post atom

---

## Caveat onesti (NO compiacenza)

1. **LOC delta +44 over cumulative target**: 194 vs target ~90-150. Honest admission — ADR-042 §3 + §5 verbatim adherence + defensive PII strip + dual SSE/REST mirror necessary, NOT trim-able without contract violation. Future iter can split into multiple atoms if mandate strict.

2. **CoV-3 final preserve VERIFIED PASS post bg completion**: 13752 tests preserved EXACTLY (zero regressions). Additivity argument validated — all changes are new types + new function exports + new optional parameters with backward-compatible defaults.

3. **NOT deployed Edge Function**: per task mandate "DO NOT deploy Edge Function (canary Phase 5 iter 28-29)". Code shipped lives only in working tree. Andrea Phase 5 deploy + canary 5%→25%→100% rollout per ADR-042 §6 + §7 decision matrix.

4. **NOT testing live**: no R8 100-prompt UI context awareness bench executed (Tester-1 ownership iter 26+ R8 fixture per ADR-042 §6.1). Code is design-correct vs ADR-042 §3+§4+§5 but actual UI context accuracy uncertified until R8 ≥80% PASS post-canary.

5. **NO claim "UI state aware LIVE prod"**: env flag default `false`. When canary 5% deployed Phase 5: only 5% requests receive UI context. NO override `ENABLE_ONNISCENZA=true` per V2 caveat 1 (V1 7-layer aggregator active prod per iter 9 + iter 31 ralph 10 fair comparison protocol).

6. **buildSystemPrompt callers NOT updated** (intentional per file ownership): `unlim-chat/index.ts` is the wire-up site — caller responsible for passing `body.ui` through to `buildSystemPrompt(..., uiState)` AND through to `aggregateOnniscenza({..., ui})`. Out of scope this atom (Maker-2 or future atom). Current callers pass undefined for the new 6th param → V1 behavior preserved silently (TypeScript optional).

7. **No max_age timestamp validation iter 25**: ADR-042 §4.3 + §8 risk #4 mention "rejects snapshots >2s old". UIStateSnapshot does NOT yet carry `captured_at` ISO timestamp — frontend `__ELAB_API.ui.getState()` returns 7 fields without timestamp per current `elab-ui-api.js:206-301`. Stale-state race protection deferred Phase 5 iter 28+ (would require Maker-1 elab-ui-api edit, out-of-bounds this atom).

8. **No GZIP compression iter 25**: ADR-042 §8 risk #3 mentions "GZIP compress request body when ui_state field present + size >5KB". Not implemented this atom (typical 1-2KB UI state JSON well below threshold). Defer Phase 5 if telemetry shows >5KB outliers.

9. **No telemetry counters iter 25**: ADR-042 §8 risk #9 mentions "sample telemetry 1/10 onniscenza_ui_attached events post canary 25%". Not implemented this atom. Defer Phase 5 telemetry instrumentation atom.

10. **Cache key NOT extended iter 25**: ADR-042 §4.4 mentions "include UI state in SHA-256 cache key (route|mode|modalita|lesson_path_step compact key)". Not implemented this atom — `onniscenza-cache.ts` `computeKey` unchanged. Cache hit-rate may be stale-state across UI transitions when canary on. Defer Phase 5 cache key extension atom (would require touching `onniscenza-cache.ts`, out-of-bounds this atom file ownership).

---

## Anti-pattern enforced

- ✅ NO claim "UI state aware LIVE prod"
- ✅ NO override `ENABLE_ONNISCENZA=true` env
- ✅ NO PII handling beyond focused element selector + defensive allowlist strip
- ✅ NO `--no-verify`
- ✅ NO destructive ops
- ✅ NO compiacenza (LOC over admitted, CoV-3 unverified admitted, 10 caveats explicit)
- ✅ NO commit (orchestrator commits Phase 3)

---

## File ownership rigid respected

- ✅ MODIFY `supabase/functions/_shared/onniscenza-bridge.ts` (+86 LOC)
- ✅ MODIFY `supabase/functions/_shared/system-prompt.ts` (+79 LOC)
- ✅ MODIFY `src/services/api.js` (+29 LOC)
- ✅ NEW `automa/team-state/messages/maker1-iter31-ralph25-completed.md` (this file)
- ✅ DID NOT modify `elab-ui-api.js` (Maker-1 iter 22 ownership preserved)
- ✅ DID NOT add tests (Tester-1 ownership iter 26+ R8 fixture)
- ✅ DID NOT deploy Edge Function (canary Phase 5 iter 28-29)
- ✅ DID NOT modify `unlim-chat/index.ts` wire-up site (out of bounds — future atom)
- ✅ DID NOT modify `onniscenza-cache.ts` cache key (out of bounds — defer Phase 5)
