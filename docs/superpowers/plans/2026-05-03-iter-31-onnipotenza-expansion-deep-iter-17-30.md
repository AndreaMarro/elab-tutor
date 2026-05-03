# Onnipotenza Expansion DEEP — Plan iter 17-30 (post user feedback iter 16 ralph close)

**Date**: 2026-05-03
**Source**: User feedback critico iter 16 ralph close — "lavori troppo poco su onnipotenza. dovresti espanderla potenziarla, renderla più precisa, affinarla, valutare ogni possibile azione fattibile con mouse e tastiera e renderla possibile in linguaggio naturale e questo deve andare di pari passo con onniscenza e morfismo"
**Skills used**: /make-plan + /ultrathink (this plan) + /multi-reviewer-patterns + /agent-teams:team-spawn (Phase 0+) + /claude-md-management:revise-claude-md (Phase 6)
**Sprint T close target advanced**: 9.0/10 ONESTO (raised from 8.5 baseline post Onnipotenza full expansion)

---

## §0 ULTRATHINK reasoning — Honest diagnosis user feedback

### 0.1 Recognition

User correct: iter 1-16 ralph work mainly tooling/skills/calibration/migration/audit. ZERO Onnipotenza expansion. Whitelist 12 actions UNCHANGED since iter 36 ADR-028 surface-to-browser pivot. L0 direct API ~16 methods static. L3 Deno canary 0% fire rate. L5 Mistral FC canonical 3.6% FAIL.

### 0.2 Stato attuale Onnipotenza ONESTO

| Layer | Stato | Evidence |
|---|---|---|
| L0 Direct API `__ELAB_API.unlim.*` | ~16 methods | CLAUDE.md API globale section + iter 9 dry-run grep |
| L1 Composite handler | 10/10 PASS | `composite-handler.test.ts` |
| L2 Template router | 20 templates inlined | `clawbot-templates.ts` iter 9 V2 verified |
| L3 Deno postToVisionEndpoint | EXISTS canary 0% | iter 39 G45 Opus baseline `CANARY_DENO_DISPATCH_PERCENT=0` |
| L4 INTENT parser | 270 LOC server-side | `intent-parser.ts` iter 36 |
| L5 Mistral FC canonical | 3.6% FAIL ≥80% | iter 38 carryover R7 v56 |
| L6 surface-to-browser dispatcher | 12 actions whitelist | `intentsDispatcher.js` iter 37 |
| L7 ENABLE_INTENT_TOOLS_SCHEMA | canary ON | iter 38 carryover |
| L8 CANARY_DENO_DISPATCH_PERCENT | 0% | iter 39 G45 baseline |
| L9 stop conditions | partial | rate limit + anti-absurd partial |

### 0.3 User vision INTERPRETED

"Ogni possibile azione fattibile con mouse e tastiera" → enumerate ALL UI interactions docente could perform + map natural language commands to them.

