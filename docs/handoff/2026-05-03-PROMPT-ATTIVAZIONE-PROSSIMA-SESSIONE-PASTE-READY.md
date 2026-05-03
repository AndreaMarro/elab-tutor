# Prompt Attivazione PROSSIMA SESSIONE — paste-ready Andrea

**Author**: Claude (sonnet 4.7 1M, NO caveman, output style explanatory + learning)
**Date**: 2026-05-03 evening
**Status**: PROPOSED — paste verbatim in NEW Claude Code session per attivare Phase 0 + Phase 1+ workflow
**Cross-link**: `docs/superpowers/plans/2026-05-03-PLAYBOOK-PROSSIMA-SESSIONE-CONTEXT-BRIEFING.md` (master playbook 1097 LOC) + `docs/superpowers/plans/2026-05-03-STEP-1-SESSIONE-ELAB-FIXES-MULTI-PROVIDER.md` (788 LOC) + `docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md` (1669 LOC)

---

## §0 — Come usare questo file

1. Andrea apre NEW Claude Code session su MacBook (working dir = `/Users/andreamarro/VOLUME\ 3/PRODOTTO/elab-builder`)
2. Andrea verifica pre-condition checklist §1.1 sotto (15min)
3. Andrea **paste verbatim** §2 PROMPT INIZIALE sotto (single message, comprehensive)
4. Claude legge tutti file riferimento + esegue Phase 0 → Phase 1+ atomi sequenziali
5. Claude returns audit doc + commit batch + push origin a fine sessione

---

## §1 — Pre-condition Andrea PRE-paste (15min verifica)

### 1.1 Sub login attivi (browser, 5min)

| Sub | URL verify | Status expected |
|---|---|---|
| ChatGPT Plus Andrea | https://chat.openai.com (login) | Active |
| Claude Pro Andrea | https://claude.ai (login) | Active |
| Gemini Pro Andrea | https://gemini.google.com (login) | Active |
| Mistral Le Chat Pro Andrea | https://chat.mistral.ai (login) | Active |
| Claude Max 20x progettibelli | https://claude.ai (login progettibelli account) | Active |

### 1.2 Mac Mini SSH reachable (terminale MacBook, 2min)

```bash
ssh progettibelli@100.124.198.59 "date && crontab -l | wc -l"
# Expected: date echoed + crontab entries count ≥4 (L1+L2+L3+aggregator ACTIVE)
```

### 1.3 Stato repo ELAB (terminale MacBook, 3min)

```bash
cd /Users/andreamarro/VOLUME\ 3/PRODOTTO/elab-builder

# Vitest baseline
cat automa/baseline-tests.txt
# Expected: 13752

# Edge Function v80 LIVE
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X OPTIONS https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat
# Expected: HTTP 204

# Vercel prod LIVE
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://www.elabtutor.school
# Expected: HTTP 200

# Git status
git log --oneline -3
git status --short | head -5
# Expected: HEAD = e6aa5e2 OR newer multi-provider commits
```

### 1.4 Tools MCP disponibili (Claude Code session, 5min)

```
# In Claude Code session inline check
echo "Verify mcp__Control_Chrome__open_url tool present (Tier 2 validation)"
echo "Verify mcp__Claude_in_Chrome__navigate tool present (Tier 2 fallback)"
echo "Verify Playwright installed: npx playwright --version"
```

### 1.5 Time block calendar (5min)

- Prossima sessione: **12-14h** Andrea wall-clock (vedi PLAYBOOK §E.1)
- Suggerito: 2 sessioni split (~6-7h each) over 2 giorni consecutivi se Andrea preferisce
- Mac Mini progettibelli running cron L1+L2+L3 throughout (NO disturb)

---

## §2 — PROMPT INIZIALE paste-ready (single message in Claude Code session)

**Andrea paste questo blocco verbatim come PRIMO messaggio in NEW Claude Code session prossima sessione**:

