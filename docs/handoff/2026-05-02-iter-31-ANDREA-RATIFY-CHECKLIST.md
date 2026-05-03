# Andrea Ratify Checklist Iter 31 Entrance — Phase 0 Gate

**Date**: 2026-05-02 (iter 30 docs-only close)
**Total Andrea wall-clock**: ~85min Batch 1 (8 decisioni HIGH ROI / LOW COST)
**Mode**: paste-ready check items
**Anti-inflation**: G45 cap. NO claim "ratify done" senza explicit Andrea reply.

---

## §1. Pre-ratify reading (~30min Andrea)

Andrea legge in ordine:

1. `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md` — full priority ranking + ROI×Cost (~15min)
2. `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md` §1 + §3 + §6 + §10 — Leonardo decision (~10min)
3. `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md` §11 priority queue (~5min)

---

## §2. Batch 1 ratify queue (8 decisioni ~85min)

### ☐ Decisione #1 — Mac Mini recovery + autoloop (5min)

**Source doc**: `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md` §3.1

**Question Andrea**: approve iter 31+ atoms 1-6 priority Mac Mini queue (defects fix + wrapper bash + SSH key + cron `*/10 * * * *`)?

**Answer template**:
- ☐ YES (ratify Mac Mini recovery atoms 1-6 queue)
- ☐ NO + motivo
- ☐ MODIFY (e.g., skip Mac Mini cron iter 31, keep MacBook persona-prof manual)

**Cascade unblock if YES**: 10-atom Mac Mini queue iter 31+ ~12h autonomous.

---

### ☐ Decisione #5 — interrupt.md implicit ratify (0min)

**Source doc**: priority matrix §3.2

**Status**: implicit OK iter 26-28 close. NO Andrea action required.

**Iter 31 atom**: Maker-1 surgical edit `src/services/wakeWord.js` `WAKE_PHRASES` array (5min impl).

**Auto-skip**: NO Andrea reply needed.

---

### ☐ Decisione #7 — Sprint target 8.5 ONESTO 10gg vs 9.5 inflato 7gg (5min)

**Source doc**: priority matrix §3.3

**Question Andrea**: confirm Sprint T close target 8.5/10 ONESTO 10gg wall-clock?

**Answer template**:
- ☐ YES 8.5 ONESTO (recalibrates iter 41-43 cumulative projection 9.85 raw → cap 9.5 ONESTO 4-5 settimane)
- ☐ NO mantengo 9.5 (rischio G45 inflation drift)
- ☐ MODIFY 9.0 intermedio

**Cascade unblock if YES**: G45 anti-inflation alignment, mechanical caps `mechanical-caps.json` enforce strict.

---

### ☐ Decisione #8 — Onnipotenza C3 widened canary 5% (10min)

**Source doc**: priority matrix §3.4

**Question Andrea**: approve 5% canary ramp ON for `shouldUseIntentSchema` widened heuristic (5 categories vs narrow action verbs)?

**Pre-ratify check**: verify C2 anti-absurd telemetry 24h soak no false positives.

```bash
npx supabase functions logs unlim-chat --project-ref euqpdueopmlllqjmqnyb --limit 1000 | grep -c "anti_absurd_flag"
# Expected: <5% rate
```

**Answer template**:
- ☐ YES 5% canary ON (R7 canonical lift projection ≥80%)
- ☐ NO defer iter 32+ post C2 telemetry verify
- ☐ MODIFY ramp directly 25%

**Cascade unblock if YES**: Phase 5 master plan Atom 5.3 C3 ramp execution.

---

### ☐ Decisione #9 — Deno dispatcher 12-tool canary 5% (10min)

**Source doc**: priority matrix §3.5

**Question Andrea**: approve 12-tool Deno port implementation iter 41+ Maker-1 (~6-8h, Box 10 +0.05 ceiling) + canary 5% gate post-impl?

**ADR ratify**: ADR-032 PROPOSED → ACCEPTED post YES.

**Answer template**:
- ☐ YES (ADR-032 ACCEPTED + impl Maker-1 iter 41+)
- ☐ DEFER iter 42+
- ☐ NO mantengo surface-to-browser only

**Cascade unblock if YES**: Phase 5 master plan Atom 5.2 Deno dispatcher canary ramp.

---

### ☐ Decisione #10 — Vercel Atom 42-A modulePreload deploy verify (10min)

**Source doc**: priority matrix §3.6

**Question Andrea**: verify Vercel preview deploy URL post commit `69c9453` + Lighthouse measure post-deploy?

**Pre-ratify check**:

```bash
npx vercel ls --prod 2>/dev/null | head -5
# Expected: latest deploy from 69c9453 LIVE

# PageSpeed Insights manual:
# https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.elabtutor.school%2F%23chatbot-only
# https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.elabtutor.school%2F%23about-easter
```

**Answer template**:
- ☐ YES perf ≥70 promoted production (cascade gate Lighthouse PASS iter 31 intermediate)
- ☐ NO perf <70 → defer iter 42+ optim (lazy mount + image optim + font preload)
- ☐ MODIFY perf 50-69 → accept intermediate iter 31, target ≥90 iter 42+

**Cascade unblock if YES**: Lighthouse mechanical cap NOT triggered, iter 31 Phase 6+ score path.

---

### ☐ Decisione #12 — Phase E Voyage→Mistral re-ingest cleanup (15min)

**Source doc**: priority matrix §3.7

**Question Andrea**: confirm Voyage→Mistral re-ingest pivot + approve cleanup old Voyage chunks Supabase `rag_chunks` table?

**Pre-ratify check**:

```bash
psql "$SUPABASE_SERVICE_ROLE_URL" -c "
SELECT COUNT(*), source FROM rag_chunks GROUP BY source ORDER BY count DESC;
"
# Inspect counts before delete decision
```

