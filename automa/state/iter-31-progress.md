# Iter 31 Progress Heartbeat

**Status**: PHASE 1 IN PROGRESS — Ralph loop iter 31 active 2026-05-02 PM autonomous (G45 defaults applied automa/state/iter-31-andrea-flags.jsonl, Andrea overrides post-fact via chat)
**Plan**: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
**Last update**: 2026-05-02 (iter 30 docs-only close)
**Baseline tag**: `baseline-iter41-batch12-2026-05-02` (sha `69c9453`)
**Vitest baseline**: 13474 PASS

---

## Phase progress

- [ ] Phase 0 Prerequisites + 4 definizioni alignment (30min) — **PENDING Andrea ratify**
- [ ] Phase 1 4 NEW skill creation + PZ extend (4h)
- [ ] Phase 2 Sprint U Cycle 2 fix execution (6h)
- [ ] Phase 3 Mac Mini persona-prof simulation deploy (3h Andrea + Mac Mini autonomous)
- [ ] Phase 4 PRINCIPIO ZERO Vol/pag verbatim 95% (4h)
- [ ] Phase 5 Onniscenza V2.1 + canary stage 5%→25%→100% (4h)
- [ ] Phase 6 Wake word "Ehi UNLIM" + 9-cell STT + plurale prepend (2h)
- [ ] Phase 7 CoV finale + commit + push + Andrea Opus G45 review (3h)

**Total estimate**: ~26h dev wall-clock + ~100h Mac Mini autonomous H24 + ~3h Andrea Opus review.

---

## Acceptance gate Phase 0 (Andrea action ~85min)

Andrea ratify queue Batch 1 (8 decisioni HIGH ROI / LOW COST iter 30 priority matrix):

- [ ] Decisione #1 Mac Mini recovery (5min)
- [ ] Decisione #5 interrupt.md implicit OK (0min)
- [ ] Decisione #7 Sprint target 8.5 ONESTO 10gg (5min)
- [ ] Decisione #8 Onnipotenza C3 canary 5% (10min)
- [ ] Decisione #9 Deno dispatcher 12-tool canary 5% (10min)
- [ ] Decisione #10 Vercel Atom 42-A deploy verify (10min)
- [ ] Decisione #12 Phase E cleanup old Voyage chunks (15min)
- [ ] Decisione #13 ADR-040 Leonardo REJECT + FLUX MAINTAIN (30min)

Once 8/8 ratified → Phase 0 GO → spawn Pattern S 6-agent OPUS PHASE-PHASE r3 caveman.

---

## Pattern S 6-agent OPUS race-cond fix architecture

| Agent | Caveman? | File ownership | Phase ownership |
|---|---|---|---|
| Planner-opus | YES | TodoWrite + atoms decomposition | Phase 0 prep |
| Architect-opus | YES | docs/adrs/ + ADR ratify | Phase 1+5 design |
| Maker-1 caveman | YES | src/ + supabase/functions/_shared/ + scripts/ | Phase 1 skills 1+5 + Phase 2 atoms 2.1+2.2 + Phase 3 atom 3.1 + Phase 4 atoms 4.4-7 + Phase 5 atom 5.2 |
| Maker-2 caveman | YES | tests/ + src/ second-pass | Phase 1 skill 2 + Phase 2 atom 2.3 + Phase 5 atom 5.1 |
| Tester-1 caveman | YES | tests/ + scripts/bench/ | Phase 1 skills 3+4 + Phase 2 atom 2.4 + Phase 4 atoms 4.7-8 + Phase 5 atom 5.3 + Phase 6 atom 6.1 |
| Scribe-opus | YES | docs/audits/ + docs/handoff/ + CLAUDE.md | Phase 2 sequential audit + handoff + footer recalibrate |

**Filesystem barrier**: 4-5/4-5 completion msgs `automa/team-state/messages/{agent}-iter31-phase{N}-completed.md` PRE Phase 2 sequential scribe spawn.

---

## CoV mandate ogni atom (3-step)

1. **CoV-1 baseline preserve**: `npx vitest run` PRIMA atom must PASS 13474
2. **CoV-2 incremental**: `npx vitest run tests/unit/{newscope}` post atom must PASS new tests
3. **CoV-3 finale**: `npx vitest run` POST atom must PASS 13474+delta

Failure CoV ANY step → REVERT IMMEDIATO + investigation systematic-debugging.

---

## Anti-regression + anti-inflation mechanisms (12 total)

Reference: `docs/audits/2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md`

### Phase 1 deploy (must-deploy iter 31 entrance, ~6h):

- [ ] M-AR-01 Auto-revert pre-commit ENHANCED (Maker-1, 1h)
- [ ] M-AI-01 Score history registry validator (Maker-1, 30min) — **state file already bootstrapped iter 30**
- [ ] M-AI-01 inflation-flags validator (Maker-2, 30min) — **state file already bootstrapped iter 30**
- [ ] M-AI-04 Doc drift detector (Maker-2, 1h)
- [ ] M-AI-03 Claim-reality gap detector (Tester-1, 1h)
- [ ] M-AR-05 Smart rollback machinery (Maker-1, 1h) — **state file already bootstrapped iter 30**
- [ ] M-AI-02 Mechanical cap enforcer (Architect, 1h) — **config already bootstrapped iter 30**

### Phase 2 deploy (iter 32+):

- [ ] M-AR-03 Mac Mini regression diff
- [ ] M-AR-04 Lighthouse gate per deploy
- [ ] M-CC-02 GitHub Actions multi-gate workflow
- [ ] M-CC-01 Skill execution log + digest signing
- [ ] M-AI-05 Opus G45 review automation

---

## Heartbeat log

- 2026-05-02 iter 30 docs-only close — 14 file 5206 LOC documentation, ZERO code fixes
- 2026-05-02 ralph loop cancelled (was iteration 16)
- 2026-05-02 state files bootstrapped: score-history.jsonl + inflation-flags.jsonl + mechanical-caps.json + baseline-tags.jsonl + skill-runs.jsonl
- 2026-05-02 PM ralph loop iter 31 START — G45 defaults applied iter-31-andrea-flags.jsonl (8 decisioni + env recovery), env auto-recovery Step 0.0 SUCCESSFUL (5/7 sprint-s-tokens + 2/7 ~/.zshrc recover SUPABASE_ANON_KEY + TOGETHER_API_KEY), git HEAD 69c9453 baseline 13474 verified, Vercel HTTP 200 prod live, Mac Mini SSH OK (node not in PATH defer iter 32)

---

## Cross-link

- Master plan: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- 4 definizioni alignment: this file §"Allineamento prerequisito" + CLAUDE.md "DUE PAROLE D'ORDINE"
- Mac Mini persona-prof: `docs/handoff/2026-05-02-mac-mini-professore-inesperto-persona-iter-31.md`
- Tea brief: `docs/handoff/2026-05-02-tea-iter-31-brief.md`
- Tools+plugins inventory: `docs/audits/2026-05-02-iter-31-tools-plugins-inventory.md`
- Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`
- Andrea 13 decisioni priority matrix: `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md`
- Anti-regression + anti-inflation mechanisms: `docs/audits/2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md`
- ADR-040 fumetto: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md`
