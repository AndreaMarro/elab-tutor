# PHASE 0 Discovery — Sprint T close + Sprint U Cycle 1 + ADR matrix
**Date**: 2026-05-02
**Author**: Subagent 1 (Phase 0 documentation discovery)
**Sprint**: T close — moving into Sprint U Cycle 2 fix phase
**Method**: read-only audit of 12 source documents (4 audits + 4 ADRs + 3 source files + 4 Tea docs)

---

## §1 Executive summary

### Top 5 findings

1. **Sprint T close target 9.5/10 NOT achieved** — iter 38 close score `8.0/10` (mechanical G45 cap), iter 38 carryover ricalibrato `8.5/10` post-deploy + Tier 1 cache. A10 Onnipotenza Deno port 12-tool subset NOT shipped (PDR §4 mechanical cap 8.5 ceiling). Sprint T close path slips to iter 40+ post org-limit-reset. (`docs/audits/2026-05-01-iter-38-PHASE3-CLOSE-audit.md:38-50`, `2026-05-01-iter-38-deploy-chain-and-tier1-final-audit.md:88-98`)

2. **Sprint U Cycle 1 BLOCKER — L2 template router catch-all**: `selectTemplate()` returns `L2-explain-led-blink` for ALL 94 experiments (20/20 cross-volume test confirmed identical response body). Morfismo Sense 2 broken for 93/94 experiments; only `v1-cap6-esp1` distinct. Root cause: only specific experimentIds mapped to distinct templates; default catch-all dominates. (`sprint-u-cycle1-iter1-CONSOLIDATED-audit.md:50-63`)

3. **Linguaggio + framing violations 73/94 + 91/94 + 94/94**: 73/94 lesson-paths have singolare imperatives ("Premi/fai/clicca/inserisci/collega"), 91/94 missing "Ragazzi," opener, 94/94 unlimPrompts use "studente" framing instead of canonical "docente" framing per PRINCIPIO ZERO. (`sprint-u-cycle1-iter1-CONSOLIDATED-audit.md:14-44`, lines 66-118)

4. **R7 canonical INTENT exec rate stays 3.6%–4.1% even with canary ON** — L2 template router short-circuits 95%+ of fixture prompts BEFORE Mistral function calling fires (ADR-030). R7 ≥95% target requires reducing L2 scope OR widening `shouldUseIntentSchema` heuristic OR disabling L2 for action-heavy categories. iter 40+ work. (`2026-05-01-iter-38-deploy-chain-and-tier1-final-audit.md:33-35`, §4 caveat 2)

5. **Lighthouse perf 26/23 + 833 hex violations + R6 page=0% structural blockers** carry over to iter 39+. CF Whisper STT migration to Voxtral Transcribe 2 designed (ADR-031) but impl deferred iter 39+. R6 metadata page=0% requires Voyage re-ingest (~$1, 50min) or fixture v3 redesign. (`2026-05-01-iter-38-deploy-chain-and-tier1-final-audit.md:20`, `sprint-u-cycle1-iter1-CONSOLIDATED-audit.md:181-194`, ADR-031)

### Sprint T close blockers (iter 40+)

| # | Blocker | Owner | Effort | Source |
|---|---------|-------|--------|--------|
| B1 | A10 Onnipotenza Deno port 12-tool subset | Maker-1 | 6-8h | iter 38 close §2 |
| B2 | Lighthouse perf optim ≥90 (lazy-load react-pdf 407KB + mammoth 70KB) | WebDesigner-1 | 3h | sprint-u CONSOLIDATED §9 |
| B3 | A14 codemod 200→14 TRUE violations (PDR claim revised honest) | Maker-3 | 2h | iter 38 carryover §1 |
| B4 | A15 94 esperimenti Playwright UNO PER UNO | Tester-1 | 3h headless | iter 38 close §2 |
| B5 | R7 canonical ≥95% post L2 scope reduction | Maker-1 + Tester-2 | 6h | ADR-030 §6 |
| B6 | Voyage re-ingest with `metadata.page` (R6 unblock) | Maker-1 | 50min | iter 38 carryover §4 caveat 3 |
| B7 | Sprint U Cycle 2 — L2 routing fix + 73-file linguaggio codemod + 94-prompt docente-framing | UNLIMFix + Codemod agents | 4h+ | sprint-u CONSOLIDATED §Cycle-2 |

---

## §2 Iter 37/38 close state — score cap rationale + box subtotal

### Iter 37 close (2026-04-30 PM)

**Final score ONESTO**: **8.0/10** (G45 cap PDR §4 R5 latency rule mechanical TRIGGERED). Raw 9.05 → cap 8.0 enforced.

