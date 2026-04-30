/**
 * HomeCronologia — Cronologia sessioni Google-style (iter 35 P0)
 * Sezione sotto le 5 card homepage. Mostra fino a 10 sessioni passate
 * recuperate da localStorage (`elab_unlim_sessions`) + Supabase
 * `unlim_sessions` quando disponibile.
 *
 * Per ogni sessione:
 *   - timestamp formattato ("2 giorni fa")
 *   - titolo esperimento (lessonPath.title)
 *   - modalità (Percorso/Passo Passo/Già Montato/Libero)
 *   - descrizione breve UNLIM-generated (cached server-side, ~80 char)
 *   - CTA "Riprendi sessione"
 *
 * NOTE iter 35: descrizione UNLIM generata da Edge Function
 * `unlim-session-description` (vedi supabase/functions/unlim-session-description/).
 * Cache lato server in colonna `description_unlim`. Se mancante, fallback
 * a riassunto locale dei messaggi della sessione.
 *
 * Andrea Marro — 30/04/2026
 */
import React, { useEffect, useState, useCallback, useMemo } from 'react';

const SESSIONS_KEY = 'elab_unlim_sessions';
const MAX_ITEMS = 10;

const PALETTE = {
  navy: '#1E4D8C',
  lime: '#4A7A25',
  orange: '#E8941C',
  red: '#E54B3D',
  textMuted: '#5A6B7E',
  border: 'rgba(30, 77, 140, 0.12)',
};

const styles = {
  section: {
    maxWidth: 1200,
    margin: '48px auto 0',
    padding: '32px 8px',
    fontFamily: "'Open Sans', system-ui, sans-serif",
  },
  heading: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: PALETTE.navy,
    margin: '0 0 16px',
    letterSpacing: '0.02em',
  },
  empty: {
    background: '#FFFFFF',
    border: `1px dashed ${PALETTE.border}`,
    borderRadius: 16,
    padding: '24px 20px',
    color: PALETTE.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  row: {
    background: '#FFFFFF',
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 14,
    padding: '14px 18px',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: 16,
    minHeight: 64,
    transition: 'border-color 160ms ease, box-shadow 160ms ease',
  },
  rowHover: {
    borderColor: PALETTE.navy,
    boxShadow: '0 4px 14px rgba(30, 77, 140, 0.10)',
  },
  timestamp: {
    fontSize: 12,
    color: PALETTE.textMuted,
    fontWeight: 600,
    minWidth: 90,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  body: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: PALETTE.navy,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: 13,
    color: PALETTE.textMuted,
    margin: 0,
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  modeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(30, 77, 140, 0.08)',
    color: PALETTE.navy,
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 999,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    width: 'fit-content',
    marginTop: 2,
  },
  resumeBtn: {
    minHeight: 44,
    minWidth: 44,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    background: PALETTE.navy,
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 120ms ease, transform 80ms ease',
  },
};

const MODE_LABEL = {
  percorso: 'Percorso',
  'passo-passo': 'Passo Passo',
  'gia-montato': 'Già Montato',
  libero: 'Libero',
};

function formatRelative(iso) {
  if (!iso) return '';
  const ts = new Date(iso).getTime();
  if (!Number.isFinite(ts)) return '';
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'pochi istanti fa';
  if (min < 60) return `${min} min fa`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} or${hr === 1 ? 'a' : 'e'} fa`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d} giorn${d === 1 ? 'o' : 'i'} fa`;
  if (d < 30) {
    const w = Math.floor(d / 7);
    return `${w} settiman${w === 1 ? 'a' : 'e'} fa`;
  }
  const m = Math.floor(d / 30);
  if (m < 12) return `${m} mes${m === 1 ? 'e' : 'i'} fa`;
  const y = Math.floor(d / 365);
  return `${y} ann${y === 1 ? 'o' : 'i'} fa`;
}

/**
 * Local fallback summary when UNLIM-generated description is missing.
 * Plurale "Ragazzi" non si addice qui (è metadato lista, non istruzione
 * docente). Stringa fattuale ≤80 char.
 */
function localFallbackSummary(session) {
  if (!session) return '';
  const expId = session.experimentId || 'esperimento';
  const nMsg = session?.messages?.length || 0;
  const dur = session?.startTime && session?.endTime
    ? Math.max(1, Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000))
    : null;
  const parts = [];
  if (nMsg > 0) parts.push(`${nMsg} interazion${nMsg === 1 ? 'e' : 'i'} con UNLIM`);
  if (dur) parts.push(`durata ${dur} min`);
  return parts.length ? parts.join(' · ') : `Sessione su ${expId}`;
}

function loadLocalSessions() {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s) => s && (s.experimentId || s.id))
      .sort((a, b) => {
        const ta = new Date(a.endTime || a.startTime || 0).getTime();
        const tb = new Date(b.endTime || b.startTime || 0).getTime();
        return tb - ta;
      })
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function HomeRow({ session, onResume }) {
  const [hover, setHover] = useState(false);
  const handle = useCallback(() => {
    if (typeof onResume === 'function' && session?.experimentId) {
      onResume(session.experimentId);
    }
  }, [onResume, session]);
  const ts = session?.endTime || session?.startTime || session?.startedAt;
  const title = session?.title || session?.experimentId || 'Sessione';
  const modalita = session?.modalita || session?.mode || 'percorso';
  const description = session?.description_unlim || localFallbackSummary(session);

  return (
    <li
      style={{ ...styles.row, ...(hover ? styles.rowHover : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-testid="cronologia-row"
    >
      <span style={styles.timestamp}>{formatRelative(ts)}</span>
      <div style={styles.body}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
        <span style={styles.modeBadge}>{MODE_LABEL[modalita] || modalita}</span>
      </div>
      <button
        type="button"
        style={styles.resumeBtn}
        onClick={handle}
        aria-label={`Riprendi sessione: ${title}`}
        data-testid="cronologia-resume"
      >
        Riprendi
      </button>
    </li>
  );
}

export default function HomeCronologia({ onResume }) {
  const [sessions, setSessions] = useState(() => loadLocalSessions());

  useEffect(() => {
    // Listen for storage updates (other tabs / live save)
    const handler = (ev) => {
      if (ev?.key && ev.key !== SESSIONS_KEY) return;
      setSessions(loadLocalSessions());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleResume = useCallback((experimentId) => {
    if (!experimentId) return;
    // Stash deep-link target so Lavagna can mount the experiment on entry.
    try {
      localStorage.setItem('elab_resume_experiment', experimentId);
    } catch { /* best effort */ }
    if (typeof onResume === 'function') {
      onResume('lavagna');
    } else if (typeof window !== 'undefined') {
      window.location.hash = '#lavagna?exp=' + encodeURIComponent(experimentId);
    }
  }, [onResume]);

  const items = useMemo(() => sessions.slice(0, MAX_ITEMS), [sessions]);

  return (
    <section style={styles.section} aria-labelledby="cronologia-heading" data-testid="home-cronologia">
      <h2 id="cronologia-heading" style={styles.heading}>Cronologia recente</h2>
      {items.length === 0 ? (
        <div style={styles.empty}>
          Nessuna sessione salvata ancora — le lezioni completate compariranno qui.
        </div>
      ) : (
        <ul style={styles.list}>
          {items.map((s) => (
            <HomeRow
              key={s.id || `${s.experimentId}-${s.startTime || s.startedAt || ''}`}
              session={s}
              onResume={handleResume}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
