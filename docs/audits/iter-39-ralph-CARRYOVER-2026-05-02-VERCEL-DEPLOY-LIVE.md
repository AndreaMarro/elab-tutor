# Iter 39 ralph carryover — Vercel A2 deploy LIVE prod 2026-05-02

**Date**: 2026-05-02 ~08:14 CEST
**Status**: A2 mic-hide commit `f50248e` + voice clone fix `8ffb728` LIVE prod via Vercel deploy `dpl_C4pgozBjqxrzPv1jqHJiRnQgyrox`
**Branch**: `e2e-bypass-preview` HEAD `02b5c03` (palette-clean verified)

---

## §1 Deploy chain

```
1. Build local: npm run build → 1m 1s PASS, dist 83MB, 32 PWA precache 4826KB
2. Vercel build: npx vercel build --prod → .vercel/output 83MB regenerated
3. Vercel deploy prebuilt: npx vercel deploy --prebuilt --prod --yes
   → URL: https://elab-tutor-7wrx2nb76-andreas-projects-6d4e9791.vercel.app
   → ID: dpl_C4pgozBjqxrzPv1jqHJiRnQgyrox
   → target: production (NOT preview)
   → status: ● Ready
4. Promote alias:
   → www.elabtutor.school → elab-tutor-7wrx2nb76 (3s)
   → elabtutor.school → elab-tutor-7wrx2nb76 (3s)
5. Smoke verify:
   → curl https://www.elabtutor.school → HTTP/2 200, last-modified 06:16:04 GMT (08:16 CEST)
   → bundle: src="/assets/index-C9P7cha0.js"
   → apex 307 redirect → https://www.elabtutor.school/
```

---

## §2 Root cause `--archive=tgz` 1.7GB upload hang

`.vercelignore` originale escludeva solo modelli ML / nanobot / docs/plans. Tarball includeva:
- `node_modules/` 419MB
- `.git/` 645MB
- `automa/` 23MB (heartbeat + benchmark + tasks)
- `scripts/bench/output/` 13MB (R5+R6+R7 historical reports)
- `docs/audits/` + `docs/handoff/` + `docs/research/`
- worktrees `elab-builder-*/` (potenzialmente)

Totale ~1.7GB tarball compressed. Process npx vercel hang silenzioso (tail -20 buffered fino a EOF, mai fired).

**Fix permanente** committed:

```
.vercelignore +14 entries:
  node_modules/ + .git/ + automa/ + scripts/bench/output/
  + docs/audits/ + docs/handoff/ + docs/research/
  + tests/ + playwright-report/ + test-results/
  + *.log + .cache/ + .next/ + coverage/ + elab-builder-*/
```

Pattern raccomandato `vercel build` + `vercel deploy --prebuilt` carica solo `.vercel/output` (83MB) bypassa upload sorgente.

---

## §3 Iter 39 5-atom status post Vercel deploy

| Atom | Code shipped | Edge Function LIVE | Frontend Vercel LIVE | Quality verified |
|------|--------------|---------------------|----------------------|------------------|
| A1 SSE streaming | ✓ commits `18da487` + `3f3245d` | ✓ v50+ | ✓ post 08:14 deploy (VITE_ENABLE_SSE flag pending) | ⚠️ TTFB perceived <500ms target NOT measured |
| A2 Voice clone fix + mic hide | ✓ commits `8ffb728` + `f50248e` + `7a7ea60` | ✓ Voxtral primary v54+ | ✓ **LIVE this carryover** | ⚠️ browser smoke playback Andrea voice pending |
| A3 OpenClaw 12-tool dispatcher | ✓ commit `1feda3c` | ✓ canary `CANARY_DENO_DISPATCH_PERCENT=0` default | N/A server-side | ⚠️ canary 5% activation pending |
| A4 Onniscenza V2 cross-attention | ✓ commit `027d04f` | ⚠️ V1 default (V2 REVERTED post-bench) | N/A server-side | ❌ V2 design REJECTED (-1.0pp PZ V3 + 36% slower vs V1) |
| A5 Voxtral STT migration | ✓ commit `ef85729` | ✓ STT_PROVIDER=cf-whisper default | N/A server-side | ⚠️ voxtral activation pending |

