# Sprint T Iter 42 — Contract

**Date**: 2026-05-05 PM CEST
**Sprint**: T (close target iter 41-43 cumulative)
**Pattern**: Pattern S r3 5-agent OPUS PHASE-PHASE + Mac Mini SSH parallel + claude-in-chrome smoke (Andrea connettori mandate)
**G45 cap entry**: 8.0/10 (Opus indipendente baseline iter 39)
**G45 cap target iter 42 close**: 8.5-8.7/10 conditional Andrea ratify queue 5 P0

---

## Phase 0 baseline ENTRANCE (verified 2026-05-05 ~15:50 CEST)

| Check | Status | Evidence |
|-------|--------|----------|
| Vitest baseline | ⚠️ DRIFT | `[Run: cat automa/baseline-tests.txt]` `[See: 13887]` (prompt 13890 inflated -3) |
| HEAD branch | ✓ | `[Run: git log -1]` `[See: 36f6630]` (prompt f1e9ae5 drift +1 auto-state) |
| Branch | ✓ | `e2e-bypass-preview` |
| Mac Mini SSH | ✓ ALIVE | `[SSH: progettibelli@100.124.198.59]` `[See: uptime 2d 18h, PID 985 launchctl]` |
| Prod LIVE | ✓ | `[Curl: HTTPS]` `[See: HTTP/2 200, etag 02fae5c3]` |
| Edge Function unlim-chat | ⚠️ v83 PRE-Step-Back | `[See: ACTIVE 2026-05-04 12:13 UTC]` (Step-Back commit `737ff6b` 2026-05-05 15:00 CEST → +25h post v83) |
| Hook verification-evidence-gate.sh | ✓ WIRED | `[File: .claude/settings.local.json]` `[See: Stop block command + agent sequential]` |
| claude-mem corpus elab-sprint-T | ⚠️ EMPTY 0 obs | `[See: list_corpora]` (ingest pipeline broken Apr 23+, iter 36-41 NOT indexed) |
| repomix install | ❌ NOT INSTALLED | `[Run: which repomix]` `[See: not found]` (P0.4 iter 41 ratify queue voce 5 NON eseguito) |
| cegis-plus-orchestrator.sh | ❌ NOT EXIST | `[Run: ls scripts/mechanisms/]` (synthesis §3 design-only) |

---

## §1 Andrea ratify queue P0 ordered ROI (5 voci core + 7 secondary)

### P0 entrance gate

| # | Action | Effort | Andrea gate | ROI |
|---|--------|--------|-------------|-----|
| 1 | **Step-Back v84 deploy** unlim-chat (`SUPABASE_ACCESS_TOKEN` shell env required OR npx supabase persistent auth verified ✓) | 30 min | `autonomous deploy OK?` | R7 +8-13pt projection |
| 2 | **ELAB_API_KEY rotate** openssl rand 32 + 3-env sync (Vercel + Supabase + .env local) | 5-30 min | localizza Supabase OR rotate? | unblocca 12 Edge guard + R7 smoke |
| 3 | **Tea Glossario repo URL** (`https://elab-tutor-glossario.vercel.app/glossario` source) | 1 min | repo URL? | 4-6h clone scope iter 42+ atom |
| 4 | **HomePage main revert PR #62** Andrea ratify merge | 2 min | merge OK? | regression close (Andrea iter 41 mandate) |
| 5 | **PR #62 post-merge smoke prod** claude-in-chrome | 5 min | ratify smoke autonomous? | mechanical regression evidence |

### P1 secondary

6. tmux session `elab-iter42` 5-window setup
7. cmux install `sst/cmux` Tailscale shared session
8. Mac Mini cowork sincrono R1+R2+R3 (cowork-trigger script + Anthropic Max 2-session budget)
9. repomix install + cegis-plus-orchestrator.sh ship
10. iter 42 stack: Self-Consistency 3-vote + CoVe HIDDEN + Karpathy verifiable INTENT (R7 8-13 → 22-32%, R5 91.8 → 93.5-94.5%, +€0.40/day)
11. iter 43 stack ratify (ReAct + ToT-Hulbert panel + Generated-Knowledge gated) — R7 22-32 → 35-50%, R6 0.067 → 0.20-0.35
12. claude-mem ingest pipeline diagnose + restart (iter 36-42 corpus fix)