```
Sei orchestrator inline Claude Code session. Output style: explanatory + learning. Caveman mode: OFF (Andrea explicit "NO caveman" mandate). Italian + technical English where canonical.

# CONTESTO CRITICO — LEGGI PRIMA AGIRE

Lavori su ELAB Tutor (educational electronics tutor kids 8-14 Italian K-12 schools). Live: https://www.elabtutor.school. Stack: React 19 + Vite 7 frontend (Vercel) + Supabase Edge Functions backend + Mistral La Plateforme primary LLM (voice clone Andrea LIVE) + Cloudflare Workers AI multimodal.

Stato iter 32 close (verified file:line):
- HEAD git: e6aa5e2 multi-provider workflow plan + G45 anti-inflation scaffold (PROPOSED)
- Vercel deploy: 319v42i4p LIVE PROD 2026-05-03 16:06:44Z
- Edge Function: unlim-chat v80 ACTIVE 2026-05-03 16:02:57Z
- ADR-041 + ADR-042: ACCEPTED env-gated default 0%/false safe rollback
- Score iter 31 ralph 32 close: 8.45/10 self-cap manual G45
- Score iter 33 multi-vote consensus 4-vendor bias-corrected: 8.27/10
- Vitest baseline: 13752 PASS preserved
- Andrea ratify queue: 20 entries `automa/state/iter-31-andrea-flags.jsonl`
- Onnipotenza expansion 6044 LOC: LIVE PROD verified 50/50 E2E PASS path B real dispatch

DUAL MOAT 2026+:
- Sense 1 Tecnico: morfico runtime per-classe + per-docente
- Sense 1.5 Adattabilità: docente esperto vs principiante adapt
- Sense 2 Triplet: software ↔ kit Omaric ↔ volumi cartacei coherent

PRINCIPIO ZERO §1 (NON-NEGOTIABLE):
- "Ragazzi" plurale opener mandatory ogni risposta UNLIM
- Kit ELAB mention obbligatorio
- Vol/cap citation verbatim tra «caporali»
- Lingua italiana scuola pubblica

# DOCUMENTI DA LEGGERE PRIMA AGIRE (lettura order obbligatorio)

1. `docs/superpowers/plans/2026-05-03-PLAYBOOK-PROSSIMA-SESSIONE-CONTEXT-BRIEFING.md` (1097 LOC, MASTER playbook this session — leggi TUTTE le sezioni §0 + §1 + §A + §B + §C + §D + §E + §F + §G + §H + §I + §J)
2. `docs/superpowers/plans/2026-05-03-STEP-1-SESSIONE-ELAB-FIXES-MULTI-PROVIDER.md` (788 LOC, atomi spec — leggi §1 discovery + §2 brainstorming + §3 ultrathink + §4.3 ATOM detail per ogni atom A1+A2+A3+A4+A5+B1+C1+E1+E2+F1)
3. `docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md` (1669 LOC, architettura workflow — leggi §3 ultrathink architectural + §4 Step 1 sub-step Codex/Gemini/Mac Mini)
4. `CLAUDE.md` (sprint history footer iter 1-32 close, DUAL MOAT, PRINCIPIO ZERO, file critici, anti-regressione)
5. `automa/state/iter-31-andrea-flags.jsonl` (20 entries Andrea ratify queue)
6. `automa/state/score-history.jsonl` (6 entries iter 29-33 score history G45 cap)

# MANDATE ANDREA (verbatim ultimi turni)

- "rendere unlim non ebete + risposte più lunghe + non pappette pronte + andare oltre ELAB con paletti + ricordo azioni precedenti + velocità più elevata + voxtral wake word + lavagna libera senza circuito + homepage lavagna only lavagna + cronologia sessioni + modalità percorso non funziona + 2 modalità passo passo (older preferred + window resize) + esci lavagna scritte spariscono + homepage mascotte NO emoticon + crediti Teodora De Venere + modalità percorso adapt context + percorso = vecchia libero + 2 window sovrapposte + glossario only homepage + PRINCIPIO ZERO + MORFISMO + sistematizza + CoV + audit + analyze + test + validate + NO compiacenza"
- "fa si che all'inizio si imposti lo step del workflow multi provider per testarlo"
- "ogni parte dell'insieme deve conoscere il contesto"
- "non andare veloce per usare pochi token, concentrati al massimo su tutto"
- "Non essere compiacente"
- "Tutto deve essere analizza testato validato, fare cov e audit"
- "vorrei che i test e validazione siano fatti proprio con il controllo schermo agendo realmente come utente reale"
- "non voglio debito tecnico"
- "usare control chrome e playwright, fare test sul prodotto deployato"

# PHASE 0.0 — Skill Metric Baseline + Plugin Verify (~25min PRE-Phase 0.1)

Per Playbook §K dettaglio:

K.0 Verify plugin macOS Computer Use + Connettori MCP available (5min):
- Check tools `mcp__computer-use__*` available (request_access + screenshot + click + type + open_application)
- Check tools `mcp__Control_Chrome__*` available (open_url + execute_javascript)
- Check tools `mcp__Claude_in_Chrome__*` available (navigate + computer batch)
- Check connectors authenticated: Supabase + Vercel + Posthog + GitHub
- Check skill plugins loaded: agent-teams + superpowers + impeccable + claude-mem + sentry + posthog

K.1 Skill metric ELAB baseline (10min):
- Invoke skill `~/.claude/skills/elab-morfismo-validator/SKILL.md` baseline
- Invoke skill `~/.claude/skills/elab-onniscenza-measure/SKILL.md` baseline
- Invoke skill `~/.claude/skills/elab-onnipotenza-coverage/SKILL.md` baseline
- Invoke skill `~/.claude/skills/elab-principio-zero-validator/SKILL.md` baseline
- Invoke skill `~/.claude/skills/elab-velocita-latenze-tracker/SKILL.md` baseline
- Output 5 JSON files `automa/state/skill-runs/2026-05-XX-baseline-{morfismo,onniscenza,onnipotenza,principio-zero,velocita}.json`
- Aggregate baseline scores documented audit doc `docs/audits/2026-05-XX-phase00-skill-metric-baseline.md`

K.2 Skill metric refinement gates (10min planning, refine inline post atom):
- elab-onniscenza-measure: ADD G+1 intent_history persisted + G+2 previous-actions context block (post A3)
- elab-onnipotenza-coverage: ADD G+1 L4 INTENT canonical % R7 bench + G+2 hedged Mistral active env (post A2+A4)
- elab-morfismo-validator: ADD G+1 Sense 1.5 percorso 2-window adapt + G+2 esci persistence drawing (post E1+F1)
- elab-principio-zero-validator: ADD G+1 cap word per category + G+2 off-ELAB paletti soft (post A1+A5)
- elab-velocita-latenze-tracker: ADD G+1 hedged 100ms stagger active + p95 lift -25-40% (post A4)
- Total refinement effort: ~140min distributed across atomi (NOT separate batch)

# PHASE 0 — Multi-Provider Workflow Setup (~90min, MANDATORY entrance)

Per PLAYBOOK §1 dettaglio:

Phase 0.1 (15min): Codex Plugin install via /plugin marketplace add openai/codex-plugin-cc + /plugin install codex-plugin-cc@codex-plugin-cc + verify /codex --help. Audit doc: docs/audits/2026-05-XX-phase0-codex-plugin-install.md

Phase 0.2 (15min): Gemini CLI install via npm install -g @google/gemini-cli + first run OAuth + extensions install (conductor + code-review + security). Audit doc: docs/audits/2026-05-XX-phase0-gemini-cli-install.md

Phase 0.3 (10min): AGENTS.md project root verify scaffold present + extend section "Phase 0 Trial Active". Audit: AGENTS.md updated.

Phase 0.4 (45min): Three-Agent Pipeline trial Atom A1 (system-prompt cap conditional Step 1 plan §4.3 ATOM A1):
- Step 1 Plan (Claude orchestrator inline) write spec docs/audits/2026-05-XX-phase0-trial-A1-spec.md
- Step 2 Implement (/codex execute spec → diff edit 2 file: system-prompt.ts + onniscenza-classifier.ts)
- Step 3 Review (gemini chat structured findings PRINCIPIO ZERO + Morfismo + edge cases)
- Step 4 Fix (Claude inline address Gemini findings)
- Step 5 CoV deterministic gate (vitest + multi-vote G45 4-vote aggregator scripts/g45/multi-vote-aggregator-manual.mjs)
- Step 6 Audit doc docs/audits/2026-05-XX-phase0-trial-A1-execution.md

Phase 0.5 (30min): Retrospective decision matrix Phase 0 → PASS/PIVOT/STOP per Phase 1+ entrance. Audit: docs/audits/2026-05-XX-phase0-RETROSPECTIVE.md

Phase 0 acceptance gate: 3/4 ipotesi confirmed (H1 anti-bias + H2 wall-clock + H3 debito + H4 cost) + Andrea satisfaction ≥7/10 + Mac Mini cron stable + Vitest 13752 preserved.

# PHASE 1+ — ELAB Tutor 9 atomi BLOCKER+HIGH (~10h work, validation real screen)

Per Step 1 plan §4.3 dettaglio per atom + Playbook §J validation tier hierarchy:

A1 system-prompt cap conditional 6→8 categories (1h impl + 30min validation Tier 2+3 — ALREADY trial Phase 0.4)
A2 L2 router narrow shouldUseTemplate heuristic (1h impl + Tier 3 mandatory R7 200-prompt bench equivalent)
A3 studentContext intent_history persist Supabase (3h impl + 30min Tier 2 multi-turn intent_history smoke)
A4 ADR-038 hedged Mistral LIVE env activation (0.5h + Tier 2 latency 10 prompts measure)
A5 Off-ELAB paletti soft system-prompt clause (0.5h + Tier 2 3 off-topic prompts)
F1 Esci persistence drawing bucket force save (1h impl + Tier 1+3 mandatory: Cowork PRIMARY 5 strokes write esci re-enter + Tier 3 NEW spec esci-drawing-persist)
C1 Lavagna libero truly free (1h impl + Tier 1+2+3 mandatory: Cowork visual + Control Chrome state assert + Playwright NEW spec libero-no-circuit)
E1 Percorso 2-window overlay restore vecchia libero (3h impl + 60min Tier 1+2+3 mandatory: Cowork 2-window visual + Control Chrome draggable resizable + Playwright NEW spec percorso-2-window)
E2 PassoPasso older preferred + window resize (1.5h impl + Tier 1+2+3 mandatory: Cowork visual older view + Control Chrome resize handle + Playwright NEW spec passo-passo-older)
B1 Wake word diagnose (1h Tier 1 PRIMARY mic permission real browser + Tier 3 wakeWord-integration.test.jsx 9/9 verify)

# VALIDATION REAL SCREEN MANDATORY (NO debito tecnico mandate Andrea)

Per ogni atom: ≥2/5 tier evidence per Playbook §J.7 + §K.3 matrix + §J.8 evidence requirements.

Tier 0 Cowork desktop autonomous (Mac Mini progettibelli):
ssh progettibelli@100.124.198.59 "cd /Users/progettibelli/elab-builder && bash scripts/cowork-real/dispatch-test.sh ATOM-S33-[ID] 'task description'"
Output: docs/audits/cowork-real/ATOM-S33-[ID]/{session_id}/screenshots + video webm + Kimi K2.6 video analysis IF Step 3

Tier 1 macOS Computer Use (MacBook Andrea inline real screen):
mcp__computer-use__request_access(apps=["Google Chrome"], reason="Validation atom [ID]")
mcp__computer-use__open_application(app="Google Chrome")
mcp__computer-use__screenshot(save_to_disk=true)
mcp__computer-use__left_click(coordinate=[X,Y])  # real mouse
mcp__computer-use__type(text="...")  # real keyboard
Output: docs/audits/2026-05-XX-atom-[ID]-macos-computer-use-validation.md

Tier 2 Control Chrome MCP (MacBook Andrea inline DOM-aware):
mcp__Control_Chrome__open_url("https://www.elabtutor.school/#lavagna")
mcp__Control_Chrome__execute_javascript({code: "atom-specific test"})
Document: docs/audits/2026-05-XX-atom-[ID]-control-chrome-validation.md

Tier 3 Playwright (CI baseline NEW spec per atom):
npx playwright test tests/e2e/atom-S33-[ID]-[name].spec.js --reporter=list
Document: docs/audits/2026-05-XX-atom-[ID]-playwright-validation.md

Tier 4 Claude_in_Chrome (browser extension fallback):
mcp__Claude_in_Chrome__navigate({url: "https://www.elabtutor.school"})
mcp__Claude_in_Chrome__find({query: "data-testid=modalita-switch-libero"})
mcp__Claude_in_Chrome__computer({action: "left_click", coordinate: [...]})
Document: docs/audits/2026-05-XX-atom-[ID]-claude-in-chrome-validation.md

Tier hierarchy selection per atom Playbook §K.3 + §J.7:
- A1+A2 (UNLIM cap conditional + L2 narrow) → Tier 2 Control Chrome PRIMARY + Tier 3 Playwright MANDATORY
- A3 (memory wire) → Tier 2 Control Chrome PRIMARY (multi-turn intent_history)
- A4+A5 (hedged Mistral + off-ELAB) → Tier 2 Control Chrome smoke 10min cad
- F1 (esci persistence) → Tier 0 Cowork PRIMARY + Tier 1 macOS Computer Use + Tier 3 Playwright NEW spec
- C1 (lavagna libero) → Tier 0 Cowork + Tier 1 macOS Computer Use + Tier 2 Control Chrome + Tier 3 Playwright NEW spec
- E1 (percorso 2-window) → Tier 0 Cowork + Tier 1 macOS Computer Use + Tier 2 Control Chrome + Tier 3 Playwright NEW spec
- E2 (PassoPasso older + resize) → Tier 0 Cowork + Tier 1 macOS Computer Use + Tier 2 Control Chrome + Tier 3 Playwright NEW spec
- B1 (wake word) → Tier 1 macOS Computer Use PRIMARY (real mic permission) + Tier 3 wakeWord-integration.test.jsx 9/9 verify

# CONNETTORI MCP MANDATORY (Playbook §K.4)

Per atom backend (A3 Supabase migration + A4 Edge Function env + post-deploy):
- Supabase: mcp__plugin_supabase_supabase__authenticate + mcp__supabase__authenticate
- Vercel: mcp__plugin_vercel_vercel__authenticate + mcp__57ae1081...__list_deployments + mcp__57ae1081...__get_deployment_build_logs
- Posthog: mcp__plugin_posthog_posthog__authenticate (latency p95 monitoring + LLM analytics)
- Sentry: mcp__plugin_sentry_sentry__authenticate (error tracking post-deploy)
- GitHub: mcp__plugin_engineering_github__authenticate (PR creation + issue check)

# SKILL METRIC ELAB MANDATORY (Playbook §K.5+§K.6)

Invoke skill metric per atom RILEVANTE:
- A1 cap conditional → ~/.claude/skills/elab-principio-zero-validator + ~/.claude/skills/elab-onniscenza-measure
- A2 L2 narrow → ~/.claude/skills/elab-onnipotenza-coverage
- A3 memory wire → ~/.claude/skills/elab-onniscenza-measure
- A4 hedged Mistral → ~/.claude/skills/elab-velocita-latenze-tracker
- C1 lavagna libero → ~/.claude/skills/elab-morfismo-validator + ~/.claude/skills/elab-principio-zero-validator
- E1 percorso 2-window → ~/.claude/skills/elab-morfismo-validator + ~/.claude/skills/elab-onniscenza-measure
- F1 esci persistence → ~/.claude/skills/elab-morfismo-validator + ~/.claude/skills/elab-onniscenza-measure
- B1 wake word → ~/.claude/skills/elab-onnipotenza-coverage

# AFFINARE skill metric inline post atom (Playbook §K.7)

Refinement priority queue (~140min distributed atomi):
- elab-onniscenza-measure ADD G+1 intent_history persisted + G+2 previous-actions block (post A3) — 30min
- elab-onnipotenza-coverage ADD G+1 L4 INTENT canonical % R7 + G+2 hedged active (post A2+A4) — 30min
- elab-morfismo-validator ADD G+1 Sense 1.5 percorso 2-window + G+2 esci drawing (post E1+F1) — 30min
- elab-principio-zero-validator ADD G+1 cap word per category + G+2 off-ELAB paletti (post A1+A5) — 30min
- elab-velocita-latenze-tracker ADD G+1 hedged 100ms + p95 lift target (post A4) — 20min

# ANTI-PATTERN G45 ENFORCEMENT (NO compiacenza mandate)

NEVER:
- Use --no-verify on commit/push (pre-commit + pre-push gate sacred)
- Push diretto su main (only e2e-bypass-preview branch ELAB workflow)
- Add npm dependencies without Andrea ratify
- Skip CoV per atom (5-fase Playbook §B mandatory)
- Skip audit doc per atom (template Playbook §C mandatory)
- Skip ≥2/3 tier validation real screen (Playbook §J.7+§J.8 mandatory)
- Claim "Atom shipped" senza CoV verification + audit doc + tier evidence
- Inflate score subjective ("seems to work") senza quantitative measure
- Skip caveat documentation (anti-compiacenza mandate)
- Pappette generiche ("fix X bug") senza decomposition atomic
- Token-saving fast skim — concentrati al massimo

ALWAYS:
- Read briefing template Playbook §A prima di spawnare subagent
- Write completion msg automa/team-state/messages/[role]-iter33-phase[N]-completed.md
- Update AGENTS.md project root status field
- Cite file:line evidence in claim
- Caveat onesti documented in audit doc §6
- Use ufficiali tools (Cowork + Control Chrome + Playwright + Vitest, NO custom framework)
- Real prod testing (NO mock LLM, NO mock UI, NO staging)
- 5-fase CoV per atom (pre-baseline + analyze + impl + test + audit)

# COMMUNICATION PROTOCOL

Quando atom complete:
1. Write completion msg automa/team-state/messages/[role]-iter33-phase[N]-completed.md format ## Atom [ID] STATUS [PASS/FAIL/PARTIAL] + Files modified + Tests added + CoV + Audit doc + Caveat
2. Update AGENTS.md project root status field
3. NO direct commit (orchestrator commits batch all atomi at end)

Quando atom blocked:
1. Write blocker msg automa/team-state/messages/[role]-iter33-phase[N]-BLOCKED.md
2. Format Reason + What I tried + What I need
3. STOP — escalate Andrea decision

Quando findings off-scope:
1. Write findings note audit doc §X "Off-scope findings noted for iter 34+"
2. Do NOT pivot inline (atom integrity)

# ANDREA RATIFY GATES (12 questions per Playbook §F.1+F.2+F.3)

Pre-Phase 0 (CRITICAL):
1. Phase 0 budget 90min Andrea OK?
2. Codex Plugin install OAuth ChatGPT Plus quota?
3. Gemini CLI install OAuth Google Pro quota?
4. Three-Agent Pipeline trial atom A1 confirmed?
5. STOP fallback OK se Phase 0 STOP decision?
6. Schedule revised 12-14h Andrea OK (vs precedente 9-10h, +3-4h Tier 1+2+3 validation)?
7. Cowork desktop trial Phase 1+ atomi UI: setup pre-sessione OR defer Tier 1 Step 2?
8. Control Chrome MCP MacBook Andrea: tools available verify?
9. Tier 3 Playwright NEW specs inline OR batch fine sessione?
10. Validation tier evidence storage path separati OR consolidato single audit doc?

Pre-Phase 1+ (post Phase 0 PASS):
11. A3 SQL migration ALTER TABLE student_progress ADD recent_intents jsonb: Andrea autonomous OR ratify gate?
12. Edge Function v81 deploy post atomi A1+A2+A5 close: Andrea ratify gate?

# OUTPUT EXPECTED FINE SESSIONE

1. Phase 0 retrospective audit doc + decision PASS/PIVOT/STOP
2. 9-10 atomi audit docs (1 per atom) con tier validation evidence
3. AGENTS.md final status reflecting all atomi
4. Commit batch atomi su branch e2e-bypass-preview (NO push main)
5. Push origin e2e-bypass-preview con pre-push hook PASS (vitest 13752+ preserved)
6. CLAUDE.md sprint history footer iter 33 close section APPEND
7. Score history append entry iter 33 close score capped multi-vote G45
8. Andrea ratify queue iter-31-andrea-flags.jsonl new entries per outstanding gates
9. Cross-link doc graph aggiornato

# PROCEDI ORA

Step 1: Conferma briefing acknowledged ("YES BRIEFING ACKNOWLEDGED" + sintesi 3-line cosa farai)
Step 2: Verify pre-condition checklist Playbook §1.2 (Andrea sub login + Mac Mini SSH + vitest + Edge + Vercel)
Step 3: Begin Phase 0.1 Codex Plugin install
Step 4: Sequential Phase 0.2 → 0.3 → 0.4 → 0.5 with audit doc per phase
Step 5: Andrea ratify gate Phase 1+ entrance (waitfor explicit PASS/PIVOT/STOP)
Step 6: Phase 1+ atomi sequential per execution sequence Playbook §E.1
Step 7: Validation real screen ≥2/3 tier per atom (Playbook §J)
Step 8: Audit doc per atom (Playbook §C template)
Step 9: Commit batch + push origin fine sessione (pre-commit + pre-push hook)
Step 10: Final retrospective + score iter 33 close + Andrea ratify queue update

NO compiacenza. NO --no-verify. NO push main. NO custom test framework. NO mock prod. NO skip CoV. NO skip audit. NO skip tier validation real screen.

Concentrati al massimo. Slow + thorough. Real screen control sul prodotto deployato www.elabtutor.school + Edge Function v80 LIVE PROD.

GO.
```

