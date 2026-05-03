# Playbook PROSSIMA SESSIONE — Context Briefing + Phase 0 Multi-Provider Setup

**Author**: Claude (sonnet 4.7 1M, NO caveman, output style explanatory + learning)
**Date**: 2026-05-03 evening
**Sprint**: T close → Sprint U entrance
**Status**: PROPOSED — Andrea ratify gate prossima sessione entrance
**Plan version**: v1.0 (single source of truth execution playbook)
**Mandate Andrea verbatim ultimo turno**: "fa si che all'inizio si imposti lo step del workflow multi provider per testarlo. dai indicazioni per tutto, ogni parte dell'insieme deve conoscere il contesto. non andare veloce per usare pochi token, concentrati al massimo su tutto sia nella progettazione che nell'esecuzione del piano. Non essere compiacente. Tutto deve essere analizza testato validato, fare cov e audit."

**Cross-link OBBLIGATORIO leggere PRIMA**:
1. `docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md` — architettura workflow 3-step (1669 LOC)
2. `docs/superpowers/plans/2026-05-03-STEP-1-SESSIONE-ELAB-FIXES-MULTI-PROVIDER.md` — 17 atomi ELAB fixes (827 LOC)
3. `CLAUDE.md` sprint history footer iter 1-32 close (architecture + state)
4. `automa/state/iter-31-andrea-flags.jsonl` — 20 entries Andrea ratify queue
5. `automa/state/score-history.jsonl` — 6 iter close scores history

---

## §0 — Mandate Andrea verbatim espanso (decomposition completo)

### 0.1 Mandate ultimi 2 turni

Turno N-1 (Step 1 fixes mandate): "rendere unlim non ebete + risposte più lunghe + non pappette pronte + andare oltre ELAB con paletti + ricordo azioni precedenti + velocità più elevata orchestra modelli + voxtral wake word + lavagna libera senza circuito + homepage lavagna only lavagna + cronologia sessioni + modalità percorso non funziona + 2 modalità passo passo (older preferred + window resize) + esci lavagna scritte spariscono + homepage mascotte NO emoticon + crediti Teodora De Venere + modalità percorso adapt context + percorso = vecchia libero + 2 window sovrapposte + glossario only homepage + PRINCIPIO ZERO + MORFISMO + sistematizza + CoV + audit + analyze + test + validate + NO compiacenza"

Turno N (questo, Phase 0 mandate): "all'inizio imposta step workflow multi provider per testarlo + ogni parte conosce contesto + slow non token-saving + max concentrazione progettazione + esecuzione + NO compiacenza + CoV + audit + analyze + test + validate"

### 0.2 Decomposition mandate combinato

**Phase 0 mandatory entrance**: setup + trial multi-provider workflow Step 1 PRIMA atomi ELAB fixes
**Phase 1+ ELAB fixes**: 17 atomi user mandate Step 1 plan
**Cross-cutting mandatory**: context briefing per ogni componente + CoV per atom + audit doc per atom + validation gate per atom + NO compiacenza + slow + thorough

### 0.3 Anti-pattern enforcement (questo playbook + esecuzione)

| Anti-pattern | Manifestazione tipica | Contromisura inline |
|---|---|---|
| Compiacenza score | "Phase 0 PASS" senza KPI quantitative | KPI matrix Phase 0 §1.6 esplicita |
| Token-saving fast skim | "skip Phase 0 trial" → defer Step 2 | Phase 0 OBBLIGATORIO Andrea ratify per saltare |
| Subagent context loss | spawn agent con prompt brief generic | Context Briefing Template §A obbligatorio ogni dispatch |
| CoV skip atomic | "vitest 13752 PASS" assert senza re-run | CoV protocol §B 5 fasi per atom mandatory |
| Audit doc absent | commit senza markdown audit | Audit Template §C mandatory ogni atom |
| Validation skip | "smoke prod fine" senza Playwright/Cowork | Validation Gate §D pre-merge mandatory |
| NO compiacenza language | "Sprint T close 9.5 achieved" | Score G45 cap mechanical mandatory + Opus indipendente review iter 41-43 |
| Pappette generiche | "fix UNLIM" → solo edit 1 file no cov | Atom decomposition + 5-fase protocol per atom |

---

## §1 — Phase 0 Multi-Provider Workflow Setup (~90min Andrea wall-clock, MANDATORY entrance)

### 1.1 Phase 0 goal quantitative

**Falsificare ipotesi H1+H2+H3+H4** multi-provider plan §3.1.1:
- H1: anti-bias multi-vote migliora score G45 vs single-vote
- H2: parallelizzazione handoff multi-CLI riduce wall-clock vs Claude solo
- H3: ufficiali tools sostituiscono custom debito tecnico
- H4: cheap backend swap (Kimi/DeepSeek API) riduce cost critical-path

**Output Phase 0**: 1 atom ELAB executed via Three-Agent Pipeline (Claude+Codex+Gemini DeepThink) + multi-vote G45 manuale 3-vote + audit doc decision matrix → decide PASS/PIVOT/STOP per Phase 1+ entrance.

### 1.2 Phase 0 pre-condition checklist (Andrea verifica PRE-sessione)

| Check | Comando verifica | Threshold |
|---|---|---|
| ChatGPT Plus sub Andrea attivo | browser chat.openai.com login OK | YES required |
| Claude Pro Andrea attivo | browser claude.ai login OK | YES required |
| Gemini Pro Andrea attivo | browser gemini.google login OK | YES required |
| Mac Mini SSH `progettibelli@100.124.198.59` reachable | `ssh progettibelli@100.124.198.59 date` | exit 0 + date echoed |
| Vitest baseline | `cat automa/baseline-tests.txt` | =13752 |
| Edge Function v80 LIVE | `curl -I https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat` | HTTP 204 |
| Vercel prod LIVE | `curl -I https://www.elabtutor.school` | HTTP 200 |
| Andrea time block | calendario Andrea | ≥6h slot |

### 1.3 Phase 0 atomi (5 sub-step, ~90min totali)

#### Phase 0.1 — Codex Plugin install (15min Andrea + agente esegue)

**Goal**: `/codex` integrato Claude Code MacBook Andrea (sessione corrente NON ancora installato).

**Steps Andrea esegue inline Claude Code session**:
```
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex-plugin-cc@codex-plugin-cc
```

**Verifica**: in chat Claude Code session, type `/codex --help` → expected output codex-plugin-cc help text.

**Output documentation**: `docs/audits/2026-05-XX-phase0-codex-plugin-install.md`:
- Plugin install timestamp
- OAuth ChatGPT Plus quota verified
- `/codex --help` output snippet
- Cost incremental: $0 (sub existing)
- Rollback: `/plugin remove codex-plugin-cc` (~30s)

**Failure mode**:
- Plugin install OAuth fails → fallback Codex CLI standalone install (`npm i -g @openai/codex`)
- Codex CLI also fails → SKIP Phase 0.1, proceed Phase 0.2 con Claude solo (degraded mode)

**Acceptance gate Phase 0.1**:
- ✅ `/codex` command available in Claude Code session
- ✅ Audit doc shipped
- ❌ Block per Phase 0.2 IF Codex CLI fallback ALSO fails (escalate Andrea decision)

---

#### Phase 0.2 — Gemini CLI extensions (15min Andrea + agente)

**Goal**: `gemini` CLI installed MacBook Andrea + extensions DeepThink available.

**Steps Andrea esegue terminale**:
```bash
# Install Gemini CLI (se non presente)
npm install -g @google/gemini-cli

# First run OAuth Google account Andrea Pro
gemini

# Install extensions
gemini extension install conductor
gemini extension install code-review
gemini extension install security
```

**Verifica**: `gemini --version` + `gemini extension list` → conductor + code-review + security presenti.

**Output documentation**: `docs/audits/2026-05-XX-phase0-gemini-cli-install.md`:
- Gemini CLI version installed
- OAuth Google Pro quota verified
- Extensions installed list
- Cost incremental: $0 (sub existing)
- Rollback: `gemini extension uninstall conductor + code-review + security` + `npm uninstall -g @google/gemini-cli`

**Acceptance gate Phase 0.2**:
- ✅ `gemini` command available
- ✅ 3 extensions installed
- ✅ Audit doc shipped

---

#### Phase 0.3 — AGENTS.md setup root project (10min)

**Goal**: shared state file `AGENTS.md` project root per Three-Agent Pipeline handoff.

NOTA: AGENTS.md scaffold già shippato iter 31 ralph 33 commit `e6aa5e2` (60 LOC). Verifica presente + estendere per Phase 0 trial.

**Steps**:
1. `cat /Users/andreamarro/VOLUME\ 3/PRODOTTO/elab-builder/AGENTS.md` verify scaffold presente
2. Estendere con sezione "Phase 0 Trial Active":
```markdown
## Phase 0 Trial Active — Multi-Provider Workflow

**Trial atom**: Atom A1 system-prompt cap conditional (Step 1 plan §4.3 ATOM A1)
**Lead orchestrator**: Claude (this session)
**Implementer**: Codex (via /codex plugin)
**Reviewer**: Gemini DeepThink (via gemini chat)
**Status**: Phase 0.3 entrance, plan written, dispatch Codex pending
**Last update**: 2026-05-XX HH:MMZ
**Blocking**: nothing
```

**Acceptance gate Phase 0.3**:
- ✅ AGENTS.md presente + extended con Phase 0 Trial section

---

#### Phase 0.4 — Three-Agent Pipeline 1 atom trial (45min)

