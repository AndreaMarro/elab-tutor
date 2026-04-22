# Day 30 Contract — Sprint 5 Day 02 (cumulative Day 30) — Harness 2.0

**Date**: 2026-04-22 (mer)
**Branch**: `feature/sett-4-intelligence-foundations`
**Theme**: theme-agnostic tech-debt bridge (Day 30 Sprint 5 Day 02)
**Gate status**: Andrea decision gate OPEN — 5 Sprint 5 theme questions unanswered. Scope designed safe under any Option A/B/mix pick.

---

## Goal

Close 3 carry-over items without committing to Option A (intelligence deepening) or Option B (UX redesign). Ship measurable tech-debt reduction while Andrea deliberates.

**Non-goal**: zero work on features that presuppose a specific Sprint 5 theme.

---

## Baseline (verify pre-work)

- Test: 12371 CoV 3x PASS (carried from Day 29)
- Build: PASS 1m41s PWA v1.2.0
- Benchmark: 5.34 fast (Day 29 fresh write was in progress — re-verify with `node scripts/benchmark.cjs --fast`)
- Last commit local: `ea73423` (Day 30 kickoff chore)
- Remote HEAD: `0c7c114` — `ea73423` ahead 1 unpushed
- Blockers open: **0** (BLOCKER-000..012 all CLOSED)

---

## Scope (3 P0 tasks, ~3 SP total)

### TASK-30-01 — ADR-005 watchdog noise suppression IMPLEMENTATION (1 SP)

**Carry-over**: Sprint 4 P3, ADR-005 status PROPOSED since Day 07.
**Owner**: team-dev.
**Files**:
- `scripts/watchdog-run.sh` — modify `log_anomaly()` per ADR-005 sez 2 Decision
- `scripts/test-watchdog-suppression.sh` — new, min 8 cases
- `docs/architectures/ADR-005-watchdog-noise-suppression.md` — promote PROPOSED → ACCEPTED with implementation SHA reference in status header

**Decision recap (ADR-005 3-layer)**:
1. Severity taxonomy (INFO / WARN / CRITICAL) — filter INFO by default
2. Cooldown per anomaly-key (default 300s) — suppress repeats same window
3. Threshold N occurrences before first emit (default 3)

**Acceptance criteria**:
1. `watchdog-run.sh` no longer emits same WARN within 300s cooldown window (verified via mock clock in test script)
2. INFO-level anomalies suppressed unless `WATCHDOG_VERBOSE=1` env
3. CRITICAL never suppressed regardless of cooldown/threshold
4. `scripts/test-watchdog-suppression.sh` ≥8 cases all PASS (dup-within-cooldown, dup-after-cooldown, INFO-hidden, CRITICAL-always, threshold-below, threshold-hit, env-override, state-reset)
5. ADR-005 header updated: `Status: ACCEPTED (2026-04-22, impl SHA <new>)`

**Rollback**: `git revert <impl-sha>` — suppression module isolated to `log_anomaly()` + new test file, no caller changes.

---

### TASK-30-02 — ADR-008 tasks-board.json schema formal (1 SP)

**Carry-over**: Sprint 5 A-503 from actions-tracker.
**Owner**: team-dev.
**Files**:
- `docs/architectures/ADR-008-tasks-board-schema.md` — new

**Content required**:
- JSON Schema draft-07 definition: `sprint` (int), `day` (int), `status` (enum todo|in-progress|done|blocked|cancelled), `owner` (enum team-tpm|team-architect|team-dev|team-tester|team-reviewer|team-auditor), `points` (number 0.5 increment)
- Required vs optional fields matrix
- Validation script path placeholder: `scripts/validate-tasks-board.cjs` (implementation deferred — ADR only Day 30)
- Deprecation path for current free-form entries (grandfather clause, migration deadline Day 35)
- Example valid entry + example invalid entry

**Acceptance criteria**:
1. ADR file exists at canonical path with standard header (Date / Status / Context / Decision / Consequences)
2. Status `Proposed` (NOT Accepted — needs Andrea review)
3. Schema block is valid JSON Schema draft-07 (passes `ajv compile` smoke OR manual JSON.parse without error)
4. Enum values match currently-in-use values in `automa/team-state/tasks-board.json` (grep to confirm no clash)
5. Cross-referenced from `automa/team-state/sprint-5-actions-tracker.json` A-503 entry note (TPM update, not code)

