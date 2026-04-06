/**
 * ELAB E2E — Experiment Data Integrity Tests
 * Verifica che OGNI esperimento abbia tutti i dati necessari.
 * Questi test sono la fonte di verità per il benchmark 200.
 * © Andrea Marro — 05/04/2026
 */

import { describe, it, expect } from 'vitest';
import EXPERIMENTS_VOL1 from '../../src/data/experiments-vol1';
import EXPERIMENTS_VOL2 from '../../src/data/experiments-vol2';
import EXPERIMENTS_VOL3 from '../../src/data/experiments-vol3';

const ALL = [
  ...EXPERIMENTS_VOL1.experiments,
  ...EXPERIMENTS_VOL2.experiments,
  ...EXPERIMENTS_VOL3.experiments,
];

const AVR = ALL.filter(e => e.simulationMode === 'avr');
const AVR_WITH_CODE = AVR.filter(e => e.code);

// ─── DATI COMPLETEZZA ─────────────────────────────────

describe('Experiment Data Integrity', () => {
  it('should have exactly 92 experiments', () => {
    expect(ALL.length).toBe(92);
  });

  it('Vol1 should have 38 experiments', () => {
    expect(EXPERIMENTS_VOL1.experiments.length).toBe(38);
  });

  it('Vol2 should have 27 experiments', () => {
    expect(EXPERIMENTS_VOL2.experiments.length).toBe(27);
  });

  it('Vol3 should have 27 experiments', () => {
    expect(EXPERIMENTS_VOL3.experiments.length).toBe(27);
  });

  it('every experiment should have buildSteps', () => {
    const missing = ALL.filter(e => !e.buildSteps?.length);
    expect(missing.map(e => e.id)).toEqual([]);
  });

  it('every experiment should have quiz', () => {
    const missing = ALL.filter(e => !e.quiz?.length);
    expect(missing.map(e => e.id)).toEqual([]);
  });

  it('every experiment should have required fields', () => {
    ALL.forEach(e => {
      expect(e.id).toBeTruthy();
      expect(e.title).toBeTruthy();
      expect(e.chapter).toBeTruthy();
      expect(e.components).toBeInstanceOf(Array);
      expect(e.simulationMode).toMatch(/^(circuit|avr)$/);
    });
  });
});

// ─── AVR SPECIFICI ────────────────────────────────────