**Goal**: eseguire Atom A1 (system-prompt cap conditional) via 3-agent pipeline + audit handoff smoothness.

**Steps**:

**Step 1 (Claude inline orchestrator) — Plan**: scrivi spec markdown `docs/audits/2026-05-XX-phase0-trial-A1-spec.md`:
- Atom A1 file modifiche:
  - `supabase/functions/_shared/system-prompt.ts:283` "MAX 60 parole" → "MAX {wordCap} parole"
  - `supabase/functions/_shared/onniscenza-classifier.ts` extend 6→8 categories
- wordCap lookup map per category (chit_chat 30, citation 80, deep 180, safety 100, plurale 80, off_elab_corr 50, previous_action 100, default 100)
- CoV: vitest 13752 + onniscenza-classifier 30/30 PASS

**Step 2 (Codex via /codex) — Implement**: dispatch
```
/codex implement spec at docs/audits/2026-05-XX-phase0-trial-A1-spec.md
```
- Codex genera diff edit 2 file
- Andrea reviews diff prima accept
- AGENTS.md update: status = "Codex impl complete, Gemini review pending"

**Step 3 (Gemini DeepThink) — Review**: dispatch
```bash
cd /Users/andreamarro/VOLUME\ 3/PRODOTTO/elab-builder
git diff HEAD --stat | head -10
gemini chat "Review git diff HEAD..HEAD~1 in /Users/andreamarro/VOLUME\ 3/PRODOTTO/elab-builder. Focus: PRINCIPIO ZERO compliance (Ragazzi plurale + kit ELAB mention + Vol/cap citation), Morfismo Sense 1 runtime per-category cap, edge cases missed, type safety. Output structured findings severity HIGH/MEDIUM/LOW."
```
- Gemini output structured findings
- AGENTS.md update: status = "Gemini review complete, Claude finalizing fixes"

**Step 4 (Claude inline) — Fix**: address Gemini findings, re-edit files se necessario, finale commit batch

**Step 5 (Deterministic gate) — CoV**:
```bash
cd /Users/andreamarro/VOLUME\ 3/PRODOTTO/elab-builder
npx vitest run --reporter=basic 2>&1 | tail -5  # Expect: 13752+ pass, 0 fail
node scripts/g45/multi-vote-aggregator-manual.mjs --in docs/audits/g45-multi-vote-iter-32-test/  # 4-vote consensus
```

**Step 6 (Audit doc) — Document**: `docs/audits/2026-05-XX-phase0-trial-A1-execution.md`:
- 5-step timestamps
- Codex output quality % subjective Andrea
- Gemini findings count + severity breakdown
- Wall-clock total Phase 0.4 vs estimated 45min
- AGENTS.md trace (5 status updates)
- CoV result vitest count + multi-vote consensus
- Decision: PASS/PIVOT per Phase 0.5

**Acceptance gate Phase 0.4**:
- ✅ Three-Agent Pipeline 4 phases completate (Plan + Impl + Review + Fix)
- ✅ AGENTS.md aggiornato 4+ volte (4 status transitions tracked)
- ✅ CoV vitest 13752+ preserved
- ✅ Atom A1 implementation merged (con Andrea approval Step 4 fix)
- ✅ Audit doc shipped

---

#### Phase 0.5 — Phase 0 retrospective + decision Phase 1+ entrance (30min)

**Goal**: aggregare findings Phase 0.1-0.4, decidere PASS/PIVOT/STOP per Phase 1+ entrance.

**Steps**:

**Step 1**: Read 4 Phase 0 audit doc (10min)

**Step 2**: Compile decision matrix (15min):

| Criterio | Phase 0.1 Codex | Phase 0.2 Gemini | Phase 0.3 AGENTS.md | Phase 0.4 3-Agent Pipeline | **Aggregate** |
|---|---|---|---|---|---|
| H1 anti-bias confirmed (Gemini ≥1 issue Codex missed) | N/A | N/A | N/A | TBD | TBD |
| H2 wall-clock saving vs Claude solo (≥25%) | N/A | N/A | N/A | TBD | TBD |
| H3 debito ridotto (ufficiali tools functional) | TBD | TBD | TBD | TBD | TBD |
| H4 cost realistic ($0 Phase 0) | TBD | TBD | TBD | TBD | TBD |
| Andrea satisfaction 1-10 | TBD | TBD | TBD | TBD | TBD |
| Mac Mini cron L1+L2+L3 stable post-Phase-0 | N/A | N/A | N/A | TBD | TBD |

**Step 3**: Andrea decision (5min):
- **PASS Phase 1+** se aggregate satisfaction ≥7/10 + 3/4 ipotesi confirmed
- **PIVOT** se 2/4 ipotesi, identify failed component fix Phase 1+ entrance
- **STOP multi-provider** se ≤1/4 ipotesi, fallback Phase 1+ con Claude solo (atomi ELAB ancora eseguibili senza multi-provider)

**Output**: `docs/audits/2026-05-XX-phase0-RETROSPECTIVE.md` con decision PASS/PIVOT/STOP + rationale documentato

**Acceptance gate Phase 0.5 + entrance Phase 1+**:
- Decision matrix completa
- Andrea esplicito ratify "PASS"/"PIVOT"/"STOP"
- Audit doc shipped

### 1.4 Phase 0 cost matrix

| Componente | Cost incremental | Cumulative |
|---|---|---|
| Codex Plugin install (uses ChatGPT Plus quota) | $0 | $0 |
| Gemini CLI install (uses Gemini Pro quota) | $0 | $0 |
| AGENTS.md scaffold (filesystem) | $0 | $0 |
| Three-Agent Pipeline trial 1 atom (sub quota) | $0 | $0 |
| **TOTAL Phase 0** | **$0** | **$0** |

### 1.5 Phase 0 wall-clock matrix

| Sub-step | Andrea wall-clock |
|---|---|
| 0.1 Codex Plugin install | 15min |
| 0.2 Gemini CLI install | 15min |
| 0.3 AGENTS.md setup | 10min |
| 0.4 Three-Agent Pipeline trial | 45min |
| 0.5 Retrospective + decision | 30min |
| **TOTAL Phase 0** | **115min ~2h** |

### 1.6 Phase 0 KPI quantitative

- **3/4 ipotesi confirmed** = PASS Phase 1+
- **Andrea satisfaction ≥7/10**
- **Mac Mini cron stable** (L1+L2+L3 ACTIVE pre/post Phase 0)
- **Vitest baseline 13752 preserved** (Atom A1 inclusion + onniscenza-classifier extension)
- **Wall-clock ≤2h** (slack 30min se 1.5h actual)
- **Cost incremental $0**

### 1.7 Phase 0 rollback plan

- Phase 0.1 fail: `/plugin remove codex-plugin-cc` ZERO state
- Phase 0.2 fail: `gemini extension uninstall ...` + `npm uninstall -g @google/gemini-cli` ZERO state
- Phase 0.3 fail: revert AGENTS.md (remove Phase 0 Trial section) ZERO state
- Phase 0.4 fail: revert Atom A1 commit, retry inline Claude solo Phase 1+
- Phase 0.5 STOP decision: archive Phase 0 audit doc `docs/audits/multi-provider-workflow-trial-archive/`, mark "experiment complete, NOT adopted Phase 1+"

---

## §A — Context Briefing Template per Subagent (mandatory ogni dispatch)

### A.1 Why context briefing matters

User mandate explicit: "ogni parte dell'insieme deve conoscere il contesto."

Lesson iter 38 carryover: 3/4 BG agents hit org limit pre-completion-msg parzialmente perché contesto loro era insufficiente → ripeterono lookup file foundational.

Fix: ogni dispatch agent (subagent OR BG worker) inizia con **comprehensive context briefing** che include:
- ELAB Tutor architecture (Stack + DUAL MOAT + Sense 1+1.5+2 Morfismo)
- Stato attuale iter 32 close (Vercel + Edge + score + ratify queue)
- Goal atom specifico (cosa fare + perché + come misurare)
- File ownership boundary (cosa può modificare + cosa NO)
- CoV mandate (vitest baseline + build + smoke)
- Anti-pattern enforcement (G45 + NO compiacenza + NO --no-verify)
- Communication protocol (filesystem barrier + AGENTS.md update + completion msg)

### A.2 Briefing template structure

Ogni dispatch subagent USA questo template letteralmente:

```markdown
# [Agent Role] Context Briefing — Atom [ATOM-S33-XX] Phase [N]

## 1. Project context (read first, don't skip)

You are working on **ELAB Tutor**, educational electronics tutor for kids 8-14
years (Italian K-12 schools). Live: https://www.elabtutor.school
Mandate: docente è tramite + UNLIM strumento + kit fisico ELAB protagonista.

**Architecture**:
- React 19 + Vite 7 frontend (Vercel)
- Supabase Edge Functions backend (PostgreSQL + pgvector)
- Mistral La Plateforme primary LLM (EU FR GDPR-clean, voice clone Andrea LIVE)
- Cloudflare Workers AI multimodal (FLUX schnell + Pixtral Vision + Whisper STT)
- Vitest 13752 PASS baseline (preserved iter 32 close)

**DUAL MOAT 2026+**:
- Sense 1 Tecnico: morfico runtime per-classe + per-docente
- Sense 1.5 Adattabilità: docente esperto vs principiante adapt
- Sense 2 Triplet: software ↔ kit Omaric ↔ volumi cartacei coherent

**PRINCIPIO ZERO §1** (NON-NEGOTIABLE):
- "Ragazzi" plurale opener mandatory ogni risposta UNLIM
- Kit ELAB mention obbligatorio
- Vol/cap citation verbatim tra «caporali»
- Lingua italiana scuola pubblica

## 2. Current state iter 32 close (file:line evidence)

- Vercel deploy: `319v42i4p` LIVE PROD 2026-05-03 16:06:44Z
- Edge Function: `unlim-chat` v80 ACTIVE 2026-05-03 16:02:57Z
- ADR-041 + ADR-042: ACCEPTED env-gated default 0%/false safe rollback
- Score iter 31 ralph 32 close: 8.45/10 self-cap manual G45
- Score iter 33 multi-vote consensus 4-vendor bias-corrected: 8.27/10
- Vitest baseline: 13752 PASS preserved (`automa/baseline-tests.txt`)
- Andrea ratify queue: 20 entries (`automa/state/iter-31-andrea-flags.jsonl`)
- Onnipotenza expansion 6044 LOC: LIVE PROD verified 50/50 E2E PASS path B real dispatch

## 3. Atom goal (specific to your role)

[Insert atom goal verbatim from Step 1 plan §4.3 ATOM A1/A2/etc]
- Files modified: [exact paths]
- Implementation strategy: [Approccio scelto §2.X plan]
- Acceptance criteria: [§4.3 ATOM acceptance gate verbatim]
- Estimated effort: [X hours]

## 4. File ownership boundary (RIGID, do NOT cross)

You can MODIFY (write/edit):
- [exact list paths your role owns]

You can READ but NOT modify:
- [exact list paths other roles own]

You CANNOT touch (orchestrator-only):
- `CLAUDE.md` (Documenter Phase 2 only)
- `automa/baseline-tests.txt` (pre-commit hook only)
- `.git/*` (orchestrator commit only)
- `package.json` (Andrea ratify only — never auto-add deps)

## 5. CoV protocol (5-fase mandatory per atom)

Pre-CoV (before any edit):
- Run `cat automa/baseline-tests.txt` → verify 13752
- Run `npx vitest run path/to/affected-test.test.js` → verify baseline PASS
- Run `git status --short` → verify clean OR known dirty pre-existing

Implementation:
- Edit files surgical (NOT broad refactor)
- Add NEW tests for NEW behavior (TDD recommended)

Post-CoV (after every edit batch):
- Run `npx vitest run path/to/affected-test.test.js` → verify still PASS
- Run `npx vitest run` (full suite) → verify 13752+ preserved
- Run `npm run build` → verify build PASS

Audit:
- Write `docs/audits/2026-05-XX-atom-[ATOM-ID]-execution.md` with:
  - Files modified count + LOC delta
  - Tests added count + PASS verification
  - CoV results timestamps
  - Caveat onesti residui (anti-compiacenza)
  - Cross-link Step 1 plan section

Validate:
- Smoke prod (curl + Cowork desktop OR Playwright depending atom)
- Andrea review diff before commit (orchestrator gate)

## 6. Anti-pattern enforcement (G45 mandatory)

NEVER:
- ❌ Use `--no-verify` on commit/push (pre-commit + pre-push gate sacred)
- ❌ Push diretto su `main` (only `e2e-bypass-preview` branch ELAB workflow)
- ❌ Add npm dependencies without Andrea ratify
- ❌ Edit files outside your ownership (file-ownership rigid Pattern S r3)
- ❌ Claim "Atom shipped" without CoV verification + audit doc
- ❌ Inflate score subjective ("seems to work") without quantitative measure
- ❌ Skip caveat documentation (anti-compiacenza mandate)

ALWAYS:
- ✅ Read this briefing fully before any action
- ✅ Write completion msg `automa/team-state/messages/[your-role]-iter[N]-phase[M]-completed.md`
- ✅ Update AGENTS.md project root status field
- ✅ Cite file:line evidence in claim
- ✅ Caveat onesti documented in audit doc

## 7. Communication protocol

When task complete:
1. Write completion msg: `automa/team-state/messages/[role]-iter33-phase[N]-completed.md`
2. Format msg: `## Atom [ID] STATUS [PASS/FAIL/PARTIAL]\n\nFile modified: [list]\nTests added: [count]\nCoV: vitest [count] PASS\nAudit doc: [path]\nCaveat: [list onesti]`
3. Update AGENTS.md project root: status field reflects current state
4. NO direct commit (orchestrator commits batch all atomi at end)

When task blocked:
1. Write blocker msg: `automa/team-state/messages/[role]-iter33-phase[N]-BLOCKED.md`
2. Format: `## Atom [ID] BLOCKED\n\nReason: [specific]\nWhat I tried: [list]\nWhat I need: [Andrea ratify? OR other agent output? OR external?]`
3. STOP — do NOT escalate, do NOT spawn agent, do NOT bypass

When findings off-scope:
1. Write findings note in audit doc §X "Off-scope findings noted for iter 34+"
2. Do NOT pivot to fix off-scope inline (atom integrity)

## 8. Where to read more (no inline copy)

- This atom plan section: [exact link Step 1 plan §4.3 ATOM A1/A2/etc]
- Multi-provider workflow plan: docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md
- Step 1 ELAB fixes plan: docs/superpowers/plans/2026-05-03-STEP-1-SESSIONE-ELAB-FIXES-MULTI-PROVIDER.md
- CLAUDE.md sprint history footer iter 1-32: CLAUDE.md
- Andrea ratify queue: automa/state/iter-31-andrea-flags.jsonl

## 9. Confirm receipt

Reply YES BRIEFING ACKNOWLEDGED before executing first action. If any section
unclear OR conflict with prior knowledge, ASK orchestrator clarification BEFORE
acting. Do NOT assume.
```

### A.3 Briefing checklist orchestrator pre-dispatch

Orchestrator (Claude inline) prima di spawnare ogni subagent:

- [ ] Read this Playbook §A briefing template
- [ ] Customize template per atom-specific (sections 3+4+5)
- [ ] Verify acceptance gate quantitative + measurable (NOT vague "looks good")
- [ ] Verify file ownership boundary clear (no overlap altri agenti)
- [ ] Estimated effort reasonable (≤4h subagent task, decompose IF larger)
- [ ] Communication protocol clear (filesystem barrier + AGENTS.md + completion msg)
- [ ] Briefing prompt total ≤3000 token (NOT bloat — concise + complete)
- [ ] Spawn subagent with FULL briefing inline (NO link-only)

### A.4 Briefing red flags (orchestrator REJECT subagent dispatch)

- 🚩 Subagent prompt brief ("fix X bug") → ESPANDI con full template
- 🚩 No file ownership boundary specified → DEFINE before dispatch
- 🚩 No CoV mandate → ADD §5 CoV protocol verbatim
- 🚩 No completion msg requirement → ADD §7 communication protocol
- 🚩 Multi-task in single dispatch → SPLIT atomi separati
- 🚩 Estimated effort ≥4h single subagent → DECOMPOSE Maker-1 + Maker-2 separati

---

## §J — Real Screen Control Validation Stack (NO debito tecnico mandate Andrea)

### J.1 Mandate Andrea verbatim ultimo turno

> "vorrei che i test e validazione siano fatti proprio con il controllo schermo agendo realmente come utente reale. non voglio debito tecnico"
> "usare control chrome e playwright, fare test sul prodotto deployato"

### J.2 Decomposition mandate

- Validation **MUST** use real screen control (NO mocked, NO headless approximation, NO unit-test-only)
- Tools obbligatori: **Control Chrome MCP** + **Playwright** + **Cowork desktop** (Mac Mini autonomous)
- Target: **prodotto deployato** = `https://www.elabtutor.school` + Edge Function `unlim-chat` v80 LIVE PROD
- NO debito tecnico = use ufficiali tools Anthropic/Microsoft (NO custom test framework)

### J.3 3-tier validation hierarchy (per atom)

| Tier | Tool | Use case | Owner | Cost |
|---|---|---|---|---|
| **Tier 1 — Cowork autonomous H24** | Cowork desktop Mac Mini progettibelli | E2E real user persona-prof, video webm capture, OCR-resilient UI refactor | Mac Mini cron */30 OR manual dispatch | $0 (Max 20x sub) |
| **Tier 2 — Control Chrome MCP** | `mcp__Control_Chrome__*` MacBook Andrea | Semi-auto interactive testing, JavaScript exec, real DOM, screenshot evidence | Andrea+Claude inline session | $0 (existing) |
| **Tier 3 — Playwright spec** | `tests/e2e/*.spec.js` | Reproducible automation CI baseline, deterministic asserts | CI/CD npm run e2e | $0 |

**Selection criterion per atom**:
- Atom UI-facing user flow critical (e.g., Lavagna esci persistence F1, Modalità Percorso E1) → **Tier 1 Cowork** + **Tier 3 Playwright** combined
- Atom backend LLM behavior (e.g., UNLIM cap conditional A1, L2 narrow A2) → **Tier 2 Control Chrome** prompt-driven smoke
- Atom infrastructure (e.g., hedged Mistral env A4) → **Tier 2 Control Chrome** monitoring + curl latency measure

### J.4 Tier 1 — Cowork desktop autonomous (Mac Mini progettibelli)

**Pre-requisite**:
- Cowork desktop installed Mac Mini (Phase 0+1 prep, OR Step 2 Atom 2.7 separate)
- macOS permissions Andrea consent (Accessibility + Screen Recording + Mic + Automation)
- Mac Mini SSH `progettibelli@100.124.198.59` reachable

