# 5-Step Plan ELAB Tutor iter 39-43 — OGGETTIVO + INCREMENTALE + MISURABILE

**Status**: PROPOSED iter 38 close session 4 (Andrea direttiva: "5 step corrispondenti 1 iter 2 utilizzi di 1 step. Massima oggettività. NON COMPIACERE").

**Mandate**:
- 1 step = 1 iter implementation + 2 utilizzi (real ELAB atomi using new capability)
- Quality gates measurable per step (wall-clock + cost + findings count + apply rate)
- Pass/fail criterion BEFORE next step unblock
- ZERO debito tecnico OGNI iter close
- Max objectivity research integrated (Anthropic Cowork official, agent-teams official, Aider, Kimi Code CLI, Anthropic Routines, Three-Agent Pipeline, CEGIS loop)

---

## Riassunto research integrated (Andrea links + past memory + sessione)

| Source | Insight | Step ELAB |
|---|---|---|
| #1165 iter 12 research | Multi-agent orchestration prod patterns | All steps |
| #1120 Mac Mini autonomous | 6 parallel BG tasks delegation pattern | Step 3 |
| #897 8-week PDR loop | Harness 2.0 multi-agent methodology | Step 5 |
| Three-Agent Pipeline (research links) | Claude plan + Codex impl + Gemini DeepThink review | Step 1 |
| Anthropic Cowork desktop | Official real screen control (replaces Playwright debt) | Step 4 |
| agent-teams Anthropic ufficiali | Native Pattern S r3 replacement | Step 3 |
| Aider DeepSeek/Kimi backend swap | Multi-vendor without rewrite | Step 2 |
| Kimi Code CLI agent swarm | 256K context Mac Mini swarm | Step 3 |
| Anthropic Routines cloud | Scheduled tasks survive Mac off | Step 5 |
| CEGIS loop | Counterexample-guided iterative synthesis | Step 1 Round 5-6 |
| tmux multi-CLI | Side-by-side parallel agents | Step 3 |
| Multi-agent testing systems | Cooperative AI validation | Step 4 |
| Hybrid agentic AI QA | ralph loop verification | Step 4 |
| 18 autonomous agents dev | Reference architecture | Step 5 |
| Autodesk Fusion connector | 3D models kit Omaric + physics validation | Step 5 (exploratory) |

---

## STEP 1 — Iter 39: Foundation 4-vendor MacBook robust

### Implementation deliverables (~half iter)

- **M-AI-07-multi-vendor-anti-bias.sh** (~150 LOC) — orchestrator Round 1-6 CEGIS
- **M-AI-08-vendor-context-injector.sh** (~50 LOC) — preamble enforce
- **M-AR-07-vendor-output-sanity-check.mjs** (~80 LOC) — JSON + Principio Zero validate
- **Wrappers parity**: kimi-review.sh + gemini-review.sh + codex-review.sh (match mistral-review.sh)
- **AGENTS.md** shared context file iter 39 entrance

### 2 Utilizzi reali measured (~half iter)

**Utilizzo 1**: PR #60 conflict resolve via 4-vendor cycle decisione architecturale
- Atomi: HomePage variant final + LavagnaShell P0.5 merge
- Round 1 Codex propone resolution
- Round 2 Gemini deep review
- Round 3 Mistral IT K-12 + Kimi 256K anti-bias parallel
- Round 5 Codex iter 2 finalize
- Round 6 Claude Opus LAST WORD apply

**Utilizzo 2**: Sprint U Cycle 2 L2 router catch-all fix 93/94 esperimenti
- File: `clawbot-template-router.ts:121-153`
- Atomic narrow fix `selectTemplate()` catch-all logic
- 4-vendor cycle critical Sprint T close gate

### Quality gates measurable

| Metric | Target |
|---|---|
| Wall-clock per atom | ≤180s |
| Cost incremental | ≤$0.01 |
| Anti-bias H1 | ≥1 critical finding caught Kimi 256K ≠ 3-vendor consensus |
| Apply rate Round 6 Claude | ≥75% selective accept |
| Vitest baseline | 13887+ preserve |
| Findings dedup | <10% duplicate cross-vendor |

