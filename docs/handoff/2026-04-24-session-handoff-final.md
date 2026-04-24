# Handoff Finale — Sessione 22-24 Aprile 2026

**Autore:** Andrea Marro (tramite Claude, max honesty)
**Data:** 2026-04-24
**Scope:** riassunto sessione, stato lavoro, history tracciabile, step prossimi, prompt per 2 routine parallele.

---

## 1. Stato TUTTO deployato?

**SÌ, verificato:**

| Metrica                        | Valore                                              |
|--------------------------------|-----------------------------------------------------|
| Deploy Vercel ultimo           | 2026-04-24T03:52Z success (run 24871304779)         |
| Sito live                      | https://www.elabtutor.school — HTTP 200 OK          |
| Main HEAD                      | `9fd04c9` feat(sprint-6-day-38): registry 42→57      |
| PR aperte                      | 0                                                   |
| Baseline test locale           | 12290                                               |
| PR mergiate ultimi 3 giorni    | 10 (#18 → #27)                                      |

**Il lavoro degli ultimi giorni è TUTTO deployato.**

## 2. History tracciabile?

**SÌ. Tre canali:**

### A. Git log main
```bash
git log main --oneline --since="2026-04-22"
```
Mostra tutti i merge commit sequenziali.

### B. PR merged list
```bash
gh pr list -R AndreaMarro/elab-tutor --state merged --limit 20
```
10 PR merged tra 2026-04-21 e 2026-04-24:
- #27 Sprint 6 Day 38 — registry 42→57 ToolSpec
- #26 Sprint 6 Day 37 — 9 OpenClaw unlim handlers
- #25 Sett 5 — OpenClaw Onnipotenza Morfica v4 spec+infra
- #24 Fix CSP SHA-256 hash inline safety script
- #23 Fix CI deploy.yml → vercel build env baked
- #22 Fix security Supabase primary + X-Elab-Api-Key
- #21 Docs audit — deep 8-week plan analysis
- #20 Fix PWA P0 stale-precache + SW hygiene
- #19 Fix stress test 4 client fixes
- #18 Sprint 3 — sett-3-stabilize-v3

### C. Docs tracciati in main
```
docs/handoff/2026-04-23-*.md              → 2 session handoff files
docs/audit/day-37-audit-2026-04-23.md     → 20-metric matrix
docs/audits/2026-04-22-*.md               → stress test + final report
docs/audits/2026-04-23-security-*.md      → secret rotation alert
docs/sunti/2026-04-23-sunto-*.md          → SUNTO session
docs/business/*.md                         → revenue model + GPU decision
docs/superpowers/plans/2026-04-23-*.md    → Sprint 6 L1 live plan (16 Task)
docs/superpowers/plans/2026-04-26-*.md    → GPU weekend benchmark
docs/superpowers/plans/2026-04-30-*.md    → agent team CLI v2
CHANGELOG.md                               → Sprint 6 entries
```

## 3. Cosa è stato fatto (22-24 aprile, brutale honest)

### Feature principali deployate

1. **OpenClaw architettura Sett 5** (PR #25)
   - 52 ToolSpec registry (poi 42 dopo fix handler path)
   - morphic-generator L1+L2+L3-flag
   - pz-v3-validator 5 locale IT prod
   - tool-memory pgvector+GC + MIGRATION_SQL
   - state-snapshot-aggregator ibrido
   - together-teacher-mode GDPR gate
   - rag-retriever MMR+metadata bonus
   - **102 test PASS OpenClaw** (scripts/openclaw/)

2. **OpenClaw Sprint 6 Day 37+38** (PR #26 + #27)
   - 9 handler unlim live (speakTTS, listenSTT, saveSessionMemory, recallPastSession, showNudge, generateQuiz, exportFumetto, videoLoad, alertDocente)
   - Registry espanso 42 → 57 ToolSpec (+15 Layer A)
   - 47 test wire handlers + 32 shape-snapshot test
   - Baseline 12220 → 12290

3. **RAG expanded** (PR #25)
   - 1849 chunks v2 dal PDF volumi (+237% da 549)
   - Dual-pass re-chunker script
   - Wiki L2 seed Karpathy three-layer (SCHEMA + 3 concepts)

4. **Bug fix Fumetto** (PR #25)
   - Silent failure → Toast feedback enum return
   - openReportWindow: ok/downloaded/no-session/no-content/error

5. **RAG prompt ibrido** (PR #25)
   - NO uso verbatim
   - Istruisce LLM a mescolare knowledge+live+memory+anchor

6. **Infra GDPR + Security** (PR #22, #25)
   - Supabase primary + X-Elab-Api-Key enforcement
   - Together AI gate 4 modi (batch/teacher/emergency/BLOCKED student)
   - Pre-commit secret scanner
   - 2 token Supabase leaked sanitizzati

7. **CI/CD + Deploy** (PR #23, #24, #20)
   - Vercel build env baked
   - CSP SHA-256 hash inline
   - PWA stale precache 3-layer safety

8. **Docs + Plans** (PR #21, #25)
   - 3 superpowers plans bite-sized TDD (Sprint 6, GPU weekend, agent team)
   - Revenue model break-even Stage 2b = 8-10 scuole
   - GPU decision framework quando sì/no
   - Autonomous airplane-safe loop doc
   - Test organization canonical

### Numeri verificabili

- **10 PR merged** in 3 giorni
- **Baseline test**: 11958 → 12290 (+332 test)
- **OpenClaw registry**: 0 → 57 ToolSpec
- **RAG chunks**: 549 → 1849 (+237%)
- **Deploy success**: ogni merge autopushato prod
- **Zero main push diretto** (disciplina branch rispettata)

## 4. Cosa NON è stato fatto (onesto)

- **Dispatcher runtime OpenClaw** (Sprint 6 Day 39): codice design, non wired in src/services/
- **Supabase migrations**: SQL presenti in codice, NON applicate staging (`openclaw_tool_memory`, `together_audit_log`)
- **Playwright E2E primo spec** (Sprint 6 Day 40): tests/e2e/ ancora 0 spec
- **Tool memory reuse live** (Sprint 6 Day 41): design solo
- **Sett-gate Sprint 6** (Day 42): pendente
- **GPU benchmark weekend**: piano scritto, mai eseguito
- **Agent team v2 8 ruoli**: plan scritto, 4 agent roadmap non implementati
- **Dashboard docente** (bug aperto, PDR #2): `src/components/dashboard/` ancora vuoto
- **Vision live E2E**: trigger ok, end-to-end non verificato

## 5. Step prossimi (secondo PDR Sprint 6)

### Day 39 — Dispatcher + PZ v3 pairing (prevista 4-6h)
- `src/services/openclaw/dispatcher.js` runtime
- PZ v3 middleware su speakTTS
- Feature flag `VITE_OPENCLAW_ENABLED`
- Test E2E integration 3 specs

### Day 40 — Playwright smoke live (prevista 2-4h)
- `tests/e2e/17-openclaw-registry-live.spec.js`
- Verifica window.__ELAB_API surface vs registry live
- Run contro https://www.elabtutor.school

### Day 41 — Tool memory live (prevista 3-5h)
- Supabase migrations apply staging
- BGE-M3 embedder integration (Together AI batch oppure stub)
- Reuse rate measure + GC cron

### Day 42 — Sett-gate Sprint 6 (prevista 1-2h)
- Retrospettiva
- Sprint 7 draft (backfill coverage + wiki expansion 3→15 concept)
- Merge tutto su main

### Weekend — GPU benchmark (prevista 4-6h)
- `docs/superpowers/plans/2026-04-26-gpu-vps-weekend-benchmark.md`
- Budget €15-25
- Vast.ai + Scaleway + Together + Hetzner trial

## 6. Debiti tecnici noti (onesto)

| Debt                                 | Severità | Mitigazione                                          |
|--------------------------------------|----------|------------------------------------------------------|
| E2E pull_request flaky 3 PR consecutive | P2    | Investigare root cause nel workflow GH               |
| Baseline drift workaround (11958 hook)  | P3    | Aggiornare hook baseline a 12290                     |
| 11 stash accumulati storicamente        | P3    | Cleanup periodico                                    |
| Worktree merged non rimossi (wireup/fumetto/watchdog) | P3 | `git worktree remove` cleanup         |
| GH Actions Sprint 6 loop DRY-RUN only   | P2    | Replace placeholder con real Claude Code CLI call    |
| Mac Mini Strambino non attivo          | P2    | Future infra, out-of-scope oggi                      |
| Dashboard docente vuoto                 | P1    | Richiede progettazione dedicata                     |
| Vision E2E non verificato               | P2    | Day 40 Playwright include verifica                  |

## 7. Cosa si può migliorare (onesto)

1. **Prompt cloud session decomposti**: ultimo prompt mega-analisi ha fallito timeout. Future prompt max 1 deliverable.
2. **Pre-commit hook baseline auto-update**: attualmente hardcoded `baseline: 11958`, dovrebbe leggere da `automa/baseline-tests.txt`.
3. **Coherence check nel CI**: aggiungere a Governance Gate.
4. **Disciplina branch auto-delete**: ogni merge dovrebbe cleanup worktree + branch locali.
5. **Documentazione prompt-template**: per evitare di ri-scrivere prompt lunghi, template fissi in `docs/prompts/templates/`.

## 8. Come risalire history in futuro

### Command quick reference

```bash
# Cosa è stato fatto giorno X
git log main --oneline --since="YYYY-MM-DD" --until="YYYY-MM-DD+1"

# Cosa contiene PR N
gh pr view N -R AndreaMarro/elab-tutor

# Cosa è stato scritto in docs/ oggi
find docs/ -type f -newer /tmp/ieri.timestamp

# Diff tra deploy corrente e commit X
git diff X..HEAD -- src/ supabase/

# Lista handoff ordinata
ls -lt docs/handoff/*.md | head -20

# Sunti di sessione
ls docs/sunti/*.md

# Audit cronologici
ls -lt docs/audits/ | head -20

# Changelog ultime 10 entry
head -50 CHANGELOG.md
```

---

# 9. Le 2 Routine Parallele Decomposte

Prompt mega-single-session ha fallito timeout ieri. Ora decompongo in **5 sessioni cloud sequenziali/parallele** per Andrea.

## Routine 1 — Super Controllo Deploy (3 sessioni)

### R1.S1 — Mappa funzionalità live (~30 min)

Branch: `feature/routine-1-supercontrollo-2026-04-24` (da creare)
Chip Desktop: repo=`elab-tutor`, branch=quel sopra

**Prompt:**

```
Ruolo: auditor prodotto, read-only.

Scope: mappatura completa versione live https://www.elabtutor.school.
Usa ricognizione browser (Playwright headless se disponibile) + ispezione codice src/.

Task 1/1: produci docs/audits/2026-04-24-deployed-feature-map.md con:
- Tutte route/pagine (hash-based, custom router)
- Tutte viste/schermate (desktop + mobile responsive)
- Tutti componenti lavagna (LavagnaShell + children)
- Tutti componenti simulator (NewElabSimulator + canvas + panels)
- Tutti componenti UNLIM (chat, mascotte, voice, report)
- Tutti toolbar + toggle + control
- Tutti flussi utente principali (onboarding, esperimento mount, chat UNLIM, voice, fumetto, export)
- Stati particolari (empty state, error state, offline, PWA stale)
- Casi limite visibili (no session, first visit, capacity limits)

Tassonomia obbligatoria:
- [LIVE] funzionalità confermata + testata
- [PARZIALE] presente ma incompleta
- [AMBIGUA] comportamento non chiaro
- [ROTTA] visibile ma fallisce
- [NASCOSTA] in codice ma non raggiungibile UI
- [DEPRECATED] presente ma non più usata

Produci SOLO docs/audits/2026-04-24-deployed-feature-map.md (~500-800 righe).
NO modifiche a src/, NO fix.
Commit atomico "docs(audit): mappa funzionalità deployate 2026-04-24".
Push.

Principio Zero v3 reminder: valuta ogni feature dal punto di vista del docente davanti alla LIM. Se un docente SENZA preparazione non capisce cosa fare in 10 secondi → flaggalo.
```

### R1.S2 — Test sistematici + audit (~45 min)

Branch: stesso

**Prompt:**

```
Ruolo: tester sistematico, read-only.

Scope: da mappa in docs/audits/2026-04-24-deployed-feature-map.md, seleziona top 30 funzionalità per severità e importanza Principio 0 v3.

Task: esegui 30 test manuali/automatici documentati + audit ogni 15 test.

Per ogni test ID T001-T030:
- Area
- Precondizioni
- Procedura (steps)
- Atteso
- Osservato
- Esito (PASS/FAIL/WARN)
- Gravità (P0/P1/P2/P3)
- Impatto Principio 0 v3
- Note

Metodi a disposizione: Playwright browser, curl, ispezione DOM, screenshot, lettura codice src/.

Ogni 15 test: ferma, produci COV audit:
- Coerenza risultati
- Aree saltate
- False positive/negative
- Pattern ricorrenti
- Violazioni Principio 0 v3 rilevate

Produci:
- docs/audits/2026-04-24-deployed-tests-T001-T015.md (primi 15)
- docs/audits/2026-04-24-deployed-tests-T016-T030.md (secondi 15)
- docs/audits/2026-04-24-deployed-cov-audit.md (2 COV + audit)

NO modifiche codice. NO fix. Solo documentazione.
Commit "docs(tests): 30 test sistematici deployed + COV".
Push.
```

### R1.S3 — Report finale deploy + branch analysis (~30 min)

Branch: stesso

**Prompt:**

```
Ruolo: product auditor senior, read-only.

Input: leggi
- docs/audits/2026-04-24-deployed-feature-map.md
- docs/audits/2026-04-24-deployed-tests-T*.md
- docs/audits/2026-04-24-deployed-cov-audit.md
- docs/superpowers/plans/2026-04-23-openclaw-sprint6-l1-live.md
- CLAUDE.md
- docs/business/revenue-model-elab-2026.md

Task 1: produci docs/audits/2026-04-24-deployed-final-report.md
Struttura:
1. Executive summary brutale
2. Stato reale prodotto
3. Mappa funzionalità sintetica
4. Test inventario
5. Problemi ordinati gravità + impatto Principio 0
6. Violazioni Principio 0 v3
7. Gap visione-doc-realtà
8. Punti forti (solo se dimostrati)
9. Fragilità + ambiguità
10. Rischi immediati + strutturali
11. Aree solide da ricontrollare
12. Aree non verificabili (dichiara perché)
13. Conclusione onesta maturità prodotto (voto 1-10)

Task 2: produci docs/audits/2026-04-24-codebase-branch-analysis.md
Analizza:
- Codebase deployata (src/ + scripts/openclaw/ + supabase/)
- Branch remote non mergeati: `git branch -r | grep -v "auto/"` (filtra rumore)
- PR merged ultimi 7 giorni
- Incroci: cosa codice mostra vs prodotto vs doc vs PDR

Identifica:
- Divergenze codice-prodotto
- Lavoro utile non integrato
- Branch promettenti da recuperare
- Codice morto
- Debiti tecnici con severità
- Feature in stallo

NO modifiche codice. NO fix.
Commit "docs(audit): final deploy report + codebase branch analysis".
Push.
```

## Routine 2 — Strategia + Decisione (2 sessioni)

### R2.S1 — Punto situazione (~30 min)

Branch: `feature/routine-2-strategia-2026-04-24`

**Prompt:**

```
Ruolo: strategic product analyst, read-only.

Input: leggi (in ordine)
- CLAUDE.md (regole immutabili)
- docs/sunti/2026-04-23-sunto-sessione-openclaw.md
- docs/handoff/2026-04-23-day-37-day-38-complete.md
- docs/handoff/2026-04-24-session-handoff-final.md
- docs/audits/2026-04-22-openclaw-plan-honest-check.md
- docs/audits/2026-04-23-security-secret-rotation-required.md
- docs/audit/day-37-audit-2026-04-23.md
- docs/business/revenue-model-elab-2026.md
- docs/superpowers/plans/2026-04-23-openclaw-sprint6-l1-live.md
- Ultimi 30 commit main: git log main --oneline -n 30

Principio 0 v3 = filtro dominante:
"Docente davanti alla LIM inizia a spiegare senza attrito, senza ambiguità, senza passaggi inutili."

Task: produci docs/audits/2026-04-24-situation-report.md

Sezioni:
1. Dove siamo davvero (stato oggettivo, no hype)
2. Priorità esplicite ultimi 3 giorni (da PR merged + ordini Andrea)
3. Priorità implicite emergenti (letture fra righe)
4. Ordini Andrea raccolti (trascrivere frasi chiave letterali)
5. Principio 0 v3 — quanto rispettato oggi (voto 1-10 + motivazione)
6. PDR 8 settimane — % completato reale
7. Errori fatti ultimi 3 giorni (da self + agent)
8. Cosa protegge davvero la visione
9. Cosa indebolisce la visione
10. 5 decisioni critiche da prendere nei prossimi 4 giorni
11. Verdetto sintetico brutalmente onesto

NO 20 piani qui. NO ricerca esterna. Solo situation report.
Commit "docs(audit): situation report 2026-04-24".
Push.
```

### R2.S2 — 5 piani concreti + ricerca (~45 min)

Branch: stesso

**Prompt:**

```
Ruolo: strategic planner senior, read-only.

Input:
- docs/audits/2026-04-24-situation-report.md (prodotto da sessione precedente)
- tutti docs/audits/2026-04-24-deployed-*.md (prodotti Routine 1)

Task 1: ricerca online mirata — 15 min max
Query:
- "Claude Max subscription best practices codebase audit 2026"
- "Anthropic claude-agent-sdk production patterns"
- "educational simulator AI tutor Principio Zero architecture"
- "GitHub Actions autonomous code review workflow 2026"
- "agentic development patterns cloud desktop Anthropic"

Fetch max 10 pagine. Estrai insight rilevanti per ELAB.

Task 2: produci docs/plans/2026-04-24-next-4-days-plan.md

5 piani differenti per prossimi 4 giorni. Per ciascuno:
- Obiettivo centrale (1 frase)
- Logica strategica
- Connessione Principio 0 v3 (chiaramente)
- Problemi da chiarire
- Materiale da analizzare
- Test/verifiche previsti
- Output documentali
- Vantaggi + limiti
- Rischi + dipendenze
- Tempo stimato (ore)
- Impatto atteso
- Coerenza Principio 0 v3 (voto 1-10)

I 5 piani DEVONO essere veramente diversi:
- Piano A conservativo (completa Sprint 6 Day 39-42 come pianificato)
- Piano B aggressivo (bypass Day 39-42, salta a dashboard docente critica)
- Piano C innovativo (GPU benchmark + Qwen locale + nuovo workflow cloud)
- Piano D difensivo (solo bug fix + stabilizzazione + no nuove feature)
- Piano E revenue-first (pausa tech, focus demo Giovanni + PNRR)

Giudizio comparativo finale onesto:
- Quale piano serve DAVVERO Andrea per i prossimi 4 giorni
- Quale ottimizza Principio 0 v3
- Quale protegge dall'errore più grande possibile

Task 3: produci docs/audits/2026-04-24-synthesis-brutale.md

Sintesi finale:
- Cosa conta davvero ADESSO
- Cosa NON va sottovalutato
- Cosa sarebbe errore fare oggi
- Una sola azione prioritaria (io decido)

NO modifiche codice. NO 20 piani (sforzo accademico sprecato).
Commit "docs(plan): 5 piani 4 giorni + sintesi brutale".
Push.
```

---

## 10. Ordine esecuzione per Andrea

### Prima di avviare routine

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"

# Crea branch Routine 1
git stash push -m "heartbeat-pre-routines"
git checkout main && git pull origin main
git checkout -b feature/routine-1-supercontrollo-2026-04-24
git push -u origin feature/routine-1-supercontrollo-2026-04-24

# Crea branch Routine 2
git checkout main
git checkout -b feature/routine-2-strategia-2026-04-24
git push -u origin feature/routine-2-strategia-2026-04-24

# Torna a main
git checkout main
git stash pop 2>/dev/null
```

### Avvia Routine 1 (3 sessioni sequenziali)

Desktop Cloud session 1:
- Chip branch: `feature/routine-1-supercontrollo-2026-04-24`
- Prompt: R1.S1 (copia-incolla sopra)
- Invio → attendi commit push ~30 min

Desktop Cloud session 2:
- Stesso branch
- Prompt: R1.S2
- Invio → ~45 min

Desktop Cloud session 3:
- Stesso branch
- Prompt: R1.S3
- Invio → ~30 min

### Avvia Routine 2 (in parallelo se budget Max permette)

Desktop Cloud session 4 (può girare parallela a R1):
- Chip branch: `feature/routine-2-strategia-2026-04-24`
- Prompt: R2.S1
- Invio → ~30 min

Desktop Cloud session 5 (dopo S4 completa):
- Stesso branch
- Prompt: R2.S2
- Invio → ~45 min

### Tempo totale

- **Sequenziale:** ~3h (R1: 1h45min + R2: 1h15min)
- **Parallelo R1+R2:** ~1h45min max (R1 è più lunga)

### Budget Max subscription

- 5 sessioni cloud ~30-45 min ciascuna
- Rate limit Max 5x/5h → sufficiente per sequenziale
- Per parallelo: rischio esaurimento, monitora banner "Limite utilizzo"

---

## 11. Al termine routine

Quando tutte 5 sessioni complete, Andrea review:

```bash
gh pr list -R AndreaMarro/elab-tutor --state open
# Mostra 2 PR: routine-1 + routine-2

# Review Routine 1 PR
gh pr view <N-routine-1> --web

# Review Routine 2 PR
gh pr view <N-routine-2> --web
```

I document prodotti saranno 8:
- docs/audits/2026-04-24-deployed-feature-map.md
- docs/audits/2026-04-24-deployed-tests-T001-T015.md
- docs/audits/2026-04-24-deployed-tests-T016-T030.md
- docs/audits/2026-04-24-deployed-cov-audit.md
- docs/audits/2026-04-24-deployed-final-report.md
- docs/audits/2026-04-24-codebase-branch-analysis.md
- docs/audits/2026-04-24-situation-report.md
- docs/plans/2026-04-24-next-4-days-plan.md
- docs/audits/2026-04-24-synthesis-brutale.md

Merge → main → deploy auto → history tracciabile.

---

## 12. Onestà finale

- Sessione 22-24 aprile **molto produttiva**: 10 PR + 332 test + RAG 1849 + wiki L2 + security fix.
- **Tutto deployato** su www.elabtutor.school.
- History **tracciabile** via git log + PR + docs.
- Step successivi **chiaramente pianificati** (Sprint 6 Day 39-42).
- Debt tecnici **documentati, non nascosti**.
- Routine decomposta **evita errore prompt mega-ambizioso** di ieri.
- Budget cloud Max **rispettato**: 5 sessioni invece di 1 impossibile.
- Coerenza Principio 0 v3: mantenuta nei prompt delle routine.

**Il tuo prossimo step: crea i 2 branch + avvia R1.S1. Tutto il resto segue.**
