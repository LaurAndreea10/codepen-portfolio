# Ghost Talk

**v4.0.0 · 2026-10-13** · [Play](https://laurandreea10.github.io/codepen-portfolio/ghost-talk/) · [Test results](https://laurandreea10.github.io/codepen-portfolio/ghost-talk/test-results.html) · [Ghost Lab (optional extras)](https://laurandreea10.github.io/codepen-portfolio/ghost-talk/lab/) · [Changelog](CHANGELOG.md)

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

## Files

| File | Role |
| --- | --- |
| `ghosttalk.js` | The rule: `ghostTalk`, `ghostTalkText` and the two helpers above |
| `ghosttalk.test.js` | The starter tests, unchanged, plus the edge cases: capitals, punctuation, shouting, sentences, `y`, one-letter words, no letters |
| `index.html`, `style.css`, `main.js` | The page: the translation updates as you type, and every word gets a one-line explanation |
| `test-results.html` | Runs `ghosttalk.test.js` in the browser |
| `lab/` | **Ghost Lab**, optional: 14 more dialects, games, a story and effects. It imports the same `ghosttalk.js`. |

The page has no canvas, no background animation and no sound. The only motion is the 👻 in the title, and it stops when the device asks for reduced motion.

## Run the tests

```bash
cd ghost-talk
npm install
npx jest ghosttalk.test.js   # the challenge rule: 9 tests
npm test                     # everything, Ghost Lab included: 116 tests
```

Babel is only there so Jest can run the starter’s `import` syntax. Browser checks run in GitHub Actions ([workflow](../.github/workflows/ghost-talk-tests.yml)): `tests/test_page.py` for this page at 360 and 1280 px, and `lab/tests/test_browser.py` for the lab.

## On CodePen

Use the starter’s files: paste `ghosttalk.js` into `ghosttalk.js`, the tests into the test file, and `index.html`, `style.css` and `main.js` into the matching files. The tests turn green on CodePen the same way.

## Validation and limits

- Jest: the 2 starter tests and 7 edge-case tests pass, with 100% of `ghosttalk.js`’s functions and lines covered.
- Chromium at 360 px (touch emulated) and 1280 px: the conversion shows on load and updates as you type, examples work, there is no horizontal scroll and no page errors, and `test-results.html` passes.
- Not yet checked on a real phone or with a real screen reader.