**Cap trigger**: PDR §4 R5 latency cap rule TRIGGERED. R5 4496ms avg vs PDR target <1800ms = +85% regression. (`2026-04-30-iter-37-PHASE3-CLOSE-audit.md:58-67`)

**Onesto interpretation** (audit §6 caveat 4): PDR baseline 2424ms inflato vs reality iter 31-32 6800ms p95. Iter 37 4496ms avg vs iter 32 6800ms p95 = **-34% LIFT vs realistic baseline**, not regression. But G45 mandate is mechanical anti-inflation — overriding even with honest analysis would inflate. Score 8.0 reflects honest miss vs PDR target, not full reality lift. (`2026-04-30-iter-37-PHASE3-CLOSE-audit.md:60-67`)

**Iter 37 box subtotal**: 8.14/10 + bonus 2.45 = raw 8.49 → cap 8.0. Box 11 Onniscenza 0.7 → 0.8 (+0.1 A2 classifier). NEW Box 14 INTENT exec end-to-end 0.0 → 0.85 (B-NEW intentsDispatcher 22/22 + whitelist 12 actions + A5 v50 deploy + lavagna 61/61 anti-regression). (`2026-04-30-iter-37-PHASE3-CLOSE-audit.md:174-191`)

### Iter 38 close (2026-05-01 ~01:15 CEST)

**Final score ONESTO**: **8.0/10** (G45 mechanical cap). Box subtotal 11.65/14 = 8.32/10 + bonus 0.30 = raw 8.62 → cap 8.0 (A10 not shipped 8.5 ceiling - 0.30 onesti penalties Lighthouse perf FAIL + A14 zero + A15 not spawned + 3/4 BG fail). (`2026-05-01-iter-38-PHASE3-CLOSE-audit.md:38-46`)

**Box deltas iter 37→38**:
- Box 11 Onniscenza 0.8 → 0.85 (+0.05 Cron warmup SQL shipped, apply pending Andrea)
- Box 13 UI/UX 0.7 → 0.75 (+0.05 wake word UX live + PWA prompt-update wired)
- Box 14 INTENT exec 0.85 → 0.90 (+0.05 ADR-030 design + Mistral function calling wire-up shipped, deploy + R7 verify pending)
(`2026-05-01-iter-38-PHASE3-CLOSE-audit.md:14-30`)

**Cap conditions evaluated**:
- ✅ vitest 13474 PRESERVED post hotfix MicPermissionNudge Rules of Hooks
- ❌ Build NOT re-run Phase 1 (deferred Phase 4 entrance)
- ❌ A10 Onnipotenza Deno port NOT shipped → mechanical cap 8.5
- ❌ R5 latency re-bench post-A3+A5 NOT executed (env req)
- ❌ R7 INTENT canonical post-A7 deploy NOT verified
- ⚠️ Carryover closed 13/24 ≈ 54% → cap 9.0 threshold (above 50%)
- ❌ A6 Lighthouse perf 26+23 FAIL ≥90 target → -0.10 onesto
- ⚠️ Maker-3 A14 codemod ZERO deliverables → -0.10 onesto
- ⚠️ Tester-1 A15 94 esperimenti NOT spawned → -0.10 onesto
(`2026-05-01-iter-38-PHASE3-CLOSE-audit.md:35-48`)

### Iter 38 carryover (2026-05-01 ~07:50-09:50 CEST, ~2h session)

**Carryover score ONESTO ricalibrato**: **8.5/10** (raw 8.91 → cap 8.5 enforce). Carryover NOT a new iter — same iter 38 close + commit + push + 2 SQL migrations applied + Edge Function v54→v55→v56 + R5 v54+v56 bench + Tier 1 T1.1 semantic cache shipped + Vercel deploy LIVE prod. (`2026-05-01-iter-38-deploy-chain-and-tier1-final-audit.md:88-98`)

**R5 latency cap REMOVED post Tier 1 cache**:
- v54 avg 2172ms / p95 3069ms (-52%/-69% vs iter 37 4496/10096)
- v56 avg 1607ms / p95 3380ms / PZ V3 94.2% (-64%/-66% vs iter 37, best lift)
(`2026-05-01-iter-38-deploy-chain-and-tier1-final-audit.md:28-35`)

**R7 canary ON v56 result**: canonical **3.6%** / combined 46.2% — FAIL ≥80% target. L2 template router dominates. (`2026-05-01-iter-38-deploy-chain-and-tier1-final-audit.md:33-35`)

---

## §3 Sprint U Cycle 1 critical findings

### L2 routing catch-all (BLOCKER)

**Source**: `sprint-u-cycle1-iter1-CONSOLIDATED-audit.md:50-63`

