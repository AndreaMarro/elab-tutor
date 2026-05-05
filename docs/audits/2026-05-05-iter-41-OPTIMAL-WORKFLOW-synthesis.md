# ELAB Tutor — OPTIMAL WORKFLOW Synthesis Iter 41

**Data**: 2026-05-05 PM
**Pattern**: 3 deep-dive parallel agents OPUS WebFetch + synthesis
**Goal**: integrare tutti repo high-ROI + plugin set + Mac Mini + multi-vendor + Pattern S r3 in UN UNICO workflow

---

## §1 Architettura — 9 Layer Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│  L0  PERSISTENCE  (claude-mem corpus + MEMORY.md split)     │
├─────────────────────────────────────────────────────────────┤
│  L1  PRE-FLIGHT   (R0: vitest + git + repomix snapshot)     │
├─────────────────────────────────────────────────────────────┤
│  L2  BRAINSTORM   (superpowers:brainstorming tradeoffs)     │
├─────────────────────────────────────────────────────────────┤
│  L3  PLAN         (superpowers:writing-plans atomic tasks)  │
├─────────────────────────────────────────────────────────────┤
│  L4  CEGIS-PLUS 8-ROUND VENDOR VALIDATION                   │
│  R1 Codex → R2 Gemini → R3a Mistral ∥ R3b Kimi →            │
│  R4 repomix cross-vendor → R5 Codex iter2 →                 │
│  R6 Claude synth ∥ R7 Mac Mini Playwright smoke →           │
│  R8 verification-before-completion gate                     │
├─────────────────────────────────────────────────────────────┤
│  L5  PARALLEL EXEC  (Pattern S r3 5-agent OPUS PHASE-PHASE) │
│      + dispatching-parallel-agents (independent tasks only) │
│      + Mac Mini parallel queue MM1-MM4                      │
├─────────────────────────────────────────────────────────────┤
│  L6  VERIFY  (M-AI-02 cap + M-AI-03 claim + M-AI-04 drift)  │
├─────────────────────────────────────────────────────────────┤
│  L7  SYNTHESIZE  (scribe phase 2 + claude-mem rebuild_corpus)│
├─────────────────────────────────────────────────────────────┤
│  L8  DEPLOY GATE  (finishing-a-development-branch + Andrea) │
├─────────────────────────────────────────────────────────────┤
│  L9  BENCH + AUDIT  (R5+R6+R7 + Lighthouse + score history) │
└─────────────────────────────────────────────────────────────┘
```

---

## §2 Hook Configuration — `.claude/settings.local.json`

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {"type": "command", "command": "bash scripts/hooks/build-gate.sh"},
          {"type": "command", "command": "bash scripts/hooks/verification-evidence-gate.sh"}
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {"type": "command", "command": "node -e \"console.log('claude-mem rebuild_corpus elab-sprint-T queued')\""}
        ]
      }
    ]
  }
}
```

`scripts/hooks/verification-evidence-gate.sh` regex check: blocca Stop se ultimo messaggio contiene `score >= 7` ma manca pattern `\[Run:.*\]\[See:.*\]` evidence. Anti-pattern G45 8.6→5.8 inflation enforced mechanically.

---

## §3 tmux Session `elab-iter41` Bootstrap

`scripts/mechanisms/cegis-plus-orchestrator.sh` (da creare iter 41 P0):

