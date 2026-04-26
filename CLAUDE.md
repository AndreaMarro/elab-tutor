# ELAB Tutor — Contesto per Claude Code

## PRINCIPIO ZERO (la regola piu importante di tutto il progetto)

**Il docente e il tramite. UNLIM e lo strumento del docente. Gli studenti lavorano sui kit fisici ELAB.**

- UNLIM prepara lezioni personalizzate basate sui volumi fisici + contesto delle sessioni passate
- Gli studenti NON interagiscono direttamente con UNLIM ne con ELAB Tutor: vedono tutto sulla LIM (Lavagna Interattiva Multimediale) proiettata dal docente
- Il linguaggio di UNLIM NON e rivolto direttamente all'insegnante come "fai questo" — deve fargli CAPIRE cosa fare e cosa dire ai ragazzi, usando le stesse parole del libro
- I ragazzi lavorano sui kit ELAB fisici (breadboard, componenti, batterie) seguendo le istruzioni del docente che legge dal Volume + dalla schermata UNLIM
- **CHIUNQUE** accendendo ELAB Tutor deve essere in grado, SENZA conoscenze pregresse, di giostrarsi sulla piattaforma e spiegare ai ragazzi
- Il testo dei volumi deve essere CITATO e USATO per la lettura — le stesse parole, non parafrasi
- Il differenziatore competitivo: nessun competitor prepara lezioni personalizzate basate sulle sessioni precedenti + contenuto specifico dei volumi

## Cosa e' questo progetto
ELAB e' un tutor educativo per elettronica e Arduino per bambini 8-14 anni.
Il prodotto include kit fisici (3 volumi + componenti) e questo software web.
Live: https://www.elabtutor.school

Include:
- **Simulatore di circuiti** proprietario (CircuitSolver MNA/KCL + AVRBridge avr8js)
- **92 esperimenti** in 3 volumi (38 Vol1 + 27 Vol2 + 27 Vol3), raggruppati in **27 Lezioni**
- **Tutor AI "UNLIM"** (chat, voice, vision, RAG 549 chunk, report fumetto) — NON "Galileo"
- **Scratch/Blockly** per programmare Arduino visualmente
- **Compilatore Arduino** (C++ -> HEX -> emulazione AVR nel browser)
- **Dashboard docente** con progressi, nudge, export CSV
- **4 giochi didattici** (Detective, POE, Reverse Engineering, Circuit Review)
- **PWA** con service worker e offline support

