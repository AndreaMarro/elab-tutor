# Iter 35 → Iter 36 handoff — 2026-05-04 PM

**Iter 35 PHASE 2 CLOSE**: 5/5 BG agent OPUS Pattern S r3 + inline orchestrator + 3 ADR ACCEPTED + Three-Agent Pipeline lightweight pivot ammesso + Vercel deploy LIVE + alias swap www.elabtutor.school + push origin e010924..68fd7cd + Andrea regressione FIXED.

**Score iter 35 PHASE 2 close ONESTO ricalibrato G45**: **8.45/10** (cap honest, NO inflate >8.55 senza Opus indipendente review iter 41-43).

---

## §1 Activation string iter 36 entrance (paste-ready Andrea)

```
ELAB Tutor iter 36 entrance — 2026-05-04 PM session 2

Continua iter 35 close + Three-Agent Pipeline iter 36 carryover. Workflow multiprovider step 1.

Master plan iter 35: docs/superpowers/plans/2026-05-04-iter-35-andrea-13-mandate-three-agent-master-plan.md
Master plan iter 36-38 parent: docs/superpowers/plans/2026-05-04-iter-36-38-andrea-12-mandate-master-plan.md

Stato LIVE prod 2026-05-04 PM:
- Vercel grcq82kt9 Production READY aliased www.elabtutor.school
- Commit HEAD 68fd7cd e2e-bypass-preview origin sync
- Vitest baseline 13862 PASS (post iter 35 +88 NEW: 16 cronologia + 9 PercorsoPanel + 15 WakeWordStatusBadge + 5 lavagna-libero + 5 percorso-2-window + 4 drawingSync + 13 system-prompt + 16 helpers + 6 integration + extension)
- 4 SVG card LIVE (Lavagna libera + ELAB Tutor completo + UNLIM + Glossario)
- Cronologia recente section + plurale "Ragazzi, ancora nessuna sessione salvata" empty state
- Lavagna route 4 mode SVG buttons (Percorso ★ + Passo Passo + Già Montato + Libero)
- Mascotte robottino + speech bubble "Ciao Ragazzi!"

Andrea ratify queue iter 36 entrance:
1. Edge Function unlim-chat deploy v81+ (E1+E2+E3+P3 LIVE)
   `SUPABASE_ACCESS_TOKEN=sbp_... npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb`
2. Edge Function unlim-session-description deploy NEW (I3 LIVE)
   `SUPABASE_ACCESS_TOKEN=sbp_... npx supabase functions deploy unlim-session-description --project-ref euqpdueopmlllqjmqnyb`
3. ENABLE_CAP_CONDITIONAL=true Supabase env enable canary 5%→100%
4. ENABLE_HEDGED_LLM=true + ENABLE_HEDGED_PROVIDER_MIX=true env enable
5. ENABLE_ONNISCENZA=true env enable (verify aggregator 7-layer)
6. ENABLE_L2_CATEGORY_NARROW=true canary
7. R5 50-prompt re-bench post env enable: `node scripts/bench/run-sprint-r5-stress.mjs`
8. R7 200-prompt canonical re-bench: `node scripts/bench/run-sprint-r7-stress.mjs`

Iter 36 priorities P0:
- P0.1 Mammoth crash investigation Tester-1 specific flow reproducer + fix
- P0.2 N1 PercorsoPanel selectors widen Three-Agent iter 2 (Codex implement + Gemini review)
- P0.3 L4 E2E EXEC verify F1 Esci persistence LIVE post iter 35 deploy
- P0.4 J1+J2 Sense 1.5 wire complete Percorso context payload Edge Function unlim-chat
- P0.5 R5+R7 re-bench post env enable
- P0.6 H3 default focus pen tool active Lavagna libera (defer iter 35 P1)
- P0.7 K3 PercorsoCapitoloView opt-in toggle UI polish
- P0.8 Maker-3 F1 WakeWordStatusBadge HomePage mount (Maker-3 coordination msg pending WebDesigner-1)
- P0.9 Lighthouse perf optim ≥90 (carryover iter 38+ baseline 42)
- P0.10 Vol3 narrative refactor ADR-027 Davide co-author (Sprint U+)

Sprint T close projection iter 41-43 cumulative + Andrea Opus indipendente review G45 mandate (target 9.5/10 ONESTO, NOT iter 36 single-shot).
```

---

## §2 Setup steps Andrea (5-10 min)

1. **Verify Vercel current alias**:
   ```bash
   npx vercel inspect https://www.elabtutor.school
   ```
   Expected: `dpl_F7K2Yh1udofpWctFDDYGZzom4uNG` (`grcq82kt9`) ACTIVE.

