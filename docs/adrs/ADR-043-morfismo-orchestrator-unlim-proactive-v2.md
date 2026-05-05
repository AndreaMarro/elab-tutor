# ADR-043 — Morfismo Orchestrator UNLIM Proactive v2 (4-Layer Fusion)

**Status**: PROPOSED — design only iter 42 PM, ratify gate iter 43, impl batch iter 44-45
**Date**: 2026-05-05 (iter 42 PM autonomous design session)
**Author**: master software architect (Claude Opus 4.7 1M)
**Andrea ratify deadline**: iter 43 entrance gate (Phase 0 ratify queue voce 1+2+3+4+5)
**Atom**: ATOM-S42-PM-DESIGN-ONLY (impl deferred)
**Cross-refs**: ADR-019 (Sense 1.5 Morfismo runtime docente+classe) · ADR-027 (Volumi narrative refactor schema) · ADR-028 §14 (Onnipotenza INTENT dispatcher surface-to-browser amend ACCEPTED iter 37) · ADR-029 (LLM routing 70/20/10 conservative) · ADR-030 (Mistral function calling INTENT canonical PROPOSED iter 38) · ADR-031 (STT migration Voxtral Transcribe 2 PROPOSED iter 38)

---

## §1 Context

### 1.1 Andrea quote literal (Italian, no paraphrase)

Quote da Andrea Marro, founder + sviluppatore primario ELAB Tutor, raccolto durante feedback iter 42 PM 2026-05-05 (audit `feedback_unlim_proactive_lesson_assistant_iter42.md` + master memoria `~/.claude/projects/-Users-andreamarro-VOLUME-3/memory/MEMORY.md` "Feedback Critici" sezione):

> "poi percorso dovrebbe andarsi a contesto, cosa accade durante la lezione, parlare a tutti con linguaggio semplice, essere modellato sullo specifico esperimento, tenere conto delle sessioni precedenti se ricordi unlim in pratica deve preparare e proporre la lezione alla classe/insegnante. l'insegnante da queste cose rivolte a tutti deve riuscire a spiegare la lezione senza preparazione (guardare con coda dell'occhio). Per questo serve che sviluppi l'intelligenza e la velocità di unlim."

Questa è la north-star della v2 dell'orchestratore. Tutte le decisioni architetturali §2-§10 derivano linearmente da questa quote. Qualsiasi gap §10 deve essere giustificato con riferimento esplicito a questa quote, NON a metriche tecniche secondarie.

Decomposizione della quote in 6 vincoli operativi MORFISMO Sense 1.5 (canonical CLAUDE.md §0 + ADR-019):

1. **"percorso dovrebbe andarsi a contesto"** → orchestrator deve fondersi col contesto esperimento corrente (mountExperiment trigger, NON Q&A reattivo)
2. **"cosa accade durante la lezione"** → continuous awareness scena classe (Layer 2 vision daemon polling 5s, scena classification montaggio/errore/completato/inattivo)
3. **"parlare a tutti con linguaggio semplice"** → linguaggio plurale "Ragazzi," + ≤60 parole + analogie età 8-14 (PRINCIPIO ZERO V3 invariante, già ADR-009 + system-prompt.ts:78)
4. **"essere modellato sullo specifico esperimento"** → kit fisico coupling mandatory per esperimento ID (NON software-only steps generici)
5. **"tenere conto delle sessioni precedenti"** → Layer 4 memoria temporale class_memory + recap narrativo ultime 3 sessioni inject system message
6. **"preparare e proporre la lezione alla classe/insegnante"** → Layer 1 lesson generator PROACTIVE 5-step plan, NON reactive chat-tag dispatch

E un goal pedagogico CHIAVE:

> "l'insegnante da queste cose rivolte a tutti deve riuscire a spiegare la lezione senza preparazione (guardare con coda dell'occhio)"

Il docente NON ha tempo di studiare il volume prima della lezione. Il docente apre l'esperimento sulla LIM, guarda con la coda dell'occhio cosa propone UNLIM, e legge ad alta voce ai ragazzi. Il prodotto si misura sulla capacità di rendere il docente fluente IMMEDIATAMENTE, anche al primo anno, anche senza Arduino background. Questo cambia radicalmente il pattern d'uso da "chat Q&A" a "lesson teleprompter".

Infine vincolo non-funzionale:

> "Per questo serve che sviluppi l'intelligenza e la velocità di unlim."

Intelligenza = qualità output (kit-coupled + Vol/pag verbatim + plurale + ≤60 parole) e velocità = latency p95 <1.5s warm. Questi due vincoli sono in tensione (più intelligenza = più context = più latency). Il design Layer 1-4 risolve la tensione tramite caching aggressivo (Layer 1 + Layer 4 cache hit warm) + async non-blocking (Layer 2 fire-and-forget) + sync diff veloce (Layer 3 100ms budget).

### 1.2 Iter 42 PM bugs detected list

Tre bug emersi nel test prod 2026-05-05 (audit `feedback_unlim_chat_broken_iter42.md` + 4 parallel debug agents reports CHANGELOG.md iter 42 PM entry):

**Bug 1 — Onniscenza UI state pre-fix gap** (HIGH confidence 90%): Edge Function `unlim-chat` v83 pre-iter-42-PM env set NON includeva UI state snapshot nel prompt. Var `INCLUDE_UI_STATE_IN_ONNISCENZA=false` di default + `ONNISCENZA_VERSION=v2` (reverted iter 39 era -1.0pp PZ V3 + 36% slower). Risultato: UNLIM rispondeva senza sapere cosa il docente vedeva sullo schermo. Quote pre-iter-42: "Bug 1 ONNISCENZA: UI state NOT injected pre-iter-42-PM env set". Iter 42 PM autonomous decisions ha settato `INCLUDE_UI_STATE_IN_ONNISCENZA=true + CANARY_DENO_DISPATCH_PERCENT=100 + ONNISCENZA_VERSION=v1` LIVE prod. Box 11 Onniscenza ricalibrato 0.85 → 0.5 ONESTO. Fix: env set e Step-Back v84 deploy. Cap iter 42: 7.5/10 ONESTO.

**Bug 2 — mountExperiment dispatcher dual-shape** (HIGH confidence 85%): `src/services/simulator-api.js:264` mountExperiment accettava SOLO positional string `mountExperiment(experimentId)`. Ma `intentsDispatcher.js` (iter 37 B-NEW) passava args object `{id}` o `{experimentId}` per Mistral function calling (ADR-030 §3). Risultato: silent fail return false → "Caricato" pillola UI mostrata MA simulator vuoto (zero componenti). Fix iter 42 PM committed `86b9b52`: surgical patch dual-shape positional+object (`{id}` OR `{experimentId}`). Citation cross-ref: ADR-030 §3 4-way schema drift evidence.

