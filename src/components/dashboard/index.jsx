import React from 'react';

/**
 * Dashboard scaffold — T1-005 PDR #2 target
 *
 * Placeholder component for unified Dashboard surface (parent/teacher view consolidation).
 * Existing specialized dashboards:
 *   - src/components/teacher/TeacherDashboard.jsx (teacher analytics)
 *   - src/components/student/StudentDashboard.jsx (student progress)
 *
 * This scaffold unblocks CLAUDE.md bug #9 (dashboard directory missing) and
 * reserves the namespace for future unified dashboard work.
 *
 * Scope: SKELETON ONLY. No feature logic. Imported nowhere yet (safe no-op).
 */
export default function Dashboard() {
  return (
    <section
      role="region"
      aria-label="Dashboard principale"
      aria-live="polite"
      style={{
        padding: '2rem',
        color: '#475569',
        fontFamily: 'Open Sans, sans-serif',
      }}
    >
      <h1 style={{ fontFamily: 'Oswald, sans-serif', color: '#1E4D8C' }}>
        Dashboard ELAB
      </h1>
      <p>
        Scaffold placeholder — funzionalita consolidate in arrivo. Per ora usa{' '}
        <code>TeacherDashboard</code> o <code>StudentDashboard</code>.
      </p>
    </section>
  );
}
