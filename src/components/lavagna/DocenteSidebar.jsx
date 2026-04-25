/**
 * DocenteSidebar — Sprint Q2.B
 * Andrea Marro 2026-04-25
 *
 * Sidebar destra sticky 25% width. Colpo d'occhio docente.
 * Reactive a scroll position di PercorsoCapitoloView per aggiornare step_corrente.
 *
 * PRINCIPIO ZERO:
 * - Linguaggio neutro nominale ("Distribuzione kit", non "Distribuisci")
 * - Spunto come citazione testuale ("Domanda: '...'", non "Chiedi alla classe")
 * - Note descrittive, non comandi
 * - Errori tipici come problema + soluzione neutra
 *
 * Docente la legge in silenzio per CAPIRE stato + cosa accade ora.
 *
 * Props:
 *   docenteSidebar: { step_corrente, spunto_per_classe, note[], errori_tipici[] } | null
 *   currentPhase?: 'PREPARA' | 'MOSTRA' | 'CHIEDI' | 'OSSERVA' | 'CONCLUDI'
 *   currentExperiment?: { id, title_docente, num }
 */

import React from 'react';
import css from './DocenteSidebar.module.css';

export default function DocenteSidebar({
  docenteSidebar = null,
  currentPhase = null,
  currentExperiment = null,
}) {
  const data = docenteSidebar ?? {
    step_corrente: '',
    spunto_per_classe: null,
    note: [],
    errori_tipici: [],
  };

  return (
    <aside
      className={css.sidebar}
      role="complementary"
      aria-label="Sidebar docente — colpo d'occhio sul percorso"
    >
      <header className={css.header}>
        <div className={css.headerLabel}>Sidebar docente</div>
        {currentExperiment && (
          <div className={css.experimentRef}>
            Esp. {currentExperiment.num ?? ''} — {currentExperiment.title_docente ?? currentExperiment.id ?? ''}
          </div>
        )}
        {currentPhase && (
          <div className={css.phaseLabel}>{currentPhase}</div>
        )}
      </header>

      {data.step_corrente ? (
        <section className={css.stepSection} data-section="step">
          <div className={css.sectionLabel}>Step</div>
          <div className={css.stepText}>{data.step_corrente}</div>
        </section>
      ) : null}

      {data.spunto_per_classe ? (
        <section className={css.spuntoSection} data-section="spunto">
          <div className={css.sectionLabel}>Spunto</div>
          <div className={css.spuntoText}>{data.spunto_per_classe}</div>
        </section>
      ) : null}

      {data.note && data.note.length > 0 ? (
        <section className={css.noteSection} data-section="note">
          <div className={css.sectionLabel}>Note</div>
          <ul className={css.noteList}>
            {data.note.map((n, i) => (
              <li key={i} className={css.noteItem}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.errori_tipici && data.errori_tipici.length > 0 ? (
        <section className={css.erroriSection} data-section="errori">
          <div className={css.sectionLabel}>Errori tipici</div>
          <ul className={css.erroriList}>
            {data.errori_tipici.map((e, i) => (
              <li key={i} className={css.erroreItem}>
                <div className={css.problema}>{e.problema}</div>
                <div className={css.soluzione}>{e.soluzione_neutra}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
