# G45 Anti-Inflation Indipendente Opus Audit — Sprint T iter 39 close

**Author**: Independent Opus session — context-zero G45 reviewer
**Date**: 2026-05-02
**Working dir**: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/`
**HEAD**: `3ac4aec2` on `e2e-bypass-preview` (post `d152aa2` Edge v72 systematic debug)
**Mandate**: Treat narrative-claimed score `8.45/10 ONESTO G45 cap` as UNVERIFIED. File-system + git log + Phase 0 baseline are the only sources of truth.

---

## §1 Executive summary

### Independent score ONESTO: **8.0/10** (G45 mechanical cap)

**Delta vs claimed 8.45**: **−0.45**. Score 8.45 is **NOT JUSTIFIED** under G45 anti-inflation discipline once Phase 0 measured baseline is enforced. The narrative score conflates "code shipped iter 39" with "production behavior verified iter 39". Phase 0 §3 R5 latest 0/8 BROKEN + Phase 0 §5 R7 canonical 3.6% UNCHANGED canary ON + Phase 0 §6 Lighthouse perf 0.23-0.26 + Phase 0 §3 Onniscenza V2 REVERTED to V1 (-1.0pp PZ V3 / +36% slower) jointly cap the iter at 8.0. The +0.45 over 8.0 narrative claim attempts to monetize iter 39 ralph atoms (A1 SSE, A3 12-tool dispatcher MVP, A4 Onniscenza V2 reverted, A5 Voxtral STT) WITHOUT live production verification — 4 of 5 atoms ship code that either reverts (A4), gates fire-rate at 5% canary (A3 reset to 0% per commit `1feda3c` log) or is unverified (A1 SSE prod LIVE per `e6fa25c` audit but no R5 SSE-aware re-bench, A5 STT migration audit-only).

### Top 3 inflation flags (specific narrative → reality drift)

| # | Narrative claim (CLAUDE.md / handoff) | Reality (file-system + bench + Phase 0) | Cap impact |
|---|----------------------------------------|------------------------------------------|------------|
| 1 | "Onniscenza V2 cross-attention LIVE prod canary" (commit `eb4a11b` 2026-05-01 §A4 + ADR-033 §6 acceptance) | V2 **REGRESSED** -1.0pp PZ V3 + 36% slower latency, **REVERTED to V1** via `ONNISCENZA_VERSION=v1` env (commit `02b5c03` 2026-05-02 + `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` §3). Box 11 cannot lift past 0.85 baseline. | −0.10 cap |
| 2 | "INTENT canonical lift achievable iter 39 via 12-tool dispatcher MVP" (handoff §3 + ADR-032 §3) | `clawbot-dispatcher-deno.ts` ships 12 cases (verified `grep -cE "case '"` = 12), BUT `CANARY_DENO_DISPATCH_PERCENT=0` reset by Andrea per commit `1feda3c` body ("Plus reset CANARY_DENO_DISPATCH_PERCENT=0 default safe"). Phase 0 H8 secrets state shows `=5` — discrepancy with commit log. R7 canonical **3.6% UNCHANGED FAIL** vs ≥80% target (Phase 0 §5). L2 template router still dominates. | −0.15 cap |
| 3 | "Sprint T iter 39 close score 8.45/10 ONESTO G45 cap" (CLAUDE.md sprint history claim from prompt context) | PDR §4 mechanical cap rules NOT individually verified iter 39: A10 12-tool dispatcher MVP shipped but **fire rate 0%** (canary reset); R5 latest 0/8 BROKEN (Phase 0 §3); Lighthouse perf 0.23-0.26 carries iter 38 (no optim shipped iter 39 per `git log`); R7 stays 3.6% (Phase 0 §5). Narrative monetizes "code present" without "production verified". | −0.20 cap |

### Cap rationale enforce 8.0 (not 8.45)

PDR §4 R5 latency rule binds at iter 38 (4496ms avg vs PDR ≤1800ms target FAIL — see CLAUDE.md iter 37 close §3). Iter 38 carryover R5 v56 1607ms PASS lifted cap to 8.5. Iter 39 latest R5 (2026-05-02T07:28) is **0/8 BROKEN** — measurement regression. Without a valid iter 39 R5 PASS confirming v72 still meets ≤1800ms post-Onniscenza-revert + post-12-tool-dispatcher + post-SSE-wire, the 8.5 ceiling does NOT carry forward; falls back to iter 37 mechanical cap **8.0**. Plus Lighthouse perf 26+23 still FAIL ≥90 (no iter 39 optim shipped) + A14 codemod + A15 92 esperimenti audit STILL not addressed iter 39 (Andrea iter 21+ mandate carryover unmoved per `git log` + Phase 0 §8) = **−0.45 confirmed cap delta**.

---

## §2 Methodology

Sources verified for this audit (read-only file-system + git + bench):

1. **Phase 0 discovery** (`docs/audits/PHASE-0-discovery-2026-05-02.md`, 343 LOC) — read fully.
2. **Phase 0 baseline** (`docs/audits/PHASE-0-baseline-2026-05-02.md`, 370 LOC) — read fully.
3. **CLAUDE.md sprint history** — read iter 36 / iter 37 / iter 38 PHASE 3 close + iter 38 carryover deploy chain + Sprint U Cycle 1 sections.
4. **`git log --oneline -30 supabase/functions/unlim-chat/`** — verified iter 39 commit chain (10 commits with `iter-39` prefix).
5. **`git log --all --oneline | grep iter.39`** — listed 24 iter-39 commits (full surface visible).
6. **`git show --stat 1feda3c d152aa2`** — verified scope of latest Edge Function commits (dispatcher_results surface + Edge v72 systematic debug).
7. **`docs/adrs/ADR-032-onnipotenza-deno-12-tool-server-safe.md`** — header + status PROPOSED (Andrea ratify queue iter 40+).
8. **`docs/adrs/ADR-033-onniscenza-v2-cross-attention-budget.md`** — header + status PROPOSED (Andrea ratify queue iter 40+).
9. **`docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md`** — V2 head-to-head bench: -1.0pp PZ V3 + 36% slower → REVERTED to V1.
10. **`docs/audits/iter-39-A4-Onniscenza-V2-canary-LIVE.md`** — earlier-than-revert audit (pre-regression confirmation).
11. **`supabase/functions/_shared/clawbot-dispatcher-deno.ts`** (286 LOC) — 12 case statements verified.
12. **`supabase/functions/_shared/onniscenza-bridge.ts`** (592 LOC) — both `aggregateOnniscenza` (V1, line 299) + `aggregateOnniscenzaV2` (line 518) present, gate via env `ONNISCENZA_VERSION` line 390-391.
13. **`supabase/functions/unlim-chat/index.ts`** (1010 LOC) — SSE branch lines 591-684 + canary `CANARY_DENO_DISPATCH_PERCENT` line 848 + `ENABLE_INTENT_TOOLS_SCHEMA` line 464 + V1/V2 selector line 391.
14. **`supabase/functions/_shared/clawbot-template-router.ts`** — `selectTemplate` lines 121-153 + Sprint U experiment-id filter lines 144-150 read directly.
15. **`scripts/openclaw/tools-registry.ts`** — ToolSpec count via `grep -cE "name: ['\"]"` = **57** (NOT 62 nor 12).
16. **Bench outputs**:
    - `scripts/bench/output/r5-stress-report-2026-05-02T07-28-58-859Z.md` (8 LOC, FAILURE 0/8 BROKEN)
    - `scripts/bench/output/r5-stress-report-2026-05-01T22-24-50-918Z.md` (50/50 success, avg 2182ms — V2 measurement, regressed)
    - `scripts/bench/output/r5-stress-report-2026-05-01T07-43-04-636Z.md` (last documented PASS 1607ms / 94.2%)
    - `scripts/bench/output/r6-stress-report-2026-04-30T18-53-28-013Z.md` (recall@5 0.067 FAIL ≥0.55, page=0% root cause)
    - `scripts/bench/output/r7-stress-report-2026-05-01T07-43-03-043Z.md` (canonical 3.6% / combined 46.2% FAIL ≥80%)
    - `scripts/bench/output/r7-stress-report-2026-04-30T19-31-26-887Z.md` + 3 earlier R7 reports
17. **`docs/audits/iter-38-lighthouse-{chatbot-only,easter-modal}.json`** — perf 0.26 + 0.23 (Phase 0 §6 confirmed).
18. **`docs/audits/iter-39-rag-metadata-backfill-coverage.md`** — page=0% (0/2061 chunks).
19. **`tests/e2e/29-92-esperimenti-audit.spec.js`** — 396 LOC NOT executed (Phase 0 §8).
20. **`automa/baseline-tests.txt`** — `13474` (matches Phase 0 §1 live measure).
21. **`src/data/lesson-paths/`** — 94 JSON files; 89/94 contain `Premi |fai\b|clicca|inserisci|collega` patterns (file-level grep); 94/94 do NOT contain `"Ragazzi,"` opener literal (file-level grep `grep -L`).
22. **`dist/`** — present, last modified 2026-05-02 12:44, but only 27 entries listed (sparse vs claim 32 PWA precache files).

**Methodology constraints**:
- No live Edge Function call executed (auth headers + env not provisioned this audit session)
- No build re-run (heavy ~14min deferred per Phase 0 §2 mandate)
- No Vercel deploy ID `dpl_3Y2pUvaffWJc3jXdoKporuwiykgY` independent verify (external dep, accepted as "claim only")
- No supabase functions list invocation (Edge Function deployed version `v72` per commit `d152aa2` self-report only — Phase 0 §9 git-log proxy used)

---

## §3 Box-by-box rubric (independent verify)

Rubric: each box scored 0.0-1.0 vs canonical claim (CLAUDE.md iter 38 PHASE 3 close §"SPRINT_T_COMPLETE 14 boxes status") + iter 39 narrative additions. Subtotal box / 14 → normalize 10. Bonus added cumulative if cumulative deliverables verified file-system. G45 mechanical cap applied if any PDR §4 trigger fires.

### Box 1 — VPS GPU: **0.4** (UNCHANGED)

**Claim**: "Path A pod TERMINATED iter 5 P3" (CLAUDE.md iter 5 close finale §"🔥 RunPod pod 5ren6xbrprhkl5 TERMINATED").
**Verify**: No iter 39 commit re-introduces RunPod pod (`git log --oneline | grep -i runpod` returned 0 results in iter 39 chain). VPS GPU baseline storage 0.4 inheritance correct.
**Evidence**: `git log --oneline --all -- scripts/runpod*.sh` shows no iter 39 mods.
**Score**: 0.4 — JUSTIFIED.

### Box 2 — 7-component stack: **0.7** (UNCHANGED)

**Claim**: "CF Workers AI multimodal LIVE iter 26" (CLAUDE.md iter 28 close).
**Verify**: `cloudflare-client.ts` exists + `iter-37-stt-fix-rationale.md` shipped iter 37. No iter 39 stack expansion commits.
**Score**: 0.7 — JUSTIFIED.

### Box 3 — RAG 1881 chunks coverage: **0.7** (UNCHANGED)

**Claim**: "1881 chunks LIVE post-completion iter 7 close".
**Verify**: `docs/audits/iter-39-rag-metadata-backfill-coverage.md` lines 9-21 says total chunks=2061 (NOT 1881 — drift +180 not explained narratively). `page` filled = 0/2061 (0.0%) — Voyage ingest gap. Re-ingest required (~$1, 50min) — defer iter 40+.
**Score**: 0.7 — JUSTIFIED at baseline. Narrative count drift 1881→2061 unexplained but not score-impacting.

### Box 4 — Wiki 100/100 + 26 nuovi: **1.0** (UNCHANGED)

**Claim**: "126/100 concepts" (CLAUDE.md iter 28 close).
**Verify**: `docs/unlim-wiki/concepts/*.md` not counted directly here, but iter 28 close + iter 29 MM1 batch +26 are well-attested via `docs/unlim-wiki/log.md`.
**Score**: 1.0 — JUSTIFIED.

### Box 5 — R0 91.80% UNLIM v3: **1.0** (UNCHANGED)

**Claim**: "LIVE iter 5 P3 deploy".
**Verify**: `scripts/bench/output/r0-render-*.md` + R0 Edge function bench iter 3 (91.80%).
**Score**: 1.0 — JUSTIFIED.

### Box 6 — Hybrid RAG: **0.85** (UNCHANGED)

**Claim**: "B2 unverified env block iter 8" carryover.
**Verify**: Phase 0 §4 R6 recall@5 = 0.067 FAIL ≥0.55. Hybrid RAG impl shipped iter 8 (ADR-015) but real-world recall blocked by metadata backfill (page=0%). Box 0.85 reflects code shipped + 1 fixture unblock; cannot lift further until R6 ≥0.55 measured.
**Score**: 0.85 — JUSTIFIED (cap mechanical, no iter 39 lift).

### Box 7 — Vision Pixtral: **0.75** (UNCHANGED)

**Claim**: "Pixtral live verified iter 29 model matrix".
**Verify**: A2 Vision Gemini Flash deploy DEFERRED (Phase 0 §11 anti-pattern + iter 38 close §10 P0.7 Andrea ratify pending). Pixtral baseline preserved.
**Score**: 0.75 — JUSTIFIED.

### Box 8 — TTS Voxtral primary + voice clone: **0.95** (UNCHANGED)

**Claim**: "Voxtral primary + voice clone Andrea LIVE iter 31".
**Verify**: `voxtral-client.ts` + iter 31 commit `8a922f7`. Iter 39 A5 STT migration audit-only (defer impl iter 40+ per ADR-031 §6 acceptance criteria 9-cell matrix not exec'd).
**Score**: 0.95 — JUSTIFIED.

### Box 9 — R5 91.80% / 1607ms: **0.85** (DOWNGRADED from 1.0)

**Claim**: "LIVE iter 5 P3 deploy + iter 38 carryover R5 v56 1607ms PASS".
**Verify**: Phase 0 §3 latest R5 run 2026-05-02T07:28:58 = **0/8 BROKEN** (zero successful responses, "Failures: 8/8"). Last documented PASS 2026-05-01T07:43 = 1607ms / 94.2%, but iter 39 commits `e265e74` (cap_words 60→150) + `0d545fb` (12-tool dispatcher) + `223d1c6` (SSE wire) + `1feda3c` (dispatcher_results surface) + `d152aa2` (Edge v72 deploy) ALL post-date last R5 PASS without re-bench verification.
**Cap rationale**: Box 9 cannot stay 1.0 when latest measurement is 0/8 BROKEN and code has changed materially since last PASS. Honest score = 0.85 (code shipped + last-known-PASS recorded, current measurement broken).
**Score**: 0.85 — DOWNGRADED −0.15 vs narrative 1.0.

### Box 10 — ClawBot composite + L2 templates + 12-tool dispatcher MVP: **0.85** (DOWNGRADED from 1.0)

**Claim**: "ClawBot composite 1.0 ceiling (L2 templates 20/20 LIVE prod)" + iter 39 ADR-032 12-tool dispatcher Box 14 lift.
**Verify**:
- `clawbot-dispatcher-deno.ts` exists 286 LOC + `grep -cE "case '"` = **12** cases (ragRetrieve + searchVolume + setComponentValue + mountExperiment + connectWire + highlightComponent + highlightPin + clearHighlights + clearCircuit + getCircuitState + getCircuitDescription + captureScreenshot).
- BUT `CANARY_DENO_DISPATCH_PERCENT=0` reset per commit `1feda3c` body ("default safe") — fire rate 0%.
- Phase 0 §10 H8 reads `=5` (5% canary). Discrepancy commit-log vs Phase 0 reading: AT LEAST one source is stale (commit `1feda3c` Date 2026-05-01 23:36 vs Phase 0 H8 deploy timestamp 2026-05-02 12:30 reads `=5` — Andrea may have re-flipped post-revert; OR Phase 0 H8 read from secrets cache stale).
- L2 template router still dominates 95%+ requests (R7 canonical 3.6% UNCHANGED canary ON per Phase 0 §5).
- Sprint U Cycle 1 audit identifies `selectTemplate` catch-all blocker for 93/94 experiments (PHASE-0-discovery §3) — NOT addressed iter 39.
**Cap rationale**: 12-tool dispatcher MVP shipped LIVE BUT prod fire rate gated at 0-5% AND L2 catch-all still routes 95% of fixture to template short-circuit BEFORE dispatcher fires. Box cannot lift past 0.85 without (a) L2 scope reduction OR (b) `shouldUseIntentSchema` widening AND R7 canonical re-bench ≥80%.
**Score**: 0.85 — DOWNGRADED −0.15 vs narrative 1.0.

### Box 11 — Onniscenza V1 wired prod (V2 REVERTED): **0.85** (UNCHANGED iter 38 baseline)

**Claim**: iter 38 PHASE 3 close states 0.85 (+0.05 Cron warmup SQL shipped). Iter 39 narrative attempts +0.05 V2 cross-attention.
**Verify**:
- `aggregateOnniscenzaV2` exists in `onniscenza-bridge.ts:518` (commit `027d04f`) AND wire-up in `unlim-chat/index.ts:391` env-gated `ONNISCENZA_VERSION=v1|v2`.
- `docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` §1 documents V2 vs V1 head-to-head: V2 PZ V3 **93.2%** vs V1 94.2% (**-1.0pp WORSE**), avg latency V2 2182ms vs V1 1607ms (**+36% slower**).
- ADR-033 §6 acceptance criteria target +5pp PZ V3 — NOT met. V2 reverted: `SUPABASE_ACCESS_TOKEN=$TOKEN npx supabase secrets set ONNISCENZA_VERSION=v1` per audit §3.
- Phase 0 §11 anti-pattern #9: "Onniscenza V2 cross-attention LIVE prod — Reverted V1. NOT live."
**Cap rationale**: Iter 39 V2 attempt FAILED. Box CANNOT lift +0.05 (revert means net contribution = 0). Code preserved for future tuning per audit §3 — does not score.
**Score**: 0.85 — JUSTIFIED at iter 38 baseline. NO iter 39 lift.

### Box 12 — GDPR 4 docs DRAFT: **0.75** (UNCHANGED)

**Verify**: Iter 31 commit `aee48e2` (Privacy + Cookie + ToS + Sub-processors). No iter 39 GDPR commits.
**Score**: 0.75 — JUSTIFIED.

### Box 13 — UI/UX bug sweep iter 36 + iter 38 wake word + PWA prompt-update: **0.75** (DOWNGRADED from iter 38 0.85)

**Claim iter 38 close**: 0.75 (+0.05 wake word + PWA). Iter 38 carryover narrative 0.85 (+0.10 A14 14 violations + Fumetto fix shipped + T1.1 cache live).
**Verify**:
- A14 codemod TRUE 14 shipped iter 38 carryover (commit `792acf8`). Confirmed.
- A2 Fumetto Playwright spec selector fix shipped iter 38 carryover. Confirmed.
- T1.1 semantic cache (`semantic-cache.ts` 158 LOC) shipped iter 38 carryover. Confirmed.
- BUT Lighthouse perf 0.23-0.26 STILL FAIL ≥0.90 (Phase 0 §6) — A6 acceptance gate iter 38 P0.10 deferred iter 39+ + no iter 39 perf optim commit (verified `git log --grep=lighthouse` + `git log --grep=perf` iter 39 = 0 results).
- Sprint U Cycle 1 finding: 833 hex violations + `Lighthouse perf=43` (homepage NOT measured Phase 0). 73/94 lesson-paths singolare violations + 91/94 missing "Ragazzi," opener (file-level my grep: 89/94 contain imperative patterns + 94/94 missing "Ragazzi," literal — different counting methodology, both confirm massive PRINCIPIO ZERO violation).
**Cap rationale**: iter 38 carryover claimed 0.85 with Lighthouse FAIL admitted. Iter 39 ships ZERO UI/UX commits per `git log` (only iter 39-A2-voice mic button hide + A1 SSE frontend typewriter — frontend optimization, not perf bundle reduce). Phase 0 §6 Lighthouse FAIL combined with 73/94 singolare violations + L2 catch-all blocker = REGRESSION recognition: iter 38 carryover 0.85 was inflated; honest score = 0.75 (iter 38 PHASE 3 close baseline) until A6 perf optim shipped + Sprint U Cycle 2 fixes lands.
**Score**: 0.75 — DOWNGRADED −0.10 vs iter 38 carryover narrative 0.85.

### Box 14 — INTENT exec end-to-end (Mistral function calling + dispatcher): **0.85** (DOWNGRADED from iter 38 carryover narrative 0.95)

**Claim iter 38 carryover**: 0.95 (+0.05 canary ON + Mistral function calling deploy LIVE; ceiling 1.0 conditional R7 ≥95%).
**Verify**:
- `intent-tools-schema.ts` exists + `ENABLE_INTENT_TOOLS_SCHEMA=true` per Phase 0 §10 H8.
- `intentsDispatcher.js` 22/22 PASS + whitelist 12 actions iter 37.
- 12-tool Deno dispatcher MVP `clawbot-dispatcher-deno.ts` 12 cases shipped iter 39 (commit `0d545fb`).
- BUT Phase 0 §5: R7 canonical **3.6%** UNCHANGED FAIL vs ≥80% target. Combined 46.2% FAIL.
- Per CLAUDE.md iter 38 carryover caveat 2: "L2 template router short-circuits 95%+ of fixture prompts BEFORE Mistral function calling fires. Canary ON achieves nothing measurable for canonical %."
- Iter 39 commit `1feda3c` body explicitly: "A3 dispatcher code shipped LIVE BUT prod fire rate gated by L2 template router dominance (per iter 38 R7 audit canonical 3.6%). Real activation requires L2 scope reduce iter 40+ (ralph close caveat NO COMPIACENZA)."
**Cap rationale**: Code shipped end-to-end (server parser + browser dispatcher + Mistral function calling + 12-tool Deno port) BUT production fire rate 0% (L2 short-circuit + canary 0-5%). Box 0.95 narrative iter 38 carryover was forward-looking "canary ON" not production-verified. R7 canonical UNCHANGED 3.6% confirms zero behavior change. Honest score = 0.85 (code complete, dispatch fire-rate <5%, end-to-end VERIFY pending L2 reduce).
**Score**: 0.85 — DOWNGRADED −0.10 vs iter 38 carryover narrative 0.95.

### Box subtotal mechanics

```
Box 1  0.40
Box 2  0.70
Box 3  0.70
Box 4  1.00
Box 5  1.00
Box 6  0.85
Box 7  0.75
Box 8  0.95
Box 9  0.85   (iter 38 carryover 1.0 → 0.85, R5 latest 0/8 BROKEN)
Box 10 0.85   (iter 38 carryover 1.0 → 0.85, dispatcher shipped + canary 0%)
Box 11 0.85
Box 12 0.75
Box 13 0.75   (iter 38 carryover 0.85 → 0.75, Lighthouse perf still FAIL + Sprint U Cycle 1 73/94 violations)
Box 14 0.85   (iter 38 carryover 0.95 → 0.85, R7 canonical 3.6% UNCHANGED)
─────
Sum    11.25
```

Subtotal = 11.25/14 → normalize 10 = **8.04/10 raw**.

Bonus iter 39 attempts cumulative:
- A1 SSE backend + frontend (commits `18da487` + `223d1c6` + `3f3245d` + `e6fa25c`): **+0.10** (TTFB <500ms verified `e6fa25c` audit doc)
- A3 12-tool dispatcher MVP code (commit `0d545fb`): **+0.05** (code shipped, fire rate gated)
- A4 V2 cross-attention (commit `027d04f`): **0.0** (REVERTED, no contribution)
- A5 Voxtral STT migration audit (commit `ef85729`): **0.05** (audit-only, impl deferred)
- ADR-032 + ADR-033 (PROPOSED status, Andrea ratify pending): **+0.05** (design ready, not accepted)

Bonus iter 39 total: **+0.25** (vs iter 38 carryover bonus +0.30 attempted).

Raw total: 8.04 + 0.25 = **8.29**.

G45 mechanical cap applied:
- PDR §4 R5 latency rule TRIGGERED (latest R5 0/8 BROKEN + no valid iter 39 R5 PASS post-Onniscenza-revert + post-12-tool-deploy + post-SSE-wire). Cap 8.5 ceiling iter 38 carryover does NOT carry forward without re-bench.
- A10 Onnipotenza Deno port MVP shipped (12 cases) BUT canary 0% fire rate + R7 canonical 3.6% UNCHANGED → cap 8.5 ceiling rule still binds (ADR-032 acceptance criteria NOT met: R7 ≥95% target unverified).
- Lighthouse perf FAIL ≥90 (carries iter 38 honest cap −0.10).
- A14 codemod 200 violations (Andrea iter 21+ mandate) — iter 38 carryover claimed 14 TRUE shipped; Sprint U Cycle 1 reveals 73/94 lesson-paths still violate (different population, different scope but mandate NOT closed). −0.10 onesto.
- A15 94 esperimenti audit (Andrea iter 21+) — Phase 0 §8 spec exists 396 LOC NOT EXECUTED. −0.10 onesto.

8.29 − cap penalties (−0.10 Lighthouse −0.10 A14 −0.10 A15) = **7.99 → 8.0/10 G45 cap ONESTO**.

---

## §4 Iter 39 commits chain verified

`git log --oneline --all | grep -i "iter.39\|iter-39"` returned 24 commits. Listed top to bottom (most recent first):

| SHA | Author commit | Verified scope (file system + git show) |
|-----|---------------|------------------------------------------|
| `d152aa2` | fix(iter-39-systematic-debug): Edge v72 + gitignore bench output + Phase 0 docs | 9 hypotheses checked + Edge unlim-chat redeploy v72 (2026-05-02 12:28) + .gitignore +scripts/bench/output/ + Phase-0 docs commit |
| `8205fe4` | docs(iter-39-carryover): #20 Mac Mini HALT IGNORED investigation | doc-only |
| `430659a` | feat(iter-39-carryover): Vercel SSE LIVE + Sprint U Cycle 2 PRINCIPIO ZERO 100% | NOT verified standalone — narrative claim "Cycle 2 PZ 100%" needs Sprint U Cycle 2 audit cross-check (not requested) |
| `02b5c03` | docs(iter-39-A4-REGRESSION): V2 Onniscenza REVERTED to V1 | doc + secret env flip — VERIFIED matches `iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` §1 bench data + §3 revert command |
| `ed0ffc4` | docs(iter-39-ralph-CLOSE): final close audit non compiacente — 36 atoms PDR analysis + 5 ralph atoms LIVE status | doc-only |
| `f50248e` | fix(iter-39-A2-voice): hide manual mic button on e2e-bypass-preview | UI cosmetic |
| `1feda3c` | fix(iter-39-A3): surface dispatcher_results in response payload | unlim-chat/index.ts +7 LOC + 2 audit docs ~801 insertions; CANARY_DENO_DISPATCH_PERCENT reset to 0 per body |
| `0d545fb` | feat(iter-39-A3-OpenClaw-Deno): 12-tool server-safe dispatcher MVP per ADR-032 | `clawbot-dispatcher-deno.ts` NEW 286 LOC + 12 case statements verified |
| `ef85729` | feat(iter-39-A5-Voxtral-STT): voxtral-stt-client + unlim-stt migration per ADR-031 | code + audit shipped iter 39 — impl extent NOT verified deeply this audit (per ADR-031 9-cell matrix not exec'd) |
| `eb4a11b` | docs(iter-39-A4): Onniscenza V2 LIVE PROD canary + smoke audit | superseded by `02b5c03` regression revert audit; net iter 39 = REVERTED |
| `027d04f` | feat(iter-39-A4-Onniscenza-V2): cross-attention + 8-chunk budget per ADR-033 | `onniscenza-bridge.ts` `aggregateOnniscenzaV2` line 518 + V1/V2 selector unlim-chat/index.ts:391 verified |
| `e6fa25c` | docs(iter-39-A1): SSE LIVE PROD VERIFIED audit — first token <500ms confirmed | doc |
| `3f3245d` | feat(iter-39-A1-SSE-frontend): useGalileoChat SSE wire-up + typewriter animation | frontend wire-up |
| `e84a169` | feat(iter-39-ralph): 5 atoms partial — A1 SSE backend+frontend + A3+A4 ADRs + A2+A5 audits | meta-commit batch — file scope not verified beyond per-atom commits |
| `223d1c6` | feat(iter-39-A1-SSE): import callMistralChatStream into unlim-chat (wire branch iter 2) | unlim-chat/index.ts:43 + lines 591-684 verified SSE branch present |
| `18da487` | feat(iter-39-A1-SSE-backend): callMistralChatStream — Mistral SSE chat completions | mistral-client.ts addition (not directly read this audit) |
| `7dde802` | WIP on feature/sprint-u-iter7-home-3buttons-rotating-greeting | WIP only |
| `7a7ea60`/`8cfb6b2`/`69a2244`/`8ffb728`/`3c1dc8d` | iter-39 voice fixes (5 commits) | voice config / voice_id Andrea / hide mic button |
| `e265e74` | feat(iter-39): cap_words 60→150 + Onniscenza re-enabled — risposte più lunghe per orchestrazione RAG/Wiki/Glossario/contesto | unlim-chat config |
| `611a411` | ops(iter-39): HALT signal Mac Mini autonomous loop — Andrea explicit stop | ops |
| `a9755af` | feat(iter-39-mac-mini-handoff): Tier 1 cache LIVE v56 + R5 -64% lift + Mac Mini autonomous plan | iter 38 carryover roll-forward |

**Iter 39 scope summary**: 5 ralph atoms (A1 SSE backend+frontend LIVE, A2 voice mic UI fix, A3 12-tool dispatcher MVP shipped + dispatcher_results surface fix + canary reset 0%, A4 V2 cross-attention REVERTED to V1, A5 Voxtral STT migration shipped) + iter 38 carryover commits rolled forward + Phase 0 docs + Edge v72 systematic debug deploy.

**Edge Function deploy chain v50→v54→v55→v56→v72**: VERIFIED via `git log` + `d152aa2` body H9 ("Edge Function unlim-chat v71 stale → re-deploy v72") + commit `1feda3c` ("Smoke verified Edge Function v63 LIVE") + iter 38 carryover docs claim v54→v56. Continuity gap v56→v63 (between iter 38 carryover and `1feda3c`) — implicit increments via subsequent deploys. Final deployed version per `d152aa2`: **v72** (2026-05-02 12:28).

---

## §5 Inflation flags — narrative→reality drift

### Flag 1: Onniscenza V2 LIVE PROD canary smoke (commit `eb4a11b` 2026-05-01 §A4)

- **Narrative (CLAUDE.md iter 39 narrative inferred)**: Box 11 lift +0.05 (V2 cross-attention 5pp PZ V3 +5pp acceptance criteria)
- **Reality (`docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` §1)**: V2 measured PZ V3 93.2% vs V1 94.2% = **-1.0pp WORSE** + avg latency V2 2182ms vs V1 1607ms = **+36% slower**. ADR-033 §6 acceptance criteria target +5pp PZ V3 NOT met. Reverted via `ONNISCENZA_VERSION=v1` env flip.
- **Drift**: code commit `027d04f` (cross-attention impl), audit `eb4a11b` (LIVE PROD canary claim), regression audit `02b5c03` (REGRESSION confirmed) — three separate iter 39 commits chronicle the rise and fall. Net contribution to score = **0** (V2 reverted) but narrative attempts to monetize the architecture work as +0.05 box lift.
- **Cap impact**: Box 11 stays at iter 38 baseline 0.85, no iter 39 lift. Net **−0.05** vs narrative attempt.

### Flag 2: 12-tool Deno dispatcher MVP fire-rate

- **Narrative (handoff §3 + ADR-032 §3)**: "A10 Onnipotenza Deno port 12-tool subset" → Box 14 ceiling 1.0 + Sprint T close gate.
- **Reality**: `clawbot-dispatcher-deno.ts` exists 286 LOC + 12 case statements VERIFIED. BUT:
  - Commit `1feda3c` 2026-05-01 23:36 body explicitly: "Plus reset CANARY_DENO_DISPATCH_PERCENT=0 (default safe). A3 dispatcher code shipped LIVE BUT prod fire rate gated by L2 template router dominance (per iter 38 R7 audit canonical 3.6%). Real activation requires L2 scope reduce iter 40+ (ralph close caveat NO COMPIACENZA)."
  - Phase 0 §10 H8 reads `=5` post-`d152aa2` deploy 2026-05-02 12:30 (16h after `1feda3c` reset). One of the two sources is stale OR Andrea re-flipped to 5% post-revert; either way fire rate is 0-5%, not full prod.
  - R7 canonical UNCHANGED **3.6%** vs ≥80% target (Phase 0 §5).
  - L2 template router catch-all blocker (Sprint U Cycle 1 audit §1 BLOCKER #1, `clawbot-template-router.ts:121-153`) NOT addressed iter 39.
- **Drift**: Code shipped LIVE ≠ Production fire rate ≥80% R7 canonical. Acceptance criteria ADR-032 §6 NOT met.
- **Cap impact**: Box 10 stays at 0.85, NOT 1.0. Box 14 stays at 0.85, NOT 0.95-1.0. Net **−0.15** vs narrative.

### Flag 3: R5 latency 1607ms iter 38 carryover claim carry-forward

- **Narrative (iter 38 carryover §"R5 v56 PASS")**: avg 1607ms / p95 3380ms / PZ V3 94.2% — R5 latency cap REMOVED.
- **Reality (Phase 0 §3)**: latest R5 run 2026-05-02T07:28:58 = **0/8 BROKEN** (zero successful responses, "Failures: 8/8"). Last documented PASS 2026-05-01T07:43 (1607ms). Iter 39 commits between the PASS and the BROKEN run include cap_words 150 + 12-tool dispatcher + SSE wire + V2 cross-attention attempt + revert + Edge v72 deploy.
- **Drift**: cap removal claim iter 38 carryover relied on a single PASS that has not been re-confirmed after material code churn iter 39.
- **Cap impact**: PDR §4 R5 cap rule cannot stay removed without valid post-iter-39 re-bench. Cap 8.5 ceiling iter 38 carryover does not carry forward; falls back to 8.0. Net **−0.45** delta iter 38 carryover narrative 8.5 → 8.0 honest.

### Flag 4 (additional): A14 codemod "200 violations" framing

- **Narrative (CLAUDE.md iter 38 carryover §"A14 codemod 14 TRUE")**: ~14 TRUE UI/mascotte violations + ~180 narrative analogies preserved per Sense 2 Morfismo (volumi cartacei "tu generico" voice intentional).
- **Reality (Phase 0 §11 anti-pattern + Sprint U Cycle 1 audit §1 finding 2 + my grep)**: Sprint U Cycle 1 audit reports 73/94 lesson-paths singolare imperatives + 91/94 missing "Ragazzi," opener + 94/94 "studente" framing in unlimPrompts. My grep `grep -lE 'Premi |fai\b|clicca|inserisci|collega' src/data/lesson-paths/*.json | wc -l` = **89** (file-level count). My grep `grep -L "Ragazzi," src/data/lesson-paths/*.json | wc -l` = **94** (zero files contain literal "Ragazzi,").
- **Drift**: The "14 TRUE violations" + "180 narrative analogies preserved" framing is one defensible interpretation but DOES NOT close the 73/94 lesson-paths Sprint U Cycle 1 finding population. Iter 38 carryover narrative implies codemod closed the mandate; Sprint U Cycle 1 + iter 39 file-system reveals it didn't. Andrea iter 21+ mandate carryover open.
- **Cap impact**: −0.10 onesto (already counted in §3 cap mechanics).

---

## §6 R5 0/8 BROKEN root cause investigation (Phase 0 §3 follow-up)

**Phase 0 §3 latest R5 report** (`scripts/bench/output/r5-stress-report-2026-05-02T07-28-58-859Z.md`, 8 LOC full content):

```
# R5 Stress FAILURE — 2026-05-02T07-28-58-859Z

Zero successful responses against https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat.
Failures: 8/8

## Note
Fixture is 50-prompt SEED (full 50 pending ADR-011).
```

**Investigation (claims-only, no live re-run)**:

The runner is `scripts/bench/run-sprint-r5-stress.mjs` (referenced Phase 0 §3 + iter 8 audit). The "Failures: 8/8" implies the runner attempted only 8 prompts before giving up (early-fail threshold) OR fixture loaded only 8 prompts. Either way: 100% failure rate against prod endpoint.

Root cause hypotheses (ranked by likelihood):

1. **HIGH — Auth header drift**: iter 32 P0 SECURITY rotated `ELAB_API_KEY` (commit `aee48e2`). Each subsequent runner needs the **new** key. A runner using the **old** key would get 401/403 from prod. CLAUDE.md iter 32 §3 says "Supabase + Vercel env 3 envs + .env local + 3 docs leaked redact" — local `.env` should have new key, but a stale shell session running `node run-sprint-r5-stress.mjs` may have inherited old `ELAB_API_KEY` env.

2. **MEDIUM — Edge Function v72 cold start + temporal rate**: Commit `d152aa2` (2026-05-02 12:30) deployed v72. R5 0/8 BROKEN run is dated **2026-05-02 07:28** — i.e., **5 hours BEFORE** v72 deploy. So the BROKEN run was against v71 (per H9 finding). v71 was deployed 2026-05-01 21:33 (per H9). Between v71 deploy and 0/8 R5 run (~10h), other config changes may have applied (e.g., `ENABLE_SSE` toggle, env flag flips).

3. **LOW — Mistral provider outage**: 100% failure across 8 prompts is not random; could be Mistral provider 5xx during the run window. But the report does NOT capture HTTP status codes (8 LOC content only "Failures: 8/8") — runner appears to truncate failure detail.

4. **LOW — Fixture path mismatch**: ADR-011 mentions "50-prompt SEED fixture pending". If runner can't load fixture, it might fail every prompt.

**Recommendation iter 40 entrance**:
- Re-run R5 against v72 with verified `apikey + Authorization Bearer + X-Elab-Api-Key` headers.
- Capture HTTP status code per prompt (runner change: log status to `responses.jsonl` even on failure).
- If 0/8 persists: bisect by env flag (ENABLE_SSE off + ENABLE_INTENT_TOOLS_SCHEMA off + ONNISCENZA_VERSION=v1 + CANARY_DENO_DISPATCH_PERCENT=0) to isolate regression.

**Evidence file paths**:
- Latest BROKEN: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r5-stress-report-2026-05-02T07-28-58-859Z.md`
- Last PASS: `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r5-stress-report-2026-05-01T07-43-04-636Z.md`
- V2 measurement (50/50 success but regressed quality): `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r5-stress-report-2026-05-01T22-24-50-918Z.md`

---

## §7 Sprint U Cycle 1 L2 catch-all blocker independent verify

**Code site**: `supabase/functions/_shared/clawbot-template-router.ts:121-153` (read directly).

**Function shape verified**:

```ts
export function selectTemplate(query: string, context: SelectContext = {}): ClawBotTemplate | null {
  if (!query || typeof query !== 'string') return null;
  const tokens = new Set(tokenize(query));
  if (tokens.size === 0) return null;

  const threshold = context.threshold ?? 2;

  const scored: ScoredTemplate[] = TEMPLATES_L2.map(t => ({ template: t, score: scoreTemplate(t, tokens, context) }));
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score < threshold) return null;

  // Tie-breaker: if top two within 1 point, prefer category_hint match,
  // otherwise the more specific (longer description) wins.
  if (scored.length >= 2 && scored[1].score === best.score) {
    if (context.category_hint) {
      const hinted = scored.find(s => s.template.category === context.category_hint && s.score === best.score);
      if (hinted) return hinted.template;
    }
  }

  // Sprint U fix: lesson-explain templates are experiment-specific.
  // Only serve a lesson-explain template when the query's experimentId
  // exactly matches the template's own inputs.experimentId. All other
  // lesson-explain queries fall through to LLM+RAG (return null).
  if (best.template.category === 'lesson-explain' && context.experimentId !== undefined) {
    const tplExpId = (best.template.inputs as Record<string, unknown> | undefined)?.experimentId;
    if (tplExpId !== context.experimentId) return null;
  }

  return best.template;
}
```

**Independent verify**:

- The Sprint U fix at lines 144-150 ONLY rejects when `context.experimentId !== undefined` AND `tplExpId !== context.experimentId`.
- If `context.experimentId === undefined` (e.g., user query has no experiment context), the experiment-id reject branch is **bypassed** entirely.
- Default catch-all `L2-explain-led-blink` would still be returned for a generic lesson-explain query because it scores high enough to clear `threshold = 2` (e.g., a query containing "led" + "spiega" would match the LED blink template's keywords).
- Sprint U Cycle 1 `unlimverify` 20/20 cross-volume queries returned `template_id: L2-explain-led-blink`. This is consistent with the verified function body: queries that pass an `experimentId` matching the template's `inputs.experimentId` proceed; queries that don't pass an `experimentId` OR pass a non-matching one for a lesson-explain template fall through. The 20/20 result implies most cross-volume test queries either (a) don't pass experimentId at all (fallthrough doesn't trigger the reject), OR (b) the LED blink template is the ONLY experiment-bound lesson-explain template in `TEMPLATES_L2` (other lesson-explain templates would not have `inputs.experimentId` set and would always pass through).

**Hypothesis (b) confirmation**:

The Sprint U fix line 148 `tplExpId = best.template.inputs.experimentId` will be `undefined` for any L2 template that DOES NOT set `inputs.experimentId`. The check `tplExpId !== context.experimentId` then becomes `undefined !== <some value>` = `true`, triggering reject. So for templates WITHOUT `inputs.experimentId` set, the reject IS triggered if a context.experimentId is provided.

But if context.experimentId is `undefined` AND tplExpId is `undefined`, the outer `if` (line 145) `context.experimentId !== undefined` is FALSE — entire reject branch skipped. So lesson-explain templates without experimentId binding always fall through (reach `return best.template`).

**Conclusion**: BLOCKER CONFIRMED. The fix at lines 144-150 only narrows the catch-all when `context.experimentId` is provided AND the template happens to have `inputs.experimentId`. The 95%+ R7 fixture prompts don't pass `experimentId` (per Phase 0 §5 root cause caveat: "L2 template router short-circuits 95%+ of fixture prompts BEFORE Mistral function calling fires") so the catch-all dominates.

**Sprint U Cycle 2 recommendation**: rewrite reject logic at lines 144-150 to require `context.experimentId === tplExpId` (both defined and equal) for any lesson-explain template, falling through if either side is undefined.

---

## §8 ADR-032 + ADR-033 status verify

### ADR-032 — Onnipotenza Deno Port 12-Tool Server-Safe Subset

- File: `docs/adrs/ADR-032-onnipotenza-deno-12-tool-server-safe.md`
- Status header line 3: **"PROPOSED (Andrea ratify queue iter 40+)"**
- Date: 2026-05-01
- Sprint: T iter 39 ralph (atom A3)
- Supersedes: ADR-028 §7 partial
- Depends on: ADR-028 §14 + ADR-030
- 12-tool subset table verified — 12 tools listed (some marked "NOT server-safe → SURFACE to browser" e.g. captureScreenshot tool 3).

**Verify status**: PROPOSED, not ACCEPTED. Iter 40+ ratify required.

### ADR-033 — Onniscenza V2 Cross-Attention 8-Chunk Budget

- File: `docs/adrs/ADR-033-onniscenza-v2-cross-attention-budget.md`
- Status header line 3: **"PROPOSED (Andrea ratify queue iter 40+)"**
- Date: 2026-05-01
- Sprint: T iter 39 ralph (atom A4)
- Depends on: ADR-023 (Onniscenza 7-layer aggregator)
- §3 Decision describes cross-attention scoring + layer-specific weight multipliers + experiment-anchor boost +0.15

**Verify status**: PROPOSED, not ACCEPTED. AND superseded by `iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` §3 revert: V2 reverted prod via `ONNISCENZA_VERSION=v1` env. ADR-033 §6 acceptance criteria target +5pp PZ V3 NOT met (-1.0pp measured). ADR-033 effectively obsolete iter 39 close — needs re-design before iter 40+ ratify.

---

## §9 Anti-pattern non compiacente — claims that MUST NOT be made iter 40+ Phase 2 onward

Building on Phase 0 §11 anti-patterns + iter 39 evidence, the following claims are FORBIDDEN until file-system + bench re-verification:

1. **NO claim "Sprint T iter 39 close 8.45/10 ONESTO G45 cap"** — Independent Opus review delta −0.45, justified score 8.0/10 only.
2. **NO claim "Onniscenza V2 cross-attention LIVE prod"** — REVERTED to V1, ADR-033 acceptance criteria NOT met (−1.0pp PZ V3 measured).
3. **NO claim "12-tool Deno dispatcher LIVE prod fire-rate"** — Code shipped 286 LOC + 12 cases, BUT canary 0-5% + L2 template router dominates 95% of fixture (R7 canonical 3.6% UNCHANGED FAIL). Real fire-rate ≥80% requires L2 scope reduce iter 40+.
4. **NO claim "R5 latency cap REMOVED iter 39"** — Latest R5 0/8 BROKEN. Last PASS 2026-05-01 pre-iter-39-major-commits. Re-bench mandatory v72 post-revert.
5. **NO claim "INTENT canonical ≥80% achievable iter 39"** — R7 canonical 3.6% UNCHANGED, L2 catch-all blocker not fixed.
6. **NO claim "Lighthouse perf ≥90 achieved iter 39"** — chatbot-only 0.26 + easter-modal 0.23 carry iter 38, no iter 39 perf optim commit.
7. **NO claim "94 esperimenti audit closed"** — Spec exists 396 LOC NOT EXECUTED (Phase 0 §8). Andrea iter 21+ mandate carryover open.
8. **NO claim "A14 codemod 200 violations closed"** — Sprint U Cycle 1 finds 73/94 lesson-paths still violate singolare. iter 38 carryover "14 TRUE" framing addresses different population.
9. **NO claim "ADR-032 ACCEPTED" or "ADR-033 ACCEPTED"** — Both PROPOSED iter 40+ ratify queue. ADR-033 effectively obsolete post-revert.
10. **NO claim "Build PASS pre-commit verified iter 39 close"** — Phase 0 §2 DEFERRED. Vercel deploy is indirect proxy, not local verify on HEAD `3ac4aec`.
11. **NO claim "vitest delta lift iter 39"** — baseline 13474 PRESERVED iter 39 = ZERO REGRESSION (good), but no NEW tests claim either.
12. **NO claim "Edge Function unlim-chat smoke verified iter 39 close end-to-end"** — Smoke claims appear in commits `1feda3c` (v63), `d152aa2` (v72), but full bench re-run R5+R6+R7 against v72 NOT shipped iter 39.
13. **NO claim "Phase 0 §3 R5 0/8 BROKEN flag mitigated"** — Investigation only, root cause hypothesis not validated by re-run.
14. **NO inflate "Sprint T close iter 41-43 path achievable in iter 39 narrative"** — A10 + A14 + A15 + canary 100% rollout + R7 ≥95% + Lighthouse perf optim + Sprint U Cycle 2 ALL pending. Realistic Sprint T close = iter 41-43 at minimum, conditional Andrea Opus indipendente review G45 mandate.
15. **NO claim "Pattern S race-cond fix VALIDATED Nth iter consecutive"** as standalone score lift — race-cond fix is process discipline, not deliverable score. Box scores derive from prod-verified outcomes, not coordination patterns.

---

## §10 Score finale + recommendation Sprint T close path

### Independent score finale ONESTO: **8.0/10**

**Cap binding**: G45 mechanical PDR §4 (R5 latency 8.0 baseline + Lighthouse perf still FAIL + A14 + A15 onesti penalties). Even if iter 39 atoms A1 + A3 are real prod-LIVE deliverables (SSE wire confirmed, dispatcher MVP shipped), the production fire-rate is gated at L2 template router dominance — making the deliverables architectural-only.

**Delta vs claimed 8.45**: −0.45.

### Sprint T close realistic path iter 41-43

Per Phase 0 §3 R5 BROKEN + Phase 0 §5 R7 3.6% + Phase 0 §6 Lighthouse 26+23 + Phase 0 §8 94 esperimenti spec NOT executed + Sprint U Cycle 1 finding 1-7, the Sprint T close target 9.5/10 ONESTO is **NOT achievable iter 40 single-shot**. Ordered prerequisites:

| Iter | Prerequisite | Effort | Cap delta target |
|------|--------------|--------|------------------|
| 40 | R5 v72 re-bench (post-revert post-12-tool-deploy) | ~1h Tester-2 | restore Box 9 0.85 → 1.0 if PASS, +0.15 |
| 40 | L2 template router scope reduce (Sprint U Cycle 2 P0.1 BLOCKER fix) | ~4h Maker-1 | restore Box 14 lift toward 1.0 + R7 ≥80% projection |
| 40-41 | R7 ≥80% canonical re-bench post-L2-fix + canary CANARY_DENO_DISPATCH_PERCENT=100 | ~2h Tester-2 | Box 14 0.85 → 1.0, +0.15 |
| 41 | Voyage re-ingest with page metadata (R6 unblock) | ~50min, ~$1 | Box 6 0.85 → 1.0, +0.15 |
| 41 | A6 Lighthouse perf optim (lazy mount react-pdf 407KB + mammoth 70KB + bundle reduce) | ~3h WebDesigner-1 | Box 13 0.75 → 0.90, +0.15 |
| 42 | A15 94 esperimenti Playwright UNO PER UNO sweep | ~3h headless Tester-1 | Sprint T close gate close, +0.10 |
| 42 | Sprint U Cycle 2 P1.1 codemod 73 lesson-paths singolare→plurale + 94/94 docente-framing unlimPrompts | ~4h Maker-3 | Sprint T close gate close, +0.10 |
| 43 | A10 ADR-032 ACCEPTED + canary 100% rollout per ADR-028 §7 | ~24-48h soak | Sprint T close gate close, +0.05 |
| 43 | Andrea Opus indipendente review G45 mandate Sprint T close 9.5/10 ratify | 1 session | gate close |

**Cumulative iter 43 projection**: 8.0 + 0.15 (R5 PASS) + 0.15 (Box 14 lift L2 fix + R7 ≥80%) + 0.15 (Box 6 R6 unblock) + 0.15 (Lighthouse) + 0.10 (94 esperimenti audit closed) + 0.10 (Sprint U Cycle 2 codemod) + 0.05 (canary 100%) = **9.85 raw → cap 9.5 ONESTO Sprint T close**.

This requires **3 iterations minimum (40-42-43)** of focused execution, no inflation, with Andrea Opus indipendente review at iter 43 close.

### Anti-inflation FERREA recap

- Score 8.0 reflects iter 39 ralph atoms shipping ARCHITECTURE without PRODUCTION fire-rate verify.
- Iter 40+ MUST close measurement gaps (R5 re-bench, R7 re-bench, R6 re-bench post-Voyage) BEFORE claiming any box lift.
- ADR-032 + ADR-033 both PROPOSED — Andrea ratify queue iter 40+ explicit.
- ADR-033 effectively obsolete post-revert iter 39 — needs re-design.
- Sprint T close 9.5 NOT achievable iter 39, NOT achievable iter 40 single-shot. Realistic iter 41-43 with concrete prerequisites listed above.

---

## §11 Files cited (canonical paths)

- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/PHASE-0-discovery-2026-05-02.md` (343 LOC)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/PHASE-0-baseline-2026-05-02.md` (370 LOC)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/CLAUDE.md` (1801 LOC, sprint history iter 36/37/38 + carryover + Sprint U Cycle 1)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/adrs/ADR-032-onnipotenza-deno-12-tool-server-safe.md` (PROPOSED iter 40+ ratify)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/adrs/ADR-033-onniscenza-v2-cross-attention-budget.md` (PROPOSED, V2 reverted)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/iter-39-A4-Onniscenza-V2-REGRESSION-revert.md` (V2 -1.0pp PZ V3 + 36% slower → REVERTED)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/iter-39-A4-Onniscenza-V2-canary-LIVE.md` (pre-revert audit)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/clawbot-dispatcher-deno.ts` (286 LOC, 12 cases)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/clawbot-template-router.ts` (selectTemplate lines 121-153 + Sprint U fix lines 144-150)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/_shared/onniscenza-bridge.ts` (592 LOC, V1 line 299 + V2 line 518)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/supabase/functions/unlim-chat/index.ts` (1010 LOC, SSE 591-684 + V1/V2 selector 391 + canary 848)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/openclaw/tools-registry.ts` (57 ToolSpec verified)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r5-stress-report-2026-05-02T07-28-58-859Z.md` (8 LOC, 0/8 BROKEN)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r5-stress-report-2026-05-01T22-24-50-918Z.md` (V2 measurement, regressed 2182ms)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r5-stress-report-2026-05-01T07-43-04-636Z.md` (last PASS 1607ms)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r6-stress-report-2026-04-30T18-53-28-013Z.md` (recall@5 0.067)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/scripts/bench/output/r7-stress-report-2026-05-01T07-43-03-043Z.md` (canonical 3.6%)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/iter-38-lighthouse-chatbot-only.json` (perf 0.26)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/iter-38-lighthouse-easter-modal.json` (perf 0.23)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/docs/audits/iter-39-rag-metadata-backfill-coverage.md` (page=0% / 2061 chunks)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/tests/e2e/29-92-esperimenti-audit.spec.js` (396 LOC NOT executed)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/automa/baseline-tests.txt` (13474)
- `/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder/src/data/lesson-paths/` (94 JSON, 89 imperative violations, 0 with literal "Ragazzi,")

---

## §12 Methodology integrity statement

This audit was performed context-zero with NO inherited narrative trust. All claims verified via:
- File system existence + size + LOC checks (`ls -la`, `wc -l`)
- Pattern grep counts (`grep -cE`, `grep -lE`, `grep -L`)
- Git log analysis (`git log --oneline`, `git show --stat`)
- Direct file content reads (Read tool, surface-level scan + critical sections deep read)
- Phase 0 measured baseline cross-reference (Subagent 2 measured live)

**No live Edge Function calls executed** (env not provisioned this session). **No local build re-run** (heavy ~14min deferred). **No Vercel deploy ID independent verify** (external dep).

Where claims could not be independently verified (e.g., Vercel deploy `dpl_3Y2pUvaffWJc3jXdoKporuwiykgY`, Edge Function deployed v72 vs git-log inference), audit explicitly marks "claim only, external dep" or "git-log proxy" without monetizing in score.

The independent score 8.0/10 reflects a **conservative G45 anti-inflation discipline**: when narrative claims production behavior changes (R5 latency lift, R7 canonical lift, Lighthouse perf optim, V2 cross-attention LIVE) but Phase 0 measured baseline shows otherwise, narrative claims are rejected. Score lifts require measurement, not architecture.

**End of independent G45 Opus audit. Anti-inflation FERREA enforced. Sprint T close 9.5 NOT achievable iter 39, realistic iter 41-43 prerequisite path documented.**