**Bug 6 — HomePage prod regression revert** (HIGH confidence 90%): `ade4ae3` "Kit fisici + volumi + software morfico" version mergiato accidentalmente main, rompeva onboarding (mascotte robot + 3 cards CHATBOT/GLOSSARIO/LAVAGNA), Andrea esplicito "non deve accadere" (feedback_homepage_old_version_regression.md). Fix iter 42 PM PR #62 cherry-pick HEAD `86b9b52` da `e2e-bypass-preview` over main. Audit Vercel deploy `dpl_GvRZwSyfwnWW8FearcxCFf5fbAwL` 14:15 GMT+2 main branch.

Questi 3 bug sono SINTOMI dello stesso problema architetturale: l'orchestratore UNLIM è **reattivo** (chat→tag→dispatch) e NON **proattivo** (mount→plan→teleprompter). Il fix bug-by-bug è un cerotto. ADR-043 v2 propone la cura: 4-layer Morfismo Orchestrator.

### 1.3 Perché ADR-019 + ADR-028 + ADR-030 alone insufficient

I 3 ADR esistenti coprono parzialmente il dominio ma lasciano un gap fondamentale:

- **ADR-019** (Sense 1.5 Morfismo runtime docente+classe): codifica la VISIONE del Morfismo (linguaggio plurale + memoria docente + funzioni morfiche + finestre morfiche) ma NON specifica l'orchestrator runtime. Definisce il QUI (forma adattiva docente+classe) ma non il QUANDO (trigger proattivo) né il COME (lesson plan generation).
- **ADR-028 §14 amend** (Onnipotenza INTENT dispatcher surface-to-browser ACCEPTED iter 37): codifica la pipeline parser server + dispatch browser via `__ELAB_API` per i tag `[INTENT:...]`. È un meccanismo REATTIVO: l'utente scrive in chat, LLM emette tag, dispatcher esegue azione. Non genera lezioni, non predispone scaffolding pedagogico, non guarda lo schermo proattivamente.
- **ADR-030** (Mistral function calling INTENT canonical PROPOSED iter 38): risolve il drift 4-way schema (`args.id` canonical vs `args.experimentId` scorer drift) tramite `response_format: json_schema`. Migliora qualità INTENT dispatch ma resta REATTIVO (LLM call → JSON schema → tools array). Non risolve "preparare e proporre la lezione" della Andrea quote §1.1.

**Gap centrale**: i 3 ADR rispondono a "cosa fa UNLIM **quando** il docente scrive una domanda". L'Andrea quote dice che UNLIM deve fare il lavoro PRIMA che il docente scriva una domanda, perché il docente deve poter "guardare con coda dell'occhio" senza chiedere nulla. Pattern "Q&A reactive" → pattern "lesson teleprompter proactive". ADR-043 v2 colma questo gap fondendo 4 layer in un unico orchestrator.

Mappatura responsabilità:

| Funzione | ADR esistente | ADR-043 Layer |
|----------|---------------|---------------|
| Docente+classe linguaggio plurale | ADR-019 | Layer 1 (preserva) |
| Tag dispatch `[INTENT:...]` | ADR-028 §14 | Layer 3 (verify post-dispatch) |
| Mistral function calling schema | ADR-030 | Layer 1 + Layer 3 (consume canonical) |
| Lesson plan generation 5-step | NESSUNO | **Layer 1 NEW** |
| Continuous screen awareness | NESSUNO | **Layer 2 NEW** |
| Memoria temporale 3-sess recap | NESSUNO (parziale ADR-019 class_memory) | **Layer 4 NEW** |
| Expected vs actual circuit diff | NESSUNO | **Layer 3 NEW** |

### 1.4 Vincoli invarianti iter 42 PM (NON negoziabili)

- Linguaggio plurale "Ragazzi," opener + ≤60 parole + analogia (ADR-009 PZ V3 runtime, system-prompt.ts:78)
- Citazione VERBATIM Vol/pag NO parafrasi (ADR-008 buildCapitoloPromptFragment, RAG 1881 chunks ingest iter 7 close)
- Kit fisico ELAB Omaric coupling mandatory (CLAUDE.md §0 Sense 2 triplet, NO software-only steps)
- Voce Isabella italiana → Voxtral mini-tts-2603 voice clone Andrea IT LIVE iter 31 (ADR-016 + ADR-031 design)
- 5/9 Mistral EU FR stack GDPR-clean concentration (ADR-029 + ADR-031)
- Anti-regressione vitest baseline preservato (iter 42 PM 13474+ count)

---

## §2 Decision — 4-Layer Morfismo Orchestrator Fusion

L'orchestrator UNLIM proactive v2 è una pipeline a 4 layer fusi che si attiva al `mountExperiment` e gira finché il docente non chiude l'esperimento. Ogni layer ha responsabilità ortogonali e budget di latency disgiunti, dimensionati nel §5 budget table.

### 2.1 Layer 1 — Lesson Generator Layer (PROACTIVE, NOT reactive Q&A)

**Trigger**: ogni invocazione di `__ELAB_API.mountExperiment(experimentId)` (vedi `src/services/simulator-api.js:264` post Bug 2 fix iter 42 PM `86b9b52` dual-shape positional+object). Il trigger è il `mountExperiment`, NON una user message in chat.

**Output**: lesson plan strutturato 5-step kit-coupled per experiment ID, generato lato server, persistito in tabella `lesson_plans` (vedi §3 schema), trasmesso al frontend via Server-Sent Events (SSE) chunks per "coda dell'occhio" docente reading. Rendering UI: pannello `LessonPlanFloatingWindow.jsx` (NEW iter 44+, riusa `FloatingWindow.jsx` 225 LOC iter 36) con 5 sezioni accordion espandibili, default expanded section 1 (intro), prossima auto-expand su `[INTENT:nextStep]` tag dispatch o user voice "avanti".

**Lesson plan 5-step schema** (jsonb in `lesson_plans.plan_steps`):

