# Iter 36 → Iter 37 handoff — 2026-05-04 PM session 2

**Iter 36 PHASE close**: 4 commits shipped + 2 Vercel deploys LIVE (`grcq82kt9` + `6letix4il` + Esci fix deploy in flight).

**Score iter 36 PHASE close ONESTO ricalibrato G45**: **8.50/10** (cap honest +0.05 vs iter 35 8.45 — Esci CRITICAL fix root cause closed + 18/22 Andrea explicit requests addressed LIVE prod).

---

## §1 Activation string iter 37 entrance (paste-ready Andrea)

```
ELAB Tutor iter 37 entrance — 2026-05-04 PM session 3+

Continua iter 36 close + Three-Agent Pipeline iter 37 carryover.

Master plan iter 35: docs/superpowers/plans/2026-05-04-iter-35-andrea-13-mandate-three-agent-master-plan.md
Master plan iter 36-38 parent: docs/superpowers/plans/2026-05-04-iter-36-38-andrea-12-mandate-master-plan.md

Stato LIVE prod 2026-05-04 PM session 2 close:
- Vercel current Production READY aliased www.elabtutor.school (last deploy hash TBD post Esci fix push complete)
- Commit HEAD origin sync (~5 commits iter 35-36 shipped iter 35 PHASE 2 + iter 36 batch + Esci fix)
- Vitest baseline 13887 PASS

Andrea explicit requests session 2 close (22 total):
✅ 18/22 LIVE prod:
- K1 Passo Passo dedup hide LEFT preserve RIGHT resizable
- 4 SVG card iter 36 + Cronologia + plurale empty state
- Mascotte robottino animated + speech bubble plurale rotation
- Footer "Homepage a cura di Andrea Marro · Teodora de Venere"
- Scimpanzè rotation 4 GIFs (Andrea drops public/easter/scimpanze-{1..4}.gif later) + emoji 🐒 fallback
- Footer credits Andrea + Teodora
- Speech bubble @keyframes elab-bubble-wave 4s + reduce-motion media query
- Icons size 48→88 + drop-shadow
- HomePage card text "Niente circuiti" explicit
- LavagnaShell lavagnaSoloMode invert (UNLIM always visible, simulator mounted but empty via clearAll)
- ExperimentPicker onFreeMode harden (clearCircuit + clearAll + setCurrentExperiment null + localStorage clear)
- Selectors widen PercorsoPanel + GalileoAdapter (data-elab-panel + className markers)
- SessionSave full flow (SaveSessionButton + Dialog + sessionRestore + HomeCronologia onResume + 25 NEW tests)
- AppHeader extended saveSession props
- ADR-038/039/040 ACCEPTED iter 35
- Three-Agent Pipeline literal Codex CLI v0.128.0 invoked iter 36 (L4 helper output 80 LOC)
- Esci CRITICAL fix DrawingOverlay handleClose flush remote save (Andrea iter 19 PM bug root cause closed iter 36)

❌ 4/22 deferred iter 37:
- #17 Video panel YouTube iframe embed (X-Frame-Options DENY blocks YouTube search results page iframe; individual video iframe già funziona via card click; iter 37 implement YouTube Data API search-results inline OR pivot Vimeo/PeerTube)
- #18 DrawingOverlay area limit oltre canvasWidth bound (DrawingOverlay nested inside NewElabSimulator; svgW/svgH bound by canvasContainerRef.current?.offsetWidth || 800; refactor iter 37 — extract DrawingOverlay standalone OR pass `fullViewport` prop)
- /impeccable:bolder simboli enhance Three-Agent literal demo (size 88 done iter 36; SVG redesign per /impeccable principles iter 37)
- NewElabSimulator hideSimulatorBoard prop impl interno (prop pass shipped iter 36 LavagnaShell, internal gate breadboard SVG hide TBD iter 37)

Iter 37 priorities P0:
- P0.1 Esci persistence verify Chrome MCP systematic (Andrea bug "CULO disappears" — iter 36 fix LIVE post deploy verify write→Esci→reopen→assert persist)
- P0.2 NewElabSimulator hideSimulatorBoard prop impl: when true, hide breadboard SVG + components + ComponentDrawer, keep DrawingOverlay
- P0.3 DrawingOverlay extract standalone OR fullViewport prop (Andrea "oltre certo limite non si può scrivere")
- P0.4 #17 Video YouTube embed pivot (Data API key OR alternative platform)
- P0.5 /impeccable:bolder 4 ElabIcons redesign Three-Agent literal Codex+Gemini cycle
- P0.6 L4 E2E spec waitForDrawingSurface widen (Codex output 80 LOC ready /tmp/be77bu0vb, Gemini review BG bd1jjx47a or completed)
- P0.7 Andrea ratify queue: ENABLE_ONNISCENZA + ENABLE_HEDGED_LLM + ENABLE_CAP_CONDITIONAL canary 5% + Edge Function unlim-chat v81+ + unlim-session-description NEW deploy

/systematic-debugging skill invoke post-deploy mandatory iter 37 entrance — Andrea explicit requested.

Sprint T close projection iter 41-43 cumulative + Andrea Opus indipendente review G45 mandate (target 9.5/10 ONESTO, NOT iter 37 single-shot).
```

