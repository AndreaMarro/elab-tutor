/**
 * TASK 3 del PDR v3 DEFINITIVO — v3-cap6-esp1 parity con libro Vol3 p.56.
 *
 * Il libro ESPERIMENTO 1 ("Colleghiamo la resistenza") prescrive:
 *   - Arduino Nano su breadboard
 *   - 1 LED esterno (rosso o verde)
 *   - 1 resistore 470Ω in serie al LED
 *   - pin D13 → anodo LED; catodo → resistenza → GND
 *   - Stesso codice Blink, ma LED_BUILTIN sostituito con 13
 *
 * Prima del fix: il simulatore aveva "Circuito AND/OR con pulsanti", che NON
 * appare nel libro Vol3 Cap 6. I test qui sotto mantengono la verità del
 * libro ancorata nel codice.
 */
import { describe, it, expect } from 'vitest';
import EXPERIMENTS_VOL3 from '../../src/data/experiments-vol3';
import { getVolumeRef } from '../../src/data/volume-references';

// Support both [...] and {list:[...]} shapes historically used in this project.
const list = Array.isArray(EXPERIMENTS_VOL3)
  ? EXPERIMENTS_VOL3
  : (EXPERIMENTS_VOL3?.experiments || EXPERIMENTS_VOL3?.list || []);
const exp1 = list.find(e => e.id === 'v3-cap6-esp1');
const exp2 = list.find(e => e.id === 'v3-cap6-esp2');

describe('v3-cap6-esp1 — parity con libro Vol3 p.56 (ESPERIMENTO 1)', () => {
  it('esiste e ha id stabile', () => {
    expect(exp1).toBeDefined();
    expect(exp1.id).toBe('v3-cap6-esp1');
  });

  it('il titolo fa riferimento al LED esterno / resistenza (non AND/OR)', () => {
    const title = String(exp1.title).toLowerCase();
    expect(title).toMatch(/resisten|led|primo led/);
    expect(title).not.toMatch(/and\/or|logica|pulsanti/);
  });

  it('ha esattamente i 4 componenti del libro (breadboard, nano, resistor, led)', () => {
    const types = exp1.components.map(c => c.type).sort();
    expect(types).toEqual(['breadboard-half', 'led', 'nano-r4', 'resistor'].sort());
    // NON deve contenere pulsanti (non sono nel libro ESP1)
    expect(types).not.toContain('push-button');
  });

  it('usa un resistore da 470Ω (come da libro)', () => {
    const r = exp1.components.find(c => c.type === 'resistor');
    expect(r).toBeDefined();
    expect(r.value).toBe(470);
  });

  it('usa pin D13 per pilotare il LED (stesso blink, ma esterno)', () => {
    const connections = JSON.stringify(exp1.connections);
    const code = String(exp1.code || '');
    // Il filo deve partire da un pin Arduino digital 13
    const usesD13 = /nano1:W_D13|nano1:D13|nano1:13/i.test(connections);
    expect(usesD13).toBe(true);
    // Il codice deve usare pin 13
    expect(code).toMatch(/pinMode\s*\(\s*13/);
    expect(code).toMatch(/digitalWrite\s*\(\s*13/);
  });

  it('il codice usa il Blink pattern con delay', () => {
    const code = String(exp1.code || '');
    expect(code).toMatch(/digitalWrite\s*\(\s*13\s*,\s*HIGH/);
    expect(code).toMatch(/digitalWrite\s*\(\s*13\s*,\s*LOW/);
    expect(code).toMatch(/delay\s*\(/);
  });

  it('il catodo del LED arriva a GND (via resistore) come dice il libro', () => {
    const pins = exp1.pinAssignments;
    expect(pins['led1:anode']).toBeDefined();
    expect(pins['led1:cathode']).toBeDefined();
    // Almeno una connessione termina sul bus GND
    const wires = JSON.stringify(exp1.connections);
    expect(wires).toMatch(/bus-bot-minus|GND/);
  });

  it('il metadato volume-references continua a dire Vol3 pag 56', () => {
    const ref = getVolumeRef('v3-cap6-esp1');
    expect(ref).toBeDefined();
    expect(ref.volume).toBe(3);
    expect(ref.bookPage).toBe(56);
    expect(ref.bookText).toMatch(/LED esterno|470/i);
  });

  it('descrizione allineata al libro (LED esterno, non AND/OR)', () => {
    const desc = String(exp1.desc).toLowerCase();
    expect(desc).toMatch(/led esterno|blink|resisten/);
    expect(desc).not.toMatch(/and\/or|serie.*parallel|pulsanti/);
  });

  it('unlimPrompt cita la pagina del libro per abilitare il "docente impreparato"', () => {
    const p = String(exp1.unlimPrompt);
    // Principio Zero: UNLIM deve poter citare il libro a pagina 56
    expect(p).toMatch(/pagina\s*56|pag\.?\s*56/i);
  });

  it('numero di buildSteps coerente con un circuito semplice (≤6, non 10)', () => {
    // Il circuito LED semplice ha meno passi del vecchio AND/OR (10 passi).
    // Test comportamentale: non deve essere >6 per non confondere docenti.
    expect(Array.isArray(exp1.buildSteps)).toBe(true);
    expect(exp1.buildSteps.length).toBeLessThanOrEqual(6);
    expect(exp1.buildSteps.length).toBeGreaterThanOrEqual(3);
  });
});

// ═══════════════════════════════════════════════════════════════════
// Parity extra: esp2 del libro = "Cambia il numero di pin" (p.57)
// ═══════════════════════════════════════════════════════════════════
describe('v3-cap6-esp2 — parity con libro Vol3 p.57 (ESPERIMENTO 2)', () => {
  it('esiste e usa un pin digitale diverso da D13', () => {
    expect(exp2).toBeDefined();
    const conn = JSON.stringify(exp2.connections);
    const code = String(exp2.code || '');
    // Non deve più usare D13 (quello è di esp1)
    expect(/nano1:W_D13(\b|")/.test(conn)).toBe(false);
    expect(/pinMode\s*\(\s*13/.test(code)).toBe(false);
    // Deve usare un pin digitale diverso e coerente fra codice e collegamento
    const pinInWire = conn.match(/nano1:W_D(\d+)/);
    const pinInCode = code.match(/pinMode\s*\(\s*(\d+)\s*,\s*OUTPUT/);
    expect(pinInWire).not.toBeNull();
    expect(pinInCode).not.toBeNull();
    expect(pinInWire[1]).toBe(pinInCode[1]);
  });

  it('mantiene il resistore 470Ω e il LED (stesso circuito, solo pin cambiato)', () => {
    const types = exp2.components.map(c => c.type).sort();
    expect(types).toEqual(['breadboard-half', 'led', 'nano-r4', 'resistor'].sort());
    const r = exp2.components.find(c => c.type === 'resistor');
    expect(r.value).toBe(470);
  });

  it('il titolo riflette "cambio pin", non più "Colleghiamo la resistenza"', () => {
    const title = String(exp2.title).toLowerCase();
    // Esp1 e esp2 non devono più condividere lo stesso titolo
    expect(title).not.toBe(String(exp1.title).toLowerCase());
    expect(title).toMatch(/pin|cambia|numero/);
  });

  it('unlimPrompt cita la pagina 57 (ESPERIMENTO 2 libro)', () => {
    expect(String(exp2.unlimPrompt)).toMatch(/pagina\s*57|pag\.?\s*57/i);
  });
});

