# Onnipotenza UI Audit — Cross-cutting concerns (iter 31 ralph 18 Phase 0 Atom 17.4)

**Date**: 2026-05-03
**Agent**: Agent D (Cross-cutting ownership)
**Plan ref**: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2 Phase 0 Atom 17.4
**Source**: User feedback iter 16 ralph close — "valutare ogni possibile azione fattibile con mouse e tastiera e renderla possibile in linguaggio naturale, di pari passo con onniscenza e morfismo"
**Scope** (read-only): Modalità 4 + lesson-paths + Cronologia + voice (wake word + STT + TTS) + keyboard shortcuts + routing (hash + back/forward) + persistence (Supabase + localStorage)

---

## §1 Methodology

1. Enumerate cross-cutting interaction surfaces NOT tied to single component (vs Atom 17.1-17.3 component-bound).
2. `grep -nE` per concern category (modalità, lesson-paths, voice, key, hash, save/load) across `src/services/` + `src/components/lavagna/{LavagnaShell,ModalitaSwitch}.jsx` + `src/components/chatbot/ChatbotOnly.jsx` + `src/App.jsx` + `src/data/lesson-paths/index.js`.
3. Per element: source file:line + action type + current trigger + HYBRID selector priority (or `__ELAB_API.x.y` API method) + natural language example + Sense 1.5 marker recommendation.
4. Cross-link Lavagna+Simulator+Tutor partials per consistency (`2026-05-03-onnipotenza-ui-audit-{lavagna,simulator,tutor-unlim}.md`).
5. NO src/test/supabase code modifications (read-only audit).
6. FLAG persistence destructive ops (`clearSession`, history `delete`) per ADR-036 §3 stop conditions confirmation gate.

---

## §2 Cross-cutting concerns audited (7 categories)

| # | Category | Owner module(s) | Surface points enumerated |
|---|---|---|---|
| 1 | Modalità 4 switch | `lavagna/ModalitaSwitch.jsx` + `lavagna/LavagnaShell.jsx` (state) | 4 modes + handler + persistence |
| 2 | Lesson-paths navigate | `data/lesson-paths/index.js` + voice commands `nextExperiment/prevExperiment` + `__ELAB_API.mountExperiment` | 5 nav primitives |
| 3 | Cronologia ChatGPT-style | `chatbot/ChatbotOnly.jsx` (SidebarCronologia + HistoryItem) | 4 buckets + select + new + delete (gap) + search (gap) |
| 4 | Voice (wake + STT + TTS) | `services/wakeWord.js` + `services/voiceService.js` + `services/voiceCommands.js` | 36+ commands + wake toggle + TTS playback |
| 5 | Keyboard shortcuts | `lavagna/ExperimentPicker.jsx` + `lavagna/AppHeader.jsx` + `lavagna/FloatingWindow.jsx` + `lavagna/UnlimBar.jsx` | Esc/Enter/Space + Tab focus (gap: Ctrl+Z/S not wired global) |
| 6 | Routing hash + back/forward | `App.jsx` `getPageFromHash` + `getExpFromHash` + `navigate()` + hashchange listener | 13 valid hashes + `?exp=` deep-link |
| 7 | Persistence | `services/unlimMemory.js` + Supabase sync + `localStorage` (modalità + class_key) | save/load/sync + reset (destructive flag) |

---

## §3 Interactive elements matrix (cross-cutting)

