# Sprint 6 — DRAFT (pending Andrea theme gate + sprint start Day 36+)

**Status**: DRAFT. **Not a commitment.** Theme decision gated on Andrea.
**Drafted**: 2026-04-22, Day 35 sett-gate (Sprint 5 closure).

---

## Gating prerequisite

Sprint 6 cannot begin until **Andrea resolves Sprint 5 theme gate**:
- Option A (per prior contracts): Intelligence Foundations — vision pipeline, RAG, lesson graph.
- Option B (per prior contracts): UNLIM voice + reliability — Edge TTS production, wake-word stability.
- Option C: Other (Andrea call).

Sprint 6 will align with whatever theme Andrea picks.

---

## Candidate story skeletons (theme-agnostic prep)

These stories can be refined once theme locks. Listed here as planning placeholder only.

### Story S6.A — Tasks-board ADR-008 Phase 2 migration (theme-agnostic, tech-debt)

- **Context**: 77 drift violations enumerated Day 31.
- **Work**: write `scripts/migrate-tasks-board.sh` to apply defaults per `docs/audit/tasks-board-drift-day-31.md` categorization. 4 root-cause classes → 4 migration functions.
- **Acceptance**: live `tasks-board.json` validates cleanly via `scripts/validate-tasks-board.sh`. ADR-008 status transitions PROPOSED → ACCEPTED.
- **Andrea gate**: ADR-008 Ajv-vs-jq decision (independent — if Ajv, npm dep gate).
- **Effort**: 2 SP.

### Story S6.B — Worker-probe fix (theme-agnostic, benchmark unlock)

- **Context**: worker_uptime 66.67% drag, +0.32 composite potential.
- **Work**: apply Option A diff (switch probe 3 to `auth/v1/health`).
- **Acceptance**: benchmark composite 5.34 → 5.66 measured.
- **Andrea gate**: worker-probe URL change approval.
- **Effort**: 0.5 SP.

### Story S6.C — ADR-005 POC gate closure

- **Context**: POC Run 1/5 sampled quiet regime (0/5 noise-coverage).
- **Work**: 4 more runs. Either natural-anomaly observation (Approach A) or fault-inject wrapper (Approach B).
- **Acceptance**: POC gate §7 criteria all [x]. ADR-005 status updates "ACCEPTED pending POC" → "ACCEPTED (POC closed)".
- **Effort**: 1 SP (if Approach B fault-inject).

### Story S6.D — Peer review cadence formalization

- **Context**: Sprint 5 peer review ran once (Day 33), caught 3 real flags.
- **Work**: schedule team-reviewer dispatch every 3 days of Sprint 6 via automa/team-state cadence.
- **Acceptance**: 2+ peer-review docs shipped Sprint 6. Retro Action 1 fulfilled.
- **Effort**: 0.3 SP (scheduling + executing).

### Story S6.E — Theme-locked primary feature

- **TBD pending Andrea theme decision.**

---

## Sprint 6 candidate budget

If Andrea picks Intelligence Foundations (Option A): ~10 SP over 7 days = S6.A (2) + S6.B (0.5) + S6.D (0.3) + E (7+ SP thematic).
If Andrea picks UNLIM voice (Option B): ~10 SP over 7 days = S6.A (2) + S6.B (0.5) + S6.D (0.3) + E (7+ SP thematic).

A/B are isomorphic in bridge work (S6.A-D) and diverge on S6.E only.

---

## Sprint 6 acceptance criteria (theme-agnostic)

- [ ] Test count delta > 0 (ends 7-day flatline).
- [ ] Benchmark composite delta measurable (at minimum S6.B +0.32).
- [ ] No silent scope drops (Contract Reconciliation per Sprint 5 retro action 2).
- [ ] Peer review cadence every 3 days (retro action 1).
- [ ] Test-layer-explicit contracts (retro action 3).

---

## Sign-off

DRAFT only. Commitment upon Andrea theme gate resolution.

Sprint 6 DRAFT written 2026-04-22, Day 35 sett-gate.
