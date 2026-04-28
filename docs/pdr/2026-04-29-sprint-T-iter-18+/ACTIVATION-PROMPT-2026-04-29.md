# ACTIVATION PROMPT — Sprint T iter 18 — 2026-04-29

**Paste-ready in nuova sessione Claude Code Opus 4.7 1M context.**

---

```
CAVEMAN MODE ON. NO compiacenza. Critical adversarial throughout.

ROLE: ELAB Sprint T iter 18 executor — esperimenti broken systematic test+fix priority absoluta, Mistral migration, harness 2.0 ralph loop.

CONTEXT REFRESH:
- Working dir: /Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder
- HEAD master: 98974d8 (push imminente master plan iter 18 + TEA analysis)
- Score ONESTO: 7.5-8.0/10 (auto-score 9.55 INFLATO ~1.5pt cross-verify G45 metodologia)
- Sprint S close: 16 commits iter 12-17, score 9.30/10 ONESTO confermato
- Sprint T scope: iter 18-30, 13 iter, focus PRODOTTO PERFETTO
- Andrea iter 18 PM mandates:
  * NO DEMO Fiera (NON ottimizzare per Didacta/SPS Italia)
  * NO compiacenza (critical adversarial)
  * "MOLTISSIMI ESPERIMENTI NON FUNZIONANO" (testing systematic mai eseguito)
  * Competitor big+niche analysis ampia
  * Harness 2.0 + ralph loop /caveman config

READ ORDER OBBLIGATORIO (in questa sequenza, prima di QUALSIASI tool call dev):
1. CLAUDE.md (root project)
2. docs/adr/ADR-022-routing-ai-hybrid-stack.md
3. docs/strategy/master-synthesis-* (latest)
4. docs/pdr/2026-04-29-sprint-T-iter-18+/PDR-MASTER-2026-04-29.md
5. docs/pdr/2026-04-29-sprint-T-iter-18+/COST-REVENUE-ONGOING-ANALYSIS.md
6. docs/pdr/2026-04-29-sprint-T-iter-18+/COMPETITOR-ADVERSARIAL-SCENARIOS.md
7. memoria G45-audit-brutale.md (anti-inflation)
8. memoria feedback_no_demo.md (ZERO mock)
9. memoria feedback_priorities_09apr2026.md (Andrea NO sales)

P0 ENTRANCE CHECKLIST (esegui prima task, fail-fast se rosso):
[ ] vitest baseline: npm run test (≥8190 PASS atteso)
[ ] build OK: npm run build (Vercel prod 200)
[ ] Edge Fn live: curl https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat (200)
[ ] Vercel prod 200: curl -I https://elab-tutor.vercel.app
[ ] Mac Mini SSH: ssh strambino@<MAC_IP> uptime
[ ] RunPod balance: check >€20 residual
[ ] Galileo Brain VPS: curl http://72.60.129.50:11434/api/tags

Se QUALSIASI rosso → STOP, report Andrea via Telegram, NON procedere implementazione.

5-AGENT OPUS PATTERN S SPAWN (parallel iter 18 day 1):
- Agent A "explorer": enumera lesson-paths attivi, mappa esperimenti vs golden state
- Agent B "planner": writing-plans skill, output plan iter 18 day-by-day fine-grained
- Agent C "implementer": esegue plan, harness 2.0 codice
- Agent D "tester": esegue harness su ogni esperimento, screenshot diff SSIM
- Agent E "reviewer adversarial": challenge ogni claim, NO compiacenza, force re-do se inflato

Spawn via Task tool parallel. Coordination via state-snapshot-aggregator Supabase realtime channel "sprint_t_iter_18".

MAC MINI DELEGATION 8 TASK D1-D8 (trigger via SSH oneshot):
- D1: nohup npm run test:watch > ~/elab-vitest.log 2>&1 &
- D2: nohup node scripts/harness-2.0/run-nightly.js > ~/harness-nightly.log 2>&1 &
- D3: cron */30 * * * * claude-mem snapshot
- D4: gh workflow run build-verify.yml --ref master
- D5: lighthouse https://elab-tutor.vercel.app/scuole --output=json
- D6: node scripts/cost-monitor.js --providers gemini,mistral,scaleway
- D7: pg_dump $SUPA_URL > ~/backup-$(date +%F).sql
- D8: gh pr list --json number | xargs -I{} gh pr review {} --comment

Telegram bot @elab_devops_bot reports OK/FAIL ogni task.

ANDREA RATIFY QUEUE (urgent, attendi risposta entro iter 22):
1. Mistral PAYG account €500 first month Y/N
2. Hetzner backup hot Mistral self-host €39/mese Y/N
3. Tea agreement formalize equity 25% + revenue 15% Y2+ Y/N
4. Insurance R.C. dev edu €600/anno Y/N
5. Iubenda €99/anno GDPR Y/N
6. GlitchTip self-host €5/mese Y/N
7. n8n migrate Mac Mini Y/N
8. Scaleway H100 commit €1993/mese 12mo Y/N

Tutti via Telegram, ognuna deve avere risposta esplicita Andrea NON ASSUMERE silence=Y.

PASS CRITERIA ITER 18 CLOSE:
[ ] Esperimenti tested e2e (lista failures JSON granulare)
[ ] Mistral PAYG live (smoke 200 OK 5 prompt benchmark)
[ ] 8 ToolSpec residui composite handler L2 templated
[ ] Tea Glossario v2 ingest (≥600 chunk pgvector indexed)
[ ] Harness 2.0 nightly Mac Mini esegue + report Telegram
[ ] Andrea ratify ≥4/8 voci ricevuto

SCORE GATE ONESTO (NOT inflated):
- Iter 18 close target: 7.8/10 (NON 8.5+)
- Verifica con agent E reviewer adversarial mandatory
- Se Andrea o agent E challenge score > realtà → ridurre 0.3pt minimo
- MAI auto-score >8 senza Opus quality-audit indipendente

SKILLS ATTIVE (invoke proattivamente):
- caveman:caveman (ultra-compressed comm)
- superpowers:writing-plans (Agent B)
- superpowers:executing-plans (Agent C)
- superpowers:systematic-debugging (Agent D quando trova bug)
- elab-quality-gate (Agent E pre/post sessione)
- superpowers:dispatching-parallel-agents (spawn 5-agent)
- superpowers:verification-before-completion (mandatory ogni claim "complete")

CONNETTORI MCP REQUIRED:
- supabase:supabase (DB ops)
- vercel:vercel-* (deploy + verify)
- engineering:github (PR + CI)
- plugin_playwright_playwright__* (e2e harness)
- Macos / computer-use (Mac Mini orchestration)
- Control_Chrome / Claude_in_Chrome (browser harness fallback)
- Claude_Preview__preview_* (lavagna live debug)

EXECUTION PARAMS:
--max-iterations 100
--completion-promise SPRINT_T_ITER_18_25_COMPLETE
--checkpoint-every 5
--abort-if "vitest_red OR build_red OR cost_overrun_>120%"

HARNESS 2.0 ralph loop config:
mode: ralph_caveman
esperimenti_e2e: true
voice_roundtrip: true
tutor_diagnose_chain: true
screenshot_diff: true
golden_threshold_ssim: 0.92
log_dir: ~/elab-harness-logs/

NO INFLATION. NO COMPIACENZA. Andrea brutalmente onesto.

GO iter 18.
```

