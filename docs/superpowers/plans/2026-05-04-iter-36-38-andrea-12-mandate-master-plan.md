# Iter 36-38 master plan — Andrea 12-mandate 2026-05-04 PM

**Source**: Andrea explicit prompt 2026-05-04 PM "rendi UNLIM non ebete + Voxtral wake word + Lavagna libera DAVVERO libera + HomePage Cronologia + Percorso non funziona + 2 Passo Passo + Esci persistence + NO emoticon + Mascotte + Crediti Teodora + Glossario only + multiprovider setup 1 + SVG impeccable icons più belle".

**Methodology mandate**: /using-superpowers + /make-plan + /ultrathink + /mem-search + /impeccable. NO compiacenza. CoV + audit per atom. Tutto analizzato + testato + validato. Concentrazione massima. Workflow precedente Pattern S r3 PHASE-PHASE multi-agent.

**Score baseline iter 36 entrance**: 8.40 (post iter 35 carryover close). Target Sprint T close iter 41-43 cumulative + Andrea Opus G45 indipendente review. NO inflate >8.50 senza review.

---

## §1 12-mandate decomposition + atom plan

### Mandate 1 — UNLIM intelligence non ebete

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **E1** maxOutputTokens default 120→350 | P0 | 10m | `_shared/llm-client.ts:88,318` | 5 | unit test default |
| **E2** Cap categories Andrea-tuned (chit_chat=30/meta=80/off=80/cit=100/plurale=100/default=200/deep=400/safety=120) | P0 | 30m | `_shared/onniscenza-classifier.ts` | 30 | unit test 8 categories |
| **E3** BASE_PROMPT v3.3 §6 paletti list (matematica/fisica/biologia/scienza OK; politica/religione/NSFW/adult NO) | P0 | 30m | `_shared/system-prompt.ts` | 50 | smoke 5 prompts |
| **E4** Memory ENABLE_ONNISCENZA env enable | P0 Andrea | Andrea | env var | — | aggregator 7-layer LIVE |
| **E5** Hedged Mistral primary (already shipped iter 41 Phase A) verify env enable | P0 Andrea | Andrea | env var | — | latency lift |

**Verification**: R5 50-prompt bench post-deploy. Avg latency <2000ms p95 <3500ms. PZ V3 ≥90% PASS. Manual smoke 5 prompt categories: greeting (chit_chat short), deep question (deep long), off-topic math (paletti soft pivot), citation request (vol/pag), plurale Ragazzi (PZ V3).

### Mandate 2 — Voxtral wake word non risponde

**Confusione**: wake word ≠ Voxtral. Wake word = browser webkitSpeechRecognition (Chrome/Edge ONLY). Voxtral = Mistral mini-tts-2603 voice clone Andrea (TTS).

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **F1** Diagnostic UI badge HomePage state (active/unsupported/denied/listening) | P0 | 1h | `HomePage.jsx` | 80 | visual verify Chrome MCP |
| **F2** Andrea browser audit via Chrome MCP probe | P0 | 15m | runtime | — | userAgent + getPermission |
| **F3** Verify wake word integration test 9/9 PASS | P0 | 5m | `tests/unit/lavagna/wakeWord-integration.test.jsx` | — | vitest run |
| **F4** WAKE_PHRASES regex audit + add varianti pronunciation | P0 | 20m | `services/wakeWord.js:WAKE_PHRASES` | 10 | unit test 5 varianti |

### Mandate 3 — Lavagna libera DAVVERO libera

