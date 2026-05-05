# Iter 42 Next Session — Paste-Ready Prompt ELAB Tutor Sprint T Close

**Author**: ELAB Tutor multi-iter handoff (iter 40 + 41 close)
**Date**: 2026-05-05 PM
**Target**: paste in next Claude Code session (Opus 4.7 1M context recommended)
**Caveman mode**: ATTIVO (full)
**Mandate**: massima onestà, NO compiacenza

---

## §0 PASTE-READY PROMPT (copia tutto questo block)

```
iter 42 ELAB Tutor Sprint T close honest verifiable atoms. Caveman mode ATTIVO full
non compiacenza. Score G45 cap MECCANICO 8.6 attuale. R7 baseline 3.6%. Sprint T close
9.5/10 realistic iter 43+ post Andrea Opus G45 indipendente review (NON iter 42 single-shot).

## CONTESTO ENTRATA — leggi PRIMA

1. CLAUDE.md (project root) — sprint history iter 28-39 +40+41 close cumulativo
2. docs/handoff/2026-05-05-iter-42-NEXT-SESSION-PROMPT.md (questo file)
3. docs/audits/2026-05-05-iter-40-FINDINGS-honest.md — 3 falsifications iter 39 handoff
4. docs/audits/2026-05-05-12-repo-roadmap-honest.md — 12-repo verdict matrix + ROI
5. docs/audits/2026-05-05-iter-41-OPTIMAL-WORKFLOW-synthesis.md — 9-layer + CEGIS-PLUS
6. docs/audits/2026-05-05-iter-41-MACMINI-COWORK-SYNCHRONOUS-design.md — pair-programming sincrono
7. docs/audits/2026-05-05-iter-41-P0.2-step-back-PROPOSED.md — Step-Back deploy gated Andrea

## VERIFICA BASELINE (CoV mandatorio entrance)

Prima ANY action — bracketed evidence:
- vitest 13890 PASS [Run: npx vitest run] [See: 13890/13890 + 15 skipped + 8 todo]
- branch e2e-bypass-preview HEAD: 737ff6b "feat(iter-40-41): Step-Back P0.2 + CEGIS-PLUS infra"
- prod LIVE www.elabtutor.school [Curl: index-CK-6WD_m.js HTTP 200]
- Mac Mini SSH ALIVE [SSH: progettibelli@100.124.198.59 ~/.ssh/id_ed25519_elab]
  uptime 2d+, launchctl PID 985 com.elab.mac-mini-autonomous-loop ACTIVE
- supabase project: euqpdueopmlllqjmqnyb (Edge Function ref)

## OBIETTIVI iter 42 ROI ordinati

### P0.1 Path A auth chain repair (Andrea-gated, 5-30 min)
ELAB_API_KEY 3-env sync (Vercel VITE_ELAB_API_KEY EMPTY blocker iter 32 mandate non
completato). Andrea: localizza plain-text key Supabase hash a04b4398 OR rotate
openssl rand -hex 32. Sblocca 12 Edge Functions guard.

### P0.2 Step-Back deploy v82 + R7 200-prompt re-bench (Andrea-gated, 30 min)
src edit GIA shipped commit 737ff6b system-prompt.ts +8 LOC HIDDEN CoT. Andrea:
SUPABASE_ACCESS_TOKEN=sbp_XXX npx supabase functions deploy unlim-chat
Smoke 5 prompts canonical INTENT + R7 stress 200-prompt fixture. Target ≥12% canonical
(8-13% conservative projection literature). REVERT se <8%.

### P0.3 verification-evidence-gate hook wire-up (10 min, autonomous)
Edit .claude/settings.local.json hooks block aggiungi:
{"hooks":{"Stop":[{"matcher":"*","hooks":[
  {"type":"command","command":"bash scripts/hooks/verification-evidence-gate.sh"}
]}]}}
Anti-G45 inflation enforce mechanically (test exit 2 verified iter 41).

### P0.4 repomix install + R4 cross-vendor wire (5 min, autonomous)
npm install -g repomix
Verifica scripts/mechanisms/cegis-r4-repomix-cross.sh runnable.

### P0.5 Mac Mini co-work setup (Andrea-gated R1+R2+R3)
Decisione 3 voci §7 design doc:
- R1 cowork-trigger script + cron design ratify
- R2 Anthropic Max 2-session budget OK?
- R3 cmux install (sst/cmux) Tailscale shared session?

### P1 Stack iter 42 NEW (post P0.2 deploy + R7 baseline)
+ Self-Consistency 3-vote dispatch (P1.1 roadmap)
+ Karpathy verifiable INTENT gate — PZ-7 schema-checked tool_name 62-registry
+ CoVe HIDDEN (Chain-of-Verification, Dhuliawala 2023) 4 LOC post-INTENT
Projection cumulative: R7 8-13 → 22-32%, R5 91.8 → 93.5-94.5%, cost +€0.40/day.

### P2 92→94 esperimenti audit Playwright UNO PER UNO (Andrea iter 21+ carryover)
Spec EXISTS tests/e2e/29-92-esperimenti-audit.spec.js 396 LOC.
Mac Mini parallel queue MM2 task: ~3h headless run, output broken count REAL.

## PLUGIN STACK ATTIVO ELAB iter 42 (verifica disponibilità prima usare)

### Tier 1 — CORE WORKFLOW (mandatory)
- /superpowers:brainstorming — tradeoff exploration NEW atom
- /superpowers:writing-plans — atomic task plan
- /superpowers:executing-plans — implementation phase
- /superpowers:test-driven-development — TDD discipline
- /superpowers:verification-before-completion — anti-inflation gate
- /superpowers:dispatching-parallel-agents — independent task split (Pattern S r3 5-agent OPUS)
- /superpowers:subagent-driven-development — implementer + reviewer loop
- /superpowers:systematic-debugging — root cause discipline (3-fix architecture rule)
- /superpowers:finishing-a-development-branch — deploy gate menu

### Tier 2 — PERSISTENCE
- /claude-mem:learn-codebase — full read prime per session
- /claude-mem:pathfinder — feature track mapping detect duplication
- /claude-mem:knowledge-agent — synthesized answers from observations
- /claude-mem:make-plan — phased plan
- /claude-mem:do — execute phased plan
- /claude-mem:smart_search — grep-style raw obs (already used)
- /claude-mem:smart_outline / smart_unfold — codebase navigation

### Tier 3 — ELAB CUSTOM (file-system shipped)
- /elab-quality-gate — pre/post session gate
- /elab-principio-zero-validator — runtime PZ V3 compliance
- /elab-onnipotenza-coverage — INTENT dispatcher coverage
- /elab-onniscenza-measure — RAG retrieval recall
- /elab-velocita-latenze-tracker — perf p95
- /elab-morfismo-validator — Sense 1+2 Morfismo
- /elab-rag-builder — RAG corpus build
- /elab-harness-real-runner — REAL Playwright 87 esperimenti
- /elab-macmini-controller — task queue dispatcher SSH
- /elab-runpod-orchestrator — RunPod GPU lifecycle (TERMINATED Path A)

### Tier 4 — MULTI-PROVIDER MECHANISMS (file-system scripts)
- scripts/mechanisms/M-AI-01-score-history-validator.mjs — anti-inflation history
- scripts/mechanisms/M-AI-02-mechanical-cap-enforcer.mjs — 8-cap evaluator G45
- scripts/mechanisms/M-AI-03-claim-reality-gap-detector.mjs — 5-pattern stale claim
- scripts/mechanisms/M-AI-04-doc-drift-detector.mjs — 4-pattern doc-drift (catch iter 39+40 doc-drift)
- scripts/mechanisms/M-AI-05-multi-vote-G45-gate.sh — multi-vote anti-inflation
- scripts/mechanisms/M-AI-06-prompt-state-validator.mjs — prompt CoV
- scripts/mechanisms/M-AI-07-multi-vendor-anti-bias.sh — CEGIS 6-round
  (Codex r1 → Gemini r2 → Mistral r3a ∥ Kimi r3b → Codex iter2 r5 → Claude r6 synth)
- scripts/mechanisms/M-AI-08-vendor-context-injector.sh — preamble enforce per vendor
- scripts/mechanisms/M-AR-01-auto-revert-pre-commit.sh — auto-revert regression
- scripts/mechanisms/M-AR-05-smart-rollback.sh — smart rollback worktree
- scripts/mechanisms/cegis-plus-orchestrator.sh — 8-round tmux 5-window (NEW iter 41)
- scripts/mechanisms/cegis-r4-repomix-cross.sh — round 4 cross-vendor (NEW iter 41)
- scripts/hooks/verification-evidence-gate.sh — Stop hook anti-inflation (NEW iter 41)

### Tier 5 — DESIGN/UI
- /impeccable:critique — UX evaluation
- /impeccable:audit — technical quality checks
- /impeccable:typeset — typography fix
- /impeccable:arrange — layout improvement
- /impeccable:colorize — strategic color palette
- /impeccable:harden — interface resilience
- /impeccable:clarify — UX copy improvement
- /impeccable:adapt — cross-device adaptation
- .impeccable.md (project root) — design source-of-truth

### Tier 6 — INTEGRATION/INFRA
- /vercel:deploy — Vercel deployment
- /vercel:env — env vars management
- /vercel:status — deployment status
- /supabase:supabase — Supabase ops
- /playwright (mcp) — browser automation
- /serena (mcp) — symbol-level codebase search
- /context7 (mcp) — library docs fetch
- /sentry / /posthog — observability
- /atlassian:* — Confluence + Jira

## WORKFLOW MULTI-PROVIDER 8-ROUND CEGIS-PLUS

```
R0 PRE-FLIGHT  (90s, $0, ROI 35%)  — vitest + git + repomix snapshot — gate ABORT su fail
R1 CODEX       (45s, $0.003)       — gpt-5-codex implement briefing
R2 GEMINI      (25s, $0.001)       — gemini-2.5-flash deep critique JSON
R3a MISTRAL    (20s, $0.001)       — mistral-medium IT K-12 anti-bias parallel
R3b KIMI       (30s, $0.002)       — kimi-256K NEW finding parallel
R4 REPOMIX     (40s, $0.002, ROI 8%) — mistral cross-vendor consistency check NEW iter 41
R5 CODEX iter2 (50s, $0.004)       — finalize integrate findings
R6 CLAUDE      (3min, incl)        — Claude session synth + commit (ONLY src writer)
R7 MAC MINI    (90s ∥, $0)         — Playwright smoke 3 routes parallel R6 NEW iter 41
R8 VERIFY      (60s, $0, ROI 25%)  — M-AI-02 cap + M-AI-03 claim + M-AI-04 drift NEW iter 41
```

Total ~6m wall-clock + ~$0.013/atom + 90s MM ∥. ROI catch +30% vs old 6-round.

Bootstrap: bash scripts/mechanisms/cegis-plus-orchestrator.sh <atom> <briefing-file>

## TMUX SESSION elab-iter42 (5 windows)

```bash
tmux new-session -d -s elab-iter42 -n main
tmux send-keys -t elab-iter42:main 'source ~/.elab-credentials/sprint-s-tokens.env' C-m

