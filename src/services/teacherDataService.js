/**
 * Teacher Data Service — Legge dati classe da Supabase per la dashboard.
 * Supporta sia Supabase Auth (docente autenticato) sia class_key (anonimo).
 * Fallback a localStorage se Supabase non e configurato.
 * © Andrea Marro — 31/03/2026
 */

import supabase, { isSupabaseConfigured } from './supabaseClient';
import studentService from './studentService';
import logger from '../utils/logger';

/**
 * Fetch tutte le classi dell'insegnante corrente.
 * Prova Supabase Auth, poi fallback a class_key da localStorage.
 * @returns {Promise<Array<{ id, name, school, city, studentCount, created_at }>>}
 */
export async function fetchTeacherClasses() {
  if (!isSupabaseConfigured()) return [];
  try {
    // 1. Prova Supabase Auth
    let teacherId = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      teacherId = user?.id || null;
    } catch { /* no auth */ }

    let data;
    if (teacherId) {
      // Authenticated teacher: query by teacher_id
      const result = await supabase
        .from('classes')
        .select('id, name, school, city, class_key, created_at')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });
      if (result.error) throw result.error;
      data = result.data;
    } else {
      // Anonymous: try to query classes table
      const classKey = localStorage.getItem('elab_class_key');
      if (classKey) {
        try {
          const result = await supabase
            .from('classes')
            .select('id, name, school, city, class_key, created_at')
            .eq('class_key', classKey);
          if (!result.error && result.data?.length > 0) {
            data = result.data;
          }
        } catch { /* RLS may block anon access */ }
      }

      // If classes table is blocked, build a virtual class from student_sessions
      if (!data?.length && classKey) {
        data = [{
          id: 'virtual-' + classKey,
          name: 'Classe ' + classKey,
          school: null,
          city: null,
          class_key: classKey,
          created_at: new Date().toISOString(),
        }];
      }
    }

    if (!data?.length) return [];

    // Count students per class from sessions (works even if class_students is empty)
    const withCounts = await Promise.all(data.map(async (cls) => {
      try {
        if (cls.class_key) {
          // Count unique student_ids from sessions with this class_key
          const { data: sessions } = await supabase
            .from('student_sessions')
            .select('student_id')
            .eq('class_key', cls.class_key);
          const uniqueStudents = new Set((sessions || []).map(s => s.student_id));
          return { ...cls, studentCount: uniqueStudents.size };
        }
        const { count } = await supabase
          .from('class_students')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', cls.id);
        return { ...cls, studentCount: count || 0 };
      } catch {
        return { ...cls, studentCount: 0 };
      }
    }));

    return withCounts;
  } catch (err) {
    logger.warn('[TeacherData] fetchTeacherClasses failed:', err.message);
    return [];
  }
}

/**
 * Fetch studenti di una classe.
 * Prova class_students, poi fallback a unique student_ids da sessions.
 * @param {string} classId
 * @param {string} [classKey] — class_key per query diretta
 * @returns {Promise<Array<{ id, email, nome, joinedAt }>>}
 */
export async function fetchClassStudents(classId, classKey) {
  if (!isSupabaseConfigured()) return [];
  try {
    // Path 1: try class_students table
    if (classId && !classId.startsWith('virtual-')) {
      try {
        const { data, error } = await supabase
          .from('class_students')
          .select('student_id, student_name, joined_at')
          .eq('class_id', classId);
        if (!error && data?.length > 0) {
          return data.map(row => ({
            id: row.student_id,
            email: '',
            nome: row.student_name || 'Studente',
            joinedAt: row.joined_at,
          }));
        }
      } catch { /* RLS may block */ }
    }

    // Path 2: build students from sessions with class_key
    const key = classKey || localStorage.getItem('elab_class_key');
    if (key) {
      const { data: sessions } = await supabase
        .from('student_sessions')
        .select('student_id, started_at')
        .eq('class_key', key)
        .order('started_at', { ascending: true });
      if (sessions?.length > 0) {
        const seen = new Map();
        sessions.forEach(s => {
          if (!seen.has(s.student_id)) {
            seen.set(s.student_id, s.started_at);
          }
        });
        return Array.from(seen.entries()).map(([id, joinedAt]) => ({
          id,
          email: '',
          nome: 'Studente ' + id.slice(0, 6),
          joinedAt,
        }));
      }
    }

    return [];
  } catch (err) {
    logger.warn('[TeacherData] fetchClassStudents failed:', err.message);
    return [];
  }
}

/**
 * Fetch sessioni studenti di una classe negli ultimi N giorni.
 * Supporta query per class_id (via class_students) o class_key diretto.
 * @param {string} classId
 * @param {number} days
 * @param {string} [classCode] — codice classe per query diretta (senza join class_students)
 * @returns {Promise<Array>}
 */
export async function fetchClassSessions(classId, days = 30, classCode) {
  if (!isSupabaseConfigured()) return [];
  try {
    const since = new Date(Date.now() - days * 86400000).toISOString();

    // Path 1: query by class_key (after migration-001)
    if (classCode) {
      const { data, error } = await supabase
        .from('student_sessions')
        .select('*')
        .eq('class_key', classCode)
        .gte('started_at', since)
        .order('started_at', { ascending: false });
      if (!error && data?.length > 0) return data;
      // Fall through to student_id path if class_key column doesn't exist yet
    }

    // Path 2: query by student_ids in class (original path)
    if (!classId) return [];
    const studentIds = await getClassStudentIds(classId);
    if (!studentIds.length) return [];

    const { data, error } = await supabase
      .from('student_sessions')
      .select('*')
      .in('student_id', studentIds)
      .gte('started_at', since)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    logger.warn('[TeacherData] fetchClassSessions failed:', err.message);
    return [];
  }
}

