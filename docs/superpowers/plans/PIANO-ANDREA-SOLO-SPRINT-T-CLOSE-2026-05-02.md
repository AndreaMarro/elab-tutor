# Piano Sprint T close — Andrea solo dev — 2026-05-02 ratify

**Pillars**: PRINCIPIO ZERO §1 + Morfismo Sense 1+1.5+2
**Constraints**: Andrea solo dev (4-5h/day), Tea source docs only (NO pair), Davide external calendar 2-3h, Giovanni external (NO Marketing PDF), AI agents parallel
**Calendar**: 4-5 settimane wall-clock
**Effort total Andrea**: ~82h
**Mandate**: NO COMPIACENZA. G45 anti-inflation cap. Andrea Opus G45 review Phase 1 + Phase 7

---

## Phase 0 — Documentation discovery + measured baseline

**Andrea (5min)**: env keys export.

**Subagent 1 (general-purpose, parallel)**: read iter-38/39 audits + ADRs + system-prompt + clawbot-template-router + onniscenza-bridge + Tea TEA/*.docx → output `docs/audits/PHASE-0-discovery-{date}.md`.

**Subagent 2 (general-purpose, parallel)**: run R5+R6+R7+Lighthouse+vitest+page metadata count+94 esperimenti audit → output `docs/audits/PHASE-0-baseline-{date}.md`.

**Andrea ratify (10min)**: read + commit + push.

**Gates**:
- Phase 0 docs shipped
- All baselines measured (no skips)
- Anti-pattern list explicit

**Anti-patterns**: NO claims senza file:line / bench output ID. NO baseline assumed CLAUDE.md.

---

## Phase 1 — Andrea Opus G45 indipendente review baseline

**Andrea (1h spawn + 1h read)**: separate Claude Code session context-zero. Verify each Sprint T iter 39 claim CLAUDE.md vs file system + git log + Phase 0 baseline. Issue independent score, ≥3 inflation flags. Output `docs/audits/G45-OPUS-INDIPENDENTE-{date}.md` (500+ righe).

**Gates**:
- Doc committed
- Score Opus ≤ 8.45 OR justified ≥ con razionale
- CLAUDE.md footer recalibrate

**Anti-patterns**: NO context contamination, NO Opus accept narrative senza source verify.

---

## Phase 2 — PRINCIPIO ZERO Vol/pag verbatim 95%

**Spawn 4 agents parallel**:
- A (Architect 2h): ADR-033 page metadata extraction strategy (pdfjs/pdftotext/pypdf). Output `docs/adrs/ADR-033`.
- B (Maker-1 3h): impl `scripts/rag-ingest-voyage-batch-v2.mjs` + idempotent migration + tests.
- C (Maker-1 1h): BASE_PROMPT v3 → v3.2 strict Vol/pag + post-LLM regex validator + 5→8 few-shot + L2 router widen `shouldUseIntentSchema`.
- D (Tester-2 30min, post deploy): R7 200-prompt re-bench. Target ≥80% canonical (current 3.6%).

**Andrea actions sequential (90min)**:
1. Ratify ADR-033 (15min)
2. Env provision VOYAGE + SERVICE_ROLE (5min)
3. `node scripts/rag-ingest-voyage-batch-v2.mjs` (50min, $1)
4. Verify page coverage ≥80% (5min)
5. Deploy Edge Function v60+ (5min)
6. Smoke 5 prompts (10min)
7. Trigger Tester-2

**Gates**:
- ADR-033 PROPOSED
- page coverage 0% → ≥80%
- R7 canonical ≥80%
- R6 recall@5 ≥0.55
- BASE_PROMPT v3.2 LIVE Edge v60+
- vitest 13474+ preserved

**Anti-patterns**: NO Onniscenza "7-layer" claim (V1 RRF only finché V2.1 ship). NO L2 scope reduce sotto experimentId match.

---

## Phase 2.5 — Onniscenza V2.1 conversational fusion

**Spawn 3 agents parallel**:
- E (Architect 2h): ADR-032 V2.1 design (skip layer multipliers REJECTED iter 39, ONLY +0.15 experiment-anchor + +0.10 kit-mention + +0.20 recent-history + RRF k=60 preserved). Output `docs/adrs/ADR-032`.
- F (Maker-1 3h): impl `aggregateOnniscenzaV21` + conversation history embedding fusion + `ENABLE_ONNISCENZA_V21=true` env gate + 15+ tests.
- G (Tester 30min post deploy): R5 50-prompt + manual hallucination 50 prompts. Target PZ V3 ≥97% + hallucination <2%.

**Andrea (1h)**:
1. Ratify ADR-032 (15min)
2. Deploy Edge Function v61+ (5min)
3. Set `ENABLE_ONNISCENZA_V21=true` (1min)
4. Trigger Tester (30min wait)
5. Review hallucination samples ratify (10min)

**Gates**:
- ADR-032 ACCEPTED
- R5 PZ V3 ≥97%
- Hallucination <2% manual review
- Edge v61+ LIVE

**Anti-patterns**: NO V2 layer multipliers re-introduce. NO chunk synthesis senza source. NO context > 10 messages.

---

## Phase 3 — Davide Vol3 narrative refactor

**Andrea calendar external (2-3 giorni)**:
1. Schedule Davide pair session
2. Pre-prep (1h): print Vol3 PDF + lesson-paths v3-* + experiments-vol3.js
3. Davide pair (2-3h): side-by-side cartacei vs digital, Davide identifica narrative breaks, signs off mapping 92→140, ADR-027 PROPOSED → ACCEPTED
4. Post-session spawn Maker-2

**Spawn Maker-2 (6h)**: refactor `src/data/lesson-paths/v3-*.json` per Davide mapping + `experiments-vol3.js` + `lesson-groups.js` + `volume-references.js` Vol3 ODT line-numbers VERBATIM + tests 332/332 PASS preserve.

**Spawn Tester (2h)**: 10 random Vol3 esperimenti triplet coerenza verify (PDF page + lesson-path + Playwright simulator).

**Gates**:
- ADR-027 ACCEPTED Davide signed
- Vol3 92 → ~140 lesson-paths shipped
- Triplet coerenza 10/10 PASS
- vitest delta documented

**Anti-patterns**: NO refactor senza Davide signoff. NO bookText paraphrase. NO esperimenti riordinare.

---

## Phase 4 — Classroom UX validation field

**Spawn 3 agents parallel + Andrea direct**:
- H (Tester-1 3h): execute `tests/e2e/29-92-esperimenti-audit.spec.js` Playwright headed. Categorize PASS/BROKEN/PARTIAL with reason. Output `docs/audits/94-esperimenti-broken-count-{date}.md`.
- I (Performance-engineer 4h): Lighthouse perf optim ≥90 mobile (code-split LavagnaShell 2.36MB per-modalità + lazy react-pdf 1.91MB + preload Open Sans + critical CSS inline + image optim + obfuscator disable non-sensitive + chunkSize 1000→500).
- Andrea direct (30min): Chrome devtools smoke 5 prompts UNLIM voice + Network tab + Console + DOM audio + INTENT dispatch. Document `docs/audits/browser-smoke-andrea-{date}.md`.

**Andrea deploy (10min)**: `vercel build --prod && vercel deploy --prebuilt --prod --yes` + alias promote.

**Gates**:
- 94 esperimenti broken count documented
- Browser voice playback Andrea VERIFIED
- Lighthouse mobile ≥90 perf
- Vercel LIVE prod
- vitest preserved

**Anti-patterns**: NO 94 work claim senza Playwright evidence. NO voice LIVE claim senza browser playback. NO Lighthouse synthetic-only.

---

## Phase 4.5 — Latency stack-wide

**Spawn Maker-1 (6h)**: Tier 4+5 optims (hedged Mistral 100ms stagger + parallel retrieval extend + connection pool warm-isolate + Mistral SSE expand DEFER if R5 PASS Phase 2).

**Spawn Tester (1h)** post Andrea ratify hedged cost +30%: R5 measure target avg ≤1000ms / p95 ≤2000ms.

**Andrea (10min)**: ratify cost + set `ENABLE_HEDGED_LLM=true` + deploy v62+.

**Gates**:
- R5 avg ≤1000ms (-38%)
- R5 p95 ≤2000ms (-41%)
- Cost +30% Andrea ratify
- Conn pool warm <100ms

**Anti-patterns**: NO hedged senza cost ratify. NO conn pool senza warmup cron verify.

---

## Phase 4.6 — Onnipotenza 57-tool full + wake word all browsers

**Spawn 3 agents parallel + Tester sequential**:
- J (Maker-1 6h): A10 Onnipotenza Deno port 12-tool subset server-safe + ADR-034 + 24+ tests TDD + canary mechanism `CANARY_DENO_DISPATCH_PERCENT`.
- K (Maker-2 8h): remaining 45/57 ToolSpec port → `clawbot-dispatcher-deno.ts` 57/57 coverage + tests.
- L (Maker-2 4h): wake word `wakeWord.js` Safari/iOS UA detect + MediaRecorder fallback + Voxtral STT continuous + "Ragazzi" plurale prepend.
- Tester-4 (1h post env): 9-cell STT matrix (3 OS × 3 browser). Target 9/9 PASS Voxtral primary <500ms.

**Andrea sequential (calendar 24-48h)**:
1. Ratify ADR-034 (15min)
2. Deploy Edge Function v63+ (5min)
3. Set `CANARY_DENO_DISPATCH_PERCENT=5` (1min) → soak 4-8h
4. Stage `=25` → soak 8-24h
5. Stage `=100` → soak 24-48h final
6. Set `STT_PROVIDER=voxtral` post Maker-2 + 9-cell PASS (1min)
7. Deploy Edge Function final v64+

**Gates**:
- 57/57 ToolSpec LIVE prod canary 100% (24-48h soak verified)
- Wake word 9/9 cells PASS
- STT_PROVIDER=voxtral LIVE prod
- R7 canonical post canary measured

**Anti-patterns**: NO canary 100% senza soak telemetry green. NO wake word activation senza 9-cell PASS. NO STT switch senza CF Whisper graceful fallback. NO ToolSpec count claim ≠ 57.

---

## Phase 5 — Glossario port main app (Andrea solo + Maker-3)

**Andrea pre-work (1h)**:
1. Open https://elab-tutor-glossario.vercel.app inspect read-only
2. Read TEA/10_idee_miglioramento.docx § Glossario
3. Read rag-chunks.json filter source_type=glossario count
4. Decide scope (full port / drawer / iframe)
5. Author `docs/specs/SPEC-glossario-integration.md`

**Spawn Maker-3 (4h impl + 1h UNLIM integration)**:
- New route `#glossario` lazy import
- New `src/components/glossario/GlossarioPanel.jsx` per SPEC
- Search + alphabetic + Vol/pag back-link
- Palette CSS var, Open Sans + Oswald, ElabIcons, WCAG AA
- Tests 10+
- INTENT new tool `lookupGlossario(term)` server-side surface-to-browser
- `intentsDispatcher.js` whitelist add

**Andrea cleanup (5min)**: standalone redirect OR retire.

**Gates**:
- #glossario route LIVE
- INTENT lookupGlossario 5/5 PASS
- SPEC committed
- Standalone decision documented

**Anti-patterns**: NO duplicate Glossario data. NO new npm deps senza Andrea OK. NO emoji icons. NO Tea pair work.

---

## Phase 5.5 — HomePage + Cronologia polish per Tea source docs

**Andrea pre-work (1.5h)**:
1. Read TEA/schema_ux_semplificato.docx
2. Read TEA/10_idee_miglioramento.docx § HomePage
3. Read TEA/analisi_complessita_esperimenti.pdf (MOSFET highlight)
4. Open https://www.elabtutor.school#home prod LIVE inspect
5. Compare HomePage.jsx 776 LOC vs Tea source spec → diffs
6. Author `docs/specs/SPEC-homepage-tea-polish.md` (Andrea solo synthesis)

**Spawn Maker-3 (4h polish + 3h Sense 1.5)**:
- HomePage card layout per Tea SPEC
- Color accent (Lime sottolineatura, Navy headers)
- Typography Open Sans + Oswald
- Mascotte position + size
- CTA copy + button shape
- Cronologia row badge stato
- Sense 1.5 docente memoria adapt: `unlimMemory.js` 3-tier track esperimenti completati + Vol/pag visti + pattern interazioni → HomePage suggested experiments adapt esperto vs novice runtime
- NEW migration `docente_memory` Supabase
- Tests 8+

**Spawn Tester (1h)**: Cronologia 20 sessions UNLIM session description quality (linguaggio docente-facing + plurale + Vol/pag + <60w + non-imperativi).

**Andrea (1h)**: ratify SPEC + apply migration + deploy v65+ + 2 docente IDs distinct verify + browser smoke.

**Gates**:
- HomePage Tea source-aligned (Andrea SPEC)
- Cronologia AI brief quality Andrea signoff
- Sense 1.5 docente memoria 2 ID PASS distinct
- WCAG + Lighthouse NOT regress
- vitest preserved

**Anti-patterns**: NO AI agent autonomous design changes. NO Tea pair work. NO break Cronologia 30-items localStorage. NO Sense 1.5 static rules.

---

## Phase 6 — Mac Mini SSH + HALT-aware re-design

**Andrea SSH (10min)**:
```bash
ssh progettibelli@100.124.198.59 -i ~/.ssh/id_ed25519_elab
crontab -l > /tmp/cron-backup-$(date +%Y%m%d).txt
crontab -r
launchctl list | grep elab
launchctl unload ~/Library/LaunchAgents/com.elab.mac-mini-autonomous-loop.plist 2>/dev/null
killall claude 2>/dev/null
exit
```

**Spawn Maker-1 (2h)**: HALT-aware crontab template + install scripts (pre-check `[ ! -f andrea-HALT-*.md ]`).

**Gates**:
- Mac Mini autoloop STOPPED
- HALT-aware re-design install scripts ready

**Anti-patterns**: NO autoloop re-activate senza HALT pre-check wrapper LIVE. NO destructive remote ops senza Andrea SSH explicit. (NO Marketing PDF Giovanni — removed).

---

## Phase 7 — Final verify + Sprint T close 9.5/10 ONESTO

**Spawn 2 agents parallel**:
- M (Tester 1h): final bench R5+R6+R7+Lighthouse+94-esp+vitest+build size. Output `docs/audits/PHASE-7-final-evidence-{date}.md`.
- N (Documenter 1h): CLAUDE.md sprint history honest recalibrate footer.

**Andrea Opus G45 final (1h)**: separate session ratify Sprint T close 9.5 OR reject. Output `docs/audits/G45-OPUS-FINAL-RATIFY-{date}.md`.

**Andrea Sprint U kickoff (30min)**: `docs/superpowers/plans/SPRINT-U-KICKOFF.md` (iter 44+ V2.1 polish + iter 45+ ClawBot 57 canary 100% + iter 46+ classroom field test 10 scuole + iter 47+ ELAB v5 unified UX).

**Gates**:
- All Phase 0-6 acceptance gates met
- Final bench evidence shipped
- CLAUDE.md recalibrate published
- Andrea Opus G45 final ratify
- Sprint U kickoff plan paste-ready

**Anti-patterns**: NO 9.5 close senza Opus G45. NO sprint history retconning. NO Sprint U kickoff senza closure formal.

---

## Compliance gate finale Sprint T close

PRINCIPIO ZERO §1:
- Vol/pag verbatim ≥80% R7
- Plurale "Ragazzi" 100%
- Kit fisico mention every UNLIM
- Docente-framing 100% BASE_PROMPT v3.2
- Hallucination <2%

Morfismo Sense 1:
- 57/57 ToolSpec LIVE canary 100%
- L1+L2 stack production
- V2.1 conversational grounding LIVE

Morfismo Sense 1.5:
- Docente memoria persistente Supabase + UI adapt runtime
- HomePage distinct suggestions per docente ID

Morfismo Sense 2:
- Davide Vol3 ADR-027 ACCEPTED
- Kit Omaric SVG match printed figures
- Volumi parallelism digital ↔ cartacei verified Davide
- bookText VERBATIM ODT cite

Classroom field:
- 94 esperimenti broken count documented
- Browser smoke voice verified
- Lighthouse ≥90 mobile

Anti-inflation:
- Andrea Opus G45 review Phase 1 + Phase 7 ratify

Se ANY gate fails → defer Sprint T close iter 44+ + document gap onesto.

---

## Calendar Andrea

```
Settimana 1 (~20h): Phase 0 + Phase 1 Opus baseline + Phase 2 Vol/pag
Settimana 2 (~20h): Phase 2.5 V2.1 + Phase 3 Davide Vol3 calendar
Settimana 3 (~20h): Phase 4 Classroom UX + Phase 4.5 Latency + Phase 4.6 Onnipotenza+wake (24-48h soak)
Settimana 4 (~12h): Phase 5 Glossario + Phase 5.5 HomePage Tea polish + Phase 6 Mac Mini
Settimana 5 (~10h): Phase 7 Final verify + Sprint T close
```

**Effort Andrea ~82h**, agents ~50h parallelizable, Davide 2-3h calendar, Andrea Opus G45 2 sessions.

---

## Activation prompt next session paste-ready

```
Read docs/superpowers/plans/PIANO-ANDREA-SOLO-SPRINT-T-CLOSE-2026-05-02.md.

Execute phase by phase consecutive nuova chat session:
1. Read scope + gates + anti-patterns
2. Spawn agents per phase prompts
3. Andrea actions sequential
4. Verify gates met before next phase
5. CoV vitest 13474+ preserved + build PASS

Andrea solo dev. NO Tea pair work (Tea source docs only).
Davide external Phase 3 calendar.
Andrea Opus G45 review Phase 1 + Phase 7 structural anti-inflation.

NO COMPIACENZA. G45 cap. Sprint T close 9.5 conditional ALL gates met.

Current state ratify:
- Iter 39 ralph close 8.45/10 ONESTO (Vercel SSE LIVE + Sprint U Cycle 2 PRINCIPIO ZERO 100%)
- Branch e2e-bypass-preview HEAD 8205fe4
- vitest 13474 PASS baseline
- Sprint U Cycle 1 BLOCKER #10 + #14 already shipped Cycle 2
- Iter 39 carryover items #1+#11+#12+#13+#20 closed inline

Next entry: Phase 0 documentation discovery + measured baseline.
```