**Workflow per atom validation**:
1. Dispatch task to Cowork via Anthropic API (uses Max 20x quota progettibelli):
```bash
ssh progettibelli@100.124.198.59
cd /Users/progettibelli/elab-builder
bash scripts/cowork-real/dispatch-test.sh ATOM-S33-A1 "Test cap conditional UNLIM response — open Chrome, navigate elabtutor.school, login class_key 'test-mac-mini-audit', enter Lavagna, mount v1-cap6-esp1, ask UNLIM 'Spiega LED ai ragazzi', screenshot risposta + verify length 100-180 word (deep_question category)"
```
2. Cowork autonomous executes: Chrome navigate + click + type + screenshot + video webm
3. Output saved `docs/audits/cowork-real/ATOM-S33-A1/{session_id}/`:
   - `01-welcome.png` ... `NN-final.png` (20+ screenshots)
   - `full-session.webm` (video)
4. Daily Kimi K2.6 video analysis batch (Step 3 Atom 3.2 prep, OR manual review):
```bash
bash scripts/cowork-real/kimi-video-analyze.sh /path/to/full-session.webm ATOM-S33-A1
```
5. Output structured findings markdown `docs/audits/cowork-real/ATOM-S33-A1/kimi-video-analysis-DATE.md`

**Anti-debito**: Cowork = ufficiali Anthropic, NO custom code. Pixel/OCR-based = resilient UI refactor (vs Playwright CSS selector fragility).

### J.5 Tier 2 — Control Chrome MCP (MacBook Andrea inline)

**Pre-requisite**:
- Chrome browser installed MacBook Andrea
- Control Chrome MCP server connected (verifica `mcp__Control_Chrome__*` tools available)

**Workflow per atom validation**:
1. Open atom-relevant URL prodotto:
```javascript
// Inline Claude Code session
mcp__Control_Chrome__open_url("https://www.elabtutor.school/#lavagna")
```
2. Execute test sequence:
```javascript
// Click Lavagna mode switch
mcp__Control_Chrome__execute_javascript({
  code: `document.querySelector('[data-testid="modalita-switch-libero"]').click()`
})
// Verify state
mcp__Control_Chrome__execute_javascript({
  code: `document.querySelector('[data-elab-modalita]').getAttribute('data-elab-modalita')`
})
// Expected: "libero"
```
3. Screenshot evidence:
```javascript
mcp__Control_Chrome__get_page_content() // OR screenshot via JavaScript
```
4. Document `docs/audits/2026-05-XX-atom-A1-control-chrome-validation.md`:
   - URL tested
   - Actions executed
   - Expected vs actual state
   - Screenshot evidence (paths)

**Anti-debito**: Control Chrome MCP = ufficiali. Real DOM, real JavaScript exec, NO mocking.

### J.6 Tier 3 — Playwright spec (CI baseline)

**Pre-requisite**:
- Playwright installed `npm install -D @playwright/test` (already present)
- Test spec written `tests/e2e/atom-S33-A1-cap-conditional.spec.js` (NEW per atom)

**Workflow per atom validation**:
1. Write spec NEW:
```javascript
// tests/e2e/atom-S33-A1-cap-conditional.spec.js
import { test, expect } from '@playwright/test';

test('UNLIM cap conditional — deep_question 100-180 word range', async ({ page }) => {
  await page.goto('https://www.elabtutor.school/#lavagna');
  await page.fill('[data-testid="class-key-input"]', 'test-e2e-validation');
  await page.click('[data-testid="enter-lavagna"]');

  // Mount experiment
  await page.click('[data-testid="experiment-v1-cap6-esp1"]');

  // Send deep_question prompt
  await page.fill('[data-testid="unlim-input"]', 'Spiega ai ragazzi come funziona il diodo LED nel circuito completo con resistore 220 ohm sul kit ELAB');
  await page.click('[data-testid="unlim-send"]');

  // Wait for response
  const response = await page.waitForSelector('[data-testid="unlim-response"]', { timeout: 15000 });
  const text = await response.textContent();

  // Verify word count in deep_question category cap (100-180)
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  expect(wordCount).toBeGreaterThanOrEqual(100);
  expect(wordCount).toBeLessThanOrEqual(180);

  // Verify Ragazzi opener (PZ §1)
  expect(text).toMatch(/^Ragazzi/);

  // Verify Vol/cap citation
  expect(text).toMatch(/Vol\.\d+\s*cap\.\d+/);
});
```
2. Run spec:
```bash
npx playwright test tests/e2e/atom-S33-A1-cap-conditional.spec.js
```
3. Output `playwright-report/` HTML + traces
4. Document `docs/audits/2026-05-XX-atom-A1-playwright-validation.md`

**Anti-debito**: Playwright = standard Microsoft, NO custom framework. Reproducibile CI.

### J.7 Validation matrix per atom (combinazione 3-tier)

| Atom | Tier 1 Cowork | Tier 2 Control Chrome | Tier 3 Playwright |
|---|---|---|---|
| A1 cap conditional | Optional (LLM behavior backend-heavy) | **PRIMARY** (5 prompt categories smoke) | **MANDATORY** (cap range assert) |
| A2 L2 narrow | Optional | Optional | **MANDATORY** (R7 200-prompt bench equivalent) |
| A3 memory wire | Optional | **PRIMARY** (multi-turn intent_history) | Optional |
| A4 hedged Mistral env | N/A | **PRIMARY** (latency monitoring 10 prompts) | N/A |
| A5 off-ELAB paletti | Optional | **PRIMARY** (3 off-topic prompts) | Optional |
| B1 wake word diagnose | **PRIMARY** (mic permission real browser) | Optional | **MANDATORY** (`tests/unit/lavagna/wakeWord-integration.test.jsx` 9/9 already exists, run + verify) |
| C1 lavagna libero | **PRIMARY** (visual no-circuit verify) | **MANDATORY** (modalità switch state assert) | **MANDATORY** (NEW spec libero-no-circuit) |
| E1 percorso 2-window | **PRIMARY** (visual 2 windows overlay) | **MANDATORY** (window draggable resizable test) | **MANDATORY** (NEW spec percorso-2-window) |
| E2 PassoPasso older | **PRIMARY** (visual older view + resize) | **MANDATORY** (resize handle test) | **MANDATORY** (NEW spec passo-passo-older) |
| F1 esci persistence | **PRIMARY** (5 strokes write → esci → re-enter → verify) | **MANDATORY** (drawing bucket localStorage assert) | **MANDATORY** (NEW spec esci-drawing-persist) |

### J.8 Validation evidence requirements (mandatory ogni atom)

Audit doc §5 Smoke prod validation MUST include:
- **Tier 1 Cowork** (se primary): video webm path + 3+ screenshot path + Kimi analysis findings IF Step 3 enabled
- **Tier 2 Control Chrome** (se primary): URL tested + JavaScript executed + state assert verified + screenshot path
- **Tier 3 Playwright** (se mandatory): spec file path + `npx playwright test` output + assert pass/fail count + traces path IF fail

**NO atom commit acceptable senza ≥2/3 tier evidence**.

### J.9 Anti-debito checklist

- ✅ NO custom test framework (use Vitest + Playwright + Control Chrome + Cowork)
- ✅ NO mock LLM call (use Edge Function v80 LIVE PROD)
- ✅ NO mock UI (use Vercel deploy `319v42i4p` LIVE PROD)
- ✅ NO mock voice (use Voxtral primary + CF Whisper STT prod)
- ✅ NO selectors fragile only (use `data-testid` stable attributes preferred)
- ✅ NO test against staging (use prod LIVE always — staging drift risk)
- ✅ NO bypass ufficiali (Cowork OR Control Chrome OR Playwright, NO custom Selenium/Puppeteer)

---

## §K — Plugin macOS + Connettori + Skill Metric (mandate Andrea ultimo turno)

### K.1 Mandate Andrea verbatim

> "scrivi di usare plugin macos e connettori vari e tutti i plugin necessari e skill necessarie. in particolare quelle per misurare onniscenza onnipotenza morfismo e principio 0. devono essere affinate"

### K.2 Decomposition mandate

- **Plugin macOS** (Computer Use): real screen control + macOS native apps automation
- **Connettori vari** (MCP servers): Supabase + Vercel + Posthog + Sentry + GitHub + Linear + Atlassian + Slack
- **Skill metric ELAB** (~/.claude/skills/elab-*): 5 skill OBBLIGATORI invoke + REFINE inline durante sessione
- **Plugin necessari** (Claude Code marketplace): codex-plugin-cc + agent-teams + superpowers + impeccable + sentry + posthog

### K.3 Plugin macOS Computer Use stack

**Tools available** (`mcp__computer-use__*`, `mcp__Macos__*`):
- `mcp__computer-use__screenshot` — primary display capture
- `mcp__computer-use__left_click` + `right_click` + `double_click` + `triple_click` (real mouse coordinates)
- `mcp__computer-use__type` (real keyboard input)
- `mcp__computer-use__key` (modifier combos cmd+a etc)
- `mcp__computer-use__open_application` (launch macOS app)
- `mcp__computer-use__request_access` (mandatory pre-action approval Andrea)
- `mcp__computer-use__teach_step` + `teach_batch` (guided tutorial mode)
- `mcp__Macos__App` + `Click` + `Type` + `Snapshot` + `Scrape` (alternative macOS native)