1. **intro**: citazione VERBATIM Vol/pag dal RAG `rag_chunks` (es. "Volume 1, pagina 38, Capitolo 6 — I LED: «Il LED è un diodo emettitore di luce. Si chiama LED dall'inglese Light Emitting Diode...»") + opener plurale "Ragazzi, oggi accendiamo un LED. Aprite il Volume 1 a pagina 38." Step lettura ad alta voce 30-45s docente.
2. **montaggio breadboard**: lista componenti specifici kit Omaric con riferimento volumi (es. "Prendete dal kit ELAB: 1 LED rosso, 1 resistore 220Ω fascia rosso-rosso-marrone, 2 fili maschio-maschio. Volume 1 pag.39 mostra il layout."). Scaffolding step-by-step 3-4 sub-step con highlight pin breadboard via `[INTENT:highlightPin]`. Durata stimata 2-3min.
3. **verifica connessioni**: checklist 4-5 punti verificabili visivamente kit fisico (es. "Verificate insieme: anodo LED su pin 13? gamba lunga? resistore tra GND e catodo? polarità corretta?"). Layer 3 INTENT verify si triggera qui se Layer 2 vision daemon classifica scena `errore_collegamento`.
4. **tinkering esplorativo**: 2 varianti opzionali kit-coupled (es. "Provate a cambiare il resistore con uno da 1kΩ. La luce diventa più debole? Perché?" — risposta attesa: "Più resistenza = meno corrente = LED meno luminoso"). Pedagogicamente importante perché lascia spazio creativo, non solo procedurale.
5. **capstone domanda aperta**: 1-2 domande open-ended discussione classe (es. "Ragazzi, a cosa serve il LED nei dispositivi che usate ogni giorno? TV, telecomandi, smartphone, semafori?"). NO risposta secca: spunto conversazione + collegamento mondo reale.

**Vol/pag citation**: campo dedicato `vol_pag_citation` (text NOT NULL nello schema §3) popolato VERBATIM dal RAG retrieve top-1 chunk per experiment_id. NON paraphrasable. Validato runtime tramite `principio-zero-validator.ts` rule 3 (citation_vol_pag).

**Streaming SSE chunks**: il client `useGalileoChat.js` apre EventSource su nuovo endpoint `/functions/v1/unlim-lesson-plan?experiment_id=X&class_id=Y`. Server emette eventi `event: step` con payload `{stepIndex, stepType, content, vol_pag, durationEstimate}` mano a mano che genera. Latency p95 <1500ms primo chunk, total stream completion <3s. Rationale: docente apre esperimento, vede subito intro+vol/pag (entro 1s) sulla LIM, può iniziare a leggere ad alta voce mentre i passi 2-5 arrivano in background.

**Cache redis-style**: chiave `lesson_plan:{experiment_id}:{class_id}`, TTL 1h, storage Postgres `lesson_plans` table con index su `(experiment_id, class_id)` UNIQUE. Cache invalidation triggers: (1) Vol/pag `volume-references.js` content update → invalida tutte le entries con `vol_pag_citation` legata a quel chunk; (2) experiment_id `lesson-paths/*.json` content update → invalida tutte le entries con quel `experiment_id`; (3) TTL natural expiry 1h. Cache hit warm path Layer 1 = 50ms (Postgres lookup + JSON parse), cold path = 1200ms (LLM Mistral Large + RAG retrieve top-3 + format 5-step).

**Acceptance criteria Layer 1**:
- 94/94 esperimenti hanno lesson plan generabile entro 1500ms p95 cold (5 prompt R5 fixture per cap6/cap3/cap6-vol3)
- 100% lesson plan ha citazione Vol/pag verbatim (validator runtime PASS)
- 100% lesson plan ha kit fisico mention (regex `\b(kit|breadboard|cavo|fili|resistore|LED|Arduino|Nano)\b`)
- 100% lesson plan ha opener plurale "Ragazzi," step 1
- ≥80% docente survey "ho potuto leggere senza preparazione" post-deploy (Andrea + Tea UAT iter 45+)

**LLM provider routing per Layer 1**: Mistral Large `mistral-large-latest` provider primary (ADR-029 70% weight) per generation cold. Mistral Medium `mistral-medium-latest` (20% weight) fallback. Gemini Flash `gemini-2.5-flash-lite` (10% weight) emergency. RAG retrieval top-3 chunks via `_shared/rag.ts` 958 LOC (iter 12 P1 OR-fallback 2-token threshold). Capitolo prompt fragment via `_shared/capitoli-loader.ts` 131 LOC `buildCapitoloPromptFragment` (ADR-008). Sintesi prompt v3.1 (BASE_PROMPT v3 iter 26 close + Step-Back HIDDEN CoT iter 41 P0.2 LIVE iter 42 PM v84) augmented con dedicated lesson plan generation system prompt:

```
Sei UNLIM. Genera lesson plan 5-step per esperimento {experiment_id} kit ELAB Omaric.

VINCOLI INVARIANTI (PRINCIPIO ZERO V3):
- Step 1 inizia "Ragazzi," + cita VERBATIM dal RAG context Vol.X pag.Y
- Ogni step menziona kit fisico (LED/resistore/breadboard/cavo)
- ≤60 parole per step
- Docente-framing (NOT student-framing imperativo)

CONTEXT RAG Vol/pag (top-3 retrieved):
{rag_context}

CAPITOLO REFERENCE:
{capitolo_prompt_fragment}

OUTPUT JSON SCHEMA:
{
  "plan_steps": [
    {"stepIndex": 1, "stepType": "intro", "content": "...", "vol_pag": "Vol.X pag.Y", "durationEstimate": "30-45s"},
    {"stepIndex": 2, "stepType": "montaggio", ...},
    {"stepIndex": 3, "stepType": "verifica", ...},
    {"stepIndex": 4, "stepType": "tinkering", ...},
    {"stepIndex": 5, "stepType": "capstone", ...}
  ],
  "vol_pag_citation": "VERBATIM citation top RAG chunk content"
}
```

Function calling Mistral La Plateforme `response_format: json_schema` (ADR-030) garantisce schema compliance. Drift schema 4-way risolto canonical `args.id` per qualunque INTENT embedded (NOT applicable Layer 1 generation, only Layer 3 verify).

### 2.2 Layer 2 — Continuous Screen Vision Daemon

**Trigger**: post-mount, daemon attivato lato client tramite `setInterval` 5s con cleanup on unmount. Frequency 5s = trade-off tra freshness (≤5s lag) e cost (~12 polls/min × Pixtral 12B call ~0.1s = 1.2s GPU/min/classe).

**Capture**: `__ELAB_API.captureScreenshot()` (vedi `src/services/simulator-api.js:369-405`, iter 38 wired wire-up). Output PNG base64 dello stato simulator + lavagna. Compressed quality 0.5 to <50KB.

**Classify**: invocazione Mistral Pixtral 12B vision (LIVE iter 28 close, EU FR GDPR-clean) con system prompt strict 4-class enum:

```
Classifica la scena classe ELAB in UNA delle 4 categorie:
- montaggio_in_corso: studenti stanno assemblando componenti, qualche cavo connesso
- errore_collegamento: cavo/componente in posizione palesemente errata (resistore mancante, polarità invertita)
- completato_corretto: circuito completo conforme expected_state lesson plan
- inattivo: schermo vuoto/static, nessuna attività rilevabile
Rispondi SOLO con la categoria, nessun altro testo.
```