**Root cause analyzed CLAUDE.md**: handleModalitaChange('libero') in LavagnaShell:641 calls clearAll + setCurrentExperiment(null) + sentinel localStorage. BUT:
1. Mount poll effect (LavagnaShell:686-700) re-loads `elab-lavagna-last-expId` if liberoActive sentinel false at mount
2. ComponentDrawer renders "Pronti a montare!" banner (line 367) when `mode === 'guided'`
3. NewElabSimulator may have stale buildMode/currentExperiment NOT cleared by LavagnaShell

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **G1** Libero entry: dispatch event `elab-lavagna-libero-enter` + reset NewElabSimulator buildMode='sandbox' | P0 | 1h | `LavagnaShell.jsx:641` + `NewElabSimulator.jsx` listener | 60 | E2E spec |
| **G2** ComponentDrawer guided mode gate `modalita !== 'libero'` | P0 | 30m | `ComponentDrawer.jsx:355` | 5 | E2E spec |
| **G3** PRONTI banner gate via `currentExperiment.buildMode === 'guided' && modalita !== 'libero'` | P0 | 20m | `ComponentDrawer.jsx:367` | 5 | E2E spec |
| **G4** E2E spec `/lavagna` + Libero → assert canvas count=0 + no PRONTI + no LED/R/9V | P0 | 30m | `tests/e2e/06-lavagna-libera-empty.spec.js` NEW | 50 | playwright run |

### Mandate 4 — HomePage Lavagna section solo lavagna

**Interpretation**: card "Lavagna Libera" → /lavagna route + Libero mode + ONLY Lavagna visible (no GalileoAdapter UNLIM panel auto-show, no other sections).

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **H1** "Lavagna Libera" card click → `#lavagna-solo` hash route (NEW) | P0 | 20m | `HomePage.jsx` cards array | 10 | hash route test |
| **H2** LavagnaShell respects `data-elab-mode="lavagna-solo"` → hide GalileoAdapter + ComponentDrawer | P0 | 1h | `LavagnaShell.jsx` conditional render | 50 | visual verify Chrome MCP |
| **H3** Default focus: pen tool active + canvas large | P1 | 30m | LavagnaShell + FloatingToolbar | 20 | UX visual |

### Mandate 5 — HomePage Cronologia con descrizioni brevi

**Current**: HomeCronologia.jsx exists, lazy-loaded mounted bottom HomePage (verified iter 35 carryover scroll fix).

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **I1** Verify HomeCronologia render + audit empty/loaded states | P0 | 15m | `HomeCronologia.jsx` | — | dev preview verify |
| **I2** Card per session UI polish: title + description + date + experiment + resume button | P0 | 1h | `HomeCronologia.jsx` + CSS | 80 | visual verify |
| **I3** Trigger `unlim-session-description` Edge Function backfill missing descriptions | P0 | 1h | `HomeCronologia.jsx` + Edge | 60 | Supabase RLS |
| **I4** Empty state plurale "Ragazzi, ancora nessuna sessione" PRINCIPIO ZERO | P0 | 10m | `HomeCronologia.jsx` | 5 | visual verify |

### Mandate 6 — Modalità Percorso adattiva Morfismo Sense 1.5

**Andrea**: "Percorso era pensata per adattarsi al contesto della lezione + classe + sessioni precedenti".

Morfismo Sense 1.5: contesto docente + classe + livello studente + capitolo corrente + memoria sessione (CLAUDE.md §1.5).

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **J1** Wire Percorso context payload (class_key + recent_intents + currentExperiment + lesson context) | P1 | 2h | `unlim-chat/index.ts` + `LavagnaShell.jsx` | 100 | Edge Function smoke |
| **J2** BASE_PROMPT inject Percorso-specific context block | P1 | 30m | `_shared/system-prompt.ts` + `unlim-chat/index.ts` | 40 | smoke |
| **J3** PercorsoPanel show: Capitolo + Esperimento + Ultima sessione + Suggerimenti memoria classe | P1 | 1.5h | `lavagna/PercorsoPanel.jsx` | 80 | visual |
| **J4** Defer J1-J3 detailed wire iter 37 (complex Sense 1.5 architecture) | P2 | 4h | multi-file | 200 | full test |

### Mandate 7 — Passo Passo 2 versioni (vecchia + resizable)

