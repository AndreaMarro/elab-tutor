---
id: ADR-042 (onniscenza-ui-state-snapshot-integration)
title: Onniscenza UI state snapshot integration — extend `aggregateOnniscenza` with `ui` morfismo Sense 1.5
status: ACCEPTED (iter 31 ralph 32 ratified — INCLUDE_UI_STATE_IN_ONNISCENZA env-gated default false safe rollback. Atom 26.1 impl shipped onniscenza-bridge.ts +86 LOC + system-prompt v3.3 +79 LOC + api.js REST+SSE +29 LOC. Iter 26.2 unlim-chat wire-up COMMITTED iter 31 ralph 30-31 (f9be81f). Edge v80 deploy + canary opt-in iter 32+. Andrea originally gated MA delegated decision to Claude per user feedback iter 32 entrance)
date: 2026-05-03
authors:
  - Andrea Marro
  - Architect Opus iter 31 ralph iter 19 (subagent context-zero per Atom 19.1)
sprint: T close — iter 31 ralph iter 19 (Phase 1 plan iter 17-30 from `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md`)
context-tags:
  - onniscenza
  - ui-state-snapshot
  - morfismo-sense-1.5
  - onnipotenza-pari-passo
  - canary-bench-protocol
  - anti-inflation-g45
  - v1-baseline-protected
extends: ADR-035 onniscenza-v2-1-conversational-fusion-fair-comparison-protocol (iter 10) — base aggregator architecture
parallels: ADR-036 onnipotenza-expansion-ui-namespace-l0b (iter 18, design parallel iter 19)
---

## Status

PROPOSED 2026-05-03 — design only iter 19. Deploy gated Andrea ratify Phase 4
post Phase 0 audit absorption (302 UI elements + 7 cross-cutting categories) +
Phase 1 ADR-036 entrance + Phase 2 NL parser expansion + Phase 3 dispatcher
canary 5%. NO override `ENABLE_ONNISCENZA=true` env (V1 7-layer aggregator
active prod per ADR-035 §3 + iter 31 ralph 10 fair comparison protocol).
NO claim "ADR-037 ACCEPTED" until Andrea ratify Phase 4 + R8 UI context
accuracy bench PASS.

V1 baseline `aggregateOnniscenza` (`onniscenza-bridge.ts:299`) preserved
UNCHANGED. Extension is **additive** (new `ui` key in snapshot output) +
**env-gated** (`INCLUDE_UI_STATE_IN_ONNISCENZA=false` default safe canary
opt-in) per anti-V2-regression mandate (ADR-035 §1 V2 cross-attention REVERTED
iter 39).

---

## §1 Context

### 1.1 ADR-035 V2.1 Onniscenza conversational fusion design (iter 10)

ADR-035 formalized the **fair comparison protocol** governing V2.1 conversational
fusion canary 5%→25%→100% rollout. V2.1 = additive boost factors (experiment-
anchor +0.15 / kit-mention +0.10 / recent-history +0.20 × cosineSim / docente-
stylistic +0.05, capped +0.50 per chunk) on top of V1 RRF k=60 base ordering
preserved UNCHANGED.

V1 baseline (LIVE prod, `ONNISCENZA_VERSION=v1` env iter 39):
- 7-layer aggregator `aggregateOnniscenza` in
  `supabase/functions/_shared/onniscenza-bridge.ts:299` (canonical aggregator
  per iter 9 V2 caveat 1 + iter 10 cross-link §9 final paragraph; legacy
  `state-snapshot-aggregator.ts` reference is stale)
- Pre-LLM classifier `onniscenza-classifier.ts` 6 categorie iter 37 wired
  prod (chit_chat / safety_warning / citation_vol_pag / plurale_ragazzi /
  deep_question / default → topK 0 / 3 / 2 / 2 / 3 / 3)
- RRF k=60 canonical fusion across L1-L7 (RAG + Wiki + Glossario + Class
  memory + Lesson + Chat history + Analogia)
- Layer fetch parallelized via `Promise.all` 200ms timeout each (iter 38
  carryover Tier 1 T1.3 + iter 24 timing harness)
- In-isolate cache LRU 100 entries TTL 30min SHA-256 keyed (iter 41 Phase A
  Task A5, env `ONNISCENZA_CACHE_ENABLED`)

Snapshot output schema today (`OnniscenzaSnapshot`):
- `fetched_at`, `total_latency_ms`, `query`
- `layers: Record<LayerName, LayerStatus>` (per-layer `ok`/`latency_ms`/
  `hits_count`/`error`/`is_stub`)
- `fused: LayerHit[]` (top-K post-RRF k=60)
- `raw: Record<LayerName, LayerHit[]>` (per-layer hits pre-fusion)

### 1.2 Phase 0 Onnipotenza UI audit (iter 17, 4 parallel agents)

Phase 0 enumerated **302 UI interactive elements + 7 cross-cutting categories**
across 4 audit docs file-system verified:

- `docs/audits/2026-05-03-onnipotenza-ui-audit-lavagna.md` (Atom 17.1 Agent A,
  62 elements 24 jsx components)
- `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md` (Atom 17.2 Agent B,
  ~80 elements 21 components)