**Resoconto onesto**:
- 5/5 code shipped origin
- 4/5 LIVE prod Edge Function (A1+A2+A3 env-gated+A4 V1+A5 env-gated)
- 1/5 Vercel frontend LIVE prod **questo carryover** (A2 mic-hide + voice fix arrivati al browser)
- 1/5 atom design REJECTED (A4 V2 → V2.1 redesign iter 41+)
- Canaries A3+A5 server activation pendente Andrea ratify queue (handoff §5)

---

## §4 Score iter 39 ricalibrato

Pre-carryover baseline: **8.0/10 ONESTO** (G45 cap iter 39 ralph close `iter-39-ralph-loop-FINAL-CLOSE-non-compiacente.md`).

Carryover delta:
- +0.2 Vercel A2 LIVE (1/5 frontend atom activated browser-side)
- +0.0 A4 V2 rejected (no lift, neutral)
- −0.0 canaries A3+A5 still default (no lift, no regression)

**Iter 39 carryover post-Vercel close: 8.2/10 ONESTO** (G45 cap, +0.2 vs ralph close baseline).

---

## §5 Iter 40+ priorities P0

Da `docs/handoff/2026-05-02-iter-40-andrea-ratify-queue-paste-ready.md`:
1. Set Vercel env `VITE_ENABLE_SSE=true` (frontend SSE wire-up A1 activation)
2. Activate canary `STT_PROVIDER=voxtral` (A5 server activation)
3. Activate canary `CANARY_DENO_DISPATCH_PERCENT=5` (A3 OpenClaw 12-tool soak)
4. Browser smoke verify Andrea voice clone playback
5. R7 200-prompt re-bench post canary activation
6. A4 V2.1 redesign iter 41+ (skip layer weights, only experiment-anchor + kit-mention boosts)
7. Andrea Opus indipendente review G45 mandate (separate session)
8. 9-cell STT matrix verify Tester-4
9. Lighthouse perf optim ≥90 (Mac Mini Task 2)
10. 94 esperimenti Playwright execution (Mac Mini Task 3)

---

## §6 Bundle warning chunks > 1000KB conferma Lighthouse FAIL iter 38

```
LavagnaShell-hxrsv_4x.js     2,366 KB │ gzip: 1,108 KB
index-uDcMhtLe.js            2,245 KB │ gzip: 1,057 KB
index-DLs946_r.js            2,189 KB │ gzip: 1,007 KB
react-pdf-COnKCILs.js        1,911 KB │ gzip:   622 KB
NewElabSimulator-DtXA3VQP.js 1,315 KB │ gzip:   594 KB
```

Lighthouse perf 26/23 FAIL ≥90 target iter 38 atom A6 conferma deploy. Mac Mini Task 2 (Lighthouse optim 3h) priorità P0 iter 41+ post atom A1+A2+A3+A4+A5 ratify completion.

---

## §7 NO COMPIACENZA — onesta finale carryover

- ✅ Vercel deploy 1.7GB hang root-caused + fixed permanent `.vercelignore` 14 entries
- ✅ Production alias www + apex correctly assigned new deploy ID
- ✅ HTTP/2 200 + last-modified fresh + bundle hash sync
- ❌ A4 V2 NOT recovered (design REJECTED post-bench, V2.1 redesign iter 41+)
- ❌ Canaries A3+A5 NOT activated (Andrea ratify queue pending)
- ❌ Browser smoke voice playback NOT verified (need Chrome devtools session Andrea)
- ❌ R5+R7 post-Vercel re-bench NOT executed (env req, defer iter 40+)
- ❌ A1 SSE perceived TTFB <500ms NOT measured (defer iter 40+ post VITE_ENABLE_SSE=true Vercel env)

**Sprint T close 9.5/10 path**: iter 41-43 conditional Andrea ratify queue + 4/5 atoms LIVE activated + Andrea Opus G45 review + Lighthouse perf + 94 esperimenti audit + Voyage re-ingest + Davide ADR-027.

---

**Files this carryover**:
- `.vercelignore` updated +14 entries
- `dist/` regenerated 1m 1s 83MB 32 precache
- `.vercel/output/` regenerated 83MB
- `https://www.elabtutor.school` LIVE pointing `dpl_C4pgozBjqxrzPv1jqHJiRnQgyrox`
- `docs/audits/iter-39-ralph-CARRYOVER-2026-05-02-VERCEL-DEPLOY-LIVE.md` (this doc)
