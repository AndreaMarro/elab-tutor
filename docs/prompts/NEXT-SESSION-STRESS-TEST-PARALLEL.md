# PROMPT PROSSIMA SESSIONE CLAUDE — Stress Test Parallel

**Data creazione**: 2026-04-22 08:05 GMT+8
**Contesto precedente**: esaurito (merge+deploy+kickoff sett-4)
**Branch attuale**: `feature/sett-4-intelligence-foundations`
**Loop CLI attivo parallelo**: SÌ (sett-4 Day 01+ autonomo)

---

## MISSIONE

Mentre loop CLI autonomo esegue **Sprint 4 Day 01+ (Karpathy LLM Wiki POC Option B)** sul branch `feature/sett-4-intelligence-foundations`, **tu lavora in parallelo** su:

1. **Stress test Playwright** su prod live (www.elabtutor.school)
2. **Stress test Control Chrome** via MCP browser automation
3. **Bug hunt onesto** — trovare TUTTI i problemi reali

**IMPORTANTE**: **NON modificare** branch `feature/sett-4-intelligence-foundations` (loop lo sta usando). Se devi fare fix, crea branch separato `test/stress-findings-YYYY-MM-DD` dal main.

---

## CONTESTO COMPLETO — TUTTO QUELLO CHE DEVI SAPERE

### 1. Stato progetto (snapshot 2026-04-22 08:05)

**Sprint 3 sett-3-stabilize-v3**: CHIUSO + MERGED + DEPLOYED
- PR #18 merged main (commit `2b5bab7`) 2026-04-22 07:56 GMT+8
- Prod deploy `dpl_9ocrgUWYkpwm1MmHGQeQ3kSJqVYe` LIVE
- www.elabtutor.school HTTP 200 1.33s verified
- Tests: **12220/12220 PASS** (CoV 4x deterministic zero flaky)
- Build: PASS 2m 17s, PWA 32 precache
- Benchmark: 4.75 (target 5.0 miss -0.25)
- Auditor sett-3: 7.53

**Sprint 4 sett-4-intelligence-foundations**: IN CORSO
- Theme: **Karpathy LLM Wiki POC** (Option B LOCKED)
- Riferimento: `docs/research/2026-04-22-karpathy-llm-wiki.md`
- 3 Epic: Wiki POC (15 SP) + Benchmark uplift (8 SP) + Process (3 SP) = 26 SP
- Branch: `feature/sett-4-intelligence-foundations`
- Contract: `automa/team-state/sprint-contracts/sett-4-sprint-contract.md` (FINAL)

### 2. Stack tecnico ELAB

- React 19 + Vite 7 (NO react-router, hash routing)
- Vitest (12220 test PASS baseline)
- Deploy: Vercel (frontend) + Supabase (backend Edge Functions)
- Nanobot AI: Render https://elab-galileo.onrender.com (18s cold start)
- Compilatore: n8n Hostinger https://n8n.srv1022317.hstgr.cloud/compile
- CPU: avr8js ATmega328p browser emulation
- UNLIM AI: RAG 549 chunk + vision Gemini + voice Edge TTS + Principio Zero v3

### 3. Principio Zero v3 (IMMUTABILE)

**Il docente è il tramite. UNLIM è strumento docente. Studenti lavorano su kit fisici ELAB.**

UNLIM NON parla allo studente diretto. UNLIM PREPARA contenuto che docente veicola oralmente ai ragazzi. Linguaggio plurale "Ragazzi". Cita Volume + pagina. Zero "Docente leggi" meta-istruzioni.

### 4. Anti-regressione FERREA

- **PRIMA** di ogni modifica: `npx vitest run` (baseline 12220)
- **DOPO**: re-run, se scende → REVERT IMMEDIATO
- `npm run build` PASS obbligatorio pre-commit
- MAI `git add -A` senza `git diff` prima
- MAI `--no-verify` su commit
- MAI push main diretto → sempre PR via `gh pr create`
- CoV 3x obbligatorio prima di dichiarare "test passano"

### 5. File CRITICI (NON toccare senza coordinamento)