**Per LavagnaShell audit**:
- LEFT: PercorsoCapitoloView (rendered when activeCapitoloId set, line 1317) — Andrea preferisce
- RIGHT: FloatingWindowCommon LessonReader (rendered when modalita='passo-passo', line 1337) — Andrea vuole rimuovere/dedup

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **K1** Hide RIGHT FloatingWindowCommon when activeCapitoloId set (LEFT already covers) | P1 | 30m | `LavagnaShell.jsx:1337` gate | 10 | visual verify |
| **K2** PercorsoCapitoloView resize handle (currently sidebar fixed 25%) | P1 | 1.5h | `PercorsoCapitoloView.jsx` + CSS | 80 | drag-resize Chrome MCP |
| **K3** localStorage persist size | P1 | 30m | `PercorsoCapitoloView.jsx` | 20 | verify reload |
| **K4** Or: wrap PercorsoCapitoloView in FloatingWindow.jsx (iter 36 NEW 225 LOC) | P1 alt | 1h | refactor | 50 | full anim verify |

### Mandate 8 — Esci Lavagna persistence violata

**Iter 34 F1 shipped**: `flushDebouncedSave` on DrawingOverlay unmount + 4/4 unit tests PASS (CLAUDE.md). Andrea reports BUG persists → either F1 not deployed prod OR fix missed edge case.

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **L1** Verify F1 commit `d3ad2b3` deploy LIVE prod via curl chunk hash diff | P0 | 10m | curl prod | — | hash diff |
| **L2** Audit ALL Esci paths (back button + hash route change + full page navigate + browser close) | P0 | 30m | `LavagnaShell.jsx` + `DrawingOverlay.jsx` | — | grep paths |
| **L3** Add `beforeunload` handler synchronous flush per page close | P0 | 30m | `DrawingOverlay.jsx` | 30 | unit test sync flush |
| **L4** E2E spec write 5 strokes → click Esci → reopen → assert strokes restored | P0 | 30m | `tests/e2e/05-esci-persistence.spec.js` NEW | 60 | playwright run |

### Mandate 9 — HomePage NO emoticon + mascotte + crediti Teodora

**Status iter 35-36**: 
- Mascotte robottino LIVE prod ✅ (iter 35 carryover)
- Crediti Teodora SHIPPED ✅ (iter 36 A0 commit f76e4e5)
- ModalitaSwitch 4 emoji → SVG SHIPPED ✅ (iter 36 A1 commit pending push)

Remaining emoticons HomePage:
- 3 cards: ⚡ Lavagna + 📚 Tutor + 🧠 UNLIM
- 1 footer: 🐒 Chi siamo

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **M1** Replace 3 cards emoji ⚡📚🧠 with /impeccable-designed SVG (Lightning/Books/Brain custom Navy/Lime palette) | P0 | 2h | `HomePage.jsx` cards array + `ElabIcons.jsx` 3 NEW SVG | 100 | visual Chrome MCP |
| **M2** Replace 🐒 Chi siamo with SVG monkey OR remove | P1 | 15m | `HomePage.jsx:758` | 5 | visual verify |

### Mandate 10 — Modalità Percorso = vecchia Libero + 2 window sovrapposte

**Andrea**: "Percorso deve corrispondere alla vecchia modalità libero ma ora ci sono 2 window sovrapposte".

Architettura nuova:
- Empty canvas (come vecchia Libero)
- Floating window 1: UNLIM panel (chat + voice + INTENT dispatch)
- Floating window 2: Percorso lesson panel (capitolo + classe context Morfismo Sense 1.5)

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **N1** Percorso mode entry: clearAll canvas (riusa logica Libero) + open 2 FloatingWindow | P1 | 1.5h | `LavagnaShell.jsx:handleModalitaChange` percorso branch | 80 | visual verify |
| **N2** PercorsoPanel scaffold: lesson context placeholder | P1 | 1h | `lavagna/PercorsoPanel.jsx` (NEW or extend) | 60 | render |
| **N3** UNLIM panel positioning + z-index coordination con PercorsoPanel | P1 | 1h | `lavagna/GalileoAdapter.jsx` + CSS | 30 | drag without overlap |

### Mandate 11 — HomePage Glossario only

