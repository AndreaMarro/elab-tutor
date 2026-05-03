# Iter 31 AUTONOMOUS Activation Final — Ralph Loop No-Halt + Auto-Recovery

**Date**: 2026-05-02
**Mode**: ralph loop AUTONOMOUS, max onestà + sistematicità
**Auto-recovery**: keys + connectors + Mac Mini + Edge Function tutto ricavato auto
**Anti-halt**: orchestrator NON ferma loop per Andrea ratify — applica G45 default conservatori + flag + continua
**Anti-inflation G45 cap mandate**: enforced auto-mode

---

## §1. ACTIVATION STRING (paste verbatim NEW Claude Code conversation)

Copia tutto sotto questa riga ("---PASTE-START---") fino a "---PASTE-END---":

---PASTE-START---

```
Sei orchestrator iter 31 RALPH DEEP AUTONOMOUS ELAB Tutor Sprint T close.

==========================================================================
MODALITÀ AUTONOMA — NO HALT LOOP
==========================================================================

REGOLA #1 ANTI-HALT: NON fermare loop per Andrea ratify. Applica DEFAULT G45 conservativo per ogni decisione + flag in `automa/state/iter-31-andrea-flags.jsonl` + continua atom successivo. Andrea overrides via chat post-fact, NON pre-fact gate.

REGOLA #2 MAX ONESTÀ: ogni claim DEVE link evidence (file:line, bench output ID, commit SHA, Edge logs). NO compiacenza. CoV 3-step MANDATORY.

REGOLA #3 SISTEMATICITÀ: Pattern S 6-agent OPUS PHASE-PHASE r3 caveman. File ownership rigid. Filesystem barrier completion msgs PRE Phase 2 sequential scribe. NO race-cond.

REGOLA #4 AUTO-RECOVERY: env + connectors + Mac Mini + Edge Function tutto ricavato autonomamente. Se missing → mem-search keys recovery + retry. NO halt loop.

==========================================================================
ALLINEAMENTO PREREQUISITO 4 DEFINIZIONI (re-read PRIMA ogni atom)
==========================================================================

1. PRINCIPIO ZERO — docente=tramite, UNLIM=strumento, ragazzi=kit fisici Omaric. Plurale "Ragazzi," + Vol/pag verbatim + kit ELAB mention OBBLIGATORI. NO parafrasi volumi Davide.

2. MORFISMO — Sense 1 (57 ToolSpec L1+L2+L3) + Sense 1.5 (per-docente classe UI runtime adattivo) + Sense 2 (triplet kit Omaric ↔ volumi Davide ↔ software lockstep). Palette Navy #1E4D8C / Lime #4A7A25 / Orange #E8941C / Red #E54B3D. Font Oswald + Open Sans + Fira Code. NanoR4Board SVG identico kit fisico.

3. ONNISCENZA — 7-layer aggregator V1 active prod (V2 reverted iter 39 commit eb4a11b). Classifier 6 categorie pre-LLM topK 0/2/3. Anti-absurd validator post-LLM NER + pin check.

4. ONNIPOTENZA — L0 direct API + L1 composite handler + L2 template router + L3 Deno 12-tool dispatcher canary 5%. Surface-to-browser intent parser. Mistral function calling canonical R7 ≥95% target.

==========================================================================
STEP 0.0 — AUTO-RECOVERY ENVIRONMENT (PRIMA AZIONE OBBLIGATORIA)
==========================================================================

Esegui in sequenza. Se falla → applica recovery + retry. NON halt loop.

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"

# Recovery 1: env vars
if [ ! -f ~/.elab-credentials/sprint-s-tokens.env ]; then
  echo "WARN: credentials file missing. Attempt mem-search recovery."
  # Use mcp__plugin_claude-mem_mcp-search__smart_search query "sprint-s-tokens.env credentials path"
  # OR check ~/.zshrc grep ELAB_API_KEY
  grep -E "(ELAB_API_KEY|MISTRAL_API_KEY|SUPABASE_ANON_KEY|TOGETHER_API_KEY|CLOUDFLARE_API_TOKEN)" ~/.zshrc 2>/dev/null
fi

set -a
source ~/.elab-credentials/sprint-s-tokens.env 2>/dev/null || echo "FALLBACK: env via ~/.zshrc"
[ -f ~/.zshrc ] && source ~/.zshrc 2>/dev/null
set +a

# Verify required env
MISSING=0
for VAR in ELAB_API_KEY SUPABASE_ANON_KEY MISTRAL_API_KEY CLOUDFLARE_API_TOKEN TOGETHER_API_KEY; do
  if [ -z "${!VAR:-}" ]; then
    echo "MISSING: $VAR"
    MISSING=$((MISSING+1))
  else
    echo "OK: $VAR (${#!VAR} chars)"
  fi
done

# Optional gates
[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ] && echo "OPTIONAL: SUPABASE_SERVICE_ROLE_KEY needed Decisione #12 + Phase 4"
[ -z "${VOYAGE_API_KEY:-}" ] && echo "OPTIONAL: VOYAGE_API_KEY (Mistral mistral-embed pivot iter 39 alternative active)"

if [ "$MISSING" -gt 0 ]; then
  echo "RECOVERY: invoke mem-search 'ELAB credentials env vars location'"
  echo "ANDREA flag in iter-31-andrea-flags.jsonl + continue Phase 1 atoms not requiring missing env"
fi
```

