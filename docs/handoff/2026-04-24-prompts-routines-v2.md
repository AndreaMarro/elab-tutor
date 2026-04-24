# Prompt Routine v2 — 6 sessioni cloud decomposte

**Miglioramenti vs v1:**
1. OGNI prompt lista TUTTI i file da leggere prima (check-in phase esplicita)
2. R2.S2 diviso in 3 sotto-sessioni (ricerca 15min + 5 piani 25min + sintesi 15min)
3. Budget timeout dichiarato in ciascun prompt
4. Stringhe attivazione in blocchi separati
5. Path unificati `docs/audits/` (plural)

**Totale: 6 sessioni cloud, ~30-45min ciascuna.**

---

## ROUTINE 1 — Super Controllo Deploy

### Setup branch (esegui tu, 2 min)

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
git stash push -m "pre-routines-$(date +%H%M)"
git checkout main && git pull origin main
git checkout -b feature/routine-1-supercontrollo-2026-04-24
git push -u origin feature/routine-1-supercontrollo-2026-04-24
git checkout main
git stash pop 2>/dev/null || true
```

---

### R1.S1 — Mappa funzionalità live (cloud, ~30 min)

**Setup Claude Desktop:**
- Nuova sessione cloud
- Chip repo: `elab-tutor`
- Chip branch: `feature/routine-1-supercontrollo-2026-04-24`

**Prompt (copia tutto blocco):**

```
Sessione 1/6 — Mappa funzionalità deployed.
Ruolo: auditor prodotto, read-only.
Budget tempo: 30 min max. Se timeout, salva parziale.

FILE DA LEGGERE PRIMA (obbligatorio, prima di azione):
1. CLAUDE.md (regole immutabili + stack)
2. src/services/simulator-api.js (API globale __ELAB_API)
3. src/components/lavagna/LavagnaShell.jsx (entry UI principale)
4. src/components/simulator/NewElabSimulator.jsx (shell simulatore)
5. src/components/unlim/UnlimOverlay.jsx (chat UNLIM)
6. src/components/unlim/UnlimReport.jsx (fumetto report)
7. src/App.jsx oppure src/main.jsx (routing custom hash)
8. docs/superpowers/plans/2026-04-23-openclaw-sprint6-l1-live.md (contesto Sprint 6)

STRUMENTI:
- Playwright headless (se cloud Desktop lo supporta)
- curl a https://www.elabtutor.school per HTML statico
- Lettura codice src/ come supporto interpretativo

SCOPE:
Mappatura completa sito live https://www.elabtutor.school.
Output: docs/audits/2026-04-24-deployed-feature-map.md (500-800 righe max).

STRUTTURA OBBLIGATORIA:
1. Route/pagine (hash-based)
2. Viste/schermate (desktop + mobile)
3. Componenti lavagna (elenco con children)
4. Componenti simulator (canvas + panels + engine)
5. Componenti UNLIM (chat + overlay + mascotte + voice + report)
6. Toolbar + toggle + control
7. Flussi utente (onboarding, esperimento mount, chat UNLIM, voice, fumetto, export)
8. Stati particolari (empty, error, offline, PWA stale)
9. Casi limite visibili

TASSONOMIA per ogni feature:
- [LIVE] confermata + testata
- [PARZIALE] presente ma incompleta
- [AMBIGUA] comportamento non chiaro
- [ROTTA] visibile ma fallisce
- [NASCOSTA] in codice ma non raggiungibile UI
- [DEPRECATED] presente ma non più usata

VINCOLI:
- NO modifiche src/, supabase/, tests/
- NO fix
- NO patch
- Solo docs/audits/2026-04-24-deployed-feature-map.md
- Commit atomico "docs(audit): mappa funzionalità deployate 2026-04-24"
- Push

PRINCIPIO ZERO V3 FILTER:
Ogni feature va valutata dal punto di vista del docente davanti alla LIM.
Se SENZA preparazione non capisce in 10 sec → flagga [ATTRITO].

