# Handoff iter 42 PM → iter 43 — Documenter Phase 2

**Date**: 2026-05-05
**From**: Sprint T iter 42 PM (cap 7.5/10 ONESTO G45)
**To**: Sprint T iter 43 (target 8.0/10 ONESTO conditional)
**HEAD**: `d3439c2` UNPUSHED (1 vitest fail blocks pre-push hook)

---

## §1 ACTIVATION STRING (paste-ready Andrea)

```
Sprint T iter 43 entrance.
HEAD d3439c2 UNPUSHED (pre-push 1 vitest fail in flight).
Pre-flight CoV mandatory:
  1. cd "VOLUME 3/PRODOTTO/elab-builder"
  2. git status (verify HEAD d3439c2)
  3. npx vitest --bail=1 → identify failing test
  4. fix root cause → re-run vitest full
  5. npm run build PASS
  6. git push (NO --no-verify)
  7. PR #62 merge gate
P0 cascade iter 43 (target 8.0/10 ONESTO):
  P0.1 Andrea ratify ADR-043 v2 (10 min read docs/adrs/ADR-043-morfismo-orchestrator-unlim-proactive-v2.md, 622 LOC)
  P0.2 claude-in-chrome auth + Bug 1+2 LIVE prod verify (Tester ~30 min)
  P0.3 LavagnaShell useEffect launchMode fix (Maker 1-2h, see audit Phase 1 fix design)
  P0.4 SSE streaming Edge Function impl (Maker 4h batch + 3 tests)
  P0.5 92 esperimenti Playwright UNO PER UNO sweep (Tester 8h+, Andrea iter 21+ carryover)
  P0.6 Linguaggio codemod 200 violations (Maker 4h, Andrea iter 21+ carryover)
  P0.7 ADR-027 vol3 narrative refactor design ratify (architect + Davide co-author)
  P0.8 Mac Mini autonomous loop diagnose + recovery (1h)
  P0.9 ADR-043 Layer 1 lesson generator impl (Maker 8h iter 44+)
  P0.10 ADR-043 Layer 2 vision daemon impl (Maker 6h iter 44+)
Andrea ratify queue iter 43:
  1. ADR-043 v2 design (NEW iter 42 PM) [BLOCKS impl Layer 1+2]
  2. SSE streaming sub-ADR (deferred iter 42 PM)
  3. Tea Glossario URL clone IDENTICAL inside main app
  4. ELAB_API_KEY rotate + provision .env local
  5. 92 esperimenti audit closure path
  6. Linguaggio codemod execution greenlight
  7. claude-mem corpus rebuild iter 36-41 (Apr 28+ gap)
G45 cap 7.5/10 floor. NO override 8.0 without Opus indipendente review.
NO claim "Sprint T close achieved", "Bug 1+2 LIVE FIXED", "ADR-043 LIVE", "SSE LIVE".
```

---

## §2 Setup steps Andrea (5-10 min)

1. **claude-in-chrome extension authorize** for live verify Bug 1+2 (auth dialog → grant target tabs `https://www.elabtutor.school/`).
2. **vitest fix failing test** post diagnose Phase 3 orchestrator handed off — identify via `npx vitest --bail=1` → fix root cause OR explicit `it.todo` + Andrea ratify (NO `--no-verify` push).
3. **PR #62 push retry post fix**: `git push` (pre-push hook PASS prerequisite). Vercel auto-deploys main → Bug 6 HomePage corretta LIVE prod.
4. **Andrea ratify ADR-043 v2** (post read 622 LOC) — accept/reject/amend Morfismo Orchestrator + Layer 1 lesson generator + Layer 2 screen vision daemon design.
5. **Andrea ratify queue cleanup** — see §6 below 7+ voci.

---

## §3 Iter 43 priorities P0 (cascade lift target 8.0/10 ONESTO)

| Pri | Atom | Owner | Effort | Target Box impact |
|---|---|---|---|---|
| P0.1 | ADR-043 v2 ratify Andrea | Andrea | 10 min | Box 6 vision (gate impl) |
| P0.2 | Bug 1+2 LIVE prod claude-in-chrome verify | Tester | ~30 min | Box 11 0.7 → 0.85 + Box 14 0.90 → 0.95 |
| P0.3 | Lavagna libera fix LavagnaShell launchMode useEffect | Maker | 1-2h | Box 13 UI/UX 0.75 → 0.80 |
| P0.4 | SSE streaming Edge Function impl design + 3 tests | Maker | 4h | Box 4 SSE 0.20 → 0.60 |
| P0.5 | 92 esperimenti Playwright UNO PER UNO sweep | Tester | 8h+ | Sprint T close gate (Andrea iter 21+ carryover) |
| P0.6 | Linguaggio codemod 200 violations | Maker | 4h | Box 2 PZ v3 0.90 → 0.95 (Andrea iter 21+ carryover) |
| P0.7 | Vol3 narrative refactor ADR-027 design ratify | architect | 2h design | Box 8 wiki + foundation Vol3 |
| P0.8 | Mac Mini autonomous loop diagnose + recovery | inline | 1h | infra unblock |
| P0.9 | ADR-043 Layer 1 lesson generator impl | Maker batch | 8h iter 44+ | Box 6 0.30 → 0.70 (iter 44+) |
| P0.10 | ADR-043 Layer 2 screen vision daemon impl | Maker batch | 6h iter 44+ | Box 6 0.70 → 0.90 (iter 44+) |

---

## §4 Iter 43 score target: 7.5 → **8.0/10 ONESTO**

