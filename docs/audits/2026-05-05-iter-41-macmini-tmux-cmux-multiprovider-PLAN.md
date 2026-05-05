# Iter 41 — Mac Mini + tmux + cmux + Multi-Provider Workflow PLAN

**Data**: 2026-05-05 PM
**Status**: PLAN onesto, ratify-gated Andrea
**Context**: domanda Andrea iter 41 stop hook follow-up

---

## §1 STATUS verificato file-system + SSH probe live

### Mac Mini
✅ **ALIVE** non "probable dead" come handoff iter 36-39 affermavano (doc-drift M-AI-04 detector caught)

| Fact | Evidence |
|------|----------|
| Uptime | 2d 17h 38min |
| launchctl | `985	0	com.elab.mac-mini-autonomous-loop` ACTIVE |
| Claude desktop | PID 614 running |
| Cron L1 user-sim | every 5min firing iter 36 curriculum |
| Cron L2 workflow | every 30min firing |
| Latest aggregate commit | `aafc7ad` `iter36-aggregate-20260505T123000Z` cycles=3 (oggi) |
| SSH path | `progettibelli@100.124.198.59` via `~/.ssh/id_ed25519_elab` |

### tmux
✅ Installato `/opt/homebrew/bin/tmux` (locale)
❌ Zero session attive
❌ NON wired in autonomous workflow

### cmux
❌ NOT installato
❌ NOT in PATH
❓ `cmux` non identificato univocamente — possibili candidati:
- `sst/cmux` (Claude Code session multiplexer GitHub) — most likely Andrea reference
- `cmus`-style audio player (NO match context)
- proprietary "Claude multiplex" tool

### Multi-Provider Workflow
✅ Codex CLI v0.128.0 (`/Users/andreamarro/.npm-global/bin/codex`)
✅ Gemini CLI v0.40.1 (`/Users/andreamarro/.npm-global/bin/gemini`)
✅ Mistral primary 65/25/10 LIVE prod (Mistral primary + Gemini Flash + Together AI gated)
✅ M-AI-07 multi-vendor-anti-bias.sh CEGIS round 1-6 wired (Codex→Gemini→Mistral+Kimi parallel→Codex iter2→Claude synth)
✅ M-AI-08 vendor-context-injector.sh enforce ELAB preamble pre-call
✅ Voxtral primary TTS + voice clone Andrea LIVE iter 31

### Mechanisms M-AI-* installati `scripts/mechanisms/`
| Script | Purpose |
|--------|---------|
| M-AI-01 score-history-validator | Anti-inflation score validation |
| M-AI-02 mechanical-cap-enforcer | 8-cap evaluator dual CLI/library |
| M-AI-03 claim-reality-gap-detector | Stale claim detector 5 patterns |
| M-AI-04 doc-drift-detector | 4-pattern doc-drift catch (validated iter 39+40) |
| M-AI-05 multi-vote-G45-gate.sh | G45 multi-vote anti-inflation |
| **M-AI-07** multi-vendor-anti-bias.sh | **CEGIS 6-round Codex+Gemini+Mistral+Kimi+Claude orchestration** |
| **M-AI-08** vendor-context-injector.sh | **Preamble injection enforce per vendor call** |
| M-AR-01 auto-revert-pre-commit.sh | Auto-revert on regression |
| M-AR-05 smart-rollback.sh | Smart rollback worktree |

---

## §2 Plan integrato (4-tier)

### Tier 1 — IMMEDIATE autonomous activable (15 min total)

#### T1.1 tmux session ELAB autonomous (5 min)
Crea sessione persistente per parallel multi-vendor:

```bash
# Create persistent tmux session "elab-iter41"
tmux new-session -d -s elab-iter41

# 4 windows for 4 vendors parallel
tmux rename-window -t elab-iter41:0 'codex'
tmux new-window  -t elab-iter41:1 -n 'gemini'
tmux new-window  -t elab-iter41:2 -n 'mistral'
tmux new-window  -t elab-iter41:3 -n 'mac-mini-ssh'
tmux new-window  -t elab-iter41:4 -n 'orchestrator'

# Pre-load env in each
for w in codex gemini mistral; do
  tmux send-keys -t elab-iter41:$w "source ~/.elab-credentials/sprint-s-tokens.env" C-m
done

# Mac Mini SSH window — long-running ssh
tmux send-keys -t elab-iter41:mac-mini-ssh 'ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59' C-m

# Attach
tmux attach -t elab-iter41
# Detach: C-b d
# Resume: tmux attach -t elab-iter41
```

ROI: parallel vendor exec senza spawning multiple shells. Stato persiste cross-detach. Mac Mini SSH stays connected attraverso il session.

