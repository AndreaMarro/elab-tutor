# HANDOFF G27 → G28

**Data**: 29/03/2026
**Stato**: Build passa (23.9s), 937/937 test (+11 nuovi), NON DEPLOYATO (deploy manuale)
**Sessione completata**: G27 "GDPR + COMPLIANCE"

## Cosa è stato fatto in G27

### Task 1: DPIA (Data Protection Impact Assessment)
- **Output**: `docs/gdpr/DPIA.md` — documento completo in italiano, tono formale/legale
- 9 sezioni: descrizione trattamento, necessità/proporzionalità, dati trattati, flussi dati, valutazione rischi, misure di sicurezza implementate (16 misure con riferimenti al codice), gap analysis (12 item con priorità e deadline), consultazione preventiva, piano d'azione
- Riferimenti: Art. 35 GDPR, Linee Guida EDPB WP248, Provvedimento Garante 467/2018
- Titolare: Andrea Marro / ELAB STEM, partner Omaric Elettronica S.r.l.
- 14 chiavi localStorage + 5 sessionStorage documentate dal codice reale
- 10 rischi valutati con matrice probabilità×impatto, tutti sotto "Critico"

### Task 2: Flussi dati
- **Output**: `docs/gdpr/data-flows.md` — 738 righe
- 6 diagrammi Mermaid validati (tutti `valid: true` via MCP)
- Flussi documentati: AI Chat (5 livelli fallback), Analytics (9 eventi), Autenticazione, Student Tracking, GDPR, Compilazione
- Storage Map: 30+ chiavi localStorage, 14+ chiavi sessionStorage
- Ogni flusso con tabella: dato, origine, destinazione, persistenza, crittografia, retention

### Task 3: Valutazione provider AI EU
- **Output**: `docs/gdpr/provider-evaluation.md` — 529 righe
- Confronto dettagliato: Anthropic (Claude), Google (Gemini), Mistral AI, Ollama (locale)
- **Raccomandazione**: Ollama locale (default) → Mistral EU (cloud fallback) → Anthropic (ultimo resort)
- Mistral emerge come miglior opzione EU: server Svezia/Irlanda, DPA disponibile, ISO 27001/27701, SOC 2 Type II, costo 10-50x inferiore
- Azione immediata: migrare Nanobot da Render (US) a server EU
- EU AI Act: ELAB Tutor = "rischio limitato" (non high-risk), ma scoring studenti attiverebbe Annex III

### Task 4: Consenso minori Art. 8 GDPR
- **Output**: `ConsentBanner.jsx` esteso con workflow consenso minori
- Flusso a fasi: `age` → `consent` (≥14) o `parental` (<14) → `sent`
- **Soglia italiana 14 anni** (D.Lgs. 101/2018, Art. 2-quinquies) — era 16, corretto
- Age gate: dropdown "Quanti anni hai?" con opzioni 8-17 + 18+
- Under 14: input email genitore, chiamata `requestParentalConsent()`, modalità limitata
- Nuovi stili in `ConsentBanner.module.css` con supporto LIM
- **11 nuovi test** in `tests/unit/consent-minori.test.jsx`
- ConsentBanner: 0 inline styles (tutto CSS module)

### Task 5: Privacy Policy aggiornata
- **Output**: `PrivacyPolicy.jsx` aggiornato a v3.0 (29/03/2026)
- ZERO placeholder — tutti i dati reali inseriti:
  - Titolare: Andrea Marro / ELAB STEM / Omaric Elettronica S.r.l.
  - DPO: Andrea Marro (privacy@elab-stem.com)
  - 7 provider reali: Vercel, Anthropic, Google/Gemini, Hostinger, Render, Arduino, Ollama
  - 8 chiavi localStorage/sessionStorage con nomi reali dal codice
  - 9 tipi di eventi analytics reali
  - Retention: localStorage (persistente), server (730 giorni), analytics (1 anno)
- Route `/privacy` funzionante (pathname-based routing in App.jsx:131)

## Chain of Verification — Risultati

### CoV Pass 1: Post-implementazione
- `npm run build` — PASSA (23.9s)
- `npx vitest run` — **937/937 test** (18 file), 0 regressioni
- Delta test: 926 (G26) → 937 (G27) = +11 test consenso minori

### CoV Pass 2: Cross-verification
- DPIA.md: 29 riferimenti a chiavi localStorage/sessionStorage reali dal codice — verificato con grep
- data-flows.md: 6 diagrammi Mermaid validati — tutti `valid: true`
- provider-evaluation.md: provider citati corrispondono a quelli reali in api.js (NANOBOT_URL, CHAT_WEBHOOK, LOCAL_SERVER) — verificato con grep
- PrivacyPolicy.jsx: elenca tutti e 7 i provider trovati in provider-evaluation.md — verificato
- ConsentBanner.jsx: salva effettivamente il consenso via `saveConsent()` e `requestParentalConsent()` — verificato nel codice
- ZERO placeholder/TODO/lorem ipsum in tutti i documenti GDPR — verificato con grep
- Esperimenti: 38 (vol1) + 18 (vol2) + vol3 — file esperimenti NON toccati, nessuna regressione possibile

### CoV Pass 3: Audit browser
- Privacy Policy su `/privacy` — rendering corretto, v3.0, dati reali visibili
- ConsentBanner — age gate visibile con dropdown e "Avanti"
- `preview_console_logs level=error` — **0 errori**
- Inline CSS nei file GDPR: ConsentBanner 0, PrivacyPolicy 1 (pattern pre-esistente), DataDeletion 2 (non toccato)

## Score composito aggiornato
- Build: 10/10 (passa)
- Test: 10/10 (937/937)
- UNLIM affidabilità: 7/10 (G25)
- Touch targets: 9/10 (PIN 16px, touch 20px)
- Progressive disclosure: 9/10
- CSS: 6/10 (invariato da G26)
- **GDPR: 6/10** (era 1/10 — DPIA, data flows, provider eval, consenso minori, privacy policy)
- Teacher Dashboard: 0/10 (zero)
- **COMPOSITO: ~7.3/10** (era 6.8)

## Gap GDPR rimanenti (per G28+)
1. DataDeletion.jsx: migrare inline styles → CSS module
2. DPA firmati con Anthropic, Render, Vercel (azione legale, non codice)
3. Crittografia localStorage (AES-GCM per dati sensibili)
4. Audit log server-side per accesso ai dati
5. Verifica consenso parentale robusta (non solo email click)
6. Migrazione Nanobot da Render (US) a server EU
7. Integrazione Mistral AI come fallback EU nella catena AI

## Prossima sessione G28 — TEACHER DASHBOARD
1. Dashboard docente con panoramica classe
2. Progresso studenti per esperimento/volume
3. Report attività aggregati
4. Gestione classi (join/leave)

## File modificati in G27
- `src/components/common/ConsentBanner.jsx` — age gate + parental consent workflow
- `src/components/common/ConsentBanner.module.css` — nuovi stili per age gate e parental flow
- `src/components/common/PrivacyPolicy.jsx` — v3.0, dati reali, 7 provider
- `tests/unit/consent-minori.test.jsx` — NEW: 11 test consenso minori
- `docs/gdpr/DPIA.md` — NEW: DPIA completa
- `docs/gdpr/data-flows.md` — NEW: flussi dati con 6 diagrammi Mermaid
- `docs/gdpr/provider-evaluation.md` — NEW: valutazione provider AI EU
- `automa/handoff.md` — questo file
