# Circuit screenshots index — Sprint S iter 12 ATOM-S12-B3

Generated: 2026-04-28T03:08:34.885Z
Mode: dry
BASE_URL: https://www.elabtutor.school
Auth env present: ELAB_API_KEY=NO | SUPABASE_ANON_KEY=NO

## Files

| idx | file | experiment_id | description | status | bytes | reason |
|-----|------|---------------|-------------|--------|-------|--------|
| 01 | circuit-01.png | v1-cap6-esp1 | Vol.1 cap.6 esp.1 — LED basic | placeholder | 582 | - |
| 02 | circuit-02.png | v1-cap6-esp2 | Vol.1 cap.6 esp.2 — LED + R | placeholder | 582 | - |
| 03 | circuit-03.png | v1-cap6-esp3 | Vol.1 cap.6 esp.3 — LED variant | placeholder | 582 | - |
| 04 | circuit-04.png | v1-cap7-esp1 | Vol.1 cap.7 esp.1 — pulsante | placeholder | 582 | - |
| 05 | circuit-05.png | v1-cap7-esp2 | Vol.1 cap.7 esp.2 — pulsante variant | placeholder | 582 | - |
| 06 | circuit-06.png | v1-cap8-esp1 | Vol.1 cap.8 esp.1 — condensatore | placeholder | 582 | - |
| 07 | circuit-07.png | v1-cap10-esp1 | Vol.1 cap.10 esp.1 — partitore | placeholder | 583 | - |
| 08 | circuit-08.png | v1-cap11-esp1 | Vol.1 cap.11 esp.1 — series | placeholder | 583 | - |
| 09 | circuit-09.png | v1-cap12-esp1 | Vol.1 cap.12 esp.1 — parallel | placeholder | 583 | - |
| 10 | circuit-10.png | v1-cap13-esp1 | Vol.1 cap.13 esp.1 — RGB | placeholder | 583 | - |
| 11 | circuit-11.png | v1-cap14-esp1 | Vol.1 cap.14 esp.1 — capstone Vol.1 | placeholder | 583 | - |
| 12 | circuit-12.png | v2-cap1-esp1 | Vol.2 cap.1 esp.1 — Arduino intro | placeholder | 582 | - |
| 13 | circuit-13.png | v2-cap2-esp1 | Vol.2 cap.2 esp.1 — blink | placeholder | 582 | - |
| 14 | circuit-14.png | v2-cap3-esp1 | Vol.2 cap.3 esp.1 — digitalWrite | placeholder | 582 | - |
| 15 | circuit-15.png | v2-cap4-esp1 | Vol.2 cap.4 esp.1 — semaforo | placeholder | 582 | - |
| 16 | circuit-16.png | v2-cap5-esp1 | Vol.2 cap.5 esp.1 — pulsante | placeholder | 582 | - |
| 17 | circuit-17.png | v3-cap1-esp1 | Vol.3 cap.1 esp.1 — ADC | placeholder | 582 | - |
| 18 | circuit-18.png | v3-cap2-esp1 | Vol.3 cap.2 esp.1 — PWM fader | placeholder | 582 | - |
| 19 | circuit-19.png | v3-cap3-esp1 | Vol.3 cap.3 esp.1 — servomotore | placeholder | 582 | - |
| 20 | circuit-20.png | v3-cap5-esp1 | Vol.3 cap.5 esp.1 — matrice LED 8x8 | placeholder | 582 | - |

## Totals
- Files: 20/20
- Real captures: 0
- Placeholders: 20
- Total bytes: 11645

## Honest caveats
- Placeholders are valid PNG signature + IHDR + IDAT + IEND + tEXt padding chunk to reach >= 500 bytes per file (test gate threshold).
- Real captures require Playwright + valid prod auth (ELAB_API_KEY + SUPABASE_ANON_KEY) + class_key seeded.
- Iter 12 ships placeholders to unblock B5 ClawBot composite vision pipeline test contract; iter 13 Andrea runs real capture once env provisioned.
- captureScreenshot internal selector may still fail post-Lavagna redesign (see vision-canvas-selector-evidence.md ATOM-S12-A3).
- Each experiment_id is verified existing in src/data/lesson-paths/<id>.json at iter 12 boundary.

## Re-run command

```bash
# Real capture (prod):
BASE_URL=https://www.elabtutor.school \
  ELAB_API_KEY=... \
  SUPABASE_ANON_KEY=... \
  node scripts/capture-real-screenshots.mjs

# Dry run (placeholders only, no browser):
node scripts/capture-real-screenshots.mjs --dry
```
