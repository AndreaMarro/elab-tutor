# Pre-audit TASK-VISION-E2E

- **Data**: 2026-04-19 11:18 local (sessione PM)
- **Branch**: `feature/vision-e2e-live`
- **SHA pre-task**: `91efd8d7b406a26e43cade0bed36690938ba7ccf`
- **Main parent**: `91efd8d feat(lavagna): Lesson Reader v1 complete (integration + 5 lezioni + E2E) (#3)`
- **Baseline test**: 12081 PASS (0 fail) — 198 files, duration 74.21s
- **Build**: OK — PWA v1.2.0, precache 30 entries 4797.48 KiB, built in 1m 20s
- **Node**: v22.14.0
- **Working tree**: clean pre-branch
- **PR #3 stato**: MERGED in main (commit 91efd8d)

## Obiettivo

Implementare Feature 1 Vision E2E: `VisionButton` in Lavagna + `__ELAB_API.captureScreenshot()` → `unlim-chat` Edge Function con `images` → Gemini 2.5 Pro Vision diagnosi + `[AZIONE:highlight:id]` actions.

Segui `docs/plans/2026-04-19-pdr-vision-e2e.md` + `docs/superpowers/plans/2026-04-19-recovery-phase2.md` → Feature 1 → Task 1.1-1.7.

## Exit criteria

- 7/7 unit tests PASS (CoV 3/3)
- 3/3 Playwright E2E PASS
- Baseline 12081 → 12088 (+7), zero regressioni
- Build success
- Audit indipendente APPROVE
- Principio Zero v3 verificato (no "Docente leggi" in UI)
- WCAG AA (touch 44px, focus-visible, aria-label)
- PR draft aperta

## Governance 8-step

- [x] [1] Pre-audit (questo file)
- [ ] [2] TDD fail-first
- [ ] [3] Implementation
- [ ] [4] CoV 3x
- [ ] [5] Audit indipendente
- [ ] [6] Doc-as-code
- [ ] [7] Post-audit
- [ ] [8] Merge prep (PR draft)
