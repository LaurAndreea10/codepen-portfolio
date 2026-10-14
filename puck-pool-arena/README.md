# Puck & Pool Arena — v1.1.0

Air Hockey × Billiards. Browser-only arcade game, built as a standalone HTML/CSS/JavaScript experience.

## Gameplay / Joc
- Four billiard balls, six pockets, one striking puck and right-side goal.
- Pocket = +100 points; puck goal = +50 points.
- Ball-to-ball elastic collisions and wall rebounds with friction.
- Touch/pointer aiming, power and angle sliders, keyboard controls.
- Local best score via LocalStorage; no external libraries or accounts.

## Accessibility / Accesibilitate
- RO/EN switch, dark/light switch, high contrast toggle.
- Reduced motion toggle and respects system reduced-motion preference.
- Keyboard: Space to shoot (outside interactive controls), arrows for angle/power, P to pause.
- Buttons have visible focus, semantic controls, score in text, live status announcements, skip link.
- Responsive canvas and pointer controls for mobile.

## Technical notes
Version 1.1 adds a turn-based local AI in championship mode and 2.5D canvas perspective (not real WebGL 3D). No network multiplayer. The AI chooses a ball target and applies difficulty-based aiming error. Browser-only, zero dependencies.

## Campaign / Campanie
- 12 progressive levels with target scores and shot limits. Unlocks and medals stored locally.
- 3 championship leagues with alternating player and AI shots over up to 3 rounds. Rookie, Challenger and Champion difficulty.
- Neon City, Ocean Depths and Cosmic Orbit arena palettes with optional 2.5D table edge, drop shadows and depth effects. High contrast remains flat for readability.
- LocalStorage campaign key `puckPoolCampaignV1` is separate from the original `puckPoolBest` and `puckPoolPrefs` keys.

## History
- **2026-10-14 · 1.1.0:** Progressive levels, AI challenger, three championship leagues, three 2.5D arena styles, local campaign persistence; original v1.0.0 retained.
- **2026-10-13 · 1.0.0:** First playable fusion engine, bilingual UI and accessibility options.

## Manual QA
- [ ] Smoke-test levels 1–12, target/shot limits, next-level button and refresh persistence.
- [ ] Smoke-test three AI difficulties, championship round transitions, league unlocks and arena changes.
- [ ] Test on Android touchscreen (aim, shoot, orientation changes).
- [ ] Test with keyboard only and a screen reader.
- [ ] Verify RO/EN, theme and contrast persistence.
- [ ] Verify reduced motion and scores on mobile.
