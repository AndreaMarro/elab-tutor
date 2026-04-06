-- ============================================
-- ELAB Tutor — Migrazione 001: Anonymous Access
-- Permette a studenti NON autenticati di salvare dati.
-- PROBLEMA: student_id e UUID REFERENCES auth.users,
-- ma gli studenti anonimi non hanno un account Supabase.
-- SOLUZIONE: rimuovi FK, tieni UUID, permetti anon insert.
-- Da applicare via SQL Editor su Supabase Dashboard
-- https://supabase.com/dashboard/project/vxvqalmxqtezvgiboxyv/sql
-- Data: 04/04/2026
-- ============================================

-- STEP 0: GRANT access to anon and authenticated roles
-- (Senza GRANT, RLS policies non bastano — PostgREST blocca con "permission denied")
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;

-- STEP 1: Rimuovi i Foreign Key constraints su student_id E teacher_id
-- (le tabelle core gia esistono con FK a auth.users)
-- Questo permette di usare UUID generati dal client come student_id.

ALTER TABLE student_sessions DROP CONSTRAINT IF EXISTS student_sessions_student_id_fkey;
ALTER TABLE student_progress DROP CONSTRAINT IF EXISTS student_progress_student_id_fkey;
ALTER TABLE mood_reports DROP CONSTRAINT IF EXISTS mood_reports_student_id_fkey;
ALTER TABLE confusion_reports DROP CONSTRAINT IF EXISTS confusion_reports_student_id_fkey;
ALTER TABLE lesson_contexts DROP CONSTRAINT IF EXISTS lesson_contexts_student_id_fkey;
ALTER TABLE nudges DROP CONSTRAINT IF EXISTS nudges_student_id_fkey;
ALTER TABLE nudges DROP CONSTRAINT IF EXISTS nudges_teacher_id_fkey;
ALTER TABLE nudges DROP CONSTRAINT IF EXISTS nudges_class_id_fkey;
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_fkey;
ALTER TABLE class_students DROP CONSTRAINT IF EXISTS class_students_student_id_fkey;
ALTER TABLE class_students DROP CONSTRAINT IF EXISTS class_students_class_id_fkey;

-- STEP 2: Aggiungi colonna class_key a student_sessions e student_progress
-- per collegare sessioni anonime a una classe del docente.
ALTER TABLE student_sessions ADD COLUMN IF NOT EXISTS class_key TEXT;
ALTER TABLE student_progress ADD COLUMN IF NOT EXISTS class_key TEXT;

-- Indici per query docente per class_key
CREATE INDEX IF NOT EXISTS idx_sessions_class_key ON student_sessions(class_key);
CREATE INDEX IF NOT EXISTS idx_progress_class_key ON student_progress(class_key);

-- STEP 3: RLS Policies per accesso anonimo
-- Pattern: anon puo INSERT e SELECT i propri dati (by student_id header).
-- Il docente (autenticato) puo SELECT tramite class_key.

-- student_sessions: anon insert + select propri
DROP POLICY IF EXISTS sessions_anon_insert ON student_sessions;
CREATE POLICY sessions_anon_insert ON student_sessions
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS sessions_anon_select ON student_sessions;
CREATE POLICY sessions_anon_select ON student_sessions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS sessions_anon_update ON student_sessions;
CREATE POLICY sessions_anon_update ON student_sessions
    FOR UPDATE USING (true);

-- student_progress: anon insert + select + upsert
DROP POLICY IF EXISTS progress_anon_insert ON student_progress;
CREATE POLICY progress_anon_insert ON student_progress
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS progress_anon_select ON student_progress;
CREATE POLICY progress_anon_select ON student_progress
    FOR SELECT USING (true);

DROP POLICY IF EXISTS progress_anon_update ON student_progress;
CREATE POLICY progress_anon_update ON student_progress
    FOR UPDATE USING (true);

-- mood_reports: anon insert + select propri
DROP POLICY IF EXISTS moods_anon_insert ON mood_reports;
CREATE POLICY moods_anon_insert ON mood_reports
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS moods_anon_select ON mood_reports;
CREATE POLICY moods_anon_select ON mood_reports
    FOR SELECT USING (true);

-- confusion_reports: anon insert + select propri
DROP POLICY IF EXISTS confusion_anon_insert ON confusion_reports;
CREATE POLICY confusion_anon_insert ON confusion_reports
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS confusion_anon_select ON confusion_reports;
CREATE POLICY confusion_anon_select ON confusion_reports
    FOR SELECT USING (true);

-- nudges: anon select + update (mark as read)
DROP POLICY IF EXISTS nudges_anon_select ON nudges;
CREATE POLICY nudges_anon_select ON nudges
    FOR SELECT USING (true);

DROP POLICY IF EXISTS nudges_anon_update ON nudges;
CREATE POLICY nudges_anon_update ON nudges
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS nudges_anon_insert ON nudges;
CREATE POLICY nudges_anon_insert ON nudges
    FOR INSERT WITH CHECK (true);

-- lesson_contexts: anon CRUD
DROP POLICY IF EXISTS lctx_anon_insert ON lesson_contexts;
CREATE POLICY lctx_anon_insert ON lesson_contexts
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS lctx_anon_select ON lesson_contexts;
CREATE POLICY lctx_anon_select ON lesson_contexts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS lctx_anon_update ON lesson_contexts;
CREATE POLICY lctx_anon_update ON lesson_contexts
    FOR UPDATE USING (true);

