/**
 * PercorsoPanel — Lesson path floating panel for Lavagna shell.
 *
 * Iter 35 N2 + J3 scaffold + UX (WebDesigner-1):
 *   - Capitolo header (Vol + Capitolo title from currentExperiment context)
 *   - Esperimento corrente (citation Vol/pag, kit fisico mention preserved)
 *   - "Ultima sessione" insight (from Supabase student_progress class memory)
 *   - "Suggerimenti memoria classe" top-3 relevant esperimenti completati %
 *   - Browse Vol1/Vol2/Vol3 capitoli switching UI (J3)
 *   - Glassmorphism Navy/Lime accent (Morfismo Sense 2 palette)
 *
 * Lesson path detail flow (PREPARA / MOSTRA / CHIEDI / OSSERVA / CONCLUDI)
 * remains delegated to existing LessonPathPanel for the Esperimento body.
 *
 * Coordination filesystem barrier:
 *   - Maker-2 J1 Percorso context payload (api.js __ELAB_API extension).
 *   - Maker-1 (eventual) class_key memory iter 31 ralph backend RPC.
 *
 * Principio Zero: only docente sees this. Plurale "Ragazzi," compliant
 * via tone "Suggeriamo a voi, classe…" never imperativo singolare.
 *
 * (c) Andrea Marro — iter 35 WebDesigner-1 — 2026-05-04
 * Original by Andrea Marro 03/04/2026 (preserved iter 36+).
 */

import React, { lazy, Suspense, useEffect, useMemo, useState, useCallback } from 'react';
import FloatingWindow from './FloatingWindow';

const LessonPathPanel = lazy(() => import('../simulator/panels/LessonPathPanel'));

// Palette tokens — Morfismo Sense 2 triplet coerenza materiale.
// Hex fallbacks per compatibility with components testing in isolation.
const PALETTE = {
  navy: 'var(--elab-navy, #1E4D8C)',
  navyDeep: 'var(--elab-navy-deep, #0E2D5C)',
  lime: 'var(--elab-lime, #4A7A25)',
  orange: 'var(--elab-orange, #E8941C)',
  red: 'var(--elab-red, #E54B3D)',
  textMuted: 'var(--elab-text-muted, #5A6B7E)',
};

const styles = {
  scroll: {
    height: '100%',
    overflow: 'auto',
    padding: '14px 16px 18px',
    boxSizing: 'border-box',
    fontFamily: "'Open Sans', system-ui, sans-serif",
    background: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  capHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingBottom: 10,
    borderBottom: `2px solid rgba(74, 122, 37, 0.30)`,
    marginBottom: 12,
  },
  capLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: PALETTE.lime,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    margin: 0,
  },
  capTitle: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: PALETTE.navy,
    margin: 0,
    lineHeight: 1.2,
  },
  expSubtitle: {
    fontSize: 13,
    color: PALETTE.textMuted,
    fontWeight: 500,
    margin: 0,
    fontStyle: 'italic',
  },
  sectionLabel: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 12,
    fontWeight: 700,
    color: PALETTE.navy,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    margin: '14px 0 6px',
  },
  insightBox: {
    background: 'rgba(232, 148, 28, 0.08)',
    border: `1px solid rgba(232, 148, 28, 0.30)`,
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 13,
    color: PALETTE.navy,
    lineHeight: 1.5,
  },
  insightTitle: {
    fontWeight: 700,
    color: PALETTE.orange,
    marginRight: 6,
  },
  memoryList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  memoryItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    background: 'rgba(74, 122, 37, 0.06)',
    border: `1px solid rgba(74, 122, 37, 0.20)`,
    borderRadius: 8,
    fontSize: 13,
    color: PALETTE.navy,
  },
  memoryPct: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: PALETTE.lime,
    minWidth: 42,
    textAlign: 'right',
  },
  capSwitcher: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  capChip: {
    minHeight: 32,
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 700,
    border: `1.5px solid rgba(30, 77, 140, 0.20)`,
    background: 'rgba(255, 255, 255, 0.85)',
    color: PALETTE.navy,
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.02em',
    transition: 'background 120ms ease, border-color 120ms ease',
  },
  capChipActive: {
    background: PALETTE.navy,
    color: '#FFFFFF',
    borderColor: PALETTE.navyDeep,
  },
  emptyState: {
    padding: 32,
    textAlign: 'center',
    color: PALETTE.navy,
    fontFamily: "'Open Sans', system-ui, sans-serif",
  },
  emptyTitle: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 16,
    fontWeight: 700,
    margin: '0 0 6px',
  },
  emptyText: {
    fontSize: 14,
    color: PALETTE.textMuted,
    margin: 0,
    lineHeight: 1.5,
  },
  divider: {
    border: 'none',
    borderTop: `1px solid rgba(30, 77, 140, 0.10)`,
    margin: '14px 0 0',
  },
};

const VOLUMI = [1, 2, 3];

