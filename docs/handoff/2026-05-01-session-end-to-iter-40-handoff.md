# Handoff Session 2026-05-01 → Iter 40+

**Sessione close**: 2026-05-01 sera ~20:30 CEST
**Branch**: `e2e-bypass-preview` HEAD `0d545fb`
**Score finale ONESTO**: **8.5/10** (G45 cap)
**Audit completo**: `docs/audits/2026-05-01-SESSION-AUDIT-COMPLETO.md` (697 LOC)

---

## §1 Activation string iter 40+ entrance

```
Sprint T iter 40 ralph entrance — Sprint T close path 9.5 target.

Pre-flight CoV (mandatory):
1. cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
2. git pull origin e2e-bypass-preview (verify HEAD 0d545fb+ post sessione)
3. npx vitest run → expect 13474 PASS preserved
4. npm run build → expect 3-15min PASS, 4805KB precache
5. curl Edge Function v61 smoke health: GET /functions/v1/unlim-chat → 200 status

Iter 40 P0 priorities (10 cascade lift items):

P0.1 Andrea ratify queue env (5-10 min):
  - npx supabase secrets set CANARY_DENO_DISPATCH_PERCENT=5 (A3 canary 5%)
  - npx supabase secrets set STT_PROVIDER=hybrid (A5 hybrid mode)
  - Vercel env set VITE_ENABLE_SSE=true (A1 frontend canary)

P0.2 Vercel main palette regression fix:
  - Diagnose 913 --elab-hex-* refs main rollback fv22ymvq8
  - Cherry-pick e2e-bypass-preview iter 38+39 commits to clean main OR
  - Fix root cause palette tokens missing definition

P0.3 Edge Function deploy v62+ post env set:
  - npx supabase functions deploy unlim-chat
  - Smoke verify dispatcher_results[] surface curl test
  - Smoke verify Voxtral STT primary curl test

P0.4 R5 50-prompt + R6 100-prompt + R7 200-prompt re-bench post-deploy:
  - measure latency lift (target p50 ≤2000ms perceived via SSE)
  - measure canonical INTENT extraction lift (target ≥80% from current 12.5%)
  - measure V2 quality delta vs V1 baseline (target +5pp PZ V3)
  - measure dispatcher_results[] hit rate canary

P0.5 Mac Mini SSH retry + autonomous loop revival:
  - ssh -i ~/.ssh/id_ed25519_elab progettibelli@100.124.198.59
  - heartbeat verify automa/state/heartbeat fresh
  - D1 ToolSpec audit retry (deferred iter 36)
  - D2 Wiki batch overnight (target 100→200 concepts)
  - D3 lesson-paths audit retry (5 missing reali)
  - D4 92 esperimenti Playwright UNO PER UNO sweep (Andrea iter 21 carryover)

P0.6 Pattern S 4-agent OPUS Phase 1+2 (post Anthropic org reset):
  - Maker-1 A2 toast 429 + A5 Safari iOS MediaRecorder fallback + A6 Lighthouse perf
  - Tester-1 R5+R6+R7 re-bench (full numerical evidence)
  - Tester-3 Vision Gemini Flash deploy + Playwright E2E
  - Tester-4 9-cell STT matrix
  - WebDesigner-1 ChatbotOnly Lighthouse optim
  - Documenter audit + handoff + CLAUDE.md APPEND iter 40 close

P0.7 PR #59 close OR rebase:
  - Currently CONFLICTING vs main
  - Decide: close + open new PR OR rebase head

P0.8 Andrea Opus indipendente review G45 mandate (separate session)

P0.9 systematic-debugging end-of-objective per Andrea mandate iter 39 NOT executed

P0.10 Plugin compliance gap close:
  - Vercel MCP deploy verify
  - Supabase CLI explicit invoke
  - Playwright MCP E2E execute
  - claude-mem MCP search storica
  - /audit /quality-audit slash commands

Iter 40 score target: 8.5 → 9.0+/10 ONESTO conditional all 10 P0 items closed + Opus review.
Sprint T close 9.5: iter 41-43 (A10 + Lighthouse perf + R6 ≥0.55 + Davide ADR-027 Vol3).
```

---

## §2 Stato modelli LIVE prod post sessione

### §2.1 Edge Function unlim-chat v61

| Capability | Status | Env flag |
|-----------|--------|----------|
| LLM routing 70/20/10 (Mistral/Together/Gemini) | LIVE | LLM_ROUTING_WEIGHTS |
| SSE streaming Mistral | LIVE canary | ENABLE_SSE=true |
| Mistral function calling JSON schema | LIVE opt-in | ENABLE_INTENT_TOOLS_SCHEMA=true |
| Onniscenza V1 7-layer aggregator | LIVE | ENABLE_ONNISCENZA=true |
| Onniscenza V2 cross-attention | LIVE canary | ONNISCENZA_VERSION=v2 |
| ClawBot L1 composite + L2 templates | LIVE | (no flag) |
| ClawBot Deno dispatcher 12-tool | code shipped | CANARY_DENO_DISPATCH_PERCENT=0 (default off) |
| Semantic prompt cache LRU | LIVE | SEMANTIC_CACHE_ENABLED=true |
| Cron warmup 30s ping | LIVE | (pg_cron applied iter 38) |
| Hybrid RAG retrieve | LIVE | RAG_HYBRID_ENABLED=true |

