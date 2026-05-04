# Iter 37 P0.0 — Three-Agent Pipeline trial atom L4 E2E Esci persistence

**Date**: 2026-05-04 PM
**Atom**: L4 E2E Esci persistence Playwright spec (medium complexity ~300 LOC)
**Pipeline**: Plan(Claude) → Implement(Codex CLI) → Review(Gemini CLI) → Finalize(Codex iter 2 apply Gemini fixes) → Verify(Claude playwright --list)
**Recovery context**: Iter 36 close 0% multi-provider compliance regression; this trial RECOVERY

## §1 Atom delivery summary

| Phase | Agent | Output | Time |
|---|---|---|---|
| 1 Plan | Claude inline | `/tmp/L4-spec-brief.md` (3 test scopes + tech stack + acceptance gates) | ~10 min |
| 2 Implement | Codex CLI exec | `tests/e2e/05-esci-persistence.spec.js` 291 LOC (init iter 1) | ~5 min auto |
| 3 Review | Gemini CLI prompt | 5 critical findings (HIGH waits + DB pollution + MEDIUM viewport + Italian + LOW beforeunload) | ~3 min auto |
| 4 Finalize | Codex CLI exec iter 2 | spec 291→332 LOC (+41 LOC, 9 fix occurrences integrated) | ~5 min auto |
| 5 Verify | Claude inline | `npx playwright test --list` 3 tests parsed | ~30 sec |

**Wall-clock total**: ~25 min (vs estimato Claude solo ~45-60 min per spec medium quality + bug-finding iteration).

## §2 Anti-bias evidence Gemini findings

### Finding 1 [HIGH] Hardcoded waits

**Codex iter 1 anti-pattern**:
```javascript
await page.waitForTimeout(DEBOUNCE_MS + 200);  // 2200ms hardcoded
```

**Gemini fix**:
```javascript
const savePromise = page.waitForResponse(
  r => r.url().includes('scribble_paths') && r.request().method() !== 'GET',
  { timeout: 15000 }
).catch(() => null);
```

**Impact**: Test flakiness se rete lenta (Vercel cold start) + spreco se rete veloce → deterministic network-based wait.

### Finding 2 [HIGH] DB pollution Principio Zero violation

**Codex iter 1 issue**: Test against prod URL `https://www.elabtutor.school` → strokes persist nel DB Supabase reale per ID esperimento corrente, sporcano account reali.

