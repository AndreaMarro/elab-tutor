-- Iter 41 Phase A Task A3 — T1.3 student-context single RPC
-- Plan §Phase A Task A3. Lift target: -250-500ms p95 (single roundtrip vs 2-call legacy).
--
-- Iter 38 BLOCKED on schema mismatch ("completed_experiments not found"). Iter 42 Andrea
-- schema audit verified columns:
--   student_progress(id, student_id, experiment_id, completed, attempts, best_score,
--                    total_time_sec, last_result, concepts, created_at, updated_at, expires_at)
--
-- This RPC AGGREGATES rows (one per experiment_id) into the legacy shape expected
-- by `loadStudentContext` in memory.ts:
--   {progress: {completed_experiments: [array], common_mistakes: [array], last_experiment_id: string},
--    last_session_started_at: timestamp}

CREATE OR REPLACE FUNCTION student_context_v1(p_session_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  v_student_id TEXT;
  v_class_key TEXT;
  v_result JSONB;
BEGIN
  -- 1. Resolve session_id → student_id + class_key via unlim_sessions table.
  --    Defensive: if session not found, return empty progress shape.
  SELECT us.student_id::TEXT, us.class_key
  INTO v_student_id, v_class_key
  FROM unlim_sessions us
  WHERE us.session_id = p_session_id
  ORDER BY us.created_at DESC
  LIMIT 1;

  IF v_student_id IS NULL THEN
    RETURN jsonb_build_object(
      'progress', jsonb_build_object(
        'completed_experiments', '[]'::jsonb,
        'common_mistakes', '[]'::jsonb,
        'last_experiment_id', NULL
      ),
      'last_session_started_at', NULL
    );
  END IF;

  -- 2. Aggregate student_progress rows into legacy shape.
  SELECT jsonb_build_object(
    'progress', jsonb_build_object(
      -- completed_experiments: array of experiment_ids where completed=true
      'completed_experiments', COALESCE(
        (
          SELECT jsonb_agg(DISTINCT sp.experiment_id ORDER BY sp.experiment_id)
          FROM student_progress sp
          WHERE sp.student_id::TEXT = v_student_id
            AND sp.completed = TRUE
        ),
        '[]'::jsonb
      ),
      -- common_mistakes: extract mistakes from last_result jsonb across all rows
      -- (limit top 5 most-recent failed attempts).
      'common_mistakes', COALESCE(
        (
          SELECT jsonb_agg(sp.last_result->'mistakes' ORDER BY sp.updated_at DESC)
          FROM student_progress sp
          WHERE sp.student_id::TEXT = v_student_id
            AND sp.completed = FALSE
            AND sp.last_result ? 'mistakes'
          LIMIT 5
        ),
        '[]'::jsonb
      ),
      -- last_experiment_id: most recently updated experiment for this student.
      'last_experiment_id', (
        SELECT sp.experiment_id
        FROM student_progress sp
        WHERE sp.student_id::TEXT = v_student_id
        ORDER BY sp.updated_at DESC
        LIMIT 1
      )
    ),
    'last_session_started_at', (
      SELECT us.created_at
      FROM unlim_sessions us
      WHERE us.student_id::TEXT = v_student_id
      ORDER BY us.created_at DESC
      LIMIT 1
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION student_context_v1(TEXT) TO anon, authenticated, service_role;

-- Defensive note: if `unlim_sessions` table column names differ from
-- (session_id, student_id, class_key, created_at), RPC fails first call.
-- Andrea iter 43 verify before apply:
--   SELECT column_name FROM information_schema.columns WHERE table_name='unlim_sessions';