**Workflow per atom validation real screen ELAB**:
```
mcp__computer-use__request_access(apps=["Google Chrome"], reason="Real screen validation atom A1 cap conditional UNLIM response prodotto deployato")
mcp__computer-use__open_application(app="Google Chrome")
mcp__computer-use__screenshot()  # capture pre-state
mcp__computer-use__left_click(coordinate=[X,Y])  # click on Lavagna URL bar
mcp__computer-use__type(text="https://www.elabtutor.school/#lavagna")
mcp__computer-use__key(text="Return")
mcp__computer-use__screenshot()  # capture loaded state
# ... atom-specific test sequence
mcp__computer-use__screenshot(save_to_disk=true)  # final evidence
```

**Anti-debito**: macOS Computer Use = ufficiali Anthropic. Real OS-level interaction. NO custom Selenium/Puppeteer.

**Tier hierarchy precedente §J.3 — UPDATED**:

| Tier | Tool | Use case |
|---|---|---|
| **Tier 0 — Cowork desktop** | Mac Mini progettibelli | H24 autonomous, video webm + Kimi analysis |
| **Tier 1 — macOS Computer Use** | MacBook Andrea inline | Real screen control native macOS, screenshot evidence |
| **Tier 2 — Control Chrome MCP** | MacBook Andrea inline | DOM-aware semi-auto JavaScript exec |
| **Tier 3 — Playwright spec** | CI baseline | Reproducible automation |
| **Tier 4 — Claude_in_Chrome MCP** | Browser extension | Remote browser control fallback |

**Selection criterion per atom REVISED**:
- Atom UI critical visual + native macOS interaction → **Tier 1 macOS Computer Use** PRIMARY
- Atom UI DOM-aware programmable → **Tier 2 Control Chrome MCP**
- Atom CI reproducible regression → **Tier 3 Playwright**
- Atom remote browser headless → **Tier 4 Claude_in_Chrome**
- Atom H24 autonomous prod monitoring → **Tier 0 Cowork**

### K.4 Connettori MCP (skill plugin connectors)

**Disponibili** (verifica system reminder):

| Connector | Tools | Use case ELAB |
|---|---|---|
| **Supabase** | `mcp__plugin_supabase_supabase__*` + `mcp__supabase__*` | Edge Function deploy + DB query + RLS check |
| **Vercel** | `mcp__plugin_vercel_vercel__*` + `mcp__57ae1081...__*` | Deploy + logs + project status + runtime errors |
| **Posthog** | `mcp__plugin_posthog_posthog__*` | Analytics + LLM analytics + experiments + flags |
| **Sentry** | `mcp__plugin_sentry_sentry__*` | Error tracking + traces + AI monitoring |
| **GitHub** | `mcp__plugin_engineering_github__*` | PR status + issues + actions |
| **Linear** | `mcp__473f49d2...__*` | Issue tracking ELAB roadmap |
| **Atlassian** | (skill atlassian:*) | Jira tickets + Confluence specs |
| **Slack** | `slack:standup` + `slack:summarize-channel` | Comms team |
| **Cloudflare** | `mcp__308d0704...__*` | Workers AI deploy + KV namespaces + R2 buckets |
| **Notion** | `mcp__a3761d95...__notion-*` | Notes + handoff docs |
| **Fireflies** | `mcp__426774f8...__fireflies_*` | Meeting transcripts |

**Workflow per atom — example A4 hedged Mistral env activation**:
```
# Verify env current via Supabase connector
mcp__plugin_supabase_supabase__authenticate
# Set env via Supabase CLI (uses connector OAuth)
SUPABASE_ACCESS_TOKEN=... npx supabase secrets set HEDGED_MISTRAL_ENABLED=true --project-ref euqpdueopmlllqjmqnyb
# Verify deploy fresh
mcp__57ae1081...__list_deployments(projectId="elab-tutor")
# Monitor latency post-deploy via Posthog LLM analytics
mcp__plugin_posthog_posthog__authenticate
mcp__plugin_posthog_posthog__execute_tool(query="latency p95 last 1h unlim-chat")
```

### K.5 Skill metric ELAB (5 OBBLIGATORI)

Skill esistenti `~/.claude/skills/`:

| Skill | Path | Cosa misura |
|---|---|---|
| **elab-morfismo-validator** | `~/.claude/skills/elab-morfismo-validator/SKILL.md` | G1-G10 palette + NanoR4Board SHA-256 + fonts + ToolSpec count + ElabIcons + emoji + data-attributes + lesson-paths + volume-references + lesson-groups |
| **elab-onniscenza-measure** | `~/.claude/skills/elab-onniscenza-measure/SKILL.md` | G1-G8 RAG chunks count + classifier 6 categories + UI snapshot ADR-042 wired + intent_history persist + previous-actions context block + memory studentContext + Onniscenza V1 vs V2.1 + canary rollout |
| **elab-onnipotenza-coverage** | `~/.claude/skills/elab-onnipotenza-coverage/SKILL.md` | G1-G9 L0 direct API count + L1 composite handler + L2 templates + L3 Deno postToVision + L4 INTENT parser + L5 Mistral function calling + L6 dispatcher whitelist + L7 ENABLE_INTENT_TOOLS_SCHEMA canary + L8 CANARY_DENO_DISPATCH + L9 stop conditions |
| **elab-principio-zero-validator** | `~/.claude/skills/elab-principio-zero-validator/SKILL.md` | G1-G5 baseline + G+1 vol/pag verbatim + G+2 plurale Ragazzi + G+3 kit ELAB mention |
| **elab-velocita-latenze-tracker** | `~/.claude/skills/elab-velocita-latenze-tracker/SKILL.md` | G1-G9 R5 latency p95 + R7 canonical % + R6 hybrid recall@5 + Edge Function cold start + Mistral La Plateforme + Voxtral + CF Whisper + Pixtral Vision + ADR-038 hedged |

### K.6 Workflow skill metric per Phase 0+1+ sessione

**Phase 0.0 entrance — baseline measurement (10min PRE-Phase 0.1)**:
```
# Run all 5 skill metric per baseline pre-modifiche
~/.claude/skills/elab-morfismo-validator/SKILL.md  # invoke skill
~/.claude/skills/elab-onniscenza-measure/SKILL.md
~/.claude/skills/elab-onnipotenza-coverage/SKILL.md
~/.claude/skills/elab-principio-zero-validator/SKILL.md
~/.claude/skills/elab-velocita-latenze-tracker/SKILL.md

# Output: 5 JSON file `automa/state/skill-runs/2026-05-XX-baseline-{morfismo,onniscenza,onnipotenza,principio-zero,velocita}.json`
# Aggregate score baseline: morfismo X.X/10 + onniscenza X.X/10 + onnipotenza X.X/10 + PZ X/8 + velocita p95 ms
```

**Per atom — measurement post-impl (5min cad)**:
```
# Re-run skill metric relevant to atom
# A1 cap conditional → elab-principio-zero-validator (verify Ragazzi + Vol/cap mantenuti) + elab-onniscenza-measure (verify classifier 8 categories)
# A2 L2 narrow → elab-onnipotenza-coverage (L4 INTENT canonical % lift)
# A3 memory → elab-onniscenza-measure (intent_history persist + previous-actions block)
# A4 hedged → elab-velocita-latenze-tracker (p95 lift)
# C1 lavagna libero → elab-morfismo-validator (Sense 2 lavagna pulita) + elab-principio-zero-validator (empty state plurale)
# E1 percorso 2-window → elab-morfismo-validator (Sense 1.5 docente-adapt) + elab-onniscenza-measure (UI snapshot wired)
# F1 esci persistence → elab-morfismo-validator (data-attributes preserve) + elab-onniscenza-measure (memoria classe)
```

**Phase 1+ close — final measurement + delta vs baseline (15min)**:
```
# Re-run all 5 skill metric
# Compare vs baseline JSON
# Decision: lift quantitative ≥0.5 score = PASS atom contribution / lift <0.3 = caveat onesto / regression = ROLLBACK atom
```

### K.7 AFFINARE skill metric inline durante sessione (mandate Andrea "devono essere affinate")

**Iter 33+ entrance — refine 5 skill metric**:

5 skill esistenti iter 31 baseline. Ogni skill ha gates G1-GN + edge cases. Andrea mandate refinement:

| Skill | Refinement priority | Effort |
|---|---|---|
| elab-onniscenza-measure | Add G+1 NEW gate: intent_history recent_intents jsonb persisted (post atom A3) + G+2 previous-actions context block in system-prompt | 30min |
| elab-onnipotenza-coverage | Add G+1 NEW gate: L4 INTENT canonical % from R7 200-prompt bench (post atom A2) + G+2 hedged Mistral active env (post atom A4) | 30min |
| elab-morfismo-validator | Add G+1 NEW gate: Sense 1.5 percorso 2-window adapt context (post atom E1) + G+2 esci persistence drawing buckets save (post atom F1) | 30min |
| elab-principio-zero-validator | Add G+1 NEW gate: cap word per category (post atom A1) + G+2 off-ELAB paletti soft 1-frase + redirect (post atom A5) | 30min |
| elab-velocita-latenze-tracker | Add G+1 NEW gate: hedged Mistral 100ms stagger active env + p95 lift target -25-40% (post atom A4) | 20min |

**Total refinement effort**: ~140min ~2.5h distributed across atomi (NOT separate batch — refine SUBITO post atom relevante).

### K.8 Plugin necessari Claude Code marketplace

