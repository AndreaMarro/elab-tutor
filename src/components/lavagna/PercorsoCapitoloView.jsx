/**
 * PercorsoCapitoloView — Sprint Q2.D
 * Andrea Marro 2026-04-25
 *
 * Orchestratore Percorso Capitolo. Layout split 70/25:
 *  - main role 70%: display centrale per CLASSE
 *    Teoria narrative + esperimenti chain con transizioni + citazioni inline
 *  - aside role complementary 25%: DocenteSidebar colpo d'occhio
 *
 * PRINCIPIO ZERO:
 *  - Display centrale: testo grande (24px+), letto ad alta voce alla classe
 *  - Sidebar docente: linguaggio neutro nominale, non comandi
 *  - Citazioni Vol.N pag.M cliccabili (apre VolumeViewer)
 *  - Transizioni narrative tra esperimenti dello stesso Cap
 *
 * Props:
 *   capitolo: Capitolo | null
 *   onClose?: () => void
 *   onCitationClick?: ({ volume, page }) => void
 */

import React, { useState, useEffect, useCallback } from 'react';
import VolumeCitation from '../common/VolumeCitation.jsx';
import DocenteSidebar from './DocenteSidebar.jsx';
import css from './PercorsoCapitoloView.module.css';

// Iter 35 K3 — opt-in collapse sidebar localStorage key.
const COLLAPSED_KEY = 'elab-lavagna-percorso-capitolo-collapsed';

const INCREMENTAL_LABEL = {
  add_component: 'aggiunta componente',
  remove_component: 'rimozione componente',
  modify_component: 'modifica componente',
  from_scratch: 'circuito da zero',
};

function findTransitionFromPrev(capitolo, espIndex) {
  if (!capitolo?.narrative_flow?.transitions || espIndex === 0) return null;
  const prevId = capitolo.esperimenti[espIndex - 1]?.id;
  const currId = capitolo.esperimenti[espIndex]?.id;
  return capitolo.narrative_flow.transitions.find(
    (t) => t.between?.[0] === prevId && t.between?.[1] === currId
  ) ?? null;
}

