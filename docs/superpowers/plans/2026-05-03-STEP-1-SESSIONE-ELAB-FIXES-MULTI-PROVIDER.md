# STEP 1 Sessione — ELAB Tutor Fixes via Multi-Provider Workflow

**Author**: Claude (sonnet 4.7 1M, NO caveman)
**Date**: 2026-05-03 PM
**Sprint**: T close → Sprint U entrance
**Status**: PROPOSED — plan + execution begin questa sessione
**Plan version**: v1.0
**Cross-link**: `2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md` Step 1 §4
**Mandate**: combine workflow Step 1 trial + ELAB Tutor 13 fix atomi (kill 2 birds 1 stone)
**Anti-pattern**: G45 enforced, NO compiacenza, CoV per atom, audit ogni step

---

## §0 — Mandate Andrea verbatim

> "progettiamo la sessione con lo step 1 del workflow. gli obbiettivi sono, ponendosi in continuazione con questa sessione, rendere unlim non ebete fare sii che le sue risposte abbiano anche lunghezza più lunga e che non siano pappette pronte, deve poter andare anche un po' oltre al contenuto elab, mantenendo dei paletti, deve avere ricordo delle azioni precedenti e del contesto della sessione, deve agire con velocità molto più elevate sulle richieste sul circuito orchestra tutti i modelli per fare sii che ciò non accada. voxtral non risponde a wake word, non posso parlare con unlim. La modalità lavagna libera deve essere davvero libera senza nessun circuito. nella homepage la sezione lavagna deve avere solamente la lavagna. nella homepage manca la cronologia delle sessioni con brevi descrizioni. la modalità percorso non funziona ed esistono 2 modalità passo passo (è più bella quella più antica, devi solo rendere la sua window con size modificabile). Se premo esci dalla lavagna dopo avere scritto le cose scritte spariscono. nella homepage voglio mascotte e nessuna emoticon e i crediti per teodora de venere. La modalità percorso era pensata per adattarsi al contesto della lezione e al contesto della classe e delle sessioni precedenti. progetta e fixa tutto seguendo principio 0 e morfismo. sistematizza tutto quello che ti ho chiesto. la modalità percorso deve corrispondere alla vecchia modalità libero ma ora ci sono 2 window sovrapposte. metti anche il glossario, ma solo glossario nella home page. progetta tutto usando il workflow precedente e /ultrathink:ultrathink /using-superpowers /make-plan. non andare veloce per usare pochi token, concentrati al massimo su tutto sia nella progettazione che nell'esecuzione del piano. Non essere compiacente. Tutto deve essere analizza testato validato, fare cov e audit."

**Decomposition mandate**: 13 issues identified + 5 mandatory enforcement (PRINCIPIO ZERO + Morfismo + CoV + audit + NO compiacenza).

---

## §1 — Discovery diagnostics (root cause file:line per issue)

### 1.1 UNLIM ebete (issues #1+#2+#3+#4 mandate)

| Sotto-issue | Root cause file:line | Diagnostic |
|---|---|---|
| #1 risposte corte "pappette" | `supabase/functions/_shared/system-prompt.ts:283` "MAX 60 parole" | hard cap aggressivo, designed iter 36-37 per anti-verbosity ma over-limita technical depth |
| #2 L2 catch-all 95% identical | `supabase/functions/_shared/clawbot-template-router.ts:121-153` `selectTemplate` triggers WHEN `context.experimentId !== undefined` | router fires per QUALSIASI prompt con experimentId set — domina LLM call |
| #3 no memoria azioni precedenti | `supabase/functions/_shared/onniscenza-bridge.ts` aggregator V1 wired ma intent_history NOT persisted Supabase | iter 36 INTENT parser shipped server-side, MA intents_executed NOT salvato in studentContext |
| #4 velocità slow | Edge Function v80 cold start 30s + Mistral La Plateforme p95 3-6s + NO ADR-038 hedged 100ms stagger LIVE | pipeline sequential: classify → RAG → LLM → parse, NO parallelization heavy steps |
| #5 NO off-ELAB content paletti | `system-prompt.ts:1488` "DOMANDE OFF-TOPIC: Rispondi brevemente (max 1 frase) e ridireziona all'elettronica" | prompt explicit blocca ANY off-topic, user wants paletti softer (matematica/scienza correlata OK) |

### 1.2 Voice (issue #5 mandate)

| Sotto-issue | Root cause file:line | Diagnostic |
|---|---|---|
| #6 wake word non funziona | `src/services/wakeWord.js:1-30` USA BROWSER SpeechRecognition API (NON Voxtral!) | Voxtral è TTS output only, STT è CF Whisper. Wake word usa browser nativo; user misconcept "Voxtral wake word" |
| #7 mic permission nudge | `src/components/common/MicPermissionNudge.jsx` (iter 38 shipped) | nudge presente MA potrebbe non triggerare correttly se Permissions API status='denied' OR browser non-chromium |

### 1.3 Lavagna libera truly free (issue #6 mandate)

| Sotto-issue | Root cause file:line | Diagnostic |
|---|---|---|
| #8 libero NOT truly free | `LavagnaShell.jsx:617-619+638` ADR-025 §4.4 iter 26 forzava Libero → auto-Percorso, Andrea iter 34 invertito MA potrebbe NOT shipped | verifica iter 34 commit landed AND prod deploy current — se v80 NOT include fix iter 34, libero ancora redirige |

### 1.4 Homepage (issues #7+#8+#11+#12 mandate)