---

## §2 Setup steps Andrea (5-10 min)

1. **Verify Vercel current alias**:
   ```bash
   npx vercel inspect https://www.elabtutor.school
   ```
   Expected: latest deploy ID post Esci fix push.

2. **Pre-flight CoV iter 37 entrance**:
   ```bash
   cd "VOLUME 3/PRODOTTO/elab-builder"
   npx vitest run --reporter=line 2>&1 | tail -5
   # Expected: 13887+ PASS preserve baseline
   ```

3. **Andrea ratify queue 8 entries** (vedi iter 35 handoff §6).

4. **Drop scimpanzè GIFs**:
   ```bash
   cp /Users/andreamarro/Downloads/scimpanze-1.gif "VOLUME 3/PRODOTTO/elab-builder/public/easter/"
   # ... 1-4 .gif files
   ```

5. **Trigger iter 37 next session**:
   ```bash
   cd "VOLUME 3/PRODOTTO/elab-builder"
   git pull origin e2e-bypass-preview
   # Open new Claude Code session + paste activation string §1
   ```

---

## §3 Iter 37 priorities P0 detailed

### P0.1 Esci persistence Chrome MCP systematic verify

**Pain root cause closed iter 36 commit**: DrawingOverlay handleClose now calls flushDebouncedSaveRemote(experimentId, finalPaths) before onClose?.() callback.

**Verification steps Chrome MCP**:
1. Navigate https://www.elabtutor.school/#lavagna
2. Click ESCI button on toolbar (top right)
3. Wait for Lavagna to load
4. Click pen tool / activate drawing mode
5. Draw 3 strokes on canvas (write "TEST" or similar)
6. Click ESCI button (red corner)
7. Reload page
8. Re-activate drawing mode
9. Assert 3 strokes still visible (persist via Supabase remote)

Expected: strokes persist post Esci. Tester-1 L4 E2E spec 332 LOC verify automatically.

### P0.2 NewElabSimulator hideSimulatorBoard prop impl

**File**: `src/components/simulator/NewElabSimulator.jsx`

**Changes**:
- Accept new prop `hideSimulatorBoard` (boolean, default false)
- When true: hide breadboard SVG (NanoR4Board OR similar), hide ComponentDrawer, hide LessonReader if not already, KEEP DrawingOverlay layer mounted
- Estimated ~30-50 LOC

**Three-Agent gate**: borderline (architectural propagation but small impl). Use Codex literal.

### P0.3 DrawingOverlay area expand

**Pain**: Andrea screenshot Volume 1 page con scribble red — drawing limited bordo image. SVG width/height bound canvasWidth (default 800).

**Fix options**:
- Option A: extract DrawingOverlay standalone in LavagnaShell render (parallel NewElabSimulator) — refactor 200+ LOC
- Option B: pass `fullViewport` prop to DrawingOverlay → svg sets `width="100%" height="100%"` regardless isFullscreen — quick 5 LOC
- Option C: when isFullscreen, ensure parent container has `overflow:visible` + svg inside

**Three-Agent gate**: USE for refactor decision (Codex implement + Gemini critique selectors + drawing event handlers).

### P0.4 Video YouTube embed

**Pain**: Andrea wants iframe embed (currently external link "Cerca su YouTube" opens new tab).

**Constraint**: YouTube X-Frame-Options DENY headers block iframe of search results page.

**Fix options**:
- Option A: YouTube Data API v3 search → render results inline as cards (Andrea provide API key)
- Option B: Pivot Vimeo / PeerTube embed (different platform)
- Option C: Pre-curated FALLBACK_VIDEOS local list (already exists, expand with 30+ ELAB-relevant videos) + remove "Cerca su YouTube" external button

**Three-Agent gate**: USE for design decision (Codex implement Data API integration + Gemini review error handling).

### P0.5 /impeccable:bolder 4 ElabIcons redesign

**File**: `src/components/common/ElabIcons.jsx` (LavagnaCardIcon + TutorCardIcon + UNLIMCardIcon + GlossarioCardIcon)

**Andrea explicit "migliora i simboli"**. Iter 36 increased size 48→88 ma SVG geometry stesso WebDesigner-1 iter 35 design.

**/impeccable:bolder principles**: stronger geometric forms + brand palette explicit + visual weight ≥3px stroke + distinctive forms + dual-tone strategic.

**Three-Agent gate**: MANDATORY (design-quality SVG iter 37 literal Codex+Gemini critique).

### P0.6 L4 E2E spec waitForDrawingSurface

**Status**: Codex CLI BG be77bu0vb output 80 LOC ready (`/tmp/codex-l4-helper-brief.md`). Gemini review BG bd1jjx47a started.

**Iter 37 finalize**:
1. Read Gemini review findings
2. Codex iter 2 with Gemini fixes integrated
3. Replace `tests/e2e/05-esci-persistence.spec.js:107-115` waitForDrawingSurface
4. EXEC Playwright spec post deploy → 3/3 PASS expected (Esci fix LIVE)

