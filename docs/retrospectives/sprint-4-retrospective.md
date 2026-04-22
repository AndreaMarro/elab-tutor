# Sprint 4 Retrospective — sett-4-intelligence-foundations

**Retrospective date**: 2026-04-22 (GMT+8, same as Review)
**Sprint period**: Day 22 → Day 28 (7 days cumulative)
**Facilitator**: TPM autonomous session
**Participants (async)**: TPM + ARCHITECT + DEV + TESTER + AUDITOR (retrospective synthesized from daily audits 22-27)
**Format**: Start / Stop / Continue + 3 concrete action items

---

## Review outcomes recap (for context)

- Gate 13/13 PASS (first full-green sprint)
- 25/26 SP core (96% vs 87% Sprint 3)
- Tests +151 (12371 / +62 velocity vs Sprint 3)
- Bench 5.34 (+0.59)
- Auditor avg 7.69 (+0.16 vs Sprint 3)
- 2 blockers closed (npm audit, ADR-007 extraction)
- Zero regressions, zero PZ v3 violations, zero engine diff

---

## START (things to begin doing sprint-5+)

1. **PTC code_execution container CoV 5x parallel for real** — CoV 3x sequential used all 7 days. PTC 5x via `code_execution` tool would cut verification time ~60% (3 runs × 130s = 390s → 5 runs parallel ≈ 150s). Enabler for denser daily cycles.
2. **Playwright MCP browser live verification** — 0 calls Sprint 4. Axe baseline generated from static source. Real browser smoke would catch live-only regressions (hydration, CSP, real network).
3. **Use `/superpowers:subagent-driven-development` for parallel story execution** — Sprint 4 ran solo-coordinated. Stories S4.1.5 + S4.2.2 + S4.2.2b Day 26 could have parallelized via 3 isolated agents with file ownership boundaries.
4. **claude-mem observation save on EVERY commit (automated)** — Sprint 4 ad-hoc. Hook integration via `post-commit` would persist sprint context cheaply for cross-session recovery.
5. **End-week gate dry-run BEFORE Day 07** — discovered on Day 28 the script had `grep` bug capturing "Tests files 220" as test count. Running dry-run Day 25 would have caught earlier.

---

## STOP (things to stop doing)

1. **Stop writing "TEST 12XXX" in commit message + baseline files + state file separately** — triple-bookkeeping. Single source of truth should be `automa/state/baseline.json`. Commit message test count can be derived. Sprint 4 had 3 reconciliation moments (baseline-tests.txt lags, state file, benchmark.json) consuming 10+ min.
2. **Stop deferring E2E chromium install "tomorrow"** — GAP-DAY24-04 declared Day 25, still SPEC Day 28. 4 days carried. Install once (one-shot command) unblocks verification loop. Root cause: treated as "configuration" vs "must-have daily".
3. **Stop running `end-week-gate.sh` without `--dry-run` pre-flight** — production gate run includes `npm run build` + `vitest run` = ~3+ min. Dry-run clears 11/13 checks in ~5s and flags structural gaps before burning build time.
4. **Stop assuming `tasks-board.json` top-level `tasks` array exists** — schema drifted Sprint 1 to columnar, gate script never updated. Day 28 caught bug. Either deprecate file or freeze schema.
5. **Stop over-committing to "ONNIPOTENZA 33-tools" scope Sprint 5 without story-level DoR** — risk of Sprint 4 pattern expanded. Sprint 5 must pre-story DoR-gate before committing epic.

---

## CONTINUE (things to keep doing)

1. **Continue atomic commits per day with `[TEST NNNNN]` trailer** — traceability gold. Every Sprint 4 daily commit maps 1:1 to daily audit + CoV evidence.
2. **Continue Harness 2.0 4-grading daily audit** — 6/7 days audit written, forced self-critique with 5+ gap enumeration. Caught ADR-007 extraction need Day 27.
3. **Continue module extraction pattern Deno+Node (ADR-007)** — validated twice Day 26-27. `wiki-query-core.mjs` + `wiki-corpus-loader.mjs` shared. Scalable for 33-tools.
4. **Continue 2x+ daily CoV** — zero flaky tests Sprint 4. Discipline paid off vs Sprint 3 2 flaky catches.
5. **Continue ADR-first architecture decisions** — ADR-005 (watchdog), ADR-006 (3-layer), ADR-007 (extraction) all produced design artifacts that ARE the contract. Preventive vs reactive.
6. **Continue sprint contract pre-implementation (Harness 2.0)** — Sprint 4 contract FINAL Day 01 with Andrea-approved decisions scoped 26 SP matched 25 delivered. Strong signal alignment.
7. **Continue benchmark `--fast --write` daily** — 5.31 → 5.32 → 5.34 progression tracked objectively. Not self-rate.
8. **Continue zero PZ v3 violations audit grep** — 28 days straight green (since Day 01). Guardrail works.

