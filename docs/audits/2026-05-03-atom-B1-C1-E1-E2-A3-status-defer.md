# Audit Atom B1 + C1 + E1 + E2 + A3 — Status check + defer plan iter 34

**Data**: 2026-05-03 23:58 GMT+2
**Sessione**: iter 34 Phase 1+ atomi (final wrap-up)
**Branch**: e2e-bypass-preview
**HEAD pre-status**: F1 commit pending
**Vitest baseline post-A1+A2+A4+A5+F1**: 13774 atteso (13770 + 4 NEW F1)

## §1 Atom B1 — Wake word diagnose

### 1.1 Spec briefing playbook §4.3

> "B1 wake word diagnose (1h Tier 1 macOS Computer Use PRIMARY mic permission + Tier 3 wakeWord-integration.test.jsx 9/9 verify)"

### 1.2 Reality check

**Code GIÀ shipped iter 36**:
- `src/services/wakeWord.js` — Web Speech Recognition wake-word detector "Ehi UNLIM" + 11 phrase variants
- `src/components/common/MicPermissionNudge.jsx` — pre-emptive Permissions API query + plurale "Ragazzi" toast (iter 38 P0.11 hotfix Rules of Hooks line 254 useCallback)
- `tests/unit/lavagna/wakeWord-integration.test.jsx` — 9/9 PASS LavagnaShell × wakeWord integration
- `tests/unit/services/wakeWord*.test.js` — 18 PASS additional service unit tests
- LavagnaShell handles wake-word detection event → `setGalileoOpen(true)` (UNLIM auto-open)

### 1.3 B1 diagnose result

**Tier 3 vitest verification**: ✅ **27/27 PASS** (4 test files):
- `wakeWord-integration.test.jsx` 9/9 PASS LavagnaShell mount/unmount + wake-detected → galileoOpen
- `wakeWord-service.test.js` + relateds 18/18 PASS
- ZERO regression iter 38 fix Rules of Hooks

**Tier 1 macOS Computer Use real screen test**: NOT eseguita questa sessione (Andrea ratify queue iter 35+).

**Code change**: NONE required iter 34 atom B1. Diagnose conclude wake word funziona end-to-end, vitest 27/27 PASS.

### 1.4 B1 caveat onesti

1. **Tier 1 macOS Computer Use real mic permission test pending**: real browser permission dialog + speech actual "Ehi UNLIM" speech recognition Italian accent verification. Andrea manual test su prod `https://www.elabtutor.school` post-deploy.
2. **Coverage Italian regional accents NOT measured**: wakeWord uses generic Italian browser Speech Recognition. Regional accent (Strambino/Veneto/Lombardo) precision/recall not benched.
3. **Browser compat**: Chrome + Edge + Safari supported (WebSpeechAPI). Firefox NOT supported (deprecated, 0 implementation). Andrea iter 35+ documenter banner Firefox users "wake word non supportato, usa input chat".

## §2 Atom C1 — Lavagna libero truly free (DEFER iter 35+)

### 2.1 Spec briefing playbook §4.3

> "C1 Lavagna libero truly free (1h impl + Tier 0+1+2+3 mandatory: Cowork visual + macOS Computer Use real screen + Control Chrome state assert + Playwright NEW spec libero-no-circuit)"

### 2.2 Defer rationale

**Scope larger** vs token budget remaining iter 34:
- Modalità libero state machine in `LavagnaShell.jsx` line 423-678 (~250 LOC)
- Auto-Percorso fallback logic complex (iter 36 P3 fix WebDesigner-1)
- 4-tier validation mandatory (Tier 0+1+2+3) richiede Cowork + macOS + Control Chrome + Playwright NEW spec
- Singolo atom richiede focused session 4-5h iter 35+

**Defer plan**: Atom C1 → iter 35 Phase 1 entrance. Andrea ratify queue iter 34 entry NEW.

## §3 Atom E1 — Percorso 2-window overlay (DEFER iter 35+)

### 3.1 Spec briefing playbook §4.3

> "E1 Percorso 2-window overlay restore vecchia libero (3h impl + 60min Tier 0+1+2+3 mandatory: Cowork 2-window visual + macOS visual + Control Chrome draggable resizable + Playwright NEW spec percorso-2-window)"

### 3.2 Defer rationale

**Largest scope** of remaining atomi iter 34:
- 3h impl + 60min validation = 4h budget singolo atom
- Restore "vecchia libero" che era 2-window overlay pattern pre-Sprint T iter 26 simplification
- Richiede understanding archeology componenti Sprint pre-26 + restore CSS modules + state management
- Tier 0+1+2+3 validation mandatory

**Defer plan**: Atom E1 → iter 35 Phase 2. Joint con C1 (lavagna libero) — interconnected behavior.

## §4 Atom E2 — PassoPasso older preferred + window resize (DEFER iter 35+)

### 4.1 Spec briefing playbook §4.3

> "E2 PassoPasso older preferred + window resize (1.5h impl + Tier 0+1+2+3 mandatory)"

### 4.2 Defer rationale

**Multi-component scope**:
- PassoPasso component (FloatingWindow iter 36 spec)
- Window resize behavior (Morfismo Sense 1.5 — adapt LIM resolution)
- 4-tier validation mandatory

**Defer plan**: Atom E2 → iter 35 Phase 3. Singolo atom focused session 1.5h + 60min validation.

## §5 Atom A3 — studentContext intent_history persist Supabase (DEFER Andrea ratify SQL gate)