### Pass/fail criterion

- ✅ PASS: 2 utilizzi shipped + Phase 1 audit doc + measurable benefit ≥1 anti-bias finding
- ❌ FAIL: Wall-clock >300s OR cost >$0.05 OR 0 critical findings caught → revisit cycle design Step 1.5

### Risk + cost

- **Risk**: low (MacBook only, no Mac Mini, no Cowork)
- **Cost incremental**: ~$5/mese (Kimi + Mistral marginal)
- **Andrea actions**: 0 (sub esistenti operational)

---

## STEP 2 — Iter 40: Vendor expansion FREE tiers (Groq + Cerebras + z.ai)

### Implementation deliverables

- **Groq integration M-AI-07 Round 4** (~30 LOC update)
- **Cerebras integration M-AI-07 Round 4** (~30 LOC update)
- **z.ai manual paste vote tracker** (~50 LOC bash) — 7th vote G45 manual audit
- **Backend swap helper** `scripts/three-agent/backend-swap-{kimi,deepseek,groq}.sh` (~60 LOC each)

### 2 Utilizzi reali measured

**Utilizzo 1**: 92 esperimenti audit broken-count REAL via Groq ultra-fast inference
- Andrea iter 21+ mandate carryover NOT closed
- Groq Llama 70B ~500 tok/s × 92 prompts = ~10min batch
- Output: TRUE broken count file:line per esperimento

**Utilizzo 2**: Linguaggio codemod 200 violations TRUE count via Cerebras bulk
- Andrea iter 21 mandate
- Cerebras ~2000 tok/s × 200 violations scan = ~5min
- Output: TRUE violations vs 14 already shipped iter 38 (claim/reality verify M-AI-03)

### Quality gates measurable

| Metric | Target |
|---|---|
| Vendors operational | ≥6 (4 base + Groq + Cerebras) |
| M-AI-07 cycle wall-clock | ≤120s (Round 4 parallel saves time) |
| Cost incremental | ≤$0 (FREE tiers) |
| 92 esperimenti audit broken-count | published file:line evidence |
| Linguaggio codemod TRUE count | verified vs claim drift |

### Pass/fail criterion

- ✅ PASS: 2 utilizzi shipped + 6 vendors operational + audit doc Phase 2
- ❌ FAIL: FREE rate limits hit OR vendor API errors block atomi

### Risk + cost

- **Risk**: medium (FREE rate limits + signup friction)
- **Cost incremental**: $0
- **Andrea actions**: ~20 min signup Groq + Cerebras + z.ai

---

## STEP 3 — Iter 41: Mac Mini SSH unblock + tmux swarm minimal (2 windows)

### Implementation deliverables (CONDITIONAL Step 1+2 PASS)

- **SSH unblock** `ssh-copy-id` reset + Mac Mini fisico reboot (Andrea action)
- **tmux session "elab-swarm"** 2 windows:
  - W1: Claude Code agent-teams (Anthropic ufficiali, replaces Pattern S r3)
  - W2: Codex CLI background atomi
- **Cron CVP heartbeat** H24 1 entry
- **M-AR-08-mac-mini-swarm-coordinator.sh** (~100 LOC) — dispatch + verify
- **AGENTS.md sync** Mac Mini ↔ MacBook

### 2 Utilizzi reali measured

**Utilizzo 1**: 1 atom BG dispatch Mac Mini agent-teams
- Atom: tech-debt cleanup scan iter 35-38 accumulated
- Dispatch via SSH + tmux W1
- Output: cleanup atomi list + Andrea ratify queue

**Utilizzo 2**: Nightly bench R5 stability run cron Mac Mini
- Cron entry 02:00 nightly
- Output: R5 score history append `automa/state/score-history.jsonl`
- Trend: stability 7 giorni continuous

### Quality gates measurable