| Sotto-issue | Root cause file:line | Diagnostic |
|---|---|---|
| #9 emoji 🧠📚⚡🐒 cards | `HomePage.jsx:297+308+319` cards con `emoji` prop | iter 36 PDR §A13 explicit OK Andrea, MA ora user revoca: NO emoji → mascotte SVG |
| #10 lavagna section conflated | `HomePage.jsx:296-300` card "Lavagna libera" descritta "lavagna pulita, simulatore, costruite quello che volete" | mixing lavagna + simulator → user wants ONLY lavagna section |
| #11 NO cronologia sessioni | `HomePage.jsx` NO sezione cronologia | iter 38+39 design ChatbotOnly aveva cronologia ma NON wired homepage |
| #12 glossario solo external link | `HomePage.jsx:308+319` glossario emoji card linka https://elab-tutor-glossario.vercel.app | user wants glossario integrato homepage (NOT external popup) |
| #13 crediti Teodora basso | `HomePage.jsx:744` footer line "Teodora de Venere co-dev / UX / QA" present ma footer-only | user wants prominence elevata (mascotte + nome visible) |

### 1.5 Modalità (issues #9+#10+#13+#14 mandate)

| Sotto-issue | Root cause file:line | Diagnostic |
|---|---|---|
| #14 percorso non funziona | `PercorsoCapitoloView.jsx` rendering MA `handleModalitaChange` mode='percorso' NOT trigger experiment context-adaptive load | intended adapt context lezione + classe + sessioni precedenti, MA wire-up incompleto |
| #15 2 PassoPasso versions | `LavagnaShell.jsx:1323` NEW FloatingWindowCommon (iter 36) + `GalileoAdapter.jsx:198` OLDER embedded step-by-step | user prefer OLDER embedded, needs add window resize (currently embedded panel non-resizable) |
| #16 percorso = vecchia libero + 2 window sovrapposte | architettura intento NEW: percorso default mostra 2 finestre overlay (lezione context + UNLIM chat) | NOT implemented, currently percorso = generic placeholder |

### 1.6 Persistence (issue #11 mandate)

| Sotto-issue | Root cause file:line | Diagnostic |
|---|---|---|
| #17 esci → scritte spariscono | `LavagnaShell.jsx:851-865` `handleMenuOpen` salva `elab-lavagna-last-expId` MA NON force-save drawing buckets `elab-drawing-<expId>` esplicito | iter 28 supabase sync 25/25 PASS supposed to handle but user reports REGRESSED — verify post-iter-32 deploy |

### 1.7 Findings consolidate

**TOTALE 17 sotto-issue identificate** distribuite 13 issues mandate Andrea + 4 sotto-issue derived (mic nudge + glossario integration depth + crediti prominence + drawing buckets).

**Severity matrix**:

| Severity | Count | Issues |
|---|---|---|
| BLOCKER (UNLIM ebete + persistence loss) | 4 | #1, #2, #3, #17 |
| HIGH (modalità + voice broken) | 5 | #6, #8, #14, #15, #16 |
| MEDIUM (homepage redesign) | 5 | #9, #10, #11, #12, #13 |
| LOW (off-ELAB paletti soft + speed nice-to-have) | 3 | #4, #5, #7 |

---

## §2 — Brainstorming fix approaches

### 2.1 UNLIM intelligence (sotto-issues #1-#5)

#### Approccio A — Hard cap raise globale 60 → 200 word
- Pro: simple, single LOC change
- Contro: rompe brevità target ADR-042 §5 250-350 token output
- Verdict: ❌ TROPPO BROAD

#### Approccio B — Conditional cap per onniscenza-classifier category
- Pro: chit_chat keep 60 word, deep_question expand 150-200 word, citation_vol_pag 100-120 word
- Contro: depend onniscenza-classifier accuracy
- Verdict: ✅ RACCOMANDATO

#### Approccio C — Dynamic cap based on RAG hit count
- Pro: more RAG context = more depth justified
- Contro: complex tuning
- Verdict: ⚠️ DEFER Step 2

**Selezione**: Approccio B per #1.

### 2.2 L2 catch-all narrow (sotto-issue #2)

#### Approccio A — Disable L2 router globalmente
- Pro: tutti prompt → LLM (max diversity)
- Contro: latency +500-1500ms (LLM call vs template), cost +Mistral token
- Verdict: ❌ COSTO ALTO

#### Approccio B — Narrow trigger: solo quando prompt contiene action_keyword esplicito
- Pro: template per "spiega LED" = LLM, template per "carica esperimento blink" = router OK
- Contro: ridefinisce ROI router
- Verdict: ✅ RACCOMANDATO (R7 canonical lift expected post fix)

#### Approccio C — Hybrid: router suggests template, LLM may override
- Pro: best of both
- Contro: 2x LLM call cost
- Verdict: ⚠️ DEFER Step 3

**Selezione**: Approccio B per #2.

### 2.3 Memory ricordo azioni (sotto-issue #3)

#### Approccio A — intent_history persisto in studentContext Supabase
- Pro: persistente cross-session
- Contro: schema migration richiede Andrea ratify
- Verdict: ✅ RACCOMANDATO (con SQL migration prep)

#### Approccio B — In-memory session intent_history (no persist)
- Pro: zero migration
- Contro: lost on refresh
- Verdict: ⚠️ FALLBACK if migration blocked

**Selezione**: Approccio A primary, B fallback.

### 2.4 Velocità (sotto-issue #4)

#### Approccio A — ADR-038 hedged Mistral 100ms stagger LIVE
- Pro: -25-40% p95 latency proven design
- Contro: env flag activation + monitoring
- Verdict: ✅ RACCOMANDATO

#### Approccio B — Streaming SSE Mistral
- Pro: time-to-first-token critical UX
- Contro: client SSE handler refactor (risk)
- Verdict: ⚠️ DEFER Step 2

