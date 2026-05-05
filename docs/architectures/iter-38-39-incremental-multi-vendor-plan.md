# Iter 38-43 Incremental Multi-Vendor System Plan ONESTO

**Status**: PROPOSED iter 38 close (Andrea direttiva: "progetta tutto sistema, iter 38 misurare qualità nuovo sistema, poi cambiamenti graduali ampliamenti macmini sessioni parallele test tools")

**Mandate**: NON COMPIACENZA, oggettività massima, skill+plugin giusti nei punti giusti, massiccio uso connettori, ZERO debito tecnico, gradualità misurata.

---

## §0 Onesta valutazione stato attuale (file:line evidence)

### Punti forza già operativi (iter 37-38 close)
- ✅ Codex CLI 0.128.0 + Gemini CLI 0.40.1 installati locali
- ✅ Mistral CLI `scripts/three-agent/mistral-review.sh` funzionante (smoke JSON valid)
- ✅ Kimi K2.6 fix endpoint `api.moonshot.ai` + model `kimi-k2.6` (smoke `content:"OK"`)
- ✅ ELAB context preamble shipped `scripts/three-agent/elab-context-preamble.md`
- ✅ 9 mechanisms (M-AI-01..06 + M-AR-01/05/06)
- ✅ Anthropic Claude Opus 4.7 1M = orchestrator session

### Blockers REALI (anti-compiacenza)
- ❌ **Mac Mini SSH "Too many auth failures"** iter 32+ unresolved → Tier 2 swarm bloccato
- ❌ **Branch divergence `e2e-bypass-preview` 263 ahead vs main, main 122 ahead** → PR #60 conflicts non risolti
- ❌ **Vercel Production Branch=main** → mio `--prod` deploys override
- ❌ **Cowork desktop NOT installato** Mac Mini progettibelli (richiede Andrea action)
- ❌ **Playwright headless persona-prof spec NOT executed iter 38** → Andrea iter 21+ mandate carryover
- ⚠️ **9-vendor stack proposto** = solo 4 vendors testati operational (non tutti 8 necessari subito)

### Cost reality check
- $307/mese sub Andrea proposta è ALTA — gradualità necessaria misurare ROI per vendor prima espandere
- $292/mese ottimizzato (skip DeepSeek + free Groq/Cerebras) = 5% saving marginal

---

## §1 Phase incremental con quality gates misurati

### Phase 0: Foundation iter 38 close (~già fatto + 30min Andrea action)

**Status**: 80% done iter 37-38. Pending Andrea actions:
1. Mac Mini SSH unblock (`ssh-copy-id` reset OR fisico reboot) — 30min
2. PR #60 vs PR #61 decision (merge mechanisms cherry-pick first?)
3. Vercel "Production Branch" decision (main vs e2e-bypass-preview)

**Deliverables iter 37-38 close shipped**:
- ELAB context preamble per vendors briefing
- M-AI-06 prompt-state-validator + M-AR-06 vercel-deploy-branch-verifier
- 4-vendor cycle workflow 2 measured + benefit ($0.003 cost + 75s wall-clock + 1 critical anti-bias finding)
- HomePage hybrid 4 cards (Lavagna libera + ELAB Tutor + Glossario + Chi siamo) — Kimi anti-bias accepted

### Phase 1: 4-vendor robust MacBook only (iter 39-40, ~5h Andrea + ~10h Claude)

**Goal**: rendere 4-vendor cycle ROBUSTO MacBook locale prima di aggiungere Mac Mini layer.

**Deliverables NEW iter 39**:
- **M-AI-07-multi-vendor-anti-bias.sh** (~150 LOC) orchestrator 4-vendor cycle Round 1-6 con context preamble injection
- **M-AI-08-vendor-context-injector.sh** (~50 LOC) preamble enforce
- **M-AR-07-vendor-output-sanity-check.mjs** (~80 LOC) JSON schema + Principio Zero validate
- Wrapper scripts: `kimi-review.sh`, `gemini-review.sh`, `codex-review.sh` (parità mistral-review.sh)
- Audit doc: 5+ atom run con M-AI-07 → measure findings caught vs 4-vendor manual