`selectTemplate()` in `supabase/functions/_shared/clawbot-template-router.ts:121-153` routes ALL `lesson-explain` category requests to `L2-explain-led-blink` regardless of `experimentId`. The 20-experiment cross-volume test confirms 100% hit on the LED blink template.

**Evidence** (UNLIMVerify §ISSUE 2): 20/20 queries return `template_id: L2-explain-led-blink` + identical response body:
> "Ragazzi, Vol.1 pag. 'Catodo: Terminale negativo del diodo...' Sul kit guardate il LED rosso e la resistenza da 220Ω in serie."

**Code site**: The `selectTemplate` function uses category_hint + token overlap scoring (`clawbot-template-router.ts:63-115`); the experimentId filter at lines 144-150 only fallthrough-rejects if best.category === 'lesson-explain' AND template-bound experimentId mismatches. Default catch-all template scores high enough to bypass this filter for most queries.

**Vol/pag citation strict format 0/20** — L2 template inlines RAG text excerpt after `pag.` instead of page number. PZ V3 canonical requires `Vol.1 pag. 42`. (`sprint-u-cycle1-iter1-CONSOLIDATED-audit.md:92-100`)

### 73-file linguaggio singolare violations

**73/94 lesson-paths** have singolare imperatives in `teacher_message` fields. Worst offenders:
- v1-cap8-esp1, v1-cap8-esp3, v1-cap10-esp6, v1-cap11-esp2, v1-cap9-esp9, v2-cap10-esp3 — 3 violations each
- v3-cap6-esp6 — 3 violations

**Dominant pattern**: `"Premi Play e osserva cosa succede."` in OSSERVA phase — appears in ~50/65 Vol1+Vol2 LPs.

**Other patterns**: "Collega/Fai clic/Inserisci/Clicca" → "Collegate/Fate clic/Inserite/Cliccate"

**Fix**: Batch sed codemod — ~200 string replacements across 73 JSON files. Cycle 2 P1.1.

(`sprint-u-cycle1-iter1-CONSOLIDATED-audit.md:66-89`)

### 94/94 unlimPrompts docente-framing CRITICAL

**ALL 94** `unlimPrompt` fields begin with: "Sei UNLIM, il tutor AI di ELAB. Lo studente sta guardando l'esperimento..." but PRINCIPIO ZERO mandates docente-framing: "Il docente sta mostrando alla classe l'esperimento...".

**Nuance** (audit-vol1-vol2 §B): unlimPrompts are architecturally context briefs to UNLIM, not verbatim teacher scripts. Linguaggio compliance is enforced at inference via BASE_PROMPT v3.1. Severity is real but lower than appears.

**Recommendation**: Phase 1 fix is docente-framing rewrite for all 94 prompts (batch replace) — the "codemod 200 violations" from Andrea iter 21 mandate carryover. (`sprint-u-cycle1-iter1-CONSOLIDATED-audit.md:106-117`)

### Persona simulation score (offline retry)

**Media globale 4.35/10 pre-fix** → projected 6.8/10 post-fix:
- P1 Maria (4ª primaria): 4.1/10 → 6.5/10
- P2 Giovanni (1ª secondaria): 5.0/10 → 7.5/10
- P3 Lucia (3ª media esperta): 5.4/10 → 7.8/10
- P4 Marco (sostituto last-minute): 2.9/10 → 5.5/10

**Top friction**:
1. F1-ROUTING (75/80 scenari, Δ-2.5) — fix Cycle 2 P0.1
2. F3-NOCAPTION (80/80, Δ-0.5) — fix Cycle 2 P1.1
3. F2-LINGUAGGIO (57/80, Δ-0.5) — fix Cycle 2 P1.1
4. F6-NOMOUNT (2/80 scenari, Δ-5.0 catastrofico) — fix Cycle 2 P0.2
5. F8-TITLEDUP (4/80, Δ-2.0) — fix Cycle 2 P1.2

(`sprint-u-cycle1-iter1-CONSOLIDATED-audit.md:317-345`)

### Sprint U Cycle 1 — Honest scores per domain

| Domain | Score | Cap condition |
|--------|-------|---------------|
| Circuit structural quality | 9.5/10 | 1 gap (v3-cap8-serial mancante bb1) |
| Lesson-path completeness | 8.0/10 | 94/94 5-phase structure complete |
| Lesson-path linguaggio | **2.5/10** | 73/94 singolare violations |
| UNLIM content quality | **1.5/10** | L2 routing blocks experiment-specific content |
| Design token compliance | 3.0/10 | 833 hex violations + perf=43 |
| Live test (smoke) | 10/10 | 18/18 PASS, full spec ready Cycle 2 |
| UX comprehensibility (docente) | 4.35/10 | F1-ROUTING blocker −2.5 su 94% scenari |

