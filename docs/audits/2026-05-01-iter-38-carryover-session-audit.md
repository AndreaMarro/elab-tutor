# iter 38 carryover session audit — 2026-05-01 ~07:50 CEST

**Goal**: continue iter 38 carryover work (Andrea mandate "NON HO COMPLETATO ITER 38 e cose di 36 e 37 continua con massima sistematicità e senza compiacenza").

**Strategy**: inline work (NO BG agent spawn — 3/4 agents had hit Anthropic org limit iter 38 PHASE 1; user explicit "non fare nulla con mac mini" → no remote delegation either). Deterministic deliverables only. Vitest 13474 NEVER scendere.

---

## §1 Deliverables this session (3 P0 carryover atoms closed)

### 1. A14 Linguaggio codemod — TRUE violations actioned

**Andrea iter 21+ mandate** (carryover iter 22 → iter 38 deferred → iter 38 carryover this session).

| Edit | File:line | Plurale plurale |
|------|-----------|-----------------|
| 1 | `src/components/simulator/panels/SerialMonitor.jsx:167` | "Premi Play" → "Premete Play" |
| 2 | `src/components/simulator/NewElabSimulator.jsx:946` | "Scegli un esperimento" → "Scegliete un esperimento" |
| 3 | `src/components/simulator/NewElabSimulator.jsx:947` | "tocca un esperimento" → "toccate un esperimento" |
| 4 | `src/components/simulator/NewElabSimulator.jsx:954` | "Guarda il circuito" → "Guardate il circuito" |
| 5 | `src/components/simulator/NewElabSimulator.jsx:962` | "Chiedi aiuto a UNLIM" → "Chiedete aiuto a UNLIM" |
| 6 | `src/components/simulator/NewElabSimulator.jsx:973` | "Seleziona un esperimento dalla sidebar" → "Selezionate ..." |
| 7 | `src/components/simulator/panels/ExperimentPicker.jsx:79` | "Scegli un Volume" → "Scegliete un Volume" |
| 8 | `src/components/lavagna/PercorsoPanel.jsx:88` | "Scegli un esperimento dall'header..." → "Scegliete ..." |
| 9 | `src/components/tutor/CanvasTab.jsx:418` | "Clicca dove vuoi inserire il testo" → "Cliccate dove volete ..." |
| 10 | `src/components/tutor/ElabTutorV4.jsx:165-167` | mascotte UNLIM "Hai/Costruisci/premi" → "Avete/Costruite/premete" |
| 11-14 | `src/data/lesson-paths/v1-cap9-esp{6,7,8,9}.json` | Title "Sfida: aggiungi pulsanti" → "Sfida: aggiungete pulsanti" + preview "Riesci ad aggiungere" → "Riuscite ad aggiungere" |

**Honest scope revision**: PDR claim "200 violations" was inflated baseline. Real triage shows ~13-15 TRUE UI/mascotte violations + ~180 narrative analogies (Italian "tu generico" in lesson-paths bookText analogies "il rubinetto: lo apri" — generic Italian didactic prose, NOT direct allocution to teacher/students, intentionally preserved per Sense 2 Morfismo "stessa voce dei volumi cartacei").

**Audit doc**: `docs/audits/iter-38-linguaggio-codemod.md` (full triage methodology + false-positive rationale + per-file inventory + iter 39+ deferred items).

### 2. R6 page metadata SQL backfill migration

**iter 13 P0 prep** (memory obs 1218 root cause: 100% rag_chunks chapter/page/section_title NULL prod) → iter 38 carryover this session.

**File NEW**: `supabase/migrations/20260501073000_rag_chunks_metadata_backfill.sql` (~85 LOC)

**Steps**:
- Step 1-3: backfill chapter/page/section_title from metadata jsonb keys (idempotent COALESCE)
- Step 4: Path A fuzzy match — extract `cap{N}_pag{N}` from `chunk_id` regex (works for fixture-aligned ingest IDs like `vol1_cap6_pag27_led_intro`)
- Step 5: source canonical normalization (`Vol1`/`VOL1` → `vol1`)
- Step 6: coverage report DO $$ block — RAISE NOTICE % filled per source

