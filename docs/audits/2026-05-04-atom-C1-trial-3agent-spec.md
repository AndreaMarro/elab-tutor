# ATOM-C1 spec — Lavagna libero truly free (Three-Agent Pipeline trial atom complex iter 34 carryover)

**Data**: 2026-05-04 ~09:30 GMT+2
**Branch**: e2e-bypass-preview HEAD `c376608`
**Atom**: C1 Lavagna libero truly free (Andrea iter 21+ mandate)
**Trial purpose**: validate Three-Agent Pipeline su atom complex (anti-bias evidence emerge >atom small)

## §1 Root cause analysis

**Andrea iter 21+ feedback**: "lavagna libera senza circuito", "premo Libera e circuito rimane", "modalità libero non funziona davvero free".

**Multi-iter saga prior fix attempts**:
- iter 34 P0 fix LavagnaShell.jsx:638-645 — `handleModalitaChange('libero')` setta currentExperiment=null + clearAll + removes `elab-lavagna-exp-id`
- iter 35 P1 fix mantenuto handler stesso

**Persistent bug root cause** (file:line evidence):

`LavagnaShell.jsx:643` rimuove key `elab-lavagna-exp-id` MA:
- `LavagnaShell.jsx:860` (handleMenuOpen Esci) salva key DIVERSA `elab-lavagna-last-expId`
- `LavagnaShell.jsx:682-684` useEffect entrata Lavagna ricarica `savedExpId` da `elab-lavagna-last-expId` (key non-pulita)
- Risultato: ciclo Esci→riapri→Libero NON pulisce `last-expId` → useEffect re-mount esperimento residuo

**Plus secondary bug**: useEffect line 683 NON ha guard per `modalita === 'libero'`. Se user entra in Lavagna in modalità Libero (default cookie-saved), savedExpId viene caricato comunque → re-mount esperimento immediato.

## §2 Behavior change spec

**File target**: `src/components/lavagna/LavagnaShell.jsx`

**Edit 1** — `handleModalitaChange` libero block (line 638-645):
- Rimuovi ANCHE `elab-lavagna-last-expId` localStorage key
- Aggiungi sentinel `elab-lavagna-libero-active` true (block re-mount in useEffect)

**Edit 2** — useEffect savedExpId auto-load block (line 682-684):
- Aggiungi guard `if (modalita === 'libero')` → skip auto-load
- Aggiungi guard `if (localStorage.getItem('elab-lavagna-libero-active') === 'true')` → skip auto-load

**Edit 3** — `handleMenuOpen` Esci block (line 851-865):
- Aggiungi clear sentinel `localStorage.removeItem('elab-lavagna-libero-active')` quando user torna home

## §3 Acceptance criteria

1. **Vitest baseline 13774 preserved** (zero regression src/test paths)
2. **Smoke manual prod** (Andrea Tier 1 macOS Computer Use):
   - Apri Lavagna → modalità Libero → canvas blank ✓
   - Carica esperimento (es. v1-cap6-esp1) → componenti mounted ✓
   - Click Libero → currentExperiment=null + canvas blank ✓
   - Click Esci → torna home
   - Riapri Lavagna → modalità Libero attiva → canvas blank (NO re-mount esperimento residuo) ✓
3. **Telemetry localStorage state**: `elab-lavagna-libero-active === 'true'` quando libero attivo, removed quando Esci o cambio modalità ≠ libero
4. **Anti-pattern G45**: NO behavior change quando modalità ≠ libero (zero regression default modes)

## §4 PRINCIPIO ZERO + Morfismo invariants

- ✅ Plurale "Ragazzi" preservato (no UI text change)
- ✅ Vol/pag NON impatto (no RAG retrieval change)
- ✅ Kit ELAB physical mention preservato (no BASE_PROMPT change)
- ✅ Morfismo Sense 1.5 docente-adapt: libero modality TRULY free per docente esplorazione canvas vuoto (Sense 1.5 mandate)
- ✅ Sense 2 triplet kit-volumi: libero NON è sostituto kit, è sandbox docente test

## §5 Anti-pattern G45 enforced

- NO --no-verify (pre-commit vitest 13774 preserve)
- NO push diretto su main (e2e-bypass-preview only)
- NO destructive ops
- NO claim "libero LIVE prod" pre-Vercel deploy
- NO claim "Andrea Tier 1 verified" senza Andrea manual smoke verification

## §6 Three-Agent Pipeline workflow §4.3 step 1 plan

- **Step 1 PLAN** (Claude inline): this doc ✓
- **Step 2 IMPLEMENT** (Codex CLI):
  ```bash
  cat docs/audits/2026-05-04-atom-C1-trial-3agent-spec.md | \
    PATH="$HOME/.local/bin:$PATH" codex exec --sandbox=workspace-write --skip-git-repo-check \
    "Read spec doc above. Implement 3 surgical edits in src/components/lavagna/LavagnaShell.jsx ONLY..."
  ```
- **Step 3 REVIEW** (Gemini CLI):
  ```bash
  git diff HEAD | gemini --skip-trust -y -p "Sei reviewer ELAB Tutor. Review diff..."
  ```
- **Step 4 FIX** (Claude inline): apply fix se findings critical
- **Step 5 CoV**: vitest 13774 preserve verify
- **Step 6 AUDIT**: doc execution

## §7 Trial success criteria

- ✅ 6/6 step compliance Three-Agent Pipeline
- ✅ Codex impl matching spec (3 surgical edits LavagnaShell.jsx)
- ✅ Gemini review findings (priority-rated)
- ✅ Vitest 13774 preserved
- ✅ Anti-bias evidence atom complex (>atom small A2b marginal)
- ✅ Wall-clock measured per atom complex
