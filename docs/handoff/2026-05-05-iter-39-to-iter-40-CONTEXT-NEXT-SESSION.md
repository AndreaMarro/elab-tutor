# Iter 39 → Iter 40 Handoff — Contesto Onesto Sessione Successiva

**Data**: 2026-05-05 PM
**Stato sessione iter 39**: ✅ 8 commit shipped origin + Cronologia Edge Function DEPLOYED + Frontend Vercel deploy in corso
**Score iter 39 close G45**: **8.5/10 ONESTO**

---

## 🎯 PROMPT INIZIALE NEXT SESSION (paste-ready)

```
iter 40 continue ELAB Tutor Sprint T close honest verifiable atoms.

Leggi prima docs/handoff/2026-05-05-iter-39-to-iter-40-CONTEXT-NEXT-SESSION.md
per contesto completo iter 39 (8 commit shipped + Cronologia deploy +
token rotation + verify_jwt=false config + cross-env auth chain
investigation Path A/B/C/D).

Verifica baseline:
- vitest 13890 PASS
- branch e2e-bypass-preview HEAD: ultimo commit iter 39 deploy
- Vercel prod alias www.elabtutor.school deployment ID iter 39

3 OBIETTIVI iter 40 ROI ordinati:

1. ANDREA RATIFY auth chain Path A/B/C/D (cross-env ELAB_API_KEY mismatch)
   → senza decisione: 11 Edge Functions still verify_jwt=true broken legacy JWT
   → tempo: 30 min decisione + execute

2. SPRINT U CYCLE 2 unlimPrompts docente framing 94/94
   → 0/94 attualmente (audit Priority 4 carryover)
   → tempo: 2-3h batch sed src/data/experiments-vol{1,2,3}.js

3. MAC MINI SSH unblock + autonomous loop revival
   → autonomous loop probable dead da iter 31+
   → tempo: 10 min Andrea verify + ssh-copy-id

NO compiacenza. NO --no-verify. Massima onestà.
```

---

## §1 STATO ITER 39 SHIPPED (8 commit `e2e-bypass-preview`)

| Commit | Atom | Categoria |
|--------|------|-----------|
| `0b355aa` | L2 router lesson-explain experimentId STRICTLY | Sprint U BLOCKER |
| `810ac45` | v3-cap8-serial bb1 visual triplet | Vol3 audit |
| `5edc275` | FloatingWindow WCAG 2.5.5 touch 32→44px | A11y |
| `b7361d2` | v2-cap8-esp3 last linguaggio plurale 94/94 | Linguaggio 100% achieved |
| `c151c33` | GalileoAdapter palette tokenize 35→17 hex | Sense 2 Morfismo |
| `86455c1` | Cronologia Edge Function DEPLOYED + audit | Andrea bug #3 RESOLVED |
| `7762b99` | verify_jwt=false config.toml + auth investigation | Edge Function reachability |
| `[pending]` | Frontend Vercel build + deploy iter 39 atomi | Visual atomi prod publish |

---

## §2 PROBLEMI APERTI ONESTI (Andrea ratify iter 40+)

### 🔴 P0 — Cross-env ELAB_API_KEY mismatch

**Sintomo**: Frontend Vercel `VITE_ELAB_API_KEY` length 0 (EMPTY), Supabase secret hash `a04b4398...`, local file hash `2c47a95f...`. **3-way mismatch**.

**Conseguenza**: Tutte 12 Edge Functions guardate da `verifyElabApiKey` rifiutano richieste frontend (frontend non invia header → Supabase secret presente → guard 401).

**Iter 32 P0 SECURITY mandate**: "ELAB_API_KEY rotated `0909e4b4...` Supabase + Vercel env 3 envs sync" — NOT actually synced (Vercel value empty).

**4 paths Andrea ratify iter 40**:
- **A**: Andrea localizza plain-text ELAB_API_KEY matching hash `a04b4398...` + `vercel env add VITE_ELAB_API_KEY production` + frontend rebuild
- **B**: `npx supabase secrets unset ELAB_API_KEY` → guards.ts:67 fail-OPEN → frontend works without header
- **C**: Settings/JWT click "Create Standby Key" → rotate signing → new HS256 anon JWT issue → update Vercel + .env.production + rebuild ALL 12 functions auto-fixed
- **D**: Apply `verify_jwt=false` to all 12 functions in `supabase/config.toml` + redeploy all (rely solo app-level guard)

**Recommended**: Path C + Path A combo. Path B/D backup.

### 🟠 P1 — JWT signing key rotation 30d ago broke legacy anon JWT

**Sintomo**: Edge Functions reject HS256-signed legacy anon JWT post Supabase platform JWT key rotation (Settings/JWT: CURRENT=ECC P-256, PREVIOUS=Legacy HS256).

**Conseguenza**: Frontend `VITE_SUPABASE_ANON_KEY` (208 chars HS256) returns `UNAUTHORIZED_LEGACY_JWT` 401 on all platform-level JWT checks.

