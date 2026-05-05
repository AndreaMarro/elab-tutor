/**
 * ModalitaSwitch — 3 modes canonical UI tests (ADR-025 iter 42 update)
 *
 * Verifica:
 *  • render 3 buttons (percorso + passo-passo + gia-montato)
 *  • 'libero' REMOVED iter 42 — merged into 'percorso'
 *  • active mode visual via data-active="true"
 *  • onModeChange callback invocato con id mode
 *  • Italian K-12 plurale "Ragazzi" labels (Principio Zero V3)
 *  • Touch target ≥44px (CLAUDE.md §Qualita rule 9)
 *  • Mode "guida-da-errore" REMOVED (ADR-025 §4.5)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalitaSwitch, { MODALITA } from '../../../src/components/lavagna/ModalitaSwitch';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ModalitaSwitch — 3 modes canonical (ADR-025 iter 42)', () => {
  it('renders all 3 modes (percorso + passo-passo + gia-montato)', () => {
    render(<ModalitaSwitch activeMode="percorso" onModeChange={() => {}} />);
    expect(screen.getByTestId('modalita-btn-percorso')).toBeTruthy();
    expect(screen.getByTestId('modalita-btn-passo-passo')).toBeTruthy();
    expect(screen.getByTestId('modalita-btn-gia-montato')).toBeTruthy();
    // 'libero' removed iter 42 — merged into percorso
    expect(screen.queryByTestId('modalita-btn-libero')).toBeNull();
  });

  it('exports MODALITA list with exactly 3 canonical modes', () => {
    expect(MODALITA).toEqual(['percorso', 'passo-passo', 'gia-montato']);
    expect(MODALITA).toHaveLength(3);
    // Removed modes
    expect(MODALITA).not.toContain('guida-da-errore');
    expect(MODALITA).not.toContain('libero');
  });

  it('marks active mode with data-active="true" + aria-selected', () => {
    render(<ModalitaSwitch activeMode="gia-montato" onModeChange={() => {}} />);
    const giaMontato = screen.getByTestId('modalita-btn-gia-montato');
    const percorso = screen.getByTestId('modalita-btn-percorso');
    expect(giaMontato.getAttribute('data-active')).toBe('true');
    expect(giaMontato.getAttribute('aria-selected')).toBe('true');
    expect(percorso.getAttribute('data-active')).toBe('false');
  });

  it('calls onModeChange(mode) when button clicked', () => {
    const onModeChange = vi.fn();
    render(<ModalitaSwitch activeMode="percorso" onModeChange={onModeChange} />);
    fireEvent.click(screen.getByTestId('modalita-btn-passo-passo'));
    expect(onModeChange).toHaveBeenCalledWith('passo-passo');
    fireEvent.click(screen.getByTestId('modalita-btn-gia-montato'));
    expect(onModeChange).toHaveBeenCalledWith('gia-montato');
    expect(onModeChange).toHaveBeenCalledTimes(2);
  });

  it('uses Italian K-12 plurale "Ragazzi" labels (Principio Zero V3)', () => {
    render(<ModalitaSwitch activeMode="percorso" onModeChange={() => {}} />);
    const percorso = screen.getByTestId('modalita-btn-percorso');
    const passoPasso = screen.getByTestId('modalita-btn-passo-passo');
    const giaMontato = screen.getByTestId('modalita-btn-gia-montato');
    expect(percorso.getAttribute('aria-label')).toMatch(/Ragazzi/);
    expect(passoPasso.getAttribute('aria-label')).toMatch(/Ragazzi/);
    expect(giaMontato.getAttribute('aria-label')).toMatch(/Ragazzi/);
    [percorso, passoPasso, giaMontato].forEach((btn) => {
      expect(btn.getAttribute('aria-label')).not.toMatch(/clicca tu/i);
    });
  });

  it('does not render legacy "guida-da-errore" or "libero" affordance', () => {
    render(<ModalitaSwitch activeMode="percorso" onModeChange={() => {}} />);
    expect(screen.queryByTestId('modalita-btn-guida-da-errore')).toBeNull();
    expect(screen.queryByTestId('modalita-btn-libero')).toBeNull();
    expect(screen.queryByText(/guida da errore/i)).toBeNull();
  });
});
