# Ghost Talk

**v4.1.0 · 2026-10-13** · [Play](https://laurandreea10.github.io/codepen-portfolio/ghost-talk/) · [Simple version](https://laurandreea10.github.io/codepen-portfolio/ghost-talk/simple/) · [Test results](https://laurandreea10.github.io/codepen-portfolio/ghost-talk/test-results.html) · [Changelog](CHANGELOG.md)

Entry for the [CodePen Challenge, October 2026: Ghost Talk](https://codepen.io/challenges/2026/october): type a word and see how a ghost would say it.

## The rule

| The word starts with | What happens | Example |
| --- | --- | --- |
| a vowel (a, e, i, o, u) | add `-boo` | `owl` → `owl-boo` |
| a consonant | move that letter to the end, add `oo` | `candy` → `andy-coo` |

From the challenge’s list of ideas, capital letters and punctuation are kept: `Happy Halloween, candy!` → `Appy-hoo Alloween-hoo, andy-coo!`

## How `ghostTalk(word)` works, step by step

All of it is in [`ghosttalk.js`](ghosttalk.js).

1. **Split off the punctuation.** `splitWord("Candy!")` returns `{ before: "", letters: "Candy", after: "!" }`. The rule only touches `letters`.
2. **Skip what isn’t a word.** If `letters` doesn’t start with a letter (`""`, `"42"`, `"👻"`), the word comes back unchanged.
3. **Pick the rule.** `startsWithVowel(letters)` compares the first letter, without its accent, to `a e i o u`. So `ă`, `î` and `é` count as vowels, and `y` is a consonant.
4. **Vowel:** return `letters + "-boo"`.
5. **Consonant:** take the first letter off, put it at the end and add `"oo"`. If the word was capitalized (`Candy`), the capital moves to the new first letter (`Andy-coo`). A shouted word stays shouted (`BOO` → `OO-BOO`). A lone consonant just becomes `"boo"`.
6. **Put the punctuation back:** `before + result + after`.

`ghostTalkText(text)` splits a sentence on spaces, runs `ghostTalk` on every word and keeps the spaces as they were.

`describeWord(word)` reports which rule was applied (`vowel`, `consonant` or `none`), which letter moved and the result. Both pages build their on-screen explanation from it.

## Files

| File | Role |
| --- | --- |
| `ghosttalk.js` | The rule: `ghostTalk`, `ghostTalkText`, `describeWord` and the two helpers above |
| `ghosttalk.test.js` | The starter tests, unchanged, plus edge cases: capitals, punctuation, shouting, sentences, `y`, one-letter words, no letters, `describeWord` |
| `index.html`, `styles.css`, `app.js` | **The full app.** The rule is the default dialect: the translation shows on load, updates on every keystroke and is explained word by word. On top: 14 more dialects, 12 games, a story, a ghost companion, sound, sharing and settings. |
| `engine.js`, `ghost.spec.js` | The full app’s logic and its specs, run by Jest and in the page’s Tests tab. The engine receives the rule from `ghosttalk.js` through `useRule()`, so the rule exists once. |
| `simple/` | **The simple version**: only the rule, the per-word explanation, examples and Copy. |
| `test-results.html` | Runs `ghosttalk.test.js` in the browser |
| `index.pen.html` | The full app in one file, for CodePen or sharing |
| `sw.js`, `manifest.webmanifest`, `icon.svg` | Offline install |

**Effects on phones:** fog, particles and letters fading in are a setting. On a first visit from a phone they start off; everything else works the same. Reduced-motion devices never get them.

## Run the tests

```bash
cd ghost-talk
npm install
npx jest ghosttalk.test.js   # the challenge rule: 10 tests
npm test                     # everything: 118 tests
```

Babel is only there so Jest can run the starter’s `import` syntax. Browser checks run in GitHub Actions ([workflow](../.github/workflows/ghost-talk-tests.yml)): `tests/test_browser.py` for the full app at 390 and 1280 px (offline included), and `tests/test_page.py` for the simple page at 360 and 1280 px.

## On CodePen

Use the starter’s files: paste `ghosttalk.js` into `ghosttalk.js` and the tests into the test file. For the page, either the simple version (`simple/index.html`, `style.css`, `main.js`, with the import path changed to `./ghosttalk.js`) or the full app (`index.html`, `styles.css`, `engine.js`, `ghost.spec.js`, `app.js`). The tests turn green on CodePen the same way.

## Validation and limits

- Jest: all 118 tests pass, including the 2 starter tests and 8 edge-case tests, with 100% of `ghosttalk.js`’s functions and lines covered.
- Chromium, full app at 390 px (touch emulated) and 1280 px: the rule shows on load and updates instantly, the step explanation appears, effects are off on the phone by default, games, story, in-page tests and offline reload work. Simple page at 360 and 1280 px, and `test-results.html`, pass.
- Not yet checked on a real phone or with a real screen reader.