**Andrea**: "metti anche il glossario, ma solo glossario nella home page".

Interpretation: aggiungi card Glossario su HomePage (4° section) — link a https://elab-tutor-glossario.vercel.app o route interno.

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **O1** Add Glossario card 4° section HomePage CARDS array | P0 | 30m | `HomePage.jsx:CARDS` | 30 | visual verify |
| **O2** Glossario route external (target=_blank) OR internal `#glossario` mount embed | P0 | 30m | HomePage onActivate handler | 10 | click verify |
| **O3** Custom Glossario SVG icon via /impeccable | P0 | 30m | `ElabIcons.jsx` NEW | 30 | visual |

### Mandate 12 — Multiprovider setup 1 workflow

**Source**: ADR-029 LLM_ROUTING_WEIGHTS Mistral 70 / Gemini 20 / Together 10 (iter 37 ACCEPTED). Marketing PDF Caso B Hybrid Mistral primary.

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **P1** Verify LLM_ROUTING_WEIGHTS env config Supabase secrets | P0 Andrea | 5m | env | — | `npx supabase secrets get` |
| **P2** Document multiprovider setup 1 in handoff doc | P0 | 30m | `docs/handoff/2026-05-04-multiprovider-setup-1.md` NEW | — | doc complete |
| **P3** Add canary monitoring telemetry per provider hit rate | P1 | 1h | `unlim-chat/index.ts` telemetry surface | 30 | log verify |

### Mandate 13 — SVG sostitutivi emoticon più belli (impeccable)

**Andrea**: "fai svg sostitutivi delle emoticon molto più belle usa impeccable".

Apply to:
- HomePage 3 cards icons (⚡📚🧠) — design custom SVG via /impeccable:bolder + /impeccable:colorize
- Footer 🐒 Chi siamo
- 4 ModalitaSwitch icons — already SVG via existing ElabIcons (could enhance via /impeccable:bolder)

| Atom | Priority | Time | File | LOC | CoV |
|---|---|---|---|---|---|
| **Q1** /impeccable:bolder design 3 NEW SVG icons HomePage cards (Lightning + Books + Brain Navy/Lime) | P0 | 2h | `ElabIcons.jsx` | 100 | visual Chrome MCP |
| **Q2** /impeccable:bolder enhance 4 ModalitaSwitch icons (Book + Footsteps + Circuit + Palette) | P1 | 1.5h | `ElabIcons.jsx` | 60 | visual |
| **Q3** Footer 🐒 SVG monkey via /impeccable:polish | P1 | 30m | `HomePage.jsx` | 30 | visual |

---

## §2 Dependency graph

```
Andrea ratify queue (D1 env enable + Edge Function deploy)
   ├── E1+E2+E3+E4+E5 effective LIVE
   ├── J1+J2 Percorso context inject
   └── P1+P3 multiprovider canary monitoring

HomePage refactor (no Edge dep)
   ├── M1+Q1 emoji cards → SVG impeccable bolder
   ├── O1+Q3 Glossario card + SVG
   ├── I1-I4 Cronologia UI polish
   └── F1 Wake word diagnostic UI badge

Lavagna refactor (no Edge dep)
   ├── G1-G4 Libero TRUE clear (event dispatch + ComponentDrawer scope)
   ├── H1-H3 Lavagna section solo (data-elab-mode="lavagna-solo")
   ├── K1-K4 Passo Passo dedup + resizable
   ├── L1-L4 Esci persistence beforeunload + E2E
   └── N1-N3 Percorso 2-window overlay

Wake word audit (low risk)
   └── F1-F4 wake word state + diagnostic + browser audit + WAKE_PHRASES varianti

J1-J4 Percorso adaptive Morfismo Sense 1.5 (defer iter 37+ complex)
```

## §3 ROI matrix iter 36 P0 (~7-9h dev + Andrea ratify)