/**
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
 * Fetch mood reports della classe.
 * @param {string} classId
 * @returns {Promise<Array>}
 */
export async function fetchClassMoods(classId, classKey) {
  if (!isSupabaseConfigured() || !classId) return [];
  try {
    // Path 1: get student IDs from class_key sessions (works for virtual classes)
    const key = classKey || localStorage.getItem('elab_class_key');
    let studentIds = [];

    if (key) {
      const { data: sessions } = await supabase
        .from('student_sessions')
        .select('student_id')
        .eq('class_key', key);
      studentIds = [...new Set((sessions || []).map(s => s.student_id))];
    }

    // Path 2: fallback to class_students table
    if (!studentIds.length && classId && !classId.startsWith('virtual-')) {
      studentIds = await getClassStudentIds(classId);
    }

    if (!studentIds.length) return [];

    const { data, error } = await supabase
      .from('mood_reports')
      .select('*')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;
    return data || [];
  } catch (err) {
    logger.warn('[TeacherData] fetchClassMoods failed:', err.message);
    return [];
  }
}

/**
 * Fetch nudge non letti per una classe.
 * @param {string} classId
 * @returns {Promise<Array>}
 */
export async function fetchPendingNudges(classId) {
  if (!isSupabaseConfigured() || !classId) return [];
  try {
    const { data, error } = await supabase
      .from('nudges')
      .select('*')
      .eq('class_id', classId)
      .eq('read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    logger.warn('[TeacherData] fetchPendingNudges failed:', err.message);
    return [];
  }
}

/**
 * Crea una nuova classe con class_key generato automaticamente.
 * Funziona con Supabase Auth o con UUID anonimo.
 * @param {{ name: string, school?: string, city?: string }} classData
 * @returns {Promise<{ success: boolean, class?: object, error?: string }>}
 */
export async function createClass(classData) {
  if (!isSupabaseConfigured()) return { success: false, error: 'Supabase non configurato' };
  try {
    // Get teacher ID: Supabase Auth or anon UUID
    let teacherId = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      teacherId = user?.id || null;
    } catch { /* no auth */ }
    if (!teacherId) {
      // Fallback: use anon UUID from localStorage
      teacherId = localStorage.getItem('elab_anon_uuid') || crypto.randomUUID();
      localStorage.setItem('elab_anon_uuid', teacherId);
    }

    // Generate 6-char class code (uppercase alphanumeric)
    const classCode = _generateClassCode();

    const { data, error } = await supabase
      .from('classes')
      .insert({
        name: classData.name,
        school: classData.school || null,
        city: classData.city || null,
        teacher_id: teacherId,
        class_key: classCode,
      })
      .select()
      .single();

    if (error) throw error;

    // Persist class_key for this teacher
    localStorage.setItem('elab_class_key', classCode);

    return { success: true, class: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** Genera un codice classe alfanumerico di 6 caratteri (es. 'AB3K7X'). */
function _generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 per evitare confusione
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Trasforma dati Supabase nel formato legacy usato dai tab della dashboard.
 * Cosi i tab esistenti non devono cambiare.
 */
export function transformToLegacyFormat(students, sessions, moods) {
  return students.map(student => {
    const mySessions = sessions.filter(s => s.student_id === student.id);
    const myMoods = moods.filter(m => m.student_id === student.id);

    return {
      userId: student.id,
      nome: student.nome,
      email: student.email,
      esperimenti: mySessions
        .filter(s => s.session_type === 'experiment')
        .map(s => ({
          experimentId: s.experiment_id,
          nome: s.experiment_id,
          completato: s.completed,
          durata: s.duration_seconds,
          timestamp: s.started_at,
        })),
      sessioni: mySessions.map(s => ({
        id: s.id,
        inizio: s.started_at,
        fine: s.ended_at,
        durata: s.duration_seconds || 0,
        attivita: s.activity || [],
      })),
      moods: myMoods.map(m => ({
        mood: m.mood,
        nota: m.context || '',
        timestamp: m.created_at,
      })),
      confusione: [],
      meraviglie: [],
      concetti: [],
      stats: {
        esperimentiTotali: mySessions.filter(s => s.completed).length,
        tempoTotale: mySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0),
        tempoMedioSessione: mySessions.length > 0
          ? Math.round(mySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / mySessions.length)
          : 0,
      },
      tempoTotale: mySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0),
      _source: 'supabase',
    };
  });
}

// ─── Helpers ───

async function getClassStudentIds(classId) {
  const { data } = await supabase
    .from('class_students')
    .select('student_id')
    .eq('class_id', classId);
  return (data || []).map(r => r.student_id);
}

/**
 * Controlla se ci sono dati Supabase disponibili.
 * Utile per decidere se mostrare badge "dati dal cloud" nella dashboard.
 */
export function isCloudDataAvailable() {
  return isSupabaseConfigured();
}
