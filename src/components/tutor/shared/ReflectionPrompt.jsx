// ============================================
// ReflectionPrompt — Riflessione post-attivita
// "Sapere di Non Sapere" — celebra la confusione
// Salva nel diario via studentService
// © Andrea Marro — 2026
// ============================================

import React, { useState } from 'react';
import studentService from '../../../services/studentService';

/**
 * Componente di riflessione che appare dopo ogni attivita completata.
 * Celebra la confusione e il "non sapere" come parte del processo.
 *
 * @param {string} toolName - Nome dello strumento (detective, poe, reverse, review)
 * @param {string} activityId - ID dell'attivita completata
 * @param {function} onSave - Callback con { type, text } quando lo studente salva
 * @param {function} onDismiss - Callback quando chiude senza scrivere
 */
export default function ReflectionPrompt({ toolName, activityId, onSave, onDismiss }) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('reflection'); // reflection | wonder | confused
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!text.trim()) return;
    const entry = {
      type: mode,
      text: text.trim(),
      toolName,
      activityId,
      timestamp: new Date().toISOString()
    };
    // Persistenza REALE in localStorage via studentService
    studentService.saveReflection(entry);
    // Callback al parent (logSession, etc.)
    onSave?.(entry);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="elab-tool__card" style={{ textAlign: 'center', background: 'rgba(145,191,69,0.05)' }}>
        <p style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.92rem', margin: 0 }}>
          {mode === 'confused' ? 'La confusione è il primo passo della scoperta!' : 'Riflessione salvata nel tuo diario!'}
        </p>
      </div>
    );
  }

  const prompts = {
    reflection: {
      emoji: '',
      title: 'Cosa hai scoperto?',
      placeholder: 'Scrivi qualcosa che hai capito, anche piccola...',
      buttonText: 'Salva nel diario'
    },
    wonder: {
      emoji: '',
      title: 'Scrivi una meraviglia',
      placeholder: 'Qualcosa che ti ha sorpreso o incuriosito...',
      buttonText: 'Salva la meraviglia'
    },
    confused: {
      emoji: '',
      title: 'Non ho capito...',
      placeholder: 'Cosa ti confonde? Le domande migliori nascono dalla confusione!',
      buttonText: 'Salva la domanda'
    }
  };

  const current = prompts[mode];

  return (
    <div className="elab-tool__card" style={{
      background: 'linear-gradient(135deg, rgba(145,191,69,0.05), rgba(31,61,133,0.03))',
      border: '1px dashed var(--elab-lime)'
    }}>
      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {Object.entries(prompts).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            style={{
              padding: '4px 12px',
              borderRadius: 16,
              border: mode === key ? '2px solid var(--elab-navy)' : '1px solid var(--elab-border)',
              background: mode === key ? 'rgba(31,61,133,0.08)' : 'white',
              fontWeight: mode === key ? 700 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            {val.title}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <h4 style={{
        fontFamily: "'Oswald', sans-serif",
        color: 'var(--elab-navy)',
        fontSize: '0.95rem',
        margin: '0 0 8px'
      }}>
        {current.title}
      </h4>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={current.placeholder}
        className="elab-tool__textarea"
        style={{ minHeight: 70 }}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className="elab-tool__btn elab-tool__btn--primary"
          style={{ flex: 1, fontSize: '0.875rem' }}
        >
          {current.buttonText}
        </button>
        <button
          onClick={onDismiss}
          className="elab-tool__btn elab-tool__btn--secondary"
          style={{ fontSize: '0.875rem', padding: '6px 14px' }}
        >
          Salta
        </button>
      </div>

      {mode === 'confused' && (
        <p style={{
          marginTop: 8, fontSize: '0.875rem', color: 'var(--elab-muted)',
          fontStyle: 'italic', textAlign: 'center'
        }}>
          "So di non sapere" — Socrate. Le domande migliori non hanno risposta facile.
        </p>
      )}
    </div>
  );
}
