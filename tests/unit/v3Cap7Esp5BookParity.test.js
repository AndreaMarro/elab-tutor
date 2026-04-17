/**
 * TASK 5 del PDR v3 DEFINITIVO — v3-cap7-esp5 parity con libro Vol3 p.77.
 *
 * Il libro Vol3 Cap 8 p.77-82 (il simulatore mappa tutto sul "Cap 7" per
 * legacy — debito tecnico) prescrive il primo programma analogico con
 * Monitor Seriale:
 *   - Potenziometro collegato (5V, GND, A0)
 *   - Serial.begin(9600) nel setup
 *   - Nel loop: int valore = analogRead(A0); Serial.println(valore);
 *     delay(200-250) per non inondare il Monitor
 *   - Aprire Strumenti > Monitor Seriale a 9600 baud
 *
 * Prima di questo task v3-cap7-esp5 era "PWM con valori manuali"
 * (analogWrite su LED) — contenuto utile ma NON il primo analogRead del
 * libro. Sostituiamo per allineare al libro, mantenendo id stabile.
 */
import { describe, it, expect } from 'vitest';
import EXPERIMENTS_VOL3 from '../../src/data/experiments-vol3';
import { getVolumeRef } from '../../src/data/volume-references';

const list = Array.isArray(EXPERIMENTS_VOL3)
  ? EXPERIMENTS_VOL3
  : (EXPERIMENTS_VOL3?.experiments || EXPERIMENTS_VOL3?.list || []);
const exp5 = list.find(e => e.id === 'v3-cap7-esp5');

describe('v3-cap7-esp5 — parity con libro Vol3 p.77 (analogRead + Serial Monitor)', () => {
  it('esiste e ha id stabile', () => {
    expect(exp5).toBeDefined();
    expect(exp5.id).toBe('v3-cap7-esp5');
  });

  it('titolo parla di analogRead/Serial/Monitor (non piu PWM)', () => {
    const title = String(exp5.title).toLowerCase();
    expect(title).toMatch(/analogread|serial|monitor/);
    expect(title).not.toMatch(/pwm|analogwrite/);
  });

  it('usa il potenziometro come sensore analogico (libro p.80)', () => {
    const types = exp5.components.map(c => c.type);
    expect(types).toContain('potentiometer');
  });

  it('il codice inizializza Serial.begin(9600) nel setup', () => {
    const code = String(exp5.code || '');
    expect(code).toMatch(/Serial\.begin\s*\(\s*9600/);
  });

  it('il codice legge analogRead(A0) e lo stampa con Serial.println', () => {
    const code = String(exp5.code || '');
    expect(code).toMatch(/analogRead\s*\(\s*A0/);
    expect(code).toMatch(/Serial\.println\s*\(/);
  });

  it('il codice ha un delay per non inondare il Monitor (libro p.81)', () => {
    const code = String(exp5.code || '');
    // Libro consiglia 200-250ms. Accettiamo qualsiasi delay >= 100ms.
    const m = code.match(/delay\s*\(\s*(\d+)\s*\)/);
    expect(m).not.toBeNull();
    expect(Number(m[1])).toBeGreaterThanOrEqual(100);
  });

  it('usa il pin A0 coerentemente in wire e codice', () => {
    const connections = JSON.stringify(exp5.connections);
    const code = String(exp5.code || '');
    expect(connections).toMatch(/nano1:W_A0/);
    expect(code).toMatch(/A0/);
  });

  it('il potenziometro ha VCC/signal/GND collegati (3 fili)', () => {
    const pins = exp5.pinAssignments || {};
    expect(pins['pot1:vcc'] || pins['pot1:VCC']).toBeDefined();
    expect(pins['pot1:signal'] || pins['pot1:SIGNAL']).toBeDefined();
    expect(pins['pot1:gnd'] || pins['pot1:GND']).toBeDefined();
  });

  it('metadato volume-references dice Vol3 pag 77', () => {
    const ref = getVolumeRef('v3-cap7-esp5');
    expect(ref).toBeDefined();
    expect(ref.volume).toBe(3);
    expect(ref.bookPage).toBe(77);
    expect(ref.bookText).toMatch(/analogRead|Serial/i);
  });

  it('descrizione allineata (Serial Monitor, non piu analogWrite/PWM)', () => {
    const desc = String(exp5.desc).toLowerCase();
    expect(desc).toMatch(/monitor|serial|analogread|potenziometro|manopola/);
    expect(desc).not.toMatch(/pwm|dimmer|analogwrite/);
  });

  it('unlimPrompt cita pagina 77 (o pagine limitrofe Cap analogRead)', () => {
    const p = String(exp5.unlimPrompt);
    expect(p).toMatch(/pagina\s*(77|80|81|82)|pag\.?\s*(77|80|81|82)/i);
  });

  it('desc rispetta limite UI 200 char', () => {
    expect(exp5.desc.length).toBeLessThanOrEqual(200);
  });

  it('estimatedMinutes nella whitelist del progetto', () => {
    expect([15, 30, 45, 60]).toContain(exp5.estimatedMinutes);
  });
});