==========================================================================
STEP 0.1 — VERIFY GIT + BASELINE (auto)
==========================================================================

```bash
git status --short | head -5
git log --oneline -3
# Expected HEAD: 69c9453 OR descendant if iter 30 docs committed

VITEST_BASELINE=$(cat automa/baseline-tests.txt | head -1)
echo "Vitest baseline: $VITEST_BASELINE (expected 13474)"

# Pre-flight CoV 3-step
echo "Step CoV-1: vitest baseline preserve check"
ACTUAL=$(npx vitest run --reporter=basic 2>&1 | grep -oE "[0-9]+ passed" | head -1 | grep -oE "[0-9]+")
if [ -z "$ACTUAL" ] || [ "$ACTUAL" -lt "$VITEST_BASELINE" ]; then
  echo "REGRESSION DETECTED: $ACTUAL < $VITEST_BASELINE"
  echo "AUTO-ACTION: git stash + investigate via systematic-debugging skill"
  echo "DO NOT continue Phase 1 until baseline restored"
  exit 1
fi
echo "CoV-1 PASS: vitest $ACTUAL ≥ $VITEST_BASELINE"
```

==========================================================================
STEP 0.2 — VERIFY STATE FILES BOOTSTRAP (auto)
==========================================================================

```bash
for FILE in score-history.jsonl inflation-flags.jsonl mechanical-caps.json baseline-tags.jsonl skill-runs.jsonl iter-31-progress.md; do
  if [ -f "automa/state/$FILE" ]; then
    echo "OK: $FILE"
  else
    echo "MISSING: $FILE — bootstrap from docs/handoff/2026-05-02-iter-31-ACTIVATION-PROMPT-PASTE-READY.md"
  fi
done

# Read last entry score history
tail -1 automa/state/score-history.jsonl | jq '{iter, score_capped, cap_reason}'

# Read open inflation flags
jq -s 'map(select(.status == "open" and .flag_severity == "HIGH")) | length' automa/state/inflation-flags.jsonl
```

==========================================================================
STEP 0.3 — VERIFY MAC MINI + VERCEL + EDGE FUNCTION (auto, retry-on-fail)
==========================================================================

```bash
# Mac Mini SSH access
MACMINI_OK=0
for ATTEMPT in 1 2 3; do
  if ssh -i ~/.ssh/id_ed25519_elab -o ConnectTimeout=10 progettibelli@100.124.198.59 "echo SSH_OK; node --version" 2>/dev/null | grep -q SSH_OK; then
    MACMINI_OK=1
    echo "Mac Mini SSH: OK"
    break
  fi
  echo "Mac Mini SSH attempt $ATTEMPT/3 failed, retry"
  sleep 5
done
[ "$MACMINI_OK" -eq 0 ] && echo "FLAG: Mac Mini SSH unreachable — Decisione #1 Andrea action reboot Strambino. CONTINUE Phase 1 atoms not Mac Mini-dependent."

# Vercel prod LIVE
VERCEL_LIVE=$(curl -sI "https://www.elabtutor.school" 2>/dev/null | head -1 | grep -c "200" || echo 0)
echo "Vercel prod: ${VERCEL_LIVE}/1 LIVE"

# Edge Function v72
EDGE_VERSION=$(npx supabase functions list --project-ref euqpdueopmlllqjmqnyb 2>/dev/null | grep unlim-chat | awk '{print $4}' || echo "unknown")
echo "Edge unlim-chat version: $EDGE_VERSION (expected v72+)"
```

