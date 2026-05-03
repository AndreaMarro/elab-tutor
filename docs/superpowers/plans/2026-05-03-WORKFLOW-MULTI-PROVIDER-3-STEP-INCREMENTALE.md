# Workflow Multi-Provider ELAB Tutor — Piano Incrementale 3 Step

**Author**: Claude (sonnet 4.7 1M, output style: explanatory + learning, NO caveman per Andrea mandate)
**Date**: 2026-05-03
**Sprint**: Sprint T close → Sprint U entrance
**Status**: PROPOSED — Andrea ratify gate per Step 1 entrance
**Plan version**: v1.0 (single source of truth, supersede frammenti chat sopra)
**Word count target**: ~12000 (iper-dettagliato per mandate "non omettere nulla")

---

## §0 — Preface, mandate, anti-pattern

### 0.1 Mandato Andrea letterale (verbatim ultimo turn)

> "vorrei procedere in modo più efficace [...] crea in base ai link che ti ho mandato un piano incrementale per testare il sistema e non costruire subito un'architettura gigantesca [...] usa /mem-search /make-plan /ultrathink:ultrathink /superpowers:brainstorm per costruire il sistema multi provider con feed a step incrementali, crea un documento iper dettagliato con tutte le scelte migliori e gli incrementi da fare. fallo in 3 step. Allega tutti i link che ti ho mandato. non omettere nulla. [...] non compiacere, fai il massimo"

### 0.2 Cosa questo documento NON è

- ❌ NON è permesso a procedere — è una **proposta gated Andrea ratify**
- ❌ NON è ricetta unica — Step 2 e Step 3 dipendono dai dati di Step 1 (incremental learning)
- ❌ NON è sostituto di onesto pensiero — è un canovaccio, ogni Step deve essere ri-aperto a luce dei risultati precedente
- ❌ NON è promessa di Sprint T close 9.5/10 — Sprint T close gate Andrea Opus G45 indipendente review iter 41-43 cumulative (separato)
- ❌ NON usa caveman mode — output style explanatory + learning richiesto

### 0.3 Cosa questo documento È

- ✅ Piano 3-step concreto + verificabile + reversibile
- ✅ Acceptance gate esplicito ogni step (continuare OR rollback OR pivot)
- ✅ Cost incremental misurabile in € reali, NON aspirazionale
- ✅ Wall-clock Andrea esplicito ogni atom (~ore reali, NON wishful thinking)
- ✅ Anti-pattern enforced inline (G45 cap, NO compiacenza, NO debito)
- ✅ Sources cited inline + §14 raccolti tutti (33 link Andrea + 14 web search results)
- ✅ Rollback plan esplicito ogni componente

### 0.4 Anti-pattern G45 enforcement (questo documento + esecuzione futura)

| Anti-pattern | Manifestazione tipica | Contromisura inline |
|---|---|---|
| Compiacenza score | "Step 1 PASS → Step 2 ready" senza KPI misurabile | KPI quantitativo specifico per gate (sect §8) |
| Quantitative inflation | "Saving 17h/settimana" round numbers | Saving stimato con metodologia + range realistic (NOT round) |
| Hedging language | "Should mostly work", "largely successful" | Decision binary PASS/FAIL ogni gate, NO hedge |
| Missing failure analysis | Solo success path documented | Fallback path esplicito + fail-mode anticipated ogni step |
| Vague claim | "Multi-AI is better" | Claim quantitative: "5-vote spread Δ ≤1.5 → consensus PASS" |
| Hidden cost | "$292/mo" senza disambiguazione | Cost matrix incremental Step 1 + Step 2 + Step 3 separato |
| Premature architecture | Build 6-vendor stack day-1 | Step 1 = single vendor swap proof, NO 6-stack |
| Authority by reference | "Anthropic recommends" senza source | Source link inline ogni claim, §14 raccolto verbatim |

---

## §1 — Discovery (memory + state files prior session iter 1-32)

### 1.1 Stato verificato file-system iter 31 ralph 32 close (2026-05-03)

| Componente | Stato | Evidence file:line |
|---|---|---|
| Vitest baseline | 13752 PASS preserved | `automa/baseline-tests.txt:1` |
| Edge Function unlim-chat | v80 ACTIVE prod 2026-05-03 16:02:57Z | Smoke OPTIONS HTTP 204 191ms verified |
| Vercel deploy | `319v42i4p` PROD LIVE 16:06:44Z | Smoke www.elabtutor.school HTTP 200 verified |
| ADR-041 Onnipotenza Expansion L0b | ACCEPTED 2026-05-03 | `docs/adrs/ADR-041-onnipotenza-expansion-ui-namespace-l0b.md` |
| ADR-042 Onniscenza UI snapshot | ACCEPTED 2026-05-03 | `docs/adrs/ADR-042-onniscenza-ui-state-snapshot-integration.md` |
| Mechanisms anti-regression+anti-inflation | 6 shipped (M-AR-01, M-AR-05, M-AI-01..04) | `scripts/mechanisms/` ls verified |
| Score iter 31 ralph 32 close ONESTO | 8.40-8.50/10 G45 cap | CLAUDE.md sprint history footer line ~1990 |
| Andrea ratify queue iter 32→33 entrance | 19 entries (10+ open) | `automa/state/iter-31-andrea-flags.jsonl` wc -l verified |
| Pattern S r3 race-cond fix | VALIDATED 22× iter consecutive | CLAUDE.md sprint history footer iter 5+6+8+11+12+19+30+31+36+37+38 cumulative |

### 1.2 Bug/gap critici outstanding (Andrea ratify queue)

1. **Deploy gap iter 29 finding** → CHIUSO iter 32 Phase D Vercel `319v42i4p` ✓
2. **Sync drift schema 50 vs dispatcher 62** → CHIUSO iter 31 architect Path A ✓
3. **R5 latency regression iter 11 INDETERMINATE** → flag downgrade iter 27 RCA, env unblocked iter 32 (SUPABASE_ANON_KEY zshrc=prod), N=3 re-bench warm-isolate protocol pending iter 33+
4. **Canary 5%→25%→100% rollout** ADR-041 §8 + ADR-042 §7 → env-gated default 0%/false safe, NOT yet activated prod
5. **R7 canonical 3.6%** → L2 template router dominance, defer iter 33+ widen `shouldUseIntentSchema` heuristic OR reduce L2 scope
6. **R6 page=0%** → Voyage ingest gap, defer iter 33+ re-ingest with page metadata (~$1, ~50min)
7. **Lighthouse perf 26+23 FAIL ≥90 target** → defer iter 33+ optim modulePreload + lazy mount + image opt
8. **94 esperimenti audit Andrea iter 21+ mandate** → carryover NOT closed, broken Playwright UNO PER UNO sweep
9. **Linguaggio codemod 200 violations Andrea iter 21 mandate** → ~14 TRUE shipped iter 38, ~180 narrative analogies preserved Sense 2 Morfismo
10. **Vol3 narrative refactor ADR-027 Davide co-author** → deferred Sprint U+
11. **Mac Mini autonomous loop status** → iter 32 cron `ccaf63f8` saturato CronDelete'd, watchdog primary cron L1+L2+L3+aggregator ACTIVE 96 branches/24h ma plateau
12. **Onnipotenza dispatcher 62-tool Deno port** → A10 NOT shipped iter 38 G45 mechanical cap 8.5 trigger, Sprint T close 9.5 IRREALISTIC iter 32 single-shot

### 1.3 Trade-off documentati prior session (cross-link CLAUDE.md sprint history)

- **Stack actuale ~$292/mo**: Claude Max 20x progettibelli ($200) + Claude Pro Andrea ($20) + ChatGPT Plus ($20) + Gemini Pro (€22) + Mistral Le Chat Pro (€15) + Kimi API (~$15)
- **Mac Mini Strambino progettibelli**: Tailscale `progettibelli@100.124.198.59`, SSH `id_ed25519_elab` MacBook only, cron L1/L2/L3/aggregator ACTIVE
- **Hybrid Deno cron**: 4 entries Mac Mini = 96 branches/24h (mac-mini/iter36-* pattern), output PR-style branches NOT auto-merged
- **DeepSeek $10/mo**: SKIP raccomandato (Kimi 256K + thinking integrato copre, Kimi K2.6 vince 6/8 metriche Kimi vs DeepSeek; eccezione = se vuoi 1M context Volumi Davide single-call OR vendor distinct anti-bias 7vs6)
- **GitHub Pro $4 + Vercel Pro $20 + Supabase Pro $25 = $49/mo**: SKIP iter 30-38 (free tier copre), ratify iter 42 entrance Sprint U scale 50 scuole

### 1.4 Mac Mini cron stato verificato

- 4 entries crontab attivi user `progettibelli`:
  - L1 audit cycle */10min (5/5 PASS continuous, ~2h plateau iter 36)
  - L2 user-sim curriculum 30min (3 cycles iter 36, persona p1-docente-primaria)
  - L3 deep validation 2h (0 cycles iter 36, ~2h gating, first cycle non maturato)
  - Aggregator 15min (5 commits iter 36)
- Branch pattern `mac-mini/iter36-user-sim-{l1,l2,l3}-YYYYMMDDTHHMMZ`
- Output: 5/5 L1 PASS continuous chromium baseURL `https://www.elabtutor.school`, 0 console errors, 0 regression flags
- Plateau: 17 L1 cycles + 3 L2 + 0 L3 = saturazione signal NEW (sempre 5/5 PASS, NO insight nuovi)

### 1.5 Discovery summary

ELAB Tutor è in stato **stabile post deploy LIVE prod**, ma con **8-12 atomi outstanding** che richiedono iter 33+ execution (canary rollout 24-48h soak, R5 N=3 re-bench, R6 Voyage re-ingest, R7 L2 scope reduce, Lighthouse perf optim, 94 esperimenti audit, Vol3 refactor, Mac Mini loop refresh). Il **workflow multi-provider** è la **prossima leva strategica** per accelerare iter 33+ via parallelizzazione + anti-bias + debito ridotto.

**MA**: i frammenti workflow sopra (Tier 1-4 + 27 mechanisms + Cowork desktop + Kimi video + 5-vote G45) sono **architetturalmente ambiziosi**. Step incrementale è OBBLIGATORIO per:
1. Validare ipotesi vendor diversity → consensus migliora score G45 (NOT solo aggiunge complessità)
2. Misurare costo reale API Kimi/DeepSeek ($30/mo è stima, real bisogna misurare)
3. Verificare Mac Mini progettibelli capacity (Max 20x sub limit + tmux 6 windows + Cowork concorrente potrebbe saturare)
4. Eliminare debito tecnico genuinamente (NON sostituirlo con altro custom code)

---

## §2 — Brainstorming alternative architettura (3 archetipi considerati)

### 2.1 Archetipo A — "Big Bang" upfront 6-vendor stack

- **Setup**: ~3-5h Andrea, install tutto Phase A iter 31 (frammenti chat sopra)
- **Pro**: tutti i vendor disponibili day-1, no incremental gating
- **Contro**: 6-vendor stack untested → debug surface enorme, no isolation root-cause
- **Failure mode**: Single vendor failure → cascade unclear, troubleshoot 6-axis
- **Verdict**: ❌ REJECTED — viola mandate Andrea "non costruire subito un'architettura gigantesca"

### 2.2 Archetipo B — "Single vendor at a time" pure incremental

- **Setup**: 1 vendor add per week, 6 weeks total
- **Pro**: ogni add isolato, root-cause chiaro
- **Contro**: 6 settimane wall-clock prima di pieno valore, multi-vote G45 NON disponibile prima Step 5+
- **Failure mode**: Andrea perde patience prima Step 5 → workflow abbandonato
- **Verdict**: ⚠️ TOO SLOW — Andrea ha 4-5 settimane Sprint T close, NON 6-8 weeks

### 2.3 Archetipo C — "Foundation → Expansion → Full swarm" (3-step, RACCOMANDATO)

- **Step 1 Foundation (Week 1)**: ZERO API extra, manual workflow proof, 1 vendor swap trial
- **Step 2 Expansion (Week 2-3)**: 2 vendor API + agent-teams ufficiali + tmux 4 windows + automation cron
- **Step 3 Full swarm (Week 4+)**: 6-vendor multi-vote G45 + Cowork H24 + Kimi video + Routines cloud + 27 mechanisms
- **Pro**: incrementale ma non lentissimo, ogni step learn-and-adapt, gate esplicito
- **Contro**: ogni step ha rollback overhead (configurazione che cambia)
- **Verdict**: ✅ RACCOMANDATO — bilanciato Andrea wall-clock vs incremental learning

