/**
 * DashboardShell — Import-smoke test (Day 10 P0-3 scaffold)
 *
 * Scope: verifica SOLO che lo shell si renda senza errore e che il
 * placeholder "Dashboard Docente" sia presente. Nessuna feature logic.
 * Feature + data wiring sono Day 11+ (vedi day-10-contract.md).
 *
 * Claude Code (team-dev Opus) — Day 10 — Andrea Marro
 */
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../../../../src/components/dashboard';
import DashboardShell from '../../../../src/components/dashboard/DashboardShell';

describe('DashboardShell (Day 10 scaffold)', () => {
  it('renders placeholder heading "Dashboard Docente"', () => {
    render(<DashboardShell />);
    expect(screen.getByText('Dashboard Docente')).toBeTruthy();
  });

  it('barrel re-exports same component as default from DashboardShell', () => {
    // Both should be callable React components referencing the shell.
    expect(typeof Dashboard).toBe('function');
    expect(typeof DashboardShell).toBe('function');
    expect(Dashboard).toBe(DashboardShell);
  });
});
