# F2 Browser audit — Andrea wake word diagnostic (iter 35 Phase 2 Maker-3)

**Date**: 2026-05-04
**Owner**: Maker-3 (Wake word + Voxtral diagnostic)
**Method**: Chrome MCP `mcp__Claude_in_Chrome__javascript_tool` probe live navigated to `https://www.elabtutor.school`
**Scope**: verify Andrea browser environment supports wake word stack + identify Voxtral STT/TTS confusion mandate

## Probe results

### Browser identity
| Field | Value |
|---|---|
| User-Agent | `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36` |
| Platform | `MacIntel` |
| Language | `it-IT` |
| Secure context | `true` (HTTPS) |
| Browser family | Google Chrome 147 (Chromium-based) |

### Web Speech API support
| Capability | Available |
|---|---|
| `window.webkitSpeechRecognition` | **YES** |
| `window.SpeechRecognition` | **YES** (unprefixed alias) |
| `navigator.permissions.query` | **YES** |
| `navigator.mediaDevices.getUserMedia` | **YES** |

### Microphone permission state
- `navigator.permissions.query({name: 'microphone'})` returns `state: 'granted'` (name: `audio_capture`)
- Andrea machine has **already authorized** microphone for `https://www.elabtutor.school` origin.
- This means: any wake word listener mount should receive cached grant immediately, without prompting `MicPermissionNudge` UI.

## Diagnosis Andrea mandate "non posso parlare con unlim"

### Voxtral vs Wake word terminology clarification

Andrea wrote: **"Voxtral non risponde a wake word, non posso parlare con unlim"**.

These are **two distinct stacks** that Andrea conflated:

| Stack | Direction | Tech | Role |
|---|---|---|---|
| **Voxtral** | TTS **OUTPUT** | Mistral `mini-tts-2603` voice clone Andrea Italian (deployed iter 31 LIVE) | UNLIM speaks back to docente |
| **Wake word** | STT **INPUT** | Browser `webkitSpeechRecognition` (Chrome 147 native) | UNLIM listens to docente trigger |

Voxtral does NOT respond to wake word — Voxtral is an output-only TTS service. Wake word activation belongs entirely to the browser-native Speech Recognition API.

### Probable failure paths (since Andrea environment has ALL APIs available + permission granted)

Because Andrea has Chrome 147 + macOS + permission `granted` already, the typical failure modes are NOT environmental. Likely root causes:

1. **WAKE_PHRASES coverage gap (HIGH)**: Andrea may say informal patterns ("ok unlim", "okay unlim") that the iter 41 list `['ehi unlim','ragazzi unlim',...]` does NOT include. F4 atom this iter ADDS `'ok unlim'` + `'okay unlim'` covering common voice-assistant patterns.
2. **Wake listener never started (MEDIUM)**: `LavagnaShell` route only starts the listener when toggle is ON + browser supported. If Andrea is testing on `HomePage` (not Lavagna), no listener exists. **F1 wake word diagnostic UI badge** addresses this — surfaces real-time state on HomePage so Andrea sees "voce pronta" / "in ascolto" before navigating to Lavagna.
3. **SpeechRecognition lang mismatch (LOW)**: hard-coded `lang='it-IT'` matches Andrea `navigator.language='it-IT'` — no mismatch.
4. **Continuous-mode auto-restart silently failing (LOW)**: `recognition.onend` auto-restart hooks; if `network` or `audio-capture` errors fire continuously, listener may stop. Iter 38 added `MicPermissionNudge` + iter 36 `terminalErrorLogged` flag + `elab-wake-word-error` CustomEvent; F1 badge surface complements this.

## Recommendations downstream

| Priority | Action | Owner | Status |
|---|---|---|---|
| P0 | Mount **WakeWordStatusBadge** on HomePage so Andrea sees state real-time before clicking through | WebDesigner-1 | F1 ATOM SHIPPED filesystem coordination |
| P1 | Update E2E spec inline `WAKE_PHRASES` to add `ok unlim` + `okay unlim` (sync drift fix) | Tester-1 | Coordination msg sent |
| P2 | Manual smoke verify: Andrea enters Lavagna, says "ok unlim" → expect onWake | Andrea | Awaiting prod deploy F4 |

## Honesty caveats

1. **Probe ran on `https://www.elabtutor.school` (PROD)** — Andrea's iter 35 Phase 2 work is on `e2e-bypass-preview` branch which may not yet be deployed. Prod browser audit reflects current LIVE state; F4 phrase additions ship next deploy.
2. **`mic state granted` snapshot** — Andrea has authorized once historically. If Andrea ever revokes (Chrome site settings → reset), state flips to `prompt` and `MicPermissionNudge` would surface. F1 badge handles all 4 states explicitly.
3. **Voxtral not directly probed F2** — F2 scope is wake word INPUT diagnostic; Voxtral OUTPUT verification is iter 31 close audit referenced.

## Artifacts

- Probe transcripts (this doc, sections "Probe results")
- WAKE_PHRASES expansion: `src/services/wakeWord.js` lines 26-39 (F4 atom)
- F1 component: `src/components/common/WakeWordStatusBadge.jsx` (F1 atom this iter)
- Coordination msgs: `automa/team-state/messages/maker3-to-{webdesigner1,tester1}-*-2026-05-04.md`