function deriveCapitoloFromExperiment(exp) {
  if (!exp) return null;
  // Extract Vol + Cap from id format `vN-capM-espK` first.
  if (typeof exp.id === 'string') {
    const match = exp.id.match(/^v(\d+)-cap(\d+)/i);
    if (match) {
      return { volume: Number(match[1]), capitolo: Number(match[2]) };
    }
  }
  if (exp.volume && exp.capitolo) {
    return { volume: Number(exp.volume), capitolo: Number(exp.capitolo) };
  }
  return null;
}

export default function PercorsoPanel({ visible = false, onClose, experiment: propExperiment = null }) {
  const [localExperiment, setLocalExperiment] = useState(null);
  const [allExperiments, setAllExperiments] = useState([]);
  // Iter 35 J3 — class memory insights (last session + completed pct).
  const [classMemory, setClassMemory] = useState({ lastSession: null, recent: [] });
  // Iter 35 J3 — Vol switcher (1/2/3) + Cap switcher state.
  const [activeVol, setActiveVol] = useState(1);

  // Use prop experiment (from LavagnaShell) as primary source.
  const experiment = propExperiment || localExperiment;
  const capitolo = useMemo(() => deriveCapitoloFromExperiment(experiment), [experiment]);

  // Sync activeVol with current experiment (Morfismo: panel adatta a context).
  useEffect(() => {
    if (capitolo?.volume) setActiveVol(capitolo.volume);
  }, [capitolo?.volume]);

  // Iter 35 N2 — listen to __ELAB_API events (preserved iter 36+ pattern).
  useEffect(() => {
    const api = typeof window !== 'undefined' && window.__ELAB_API;
    if (!api) return;

    const exp = api.getCurrentExperiment?.();
    if (exp) setLocalExperiment(exp);
    const all = api.getExperimentList?.();
    if (all?.length) setAllExperiments(all);

    const onExpChange = () => {
      const newExp = api.getCurrentExperiment?.();
      if (newExp) setLocalExperiment(newExp);
    };
    api.on?.('experimentChange', onExpChange);

    let retries = 0;
    const poll = setInterval(() => {
      const e = api.getCurrentExperiment?.();
      if (e && e.id) { setLocalExperiment(e); clearInterval(poll); }
      if (++retries > 10) clearInterval(poll);
    }, 300);

    return () => {
      clearInterval(poll);
      api.off?.('experimentChange', onExpChange);
    };
  }, [propExperiment]);

  // Iter 35 J3 — class memory load. Coordinate Maker-1 J1: future
  // `api.unlim.getClassMemory()` returning { lastSession, recentCompleted }.
  // Defensive: if API not yet shipped, fall back to localStorage cache OR
  // empty state. NEVER block panel render.
  useEffect(() => {
    if (!visible) return;
    const api = typeof window !== 'undefined' && window.__ELAB_API;
    let cancelled = false;
    const tryLoad = async () => {
      try {
        if (api?.unlim?.getClassMemory) {
          const mem = await api.unlim.getClassMemory();
          if (!cancelled && mem) setClassMemory({
            lastSession: mem.lastSession || null,
            recent: Array.isArray(mem.recent) ? mem.recent.slice(0, 3) : [],
          });
          return;
        }
        // Fallback: read from local sessions cache (HomeCronologia same key).
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem('elab_unlim_sessions');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0 && !cancelled) {
              const sorted = [...parsed].sort((a, b) => {
                const ta = new Date(a.endTime || a.startTime || 0).getTime();
                const tb = new Date(b.endTime || b.startTime || 0).getTime();
                return tb - ta;
              });
              setClassMemory({
                lastSession: sorted[0] ? {
                  experimentId: sorted[0].experimentId,
                  description: sorted[0].description_unlim || sorted[0].title || sorted[0].experimentId,
                  endedAt: sorted[0].endTime,
                } : null,
                recent: sorted.slice(0, 3).map((s) => ({
                  experimentId: s.experimentId,
                  title: s.title || s.experimentId,
                  pct: typeof s.completionPct === 'number' ? s.completionPct : null,
                })),
              });
            }
          }
        }
      } catch { /* best-effort, never throw */ }
    };
    tryLoad();
    return () => { cancelled = true; };
  }, [visible]);

  const handleSendToUNLIM = useCallback((msg) => {
    const api = typeof window !== 'undefined' && window.__ELAB_API;
    if (api?.unlim?.sendMessage) api.unlim.sendMessage(msg);
  }, []);

  const handleLoadExperiment = useCallback((id) => {
    const api = typeof window !== 'undefined' && window.__ELAB_API;
    if (api?.loadExperiment) api.loadExperiment(id);
  }, []);

  // Iter 35 J3 — switch Vol (1/2/3): trigger via __ELAB_API mountFirstExperiment.
  // If API extension not yet present (Maker-2 J1 pending), fallback no-op.
  const handleVolSwitch = useCallback((vol) => {
    setActiveVol(vol);
    const api = typeof window !== 'undefined' && window.__ELAB_API;
    if (api?.mountFirstExperimentInVolume) {
      api.mountFirstExperimentInVolume(vol);
    } else if (api?.unlim?.suggestExperimentForVolume) {
      api.unlim.suggestExperimentForVolume(vol);
    }
    // No-op fallback: switcher purely visual, real load defer to Maker-2.
  }, []);

  if (!visible) return null;

  // Iter 35 N3 — z-index initial position coordination with UNLIM panel:
  // PercorsoPanel left-top 30vw 50vh; UNLIM panel default right side.
  // FloatingWindow internal z-counter handles bring-to-front on focus
  // (PercorsoPanel z=initial + click-to-front respects Andrea Percorso primary
  // focus mandate). Initial position chosen to NOT overlap UNLIM 1920×1080.
  const safeWindowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const safeWindowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  return (
    <FloatingWindow
      id="percorso-v2"
      title="Guida Esperimento"
      defaultPosition={{
        // Left-top ~5% margin, safe for 1920×1080 LIM (no overlap UNLIM right-bottom).
        x: Math.max(20, Math.round(safeWindowWidth * 0.04)),
        y: Math.max(56, Math.round(safeWindowHeight * 0.10)),
      }}
      defaultSize={{
        w: Math.min(420, Math.round(safeWindowWidth * 0.30)),
        h: Math.min(620, Math.round(safeWindowHeight * 0.55)),
      }}
      onClose={onClose}
    >
      <div
        style={styles.scroll}
        data-testid="percorso-panel-scroll"
        data-elab-panel="percorso"
        className="elab-percorso-panel"
      >
        {/* Iter 35 J3 — Vol switcher chips (Morfismo Sense 1 — mode active
            adatta presentation runtime). */}
        <div style={styles.capHeader} data-testid="percorso-cap-header">
          <p style={styles.capLabel}>Percorso lezione</p>
          {capitolo ? (
            <h3 style={styles.capTitle}>
              Vol. {capitolo.volume} · Capitolo {capitolo.capitolo}
              {experiment?.titolo && ` — ${experiment.titolo}`}
            </h3>
          ) : (
            <h3 style={styles.capTitle}>Scegliete un esperimento</h3>
          )}
          {experiment?.titolo_classe && experiment.titolo_classe !== experiment.titolo && (
            <p style={styles.expSubtitle}>{experiment.titolo_classe}</p>
          )}
          <div style={styles.capSwitcher} role="tablist" aria-label="Cambia volume">
            {VOLUMI.map((v) => {
              const isActive = activeVol === v;
              return (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleVolSwitch(v)}
                  style={{
                    ...styles.capChip,
                    ...(isActive ? styles.capChipActive : {}),
                  }}
                  data-testid={`percorso-vol-chip-${v}`}
                >
                  Vol. {v}
                </button>
              );
            })}
          </div>
        </div>

        {/* Iter 35 N2 — Ultima sessione insight (class memory). Hidden if no data. */}
        {classMemory.lastSession && (
          <>
            <p style={styles.sectionLabel}>Ultima sessione</p>
            <div style={styles.insightBox} data-testid="percorso-last-session">
              <span style={styles.insightTitle}>Ricordo:</span>
              {classMemory.lastSession.description || classMemory.lastSession.experimentId}
            </div>
          </>
        )}

        {/* Iter 35 J3 — Suggerimenti memoria classe top-3 esperimenti recenti. */}
        {classMemory.recent && classMemory.recent.length > 0 && (
          <>
            <p style={styles.sectionLabel}>Suggerimenti dalla memoria classe</p>
            <ul style={styles.memoryList} data-testid="percorso-memory-list">
              {classMemory.recent.map((it, idx) => (
                <li key={`${it.experimentId || 'mem'}-${idx}`} style={styles.memoryItem}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {it.title || it.experimentId}
                  </span>
                  {typeof it.pct === 'number' && (
                    <span style={styles.memoryPct}>{it.pct}%</span>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        <hr style={styles.divider} aria-hidden="true" />

        {/* Existing detailed lesson path body — preserved iter 36 pattern. */}
        {experiment ? (
          <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: PALETTE.navy }}>Caricamento percorso…</div>}>
            <LessonPathPanel
              experiment={experiment}
              allExperiments={allExperiments}
              onClose={onClose}
              onSendToUNLIM={handleSendToUNLIM}
              onLoadExperiment={handleLoadExperiment}
              embedded
            />
          </Suspense>
        ) : (
          <div style={styles.emptyState} data-testid="percorso-empty">
            <p style={styles.emptyTitle}>Nessun esperimento caricato</p>
            <p style={styles.emptyText}>
              Ragazzi, scegliete un esperimento dall'header per vedere il percorso della lezione.
              Il kit ELAB è già pronto sul banco.
            </p>
          </div>
        )}
      </div>
    </FloatingWindow>
  );
}
