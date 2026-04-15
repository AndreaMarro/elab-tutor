/**
 * Volume References — Mapping esperimenti ↔ pagine dei volumi fisici ELAB
 * Fonte: pdftotext applicato ai 3 PDF ufficiali ELAB (estratti 15/04/2026)
 * Vol1: VOL1_ITA_ COMPLETO V.0.1 GP.pdf (114 pp)
 * Vol2: VOL2_ITA_COMPLETO GP V 0.1.pdf (117 pp)
 * Vol3: Manuale VOLUME 3 V0.8.1.pdf (95 pp)
 *
 * Struttura di ogni voce:
 *   volume      — numero volume (1, 2 o 3)
 *   bookPage    — prima pagina dell'esperimento nel libro fisico
 *   chapter     — titolo del capitolo
 *   chapterPage — prima pagina del capitolo
 *
 * (c) Andrea Marro — 15/04/2026
 */

const VOLUME_REFERENCES = {

  // ─────────────────────────────────────────────────
  // VOLUME 1 — Le Basi (38 esperimenti, Cap 6–14)
  // ─────────────────────────────────────────────────

  // Capitolo 6 — Cos'è il diodo LED? (p.27)
  'v1-cap6-esp1': { volume: 1, bookPage: 29, chapter: "Capitolo 6 - Cos'è il diodo LED?", chapterPage: 27 },
  'v1-cap6-esp2': { volume: 1, bookPage: 32, chapter: "Capitolo 6 - Cos'è il diodo LED?", chapterPage: 27 },
  'v1-cap6-esp3': { volume: 1, bookPage: 33, chapter: "Capitolo 6 - Cos'è il diodo LED?", chapterPage: 27 },

  // Capitolo 7 — Cos'è il LED RGB? (p.35)
  'v1-cap7-esp1': { volume: 1, bookPage: 36, chapter: "Capitolo 7 - Cos'è il LED RGB?", chapterPage: 35 },
  'v1-cap7-esp2': { volume: 1, bookPage: 38, chapter: "Capitolo 7 - Cos'è il LED RGB?", chapterPage: 35 },
  'v1-cap7-esp3': { volume: 1, bookPage: 39, chapter: "Capitolo 7 - Cos'è il LED RGB?", chapterPage: 35 },
  'v1-cap7-esp4': { volume: 1, bookPage: 39, chapter: "Capitolo 7 - Cos'è il LED RGB?", chapterPage: 35 },
  'v1-cap7-esp5': { volume: 1, bookPage: 41, chapter: "Capitolo 7 - Cos'è il LED RGB?", chapterPage: 35 },
  'v1-cap7-esp6': { volume: 1, bookPage: 42, chapter: "Capitolo 7 - Cos'è il LED RGB?", chapterPage: 35 },

  // Capitolo 8 — Cos'è un pulsante? (p.43)
  'v1-cap8-esp1': { volume: 1, bookPage: 44, chapter: "Capitolo 8 - Cos'è un pulsante?", chapterPage: 43 },
  'v1-cap8-esp2': { volume: 1, bookPage: 47, chapter: "Capitolo 8 - Cos'è un pulsante?", chapterPage: 43 },
  'v1-cap8-esp3': { volume: 1, bookPage: 47, chapter: "Capitolo 8 - Cos'è un pulsante?", chapterPage: 43 },
  'v1-cap8-esp4': { volume: 1, bookPage: 51, chapter: "Capitolo 8 - Cos'è un pulsante?", chapterPage: 43 },
  'v1-cap8-esp5': { volume: 1, bookPage: 56, chapter: "Capitolo 8 - Cos'è un pulsante?", chapterPage: 43 },

  // Capitolo 9 — Cos'è un potenziometro? (p.57)
  'v1-cap9-esp1': { volume: 1, bookPage: 58, chapter: "Capitolo 9 - Cos'è un potenziometro?", chapterPage: 57 },
  'v1-cap9-esp2': { volume: 1, bookPage: 62, chapter: "Capitolo 9 - Cos'è un potenziometro?", chapterPage: 57 },
  'v1-cap9-esp3': { volume: 1, bookPage: 63, chapter: "Capitolo 9 - Cos'è un potenziometro?", chapterPage: 57 },
  'v1-cap9-esp4': { volume: 1, bookPage: 63, chapter: "Capitolo 9 - Cos'è un potenziometro?", chapterPage: 57 },
  'v1-cap9-esp5': { volume: 1, bookPage: 67, chapter: "Capitolo 9 - Cos'è un potenziometro?", chapterPage: 57 },
  'v1-cap9-esp6': { volume: 1, bookPage: 71, chapter: "Capitolo 9 - Cos'è un potenziometro?", chapterPage: 57 },
  'v1-cap9-esp7': { volume: 1, bookPage: 78, chapter: "Capitolo 9 - Cos'è un potenziometro?", chapterPage: 57 },
  'v1-cap9-esp8': { volume: 1, bookPage: 79, chapter: "Capitolo 9 - Cos'è un potenziometro?", chapterPage: 57 },
  'v1-cap9-esp9': { volume: 1, bookPage: 79, chapter: "Capitolo 9 - Cos'è un potenziometro?", chapterPage: 57 },

  // Capitolo 10 — Cos'è un fotoresistore? (p.81)
  'v1-cap10-esp1': { volume: 1, bookPage: 82, chapter: "Capitolo 10 - Cos'è un fotoresistore?", chapterPage: 81 },
  'v1-cap10-esp2': { volume: 1, bookPage: 84, chapter: "Capitolo 10 - Cos'è un fotoresistore?", chapterPage: 81 },
  'v1-cap10-esp3': { volume: 1, bookPage: 85, chapter: "Capitolo 10 - Cos'è un fotoresistore?", chapterPage: 81 },
  'v1-cap10-esp4': { volume: 1, bookPage: 88, chapter: "Capitolo 10 - Cos'è un fotoresistore?", chapterPage: 81 },
  'v1-cap10-esp5': { volume: 1, bookPage: 91, chapter: "Capitolo 10 - Cos'è un fotoresistore?", chapterPage: 81 },
  'v1-cap10-esp6': { volume: 1, bookPage: 92, chapter: "Capitolo 10 - Cos'è un fotoresistore?", chapterPage: 81 },

  // Capitolo 11 — Cos'è un cicalino? (p.93)
  'v1-cap11-esp1': { volume: 1, bookPage: 94, chapter: "Capitolo 11 - Cos'è un cicalino?", chapterPage: 93 },
  'v1-cap11-esp2': { volume: 1, bookPage: 95, chapter: "Capitolo 11 - Cos'è un cicalino?", chapterPage: 93 },

  // Capitolo 12 — L'interruttore magnetico (p.97)
  'v1-cap12-esp1': { volume: 1, bookPage: 98,  chapter: "Capitolo 12 - L'interruttore magnetico", chapterPage: 97 },
  'v1-cap12-esp2': { volume: 1, bookPage: 100, chapter: "Capitolo 12 - L'interruttore magnetico", chapterPage: 97 },
  'v1-cap12-esp3': { volume: 1, bookPage: 101, chapter: "Capitolo 12 - L'interruttore magnetico", chapterPage: 97 },
  'v1-cap12-esp4': { volume: 1, bookPage: 101, chapter: "Capitolo 12 - L'interruttore magnetico", chapterPage: 97 },

  // Capitolo 13 — Cos'è l'elettropongo? (p.103)
  'v1-cap13-esp1': { volume: 1, bookPage: 104, chapter: "Capitolo 13 - Cos'è l'elettropongo?", chapterPage: 103 },
  'v1-cap13-esp2': { volume: 1, bookPage: 105, chapter: "Capitolo 13 - Cos'è l'elettropongo?", chapterPage: 103 },

  // Capitolo 14 — Costruiamo il nostro primo robot (p.107)
  'v1-cap14-esp1': { volume: 1, bookPage: 107, chapter: "Capitolo 14 - Costruiamo il nostro primo robot", chapterPage: 107 },

  // ─────────────────────────────────────────────────
  // VOLUME 2 — Approfondiamo (27 esperimenti, Cap 3–12)
  // ─────────────────────────────────────────────────

  // Capitolo 3 — Il Multimetro (p.13)
  'v2-cap3-esp1': { volume: 2, bookPage: 17, chapter: "Capitolo 3 - Il Multimetro", chapterPage: 13 },
  'v2-cap3-esp2': { volume: 2, bookPage: 20, chapter: "Capitolo 3 - Il Multimetro", chapterPage: 13 },
  'v2-cap3-esp3': { volume: 2, bookPage: 22, chapter: "Capitolo 3 - Il Multimetro", chapterPage: 13 },
  'v2-cap3-esp4': { volume: 2, bookPage: 28, chapter: "Capitolo 3 - Il Multimetro", chapterPage: 13 },

  // Capitolo 4 — Approfondiamo le Resistenze (p.37)
  'v2-cap4-esp1': { volume: 2, bookPage: 43, chapter: "Capitolo 4 - Approfondiamo le Resistenze", chapterPage: 37 },
  'v2-cap4-esp2': { volume: 2, bookPage: 44, chapter: "Capitolo 4 - Approfondiamo le Resistenze", chapterPage: 37 },
  'v2-cap4-esp3': { volume: 2, bookPage: 45, chapter: "Capitolo 4 - Approfondiamo le Resistenze", chapterPage: 37 },

  // Capitolo 5 — Approfondiamo le Batterie (p.47)
  'v2-cap5-esp1': { volume: 2, bookPage: 49, chapter: "Capitolo 5 - Approfondiamo le Batterie", chapterPage: 47 },
  'v2-cap5-esp2': { volume: 2, bookPage: 51, chapter: "Capitolo 5 - Approfondiamo le Batterie", chapterPage: 47 },

  // Capitolo 6 — Approfondiamo i LED (p.53)
  'v2-cap6-esp1': { volume: 2, bookPage: 56, chapter: "Capitolo 6 - Approfondiamo i LED", chapterPage: 53 },
  'v2-cap6-esp2': { volume: 2, bookPage: 58, chapter: "Capitolo 6 - Approfondiamo i LED", chapterPage: 53 },
  'v2-cap6-esp3': { volume: 2, bookPage: 59, chapter: "Capitolo 6 - Approfondiamo i LED", chapterPage: 53 },
  'v2-cap6-esp4': { volume: 2, bookPage: 60, chapter: "Capitolo 6 - Approfondiamo i LED", chapterPage: 53 },

  // Capitolo 7 — Cosa sono i Condensatori? (p.63)
  'v2-cap7-esp1': { volume: 2, bookPage: 67, chapter: "Capitolo 7 - Cosa sono i Condensatori?", chapterPage: 63 },
  'v2-cap7-esp2': { volume: 2, bookPage: 69, chapter: "Capitolo 7 - Cosa sono i Condensatori?", chapterPage: 63 },
  'v2-cap7-esp3': { volume: 2, bookPage: 72, chapter: "Capitolo 7 - Cosa sono i Condensatori?", chapterPage: 63 },
  'v2-cap7-esp4': { volume: 2, bookPage: 73, chapter: "Capitolo 7 - Cosa sono i Condensatori?", chapterPage: 63 },

  // Capitolo 8 — Cosa sono i Transistor? (p.75)
  'v2-cap8-esp1': { volume: 2, bookPage: 78, chapter: "Capitolo 8 - Cosa sono i Transistor?", chapterPage: 75 },
  'v2-cap8-esp2': { volume: 2, bookPage: 81, chapter: "Capitolo 8 - Cosa sono i Transistor?", chapterPage: 75 },
  'v2-cap8-esp3': { volume: 2, bookPage: 82, chapter: "Capitolo 8 - Cosa sono i Transistor?", chapterPage: 75 },

  // Capitolo 9 — Cosa sono i Fototransistor? (p.85)
  'v2-cap9-esp1': { volume: 2, bookPage: 86, chapter: "Capitolo 9 - Cosa sono i Fototransistor?", chapterPage: 85 },
  'v2-cap9-esp2': { volume: 2, bookPage: 89, chapter: "Capitolo 9 - Cosa sono i Fototransistor?", chapterPage: 85 },

  // Capitolo 10 — Il Motore a Corrente Continua (p.93)
  'v2-cap10-esp1': { volume: 2, bookPage: 95, chapter: "Capitolo 10 - Il Motore a Corrente Continua", chapterPage: 93 },
  'v2-cap10-esp2': { volume: 2, bookPage: 96, chapter: "Capitolo 10 - Il Motore a Corrente Continua", chapterPage: 93 },
  'v2-cap10-esp3': { volume: 2, bookPage: 96, chapter: "Capitolo 10 - Il Motore a Corrente Continua", chapterPage: 93 },
  'v2-cap10-esp4': { volume: 2, bookPage: 96, chapter: "Capitolo 10 - Il Motore a Corrente Continua", chapterPage: 93 },

  // Capitolo 12 — Robot Segui Luce (p.103)
  'v2-cap12-esp1': { volume: 2, bookPage: 103, chapter: "Capitolo 12 - Robot Segui Luce", chapterPage: 103 },

  // ─────────────────────────────────────────────────
  // VOLUME 3 — Arduino (27 esp + extra, Cap 5–8 + Extra)
  // Fonte: Manuale VOLUME 3 V0.8.1 — pagine fisiche del libro
  // ─────────────────────────────────────────────────

  // Capitolo 5 — Come è fatto un programma Arduino? (p.47)
  'v3-cap5-esp1': { volume: 3, bookPage: 47, chapter: "Capitolo 5 - Come è fatto un programma Arduino?", chapterPage: 47 },
  'v3-cap5-esp2': { volume: 3, bookPage: 49, chapter: "Capitolo 5 - Come è fatto un programma Arduino?", chapterPage: 47 },

  // Capitolo 6 — I Pin Digitali: Le Dita di Arduino (p.53)
  // OUTPUT experiments (esp1-6, morse, semaforo)
  'v3-cap6-esp1':    { volume: 3, bookPage: 56, chapter: "Capitolo 6 - I Pin Digitali: Le Dita di Arduino", chapterPage: 53 },
  'v3-cap6-esp2':    { volume: 3, bookPage: 57, chapter: "Capitolo 6 - I Pin Digitali: Le Dita di Arduino", chapterPage: 53 },
  'v3-cap6-morse':   { volume: 3, bookPage: 57, chapter: "Capitolo 6 - I Pin Digitali: Le Dita di Arduino", chapterPage: 53 },
  'v3-cap6-esp3':    { volume: 3, bookPage: 57, chapter: "Capitolo 6 - I Pin Digitali: Le Dita di Arduino", chapterPage: 53 },
  'v3-cap6-esp4':    { volume: 3, bookPage: 58, chapter: "Capitolo 6 - I Pin Digitali: Le Dita di Arduino", chapterPage: 53 },
  'v3-cap6-semaforo':{ volume: 3, bookPage: 58, chapter: "Capitolo 6 - I Pin Digitali: Le Dita di Arduino", chapterPage: 53 },
  'v3-cap6-esp5':    { volume: 3, bookPage: 59, chapter: "Capitolo 6 - I Pin Digitali: Le Dita di Arduino", chapterPage: 53 },
  'v3-cap6-esp6':    { volume: 3, bookPage: 59, chapter: "Capitolo 6 - I Pin Digitali: Le Dita di Arduino", chapterPage: 53 },

  // Capitolo 7 — I Pin di Input: Arduino Ascolta e Decide (p.63)
  // INPUT experiments (esp7 from cap6, cap7-esp1/2)
  'v3-cap6-esp7': { volume: 3, bookPage: 65, chapter: "Capitolo 7 - I Pin di Input: Arduino Ascolta e Decide", chapterPage: 63 },
  'v3-cap7-esp1': { volume: 3, bookPage: 65, chapter: "Capitolo 7 - I Pin di Input: Arduino Ascolta e Decide", chapterPage: 63 },
  'v3-cap7-esp2': { volume: 3, bookPage: 67, chapter: "Capitolo 7 - I Pin di Input: Arduino Ascolta e Decide", chapterPage: 63 },

  // Capitolo 8 — I Pin Analogici (p.75)
  'v3-cap7-esp3': { volume: 3, bookPage: 75, chapter: "Capitolo 8 - I Pin Analogici", chapterPage: 75 },
  'v3-cap7-esp4': { volume: 3, bookPage: 76, chapter: "Capitolo 8 - I Pin Analogici", chapterPage: 75 },
  'v3-cap7-esp5': { volume: 3, bookPage: 77, chapter: "Capitolo 8 - I Pin Analogici", chapterPage: 75 },
  'v3-cap7-esp6': { volume: 3, bookPage: 78, chapter: "Capitolo 8 - I Pin Analogici", chapterPage: 75 },
  'v3-cap7-esp7': { volume: 3, bookPage: 79, chapter: "Capitolo 8 - I Pin Analogici", chapterPage: 75 },
  'v3-cap7-esp8': { volume: 3, bookPage: 80, chapter: "Capitolo 8 - I Pin Analogici", chapterPage: 75 },
  'v3-cap8-esp1': { volume: 3, bookPage: 81, chapter: "Capitolo 8 - I Pin Analogici", chapterPage: 75 },
  'v3-cap8-esp2': { volume: 3, bookPage: 82, chapter: "Capitolo 8 - I Pin Analogici", chapterPage: 75 },

  // Capitolo 9 — Comunicazione Seriale (p.85)
  'v3-cap8-esp3': { volume: 3, bookPage: 85, chapter: "Capitolo 9 - Comunicazione Seriale", chapterPage: 85 },
  'v3-cap8-esp4': { volume: 3, bookPage: 86, chapter: "Capitolo 9 - Comunicazione Seriale", chapterPage: 85 },
  'v3-cap8-esp5': { volume: 3, bookPage: 87, chapter: "Capitolo 9 - Comunicazione Seriale", chapterPage: 85 },

  // Extra — Progetti Avanzati (p.88+)
  'v3-extra-lcd-hello':   { volume: 3, bookPage: 88, chapter: "Extra - Progetti e Sfide Finali", chapterPage: 88 },
  'v3-extra-servo-sweep': { volume: 3, bookPage: 90, chapter: "Extra - Progetti e Sfide Finali", chapterPage: 88 },
  'v3-extra-simon':       { volume: 3, bookPage: 92, chapter: "Extra - Progetti e Sfide Finali", chapterPage: 88 },
};

export default VOLUME_REFERENCES;

/**
 * Returns full reference info for an experiment.
 * @param {string} experimentId
 * @returns {{ volume: number, bookPage: number, chapter: string, chapterPage: number } | null}
 */
export function getVolumeRef(experimentId) {
  return VOLUME_REFERENCES[experimentId] || null;
}

/**
 * Returns the book page number for an experiment.
 * @param {string} experimentId
 * @returns {number | null}
 */
export function getBookPage(experimentId) {
  return VOLUME_REFERENCES[experimentId]?.bookPage || null;
}

/**
 * Returns "Vol. N, p. XX" label for display in the UI.
 * @param {string} experimentId
 * @returns {string | null}
 */
export function getVolumeLabel(experimentId) {
// © Andrea Marro — 15/04/2026 — ELAB Tutor — Tutti i diritti riservati
  const ref = VOLUME_REFERENCES[experimentId];
  if (!ref) return null;
  return `Vol. ${ref.volume}, p. ${ref.bookPage}`;
}