**Confidence**: la response di Pixtral viene parsata come `{scene_classification: string, confidence: float}` dove confidence = derivato da log-prob top-1 token (se Mistral espone) OR fallback 0.5 default. Soglia accettazione 0.6, sotto soglia → `inattivo` fallback (don't act on unsure vision).

**Inject into next UNLIM call**: la prossima invocazione di `unlim-chat` riceve nel system message append:

```
[CONTESTO_SCENA] Daemon vision ha classificato scena: {scene_classification} (confidence {confidence}). Considera questo nello scegliere se proporre next step lesson plan o se intervenire con suggerimento Layer 3.
```

**Async non-blocking**: il daemon è fire-and-forget. Se Pixtral è down (error 5xx, timeout 2s), il daemon logga in `screen_vision_log` con `scene_classification = NULL + pixtral_confidence = 0.0` e prosegue. NON blocca chat flow utente. NON aggiunge latency al Layer 1 lesson generator.

**Storage**: ogni capture loggata in `screen_vision_log` (vedi §3 schema), retention 7gg auto-purge cron pg_cron, GDPR consenso `class_memory.docente_id` opt-in mandatory (default OFF iter 44 pre-Phase 1, opt-in toggle in Settings dashboard).

**Acceptance criteria Layer 2**:
- ≥80% scene classified non-null (Pixtral availability ≥80% prod)
- ≤2s daemon response time p95 (10 prompt smoke fixture)
- 100% capture stored encrypted at rest Supabase + 7gg auto-purge
- GDPR consenso UI toggle prominente Settings dashboard, default OFF

### 2.3 Layer 3 — INTENT Exec Assertion Verify

**Trigger**: post-dispatcher exec qualunque INTENT azione che modifica stato circuito (`mountExperiment`, `connectWire`, `setComponentValue`, `clearCircuit`). Il trigger è ON-DISPATCH SUCCESS, NON polling.

**Diff check**: orchestrator chiama `__ELAB_API.unlim.getCircuitState()` (vedi `src/services/simulator-api.js:720-723` `getCircuitState` returns `{components, connections, voltages, ...}`) e confronta col campo `expected_state` previsto dal lesson plan step corrente.

**expected_state schema** (jsonb sub-field di `lesson_plans.plan_steps[stepIndex]`):

```jsonc
{
  "expected_state": {
    "components": [
      {"id": "led1", "type": "LED", "color": "rosso"},
      {"id": "r1", "type": "resistor", "value": 220}
    ],
    "connections": [
      {"from": "nano:D13", "to": "r1.A", "expected": true},
      {"from": "r1.B", "to": "led1.anode", "expected": true},
      {"from": "led1.cathode", "to": "nano:GND", "expected": true}
    ],
    "tolerances": {
      "voltage_tolerance": 0.5,
      "wire_position_tolerance": 1
    }
  }
}
```

**NB schema NOT designed yet** (vedi §10 caveat): questo è uno strawman. Definirlo per 94 esperimenti richiede separato PRD (Andrea ratify queue voce 5 iter 43+).

**Mismatch detection**: per ogni `expected.connections[i]`, check che esista una connessione attuale `state.connections.find(c => match(c, expected.connections[i]))`. Se mancante → mismatch. Se cavo presente su pin diverso (`expected pin 13, actual pin 12`) → mismatch con `pin_drift` flag.

**Proactive emit chat suggestion**: in caso mismatch, orchestrator inietta automaticamente messaggio chat docente (NON student-framing, vedi §6 PZ compliance):

```
"Ragazzi, controlliamo insieme: il LED dovrebbe stare collegato al pin 13 dell'Arduino, ma vedo che è sul pin 12. Volete spostarlo? Volume 1 pag.39 mostra lo schema corretto."
```

Questo messaggio non viene da una user query: è un push proattivo Layer 3 verso il chat panel UNLIM. UI: distinto da risposte LLM tramite badge "[Suggerimento UNLIM]" o icona differenziata.

**100ms budget sync**: il diff check è synchronous prima della prossima user message. Budget stretto 100ms per non rallentare percezione UI. Se diff complesso (>20 connections) → graceful degrade async non-blocking (skip suggestion this turn, retry next).

**Acceptance criteria Layer 3**:
- 100% INTENT azioni state-modifying triggerano diff check
- ≤100ms p95 diff check budget
- ≥90% precision suggerimenti (manual review 50 trigger sample, false-positive rate ≤10%)
- Plurale "Ragazzi" + Vol/pag verbatim 100% suggestions

### 2.4 Layer 4 — Memoria Temporale Bridge

**Trigger**: ogni invocazione `unlim-chat` Edge Function (cold path), pre-LLM call.

**Components inject**:
- `fumetto`: tabella esistente Supabase `unlim_session_memory` (iter 32+ wired) o fumetto generated post-session iter 36 (NEW Box 13 PR #6 MERGED MVP non wired). Last 5 panels recap.
- `cronologia`: tabella esistente `sessions` (iter 32+ wired Supabase Auth flow), last 10 sessions metadata (experiment_id, started_at, completed boolean, errors_count).
- `class_memory` NEW table (vedi §3 schema): per-class + per-docente narrative recap ultime 3 sessioni in 200-300 parole formato narrativa coerente (es. "La classe 4ªB ha esplorato i LED nelle ultime 3 sessioni. La docente Maria ha già spiegato la legge di Ohm ma alcuni studenti confondono ancora resistenza e tensione. Hanno completato esperimento v1-cap6-esp1 (LED blink) ma trovato difficoltà con esperimento v1-cap6-esp3 (semaforo) per via del coordinamento 3 LED. Prossima sessione: rinforzare schema breadboard prima di nuovi esperimenti.").

**Inject into UNLIM system prompt**: append blocco al `BASE_PROMPT v3.1` (vedi `supabase/functions/_shared/system-prompt.ts:78`):

```
[MEMORIA_TEMPORALE_CLASSE]
Recap narrativo ultime 3 sessioni classe {class_id} con docente {docente_id}:
{narrative_recap_3sess}

Considera questo contesto: NON ripetere concetti già spiegati, costruisci sopra. Suggerisci progressione coerente.
```

**Cache hit warm 50ms**: `class_memory` lookup is single Postgres SELECT primary key `class_id`. Cold path 150ms include narrative_recap regeneration LLM call (Mistral Small 3 RPM async post-session, NOT inline pre-chat). Update strategia: post-session-end trigger `unlim-session-description` Edge Function (esistente iter 35) → genera nuovo narrative_recap → upsert `class_memory.narrative_recap_3sess`.

**MORFISMO Sense 1.5 + 2 triplet coherence**: il narrative_recap è specifico per docente+classe (Sense 1.5 docente memoria) E coerente con kit Omaric+volumi cartacei (Sense 2 triplet, riferimenti VERBATIM Vol/pag preservati nel recap).

**Acceptance criteria Layer 4**:
- 100% chat call con `class_id` valido injecta `narrative_recap_3sess` se >= 1 sessione passata
- ≤150ms p95 cold (recap regen async, lookup sync)
- 100% recap ha plurale + Vol/pag verbatim
- 0% recap ha PII studenti (solo narrative aggregato, no nomi singoli)

**Recap generation prompt** (post-session async, NON inline pre-chat):

```
Sei UNLIM. Aggiorna narrative_recap_3sess per classe {class_id} docente {docente_id}.

CONTEXT ULTIME 3 SESSIONI:
- Sessione N-2: experiment_id={X}, completed={true|false}, errors={N}, durationMin={M}
- Sessione N-1: idem
- Sessione N (just ended): idem

CONTEXT FUMETTO ULTIMO PANEL:
{fumetto_last_panel}

OUTPUT 200-300 parole NARRATIVA COERENTE:
- Plurale "Ragazzi" o "la classe" o "i ragazzi"
- Cita Vol/pag verbatim ove rilevante
- NON menzionare nomi studenti singoli (PII)
- Tono docente-supportive, non student-imperative
- Identifica progressione concetti (es. "hanno completato LED, prossimo step PWM")
- Identifica difficoltà ricorrenti (es. "confondono ancora resistenza e tensione")
```

Generation provider Mistral Small (ADR-029 fallback rate-limited 3 RPM async post-session, latency tolerable 5-10s post-completion). Persistenza upsert `class_memory.narrative_recap_3sess`.

---

## §3 Schema Postgres

3 nuove tabelle migration (`supabase/migrations/2026XXXX_morfismo_orchestrator.sql`):

```sql
-- Layer 1 cache lesson plans
CREATE TABLE lesson_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id text NOT NULL,
  class_id text NOT NULL,
  plan_steps jsonb NOT NULL,  -- 5-step array {intro, montaggio, verifica, tinkering, capstone}
  vol_pag_citation text NOT NULL,  -- VERBATIM from rag_chunks, NO paraphrase
  generated_at timestamptz DEFAULT now(),
  ttl_expires_at timestamptz,
  generator_provider text,  -- 'mistral-large-latest' | 'mistral-medium-latest' | etc
  generator_latency_ms int,
  UNIQUE (experiment_id, class_id)
);
CREATE INDEX lesson_plans_ttl_idx ON lesson_plans(ttl_expires_at) WHERE ttl_expires_at IS NOT NULL;
CREATE INDEX lesson_plans_class_idx ON lesson_plans(class_id, generated_at DESC);

-- Layer 2 daemon vision log
CREATE TABLE screen_vision_log (
  id bigserial PRIMARY KEY,
  class_id text NOT NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  captured_at timestamptz DEFAULT now(),
  scene_classification text,  -- 'montaggio_in_corso' | 'errore_collegamento' | 'completato_corretto' | 'inattivo' | NULL
  pixtral_confidence float,
  capture_size_kb int,  -- audit tracking
  pixtral_latency_ms int
);
CREATE INDEX screen_vision_log_class_idx ON screen_vision_log(class_id, captured_at DESC);
-- 7-day auto-purge GDPR cron pg_cron
SELECT cron.schedule('purge_screen_vision_log', '0 3 * * *',
  $$DELETE FROM screen_vision_log WHERE captured_at < now() - interval '7 days'$$);

-- Layer 4 memoria temporale bridge
CREATE TABLE class_memory (
  class_id text PRIMARY KEY,
  docente_id text,
  narrative_recap_3sess text,  -- 200-300 parole narrativa coerente kit Omaric+volumi
  last_updated timestamptz DEFAULT now(),
  sessions_count_total int DEFAULT 0,
  experiments_completed text[],  -- array experiment_id list
  consenso_gdpr_minori_at timestamptz,  -- consenso esplicito docente raccolta dati aggregati
  consenso_layer2_vision_at timestamptz  -- separato opt-in screen_vision_log
);
```

RLS policies: `lesson_plans` SELECT autenticati class_id match, `screen_vision_log` SELECT solo docente owner della classe, `class_memory` SELECT idem. Service role per Edge Functions bypass RLS standard pattern.

```sql
-- RLS policy lesson_plans
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_plans_class_select" ON lesson_plans
  FOR SELECT TO authenticated
  USING (class_id = current_setting('app.class_key')::text);

-- RLS policy screen_vision_log
ALTER TABLE screen_vision_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "screen_vision_log_class_select" ON screen_vision_log
  FOR SELECT TO authenticated
  USING (class_id = current_setting('app.class_key')::text);

-- RLS policy class_memory
ALTER TABLE class_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "class_memory_class_select" ON class_memory
  FOR SELECT TO authenticated
  USING (class_id = current_setting('app.class_key')::text);

-- GRANT statements
GRANT SELECT ON lesson_plans TO authenticated;
GRANT SELECT, INSERT ON screen_vision_log TO authenticated;
GRANT SELECT, UPDATE ON class_memory TO authenticated;
GRANT ALL ON lesson_plans, screen_vision_log, class_memory TO service_role;
```

Schema migration NOT in conflict con migrations esistenti S1/10 Supabase + Dashboard 04/04/2026 (8 tabelle core sessions + nudge + lesson_contexts + ...). Migration filename pattern `2026MMDDHHmmss_morfismo_orchestrator_v2.sql` → applicato via `npx supabase db push --linked` post Andrea ratify.

**Storage projection**: `lesson_plans` table ~94 esperimenti × ~50 classi attive prod target Sprint U = 4700 rows × ~2KB jsonb = ~10MB total + cache rotation. `screen_vision_log` 7gg retention × 50 classi × 6h/g × 12 polls/min = 1.2M rows/giorno × ~200 byte = ~240MB/g × 7g = ~1.7GB rolling. Heavy. Consider TimescaleDB hypertable iter 46+ se prod scale ≥100 classi. `class_memory` 50 rows × ~5KB = ~250KB negligibile.

---

## §4 Edge Function `unlim-chat` changes

Pseudocodice modifiche `supabase/functions/unlim-chat/index.ts` (current 769 LOC):

```typescript
// Pre-LLM Layer 1: lesson_generator_layer
let lessonPlan = await lessonPlanCache.get(experimentId, classId);
if (!lessonPlan) {
  lessonPlan = await generateLessonPlan({
    experimentId, classId,
    ragContext: await retrieveTop3Chunks(experimentId),
    capitoloPrompt: await buildCapitoloPromptFragment(experimentId),
    targetMode: 'percorso'
  });
  await lessonPlanCache.set(experimentId, classId, lessonPlan, ttl: 3600);
}

// Pre-LLM Layer 2: screen_vision_context inject async
const visionContext = await screenVisionLog.latest(classId, sinceMs: 10000);
const visionInject = visionContext
  ? `[CONTESTO_SCENA] ${visionContext.scene_classification} (conf ${visionContext.confidence})`
  : '';

// Pre-LLM Layer 4: memoria_temporale_bridge inject system message
const classMemory = await classMemoryRepo.get(classId);
const memoriaInject = classMemory?.narrative_recap_3sess
  ? `[MEMORIA_TEMPORALE_CLASSE]\n${classMemory.narrative_recap_3sess}`
  : '';

// LLM call with combined context
const systemPromptAugmented = BASE_PROMPT_V3 + lessonPlan.context + visionInject + memoriaInject;
const llmResponse = await callLLMWithFallback({systemPrompt: systemPromptAugmented, userMessage});

// Post-LLM Layer 3: intent_verify_layer assertion diff
const intents = await parseIntentTags(llmResponse.text);  // ADR-028 §14
for (const intent of intents) {
  if (isStateModifying(intent.tool)) {
    const expectedState = lessonPlan.plan_steps[currentStep].expected_state;
    const actualState = await getCircuitStateBrowser();  // surface-to-browser dispatch
    const diff = computeStateDiff(expectedState, actualState);
    if (diff.hasMismatch) {
      llmResponse.proactive_suggestion = formatMismatchSuggestion(diff, lessonPlan.vol_pag);
    }
  }
}

return Response.json({...llmResponse, lesson_plan: lessonPlan, vision_context: visionContext});
```

LOC delta projection: +280 LOC (Layer 1 generator 80 LOC + cache 40 LOC + Layer 2 inject 30 LOC + Layer 3 diff 60 LOC + Layer 4 inject 20 LOC + glue 50 LOC). Da 769 → 1049 LOC. Heavy. Iter 44+ refactor split sub-modules `_shared/morfismo-orchestrator/{lesson-generator,vision-bridge,intent-verify,class-memory}.ts` mandatory.

**TypeScript type signatures key**:

```typescript
// _shared/morfismo-orchestrator/lesson-generator.ts
export interface LessonPlanStep {
  stepIndex: 1 | 2 | 3 | 4 | 5;
  stepType: 'intro' | 'montaggio' | 'verifica' | 'tinkering' | 'capstone';
  content: string;  // ≤60 parole, plurale Ragazzi, kit-coupled
  vol_pag: string;  // VERBATIM citation
  durationEstimate: string;  // human readable "30-45s"
  expected_state?: ExpectedCircuitState;  // populated only steps 2+3
}
export interface LessonPlan {
  id: string;
  experiment_id: string;
  class_id: string;
  plan_steps: LessonPlanStep[];
  vol_pag_citation: string;
  generated_at: string;
  ttl_expires_at: string;
}

// _shared/morfismo-orchestrator/vision-bridge.ts
export interface VisionContext {
  scene_classification: 'montaggio_in_corso' | 'errore_collegamento' | 'completato_corretto' | 'inattivo' | null;
  pixtral_confidence: number;
  captured_at: string;
}

// _shared/morfismo-orchestrator/intent-verify.ts
export interface ExpectedCircuitState {
  components: Array<{id: string; type: string; [k: string]: unknown}>;
  connections: Array<{from: string; to: string; expected: boolean}>;
  tolerances: {voltage_tolerance: number; wire_position_tolerance: number};
}
export interface StateDiff {
  hasMismatch: boolean;
  missing_connections: Array<{from: string; to: string}>;
  unexpected_connections: Array<{from: string; to: string}>;
  pin_drift: Array<{component: string; expected: string; actual: string}>;
}

// _shared/morfismo-orchestrator/class-memory.ts
export interface ClassMemory {
  class_id: string;
  docente_id: string;
  narrative_recap_3sess: string;
  last_updated: string;
  sessions_count_total: number;
  experiments_completed: string[];
  consenso_gdpr_minori_at: string | null;
  consenso_layer2_vision_at: string | null;
}
```

Type definitions allinati con schema §3. Cross-cutting helpers `getCircuitStateBrowser()` surface-to-browser via ADR-028 §14 amend pipeline (parser server + dispatch browser via `__ELAB_API.unlim.getCircuitState()` round-trip ~80ms median).

---

## §5 Latency budget (target p95 <1.5s warm)

| Layer | Cold path | Warm path | Notes |
|-------|-----------|-----------|-------|
| Layer 1 (lesson generator) | 1200ms | 50ms | Cache hit warm Postgres SELECT + JSON parse |
| Layer 2 (vision daemon inject) | 200ms async | 200ms async | Non-blocking, latest entry SELECT |
| Layer 3 (intent verify diff) | 100ms | 100ms | Sync diff post-dispatch |
| Layer 4 (class_memory inject) | 150ms | 50ms | Cache hit warm |
| LLM call (Mistral function calling) | 800ms | 800ms | ADR-030 schema canonical |
| **TOTAL warm path** | — | **~1.3s p95** | Target <1.5s ACHIEVED projection |
| **TOTAL cold path** | ~2.4s | — | Acceptable first-mount, post lesson_plan cached |

UNVERIFIED prod (vedi §10 caveat 1). R7 200-prompt re-bench post-deploy iter 45+ mandatory.

---

## §6 PRINCIPIO ZERO compliance gates

7 gate mechanical pre-merge ADR-043 (riusano `principio-zero-validator.ts` iter 7+):

1. **Linguaggio plurale "Ragazzi," opener** mandatory ogni step lesson plan + ogni Layer 3 suggestion (regex `^Ragazzi,?` start string). Andrea iter 21+ mandate carryover.
2. **Vol/pag VERBATIM citation** ogni intro step (NO parafrasi). Validator runtime PASS lookup `rag_chunks.content` exact substring match.
3. **Kit fisico coupling mandatory** ogni montaggio step (regex `\b(kit|breadboard|cavo|fili|resistore|LED|Arduino|Nano|Omaric)\b` PASS).
4. **Docente-framing tone** (NOT student-framing). Test rule: lesson plan NON contiene 2nd person singular imperativo verso docente ("fai questo", "metti il LED"). Use plurale verso classe ("prendete dal kit", "aprite il volume") OR docente-direct framing ("la docente legge ad alta voce", "il docente verifica").
5. **≤60 parole cap** per ogni response chunk inviato al docente runtime (Layer 3 suggestion incluso, Layer 1 step text incluso).
6. **Analogia obbligatoria step montaggio + tinkering** (regex match `\b(come|simile|funziona come)\b` OR concept analogy explicit).
7. **NO emoji come icone** (CLAUDE.md regola 11), uso ElabIcons SVG inline.

**5 example lesson plans evidence**:

a) `v1-cap6-esp1` (LED blink Volume 1 pag.38-40)
b) `v1-cap6-esp3` (Semaforo 3-LED Volume 1 pag.45-48)
c) `v2-cap3-esp2` (Pulsante input Volume 2 pag.52-55)
d) `v3-cap6-esp4` (Effetto polizia 2-LED alternato Volume 3 pag.78-82)
e) `v3-cap8-serial` (Comunicazione Serial Volume 3 pag.115-118)

