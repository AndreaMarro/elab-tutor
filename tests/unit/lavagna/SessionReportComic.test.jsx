import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import SessionReportComic from '../../../src/components/lavagna/SessionReportComic';

const mockSession = {
  studentAlias: 'S001',
  startedAt: '2026-04-19T09:00:00Z',
  endedAt: '2026-04-19T10:30:00Z',
  experimentsCompleted: [
    { id: 'v1-cap6-esp1', title: 'Accendi il LED', volume: 1 },
    { id: 'v1-cap6-esp2', title: 'LED + Resistore', volume: 1 },
    { id: 'v1-cap7-esp1', title: 'LED RGB', volume: 1 },
  ],
  narrations: {
    'v1-cap6-esp1': 'Ragazzi, abbiamo acceso il primo LED con 470 ohm — come una porta che si apre!',
    'v1-cap6-esp2': 'Il resistore protegge il LED dalla corrente — come un filtro nel rubinetto.',
    'v1-cap7-esp1': 'Con 3 canali PWM mescoliamo colori — come una palette del pittore.',
  },
};

describe('SessionReportComic — Fumetto Report MVP', () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  it('renders header with session date', () => {
    render(<SessionReportComic session={mockSession} />);
    expect(screen.getByText(/19\/4\/2026|19\/04\/2026/)).toBeInTheDocument();
  });

  it('renders student alias in header', () => {
    render(<SessionReportComic session={mockSession} />);
    expect(screen.getByText(/S001/)).toBeInTheDocument();
  });

  it('renders 6 vignette slots (3 completed + 3 placeholder)', () => {
    render(<SessionReportComic session={mockSession} />);
    const vignettes = screen.getAllByRole('figure');
    expect(vignettes.length).toBe(6);
  });

  it('shows narration text for each completed vignette', () => {
    render(<SessionReportComic session={mockSession} />);
    expect(screen.getByText(/acceso il primo LED/i)).toBeInTheDocument();
    expect(screen.getByText(/resistore protegge/i)).toBeInTheDocument();
    expect(screen.getByText(/mescoliamo colori/i)).toBeInTheDocument();
  });

  it('Principio Zero v3: "Ragazzi" present in narrations', () => {
    render(<SessionReportComic session={mockSession} />);
    const ragazzi = screen.getAllByText(/Ragazzi/i);
    expect(ragazzi.length).toBeGreaterThan(0);
  });

  it('Principio Zero v3: NO "Docente leggi" text anywhere', () => {
    render(<SessionReportComic session={mockSession} />);
    const body = document.body.textContent || '';
    expect(body).not.toMatch(/Docente,?\s*leggi/i);
    expect(body).not.toMatch(/Insegnante,?\s*leggi/i);
  });

  it('renders export PDF button with WCAG accessible label', () => {
    render(<SessionReportComic session={mockSession} />);
    expect(screen.getByRole('button', { name: /Scarica PDF|Stampa/i })).toBeInTheDocument();
  });

  it('calls onExport when export button clicked', () => {
    const onExport = vi.fn();
    render(<SessionReportComic session={mockSession} onExport={onExport} />);
    fireEvent.click(screen.getByRole('button', { name: /Scarica PDF|Stampa/i }));
    expect(onExport).toHaveBeenCalledOnce();
  });

  it('handles empty session (zero experiments) without crash', () => {
    const empty = { studentAlias: 'S002', startedAt: '2026-04-19T09:00:00Z', experimentsCompleted: [], narrations: {} };
    render(<SessionReportComic session={empty} />);
    const vignettes = screen.getAllByRole('figure');
    expect(vignettes.length).toBe(6);
  });

  it('handles missing narrations gracefully', () => {
    const noNarr = { ...mockSession, narrations: {} };
    render(<SessionReportComic session={noNarr} />);
    expect(screen.getByText(/Accendi il LED/i)).toBeInTheDocument();
  });
});
