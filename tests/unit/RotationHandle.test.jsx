/**
 * Sprint S iter 13 R4 — RotationHandle unit tests
 * Verifica snap math + UI rendering + onRotate callback + touch-target ≥44px.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RotationHandle, { snapToNearestQuadrant, cycleRotationCW, ROTATION_VALUES } from '../../src/components/simulator/overlays/RotationHandle';

// Wrapper SVG (RotationHandle returns <g>; needs <svg> parent for valid DOM)
function SvgWrapper({ children }) {
  return <svg width="800" height="600">{children}</svg>;
}

describe('RotationHandle — iter 13 R2 visible affordance', () => {
  describe('snapToNearestQuadrant — pure snap math', () => {
    it('snaps 0 → 0', () => {
      expect(snapToNearestQuadrant(0)).toBe(0);
    });

    it('snaps 44 (mid quadrant) → 0', () => {
      expect(snapToNearestQuadrant(44)).toBe(0);
    });

    it('snaps 45 → 90 (mid-quadrant rounds up)', () => {
      // Math.round(45/90) = Math.round(0.5) = 0 OR 1 depending on browser
      // Actually JS Math.round(0.5) = 1, so 45 → 90
      expect(snapToNearestQuadrant(45)).toBe(90);
    });

    it('snaps 46 → 90', () => {
      expect(snapToNearestQuadrant(46)).toBe(90);
    });

    it('snaps 90 → 90', () => {
      expect(snapToNearestQuadrant(90)).toBe(90);
    });

    it('snaps 134 → 90', () => {
      expect(snapToNearestQuadrant(134)).toBe(90);
    });

    it('snaps 180 → 180', () => {
      expect(snapToNearestQuadrant(180)).toBe(180);
    });

    it('snaps 270 → 270', () => {
      expect(snapToNearestQuadrant(270)).toBe(270);
    });

    it('snaps 360 → 0 (normalize)', () => {
      expect(snapToNearestQuadrant(360)).toBe(0);
    });

    it('snaps -90 → 270 (negative normalize)', () => {
      expect(snapToNearestQuadrant(-90)).toBe(270);
    });

    it('returns 0 for non-finite input', () => {
      expect(snapToNearestQuadrant(NaN)).toBe(0);
      expect(snapToNearestQuadrant(Infinity)).toBe(0);
    });
  });

  describe('cycleRotationCW — context-menu legacy path', () => {
    it('cycles 0 → 90 → 180 → 270 → 0', () => {
      let cur = 0;
      cur = cycleRotationCW(cur);
      expect(cur).toBe(90);
      cur = cycleRotationCW(cur);
      expect(cur).toBe(180);
      cur = cycleRotationCW(cur);
      expect(cur).toBe(270);
      cur = cycleRotationCW(cur);
      expect(cur).toBe(0);
    });
  });

  describe('ROTATION_VALUES export', () => {
    it('lists 4 quadrant values', () => {
      expect(ROTATION_VALUES).toEqual([0, 90, 180, 270]);
    });
  });

  describe('Render + interaction', () => {
    it('returns null when not visible', () => {
      const { container } = render(
        <SvgWrapper>
          <RotationHandle componentId="led1" visible={false} onRotate={() => {}} />
        </SvgWrapper>
      );
      expect(container.querySelector('[data-testid="rotation-handle"]')).toBeNull();
    });

    it('returns null when no componentId', () => {
      const { container } = render(
        <SvgWrapper>
          <RotationHandle componentId={null} onRotate={() => {}} />
        </SvgWrapper>
      );
      expect(container.querySelector('[data-testid="rotation-handle"]')).toBeNull();
    });

    it('returns null when no onRotate callback', () => {
      const { container } = render(
        <SvgWrapper>
          <RotationHandle componentId="led1" onRotate={null} />
        </SvgWrapper>
      );
      expect(container.querySelector('[data-testid="rotation-handle"]')).toBeNull();
    });

    it('renders 4 buttons when visible+componentId+onRotate', () => {
      const { container } = render(
        <SvgWrapper>
          <RotationHandle componentId="led1" currentRotation={0} onRotate={() => {}} />
        </SvgWrapper>
      );
      expect(container.querySelector('[data-testid="rotation-handle"]')).not.toBeNull();
      expect(container.querySelector('[data-testid="rotation-handle-btn-0"]')).not.toBeNull();
      expect(container.querySelector('[data-testid="rotation-handle-btn-90"]')).not.toBeNull();
      expect(container.querySelector('[data-testid="rotation-handle-btn-180"]')).not.toBeNull();
      expect(container.querySelector('[data-testid="rotation-handle-btn-270"]')).not.toBeNull();
    });

    it('marks current rotation as aria-pressed', () => {
      const { container } = render(
        <SvgWrapper>
          <RotationHandle componentId="led1" currentRotation={90} onRotate={() => {}} />
        </SvgWrapper>
      );
      const btn90 = container.querySelector('[data-testid="rotation-handle-btn-90"]');
      const btn0 = container.querySelector('[data-testid="rotation-handle-btn-0"]');
      expect(btn90.getAttribute('aria-pressed')).toBe('true');
      expect(btn0.getAttribute('aria-pressed')).toBe('false');
    });

    it('calls onRotate with snapped 90 when btn90 pressed', () => {
      const onRotate = vi.fn();
      const { container } = render(
        <SvgWrapper>
          <RotationHandle componentId="led1" currentRotation={0} onRotate={onRotate} />
        </SvgWrapper>
      );
      const btn = container.querySelector('[data-testid="rotation-handle-btn-90"]');
      fireEvent.pointerDown(btn);
      expect(onRotate).toHaveBeenCalledWith(90);
    });

    it('does NOT call onRotate when pressing already-active button', () => {
      const onRotate = vi.fn();
      const { container } = render(
        <SvgWrapper>
          <RotationHandle componentId="led1" currentRotation={180} onRotate={onRotate} />
        </SvgWrapper>
      );
      const btn = container.querySelector('[data-testid="rotation-handle-btn-180"]');
      fireEvent.pointerDown(btn);
      expect(onRotate).not.toHaveBeenCalled();
    });

    it('hit area circle ≥ 22 radius (44px touch target CLAUDE.md regola 9)', () => {
      const { container } = render(
        <SvgWrapper>
          <RotationHandle componentId="led1" onRotate={() => {}} />
        </SvgWrapper>
      );
      const btn = container.querySelector('[data-testid="rotation-handle-btn-0"]');
      const hitCircle = btn.querySelector('circle');
      expect(Number(hitCircle.getAttribute('r'))).toBeGreaterThanOrEqual(22);
    });
  });
});