- `docs/audits/2026-05-03-onnipotenza-ui-audit-tutor-unlim.md` (Atom 17.3
  Agent C, ~70 elements)
- `docs/audits/2026-05-03-onnipotenza-ui-audit-cross-cutting.md` (Atom 17.4
  Agent D, 7 categories: Modalità 4 + lesson-paths + Cronologia + voice +
  keyboard + routing + persistence)

Cross-cutting taxonomy bound directly to **runtime UI state**: `route` (hash
`#tutor` / `#lavagna` / `#chatbot-only` / `#about-easter` / 13 entries
`App.jsx:62 VALID_HASHES`), `mode` (lavagna/tutor/simulator/dashboard/
chatbot/easter/home), `modalita` (4 Modalità per ADR-025 simplification),
`lesson_path_step` (current step index lesson-paths active),
`focused` (currently focused element selector), `modals` (FloatingWindow +
EasterModal + UpdatePrompt + MicPermissionNudge open list), `opened_panels`
(RetractablePanel left/right/bottom + ChatOverlay + DocenteSidebar visibility).

### 1.3 Gap identified

`aggregateOnniscenza` CURRENT prod scope:
- L1 RAG hybrid + L2 Wiki + L3 Glossario + L4 Class memory + L5 Lesson +
  L6 Chat history + L7 Analogia
- Pre-LLM classifier 6-cat
- Anti-absurd validator (NER + Vol/pag + plurale Ragazzi)
- Conversational fusion V2.1 boost factors (experiment-anchor + kit-mention +
  recent-history + docente-stylistic) — gated `ONNISCENZA_VERSION=v2_1`

**MISSING: NO UI state context awareness**. Mistral function calling per
ADR-030 cannot answer questions like:
- "Cosa vedo sulla schermata adesso?"
- "Chiudi la finestra Passo Passo" (which window? need open `modals[]`)
- "Vai al prossimo esperimento" (current step index? need `lesson_path_step`)
- "Spostami in modalità Libero" (current `modalita` to know if no-op)
- "Apri il pannello sinistro" (already open? need `opened_panels[]`)

Without UI state context, Mistral FC produces hallucinated tool args (e.g.,
calling `closeModal('passo-passo')` when modal is not open → no-op + user
frustration), or asks redundant clarifications ("Quale finestra?") instead
of context-aware action proposal.

### 1.4 Pari-passo Onnipotenza expansion (ADR-036)

ADR-036 (parallel design iter 18-19) introduces NEW namespace `__ELAB_API.ui.*`
+ HYBRID selector strategy (ARIA → data-elab → text → CSS) + WHITELIST
expansion 12→~50 mechanical UI ops + L4 INTENT parser server-side validation
+ L6 surface-to-browser dispatcher.

ADR-037 is the **Onniscenza counterpart**: provides Mistral FC (per ADR-030
function calling) the live UI state context required to:
1. Answer "Cosa vedo adesso?" with grounded UI inspection
2. Resolve ambiguous intents ("chiudi la finestra" → which? `modals[]` lookup)
3. Skip no-op tool calls (already in target state)
4. Propose context-coherent next action (in modalità Percorso step 5 → suggest
   `nextStep` not `mountExperiment`)

Together ADR-036 + ADR-037 close the loop **Onnipotenza ↔ Onniscenza pari-
passo + Morfismo Sense 1.5 runtime**.

---

## §2 Decision

