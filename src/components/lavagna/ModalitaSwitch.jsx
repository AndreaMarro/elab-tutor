/**
 * ModalitaSwitch — 4 modes canonical UI per ADR-025 Sprint T iter 22+ (PROPOSED)
 *
 * Modes (Italian K-12 plurale "Ragazzi" Principio Zero V3):
 *   • percorso     → 📖 Percorso (default narrative reading) ⭐
 *   • passo-passo  → 👣 Passo Passo (build sequenziale variazione interno capitolo)
 *   • gia-montato  → 🧩 Già Montato (pre-assembled diagnose mode, NEW iter 26)
 *   • libero       → 🎨 Libero (auto-Percorso, NON sandbox vuoto)
 *
 * Mode "guida-da-errore" REMOVED iter 26 (ADR-025 §4.5) — diagnose flow integrato
 * dentro Già Montato + Passo Passo inline.
 *
 * Touch target ≥44px (CLAUDE.md §Qualita rule 9). Active state Navy #1E4D8C palette.
 *
 * Andrea Marro — iter 26 gen-app caveman 2026-04-29
 */
import React from 'react';
import css from './ModalitaSwitch.module.css';

export const MODALITA = ['percorso', 'passo-passo', 'gia-montato', 'libero'];

const MODE_META = {
  'percorso': {
    icon: '📖',
    label: 'Percorso',
    tooltip: 'Ragazzi, leggiamo il libro insieme — modalità lettura narrativa.',
    isDefault: true,
  },
  'passo-passo': {
    icon: '👣',
    label: 'Passo Passo',
    tooltip: 'Ragazzi, montiamo il circuito un componente alla volta.',
    isDefault: false,
  },
  'gia-montato': {
    icon: '🧩',
    label: 'Già Montato',
    tooltip: 'Ragazzi, guardate il circuito già pronto — sapete spiegarlo?',
    isDefault: false,
  },
  'libero': {
    icon: '🎨',
    label: 'Libero',
    tooltip: 'Ragazzi, esploriamo liberamente — UNLIM ci suggerisce variazioni.',
    isDefault: false,
  },
};

export default function ModalitaSwitch({ activeMode = 'percorso', onModeChange }) {
  const handleClick = (mode) => {
    if (typeof onModeChange === 'function') {
      onModeChange(mode);
    }
  };

  return (
    <div
      className={css.modalitaSwitch}
      role="tablist"
      aria-label="Modalità lavagna"
      data-testid="modalita-switch"
    >
      {MODALITA.map((mode) => {
        const meta = MODE_META[mode];
        const active = activeMode === mode;
        return (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={meta.tooltip}
            title={meta.tooltip}
            data-testid={`modalita-btn-${mode}`}
            data-active={active ? 'true' : 'false'}
            className={`${css.modeBtn} ${active ? css.modeBtnActive : ''}`}
            onClick={() => handleClick(mode)}
          >
            <span className={css.modeIcon} aria-hidden="true">{meta.icon}</span>
            <span className={css.modeLabel}>{meta.label}</span>
            {meta.isDefault && <span className={css.defaultStar} aria-hidden="true">⭐</span>}
          </button>
        );
      })}
    </div>
  );
}
