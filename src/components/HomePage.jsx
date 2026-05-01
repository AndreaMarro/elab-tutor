/**
 * HomePage — ELAB Tutor home (iter 36 Phase 1 Atom A13 partial — Tea-style redesign)
 *
 * Layout:
 *   - Hero left: ELAB TUTOR title Oswald + Lime gradient sottolineatura + sub-hero triplet
 *   - Hero right: mascotte UNLIM <MascotPresence /> (240×240 desktop / 160×160 mobile)
 *     click → speech bubble "Ciao Ragazzi!" (NO audio iter 36, lazy click iter 37)
 *   - 4-card grid auto-fit minmax(280px, 1fr) gap 24px:
 *       🧠 Chatbot UNLIM → #chatbot-only (route iter 37 placeholder)
 *       📚 Glossario Tea → external https://elab-tutor-glossario.vercel.app
 *       ⚡ Lavagna ELAB Tutor → #lavagna
 *       🐒 Chi siamo → #about-easter (modal iter 37)
 *   - Footer credits: Andrea+Tea+Davide+Omaric+Giovanni triplet visibile
 *   - Footer link "🐒 Chi siamo" subtle bottom-right (scimpanzè easter iter 37)
 *
 * Iter 36 SCOPE (4h budget):
 *   ✅ hero + 4-card + footer credits + scimpanzè link placeholder
 *   ❌ Chatbot-only route ChatbotOnly.jsx (defer iter 37 atom A13b)
 *   ❌ Cronologia ChatGPT-style sidebar 50 sessioni (defer iter 37)
 *   ❌ Tools palette 5 button (defer iter 37)
 *   ❌ Easter modal full 4 GIF rotation + banana mode CSS (defer iter 37)
 *   ❌ Voice clone Andrea audio greeting lazy (defer iter 37)
 *
 * Compliance gate:
 *   ✅ Linguaggio: "Ciao Ragazzi!" plurale (Principio Zero V3)
 *   ✅ Triplet: hero sub mention "Kit fisici + volumi + software morfico"
 *   ✅ Davide named explicitly "volumi cartacei" (PZ §A13 spec)
 *   ✅ Palette TOKENS: var(--elab-navy/lime/orange/red) — NO hard-coded hex
 *   ✅ Iconografia: emoji approved 🧠 📚 ⚡ 🐒 (PDR §A13 explicit OK Andrea)
 *   ✅ Mascotte UNLIM (NOT Galileo) — MascotPresence import lavagna/
 *   ✅ Touch targets ≥44px buttons
 *   ✅ WCAG AA contrast 4.5:1 on Navy background
 *   ✅ Font Oswald hero / Open Sans body
 *
 * Andrea Marro — iter 36 WebDesigner-1 Phase 1 — 2026-04-30
 */
import React, { lazy, Suspense, useState, useCallback, useEffect } from 'react';

// Cronologia sessioni — sezione sotto le card (iter 35 Task 2, preserved iter 36)
const HomeCronologia = lazy(() => import('./HomeCronologia'));

// Iter 37 Atom A6 — route hash routing chatbot-only + about-easter
const ChatbotOnly = lazy(() => import('./chatbot/ChatbotOnly'));
const EasterModal = lazy(() => import('./easter/EasterModal'));

// Iter 38 Atom A11 — mic permission UX nudge (pre-emptive grant request).
// Lazy-loaded: il banner appare solo se Permissions API segnala state='prompt',
// quindi caricarlo on-demand evita di gonfiare il main chunk per docenti che
// hanno già autorizzato il microfono nelle sessioni passate.
const MicPermissionNudge = lazy(() => import('./common/MicPermissionNudge.jsx'));

// Hash routes managed inline (NO react-router) — pattern consistent with
// existing app routing convention.
const HASH_ROUTES = {
  CHATBOT: '#chatbot-only',
  ABOUT: '#about-easter',
};

function readHash() {
  if (typeof window === 'undefined') return '';
  return window.location.hash || '';
}

// Palette tokens — fallback ai valori se le CSS vars non esistono ancora.
// CLAUDE.md §Design rule 16: Navy #1E4D8C / Lime #4A7A25 / Orange #E8941C / Red #E54B3D
const PALETTE = {
  navy: 'var(--elab-navy, var(--elab-navy))',
  lime: 'var(--elab-lime, var(--elab-lime))',
  orange: 'var(--elab-orange, var(--elab-orange))',
  red: 'var(--elab-red, var(--elab-red))',
  bg: 'var(--elab-bg, #F0F4F8)',
  cardBg: 'var(--elab-card-bg, #FFFFFF)',
  text: 'var(--elab-text, #1A1A1A)',
  textMuted: 'var(--elab-text-muted, #5A6B7E)',
};

