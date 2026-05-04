# Iter 35 Comprehensive 11-Problemi Master Plan — Sprint T close

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Risolvere sistematicamente 11 problemi Andrea iter 31+ Sprint T close (UNLIM ebete + Voxtral wake word + Lavagna libera + Homepage refactor + Cronologia + Percorso 2-window + PassoPasso older preferred + Esci scritte + mascotte+Teodora credits + Glossary homepage) seguendo Principio Zero + Morfismo, via workflow multi-provider Three-Agent Pipeline (Plan → Codex impl → Gemini review → Fix → CoV → Audit) per atom.

**Architecture:** 6 atomi sistematizzati ROI-prioritized, ognuno self-contained e testabile autonomously. Phase 1 parallel (ATOM III + I), Phase 2 parallel (IV + II), Phase 3 sequential (V + VI), Phase 4 final review + deploy + Tier 1 verify. Tutti commits + push origin e2e-bypass-preview con pre-commit/pre-push hook NO bypass `--no-verify`. Edge Function deploy LIVE prod + Vercel deploy + alias swap.

**Tech Stack:** React 19 + Vite 7 + Supabase Edge Functions Deno + Mistral La Plateforme + Cloudflare Workers AI + Voyage embeddings + pgvector. Three-Agent Pipeline tools: Codex CLI v0.128.0 (ChatGPT Plus OAuth) + Gemini CLI v0.40.1 (Google Pro OAuth) + Claude inline orchestrator. macOS Computer Use Tier 1 verify granted (Chrome read + Fusion full + Terminale click). claude-mem MCP + Serena MCP + Fusion 360 MCP riconnessi post Andrea restart.

**Pre-condition baseline (verificato 2026-05-04 ~10:00 GMT+2):**
- HEAD `021bdfc` mammoth ESM interop fix (push origin OK)
- Vitest 13774 PASS (file `automa/baseline-tests.txt` lag 13752, sync iter 35 entrance)
- Vercel deploy `dpl_2x4uzAKXpPDUBCXpH1wk6gLX7LRF` (`elab-tutor-mwjfzsvyw`) LIVE www.elabtutor.school
- Edge Function unlim-chat v82+ LIVE (post iter 34 atomi A1+A2+A4+A5 + mammoth deploy)
- 4 env Supabase secrets attivi: `ENABLE_CAP_CONDITIONAL=true` + `ENABLE_L2_CATEGORY_NARROW=true` + `ENABLE_HEDGED_LLM=true` + `ENABLE_HEDGED_PROVIDER_MIX=true`
- claude-mem worker LIVE port 37777
- ~/.mcp.json contiene supabase + claude-mem + fusion (community impl uvx fusion360-mcp-server --mode socket)

---

## File Structure (decomposition lock-in)

| File | Responsibility | Atom |
|------|---------------|------|
| `supabase/functions/_shared/onniscenza-classifier.ts` | capWords lift defaults (chit_chat 30→40, default 60→100, deep 120→200) | I |
| `supabase/functions/_shared/system-prompt.ts` | Anti-pappette guard + paletti soft expansion + ricordo azioni inject | I |
| `supabase/functions/unlim-chat/index.ts` | Wire intent_history persist + recent_intents inject in studentContext | I |
| `supabase/migrations/20260504100000_recent_intents_jsonb.sql` | NEW ALTER TABLE student_progress ADD recent_intents jsonb | I |
| `src/components/HomePage.jsx` | Refactor: rimuove emoji, aggiunge mascotte SVG (già MascotPresence), credits Teodora De Venere, Glossario card, wire HomeCronologia visibile | III |
| `src/components/HomeCronologia.jsx` | Verify rendered + auto-description UNLIM Edge Function `unlim-session-description` wire | III |
| `src/components/lavagna/LavagnaShell.jsx` | Percorso = old Libero + 2 floating windows (LessonContextWindow + ClassContextWindow) + PassoPasso older inline pattern + handleMenuOpen flush all WIP content | IV + V |
| `src/components/lavagna/LessonContextWindow.jsx` | NEW Window 1 floating: lesson context (capitolo + experiment + Vol/pag) | IV |
| `src/components/lavagna/ClassContextWindow.jsx` | NEW Window 2 floating: class context (memoria classe + sessioni precedenti) | IV |
| `src/services/wakeWord.js` | Diagnose mic permission + listener init prod | II |
| `src/components/common/MicPermissionNudge.jsx` | Verify nudge UX flow integration | II |
| `tests/unit/onniscenza-classifier.test.js` | Update tests per new capWords defaults | I |
| `tests/unit/services/wakeWord.test.js` | Add diagnose test cases | II |
| `tests/unit/components/HomePage.test.jsx` | NEW homepage refactor test | III |
| `tests/unit/components/lavagna/LessonContextWindow.test.jsx` | NEW component test | IV |
| `tests/e2e/iter35-percorso-2window.spec.js` | NEW Playwright E2E percorso flow | IV |
| `tests/e2e/iter35-esci-persistence-full.spec.js` | NEW Playwright E2E esci persistence audit (drawing + chat + experiment) | V |

---

## Workflow per atom

```
1. PLAN — Claude inline writes atom spec doc → docs/audits/2026-05-04-atom-XXX-spec.md
2. IMPLEMENT — codex exec --sandbox workspace-write "implement spec"  → diff src/+supabase/+tests/
3. REVIEW — gemini -p "review diff per Principio Zero + Morfismo + edge cases"  → findings priority-rated
4. FIX — Claude inline applies CRITICAL/HIGH findings (defensive try/catch + race conditions + accessibility)
5. CoV — npx vitest run (preserve 13774+) + npx playwright test (NEW E2E spec) + R5/R7 bench post-deploy ENV-gated
6. AUDIT — docs/audits/2026-05-04-atom-XXX-execution.md (8-10 caveat onesti minimum + score impact)
7. COMMIT — pre-commit hook vitest baseline ≥13774 enforced
8. PUSH origin e2e-bypass-preview (pre-push hook NO --no-verify)
```