```
src/components/simulator/engine/CircuitSolver.js (2486 righe) — MNA/KCL solver
src/components/simulator/engine/AVRBridge.js (1242 righe) — avr8js bridge
src/components/simulator/engine/PlacementEngine.js (822 righe)
src/components/simulator/canvas/SimulatorCanvas.jsx (3149 righe)
src/services/api.js (1040 righe) — LLM client + fallback chain
src/services/simulator-api.js (755 righe) — window.__ELAB_API
src/data/rag-chunks.json (4463 righe, 549 chunk) — UNLIM RAG
package.json — MAI modificare dipendenze senza OK Andrea
```

### 6. Bug aperti prioritari (pre-sett-4)

1. Benchmark 4.75 < 5.0 target (lever sprint-4: axe-core + latency_p95)
2. 2 chunks >1MB build warning (sprint-5 dynamic import refactor)
3. Supabase dashboard probably PAUSED (401) → Dashboard real data deferred sprint-5
4. Nanobot cold start 18s (warmup added, first call lento)
5. Vision non testata live E2E
6. 2 preexisting: deploy-smoke manifest.json fail (P2), BLOCKER-010 watermark (P1 risolto Day 13)

---

## TASK PROSSIMA SESSIONE (in parallelo al loop CLI)

### FASE 1: Setup (5 min)

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
git fetch origin
git log origin/main --oneline -5
git log origin/feature/sett-4-intelligence-foundations --oneline -10  # vedi progresso loop
```

Controlla ultimo commit loop su sett-4 branch. NON checkout quel branch (loop lo usa). Lavora da main o branch separato `test/stress-*`.

### FASE 2: Playwright Stress Test (45 min)

**Target**: `https://www.elabtutor.school` (prod LIVE)

**Test suite minima**:

1. **Homepage flow**:
   - Carica `/` → WelcomePage
   - Click "Inizia" → vetrina volumi
   - Verifica 3 volumi caricati (V1/V2/V3)
   - Click volume → lezioni mostrate (27 totali)
   - Measure: TTI, LCP, FCP via Playwright performance metrics

2. **Simulator flow**:
   - Apri esperimento v1-cap6-esp1 (LED + resistenza)
   - Verifica componenti caricati nel SVG
   - Drag componente → verifica snap bus
   - Click "Play" → verifica emulation start
   - Measure: frame rate, memory usage

3. **UNLIM AI flow**:
   - Apri chat UNLIM
   - Query: "Cos'è un LED?"
   - Verifica risposta in <5s cold start
   - Verifica cite pagina volume (Principio Zero v3)
   - Verifica plurale "Ragazzi" in risposta
   - Zero "Docente leggi" meta-istruzioni

4. **PWA offline flow**:
   - Service worker attivo
   - Disconnect network
   - Reload → app funziona offline
   - Simulator funziona offline (compilato HEX)

5. **Mobile responsive**:
   - Viewport 375x667 (iPhone SE)
   - Tap target ≥44x44px
   - Font ≥13px
   - No horizontal scroll

**Salva risultati**: `docs/stress-tests/2026-04-22-playwright-prod.md`

### FASE 3: Control Chrome Stress Test (30 min)

**MCP tools**: `mcp__Control_Chrome__*` o `mcp__Claude_in_Chrome__*` (usa ToolSearch per caricare schemas)

**Test suite**:

1. **DevTools console errors**:
   - Apri prod in Chrome
   - Apri DevTools console
   - Naviga 10 esperimenti diversi
   - Conta errori console (target: 0)
   - Screenshot se errori trovati

2. **Network audit**:
   - Apri Network tab
   - Reload pagina
   - Verifica status 200 per tutte le risorse critiche
   - Identifica risorse >500KB (candidate per lazy-load)
   - Misura TTFB, waterfall

3. **Lighthouse audit**:
   - Run Lighthouse su /
   - Score Performance, Accessibility, Best Practices, SEO, PWA
   - Target: ≥80 su tutti (realistic ELAB 50-70 baseline)
   - Screenshot report

4. **Accessibility audit**:
   - Tab navigation test
   - Focus indicators visibili
   - Color contrast WCAG AA (4.5:1)
   - Screen reader compatibility (aria-labels)