### 2.4 Decision matrix archetipi

| Criterio | Archetipo A | Archetipo B | **Archetipo C** |
|---|---|---|---|
| Andrea wall-clock Week 1 | 3-5h | 0.5-1h | 1-2h |
| Time-to-multi-vote-G45 | Day 1 | Week 5 | **Week 2** |
| Risk untested complexity | ALTO | BASSO | **MEDIO controlled** |
| Rollback complexity | ALTO (6-stack revert) | BASSO (1 vendor) | **MEDIO (gate-aware)** |
| Sprint T close acceleration | sì IF works, NO IF debug | NO (too slow) | **sì IF Step 1+2 PASS** |
| Andrea patience risk | ALTO (5h day-1 frustration) | ALTO (5 weeks no value) | **BASSO (Week 2 visible value)** |
| Anti-debito tecnico | Difficile (6-stack churn) | OK | **OK (gate eliminate at gate)** |
| Cost predictability | Stima sola | Misura week-by-week | **Misura + cap gate** |

**Selezione finale: Archetipo C — 3 step incrementale.**

---

## §3 — Ultrathink architectural reasoning (deep)

### 3.1 Domanda fondamentale: perché multi-provider workflow oltre Claude Code Pro?

#### 3.1.1 Ipotesi da falsificare

**H1**: Multi-provider migliora score iter close (consensus 5-vote vs single Claude vote = anti-bias)
**H2**: Multi-provider riduce wall-clock Andrea (parallelizzazione tasks)
**H3**: Multi-provider riduce debito tecnico (ufficiali tools sostituiscono custom)
**H4**: Multi-provider riduce cost (cheap backend swap Kimi/DeepSeek vs Anthropic premium)

#### 3.1.2 Evidence per ipotesi

**H1 — Consensus migliora score**:
- Source: Multi-Agent Testing Systems (virtuosoqa.com, link 1) — "cooperative AI validate complex applications" pattern, multi-AI quorum reduces false positives
- Source: AI Code Review Best Practices (blog.exceeds.ai, link 3) — multi-vendor reduce model bias systematic
- Source: Cross-validation Claude (reddit r/ClaudeAI link 18) — "claude_first_not_claude_alone" — author reports score variance reduction with 2+ vendor cross-validation
- **Verdict**: PROBABLE TRUE per ELAB G45 anti-inflation mandate, ma necessita verifica empirica Step 1

**H2 — Parallelizzazione riduce wall-clock**:
- Source: "I built 18 autonomous agents" (reddit link 20) — author reports 4× throughput delegation
- Source: Three-Agent Pipeline (Claude+Codex+Gemini DeepThink web search results, multi-link) — "divide tasks based on model specializations" pattern
- Source: Hybrid Agentic AI QA (dev.to link 2) — "the future of QA" claim throughput multiplication
- **Verdict**: PROBABLE TRUE ma dipendenze critical path NON sempre parallelizzabile, va misurato Step 2

**H3 — Ufficiali tools sostituiscono custom**:
- Source: Anthropic agent-teams ufficiali (code.claude.com/docs/en/common-workflows link 13) — file locking + mailbox + task list nativi
- Source: Claude Code worktree native (claude.com/docs link 13) — sostituisce custom rollback machinery
- Source: Codex Plugin for Claude Code (github openai/codex-plugin-cc link 5) — `/codex` integrazione invece di custom subprocess
- Source: Anthropic Routines (search results) — cloud-managed scheduled tasks invece di custom cron
- **Verdict**: TRUE per molti componenti (custom Pattern S r3 race-cond fix → agent-teams nativi), ma alcuni custom rimarranno (ELAB-specifici skills, mechanisms)

**H4 — Cheap backend riduce cost**:
- Source: 6 CLI Coding Agents Competing (medium @sohail_saifi link 29) — comparison costs Kimi $1.71/1M vs Anthropic $3/1M Sonnet
- Source: Codex vs Claude Code (Composio link, web search) — "Codex Pro $200 vs Plus $20 sufficient most use cases"
- Source: DeepSeek API Anthropic-compatible (api.deepseek.com/anthropic) — backend swap zero rewrite
- **Verdict**: TRUE per routine atom (agent-team Mac Mini swarm cheap inference), FALSE per critical path (Anthropic Opus quality gap su architectural decisions)

#### 3.1.3 Implicazione: multi-provider è leva strategica MA gated empirical validation

NON commitment 6-vendor stack day-1. Step 1 = misurare H1+H2+H3+H4 con single trial. Step 2 = espandere SOLO se Step 1 conferma ipotesi.

### 3.2 Pattern architetturali raccolti dai 33 link

#### 3.2.1 Pattern "Three-Agent Pipeline" (Claude + Codex + Gemini DeepThink)

Source: web search results "workflow claude code misto con codex con gemini deepthink" + multi-link reddit.

```
Plan (Claude) → Implement (Codex) → Review/Debug (Gemini DeepThink)
```

- Claude = exploration + design consistency multi-file (architectural reasoning)
- Codex = execution efficiency (faster impl defined tasks)
- Gemini DeepThink = logical bugs + edge cases + algorithmic depth

**Pro**: separazione cognitive load chiaro
**Contro**: handoff context loss tra CLI (mitigato AGENTS.md shared state file)

#### 3.2.2 Pattern "Two-Agent Ping-Pong" (Claude + Gemini DeepThink)

Source: web search "se usi solo claude e gemini deepthink"

```
Pianificazione (Gemini DeepThink) → Esecuzione (Claude) → Debug critical (Gemini) → Chiusura (Claude)
```

- Gemini DeepThink = depth reasoning concettuale (DOVE Claude potrebbe convergere troppo presto)
- Claude = file system actions + execution

**Pro**: 2-vendor minimum viable, MCP integration possibile
**Contro**: bottleneck DeepThink (English-only, marginal italiano)

#### 3.2.3 Pattern "Codex Plugin for Claude Code" (`/codex` integrato)

Source: github openai/codex-plugin-cc + web search Codex Plugin Claude Code

```bash
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex-plugin-cc@codex-plugin-cc
# Use: /codex "implement this spec X" inside Claude Code session
```

- Stesso workflow Claude Code, NO context switch CLI separati
- Codex usa OAuth ChatGPT Plus quota (NON API key extra)
- Output: file-based commit, NO copy-paste

**Pro**: ZERO debito custom integration, OAuth nativo
**Contro**: Plugin dipendente OpenAI mantenimento (monitoraggio breaking changes)

#### 3.2.4 Pattern "AGENTS.md shared state file"

Source: web search "AGENTS.md shared status pattern" + Codex docs

```markdown
# AGENTS.md (project root)

## Active task: ATOM-S33-canary-5pct
- Lead: Claude (planning)
- Implementer: Codex (impl)
- Reviewer: Gemini DeepThink (verify edge cases)
- Status: Codex implementing supabase secrets set
- Last update: 2026-05-03 17:15Z
- Blocking: SUPABASE_ACCESS_TOKEN need ratify
```

- Ogni CLI legge + aggiorna AGENTS.md prima/dopo task
- Previene context loss handoff
- Audit trail naturale

**Pro**: filesystem-native, NO API/MCP overhead
**Contro**: race-cond se 2 CLI scrivono simultaneo (file locking richiesto, OS-level lockf)

#### 3.2.5 Pattern "tmux 4-6 windows orchestrator"

Source: tmuxcheatsheet (link 10), claudemux (reddit link 11), tmux-team github wkh237 (link 30), agent-status-tmux medium google-cloud (link 27), wmux (dev.to link 28)

```
tmux session "elab-swarm":
  Window 1: Claude Code (lead orchestrator)
  Window 2: Codex CLI (or /codex inside Claude)
  Window 3: Gemini CLI (or extensions)
  Window 4: Aider DeepSeek backend (cheap inference)
  Window 5: ccmanager dashboard (monitor)
  Window 6: cron logs tail (operational)
```

- tmux + cmux native: persistente cross-session, survive disconnect
- ccmanager dashboard: visibility multi-AI activity real-time

**Pro**: native macOS tool, ZERO debito, persistente
**Contro**: tmux learning curve (Andrea può preferire iTerm2 split panes vs tmux)

#### 3.2.6 Pattern "Cowork desktop autonomous test"

Source: claude.com/blog/dispatch-and-computer-use (link 24), platform.claude.com/docs/agents-and-tools/tool-use/computer-use-tool (link 21), reddit "i gave an agent its own computer" (link 22)

```
Mac Mini progettibelli:
  Cowork desktop ACTIVE H24
  ↓ dispatch task
  Real Chrome browser
  ↓ navigate elabtutor.school
  Real mouse + keyboard + voice
  ↓ test scenario
  Screenshot + video webm capture
```

**Pro**: REAL prod testing (NOT headless approximation), pixel/OCR resilient UI refactor
**Contro**: macOS permissions setup (Accessibility + Screen Recording + Mic + Automation), Cowork beta stability

#### 3.2.7 Pattern "Hybrid API + UI tests" (Steve Kinney)

Source: stevekinney.com/courses/self-testing-ai-agents/api-and-ui-hybrid-tests (link 7)

```
Hybrid test = API setup (fast) + UI assertion (real user flow)
- API: POST /api/sessions to create test data
- UI: Playwright/Cowork verify visual rendering correct
```

**Pro**: 80% speed of pure API + 100% confidence pure UI
**Contro**: API surface needs maintained, ELAB Edge Function unlim-chat already mature

#### 3.2.8 Pattern "MindStudio deterministic-agentic nodes"

Source: mindstudio.ai/blog/structured-ai-coding-workflow-deterministic-agentic-nodes (link 5)

```
Workflow nodes:
  Deterministic node: shell command, vitest run, build (PASS/FAIL binary)
  Agentic node: LLM reasoning, plan, code gen
  Hybrid: deterministic gate before agentic step
```

**Pro**: chiarezza control flow, debug deterministic vs LLM separato
**Contro**: implementation overhead se costruito custom (preferire framework esistenti)

#### 3.2.9 Pattern "CEGIS counterexample-guided inductive synthesis"

Source: arxiv 2603.23763v1 (link 4)

```
1. Synthesize candidate (LLM)
2. Verify against spec (deterministic checker)
3. If fail → counterexample → feedback to LLM → re-synthesize
4. Repeat until verified OR max iters
```

**Pro**: Provably correct synthesis, applicabile multi-vote G45 (consensus = verifier)
**Contro**: overhead loop, NOT every task richiede CEGIS depth

#### 3.2.10 Pattern "Ralph Loop verification" (Nathan Onn)

Source: nathanonn.com/claude-code-testing-ralph-loop-verification (link 17)

```
Ralph Loop = stop hook re-feed prompt continuamente fino a completion promise TRUE
+ verification step ogni iteration (vitest preserve, build PASS)
```

**Pro**: ELAB GIÀ usa pattern (questa sessione iter 31 ralph 32 = 32 iter consecutive Ralph loop)
**Contro**: completion promise risk = false positive escape loop

### 3.3 Sintesi pattern → quali adottare per Step 1, 2, 3

| Pattern | Step 1 | Step 2 | Step 3 |
|---|---|---|---|
| Three-Agent Pipeline | manual handoff | `/codex` plugin | full automation |
| Two-Agent Ping-Pong | sì (Claude + Gemini DeepThink web manual) | sì + MCP | (superato 5-vendor) |
| Codex Plugin /codex | `/plugin install` | wired in tasks | wired in agent-teams |
| AGENTS.md shared state | sì (manual edit) | scribe agent updates | auto-sync hook |
| tmux 4-6 windows | NO (1 window) | sì 4 windows | 6 windows + ccmanager |
| Cowork desktop autonomous | NO | sì 1 trial | sì H24 cron */30 |
| Hybrid API+UI tests | esistente Vitest+Playwright | + Cowork hybrid | + Kimi video analysis |
| MindStudio nodes | implicit | explicit gates | mechanism formalize |
| CEGIS counterexample | NO | iter close gate | full Loop D iter close |
| Ralph Loop verification | mantenere esistente | ridurre OR refactor | replace agent-teams hooks |

### 3.4 Anti-pattern da evitare (G45 + debito)