Phase 4 final: comprehensive-review:full-review skill on cumulative diff + Vercel deploy + Tier 1 macOS Computer Use verify prod.

---

## ATOM III: Homepage Refactor (Problems 4 + 5 + 8 + 10) — START FIRST

**Files:**
- Modify: `src/components/HomePage.jsx` (cards array lines ~290-330 emoji removal + Glossario card + Teodora credit)
- Modify: `src/components/HomePage.jsx` footer styles `footerCredits` line ~260-270 (add Teodora De Venere)
- Modify: `src/components/HomePage.jsx` rendering JSX hero section (verify MascotPresence SVG already rendered, NO additional emoji)
- Verify: `src/components/HomeCronologia.jsx` (already lazy-loaded line 40, ensure rendered visible homepage NOT just route gated)
- Test: `tests/unit/components/HomePage.test.jsx` NEW

### Task III.1 — Read HomePage cards array + emoji refs

- [ ] **Step 1:** Read HomePage.jsx full file to identify cards array structure + emoji per card

```bash
sed -n '290,360p' src/components/HomePage.jsx
```

Expected: 4 cards definitions with `emoji: '⚡'` `📚` `🧠` `🐒` + `cardEmoji` rendering line 357.

### Task III.2 — Replace emoji cards with ElabIcons SVG

- [ ] **Step 1:** Import ElabIcons SVG mascotte

```javascript
import { LightningIcon, BookIcon, BrainIcon, MonkeyIcon } from './common/ElabIcons.jsx';
```

(Note: verify ElabIcons exports — if missing icons use existing `MascotPresence` standalone OR add new SVG inline. ElabIcons currently has 32 exports per iter 34 morfismo G5 verified.)

- [ ] **Step 2:** Replace cards array emoji property with React Element

```javascript
const cards = [
  {
    id: 'lavagna',
    title: 'Lavagna ELAB Tutor',
    description: 'App piena: Percorso dei volumi, esperimenti, UNLIM, voce, simulatore.',
    href: '#lavagna',
    icon: <LightningIcon size={64} />,  // was emoji '⚡'
    credit: null,
  },
  {
    id: 'glossario',
    title: 'Glossario',
    description: 'Termini chiave dei volumi ELAB con definizioni e analogie kit fisico.',
    href: '#glossario',  // was external https://elab-tutor-glossario.vercel.app
    icon: <BookIcon size={64} />,  // was emoji '📚'
    credit: null,
  },
  {
    id: 'chatbot',
    title: 'Chatbot UNLIM',
    description: 'Stile ChatGPT: parlate con UNLIM, citerà i volumi e suggerirà esperimenti pronti.',
    href: '#chatbot-only',
    icon: <BrainIcon size={64} />,  // was emoji '🧠'
    credit: null,
  },
];
```

- [ ] **Step 3:** Update JSX render line ~357

```jsx
{cards.map((card) => (
  <a key={card.id} href={card.href} style={styles.card}>
    <span style={styles.cardIcon} aria-hidden="true">{card.icon}</span>
    <h3 style={styles.cardTitle}>{card.title}</h3>
    <p style={styles.cardDescription}>{card.description}</p>
  </a>
))}
```

- [ ] **Step 4:** Run vitest verify HomePage tests preserved

```bash
npx vitest run tests/unit/components/HomePage.test.jsx 2>&1 | tail -10
```

Expected: PASS (or NEW test for Task III.4).

### Task III.3 — Add Teodora De Venere to credits

- [ ] **Step 1:** Find footerCredits array OR text in HomePage.jsx ~260-270

```bash
sed -n '260,290p' src/components/HomePage.jsx
```

- [ ] **Step 2:** Update credits to include Teodora De Venere

```jsx
<p style={styles.footerCredits}>
  Andrea Marro <strong>(software)</strong> +
  Tea <strong>(co-dev + UX)</strong> +
  Davide Fagherazzi <strong>(volumi cartacei)</strong> +
  Omaric Elettronica <strong>(kit hardware)</strong> +
  Giovanni Fagherazzi <strong>(commerciale)</strong> +
  Teodora De Venere <strong>(contributo iter 35+)</strong>
</p>
```

(Andrea ratify field per Teodora exact role label.)

### Task III.4 — Verify HomeCronologia rendered visible homepage

- [ ] **Step 1:** Read HomeCronologia.jsx + check if rendered conditional

```bash
grep -nE "(visible|isOpen|showCronologia|HomeCronologia)" src/components/HomePage.jsx | head -10
```

- [ ] **Step 2:** If only rendered on `#chatbot-only` route or hidden by default, add visible section homepage root

```jsx
<Suspense fallback={<div>Caricamento cronologia...</div>}>
  <HomeCronologia onResume={handleResumeSession} />
</Suspense>
```

Place after main cards grid, before footer.

### Task III.5 — Add Glossario route handler

- [ ] **Step 1:** Add `#glossario` hash route in HomePage navigation

```javascript
const handleHashChange = useCallback(() => {
  const hash = window.location.hash;
  if (hash === '#glossario') {
    setView('glossario');
  } else if (hash === '#chatbot-only') { ... }
  // existing branches preserved
}, []);
```

- [ ] **Step 2:** Lazy-load GlossarioView component (port from elab-tutor-glossario.vercel.app source)

```javascript
const GlossarioView = lazy(() => import('./glossario/GlossarioView'));
```

(Note: per scope iter 35 atom III, IF GlossarioView source not available locally, render placeholder "Glossario in caricamento — porting iter 36+ from elab-tutor-glossario.vercel.app" + external link as fallback.)

### Task III.6 — NEW unit test HomePage refactor

- [ ] **Step 1:** Write `tests/unit/components/HomePage.test.jsx`

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../../../src/components/HomePage';