**Conditional cumulative**:
- Bug 1+2 LIVE verified (P0.2) → Box 11 +0.15 + Box 14 +0.05 = +0.20 raw
- Lavagna libera fix (P0.3) → Box 13 +0.05
- SSE design ratify shipped (P0.4) → Box 4 +0.40 (raw) but cap +0.20 ONESTO without live deploy
- Linguaggio codemod (P0.6) → Box 2 +0.05

**Raw sum**: 7.5 + 0.50 = 8.0 raw. G45 cap iter 43 ONESTO **8.0/10 floor** conditional all 4 atomi shipped + verified. NO override 8.5 without Opus G45 indipendente review.

NO claim:
- "Sprint T close achieved" (9.5 cap iter 45+ realistic, NOT iter 43)
- "ADR-043 LIVE" (impl iter 44+ batch only)
- "Mac Mini autonomous loop healthy" (diagnose only iter 43, recovery iter 44+ if needed)
- "92 esperimenti audit closed" (sweep iter 43, fix iter 44+ batch)

---

## §5 Iter 43 entrance pre-flight CoV mandatory

1. **vitest baseline preserve** — post fix failing test 13497/13497 PASS (15 skip + 8 todo tolerated). NO regression iter 42 PM 13473 baseline.
2. **build PASS** — `npm run build` complete ~1m, no error, bundle size delta tolerated +50KB.
3. **push d3439c2 + ADR-043 + audit unblock** — pre-push hook PASS, NO `--no-verify`. Vercel auto-deploy main triggers.
4. **PR #62 merge** — post push, GitHub PR open via `gh pr create` → Andrea review + merge.
5. **Verify deploy LIVE** — Vercel deploy URL inspection prod `https://www.elabtutor.school/` HomePage 4 cards corretta version visible (NO mascotte robot blu/verde + NO 3 cards CHATBOT/GLOSSARIO/LAVAGNA).

---

## §6 Andrea ratify queue iter 43 entrance (5+ voci)

1. **ADR-043 v2 design** (NEW iter 42 PM, 622 LOC architect Phase 1) — blocks Layer 1 + Layer 2 impl iter 44+.
2. **SSE streaming sub-ADR** (deferred iter 42 PM, design only) — needed P0.4 spec.
3. **Tea Glossario URL clone IDENTICAL inside main app** route `#glossario` — iter 41 PM mandate [feedback_glossario_external_url.md], 4-6h atom dedicated, Mac Mini Task 4 C7 OR iter 42+ atom.
4. **ELAB_API_KEY rotate + provision .env local** — blocks LLM chain bench testing R5/R6/R7 latency + canonical measurement.
5. **92 esperimenti audit closure path** (Sprint T close gate, Andrea iter 21+ mandate) — sweep iter 43 P0.5 → fix batch iter 44+ N atomi.
6. **Linguaggio codemod execution greenlight** — 'Premi Play' singolare imperative + "studente" framing → "Ragazzi, premete" plural + "docente" framing batch (200 violations).
7. **claude-mem corpus rebuild iter 36-41** (Apr 28+ gap) — ingest pipeline broken, cross-session productivity blocker [feedback_context_persistence.md].
8. **repomix install + cegis-plus-orchestrator.sh creation** (P0 iter 41 ratify queue voce 5 NON eseguito, carryover).
9. **Vol3 narrative refactor ADR-027** — Davide co-author iter 33+ deferred, design ratify iter 43 P0.7.

---

## §7 Honest carryovers iter 42 PM → iter 43

- HEAD d3439c2 UNPUSHED (1 vitest fail blocks)
- claude-in-chrome auth not granted iter 42 PM session → live verify Bug 1+2 deferred
- ADR-043 v2 design only (622 LOC), NO impl (Layer 1+2 iter 44+ batch)
- Lavagna libera Bug 6.b OPEN (Phase 1 audit verdict, fix design 1-2h iter 43 P0.3)
- SSE streaming NOT shipped (focus push unblock prioritized)
- Vercel deploy preview FAILED iter 42 PM (separate `--archive=tgz` issue iter 31-32)
- Mac Mini autonomous loop probable dead 23-day uptime (iter 29+ carryover)
- claude-mem corpus elab-sprint-T BUILT EMPTY 0 obs (Apr 23+ pipeline broken)
- 92 esperimenti audit Andrea iter 21+ NOT closed (Sprint T close gate)
- Linguaggio codemod 200 violations Andrea iter 21+ NOT addressed
- Vol3 narrative refactor ADR-027 Davide co-author iter 33+ deferred

---

## §8 Cross-link docs handoff

- **Audit Phase 3 close iter 42 PM**: `docs/audits/2026-05-05-iter-42-pm-PHASE3-CLOSE-audit.md`
- **ADR-043 v2 design**: `docs/adrs/ADR-043-morfismo-orchestrator-unlim-proactive-v2.md`
- **Lavagna libera verify Phase 1**: `docs/audits/2026-05-05-iter-42-pm-lavagna-libera-verify.md`
- **Sprint contract iter 42**: `automa/team-state/sprint-contracts/sprint-T-iter-42-contract.md`
- **CHANGELOG iter 42 PM entry**: top of `CHANGELOG.md`
- **CLAUDE.md APPEND iter 42 PM section**: sprint close section appended after Sprint U Cycle 1 close
- **4 NEW memoria feedback iter 42 PM**: `feedback_unlim_chat_broken_iter42.md` + `feedback_orchestrator_architecture_iter42.md` + `feedback_unlim_proactive_lesson_assistant_iter42.md` + `feedback_connettori_test_validation.md`
- **Code fixes**: `src/services/simulator-api.js:264-274` (Bug 2 dual-shape) + `src/components/HomePage.jsx:310-329` (Bug 6 cherry-pick) + `src/services/sessionRestore.js` (build dep)

---

**End handoff iter 42 PM → iter 43**.
