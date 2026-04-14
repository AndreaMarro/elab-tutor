/**
 * experimentConnections.test.js — Validate ALL connections across 92 experiments
 * from/to fields, format, color validity, no duplicates
 */
import { describe, it, expect } from 'vitest';
import EXPERIMENTS_VOL1 from '../../src/data/experiments-vol1';
import EXPERIMENTS_VOL2 from '../../src/data/experiments-vol2';
import EXPERIMENTS_VOL3 from '../../src/data/experiments-vol3';

const ALL_EXPERIMENTS = [
  ...EXPERIMENTS_VOL1.experiments,
  ...EXPERIMENTS_VOL2.experiments,
  ...EXPERIMENTS_VOL3.experiments,
];

describe('experimentConnections — basic structure', () => {
  it('all 92 experiments are loaded', () => {
    expect(ALL_EXPERIMENTS.length).toBe(92);
  });

  it('every experiment has a connections array', () => {
    ALL_EXPERIMENTS.forEach(exp => {
      expect(Array.isArray(exp.connections), `${exp.id} connections not array`).toBe(true);
    });
  });
});

describe('experimentConnections — from/to fields present', () => {
  ALL_EXPERIMENTS.forEach(exp => {
    if (exp.connections.length > 0) {
      it(`${exp.id}: every connection has from and to`, () => {
        exp.connections.forEach((conn, idx) => {
          expect(conn.from, `${exp.id} conn[${idx}] missing from`).toBeDefined();
          expect(conn.to, `${exp.id} conn[${idx}] missing to`).toBeDefined();
          expect(typeof conn.from).toBe('string');
          expect(typeof conn.to).toBe('string');
        });
      });
    }
  });
});

describe('experimentConnections — from/to format is componentId:pinName', () => {
  ALL_EXPERIMENTS.forEach(exp => {
    if (exp.connections.length > 0) {
      it(`${exp.id}: from/to contain colon separator`, () => {
        exp.connections.forEach((conn, idx) => {
          expect(
            conn.from.includes(':'),
            `${exp.id} conn[${idx}] from="${conn.from}" missing colon`
          ).toBe(true);
          expect(
            conn.to.includes(':'),
            `${exp.id} conn[${idx}] to="${conn.to}" missing colon`
          ).toBe(true);
        });
      });
    }
  });
});

describe('experimentConnections — from/to have two parts', () => {
  ALL_EXPERIMENTS.forEach(exp => {
    if (exp.connections.length > 0) {
      it(`${exp.id}: from/to split into componentId and pinName`, () => {
        exp.connections.forEach((conn, idx) => {
          const fromParts = conn.from.split(':');
          const toParts = conn.to.split(':');
          expect(fromParts.length, `${exp.id} conn[${idx}] from="${conn.from}" bad format`).toBeGreaterThanOrEqual(2);
          expect(toParts.length, `${exp.id} conn[${idx}] to="${conn.to}" bad format`).toBeGreaterThanOrEqual(2);
          expect(fromParts[0].length).toBeGreaterThan(0);
          expect(toParts[0].length).toBeGreaterThan(0);
        });
      });
    }
  });
});

describe('experimentConnections — color field validity', () => {
  const VALID_COLORS = ['red', 'black', 'yellow', 'green', 'blue', 'orange', 'white', 'purple'];

  ALL_EXPERIMENTS.forEach(exp => {
    const connsWithColor = exp.connections.filter(c => c.color);
    if (connsWithColor.length > 0) {
      it(`${exp.id}: connection colors are valid`, () => {
        connsWithColor.forEach((conn, idx) => {
          expect(
            VALID_COLORS.includes(conn.color),
            `${exp.id} conn from=${conn.from} invalid color "${conn.color}"`
          ).toBe(true);
        });
      });
    }
  });
});

describe('experimentConnections — no duplicate connections', () => {
  ALL_EXPERIMENTS.forEach(exp => {
    if (exp.connections.length > 1) {
      it(`${exp.id}: no duplicate from->to pairs`, () => {
        const seen = new Set();
        exp.connections.forEach(conn => {
          const key = `${conn.from}->${conn.to}`;
          expect(seen.has(key), `${exp.id} duplicate connection: ${key}`).toBe(false);
          seen.add(key);
        });
      });
    }
  });
});

describe('experimentConnections — connection componentIds reference experiment components', () => {
  ALL_EXPERIMENTS.forEach(exp => {
    if (exp.connections.length > 0) {
      it(`${exp.id}: connection componentIds exist in components`, () => {
        const componentIds = (exp.components || []).map(c => c.id);
        exp.connections.forEach(conn => {
          const fromId = conn.from.split(':')[0];
          const toId = conn.to.split(':')[0];
          expect(
            componentIds.includes(fromId),
            `${exp.id} connection from="${conn.from}" references unknown component "${fromId}"`
          ).toBe(true);
          expect(
            componentIds.includes(toId),
            `${exp.id} connection to="${conn.to}" references unknown component "${toId}"`
          ).toBe(true);
        });
      });
    }
  });
});

describe('experimentConnections — from and to are not the same', () => {
  ALL_EXPERIMENTS.forEach(exp => {
    if (exp.connections.length > 0) {
      it(`${exp.id}: no self-connections (from !== to)`, () => {
        exp.connections.forEach(conn => {
          expect(
            conn.from !== conn.to,
            `${exp.id} self-connection: ${conn.from}`
          ).toBe(true);
        });
      });
    }
  });
});

describe('experimentConnections — aggregate stats', () => {
  it('experiments with connections: majority have at least 2', () => {
    const withConnections = ALL_EXPERIMENTS.filter(e => e.connections.length > 0);
    const withMultiple = withConnections.filter(e => e.connections.length >= 2);
    expect(withMultiple.length).toBeGreaterThan(withConnections.length / 2);
  });

  it('total connections across all experiments > 200', () => {
    const total = ALL_EXPERIMENTS.reduce((sum, e) => sum + e.connections.length, 0);
    expect(total).toBeGreaterThan(200);
  });

  it('all connection colors are from the valid palette', () => {
    const VALID_COLORS = ['red', 'black', 'yellow', 'green', 'blue', 'orange', 'white', 'purple'];
    const allColors = new Set();
    ALL_EXPERIMENTS.forEach(e => e.connections.forEach(c => {
      if (c.color) allColors.add(c.color);
    }));
    [...allColors].forEach(color => {
      expect(VALID_COLORS).toContain(color);
    });
  });
});
