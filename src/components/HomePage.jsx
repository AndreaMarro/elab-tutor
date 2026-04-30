/**
 * HomePage — ELAB Tutor home (iter 35 P0)
 * Replica della homepage standalone Tea (https://elab-tutor-glossario.vercel.app)
 * portata nell'app principale: Hero "ELAB TUTOR" + 5 card (Glossario,
 * Lavagna, Manuale, UNLIM, Chi siamo).
 *
 * Principio Zero: card descrittive, no comandi al docente.
 * Touch target ≥44px tutte card. Palette ELAB Navy/Lime/Orange/Red.
 * Responsive LIM 1080p + iPad + PC.
 *
 * Andrea Marro — 30/04/2026
 */
import React, { lazy, Suspense, useState, useCallback } from 'react';

// Cronologia sessioni — sezione sotto le card (iter 35 Task 2)
const HomeCronologia = lazy(() => import('./HomeCronologia'));

const PALETTE = {
  navy: '#1E4D8C',
  lime: '#4A7A25',
  orange: '#E8941C',
  red: '#E54B3D',
  bg: '#F0F4F8',
  cardBg: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#5A6B7E',
};

const styles = {
  page: {
    minHeight: '100vh',
    minHeight: '100dvh',
    background: `linear-gradient(180deg, ${PALETTE.bg} 0%, #E6ECF2 100%)`,
    fontFamily: "'Open Sans', system-ui, sans-serif",
    color: PALETTE.text,
    padding: '32px 24px 48px',
    boxSizing: 'border-box',
  },
  hero: {
    textAlign: 'center',
    maxWidth: 980,
    margin: '0 auto 40px',
    padding: '32px 16px',
  },
  brandTitle: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: PALETTE.navy,
    margin: 0,
    lineHeight: 1.05,
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    fontSize: 'clamp(16px, 2vw, 20px)',
    color: PALETTE.textMuted,
    fontWeight: 500,
    marginTop: 12,
    letterSpacing: '0.02em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
    maxWidth: 1200,
    margin: '0 auto',
  },
  card: {
    background: PALETTE.cardBg,
    border: `1px solid rgba(30, 77, 140, 0.12)`,
    borderRadius: 20,
    padding: '28px 24px',
    minHeight: 220,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    cursor: 'pointer',
    transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
    fontFamily: 'inherit',
    color: PALETTE.text,
    textAlign: 'left',
    boxShadow: '0 2px 6px rgba(15, 27, 46, 0.04)',
    minWidth: 0,
  },
  cardHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 32px rgba(30, 77, 140, 0.18)',
  },
  cardIcon: {
    width: 56,
    height: 56,
    minWidth: 56,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontWeight: 700,
    color: '#fff',
  },
  cardTitle: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
    color: PALETTE.navy,
    lineHeight: 1.15,
  },
  cardTitleHighlight: {
    // sottolineatura gialla SOLO Glossario (identità visiva Tea)
    backgroundImage: `linear-gradient(transparent 65%, ${PALETTE.orange}55 65%)`,
    backgroundRepeat: 'no-repeat',
    paddingBottom: 2,
  },
  cardText: {
    fontSize: 15,
    color: PALETTE.textMuted,
    lineHeight: 1.5,
    margin: 0,
    flexGrow: 1,
  },
  cardCta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    color: PALETTE.navy,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    minHeight: 44,
  },
  badgeSoon: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: 'rgba(232, 148, 28, 0.18)',
    color: '#A06108',
    padding: '4px 10px',
    borderRadius: 999,
  },
};

const CARDS = [
  {
    id: 'glossario',
    icon: 'G',
    color: PALETTE.orange,
    title: 'Glossario',
    text: 'Parole chiave dell\'elettronica spiegate semplici, con esempi dai volumi.',
    cta: 'Apri il glossario',
    // glossario standalone non ancora portato in main app: apre Lavagna con
    // tab Manuale per ora (legato a volumi sfogliabili).
    page: 'lavagna',
    highlight: true,
  },
  {
    id: 'lavagna',
    icon: 'L',
    color: PALETTE.navy,
    title: 'Lavagna',
    text: 'Lo spazio della classe: simulatore, voce, fumetto e percorso del libro.',
    cta: 'Entra in Lavagna',
    page: 'lavagna',
  },
  {
    id: 'manuale',
    icon: 'M',
    color: PALETTE.lime,
    title: 'Manuale',
    text: 'I tre volumi ELAB sfogliabili, capitolo per capitolo, con riferimenti diretti.',
    cta: 'Apri il manuale',
    // Apre Lavagna con il VolumeViewer pronto (toggle nel header)
    page: 'lavagna',
  },
  {
    id: 'unlim',
    icon: 'U',
    color: PALETTE.red,
    title: 'UNLIM',
    text: 'Il tutor AI che prepara la lezione, cita il libro e segue ogni classe.',
    cta: 'Scopri UNLIM',
    page: 'lavagna',
  },
  {
    id: 'chi-siamo',
    icon: 'C',
    color: PALETTE.textMuted,
    title: 'Chi siamo',
    text: 'Il team ELAB: Andrea, Davide, Giovanni, Tea, Omaric.',
    cta: 'Prossimamente',
    page: null,
    soon: true,
  },
];

function HomeCard({ card, onActivate }) {
  const [hover, setHover] = useState(false);
  const disabled = card.soon || !card.page;
  const handle = useCallback(() => {
    if (!disabled && typeof onActivate === 'function') onActivate(card.page);
  }, [disabled, card.page, onActivate]);

  return (
    <button
      type="button"
      onClick={handle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      disabled={disabled}
      aria-label={`${card.title}: ${card.text}`}
      data-testid={`home-card-${card.id}`}
      style={{
        ...styles.card,
        ...(hover && !disabled ? styles.cardHover : {}),
        opacity: disabled ? 0.78 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderColor: hover && !disabled ? card.color : styles.card.border,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
        <div style={{ ...styles.cardIcon, background: card.color }} aria-hidden="true">
          {card.icon}
        </div>
        <h2 style={styles.cardTitle}>
          <span style={card.highlight ? styles.cardTitleHighlight : undefined}>{card.title}</span>
        </h2>
      </div>
      <p style={styles.cardText}>{card.text}</p>
      {card.soon ? (
        <span style={styles.badgeSoon}>{card.cta}</span>
      ) : (
        <span style={{ ...styles.cardCta, color: card.color }}>
          {card.cta} <span aria-hidden="true">→</span>
        </span>
      )}
    </button>
  );
}

export default function HomePage({ onNavigate }) {
  const handleActivate = useCallback((page) => {
    if (typeof onNavigate === 'function') {
      onNavigate(page);
    } else if (typeof window !== 'undefined' && page) {
      window.location.hash = '#' + page;
    }
  }, [onNavigate]);

  return (
    <div style={styles.page} data-testid="elab-home-page">
      <header style={styles.hero}>
        <h1 style={styles.brandTitle}>ELAB TUTOR</h1>
        <p style={styles.brandSubtitle}>Impara, sperimenta, scopri.</p>
      </header>

      <section
        style={styles.grid}
        role="region"
        aria-label="Sezioni ELAB Tutor"
        data-testid="home-card-grid"
      >
        {CARDS.map((card) => (
          <HomeCard key={card.id} card={card} onActivate={handleActivate} />
        ))}
      </section>

      <Suspense fallback={null}>
        <HomeCronologia onResume={handleActivate} />
      </Suspense>
    </div>
  );
}
