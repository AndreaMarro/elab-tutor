---
agent: architect-opus iter 31 ralph 19
phase: Phase 1 Atom 19.1
status: completed
date: 2026-05-03
to: orchestrator
---

# Architect-opus iter 31 ralph 19 Phase 1 Atom 19.1 — ADR-037 design completed

## Deliverable

- **File**: `docs/adrs/ADR-037-onniscenza-ui-state-snapshot-integration.md`
- **LOC**: ~415 (within ~400 LOC target plan §3 Atom 19.1)
- **Status**: PROPOSED (Andrea ratify Phase 4 — design only iter 19, deploy gated)

## 10 sections delivered

1. **§1 Context** — ADR-035 V2.1 base + Phase 0 audit absorption (302 UI elements + 7 cross-cutting categories) + GAP identified (no UI state context awareness in `aggregateOnniscenza`) + pari-passo ADR-036 motivation
2. **§2 Decision** — extend `aggregateOnniscenza` output schema with `ui` key (additive + backward compat env `INCLUDE_UI_STATE_IN_ONNISCENZA=false` default safe + frontend-sourced + cache-safe + privacy-respecting + bandwidth-bounded + stale-state protected)
3. **§3 UI state snapshot schema** — TypeScript `UIStateSnapshot` interface 8 fields (captured_at + route + mode + focused + modals[] + modalita + lesson_path_step + opened_panels[]) + per-field rationales
4. **§4 Wire-up flow** — frontend `__ELAB_API.ui.getState()` NEW method + `useGalileoChat.js` request body extension + Edge Function read+inject step + cache key extension `route|mode|modalita|lesson_path_step` low-entropy 4-tuple
5. **§5 BASE_PROMPT v3.3 extension** — Italian system prompt block ~250-350 tokens per turn + 4 use cases (inspection / modal resolution / no-op avoidance / context-coherent next action) + Mistral FC schema integration note (system prompt extension, not args schema change)
6. **§6 Bench protocol R8 NEW 100-prompt UI action context awareness** — 5 categories × 20 prompts (ui_state_inspection / ui_modal_resolution / ui_navigation_aware / ui_no_op_avoidance / ui_focus_aware) + scoring rubric (0.5 ui_acc + 0.3 pz_v3 + 0.2 no_hall) + targets ≥80% R8 + ≥V1 R5 + <100ms latency overhead p95 + bench runner spec
7. **§7 Decision matrix canary** — 3 exit paths (RAMP 25% / STAY canary 5% / REVERT) + quantitative thresholds rationale + 2 sample analyses (synthetic illustrative)
8. **§8 Risks + mitigations** — 10 risks tabulated (latency overhead / PII leak / bandwidth / stale race / token budget / cache hit rate / hallucination off-canary / stale closures / telemetry flood / DOC DRIFT VALID_HASHES)
9. **§9 Rollback plan** — env flip `INCLUDE_UI_STATE_IN_ONNISCENZA=false` immediate + properties (no DB schema changes / zero downtime / code preserved iter 22+) + audit log entry JSON schema + 4 post-revert iteration options
10. **§10 Cross-link** — ADR-035 base + ADR-036 parallel + Phase 0 4 audits + master plan iter 31 + ADR-019 Sense 1.5 + ADR-025 Modalità + ADR-028 §14.b + ADR-030 Mistral FC + canonical aggregator file:line refs (`onniscenza-bridge.ts:299` per iter 9 V2 caveat 1, NOT stale `state-snapshot-aggregator.ts`) + Anti-pattern enforced subsection

## Anti-pattern compliance

- ✅ NO claim "ADR-037 ACCEPTED" — PROPOSED status header
- ✅ NO override `ENABLE_ONNISCENZA=true` env — V1 active prod preserved (canonical aggregator `aggregateOnniscenza` UNCHANGED, ADR-037 extension is additive `ui` key + env-gated)
- ✅ NO inflate score — ADR-037 design contributes 0 production behavior iter 19, deferred §7 decision matrix
- ✅ NO write outside `docs/adrs/` + `automa/team-state/messages/` — only 2 files written this iter
- ✅ NO `--no-verify` — no commits this iter (orchestrator Phase 3)
- ✅ NO commit — orchestrator commits Phase 3 per task mandate
- ✅ Canonical aggregator reference confirmed `onniscenza-bridge.ts:299` (read iter 19 lines 1-80 + 280-380 verified 7-layer + RRF k=60 + Promise.all 200ms timeout + cache lookup); legacy `state-snapshot-aggregator.ts` not in `_shared/` (cross-link §10 explicit note)

## Next phase handoff

- **Phase 2 (iter 20-21)**: NL parser entrance integration — Maker-1 wire-up `__ELAB_API.ui.getState()` frontend + `useGalileoChat.js` request body extension + Edge Function read+inject + cache key extension. Gated Andrea ratify Phase 1 ADR-036 + ADR-037 entrance + env provision.
- **Phase 3 (iter 22+)**: canary 5% deploy + R8 bench runner author (~250 LOC modeled on R5/R7 runners) + R8 fixture 100 prompts authoring + R5 re-run baseline + latency overhead measure
- **Phase 4 (Andrea ratify)**: post R8 ≥80% + R5 stable + latency <100ms p95 PASS evidence → ramp 25%→100% per §7 decision matrix

No blocker for Phase 1 ADR-036 (parallel design iter 18-19, independent file ownership) — both ADRs PROPOSED status feed Andrea ratify queue Phase 4.
