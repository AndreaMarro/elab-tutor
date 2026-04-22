# Watchdog operations guide

Companion doc to [ADR-005 — Watchdog noise suppression](../architectures/ADR-005-watchdog-noise-suppression.md).
Audience: on-call engineer triaging watchdog alerts, or a future maintainer editing `scripts/watchdog-run.sh`.

---

## 1. What runs where

| Component | Path | Role |
|-----------|------|------|
| Orchestrator | `scripts/watchdog-run.sh` | Entry point; invokes checks, owns `log_anomaly` + `log_ok_streak` |
| Check library | `scripts/watchdog-checks.sh` | Individual probes (build, prod HTTP, benchmark, disk, git) — each calls `log_anomaly` with severity tag |
| Test harness | `scripts/test-watchdog-suppression.sh` | 10 cases / 16 assertions — **run before any edit to watchdog-run.sh** |
| Audit log | `docs/audits/errors-log-YYYY-MM.md` | Always-on markdown append (all severities) |
| State — streaks | `automa/state/watchdog-streaks.json` | Consecutive-occurrence counter per type (gitignored) |
| State — cooldown | `automa/state/watchdog-cooldown.json` | Last-fire timestamp per type (gitignored) |

---

## 2. Severity taxonomy

Classification decision tree for authoring a new check:

```
Is the system user-visible broken right now? → error (bypass threshold, 2h cooldown)
Is there a degraded-but-working signal?     → warn  (3× threshold, 24h cooldown)
Is this diagnostic noise for humans only?   → info  (markdown log only, no GH issue)
```

### Current classifications (verify before editing)

| Check | Severity | Rationale |
|-------|----------|-----------|
| `production_down` | error | User-facing outage |
| `edge_cors_broken` | error | Frontend locked out of backend |
| `principio_zero_v3_required_missing` | error | Content regression in prod |
| `principio_zero_v3_forbidden_found` | error | Content regression in prod |
| `ci_failure_burst` | error | Main branch unshippable |
| `edge_*_content_failed` | warn | Content fetch flaky, retry-safe |
| `pr_draft_stuck` | warn | Policy nudge, non-urgent |

---

## 3. Reading state files

Streaks (warn threshold + ok auto-close):
```bash
jq . automa/state/watchdog-streaks.json
# {"prod_latency_spike": {"streak": 2, "last_run": "2026-04-22T04:00Z"}}
```

Cooldown (suppresses re-fire within window):
```bash
jq . automa/state/watchdog-cooldown.json
# {"build_fail": {"created_at": 1745299200}}
```

Both files regenerate from empty if corrupted (default 0 streak / no cooldown).

---

## 4. Common operations

### Dry-run a check without firing GH issues
```bash
WATCHDOG_DRY_RUN=1 bash scripts/watchdog-run.sh
```
Writes to markdown log + updates state files, skips `gh issue create`.

### Promote info → warn locally (verbose debug)
```bash
WATCHDOG_VERBOSE=1 bash scripts/watchdog-run.sh
```

### Override cooldown windows (test only)
```bash
WATCHDOG_COOLDOWN_ERROR_SEC=60 WATCHDOG_COOLDOWN_WARN_SEC=300 bash scripts/watchdog-run.sh
```

### Reset state (start fresh)
```bash
rm automa/state/watchdog-streaks.json automa/state/watchdog-cooldown.json
```

### Validate test harness after edit
```bash
bash scripts/test-watchdog-suppression.sh
# Expect: 16/16 assertions PASS
```

---

## 5. Debugging recipes

### "I changed a check and now tests fail"

1. Run `scripts/test-watchdog-suppression.sh` — pinpoint which case failed.
2. Each test case sets `WATCHDOG_MOCK_EPOCH` to control time and `WATCHDOG_DRY_RUN=1` to skip gh.
3. **Common trap**: state mutation (`_wd_cooldown_record`, `_wd_streak_reset`) must run **outside** the `if command -v gh && DRY_RUN != 1` block, otherwise tests skip them. This was the bug during initial Day 30 impl.

### "Watchdog fires too much in production"

1. Check `automa/state/watchdog-streaks.json` — does threshold logic look applied?
2. Check severity on the noisy check in `watchdog-checks.sh` — should it be `info` or `warn` instead of `error`?
3. Consider increasing cooldown via env var + cron: export `WATCHDOG_COOLDOWN_WARN_SEC=172800` (48h).
4. If a specific `type` needs permanent silence, add to markdown log-only list (future work).

### "Watchdog missed a real outage"

1. Check `docs/audits/errors-log-YYYY-MM.md` for that date — markdown is always-on, should have entry even if GH issue was suppressed.
2. If entry exists but no GH issue: severity likely `warn` + within 24h cooldown. Review severity classification.
3. If no entry at all: the check itself didn't fire — bug in `watchdog-checks.sh`, not in suppression layer.

---

## 6. Non-goals / explicit limits

- Watchdog is **not an app-level observability tool**. For user-visible errors inside the React app, use Sentry (not watchdog).
- Watchdog does **not page anyone**. GH issues arrive via email to Andrea. Slack/PagerDuty integration is out of scope (ADR-005 §4).
- Watchdog does **not self-heal**. An error severity means "Andrea must look now", not "restart the service".
- State files are **per-run-host**, not shared. If watchdog runs from both laptop + CI, streaks diverge. Acceptable — laptop runs are ad-hoc.

---

## 7. POC gate reminder

ADR-005 acceptance is **ACCEPTED pending 5-run shadow observation**:
- Target: GH issue creation rate < 40% of sett-3 baseline.
- Window: next 5 production watchdog runs after Day 30 merge.
- Measurement: compare `gh issue list --label watchdog-alert --created '>=2026-04-22'` count vs sett-3 rolling average.
- Outcome tracked in Sprint 5 retrospective (Day 35).

---

**Last updated**: 2026-04-22 (Day 31 creation, ADR-005 §5 unchecked criterion addressed).
