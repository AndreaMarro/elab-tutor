---
id: ADR-036 (onnipotenza-expansion-ui-namespace-l0b)
title: Onnipotenza Expansion — `__ELAB_API.ui.*` namespace L0b + HYBRID selector + WHITELIST 12→~50
status: PROPOSED (Andrea ratify queue Phase 5 entrance, NOT auto-claim ACCEPTED)
date: 2026-05-03
authors:
  - Andrea Marro
  - Architect Opus iter 31 ralph iter 19 (subagent context-zero, baseline G45 Opus iter 39 score 8.0)
sprint: T close — iter 31 ralph iter 19 (Phase 1 Atom 18.1 from `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md`)
context-tags:
  - onnipotenza
  - ui-namespace-l0b
  - hybrid-selector
  - whitelist-50
  - audit-log
  - canary-bench-protocol
  - anti-inflation-g45
  - principio-zero
  - morfismo-sense-1.5
extends: ADR-028 (INTENT dispatcher server-side, ACCEPTED iter 37 §14 surface-to-browser amend)
relates-to:
  - ADR-029 (LLM_ROUTING_WEIGHTS conservative tune 70/20/10)
  - ADR-030 (Mistral function calling INTENT canonical, PROPOSED iter 38)
  - ADR-035 (Onniscenza V2.1 conversational fusion, PROPOSED iter 31 ralph iter 10)
  - ADR-037 (Onniscenza UI state snapshot integration, PLANNED iter 19 Atom 19.1)
phase-0-audit-master-enumeration: 302 UI elements + 8 critical findings
namespace-target: NEW `__ELAB_API.ui.*` separate from `__ELAB_API.unlim.*`
whitelist-expansion: 12 (iter 37 baseline) → ~50 (iter 22 impl target)
---

## Status

**PROPOSED** 2026-05-03 — design only iter 19 Atom 18.1. **NOT ACCEPTED** until Andrea ratify
Phase 5 (per master plan §7 Atom 28.1 + §11 G45 anti-inflation invariant). Implementation
gated Phase 2-3 (iter 20-24) post Andrea ratify. Canary 5% gated Phase 5 (iter 28). NO
production wire-up until R7 200-prompt re-bench post Mistral function calling deploy ≥80%
canonical AND R8 100-prompt UI action context awareness ≥80% PASS (per §8 decision matrix).

Rollback lever single env flip `ENABLE_UI_DISPATCH=false` immediate revert (per §10).

---

## §1 Context

### 1.1 Phase 0 master enumeration (post 4-agent parallel audit iter 17-18)

Per plan §2 Phase 0 Atoms 17.1-17.4 4-agent parallel team-spawn (`/agent-teams:team-spawn`)
shipped 4 audit docs file-system verified 2026-05-03:

| Audit | Agent | Atom | Elements | NEW markers raccomandati |
|---|---|---|---|---|
| Lavagna components 24 jsx 5443 LOC | Agent A | 17.1 | ~62 | ~84 |
| Simulator components 38 jsx (engine excluded) | Agent B | 17.2 | ~95 | ~50 |
| Tutor + UNLIM + common + chatbot + easter + teacher + student + admin + dashboard 35 jsx 14512 LOC | Agent C | 17.3 | ~95 | ~148 |
| Cross-cutting 7 categorie (Modalità 4 + lesson-paths + Cronologia + voice + keyboard + routing + persistence) | Agent D | 17.4 | ~50 | (overlap, voice/keyboard/routing partials) |

**Master enumeration TOTAL** (file-system verified, NOT inflated): **~302 UI elements unique**
across 97 jsx files. Cumulative NEW Sense 1.5 markers raccomandati ~282 (alcuni overlap
cross-component come `window-close` su FloatingWindow common riusato Lavagna+Tutor).

### 1.2 8 critical findings Phase 0

Listed verbatim (cross-link audit doc per finding):

1. **ChatOverlay auto-expand DOM query hack** (`GalileoAdapter.jsx:487`,
   `document.querySelector('[aria-label="Espandi chat UNLIM"]')`) — già documentato
   CLAUDE.md "ChatOverlay auto-click hack". HYBRID selector via `data-elab-action="expand-chat-unlim"`
   raccomandato per de-hackare.
2. **Simulator markers gap stimato 35+ button senza aria-label né data-elab markers** (Audit
   17.2 §5 caveat 8 + 9): coverage attuale ~50%, dipendono da CSS class strategia fragile
   (CanvasTab tools 338-385 + ChatOverlay HeaderButton 509 + NotebooksTab page-thumb 42 usano
   `title=` solo).
3. **148 NEW markers raccomandati Tutor+UNLIM** (Audit 17.3 §4) — più alta densità coverage
   gap del catalogo (7 sub-directory: tutor + unlim + common + chatbot + easter + teacher +
   student + admin + dashboard).
4. **Admin CRUD destructive operations whitelist exclusion** (Audit 17.3 §5 caveat 3):
   `AdminPage:128` login form (password input MAI dispatchable) + `AdminPage:231` license
   check + `AdminPage:293` clear license history (`localStorage.removeItem` side-effect) +
   sub-component AdminDashboard CRUD literal labels (Crea/Modifica/Esporta/Aggiorna/Elimina,
   esclusi per A14 round 2 SKIP rationale standard Italian admin UI convention).
5. **ManualTab/NotebooksTab/class destructive-candidate** (Audit 17.3 §5 caveat 4):
   `ManualTab:175` doc-remove + `NotebooksTab:74` notebook-delete + `TeacherDashboard:1688`
   class-create + `StudentDashboard:1259` select-student dropdown — require ADR-036 §1.2
   Decision 4 confirmation (voice "sì conferma").
