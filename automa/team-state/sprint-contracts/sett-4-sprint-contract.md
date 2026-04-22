# Sprint 4 Contract — sett-4-intelligence-foundations (FINAL Option B)

**Sprint**: 4/8 PDR 8-week
**Period**: 2026-04-29 (mar) → 2026-05-05 (lun), 7 days cumulative Day 22-28
**Branch**: `feature/sett-4-intelligence-foundations` (create from main post PR #18 merge)
**Format**: Harness 2.0 + Agile Scrum
**Status**: **FINAL** — Andrea approved 2026-04-22 07:55 (5 decisions resolved)
**Baseline**: sett-3 end state (tests 12220, benchmark 4.75, auditor avg 7.53)
**Prod deployed**: 2026-04-22 07:58 — `dpl_9ocrgUWYkpwm1MmHGQeQ3kSJqVYe` (www.elabtutor.school HTTP 200 verified)

---

## Sprint Theme — LOCKED Option B

**INTELLIGENCE FOUNDATIONS — Karpathy LLM Wiki Proof-of-Concept**

Per PDR 8-week roadmap: sett-4 opens intelligence track. Karpathy three-layer LLM Wiki research committed Day 03 sett-3 (`0413649` research doc, evaluated ibrido RAG+Wiki). Sprint-4 implements POC to validate pattern before sprint-5 ONNIPOTENZA 33-tools integration.

Dashboard real-data deferred sprint-5 when Tea onboarded (30/04 scheduled) for parallel track without split-focus penalty.

---

## Andrea Decisions Resolution (2026-04-22 07:55)

1. **PR #18 merge + prod deploy** → ACCEPTED. PR merged `2b5bab7`. Deploy `dpl_9ocrgUWYkpwm1MmHGQeQ3kSJqVYe` LIVE. CoV 4x verified (3x pre-merge + 1x post-merge main).
2. **axe-core install** → APPROVED. Add `@axe-core/playwright` as devDep sprint-4 Day 03 (S4.2.1).
3. **PR #17 triage** → NO-OP. Already merged 2026-04-21T21:19:40Z as sett-2 closure, sprint-3 draft ref was stale.
4. **Sprint-4 theme** → **Option B LOCKED**. Rationale below.
5. **ADR-003 Supabase anon key provisioning** → DEFERRED sprint-5 (not needed for Option B track).

### Option B rationale (brutal honest)

- **Aligns PDR original theme**: sett-4 = OMNISCIENCE in 8-week roadmap, Wiki IS knowledge consolidation pattern.
- **Differentiator competitivo**: no competitor has LLM Wiki; Dashboard real-data is table-stakes.
- **Sprint-3 lesson**: single concentrated track (Option B) delivered 11/13 gate vs sett-2 fragmented pattern.
- **Tea onboarding 30/04**: Sprint-4 starts 29/04 = 1 day overlap. Without Tea Day 01, parallel Option C = split focus = worse. Tea starts Option A sprint-5 with Dashboard real-data clean track.
- **PNRR deadline 30/06**: Dashboard MVP needed sprint-5/6 window, not sprint-4 urgency.
- **Base sprint-5 ONNIPOTENZA**: wiki_query / wiki_ingest / wiki_lint become 3 of 33 tools.

---

## Sprint Scope (Option C default, to re-contract if A/B selected)

### Epic 4.1 — Karpathy LLM Wiki POC (15 SP — MAIN TRACK)

Reference: `docs/research/2026-04-22-karpathy-llm-wiki.md` (Day 03 research commit `0413649`)

| Story | SP | Day target | Owner |
|-------|----|-----------|-------|
| S4.1.1 ADR-006 three-layer detail + SCHEMA.md wiki conventions | 3 | Day 01-02 | ARCHITECT |
| S4.1.2 `docs/unlim-wiki/` skeleton (index.md + log.md + dirs) | 2 | Day 02 | DEV |
| S4.1.3 Ingest script 92 esperimenti → `experiments/*.md` | 3 | Day 03-04 | DEV + Together AI |
| S4.1.4 Ingest script 27 lezioni + 20-30 concetti | 3 | Day 04-05 | DEV + Together AI |
| S4.1.5 Edge Function `unlim-wiki-query` (tool-use pattern) | 2 | Day 05-06 | DEV |
| S4.1.6 Integration tests 10+ wiki pipeline | 2 | Day 06 | TEST |

### Epic 4.2 — Benchmark uplift levers (8 SP)

| Story | SP | Day target | Owner |
|-------|----|-----------|-------|
| S4.2.1 axe-core `@axe-core/playwright` install + a11y baseline | 3 | Day 03 | DEV + TEST |
| S4.2.2 accessibility_wcag metric wire to `benchmark.cjs` | 2 | Day 04 | DEV |
| S4.2.3 unlim_latency_p95 runtime pipeline (Supabase `unlim_metrics` table + ring-buffer flush) | 3 | Day 04-05 | DEV |

### Epic 4.3 — Process + Integrity (3 SP)

| Story | SP | Day target | Owner |
|-------|----|-----------|-------|
| S4.3.1 A-401 PTC code_execution CoV 5x parallel | 1 | Day 01 | TPM |
| S4.3.2 A-402 Velocity tracking sett-3 backfill + sett-4 file create | 1 | Day 01 | TPM |
| S4.3.3 A-407 Watchdog noise suppression ADR-005 | 1 | Day 02 | DEV |

### Deferred sprint-5 (Dashboard real data track)

Triggered when Tea onboarded (30/04 scheduled, Day 02 sett-4):
- S5.x.1 Supabase Edge Function `dashboard-data` real query + RLS
- S5.x.2 useDashboardData hook live endpoint wiring (remove mock)
- S5.x.3 E2E spec 15 adapt live mode
- S5.x.4 Teacher JWT auth flow (ADR-004)
- S5.x.5 ADR-003 Supabase anon key env provisioning (Vercel + Supabase dashboards)

**Total sett-4**: ~26 SP (committed range 25-35 SP, 3 sprint rolling avg 24.7 SP).

---

## Day 01 P0 (kickoff)

1. Andrea decision points 5 (below) resolved via Slack/standup async
2. Create branch `feature/sett-4-intelligence-foundations` from main (post-merge)
3. Baseline snapshot `baseline-sett-4-day-01.json`
4. Sprint contract finalize (this doc → FINAL)
5. Daily standup Day 01 entry
6. Velocity tracking sett-3 backfill + sett-4 file create
7. PR #17 triage decision

---

## Definition of Ready (DoR) Epic 4.x

- [ ] Acceptance criteria 3-15 enumerated per story
- [ ] Story SP Fibonacci (1/2/3/5/8/13)
- [ ] Owner assigned
- [ ] Dependencies declared
- [ ] Test strategy noted
- [ ] Rollback plan (if destructive)
- [ ] Environment requirements (env vars, external deps)
- [ ] Andrea blocker escalation (if any) — **Day 01 header, not Day 06 discovery**

---

## Definition of Done Sprint 4

- [ ] Option C stories ≥ 70% complete OR Option A/B pivoted formally Day 03 max
- [ ] Tests PASS ≥ 12220 (no regression from sett-3 baseline)
- [ ] Benchmark ≥ 5.0 (sett-3 target met + buffer)
- [ ] Auditor avg ≥ 7.6 (+0.07 vs sett-3 7.53)
- [ ] CoV 5x daily Day 04+ (via PTC parallel)
- [ ] MCP calls ≥ 15/day enforced (red-flag < 10)
- [ ] ≥ 2 blockers closed
- [ ] 12 action items sprint-3 (A-401 to A-412) — ≥ 8 completed
- [ ] Retrospective + review + PR ready Day 07
- [ ] Zero engine semantic diff
- [ ] Zero PZ v3 violations

---

## Success metrics target

- Tests: ≥ 12250 (+30 from sett-3 end)
- Benchmark: ≥ 5.0
- Auditor avg: ≥ 7.6
- Blockers closed: ≥ 2
- Commits: 25-40 atomic
- PZ v3 violations: 0
- Engine diff: 0

---

## 4-grading target (sprint avg)

- Design: 7.8
- Originality: 7.0 (Karpathy layer 1 novel)
- Craft: 8.0
- Functionality: 7.8
- **Target media**: 7.65/10

---

## Stop conditions

- Sett-end-gate Day 07 FAIL → sprint-5 remedial
- Quota 429 persistent → session pause
- Context compact > 3x → handoff
- Blocker hard 5-retry-fail → pivot Option A/B
- Andrea 5 Qs unresolved Day 03 → scope fallback Option A

---

## Out of Scope Sprint 4

- Simulator engine changes (engine hard lock — sprint-8+ only)
- Major UI redesign beyond Dashboard Phase 2
- New NPM deps beyond Andrea pre-approved
- Mobile-native build (PWA preserved)
- Multi-language i18n (deferred sprint-6)

---

## Open Questions (Andrea Day 01 decisions)

1. **Sprint theme selection**: A / B / C (TPM recommends C)
2. **axe-core install** (A-405 from sprint-3 retro): approve / deny / defer
3. **PR #17 sprint-2**: merge / close / rebase / keep-draft
4. **ADR-003 anon key env provisioning**: Supabase anon key for probe + dashboard
5. **ADR-004 teacher JWT flow**: align Epic 4.1 S4.1.4 implementation details

---

## 3 Pilastri Scrum enforcement (inherited from sett-3 Day 01)

- **Trasparenza**: all artifacts in repo (docs/, automa/)
- **Ispezione**: daily auditor brutale + auto-critica ≥5
- **Adattamento**: 12 action items A-401..A-412 tracked in `automa/team-state/sprint-4-actions-tracker.json`

---

## Blocker escalation protocol (NEW sprint-4 A-409)

Any environment / credential / infrastructure blocker:
- **Day 01 standup**: declare in header "ENV BLOCKER DETECTED: <desc>"
- **Day 02 if unresolved**: open BLOCKER-XXX + Andrea notify explicit
- **Day 03 if unresolved**: raise severity P1 → P0 + scope pivot consideration
- **Day 04 if unresolved**: MUST pivot scope (Option A/B fallback) or defer feature

---

**End Sprint 4 Contract DRAFT.**

Status: awaiting Andrea 5 decision points + sett-3 merge + branch creation.