| Metric | Target |
|---|---|
| SSH stable | ≥7 giorni continuous (heartbeat zero misses) |
| Mac Mini agent-teams shipped | ≥1 atom clean |
| Cron CVP heartbeat | fires H24 zero misses |
| Wall-clock saving Andrea | ≥1h/sett misurato (NOT claimed) |

### Pass/fail criterion

- ✅ PASS: 7-day SSH stability + 1+ atom + heartbeat + R5 nightly run
- ❌ FAIL: SSH plateau ricorrente → defer Step 4 + investigate Mac Mini hardware

### Risk + cost

- **Risk**: HIGH (SSH plateau iter 32+ unresolved per CLAUDE.md sprint history)
- **Cost incremental**: $0 (Max 20x progettibelli sub esistente)
- **Andrea actions**: ~30 min SSH unblock + macOS permissions

---

## STEP 4 — Iter 42: Cowork desktop pilot 3 esperimenti REAL test + Kimi K2.6 video

### Implementation deliverables (CONDITIONAL Step 3 PASS)

- **Cowork desktop install** Mac Mini progettibelli (~30 min Andrea install + macOS permissions)
- **Cowork dispatch script** `scripts/cowork-real/dispatch-test.sh` (~80 LOC) — 1 esperimento real test
- **Kimi K2.6 video analysis** `scripts/cowork-real/kimi-video-analyze.sh` (~80 LOC)
- **Cron** rotation 1 esperimento/giorno (NOT 30min — incremental safe)

### 2 Utilizzi reali measured

**Utilizzo 1**: v1-cap6-esp1 (Accendi LED) Cowork real test → Kimi video findings
- Cowork desktop autonomous test esperimento facile
- Output: video webm + 20+ screenshots + Kimi findings JSON
- Findings translate → atom iter 43 fix concrete

**Utilizzo 2**: v1-cap6-esp2 (Resistenza LED) Cowork real test → Kimi video findings
- Cowork test esperimento medium complexity
- Compare findings vs Utilizzo 1 (consistency check)

### Quality gates measurable

| Metric | Target |
|---|---|
| Cowork desktop installato | autonomous mode active |
| Esperimenti tested | ≥2 end-to-end clean |
| Kimi video analysis output | structured findings ≥3 HIGH/MEDIUM per video |
| Findings actionable | translate to iter+1 atomi (concrete) |
| Cost incremental | ≤$10/mese (Kimi video API) |

### Pass/fail criterion

- ✅ PASS: 2 esperimenti pilot success + Kimi findings concrete actionable
- ❌ FAIL: Cowork install issues OR video analysis empty findings → defer Step 5

### Risk + cost

- **Risk**: HIGH (Cowork install + macOS permissions Andrea + Kimi video API new)
- **Cost incremental**: ~$10/mese (Kimi video analysis)
- **Andrea actions**: ~30 min Cowork install + permissions

---

## STEP 5 — Iter 43: Autodesk Fusion connector + Anthropic Routines + multi-vote G45 7-vendor

### Implementation deliverables (CONDITIONAL Step 4 PASS)

- **Autodesk Fusion connector integration ELAB Tutor** (exploratory)
  - Fusion API key env (Andrea ratify)
  - Render kit Omaric components 3D models → ELAB visualizer comparison
  - Physics simulator cross-validation (current/voltage Fusion bench vs ELAB simulator)
  - Educational alignment students learn 3D modeling alongside electronics
- **Anthropic Routines cloud** 5 weekly tasks
  - Audit weekly digest
  - Bench R5 weekly stability
  - Tech-debt scan weekly
  - Score history append weekly
  - Kimi K2.6 weekly video summary
- **Multi-vote G45 7-vendor automated** `M-AI-10-multi-vote-G45-7-vendor.mjs` (~150 LOC)
  - 7 votes parallel (Claude Opus + Codex + Gemini + Kimi + Mistral + Groq + Cerebras)
  - Aggregator + outlier flag
  - Andrea Opus indipendente review G45 final ratify

