# SlideStorm Arena · v2.2.0

**RO** — Parc sportiv în browser, fără dependențe în client. Structură: Joc → Niveluri → Shop → Progres → Setări → Despre / Istoric.

**EN** — Browser sports park, no client dependencies. Structure: Play → Levels → Shop → Progress → Settings → About / History.

## Features / Funcții

- 100 deterministically generated levels across 10 chapters, 8 sports and 11 modes.
- Story, Race, Daily, Championship, Zen, Challenge, Training, Explore, Local Party, Custom Route and Online Room.
- Lane forks, breakable sandcastles, sluice switches, springboards, treasures and wave hazards.
- Cosmetic Shop, inventory, daily/weekly missions, local race ghosts, sport stats and 100-entry round history.
- Canvas graphics (v2.2.0): ten chapter themes, walled slide with flowing water, drawn route elements that keep their symbols, distinct targets and rule-accurate meters for all eight sports, weather and particles, HiDPI; the Quality setting (Auto/Low/High) scales effects. Rendering lives in a separate script and never changes game state.
- RO/EN, light/dark, high contrast, reduced motion, separate steering/jump/aim assistance, adjustable speed and difficulty.
- Step-by-step mode stops real-time progression; keyboard remapping, gamepad, swipe, buttons and a directional touch pad.
- Versioned JSON backups, v1 migration, import preview, strict nested validation, previous-save recovery and route JSON exchange.
- Offline shell via service worker after first successful load. The standalone HTML also runs offline, except online rooms.
- Online rooms are asynchronous trials on identical deterministic routes. Scores are player-reported, with no anti-cheat guarantee or real-world prizes. Room access uses hashed membership tokens; rooms expire after 24 hours. Leaderboard covers 30 days.

## Controls / Comenzi

Default: Arrow Left/Right or A/D for lanes; Space to jump; Enter to throw; P/Escape to pause. Remap in Settings. Mobile: swipe horizontally for a lane, swipe up to jump, tap to jump or throw in the arena. Buttons are an alternative. Gamepad: left stick/D-pad, A jump, B throw, Start pause.

Basketball uses the central timing zone. Football uses the target lane. Volleyball uses an airborne hit. Handball adds a blocking phase. Water polo takes a pass then a shot. Mini-golf uses low meter power. Bowling uses central timing. Target shooting narrows its timing window. Assistance or step mode simplifies aiming.

## Events / Evenimente

Summer: June–August; Halloween: October 25–November 1; Christmas: December 20–January 6; Easter: Western/Gregorian Easter, three days before to two days after. Dates use the device timezone. Events only become selectable in their period. This is a game calendar, not a claim about Romanian public holidays.

## Privacy / Confidențialitate

Local progress and settings remain in browser storage. Optional online play sends a nickname, score, sport, level and elapsed time to the game's server. Names and scores may appear on the shared leaderboard. Do not use real names or private information. Membership tokens are kept only in the active page session; the database stores token hashes. Hosting may process technical access data separately.

## Validation / Verificări

Run `node test-state.cjs` for gameplay, backup migration and validation. Run `node test-online.cjs` for the Worker API using an in-memory SQLite adapter. Build with `node build.mjs`; schema migrations are generated with Drizzle Kit and retained in source. Browser visual, actual touch and screen-reader QA remain unverified in the current execution environment.

The hosted Sites edition currently retains its owner-only access. Public GitHub Pages can serve local/offline play; shared online access depends on the hosted server's audience and availability. No claim of WCAG certification is made.
