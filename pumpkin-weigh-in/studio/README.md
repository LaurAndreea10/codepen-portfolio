# Pumpkin Weigh-In · Night Fair Studio 2.0

A free, browser-only fair with five areas: **Scale / Studio / Play / Collection / Settings**. Romanian and English, keyboard controls, touch drawing, dark/light, high contrast, reduced motion and local progress. There are no runtime dependencies, accounts, paid APIs or tracking requests.

## Run

- Open `pumpkin-weigh-in-complete.html` directly for the self-contained edition. All code and visuals are embedded; installation and service-worker updates require hosting.
- For the modular edition: `cd pumpkin-weigh-in`, then `python3 -m http.server 8000` and open `http://localhost:8000`.
- PWA: deploy the entire directory on HTTPS. The first complete visit caches the app. Use browser installation or the Install action. Check for updates in Settings. A local file cannot be installed as a PWA.
- Game results and gallery entries are local. Use JSON backup to move data between browsers or devices.

## What is implemented

| Area | Working features |
| --- | --- |
| Scale | Six challenge categories; lb/kg/g; decimal commas; exact-boundary presets; random weight; zero reset; hold acceleration; segmented slider/dial; digital/analog/both; next threshold; over-range text |
| Pumpkin | SVG lobes, shading, leaf/stem; round/wide/tall; automatic expressions and horns; face templates, color, witch hat; bow and crown unlocked by XP; lantern color/intensity |
| Studio | Touch/mouse paint, carving and eraser; brush color/width; undo/redo; reset; button-controlled face templates, dot patterns and positioned stickers as alternatives to drawing |
| Fair | Bunting, moon, bats, spirit flames, halo, podium, stamp, medal, crowd, watering and confetti; weather and seasonal decorations |
| Play | Guess weight; guess category; precision; boundary quiz; time attack; championship with three simulated opponents; alternating local two-player; deterministic daily/catch-up challenge; growth simulation with water/fertilizer/sun resources |
| Progress | XP, levels, six-category collection, badges/missions, unlockable cosmetics and ten best results locally; daily XP once per date |
| Collection | Up to 1000 named entries, search, category filter, weight/name/date sorting, two-entry comparison, deletion with undo; count, mean, median, max, histogram and record progression |
| Gallery | Up to 60 complete designs with strokes/stickers, favorite, duplicate, reopen, delete and undo |
| Export | PNG certificate, complete SVG artwork, print, CSV, JSON backup and validated restoration; copy result; basic-design URL sharing |
| Accessibility | RO/EN, document language, labels, visible focus, keyboard operation, live results, non-color status text, high contrast, large text, reduced motion, paused scenery, low effects, adjustable/unlimited timer, disabling long-press acceleration |
| Audio | Optional synthesized water/scale/error/win effects, optional quiet ambience, volume; all results also appear visually |
| Offline | Scoped service worker, versioned local app shell, installation manifest, PNG/SVG icons and explicit update activation |
| Portfolio | Changelog, bilingual case study and catalog metadata; proposed repository integration preserves the classic challenge entry |

## Rules

0–<1 lb Tiny Gourd; 1–<10 Mini; 10–<50 Carving; 50–<1000 Giant; 1000–<2749 Record Breaker!; ≥2749 Legendary. Negative, empty, nonnumeric and nonfinite values are invalid. Zero is valid. `2749` is the historical challenge threshold, not a claim about the current world record. `pumpkin.js` remains pure and separate from the UI.

The weight-estimation game uses size as a hint across the six bands; it is a stylized visual, not a physical density model. Growth/weather are simulations, not horticultural advice. Championship opponents simulate scores rather than call an AI service.

## Data and sharing

Import validates schema, entries and bounded artwork before replacing data. A failed import leaves the current collection unchanged. Undo deletion can restore the previous entries and gallery after import. The backup includes XP and drawings; preferences stay local. Storage failures are announced and the current session still works. Basic share links include only appearance/name/weight, not strokes; a public link needs a hosted copy, while a `file:` link is device-local.

## Validation

`npm test` runs ten Node test groups. `npm run test:browser` runs browser integration checks after `npm install` and `npx playwright install chromium`. See `VALIDATION.md` for the checks actually executed and their limits. `test-results.html` and the in-app Logic checks button run small live browser checks; neither claims to be the official CodePen report.

In the existing portfolio repository, Studio lives under `pumpkin-weigh-in/studio/`, and the classic `index.pen.html` and original Jest suite remain available. Root challenge Jest tests and Studio Node tests are separate.

## Credits

Directions supplied by the user: Grow & Weigh (zirak9), Pumpkin RED (Pablo), the yokai spirits pen and The Great Pumpkin Weigh-Off. SVG/CSS artwork and procedural sound, with no externally loaded fonts or image assets.
