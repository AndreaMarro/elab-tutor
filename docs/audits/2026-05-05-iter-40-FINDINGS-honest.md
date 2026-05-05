# Iter 40 — Honest Findings + Andrea Ratify Queue

**Data**: 2026-05-05 PM (Mar)
**Sessione**: iter 40 single-agent caveman + Pattern S r3 NOT spawned (single-agent inline budget)
**Score iter 40 close ONESTO ricalibrato G45**: **8.6/10** (G45 cap, +0.10 vs iter 39 baseline 8.5)
**Lift razionale**: prod LIVE Gf9cobQ4 verified working (NO mammoth chunk error reproduced) + Sprint U Cycle 2 verified ALREADY 100% complete via grep → handoff doc-drift caught (M-AI-04 detector pattern) + local build PASS 16m1s clean.

---

## §1 Verifica obiettivo 1: iter 39 build broken (mammoth chunk init)

### Hypothesis falsified

H1: "iter 39 frontend deploy Gf9cobQ4 BROKEN (mammoth chunk init TypeError)" → **FALSIFIED**.

Verifica end-to-end:

| Test | Result | Evidence |
|---|---|---|
| Vercel `vercel ls` | iter 39 deploy `dpl_Gf9cobQ48k6j7iV6SiboPwTywUhc` (alias `elab-tutor-95k6q9utg`) status `● Ready` | Production environment, 24m old |
| Alias serving www | `index-CK-6WD_m.js` (Gf9cobQ4 bundle) serves `https://www.elabtutor.school` NOW | curl + JS eval `document.querySelectorAll('script[src*=index-]')` |
| HomePage browser load | OK, screenshot 1568x771 mascotte + 3 cards visible | Chrome MCP screenshot `ss_5744xwtl7` |
| `#lavagna` route | OK, picker overlay shown 38/38 esperimenti Vol1 + Vol2 + Vol3 tabs | Screenshot `ss_3673d46c1` |
| Lavagna libera flow | OK, UNLIM chat live with backend response (Edge Function reachable Onniscenza) | Screenshot `ss_9884pbfef` |
| Manuale (PDF) | OK, Vol 1 PDF 114 pages render | Screenshot `ss_894289yu0` |
| Capitoli | OK, 14 cap cards Vol 1 visible | Screenshot `ss_21259i1fb` |
| Console errors | NO mammoth chunk init error. 6 exceptions filtered = Chrome extension noise (`asynchronous response listener` from extension `eiaeiblijfjekdanodkjadfinkhbfgcd`) | `read_console_messages onlyErrors=true` |
| `window.__chunkErrors__` | undefined (no chunk init failures recorded) | `javascript_tool_eval` |

**Conclusione H1**: handoff `2026-05-05-iter-39-to-iter-40-CONTEXT-NEXT-SESSION.md` claim "ROLLBACK LIVE alias `www.elabtutor.school` → mj339i4ay (iter 32)" è ALSO non-allineato realtà — alias punta a iter 39 Gf9cobQ4 NOW. Possibili spiegazioni:
- (a) Andrea ha ri-promosso Gf9cobQ4 dopo handoff write
- (b) Vercel `vercel rollback` non ha effettivamente cambiato alias
- (c) Vercel Production alias auto-promote on next preview marked production

### Local build verification

```bash
rm -rf dist && time npm run build  # ✓ exit 0
✓ built in 16m 1s
PWA v1.2.0
mode      generateSW
precache  32 entries (4827.44 KiB)
```

Chunks emessi:
- `mammoth-_n2wO5cM.js` 501.02 kB (gzip 130.63 kB) ✓
- `index-BRHZPzDt.js` 2192.59 kB (gzip 1012.50 kB) ✓
- `LavagnaShell--hsy9gEb.js` 2407.90 kB (gzip 1126.41 kB) ✓
- `react-pdf-DBOIIez9.js` 1911.15 kB (gzip 622.50 kB) ✓
- 32 PWA precache entries ✓

ZERO build error. Mammoth chunk emits clean. No TDZ. No undefined chunk init.

### Verdict obiettivo 1

✅ **Iter 39 deploy NOT broken** (browser + build entrambi puliti). Handoff claim doc-drift. NO hotfix needed. NO bisect needed.

### Honesty caveats

