# Changelog

## [Unreleased]

### Added
- **Lesson Reader v1 complete** (`src/components/lavagna/LessonSelector.jsx` + `LessonReader.jsx`) — LessonSelector grid 27 lezioni Vol1/Vol2/Vol3, integrato in LavagnaShell come tab "Lezioni". 5+ lezioni Vol1 complete con citazioni dirette pagine volume. 8 test E2E Playwright CoV 3/3 PASS. Principio Zero v3 compliant. (PR: feature/lesson-reader-complete-v1 #3)
- **Lesson Reader MVP v0** (`src/components/lavagna/LessonReader.jsx`) — timeline narrativa capitolo con citazioni dirette dai volumi fisici ELAB. Riusa `lesson-groups.js` + `volume-references.js`. Principio Zero v3 compliant. 13 test unit. (PR: feature/lesson-reader-mvp #2)

### Fixed
- **CI governance-gate 403**: aggiunto blocco `permissions: pull-requests: write + issues: write` al workflow `.github/workflows/governance-gate.yml` per consentire comment PR da GitHub Action bot.

### Changed
- **Governance Regola 0** (`docs/GOVERNANCE.md`): da "MAI rewrite" a "Priorità al riuso. Rewrite OK quando giustificato" con requisiti espliciti (REWRITE-XXX.md + test equivalenti + baseline preservata + auditor APPROVE). Riflette principio Andrea 18/04: "FAI LA COSA MIGLIORE, SENZA OMETTERE".
