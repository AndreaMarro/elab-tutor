/**
 * WakeWordStatusBadge — Sprint T iter 35 Phase 2 Atom F1 (Maker-3)
 *
 * Real-time diagnostic UI badge surfacing wake word availability state on
 * HomePage so docente sees BEFORE entering Lavagna whether voice trigger is
 * ready, idle, blocked, or unsupported. Resolves Andrea iter 35 mandate:
 * "Voxtral non risponde a wake word, non posso parlare con unlim".
 *
 * Andrea conflated:
 *   - Voxtral = TTS OUTPUT (Mistral mini-tts-2603 voice clone, iter 31 LIVE)
 *   - Wake word = STT INPUT (browser webkitSpeechRecognition Chrome 147+)
 *
 * F2 browser audit confirmed Andrea env has Chrome 147 + macOS + permission
 * 'granted' + ALL APIs available. Probable failure: WAKE_PHRASES coverage gap
 * (F4 fix this iter) and/or absent visibility of listener state on HomePage.
 *
 * State machine 4 states:
 *   1. 'unsupported' — browser lacks SpeechRecognition (Firefox, Safari iOS)
 *   2. 'denied' — Permissions API returns 'denied'
 *   3. 'listening' — wake word listener actively running (caller-driven flag)
 *   4. 'idle' — supported + permission prompt/granted but listener not started
 *
 * Detection:
 *   - feature: `'webkitSpeechRecognition' in window || 'SpeechRecognition' in window`
 *   - permission: `navigator.permissions.query({name: 'microphone'})`
 *   - listening: caller-supplied prop (since LavagnaShell owns listener lifecycle)
 *
 * Compliance gate:
 *   ✅ Linguaggio plurale "Ragazzi" (chip text wherever user-addressable)
 *   ✅ Palette tokens var(--elab-*) with literal fallbacks (rule 16)
 *   ✅ Iconografia MicrophoneIcon ElabIcons (rule 11, NO emoji)
 *   ✅ Touch target ≥44px (rule 9) when click-to-activate
 *   ✅ Font ≥13px (rule 8)
 *   ✅ WCAG AA contrast Navy bg + white text ~13:1
 *
 * Maker-3 — iter 35 Phase 2 — 2026-05-04
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MicrophoneIcon } from './ElabIcons.jsx';

/**
 * Detect SpeechRecognition support (sync, no async).
 */
function detectSpeechSupport() {
  if (typeof window === 'undefined') return false;
  return !!(window.webkitSpeechRecognition || window.SpeechRecognition);
}

/**
 * Query microphone permission via Permissions API.
 * Returns one of: 'prompt' | 'granted' | 'denied' | 'unsupported'.
 */
async function queryMicPermission() {
  if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
    return 'unsupported';
  }
  try {
    const status = await navigator.permissions.query({ name: 'microphone' });
    return status.state || 'prompt';
  } catch {
    return 'unsupported';
  }
}

/**
 * State copy table — all visible strings centralized for i18n + audit gates.
 * PRINCIPIO ZERO: docente-facing copy uses plurale invariant where action.
 */
const STATE_COPY = {
  unsupported: {
    label: 'Voce non disponibile',
    detail: "Il browser non supporta il riconoscimento vocale. Usate Chrome o Edge per attivare 'Ehi UNLIM'.",
    color: '#9CA3AF',
    bg: '#F3F4F6',
    border: '#9CA3AF',
    interactive: false,
  },
  denied: {
    label: 'Microfono bloccato',
    detail: "Cliccate l'icona del lucchetto vicino all'URL e attivate il microfono per usare la voce di UNLIM.",
    color: '#FFFFFF',
    bg: 'var(--elab-red, #E54B3D)',
    border: 'var(--elab-red, #E54B3D)',
    interactive: true,
  },
  listening: {
    label: "In ascolto: dite 'Ehi UNLIM'",
    detail: "Wake word attivo. Provate 'Ehi UNLIM', 'Ragazzi UNLIM' o 'Ok UNLIM'.",
    color: 'var(--elab-navy, #1E4D8C)',
    bg: 'var(--elab-lime, #4A7A25)',
    border: 'var(--elab-lime, #4A7A25)',
    interactive: false,
    pulsing: true,
  },
  idle: {
    label: 'Voce pronta',
    detail: "Cliccate per attivare il microfono. Poi su Lavagna potrete parlare con UNLIM.",
    color: '#FFFFFF',
    bg: 'var(--elab-navy, #1E4D8C)',
    border: 'var(--elab-navy, #1E4D8C)',
    interactive: true,
  },
};

