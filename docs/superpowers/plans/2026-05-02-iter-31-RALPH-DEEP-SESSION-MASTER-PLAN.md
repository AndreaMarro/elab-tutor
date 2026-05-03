# Iter 31 RALPH Deep Session Master Plan — Sprint T close approach + Sprint U Cycle 2 + Mac Mini persona-prof + 5 metric skills

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal**: chiudere Sprint T 8.5/10 ONESTO + avviare Sprint U Cycle 2 fix con team caveman 6-agent OPUS + Mac Mini persona-prof simulazione H24 + 5 nuove skill metriche (PRINCIPIO ZERO + Morfismo + Onniscenza + Velocità+latenze + Onnipotenza) — tutto con CoV obbligatorio + non compiacenza.

**Architecture**: ralph loop dynamic-pacing + Pattern S 6-agent OPUS PHASE-PHASE (planner + architect + maker-1 + maker-2 + tester-1 + scribe) caveman mode + Mac Mini persona-professore-inesperto cron `*/10 * * * *` + skill creator 4-NEW + benchmark gates inter-sprint via `systematic-debugging` + `quality-audit`.

**Tech stack**: React 19 + Vite 7 + Vitest 13474 baseline + Supabase Edge v72 prod + Mistral La Plateforme primary + Voxtral TTS clone Andrea + Pixtral Vision EU FR + CF Workers AI FLUX schnell + Whisper STT + Voyage embed (PARTIAL — page=0% blocker, Mistral mistral-embed pivot via Phase E iter 39 commit `c575aa2`) + Mac Mini Tailscale SSH + GitHub deploy key + Playwright headless + Control Chrome MCP MacBook + Control macOS MCP MacBook.

**Anti-inflation**: G45 cap mandate. NO compiacenza. CoV obbligatorio ogni atom. NO bypass hooks. NO push main. NO destructive ops.

---

## §0. Allineamento prerequisito — 4 definizioni canoniche

Prima di iniziare ogni atom, agente DEVE rileggere le 4 definizioni nel `CLAUDE.md` "DUE PAROLE D'ORDINE" sezione + sprint history footer iter 41 chiusura:

1. **PRINCIPIO ZERO** — docente=tramite, UNLIM=strumento, ragazzi=kit fisici, plurale "Ragazzi", Vol/pag verbatim, kit ELAB mention OBBLIGATORI, no parafrasi
2. **MORFISMO** — Sense 1 (57 ToolSpec L1+L2+L3) + Sense 1.5 (per-docente per-classe per-UI runtime) + Sense 2 (triplet kit Omaric ↔ volumi Davide ↔ software lockstep, palette Navy/Lime/Orange/Red, NanoR4Board SVG identico, font Oswald+Open Sans+Fira Code)
3. **ONNISCENZA** — 7-layer aggregator V1 active prod (`ONNISCENZA_VERSION=v1`) + classifier 6 categorie pre-LLM topK 0/2/3 + anti-absurd validator post-LLM NER + pin check
4. **ONNIPOTENZA** — L0 direct API + L1 composite handler + L2 template router + L3 Deno 12-tool dispatcher canary 5% + surface-to-browser intent parser + Mistral function calling canonical R7 ≥95% target

**Gate atomic ogni step**: agente caveman mode + CoV 3× verify (vitest baseline 13474 preserve, build PASS, prod live verify se applicabile) + non compiacenza output.

---

## §1. File structure — file da creare/modificare

### §1.1 NEW skills (4 nuove + 1 extend)

**Sub-skill creator path**: `superpowers:skill-creator` per creazione 4 NEW skills.

| File | Scope | Estimated LOC |
|---|---|---|
| Create: `~/.claude/skills/elab-morfismo-validator/SKILL.md` | Morfismo Sense 1+1.5+2 measure runtime | ~250 |
| Create: `~/.claude/skills/elab-onniscenza-measure/SKILL.md` | Onniscenza 7-layer coverage + classifier accuracy + anti-absurd flag rate | ~250 |
| Create: `~/.claude/skills/elab-velocita-latenze-tracker/SKILL.md` | p50/p95/p99 latency + cold start + warmup cron + 4G LIM realistic | ~250 |
| Create: `~/.claude/skills/elab-onnipotenza-coverage/SKILL.md` | Tool coverage L0/L1/L2/L3 + INTENT parser fire-rate + canary stage tracking | ~250 |
| Extend: `~/.claude/skills/elab-principio-zero-validator/SKILL.md` | Add Vol/pag verbatim ≥95% gate + plurale + kit ELAB scoring | +50 |

### §1.2 NEW handoff + brief docs

| File | Scope | LOC |
|---|---|---|
| Create: `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md` | Mac Mini persona simulation atomic checklist mappatura ALL elementi | ~700 |
| Create: `docs/handoff/2026-05-02-tea-iter-31-brief.md` | Tea brief iter 31 — wiki dedup + UAT manuale + design feedback | ~350 |
| Create: `docs/audits/2026-05-02-iter-31-tools-plugins-inventory.md` | MacBook + Mac Mini plugins+connectors+MCPs full inventory | ~500 |

### §1.3 Docs continuativi (ralph loop output)