---

## §3 — Cosa NON includere nel paste prompt sopra

- ❌ Andrea NON paste questo file `2026-05-03-PROMPT-ATTIVAZIONE-...md` come messaggio (è meta-doc, NOT prompt)
- ❌ Andrea NON paste link doc come solo URL (è già contenuto + cross-link inline §2 prompt)
- ❌ Andrea NON aggiunge "make it fast" OR "use as few tokens as possible" (CONTRADDICE mandate)

---

## §4 — Cosa Andrea fa POST-paste prompt

1. Aspetta Claude reply "YES BRIEFING ACKNOWLEDGED" + sintesi 3-line
2. Andrea reply: "PROCEDI Phase 0.1 Codex Plugin install" (esplicito ratify gate)
3. Phase 0.1+0.2+0.3+0.4+0.5 esecuzione sequenziale (Andrea monitora + decisione PASS/PIVOT/STOP §F.1 questions)
4. IF Phase 0 PASS: Andrea reply "PROCEDI Phase 1+ atomi sequenziali per Playbook §E.1 execution sequence"
5. IF Phase 0 PIVOT: Andrea explicit fix per failed Phase + retry
6. IF Phase 0 STOP: Andrea reply "FALLBACK Phase 1+ Claude solo, defer multi-provider Step 2 separate sessione"