Esempio lesson plan v1-cap6-esp1 step 1 (intro):

> "Ragazzi, oggi accendiamo un LED rosso. Aprite il Volume 1 a pagina 38. Leggiamo insieme: «Il LED è un diodo emettitore di luce. La sua sigla viene dall'inglese Light Emitting Diode.» Tra poco lo monteremo sulla breadboard del kit ELAB."

Validator PASS: opener Ragazzi ✓ + Vol/pag verbatim ✓ + kit fisico ✓ + docente-framing ✓ + 39 parole ≤60 ✓ + analogia (LED = diodo) ✓ + NO emoji ✓.

Esempio lesson plan v1-cap6-esp1 step 2 (montaggio breadboard):

> "Ragazzi, prendete dal kit ELAB: 1 LED rosso, 1 resistore 220Ω (fasce rosso-rosso-marrone), 2 fili maschio-maschio. Volume 1 pagina 39 mostra lo schema. Mettiamo il LED sulla breadboard, gamba lunga (anodo) verso pin 13 dell'Arduino, gamba corta (catodo) verso GND attraverso il resistore."

Validator PASS: opener Ragazzi ✓ + Vol/pag verbatim ✓ + kit fisico ✓ + docente-framing ✓ + 56 parole ≤60 ✓ + analogia (gamba lunga = anodo) ✓ + NO emoji ✓.

