/**
 * wakeWord-plurale-prepend.test.js — iter 31 ralph 4 Maker-1 TASK 1
 *
 * Verifies WAKE_PHRASES array contains 3 plurale "Ragazzi" variants shipped
 * iter 41 close (CLAUDE.md iter 36 PHASE 3 closure → wakeWord.js:27).
 *
 * Coverage:
 * - 5 positive cases (each plurale variant + each combined with command)
 * - 5 negative cases (false-trigger guards: "ragazzi" alone, partial, etc.)
 * - 2 case-insensitive cases
 *
 * NOTE: tests inspect WAKE_PHRASES indirectly via the recognition.onresult
 * pathway — wakeWord.js does not export the array.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  startWakeWordListener,
  stopWakeWordListener,
} from '../../../src/services/wakeWord.js';

vi.mock('../../../src/utils/logger', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

function createMockSpeechRecognition() {
  return class MockSpeechRecognition {
    constructor() {
      this.continuous = false;
      this.interimResults = false;
      this.lang = 'it-IT';
      this.maxAlternatives = 1;
      this.onresult = null;
      this.onerror = null;
      this.onend = null;
      global.__mockRecognition = this;
    }
    start() {}
    stop() {}
  };
}

function fireTranscript(transcript, isFinal = true) {
  const rec = global.__mockRecognition;
  rec.onresult({
    resultIndex: 0,
    results: [
      Object.assign(
        [{ transcript }],
        { isFinal }
      ),
    ],
  });
}

beforeEach(() => {
  window.SpeechRecognition = createMockSpeechRecognition();
  delete window.webkitSpeechRecognition;
  global.__mockRecognition = null;
});

afterEach(() => {
  stopWakeWordListener();
  delete window.SpeechRecognition;
  delete window.webkitSpeechRecognition;
  global.__mockRecognition = null;
  vi.restoreAllMocks();
});

describe('Wake word plurale "Ragazzi UNLIM" prepend (iter 41 ship verify)', () => {
  // POSITIVE 5
  it('triggers on "ragazzi unlim" alone', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('ragazzi unlim');
    expect(onWake).toHaveBeenCalledTimes(1);
  });

  it('triggers on "ragazzi un lim" (split variant)', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('ragazzi un lim');
    expect(onWake).toHaveBeenCalledTimes(1);
  });

  it('triggers on "ragazzi anelim" (mishearing variant)', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('ragazzi anelim');
    expect(onWake).toHaveBeenCalledTimes(1);
  });

  it('triggers + extracts command after "ragazzi unlim accendi led"', () => {
    const onWake = vi.fn();
    const onCommand = vi.fn();
    startWakeWordListener({ onWake, onCommand });
    fireTranscript('ragazzi unlim accendi led', true);
    expect(onWake).toHaveBeenCalledTimes(1);
    expect(onCommand).toHaveBeenCalledWith('accendi led');
  });

  it('triggers when "ragazzi unlim" appears mid-sentence', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('allora ragazzi unlim mostra il circuito');
    expect(onWake).toHaveBeenCalledTimes(1);
  });

  // NEGATIVE 5 (false-trigger guards)
  it('does NOT trigger on "ragazzi" alone (natural docente speech)', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('ragazzi vediamo il circuito');
    expect(onWake).not.toHaveBeenCalled();
  });

  it('does NOT trigger on "unlim" alone without ragazzi/ehi prefix', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('unlim');
    // "unlim" alone does NOT match any phrase; "ehi unlim" required
    // (verifies compound discipline avoids drive-by triggers)
    expect(onWake).not.toHaveBeenCalled();
  });

  it('does NOT trigger on "ragazzi vedete" (no unlim variant present)', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('ragazzi vedete questa');
    expect(onWake).not.toHaveBeenCalled();
  });

  it('does NOT trigger on "ragazzo unlim" (singolare violation guard)', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('ragazzo unlim');
    // singolare "ragazzo" not in WAKE_PHRASES — PRINCIPIO ZERO plurale enforce
    expect(onWake).not.toHaveBeenCalled();
  });

  it('does NOT trigger on "ragazzi un" (partial truncation)', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('ragazzi un');
    expect(onWake).not.toHaveBeenCalled();
  });

  // CASE-INSENSITIVE 2
  it('triggers on "RAGAZZI UNLIM" uppercase', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('RAGAZZI UNLIM');
    expect(onWake).toHaveBeenCalledTimes(1);
  });

  it('triggers on "Ragazzi Unlim" titlecase', () => {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    fireTranscript('Ragazzi Unlim');
    expect(onWake).toHaveBeenCalledTimes(1);
  });
});