| Plugin | Comando install | Use case |
|---|---|---|
| **codex-plugin-cc** | `/plugin install codex-plugin-cc@codex-plugin-cc` | `/codex` Three-Agent Pipeline impl |
| **agent-teams** | (built-in marketplace) | Anthropic ufficiali team-feature + team-debug + team-review + team-spawn |
| **superpowers** | (built-in marketplace) | brainstorming + executing-plans + writing-plans + dispatching-parallel-agents + verification-before-completion |
| **impeccable** | (built-in marketplace) | colorize + typeset + arrange + audit + critique design Sense 2 Morfismo |
| **claude-mem** | (built-in marketplace) | mem-search + make-plan + do (sessioni cross-context) |
| **caveman** | (built-in marketplace) | OFF per questa sessione (mandate Andrea explicit "non caveman") |
| **sentry** | (built-in marketplace) | sentry-setup-tracing + sentry-code-review |
| **posthog** | (built-in marketplace) | logs + experiments + insights + flags + dashboards |
| **playwright** | npm i -D @playwright/test (already installed) | Tier 3 spec real prod testing |
| **vercel** | (built-in marketplace) | deploy + status + env + verification + ai-sdk |
| **supabase** | (built-in marketplace) | postgres-best-practices + supabase |

### K.9 Skill skills NEW da creare (iter 34+ post Step 1 close)

Identificate utili ma NOT esistenti, creare iter 34+:
- elab-tier-validation-evidence — aggregate Cowork + Control Chrome + Playwright evidence per atom (cross-tier consensus)
- elab-multi-provider-cost-tracker — aggregate Kimi + Codex + Gemini + Mistral + Anthropic API spend cumulative
- elab-andrea-ratify-queue-monitor — alert quando ratify queue >25 entries OR oldest entry >7 days
- elab-deploy-gate-enforcer — verify Vercel + Edge Function v post commit batch (anti-deploy-gap iter 29 lesson)

### K.10 Anti-debito checklist plugin + connettori

- ✅ NO custom plugin development inline (use marketplace + ufficiali)
- ✅ NO custom test framework (use Playwright + Vitest + Cowork + Computer Use)
- ✅ NO custom subagent framework (use agent-teams + superpowers Anthropic ufficiali)
- ✅ NO bypass connector OAuth (use mcp__plugin_*_*__authenticate flow)
- ✅ NO direct npm install (Andrea ratify mandatory)
- ✅ NO test against staging (only prod LIVE www.elabtutor.school + Edge v80)

---

## §B — CoV Protocol Comprehensive (5-fase per atom)

### B.1 Why 5-fase CoV (not just "vitest pass")

User mandate: "Tutto deve essere analizza testato validato, fare cov e audit."

CoV (Chain of Verification) Karpathy principle: ogni claim quantitative DEVE essere verificable + repeatable.

Fasi:
1. **Pre-baseline** (verify state before)
2. **Analyze** (understand impact before edit)
3. **Implement** (atomic surgical change)
4. **Test** (immediate post-edit verification)
5. **Audit** (comprehensive doc + smoke prod + caveat onesti)

### B.2 Phase 1 — Pre-baseline (mandatory ogni atom)

```bash
cd /Users/andreamarro/VOLUME\ 3/PRODOTTO/elab-builder

# 1. Vitest baseline current
cat automa/baseline-tests.txt
# Expected: 13752

# 2. Vitest run targeted file area atom
npx vitest run [path/to/relevant.test.js] --reporter=basic | tail -5
# Expected: pass count > 0, 0 fail

# 3. Build state current
npx tsc --noEmit 2>&1 | head -5
# Expected: 0 errors (OR known errors documented)

# 4. Git state working tree
git status --short | head -10
# Expected: known dirty files (pre-existing)

# 5. Edge Function v80 LIVE prod
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X OPTIONS https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat
# Expected: HTTP 204

# 6. Vercel prod LIVE
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://www.elabtutor.school
# Expected: HTTP 200
```

**Document Phase 1 output**: copy stdout to atom audit doc §1.

### B.3 Phase 2 — Analyze impact (mandatory ogni atom)

Prima di edit:

```bash
# 1. Files atom toccherà (read-only inspection)
git grep -l "MAX 60 parole" supabase/functions/_shared/
git grep -n "selectTemplate" supabase/functions/_shared/clawbot-template-router.ts
# etc per atom

# 2. Tests che verificano comportamento corrente
git grep -l "system-prompt" tests/
git grep -l "selectTemplate" tests/

# 3. Cross-references atom (chi usa cosa)
git grep -n "classifyPrompt" supabase/functions/

# 4. Lines of code stimate (pre-edit budget)
wc -l [path/to/file] # baseline LOC count
# Stima LOC delta dopo edit
```

**Document Phase 2 output**:
- Files affected list + LOC counts
- Tests verifying behavior list
- Cross-refs identified
- LOC delta estimate

### B.4 Phase 3 — Implement (atomic surgical)

Rules:
- NO broad refactor inline (1 atom = 1 logical change)
- Use `Edit` tool (NOT `Write` for existing files)
- Preserve indentation + comments + formatting style existing
- Add NEW tests in NEW file IF atom introduces new behavior
- Update existing test ONLY IF behavior contract changes (document deviation)

Anti-pattern:
- ❌ "While I'm here, also fix Y" → STOP, atom integrity, defer Y separate atom
- ❌ Rename variable for clarity unrelated to atom → STOP, defer
- ❌ Format/lint changes mixed with atom logic → STOP, separate commits

### B.5 Phase 4 — Test (immediate post-edit) + Real Screen Validation (§J)

**B.5.1 Unit/Integration tests (Vitest)**:

```bash
# 1. Vitest re-run targeted (fast feedback ~10s)
npx vitest run [path/to/relevant.test.js] --reporter=basic | tail -5
# Expected: same count + new tests added if atom introduces new behavior

# 2. Vitest full suite (slow ~15min, mandatory before commit)
npx vitest run --reporter=basic 2>&1 | tail -10
# Expected: 13752+ PASS preserved (NEW count = 13752 + NEW tests added)

# 3. Build PASS
npm run build 2>&1 | tail -5
# Expected: build complete, 0 errors

# 4. Linting/type check
npx tsc --noEmit 2>&1 | head -5
# Expected: 0 errors

# 5. Edge Function deploy preview (IF atom touches supabase/functions/)
# DO NOT deploy production v81 inline
# Use --dry-run OR manual review only
SUPABASE_ACCESS_TOKEN=... npx supabase functions deploy unlim-chat --dry-run --project-ref euqpdueopmlllqjmqnyb 2>&1 | tail -5
```

**B.5.2 Real Screen Validation tests (Tier 1+2+3 per §J)**:

Per Andrea mandate "vorrei che i test e validazione siano fatti proprio con il controllo schermo agendo realmente come utente reale. non voglio debito tecnico", ogni atom DEVE eseguire ≥2/3 tier validation real screen control sul prodotto deployato.

Refer §J.7 validation matrix per atom-specific tier selection.

```bash
# Tier 2 Control Chrome MCP (semi-auto inline)
# Open prodotto deployato
mcp__Control_Chrome__open_url("https://www.elabtutor.school/#lavagna")
# Execute atom-specific test flow
mcp__Control_Chrome__execute_javascript({code: "..."})
# Screenshot evidence
mcp__Control_Chrome__get_page_content()

# Tier 3 Playwright (CI baseline NEW spec per atom)
npx playwright test tests/e2e/atom-S33-[ID]-[name].spec.js --reporter=list
# Expected: all asserts PASS

# Tier 1 Cowork desktop autonomous (Mac Mini, IF atom UI critical)
ssh progettibelli@100.124.198.59 "cd /Users/progettibelli/elab-builder && bash scripts/cowork-real/dispatch-test.sh ATOM-S33-[ID] '...'"
# Output: docs/audits/cowork-real/ATOM-S33-[ID]/{session_id}/screenshots + video webm
```

**Document Phase 4 output**:
- Vitest pass/fail counts
- Build duration + status
- Type check errors
- Edge Function dry-run output
- **Tier 2 Control Chrome**: URL tested + actions executed + screenshot evidence path
- **Tier 3 Playwright**: spec path + assert pass/fail + traces path IF fail
- **Tier 1 Cowork** (IF primary): video path + screenshots count + Kimi findings IF Step 3 enabled

### B.6 Phase 5 — Audit (comprehensive doc + smoke + caveat)

Audit doc template `docs/audits/2026-05-XX-atom-[ATOM-ID]-execution.md`:

```markdown
# Atom [ATOM-ID] — [Title] — Execution Audit

**Date**: 2026-05-XX HH:MMZ
**Atom**: [ATOM-ID] from Step 1 plan §4.3
**Estimated effort**: [X hours]
**Actual effort**: [Y hours]
**Status**: PASS/PARTIAL/FAIL

## §1 Pre-baseline (Phase 1 CoV)
[stdout copies of pre-baseline commands]

## §2 Analyze impact (Phase 2 CoV)
- Files affected: [list with LOC counts]
- Tests verifying behavior: [list]
- Cross-references: [list]
- LOC delta estimate: [X added, Y modified, Z removed]

## §3 Implementation (Phase 3 CoV)
- Files modified actual:
  - `path/to/file1.ts`: +X LOC, -Y LOC, modified Z lines
  - `path/to/file2.ts`: +X LOC
- Tests added:
  - `tests/unit/new-test.test.js`: NEW, X tests
- Approach chosen: [§2.X Approccio Y from plan]
- Deviations from plan: [list if any]

## §4 Tests (Phase 4 CoV)
- Vitest targeted: [count] PASS
- Vitest full suite: [count] PASS (vs baseline 13752, delta +N)
- Build: PASS in [X]s
- Type check: 0 errors
- Edge Function dry-run: [output]

## §5 Smoke prod validation
- Curl Edge Function v80: [HTTP code + response time]
- Curl Vercel prod: [HTTP code]
- Cowork desktop trial (IF atom UI-facing): [output]
- Playwright spec (IF E2E impact): [output]

## §6 Caveat onesti residui (NO compiacenza mandate)
- [Honest limitation 1]
- [Honest limitation 2]
- [Defer atom Y for full closure]

## §7 PRINCIPIO ZERO + Morfismo compliance
- PZ §1 Ragazzi plurale: [verified mechanism]
- PZ kit ELAB mention: [verified mechanism]
- Morfismo Sense 1 runtime: [verified mechanism]
- Morfismo Sense 1.5 docente-adapt: [verified mechanism]
- Morfismo Sense 2 triplet: [N/A OR verified mechanism]

## §8 Cross-link
- Plan section: docs/superpowers/plans/2026-05-03-STEP-1-SESSIONE-ELAB-FIXES-MULTI-PROVIDER.md §4.3 ATOM [ID]
- Multi-provider plan: docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md
- This Playbook: docs/superpowers/plans/2026-05-03-PLAYBOOK-PROSSIMA-SESSIONE-CONTEXT-BRIEFING.md §B CoV protocol
```