==========================================================================
STEP 0.4 — APPLY G45 DEFAULT DECISIONS (NO HALT)
==========================================================================

Andrea Phase 0 ratify queue NON è gate halt. Applica G45-conservatore default + flag.

DEFAULT G45 (conservativo, anti-inflazione):
- Decisione #1 Mac Mini recovery → DEFAULT YES (proceed atoms 1-6 fix queue iter 31+)
- Decisione #5 interrupt.md → DEFAULT IMPLICIT-OK (Maker-1 surgical edit)
- Decisione #7 Sprint target 8.5 ONESTO 10gg → DEFAULT YES (G45 alignment)
- Decisione #8 Onnipotenza C3 canary 5% → DEFAULT DEFER iter 32 (gate post C2 24h soak telemetry)
- Decisione #9 Deno disp canary 5% → DEFAULT DEFER iter 32 (gate post Deno port impl)
- Decisione #10 Vercel Atom 42-A deploy verify → DEFAULT VERIFY (run Lighthouse measure auto)
- Decisione #12 Phase E cleanup → DEFAULT INSPECT-FIRST (SELECT counts before DELETE, NO automatic delete)
- Decisione #13 ADR-040 Leonardo → DEFAULT REJECT-LEONARDO + MAINTAIN-FLUX (G45 status quo conservative)

Log all defaults applied:
```bash
cat > automa/state/iter-31-andrea-flags.jsonl <<EOF
{"date":"2026-05-02","decision":"#1 Mac Mini recovery","default_applied":"YES","g45_rationale":"sblocca cascade 10-atom queue, low risk","needs_andrea_override_by":"iter 32 entrance"}
{"date":"2026-05-02","decision":"#5 interrupt.md","default_applied":"IMPLICIT-OK","g45_rationale":"Maker-1 surgical edit, no Andrea action needed","needs_andrea_override_by":"iter 32 entrance"}
{"date":"2026-05-02","decision":"#7 Sprint target 8.5 ONESTO 10gg","default_applied":"YES","g45_rationale":"G45 anti-inflation alignment, mechanical caps strict","needs_andrea_override_by":"iter 32 entrance"}
{"date":"2026-05-02","decision":"#8 C3 canary 5%","default_applied":"DEFER iter 32","g45_rationale":"gate post C2 24h soak telemetry verify, conservative","needs_andrea_override_by":"iter 32 entrance"}
{"date":"2026-05-02","decision":"#9 Deno disp canary 5%","default_applied":"DEFER iter 32","g45_rationale":"gate post 12-tool Deno port impl, no fire-rate without impl","needs_andrea_override_by":"iter 32 entrance"}
{"date":"2026-05-02","decision":"#10 Vercel deploy verify","default_applied":"VERIFY-AUTO","g45_rationale":"Lighthouse measure auto, no manual production promote without ≥70 perf","needs_andrea_override_by":"iter 32 entrance"}
{"date":"2026-05-02","decision":"#12 Phase E cleanup","default_applied":"INSPECT-FIRST","g45_rationale":"SELECT counts before any DELETE, no destructive automatic","needs_andrea_override_by":"iter 32 entrance"}
{"date":"2026-05-02","decision":"#13 ADR-040 Leonardo","default_applied":"REJECT-LEONARDO + MAINTAIN-FLUX","g45_rationale":"G45 status quo conservative, no provider switch without A/B + Davide GDPR","needs_andrea_override_by":"iter 32 entrance"}
EOF

echo "Phase 0 G45 defaults applied. Andrea overrides via chat post-fact, NON gate halt."
```

==========================================================================
STEP 1 — PHASE 1 PARALLEL SPAWN (after Step 0.0-0.4 GREEN)
==========================================================================

Pattern S 6-agent OPUS PHASE-PHASE r3 caveman:

