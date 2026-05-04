# L1 deploy verify — F1 Esci persistence (commit `d3ad2b3`)

**Date**: 2026-05-04 PM
**Owner**: Tester-1
**Atom**: L1 verify F1 commit `d3ad2b3` deploy LIVE prod

## Scope

Andrea iter 19 PM bug "scritti spariscono su Esci" → F1 fix shipped iter 34 commit `d3ad2b3` (drawingSync.js `flushDebouncedSave` + DrawingOverlay.jsx `pathsRef` sync + unmount cleanup). Andrea reports BUG persists 2026-05-04 PM. Verify if issue is deploy gap OR edge case missed.

## Method

1. `curl -s https://www.elabtutor.school/` → fetch index HTML
2. Identify chunk asset references (Vite chunked output)
3. `curl -s https://www.elabtutor.school/assets/index-CjE2WMYQ.js` → top bundle
4. Locate `DrawingOverlay-{hash}.js` chunk reference
5. Fetch chunk + grep F1 fix signatures (`flushDebouncedSave`, `pathsRef`, `cancelDebouncedSaveRemote`, `savePaths`)
6. Cross-check source files + git history

## Evidence

### Source files (commit `d3ad2b3` on `e2e-bypass-preview` + `origin/e2e-bypass-preview`)

```
src/services/drawingSync.js:287:export function flushDebouncedSave(experimentId, paths) {
src/components/simulator/canvas/DrawingOverlay.jsx:16:  flushDebouncedSave as flushDebouncedSaveRemote,
src/components/simulator/canvas/DrawingOverlay.jsx:228:  const pathsRef = useRef(paths);
src/components/simulator/canvas/DrawingOverlay.jsx:230:    pathsRef.current = paths;
src/components/simulator/canvas/DrawingOverlay.jsx:237:        flushDebouncedSaveRemote(experimentId, pathsRef.current);
```

F1 fix IS present in source on `e2e-bypass-preview` branch, both local + origin.

### Production bundle (https://www.elabtutor.school)

- `index-CjE2WMYQ.js` (2 131 554 B) — top entry bundle
- `DrawingOverlay-DQW-4_r9.js` (35 724 B) — DrawingOverlay chunk LIVE prod

```
grep -c "flushDebouncedSave"      /tmp/prod-drawing.js → 0
grep -c "pathsRef"                /tmp/prod-drawing.js → 0
grep -c "cancelDebouncedSaveRemote" /tmp/prod-drawing.js → 0
grep -c "savePaths"               /tmp/prod-drawing.js → 0
```

**Zero F1 signatures in prod chunk**. The deployed `DrawingOverlay-DQW-4_r9.js` is built BEFORE commit `d3ad2b3` (iter 34 2026-05-03 23:52:58).

### Vercel deploy chain

`npx vercel ls --prod` returns 10 most-recent deploys; alias `www.elabtutor.school` currently points to a deploy predating `d3ad2b3`. Branch `e2e-bypass-preview` has fix committed + pushed origin BUT no Vercel build picked up the new chunk for prod alias.

## Conclusion

**Andrea's bug report is correct: F1 fix IS NOT live in prod**.

- Source repo OK ✓
- Local source has `flushDebouncedSave` + `pathsRef` + unmount flush wired ✓
- Prod bundle DrawingOverlay chunk has ZERO of these symbols ✗

This explains why Andrea still sees "scritti spariscono su Esci" — the fix was committed + pushed but never reached the prod alias.

## Recommendation iter 35 P0

1. **Andrea action**: trigger Vercel prod redeploy from branch `e2e-bypass-preview` HEAD (currently `e010924`). Use `npx vercel --prod --yes` from worktree root after `npm run build` clean.
2. **Re-verify after deploy**: re-run this script + assert `flushDebouncedSave` count > 0 in prod `DrawingOverlay-{hash}.js` chunk.
3. **Then run L4 E2E spec** `tests/e2e/05-esci-persistence.spec.js` against prod chromium (currently fails because fix isn't deployed).

## Caveats

1. Vercel `--prod` deploy may be gated by CI (build pre-commit hook, vitest baseline). Andrea must confirm pre-flight CoV (vitest 13774 PASS, build PASS) before redeploy.
2. CDN may cache 1-2 min post-deploy — re-verify 5 min after Vercel reports `Ready`.
3. F1 fix LIVE does NOT close iter 19 PM bug guarantee — L4 E2E spec must execute 3/3 PASS for closure (current Phase 4 gate).