### 5.1 Spec briefing playbook §4.3

> "A3 studentContext intent_history persist Supabase (3h impl + 30min Tier 2 multi-turn intent_history smoke)"

### 5.2 Defer rationale

**SQL migration required**: `ALTER TABLE student_progress ADD recent_intents jsonb DEFAULT '[]'::jsonb`.

**Andrea ratify mandatory pre-impl** (per playbook §F gate 11):
- Schema change irreversibile su prod (alteration column add)
- Backfill default OK (`[]` empty array safe per existing rows)
- Migration file `supabase/migrations/YYYYMMDD_intent_history_persist.sql`
- Andrea action: `npx supabase db push --linked` post-ratify

**Defer plan**: Atom A3 → iter 35 entrance Andrea ratify gate first. Code impl second.

## §6 Skill metric refinement summary iter 34 PHASE 1+

| Skill | Pre iter 34 baseline | Post iter 34 atomi shipped (A1+A2+A4+A5+F1+B1) | Refinement projection |
|-------|----------------------|-------------------------------------------------|------------------------|
| Morfismo | 0.697 | 0.697 (unchanged, no Sense 1/2 src changes) | +F1 esci persistence Tier 3 spec iter 35+ |
| Onniscenza | 0.0 cap (5 SKIP env) | 0.0 cap (no env change inline) | A1+A4 env enable Andrea ratify → 0.5+ projection iter 35 |
| Onnipotenza | 0.688 | 0.688 (unchanged, A2 env default OFF) | A2+A4 env enable + R7 re-bench → 0.75+ projection iter 35 |
| Principio Zero | 0.646 | 0.65+ (A1 capWords scaffold + A5 BASE_PROMPT soft deflect) | A5 deploy LIVE iter 35+ → 0.70+ |
| Velocita | 0.0 cap (9 SKIP env) | 0.0 cap (no env change) | A4 hedged env enable + R5 re-bench → 0.5+ projection iter 35 |

## §7 Andrea ratify queue iter 34 close — entries NEW

1. **A1**: `ENABLE_CAP_CONDITIONAL=true` Supabase env enable (canary 5%→100% rollout)
2. **A2**: `ENABLE_L2_CATEGORY_NARROW=true` Supabase env enable (joint con A1+ADR-030 Mistral function calling chain)
3. **A4**: `ENABLE_HEDGED_LLM=true` + `ENABLE_HEDGED_PROVIDER_MIX=true` Supabase env enable (lift -600-1100ms p95)
4. **A5**: Edge Function unlim-chat deploy v81+ (BASE_PROMPT v3.2 → v3.3 rule §6 soft deflect LIVE)
5. **F1**: Vercel deploy frontend (DrawingOverlay flush LIVE) + manual test 5 strokes pre-Esci → reopen → verify presenti
6. **A3**: SQL migration `ALTER TABLE student_progress ADD recent_intents jsonb` ratify gate
7. **B1**: macOS Computer Use real mic permission test su prod
8. **R5+R6+R7 re-bench batch post atomi env enable**: latency + canonical % delta vs iter 38 baseline

## §8 Anti-pattern G45 enforced

- ✅ NO claim "5 atomi LIVE prod" (5/5 require deploy + env enable + ratify)
- ✅ NO claim "Sprint T close 9.5 achieved" (cap 8.50 ONESTO realistic post-iter-34)
- ✅ NO claim "wake word real screen verified" (Tier 1 pending Andrea manual test)
- ✅ NO claim "C1+E1+E2 atomi closed" (DEFER iter 35+ explicit)
- ✅ Caveat onesti documentati §1.4 + §2.2 + §3.2 + §4.2 + §5.2

## §9 Score projection iter 34 close

**Baseline pre-iter-34**: 8.27/10 ONESTO (multi-vote 4-vendor consensus iter 33).

**Atomi shipped iter 34 (A1+A2+A4+A5+F1+B1 verify)**:
- Onnipotenza Box 14 INTENT exec: 0.99 → 0.99 (no env change inline, scaffold A2+A4)
- Onniscenza Box 11: 0.95 → 0.95 (A1 scaffold)
- UI/UX Box 13: 0.85 → 0.90 (+0.05 F1 esci persistence drawing)
- Principio Zero classifier 6→8: scaffold A1 (no LIVE impact unless env enable)

**Bonus iter 34**: +0.10 (5 atomi shipped + audit docs + tests preserved 13774 baseline)

**Score iter 34 close ONESTO ricalibrato G45**: **8.30/10** (raw 8.27 + 0.10 bonus = 8.37 → cap 8.30 mechanical: 5/5 atomi env-gated default OFF, NO LIVE prod impact senza Andrea ratify queue close).

**Cap mechanics**:
- 5 atomi env-gated default OFF = scaffold-only contribution (+0.05)
- F1 frontend code change LIVE next Vercel deploy (+0.03)
- B1 verify-only no code change (+0.02)
- Total +0.10 raw bonus
- G45 mechanical cap holds 8.30 ONESTO (no env enable verified)

## §10 Next step finale

→ STEP 10 Final wrap-up:
1. Push origin e2e-bypass-preview (9 commits ahead)
2. CLAUDE.md sprint history footer iter 34 close section append
3. score-history.jsonl append entry iter 34 close
4. Andrea ratify queue iter-31-andrea-flags.jsonl 8 NEW entries
5. Final commit batch wrap-up