describe('AVR Experiment Completeness', () => {
  it('every AVR experiment with code should have scratchXml', () => {
    const missing = AVR_WITH_CODE.filter(e => !e.scratchXml);
    expect(missing.map(e => e.id)).toEqual([]);
  });

  it('AVR experiments with code and hexFile: at least 24/26', () => {
    const withHex = AVR_WITH_CODE.filter(e => e.hexFile);
    // v3-cap7-esp8 (DAC) is known to be incompatible
    expect(withHex.length).toBeGreaterThanOrEqual(24);
  });

  it('every hexFile path should start with /hex/', () => {
    AVR_WITH_CODE.filter(e => e.hexFile).forEach(e => {
      expect(e.hexFile).toMatch(/^\/hex\//);
    });
  });
});

// ─── NO EMOJI IN ICON FIELDS ──────────────────────────

describe('No emoji in experiment icon fields', () => {
  it('no experiment should have unicode emoji in icon field', () => {
    const withEmoji = ALL.filter(e => {
      if (!e.icon) return false;
      // Check for surrogate pairs or \u{1F...} patterns
      return /[\uD800-\uDFFF]|[\u{1F000}-\u{1FFFF}]/u.test(e.icon);
    });
    expect(withEmoji.map(e => `${e.id}: ${e.icon}`)).toEqual([]);
  });
});

// ─── CONNECTIONS INTEGRITY ────────────────────────────

describe('Connection integrity', () => {
  it('every experiment with 3+ components should have connections', () => {
    const suspicious = ALL.filter(e => {
      const hasMultipleComps = e.components?.length > 2;
      const hasConnections = e.connections?.length > 0;
      return hasMultipleComps && !hasConnections;
    });
    expect(suspicious.map(e => e.id)).toEqual([]);
  });
});

// ─── OBJ-11/12/13: CARICAMENTO PER VOLUME ────────────

describe('OBJ-11: Vol1 experiment loadability', () => {
  EXPERIMENTS_VOL1.experiments.forEach(e => {
    it(`${e.id} should be loadable (components + layout)`, () => {
      expect(e.components.length).toBeGreaterThan(0);
      expect(e.layout).toBeTruthy();
      e.components.forEach(c => {
        expect(e.layout[c.id], `${e.id} missing layout for ${c.id}`).toBeTruthy();
        expect(typeof e.layout[c.id].x).toBe('number');
        expect(typeof e.layout[c.id].y).toBe('number');
      });
    });
  });
});

describe('OBJ-12: Vol2 experiment loadability', () => {
  EXPERIMENTS_VOL2.experiments.forEach(e => {
    it(`${e.id} should be loadable (components + layout)`, () => {
      expect(e.components.length).toBeGreaterThan(0);
      expect(e.layout).toBeTruthy();
      e.components.forEach(c => {
        expect(e.layout[c.id], `${e.id} missing layout for ${c.id}`).toBeTruthy();
        expect(typeof e.layout[c.id].x).toBe('number');
        expect(typeof e.layout[c.id].y).toBe('number');
      });
    });
  });
});

describe('OBJ-13: Vol3 experiment loadability', () => {
  EXPERIMENTS_VOL3.experiments.forEach(e => {
    it(`${e.id} should be loadable (components + layout)`, () => {
      expect(e.components.length).toBeGreaterThan(0);
      expect(e.layout).toBeTruthy();
      e.components.forEach(c => {
        expect(e.layout[c.id], `${e.id} missing layout for ${c.id}`).toBeTruthy();
        expect(typeof e.layout[c.id].x).toBe('number');
        expect(typeof e.layout[c.id].y).toBe('number');
      });
    });
  });

  it('Vol3 AVR experiments with code should have hexFile or hwOnly', () => {
    const avrWithCode = EXPERIMENTS_VOL3.experiments.filter(e => e.simulationMode === 'avr' && e.code);
    avrWithCode.forEach(e => {
      const hasHex = !!e.hexFile;
      const isHwOnly = !!e.hwOnly;
      expect(hasHex || isHwOnly).toBe(true);
    });
  });
});

// ─── OBJ-14: STRESS TEST COMPONENT LIMITS ────────────

describe('OBJ-14: Component stress boundaries', () => {
  it('no experiment exceeds 15 components', () => {
    const overLimit = ALL.filter(e => e.components.length > 15);
    expect(overLimit.map(e => `${e.id}: ${e.components.length}`)).toEqual([]);
  });

  it('all component types are recognized', () => {
    const validTypes = new Set([
      'battery9v', 'breadboard-half', 'breadboard-full', 'resistor', 'led',
      'rgb-led', 'push-button', 'potentiometer', 'photo-resistor', 'buzzer-piezo',
      'reed-switch', 'nano-r4', 'multimeter', 'capacitor', 'mosfet-n',
      'phototransistor', 'motor-dc', 'servo', 'lcd16x2', 'diode',
    ]);
    const unknown = [];
    ALL.forEach(e => {
      e.components.forEach(c => {
        if (!validTypes.has(c.type)) unknown.push(`${e.id}: ${c.type}`);
      });
    });
    expect(unknown).toEqual([]);
  });

  it('all pinAssignment keys reference valid component IDs', () => {
    const invalid = [];
    ALL.forEach(e => {
      if (!e.pinAssignments) return;
      const validIds = new Set(e.components.map(c => c.id));
      Object.keys(e.pinAssignments).forEach(key => {
        const compId = key.split(':')[0];
        if (!validIds.has(compId)) invalid.push(`${e.id}: ${key}`);
      });
    });
    expect(invalid).toEqual([]);
  });

  it('all connection endpoints reference valid component IDs or bus', () => {
    const invalid = [];
    ALL.forEach(e => {
      if (!e.connections) return;
      const validIds = new Set(e.components.map(c => c.id));
      e.connections.forEach((conn, i) => {
        [conn.from, conn.to].forEach(endpoint => {
          const compId = endpoint.split(':')[0];
          if (!validIds.has(compId) && !endpoint.includes('bus-')) {
            invalid.push(`${e.id} conn[${i}]: ${endpoint}`);
          }
        });
      });
    });
    expect(invalid).toEqual([]);
  });
});

// ─── LESSON PATH INTEGRITY ───────────────────────────

describe('Lesson path integrity', () => {
  const fs = require('fs');
  const path = require('path');
  const lpDir = path.join(__dirname, '../../src/data/lesson-paths');
  const files = fs.readdirSync(lpDir).filter(f => f.endsWith('.json'));

  it('should have 92 lesson path files', () => {
    expect(files.length).toBe(92);
  });

  it('every lesson path should have provocative_question', () => {
    const missing = files.filter(f => {
      const data = JSON.parse(fs.readFileSync(path.join(lpDir, f), 'utf8'));
      return !(data.phases && data.phases.some(p => p.provocative_question));
    });
    expect(missing).toEqual([]);
  });

  it('every lesson path should have analogies', () => {
    const missing = files.filter(f => {
      const data = JSON.parse(fs.readFileSync(path.join(lpDir, f), 'utf8'));
      return !(data.phases && data.phases.some(p => p.analogies && p.analogies.length > 0));
    });
    expect(missing).toEqual([]);
  });

  it('every lesson path should have next_experiment or session_save.next_suggested', () => {
    const missing = files.filter(f => {
      const data = JSON.parse(fs.readFileSync(path.join(lpDir, f), 'utf8'));
      return !(data.next_experiment || data.session_save?.next_suggested);
    });
    expect(missing).toEqual([]);
  });
});
