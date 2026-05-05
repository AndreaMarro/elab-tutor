# Iter 39 Cronologia Edge Function NOT DEPLOYED — Root Cause Found

**Andrea problema #3**: "permane il problema del salvataggio delle sessioni con breve riassunto nella cronologia"

**Status**: 🎯 ROOT CAUSE FOUND — Andrea action mandatory iter 39+ (Supabase token refresh).

---

## §1 Diagnosis

**Test diretto Edge Function**:
```bash
curl -X OPTIONS https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-session-description
# Result: HTTP 404 + "Requested function was not found"

curl -X POST https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-session-description \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d '{"sessionId":"test","messages":[]}'
# Result: {"code":"NOT_FOUND","message":"Requested function was not found"}
```

**Verify altre Edge Functions deployed**:
```bash
curl -X OPTIONS https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-chat
# Result: HTTP 204 (deployed correctly)
```

**Conclusione**: Edge Function `unlim-session-description` codice ESISTE ma NON deployed prod.

## §2 Code path verified intact

`src/components/HomeCronologia.jsx`:
- Line 9-10: descrizione AI brief riassunto (`description_unlim`) cached server-side
- Line 220: triggers fetch batch if `description_unlim` assent + `messages.length>0`
- Line 382-397: fetch `unlim-session-description` Edge Function
- Line 435: `hasMessages` check before fetch
- Line 516-536: batch fetch coordination

`supabase/functions/unlim-session-description/`:
- `index.ts` esiste
- `_helpers.ts` esiste
- Imports `_shared/llm-client.ts` + `gemini.ts` + `types.ts` + `mistral-client.ts` + `together-fallback.ts` + `guards.ts`

## §3 Andrea bug correlation

**Andrea perceived bug**: "permane il problema del salvataggio delle sessioni con breve riassunto nella cronologia"

**Actual flow attuale prod**:
1. User completes session → sessions saved Supabase ✓ (saveSession works)
2. HomeCronologia mounts → render session list with `description_unlim` field
3. If `description_unlim` empty + `messages.length > 0` → fetch Edge Function
4. **fetch returns HTTP 404** → silent fail → fallback locale shows "X interazioni, Ymin"
5. User MAI vede AI brief riassunto

## §4 Fix required (Andrea action)

**Deploy Edge Function**:
```bash
SUPABASE_ACCESS_TOKEN=sbp_<REFRESH_TOKEN> \
  npx supabase functions deploy unlim-session-description \
  --project-ref euqpdueopmlllqjmqnyb
```

**Block iter 39 attempt**: deploy command returns `unexpected deploy status 401: {"message":"Unauthorized"}` con token attuale `sbp_86f828bce8ea9f09acde59a942986c9fd55098c0`. Token expired OR insufficient privilegi.

**Andrea action mandatory iter 39+**:
1. Refresh Supabase access token via dashboard https://supabase.com/dashboard/account/tokens
2. Save new token `~/.elab-credentials/sprint-s-tokens.env` (chmod 600)
3. Run deploy command with NEW token
4. Verify HTTP 200 OPTIONS post-deploy:
   ```bash
   curl -X OPTIONS https://euqpdueopmlllqjmqnyb.supabase.co/functions/v1/unlim-session-description
   ```

## §5 Post-deploy verification iter 39+

After Andrea deploys Edge Function:
1. Navigate prod LIVE www.elabtutor.school + complete 1-2 sessions
2. Open Cronologia card homepage
3. Verify session entries show AI-generated `description_unlim` (not fallback "X interazioni Ymin")
4. Live test scenario: 5 messages session → wait fetch batch → verify riassunto appears

## §6 Anti-pattern G45

- ✅ NO claim Cronologia "fixed" (root cause shown MA Andrea action gates fix)
- ✅ NO compiacenza ("infrastructure exists" was misleading without deploy verify)
- ✅ ONESTO HTTP 404 evidence file:line documented
- ✅ Andrea action enumerated explicit

End Cronologia investigation iter 39 — Andrea Supabase token refresh + deploy gate.