| # | Atom | LOC | Time | Risk | Value | Score lift |
|---|---|---|---|---|---|---|
| **A0** Footer credits | 8 | done | Low | Med | +0.02 ✅ |
| **A1** ModalitaSwitch SVG | 30 | done | Low | High | +0.05 ✅ |
| **E1** maxOutputTokens 350 | 5 | 10m | Low | High | +0.10 |
| **E2** Cap categories Andrea-tuned | 30 | 30m | Low | High | +0.10 |
| **E3** BASE_PROMPT v3.3 paletti | 50 | 30m | Low | High | +0.10 |
| **G1+G2+G3** Libero TRUE clear | 70 | 1.5h | Med | High | +0.10 |
| **L2+L3** Esci beforeunload | 30 | 1h | Low | High | +0.05 |
| **L4** E2E persistence spec | 60 | 30m | Low | Med | +0.02 |
| **O1+O3** Glossario card + SVG | 60 | 1h | Low | High | +0.05 |
| **M1+Q1** HomePage cards SVG impeccable | 100 | 2h | Med | High | +0.10 |
| **I1+I4** Cronologia verify + plurale empty state | 15 | 30m | Low | Med | +0.02 |
| **G4** E2E lavagna libera empty spec | 50 | 30m | Low | Med | +0.02 |
| **F1+F2+F3+F4** Wake word diagnostic | 90 | 1.5h | Low | Med | +0.05 |
| **H1+H2** Lavagna section solo | 60 | 1h | Med | Med | +0.05 |
| **D1** Andrea ratify queue close | — | Andrea 10m | — | High | LIVE prod |

**Total iter 36 P0**: ~7-9h dev + Andrea ratify queue. Target score 8.40 → **8.65-8.85/10 ONESTO** (cap mechanical G45, NO inflate >9.0 senza Opus indipendente review).

## §4 P1 defer iter 37 (~5-7h)

- K1-K4 Passo Passo dedup + resizable (3h)
- N1-N3 Percorso 2-window overlay (2-3h)
- M2 Footer 🐒 SVG monkey (15m)
- Q2 ModalitaSwitch icons enhance via impeccable bolder (1.5h)
- Q3 Footer SVG monkey impeccable polish (30m)
- I2+I3 Cronologia full polish + Edge backfill (2h)
- F1 Wake word diagnostic badge full impl (1h, partial iter 36)

## §5 P2 defer iter 38+ (~4-8h)

- J1-J4 Percorso adaptive Morfismo Sense 1.5 detailed wire (4h, complex context+memory architecture)
- H3 Lavagna solo focus pen tool default (30m)
- N1-N3 Percorso 2-window full integration (2-3h)
- Sprint U Cycle 2 fix L2 router catch-all (1.5h)

## §6 CoV gates per atom (mandate)

Each atom MUST:
1. **Pre-edit baseline**: vitest snapshot 13774 PASS + git status clean
2. **Edit**: surgical change, file ownership respected
3. **Build PASS**: `npm run build` exit 0
4. **Vitest baseline preserved**: 13774 PASS minimum, ZERO regression
5. **Visual verify**: Chrome MCP screenshot dev preview server before/after
6. **E2E spec** (where applicable): Playwright spec PASS
7. **Commit**: pre-commit hook quick regression PASS
8. **Push origin**: pre-push hook PASS

## §7 Pattern S r3 5-agent OPUS PHASE-PHASE (where applicable)

For complex multi-file atoms (J1-J4 Percorso adaptive, M1+Q1 HomePage SVG, K1-K4 Passo Passo refactor):
- Phase 1: 4-agent parallel (planner + architect + maker + tester) rigid file ownership disjoint
- Phase 2: scribe sequential post 4/4 completion msgs filesystem barrier
- Phase 3: orchestrator commit + push + alias swap

Race-cond fix VALIDATED 10× consecutive (iter 5 P1+P2, iter 6 P1, iter 8 r2, iter 11, iter 12 r2, iter 19, iter 36, iter 37, iter 38, iter 39, **iter 36+ this**).

## §8 Anti-pattern G45 enforced iter 36-38

