# ADR-032 — Onnipotenza Deno Port 12-Tool Server-Safe Subset

**Status**: PROPOSED (Andrea ratify queue iter 40+)
**Date**: 2026-05-01
**Sprint**: T iter 39 ralph (atom A3)
**Supersedes**: ADR-028 §7 partial (browser-side `__ELAB_API` continues for 50 unsafe DOM-bound tools)
**Depends on**: ADR-028 §14 (surface-to-browser INTENT pivot iter 36), ADR-030 (Mistral function calling JSON schema iter 38)

## Context

OpenClaw 62-tool registry (`scripts/openclaw/tools-registry.ts`) currently dispatches via browser-side `__ELAB_API` per ADR-028 §14 surface-to-browser pivot iter 36. Server-side dispatch was incompatible because most tools (`captureScreenshot`, `highlightComponent`, `mountExperiment`, `playSimulation`) need DOM access.

However, a 12-tool subset is server-safe (no DOM dependency, no browser context required). Porting these to Deno enables:
- **Deterministic execution** server-side (no client-side race condition)
- **Reduced round-trip latency** (no client-server-client bounce)
- **Auditable centralized dispatch** for ELAB_API_KEY token-gated logging
- **Canary rollout** alongside browser-side dispatch (5% → 25% → 100% per atom A3 §canary)

## Decision

Port 12 server-safe tools to Deno Edge Function `_shared/clawbot-dispatcher-deno.ts` with:

### 12-tool subset (server-safe)

| # | Tool | Server logic | Browser surface |
|---|------|-------------|-----------------|
| 1 | `highlightComponent` | track state in `class_memory.highlighted_components` jsonb | browser renders highlight overlay reading state |
| 2 | `mountExperiment` | server loads lesson-path JSON from `lesson-paths/*.json` + injects to chat context + writes `class_memory.current_experiment_id` | browser fetches updated experiment state via SSE next chunk |
| 3 | `captureScreenshot` | NOT server-safe (DOM access mandatory) → SURFACE to browser via INTENT tag |
| 4 | `getCircuitState` | NOT server-safe (browser-side react state) → SURFACE |
| 5 | `getCircuitDescription` | server reads `class_memory.last_circuit_description` jsonb if cached, else returns null | browser reads circuit + sets memory async |
| 6 | `clearCircuit` | server validates command + writes `class_memory.circuit_cleared_at` | browser clears local state on next render cycle |
| 7 | `highlightPin` | track state `class_memory.highlighted_pins` jsonb | browser renders pin highlight |
| 8 | `clearHighlights` | clear `class_memory.highlighted_components + .highlighted_pins` jsonb | browser clears render |
| 9 | `setComponentValue` | server validates value range (resistor 1-1M Ohm, LED color hex, etc) + emits validated value to client | browser applies validated value to react state |
| 10 | `connectWire` | server validates {from, to} pin pair allowed by experiment schema + emits to client | browser draws wire on canvas |
| 11 | `ragRetrieve` | server-side direct call to `hybridRetrieve(query, k)` returns chunks JSON | NO BROWSER ROUNDTRIP (pure server) |
| 12 | `searchVolume` | server-side `searchVolume(query, vol)` `rag_chunks` filter + return | NO BROWSER ROUNDTRIP |

**Net 4/12 fully server-side** (mountExperiment, ragRetrieve, searchVolume + setComponentValue validation), **8/12 hybrid** (server validates + tracks state + browser renders).

### Architecture

```
unlim-chat/index.ts
  ├─ post-LLM intent parse (existing iter 36 ADR-028 §14)
  ├─ NEW: hashBucket(sessionId) % 100 < CANARY_DENO_DISPATCH_PERCENT?
  │    ├─ YES → invoke clawbotDispatcherDeno(intentTag) for server-safe tools
  │    │       inline result merged into response.dispatcher_results[]
  │    └─ NO  → SURFACE intent_parsed to browser as iter 36 (status quo)
  └─ return ChatResponse + dispatcher_results[] (server-side dispatched) + intents_parsed (browser-side fallback)

clawbot-dispatcher-deno.ts (NEW, ~600 LOC)
  ├─ executeServerSafeTool(intentTag, ctx) → {tool, args, result, executed_at, latency_ms}
  ├─ 12 handlers (highlightComponent ... searchVolume)
  ├─ Supabase client integration (class_memory + rag_chunks)
  ├─ Validation schemas per tool (Zod-style runtime check Deno-compat)
  ├─ Audit log to `clawbot_dispatch_log` (NEW table iter 40+ migration)
  └─ Defensive try/catch per tool — NEVER throws (returns error result)

clawbot-dispatcher-deno.test.ts (NEW, 24+ tests TDD)
  ├─ each tool happy path + invalid args + supabase down
  ├─ canary bucket determinism (sessionId hash same → same bucket)
  └─ ServerSafeToolNames constant export validates against tools-registry
```

