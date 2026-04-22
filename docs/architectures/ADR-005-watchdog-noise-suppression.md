# ADR-005 — Watchdog noise suppression (severity + cooldown + threshold)

**Status**: ACCEPTED (Day 30 Sprint 5 Day 02 bridge, 2026-04-22, impl SHA `d52ee87`)
**Promoted from**: PROPOSED (sett-4 Day 02, 2026-04-23)
**Supersedes**: none
**Related**: ADR-006 (wiki ingest log will reuse severity taxonomy), ADR-008 (schema formalization same Day 30)
**Implementation evidence**:
- `scripts/watchdog-run.sh` — 3-layer `log_anomaly()` + `log_ok_streak()` (commit d52ee87)
- `scripts/watchdog-checks.sh` — severity tags on 7 call sites
- `scripts/test-watchdog-suppression.sh` — 10 cases / 16/16 assertions PASS

---

## 1. Context

`scripts/watchdog-run.sh` orchestrates periodic health checks (build status, prod HTTP, benchmark regression, disk, git state). `log_anomaly()` at `scripts/watchdog-run.sh:51-92` does two things:

1. Appends Markdown entry to `docs/audits/errors-log-YYYY-MM.md`.
2. Calls `gh issue create --label watchdog-alert` — rate-limited by a single check: `gh issue list … | jq … contains($type)` against open issues (line 75-76).

### Noise sources identified sett-3

- **No severity taxonomy**: every anomaly → GH issue. Transient prod latency spike = same priority as build failure.
- **Weak dedup**: substring match on `$type` only. If a check emits `prod_http_5xx` once then `prod_http_timeout` next run, both open separate issues (same root cause).
- **No cooldown**: after an issue is *closed*, next occurrence re-opens immediately. Single-flake anomalies keep re-firing post-resolution.
- **No consecutive-occurrence threshold**: 1 anomaly = 1 issue. Flaky checks (CI warmup, cold start) create permanent noise.
- **No auto-close**: when check returns OK for N runs, prior issue stays open until human closes.

Evidence sett-3: `docs/audits/errors-log-2026-04.md` contains >40 entries across Days 15-21; `gh issue list --label watchdog-alert` shows historical tail of resolved-but-not-closed items. Andrea inbox signal: e-mail flood, ignored.

---

## 2. Decision

Introduce 3-layer suppression in `log_anomaly()` without changing check semantics:

### Layer A — Severity taxonomy

Signature change: `log_anomaly <type> <detail> [pattern_hint] [severity]`.

| Severity | Markdown log | GH issue | Example |
|----------|--------------|----------|---------|
| `info` | ✅ | ❌ | cold-start 400ms on warm endpoint |
| `warn` | ✅ | only if threshold hit | benchmark delta -0.05 |
| `error` | ✅ | always (respect cooldown) | build fail, prod HTTP 5xx, disk >95% |

Default `severity=warn` when omitted (backward compatible).

### Layer B — Consecutive-occurrence threshold (warn-only)

`warn` severity requires **3 consecutive occurrences of same `type`** in the last 3 runs before filing a GH issue. Implemented via `automa/state/watchdog-streaks.json`:

```json
{
  "prod_latency_spike": {"streak": 2, "last_run": "2026-04-23T04:00:00Z"},
  "build_warning_count": {"streak": 1, "last_run": "2026-04-23T04:00:00Z"}
}
```

Streak resets to 0 on any non-observation run for that type. `error` bypasses threshold.

### Layer C — Cooldown per type (error + warn)

After issue creation, record `type → created_at` in `automa/state/watchdog-cooldown.json`. Skip re-fire if `now - created_at < cooldown_window` where:

- `error`: 2 hours
- `warn`: 24 hours

If the prior issue is **closed** within cooldown window and anomaly recurs, file a NEW issue with body line `RECURRENT after close` (valuable signal, worth re-notifying). If prior is still **open**, suppress with log-only entry.

### Layer D — Auto-close on OK streak

New helper `log_ok_streak(check_name)` invoked by `scripts/watchdog-checks.sh` on healthy result. After **3 consecutive OK** runs for a check that has an open `watchdog-alert` issue of matching type, comment `auto-close: 3× OK streak 2026-04-23..04-25, resolution confirmed` and close the issue. State tracked in same `watchdog-streaks.json` with positive counter.

