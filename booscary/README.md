# Halloween BooScary

## v3.1.0 — 2026-10-06

- Sticky mobile pumpkin and compact brush/contour/eraser/undo/redo/zoom bar. Activity header height is measured to prevent overlap.
- Quadratic smoothing, dashed open-contour preview until release, zoom maintained across edits, and redo with branch reset after a new action.
- Records and completed levels per game, persisted separately, plus a next-mission summary. Classic and festival rounds, all mini-games and model completion are recorded.
- Adjustable persisted volume, distinct carving/painting/lighting effects and a victory chord; no automatic audio playback.
- Full JSON backups now include per-game records. Missing records in v3.0 backups migrate to an empty record collection; malformed records are rejected before writes. Earlier progress and gallery keys remain intact.

Validation: 314 logic checks; test-browser.cjs, test-v3.cjs and test-v31.cjs passed in Chromium. Automated axe checks detected no WCAG A/AA violations on home, workshop, face-match and maze screens at 390px. Browser tests cover 360/390/1280px, undo/redo branching, smooth contour preview, zoom persistence, audio/volume, records persistence, backup validation, keyboard and touch emulation. Real-phone, audible quality and real screen-reader checks remain pending.

Dependencies for development tests only: Playwright and @axe-core/playwright. Run `node booscary/test-accessibility.cjs` for the automated accessibility audit. BOOSCARY_URL can target the deployed app in test-v31.cjs/test-accessibility.cjs; BOOSCARY_BROWSER and BOOSCARY_ARGS optionally select a local executable and JSON argument list. The app remains one HTML file without runtime dependencies.

## v3.0.0 — 2026-10-05

- Activity launcher with focused mobile view, return navigation and accessible optional sound control.
- Continuous free brush, adjustable width, whole-stroke/spot eraser, closed carved contours, face templates, dots/stripes/stars, undo and keyboard alternatives.
- Animated lantern with adjustable flame intensity, steady-light toggle and prefers-reduced-motion support.
- Halloween Memory (4–6 pairs), face matching, three solvable lantern mazes with keyboard/directional controls, and deterministic daily decoration model.
- Local XP/levels, coins, daily missions and once-per-day bonus; ribbon, halo and hat unlocks.
- Named pumpkins, v2-compatible gallery migration, PNG (1200×960) and SVG export.
- Complete version-3 JSON backup: gallery, XP/coins/accessories/daily progress and v1 best score. Strict nested validation precedes writes; storage failure rolls back written keys. Files are capped at 64 MiB. Local storage availability still depends on browser quota.
- Earlier challenge, modes, local score key and the v1/v2 history below retained.

Validation: 314 logic checks and both test-browser.cjs/test-v3.cjs passed in Chromium. Coverage includes drawing, contour, eraser, undo, naming, gallery reload, real PNG signature, Memory, face matching, BFS paths through all three mazes, model matching, XP persistence, daily reward once, purchases, JSON roundtrip, five nested-invalid backups, simulated storage failure rollback, large activity view, RO/EN, reduced motion and no overflow at 360/390/1280 px. Touch is emulated. Physical-device, audible quality and real screen-reader checks remain pending.

Run with Playwright: `node booscary/test-browser.cjs` and `node booscary/test-v3.cjs`. Optionally set BOOSCARY_BROWSER to a Chromium executable.

## v2.0.0 — 2026-10-05

- Six modes: classic, marathon, daily deterministic challenge, survival (three lives), same-device duel, free practice.
- Pumpkin workshop: three faces; carving eyes/nose/mouth; color painting and spots; star decorations; gold/green/purple illumination; night/forest/castle scenes.
- Free creation plus lantern, artist and party missions. Undo, gallery (12 slots), validated saved objects and SVG download.
- Optional synthesized Web Audio effects activated by user interaction, off by default; visible feedback remains available.
- RO/EN, keyboard alternatives to touching the SVG, 48px controls, high contrast, light/dark, larger game view and reduced-motion support.
- Existing v1 score key and challenge retained. Privacy copy now includes locally stored gallery.

Validation: 314 logic checks and automated Chromium test-browser.cjs passed: all modes, lives, touch-emulated SVG painting, carving, lighting, missions, undo, gallery reload, languages, themes, audio activation, keyboard, expanded view, export and 360/1280px overflow checks. Physical-device, audible playback quality and screen-reader verification remain pending.

Run browser checks with `node booscary/test-browser.cjs` using Playwright; optionally set BOOSCARY_BROWSER to an installed Chromium executable.

## v1.0.0 — 2026-10-05

Single-file FizzBuzz challenge. Multiples of 3 → Boo; 5 → Scary; both → BooScary. Includes 15-step practice, generator (1–300), local best score, RO/EN, dark/light, high contrast, keyboard controls, live feedback and no dependencies.

Open index.html directly or paste index.pen.html into CodePen's HTML panel. No Markdown renderer or Jest report required. In-page tests: 314 checks. Syntax, full round, score write, restart and language switch verified in a Node DOM stub. Real browser rendering, touch and screen-reader checks remain pending.
