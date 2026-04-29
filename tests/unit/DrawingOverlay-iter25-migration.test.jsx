/**
 * DrawingOverlay iter 25 — sandbox → experiment bucket migration.
 *
 * Bug Andrea iter 19 PM: drawing in sandbox vanishes when user picks an experiment
 * because DrawingOverlay.jsx:103 useEffect resets paths on experimentId change.
 *
 * Fix: when prevExpId === null and newExpId is real and current paths > 0,
 * migrate paths into the experiment bucket instead of resetting.
 *
 * Andrea Marro — 28/04/2026 (iter 25)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import DrawingOverlay from '../../src/components/simulator/canvas/DrawingOverlay.jsx';
import { DRAWING_STORAGE_PREFIX } from '../../src/utils/drawingStorage.js';

const SANDBOX_KEY = DRAWING_STORAGE_PREFIX + 'paths';
const EXP_KEY = DRAWING_STORAGE_PREFIX + 'v1-cap6-esp1';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DrawingOverlay iter 25 — bucket migration sandbox → experiment', () => {
  it('mounts with sandbox bucket when experimentId is null', () => {
    localStorage.getItem.mockImplementation((k) => {
      if (k === SANDBOX_KEY) return JSON.stringify([{ points: '10,10 20,20', color: '#000', width: 2 }]);
      return null;
    });

    render(<DrawingOverlay drawingEnabled={true} experimentId={null} />);

    // Should have looked up the sandbox key
    expect(localStorage.getItem).toHaveBeenCalledWith(SANDBOX_KEY);
  });

  it('on null → real expId transition with paths present, MIGRATES into the experiment bucket', () => {
    // Seed the sandbox bucket with one stroke; experiment bucket initially empty
    const sandboxPaths = [{ points: '10,10 20,20', color: '#EF4444', width: 1.5 }];
    localStorage.getItem.mockImplementation((k) => {
      if (k === SANDBOX_KEY) return JSON.stringify(sandboxPaths);
      return null;
    });

    const { rerender } = render(<DrawingOverlay drawingEnabled={true} experimentId={null} />);

    // setItem reset before rerender so we can assert what the migration writes
    localStorage.setItem.mockClear();

    // Simulate user picking experiment
    rerender(<DrawingOverlay drawingEnabled={true} experimentId="v1-cap6-esp1" />);

    // Migration: writes sandbox paths into experiment bucket AND empties sandbox bucket.
    const setCalls = localStorage.setItem.mock.calls.map(([k, v]) => ({ k, v }));
    const wroteToExperiment = setCalls.find(c => c.k === EXP_KEY);
    const clearedSandbox = setCalls.find(c => c.k === SANDBOX_KEY && JSON.parse(c.v).length === 0);

    expect(wroteToExperiment, 'paths written to experiment bucket').toBeDefined();
    expect(JSON.parse(wroteToExperiment.v).length).toBe(1);
    expect(clearedSandbox, 'sandbox bucket emptied after migration').toBeDefined();
  });

  it('on real → real expId transition (lesson switch) does NOT migrate; loads new bucket fresh', () => {
    // Initial mount with experimentA, then switch to experimentB.
    // Behavior must remain: load B's own paths; do NOT pollute B with A's content.
    const expAPaths = [{ points: '5,5 6,6', color: '#000', width: 2 }];
    const expBPaths = [{ points: '50,50 60,60', color: '#16A34A', width: 3 }];
    localStorage.getItem.mockImplementation((k) => {
      if (k === DRAWING_STORAGE_PREFIX + 'v1-cap6-esp1') return JSON.stringify(expAPaths);
      if (k === DRAWING_STORAGE_PREFIX + 'v2-cap1-esp1') return JSON.stringify(expBPaths);
      return null;
    });

    const { rerender } = render(<DrawingOverlay drawingEnabled={true} experimentId="v1-cap6-esp1" />);
    localStorage.setItem.mockClear();
    rerender(<DrawingOverlay drawingEnabled={true} experimentId="v2-cap1-esp1" />);

    // No migration write should occur
    const setCalls = localStorage.setItem.mock.calls.map(([k]) => k);
    expect(setCalls.includes(DRAWING_STORAGE_PREFIX + 'v2-cap1-esp1'),
      'no migrate-write into B bucket').toBe(false);
  });

  it('on null → real expId with EMPTY sandbox, falls back to standard load (no migration)', () => {
    localStorage.getItem.mockImplementation((k) => {
      if (k === SANDBOX_KEY) return null; // empty sandbox
      if (k === EXP_KEY) return JSON.stringify([{ points: '1,1 2,2', color: '#000', width: 2 }]);
      return null;
    });

    const { rerender } = render(<DrawingOverlay drawingEnabled={true} experimentId={null} />);
    localStorage.setItem.mockClear();
    rerender(<DrawingOverlay drawingEnabled={true} experimentId="v1-cap6-esp1" />);

    // Should NOT write to either bucket since paths state is empty before migration check.
    // Should READ the experiment bucket on the standard branch.
    const setCalls = localStorage.setItem.mock.calls.map(([k]) => k);
    expect(setCalls.includes(EXP_KEY), 'no spurious write on empty-sandbox transition').toBe(false);
    expect(localStorage.getItem).toHaveBeenCalledWith(EXP_KEY);
  });
});
