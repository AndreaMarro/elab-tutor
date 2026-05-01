/**
 * SessionReportComic — Fumetto report end-of-class
 * Sprint S iter 13 atom F2 (fumetto-opus)
 *
 * Renders 6-vignette comic-style recap of session experiments.
 * Morfismo Sense 2: each vignette cites Vol.X pag.Y verbatim from src/data/volume-references.js.
 * Principio Zero V3: plurale "Ragazzi," in header + footer.
 * NO emoji icons (ElabIcons.jsx). Brand palette Navy/Lime/Orange/Red.
 *
 * (c) Andrea Marro — 2026-04-28
 */
import React, { useMemo, useCallback } from 'react';
import { buildPhotoUrl } from '../../data/experiment-photo-map';
import { getVolumeRef } from '../../data/volume-references';
import { ReportIcon, PrintIcon, BookIcon } from '../common/ElabIcons';
import styles from './SessionReportComic.module.css';

function formatSessionDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('it-IT');
  } catch {
    return '';
  }
}

const VIGNETTE_SLOTS = 6;
const NARRATION_FALLBACK_LEN = 140;

/**
 * Derive narration text for a vignette.
 * Priority: explicit narrations[exp.id] > volumeRef.bookText excerpt > null.
 */
function deriveNarration(narrations, exp, volRef) {
  if (!exp) return null;
  const explicit = narrations?.[exp.id];
  if (explicit && typeof explicit === 'string') return explicit;
  if (volRef?.bookText && typeof volRef.bookText === 'string') {
    const t = volRef.bookText.trim();
    return t.length > NARRATION_FALLBACK_LEN
      ? `${t.slice(0, NARRATION_FALLBACK_LEN).trim()}…`
      : t;
  }
  return null;
}

export default function SessionReportComic({ session, onExport }) {
  const vignettes = useMemo(() => {
    const completed = Array.isArray(session?.experimentsCompleted)
      ? session.experimentsCompleted
      : [];
    const slots = completed.slice(0, VIGNETTE_SLOTS);
    while (slots.length < VIGNETTE_SLOTS) slots.push(null);
    return slots;
  }, [session]);

  const narrations = session?.narrations ?? {};
  const sessionDate = formatSessionDate(session?.startedAt);
  const studentAlias = session?.studentAlias ?? '';

  const handleExport = useCallback(() => {
    if (typeof onExport === 'function') {
      onExport();
    } else if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
  }, [onExport]);

  return (
    <article
      className={styles.container}
      role="article"
      aria-label="Report fumetto della sessione"
    >
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <ReportIcon size={32} className={styles.titleIcon} aria-hidden="true" />
          <div className={styles.meta}>
            <h2 className={styles.title}>Ragazzi, ecco cosa abbiamo fatto oggi!</h2>
            <p className={styles.subtitle}>
              {studentAlias && (
                <span className={styles.alias}>Classe: {studentAlias}</span>
              )}
              {sessionDate && (
                <span className={styles.date}>
                  {studentAlias ? ' — ' : ''}
                  {sessionDate}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.exportBtn}
          onClick={handleExport}
          aria-label="Scarica PDF del report fumetto"
        >
          <PrintIcon size={20} aria-hidden="true" />
          <span>Scarica PDF</span>
        </button>
      </header>

      <div className={styles.grid}>
        {vignettes.map((exp, idx) => {
          const volRef = exp ? getVolumeRef(exp.id) : null;
          const narration = deriveNarration(narrations, exp, volRef);
          const narrationId = exp ? `narration-${exp.id}-${idx}` : `placeholder-${idx}`;
          const vignetteAriaLabel = exp
            ? `Vignetta ${idx + 1} — ${exp.title || exp.id}${
                volRef ? ` — Volume ${volRef.volume} pagina ${volRef.bookPage}` : ''
              }`
            : `Vignetta ${idx + 1} — ancora da svolgere`;
          return (
            <figure
              key={exp?.id ?? `slot-${idx}`}
              className={styles.vignette}
              aria-label={vignetteAriaLabel}
              aria-describedby={narration ? narrationId : undefined}
            >
              {exp ? (
                <>
                  {buildPhotoUrl(exp.id, exp.volume ?? volRef?.volume ?? 1) ? (
                    <img
                      src={buildPhotoUrl(exp.id, exp.volume ?? volRef?.volume ?? 1)}
                      alt={`Foto esperimento: ${exp.title || exp.id}`}
                      className={styles.photo}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.photoPlaceholder} aria-hidden="true">
                      <BookIcon size={28} className={styles.placeholderIcon} />
                      <span className={styles.placeholderText}>
                        {exp.title || 'Esperimento'}
                      </span>
                    </div>
                  )}
                  <figcaption className={styles.caption}>
                    <strong className={styles.captionTitle}>
                      {exp.title || exp.id}
                    </strong>
                    {volRef && (
                      <cite className={styles.volumeRef}>
                        Vol.{volRef.volume} pag.{volRef.bookPage}
                      </cite>
                    )}
                    {narration && (
                      <p
                        id={narrationId}
                        className={styles.narration}
                      >
                        {narration}
                      </p>
                    )}
                  </figcaption>
                </>
              ) : (
                <div className={styles.placeholder} aria-hidden="true">
                  <span>Prossimo esperimento</span>
                </div>
              )}
            </figure>
          );
        })}
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerText}>Grazie ragazzi! Alla prossima lezione!</p>
      </footer>
    </article>
  );
}