| File | Scope | Cadenza |
|---|---|---|
| `automa/state/iter-31-progress.md` | Heartbeat ogni atom completion | per-atom |
| `docs/audits/iter-31-cov-baseline.md` | CoV vitest+build baseline ogni Phase close | per-Phase |
| `docs/audits/iter-31-systematic-debug-{N}.md` | systematic-debugging output inter-Phase | per-Phase boundary |
| `docs/audits/iter-31-quality-audit-{N}.md` | quality-audit output post-Phase | per-Phase close |
| `docs/audits/auto-mac-mini/_persona-prof/{date}-{cycle}.md` | Mac Mini persona simulation cycle output | per-cron-run |

---

## §2. Phase decomposition — 7 phases

### Phase 0 — Prerequisites + 4 definizioni alignment (estimated 30min)

- [ ] **Step 0.1**: Agent reads CLAUDE.md "DUE PAROLE D'ORDINE" + sprint history footer
- [ ] **Step 0.2**: Agent reads `docs/superpowers/plans/PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md` Phase 0 + Phase 1 already DONE 2026-05-02
- [ ] **Step 0.3**: Agent reads `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md` (created iter 30 docs-only)
- [ ] **Step 0.4**: Agent runs CoV pre-flight: `npx vitest run` should PASS 13474 baseline (or 13473 per Mac Mini env audit)
- [ ] **Step 0.5**: Agent runs `npm run build` should PASS ~14min
- [ ] **Step 0.6**: Commit baseline tag: `git tag baseline-iter31-$(date +%H%M)` (NOT push, local marker)

**Acceptance gate Phase 0**:
- [ ] vitest 13474 PASS verified
- [ ] build PASS verified
- [ ] baseline tag created
- [ ] `automa/state/iter-31-progress.md` Phase 0 ✅

---

### Phase 1 — 4 NEW skill creation (caveman team, parallel) (estimated 4h)

**Pattern S 4-agent OPUS PHASE-PHASE r3** parallel skill creation:

#### Skill 1: elab-morfismo-validator (Maker-1 caveman)

- [ ] **Step 1.1.1**: Read `superpowers:skill-creator` + `superpowers:writing-skills` patterns
- [ ] **Step 1.1.2**: Read existing skill template `~/.claude/skills/elab-principio-zero-validator/SKILL.md`
- [ ] **Step 1.1.3**: Define skill metadata YAML frontmatter:
   ```yaml
   ---
   name: elab-morfismo-validator
   description: Use when validating ELAB Tutor Morfismo Sense 1 (technical runtime) + Sense 1.5 (per-docente/classe/UI) + Sense 2 (triplet kit Omaric ↔ volumi Davide ↔ software). Measures palette compliance, NanoR4Board SVG identity, font usage, ToolSpec count drift, lesson-paths coverage.
   ---
   ```
- [ ] **Step 1.1.4**: Define 10 measurement gates:
   - **G1 Palette compliance**: regex `var(--elab-{navy|lime|orange|red})` count vs hex literal count → ≥80% var usage in src/components/
   - **G2 NanoR4Board SVG identity**: SHA-256 `src/components/simulator/canvas/NanoR4Board.jsx` vs canonical iter S19 baseline
   - **G3 Font usage**: grep `Oswald|Open Sans|Fira Code` count in src/styles/ vs other font names
   - **G4 ToolSpec count**: `grep -cE "name: ['\"]" scripts/openclaw/tools-registry.ts` → expected 57 (sync ADR-028 §3 corrected iter 37)
   - **G5 Lesson-paths coverage**: count `src/data/lesson-paths/v{1,2,3}-cap*-esp*.json` → expected 89 (5 missing iter 36 D3)
   - **G6 Volume references coverage**: count entries `volume-references.js` enriched → expected 94/94
   - **G7 27 Lezioni grouping**: `src/data/lesson-groups.js` lesson count = 27
   - **G8 ElabIcons SVG inline**: count `<svg` in `src/components/common/ElabIcons.jsx` → expected ≥24 icone
   - **G9 NO emoji as icon**: grep `[\u{1F300}-\u{1FAFF}]` in src/components/ NOT in HomePage cards explicit-allowed Andrea iter 36
   - **G10 Data-attribute morphic**: count `data-mode|data-modalita|data-class-key` in src/components/ → expected ≥10 morphic markers
- [ ] **Step 1.1.5**: Write SKILL.md body con formula scoring + bash commands measure
- [ ] **Step 1.1.6**: CoV: invoke skill via `Skill` tool dry-run output should produce 10-line table
- [ ] **Step 1.1.7**: Commit atomic `feat(skills/iter-31): elab-morfismo-validator NEW` (locale only, push Phase 7)

#### Skill 2: elab-onniscenza-measure (Maker-2 caveman)