Al termine stampa summary: numero feature per stato, numero flag ATTRITO, path output.
```

---

### R1.S2 — Test sistematici 30 + COV (cloud, ~45 min)

**Setup: stesso branch R1.**

**Prompt:**

```
Sessione 2/6 — Test sistematici + COV audit.
Ruolo: tester sistematico, read-only.
Budget tempo: 45 min max. Se timeout a test 20, commit parziale + dichiara gap.

FILE DA LEGGERE PRIMA:
1. docs/audits/2026-04-24-deployed-feature-map.md (prodotto R1.S1)
2. CLAUDE.md (regole immutabili, Principio Zero v3)
3. src/services/simulator-api.js
4. src/hooks/useSessionTracker.js
5. src/services/unlimMemory.js
6. src/components/lavagna/useGalileoChat.js

STRUMENTI:
- Playwright browser (Chrome/Firefox)
- curl + grep per HTML response
- Lettura codice src/
- Screenshot ragionati se Desktop Cloud supporta

SCOPE:
30 test sistematici su top-priority feature dalla mappa R1.S1.
Selezione: priorità Principio 0 v3 (docente LIM) + severità.

FORMATO ogni test (ID T001-T030):
- ID: T001 (sequenziale)
- Area: (lavagna/simulator/unlim/voice/fumetto/nav/offline)
- Obiettivo: 1 frase
- Precondizioni: stato iniziale richiesto
- Procedura: steps numerate (max 7)
- Atteso: risultato previsto
- Osservato: risultato reale (usa evidence: screenshot, response, code)
- Esito: PASS/FAIL/WARN/SKIP
- Gravità: P0/P1/P2/P3
- Impatto Principio 0 v3: ALTO/MEDIO/BASSO/NULLO
- Note: contesto

COV AUDIT OBBLIGATORIO:
- Dopo test T015: stop, produci docs/audits/2026-04-24-deployed-cov-audit-block-1.md
  - Coerenza risultati
  - Aree saltate
  - False positive/negative
  - Pattern ricorrenti
  - Violazioni Principio 0 v3
- Dopo test T030: stop, produci docs/audits/2026-04-24-deployed-cov-audit-block-2.md
  - stesso schema
  - confronto con block-1
  - trend aggravamento/miglioramento

OUTPUT FILE:
- docs/audits/2026-04-24-deployed-tests-T001-T015.md
- docs/audits/2026-04-24-deployed-tests-T016-T030.md
- docs/audits/2026-04-24-deployed-cov-audit-block-1.md
- docs/audits/2026-04-24-deployed-cov-audit-block-2.md

VINCOLI:
- NO modifiche src/, tests/, supabase/
- NO fix
- NO dati permanenti se evitabile
- Se non riesci a testare (es. auth flow), dichiara SKIP + motivo
- Commit atomici ogni 15 test + ogni COV
- Push dopo ogni commit

Al termine: summary test PASS/FAIL/WARN/SKIP + top 3 findings Principio 0 v3.
```

---

### R1.S3 — Report finale + branch analysis (cloud, ~30 min)

**Setup: stesso branch R1.**

**Prompt:**

```
Sessione 3/6 — Report finale deploy + codebase/branch analysis.
Ruolo: product auditor senior, read-only.
Budget tempo: 30 min max.

FILE DA LEGGERE PRIMA (obbligatorio tutti):
1. docs/audits/2026-04-24-deployed-feature-map.md (R1.S1)
2. docs/audits/2026-04-24-deployed-tests-T001-T015.md (R1.S2)
3. docs/audits/2026-04-24-deployed-tests-T016-T030.md (R1.S2)
4. docs/audits/2026-04-24-deployed-cov-audit-block-1.md (R1.S2)
5. docs/audits/2026-04-24-deployed-cov-audit-block-2.md (R1.S2)
6. docs/superpowers/plans/2026-04-23-openclaw-sprint6-l1-live.md
7. CLAUDE.md
8. docs/business/revenue-model-elab-2026.md
9. docs/business/gpu-vps-decision-framework.md
10. docs/sunti/2026-04-23-sunto-sessione-openclaw.md
11. docs/audits/2026-04-22-openclaw-plan-honest-check.md
12. docs/audit/day-37-audit-2026-04-23.md (path senza "s", legacy)
13. docs/handoff/2026-04-23-day-37-day-38-complete.md

