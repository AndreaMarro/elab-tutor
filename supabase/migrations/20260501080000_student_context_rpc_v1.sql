-- iter 39 Tier 1 T1.3 — student_context_v1 single RPC
--
-- ROOT CAUSE: `_shared/memory.ts:loadStudentContext` performs 2 sequential
-- REST calls (student_progress, student_sessions). Each ~80-200ms p50 + 250-800ms p95
-- network round-trip. Total p95 latency sequential = ~250-1000ms.
--
-- FIX: collapse into 1 RPC round-trip. Single network hop. Projected p95 saving:
-- ~250-500ms (per latency research §2.3 T1.3).
--
-- Idempotent: CREATE OR REPLACE FUNCTION + GRANT EXECUTE.
-- Apply via: SUPABASE_ACCESS_TOKEN="<token>" npx supabase db push --linked
-- iter 39 owner: orchestrator inline (Tier 1 latency optims session 2026-05-01)

CREATE OR REPLACE FUNCTION public.student_context_v1(p_session_id text)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'progress', (
      SELECT row_to_json(p) FROM (
        SELECT completed_experiments, common_mistakes, level, last_experiment_id
          FROM public.student_progress
         WHERE session_id = p_session_id
         ORDER BY updated_at DESC
         LIMIT 1
      ) p
    ),
    'last_session_started_at', (
      SELECT started_at::text
        FROM public.student_sessions
       WHERE session_id = p_session_id
       ORDER BY started_at DESC
       LIMIT 1
    )
  );
$$;

-- Grant execute to anon + authenticated (Edge Function uses anon JWT for RPC calls)
GRANT EXECUTE ON FUNCTION public.student_context_v1(text) TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.student_context_v1(text) IS
  'Tier 1 T1.3 latency optim — single round-trip combined progress + last session lookup. '
  'Replaces 2 sequential REST calls in memory.ts:loadStudentContext. '
  'Projected p95 saving 250-500ms per latency research iter 39.';