```bash
#!/usr/bin/env bash
# CEGIS-PLUS 8-round orchestrator with tmux 5-window
set -euo pipefail
ATOM="${1:-}"
BRIEF="${2:-}"
SESSION="elab-iter41"

[[ -z "$ATOM" || -z "$BRIEF" ]] && { echo "usage: $0 <atom> <briefing-file>"; exit 1; }

tmux kill-session -t "$SESSION" 2>/dev/null || true
tmux new-session -d -s "$SESSION" -n "main"

# w0 main: orchestrator R0/R1/R2/R5
tmux send-keys -t "$SESSION:main" \
  "source ~/.elab-credentials/sprint-s-tokens.env && bash scripts/mechanisms/M-AI-07-multi-vendor-anti-bias.sh '$ATOM' '$BRIEF'" C-m

# w1 vendors-3: parallel mistral+kimi tail
tmux new-window -t "$SESSION" -n "vendors-3"
tmux send-keys -t "$SESSION:vendors-3" \
  "tail -F /tmp/m-ai-07-${ATOM}-r3a.json /tmp/m-ai-07-${ATOM}-r3b.json" C-m

# w2 r4-repomix: cross-vendor consistency check
tmux new-window -t "$SESSION" -n "r4-repomix"
tmux send-keys -t "$SESSION:r4-repomix" \
  "until [ -f automa/team-state/messages/r3-completed.md ]; do sleep 5; done; \
   bash scripts/mechanisms/cegis-r4-repomix-cross.sh '$ATOM'" C-m

# w3 mac-mini: ssh smoke + lint parallel
tmux new-window -t "$SESSION" -n "mac-mini"
tmux send-keys -t "$SESSION:mac-mini" \
  "ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59 \
   'cd elab-builder && bash scripts/mac-mini-cegis-runner.sh ${ATOM}'" C-m

# w4 r8-gate: verification + cap enforcer
tmux new-window -t "$SESSION" -n "r8-gate"
tmux send-keys -t "$SESSION:r8-gate" \
  "until [ -f automa/team-state/messages/r5-completed.md ]; do sleep 5; done; \
   node scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs --atom='$ATOM' && \
   node scripts/mechanisms/M-AI-03-claim-reality-gap-detector.mjs && \
   node scripts/mechanisms/M-AI-04-doc-drift-detector.mjs" C-m

tmux attach -t "$SESSION"
# Detach: C-b d   |   Resume: tmux attach -t elab-iter41
```

Total wall-clock: ~6m sequential + 90s MM parallel = ~6m end-to-end.
Total cost: ~$0.013/atom ($0.005 baseline + $0.008 R4 + R8 free).

---

## §4 CEGIS-PLUS 8-Round — costo + ROI per round

| Round | Vendor | Time | $ | ROI | Decision gate |
|-------|--------|------|---|-----|---------------|
| **R0** PRE-FLIGHT | local | 90s | 0 | 35% | vitest GREEN + critical files clean → else ABORT |
| **R1** CODEX implement | gpt-5-codex | 45s | $0.003 | 20% | non-empty + code fences |
| **R2** GEMINI critique | gemini-2.5-flash | 25s | $0.001 | 15% | valid JSON + ≥1 finding |
| **R3a** MISTRAL IT K-12 | mistral-medium | 20s | $0.001 | 10% | anti-bias JSON IT pedagogy |
| **R3b** KIMI K2.6 256K | kimi-256k | 30s | $0.002 | 10% | new finding detect |
| **R4** REPOMIX CROSS | mistral-medium | 40s | $0.002 | 8% | alignment ≥6 cross-vendor |
| **R5** CODEX iter2 | gpt-5-codex | 50s | $0.004 | 15% | finalize integrate findings |
| **R6** CLAUDE synth | session | 3min | $0.05* | — | ONLY src/ writer + commit |
| **R7** MAC MINI smoke | local Mac Mini | 90s ∥ | 0 | 12% | Playwright 0 errors + HTTP 200 |
| **R8** VERIFICATION | local | 60s | 0 | 25% | M-AI-02 cap + M-AI-04 drift PASS |

*R6 inclusa in Claude session subscription Anthropic Max

ROI catch rate +30% vs old 6-round. Coverage +35% (R0 baseline gate prevents wasted vendor spend on broken baseline).

---

## §5 Stack ordering iter 41 → 43 (BASE_PROMPT lift R5/R6/R7)

### Iter 41 (deployed pending Andrea)