describe('HomePage iter 35 refactor', () => {
  it('renders 3 cards (Lavagna + Glossario + Chatbot UNLIM) NO emoji', () => {
    render(<HomePage onNavigate={() => {}} />);
    expect(screen.getByText(/Lavagna ELAB Tutor/)).toBeDefined();
    expect(screen.getByText(/Glossario/)).toBeDefined();
    expect(screen.getByText(/Chatbot UNLIM/)).toBeDefined();
    // Assert emoji NOT present in cards aria-hidden span
    const emojiPattern = /[\u{1F300}-\u{1FAFF}]/u;
    const cardSpans = document.querySelectorAll('[aria-hidden="true"]');
    cardSpans.forEach(span => {
      expect(span.textContent).not.toMatch(emojiPattern);
    });
  });

  it('credits Teodora De Venere in footer', () => {
    render(<HomePage onNavigate={() => {}} />);
    expect(screen.getByText(/Teodora De Venere/)).toBeDefined();
  });

  it('renders MascotPresence SVG hero (no emoji)', () => {
    const { container } = render(<HomePage onNavigate={() => {}} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });
});
```

- [ ] **Step 2:** Run test fail → impl → pass

```bash
npx vitest run tests/unit/components/HomePage.test.jsx 2>&1 | tail -10
```

Expected: 3/3 PASS post-refactor.

### Task III.7 — Commit ATOM III

- [ ] **Step 1:** git add + commit con message scope iter 35

```bash
git add src/components/HomePage.jsx tests/unit/components/HomePage.test.jsx
git commit -m "feat(iter-35-III): homepage refactor — emoji removed + ElabIcons SVG + Teodora De Venere credits + Glossario card + HomeCronologia visible

11-problemi Andrea iter 31+ Sprint T close — Problem 4+5+8+10 atomic batch:
- Problem 4: Lavagna section ONLY lavagna (cards Lavagna primary, no clutter)
- Problem 5: Cronologia sessioni con descrizioni UNLIM-generated wired visible homepage
- Problem 8: Mascotte MascotPresence SVG hero preserved + 4 emoji cards REPLACED with ElabIcons SVG (LightningIcon + BookIcon + BrainIcon)
- Problem 10: Glossario card aggiunto homepage hash route #glossario (port iter 36+)
- Credits Teodora De Venere added footer (Andrea ratify role label)

Acceptance:
- 3/3 NEW vitest tests PASS HomePage.test.jsx
- Vitest baseline 13774 preserve
- ElabIcons G5 morfismo iter 34 baseline 32 icons preserved (G5=1.0)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task III.8 — Audit doc

- [ ] **Step 1:** Write `docs/audits/2026-05-04-atom-III-homepage-refactor.md`

Structure: §1 spec + §2 modifiche file + §3 caveat onesti + §4 acceptance criteria + §5 anti-pattern G45 enforced + §6 next step.

---

## ATOM I: UNLIM Brain Lift (Problem 1) — Phase 1 parallel

**Files:**
- Modify: `supabase/functions/_shared/onniscenza-classifier.ts` capWords defaults
- Modify: `supabase/functions/_shared/system-prompt.ts` BASE_PROMPT v3.4 anti-pappette + paletti soft + recent_intents inject
- Modify: `supabase/functions/unlim-chat/index.ts` wire recent_intents persist + load
- Create: `supabase/migrations/20260504100000_recent_intents_jsonb.sql` ALTER TABLE student_progress
- Modify: `tests/unit/onniscenza-classifier.test.js` capWords defaults assertions update
- Test: integration smoke prod 4 prompt categories post-deploy

### Task I.1 — capWords defaults lift per Andrea "risposte più lunghe"

- [ ] **Step 1:** Edit `onniscenza-classifier.ts` classifyPrompt branches capWords:

```typescript
// Iter 35 Atom I — capWords lift (Andrea "risposte più lunghe non pappette"):
// chit_chat 30→40 (1 frase può respirare)
// meta_question 50→70 (intro UNLIM merita 3 frasi)
// off_topic 40→60 (soft deflect con 2 frasi pivot kit)
// safety_warning 80→100 (safety + spiegazione + kit)
// citation_vol_pag 60→100 (citazione verbatim + analogia + kit)
// plurale_ragazzi 60→100 (docente narrare class merita più parole)
// deep_question 120→200 (deep DAVVERO deep, stop pappette)
// default 60→100 (default più educational)
```

Replace numeric values in 8 return branches.

- [ ] **Step 2:** Update tests `tests/unit/onniscenza-classifier.test.js` capWords assertions:

```javascript
expect(classifyPrompt('Ciao').capWords).toBe(40); // was 30
expect(classifyPrompt('Chi sei?').capWords).toBe(70); // was 50
expect(classifyPrompt('parliamo di calcio').capWords).toBe(60); // was 40
expect(classifyPrompt('pericolo brucia').capWords).toBe(100); // was 80
expect(classifyPrompt('Vol.1 pag.27').capWords).toBe(100); // was 60
expect(classifyPrompt('Ragazzi montiamo').capWords).toBe(100); // was 60
// deep_question fixture (>=20w +?) → 200
expect(classifyPrompt('Spiega in dettaglio come funziona la legge di Ohm e perché...?').capWords).toBe(200);
expect(classifyPrompt('Spiega cosa fa la breadboard').capWords).toBe(100); // was 60 default
```

- [ ] **Step 3:** Run vitest

```bash
npx vitest run tests/unit/onniscenza-classifier.test.js 2>&1 | tail -10
```

Expected: 48/48 PASS (existing tests still pass with new values).

### Task I.2 — BASE_PROMPT v3.4 anti-pappette + paletti soft expansion

- [ ] **Step 1:** Edit `system-prompt.ts` BASE_PROMPT REGOLE ASSOLUTE block (~line 95-110):

REPLACE rule 1:
```
1. Rispondi in MASSIMO 3 frasi + 1 analogia. Mai superare 60 parole.
```

WITH:
```
1. Risposta proporzionata a complessità della domanda (max parole iniettato dinamicamente per categoria). Stop pappette pronte: VARIA struttura, parti dal kit fisico, NO opener formulaico ripetuto. Una analogia mondo reale obbligatoria.
```

- [ ] **Step 2:** EXPAND rule 6 (off-topic soft deflect already extended A5 iter 34):

ADD ANCHE:
```
- Permesso 1-2 frasi educational tangent fuori-strict-ELAB (es. fisica generale, matematica scuola, storia scienza) PRIMA pivot kit. Esempio: "Ragazzi, sì c'è anche il transistor in un computer moderno — sul vostro kit ELAB però usiamo il LED. Costruiamone uno?"
```

- [ ] **Step 3:** ADD new rule 7 ricordo azioni precedenti:

```
7. Ricordo azioni recenti (Sense 1.5 Morfismo): se RECENT_INTENTS è popolato in studentContext, riferisciti naturalmente alle azioni recenti del docente (es. "Ragazzi, abbiamo appena montato il LED, ora aggiungiamo il resistore"). Non inventare azioni non presenti in RECENT_INTENTS.
```

### Task I.3 — SQL migration recent_intents jsonb

- [ ] **Step 1:** Create migration file `supabase/migrations/20260504100000_recent_intents_jsonb.sql`:

```sql
-- Iter 35 Atom I — Recent intents persist for UNLIM ricordo azioni
-- Andrea Sprint T close mandate: "deve avere ricordo delle azioni precedenti e del contesto della sessione"
-- Sense 1.5 Morfismo: per-classe runtime memory of recent docente actions

ALTER TABLE student_progress
  ADD COLUMN IF NOT EXISTS recent_intents jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN student_progress.recent_intents IS
  'JSON array last 10 dispatched intents per session: [{tool, args, ts}]. Iter 35 Atom I.';

-- Index for fast read latest 10 entries via jsonb_array_length
CREATE INDEX IF NOT EXISTS idx_student_progress_recent_intents
  ON student_progress USING GIN (recent_intents);
```

- [ ] **Step 2:** Apply migration via Supabase CLI (Andrea ratify gate per CLAUDE.md mandate)

```bash
SUPABASE_ACCESS_TOKEN=sbp_REDACTED_USE_ENV_VAR \
  npx supabase db push --linked 2>&1 | tail -10
```

Expected: "Applied migration 20260504100000_recent_intents_jsonb"

### Task I.4 — Wire intent_history persist in unlim-chat/index.ts

- [ ] **Step 1:** After successful intent dispatch (post LLM response, where intentsParsed array is populated), persist to student_progress:

```typescript
// Iter 35 Atom I — Persist recent_intents (last 10 sliding window)
if (parsedIntents.length > 0) {
  try {
    const supabase = createClient(supaUrl, supaKey);
    const newEntries = parsedIntents.map(i => ({
      tool: i.tool,
      args: i.args,
      ts: new Date().toISOString(),
    }));
    // Append + slice latest 10
    const { data: existing } = await supabase
      .from('student_progress')
      .select('recent_intents')
      .eq('session_id', sessionId)
      .single();
    const merged = [...(existing?.recent_intents || []), ...newEntries].slice(-10);
    await supabase
      .from('student_progress')
      .upsert({ session_id: sessionId, recent_intents: merged });
  } catch (err) {
    console.warn('[Atom I] recent_intents persist error:', err);
  }
}
```

- [ ] **Step 2:** In `loadStudentContext` (memory.ts), include recent_intents in returned context object:

```typescript
const { data } = await supabase
  .from('student_progress')
  .select('completed_experiments, current_step, recent_intents')
  .eq('session_id', sessionId)
  .single();
return {
  completedExperiments: data?.completed_experiments || [],
  currentStep: data?.current_step || 0,
  recentIntents: data?.recent_intents || [],
};
```

- [ ] **Step 3:** In `buildSystemPrompt` (system-prompt.ts), inject recentIntents block conditional:

```typescript
const recentIntentsBlock = studentContext?.recentIntents?.length > 0
  ? `\n\n## AZIONI RECENTI DOCENTE (Sense 1.5 Morfismo)\n${studentContext.recentIntents.slice(-5).map((i, idx) => `${idx + 1}. ${i.tool} (${new Date(i.ts).toLocaleTimeString('it-IT')})`).join('\n')}\n\nRiferisciti naturalmente a queste azioni quando rilevante. NON inventare azioni non presenti.`
  : '';
```

Append to systemPrompt build chain.

### Task I.5 — Vitest + R5/R7 bench post-deploy

- [ ] **Step 1:** Vitest preserve

```bash
npx vitest run 2>&1 | tail -5
```

Expected: 13774+ PASS.

- [ ] **Step 2:** Edge Function deploy unlim-chat

```bash
SUPABASE_ACCESS_TOKEN=sbp_REDACTED_USE_ENV_VAR \
  npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb 2>&1 | tail -5
```

- [ ] **Step 3:** R5 bench post-deploy:

```bash
node scripts/bench/run-sprint-r5-stress.mjs 2>&1 | tail -15
```

Expected: PZ V3 ≥85% (Andrea longer responses target). Latency may rise due longer outputs (acceptable trade-off).

### Task I.6 — Three-Agent Pipeline workflow per ATOM I

- [ ] **Step 1: Plan** — this section already specs

- [ ] **Step 2: Codex impl** — `codex exec --sandbox workspace-write "implement onniscenza-classifier capWords lift defaults + system-prompt v3.4 anti-pappette + recent_intents wire per docs/superpowers/plans/2026-05-04-iter-35-... ATOM I"`

- [ ] **Step 3: Gemini review** — `git diff supabase/ tests/unit/onniscenza-classifier.test.js | gemini --skip-trust -p "Review iter 35 Atom I diff per: PRINCIPIO ZERO §1 plurale Ragazzi preserve, Morfismo Sense 1.5 recent_intents, edge cases empty intents, race conditions persist"`

- [ ] **Step 4: Fix** — apply CRITICAL/HIGH findings inline

- [ ] **Step 5: CoV** — vitest + R5 bench

- [ ] **Step 6: Audit** — `docs/audits/2026-05-04-atom-I-unlim-brain-lift.md`

- [ ] **Step 7: Commit + push** — pre-commit hook vitest enforce

---

## ATOM IV: Lavagna Modes Refactor (Problems 6 + 9) — Phase 2 parallel

**Files:**
- Modify: `src/components/lavagna/LavagnaShell.jsx` (Percorso 2-window block + PassoPasso older inline)
- Create: `src/components/lavagna/LessonContextWindow.jsx` NEW
- Create: `src/components/lavagna/ClassContextWindow.jsx` NEW
- Test: `tests/unit/components/lavagna/LessonContextWindow.test.jsx` NEW
- Test: `tests/unit/components/lavagna/ClassContextWindow.test.jsx` NEW
- Test: `tests/e2e/iter35-percorso-2window.spec.js` NEW

### Task IV.1 — LessonContextWindow component

- [ ] **Step 1:** Create `src/components/lavagna/LessonContextWindow.jsx`

Component spec:
- Props: `currentExperimentId`, `volumeNumber`, `onClose`, `onCitationClick`
- Wrapped in `FloatingWindowCommon` (resizable, draggable, default position top-left, size 380x500, minSize 280x350)
- Renders capitolo info + Vol/pag verbatim + experiment description + step current
- localStorage key per persistence position+size: `elab-lesson-context-window`

Code skeleton:

```jsx
import { useState, useEffect } from 'react';
import FloatingWindowCommon from '../common/FloatingWindow';
import { getCapitoloFromExperimentId, getVolumeReferenceLabel } from '../../data/volume-references';

export default function LessonContextWindow({
  currentExperimentId,
  volumeNumber,
  onClose,
  onCitationClick,
}) {
  const [capitolo, setCapitolo] = useState(null);

  useEffect(() => {
    if (!currentExperimentId) return;
    const cap = getCapitoloFromExperimentId(currentExperimentId);
    setCapitolo(cap);
  }, [currentExperimentId]);

  return (
    <FloatingWindowCommon
      title="📖 Contesto Lezione"
      initialPosition={{ x: 20, y: 80 }}
      initialSize={{ width: 380, height: 500 }}
      minSize={{ width: 280, height: 350 }}
      resizable draggable
      zIndex={10001}
      persistKey="elab-lesson-context-window"
      onClose={onClose}
    >
      <div style={{ padding: 16, fontFamily: "'Open Sans', sans-serif" }}>
        {!capitolo ? (
          <p style={{ color: '#737373' }}>Ragazzi, scegliete un esperimento per vedere il contesto della lezione.</p>
        ) : (
          <>
            <h3 style={{ fontFamily: "'Oswald', sans-serif", color: 'var(--elab-navy)' }}>
              {capitolo.title}
            </h3>
            <p style={{ fontSize: 14, color: '#525252' }}>
              <strong>Volume {volumeNumber}, Cap. {capitolo.number}</strong>
            </p>
            {capitolo.experiments?.map(exp => (
              <button
                key={exp.id}
                onClick={() => onCitationClick?.(exp.id)}
                style={{ display: 'block', textAlign: 'left', margin: '8px 0',
                  background: exp.id === currentExperimentId ? 'var(--elab-lime)' : 'transparent',
                  border: '1px solid var(--elab-navy)', padding: 8, borderRadius: 4 }}
              >
                {exp.title}
              </button>
            ))}
            <p style={{ fontSize: 13, marginTop: 16, fontStyle: 'italic' }}>
              {getVolumeReferenceLabel(currentExperimentId)}
            </p>
          </>
        )}
      </div>
    </FloatingWindowCommon>
  );
}
```

(Implementation detail: verify `getCapitoloFromExperimentId` exists in volume-references; if NOT, add helper OR inline mapping.)

### Task IV.2 — ClassContextWindow component

- [ ] **Step 1:** Create `src/components/lavagna/ClassContextWindow.jsx`

Component spec:
- Props: `sessionId`, `classKey`, `onClose`
- Wrapped in `FloatingWindowCommon` (default position top-right, size 380x500)
- Fetches class memory from Supabase: `class_memory` + recent `unlim_sessions`
- Renders: ultime 5 sessioni precedenti + esperimenti completati classe + livello competenza rilevato
- localStorage key: `elab-class-context-window`

Code skeleton:

```jsx
import { useState, useEffect } from 'react';
import FloatingWindowCommon from '../common/FloatingWindow';
import { supabase } from '../../services/supabaseClient';

export default function ClassContextWindow({ sessionId, classKey, onClose }) {
  const [classMemory, setClassMemory] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: mem } = await supabase
          .from('class_memory')
          .select('*')
          .eq('class_key', classKey)
          .single();
        if (!cancelled) setClassMemory(mem);

        const { data: sess } = await supabase
          .from('unlim_sessions')
          .select('id, started_at, summary, experiment_id')
          .eq('class_key', classKey)
          .order('started_at', { ascending: false })
          .limit(5);
        if (!cancelled) setRecentSessions(sess || []);
      } catch (err) {
        console.warn('[ClassContextWindow] fetch error:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [classKey]);

  return (
    <FloatingWindowCommon
      title="🎓 Contesto Classe"
      initialPosition={{ x: window.innerWidth - 400, y: 80 }}
      initialSize={{ width: 380, height: 500 }}
      minSize={{ width: 280, height: 350 }}
      resizable draggable
      zIndex={10000}
      persistKey="elab-class-context-window"
      onClose={onClose}
    >
      <div style={{ padding: 16, fontFamily: "'Open Sans', sans-serif" }}>
        <h3 style={{ fontFamily: "'Oswald', sans-serif", color: 'var(--elab-navy)' }}>
          Memoria Classe
        </h3>
        {classMemory ? (
          <p style={{ fontSize: 13 }}>
            {classMemory.completed_experiments?.length || 0} esperimenti completati,
            livello: {classMemory.detected_level || 'rilevamento in corso'}
          </p>
        ) : (
          <p style={{ color: '#737373' }}>Nessuna memoria classe ancora.</p>
        )}
        <h4 style={{ marginTop: 16, fontFamily: "'Oswald', sans-serif" }}>Ultime sessioni</h4>
        {recentSessions.length === 0 ? (
          <p style={{ color: '#737373', fontSize: 13 }}>Nessuna sessione precedente.</p>
        ) : (
          <ul style={{ paddingLeft: 16, fontSize: 13 }}>
            {recentSessions.map(s => (
              <li key={s.id} style={{ marginBottom: 8 }}>
                <strong>{new Date(s.started_at).toLocaleDateString('it-IT')}</strong>
                {s.experiment_id && <span> — {s.experiment_id}</span>}
                {s.summary && <p style={{ margin: 0, fontSize: 12 }}>{s.summary}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FloatingWindowCommon>
  );
}
```

### Task IV.3 — LavagnaShell.jsx Percorso 2-window integration

- [ ] **Step 1:** Import new components

```javascript
import LessonContextWindow from './LessonContextWindow';
import ClassContextWindow from './ClassContextWindow';
```

- [ ] **Step 2:** Replace existing Percorso modalità block with 2-window pattern AS OVERLAY (not replacing libero base)

```jsx
{modalita === 'percorso' && (
  <>
    {/* Percorso = old Libero base behavior (full simulator + drawing) PRESERVED */}
    {/* Plus 2 floating context windows overlaid */}
    <LessonContextWindow
      currentExperimentId={currentExperiment?.id}
      volumeNumber={currentVolume}
      onClose={() => setModalita('libero')}
      onCitationClick={handleExperimentSelect}
    />
    <ClassContextWindow
      sessionId={sessionId}
      classKey={classKey}
      onClose={() => setModalita('libero')}
    />
  </>
)}
```

(Decision: "Andrea wants Percorso = Libero behavior + 2 windows on top". So canvas/simulator stays free-form like Libero, ContextWindows OVERLAY.)

### Task IV.4 — PassoPasso older preferred + window resize

- [ ] **Step 1:** Edit Passo Passo modalità block (~line 1337)

REPLACE:
```jsx
{modalita === 'passo-passo' && (
  <FloatingWindowCommon
    title="Passo Passo"
    ...
  >
    {!activeLessonId ? (
      <div>...empty state...</div>
    ) : (
      <LessonReader ... />
    )}
  </FloatingWindowCommon>
)}
```

WITH:
```jsx
{modalita === 'passo-passo' && (
  <aside
    style={{
      position: 'fixed',
      top: 80,
      right: 0,
      width: 'var(--passo-passo-width, 480px)',
      height: 'calc(100vh - 80px)',
      background: 'var(--elab-cream)',
      borderLeft: '2px solid var(--elab-navy)',
      overflow: 'auto',
      resize: 'horizontal',  // NATIVE CSS resize handle older simpler pattern
      zIndex: 999,
      padding: 16,
      boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
    }}
    aria-label="Passo Passo — modalità older preferred (Andrea iter 21+)"
  >
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <h3 style={{ fontFamily: "'Oswald', sans-serif", color: 'var(--elab-navy)' }}>👣 Passo Passo</h3>
      <button onClick={() => setModalita('percorso')} aria-label="Chiudi Passo Passo" style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>×</button>
    </header>
    {!activeLessonId ? (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--elab-navy)', marginBottom: 12 }}>
          Ragazzi, scegliete un esperimento dalla lista
        </p>
        <p style={{ fontSize: 15 }}>
          Aprite il kit ELAB e trovate l&apos;esperimento nel volume.
        </p>
      </div>
    ) : (
      <LessonReader
        lessonId={activeLessonId}
        currentExperimentId={currentExperiment?.id}
        onExperimentSelect={handleLessonExperimentSelect}
      />
    )}
  </aside>
)}
```

(Note: `resize: 'horizontal'` CSS native handle = older simpler pattern Andrea preferred. Width persisted via CSS custom property OR localStorage on mouseup event.)

- [ ] **Step 2:** Add CSS custom property persistence

```javascript
useEffect(() => {
  if (modalita === 'passo-passo') {
    const aside = document.querySelector('aside[aria-label*="Passo Passo"]');
    if (!aside) return;
    const saveWidth = () => {
      const w = aside.getBoundingClientRect().width;
      localStorage.setItem('elab-passo-passo-width', String(w));
      document.documentElement.style.setProperty('--passo-passo-width', `${w}px`);
    };
    aside.addEventListener('mouseup', saveWidth);
    return () => aside.removeEventListener('mouseup', saveWidth);
  }
}, [modalita]);
```

### Task IV.5 — Three-Agent Pipeline workflow ATOM IV

(Same 7-step workflow as ATOM I, applied to lavagna modes refactor.)

---

## ATOM II: Voxtral Wake Word Diagnose (Problem 2) — Phase 2 parallel

**Files:**
- Verify: `src/services/wakeWord.js` (uses webkitSpeechRecognition NOT Voxtral — Andrea misnomer)
- Verify: `src/components/common/MicPermissionNudge.jsx` (mic permission UX)
- Test: macOS Computer Use Tier 1 real mic prod test
- Test: `tests/unit/services/wakeWord.test.js` add diagnose case

### Task II.1 — Tier 1 prod mic test

- [ ] **Step 1:** macOS Computer Use grant access (already done iter 31 entrance: Chrome read + Fusion full + Terminale click)

- [ ] **Step 2:** Open prod via Chrome MCP

```javascript
mcp__Claude_in_Chrome__navigate({ url: "https://www.elabtutor.school/#lavagna", tabId })
```

- [ ] **Step 3:** Verify wake word listener init via console log

```javascript
mcp__Claude_in_Chrome__javascript_tool({
  action: "javascript_exec",
  tabId,
  text: "JSON.stringify({micPerm:navigator.permissions?.query({name:'microphone'}).then(p=>p.state),wakeWordSupported:!!(window.SpeechRecognition||window.webkitSpeechRecognition),wakeWordActive:typeof window.__elabWakeWordRecognition!=='undefined'})"
})
```

- [ ] **Step 4:** Trigger MicPermissionNudge if not granted, observe nudge UX

### Task II.2 — Real mic test "Ehi UNLIM"

- [ ] **Step 1:** macOS Computer Use screenshot site state

- [ ] **Step 2:** Manually speak "Ehi UNLIM" into laptop mic (Andrea action OR macOS dictation simulation)

- [ ] **Step 3:** Verify console log `[WakeWord] Wake word detected!` + UNLIM panel opens

### Task II.3 — Fix if bug found

Possible bugs:
- A. Listener not initialized post-mount (race condition mount ordering)
- B. Permissions query fails silently (try/catch swallow)
- C. Wake phrases regex mismatch ("Ehi UNLIM" vs "ehi unlim" case)
- D. recognition.onresult handler not firing (browser bug Chrome 130+)

Apply fix per identified bug.

### Task II.4 — Three-Agent Pipeline workflow ATOM II

(Codex impl + Gemini review + Fix + CoV + Audit + Commit.)

---

## ATOM V: Esci Persistence Audit (Problem 7) — Phase 3 sequential

**Files:**
- Verify: `src/components/lavagna/LavagnaShell.jsx` handleMenuOpen flush all WIP
- Audit: chat history persistence path
- Audit: experiment progress persistence path
- Test: `tests/e2e/iter35-esci-persistence-full.spec.js` NEW Playwright

### Task V.1 — Audit all "scritte" content paths

- [ ] **Step 1:** Map all data sources in Lavagna that may "spariscono" su Esci:
  - Drawing strokes → F1 iter 34 GIÀ shipped (DrawingOverlay flush)
  - UNLIM chat history → useGalileoChat localStorage + Supabase chat_history
  - Experiment progress → student_progress table
  - Notes/text inputs (if any in modalità) → check
  - Voice transcripts → wakeWord.js

- [ ] **Step 2:** For each path, verify flush on Esci

### Task V.2 — Extend handleMenuOpen flush

- [ ] **Step 1:** Edit `LavagnaShell.jsx:851-865` handleMenuOpen

ADD flush actions:
```javascript
const handleMenuOpen = useCallback(() => {
  if (typeof window !== 'undefined') {
    try {
      // Existing F1 iter 34: drawings flush via DrawingOverlay unmount
      // F1 also: save expId for re-entry
      const expId = currentExperiment?.id;
      if (expId) {
        localStorage.setItem('elab-lavagna-last-expId', String(expId));
      }
      // NEW iter 35 V.2: flush UNLIM chat history pending
      window.dispatchEvent(new CustomEvent('elab-flush-chat-history', { detail: { sessionId } }));
      // NEW iter 35 V.2: persist experiment progress
      window.dispatchEvent(new CustomEvent('elab-persist-experiment-progress', { detail: { expId, sessionId } }));
    } catch { /* localStorage quota OR private mode */ }
    window.location.hash = '#tutor';
  }
}, [currentExperiment, sessionId]);
```

- [ ] **Step 2:** In useGalileoChat.js, listen for `elab-flush-chat-history` event:

```javascript
useEffect(() => {
  const handler = (e) => {
    if (e.detail.sessionId === sessionId) {
      // Force flush pending message + save state
      saveChatHistoryToSupabase(messages);
    }
  };
  window.addEventListener('elab-flush-chat-history', handler);
  return () => window.removeEventListener('elab-flush-chat-history', handler);
}, [sessionId, messages]);
```

### Task V.3 — Playwright E2E spec esci persistence

- [ ] **Step 1:** Create `tests/e2e/iter35-esci-persistence-full.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Iter 35 Atom V — Esci persistence full audit', () => {
  test('drawing strokes + chat history + expId persist after Esci-reopen', async ({ page }) => {
    await page.goto('https://www.elabtutor.school/#lavagna');
    // Click INIZIA welcome modal
    await page.getByRole('button', { name: /Inizia/i }).click();
    // Draw 5 strokes (simulate)
    const canvas = page.locator('svg.simulator-canvas');
    for (let i = 0; i < 5; i++) {
      await canvas.click({ position: { x: 200 + i * 30, y: 200 } });
    }
    // Chat with UNLIM
    await page.getByRole('button', { name: /Parla con UNLIM/i }).click();
    await page.getByPlaceholder(/Scrivi/i).fill('Ciao UNLIM');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000); // wait response
    // Click Esci (back to home)
    await page.getByRole('button', { name: /Menu/i }).click();
    await page.waitForURL(/#tutor|^https:\/\/www\.elabtutor\.school\/$/);
    // Re-open Lavagna
    await page.goto('https://www.elabtutor.school/#lavagna');
    // Assert strokes preserved
    const strokesPostReturn = await page.locator('svg path[stroke]').count();
    expect(strokesPostReturn).toBeGreaterThan(0);
    // Assert chat history preserved
    const chatMessages = await page.locator('[data-elab-chat-message]').count();
    expect(chatMessages).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2:** Run E2E spec

```bash
npx playwright test tests/e2e/iter35-esci-persistence-full.spec.js --reporter=list
```

Expected: PASS (Andrea bug 7 LIVE prod verified).

---

## ATOM VI: Lavagna Libera Truly Free Verify (Problem 3) — Phase 3 sequential

**Files:** No code changes (C1 GIÀ shipped iter 34 commit `c05b1ce`).

### Task VI.1 — Tier 1 verify post-deploy

- [ ] **Step 1:** Chrome MCP test:

```javascript
mcp__Claude_in_Chrome__browser_batch([
  { name: "navigate", input: { url: "https://www.elabtutor.school/#lavagna", tabId } },
  { name: "javascript_tool", input: { action: "javascript_exec", tabId, text: "(()=>{const btns=Array.from(document.querySelectorAll('button'));const liberoBtn=btns.find(b=>b.textContent.match(/Libero/));if(liberoBtn){liberoBtn.click();}return new Promise(r=>setTimeout(()=>r(JSON.stringify({sentinelLibero:localStorage.getItem('elab-lavagna-libero-active'),hasComponents:document.querySelectorAll('svg [data-component-id]').length,canvasState:typeof window.__ELAB_API==='object'?(window.__ELAB_API.getCircuitDescription?.()||'NO_DESC'):'NO_API'})),1000))})()" }}
])
```

Expected: `{sentinelLibero:"true",hasComponents:0,canvasState:"Nessun circuito caricato."}` (already verified iter 34 carryover).

### Task VI.2 — If verified working, mark COMPLETE

If verification passes, document in audit doc + close Atom VI without code changes.

---

## Phase 4 — Final review + deploy + Tier 1 verify

### Task Final.1 — comprehensive-review:full-review skill

- [ ] **Step 1:** Invoke skill on cumulative diff iter 35 batch:

```bash
git diff origin/e2e-bypass-preview..HEAD > /tmp/iter35-diff.txt
# Then via Skill tool:
# Skill: comprehensive-review:full-review args="iter 35 11 problemi master plan diff"
```

- [ ] **Step 2:** Apply CRITICAL/HIGH findings inline before deploy.

### Task Final.2 — Vitest + Build + Vercel deploy

- [ ] **Step 1:** Vitest baseline preserve

```bash
npx vitest run 2>&1 | tail -3
```

Expected: 13774+ PASS (NEW tests from atomi III+I+IV+V counted).

- [ ] **Step 2:** Build

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 3:** Vercel deploy prod

```bash
PATH="$HOME/.npm-global/bin:$PATH" npx vercel --prod --archive=tgz --yes 2>&1 | tail -15
```

- [ ] **Step 4:** Alias swap

```bash
PATH="$HOME/.npm-global/bin:$PATH" npx vercel alias set <deploy-url> www.elabtutor.school 2>&1 | tail -3
```

### Task Final.3 — Edge Function deploy unlim-chat (per ATOM I changes)

```bash
SUPABASE_ACCESS_TOKEN=sbp_REDACTED_USE_ENV_VAR \
  npx supabase functions deploy unlim-chat --project-ref euqpdueopmlllqjmqnyb 2>&1 | tail -5
```

### Task Final.4 — Tier 1 macOS Computer Use verify all atomi LIVE

Verify per Andrea:
- ✅ ATOM III: HomePage rendered NO emoji + mascotte SVG + Teodora credit + Glossario card + Cronologia visible
- ✅ ATOM I: UNLIM responses longer, non-pappette, with kit pivot, ricordo intent_history
- ✅ ATOM IV: Percorso 2-window overlay (Lesson + Class) + PassoPasso older inline resizable
- ✅ ATOM II: Wake word "Ehi UNLIM" triggers correctly (mic permission + listener init)
- ✅ ATOM V: Esci-reopen drawings + chat + expId preservati
- ✅ ATOM VI: Libero canvas blank + sentinel correct

### Task Final.5 — Score history append iter 35

```jsonl
{"iter":35,"date":"2026-05-04","commit":"<HEAD_SHA>","score_claim":8.6,"score_capped":8.6,...}
```

### Task Final.6 — CLAUDE.md sprint footer iter 35 close section

Append to CLAUDE.md sprint history footer ~80 LOC iter 35 close summary.

### Task Final.7 — Push origin final + Andrea ratify queue update

```bash
git push origin e2e-bypass-preview 2>&1 | tail -5
```

Update `automa/state/iter-31-andrea-flags.jsonl` per outstanding ratify gates iter 35.

---

## Self-Review Checklist

### 1. Spec coverage

| Andrea Problem | Atom | Task |
|---------------|------|------|
| 1 UNLIM ebete | ATOM I | I.1-I.6 |
| 2 Voxtral wake word | ATOM II | II.1-II.4 |
| 3 Lavagna libera truly free | ATOM VI | VI.1-VI.2 |
| 4 Homepage Lavagna only | ATOM III | III.1-III.7 |
| 5 Cronologia sessioni | ATOM III | III.4 |
| 6 Percorso non funziona + PassoPasso older | ATOM IV | IV.3-IV.5 |
| 7 Esci scritte spariscono | ATOM V | V.1-V.3 |
| 8 Mascotte + NO emoji + Teodora | ATOM III | III.2-III.3 |
| 9 Percorso = old Libero + 2 window | ATOM IV | IV.1-IV.3 |
| 10 Glossario homepage | ATOM III | III.5 |
| 11 Principio Zero + Morfismo | meta-mandate | all atomi |

✅ All 11 problems covered.

### 2. Placeholder scan

- ❌ NO "TBD", "TODO" in plan body (verified)
- ❌ NO "implement later" (all tasks have code blocks)
- ❌ NO "Similar to Task N" (each task self-contained)

### 3. Type consistency

- `MascotPresence` referenced consistently (existing component)
- `LessonContextWindow` + `ClassContextWindow` new components, types defined Task IV.1 + IV.2
- `recent_intents` jsonb consistent: SQL migration + Edge Function persist + studentContext load + system-prompt inject

✅ Types consistent.

---

## Anti-pattern G45 enforced

- NO `--no-verify` su commit/push
- NO push diretto su main (e2e-bypass-preview only)
- NO compiacenza score (cap mechanical post-deploy R5/R7 + Lighthouse)
- NO claim "all atomi LIVE prod" senza Tier 1 verify
- NO destructive ops (`git reset --hard`, `git push --force`)
- NO `.env` access bypass safety hook
- NO Edge Function deploy per atomi non-Edge (atom III + IV + V + VI frontend only Vercel)
- NO Supabase secrets edit senza Andrea ratify gate

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-04-iter-35-comprehensive-11-problemi-master-plan.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch fresh subagent per atom (Codex implement + Gemini review per atom = real Three-Agent Pipeline workflow Andrea mandate). I orchestrate + review between tasks. Faster iteration + cleaner context per agent.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch with checkpoints for Andrea review.

**Quale approccio?**

Mia raccomandazione: **#1 Subagent-Driven** per onorare Andrea mandate "workflow multi-provider" — ogni atom realmente Plan→Codex→Gemini→Fix→CoV→Audit con context isolation per agent. Plus Andrea può Tier 1 verify post-each atom prima procedere prossimo (anti-compiacenza CoV+audit per atom).