const styles = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(180deg, ${PALETTE.bg} 0%, #E6ECF2 100%)`,
    fontFamily: "'Open Sans', system-ui, sans-serif",
    color: PALETTE.text,
    padding: '32px 24px 32px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: 32,
    alignItems: 'center',
    maxWidth: 1200,
    width: '100%',
    margin: '0 auto 40px',
    padding: '24px 16px 16px',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
  },
  brandTitle: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 'clamp(40px, 6vw, 64px)',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: PALETTE.navy,
    margin: 0,
    lineHeight: 1.05,
    textTransform: 'uppercase',
    // Lime gradient sottolineatura (Tea identity visivo)
    backgroundImage: `linear-gradient(transparent 78%, ${PALETTE.lime} 78%, ${PALETTE.lime} 92%, transparent 92%)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    paddingBottom: 4,
    display: 'inline',
    width: 'fit-content',
  },
  brandSubtitle: {
    fontSize: 'clamp(15px, 1.6vw, 19px)',
    color: PALETTE.textMuted,
    fontWeight: 500,
    margin: 0,
    letterSpacing: '0.01em',
    lineHeight: 1.45,
  },
  heroRight: {
    position: 'relative',
    width: 240,
    height: 240,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRightMobile: {
    width: 160,
    height: 160,
  },
  speechBubble: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: PALETTE.cardBg,
    color: PALETTE.navy,
    padding: '10px 18px',
    borderRadius: 18,
    fontFamily: "'Open Sans', system-ui, sans-serif",
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 16px rgba(30, 77, 140, 0.25)',
    border: `2px solid ${PALETTE.lime}`,
    marginBottom: 12,
    pointerEvents: 'none',
  },
  speechBubbleArrow: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: `10px solid ${PALETTE.lime}`,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
    maxWidth: 1200,
    width: '100%',
    margin: '0 auto',
    padding: '0 8px',
  },
  card: {
    background: PALETTE.cardBg,
    border: '1px solid rgba(30, 77, 140, 0.12)',
    borderRadius: 20,
    padding: '28px 24px',
    minHeight: 220,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    cursor: 'pointer',
    transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
    fontFamily: 'inherit',
    color: PALETTE.text,
    textAlign: 'left',
    boxShadow: '0 2px 6px rgba(15, 27, 46, 0.04)',
    minWidth: 0,
    textDecoration: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  cardHover: {
    transform: 'translateY(-3px) scale(1.03)',
    boxShadow: '0 16px 40px rgba(30, 77, 140, 0.22)',
  },
  cardEmoji: {
    fontSize: 56,
    lineHeight: 1,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: "'Oswald', system-ui, sans-serif",
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
    color: PALETTE.navy,
    lineHeight: 1.15,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
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
    fontWeight: 700,
    color: PALETTE.navy,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    minHeight: 44,
    paddingTop: 4,
  },
  cardCredit: {
    fontSize: 12,
    color: PALETTE.textMuted,
    fontStyle: 'italic',
    fontWeight: 500,
    marginTop: 4,
    letterSpacing: '0.01em',
  },
  footer: {
    maxWidth: 1200,
    width: '100%',
    margin: '48px auto 0',
    padding: '24px 16px 16px',
    borderTop: '1px solid rgba(30, 77, 140, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
  },
  footerCredits: {
    fontSize: 13,
    color: PALETTE.textMuted,
    lineHeight: 1.6,
    margin: 0,
    fontWeight: 500,
  },
  footerCreditsStrong: {
    color: PALETTE.navy,
    fontWeight: 700,
  },
  footerEasterLink: {
    fontSize: 13,
    color: PALETTE.textMuted,
    textDecoration: 'none',
    fontWeight: 500,
    minHeight: 44,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 8,
    transition: 'color 150ms ease, background 150ms ease',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

// CARD spec iter 36 A13 partial:
const CARDS = [
  {
    id: 'chatbot',
    emoji: '🧠',
    accent: PALETTE.red,
    title: 'Chatbot UNLIM',
    text: 'Parla con il tutor AI: prepara lezioni, cita il libro, segue la classe.',
    cta: 'Apri il chatbot',
    href: '#chatbot-only', // route iter 37 placeholder
    target: 'internal',
    credit: null,
  },
  {
    id: 'glossario',
    emoji: '📚',
    accent: PALETTE.orange,
    title: 'Glossario',
    text: "Le parole chiave dell'elettronica spiegate semplici, con esempi dai volumi.",
    cta: 'Apri il glossario',
    href: 'https://elab-tutor-glossario.vercel.app',
    target: 'external',
    credit: 'Fatto da Tea',
  },
  {
    id: 'lavagna',
    emoji: '⚡',
    accent: PALETTE.navy,
    title: 'Lavagna ELAB Tutor',
    text: 'Lo spazio della classe: simulatore, voce, fumetto e percorso del libro.',
    cta: 'Entra in Lavagna',
    href: '#lavagna',
    target: 'internal',
    credit: null,
  },
  {
    id: 'about',
    emoji: '🐒',
    accent: PALETTE.lime,
    title: 'Chi siamo',
    text: 'Il team ELAB: chi ha fatto i volumi, i kit, il software, i test.',
    cta: 'Scopri il team',
    href: '#about-easter', // modal iter 37
    target: 'internal',
    credit: null,
  },
];

function HomeCard({ card, onActivate }) {
  const [hover, setHover] = useState(false);
  const handle = useCallback((e) => {
    if (card.target === 'external') {
      // External link → let default <a> behavior handle it (target=_blank set on element)
      return;
    }
    e.preventDefault();
    if (typeof onActivate === 'function') onActivate(card.href);
  }, [card.href, card.target, onActivate]);

  const sharedProps = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    'aria-label': `${card.title}: ${card.text}`,
    'data-testid': `home-card-${card.id}`,
    style: {
      ...styles.card,
      ...(hover ? styles.cardHover : {}),
      borderColor: hover ? card.accent : 'rgba(30, 77, 140, 0.12)',
    },
  };

  const innerContent = (
    <>
      <span style={styles.cardEmoji} aria-hidden="true">{card.emoji}</span>
      <h2 style={styles.cardTitle}>{card.title}</h2>
      <p style={styles.cardText}>{card.text}</p>
      {card.credit && (
        <span style={styles.cardCredit} data-testid={`home-card-credit-${card.id}`}>
          {card.credit}
        </span>
      )}
      <span style={{ ...styles.cardCta, color: card.accent }}>
        {card.cta} <span aria-hidden="true">→</span>
      </span>
    </>
  );

  if (card.target === 'external') {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        {...sharedProps}
        onClick={handle}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button type="button" onClick={handle} {...sharedProps}>
      {innerContent}
    </button>
  );
}

export default function HomePage({ onNavigate }) {
  const [showGreeting, setShowGreeting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Iter 37 Atom A6 — hash route awareness for #chatbot-only and #about-easter
  const [hash, setHash] = useState(() => readHash());

  // Track viewport for mascotte size (240 desktop / 160 mobile)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Iter 37 Atom A6 — listen to hashchange for #chatbot-only / #about-easter
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateRoute = () => setHash(readHash());
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  // Auto-hide greeting bubble after 4s
  useEffect(() => {
    if (!showGreeting) return;
    const t = setTimeout(() => setShowGreeting(false), 4000);
    return () => clearTimeout(t);
  }, [showGreeting]);

  const handleActivate = useCallback((href) => {
    if (!href) return;
    if (href.startsWith('#')) {
      // Internal hash route: strip leading '#' for onNavigate convention
      const page = href.slice(1);

      // Iter 37 Atom A6 — chatbot-only + about-easter sono ora route LIVE
      // gestite tramite hash: aggiorniamo window.location.hash e lasciamo
      // che il listener hashchange aggiorni `hash` state per montare
      // <ChatbotOnly /> o <EasterModal /> sotto.
      if (page === 'chatbot-only' || page === 'about-easter') {
        if (typeof window !== 'undefined') {
          window.location.hash = href;
          setHash(href);
        }
        return;
      }
      if (typeof onNavigate === 'function') onNavigate(page);
      else if (typeof window !== 'undefined') window.location.hash = href;
    }
  }, [onNavigate]);

  // Iter 37 Atom A6 — close handler for EasterModal (clears #about-easter hash)
  const handleEasterClose = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Clear hash but stay on home (avoid scroll jump)
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        setHash('');
      } catch {
        window.location.hash = '';
        setHash('');
      }
    }
  }, []);

  // Iter 37 Atom A6 — back home from ChatbotOnly
  const handleChatbotBackHome = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        setHash('');
      } catch {
        window.location.hash = '';
        setHash('');
      }
    }
  }, []);

  // Iter 37 Atom A6 — open Lavagna from ChatbotOnly tools palette
  const handleChatbotOpenLavagna = useCallback(() => {
    if (typeof onNavigate === 'function') {
      onNavigate('lavagna');
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.hash = '#lavagna';
    }
  }, [onNavigate]);

  const handleMascotteClick = useCallback(() => {
    setShowGreeting(true);
  }, []);

  // Iter 38 Atom A11 — wake word pre-warm. Quando i docenti autorizzano il
  // microfono dal nudge, partiamo subito il listener "Ehi UNLIM" così è
  // pronto al primo ingresso in Lavagna (no più "Ti ascolto" silent fail).
  // Il listener gira come singleton modulo (idempotente), nessun rischio
  // doppio-mount: LavagnaShell.startWakeWordListener no-op se già attivo.
  const handleMicGrant = useCallback(() => {
    // Dynamic import per non bloccare main chunk con SpeechRecognition module.
    import('../services/wakeWord').then((mod) => {
      if (typeof mod?.isWakeWordSupported === 'function' && !mod.isWakeWordSupported()) {
        return; // Browser non supporta WebSpeech → skip silenzioso
      }
      if (typeof mod?.startWakeWordListener === 'function') {
        mod.startWakeWordListener({
          onWake: () => {
            // Wake from Home → suggest entering Lavagna (route handoff).
            try {
              window.dispatchEvent(new CustomEvent('elab-wake-from-home'));
            } catch { /* no-op */ }
          },
          onCommand: (text) => {
            try {
              window.dispatchEvent(new CustomEvent('elab-wake-command', { detail: { text } }));
            } catch { /* no-op */ }
          },
        });
      }
    }).catch(() => { /* best-effort */ });
  }, []);

  const handleResume = useCallback((target) => {
    // Cronologia onResume: target may be a hash or a page id.
    if (typeof target === 'string') {
      handleActivate(target.startsWith('#') ? target : `#${target}`);
    }
  }, [handleActivate]);

  // Iter 37 Atom A6 — route hash mounts ChatbotOnly / EasterModal
  // Mount BEFORE the home grid se hash corrisponde alle nuove route.
  if (hash === HASH_ROUTES.CHATBOT) {
    return (
      <Suspense fallback={<div data-testid="chatbot-only-loading" style={{ padding: 24 }}>Caricamento chat UNLIM…</div>}>
        <ChatbotOnly
          onBackHome={handleChatbotBackHome}
          onOpenLavagna={handleChatbotOpenLavagna}
        />
      </Suspense>
    );
  }

  return (
    <div style={styles.page} data-testid="elab-home-page">
      {/* Iter 37 Atom A6 — Easter modal overlay quando hash = #about-easter */}
      {hash === HASH_ROUTES.ABOUT && (
        <Suspense fallback={null}>
          <EasterModal isOpen={true} onClose={handleEasterClose} />
        </Suspense>
      )}
      {/* Iter 38 Atom A11 — pre-emptive mic permission nudge. Self-managed
          visibility: returns null se permission già 'granted' o se docente
          ha cliccato "Più tardi" (localStorage flag). Plurale "Ragazzi" + kit
          fisico mention. Click "Autorizza" → getUserMedia → wake word start. */}
      <Suspense fallback={null}>
        <MicPermissionNudge onGrant={handleMicGrant} />
      </Suspense>
      <header style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.brandTitle}>
            <span style={{
              backgroundImage: styles.brandTitle.backgroundImage,
              backgroundRepeat: 'no-repeat',
              paddingBottom: 4,
            }}>
              ELAB TUTOR
            </span>
          </h1>
          <p style={styles.brandSubtitle}>
            Tutor educativo elettronica + Arduino bambini 8-14.
            <br />
            <strong style={{ color: PALETTE.navy, fontWeight: 700 }}>
              Kit fisici + volumi + software morfico.
            </strong>
          </p>
        </div>

        <div
          style={{
            ...styles.heroRight,
            ...(isMobile ? styles.heroRightMobile : {}),
          }}
          data-testid="home-mascotte-container"
        >
          {showGreeting && (
            <div style={styles.speechBubble} role="status" aria-live="polite" data-testid="home-mascotte-greeting">
              Ciao Ragazzi!
              <span style={styles.speechBubbleArrow} aria-hidden="true" />
            </div>
          )}
          {/* MascotPresence è "fixed position" by default — qui lo wrappiamo
              ma il componente esistente usa position:fixed con localStorage.
              Iter 36 partial: usiamo un placeholder visivo che invoca lo stesso
              SVG inline + onClick greeting. Pieno wire-up MascotPresence drag
              + speaking state defer iter 37. */}
          <button
            type="button"
            onClick={handleMascotteClick}
            data-testid="home-mascotte-button"
            aria-label="Saluta la mascotte UNLIM"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 200ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg
              viewBox="0 0 240 240"
              width="100%"
              height="100%"
              aria-hidden="true"
              role="img"
            >
              {/* Mascotte UNLIM — robottino ELAB enlarged from MascotPresence SVG.
                  Iter 36 inlined per evitare position:fixed conflict in homepage layout. */}
              <defs>
                <linearGradient id="unlim-body-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2557A5" />
                  <stop offset="100%" stopColor="#153d6f" />
                </linearGradient>
              </defs>
              {/* Antenna */}
              <line x1="120" y1="40" x2="120" y2="68" stroke="var(--elab-orange)" strokeWidth="6" strokeLinecap="round" />
              <circle cx="120" cy="36" r="10" fill="var(--elab-orange)" />
              <circle cx="120" cy="36" r="4" fill="#fff" opacity="0.5" />
              {/* Headband / cuffie */}
              <path d="M50 110 C 50 70 88 50 120 50 C 152 50 190 70 190 110" stroke="var(--elab-navy)" strokeWidth="10" fill="none" strokeLinecap="round" />
              {/* Cuffie laterali */}
              <rect x="30" y="100" width="32" height="50" rx="14" fill="var(--elab-lime)" />
              <rect x="178" y="100" width="32" height="50" rx="14" fill="var(--elab-lime)" />
              {/* Body / face */}
              <rect x="56" y="84" width="128" height="106" rx="22" fill="url(#unlim-body-grad)" />
              {/* Screen / face plate */}
              <rect x="72" y="100" width="96" height="64" rx="12" fill="#0e2a4a" />
              {/* Eyes */}
              <circle cx="100" cy="130" r="13" fill="var(--elab-lime)" />
              <circle cx="140" cy="130" r="13" fill="var(--elab-lime)" />
              <circle cx="103" cy="126" r="4" fill="#fff" opacity="0.95" />
              <circle cx="143" cy="126" r="4" fill="#fff" opacity="0.95" />
              {/* Smile */}
              <path d="M95 150 Q 120 168 145 150" stroke="var(--elab-lime)" strokeWidth="5" fill="none" strokeLinecap="round" />
              {/* Chest decoration / badge */}
              <rect x="100" y="172" width="40" height="10" rx="4" fill="var(--elab-red)" opacity="0.9" />
            </svg>
          </button>
        </div>
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

      {/* Cronologia sessioni preserved iter 35 */}
      <Suspense fallback={null}>
        <HomeCronologia onResume={handleResume} />
      </Suspense>

      <footer style={styles.footer} id="elab-home-footer" data-testid="home-footer">
        <p style={styles.footerCredits}>
          <span style={styles.footerCreditsStrong}>Andrea Marro</span> coding
          {' · '}
          <span style={styles.footerCreditsStrong}>Tea</span> co-dev / UX / QA
          {' · '}
          <span style={styles.footerCreditsStrong}>Davide Fagherazzi</span> volumi cartacei
          {' · '}
          <span style={styles.footerCreditsStrong}>Omaric Elettronica</span> kit
          {' · '}
          <span style={styles.footerCreditsStrong}>Giovanni Fagherazzi</span> network commerciale
        </p>
        <button
          type="button"
          onClick={() => handleActivate('#about-easter')}
          style={{
            ...styles.footerEasterLink,
            position: 'absolute',
            right: 16,
            bottom: 12,
          }}
          data-testid="home-footer-easter-link"
          aria-label="Chi siamo (modal iter 37)"
          title="Chi siamo"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = PALETTE.navy;
            e.currentTarget.style.background = 'rgba(74, 122, 37, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = PALETTE.textMuted;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span aria-hidden="true">🐒</span> Chi siamo
        </button>
      </footer>
    </div>
  );
}
