# worker_uptime 66.67% — root cause analysis (Day 32, 2026-04-22)

**Benchmark metric**: `worker_uptime` (weight 0.10, target 0.99).
**Current value**: 2/3 = 0.6667 → normalized 6.67/10 → contribution 0.67 (target 0.99 = 9.9 contribution).
**Drag vs target**: -3.23 normalized points × 0.10 weight = **-0.32 composite score**.
**Persistence**: Observed Day 29, 30, 31 — never varied.

---

## Investigation

### Probe source

`scripts/worker-probe.sh` lines 66-68 probes 3 workers:

| # | Worker | URL | Method | Header | Expected |
|---|--------|-----|--------|--------|----------|
| 1 | nanobot-render | `https://elab-galileo.onrender.com/health` | GET | — | 200 |
| 2 | edge-tts-vps | `http://72.60.129.50:8880/health` | GET | — | 200 |
| 3 | supabase-unlim-chat | `https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat` | POST `{"message":"probe"}` | `apikey: $SUPABASE_ANON_KEY` (if set) | 2xx |

### Current state (`automa/state/worker-probe-latest.json`)

| # | Worker | status_code | ok |
|---|--------|-------------|-----|
| 1 | nanobot-render | 200 | true |
| 2 | edge-tts-vps | 200 | true |
| 3 | supabase-unlim-chat | **401** | **false** |

### Root cause

Probe 3 sends POST to Supabase edge function without `SUPABASE_ANON_KEY` env var. Supabase Functions reject any request without the anon key (or a valid user JWT) — response is 401 before the function even runs.

Line 61-63 of `worker-probe.sh`:
```bash
SB_AUTH=""
if [[ -n "${SUPABASE_ANON_KEY:-}" ]]; then
  SB_AUTH="apikey: ${SUPABASE_ANON_KEY}"
fi
```

In autonomous watchdog/benchmark runs, `SUPABASE_ANON_KEY` is not exported → `SB_AUTH=""` → no auth header → 401 → `ok: false` → worker_uptime drops 1/3.

**This is not an infrastructure outage.** Supabase function is healthy; it is correctly rejecting unauthenticated probes.

---

## Impact

- Benchmark composite score locked at 5.34 (with correct uptime it would be ~5.66).
- Does not reflect actual reliability — false positive for "service degraded".
- May mask real outages if Andrea habituates to "always 66.67%".

---

## Remediation options

### A. Switch supabase probe URL to anonymous healthz endpoint

Change line 68 to probe `https://euqpdueopmlllqjmqnyb.supabase.co/auth/v1/health` (always 200, no auth).

- Pros: zero config, clean signal.
- Cons: does not validate edge function availability specifically — only project reachability.

### B. Inject SUPABASE_ANON_KEY from env file

Source `.env.production` or `.env.watchdog` before probe. Anon key is client-side public by Supabase design — safe to commit to `.env.watchdog` if gitignored.

- Pros: validates real edge function path used by app.
- Cons: requires env file hygiene, one more moving part.

### C. Accept 4xx as "reachable"

Change line 54 from `[[ "$code" =~ ^2[0-9][0-9]$ ]] && ok="true"` to treat 401/403/404 as reachable (distinguishable from 5xx / timeout).

- Pros: uptime metric becomes about reachability, not authorization.
- Cons: semantic drift — "ok" no longer means "function callable".

### D. Drop probe 3 entirely, add 2 replacement probes

Replace supabase-unlim-chat with 2 no-auth probes: Supabase `auth/v1/health` + Vercel deployment URL. Keeps 3-worker denominator, removes false negative.

- Pros: cleanest signal, no auth management.
- Cons: loses edge-function-specific monitoring.

### Recommendation

**Option A** for Day 32+: minimal diff, zero config change, valid reachability signal. Edge function availability can be separately tracked via Sentry if needed.

---

## Proposed fix (Day 33 or 34, requires Andrea confirm prod URL change is acceptable)

```diff
-results+=("$(probe 'supabase-unlim-chat' 'https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat' 'POST' '{"message":"probe"}' "$SB_AUTH")")
+results+=("$(probe 'supabase-project' 'https://euqpdueopmlllqjmqnyb.supabase.co/auth/v1/health' 'GET')")
```

Expected outcome: worker_uptime 3/3 = 0.99 → contribution 0.99 → composite score 5.34 → 5.66 (+0.32).

---

## Honest limitations

1. Only 1 probe file sampled (`worker-probe-latest.json` from 2026-04-21T22:41Z). Multi-day trend not analyzed.
2. Recommendation Option A is the minimal diff but loses granular signal — may need Option B if edge function outage detection is required.
3. Fix not implemented Day 32 — requires Andrea decision gate on prod-touching config change (CLAUDE.md production_safety feedback memory).
4. `SUPABASE_ANON_KEY` value not verified — if key is already in Vercel env, Option B may be 1-line fix in a `.env.watchdog` file.

---

**Status**: Diagnostic complete, fix deferred for Andrea approval. Day 32 scope: documentation only.