## Stack tecnico
- React 19 + Vite 7 (NO react-router — routing custom con useState e hash)
- Vitest — **baseline**: unica fonte di verità `automa/baseline-tests.txt` (aggiornata automaticamente). Target 14000 entro Sprint 8. NON citare numeri a mano, usa sempre il file.
- Deploy: Vercel (frontend) + Supabase (backend DB)
- Nanobot AI: Render (https://elab-galileo.onrender.com)
- Compilatore: n8n su Hostinger (https://n8n.srv1022317.hstgr.cloud/compile)
- CPU emulation: avr8js (ATmega328p nel browser)
- Styling: CSS Modules (preferiti) + inline styles (legacy, da migrare)

## Anti-regressione (FERREA)
- BASELINE: `npx vitest run` PRIMA e DOPO ogni modifica — se test scendono → REVERT IMMEDIATO
- `npm run build` deve passare prima di ogni commit
- MAI fare `git add -A` senza controllare `git diff` prima
- MAI `--no-verify` su commit (pre-commit hook è lì per proteggerti)
- MAI push diretto su `main` — solo PR via `gh pr create`
- Snapshot baseline ogni sessione: `git tag baseline-HHMM`
- Se qualcosa si rompe: `git stash && npx vitest run` — se passa, il problema è nel tuo codice
- Score oggettivo: `node scripts/benchmark.cjs --write` — è la verità, non la self-claim
- Guard critical files: `scripts/guard-critical-files.sh` blocca modifiche engine senza `authorized-engine-change`

## Principi Karpathy (da `forrestchang/andrej-karpathy-skills`, 54K stars)
1. **Think**: ragiona prima di scrivere codice. Un minuto di pensiero ≫ 10 minuti di refactor
2. **Simple**: la soluzione più semplice che risolve il problema è quella giusta. Niente astrazioni premature
3. **Surgical**: tocca il minimo necessario. Un file, una funzione, una riga — mai "già che ci sei"
4. **Goal-driven**: ogni riga deve servire un goal esplicito. Se non sai perché la stai scrivendo, non scriverla

## Regola anti-inflazione numerica (CoV — Chain of Verification)
- **Mai inventare numeri**: se citi test count, deve essere appena visto in `vitest run` output o letto da `automa/baseline-tests.txt`, non ricordato a memoria
- **Mai inflazionare progress**: "quasi pronto" = 0%, "funziona" = testato live con utente reale
- **Mai self-rate**: il benchmark `node scripts/benchmark.cjs` è l'unico score valido. I claim del generator non valgono
- **CoV su ogni PR**: 3 volte `npx vitest run` prima di dichiarare "test passano" — se uno dei 3 fallisce → indaga flakiness, non nascondere

## Volumi fisici — parallelismo CRITICO
- **PDF**: `/VOLUME 3/CONTENUTI/volumi-pdf/` (Vol1 27MB, Vol2 17MB, Vol3 18MB)
- **Testo estratto**: `pdftotext "percorso.pdf" /tmp/volN.txt`
- **Regola**: OGNI esperimento nel simulatore DEVE citare pagina e testo esatto del volume
- **Struttura**: il libro presenta esperimenti come racconto continuo per capitolo, NON come card separate
- **27 Lezioni** raggruppano per concetto come nel libro fisico (src/data/lesson-groups.js)
- **Riferimenti**: src/data/volume-references.js (92/92 enriched con bookText dai PDF, 1221 righe)

## Tea (collaboratrice)
- Documenti: `/VOLUME 3/TEA/` (4 documenti del 13/04/2026)
  - analisi_complessita_esperimenti.pdf — 92 esperimenti analizzati, 4 capstone, MOSFET problematico
  - riepilogo_correzioni_github.pdf — PR #73 mergiata (chunk error + icone + Scratch)
  - schema_ux_semplificato.docx — 3 zone, Guida Docente, toolbar 4 comandi
  - 10_idee_miglioramento.docx — Dashboard, Proietta in Classe, Quaderno, Glossario, etc.

## UNLIM AI (nome corretto, NON Galileo)
- **RAG**: 549 chunk in `src/data/rag-chunks.json` (volumi + glossario + FAQ + errori + analogie + codice)
- **KB**: `src/data/unlim-knowledge-base.js` → `searchKnowledgeBase()` + `searchRAGChunks()`
- **Context**: `src/services/unlimContextCollector.js` → `collectFullContext()` (circuit, code, compilation, step, errors, pin states)
- **Chat hook**: `src/components/lavagna/useGalileoChat.js` (nome file legacy, contenuto UNLIM)
- **Vision**: "guarda il mio circuito" → screenshot → Gemini Vision → diagnosi
- **Voce**: Kokoro TTS (localhost) + Edge TTS (VPS) + wake word "Ehi UNLIM" + 36 comandi vocali
- **Brevita'**: MAX 3 frasi + 1 analogia, MAX 60 parole, tag [AZIONE:...] non contano

## Regole immutabili

### Tecniche
1. Pin map ATmega328p: D0-D7=PORTD, D8-D13=PORTB, A0-A5=PORTC
2. Scala SVG: NanoR4Board SCALE=1.8
3. BB_HOLE_PITCH = 7.5px, SNAP_THRESHOLD = 4.5px
4. Bus naming: `bus-bot-plus/minus` NON `bus-bottom-plus/minus`
5. `.trim()` su TUTTE le letture di env var (bug Vercel trailing \n)

### Qualita'
6. `npm run build` deve passare prima di ogni deploy
7. `npx vitest run` deve passare prima di ogni commit. Baseline in `automa/baseline-tests.txt` — pre-commit hook confronta delta
8. Font minimo 13px testi, 10px label secondarie
9. Touch target minimo 44x44px per bottoni interattivi
10. Contrasto WCAG AA: 4.5:1 testo, 3:1 grafici
11. MAI emoji come icone nei componenti — usare ElabIcons.jsx
12. MAI dati finti o demo — tutto deve funzionare con dati reali
13. MAI aggiungere dipendenze npm senza approvazione di Andrea
14. MAI chiamare il tutor "Galileo" — il nome è **UNLIM**

### Design
15. Target: bambini 8-14 — interfaccia chiara, feedback visivo forte
16. Palette: Navy #1E4D8C / Lime #4A7A25 / Orange #E8941C / Red #E54B3D
17. Font: Oswald (titoli) + Open Sans (body) + Fira Code (codice)

## Collaborazione (multi-developer)
- **Mai pushare su `main` direttamente** — sempre branch + Pull Request
- Branch protection attiva: CI deve passare prima del merge
- Pre-push hook: blocca push su main se il build fallisce
- Branch naming: `feature/`, `fix/`, `style/`, `refactor/`, `docs/`
- Commit format: `tipo(area): descrizione` (es. `feat(unlim): aggiungi nudge vocale`)
- Leggi `CONTRIBUTING.md` per la guida completa
- Leggi `docs/HISTORY.md` per la storia completa del progetto

## File critici — coordinamento OBBLIGATORIO prima di modificare

| File | Righe | Ruolo |
|------|-------|-------|
| `src/components/simulator/engine/CircuitSolver.js` | 2486 | Solver DC MNA/KCL, Gaussian elimination |
| `src/components/simulator/engine/AVRBridge.js` | 1242 | Bridge CPU emulation avr8js, GPIO/ADC/PWM/USART |
| `src/components/simulator/engine/PlacementEngine.js` | 822 | Posizionamento automatico componenti |
| `src/components/simulator/canvas/SimulatorCanvas.jsx` | 3149 | Canvas SVG principale, zoom/pan/drag, 21 componenti |
| `src/components/simulator/NewElabSimulator.jsx` | 1022 | Shell simulatore, orchestrazione pannelli |
| `src/services/api.js` | 1040 | Tutte le API calls, routing, retry, fallback chain |
| `src/services/simulator-api.js` | 755 | API globale __ELAB_API, eventi, bridge |
| `src/services/unlimContextCollector.js` | 250 | Raccolta contesto completo per UNLIM |
| `src/data/lesson-groups.js` | 250 | 27 Lezioni raggruppate per concetto |
| `src/data/rag-chunks.json` | 4463 | 549 chunk RAG per ricerca offline |
| `vite.config.js` | 293 | Build config, chunk splitting, obfuscation |
| `package.json` | - | Dipendenze — mai modificare senza OK |

## Aree dove si puo' lavorare liberamente
- `src/components/lavagna/` — Redesign lavagna (in corso)
- `src/components/unlim/` — UNLIM mode UI (chat, mascotte, voice)
- `src/components/tutor/` — Tab, giochi didattici, layout
- `src/components/common/` — Componenti condivisi (ElabIcons, Toast, etc.)
- `src/components/dashboard/` — Dashboard docente
- `src/styles/` — CSS globali
- `src/data/lesson-paths/` — Percorsi lezione JSON
- `src/data/volume-references.js` — Mapping pagine volumi (DA COMPLETARE)
- `docs/` — Documentazione
- `tests/` — Test

## API globale simulatore
```javascript
window.__ELAB_API
  .unlim.highlightComponent(['led1', 'r1'])
  .unlim.highlightPin(['nano:D13'])
  .unlim.clearHighlights()
  .unlim.serialWrite('Hello')
  .unlim.getCircuitState()
  .on('experimentChange', callback)
  .on('stateChange', callback)
  .on('serialOutput', callback)
  .on('componentInteract', callback)
  .on('circuitChange', callback)
  .toggleDrawing(true/false)
  .setComponentValue(id, param, value)
  .connectWire(from, to)
  .clearCircuit()
  .mountExperiment(id)
  .getCircuitDescription()
  .captureScreenshot()
```

## Deploy commands
```bash
# Frontend -> Vercel (deploy automatico via GitHub Actions)
npm run build && npx vercel --prod --yes

# Backend -> Supabase
SUPABASE_ACCESS_TOKEN=sbp_... npx supabase functions deploy --project-ref euqpdueopmlllqjmqnyb
```

## Infrastruttura
| Servizio | URL | Stato |
|----------|-----|-------|
| Frontend | https://www.elabtutor.school (Vercel) | OK |
| Supabase | euqpdueopmlllqjmqnyb.supabase.co | OK |
| Nanobot AI | https://elab-galileo.onrender.com (Render) | OK (18s cold start, dice UNLIM) |
| Compilatore | https://n8n.srv1022317.hstgr.cloud/compile (Hostinger) | OK |
| Brain V13 | http://72.60.129.50:11434 (VPS, Qwen3.5-2B) | NON VERIFICATO |
| Kokoro TTS | localhost:8881 | SOLO LOCALE |
| Edge TTS | http://72.60.129.50:8880 | OK (verificato 16/04, /tts → 200) |

## Bug/gap aperti (aggiornamento 23/04/2026)

Fonte dinamica: `automa/tasks/pending/*.md` + `docs/audits/`. Lista breve sintetica:

1. **Dashboard docente** — `src/components/dashboard/` ancora vuoto
2. **Playwright E2E** — 0 spec in `tests/e2e/` (target Sprint 6 Day 40: primo spec)
3. **Vision live** — trigger ok, E2E end-to-end non verificato
4. **Kokoro TTS prod** — Edge TTS VPS OK come alternativa
5. **Esperimenti non fattibili** — audit 92 vs kit fisico pending con Omaric
6. **Render cold start 18s** — warmup automatico presente, prima call lenta
7. **OpenClaw 11 handler TODO** — speakTTS, listenSTT, etc. (Sprint 6 Day 37)
8. **Supabase migrations non applicate** — `openclaw_tool_memory` + `together_audit_log` (Day 38)

Issue tracker autorevole: `automa/tasks/pending/`. Elenco qui è cache.

## Team agent — 8 ruoli (3 attivi + 5 roadmap Sprint 6+)

Attivi via `.claude/agents/`:
- **planner** opus → task atomici in `automa/tasks/pending/`
- **generator-app** sonnet → `src/**`, `supabase/functions/**`, commit atomici con test count
- **generator-test** sonnet → `tests/**`, `scripts/openclaw/*.test.ts`, mai src code
- **evaluator** haiku → `automa/evals/*.json`, scetticismo calibrato, no self-eval bias

Roadmap (plan `docs/superpowers/plans/2026-04-30-agent-team-cli-orchestration.md`):
- **architect** opus → `docs/architectures/`, `docs/adrs/`, read-only sul codice
- **security-auditor** opus → `docs/audits/security-*.md`, OWASP+GDPR+dati minori
- **performance-engineer** sonnet → `docs/audits/performance-*.md`, `scripts/bench/**`
- **scribe** sonnet → `docs/sunti/`, `docs/retrospectives/`

Team charter + handoff protocol: `automa/team-charter.md` + `automa/hand-off-protocol.md` (da creare Sprint 6).

**Lancio tipico** (da Claude CLI in sessione lunga):
```
@planner leggi stato, produci 1 task su metrica benchmark più bassa
@generator-app prendi il task in automa/tasks/pending/ATOM-001 e implementa
@evaluator verifica HEAD, verdetto PASS/WARN/FAIL
```

Dashboard team: `npm run team:dashboard` (roadmap).

## Benchmark oggettivo
- Script: `scripts/benchmark.cjs` (10 metriche pesate, score 0-10)
- Output: `automa/state/benchmark.json` con commit SHA + delta vs run precedente
- **Target 2026**: 8.0/10 (realistico in 2-3 mesi)
- **Baseline 18/04/2026 fast mode**: 2.77/10 (onesta, sotto i claim passati di 7-8)
- Fast mode: `node scripts/benchmark.cjs --fast` (legge artifact cache, no vitest/build)
- Full mode: `node scripts/benchmark.cjs --write` (gira tutto, scrive state)

## Test organization (filosofia: molti test ordinati)

**Regola**: ogni commit aumenta baseline o è refactor puro dichiarato. Pre-commit hook verifica delta.

**Struttura**:
```
tests/
├── unit/             # Vitest — <50ms, isolati
│   ├── services/     # api.js, unlimMemory, unlimContext
│   ├── components/   # React via @testing-library
│   ├── engine/       # CircuitSolver, AVRBridge, PlacementEngine
│   └── openclaw/     # OpenClaw dispatcher (Sprint 6+)
├── integration/      # Vitest — cross-module, <500ms
│   ├── supabase/     # Edge Function contracts
│   └── wiki/         # Wiki retriever + corpus
└── e2e/              # Playwright — browser, <10s/spec
    └── NN-*.spec.js  # Numbered per execution order

scripts/openclaw/*.test.ts  # OpenClaw unit (vitest.openclaw.config.ts)
```

**Command cheat-sheet**:
```bash
npx vitest run                                      # Tutti
npx vitest run tests/unit/services/                 # Un layer
npx vitest run -c vitest.openclaw.config.ts         # OpenClaw only
npx vitest --watch                                  # Dev loop
npx playwright test                                 # E2E tutti
npx playwright test tests/e2e/NN-*.spec.js          # Uno E2E
```

**Coverage target**:
- `src/services/**` → 70% entro Sprint 7
- `scripts/openclaw/**` → 80% entro Sprint 6 Day 42
- `src/components/**` → 50% entro Sprint 8

Long-form: `docs/test-organization.md`.

## Worktree convention

Feature major su worktree isolato `elab-builder-<slug>/`. Dopo merge: `git worktree remove <path>`.

| Worktree                   | Branch                                              | Stato         |
|----------------------------|-----------------------------------------------------|---------------|
| `elab-builder/`            | `main`                                              | Primary       |
| `elab-builder-openclaw/`   | `feature/pdr-sett5-openclaw-onnipotenza-morfica-v4` | PR #25 aperto |
| `elab-builder-watchdog/`   | watchdog work                                       | Sprint 4 eredità |
| `elab-builder-csp/`        | CSP hardening                                       | Merged, rimuovere |
| `elab-builder-wireup/`     | wire-up feature                                     | Merged, rimuovere |
| `elab-builder-fumetto/`    | fumetto feature                                     | Merged, rimuovere |
| `elab-builder-final/`      | CoV integration runs                                | Scratch       |

## OpenClaw "Onnipotenza Morfica v4" — Sett 5 architettura (22/04/2026)
Branch: `feature/pdr-sett5-openclaw-onnipotenza-morfica-v4` (worktree `elab-builder-openclaw/`).

**NON DUPLICA il lavoro Sett-4 POC — lo integra come Layer 1 di OpenClaw.**

- **Sett-4 eredità (già presente su main)**:
  - `scripts/wiki-query-core.mjs` — `makeRetriever(corpus)` keyword-based scaffold
  - `scripts/wiki-corpus-loader.mjs` — markdown+front-matter reader
  - `supabase/functions/unlim-wiki-query/` — Deno edge runtime sibling
  - 7 wiki test files + ADR-007 module extraction pattern

- **Sett-5 aggiunta (branch feature)** in `scripts/openclaw/`:
  1. `tools-registry.ts` — 52 ToolSpec declarative (JSON schema per LLM tool-use)
  2. `morphic-generator.ts` — L1 composition + L2 template + L3 flag-DEV-ONLY (Web Worker sandbox)
  3. `pz-v3-validator.ts` — Principio Zero v3 enforcement IT primary + EN/ES/FR/DE stub
  4. `tool-memory.ts` — Supabase pgvector cache + GC con `MIGRATION_SQL` 4 RPC
  5. `state-snapshot-aggregator.ts` — orchestratore parallelo (circuit + Wiki + RAG + memoria + vision)
  6. `together-teacher-mode.ts` — GDPR-gated fallback (batch/teacher/emergency, BLOCK su student runtime)

- **Deliverable docs**:
  - `docs/architectures/pdr-sett5-openclaw-onnipotenza-morfica-v4.md` (master doc)
  - `docs/business/revenue-model-elab-2026.md` (break-even onesto Stage 2b = 8-10 scuole)

**Decisione onesta:**
- L3 dynamic JS generation NON attiva in produzione. Flag `VITE_ENABLE_MORPHIC_L3=true` solo DEV.
- GPU VPS mensile premature optimization. GPU orarie €15-20/weekend per benchmark.
- Together AI solo per batch-ingest Wiki LLM una-tantum ($0,07) + teacher-context con consenso.
- Student runtime chat SEMPRE EU-only (Gemini EU / Mistral FR / Qwen locale su Hetzner).

## Sprint S — Onniscenza + Onnipotenza Definitiva (26/04/2026)

**Goal**: realizzare definitivamente UNLIM onniscenza + onnipotenza via ralph loop con 5-agent team OPUS orchestrato. ClawBot come scheletro UNLIM. RunPod GPU on/off + Together AI fallback. Mac Mini autonomous H24.

**Iter 1 (26/04/2026 04:30-06:30 CEST)** — Foundation deployment:
- Pod `felby5z84fk3ly` RTX 6000 Ada 48GB creato + 5/6 servizi deployati (Ollama+VLM, BGE-M3+rerank, Whisper Turbo, FLUX.1, ClawBot stub OK; Coqui TTS recovery in corso, container disk 30GB tight)
- 4 token forniti + verificati: RunPod, Cloudflare (free, 0 zones, DNS Vercel), HuggingFace gated read, Voice clone Andrea pending (Downloads sandbox blocked → Andrea cp /tmp/voice.mp4)
- 11 nuovi script in `scripts/`: runpod-{bootstrap,pod-create,deploy-stack,r0-bench,stop,resume,status,auto-stop-after}, cloudflare-tunnel-setup, together-ai-fallback-wireup
- Pod STOPPED post-bench (storage $0.33/mo, modelli persisti su volume 50GB)
- 12291 PASS test baseline preservato
- 3 commit branch `feat/sprint-s-iter-1-runpod-trial-2026-04-26` mergiato via PR #51 main

**Iter 2 (26/04/2026 09:30-13:30 CEST)** — SOFTWARE-only ralph loop (pod EXITED throughout, host saturo):
- 5-agent OPUS Pattern S: planner+architect+gen-app+gen-test+scribe parallel via Agent tool
- PR cascade #34-#41 scoperto già MERGED (PDR claim "OPEN draft" obsoleto)
- Task A UNLIM synthesis prompt v3: `buildCapitoloPromptFragment` impl in `_shared/capitoli-loader.ts` (+131 lines), `validatePrincipioZero` impl `_shared/principio-zero-validator.ts` NEW, BASE_PROMPT v3 revisione `_shared/system-prompt.ts` (sintesi default + USO DELLE FONTI rules + LINGUAGGIO OBBLIGATORIO "Ragazzi,"), wire-up `unlim-chat/index.ts:228-330` con defensive try/catch
- Task B UI citazioni inline: NOT done iter 2 (defer iter 3, solo CSS module toccato)
- Task C R0 baseline LIVE measured: **75.81% WARN** (target 85%) su Render endpoint; gap critici `plurale_ragazzi` 0/10 + `citation_vol_pag` 0/10 (atteso lift dramatic post BASE_PROMPT v3 deploy)
- Task D Mac Mini Wiki batch: dispatched 5 concepts (analog-read+digital-write+pin-mode+ohm+amperometro), DONE attempt 2/12 ~10min, +2 nuovi (ohm.md + amperometro.md), 50→52 concepts
- Task E ADR-008 buildCapitoloPromptFragment + ADR-009 principio-zero-validator-middleware (~600 righe each)
- Task F audit + handoff + CLAUDE.md update (questa sezione)
- Iter 4 stress test smoke prod: ✅ HTTP 200 + 0 errori console + screenshot evidence
- Iter 8 E2E flow: PARTIAL (login gate richiede chiave univoca, deferito iter 12+ con fixture auth)
- CoV: vitest **12532 PASS + 8 todo** (+34 vs baseline 12498, ZERO regressioni), build **PASS 13m54s** (obfuscation lenta + esbuild CSS warnings non-fatal)
- Pod resume retry poll background PID 10470: 8/32 attempts FAIL "not enough free GPUs on host machine" durante intero iter

**SPRINT_S_COMPLETE 10 boxes** (post iter 2 close, score onesto 1.5 → 2.0/10):
1. ✅ VPS GPU deployed (RunPod pod paid storage, EXITED iter 2 throughout host saturo)
2. ⚠️ 7-component stack live (5/7 iter 1 deploy, depend pod resume iter 3)
3. ❌ 6000 RAG chunks Anthropic Contextual ingest (depend GPU)
4. ⚠️ ~52 Wiki LLM concepts (+2 iter 2, 52% verso 100)
5. ⚠️ UNLIM synthesis prompt v3 wire-up code shipped (NON deployato Supabase prod, gate Andrea autonomous deploy NO)
6. ❌ Hybrid RAG live (depend GPU)
7. ❌ Vision flow live (depend GPU)
8. ❌ TTS+STT Italian (depend GPU + voice clone Andrea pending)
9. ⚠️ R0 baseline measured 75.81% WARN (R5 ≥90% target Sprint S iter 5+ post deploy)
10. ❌ ClawBot 80-tool dispatcher live (Sprint 6 Day 39 post R5 PASS)

**Pattern S 5-agent OPUS** (replaces Pattern B):
- planner-opus + architect-opus + generator-app-opus + generator-test-opus + scribe-opus
- Communication: filesystem `automa/team-state/messages/`
- CoV per agente: 3x verify (test PASS, build PASS, baseline preserved)
- /quality-audit orchestratore fine ogni iter
- Stress test Playwright + Control Chrome ogni 4 iter su https://www.elabtutor.school

**RunPod cost discipline (CRITICAL)**:
- RUNNING $0.74/h (RTX 6000 Ada) — solo durante lavoro attivo
- EXITED (stopped) $0.33/mo storage 50GB volume
- TERMINATED $0 ma volume eliminato (modelli da re-scaricare)
- Rule: STOP pod immediato post-task. RESUME quando bench/test serve.

**RunPod pilot**:
```bash
export ELAB_RUNPOD_POD_ID="felby5z84fk3ly"
bash scripts/runpod-status.sh $ELAB_RUNPOD_POD_ID    # query state
bash scripts/runpod-resume.sh $ELAB_RUNPOD_POD_ID    # ~2min boot
bash scripts/runpod-stop.sh $ELAB_RUNPOD_POD_ID      # max savings
ssh -i ~/.ssh/id_ed25519_runpod root@<IP> -p <PORT>  # SSH dedicated key
```

**Mac Mini autonomous H24 LIVE**:
- launchctl `com.elab.mac-mini-autonomous-loop` PID 23944
- SSH `progettibelli@100.124.198.59` via `~/.ssh/id_ed25519_elab` (MacBook only)
- Wiki batch overnight target 100+ concepts kebab-case
- Branch pattern: `mac-mini/wiki-concepts-batch-YYYYMMDD-HHMMSS`

**SSH Key Policy ENFORCED**:
- `id_ed25519_elab`: SOLO MacBook locale, MAI archive GitHub/cloud
- `id_ed25519_runpod`: dedicated RunPod, public uploaded RunPod account
- Mac Mini ha SOLO `authorized_keys` (public key MacBook)

**Together AI Fallback Gated** (Sprint S iter 3+ wire-up):
- File scaffold: `scripts/together-ai-fallback-wireup.ts`
- Chain: RunPod/Hetzner EU → Gemini EU → Together AI (gated emergency_anonymized)
- Block: student runtime SEMPRE bloccato su Together AI
- Audit: every Together call logged `together_audit_log` Supabase

**Files Sprint S iter 1**:
- `docs/pdr/PDR-SPRINT-S-ITER-2-RALPH-LOOP-5-AGENT-2026-04-26.md` ← MASTER iter 2
- `docs/pdr/PDR-SPRINT-S-ONNISCENZA-ONNIPOTENZA-2026-04-27.md`
- `docs/pdr/PDR-SPRINT-S-APPENDIX-2026-04-27.md`
- `docs/handoff/2026-04-26-ralph-loop-handoff.md`
- `docs/architectures/STACK-V3-DEFINITIVE-2026-04-26.md`
- `docs/strategy/2026-04-26-master-plan-v2-comprehensive.md`
- `docs/audits/2026-04-26-sprint-s-iter1-runpod-trial-prep.md`
- `docs/audits/2026-04-26-sprint-s-iter1-FINAL-AUDIT.md`

**Files Sprint S iter 2** (ralph loop SOFTWARE-only, branch `feat/sprint-s-iter-2-software-prompt-v3-wireup-2026-04-26`):
- `automa/team-state/sprint-contracts/sprint-S-iter-2-contract.md` (orchestrator)
- `automa/team-state/messages/{planner,architect,gen-test,gen-app,scribe}-opus-to-*-2026-04-26*.md` (7 inter-agent messages)
- `automa/tasks/pending/ATOM-S2-A-{01..07}.md` + `ATOM-S2-B-{01..05}.md` (12 atomic tasks by planner-opus)
- `docs/adrs/ADR-008-buildCapitoloPromptFragment-design.md` (architect-opus, 424 righe)
- `docs/adrs/ADR-009-principio-zero-validator-middleware.md` (architect-opus, 563 righe)
- `supabase/functions/_shared/capitoli-loader.ts` (gen-app, +131 buildCapitoloPromptFragment)
- `supabase/functions/_shared/principio-zero-validator.ts` (gen-app, NEW, 6 PZ rules runtime)
- `supabase/functions/_shared/system-prompt.ts` (gen-app, BASE_PROMPT v3 sintesi+citazione+plurale)
- `supabase/functions/unlim-chat/index.ts` (gen-app, wire-up Capitolo + post-LLM PZ validation)
- `tests/unit/buildCapitoloPromptFragment.test.js` (gen-test, 9 test PASS)
- `tests/unit/principioZeroValidator.test.js` (gen-test, 19 PASS + 8 todo bench-only)
- `tests/integration/unlim-chat-prompt-v3.test.js` (gen-test, 6 PASS)
- `scripts/bench/run-sprint-r0-render.mjs` (gen-test, R0 baseline runner Render endpoint)
- `scripts/bench/output/r0-render-{report,responses,scores}-2026-04-26T09-35-59-692Z.{md,jsonl,json}` (R0 baseline 75.81% WARN)
- `docs/audits/2026-04-26-sprint-s-iter2-audit.md` (scribe-opus, 246 righe FINAL)
- `docs/audits/2026-04-26-sprint-s-iter4-stress-smoke.md` (orchestrator, Playwright smoke iter 4)
- `docs/audits/iter4-smoke-prod-2026-04-26.png` (Playwright screenshot evidence)
- `docs/handoff/2026-04-26-sprint-s-iter2-handoff.md` (scribe-opus, 109 righe activation iter 3)
- `docs/unlim-wiki/concepts/{ohm,amperometro}.md` (Mac Mini batch 5/5 success, +2 nuovi 50→52)
- `docs/unlim-wiki/concepts/{analog-read,digital-write,pin-mode}.md` (Mac Mini batch overwrite, Tea review consigliato)
- `docs/unlim-wiki/{index,log}.md` (scribe-opus aggiorna catalog)

**Activation prompt next session**: see `docs/handoff/2026-04-26-sprint-s-iter2-handoff.md` §"Activation prompt iter 3".