- [ ] **Step 1.2.1**: Define skill metadata frontmatter
- [ ] **Step 1.2.2**: Define 8 measurement gates:
   - **G1 7-layer coverage**: count layers wired in `_shared/onniscenza-bridge.ts` + `state-snapshot-aggregator.ts` (target 7/7)
   - **G2 Classifier accuracy**: 6-cat regex `_shared/onniscenza-classifier.ts` test 30/30 PASS verify
   - **G3 RAG chunks count + coverage**: SQL `SELECT COUNT(*), AVG(CASE WHEN page IS NOT NULL THEN 1 ELSE 0 END) FROM rag_chunks` → expected 1881+ + page≥80%
   - **G4 Wiki concepts count**: `ls docs/unlim-wiki/concepts/*.md | wc -l` → expected ≥126
   - **G5 Hybrid retriever recall@5**: bench `r6-fixture.jsonl` 100-prompt against `cfBgeM3Embed` + RRF k=60 → target ≥0.55
   - **G6 Anti-absurd flag rate**: query Edge Function logs `anti_absurd_flag` rate → expected <5%
   - **G7 Conversation history embed cache hit rate**: query telemetry `conversation_history_embed_cache_hit` → expected ≥40%
   - **G8 V1 vs V2 ratio**: env `ONNISCENZA_VERSION=v1` confirm + zero V2 calls last 24h
- [ ] **Step 1.2.3**: Write SKILL.md
- [ ] **Step 1.2.4**: CoV dry-run
- [ ] **Step 1.2.5**: Commit atomic

#### Skill 3: elab-velocita-latenze-tracker (Tester-1 caveman)

- [ ] **Step 1.3.1**: Define skill metadata frontmatter
- [ ] **Step 1.3.2**: Define 9 measurement gates:
   - **G1 R5 50-prompt p50/p95/p99**: run `scripts/bench/run-sprint-r5-stress.mjs` + parse output → target p95 <2500ms (PDR target)
   - **G2 R5 cold start latency**: first prompt post 5min idle Edge Function → target <4000ms
   - **G3 R5 warmup cron effective**: query Supabase pg_cron `cron.job_run_details` `unlim-chat-warmup` ≥48 runs/day
   - **G4 STT CF Whisper round-trip**: bench Voxtral output → CF Whisper STT → target <800ms
   - **G5 TTS Voxtral synthesize p50**: 100-char Italian → mp3 generation → target <1500ms
   - **G6 Vision Pixtral first-byte**: 1 image + prompt → target <3500ms
   - **G7 FLUX schnell imagegen**: 1024² 4-step → target <2500ms
   - **G8 Frontend Lighthouse perf**: PageSpeed Insights `#chatbot-only` + `#about-easter` → target ≥70 intermediate (≥90 final iter 42+)
   - **G9 4G LIM realistic loadtime**: throttle 4G slow + first contentful paint → target <3500ms LIM realistic
- [ ] **Step 1.3.3**: Write SKILL.md
- [ ] **Step 1.3.4**: CoV dry-run
- [ ] **Step 1.3.5**: Commit atomic

#### Skill 4: elab-onnipotenza-coverage (Tester-2 caveman, can be Maker-3 if Tester-1 free)

- [ ] **Step 1.4.1**: Define skill metadata frontmatter
- [ ] **Step 1.4.2**: Define 9 measurement gates:
   - **G1 L0 direct API count**: `grep -E "window.__ELAB_API.unlim.\\w+" src/services/simulator-api.js` → expected ≥26
   - **G2 L1 composite handler tests**: `composite-handler.test.ts` should PASS 10/10
   - **G3 L2 template router count**: `clawbot-templates.ts` inlined count → expected 20 + JSON catalog 22 (drift +2 iter 36 D2)
   - **G4 L3 Deno 12-tool subset**: count `scripts/openclaw/postToVisionEndpoint.ts` + dispatcher 12-tool entries
   - **G5 INTENT parser fire-rate prod**: query Supabase Edge logs `intents_parsed.length > 0` rate → target ≥30%
   - **G6 Mistral function calling canonical**: R7 200-prompt bench `args.id` canonical schema rate → target ≥95% (current 3.6% iter 38)
   - **G7 Canary CANARY_DENO_DISPATCH_PERCENT**: env value + actual fire-rate measure → expected env=5 OR widen
   - **G8 ENABLE_INTENT_TOOLS_SCHEMA env**: prod value → expected `true` post deploy v73+
   - **G9 Whitelist 12 actions intentsDispatcher**: `intentsDispatcher.js` ALLOWED_INTENT_ACTIONS array length = 12 + NO destructive verify
- [ ] **Step 1.4.3**: Write SKILL.md
- [ ] **Step 1.4.4**: CoV dry-run
- [ ] **Step 1.4.5**: Commit atomic

#### Skill 5: elab-principio-zero-validator extend (Maker-1 second pass)

- [ ] **Step 1.5.1**: Read existing `~/.claude/skills/elab-principio-zero-validator/SKILL.md`
- [ ] **Step 1.5.2**: Add 3 NEW gates:
   - **G+1 Vol/pag verbatim ≥95%**: bench R5 50-prompt regex `Vol\.\s*\d+\s*cap\.?\s*\d+\s*pag\.?\s*\d+` → target ≥95%
   - **G+2 Plurale "Ragazzi" ≥95%**: bench R5 50-prompt regex `\bRagazzi[,\s]` → target ≥95%
   - **G+3 Kit ELAB mention ≥80%**: bench R5 50-prompt regex `kit\s*ELAB|breadboard|Omaric|kit\s*fisico` → target ≥80%
- [ ] **Step 1.5.3**: CoV dry-run
- [ ] **Step 1.5.4**: Commit atomic

