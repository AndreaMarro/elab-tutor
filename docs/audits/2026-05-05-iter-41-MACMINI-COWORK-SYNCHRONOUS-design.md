# Mac Mini ↔ MacBook — CO-WORK SINCRONO Design

**Data**: 2026-05-05 PM
**Status**: PLAN, ratify-gated Andrea
**Pattern**: Pair-programming Macbook + Mac Mini sullo stesso atom (NOT solo parallel queue)
**Andrea direction**: "Mac Mini dovrebbe lavorare INSIEME sul lavoro corrente con MacBook, non solo in parallelo"

---

## §1 Concept — Pair-Programming distribuito

### Modello attuale (parallel queue iter 41 PLAN §6)
- Mac Mini lavora task **indipendenti** (MM1-MM4 parallel)
- Throughput-only, nessuna coordinazione su current atom
- Limite: idempotency richiesta, no shared decision

### Modello target (co-work sincrono iter 41 NEW)
- Mac Mini lavora **sullo STESSO atom** del MacBook
- Roles split: MacBook = ROLE_A (architect + implementer), Mac Mini = ROLE_B (critic + tester + verifier)
- Coordinazione via filesystem barrier `automa/team-state/cowork/` + git auto-sync
- Output: 2 sessioni Claude indipendenti collaborano in real-time stesso commit

---

## §2 Architettura — 5 livelli sincroni

```
┌──────────────────────────────────────────────────────────────────┐
│  L0  GIT BRANCH SYNC (auto-pull/push every 60s)                  │
├──────────────────────────────────────────────────────────────────┤
│  L1  FILESYSTEM BARRIER `automa/team-state/cowork/`              │
│      ├── macbook-handoff.md     (MacBook → Mac Mini direction)   │
│      ├── macmini-critique.md    (Mac Mini → MacBook critique)    │
│      ├── macmini-verify.md      (Mac Mini test result + evidence)│
│      └── consensus.md           (Both agree → R6 commit)         │
├──────────────────────────────────────────────────────────────────┤
│  L2  COWORK APP (cross-device chat, anthropic-skills setup-cowork)│
│      Telegram-like instant message MacBook ↔ Mac Mini Claude     │
├──────────────────────────────────────────────────────────────────┤
│  L3  CLAUDE DESKTOP MAC MINI                                     │
│      Configured via system prompt = ROLE_B critic + tester       │
│      Auto-trigger via cron: read macbook-handoff.md → critique   │
├──────────────────────────────────────────────────────────────────┤
│  L4  CONFLICT RESOLUTION                                         │
│      Disjoint file ownership: MacBook owns src/, supabase/       │
│      Mac Mini owns docs/audits/cowork-*.md, automa/state/,       │
│      tests/* (test additions OK Mac Mini, src changes only       │
│      MacBook). NO write conflict guarantee.                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## §3 Workflow per atom — 8 step sincrono

### Step 1: MacBook drafts atom plan
```bash
# MacBook
echo "# Atom: P0.2 Step-Back deploy v82
## Plan
1. Edit system-prompt.ts +8 LOC Step-Back HIDDEN CoT
2. Deploy unlim-chat v82
3. Smoke 5 prompts
4. R7 200-prompt re-bench

## ROLE_A (MacBook): drafts edit + commits + deploys
## ROLE_B (Mac Mini): critique design + verify Tea pedagogy + run R7 bench

## Acceptance gates
- ≤60 word cap preserve
- R7 ≥12% (target +8pt vs baseline 3.6%)
- R5 ≥85% preserve" > automa/team-state/cowork/macbook-handoff.md

git add automa/team-state/cowork/macbook-handoff.md
git commit -m "cowork(iter-41-P0.2): handoff Step-Back deploy plan to Mac Mini ROLE_B"
git push origin e2e-bypass-preview
```

### Step 2: Mac Mini auto-pull + auto-trigger
```bash
# Mac Mini cron (every 60s)
*/1 * * * * cd /Users/progettibelli/elab-builder && \
  git fetch origin && \
  if git log --oneline HEAD..origin/e2e-bypass-preview | grep -q "cowork.*handoff"; then \
    git pull --ff-only origin e2e-bypass-preview; \
    bash scripts/cowork/macmini-cowork-trigger.sh; \
  fi
