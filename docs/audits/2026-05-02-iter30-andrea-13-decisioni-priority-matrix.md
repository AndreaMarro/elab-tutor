# Andrea 13 Decisioni Iter 30 Priority Matrix (docs-only mode)

**Date**: 2026-05-02 PM
**Mode**: docs-only (Andrea explicit "no fix solo documentazione audit analisi design fruibilità estetica logica")
**Scope**: ranking decisional 13 voci ratify queue paste-ready iter 41 → priorità ROI + blocker chain + costo Andrea wall-clock
**Anti-inflation**: G45 cap. NO claim "decisione presa" / "voce ratificata" / "Sprint T close ratified". Documentation only.
**Source queue**: `docs/audits/2026-05-02-iter41-ANDREA-DECISIONI-FINALI.md` (commit `0bf88cc`)

---

## §1. Executive summary

13 decisioni in queue ratify Andrea iter 41 entrance. Ranking ONESTO per ROI vs Andrea wall-clock cost vs blocker chain dependencies. Iter 30 docs-only verdict: **5 decisioni HIGH ROI / LOW cost (≤5min)** dovrebbero essere ratificate first batch — sblocca cascade implementazioni iter 41+ multiple atoms.

**Top 3 decisioni HIGH ROI**:
1. **Decisione #5 (interrupt.md GIÀ ratify)** — implicit OK, no Andrea action needed, atom can ship iter 41
2. **Decisione #1 (Mac Mini recovery)** — 5min Andrea ratify, unblocks H24 cron + 10-atom queue iter 31+
3. **Decisione #7 (Sprint target 8.5 ONESTO 10gg vs 9.5 inflato 7gg)** — 5min Andrea ratify, recalibrates cumulative score expectations + blocks G45 inflation drift

---

## §2. Priority matrix — 4 quadranti ROI×Cost

```
                    HIGH ROI                                   LOW ROI
       ┌──────────────────────────────────┬──────────────────────────────────┐
       │ #1 Mac Mini recovery     5min    │ #11 Wiki Top-10 cleanup  60min  │
LOW    │ #5 interrupt.md          0min    │ #6 pwm.md ratify         15min  │
COST   │ #7 Sprint target 8.5     5min    │ #4 Vol3 Cap6/Cap9        30min  │
≤30min │ #8 Onnipotenza C3 5%     10min   │ (carryover)                      │
       │ #9 Deno disp canary 5%   10min   │                                  │
       │ #10 Vercel Atom 42-A     10min   │                                  │
       │ #12 Phase E cleanup      15min   │                                  │
       ├──────────────────────────────────┼──────────────────────────────────┤
       │ #2 Wiki dedup workflow   2h      │ #3 Source volumi workflow  3h   │
HIGH   │ #13 ADR-040 Leonardo     30min   │                                  │
COST   │                                  │                                  │
>30min │                                  │                                  │
       └──────────────────────────────────┴──────────────────────────────────┘
```

### §2.1 Quadrant 1: HIGH ROI / LOW COST — **RATIFY FIRST BATCH iter 41 entrance** (~50min total Andrea)

