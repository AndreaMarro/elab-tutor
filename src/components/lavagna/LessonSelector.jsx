import React from 'react';
import { getLessonsForVolume } from '../../data/lesson-groups';
import styles from './LessonSelector.module.css';

export default function LessonSelector({ volumeNumber, activeLessonId, onLessonSelect }) {
  const lessons = getLessonsForVolume(volumeNumber);

  return (
    <nav className={styles.container} aria-label="Scegli lezione">
      <ul className={styles.list}>
        {lessons.map(([lessonId, lesson]) => {
          const isActive = lessonId === activeLessonId;
          return (
            <li
              key={lessonId}
              data-testid={`lesson-option-${lessonId}`}
              className={`${styles.item} ${isActive ? styles.selected : ''}`}
              onClick={() => onLessonSelect?.(lessonId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onLessonSelect?.(lessonId);
              }}
            >
              <span className={styles.chapter}>Cap. {lesson.chapter}</span>
              <span className={styles.title}>{lesson.title}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