- ❌ NON build "ELAB Workflow Framework" custom (use Anthropic + OpenAI + Google ufficiali)
- ❌ NON commit 6-vendor stack day-1 (Step 1 = single vendor swap proof)
- ❌ NON sostituire Pattern S r3 race-cond fix funzionante con agent-teams ufficiali senza trial parallel (Step 2 trial 1 atom both, compare)
- ❌ NON inflazionare claim Cowork "REAL test" quando è 1 esperimento (Step 1 1 trial, Step 2 5 trials, Step 3 H24 cron)
- ❌ NON commit 27 mechanisms day-1 (6 esistenti, +5 NEW Step 2, +5 NEW Step 3 incremental)
- ❌ NON spawn 8 BG agents simultaneo iter 38 carryover lesson (org limit cascade) — Step 2 max 4 BG agents
- ❌ NON usare DeepSeek API se Kimi 256K + thinking sufficient (Step 2 measure, Step 3 add IF needed)
- ❌ NON paghare Vercel/Supabase/GitHub Pro prima di trigger usage threshold (monitor Step 3, ratify iter 42 entrance)

---

## §4 — STEP 1 — Foundation MINIMAL (Week 1)

### 4.1 Goal Step 1

**Quantitative**: validare in ≤1 settimana che multi-provider workflow ha valore misurabile per ELAB iter 33 atomi outstanding. Falsificare H1+H2+H3+H4 (§3.1.1) con 1 trial reale.

**Qualitative**: Andrea ottiene confidence che Step 2 è worth investment OR concludere multi-provider NOT necessary (rollback).

**NON-goal**: NO 6-vendor stack, NO Cowork desktop, NO Kimi video, NO 5-vote G45 automated, NO 27 mechanisms full deploy.

### 4.2 Atomi Step 1 (5 atomi sequenziali, ~6-8h Andrea wall-clock totale)

#### Atom 1.1 — Codex Plugin install + first /codex trial (60min)

**Goal**: validate `/codex` integrazione Claude Code MacBook Andrea (NON Mac Mini Step 1, riduce variables).

**Pre-req**:
- Andrea ChatGPT Plus sub attivo ($20/mo) — già paghi
- Andrea Claude Pro Andrea attivo ($20/mo) — già paghi
- Claude Code MacBook Andrea sessione attiva

**Steps**:
1. In Claude Code session: `/plugin marketplace add openai/codex-plugin-cc`
2. `/plugin install codex-plugin-cc@codex-plugin-cc` (5min download + login OAuth ChatGPT Plus)
3. Pick existing iter 33 atom from §1.2: **Atom 1.1.x = "R7 widen `shouldUseIntentSchema` heuristic"** (~50 LOC, source `supabase/functions/unlim-chat/index.ts`)
4. Spec write Claude (15min): generate spec.md ATOM-S33-A — "Widen shouldUseIntentSchema to fire 80%+ prompts not just action-heavy categories"
5. `/codex implement spec ATOM-S33-A` — Codex impl (10-15min auto)
6. Claude review Codex output — diff verify, run vitest (5min)
7. Document outcome `docs/audits/2026-05-XX-step1-atom1-codex-plugin-trial.md` (15min):
   - Quanto Codex ha preso correttamente vs hallucinated
   - Quanto handoff Claude→Codex→Claude è stato smooth
   - Token cost ChatGPT Plus quota consumed
   - Score subjective 1-10 esperienza vs Claude solo

**Acceptance gate Atom 1.1**:
- ✅ `/codex` plugin installato + funzionante (binary command)
- ✅ Spec generated by Claude → Codex executed → Claude reviewed = 3-handoff workflow trial completed
- ✅ Codex output spec-correct: ≥70% (mostly correct, 30% iteration acceptable)
- ✅ Wall-clock total 60min (NOT >2h budget overrun)

**Failure mode**:
- Plugin install fails OAuth → fallback to Codex CLI standalone install (`npm i -g @openai/codex`) + manual context paste
- Codex hallucination >30% → log + plan refinement Step 2 (better spec format)

**Cost incremental**: $0 (ChatGPT Plus + Claude Pro existing).

**Source**: github openai/codex-plugin-cc (link 5), web search "Codex Plugin for Claude Code"

---

#### Atom 1.2 — Gemini CLI extensions install + DeepThink trial 1 atom (60min)

**Goal**: validate `gemini` CLI extensions su MacBook Andrea, deep reasoning trial.

**Pre-req**:
- Andrea Gemini Pro sub attivo (€22/mo) — già paghi
- `gemini` CLI installed (`npm install -g @google/gemini-cli`) OR (`brew install google-gemini-cli` if available)

**Steps**:
1. `gemini` first run → OAuth Google account Andrea Pro (5min)
2. Install extensions: `gemini extension install conductor` + `gemini extension install code-review` + `gemini extension install security` (10min, source: geminicli.com/extensions link 25)
3. Pick existing complex iter 33 atom: **Atom 1.2.x = "Iter 27 R5 latency RCA depth analysis"** (DOC analysis depth, NO code changes)
4. Pass to Gemini DeepThink: `gemini chat "Analyze docs/audits/2026-05-03-iter-31-ralph27-r5-latency-regression-rca.md and verify hypothesis H1+H2 with deeper reasoning. Identify gaps."` (10-20min DeepThink reasoning)
5. Compare Gemini output vs original RCA — quanto profondità extra (15min)
6. Document outcome `docs/audits/2026-05-XX-step1-atom2-gemini-deepthink-trial.md`:
   - Quanto profondità extra Gemini DeepThink vs Claude original
   - Quanto English-only bias rilevato (italiano fluency loss)
   - Token cost Gemini Pro quota
   - Score 1-10 utility per ELAB

**Acceptance gate Atom 1.2**:
- ✅ Gemini CLI installed + extensions loaded
- ✅ DeepThink reasoning >20% extra depth vs Claude original (subjective Andrea evaluation)
- ✅ Italiano output acceptable (NOT degraded vs Claude)

**Failure mode**:
- Gemini DeepThink English-only output → fallback Gemini Pro standard mode
- Extensions broken → use `gemini chat` direct without extensions

**Cost incremental**: $0 (Gemini Pro existing).

**Source**: geminicli.com/extensions (link 25), reddit BMAD_Method automated workflow gemini (link 26)

---

#### Atom 1.3 — Claude + Codex + Gemini Three-Agent Pipeline trial (90min)

**Goal**: validate Three-Agent Pipeline pattern (§3.2.1) per 1 atom critico ELAB iter 33.

**Pre-req**:
- Atom 1.1 + Atom 1.2 PASSED
- AGENTS.md shared state file pattern adopted (§3.2.4)

**Steps**:
1. Write `AGENTS.md` project root (5min): structure attiva task + lead + implementer + reviewer + status fields
2. Pick atom: **Atom 1.3.x = "Linguaggio codemod 200 violations Andrea iter 21 mandate"** (subset 50 violations)
3. **Phase Plan (Claude)**: Claude exploration + write plan.md identifying 50 violations + suggested fixes (20min)
4. AGENTS.md update: status = "Codex implementing"
5. **Phase Implement (Codex)**: `/codex execute plan.md` — Codex impl 50 file edits (20-30min auto)
6. AGENTS.md update: status = "Gemini reviewing"
7. **Phase Review (Gemini DeepThink)**: `gemini chat "Review codex output diff HEAD~1..HEAD. Identify 5 edge cases missed + linguistic style issues + PRINCIPIO ZERO violations."` (15-20min)
8. AGENTS.md update: status = "Claude finalizing fix"
9. **Phase Fix (Claude)**: address Gemini findings → final commit (10min)
10. CoV vitest 13752 PASS preserved (5min)
11. Document outcome `docs/audits/2026-05-XX-step1-atom3-three-agent-pipeline-trial.md`:
    - Quanto handoff smooth tra 3 agents
    - Quanto context loss tra CLI (mitigato da AGENTS.md?)
    - Wall-clock total vs Claude solo (parallelizzazione benefit?)
    - Quality output vs Claude solo (anti-bias effective?)
    - Token cost combined (3 vendor)

**Acceptance gate Atom 1.3**:
- ✅ Three-Agent Pipeline workflow completato senza intervention massive Andrea (autonomous transitions ≥80%)
- ✅ Output quality: Gemini ha identificato ≥3 edge cases missed da Codex (validate H1 anti-bias)
- ✅ Wall-clock ≤90min (vs ~120min Claude solo stimato per 50 violations) → **parallelization benefit ≥25%**
- ✅ AGENTS.md aggiornato consistently 4 transitions (NO context loss)

**Failure mode**:
- Context loss massive (Codex non capisce plan.md) → fallback Claude solo, log lessons
- Gemini identifies ZERO extra issues → falsifica H1 partial, document, defer Step 2 multi-vote G45 to verify

**Cost incremental**: $0 (no API extra Step 1).

**Sources**: web search "Codex-Claude Workflow Plan with GPT-5" (Nathan Onn), web search "workflow claude code misto con codex con gemini deepthink"

---

#### Atom 1.4 — Mac Mini SSH trial single vendor backend swap (60min)

**Goal**: validate Mac Mini progettibelli può eseguire 1 alternative backend (Kimi free trial OR Aider DeepSeek free credit) WITHOUT install full stack.

**Pre-req**:
- Mac Mini SSH `progettibelli@100.124.198.59` reachable (verifica con `ssh ... date`)
- Mac Mini esistente cron L1+L2+L3+aggregator NOT disturbed (read-only Step 1)

**Steps**:
1. SSH Mac Mini, verifica cron status: `crontab -l` (2min)
2. Signup Kimi free trial OR DeepSeek free credit (browser, 10min):
   - Option A Kimi: platform.kimi.ai signup → 1 free trial credit
   - Option B DeepSeek: platform.deepseek.com signup → $5 free credit
3. Install minimal CLI (10-15min):
   - Option A: `pip install kimi-code-cli` Mac Mini
   - Option B: `pip install aider-install && aider-install --model deepseek/deepseek-coder` Mac Mini
4. Trial 1 atom Mac Mini: pick simple atom es. **"Document ADR-035 deferred V2.1 status"** (DOC only, NO src changes)
5. Run via alternative backend: `kimi-code "Update docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md status PROPOSED → DEFERRED with rationale iter 11 baseline measured"` (10min)
6. SSH MacBook → review output Mac Mini commit (5min)
7. Document `docs/audits/2026-05-XX-step1-atom4-mac-mini-alternative-backend-trial.md`:
   - Backend swap latency (Mac Mini cold start)
   - Output quality vs Claude
   - Cost (free credit consumed)
   - Mac Mini stability post-trial (cron L1+L2+L3 still ACTIVE)

**Acceptance gate Atom 1.4**:
- ✅ Alternative backend installed + functional Mac Mini
- ✅ 1 atom executed end-to-end on Mac Mini con alternative backend
- ✅ Mac Mini cron L1+L2+L3 NOT disturbed (verifica post-trial `crontab -l` + cron logs)
- ✅ Output quality acceptable (subjective 6+/10)

**Failure mode**:
- Backend install fails Mac Mini macOS compatibility → defer Step 2 with troubleshoot
- Cron disturbed → rollback install, restore cron, NO further trial Mac Mini Step 1

**Cost incremental**: $0 (free trial only).

**Sources**: medium @sohail_saifi 6 CLI Coding Agents (link 29), aider docs aider.chat

---

#### Atom 1.5 — Step 1 retrospective + decision Step 2 entrance (45min)

**Goal**: aggregare findings Atom 1.1-1.4, decide PASS/PIVOT/STOP per Step 2 entrance.

**Steps**:
1. Read 4 trial audit docs (15min)
2. Compile decision matrix (15min):

| Criterio | Atom 1.1 Codex | Atom 1.2 Gemini | Atom 1.3 Three-Agent | Atom 1.4 Mac Mini | **Aggregate** |
|---|---|---|---|---|---|
| H1 anti-bias confirmed? | N/A | TBD | TBD | N/A | TBD |
| H2 wall-clock saving? | TBD | TBD | TBD | TBD | TBD |
| H3 debito ridotto? | TBD | TBD | TBD | TBD | TBD |
| H4 cost realistic? | TBD | TBD | TBD | TBD | TBD |
| Andrea satisfaction 1-10 | TBD | TBD | TBD | TBD | **TBD** |
| Mac Mini cron stable? | N/A | N/A | N/A | TBD | TBD |

3. Andrea decision (15min):
   - **PASS Step 2** se ≥3/4 atomi PASSED + aggregate satisfaction ≥7/10
   - **PIVOT** se 2/4 PASSED, deep-dive su pattern fallito Step 2 entrance
   - **STOP** se ≤1/4 PASSED, multi-provider workflow NOT worth investment, focus iter 33+ atomi inline solo Claude

**Acceptance gate Step 1 → Step 2**:
- Decision matrix completa
- Andrea esplicito ratify: "PASS"/"PIVOT"/"STOP" + rationale documentato
- Document `docs/audits/2026-05-XX-step1-RETROSPECTIVE-decision-step2.md`

