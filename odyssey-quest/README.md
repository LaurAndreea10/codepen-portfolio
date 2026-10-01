# Odyssey Quest · v2.1.1

**RO** — Aventură educativă cu 12 insule, 120 de probe și 11 moduri de joc. Inspirată din traseul lui Odiseu; povestea este o adaptare simplificată, harta este simbolică.

**EN** — Educational adventure with 12 islands, 120 trials and 11 game modes. Inspired by Odysseus’s voyage; the story is a simplified adaptation and the map is symbolic.

## Play / Joacă

Open `index.html` from a local HTTP server or GitHub Pages. `python3 -m http.server 8000` then visit `http://localhost:8000`. The separate `standalone.html` deliverable (rebuilt with `python3 build.py`) is a self-contained edition that can be opened directly offline. Installability and the service worker need HTTPS or localhost; an offline installation requires one successful online visit.

## Modes / Moduri

Story has 10 progressive trials per island; finish all 10 to unlock the next. Free exploration and Zen unlock every island without earning currency. Short Voyage and Daily Quest use 3 trials; Challenge, Navigator and Duo use 6; Tournament and Quiz use 12. Duo alternates two players on one device; select Duel for separate scores or Cooperation for a shared total. Workshop runs validated bilingual user questions. Shared seeds reproduce puzzles when mode, difficulty and software version match. Daily dates use Europe/Bucharest. Events rotate weekly; every event remains playable in the archive buttons.

## Mini-games

| Island | Mechanic |
|---|---|
| Lotus-Eaters | Matching pairs |
| Cyclops | Grid escape maze |
| Aeolus | Heading rotation |
| Laestrygonians | Safe-lane decisions |
| Circe | Ordered ingredients |
| Underworld | Prophecy ordering |
| Sirens | Symbol sequence, optional tones |
| Scylla & Charybdis | Current arithmetic |
| Thrinacia | Supplies and morale |
| Ogygia | Raft assembly |
| Scheria | Episode chronology |
| Ithaca | Adjustable bow aim |

Trials use deterministic variations; they are not 120 separately written narrative episodes. Games are turn-based and require no rapid reactions. Three difficulties vary memory/sequence sizes and aim tolerance; some educational tasks retain their rule at all difficulties.

## Controls & accessibility / Comenzi și accesibilitate

Tab and Enter/Space for buttons; arrow keys in the maze when focus is in the game. Optional maze swipes have equivalent arrow buttons. Auto scanning advances every 2.2 seconds; Space/Enter activates the highlighted action. Dark/light, high contrast, 100/115/130% text, reduced motion, child wording and simplified screen are available. OS reduced-motion preference is respected for decorative animation. Sound and vibration are opt-in and never required. Timer defaults off; 120/300/600 second options can be paused or extended, and timers suspend in a hidden tab or Settings. Zen ignores the timer. Hints remain available and reduce competitive scores, not story unlocks.

## Progress & data / Progres și date

Three local profiles. State uses `odyssey-quest-v2`; v1 progress migrates to completed chapters (10 trials each). Story rewards cannot be farmed by retrying. Other reward IDs include mode, seed and round index. Store skins cost earned shells only, with no purchases or account. JSON backup validation rejects malformed data; v1 backups are accepted. Names and opinions may be in a backup. Daily reward history retains up to 400 dates; scores keep the latest 30 runs; opinions keep 50 entries. Back up before clearing browser data. Switching profiles begins a new story round.

Opinions saved in the opinion panel stay local and can be exported; they are **not delivered to the author automatically**. To send feedback, the player can open a prefilled GitHub issue (see Connected expedition). There is no hosted feedback inbox, cloud sync or public ranking. The only online multiplayer is the experimental direct WebRTC duel described below.

## Connected expedition / Expediție conectată (2.1)

**Choices.** Five persistent fictional decisions change the account and the ending. They are separate from the poem, from trial progress and from backups.

**WebRTC duel (experimental).** Two devices exchange offer/answer codes manually through a private channel. The host can invite the partner to identical seeded trials at the same difficulty; scores are exchanged directly and are not certified. STUN: Cloudflare. There is no TURN relay, so strict networks (mobile data, school or office Wi-Fi) may block the connection; the game then explains the block and suggests the same Wi-Fi network or JSON export/import. See `QA.md` for what was and was not verified.

**Device transfer.** Sending a backup requires an explicit send on one device and an explicit accept on the other; the incoming state is validated before it replaces local data.

**Feedback.** “Send feedback to the author” opens a prefilled public GitHub issue. A GitHub account is required and nothing is published until the player submits it. No email is used.

## Workshop schema

```json
[{"ro":"Destinația?","en":"Destination?","answersRo":["Itaca","Troia","Roma"],"answersEn":["Ithaca","Troy","Rome"],"correct":0}]
```

Up to 50 questions. A route contains 1–24 comma-separated island numbers from 1 to 12. The shared expedition code determines a reproducible puzzle sequence. User data is rendered through textContent, not HTML.

## PWA

Manifest includes 192/512px icons. Service worker is scoped to this game directory, uses a versioned cache and removes only earlier Odyssey caches. Core files, privacy/docs and the v1.0.0 and v2.0.1 archives are precached. Network-first responses fall back to cached files. Updating does not force reload during a game; close all game tabs to activate a waiting version.

## Verification

`node tests/engine.cjs` checks all 120 progression transitions, repeat rewards, purchase rules, 360 deterministic puzzle variants, mode plans, backup validation, legacy migration and Bucharest date boundaries.

`node tests/browser.cjs` uses Playwright (dev dependency) with Chromium. `BASE_URL=http://localhost:8000` can override the tested origin. It checks game interactions, all modes, profiles, persistence, preferences, pause/timer, export/import and mobile overflow. Browser tools are for development only; the app has zero runtime dependencies. See `QA.md` for the actual run results and remaining device checks.

## Integration

`data-mini-game-id="odyssey-quest"` identifies the app. Each success dispatches `odyssey-quest:result` on document. Embedded copies send `GAME_SCORE` only to the explicitly configured parent origin and the Odyssey game ID. Arcade launcher verifies source frame and origin before displaying the score; this standalone experience does not award ownership of the main board’s tiles.

## Self-hosted symbols

A small subset of Noto Emoji provides symbols when system fonts lack them. The OFL license is included in `fonts/OFL-LICENSE.txt`; no font service is contacted. The hero and map ship use SVG.

## History

`versions/v1.0.0.html` preserves the original quiz edition and `versions/v2.0.1.html` the last edition before connected play. `CHANGELOG.md` records changes. Git history provides version control after publishing. See `PRIVACY.md` and `LICENSE`.
