/**
 * Raggruppamento esperimenti in Lezioni
 *
 * I libri fisici ELAB raggruppano per CONCETTO con variazioni.
 * Ogni "Lezione" contiene esperimenti correlati che esplorano
 * lo stesso concetto da angolazioni diverse.
 *
 * Struttura: lessonId -> { title, concept, experiments[] }
 */

const LESSON_GROUPS = {
  // ═══════════════════════════════════════
  // VOLUME 1 — Le Basi
  // ═══════════════════════════════════════

  'v1-accendi-led': {
    title: 'Accendi il LED',
    concept: 'Circuito base: batteria + resistore + LED',
    volume: 1,
    chapter: 6,
    icon: '💡',
    experiments: ['v1-cap6-esp1', 'v1-cap6-esp2', 'v1-cap6-esp3']
  },
  'v1-led-rgb': {
    title: 'Il LED RGB',
    concept: 'Mescola i colori con un singolo LED',
    volume: 1,
    chapter: 7,
    icon: '🌈',
    experiments: ['v1-cap7-esp1', 'v1-cap7-esp2', 'v1-cap7-esp3', 'v1-cap7-esp4', 'v1-cap7-esp5', 'v1-cap7-esp6']
  },
  'v1-pulsanti': {
    title: 'I pulsanti',
    concept: 'Controlla il circuito con un interruttore',
    volume: 1,
    chapter: 8,
    icon: '🔘',
    experiments: ['v1-cap8-esp1', 'v1-cap8-esp2', 'v1-cap8-esp3', 'v1-cap8-esp4', 'v1-cap8-esp5']
  },
  'v1-potenziometro': {
    title: 'Il potenziometro',
    concept: 'Regola la luminosit\u00E0 con una manopola',
    volume: 1,
    chapter: 9,
    icon: '🎛️',
    experiments: ['v1-cap9-esp1', 'v1-cap9-esp2', 'v1-cap9-esp3', 'v1-cap9-esp4', 'v1-cap9-esp5', 'v1-cap9-esp6']
  },
  'v1-sfide-pot': {
    title: 'Sfide: combina tutto!',
    concept: 'Metti insieme pulsanti, pot e LED RGB',
    volume: 1,
    chapter: 9,
    icon: '🏆',
    isChallenges: true,
    experiments: ['v1-cap9-esp7', 'v1-cap9-esp8', 'v1-cap9-esp9']
  },
  'v1-sensore-luce': {
    title: 'Sensore di luce (LDR)',
    concept: 'Il circuito reagisce alla luce ambientale',
    volume: 1,
    chapter: 10,
    icon: '☀️',
    experiments: ['v1-cap10-esp1', 'v1-cap10-esp2', 'v1-cap10-esp3', 'v1-cap10-esp4', 'v1-cap10-esp5', 'v1-cap10-esp6']
  },
  'v1-buzzer': {
    title: 'Il buzzer',
    concept: 'Aggiungi il suono al circuito',
    volume: 1,
    chapter: 11,
    icon: '🔔',
    experiments: ['v1-cap11-esp1', 'v1-cap11-esp2']
  },
  'v1-reed-switch': {
    title: 'Il reed switch (magnete)',
    concept: 'Un interruttore invisibile attivato dal magnete',
    volume: 1,
    chapter: 12,
    icon: '🧲',
    experiments: ['v1-cap12-esp1', 'v1-cap12-esp2', 'v1-cap12-esp3', 'v1-cap12-esp4']
  },
  'v1-plastilina': {
    title: 'Circuiti con la plastilina',
    concept: 'La plastilina conduce! Crea circuiti artistici',
    volume: 1,
    chapter: 13,
    icon: '🎨',
    experiments: ['v1-cap13-esp1', 'v1-cap13-esp2']
  },
  'v1-robot': {
    title: 'Il Primo Robot ELAB',
    concept: 'Progetto finale: costruisci il tuo robot',
    volume: 1,
    chapter: 14,
    icon: '🤖',
    advancedProject: true,
    experiments: ['v1-cap14-esp1']
  },

  // ═══════════════════════════════════════
  // VOLUME 2 — Approfondiamo
  // ═══════════════════════════════════════

  'v2-resistenze': {
    title: 'Le resistenze in dettaglio',
    concept: 'Serie, parallelo e codice colori',
    volume: 2,
    chapter: 3,
    icon: '🔧',
    experiments: ['v2-cap3-esp1', 'v2-cap3-esp2', 'v2-cap3-esp3', 'v2-cap3-esp4']
  },
  'v2-led-avanzato': {
    title: 'LED avanzato',
    concept: 'Diodi, polarit\u00E0 e protezione',
    volume: 2,
    chapter: 4,
    icon: '💡',
    experiments: ['v2-cap4-esp1', 'v2-cap4-esp2', 'v2-cap4-esp3']
  },
  'v2-condensatore': {
    title: 'Il condensatore',
    concept: 'Accumula e rilascia energia',
    volume: 2,
    chapter: 5,
    icon: '⚡',
    experiments: ['v2-cap5-esp1', 'v2-cap5-esp2']
  },
  'v2-circuiti-rc': {
    title: 'Circuiti RC',
    concept: 'Resistore + Condensatore: carica e scarica',
    volume: 2,
    chapter: 6,
    icon: '📈',
    experiments: ['v2-cap6-esp1', 'v2-cap6-esp2', 'v2-cap6-esp3', 'v2-cap6-esp4']
  },
  'v2-condensatori-combo': {
    title: 'Condensatori in serie e parallelo',
    concept: 'Come si combinano le capacit\u00E0',
    volume: 2,
    chapter: 7,
    icon: '🔗',
    experiments: ['v2-cap7-esp1', 'v2-cap7-esp2', 'v2-cap7-esp3', 'v2-cap7-esp4']
  },
  'v2-transistor': {
    title: 'Il transistor MOSFET',
    concept: 'Un interruttore elettronico controllato dalla tensione',
    volume: 2,
    chapter: 8,
    icon: '🚪',
    experiments: ['v2-cap8-esp1', 'v2-cap8-esp2', 'v2-cap8-esp3']
  },
  'v2-fototransistor': {
    title: 'Il fototransistor',
    concept: 'Sensore di luce avanzato',
    volume: 2,
    chapter: 9,
    icon: '👁️',
    experiments: ['v2-cap9-esp1', 'v2-cap9-esp2']
  },
  'v2-motore': {
    title: 'Il motore DC',
    concept: 'Trasforma l\'elettricit\u00E0 in movimento',
    volume: 2,
    chapter: 10,
    icon: '⚙️',
    experiments: ['v2-cap10-esp1', 'v2-cap10-esp2', 'v2-cap10-esp3', 'v2-cap10-esp4']
  },
  'v2-robot-segui-luce': {
    title: 'Robot Segui Luce',
    concept: 'Progetto finale: robot che segue la luce',
    volume: 2,
    chapter: 12,
    icon: '🤖',
    advancedProject: true,
    experiments: ['v2-cap12-esp1']
  },

  // ═══════════════════════════════════════
  // VOLUME 3 — Arduino
  // ═══════════════════════════════════════

  'v3-primi-passi': {
    title: 'Primi passi con Arduino',
    concept: 'Scopri la scheda e il codice',
    volume: 3,
    chapter: 5,
    icon: '🔌',
    experiments: ['v3-cap5-esp1', 'v3-cap5-esp2']
  },
  'v3-led-digitale': {
    title: 'LED digitale con Arduino',
    concept: 'Accendi, spegni e fai lampeggiare con il codice',
    volume: 3,
    chapter: 6,
    icon: '💡',
    experiments: ['v3-cap6-esp1', 'v3-cap6-esp2', 'v3-cap6-esp3', 'v3-cap6-esp4', 'v3-cap6-esp5', 'v3-cap6-esp6', 'v3-cap6-esp7']
  },
  'v3-progetti-led': {
    title: 'Progetti LED: semaforo e Morse',
    concept: 'Sequenze e pattern con i LED',
    volume: 3,
// © Andrea Marro — 14/04/2026 — ELAB Tutor — Tutti i diritti riservati
    chapter: 6,
    icon: '🚦',
    experiments: ['v3-cap6-semaforo', 'v3-cap6-morse']
  },
  'v3-input-analogico': {
    title: 'Input analogico',
    concept: 'Leggi sensori e potenziometri con Arduino',
    volume: 3,
    chapter: 7,
    icon: '📊',
    experiments: ['v3-cap7-esp1', 'v3-cap7-esp2', 'v3-cap7-esp3', 'v3-cap7-esp4', 'v3-cap7-esp5', 'v3-cap7-esp6', 'v3-cap7-esp7', 'v3-cap7-esp8']
  },
  'v3-output-avanzato': {
    title: 'Output avanzato',
    concept: 'PWM, buzzer e comunicazione seriale',
    volume: 3,
    chapter: 8,
    icon: '🎵',
    experiments: ['v3-cap8-esp1', 'v3-cap8-esp2', 'v3-cap8-esp3', 'v3-cap8-esp4', 'v3-cap8-esp5']
  },
  'v3-progetti-extra': {
    title: 'Progetti Extra',
    concept: 'LCD, servo, Simon Says',
    volume: 3,
    chapter: 99,
    icon: '🌟',
    experiments: ['v3-extra-lcd-hello', 'v3-extra-servo-sweep', 'v3-extra-simon']
  }
};

/**
 * Trova la lezione a cui appartiene un esperimento
 * @param {string} experimentId
 * @returns {{ lessonId: string, lesson: object } | null}
 */
export function findLessonForExperiment(experimentId) {
  for (const [lessonId, lesson] of Object.entries(LESSON_GROUPS)) {
    if (lesson.experiments.includes(experimentId)) {
      return { lessonId, lesson };
    }
  }
  return null;
}

/**
 * Ritorna tutte le lezioni di un volume
 * @param {number} volumeNumber
 * @returns {Array<[string, object]>}
 */
export function getLessonsForVolume(volumeNumber) {
  return Object.entries(LESSON_GROUPS)
    .filter(([, l]) => l.volume === volumeNumber)
    .sort((a, b) => a[1].chapter - b[1].chapter);
}

/**
 * Ritorna il numero di lezioni totali
 */
export function getLessonCount() {
  return Object.keys(LESSON_GROUPS).length;
}

export default LESSON_GROUPS;
