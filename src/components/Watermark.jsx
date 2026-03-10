// ============================================
// ELAB - Watermark Globale
// Firma visiva in basso a sinistra di ogni pagina
// © Andrea Marro — 08/02/2026
// Tutti i diritti riservati
// ============================================

import React from 'react';

export default function Watermark() {
    return (
        <div style={styles.container}>
            <span style={styles.text}>© Andrea Marro — {new Date().toLocaleDateString('it-IT')}</span>
        </div>
    );
}

const styles = {
    container: {
        position: 'fixed',
        bottom: 8,
        left: 12,
        zIndex: 9999,
        pointerEvents: 'none',
        userSelect: 'none',
    },
    text: {
        fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: '11px',
        color: '#888888',
        opacity: 0.6,
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
    },
};
