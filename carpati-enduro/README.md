# 🏍️ Carpați Enduro — Expedition 2.0

Browser motorcycle racing, enduro and trial, with Three.js 3D rendering and a Canvas 2D fallback. Romanian/English, dark/light, touch/gamepad/keyboard, local progress and an installable PWA. No accounts, ads or paid services.

Play: https://laurandreea10.github.io/codepen-portfolio/carpati-enduro/

## What's new

Open **Expedition Studio** from the existing menu:

- **Rides:** Sprint, Hard Enduro, Precision, Checkpoint Rush, Delivery, Rescue, Rally Raid, Expedition, Champions Trilogy and Exploration. Three route variants; staged events retain their results between stages in the current session. Rally rival times are estimated when an opponent has not reached the finish.
- **Track editor:** 3–40 segments, 18 terrain types, surface/height controls, drag-to-shape elevation, keyboard-accessible numeric elevation edits, deterministic seeds, Undo/Redo, 24 local courses and validated JSON export/import. Finish a test run before exporting a validated course.
- **Missions:** deterministic daily/weekly goals and a fictional sponsor contract; each reward can be claimed once per period.
- **Workshop:** per-bike pressure/suspension tuning with real physics effects, brake balance, optional manual gears/clutch, outfit presets and one optional power-up per ride. Bonuses: boost, shield, grip, slow time, coin magnet, repair/fuel.
- **Friends:** 2–4 local players take turns on the same course; asynchronous ghost-file challenges. This is not live multiplayer.
- **Replays:** recorded poses, pause, speed, seeking and camera changes; ghost JSON import/export. Replay files preserve custom course geometry, expedition route and recorded weather transitions.
- **Analysis:** local run history, crash locations, sector times, average/top speed, a time chart and a targeted practice suggestion. Downloadable PNG result cards.
- **Comfort:** sensitivity, camera smoothing, one-hand grouping, individual touch-control positions, an economy mode and configurable weather effects. Original high contrast, large text, reduced motion and two-button assist remain available.
- **Saves:** full backup download/import, recovery copy, four local slots and finite-course checkpoint resume as a fresh practice attempt. Practice/editor tests do not award coins, XP, records or licenses.
- **About:** bilingual case study, event history, update check, source and feedback links.

The existing 24-level career, five motorcycles, seven school lessons, shop, seasonal events and original nine modes remain in place. Saved coins, upgrades, career medals and history use the existing `carpati-enduro-v1` key. New data lives under `expedition` in that save. V2 rankings include the simulation rules in their key; old records remain available without comparing incompatible physics.

## Files and deployment

Keep `index.html`, `expedition-core.js`, `sw.js`, `manifest.webmanifest`, `case-study.html` and `icons/` together. The game is now a small static folder rather than a standalone HTML file. GitHub Pages can serve it without a build step.

The service worker caches this folder after a complete successful visit. Three.js and fonts are cached opportunistically; offline 3D depends on a previous successful module load. The 2D fallback has no Three.js dependency. Updates wait for old pages to close; the worker never removes other games' caches.

On Android/desktop use the install button when supported; on iOS use Share → Add to Home Screen. Clearing browser/site data removes local progress, so export a backup before doing so.

## Validation

```sh
node --test carpati-enduro/tests/core.test.cjs carpati-enduro/tests/sw.test.cjs
```

Serve this folder and open `tests/runtime.html`, then press **Run checks**. The browser harness covers all eight regions × nine original modes, ten new disciplines, RO/EN Studio screens, responsive layouts, course/ghost validation, rewards, checkpoint resume and stale timers. It restores the original local save after finishing. Use a disposable preview origin for tests.

See [QA.md](QA.md) for evidence and limits, and [FEATURE-COVERAGE.md](FEATURE-COVERAGE.md) for an honest mapping of all 24 requested directions, including remaining ideas. A feature listed there as pending is not presented as implemented.

## Limits

Live multiplayer, public lobbies, global rankings, accounts and cloud synchronization are not connected. No placeholder login or fake global score is shown. True split-screen, deformable terrain and moving collision platforms are also not implemented. Photo export uses the 2D renderer. Physical-phone performance, screen-reader usability and flight-mode installation require manual device checks.

## 🇷🇴 Pe scurt

Meniul existent este păstrat. Funcțiile noi sunt în **Expedition Studio**. Progresul rămâne local, poate fi exportat și are copie de recuperare la import. Editorul, expedițiile, competiția locală și reluările funcționează fără server. Funcțiile online și subpunctele rămase sunt marcate explicit în documentație.