---

## §C — Audit Template (mandatory ogni atom)

### C.1 Audit doc structure (verbatim §B.6 above)

Same template above §B.6, separate section for emphasis.

### C.2 Audit doc storage convention

Path: `docs/audits/2026-05-XX-atom-[ATOM-ID]-execution.md`
Where `2026-05-XX` = date di esecuzione atom, `[ATOM-ID]` = A1/A2/A5/B1/C1/E1/E2/F1.

Multiple atomi same day OK (`2026-05-04-atom-A1-execution.md` + `2026-05-04-atom-A2-execution.md`).

### C.3 Cross-link audit graph

Ogni audit doc cross-link:
- Step 1 plan §4.3 ATOM section
- Multi-provider plan §3 architectural reasoning
- This Playbook §B CoV protocol
- CLAUDE.md sprint history footer (iter 33+)
- AGENTS.md project root (status state)

---

## §D — Validation Gate (mandatory pre-merge)

### D.1 Validation gate per atom (after Phase 5 audit)

Ogni atom DEVE PASS validation gate prima merge/commit batch:

| Gate | Pass criterion | Block action |
|---|---|---|
| Vitest baseline preserved | Count ≥13752 | Investigate failing test, fix root cause OR rollback atom |
| Build PASS | npm run build exit 0 | Fix build errors OR rollback |
| Type check 0 errors | npx tsc --noEmit | Fix types OR rollback |
| Audit doc shipped | File exists + sections 1-8 populated | Write audit doc complete |
| Smoke prod OK | curl HTTP 200/204 | Investigate prod regression |
| **Real screen validation ≥2/3 tier** (§J) | Cowork OR Control Chrome OR Playwright evidence saved | Execute atom-specific tier per §J.7 matrix |
| **Tier 3 Playwright spec NEW** (atomi UI/E2E) | spec file shipped + npx playwright test PASS | Write spec OR mark atom-not-applicable explicit |
| **Tier 2 Control Chrome screenshot evidence** (atomi backend behavior) | screenshot path documented audit doc §5 | Capture via Control Chrome MCP before commit |
| PZ §1 compliance | Manual code review | Refactor to comply |
| Morfismo compliance | Manual review per Sense 1+1.5+2 | Refactor to comply |
| Caveat onesti documented | §6 audit doc list | Add caveat onesti |
| File ownership boundary respected | Diff scope check | Revert out-of-boundary changes |

**ALL gates MUST PASS** prima di commit batch.

### D.2 Validation gate Phase 1+ entrance (after all atomi)

| Gate | Pass criterion | Block action |
|---|---|---|
| 9/10 atomi PASS | atom audit docs status PASS | Defer failing atomi iter 34 |
| Vitest ≥13752 | full suite | Fix regression OR rollback |
| Build PASS | npm run build | Fix errors |
| Edge Function v81 deploy | dry-run PASS | Andrea ratify deploy gate |
| R7 200-prompt bench | canonical ≥30% (vs 3.6% baseline) | Investigate L2 router narrow |
| Smoke prod 5 prompts | response shape correct | Edge Function rollback v80 |
| Andrea satisfaction Phase 1+ | ≥7/10 | Retrospective + decision iter 34+ |

### D.3 NO compiacenza language enforcement

Audit doc + commit messages MUST NOT use:
- "Mostly works" → ✅ "8/10 cases verified, 2 cases [specific defer reason]"
- "Should work" → ✅ "Verified via [specific test], expected behavior [specific]"
- "Looks good" → ✅ "Smoke prod 5/5 PASS, code review PZ compliant"
- "Done" → ✅ "Atom A1 PASS, audit doc shipped, validation gates 9/9 PASS"
- "Sprint T close achieved" → ✅ "Sprint T close gate Andrea Opus G45 review iter 41-43 cumulative pending"

---

## §E — Execution sequence prossima sessione (revised with Phase 0)

### E.1 Schedule outline (~12-14h Andrea wall-clock — REVISED with Tier 1+2+3 validation real screen control mandate Andrea)

NOTA: schedule revisato +3-4h vs precedente per integrare validation real screen control (Cowork + Control Chrome + Playwright) ogni atom UI-facing (C1+E1+E2+F1). Atomi backend-only (A1+A2+A4+A5) hanno Control Chrome smoke ~10min ognuno.

| Time | Phase | Atomi | Effort | Validation tier per §J.7 |
|---|---|---|---|---|
| Hour 0:00-1:30 | **Phase 0 Multi-Provider Setup** | 0.1+0.2+0.3+0.4+0.5 | 90min | N/A trial Phase 0.4 = self-validation |
| Hour 1:30-2:30 | Phase 1 BATCH 1 partial | A1+A2 (Codex impl Three-Agent) impl | 60min | Tier 2 Control Chrome 10min cad + Tier 3 Playwright NEW spec ~20min |
| Hour 2:30-3:00 | A1+A2 validation real screen | Tier 2+3 evidence | 30min | Tier 2 5 prompt categories smoke prod + Tier 3 cap range assert |
| Hour 3:00-4:00 | Phase 1 BATCH 1 cont | A4+A5+F1 impl | 60min | A4+A5 Tier 2 only / F1 Tier 1+3 mandatory |
| Hour 4:00-4:45 | A4+A5+F1 validation real screen | Tier 1 Cowork F1 esci+strokes + Tier 2 A4 latency + Tier 2 A5 off-topic + Tier 3 esci-drawing-persist | 45min | F1 Cowork PRIMARY (5 strokes write esci re-enter verify) |
| Hour 4:45-6:15 | Phase 1 BATCH 1 deep | A3 (SQL migration + memory wire) impl | 90min | Tier 2 Control Chrome multi-turn intent_history smoke |
| Hour 6:15-6:45 | A3 validation real screen | Tier 2 Control Chrome 4-prompt sequential intent_history verify | 30min | Send 4 sequential commands, verify 4° response references previous |
| Hour 6:45-8:15 | Phase 1 BATCH 2 partial | C1+E2 impl | 90min | C1 Tier 1+2+3 mandatory / E2 Tier 1+2+3 mandatory |
| Hour 8:15-9:15 | C1+E2 validation real screen | Tier 1 Cowork visual + Tier 2 modalità switch + Tier 3 NEW specs libero-no-circuit + passo-passo-older | 60min | Cowork visual verify libero NO circuit + PassoPasso older view + resize working |
| Hour 9:15-12:15 | Phase 1 BATCH 2 deep | E1 (Percorso 2-window overlay) impl | 180min | Tier 1+2+3 mandatory |
| Hour 12:15-13:15 | E1 validation real screen | Tier 1 Cowork 2-window visual + Tier 2 draggable resizable + Tier 3 NEW spec percorso-2-window | 60min | Cowork visual 2 windows overlay + window draggable + adapt context working |
| Hour 13:15-13:45 | Phase 1 retrospective | All atomi audit docs + tier evidence review | 30min | Verify ≥2/3 tier evidence per atom in audit docs |
| Hour 13:45-14:00 | Commit batch + push origin | All atomi commit + pre-commit + pre-push | 15min | CoV gate vitest + build pre-push hook |

### E.2 Decisione gate sequenziale

Ogni Phase end → decide proceed/pivot/stop based KPI.

Phase 0 STOP decision → fallback Phase 1+ con Claude solo (atomi ELAB ancora eseguibili) — multi-provider deferred.

Phase 1 BATCH 1 partial fail → defer remaining BATCH 2 iter 34, audit + retrospective.

### E.3 Multi-provider integration per Phase 1+ atomi

Atomi candidati Three-Agent Pipeline (Phase 0 trial scaled):
- **A1** (system-prompt cap conditional): Codex impl + Gemini review (TRIAL Phase 0.4)
- **A2** (L2 router narrow): Codex impl (similar pattern A1)
- **A5** (off-ELAB paletti): Claude inline (1-line change, no parallelization benefit)
- **A3** (memory wire): Claude inline (multi-file critical path, NO parallel)
- **A4** (hedged Mistral env): Andrea action (env var set)
- **F1** (esci persistence): Claude inline + Gemini review post-impl
- **C1** (lavagna libero): Claude inline
- **E1** (Percorso 2-window): Codex impl new component + Claude orchestrate
- **E2** (PassoPasso older): Claude inline

**Decision criteria per atom**:
- New component creation (e.g., LessonContextWindow E1) → Codex impl benefit (boilerplate fast)
- Existing file surgical edit → Claude inline (context know)
- Cross-file refactor (A3 memory wire 5 files) → Claude inline (consistency)
- Review depth (any atom critical) → Gemini DeepThink review

