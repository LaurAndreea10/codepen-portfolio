# VOID ORACLE — Version History

## 2026-11-03 — v1.1.0 · VOID HUNTER look

- RO: Stil ca VOID HUNTER: titlu alb cu strălucire cyan, butoane conturate cu majuscule, colțuri drepte, eticheta CSS RANDOM() EDITION și alegere EASY / NORMAL / HARD (vieți, viteză, ritm de tragere, viață boss), salvată local.
- EN: VOID HUNTER look: white neon title, outlined uppercase buttons, square corners, a CSS RANDOM() EDITION tag and EASY / NORMAL / HARD (lives, speed, fire rate, boss HP), saved locally.

## 2026-11-02 — v1.0.0 · Finalizat / Completed

- New VOID HUNTER-inspired shooter for the CSS Random() challenge: a CSS `random()` oracle picks each wave's modifier, bonus dice and ship colour; JavaScript reads the computed values.
- Eight modifiers, three enemy types, three-phase boss every fifth wave, four power-ups, combo multiplier, Nova bomb, `random()` sky.
- Links: Random Constellation's header has a “Joacă VOID ORACLE” button, and VOID ORACLE's start screen links back to Random Constellation and to the original VOID HUNTER pen (VOID HUNTER itself is unchanged). The chosen language carries over via `?lang=`.
- RO/EN, keyboard/mouse/touch, sound and reduced-motion toggles, pause, live-region announcements, local best score, JS fallback.
- Automated Chromium checks (fallback path) at 1280 and 390 px: start, oracle, waves, Nova, boss wave, pause, game over. Native `random()` path, physical phones and screen readers remain unverified.