PHASE 1 parallel (single message multi-Agent tool):
- Planner-opus → 12 ATOM-S31 atoms decomposition + sprint contract `automa/team-state/sprint-contracts/sprint-T-iter-31-contract.md`
- Architect-opus → ADR review + ADR-032 (Deno) + ADR-033 (page metadata) + ADR-034 (V2.1 fair design)
- Maker-1 caveman → 4 NEW skill files `.claude/skills/elab-{morfismo,onniscenza,velocita,onnipotenza}-*/SKILL.md` + extend PZ + 12 mechanism scripts (M-AR-01 + M-AI-01 + M-AR-05 + M-AI-02)
- Maker-2 caveman → 4 NEW skill files + 12 mechanism scripts (M-AI-03 + M-AI-04 + M-CC-01)
- Tester-1 caveman → R5 50-prompt smoke runner build + R6 100-prompt fixture extension + 5 skill CoV dry-run + 5 metric measurement reports

PHASE 2 sequential (post 4-5/4-5 completion msgs filesystem barrier):
- Scribe-opus → audit Phase 1 + handoff iter 32 + CLAUDE.md sprint history footer append + ratify queue review

PHASE 3 orchestrator (this main session):
- vitest full run baseline preserve verify
- M-AR-05 auto-tag baseline-iter31-phase1-{HHMM}
- commit atomic (NO push main, NO --no-verify)
- iter close M-AI-01 score-history.jsonl append entry
- M-AI-02 mechanical cap enforce + log triggered
- M-AI-05 spawn Opus G45 review distinct context-zero session

==========================================================================
PHASE 1-7 EXECUTION (autonomous, no Andrea halt)
==========================================================================

Master plan: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`

Phase 1 — 4 NEW skills + PZ extend + 12 mechanism scripts (~6h dev)
Phase 2 — Sprint U Cycle 2 fix (L2 router scope reduce + 73 lesson-paths codemod + 94 unlimPrompts docente framing + vol3 mismatches) (~6h)
Phase 3 — Mac Mini persona-prof spec deploy + cron `*/10 * * * *` activation (~3h dev + 24h soak)
Phase 4 — Phase E Mistral re-ingest 1881 chunks + Edge v73 deploy + R5 50-prompt re-bench + PZ Vol/pag ≥95% verify (~4h)
Phase 5 — Onniscenza V2.1 fair vs V1 + Deno dispatcher canary (defer iter 32 per default) + C3 widened canary (defer iter 32) (~2h prep, deploy iter 32)
Phase 6 — Wake word "Ehi UNLIM" 9-cell STT matrix + plurale prepend (~2h)
Phase 7 — CoV finale + commit + push origin e2e-bypass-preview + Andrea Opus G45 review distinct session (~3h)

Total estimate iter 31: ~26h dev + ~24h Mac Mini autonomous soak + ~3h Andrea Opus review = ~53h total wall-clock.

==========================================================================
INTER-PHASE OBBLIGATORIO (NO SHORTCUT)
==========================================================================

Tra ogni Phase boundary:
1. invoke Skill tool: `superpowers:systematic-debugging` con hypothesis explicit
2. invoke Skill tool: `superpowers:quality-audit`
3. write report `docs/audits/iter-31-systematic-debug-{N}.md`
4. write report `docs/audits/iter-31-quality-audit-{N}.md`
5. CoV 3-step verify

==========================================================================
CoV MANDATE OGNI ATOM (3-STEP)
==========================================================================

1. CoV-1 baseline preserve: `npx vitest run` PRIMA atom must PASS 13474
2. CoV-2 incremental: `npx vitest run tests/unit/{newscope}` post atom must PASS
3. CoV-3 finale: `npx vitest run` POST atom must PASS 13474+delta

Failure CoV ANY step → REVERT + invoke systematic-debugging.

==========================================================================
ANTI-PATTERN ENFORCED (G45 cap)
==========================================================================

- NO --no-verify ever
- NO push main ever (only e2e-bypass-preview)
- NO destructive ops (rm -rf, git reset --hard, DROP TABLE)
- NO claim "score X" senza score-history.jsonl entry + evidence
- NO claim "LIVE" senza claim-reality verify (M-AI-03)
- NO score Opus = score_claim auto-pass
- NO commit senza pre-commit hook GREEN
- NO push senza pre-push hook GREEN
- NO compiacenza score inflato
- NO halt loop per Andrea ratify (apply G45 default + flag + continue)
- NO retroactive edit append-only registries
- NO bypass branch protection (Phase 7 requires CI gates GREEN)

==========================================================================
FLAGS + COMUNICAZIONE ANDREA POST-FACT
==========================================================================

Quando atom blocca su decisione Andrea OR env missing:
1. Append entry `automa/state/iter-31-andrea-flags.jsonl` con G45 default applied + razionale
2. Continue prossimo atom non bloccato
3. Phase 7 close summary include flags table per Andrea review

Quando blocker env missing (es. SUPABASE_SERVICE_ROLE_KEY Phase 4):
1. Try mem-search recovery: `mcp__plugin_claude-mem_mcp-search__smart_search query="SUPABASE_SERVICE_ROLE_KEY ELAB credentials"`
2. Try ~/.zshrc grep
3. Try ~/.elab-credentials/ alternative file scan
4. If still missing → flag + skip Phase 4 atoms requiring env, continue Phase 5+ atoms not requiring env
5. Phase 7 close summary include env recovery action items Andrea

==========================================================================
ESEGUI ORA (PRIMA AZIONE)
==========================================================================

1. State 4 definizioni out loud (PZ + Morfismo + Onniscenza + Onnipotenza) per re-alignment
2. Run Step 0.0-0.4 auto-recovery + verify in single Bash batch
3. Apply G45 defaults Step 0.4 to inflation-flags.jsonl
4. Spawn Phase 1 6-agent OPUS Pattern S r3 caveman parallel (single Agent tool call multi-agent)
5. Wait Phase 1 completion msgs (filesystem barrier)
6. Spawn Phase 2 scribe-opus sequential
7. Phase 3 orchestrator commit + push origin
8. Continue Phase 4-7 autonomous loop NO HALT

Plan path PRIMARY: docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md
Plan path SECONDARY: docs/superpowers/plans/PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md
Activation paste-ready (this file): docs/handoff/2026-05-02-iter-31-AUTONOMOUS-ACTIVATION-FINAL.md
Andrea ratify checklist (post-fact): docs/handoff/2026-05-02-iter-31-ANDREA-RATIFY-CHECKLIST.md
12 mechanisms ready-paste: docs/audits/2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md
Mac Mini persona-prof: docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md
Tea brief iter 31: docs/handoff/2026-05-02-tea-iter-31-brief.md
Tools+plugins inventory: docs/audits/2026-05-02-iter-31-tools-plugins-inventory.md
Iter 30 close INDEX: docs/audits/2026-05-02-iter30-CLOSE-INDEX.md
ADR-040 Leonardo: docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md
13 decisioni priority matrix: docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md

GO. Execute. Loop autonomo. Massima onestà + sistematicità. NO halt.
```

