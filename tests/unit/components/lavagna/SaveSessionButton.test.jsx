/**
 * SaveSessionButton.test.jsx — Iter 36 SessionSave Atom SS1
 *
 * Tests:
 *   1. Renders idle state with "Salva" label
 *   2. Renders saving state (aria-busy + "Salvo…" + disabled)
 *   3. Renders success state ("Salvata" label)
 *   4. Renders error state ("Riprova" label)
 *   5. Click invokes onOpenDialog
 *   6. Click while saving does NOT invoke onOpenDialog
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SaveSessionButton from '../../../../src/components/lavagna/SaveSessionButton.jsx';

describe('SaveSessionButton', () => {
  it('renders idle state by default', () => {
    render(<SaveSessionButton onOpenDialog={vi.fn()} />);
    const btn = screen.getByTestId('save-session-button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Salva');
    expect(btn.getAttribute('data-status')).toBe('idle');
    expect(btn.getAttribute('aria-busy')).toBe('false');
    expect(btn.disabled).toBe(false);
  });

  it('renders saving state with aria-busy and disabled', () => {
    render(<SaveSessionButton onOpenDialog={vi.fn()} status="saving" />);
    const btn = screen.getByTestId('save-session-button');
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect(btn.disabled).toBe(true);
    expect(btn).toHaveTextContent('Salvo…');
  });

  it('renders success state with "Salvata" label', () => {
    render(<SaveSessionButton onOpenDialog={vi.fn()} status="success" />);
    const btn = screen.getByTestId('save-session-button');
    expect(btn).toHaveTextContent('Salvata');
    expect(btn.getAttribute('data-status')).toBe('success');
  });

  it('renders error state with "Riprova" label', () => {
    render(<SaveSessionButton onOpenDialog={vi.fn()} status="error" />);
    const btn = screen.getByTestId('save-session-button');
    expect(btn).toHaveTextContent('Riprova');
    expect(btn.getAttribute('data-status')).toBe('error');
  });

  it('invokes onOpenDialog on click in idle state', () => {
    const onOpen = vi.fn();
    render(<SaveSessionButton onOpenDialog={onOpen} />);
    fireEvent.click(screen.getByTestId('save-session-button'));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('does NOT invoke onOpenDialog while saving', () => {
    const onOpen = vi.fn();
    render(<SaveSessionButton onOpenDialog={onOpen} status="saving" />);
    fireEvent.click(screen.getByTestId('save-session-button'));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('respects disabled prop', () => {
    const onOpen = vi.fn();
    render(<SaveSessionButton onOpenDialog={onOpen} disabled />);
    const btn = screen.getByTestId('save-session-button');
    expect(btn.disabled).toBe(true);
    fireEvent.click(btn);
    expect(onOpen).not.toHaveBeenCalled();
  });
});