---

## 3. Consequences

### Positive

- Expected GH issue volume drop **60-80%** (estimate from sett-3 log where majority were flaky warn-level).
- Severity signals become meaningful (error = Andrea must look now).
- Auto-close removes manual janitorial work.
- Backward-compatible signature (new `severity` param is optional, defaults warn).

### Negative

- **Added state files**: `watchdog-streaks.json` + `watchdog-cooldown.json` in `automa/state/` (gitignored via existing `automa/state/*.lock` precedent? — verify, if not, add `.streaks.json` / `.cooldown.json` exclusion).
- **Risk: threshold hides real issue** — if check is intermittent-but-real (e.g., prod outage every 4th run), threshold of 3 might delay alert. Mitigation: classify intermittent-critical checks as `error` severity so threshold bypassed.
- **Cooldown window tuning** — 2h/24h are initial values, expect to tune after 2 weeks observation.

### Neutral

- No semantic change to checks in `scripts/watchdog-checks.sh` — only call sites add severity param.
- `docs/audits/errors-log-YYYY-MM.md` keeps all entries (no info loss, human audit still complete).

---

## 4. Alternatives considered

1. **Disable GH issue creation entirely** — rejected: loses proactive signal for prod-critical failures.
2. **Move to Slack webhook instead of GH issues** — rejected: out of budget sett-4, Andrea inbox still primary. Can revisit sprint-6.
3. **Sentry integration** — rejected: cost + setup time for scope, Sentry better for app-level not watchdog-level.
4. **Threshold only (no severity)** — rejected: real error (build fail) delayed by 3 runs = unacceptable.

---

## 5. Acceptance criteria (S4.3.3)

- [ ] `scripts/watchdog-run.sh` accepts 4th positional arg to `log_anomaly` (severity), default `warn`.
- [ ] `automa/state/watchdog-streaks.json` + `watchdog-cooldown.json` initialized + gitignored if secret-adjacent, committed if pure state.
- [ ] `scripts/watchdog-checks.sh` updated to tag each `log_anomaly` call with appropriate severity (classify existing calls: build fail = error, latency = warn, prod HTTP 5xx = error, disk = error, benchmark delta = warn).
- [ ] Unit/shell test `tests/shell/watchdog-suppression.test.sh` covers: 3x warn → issue fires; 2x warn → no issue; error bypasses threshold; cooldown suppresses within window; auto-close on 3x OK.
- [ ] Document new severity taxonomy in `docs/operations/watchdog-guide.md` (create if missing).
- [ ] Run watchdog 5x in CI shadow mode, measure issue creation delta vs sett-3 baseline.

---

## 6. Risks

| Risk | Prob | Impact | Mitigation |
|------|------|--------|------------|
| Threshold hides flaky-but-real degradation | Medium | Medium | Classify prod-critical as error; review first 2 weeks post-merge |
| State file corruption loses streak counter | Low | Low | Default to 0 on parse error; write atomically via `mv temp dest` |
| Auto-close fires on unrelated open issue (title collision) | Low | Medium | Match on exact label + type string, not substring |
| Severity miscategorization in watchdog-checks.sh | Medium | Low | Review checklist per-check during PR, comment rationale inline |

---

## 7. Implementation plan (Day 03-04)

1. Day 03 — edit `scripts/watchdog-run.sh` + add state file helpers (~80 lines shell).
2. Day 03 — update `scripts/watchdog-checks.sh` severity tags (~15 call sites).
3. Day 04 — shell tests + CI shadow run + `watchdog-guide.md`.
4. Day 04 — merge to feature branch, monitor 5 runs, tune cooldown if needed.

Budget: 1 SP (S4.3.3). Scope firewall: no changes to check logic, only call-site annotations + orchestrator.

---

## 8. POC gate

Watchdog suppression succeeds if sett-4 closure audit shows:

- GH issue creation rate < 40% of sett-3 baseline.
- Zero missed P0 events (build fail, prod down) during observation window.
- Andrea feedback: "actionable signal" qualitative (captured end-sprint retrospective).

**Drafted Day 23 (sett-4 Day 02)** — Andrea review pending before implementation Day 03.
