# ADR-005 POC — Observation Run 1/5 (2026-04-22)

**Purpose**: First of 5 shadow observation runs for ADR-005 acceptance gate (per `docs/operations/watchdog-guide.md` §7).
**Method**: DRY_RUN + VERBOSE invocation, no GH issues created, no state mutation in non-dry mode.
**Day**: 33 (Sprint 5 Day 05 bridge).

---

## Environment

| Var | Value | Purpose |
|-----|-------|---------|
| `WATCHDOG_DRY_RUN` | `1` | Suppresses `gh issue create/comment` — log only |
| `WATCHDOG_VERBOSE` | `1` | Emits `info`-severity entries (normally suppressed) |
| `WATCHDOG_COOLDOWN_ERROR` | default 7200 (2h) | Per-dedup-key cooldown |
| `WATCHDOG_COOLDOWN_WARN` | default 86400 (24h) | Warn cooldown |
| `WATCHDOG_THRESHOLD_WARN` | default 3 | Warn streak before GH issue |

Command: `WATCHDOG_DRY_RUN=1 WATCHDOG_VERBOSE=1 bash scripts/watchdog-run.sh regular`

---

## Observed state (pre-run)

Both state files empty (`{}`) — fresh slate:
- `automa/state/watchdog-streaks.json`: `{}`
- `automa/state/watchdog-cooldown.json`: `{}`

## Observed result

```
Watchdog run complete. OK=8 Anomaly=0
exit 0
```

All 8 probes green:
1. `production_root` → 200
2. `edge_unlim-chat_cors` → 204
3. `edge_unlim-hints_cors` → 204
4. `edge_unlim-diagnose_cors` → 204
5. `pr_draft_age` → no old drafts
6. `ci_failures_2h` → 0 failures
7. `branch_feature_vision-e2e-live_idle` → 4399m (log-only)
8. `branch_feature_fumetto-report-mvp_idle` → 4306m (log-only)

---

## Counters

| Metric | Value |
|--------|-------|
| Anomalies logged | 0 |
| Would-have-been-issue (threshold reached) | 0 |
| Suppressed by cooldown | 0 |
| Suppressed by info-severity (VERBOSE=0 in prod) | 2 (`branch_*_idle` log-only lines) |
| Exit code | 0 |

---

## Analysis

**Null-result baseline**. Infrastructure currently healthy → no anomalies produced → suppression layers un-exercised.

### What this run proves
- Watchdog invocation with DRY_RUN=1 + VERBOSE=1 does not mutate state files unnecessarily (streaks + cooldown remain `{}`).
- All 8 configured probes execute end-to-end in production network path.
- Info-severity branch-idle checks remain log-only under VERBOSE=1 (correctly scoped to `/tmp/watchdog-report.md`, not GH).

### What this run does NOT prove
- Suppression threshold behavior (no warn-severity anomaly occurred).
- Cooldown window behavior (no dedup-key repeat).
- Auto-close behavior (no previously-open issue to close).
- Noise-ratio delta vs pre-ADR-005 (no anomaly vs historical comparison).

---

## POC gate progress

Per watchdog-guide §7 acceptance criteria:

- [ ] **Run 1**: baseline under current traffic (this run). DONE — but observed quiet state, not noise state.
- [ ] Run 2: observe at least 1 warn anomaly to exercise threshold layer.
- [ ] Run 3: observe at least 1 cooldown dedup (repeat anomaly same dedup-key).
- [ ] Run 4: observe auto-close path (3 consecutive `log_ok`).
- [ ] Run 5: composite noise-ratio measurement vs baseline estimate.

**Gate status**: 1/5 observational, but Run 1 alone is insufficient to close the POC — it samples a null regime. Future runs must sample an active-anomaly regime (manual fault injection acceptable).

---

## Recommendation for Run 2

**Approach A — natural observation**: wait for a genuine anomaly to arise (production flake, Render cold-start timeout, draft PR >2h). Passive.

**Approach B — fault injection**: temporarily change one probe URL to a known-bad endpoint for 1 watchdog invocation, observe threshold/cooldown behavior, revert. Requires minimal touch to test harness (NOT production `watchdog-run.sh`).

**Chosen (Day 33 deferred)**: Approach A until Day 35 sett gate. If still zero anomalies, fall back to Approach B via a test-only wrapper script.

---

## Honest limitations

1. **Quiet regime**: null result. POC gate still 0/5 effectively proven (Run 1 samples empty space).
2. **No historical noise-ratio**: pre-ADR-005 noise count not archived — delta calculation requires future reconstruction from `docs/audits/errors-log-*.md` entries.
3. **VERBOSE=1 changes behavior**: info lines emitted. Production VERBOSE=0 run would show 0 anomaly + 6 probes (not 8). Counter analysis reflects run-mode, not prod-mode.
4. **DRY_RUN=1 blocks state updates**: streaks/cooldown files remain `{}` by design. Run 2 with DRY_RUN=1 will also show `{}` unless the suppression path is exercised via real anomaly + non-dry state-mutation fork.

---

## Artifacts

- Report: `/tmp/watchdog-report.md` (transient, copied below)
- Runtime: ~2s
- Exit code: 0

```
## Watchdog run 2026-04-22T07:12:03Z (regular)

**Project**: ELAB Tutor

- ✅ production_root: 200
- ✅ edge_unlim-chat_cors: 204
- ✅ edge_unlim-hints_cors: 204
- ✅ edge_unlim-diagnose_cors: 204
- ✅ pr_draft_age: no old drafts
- ✅ ci_failures_2h: 0 failures
- ✅ branch_feature_vision-e2e-live_idle: 4399m
- ✅ branch_feature_fumetto-report-mvp_idle: 4306m

Summary: 8 OK, 0 anomaly
```

---

**Sign-off**: Run 1 observational-only, null-regime baseline, POC gate 1/5 in sequence but 0/5 in *noise-event coverage*. Run 2 pending natural or injected anomaly.
