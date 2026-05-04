/**
 * WakeWordStatusBadge.test.jsx — Sprint T iter 35 Phase 2 Atom F1 (Maker-3)
 *
 * Verifies 4-state machine of WakeWordStatusBadge component.
 *
 * Cases:
 *   1. unsupported — browser lacks SpeechRecognition (Firefox + Safari iOS)
 *   2. denied — Permissions API returns 'denied'
 *   3. listening — supported + granted + listening prop true
 *   4. idle — supported + permission prompt/granted but listener not started
 *   5. interactive idle/denied click invokes onClick
 *   6. non-interactive states do NOT invoke onClick (unsupported, listening)
 *   7. plurale "Ragazzi" / "Cliccate" / "Dite" PRINCIPIO ZERO compliance
 *   8. testStateOverride bypasses live probe
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import WakeWordStatusBadge from '../../../../src/components/common/WakeWordStatusBadge.jsx';

afterEach(() => cleanup());

describe('WakeWordStatusBadge — F1 4-state machine (iter 35 Phase 2)', () => {
  describe('State: unsupported', () => {
    it('renders unsupported badge when forced via testStateOverride', () => {
      render(<WakeWordStatusBadge testStateOverride="unsupported" />);
      const badge = screen.getByTestId('wake-word-status-badge');
      expect(badge.getAttribute('data-state')).toBe('unsupported');
      expect(screen.getByTestId('wake-word-status-badge-label').textContent)
        .toContain('non disponibile');
    });

    it('uses div (non-interactive) for unsupported state', () => {
      render(<WakeWordStatusBadge testStateOverride="unsupported" />);
      const badge = screen.getByTestId('wake-word-status-badge');
      expect(badge.tagName).toBe('DIV');
    });
  });

  describe('State: denied', () => {
    it('renders denied badge when forced via testStateOverride', () => {
      render(<WakeWordStatusBadge testStateOverride="denied" />);
      const badge = screen.getByTestId('wake-word-status-badge');
      expect(badge.getAttribute('data-state')).toBe('denied');
      expect(screen.getByTestId('wake-word-status-badge-label').textContent)
        .toContain('bloccato');
    });

    it('uses button (interactive) for denied state and forwards onClick', () => {
      const onClick = vi.fn();
      render(<WakeWordStatusBadge testStateOverride="denied" onClick={onClick} />);
      const badge = screen.getByTestId('wake-word-status-badge');
      expect(badge.tagName).toBe('BUTTON');
      fireEvent.click(badge);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('detail message uses plurale "Cliccate" (PRINCIPIO ZERO)', () => {
      render(<WakeWordStatusBadge testStateOverride="denied" />);
      const detail = screen.getByTestId('wake-word-status-badge-detail');
      expect(detail.textContent).toContain('Cliccate');
    });
  });

  describe('State: listening', () => {
    it('renders listening badge when forced via testStateOverride', () => {
      render(<WakeWordStatusBadge testStateOverride="listening" />);
      const badge = screen.getByTestId('wake-word-status-badge');
      expect(badge.getAttribute('data-state')).toBe('listening');
      expect(screen.getByTestId('wake-word-status-badge-label').textContent)
        .toContain('In ascolto');
    });

    it('uses div (non-interactive) for listening state', () => {
      render(<WakeWordStatusBadge testStateOverride="listening" />);
      const badge = screen.getByTestId('wake-word-status-badge');
      expect(badge.tagName).toBe('DIV');
    });

    it('shows wake phrases hint with plurale "Dite" + Ehi/Ragazzi/Ok variants', () => {
      render(<WakeWordStatusBadge testStateOverride="listening" />);
      const detail = screen.getByTestId('wake-word-status-badge-detail');
      expect(detail.textContent).toMatch(/Ehi UNLIM|Ragazzi UNLIM|Ok UNLIM/);
    });
  });

  describe('State: idle', () => {
    it('renders idle badge when forced via testStateOverride', () => {
      render(<WakeWordStatusBadge testStateOverride="idle" />);
      const badge = screen.getByTestId('wake-word-status-badge');
      expect(badge.getAttribute('data-state')).toBe('idle');
      expect(screen.getByTestId('wake-word-status-badge-label').textContent)
        .toContain('pronta');
    });

    it('uses button (interactive) for idle state and forwards onClick', () => {
      const onClick = vi.fn();
      render(<WakeWordStatusBadge testStateOverride="idle" onClick={onClick} />);
      const badge = screen.getByTestId('wake-word-status-badge');
      expect(badge.tagName).toBe('BUTTON');
      fireEvent.click(badge);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Interactivity guards', () => {
    it('does NOT invoke onClick on unsupported state (no-op)', () => {
      const onClick = vi.fn();
      render(<WakeWordStatusBadge testStateOverride="unsupported" onClick={onClick} />);
      const badge = screen.getByTestId('wake-word-status-badge');
      // div has no native click but try fire — handler should be noop guard
      fireEvent.click(badge);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does NOT invoke onClick on listening state (no-op)', () => {
      const onClick = vi.fn();
      render(<WakeWordStatusBadge testStateOverride="listening" onClick={onClick} />);
      const badge = screen.getByTestId('wake-word-status-badge');
      fireEvent.click(badge);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Compact prop', () => {
    it('hides detail line when compact=true', () => {
      render(<WakeWordStatusBadge testStateOverride="idle" compact={true} />);
      const detail = screen.getByTestId('wake-word-status-badge-detail');
      // jsdom returns computed display value via inline style
      expect(detail.style.display).toBe('none');
    });

    it('shows detail line when compact=false (default)', () => {
      render(<WakeWordStatusBadge testStateOverride="idle" />);
      const detail = screen.getByTestId('wake-word-status-badge-detail');
      expect(detail.style.display).toBe('block');
    });
  });

  describe('Live probe (no override)', () => {
    let originalSpeechRecognition;
    let originalWebkitSpeechRecognition;
    let originalPermissions;

    beforeEach(() => {
      originalSpeechRecognition = window.SpeechRecognition;
      originalWebkitSpeechRecognition = window.webkitSpeechRecognition;
      originalPermissions = navigator.permissions;
    });

    afterEach(() => {
      // restore
      if (originalSpeechRecognition !== undefined) {
        window.SpeechRecognition = originalSpeechRecognition;
      } else {
        delete window.SpeechRecognition;
      }
      if (originalWebkitSpeechRecognition !== undefined) {
        window.webkitSpeechRecognition = originalWebkitSpeechRecognition;
      } else {
        delete window.webkitSpeechRecognition;
      }
      try {
        Object.defineProperty(navigator, 'permissions', {
          configurable: true,
          value: originalPermissions,
        });
      } catch { /* jsdom may have set this read-only; ignore on cleanup */ }
    });

    it('falls back to unsupported when SpeechRecognition absent', () => {
      delete window.SpeechRecognition;
      delete window.webkitSpeechRecognition;
      render(<WakeWordStatusBadge />);
      const badge = screen.getByTestId('wake-word-status-badge');
      expect(badge.getAttribute('data-state')).toBe('unsupported');
    });
  });
});