---

## §5 — Risk register paste-ready prompt

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Prompt troppo lungo per single message Claude Code session | Low | Low | Prompt ~5KB compresso, well within token limit |
| Claude legge solo prompt skip cross-link doc | Medium | High | Mandate esplicito "leggi PRIMA AGIRE" + 6 doc obbligatori + check Briefing Acknowledged response |
| Andrea NON verifica pre-condition prima paste | Medium | Medium | Checklist §1 dettagliata verifica 15min prima paste |
| Phase 0 STOP decision ma Andrea continue Phase 1+ multi-provider | Low | Medium | STOP decision = fallback Claude solo explicit Playbook §1.7 |
| Time exceed 12-14h budget | Medium | Medium | Drop E1 deep work IF time tight (3h budget recovery) — Playbook §G.7 |
| Org limit cascade BG agents prossima sessione | Medium | Medium | Max 3 BG agents simultanee (lesson iter 38) — Playbook §G.10 |
| Cowork desktop NOT installed Mac Mini | Medium | High | Andrea ratify §F.1 Q7 PRE-sessione: install OR defer Tier 1 Step 1 |
| Control Chrome MCP NOT available MacBook | Low | Medium | Andrea verify §F.1 Q8 PRE-sessione: tools `mcp__Control_Chrome__*` available |
| Playwright NEW specs not written inline (defer batch) | Low | Low | Defer acceptable IF Tier 1 Cowork + Tier 2 Control Chrome evidence sufficient §J.7 |

