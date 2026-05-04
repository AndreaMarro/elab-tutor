/**
 * ELAB Wake Word — "Ehi UNLIM" detector via browser SpeechRecognition
 *
 * Ascolta continuamente in background. Quando rileva la frase "ehi unlim"
 * (o varianti come "hey unlim", "ei unlim"), chiama il callback onWake.
 * Dopo il wake, passa in modalità "command" per 5 secondi e inoltra
 * il testo catturato come comando a UNLIM.
 *
 * Costo: ZERO (usa l'API browser gratuita)
 * Supporto: Chrome, Edge (webkitSpeechRecognition)
 * NON supportato: Firefox, Safari
 *
 * © Andrea Marro — 14/04/2026
 */

import logger from '../utils/logger';

// Iter 41 Phase D Task D1 — "Ragazzi" plurale prepend wake word.
// PRINCIPIO ZERO §1 plurale "Ragazzi" mandate. Compound "ragazzi unlim" avoids
// false-trigger on natural docente speech mentioning "Ragazzi, vediamo..." alone.
//
// Iter 35 Phase 2 Maker-3 F4 — pronunciation varianti expansion.
// Andrea diagnostic mandate: "non posso parlare con unlim" → broader phrase coverage
// reduces failed-recognition rate when docente uses common voice-assistant patterns
// (es. "ok unlim", "hey unlim") or italiano informale single-word ("unlim").
// Compound "ok unlim" + "hey unlim" + "unlim" mantengono guard contro false-trigger
// (sostantivo non comune in italiano scuola pubblica → low natural-speech collision).
const WAKE_PHRASES = [
  // Legacy "Ehi UNLIM" family (iter 36+)
  'ehi unlim', 'hey unlim', 'ei unlim', 'ehi un lim',
  'hey un lim', 'ei un lim', 'e unlim', 'ehi anelim',
  'hey anelim', 'ehi online', 'hey online',
  // Iter 41 D1 — "Ragazzi UNLIM" plurale compound
  'ragazzi unlim', 'ragazzi un lim', 'ragazzi anelim',
  // Iter 35 Phase 2 F4 — pronunciation varianti (Andrea diagnostic mandate).
  // Keep compound 2-word discipline (avoid single-word "unlim" false-trigger
  // guard preserved per wakeWord-plurale-prepend.test.js negative case line 116).
  'ok unlim', 'okay unlim',
];

// Iter 41 Phase D Task D3 — reduced post-wake command window 5000→3000ms.
// Faster fallback when docente doesn't follow up wake phrase (better LIM UX).
const COMMAND_WINDOW_MS = 3000;

let recognition = null;
let isListening = false;
let commandMode = false;
let commandTimeout = null;
let onWakeCallback = null;
let onCommandCallback = null;

/**
 * Check if wake word detection is supported
 * @returns {boolean}
 */
export function isWakeWordSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Start listening for "Ehi UNLIM"
 * @param {Object} options
 * @param {function} options.onWake — called when wake word detected (no args)
 * @param {function} options.onCommand — called with command text after wake (string)
 * @param {string} [options.lang='it-IT'] — recognition language
 * @returns {boolean} true if started
 */