---

## Action items (3 concrete + owners + due date)

### Action A-501 — Install Playwright chromium + run E2E smoke with BASE_URL prod

**Rationale**: GAP-DAY24-04 P2 carry Sprint 4 Day 25 → 28. Unblocks axe live browser verification + 16 E2E specs haven't run.

**Owner**: DEV
**Due**: Sprint 5 Day 02 (Day 30)
**Acceptance**:
- `npx playwright install chromium` completes
- `BASE_URL=https://www.elabtutor.school npx playwright test` runs 16 specs
- Axe smoke integrates `@axe-core/playwright` verified on /lavagna route
- Violation count recorded in `docs/audit/axe-smoke-day-30.md`

**Evidence path**: `automa/team-state/sprint-5-actions-tracker.json#A-501`

---

### Action A-502 — Automate claude-mem observation save on post-commit hook

**Rationale**: Retrospective START #4. Ad-hoc saves Sprint 4 missed 3 decisions (Day 22 afternoon gap, Day 24 audit summary, Day 27 ADR-007 rationale).

**Owner**: DEV
**Due**: Sprint 5 Day 01 (Day 29)
**Acceptance**:
- `.git/hooks/post-commit` invokes `mcp__plugin_claude-mem_mcp-search__search` save-observation with commit sha + subject + stats
- Zero rejected hook fire rate (sampled 5 commits)
- Documented in `docs/workflows/claude-mem-automation.md`

**Evidence path**: `automa/team-state/sprint-5-actions-tracker.json#A-502`

---

### Action A-503 — Deprecate tasks-board.json columnar OR migrate to flat schema aligned with end-week-gate

**Rationale**: STOP #4. Schema drift caused Day 28 gate patch + rework. Pick one source of truth.

**Owner**: TPM
**Due**: Sprint 5 Day 03 (Day 31)
**Acceptance**:
- Decision ADR-008: deprecate vs migrate
- If deprecate → file moved `automa/team-state/archive/` + gate script uses GitHub issues/PRs instead
- If migrate → flat `tasks[]` schema doc + back-compat adapter removed
- Zero end-week-gate bugs in Sprint 5 end gate Day 35

**Evidence path**: `automa/team-state/sprint-5-actions-tracker.json#A-503`

---

## Action items Sprint 3 → Sprint 4 completion audit (A-401..A-412)

| ID | Item | Status Sprint 4 | Notes |
|----|------|------------------|-------|
| A-401 | PTC CoV 5x parallel pattern | ✅ DRAFTED | Used sequentially only; PTC real invocation Sprint 5 |
| A-402 | Velocity tracking file create | ✅ DONE Day 22 | sett-3 backfill + sett-4 entries |
| A-403 | MCP calls ≥15/day enforcement | ✅ MET 6/7 days | Day 22 was 10 (below); Days 23-27 ≥15 |
| A-404 | ADR-003 Supabase anon key env | ⏳ DEFERRED Sprint 5 | Option B not dependent |
| A-405 | axe-core install | ✅ DONE Day 24 | via `@axe-core/playwright` |
| A-406 | accessibility_wcag metric wire | ✅ DONE Day 26 | live reads axe baseline |
| A-407 | ADR-005 watchdog noise | ✅ DRAFTED Day 23 | implementation carry Sprint 5 |
| A-408 | Together AI research | ✅ DONE Day 23 | `docs/research/2026-04-22-karpathy-llm-wiki.md` |
| A-409 | Blocker escalation protocol | ✅ FOLLOWED | Day 22 "ENV BLOCKER" header used for 2 items |
| A-410 | Daily auditor brutale | ✅ DONE 6/7 | Day 28 audit in flight this session |
| A-411 | Auto-critica ≥5 gaps | ✅ DONE 6/6 | each daily audit |
| A-412 | Sprint contract FINAL Day 01 | ✅ DONE | Andrea approved 5 decisions Day 22 07:55 |