(`sprint-u-cycle1-iter1-CONSOLIDATED-audit.md:378-388`)

---

## §4 ADR status matrix

| ADR | Title | Status | Impact | Iter target |
|-----|-------|--------|--------|-------------|
| ADR-028 | Onnipotenza INTENT dispatcher server-side | **ACCEPTED** iter 37 (Andrea ratify Phase 0 PATH 1) | High — INTENT parser surface-to-browser pivot wired prod (270 LOC + 24/24 tests). §14 amend +60 LOC iter 37, §14.b 4-way schema drift resolution iter 38 (+58 LOC). Box 14 INTENT exec end-to-end 0.85→0.90. | iter 36 server parse + iter 37 browser dispatch (Atom B-NEW) + iter 38 §14.b doc + iter 39+ Deno port 12-tool subset for full L0+L1 server-side dispatch |
| ADR-029 | LLM_ROUTING_WEIGHTS conservative tune 70/20/10 | **ACCEPTED** iter 37 entrance (Andrea ratify Phase 0 Question 2 — env-only, no code) | Medium — projected -1000ms p95 latency. Active prod via `pickWeightedProvider` runtime env-read (`llm-client.ts`). Verified post v54+Tier1 cache: R5 v56 1607ms avg / 3380ms p95 / PZ V3 94.2%. | iter 37 entrance Phase 0 (orchestrator inline env set) + iter 38 carryover R5 measure verify |
| ADR-030 | Mistral function calling INTENT canonical | **PROPOSED** iter 38 + impl SHIPPED iter 38 (Maker-1 BG + orchestrator fallback) | High — replaces prompt-teaching `[INTENT:...]` with json_schema `response_format`. Eliminates 4-way schema drift. Single source of truth `args.id` (not `args.experimentId`). 12-tool whitelist enum-validated. Wired `intent-tools-schema.ts` + `llm-client.ts` + `mistral-client.ts` + `system-prompt.ts` + `unlim-chat/index.ts`. | iter 38 design+impl shipped + iter 38 carryover deploy v56 + iter 39+ R7 ≥95% verify post L2 scope reduction |
| ADR-031 | STT migration Voxtral Transcribe 2 | **PROPOSED** iter 38 (design only, impl deferred iter 39+) | Medium — completes 100% Mistral EU FR stack Sense 2. $0.003/min ($7.50/mese), 4% WER FLEURS Italian, EU France GDPR-clean, context_bias "Arduino breadboard MOSFET". CF Whisper retained 6 months as fallback. | iter 38 design only + iter 39 impl Maker-1 + Tester-4 9-cell matrix + iter 39 Phase 4 deploy |

---

## §5 system-prompt v3.1 + L2 router + onniscenza-bridge code summary

### system-prompt.ts — `BASE_PROMPT` (v3.1, prod LIVE)

**File**: `supabase/functions/_shared/system-prompt.ts:14-224`

- `BASE_PROMPT` constant (210 LOC) — single source of truth for UNLIM personality + behavior rules
- 6 ASSOLUTE rules + ragionamento interno (`system-prompt.ts:24-34`)
- Legacy `[AZIONE:...]` tags 16 entries (lines 36-58) — preserved for play/pause/compile that don't map to 12-tool whitelist
- **TAG INTENT CANONICO `[INTENT:...]` MANDATORY block lines 68-109** — 12-tool whitelist + 3 few-shot examples + interpretazione linguaggio naturale
- 8 few-shot examples Italian K-12 plurale Ragazzi + Vol/pag verbatim citation (lines 141-178) — Esempio 1-8 cover LED, breadboard, pulsante, resistore, LDR, PWM, blink
- **REGOLA KIT FISICO OBBLIGATORIA** v3.1 lines 159-163 — every response MUST mention breadboard/kit/montate/inserite/costruite/cablate/collegate
- **REGOLA VERBATIM** v3.2 priority massima iter 33 lines 180-181 — Vol/cap/pag «caporali» verbatim citation, no parafrasi
- **LINGUAGGIO OBBLIGATORIO** lines 183-188 — INIZIA SEMPRE "Ragazzi,", MAI imperativo singolare al docente, MAX 60 parole, età 10-14
- 8 ABILITÀ AVANZATE lines 195-218 — diagnosi proattiva, suggerimento prossimo passo, quiz contestuale, costruzione guidata, confronto esperimenti, spiegazione codice, debug guidato, quiz adattivo

### `buildSystemPrompt` function (`system-prompt.ts:234-306`)