**Salva risultati**: `docs/stress-tests/2026-04-22-chrome-audit-prod.md`

### FASE 4: Bug triage + report (20 min)

Crea file `docs/audits/2026-04-22-stress-test-findings.md`:

- Lista bug trovati con severity (P0/P1/P2/P3)
- Screenshot/log evidence per ogni bug
- Riproducibilità steps
- Proposta fix con file:line
- Impact assessment

**Honesty rule**: MAI mascherare failure. Ogni anomalia = report onesto. Zero inflation.

### FASE 5: Handoff (5 min)

Crea `docs/handoff/2026-04-22-stress-test-session.md` con:
- Test eseguiti e count
- Bug trovati P0/P1 count
- Loop CLI status (check git log sett-4 branch)
- Prossimo step raccomandato

---

## RULES SESSIONE PARALLELA

### NON fare
- Modificare branch `feature/sett-4-intelligence-foundations`
- Committare su main diretto
- Rimuovere test o mock
- Inventare numeri (CoV 3x obbligatorio pre-claim)
- Mascherare errori CI
- Chiamare UNLIM "Galileo"
- Usare emoji nel codice (solo ElabIcons.jsx)

### FARE
- Stress test su prod LIVE
- Report onesti findings
- Screenshot evidence
- Branch separato `test/stress-*` per qualunque commit
- CoV 3x se tocchi codice
- MCP calls ≥8/sessione (Playwright + Chrome + Context7 + claude-mem)
- Honest severity scoring bug

### Safety
- Loop CLI is running on `feature/sett-4-intelligence-foundations` — don't touch
- Prod is LIVE with real users — don't deploy, don't modify Supabase
- Rollback available via Vercel UI if prod breaks

---

## CREDENZIALI + ENV

- GitHub PAT: stored in shell env (verifica `gh auth status`)
- Together AI: `TOGETHER_API_KEY` in shell env
- Supabase Access Token: `SUPABASE_ACCESS_TOKEN` in shell env
- Supabase project: `euqpdueopmlllqjmqnyb` (legacy UNLIM) + `vxvqalmxqtezvgiboxyv` (dashboard sprint-5)
- Vercel auth: cached (npx vercel works)
- Andrea email: marro.andrea96@gmail.com

---

## COMANDI UTILI

```bash
# Verifica loop progresso
git fetch origin && git log origin/feature/sett-4-intelligence-foundations --oneline -10

# Baseline tests
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder" && npx vitest run --reporter=dot | tail -7

# Playwright install (se non già fatto)
npx playwright install chromium

# Playwright run prod stress
npx playwright test --config tests/e2e/playwright.config.js

# Benchmark current
node scripts/benchmark.cjs --fast

# Smoke prod
curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" https://www.elabtutor.school/

# Supabase CLI (SUPABASE_ACCESS_TOKEN required)
SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN npx supabase projects list

# GitHub CLI
gh pr list --state open
gh run list --limit 5
```

---

## CHECKLIST FINE SESSIONE

- [ ] Playwright suite run completa (5 suite min)
- [ ] Chrome audit run completo (4 suite min)
- [ ] Findings doc `docs/audits/2026-04-22-stress-test-findings.md`
- [ ] Handoff doc `docs/handoff/2026-04-22-stress-test-session.md`
- [ ] Loop CLI status verificato (git log sett-4)
- [ ] Zero commit su sett-4 branch (lascia al loop)
- [ ] Honesty disclosure ogni finding
- [ ] Severity scoring P0/P1/P2/P3
- [ ] Screenshot/log evidence ogni bug

---

**SE LOOP CLI CRASHA**: verifica logs `automa/state/daily-logs/cli-*.log`. Se kill necessario: `pkill -f loop-forever.sh && pkill -f "claude --print"`. Relaunch via stringa CLI (vedi messaggio Andrea).

**CONTEXT HANDOFF**: questo file è il tuo briefing completo. Leggi TUTTO. Non fare assumption.

**MASSIMA ONESTÀ**: ogni finding onesto, zero inflation, evidence per ogni claim.