**Selezione**: Approccio A per #4.

### 2.5 Off-ELAB paletti soft (sotto-issue #5)

#### Approccio A — System prompt clause "matematica/scienza correlata OK 1 frase + redirect"
- Pro: explicit guardrail
- Contro: modello potrebbe over-comply
- Verdict: ✅ RACCOMANDATO

**Selezione**: Approccio A per #5.

### 2.6 Voice wake word (sotto-issue #6)

#### Approccio A — Diagnose Browser SpeechRecognition status (NON Voxtral)
- Pro: clarify user misconception + verify wake word working
- Contro: Browser API limitations Firefox/Safari NO SUPPORT
- Verdict: ✅ DIAGNOSTIC FIRST

#### Approccio B — Fallback Whisper STT continuous mode (no browser API)
- Pro: cross-browser
- Contro: cost continuous Whisper
- Verdict: ⚠️ DEFER Step 2

**Selezione**: Approccio A diagnostic + B defer.

### 2.7 Lavagna libero truly free (sotto-issue #8)

#### Approccio A — Verify iter 34 fix shipped + force `if (mode === 'libero') api.unmountExperiment?.()`
- Pro: explicit clear
- Contro: depend api method exist
- Verdict: ✅ RACCOMANDATO

**Selezione**: Approccio A per #8.

### 2.8 Homepage redesign (sotto-issues #9-#13)

#### Approccio A — Single-section per concept clean
- Mascotte SVG hero (top)
- Sezione Lavagna ELAB Tutor (only lavagna, NO simulator mix)
- Sezione Glossario integrated (cards principali termini)
- Sezione Cronologia sessioni (UNLIM-generated descriptions)
- Sezione Crediti elevated (Teodora De Venere prominence)
- NO emoji, mascotte SVG illustrations everywhere
- Pro: clean information hierarchy
- Contro: layout refactor sostanziale
- Verdict: ✅ RACCOMANDATO

**Selezione**: Approccio A per #9-#13.

### 2.9 Modalità (sotto-issues #14-#16)

#### Approccio A — Percorso = vecchia libero + 2 window overlay
- Window 1: PercorsoCapitoloView (chapter navigator + lesson context)
- Window 2: UNLIM chat with experiment-aware context
- Adapt: experiment context + classe (memory.ts studentContext) + sessioni precedenti (Supabase sessions)
- Pro: matches user mental model
- Contro: 2-window UX coordination
- Verdict: ✅ RACCOMANDATO

#### Approccio B — PassoPasso older (GalileoAdapter embedded) + add window resize
- Pro: user preferred
- Contro: 2 versions co-exist confusing
- Verdict: ✅ RACCOMANDATO + REMOVE NEW FloatingWindow

**Selezione**: A + B per #14-#16.

### 2.10 Persistence esci → scritte spariscono (sotto-issue #17)

#### Approccio A — Audit drawing bucket save → identify regression iter 28-32
- Pro: empirical fix root cause
- Contro: time-consuming
- Verdict: ✅ DIAGNOSTIC FIRST

#### Approccio B — Force save BEFORE handleMenuOpen redirect
- Pro: defensive guard
- Contro: potential duplicate save
- Verdict: ✅ COMPLEMENT A

**Selezione**: A + B per #17.

---

## §3 — Ultrathink architectural reasoning

### 3.1 PRINCIPIO ZERO compliance per fix (ogni atom)

**Principio Zero §1**: docente è tramite, UNLIM strumento docente, kit fisico protagonista.

| Atom | PZ §1 mandate |
|---|---|
| A1 cap lift | mantenere "Ragazzi" plurale opener mandatory + kit ELAB mention obbligatorio + Vol/cap citation verbatim |
| A2 L2 narrow | template fired SOLO quando azione esplicita (mountExperiment etc), TUTTI i prompt didattici → LLM con full PZ context block |
| A3 memory wire | studentContext include `previous_intents_executed` per UNLIM conoscere cosa ragazzi hanno già fatto in sessione |
| A4 hedged Mistral | NO compromesso PZ output (parallel call same prompt, first response wins) |
| A5 off-ELAB paletti | "matematica correlata OK 1 frase max + ricondurre subito a kit ELAB / esperimento corrente" |
| B1 wake word | "Ragazzi UNLIM" plurale wake (iter 41 D1 already in WAKE_PHRASES) |
| C1 lavagna libero | "Ragazzi, lavagna pulita per disegnare insieme — kit ELAB sempre disponibile sul banco" empty-state plurale |
| D1 homepage mascotte | Mascotte UNLIM SVG (NOT emoji generic), kit ELAB visible hero |
| D2 lavagna section | "Sezione Lavagna ELAB Tutor: spazio condiviso dove docente disegna con i ragazzi sul kit" |
| D3 cronologia | UNLIM-generated descriptions plurale "Sessione X — abbiamo costruito con i ragazzi..." |
| D4 glossario | termini Vol/cap citation verbatim + kit ELAB context per ogni termine |
| D5 crediti | Teodora De Venere = co-dev/UX/QA, narrazione brand familiare ELAB |
| E1 percorso | adapt context lezione + classe + sessioni precedenti = memoria classe Supabase |
| E2 PassoPasso older | "Ragazzi, passo X di N" plurale step indicator |
| F1 esci persistence | "Ragazzi, le vostre note sono salvate" toast confirmation pre-redirect |

### 3.2 Morfismo compliance per fix (ogni atom)

**Sense 1 Tecnico**: morfico runtime per-classe + per-docente
**Sense 1.5 Adattabilità**: docente esperto vs principiante adapt
**Sense 2 Triplet**: software ↔ kit Omaric ↔ volumi cartacei coherent