export default function PercorsoCapitoloView({ capitolo, onClose, onCitationClick }) {
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  // Iter 35 K3 — sidebar collapse state, persisted localStorage so
  // docente preference survives reload (Morfismo Sense 1.5 docente memory).
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      if (typeof localStorage === 'undefined') return false;
      return localStorage.getItem(COLLAPSED_KEY) === '1';
    } catch { return false; }
  });

  useEffect(() => {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(COLLAPSED_KEY, sidebarCollapsed ? '1' : '0');
    } catch { /* best-effort */ }
  }, [sidebarCollapsed]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((c) => !c);
  }, []);

  if (!capitolo) {
    return (
      <div className={css.fallback}>
        <p>Nessun capitolo selezionato. Caricamento in corso o selezionare Capitolo.</p>
      </div>
    );
  }

  const activeExp = capitolo.esperimenti?.[activeExpIndex] ?? null;
  const activePhase = activeExp?.phases?.[activePhaseIndex] ?? null;
  const docenteSidebarData = activePhase?.docente_sidebar ?? null;

  return (
    <div className={css.container}>
      <main className={css.mainContent} role="main" aria-label={`Percorso ${capitolo.titolo}`}>
        <header className={css.capHeader}>
          <div className={css.capMeta}>
            <span className={css.volBadge}>{`Vol.${capitolo.volume}`}</span>
            {capitolo.pageStart && capitolo.pageEnd && (
              <span className={css.pageRange}>{`pag. ${capitolo.pageStart}-${capitolo.pageEnd}`}</span>
            )}
            <span className={css.typeChip}>{capitolo.type}</span>
          </div>
          <h1 className={css.capTitle}>{capitolo.titolo}</h1>
          {/* Iter 35 K3 — opt-in collapse capitolo overview / sidebar.
              Persiste localStorage `elab-lavagna-percorso-capitolo-collapsed`.
              Touch ≥44px (33+padding 12+12=44 effective), aria-pressed
              riflette stato corrente. Inline style fallback se modulo CSS
              non importato (Morfismo Sense 1.5 finestra adattiva). */}
          <button
            type="button"
            className={css.collapseBtn || ''}
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Mostra sidebar capitolo' : 'Nascondi sidebar capitolo'}
            aria-pressed={sidebarCollapsed}
            title={sidebarCollapsed ? 'Mostra sidebar' : 'Nascondi sidebar'}
            data-testid="percorso-capitolo-collapse-toggle"
            style={{
              minHeight: 44,
              minWidth: 44,
              padding: '8px 12px',
              marginLeft: 8,
              fontSize: 13,
              fontWeight: 700,
              border: '1.5px solid rgba(30, 77, 140, 0.30)',
              background: sidebarCollapsed ? '#1E4D8C' : '#FFFFFF',
              color: sidebarCollapsed ? '#FFFFFF' : '#1E4D8C',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </button>
          {onClose && (
            <button type="button" className={css.closeBtn} onClick={onClose} aria-label="Chiudi percorso">
              ×
            </button>
          )}
        </header>

        {capitolo.theory?.testo_classe && (
          <section className={css.theorySection} aria-label="Teoria">
            <p className={css.theoryText}>{capitolo.theory.testo_classe}</p>
            {capitolo.theory.citazioni_volume?.length > 0 && (
              <div className={css.citationsRow}>
                {capitolo.theory.citazioni_volume.map((cit, i) => (
                  <VolumeCitation
                    key={i}
                    volume={capitolo.volume}
                    page={cit.page}
                    onClick={onCitationClick}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {capitolo.narrative_flow?.intro_text && (
          <section className={css.introSection}>
            <p className={css.introText}>{capitolo.narrative_flow.intro_text}</p>
          </section>
        )}

        {capitolo.esperimenti?.map((esp, idx) => {
          const transition = findTransitionFromPrev(capitolo, idx);
          const incrementalHint =
            esp.build_circuit?.mode === 'incremental_from_prev'
              ? `Costruzione incremental partendo dal circuito precedente (${INCREMENTAL_LABEL[transition?.incremental_mode] ?? 'modifica'})`
              : null;

          return (
            <article
              key={esp.id}
              className={`${css.experimentSection} ${idx === activeExpIndex ? css.activeExp : ''}`}
              onClick={() => { setActiveExpIndex(idx); setActivePhaseIndex(0); }}
              aria-label={`Esperimento ${esp.num}: ${esp.title_classe}`}
            >
              {transition && (
                <div className={css.transition}>
                  <span className={css.transitionLabel}>Transizione</span>
                  <p className={css.transitionText}>{transition.text_classe}</p>
                </div>
              )}

              <header className={css.expHeader}>
                <div className={css.expNum}>Esperimento {esp.num}</div>
                <h2 className={css.expTitle}>{esp.title_classe}</h2>
                {esp.volume_ref?.page_start && (
                  <VolumeCitation
                    volume={capitolo.volume}
                    page={esp.volume_ref.page_start}
                    onClick={onCitationClick}
                  />
                )}
              </header>

              {esp.components_needed?.length > 0 && (
                <div className={css.componentsBlock}>
                  <div className={css.blockLabel}>Componenti</div>
                  <ul className={css.componentsList}>
                    {esp.components_needed.map((c, i) => (
                      <li key={i} className={css.componentItem}>
                        {c.name} {c.quantity > 1 ? `× ${c.quantity}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {incrementalHint && (
                <div className={css.incrementalHint}>{incrementalHint}</div>
              )}

              {esp.phases?.length > 0 && (
                <div className={css.phasesBlock}>
                  <div className={css.blockLabel}>Fasi</div>
                  <ol className={css.phasesList}>
                    {esp.phases.map((ph, phi) => (
                      <li
                        key={phi}
                        className={`${css.phaseItem} ${phi === activePhaseIndex && idx === activeExpIndex ? css.activePhase : ''}`}
                        onClick={(e) => { e.stopPropagation(); setActiveExpIndex(idx); setActivePhaseIndex(phi); }}
                      >
                        <span className={css.phaseName}>{ph.name}</span>
                        {ph.classe_display?.text_hook && (
                          <p className={css.phaseHook}>{ph.classe_display.text_hook}</p>
                        )}
                        {ph.classe_display?.observation_prompt && (
                          <p className={css.phaseObservation}>{ph.classe_display.observation_prompt}</p>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </article>
          );
        })}

        {capitolo.narrative_flow?.closing_text && (
          <section className={css.closingSection}>
            <p className={css.closingText}>{capitolo.narrative_flow.closing_text}</p>
          </section>
        )}
      </main>

      {!sidebarCollapsed && (
        <DocenteSidebar
          docenteSidebar={docenteSidebarData}
          currentPhase={activePhase?.name ?? null}
          currentExperiment={activeExp ? { id: activeExp.id, num: activeExp.num, title_docente: activeExp.title_docente } : null}
        />
      )}
    </div>
  );
}