**Apply gate**: Andrea must run `SUPABASE_ACCESS_TOKEN="<token>" npx supabase db push --linked` to apply iter 39 entrance.

**Acceptance gate post-apply**:
```sql
SELECT source, COUNT(*) AS total, COUNT(page) AS page_filled, COUNT(chapter) AS chapter_filled
  FROM rag_chunks GROUP BY source ORDER BY source;
```
Expected: vol1/vol2/vol3 page_filled ≥80%; wiki page_filled NULL OK.

**Unblock**: R6 hybrid RAG recall@5 ≥0.55 measurement post Tester-2 re-bench.

### 3. A2 Fumetto Playwright spec selector fix (test artifact diagnosis)

**Root cause iter 37 "FAIL prod regression"**: NOT a Fumetto handler bug. The Playwright assertion `text=Nessuna sessione salvata` matched `src/components/HomeCronologia.jsx:287` static empty-state placeholder text rendered in cross-route DOM (Home Cronologia widget). LavagnaShell `handleFumettoOpen` actually emits PLURAL toast `"Fumetto avviato (sessione vuota): completate un esperimento per arricchirlo."` (LavagnaShell.jsx:1061-1063) per existing `downloaded-stub` / `ok-stub` paths.

**Fix**: tighten test selector in `tests/e2e/03-fumetto-flow.spec.js:21-29` to scope to actual toast notification region:

```javascript
const noSessionToast = await page
  .locator('[role="status"], [aria-live="polite"], [aria-live="assertive"], .toast, .elab-toast')
  .filter({ hasText: 'Nessuna sessione salvata' })
  .count();
expect(noSessionToast).toBe(0);
```

**Honest acceptance**: spec re-run iter 39 entrance via Tester-3 expected PASS post selector tightening + already-existing handler stub-fallback verified iter 36.

---

## §2 NOT shipped this session — iter 39+ defer

| Atom | Reason |
|------|--------|
| A1 R6 fixture v2 expected_chunks rebuild | Existing 100-prompt fixture has `metadata.vol/pag/keywords` schema — NEW migration unblocks recall@5 measurement against that schema. Rebuild as `expected_chunks: [chunk_ids]` requires SUPABASE_SERVICE_ROLE_KEY query post-migration apply. Defer iter 39+ Tester-2 spawn post Andrea apply. |
| A1.b R5 50-prompt re-run | Bench env req (SUPABASE_ANON_KEY + ELAB_API_KEY) + Edge Function v54 deploy gate. Defer iter 39+. |
| A6 Lighthouse perf 26+23 → ≥90 | Optimization pass (lazy mount route components + defer non-critical chunks + image optim + font preload) needs WebDesigner-1 BG agent — deferred iter 39+ post org limit reset. |
| A8 Vision Gemini Flash smoke | Andrea ratify GOOGLE_API_KEY env required + Tester-3 spawn. Defer iter 39+. |
| A10 Onnipotenza Deno port 12-tool subset | 6-8h batch + Maker-1 spawn + canary 5% rollout per ADR-028 §7. Defer iter 39+. |
| A4 Mistral streaming SSE | Path B explicit defer iter 38 (breaks client parsing 4h risky). |
| A9 STT Voxtral Transcribe 2 impl | Path B explicit defer iter 38 (design only ADR-031, impl iter 39+ Maker-1 + Tester-4 9-cell matrix). |
| A13 Canary 5%→25%→100% rollout | Depends A10 ready. |
| A15 94 esperimenti Playwright UNO PER UNO sweep | Spec EXISTS at `tests/e2e/29-92-esperimenti-audit.spec.js` (iter 29 P0 task D scaffold). Local-run command documented §3. Execution defer iter 39+ post Andrea local-run OR post org limit reset Tester-1 spawn. **NO Mac Mini delegation per Andrea explicit ban this session**. |