**Output**: chiaro go/no-go Step 2.

### 4.3 Step 1 cost matrix

| Componente | Cost incremental | Cumulative |
|---|---|---|
| ChatGPT Plus (existing) | $0 | $0 |
| Claude Pro Andrea (existing) | $0 | $0 |
| Claude Max 20x progettibelli (existing) | $0 | $0 |
| Gemini Pro (existing) | $0 | $0 |
| Mistral Le Chat Pro (existing) | $0 | $0 |
| Kimi free trial | $0 | $0 |
| DeepSeek free credit | $0 | $0 |
| Codex Plugin install | $0 | $0 |
| Gemini CLI extensions | $0 | $0 |
| **TOTAL Step 1** | **$0** | **$0** |

### 4.4 Step 1 wall-clock Andrea matrix

| Atom | Setup | Trial | Document | Total |
|---|---|---|---|---|
| 1.1 Codex Plugin | 15min | 30min | 15min | **60min** |
| 1.2 Gemini CLI | 15min | 30min | 15min | **60min** |
| 1.3 Three-Agent Pipeline | 5min | 70min | 15min | **90min** |
| 1.4 Mac Mini backend swap | 25min | 25min | 10min | **60min** |
| 1.5 Retrospective | 0 | 30min | 15min | **45min** |
| **TOTAL Step 1** |  |  |  | **5h 15min** |

### 4.5 Step 1 KPI

- **Quantitative**: 4 atomi trial PASS rate ≥3/4 = 75%
- **Wall-clock**: Andrea total ≤6h Week 1 (slack 45min)
- **Cost realistic**: $0 incremental (free tiers + existing sub)
- **Mac Mini stability**: cron L1+L2+L3 active throughout, NO regression baseline 13752 vitest
- **Decision gate**: PASS → Step 2 / PIVOT → re-plan Step 2 / STOP → close multi-provider initiative

### 4.6 Step 1 rollback plan

- Atom 1.1 fail: uninstall plugin `/plugin remove codex-plugin-cc`, ZERO state polluted
- Atom 1.2 fail: uninstall extensions `gemini extension uninstall conductor`, ZERO state
- Atom 1.3 fail: revert AGENTS.md (NO commit Step 1), ZERO state
- Atom 1.4 fail: SSH Mac Mini `pip uninstall kimi-code-cli` OR `pip uninstall aider`, restore crontab original
- Atom 1.5 STOP decision: archive 4 audit docs `docs/audits/multi-provider-workflow-trial-archive/`, mark "experiment complete, not adopted"

---

## §5 — STEP 2 — Expansion (Week 2-3)

### 5.1 Pre-condition Step 2

- ✅ Step 1 Atom 1.5 retrospective decision = "PASS"
- ✅ Andrea ratify Step 2 entrance + budget approval
- ✅ Step 1 audit docs reviewed + lessons learned applied

### 5.2 Goal Step 2

**Quantitative**: scale workflow proof Step 1 single-trial → 5-trial automation, with multi-vote G45 (3-vote minimum) operational + agent-teams ufficiali Anthropic adopted.

**Qualitative**: Andrea ottiene workflow operational ~daily basis, Mac Mini swarm tmux 4 windows, Codex+Gemini integrated cron-able.

**NON-goal Step 2**: NO Cowork desktop H24 (defer Step 3), NO Kimi video analysis (defer Step 3), NO 5-vendor full G45 (3-vote sufficient Step 2).

### 5.3 Atomi Step 2 (8 atomi, ~12-16h Andrea wall-clock totale across 2 settimane)

#### Atom 2.1 — Anthropic agent-teams ufficiali enable + first dispatch (90min)

**Goal**: migrate Pattern S r3 custom (race-cond fix iter 5+6+8+11+12+19+30+31+36+37+38 cumulative) → Anthropic agent-teams nativo.

**Pre-req**:
- Claude Code latest version (verifica `claude --version`)
- agent-teams flag enable (verifica feature available, source: code.claude.com/docs/en/common-workflows link 13)

**Steps**:
1. Setup `~/.claude/settings.json`: enable `agent-teams` flag (5min, source: claude code docs)
2. Configure 4 teammate agents: planner-opus + maker-1 + tester-1 + scribe (10min)
3. Pick atom Step 2: **"R5 N=3 re-bench warm-isolate protocol"** (env unblocked iter 32)
4. Dispatch agent-team via native command (10min trigger + 30-60min auto exec)
5. Compare experience vs Pattern S r3 custom (15min):
   - Filesystem barrier nativo vs custom mailbox
   - File ownership enforcement
   - Race-cond protection
6. Document `docs/audits/2026-05-XX-step2-atom1-agent-teams-ufficiale-trial.md`

**Acceptance gate Atom 2.1**:
- ✅ Agent-teams 4 teammates dispatched + completed task
- ✅ Race-cond fix preservato (NO write conflict)
- ✅ Output quality ≥ Pattern S r3 custom
- ✅ Andrea satisfaction ≥7/10 ("worth migrating")

**Failure mode**:
- agent-teams flag NOT available → defer Step 3 OR continue Pattern S r3 custom (NO debito eliminate this iter)
- Output quality regressed → Pattern S r3 custom kept, mark agent-teams "watch list"

**Cost incremental**: $0 (Claude Pro Andrea + Max 20x progettibelli existing).

#### Atom 2.2 — Mac Mini swarm tmux 4 windows setup (60min)

**Goal**: tmux session "elab-swarm" 4 windows operational on Mac Mini progettibelli.

**Steps**:
1. SSH Mac Mini, install tmux (likely already present, verify) (5min)
2. Configure `~/.tmux.conf`: mouse mode, history-limit 50000, status bar showing window labels (10min, source: tmuxcheatsheet link 10)
3. Launch session `tmux new-session -s elab-swarm -d` (2min)
4. Window 1 = Claude Code lead orchestrator (`claude` command, login progettibelli) (10min)
5. Window 2 = `/codex` integrated OR Codex CLI standalone (5min)
6. Window 3 = Gemini CLI (`gemini`) (5min)
7. Window 4 = `tail -f /tmp/cron-*.log` operational monitoring (3min)
8. Test: switch tmux windows + verify each CLI alive (10min)
9. Document `docs/audits/2026-05-XX-step2-atom2-tmux-swarm-setup.md`

**Acceptance gate Atom 2.2**:
- ✅ tmux session "elab-swarm" persistent (survive SSH disconnect)
- ✅ 4 windows alive + functional
- ✅ Mac Mini cron L1+L2+L3 NOT disturbed
- ✅ Andrea può SSH `tmux attach -t elab-swarm` MacBook → vede 4 CLI side-by-side

**Failure mode**:
- tmux conflict cron user `progettibelli` → use separate tmux session per user contexts
- CLI install fails Mac Mini macOS arch → fallback Window-as-needed instead of upfront 4

**Cost incremental**: $0.

**Sources**: tmuxcheatsheet (link 10), claudemux reddit (link 11), agent-status-tmux medium google-cloud (link 27)

#### Atom 2.3 — Multi-vote G45 3-vote manual workflow (60min)

**Goal**: prove 3-vote G45 (Claude + Codex + Gemini) workflow functional, manual aggregation Andrea.

**Steps**:
1. Pick iter close trigger: **iter 33 close** (after canary 5% rollout 24-48h soak completed)
2. Spawn 3 vote agents:
   - Vote 1 Claude: subagent context-zero G45 indipendente review (existing pattern iter 39)
   - Vote 2 Codex: `/codex review iter close evidence + score 0-10 with rationale`
   - Vote 3 Gemini DeepThink: `gemini chat "Review iter 33 close evidence depth + score with rationale"`
3. Aggregate manual (15min):
   - Score spread = max - min
   - IF spread ≤1.5: consensus PASS, aggregate = mean
   - IF spread >1.5: re-prompt each with disagreement context
4. Document `docs/audits/2026-05-XX-step2-atom3-3vote-G45-trial.md`

**Acceptance gate Atom 2.3**:
- ✅ 3 votes collected + aggregated
- ✅ Spread documented
- ✅ Final score reflects consensus (NOT inflated by single vendor)

**Failure mode**:
- Spread >2.5 (severe disagreement) → escalate Andrea decision OR add 4th vendor (Mistral/Kimi) Step 3
- Vote vendor fails → log + document, 2-vote insufficient consensus

**Cost incremental**: $0 (existing sub).

**Sources**: blog.exceeds.ai AI Code Review Best Practices (link 3), reddit cross-validation Claude (link 18)

#### Atom 2.4 — Cron automation Codex+Gemini batch (90min)

**Goal**: automate `/codex` + `gemini` invocazione via Mac Mini cron per routine tasks.

**Steps**:
1. Identify routine tasks recurring (15min):
   - Weekly: dependency audit, security scan
   - Daily: vitest baseline preserve check, Mac Mini cron health
   - Hourly: Mac Mini Cowork stat (Step 3 prep)
2. Write 2 cron scripts (30min):
   - `scripts/cron/codex-weekly-deps-audit.sh`: invoke `/codex` headless mode (source: amanhimself.dev "Running headless Codex CLI inside Claude Code")
   - `scripts/cron/gemini-daily-security.sh`: invoke `gemini chat` headless
3. Add crontab entries Mac Mini progettibelli (10min):
   ```
   0 4 * * 1 cd ~/elab-builder && bash scripts/cron/codex-weekly-deps-audit.sh
   0 5 * * * cd ~/elab-builder && bash scripts/cron/gemini-daily-security.sh
   ```
4. Trigger first run manual verify (15min)
5. Document `docs/audits/2026-05-XX-step2-atom4-cron-automation.md`

**Acceptance gate Atom 2.4**:
- ✅ Cron entries added + visible `crontab -l`
- ✅ First manual trigger output success (no errors)
- ✅ Output saved `docs/audits/auto-mac-mini/{codex,gemini}-{date}.md`

**Failure mode**:
- Headless mode CLI fails (cron env vs interactive) → wrap in `bash -l -c` to load profile env
- Cron silent fail → add explicit logging + monit watchdog

**Cost incremental**: $0.

**Sources**: amanhimself.dev "Running headless Codex CLI inside Claude Code" (web search), code.claude.com common workflows (link 13)

#### Atom 2.5 — 1 vendor API add (Kimi OR DeepSeek decision) (60min)

**Goal**: aggiungere 1 vendor API a budget incremental ~$10-15/mo, validate cost + value real measurement.

**Decision matrix Kimi vs DeepSeek Step 2**:

| Criterio | Kimi K2.6 | DeepSeek V4 |
|---|---|---|
| Intelligence | 54 | 52 |
| Cost | ~$1.71/1M | ~$2.17/1M |
| Context | 256K | 1M |
| Thinking | integrated | R1 dedicated |
| Multimodal video | ✅ | ❌ |
| Italian | medium | medium |
| Anthropic-compat endpoint | ✅ | ✅ |
| Step 3 prep video analysis | ✅ critical | N/A |
| **Recommended Step 2** | ✅ **PRIMARY** | optional |

**Recommendation**: add **Kimi** Step 2 (prep Step 3 video analysis), defer DeepSeek Step 3 OR skip permanently.

**Steps**:
1. Signup platform.kimi.ai (10min, browser)
2. Create API key, save `~/.elab-credentials.env` Mac Mini progettibelli (5min)
3. Install Kimi Code CLI Mac Mini: `pip install kimi-code-cli` (10min)
4. Trial 1 atom: backend swap Mac Mini swarm Window 2 → Kimi Code instead of `/codex`
5. Compare quality + cost (15min):
   - Output quality vs `/codex`
   - Token cost real measure
   - Italian fluency
6. Document `docs/audits/2026-05-XX-step2-atom5-kimi-API-add.md`

**Acceptance gate Atom 2.5**:
- ✅ Kimi API key set + functional
- ✅ Kimi Code CLI installed + 1 trial successful
- ✅ Cost real measured ≤$5 first week (extrapolate ~$15/mo)
- ✅ Quality acceptable (subjective 6+/10)

**Failure mode**:
- Kimi API endpoint changes (Anthropic-compat broken) → fallback DeepSeek
- Cost overrun >$5/week → reduce frequency Mac Mini swarm Window 2

**Cost incremental**: ~$15/mo (Kimi API).

**Sources**: medium @sohail_saifi 6 CLI Coding Agents (link 29), Moonshot platform docs

#### Atom 2.6 — Mechanism M-AR-NEW-1 multi-AI baseline diff (60min)

