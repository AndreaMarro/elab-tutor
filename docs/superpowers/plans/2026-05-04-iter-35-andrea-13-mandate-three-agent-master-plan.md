# Iter 35 Andrea 13-mandate three-agent master plan — 2026-05-04 PM

**Source**: Andrea explicit prompt 2026-05-04 PM "rendere unlim non ebete + Voxtral wake word + Lavagna libera DAVVERO libera + HomePage Cronologia + Percorso non funziona + 2 Passo Passo + Esci persistence + NO emoticon + Mascotte + Crediti Teodora + Glossario only + multiprovider setup 1 + SVG impeccable + sovrapposizioni Passo Passo".

**Methodology mandate**: /using-superpowers + /make-plan + /ultrathink + /mem-search + /impeccable + /agent-teams:team-spawn + /agent-orchestration:improve-agent + workflow multi-provider setup 1 (Three-Agent Pipeline). NO compiacenza. CoV + audit per atom. Tutto analizzato + testato + validato. Concentrazione massima. Pattern S r3 PHASE-PHASE 5-agent OPUS race-cond fix VALIDATED 22× iter consecutive.

**Score baseline iter 35 entrance**: 8.40-8.50/10 (post iter 31 ralph 32 close + iter 34 5 atomi env-gated). Target finale Sprint T close 9.5/10 ONESTO Andrea Opus G45 indipendente review iter 41-43 (NOT iter 35 single-shot).

**Anti-pattern G45 cap**: NO claim ">8.50 senza Opus review" (cap mantenuto). NO --no-verify. NO push diretto main. NO compiacenza. NO env keys printed. NO destructive ops. Tre-Agent Pipeline gate atom >50 LOC OR content/design/architectural decisions.

---

## §0 Discovery (Phase 0 mandatory baseline + state map)

### 0.1 Stato verificato file-system iter 35 entrance (2026-05-04 PM)

| Componente | Stato | Evidence file:line |
|---|---|---|
| Branch attivo | `e2e-bypass-preview` | `git rev-parse --abbrev-ref HEAD` |
| HEAD commit | `e010924` (iter 37 P0.0 L4 E2E Esci spec) | `git log --oneline -1` |
| Vitest baseline | 13774 PASS | `automa/baseline-tests.txt` |
| Vercel current PROD | `lu2akc2em` aliased www.elabtutor.school | `vercel ls --prod` |
| Edge Function unlim-chat | v80 ACTIVE 2026-05-03 16:02:57Z | iter 31 ralph 32 close |
| F1 fix Esci persistence | shipped commit `d3ad2b3` iter 34 | drawingSync.js +30 + DrawingOverlay.jsx +20 |
| ModalitaSwitch SVG icons | shipped commit `959d1d4` iter 36 | A1 ElabIcons replace 4 emoji |
| HomePage 5 SVG iter 36 | shipped commit `e90a07d` | M1+Q1+O1+workflow1 |
| Footer credits Teodora | shipped commit `f76e4e5` iter 36 | Andrea Marro + Teodora De Venere |
| L4 E2E Esci spec | 332 LOC commit `e010924` iter 37 P0.0 | tests/e2e/05-esci-persistence.spec.js |

### 0.2 Bug LIVE prod confermati Andrea screenshot 2026-05-04 PM