**Iter 38 A7 — `useIntentSchema?` parameter** added (line 244). When true, appends override block (lines 285-303) replacing legacy `[INTENT:...]` block:
- Single JSON object `{text, intents?[]}` matching `INTENT_TOOLS_SCHEMA`
- mountExperiment uses `id` key NOT `experimentId` (4-way drift resolution per ADR-028 §14.b + ADR-030 §3)
- Tools whitelist 12 enum-constrained
- NO `[INTENT:...]` or `[AZIONE:...]` tags inside `text` — all in JSON

Concatenation order per ADR-008 §2.5: `BASE_PROMPT` → MEMORIA STUDENTE → CAPITOLO FRAGMENT → STATO CIRCUITO → ESPERIMENTO ATTIVO → (optional OUTPUT FORMAT JSON override).

### clawbot-template-router.ts — L2 router

**File**: `supabase/functions/_shared/clawbot-template-router.ts:1-310` (310 LOC, prod LIVE iter 26)

Wired prod pre-LLM short-circuit. Per Sprint U Cycle 1 audit, this is the **BLOCKER #1** (catch-all routing).

- **`selectTemplate(query, context)`** (`:121-153`) — best-match `ClawBotTemplate` or null
  - Token overlap scoring + verb-stem alignment + category_hint bonus +2 (`:63-115`)
  - Threshold default 2 keywords (`:43-51`)
  - Tie-breaker: category_hint match preferred
  - **Sprint U fix** (lines 144-150) — only experiment-specific lesson-explain templates served when `experimentId` matches; ALL other lesson-explain queries fall through to LLM. **THIS IS THE FILTER NEEDED — needs verification it actually works**, but live evidence (UNLIMVerify 20/20 → LED blink) suggests it's not preventing the catch-all
- **`interpolateArgs(args, inputs, prev, citation)`** (`:163-191`) — replace `${inputs.X}` `${prev.Y}` `${citation.Z}` recursively in args; preserves non-string scalars
- **`executeTemplate(template, inputs, env)`** (`:228-301`) — Deno-pure, NO __ELAB_API dispatch. Emits `[AZIONE:<tool>:<json-args>]` tags for client relay. RAG retrieve IS executed server-side via `env.ragRetrieve` for real Vol/pag citation in speakTTS step
- 22 templates inlined per iter 28 D2 audit (vs 20 PDR claim) — drift +2 templates orphan iter 37 verify
- **`shouldUseIntentSchema`** referenced in iter 38 carryover `unlim-chat/index.ts` — heuristic for canary ENABLE_INTENT_TOOLS_SCHEMA gating; needs widening per iter 38 carryover §4 caveat 1+2 (R7 stays 3.6% canary ON because L2 short-circuits 95% of fixture before Mistral function calling fires)

### onniscenza-bridge.ts — 7-layer aggregator

**File**: `supabase/functions/_shared/onniscenza-bridge.ts:1-593` (593 LOC, iter 24 PARTIAL LIVE → iter 39 V2 cross-attention)

**Iter 24 layer status** (`onniscenza-bridge.ts:380-388`):
- L1 RAG → **LIVE** via `hybridRetrieve` (rag.ts) when supabase client present (`:84-112`)
- L2 Wiki concepts → **LIVE** via Supabase `rag_chunks` filter `source='wiki'` (`:125-150`)
- L3 Glossario Tea → TODO — merged into L1 RAG via `wikiFusionActive` flag (no separate fetch) (`:163-166`)
- L4 Class memory → **LIVE** via Supabase `unlim_sessions` table (`:168-207`)
- L5 Vision/lesson context → **LIVE** derived from `experiment_id` + chapter; real screenshot vision deferred iter 25 (`:209-225`)
- L6 LLM/chat history → **LIVE** caller injects last 10 turns via `input.history` (`:227-246`)
- L7 OnTheFly/circuit_state → STUB derives from `circuit_state` if provided (`:248-261`)

**`aggregateOnniscenza(input)`** (`:299-374`): parallel `Promise.all` 7 layer fetches with **200ms timeout per layer** (iter 34 P0 Andrea "davvero lentissimo"). RRF fusion k=60 default.

**Iter 39 V2 cross-attention budget** (`:390-589`, per ADR-033) — `aggregateOnniscenzaV2`:
- Per-layer score weights: L1=1.0, L4=0.95, L5=0.90, L2=0.85, L3=0.75, L6=0.70, L7=0.65
- Layer-specific RRF k: L1=60, L2=80, L3=100, L4=60, L5=60, L6=40 (recency boost), L7=60
- Budget allocation 8 chunks total, min/max per layer, reallocation L1→L2 if slots skip
- Experiment-anchor boost +0.15, kit-mention boost +0.10 (Morfismo Sense 2)