| File:Line | Element / API | Action type | Current trigger | HYBRID selector / API path | Natural language example | Sense 1.5 marker |
|---|---|---|---|---|---|---|
| **MODALITÀ 4** ||||||
| ModalitaSwitch.jsx:71 | `[role=tablist] aria-label="Modalità lavagna"` + `data-elab-modalita={activeMode}` + `data-testid="modalita-switch"` | container scope | render | role+data-elab | "Modalità percorso" | EXISTS iter 16 (per Atom 17.1) |
| ModalitaSwitch.jsx:88 | per-mode tab `data-testid="modalita-btn-{mode}"` | click | `onModeChange(mode)` callback (`LavagnaShell:621 handleModalitaChange`) | data-testid + role tab | "Vai in modalità Già Montato" / "Modalità Libero" | ADD `data-elab-action="modalita-{mode}"` per tab (4 markers) |
| LavagnaShell.jsx:613 | persist `localStorage.setItem('elab-lavagna-modalita', modalita)` | side-effect | `useEffect [modalita]` | n/a (storage) | "Ricorda la modalità scelta" (implicit, not user-facing) | n/a |
| LavagnaShell.jsx:440 | hydrate `localStorage.getItem('elab-lavagna-modalita')` | init | mount | n/a | n/a | n/a |
| LavagnaShell.jsx:1331 | passo-passo modal `onClose={() => setModalita('percorso')}` | navigate-back | Esc / X click (FloatingWindow) | aria-label "Chiudi" | "Esci dal Passo Passo" | ADD `data-elab-action="modalita-back-percorso"` |
| **LESSON-PATHS NAVIGATE** ||||||
| voiceCommands.js:249 | `nextExperiment` action | voice | pattern `prossimo esperimento` → `__ELAB_API.mountExperiment(next.id)` | API `__ELAB_API.mountExperiment` | "Prossimo esperimento" / "Esperimento successivo" | API direct (no DOM) |
| voiceCommands.js:265 | `prevExperiment` action | voice | pattern `esperimento precedente` → `__ELAB_API.mountExperiment(prev.id)` | API `__ELAB_API.mountExperiment` | "Esperimento precedente" / "Torna indietro esperimento" | API direct |
| voiceCommands.js:50 | `nextStep` action | voice | pattern `prossimo passo` | API `__ELAB_API.nextStep` (or event bus) | "Prossimo passo" / "Step successivo" | API direct |
| voiceCommands.js:56 | `prevStep` action | voice | pattern `passo precedente` | API `__ELAB_API.prevStep` | "Passo precedente" / "Indietro di un passo" | API direct |
| voiceCommands.js:223 | `mountCircuit` (jump to specific experiment) | voice | pattern matches | API `__ELAB_API.mountExperiment(id)` | "Monta esperimento {id}" | API direct |
| App.jsx:71 | deep-link `?exp=v1-cap6-esp1` | URL param | `getExpFromHash()` | URL parse | "Apri esperimento Vol1 cap6 esp1" → navigate `#tutor?exp=v1-cap6-esp1` | n/a |
| GAP | restart from step 1 | (not wired) | — | needs API `__ELAB_API.restartLessonPath()` | "Ricomincia dall'inizio" | NEW API L0b |
| GAP | mark step done | (not wired) | — | needs API `__ELAB_API.markStepDone(N)` | "Segna passo {N} completato" | NEW API L0b |
| **CRONOLOGIA ChatGPT-style** ||||||
| ChatbotOnly.jsx:157 | `<SidebarCronologia>` `aria-label="Cronologia chat"` + `data-testid="chatbot-history-..."` | container | render | aria-label + data-testid | "Apri cronologia" | ADD `data-elab-action="cronologia-open"` |
| ChatbotOnly.jsx:127 | `<HistoryItem>` `data-testid="chatbot-history-item"` + `onSelect(session)` | click | onClick handleClick | data-testid | "Riprendi sessione di ieri / sessione {N}" | ADD `data-elab-action="cronologia-select-session"` |
| ChatbotOnly.jsx:185 | New chat button `onClick={onNewChat}` | click | aria/text inferred | aria-label needed | "Nuova chat" / "Inizia nuova conversazione" | ADD `data-elab-action="cronologia-new-chat"` |
| ChatbotOnly.jsx:5 (doc) | 4 buckets Oggi/Ieri/Settimana/Più vecchie | bucket nav | render only (no click action per-bucket) | inferred section header | "Mostra solo le sessioni di oggi" | ADD `data-elab-action="cronologia-bucket-{when}"` (NEW filter UX) |
| GAP | search history | (not wired) | — | needs `<input role="searchbox">` | "Cerca cronologia 'LED'" | NEW component + Sense 1.5 marker |
| GAP | delete session | (not wired) | — | needs `<button aria-label="Elimina sessione">` | "Elimina sessione di ieri" | **DESTRUCTIVE-CANDIDATE** ADR-036 §3 confirmation gate |
| GAP | export session | (not wired) | — | needs `<button aria-label="Esporta sessione">` | "Esporta sessione corrente" | ADD `data-elab-action="cronologia-export"` |
| **VOICE — wake word + STT + TTS** ||||||
| wakeWord.js:57 | `startWakeWordListener({onWake, onCommand, lang})` | API toggle ON | `LavagnaShell` mount or HomePage | API `__ELAB_API.voice.startWakeWord()` (NEW L0b) | "Accendi 'Ehi UNLIM'" | API direct |
| wakeWord.js:191 | `stopWakeWordListener()` | API toggle OFF | unmount or user toggle | API `__ELAB_API.voice.stopWakeWord()` | "Spegni l'ascolto continuo" | API direct |
| wakeWord.js:206 | `isWakeWordListening()` | API getter | (status query) | API getter | "L'ascolto è attivo?" | n/a (read-only) |
| wakeWord.js:18 | "Ragazzi" plurale prepend (iter 41 Phase D Task D1) | invariant linguaggio | wake word post-detect | n/a | (PRINCIPIO ZERO §1 enforcement) | n/a |
| voiceCommands.js (full file) | 36+ command actions (play/stop/reset/nextStep/prevStep/showEditor/showSerial/compile/zoomFit/addLed/addResistor/addButton/addCapacitor/addBuzzer/addPotentiometer/clearCircuit/describeCircuit/undo/redo/mountExp1/mountExpLed/mountExpSemafor/setBuildSandbox/setBuildGuided/mountCircuit/mountStepByStep/nextExperiment/prevExperiment/prepareLesson/compileCode/hideEditor/startQuiz/createReport/selectVolume1/selectVolume2/selectVolume3/selectChapter/...) | voice | pattern match → `execute()` | API `__ELAB_API.unlim.*` per command | (per-command Italian phrases) | API direct (full list documented in Onniscenza) |
| voiceCommands.js:140 | `clearCircuit` action | voice | pattern `cancella tutto` | API `__ELAB_API.clearCircuit()` | "Cancella tutto" | **DESTRUCTIVE-CANDIDATE** ADR-036 §3 confirmation gate |
| voiceService.js:33 | TTS endpoint chain (Kokoro → Edge TTS VPS → Nanobot → browser) | TTS playback | `playTTS(text)` call | API `__ELAB_API.voice.speak(text)` | "Leggi questo passo" / "Ripeti" | API direct |
| voiceService.js:353 | TTS playback returns Promise | playback control | audio element | API `__ELAB_API.voice.{stop,pause,resume}()` (NEW L0b ext) | "Ferma la voce" / "Pausa" / "Riprendi" | NEW API L0b voice control |
| GAP | TTS volume adjust | (browser audio default) | — | needs `__ELAB_API.voice.setVolume(0..1)` | "Volume al 50%" | NEW API L0b |
| GAP | TTS skip / replay | (not wired explicitly) | — | needs `__ELAB_API.voice.{skip,replay}()` | "Salta" / "Riascolta" | NEW API L0b |
| GAP | push-to-talk vs always-on toggle | (currently always-on if started) | — | needs `__ELAB_API.voice.setMode('always'|'ptt')` | "Solo quando tengo premuto" | NEW API L0b mode |
| **KEYBOARD SHORTCUTS** ||||||
| ExperimentPicker.jsx:61 | `document.addEventListener('keydown', handleKey)` (Esc close modal) | keydown Esc | Esc | DOM event | "Esci dal selettore esperimenti" | inherited from modal close ARIA |
| ExperimentPicker.jsx:121 | `document.addEventListener('keydown', handleKeyDown)` (focus trap Tab) | Tab focus | Tab/Shift+Tab | DOM event | (accessibility, no NL trigger) | n/a |
| FloatingWindow.jsx:100 | `win.addEventListener('keydown', handleKeyDown)` (Esc close window) | keydown Esc | Esc | DOM event | "Chiudi finestra" | per Atom 17.1 ADD `data-elab-action="window-close"` |
| AppHeader.jsx:78 | `onKeyDown` Enter/Space activate breadcrumb | Enter/Space | keypress | DOM event | "Cambia esperimento" | per Atom 17.1 |
| UnlimBar.jsx:49 | `onKeyDown={handleKeyDown}` (Enter submit chat) | Enter submit | keypress | DOM event | "Invia messaggio" | per Atom 17.1 |
| GAP | Ctrl+Z global undo | (per-component only) | — | needs global listener + dispatch `__ELAB_API.undo()` | "Annulla" / "Indietro" | NEW global handler + L0b API |
| GAP | Ctrl+Y / Ctrl+Shift+Z global redo | (per-component only) | — | needs global + `__ELAB_API.redo()` | "Rifai" | NEW |
| GAP | Ctrl+S global save | (autosave only via `_autoSave` unlimMemory.js:508) | — | needs global + `__ELAB_API.unlim.saveSession()` | "Salva sessione" | NEW |
| GAP | Ctrl+A select all (canvas) | (not wired) | — | needs `__ELAB_API.selectAllComponents()` | "Seleziona tutto" | NEW |
| GAP | Space play/pause simulation | (voice only via `play`/`stop` voiceCommands:27,33) | — | needs global Space handler + dispatch | "Avvia" / "Ferma" | NEW global wrapper voice action |
| GAP | F-keys (F1 help, F11 fullscreen, etc.) | (not wired) | — | needs global handler | "Apri aiuto" / "Schermo intero" | NEW |
| **ROUTING — hash + back/forward** ||||||
| App.jsx:62 | `VALID_HASHES` 13 entries (`home/tutor/admin/teacher/vetrina/vetrina2/login/register/dashboard/dashboard-v2/showcase/prova/lavagna`) | nav whitelist | render | n/a | "Vai a {pageName}" → navigate(hash) | API `__ELAB_API.ui.navigate(hash)` (NEW L0b) |
| App.jsx:71 | `getExpFromHash()` parse `?exp=v1-cap6-esp1` | nav deep-link | URL parse | n/a | "Apri esperimento Vol1 cap6 esp1" | NEW L0b deep-link |
| App.jsx:79 | `getDashboardV2Params()` parse `?live=1&teacher=...&range=...` | nav query params | URL parse | n/a | "Apri dashboard live ultimi 30 giorni" | NEW L0b deep-link with params |
| App.jsx:127 | `navigate(page)` callback `window.history.pushState` | nav imperative | function call | n/a | "Vai alla home" / "Apri lavagna" | API `__ELAB_API.ui.navigate(page)` |
| App.jsx:145 | hashchange + popstate listeners (back/forward sync) | sync | browser nav | n/a | (back/forward via voice "Indietro" / "Avanti") | NEW L0b `__ELAB_API.ui.{back,forward}()` |
| App.jsx:90 | SkipToContent `<a href="#main-content">` | a11y skip-link | Tab focus | aria/role | "Vai al simulatore" | EXISTS via aria/text |
| GAP | additional hashes `#chatbot-only` + `#about-easter` (per HomePage iter 36 ADR) | extension | — | NOT in `VALID_HASHES` (App.jsx:62 list incomplete vs HomePage routing iter 36) | n/a | DOC DRIFT FLAG (Andrea verify A10 §3 ToolSpec count style) |
| **PERSISTENCE — Supabase + localStorage** ||||||
| unlimMemory.js:111 | `saveSessionSummary(summary)` localStorage | save | call | API `__ELAB_API.unlim.saveSessionSummary(s)` | (autosave, no NL trigger) | n/a |
| unlimMemory.js:196 | `saveContext(classId, experimentId, context)` Supabase | save remote | call | API `__ELAB_API.unlim.saveContext(...)` | (autosave) | n/a |
| unlimMemory.js:225 | `loadContext(classId)` Supabase | load remote | call | API getter | "Carica contesto classe {classId}" | API direct |
| unlimMemory.js:257 | `getLastLesson(classId)` Supabase | load remote | call | API getter | "Mostra ultima lezione classe" | API direct |
| unlimMemory.js:182 | `resetMemory()` localStorage clear | destructive | call | API `__ELAB_API.unlim.resetMemory()` | "Cancella memoria UNLIM" | **DESTRUCTIVE-CANDIDATE** ADR-036 §3 voice confirm "sì conferma" gate |
| unlimMemory.js:407 | `syncWithBackend()` periodic | sync | timer | n/a (background) | n/a | n/a |
| unlimMemory.js:476 | `stopSync()` | toggle | call | API `__ELAB_API.unlim.stopSync()` | "Ferma sincronizzazione" | API direct |
| unlimMemory.js:508 | `_autoSave()` periodic | autosave | timer | n/a (background) | "Disattiva salvataggio automatico" → needs toggle API | NEW API L0b autosave toggle |
| localStorage `elab-lavagna-modalita` | (LavagnaShell:613) | persist modalità | useEffect | n/a | (implicit) | n/a |
| localStorage `elab_anon_uuid` (per S1 04apr2026 memory) | identity | persist | mount | n/a | n/a | n/a |
| localStorage `elab_class_key` (per S1 04apr2026 memory) | classe virtuale auth | persist | onboarding | n/a | "Accedi con codice classe {key}" | flow gate (PII boundary, NOT plain L0b) |