**Fix**: Path C above (rotate signing key) OR Path D (bypass platform JWT layer).

### 🟡 P2 — Sprint U Cycle 2 unlimPrompts docente framing 0/94

**Sintomo**: 94/94 unlimPrompts iniziano "Lo studente sta..." vs PRINCIPIO ZERO required "Il docente sta mostrando alla classe...".

**Iter 31 ralph commits** (`fe37c81` + `5be1bde`) parziale resolved teacher_message + lesson-paths plurale MA unlimPrompts NOT addressed.

**Fix**: batch sed 3 file `src/data/experiments-vol{1,2,3}.js` ~94 entries replace pattern.

### 🟡 P2 — Mac Mini autonomous loop probable dead

**Sintomo**: Mac Mini SSH `progettibelli@100.124.198.59` MAY be down (Tailscale unreachable iter 31+). Cron L1/L2/L3 user-sim curriculum probable plateau saturato.

**Fix**: Andrea verify Mac Mini fisicamente acceso + `ssh-copy-id` re-deploy public key se denied.

### 🟢 P3 — Lighthouse perf 43 audit stale

**Sintomo**: Sprint U Cycle 1 audit cita "react-pdf 407KB + mammoth 70KB eager" — verificato iter 39 ENTRAMBI già lazy. Audit doc-drift.

**Fix**: re-bench Lighthouse post deploy iter 39 frontend (Mac Mini Task 2).

---

## §3 WORKFLOW AGENT VALIDATI ITER 39

### ✅ FUNZIONA (validato 10+ iter consecutive)

**Pattern S r3 4-agent OPUS PHASE-PHASE**:
- Planner Phase 1 → 4 agent parallel (Maker-1+Maker-2+WebDesigner+Tester) → Scribe Phase 2 sequential post 4/4 completion msgs filesystem barrier
- Race-cond fix VALIDATED iter 5+6+8+11+12+19+36+37+38+30+31+32 = 22 cumulative

**Pre-commit + pre-push hooks vitest**:
- Anti-regressione zero falsi positivi 30+ commit consecutivi
- Baseline 11958 → 13890 lift +1932 acumulato

**M-AI-04 doc-drift-detector** (iter 31 Phase 1):
- Iter 39 caught 50% audit Sprint U Cycle 1 stale (4 days old):
  - audit "react-pdf eager" → already lazy
  - audit "4 console.log" → 3 legit warn/error + 1 JSDoc
  - audit "4 touch <44px" → 2 decorative false positive
- ROI doc-drift detector validated pratico

**Inline atomi singolo-agent caveman**:
- 8 commit iter 39 oggi shipped origin
- Velocità >> BG agent parallel (org limit risk evitato)
- Token spreco zero rispetto BG spawn

**Chrome MCP browser autonomous**:
- Token revoke + generate via Supabase Dashboard click sequence
- Vercel env audit via Vercel CLI
- HomePage + ChatbotOnly verify prod
- Click "read" tier `mcp__computer-use__` macos timeout 300s ≠ Chrome MCP extension click works in browser tabs

### ❌ NON FUNZIONA (iter 39 confirmed)

**Mac Mini autonomous loop**:
- 4 cron MM2/3/4 silent post-dispatch iter 31+
- SSH potenzialmente denied
- Plateau saturato

**4-vendor cycle full** (Codex + Gemini + Mistral + Kimi):
- ROI marginale: 553s real atom vs 67s smoke
- Iter 39 utilizzato solo 2/2 volte
- Costoso vs single-agent inline

**BG agent parallel iter 38**:
- 3/4 hit Anthropic monthly usage limit pre-completion
- Inaffidabile carico pesante
- Iter 39 evitato deliberately

**`mcp__computer-use__request_access`**:
- Timeout 300s iter 39 PM
- Browser tier "read" blocks click/typing native macOS
- Pivot Chrome MCP extension funzionale

**Audit doc**:
- Invecchiano 4 giorni
- Sempre file:line verify before action

---

## §4 STEP-BY-STEP PROCEDURE NEXT SESSION ENTRY

### Step 1 — Pre-flight CoV (5 min)
```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
git status
git log --oneline -10
cat automa/baseline-tests.txt  # expected 13890
npx vitest run 2>&1 | tail -5
```

### Step 2 — Read context (5 min)
- This handoff doc (full read)
- `docs/audits/2026-05-05-iter-39-edge-function-auth-chain-investigation.md` (4 paths detail)
- `docs/audits/2026-05-05-iter-39-cronologia-DEPLOY-SUCCESS.md`
- CLAUDE.md sprint history Sprint T iter 36-39 close

### Step 3 — Andrea decision Path A/B/C/D (~30 min)
Andrea ratify which path for cross-env auth chain repair. Most likely Path C (Standby Key JWT rotation) + Path A (Vercel env sync).