#### T1.2 Mac Mini revive iter 36 cron L3 (auto already firing — verify only, 2 min)
Mac Mini cron già firing L1 + L2. Manca L3 (every 2h heavy persona-prof simulation iter 36 design).

```bash
ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59 \
  "crontab -l | grep -E 'L3|2h|persona-prof' | head"
# If L3 missing → install per docs/pdr/MAC-MINI-USER-SIMULATION-CURRICULUM.md
```

#### T1.3 Verify M-AI-07 CEGIS workflow runnable (5 min)
Test end-to-end con atom briefing dummy:

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
source ~/.elab-credentials/sprint-s-tokens.env
echo "# Test Atom — verify M-AI-07
- Problem: smoke test M-AI-07
- Constraint: NO src/ changes
- Acceptance: 6 vendor calls complete + JSON aggregate" > /tmp/test-atom-briefing.md

bash scripts/mechanisms/M-AI-07-multi-vendor-anti-bias.sh test-smoke /tmp/test-atom-briefing.md
# Expected: automa/state/m-ai-07-test-smoke-*.json + 6 round timing
```

#### T1.4 cmux research + install decision (3 min)
Andrea: cosa intendi con cmux? 3 candidati:
1. `npm i -g sst/cmux` — Claude Code session multiplexer (più probabile)
2. `cmux` audio player (non rilevante)
3. proprietary tool

Risposta richiesta per proceed. Default raccomandato: tmux è sufficiente per parallel multi-vendor; cmux può essere nice-to-have per auto-snapshot sessions Claude.

---

### Tier 2 — WORKFLOW MULTI-PROVIDER iter 41 attivo (1h)

#### T2.1 Wire M-AI-07 to iter 41 P0.2 Step-Back deploy
Atom Step-Back PROPOSED già shipped iter 41 (`docs/audits/2026-05-05-iter-41-P0.2-step-back-PROPOSED.md`). Use M-AI-07 CEGIS to validate prima di deploy:

```bash
# Briefing for M-AI-07
cat > /tmp/atom-step-back-briefing.md <<'EOF'
# Atom: P0.2 Step-Back BASE_PROMPT v3.4

## Problem
R7 canonical 3.6% iter 38 baseline. Need lift via Step-Back hidden CoT.

## Edit shipped
supabase/functions/_shared/system-prompt.ts:167-175 +8 LOC NEW STEP-BACK INTERNO block PRIMA TAG INTENT.

## Acceptance gates
- ≤60 word cap preserve (NO output verbosity break)
- Latency p95 ≤2000ms (NO regression)
- R7 canonical ≥12% post-deploy (target +8pt min)
- R5 PZ V3 ≥85% preserve

## Constraints
- NO --no-verify deploy
- NO push diretto main
- NO verbose CoT output
EOF

