/**
 * UNLIM Response Cleaner — tronca risposte lunghe e rimuove hallucination.
 * Target: <60 parole per risposte kid-friendly (regola UNLIM).
 * © Andrea Marro — 31/03/2026
 */

/**
 * Pulisce e tronca un testo di risposta UNLIM.
 * @param {string} text — testo grezzo della risposta
 * @param {number} maxWords — massimo numero di parole (default 60)
 * @returns {string} testo pulito e troncato
 */
export function cleanAndTruncate(text, maxWords = 60) {
  if (!text) return '';

  // Rimuovi hallucination "Ho analizzato l'immagine che hai inviato"
  let cleaned = text.replace(/Ho analizzato l['']immagine che hai inviato\.?\s*/gi, '');

  // Estrai i tag [AZIONE:...] prima di troncare (non contano nel limite)
  const actionTags = [];
  cleaned = cleaned.replace(/\[AZIONE:[^\]]+\]/g, (match) => {
    actionTags.push(match);
    return '';
  });

  // Tronca a maxWords parole (solo testo, non azioni)
  const words = cleaned.trim().split(/\s+/).filter(w => w.length > 0);
  const truncated = words.length <= maxWords
    ? words.join(' ')
    : words.slice(0, maxWords).join(' ') + '...';

  // Riattacca i tag azione
  return actionTags.length > 0
    ? truncated + ' ' + actionTags.join(' ')
    : truncated;
}