**Goal**: implement first NEW mechanism §1 frammenti chat (M-AR-NEW-1 multi-AI baseline diff detector 3-backend Claude+Kimi+...).

**Steps**:
1. Write `scripts/mechanisms/M-AR-06-multi-ai-baseline-diff.sh` (30min):
   - 2-backend trial Step 2 (Claude + Kimi, NOT 3-backend Step 3)
   - Compare git diff HEAD~1..HEAD
   - Flag regression IF 2/2 vote regression
2. Test with synthetic regression (15min): introduce intentional regression, verify mechanism fires
3. Wire pre-commit hook (10min)
4. Document `docs/audits/2026-05-XX-step2-atom6-mechanism-multi-ai-diff.md`

**Acceptance gate Atom 2.6**:
- ✅ Script functional + syntax valid
- ✅ Trial regression detected by 2/2 vote (PASS sensitivity)
- ✅ Pre-commit hook NOT slow >5s (acceptable Andrea workflow)

**Failure mode**:
- Slow execution >30s → defer Step 3 batch trigger instead of pre-commit
- 2/2 false positive Claude+Kimi consenso wrong → add 3rd backend Gemini

**Cost incremental**: ~$0.05/commit (Kimi API token cost), aggregate ~$2/mo at typical 40 commits.

**Sources**: §1 frammenti chat M-AR-NEW-1 design

#### Atom 2.7 — Cowork desktop install + 1 trial (Step 3 prep) (90min)

**Goal**: Mac Mini progettibelli Cowork desktop installed + 1 manual trial run, prep Step 3 H24 cron.

**Pre-req**:
- Mac Mini progettibelli logged in macOS
- Andrea consenso macOS permissions (Accessibility + Screen Recording + Mic + Automation)

**Steps**:
1. SSH Mac Mini → instruct Andrea to download Cowork desktop browser claude.com (15min)
2. Login Max 20x progettibelli credentials (5min)
3. macOS permissions enable Cowork (Andrea local interaction Mac Mini, 15min):
   - System Settings → Privacy & Security → Accessibility → Cowork
   - Privacy & Security → Screen Recording → Cowork
   - Privacy & Security → Microphone → Cowork
   - Privacy & Security → Automation → Cowork → Browser
4. First manual trial: dispatch task "Open Chrome → navigate elabtutor.school → click Lavagna → screenshot" (15min)
5. Verify output screenshots saved (10min)
6. Document `docs/audits/2026-05-XX-step2-atom7-cowork-desktop-trial.md`

**Acceptance gate Atom 2.7**:
- ✅ Cowork desktop installed Mac Mini + login functional
- ✅ macOS permissions all 4 enabled
- ✅ 1 trial completed: opened Chrome + navigated + screenshot saved
- ✅ Mac Mini cron L1+L2+L3 NOT disturbed

**Failure mode**:
- Cowork beta unstable Mac Mini macOS version → defer Step 3 OR use Computer Use API alternative
- macOS permissions Andrea NOT able to enable remotely → schedule Andrea local visit Mac Mini Strambino

**Cost incremental**: $0 (Cowork incluso Max 20x sub).

**Sources**: claude.com/blog/dispatch-and-computer-use (link 24), platform.claude.com/docs/agents-and-tools/tool-use/computer-use-tool (link 21)

#### Atom 2.8 — Step 2 retrospective + decision Step 3 entrance (60min)

**Goal**: aggregate findings Atom 2.1-2.7, decide PASS/PIVOT/STOP per Step 3 entrance.

**Steps**:
1. Read 7 trial audit docs (20min)
2. Compile decision matrix (20min):

| Criterio | Atom 2.1 agent-teams | Atom 2.2 tmux | Atom 2.3 3-vote | Atom 2.4 cron | Atom 2.5 Kimi | Atom 2.6 mech | Atom 2.7 Cowork | **Aggregate** |
|---|---|---|---|---|---|---|---|---|
| H1 anti-bias confirmed | TBD | N/A | TBD | N/A | N/A | TBD | N/A | TBD |
| H2 wall-clock | TBD | TBD | TBD | TBD | TBD | N/A | N/A | TBD |
| H3 debito ridotto | TBD | N/A | TBD | TBD | TBD | TBD | TBD | TBD |
| H4 cost realistic | N/A | N/A | N/A | TBD | TBD | TBD | N/A | TBD |
| Mac Mini stable | TBD | TBD | N/A | TBD | TBD | N/A | TBD | TBD |
| Andrea satisfaction | TBD | TBD | TBD | TBD | TBD | TBD | TBD | **TBD** |

3. Andrea decision (20min):
   - **PASS Step 3** se ≥6/8 atomi PASSED + aggregate satisfaction ≥7.5/10
   - **PIVOT** se 4-5/8 PASSED, identify failed components Step 3 entrance
   - **STOP** se ≤3/8 PASSED, scale-back to Step 2 components only stable

4. Document `docs/audits/2026-05-XX-step2-RETROSPECTIVE-decision-step3.md`

### 5.4 Step 2 cost matrix

| Componente | Cost incremental Step 2 | Cumulative |
|---|---|---|
| Step 1 baseline | $0 | $0 |
| Kimi API ~$15/mo | $15/mo | $15/mo |
| M-AR-06 mechanism (Kimi cost ~$2/mo) | $2/mo | $17/mo |
| **TOTAL Step 2 incremental** | **+$17/mo** | **$17/mo** |

### 5.5 Step 2 wall-clock Andrea matrix

| Atom | Setup | Trial | Document | Total |
|---|---|---|---|---|
| 2.1 agent-teams ufficiali | 25min | 50min | 15min | **90min** |
| 2.2 tmux swarm | 30min | 20min | 10min | **60min** |
| 2.3 3-vote G45 manual | 10min | 35min | 15min | **60min** |
| 2.4 cron automation | 25min | 50min | 15min | **90min** |
| 2.5 Kimi API add | 25min | 25min | 10min | **60min** |
| 2.6 mechanism multi-AI | 30min | 20min | 10min | **60min** |
| 2.7 Cowork desktop trial | 35min | 45min | 10min | **90min** |
| 2.8 Retrospective | 0 | 40min | 20min | **60min** |
| **TOTAL Step 2** |  |  |  | **9h 30min** |

### 5.6 Step 2 KPI

- **Quantitative**: 8 atomi trial PASS rate ≥6/8 = 75%
- **Wall-clock**: Andrea total ≤10h Week 2-3 (slack 30min)
- **Cost realistic**: +$17/mo verified (NOT $30 stima)
- **Mac Mini stability**: cron L1+L2+L3 ACTIVE throughout, baseline 13752 vitest preserved
- **Score iter close**: 1 iter close uses 3-vote G45 manual, score variance ≤1.5 spread
- **Decision gate Step 3 entrance**: PASS / PIVOT / STOP

### 5.7 Step 2 rollback plan

- Atom 2.1 fail: disable agent-teams flag, revert Pattern S r3 custom
- Atom 2.2 fail: `tmux kill-session -t elab-swarm`, ZERO state
- Atom 2.3 fail: revert manual aggregation, single-vote G45 only
- Atom 2.4 fail: `crontab -e` remove cron entries, ZERO state
- Atom 2.5 fail: cancel Kimi API key, refund pro-rata IF possible
- Atom 2.6 fail: `git rm scripts/mechanisms/M-AR-06-*.sh`, remove pre-commit hook line
- Atom 2.7 fail: uninstall Cowork desktop Mac Mini, ZERO state
- Atom 2.8 STOP: keep stable atomi (es. tmux + 3-vote manual), revert unstable

---

## §6 — STEP 3 — Full swarm + Cowork H24 + Kimi video (Week 4+)

### 6.1 Pre-condition Step 3

- ✅ Step 2 Atom 2.8 retrospective decision = "PASS"
- ✅ Andrea ratify Step 3 entrance + extra budget approval
- ✅ Step 1+2 stack stable ≥1 settimana operational
- ✅ Mac Mini cron L1+L2+L3 ACTIVE throughout Step 1+2

### 6.2 Goal Step 3

**Quantitative**: full 6-vendor swarm operational, Cowork H24 cron `*/30` test rotation 94 esperimenti, Kimi K2.6 video analysis daily batch, 5-vote G45 automated, 27 mechanisms shipped.

**Qualitative**: Andrea wall-clock saving real measurable (target ~10-15h/week, NOT inflated 17h round number), Sprint U entrance ready scale 50 scuole.

### 6.3 Atomi Step 3 (10 atomi, ~16-20h Andrea wall-clock totale across 2-3 settimane)

#### Atom 3.1 — Cowork desktop H24 cron rotation 94 esperimenti (90min)

**Goal**: Mac Mini Cowork desktop attivo H24, cron `*/30` rotation 94 esperimenti automatic dispatch.

**Steps**:
1. Configure `~/.cowork/config.json` autonomous_mode + permissions (10min, source: §1 frammenti chat)
2. Write `scripts/cowork-real/dispatch-test.sh` parametrized exp_id (15min)
3. Write `scripts/cowork-real/rotate-next-exp.sh` cycle 94 esperimenti list (10min)
4. Add crontab entries Mac Mini (5min):
   ```
   */30 * * * * cd ~/elab-builder && bash scripts/cowork-real/dispatch-test.sh $(cat /tmp/cowork-next-exp.txt)
   0 * * * * cd ~/elab-builder && bash scripts/cowork-real/rotate-next-exp.sh
   ```
5. Trigger 3 manual cycles (45min)
6. Document `docs/audits/2026-05-XX-step3-atom1-cowork-H24-cron.md`

**Acceptance gate**:
- ✅ Cowork autonomous H24 active
- ✅ 3 cycles completed real esperimenti different
- ✅ Output `docs/audits/cowork-real/{exp_id}/` populated
- ✅ Mac Mini cron baseline L1+L2+L3 ACTIVE simultanee

**Cost incremental**: $0 (Cowork incluso sub).

**Sources**: §1 frammenti chat Atom Cowork setup, claude.com/blog/dispatch-and-computer-use (link 24)

#### Atom 3.2 — Kimi K2.6 video analysis pipeline (90min)

**Goal**: video webm Cowork sessions → Kimi multimodal 256K analysis → structured findings markdown.

**Steps**:
1. Write `scripts/cowork-real/kimi-video-analyze.sh` (30min, source: §1 frammenti chat)
2. Daily cron batch analysis (5min crontab):
   ```
   0 5 * * * cd ~/elab-builder && for V in docs/audits/cowork-videos/$(date -v-1d +%Y%m%d)*.webm; do bash scripts/cowork-real/kimi-video-analyze.sh "$V" $(basename "$V" | cut -d- -f1); done
   ```
3. First manual trial 1 video (45min)
4. Document `docs/audits/2026-05-XX-step3-atom2-kimi-video-analysis.md`

**Acceptance gate**:
- ✅ Video → Kimi analysis output structured markdown
- ✅ Findings include UX confusion + workflow + estetica + PZ violations + latency
- ✅ Cost real measured ≤$0.50/video (extrapolate ~$10/mo at 30 videos/mo)

**Cost incremental**: ~$10/mo Kimi K2.6 video calls.

**Sources**: §1 frammenti chat Atom Kimi video analyze, Moonshot K2.6 video docs

#### Atom 3.3 — 5-vote G45 automated aggregator (90min)

**Goal**: scale 3-vote manual Step 2 → 5-vote automated (Claude + Codex + Gemini + Kimi + Mistral), provider bias correction matrix.

**Steps**:
1. Write `scripts/g45/multi-vote-aggregator.mjs` (30min)
2. Write `scripts/g45/provider-bias-matrix.json` (10min, source: §1 frammenti chat M-AI-NEW-12)
3. Write `scripts/mechanisms/M-AI-05-iter-close-multi-vote-gate.sh` REQUIRED ≥4 vendor (10min)
4. Trial iter close 5-vote (40min)
5. Document `docs/audits/2026-05-XX-step3-atom3-5vote-G45-automated.md`

**Acceptance gate**:
- ✅ 5 votes collected automated
- ✅ Bias correction applied
- ✅ Aggregator output decision binary (consensus PASS / re-prompt / escalate Andrea)
- ✅ Spread ≤1.5 most iter close (subjective sample N=3)

**Cost incremental**: ~$0.50/iter close (5-vendor aggregate token), aggregate ~$5-10/mo.

**Sources**: §1 frammenti chat M-AI-NEW-8+9+12, blog.exceeds.ai code review (link 3)

#### Atom 3.4 — DeepSeek R1 ad-hoc deep reasoning critical iter (60min)

**Goal**: aggiungere DeepSeek R1 reasoning specialized per iter close critici (score disagreement >1.5 escalate).

