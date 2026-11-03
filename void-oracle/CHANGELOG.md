# VOID ORACLE — Version History

## 2026-11-02 — v1.0.0 · Finalizat / Completed

- New VOID HUNTER-inspired shooter for the CSS Random() challenge: a CSS `random()` oracle picks each wave's modifier, bonus dice and ship colour; JavaScript reads the computed values.
- Eight modifiers, three enemy types, three-phase boss every fifth wave, four power-ups, combo multiplier, Nova bomb, `random()` sky.
- Links both ways: the VOID HUNTER project page gets a “Versiunea nouă: VOID ORACLE” button; VOID ORACLE's start screen links to the original VOID HUNTER pen. VOID HUNTER itself is unchanged.
- RO/EN, keyboard/mouse/touch, sound and reduced-motion toggles, pause, live-region announcements, local best score, JS fallback.
- Automated Chromium checks (fallback path) at 1280 and 390 px: start, oracle, waves, Nova, boss wave, pause, game over. Native `random()` path, physical phones and screen readers remain unverified.