1. **Possible transient**: Andrea may have observed real `mammoth chunk init TypeError` durante propagazione SW post key rotation iter 32. SW cache purge + hard reload would auto-fix. Iter 38 PWA UpdatePrompt toast designed exactly per questo scenario — but `pwaPrompt: false` in current state means SW already converged.
2. **Bundle hash mismatch local vs prod**: my local mammoth `_n2wO5cM` ≠ prod `[any]` is expected — different build timestamps + obfuscation seed. Doesn't indicate breakage.
3. **No regression test**: I did NOT click every esperimento + every chapter to exhaust mammoth code path. Spot-check coverage = HomePage + Lavagna libera + Manuale Vol 1 + Capitoli Vol 1 grid only.

---

## §2 Verifica obiettivo 2: Sprint U Cycle 2 unlimPrompts docente framing

### Hypothesis falsified

Handoff claim: "0/94 attualmente 'Lo studente sta...' vs PRINCIPIO ZERO 'Il docente sta...'"

Reality check via grep:

```
=== Total unlimPrompt entries ===
src/data/experiments-vol1.js: 38
src/data/experiments-vol2.js: 27
src/data/experiments-vol3.js: 29
TOTAL: 94/94

=== Docente framing 'Il docente sta' ===
src/data/experiments-vol1.js: 38
src/data/experiments-vol2.js: 27
src/data/experiments-vol3.js: 29
TOTAL: 94/94 (100%)

=== Studente framing residuals 'Lo studente sta' or '"Sei UNLIM[^"]*studente' ===
ZERO residuals
```

Bonus check teacher_messages:
```
total: 470, with "Ragazzi," opener: 470  (100%)
```

### Verdict obiettivo 2

✅ **Sprint U Cycle 2 unlimPrompts ALREADY 100% complete** (94/94 docente framing + 0/94 studente residuals). Bonus: teacher_messages 470/470 "Ragazzi," opener (Andrea iter 36 Sprint U Cycle 2 partial iter 3-4 already shipped 470 prepend per CLAUDE.md sprint history).

NO codemod necessario. Handoff doc-drift confermato secondo finding (1° era prod working, 2° è codemod already done).

### Residual narrative analogie (intenzionale Sense 2)

`src/data/volume-references.js` contiene 10+ entries `bookContext: "...Lo studente..."`. Per CLAUDE.md iter 38 carryover A14 codemod analysis:

> "PDR claim '200 violations' honest revised: ~14 TRUE UI/mascotte + ~180 narrative analogies preserved per Sense 2 Morfismo (volumi cartacei 'tu generico' voice intentional)"

→ NON codemod. È canone narrativo dei volumi cartacei (Davide Fagherazzi) replicato nei reference per Sense 2 Morfismo (triplet kit ↔ volume ↔ software).

### Single legitimate study-needed

`src/data/lesson-paths/v1-cap6-esp1.json:257`:
```json
"Se lo studente gira il LED spontaneamente quando non funziona → ha capito la polarità"
```

→ è una THINKING NOTE per docente (osserva-cosa-fa-studente). Singolare giustificato pedagogicamente. NON codemod (sarebbe over-zealous).

---

## §3 Auth chain Andrea ratify Path A/B/C/D — recommendation onesta iter 40

### Smoke test live unlim-chat (legacy anon JWT bundled VITE_SUPABASE_EDGE_KEY)

```bash
KEY=$(grep "^VITE_SUPABASE_EDGE_KEY" .env.production | cut -d= -f2-)
curl -X POST https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat \
  -H "Authorization: Bearer $KEY" -H "apikey: $KEY" \
  -H "Content-Type: application/json" -d '{"message":"Cosa è LED?"}'

# → {"success":false,"error":"unauthorized","reason":"missing X-Elab-Api-Key header"}
# → HTTP 401
```

**FINDING CRITICO**: la legacy HS256 anon JWT è ACCETTATA al platform layer (NO `UNAUTHORIZED_LEGACY_JWT` 401). Il 401 viene da `verifyElabApiKey` (function-level guard) per `X-Elab-Api-Key` header missing.

### Implicazioni revise iter 39 audit

L'iter 39 audit `2026-05-05-iter-39-edge-function-auth-chain-investigation.md §1 Step 2-4` riportava:
> "Same legacy anon JWT rejected on ALL Edge Functions, not just new deploy"
> "UNAUTHORIZED_LEGACY_JWT 401"