---

## §6 — Cross-link doc graph (3 plan + 1 prompt + 6 reference)

```
[NEW Claude Code session prossima]
       │
       ▼ paste §2 prompt
[Claude orchestrator inline]
       │
       ├─→ READ docs/superpowers/plans/2026-05-03-PLAYBOOK-PROSSIMA-SESSIONE-CONTEXT-BRIEFING.md (1097 LOC MASTER)
       │       │
       │       ├─→ §A briefing template per subagent
       │       ├─→ §B CoV protocol 5-fase
       │       ├─→ §C audit template
       │       ├─→ §D validation gate
       │       ├─→ §E execution sequence revised 12-14h
       │       ├─→ §F Andrea ratify questions 12
       │       ├─→ §G risk register
       │       ├─→ §H cross-link
       │       ├─→ §I sintesi
       │       └─→ §J real screen validation Tier 1+2+3
       │
       ├─→ READ docs/superpowers/plans/2026-05-03-STEP-1-SESSIONE-ELAB-FIXES-MULTI-PROVIDER.md (788 LOC)
       │       │
       │       ├─→ §1 discovery 17 sotto-issue
       │       ├─→ §2 brainstorming approcci
       │       ├─→ §3 ultrathink architectural
       │       └─→ §4.3 ATOM detail A1+A2+A3+A4+A5+B1+C1+E1+E2+F1
       │
       ├─→ READ docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md (1669 LOC)
       │       │
       │       ├─→ §3 ultrathink architectural reasoning
       │       └─→ §4 Step 1 Codex/Gemini/Mac Mini
       │
       ├─→ READ CLAUDE.md (sprint history footer iter 1-32 close, ~2200 LOC)
       │
       ├─→ READ automa/state/iter-31-andrea-flags.jsonl (20 entries Andrea ratify queue)
       │
       └─→ READ automa/state/score-history.jsonl (6 entries iter 29-33)
```

---

## §7 — Versioning + status

**Plan version**: v1.0 final paste-ready
**Status**: PROPOSED — Andrea ratify gate prossima sessione entrance + paste §2 prompt verbatim
**Anti-pattern**: G45 enforced + NO compiacenza + sources cited + caveats explicit

**Cross-link**:
- Master playbook: `docs/superpowers/plans/2026-05-03-PLAYBOOK-PROSSIMA-SESSIONE-CONTEXT-BRIEFING.md`
- Step 1 atomi spec: `docs/superpowers/plans/2026-05-03-STEP-1-SESSIONE-ELAB-FIXES-MULTI-PROVIDER.md`
- Multi-provider architettura: `docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md`
- This activation prompt: `docs/handoff/2026-05-03-PROMPT-ATTIVAZIONE-PROSSIMA-SESSIONE-PASTE-READY.md` (single source of truth attivazione paste-ready)

---

**End of activation prompt doc.**
**Next-step gate**: Andrea pre-condition §1 verify → paste §2 prompt verbatim NEW Claude Code session prossima.
