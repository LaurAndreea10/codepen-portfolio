# Changelog

## 4.0.0 — 2026-10-13

The challenge entry is now small and centered on the rule; everything else moved to an optional Ghost Lab.

- **The page** (`index.html`, `style.css`, `main.js`) keeps the starter’s structure. The translation shows on load and updates as you type, and each word gets a one-line explanation of the rule that was applied. Five examples, one Copy button.
- **`ghosttalk.js`** is rewritten in numbered steps you can follow: `splitWord`, `startsWithVowel`, `ghostTalk`, `ghostTalkText`.
- **`ghosttalk.test.js`** holds the starter tests unchanged, plus 7 edge cases: capitals, punctuation, shouted words, sentences, `y` as a consonant, one-letter words, input without letters. `test-results.html` runs it in the browser.
- **Removed from the challenge page:** the dialects beyond the rule, games, story, companion, sound, fog and particle canvases, presentation mode and settings. They live on in `lab/` (Ghost Lab 3.1), which imports the same `ghosttalk.js`.

## 3.1.0 — 2026-10-13

- The challenge rule is now the heart of the app: `ghosttalk.js` exports `ghostTalk(word)` as the starter requires (owl → owl-boo, candy → andy-coo). The starter’s Jest tests pass unchanged, both in Jest and in the page’s Tests tab.
- It is the default dialect, shown first in its own group. It keeps capitals and punctuation, translates sentences and is recognised and translated back approximately.
- The page loads the rule as an ES module and hands it to the engine with `useRule()`, so the rule has one source. The single-file build inlines it.
- Jest runs the starter’s `import` syntax through Babel. 109 specs; Playwright checks the official rule at 390 and 1280 px.

## 3.0.0 — 2026-10-12

**Translator**
- Six new dialects: Spirit Box (morse), Runic, Emoji, Vampire, Victorian and Echo, for 14 in total. Seven translate back exactly.
- Ghost → Human recognises any dialect by itself, approximates the one-way ones and says which kind of result it is. A “peel another layer” button undoes chains.
- Dialect chains of up to three, and a comparison of all dialects side by side.

**Sound**
- Crypt echo on the voice and theremin, a playable theremin on the scene, and optional ambience (wind, owl, creaking door).

**Games**
- Ghostly hangman, a Wordle-style daily puzzle with shareable squares, and Arcade mode with 3 lives.
- Easy / Medium / Nightmare difficulty for every game.

**Story**
- Grown from 5 to 13 scenes with 5 endings. Three riddles need the translator. Adds the rival strigoi Zăbrel, who speaks in the Strigoi dialect.

**Companion**
- Moods, accessories (scarf, glasses, lantern), unlockable body colours, 14 achievements and confetti on level-ups.

**Sharing**
- Message links, PNG cards in three formats and a presentation mode.

**Accessibility and platform**
- Lexend reading font, text size up to 150%, keyboard shortcuts, offline PWA.

**Code**
- Split into `engine.js`, `ghost.spec.js`, `app.js` and `styles.css`.
- The same specs run in real Jest and in the page; the page also shows API coverage.
- New Playwright checks and a GitHub Actions workflow.
- `index.pen.html` remains the single-file version.

## 2.0.0 — 2026-10-12

- Merged the “Haunted Language Lab” prototype: Play, Story, Collection and Settings tabs, a ghost companion with XP, hats and scenes, favorites, dictation, PNG/TXT export and validated backups.
- Added the Sleepy and Secret code dialects (8 in total). Old hex codes without a prefix still decode.
- In-page Jest-style suite with 46 specs.

## 1.0.0 — 2026-10-12

- Translator with 6 dialects, EMF level, voice with a theremin, reverse translation for Classic and Mirror, séance log and 27 in-page specs.
