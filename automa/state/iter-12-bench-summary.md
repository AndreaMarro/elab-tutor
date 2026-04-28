# Sprint S iter 12 — Bench Summary

Generated: 2026-04-28T03:23:17.919Z
Dry-run: true
Suites run: B1, B2, B3, B4, B5, B6, B7, B8, B9, B10

## Pre-flight
- Env required missing: SUPABASE_URL, SUPABASE_ANON_KEY
- Env optional missing: TOGETHER_API_KEY, GEMINI_API_KEY
- Vitest baseline: SKIPPED
- Services: (not checked)

## Suite Results
- **B1** (STUB/DRY): B1 R7 200-prompt PASS rate
  - target: ≥87% global + 10/10 cat ≥85%
  - measured: dry-run (schema check only)
- **B2** (STUB/DRY): B2 Hybrid RAG recall@5
  - target: recall@5 ≥0.55 (lift +0.165 vs iter 11 0.384)
  - measured: dry-run
- **B3** (STUB/DRY): B3 Vision E2E
  - target: p95 <8s + topology ≥80%
  - measured: dry-run
- **B4** (STUB/DRY): B4 TTS Isabella WS
  - target: p50 <2s OR ceiling browser fallback 0.85
  - measured: dry-run
- **B5** (STUB/DRY): B5 ClawBot composite
  - target: composite success ≥90% + sub-tool p95 <3s
  - measured: dry-run
- **B6** (STUB/DRY): B6 Cost per session
  - target: <€0.012/session avg + p95 <€0.025
  - measured: dry-run
- **B7** (STUB/DRY): B7 Fallback gate
  - target: gate accuracy student-runtime 100% + audit log 100%
  - measured: dry-run
- **B8** (STUB/DRY): B8 Simulator engine integration
  - target: simulator engine integration tests PASS (≥30 if available, else 0+)
  - measured: dry-run
- **B9** (STUB/DRY): B9 Arduino compile flow
  - target: Arduino compile flow tests PASS rate ≥95% (target 92 esperimenti)
  - measured: dry-run
- **B10** (STUB/DRY): B10 Scratch Blockly compile
  - target: Scratch Blockly compile rate ≥90%
  - measured: dry-run

## Aggregate
- Pass: 0 / Fail: 0 / Stub-or-dry: 10
- Score lift target: 9.30 → **9.65** ONESTO

## Pass criteria iter 12 (B1-B10)
- B1 R7 200-prompt: ≥87% global + 10/10 cat ≥85%
- B2 Hybrid RAG: recall@5 ≥0.55 (lift +0.165 vs 0.384 iter 11)
- B3 Vision E2E: p95 <8s + topology ≥80%
- B4 TTS Isabella WS: p50 <2s OR ceiling browser fallback 0.85
- B5 ClawBot composite: success ≥90% + sub-tool p95 <3s
- B6 Cost: <€0.012/session avg + p95 <€0.025
- B7 Fallback gate: 100% accuracy + audit log 100%
- B8 Simulator engine integration: vitest count (iter 12 stub, real impl iter 13+)
- B9 Arduino compile flow 92 esperimenti: ≥95% (iter 12 stub)
- B10 Scratch Blockly compile: ≥90% (iter 12 stub)

## Notes
- B8/B9/B10 are NEW iter 12 stubs — count vitest filter PASS in tests/{unit,integration}/{simulator,arduino-compile,scratch-compile}.
- Real implementations deferred iter 13+ (dedicated harnesses).
- B1 fallback: r7-fixture.jsonl missing → r6-fixture.jsonl 100 prompts (warn logged).
- B4 ceiling 0.85: applied if Edge TTS WS DOWN (per Box 8 documented browser fallback).