2. **Pre-flight CoV iter 36 entrance**:
   ```bash
   cd "VOLUME 3/PRODOTTO/elab-builder"
   npx vitest run --reporter=line 2>&1 | tail -5
   # Expected: 13862+ PASS preserve baseline
   npm run build  # heavy ~14min, defer mid-iter if needed
   ```

3. **Andrea ratify queue 8 entries** (vedi §1 activation string).

4. **Trigger iter 36 next session**:
   ```bash
   cd "VOLUME 3/PRODOTTO/elab-builder"
   git pull origin e2e-bypass-preview
   # Open new Claude Code session + paste activation string §1
   ```

---

## §3 Iter 36 priorities P0 detailed

### P0.1 Mammoth crash investigation (Three-Agent Pipeline gate architectural)

**Pain**: Tester-1 iter 35 reports prod homepage CRASH React error boundary "Ops! Qualcosa è andato storto" — `TypeError: Cannot read properties of undefined (reading 'default')` from `mammoth-BJyv2V9x.js:193`.

**Status**: NOT reproducibile su default route via Chrome MCP iter 35 (homepage + Lavagna route LIVE no crash). Likely Tester-1 specific Playwright test flow trigger.

**Atom MA1** (Maker-2 + Maker-1 coordination, ~2h):
- Investigate WHERE mammoth chunk is eagerly loaded
- Check vite.config.js line 11 `'mammoth'` — precache chunk pattern?
- Check vite.config.js line 132 `'assets/mammoth*'` — workbox runtimeCache?
- Check if SW precache pulls mammoth at install time
- Check if FloatingToolbar OR shared common imports documentConverters (which static-imports mammoth-bridging code)
- Replicate Tester-1 specific flow: navigate `/lavagna` → click experiment → trigger error
- Three-Agent Pipeline gate: USE (architectural diagnosis + fix)

**Possible fix** (one of):
- Make documentConverters lazy-loaded in ManualTab.jsx + ElabTutorV4.jsx (`const documentConverters = lazy(() => import('./utils/documentConverters'))`)
- Add error boundary around mammoth lazy import with fallback "DOCX upload unavailable"
- Pin mammoth version + verify CommonJS interop iter 34 fix is deployed

### P0.2 N1 PercorsoPanel selectors widen Three-Agent iter 2

**Pain**: Tester-1 N1 E2E spec FAIL prod chromium — selectors `[data-testid="percorso-panel"]` / `[data-elab-panel="percorso"]` / `[class*="PercorsoPanel"]` don't match prod attrs.

**Atom NA1** (WebDesigner-1, ~30 min):
- Read PercorsoPanel.jsx current attrs post WebDesigner-1 rewrite 95→290 LOC
- Add canonical `data-testid="percorso-panel"` if missing
- Add `data-elab-panel="percorso"` for E2E spec compatibility
- Update tests/e2e/08-percorso-2-window.spec.js NEW selectors widen pattern matching
- Three-Agent Pipeline iter 2: Codex review + Gemini critique selectors resilience

### P0.3 L4 E2E EXEC post iter 35 deploy

**Pain**: Tester-1 reported F1 chunk DrawingOverlay-DQW-4_r9.js zero ref `flushDebouncedSave` (deploy gap).

**Status**: Iter 35 deploy `grcq82kt9` includes Maker-2 L3 beforeunload + Maker-2 verified flushDebouncedSaveSync export shipped commit 68fd7cd.

**Atom L4** (Tester-1, 30 min):
- Run `npx playwright test tests/e2e/05-esci-persistence.spec.js --config tests/e2e/sprint-u.config.js` post-iter-35 deploy
- Expected 3/3 PASS post-deploy (F1 fix LIVE prod chunk)
- Document evidence `docs/audits/iter-36-evidence/L4-post-iter-35-deploy.md`

### P0.4 J1+J2 Sense 1.5 complete wire

**Status iter 35**: J1 client-side scaffold api.js sendChat percorsoContext shipped. J2 BASE_PROMPT v3.4 §7 Percorso block — coordination msg sent Maker-2→Maker-1, NOT yet shipped.

**Atom J1+J2 complete** (~3h):
- Maker-1: BASE_PROMPT v3.4 §7 NEW Percorso context inject block (40 LOC)
- Maker-2: useGalileoChat populate `percorsoContext` automatically when modalita='percorso'
- Edge Function unlim-chat: handle `percorso_context` payload + cite class memory + suggested next experiment
- Three-Agent Pipeline gate: USE (Sense 1.5 architectural)
- CoV: 5 prompt smoke test Percorso mode verify class memory cited

### P0.5 R5+R7 re-bench post env enable

**Atom R5** (~30 min):
- Andrea env enable: ENABLE_CAP_CONDITIONAL + ENABLE_HEDGED_LLM + ENABLE_ONNISCENZA
- Edge Function unlim-chat deploy v81+
- `node scripts/bench/run-sprint-r5-stress.mjs`
- Expected: avg <2000ms p95 <3500ms PZ V3 ≥90%
- Compare iter 38 baseline avg 1607ms / 94.2% PZ V3 (best iter 38 carryover)

