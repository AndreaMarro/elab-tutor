/**
 * ExperimentPicker — Modal selezione esperimenti per la Lavagna ELAB
 * 3 volumi (Lime/Orange/Red), card per esperimento, ricerca, lucchetti, progress badge.
 * (c) Andrea Marro — 02/04/2026
 */
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import EXPERIMENTS_VOL1 from '../../data/experiments-vol1';
import EXPERIMENTS_VOL2 from '../../data/experiments-vol2';
import EXPERIMENTS_VOL3 from '../../data/experiments-vol3';
import css from './ExperimentPicker.module.css';

const VOLUMES = [
  { key: 1, data: EXPERIMENTS_VOL1, color: '#4A7A25', label: 'Volume 1', sub: 'Le Basi' },
  { key: 2, data: EXPERIMENTS_VOL2, color: '#E8941C', label: 'Volume 2', sub: 'Approfondiamo' },
  { key: 3, data: EXPERIMENTS_VOL3, color: '#E54B3D', label: 'Volume 3', sub: 'Arduino' },
];

function getChapterGroups(experiments) {
  const groups = {};
  for (const exp of experiments) {
    const ch = exp.chapter || 'Altro';
    if (!groups[ch]) groups[ch] = [];
    groups[ch].push(exp);
  }
  return Object.entries(groups);
}

export default function ExperimentPicker({ open, onClose, onSelect, completedIds = [] }) {
  const [activeVol, setActiveVol] = useState(1);
  const [search, setSearch] = useState('');
  const backdropRef = useRef(null);
  const searchRef = useRef(null);

  // Focus search on open
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const vol = VOLUMES.find(v => v.key === activeVol);
  const experiments = vol?.data?.experiments || [];

  const filtered = useMemo(() => {
    if (!search.trim()) return experiments;
    const q = search.toLowerCase();
    return experiments.filter(e =>
      e.title?.toLowerCase().includes(q) ||
      e.desc?.toLowerCase().includes(q) ||
      e.chapter?.toLowerCase().includes(q)
    );
  }, [experiments, search]);

  const chapters = useMemo(() => getChapterGroups(filtered), [filtered]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === backdropRef.current) onClose();
  }, [onClose]);

  const handleSelect = useCallback((exp) => {
    onSelect?.(exp);
    onClose();
  }, [onSelect, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Scegli un esperimento"
    >
      <div className={css.modal}>
        {/* Header */}
        <div className={css.header}>
          <h2 className={css.title}>Scegli Esperimento</h2>
          <button className={css.closeBtn} onClick={onClose} aria-label="Chiudi">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Volume tabs */}
        <div className={css.tabRow} role="tablist">
          {VOLUMES.map(v => (
            <button
              key={v.key}
              role="tab"
              aria-selected={activeVol === v.key}
              className={`${css.tab} ${activeVol === v.key ? css.tabActive : ''}`}
              style={activeVol === v.key ? { background: v.color, borderColor: v.color, color: '#fff' } : { borderColor: v.color, color: v.color }}
              onClick={() => { setActiveVol(v.key); setSearch(''); }}
            >
              <span className={css.tabLabel}>{v.label}</span>
              <span className={css.tabSub}>{v.sub}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={css.searchRow}>
          <input
            ref={searchRef}
            type="text"
            className={css.searchInput}
            placeholder="Cerca esperimento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cerca esperimento"
          />
          {search && (
            <button className={css.clearBtn} onClick={() => setSearch('')} aria-label="Cancella ricerca">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Experiment list grouped by chapter */}
        <div className={css.body}>
          {chapters.length === 0 && (
            <p className={css.empty}>Nessun esperimento trovato.</p>
          )}
          {chapters.map(([chapter, exps]) => (
            <div key={chapter} className={css.chapterGroup}>
              <h3 className={css.chapterTitle} style={{ color: vol.color }}>{chapter}</h3>
              <div className={css.cardGrid}>
                {exps.map(exp => {
                  const done = completedIds.includes(exp.id);
                  return (
                    <button
                      key={exp.id}
                      className={css.card}
                      onClick={() => handleSelect(exp)}
                      aria-label={`${exp.title}${done ? ' — completato' : ''}`}
                    >
                      <div className={css.cardTop} style={{ borderLeftColor: vol.color }}>
                        <span className={css.cardTitle}>{exp.title?.replace(/Cap\.\s*\d+\s*Esp\.\s*\d+\s*-\s*/, '')}</span>
                        {done && (
                          <svg className={css.checkIcon} width="18" height="18" viewBox="0 0 20 20" fill="none" aria-label="Completato">
                            <circle cx="10" cy="10" r="8" fill="#4A7A25" />
                            <path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {exp.desc && <p className={css.cardDesc}>{exp.desc}</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer stats */}
        <div className={css.footer}>
          <span className={css.footerStat}>
            {completedIds.filter(id => experiments.some(e => e.id === id)).length}/{experiments.length} completati
          </span>
        </div>
      </div>
    </div>
  );
}
