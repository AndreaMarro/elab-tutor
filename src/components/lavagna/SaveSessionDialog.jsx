/**
 * SaveSessionDialog — Iter 36 SessionSave Atom SS2
 *
 * Modal dialog di conferma salvataggio sessione + preview riassunto AI.
 *
 * Workflow:
 *   1. onMount → chiama generateSessionSummary(sessionId, transcriptExcerpt)
 *      per popolare il campo "Riassunto" (loading state durante fetch).
 *   2. User edita (opzionale) titolo + descrizione + studenti + note docente.
 *   3. "Conferma e salva" → chiama onConfirm({title, description, students, notes})
 *      e dispatcha event 'elab-session-saved' globale per altri componenti.
 *   4. "Annulla" → chiama onCancel.
 *
 * PRINCIPIO ZERO §A13 plurale "Ragazzi":
 *   - "Salva la sessione di oggi?"
 *   - "Riassunto generato da UNLIM:"
 *   - "Confermate per salvare la lezione?"
 *
 * Palette ELAB:
 *   - Navy #1E4D8C (heading + buttons primari)
 *   - Lime #4A7A25 (accenti positivi + success)
 *   - Orange #E8941C (CTA secondario)
 *
 * Andrea Marro — 04/05/2026 — ELAB Tutor — Tutti i diritti riservati
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { generateSessionSummary } from '../../services/api';

const PALETTE = {
  navy: '#1E4D8C',
  lime: '#4A7A25',
  orange: '#E8941C',
  red: '#E54B3D',
  textMuted: '#5A6B7E',
  border: 'rgba(30, 77, 140, 0.15)',
  glass: 'rgba(255, 255, 255, 0.92)',
};

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 28, 50, 0.55)',
    backdropFilter: 'blur(4px)',
    zIndex: 9000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    fontFamily: "'Open Sans', system-ui, sans-serif",
  },
  dialog: {
    background: PALETTE.glass,
    borderRadius: 16,
    border: `1px solid ${PALETTE.border}`,
    boxShadow: '0 12px 40px rgba(15, 28, 50, 0.25)',
    maxWidth: 560,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '24px 26px',
  },
  heading: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 22,
    fontWeight: 700,
    color: PALETTE.navy,
    margin: '0 0 6px 0',
    letterSpacing: '0.01em',
  },
  subheading: {
    fontSize: 14,
    color: PALETTE.textMuted,
    margin: '0 0 18px 0',
    lineHeight: 1.45,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: PALETTE.navy,
    marginBottom: 5,
    fontFamily: "'Oswald', system-ui, sans-serif",
    letterSpacing: '0.03em',
  },
  input: {
    width: '100%',
    minHeight: 40,
    padding: '8px 12px',
    borderRadius: 8,
    border: `1px solid ${PALETTE.border}`,
    fontSize: 14,
    fontFamily: 'inherit',
    color: PALETTE.navy,
    background: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: 64,
    padding: '8px 12px',
    borderRadius: 8,
    border: `1px solid ${PALETTE.border}`,
    fontSize: 14,
    fontFamily: 'inherit',
    color: PALETTE.navy,
    background: '#FFFFFF',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  loadingHint: {
    fontSize: 12,
    color: PALETTE.lime,
    fontStyle: 'italic',
    marginTop: 4,
  },
  errorHint: {
    fontSize: 12,
    color: PALETTE.red,
    marginTop: 4,
  },
  regenerateBtn: {
    background: 'transparent',
    border: `1px solid ${PALETTE.lime}`,
    color: PALETTE.lime,
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 6,
    cursor: 'pointer',
    marginTop: 6,
    fontFamily: 'inherit',
  },
  actions: {
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  btnPrimary: {
    minHeight: 44,
    padding: '10px 22px',
    background: PALETTE.navy,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.02em',
  },
  btnPrimaryDisabled: {
    opacity: 0.6,
    cursor: 'wait',
  },
  btnSecondary: {
    minHeight: 44,
    padding: '10px 18px',
    background: 'transparent',
    color: PALETTE.textMuted,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

function defaultTitle(experimentName) {
  if (experimentName && typeof experimentName === 'string' && experimentName.trim()) {
    return experimentName.trim();
  }
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `Lezione del ${dd}/${mm}/${yyyy}`;
}

export default function SaveSessionDialog({
  open = false,
  sessionId = null,
  experimentName = '',
  transcriptExcerpt = '',
  onConfirm,
  onCancel,
}) {
  const [title, setTitle] = useState(() => defaultTitle(experimentName));
  const [description, setDescription] = useState('');
  const [students, setStudents] = useState('');
  const [notes, setNotes] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fetchedRef = useRef(false);
  const dialogRef = useRef(null);

  // Auto-prefill title when experimentName changes
  useEffect(() => {
    setTitle(defaultTitle(experimentName));
  }, [experimentName]);

  // On open: fetch AI summary if sessionId is a UUID
  const fetchSummary = useCallback(async () => {
    if (!sessionId || typeof sessionId !== 'string') return;
    const id = sessionId.trim();
    if (!/^[0-9a-f-]{8,}$/i.test(id)) return;
    setSummaryLoading(true);
    setSummaryError('');
    try {
      const result = await generateSessionSummary(id, transcriptExcerpt);
      if (result?.description) {
        setDescription(result.description);
      }
    } catch (err) {
      setSummaryError(err?.message === 'edge_function_not_configured'
        ? 'Riassunto AI non disponibile offline'
        : 'Riassunto AI non disponibile');
    } finally {
      setSummaryLoading(false);
    }
  }, [sessionId, transcriptExcerpt]);

  useEffect(() => {
    if (!open) {
      fetchedRef.current = false;
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchSummary();
  }, [open, fetchSummary]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) {
        onCancel?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, submitting, onCancel]);

  // Focus trap (basic): focus first input on open
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const el = dialogRef.current?.querySelector('input,textarea,button');
      el?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [open]);

  const handleConfirm = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim() || defaultTitle(experimentName),
        description: description.trim(),
        students: students.trim(),
        notes: notes.trim(),
      };
      // Notify globally for other listeners (analytics, etc.)
      try {
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('elab-session-saved', {
            detail: { sessionId, ...payload },
          }));
        }
      } catch { /* silent */ }

      await onConfirm?.(payload);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, title, experimentName, description, students, notes, sessionId, onConfirm]);

  if (!open) return null;

  return (
    <div
      style={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) onCancel?.(); }}
      role="presentation"
      data-testid="save-session-dialog-backdrop"
    >
      <div
        ref={dialogRef}
        style={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-session-dialog-heading"
        data-testid="save-session-dialog"
      >
        <h2 id="save-session-dialog-heading" style={styles.heading}>
          Salva la sessione di oggi?
        </h2>
        <p style={styles.subheading}>
          Ragazzi, questa lezione resterà nella cronologia per riprenderla quando volete.
          Confermate i dettagli qui sotto.
        </p>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="save-session-title">Titolo sessione</label>
          <input
            id="save-session-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            maxLength={120}
            data-testid="save-session-title-input"
            disabled={submitting}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="save-session-desc">
            Riassunto UNLIM
          </label>
          <textarea
            id="save-session-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            placeholder={summaryLoading ? 'UNLIM sta scrivendo il riassunto…' : 'Riassunto della lezione (max 200 caratteri)'}
            maxLength={200}
            rows={3}
            data-testid="save-session-desc-input"
            disabled={submitting || summaryLoading}
          />
          {summaryLoading && (
            <div style={styles.loadingHint} data-testid="save-session-summary-loading">
              UNLIM sta riepilogando la sessione…
            </div>
          )}
          {summaryError && !summaryLoading && (
            <div style={styles.errorHint} data-testid="save-session-summary-error">
              {summaryError}
            </div>
          )}
          {!summaryLoading && (
            <button
              type="button"
              onClick={fetchSummary}
              style={styles.regenerateBtn}
              disabled={submitting}
              data-testid="save-session-regenerate-btn"
              aria-label="Rigenera riassunto UNLIM"
            >
              Rigenera riassunto
            </button>
          )}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="save-session-students">
            Studenti presenti <span style={{ color: PALETTE.textMuted, fontWeight: 400 }}>(opzionale)</span>
          </label>
          <input
            id="save-session-students"
            type="text"
            value={students}
            onChange={(e) => setStudents(e.target.value)}
            style={styles.input}
            placeholder="Es: 3A — gruppo A"
            maxLength={120}
            data-testid="save-session-students-input"
            disabled={submitting}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="save-session-notes">
            Note docente <span style={{ color: PALETTE.textMuted, fontWeight: 400 }}>(opzionale)</span>
          </label>
          <textarea
            id="save-session-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={styles.textarea}
            placeholder="Cosa è andato bene, cosa riprendere la prossima volta…"
            maxLength={400}
            rows={2}
            data-testid="save-session-notes-input"
            disabled={submitting}
          />
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            style={styles.btnSecondary}
            disabled={submitting}
            data-testid="save-session-cancel-btn"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              ...styles.btnPrimary,
              ...(submitting ? styles.btnPrimaryDisabled : {}),
            }}
            disabled={submitting}
            data-testid="save-session-confirm-btn"
            aria-label="Confermate per salvare la sessione"
          >
            {submitting ? 'Salvo…' : 'Conferma e salva'}
          </button>
        </div>
      </div>
    </div>
  );
}