---

## §F — Andrea ratify queue prossima sessione (questions)

### F.1 Pre-Phase 0 questions (CRITICAL)

1. **Phase 0 budget 90min Andrea OK?** (Codex install + Gemini install + AGENTS.md + Trial + Retrospective)
2. **Codex Plugin install OAuth ChatGPT Plus** (uses Plus quota, no extra $) — Andrea login Plus pre-sessione?
3. **Gemini CLI install** (uses Gemini Pro quota) — extensions install acceptable?
4. **Three-Agent Pipeline trial atom**: A1 (system-prompt cap conditional) confirmed scelto, OR pivot atom diverso?
5. **STOP fallback OK** se Phase 0 STOP decision → Phase 1+ Claude solo (multi-provider deferred Step 2 separate sessione)?
6. **Schedule revised 12-14h Andrea OK?** (vs precedente 9-10h, +3-4h per Tier 1+2+3 validation real screen control mandate Andrea)
7. **Cowork desktop trial Phase 1+ atomi UI**: C1+E1+E2+F1 mandatory Tier 1 Cowork — Mac Mini progettibelli setup Cowork pre-sessione (Step 2 Atom 2.7 anticipato), OR defer Tier 1 e procedere Tier 2+3 only Step 1?
8. **Control Chrome MCP MacBook Andrea**: tools `mcp__Control_Chrome__*` available verify, OR pre-install richiesto?
9. **Tier 3 Playwright NEW specs** per atomi UI (libero-no-circuit + passo-passo-older + percorso-2-window + esci-drawing-persist): scrivere inline durante atom impl, OR defer batch fine sessione?
10. **Validation tier evidence storage path**: `docs/audits/2026-05-XX-atom-[ID]-{cowork,control-chrome,playwright}-validation.md` separati OR consolidato single audit doc?

### F.2 Pre-Phase 1+ questions (post Phase 0 PASS)

6. **A3 SQL migration `student_progress` ADD recent_intents jsonb**: Andrea autonomous apply, OR ratify gate iter 34?
7. **Edge Function v81 deploy** post-batch atomi A1+A2+A5 close: Andrea ratify gate?
8. **R7 200-prompt bench** post-deploy v81: execute Step 1 sessione close, OR defer?
9. **9 atomi BLOCKER+HIGH** sufficienti Step 1 sessione, OR drop 1-2 per buffer (e.g., E1 deep work 3h DROP IF time tight)?

### F.3 Generic ratify questions (anywhere session)

10. **Multi-provider workflow** Step 2+ entrance gate Andrea ratify: post Phase 0 PASS, schedule Step 2 separate sessione 4-7 settimane?
11. **Sprint T close 9.5/10 ONESTO**: realistic iter 41-43 Andrea Opus G45 indipendente review cumulative — confirmed deferred?
12. **Mac Mini progettibelli SSH**: Step 1 fixes sessione coinvolge Mac Mini (e.g., Cowork prep) OR MacBook only?

---

## §G — Risk register prossima sessione (10 risks)

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Codex Plugin install OAuth fails | Low | Medium | Fallback Codex CLI standalone OR skip Phase 0.1 |
| Gemini CLI extensions broken | Low | Low | Use `gemini chat` direct without extensions |
| AGENTS.md scaffold conflict iter 33 commit | Very Low | Low | Verify file scaffolded e6aa5e2, extend non-conflict |
| Three-Agent Pipeline handoff context loss | Medium | Medium | AGENTS.md status updates 4+ tracked, briefing template §A obbligatorio |
| Atom A1 Codex implementation hallucination | Medium | Medium | Spec markdown ultra-detailed, Andrea reviews diff before accept |
| Vitest 13752 baseline regression | Low | High | Pre-commit gate + rollback atomic |
| Andrea time exceeded 9-10h sessione | Medium | Medium | Drop E1 deep work IF time tight (3h budget recovery) |
| Edge Function v81 deploy regression | Low | High | Andrea ratify gate, dry-run only Phase 1+, deploy iter 34 separate |
| Mac Mini cron L1+L2+L3 disturbed | Very Low | High | Phase 0+1 MacBook only, Mac Mini untouched |
| Org limit cascade BG agents (lesson iter 38) | Medium | Medium | Max 3 BG agents simultanee, sequential when uncertain |

---

## §H — Cross-link 4 plan doc complementari

Lettura order PROSSIMA SESSIONE entrance (Andrea + agenti):

1. **First — this Playbook** (§A briefing template + §B CoV + §C audit + §D validation + §E execution sequence)
2. **Second — Step 1 plan** (§1 discovery + §2 brainstorming + §3 ultrathink + §4.3 ATOM detail per spec)
3. **Third — Multi-provider plan** (§3 ultrathink architectural + §4 Step 1 sub-step Codex/Gemini/Mac Mini)
4. **Fourth — CLAUDE.md** (sprint history footer iter 1-32 + DUAL MOAT + PRINCIPIO ZERO + critical files)
5. **Fifth — Andrea ratify queue** (`automa/state/iter-31-andrea-flags.jsonl` 20 entries)
6. **Sixth — Score history** (`automa/state/score-history.jsonl` 6 entries iter 29-33)

---

## §I — Sintesi finale + next-step

### I.1 Cosa questo Playbook offre

- Phase 0 Multi-Provider Setup OBBLIGATORIO entrance prossima sessione (90min, $0 cost)
- Context Briefing Template §A per ogni subagent dispatch (anti-context-loss lesson iter 38)
- CoV Protocol 5-fase §B per ogni atom (anti-compiacenza mandate Andrea)
- Audit Template §C per ogni atom (cross-link graph)
- Validation Gate §D pre-merge (9 gates per atom + 7 gates Phase 1+ entrance)
- Execution sequence §E revised con Phase 0 first (~9-10h sessione)
- Andrea ratify queue §F (12 questions critical pre-Phase 0 + Phase 1+)
- Risk register §G (10 risks identified + mitigation)
- Cross-link §H (lettura order + 6 doc reference)

### I.2 Anti-pattern questa Playbook NON viola

- ✅ NO compiacenza ("9 atomi shipped" → "9/10 atomi PASS validation gate" with quantitative gate)
- ✅ NO token-saving fast skim (Phase 0 90min budget OBBLIGATORIO, NON skipped)
- ✅ NO subagent context loss (briefing template comprehensive 9 sections)
- ✅ NO CoV skip (5-fase protocol mandatory ogni atom)
- ✅ NO audit absent (template + storage convention specified)
- ✅ NO validation skip (9 gates per atom + 7 gates Phase 1+)
- ✅ NO Sprint T close 9.5 inflato claim (cap mechanical iter 41-43)
- ✅ NO sources unattributed (cross-link §H 6 doc reference graph)

### I.3 Andrea action immediata

1. **Read this Playbook fully** (~60min reading — added §J real screen validation)
2. **Read Step 1 plan + Multi-provider plan** (~60min reading aggregate)
3. **Decide Phase 0 ratify §F.1 10 questions** (~25min reflection — added 5 Tier validation questions)
4. **Block calendar prossima sessione 12-14h** (~5min schedule — REVISED +3-4h per Tier 1+2+3 validation real screen mandate Andrea)
4b. **Cowork desktop pre-install Mac Mini progettibelli** (~50min IF Tier 1 enabled Step 1, OR defer Step 2 — see §F.1 Q7)
4c. **Control Chrome MCP verify** MacBook Andrea (~5min `mcp__Control_Chrome__*` tools available)
5. **Pre-condition checklist §1.2** verify (sub login + Mac Mini SSH + vitest baseline + Edge + Vercel) (~15min)
6. **Ratify entry** `automa/state/iter-31-andrea-flags.jsonl`:
```jsonl
{"date":"2026-05-XX","decisione":"prossima-sessione-phase0-multi-provider-ratify","title":"Phase 0 Multi-Provider Setup + Phase 1+ ELAB fixes prossima sessione","default_applied":"PASS-WITH-CONDITIONS","g45_rationale":"Phase 0 OBBLIGATORIO entrance per testare workflow multi-provider PRIMA Phase 1+ atomi ELAB. Andrea ratify §F.1 5 conditions answered: 90min budget OK, Codex+Gemini OAuth OK, Trial atom A1 OK, STOP fallback OK. Pre-condition §1.2 checklist verified. Decisione finale: PASS. Phase 1+ atomi 9/10 BLOCKER+HIGH target, drop E1 IF time tight buffer.","needs_andrea_override_by":"prossima sessione entrance","status":"resolved"}
```

### I.4 Cosa questo Playbook NON è

- ❌ NON è permesso a procedere — è proposta gated Andrea ratify §F.1
- ❌ NON è atomic to-do list (è playbook context briefing + protocol references)
- ❌ NON è sostituto Step 1 plan (Step 1 plan = atomi spec, Playbook = execution wrapper)
- ❌ NON è promessa Sprint T close 9.5 prossima sessione (gate Andrea Opus iter 41-43 cumulative)
- ❌ NON è documentation overhead (è anti-compiacenza enforcement framework)

---

**Plan version**: v1.0 final
**Status**: PROPOSED — Andrea ratify gate prossima sessione entrance
**Cross-link**: §H sopra
**Anti-pattern**: G45 enforced + NO compiacenza + sources cited + caveats explicit
**Next-step gate**: Andrea ratify queue iter 31-andrea-flags.jsonl entry "prossima-sessione-phase0-multi-provider-ratify"
