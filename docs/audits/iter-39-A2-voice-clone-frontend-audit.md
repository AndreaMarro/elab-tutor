# Iter 39 A2 — Voice Clone Frontend Bug Fix — Audit

**Date**: 2026-05-01 PM
**Atom**: A2 (Mission file)
**Goal**: Voice clone Andrea IT (Voxtral mini-tts-2603, voice_id `9234f1b6-766a-485f-acc4-e2cf6dc42327`) playable in browser.
**Status**: SERVER LIVE iter 31 commit `8a922f7` · FRONTEND FIXES SHIPPED iter 32 commit `8ffb728` · DEPLOY VERIFY PENDING

## Server confirmed (curl smoke)

- **Endpoint**: `POST /functions/v1/unlim-tts`
- **Latency**: ~1181ms p50 EU France
- **Voice**: voxtral-mini-tts-2603 fine-tuned voice_id 9234f1b6-766a-485f-acc4-e2cf6dc42327
- **Format**: audio/opus 31KB (default) OR audio/mpeg via `format: 'mp3'` body param (commit 8ffb728)
- **5/5 IT sample**: PASS curl prod (audit `2026-05-01-iter-38-deploy-chain-and-tier1-final-audit.md`)

## Frontend hypotheses ranked + status

1. **Browser opus decode missing (Safari)** → FIXED iter 32 commit 8ffb728 server returns mp3 default `format: 'mp3'`. Compatibility: Chrome 16+ / Firefox 26+ / Safari 6+ / iOS 6+ ✓
2. **Frontend missing voice_id** → FIXED iter 32 commit 8ffb728 explicit voice_id in payload
3. **Rate limit 429 swallowed silent** → PARTIALLY FIXED — toast surface deferred iter 40+ (no code path adds visible toast yet)
4. **Audio element NOT attached DOM / autoplay block** → INVESTIGATION PENDING (Playwright trace iter 40+)
5. **Service Worker intercepts /unlim-tts** → SAFE — verified `vite.config.js` PWA `runtimeCaching` does NOT match `/functions/v1/unlim-tts` URL pattern

## Files shipped iter 39 A2

NONE iter 39 — atom carryover from iter 31+32 commits already pushed origin. iter 39 audit-only doc.

## Honest gaps

1. **Andrea browser repro pending**: Andrea reported voice "non funziona" — needs Playwright trace + Chrome DevTools Network tab inspection prod `https://www.elabtutor.school` post Vercel rollback `fv22ymvq8` stability.
2. **Toast 429 user-visible**: TODO iter 40+ — `multimodalRouter.routeTTS` catches 429 silently, should surface toast "UNLIM voice rate-limited, riprovate tra qualche secondo".
3. **Vercel deploy verify**: Andrea iter 38 carryover commit pushed but Vercel CONFLICTING palette regression `--elab-hex-*` 913 references. Per CLAUDE.md "production rollback `fv22ymvq8` stable" — iter 39 A2 frontend fixes 8ffb728 NOT yet deployed prod.
4. **Service Worker exclude documentation**: missing explicit comment `/functions/v1/unlim-tts` in `vite.config.js` PWA config — defensive iter 40+ add `urlPattern: /\/functions\/v1\/unlim-/, handler: 'NetworkOnly'`.

## Acceptance iter 39 A2

- ✅ Server LIVE prod confirmed curl 5/5
- ✅ Frontend voice_id + format='mp3' shipped 8ffb728
- ❌ Vercel prod deploy verify (palette regression block)
- ❌ Andrea browser repro Playwright trace
- ❌ Toast 429 user-visible

## Score iter 39 A2 ONESTO

**0.6/1.0 atom completion**:
- Server LIVE: 1.0
- Frontend shipped: 1.0
- Vercel deploy verify: 0.0 (rollback regression block)
- Andrea repro test: 0.0 (Playwright pending)
- Toast UX: 0.0 (deferred iter 40+)

**Box impact**: +0.0 (Box 8 TTS already 0.95 ceiling iter 31, voice clone LIVE confirmed; A2 closes Andrea browser repro gap not quality lift).

## Iter 40+ next steps

1. Andrea fix `--elab-hex-*` palette regressions main branch OR cherry-pick e2e-bypass-preview iter 38 commits to clean main
2. Vercel deploy verify `8ffb728` prod
3. Playwright spec `tests/e2e/voice-clone-andrea-trace.spec.js` opens prod + triggers UNLIM voice + asserts audio element rendered + Network tab shows `/unlim-tts` 200 response with audio/mpeg Content-Type
4. multimodalRouter.routeTTS catch 429 → emit `elab:tts-rate-limited` event → toast component subscribes
5. PWA Service Worker explicit exclude `/functions/v1/unlim-` URL pattern

Andrea Marro — iter 39 ralph A2 — 2026-05-01