---

## §2 Caveman mode + connettori mandate

**ATTIVO full** per iter 42 entrance e durata sprint. Drop articles/filler/pleasantries/hedging. Code/commits/security: write normal.

**Connettori mandate Andrea iter 42 PM 2026-05-05** (memory `feedback_connettori_test_validation.md`):
- `mcp__computer-use__*` (control-mac) — desktop apps, screenshot validation
- `mcp__Macos__*` (macos) — App/Click/Snapshot native macOS
- `mcp__Control_Chrome__*` (control-chrome) — execute_javascript, page content
- `mcp__Claude_in_Chrome__*` (claude-in-chrome) — DOM-aware browser test, screenshot evidence

For TUTTI test + validazioni. Bracketed evidence inline mandatory.

---

## §3 Pattern S r3 5-agent OPUS PHASE-PHASE iter 42

### File ownership disjoint (zero write conflict)

| Agent | Path scope |
|-------|------------|
| **planner-opus** | `automa/tasks/pending/ATOM-S42-*.md` + `automa/team-state/sprint-contracts/*.md` |
| **architect-opus** | `docs/adrs/ADR-04*.md` (NEW) + `docs/audits/2026-05-05-iter-42-*.md` |
| **gen-app-opus** | `src/**`, `supabase/functions/**`, `vite.config.js` |
| **gen-test-opus** | `tests/**` (additions only), `scripts/bench/**` |
| **scribe-opus PHASE 2** | `docs/audits/2026-05-05-iter-42-PHASE3-CLOSE-audit.md` + handoff iter 43 + this CLAUDE.md APPEND post-orchestrator |

### Race-cond fix protocol Pattern S r3 (10° iter consecutive validate target)

1. Phase 1 4-agent parallel (planner+architect+gen-app+gen-test) WITHIN same Phase
2. Filesystem barrier `automa/team-state/messages/{agent}-iter42-phase1-completed.md` PRE Phase 2 spawn
3. Phase 2 SEQUENTIAL scribe-opus (post 4/4 confirmation)
4. Phase 3 orchestrator (vitest full + commit + push + Mac Mini smoke) post Phase 2

### Mac Mini parallel queue MM1-MM4

| Task | Trigger | Duration | Owner |
|------|---------|----------|-------|
| MM1 Wiki batch +20 (126→146 concepts) | Phase 1 R0 PASS | ~4h overnight | autonomous loop |
| MM2 lint:strict + tsc --noEmit | Phase 1 gen-app emit | ~2 min | SSH `progettibelli@100.124.198.59` |
| MM3 Playwright smoke 3 routes prod | Phase 1 gen-test emit | ~90s ∥ | SSH |
| MM4 92→94 esperimenti audit (Andrea iter 21+ carryover) | post Phase 3 deploy | ~3h headless | SSH cron L4 |

---

## §4 Anti-pattern G45 enforced iter 42

- ❌ NO claim "Sprint T close achieved" (target iter 41-43 cumulative + Andrea Opus G45 indipendente review Phase 7 mandate)
- ❌ NO claim "score >= 7" senza pattern `[Run:]` `[See:]` `[File:]` `[Curl:]` `[Bench:]` inline (verification-evidence-gate.sh mechanical enforce)
- ❌ NO claim "deploy LIVE" senza prod smoke verify connettori (claude-in-chrome screenshot evidence)
- ❌ NO claim "R7 ≥80% achievable" (literature ceiling 50% prompt-only stack iter 43)
- ❌ NO promise senza misurazione (literature projection ≠ ELAB measured)
- ❌ NO `--no-verify` commit (pre-commit hook block + iter 32 mandate)
- ❌ NO push diretto main (hook block + Andrea ratify merge gate via PR)
- ❌ NO destructive ops (rm -rf, git reset --hard, drop table — hook block)
- ❌ NO inflate ROI repo non-installed solo perché in lista popolare
- ❌ NO bypass G45 cap mechanical via "interpretation" / "context"
- ❌ NO mock / dati finti (Andrea iter 9 mandate persistente)

---