### Canary rollout

**Stage 1 — `CANARY_DENO_DISPATCH_PERCENT=5`** (4-8h soak):
- 5% sessions hit server-side dispatch
- 95% browser-side surface (status quo iter 36)
- Telemetry: `dispatcher_results[].latency_ms` p50/p95 + `dispatcher_errors` count

**Stage 2 — 25%** post Stage 1 telemetry verify (no error spike, latency p95 <100ms server-side):
- 25% sessions hit server-side dispatch
- 4-8h soak

**Stage 3 — 100%** post Stage 2 verify (24-48h final soak):
- All sessions hit server-side dispatch for 12-tool subset
- Browser-side fallback kept ONLY for 50 unsafe DOM-bound tools (captureScreenshot, getCircuitState, etc.)
- NO removal of browser-side `__ELAB_API` — defense in depth

### Files

- NEW `supabase/functions/_shared/clawbot-dispatcher-deno.ts` (~600 LOC)
- NEW `scripts/openclaw/clawbot-dispatcher-deno.test.ts` (24+ TDD tests)
- NEW `supabase/migrations/20260502000000_clawbot_dispatch_log.sql`
- NEW `docs/adrs/ADR-032-onnipotenza-deno-12-tool-server-safe.md` (THIS FILE)
- MODIFY `supabase/functions/unlim-chat/index.ts` post-LLM step 6a: hashBucket branch (~30 LOC)
- MODIFY `supabase/functions/_shared/types.ts` `ChatResponse.dispatcher_results?: DispatcherResult[]`

## Consequences

### Positive

- **Latency**: server-side tool execution -200-500ms vs browser roundtrip (especially `mountExperiment` lesson-path load + `ragRetrieve` direct)
- **Reliability**: server-side dispatch deterministic, browser-side suffers from race conditions (event loop ordering, React render batching)
- **Auditability**: centralized `clawbot_dispatch_log` tracks every tool invocation with sessionId + latency + result for debugging
- **G45 compliance**: serves Onnipotenza atom A10 from PDR §4 ratify queue iter 41+ Sprint T close path

### Negative

- **Complexity**: dual dispatch path adds branching logic
- **Migration risk**: server-side state desync vs browser-side state if rollout incomplete
- **Test coverage**: needs full Playwright E2E coverage for canary bucket boundary cases (5% → 6% transition)
- **Maintenance burden**: 12 server-side handlers must stay in sync with 12 browser-side handlers

### Mitigations

- TDD 24+ tests covering hashBucket determinism + tool happy paths + Supabase down fallbacks
- Telemetry-driven canary advance (no manual percentage bumps without latency p95 + error rate gate)
- Browser-side `__ELAB_API` remains active fallback (defense in depth)
- Andrea Opus indipendente review G45 mandate before Stage 3 100% rollout

## Acceptance gates per stage

- **Stage 1 (5%)**: 24+ TDD tests PASS + Edge Function deploy + smoke 10 sessions verify dispatcher_results[] populated
- **Stage 2 (25%)**: Stage 1 telemetry latency p95 <100ms + error rate <0.1% + 4-8h soak data
- **Stage 3 (100%)**: Stage 2 verify + 24-48h soak + Andrea Opus review G45

## Rejected alternatives

- **Full server-side port (62 tools)**: REJECTED — 50 tools require DOM access (`captureScreenshot`, `getCircuitState`, etc.). ADR-028 §14 surface-to-browser pivot remains correct architecture.
- **No canary, big-bang rollout**: REJECTED — 12-tool subset has cross-cutting concerns (state management, validation), risk requires gradual rollout per CLAUDE.md "anti-regressione FERREA" + G45 mandate.
- **Server-side dispatch as default + browser-side as fallback**: REJECTED — opposite of canary direction (browser-side is current LIVE prod, server-side is the new path). Direction matters for honest rollback.

Andrea Marro — iter 39 ralph A3 — 2026-05-01