6. **ElabTutorV4.jsx 2759 LOC legacy markup** (Audit 17.3 §4 nota): solo 4 grep match
   `aria-label/role/data-elab` — pattern legacy CSS class + button text senza ARIA strutturato.
   Refactor markup ARIA + data-elab-action sweep raccomandato iter 31+ (out-of-scope Phase 0).
7. **clearCircuit + resetMemory + Cronologia delete operations** (Audit 17.4 §5 caveat 1):
   `voiceCommands.js:140` `clearCircuit` + `unlimMemory.js:182` `resetMemory` + Cronologia
   delete session (gap NEW) → DESTRUCTIVE-CANDIDATE require ADR-036 §3 voice confirm "sì
   conferma" gate.
8. **App.jsx VALID_HASHES gap** (Audit 17.4 §5 caveat 6): `#chatbot-only` + `#about-easter`
   (HomePage iter 36 ADR-028 §14 amend) NOT in `App.jsx:62` `VALID_HASHES` 13-entry whitelist
   → L0b `navigate('chatbot-only')` would silently fail if dispatcher checks whitelist. Iter
   22+ unify mandatory.

### 1.3 Stato attuale Onnipotenza ONESTO (post iter 39 G45 Opus baseline)

| Layer | Stato | Evidence |
|---|---|---|
| L0 Direct API `__ELAB_API.unlim.*` | ~16 methods | CLAUDE.md "API globale simulatore" + iter 9 dry-run grep |
| L1 Composite handler | 10/10 PASS | `composite-handler.test.ts` 5/5 iter 6 + 5/5 iter 19 |
| L2 Template router | 22 templates inlined Deno-compat (NOT 20 PDR) | `clawbot-templates.ts` iter 28 D2 audit verify |
| L3 Deno postToVisionEndpoint | EXISTS canary 0% | iter 39 G45 baseline `CANARY_DENO_DISPATCH_PERCENT=0` default safe |
| L4 INTENT parser | 270 LOC server-side | `_shared/intent-parser.ts` iter 36 |
| L5 Mistral FC canonical | 3.6% canonical FAIL ≥80% | iter 38 carryover R7 v56 (UNCHANGED v54 4.1%) |
| L6 surface-to-browser dispatcher | 12 actions whitelist | `intentsDispatcher.js` iter 37 |
| L7 ENABLE_INTENT_TOOLS_SCHEMA | canary ON | iter 38 carryover env |
| L8 CANARY_DENO_DISPATCH_PERCENT | 0% default safe | iter 39 G45 baseline commit `1feda3c` |
| L9 stop conditions | partial | rate limit + anti-absurd partial |

### 1.4 User vision iter 16 ralph close (source feedback)

> "lavori troppo poco su onnipotenza. dovresti espanderla potenziarla, renderla più precisa,
> affinarla, valutare ogni possibile azione fattibile con mouse e tastiera e renderla
> possibile in linguaggio naturale e questo deve andare di pari passo con onniscenza e
> morfismo"

Interpretazione interpretata plan §0.3 + §0.4: enumerate ALL UI interactions docente could
perform + map natural language commands to them via NEW namespace `__ELAB_API.ui.*`,
preservando Onniscenza UI state snapshot (ADR-037 PLANNED iter 19) + Morfismo Sense 1.5
markers `data-elab-*` expansion (iter 22 +50 per stable HYBRID selector).

---

## §2 Decision

Adottare **NEW `__ELAB_API.ui.*` namespace L0b** SEPARATO from `__ELAB_API.unlim.*`,
con **HYBRID selector strategy** (priority order ARIA → data-elab-action → text → CSS),
**WHITELIST extension 12 → ~50 actions** (NEVER destructive, NEVER PII), **audit log
Supabase `unlim_ui_actions_log`** per ogni dispatch, e **stop conditions anti-loop +
anti-absurd + confirmation gate destructive-like**.

### 2.1 Decision rationale (4 trade-off)

| Decision | Pro | Con | Verdict |
|---|---|---|---|
| NEW namespace `__ELAB_API.ui.*` separate from `unlim.*` | Clean separation UNLIM-semantic vs mechanical UI ops; prevents semantic conflation | Doubles surface area (~50 + 16 = ~66 methods) | **ADOPTED**: clarity outweighs surface cost |
| HYBRID selector ARIA → data-elab → text → CSS | Stable post-refactor (data-elab markers) + semantic fallback (ARIA) + natural language alignment (text) | Resolution complexity O(N) per call vs O(1) CSS | **ADOPTED**: stability priority; perf mitigated cache (per §4.4) |
| WHITELIST 12 → ~50 (NEVER destructive) | Preserves security boundary iter 37 baseline; enables coverage 302 UI elements | Manual maintenance per ADR-036 update | **ADOPTED**: explicit whitelist > deny-list (security-by-construction) |
| Confirmation gate destructive-like (voice "sì conferma") | User intent verification per high-impact ops; PRINCIPIO ZERO docente register preserved | Latency +500ms per gated op (TTS prompt + STT confirm) | **ADOPTED**: safety > latency for ~5 destructive ops |

---

## §3 L0b API surface (~50 methods enumerated)

### 3.1 Core mechanical primitives (10)