Estimated ~50-80 UI interactions:
- **Mouse**: click button/link, right-click context, double-click, hover, scroll, pan, zoom, drag-drop component, drag wire, resize panel, dropdown select, checkbox toggle, radio toggle, slider adjust, tab click, modal open/close
- **Keyboard**: type text, Ctrl+Z/Y/S/A/C/V, Esc, Enter, Space, Tab/Shift+Tab, arrow keys, F-keys, custom keybinds
- **Application-specific**: navigate routes (#lavagna, #tutor, #chatbot-only, #about-easter), toggle Modalita 4, switch lesson-path, highlight step, show/hide mascotte, voice playback control, fumetto report, screenshot, compile/run/stop simulation, save/load session, export CSV, transcription start/stop

### 0.4 "Pari passo Onniscenza+Morfismo" INTERPRETED

- **Onniscenza**: Mistral FC needs UI state context (active route, mode, focused element, opened modals, active modalita, lesson_path_step). aggregateOnniscenza extends `ui` key.
- **Morfismo Sense 1.5**: data-elab-* markers iter 16 +12 → expand ~50 markers (per UI primary action) for HYBRID stable selector.

---

## §1 Architecture design v2 — Onnipotenza Expansion

### 1.1 Pipeline natural language → UI action

```
Docente: "Clicca il bottone Avanti"
   ↓
[L5 Mistral Function Calling]
   intent-tools-schema canonical
   → {action: "click", target: {type: "button", text: "Avanti"}}
   ↓
[L4 INTENT parser server-side validation]
   schema check + security check + anti-absurd
   ↓
[L6 surface-to-browser dispatcher]
   ALLOWED_INTENT_ACTIONS expanded 12 → ~50
   ↓
[L0b NEW namespace __ELAB_API.ui.*]
   .click(selectorOrText)
   .type(selectorOrFocused, text)
   .scroll(target, direction, amount)
   .key(combo) / .keyDown(key) / .keyUp(key)
   .drag(fromSelector, toSelector)
   .openModal(name) / .closeModal(name)
   .navigate(route)
   .toggleModalita(name)
   .highlightStep(index)
   .voicePlayback(action)
   ...
   ↓
[Audit log Supabase unlim_ui_actions_log]
```

### 1.2 Key design decisions

**Decision 1**: NEW namespace `__ELAB_API.ui.*` SEPARATE from `unlim.*`
- Pro: clean separation UNLIM-semantic vs mechanical UI ops
- Con: doubles surface area
- **Decision**: NEW namespace `ui.*` per mechanical UI, mantain `unlim.*` per semantic UNLIM

**Decision 2**: Selector strategy HYBRID
1. ARIA label / role (most stable, semantic)
2. Text content (most natural language-aligned, may be ambiguous)
3. CSS selector (precise but fragile)
4. data-elab-* markers (Sense 1.5 morfismo, expanded iter 16+22)

**Resolution priority**: ARIA → data-elab- → text → CSS

**Decision 3**: Security boundary
- WHITELIST extension: ONLY add UI ops, NEVER destructive (no deleteUser, no POST submit, no fetch external)
- PII protection: NEVER fill credentials, NEVER read input PII values
- Rate limit: max 10 UI actions per minute per session
- Audit log: every L0 ui.* call → Supabase `unlim_ui_actions_log`

**Decision 4**: Stop conditions anti-loop
- Max 5 consecutive UI actions per LLM response
- Anti-absurd: selector match >10 elements OR 0 elements → reject
- Confirmation required: destructive-like (clearCircuit, navigate home, close session) → user voice confirm "sì conferma"

**Decision 5**: Pari passo Onniscenza
- ADR-037 NEW: aggregateOnniscenza output adds `ui: {route, mode, focused, modals, modalita, lesson_path_step}`
- Mistral FC system prompt extended UI state context per turn

**Decision 6**: Pari passo Morfismo
- Sense 1.5 markers iter 16 +12 → iter 22 +50 (per UI primary action)
- `data-elab-action="click-modalita-percorso"` per stable HYBRID selector

---

## §2 Phase 0 (iter 17) — Audit ALL UI interactions enumeration

**Goal**: comprehensive enumeration ALL clickable + typable + draggable + interactive UI elements ELAB Tutor.

**Pattern**: 4 parallel agents (`/agent-teams:team-spawn` parallel-debugging-pattern)

### 2.1 Atom 17.1 — Agent A Lavagna components audit
**File ownership**: `src/components/lavagna/` (LavagnaShell + Toolbar + ChatOverlay + FloatingWindow + RetractablePanel + ModalitaSwitch + GalileoAdapter + UnlimReport + SessionReportComic + VolumeViewer + VideoFloat + CapitoloPicker + LessonPathPanel + DocenteSidebar + PercorsoCapitoloView)

**Output**: `docs/audits/2026-05-XX-onnipotenza-ui-audit-lavagna.md` ~150 LOC table:
| Component | Element | Action | Selector strategy | Natural language example |
|---|---|---|---|---|
| LavagnaShell | Esci button | click | ARIA "Esci" | "Esci dalla lavagna" |
| ModalitaSwitch | Percorso button | click | data-elab-modalita="percorso" | "Modalità percorso" |
| ChatOverlay | input text | type | role="textbox" | "Scrivi 'come funziona il LED'" |
| FloatingWindow | drag header | drag | data-morfismo-window | "Sposta finestra Passo Passo a destra" |
| ... | ... | ... | ... | ... |

### 2.2 Atom 17.2 — Agent B Simulator components audit
**File ownership**: `src/components/simulator/` (SimulatorCanvas + NewElabSimulator + 21 components NanoR4Board + LED + Resistor + Battery + Switch + etc.)

**Output**: `docs/audits/2026-05-XX-onnipotenza-ui-audit-simulator.md` ~200 LOC

### 2.3 Atom 17.3 — Agent C Tutor + UNLIM components audit
**File ownership**: `src/components/{tutor,unlim,common,chatbot,easter,teacher,student,admin,dashboard}/`

**Output**: `docs/audits/2026-05-XX-onnipotenza-ui-audit-tutor-unlim.md` ~180 LOC

### 2.4 Atom 17.4 — Agent D Cross-cutting concerns audit
**Scope**: Modalita 4 + lesson-paths + Cronologia + voice + tts + keyboard shortcuts + routing + persistence

**Output**: `docs/audits/2026-05-XX-onnipotenza-ui-audit-cross-cutting.md` ~120 LOC

### 2.5 Atom 17.5 — Scribe consolidate
**Output**: `docs/audits/2026-05-XX-onnipotenza-ui-actions-MASTER-enumeration.md` (~250 LOC):
- Total count UI interactions (target ≥50)
- Per-category breakdown (mouse: N, keyboard: N, app-specific: N)
- Per-component matrix (component × action types)
- HYBRID selector recommendation per element
- Natural language example library (1 example per action)

**Acceptance gate Phase 0**:
- 4 parallel agents complete file-system verified completion msgs
- 5 audit docs shipped totale ~900 LOC
- Master enumeration ≥50 UI actions documented

---

## §3 Phase 1 (iter 18-19) — Architecture design ADR-036

### 3.1 Atom 18.1 — Architect-opus deep design ADR-036
**File**: `docs/adrs/ADR-036-onnipotenza-expansion-ui-namespace-l0b.md` ~700 LOC

Sections:
1. Context (post iter 17 audit master enumeration)
2. Decision (NEW `__ELAB_API.ui.*` namespace + HYBRID selector + WHITELIST expansion 12→~50)
3. Architecture detail (L0b API surface + L4 schema canonical + L6 dispatcher + audit log)
4. Selector strategy HYBRID priority order
5. Security boundary (WHITELIST + PII + rate limit + audit log)
6. Stop conditions (max 5 consec + anti-absurd + confirmation)
7. Bench protocol R7 200-prompt expanded UI fixture + R8 NEW 100-prompt UI action context awareness
8. Decision matrix canary 5%→25%→100% (RAMP / STAY / REVERT thresholds)
9. Risks + mitigations (8+ risks)
10. Rollback plan (env flip immediate ENABLE_UI_DISPATCH=false)
11. Cross-link

### 3.2 Atom 19.1 — Architect ADR-037 Onniscenza UI state snapshot
**File**: `docs/adrs/ADR-037-onniscenza-ui-state-snapshot-integration.md` ~400 LOC

Pari passo Onnipotenza expansion:
- aggregateOnniscenza output extension `ui: {route, mode, focused, modals, modalita, lesson_path_step}`
- Mistral FC system prompt UI state context per turn
- Bench R5 + R6 + R7 measure delta quality post UI state aware

**Acceptance gate Phase 1**:
- ADR-036 + ADR-037 PROPOSED status
- Andrea ratify queue iter 32+ entrance
- Pre-flight CoV vitest 13668 baseline preserve

---

## §4 Phase 2 (iter 20-21) — Natural language command parser EXPANSION

### 4.1 Atom 20.1 — Maker-1 expand `intent-parser.ts` + `intent-tools-schema.ts`
**File ownership**: `supabase/functions/_shared/intent-parser.ts` + `intent-tools-schema.ts`

Tasks:
- Add ~38 NEW action schemas (click, type, scroll, key, drag, navigate, etc.)
- Mistral FC canonical params validation per action
- Server-side pre-dispatch security check
- Anti-absurd validation (selector ambiguity, destructive flag)

**LOC delta**: +400 LOC schema + +200 LOC parser extension

### 4.2 Atom 20.2 — Maker-2 expand `intentsDispatcher.js`
**File ownership**: `src/components/lavagna/intentsDispatcher.js`

Tasks:
- ALLOWED_INTENT_ACTIONS whitelist 12 → ~50 entries
- HYBRID selector strategy resolver impl (ARIA → data-elab → text → CSS)
- Rate limit (max 10 per min per session) wire-up
- Audit log Supabase `unlim_ui_actions_log` insert
- Stop conditions (max 5 consec + anti-absurd)

**LOC delta**: +250 LOC

### 4.3 Atom 21.1 — Tester-1 expand unit tests
**File ownership**: `tests/unit/components/lavagna/useGalileoChat-intents-parsed.test.js` + NEW `tests/unit/components/lavagna/intentsDispatcher-ui-namespace.test.js`

Tasks:
- 22 existing tests intentsDispatcher → expand ~80 unit tests (one per NEW action)
- HYBRID selector strategy tests (5 cases per priority order)
- Rate limit tests
- Audit log tests
- Stop conditions tests
- Anti-absurd tests

**LOC delta**: +600 LOC tests

**Acceptance gate Phase 2**:
- 80+ unit tests PASS
- vitest baseline lift 13668 → ~13750
- CoV-3 zero regression

---

## §5 Phase 3 (iter 22-24) — L0b namespace `__ELAB_API.ui.*` impl

### 5.1 Atom 22.1 — Maker-1 NEW `src/services/elab-ui-api.js`
**File**: NEW `src/services/elab-ui-api.js` ~700 LOC

Tasks:
- Implement ~38 NEW UI methods (click + type + scroll + key + drag + navigate + toggleModalita + etc.)
- HYBRID selector resolver
- Wire-up `simulator-api.js` global initialization adds `__ELAB_API.ui = createUiApi()`

### 5.2 Atom 23.1 — Maker-2 wire-up React components
**File ownership**: across `src/components/` various

Tasks:
- Add `data-elab-action` attributes per primary clickable button (~50 markers)
- Add `data-elab-selector` per major component (stable selector for L0b)
- Pari passo Morfismo Sense 1.5 markers iter 16 +12 → iter 23 +50

### 5.3 Atom 24.1 — Tester-1 E2E Playwright spec
**File**: NEW `tests/e2e/onnipotenza-ui-namespace-{N}.spec.js`

Tasks:
- 50 NEW spec cases (one per action)
- Verify L0b namespace fires correct DOM event
- Verify HYBRID selector resolution priority
- Verify rate limit + audit log
- Verify stop conditions

**Acceptance gate Phase 3**:
- 50/50 Playwright E2E PASS
- vitest 13750+ baseline preserve
- ~50 markers data-elab-action across components

---

## §6 Phase 4 (iter 25-27) — Onniscenza extension UI state snapshot

### 6.1 Atom 25.1 — Architect ADR-037 ratified
**Action**: Andrea ratify ADR-037 entrance Phase 4

### 6.2 Atom 26.1 — Maker-1 extend `aggregateOnniscenza`
**File ownership**: `supabase/functions/_shared/onniscenza-bridge.ts` (canonical aggregator per iter 9 V2 caveat 1)

Tasks:
- Add `ui` key to aggregateOnniscenza output {route, mode, focused, modals, modalita, lesson_path_step}
- Pre-LLM context injection BASE_PROMPT extension per turn
- Backward compat env flag `INCLUDE_UI_STATE_IN_ONNISCENZA=true` (default false until canary OK)

### 6.3 Atom 27.1 — Tester-1 R8 NEW stress fixture
**File**: NEW `scripts/bench/r8-fixture.jsonl` (100 prompts requiring UI action context awareness)

Examples:
- "Cosa vedo sulla schermata adesso?" (require ui.route + ui.mode)
- "Chiudi la finestra Passo Passo" (require ui.modals + ui.focused)
- "Vai al prossimo esperimento" (require ui.lesson_path_step + ui.modalita)

Bench R8 measure UI state aware response quality vs baseline (no UI state).

**Acceptance gate Phase 4**:
- ADR-037 ACCEPTED
- aggregateOnniscenza UI key live
- R8 100-prompt PASS ≥80% UI context awareness

---

## §7 Phase 5 (iter 28-29) — Canary deploy 5%→25%→100% + R7 re-bench

### 7.1 Atom 28.1 — Andrea ratify ADR-036 + ADR-037 final
### 7.2 Atom 28.2 — Edge Function deploy v74+ con expanded schema
### 7.3 Atom 28.3 — Canary stage env `CANARY_UI_DISPATCH_PERCENT=5`
### 7.4 Atom 29.1 — 24h soak + monitor telemetry
### 7.5 Atom 29.2 — R7 200-prompt re-bench measure canonical % + UI action fire-rate

**Decision matrix per ADR-036 §8**:
- RAMP 25% if R7 canonical ≥80% AND UI action success ≥95% AND anti_absurd <5%
- STAY 5% if R7 canonical ≥75% AND UI action success ≥90% AND anti_absurd <5%
- REVERT if R7 canonical <75% OR UI action success <90% OR anti_absurd ≥5%

**Acceptance gate Phase 5**:
- Canary 25%+ stage achieved 24h soak no regression
- R7 canonical ≥80% target MET (was 3.6% iter 38 carryover)

---

## §8 Phase 6 (iter 30) — Final audit + Andrea Opus G45 review

### 8.1 Atom 30.1 — Aggregate audit invoke 5 skills V2 calibrated
**Output**: `docs/audits/2026-05-XX-iter-30-FINAL-onnipotenza-expansion-audit.md` (~600 LOC consolidated)

### 8.2 Atom 30.2 — Andrea Opus G45 indipendente review session context-zero
**Output**: `docs/audits/2026-05-XX-G45-OPUS-INDIPENDENTE-onnipotenza-expansion.md`

Andrea Opus verifies cumulative score ONESTO ≤ 9.0/10 (Sprint T close advanced).

### 8.3 Atom 30.3 — `/claude-md-management:revise-claude-md` update
**File**: `CLAUDE.md` Onnipotenza section update + Sprint history footer iter 30 close

Update:
- Onnipotenza section L0b `__ELAB_API.ui.*` namespace ~50 actions LIVE
- Whitelist ALLOWED_INTENT_ACTIONS expanded 12 → ~50
- ADR-036 + ADR-037 ACCEPTED references
- Score progression cascade target ONESTO

**Acceptance gate Phase 6**:
- Score Opus indipendente ≤ 9.0/10 ONESTO confirmed
- CLAUDE.md updated
- Sprint T close ADVANCED achieved iter 30

---

## §9 Anti-pattern enforcement INVARIANT iter 17-30

- NO claim "Onnipotenza FULL LIVE" senza ALL ~50 actions wired prod + canary 100% + 24h soak
- NO add destructive actions (deleteUser, submitForm POST, fetch external URL, modify settings)
- NO PII handling (no credentials input, no read input value containing PII)
- NO blanket selector resolution (HYBRID strategy with anti-ambiguity check)
- NO rate limit bypass (max 10 actions/min)
- NO audit log skip (every UI action MUST log Supabase)
- NO inflate score (G45 cap mandate Phase 6 Opus indipendente review)
- NO --no-verify
- NO push origin pre Phase 5+ canary stable
- NO claim "ALL UI interactions enumerated" senza Phase 0 4-agent audit complete
- NO compiacenza
- NO write outside file ownership rigid
- NO commit senza pre-commit hook GREEN
- NO push senza pre-push hook GREEN

---

## §10 CoV mandate ogni atom INVARIANT

1. CoV-1 baseline preserve: `npx vitest run` PRIMA atom must PASS baseline 13668 (post iter 13 + iter 16 markers preserve)
2. CoV-2 incremental: `npx vitest run tests/unit/{newscope}` post atom must PASS new tests
3. CoV-3 finale: `npx vitest run` POST atom must PASS baseline + delta tests

Failure CoV ANY step → REVERT IMMEDIATO + investigation systematic-debugging skill.

---

## §11 Score progression cascade target ONESTO

| Iter | Phase | Lift | Cumulative |
|---|---|---|---|
| 16 close | baseline | — | 8.20/10 |
| 17 Phase 0 audit | +0.05 | 5 audit docs ~900 LOC | 8.25 |
| 18-19 ADR-036+037 | +0.05 | 1100 LOC architecture design | 8.30 |
| 20-21 parser+dispatcher | +0.10 | +850 LOC + 80 tests | 8.40 |
| 22-24 L0b impl | +0.20 | +700 LOC + 50 markers + 50 E2E | 8.60 |
| 25-27 Onniscenza UI | +0.10 | UI state aware + R8 bench | 8.70 |
| 28-29 canary 25%+ | +0.20 | R7 canonical ≥80% | 8.90 |
| 30 Andrea Opus G45 | +0.10 | cap target 9.0 ONESTO Sprint T close advanced | **9.00 ONESTO** |

Sprint T close ORIGINAL target 8.5/10. Onnipotenza expansion ADVANCES target to 9.0/10 ONESTO.

---

## §12 Multi-reviewer pattern Phase 6 mandate

`/multi-reviewer-patterns` parallel review iter 30:
- Reviewer 1: Architecture (ADR-036 + ADR-037 review)
- Reviewer 2: Security (whitelist + PII + rate limit verify)
- Reviewer 3: Performance (latency impact L0b dispatch + audit log Supabase write)
- Reviewer 4: UX (natural language command coverage + Italian K-12 docente persona)
- Reviewer 5: Testing (50 E2E + 80 unit + R7 + R8 bench)

Aggregate verdicts → Andrea Opus G45 indipendente final.

---

## §13 Cross-link

- User feedback iter 16 ralph close: this plan §0 source
- ADR-028 INTENT dispatcher: `docs/adrs/ADR-028-onnipotenza-intent-dispatcher-server-side.md`
- ADR-029 LLM_ROUTING_WEIGHTS: `docs/adrs/ADR-029-llm-routing-weights-conservative-tune.md`
- ADR-030 Mistral FC canonical: `docs/adrs/ADR-030-mistral-function-calling-intent-canonical.md`
- ADR-035 Onniscenza V2.1: `docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md`
- Iter 14 V2 dry-run findings: `docs/audits/2026-05-03-iter-31-ralph14-skills-V2-consolidated-dry-run.md`
- Iter 7 plan iter 8-20 (superseded by this plan iter 17+): `docs/superpowers/plans/2026-05-03-iter-31-ralph-iter-8-to-20-make-plan.md`
- G45 Opus baseline iter 39: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`

---

**Status**: PROPOSED iter 31 ralph iter 17 entrance. Andrea ratify Phase 0 entrance + ADR-036 + ADR-037 + canary policy.

**Estimated wall-clock**: ~50h dev + ~24h soak = ~3-4 settimane realistic Sprint T close advanced 9.0/10 ONESTO target.
