# Iter 39 entrance — Andrea ratify queue paste-ready

**Date**: 2026-05-01 ~07:50 CEST
**Goal**: unblock iter 39 carryover P0 atoms via Andrea-gate actions (~15-20 min total).

**Pre-condition**: 3 P0 carryover deliverables shipped iter 38 carryover session 2026-05-01 (A14 codemod + R6 SQL backfill migration + A2 Fumetto spec fix). Working tree NOT committed (commit gate Andrea decision).

---

## §1 Working tree review (before commit)

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
git status --short
git diff --stat
```

**Expected modified files iter 38 carryover session**:
- 5 components plurale fix: SerialMonitor.jsx, NewElabSimulator.jsx, ExperimentPicker.jsx, PercorsoPanel.jsx, CanvasTab.jsx, ElabTutorV4.jsx
- 4 lesson-paths JSON: v1-cap9-esp{6,7,8,9}.json
- 1 Playwright spec: tests/e2e/03-fumetto-flow.spec.js (selector fix)

**Expected NEW files**:
- `supabase/migrations/20260501073000_rag_chunks_metadata_backfill.sql`
- `docs/audits/iter-38-linguaggio-codemod.md`
- `docs/audits/2026-05-01-iter-38-carryover-session-audit.md`
- `docs/handoff/2026-05-01-iter-39-andrea-ratify-queue-paste-ready.md` (this file)

---

## §2 Commit + push (Andrea decide)

**Pre-commit hook gate**: vitest + build (~14min). Already vitest 13474 PASS verified — build is the slow part.

```bash
git add \
  src/components/simulator/panels/SerialMonitor.jsx \
  src/components/simulator/NewElabSimulator.jsx \
  src/components/simulator/panels/ExperimentPicker.jsx \
  src/components/lavagna/PercorsoPanel.jsx \
  src/components/tutor/CanvasTab.jsx \
  src/components/tutor/ElabTutorV4.jsx \
  src/data/lesson-paths/v1-cap9-esp6.json \
  src/data/lesson-paths/v1-cap9-esp7.json \
  src/data/lesson-paths/v1-cap9-esp8.json \
  src/data/lesson-paths/v1-cap9-esp9.json \
  tests/e2e/03-fumetto-flow.spec.js \
  supabase/migrations/20260501073000_rag_chunks_metadata_backfill.sql \
  docs/audits/iter-38-linguaggio-codemod.md \
  docs/audits/2026-05-01-iter-38-carryover-session-audit.md \
  docs/handoff/2026-05-01-iter-39-andrea-ratify-queue-paste-ready.md \
  docs/handoff/2026-05-01-iter-38-to-iter-39-handoff.md

git commit -m "$(cat <<'EOF'
feat(iter-38-carryover): A14 codemod TRUE + R6 SQL backfill + A2 Fumetto spec fix

A14 Linguaggio codemod 14 TRUE violations actioned (UI chrome + mascotte UNLIM
+ lesson titles plural). PDR "200 violations" baseline revised honest: ~14
TRUE + ~180 narrative analogies preserved per Sense 2 Morfismo (volumi
cartacei "tu generico" voice intentional).

R6 page metadata SQL backfill migration (iter 13 P0 prep): unblocks recall@5
≥0.55 measurement. Path A fuzzy match from chunk_id pattern + jsonb metadata
backfill. Idempotent. Apply via supabase db push --linked.

A2 Fumetto Playwright spec selector tightened: iter 37 "FAIL" was test artifact
(text= matched HomeCronologia.jsx:287 cross-route placeholder). Scope to
[role=status]/[aria-live]/.toast/.elab-toast fix. Handler stub-fallback
already plural compliant iter 36.

Anti-regression: vitest 13474 PRESERVED. Zero functional change codemod
(string literals only). NO push main. NO --no-verify.

iter 38 close score 8.0/10 ONESTO unchanged (G45 mechanical cap A10 not
shipped + Lighthouse perf FAIL + 3/4 BG agents org limit).

Audit docs:
- docs/audits/iter-38-linguaggio-codemod.md
- docs/audits/2026-05-01-iter-38-carryover-session-audit.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"