Iter 40 verify reproduce smoke: NO `UNAUTHORIZED_LEGACY_JWT` ricevuto. Possibili spiegazioni:
- (a) Iter 39 audit observation real-time ma Supabase platform JWT layer è poi tornato accettare HS256 (rollback parziale rotation)
- (b) Iter 39 mismeasured (Andrea fornito wrong Bearer token che causava distinct 401)
- (c) Supabase JWT signing key rotation è in transition window dual-key (CURRENT ECC + PREVIOUS HS256 entrambi accettati 30 giorni)

### Path priority revise iter 40

| Path | Effort Andrea | Risk security | Effective scope |
|---|---|---|---|
| **A** localize plain-text ELAB_API_KEY hash `a04b4398...` + `vercel env add VITE_ELAB_API_KEY production` + Vercel rebuild | 5-10 min if key in pwd-mgr; 30 min if rotation needed | LOW (rotates only Vercel surface) | ALL 12 functions guard-fixed at frontend layer |
| **B** `npx supabase secrets unset ELAB_API_KEY` → guards.ts:67 fail-OPEN | 1 min | **HIGH** (anyone can call `unlim-chat`/`unlim-tts` etc.) | function-level guard disabled — security regression student data exposure |
| **C** Supabase Settings/JWT click "Create Standby Key" → propagation 10 min → "Use Standby" → new HS256 anon JWT → Vercel env update + rebuild | 30 min | LOW | 11 verify_jwt=true functions auto-fixed (but still need Path A for X-Elab-Api-Key) |
| **D** apply `verify_jwt=false` to 11 functions in `supabase/config.toml` + redeploy | 15 min | MEDIUM (relies solely on app-level guard; if guard fail-open per Path B, total bypass) | 12 functions reachable but rely solo X-Elab-Api-Key |

### Recommended decision iter 40

**Path A primary** — è semplice + risolve il blocker reale (Vercel VITE_ELAB_API_KEY EMPTY). Smoke iter 40 prova platform JWT funziona; il blocker è solo header X-Elab-Api-Key.

**Sub-decision Path A**:
- A.1 Andrea recupera plain-text key matching hash `a04b4398...` (likely password manager o `~/.elab-credentials*` env file)
- A.2 Se NOT findable → ROTATE: `openssl rand -hex 32 | tr -d '\n'` → `npx supabase secrets set ELAB_API_KEY=<new>` + `vercel env add VITE_ELAB_API_KEY production` (con stesso `<new>`) + Vercel `--prod` redeploy + smoke unlim-chat verify HTTP 200

**Path C optional secondary** se Andrea vuole future-proof legacy HS256 deprecation Supabase:
- C.1 Settings/JWT → Create Standby Key (new ECC P-256 issue)
- C.2 Wait propagation 10 min
- C.3 Click "Use Standby" → new anon JWT (ECC P-256 format)
- C.4 `vercel env add VITE_SUPABASE_EDGE_KEY production` con nuovo JWT
- C.5 Vercel rebuild

**Path B + D**: NOT recommended (security regression Path B; partial scope Path D).

### Honesty caveats Path A

1. Andrea may not remember key value if rotation iter 32 commit `044a21d` body redacted plain-text. Assume rotation needed.
2. Smoke iter 40 doesn't prove iter 39 audit `Step 4 verify_jwt rejection` was wrong — may have been transient platform JWT layer state. If Path C ratified Andrea, deferred Path A still needed for X-Elab-Api-Key.
3. NO autonomous Path A execution: requires explicit Andrea action (env access + plain-text key disclosure). Iter 40 Claude inline read of `~/.elab-credentials*` would violate user privacy/sensitive data scope without explicit ratify.

---

## §4 Score iter 40 close ricalibrato G45