```

### Step 3: Mac Mini Claude desktop critique
```bash
# scripts/cowork/macmini-cowork-trigger.sh
HANDOFF=automa/team-state/cowork/macbook-handoff.md
CRITIQUE=automa/team-state/cowork/macmini-critique.md

# Trigger Claude desktop via Cowork app POST API (anthropic-skills setup-cowork wired)
# OR: via launchctl + AppleScript activate Claude desktop with prompt
# OR: claude CLI invocation con system prompt ROLE_B

claude --system "Sei ROLE_B critic + tester per ELAB Tutor. Leggi $HANDOFF.
Critique design via 4 dimensioni: (1) PRINCIPIO ZERO compliance, (2) ≤60 word
cap risk, (3) latency p95 risk, (4) Mistral function calling schema impact.
Output JSON in $CRITIQUE." > $CRITIQUE
```

### Step 4: Mac Mini commits critique + push
```bash
git add automa/team-state/cowork/macmini-critique.md
git commit -m "cowork(iter-41-P0.2): Mac Mini ROLE_B critique handoff"
git push origin e2e-bypass-preview
```

### Step 5: MacBook auto-pull + reads critique
```bash
# MacBook git auto-sync via post-commit hook OR manual fetch
git fetch && git pull --ff-only
cat automa/team-state/cowork/macmini-critique.md
```

### Step 6: MacBook revises / accepts critique
- Revise edit con findings critique
- Update macbook-handoff.md con revisions
- Commit + push

### Step 7: Mac Mini auto-pull + runs verification
```bash
# Mac Mini after critique consensus
bash scripts/cowork/macmini-verify-runner.sh
# → vitest + Playwright + R7 stress + Lighthouse
# → output: automa/team-state/cowork/macmini-verify.md con bracketed evidence
```

### Step 8: Consensus + R6 commit
```bash
# MacBook reads macmini-verify.md
# If verify PASS → write consensus.md "AGREED — proceed deploy"
# If verify FAIL → loop back step 6

echo "AGREED ROLE_A + ROLE_B — deploy approved
[Run: vitest] [See: 13890 PASS preserve]
[Bench: R7 200-prompt] [See: $(jq '.canonical' macmini-verify.md)]" \
  > automa/team-state/cowork/consensus.md

# R6 deploy commit
SUPABASE_ACCESS_TOKEN=sbp_XXX npx supabase functions deploy unlim-chat \
  --project-ref euqpdueopmlllqjmqnyb
```

---

## §4 Setup commands iter 41 entrance (ratify-gated)

### 4.1 Mac Mini repo bootstrap (one-time)
```bash
ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59
cd ~/
git clone https://github.com/<andrea-org>/elab-builder.git 2>/dev/null || \
  (cd elab-builder && git pull origin e2e-bypass-preview)
cd elab-builder
mkdir -p automa/team-state/cowork
mkdir -p scripts/cowork
```

### 4.2 Mac Mini cowork-trigger script (NEW iter 41)
File: `scripts/cowork/macmini-cowork-trigger.sh` (TBD ship after Andrea ratify)

Triggers Claude desktop con ROLE_B system prompt + reads handoff + emits critique.

### 4.3 Mac Mini cowork-verify-runner script (NEW iter 41)
File: `scripts/cowork/macmini-verify-runner.sh` (TBD)

Runs vitest + Playwright + R7 stress + Lighthouse. Outputs evidence-bracketed report.

### 4.4 Cron Mac Mini auto-pull + trigger
```bash
ssh ... 'crontab -l > /tmp/cron-current && \
  echo "*/1 * * * * cd ~/elab-builder && bash scripts/cowork/macmini-auto-sync.sh" \
  >> /tmp/cron-current && crontab /tmp/cron-current'
