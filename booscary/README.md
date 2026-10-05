# Halloween BooScary

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