```typescript
// src/services/elab-ui-api.js (NEW Phase 3 Atom 22.1)
export interface ElabUiApi {
  // Mouse primitives
  click(selectorOrIntent: string | UiIntent): Promise<DispatchResult>;
  doubleClick(selectorOrIntent: string | UiIntent): Promise<DispatchResult>;
  rightClick(selectorOrIntent: string | UiIntent): Promise<DispatchResult>;
  hover(selectorOrIntent: string | UiIntent): Promise<DispatchResult>;
  scroll(target: string | UiIntent, direction: 'up'|'down'|'left'|'right', amount?: number): Promise<DispatchResult>;

  // Keyboard primitives
  type(selectorOrFocused: string | null, text: string): Promise<DispatchResult>;
  key(combo: string): Promise<DispatchResult>;        // "Enter" | "ctrl+z" | "Escape" | "Tab" | etc
  keyDown(key: string): Promise<DispatchResult>;
  keyUp(key: string): Promise<DispatchResult>;

  // Drag-drop primitive
  drag(fromSelectorOrIntent: string | UiIntent, toSelectorOrIntent: string | UiIntent): Promise<DispatchResult>;
}
```

### 3.2 Window + modal + navigation (8)

```typescript
  openModal(name: string): Promise<DispatchResult>;
  closeModal(name: string): Promise<DispatchResult>;
  minimizeWindow(titleOrIntent: string | UiIntent): Promise<DispatchResult>;
  maximizeWindow(titleOrIntent: string | UiIntent): Promise<DispatchResult>;
  closeWindow(titleOrIntent: string | UiIntent): Promise<DispatchResult>;
  navigate(route: string): Promise<DispatchResult>;       // gate App.jsx VALID_HASHES update mandatory iter 22 (Finding 8)
  back(): Promise<DispatchResult>;                        // browser history.back
  forward(): Promise<DispatchResult>;                     // browser history.forward
```

### 3.3 Modalità 4 + lesson-paths (7)

```typescript
  toggleModalita(modalita: 'percorso'|'libero'|'gia-montato'|'esperimento'): Promise<DispatchResult>;
  highlightStep(index: number): Promise<DispatchResult>;
  nextStep(): Promise<DispatchResult>;
  prevStep(): Promise<DispatchResult>;
  nextExperiment(): Promise<DispatchResult>;
  prevExperiment(): Promise<DispatchResult>;
  restartLessonPath(): Promise<DispatchResult>;          // gap iter 22+ NEW (Audit 17.4 §3)
```

### 3.4 Voice + TTS playback (6)

```typescript
  voicePlayback(action: 'play'|'pause'|'skip'|'replay'|'stop'): Promise<DispatchResult>;
  voiceSetVolume(percent: number): Promise<DispatchResult>;     // 0..1 (Audit 17.4 §3 gap)
  voiceSetMode(mode: 'always'|'ptt'): Promise<DispatchResult>;  // push-to-talk vs always-on (Audit 17.4 §3 gap)
  startWakeWord(): Promise<DispatchResult>;
  stopWakeWord(): Promise<DispatchResult>;
  speak(text: string): Promise<DispatchResult>;                  // delegated `__ELAB_API.voice.speak`
```

### 3.5 Simulator-specific (8)

```typescript
  // From Audit 17.2 §4 recommendations
  zoom(direction: 'in'|'out'|'fit'|number): Promise<DispatchResult>;  // clamp [0.3, 3.0]
  pan(dx: number, dy: number): Promise<DispatchResult>;
  centerOn(componentId: string): Promise<DispatchResult>;
  selectComponent(id: string): Promise<DispatchResult>;
  deselectAll(): Promise<DispatchResult>;
  setSlider(targetSelectorOrIntent: string | UiIntent, value: number): Promise<DispatchResult>;
  penTool(action: 'color'|'size'|'eraser'|'undo'|'redo'|'clear-all'|'exit'): Promise<DispatchResult>;
  setCode(text: string): Promise<DispatchResult>;        // CodeMirror 6 dispatch via viewRef
```

### 3.6 Lavagna + chatbot + chat (6)

```typescript
  expandChatUnlim(): Promise<DispatchResult>;            // de-hack ChatOverlay finding #1
  minimizeChat(): Promise<DispatchResult>;
  closeChat(): Promise<DispatchResult>;
  switchTab(tabId: string): Promise<DispatchResult>;
  toggleSidebar(): Promise<DispatchResult>;
  togglePanel(direction: 'left'|'right'|'bottom'): Promise<DispatchResult>;
```

### 3.7 Volumi + manuale + video + cronologia (5)

```typescript
  pageNav(direction: 'prev'|'next'|number): Promise<DispatchResult>;  // VolumeViewer / ManualTab / Notebook
  volumeSelect(v: 1|2|3): Promise<DispatchResult>;
  videoTabSelect(key: 'youtube'|'corsi'): Promise<DispatchResult>;
  cronologiaSelectSession(sessionId: string): Promise<DispatchResult>;
  cronologiaNewChat(): Promise<DispatchResult>;
```

**Total enumerated**: 10 + 8 + 7 + 6 + 8 + 6 + 5 = **50 methods**.

**Cross-ref impl Atom 22.1**: 50 methods × ~14 LOC (resolver + dispatch + audit log + error
guard) = ~700 LOC `src/services/elab-ui-api.js` (per plan §3.1 file budget).

---

## §4 HYBRID selector strategy (priority order)

### 4.1 Resolution algorithm

