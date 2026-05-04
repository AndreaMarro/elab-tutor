/**
 * wakeWord.test.js — iter 36 Atom A9 Bug 8
 * Tests the onerror → CustomEvent dispatch path in src/services/wakeWord.js.
 *
 * Atom A9 spec (PDR §3): Wake word "Ehi UNLIM" Bug 8 — toast permission denied
 * appare quando microfono non autorizzato.
 *
 * Honesty caveat: the current impl message is
 *   'Microfono non autorizzato. Abilita il permesso microfono...'
 * It does NOT contain "Ragazzi" (PRINCIPIO ZERO plurale). Test 2 uses
 * toContain('icrofono non autorizzato') only. The "Ragazzi" assertion is
 * flagged as gap → Maker-1 iter 37 fix (add "Ragazzi," prefix to the message).
 *
 * Pattern: mock window.SpeechRecognition, capture instance via global.__mockRecognition,
 * call startWakeWordListener, trigger onerror, verify dispatchEvent.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  startWakeWordListener,
  stopWakeWordListener,
} from '../../../src/services/wakeWord.js';

// Mock logger to silence output
vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

/**
 * MockSpeechRecognition — captures the instance for onerror triggering.
 * Sets global.__mockRecognition to the created instance.
 */
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
      // Expose instance globally so tests can trigger onerror
      global.__mockRecognition = this;
    }
    start() {}
    stop() {}
  };
}

beforeEach(() => {
  // Install fresh mock SpeechRecognition before each test
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

describe('Wake word permission denied iter 36 Atom A9 Bug 8', () => {
  it('dispatches elab-wake-word-error custom event when recognition.onerror fires not-allowed', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    startWakeWordListener({ onWake: vi.fn(), onCommand: vi.fn() });

    // global.__mockRecognition is set by the mock constructor
    const mockRecognition = global.__mockRecognition;
    expect(mockRecognition).toBeTruthy();

    mockRecognition.onerror({ error: 'not-allowed' });

    const errorDispatches = dispatchSpy.mock.calls.filter(
      call => call[0]?.type === 'elab-wake-word-error'
    );
    expect(errorDispatches.length).toBe(1);
    expect(errorDispatches[0][0]).toMatchObject(
      expect.objectContaining({
        type: 'elab-wake-word-error',
      })
    );
    expect(errorDispatches[0][0].detail).toMatchObject(
      expect.objectContaining({
        message: expect.stringContaining('icrofono non autorizzato'),
      })
    );
  });

  it('CustomEvent detail.message contains italian "Microfono non autorizzato"', () => {
    // NOTE: impl does NOT currently contain "Ragazzi" (PRINCIPIO ZERO plurale gap).
    // Maker-1 iter 37 fix: add "Ragazzi," prefix to the message in wakeWord.js.
    // This test verifies the Italian permission message is present in the event.
    let capturedEvent = null;
    window.addEventListener('elab-wake-word-error', (e) => {
      capturedEvent = e;
    }, { once: true });

    startWakeWordListener({ onWake: vi.fn(), onCommand: vi.fn() });

    const mockRecognition = global.__mockRecognition;
    expect(mockRecognition).toBeTruthy();
    mockRecognition.onerror({ error: 'not-allowed' });

    expect(capturedEvent).toBeTruthy();
    expect(capturedEvent.detail.message).toContain('icrofono non autorizzato');
    // iter 36 Phase 3 Atom A9 closure: PRINCIPIO ZERO plurale "Ragazzi" prepend landed in wakeWord.js:141.
    expect(capturedEvent.detail.message).toContain('Ragazzi');
  });

  it('does NOT dispatch error event for benign error codes (no-speech)', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    startWakeWordListener({ onWake: vi.fn(), onCommand: vi.fn() });

    const mockRecognition = global.__mockRecognition;
    expect(mockRecognition).toBeTruthy();

    mockRecognition.onerror({ error: 'no-speech' });

    const errorDispatches = dispatchSpy.mock.calls.filter(
      call => call[0]?.type === 'elab-wake-word-error'
    );
    expect(errorDispatches.length).toBe(0);
  });
});

/**
 * Iter 35 Phase 2 F4 — WAKE_PHRASES pronunciation varianti detection.
 * Andrea diagnostic mandate: "non posso parlare con unlim" → broader coverage.
 * Verify each new variant triggers onWake when received in transcript.
 */
describe('Wake word F4 pronunciation varianti detection (iter 35 Phase 2)', () => {
  /**
   * Helper: simulate a SpeechRecognition result event with a single transcript
   * and verify onWake is invoked.
   */
  function simulateTranscript(transcript) {
    const onWake = vi.fn();
    startWakeWordListener({ onWake, onCommand: vi.fn() });
    const mockRecognition = global.__mockRecognition;
    expect(mockRecognition).toBeTruthy();

    // Build a SpeechRecognitionEvent-shape with a result whose alternative
    // transcript matches the phrase under test.
    const event = {
      resultIndex: 0,
      results: [
        Object.assign(
          [{ transcript, confidence: 0.95 }],
          { isFinal: true, length: 1 },
        ),
      ],
    };
    mockRecognition.onresult(event);
    return onWake;
  }

  it('detects "ok unlim" variant (common voice assistant pattern)', () => {
    const onWake = simulateTranscript('ok unlim accendete il LED');
    expect(onWake).toHaveBeenCalled();
  });

  it('detects "okay unlim" English-spelled variant', () => {
    const onWake = simulateTranscript('okay unlim');
    expect(onWake).toHaveBeenCalled();
  });

  it('does NOT trigger on single-word "unlim" (compound discipline preserved)', () => {
    // F4 deliberately keeps 2-word compound guard to avoid false-trigger on
    // unrelated speech mentioning "unlim" alone (low collision risk in IT
    // scuola pubblica, but compound discipline is safer for production audio
    // streams where misrecognized words may include "unlim" fragments).
    const onWake = simulateTranscript('unlim');
    expect(onWake).not.toHaveBeenCalled();
  });

  it('detects legacy "ehi unlim" baseline preserved', () => {
    const onWake = simulateTranscript('ehi unlim ascoltate');
    expect(onWake).toHaveBeenCalled();
  });

  it('detects "ragazzi unlim" PRINCIPIO ZERO plurale baseline preserved', () => {
    const onWake = simulateTranscript('ragazzi unlim guardate qui');
    expect(onWake).toHaveBeenCalled();
  });

  it('does NOT trigger onWake for unrelated phrase ("ciao ragazzi")', () => {
    const onWake = simulateTranscript('ciao ragazzi vediamo l esperimento');
    expect(onWake).not.toHaveBeenCalled();
  });
});