**Completion**: 8/12 = 67% complete, 3/12 drafted/pending → Sprint 5 carry, 1/12 deferred (A-404).

---

## Sprint 4 honest criticism (brutal)

### What almost went wrong

1. **Day 22 Vitest claim inflation near-miss** — state said 12220, but session start vitest showed 12220 (matched, fine). BUT Day 25 wiki-query-core.test.js VERSION hardcoded `day26` broke Day 27 when VERSION bumped to `day27` — caught only because CoV 3x Day 27 showed test failure. Lesson: VERSION assertions must use regex `\d+` not literal day.
2. **Benchmark 5.31→5.32 Day 26 was suspect** — `previous_score` cached stale commit_sha. Delta 0.01 below variance. Day 27 write resolved (5.34). Risk of fake-gain gaming.
3. **ADR-007 almost didn't get written** — Day 26-27 extracted module pattern twice without design doc. Day 27 added ADR-007 retrospectively. Without ADR, pattern invisible to future agents → re-derivation risk.

### What is genuinely fragile

1. **Together AI dispatch never executed live**. S4.1.4c dry-run proved transport logic but ZERO evidence the Together API + cost + rate limits survive real load. Sprint 5 must gate Day 29 early or defer entire Wiki content track.
2. **Corpus loader tested on synthetic fixtures**. Real `docs/unlim-wiki/*.md` corpus has only skeleton (S4.1.2 Day 22). When batch output lands (S4.1.4c + 5c), loader behavior on 200+ files unverified. Should smoke test with `node -e "import('./scripts/wiki-corpus-loader.mjs').then(m => m.loadCorpus('docs/unlim-wiki'))"` before Sprint 5 Day 01.
3. **Benchmark accessibility metric reads axe baseline** but baseline is placeholder (zero violations from static scan). A11y number is artificially high until Playwright live scan Day 30.
4. **MCP Playwright never invoked Sprint 4** — production validation loop not exercised. Deploy Sprint 4 artifacts to prod would be blind. (Fortunately Sprint 4 is backend/scripts only, no UI deploy scope.)
5. **Sprint 4 branch not merged main** — 10 commits diverged. Integration risk grows per day post-gate. Andrea decision gate delay = debt accumulation.

### Why still worth Sprint 4 success

- Foundations ARE in place for 33-tools expansion
- 0 prod incidents + 0 regressions = discipline scale-works
- Module extraction pattern (ADR-007) provides template for next 10+ tools
- Benchmark moved directionally correctly
- Team (solo-coordinated) output quality stable

---

## Metrics entering Sprint 5

| Metric | Value | Source |
|--------|-------|--------|
| Tests baseline | 12371 | CoV 3x Day 28 verified |
| Benchmark | 5.34 | fresh write Day 28 |
| Blockers open | 0 P0/P1, 2 P2, 1 P3 | `automa/team-state/blockers.md` |
| Unpushed commits | 0 | `git status` Day 28 |
| Auditor rolling avg last 3 days | 7.93 | Days 25-27 audits |
| Velocity 3-sprint rolling avg | TBD Day 28 update | velocity-tracking.json |
| Sprint 4 final 4-grading | 7.69 | composite this doc |

---

## Learnings to propagate (add to CLAUDE.md?)

**Candidate 1**: VERSION assertions use regex `\d+` not literal day number.
- **Pro**: prevents hardcoded day test rot
- **Con**: diffuse rule, hard to enforce without lint
- **Decision**: add to `docs/workflows/testing-patterns.md` (NEW) Sprint 5 Day 02

**Candidate 2**: ADR-first when pattern repeats 2+ times.
- **Pro**: codifies tacit knowledge
- **Con**: may over-document
- **Decision**: add section to CLAUDE.md "Pattern emergence triggers ADR"

**Candidate 3**: End-week gate `--dry-run` mandatory pre-flight Day 07.
- **Pro**: fails fast, preserves time budget
- **Con**: adds step
- **Decision**: update `scripts/cli-autonomous/end-week-gate.sh` docstring + autopilot prompt

---

## Retrospective status: COMPLETE

**Next step**: `automa/state/velocity-tracking.json` update → Sprint 5 contract DRAFT → Day 28 audit → handoff → commit+push → Andrea decision gate.

**Signed**: TPM autonomous 2026-04-22 Day 28
