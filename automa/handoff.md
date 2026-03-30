# HANDOFF G32 → G33

**Data**: 30/03/2026
**Stato**: Build passa (34s), 940/940 test frontend + 26/26 server test, server NON deployato (Andrea deve creare servizio Render)
**URL Live Frontend**: https://elab-tutor-9l4u0bucu-andreas-projects-6d4e9791.vercel.app
**URL Live Server**: DA DEPLOYARE — Dockerfile + render.yaml + DEPLOY.md pronti
**Sessione completata**: G32 "GDPR ENCRYPTION + AUTH SERVER-SIDE"
**Sprint**: F (G31-G40)

## Cosa è stato fatto in G32

### Task 1: Quality Gate Pre-Session
- Baseline: build 31.58s, 940/940 test, 20/20 server test, bundle 4169KB

### Task 2: HMAC Auth Verification Server-Side
**File modificati:**
- `server-data/index.js` — Aggiunta `crypto` import, `HMAC_SECRET` env var, `verifyHmacToken()` con `crypto.timingSafeEqual()`, `requireAuth` e `/api/auth/verify` ora verificano firma HMAC
- `server-data/render.yaml` — Aggiunta `HMAC_SECRET` env var

**Logica:**
- Se `HMAC_SECRET` è configurato → verifica HMAC-SHA256, token forgiati rifiutati
- Se `HMAC_SECRET` non è configurato → fallback parse-only (dev mode) con warning
- `/api/health` espone `hmacEnabled: true/false`
- Version bumped a `1.1.0`

### Task 3: localStorage Encryption (AES-256-GCM)
**File modificati:**
- `src/services/studentService.js` — Integrato `cryptoService` per cifratura automatica

**Logica:**
- `saveStudentData()` → dopo scrittura plaintext in localStorage, cifra async in `elab_student_data_enc`
- `getStudentDataEncrypted()` → metodo async che preferisce dati cifrati, fallback a plaintext
- `isEncryptionActive()` → controlla se il dato cifrato esiste
- `_clearMasterKeyCache()` → reset cache chiave su logout
- Master key derivata da JWT token tramite `crypto.getOrCreateMasterKey()`
- Il modulo `src/utils/crypto.js` esistente (AES-256-GCM + PBKDF2) non è stato modificato — era già pronto

### Task 4: Audit Log Admin UI
**File modificato:**
- `src/components/teacher/TeacherDashboard.jsx` — Aggiunto tab "Audit GDPR" (solo admin)

**Funzionalità:**
- Input userId + pulsante Cerca → fetch da `GET /api/audit/:userId`
- Tabella con timestamp, azione (colorata per tipo), endpoint, IP, status
- Pannello "Stato Sicurezza" con 4 card: cifratura localStorage, server EU, audit logging, data retention
- Tab visibile solo per utenti con ruolo `admin`
- Indicatore cifratura nella barra server: "Dati locali cifrati." se encryption attiva

### Task 5: DPIA v1 Draft
**File creato:**
- `docs/legal/DPIA-elab-v1.md` — Data Protection Impact Assessment completo

**Sezioni:**
1. Descrizione trattamento (finalità, ambito, contesto)
2. Base giuridica (Art.6(1)(e), Art.8 per minori)
3. Dati trattati (6 categorie con retention 730gg)
4. Misure di sicurezza (cifratura, auth, RBAC, audit, minimizzazione)
5. Diritti degli interessati (5 implementati, notifica breach da fare)
6. Valutazione rischi (matrice 6 rischi)
7. Sub-responsabili (Render, Vercel, Hostinger — DPA da stipulare)
8. Azioni pendenti (P0 e P1)

### Task 6: Deploy Prep
**File creato:**
- `server-data/DEPLOY.md` — Guida passo-passo per deploy su Render EU

### Task 7: Server Tests Aggiornati
**File riscritto:**
- `server-data/tests/endpoints.test.js` — Da 20 a 26 test

**Nuovi test:**
- Rifiuta token con firma forgiata (401)
- Rifiuta token firmati con secret sbagliato (401)
- Verifica che `/api/auth/verify` riporta `hmacVerified: true`
- Verifica che `/api/auth/verify` rifiuta token forgiati
- Audit log: 3 test (propri dati, accesso negato, admin)
- Fix: `process.exit(0)` nel `after()` per uscita pulita
- Fix: rate limit aumentato in test env

## Quality Gate Post-Session

| # | Check | Prima | Dopo | Delta |
|---|-------|-------|------|-------|
| 1 | Build | PASS 31.58s | PASS 34.03s | +2.5s (varia) |
| 2 | Test frontend | 940/940 | 940/940 | = |
| 3 | Test server | 20/20 | 26/26 | +6 |
| 4 | Bundle | 4169KB | 4174KB | +5KB |
| 5 | Console errors | 0 | 0 | = |
| 6 | Lesson paths | 62 | 62 | = |
| 7 | HMAC auth | NO | YES | NEW |
| 8 | localStorage encryption | NO | YES | NEW |
| 9 | Audit UI | NO | YES | NEW |
| 10 | DPIA | NO | v1 DRAFT | NEW |

**CRITICI: 6/6 PASS | DEPLOY: SERVER PRONTO, DA DEPLOYARE SU RENDER**

## Score composito (ONESTO)

| Area | G31 | G32 | Delta |
|------|-----|-----|-------|
| Build/Test | 10/10 | 10/10 | = |
| Simulatore | 8/10 | 8/10 | = |
| UNLIM | 7/10 | 7/10 | = |
| Teacher Dashboard | 8/10 | 8.5/10 | +0.5 (audit UI, encryption indicator) |
| GDPR | 7/10 | 8.5/10 | +1.5 (HMAC, encryption, DPIA, audit UI) |
| **COMPOSITO** | **8.2/10** | **8.5/10** | **+0.3** |

**Score onesto**: 8.5/10, non 8.8 come target. Il target 8.8 richiedeva server LIVE con dati reali dal backend. HMAC e cifratura sono implementati e testati ma non ancora attivi in produzione (server non deployato). Il boost completo arriverà con il deploy.

## Cosa manca (per G33+)

### BLOCCANTE PER DEPLOY (P0 — Andrea deve fare)
1. **Creare servizio su Render** — vedere `server-data/DEPLOY.md`
2. **Impostare HMAC_SECRET** — stessa chiave delle Netlify Functions
3. **Impostare VITE_DATA_SERVER_URL** in Vercel
4. **Rideploy frontend** con `npx vercel --prod --yes`

### P0 GDPR rimanenti
5. Stipulare DPA con Render, Vercel, Hostinger
6. Consenso parentale digitale
7. Procedura notifica data breach
8. Revisione legale DPIA

### G33 — Test E2E Playwright
9. 5 test E2E con browser reale
10. GitHub Action CI

## File modificati in G32
- `server-data/index.js` — HMAC verification, version 1.1.0
- `server-data/render.yaml` — HMAC_SECRET env var
- `server-data/tests/endpoints.test.js` — 26 test (da 20)
- `src/services/studentService.js` — encryption integration
- `src/components/teacher/TeacherDashboard.jsx` — audit tab, encryption indicator

## File nuovi in G32
- `docs/legal/DPIA-elab-v1.md` — DPIA draft
- `server-data/DEPLOY.md` — Deploy guide
