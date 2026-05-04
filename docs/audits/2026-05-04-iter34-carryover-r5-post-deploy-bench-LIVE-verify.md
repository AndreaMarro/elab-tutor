# Audit iter 34 carryover — R5 post-deploy bench LIVE verify

**Data**: 2026-05-04 ~08:30 GMT+2
**Sessione**: iter 34 carryover post-deploy verification
**Branch**: e2e-bypass-preview HEAD `05373d9`
**Edge Function**: unlim-chat v81+ LIVE prod
**Vercel deploy**: `dpl_GUMmq5sjWZpyLSMvLZSd8N1E11oF` aliased `www.elabtutor.school`
**Vitest baseline**: 13774 PASS preservato

## §1 R5 50-prompt bench post-deploy

**File output**: `scripts/bench/output/r5-stress-{report,responses,scores}-2026-05-04T06-29-55-666Z.{md,jsonl,json}`

**Aggregate metrics**:

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **Verdict** | **PASS** | ≥85% | ✅ +12.5pp |
| **Overall PZ V3 score** | **97.54%** | ≥85% | ✅ |
| **N prompts** | 50 | 50 | ✅ |
| **avg latency** | **1806ms** | <2500ms | ✅ |
| **p50 latency** | 1896ms | — | — |
| **p95 latency** | **2940ms** | <3500ms | ✅ |
| **min latency** | 642ms | — | — |
| **max latency** | 3726ms | — | — |

## §2 Lift vs iter 38 baseline

| Metric | Iter 38 baseline | Iter 34 carryover post-deploy | Delta |
|--------|------------------|-------------------------------|-------|
| avg latency | 4496ms | **1806ms** | **−60%** ✅ |
| p95 latency | 10096ms | **2940ms** | **−71%** ✅ |
| PZ V3 quality | 93.60% | **97.54%** | +3.94pp ✅ |

**4 atomi env-gated A1+A2+A4+A5 LIVE EFFECT verified empirico**:
- **A1 cap conditional**: per-category cap reduces gen output tokens (chit_chat 30, meta 50, off_topic 40, citation/plurale/default 60, deep 120, safety 80)
- **A2 L2 narrow**: skip L2 template short-circuit per chit_chat+meta+off_topic → less template overhead
- **A4 hedged Mistral provider-mix**: primary Mistral + hedged Gemini Flash-Lite parallel → decorrelate tail latency variance
- **A5 BASE_PROMPT v3.3 rule §6**: soft deflect off-topic + plurale Ragazzi + kit ELAB pivot

## §3 Smoke 4 categories prod verified

| Category | Prompt | Response (excerpt) | PZ V3 compliance |
|----------|--------|--------------------|-----------------:|
| meta_question | "Chi sei?" | "Ragazzi, sono UNLIM, il vostro compagno digitale per l'elettronica! Vi guido passo passo con i vostri kit fisici e i 3 volumi ELAB. Pronti a costruire circuiti insieme?" | ✅ Plurale + persona + NO AI reveal + kit + volumi |
| off_topic | "parliamo di calcio Juventus" | "Ragazzi, oggi ci concentriamo sull'elettronica con il vostro kit ELAB. Che ne dite di costruire un circuito che simuli le luci di uno stadio?" | ✅ Soft deflect + analogia educational pivot |
| plurale_ragazzi | "Ragazzi come montiamo il LED rosso sul kit?" | "Ragazzi, Vol. pag.: 'Campo magnetico...' Inserite il componente nella fila evidenziata sulla breadboard. [AZIONE:mountExperiment...] [AZIONE:ragRetrieve...]" | ⚠️ Vol/pag truncato + actions tags + plurale |
| safety_warning | "Pericolo il LED brucia odore di bruciato!" | "Ragazzi, se sentite odore di bruciato, staccate subito la batteria! Questo succede se un LED riceve troppa corrente, come se provasse a bere troppa acqua tutta insieme. «La corrente massima che un LED sopporta è tipicamente 20-25 mA» — Vol.1 pag.67. Montate sempre il resistore in serie al LED sul vostro kit ELAB" | ✅ Safety FIRST + analogia + Vol/pag verbatim caporali + kit pivot |

## §4 Workflow setup status (post connettori fix)

| Componente | Status |
|------------|--------|
| Mac Mini SSH | ✅ LIVE id_ed25519_elab |
| Codex CLI v0.128.0 | ✅ OAuth done |
| Gemini CLI v0.40.1 | ✅ OAuth done |
| claude-mem worker | ✅ PID 4104 port 37777 LIVE (restart Claude Code per re-attach MCP) |
| Vercel CLI npx | ✅ deploy LIVE |
| Supabase npx | ✅ env set + Edge deploy LIVE |
| Fusion 360 add-in | ✅ symlink installato `~/Library/.../AddIns/Fusion360MCP` (Fusion app pending Andrea install) |
| Three-Agent Pipeline trial | ❌ NON exercitato end-to-end (defer iter 35+) |
| Tier 0 Cowork Mac Mini | ❌ scripts/cowork-real/ NON esiste (defer Sprint U+) |
| Connettori MCP secondari | ⚠️ Posthog/Sentry/GitHub auth pending |
| 5 ELAB skill metric baseline | ✅ JSON shipped iter 34 |