Esempio lesson plan v3-cap6-esp4 step 5 (capstone):

> "Ragazzi, l'effetto polizia che abbiamo costruito si vede nei lampeggianti delle auto della polizia. Secondo voi, perché alternano due colori e non uno solo? Discutiamone. Volume 3 pagina 82 spiega che attira più attenzione del singolo lampeggio."

Validator PASS: opener Ragazzi ✓ + Vol/pag verbatim ✓ + kit fisico (implicit "abbiamo costruito") ⚠ → strengthen: "che abbiamo costruito sul kit" (+2 parole) ✓ + docente-framing ✓ + 47 parole ≤60 ✓ + analogia (lampeggianti polizia) ✓ + NO emoji ✓.

Esempi v2-cap3-esp2 (pulsante input) e v3-cap8-serial (Serial communication) seguono stesso pattern, generabili in iter 44+ pilot deployment + manual review Andrea + Tea.

---

## §7 MORFISMO Sense mapping

ADR-019 canonical Sense 1.5 + Sense 2 triplet (CLAUDE.md §0):

| Sense | Description | ADR-043 Layer realization |
|-------|-------------|----------------------------|
| Sense 1 | lesson_plan ↔ kit_pieces ↔ canvas_state runtime adattivo | **Layer 1** (kit-coupled lesson plan generator) + **Layer 3** (canvas_state diff vs expected) |
| Sense 1.5 | docente ↔ classe ↔ memoria | **Layer 4** (class_memory narrative recap docente+classe) + **Layer 1** (lesson plan modeled per-class progression) |
| Sense 2 | esperimento ↔ contesto ↔ verifica triplet coerenza kit Omaric+volumi cartacei | **Layer 1** (Vol/pag VERBATIM intro) + **Layer 2** (vision daemon scena classe contesto) + **Layer 3** (verifica circuit diff) |

