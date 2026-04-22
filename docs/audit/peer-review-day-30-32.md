# Peer review — Day 30-32 bridge (2026-04-22)

**Reviewer**: team-reviewer (independent, no self-eval bias)
**Scope**: 8 commits across Days 30-32 on `feature/sett-4-intelligence-foundations`
**Overall verdict**: **REQUEST_CHANGES** (composite 7.9/10 vs self-audit 9.15/10)

---

## Per-day verdicts

| Day | Self-score | Peer-score | Verdict |
|-----|-----------|-----------|---------|
| 30  | 9.05/10   | 7.5/10    | REQUEST_CHANGES |
| 31  | 9.05/10   | 9.0/10    | APPROVE |
| 32  | 9.35/10   | 7.2/10    | REQUEST_CHANGES |

**Bridge composite (peer-adjusted)**: 7.9/10.

---

## Top 3 peer-review flags (self-audit missed)

### Flag 1 — TASK-30-03b silently dropped
- **Contract** (`day-30-contract.md:94-103`): ≥15 new unit tests, test count lift 12371 → ≥12386.
- **Reality**: test count remained 12371 across all Day 30 commits. No `tests/unit/watchdog-suppression.test.*` file exists.
- **Self-audit Day 30 Dim 1** ("scope adherence") scored 9/10 with claim "zero scope creep".
- **Peer correction**: this is inflation by omission. A dropped P0 deliverable is scope regression, not "zero creep".

### Flag 2 — ADR-005 "ACCEPTED" header missing POC-pending caveat
- **`docs/architectures/ADR-005-watchdog-noise-suppression.md:3`**: header says `Status: ACCEPTED` unconditionally.
- **`docs/operations/watchdog-guide.md:126-132`** (§7): carries "pending 5-run POC observation" caveat.
- **Risk**: a reader reading the ADR cold sees unconditional acceptance. Caveat is discoverable only via operations guide cross-read.
- **Peer correction**: ADR-005 header should mirror watchdog-guide §7 language ("ACCEPTED pending 5-run POC observation gate").

### Flag 3 — Day 30 TPM contract retrofitted after impl
- **Commit order**: d52ee87 (watchdog impl, 13:59) → c672bca (TPM contract, 14:04).
- **TPM discipline**: contract MUST precede implementation. Inverted on Day 30.
- **Peer correction**: contract was scope-shaped to match work done, not vice versa. Day 31-32 contracts were properly pre-impl — Day 30 is the outlier.

---

## Top 3 dimensions where self-audit was TOO harsh

1. **Day 30 Dim 8 (watchdog impl craft) 9/10** → peer 10/10. `WATCHDOG_LIB_MODE` isolation, atomic `mv tmp dest` writes, mock epoch injection, 16/16 assertions, state-mutation-outside-dry-run fix caught by test failure. Discipline-grade craft.
2. **Day 31 Dim 10 (drift report quality) 9/10** → peer 10/10. 77 violations categorized into 9 types + 5 root causes + 8-step Phase 2 migration plan. Unusually actionable.
3. **Day 32 Dim 5 (root-cause precision) 9/10** → peer 10/10. File+line citation, 401 vs 5xx distinction explicit, 4 options with diff preview. Audit-grade precision reads like self-handicap.

---

## Additional concerns flagged

### Day 32 "no code = 10/10" inflation
- Dims 2 (test baseline), 3 (build), 15 (anti-regression), 18 (git hygiene), 20 (carry-forward) scored 10/10 because "no code touched".
- **Peer view**: rewarding non-action with max score inflates composite. A diagnostic-only day cannot score higher than days that shipped working code + tests.
- **Peer-adjusted dims for Day 32**:
  - Dim 2: 8/10 (baseline inherited, not re-verified via CoV)
  - Dim 4: 5/10 (+0.32 benchmark credit is speculative, not measured)
  - Dim 15: 9/10 (untouched code has no regression risk but commit 8e0650d DID modify state files — not a complete "no-op")

### CoV 3x absent for commit 8e0650d
- Handoff explicitly: "Not run (no code changed)".
- `claude-progress.txt:6`: "12371 / 12371 / 12371 PASS (Day 31 verified, held through Day 32 via non-modification)".
- **Peer view**: 8e0650d modified `claude-progress.txt` + `heartbeat` + new docs. State-file-only changes do not warrant CoV skip exemption under strict Harness 2.0. Acceptable once; not sustainable.

### Benchmark stagnation (3-day flat)
- Day 30: 5.34 fast
- Day 31: 5.34 fast
- Day 32: 5.34 fast (with "+0.32 potential")
- **Peer view**: zero delta across 3 days is a cumulative flag under-acknowledged. Andrea-gate respect justifies it, but the stagnation should be explicitly named in handoffs, not just "diagnostic complete".

### ADR-008 id-pattern reactive relaxation
- Day 31 gap #4 acknowledges pattern was relaxed after test failure (`^(T|S|A)[0-9]+` → `^(T|S|A)-?[0-9]+(-[0-9]+)*

).
- **Peer view**: schema bent to drift. Reverse discipline = drift migrates to schema. Phase 2 migration plan is correct remedy; the Phase 1 ship was compromised.

---

## What went genuinely well

- **Andrea-gate respect**: 10/10 across all 3 days. Zero prod-config mutation without approval.
- **Main-push discipline**: zero `main` pushes. All work on feature branch.
- **Dependency discipline**: zero new npm deps (jq fallback for ADR-008 validator respected CLAUDE.md rule 13).
- **Drift enumeration**: 77 violations categorized + Phase 2 migration script drafted. Rare quality.
- **Diagnostic precision Day 32**: precise enough to hand Andrea a 1-line diff + expected metric delta.

---

## Recommended actions (Day 33+)

1. **Write TASK-30-03b recovery note**: either schedule the 15 unit tests in a later day's contract OR explicitly remove it from scope with rationale. Don't leave it silent.
2. **Amend ADR-005 header** to add "pending 5-run POC observation gate" qualifier — minimal edit, high clarity gain.
3. **Day 30-32 audits**: leave as-is (historical record), but add reference to this peer-review doc in claude-progress.txt so future-claude sees the correction.
4. **Day 33+ audits**: stop scoring 10/10 on "no code touched" dimensions. Introduce a "non-action discount" factor.
5. **Day 33 ADR-005 POC Run 1**: kick off the 5-run observation to close Flag 2.

---

## Reviewer signature

Independent dispatch, no shared context with author. Review read 8 commits + 14 files. Evidence citations preserved. No implementation performed. Verdict: REQUEST_CHANGES with 3 actionable flags + 3 under-scoring corrections.

**Sign-off**: 2026-04-22, team-reviewer.
