# Iter 39 A5 — Voxtral STT Continuous Migration — Audit

**Date**: 2026-05-01 PM
**Atom**: A5 (Mission file)
**Goal**: Replace `webkitSpeechRecognition` (Chrome/Edge only) + CF Whisper Turbo server STT with Voxtral Transcribe 2 server-side migration (Safari/iOS support + Italian K-12 4% WER).
**Status**: ADR-031 DESIGN COMPLETE iter 38 · IMPLEMENTATION DEFERRED iter 40+
**Score impact projected**: +0.1 ONESTO conditional Voxtral STT client + Safari/iOS frontend + 9-cell matrix PASS

## Cross-refs
- **ADR-031** `docs/adrs/ADR-031-stt-migration-voxtral-transcribe-2.md` (270 LOC iter 38 design)
- **ADR-029** Mistral routing 70/20/10 conservative (iter 37)
- **ADR-030** Mistral function calling INTENT canonical (iter 38)
- **Iter 29 TTS** `voxtral-client.ts` sibling pattern (Voxtral mini-tts-2603 LIVE prod iter 31)
- **Iter 32 STT** `cloudflare-client.ts` incumbent (3-shape adaptive handler iter 37)

## Current chain status

### Frontend (`src/services/wakeWord.js`)
- **Chrome/Edge**: `webkitSpeechRecognition` (browser-native, no server cost) ✓
- **Safari**: webkitSpeechRecognition exists but unstable iOS 14+ (mic permission flaky)
- **iOS**: webkitSpeechRecognition NOT supported in WebView (Capacitor / standalone)
- **Firefox**: NOT supported (no `SpeechRecognition` API)

### Server (`supabase/functions/unlim-stt/index.ts`)
- **CF Whisper Turbo** `@cf/openai/whisper-large-v3-turbo`
- Latency: 1071-2200ms (CF Workers AI endpoint)
- WER Italian: ~8-12% (English-trained model + Italian K-12 vocabulary)
- Iter 32 fix: 3-shape adaptive input handler (multipart + JSON + raw binary)
- Iter 37 fix: dual-path base64-json primary + raw-binary fallback on 4xx

### Voxtral Transcribe 2 target
- **Mistral La Plateforme** `https://api.mistral.ai/v1/audio/transcriptions`
- Model: `voxtral-mini-transcribe-2603` (sibling to TTS `voxtral-mini-tts-2603`)
- Pricing: $0.003/min (estimated)
- WER Italian: ~4% FLEURS K-12 benchmark (per Mistral docs)
- Latency target: <500ms (vs CF 1071-2200ms = -55% to -77%)
- GDPR: EU France hosted (clean stack 100% Mistral primary)

## Files iter 39 status

### Shipped iter 39
NONE — A5 is design + audit only iter 39. ADR-031 already exists iter 38.

### Pending iter 40+ implementation
- NEW `supabase/functions/_shared/voxtral-stt-client.ts` (~250 LOC, REST API client)
  - `transcribeVoxtral(audioBuffer, {language, model})` → text
  - Defensive timeout + retry + 4xx 5xx handling
- MODIFY `supabase/functions/unlim-stt/index.ts`:
  - Voxtral primary + CF Whisper fallback (gradual migration safety per ADR-031)
  - Env flag `STT_PROVIDER=voxtral|cf-whisper|hybrid`
  - Hybrid mode: Voxtral primary, CF Whisper fallback on 5xx
- MODIFY `src/services/wakeWord.js`:
  - Detect Safari/iOS via UA sniff `/iPhone|iPad|iPod/.test(navigator.userAgent)`
  - Fallback path: `MediaRecorder` API + chunk uploads to `/unlim-stt` Voxtral
  - Continuous mode: 5s rolling window + VAD trigger
- NEW `tests/unit/services/wakeWord-safari-fallback.test.js` (~10 tests)
- NEW `tests/integration/voxtral-stt-9cell-matrix.test.js` (~9 cells: Chrome/Safari/iOS × Italian/English/Mixed)

## Acceptance criteria iter 40+

- ✅ ADR-031 design shipped iter 38
- ❌ `voxtral-stt-client.ts` impl
- ❌ `unlim-stt/index.ts` Voxtral primary + CF fallback
- ❌ `wakeWord.js` Safari/iOS detect + MediaRecorder fallback
- ❌ Tester-4 9-cell matrix PASS (Voxtral 9/9 baseline)
- ❌ Latency p95 <500ms verify
- ❌ WER Italian ≤6% measured (target ≤4% FLEURS)

## Honest gaps iter 39

1. **Implementation NOT started iter 39**: ADR-031 design complete iter 38 + atom A5 audit-only iter 39.
2. **Voxtral Transcribe 2 model availability TBD**: Mistral docs reference but model card not yet GA at iter 38 time. Iter 40+ verify Mistral model registry.
3. **Migration safety**: hybrid mode mandatory iter 40+ entry — never single-path Voxtral on Day 1 (CF Whisper fallback retained ≥30 days).
4. **Cost projection**: $0.003/min × ~50 min/student/day × 30 days × 100 students = ~$450/mo per 100 active students — affordable but worth Voyage-style cost discipline doc.
5. **Voice activity detection (VAD)**: WebRTC VAD library required for continuous mode — adds frontend bundle ~30KB. Defer iter 40+ if frontend size budget tight.

## Score iter 39 A5 ONESTO

**0.3/1.0 atom completion**:
- ADR-031 design complete (iter 38): 1.0
- Audit doc this iter: 1.0
- Implementation: 0.0 (deferred iter 40+)
- Frontend Safari/iOS fallback: 0.0
- 9-cell matrix verify: 0.0

**Box impact**: +0.0 iter 39 (Box 8 TTS already ceiling 0.95, STT separate; iter 40+ STT migration could add NEW box if needed).

## Iter 40+ next steps

1. Maker-1 implement `voxtral-stt-client.ts` ~250 LOC (TDD with Tester mocked Mistral REST)
2. Maker-1 modify `unlim-stt/index.ts` hybrid mode env-gated
3. WebDesigner-1 modify `wakeWord.js` Safari/iOS fallback MediaRecorder + 5s rolling window
4. Tester-4 9-cell matrix Voxtral Italian/English/Mixed K-12 vocabulary
5. Andrea Opus G45 review pre-deploy

Andrea Marro — iter 39 ralph A5 — 2026-05-01
