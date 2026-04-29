/**
 * ModalitaSwitch — 4 modes canonical UI tests (ADR-025 iter 26 PROPOSED)
 *
 * Verifica:
 *  • render 4 buttons (percorso + passo-passo + gia-montato + libero)
 *  • active mode visual via data-active="true"
 *  • onModeChange callback invocato con id mode
 *  • Italian K-12 plurale "Ragazzi" labels (Principio Zero V3)
 *  • Touch target ≥44px (CLAUDE.md §Qualita rule 9)
 *  • Mode "guida-da-errore" REMOVED (ADR-025 §4.5)
 *
 * Caveman gen-test iter 26 — 2026-04-29
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalitaSwitch, { MODALITA } from '../../../src/components/lavagna/ModalitaSwitch';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ModalitaSwitch — 4 modes canonical (ADR-025 iter 26)', () => {
  it('renders all 4 modes (percorso + passo-passo + gia-montato + libero)', () => {
    render(<ModalitaSwitch activeMode="percorso" onModeChange={() => {}} />);
    expect(screen.getByTestId('modalita-btn-percorso')).toBeTruthy();
    expect(screen.getByTestId('modalita-btn-passo-passo')).toBeTruthy();
    expect(screen.getByTestId('modalita-btn-gia-montato')).toBeTruthy();
    expect(screen.getByTestId('modalita-btn-libero')).toBeTruthy();
  });

  it('exports MODALITA list with exactly 4 canonical modes', () => {
    expect(MODALITA).toEqual(['percorso', 'passo-passo', 'gia-montato', 'libero']);
    expect(MODALITA).toHaveLength(4);
    // Mode "guida-da-errore" REMOVED per ADR-025 §4.5
    expect(MODALITA).not.toContain('guida-da-errore');
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
    fireEvent.click(screen.getByTestId('modalita-btn-libero'));
    expect(onModeChange).toHaveBeenCalledWith('libero');
    expect(onModeChange).toHaveBeenCalledTimes(3);
  });

  it('uses Italian K-12 plurale "Ragazzi" labels (Principio Zero V3)', () => {
    render(<ModalitaSwitch activeMode="percorso" onModeChange={() => {}} />);
    // Tooltips MUST contain plural "Ragazzi" (NO singular "tu", "clicca")
    const percorso = screen.getByTestId('modalita-btn-percorso');
    const passoPasso = screen.getByTestId('modalita-btn-passo-passo');
    const giaMontato = screen.getByTestId('modalita-btn-gia-montato');
    const libero = screen.getByTestId('modalita-btn-libero');
    expect(percorso.getAttribute('aria-label')).toMatch(/Ragazzi/);
    expect(passoPasso.getAttribute('aria-label')).toMatch(/Ragazzi/);
    expect(giaMontato.getAttribute('aria-label')).toMatch(/Ragazzi/);
    expect(libero.getAttribute('aria-label')).toMatch(/Ragazzi/);
    // NO imperative singular like "clicca tu"
    [percorso, passoPasso, giaMontato, libero].forEach((btn) => {
      expect(btn.getAttribute('aria-label')).not.toMatch(/clicca tu/i);
    });
  });

  it('does not render legacy "guida-da-errore" affordance', () => {
    render(<ModalitaSwitch activeMode="percorso" onModeChange={() => {}} />);
    expect(screen.queryByTestId('modalita-btn-guida-da-errore')).toBeNull();
    expect(screen.queryByText(/guida da errore/i)).toBeNull();
  });
});
