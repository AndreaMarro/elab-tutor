# Iter 40 entrance — Andrea ratify queue paste-ready

**Date**: 2026-05-02
**Pre-condition**: ralph iter 39 close `ed0ffc4` (5 atoms code shipped origin, 2/5 LIVE prod activated)
**Goal**: activate canaries + Vercel re-deploy + bench V2 vs V1 + close 5/5 LIVE prod

---

## §1 Setup environment

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
export SUPABASE_ACCESS_TOKEN=$(grep "^export SUPABASE_ACCESS_TOKEN" ~/.zshrc | cut -d= -f2- | tr -d '"\047 ')
export SUPABASE_ANON_KEY=$(grep "^export SUPABASE_ANON_KEY" ~/.zshrc | cut -d= -f2- | tr -d '"\047 ')
export ELAB_API_KEY=$(grep "^VITE_ELAB_API_KEY=" .env | cut -d= -f2 | tr -d '"\047 ')
```

---

## §2 Step 1 — Verify ralph iter 39 LIVE prod state

```bash
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions list --project-ref euqpdueopmlllqjmqnyb | grep -E "unlim-(chat|stt|tts|vision)"
# Expected:
#   unlim-chat v60+ ACTIVE (SSE backend + Onniscenza V2 + 12-tool dispatcher)
#   unlim-stt v13+ ACTIVE (Voxtral migration)
#   unlim-tts v29 ACTIVE (Voxtral primary)
#   unlim-vision v8 ACTIVE (Pixtral primary)

SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase secrets list --project-ref euqpdueopmlllqjmqnyb | grep -E "ENABLE_SSE|ONNISCENZA_VERSION|STT_PROVIDER|CANARY_DENO|VOXTRAL_VOICE_ID"
# Expected:
#   ENABLE_SSE=true (active)
#   ONNISCENZA_VERSION=v2 (active)
#   STT_PROVIDER=cf-whisper (default — NOT yet activated Voxtral)
#   CANARY_DENO_DISPATCH_PERCENT=0 (default — NOT yet activated)
#   VOXTRAL_VOICE_ID=9234f1b6-... (Andrea voice clone)
```

---

## §3 Step 2 — Resolve palette regression Sprint U main

**Bug**: Mac Mini Sprint U palette codemod commits introduced 913 undefined `var(--elab-hex-RRGGBB)` references + 1 broken HTML entity `&var(--elab-hex-128218);` in PercorsoPanel.jsx.

**Impact**: PR #57 merge to main → Vercel auto-deploy with palette regressions → blank page production. Currently rolled back to `fv22ymvq8` stable.

**Choose 1 of 3 options**:

### Option A (rapida 30min) — hotfix design-system.css

```bash
# Generate definitions for all 913 undefined --elab-hex-* vars
grep -rohE 'var\(--elab-hex-([0-9a-fA-F]{3,6})' src/ | \
  sort -u | \
  sed -E 's/var\(--elab-hex-(.+)/  --elab-hex-\1: #\1;/' > /tmp/hex-vars.css

# Append to design-system.css :root block
echo "/* iter 40 hotfix Sprint U palette codemod undefined vars */" >> src/styles/design-system.css
echo ":root {" >> src/styles/design-system.css
cat /tmp/hex-vars.css >> src/styles/design-system.css
echo "}" >> src/styles/design-system.css

# Fix broken HTML entity
sed -i '' 's/&var(--elab-hex-128218);/\&#128218;/g' src/components/lavagna/PercorsoPanel.jsx

# Verify
npx vitest run --reporter=basic 2>&1 | tail -3
npm run build 2>&1 | tail -5
```

### Option B (pulita 1h) — revert palette codemod commits selectively on main

```bash
# Find palette codemod SHAs
git log --oneline main | grep -E "palette|hex" | head -5
# Expected: 6239780 6d841b1 1b1e196

# Cherry-pick revert on main
git checkout main
git revert 6239780 6d841b1 1b1e196 --no-edit
git push origin main
```

### Option C (selettiva 2h) — clean cherry-pick e2e-bypass-preview only safe Sprint U commits

(already done iter 38 carryover — skip to Step 3 if main palette acceptable risk)

---

## §4 Step 3 — Vercel re-deploy frontend

```bash
cd "/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
npm run build && npx vercel --prod --yes --archive=tgz
# Expected: ~16min (build 14min + Vercel upload 2min)
```

Set Vercel env `VITE_ENABLE_SSE=true` via Vercel dashboard OR CLI:

```bash
npx vercel env add VITE_ENABLE_SSE production
# Paste: true
```

Verify:
```bash
curl -sI "https://www.elabtutor.school" | grep -E "HTTP|last-modified|etag"
# Expected: HTTP/2 200 + last-modified within last 30min
```

---

## §5 Step 4 — Activate canaries server-side

```bash
# A5 STT Voxtral canary (full activation since gradual via fallback in code)
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase secrets set STT_PROVIDER=voxtral --project-ref euqpdueopmlllqjmqnyb