**Atom R7** (~30 min):
- ENABLE_L2_CATEGORY_NARROW=true canary
- `node scripts/bench/run-sprint-r7-stress.mjs`
- Expected: canonical % lift vs iter 38 baseline 3.6% (target ≥80% post Mistral function calling deploy)

### P0.6-P0.10 carryover

(See §1 activation string)

---

## §4 Anti-pattern G45 enforcement iter 36

- NO claim "Sprint T close achieved" (iter 41-43 + Andrea Opus indipendente review G45)
- NO claim ">8.55 senza Opus review" (cap iter 35 8.45 honest)
- NO --no-verify (pre-commit + pre-push hooks rispettati 100% iter 35 commit + push)
- NO push diretto main (e2e-bypass-preview branch + Vercel preview alias finale Production)
- NO compiacenza Three-Agent (admitted iter 34 small atomi marginal benefit + iter 35 lightweight pivot CLI auth friction)
- NO env keys printed conversation (Supabase token use shell env)
- NO destructive ops

---

## §5 Cross-link iter 35 close docs

- Audit Phase 2 close: `docs/audits/2026-05-04-iter-35-PHASE2-CLOSE-audit.md` (TBD scribe inline next)
- Plan iter 35: `docs/superpowers/plans/2026-05-04-iter-35-andrea-13-mandate-three-agent-master-plan.md`
- ADR-038 Passo Passo dedup: `docs/adrs/ADR-038-passo-passo-dedup-hide-left-preserve-right-resizable.md`
- ADR-039 ComponentDrawer scope: `docs/adrs/ADR-039-componentdrawer-scope-gate-modalita-libero.md`
- ADR-040 Percorso 2-window: `docs/adrs/ADR-040-percorso-2-window-overlay-architecture-sense-1-5.md`
- 5 BG agent audits: `docs/audits/2026-05-04-iter-35-{maker1-E3,maker1-I3,maker2-G1-H2-L3-N1-J1,maker3-F1-architecture,maker3-F2-browser-audit,tester1-I1-cronologia-audit,tester1-L1-deploy-verify,tester1-L2-esci-paths-audit,webdesigner1-Q1-Q2-I2-N2-J3}.md`
- 5 BG agent completion msgs: `automa/team-state/messages/{maker1,maker2,maker3,webdesigner1,tester1}-iter35-phase2-completed.md`
- 6 coordination msgs: `automa/team-state/messages/{webdesigner1-to-maker1-I3,webdesigner1-to-maker2-H3,maker2-to-maker1-J2,maker3-to-webdesigner1-F1-mount,maker3-to-tester1-F4-e2e-spec-sync,orchestrator-iter35-START}.md`
- Tester-1 evidence: `docs/audits/iter-35-evidence/{L4/,iter-35-tester1-findings.md,lighthouse-prod.json}`
- Master plan parent iter 36-38: `docs/superpowers/plans/2026-05-04-iter-36-38-andrea-12-mandate-master-plan.md`

---

## §6 Andrea ratify queue priority order (8 entries)

| # | Entry | Priority | Time | Action |
|---|---|---|---|---|
| 1 | ENABLE_ONNISCENZA=true Supabase env enable | P0 | 5m | `npx supabase secrets set ENABLE_ONNISCENZA=true --project-ref euqpdueopmlllqjmqnyb` |
| 2 | ENABLE_HEDGED_LLM=true + ENABLE_HEDGED_PROVIDER_MIX=true | P0 | 5m | env enable + smoke latency |
| 3 | ENABLE_CAP_CONDITIONAL=true canary 5%→100% | P0 | 5m | env enable + R5 re-bench |
| 4 | ENABLE_L2_CATEGORY_NARROW=true canary | P1 | 5m | env enable + R7 re-bench |
| 5 | Edge Function unlim-chat deploy v81+ (E1+E2+E3+P3 code shipped iter 35) | P0 | 5m | `SUPABASE_ACCESS_TOKEN=sbp_... npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb` |
| 6 | Edge Function unlim-session-description deploy NEW (I3 code shipped iter 35) | P0 | 5m | `SUPABASE_ACCESS_TOKEN=sbp_... npx supabase functions deploy unlim-session-description --project-ref euqpdueopmlllqjmqnyb` |
| 7 | macOS Computer Use real mic permission test wake word F1 badge | P1 | 10m | manual click HomePage F1 badge state machine 4 verify |
| 8 | R5+R6+R7 re-bench batch post env enable | P0 | 30m | `node scripts/bench/run-sprint-r{5,6,7}-stress.mjs` |

**Total Andrea time**: ~1h sequential.

---

End of handoff iter 35 → iter 36.