1. **Passo Passo 2 windows sovrapposti** (LavagnaShell.jsx:1317 LEFT PercorsoCapitoloView + 1337 RIGHT FloatingWindowCommon) — Andrea pain "solo quello a destra resizabile"
2. **F1 Esci persistence visibile bug** Andrea iter 19 PM ("scritti spariscono") — fix shipped d3ad2b3 ma Andrea segnala persisto → o deploy mancante o edge case non coperto
3. **Lavagna libera circuito rimane** Andrea iter 30 (#P5054) — handleModalitaChange libero branch line 641-650 fa setCurrentExperiment(null) + clearAll MA ComponentDrawer "PRONTI A MONTARE" banner persiste se `mode === 'guided'`
4. **HomePage emoji ⚡📚🧠📖🐒** ancora visibili nonostante iter 36 ElabIcons (CARDS line 305+317+329+343 + footer 819) — replace SVG impeccable
5. **Cronologia HomeCronologia** mounted line 747 ma UI placeholder/empty state non polish — descriptions UNLIM-generated mancano
6. **Modalità Percorso non funziona come specifiche Andrea** — should be vecchia Libero (empty canvas) + 2 window UNLIM + Percorso lesson Morfismo Sense 1.5
7. **Voxtral wake word non risponde** — wake word ≠ Voxtral confusione mandate. Wake word = browser webkitSpeechRecognition (Chrome/Edge ONLY); Voxtral = Mistral mini-tts-2603 voice clone (TTS)
8. **UNLIM ebete** — pappette pronte, no memory cross-prompt session, no orchestration speed lift, off-topic hard deflect

### 0.3 Trade-off documentati prior session

- **F1 fix shipped d3ad2b3**: 4/4 unit tests PASS (drawingSync.js flushDebouncedSave + DrawingOverlay pathsRef sync + unmount cleanup). Andrea reports BUG persists → L1 verify deploy + L3 beforeunload sync flush + L4 E2E Playwright spec 332 LOC iter 37 P0.0 EXEC mandatory iter 35
- **Three-Agent Pipeline empirical**: validato 3× iter 34 A2b+C1 + iter 37 L4 (5 critical findings caught Codex iter 1 missed). Saving ~50% wall-clock vs Claude solo. $0 incremental cost (ChatGPT Plus + Gemini Pro Andrea sub esistenti)
- **Pattern S r3 race-cond fix**: 22× iter consecutive valid. PHASE 1 4-6 agents parallel rigid file ownership disjoint + filesystem barrier + PHASE 2 scribe sequential post 100% completion msgs

### 0.4 ALLOWED APIs (from CLAUDE.md + iter 31-34 docs)

- `window.__ELAB_API.unlim.{highlightComponent,clearHighlights,sendMessage,setDiagnoseMode}` ✓
- `window.__ELAB_API.{clearAll,getCurrentExperiment,loadExperiment,on,toggleDrawing}` ✓
- `flushDebouncedSave(experimentId, paths)` (drawingSync.js iter 34 F1) ✓
- `FloatingWindow` (src/components/common/FloatingWindow.jsx 225 LOC iter 36 NEW) ✓
- `ElabIcons.jsx` (BookIcon + FootstepsIcon + CircuitIcon + PaletteIcon + StarIcon iter 36) ✓
- `HomeCronologia.jsx` lazy iter 35 ✓
- `localStorage` keys: `elab-lavagna-libero-active` + `elab-lavagna-exp-id` + `elab-lavagna-last-expId` + `elab-floatwin-{title-kebab}` + `elab-drawing-{expId}` + `elab-anon-uuid`

### 0.5 Anti-API list (DO NOT use, fallisce)

- `api.galileo.*` (iter 24 rebrand → use `api.unlim.*`)
- `setBuildMode('sandbox')` (NOT method API top-level — no-op)
- `dispatchTool` server-side (ADR-028 §14 amend iter 37 → surface-to-browser pivot)
- `ENABLE_INTENT_TOOLS_SCHEMA=true` default (iter 38 carryover R7 3.6% canary OFF unchanged)
- `ENABLE_HEDGED_LLM=true` senza `GEMINI_API_KEY` verify (iter 38 P0)

---

## §1 13-mandate atom decomposition

### Mandate 1 — UNLIM non ebete (longer + memory + paletti + speed orchestration)

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **E1** maxOutputTokens default 120→350 | P0 | 10m | Maker-2 | 5 | unit | NO (<50 LOC) |
| **E2** Cap categories Andrea-tuned (chit_chat=30/meta=80/off=80/cit=100/plurale=100/default=200/deep=400/safety=120) | P0 | 30m | Maker-2 | 30 | unit 8 | NO |
| **E3** BASE_PROMPT v3.3 §6 paletti + Andrea matematica/fisica/biologia/scienza OK | P0 | 30m | Maker-2 | 50 | smoke 5 | YES |
| **E4** ENABLE_ONNISCENZA env enable + verify aggregator 7-layer LIVE | P0 Andrea | Andrea | env | — | smoke | NO |
| **E5** ENABLE_HEDGED_LLM + ENABLE_HEDGED_PROVIDER_MIX env enable | P0 Andrea | Andrea | env | — | latency | NO |
| **E6** ENABLE_CAP_CONDITIONAL=true canary 5%→100% | P0 Andrea | Andrea | env | — | bench | NO |
| **E7** ENABLE_L2_CATEGORY_NARROW=true canary | P1 Andrea | Andrea | env | — | R7 lift | NO |

**Verification**: R5 50-prompt bench post-deploy. Avg latency <2000ms p95 <3500ms. PZ V3 ≥90% PASS. Manual smoke 5 prompt categories: greeting (chit_chat short ≤30 parole), deep (deep long ≤400), off-topic (paletti soft pivot ≤80), citation (vol/pag), plurale.

**Doc reference**: `supabase/functions/_shared/onniscenza-classifier.ts:1-150` (iter 34 8 categories) + `supabase/functions/_shared/system-prompt.ts:1-200` (BASE_PROMPT v3.2 + getCategoryCapWordsBlock).

### Mandate 2 — Voxtral wake word non risponde

**Confusione esplicita**: Andrea dice "Voxtral non risponde a wake word" MA tecnicamente:
- Wake word = browser `webkitSpeechRecognition` (Chrome/Edge ONLY, Firefox no, Safari iOS no)
- Voxtral = Mistral `mini-tts-2603` voice clone (TTS output, NON STT input)

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **F1** Diagnostic UI badge HomePage state (active/unsupported/denied/listening) | P0 | 1h | Maker-3 | 80 | visual Chrome MCP | YES |
| **F2** Andrea browser audit via Chrome MCP probe (userAgent + getPermission) | P0 | 15m | Tester-1 | — | runtime | NO |
| **F3** Verify wake word integration test 9/9 PASS | P0 | 5m | Tester-1 | — | vitest | NO |
| **F4** WAKE_PHRASES regex audit + add varianti pronunciation IT | P1 | 20m | Maker-3 | 10 | unit 5 | NO |

**Doc reference**: `src/services/wakeWord.js:WAKE_PHRASES` + `tests/unit/lavagna/wakeWord-integration.test.jsx` 9/9 PASS iter 38.

### Mandate 3 — Lavagna libera DAVVERO libera

**Root cause analyzed CLAUDE.md iter 35 P1**:
1. handleModalitaChange('libero') in LavagnaShell:641 calls clearAll + setCurrentExperiment(null) + sentinel localStorage ✓
2. Mount poll effect (LavagnaShell:692-700) re-loads `elab-lavagna-last-expId` if liberoActive sentinel false at mount ✓
3. ComponentDrawer renders "Pronti a montare!" banner (line 367) when `mode === 'guided'` — **NEEDS GATE modalita !== 'libero'**
4. NewElabSimulator may have stale buildMode/currentExperiment NOT cleared by LavagnaShell

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **G1** Libero entry: dispatch event `elab-lavagna-libero-enter` + reset NewElabSimulator buildMode='sandbox' | P0 | 1h | Maker-2 | 60 | E2E spec | YES |
| **G2** ComponentDrawer guided mode gate `modalita !== 'libero'` | P0 | 30m | Maker-2 | 5 | E2E spec | NO |
| **G3** PRONTI banner gate via `currentExperiment.buildMode === 'guided' && modalita !== 'libero'` | P0 | 20m | Maker-2 | 5 | E2E spec | NO |
| **G4** E2E spec `/lavagna` + Libero → assert canvas count=0 + no PRONTI + no LED/R/9V | P0 | 30m | Tester-1 | 50 | playwright run | YES (gate ≥50 LOC) |

**Doc reference**: `src/components/lavagna/ComponentDrawer.jsx:355-380` + `LavagnaShell.jsx:641-650` (handleModalitaChange libero branch).

### Mandate 4 — HomePage Lavagna section solo lavagna

**Interpretation**: card "Lavagna libera" → /lavagna route + Libero mode ONLY (no GalileoAdapter UNLIM panel auto-show, no other sections).

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **H1** "Lavagna libera" card click → `#lavagna-solo` hash route (NEW) | P0 | 20m | WebDesigner-1 | 10 | hash route test | NO |
| **H2** LavagnaShell respects `data-elab-mode="lavagna-solo"` → hide GalileoAdapter + ComponentDrawer | P0 | 1h | Maker-2 | 50 | visual Chrome MCP | YES |
| **H3** Default focus pen tool active + canvas large | P1 | 30m | WebDesigner-1 | 20 | UX visual | NO |

### Mandate 5 — HomePage Cronologia con descrizioni brevi

**Current**: HomeCronologia.jsx exists, lazy-loaded mounted bottom HomePage (verified iter 35 carryover scroll fix line 747).

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **I1** Verify HomeCronologia render + audit empty/loaded states | P0 | 15m | Tester-1 | — | dev preview | NO |
| **I2** Card per session UI polish: title + description + date + experiment + resume button | P0 | 1h | WebDesigner-1 | 80 | visual | YES |
| **I3** Trigger `unlim-session-description` Edge Function backfill missing descriptions | P0 | 1h | Maker-2 | 60 | Supabase RLS | YES |
| **I4** Empty state plurale "Ragazzi, ancora nessuna sessione" PRINCIPIO ZERO | P0 | 10m | WebDesigner-1 | 5 | visual | NO |

### Mandate 6 — Modalità Percorso adattiva Morfismo Sense 1.5

**Andrea**: "Percorso era pensata per adattarsi al contesto della lezione + classe + sessioni precedenti".

Morfismo Sense 1.5: contesto docente + classe + livello studente + capitolo corrente + memoria sessione (CLAUDE.md §1.5).

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **J1** Wire Percorso context payload (class_key + recent_intents + currentExperiment + lesson context) | P1 | 2h | Maker-2 | 100 | smoke | YES |
| **J2** BASE_PROMPT inject Percorso-specific context block | P1 | 30m | Maker-2 | 40 | smoke | NO |
| **J3** PercorsoPanel show: Capitolo + Esperimento + Ultima sessione + Suggerimenti memoria classe | P1 | 1.5h | WebDesigner-1 | 80 | visual | YES |
| **J4** Defer J1-J3 detailed wire iter 36+ (complex Sense 1.5) | P2 defer | iter 36 | — | 200 | full test | — |

### Mandate 7 — Passo Passo 2 versioni dedup (Andrea screenshot pain)

**Per LavagnaShell audit iter 35**:
- LEFT: `PercorsoCapitoloView` (line 1317-1332) rendered when `activeCapitoloId` set — Sprint S iter 2 chapter overview side panel **da nascondere**
- RIGHT: `FloatingWindowCommon` (line 1337-1368) rendered when `modalita === 'passo-passo'` — Andrea preferisce (resizable + draggable)

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **K1** Hide LEFT PercorsoCapitoloView when modalita === 'passo-passo' (RIGHT FloatingWindow already covers, Andrea preferisce resizable) | P0 | 30m | Maker-2 | 10 | visual verify | NO |
| **K2** RIGHT FloatingWindow size persistence localStorage `elab-floatwin-passo-passo` | P0 | 30m | Maker-2 | 20 | reload verify | NO |
| **K3** PercorsoCapitoloView opt-in toggle button (collapse/expand) IF Andrea wants to keep | P1 | 1h | WebDesigner-1 | 40 | visual | NO |
| **K4** E2E spec assert ONE Passo Passo window when activeCapitoloId set + modalita='passo-passo' | P0 | 30m | Tester-1 | 50 | playwright | YES |

**Andrea explicit screenshot proof**: "tipo qui dovrebbe esserci solo quello a destra resizabile" → K1 hide LEFT, NOT RIGHT (master plan iter 36-38 K1 was inverted, correct iter 35 plan).

### Mandate 8 — Esci Lavagna persistence violata

**Iter 34 F1 shipped**: `flushDebouncedSave` on DrawingOverlay unmount + 4/4 unit tests PASS commit `d3ad2b3`. Andrea reports BUG persists → either F1 not deployed prod OR fix missed edge case.

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **L1** Verify F1 commit `d3ad2b3` deploy LIVE prod via curl chunk hash diff vs build dist | P0 | 10m | Tester-1 | — | hash diff | NO |
| **L2** Audit ALL Esci paths (back button + hash route change + full page navigate + browser close + tab switch) | P0 | 30m | Tester-1 | — | grep paths | NO |
| **L3** Add `beforeunload` handler synchronous flush per page close (sendBeacon API) | P0 | 30m | Maker-2 | 30 | unit sync | YES |
| **L4** E2E Playwright spec EXEC commit `e010924` iter 37 P0.0 332 LOC prod chromium | P0 | 30m | Tester-1 | — | 3 tests PASS | NO |

**Doc reference**: `src/services/drawingSync.js:flushDebouncedSave` + `src/components/simulator/canvas/DrawingOverlay.jsx:pathsRef + unmount cleanup` + `tests/e2e/05-esci-persistence.spec.js` 332 LOC iter 37 P0.0 valid (`playwright --list` 3 tests).

### Mandate 9 — HomePage NO emoticon + mascotte + crediti Teodora

**Status iter 35-36**:
- Mascotte robottino LIVE prod ✅ (iter 35 carryover commits afebf71+5b1ad15+744f607)
- Crediti Teodora SHIPPED ✅ (iter 36 A0 commit `f76e4e5`)
- ModalitaSwitch 4 emoji → SVG SHIPPED ✅ (iter 36 A1 commit `959d1d4`)
- HomePage 5 SVG iter 36 SHIPPED ✅ (commit `e90a07d` M1+Q1 Lavagna+Tutor+UNLIM+Glossario+Footer)

**Verifica Andrea pain 2026-05-04 PM**: HomePage line 305-352 CARDS array ANCORA contiene `emoji: '⚡'` + `'📚'` + `'🧠'` + `'📖'` + line 819 footer `🐒`. Anche se IconComponent SVG presenti, span aria-hidden line 390 mostra emoji legacy fallback.

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **M1** Replace 4 cards emoji ⚡📚🧠📖 with /impeccable-designed SVG (already iter 36 IconComponent — REMOVE legacy emoji span line 390) | P0 | 1h | WebDesigner-1 | 30 | visual Chrome MCP | NO |
| **M2** Replace 🐒 Chi siamo footer line 819 with SVG monkey/robot OR remove emoji | P1 | 15m | WebDesigner-1 | 5 | visual | NO |
| **M3** Verify mascotte robottino LIVE + visible homepage hero | P0 | 5m | Tester-1 | — | visual | NO |
| **M4** Verify credits "Andrea Marro + Teodora De Venere" footer LIVE | P0 | 5m | Tester-1 | — | text grep | NO |

### Mandate 10 — Modalità Percorso = vecchia Libero + 2 window sovrapposte

**Andrea**: "Percorso deve corrispondere alla vecchia modalità libero ma ora ci sono 2 window sovrapposte".

Architettura nuova:
- Empty canvas (come vecchia Libero — handleModalitaChange:641-650 logic riusato)
- Floating window 1: UNLIM panel (chat + voice + INTENT dispatch via GalileoAdapter)
- Floating window 2: Percorso lesson panel (capitolo + classe context Morfismo Sense 1.5)

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **N1** Percorso mode entry: clearAll canvas (riusa logica Libero) + open 2 FloatingWindow | P1 | 1.5h | Maker-2 | 80 | visual verify | YES |
| **N2** PercorsoPanel scaffold: lesson context placeholder (Capitolo + Esperimento + Memoria classe) | P1 | 1h | WebDesigner-1 | 60 | render | YES |
| **N3** UNLIM panel positioning + z-index coordination con PercorsoPanel (no overlap) | P1 | 1h | WebDesigner-1 | 30 | drag without overlap | NO |

### Mandate 11 — HomePage Glossario only

**Andrea**: "metti anche il glossario, ma solo glossario nella home page".

**Status**: O1 Glossario card 4° section SHIPPED iter 36 commit `e90a07d` (CARDS line 341-352 external https://elab-tutor-glossario.vercel.app target=_blank). NULL.

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **O1** Verify Glossario card 4° section LIVE + click external open | P0 | 5m | Tester-1 | — | click verify | NO |
| **O2** SVG GlossarioCardIcon /impeccable bolder/colorize verify | P1 | 30m | WebDesigner-1 | 30 | visual | NO |

### Mandate 12 — Multiprovider setup 1 workflow

**Source**: ADR-029 LLM_ROUTING_WEIGHTS Mistral 70 / Gemini 20 / Together 10 (iter 37 ACCEPTED). Marketing PDF Caso B Hybrid Mistral primary. Workflow Three-Agent Pipeline (Plan Claude + Implement Codex + Review Gemini) gate atom >50 LOC OR architectural.

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **P1** Verify LLM_ROUTING_WEIGHTS env config Supabase secrets | P0 Andrea | 5m | Andrea | env | `npx supabase secrets get` | NO |
| **P2** Document multiprovider setup 1 in handoff iter 35 doc | P0 | 30m | Scribe | — | doc | NO |
| **P3** Add canary monitoring telemetry per provider hit rate | P1 | 1h | Maker-2 | 30 | log verify | NO |
| **P4** Three-Agent Pipeline gate enforce per atom (Plan Claude → Codex Implement → Gemini Review → Codex Finalize → Claude Verify) | P0 | inline | Orchestrator | — | per-atom | NO |

### Mandate 13 — SVG sostitutivi emoticon più belli (impeccable)

**Andrea**: "fai svg sostitutivi delle emoticon molto più belle usa impeccable".

Apply to:
- HomePage 4 cards icons (⚡📚🧠📖) — iter 36 IconComponent shipped, /impeccable:bolder + /impeccable:colorize enhance
- Footer 🐒 Chi siamo — replace SVG monkey OR robot mascotte

| Atom | Priority | Time | Owner | LOC | CoV | Three-Agent? |
|---|---|---|---|---|---|---|
| **Q1** /impeccable:bolder enhance 4 HomePage cards icons (Lightning + Books + Brain + Glossario book) Navy/Lime | P0 | 2h | WebDesigner-1 | 100 | visual Chrome MCP | YES |
| **Q2** /impeccable:bolder enhance 4 ModalitaSwitch icons (Book + Footsteps + Circuit + Palette) iter 36 baseline | P1 | 1.5h | WebDesigner-1 | 60 | visual | YES |
| **Q3** /impeccable:polish footer 🐒 → SVG monkey/robot Navy stroke | P1 | 30m | WebDesigner-1 | 30 | visual | NO |

---

## §2 Dependency graph

```
Andrea ratify queue (D1 env enable + Edge Function deploy)
   ├── E4 ENABLE_ONNISCENZA effective LIVE
   ├── E5 ENABLE_HEDGED_LLM effective LIVE
   ├── E6 ENABLE_CAP_CONDITIONAL canary 5%→100%
   ├── E7 ENABLE_L2_CATEGORY_NARROW canary
   ├── J1+J2 Percorso context inject
   └── P1+P3 multiprovider canary monitoring

HomePage refactor (no Edge dep)
   ├── M1+M2+Q1+Q3 emoji → SVG impeccable
   ├── O1+O2 Glossario verify
   ├── I1-I4 Cronologia UI polish
   ├── M3+M4 mascotte + credits verify
   └── F1 Wake word diagnostic UI badge

Lavagna refactor (no Edge dep)
   ├── G1-G4 Libero TRUE clear (event dispatch + ComponentDrawer scope)
   ├── H1-H3 Lavagna section solo (data-elab-mode="lavagna-solo")
   ├── K1-K4 Passo Passo dedup hide LEFT preserve RIGHT resizable
   ├── L1-L4 Esci persistence beforeunload + E2E EXEC
   └── N1-N3 Percorso 2-window overlay

Wake word audit (low risk)
   └── F1-F4 wake word state + diagnostic + browser audit + WAKE_PHRASES varianti

UNLIM intelligence (Edge dep)
   ├── E1+E2+E3 BASE_PROMPT v3.3 + cap conditional + 8 categories deploy
   └── E4+E5+E6+E7 Andrea ratify queue env enable
```

---

## §3 Pattern S r3 PHASE-PHASE 5-agent OPUS execution plan

### Phase 0 — Discovery (this turn, completed §0)

✅ Stato verificato file-system + 7 bug LIVE prod confirmed Andrea screenshot + ALLOWED APIs + Anti-API list + 13-mandate atom decomposition.

### Phase 1 — Architect ADR ratify decisions (1h)

**Owner**: Architect-opus (single-agent inline) OR feature-dev:code-architect

**Deliverables**:
1. **ADR-038** K-mandate Passo Passo dedup decision (hide LEFT vs RIGHT) — Andrea screenshot evidence "solo quello a destra resizabile" → hide LEFT
2. **ADR-039** G-mandate ComponentDrawer scope gate (`mode !== 'libero'` AND `modalita !== 'libero'`)
3. **ADR-040** N-mandate 2-window overlay architecture (Percorso = clearAll + UNLIM FloatingWindow + PercorsoPanel FloatingWindow z-index hierarchy)
4. **ADR-041 update** UI namespace L0b extension if Percorso panel needs new methods

### Phase 2 — Maker + WebDesigner + Tester PARALLEL spawn (4-8h)

**Filesystem barrier**: `automa/team-state/messages/{agent}-iter35-phase2-completed.md`. PHASE 3 Scribe Phase 2 spawn POST 5/5 confirmation.

**Pattern S r3 file ownership matrix** (rigid disjoint, NO write conflict):

| Agent | Owns (write) | Reads (no write) |
|---|---|---|
| Maker-1 (UNLIM intel) | `supabase/functions/_shared/onniscenza-classifier.ts` + `system-prompt.ts` + `unlim-chat/index.ts` | LavagnaShell, ComponentDrawer |
| Maker-2 (Lavagna) | `src/components/lavagna/LavagnaShell.jsx` + `ComponentDrawer.jsx` + `useGalileoChat.js` + `services/drawingSync.js` | NewElabSimulator, supabase/ |
| Maker-3 (Wake word) | `src/services/wakeWord.js` + `tests/unit/lavagna/wakeWord-integration.test.jsx` + `src/components/common/MicPermissionNudge.jsx` | LavagnaShell read-only |
| WebDesigner-1 (HomePage + Cronologia + SVG) | `src/components/HomePage.jsx` + `HomeCronologia.jsx` + `common/ElabIcons.jsx` + `lavagna/PercorsoPanel.jsx` (NEW) | LavagnaShell read-only |
| Tester-1 (E2E + smoke + bench) | `tests/e2e/0[5,6,7]-*.spec.js` + `tests/unit/audit/*` + `scripts/bench/output/*` | All read-only |

**Maker-1 atomi (UNLIM intel) — 2-3h Three-Agent gate atomi >50 LOC**:
- E1 maxOutputTokens 5 LOC (NO Three-Agent)
- E2 cap categories 30 LOC (NO Three-Agent)
- E3 BASE_PROMPT v3.3 §6 paletti 50 LOC (Three-Agent gate borderline, USE per content quality)
- E4-E7 Andrea env enable (NO code)
- P3 telemetry per provider 30 LOC (NO Three-Agent)
- I3 Edge Function unlim-session-description backfill 60 LOC (Three-Agent)

**Maker-2 atomi (Lavagna) — 4-5h Three-Agent gate**:
- G1 Libero event dispatch 60 LOC (Three-Agent)
- G2 ComponentDrawer gate 5 LOC (NO)
- G3 PRONTI banner gate 5 LOC (NO)
- H2 LavagnaShell `data-elab-mode` 50 LOC (Three-Agent gate borderline)
- K1 hide LEFT 10 LOC (NO)
- K2 size persistence 20 LOC (NO)
- L3 beforeunload sendBeacon 30 LOC (NO)
- N1 Percorso 2-window 80 LOC (Three-Agent)
- J1 Percorso context 100 LOC (Three-Agent)
- J2 BASE_PROMPT inject 40 LOC (NO)

**Maker-3 atomi (Wake word) — 1.5h Three-Agent gate**:
- F1 Diagnostic UI badge 80 LOC (Three-Agent)
- F4 WAKE_PHRASES varianti 10 LOC (NO)

**WebDesigner-1 atomi (HomePage + SVG impeccable) — 4-6h Three-Agent gate**:
- M1 emoji removal 30 LOC (NO)
- M2 footer 🐒 SVG 5 LOC (NO)
- Q1 4 cards SVG bolder/colorize 100 LOC (Three-Agent + /impeccable:bolder)
- Q2 ModalitaSwitch 4 icons enhance 60 LOC (Three-Agent + /impeccable:bolder)
- Q3 footer SVG monkey 30 LOC (NO)
- O2 GlossarioCardIcon polish 30 LOC (NO)
- I2 Cronologia card UI polish 80 LOC (Three-Agent)
- I4 empty state plurale 5 LOC (NO)
- H1 lavagna-solo hash route 10 LOC (NO)
- H3 default focus pen tool 20 LOC (NO)
- N2 PercorsoPanel scaffold 60 LOC (Three-Agent)
- N3 UNLIM panel z-index 30 LOC (NO)
- J3 PercorsoPanel UX 80 LOC (Three-Agent)
- K3 PercorsoCapitoloView toggle 40 LOC (NO)

**Tester-1 atomi (E2E + verify) — 3-4h**:
- F2+F3 wake word audit + integration test 9/9
- L1+L2 Esci verify F1 deploy + audit paths
- L4 E2E spec EXEC prod chromium 332 LOC iter 37 P0.0 (3 tests)
- G4 E2E Libero TRUE clear 50 LOC (Three-Agent gate)
- K4 E2E Passo Passo ONE window 50 LOC (Three-Agent gate)
- M3+M4 mascotte + credits verify
- O1 Glossario click verify
- I1 HomeCronologia render audit
- R5+R7 re-bench post-deploy (Andrea env enable conditional)

### Phase 3 — Scribe Documenter Phase 2 SEQUENTIAL post 5/5 barrier (1h)

**Owner**: Scribe-opus

**Deliverables**:
1. `docs/audits/2026-05-04-iter-35-PHASE3-CLOSE-audit.md` (~600 LOC) — 5 sezioni per agente + caveats + score G45
2. `docs/handoff/2026-05-04-iter-35-to-iter-36-handoff.md` (~400 LOC) — activation string + Andrea ratify queue 8 entries
3. CLAUDE.md sprint history append (~150 LOC iter 35 close)
4. `automa/team-state/messages/scribe-iter35-phase2-completed.md`

### Phase 4 — Orchestrator commit + Vercel deploy + alias swap (30-60m)

**Owner**: Orchestrator inline

**Steps**:
1. Pre-commit CoV: `npx vitest run` baseline preserve target ≥13774
2. Pre-commit CoV: `npm run build` PASS (~14min heavy)
3. `git add` selective (NO `-A`, files only delta iter 35)
4. `git commit` per atom group (E + G + H + K + L + N + I + M + Q + F + audit + handoff + CLAUDE.md = ~12 commits)
5. `git push origin e2e-bypass-preview` (NO push main)
6. Vercel auto-build BG monitor + Ready confirm
7. Andrea ratify queue trigger: ENABLE_ONNISCENZA + ENABLE_HEDGED_LLM + ENABLE_CAP_CONDITIONAL canary 5%
8. Edge Function unlim-chat deploy v81+ Mistral function calling + cap conditional + L2 narrow
9. Vercel alias swap → www.elabtutor.school PROD LIVE
10. Smoke test prod 5 prompt categories + Lavagna libera blank + Passo Passo single window + Esci persistence E2E

### Phase 5 — Final verification + R5+R7 re-bench + audit (1h)

**Owner**: Tester-1 inline

**Steps**:
1. R5 50-prompt bench post-deploy → expect avg <2000ms p95 <3500ms PZ V3 ≥90%
2. R7 200-prompt canonical % → target ≥80% post Mistral function calling + L2 narrow
3. Lighthouse perf measure HomePage + Lavagna routes (target ≥90)
4. 50-cell E2E Onnipotenza ADR-041 path B real dispatch (already 50/50 PASS iter 32)
5. Smoke 5 mandate manual verify Andrea pain points fixed
6. Score iter 35 G45 indipendente review (cap honest 8.40-8.55 max)

---

## §4 Acceptance gates

### Phase 1 gate (ADR ratify)
- [ ] ADR-038 + ADR-039 + ADR-040 status PROPOSED → ACCEPTED via Andrea inline ratify
- [ ] Architect-opus completion msg filesystem barrier

### Phase 2 gate (5 agents PARALLEL completion)
- [ ] 5/5 completion msgs `automa/team-state/messages/{maker1,maker2,maker3,webdesigner1,tester1}-iter35-phase2-completed.md`
- [ ] Vitest 13774+ preserve verify (NO regression)
- [ ] File ownership rigid respected (no write conflict cross-agent)

### Phase 3 gate (Scribe)
- [ ] Audit doc shipped + handoff doc shipped + CLAUDE.md append
- [ ] Caveats §5 minimum 5 honest critical

### Phase 4 gate (deploy)
- [ ] Build PASS pre-commit
- [ ] Vitest 13774+ pre-push
- [ ] Vercel Production LIVE www.elabtutor.school alias swap confirmed
- [ ] Edge Function v81+ active + smoke 5 categories PASS

### Phase 5 gate (verification)
- [ ] R5 ≥90% PZ V3 + latency target met
- [ ] R7 ≥80% canonical OR explicit caveat L2 dominance defer iter 36+
- [ ] Andrea pain 7 LIVE prod bug RESOLVED visual verify (Chrome MCP screenshot diff)
- [ ] Score G45 indipendente review honest cap 8.40-8.55

---

## §5 Anti-pattern enforcement (G45 cap honest)

| Anti-pattern | Manifestazione tipica | Contromisura inline |
|---|---|---|
| Compiacenza score | "8.50+ achieved" senza Opus review | Cap mantenuto 8.45-8.55 max iter 35 close, Opus review iter 41-43 |
| Quantitative inflation | "13 mandate ALL DONE" prematuro | Per-atom CoV + caveat doc + ratify queue gate |
| Hedging | "should mostly work" | PASS/FAIL binary per atom + E2E spec EXEC mandatory |
| Claim-reality gap | "Lavagna libera FIXED" senza visual verify | Chrome MCP screenshot diff prod + Andrea manual confirm |
| Premature architecture | Build new Percorso panel senza Andrea ratify | N1-N3 Three-Agent gate + ADR-040 ratify Phase 1 |
| Hidden cost | "$0 incremental" senza disambiguazione | Codex ChatGPT Plus + Gemini Pro Andrea sub esistenti, NO API extra |
| Authority by reference | "iter 36 mandate says X" senza file:line | Inline file:line citations per claim |
| Skip verification | Atom shipped senza E2E spec | Tester-1 owner verify atomi >30 LOC mandatory |

**Anti-pattern G45 enforced finale iter 35**:
- NO claim "Sprint T close achieved" (iter 41-43 + Andrea Opus indipendente review G45 mandate)
- NO claim "Score >8.55 senza Opus review" (cap 8.45-8.55 honest realistic iter 35)
- NO claim "Andrea ratify queue closed" (NEW entries iter 36+ entrance)
- NO --no-verify (pre-commit + pre-push hooks rispettati 100%)
- NO push diretto main (e2e-bypass-preview branch + Vercel preview alias finale Production)
- NO compiacenza Three-Agent (admitted iter 34 small atomi marginal benefit + iter 36 0% multi-provider compliance)
- NO env keys printed conversation (Supabase token used via shell env)
- NO destructive ops (NO git reset --hard, NO rm -rf, NO DROP TABLE)

---

## §6 Andrea ratify queue iter 35 close → iter 36 entrance

| # | Entry | Priority | Time | Action |
|---|---|---|---|---|
| 1 | ENABLE_ONNISCENZA=true Supabase env enable | P0 | 5m | `npx supabase secrets set ENABLE_ONNISCENZA=true --project-ref euqpdueopmlllqjmqnyb` |
| 2 | ENABLE_HEDGED_LLM=true + ENABLE_HEDGED_PROVIDER_MIX=true (verify GEMINI_API_KEY) | P0 | 5m | env enable + smoke latency |
| 3 | ENABLE_CAP_CONDITIONAL=true canary 5%→100% | P0 | 5m | env enable + R5 re-bench |
| 4 | ENABLE_L2_CATEGORY_NARROW=true canary | P1 | 5m | env enable + R7 re-bench |
| 5 | Edge Function unlim-chat deploy v81+ | P0 | 5m | `supabase functions deploy unlim-chat` |
| 6 | Vercel deploy frontend post commits iter 35 | P0 | 5m | `vercel --prod --yes --archive=tgz` |
| 7 | macOS Computer Use real mic permission test wake word B1 | P1 | 10m | manual click HomePage F1 badge |
| 8 | R5+R6+R7 re-bench batch post env enable | P0 | 30m | `node scripts/bench/run-sprint-r{5,6,7}-stress.mjs` |

**Total Andrea time**: ~1h sequential (post-iter-35 close).

---

## §7 Cross-link docs iter 35

- **Plan corrente**: `docs/superpowers/plans/2026-05-04-iter-35-andrea-13-mandate-three-agent-master-plan.md` (this file)
- **Plan iter 36-38 prior**: `docs/superpowers/plans/2026-05-04-iter-36-38-andrea-12-mandate-master-plan.md` (master parent)
- **Workflow multi-provider**: `docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md`
- **F1 Esci fix audit**: `docs/audits/2026-05-03-atom-F1-esci-persistence-drawing.md`
- **L4 E2E Esci spec**: `tests/e2e/05-esci-persistence.spec.js` (332 LOC commit `e010924` iter 37 P0.0)
- **L4 audit**: `docs/audits/2026-05-04-iter-37-three-agent-pipeline-trial-L4-esci-persistence.md`
- **Iter 31 ralph 32 close**: CLAUDE.md sprint history footer line ~1990
- **CLAUDE.md DUE PAROLE D'ORDINE**: Principio Zero + Morfismo Sense 1 + 1.5 + 2

---

## §8 Three-Agent Pipeline atomi gate >50 LOC OR architectural

| Atom | LOC | Gate trigger | Pipeline owner |
|---|---|---|---|
| E3 BASE_PROMPT v3.3 §6 paletti | 50 | content quality | Maker-1 + Codex + Gemini |
| G1 Libero event dispatch | 60 | architectural | Maker-2 + Codex + Gemini |
| G4 E2E Libero spec | 50 | borderline + spec quality | Tester-1 + Codex + Gemini |
| H2 LavagnaShell data-elab-mode | 50 | borderline + UX | Maker-2 + Codex + Gemini |
| I2 Cronologia card UI polish | 80 | design + UX | WebDesigner-1 + Codex + Gemini + /impeccable |
| I3 unlim-session-description backfill | 60 | content + Edge Function | Maker-1 + Codex + Gemini |
| J1 Percorso context payload | 100 | architectural Sense 1.5 | Maker-2 + Codex + Gemini |
| J3 PercorsoPanel UX | 80 | design + Sense 1.5 | WebDesigner-1 + Codex + Gemini + /impeccable |
| K4 E2E Passo Passo ONE window | 50 | borderline + spec quality | Tester-1 + Codex + Gemini |
| F1 Wake word diagnostic UI badge | 80 | design + state machine | Maker-3 + Codex + Gemini |
| L3 beforeunload sendBeacon | 30 | architectural critical | Maker-2 + Codex + Gemini |
| N1 Percorso 2-window | 80 | architectural | Maker-2 + Codex + Gemini |
| N2 PercorsoPanel scaffold | 60 | design | WebDesigner-1 + Codex + Gemini |
| Q1 4 cards SVG bolder/colorize | 100 | design + /impeccable | WebDesigner-1 + Codex + Gemini + /impeccable:bolder |
| Q2 ModalitaSwitch 4 icons enhance | 60 | design + /impeccable | WebDesigner-1 + Codex + Gemini + /impeccable:bolder |

**Three-Agent Pipeline empirical iter 34-37**:
- iter 34 A2b small linear ~13 LOC: marginal (1 MEDIUM style)
- iter 34 C1 complex stateful ~18 LOC race: CRITICAL stale closure
- iter 37 P0.0 L4 medium E2E 291→332 LOC: 2 HIGH (waits + DB pollution) + 2 MEDIUM (viewport + Italian) + 1 LOW (beforeunload)

**Hypothesis verdict step 1**: H1 anti-bias TRUE significant + H2 wall-clock TRUE ~50% saving + H3 debito TRUE caught proactively + H4 cost TRUE $0 incremental.

---

## §9 Honesty caveats baseline iter 35 plan

1. **F1 Esci shipped d3ad2b3 iter 34 BUT Andrea reports persists** — L1 verify deploy chunk hash diff PRIORITY, possible deploy regression OR edge case beforeunload sync flush mancante
2. **K1 Andrea screenshot evidence opposite master plan iter 36-38 K1** — hide LEFT (PercorsoCapitoloView side panel) NOT RIGHT (FloatingWindowCommon resizable). Inverted interpretazione.
3. **HomePage CARDS array 4 cards already has IconComponent SVG iter 36 commit `e90a07d`** — Andrea pain "ancora emoticon" può essere fallback span line 390 `card.emoji` legacy. M1 specifico = REMOVE legacy emoji span.
4. **Cronologia HomeCronologia mounted line 747 iter 35 carryover** — Andrea pain "manca cronologia" può essere empty state placeholder visual. I1 verify render + I2 polish UI.
5. **Modalità Percorso = vecchia Libero 2-window** — completa nuova architettura Sense 1.5 complessa, J1-J3 Three-Agent gate + ADR-040 ratify mandatory. Defer J4 detailed Sense 1.5 wire iter 36+ se complessità >5h.
6. **UNLIM ebete fix richiede Andrea env enable post-deploy** — E1+E2+E3 code shipped iter 35 close MA effective LIVE solo post Andrea ratify queue D1+D2+D3 entries.
7. **Voxtral confusion** — Andrea dice "Voxtral non risponde wake word" MA wake word ≠ Voxtral. F1 diagnostic UI badge chiarirà state browser webkitSpeechRecognition.
8. **Three-Agent Pipeline marginal benefit small atomi <50 LOC** — admitted iter 34 0% regression iter 36 0% multi-provider compliance. Atom <30 LOC Claude inline OK, no overhead.
9. **Mac Mini SSH down OR plateau iter 36** — autonomous loop probably stale post iter 32 cron `ccaf63f8` deleted. Tasks defer iter 36+ retry post org-limit-reset.
10. **Lighthouse perf 26+23 FAIL iter 38 baseline** — defer iter 36+ optim lazy mount + chunking + image optim + font preload. Iter 35 NO perf optim atom.
11. **Sprint T close 9.5 NOT achievable iter 35 single-shot** — realistic cumulative iter 41-43 + Andrea Opus G45 indipendente review. Score iter 35 cap 8.45-8.55 honest.

---

## §10 Self-contained Phase 2 spawn prompt template

For each Phase 2 agent, prompt includes:
- Self-contained context (no chat memory)
- Atom list owned + LOC + CoV + Three-Agent gate flag
- File ownership matrix (write OK + read-only)
- Deliverable: completion msg `automa/team-state/messages/{agent}-iter35-phase2-completed.md`
- CoV: vitest 13774+ preserve + build PASS pre-commit + smoke verify
- Anti-pattern: NO write outside ownership + NO --no-verify + NO destructive
- Three-Agent Pipeline gate: per atom >50 LOC OR architectural → Plan Claude + Codex Implement + Gemini Review + Codex Finalize + Claude Verify

**Spawn order Phase 2** (this turn):
1. Maker-1 (UNLIM intel + I3 Edge backfill) — BG agent
2. Maker-2 (Lavagna G+H+K+L+N+J) — BG agent
3. Maker-3 (Wake word F) — BG agent
4. WebDesigner-1 (HomePage + SVG impeccable + Cronologia + PercorsoPanel) — BG agent
5. Tester-1 (E2E + smoke + bench + verify) — BG agent

**Communication**: Filesystem `automa/team-state/messages/{agent}-iter35-phase2-{started,progress,completed,blocker}.md`. NO direct cross-agent messaging (race-cond risk).

**Filesystem barrier protocol**: Scribe Phase 3 spawn ONLY post 5/5 `*-completed.md` confirmed. Orchestrator inline verify file existence pre Scribe spawn.

---

## §11 Score progression target

| Phase | Target ONESTO | Conditional |
|---|---|---|
| Phase 0 close (this turn) | 8.40-8.50 baseline | Discovery + plan complete |
| Phase 1 close | 8.45 | ADR ratify ACCEPTED |
| Phase 2 close (5 agents PARALLEL) | 8.50 | 5/5 atomi shipped + vitest preserve |
| Phase 3 close (Scribe) | 8.50 | Audit + handoff complete |
| Phase 4 close (deploy) | 8.55 | Vercel LIVE + Edge v81+ + Andrea ratify queue 5 entries enabled |
| Phase 5 close (verification) | **8.45-8.55 G45 cap finale** | R5+R7 PASS + Andrea visual verify + caveat honest |

**Sprint T close projection finale**: iter 41-43 cumulative + Andrea Opus G45 indipendente review → 9.0-9.5 ONESTO. NO claim iter 35 single-shot.

---

## §12 Plan version control

**Plan version**: v1.0 (single source of truth this iter 35)
**Author**: Claude Opus 4.7 1M (caveman mode + explanatory + learning output style + ultrathink reasoning)
**Date**: 2026-05-04 PM
**Status**: PROPOSED — Andrea ratify gate Phase 1 entrance OR auto-approve "vai" / "procedi" / "esegui"
**Supersedes**: docs/superpowers/plans/2026-05-04-iter-36-38-andrea-12-mandate-master-plan.md (12-mandate parent, iter 35 13-mandate child + K-mandate inverted correction)

---

End of plan iter 35.