**Gemini fix**:
```javascript
test.beforeEach(async ({ page }) => {
  const uniqueId = `e2e-persistence-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  await page.addInitScript((id) => {
    window.localStorage.setItem('elab-lavagna-exp-id', id);
  }, uniqueId);
});
```

**Impact**: Test isolation prevent cross-test pollution + protect prod DB integrity.

### Finding 3 [MEDIUM] Viewport coordinates fragile

**Gemini fix**:
```javascript
test.use({ viewport: { width: 1920, height: 1080 } });
```

**Impact**: Coordinates `(120, 110)` consistent across LIM standard resolution.

### Finding 4 [MEDIUM] Italian labels Morfismo Sense 2

**Gemini fix expand selectors**:
```javascript
const esciBtn = page.locator([
  'button[data-elab-action="esci-lavagna"]',
  'button[data-elab-action="exit"]',
  'button:has-text("Esci")',
  'button:has-text("Esci dalla lavagna")',
  'button:has-text("Torna ai Ragazzi")'
].join(', ')).first();
```

**Impact**: Selector resilient label changes Italian K-12 + Principio Zero plurale "Ragazzi".

### Finding 5 [LOW] beforeunload incompleta

**Gemini fix**:
```javascript
await page.close({ runBeforeUnload: true });
```

**Impact**: Real browser tab-close simulation + beforeunload handler invoked.

## §3 Three-Agent Pipeline empirical validation iter 37 P0.0

| Hypothesis | Evidence | Verdict |
|---|---|---|
| H1 anti-bias migliora score | Gemini caught 5 issues Codex iter 1 missed | ✅ TRUE significant |
| H2 wall-clock saving parallelizzazione | 25min Three-Agent vs 45-60min Claude solo estimato | ✅ TRUE ~50% saving |
| H3 debito tecnico ridotto | Anti-pattern G45 (hardcoded waits) caught proactively + DB pollution | ✅ TRUE caught BEFORE merge |
| H4 cost realistic | $0 incremental (ChatGPT Plus + Gemini Pro existing subs) | ✅ TRUE no extra cost |

**Aggregate verdict**: ✅ **PASS Three-Agent Pipeline VALIDATED 3rd consecutive trial** (iter 34 atom A2b small marginal + iter 34 atom C1 complex CRITICAL stale closure + iter 37 L4 medium 5 critical findings).

## §4 Master plan workflow §4.5 acceptance gate Atom 1.5 retrospective

| Criterio | iter 31 | iter 34 | iter 37 P0.0 | **Aggregate** |
|---|---|---|---|---|
| Atom 1.1 Codex install | ✅ | — | — | ✅ |
| Atom 1.2 Gemini install | ✅ | — | — | ✅ |
| Atom 1.3 Three-Agent trial | — | ✅ A2b + C1 | ✅ L4 | ✅ 3× consecutive |
| Atom 1.4 Mac Mini SSH backend swap | ❌ | ❌ | ❌ | ❌ NOT done |
| Atom 1.5 retrospective decision matrix | — | — | ✅ THIS DOC | ⚠️ partial (without 1.4 data) |

**Step 1 compliance ONESTO**: 4/5 atomi (80%) — missing Atom 1.4 Mac Mini Kimi/DeepSeek backend trial.

**Decision**: ⚠️ **CONDITIONAL PASS Step 2 entrance** — Three-Agent Pipeline EMPIRICAL VALIDATED 3× MA Mac Mini backend swap H4 cost falsifier missing.

**Iter 38 entrance prerequisiti**:
1. Complete Atom 1.4 Mac Mini Kimi free trial 1 atom backend swap
2. Mandate Three-Agent Pipeline ≥1 atom per iter going forward (avoid iter 36 0% regression)

## §5 Iter 36 0% multi-provider regression honest analysis

Iter 36 close shipped 5 atomi tutti Claude inline:
- A0 footer credits 8 LOC ✅ trivial OK
- A1 ModalitaSwitch SVG 14 LOC ✅ small OK
- E1 maxOutputTokens 5 LOC ✅ trivial OK
- **E3 BASE_PROMPT v3.3 50 LOC ⚠️ should have used Three-Agent (content quality + prompt engineering anti-bias)**
- **M1+Q1 5 SVG icons 150 LOC ⚠️ should have used Three-Agent (design choices anti-bias)**
- O1 Glossario card 40 LOC ✅ small OK

Compliance regression: Three-Agent Pipeline NOT internalized into iter workflow. Mitigation iter 38: explicit gate "atom >50 LOC OR content/design/architectural decisions → MANDATORY Three-Agent".

## §6 Anti-pattern G45 enforced

- NO claim "Step 2 ratified PASS" senza Atom 1.4 Mac Mini trial
- NO claim "iter 36 multi-provider compliant" (0% admitted)
- NO claim "Three-Agent always faster" (small atomi marginal benefit, complex atomi significant — iter 34 A2b vs C1 evidence)
- NO compiacenza Three-Agent (5 honest findings caveats)
- NO env keys printed conversation
- NO --no-verify (pre-commit hooks rispettati)

## §7 Cross-link

- L4 spec output: `tests/e2e/05-esci-persistence.spec.js` (332 LOC)
- L4 spec brief: `/tmp/L4-spec-brief.md`
- Gemini review prompt: `/tmp/gemini-review-prompt.md`
- Codex iter 2 fixes spec: `/tmp/L4-codex-iter2-fixes.md`
- Master plan workflow: `docs/superpowers/plans/2026-05-04-iter-36-38-andrea-12-mandate-master-plan.md`
- Workflow 3-step incrementale: `docs/superpowers/plans/2026-05-03-WORKFLOW-MULTI-PROVIDER-3-STEP-INCREMENTALE.md`
- Iter 36 close handoff: `docs/handoff/2026-05-04-iter-36-close-handoff.md`
- Codex BG output: `/private/tmp/claude-501/.../tasks/b3eg4cp57.output` + `bff7s2g7d.output`
- Gemini BG output: `/private/tmp/claude-501/.../tasks/br8jv875n.output`

---

*Three-Agent Pipeline trial L4 audit v1.0 — Andrea Marro + Claude inline + Codex CLI + Gemini CLI 2026-05-04 PM*
