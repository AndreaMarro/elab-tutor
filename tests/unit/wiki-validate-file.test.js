/**
 * tests/unit/wiki-validate-file.test.js — sett-4 S4.1.3 Day 24
 *
 * Covers the SCHEMA v0.1.0 validator (PZ v3 grep, front-matter schema, required
 * body sections, volume citation marker).
 */

import { describe, it, expect } from 'vitest';
import { validate, parseMarkdown } from '../../scripts/wiki-validate-file.mjs';

const VALID_EXPERIMENT = `---
id: v1-cap6-esp1
type: experiment
created: 2026-04-24T00:00:00Z
updated: 2026-04-24T00:00:00Z
volume_refs:
  - "Vol1:p.29"
kit_components:
  - "LED rosso 5mm"
difficulty: 1
concepts:
  - "led"
lessons:
  - "v1-accendi-led"
pz_v3_compliant: true
---

## Obiettivo
Accendere un LED con una resistenza di protezione. [volume:Vol1p29]

## Testo dal volume
Per accendere il LED serve una batteria e un resistore da 470 Ohm.

## Componenti kit ELAB
- LED rosso 5mm

## Schema circuito
Batteria → Resistore → LED → GND.

## Concetti chiave
- [LED](../concepts/led.md)

## Errori comuni
- LED al contrario.

## Analogie vincenti
- Il LED è come una porta a senso unico.
`;

const VALID_LESSON = `---
id: v1-accendi-led
type: lesson
created: 2026-04-24T00:00:00Z
updated: 2026-04-24T00:00:00Z
volume_refs: ["Vol1:cap.6"]
pz_v3_compliant: true
---

## Obiettivo lezione
Introdurre il circuito base. [volume:Vol1p29]

## Esperimenti raggruppati
- [v1-cap6-esp1](../experiments/v1-cap6-esp1.md)

## Concetti copertura
- [LED](../concepts/led.md)

## Flusso narrativo libro
Il libro introduce il LED come prima lucina pilotabile.
`;

const VALID_CONCEPT = `---
id: led
type: concept
created: 2026-04-24T00:00:00Z
updated: 2026-04-24T00:00:00Z
volume_refs: ["Vol1:p.29"]
pz_v3_compliant: true
---

## Definizione breve
Il LED è una lucina che si accende quando passa corrente. [volume:Vol1p29]

## Analogia principale
Come una porta a senso unico.

## Fonti volumi
- Vol. 1 p. 29

## Analogie alternative
- Cancelletto elettrico.

## Concetti correlati
- [Polarità](polarita.md)
`;

describe('wiki-validate-file — parseMarkdown', () => {
  it('extracts front-matter and body', () => {
    const { frontMatter, body } = parseMarkdown(VALID_EXPERIMENT);
    expect(frontMatter).not.toBeNull();
    expect(frontMatter.id).toBe('v1-cap6-esp1');
    expect(frontMatter.type).toBe('experiment');
    expect(frontMatter.pz_v3_compliant).toBe(true);
    expect(Array.isArray(frontMatter.volume_refs)).toBe(true);
    expect(frontMatter.volume_refs).toContain('Vol1:p.29');
    expect(body).toContain('## Obiettivo');
  });

  it('returns null front-matter when absent', () => {
    const { frontMatter } = parseMarkdown('Hello world no front-matter');
    expect(frontMatter).toBeNull();
  });

  it('parses inline arrays', () => {
    const { frontMatter } = parseMarkdown(VALID_LESSON);
    expect(frontMatter.volume_refs).toEqual(['Vol1:cap.6']);
  });
});

describe('wiki-validate-file — positive cases', () => {
  it('accepts valid experiment', () => {
    const report = validate(VALID_EXPERIMENT, { path: 'experiments/v1-cap6-esp1.md' });
    expect(report.pass).toBe(true);
    expect(report.errors).toEqual([]);
    expect(report.type).toBe('experiment');
  });

  it('accepts valid lesson', () => {
    const report = validate(VALID_LESSON, { path: 'lessons/v1-accendi-led.md' });
    expect(report.pass).toBe(true);
    expect(report.type).toBe('lesson');
  });

  it('accepts valid concept', () => {
    const report = validate(VALID_CONCEPT, { path: 'concepts/led.md' });
    expect(report.pass).toBe(true);
    expect(report.type).toBe('concept');
  });
});

describe('wiki-validate-file — PZ v3 enforcement', () => {
  it('rejects "Docente, leggi" in body', () => {
    const bad = VALID_EXPERIMENT.replace(
      '## Obiettivo\nAccendere un LED',
      '## Obiettivo\nDocente, leggi questo ai ragazzi: accendere un LED',
    );
    const report = validate(bad);
    expect(report.pass).toBe(false);
    expect(report.errors.some((e) => e.check === 'pz_v3_grep')).toBe(true);
  });

  it('rejects "Insegnante, fai" in body', () => {
    const bad = VALID_EXPERIMENT.replace(
      '## Obiettivo\n',
      '## Obiettivo\nInsegnante, fai vedere ai ragazzi questo. ',
    );
    const report = validate(bad);
    expect(report.pass).toBe(false);
    expect(report.errors.some((e) => e.check === 'pz_v3_grep')).toBe(true);
  });
});

describe('wiki-validate-file — front-matter validation', () => {
  it('rejects file without front-matter', () => {
    const report = validate('no front matter here\n## Obiettivo\n');
    expect(report.pass).toBe(false);
    expect(report.errors.some((e) => e.check === 'front_matter_present')).toBe(true);
  });

  it('rejects unknown type', () => {
    const bad = VALID_EXPERIMENT.replace('type: experiment', 'type: unknown_kind');
    const report = validate(bad);
    expect(report.pass).toBe(false);
    expect(report.errors.some((e) => e.check === 'type_valid')).toBe(true);
  });

  it('rejects missing required front-matter field', () => {
    const bad = VALID_EXPERIMENT.replace(/^id: .*$/m, '');
    const report = validate(bad);
    expect(report.pass).toBe(false);
    expect(report.errors.some((e) => e.check === 'front_matter_field' && e.message.includes('id'))).toBe(true);
  });
});

describe('wiki-validate-file — required sections', () => {
  it('rejects experiment missing "## Schema circuito"', () => {
    const bad = VALID_EXPERIMENT.replace(/## Schema circuito[\s\S]*?## Concetti/, '## Concetti');
    const report = validate(bad);
    expect(report.pass).toBe(false);
    expect(report.errors.some((e) => e.check === 'required_section' && e.message.includes('Schema circuito'))).toBe(true);
  });

  it('rejects lesson missing "## Flusso narrativo libro"', () => {
    const bad = VALID_LESSON.replace(/## Flusso narrativo libro[\s\S]*$/, '');
    const report = validate(bad);
    expect(report.pass).toBe(false);
    expect(report.errors.some((e) => e.check === 'required_section' && e.message.includes('Flusso narrativo'))).toBe(true);
  });
});

describe('wiki-validate-file — volume citation', () => {
  it('rejects experiment with volume_refs but no [volume:VolNpM] marker', () => {
    const bad = VALID_EXPERIMENT.replace('[volume:Vol1p29]', '(Vol. 1 p. 29)');
    const report = validate(bad);
    expect(report.pass).toBe(false);
    expect(report.errors.some((e) => e.check === 'volume_citation')).toBe(true);
  });

  it('accepts body with valid [volume:VolNpM] marker', () => {
    const report = validate(VALID_EXPERIMENT);
    expect(report.pass).toBe(true);
  });
});