Extend `aggregateOnniscenza` output schema in `onniscenza-bridge.ts:299` with a
**new `ui` key** containing per-turn UI state snapshot, conforming to Sense 1.5
morfismo (ADR-019 + CLAUDE.md DUE PAROLE D'ORDINE §Sense 1.5).

The extension is:

1. **Additive** — preserves V1 baseline `OnniscenzaSnapshot` shape + V2.1
   conversational fusion logic + RRF k=60 base ordering UNCHANGED.
2. **Backward compatible** — env flag `INCLUDE_UI_STATE_IN_ONNISCENZA=false`
   default safe (Mistral FC system prompt sees `ui` only post canary opt-in).
3. **Frontend-sourced** — UI state snapshot computed client-side via NEW
   `__ELAB_API.ui.getState()` (per ADR-036 §1.1 namespace) + serialized in
   chat request body. Edge Function reads + injects in `BASE_PROMPT v3.3`
   extension per turn.
4. **Cache-safe** — UI state included in Onniscenza cache key SHA-256 hash
   (when enabled), avoiding stale-state across UI transitions.
5. **Privacy-respecting** — focused element NEVER includes input value text
   (only selector). NEVER includes `elab_class_key` PII identifier (per
   cross-cutting audit §5 caveat 2).
6. **Bandwidth-bounded** — UI state JSON GZIP compressed if >5KB serialized
   bytes.
7. **Stale-state protected** — UI state snapshot includes timestamp + Edge
   Function rejects snapshots `>2s old` (race protection across slow networks).

This ADR governs:
- Phase 1 design (iter 19) — this document
- Phase 2 NL parser entrance integration (iter 20-21, Maker-1 wire-up gated)
- Phase 3 canary 5% deploy (iter 22+, post Phase 2 unit + integration tests)
- Phase 4 Andrea ratify post R8 UI context accuracy bench PASS ≥80% +
  R5 PZ V3 stable (no regression vs V1 baseline 94.2%) + latency overhead
  <100ms (per §7 decision matrix)

ADR-037 does **NOT** auto-promote `INCLUDE_UI_STATE_IN_ONNISCENZA=true` to
production. Ramp 25%→100% requires Andrea explicit ratify post bench PASS +
24h canary 5% soak telemetry clean (per §6 protocol).

---

## §3 UI state snapshot schema

NEW TypeScript interface to be added to `onniscenza-bridge.ts` (extending
`OnniscenzaSnapshot`):

```typescript
export interface UIStateSnapshot {
  /** ISO 8601 timestamp captured frontend `__ELAB_API.ui.getState()`. Edge
   *  rejects snapshots >2s old (max_age) — race protection. */
  captured_at: string;
  /** Active hash route (e.g. '#lavagna', '#tutor', '#chatbot-only',
   *  '#about-easter'). Source: `App.jsx:62 VALID_HASHES` + iter 36 #chatbot-
   *  only/#about-easter (cross-cutting audit §4.3 doc drift flag, iter 22+
   *  unify to single VALID_HASHES list). */
  route: string;
  /** Active mode derived from route + state (lavagna/tutor/simulator/
   *  dashboard/chatbot/easter/home). One-of enum closed. */
  mode: 'lavagna' | 'tutor' | 'simulator' | 'dashboard' | 'chatbot' | 'easter' | 'home';
  /** Currently focused element selector (semantic, NEVER input value text).
   *  Format: `{role}[aria-label="{label}"]` OR `[data-elab-action="{action}"]`
   *  OR `null` when no actionable focus. PII protection: NEVER includes
   *  textbox content. */
  focused: string | null;
  /** Array of opened modals/floating-windows (FloatingWindow titles +
   *  EasterModal + UpdatePrompt + MicPermissionNudge). Empty array if none.
   *  Each entry: {id: string, title: string, type: 'floating' | 'modal' |
   *  'toast'}. */
  modals: Array<{ id: string; title: string; type: 'floating' | 'modal' | 'toast' }>;
  /** Active Modalità 4 lavagna (per ADR-025 simplification). One-of enum.
   *  Null when route !== '#lavagna'. */
  modalita: 'percorso' | 'libero' | 'gia-montato' | 'guida-errore' | null;
  /** Current lesson-path step index 0-indexed (when modalita === 'percorso'
   *  + lesson-path active). Null otherwise. Source:
   *  `LessonPathPanel` state. */
  lesson_path_step: number | null;
  /** RetractablePanel + ChatOverlay + DocenteSidebar visibility list.
   *  Each entry: {id: 'panel-left' | 'panel-right' | 'panel-bottom' |
   *  'chat-overlay' | 'docente-sidebar', open: boolean}. */
  opened_panels: Array<{ id: string; open: boolean }>;
}

export interface OnniscenzaSnapshot {
  // existing fields unchanged…
  fetched_at: string;
  total_latency_ms: number;
  query: string;
  layers: Record<LayerName, LayerStatus>;
  fused: LayerHit[];
  raw: Record<LayerName, LayerHit[]>;
  /** NEW iter 19 ADR-037: UI state snapshot Sense 1.5 morfismo per turn.
   *  Present when env INCLUDE_UI_STATE_IN_ONNISCENZA=true AND request body
   *  includes `ui_state`. Absent (undefined) otherwise (backward compat
   *  V1 baseline). */
  ui?: UIStateSnapshot;
}
```

### Field rationales

- **`route`**: distinct from `mode` because hash routing has deep-link query
  params (`?exp=v1-cap6-esp1`, `?live=1&teacher=...`). Mistral FC needs
  raw route to answer "Sono in dashboard live?" vs derived mode.
- **`mode`**: closed enum 7 values for normalization (Mistral FC schema
  constraint). Source-of-truth: `App.jsx:62 VALID_HASHES` + HomePage.jsx
  iter 36 hash routing extensions (#chatbot-only + #about-easter).
- **`focused`**: enables "focus-aware" responses ("Stai scrivendo nel campo
  chat" vs "Stai modificando il valore del LED"). PII protection mandate:
  `{role}[aria-label]` OR `[data-elab-action]` only — NEVER read `.value` of
  inputs.
- **`modals`**: per cross-cutting audit §3 "Cronologia ChatGPT-style" + Lavagna
  audit §3 "FloatingWindow" + Tutor+UNLIM audit §3 (EasterModal, UpdatePrompt,
  MicPermissionNudge). Resolves "chiudi la finestra X" ambiguity.
- **`modalita`**: explicit null when route≠'#lavagna' avoids undefined-vs-empty
  ambiguity. Closed enum 4 per ADR-025.
- **`lesson_path_step`**: zero-based index. Null when not in modalità Percorso
  OR no lesson-path active. Mistral FC uses this to propose "Vai al passo
  successivo" → call `__ELAB_API.unlim.nextStep()` only if step <
  total_steps-1.
- **`opened_panels`**: 5 fixed IDs (panel-left/right/bottom + chat-overlay +
  docente-sidebar). Boolean `open` enables "Chiudi pannello sinistro" no-op
  detection (already closed → suggest alternative action).

---

## §4 Wire-up flow

### 4.1 Frontend: `__ELAB_API.ui.getState()` NEW method

Per ADR-036 §1.1 NEW namespace `__ELAB_API.ui.*`:

```typescript
// src/services/simulator-api.js (or NEW src/services/ui-state-api.js)
window.__ELAB_API.ui = {
  getState(): UIStateSnapshot {
    return {
      captured_at: new Date().toISOString(),
      route: window.location.hash || '#home',
      mode: deriveMode(window.location.hash),  // hash → enum mapping
      focused: getFocusedSelector(),  // document.activeElement → semantic selector OR null
      modals: collectOpenModals(),  // querySelectorAll('[role="dialog"][aria-modal="true"]') + EasterModal + Update + Mic
      modalita: getCurrentModalita(),  // localStorage 'elab-lavagna-modalita' OR null when route≠#lavagna
      lesson_path_step: getCurrentLessonPathStep(),  // LessonPathPanel state OR null
      opened_panels: collectOpenedPanels(),  // RetractablePanel + ChatOverlay + DocenteSidebar visibility
    };
  },
};
```

Helper functions enumerated:
- `deriveMode(hash)`: closed-enum mapping per `App.jsx:62 VALID_HASHES`
- `getFocusedSelector()`: `document.activeElement` → `{role}[aria-label]` OR
  `[data-elab-action]` (PII-safe, NEVER input value)
- `collectOpenModals()`: `document.querySelectorAll('[role="dialog"][aria-modal="true"]')` +
  EasterModal `[data-elab-modal="easter"]` + UpdatePrompt
  `[data-elab-toast="update"]` + MicPermissionNudge
  `[data-elab-toast="mic-permission"]`. Each → `{id, title, type}`.
- `getCurrentModalita()`: `localStorage.getItem('elab-lavagna-modalita')` (per
  Lavagna audit §3 LavagnaShell:613) when route='#lavagna', else `null`.
- `getCurrentLessonPathStep()`: LessonPathPanel ref OR custom event bus OR
  `window.__ELAB_LESSON_STEP` accessor (frontend wire-up Maker-1 Phase 2).
- `collectOpenedPanels()`: RetractablePanel `[data-elab-action="panel-{dir}"]`
  visibility + ChatOverlay + DocenteSidebar boolean state from React refs.

### 4.2 Frontend: pass UI state with chat request body

`src/components/lavagna/useGalileoChat.js` (existing chat hook iter 36+37+38)
extension:

```javascript
// existing fetch body augmentation
const requestBody = {
  message: userMessage,
  history: priorHistory,
  experimentId: currentExperimentId,
  // NEW iter 19 ADR-037: include UI state snapshot when env feature flag ON
  ui_state: window.__ELAB_API?.ui?.getState?.() || null,
};
```

Frontend gated by `window.__ELAB_FEATURE_FLAGS?.includeUIStateInOnniscenza`
boolean (defaults false; flipped true post canary opt-in via runtime config OR
deploy-time env). When false, `ui_state` field omitted entirely (backward
compat V1 request shape).

### 4.3 Edge Function: read + inject

`supabase/functions/unlim-chat/index.ts` (existing entry per iter 36+37+38):

```typescript
// existing request parse
const body = await req.json();
const userMsg = body.message;

// NEW iter 19 ADR-037: read UI state when env flag ON + body includes ui_state
const includeUIState = (Deno.env.get('INCLUDE_UI_STATE_IN_ONNISCENZA') || 'false').toLowerCase() === 'true';
let uiStateSnapshot: UIStateSnapshot | null = null;
if (includeUIState && body.ui_state) {
  // Validate snapshot shape + max_age 2s
  const captured = new Date(body.ui_state.captured_at).getTime();
  const ageMs = Date.now() - captured;
  if (ageMs <= 2000 && validateUIStateSchema(body.ui_state)) {
    uiStateSnapshot = body.ui_state;
  } else {
    console.info(JSON.stringify({
      level: 'warn',
      event: 'ui_state_rejected',
      reason: ageMs > 2000 ? 'stale' : 'schema_invalid',
      age_ms: ageMs,
    }));
  }
}

// existing aggregateOnniscenza call
const onniscenzaSnapshot = await aggregateOnniscenza({
  query: userMsg,
  // …existing fields…
});

// NEW iter 19: attach UI state to snapshot output
if (uiStateSnapshot) {
  onniscenzaSnapshot.ui = uiStateSnapshot;
}

// NEW iter 19: extend BASE_PROMPT v3.3 with UI state context block
const uiContextBlock = uiStateSnapshot ? buildUIContextBlock(uiStateSnapshot) : '';
const systemPrompt = BASE_PROMPT_V33 + uiContextBlock;
```

### 4.4 Cache key extension

When `ONNISCENZA_CACHE_ENABLED=true` (per iter 41 Phase A Task A5), include
UI state in SHA-256 cache key to avoid stale-state cross-turn:

```typescript
// supabase/functions/_shared/onniscenza-cache.ts
export async function computeKey(input: {
  query: string;
  topK?: number;
  experimentId?: string | null;
  classKey?: string | null;
  // NEW iter 19 ADR-037: include UI state route+mode+modalita+lesson_path_step
  // (not full snapshot — focused/modals are too volatile for cache key)
  uiStateKey?: string | null;
}): Promise<string> {
  // existing hash computation +uiStateKey if present
}
```

`uiStateKey` = `route|mode|modalita|lesson_path_step` (compact, low-entropy).
Excludes `focused`/`modals`/`opened_panels` (too volatile, would tank cache
hit rate ≥40% target G7). Trade-off: cache misses on modalità switch (correct
behavior — different mode requires different RAG context).

---

## §5 BASE_PROMPT v3.3 extension

Append per-turn UI state context block to existing BASE_PROMPT v3.2 (per iter
38 deploy + iter 39+ targeted lift):

```text
---

## STATO UI ATTUALE (Sense 1.5 morfismo runtime)

Il docente sta visualizzando:
- Pagina/Route: {ui.route} (modalità app: {ui.mode})
- {if ui.modalita}Modalità lavagna attiva: {ui.modalita}{/if}
- {if ui.lesson_path_step !== null}Passo corrente lesson-path: {ui.lesson_path_step + 1} (0-indexed: {ui.lesson_path_step}){/if}
- Pannelli aperti: {ui.opened_panels.filter(p => p.open).map(p => p.id).join(', ') || 'nessuno'}
- Finestre/modali aperte: {ui.modals.length === 0 ? 'nessuna' : ui.modals.map(m => `"${m.title}" (${m.type})`).join(', ')}
- Elemento focalizzato: {ui.focused || 'nessuno'}

USA QUESTO CONTESTO PER:
1. Rispondere a domande tipo "Cosa vedo sulla schermata adesso?" (basa la risposta su `route`/`mode`/`modalita`/`opened_panels`/`modals`).
2. Risolvere riferimenti ambigui ("chiudi la finestra" → identifica quale via `modals[]`; "apri il pannello" → quale è già aperto via `opened_panels[]`).
3. Evitare azioni no-op (se `modalita === 'percorso'` non chiamare `__ELAB_API.ui.modalita('percorso')`).
4. Proporre l'azione coerente al contesto (in modalità Percorso step 5 → suggerisci `nextStep` non `mountExperiment` random).

NOTA: NON inventare lo stato UI. Se il campo è `null` o `nessuno`, ammettilo
("Non ho il contesto per quella finestra"). Per Modalità in cui Modalità=null
(route !== #lavagna), NON chiamare API Modalità.
```

The block injects after existing PRINCIPIO ZERO + LINGUAGGIO + USO DELLE FONTI
sections, before few-shot examples. Length: ~250-350 tokens per turn (cap
verified vs `max_tokens=120` output budget — input prompt budget separate,
typical 2-4K tokens prompt OK).

### 5.1 Mistral FC schema integration

Per ADR-030 Mistral function calling canonical, the UI state context is
**system prompt extension** (not function arg schema). Mistral FC sees UI
state in system message + emits canonical `[INTENT:{action, args}]` JSON OR
function call structured output `{action, args}` per ADR-028 §14.b amend.

UI state does NOT change INTENT_TOOLS_SCHEMA shape (per ADR-030 §3 4-way
schema canonical resolution `args.id`). It informs LLM reasoning to populate
`args` correctly (e.g., `closeModal({id: "passo-passo"})` only when
`ui.modals` includes a modal with id="passo-passo").

---

## §6 Bench protocol R8 NEW 100-prompt UI action context awareness

### 6.1 Fixture spec

`scripts/bench/r8-fixture.jsonl` 100 prompts × 5 categories × 20 prompts each:

| Category | Example prompts | Expected UI context use |
|----------|-----------------|-------------------------|
| `ui_state_inspection` (20) | "Cosa vedo sulla schermata adesso?" / "Sono nella lavagna o nel tutor?" / "Quale modalità è attiva?" / "Quanti pannelli sono aperti?" | LLM cites `route`/`mode`/`modalita`/`opened_panels` accurately |
| `ui_modal_resolution` (20) | "Chiudi la finestra Passo Passo" / "Riduci la chat UNLIM" / "Apri la cronologia" | LLM resolves modal id from `modals[]` + emits correct INTENT |
| `ui_navigation_aware` (20) | "Vai al prossimo esperimento" / "Torna al passo precedente" / "Ricomincia dall'inizio" | LLM uses `lesson_path_step` to compute next/prev/restart correctly |
| `ui_no_op_avoidance` (20) | "Apri il pannello sinistro" (when already open) / "Vai in modalità Percorso" (when already in Percorso) | LLM detects no-op + proposes alternative action OR confirms current state |
| `ui_focus_aware` (20) | "Cosa sto modificando?" / "Quale campo è attivo?" / "Sto scrivendo nella chat?" | LLM cites `focused` selector + interprets context (chat vs LED value vs canvas) |

### 6.2 Scoring rubric (per-prompt, 0-1)

- **UI context accuracy** (0.5 weight): does LLM response reference correct
  `route`/`mode`/`modalita`/`modals`/`opened_panels`/`lesson_path_step`/
  `focused` from injected snapshot? Binary 0/1 per facet, average 5-7 facets.
- **PRINCIPIO ZERO V3 score** (0.3 weight): plurale "Ragazzi" + Vol/pag
  citation + kit ELAB mention preserved per existing scorer
  `score-unlim-quality.mjs` 12-rule.
- **No-hallucination** (0.2 weight): LLM does NOT invent UI state not present
  in snapshot (e.g., "Vedo che hai 3 LED accesi" when `ui.focused = null` and
  query is "Cosa vedo?" — must admit "Non ho contesto sui componenti" OR
  fetch via `__ELAB_API.unlim.getCircuitState()` separately).

Aggregate score per prompt: `0.5 * ui_acc + 0.3 * pz_v3 + 0.2 * no_hall`.

### 6.3 Targets

- **R8 UI context accuracy**: ≥80% (80/100 prompts pass score ≥0.8)
- **R5 PZ V3** (re-run post-deploy): ≥V1 baseline 94.2% (NO regression)
- **Latency overhead**: <100ms p95 vs V1 baseline 3380ms (4500ms → 3700ms
  if UI state JSON serialization + parse + cache key extension all add up
  per session)
- **R6 100-prompt RAG-aware** (per ADR-014 + ADR-035 §4): MAINTAIN baseline
  (UI state context should not regress recall@5 — defer iter 22+ verify
  post Voyage re-ingest unblock per ADR-021)

### 6.4 Bench runner

NEW `scripts/bench/run-sprint-r8-ui-context.mjs` (~250 LOC) modeled on
`run-sprint-r5-stress.mjs` + `run-sprint-r7-stress.mjs`:
- Loads R8 fixture 100 prompts
- Per prompt: synthetic UI state injection (varied `route`/`mode`/`modalita`/
  `modals`/`focused`/`lesson_path_step` permutations covering all 5 categories)
- POSTs to Edge Function `unlim-chat` with `ui_state` body field
- Scores response with R8 rubric §6.2
- Outputs `scripts/bench/output/r8-ui-context-{report,responses,scores}-
  {timestamp}.{md,jsonl,json}`

---

## §7 Decision matrix canary

Compare R8 measurement post `INCLUDE_UI_STATE_IN_ONNISCENZA=true` canary 5%
against V1 baseline (no UI state context, current prod). Three exit paths:

| Condition | Action | Rationale |
|-----------|--------|-----------|
| R8 UI context accuracy ≥80% **AND** R5 PZ V3 ≥V1 baseline 94.2% **AND** latency overhead p95 <100ms | **RAMP 25%** → 24h soak → ramp 100% post 24h soak clean | UI awareness lift verified + PZ V3 stable + latency acceptable |
| R8 UI context ≥70% **AND** R5 PZ V3 ≥V1 - 0.5pp **AND** latency p95 <200ms | **STAY canary 5%** + iterate prompt v3.3 wording OR cache key strategy iter 22+ | Marginal gain, more soak data needed before ramp |
| **ANY OF**: R8 UI context <70% **OR** R5 PZ V3 <V1 - 0.5pp **OR** latency p95 >300ms | **REVERT** `INCLUDE_UI_STATE_IN_ONNISCENZA=false` env immediate flip + document regression `automa/state/inflation-flags.jsonl` append entry | Clear regression matching V2 cross-attention pattern (ADR-035 §1), do not repeat iter 39 mistake |

### 7.1 Quantitative thresholds rationale

- **R8 ≥80% RAMP**: alignment with G45 anti-inflation cap (no claim "UI
  context awareness LIVE" without hard bench evidence ≥80%). Lower bar 70%
  for STAY-canary acknowledges design refinement opportunity (prompt wording
  + serialization detail).
- **R5 PZ V3 ≥V1 baseline**: V1 94.2% baseline iter 38 carryover, no
  regression mandate (per ADR-035 §5 V2.1 protocol).
- **Latency p95 <100ms RAMP**: V1 3380ms baseline + 100ms tolerance = 3480ms
  ceiling. STAY canary 200ms tolerance acknowledges JSON serialize + parse
  + GZIP overhead measurement uncertainty pre-deploy.
- **REVERT triggers**: aligned ADR-035 §5 thresholds (PZ V3 -0.5pp + latency
  +10% p95).

### 7.2 Sample analysis (synthetic, illustrative)

Hypothetical R8 result post canary 5%:

| Metric | V1 baseline | UI state canary | Verdict |
|--------|-------------|-----------------|---------|
| R8 UI context | (no context) | 84/100 (84%) | ≥80% ✓ |
| R5 PZ V3 | 94.2% | 94.0% | ≥V1 ✓ (within ±1pp noise) |
| Latency p95 | 3380ms | 3445ms | +65ms <100ms ✓ |
| **Verdict** | — | **RAMP 25%** | All gates met |

Counter-example regression:

| Metric | V1 baseline | UI state canary | Verdict |
|--------|-------------|-----------------|---------|
| R8 UI context | (no context) | 67/100 (67%) | <70% ✗ |
| R5 PZ V3 | 94.2% | 93.5% | within -0.5pp threshold ✓ |
| Latency p95 | 3380ms | 3510ms | +130ms <200ms ✓ |
| **Verdict** | — | **REVERT** | R8 below floor 70% — UI context not adding value, prompt v3.3 wording iteration required iter 22+ |

---

## §8 Risks + mitigations

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| 1 | Latency overhead per UI state serialization (frontend `__ELAB_API.ui.getState()` DOM walk + JSON.stringify) | Medium | Low (+10-30ms client) | Cache UI state in-isolate frontend TTL 30s + diff-based recompute only on hashchange/popstate/setState events. Skip recompute if React state unchanged. |
| 2 | Privacy: focused element accidentally includes input value text | Low (design-mandated PII-safe) | High (PII leak) | Strict allowlist `{role}[aria-label]` OR `[data-elab-action]` only. NEVER `.value` accessor. Code review gate Phase 2 Maker-1 wire-up. Test fixture covers input focus → expects selector NOT value. |
| 3 | Bandwidth: UI state JSON >5KB serialized (e.g., 20+ modals + complex selectors) | Low (typical 1-2KB) | Low (+10-20ms transit) | GZIP compress request body when `ui_state` field present + size >5KB. Edge Function decompresses transparently (Deno gzip API). |
| 4 | Stale state race: UI snapshot captured before user navigation, sent post-navigation | Medium (slow networks) | Medium (LLM cites stale modalita) | `captured_at` timestamp + Edge Function rejects snapshots `>2s old` per §4.3. Telemetry event `ui_state_rejected` count per session monitored. |
| 5 | LLM prompt budget overflow (UI context block ~250-350 tokens per turn) | Low (typical prompt 2-4K well within 8K) | Low (+token cost ~$0.0001/turn) | Token count instrumented + capped at 400 tokens UI block (truncate `modals[]` + `focused` if exceeds). Telemetry `ui_block_token_count` p95 monitored. |
| 6 | Cache hit rate regression (per §4.4 cache key extension) | Medium | Medium (latency lift via cache loss) | Cache key includes only `route|mode|modalita|lesson_path_step` (low-entropy 4-tuple, ~20 unique combinations across typical session) — not `focused`/`modals`/`opened_panels` (volatile). Target ≥40% hit rate (G7 onniscenza-measure skill gate) preserved. |
| 7 | Mistral FC hallucinates UI state when snapshot absent (canary 95% off) | Low (system prompt v3.3 only on canary 5%) | Medium (off-canary unaffected) | Backward compat env `INCLUDE_UI_STATE_IN_ONNISCENZA=false` default → BASE_PROMPT v3.2 unchanged for 95% requests. Canary 5% receives v3.3 + UI state + measurement. |
| 8 | Frontend `__ELAB_API.ui.getState()` returns stale React state (closures) | Medium | Low (5-10% snapshot inaccuracy) | Compute via React refs (always-current) OR `window.__ELAB_*` accessors set in useEffect. Avoid stale closure via `useCallback([deps])` discipline + ESLint exhaustive-deps rule. |
| 9 | Telemetry event flood (every onniscenza call emits ui state metadata) | Low | Low | Sample telemetry 1/10 `onniscenza_ui_attached` events post canary 25% (matches ADR-035 §7 risk #8 sampling pattern). |
| 10 | DOC DRIFT: `#chatbot-only` + `#about-easter` not in `App.jsx:62 VALID_HASHES` (cross-cutting audit §5 caveat 6) | Medium (current state) | Low (snapshot route includes hash regardless) | Snapshot `route` field captures raw `window.location.hash`, not VALID_HASHES whitelist filter. Iter 22+ unify VALID_HASHES (separate from this ADR scope). |

---

## §9 Rollback plan

### Immediate revert

```bash
SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets set \
  INCLUDE_UI_STATE_IN_ONNISCENZA=false \
  --project-ref euqpdueopmlllqjmqnyb
# Output: "Finished supabase secrets set."
# Edge Function reads new secret on next cold start (~30s warmup cron picks up)
```

### Properties

- **No DB schema changes** — env flag swap only, no migration required
- **No client-side change required** — `useGalileoChat.js` continues to send
  `ui_state` body field harmlessly (Edge Function ignores when env false)
  OR frontend feature flag flipped via runtime config
- **In-place reversibility** — V1 baseline `OnniscenzaSnapshot` shape always
  present (`ui` field optional/absent when env false)
- **Zero downtime** — Edge Function cold start ~30s warmup cron picks up new
  env per ADR-035 §8 pattern
- **UI state code preserved** in `onniscenza-bridge.ts` + `unlim-chat/index.ts`
  + `__ELAB_API.ui.getState()` for iter 22+ tuning

### Audit log entry

Per ADR-037 acceptance gate §6 + §7 REVERT trigger:

```json
{
  "timestamp": "<ISO 8601>",
  "iter": "31",
  "atom": "ADR-037-revert",
  "regression": {
    "metric": "R8_ui_context | R5_pz_v3 | latency_p95",
    "v1_baseline": "<value>",
    "ui_state_measured": "<value>",
    "delta": "<value>",
    "threshold_violated": "<§7 condition>"
  },
  "evidence_files": [
    "scripts/bench/output/r8-ui-context-report-<canary-timestamp>.md",
    "scripts/bench/output/r5-stress-report-<v1-baseline-timestamp>.md"
  ],
  "revert_command": "SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets set INCLUDE_UI_STATE_IN_ONNISCENZA=false --project-ref euqpdueopmlllqjmqnyb",
  "revert_timestamp": "<ISO 8601 of revert>",
  "iter_loss_estimate": "<hours>"
}
```

Append to `automa/state/inflation-flags.jsonl` per ADR-035 §8 audit pattern
(anti-inflation traceability, no claim "UI state LIVE" without bench evidence).

### Post-revert iteration options

Iter 22+ ADR-037 redesign options (gated next ralph iteration):

1. Tighten BASE_PROMPT v3.3 wording (less generic, more directive examples)
2. Reduce snapshot scope (drop `focused` if low signal, keep `route`/`mode`/
   `modalita`/`modals` only)
3. Pre-classify UI-aware queries via `onniscenza-classifier.ts` 7th category
   `ui_inspection` → only inject snapshot for those categories (selective
   token spend)
4. Replace BASE_PROMPT injection with Mistral FC structured tool argument
   (e.g., `getUIState()` no-arg function call returning snapshot inline) —
   trades 1 turn latency for cleaner schema

---

## §10 Cross-link

- **ADR-035 onniscenza-v2-1-conversational-fusion** (iter 10) — base
  aggregator architecture + V1 baseline protected mandate + RRF k=60 fusion
  preservation rule
- **ADR-036 onnipotenza-expansion-ui-namespace-l0b** (iter 18, parallel iter
  19) — Onnipotenza counterpart NEW `__ELAB_API.ui.*` namespace + HYBRID
  selector + WHITELIST 12→~50 + L0b/L4/L6 layer expansion
- **Phase 0 audits Onnipotenza UI** (iter 17, 4 agents):
  - `docs/audits/2026-05-03-onnipotenza-ui-audit-lavagna.md` (62 elements 24
    components)
  - `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md` (~80 elements)
  - `docs/audits/2026-05-03-onnipotenza-ui-audit-tutor-unlim.md` (~70 elements)
  - `docs/audits/2026-05-03-onnipotenza-ui-audit-cross-cutting.md` (7
    categories: Modalità + lesson-paths + Cronologia + voice + keyboard +
    routing + persistence)
- **Master plan iter 31** ralph 17-30:
  `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md`
  §3 Phase 1 Atom 19.1 (this ADR scope)
- **ADR-019 Sense 1.5 morfismo runtime docente/classe** (iter 12) — Sense 1.5
  morfismo foundation referenced §1.4 + CLAUDE.md DUE PAROLE D'ORDINE Sense 1.5
- **ADR-025 Modalità 4 simplification** — closed-enum 4 modalità referenced
  schema §3
- **ADR-028 onnipotenza-intent-dispatcher-server-side** + §14.b amend (iter
  37) — INTENT canonical + surface-to-browser pivot, pari-passo with UI state
  context (ADR-037 informs which INTENT to emit)
- **ADR-030 mistral-function-calling-intent-canonical** (iter 38) —
  responseFormat json_schema + INTENT_TOOLS_SCHEMA `args.id` canonical;
  ADR-037 informs `args` population via UI snapshot
- **`onniscenza-bridge.ts:299`** (canonical aggregator V1 baseline + iter 9 V2
  caveat 1 + iter 10 cross-link §9 final paragraph; legacy
  `state-snapshot-aggregator.ts` reference is stale, NOT in `_shared/`)
- **`onniscenza-conversational-fusion.ts`** — V2.1 boost factors iter 41
  commit `2abe26d`, env-gated `ONNISCENZA_VERSION=v2_1` selector path
- **`onniscenza-classifier.ts`** — 6 categorie pre-LLM topK iter 37 wired
  prod (ADR-037 candidate 7th category `ui_inspection` iter 22+ option 3
  post-revert)
- **`unlim-chat/index.ts`** — Edge Function entry, wire-up §4.3 step 5
  callLLM responseFormat + step 6a structuredIntents consumption (per ADR-030)
- **CLAUDE.md DUE PAROLE D'ORDINE Sense 1.5 + Sprint T iter 31 Phase 1 close**
  — Sense 1.5 morfismo runtime docente+classe+contesto+funzioni+finestre +
  memoria persistente

### Anti-pattern enforced (per task mandate iter 31 ralph 19 Atom 19.1)

- **NO claim "ADR-037 ACCEPTED"** — PROPOSED status until Andrea ratify
  Phase 4 + R8 bench PASS ≥80% + R5 stable ≥V1 baseline + latency overhead
  <100ms p95
- **NO override `ENABLE_ONNISCENZA=true` env** — V1 7-layer aggregator active
  prod per ADR-035 §3 + iter 31 ralph 10 fair comparison protocol
- **NO inflate score** — ADR-037 design contributes 0 production behavior
  change iter 19 (architectural design only); UI state ramp/revert deferred
  §7 decision matrix
- **NO write outside `docs/adrs/` + `automa/team-state/messages/`** per task
  mandate iter 31 ralph 19
- **NO `--no-verify` commits** — orchestrator commits Phase 3 (this iter 19
  ADR + completion msg only)
- **NO commit by this design iter** — orchestrator commits Phase 3 per task
  mandate
