# Puck & Pool Arena — v1.0.0

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
This is a local single-player v1, not yet a full AI opponent, multi-player experience or 3D game. Future iterations can add new arenas, progressive levels, optional sounds, AI, tutorials and tests.

## History
- **2026-10-13 · 1.0.0:** First playable fusion engine, bilingual UI and accessibility options.

## Manual QA
- [ ] Test on Android touchscreen (aim, shoot, orientation changes).
- [ ] Test with keyboard only and a screen reader.
- [ ] Verify RO/EN, theme and contrast persistence.
- [ ] Verify reduced motion and scores on mobile.
