# Sprint 5 Contract DRAFT — sett-5 (theme TBD pending Andrea)

**Status**: DRAFT — awaiting Andrea 5-decision gate post Sprint 4 merge
**Drafted**: 2026-04-22 Day 28 GMT+8 (autonomous session)
**Period (proposed)**: Day 29 (2026-04-23 gio) → Day 35 (2026-04-29 mar), 7 days cumulative
**Branch (proposed)**: `feature/sett-5-onnipotenza-foundations` (create from main post Sprint 4 merge)
**Entry baseline**: Sprint 4 end state (tests 12371, bench 5.34, auditor 7.69, 0 P0/P1 blockers, 3-sprint rolling avg velocity 21.33 SP)

---

## Sprint 5 themes — 2 options (Andrea pick A or B or A+B parallel)

### Option A — ONNIPOTENZA foundations (33-tools kick-off)

Per PDR 8-week roadmap sett-5 = ONNIPOTENZA expansion. Sprint 4 Wiki POC ADR-007 extraction pattern + Edge Function scaffold = template for 32 additional tools.

**Candidate tool scope** (pick 3-5 from):

| # | Tool | Complexity | Dep |
|---|------|------------|-----|
| T1 | `unlim-wiki-query` (already Sprint 4) | shipped | - |
| T2 | `wiki-ingest` (live Together dispatch) | med | S4.1.4c gate |
| T3 | `wiki-lint` (markdown schema conform) | low | — |
| T4 | `glossary-query` (term definition) | low | corpus |
| T5 | `volume-page-fetch` (Vol N page P text slice) | low | PDFs extracted |
| T6 | `experiment-lookup` (exp ID → pages + kit list) | med | volume-references.js |
| T7 | `circuit-describe` (DSL → natural) | med | simulator-api |
| T8 | `code-compile-stub` (C++ → HEX test harness) | high | n8n Hostinger |
| T9 | `vision-analyze-circuit` (breadboard foto → diag) | high | Gemini Vision |
| T10 | `tts-speak` (Kokoro + Edge fallback) | med | Edge VPS stable |

**Sprint 5 Option A scope**: 5 tools (T2-T6) × avg 4 SP each = 20 SP + integration tests 3 SP + ONNIPOTENZA dispatcher scaffold 3 SP = **26 SP**.

### Option B — Dashboard real-data (Tea onboarded 30/04)

Tea joins Day 02 Sprint 5. Sprint 4 deferred Dashboard real-data for clean Tea onboarding.

**Epic 5.x**:
- S5.x.1 Supabase Edge Function `dashboard-data` real query + RLS (5 SP)
- S5.x.2 `useDashboardData` hook live wire (remove mock) (3 SP)
- S5.x.3 E2E spec 15 adapt live mode (2 SP)
- S5.x.4 Teacher JWT auth flow ADR-004 impl (3 SP)
- S5.x.5 ADR-003 Supabase anon key env provisioning (2 SP)
- S5.x.6 Dashboard load perf < 3s (2 SP)

**Sprint 5 Option B scope**: ~17 SP + 3 SP Tea pairing shadow + 3 SP integration = **23 SP**.

### Option A+B parallel (if Tea is solo-productive Day 02)

- Option A core Andrea 70% (18 SP)
- Option B Tea 100% (17 SP)
- Integration days 05-06
- Risk: split-focus penalty Sprint 2 pattern

**Sprint 5 Option A+B scope**: ~35 SP (above rolling avg +13.67 risk) — DANGER zone.

---

## Open Questions for Andrea (5)

1. **Sprint 5 theme selection**: A / B / A+B? (TPM recommends Option A + defer B to Sprint 6 unless Tea onboarding flexes Sprint 5 start date)
2. **S4.1.4c Together AI live dispatch**: authorize API key + budget ($X daily cap)? Unblocks 2 SP Sprint 4 carry + 4 SP Sprint 5 Option A T2.
3. **Tea onboarding date confirm**: 30/04 = Sprint 5 Day 02. Is the date firm? Onboarding session planned pre-work or in-sprint?
4. **ADR-004 teacher JWT + ADR-003 anon key provisioning**: if Sprint 5 Option B, which provisioning env dashboard does Andrea own (Vercel + Supabase) vs delegate TPM?
5. **PDR roadmap adherence vs market pull**: original PDR sett-5 = ONNIPOTENZA. Recent PNRR deadline 30/06 pulls Dashboard up. Honor PDR or adapt?

---

## Sprint 5 pre-loaded Sprint 4 carry (8 SP)

Regardless Option A/B selection, Sprint 5 starts with:

| Story | SP | Source |
|-------|----|-------|
| S4.1.4c Together AI live dispatch | 1 | Sprint 4 P2 carry |
| S4.1.5c real wiki corpus wire | 1 | Sprint 4 P2 carry |
| S4.2.3 unlim_latency_p95 pipeline | 3 | Sprint 4 P3 carry |
| GAP-DAY24-04 E2E chromium + axe live | 2 | Sprint 4 P2 carry |
| ADR-005 watchdog noise impl | 1 | Sprint 4 P3 carry (ADR drafted) |