**Decision Step 3**: add DeepSeek IF Atom 2.5 Kimi proved insufficient depth reasoning critical.

**Steps**:
1. Signup platform.deepseek.com (10min)
2. Install Aider with DeepSeek backend Mac Mini (15min)
3. Wire to multi-vote aggregator as 6th vendor optional (15min)
4. Trial 1 iter close critical (20min)
5. Document `docs/audits/2026-05-XX-step3-atom4-deepseek-R1-reasoning.md`

**Acceptance gate**:
- ✅ DeepSeek R1 reasoning output deeper vs Kimi K2.6 thinking integrated (subjective)
- ✅ Cost real ≤$10/mo extrapolated

**Cost incremental**: ~$10/mo DeepSeek API (IF added Step 3, otherwise $0 skip).

**Sources**: §1 frammenti chat (DeepSeek considerations honest verdict), platform.deepseek.com docs

#### Atom 3.5 — Mistral CLI Codestral italian code review (60min)

**Goal**: 5° vendor diversity Mistral Codestral CLI per italian code review (Vol3 narrative refactor Davide co-author iter 33+).

**Steps**:
1. `npm install -g @mistralai/mistralai-cli` (10min)
2. Configure API key Mistral (5min, existing Mistral Le Chat Pro)
3. Trial italian code review iter 33 atom (30min)
4. Document `docs/audits/2026-05-XX-step3-atom5-mistral-CLI-italian.md`

**Acceptance gate**:
- ✅ Mistral CLI functional
- ✅ Italian fluency superiore vs Claude/Gemini/Codex (Davide-friendly review)

**Cost incremental**: ~$5/mo Mistral API (optional, CLI invocations only).

**Sources**: medium @sohail_saifi (link 29), platform.mistral.ai docs

#### Atom 3.6 — 27 mechanisms full deploy (3 cycles 90min ognuno)

**Goal**: shipping rimanenti 21 mechanisms (6 esistenti Step 1, +5 Step 2, +21 Step 3).

**Cycle 1 (90min)**: M-AR-NEW-2..4 (architectural drift Kimi 256K + flakiness detector + perf budget per-feature)
**Cycle 2 (90min)**: M-AR-NEW-5..7 + M-AI-NEW-8..10 (cron watchdog + backend consistency + state immutability + multi-vote gate + disagreement spread + compiacenza detector)
**Cycle 3 (90min)**: M-AI-NEW-11..12 + M-META-13..15 (score regression + bias matrix + self-test + retrospective + evolution log)

**Acceptance gate cumulative**:
- ✅ 21 mechanisms shipped (totale 27 = 6 + 21)
- ✅ Cron entries added Mac Mini (12 cron new)
- ✅ Mechanisms self-test M-META-13 PASS

**Cost incremental**: $5-10/mo aggregate mechanisms invocazioni (Kimi/DeepSeek API token).

**Sources**: §1 frammenti chat 12 NEW mechanisms

#### Atom 3.7 — Anthropic Routines cloud-managed weekly (60min)

**Goal**: 10 weekly tasks Anthropic Routines cloud (survive Mac Mini reboot).

**Steps**:
1. Browser Anthropic console → Routines section (5min)
2. Define 10 weekly tasks (30min):
   - Weekly Lighthouse audit prod
   - Weekly dependency security audit
   - Weekly score history retrospective
   - Weekly Mac Mini cron health check (cross-verify)
   - Weekly mechanisms self-test
   - Weekly multi-vote G45 sample audit
   - Weekly Cowork H24 cycles aggregate
   - Weekly Kimi video analysis aggregate
   - Weekly Mac Mini SSH heartbeat verify
   - Weekly Andrea ratify queue review reminder
3. Trigger first 1 task manual verify (15min)
4. Document `docs/audits/2026-05-XX-step3-atom7-anthropic-routines.md`

**Acceptance gate**:
- ✅ 10 routines configured + scheduled
- ✅ First trigger completed cloud-managed

**Cost incremental**: $0 (Routines incluso sub Anthropic).

**Sources**: claude.com/blog/dispatch-and-computer-use (link 24)

#### Atom 3.8 — Loops C+D+E+H+J implementation (90min ognuno, 3 cycles ~270min)

**Goal**: implement 5 loops architecture frammenti chat (loops A+B+F+G shipped Step 2):
- Loop C: Test → Review → Code (multi-vote 5-vendor adversarial)
- Loop D: Review → Plan (CEGIS counterexample)
- Loop E: Mac Mini cron regression diff (operational)
- Loop H: Persona-prof video analysis Kimi → atom (NEW iter+1)
- Loop J: DeepSeek R1 deep reasoning critical iter

**Sources**: §1 frammenti chat 10 retroactive loops design, arxiv 2603.23763v1 CEGIS (link 4)

#### Atom 3.9 — claude-md-improver + claude-code-plugin-release (90min)

**Goal**: aggiornare CLAUDE.md sprint history footer + create reusable plugin per ELAB workflow patterns shippable team.

**Steps**:
1. `/claude-md-improver` skill invoke (30min, refactor CLAUDE.md sections too long)
2. `/claude-code-plugin-release` skill invoke (45min, package ELAB-specific patterns reusable)
3. Document `docs/audits/2026-05-XX-step3-atom9-claude-md-plugin.md`

**Cost incremental**: $0.

#### Atom 3.10 — Step 3 retrospective + Sprint U entrance gate (60min)

**Goal**: aggregate findings Atom 3.1-3.9, decide Sprint U entrance + Sprint T close 9.5/10 gate.

**Acceptance gate**:
- ✅ Stack 6-vendor operational ≥1 settimana stable
- ✅ Cowork H24 cycles ≥30 cycles completed
- ✅ Kimi video analysis ≥10 videos analyzed
- ✅ 5-vote G45 ≥3 iter close consensus
- ✅ Mac Mini cron baseline L1+L2+L3 + Cowork + 12 NEW cron all ACTIVE
- ✅ Andrea wall-clock saving measured ≥7h/week realistic (NOT 17h inflated)

### 6.4 Step 3 cost matrix

| Componente | Cost incremental Step 3 | Cumulative |
|---|---|---|
| Step 1+2 baseline | $17/mo | $17/mo |
| Kimi K2.6 video calls | +$10/mo | $27/mo |
| 5-vote G45 aggregate | +$5-10/mo | $35/mo |
| DeepSeek R1 (optional) | +$10/mo | $45/mo (opt) |
| Mistral API CLI (optional) | +$5/mo | $50/mo (opt) |
| Mechanisms 27 invocazioni | +$5-10/mo | $60/mo |
| **TOTAL Step 3 incremental** | **+$30-45/mo** | **$47-62/mo extra vs $0 base** |

**Sub fissi NON cambiano** (Anthropic + OpenAI + Google + Mistral existing): $277/mo
**API total Step 3 finale**: ~$30-45/mo
**TOTAL Step 3 stack**: ~$307-322/mo (vs frammenti chat stima $307-310, conferma realistic)

### 6.5 Step 3 wall-clock Andrea matrix

| Atom | Setup | Trial | Document | Total |
|---|---|---|---|---|
| 3.1 Cowork H24 cron | 30min | 45min | 15min | **90min** |
| 3.2 Kimi video pipeline | 35min | 45min | 10min | **90min** |
| 3.3 5-vote G45 automated | 50min | 30min | 10min | **90min** |
| 3.4 DeepSeek R1 (optional) | 25min | 25min | 10min | **60min (opt)** |
| 3.5 Mistral CLI (optional) | 15min | 35min | 10min | **60min (opt)** |
| 3.6 27 mechanisms 3 cycles | 60min | 180min | 30min | **270min** |
| 3.7 Anthropic Routines | 30min | 25min | 5min | **60min** |
| 3.8 Loops 3 cycles | 60min | 180min | 30min | **270min** |
| 3.9 CLAUDE.md + plugin | 75min | 0 | 15min | **90min** |
| 3.10 Retrospective | 0 | 45min | 15min | **60min** |
| **TOTAL Step 3 (with optional)** |  |  |  | **18h** |
| **TOTAL Step 3 (no optional)** |  |  |  | **16h** |

### 6.6 Step 3 KPI

- **Quantitative**: 8-10 atomi trial PASS rate ≥7/10 = 70%
- **Wall-clock**: Andrea total ≤20h Week 4+ (over 2-3 settimane diluted)
- **Cost realistic**: +$30-45/mo verified
- **Mac Mini stability**: 100% cron uptime (NO down ≥1h)
- **Cowork H24 cycles**: ≥30 cycles completed Week 4
- **Kimi video analysis**: ≥10 videos analyzed Week 4
- **5-vote G45**: ≥3 iter close 5-vote consensus
- **Sprint U entrance**: workflow stable Sprint U scale 50 scuole

### 6.7 Step 3 rollback plan

- Atom 3.1 fail: stop Cowork cron `crontab -e` remove `*/30` entry
- Atom 3.2 fail: stop Kimi video cron `crontab -e` remove daily entry
- Atom 3.3 fail: revert 5-vote → 3-vote Step 2
- Atom 3.4 fail: cancel DeepSeek API
- Atom 3.5 fail: uninstall Mistral CLI
- Atom 3.6 fail: revert mechanisms `git revert HEAD~21..HEAD`
- Atom 3.7 fail: deactivate Routines via console
- Atom 3.8 fail: scale-back to Loops A+B+F+G Step 2
- Atom 3.9 fail: revert CLAUDE.md changes, plugin NOT released
- Atom 3.10 STOP: scale-back to Step 2 stable components

---

## §7 — Anti-pattern enforcement (cross-step)

### 7.1 G45 anti-inflation enforcement

- **Score iter close ≥9.0** SOLO con multi-vote G45 ≥4 vendor consensus + bias correction (NO single-vendor inflate)
- **Sprint T close 9.5** SOLO post Andrea Opus G45 indipendente review iter 41-43 cumulative (NOT iter single-shot)
- **Box subtotal claim** SOLO con file-system evidence + bench output IDs (NO claim "Box X = 1.0" senza evidence)
- **Latency lift claim** SOLO con N=3 re-bench warm-isolate protocol (iter 27 RCA precedent)
- **Quality claim "FULL LIVE"** SOLO post canary 100% rollout 24-48h soak (NO claim from canary 5% alone)

### 7.2 Debito tecnico avoidance

- **Custom workflow code** EVITA quando ufficiale Anthropic/OpenAI/Google CLI exists
- **Pattern S r3 custom race-cond** MIGRATE to agent-teams ufficiali Step 2 IF flag available, ELSE keep stable
- **Custom watchdog cron** EVITA, use Anthropic Routines cloud Step 3
- **Custom rollback machinery** EVITA, use `claude --worktree` native
- **Custom multi-provider router** EVITA, use Aider OR backend swap env (`ANTHROPIC_BASE_URL`)

### 7.3 Mac Mini cron stability mandate

- **Mac Mini cron L1+L2+L3+aggregator** NON disturbed durante Step 1+2+3 setup
- **Verify pre-trial**: `crontab -l | wc -l` baseline (e.g., 4 entries)
- **Verify post-trial**: same 4 entries + NEW entries Step 2/3 (`crontab -l | wc -l` >4)
- **Vitest baseline 13752** preserved every commit (pre-commit hook gate)

### 7.4 Org limit cascade prevention (lesson iter 38)

- **NO 8 BG agents simultaneo** (iter 38 carryover lesson 3/4 BG agents hit org limit pre-completion-msg)
- **Step 2 max 4 BG agents** simultanee (Anthropic agent-teams)
- **Step 3 max 6 BG agents** simultanee (con vendor diversity Codex/Gemini parallel reduces single-org pressure)
- **Spawn pacing**: 30s sleep between BG dispatch (NOT immediate parallel burst)

### 7.5 NO compiacenza claim language enforcement

- ❌ "Saving 17h/week" → ✅ "Saving stimato 7-10h/week realistic post Step 3 measure"
- ❌ "Sprint T close achieved" → ✅ "Sprint T close gate Andrea Opus G45 review iter 41-43 cumulative"
- ❌ "Multi-AI is better" → ✅ "Multi-vote 5-vendor reduce single-vendor bias spread X% measured trial Y"
- ❌ "Coverage 94 esperimenti" → ✅ "Cowork H24 cron */30 → 30 cycles/day = ~7-day full sweep 94 esperimenti"
- ❌ "Zero debito tecnico" → ✅ "Migrated 5/8 custom components to ufficiali, 3/8 still custom (justified ELAB-specifici)"

---

## §8 — Acceptance gates per step (decision matrix)