### 2 Utilizzi reali measured

**Utilizzo 1**: NanoR4Board Fusion 3D model alignment kit Omaric verifico Morfismo Sense 2
- Fusion connector render NanoR4Board 3D
- Compare ELAB SVG visualizer vs Fusion 3D coerenza
- Output: Morfismo Sense 2 compliance report + improvements atomi

**Utilizzo 2**: Sprint T close 9.0/10 ONESTO multi-vote G45 7-vendor automated
- 7 votes parallel su iter 43 close score
- Aggregator output (consensus + outlier)
- Andrea Opus indipendente review FINAL ratify
- Sprint T close gate iter 43

### Quality gates measurable

| Metric | Target |
|---|---|
| Fusion connector | functional 3D render + physics bench JSON |
| Anthropic Routines | 5 weekly tasks shipping reports |
| Multi-vote G45 | 7/7 votes captured automated |
| Sprint T close score | ≥9.0 ONESTO Opus indipendente review |
| Cost incremental | ≤$15/mese (Routines + Kimi video) |

### Pass/fail criterion

- ✅ PASS: Fusion working + Routines firing + multi-vote 7/7 + Sprint T close 9.0+
- ❌ FAIL: Fusion connector incompat OR Routines config issues → defer Step 5.5

### Risk + cost

- **Risk**: medium (Fusion connector exploratory + Routines cloud ratify Andrea)
- **Cost incremental**: ~$15/mese cumulative ($5 Step 1 + $0 Step 2 + $0 Step 3 + $10 Step 4 + $15 Step 5 = $30/mese ramp)
- **Andrea actions**: ~40 min Fusion API key + Routines cloud signup

---

## §1 Sprint T close projection iter 43

| Iter | Step | Score target ONESTO | Risk |
|---|---|---|---|
| 39 | Step 1 | 8.55 → 8.70/10 | low |
| 40 | Step 2 | 8.70 → 8.80/10 | medium |
| 41 | Step 3 | 8.80 → 8.85/10 | HIGH (SSH) |
| 42 | Step 4 | 8.85 → 8.95/10 | HIGH (Cowork) |
| 43 | Step 5 | 8.95 → 9.00/10 ONESTO | medium (multi-vote validates) |

**G45 cap mechanic**: NO inflate >9.0 senza Andrea Opus indipendente review G45 mandate cumulative iter 41-43.

**Realistic Sprint T close path**: iter 43 con multi-vote G45 7-vendor + Andrea Opus review finale.

---

## §2 Anti-pattern G45 enforced (Andrea explicit "non compiacere")

- ❌ NO step skip senza pass criterion previous (gate enforcement)
- ❌ NO Step 3 senza Step 1+2 PASS
- ❌ NO Step 4 senza Step 3 PASS
- ❌ NO Step 5 senza Step 4 PASS
- ❌ NO claim "Sprint T close 9.0+ achieved" senza Andrea Opus G45 review
- ❌ NO Mac Mini integration Step 3 senza SSH stable misurato 7-day
- ❌ NO Cowork scale 94 esperimenti senza pilot 1-2 success Step 4
- ❌ NO vendor expansion Step 5 multi-vote senza ROI Step 1-4 cumulative
- ❌ NO compiacenza past work (mio rejection Kimi pure hybrid corrected by Andrea questioning)

---

## §3 Mechanism portfolio crescita per step

| Step | Mechanism NEW | Type | LOC est |
|---|---|---|---|
| 1 | M-AI-07 multi-vendor-anti-bias | anti-inflation | ~150 |
| 1 | M-AI-08 vendor-context-injector | anti-inflation | ~50 |
| 1 | M-AR-07 vendor-output-sanity-check | anti-regression | ~80 |
| 2 | M-AI-09 retroactive-loop-coordinator | anti-inflation | ~100 |
| 3 | M-AR-08 mac-mini-swarm-coordinator | anti-regression | ~100 |
| 4 | M-AR-09 cowork-real-test-dispatcher | anti-regression | ~120 |
| 4 | M-AR-10 kimi-video-analysis-aggregator | anti-regression | ~80 |
| 5 | M-AI-10 multi-vote-G45-7-vendor | anti-inflation | ~150 |
| 5 | M-AR-11 anthropic-routines-cloud-monitor | anti-regression | ~80 |