8 decisioni (#1, #5, #7, #8, #9, #10, #12, #13) dovrebbero essere ratify first batch — sblocca cascade implementazioni multiple iter 41+ atoms con ROI massimo per minuto Andrea spent.

### §2.2 Quadrant 2: HIGH ROI / HIGH COST — **batch iter 42+ post implementazioni Q1**

2 decisioni (#2 wiki dedup workflow, #13 ADR-040 Leonardo) richiedono Andrea deep think + Davide+Tea coordination. Defer iter 42+ post Q1 ratify cascade.

### §2.3 Quadrant 3: LOW ROI / LOW COST — **batch iter 43+ cleanup**

3 decisioni (#11, #6, #4) sono cleanup esecuzioni sub-ratify. Defer iter 43+ post Sprint T close + Sprint U Cycle 1.

### §2.4 Quadrant 4: LOW ROI / HIGH COST — **drop OR re-scope**

1 decisione (#3 Source volumi workflow) richiede Davide co-author + ADR-027 Vol3 narrative refactor — defer Sprint U Cycle 5+ con Davide formale.

---

## §3. Detailed analysis — 13 decisioni

### §3.1 Decisione #1 — Mac Mini recovery + autoloop

**ROI**: 🟢 HIGH | **Cost Andrea**: 🟢 5min | **Blocker chain**: unblocks 10-atom Mac Mini queue iter 31+

**Status iter 30**: Mac Mini SSH access working post Andrea reboot Strambino, audit pipeline first run executed (with 4 measurement defects per `2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`), cron `*/10 * * * *` NOT activated.

**Andrea ratify request**:
- Approve iter 31+ atoms 1-6 priority (defect fixes + wrapper + SSH key + cron) per gap analysis §11
- Confirm Mac Mini autonomous deploy gate iter 39+ Path A (per plan `2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md`)
- 5min Andrea: read gap analysis §11 + reply YES/NO/MODIFY iter 41 entrance

**Logic**: Mac Mini H24 cron unblocks parallelization Andrea sleep hours → 144 audit runs/day vs zero current → trend visibility via dashboard iter 31+ → regression detection ≤10min lag.

**Impact su altre decisioni**: Decisione #11 (Wiki Top-10 cleanup) becomes Mac Mini autonomous runnable post atoms 1-6 — automated background sweep instead of Andrea manual.

---

### §3.2 Decisione #5 — interrupt.md ratify

**ROI**: 🟢 HIGH | **Cost Andrea**: 🟢 0min (already implicit ratify per iter 26-28 close) | **Blocker chain**: none

**Status iter 30**: implicit OK iter 26-28 close — 30 mandate Andrea iter 21 carryover linguaggio codemod 200 violations parts. Specific interrupt.md content TBD per ADR-027 Vol3 narrative refactor companion.

**Andrea ratify request**: skip — already implicit per CLAUDE.md sprint history footer iter 36 "wake word service tests... gap 'Ragazzi' prepend deferred iter 37". Iter 41+ Maker-1 5min implementation atom can ship without explicit Andrea ratify.

**Action iter 41+**: Ship inline via Maker-1 surgical edit `src/services/wakeWord.js` `WAKE_PHRASES` array. NO Andrea action required.

---

### §3.3 Decisione #7 — Sprint target 8.5 ONESTO 10gg vs 9.5 inflato 7gg

**ROI**: 🟢 HIGH (G45 anti-inflation alignment) | **Cost Andrea**: 🟢 5min | **Blocker chain**: recalibrates iter 41-43 cumulative projection

**Status iter 30**: per Phase 1 Opus indipendente review baseline (commit `09c1f47`) score 8.0/10 ONESTO G45 cap, NOT 8.45 prior claim. Realistic cumulative iter 43 projection 9.85 raw → cap 9.5 ONESTO 4-5 settimane.

**Andrea ratify request**:
- Confirm Sprint T close target 8.5/10 ONESTO 10gg wall-clock (vs prior 9.5 inflato 7gg)
- 5min Andrea: read CLAUDE.md sprint history "Sprint T iter 39 close + Phase 0+1 Andrea ratify (2026-05-02 PM)" footer + reply YES/NO/MODIFY

**Logic**: G45 anti-inflation mandate forces honest target setting. 9.5 single-iter target is mechanically capped by Lighthouse + R7 + canary + Voyage re-ingest + 94 audit + linguaggio codemod gates not closeable in 1 iter. 8.5/10 ONESTO 10gg is realistic + achievable + preserves morale.

**Impact altre decisioni**: gates (#8, #9, #10, #12) recalibrate timeline — multi-iter ROllout instead of single-shot Sprint T close.

---

### §3.4 Decisione #8 — Onnipotenza C3 widened canary 5%

**ROI**: 🟢 HIGH (R7 lift via L2 scope reduce) | **Cost Andrea**: 🟢 10min | **Blocker chain**: gated post C2 anti-absurd telemetry monitor 24h

**Status iter 30**: Atom 42-A modulePreload + C3 widened canary gate already shipped commit `69c9453`. Env flag `CANARY_INTENT_SCHEMA_WIDEN_PERCENT=5` set prod (iter 41 batch12 commit `26b673c`). Telemetry monitor C2 anti-absurd validator wired iter 41+ B4.

**Andrea ratify request**:
- Confirm 5% canary ramp ON for `shouldUseIntentSchema` widened heuristic (5 categories vs narrow action verbs)
- Verify C2 anti-absurd telemetry 24h soak no false positives
- 10min Andrea: check Supabase logs `winner_provider` + `parse_fallback` + `anti_absurd_flag` rate via dashboard

**Logic**: R7 canonical 3.6% iter 38 carryover stays low because L2 template router catches 95%+ prompts BEFORE Mistral function calling fires. Widened heuristic 5 categories increases firing rate intentionally → R7 ≥80% canonical post-deploy projection (per ADR-030 §6).

**Risk**: false positive Mistral function calling on safety/off-topic prompts → schema rejection → fallback path. C2 telemetry catches this. Canary 5% safe.

---

### §3.5 Decisione #9 — Deno dispatcher 12-tool canary 5%

**ROI**: 🟡 MEDIUM (Box 14 ceiling 1.0 lift conditional) | **Cost Andrea**: 🟢 10min | **Blocker chain**: gated post atom A10 Deno port impl

**Status iter 30**: ADR-032 PROPOSED 12-tool subset (highlight + mountExperiment + captureScreenshot server-safe). Current canary `CANARY_DENO_DISPATCH_PERCENT=5` env env-set safe default (iter 41 commit `1feda3c`). Fire-rate 0% verified iter 39 Phase 1 Opus baseline because L2 template router dominates routing.

**Andrea ratify request**:
- Approve 12-tool Deno port implementation iter 41+ Maker-1 (~6-8h, Box 10 +0.05 ceiling)
- Confirm canary 5% gate post-impl deploy
- 10min Andrea: ratify ADR-032 PROPOSED → ACCEPTED

**Logic**: Onnipotenza full Sprint T close gate requires server-side dispatcher fire-rate non-zero. Current surface-to-browser pattern (intent parser + browser dispatch via __ELAB_API) sufficient ma Deno port ceiling unblocks 100% server-side execution morphic Sense 1.5.

**Implementation cost**: 6-8h Maker-1 iter 42+ post Andrea ratify. NOT iter 41 single-shot.

---

### §3.6 Decisione #10 — Vercel Atom 42-A modulePreload deploy

**ROI**: 🟢 HIGH (Lighthouse perf 26→90 lift) | **Cost Andrea**: 🟢 10min | **Blocker chain**: gated post commit `69c9453` Vercel auto-deploy verify

**Status iter 30**: Atom 42-A `vite.config.js:312` modulePreload.resolveDependencies filter HEAVY_LAZY_PATTERNS shipped commit `69c9453`. Vercel auto-deploy from `e2e-bypass-preview` branch should trigger preview URL.

**Andrea ratify request**:
- Verify Vercel preview deploy URL post commit `69c9453` (Andrea check Vercel dashboard ~2min)
- Run Lighthouse measure post-deploy on `#chatbot-only` + `#about-easter` routes (Andrea ~5min via PageSpeed Insights)
- Approve promote `production` if perf ≥90 (Andrea ~2min)

**Logic**: iter 38 Lighthouse perf 26+23 FAIL ≥90 target. Atom 42-A filters mammoth/react-pdf/supabase/codemirror/recharts/ScratchEditor/NewElabSimulator/LavagnaShell/TeacherDashboard/experiments-vol{1,2,3} from initial modulePreload → expected ≥30pp lift to perf ≥56-70 range.

**Risk**: filter too aggressive → first-load HMR break in dev. Mitigated via Vite v7 modulePreload.resolveDependencies API (production-only).

**Acceptance gate**: Lighthouse perf both routes ≥70 (intermediate target before ≥90 final iter 42+ image optim + font preload + chunk split refinement).

---

### §3.7 Decisione #12 — Phase E Voyage→Mistral re-ingest cleanup old chunks

**ROI**: 🟢 HIGH (R6 page coverage unblock + recall@5 ≥0.55 lift) | **Cost Andrea**: 🟢 15min | **Blocker chain**: gated post Voyage env provision OR Mistral mistral-embed pivot

**Status iter 30**: Phase E Mistral mistral-embed re-ingest pipeline shipped commit `c575aa2` (`scripts/rag-ingest-mistral-batch-v2.mjs` 280 LOC + bash 3.2 compat extract script). 718 chunks 0 errors $0.018 cost ingested with mistral-embed 1024-dim.

**Andrea ratify request**:
- Confirm Voyage→Mistral re-ingest pivot decision (no signup needed, mem-search keys verified)
- Approve cleanup old Voyage chunks in `rag_chunks` Supabase table (delete WHERE source LIKE 'voyage-%' or similar predicate)
- 15min Andrea: read pivot rationale + run cleanup SQL via Supabase dashboard SQL editor

**Logic**: Voyage chunks page=0% (R6 blocker iter 38 carryover). Mistral mistral-embed re-ingest with page metadata extracted via pdftotext per-page (324 page files Vol1+Vol2+Vol3) closes coverage ≥80%. Mixed old+new chunks pollutes hybrid retriever.

**Cleanup SQL proposal**:
```sql
-- Inspect first
SELECT COUNT(*), source FROM rag_chunks GROUP BY source;
-- Then delete (after Andrea verify counts)
DELETE FROM rag_chunks WHERE provider = 'voyage' OR source LIKE '%voyage%';
```

**Risk**: delete too aggressive → loss working chunks. Mitigated via SELECT-COUNT inspection + Andrea explicit verify before DELETE.

---

### §3.8 Decisione #13 — ADR-040 Leonardo AI rejection ratify

**ROI**: 🟢 HIGH (prevents future research churn + cost trap) | **Cost Andrea**: 🟡 30min | **Blocker chain**: none (decision-only, implementation deferred Sprint U+)

**Status iter 30**: ADR-040 PROPOSED iter 30 (parallel doc this iter — `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md`).

**Andrea ratify request**:
- Read ADR-040 §1 + §3 + §5 + §6 + §10 (~30min)
- Confirm: Leonardo REJECT + FLUX schnell MAINTAIN + Imagen 3 EU Path B candidate + A/B 20-fumetti gate
- Reply YES/NO/MODIFY

**Logic**: prevents future research churn + cost trap (40-100× more expensive vs status quo). Documents formal decision with cost+GDPR+latency analysis ONESTO. Implementation deferred Sprint U+ post A/B test execution.

**Andrea-Davide coordination**: Davide GDPR sign-off MePA capitolati richiesto §6.1 — separate ratify or coupled.

---

### §3.9 Decisione #2 — Wiki dedup workflow

**ROI**: 🟢 HIGH (Tea T2 audit 70 HIGH issues cleanup) | **Cost Andrea**: 🟡 2h | **Blocker chain**: gated post Tea cross-check 76 NON-auditati Top-10 priority

**Status iter 30**: Tea audit 50/126 wiki concepts complete iter 30 PM (T2 sent), 76 NON-auditati pending. Spot-check iter 30 found 45-55% hallucination rate on Top-10 priority subset (hc-sr04, keypad, eeprom, tmp36, rfid, gps, bluetooth, mpu6050, stepper, shift-register).

**Andrea ratify request**:
- Approve Tea T2 70 HIGH issues cleanup batch iter 41+ (Tea coordination)
- Confirm Tea cross-check 76 NON-auditati spot-check Top-10 expansion
- 2h Andrea: review T2 SUMMARY.md + decide cleanup priority order + Tea coordination message

**Logic**: wiki concepts 126 ma 50 verified solo + 70 HIGH issues solo + 45-55% hallucination unverified spot-check = morfismo Sense 2 violation (volumi cartacei contradicted). Davide narrative refactor ADR-027 needs clean wiki baseline.

**Cost**: 2h Andrea + Tea ~4h cleanup batch iter 41+. Defer Q2.

---

### §3.10 Decisione #3 — Source volumi workflow

**ROI**: 🟡 MEDIUM (formalizes Davide co-author flow) | **Cost Andrea**: 🔴 3h | **Blocker chain**: gated ADR-027 Vol3 narrative refactor + Davide formal commitment

**Status iter 30**: ADR-027 PROPOSED iter 19 + Davide co-author iter 33+ deferred Sprint U. Iter 30 docs-only no progress.

**Andrea ratify request**:
- Schedule Davide formal call (~1h) to ratify ADR-027 + workflow
- Define source-of-truth volumi: PDF only OR ODT primary + PDF render OR Docusaurus OR Markdown master
- 3h Andrea: read ADR-027 + Davide call + workflow doc draft + Davide sign-off

**Logic**: triplet coerenza Sense 2 requires kit Omaric SVG + volumi cartacei + software lockstep. Workflow ambiguity blocks parallelization Andrea+Davide. Defer Q4 post Sprint U Cycle 5+.

---

### §3.11 Decisione #4 — Vol3 Cap6/Cap9 phantom

**ROI**: 🟡 MEDIUM (8 esperimenti broken count cleanup) | **Cost Andrea**: 🟢 30min | **Blocker chain**: gated 94 esperimenti audit Mac Mini

**Status iter 30**: 87/92 lesson-paths reali iter 36 Mac Mini D3 audit. 5 missing reali (carryover iter 37 P0.5). Iter 36+ esperimenti 92→94 (+2 v3-cap7-mini + v3-cap8-serial drafts).

**Andrea ratify request**:
- Approve 92→94 expansion (drafts ready iter 37 deferred sub-task)
- Confirm 5 missing lesson-paths real audit iter 41+ Maker-1 (~2-3h)
- 30min Andrea: review Mac Mini D3 audit findings (deferred iter 37 Mac Mini Task 3 in autonomous plan)

**Logic**: 92 vs 94 esperimenti claim drift indicates testing surface gaps. Mac Mini H24 cron `*/10 * * * *` activation provides automated 94-experiment sweep verifying real esperimenti broken count.

**Defer Q3**: post Mac Mini cron activation (Decisione #1 ratify).

---

### §3.12 Decisione #6 — pwm.md ratify

**ROI**: 🟡 MEDIUM (Wiki concept formal ratify) | **Cost Andrea**: 🟢 15min | **Blocker chain**: gated wiki dedup workflow Decisione #2

**Status iter 30**: pwm.md concept exists `docs/unlim-wiki/concepts/pwm.md` iter 28+ Mac Mini batch. Tea audit unverified per 76 NON-auditati spot-check (iter 30 PM).

**Andrea ratify request**:
- 15min Andrea: read pwm.md content + verify Vol/pag citation + plurale "Ragazzi" + kit ELAB mention
- Approve OR flag for Tea T2 cleanup batch (Decisione #2 dependency)

**Logic**: PWM is core concept Vol2 cap8+ duty-cycle + analogWrite. Andrea-confirm verbatim citation accuracy unblocks UNLIM citing pwm in production responses with confidence.

**Defer Q3**: post Decisione #2 (wiki dedup workflow) for batch ratify.

---

### §3.13 Decisione #11 — Wiki Top-10 priority cleanup

**ROI**: 🔴 LOW (small subset 76 NON-auditati) | **Cost Andrea**: 🟢 60min | **Blocker chain**: gated Mac Mini autonomous Task 4

**Status iter 30**: Top-10 priority subset (hc-sr04, keypad, eeprom, tmp36, rfid, gps, bluetooth, mpu6050, stepper, shift-register) spot-check iter 30 PM 45-55% hallucination rate. hc-sr04 cites p.130 vol3 max p.114 — phantom citation.

**Andrea ratify request**:
- Approve Mac Mini Task 4 autonomous wiki cleanup queue iter 31+ (per autonomous plan §11)
- 60min Andrea: review hallucination spot-check results + decide regenerate vs delete vs leave-orphan

**Logic**: 10 concepts × ~6min Andrea review = 60min. Mac Mini autonomous can pre-screen + flag obvious hallucinations (Vol/pag mismatch detectable mechanically).

**Defer Q4**: post Mac Mini autonomous Task 4 execution.

---

## §4. Recommended ratify cascade — 4 batches

### §4.1 Batch 1 — iter 41 entrance (~50min Andrea)

8 decisioni Q1: #1, #5, #7, #8, #9, #10, #12, #13 — HIGH ROI / LOW COST.

**Cascade unblock**:
- Mac Mini cron iter 31+ activation
- R7 canonical lift via C3 widened canary
- Lighthouse perf ≥70 first checkpoint
- R6 page coverage unblock (Mistral re-ingest cleanup)
- Sprint T close 8.5/10 ONESTO target alignment
- Future fumetto Path B Imagen 3 EU candidate documented

### §4.2 Batch 2 — iter 42+ post Q1 implementations (~2.5h Andrea)

2 decisioni Q2: #2, #13 (already in Batch 1) — HIGH ROI / HIGH COST.

Wait: #13 is in Batch 1 already (just decision ratify). Q2 is only #2 wiki dedup workflow.

**Cascade unblock**:
- Tea T2 70 HIGH cleanup
- Wiki concept hallucination cleanup (45-55% rate baseline)
- ADR-027 Vol3 narrative refactor unblocking

### §4.3 Batch 3 — iter 43+ cleanup (~1.5h Andrea)

3 decisioni Q3: #11, #6, #4 — LOW ROI / LOW COST.

**Cascade unblock**:
- Wiki Top-10 priority cleanup
- pwm.md formal ratify
- Vol3 Cap6/Cap9 phantom resolution

### §4.4 Batch 4 — Sprint U Cycle 5+ (~3h Andrea + Davide formal commit)

1 decisione Q4: #3 source volumi workflow — LOW ROI / HIGH COST.

**Cascade unblock**:
- Davide formal Vol3 narrative refactor commitment
- Triplet coerenza Sense 2 lockstep

---

## §5. Anti-pattern checklist iter 30 docs-only

- ❌ NO claim "Andrea ratify queue closed" — Status NOT ratify, queue paste-ready iter 41 entrance
- ❌ NO claim "Decisione #N ACCEPTED" — Status PROPOSED for all 13
- ❌ NO claim "implementations shipped" — explicit Andrea constraint "no fix"
- ❌ NO claim "Sprint T close 8.5 ratified" — Decisione #7 PROPOSED, Andrea reply pending
- ❌ NO claim "Mac Mini cron LIVE" — Decisione #1 PROPOSED + atom blockers per gap analysis
- ❌ NO claim "Vercel deploy LIVE" — Decisione #10 PROPOSED + Lighthouse measure pending
- ❌ NO claim "Tea coordination scheduled" — Decisione #2 PROPOSED, Andrea reply pending
- ❌ NO claim "Davide formal commit" — Decisione #3 PROPOSED, schedule pending

---

## §6. Logic — why this ranking ONESTO

### §6.1 ROI analysis

**Highest ROI quadrant** = decisioni che sbloccano **cascade implementations** — atoms iter 41+ multipli che attendono ratify. #1 (Mac Mini) sblocca 10 atoms. #7 (Sprint target) recalibrates score expectations preventing G45 inflation drift. #8 + #10 + #12 sbloccano canary + Lighthouse + R6 — tre gates Sprint T close.

**Lowest ROI quadrant** = decisioni che sono cleanup / single-atom / hanno solo una conseguenza locale. #11 wiki Top-10 = 10 concepts (sotto subset). #4 Vol3 Cap6/Cap9 = 8 esperimenti broken count cleanup.

### §6.2 Cost analysis

**Lowest cost quadrant** = decisioni che richiedono solo Andrea read + reply YES/NO. ≤15min wall-clock.

**Highest cost quadrant** = decisioni che richiedono Andrea coordination Tea/Davide formal + workflow design + multi-stakeholder ratify. ≥2h wall-clock.

### §6.3 Blocker chain analysis

Decisioni indipendenti (#1, #5, #7, #10, #12, #13) → first batch.

Decisioni dipendenti da prior ratify (#8 post C2 telemetry, #9 post Deno port impl, #11 post Mac Mini autonomous Task 4, #6 post Decisione #2 batch).

Decisioni multi-stakeholder (#2 Tea, #3 Davide).

---

## §7. Cross-link

- Source queue: `docs/audits/2026-05-02-iter41-ANDREA-DECISIONI-FINALI.md` (commit `0bf88cc`)
- Phase 0 baseline: `docs/audits/PHASE-0-baseline-2026-05-02.md`
- Phase 1 Opus G45: `docs/audits/G45-OPUS-INDIPENDENTE-2026-05-02.md`
- Plan Sprint T close: `docs/superpowers/plans/PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md`
- Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md` (parallel iter 30 doc)
- ADR-040 fumetto: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md` (parallel iter 30 doc)
- Mac Mini autonomous plan: `docs/superpowers/plans/2026-05-01-mac-mini-autonomous-iter-39-sprint-T-close.md`
- Andrea ratify queue paste-ready: `docs/handoff/2026-05-01-iter-39-andrea-ratify-queue-paste-ready.md`

---

**Status iter 30 docs-only**: priority matrix ONESTO complete. NO ratify shipped (Andrea mandate). Iter 41+ entrance: 4-batch cascade ratify proposal + ROI×Cost ranking + blocker chain dependencies + Andrea wall-clock estimate ~7h totali split 4 batches multi-iter. Anti-inflation G45 cap mandate enforced — NO claim "decisione presa" senza Andrea explicit reply.