**Wired prod opt-in** via env flag `ENABLE_ONNISCENZA=true` per iter 31 audit.

---

## §6 Tea source docs summary

### `analisi_complessita_esperimenti_2026-04-13.pdf` (164 lines)

92 esperimenti analyzed across 3 volumes for 8-14 anni target.

**Key findings**:
- Vol 1 — 38 esp, passi medi 13.2, max 34, 24% difficoltà 3 (ben tarato per piccoli)
- Vol 2 — 27 esp, passi medi 11.3, max 32, 11% difficoltà 3 (concettualmente più astratto: condensatori RC MOSFET motori)
- Vol 3 — 27 esp, passi medi 9.8, max 33, 11% difficoltà 3 (più leggero hw, complessità in codice)
- **6 esperimenti genuinamente "oltre" target**: v1-cap14-esp1 (Primo Robot, 34 passi), v1-cap9-esp6 (Lampada RGB 3 pot, 25 passi), v2-cap12-esp1 (Robot Segui Luce, 32 passi capstone), v2-cap8-esp3 (MOSFET soglia, **caso più problematico** scuola superiore concept), v3-extra-simon (Simon Says capstone), v3-cap8-esp5 (Pot+3LED+Serial, da spezzare)
- **Sfide aperte cap.9 Vol 1** (esp 7/8/9) — formulazione "combina" rischiosa <10 anni
- **Azione prioritaria**: riscrivere v2-cap8-esp3 MOSFET eliminando "tensione di soglia" → "interruttore elettronico oltre certa tensione gate"

### `riepilogo_correzioni_github_2026-04-13.pdf` (84 lines)

PR #73 mergeata da Andrea — 3 problemi corretti:
1. **Errori chunk dopo deploy**: aggiunto `vite:preloadError` handler in `src/main.jsx` con sessionStorage anti-loop reload
2. **Caratteri mancanti icone**: 8 icone vuote (6 Vol 1 + 2 Vol 2) sostituite con emoji appropriate
3. **Modulo Scratch fragile**: nuovo `src/utils/importWithRetry.js` retry 3 volte (250/500/750ms) wrappa import dinamici critici (AVR + Scratch)

Commit SHA `1d6c6f8aca`, branch `fix/chunk-errors-and-icons`. Token classic PAT revocato post-merge.

### `schema_ux_semplificato_2026-04-13.docx` (113 lines)

Schema UI proposta: 3 zone visive (vs 6 attuali) — "Schermo-Lavagna":
1. **Breadcrumb + titolo esperimento**
2. **3 colonne centrali**: Componenti filtrati (solo necessari, "+Mostra tutti"), Canvas, Pannello Guida Docente (cosa dire/domande/errori tipici/link manuale-video)
3. **Toolbar 4 bottoni grandi etichettati**: ▶ AVVIA, ↶ ANNULLA (no redo), ❓ AIUTO, → AVANTI

**4 semplificazioni chiave**:
1. Pannello "Guida Docente" — la novità più importante, collassabile, contestuale
2. Sidebar componenti filtrata sull'esperimento (8 → solo quelli usati)
3. Toolbar 4 comandi grandi etichettati (vs 6 icone senza testo)
4. Modalità default unica "Guidata" (Passo Passo) — Libero/Già Montato dal pannello docente

**Priorità impl** suggerita: pannello Guida Docente prima (2-3gg dev), sidebar filtrata (1gg), toolbar 4 bottoni (1gg), breadcrumb (4h), → Avanti illuminato (4h)

### `10_idee_miglioramento_2026-04-13.docx` (65 lines)

10 idee prodotto (NON UI):
1. **Dashboard docente / modalità Classe** — codice-classe ELAB-7F3K, semaforo verde/giallo/rosso per studente, 1-2 settimane dev, sblocca vendita scuole
2. **Modalità "Proietta in classe"** — toggle LIM/proiettore, caratteri 2×, canvas gigante
3. **Quaderno digitale del bambino** — screenshot + nota libera + emoji mood, export PDF fine anno
4. **"Trova il guasto"** — modalità debug-as-game accanto a Passo Passo / Libero
5. **Glossario contestuale + voce narrante** — parole tecniche sottolineate, popup spiegazione + foto + altoparlante TTS (importante dislessia + 8anni + non-italofoni)
6. **Quiz finale 2-3 domande** per esperimento, immagini, sbagliato = spiegazione non "errore"
7. **Scheda stampabile A4** "porta a casa" — schema + componenti + 3 domande + spazio "disegna il tuo"
8. **"Cosa succede se?"** modalità esplorativa sicura — invertire LED, no resistore, cortocircuito (micro-lezioni di fisica)
9. **Pacchetto "Lezione 45 min"** per docente — script demo + assegnazioni + chiusura, abbassa soglia adozione
10. **Badge fine volume + certificato stampabile** — gamification leggera, no classifiche competitive