| Atom | Morfismo mandate |
|---|---|
| A1 cap lift conditional | Sense 1 morfico runtime per-category, Sense 1.5 docente-adapt depth |
| A2 L2 narrow | Sense 1 mutaforma runtime selection LLM vs template per-context |
| A3 memory studentContext | Sense 1.5 per-classe memoria persistente Supabase + per-docente preferenze emergenti |
| A4 hedged Mistral | Sense 1 fault-tolerance morfica (provider failover instant) |
| D1 homepage mascotte | Sense 2 mascotte coerente kit Omaric + volumi (NON emoji generic Unicode) |
| D3 cronologia | Sense 1.5 per-classe history adapted, Sense 2 ogni sessione tied lezione cap volume |
| D4 glossario | Sense 2 termini = stessi termini volumi cartacei verbatim citation |
| E1 percorso adapt | Sense 1.5 piene espressione: classe storia + docente stile + lezione capitolo current |

### 3.3 Architectural decisions key

#### 3.3.1 Onniscenza-classifier estensione 6 → 8 categories

Aggiungere categorie:
- `off_elab_correlato` (matematica/scienza Italian K-12 correlated, max 1 frase + redirect kit)
- `previous_action_query` ("cosa abbiamo fatto prima?", "ricordi che hai aperto LED?") → studentContext intent_history

Cap word per category:

| Category | Cap parole | Rationale |
|---|---|---|
| chit_chat | 30 | greeting brief |
| citation_vol_pag | 80 | citation verbatim + analogia + kit |
| deep_question | 180 | depth technical adatto Vol/cap reference |
| safety_warning | 100 | safety context essential |
| plurale_ragazzi | 80 | docente speech adapt |
| off_elab_correlato | 50 (NEW) | 1 frase + redirect |
| previous_action_query | 100 (NEW) | history recall |
| default | 100 | balanced fallback |

#### 3.3.2 L2 router narrow heuristic

`shouldUseTemplate(query, context)` triggers SOLO se:
1. Query contiene VERBO action explicit: "carica|monta|cattura|esegui|highlight|connetti|cancella"
2. AND `context.experimentId` defined
3. AND query word count <8 (action commands brevi)

Altrimenti → LLM call diretto (skip L2).

**Expected impact**: R7 canonical 3.6% → ~40-60% (range stimato, da misurare)

#### 3.3.3 studentContext schema extension intent_history

`student_progress` table:
```sql
ALTER TABLE student_progress ADD COLUMN IF NOT EXISTS recent_intents JSONB DEFAULT '[]'::jsonb;
-- Schema: [{"intent":"mountExperiment","args":{"id":"v1-cap6-esp1"},"ts":"2026-05-03T17:00Z"},...]
-- Append on intent_executed event, max 20 entries (ring buffer)
```

System-prompt context block:
```
RECENT_ACTIONS (last 5):
- ts:17:00 mountExperiment v1-cap6-esp1
- ts:17:02 highlightComponent led1
- ts:17:03 captureScreenshot
```

#### 3.3.4 ADR-038 hedged Mistral 100ms stagger LIVE

- Env: `HEDGED_MISTRAL_ENABLED=true`
- Trigger: 100ms after primary call → spawn parallel call (Mistral Large + Mistral Small parallel)
- First response wins, second discarded
- Cost: +20-30% Mistral spend
- Latency: -25-40% p95

#### 3.3.5 Modalità Percorso architettura "vecchia libero + 2 window"

Window 1 (PercorsoCapitoloView):
- Lezione context: capitolo current + experiment list
- Adapt: classe history (sessioni passate experiments) + docente stile (preferred capitoli)

Window 2 (UNLIM chat):
- Onniscenza UI snapshot integration ADR-042
- studentContext + intent_history wired

Layout: 2 finestre overlay, draggable, resizable, z-index hierarchy.

---

## §4 — ATOM list ordered ROI Step 1 sessione

### 4.1 ATOM matrix totale (17 atomi)

| ID | Title | Category | Severity | Effort (h) | Files modified |
|---|---|---|---|---|---|
| **A1** | system-prompt cap conditional 6→8 categories | UNLIM intelligence | BLOCKER | 1 | system-prompt.ts + onniscenza-classifier.ts |
| **A2** | L2 router narrow shouldUseTemplate heuristic | UNLIM intelligence | BLOCKER | 1 | clawbot-template-router.ts |
| **A3** | studentContext intent_history persist Supabase | UNLIM intelligence | BLOCKER | 3 | memory.ts + onniscenza-bridge.ts + SQL migration |
| **A4** | ADR-038 hedged Mistral LIVE env activation | UNLIM intelligence | LOW | 0.5 | env config + monitoring |
| **A5** | Off-ELAB paletti soft system-prompt clause | UNLIM intelligence | LOW | 0.5 | system-prompt.ts |
| **B1** | Wake word diagnose + MicPermissionNudge audit | Voice | HIGH | 1 | wakeWord.js + MicPermissionNudge.jsx audit |
| **B2** | Mic permission nudge re-prompt force flow | Voice | HIGH | 0.5 | MicPermissionNudge.jsx |
| **C1** | Lavagna libero truly free unmount experiment | Lavagna libera | HIGH | 1 | LavagnaShell.jsx + simulator-api.js |
| **D1** | Homepage mascotte SVG NO emoji | Homepage | MEDIUM | 1.5 | HomePage.jsx + mascotte SVG asset |
| **D2** | Homepage Lavagna section solo lavagna | Homepage | MEDIUM | 1 | HomePage.jsx |
| **D3** | Homepage Cronologia sessioni new section | Homepage | MEDIUM | 2 | HomePage.jsx + HomeCronologia integration |
| **D4** | Homepage Glossario integrated section | Homepage | MEDIUM | 1 | HomePage.jsx + Glossario port |
| **D5** | Homepage Crediti Teodora De Venere prominence | Homepage | MEDIUM | 0.5 | HomePage.jsx |
| **E1** | Percorso restore vecchia libero + 2 window overlay | Modalità | HIGH | 3 | LavagnaShell.jsx + PercorsoCapitoloView.jsx + new component |
| **E2** | PassoPasso older + window resize | Modalità | HIGH | 1.5 | LavagnaShell.jsx + GalileoAdapter.jsx |
| **E3** | Adapt context lezione + classe + sessioni | Modalità | HIGH | 2 | PercorsoCapitoloView.jsx + memory.ts |
| **F1** | Esci persistence drawing bucket force save | Persistence | BLOCKER | 1 | LavagnaShell.jsx + Supabase sync verify |
| **TOTALE** |  |  |  | **22h** | 11 file modified |