bash scripts/mechanisms/M-AI-07-multi-vendor-anti-bias.sh step-back-validate /tmp/atom-step-back-briefing.md
# 6 vendors review hidden-CoT design + suggest improvements
# Output: automa/state/m-ai-07-step-back-validate-2026-05-05.json
```

ROI: pre-deploy CEGIS catches design flaws before paying R7 re-bench cost.

#### T2.2 Mac Mini parallel task queue iter 41 (4 task)
Sfrutta Mac Mini ALIVE per 4 task autonomous parallel:

| Task | Script | Expected duration | Output |
|------|--------|-------------------|--------|
| MM1 Wiki batch +20 concepts (126→146) | `~/scripts/elab-wiki-batch-gen-v2.sh` | ~4h overnight | docs/unlim-wiki/concepts/*.md |
| MM2 94 esperimenti Playwright UNO PER UNO (iter 21 carryover) | `tests/e2e/29-92-esperimenti-audit.spec.js` | ~3h | audit log broken count REAL |
| MM3 Lighthouse perf optim re-bench | `npx lighthouse https://www.elabtutor.school/#chatbot-only` | ~10 min | docs/audits/lighthouse-iter41-*.json |
| MM4 R5+R6+R7 batch re-bench | `scripts/bench/run-sprint-r{5,6,7}-stress.mjs` | ~30 min each | scripts/bench/output/*.json |

Dispatch via tmux mac-mini-ssh window:
```bash
ssh ... 'cd /Users/progettibelli/elab-builder && nohup bash mac-mini-task-MM1.sh > /tmp/mm1.log 2>&1 &'
```

#### T2.3 cross-vendor audit iter 41 atoms via repomix
P0.1 roadmap repomix install:

```bash
npm install -g repomix
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"

# 3 snapshots ready
repomix --include "src/services/**,supabase/functions/**" \
  --style markdown --compress -o /tmp/elab-backend.md
repomix --include "src/components/lavagna/**" \
  --style xml --compress -o /tmp/elab-lavagna.md
repomix --include "scripts/mechanisms/**" \
  --style markdown -o /tmp/elab-mechanisms.md

# Feed to Codex/Gemini for cross-provider review
codex chat < /tmp/elab-backend.md
gemini -p "Review this snapshot for iter 41 P0.2 Step-Back impact" < /tmp/elab-mechanisms.md
```

---

### Tier 3 — STRATEGIC week (Sprint U Cycle 3)

#### T3.1 Self-Consistency + ReAct stack su top P0.2 baseline
Post P0.2 R7 measured → P1.1 (Self-Consistency 3-vote) + P1.2 (ReAct RAG loop) stack.

#### T3.2 cmux install decision after Andrea response
If `sst/cmux` confirmed → wire as snapshot tool per ELAB session checkpoint.

#### T3.3 Mac Mini autonomous loop V3 design
Current V2 user-sim cron 3-livelli iter 36. Iter 41 V3 design:
- L4 NEW every 6h: full Sprint T close audit (R0+R5+R6+R7 + Lighthouse + Playwright esperimenti broken count)
- L5 NEW daily: Andrea Opus G45 indipendente review trigger if cumulative score ≥9.0 → email/Telegram alert

#### T3.4 Step-Back deploy v82 + R7 re-bench (Andrea-gated)
Sprint T close gate critical path.

---

### Tier 4 — REFLECT (mese)

#### T4.1 Score iter 41 close projection
- Iter 40 close: 8.6/10 G45 cap
- Iter 41 close projection: 8.7-8.8/10 (ONESTO modest +0.1-0.2 lift se P0.2 deploy + R7 ≥12% verified + tmux workflow live)
- Sprint T close 9.5/10 ONESTO realistic iter 43+ post Andrea Opus review G45 mandate

#### T4.2 Repo integration completion (12-repo roadmap §2-3 P0+P1)
- repomix LIVE
- Step-Back deployed + measured
- VoltAgent 3 sub-agents installed
- DESIGN.md 3 picks anchored .impeccable.md
- claude-mem pathfinder + learn-codebase primer per session
- MEMORY.md split 5000→200

---

## §3 Andrea Action Items iter 41 entrance

| # | Action | Effort | Gate type |
|---|--------|--------|-----------|
| 1 | Conferma cmux = `sst/cmux` o other? | 1 min | Question |
| 2 | Ratify Path A auth chain ELAB_API_KEY (iter 40 audit) | 5-30 min | Decision |
| 3 | Ratify P0.2 Step-Back deploy v82 + R7 re-bench | 30 min | Deploy |
| 4 | tmux session ELAB iter 41 setup OK? | 5 min | Setup |
| 5 | Mac Mini MM1-MM4 dispatch parallel? | 5 min | Trigger |
| 6 | Roadmap 12-repo P0.1 repomix install? | 1 min | Install |
| 7 | MEMORY.md split 5000→200 OK? | 1-2h | Refactor |
| 8 | Andrea Opus G45 indipendente review schedule | 30 min | Review |

---

## §4 Anti-pattern G45 enforced

- ✅ NO claim "Mac Mini revived" (was already alive — handoff iter 36-39 doc-drift)
- ✅ NO claim "tmux/cmux integrated" (plan only, NOT executed)
- ✅ NO claim "Step-Back R7 lift achieved" (deploy + bench gated Andrea)
- ✅ NO autonomous deploy
- ✅ NO autonomous Mac Mini cron modifications senza Andrea ratify
- ✅ NO push origin
- ✅ Cap 8.6 stable iter 41 PROPOSED phase

---

## §5 Cross-link

- Roadmap parent 12-repo: `docs/audits/2026-05-05-12-repo-roadmap-honest.md`
- Iter 40 honest findings: `docs/audits/2026-05-05-iter-40-FINDINGS-honest.md`
- Iter 41 P0.2 Step-Back PROPOSED: `docs/audits/2026-05-05-iter-41-P0.2-step-back-PROPOSED.md`
- M-AI-07 multi-vendor: `scripts/mechanisms/M-AI-07-multi-vendor-anti-bias.sh`
- M-AI-08 context injector: `scripts/mechanisms/M-AI-08-vendor-context-injector.sh`
- Mac Mini status: launchctl PID 985 + cron L1+L2 firing
- This plan: `docs/audits/2026-05-05-iter-41-macmini-tmux-cmux-multiprovider-PLAN.md`

End plan. Andrea ratify items §3 entrance to proceed.