---

## §4 Special cases (voice + keyboard + routing)

### 4.1 Voice command wake-word grammar (CLAUDE.md iter 36+37+41 invariant)

- Wake phrase: "Ehi UNLIM" (variants accepted: "hey unlim", "ei unlim") — `wakeWord.js:6`.
- Post-wake command window: 3000ms (iter 41 Phase D Task D3 — reduced 5000→3000) — `wakeWord.js:30-31`.
- Plurale "Ragazzi" prepend invariant (iter 41 Phase D Task D1) — `wakeWord.js:18` PRINCIPIO ZERO §1.
- 36+ commands listed §3. Each command pattern → `execute()` → `__ELAB_API.*` or `window.dispatchEvent(CustomEvent('elab-voice-command'))`.
- Onniscenza pari-passo: each command should aggregate `{action, params, ui_state_at_dispatch}` to `unlim_voice_commands_log` Supabase (NEW iter 22+).

### 4.2 Keyboard shortcuts current state ONESTO

- Per-component listeners only (Esc close modal, Enter submit input, Tab focus trap).
- ZERO global Ctrl+Z/Y/S/A handlers wired (gap §3).
- ZERO Space play/pause global (only via voice).
- ZERO F-keys.
- HYBRID priority for NEW global keyboard layer: install at `App.jsx` root with capture phase + per-page filter.