**Rollback**: `git rm docs/architectures/ADR-008-tasks-board-schema.md` — doc-only, no consumers.

---

### TASK-30-03 — README automation cross-link + test-count minor (1 SP split 0.5/0.5)

**Owner**: team-dev (README) + team-tester (tests).
**Files**:
- `README.md` — append section `## Automation hooks`
- `tests/unit/watchdog-suppression.test.js` — new, ≥15 unit cases

**README section content**:
- Pointer to `docs/workflows/claude-mem-automation.md` (post-commit hook A-502)
- Pointer to `docs/architectures/ADR-005-watchdog-noise-suppression.md`
- Pointer to `docs/architectures/ADR-008-tasks-board-schema.md` (once Day 30 merged)
- 3 bullet max — no prose padding

**Tests content** (test-count lift):
- Unit-level mirror of bash test cases from TASK-30-01 (severity filter, cooldown match, threshold gate)
- Target 15+ new tests → 12371 → 12386+
- Must not depend on bash execution — pure JS module `src/utils/watchdog-suppression.js` extracted OR inline helper tested via fixture

**Acceptance criteria**:
1. README `## Automation hooks` section present, 3 links valid (file existence check)
2. `tests/unit/watchdog-suppression.test.js` adds ≥15 tests, all PASS
3. CoV 3x final `npx vitest run` reports ≥12386
4. No regression on pre-existing 12371 (zero failures in unchanged specs)
5. Build PASS `npm run build`

**Rollback**: two separate commits — README revert independent from tests revert. `git revert <readme-sha>` and/or `git revert <tests-sha>`.

---

## Test strategy

- **Unit**: vitest for `watchdog-suppression` logic (TASK-30-03). 15+ cases.
- **Smoke**: bash `scripts/test-watchdog-suppression.sh` (TASK-30-01). 8+ cases.
- **CoV 3x preserved**: 3 runs `npx vitest run`, all ≥12386 PASS. Any 1 of 3 flaky → investigate, do NOT commit.
- **Build gate**: `npm run build` MUST pass before each commit.
- **Benchmark**: run `node scripts/benchmark.cjs --fast` post-last-commit, record delta vs 5.34 baseline.

---

## Rollback plan (global)

Per-task revert isolated. No cross-task coupling.

| Task | SHA to revert | Side-effects |
|------|---------------|--------------|
| TASK-30-01 | watchdog impl SHA | ADR-005 header auto-reverts to PROPOSED |
| TASK-30-02 | ADR-008 SHA | None (doc-only) |
| TASK-30-03a | README SHA | None (doc-only) |
| TASK-30-03b | tests SHA | Test count drops back to 12371 |

Full Day 30 rollback: `git reset --hard ea73423` (allowed only with Andrea explicit green light — destructive).

---

## Success metrics (4-grading Harness 2.0, target 7.5+ each)

| Dimension | Target | How measured |
|-----------|--------|--------------|
| Design | 7.5 | ADR-008 schema rigor + ADR-005 promotion quality (external auditor pass) |
| Originality | 7.5 | Schema enum derived from real usage, not invented — defensible |
| Craft | 8.0 | Zero flakiness CoV 3x, rollback plan per-task, no `--no-verify`, pre-commit hook passes clean |
| Functionality | 7.5 | watchdog suppression verified in real mock run, 15+ tests green |

**Composite floor**: 7.5 mean. Below → Day 30 NOT READY, extend to Day 31 scope.

---

## Dispatch

- TPM (this file) — coordination only, no src/ edits
- DEV — TASK-30-01 impl + TASK-30-02 ADR + TASK-30-03a README
- TESTER — TASK-30-03b unit tests
- AUDITOR — end-day verdict `docs/audits/2026-04-22-day-30-bridge.md`
- REVIEWER — pre-push review if any commit lands

---

## Risk register

- R1: ADR-005 implementation has never run in real watchdog production context → mock-only validation Day 30, real-run soak deferred Day 31
- R2: 15 new unit tests may be trivial cases inflating test-count with low coverage value → tester MUST include ≥3 edge cases (race, state-reset, env-override)
- R3: Andrea gate could close mid-Day-30 with theme pick that deprioritizes tech-debt → scope stays shippable regardless, no sunk cost
