import React from 'react';
import LESSON_GROUPS from '../../data/lesson-groups';
import VOLUME_REFERENCES from '../../data/volume-references';
import styles from './LessonReader.module.css';

export default function LessonReader({ lessonId, currentExperimentId, onExperimentSelect }) {
  if (!lessonId) return null;

  const lesson = LESSON_GROUPS[lessonId];
  if (!lesson) return null;

  const { title, volume, chapter, experiments } = lesson;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.meta}>
          Vol. {volume} — Capitolo {chapter}
        </p>
      </header>

      <ol className={styles.timeline}>
        {experiments.map((expId, idx) => {
          const ref = VOLUME_REFERENCES[expId];
          const isActive = expId === currentExperimentId;
          const showPreview = idx === 0 || isActive;

          return (
            <li
              key={expId}
              data-testid={`lesson-step-${expId}`}
              className={`${styles.step} ${isActive ? styles.active : ''}`}
              onClick={() => onExperimentSelect?.(expId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onExperimentSelect?.(expId);
              }}
            >
              <span className={styles.expId}>{expId}</span>
              {ref && (
                <>
                  <span className={styles.page}>pag. {ref.bookPage}</span>
                  {showPreview && ref.bookText && (
                    <p className={styles.preview}>{ref.bookText}</p>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