```typescript
// src/services/elab-ui-resolver.js (NEW Phase 3 Atom 22.1)
export interface UiIntent {
  text?: string;          // natural language phrase (priority 3)
  ariaLabel?: string;     // ARIA label exact match (priority 1)
  role?: string;          // ARIA role enum (priority 1 with ariaLabel)
  dataElabAction?: string;  // data-elab-action marker (priority 2)
  dataElabTarget?: string;  // data-elab-target scope (priority 2 modifier)
  cssSelector?: string;   // raw CSS fallback (priority 4)
}

export function resolveUiIntent(intent: UiIntent): HTMLElement[] {
  // Priority 1: ARIA (most stable, semantic)
  if (intent.ariaLabel) {
    const elements = document.querySelectorAll(`[aria-label="${escapeAttr(intent.ariaLabel)}"]`);
    if (elements.length > 0) return Array.from(elements);
    // role + ariaLabel composite
    if (intent.role) {
      return Array.from(document.querySelectorAll(`[role="${intent.role}"][aria-label*="${escapeAttr(intent.ariaLabel)}"]`));
    }
  }

  // Priority 2: data-elab-action / data-elab-* markers (Sense 1.5 morfismo, expand iter 23)
  if (intent.dataElabAction) {
    let selector = `[data-elab-action="${intent.dataElabAction}"]`;
    if (intent.dataElabTarget) selector += `[data-elab-target="${intent.dataElabTarget}"]`;
    return Array.from(document.querySelectorAll(selector));
  }

  // Priority 3: Text content (natural language-aligned, anti-ambiguity check ≤3 matches)
  if (intent.text) {
    const xpath = `//*[normalize-space(text())="${intent.text}" or @aria-label="${intent.text}" or @title="${intent.text}"]`;
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const elements: HTMLElement[] = [];
    for (let i = 0; i < Math.min(result.snapshotLength, 10); i++) {
      elements.push(result.snapshotItem(i) as HTMLElement);
    }
    if (elements.length > 0 && elements.length <= 3) return elements;
    if (elements.length > 3) {
      console.warn(`[L0b] text intent ambiguous: ${elements.length} matches for "${intent.text}"`);
      return [];   // anti-ambiguity: reject if >3 matches
    }
  }

  // Priority 4: Raw CSS selector (fallback only)
  if (intent.cssSelector) {
    return Array.from(document.querySelectorAll(intent.cssSelector));
  }

  return [];
}
```

### 4.2 Anti-absurd validation

Resolution rejects if:
- Match count **>10 elements** → `selector_too_broad` audit status (likely catastrophic
  selector like `button` or `*`)
- Match count **0 elements** → `selector_not_found` audit status (selector typo or DOM
  changed)
- Match count **>3 for text-only intent** → `text_intent_ambiguous` audit status (per
  §4.1 priority 3 guard)

### 4.3 Marker stability priority post-refactor

`data-elab-action` markers (priority 2) preferred over text (priority 3) because:
- CSS class refactors break text-content selectors (i18n strings change, button copy
  rewrites)
- `data-elab-action` markers are explicit contract bound to user-action semantics, NOT
  visual presentation
- Sense 1.5 Morfismo iter 16 +12 markers baseline preserves invariant; iter 23 +50 markers
  expansion (per Audit 17.1 §4 + Audit 17.2 §5 caveat 8 + Audit 17.3 §4) targets ~282 markers
  cumulative across 97 jsx files

### 4.4 Performance considerations

- O(N) per-call DOM query unavoidable (no global cache invalidation hook)
- Mitigated: intent resolution typically <5ms for `aria-label` (priority 1) on modern DOM
- Worst case `xpath` evaluation (text intent): ~20-50ms on 5000-node DOM
- Acceptable budget: L0b dispatch latency <200ms p95 (per §8 decision matrix)

---

## §5 Security boundary (whitelist + PII + rate limit + audit log)

### 5.1 WHITELIST extension (50 ALLOWED actions)

`src/components/lavagna/intentsDispatcher.js` `ALLOWED_INTENT_ACTIONS` 12 → ~50 entries
(per plan §4.2 Atom 20.2). Explicit allow-list (security-by-construction):

```typescript
export const ALLOWED_UI_ACTIONS = new Set([
  // Iter 37 baseline 12 (preserve)
  'highlightComponent', 'mountExperiment', 'captureScreenshot', 'highlightPin',
  'setComponentValue', 'toggleDrawing', 'play', 'pause', 'compile', 'clearHighlights',
  'getCircuitState', 'serialWrite',

  // L0b NEW core (10)
  'click', 'doubleClick', 'rightClick', 'hover', 'scroll',
  'type', 'key', 'keyDown', 'keyUp', 'drag',

  // L0b window + nav (8)
  'openModal', 'closeModal', 'minimizeWindow', 'maximizeWindow', 'closeWindow',
  'navigate', 'back', 'forward',

  // L0b modalita + lesson (7)
  'toggleModalita', 'highlightStep', 'nextStep', 'prevStep',
  'nextExperiment', 'prevExperiment', 'restartLessonPath',

  // L0b voice (6)
  'voicePlayback', 'voiceSetVolume', 'voiceSetMode',
  'startWakeWord', 'stopWakeWord', 'speak',

  // L0b simulator (8)
  'zoom', 'pan', 'centerOn', 'selectComponent', 'deselectAll',
  'setSlider', 'penTool', 'setCode',

  // L0b lavagna chat (6)
  'expandChatUnlim', 'minimizeChat', 'closeChat',
  'switchTab', 'toggleSidebar', 'togglePanel',

  // L0b volumi cronologia (5)
  'pageNav', 'volumeSelect', 'videoTabSelect',
  'cronologiaSelectSession', 'cronologiaNewChat',
]);
// Total: 12 + 50 = 62 entries
```

### 5.2 DESTRUCTIVE EXCLUSION (mandatory whitelist NOT add)

Per plan §1.2 Decision 3 + Phase 0 audit critical findings 4+5+7:

```typescript
export const FORBIDDEN_DESTRUCTIVE_ACTIONS = new Set([
  // Admin CRUD (Finding 4)
  'admin-license-clear', 'admin-license-create', 'admin-license-modify',
  'admin-license-export', 'admin-license-update',
  'admin-class-delete', 'admin-student-delete', 'admin-audit-clear',
  'admin-settings-reset',

  // Manual/Notebook destructive (Finding 5)
  'manual-doc-remove', 'notebook-delete',

  // Class management destructive (Finding 5)
  'teacher-class-delete', 'teacher-student-delete',

  // ElabTutorV4 legacy (Finding 6) — out of scope until refactor
  // (no exclusion needed since markers absent; ElabTutorV4 pattern legacy preserves status quo)

  // Voice/memory destructive (Finding 7)
  'clearCircuit', 'resetMemory', 'cronologia-delete-session',
  'stopSync', 'deleteAll', 'submitForm', 'fetchExternalUrl',
]);
```

### 5.3 CONFIRMATION REQUIRED (voice "sì conferma" gate)

Per plan §1.2 Decision 4 stop conditions:

```typescript
export const DESTRUCTIVE_LIKE_REQUIRES_CONFIRM = new Set([
  'clearCircuit',                    // voiceCommands.js:140 (Finding 7)
  'navigate',                        // navigate to home/away from session
  'closeSession',                    // session abandon
  'cronologia-select-session',       // switching context (loses unsaved)
  'manual-fullscreen-exit',          // exits modal viewer (loses scroll position)
  'modalita-back-percorso',          // exits Passo Passo modal (Audit 17.4 §3)
]);
```

Confirmation flow:
1. L0b dispatcher detects action in `DESTRUCTIVE_LIKE_REQUIRES_CONFIRM`
2. UNLIM TTS speaks: `"Ragazzi, vogliamo davvero {action human-readable}? Dite 'sì conferma' per procedere."`
3. STT listener active 5s window, accepts `/^s[ìi]\s+confer[mn]a/i` pattern
4. Match → execute action, audit log `confirm_match=true`
5. No match within 5s → reject, audit log `confirm_timeout`
6. Mismatch (other phrase) → reject, audit log `confirm_mismatch`

### 5.4 PII protection (NEVER fill credentials, NEVER read PII values)

- Input fields with `type="password"` → BLOCKED dispatch (audit `pii_blocked_password`)
- Input fields with `autocomplete="cc-number" | "cc-csc" | "ssn"` → BLOCKED dispatch
  (audit `pii_blocked_credit-card` / `pii_blocked_ssn`)
- Input fields matching regex `/email|phone|address|tax/i` in `aria-label` or `name` →
  WARNING audit `pii_warning_field` BUT proceed (educational platform low-risk fields)
- Read operations: NEVER return input field `.value` for fields in PII regex set
  (return `'<pii-redacted>'` placeholder)

### 5.5 Rate limit (max 10 UI actions per minute per session)

```typescript
// src/services/elab-ui-rate-limit.js
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const sessionRateLimitMap = new Map<string, number[]>();   // sessionId → timestamps[]

