/**
 * SaveSessionButton — Iter 36 SessionSave Atom SS1
 *
 * Bottone "Salva sessione" da inserire nell'AppHeader (sezione right) accanto
 * a Capitoli/Manuale/Video/Fumetto. Stati:
 *   - idle (default)
 *   - saving (mentre Edge Function genera summary + Supabase insert)
 *   - success (toast "Sessione salvata!" — auto-clear dopo 2.5s)
 *   - error (toast retry — auto-clear dopo 4s, click button per retry)
 *
 * onClick → apre SaveSessionDialog (gestito dal parent via `onOpenDialog`).
 *
 * PRINCIPIO ZERO §A13 plurale:
 *   - label visibile "Salva" (ridotto per LIM)
 *   - aria-label "Salva la sessione di oggi per i Ragazzi"
 *
 * Andrea Marro — 04/05/2026 — ELAB Tutor — Tutti i diritti riservati
 */

import React from 'react';
import css from './AppHeader.module.css';

export default function SaveSessionButton({
  onOpenDialog,
  status = 'idle', // 'idle' | 'saving' | 'success' | 'error'
  disabled = false,
}) {
  const isSaving = status === 'saving';
  const isError = status === 'error';
  const isSuccess = status === 'success';

  const ariaLabel = isSaving
    ? 'Salvataggio sessione in corso'
    : isError
      ? 'Riprova a salvare la sessione'
      : isSuccess
        ? 'Sessione salvata'
        : 'Salva la sessione di oggi per i Ragazzi';

  const title = isSaving
    ? 'Salvataggio…'
    : isError
      ? 'Errore — clicca per riprovare'
      : isSuccess
        ? 'Sessione salvata!'
        : 'Salva la sessione corrente';

  const handleClick = () => {
    if (disabled || isSaving) return;
    onOpenDialog?.();
  };

  return (
    <button
      type="button"
      className={`${css.btn} ${css.btnLabeled} ${isSaving ? css.btnActive : ''}`}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-busy={isSaving}
      title={title}
      disabled={disabled || isSaving}
      data-testid="save-session-button"
      data-status={status}
      style={{ minWidth: 44, minHeight: 44 }}
    >
      {isSaving ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          style={{ animation: 'elab-spin 800ms linear infinite' }}
        >
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="11 22" strokeLinecap="round" />
          <style>{`@keyframes elab-spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
      ) : isSuccess ? (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : isError ? (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        // Bookmark icon — represents "save"
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 3h10v14l-5-3-5 3V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}
      <span className={css.btnText}>
        {isSaving ? 'Salvo…' : isError ? 'Riprova' : isSuccess ? 'Salvata' : 'Salva'}
      </span>
    </button>
  );
}