**Answer template**:
- ☐ YES + run cleanup SQL (after verify count via SELECT)
- ☐ NO mantengo entrambi (Voyage + Mistral mixed pollutes hybrid retriever)
- ☐ MODIFY (e.g., archive Voyage chunks separate table NOT delete)

**Cascade unblock if YES**: Phase 4 master plan Step 4.4-4.6 Mistral re-ingest + page coverage ≥80%.

---

### ☐ Decisione #13 — ADR-040 Leonardo AI REJECT + FLUX MAINTAIN (30min)

**Source doc**: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md` §1 + §3 + §5 + §6 + §10

**Question Andrea**: confirm Leonardo REJECT + FLUX schnell MAINTAIN status quo + Imagen 3 Vertex AI europe-west4 Path B candidate?

**Pre-ratify check**:
- GDPR PNRR/MePA capitolati require strict EU residency? → Leonardo a priori excluded
- A/B 20-fumetti blind preference test budget €0.81 OK?
- Davide GDPR sign-off scheduled separately?

**Answer template**:
- ☐ YES ADR-040 ACCEPTED (Leonardo REJECT + FLUX MAINTAIN + Imagen 3 Path B candidate)
- ☐ MODIFY (e.g., FLUX MAINTAIN solo, NO Imagen 3 path planning)
- ☐ DEFER A/B test post iter 32+ Davide sign-off

**Cascade unblock if YES**: future fumetto upgrade path documented + locked-in NOT churn.

---

## §3. Post-ratify env provisioning checklist (Andrea action ~10min)

If Decisione #12 = YES:

```bash
# Verify SUPABASE_SERVICE_ROLE_KEY exported
echo "${SUPABASE_SERVICE_ROLE_KEY:+SET}${SUPABASE_SERVICE_ROLE_KEY:-MISSING}"

# If MISSING, copy from Supabase Dashboard → Settings → API → service_role key
export SUPABASE_SERVICE_ROLE_KEY="..."
echo 'export SUPABASE_SERVICE_ROLE_KEY="..."' >> ~/.elab-credentials/sprint-s-tokens.env
```

If Decisione #1 = YES + Mac Mini SSH key gen:

```bash
# SSH Mac Mini side (via current SSH from MacBook)
ssh progettibelli@100.124.198.59 << 'EOF'
ssh-keygen -t ed25519 -C "mac-mini-audit-bot@elab" -f ~/.ssh/id_ed25519_github_audit -N ""
cat ~/.ssh/id_ed25519_github_audit.pub
EOF

# Copy public key output to GitHub:
# https://github.com/USER/elab-builder/settings/keys → "Add deploy key"
# Title: "Mac Mini audit auto-push"
# Allow write access: ✅
```

---

## §4. Post-ratify activation iter 31

Once 8/8 ratify done:

1. Open NEW Claude Code conversation (NOT continue current — fresh session better)
2. Paste activation string from `docs/handoff/2026-05-02-iter-31-ACTIVATION-PROMPT-PASTE-READY.md` §1
3. Orchestrator iter 31 reads master plan + state files + verifies baselines
4. Phase 1 4 NEW skill creation execution (~4h Pattern S 6-agent OPUS)
5. Iter 31 Phase 7 close → Opus G45 review distinct context-zero session

---

## §5. Anti-pattern checklist Andrea ratify

- ❌ NO ratify senza reading source docs
- ❌ NO YES generic senza understand cascade unblock
- ❌ NO defer ALL → blocks iter 31 entirely
- ❌ NO continue iter 30 conversation (use fresh session)
- ❌ NO bypass env provisioning checklist
- ❌ NO claim "ratify done" senza explicit chat reply per ogni decisione

---

## §6. Acceptance gate Phase 0

- [ ] 8/8 decisioni Batch 1 ratify reply received
- [ ] Env vars verified (ELAB_API_KEY + SUPABASE_ANON_KEY + SUPABASE_SERVICE_ROLE_KEY + MISTRAL_API_KEY + CLOUDFLARE_API_TOKEN + TOGETHER_API_KEY exported)
- [ ] Mac Mini SSH access verified (Decisione #1)
- [ ] Vercel deploy LIVE post 69c9453 (Decisione #10)
- [ ] Edge Function v72 verified (Decisione #12)
- [ ] State files bootstrap verified (`automa/state/`)
- [ ] Vitest 13474 baseline verified
- [ ] Build PASS verified
- [ ] Activation prompt pasted NEW Claude Code conversation
- [ ] Pattern S 6-agent OPUS Phase 1 spawn ready

---

## §7. Cross-link

- Activation prompt: `docs/handoff/2026-05-02-iter-31-ACTIVATION-PROMPT-PASTE-READY.md`
- Master plan: `docs/superpowers/plans/2026-05-02-iter-31-RALPH-DEEP-SESSION-MASTER-PLAN.md`
- 13 decisioni priority matrix: `docs/audits/2026-05-02-iter30-andrea-13-decisioni-priority-matrix.md`
- ADR-040 Leonardo: `docs/adrs/ADR-040-fumetto-imagegen-provider-decision.md`
- Mac Mini gap analysis: `docs/audits/2026-05-02-iter30-mac-mini-audit-script-gap-analysis.md`
- Anti-regression mechanisms: `docs/audits/2026-05-02-iter30-ANTI-REGRESSION-ANTI-INFLATION-MECHANISMS.md`
- State files dir: `automa/state/`
- Iter 31 progress: `automa/state/iter-31-progress.md`

---

**Status**: PASTE-READY ratify checklist. Andrea action: ~30min reading + ~85min ratify + ~10min env provisioning = **~125min total wall-clock pre iter 31 Phase 1 spawn**.