**Acceptance gate Phase 1**:
- [ ] 4 NEW skills created + frontmatter + body + measurement gates definite + bash commands embedded
- [ ] PZ validator extended con 3 NEW gates
- [ ] CoV dry-run output ognuna produce table risultati
- [ ] vitest 13474 baseline preserve (no test changes Phase 1)
- [ ] 5 commit atomici locali (push Phase 7)
- [ ] `docs/audits/iter-31-quality-audit-1.md` written by scribe (Phase 2 sequential)

**inter-Phase**: invoke `superpowers:systematic-debugging` to verify each skill works dry-run + invoke `superpowers:quality-audit` to verify CoV reportable.

---

### Phase 2 — Sprint U Cycle 2 fix execution (caveman team, parallel) (estimated 6h)

**Source**: `docs/handoff/sprint-u-cycle2-iter1-handoff.md` §4 + §5 (already exists from iter 39 Sprint U Cycle 1 audit close).

#### Atom 2.1 — L2 routing fix (Maker-1 caveman)

- [ ] **Step 2.1.1**: Read `supabase/functions/_shared/clawbot-template-router.ts:121-153` (catch-all blocker)
- [ ] **Step 2.1.2**: Verify Sprint U Cycle 2 fix iter 39 commit `430659a` already landed (per Phase 1 Opus baseline doc §3)
- [ ] **Step 2.1.3**: If NOT landed: implement scope reduce — short-circuit ONLY when `experimentId` exists AND prompt matches ≥3 of 5 categories (L2-explain-led-blink) instead of catch-all all 94 esperimenti
- [ ] **Step 2.1.4**: Add unit test `tests/unit/_shared/clawbot-template-router-scope-reduce.test.js` 10 cases (5 should-fire, 5 should-not-fire)
- [ ] **Step 2.1.5**: CoV: vitest run + count must increase by 10
- [ ] **Step 2.1.6**: Commit atomic `fix(iter-31-cycle2): L2 router scope reduce per Sprint U audit`

#### Atom 2.2 — Linguaggio codemod 73 lesson-paths (Maker-2 caveman)

- [ ] **Step 2.2.1**: List 73 lesson-paths con violations imperative singolare ("Premi Play" / "fai" / "clicca" / "monta" / "collega")
- [ ] **Step 2.2.2**: Codemod batch sed/python script: singolare imperative → plurale "Ragazzi, premete... fate... cliccate... montate... collegate..."
- [ ] **Step 2.2.3**: Verify NO regression strutturale — JSON schema valid post-codemod
- [ ] **Step 2.2.4**: Add `tests/unit/lesson-paths/linguaggio-plurale.test.js` 73 cases regex `\b(Premi|fai|clicca|monta|collega)\b` should NOT match
- [ ] **Step 2.2.5**: CoV vitest +73
- [ ] **Step 2.2.6**: Commit atomic

#### Atom 2.3 — Docente framing unlimPrompts batch fix (Maker-3 caveman, if available)

- [ ] **Step 2.3.1**: 94/94 unlimPrompts use "studente" → fix to "docente" framing
- [ ] **Step 2.3.2**: Files: `src/data/experiments-vol1.js` + `experiments-vol2.js` + `experiments-vol3.js` (3 JS aggregators)
- [ ] **Step 2.3.3**: Codemod regex replace OR manual edit per consistency
- [ ] **Step 2.3.4**: Add `tests/unit/experiments/docente-framing.test.js` 94 cases
- [ ] **Step 2.3.5**: CoV vitest +94
- [ ] **Step 2.3.6**: Commit atomic

#### Atom 2.4 — vol3 content mismatches + v3-cap8-serial bb1 fix (Tester-1 caveman)

- [ ] **Step 2.4.1**: Read Sprint U Cycle 1 audit `docs/audits/sprint-u-cycle1-iter1-audit-vol3.md`
- [ ] **Step 2.4.2**: Fix v3-cap6-esp4 prompt mismatch (semaforo vs effetto polizia)
- [ ] **Step 2.4.3**: Fix v3-cap8-serial circuit missing bb1 breadboard
- [ ] **Step 2.4.4**: Add E2E spec `tests/e2e/sprint-u-cycle2-vol3-fixes.spec.js`
- [ ] **Step 2.4.5**: CoV vitest + Playwright execution
- [ ] **Step 2.4.6**: Commit atomic

**Acceptance gate Phase 2**:
- [ ] L2 router scope reduce shipped + tests
- [ ] 73 lesson-paths linguaggio fixed + tests
- [ ] 94 unlimPrompts docente framing + tests
- [ ] vol3 content mismatches resolved + E2E
- [ ] vitest baseline 13474 + (~177 NEW tests) = 13651+ PASS
- [ ] systematic-debugging output verifies fixes are root-cause not symptom
- [ ] quality-audit output verifies no regressions introduced
- [ ] `docs/audits/iter-31-systematic-debug-2.md` + `iter-31-quality-audit-2.md` written

---

### Phase 3 — Mac Mini persona-prof simulation deploy (estimated 3h Andrea + Mac Mini autonomous)

**Source**: `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md` (NEW Phase 1 sub-task — see §3 dettaglio).

#### Atom 3.1 — Mac Mini audit script gap fixes per docs-only iter 30 analysis

