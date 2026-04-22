# Day 32 Sprint Contract — Sprint 5 Day 04 bridge

**Date**: 2026-04-22 (cumulative Day 32, Sprint 5 Day 04)
**Branch**: `feature/sett-4-intelligence-foundations`
**Andrea gate**: STILL OPEN (Sprint 5 theme + ADR-008 Ajv + worker-probe URL change)
**Strategy**: Theme-agnostic tech-debt bridge — diagnostic-only Day 32 (context budget conservation)

---

## Goal

Close benchmark worker_uptime drag investigation without touching prod config (Andrea approval gate).

## Deliverables (1, minimal)

1. **`docs/audit/worker-uptime-root-cause-day-32.md`** — Root cause: probe 3 (`supabase-unlim-chat`) POSTs without SUPABASE_ANON_KEY → 401 → `ok: false` → worker_uptime 2/3. 4 remediation options (A-D) + recommendation (Option A: switch to anonymous healthz endpoint).

## Scope firewall

- No code change to `scripts/worker-probe.sh` (prod-adjacent, needs Andrea).
- No env file creation (Supabase key handling = prod config).
- No benchmark metric reweighting (affects baseline).
- Documentation + analysis only.

## Acceptance criteria

- [ ] Root cause identified with file+line citation.
- [ ] 4 remediation options enumerated with pros/cons.
- [ ] Recommendation stated with diff preview.
- [ ] Proposed fix gated on Andrea confirmation.

## Budget

0.5 SP (diagnostic only). No CoV 3x run needed — no code changed.

## Rationale for minimal scope

Context budget preservation across continuous loop. Day 30-31 consumed substantial context with full cycle (design + impl + test + docs). Day 32 intentionally small to preserve headroom for Day 33-34 work. Baseline hold preserved at 12371.
