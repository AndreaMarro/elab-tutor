// ============================================
// ELAB Tutor - Showcase Page → Redirect to Netlify Vetrina
// La vetrina premium è ora servita come HTML statico su Netlify
// Andrea Marro — 25/02/2026
// ============================================

import { useEffect } from 'react';

export default function ShowcasePage() {
  useEffect(() => {
    window.location.replace('https://funny-pika-3d1029.netlify.app/vetrina.html');
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif',
      color: '#374151',
    }}>
      <p>Reindirizzamento alla vetrina…</p>
    </div>
  );
}