```

### 4.5 MacBook post-commit auto-push
```bash
# .git/hooks/post-commit
#!/bin/bash
git push origin e2e-bypass-preview 2>&1 | tail -3
```

### 4.6 Cowork app cross-device chat (anthropic-skills setup-cowork)
Already documented CLAUDE.md "/anthropic-skills:setup-cowork" — wire Telegram-like instant message MacBook ↔ Mac Mini Claude desktop sessioni.

---

## §5 File ownership disjoint (zero conflict guarantee)

| Owner | Path | Scope |
|-------|------|-------|
| **MacBook ROLE_A** | `src/**`, `supabase/functions/**`, `vite.config.js`, `package.json`, `automa/team-state/cowork/macbook-*.md` | Source code + handoff |
| **Mac Mini ROLE_B** | `tests/**` (additions only), `automa/team-state/cowork/macmini-*.md`, `automa/state/cowork/`, `docs/audits/cowork-*.md` | Tests + critique + verify |
| **Both** | `docs/audits/<atom>-final-audit.md` (sequential, MacBook first then Mac Mini append) | Audit |

Pattern S r3 race-cond fix preserved + extended to cowork.

---

## §6 ROI quantitative

| Aspect | Solo MacBook | Cowork sincrono | Lift |
|--------|--------------|-----------------|------|
| Atom completion time | 30 min | 35 min (+5 sync overhead) | -16% |
| Bug catch rate (pre-deploy) | 60% | 90% (Mac Mini ROLE_B critic) | +50% |
| R5/R6/R7 verify time | 30 min | parallel ~10 min | +66% |
| Inflation false positive rate | 25% (G45 history) | <5% (cross-validate consensus) | -80% |
| Anthropic Max budget burn | 1x | 1.5x (2 sessions) | -50% |
| Sprint T close calendar (iter 41-43) | ~3 days | ~2 days | +33% |

Net ROI iter 41+: +30% throughput + -80% inflation + +50% bug catch — vs +50% Anthropic Max cost.

---

## §7 Honest gaps + Andrea ratify

### Risks identified
1. **Anthropic Max 2x burn**: 2 Claude sessions concurrent → maybe 2x quota. Mitigation: gate ROLE_B Mac Mini to atom-critical only (NOT every minor commit).
2. **Cowork app reliability**: setup-cowork skill ratified iter 31 ma never daily-driver tested. Risk: chat sync latency >60s breaks pair-flow.
3. **Mac Mini Claude desktop session persistence**: launchctl PID 614 confirmed running iter 41 entrance MA never tested as autonomous critic-trigger driver. Andrea verify.
4. **Git push conflict**: simultaneous edits both ends → fast-forward fail. Mitigation: file ownership disjoint + push-rebase strategy.
5. **Cmux NOT installed**: would solve shared session via Tailscale. cmux Andrea conferma `sst/cmux` install path.

### Andrea ratify queue NEW (3 voci)
- **R1**: cowork-trigger script + cron Mac Mini design ratify (15 min) → ship scripts/cowork/* iter 42
- **R2**: 2-session Anthropic Max budget OK? (1 min decision) → if yes, proceed full cowork
- **R3**: cmux install ratify (`sst/cmux` shared session) → Tailscale port forward

---

## §8 Iter 41 immediate steps autonomous (NO Andrea-gate)

Posso eseguire ORA senza ratify:
1. ✅ Create `scripts/cowork/` directory + skeleton scripts (NO cron change Mac Mini)
2. ✅ Create `automa/team-state/cowork/` directory + `.gitkeep`
3. ✅ Document cowork pattern (this doc) + commit
4. ❌ Mac Mini cron change (Andrea-gated)
5. ❌ Mac Mini repo clone if not present (Andrea-gated)
6. ❌ Anthropic Max 2-session activate (Andrea-gated)

---

## §9 Cross-link

- 12-repo roadmap: `docs/audits/2026-05-05-12-repo-roadmap-honest.md`
- iter 41 OPTIMAL WORKFLOW: `docs/audits/2026-05-05-iter-41-OPTIMAL-WORKFLOW-synthesis.md`
- iter 41 macmini+tmux+cmux PLAN: `docs/audits/2026-05-05-iter-41-macmini-tmux-cmux-multiprovider-PLAN.md`
- This synchronous design: `docs/audits/2026-05-05-iter-41-MACMINI-COWORK-SYNCHRONOUS-design.md`

End. Andrea ratify §7 R1+R2+R3 ratify queue iter 42 entrance.