export function checkRateLimit(sessionId: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const timestamps = (sessionRateLimitMap.get(sessionId) || [])
    .filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    return { allowed: false, reason: `rate_limit_exceeded (${timestamps.length}/${RATE_LIMIT_MAX} per min)` };
  }
  timestamps.push(now);
  sessionRateLimitMap.set(sessionId, timestamps);
  return { allowed: true };
}
```

### 5.6 Audit log Supabase `unlim_ui_actions_log`

Mirror pattern ADR-028 §6 `intent_dispatch_log`:

```sql
-- supabase/migrations/<TBD-iter-22-Maker-1>_unlim_ui_actions_log.sql
CREATE TABLE unlim_ui_actions_log (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  experiment_id TEXT,
  action_name TEXT NOT NULL,
  intent_payload JSONB NOT NULL,
  resolution_strategy TEXT NOT NULL CHECK (
    resolution_strategy IN ('aria','data-elab','text','css','intent_direct')
  ),
  match_count INTEGER NOT NULL DEFAULT 0,
  result_status TEXT NOT NULL CHECK (
    result_status IN (
      'ok',
      'selector_not_found','selector_too_broad','text_intent_ambiguous',
      'rate_limit_exceeded','pii_blocked','confirm_required','confirm_timeout','confirm_mismatch',
      'forbidden_destructive','not_in_whitelist',
      'dispatch_throw','dispatch_timeout'
    )
  ),
  result_payload JSONB,
  error_message TEXT,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  enable_ui_dispatch BOOLEAN NOT NULL DEFAULT true,
  llm_provider TEXT,
  user_voice_confirm BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_unlim_ui_session_time ON unlim_ui_actions_log(session_id, created_at DESC);
CREATE INDEX idx_unlim_ui_action_status ON unlim_ui_actions_log(action_name, result_status, created_at DESC);

ALTER TABLE unlim_ui_actions_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_insert" ON unlim_ui_actions_log
  FOR INSERT TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_read_own_session" ON unlim_ui_actions_log
  FOR SELECT TO authenticated USING (session_id = current_setting('app.session_id', true));
```

Async insert (fire-and-forget) per minimize latency overhead. Audit log ALWAYS attempted
even on failed dispatch (audit-first invariant).

---

## §6 Stop conditions (anti-loop)

### 6.1 Max 5 consecutive UI actions per LLM response

LLM may emit multi-intent response (e.g., "click X, then type Y, then press Enter"). Cap
**max 5 consecutive UI actions per `intents_parsed` array** to prevent runaway loops.

```typescript
const MAX_CONSECUTIVE_UI_ACTIONS = 5;
if (intents_parsed.length > MAX_CONSECUTIVE_UI_ACTIONS) {
  intents_parsed = intents_parsed.slice(0, MAX_CONSECUTIVE_UI_ACTIONS);
  audit.log({ status: 'truncated_max_consecutive', original_count: intents_parsed.length });
}
```

### 6.2 Anti-absurd selector validation (per §4.2)

Reject dispatch if resolved match count >10 OR 0 OR (text intent only) >3.

### 6.3 Confirmation gate destructive-like (per §5.3)

Voice "sì conferma" required for `DESTRUCTIVE_LIKE_REQUIRES_CONFIRM` set.

### 6.4 Timeout per dispatch (3s budget)

Each L0b method execution wrapped `Promise.race(action, timeout 3000ms)` to prevent
hanging on async DOM ops (e.g., modal open animation).

### 6.5 Circuit breaker per session (rate limit §5.5)

Max 10 actions per minute per session, hard cap.

### 6.6 Re-entry guard

L0b dispatcher MUST NOT call itself recursively (no `__ELAB_API.ui.click` triggering
another `__ELAB_API.ui.click` via DOM event handler chain). Detected via per-tick
re-entry counter, abort if >3 nested calls.

---

## §7 Bench protocol (R7 expansion + R8 NEW)

### 7.1 R7 200-prompt UI fixture extension (`scripts/bench/r7-fixture.jsonl` iter 12)

Currently 200 prompts × 10 categorie × 20 (per Tester-2 iter 12 P1 deliverable). Iter 31
ralph 19 expansion: widen `shouldUseIntentSchema` heuristic to allow MORE prompts to
trigger Mistral function calling (currently L2 template router catches 95%+, dominating
canonical % measurement per iter 38 carryover §5 caveat 2).

Expansion strategy:
1. Reduce L2 template scope for action-heavy categories (`mountExperiment_intent`,
   `highlightComponent_intent`, `tool_select_intent`)
2. Widen `shouldUseIntentSchema` to fire when prompt contains action verbs +
   target nouns (`apri`, `chiudi`, `vai a`, `clicca su`, `mostra`, etc.)
3. Re-bench R7 200-prompt post-deploy → measure canonical % delta vs iter 38 baseline 3.6%
   target ≥80% per §8 decision matrix

### 7.2 R8 NEW 100-prompt UI action context awareness fixture (Phase 4 dependency)

NEW fixture `scripts/bench/r8-fixture.jsonl` (Phase 4 iter 27.1 deliverable):
- 100 prompts × scenarios requiring `ui` state context awareness
- Examples (per plan §6.3):
  - "Cosa vedo sulla schermata adesso?" (require `ui.route` + `ui.mode`)
  - "Chiudi la finestra Passo Passo" (require `ui.modals` + `ui.focused`)
  - "Vai al prossimo esperimento" (require `ui.lesson_path_step` + `ui.modalita`)
  - "Quale modalità è attiva?" (require `ui.modalita`)
  - "Quanti pannelli sono aperti?" (require `ui.modals` enumerate)
- Acceptance gate Phase 4: ≥80% PASS UI context awareness (per plan §6.3 Atom 27.1)

### 7.3 R7 + R8 dual-axis measurement

Iter 28 Atom 29.2 re-bench:
- R7 canonical % (post Mistral function calling deploy + L2 widen)
- R7 UI action fire-rate (% of UI-intent prompts that produce executable `intents_parsed`)
- R8 UI context awareness % (per scenario)
- R7 + R8 anti-absurd rate (% rejected per §4.2 anti-absurd validation)

---

## §8 Decision matrix canary 5%→25%→100% (per plan §7 Atom 29.2)

```
RAMP 25%   if R7 canonical ≥80% AND UI action success ≥95% AND anti_absurd <5%
STAY 5%    if R7 canonical ≥75% AND UI action success ≥90% AND anti_absurd <10%
REVERT     if R7 canonical <75% OR UI action success <90% OR anti_absurd ≥10%
```

| Canary stage | Duration | Gate condition (24h soak) |
|---|---|---|
| Shadow (0%, logging only) | 24h | Audit log integrity 100%, zero `dispatch_throw` |
| Canary 5% | 48h | Latency p95 overhead <200ms vs baseline |
| Limited 25% | 72h | UI action fire-rate ≥95% R7 200-prompt + R8 ≥80% |
| Half 50% | 72h | No regression PZ V3 ≥91.45% R5 50-prompt |
| Full 100% | — | Latency p95 overall <4s warm + audit log volume <10K rows/day |

**Ramp gate Phase 5 (iter 28-29)**: NO ramp without Andrea explicit ratify per §11 G45
anti-inflation invariant.

---

## §9 Risks + mitigations (8 risks identified)

| Risk | Severity | Mitigation | Audit signal |
|---|---|---|---|
| **Selector ambiguity** (text intent matches >3 elements) | HIGH | HYBRID priority ARIA→data-elab→text + anti-absurd reject ≤3 matches | `text_intent_ambiguous` audit |
| **Destructive op accidental** (e.g., `clearCircuit` via misparsed intent) | CRITICAL | WHITELIST exclusion §5.2 + voice confirm §5.3 + audit `forbidden_destructive` | `forbidden_destructive` / `confirm_timeout` audit |
| **PII leak via field read** (e.g., student email in `__ELAB_API.ui.read`) | HIGH | NEVER read input.value for PII regex set §5.4 | `pii_blocked` audit |
| **Rate limit abuse** (LLM emits 50 intents in single response) | MED | §5.5 rate limit 10/min + §6.1 truncate max 5 per response | `rate_limit_exceeded` / `truncated_max_consecutive` |
| **Latency overhead audit log** (Supabase insert blocking dispatch) | LOW | Async fire-and-forget insert + 90-day retention partition iter 38 | (perf metric) |
| **Edge Function deploy churn** (50 NEW schemas + dispatcher logic = larger bundle) | MED | Canary 5% first §8 + env flip rollback `ENABLE_UI_DISPATCH=false` | (deploy gate) |
| **L2 template router dominance** (R7 canonical 3.6% iter 38 carryover) | HIGH | §7.1 widen `shouldUseIntentSchema` heuristic + reduce L2 template scope action-heavy | R7 canonical % delta |
| **Hybrid selector fragile post-refactor** (CSS class rename breaks text intent) | MED | data-elab markers stability priority §4.3 + iter 23 +50 markers Atom 23.1 | `selector_not_found` audit |

---

## §10 Rollback plan

**Single env flag**:
```bash
SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets set \
  ENABLE_UI_DISPATCH=false --project-ref euqpdueopmlllqjmqnyb
```

Effect: L0b namespace `__ELAB_API.ui.*` returns `DispatchResult { status: 'disabled' }` for
all calls. Browser side falls back to legacy AZIONE handler (`useGalileoChat.js` iter 37
intentsDispatcher 12-action whitelist). Edge Function stops emitting `intents_parsed` array
in response (or emits empty array) — frontend no-op.

Latency to revert: <5min env redeploy + Edge Function cold restart. Single drill required
Phase 5 Atom 28.4 (NEW: add to plan §7 if not present, otherwise gate Phase 5 entrance).

---

## §11 Cross-link

- **User feedback iter 16 ralph close**: source plan §0 (this ADR §1.4)
- **Plan**: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md`
  §3.1 Atom 18.1 (this ADR delivery)
- **ADR-028 INTENT dispatcher** (ACCEPTED iter 37 §14 surface-to-browser amend):
  `docs/adrs/ADR-028-onnipotenza-intent-dispatcher-server-side.md` — L4+L6 baseline
- **ADR-029 LLM_ROUTING_WEIGHTS** (ACCEPTED active prod env-only iter 37):
  `docs/adrs/ADR-029-llm-routing-weights-conservative-tune.md` — companion latency decision
- **ADR-030 Mistral FC canonical** (PROPOSED iter 38):
  `docs/adrs/ADR-030-mistral-function-calling-intent-canonical.md` — L5 canonical schema
  source-of-truth (this ADR §3 reuses `INTENT_TOOLS_SCHEMA` extending +38 NEW UI action schemas)
- **ADR-035 Onniscenza V2.1** (PROPOSED iter 31 ralph 10):
  `docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md` — pari passo iter 19+ Atom
  19.1 ADR-037 `ui` state extension
- **ADR-037 Onniscenza UI state snapshot** (PLANNED iter 19 Atom 19.1 — NEW, not yet drafted):
  `docs/adrs/ADR-037-onniscenza-ui-state-snapshot-integration.md` — `ui: {route, mode,
  focused, modals, modalita, lesson_path_step}` aggregate extension Onniscenza V1/V2.1
- **Phase 0 audits Atoms 17.1-17.4**:
  - Lavagna: `docs/audits/2026-05-03-onnipotenza-ui-audit-lavagna.md` (~62 elem, ~84 markers)
  - Simulator: `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md` (~95 elem, ~50 markers)
  - Tutor+UNLIM: `docs/audits/2026-05-03-onnipotenza-ui-audit-tutor-unlim.md` (~95 elem, ~148 markers)
  - Cross-cutting: `docs/audits/2026-05-03-onnipotenza-ui-audit-cross-cutting.md` (~50 elem, voice/keyboard/routing partials)
- **G45 Opus baseline iter 39**: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` (score 8.0/10)
- **Iter 39 V2 regression revert evidence**:
  `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` (lesson learned: NO score override)
- **CLAUDE.md "DUE PAROLE D'ORDINE"**: §1 PRINCIPIO ZERO + §2 MORFISMO Sense 1+1.5+2

---

## §12 Implementation block (per ADR-028 §14 amend pattern)

### 12.1 Files to create (Phase 3 Atom 22.1 Maker-1)

| File | Estimated LOC | Owner |
|---|---|---|
| `src/services/elab-ui-api.js` | ~700 (50 methods × ~14 LOC) | Maker-1 |
| `src/services/elab-ui-resolver.js` | ~250 (HYBRID resolver + anti-absurd + intent type) | Maker-1 |
| `src/services/elab-ui-rate-limit.js` | ~80 (per-session sliding window) | Maker-1 |
| `src/services/elab-ui-audit.js` | ~120 (Supabase async insert + retry) | Maker-1 |

### 12.2 Files to modify (Phase 2 Atom 20.1+20.2 Maker-1+Maker-2)

| File | Modification | LOC delta |
|---|---|---|
| `src/services/simulator-api.js` | Init `__ELAB_API.ui = createUiApi()` global namespace mount | +20 |
| `supabase/functions/_shared/intent-tools-schema.ts` | +38 NEW UI action schemas (extend ADR-030 canonical) | +400 |
| `supabase/functions/_shared/intent-parser.ts` | Server-side validation + anti-absurd pre-check | +100 |
| `src/components/lavagna/intentsDispatcher.js` | Whitelist 12 → 50 + HYBRID resolver wire-up + rate limit + audit | +250 |
| `src/components/lavagna/useGalileoChat.js` | Surface UI namespace via `intents_parsed` consume | +30 |
| `src/App.jsx` | `VALID_HASHES` whitelist update for `#chatbot-only` + `#about-easter` (Finding 8 fix) | +10 |

### 12.3 50 NEW markers `data-elab-action` (Phase 3 Atom 23.1 Maker-2)

Spread across 97 jsx files per audit recommendations §4 of each Atom 17.1-17.4. Pattern
`data-elab-action="{kebab-verb-noun}"` + optional `data-elab-target="{canonical-id}"`.

Cumulative target ~282 markers (per audit master enumeration §1.1) — NOT all in Phase 3
iter 23 (target +50 highest-priority markers per §4.3 marker stability priority).

### 12.4 Tests (Phase 2 Atom 21.1 Tester-1)

| Test file | Test count | LOC |
|---|---|---|
| `tests/unit/components/lavagna/useGalileoChat-intents-parsed.test.js` (extend) | 22 → 35 | +250 |
| `tests/unit/services/elab-ui-api.test.js` (NEW) | 50 (one per L0b method) | ~600 |
| `tests/unit/services/elab-ui-resolver.test.js` (NEW) | 5 cases × 4 priority orders = 20 | ~250 |
| `tests/unit/services/elab-ui-rate-limit.test.js` (NEW) | 8 (window slide + cap + multi-session) | ~120 |
| `tests/unit/services/elab-ui-audit.test.js` (NEW) | 10 (status enum + async insert + retry) | ~150 |

Total NEW tests: 50 + 20 + 8 + 10 + 13 (extend) = ~101 new test cases. vitest baseline lift
13474 → ~13575.

### 12.5 E2E Playwright (Phase 3 Atom 24.1 Tester-1)

| Spec file | Spec count | LOC |
|---|---|---|
| `tests/e2e/onnipotenza-ui-namespace-{N}.spec.js` (NEW × 5 split files) | 50 (one per action) | ~800 totale |

Acceptance Phase 3: 50/50 PASS prod, latency p95 dispatch <500ms, audit log row per spec.

### 12.6 PRINCIPIO ZERO + MORFISMO compliance gate

| Gate | Compliance |
|---|---|
| **Linguaggio plurale "Ragazzi"** | Confirmation gate §5.3 TTS prompt uses plurale ("Ragazzi, vogliamo davvero…") |
| **Kit fisico mention** | L0b `__ELAB_API.ui.*` operates on simulator UI surface, NOT replaces kit; UNLIM responses post-dispatch preserve PZ V3 validator |
| **Palette CSS var Navy/Lime/Orange/Red** | NO new UI components introduced (only API namespace + markers); CSS unchanged |
| **Iconografia ElabIcons SVG** | Markers added on existing button elements; no icon changes |
| **Morphic runtime** | HYBRID resolver §4 dynamic priority resolution per call; markers data-elab-* per-classe per-docente per-kit invariant preserved |
| **Cross-pollination** | L0b namespace pari passo Onniscenza ADR-037 (PLANNED) `ui` state aggregate |
| **Triplet coerenza kit Omaric** | UI ops respect SVG component identity (e.g., `selectComponent` resolves canonical id from registry, NOT generic CSS selector) |
| **Multimodale** | `voicePlayback` + `speak` + `startWakeWord` extend voice surface via L0b; preserves Voxtral primary + voice clone Andrea iter 31 |

---

## §13 Anti-inflation G45 acceptance gate

| Metric | Target ONESTO | Measurement |
|---|---|---|
| R7 200-prompt fixture canonical % post-deploy | ≥80% | `scripts/bench/run-sprint-r7-stress.mjs` |
| R7 UI action fire-rate | ≥95% | R7 fixture per-prompt grading |
| R8 100-prompt UI context awareness | ≥80% | NEW `scripts/bench/run-sprint-r8-ui-context.mjs` Phase 4 |
| Latency overhead p95 L0b dispatch | <200ms vs baseline | Mac Mini Cron L3 measure |
| Audit log integrity | 100% (every dispatch logged) | SQL count match dispatch count |
| Selector resolution failure rate | <5% prod (anti-absurd cap) | `unlim_ui_actions_log` `selector_*` count |
| Rate limit hit rate | <1% prod (10/min cap honest usage) | `rate_limit_exceeded` count |
| PII block events | 0 (NEVER fire honest pages) | `pii_blocked` count |
| Confirmation success rate | ≥80% (user voice clarity reasonable) | `confirm_*` ratio |
| Rollback latency | <5min env flip | Manual drill Phase 5 entrance |

**NO claim "Onnipotenza Expansion FULL LIVE"** without:
1. ALL ~50 actions wired prod (Phase 3 Atom 23.1+24.1 complete)
2. Canary 100% (Phase 5 Atom 29.2 ramp complete)
3. 24h soak no regression (Phase 5 Atom 29.1 monitor)
4. Andrea Opus G45 indipendente review Phase 6 (per plan §8 Atom 30.2 G45 mandate)
5. Score Opus indipendente ≤ 9.0/10 ONESTO (per plan §8.2 cap target)

NO override based on Maker subjective claim. NO inflate per §11 G45 anti-inflation invariant
(lesson learned ADR-035 §3 V2 reverted iter 39).

---

**Status finale**: PROPOSED iter 31 ralph iter 19 Atom 18.1 (entrance). Andrea ratify Phase 5
mandatory pre-canary. Implementation Phase 2-3 (iter 20-24) gated post-ratify. Architecture
design ONLY iter 19 — NO src code changes shipped this iter.
