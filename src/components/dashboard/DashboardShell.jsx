/**
 * DashboardShell — Day 10 P0-3 scaffold (shell only, NO feature logic)
 *
 * Risolve il gap "src/components/dashboard vuota" (CLAUDE.md bug #9) con
 * uno shell renderable minimale. Nessuna wiring Supabase, nessun chart,
 * nessun dato reale: la feature logic arriva Day 11+ (contract day-10).
 *
 * Dashboards specializzate esistenti (non modificate):
 *   - src/components/teacher/TeacherDashboard.jsx
 *   - src/components/student/StudentDashboard.jsx
 *
 * Accessibility: role="region" + aria-label + aria-live per lettori schermo.
 * Styling: CSS Modules (CLAUDE.md design rule), design token Navy #1E4D8C,
 * font Oswald per il titolo (regola 17), padding coerente con Principi
 * Karpathy "Simple" — nessuna astrazione prematura.
 *
 * Claude Code (team-dev Opus) — Day 10 — Andrea Marro
 */
import React from 'react';
import styles from './DashboardShell.module.css';

export default function DashboardShell() {
  return (
    <section
      className={styles.shell}
      role="region"
      aria-label="Dashboard Docente"
      aria-live="polite"
    >
      <h1 className={styles.title}>Dashboard Docente</h1>
      <p className={styles.body}>
        In sviluppo — disponibile Day 11+.
      </p>
    </section>
  );
}
