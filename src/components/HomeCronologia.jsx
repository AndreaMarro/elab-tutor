/**
 * HomeCronologia — Cronologia sessioni Google/ChatGPT-style (Sprint U iter 7 ralph iter 3)
 *
 * Sezione sotto i 3 button homepage. Mostra fino a 30 sessioni passate
 * recuperate da localStorage (`elab_unlim_sessions`) con:
 *   - Search bar Google-style (filtra titolo + descrizione + experimentId)
 *   - Date buckets fissi (Oggi / Ieri / Questa settimana / Più vecchie)
 *   - AI brief riassunto (description_unlim cached server-side via Edge Function
 *     `unlim-session-description`); fallback locale conta interazioni + durata
 *   - On-demand fetch AI brief se `description_unlim` assente ma `messages.length>0`
 *   - CTA "Riprendi" → deep-link `localStorage.elab_resume_experiment`
 *
 * NOTE iter 35: descrizione UNLIM generata da Edge Function
 * `unlim-session-description` (vedi supabase/functions/unlim-session-description/).
 * Cache lato server in colonna `description_unlim`. Se mancante e stack online,
 * fetch on-demand al primo render della row.
 *
 * Andrea Marro — iter 7 ralph iter 3 — 2026-05-01
 */
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';

const SESSIONS_KEY = 'elab_unlim_sessions';
const MAX_ITEMS = 30;
const SUPABASE_URL = (import.meta?.env?.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_ANON = import.meta?.env?.VITE_SUPABASE_ANON_KEY || '';

const PALETTE = {
  navy: '#1E4D8C',
  lime: '#4A7A25',
  orange: '#E8941C',
  red: '#E54B3D',
  textMuted: '#5A6B7E',
  border: 'rgba(30, 77, 140, 0.12)',
  searchBg: '#F5F7FA',
};

const styles = {
  section: {
    maxWidth: 1200,
    margin: '48px auto 0',
    padding: '32px 16px',
    fontFamily: "'Open Sans', system-ui, sans-serif",
  },
  headerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  heading: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: PALETTE.navy,
    margin: 0,
    letterSpacing: '0.02em',
  },
  searchWrap: {
    flex: '1 1 240px',
    maxWidth: 360,
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    minHeight: 44,
    padding: '10px 14px 10px 38px',
    borderRadius: 12,
    border: `1px solid ${PALETTE.border}`,
    background: PALETTE.searchBg,
    fontSize: 14,
    fontFamily: 'inherit',
    color: PALETTE.navy,
    outline: 'none',
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  empty: {
    background: '#FFFFFF',
    border: `1px dashed ${PALETTE.border}`,
    borderRadius: 16,
    padding: '32px 20px',
    color: PALETTE.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  bucket: {
    margin: '24px 0 0',
    padding: 0,
  },
  bucketLabel: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 13,
    fontWeight: 700,
    color: PALETTE.lime,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    margin: '0 0 8px 4px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
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
  descriptionLoading: {
    fontSize: 13,
    color: PALETTE.lime,
    margin: 0,
    fontStyle: 'italic',
    opacity: 0.7,
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
 * Bucket sessions in 4 fixed groups (Google/ChatGPT pattern).
 * Returns ordered array of {label, items[]}, empty buckets dropped.
 */
function bucketByDate(sessions) {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayStart = startOfDay.getTime();
  const yesterdayStart = todayStart - 86400000;
  const weekStart = todayStart - 7 * 86400000;

  const buckets = {
    oggi: [],
    ieri: [],
    settimana: [],
    vecchie: [],
  };

  for (const s of sessions) {
    const ts = new Date(s.endTime || s.startTime || s.startedAt || 0).getTime();
    if (!Number.isFinite(ts) || ts <= 0) {
      buckets.vecchie.push(s);
    } else if (ts >= todayStart) {
      buckets.oggi.push(s);
    } else if (ts >= yesterdayStart) {
      buckets.ieri.push(s);
    } else if (ts >= weekStart) {
      buckets.settimana.push(s);
    } else {
      buckets.vecchie.push(s);
    }
  }

  return [
    { label: 'Oggi', items: buckets.oggi },
    { label: 'Ieri', items: buckets.ieri },
    { label: 'Questa settimana', items: buckets.settimana },
    { label: 'Più vecchie', items: buckets.vecchie },
  ].filter((b) => b.items.length > 0);
}

/**
 * Local fallback summary when UNLIM-generated description is missing.
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

/**
 * Persist `description_unlim` back to localStorage on a specific session,
 * so subsequent renders skip the fetch (offline-tolerant cache).
 */
function persistDescription(sessionId, description) {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    const next = parsed.map((s) =>
      s && (s.id === sessionId || s.experimentId === sessionId)
        ? { ...s, description_unlim: description }
        : s
    );
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
  } catch { /* best effort */ }
}

/**
 * Fetch AI brief description from Edge Function `unlim-session-description`.
 * Edge Function contract (iter 35): POST { session_id } → { description }.
 * Function looks up `unlim_sessions` row by id, returns cached `description_unlim`
 * if present, else generates via Gemini Flash-Lite + caches.
 *
 * Returns null on any failure (offline / 401 / 404 / 5xx / missing session_id)
 * — caller falls back to local summary.
 */
async function fetchDescriptionAI(session) {
  if (!SUPABASE_URL || !SUPABASE_ANON || !session) return null;
  // Edge Function requires server-side session_id (UUID stored in `unlim_sessions`).
  // Local-only sessions (never synced) won't match — skip fetch.
  const sessionId = typeof session.id === 'string' ? session.id.trim() : '';
  if (!sessionId || !/^[0-9a-f-]{8,}$/i.test(sessionId)) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/unlim-session-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON}`,
        'X-Elab-Client': 'home-cronologia',
      },
      body: JSON.stringify({ session_id: sessionId }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.success && typeof data?.description === 'string' && data.description.trim()) {
      return data.description.trim().slice(0, 200);
    }
    return null;
  } catch {
    return null;
  }
}

function HomeRow({ session, onResume }) {
  const [hover, setHover] = useState(false);
  const [aiDescription, setAiDescription] = useState(session?.description_unlim || null);
  const [fetching, setFetching] = useState(false);
  const fetchedRef = useRef(false);

  const handle = useCallback(() => {
    if (typeof onResume === 'function' && session?.experimentId) {
      onResume(session.experimentId);
    }
  }, [onResume, session]);

  // On mount: if no cached description AND we have message history, fetch AI brief.
  useEffect(() => {
    if (fetchedRef.current) return;
    if (aiDescription) return;
    const hasMessages = Array.isArray(session?.messages) && session.messages.length > 0;
    if (!hasMessages) return;
    if (!SUPABASE_URL || !SUPABASE_ANON) return;
    fetchedRef.current = true;
    let cancelled = false;
    setFetching(true);
    fetchDescriptionAI(session).then((desc) => {
      if (cancelled) return;
      setFetching(false);
      if (desc) {
        setAiDescription(desc);
        persistDescription(session.id || session.experimentId, desc);
      }
    });
    return () => { cancelled = true; };
  }, [aiDescription, session]);

  const ts = session?.endTime || session?.startTime || session?.startedAt;
  const title = session?.title || session?.experimentId || 'Sessione';
  const modalita = session?.modalita || session?.mode || 'percorso';
  const description = aiDescription || localFallbackSummary(session);

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
        {fetching && !aiDescription ? (
          <p style={styles.descriptionLoading} data-testid="cronologia-desc-loading">
            UNLIM riepiloga la sessione…
          </p>
        ) : (
          <p style={styles.description} data-testid="cronologia-desc">{description}</p>
        )}
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
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (ev) => {
      if (ev?.key && ev.key !== SESSIONS_KEY) return;
      setSessions(loadLocalSessions());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleResume = useCallback((experimentId) => {
    if (!experimentId) return;
    try {
      localStorage.setItem('elab_resume_experiment', experimentId);
    } catch { /* best effort */ }
    if (typeof onResume === 'function') {
      onResume('lavagna');
    } else if (typeof window !== 'undefined') {
      window.location.hash = '#lavagna?exp=' + encodeURIComponent(experimentId);
    }
  }, [onResume]);

  // Filter sessions by query (title + description + experimentId)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions.slice(0, MAX_ITEMS);
    return sessions
      .filter((s) => {
        const haystack = [
          s.title,
          s.experimentId,
          s.description_unlim,
          s.modalita || s.mode,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, MAX_ITEMS);
  }, [sessions, query]);

  const buckets = useMemo(() => bucketByDate(filtered), [filtered]);

  return (
    <section style={styles.section} aria-labelledby="cronologia-heading" data-testid="home-cronologia">
      <div style={styles.headerRow}>
        <h2 id="cronologia-heading" style={styles.heading}>Cronologia recente</h2>
        <div style={styles.searchWrap}>
          <svg
            style={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={PALETTE.textMuted}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca tra le sessioni…"
            aria-label="Cerca tra le sessioni passate"
            style={styles.searchInput}
            data-testid="cronologia-search"
          />
        </div>
      </div>

      {sessions.length === 0 ? (
        <div style={styles.empty}>
          Nessuna sessione salvata ancora — le lezioni completate compariranno qui<br/>
          con un breve riassunto di UNLIM così potete riprenderle facilmente.
        </div>
      ) : buckets.length === 0 ? (
        <div style={styles.empty} data-testid="cronologia-no-match">
          Nessun risultato per &ldquo;{query}&rdquo;. Provate con un&apos;altra parola chiave.
        </div>
      ) : (
        buckets.map((bucket) => (
          <div key={bucket.label} style={styles.bucket} data-testid={`cronologia-bucket-${bucket.label}`}>
            <h3 style={styles.bucketLabel}>{bucket.label}</h3>
            <ul style={styles.list}>
              {bucket.items.map((s) => (
                <HomeRow
                  key={s.id || `${s.experimentId}-${s.startTime || s.startedAt || ''}`}
                  session={s}
                  onResume={handleResume}
                />
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
