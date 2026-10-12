# Ghost Talk — Haunted Language Lab

**v3.0.0 · 2026-10-12** · [Play](https://laurandreea10.github.io/codepen-portfolio/ghost-talk/) · [Single-file version](index.pen.html) · [Changelog](CHANGELOG.md)

CodePen Challenge entry that started as “type a word and see how a ghost would say it”. It grew into a bilingual (RO/EN) ghost-language lab: a translator with 14 dialects, 12 games, a branching story, a ghost companion and a Jest suite that also runs inside the page.

## What’s inside

**Translator**
- 14 dialects. Seven translate back exactly: Classic (`〰` per EMF level), Mirror, Secret code (hex), Spirit Box (morse), Runic (futhark), Emoji, Poltergeist. Seven are one-way and decode approximately: Whisper, Banshee, Strigoi, Sleepy, Vampire, Victorian, Echo.
- Ghost → Human mode recognises the dialect on its own and says whether the result is exact or approximate. Chains are peeled one layer at a time.
- Dialect chain (up to three in a row) and a side-by-side comparison of all 14.
- EMF level 1–5 (a K-II meter) controls how haunted the output gets.

**Voice and sound** (Web Audio + Speech Synthesis, everything generated in the browser)
- A theremin swoop plus a speech voice tuned per dialect; optional crypt echo.
- Playable theremin: touch the scene, left–right is pitch, up–down is volume.
- Optional ambience: wind, an owl and a creaking door.

**Games** — untimed, three difficulty levels (Easy / Medium / Nightmare)
Guess the word, Ghost typing, Echo memory, Haunted letters, Secret séance, Ghost choir, BooScary, Ghostly hangman (the ghost fades with each miss), Daily puzzle (Wordle-style, shareable squares), RO/EN vocabulary, Arcade (mixed rounds, 3 lives) and Two players.

**Story** — “The lost letter”: 13 scenes, 5 endings, three riddles that need the translator, and a rival, the strigoi Zăbrel, who speaks in his own dialect.

**Companion** — name, level and XP, five badges, 14 achievements, moods (happy, bored, sleepy, excited), hats, accessories, body colours and scenes unlocked with XP, ectoplasm confetti on level-ups.

**Sharing** — favorites, séance log, links that open a message (`#msg-…`), PNG cards (square, 9:16 story, 3:1 banner), presentation mode, TXT and JSON backup with validation.

**Accessibility and platform** — keyboard shortcuts (`?` lists them), reduced motion, high contrast, light “Dawn” theme, Lexend reading font, text size up to 150%, RO/EN, offline PWA after the first visit.

## Files

| File | Role |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Interface |
| `engine.js` | Pure logic: dialects, decoder, game rules, story, saved-data validation. Works in the browser and in Node. |
| `ghost.spec.js` | Test definitions shared by both runners, plus the in-page runner with API coverage |
| `tests/ghost.test.js` | Real Jest entry point |
| `tests/test_browser.py` | Playwright checks in Chromium (390 and 1280 px, offline) |
| `build-standalone.cjs` | Builds `index.pen.html`, the one-file version for CodePen |
| `sw.js`, `manifest.webmanifest`, `icon.svg` | Offline install |

## Run the tests

```bash
cd ghost-talk
npm install
npm test                 # 96 specs with real Jest
npm run test:coverage    # line coverage for engine.js (threshold 90%)
npm run build:standalone # refresh index.pen.html after editing
```

Browser checks, from the repository root:

```bash
python -m http.server 8000 --bind 127.0.0.1 &
GHOST_URL=http://localhost:8000/ghost-talk/ python ghost-talk/tests/test_browser.py
```

GitHub Actions runs all three on every change to `ghost-talk/` ([workflow](../.github/workflows/ghost-talk-tests.yml)).

## Validation and limits

- 96 Jest specs pass, with about 96% line coverage of `engine.js`; the same specs pass in the page and call all 38 public engine functions.
- Playwright in Chromium passes at 390 px (touch emulated) and 1280 px: no horizontal scroll, translation and decoding, a BooScary round, keyboard hangman, the story riddle, in-page tests and an offline reload.
- Not yet checked on a real phone, with a real screen reader, or for audible sound quality. Dictation needs a browser with speech recognition (Chrome, Edge). Speech voices depend on the device.
- Saves from v1 (“Haunted Language Lab”, key `ghostTalk`) and v2 (`ghosttalk:v2`) are migrated automatically. Progress stays in this browser only.

No runtime dependencies, no server, no account. Jest and Playwright are used only for development.
