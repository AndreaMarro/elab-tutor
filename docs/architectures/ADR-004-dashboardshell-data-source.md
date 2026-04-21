# ADR-004 — DashboardShell Data Source

**Status**: Proposed
**Date**: 2026-04-21 (sett-2 Day 06, cumulative Day 13)
**Deciders**: Andrea Marro (pending review), TPM inline
**Context**: sett-2 Sprint Contract Day 05 task T1-005 (Dashboard v2 continue)
**Related**: ADR-003 (JWT 401 Edge Function auth), T1-005 task, Day 11 commit `297e969` (route wired)

## Context

`DashboardShell` placeholder component landed Day 11 wired to `#dashboard-v2` hash route. Renders static skeleton. Data source unresolved.

Dashboard purpose per PDR: teacher sees student progress per kit session — experiments completed, errors, nudges triggered, time spent, Supabase-logged interactions.

Upstream data already captured in Supabase:
- `sessions` table (student + session_id + started_at + ended_at)
- `events` table (event_type + payload json + session_id + created_at)
- `unlim_chat` (prompt + response + tokens + cost)

Dashboard needs to **aggregate** these server-side-ish (not 10k rows raw fetch to client).

## Decision

**Adopt Option B — Supabase Edge Function proxy** (`/dashboard-data`).

Trade-off:
- Supabase-js direct (Option A): simplest, RLS enforces auth, but 10k row fetch to client is infeasible and business logic leaks to frontend.
- Edge Function proxy (Option B, **chosen**): brain/hands decoupling per Harness 2.0. Aggregation server-side (Supabase SQL), client consumes pre-shaped JSON, cheap + cacheable + auditable.
- Hardcoded mock (Option C): Day 13 placeholder, not production.

### Option B details

**Endpoint**: `POST /functions/v1/dashboard-data`
**Auth**: dual-header (per ADR-003) — `apikey` + `Authorization: Bearer <JWT>`. Teacher JWT scoped to their students' sessions only.
**Payload request**:
```json
{
  "teacher_id": "uuid",
  "range": { "from": "ISO-8601", "to": "ISO-8601" },
  "view": "overview|per-student|per-experiment|errors-only"
}
```

**Payload response** (shape stable, versioned via `schema_version`):
```json
{
  "schema_version": 1,
  "range": {...},
  "teacher_id": "...",
  "totals": {
    "students": 0,
    "sessions": 0,
    "experiments_completed": 0,
    "errors": 0,
    "unlim_messages": 0,
    "cost_usd": 0
  },
  "per_student": [
    {"id": "...", "name": "...", "sessions": 0, "experiments": [...], "last_active": "..."}
  ],
  "per_experiment": [
    {"id": "v1-cap6-esp1", "completed_by": 0, "avg_errors": 0}
  ],
  "generated_at": "ISO-8601",
  "cache_hit": false
}
```

### Auth model

- Teacher login → Supabase Auth → JWT with `role: teacher` claim
- Edge Function validates JWT + verifies `teacher_id` matches `sub` claim
- RLS on `sessions` table: `auth.uid() = teacher_id OR auth.jwt() ->> 'role' = 'admin'`
- Frontend passes JWT via `Authorization: Bearer` header per ADR-003

### Error handling

- 401 → frontend redirect login
- 404 → teacher not found (impossible post-auth) → log + 500 downgrade
- 500 → toast "Dati non disponibili, riprova tra 1 minuto" + retry exponential backoff (3 attempts)
- 504 (aggregation timeout >30s) → fallback cached last result + warning banner "Dati del {timestamp}"

### Cache strategy

- Edge Function caches aggregation in Supabase KV (or Upstash Redis) keyed by `{teacher_id}:{range_hash}:{view}`
- TTL 10 min (student activity updates live but near-realtime not critical for PDR)
- Cache invalidation: on `events` insert, `sessions` mutation → dispatch webhook → clear keys matching teacher
- Phase 1 skip cache, add after Dashboard MVP proves value

### Offline behavior

- Dashboard requires network (Dashboard ≠ simulator — teacher uses separate device typically)
- If offline → show error state "Connessione richiesta per Dashboard" + retry button
- Service worker does NOT cache Dashboard (data freshness > availability for teacher workflow)

## Consequences

### Positive
- Brain/hands decoupling enforced (SQL aggregation server, view logic client)
- Payload shape versioned → frontend + backend evolve independently
- Auth fully locked via RLS + JWT claim verification
- Cheap: single request per Dashboard load, aggregation < 200ms typical
- Audit trail via Edge Function logs (Vercel/Supabase)

### Negative
- Extra Edge Function to maintain (increases deploy surface)
- Cache invalidation complexity (phase 2)
- Cold start Supabase Edge ~500ms first request (vs direct query ~50ms hot path)

### Migration path

Phase 1 (Day 14-17): scaffold Edge Function `/dashboard-data` returning hardcoded mock matching shape → frontend consumes via new hook `useDashboardData(range, view)`.

Phase 2 (Day 18-21): implement real SQL aggregation in Edge Function, dogfood with test teacher account, verify RLS.

Phase 3 (sett-3): add cache layer + webhook invalidation, performance test with 10 teachers × 30 students × 90 day range.

## Links

- sett-2 sprint contract: `automa/team-state/sprint-contracts/sett-2-sprint-contract.md`
- ADR-003 (JWT auth): `docs/architectures/ADR-003-jwt-401-edge-function-auth.md`
- Route wiring commit: `297e969` (Day 11)
- E2E smoke: `tests/e2e/14-dashboard-v2.spec.js` (Day 12)
- Blocker open: NPM_DEPS_APPROVAL_PENDING (Vercel AI SDK — separate from Dashboard)

## Open Questions (Andrea decides)

1. **Teacher onboarding flow** — how does a teacher get their JWT? Current Supabase Auth UI sufficient or dedicated login page?
2. **Cost attribution** — `cost_usd` field includes Together API cost per-teacher. How attributed? Per-session tag metadata?
3. **Multi-classroom support** — teacher can have 3 classrooms × 25 students. `per_student` array 75 long, UI grouping required?
4. **Historical retention** — sessions older than 90 days purged? Aggregated into monthly rollups?
5. **Export CSV** — Dashboard CSV export in scope sett-2 or deferred?

Answer these before Phase 2 implementation.