### 4.2 Step 1 sessione subset BLOCKER + HIGH (~10h target)

Selezione realistic per sessione singola (NOT 22h overrun):

**BATCH 1 — UNLIM intelligence core (4h)**:
- A1 cap conditional (1h)
- A2 L2 router narrow (1h)
- A5 off-ELAB paletti (0.5h)
- A4 hedged Mistral LIVE (0.5h)
- F1 esci persistence (1h)

**BATCH 2 — Modalità + UX (5h)**:
- C1 lavagna libero truly free (1h)
- E1 percorso 2-window overlay (3h)
- E2 PassoPasso older preferred (1h)

**BATCH 3 — Voice diagnose (1h)**:
- B1 wake word diagnose (1h)

**BATCH 4 — Homepage (DEFER iter 34 sessione)**:
- D1+D2+D3+D4+D5 (~6h) → separate session

**Totale Step 1 sessione**: ~10h work distributed atomi shippable.

### 4.3 ATOM detail Step 1 sessione

#### ATOM A1 — system-prompt cap conditional (1h)

**Goal**: lift hard MAX 60 parole → conditional per onniscenza-classifier category.

**Files**:
- `supabase/functions/_shared/system-prompt.ts:283` "MAX 60 parole" replace
- `supabase/functions/_shared/onniscenza-classifier.ts:1-150` extend 6 → 8 categories
- Cap word per category lookup map

**Implementation**:
1. Edit onniscenza-classifier add 2 categories: `off_elab_correlato` + `previous_action_query`
2. Add cap word lookup in classifier output
3. Edit system-prompt.ts: replace "MAX 60 parole" → "MAX {wordCap} parole" template
4. Wire wordCap from classifier to system-prompt build

**CoV**:
- Pre: vitest 13752 PASS
- Post: vitest 13752 PASS preserved (NO test modified, only prompt + classifier extension)
- Smoke prod: 5 prompts diversi (chit_chat + deep_question + citation + off_elab_corr + previous_action) → verify response length per category

**Acceptance gate A1**:
- ✅ classifier returns wordCap per category
- ✅ system-prompt receives wordCap via uiState OR new param
- ✅ Smoke prod: chit_chat ≤30 word, deep_question 100-180 word, off_elab_corr ≤50 word + redirect kit ELAB

**Failure mode**:
- Edge Function deploy blocked → defer canary
- Mistral output ignores wordCap → strengthen prompt language

---

#### ATOM A2 — L2 router narrow shouldUseTemplate (1h)

**Goal**: narrow `selectTemplate` trigger to SOLO action_keyword + experimentId + word count <8.

**Files**:
- `supabase/functions/_shared/clawbot-template-router.ts:121-153` `selectTemplate` modify

**Implementation**:
1. Add `shouldUseTemplate(query, context)` helper
2. Rule: ACTION_KEYWORDS = `/\b(carica|monta|cattura|esegui|highlight|connetti|cancella|attiva|spegni|cambia)\b/i`
3. Rule: word count <8
4. Rule: context.experimentId defined
5. ALL 3 rules MUST PASS to fire template, otherwise return null → LLM call

**CoV**:
- Pre: vitest 13752 + clawbot-template-router 19/19 PASS
- Post: vitest 13752 + clawbot-template-router 19/19 + 5 NEW tests narrow heuristic PASS
- Bench R7 200-prompt: canonical lift expected 3.6% → 40-60% range

**Acceptance gate A2**:
- ✅ NEW unit tests pass (5/5)
- ✅ R7 bench post-deploy: canonical ≥30% improvement vs 3.6% baseline
- ✅ Latency NOT regressed (LLM call should remain p95 <3s)

---

#### ATOM A3 — studentContext intent_history persist (3h)

**Goal**: persist `recent_intents` jsonb in `student_progress` Supabase + wire to system-prompt context block.

**Files**:
- NEW: `supabase/migrations/20260503190000_student_progress_recent_intents.sql`
- `supabase/functions/_shared/memory.ts` extend studentContext interface
- `supabase/functions/_shared/onniscenza-bridge.ts` expose recent_intents to aggregator
- `supabase/functions/_shared/system-prompt.ts` add RECENT_ACTIONS context block
- `supabase/functions/unlim-chat/index.ts` post-LLM intent_executed → append recent_intents