git status
```

**If pre-commit hook fails**: investigate root cause (DON'T `--no-verify`). Fix, re-stage, NEW commit.

```bash
git push origin e2e-bypass-preview
```

---

## §3 D1 ADR-025 Modalità 4 simplification ratify (15 min)

**Carryover iter 22 → iter 38 deferred → iter 39 entrance**

Read ADR voce 1+2+3 + decide accept/amend/reject:
```bash
less docs/adrs/ADR-025-modalita-4-simplification.md
```

Decision options:
- **Accept**: log decision in `automa/team-state/messages/andrea-ratify-adr025-CONFIRMED.md`
- **Amend**: edit specific voci 1/2/3 inline + accept amended
- **Reject**: log rationale + defer iter 40+ (with explicit reason)

---

## §4 D2 ADR-026 content-safety-guard ratify + deploy (30 min)

**Carryover iter 22 → iter 38 deferred → iter 39 entrance**

```bash
# 1. Read ADR-026 + 10-rule content safety runtime
less docs/adrs/ADR-026-content-safety-guard-runtime.md

# 2. Test ADR-026 stub regression (vitest 68/68 already PASS iter 19)
npx vitest run tests/unit/content-safety-guard-regression.test.js

# 3. If accept → deploy
SUPABASE_ACCESS_TOKEN=$(grep ^export SUPABASE_ACCESS_TOKEN ~/.zshrc | cut -d= -f2- | tr -d '"\047 ')
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions deploy unlim-chat \
  --project-ref euqpdueopmlllqjmqnyb

# 4. Smoke test 10 rules (curl)
# ... (depends on ADR-026 §5 test fixtures)
```

---

## §5 Apply BOTH iter 38 SQL migrations (~1 min)

**Carryover Maker-1 BG iter 38 + this session iter 38 carryover**

```bash
SUPABASE_ACCESS_TOKEN=$(grep ^export SUPABASE_ACCESS_TOKEN ~/.zshrc | cut -d= -f2- | tr -d '"\047 ')
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase db push --linked
```

**Migrations applied**:
1. `20260430220000_unlim_chat_warmup_cron.sql` (A5 Maker-1 iter 38 — pg_cron 30s warmup HEAD ping unlim-chat)
2. `20260501073000_rag_chunks_metadata_backfill.sql` (iter 38 carryover this session — Path A fuzzy match chapter/page/section_title)

**Post-apply verify** (run as Andrea):
```sql
-- Backfill coverage
SELECT source,
       COUNT(*) AS total,
       COUNT(page) AS page_filled,
       COUNT(chapter) AS chapter_filled,
       ROUND(COUNT(page)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 1) AS page_pct,
       ROUND(COUNT(chapter)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 1) AS chapter_pct
  FROM rag_chunks
 GROUP BY source
 ORDER BY source;

-- pg_cron warmup verify
SELECT * FROM cron.job;
```

**Expected**:
- vol1/vol2/vol3 page_pct ≥80%
- pg_cron job 'unlim-chat-warmup-30s' active

---

## §6 Edge Function unlim-chat v54 deploy (~2 min)

**iter 38 commit `f21c227` Mistral function calling code on disk but NOT deployed (still v53 prod).**

```bash
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions deploy unlim-chat \
  --project-ref euqpdueopmlllqjmqnyb

# Verify
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions list \
  --project-ref euqpdueopmlllqjmqnyb | grep unlim-chat
# Expected: version 54+ ACTIVE
```

**Decide canary flag**:
```bash
# Option A: keep false iter 39 entrance (R7 baseline measure first)
# Default — no action needed

# Option B: enable canary 5% per ADR-028 §7
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase secrets set \
  ENABLE_INTENT_JSON_SCHEMA=true \
  --project-ref euqpdueopmlllqjmqnyb
```

---

## §7 Vercel frontend deploy verify (~16 min full)

**A12 PWA SW prompt-update LIVE post key rotation iter 32**

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
npm run build  # ~14min heavy
npx vercel --prod --yes  # ~2min
```

**Browser smoke**:
1. Open https://www.elabtutor.school in clean browser
2. Wait for SW install
3. Open dev console → expect `New service worker available` event
4. Toast appears: "Ragazzi, c'è una nuova versione di ELAB Tutor. Ricaricate la pagina per aggiornare?"
5. Click reload → fresh chunks loaded

---