## §5 Cumulative caveat outstanding (iter 31-41 carryover Sprint T close gate)

1. Onniscenza canary 5%→25%→100% rollout per ADR-042 §7 (env `INCLUDE_UI_STATE_IN_ONNISCENZA=opt-in`)
2. Onnipotenza Deno port canary 5%→100% per ADR-041 §8 (env `CANARY_DENO_DISPATCH_PERCENT=0` default safe)
3. R5 N=3 warm-isolate re-bench (env unblocked iter 32, NO executed)
4. R6 page=0% Voyage re-ingest with page metadata (~$1, 50min, ADR-033 ratify gate)
5. R7 ≥80% canonical UNREACHABLE prompt-only (ceiling 50% iter 43 — fine-tune classifier OR registry pruning OR two-stage call)
6. R8 100-prompt fixture exec (post canary 5% stable)
7. Markers wave 24+ batch (15→100 cumulative target Phase 0 raccomandati 217 deferred)
8. Quality FAIL accumulato iter 12: 1340 fontSize<14 + 28 touch<44 + 6 console.log
9. Lighthouse perf optim Atom 42-A modulePreload (FAIL 26+23 iter 38)
10. Vol/pag verbatim ≥95% (gated Andrea Voyage re-ingest)
11. 92→94 esperimenti audit Playwright UNO PER UNO (Andrea iter 21+ carryover Sprint T close gate)
12. Linguaggio codemod 200 violations singolare→plurale (Andrea iter 21 mandate, A14 codemod 14 TRUE shipped iter 38, ~186 narrative deferred Sense 2 voice)
13. Vol3 narrative refactor ADR-027 (Davide co-author iter 33+ deferred Sprint U)
14. Andrea Opus G45 indipendente review Sprint T close mandate (NOT auto-claim)

---

## §6 Iter 42 deploy stack (gated Andrea ratify P1 voce 10)

```
+ Self-Consistency 3-vote dispatch (P1.1) — wrap Mistral function-calling 3x temp 0.7
+ Karpathy verifiable INTENT gate — PZ-7 schema-checked tool_name 62-registry, fail-closed default
+ CoVe HIDDEN (Chain-of-Verification, Dhuliawala 2023) — 4 LOC post-INTENT pre-emit reflection
```

**Projection**:
- R7 stacked: 8-13 → **22-32%** (literature, NOT ELAB-measured)
- R5: 91.8 → **93.5-94.5%**
- Cost: +€0.40/day total
- Latency: +80-150ms HIDDEN reflection (within ≤2000ms p95 target)

---

## §7 Iter 42 close gate

**G45 cap target onesto**: **8.5/10** conditional 5 P0 voci Andrea ratify + execution + connettori smoke evidence.

**Sprint T close iter 43+ target**: **9.5/10 ONESTO** conditional Onnipotenza canary 100% + Onniscenza canary 100% + 92→94 esperimenti audit + Lighthouse perf ≥90 + R6 ≥0.55 + R7 ≥80% (target ceiling-bound).

NO inflate. NO promise senza Andrea Opus G45 indipendente review.

---

## §8 Cross-link

- Plan iter 41 OPTIMAL WORKFLOW: `docs/audits/2026-05-05-iter-41-OPTIMAL-WORKFLOW-synthesis.md`
- Plan iter 41 Mac Mini cowork: `docs/audits/2026-05-05-iter-41-MACMINI-COWORK-SYNCHRONOUS-design.md`
- Plan iter 41 Step-Back PROPOSED: `docs/audits/2026-05-05-iter-41-P0.2-step-back-PROPOSED.md`
- Handoff iter 42 entrance: `docs/handoff/2026-05-05-iter-42-NEXT-SESSION-PROMPT.md`
- Andrea Opus G45 baseline iter 39: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`
- Memory feedback connettori: `~/.claude/projects/-Users-andreamarro-VOLUME-3/memory/feedback_connettori_test_validation.md`
- Memory feedback HomePage regression: `~/.claude/projects/-Users-andreamarro-VOLUME-3/memory/feedback_homepage_old_version_regression.md`
- PR HomePage revert: https://github.com/AndreaMarro/elab-tutor/pull/62

End sprint contract iter 42.
