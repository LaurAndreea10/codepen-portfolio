# CHRONOSCROLL × Baseline Voyage — Version History

## 2026-11-09 — v4.0.0 · Finalizat / Completed

- RO: **CHRONO PILOT**, joc integrat (capitolul 10): bara de scroll e joystickul. Nava e mutată de `animation-timeline: --pilot` (scrollerul arenei → `timeline-scope` → `@property --py`); bucla jocului doar citește progresul pentru coliziuni. Moduri Poveste (75 s, 2023 → 2026, orbite de lansare Chrome 115 / Safari 26 / Firefox 159, bonus Baseline ×2), Ziua (același traseu pentru toți) și Infinit; clasament local top 5, copiere scor, viteză redusă, pauză automată, insigna „Pilot temporal”.
- EN: **CHRONO PILOT**, an integrated game (chapter 10): the scrollbar is the joystick. The ship is moved by `animation-timeline: --pilot` (arena scroller → `timeline-scope` → `@property --py`); the game loop only reads the progress for collisions. Story (75 s, 2023 → 2026, Chrome 115 / Safari 26 / Firefox 159 release orbs, Baseline ×2 bonus), Daily (same course for everyone) and Endless modes; local top-5 leaderboard, score sharing, slower speed, auto-pause, “Time pilot” badge.

## 2026-11-09 — v3.0.0

- RO: Unirea cu CHRONOSCROLL: hero „Timpul. În mâinile tale.” cu observatorul browserelor (lunile sunt linkuri spre capitole), dark/light separat de cele 7 palete, navigație numerotată, galerie cinema opțională, cronologia `--sandbox`, butoane La început / La final și fallback JS în laborator, print, `<noscript>`, descărcare HTML complet, formulări prudente despre performanță.
- EN: Merge with CHRONOSCROLL: “Time. In your hands.” hero with the browser observatory (moons link to chapters), dark/light separate from the 7 palettes, numbered navigation, optional cinema gallery, `--sandbox` timeline, To start / To end buttons and a JS fallback in the lab, print styles, `<noscript>`, full-HTML download, careful performance wording.

## 2026-11-09 — v2.0.0

- RO: Cele 25 de direcții: capitole Chrome/Edge, Safari, Firefox, univers 3D legat de scroll, trei portaluri, galerie cu snap și `view(inline)`, cronologii denumite pe ambele axe, laborator CSS cu provocări, glosar, compatibilitate pe funcții cu simulare de fallback și mod static, 7 teme, confort (intensitate, text, mișcare redusă, fără 3D, contrast), sunet opțional, pașaport cu cristale, preferințe, linkuri de capitol, variante Complet / Compact / Educativ / Simplificat.
- EN: The 25 directions: Chrome/Edge, Safari, Firefox chapters, scroll-linked 3D universe, three portals, snap gallery with `view(inline)`, named timelines on both axes, CSS lab with challenges, glossary, per-feature compatibility with fallback simulation and static mode, 7 themes, comfort settings, optional sound, crystal passport, preferences, chapter links, Full / Compact / Educational / Lightweight variants.

## 2026-11-09 — v1.0.0

- RO: Cronologia din șablonul CodePen animată cu `scroll()` și `view()`, an uriaș `@property`, insigne telecomandate cu `timeline-scope`, galerie orizontală, laboratorul telecomenzii, fallback cu IntersectionObserver.
- EN: The CodePen template timeline animated with `scroll()` and `view()`, a giant `@property` year, remote-controlled badges via `timeline-scope`, horizontal gallery, remote-control lab, IntersectionObserver fallback.

Tests: automated Chromium checks at 1366 and 390 px (native, simulated fallback, reduced motion, static, print, lab, game). Safari, Firefox, physical phones and screen readers remain to be verified.