- [ ] **Step 3.1.1**: Read `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md` defects 1-4
- [ ] **Step 3.1.2**: Fix defect 1 — route hash format `#tutor` → `#lavagna?exp=` + waitForFunction
- [ ] **Step 3.1.3**: Fix defect 2 — auth headers Path A explicit env injection from Mac Mini side
- [ ] **Step 3.1.4**: Fix defect 3 — precondition gate + null state cascade
- [ ] **Step 3.1.5**: Create wrapper bash `scripts/mac-mini-audit-experiment.sh` per gap analysis §6
- [ ] **Step 3.1.6**: Andrea action: SSH key Mac Mini → GitHub deploy key (5min Andrea + 15min auto)
- [ ] **Step 3.1.7**: Activate cron `*/10 * * * *` Mac Mini side
- [ ] **Step 3.1.8**: CoV: 1 audit run end-to-end via cron should produce `audit-data.json` + JSON valid + git push success

#### Atom 3.2 — Mac Mini persona-prof script extend

- [ ] **Step 3.2.1**: Create `tests/e2e/mac-mini-persona-professore-inesperto.spec.js` per persona doc atomic checklist
- [ ] **Step 3.2.2**: Steps simulation: WelcomePage → entra class_key → vede HomePage → click "Provare ELAB" → Lavagna mount → "Aprite simulatore" → drag-drop componente → connect wire → click "Esegui" → osserva LED blink → click UNLIM "Ehi UNLIM" → speak "Spiega questo esperimento" → captureScreenshot fumetto → click "Successivo" → next esperimento
- [ ] **Step 3.2.3**: Mappatura ALL elementi UI: HomePage cards + Lavagna toolbar + ChatOverlay UNLIM bubble + Modalità switch + FloatingWindow Passo Passo + 5-tools palette ChatbotOnly + EasterModal trigger
- [ ] **Step 3.2.4**: 94 esperimenti loop con persona-prof checklist applicata
- [ ] **Step 3.2.5**: Audit output: design issues + estetica issues + funzionalità issues separate buckets
- [ ] **Step 3.2.6**: Aggregator script `scripts/mac-mini-render-persona-prof-md.mjs` produce `_dashboard-persona-prof.html` + trend arrows

**Acceptance gate Phase 3**:
- [ ] Mac Mini cron `*/10 * * * *` LIVE active
- [ ] Persona-prof spec mappa 94 esperimenti completo
- [ ] Aggregator HTML dashboard published GitHub Pages OR `docs/audits/auto-mac-mini/_persona-prof/`
- [ ] First 24h soak run verified Andrea visibility GitHub mobile

**inter-Phase**: invoke `superpowers:systematic-debugging` post first cron sweep — diagnose any Phase 3 spec defects.

---

### Phase 4 — Phase 2 PRINCIPIO ZERO Vol/pag verbatim 95% (estimated 4h Andrea + Maker-1)

**Source**: PIANO Phase 2 — Andrea actions sequential queue ~90min.

- [ ] **Step 4.1**: Andrea: Voyage AI signup OR mistral-embed env confirmed (mem-search keys verified iter 39 Phase E pivot)
- [ ] **Step 4.2**: Andrea: ratify ADR-033 page metadata extraction strategy (15min)
- [ ] **Step 4.3**: Andrea: env provision SUPABASE_SERVICE_ROLE_KEY (5min)
- [ ] **Step 4.4**: Maker-1 caveman: run `node scripts/rag-ingest-mistral-batch-v2.mjs` (50min, ~$1) — Mistral mistral-embed pivot
- [ ] **Step 4.5**: Maker-1: verify page coverage ≥80% via SQL `SELECT COUNT(*), AVG(CASE WHEN metadata->>'page' IS NOT NULL THEN 1 ELSE 0 END) FROM rag_chunks`
- [ ] **Step 4.6**: Maker-1: deploy Edge Function v73+ con BASE_PROMPT v3.2 (5→8 few-shot + post-LLM regex validator stricter + L2 router widen `shouldUseIntentSchema`)
- [ ] **Step 4.7**: Tester-1: smoke 5 prompts cherry-pick verify Vol/pag verbatim
- [ ] **Step 4.8**: Tester-1: trigger R7 200-prompt re-bench (30min, target ≥80% canonical)
- [ ] **Step 4.9**: invoke skill `elab-principio-zero-validator` extended → measure G+1 Vol/pag ≥95% gate
- [ ] **Step 4.10**: invoke skill `elab-onniscenza-measure` → G3 RAG chunks coverage ≥80% gate

**Acceptance gate Phase 4**:
- [ ] Voyage→Mistral re-ingest complete + page coverage ≥80%
- [ ] Edge Function v73+ deployed prod
- [ ] R5 50-prompt PASS PZ V3 ≥95% Vol/pag verbatim verified post-deploy
- [ ] R7 200-prompt canonical ≥80% verified post-deploy
- [ ] G+1 + G+2 + G+3 PZ validator gates PASS
- [ ] G3 Onniscenza measure RAG chunks coverage ≥80%
- [ ] vitest 13651+ baseline preserve

**inter-Phase**: invoke `superpowers:systematic-debugging` if R7 ≥80% NOT achieved → root cause analysis L2 template scope vs Mistral function calling firing rate.

---

### Phase 5 — Onniscenza V2.1 conversational fusion + canary stage 5%→25%→100% (estimated 4h)

#### Atom 5.1 — Re-bench V2.1 vs V1 fair comparison