**Top 3 raccomandate**: Dashboard (#1, vendite scuole), Pacchetto lezione (#9, contenuti zero-dev), Quaderno digitale (#3, fidelizzazione famiglie).

---

## §7 Anti-pattern list explicit — what NOT to do iter 39+ Phase 1 onwards

1. **NO auto-claim score >7 senza Opus indipendente review** (G45 mandate, anti-inflazione FERREA). Caps mechanical, NOT override-able even with honest interpretation.
2. **NO `--no-verify` su pre-commit hook** (anti-debt mandate). Pre-push hook NEVER bypass. Iter 32 emergency rotation accepted `--no-verify` exception logged.
3. **NO push diretto su main** — solo PR via `gh pr create`. Pre-push hook blocks.
4. **NO claim "Sprint T close achieved"** finché A10 + Lighthouse perf ≥90 + 94 esperimenti audit + canary 100% soak NOT shipped. Sprint T close path = iter 41-43 realistic.
5. **NO claim "INTENT canonical ≥95% LIVE"** finché R7 re-bench post L2 scope reduction NOT shipped (current 3.6% canary ON).
6. **NO claim "R7 lift via canary"** alone — L2 template router dominates 95% fixture; canary ON measures EQUAL canary OFF until L2 narrowed.
7. **NO claim "Onnipotenza FULL LIVE"** finché 12-tool Deno port post-LLM dispatch shipped. Browser-side surface-to-browser pivot iter 36 = compromise, not full Onnipotenza.
8. **NO claim "Onniscenza Box 11 1.0 ceiling"** finché canary 5%→100% rollout per ADR-028 §7 verified.
9. **NO claim "Build PASS verified"** se NOT executed pre-commit (heavy ~14min). Iter 39 entrance pre-flight CoV mandatory.
10. **NO claim "Lighthouse ≥90 perf"** finché lazy-mount react-pdf 407KB + mammoth 70KB + bundle audit shipped (iter 38 carryover Lighthouse 26+23 FAIL admitted).
11. **NO codemod "200 violations"** claim until verified. Iter 38 carryover honest revision: ~14 TRUE UI/mascotte violations + ~180 narrative analogies preserved per Sense 2 Morfismo (volumi cartacei "tu generico" voice intentional).
12. **NO regex prompt-teaching `[INTENT:...]`** per ADR-030 once `ENABLE_INTENT_JSON_SCHEMA=true` canary widens — replaced by Mistral json_schema response_format. Together AI fallback retains regex path.
13. **NO Voyage re-ingest skip** per R6 page=0% — migration alone insufficient, pipeline needs `metadata.page` extraction from PDF position.
14. **NO `mountExperiment.args.experimentId`** key — canonical is `args.id` per ADR-030 §3 single source of truth (4-way drift resolution).
15. **NO L2 lesson-explain catch-all routing** — all 20/20 cross-volume queries return LED blink template iter Cycle 1. Sprint U Cycle 2 fix MANDATORY.
16. **NO singolare imperatives "Premi/fai/clicca/inserisci"** in lesson-paths teacher_message — Sprint U Cycle 2 codemod 73 files.
17. **NO "studente" framing in unlimPrompts** — canonical is "Il docente sta mostrando alla classe..." per PRINCIPIO ZERO (94/94 fix).
18. **NO `--no-verify`, NO push main, NO debito tecnico** — iter 38 PHASE 4 commit batch mandate explicit.
19. **NO inflate "Onniscenza aggregator wired prod"** — was iter 30 P0 carryover finally wired iter 31, opt-in env flag `ENABLE_ONNISCENZA=true`. Box 11 0.7→0.85 honest.

---

## §8 Phase 0 inventory completeness

### Files read with citations

| # | File | LOC | Critical claims cited |
|---|------|-----|----------------------|
| 1 | `docs/audits/2026-04-30-iter-37-PHASE3-CLOSE-audit.md` | 419 | Score cap §1 lines 13-73, box subtotal §5 lines 174-191, ADR-028 §14 surface-to-browser §6 caveat 1 lines 213-217 |
| 2 | `docs/audits/2026-05-01-iter-38-PHASE3-CLOSE-audit.md` | 199 | Score cap §1 lines 14-46, atoms shipped §2 lines 56-70, BG agent org limit §4 caveat 1 lines 110-115 |
| 3 | `docs/audits/2026-05-01-iter-38-deploy-chain-and-tier1-final-audit.md` | 198 | Carryover score §2 lines 64-99, R5 v54+v56 latency §1 B1 lines 28-32, R7 canary 3.6% §1 B3 lines 33-35, R6 page=0% §4 caveat 3 lines 116-119, T1.3 RPC FAILED §4 caveat 4 lines 120-122 |
| 4 | `docs/audits/sprint-u-cycle1-iter1-CONSOLIDATED-audit.md` | 391 | L2 routing BLOCKER §1 lines 50-63, 73-file linguaggio §2 lines 66-89, 94/94 docente-framing §4 lines 106-117, persona simulation §Persona lines 313-345, honest scores §Honest lines 378-387 |
| 5 | `docs/adrs/ADR-028-onnipotenza-intent-dispatcher-server-side.md` | 313 | §1-§13 server-side dispatcher design, §14 amend lines 216-251 surface-to-browser pivot, §14.b lines 255-312 4-way schema drift resolution iter 38 |
| 6 | `docs/adrs/ADR-029-llm-routing-weights-conservative-tune.md` | 126 | §2 decision lines 26-44 70/20/10 split, §3 rationale lines 46-58 quality preservation, §5 acceptance lines 69-81 R5 cap rollback |
| 7 | `docs/adrs/ADR-030-mistral-function-calling-intent-canonical.md` | 369 | §2 4-way drift evidence lines 18-62, §3 decision lines 65-150 INTENT_TOOLS_SCHEMA + canonical params alignment table, §4 implementation block lines 153-287, §6 acceptance lines 309-322 |
| 8 | `docs/adrs/ADR-031-stt-migration-voxtral-transcribe-2.md` | 320 | §2 incumbent context lines 18-69 CF Whisper issues, §3 decision lines 71-85, §4 architecture lines 87-220 voxtral-stt-client.ts design, §6 acceptance 9-cell matrix lines 234-251 |
| 9 | `supabase/functions/_shared/system-prompt.ts` | 338 | BASE_PROMPT v3.1 lines 14-224, useIntentSchema iter 38 A7 param lines 234-303, JSON output format override lines 285-303 |
| 10 | `supabase/functions/_shared/clawbot-template-router.ts` | 310 | selectTemplate scoring lines 121-153, Sprint U experiment filter lines 144-150, interpolateArgs lines 163-191, executeTemplate lines 228-301 |
| 11 | `supabase/functions/_shared/onniscenza-bridge.ts` | 593 | aggregateOnniscenza V1 lines 299-374, V2 cross-attention lines 390-589, layer status lines 380-388, 200ms timeout iter 34 lines 309-335 |
| 12 | `/Users/andreamarro/VOLUME 3/TEA/analisi_complessita_esperimenti_2026-04-13.pdf` | 164 | 6 esperimenti oltre target lines 31-127, MOSFET v2-cap8-esp3 piano d'azione lines 81-107 |
| 13 | `/Users/andreamarro/VOLUME 3/TEA/riepilogo_correzioni_github_2026-04-13.pdf` | 84 | PR #73 3 fix shipped lines 19-49 |
| 14 | `/Users/andreamarro/VOLUME 3/TEA/schema_ux_semplificato_2026-04-13.docx` | 113 | 3-zone schermo-lavagna lines 7-37, 4 semplificazioni lines 40-58, priorità impl lines 95-113 |
| 15 | `/Users/andreamarro/VOLUME 3/TEA/10_idee_miglioramento_2026-04-13.docx` | 65 | 10 idee prodotto lines 6-37, top 3 priorità lines 41-57 |

**Total reading**: ~3,800 LOC across 15 files (12 required + 3 Tea source docs).

**Missing/partial**:
- `tests/e2e/29-92-esperimenti-audit.spec.js` (396 LOC iter 29 P0 task D) — exists, NOT executed iter 38 (3h headless defer Mac Mini autonomous Task 3 OR Sprint U Cycle 2)
- iter 11 dedicated audit md (`2026-04-27-sprint-s-iter11-MASSIVE-LIFT-audit.md`) — NOT FOUND filesystem (iter 11 close narrative inline CLAUDE.md sprint history + master PDR §1.1-1.3)
- ADR-032 + ADR-033 referenced (Onnipotenza Deno 12-tool server-safe + Onniscenza V2 cross-attention budget) — present in `/docs/adrs/` listing but NOT requested for Phase 0; mentioned in onniscenza-bridge.ts:391 V2 implementation cited

---

**Status**: Phase 0 discovery COMPLETE. No source modifications. Read-only inventory shipped to `docs/audits/PHASE-0-discovery-2026-05-02.md` (~700 LOC). Cycle 2 fix work + Sprint T close path iter 40+ priorities citations ready.
