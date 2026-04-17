/**
 * TASK 4 del PDR v3 DEFINITIVO — v3-cap7-esp1 parity con libro Vol3 p.65.
 *
 * Il libro Vol3 Cap 7 e' su INPUT digitali (NON analogici, che sono Cap 8).
 * ESPERIMENTO 7.3 / 7.9 (p.65-69) prescrive:
 *   - Arduino Nano + 1 LED + 1 pulsante (4 gambe, a cavallo fessura centrale)
 *   - Pulsante collegato fra pin D2 e GND, NESSUNA resistenza pull-down
 *     esterna (si usa la resistenza interna via INPUT_PULLUP)
 *   - pinMode(pulsante, INPUT_PULLUP) + pinMode(led, OUTPUT)
 *   - if (digitalRead(pulsante) == LOW) → LED acceso; else → LED spento
 *   - NB: con pullup, "premuto = LOW" (sembra inverso ma e' cosi')
 *
 * Prima di questo task, v3-cap7-esp1 aveva "analogRead base" (potenziometro)
 * — appartenente concettualmente a Cap 8 del libro. Lo sostituiamo col
 * pulsante per allineare alla pagina del libro, mantenendo l'id stabile.
 */
import { describe, it, expect } from 'vitest';
import EXPERIMENTS_VOL3 from '../../src/data/experiments-vol3';
import { getVolumeRef } from '../../src/data/volume-references';

const list = Array.isArray(EXPERIMENTS_VOL3)
  ? EXPERIMENTS_VOL3
  : (EXPERIMENTS_VOL3?.experiments || EXPERIMENTS_VOL3?.list || []);
const exp1 = list.find(e => e.id === 'v3-cap7-esp1');

describe('v3-cap7-esp1 — parity con libro Vol3 Cap 7 (pulsante + digitalRead)', () => {
  it('esiste e ha id stabile', () => {
    expect(exp1).toBeDefined();
    expect(exp1.id).toBe('v3-cap7-esp1');
  });

  it('il titolo parla di pulsante / digitalRead / INPUT (non piu analogRead)', () => {
    const title = String(exp1.title).toLowerCase();
    expect(title).toMatch(/pulsante|digitalread|input/);
    expect(title).not.toMatch(/analogread|trimmer|potenziometro/);
  });

  it('usa un pulsante fra i componenti (NON piu potenziometro)', () => {
    const types = exp1.components.map(c => c.type);
    expect(types).toContain('push-button');
    expect(types).not.toContain('potentiometer');
  });

  it('ha breadboard + Arduino + LED + pulsante (circuito base del libro)', () => {
    const types = exp1.components.map(c => c.type).sort();
    expect(types).toEqual(['breadboard-half', 'led', 'nano-r4', 'push-button', 'resistor'].sort());
  });

  it('il codice usa INPUT_PULLUP come prescritto dal libro p.64', () => {
    const code = String(exp1.code || '');
    // Il libro enfatizza INPUT_PULLUP come "scorciatoia piu utile per iniziare" (p.64)
    expect(code).toMatch(/INPUT_PULLUP/);
    // NON deve usare analogRead
    expect(code).not.toMatch(/analogRead/);
    // Deve usare digitalRead
    expect(code).toMatch(/digitalRead\s*\(/);
  });

  it('il codice usa if/else sul confronto con LOW (premuto=LOW con pullup)', () => {
    const code = String(exp1.code || '');
    expect(code).toMatch(/if\s*\(/);
    // Con INPUT_PULLUP, premuto = LOW: il libro lo specifica esplicitamente (p.65)
    expect(code).toMatch(/==\s*LOW/);
  });

  it('usa un pin digitale coerente tra wire e codice (D2 nel libro, D3 sul simulatore breakout)', () => {
    const connections = JSON.stringify(exp1.connections);
    const code = String(exp1.code || '');
    // Il libro usa D2 esplicitamente (pag 64-65) ma sul breakout wing del simulatore
    // D2 non e' esposto come W_D2 (i wing pins disponibili partono da W_D3).
    // Il libro a p.66 insegna best practice: usare variabili (int pulsante = N)
    // anziche' numeri letterali, quindi accettiamo entrambi gli stili.
    const pinInWire = connections.match(/nano1:W_D(\d+)/);
    expect(pinInWire).not.toBeNull();
    const wirePin = pinInWire[1];
    // Codice deve usare INPUT_PULLUP su quel pin, direttamente o via variabile
    const directLiteral = new RegExp(`pinMode\\s*\\(\\s*${wirePin}\\s*,\\s*INPUT_PULLUP`).test(code);
    const viaVariable = /const\s+int\s+\w+\s*=\s*\d+;/.test(code)
      && /pinMode\s*\(\s*\w+\s*,\s*INPUT_PULLUP/.test(code);
    expect(directLiteral || viaVariable).toBe(true);
    // Se usa variabile, verifichiamo coerenza del numero assegnato
    if (viaVariable && !directLiteral) {
      const varAssign = code.match(/const\s+int\s+(\w+)\s*=\s*(\d+)\s*;/g) || [];
      const hasMatchingPin = varAssign.some(line => {
        const m = line.match(/const\s+int\s+(\w+)\s*=\s*(\d+)/);
        return m && m[2] === wirePin;
      });
      expect(hasMatchingPin).toBe(true);
    }
  });

  it('un lato del pulsante va a GND (configurazione pullup, libro p.65)', () => {
    const connections = JSON.stringify(exp1.connections);
    // Almeno una connessione termina o parte da un bus GND
    expect(connections).toMatch(/bus-bot-minus|GND/i);
  });

  it('il metadato volume-references dice Vol3 pag 65 (o range Cap 7)', () => {
    const ref = getVolumeRef('v3-cap7-esp1');
    expect(ref).toBeDefined();
    expect(ref.volume).toBe(3);
    // Cap 7 va p.63-73, l'ESERCIZIO principale e' a p.65
    expect(ref.bookPage).toBeGreaterThanOrEqual(63);
    expect(ref.bookPage).toBeLessThanOrEqual(73);
  });

  it('descrizione allineata al libro (pulsante, non trimmer)', () => {
    const desc = String(exp1.desc).toLowerCase();
    expect(desc).toMatch(/pulsante|bottone|input/);
    expect(desc).not.toMatch(/trimmer|potenziometro|analog/);
  });

  it('unlimPrompt cita la pagina del libro', () => {
    const p = String(exp1.unlimPrompt);
    // Accetta "pagina 65" o simili (range Cap 7)
    expect(p).toMatch(/pagina\s*6[3-9]|pag\.?\s*6[3-9]/i);
  });

  it('buildSteps coerenti con circuito semplice (≤8 passi per non confondere docente)', () => {
    expect(Array.isArray(exp1.buildSteps)).toBe(true);
    expect(exp1.buildSteps.length).toBeLessThanOrEqual(8);
    expect(exp1.buildSteps.length).toBeGreaterThanOrEqual(3);
  });

  it('desc rispetta limite UI 200 char (regola esistente in project)', () => {
    expect(exp1.desc.length).toBeLessThanOrEqual(200);
  });
});