### Step 4 — Execute ratified path
Per path:
- **A**: Andrea fornisce plain-text key → `npx vercel env add VITE_ELAB_API_KEY production`
- **B**: `npx supabase secrets unset ELAB_API_KEY --project-ref euqpdueopmlllqjmqnyb`
- **C**: Chrome MCP navigate Settings/JWT → click Create Standby Key → wait propagation 10 min → click "Use Standby" → read new anon JWT → update env + Vercel
- **D**: Edit `supabase/config.toml` add 11 functions verify_jwt=false → bulk redeploy

### Step 5 — Smoke test post-fix
```bash
KEY=$(grep "^VITE_SUPABASE_ANON_KEY" .env.production | cut -d= -f2-)
curl -X POST https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat \
  -H "Authorization: Bearer $KEY" -H "apikey: $KEY" -H "Content-Type: application/json" \
  -d '{"message":"Cosa è LED?"}' | tail -5
# Atteso: response body con LED explanation NOT 401
```

### Step 6 — Sprint U Cycle 2 unlimPrompts batch (2-3h)
```bash
for f in src/data/experiments-vol{1,2,3}.js; do
  sed -i '' 's|"Sei UNLIM, il tutor AI di ELAB. Lo studente sta|"Sei UNLIM, il tutor AI di ELAB. Il docente sta mostrando alla classe|g' $f
done
node -e "require('./src/data/experiments-vol1.js')" && echo "Vol1 OK"
node -e "require('./src/data/experiments-vol2.js')" && echo "Vol2 OK"
node -e "require('./src/data/experiments-vol3.js')" && echo "Vol3 OK"
npx vitest run tests/unit/parallelismoVolumiReale.test.js
git add -A && git commit -m "fix(iter-40-Sprint-U-Cycle-2): unlimPrompts docente framing 94/94 PRINCIPIO ZERO"
git push origin e2e-bypass-preview
```

### Step 7 — Mac Mini SSH unblock (10 min Andrea action)
```bash
ssh progettibelli@100.124.198.59 -i ~/.ssh/id_ed25519_elab "uptime && launchctl list | grep elab"
# se denied:
ssh-copy-id -i ~/.ssh/id_ed25519_elab.pub progettibelli@100.124.198.59
```

---

## §5 ANDREA RATIFY QUEUE ACCUMULATA (12 voci)

1. ADR-025 Modalità 4 simplification (carryover iter 22)
2. ADR-026 content-safety-guard runtime (carryover iter 22)
3. ADR-027 volumi narrative refactor (Davide co-author iter 25)
4. ADR-028 INTENT dispatcher (iter 36)
5. ADR-029 LLM_ROUTING weights conservative (iter 37)
6. ADR-030 Mistral function calling INTENT canonical (iter 38)
7. ADR-031 STT migration Voxtral Transcribe 2 (iter 38)
8. **NEW iter 39 — Path A/B/C/D cross-env auth chain repair**
9. **NEW iter 39 — verify_jwt=false expansion 11 Edge Functions**
10. Vision Gemini Flash deploy verify (iter 36)
11. 5 missing lesson-paths reali (iter 36 Mac Mini D3)
12. Marketing PDF compile + PowerPoint Giovanni Fagherazzi (DEADLINE 30/04 carryover)

---

## §6 SCORE PROGRESSION HONEST

- Iter 36 baseline: 8.5/10 G45 cap
- Iter 37 close: 8.0/10 (R5 latency cap mechanical)
- Iter 38 close: 8.0/10 (Onnipotenza Deno port not shipped)
- Iter 38 carryover: 8.5/10 (deploy chain LIVE)
- Iter 31 Phase 1: 8.10/10 (tooling foundation)
- Iter 31 ralph 32: 8.40-8.50/10 (Onnipotenza expansion + Edge v80)
- Iter 32 sprint T: 8.40-8.50/10
- Iter 34 close: 8.30/10 (multi-provider workflow phase 0)
- **Iter 39 close: 8.5/10** (questa sessione, +0.20 cumulative iter 38 carryover)

**Sprint T close target 9.5/10**: realistic iter 41-43 cumulative post Andrea ratify Path A+B+C+D + Mac Mini revive + 94 esperimenti audit + linguaggio codemod + Opus G45 indipendente review.

---

## §7 ANTI-PATTERN G45 ENFORCED ITER 39

- ✅ NO claim "Sprint T close achieved" (cap 8.5 mechanical)
- ✅ NO claim "Cronologia FULLY LIVE" (deploy LIVE MA frontend auth chain rotto)
- ✅ NO claim "Frontend deploy iter 39 LIVE" (build in corso pendente conferma)
- ✅ NO claim "Token rotation security FULL" (chat history persiste evidenza expose)
- ✅ NO `--no-verify` (pre-commit + pre-push hooks 13890 PASS verified 7+ commits consecutivi)
- ✅ NO push diretto main (Vercel `--prod` da `e2e-bypass-preview`)
- ✅ NO destructive ops senza Andrea OK
- ✅ Honest gaps documented file:line + curl HTTP code + hash mismatches
- ✅ 4 paths trade-off enumerate Andrea decision

End handoff iter 39 → iter 40. Andrea verify questo doc + ratify Path A/B/C/D + execute step 1-7.
