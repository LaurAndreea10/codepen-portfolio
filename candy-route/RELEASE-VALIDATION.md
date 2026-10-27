# Candy Route v4 release validation — 2026-10-27

Production was checked in a disposable Chromium mobile/touch context (390×844 and landscape 844×390). Existing v2 progress migrated; a real level was solved; RO/EN and rotation preserved the attempt; full backup exported; partial invalid imports were rejected atomically; the production service worker reloaded offline.

The sixth check opens Candy Route from Arcade World. Public Arcade currently overflows at 390px and puts More outside the visible viewport. All six checks pass when public Arcade HTML receives the proposed companion mobile stylesheet. That patch is not deployed. See `production-release-results.json` for this distinction.

Local regression checks pass for feedback in RO/EN (approved escaped text, empty state, offline fallback), strict automated accessibility on LIVADA and its game, and delayed initialization of PentArena and Serpent Prism. PentArena's delayed-initialization CLS dropped from 0.279 to 0. Automated checks include WCAG 2.1 A, previously omitted from the Candy browser checks. House buttons now derive their names from visible content and expose state separately as an accessible description; tutorial help is outside its button.

Lighthouse PR runs now measure checked-out source; pushes wait for changed production frontend bytes. Thresholds remain performance 0.9, accessibility 1 and CLS 0.1 over three runs. Local compressed Lighthouse samples: PentArena performance 0.92, accessibility 1, CLS 0; Candy Route 0.99/1/0; LIVADA and its game accessibility 1. Serpent's custom local Chromium intermittently returned NO_SCREENSHOTS, so its performance is not asserted here. Full GitHub CI remains the release gate.

A container and standard PORT support prepare the Arena server for hosting. No hosting account was connected and no public Arena was deployed. Docker execution was not available in this validation.

Physical Samsung S25, a real screen reader, and the CodePen editor remain unverified. Browser emulation and axe are not substitutes for those checks.