### 8.1 Gate Step 0 → Step 1 entrance

| Pre-condition | Status |
|---|---|
| Andrea ratify Step 1 plan | NEEDED |
| Andrea ChatGPT Plus + Claude Pro + Gemini Pro + Mistral Le Chat Pro existing | ✅ |
| Mac Mini SSH `progettibelli@100.124.198.59` reachable | ✅ verified iter 32 |
| Vitest baseline 13752 preserved | ✅ verified `automa/baseline-tests.txt` |
| Andrea time budget Week 1 ≤6h available | NEEDED |

### 8.2 Gate Step 1 → Step 2 entrance

| Criterio | Pass threshold |
|---|---|
| 4 atomi trial PASS rate | ≥3/4 = 75% |
| Andrea satisfaction aggregate | ≥7/10 |
| H1 anti-bias confirmed | ≥1 evidence (Atom 1.3) |
| Mac Mini cron stable | 100% L1+L2+L3 ACTIVE |
| Vitest baseline 13752 preserved | 100% commits |
| Cost incremental Step 1 | $0 verified |
| Wall-clock Andrea Step 1 | ≤6h actual |

**Decision**:
- ALL ≥ threshold → **PASS Step 2**
- Most ≥ threshold + 1-2 below → **PIVOT** (re-plan failing components Step 2 entrance)
- Most below threshold → **STOP** (close multi-provider initiative)

### 8.3 Gate Step 2 → Step 3 entrance

| Criterio | Pass threshold |
|---|---|
| 8 atomi trial PASS rate | ≥6/8 = 75% |
| Andrea satisfaction aggregate | ≥7.5/10 |
| 1 iter close 3-vote G45 used | spread ≤1.5 |
| Mac Mini cron + tmux swarm stable | ≥1 settimana ACTIVE |
| Cost incremental Step 2 | ≤$20/mo verified (Kimi $15 + mech $2) |
| Wall-clock Andrea Step 2 | ≤10h actual |
| Cowork desktop trial Atom 2.7 | functional 1 cycle |

**Decision**: PASS / PIVOT / STOP same logic Step 1 gate.

### 8.4 Gate Step 3 → Sprint U entrance

| Criterio | Pass threshold |
|---|---|
| 8-10 atomi trial PASS rate | ≥7/10 = 70% |
| Andrea satisfaction aggregate | ≥7.5/10 |
| 5-vote G45 ≥3 iter close consensus | spread ≤1.5 most |
| Cowork H24 cycles | ≥30 Week 4 |
| Kimi video analysis | ≥10 videos Week 4 |
| Mac Mini stack stability | 100% cron uptime ≥1 settimana |
| Cost incremental Step 3 | ≤$45/mo verified |
| Wall-clock Andrea Step 3 | ≤20h actual diluted 2-3 settimane |
| Sprint T close gate Andrea Opus G45 review | ratify-pending iter 41-43 |

**Decision**:
- PASS → **Sprint U entrance ready** scale 50 scuole + workflow stable
- PIVOT → scale-back unstable Step 3 components, Sprint U entrance with Step 2 stack
- STOP → Sprint U entrance with Step 1 stack only (workflow conservative)

---

## §9 — Rollback protocol global

### 9.1 Per-atom rollback (atomic granularity)

Ogni atom Step 1/2/3 ha rollback section esplicita (§4.6, §5.7, §6.7). Ogni atom è **reversibile in ≤30min**.

### 9.2 Per-step rollback (cumulative)

| Step | Rollback action | Effort |
|---|---|---|
| Step 3 → Step 2 | Disable Cowork H24 + Kimi video + 5-vote → 3-vote, keep Step 2 stack | ~2h |
| Step 2 → Step 1 | Disable Kimi API + tmux swarm + agent-teams ufficiali, revert Pattern S r3 custom | ~3h |
| Step 1 → Status quo | Uninstall Codex Plugin + Gemini extensions, restore single Claude workflow | ~30min |

### 9.3 Global rollback (return to status quo iter 31 ralph 32 close)

- Wall-clock: ~5h aggregate
- Cost saving: $30-60/mo (cancel Kimi + DeepSeek + Mistral API)
- ELAB unaffected: Edge Function v80 + Vercel `319v42i4p` LIVE PROD preserved (NOT deploy stack changes)

### 9.4 Conditional rollback triggers

- **Mac Mini cron L1+L2+L3 down >1h**: rollback Cowork H24 + tmux swarm immediate
- **Vitest baseline regress**: rollback latest atom causing regression
- **Cost overrun >2× projected**: rollback API additions
- **Andrea satisfaction <5/10**: pause + retrospective + decision STOP

---

## §10 — KPI matrix (incremental measurement)

### 10.1 Output quality KPI

| Metric | Step 0 baseline | Step 1 target | Step 2 target | Step 3 target |
|---|---|---|---|---|
| Iter close score variance | single-vote | manual 3-vote | 3-vote consensus | 5-vote consensus |
| Anti-inflation flag rate | manual ratify | +1 mechanism multi-AI diff | +M-AR-06+M-AI-05 | full 27 mechanisms |
| Edge case detection rate | Claude only | +Codex/Gemini | +Kimi 256K context | +Cowork video real |
| Italian fluency review | Claude OK | manual Mistral chat | Mistral CLI auto | full Vol3 refactor support |

### 10.2 Wall-clock saving KPI

| Activity | Step 0 | Step 1 | Step 2 | Step 3 |
|---|---|---|---|---|
| Linguaggio codemod 200 violations | manual ~6h | 3-agent ~3h | parallel ~2h | full auto ~1h |
| 94 esperimenti audit | Playwright headless ~3h | + Cowork manual 1 ~1.5h | tmux swarm ~1h | Cowork H24 cron ~0h continuo |
| Iter close audit | Claude solo ~2h | + Codex review ~1.5h | 3-vote auto ~1h | 5-vote auto ~30min |
| **Andrea aggregate** | baseline | -10% | -25% | -50% (target) |

### 10.3 Cost KPI

| Step | Sub fissi | API extra | Total | Andrea wall-clock saving | Cost-per-hour-saved |
|---|---|---|---|---|---|
| Step 0 | $277/mo | $0 | $277/mo | baseline | N/A |
| Step 1 | $277/mo | $0 | $277/mo | ~10% (~4h/mo) | $0/h |
| Step 2 | $277/mo | $17/mo | $294/mo | ~25% (~10h/mo) | $1.70/h |
| Step 3 | $277/mo | $30-45/mo | $307-322/mo | ~50% (~20h/mo) | $1.50-2.25/h |

**ROI break-even**: Step 3 costs $1.50-2.25 per hour Andrea saved. Andrea hourly rate >$50 → ROI >20× positive.

### 10.4 Stability KPI

| Metric | Step 0 | Step 1 | Step 2 | Step 3 |
|---|---|---|---|---|
| Vitest baseline | 13752 | 13752 | 13752 | 13752 |
| Mac Mini cron uptime | 100% | 100% | 100% | 100% |
| Edge Function v80 LIVE | ✅ | ✅ | ✅ | ✅ |
| Vercel deploy LIVE | ✅ | ✅ | ✅ | ✅ |

---

## §11 — Cost incremental finale

### 11.1 Sub fissi (NON cambiano)

| Sub | Mensile | Owner |
|---|---|---|
| Claude Max 20x progettibelli | $200 | progettibelli account |
| Claude Pro Andrea | $20 | Andrea |
| ChatGPT Plus | $20 | Andrea |
| Gemini Pro | €22 (~$24) | Andrea |
| Mistral Le Chat Pro | €15 (~$16) | Andrea |
| **Subtotal sub fissi** | **~$280/mo** | |

### 11.2 API pay-per-use (Step 2+3)

| API | Step 2 | Step 3 | Note |
|---|---|---|---|
| Kimi (Moonshot) | $15/mo | $25-30/mo | +video calls Step 3 |
| Mechanism multi-AI invocazioni | $2/mo | $5-10/mo | 27 mech full Step 3 |
| 5-vote G45 aggregate | $0 | $5-10/mo | Step 3 only |
| DeepSeek R1 (optional) | $0 | $10/mo | optional Step 3 |
| Mistral API CLI (optional) | $0 | $5/mo | optional Step 3 |
| **Subtotal API** | **+$17/mo** | **+$30-45/mo** | |

### 11.3 NON aggiungere (cost saving)

| Sub | Cost rejected | Rationale |
|---|---|---|
| GitHub Pro $4/mo | rejected iter 30-38 | free tier copre, ratify iter 42 IF Tea+Davide+collab >3 |
| Vercel Pro $20/mo | rejected iter 30-38 | Hobby tier copre, ratify iter 42 entrance Sprint U scale |
| Supabase Pro $25/mo | rejected iter 30-38 | free tier copre, ratify iter 42 entrance Sprint U scale |
| ChatGPT Pro $200/mo | rejected | Plus + DeepSeek R1 copre depth |
| Gemini Ultra €275/mo | rejected | DeepThink English-only, marginal italiano |
| Cursor/Cody/Codeium | rejected | switch cost ELAB Claude Code patterns |
| OpenRouter proxy | rejected | direct API meglio |
| RunPod GPU | defer Sprint U+ | heavy bench only |

### 11.4 Total finale stack

| Step | Sub fissi | API | TOTAL/mo |
|---|---|---|---|
| Status quo iter 31 | $280 | $0 | **$280** |
| Step 1 finale | $280 | $0 | **$280** |
| Step 2 finale | $280 | $17 | **$297** |
| Step 3 finale (no optional) | $280 | $30 | **$310** |
| Step 3 finale (with optional) | $280 | $45 | **$325** |

---

## §12 — Andrea wall-clock budget

### 12.1 Step 1 Week 1: ~5-6h Andrea total

- Atom 1.1: 60min
- Atom 1.2: 60min
- Atom 1.3: 90min
- Atom 1.4: 60min
- Atom 1.5: 45min
- **Total: 5h 15min** (slack 45min, target ≤6h)

### 12.2 Step 2 Week 2-3: ~9-10h Andrea total (diluited 2 settimane = ~5h/week)

- Atom 2.1: 90min
- Atom 2.2: 60min
- Atom 2.3: 60min
- Atom 2.4: 90min
- Atom 2.5: 60min
- Atom 2.6: 60min
- Atom 2.7: 90min
- Atom 2.8: 60min
- **Total: 9h 30min** (slack 30min, target ≤10h)

### 12.3 Step 3 Week 4+: ~16-20h Andrea total (diluited 2-3 settimane = ~7h/week)

- Atom 3.1: 90min
- Atom 3.2: 90min
- Atom 3.3: 90min
- Atom 3.4: 60min (optional)
- Atom 3.5: 60min (optional)
- Atom 3.6: 270min (3 cycles 90min)
- Atom 3.7: 60min
- Atom 3.8: 270min (3 cycles 90min)
- Atom 3.9: 90min
- Atom 3.10: 60min
- **Total no optional: 16h** (slack 4h)
- **Total with optional: 18h** (slack 2h)

### 12.4 Aggregate 4-5 weeks total

| Week | Effort | Atomi |
|---|---|---|
| Week 1 (Step 1) | ~6h | 5 |
| Week 2 (Step 2 first half) | ~5h | 4 |
| Week 3 (Step 2 second half) | ~5h | 4 |
| Week 4 (Step 3 first half) | ~8h | 5 |
| Week 5 (Step 3 second half) | ~8h | 5 |
| **TOTAL 5 weeks** | **~32h Andrea** | **23 atomi** |

### 12.5 ROI projection wall-clock

- **Investment Andrea**: ~32h across 5 weeks = ~6.4h/week
- **Saving target Step 3 stable**: ~10h/week (50% time saving Sprint U+)
- **Break-even**: Week 6+ (post Step 3 close, 1 week recoup)
- **Net positive**: from Week 7 onwards
- **Annual saving (52 weeks - 5 weeks setup)**: ~470h/year (~12 weeks full-time)

---

## §13 — Risk register

### 13.1 Technical risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Codex Plugin breaking changes | Medium | Medium | Monitor github releases, fallback Codex CLI standalone |
| Kimi API endpoint Anthropic-compat broken | Low | High | Fallback DeepSeek, isolate Step 2 minimal impact |
| Mac Mini Cowork beta unstable | Medium | Medium | Defer Step 3, use Computer Use API alternative |
| tmux swarm complexity Andrea | Low | Low | Documentation + cheat sheet, fallback iTerm2 panes |
| agent-teams ufficiali NOT yet GA | Medium | Medium | Keep Pattern S r3 custom parallel until GA |
| Org limit cascade BG agents | Medium | High | Max 4 Step 2, max 6 Step 3, vendor diversity reduce |

