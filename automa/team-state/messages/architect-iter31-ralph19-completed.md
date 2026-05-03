# Architect-opus iter 31 ralph 19 Phase 1 Atom 18.1 — COMPLETED

**Date**: 2026-05-03
**Iter**: iter 31 ralph iter 19 — Onnipotenza Expansion DEEP Phase 1 Atom 18.1
**Plan ref**: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §3.1
**Sprint T close target advanced**: 9.0/10 ONESTO post Onnipotenza expansion (plan §11 cascade)
**Agent**: Architect-opus iter 31 ralph 19 (subagent context-zero baseline G45 Opus iter 39 score 8.0)
**Mode**: normal (NOT caveman)

---

## §1 Deliverable shipped

**ADR-036 Onnipotenza Expansion `__ELAB_API.ui.*` namespace L0b + HYBRID selector + WHITELIST 12→~50**:

- File: `docs/adrs/ADR-036-onnipotenza-expansion-ui-namespace-l0b.md`
- LOC: **768** (target ~700, +68 over budget — justified by 12 sections + 50-method enumeration table + 8 risks table + Phase 0 cross-link 4 audits + 12.x impl block detailed file:line)
- Status: **PROPOSED** (NOT ACCEPTED auto-claim, Andrea ratify Phase 5 mandatory pre-canary)

---

## §2 12 sections summary (ADR-036)

1. **Context** — Phase 0 master enumeration **302 UI elements** (62 Lavagna + 95 Simulator + 95 Tutor+UNLIM + 50 cross-cutting) + 8 critical findings (ChatOverlay DOM hack + Simulator markers gap + 148 NEW Tutor markers + admin CRUD destructive + ManualTab/NotebooksTab/class destructive + ElabTutorV4 legacy + clearCircuit/resetMemory/Cronologia delete + App.jsx VALID_HASHES gap)
2. **Decision** — NEW `__ELAB_API.ui.*` separate from `unlim.*` + HYBRID selector + WHITELIST 12→62 + audit log + stop conditions (4-row trade-off table)
3. **L0b API surface** — 50 methods enumerated 7 categorie (10 mouse/kbd primitives + 8 window/nav + 7 modalita/lesson + 6 voice/TTS + 8 simulator + 6 lavagna chat + 5 volumi cronologia)
4. **HYBRID selector strategy** — priority order ARIA → data-elab-action → text → CSS + anti-absurd validation (>10 OR 0 OR text-ambiguous >3) + marker stability priority + perf considerations
5. **Security boundary** — WHITELIST 50 ALLOWED_UI_ACTIONS + 18 FORBIDDEN_DESTRUCTIVE + 6 DESTRUCTIVE_LIKE_REQUIRES_CONFIRM (voice "sì conferma") + PII protection (NEVER password/cc/ssn) + rate limit 10/min/session + audit log SQL schema
6. **Stop conditions** — max 5 consec UI actions + anti-absurd §4.2 + confirm gate §5.3 + 3s timeout per dispatch + circuit breaker rate limit + re-entry guard
7. **Bench protocol** — R7 200-prompt expansion (widen `shouldUseIntentSchema` heuristic + reduce L2 template scope action-heavy) + R8 NEW 100-prompt UI action context awareness fixture (Phase 4 dependency, scenarios "Cosa vedo?", "Chiudi finestra Passo Passo", "Vai prossimo esperimento")
8. **Decision matrix canary** — RAMP 25% if R7 ≥80% AND UI ≥95% AND anti_absurd <5% / STAY 5% if R7 ≥75% AND UI ≥90% / REVERT if R7 <75% OR UI <90% OR anti_absurd ≥10%
9. **Risks + mitigations** — 8 risks (selector ambiguity HIGH + destructive accidental CRITICAL + PII leak HIGH + rate limit abuse MED + audit latency LOW + Edge deploy churn MED + L2 dominance HIGH + hybrid selector fragile MED)
10. **Rollback plan** — single env flip `ENABLE_UI_DISPATCH=false` <5min revert, frontend no-op fallback
11. **Cross-link** — ADR-028 + ADR-029 + ADR-030 + ADR-035 + ADR-037 PLANNED + 4 Phase 0 audits + master plan + G45 Opus baseline iter 39 + iter 39 V2 regression revert lesson + CLAUDE.md DUE PAROLE D'ORDINE
12. **Implementation block** (per ADR-028 §14 amend pattern) — 4 NEW files (`elab-ui-api.js` ~700 LOC + `elab-ui-resolver.js` ~250 + rate-limit ~80 + audit ~120) + 6 MODIFIED files (simulator-api.js +20 init namespace + intent-tools-schema.ts +400 schemas + intent-parser.ts +100 validation + intentsDispatcher.js +250 whitelist 50 + useGalileoChat.js +30 surface + App.jsx +10 VALID_HASHES Finding 8 fix) + 50 NEW data-elab markers Phase 3 Atom 23.1 + ~101 NEW unit tests + 50 E2E Playwright + PRINCIPIO ZERO + MORFISMO compliance gate