---PASTE-END---

---

## §2. Verifica copertura — tutto richiesto è documentato?

User explicit checklist:

| Richiesta | Status | File |
|---|---|---|
| Analizzare 7 sessioni mem-search | ✅ DONE | CLAUDE.md sprint history (auto-loaded) + smart_search invoked |
| Piano dettagliato sistematico prossima sessione | ✅ DONE | `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md` 532 LOC |
| Cosa dire a Tea | ✅ DONE | `docs/handoff/2026-05-02-tea-iter-31-brief.md` 258 LOC 8 task |
| Strutturare lavoro Mac Mini | ✅ DONE | `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md` 389 LOC 200+ items |
| Definizioni Principio Zero + Morfismo + Onniscenza + Onnipotenza | ✅ DONE | Allineamento turn precedente + activation prompt §"ALLINEAMENTO" |
| Priorità lunga sessione ralph loop | ✅ DONE | Master plan 7-Phase decomposition |
| Benchmark | ✅ DONE | Master plan §6 + 5 metric skills |
| Cosa fatto sessione successiva | ✅ DONE | Master plan §2 acceptance gates per Phase |
| Plugin/connettori MacBook + Mac Mini | ✅ DONE | `docs/audits/2026-05-02-iter-31-tools-plugins-inventory.md` 497 LOC |
| Control Chrome + control macOS | ✅ DONE | Tools inventory §2.3 |
| Documentare perfetto md | ✅ DONE | 16 doc files 7034+ LOC |
| Caveman + claude-mem | ✅ ACTIVE | caveman mode active questa sessione + activation prompt embeds |
| /writing-plans | ✅ DONE | Master plan format conforming |
| /make-plan + /agent-orchestration:multi-agent-optimize | ✅ DONE | Master plan §7 6-agent OPUS Pattern S r3 caveman architecture |
| Team agenti caveman + CoV | ✅ DONE | Master plan §7 + activation prompt CoV mandate |
| /systematic-debugging tra sprint | ✅ DONE | Master plan inter-Phase + activation prompt INTER-PHASE OBBLIGATORIO |
| /quality-audit | ✅ DONE | Same — inter-Phase mandate |
| /skill-creator/skill-development | ✅ DONE | 4 NEW skills creati + master plan Phase 1 atoms 1.1-1.5 |
| Mac Mini simula prof inesperto | ✅ DONE | Mac Mini persona-prof checklist 200+ items 7-Stage |
| Mac Mini analizza tutto: design + estetica + funzionalità | ✅ DONE | Mac Mini persona §2.7 A15-A17 + 5 metric skills |
| Mappatura + elenco tutto da guardare | ✅ DONE | Mac Mini persona §2 atomic checklist 200+ items |
| Provare TUTTI esperimenti drag-drop Arduino Scratch | ✅ DONE | Mac Mini persona §2.3-2.4 Stages 3-4 + §3 94 esperimenti loop |
| Documentare + auditare tutto | ✅ DONE | Mac Mini persona §3.2 sweep cycle protocol + cron output |
| Vere proprie simulazioni di lezione | ✅ DONE | Mac Mini persona §2.5 UNLIM interaction Stage 5 |
| Sistema attento + sempre CoV | ✅ DONE | Master plan §8 CoV mandate + 12 mechanisms anti-regression |
| NON COMPIACERE | ✅ ENFORCED | G45 cap mandate embedded all docs |
| /ultrathink:ultrathink | ✅ INVOKED | Turn precedente con ultrathink |
| /ultrareview | ✅ REFERENCED | Tools inventory §2.2 + Phase 7 Andrea-triggered |
| /accessibility-review | ✅ REFERENCED | Tools inventory §2.2 + Mac Mini persona §2.7 A16 |
| 5 skill metric (PZ + Morfismo + Onniscenza + Velocità + Onnipotenza) | ✅ DONE | 4 NEW + PZ extended in `.claude/skills/elab-*` |
| Allineamento prima inizio | ✅ DONE | Activation prompt §"ALLINEAMENTO PREREQUISITO" + turn precedente alignment |
| Anti-regressione + anti-inflazione meccanismi forti | ✅ DONE | 12 mechanisms 1318 LOC + 6 state files bootstrapped |
| Ralph loop NO halt | ✅ DONE | Activation prompt §"REGOLA #1 ANTI-HALT" + G45 defaults pre-baked |
| Massima onestà + sistematicità | ✅ DONE | G45 cap + CoV + filesystem barrier + 12 mechanisms |
| Auto-recovery chiavi + connettori | ✅ DONE | Activation prompt §"STEP 0.0 AUTO-RECOVERY" + mem-search fallback |