### §2.2 Edge Function unlim-tts (Voxtral primary)

| Capability | Status |
|-----------|--------|
| Voxtral mini-tts-2603 | LIVE prod |
| Voice clone Andrea IT (voice_id 9234f1b6) | LIVE prod |
| Format mp3 fallback | LIVE iter 32 8ffb728 |
| Edge TTS Isabella WSS Deno | fallback shipped |

### §2.3 Edge Function unlim-stt

| Capability | Status | Env flag |
|-----------|--------|----------|
| CF Whisper Turbo 3-shape adaptive | LIVE | (default) |
| Voxtral Transcribe 2 | code shipped | STT_PROVIDER=hybrid (defaults cf-whisper) |
| Hybrid mode CF fallback | code shipped | iter 40+ activate |

### §2.4 Edge Function unlim-vision (Pixtral)

| Capability | Status |
|-----------|--------|
| Mistral Pixtral 12B Italian K-12 | LIVE prod |

### §2.5 Edge Function unlim-imagegen (FLUX schnell)

| Capability | Status |
|-----------|--------|
| CF FLUX schnell 503KB image 2.19s | LIVE prod |

---

## §3 Andrea ratify queue iter 40+ (12 voci dedup + 2 NEW questa sessione)

### §3.1 Carryover dalla iter 38

1. ADR-025 Modalità 4 simplification
2. ADR-026 content-safety-guard runtime
3. ADR-027 volumi narrative refactor schema (Davide co-author)
4. ADR-028 §14.b surface-to-browser amend
5. ADR-029 LLM_ROUTING_WEIGHTS conservative tune
6. ADR-030 Mistral function calling JSON schema canonical
7. ADR-031 STT migration Voxtral Transcribe 2
8. Vision Gemini Flash deploy
9. 5 missing lesson-paths reali audit
10. Wake word "Ragazzi" plurale prepend
11. HomePage A13b chatbot-only route + Cronologia + Easter modal (CLOSED iter 7)
12. Marketing PDF compile + PowerPoint Giovanni Fagherazzi
13. Vercel main palette regression fix (--elab-hex-* 913 refs)
14. PWA SW Workbox prompt-update pattern
15. 92 esperimenti audit completion (Sprint T close gate)
16. Linguaggio codemod 200 violations singolare→plurale (Andrea iter 21)

### §3.2 NEW questa sessione

17. **ADR-032 OpenClaw Deno 12-tool server-safe** (`docs/adrs/ADR-032-onnipotenza-deno-12-tool-server-safe.md`)
18. **ADR-033 Onniscenza V2 cross-attention 8-chunk budget** (`docs/adrs/ADR-033-onniscenza-v2-cross-attention-budget.md`)
19. **CANARY_DENO_DISPATCH_PERCENT=5** Supabase Edge env (A3 canary advance)
20. **STT_PROVIDER=hybrid** Supabase Edge env (A5 Voxtral primary activate)
21. **VITE_ENABLE_SSE=true** Vercel env (A1 frontend canary)

---

## §4 Anti-regressione FERREA gate iter 40+

- vitest baseline **13474 PASS** NEVER scendere
- Build PASS pre-commit hook NEVER skip
- Pre-push hook NEVER bypass `--no-verify`
- Pre-commit hook NEVER bypass `--no-verify`
- NO push direct main (PR-only via gh pr create)
- NO `git add -A` senza `git diff` prima
- Score G45 cap NEVER auto-claim 9.0+ senza Opus review

---

## §5 Files refs comprehensive

- Audit completo sessione: `docs/audits/2026-05-01-SESSION-AUDIT-COMPLETO.md`
- Iter 39 ralph CLOSE: `docs/audits/iter-39-ralph-loop-CLOSE.md`
- A1 SSE LIVE verified: `docs/audits/iter-39-A1-SSE-LIVE-PROD-verified.md`
- A4 V2 canary LIVE: `docs/audits/iter-39-A4-Onniscenza-V2-canary-LIVE.md`
- ADR-032: `docs/adrs/ADR-032-onnipotenza-deno-12-tool-server-safe.md`
- ADR-033: `docs/adrs/ADR-033-onniscenza-v2-cross-attention-budget.md`
- Mission iter 39: `automa/ralph-loop-mission-iter-39.md`

---

Andrea Marro — handoff session-end 2026-05-01 → iter 40+

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
