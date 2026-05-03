# Agent D Cross-cutting iter 31 ralph 18 Phase 0 Atom 17.4 — COMPLETED

**Date**: 2026-05-03
**Agent**: Agent D (cross-cutting concerns ownership)
**Plan ref**: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §2 Phase 0 Atom 17.4
**Status**: ✅ COMPLETED — read-only audit shipped

## Deliverable

`docs/audits/2026-05-03-onnipotenza-ui-audit-cross-cutting.md` (~190 LOC, 6 sezioni)

## Summary

7 cross-cutting concerns audited file:line verified:

1. **Modalità 4 switch** — 5 surface points (4 mode tabs + persistence localStorage `elab-lavagna-modalita` + passo-passo close → percorso)
2. **Lesson-paths navigate** — 5 voice primitives (next/prev experiment, next/prev step, mountCircuit) + URL deep-link `?exp=` + 2 GAPS (restart, markStepDone)
3. **Cronologia ChatGPT-style** — 4 actual elements (sidebar container + history item click + new chat + 4 buckets) + 3 GAPS (search, delete, export)
4. **Voice (wake + STT + TTS)** — wake word toggle (start/stop/check 3 APIs) + 36+ voiceCommands actions enumerated + TTS playback Promise + 4 GAPS (volume, skip, replay, push-to-talk mode)
5. **Keyboard shortcuts** — 5 per-component listeners verified (Esc close modal, Enter submit, Tab focus trap, Enter/Space breadcrumb activation) + 6 GAPS (Ctrl+Z/Y/S/A global, Space play/pause, F-keys)
6. **Routing hash + back/forward** — `VALID_HASHES` 13 entries + deep-link `?exp=` + dashboard params + hashchange + popstate sync + DOC DRIFT FLAG `#chatbot-only` + `#about-easter` NOT in whitelist
7. **Persistence** — saveSessionSummary + saveContext/loadContext Supabase + getLastLesson + resetMemory (DESTRUCTIVE) + syncWithBackend + stopSync + _autoSave (no toggle gap) + 3 localStorage keys (modalita + anon_uuid + class_key)

## Interactive elements count

~50 surface points enumerated (cross-cutting realistically smaller than per-component audits since these concerns SPAN components).

## DESTRUCTIVE-CANDIDATE flagged (per ADR-036 §3 confirmation gate)

- `clearCircuit` (voiceCommands.js:140)
- `resetMemory` (unlimMemory.js:182)
- Cronologia delete session (gap, NEW)
- `stopSync` (semi-destructive autosave interrupt)

## Honesty caveats critical

1. PII boundary: `elab_class_key` flow NEVER autofill via L0b voice
2. autosave toggle GAP (no user-facing control)
3. 36+ voice actions ≠ 12 INTENT whitelist (separate surfaces, ADR-036 unify)
4. #chatbot-only + #about-easter NOT in `VALID_HASHES` (HomePage iter 36 ADR-028 amend) — DOC DRIFT FLAG
5. GAPs enumerated for ADR-036 NEW API L0b namespace `__ELAB_API.ui.*` + `__ELAB_API.voice.*` (NOT current bugs)
6. NO src/test/supabase modifications, NO commits, NO `--no-verify` — compliant Phase 0 Atom 17.4 read-only mandate
7. NO compiacenza, NO inflate

## Cross-link

- Plan §2 Phase 0 Atom 17.4
- Companion audits 17.1 (Lavagna 62) + 17.2 (Simulator) + 17.3 (Tutor+UNLIM, Agent C)
- ADR-036 + ADR-037 entrance Phase 1 iter 18-19
