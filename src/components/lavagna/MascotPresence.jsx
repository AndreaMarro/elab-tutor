/**
 * MascotPresence — Mascotte ELAB visibile sulla lavagna
 * Il robottino appare nell'angolo, si anima quando UNLIM parla,
 * e invita il docente a interagire.
 * (c) Andrea Marro — 02/04/2026
 */
import React, { useState, useEffect } from 'react';
import css from './MascotPresence.module.css';

export default function MascotPresence({ speaking = false, onClick, mascotSrc }) {
  const [idle, setIdle] = useState(false);

  // Idle animation after 30s of no interaction
  useEffect(() => {
    const timer = setTimeout(() => setIdle(true), 30000);
    const reset = () => { setIdle(false); clearTimeout(timer); };
    window.addEventListener('pointerdown', reset, { once: true });
    return () => { clearTimeout(timer); window.removeEventListener('pointerdown', reset); };
  }, [idle]);

  return (
    <button
      className={`${css.mascot} ${speaking ? css.speaking : ''} ${idle ? css.idle : ''}`}
      onClick={onClick}
      aria-label="Parla con UNLIM"
      title="Clicca per chiedere aiuto a UNLIM"
    >
      {mascotSrc ? (
        <img src={mascotSrc} alt="UNLIM mascotte" className={css.img} />
      ) : (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className={css.svg} aria-hidden="true">
          {/* Robot head */}
          <rect x="8" y="12" width="28" height="22" rx="6" fill="#1E4D8C" />
          {/* Eyes */}
          <circle cx="16" cy="22" r="3" fill="#4A7A25" />
          <circle cx="28" cy="22" r="3" fill="#4A7A25" />
          {/* Eye highlights */}
          <circle cx="17" cy="21" r="1" fill="#fff" opacity="0.8" />
          <circle cx="29" cy="21" r="1" fill="#fff" opacity="0.8" />
          {/* Smile */}
          <path d="M15 28c0 0 3 3 7 3s7-3 7-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          {/* Antenna */}
          <path d="M22 12V7" stroke="#E8941C" strokeWidth="2" strokeLinecap="round" />
          <circle cx="22" cy="5" r="2.5" fill="#E8941C" />
          {/* Ears / headphones */}
          <rect x="4" y="18" width="6" height="10" rx="3" fill="#4A7A25" />
          <rect x="34" y="18" width="6" height="10" rx="3" fill="#4A7A25" />
        </svg>
      )}
      {/* Speaking indicator */}
      {speaking && (
        <div className={css.speechBubble} aria-hidden="true">
          <span className={css.dot} />
          <span className={css.dot} />
          <span className={css.dot} />
        </div>
      )}
    </button>
  );
}