- NO claim "Sprint T close achieved" senza Opus indipendente review G45 mandate (cap finale 9.0/10 ONESTO realistic iter 41-43, NOT iter 36-38 single-shot)
- NO claim "UNLIM longer responses LIVE" senza Edge Function deploy + R5 verify
- NO claim "Esci fixed" senza E2E spec + LIVE prod verify post-deploy
- NO claim "Lavagna libera empty" senza E2E + visual Chrome MCP verify
- NO claim "Percorso adaptive Morfismo Sense 1.5 LIVE" senza context wire + bench
- NO `--no-verify` (pre-commit + pre-push hooks rispettati)
- NO push diretto main (e2e-bypass-preview branch + Vercel preview alias)
- NO destructive ops (force-push solo per scrub secret, NO main reset)
- NO compiacenza (15+ caveat outstanding tracked)

## §9 Hidden risks identified

1. **PWA SW cache**: post-deploy users may serve old chunks → A12 UpdatePrompt iter 38 should fire prompt
2. **Edge Function deploy gates**: Andrea SUPABASE_ACCESS_TOKEN required (env enable + Edge deploy v81+)
3. **Supabase RLS**: Cronologia descriptions table needs RLS check for class_key access
4. **F1 Esci deploy verify**: if not LIVE prod yet, persistence bug persists (audit deploy state)
5. **Morfismo Sense 1.5 context payload size**: large memory injection may exceed Edge function 8s timeout → defer J1-J4 iter 37+
6. **Wake word browser support**: Firefox/Safari NOT supported → fallback OR Chrome/Edge requirement banner
7. **mix-blend-mode + drop-shadow + SVG filter chain**: complex composition rules — verify cross-browser
8. **PercorsoCapitoloView resize**: CSS `aside complementary 25%` may not respond to drag handle without flex/grid re-layout
9. **HomePage `:has()` selector**: Chrome 105+/Safari 15.4+/Firefox 121+ — older browsers fallback overflow:hidden

## §10 Score G45 cap mechanics

- Iter 36 entrance baseline: **8.40/10** (post iter 35 carryover close)
- Iter 36 P0 atoms target lift: **+0.25-0.45** (cap 8.85)
- Iter 37 P1 atoms target lift: **+0.10-0.20** (cap 9.0)
- Iter 38 P2 atoms target lift: **+0.10-0.15** (cap 9.15)
- Sprint T close gate: Andrea Opus G45 indipendente review (cap finale 9.0-9.5 ONESTO realistic iter 41-43)

## §11 Multiprovider setup 1 architecture

**Per ADR-029 ACCEPTED iter 37**:
- Mistral 70% (primary, EU France GDPR-clean, Voxtral TTS + Pixtral Vision + Mistral LLM)
- Gemini 20% (Frankfurt EU, Vision fallback)
- Together 10% (US gated, anonymized, batch-only)

**Hedged Mistral primary** (iter 41 Phase A shipped, env-gated `ENABLE_HEDGED_LLM=true`):
- Parallel Mistral + Gemini call
- Whichever returns first wins
- Latency lift -600-1100ms p95 typical

**Fallback chain** (`callLLMWithFallback` iter 3 ralph wired):
- RunPod (Path A decommissioned iter 5 P3) → SKIP
- Gemini Frankfurt
- Together AI (gated `canUseTogether` truth-table 8 cases + anonymizePayload + audit log)

**Canary monitoring**:
- `prompt_class` telemetry surfaced unlim-chat response (iter 37 A2 ENABLE_ONNISCENZA conditional classifier)
- Provider hit rate via response metadata `model_used`
- Audit log `together_audit_log` Supabase table

## §12 SVG icons impeccable redesign (Mandate 13)

**Andrea explicit**: "fai svg sostitutivi delle emoticon molto più belle usa impeccable".