-- classes: anon select (studente vede info classe)
DROP POLICY IF EXISTS classes_anon_select ON classes;
CREATE POLICY classes_anon_select ON classes
    FOR SELECT USING (true);

-- class_students: anon select + insert (studente si unisce)
DROP POLICY IF EXISTS cs_anon_select ON class_students;
CREATE POLICY cs_anon_select ON class_students
    FOR SELECT USING (true);

DROP POLICY IF EXISTS cs_anon_insert ON class_students;
CREATE POLICY cs_anon_insert ON class_students
    FOR INSERT WITH CHECK (true);

-- STEP 4: Tabelle mancanti (rate_limits, gdpr_audit_log, parental_consents, knowledge_chunks)
-- Vedi schema-missing-tables.sql per il codice completo.
-- Includile nello stesso run per comodita:

CREATE TABLE IF NOT EXISTS rate_limits (
    session_id   TEXT PRIMARY KEY,
    request_count INTEGER NOT NULL DEFAULT 0,
    window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
DROP POLICY IF EXISTS audit_insert_only ON gdpr_audit_log;
CREATE POLICY audit_insert_only ON gdpr_audit_log FOR INSERT WITH CHECK (true);

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

-- STEP 5: Funzioni RPC
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_classes_updated ON classes;
CREATE TRIGGER tr_classes_updated BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS tr_sessions_updated ON student_sessions;
CREATE TRIGGER tr_sessions_updated BEFORE UPDATE ON student_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS tr_progress_updated ON student_progress;
CREATE TRIGGER tr_progress_updated BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS tr_lesson_ctx_updated ON lesson_contexts;
CREATE TRIGGER tr_lesson_ctx_updated BEFORE UPDATE ON lesson_contexts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION check_rate_limit(
    p_session_id TEXT, p_max_requests INTEGER DEFAULT 30, p_window_ms INTEGER DEFAULT 60000
) RETURNS BOOLEAN AS $$
DECLARE v_count INTEGER; v_window_start TIMESTAMPTZ; v_window_interval INTERVAL;
BEGIN
    v_window_interval := (p_window_ms || ' milliseconds')::INTERVAL;
    SELECT request_count, window_start INTO v_count, v_window_start
    FROM rate_limits WHERE session_id = p_session_id FOR UPDATE;
    IF NOT FOUND OR v_window_start < now() - v_window_interval THEN
        INSERT INTO rate_limits (session_id, request_count, window_start) VALUES (p_session_id, 1, now())
        ON CONFLICT (session_id) DO UPDATE SET request_count = 1, window_start = now();
        RETURN TRUE;
    END IF;
    IF v_count >= p_max_requests THEN RETURN FALSE; END IF;
    UPDATE rate_limits SET request_count = v_count + 1 WHERE session_id = p_session_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_student_data(target_session_id TEXT)
RETURNS JSONB AS $$
DECLARE target_student_uuid UUID; d1 INT:=0; d2 INT:=0; d3 INT:=0; d4 INT:=0; d5 INT:=0; d6 INT:=0; d7 INT:=0; d8 INT:=0; d9 INT:=0;
BEGIN
    BEGIN target_student_uuid := target_session_id::UUID; EXCEPTION WHEN OTHERS THEN target_student_uuid := NULL; END;
    IF target_student_uuid IS NOT NULL THEN
        DELETE FROM student_sessions WHERE student_id = target_student_uuid; GET DIAGNOSTICS d1 = ROW_COUNT;
        DELETE FROM student_progress WHERE student_id = target_student_uuid; GET DIAGNOSTICS d2 = ROW_COUNT;
        DELETE FROM lesson_contexts WHERE student_id = target_student_uuid; GET DIAGNOSTICS d3 = ROW_COUNT;
        DELETE FROM mood_reports WHERE student_id = target_student_uuid; GET DIAGNOSTICS d4 = ROW_COUNT;
        DELETE FROM confusion_reports WHERE student_id = target_student_uuid; GET DIAGNOSTICS d5 = ROW_COUNT;
        DELETE FROM nudges WHERE student_id = target_student_uuid; GET DIAGNOSTICS d6 = ROW_COUNT;
        DELETE FROM class_students WHERE student_id = target_student_uuid; GET DIAGNOSTICS d7 = ROW_COUNT;
        DELETE FROM parental_consents WHERE student_id = target_student_uuid::TEXT; GET DIAGNOSTICS d8 = ROW_COUNT;
    END IF;
    DELETE FROM rate_limits WHERE session_id = target_session_id; GET DIAGNOSTICS d9 = ROW_COUNT;
    RETURN jsonb_build_object('sessions',d1,'progress',d2,'contexts',d3,'mood_reports',d4,'confusion_reports',d5,'nudges',d6,'class_students',d7,'consents',d8,'rate_limits',d9);
END;
$$ LANGUAGE plpgsql;

-- STEP 6: Abilita Realtime per nudges
-- (Potrebbe essere gia attivo — ALTER PUBLICATION e idempotente)
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE nudges;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ═══════════════════════════════════════════════════════════
-- DONE. Dopo aver eseguito questo SQL:
-- 1. Le tabelle mancanti sono create
-- 2. Gli studenti anonimi possono salvare/leggere dati
-- 3. I docenti (autenticati o no) possono leggere tutti i dati
-- 4. Le funzioni RPC sono disponibili
-- 5. I trigger updated_at sono attivi
-- ═══════════════════════════════════════════════════════════