COMMAND CONTEXT (esegui per capire):
- git log main --oneline -n 20
- git branch -r | grep -v "auto/" | grep -v "claude/" | head -20
- gh pr list -R AndreaMarro/elab-tutor --state all --limit 15
- cat automa/baseline-tests.txt

SCOPE:

Task 1: docs/audits/2026-04-24-deployed-final-report.md
Struttura:
1. Executive summary brutale (max 10 righe)
2. Stato reale prodotto
3. Mappa funzionalità sintetica
4. Test inventario risultati
5. Problemi ordinati gravità + Principio 0 v3
6. Violazioni Principio 0 v3 esplicite
7. Gap visione-doc-realtà
8. Punti forti (solo se dimostrati da evidenza)
9. Fragilità + ambiguità
10. Rischi immediati + strutturali
11. Aree solide da ricontrollare
12. Aree non verificabili (dichiara perché)
13. Voto maturità prodotto 1-10 motivato

Task 2: docs/audits/2026-04-24-codebase-branch-analysis.md
Analizza:
- Codebase deployata (src/ + scripts/openclaw/ + supabase/)
- Branch remote non mergeati (escludi auto/*)
- PR merged ultimi 7 giorni (#18-27)
- Incroci: cosa codice mostra vs prodotto vs doc vs PDR 8 settimane

Identifica:
- Divergenze codice-prodotto (code path not exercised)
- Lavoro utile non integrato (branch non merged)
- Codice morto (dead code analysis basic)
- Debiti tecnici con severità P0-P3
- Feature in stallo (ultima commit >7 giorni)

VINCOLI:
- NO modifiche codice
- NO fix
- NO patch
- Solo 2 file output
- Commit "docs(audit): final deploy report + codebase branch analysis"
- Push

Al termine: summary voto maturità, 3 rischi top, 3 quick-win.
```

---

## ROUTINE 2 — Strategia + Decisione

### Setup branch (esegui tu, 1 min)

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
git stash push -m "pre-routine-2-$(date +%H%M)" 2>/dev/null
git checkout main && git pull origin main
git checkout -b feature/routine-2-strategia-2026-04-24
git push -u origin feature/routine-2-strategia-2026-04-24
git checkout main
git stash pop 2>/dev/null || true
```

---

### R2.S1 — Situation report (cloud, ~30 min)

**Setup Desktop Cloud:**
- Nuova sessione
- Chip branch: `feature/routine-2-strategia-2026-04-24`

**Prompt:**

```
Sessione 4/6 — Situation report.
Ruolo: strategic product analyst, read-only.
Budget tempo: 30 min max.

FILE DA LEGGERE PRIMA (obbligatorio tutti in ordine):
1. CLAUDE.md (regole immutabili + Principio Zero v3 + stack)
2. docs/sunti/2026-04-23-sunto-sessione-openclaw.md (sunto 22-23 apr)
3. docs/handoff/2026-04-23-day-37-day-38-complete.md (session A output)
4. docs/handoff/2026-04-24-session-handoff-final.md (handoff finale 24 apr)
5. docs/audits/2026-04-22-openclaw-plan-honest-check.md (audit 7.2/10)
6. docs/audits/2026-04-23-security-secret-rotation-required.md
7. docs/audit/day-37-audit-2026-04-23.md (NOTA: path senza "s")
8. docs/business/revenue-model-elab-2026.md (break-even Stage 2b)
9. docs/business/gpu-vps-decision-framework.md
10. docs/superpowers/plans/2026-04-23-openclaw-sprint6-l1-live.md
11. CHANGELOG.md (ultimi 3 entry)

COMMAND CONTEXT:
- git log main --oneline -n 30
- gh pr list -R AndreaMarro/elab-tutor --state merged --limit 15 --json number,title,mergedAt -q '.[] | "#\(.number) \(.title) (\(.mergedAt[:10]))"'

PRINCIPIO 0 V3 FILTRO DOMINANTE:
"Docente davanti LIM inizia a spiegare senza attrito, senza ambiguità, senza passaggi inutili."
Ogni valutazione passa attraverso questo filtro.

SCOPE:
docs/audits/2026-04-24-situation-report.md
Max 400 righe.

STRUTTURA OBBLIGATORIA:
1. Dove siamo davvero oggi (fatti, no hype)
2. Priorità esplicite ultimi 3 giorni (da PR merged + commit messages)
3. Priorità implicite emergenti (letture tra righe da audit + sunti)
4. Ordini Andrea raccolti (trascrivere frasi chiave letterali da file)
5. Principio 0 v3 — quanto rispettato oggi (voto 1-10 + motivazione)
6. PDR 8 settimane — % completato reale (non aspirazione)
7. Errori fatti ultimi 3 giorni (da self-audit + agent failure)
8. Cosa protegge davvero la visione
9. Cosa indebolisce la visione
10. 5 decisioni critiche da prendere prossimi 4 giorni
11. Verdetto sintetico brutalmente onesto (max 10 righe)

VINCOLI:
- NO 20 piani qui
- NO ricerca online
- NO modifiche codice
- Solo 1 file output
- Commit "docs(audit): situation report 2026-04-24"
- Push

Al termine: summary 5 decisioni critiche + verdetto.
```

---

### R2.S2 — Ricerca esterna (cloud, ~25 min)

**Setup: stesso branch R2.**

**Prompt:**

```
Sessione 5/6 — Ricerca esterna mirata.
Ruolo: research analyst, read-only.
Budget tempo: 25 min max. MAX 10 web fetch.

FILE DA LEGGERE PRIMA:
1. docs/audits/2026-04-24-situation-report.md (R2.S1)
2. docs/audits/2026-04-24-deployed-final-report.md (R1.S3, se già pronto; altrimenti skip)
3. CLAUDE.md
4. docs/business/revenue-model-elab-2026.md
5. docs/business/gpu-vps-decision-framework.md

QUERY WEB SEARCH (una alla volta, fetch massimo 2 pagine per query):
1. "Claude Max subscription best practices codebase audit 2026"
2. "Anthropic claude-agent-sdk production patterns 2026"
3. "educational simulator AI tutor GDPR EU architecture 2026"
4. "GitHub Actions autonomous code review workflow claude 2026"
5. "agentic development cloud desktop Anthropic workflow 2026"

Per ogni query: 1 pagina top result + 1 pagina secondaria rilevante.

SCOPE:
docs/audits/2026-04-24-external-research.md
Max 300 righe.

STRUTTURA:
1. Query esplorate + source URLs
2. 5 insight chiave per Claude Max usage ottimale
3. 3 repository GitHub rilevanti (ispirazione)
4. 3 innovazioni 2026 applicabili a ELAB
5. 2 competitor o prodotti affini (se trovati)
6. Lezioni dirette per ELAB Tutor (coerenti Principio 0 v3)

VINCOLI:
- NO 20 piani qui (R2.S3 farà)
- NO modifiche codice
- Solo 1 file output
- Fetch web SOLO se necessario (no rumore)
- Commit "docs(audit): external research 2026-04-24"
- Push

Al termine: top 5 insight sintetizzati per uso piani.
```

---

### R2.S3 — 5 piani 4 giorni + sintesi (cloud, ~30 min)

**Setup: stesso branch R2.**

**Prompt:**

```
Sessione 6/6 — 5 piani concreti + sintesi brutale.
Ruolo: strategic planner senior, read-only.
Budget tempo: 30 min max.

FILE DA LEGGERE PRIMA (obbligatorio tutti):
1. docs/audits/2026-04-24-situation-report.md (R2.S1)
2. docs/audits/2026-04-24-external-research.md (R2.S2)
3. docs/audits/2026-04-24-deployed-final-report.md (R1.S3)
4. docs/audits/2026-04-24-codebase-branch-analysis.md (R1.S3)
5. CLAUDE.md
6. docs/superpowers/plans/2026-04-23-openclaw-sprint6-l1-live.md

SCOPE:

Task 1: docs/plans/2026-04-24-next-4-days-5-plans.md
5 piani DIFFERENTI per prossimi 4 giorni.

PIANI PRE-ASSEGNATI (non inventare nuove categorie):
- Piano A CONSERVATIVO — completa Sprint 6 Day 39-42 come pianificato
- Piano B AGGRESSIVO — salta Day 39-42, va a Dashboard Docente critica
- Piano C INNOVATIVO — GPU benchmark + Qwen locale + nuovo workflow cloud
- Piano D DIFENSIVO — solo bug fix + stabilizzazione + zero nuove feature
- Piano E REVENUE-FIRST — pausa tech, focus demo Giovanni + PNRR pitch

Per CIASCUNO:
- Obiettivo centrale (1 frase)
- Logica strategica (3-5 righe)
- Connessione Principio 0 v3 (specifica come)
- Problemi che chiarisce
- Materiale da analizzare
- Test/verifiche previsti
- Output documentali + code
- Vantaggi concreti
- Limiti onesti
- Rischi con severità
- Dipendenze
- Tempo stimato (ore)
- Impatto atteso (1-10)
- Coerenza Principio 0 v3 (voto 1-10)

GIUDIZIO COMPARATIVO FINALE:
- Quale piano serve DAVVERO Andrea ora
- Quale ottimizza Principio 0 v3
- Quale protegge dall'errore più grande possibile
- 1 piano raccomandato (io decido)

Task 2: docs/audits/2026-04-24-synthesis-brutale.md
Max 150 righe. Sintesi finale:
1. Cosa conta davvero ADESSO
2. Cosa NON va sottovalutato
3. Cosa sarebbe errore fare oggi
4. Una sola azione prioritaria (tu decidi)

VINCOLI:
- NO modifiche codice
- NO fix
- Solo 2 file output
- Commit "docs(plan): 5 piani 4 giorni + sintesi brutale"
- Push

Al termine: 1 frase raccomandazione + 1 frase warning.
```

---

## ORDINE ESECUZIONE ANDREA

### Scenario A — Parallelo (più veloce, ~1h45min)

1. Crea entrambi branch (setup R1 + R2 in sequenza, 3 min totali)
2. Apri Claude Desktop → avvia 2 sessioni simultanee:
   - Session cloud #1 = R1.S1 (branch R1)
   - Session cloud #2 = R2.S1 (branch R2)
3. Attendi completion entrambe (~30 min)
4. Avvia:
   - Session #3 = R1.S2 (branch R1)
   - Session #4 = R2.S2 (branch R2)
5. Attendi (~45 min per R1.S2)
6. Avvia:
   - Session #5 = R1.S3 (branch R1)
   - Session #6 = R2.S3 (branch R2)
7. Attendi (~30 min)

**Rischio:** rate limit Claude Max 5x/5h potrebbe esaurirsi.

### Scenario B — Sequenziale (più sicuro, ~3h)

1. Crea branch R1 (setup, 1 min)
2. Session #1 R1.S1 (30 min)
3. Session #2 R1.S2 (45 min)
4. Session #3 R1.S3 (30 min)
5. Crea branch R2 (1 min)
6. Session #4 R2.S1 (30 min)
7. Session #5 R2.S2 (25 min)
8. Session #6 R2.S3 (30 min)

**Vantaggio:** ogni sessione può leggere output precedenti. Risultati più coerenti.

**Raccomandato: Scenario B.**

---

## STRINGHE ATTIVAZIONE (copia-incolla sequenziali)

Ogni blocco è UN prompt da incollare nel composer Claude Desktop Cloud.

### Block 1 — Setup R1 (terminale)

```
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder" && git stash push -m "pre-routines-$(date +%H%M)" 2>/dev/null ; git checkout main && git pull origin main && git checkout -b feature/routine-1-supercontrollo-2026-04-24 && git push -u origin feature/routine-1-supercontrollo-2026-04-24 && git checkout main && git stash pop 2>/dev/null
```

### Block 2 — Cloud session R1.S1

Chip branch: `feature/routine-1-supercontrollo-2026-04-24`

Prompt: vedi sezione R1.S1 sopra.

### Block 3 — Cloud session R1.S2

Chip branch: stesso.

Prompt: vedi R1.S2.

### Block 4 — Cloud session R1.S3

Chip branch: stesso.

Prompt: vedi R1.S3.

### Block 5 — Setup R2 (terminale)

```
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder" && git stash push -m "pre-routine-2-$(date +%H%M)" 2>/dev/null ; git checkout main && git pull origin main && git checkout -b feature/routine-2-strategia-2026-04-24 && git push -u origin feature/routine-2-strategia-2026-04-24 && git checkout main && git stash pop 2>/dev/null
```

### Block 6 — Cloud session R2.S1

Chip branch: `feature/routine-2-strategia-2026-04-24`

Prompt: vedi R2.S1.

### Block 7 — Cloud session R2.S2

Chip branch: stesso.

Prompt: vedi R2.S2.

### Block 8 — Cloud session R2.S3

Chip branch: stesso.

Prompt: vedi R2.S3.

---

## TERMINATION CHECK

Al completamento tutte 6 sessioni, esegui:

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
git fetch origin --prune
git log origin/feature/routine-1-supercontrollo-2026-04-24 --oneline -n 10
git log origin/feature/routine-2-strategia-2026-04-24 --oneline -n 10
ls -lt docs/audits/2026-04-24-*.md docs/plans/2026-04-24-*.md 2>/dev/null
```

Deve stampare 8 file output:
- docs/audits/2026-04-24-deployed-feature-map.md
- docs/audits/2026-04-24-deployed-tests-T001-T015.md
- docs/audits/2026-04-24-deployed-tests-T016-T030.md
- docs/audits/2026-04-24-deployed-cov-audit-block-1.md
- docs/audits/2026-04-24-deployed-cov-audit-block-2.md
- docs/audits/2026-04-24-deployed-final-report.md
- docs/audits/2026-04-24-codebase-branch-analysis.md
- docs/audits/2026-04-24-situation-report.md
- docs/audits/2026-04-24-external-research.md
- docs/plans/2026-04-24-next-4-days-5-plans.md
- docs/audits/2026-04-24-synthesis-brutale.md

(Total 11 file, non 8 — ho ricontato.)

---

## APRI LE PR

```bash
gh pr create --base main --head feature/routine-1-supercontrollo-2026-04-24 \
  --title "docs(audit): Routine 1 super controllo deploy 2026-04-24" \
  --body "Mappa + 30 test + 2 COV + final report + branch analysis" \
  -R AndreaMarro/elab-tutor

gh pr create --base main --head feature/routine-2-strategia-2026-04-24 \
  --title "docs(audit+plan): Routine 2 strategia + 5 piani 2026-04-24" \
  --body "Situation report + research + 5 piani + sintesi brutale" \
  -R AndreaMarro/elab-tutor
```

Review commit-per-commit. Merge admin se check OK (pattern noto flaky E2E pull_request).

---

## NOTE ONESTE

- **Budget Claude Max**: ogni sessione cloud consuma da subscription rate limit. 6 sessioni in 3h = uso intenso. Se limit esaurisce, attendere reset ~5h.
- **Tempo totale**: 3h sequenziale (raccomandato).
- **Zero rischio main**: tutte sessioni su feature branch, zero push main, zero deploy.
- **Rischio prompt timeout**: ogni prompt dichiara budget tempo + "se timeout salva parziale". Mitigato ma non zero.
- **Output testo verificabile**: ogni doc ha struttura obbligatoria + path canonical. Andrea può verificare semantic consistency rapidamente.

**Al termine tutte PR merged → main aggiornato con 11 nuovi doc → deploy auto Vercel → stato-di-fatto documentato per prossima decisione Andrea.**
