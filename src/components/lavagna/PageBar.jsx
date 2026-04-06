/**
 * PageBar — Page navigation bar for ELAB Lavagna
 * Shows page thumbnails, prev/next/add buttons.
 * Responsive: compact on LIM/iPad, full on PC.
 *
 * (c) Andrea Marro — 05/04/2026
 */

import React, { useCallback } from 'react';
import css from './PageBar.module.css';

// Inline SVG icons (no emoji per CLAUDE.md rule)
const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="10 2 4 8 10 14" />
  </svg>
);
const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 2 12 8 6 14" />
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="2" x2="8" y2="14" />
    <line x1="2" y1="8" x2="14" y2="8" />
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 3 14 13 14 13 6" />
    <line x1="1" y1="6" x2="15" y2="6" />
    <line x1="6" y1="3" x2="10" y2="3" />
    <line x1="6" y1="9" x2="6" y2="12" />
    <line x1="10" y1="9" x2="10" y2="12" />
  </svg>
);

export default function PageBar({
  pages = [],
  currentPageIndex = 0,
  totalPages = 1,
  canGoNext = false,
  canGoPrev = false,
  canAddPage = true,
  onGoNext,
  onGoPrev,
  onGoToPage,
  onAddPage,
  onDeletePage,
}) {
  const handleDelete = useCallback((e, index) => {
    e.stopPropagation();
    if (totalPages <= 1) return;
    onDeletePage?.(index);
  }, [totalPages, onDeletePage]);

  return (
    <div className={css.bar} role="navigation" aria-label="Navigazione pagine lavagna">
      {/* Prev button */}
      <button
        className={css.navBtn}
        onClick={onGoPrev}
        disabled={!canGoPrev}
        aria-label="Pagina precedente"
        title="Pagina precedente"
      >
        <IconChevronLeft />
      </button>

      {/* Page tabs */}
      <div className={css.pages} role="tablist" aria-label="Pagine">
        {pages.map((page, i) => (
          <button
            key={page.id}
            role="tab"
            aria-selected={i === currentPageIndex}
            className={`${css.pageTab} ${i === currentPageIndex ? css.active : ''}`}
            onClick={() => onGoToPage?.(i)}
            title={page.label}
          >
            <span className={css.pageNum}>{i + 1}</span>
            {page.paths?.length > 0 && <span className={css.dot} aria-label="con contenuto" />}
            {totalPages > 1 && i === currentPageIndex && (
              <button
                className={css.deleteBtn}
                onClick={(e) => handleDelete(e, i)}
                aria-label={`Elimina ${page.label}`}
                title="Elimina pagina"
              >
                <IconTrash />
              </button>
            )}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        className={css.navBtn}
        onClick={onGoNext}
        disabled={!canGoNext}
        aria-label="Pagina successiva"
        title="Pagina successiva"
      >
        <IconChevronRight />
      </button>

      {/* Add page button */}
      <button
        className={css.addBtn}
        onClick={onAddPage}
        disabled={!canAddPage}
        aria-label="Nuova pagina"
        title="Nuova pagina"
      >
        <IconPlus />
        <span className={css.addLabel}>Nuova</span>
      </button>

      {/* Page counter */}
      <span className={css.counter} aria-live="polite">
        {currentPageIndex + 1} / {totalPages}
      </span>
    </div>
  );
}
