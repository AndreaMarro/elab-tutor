# ELAB Quality Audit — 2026-05-04 12:00 CEST

Post iter 34 close + iter 35 carryover (vera mascotte ATOM VII shipped a3d8cda + mammoth crash-fix 021bdfc deploy am28azozb LIVE prod aliased www.elabtutor.school).

## Score Card

| Metrica | Valore | Target | Status |
|---|---|---|---|
| Font<14px JSX (codebase totale) | 87 | <50 | ⚠️ |
| Font<14px JSX (HomePage only) | 0 (clamp()) | 0 | ✅ |
| Touch min-height<44px CSS | 0 | 0 | ✅ |
| console.log src | 2 | 0 | ⚠️ |
| ARIA HomePage | 10 | ≥5 | ✅ |
| @media HomePage | 1 | ≥3 | 🔴 |
| Bundle main chunks | 4×~1MB | <1.2MB main | ⚠️ |
| Emoji rendered HomePage JSX | 1 (🐒 Chi siamo) | 0 (Andrea-OK) | ✅ |
| Glossario credit footer | presente | presente | ✅ |
| Cronologia HomeCronologia mounted | presente | presente | ✅ |
| Teodora de Venere credit | presente line 728 | presente | ✅ |

## Findings critici

### 🔴 CRASH ROOT CAUSE FIXED iter 35 carryover
- mammoth v1.11.0 CommonJS `exports.X = X` (NO `module.exports`) → Vite ESM interop newer = `import('mammoth').default → undefined` → Error Boundary catch
- Fix: namespace fallback `mammothModule.default ?? mammothModule` (commit 021bdfc)
- PWA SW serve OLD broken chunk anche post deploy → unregister + cache delete + reload (Chrome MCP)
- Deploy am28azozb LIVE prod aliased www.elabtutor.school ✅

### 🟠 UNLIM "ebete pappette pronte" — fix shipped iter 34 NON deployato env
- File: `supabase/functions/_shared/onniscenza-classifier.ts` Atom A1 cap conditional 6→8 categorie
- chit_chat=30 / meta=50 / off=40 / citation/plurale/default=60 / deep=120 / safety=80 (vs hardcoded 120 attuale)
- Env gate `ENABLE_CAP_CONDITIONAL=false` default OFF
- AZIONE Andrea: `ENABLE_CAP_CONDITIONAL=true` + `ENABLE_L2_CATEGORY_NARROW=true` Supabase secret env + canary 5%→100%

### 🟠 UNLIM memory cross-session — shipped iter 31-32 wired prod
- File: `src/services/unlimMemory.js` 580 LOC + `supabase/functions/_shared/onniscenza-bridge.ts`
- Aggregator 7-layer LIVE prod opt-in `ENABLE_ONNISCENZA=true` (iter 31)
- UI snapshot integration LIVE prod iter 32 deploy v80 (ADR-042 ACCEPTED)
- Box 11 score 0.95 — canary 5%→100% rollout ratify Andrea pending iter 33+

### 🟢 Voxtral wake word — confusione utente
- Wake word ≠ Voxtral. Wake word = browser webkitSpeechRecognition (gratis, Chrome/Edge only)
- File: `src/services/wakeWord.js` 208 LOC
- 14 wake phrases attive: "ehi unlim" "hey unlim" + "ragazzi unlim" plurale
- Voxtral mini-tts-2603 = TTS voice clone Andrea (Mistral Scale tier €18/mo LIVE)
- Browser Firefox/Safari NON supportato wake word → Chrome/Edge richiesto
- Verifica utente: Chrome/Edge + grant mic permission via nudge prompt

### 🔴 HomePage responsive insufficient
- 1 @media query in 763 LOC = breakpoint mobile mancante
- 12 inline `style={{}}` hard-coded values
- HomePage usa clamp() per fontSize hero MA layout grid 4 cards probabilmente non mobile-first
- AZIONE iter 35+: 3 breakpoint sm/md/lg + grid stack mobile + inline styles → CSS module

### 🟠 Multi-AI orchestration design
- multimodalRouter.js 477 LOC routes 7 modalities
- LLM_ROUTING 70/20/10 (Mistral/Gemini/Together) per ADR-029 ACCEPTED iter 37
- Latency Tier 1: T1.1 semantic cache LIVE v56
- Onnipotenza Expansion ADR-041 LIVE prod iter 32 deploy v80 + 50/50 E2E PASS

## Anti-pattern G45 enforced

- NO claim "Sprint T close achieved" (iter 41-43 realistic post canary 100% + Opus review)
- NO claim "UNLIM longer responses LIVE" (env gate Andrea ratify pending)
- NO claim "Voxtral wake word fix" (no fix needed, browser+mic Andrea verify)

## Raccomandazioni priorità

| Priority | Action | Owner | Impact |
|---|---|---|---|
| P0 | `ENABLE_CAP_CONDITIONAL=true` + `ENABLE_L2_CATEGORY_NARROW=true` Supabase env | Andrea | UNLIM longer+smarter LIVE |
| P0 | Deploy unlim-chat v81+ post env enable | Andrea | Edge reload env |
| P1 | HomePage mobile media queries + grid stack <768px | dev iter 35+ | Mobile UX |
| P1 | Verifica wake word Chrome+mic Andrea/Tea | Andrea | Wake word LIVE confirm |
| P2 | Bundle code-split mammoth lazy-load on-demand | dev iter 35+ | Initial load -200KB |
| P3 | Console.log 2 occurrences cleanup | dev | Production polish |

## Score finale ONESTO G45

**8.30/10** baseline iter 34 + 0.0 iter 35 carryover (anti-regressione recovery ≠ improvement per G45 mandate).

---

*Quality Audit v1.1 — 2026-05-04 12:00 CEST*