### 4.3 Routing patterns + back/forward

- Hash-only routing (NO react-router per CLAUDE.md stack rule).
- `VALID_HASHES` 13 entries — `App.jsx:62`.
- Deep-link `?exp=...` (`App.jsx:71`) + dashboard-v2 `?live=1&teacher=...&range=...` (`App.jsx:79`).
- `hashchange` + `popstate` both subscribed (`App.jsx:145`) → state sync bidirectional.
- DOC DRIFT FLAG: `#chatbot-only` + `#about-easter` (HomePage iter 36) NOT in `VALID_HASHES` whitelist → audit Andrea verify.

---

## §5 Honesty caveats

1. **DESTRUCTIVE-CANDIDATE flagged operations** (require ADR-036 §3 voice confirm "sì conferma" gate before L0b dispatcher executes):
   - `clearCircuit` (`voiceCommands.js:140`)
   - `resetMemory` (`unlimMemory.js:182`)
   - Cronologia delete session (gap, NEW)
   - `stopSync` (semi-destructive — interrupts autosave)
   - Modalità reset / fullscreen toggle would also qualify.
2. **PII boundary**: `elab_class_key` localStorage onboarding flow is NOT a plain L0b API target. Filling class_key via voice means dictating a PII identifier — explicit out-of-scope per ADR-036 §3 PII protection (NEVER fill credentials).
3. **autosave toggle gap**: `_autoSave` (`unlimMemory.js:508`) runs on timer w/o user-facing toggle. Adding voice "Disattiva salvataggio automatico" requires NEW API L0b + persist preference + UX cue (per Sense 1.5 mode-active morfismo).
4. **Voice command list ground truth**: 36+ actions enumerated by `grep "action: '"` — this is current actions count, NOT reconciled with iter 36 audit "12 actions whitelist" (`intentsDispatcher.js:ALLOWED_INTENT_ACTIONS`). The 12 is server-INTENT whitelist; the 36+ is client voiceCommands. They are SEPARATE surfaces. Onnipotenza expansion ADR-036 ~50 unifies.
5. **GAP enumeration** (search history / delete session / export session / Ctrl+S global / Ctrl+Z global / TTS skip-replay-volume / push-to-talk mode / F-keys / `restartLessonPath` / `markStepDone`) are NOT current bugs — they are ENUMERATED gaps for ADR-036 expansion plan §3 NEW API L0b namespace `__ELAB_API.ui.*` + `__ELAB_API.voice.*`.
6. **#chatbot-only + #about-easter NOT in VALID_HASHES**: confirmed `grep` shows 13 entries excluding these two. HomePage iter 36 ADR-028 §14 amend wires hash routing client-side (HomePage.jsx hash listener `+93 -13 LOC`), NOT through `App.jsx` `VALID_HASHES` whitelist. This is a doc-drift flag, not a bug — but L0b `navigate('chatbot-only')` would silently fail if dispatcher checks whitelist. Iter 22+ unify.
7. **Read-only audit**: ZERO src/test/supabase modifications. ZERO src writes. NO build re-run. NO commits. NO `--no-verify`. Compliant with iter 31 Phase 0 Atom 17.4 file ownership rules.
8. **NO compiacenza**: this audit reports gaps without inflating coverage. 7 categories audited, ~50 surface points enumerated (vs Atom 17.1 Lavagna 62 components / Atom 17.2 Simulator ~80 / Atom 17.3 Tutor+UNLIM ~70). Cross-cutting count realistically smaller because these concerns SPAN components, not enumerate components.