- [ ] **Step 5.1.1**: Architect agent: re-design V2.1 fair comparison (V2 reverted iter 39 commit `eb4a11b` -1.0pp PZ V3 + 36% slower)
- [ ] **Step 5.1.2**: Maker-1: V2.1 conversational fusion `aggregateOnniscenzaV21` already shipped iter 41 commit `2abe26d`
- [ ] **Step 5.1.3**: Tester-1: bench R5 V1 baseline + V2.1 canary 5% → measure PZ V3 + latency p95 + recall@5
- [ ] **Step 5.1.4**: Decision: V2.1 stays canary 5% OR ramp 25%→100% OR revert
- [ ] **Step 5.1.5**: Telemetry monitor 24h soak no false positives anti-absurd

#### Atom 5.2 — Deno dispatcher 12-tool canary ramp

- [ ] **Step 5.2.1**: Andrea ratify: ADR-032 PROPOSED → ACCEPTED (10min)
- [ ] **Step 5.2.2**: Maker-1: implement 12-tool subset `scripts/openclaw/postToVisionEndpoint.ts` + dispatcher 12-tool entries (highlight + mountExperiment + captureScreenshot + ...)
- [ ] **Step 5.2.3**: Edge Function deploy v74+ con dispatcher wired post-LLM
- [ ] **Step 5.2.4**: Canary stage `CANARY_DENO_DISPATCH_PERCENT=5` → 24h soak → 25% → 24h soak → 100%
- [ ] **Step 5.2.5**: invoke skill `elab-onnipotenza-coverage` → G7 canary stage tracking

#### Atom 5.3 — C3 widened canary `shouldUseIntentSchema` ramp

