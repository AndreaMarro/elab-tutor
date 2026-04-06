/**
 * Test breadboardSnap.js — verifica snap geometry per BreadboardHalf e BreadboardFull.
 * Logica pura, testabile senza browser.
 */
import { describe, it, expect } from 'vitest';
import { findNearestHole, findNearestHoleFull } from '../../src/components/simulator/utils/breadboardSnap';

// BreadboardHalf constants (from source)
const BB_PITCH = 7.5;
const BB_PAD_X = 14;
const BB_PAD_Y_CONST = 10;
const BB_BUS_H = 7.5;
const BB_BUS_GAP = 5;
const BB_Y_SEC_TOP = BB_PAD_Y_CONST + BB_BUS_H * 2 + BB_BUS_GAP; // 30
const BB_SECTION_H = 5 * BB_PITCH; // 37.5
const BB_GAP_H = 10;
const BB_Y_SEC_BOT = BB_Y_SEC_TOP + BB_SECTION_H + BB_GAP_H; // 77.5

describe('findNearestHole (BreadboardHalf)', () => {
  it('snaps to hole a1 at top-left', () => {
    const cx = BB_PAD_X + BB_PITCH / 2; // center of col 0
    const cy = BB_Y_SEC_TOP + BB_PITCH / 2; // center of row a
    const result = findNearestHole(cx, cy);
    expect(result).not.toBeNull();
    expect(result.holeId).toBe('a1');
    expect(result.section).toBe('top');
  });

  it('snaps to hole f1 at bottom-left', () => {
    const cx = BB_PAD_X + BB_PITCH / 2;
    const cy = BB_Y_SEC_BOT + BB_PITCH / 2;
    const result = findNearestHole(cx, cy);
    expect(result).not.toBeNull();
    expect(result.holeId).toBe('f1');
    expect(result.section).toBe('bot');
  });

  it('snaps to hole e15 (middle of top section)', () => {
    const cx = BB_PAD_X + 14 * BB_PITCH + BB_PITCH / 2; // col 14 = hole 15
    const cy = BB_Y_SEC_TOP + 4 * BB_PITCH + BB_PITCH / 2; // row e (index 4)
    const result = findNearestHole(cx, cy);
    expect(result).not.toBeNull();
    expect(result.holeId).toBe('e15');
  });

  it('snaps to nearest hole when slightly off-center', () => {
    const cx = BB_PAD_X + BB_PITCH / 2 + 2; // slightly right of a1
    const cy = BB_Y_SEC_TOP + BB_PITCH / 2 + 2; // slightly below a1
    const result = findNearestHole(cx, cy);
    expect(result).not.toBeNull();
    expect(result.holeId).toBe('a1');
  });

  it('returns null when too far from any hole', () => {
    const result = findNearestHole(-100, -100);
    expect(result).toBeNull();
  });

  it('returns null for very large coordinates', () => {
    const result = findNearestHole(9999, 9999);
    expect(result).toBeNull();
  });

  it('has 30 columns (a1-a30)', () => {
    const lastCol = BB_PAD_X + 29 * BB_PITCH + BB_PITCH / 2;
    const cy = BB_Y_SEC_TOP + BB_PITCH / 2;
    const result = findNearestHole(lastCol, cy);
    expect(result).not.toBeNull();
    expect(result.holeId).toBe('a30');
  });

  it('distinguishes top from bottom section', () => {
    const cx = BB_PAD_X + BB_PITCH / 2;
    const topResult = findNearestHole(cx, BB_Y_SEC_TOP + BB_PITCH / 2);
    const botResult = findNearestHole(cx, BB_Y_SEC_BOT + BB_PITCH / 2);
    expect(topResult.section).toBe('top');
    expect(botResult.section).toBe('bot');
    expect(topResult.row).toBe('a');
    expect(botResult.row).toBe('f');
  });
});

describe('findNearestHoleFull (BreadboardFull)', () => {
  it('snaps to hole a1 at top-left of left section', () => {
    const result = findNearestHoleFull(22, 14); // BBF_SECTION_LEFT_X=22, yStart=14
    expect(result).not.toBeNull();
    expect(result.holeId).toBe('a1');
    expect(result.section).toBe('left');
  });

  it('snaps to hole f1 in right section', () => {
    const result = findNearestHoleFull(67, 14); // BBF_SECTION_RIGHT_X=67
    expect(result).not.toBeNull();
    expect(result.holeId).toBe('f1');
    expect(result.section).toBe('right');
  });

  it('snaps to bus-plus holes', () => {
    const result = findNearestHoleFull(10, 14); // BBF_BUS_PLUS_X=10
    expect(result).not.toBeNull();
    expect(result.holeId).toBe('bus-plus-1');
    expect(result.section).toBe('bus');
  });

  it('has 63 rows', () => {
    const result = findNearestHoleFull(22, 14 + 62 * 7); // row 63
    expect(result).not.toBeNull();
    expect(result.holeId).toBe('a63');
  });

  it('returns null when too far', () => {
    const result = findNearestHoleFull(-200, -200);
    expect(result).toBeNull();
  });
});