**Quality gate Phase 1**:
- ≥1 atom shipped via M-AI-07 con HIGH finding caught
- Wall-clock ≤180s per atom
- Cost ≤$0.01 per atom
- Anti-bias H1 confirmed N=5+ atoms

**Andrea actions Phase 1** (~20min):
- Signup Groq FREE (console.groq.com) + Cerebras FREE — 10min
- Signup z.ai chat FREE manual paste vote — 5min

### Phase 2: Mac Mini integration iter 41-42 (CONDITIONAL Phase 1 success + SSH unblock)

**Gate**: Phase 1 ≥3 atoms shipped + Mac Mini SSH stable ≥7 giorni

**Deliverables NEW iter 41-42**:
- Mac Mini tmux session "elab-swarm" 4 windows (Claude Code agent-teams + Codex CLI + Gemini CLI + Mistral CLI)
- Cron CVP H24 4 entries (audit + benchmark + cleanup + heartbeat)
- 5-10 atomi BG dispatch Mac Mini swarm — measure wall-clock saving Andrea ≥3h/sett
- Cowork desktop install Mac Mini progettibelli (~30min Andrea install + macOS permissions)
- Cowork real test 1-3 esperimenti pilot (validate concept before scale 94)

**Quality gate Phase 2**:
- Mac Mini swarm 5+ atomi shipped
- Cowork real test ≥1 esperimento end-to-end clean
- Wall-clock saving Andrea ≥3h/sett misurato (NOT claimed)
- ZERO regression Phase 1 baseline

### Phase 3: Vendor expansion iter 43+ (CONDITIONAL Phase 2 ROI evidence)

**Gate**: Phase 2 saving ≥3h/sett + cost incremental ≤$50/mese

**Deliverables NEW iter 43+**:
- Add Groq/Cerebras integration M-AI-07 (Round 4 fast consensus FREE)
- Anthropic Routines cloud 5-10 weekly tasks
- Multi-vote G45 7-vendor automated (5 paid + 2 free)
- Sprint T close 9.5/10 ONESTO + Andrea Opus G45 indipendente review

### Phase 4: Sprint U+ deferred carryover (Vol3 narrative + Davide co-author + 92 esperimenti audit)

---

## §2 Schema vendor specialization (incremental, NOT gigantic)

```
Phase 1 (iter 39-40) — 4-vendor MacBook locale:
  Codex (impl) → Gemini Flash (critic) → Mistral medium (IT K-12) → Kimi K2.6 (anti-bias 256K)
                          ↓
            Claude Opus 4.7 1M (LAST WORD synthesis)

Phase 2 (iter 41-42) — +Mac Mini swarm:
  + Claude Code agent-teams (Mac Mini W1)
  + Cowork desktop real test (Mac Mini display)
  + Kimi K2.6 video analysis Cowork screencast

Phase 3 (iter 43+) — +free vendors:
  + Groq Llama 70B (fast consensus)
  + Cerebras Inference (real-time validation)
  + z.ai GLM-5.1 (manual 7th vote G45)
```

---

## §3 Mechanism portfolio crescita incrementale

**Ship Phase 1** (iter 39-40):
- M-AI-07 multi-vendor-anti-bias orchestrator (~150 LOC)
- M-AI-08 vendor-context-injector (~50 LOC)
- M-AR-07 vendor-output-sanity-check (~80 LOC)

**Ship Phase 2** (iter 41-42):
- M-AR-08 mac-mini-swarm-coordinator (~100 LOC)
- M-AR-09 cowork-real-test-dispatcher (~120 LOC)
- M-AI-09 retroactive-loop-coordinator (~100 LOC)

**Ship Phase 3** (iter 43+):
- M-AI-10 multi-vote-G45-7-vendor (~80 LOC)
- M-AR-10 anthropic-routines-cloud-monitor (~80 LOC)

---

## §4 Test reali architecture (Andrea explicit)

**Sostituire Playwright headless con Cowork desktop real Phase 2**:

| Layer | Tool | Phase | Status |
|---|---|---|---|
| Layer 1 | Vitest unit | esistente | ✅ |
| Layer 2 | Build PASS | esistente | ✅ |
| Layer 3 | Vitest integration | esistente | ✅ |
| Layer 4 | Playwright E2E | esistente | ⚠️ headless, deboto Phase 2 replace |
| **Layer 5** | **Cowork desktop real** | **Phase 2 NEW** | ⏳ Andrea install |
| **Layer 6** | **Kimi K2.6 video analysis** | **Phase 2 NEW** | ⏳ Phase 1 dependency |
| Layer 7 | Multi-vote G45 5-vendor | Phase 1 | ⏳ M-AI-07 |
| Layer 8 | Mac Mini cron CVP H24 | Phase 2 | ⏳ SSH unblock |
| Layer 9 | Anthropic Routines cloud | Phase 3 | ⏳ Andrea ratify |

---

## §5 Anti-pattern G45 enforced (Andrea explicit "non compiacere")

**Anti-pattern detection iter 37-38 close (already caught)**:
1. ❌ Compiacenza Andrea past work (P0.5 LavagnaShell carryover wrong claim) → caught Kimi K2.6 anti-bias
2. ❌ Iter 37 prompt drift (4 atomi shipped past iter claimed NOT impl) → caught M-AI-03 retroactive
3. ❌ Mio rejection Kimi pure hybrid → Andrea questioned correctly → corretto applicato
4. ❌ Score inflation tendency 8.85 senza Opus indipendente → cap mechanic 8.50-8.55 ONESTO

**Anti-pattern Phase 1+ enforce**:
- NO single-vendor decision atomi >50 LOC (4-vendor cycle MANDATORY)
- NO Mac Mini integration senza SSH stable ≥7 giorni
- NO Cowork desktop scale 94 esperimenti senza pilot 1-3 successful
- NO vendor expansion Phase 3 senza Phase 2 ROI evidence
- NO compiacenza past work al costo Principio Zero / Morfismo Sense 2

---

## §6 Cost incremental measurement (anti-inflation)

**Phase 1 cost**: ~$10/mese (Kimi K2.6 ~$5 + Mistral incremental ~$5)
**Phase 2 cost**: +$5/mese (Cowork incluso Max 20x sub Andrea)
**Phase 3 cost**: +$0/mese (Groq + Cerebras + z.ai FREE tiers)

**Total Phase 1-3 ramp**: ~$15/mese incremental (vs Andrea proposal $30-307/mese full).

**Sub esistenti utilizzati**:
- Claude Pro Andrea $20 — orchestrator MacBook
- Claude Max 20x progettibelli $200 — Mac Mini Phase 2 (already paid)
- ChatGPT Plus Andrea $20 — Codex CLI
- Gemini Pro Andrea €22 — Gemini CLI
- Mistral Le Chat Pro Andrea €15 — Mistral API + Pixtral

---

## §7 Acceptance criteria iter 38 close + iter 39 entrance

**Iter 38 close gates** (this PR — already 95% met):
- ✅ ELAB context preamble shipped
- ✅ Multi-vendor schema design shipped
- ✅ M-AI-06 + M-AR-06 mechanisms shipped
- ✅ Workflow 2 4-vendor cycle measured benefit ($0.003 + 75s + 1 critical finding)
- ⏳ Iter 38 prompt paste-ready iter 39 entrance (this doc + below)

**Iter 39 entrance gates**:
- Andrea Mac Mini SSH unblock decision (ssh-copy-id reset OR fisico reboot)
- Andrea PR #60 vs PR #61 decision
- Andrea Vercel "Production Branch" decision
- Andrea Groq + Cerebras + z.ai signup ~20min

**Iter 39 score target ONESTO**: 8.55 → **8.70/10** conditional Phase 1 M-AI-07 shipped + measured.

---

## §8 Pattern S r3 race-cond fix iter Phase progression

| Iter | Phase | Pattern S validation count |
|---|---|---|
| iter 5-37 | baseline | 9× iter consecutive validated |
| iter 38 | this | 10× → degraded (3/4 BG agents org limit) |
| iter 39-40 | Phase 1 | target 11-12× clean |
| iter 41+ | Phase 2 | + Mac Mini agent-teams (Anthropic native, replaces custom Pattern S r3 substitution) |

**Pattern S r3 evolution**: Anthropic agent-teams ufficiali Phase 2 → custom race-cond fix retired (debito tecnico eliminated).

---

End plan iter 38-43 incremental multi-vendor ONESTO.