export function startWakeWordListener({ onWake, onCommand, lang = 'it-IT' } = {}) {
  if (!isWakeWordSupported()) {
    logger.warn('[WakeWord] SpeechRecognition not supported');
    return false;
  }

  if (isListening) {
    logger.debug('[WakeWord] Already listening');
    return true;
  }

  onWakeCallback = onWake;
  onCommandCallback = onCommand;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = lang;
  recognition.maxAlternatives = 3;

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];

      // Check all alternatives for wake word
      for (let j = 0; j < result.length; j++) {
        const transcript = result[j].transcript.toLowerCase().trim();

        if (!commandMode) {
          // Listening mode — check for wake word
          const isWake = WAKE_PHRASES.some(phrase => transcript.includes(phrase));
          if (isWake) {
            logger.info('[WakeWord] Wake detected:', transcript);
            commandMode = true;
            onWakeCallback?.();

            // Extract command after wake word (if any)
            let afterWake = transcript;
            for (const phrase of WAKE_PHRASES) {
              const idx = afterWake.indexOf(phrase);
              if (idx >= 0) {
                afterWake = afterWake.substring(idx + phrase.length).trim();
                break;
              }
            }
            if (afterWake.length > 2 && result.isFinal) {
              onCommandCallback?.(afterWake);
              commandMode = false;
              clearTimeout(commandTimeout);
            } else {
              // Wait for command in next 5s
              clearTimeout(commandTimeout);
              commandTimeout = setTimeout(() => {
                commandMode = false;
                logger.debug('[WakeWord] Command window expired');
              }, COMMAND_WINDOW_MS);
            }
            return;
          }
        } else {
          // Command mode — forward speech as command
          if (result.isFinal && transcript.length > 2) {
            logger.info('[WakeWord] Command:', transcript);
            onCommandCallback?.(transcript);
            commandMode = false;
            clearTimeout(commandTimeout);
            return;
          }
        }
      }
    }
  };

  // Terminal errors: mic permission denied by user or by browser policy.
  // Retrying cannot recover from these without user action, so we stop listening
  // and log ONCE to avoid the log-flood observed in production (~180 warnings
  // per 30 s). Non-terminal errors follow the original back-off path.
  const TERMINAL_ERRORS = new Set(['not-allowed', 'service-not-allowed']);
  let terminalErrorLogged = false;

  recognition.onerror = (event) => {
    if (event.error === 'no-speech' || event.error === 'aborted') return;
    if (TERMINAL_ERRORS.has(event.error)) {
      if (!terminalErrorLogged) {
        logger.warn('[WakeWord] Permission denied:', event.error, '— disabling wake word until next page load');
        terminalErrorLogged = true;
        // iter 35 fix Bug 8: surface UI event so docente sees feedback (era silent — Andrea reported "non funziona").
        // LavagnaShell + similar listeners ascoltano `elab-wake-word-error` per toast/banner.
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('elab-wake-word-error', {
              // iter 36 Atom A9 honesty caveat fix: prepend "Ragazzi, " plurale (PRINCIPIO ZERO V3 mandate).
              detail: { code: event.error, message: 'Ragazzi, microfono non autorizzato. Abilitate il permesso microfono nelle impostazioni del browser per usare "Ehi UNLIM".' },
            }));
          }
        } catch (_) { /* ignore */ }
      }
      isListening = false;
      return;
    }
    logger.warn('[WakeWord] Error:', event.error);
    // Auto-restart on non-fatal errors
    if (event.error === 'network' || event.error === 'audio-capture') {
      setTimeout(() => {
        if (isListening) {
          try { recognition.start(); } catch { /* already started */ }
        }
      }, 1000);
    }
  };

  recognition.onend = () => {
    // Auto-restart — continuous listening. If a terminal error flipped
    // `isListening` to false, the restart is skipped and the loop exits.
    if (isListening) {
      try { recognition.start(); } catch { /* already started */ }
    }
  };

  try {
    recognition.start();
    isListening = true;
    logger.info('[WakeWord] Listening for "Ehi UNLIM"...');
    return true;
  } catch (err) {
    logger.error('[WakeWord] Start failed:', err.message);
    return false;
  }
}

/**
 * Stop listening
 */
export function stopWakeWordListener() {
  isListening = false;
  commandMode = false;
  clearTimeout(commandTimeout);
  if (recognition) {
    try { recognition.stop(); } catch { /* */ }
    recognition = null;
  }
  logger.info('[WakeWord] Stopped');
}

/**
 * Check if currently listening
 * @returns {boolean}
 */
export function isWakeWordListening() {
  return isListening;
}