**Implementation**:
1. SQL migration: `ALTER TABLE student_progress ADD COLUMN recent_intents JSONB DEFAULT '[]'::jsonb;`
2. memory.ts loadStudentContext: SELECT recent_intents
3. After LLM intent_executed: UPDATE student_progress SET recent_intents = jsonb_array_elements ring buffer 20 entries
4. system-prompt.ts: if recent_intents non-empty, prepend RECENT_ACTIONS block (last 5)

**CoV**:
- Pre: vitest 13752 PASS
- Post: vitest 13752 + 5 NEW unit tests recent_intents append/load PASS
- SQL migration apply Andrea via `supabase db push --linked` (RATIFY GATE)
- Smoke: send 3 intent commands sequential, verify 4° prompt UNLIM references previous

**Acceptance gate A3**:
- ✅ SQL migration applied (Andrea ratify)
- ✅ Edge Function reads/writes recent_intents
- ✅ Smoke: 4° prompt response references previous intent context

**Failure mode**:
- Andrea ratify SQL migration delayed → deploy in-memory session-only fallback (Approccio B), persist DEFER iter 34+

---

#### ATOM A5 — Off-ELAB paletti soft (0.5h)

**Goal**: add system-prompt clause "matematica/scienza correlata OK 1 frase + redirect kit ELAB".

**Files**:
- `supabase/functions/_shared/system-prompt.ts:1488` extend OFF-TOPIC clause

**Implementation**:
1. Replace "DOMANDE OFF-TOPIC: Rispondi brevemente (max 1 frase) e ridireziona all'elettronica"
2. With: "DOMANDE OFF-TOPIC: matematica/scienza correlate ELAB (geometria circuiti, fisica corrente) OK 1 frase contesto + redirect kit. NON-correlato (storia, geografia, intrattenimento) brevemente redirect"

**Acceptance gate A5**:
- ✅ Smoke: prompt "quanto fa 5+3?" → 1 frase contesto + "Ragazzi, sul kit calcoliamo... [redirect circuit]"
- ✅ Smoke: prompt "raccontami una barzelletta" → "Ragazzi, ora siamo concentrati sul kit, costruiamo..."

---

#### ATOM A4 — ADR-038 hedged Mistral LIVE env (0.5h)

**Goal**: activate hedged Mistral 100ms stagger via env.

**Files**:
- `supabase/functions/_shared/llm-client.ts` verify hedged code path exists
- Edge Function env: `HEDGED_MISTRAL_ENABLED=true`

**Implementation**:
1. Verify ADR-038 hedged code path implemented (per CLAUDE.md iter 38 mention "ADR-038 hedged Mistral 100ms stagger DESIGNED but not LIVE")
2. If implemented: set env via `supabase secrets set HEDGED_MISTRAL_ENABLED=true`
3. If NOT implemented: implementation deferred Step 2 (~2-3h work)

**Acceptance gate A4**:
- ✅ Env var set OR code path documented as missing → defer
- ✅ Smoke: 10 prompts measure p95 latency, expect -20-40% vs baseline

---

#### ATOM C1 — Lavagna libero truly free (1h)

**Goal**: mode=libero NOT mount experiment, pure canvas only.

**Files**:
- `src/components/lavagna/LavagnaShell.jsx:617-619+638` verify iter 34 fix shipped + reinforce
- `src/services/simulator-api.js` add `unmountExperiment()` if missing

**Implementation**:
1. Audit iter 34 commit landed in production bundle (`vercel inspect` last deploy)
2. Strengthen: when `modalita === 'libero'`, force `api.unmountExperiment?.()` + clear localStorage `elab-lavagna-last-expId`
3. Update `hasExperiment` state false in libero
4. Hide simulator panels (already line 1160 `{hasExperiment && buildMode !== 'sandbox' && (...)}`)

**Acceptance gate C1**:
- ✅ Switch modalità to libero → simulator unmounts, canvas pulito
- ✅ Switch back to percorso → can re-mount experiment
- ✅ Empty state plurale "Ragazzi, lavagna pulita..."

---

#### ATOM E1 — Percorso 2-window overlay (3h)

**Goal**: Percorso = vecchia libero (full simulator) + 2 finestre overlay (lezione context + UNLIM).

**Files**:
- `src/components/lavagna/PercorsoCapitoloView.jsx` refactor → 2 windows
- `src/components/lavagna/LavagnaShell.jsx` percorso render branch
- NEW: `src/components/lavagna/LessonContextWindow.jsx` window 1
- Reuse: GalileoAdapter UNLIM chat → window 2

**Implementation**:
1. Create LessonContextWindow component: capitolo nav + experiment list + RAG hint context
2. Wire 2 FloatingWindowCommon overlay z-index hierarchy (window 1 left, window 2 right)
3. Adapt context: load classe history (memory.ts studentContext) + sessioni precedenti (Supabase sessions)
4. Default percorso modalità auto-load 2 windows on mount

**Acceptance gate E1**:
- ✅ Percorso modalità → 2 windows visibili overlay
- ✅ Window 1 lezione context populated (capitoli + experiments)
- ✅ Window 2 UNLIM chat operational
- ✅ Adapt context: classe history visible IF Supabase sessions exist

**Failure mode**:
- Memory.ts studentContext NOT have classe history OR sessions → fallback empty state plurale

---

#### ATOM E2 — PassoPasso older preferred (1h)

**Goal**: prefer GalileoAdapter embedded older PassoPasso, add window resize support.

**Files**:
- `src/components/lavagna/LavagnaShell.jsx:1323` REMOVE FloatingWindowCommon NEW PassoPasso
- `src/components/lavagna/GalileoAdapter.jsx:198-end` enhance embedded PassoPasso with resize

**Implementation**:
1. Comment out OR remove iter 36 FloatingWindowCommon PassoPasso branch
2. Restore GalileoAdapter embedded older render
3. Add resize handle to embedded panel (RetractablePanel pattern OR react-resizable)