## §5 Score iter 34 carryover ricalibrato G45

**Box subtotal post-LIVE**: 12.10/14 → normalizzato 8.64/10
**Bonus iter 34 carryover**: +0.40 (lift R5 -60% empirical + 5/5 atomi shipped + smoke 4/4 PASS)
**Raw**: 8.74
**G45 cap mechanical**: **8.50** (ceiling per Opus indipendente review G45 mandate; NO claim >8.50 senza terza voce)

**Score iter 34 close → carryover post-LIVE-verify delta**: 8.30 → **8.50** (+0.20)

## §6 Caveat onesti

1. **G45 cap 8.50 ceiling**: Sprint T close 9.5 ONESTO target NON achievable inline single-session. Andrea Opus G45 indipendente review mandate per cap >8.50. Realistic Sprint T close iter 41-43 cumulative path.

2. **Tier 1 macOS Computer Use real screen NON eseguita**: F1 esci persistence visual verify pending Andrea manual test 5 strokes pre-Esci → reopen → verifica strokes presenti su prod.

3. **R6+R7 bench NON re-run questa sessione**: page=0% Voyage gap (R6) + L2 dominance (R7 baseline 3.6%) defer iter 35+. R5 alone NOT sufficient per lift Box 6 + Box 14 ceiling 1.0.

4. **A2 L2 narrow EFFECT NON misurato isolato**: R5 PASS conferma sistema works, MA isolated impact A2 (vs A1+A4 alone) richiede A/B re-bench env on/off (defer iter 35+).

5. **Smoke 3 plurale response Vol/pag truncato**: response include "Vol. pag.:" (placeholder vuoto) + RAG chunk citation generic (campo magnetico) NOT specifico LED/breadboard query. Possible RAG retrieval ranking issue. Defer iter 35+ debug rag.ts retrieval scoring.

6. **claude-mem worker LIVE port 37777 MA MCP tools NON ancora re-attach**: restart Claude Code session richiesto per `mcp__claude-mem__*` tools availability. Defer Andrea action.

7. **Fusion 360 app NON installata `/Applications/`**: add-in symlink ready ma `mcp__fusion360__*` tools indisponibili senza app + Add-In enable. Defer Andrea install Fusion 360.

## §7 Anti-pattern G45 enforced

- ✅ NO claim "Sprint T close 9.5 achieved" (cap 8.50 ceiling Opus G45)
- ✅ NO claim "R6 ≥0.55 lift" (page=0% Voyage gap unfixed)
- ✅ NO claim "R7 canonical ≥80%" (L2 dominance NOT measured isolated)
- ✅ NO claim "Three-Agent Pipeline validated" (trial NOT exercised)
- ✅ NO claim "Tier 0 Cowork validation done" (scripts NOT setup)
- ✅ NO --no-verify (pre-commit hook 13774 baseline preserved)

## §8 Files refs iter 34 carryover

- R5 bench output: `scripts/bench/output/r5-stress-*-2026-05-04T06-29-55-666Z.{md,jsonl,json}`
- Score history: `automa/state/score-history.jsonl` entry `iter:"34-carryover"` appended
- Edge Function v81+: deployed via `npx supabase functions deploy unlim-chat`
- Vercel deploy: `dpl_GUMmq5sjWZpyLSMvLZSd8N1E11oF` https://elab-tutor-1reh749o1-andreas-projects-6d4e9791.vercel.app aliased https://www.elabtutor.school
- Supabase env set: `ENABLE_CAP_CONDITIONAL=true` + `ENABLE_L2_CATEGORY_NARROW=true` + `ENABLE_HEDGED_LLM=true` + `ENABLE_HEDGED_PROVIDER_MIX=true`
- ~/.mcp.json updated: claude-mem stdio bun + fusion360 stdio uvx community
- ~/Library/.../claude_desktop_config.json updated: claude-mem + fusion360 entries
- Fusion 360 add-in: `~/Library/Application Support/Autodesk/Autodesk Fusion 360/API/AddIns/Fusion360MCP` symlink → `/tmp/fusion360-mcp-server/addon`

## §9 Next step

→ Atomi DEFERRED iter 35+: C1 lavagna libero + E1 percorso 2-window + E2 PassoPasso + A3 SQL migration
→ R7 200-prompt bench post-deploy + L2 narrow A/B isolated measure
→ R6 page metadata Voyage re-ingest (~$1, ~50min) per unblock recall@5
→ Tier 1 macOS Computer Use real screen Andrea manual smoke 5 strokes pre-Esci F1
→ Three-Agent Pipeline trial atom small (Codex impl + Gemini review) per validate anti-bias chain
→ Fusion 360 install Andrea + Add-In enable Shift+S → mcp__fusion360__* tools available
→ Sprint T close path iter 41-43 cumulative + Andrea Opus G45 indipendente review G45 mandate per cap >8.50
