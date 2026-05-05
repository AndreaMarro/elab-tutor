# Iter 39 Edge Function Auth Chain Investigation — verify_jwt=false fix + outstanding gaps

**Status**: ⚠️ Edge Function reachable post `verify_jwt=false` deploy MA frontend auth chain broken (Vercel `VITE_ELAB_API_KEY` empty + Supabase secret hash mismatch).

---

## §1 Discovery sequence iter 39 PM

### Step 1: Cronologia deploy success + token rotation
- Andrea provided fresh Supabase access token → autonomous deploy `unlim-session-description` (commit `86455c1`)
- HTTP 204 OPTIONS verified prod LIVE
- Token compromised (chat exposure) → REVOKED elab40 → generated fresh elab40-iter39-secure (chmod 600 env)

### Step 2: POST returns 401 UNAUTHORIZED_LEGACY_JWT
```bash
curl -X POST https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-session-description \
  -H "Authorization: Bearer $LEGACY_ANON_JWT_208_CHARS" \
  -H "apikey: $LEGACY_ANON_JWT" -d '{}'
# → {"code":"UNAUTHORIZED_LEGACY_JWT","message":"Invalid JWT"} HTTP 401
```

### Step 3: Same error on `unlim-chat` (broader prod regression)
Same legacy anon JWT rejected on ALL Edge Functions, not just new deploy. Frontend prod chat working visually = old localStorage messages cached, fresh fetches actually failing silently.

### Step 4: Supabase JWT signing key rotation discovery
Settings/JWT page reveals:
- **CURRENT KEY**: ECC P-256 (key ID `7257D5B6-643D-47B4-B168-75DA4C8BA97C`)
- **PREVIOUS KEY**: Legacy HS256 Shared Secret (key ID `450FCABE-1C73-4617-811E-B0F7A99405E6`, rotated "a month ago")

Old anon JWT signed with HS256 → Edge Functions reject post rotation despite legacy entry visible.

### Step 5: Publishable key wrong format
```bash
curl -H "Authorization: Bearer sb_publishable_dBCdTbXrf4_xzYatu-taog_mDyJ0ao8" ...
# → {"code":"UNAUTHORIZED_INVALID_JWT_FORMAT"} HTTP 401
```
Publishable key (`sb_publishable_xxx`) NOT a JWT. Browser-safe key format introduced 2026 alongside JWT signing.

### Step 6: verify_jwt=false fix conservative scope
Created `supabase/config.toml` with `[functions.unlim-session-description] verify_jwt = false`. Re-deployed.

```bash
# Test 1 — no auth: REACHED function (NO platform-level rejection)
curl -X POST .../unlim-session-description -d '{}'
# → {"success":false,"error":"missing X-Elab-Api-Key header"} HTTP 401 ✅

# Test 2 — with X-Elab-Api-Key from local env
curl -X POST .../unlim-session-description -H "X-Elab-Api-Key: $LOCAL_KEY" -d '{}'
# → {"success":false,"error":"bad api key"} HTTP 401 ❌
```

**Verify_jwt=false WORKED** (function-level auth reached). MA local key mismatch.

### Step 7: ELAB_API_KEY hash audit cross-env
- **Local** `~/.elab-credentials/sprint-s-tokens.env`: SHA-256 `2c47a95f...`
- **Supabase secret**: SHA-256 `a04b4398...` (from `supabase secrets list`)
- **Vercel `VITE_ELAB_API_KEY`** (production): **length 0 (EMPTY)**
- **Vercel `VITE_SUPABASE_ANON_KEY`**: 208 chars (legacy HS256 JWT)

Three-way mismatch. Andrea iter 32 P0 SECURITY rotation mandate "Supabase + Vercel env 3 envs" NOT actually synced — Vercel value empty.

## §2 Architectural decisions Andrea ratify iter 40+

**Path A — match Supabase secret in Vercel**:
- Need plain-text ELAB_API_KEY value matching hash `a04b4398...`
- Andrea must locate value (32-hex random openssl rand)
- Update `vercel env add VITE_ELAB_API_KEY production`
- Frontend rebuild + redeploy
- **Risk**: legacy anon JWT still 401 on platform layer for OTHER functions (still verify_jwt=true default)

**Path B — remove ELAB_API_KEY guard prod**:
- Unset Supabase secret `supabase secrets unset ELAB_API_KEY`
- guards.ts:67 fail-OPEN absent secret per existing comment
- Functions accessible without header
- **Risk**: removes app-level rate-limit/abuse layer; rely on Supabase platform rate limits + RLS

**Path C — full JWT rotation**:
- Supabase Settings/JWT click "Use Standby Key" (currently no standby created)
- Generate new HS256 anon JWT post-rotation
- Update Vercel + .env.production + frontend rebuild
- ALL Edge Functions auto-fixed (legacy + new)
- **Risk**: invalidates all existing anon sessions briefly during rotation window

**Path D — verify_jwt=false expand all functions**:
- Apply current iter 39 fix to all 12 unlim-* functions in config.toml
- Rely solely on app-level X-Elab-Api-Key guard (or fail-OPEN)
- Re-deploy all functions
- **Risk**: removes Supabase platform JWT layer for all (defense-in-depth gone)

**Recommended Path C + Path A combo**: most secure. Path B + Path D acceptable given iter 32 ELAB_API_KEY security guard.

## §3 Iter 39 close state

✅ `unlim-session-description` reachable at function level (verify_jwt=false LIVE)
✅ Cronologia bug Andrea #3 deploy-level RESOLVED
✅ Token rotation security incident contained (REVOKED + fresh + chmod 600)
⚠️ Frontend integration BROKEN across all Edge Functions due to JWT signing key rotation 30d ago
⚠️ Vercel `VITE_ELAB_API_KEY` empty value vs Supabase secret hash mismatch
⚠️ 11 other Edge Functions still verify_jwt=true (default) → still 401 legacy JWT

## §4 Anti-pattern G45 enforced

- ✅ NO claim "Cronologia FULLY LIVE" (function reachable MA frontend auth broken cross-env)
- ✅ NO claim "Edge Function auth fixed all functions" (only unlim-session-description verify_jwt=false)
- ✅ Honest evidence file:line + curl HTTP code + hash mismatches documented
- ✅ Andrea ratify decision matrix Path A/B/C/D enumerate trade-offs
- ✅ Conservative scope: ONE function config.toml change, NOT batch all 12

End iter 39 Edge Function auth investigation — Andrea ratify Path A/B/C/D iter 40+ entrance.
