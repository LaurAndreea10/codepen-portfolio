# Random Constellation — Version History

## 2026-11-03 — v1.1.2 · Space games

- RO: Butonul din header duce acum la VOID HUNTER original. Secțiune nouă „Jocuri spațiale” cu trei carduri: VOID HUNTER, VOID HUNTER · random() și VOID ORACLE (ultimele două primesc limba aleasă).
- EN: The header button now opens the original VOID HUNTER. New “Space games” section with three cards: VOID HUNTER, VOID HUNTER · random() and VOID ORACLE (the last two receive the chosen language).

## 2026-11-03 — v1.1.1 · VOID ORACLE button

- RO: Butonul „🚀 Joacă VOID ORACLE” din header duce la jocul shooter de tip VOID HUNTER, în limba aleasă.
- EN: A “🚀 Play VOID ORACLE” header button opens the VOID HUNTER-style shooter in the chosen language.

## 2026-11-02 — v1.1.0 · Night Oracle merge

- RO: Am integrat Night Oracle în observator: panoul „Oracolul constelației” (o prezicere din 12, trei zaruri cu total calculat printr-un counter CSS, nuanță norocoasă din paleta activă, înclinare aleatoare) și butonul „Leagă zarurile”, care demonstrează cheia comună `random(--dice, …)`. Scena primește nebuloase și meteori generați cu `random()`. „Generează alt cer” și schimbarea atmosferei aruncă și oracolul; tasta R aruncă doar oracolul.
- EN: Merged Night Oracle into the observatory: a “Constellation Oracle” panel (one of 12 fortunes, three dice whose total is a CSS counter, a lucky hue from the active palette, random tilt) and a “Link the dice” toggle demonstrating the shared `random(--dice, …)` key. The scene gains `random()` nebulae and meteors. “Generate another sky” and atmosphere changes also roll the oracle; the R key rolls only the oracle.
- Fixed: star size and hue used the non-standard `element-scoped` keyword, which made those values invalid in browsers that support `random()`; they now use plain `random()`. `--size` and `--hue` are registered with `@property`, so each star's glow matches its own size and colour.
- Accessibility: the oracle result is exposed as a group label and announced in a polite live region; pause, reduced motion and Zen mode cover the new animations; RO/EN covers all new text.
- Fallback: without `random()`, only the oracle and scene effects get values from JavaScript; the stars keep the static fallback.
- Automated Chromium checks (fallback path) at 1280 and 390 px, dark/light, RO/EN, linked dice, R key and Zen. The native `random()` path, physical phones and screen readers remain unverified.

## 2026-11-02 — v1.0.0 · Finalizat / Completed

- RO/EN cosmic observatory for the November CSS Random() challenge.
- CSS `random()` drives star position, size, color, opacity, timing, tilt and 3D depth; JavaScript manages controls and element count.
- Added density, brightness, pulse, depth, field formation and keyboard-controlled tilt; three-sky local save/restore gallery; regeneration, comet effect, 2D/3D view, optional parallax, Zen mode and CSS learning panel.
- Added dark/light themes, high contrast, reduced motion, keyboard access, focus indicators, live announcements, responsive layout and static fallback.
- Added local settings, shareable recipe links and PNG export without external dependencies.
- Integrated into the project catalogue, Romanian and English recently completed lists, portfolio history and sitemap.
- Audited all 40 feature points; see `FEATURE-CHECKLIST.md`. Fixed shared recipe URLs to restore both tilt values and removed duplicate control listeners.
- Fixed mobile static-fallback initialization: language updates no longer replace the observatory section's child scene. Verified translated targets are leaf elements, so stars, planet and controls remain in the DOM.
- Improved narrow-screen composition: the scene caption moves above the field, the fallback notice spans the bottom, and the redundant “mod static” suffix is removed from the notice.
- Manual device, browser support and screen-reader verification are not claimed here.
