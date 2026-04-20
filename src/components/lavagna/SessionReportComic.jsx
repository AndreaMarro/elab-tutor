import React, { useMemo, useCallback } from 'react';
import { buildPhotoUrl } from '../../data/experiment-photo-map';
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
    <article className={styles.container} aria-label="Report fumetto della sessione">
      <header className={styles.header}>
        <div className={styles.meta}>
          <h2 className={styles.title}>Ragazzi, ecco cosa abbiamo fatto oggi!</h2>
          <p className={styles.subtitle}>
            {studentAlias && <span className={styles.alias}>Classe: {studentAlias}</span>}
            {sessionDate && <span className={styles.date}> — {sessionDate}</span>}
          </p>
        </div>
        <button
          type="button"
          className={styles.exportBtn}
          onClick={handleExport}
          aria-label="Scarica PDF del report fumetto"
        >
          Scarica PDF
        </button>
      </header>

      <div className={styles.grid}>
        {vignettes.map((exp, idx) => (
          <figure key={exp?.id ?? `slot-${idx}`} className={styles.vignette}>
            {exp ? (
              <>
                {buildPhotoUrl(exp.id, exp.volume ?? 1) ? (
                  <img
                    src={buildPhotoUrl(exp.id, exp.volume ?? 1)}
                    alt={`Foto esperimento: ${exp.title || exp.id}`}
                    className={styles.photo}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.photoPlaceholder} aria-hidden="true">
                    <span>{exp.title || 'Esperimento'}</span>
                  </div>
                )}
                <figcaption className={styles.caption}>
                  <strong className={styles.captionTitle}>{exp.title}</strong>
                  {narrations[exp.id] && (
                    <p className={styles.narration}>{narrations[exp.id]}</p>
                  )}
                </figcaption>
              </>
            ) : (
              <div className={styles.placeholder} aria-hidden="true">
                <span>Prossimo esperimento</span>
              </div>
            )}
          </figure>
        ))}
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerText}>Grazie ragazzi! Alla prossima lezione!</p>
      </footer>
    </article>
  );
}