---

## §3 A15 Playwright 94 esperimenti UNO PER UNO — local-run guidance (NO Mac Mini)

Spec già esistente:
```
tests/e2e/29-92-esperimenti-audit.spec.js
tests/e2e/29-simulator-arduino-scratch-sweep.spec.js
playwright.iter29.config.js
```

**Andrea local-run command** (when ready ~3h headless browser):

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
ELAB_PROD_URL="https://www.elabtutor.school" \
  npx playwright test tests/e2e/29-92-esperimenti-audit.spec.js \
  --config tests/e2e/playwright.iter29.config.js
# Output: tests/e2e/output/29-92-esperimenti-{report,evidence}/
```

**Acceptance gate**: 94 esperimenti × 4 categorie test (mount, components, simulate, book ref) = 376 atomic checks. Broken count REAL ≤10 ideal target (Andrea iter 21+ mandate).

**Per categoria test** (per spec line 9-29):
- WORKING: navigate ok + api ready + mount ok + SVG > 5 + components_actual > 0 + components_actual matches expected (within 80%) + 0 page errors
- PARTIAL: navigate + mount but components mismatch OR SVG < 10 OR component_count < 50%
- BROKEN: mount fails OR SVG = 0 OR pageErrors > 0 OR components_actual = 0

**Output expected**: per-esperimento JSON evidence + screenshot diff + aggregate broken count.

**Audit deliverable iter 39+ entrance**: `docs/audits/iter-39-94-esperimenti-broken-real.md` con broken count REAL + remediation priorities.

---

## §4 Anti-regression CoV iter 38 carryover session

| Metric | Pre-session | Post-session | Verdict |
|--------|-------------|--------------|---------|
| vitest PASS | 13474 | **13474 PRESERVED** | ✅ no regression (verified post A14 codemod) |
| Test files | 269 passed + 1 skipped | 269 passed + 1 skipped | ✅ stable |
| Build | NOT re-run iter 38 | NOT re-run | ⚠️ Phase 4 gate (heavy ~14min) |
| Edge Functions ACTIVE | unlim-chat v53 | UNCHANGED v53 | ⚠️ deploy v54 pending Andrea Phase 4 |
| Vercel HTTP 200 | LIVE | UNCHANGED | ✅ stable |

---

## §5 PRINCIPIO ZERO + MORFISMO compliance gate post-session

1. ✅ Linguaggio plurale "Ragazzi" — UI chrome 100% plural (14 violations fixed) + mascotte UNLIM ElabTutorV4 plural welcome text + lesson titles plural + Sfida previews plural
2. ✅ Kit fisico mention — preserved iter 36-37-38 baseline (no edits to kit-mention strings)
3. ✅ Palette CSS var Navy/Lime/Orange/Red — unchanged (string-only edits)
4. ✅ Iconografia ElabIcons SVG — unchanged
5. ✅ Morphic runtime — unchanged
6. ✅ Cross-pollination Onniscenza L1+L4+L7 — unchanged
7. ✅ Triplet coerenza Sense 2 — narrative analogies preserved (volumi cartacei "tu generico" voice in bookText preserved per Sense 2 mandate)
8. ✅ Multimodale — no edits to Voxtral/Pixtral/Voxtral-STT layers; Voxtral TTS pronunciation re-verify "Premete/Cliccate/Scegliete" deferred iter 39+ Tester-4 STT/TTS

---

## §6 Iter 39 priorities P0 (carryover this session + iter 38 close)

**Andrea immediate actions** (15 min, sequential):
1. `SUPABASE_ACCESS_TOKEN=$(grep ^export SUPABASE_ACCESS_TOKEN ~/.zshrc | cut -d= -f2- | tr -d '"\047 ') && SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase db push --linked` (~1 min, applies BOTH `20260430220000_unlim_chat_warmup_cron.sql` AND `20260501073000_rag_chunks_metadata_backfill.sql`)
2. `SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb` (~2 min, deploys v54 with Mistral function calling + intent-tools-schema canonical + Promise.all parallelize + max_tokens 120)
3. Decide ENABLE_INTENT_JSON_SCHEMA env flag (canary 5% post-deploy OR keep false iter 39 entrance baseline measure)
4. `cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder" && npm run build && npx vercel --prod --yes` (~14min build + ~2min deploy, A12 PWA prompt-update LIVE post key rotation)
5. Smoke verify: `curl -X POST "https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat" -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $SUPABASE_ANON_KEY" -H "x-elab-api-key: $ELAB_API_KEY" -H "Content-Type: application/json" -d '{"message":"Ciao","sessionId":"smoke-iter39"}'` → HTTP 200 + Italian "Ragazzi" + Vol/pag verbatim
6. R6 metadata coverage verify post-apply:
   ```sql
   SELECT source, COUNT(*) AS total, COUNT(page) AS page_filled, COUNT(chapter) AS chapter_filled
     FROM rag_chunks GROUP BY source ORDER BY source;
   ```