---

## §6 Cross-link

- Plan: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2 Phase 0 Atom 17.4
- Companion audits Phase 0:
  - Lavagna (Atom 17.1): `docs/audits/2026-05-03-onnipotenza-ui-audit-lavagna.md`
  - Simulator (Atom 17.2): `docs/audits/2026-05-03-onnipotenza-ui-audit-simulator.md`
  - Tutor + UNLIM (Atom 17.3): `docs/audits/2026-05-03-onnipotenza-ui-audit-tutor-unlim.md` (Agent C)
  - MASTER consolidate (Atom 17.5): `docs/audits/2026-05-03-onnipotenza-ui-actions-MASTER-enumeration.md` (scribe consolidate, pending)
- Architecture Phase 1 entrance: `docs/adrs/ADR-036-onnipotenza-expansion-ui-namespace-l0b.md` (PROPOSED, iter 18-19)
- Onniscenza pari-passo Phase 1: `docs/adrs/ADR-037-onniscenza-ui-state-snapshot-integration.md` (PROPOSED, iter 19)
- CLAUDE.md sprint history Sprint T iter 36+37+41 (wake word + INTENT parser + linguaggio plurale invariant)
- PRINCIPIO ZERO §1 + Sense 1.5 morfismo (CLAUDE.md "DUE PAROLE D'ORDINE")
