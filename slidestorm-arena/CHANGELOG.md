# Changelog

## v2.0.1 — 2026-10-02

RO — Corectează descrierea imediată a benzii și instrucțiunile accesibile pentru toate cele opt sporturi. Importurile JSON păstrează controalele native focalizabile. Traduce elementele constructorului, calitatea grafică și numele accesibile ale selectorului de evenimente/comenzilor. Lungimea traseului creat influențează viteza parcurgerii în coordonatele interne normalizate; timerul păstrează timpul real. Actualizează cache-ul offline. Păstrează schema salvărilor v2 și istoricul v1.0.0/v2.0.0.

EN — Fix immediate lane descriptions and sport-specific nonvisual instructions. Keep JSON imports keyboard accessible through native file inputs. Translate builder elements, graphics quality and accessible control names. Custom-route length now scales traversal speed while elapsed time stays in real seconds. Bump the offline cache; retain the v2 save schema and earlier release history.

Validation: state and Worker API tests pass, including new lane-description, eight-sport instruction and route-length regressions. Actual phone touch, TalkBack/VoiceOver and offline browser QA remain unverified; no accessibility certification claim.

## v2.0.0 — 2026-10-01

Expanded the existing structure to 100 generated levels, 10 chapters, 8 sports and 11 modes. Added branching routes, breakable sandcastles, sluice switches, wave hazards, springboards, treasures, combo challenges, training, exploration and local two-player turns. Added route builder with JSON import/export, inventory, local ghosts, daily/weekly missions, round history and sport stats. Added separate assistance controls, step-by-step play, keyboard remapping, gamepad, sensitivity, text size, left-handed controls, focused play and optional haptics. Added PWA manifest and versioned offline shell. Added asynchronous private online rooms and player-reported leaderboard through a Worker and D1. Migrates v1 backups; validates all nested state and retains previous valid save.

Validation: state/API tests; visual/touch/screen-reader testing unavailable in current runtime. Online audience remains unchanged; no anti-cheat or accessibility certification claim.

## v1.0.0 — 2026-10-01

Original 12-level game: three sports, five modes, local Shop and progress, RO/EN, themes, high contrast, reduced motion, single-action assistance, touch gestures, keyboard and strict JSON backup validation.

Original source retained at `releases/v1.0.0.html`.