**Acceptance gate E2**:
- ✅ Modalità passo-passo → embedded older view
- ✅ Resize handle functional
- ✅ Older Avanti/Indietro buttons preserved

---

#### ATOM B1 — Wake word diagnose (1h)

**Goal**: diagnose wake word non-functional + clarify Voxtral misconception.

**Files**:
- `src/services/wakeWord.js` audit current state
- `src/components/common/MicPermissionNudge.jsx` audit nudge flow
- `tests/unit/lavagna/wakeWord-integration.test.jsx` 9/9 PASS verify

**Implementation**:
1. Audit wakeWord.js: verify `startWakeWordListener` invoked on Lavagna mount
2. Audit browser Permissions API status query
3. Test prod browser: open elabtutor.school, mic permission, verify wake "Ragazzi UNLIM" triggers
4. Document findings: wake word IS browser SpeechRecognition (NOT Voxtral) — Voxtral è TTS output only

**Acceptance gate B1**:
- ✅ Audit document `docs/audits/2026-05-03-wake-word-diagnose.md`
- ✅ Root cause identified: browser perm OR code wire OR cross-browser issue
- ✅ Fix shipped OR deferred Step 2 with clear scope

---

#### ATOM F1 — Esci persistence drawing save (1h)

**Goal**: pressing esci preserve drawing buckets, no scritte sparite.

**Files**:
- `src/components/lavagna/LavagnaShell.jsx:851-865` `handleMenuOpen` strengthen
- `src/components/lavagna/DrawingOverlay.jsx` audit save flush

**Implementation**:
1. handleMenuOpen: BEFORE `window.location.hash = '#tutor'`, force-trigger drawing save
2. Add explicit `localStorage.setItem('elab-drawing-' + expId, JSON.stringify(currentPaths))` IF in-memory paths exist
3. Audit DrawingOverlay save mechanism (debounced? immediate?)
4. Add Supabase sync verify (iter 28 25/25 PASS regression check)

**Acceptance gate F1**:
- ✅ Smoke: write 5 strokes Lavagna canvas → press Esci → re-enter Lavagna → strokes preserved
- ✅ localStorage `elab-drawing-{expId}` populated post-Esci
- ✅ Toast plurale "Ragazzi, le vostre note sono salvate" pre-redirect

---

## §5 — Step 1 sessione execution plan (this session)

### 5.1 Workflow trial: Three-Agent Pipeline pattern (multi-provider plan §3.2.1)

Per atomic A1+A2+A5 (UNLIM intelligence core), utilizzo workflow plan §4.3 Atom 1.3 Three-Agent Pipeline:

1. **Phase Plan (Claude orchestrator inline)**: scrivi spec atomic
2. **Phase Implement (Claude inline OR delegate to subagent)**: edit files
3. **Phase Review (G45 multi-vote 3+ vendor preferito IF Andrea ratify Step 2 tools available)**: review diff
4. **Phase Fix (Claude inline)**: address review findings
5. **Phase CoV (deterministic gate)**: vitest preserve + smoke prod

Per Step 1 sessione iniziale (Andrea NON ancora ratify Step 2 multi-vote G45 tools), utilizzo Claude inline con AGENTS.md update + commit batch atomico per audit trail naturale.

### 5.2 Execution sequence Step 1 sessione

**Hour 1**: A1 system-prompt cap conditional + A2 L2 router narrow (parallel edit)
**Hour 2**: A5 off-ELAB paletti + A4 hedged Mistral env audit + F1 esci persistence
**Hour 3**: C1 lavagna libero truly free + B1 wake word diagnose
**Hour 4**: E1 percorso 2-window overlay (deep work)
**Hour 5**: E2 PassoPasso older + restore + resize
**Hour 6**: CoV batch + smoke prod + audit doc + commit + push origin

### 5.3 Anti-pattern enforcement Step 1 sessione

- ❌ NO `--no-verify` (pre-commit + pre-push always honored)
- ❌ NO push main (e2e-bypass-preview branch only)
- ❌ NO destructive ops
- ❌ NO compiacenza claim "all 17 atoms shipped Step 1 sessione" (subset 9 atomi BLOCKER+HIGH realistic)
- ❌ NO Edge Function deploy senza Andrea ratify (env changes + canary rollout pending)
- ❌ NO SQL migration apply senza Andrea ratify (A3 schema migration gated)

### 5.4 Decisione strategica execution

**Approccio A — Sequential atomic shipping**:
- Pro: ogni atomic CoV verified prima next
- Contro: 6h sessione lunga ovverwhelming

**Approccio B — Batch shipping batch_1 → batch_2 → batch_3**:
- Pro: cohesive commits per logical group
- Contro: commit batch may mask atomic failures

**Approccio C — Mixed: BLOCKER inline immediate + HIGH parallel BG agent dispatch**:
- Pro: best ROI velocità + audit trail
- Contro: requires BG agent capacity (org limit risk iter 38 lesson)

**Selezione raccomandata**: Approccio C limited a max 3 BG agents simultanee (anti-cascade lesson iter 38).

---

## §6 — PRINCIPIO ZERO + Morfismo compliance gate per atom

(See §3.1 + §3.2 — every atom must satisfy applicable mandates)

---

## §7 — CoV per atom

