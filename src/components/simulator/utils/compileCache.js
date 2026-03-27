/**
 * HEX Compilation Cache — Andrea Marro — 15/02/2026
 * Cache locale per evitare ricompilazione codice identico
 *
 * Extracted from NewElabSimulator.jsx
 */
import logger from '../../../utils/logger';

const CACHE_KEY = 'elab_compile_cache_v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 ore

/**
 * Genera hash SHA256 semplificato del codice sorgente
 * @param {string} code — codice Arduino
 * @returns {Promise<string>} — hash esadecimale
 */
export async function hashCode(code) {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Recupera HEX dalla cache se esiste e non è scaduto
 * @param {string} hash — hash del codice
 * @returns {{hex: string, size: number}|null}
 */
export function getCachedHex(hash) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const entry = cache[hash];
    if (!entry) return null;

    // Verifica TTL (24 ore)
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      // Rimuovi entry scaduta
      delete cache[hash];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      return null;
    }

    return { hex: entry.hex, size: entry.size };
  } catch (e) {
    logger.warn('[ELAB Cache] Errore lettura cache:', e);
    return null;
  }
}

/**
 * Salva HEX nella cache
 * @param {string} hash — hash del codice
 * @param {string} hex — codice hex compilato
 * @param {number} size — dimensione in bytes
 */
export function setCachedHex(hash, hex, size) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[hash] = { hex, size, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    logger.warn('[ELAB Cache] Errore scrittura cache:', e);
  }
}
