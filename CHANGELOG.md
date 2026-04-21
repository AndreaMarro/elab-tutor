## [Sprint 1 sett-1-stabilize] — 2026-04-26

### Added
- T1-003 Render cold start warmup cron 10min (src/services/renderWarmup.js + .github/workflows/render-warmup.yml)
- Vision E2E test extended +2 specs (5/5 PASS live)
- LLM switch Gemini → Together AI (llm-client.ts unified dispatcher, 20/20 PZ v3)
- Playwright E2E scaffold 12 specs (31 tests)
- CLI autonomous loop-forever.sh + 9 scripts (stress-test, baseline-snapshot, end-week-gate, rollback, ecc)
- ADR-001 Supabase ref canonical, ADR-002 Gemini→Together, ADR-003 JWT 401 edge auth
- Dashboard scaffold WCAG AAA a11y (contrast #475569 7.56:1)
- verify-edge-function.sh + verify-llm-switch.sh + verify-volume-parity.sh

### Fixed
- T1-001 Lavagna toggleDrawing stale closure (useRef pattern)
- T1-002 Whiteboard persistenza sandbox + auto-save 5s
- T1-009 Tea autoflow CODEOWNERS + GH Action auto-merge
- BLOCKER-001 JWT 401 Edge Function CLI curl (SUPABASE_ANON_KEY pattern)
- BLOCKER-002 velocity tracking Day 03+04 backfill

### Changed
- LLM provider default: Together AI Llama 3.3 70B Turbo (Gemini fallback)
- Supabase canonical ref `euqpdueopmlllqjmqnyb` verified via MCP

### Metrics
- Tests: 12116 → 12164 (+48)
- Benchmark: 2.77 → 3.95 (+1.18, target 6.0 miss -2.05)
- Auditor avg: 7.35/10 (trend 6.5 → 7.75)
- PZ v3 violations: 0
- Engine semantic diff: 0
- Commits: 29 atomic

### Known issues (deferred sett-2)
- Dashboard routing not wired
- E2E spec target 14 (current 12, +2 debt)
- ADR-003 live verify pending SUPABASE_ANON_KEY env
- Product backlog gerarchico missing

---

# Changelog

## [Unreleased]

### Added
- **Fumetto Report wire-up Phase 1.5** (`src/components/lavagna/AppHeader.jsx` + `LavagnaShell.jsx`) — button "Fumetto" nel header + handler dynamic import → `UnlimReport.openReportWindow(expId)` (Regola 0 RIUSO del fumetto system esistente, NO duplicate con SessionReportComic MVP). Voice command integration: listener `elab-voice-command` action `createReport` → stesso handler. 5 unit tests AppHeader-fumetto CoV 3/3 PASS. Baseline 12098 → 12103 (+5). Zero npm dep (regola 13 preserved). Audit: `docs/audits/TASK-FUMETTO-WIRE-UP-audit.md`. (branch: feature/fumetto-wire-up)
- **Fumetto Report MVP** (`src/components/lavagna/SessionReportComic.jsx` + `experiment-photo-map.js`) — fine-sessione comic-style report: 6 vignette (3 completed + 3 placeholder "Prossimo esperimento") + narrazioni UNLIM in Principio Zero v3 ("Ragazzi, ..."). Export via `window.print()` browser native (zero npm dep). Responsive 3/2/1 col, WCAG AA (44px touch, focus ring, alt text), @media print/reduced-motion, palette ELAB Navy/Lime/Orange. 10 unit tests CoV 3/3 PASS. Baseline 12088 → 12098 (+10). Fallback gradient quando photo TRES JOLIE non importate. Docs: `docs/features/fumetto-report.md`. (branch: feature/fumetto-report-mvp)
- **Vision E2E v1** (`src/components/tutor/VisionButton.jsx` + `LavagnaShell` wire) — bottone "Guarda il mio circuito" in Lavagna top-right canvas. Click → `__ELAB_API.captureScreenshot()` → CustomEvent `elab-vision-capture` → `useGalileoChat.processVisionImages` (estratto da `handleScreenshot`, Regola 0 no-duplication) → `analyzeImage` (Supabase `unlim-chat` Edge Function, Gemini 2.5 Pro Vision). WCAG AA (44px touch, focus-visible orange ring, aria-label/aria-busy, prefers-reduced-motion). Principio Zero v3 verificato (no "Docente leggi" meta). 7 unit + 3 E2E PASS. Baseline 12081 → 12088. Docs: `docs/features/vision-e2e.md`. (branch: feature/vision-e2e-live)
- **Lesson Reader v1 complete** (`src/components/lavagna/LessonSelector.jsx` + `LessonReader.jsx`) — LessonSelector grid 27 lezioni Vol1/Vol2/Vol3, integrato in LavagnaShell come tab "Lezioni". 5+ lezioni Vol1 complete con citazioni dirette pagine volume. 8 test E2E Playwright CoV 3/3 PASS. Principio Zero v3 compliant. (PR: feature/lesson-reader-complete-v1 #3)
- **Lesson Reader MVP v0** (`src/components/lavagna/LessonReader.jsx`) — timeline narrativa capitolo con citazioni dirette dai volumi fisici ELAB. Riusa `lesson-groups.js` + `volume-references.js`. Principio Zero v3 compliant. 13 test unit. (PR: feature/lesson-reader-mvp #2)

### Fixed
- **CI governance-gate 403**: aggiunto blocco `permissions: pull-requests: write + issues: write` al workflow `.github/workflows/governance-gate.yml` per consentire comment PR da GitHub Action bot.

### Changed
- **Governance Regola 0** (`docs/GOVERNANCE.md`): da "MAI rewrite" a "Priorità al riuso. Rewrite OK quando giustificato" con requisiti espliciti (REWRITE-XXX.md + test equivalenti + baseline preservata + auditor APPROVE). Riflette principio Andrea 18/04: "FAI LA COSA MIGLIORE, SENZA OMETTERE".