| Atom | Pre-CoV | Implementation | Post-CoV |
|---|---|---|---|
| A1 | vitest 13752 PASS | edit prompt + classifier | vitest 13752 + onniscenza-classifier 30/30 PASS + smoke prod 5 prompt category response length |
| A2 | vitest 13752 + clawbot-template-router 19/19 | edit shouldUseTemplate | + 5 NEW tests narrow heuristic + R7 bench measure |
| A3 | vitest 13752 + memory.ts tests | SQL migration + memory + bridge + prompt + chat | + 5 NEW tests recent_intents + Andrea ratify SQL apply |
| A4 | vitest 13752 + llm-client tests | env var set | smoke prod 10 prompt p95 latency measure |
| A5 | vitest 13752 | edit prompt | smoke prod 3 off-topic prompts response shape |
| B1 | vitest 13752 + wakeWord 9/9 | audit + diagnose doc | + audit doc shipped + browser test prod |
| C1 | vitest 13752 | edit modalità + api | smoke prod libero modalità → simulator unmounts |
| E1 | vitest 13752 | refactor PercorsoCapitoloView + new component | + 10 NEW tests 2-window + smoke prod percorso 2 windows visible |
| E2 | vitest 13752 + lavagna 180/180 | remove NEW + restore older + resize | + lavagna sweep 180+ PASS + smoke prod passo-passo older view |
| F1 | vitest 13752 | strengthen handleMenuOpen | smoke prod write strokes → esci → re-enter → strokes preserved |

---

## §8 — Acceptance gates per Step 1 sessione

### 8.1 Pre-condition Step 1 sessione

- ✅ Iter 32 deploy LIVE prod verified (Vercel `319v42i4p` + Edge v80)
- ✅ Vitest baseline 13752 preserved (commits e6aa5e2 + iter 32-33)
- ✅ Andrea time budget ~6h disponibile sessione singola
- ✅ Multi-provider plan iter 33 ratify gate Step 1 entrance ALREADY PROPOSED (queue entry step1-multi-provider-pending iter-31-andrea-flags.jsonl line 20)

### 8.2 Gate Step 1 sessione close

| Atom | Acceptance threshold |
|---|---|
| A1 cap conditional | classifier 8 categories + system-prompt wordCap dynamic + smoke prod PASS 5/5 categories response length adapt |
| A2 L2 narrow | 5 NEW tests PASS + R7 bench post-deploy canonical ≥30% lift vs 3.6% baseline |
| A3 memory | SQL migration shipped + Andrea ratify pending OR in-memory fallback shipped |
| A4 hedged | env set OR code missing audit documented |
| A5 off-ELAB | smoke prod 3/3 off-topic prompts shaped correctly |
| B1 wake word | audit doc shipped + root cause identified |
| C1 lavagna libero | smoke prod libero → unmount simulator |
| E1 percorso 2-window | 10 NEW tests PASS + smoke prod 2 windows visible + adapt context working |
| E2 PassoPasso older | lavagna sweep 180+ PASS + smoke prod older view + resize working |
| F1 esci persistence | smoke prod 5 strokes preserved cross-Esci/Enter cycle |

**Decision Step 1 sessione → iter 34 entrance**:
- 9/10 atomi PASS = Step 1 sessione SUCCESS
- 6-8/10 atomi PASS = Step 1 sessione PARTIAL (defer remaining iter 34)
- ≤5/10 atomi PASS = STOP, retrospective root cause

---

## §9 — Rollback plan per atom

| Atom | Rollback |
|---|---|
| A1 | revert system-prompt.ts + classifier — `git revert HEAD` |
| A2 | revert clawbot-template-router.ts — single-commit revert |
| A3 | SQL migration NOT apply (gated Andrea), in-memory fallback safe revert |
| A4 | unset env var `supabase secrets unset HEDGED_MISTRAL_ENABLED` |
| A5 | revert system-prompt.ts |
| B1 | NO write changes (audit-only) — no rollback needed |
| C1 | revert LavagnaShell + simulator-api |
| E1 | revert + remove new component file |
| E2 | revert LavagnaShell + GalileoAdapter |
| F1 | revert LavagnaShell |

---

## §10 — Andrea ratify questions Step 1 sessione

1. **Step 1 sessione 6h budget OK?** confirm calendario disponibile
2. **A3 SQL migration apply? Andrea autonomous OR ratify gate iter 34?**
3. **Edge Function deploy v81 post Step 1 sessione? canary 5%?**
4. **R7 200-prompt bench post-deploy execute Step 1 sessione close?**
5. **Atomi BLOCKER + HIGH = 9 atomi sufficienti Step 1 sessione, OR drop 1-2 per buffer?**

---

## §11 — Risk register Step 1 sessione

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| 6h budget exceed (deep work atomic E1) | Medium | Medium | Drop E1 to iter 34, ship 8 atomi |
| Edge Function deploy Andrea ratify delayed | Medium | Medium | Code shipped + commit, deploy defer iter 34 |
| SQL migration A3 Andrea ratify delayed | Medium | Low | In-memory fallback ship, persist defer iter 34 |
| Lavagna 180/180 sweep test regression after E2 | Low | High | Pre-edit snapshot baseline, rollback if regress |
| Vitest 13752 baseline regress | Low | High | Pre-commit hook gate, rollback atomic |
| Smoke prod fail post-deploy | Medium | Medium | Rollback Edge Function v80 IF v81 deploy regression |

---

## §12 — Cross-link

- Multi-provider plan: `docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md`
- CLAUDE.md sprint history footer iter 1-32
- Andrea ratify queue: `automa/state/iter-31-andrea-flags.jsonl` (20 entries)
- Score history: `automa/state/score-history.jsonl` (6 entries iter 29+30+38+39+31+33)

---

**Status**: PROPOSED — execution begin questa sessione iter 33+ entrance
**Next-step gate**: begin ATOM A1 (system-prompt cap conditional) inline