Tutti e 3 i Sense sono coperti dal 4-layer fusion. Sense 1 + 2 + 1.5 NON sono ortogonali, si fondono nel runtime orchestrator: la stessa lesson plan è kit-coupled (Sense 1 + 2) E class-aware (Sense 1.5) E experiment-specific (Sense 2). Il fusion layer è il valore dell'ADR-043.

---

## §8 Canary rollout

Phase 1 (settimana 1): 5% scuole opt-in volontario (tipicamente 1 scuola pilot Andrea network). Goal shakedown bug surface, latency p95 misurato real-world, feedback docente UAT raccolto. Trigger rollback: PZ V3 score <0.7 OR latency p95 >2s OR docente complaint >1 verbalizzato Andrea.

Phase 2 (giorno 11+ post 3-day stability Phase 1): 25% scuole. Goal scaling validation Pixtral cost real-world (vedi §9 voce 1), Postgres lesson_plans cache hit rate misurato (target ≥80% post-warmup classi attive).

Phase 3 (giorno 18+ post 7-day no-regression Phase 2): 100% scuole. Goal full prod. Continued monitoring con dashboard Grafana cost/quality/latency live.

Rollback mechanism: env var `MORFISMO_ORCHESTRATOR_V2_ENABLED=true|false` Edge Function reload (single env flag flip ~2min via `npx supabase secrets set`). Fallback path: ADR-028 §14 INTENT dispatcher reactive standalone (status quo iter 42 PM).

---

## §9 Open questions Andrea ratify queue

5 voci enumerate per Andrea ratify gate iter 43 entrance:

1. **Layer 2 Pixtral cost projection** ~$5/classe/giorno (basato 12 polls/min × 6h scuola/giorno × $0.0001/call Pixtral 12B Mistral La Plateforme tiered). Per scuola media 10 classi = $50/giorno = $1500/mese. UNLIM revenue €20/classe/mese × 10 = €200/mese. **DISCREPANCY**: Pixtral cost > revenue. Andrea decisione: (a) rimuovere Layer 2 dal MVP iter 44; (b) frequenza polling 30s invece 5s (riduce cost 6x = $250/mese viable); (c) Pixtral solo on-demand trigger (es. quando lesson plan step 3 verifica è attivo, NOT continuous). Ratify deadline iter 43.

2. **Layer 4 class_memory persistence GDPR**: dati aggregati narrativa classe sono pseudonimizzati (no nomi singoli studenti) ma Right To Be Forgotten (RTBF) GDPR Art. 17 minori mandatory. Implementation: cron job `purge_class_memory` triggered da `unlim-gdpr` Edge Function (esistente Nanobot V2) on docente/parent request. Andrea decisione: ratifica policy + UI toggle "Cancella memoria classe" Settings dashboard.

3. **Layer 1 cache invalidation**: Vol/pag content update (`volume-references.js` 94/94 enriched, iter 37 +2) trigger automatico OR manuale? Automatic = ogni `npm run sync-volumi` invalida tutte le `lesson_plans` con `vol_pag_citation` matching → re-generate next access. Manual = Andrea/Tea CLI command esplicito. Andrea decisione: automatic raccomandato (consistency mandate Sense 2 triplet).