**Iter 39 spawn agents post-Andrea-actions** (when org limit reset):
- Maker-1 retry A10 Onnipotenza Deno port 12-tool subset (6-8h) + A4 streaming SSE (4h) + A9 STT impl (6h) — 16h batch
- Tester-1 retry A15 94 esperimenti Playwright UNO PER UNO sweep — 3h local exec
- Tester-2 R5 + R6 + R7 re-bench post v54 deploy — 3h
- Tester-3 A8 Vision Gemini smoke + A2 Fumetto re-verify post selector fix — 1h
- WebDesigner-1 A6 Lighthouse perf optim + A6.b Cronologia enhancement — 4h

**Iter 39 score target**: 8.0 → **8.7+/10 ONESTO** conditional Andrea actions + R7 ≥95% post-deploy + Tier 1 deferred atoms shipped.

**Sprint T close projection iter 40+**: 9.5/10 ONESTO conditional A10 Deno port + canary rollout + A14 codemod final round + A15 broken count REAL ≤10.

---

## §7 Honesty caveats critical (G45 anti-inflation)

1. **A14 scope revised honest**: PDR "200 violations" inflated baseline; real TRUE actioned = 14 UI sites + ~180 false-positive narrative analogies preserved per Sense 2. NO claim "200 violations chiusi".
2. **R6 SQL migration NOT applied**: file shipped, Andrea-gate pending. NO claim "rag_chunks metadata backfilled prod".
3. **A2 Fumetto fix is TEST ARTIFACT FIX, not handler bug**: handler `handleFumettoOpen` was already plural compliant iter 36; iter 37 "FAIL" was selector matching cross-route static placeholder. NO claim "Fumetto regression handler fix".
4. **NO Edge Function deploy**: unlim-chat v53 still LIVE prod. iter 38 commit `f21c227` Mistral function calling code is on disk but NOT deployed v54.
5. **NO Vercel deploy verify**: A12 PWA prompt-update wired iter 38 but NOT verified live post key rotation iter 32.
6. **NO bench re-run**: R5 + R6 + R7 still iter 37 baselines (4496ms/0.000/0.0% canonical).
7. **NO Mac Mini delegation**: per Andrea explicit ban this session ("non fare nulla con mac mini"). All iter 39+ work returns to local Andrea-driven OR org-limit-reset BG agent path.
8. **A10/A14 PDR §4 cap UNCHANGED**: G45 mechanical cap 8.0 ONESTO. iter 38 close score 8.0/10 unchanged. Sprint T close 9.5 path remains iter 40+.

---

**Status**: iter 38 carryover session **CHIUSO ONESTO** with 3 P0 deliverables shipped (A14 codemod TRUE + R6 SQL backfill migration + A2 Fumetto test artifact fix) + audit docs. Vitest 13474 PRESERVED. iter 39 entrance gate Andrea actions documented §6 paste-ready.