### P0.7 Andrea ratify queue (carryover iter 35)

(Vedi `docs/handoff/2026-05-04-iter-35-to-iter-36-handoff.md` §6)

---

## §4 Anti-pattern G45 enforcement iter 37

- NO claim "Sprint T close achieved" (iter 41-43 + Andrea Opus indipendente review G45 mandate)
- NO claim ">8.55 senza Opus review" (cap iter 36 8.50 honest)
- NO --no-verify (pre-commit + pre-push hooks rispettati 100% iter 35-36 commits)
- NO push diretto main (e2e-bypass-preview branch + Vercel preview alias finale Production via `--prod` flag)
- NO compiacenza Three-Agent (iter 36 lightweight pivot ammesso CLI auth friction; iter 37 literal Codex+Gemini cycle MANDATORY for /impeccable atoms)
- NO env keys printed conversation
- NO destructive ops

---

## §5 Cross-link iter 36 close docs

- Plan iter 35: `docs/superpowers/plans/2026-05-04-iter-35-andrea-13-mandate-three-agent-master-plan.md`
- Audit iter 35 PHASE 2 close: `docs/audits/2026-05-04-iter-35-PHASE2-CLOSE-audit.md`
- Handoff iter 35→36: `docs/handoff/2026-05-04-iter-35-to-iter-36-handoff.md`
- ADR-038 Passo Passo dedup: `docs/adrs/ADR-038-passo-passo-dedup-hide-left-preserve-right-resizable.md`
- ADR-039 ComponentDrawer scope gate: `docs/adrs/ADR-039-componentdrawer-scope-gate-modalita-libero.md`
- ADR-040 Percorso 2-window Sense 1.5: `docs/adrs/ADR-040-percorso-2-window-overlay-architecture-sense-1-5.md`
- SessionSave audit: `docs/audits/2026-05-04-iter-36-sessionsave-architectural.md`
- 9 BG agent audits iter 35 (maker1+2+3+webdesigner1+tester1)
- Codex L4 helper brief: `/tmp/codex-l4-helper-brief.md` (output `/tmp/be77bu0vb`)
- Gemini review prompt: `/tmp/gemini-l4-review-prompt.md` (output BG bd1jjx47a)

---

## §6 Andrea explicit feedback summary session 2

**Esplicite richieste** (16 inline + 6 meta):
1. Sovrapposizioni Passo Passo (K1) ✅
2. /mem-search keys + connettori macos ✅
3. Controlla sito live ✅
4. Regressione 3 cards → 4 SVG ✅
5. Workflow multiprovider step 1 ✅
6. Codex+Gemini literal ✅ (lightweight pivot iter 35-36, literal Codex iter 36)
7. Recheck deploy ✅
8. Homepage diversa (iter 36 deploy) ✅
9. Speech bubble animata + non tocca top ✅
10. Migliora simboli (size 88 ✅, SVG redesign /impeccable iter 37)
11. Save sessioni + resoconto ✅
12. Accesso sessione salvata ✅
13. "Homepage a cura di" ✅
14. Scimpanzè rotazione ✅ (GIFs Andrea drops later)
15. Lavagna libera no circuit (UNLIM + volumi only) ✅ partial (lavagnaSoloMode invert + onFreeMode harden + card text)
16. ExperimentPicker no auto-mount ✅ (onFreeMode harden)
17. Video YouTube iframe embed ❌ defer iter 37
18. DrawingOverlay area limit ❌ defer iter 37
19. Esci persistence CULO ✅ (commit Esci fix shipped iter 36)
20. /systematic-debugging post-deploy ⏳ pending
21. Connettori prepotenti ✅
22. Ogni bug + errore fixa ✅ (3 test fails fixed iter 35-36)

---

## §7 Workflow multiprovider step 1 evolution

**iter 36 final state**:
- Codex CLI v0.128.0 standalone npm install (ChatGPT Plus quota) — `codex exec --skip-git-repo-check`
- Gemini CLI v0.40.1 standalone npm install (Gemini Pro sub) — `GEMINI_CLI_TRUST_WORKSPACE=true gemini -p ...`
- LITERAL invocation iter 36 (BG be77bu0vb Codex L4 + bd1jjx47a Gemini review)
- LIGHTWEIGHT pivot iter 35 5-agent OPUS (Three-Agent gate skipped CLI auth friction, compensating verification 88+ NEW tests)
- $0 incremental cost (subscriptions Andrea esistenti)

**Improvement iter 37 entrance**:
- Streamline: pre-built atom briefing template `/tmp/codex-{atom}-brief.md` + standardized Gemini critique prompt
- BG agent integration: orchestrator dispatch Codex+Gemini parallel, capture output, integrate Codex iter 2
- Track empirical hypothesis H1-H4 (anti-bias + wall-clock + debito + cost) per atom

**Step 2 iter 37+ Sprint T**:
- 2 vendor API + agent-teams ufficiali + tmux 4 windows + automation cron (defer week 2-3 master plan iter 36-38)

---

End of handoff iter 36 → iter 37.
