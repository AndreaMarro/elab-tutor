# Audit Accessibility — Dashboard Docente

**Data**: 19 aprile 2026
**Target**: `src/components/teacher/TeacherDashboard.jsx` (3437 righe)
**Standard di riferimento**: WCAG 2.1 AA, EN 301 549 (pubblica amministrazione italiana).
**Metodologia**: ispezione statica (grep + read). Ispezione dinamica (axe-core, screen reader reale) NON eseguita in questa sessione.

## Riepilogo numerico (CoV-verified via grep)

| Metrica | Valore | Commento |
|---------|--------|----------|
| `aria-label` | 6 occorrenze | Su ~18 button totali → solo ~33% dei button hanno label esplicita. Accettabile WCAG 2.1 4.1.2 SE il testo interno è descrittivo (es. "Classe", "Report"): probabilmente OK ma da verificare caso per caso. |
| `role="…"` | 3 occorrenze (tablist/tab/tabpanel) | Pattern ARIA Tabs usato correttamente (riga 712-729). |
| `aria-live` | 1 occorrenza (paginazione riga 875) | Solo la paginazione notifica cambi; cambi di tab/filtro non annunciati. |
| `aria-hidden` | 1 occorrenza (icona SVG riga 3130) | Buono — icona decorativa esclusa dal tree. |
| `<caption>` | 0 occorrenze | **GAP**: tabelle studenti prive di caption. |
| `tabIndex` | 0 occorrenze esplicite | React gestisce focus nativo sui `<button>`, accettabile. |
| `alt=` su `<img>` | Solo 1 (riga 1256, `alt=""` vuoto per avatar decorativo) | Se altre img esistono, possibili gap. |

## Gap classificati per severità

### 🔴 Critici (bloccano utente screen reader o non-vedente)

1. **Grafici Recharts senza descrizione alternativa**.
   I `<BarChart>` e `<LineChart>` renderizzano SVG senza `role="img"` né `aria-label` riassuntivo.
   Esempio riga 2959 `<charts.LineChart data={trendData}>`: un utente VoiceOver sente solo gli assi X/Y numerici.
   **Fix**: wrapping in `<div role="img" aria-label="Grafico linea: esperimenti completati ultimi 30 giorni">` + `<figcaption>` con descrizione testuale.

2. **Tabella studenti senza `<caption>` né header `<th scope="col">`**.
   Se la tabella usa `<table>` standard (da verificare leggendo riga 1300+), mancano `<caption>` e semantica header.
   **Fix**: aggiungere `<caption>` con descrizione corta ("Lista studenti della classe con stato e progressi") + `<th scope="col">` su ogni header.

### 🟡 Medi (peggiorano UX ma non bloccano)

3. **Cambio tab non annunciato a screen reader**.
   `aria-live` solo su paginazione (riga 875). Cambiando da "Classe" a "Report" nessun annuncio vocale.
   **Fix**: aggiungere `aria-live="polite"` a `tabpanel` o inserire un region announcer separato.

4. **Contrasto colori da verificare**.
   Variabili CSS uso: `--color-text-muted` su `--color-bg` è frequente.
   - `#64748B` (textMuted) su `#F0F4F8` (bg) = contrasto **~3.4:1** (misura analitica, da confermare con axe).
   - WCAG AA richiede 4.5:1 per testi normali, 3:1 per testi grandi (≥18pt).
   - Se il muted è usato per label piccole → **VIOLATO**.
   **Fix**: sostituire `#64748B` con `#475569` (slate-600) che dà ~5.5:1.

5. **Filtri (volume + ricerca) senza `<label>` visibile collegato**.
   Gli `aria-label` ci sono (righe 2176, 2364) ma il PDF legge utilitariamente il label: un utente ipovedente che usa zoom browser 200%+ trae beneficio da label VISIBILE.
   **Fix**: rendere visibile `<label for="filtro-volume">Volume:</label>` invece del solo attributo aria.

### 🟢 Minori (nice-to-have)

6. **Pulsanti icona-only senza testo nascosto `sr-only`**.
   Se esistono icone SVG da sole come pulsanti (navigazione paginazione righe 865/881), hanno `aria-label` → OK. Ma pattern da generalizzare: ogni button icon-only → audit caso per caso.

7. **Focus ring**: non verificato (richiede ispezione CSS).
   Da auditare: `TeacherDashboard.module.css` per `:focus-visible { outline: 2px solid #… }` sui button tab e sui filtri.

8. **Ordine tab logico**: i `tabIndex` sono default 0 → React-React rispetta ordine DOM. A prima vista corretto.

## Cosa NON ho testato (limitazione onesta)

- **Screen reader reale** (VoiceOver macOS, NVDA Windows, TalkBack Android): richiede dispositivo fisico e interazione.
- **axe-core runtime**: richiede vitest+jsdom+axe-playwright o Playwright+axe. Vitest non eseguibile nel mio sandbox attuale (MODULE_NOT_FOUND rollup). Demandato a CI.
- **Contrasto computato pixel per pixel**: stima analitica sopra è corretta in ordine di grandezza ma un pixel-peep con axe potrebbe rilevare casi specifici che sfuggono.
- **Keyboard navigation end-to-end**: Tab/Shift+Tab/Enter/Space attraverso TUTTA la dashboard. Da testare manualmente o via Playwright `page.keyboard.press`.
- **Reduced motion preference**: se ci sono animazioni CSS, vanno disabilitate con `@media (prefers-reduced-motion: reduce)`. Non ispezionato.

## Priorità raccomandate

| Priorità | Fix | Sforzo stimato | Beneficio |
|----------|-----|-----------------|-----------|
| P0 | Gap #1 (Grafici `role="img"`) | 30 min, 2-3 righe per grafico | Screen reader utenti non-vedenti |
| P0 | Gap #2 (Table `<caption>` + `<th scope>`) | 45 min | Screen reader utenti non-vedenti |
| P1 | Gap #4 (Contrasto muted color) | 15 min (un solo CSS var) | Utenti ipovedenti + compliance EN 301 549 |
| P1 | Gap #3 (Aria-live su tab switch) | 20 min | Screen reader UX |
| P2 | Gap #5 (Label visibili filtri) | 30 min, modifica UI | Zoom browser users + Principio Zero |
| P3 | Audit manuale keyboard + VoiceOver | 2-3h, con video screencast | Verifica empirica |

## Prossimo passo

Creare `automa/tasks/pending/ATOM-002-dashboard-a11y-fixes.md` per il Planner della Triade CLI, che lo assegnerà al `generator-app` con scope P0+P1 (~2h totali stimate).

**Guard**: il fix tocca `TeacherDashboard.jsx` (3437 righe critiche). Richiederà mini-burst di CoV: 3 test prima / 3 test dopo per assicurare che il cambio a11y non rompa rendering. Baseline 12056 mantenuta.

---

*Audit preliminare. Per un audit certificato in sede di gara pubblica, commissionare VPAT/ACR da consulente WCAG professionista.*
