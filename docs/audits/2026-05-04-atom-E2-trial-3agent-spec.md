# ATOM-E2 spec — PassoPasso older preferred + window resize (Three-Agent Pipeline iter 34 carryover)

**Data**: 2026-05-04 ~10:00 GMT+2
**Branch**: e2e-bypass-preview HEAD `021bdfc`
**Atom**: E2 PassoPasso older preferred + window resize (Andrea iter 21+ mandate)
**Trial purpose**: continue Three-Agent Pipeline atom complex validation (cumulative anti-bias evidence vs A2b small + C1 complex)

## §1 Spec

**Andrea iter 21+ feedback**: "2 modalità passo passo (older preferred + window resize)"

**File analysis** `src/components/lavagna/LavagnaShell.jsx`:
- **Line 1243-1256** OLDER pattern: `LessonReader` inline in `dashboardView` (simple, sidebar feel, NO floating window)
- **Line 1337-1368** NEWER pattern (iter 36 A5): `LessonReader` wrapped in `FloatingWindowCommon` (draggable + resizable floating window)

**Andrea preferenza**: older inline pattern per Passo Passo modalità (simpler UX, no floating overhead).

**FloatingWindowCommon GIÀ supporta resize** (`resizable={true}`, `minSize`, `resizeCorner` line 218 css). Window resize è già feature presente.

## §2 Behavior change

**Edit 1** — `LavagnaShell.jsx:1337-1368` Passo Passo modalità block:
- Add localStorage preference `elab-passo-passo-style` = 'inline' | 'floating' (default 'inline' per Andrea preference)
- Render condizionale based on preference:
  - 'inline' (default older preferred): fixed side-panel right-anchored 480px wide resizable border-left handle
  - 'floating' (legacy iter 36 A5): existing FloatingWindowCommon (preserve as alternative)
- Both branches preserve LessonReader content + empty state plurale "Ragazzi, scegliete..."

**Edit 2** — Add UI toggle button "Stile finestra: Inline / Floating" inside Passo Passo header:
- Click toggle switches preference + persists localStorage
- Default 'inline' on first mount

## §3 Acceptance criteria

1. **Vitest baseline 13774 preserved** (zero regression src/test paths)
2. **Default behavior**: modalità Passo Passo → inline side-panel (older preferred Andrea)
3. **Toggle works**: localStorage `elab-passo-passo-style='floating'` → FloatingWindowCommon shown
4. **Resize works** entrambi pattern (inline border-left drag OR FloatingWindow corner)
5. **Anti-pattern G45**: NO regression default modes ≠ passo-passo, NO new dependencies
6. **PRINCIPIO ZERO**: empty state preserved "Ragazzi, scegliete..." + kit ELAB mention

## §4 Three-Agent Pipeline workflow §4.3

- Step 1 PLAN (this doc) ✓
- Step 2 IMPLEMENT (Codex CLI): surgical edit ~30 LOC LavagnaShell.jsx
- Step 3 REVIEW (Gemini CLI): findings priority-rated
- Step 4 FIX (Claude inline): apply CRITICAL/HIGH if needed
- Step 5 CoV: vitest 13774 preserve
- Step 6 AUDIT: doc execution

## §5 Anti-pattern G45 enforced

- NO claim "Andrea Tier 1 verified" senza manual smoke prod
- NO --no-verify
- NO destructive ops
- NO Edge Function deploy (frontend-only LIVE next Vercel deploy)