## §8 Smoke prod end-to-end (~5 min)

```bash
# 1. Curl unlim-chat HTTP 200 + Italian Ragazzi + Vol/pag
curl -X POST "https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "x-elab-api-key: $ELAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"Spiegate ai ragazzi cosa è un LED, citando il volume","sessionId":"smoke-iter39-entrance","experimentId":"v1-cap6-esp1"}' \
  | jq '{ok, words: (.text | split(" ") | length), has_ragazzi: (.text | test("Ragazzi"; "i")), has_vol_pag: (.text | test("Vol\\.[0-9]"; "i")), intents_parsed_count: (.intents_parsed | length)}'

# Expected: ok:true + words≤80 + has_ragazzi:true + has_vol_pag:true + intents_parsed_count ≥0
```

---

## §9 Iter 39 spawn agents (post-Andrea-actions, when org limit reset)

Recommended sequence:

```
# Phase 1 parallel (4-6 agents):
- Maker-1 (backend-architect): A10 Onnipotenza Deno port 12-tool subset (6-8h) + A4 streaming SSE (4h) + A9 STT Voxtral migration impl (6h) — total ~16h
- Maker-3 (codemod): A14 round 2 admin/* + scratchBlocks review (2h) + A14 false-positive verification (1h) — total 3h
- WebDesigner-1 (frontend-developer): A6 Lighthouse perf optim (lazy load + bundle analysis + image optim + font preload) target ≥90 (2h) + A6.b Cronologia Google-style (2h) — total 4h
- Tester-1 (team-debugger): A15 94 esperimenti Playwright UNO PER UNO sweep (3h) — Andrea local-run alternative
- Tester-2 (team-debugger): R5 + R6 + R7 re-bench post v54 deploy (3h) — env req SUPABASE_ANON_KEY + ELAB_API_KEY + VOYAGE_API_KEY
- Tester-3 (team-debugger): A8 Vision Gemini Flash smoke + A2 Fumetto E2E re-verify post selector fix (1h)

# Phase 2 sequential (Documenter):
- general-purpose: audit + handoff + CLAUDE.md append + iter 39 close

# Phase 3 fix BG agents (5 agents):
- application-performance:performance-engineer: iter 40+ plan continuation post Tier 1 + Tier 2 implementation
```

---

## §10 Iter 39 acceptance gate (G45 ONESTO)

| Metric | Target |
|--------|--------|
| vitest PASS | ≥13474 (NEVER scendere) |
| Build | PASS pre-commit hook |
| R5 50-prompt avg latency | <3000ms (vs iter 37 4496ms) |
| R5 50-prompt p95 latency | <6000ms (vs iter 37 10096ms) |
| R5 PZ V3 verdict | PASS ≥85% (preserve) |
| R6 100-prompt recall@5 | ≥0.55 (post page metadata SQL apply) |
| R7 200-prompt INTENT exec rate | ≥95% (post A7 deploy) |
| Vision Gemini Flash primary | HTTP 200 X-Vision-Provider: gemini-2.5-flash |
| 94 esperimenti broken count | ≤10 (Andrea iter 21+ mandate) |
| Linguaggio codemod TRUE | ≤14 actionable + ≤2 false positives admin/* |
| Lighthouse perf | ≥90 (vs iter 38 26+23 FAIL) |
| Lighthouse a11y | ≥95 (preserve iter 38 100) |
| Lighthouse SEO | ≥100 (preserve iter 38 100) |
| Vercel deploy LIVE | post key rotation iter 32 verified |
| Edge Function unlim-chat | v54 ACTIVE |
| Migrations applied | warmup_cron + rag_chunks_metadata_backfill |

**Iter 39 score target ONESTO**: 8.0 → **8.7+/10** post Andrea actions + Tier 1 deferred atoms shipped + R7 ≥95%.

**Sprint T close projection iter 40+**: 9.5/10 ONESTO conditional A10 Deno port + canary rollout + A14 round 2 + A15 broken count REAL ≤10 — Opus indipendente review G45 mandate.

---

**Status**: Andrea ratify queue paste-ready. iter 39 entrance gate Andrea actions documented sequenziale 9 step (commit + ratify D1+D2 + apply migrations + deploy v54 + Vercel + smoke + spawn agents post-org-reset).