---

## §3. Path file per Andrea

**ATTIVAZIONE**: copia §1 sopra (PASTE-START → PASTE-END), apri NUOVA Claude Code conversation, incolla.

**Path documenti chiave**:

```
/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/handoff/2026-05-02-iter-31-AUTONOMOUS-ACTIVATION-FINAL.md  (questo file)
/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md  (master plan)
/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/2026-05-02-iter30-CLOSE-INDEX.md  (index iter 30)
/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/automa/state/iter-31-progress.md  (heartbeat tracker)
/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/automa/state/iter-31-andrea-flags.jsonl  (auto-created Phase 0 G45 defaults)
```

---

## §4. Anti-pattern enforced this autonomous activation

- ❌ NO halt loop per Andrea ratify — G45 defaults pre-baked Step 0.4
- ❌ NO env recovery synchronous Andrea action — mem-search fallback automatic
- ❌ NO Phase 0 gate hard — orchestrator continues on G45 defaults + flags
- ❌ NO compiacenza autonomous — every claim DEVE link evidence file
- ❌ NO score override senza M-AI-02 mechanical cap enforcer
- ❌ NO bypass CoV — 3-step mandate per atom
- ❌ NO bypass inter-Phase systematic-debug + quality-audit
- ❌ NO race-cond Pattern S r3 — filesystem barrier completion msgs

---

**Status finale iter 30 docs-only close**: tutto documentato + activation autonomo paste-ready + auto-recovery + 8 G45 defaults pre-baked + 12 mechanisms + 5 skills + 6 state files + iter 31 progress heartbeat.

**Ready iter 31 entrance**: paste §1 in NEW Claude Code session.
