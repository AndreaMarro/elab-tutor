/**
 * ELAB Lesson Paths — Indice percorsi lezione UNLIM
 * Ogni esperimento ha un percorso 5-step: PREPARA → MOSTRA → CHIEDI → OSSERVA → CONCLUDI
 * Generati dal curriculum YAML + dati esperimenti.
 * © Andrea Marro — 27/03/2026
 */

// Import statici per i percorsi già pronti
import v1Cap6Esp1 from './v1-cap6-esp1.json';
import v1Cap6Esp2 from './v1-cap6-esp2.json';
import v1Cap7Esp1 from './v1-cap7-esp1.json';

// Registry percorsi lezione disponibili
const LESSON_PATHS = {
  'v1-cap6-esp1': v1Cap6Esp1,
  'v1-cap6-esp2': v1Cap6Esp2,
  'v1-cap7-esp1': v1Cap7Esp1,
};

/**
 * Ottieni il percorso lezione per un esperimento
 * @param {string} experimentId - es. "v1-cap6-esp1"
 * @returns {object|null} percorso lezione o null se non disponibile
 */
export function getLessonPath(experimentId) {
  return LESSON_PATHS[experimentId] || null;
}

/**
 * Controlla se un percorso lezione è disponibile
 * @param {string} experimentId
 * @returns {boolean}
 */
export function hasLessonPath(experimentId) {
  return experimentId in LESSON_PATHS;
}

/**
 * Ottieni la lista degli esperimenti con percorso lezione
 * @returns {string[]}
 */
export function getAvailableLessonPaths() {
  return Object.keys(LESSON_PATHS);
}

/**
 * Nomi delle 5 fasi standard
 */
export const PHASE_NAMES = ['PREPARA', 'MOSTRA', 'CHIEDI', 'OSSERVA', 'CONCLUDI'];
export const PHASE_ICONS = ['📋', '🔧', '❓', '👀', '✅'];

export default LESSON_PATHS;