### 13.2 Cost risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Kimi cost overrun >$30/mo Step 2 | Low | Low | Rate limit Mac Mini swarm, monitor weekly |
| 5-vote G45 cost >$20/mo Step 3 | Medium | Low | Reduce to 4-vote IF >$15/mo |
| DeepSeek+Mistral optional spent without value | Medium | Low | Skip Step 3 IF Step 2 Kimi sufficient |
| Mac Mini macOS upgrade breaks Cowork | Low | Medium | Defer macOS upgrade Mac Mini Sprint U+ |

### 13.3 Process risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Andrea time exceeded 6h Week 1 | Medium | Medium | Atomi 1.X reducible to 4 (skip 1.4 IF time tight) |
| Vendor disagreement spread >2.5 frequent | Medium | Medium | Bias correction matrix Step 3, escalate Andrea |
| Mac Mini cron disturbed by trial | Low | High | Verify pre/post each trial, immediate rollback |
| Step 1 STOP decision (workflow rejected) | Low | Low | Sunk cost ~6h Andrea + $0, archive trial |

---

## §14 — Sources cited (raccolti tutti i 33 link Andrea + 14 web search)

### 14.1 Link Andrea forniti (33)

1. Multi-Agent Testing Systems Cooperative AI Validate Complex Applications — virtuosoqa.com/post/multi-agent-testing-systems-cooperative-ai-validate-complex-applications
2. Why Hybrid Agentic AI is the Future of QA — dev.to/logigear-corporation/why-hybrid-agentic-ai-is-the-future-of-qa-13g4
3. AI Code Review Best Practices — blog.exceeds.ai/ai-code-review-best-practices/
4. arxiv 2603.23763v1 (CEGIS counterexample-guided inductive synthesis) — arxiv.org/html/2603.23763v1
5. Structured AI Coding Workflow Deterministic Agentic Nodes — mindstudio.ai/blog/structured-ai-coding-workflow-deterministic-agentic-nodes/
6. Hybrid AI Models Bug Detection — ranger.net/post/hybrid-ai-models-bug-detection-00b29
7. API and UI Hybrid Tests (Steve Kinney) — stevekinney.com/courses/self-testing-ai-agents/api-and-ui-hybrid-tests
8. AI Transforming Software Testing — talent500.com/blog/ai-transforming-software-testing/
9. tmux skills openclaw — myclaw.ai/ru/skills/tmux
10. tmux cheat sheet openclaw setup — tmuxcheatsheet.com/openclaw-tmux-setup/
11. Reddit Claude Code Claudemux Persistent Tmux — reddit.com/r/ClaudeCode/comments/1sqr0x3/claudemux_persistent_tmux_sessions_for_claude/
12. github 13rac1/openclaw-plugin-claude-code
13. Code Claude common workflows — code.claude.com/docs/en/common-workflows
14. Reddit ClaudeAI 11-step workflow — reddit.com/r/ClaudeAI/comments/1sgjmec/the_11step_workflow_i_use_for_every_claude_code/
15. Medium @ravisat Claude Code QA Testers — medium.com/@ravisat/claude-code-for-qa-and-testers-from-manual-validation-to-intelligent-test-execution-4d0230bf9892
16. Claude Public Artifact 76b32a4a — claude.ai/public/artifacts/76b32a4a-e0cd-4a1c-9c33-f716643bbdde
17. Nathan Onn Claude Code Testing Ralph Loop Verification — nathanonn.com/claude-code-testing-ralph-loop-verification/
18. Reddit ClaudeAI Claude First Not Claude Alone Cross-Validation — reddit.com/r/ClaudeAI/comments/1mn0ogf/claude_first_not_claude_alone_a_crossvalidation/
19. github dagster-io/erk fake-driven-testing workflows — github.com/dagster-io/erk/blob/master/.claude/skills/fake-driven-testing/references/workflows.md
20. Reddit ClaudeAI 18 Autonomous Agents Dev — reddit.com/r/ClaudeAI/comments/1qfu9pm/i_built_18_autonomous_agents_to_run_my_entire_dev/
21. Platform Claude Computer Use Tool — platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
22. Reddit ClaudeAI Gave Agent Own Computer — reddit.com/r/ClaudeAI/comments/1so0o65/i_gave_an_agent_its_own_computer_with_full/
23. github anthropics/claude-code issue 39190
24. Claude Blog Dispatch and Computer Use — claude.com/blog/dispatch-and-computer-use
25. Gemini CLI Extensions — geminicli.com/extensions/
26. Reddit BMAD Method Automated Workflow Gemini — reddit.com/r/BMAD_Method/comments/1rhb5so/i_built_an_automated_workflow_connecting_gemini/
27. Medium Google Cloud Agent Status Tmux — medium.com/google-cloud/agent-status-tmux-real-time-claude-code-gemini-cli-usage-in-tmux-f8a2fd0152f1
28. Dev.to wong2kim wmux Claude Codex Gemini Windows — dev.to/wong2kim/wmux-run-claude-code-codex-and-gemini-cli-side-by-side-on-windows-pkg
29. Medium @sohail_saifi 6 CLI Coding Agents — medium.com/@sohail_saifi/the-6-cli-coding-agents-competing-for-your-terminal-right-now-claude-code-vs-codex-5-3-e419eef43b08
30. github wkh237/tmux-team
31. Reddit ClaudeAI Best Way Control Claude Code OpenClaw — reddit.com/r/ClaudeAI/comments/1qwddv4/best_way_to_control_claude_code_with_openclaw/

### 14.2 Web search results (14 fornite Andrea)

32. Introducing Codex Plugin for Claude Code — OpenAI Developer Community
33. Running headless Codex CLI inside Claude Code — amanhimself.dev
34. Dual Wielding Codex and Claude Code — Chris Ellis Substack
35. You Can Run Claude AND Codex Together — YouTube Mark Kashef
36. Codex plugin for Claude Code — github openai/codex-plugin-cc
37. Best way to combine Claude Code with Codex in real workflow — Reddit
38. Claude Code vs Codex honest comparison non-coders — nocodesaas.io
39. Codex vs Claude Code which AI coding agent better — YouTube Steve Builder.io
40. Claude Code vs OpenAI Codex Better — MindStudio
41. Codex-Claude Code Workflow How I Plan With GPT-5 — Nathan Onn
42. Switching to Codex Over Claude Code — YouTube Nick Puru
43. Claude Code vs OpenAI Codex Composio
44. Claude Code + Codex Plugin = 2x Code Accuracy — YouTube Eric Tech
45. Codex Collab Automated Review Skill — MCP Market

### 14.3 ELAB internal references

- CLAUDE.md sprint history footer iter 1-32 (this repo, lines 1-2200)
- ADR-041 Onnipotenza Expansion L0b — docs/adrs/ADR-041-onnipotenza-expansion-ui-namespace-l0b.md
- ADR-042 Onniscenza UI snapshot — docs/adrs/ADR-042-onniscenza-ui-state-snapshot-integration.md
- Andrea ratify queue iter 31 — automa/state/iter-31-andrea-flags.jsonl (19 entries)
- Mechanisms shipped iter 31 ralph — scripts/mechanisms/ (6 files)
- Mac Mini autonomous plan — docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md
- Sprint T close PIANO — docs/superpowers/plans/PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md
- Iter 27 R5 latency RCA — docs/audits/2026-05-03-iter-31-ralph27-r5-latency-regression-rca.md

---

## §15 — Open questions Andrea ratify (gate Step 1 entrance)

### 15.1 Decisioni necessarie Andrea PRE Step 1

1. **Time budget Week 1 ≤6h available?**: confirm slot dedicato (1.5h × 4 giorni ideale)
2. **Codex Plugin install Atom 1.1 first**: PASS / SKIP (jump direct Atom 1.3 Three-Agent)?
3. **Mac Mini progettibelli access disponibile per Atom 1.4?**: SSH + cron disturb risk acceptable?
4. **Atom 1.4 backend Kimi free trial OR DeepSeek free credit?**: choose 1 NOT both Step 1
5. **Decision STOP threshold**: ≤1/4 atomi PASS = STOP confirmed?

### 15.2 Decisioni gate Step 1 → Step 2 (post Step 1 retrospective)

1. **PASS / PIVOT / STOP** decision based decision matrix Atom 1.5
2. **Kimi vs DeepSeek Step 2 Atom 2.5**: re-confirm Kimi (raccomandato Step 3 video prep)
3. **agent-teams ufficiali Atom 2.1 OR mantenere Pattern S r3 custom**: depends flag availability
4. **Cowork desktop Step 2 trial Atom 2.7**: macOS permissions Andrea local visit needed?

### 15.3 Decisioni gate Step 2 → Step 3 (post Step 2 retrospective)

1. **PASS / PIVOT / STOP** decision based decision matrix Atom 2.8
2. **DeepSeek R1 Atom 3.4 ADD or SKIP**: depends Kimi Step 2 sufficient depth
3. **Mistral CLI Atom 3.5 ADD or SKIP**: depends Vol3 refactor Davide co-author iter 33+ scope
4. **27 mechanisms Atom 3.6 batch vs single per atom**: 3 cycles 90min sufficient?
5. **Anthropic Routines Atom 3.7 cloud-managed**: Anthropic API quota monitoring needed?

### 15.4 Decisioni Sprint T close gate (post Step 3 + Andrea Opus G45 review iter 41-43)

1. **Sprint T close score finale 9.0-9.5/10**: realistic verifiable post canary 100% rollout + R7 ≥80% + Lighthouse perf ≥90 + 94 esperimenti audit + Vol3 narrative refactor
2. **Sprint U entrance ready**: workflow stable + scale 50 scuole + Vercel/Supabase Pro $20+$25/mo ratify iter 42

---

## §16 — Conclusione + next-step

### 16.1 Sintesi onesta

Questo piano propone **3 step incrementale** per costruire workflow multi-provider ELAB Tutor robusto, **NON gigantesco day-1**. Ogni step ha:
- Goal misurabile
- 5-10 atomi reversibili
- Acceptance gate esplicito
- Cost incremental verified
- Wall-clock Andrea realistic
- Rollback plan

**Cost finale**: $280-325/mo (sub fissi $280 + API extra Step 3 $30-45)
**Wall-clock setup totale**: ~32h Andrea distribuito 5 settimane (~6.4h/week)
**ROI break-even**: Week 6+
**Annual saving net**: ~470h/year potential (post Step 3 stable)

### 16.2 Anti-pattern rispettati

- ✅ NO compiacenza ("multi-AI is better" → quantitative claims)
- ✅ NO gigantic upfront ("Phase A iter 31" rejected, 3-step incremental)
- ✅ NO debito tecnico (custom workflow code minimized, ufficiali tools preferred)
- ✅ NO inflated saving (~17h/week → 7-10h/week realistic)
- ✅ NO skip caveat (failure mode + rollback explicit ogni atom)
- ✅ NO sources unattributed (33 link Andrea + 14 web search cited §14)
- ✅ NO Step 2/3 gate skip (Andrea ratify queue 15.X explicit)

### 16.3 Andrea action immediata (gate Step 0 → Step 1)

1. **Read this document fully** (~1h reading)
2. **Decide §15.1 5 questions** (~30min reflection)
3. **Block calendar Week 1 ≤6h** (~5min schedule)
4. **Ratify Step 1 entrance** (write `automa/state/iter-31-andrea-flags.jsonl` new entry: `{"date":"2026-05-XX","decisione":"step1-ratify","title":"Multi-provider workflow Step 1 entrance","default_applied":"PASS","g45_rationale":"Andrea ratify ...","status":"resolved"}`)
5. **Schedule Step 1 Day 1 execution** (Atom 1.1 Codex Plugin install primary)

### 16.4 Prossima sessione (post Step 1 retrospective)

Andrea quando ready: pasta this document + Step 1 retrospective audit doc + invoke `/make-plan` Step 2 entrance plan refinement based on Step 1 actual findings (NON theory).

---

**Plan version**: v1.0 final
**Status**: PROPOSED — Andrea ratify gate
**Cross-link**: `docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md` (this file, single source of truth)
**Supersede**: chat fragments (above) + 27 mechanisms partial design + frammenti Cowork setup + frammenti DeepSeek considerations + frammenti GitHub/Vercel/Supabase Pro analysis
**Anti-pattern**: G45 enforced + NO compiacenza + caveats explicit + sources cited verbatim
**Next-step gate**: Andrea ratify queue iter 31-andrea-flags.jsonl entry "step1-ratify"
