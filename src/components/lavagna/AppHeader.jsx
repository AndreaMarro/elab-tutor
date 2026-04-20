import React from 'react';
import css from './AppHeader.module.css';

export default function AppHeader({
  experimentName = 'Scegli un esperimento...',
  totalSteps = 0,
  currentStep = 0,
  onPickerOpen,
  onVideoToggle,
  videoOpen = false,
  onVolumeToggle,
  volumeOpen = false,
  onPercorsoToggle,
  percorsoOpen = false,
  onFumettoOpen,
  activeTab = 'lavagna',
  onTabChange,
  showClasseTab = false,
  showProgressiTab = false,
  showLezioneTab = false,
}) {
  return (
    <header className={css.header} role="banner">
      {/* Left: brand + tabs */}
      <div className={css.left}>
        <div className={css.brand}>
          <img
            src="/assets/mascot/logo-senza-sfondo.png"
            alt="ELAB"
            className={css.brandLogo}
            width="28"
            height="28"
          />
          <span className={css.brandText}>ELAB</span>
        </div>
        {(showClasseTab || showProgressiTab || showLezioneTab) && (
          <div className={css.tabs}>
            <button
              className={`${css.tabBtn} ${activeTab === 'lavagna' ? css.tabBtnActive : ''}`}
              onClick={() => onTabChange?.('lavagna')}
              aria-label="Lavagna"
            >Lavagna</button>
            {showLezioneTab && (
              <button
                className={`${css.tabBtn} ${activeTab === 'lezione' ? css.tabBtnActive : ''}`}
                onClick={() => onTabChange?.('lezione')}
                aria-label="Lezione Guidata"
              >Lezione Guidata</button>
            )}
            {showClasseTab && (
              <button
                className={`${css.tabBtn} ${activeTab === 'classe' ? css.tabBtnActive : ''}`}
                onClick={() => onTabChange?.('classe')}
                aria-label="Dashboard classe"
              >Classe</button>
            )}
            {showProgressiTab && (
              <button
                className={`${css.tabBtn} ${activeTab === 'progressi' ? css.tabBtnActive : ''}`}
                onClick={() => onTabChange?.('progressi')}
                aria-label="I miei progressi"
              >Progressi</button>
            )}
          </div>
        )}
      </div>

      {/* Center: experiment name + progress */}
      <div className={css.center}>
        <span
          className={css.experimentName}
          onClick={onPickerOpen}
          role="button"
          tabIndex={0}
          aria-label={`Esperimento: ${experimentName}. Clicca per cambiare.`}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPickerOpen?.(); } }}
        >
          {experimentName.replace(/^Cap\.\s*\d+\s*Esp\.\s*\d+\s*-\s*/i, '')}
        </span>
        {totalSteps > 0 && (
          <div className={css.progressDots} aria-label={`Passo ${currentStep} di ${totalSteps}`}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`${css.dot} ${i < currentStep ? css.dotCompleted : ''} ${i === currentStep ? css.dotCurrent : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Volume + Video */}
      <div className={css.right}>
        {/* Percorso button removed — now accessed via build mode selector (Percorso = ex Libero) */}
        {onVolumeToggle && (
          <button
            className={`${css.btn} ${css.btnLabeled} ${volumeOpen ? css.btnActive : ''}`}
            onClick={onVolumeToggle}
            aria-label={volumeOpen ? 'Chiudi manuale' : 'Apri manuale'}
            aria-pressed={volumeOpen}
            title="Apri il manuale del volume"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 3c0-1 1-2 2-2h8c1 0 2 1 2 2v14c0 1-1 2-2 2H6c-1 0-2-1-2-2V3z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 7h4M8 10h4M8 13h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className={css.btnText}>Manuale</span>
          </button>
        )}
        {onVideoToggle && (
          <button
            className={`${css.btn} ${videoOpen ? css.btnActive : ''}`}
            onClick={onVideoToggle}
            aria-label={videoOpen ? 'Chiudi video' : 'Apri video'}
            aria-pressed={videoOpen}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 8l4-2v8l-4-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span>Video</span>
          </button>
        )}
        {onFumettoOpen && (
          <button
            className={`${css.btn} ${css.btnLabeled}`}
            onClick={onFumettoOpen}
            aria-label="Apri Fumetto Report della sessione"
            title="Genera Fumetto Report"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="11" y="3" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="2" y="11" width="16" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className={css.btnText}>Fumetto</span>
          </button>
        )}
      </div>
    </header>
  );
}