4. **Streaming SSE rollout**: coupled con questo ADR (Layer 1 emit SSE chunks first-mount) OR separate ADR-044 dedicata? Coupled raccomandato (Layer 1 senza SSE = peggiore UX docente "coda dell'occhio"). Separate = scope ridotto iter 44, SSE deferred iter 46. Andrea decisione: coupled iter 44 raccomandato.

5. **Sprint window**: iter 43 design ratify only (Andrea ~30min review + decisions §9 voce 1-4) + iter 44-45 impl batch (Maker-1 + Maker-2 + Tester batch ~16-20h)? OR design+impl singola iter 44 mega-sprint? Design+impl single iter rischio scope explosion. Ratify+impl batch raccomandato.

---

## §10 Honest gaps + caveats

10 caveat onesti pre-impl, mandate G45 anti-inflation:

1. **Latency budget UNVERIFIED prod**: §5 budget table è teorica, NON misurata. R7 200-prompt re-bench post-deploy iter 45+ mandatory verify. Possibile cap reale 2.0-2.5s p95 cold se Mistral Large lesson generation prende >1500ms. Mitigation: provider routing 70/20/10 ADR-029 + Mistral Small fallback per Layer 1 cold.

2. **Layer 2 screen vision quality UNPROVEN**: Pixtral 12B classification 4-class accuracy NON misurata su scene ELAB reali. Possibili hallucination "errore_collegamento" false positive. Mitigation: confidence threshold 0.6 + human-in-loop docente decide se agire su Layer 3 suggestion. Iter 44 impl P0.5: smoke fixture 50 scene reali (Andrea + Tea capture) + manual labeling ground truth + Pixtral accuracy %.

3. **Layer 1 cost projection ~5K LLM calls/classe/mese × €0.0008 = €4/classe/mese**: vs revenue €20/classe/mese = 80% margin OK. MA assume cache hit ≥80% post-warmup (NON misurato). Worst-case cache miss 100% = 25K calls/mese × €0.0008 = €20/classe/mese = 0% margin. Mitigation: cache TTL aggressivo 1h + pre-warm cron job batch 94 esperimenti × top-10 classi attive.

4. **Layer 4 class_memory NOT wired existing**: greenfield Supabase migration. Sessione 1 docente apre prima volta → narrative_recap NULL → fallback prompt senza memoria contesto. Onboarding flow needed iter 44+ P0.6: dopo 3 sessioni complete, prima generation narrative_recap async + UI nudge "memoria classe disponibile".

5. **Layer 3 expected_state schema NOT designed yet**: §2.3 strawman schema. Per 94 esperimenti definire `expected_state` richiede separato PRD ADR-044 (deferred iter 45+). Iter 44 MVP: solo 5 esperimenti pilot (cap6-esp1 + cap6-esp3 + cap3-esp2 + cap6-esp4 + cap8-serial) hanno expected_state. Layer 3 attivo solo per quei 5. Altri 89 esperimenti = Layer 3 skip + only Layer 1+2+4.

6. **92 esperimenti audit NOT closed**: Andrea iter 21+ carryover, parità volumi gap. Ralph loop Sprint U Cycle 1 audit-only iter 1 trovato 73/94 lesson-paths singolare imperative violations + 91/94 teacher_messages missing "Ragazzi," opener. Cycle 2 fix codemod NOT executed iter 42. Layer 1 lesson plan generation depende qualità lesson-paths source. Senza Cycle 2 close, Layer 1 inherit garbage-in-garbage-out. Mitigation: blocking dependency Cycle 2 fix BEFORE iter 44 Layer 1 impl.

7. **Linguaggio codemod 200 violations NOT fixed**: Andrea iter 21+ carryover, NOT addressed iter 38 (Maker-3 ZERO deliverables). Stesso impatto §10 caveat 6: Layer 1 inherit. Mitigation: codemod prerequisite iter 44 entrance gate.

8. **PRINCIPIO ZERO V3 score post-Layer-1 ≥0.95 ASSUMED, NOT measured**: post-Layer-1 deploy iter 45+ R7 200-prompt re-bench misurazione mandatory. Possibile cap reale 0.85-0.90 se Mistral Large generation drift Vol/pag verbatim under load. Mitigation: post-LLM validator stricter `principio-zero-validator.ts` rule 3 hard-fail + retry once.

9. **Score G45 post-impl**: cap mechanical 8.0/10 max iter 45+ realistic. Single-shot 9.5 NOT achievable senza A10 Onnipotenza Deno port (ADR-028) + canary rollout 100% + Andrea Opus indipendente review iter 21+ mandate carryover. Mitigation: Sprint U/V/W projection 8.0 → 8.5 → 9.0 multi-iter iter 45-50 path realistic.

10. **§9 Andrea ratify queue voci 1-4 NOT closed**: design ADR-043 v2 emesso iter 42 PM, ratify iter 43 entrance gate. Senza ratify, impl iter 44 BLOCKED. Iter 43 deve essere design-ratify-only sprint (Andrea ~30min review + decisione 5 voci). Mitigation: handoff iter 42 PM → iter 43 entrance prompt esplicito Phase 0 ratify queue P0.1 ADR-043 prima di qualunque impl atom.

---

**File path**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/adrs/ADR-043-morfismo-orchestrator-unlim-proactive-v2.md`

**Cross-link iter 42 PM**: CHANGELOG.md "iter 42 PM" entry + `feedback_unlim_proactive_lesson_assistant_iter42.md` + `feedback_orchestrator_architecture_iter42.md` + `automa/team-state/sprint-contracts/sprint-T-iter-42-contract.md`.

**Implementation atoms preview iter 44** (DESIGN ONLY iter 42 PM, NO impl):
- ATOM-S44-A1 Layer 1 lesson generator + cache (Maker-1 ~6h)
- ATOM-S44-A2 Layer 2 vision daemon client + log table (Maker-1 ~3h)
- ATOM-S44-A3 Layer 3 intent verify diff (Maker-2 ~4h)
- ATOM-S44-A4 Layer 4 class_memory + recap regen async (Maker-2 ~3h)
- ATOM-S44-A5 5 lesson plans pilot esperimenti expected_state PRD (Documenter ~3h)
- ATOM-S44-A6 R7 200-prompt re-bench post-deploy + PZ V3 measure (Tester ~2h)
- ATOM-S44-A7 Canary rollout 5% Phase 1 + Grafana dashboard (Orchestrator ~2h)

Total iter 44 estimated: 23h (3-day batch sprint S44 dual-developer Maker-1+Maker-2 parallel).