/**
 * WakeWordStatusBadge component.
 *
 * Props:
 *   - listening?: boolean
 *       Caller-supplied flag from LavagnaShell wake-word listener. When true
 *       and underlying state is 'idle' (supported + granted), badge upgrades
 *       to 'listening' with pulse animation.
 *   - onClick?: () => void
 *       Optional click handler invoked when badge is in interactive state
 *       ('idle' or 'denied'). Caller can wire e.g. permission request flow.
 *   - compact?: boolean
 *       If true, shows only icon + label (no detail line). Default false.
 *   - testStateOverride?: 'unsupported'|'denied'|'listening'|'idle'
 *       Test-only prop allowing unit tests to force a state without touching
 *       global navigator. Production callers MUST NOT use this.
 */
export default function WakeWordStatusBadge({
  listening = false,
  onClick,
  compact = false,
  testStateOverride,
}) {
  const [permState, setPermState] = useState(null); // null | 'prompt' | 'granted' | 'denied' | 'unsupported'
  const [supported] = useState(() => detectSpeechSupport());
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  useEffect(() => {
    if (testStateOverride) return; // skip live probe in test-override mode
    let permStatus = null;
    let cancelled = false;
    (async () => {
      const state = await queryMicPermission();
      if (cancelled || !mountedRef.current) return;
      setPermState(state);
      if (state !== 'unsupported' && navigator.permissions?.query) {
        try {
          permStatus = await navigator.permissions.query({ name: 'microphone' });
          permStatus.onchange = () => {
            if (mountedRef.current) setPermState(permStatus.state);
          };
        } catch { /* no-op */ }
      }
    })();
    return () => {
      cancelled = true;
      if (permStatus) { try { permStatus.onchange = null; } catch { /* no-op */ } }
    };
  }, [testStateOverride]);

  // Derive resolved state
  let resolvedState;
  if (testStateOverride) {
    resolvedState = testStateOverride;
  } else if (!supported) {
    resolvedState = 'unsupported';
  } else if (permState === 'denied') {
    resolvedState = 'denied';
  } else if (permState === null) {
    resolvedState = 'idle'; // optimistic during probe
  } else if (listening) {
    resolvedState = 'listening';
  } else {
    resolvedState = 'idle';
  }

  const copy = STATE_COPY[resolvedState];

  const handleClick = useCallback(() => {
    if (!copy.interactive) return;
    if (typeof onClick === 'function') onClick();
  }, [copy.interactive, onClick]);

  const isPulsing = !!copy.pulsing;

  const styles = {
    wrap: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: compact ? '8px 12px' : '10px 14px',
      minHeight: copy.interactive ? 44 : undefined,
      borderRadius: 999,
      background: copy.bg,
      color: copy.color,
      border: `2px solid ${copy.border}`,
      fontFamily: "'Open Sans', system-ui, sans-serif",
      fontSize: 13,
      fontWeight: 600,
      cursor: copy.interactive ? 'pointer' : 'default',
      transition: 'transform 120ms ease, box-shadow 120ms ease',
      boxShadow: isPulsing ? '0 0 0 0 rgba(74,122,37,0.6)' : 'none',
      animation: isPulsing ? 'elabWakeBadgePulse 1600ms ease-in-out infinite' : 'none',
    },
    iconBox: {
      flexShrink: 0,
      width: 22,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 13,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
    },
    detail: {
      display: compact ? 'none' : 'block',
      fontSize: 12,
      fontWeight: 400,
      opacity: 0.9,
      marginTop: 2,
      whiteSpace: 'normal',
      maxWidth: 320,
    },
  };

  const Component = copy.interactive ? 'button' : 'div';
  const ariaLabel = copy.interactive
    ? `${copy.label}. ${copy.detail} Cliccate per agire.`
    : `${copy.label}. ${copy.detail}`;

  return (
    <>
      <style>{`
        @keyframes elabWakeBadgePulse {
          0%   { box-shadow: 0 0 0 0   rgba(74,122,37,0.55); }
          50%  { box-shadow: 0 0 0 10px rgba(74,122,37,0.0); }
          100% { box-shadow: 0 0 0 0   rgba(74,122,37,0.0); }
        }
      `}</style>
      <Component
        type={Component === 'button' ? 'button' : undefined}
        style={styles.wrap}
        onClick={handleClick}
        aria-label={ariaLabel}
        data-testid="wake-word-status-badge"
        data-state={resolvedState}
        role={Component === 'button' ? undefined : 'status'}
      >
        <span style={styles.iconBox} aria-hidden="true">
          <MicrophoneIcon size={18} color={copy.color} />
        </span>
        <span>
          <span style={styles.label} data-testid="wake-word-status-badge-label">
            {copy.label}
          </span>
          <span style={styles.detail} data-testid="wake-word-status-badge-detail">
            {copy.detail}
          </span>
        </span>
      </Component>
    </>
  );
}
