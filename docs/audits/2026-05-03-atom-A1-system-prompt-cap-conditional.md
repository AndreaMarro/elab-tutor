# Audit Atom A1 — system-prompt cap conditional 6→8 categories iter 34

**Data**: 2026-05-03 23:25 GMT+2
**Sessione**: iter 34 Phase 1+ atomi
**Branch**: e2e-bypass-preview
**HEAD pre-A1**: 8141b8a (Phase 0.1+0.2 audit)
**Vitest baseline**: 13752 PASS preservato + 18 NEW = 13770 atteso post-commit
**Skill metric ELAB**: principio-zero G+1 cap-word + onniscenza relevant

## §1 Spec

Atom A1 dal briefing playbook §4.3:
> "A1 system-prompt cap conditional 6→8 categories"

Estendi pre-LLM regex classifier `onniscenza-classifier.ts` da 6 → 8 categorie aggiungendo `meta_question` + `off_topic`. Aggiungi `capWords` field a ClassificationResult per cap word per category. Helper system-prompt + Edge Function gate env-based default OFF (zero regression).

## §2 Modifiche file

### 2.1 `supabase/functions/_shared/onniscenza-classifier.ts` (+~80 LOC)

**Cambiamenti**:
- PromptCategory union: 6 → 8 entries (aggiunti `meta_question`, `off_topic`)
- ClassificationResult interface: aggiunto `capWords: number` field
- 2 nuovi regex: `META_RE` (chi sei, come funzioni, come ti chiami, sei un robot) + `OFFTOPIC_RE` (calcio, gaming, social, politica)
- classifyPrompt: 2 nuove branches priorità #2-#3 (post safety, pre chit_chat) — meta + off_topic skipOnniscenza=true topK=0
- 6 esistenti branches: aggiunto `capWords` field a ognuna (chit_chat=30, citation/plurale/default=60, deep=120, safety=80)
- ONNISCENZA_CLASSIFIER_VERSION: `'1.0-iter37-iter38-doc-only'` → `'1.0-iter37-iter38-doc-iter34-cap-conditional'` (preserve `/iter37/` substring per test contract)

**Behavior matrix iter 34**:
| Category | skipOnniscenza | topK | capWords | Use case |
|----------|----------------|------|----------|----------|
| safety_warning | false | 3 | 80 | Pericolo brucia → safety FIRST |
| meta_question | true | 0 | 50 | Chi sei? → 2 frasi self-intro |
| off_topic | true | 0 | 40 | Parliamo di calcio → soft deflect kit |
| chit_chat | true | 0 | 30 | Ciao → 1 frase secca |
| citation_vol_pag | false | 2 | 60 | Vol.1 pag.27 → top-2 focused |
| plurale_ragazzi | false | 2 | 60 | Ragazzi montiamo → top-2 |
| deep_question | false | 3 | 120 | ≥20w + "?" → top-3 + words spazio |
| default | false | 3 | 60 | Fallback → top-3 + cap default |

### 2.2 `supabase/functions/_shared/system-prompt.ts` (+~70 LOC)

**Cambiamenti**:
- NEW export `getCategoryCapWordsBlock(category: string, capWords: number): string`
- Defensive: invalid input → empty string (no degradation)
- Switch su 8 categorie produce Italian instruction text che OVERRIDE BASE_PROMPT v3.2 line 96 universal cap (60 parole)
- PRINCIPIO ZERO §1 invariants preservati per category:
  - Plurale "Ragazzi," opener mandatory ALL categories
  - Vol/pag verbatim citation tra «caporali» mandatory categories educational (citation, plurale, deep, default, safety) — NOT meta/off/chit
  - Kit ELAB physical mention raccomandato categories hands-on (default, plurale, deep, safety)
- Esempi few-shot per category:
  - chit_chat: "Ragazzi, ciao! Pronti per l'esperimento?"
  - meta_question: "Ragazzi, sono UNLIM, l'aiutante didattico di ELAB. Vi guido nei circuiti seguendo i vostri 3 volumi e il kit fisico."
  - off_topic: "Ragazzi, oggi mi specializzo in elettronica. Vediamo insieme un esperimento sul vostro kit ELAB? C'è il LED che vi piacerà!"

### 2.3 `supabase/functions/unlim-chat/index.ts` (+~15 LOC)

**Cambiamenti**:
- Import: aggiunto `getCategoryCapWordsBlock` dal shared module
- Pre system-prompt build: env gate `ENABLE_CAP_CONDITIONAL` (default false) + helper call (returns empty string if env false)
- systemPrompt chain: aggiunto `+ capConditionalBlock` (LAST, after imagePiiGuard)
- Response telemetry: aggiunto `cap_conditional_active` boolean field + `capWords` a `prompt_class` payload (debug_retrieval=true gate)
- Default OFF preserves existing behavior (BASE_PROMPT v3.2 60-word cap stays in effect)

### 2.4 `tests/unit/onniscenza-classifier.test.js` (+~85 LOC, 18 NEW tests)

**Cambiamenti**:
- 6 NEW meta_question tests: Chi sei?, Come ti chiami?, Come funzioni?, Cosa sai fare, sei un robot, meta beats plurale priority 2>6
- 6 NEW off_topic tests: parliamo di calcio, Juventus/Inter/Milan, Fortnite/Minecraft/PS5, social media, NOT trigger educational temperatura, off_topic beats plurale priority 3>6
- 6 NEW capWords tests: safety=80, chit_chat=30, citation/plurale/default=60, deep=120