Net Sprint 5 new-scope budget: 26 SP committed range - 8 SP carry = **~18 SP NEW work** (Option A) OR **~15 SP NEW** (Option B) OR **~27 SP NEW** (Option A+B — RED).

---

## Sprint 5 Action items carry from Sprint 4 retrospective

| ID | Action | Owner | Due Day | SP |
|----|--------|-------|--------|----|
| A-501 | Install Playwright chromium + E2E smoke BASE_URL prod | DEV | 30 | 1 |
| A-502 | Automate claude-mem observation post-commit hook | DEV | 29 | 1 |
| A-503 | Deprecate/migrate tasks-board.json schema (ADR-008) | TPM | 31 | 1 |

**Carry block**: 3 SP out of Sprint 5 first 3 days.

---

## Harness 2.0 4-grading targets Sprint 5

| Dim | Target | Delta vs Sprint 4 |
|-----|--------|-------------------|
| Design | 7.9 | +0.12 |
| Originality | 7.4 | +0.17 (ONNIPOTENZA dispatcher novel if Option A) |
| Craft | 8.1 | +0.07 |
| Functionality | 7.9 | +0.18 |
| **Composite** | **7.83** | +0.14 |

---

## Definition of Done Sprint 5 (preliminary, pending theme lock)

- [ ] ≥ 70% committed stories DONE OR formal pivot Day 03 max
- [ ] Tests PASS ≥ 12371 (no regression from Sprint 4)
- [ ] Benchmark ≥ 5.8 (+0.46 stretch; minimum 5.4 floor)
- [ ] Auditor avg ≥ 7.8
- [ ] CoV 5x PTC parallel real invocation ≥ 3 days
- [ ] MCP calls ≥ 18/day (+3 above Sprint 4 floor)
- [ ] Playwright MCP browser_navigate ≥ 1 real invocation/day Days 30+
- [ ] ≥ 3 blockers closed from Sprint 4 carry
- [ ] Sprint 4 A-401..A-412 Sprint 5 carry (4) all closed by Day 33
- [ ] Retrospective + review + PR ready Day 35
- [ ] Zero engine semantic diff
- [ ] Zero PZ v3 violations
- [ ] Sprint 4 end-week gate 13/13 maintained Sprint 5 pattern

---

## Success metrics Sprint 5 (bold targets)

- Tests: ≥ 12520 (+149 stretch; floor +80)
- Benchmark: ≥ 5.8 stretch; ≥ 5.4 floor
- Auditor avg: ≥ 7.8
- Blockers closed: ≥ 3 (from 8 SP carry)
- Commits: 25-40 atomic
- PZ v3 violations: 0
- Engine diff: 0
- If Option A: ≥ 3 new tools ONNIPOTENZA operational (query → response round-trip)
- If Option B: Dashboard real-data flow end-to-end demoable prod

---

## Stop conditions (inherit Sprint 4 + add)

- Sprint 5 end-gate Day 35 FAIL → Sprint 6 remedial
- Quota 429 persistent → session pause
- Context compact > 3x → handoff
- Blocker hard 5-retry-fail → pivot A→B or vice versa
- Andrea 5 Qs unresolved Day 01 → scope fallback (minimum 8 SP carry work only)
- **NEW**: Tea onboarding delay > 2 days post 30/04 → Option A locked solo Sprint 5 (no Option B start)

---

## Out of Scope Sprint 5

- Simulator engine changes (engine hard lock — sprint-8+ only)
- Major UI redesign beyond Dashboard Phase 2 (if Option B)
- New NPM deps beyond Andrea pre-approved (except Playwright chromium binary for A-501)
- Mobile-native build (PWA preserved)
- Multi-language i18n (deferred sprint-6)
- Simulator 21-component expansion (sprint-8 kit-physical audit dependent)

---

## 3 Pilastri Scrum enforcement (inherited Sprint 4)

- **Trasparenza**: all artifacts in repo
- **Ispezione**: daily auditor brutale + auto-critica ≥5
- **Adattamento**: 12+ action items tracked `automa/team-state/sprint-5-actions-tracker.json`

---

## Sprint 5 Day 01 kickoff checklist (Day 29)

1. Andrea 5 decisions resolved via Slack/session
2. Sprint 5 contract FINAL (this doc → FINAL)
3. Baseline snapshot `baseline-sett-5-day-01.json`
4. Tasks-board schema decision A-503
5. post-commit claude-mem hook A-502
6. Branch create from main
7. Sprint 5 action tracker file

---

## Blocker escalation protocol (inherit)

Day 01 header declare → Day 02 notify Andrea → Day 03 severity bump → Day 04 scope pivot.

---

**End Sprint 5 Contract DRAFT.**

**Status**: DRAFT awaiting Andrea 5 decisions + Sprint 4 main merge + Tea 30/04 confirm.
**Signed**: TPM autonomous 2026-04-22 Day 28 GMT+8.