tmux new-window -t elab-iter42 -n vendors-3
tmux new-window -t elab-iter42 -n r4-repomix
tmux new-window -t elab-iter42 -n mac-mini
tmux send-keys -t elab-iter42:mac-mini 'ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59' C-m

tmux new-window -t elab-iter42 -n r8-gate
tmux attach -t elab-iter42
# Detach: C-b d   |   Resume: tmux attach -t elab-iter42
```

## CMUX (Andrea conferma install path)

cmux NOT installed iter 41. Candidato: github.com/sst/cmux Claude Code session
multiplexer Tailscale shared session MacBook ↔ Mac Mini. Andrea: install autonomous?

## MAC MINI CO-WORK SINCRONO (NEW iter 41 design)

Mac Mini = ROLE_B critic + tester + verifier (NON solo parallel queue).
MacBook = ROLE_A architect + implementer + synthesizer.

8-step workflow per atom:
1. MacBook drafts plan → automa/team-state/cowork/macbook-handoff.md → commit + push
2. Mac Mini auto-pull (cron 60s) → trigger Claude desktop ROLE_B prompt
3. Mac Mini critique → automa/team-state/cowork/macmini-critique.md → commit + push
4. MacBook auto-pull → reads critique → revises edit
5. MacBook commit revisions → push
6. Mac Mini auto-pull → runs verify (vitest + Playwright + R7 + Lighthouse)
7. Mac Mini → automa/team-state/cowork/macmini-verify.md evidence-bracketed
8. Consensus → MacBook deploy

File ownership disjoint:
- MacBook: src/, supabase/functions/, automa/team-state/cowork/macbook-*.md
- Mac Mini: tests/ (additions), automa/team-state/cowork/macmini-*.md, docs/audits/cowork-*.md

ROI iter 41-43: +30% throughput + -80% inflation + +50% bug catch — vs +50% Anthropic Max cost.

Andrea ratify: 3 voci R1+R2+R3 §7 design doc.

## ANTI-REGRESSIONE FERREA (mai violare)

- vitest 13890 PASS BASELINE — pre-commit hook compara delta. Mai scendere.
- npm run build PASS — pre-commit verify build green.
- MAI git add -A senza git diff prima.
- MAI --no-verify commit.
- MAI push diretto su main — branch e2e-bypass-preview + PR.
- MAI destructive ops senza Andrea OK (rm -rf, git reset --hard, drop table).
- Pattern S r3 race-cond fix preserve filesystem barrier automa/team-state/messages/{agent}-iter{N}-phase{P}-completed.md.
- File ownership rigid disjoint multi-agent (zero write conflict).

## ANTI-INFLAZIONE G45 (mechanical enforce)

- verification-evidence-gate.sh hook MANDATORY wired (test exit 2 score>=7 senza evidence)
- M-AI-02 cap enforcer R5 latency + R7 canonical + Lighthouse perf — mechanical cap NO override
- M-AI-03 claim-reality-gap-detector — 5-pattern stale claim audit pre-merge
- M-AI-04 doc-drift-detector — 4-pattern doc-drift catch (validato iter 39+40 falsifications)
- Score history JSONL automa/state/score-history.jsonl — anti-promotion validator M-AI-01
- NO claim score >= 7 senza pattern [Run:.*] [See:.*] [File:.*] [Bench:.*] inline
- Andrea Opus G45 indipendente review MANDATORY pre-Sprint T close 9.5

## ITER 41 BASELINE FACTS (anti-doc-drift verifies)

- Mac Mini ALIVE 2d17h uptime [SSH: progettibelli@100.124.198.59] [PID: 985] [Cron: L1 5min + L2 30min firing]
  ⚠️ handoff iter 36-39 "probable dead" → FALSIFIED iter 40 ssh probe
- Sprint U Cycle 2 unlimPrompts → ALREADY 94/94 docente framing + 470/470 teacher_messages "Ragazzi"
  ⚠️ handoff "0/94 codemod needed" → FALSIFIED grep verify
- iter 39 deploy Gf9cobQ4 → NOT broken, prod LIVE works [Curl: HTTP 200] [Build: 16m1s exit 0]
  ⚠️ handoff "broken mammoth chunk init TypeError" → FALSIFIED browser test
- platform JWT layer ACCEPTING legacy HS256 anon JWT (NO UNAUTHORIZED_LEGACY_JWT)
  ⚠️ iter 39 audit Step 2-4 → reproducibility doubt iter 40
- ToolSpec count canonical = 57 (NOT 62, grep -cE "name: ['\"]" scripts/openclaw/tools-registry.ts)
  ⚠️ docs claim 62 → drift iter 28 audit measurement error

## STATUS BOX 14 ELAB cumulativo iter 41 close

Box 1 VPS GPU 0.4 (Path A TERMINATED) | Box 2 stack 0.7 | Box 3 RAG 0.7 | Box 4 Wiki 1.0
Box 5 R0 1.0 | Box 6 Hybrid RAG 0.85 | Box 7 Vision 0.75 | Box 8 TTS 0.95 (Voxtral primary)
Box 9 R5 1.0 | Box 10 ClawBot 1.0 | Box 11 Onniscenza 0.95 | Box 12 GDPR 0.75
Box 13 UI/UX 0.90 | Box 14 INTENT exec 0.99

Subtotal 11.95/14 = 8.54 + bonus iter 40+41 (+0.10 verify-only) → cap G45 8.6/10 ONESTO.

## OUTPUT PATTERN PER ATOM

Ogni atom ship REQUIRES:
1. Bracketed evidence inline ([Run:.*] [See:.*] [File:.*])
2. Cap score G45 mechanical (NO override no claim 9.5 senza Opus review)
3. Anti-pattern enforced explicit list
4. Cross-link audit doc + handoff
5. Pre-commit hook PASS (vitest 13890+, build green)

## ANDREA RATIFY QUEUE iter 42 entrance — 15 voci ordered ROI

1. Path A auth chain ELAB_API_KEY (5-30 min)
2. Step-Back P0.2 deploy v82 + R7 re-bench (30 min)
3. tmux session elab-iter42 setup (5 min)
4. repomix install (5 min)
5. verification-evidence-gate.sh hook wire .claude/settings.local.json (10 min)
6. claude-mem build_corpus + prime elab-sprint-T (5 min)
7. Mac Mini cowork R1+R2+R3 ratify (30 min)
8. cmux install conferma (sst/cmux?) (1 min decision)
9. Mac Mini MM1-MM4 parallel queue trigger (5 min)
10. MEMORY.md split 5000→200 + .claude/rules/ (1-2h)
11. iter 42 stack ratify (Self-Consistency + CoVe + Karpathy gate) (1h)
12. iter 43 stack ratify (ReAct + ToT + Generated-Knowledge) (1h)
13. Vercel alias decision: Gf9cobQ4 stay OR rollback mj339i4ay (5 min)
14. 92→94 esperimenti audit dispatch Mac Mini MM2 (3h headless)
15. Andrea Opus G45 indipendente review schedule iter 43 close (30 min)

## NON COMPIACENZA HARD RULES

- Mai claim "Sprint T close achieved" senza Andrea Opus review
- Mai claim score >= 7 senza bracketed evidence inline
- Mai claim "deploy LIVE" senza prod smoke verify
- Mai claim "R7 ≥80%" prompt-only (honest ceiling 50% iter 43)
- Mai claim "Mac Mini revived" (era ALIVE iter 36-39 doc-drift falsified)
- Mai promesse senza misurazione (literature projection ≠ ELAB measured)
- Mai inflate ROI repo non-installed solo perché in lista popolare
- Mai bypass G45 cap mechanical via "interpretation" / "context"

End prompt iter 42 entrance.
```

---

## §1 Cross-link audit + handoff iter 41 close

- iter 40 honest findings: `docs/audits/2026-05-05-iter-40-FINDINGS-honest.md`
- 12-repo roadmap: `docs/audits/2026-05-05-12-repo-roadmap-honest.md`
- iter 41 P0.2 Step-Back PROPOSED: `docs/audits/2026-05-05-iter-41-P0.2-step-back-PROPOSED.md`
- iter 41 macmini+tmux+cmux PLAN: `docs/audits/2026-05-05-iter-41-macmini-tmux-cmux-multiprovider-PLAN.md`
- iter 41 OPTIMAL WORKFLOW: `docs/audits/2026-05-05-iter-41-OPTIMAL-WORKFLOW-synthesis.md`
- iter 41 Mac Mini cowork sincrono: `docs/audits/2026-05-05-iter-41-MACMINI-COWORK-SYNCHRONOUS-design.md`

End iter 42 next session prompt.