**Approach**: Apply `/impeccable:bolder` + `/impeccable:colorize` (Navy #1E4D8C / Lime #4A7A25 palette ELAB) + `/impeccable:polish` for refinement.

**Targets**:
1. **HomePage 3 cards** (P0): ⚡ Lavagna → custom Lightning bold Navy + Lime accent / 📚 Tutor → custom Books stack Navy / 🧠 UNLIM → custom Brain Navy + Lime synapses
2. **HomePage Glossario card** (P0): 📖 → custom Glossary book with magnifying glass
3. **HomePage Cronologia card** (P1): clock/history icon
4. **ModalitaSwitch 4 icons** (P1 enhance): existing ElabIcons could be more bold/refined
5. **Footer 🐒** (P1): SVG monkey OR remove

## §13 Files touched (file ownership matrix)

| File | Owner | Atoms |
|---|---|---|
| `src/components/HomePage.jsx` | M1+O1+I4+H1+M2+Q1+Q3 | iter 36 P0 |
| `src/components/HomeCronologia.jsx` | I1-I4 | iter 36 P0+P1 |
| `src/components/common/ElabIcons.jsx` | M1+Q1+Q2+O3 | iter 36 P0+P1 |
| `src/components/lavagna/LavagnaShell.jsx` | G1-G3+H2+K1+N1 | iter 36-37 |
| `src/components/lavagna/PercorsoCapitoloView.jsx` | K2+K3 | iter 37 P1 |
| `src/components/lavagna/PercorsoPanel.jsx` | N2+J3 | iter 37+ |
| `src/components/lavagna/GalileoAdapter.jsx` | N3 | iter 37 |
| `src/components/simulator/panels/ComponentDrawer.jsx` | G2+G3 | iter 36 P0 |
| `src/components/simulator/canvas/DrawingOverlay.jsx` | L2+L3 | iter 36 P0 |
| `src/services/wakeWord.js` | F4 | iter 36 P0 |
| `src/components/common/MicPermissionNudge.jsx` | F1 | iter 36 P0 |
| `supabase/functions/_shared/llm-client.ts` | E1 | iter 36 P0 |
| `supabase/functions/_shared/onniscenza-classifier.ts` | E2 | iter 36 P0 |
| `supabase/functions/_shared/system-prompt.ts` | E3+J2 | iter 36 P0 |
| `supabase/functions/unlim-chat/index.ts` | J1+P3 | iter 37 P1 |

## §14 Andrea ratify queue iter 36 entrance (Andrea action ~10-15min)

1. ENABLE_CAP_CONDITIONAL=true Supabase secret (UNLIM longer responses LIVE)
2. ENABLE_L2_CATEGORY_NARROW=true Supabase secret (R7 lift Mistral function calling)
3. ENABLE_HEDGED_LLM=true + ENABLE_HEDGED_PROVIDER_MIX=true (latency -600-1100ms p95)
4. ENABLE_ONNISCENZA=true Supabase secret (memory aggregator 7-layer LIVE)
5. CANARY_UI_DISPATCH_PERCENT=5 + INCLUDE_UI_STATE_IN_ONNISCENZA=true (canary rollout)
6. Edge Function unlim-chat deploy v81+ (BASE_PROMPT v3.3 + atoms E1-E3 LIVE)
7. R5+R6+R7 re-bench batch post env enable (latency + canonical % delta vs iter 38 baseline)

## §15 Cross-link docs iter 36

- Plan questo: `docs/superpowers/plans/2026-05-04-iter-36-38-andrea-12-mandate-master-plan.md`
- Iter 35 carryover handoff: `docs/handoff/2026-05-04-iter-35-carryover-close-handoff.md`
- Audit iter 35 close: `.team-status/QUALITY-AUDIT-2026-05-04.md`
- ADR-029 LLM_ROUTING_WEIGHTS: `docs/adrs/ADR-029-llm-routing-weights-conservative-tune.md`
- ADR-041 Onnipotenza Expansion: `docs/adrs/ADR-041-onnipotenza-expansion-ui-namespace-l0b.md`
- ADR-042 Onniscenza UI snapshot: `docs/adrs/ADR-042-onniscenza-ui-state-snapshot-integration.md`

---

*Master plan v1.0 — Andrea Marro + Claude inline ultrathink 2026-05-04 PM*