§13 bonus: Anti-inflation G45 acceptance gate 10-metric matrix (R7 canonical ≥80% / R8 UI context ≥80% / latency <200ms / audit integrity 100% / rollback <5min etc) + NO claim "Onnipotenza FULL LIVE" guard.

---

## §3 Anti-pattern enforcement compliance

- ✅ NO claim "ADR-036 ACCEPTED" — status PROPOSED until Andrea ratify Phase 5 (per plan §11 G45 anti-inflation invariant)
- ✅ NO invented APIs senza Phase 0 audit cross-ref — all 50 methods §3 + 18 FORBIDDEN §5.2 + 6 DESTRUCTIVE_LIKE §5.3 cite Phase 0 audit findings file:line
- ✅ NO write outside `docs/adrs/` + `automa/team-state/messages/` — only 2 files written this turn (ADR + this completion msg)
- ✅ NO --no-verify (no commits this iter — orchestrator commits Phase 3)
- ✅ NO commit (orchestrator Phase 3 commits per plan §3.1 acceptance gate)
- ✅ NO compiacenza — §13 explicit anti-inflation gate "NO claim Onnipotenza FULL LIVE" requirements 5-item checklist

---

## §4 Acceptance gate Phase 1 (per plan §3.2)

- ✅ ADR-036 PROPOSED status shipped (768 LOC, target ~700 +68 over justified)
- ⏸ ADR-037 (Atom 19.1 NEW Onniscenza UI state snapshot) — DEFERRED Architect agent next dispatch (NOT this turn scope per task input "ADR-036 only Atom 18.1")
- ⏸ Andrea ratify queue iter 32+ entrance — orchestrator add to ratify queue post-completion
- ✅ Pre-flight CoV vitest 13474 baseline preserve invariant — NO src/test/supabase changes this iter (mathematical preservation)

---

## §5 Honesty caveats critical (3)

1. **LOC over budget +68** (768 vs target ~700): justified by 50-method enumeration table + 8 risks table + 12.x impl block detailed file:line cross-ref. Could be reduced ~50 LOC by collapsing §3.1-3.7 method tables into single matrix, but readability + audit trail justification per ADR-028 + ADR-035 precedent (ADR-028 = 313 LOC iter 36 + iter 37 amend +60; ADR-035 = ~700 LOC). Architect judgment: stays.

2. **ADR-036 number collision**: existing `docs/adrs/ADR-036-mistral-json-mode-parser-multi-shape.md` (6817 bytes, 2026-05-02) already uses ADR-036 number. This new ADR follows requested filename `ADR-036-onnipotenza-expansion-ui-namespace-l0b.md` per task input spec. **ACTION FOR ORCHESTRATOR**: resolve numbering collision Phase 3 — options:
   - (a) Rename existing to ADR-036b OR future ADR-04x
   - (b) Rename this NEW to next available ADR-04x
   - (c) Andrea final disambig
   - **Architect recommendation**: option (b) rename this NEW to next available (ADR-041 or next free), preserve existing ADR-036 mistral-json-mode-parser-multi-shape number. Not done this turn per task input strict filename spec.

3. **NO Phase 4 ADR-037 design this turn** (Atom 19.1 Architect-opus iter 19 next dispatch). ADR-036 §11 cross-link references ADR-037 as PLANNED (NOT drafted), pari-passo Onniscenza UI state snapshot extension `aggregateOnniscenza` `ui: {route, mode, focused, modals, modalita, lesson_path_step}` per plan §3.2 Atom 19.1 ~400 LOC. Defer next Architect dispatch.

---

## §6 Cross-link

- ADR shipped: `docs/adrs/ADR-036-onnipotenza-expansion-ui-namespace-l0b.md`
- Plan: `docs/superpowers/plans/2026-05-03-iter-31-onnipotenza-expansion-deep-iter-17-30.md` §3.1
- Phase 0 audits 4: `docs/audits/2026-05-03-onnipotenza-ui-audit-{lavagna,simulator,tutor-unlim,cross-cutting}.md`
- Existing ADRs cross-link: ADR-028 ACCEPTED iter 37 + ADR-029 ACCEPTED env-only + ADR-030 PROPOSED iter 38 + ADR-035 PROPOSED iter 31 ralph 10
- G45 Opus baseline: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md` (score 8.0/10)
- Iter 39 V2 lesson learned: `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md`
- This completion msg: `automa/team-state/messages/architect-iter31-ralph19-completed.md`

---

**Status finale**: ADR-036 PROPOSED iter 31 ralph 19 Atom 18.1 SHIPPED file-system verified.
Architecture design ONLY iter 19 — NO src code changes. ADR-037 NEXT dispatch Architect-opus
iter 19 Atom 19.1 (separate turn). Phase 2-3 implementation gated Andrea ratify Phase 5.
