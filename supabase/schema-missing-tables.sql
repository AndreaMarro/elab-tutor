-- ============================================
-- ELAB Tutor — Tabelle mancanti
-- Da applicare via SQL Editor su Supabase Dashboard
-- https://supabase.com/dashboard/project/vxvqalmxqtezvgiboxyv/sql
-- Data: 04/04/2026
-- ============================================

-- ─── RATE_LIMITS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rate_limits (
    session_id   TEXT PRIMARY KEY,
    request_count INTEGER NOT NULL DEFAULT 0,
    window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RPC for atomic rate limit check+increment
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_session_id TEXT,
    p_max_requests INTEGER DEFAULT 30,
    p_window_ms INTEGER DEFAULT 60000
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
    v_window_start TIMESTAMPTZ;
    v_window_interval INTERVAL;
BEGIN
    v_window_interval := (p_window_ms || ' milliseconds')::INTERVAL;
    SELECT request_count, window_start INTO v_count, v_window_start
    FROM rate_limits WHERE session_id = p_session_id FOR UPDATE;
    IF NOT FOUND OR v_window_start < now() - v_window_interval THEN
        INSERT INTO rate_limits (session_id, request_count, window_start)
        VALUES (p_session_id, 1, now())
        ON CONFLICT (session_id)
        DO UPDATE SET request_count = 1, window_start = now();
        RETURN TRUE;
    END IF;
    IF v_count >= p_max_requests THEN
        RETURN FALSE;
    END IF;
    UPDATE rate_limits SET request_count = v_count + 1
    WHERE session_id = p_session_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ─── GDPR_AUDIT_LOG ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS gdpr_audit_log (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action     TEXT NOT NULL,
    target_id  TEXT NOT NULL,
    details    JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gdpr_audit_target ON gdpr_audit_log(target_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_audit_created ON gdpr_audit_log(created_at DESC);

ALTER TABLE gdpr_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_insert_only ON gdpr_audit_log
    FOR INSERT WITH CHECK (true);

-- ─── PARENTAL_CONSENTS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS parental_consents (
    student_id     TEXT PRIMARY KEY,
    class_id       TEXT,
    consent_given  BOOLEAN NOT NULL DEFAULT false,
    consent_date   TIMESTAMPTZ,
    consent_method TEXT NOT NULL DEFAULT 'in_app',
    parent_email   TEXT,
    revoked_at     TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── KNOWLEDGE_CHUNKS (RAG pgvector) ──────────────────────
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id         SERIAL PRIMARY KEY,
    volume     INTEGER NOT NULL CHECK (volume BETWEEN 1 AND 3),
    chapter    TEXT,
    title      TEXT,
    content    TEXT NOT NULL,
    embedding  vector(3072),
    metadata   JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chunks_volume ON knowledge_chunks(volume);
-- Note: ivfflat index requires data to be present first.
-- Run this AFTER inserting chunks:
-- CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON knowledge_chunks
--     USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- ─── GDPR CLEANUP FUNCTIONS ────────────────────────────
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits WHERE window_start < now() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION run_gdpr_cleanup()
RETURNS JSONB AS $$
DECLARE
    deleted_rates INTEGER;
    deleted_contexts INTEGER;
BEGIN
    DELETE FROM rate_limits WHERE window_start < now() - INTERVAL '5 minutes';
    GET DIAGNOSTICS deleted_rates = ROW_COUNT;
    DELETE FROM lesson_contexts WHERE updated_at < now() - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_contexts = ROW_COUNT;
    RETURN jsonb_build_object(
        'rate_limits_cleaned', deleted_rates,
        'lesson_contexts_cleaned', deleted_contexts,
        'ran_at', now()
    );
END;
$$ LANGUAGE plpgsql;

-- ─── DELETE_STUDENT_DATA (GDPR Art. 17) ─────────────────
CREATE OR REPLACE FUNCTION delete_student_data(target_session_id TEXT)
RETURNS JSONB AS $$
DECLARE
    target_student_uuid UUID;
    deleted_sessions INTEGER := 0;
    deleted_progress INTEGER := 0;
    deleted_contexts INTEGER := 0;
    deleted_moods    INTEGER := 0;
    deleted_confusion INTEGER := 0;
    deleted_nudges   INTEGER := 0;
    deleted_class_students INTEGER := 0;
    deleted_consents INTEGER := 0;
    deleted_rates    INTEGER := 0;
BEGIN
    SELECT student_id INTO target_student_uuid
    FROM student_sessions WHERE id::TEXT = target_session_id LIMIT 1;
    IF target_student_uuid IS NOT NULL THEN
        DELETE FROM student_sessions WHERE student_id = target_student_uuid;
        GET DIAGNOSTICS deleted_sessions = ROW_COUNT;
        DELETE FROM student_progress WHERE student_id = target_student_uuid;
        GET DIAGNOSTICS deleted_progress = ROW_COUNT;
        DELETE FROM lesson_contexts WHERE student_id = target_student_uuid;
        GET DIAGNOSTICS deleted_contexts = ROW_COUNT;
        DELETE FROM mood_reports WHERE student_id = target_student_uuid;
        GET DIAGNOSTICS deleted_moods = ROW_COUNT;
        DELETE FROM confusion_reports WHERE student_id = target_student_uuid;
        GET DIAGNOSTICS deleted_confusion = ROW_COUNT;
        DELETE FROM nudges WHERE student_id = target_student_uuid;
        GET DIAGNOSTICS deleted_nudges = ROW_COUNT;
        DELETE FROM class_students WHERE student_id = target_student_uuid;
        GET DIAGNOSTICS deleted_class_students = ROW_COUNT;
        DELETE FROM parental_consents WHERE student_id = target_student_uuid::TEXT;
        GET DIAGNOSTICS deleted_consents = ROW_COUNT;
    END IF;
    DELETE FROM rate_limits WHERE session_id = target_session_id;
    GET DIAGNOSTICS deleted_rates = ROW_COUNT;
    RETURN jsonb_build_object(
        'sessions', deleted_sessions, 'progress', deleted_progress,
        'contexts', deleted_contexts, 'mood_reports', deleted_moods,
        'confusion_reports', deleted_confusion, 'nudges', deleted_nudges,
        'class_students', deleted_class_students, 'consents', deleted_consents,
        'rate_limits', deleted_rates
    );
END;
$$ LANGUAGE plpgsql;

-- ─── SEARCH CHUNKS (RAG) ────────────────────────────────
CREATE OR REPLACE FUNCTION search_chunks(
    query_embedding vector(3072),
    match_threshold FLOAT DEFAULT 0.45,
    match_count INTEGER DEFAULT 3
)
RETURNS TABLE (
    id INTEGER,
    volume INTEGER,
    chapter TEXT,
    title TEXT,
    content TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT kc.id, kc.volume, kc.chapter, kc.title, kc.content,
        1 - (kc.embedding <=> query_embedding) AS similarity
    FROM knowledge_chunks kc
    WHERE 1 - (kc.embedding <=> query_embedding) > match_threshold
    ORDER BY kc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- ─── UPDATE_UPDATED_AT TRIGGER ──────────────────────────
-- (Potrebbe gia' esistere — CREATE OR REPLACE e' safe)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers (safe: DROP IF EXISTS + CREATE)
DROP TRIGGER IF EXISTS tr_classes_updated ON classes;
CREATE TRIGGER tr_classes_updated
    BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_sessions_updated ON student_sessions;
CREATE TRIGGER tr_sessions_updated
    BEFORE UPDATE ON student_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_progress_updated ON student_progress;
CREATE TRIGGER tr_progress_updated
    BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_lesson_ctx_updated ON lesson_contexts;
CREATE TRIGGER tr_lesson_ctx_updated
    BEFORE UPDATE ON lesson_contexts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════
-- DONE — Copia in SQL Editor e premi Run
-- ═══════════════════════════════════════════════════════════