**Portfolio iter 43**: 9 + 9 NEW = 18 mechanisms (vs 9 iter 38).

---

## §4 Cost ramp incremental (anti-inflation)

| Step | Iter | Incremental | Cumulative | ROI gate |
|---|---|---|---|---|
| Foundation | 38 | $0 | $0 | shipped |
| Step 1 | 39 | $5/mese | $5/mese | 4-vendor cycle measured |
| Step 2 | 40 | $0 | $5/mese | FREE tiers |
| Step 3 | 41 | $0 | $5/mese | sub Max 20x esistente |
| Step 4 | 42 | $10/mese | $15/mese | Cowork + Kimi video |
| Step 5 | 43 | $15/mese | $30/mese | Routines + multi-vote |

**Total Sprint T close**: ~$30/mese incremental (vs Andrea proposal $307/mese full upfront = 90% saving via gradualità).

---

## §5 Andrea actions per step (cumulative wall-clock)

| Step | Andrea actions | Wall-clock |
|---|---|---|
| 0 | already done iter 37-38 close (Mistral + Kimi env fixed) | 0 |
| 1 | nessuna (sub esistenti) | 0 |
| 2 | signup Groq + Cerebras + z.ai | ~20 min |
| 3 | SSH unblock Mac Mini + macOS permissions | ~30 min |
| 4 | Cowork install + macOS permissions | ~30 min |
| 5 | Fusion API key + Routines cloud signup | ~40 min |
| **Total** | **~120 min totale Andrea actions across 5 step** |

---

## §6 Skill + plugin punti giusti

| Step | Skills mandate |
|---|---|
| 1 | /mem-search /make-plan /ultrathink /superpowers:brainstorm /quality-audit |
| 1 | /code-review-excellence /double-check /using-superpowers /caveman /impeccable |
| 2 | /mem-search /make-plan /superpowers:brainstorm /code-review-excellence |
| 3 | /mem-search /make-plan /systematic-debugging (SSH troubleshoot) |
| 4 | /mem-search /quality-audit /accessibility-compliance (Cowork UX test) |
| 5 | /mem-search /make-plan /ultrathink /superpowers:brainstorm /quality-audit |

---

## §7 CoV testing layers progression

| Layer | Tool | Step shipping |
|---|---|---|
| 1 | Vitest unit | Foundation (esistente) |
| 2 | Build PASS | Foundation (esistente) |
| 3 | Vitest integration | Foundation (esistente) |
| 4 | Playwright E2E headless | Foundation (esistente, debt Phase 2 replace) |
| 5 | M-AI-07 4-vendor cycle | Step 1 |
| 6 | M-AR-07 vendor sanity | Step 1 |
| 7 | Mac Mini agent-teams | Step 3 |
| 8 | Cowork desktop real test | Step 4 |
| 9 | Kimi K2.6 video analysis | Step 4 |
| 10 | Multi-vote G45 7-vendor | Step 5 |
| 11 | Anthropic Routines weekly | Step 5 |

---

## §8 Pattern S r3 evolution

| Iter | Pattern | Status |
|---|---|---|
| 5-37 | Custom Pattern S r3 | 9× iter validated |
| 38 | Custom + degraded (BG agents org limit) | 10× ma debole |
| 39 (Step 1) | Custom + 4-vendor cycle | 11× target clean |
| 41 (Step 3) | **Anthropic agent-teams ufficiali** | replaces custom (debito eliminated) |
| 43 (Step 5) | Multi-vote G45 7-vendor | mature |

---

End 5-step plan iter 39-43 OGGETTIVO + INCREMENTALE + MISURABILE.
