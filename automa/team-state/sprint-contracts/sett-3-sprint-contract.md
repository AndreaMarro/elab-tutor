# Sprint 3 Contract — sett-3 (DRAFT SKELETON)

**Sprint**: 3/8 PDR 8-week
**Period**: 2026-04-22 (mar) → 2026-04-28 (lun), 7 days
**Branch**: `feature/sett-3-[name]` (final name sprint-3 Day 01 after Andrea NPM decision)
**Format**: Harness 2.0
**Status**: DRAFT — finalize Day 01 after sett-2 merge + NPM decision
**Based on**: sprint-2 retrospective action items A-301..A-308

---

## Sprint Goal Options (Andrea decides Day 01)

### Option A — UNLIM Tool-Calls (IF NPM APPROVED)
Integrate Vercel AI SDK 5 with tool-calling for UNLIM. Shipping: tool schema, backend wrapper, 3 demo tools (circuit inspection, code review, experiment lookup), E2E spec 15.
Benchmark lift target: +0.5 (unlim_latency + feature)

### Option B — Dashboard + Benchmark Lift (IF NPM DENIED OR DEFERRED)
Ship Dashboard Phase 1 functional + close 4 benchmark gaps (git_hygiene, accessibility_wcag, worker_uptime, unlim_latency_p95).
Benchmark lift target: +0.8 (pure instrumentation + feature)

**Default (if Andrea silent Day 01)**: Option B (debt-safe, higher benchmark lift).

---

## Carry-over from Sprint 2

### Blockers OPEN
| ID | Severity | Age | Owner | Plan |
|----|----------|-----|-------|------|
| BLOCKER-011 | P0 | 5 days | Andrea | Day 01 mandatory decision |
| BLOCKER-007 | P3 | ~2 weeks | DEV | render-warmup verify |
| ADR-003 | P3 | ~1 week | Andrea | anon-key CLI verify |

### Debt residual
- Dashboard Phase 1 scaffold (Edge Function + hook)
- Benchmark git_hygiene regex fix
- Accessibility WCAG tooling (axe-core)
- Worker uptime probe
- UNLIM latency log pipeline
- Bundle dynamic-import refactor
- 5 ADR-004 open questions Andrea input pending

---

## 7-day Roadmap (preliminary)

| Day | Date | Focus | P0 |
|-----|------|-------|-----|
| 01 | mar 22/04 | Sprint planning + NPM decision + Scope lock | kickoff, scope decision doc |
| 02 | mer 23/04 | Scoring script audit + Dashboard Phase 1 start | benchmark.cjs regex fix, Edge Function mock stub |
| 03 | gio 24/04 | Accessibility tooling + worker probe | axe-core baseline, probe script |
| 04 | ven 25/04 | UNLIM latency pipeline + bundle split | perf logs, dynamic imports |
| 05 | sab 26/04 | Main scope day (tool-calls OR dashboard live) | feature logic |
| 06 | dom 27/04 | E2E spec 15 + polish + audit | new spec, audit Day 06 |
| 07 | lun 28/04 | Sprint review + retrospective + PR + deploy | gate + merge |

---

## Success Metrics (Sprint end)

- **Tests**: ≥ 12170 (target +4 minimum, +50 stretch)
- **Benchmark**: ≥ 4.8/10 Option A | ≥ 5.0/10 Option B
- **Auditor avg**: ≥ 7.5/10 (sprint-2 miss remediated)
- **Blockers closed**: 2/3 minimum (BLOCKER-011 mandatory, pick one other)
- **Commits**: 25-35 atomic
- **E2E spec**: 15+
- **PZ v3 violations**: 0
- **Engine semantic diff**: 0
- **Dashboard live** (if Option B): functional mock → real data by Day 05

---

## Definition of Done (sprint)

- [ ] NPM decision documented (approve OR deny OR defer with timeline)
- [ ] Scoring script regexes audited + fixed
- [ ] CoV 5x PASS end-of-sprint
- [ ] Build PASS
- [ ] Zero regression vs sprint-2 baseline 12166
- [ ] 4 benchmark gaps addressed (even partial)
- [ ] Retrospective + review done
- [ ] PR body draft ready
- [ ] Handoff sprint-3 complete
- [ ] 2+ blockers closed

---

## Out of Scope Sprint 3

- Simulator engine changes (engine lock)
- Supabase schema migrations (coordinate Andrea)
- Deploy authorization (Andrea only)
- Major UI redesign beyond Dashboard

---

## Stop Conditions

- Sett-end-gate Day 07 (lun 28/04)
- Quota 429 persistent
- Context compact > 3x
- Blocker hard 5-retry-fail

---

## 4-grading target (sprint avg)

- Design: 7.5
- Originality: 6.5 (Option A), 6.0 (Option B)
- Craft: 8.0
- Functionality: 7.5
- **Target media**: 7.4/10

---

## Open Questions (Day 01 kickoff)

1. NPM approval?
2. Option A vs Option B scope decision?
3. ADR-004 open Qs answered? (teacher JWT, cost attribution, multi-classroom, retention, CSV export)
4. Priority if time compression: instrumentation OR feature?