```
P0.2 STEP-BACK HIDDEN CoT (8 LOC) — system-prompt.ts:167-175
```
- R7 baseline 3.6% → projection **8-13%** post-deploy ELAB-conservative (literature +8-12pt benchmark, NOT ELAB-measured yet)
- R5 91.8% preserve
- Cost: ~€0.10/day prod traffic
- Status: PROPOSED — Andrea ratify gate

### Iter 42 (next deploy stack)

```
+ Self-Consistency 3-vote dispatch (P1.1 roadmap) — wrap Mistral function-calling 3x temp 0.7
+ Karpathy verifiable INTENT gate — PZ-7 schema-checked tool_name from 62-registry, fail-closed default
+ CoVe HIDDEN (Chain-of-Verification, Dhuliawala 2023) — 4 LOC post-INTENT pre-emit reflection
```
- R7 stacked: 8-13 → **22-32%**
- R5: 91.8 → **93.5-94.5%**
- Cost: +€0.10/day CoVe + €0.20/day Self-Consistency = €0.40/day total
- Latency: +80-150ms HIDDEN reflection (within ≤2000ms p95 target)

### Iter 43 (Sprint T close stack)

```
+ ReAct Thought→Action→Observation RAG loop (P1.2 roadmap) — explicit Mistral tool calls max-2-iter
+ ToT-Hulbert single-prompt panel (Hulbert 2023) — 6 LOC HIDDEN 3-expert vote
+ Generated-Knowledge Prompting (Liu 2022) — gated chit_chat+deep_question only — pre-RAG knowledge expansion 2 frasi K-12 IT
```
- R7 stacked: 22-32 → **35-50%** (still BELOW ≥80% target — honest gap)
- R5: → **95-96%** (target met ≥95%)
- R6 hybrid recall@5: 0.067 → **0.20-0.35** (still below ≥0.55 target — Voyage re-ingest required iter 44+)
- Cost: total €0.50/day worst-case (AT cap)

### Honest ceiling

R7 ≥80% UNREACHABLE da 3.6% con prompt-only stack in 2 iter. Iter 44+ requires:
- (a) Fine-tuned Mistral classifier head, OR
- (b) Registry pruning 62→25 high-frequency tools, OR
- (c) Two-stage call (cheap model classifier → Mistral function call)

NON COMPIACENZA: NO promise R7 ≥80% via prompt edits soli.

---

## §6 Mac Mini Parallel Queue MM1-MM4 (continuous L4 design iter 41)