- [ ] **Step 5.3.1**: Verify C2 anti-absurd telemetry 24h soak no false positives (Decisione #8 priority matrix iter 30)
- [ ] **Step 5.3.2**: Andrea ratify: 5% → 25% → 100% widened heuristic
- [ ] **Step 5.3.3**: invoke skill `elab-onnipotenza-coverage` → G6 R7 canonical ≥95% target

**Acceptance gate Phase 5**:
- [ ] V2.1 vs V1 decision documented (`docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md` ratified)
- [ ] Deno dispatcher canary 25%+ stage achieved
- [ ] C3 widened canary 25%+ stage achieved
- [ ] G7 + G8 + G9 onnipotenza coverage gates PASS
- [ ] vitest baseline preserve

**inter-Phase**: invoke `superpowers:quality-audit` post canary 25% stage — verify no regressions latency/quality.

---

### Phase 6 — Wake word "Ehi UNLIM" + 9-cell STT matrix verify + plurale prepend (estimated 2h)

#### Atom 6.1 — 9-cell STT matrix execution

- [ ] **Step 6.1.1**: Tester-1: execute `tests/e2e/sprint-t-iter41-wake-word-9-cell.spec.js`
- [ ] **Step 6.1.2**: 9 cells = 3 STT engines × 3 mic permission states (granted/denied/prompt)
- [ ] **Step 6.1.3**: Mac Mini parallel run via persona-prof spec extension
- [ ] **Step 6.1.4**: Output: 9-cell matrix table results + flag failures

#### Atom 6.2 — Wake word "Ragazzi" plurale prepend (Decisione #5 implicit OK iter 30)

- [ ] **Step 6.2.1**: Surgical edit `src/services/wakeWord.js` `WAKE_PHRASES` array
- [ ] **Step 6.2.2**: Add 'ragazzi unlim' / 'ragazzi un lim' / 'ragazzi anelim' variants
- [ ] **Step 6.2.3**: Update `tests/unit/services/wakeWord-ragazzi-plurale.test.js` (12 tests already shipped iter 41)
- [ ] **Step 6.2.4**: CoV vitest baseline preserve

**Acceptance gate Phase 6**:
- [ ] 9-cell STT matrix 9/9 PASS OR documented failures with root cause
- [ ] Wake word plurale prepend live verify
- [ ] Mic permission UX nudge verify (`MicPermissionNudge.jsx` iter 38)

---

### Phase 7 — CoV finale + commit + push + Andrea Opus G45 review (estimated 3h)

- [ ] **Step 7.1**: Final CoV run — vitest full + build + R5 + R6 + R7 stress + Lighthouse + Mac Mini cron 24h soak verify
- [ ] **Step 7.2**: Aggregate audit: invoke 5 skills → produce `docs/audits/iter-31-FINAL-audit.md` consolidated
- [ ] **Step 7.3**: Pre-commit hook NEVER bypass `--no-verify`
- [ ] **Step 7.4**: Pre-push hook NEVER bypass — quick regression check
- [ ] **Step 7.5**: Push origin `e2e-bypass-preview` branch (NOT main)
- [ ] **Step 7.6**: Andrea: spawn Opus G45 indipendente review session context-zero post Phase 6 close — verify cumulative score ONESTO
- [ ] **Step 7.7**: Score Opus ≤ 8.5 (Sprint T close target ONESTO 10gg per Decisione #7) OR justified ≥ con razionale concreto
- [ ] **Step 7.8**: CLAUDE.md sprint history footer recalibrate post Opus

**Acceptance gate Phase 7**:
- [ ] Score Opus indipendente 8.5/10 ONESTO confirmed
- [ ] All 5 skills measured + dashboard aggregated
- [ ] vitest 13651+ baseline + new tests
- [ ] Build PASS pre-push hook NOT bypassed
- [ ] CLAUDE.md sprint history updated
- [ ] iter-31 close audit doc shipped
- [ ] Andrea ratify queue Batch 1 (8 decisioni iter 30 priority matrix Q1) closed

---

## §3. Mac Mini persona-prof checklist atomica (cross-link)

Vedi `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md` per checklist completa 200+ items mappatura ALL elementi UI + 94 esperimenti loop + persona-prof workflow.

Sintesi qui:
- **Stage 1 — First impression** (5 min/cycle): WelcomePage entry → HomePage view → mascotte UNLIM observation → 4 modalità switch test
- **Stage 2 — Lavagna mount** (10 min/cycle): click "Provare ELAB" → Lavagna mount → toolbar 4 strumenti core (Pen/Wire/Select/Delete) test → AI command bar UNLIM test
- **Stage 3 — Drag & drop simulator** (15 min/cycle): RetractablePanel left 8 componenti quick-add → drag breadboard → drag Arduino Nano R4 → drag LED + R 220Ω → connect wire D13 to LED anode → connect GND
- **Stage 4 — Code Arduino + Scratch** (15 min/cycle): apri Code panel → modifica blink → compile → upload → osserva LED blink → swap to Scratch → drag block "ripeti" + "accendi LED" → run
- **Stage 5 — UNLIM interaction** (10 min/cycle): click mascotte UNLIM → "Spiega questo esperimento" → osserva risposta plurale "Ragazzi" + Vol/pag verbatim + kit ELAB mention + analogia → speak "Ehi UNLIM mostra blink" → osserva azione INTENT executed
- **Stage 6 — Vision + Fumetto** (5 min/cycle): captureScreenshot → fumetto report fine-sessione MVP iter S19 (NOT wired Lavagna route iter 36 carryover) → Vision Pixtral test "guarda il mio circuito"
- **Stage 7 — Persona-prof critical eval** (5 min/cycle): docente inesperto can guess workflow without prior knowledge? Y/N + UX issues + estetica issues + funzionalità issues separate buckets

Total per cycle ~65min × 94 esperimenti = ~100h Mac Mini autonomous H24 cron `*/10 * * * *` 1 esperimento/10min → 24h/giorno × 6 esperimenti/h = 144 cycles/24h. Full sweep 94 esperimenti < 16h.

---

## §4. Tea brief iter 31 (cross-link)

Vedi `docs/handoff/2026-05-02-tea-iter-31-brief.md` per brief completo Tea iter 31:
- T1: Wiki cleanup batch 70 HIGH issues T2 audit + 76 NON-auditati Top-10 priority spot-check
- T2: UAT manuale 94 esperimenti checklist mappatura UX issues design+estetica+funzionalità
- T3: Tres Jolie volumi cartacei parallelismo audit (mockup + 600 LOC table per cap)
- T4: Cronologia ChatGPT-style sidebar prototype (Mac Mini Task 5 in autonomous plan)
- T5: Glossario port `https://elab-tutor-glossario.vercel.app` integration main app
- T6: 4 GIF scimpanze + ScimpanzeFallback SVG audit estetica + LIM-projection contrast
- T7: Persona-prof Mac Mini cycle review settimanale — Tea valida findings critical
- T8: Brand voice content generation per landing /scuole + onboarding 3-click iter S19+

---

## §5. Tools+plugins inventory (cross-link)

Vedi `docs/audits/2026-05-02-iter-31-tools-plugins-inventory.md` per inventario completo:
- **MacBook**: Control Chrome MCP + Control macOS MCP + claude-mem + claude-context + 67 MCP server tools deferred + 30+ subagent specialists
- **Mac Mini**: Tailscale SSH + Playwright headless + Node 22.13.1 + cron `*/10` + GitHub deploy key + autonomous loop launchctl
- **Plugins claude-plugins-official**: superpowers + ultrathink + ultrareview + claude-mem + agent-orchestration + caveman + skill-creator + writing-plans + executing-plans + systematic-debugging + quality-audit
- **Custom skills**: 8 ELAB skills existing + 4 NEW iter 31 (morfismo + onniscenza + velocità + onnipotenza) + 1 extend (PZ validator)
- **Connettori esterni**: Supabase + Vercel + Cloudflare Workers AI + Mistral La Plateforme + Voyage AI (alt) + GitHub + Notion (legacy) + Figma + Sentry + PostHog (potential)

---

## §6. Benchmark gates inter-sprint

Tra Sprint T iter 31 close e Sprint U Cycle 3+ entrance, MANDATORY:

1. **systematic-debugging** between Phase 1 ↔ 2, Phase 2 ↔ 3, Phase 4 ↔ 5, Phase 5 ↔ 6
2. **quality-audit** post-Phase ognuno (1, 2, 3, 4, 5, 6)
3. **CoV ogni atom**: vitest 13474 → 13651+ progressive baseline, build PASS, R5+R6+R7 stress

Failure to invoke systematic-debugging + quality-audit → rejected commit.

---

## §7. Multi-agent optimize (caveman team architecture)

**Pattern S 6-agent OPUS PHASE-PHASE r3 caveman**:

| Agent role | Caveman? | Tools available | Phase ownership |
|---|---|---|---|
| **Planner-opus** | YES | Read + Glob + Grep + WebFetch + TodoWrite | Phase 0 prep + atom decomposition |
| **Architect-opus** | YES | Read + Glob + Grep + WebFetch | ADR-033 ratify + V2.1 fair design + skill design |
| **Maker-1 caveman** | YES | Read + Edit + Write + Bash | Skill 1+5 + Atoms 2.1+2.2+3.1+4.4-7+5.2 |
| **Maker-2 caveman** | YES | Read + Edit + Write + Bash | Skill 2 + Atoms 2.3+5.1 |
| **Tester-1 caveman** | YES | Read + Glob + Grep + Bash | Skill 3+4 + Atoms 2.4+4.7-8+5.3+6.1 |
| **Scribe-opus** | YES | Read + Write + Glob | Phase 2 sequential audit + handoff + CLAUDE.md update |

**Race-cond fix Pattern S r3 mandate** (10× consecutive iter 5+6+8+11+12+19+36+37+38 + ITER 31):
- Phase N parallel: Maker-1 + Maker-2 + Tester-1 file ownership disjoint NO write conflict
- Filesystem barrier: 4/4 completion msgs `automa/team-state/messages/{agent}-iter31-phase{N}-completed.md` PRE Phase 2 sequential scribe spawn
- Scribe Phase 2 sequential SOLO post 4/4 confirmation
- Phase 3 orchestrator (this main session) commit + push + cumulative scoring

---

## §8. CoV mandate — ZERO compiacenza

Ogni atom richiede 3-step CoV:

1. **CoV-1 baseline preserve**: `npx vitest run` PRIMA atom must PASS baseline
2. **CoV-2 incremental**: `npx vitest run tests/unit/{newscope}` post atom must PASS new tests
3. **CoV-3 finale**: `npx vitest run` POST atom must PASS baseline + delta tests

Failure CoV ANY step → REVERT IMMEDIATO + investigation root cause via systematic-debugging.

NO `--no-verify`. NO `git push --force`. NO `git reset --hard`. NO `rm -rf` outside tmp/.

---

## §9. Definitions remember

Ogni atom agente caveman MUST first re-read 4 definizioni §0 di questo plan + linked CLAUDE.md.

- **NO claim "atom ratified"** senza Andrea explicit Yes via chat
- **NO claim "Sprint T close 8.5/10"** senza Andrea Opus G45 indipendente review §Phase 7
- **NO claim "Mac Mini cron LIVE"** senza first 24h soak verify
- **NO claim "skill measured pass"** senza CoV dry-run output
- **NO claim "feature done"** senza vitest+build+prod-live triple verify

---

## §10. Self-review

Plan reviewed against spec:
- ✅ §0 alignment 4 definizioni explicit Andrea request
- ✅ §1 file structure 4 NEW skills + 3 NEW handoff/audit docs
- ✅ §2 7-phase decomposition + acceptance gates ognuno
- ✅ §3 Mac Mini persona-prof cross-link separate doc
- ✅ §4 Tea brief cross-link separate doc
- ✅ §5 Tools+plugins inventory cross-link
- ✅ §6 inter-Phase systematic-debug + quality-audit mandate
- ✅ §7 6-agent OPUS Pattern S r3 caveman architecture
- ✅ §8 CoV mandate 3-step ognuno atom
- ✅ §9 NO compiacenza explicit checklist
- ✅ Estimated total ~26h dev + ~100h Mac Mini autonomous H24 + ~3h Andrea Opus review

---

## §11. Execution handoff

**Two execution options**:

**1. Subagent-Driven** (recommended ralph deep) — dispatch fresh subagent per atom, review between atoms, fast iteration via Pattern S r3 caveman

**2. Inline Execution** — execute atoms in this session via `superpowers:executing-plans`, batch execution con CoV checkpoint ognuna

Andrea decide approccio iter 31 entrance.

---

## §12. Anti-pattern checklist iter 31

- ❌ NO atom shipped senza CoV 3-step
- ❌ NO Phase close senza systematic-debug + quality-audit
- ❌ NO commit senza pre-commit hook GREEN
- ❌ NO push senza pre-push hook GREEN
- ❌ NO claim score senza Opus G45 indipendente Phase 7
- ❌ NO bypass `--no-verify` mai
- ❌ NO push main mai
- ❌ NO destructive ops mai
- ❌ NO claim "Andrea ratified" senza explicit chat reply
- ❌ NO claim "Mac Mini autonomous LIVE" senza 24h soak verified
- ❌ NO compiacenza score inflato

---

**Status**: PROPOSED iter 31 entrance. Andrea ratify required Phase 0. Estimated wall-clock 4-5 settimane completion full Sprint T close + Sprint U Cycle 2 + Mac Mini persona-prof + 4 NEW skills.

**Cross-link**:
- Mac Mini persona-prof: `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md`
- Tea brief iter 31: `docs/handoff/2026-05-02-tea-iter-31-brief.md`
- Tools+plugins inventory: `docs/audits/2026-05-02-iter-31-tools-plugins-inventory.md`
- Iter 30 priority matrix: `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md`
- Iter 30 Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`
- ADR-040 Leonardo: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md`
- PIANO Sprint T close: `docs/superpowers/plans/PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md`