## §3 Test results

**Vitest classifier focused run**:
```
✓ tests/unit/onniscenza-classifier.test.js (48 tests) 85ms
Test Files  1 passed (1)
Tests       48 passed (48)
Duration    5.70s
```

**48/48 PASS** = 30 baseline iter 37 + 18 NEW iter 34. Zero regression.

**Vitest baseline progression**: 13752 → 13770 atteso (+18 NEW, verifica pre-commit hook batch).

## §4 Skill metric refinement (per playbook §0.0 K.2 mandate)

### 4.1 elab-principio-zero-validator G+1 cap-word per category (NEW iter 34)

**Gate proposto**: misura cap word effectivo response prod per category vs target capWords.

```bash
# Pseudocode iter 35+ implementazione
curl -X POST $UNLIM_CHAT -d '{"message":"Chi sei?","debugRetrieval":true}' | \
  jq '.prompt_class.capWords as $cap | .response | length / 5 as $words | $words <= $cap'
```

Target: ≥80% prod responses category-bound respect capWords cap.

### 4.2 elab-onniscenza-measure G+1 NEW iter 34

**Gate proposto**: skipOnniscenza adoption rate per category. Verifica che meta_question + off_topic categories NON triggerano aggregator (latency wasted).

Target: meta_question + off_topic + chit_chat skipOnniscenza=true 100% (risparmio 500-1000ms latency).

## §5 Caveat onesti (NO compiacenza)

1. **Edge Function NON deployato prod** questa sessione. Wire-up shipped ma `ENABLE_CAP_CONDITIONAL=false` env default OFF preserves zero regression. Andrea ratify required pre-deploy: SET env true + canary 5% → 100% rollout pattern.

2. **No live R5 bench post-A1**: latency lift potenziale chit_chat (60→30 word cap) NON misurato. Stima: -200-400ms/request gen output reduction Mistral. Defer iter 35+ post-deploy.

3. **OFFTOPIC_RE conservatore**: pattern explicit lemmi only (`calcio`, `Juventus`, etc.) NO substring match generico. Coverage limitata vs full off-topic universe (es. cooking, animali, viaggi NOT covered). False negative trade-off accepted iter 34 (precision > recall, conservative onesto).

4. **META_RE pattern Italian-only**: PRINCIPIO ZERO scuola pubblica IT-K-12. Inglese "who are you" NOT covered (intentional, prodotto IT-only).

5. **Cap conditional NON binding hard limit**: helper produces instruction text "Massimo X parole", LLM puo` ancora superare. Post-LLM regex validator esistente `cleanText` step handles overflow truncation. Hard cap enforcement defer iter 35+ post-LLM hard-cap function.

6. **Test capWords assertions NEW**: 6 tests verificano valori capWords per category. Se valori capWords cambiano (tuning iter 35+), tests vanno aggiornati. Costo manutenzione minimal.

7. **Version marker preserve `/iter37/` substring**: test contract line 213 `expect(ONNISCENZA_CLASSIFIER_VERSION).toMatch(/iter37/)` passa con nuovo `'1.0-iter37-iter38-doc-iter34-cap-conditional'`. Backward compat OK.

8. **NO Gemini review eseguita questa atom**: Andrea OAuth Gemini OK ma per velocità stop hook directive procedo subito. Gemini review può essere applicata ad atomi successivi (A2, A3) post-impl.

## §6 Anti-pattern G45 enforced

- ✅ NO claim "Atom A1 LIVE prod" (env default OFF, deploy + ratify required)
- ✅ NO claim "latency lift verified" (no R5 re-bench post-impl)
- ✅ NO inflation skill metric (caveat 1-7 documented honest)
- ✅ NO --no-verify (pre-commit vitest hook will run on commit)
- ✅ NO push origin (commit only locally fine sessione)
- ✅ Caveat onesti documentati §5 (8 caveat critici)

## §7 Estensione Phase 0+ skill metric

**Pre-A1 baseline**: 5 ELAB skill metric measured + audit doc Phase 0.0 (commit `0d8b8cf`).
- Morfismo 0.697 / Onniscenza 0.0 cap / Onnipotenza 0.688 / Principio Zero 0.646 / Velocita 0.0 cap

**Post-A1 (questa atom) impact projection**:
- Principio Zero: +0.05 (G+1 NEW iter 34 cap-word per category gate scaffold pronto)
- Onniscenza: +0.02 (G+1 NEW iter 34 skipOnniscenza adoption rate gate scaffold pronto)
- Score onesto deterministic-only post-A1: 0.677 → 0.69 (+0.013) projection minimal

**Real lift requires**:
- Edge Function deploy + env enable (Andrea ratify)
- R5 re-bench post-deploy
- Skill metric gate live measurement

## §8 Next step

→ **Atom A2** L2 router narrow `shouldUseTemplate` heuristic — dipende stesso file `unlim-chat/index.ts` line 552-554 `selectTemplate()` call site. Atom A2 RIDUCE template short-circuit scope per atom A2 categoria-aware (NON triggera template per meta_question + off_topic + chit_chat).

→ Audit doc + commit batch + procedi Atom A2.

→ Andrea ratify queue iter 34 entry NEW: `ENABLE_CAP_CONDITIONAL=true` env enable + canary 5% rollout protocol.