| Task | Trigger | Script | Duration | Output |
|------|---------|--------|----------|--------|
| **MM1** Wiki batch +20 (126→146) | R0 PASS | `~/scripts/elab-wiki-batch-gen-v2.sh` | ~4h overnight | docs/unlim-wiki/concepts/*.md |
| **MM2** lint:strict + tsc --noEmit | R1 emit | `npm run lint:strict && npx tsc --noEmit` | ~2 min | `automa/team-state/messages/mm2-lint.md` |
| **MM3** Playwright smoke 3 routes | R5 emit (∥ R7) | `npx playwright test tests/e2e/00-smoke.spec.js` + screenshot 3 routes + curl prod | ~90s | `automa/state/m-ai-07/${atom}-r7-mm-smoke.json` |
| **MM4** PR autonomous OR Andrea Telegram | R8 PASS | `gh pr create` (if AUTO_PR_GATE=manual → wait Andrea) | manual | PR URL |

Cron L4 NEW (every 6h): full Sprint T close audit (R0+R5+R6+R7 + Lighthouse + 87-test Playwright harness)
Cron L5 NEW daily 09:00: Andrea Opus G45 indipendente review trigger if cumulative score ≥9.0 → email/Telegram alert

---

## §7 Pattern S r3 race-cond fix preserved

### Filesystem barrier

```
automa/team-state/messages/
├── r0-completed.md  (PRE-FLIGHT)
├── r1-completed.md  (CODEX)
├── r2-completed.md  (GEMINI)
├── r3a-completed.md (MISTRAL parallel)
├── r3b-completed.md (KIMI parallel)
├── r3-completed.md  (BOTH 3a+3b emitted → barrier release)
├── r4-completed.md  (REPOMIX)
├── r5-completed.md  (CODEX iter2)
├── r6-completed.md  (CLAUDE synth — ONLY src writer)
├── r7-completed.md  (MAC MINI smoke)
└── r8-completed.md  (VERIFICATION gate)
```

Each round: `until [ -f automa/team-state/messages/r${N-1}-completed.md ]; do sleep 5; done`

### Disjoint file ownership (zero write conflict)

- R1/R5: `/tmp/*r1.txt` `/tmp/*r5.txt`
- R2: `/tmp/*r2.json`
- R3a/R3b: `/tmp/*r3a.json` `/tmp/*r3b.json`
- R4: `/tmp/*r4.json`
- R7: `automa/state/m-ai-07/*r7-mm.json`
- R8: `automa/state/m-ai-07/*r8-gate.json`
- **R6**: ONLY writer to `src/**` AND commits → eliminates write conflict

### Stale-state guard (iter 11 race-cond fix)

R6 reads `r0-preflight.git_sha` and rejects if `git rev-parse HEAD` differs (prevents iter 11 scribe-stale 3.4 vs reality 5.0 class).

### Cap enforcement (G45 anti-inflation iter 38 class)

R8 applies M-AI-02 mechanical cap on PASS verdict (R5 latency, R7 canonical, Lighthouse perf) BEFORE letting R6 commit → prevents inflation regression.

---

## §8 claude-mem corpus workflow ELAB

### PRE-SESSION (5 min)

```bash
# One-time per major refactor
/claude-mem:learn-codebase

# One-time per Sprint
/claude-mem:pathfinder
# → produces PATHFINDER-2026-05-05/{00-features.md, 01-flowcharts/, 02-duplication-report.md, 03-unified-proposal.md, 04-handoff-prompts.md}

# Each session entrance
mcp__claude-mem__build_corpus name="elab-sprint-T" project="elab-builder" \
  concepts="lavagna,unlim,supabase" types="bugfix,decision" limit=500
mcp__claude-mem__prime_corpus name="elab-sprint-T"
# → captures session_id for cross-iter continuity
```

### IN-SESSION (continuous)

- `mcp__claude-mem__smart_search` — KEEP existing usage (grep-style)
- `mcp__claude-mem__query_corpus` name="elab-sprint-T" question="..." — NEW: queries primed conversational corpus, persists session_id, BETTER for "why did we choose X over Y" cross-iter rationale
- `/claude-mem:knowledge-agent` query="..." — synthesized answers from observation history

### POST-SESSION (auto via SessionEnd hook)

```bash
# In .claude/settings.local.json SessionEnd hook
mcp__claude-mem__rebuild_corpus name="elab-sprint-T"
```

### SKIPS (non compiacenza)

- `search` MCP — REDUNDANT with smart_search. Skip.
- `timeline` MCP — overlap timeline-report skill, only for explicit chronological audit.

---

## §9 8-Phase Pipeline Per Iter

```
Phase 0  PRE-FLIGHT   git status + vitest 13474 + claude-mem prime + repomix snapshot
Phase 1  BRAINSTORM   superpowers:brainstorming → docs/superpowers/brainstorm-iter{N}.md
Phase 2  PLAN         superpowers:writing-plans → docs/superpowers/plans/iter{N}-{topic}.md
Phase 3  PARALLEL EXEC Pattern S r3 5-agent OPUS PHASE-PHASE +
                       dispatching-parallel-agents per task indipendente +
                       Mac Mini MM1-MM4 queue dispatch
Phase 4  CEGIS-PLUS   8-round vendor validation R0-R8 (L4 layer)
Phase 5  VERIFY       verification-before-completion gate per agent +
                       repomix cross-vendor + M-AI-04 doc-drift
Phase 6  SYNTHESIZE   scribe phase 2 (sequential, post 4-6/4-6 completion msgs) +
                       claude-mem rebuild_corpus elab-sprint-T → re-prime
Phase 7  DEPLOY GATE  finishing-a-development-branch (test+merge-base+4-option menu) →
                       Andrea ratify Telegram via Mac Mini Cowork
Phase 8  BENCH+AUDIT  R5+R6+R7 + Lighthouse + score MUST cite Phase 5 evidence (anti-inflation)
```

---

## §10 Anti-pattern G45 enforced

- ✅ NO claim "workflow LIVE" (PROPOSED, components individually shippable)
- ✅ NO claim "R7 ≥80% achievable" (honest ceiling 50% prompt-only stack iter 43)
- ✅ NO autonomous Mac Mini cron mods (Andrea ratify gate)
- ✅ NO `--no-verify`
- ✅ NO push diretto main
- ✅ Cost cap €0.50/day enforced — NO promise senza budget
- ✅ Verification-evidence-gate hook = mechanical anti-inflation enforce
- ✅ Honesty caveat: every projection literature-based, NOT ELAB-measured

---

## §11 Andrea ratify queue iter 41 entrance — ordered ROI

| # | Action | Effort | Gate | ROI |
|---|--------|--------|------|-----|
| 1 | cmux conferma `sst/cmux` o other? | 1 min | Q | clarification |
| 2 | Path A auth chain ELAB_API_KEY (iter 40) | 5-30 min | Decision | unblocks 12 Edge Functions |
| 3 | tmux session `elab-iter41` setup OK | 5 min | Setup | Pattern S r3 + CEGIS-PLUS infrastructure |
| 4 | Step-Back P0.2 deploy v82 + R7 re-bench | 30 min | Deploy | R7 +8-13pt projection |
| 5 | repomix install + R4 cross-vendor wire | 5 min | Install | CEGIS-PLUS round 4 enable |
| 6 | Hook .claude/settings.local.json verification-evidence-gate.sh | 10 min | Setup | mechanical anti-inflation |
| 7 | claude-mem build_corpus + prime_corpus elab-sprint-T | 5 min | Setup | cross-iter persistence |
| 8 | Mac Mini MM1-MM4 parallel queue trigger | 5 min | Trigger | autonomous throughput |
| 9 | MEMORY.md split 5000→200 + .claude/rules/elab-*.md | 1-2h | Refactor | context rot 40% mitigation |
| 10 | iter 42 stack ratify (Self-Consistency + CoVe + Karpathy gate) | 1h | Decision | R7 22-32% projection |
| 11 | iter 43 stack ratify (ReAct + ToT + Generated-Knowledge) | 1h | Decision | R7 35-50% projection |
| 12 | Andrea Opus G45 indipendente review schedule iter 43 close | 30 min | Review | Sprint T close gate |

---

## §12 Cross-link

- 12-repo roadmap: `docs/audits/2026-05-05-12-repo-roadmap-honest.md`
- iter 40 honest findings: `docs/audits/2026-05-05-iter-40-FINDINGS-honest.md`
- iter 41 P0.2 Step-Back PROPOSED: `docs/audits/2026-05-05-iter-41-P0.2-step-back-PROPOSED.md`
- iter 41 macmini+tmux+cmux PLAN: `docs/audits/2026-05-05-iter-41-macmini-tmux-cmux-multiprovider-PLAN.md`
- M-AI-07 multi-vendor: `scripts/mechanisms/M-AI-07-multi-vendor-anti-bias.sh`
- M-AI-08 context injector: `scripts/mechanisms/M-AI-08-vendor-context-injector.sh`
- This synthesis: `docs/audits/2026-05-05-iter-41-OPTIMAL-WORKFLOW-synthesis.md`

End synthesis. Andrea ratify items §11 entrance to operate workflow ottimale iter 41+.
