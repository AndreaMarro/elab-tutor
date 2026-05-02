-- Iter 41 Phase A Task A3 — T1.3 student-context single RPC (V2 schema-reale)
-- Plan §Phase A Task A3. Lift target: -250-500ms p95 (single roundtrip vs 2-call).
--
-- Iter 38 BLOCKED 'completed_experiments not found'. Iter 42 Andrea schema audit
-- + iter 43 Claude CLI verify revealed:
--   classes(id, teacher_id, name, school, city, class_code, volumes, active_games)
--   class_students(id, class_id, student_id, student_name, joined_at)
--   student_progress(id, student_id, experiment_id, completed, attempts, best_score,
--                    total_time_sec, last_result, concepts, created_at, updated_at)
--   student_sessions(id, student_id, experiment_id, session_type, started_at, ended_at,
--                    completed, score, messages_count, errors_count, summary, activity, ...)
--   lesson_contexts(id, class_id, student_id, experiment_id, context_data, session_summary, ...)
--
-- RPC signature `student_context_v1(p_session_id TEXT)` — preserved per memory.ts:90 caller.
-- p_session_id treated as student_id (matches `elab_anon_uuid` localStorage UUID).
-- Returns shape expected by memory.ts:91-107:
--   {progress: {completed_experiments: [], common_mistakes: [], last_experiment_id: ''},
--    last_session_started_at: timestamp}

CREATE OR REPLACE FUNCTION student_context_v1(p_session_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- p_session_id is treated as student_id (UUID string). Defensive: coerce to text
  -- for comparison (student_progress.student_id is UUID column).
  SELECT jsonb_build_object(
    'progress', jsonb_build_object(
      -- completed_experiments: array of experiment_id where sp.completed = true
      'completed_experiments', COALESCE(
        (
          SELECT jsonb_agg(DISTINCT sp.experiment_id ORDER BY sp.experiment_id)
          FROM student_progress sp
          WHERE sp.student_id::TEXT = p_session_id
            AND sp.completed = TRUE
        ),
        '[]'::jsonb
      ),

      -- common_mistakes: defer iter 42+ — last_result is TEXT not JSONB (Andrea schema audit).
      -- Iter 41 returns empty array (memory.ts:101 .slice(0,5) handles empty OK).
      'common_mistakes', '[]'::jsonb,

      -- last_experiment_id: most recently updated experiment for this student
      'last_experiment_id', (
        SELECT sp.experiment_id
        FROM student_progress sp
        WHERE sp.student_id::TEXT = p_session_id
        ORDER BY sp.updated_at DESC
        LIMIT 1
      )
    ),

    -- last_session_started_at: from student_sessions table
    'last_session_started_at', (
      SELECT ss.started_at
      FROM student_sessions ss
      WHERE ss.student_id::TEXT = p_session_id
      ORDER BY ss.started_at DESC
      LIMIT 1
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION student_context_v1(TEXT) TO anon, authenticated, service_role;

COMMENT ON FUNCTION student_context_v1(TEXT) IS
  'Iter 41 A3 — Single RPC student context (T1.3 latency lift -250-500ms p95). Aggregates student_progress + student_sessions for given student_id. Returns shape compatible with memory.ts:loadStudentContext expectation. Defensive: empty progress when student has no rows (no error throw).';