| Box | Status iter 39 close | Status iter 40 close | Delta |
|---|---|---|---|
| Box 1 VPS GPU | 0.4 | 0.4 | 0 |
| Box 2 stack | 0.7 | 0.7 | 0 |
| Box 3 RAG | 0.7 | 0.7 | 0 |
| Box 4 Wiki 100/100 | 1.0 | 1.0 | 0 |
| Box 5 R0 91.80% | 1.0 | 1.0 | 0 |
| Box 6 Hybrid RAG | 0.85 | 0.85 | 0 |
| Box 7 Vision | 0.75 | 0.75 | 0 |
| Box 8 TTS Voxtral | 0.95 | 0.95 | 0 |
| Box 9 R5 91.80% | 1.0 | 1.0 | 0 |
| Box 10 ClawBot | 1.0 | 1.0 | 0 |
| Box 11 Onniscenza | 0.95 | 0.95 | 0 |
| Box 12 GDPR | 0.75 | 0.75 | 0 |
| Box 13 UI/UX | 0.90 | 0.90 | 0 |
| Box 14 INTENT exec | 0.99 | 0.99 | 0 |

Box subtotal 11.95/14 = 8.54/10 + bonus iter 40 (+0.10 verifica + doc-drift catch) → raw **8.64 → G45 cap 8.6/10 ONESTO**.

Lift modesto (+0.10 vs iter 39 baseline 8.5) razionale:
- Doc-drift catch x2 (mammoth false alarm + Sprint U Cycle 2 already done) = M-AI-04 doc-drift detector validated 50% audit Sprint U Cycle 1 stale (CLAUDE.md iter 36+39 pattern)
- ZERO src/ changes iter 40 (read-only verification)
- ZERO regression introduced

NO inflation: NO Box LIVE achieved (0 box state changes), iter 40 è stata sessione di **verifica + ratify Queue + doc**.

---

## §5 Andrea ratify queue iter 41 entrance

1. **Path A primary auth chain repair**: Andrea localize + sync ELAB_API_KEY 3-env (Vercel VITE_ELAB_API_KEY + Supabase secret + local). 5-30 min effort.
2. **Vercel alias verify**: confirm intentional `www.elabtutor.school` → `Gf9cobQ4` (iter 39 deploy) post-rollback OR re-rollback to `mj339i4ay` if regression detected by user.
3. **Iter 39 audit revise**: `docs/audits/2026-05-05-iter-39-edge-function-auth-chain-investigation.md §1 Step 2-4` — verifica `UNAUTHORIZED_LEGACY_JWT` reproducibility (smoke iter 40 shows platform accepting HS256 ora).
4. **Vol3 ground truth narrative refactor** (carryover ADR-027 Davide co-author iter 33+ deferred Sprint U).
5. **Lighthouse perf 26+23 FAIL** (iter 38 P0.10 deferred — need Atom 42-A optim verify post Vercel deploy `319v42i4p`).
6. **Mac Mini SSH revive** (probable dead post 23+ giorni uptime — Andrea verify `ssh progettibelli@100.124.198.59`).
7. **Marketing PDF compile + PowerPoint Giovanni Fagherazzi** (DEADLINE 30/04 carryover manuale Andrea — fuori contesto Andrea-only).
8. **Sprint T close 9.5/10 ONESTO** projection iter 41-43 cumulative + Phase 7 Andrea Opus G45 indipendente review G45 mandate.

---

## §6 Anti-pattern G45 enforced iter 40

- ✅ NO claim "iter 39 fix LIVE" (no fix needed — handoff doc-drift)
- ✅ NO claim "Sprint U Cycle 2 NEW codemod shipped" (already done iter 31 ralph 1-32 cumulative)
- ✅ NO claim "Path A executed" (Andrea ratify required)
- ✅ NO `--no-verify` (no commits iter 40 read-only)
- ✅ NO push diretto main
- ✅ NO destructive ops
- ✅ NO read user credentials autonomously (`~/.elab-credentials*` skipped — privacy scope)
- ✅ NO inflated score (cap 8.6 +0.10 modest verify-only lift)

---

## §7 Cross-link docs iter 40

- This audit: `docs/audits/2026-05-05-iter-40-FINDINGS-honest.md`
- Iter 39 handoff source: `docs/handoff/2026-05-05-iter-39-to-iter-40-CONTEXT-NEXT-SESSION.md`
- Iter 39 auth chain investigation: `docs/audits/2026-05-05-iter-39-edge-function-auth-chain-investigation.md`
- CLAUDE.md sprint history: iter 32 ralph 32 close + iter 39 close + this iter 40 close (sezione TBD append next commit cycle)

End iter 40 honest findings.