# A3 OpenClaw 12-tool dispatcher canary 5%
SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase secrets set CANARY_DENO_DISPATCH_PERCENT=5 --project-ref euqpdueopmlllqjmqnyb
```

---

## §6 Step 5 — Smoke verify post-activation

### Smoke A1 SSE Streaming

```bash
curl -sN --max-time 30 -X POST "https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "x-elab-api-key: $ELAB_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"message":"Spiegate ai ragazzi cosa è un MOSFET","sessionId":"smoke-iter40-A1","experimentId":"v2-cap8-esp1","stream":true}' \
  2>&1 | head -15
# Expected: data: {"token":"R"} ... data: {"token":"agazzi, ..."} ... data: {"done":true,"pz_score":...,"intents_parsed":...}
```

### Smoke A2 voice clone Andrea (browser)

1. Open https://www.elabtutor.school in Chrome desktop
2. Click "Autorizza" in MicPermissionNudge
3. Verify mic button NOT visible in chat input bar
4. Say "Ehi UNLIM" → wake word fires
5. Speak: "Spiegate cosa è un LED"
6. Verify response visible AND audio plays Andrea voice

### Smoke A3 OpenClaw dispatcher (canary 5%)

```bash
# Run 20 requests with novel prompts (NOT matching L2 templates)
for i in {1..20}; do
  curl -s --max-time 15 -X POST "https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat" \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    -H "x-elab-api-key: $ELAB_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"Caricate esperimento custom $i con LED rossi\",\"sessionId\":\"smoke-canary-$i\",\"experimentId\":\"v1-cap6-esp1\"}" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('hit' if d.get('dispatcher_results') else 'miss', d.get('source')[:40])"
done
# Expected: ~1/20 'hit' (5% canary). Source varies (template/cache/LLM).
```

### Smoke A4 Onniscenza V2 (R5 bench)

```bash
# Already running — wait for completion + check report
ls -t scripts/bench/output/r5-stress-report-*.md | head -1 | xargs grep -E "Verdict|avg|p95|score|PASS|FAIL"
# Compare V1 baseline iter 32 (avg 1607ms / p95 3380ms / PZ V3 94.2%)
# Target V2: PZ V3 +5pp ≥99% + Vol/pag verbatim ≥95%
```

### Smoke A5 STT Voxtral

```bash
# Generate 10s test audio in Italian
say -v Alice -o /tmp/test-it.aiff "Ciao ragazzi oggi facciamo un esperimento con Arduino"
ffmpeg -y -i /tmp/test-it.aiff -ar 16000 -ac 1 -c:a libmp3lame /tmp/test-it.mp3

# POST to unlim-stt
curl -s -X POST "https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-stt" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "x-elab-api-key: $ELAB_API_KEY" \
  -H "Content-Type: audio/mpeg" \
  --data-binary @/tmp/test-it.mp3 \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('provider:', d.get('provider')); print('text:', d.get('text')); print('latency_ms:', d.get('latencyMs'))"
# Expected: provider='voxtral-transcribe-2' + text recognized + latency <500ms
```

---

## §7 Step 6 — Bench R5 V2 vs V1 + R7 canary ON

```bash
# R5 V2 active (already done by Andrea Step 4)
node scripts/bench/run-sprint-r5-stress.mjs
# Output: scripts/bench/output/r5-stress-report-{TS}.md
# Compare PZ V3 score V2 vs V1 (94.2% baseline)

# R7 canonical post canary 5%
node scripts/bench/run-sprint-r7-stress.mjs
# Output: r7-stress-report-{TS}.md
# Compare canonical % vs 3.6% baseline iter 38
# Target ≥80% post L2 scope reduce iter 41+
```

---

## §8 Step 7 — Andrea Opus indipendente review G45

Separate Claude session con context-zero:
- Read `docs/audits/iter-39-ralph-loop-FINAL-CLOSE-non-compiacente.md`
- Verify file system reality vs claims
- Verify smoke + bench scores
- Issue verdict: MERGE-READY OR REQUIRES-CHANGES + score onesto independent

```bash
# Spawn separate session
claude-code --print --no-session "Read docs/audits/iter-39-ralph-loop-FINAL-CLOSE-non-compiacente.md. Verify each claim against file system + git log + smoke evidence. Independent score onesto. NO compiacenza."
```

---

## §9 Acceptance gate iter 40 close

For Sprint T close 9.5 path:
- [ ] Vercel re-deploy LIVE post palette resolve
- [ ] Browser smoke voice mic-hide + Andrea TTS playback
- [ ] R5 V2 PZ V3 ≥99% (target +5pp)
- [ ] STT_PROVIDER=voxtral activated + 9-cell matrix verify
- [ ] CANARY_DENO_DISPATCH_PERCENT=5 active + 5% fire rate verified
- [ ] R7 canonical post-activation measure
- [ ] Andrea Opus G45 independent review verdict

If all 7 ✓: **5/5 atoms LIVE prod activated** — ralph stop condition met. Sprint T close 9.5/10 ONESTO conditional Lighthouse perf ≥90 + 94 esperimenti audit + Voyage re-ingest + Davide ADR-027 (iter 41-43).

---

**Activation prompt for Andrea iter 40 entrance**: paste this doc § sequence into terminal sequentially. ~2-4h Andrea wall-clock effort.