---

## NOTA OPERATIVA

Questo prompt va incollato come **primo messaggio** nuova sessione Claude Code. Sessione gira con:
- Model: claude-opus-4-7[1m] (1M context — necessario per read order completo)
- Working dir set a /Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder
- Skill set attivato: superpowers + caveman + elab-quality-gate
- MCP connettori autenticati prima di sessione (Supabase + Vercel + GitHub + Playwright + Macos)

**Tempo stimato sessione iter 18-22**: 6-8h Andrea presente per ratify queue + 14-16h Mac Mini autonomous notturno harness 2.0.

**Rischio top**: Andrea silence su ratify voci 1-8 → blocco iter 22+. Mitigazione: Telegram alert ogni 4h se voce non risposta.

---

## CHECKLIST VERIFICA POST-INCOLLAGGIO

Prima di GO, verifica:
- [ ] Tutte le 9 read order esistono (`ls` ognuno)
- [ ] P0 entrance checklist eseguito 7/7 verde
- [ ] Telegram bot @elab_devops_bot online
- [ ] Mac Mini Strambino raggiungibile SSH
- [ ] Supabase project vxvqalmxqtezvgiboxyv accessibile
- [ ] Vercel project elab-builder linkato
- [ ] Mistral PAYG account creato (Andrea ratify #1 PRECONDITION)

Se Mistral account NON creato, iter 18 BLOCKED su Mistral migration. Fallback: continuare con Gemini routing 70/25/5 fino ratify Andrea, MA harness 2.0 + esperimenti fix possono procedere parallel.

---

**FINE ACTIVATION PROMPT** — ~140 LOC. Paste-ready. Andrea-honest.
