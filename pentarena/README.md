# PentArena · v2.3.0

[Joacă / Play](https://laurandreea10.github.io/codepen-portfolio/pentarena/) · [Changelog](CHANGELOG.md) · [Istoric public / Public history](changelog.html)

## RO

Continuarea partidei cu scor și pozițiile mingilor restaurate pe pauză; antrenament ghidat cu obiective detectate din joc; provocare săptămânală cu recompensă unică; AI echilibrat, defensiv și ofensiv; indicii de putere, posesie și timing; butoane tactile ajustabile, efecte vizuale și volum al efectelor configurabile.


Teren extins după alegerea probei, scor lateral pe mobil orizontal, fullscreen opțional, ghid în trei pași cu pauză, antrenament fără timer la baschet/fotbal, mute în meci și temă dark/light/automată. Backupuri vechi compatibile; validare nested mai strictă.


Cinci sporturi arcade într-un singur canvas: **baschet, fotbal, air hockey, volei și biliard 8-ball**. Joci contra unui AI cu trei niveluri de dificultate sau contra unui prieten pe același dispozitiv.

- **Moduri:** meci rapid, turneu Pentatlon (3 puncte victorie, 1 egal), carieră în trei ligi cu rivali diferiți, provocarea zilei.
- **2 jucători:** J1 cu W A S D + Space (Shift sprint), J2 cu săgeți + Enter (Shift dreapta sprint). Pe ecran tactil, fiecare jucător își folosește jumătatea de teren. Baschetul și biliardul se joacă pe ture.
- **Modificatori** (opționali în meciul rapid, impuși de ligi): vânt și coș mobil la baschet, bonusuri pe masa de air hockey, gol de aur la fotbal.
- **Progres local:** XP, niveluri, monede, vestiar cosmetic, 16 realizări, statistici pe sport, backup JSON validat.
- **Telefon pe verticală:** fotbalul, air hockey-ul și biliardul se rotesc automat ca terenul să umple ecranul, cu poarta ta jos; textul rămâne drept, iar săgețile urmează direcțiile de pe ecran.
- **Accesibilitate:** tastatură, mouse și touch la toate probele; anunțuri de scor pentru cititoare de ecran; contrast ridicat; mișcare redusă (fără tremurat, particule și reluări).

## EN

Resume matches with scores and ball positions restored on pause; practical training with objectives detected from gameplay; a weekly challenge with a one-time reward; balanced, defensive and offensive AI; power, possession and timing cues; adjustable touch buttons, visual effects and sound-effects volume.


Expanded court after event selection, side scoreboard on landscape phones, optional fullscreen, paused three-step guide, untimed basketball/football practice, in-match mute and dark/light/system theme. Compatible old backups and stricter nested validation.


Five arcade sports on one canvas: **basketball, football, air hockey, volleyball and 8-ball pool**, against a three-level AI or a friend on the same device.

- **Modes:** quick match, Pentathlon tournament (3 points per win, 1 per draw), three-league career with different rivals, daily challenge.
- **Two players:** P1 on W A S D + Space (Shift sprint), P2 on arrows + Enter (right Shift sprint). On touch screens each player uses their half. Basketball and pool alternate turns.
- **Modifiers** (optional in quick play, set by each league): basketball wind and moving hoop, air-hockey power-ups, football golden goal.
- **Local progress:** XP, levels, coins, cosmetic locker, 16 achievements, per-sport stats, validated JSON backup.
- **Portrait phones:** football, air hockey and pool rotate automatically so the field fills the screen with your goal at the bottom; text stays upright and arrow keys follow screen directions.
- **Accessibility:** keyboard, mouse and touch in every event; screen-reader score announcements; high contrast; reduced motion (no shake, particles or replays).

## Structure

| File | Role |
| --- | --- |
| `game.js` | Engine, five sports, AI, progression, UI (no dependencies) |
| `style.css` | Layout and self-hosted fonts |
| `pwa.js`, `sw.js`, `manifest.webmanifest` | Install, offline cache, safe updates (no reload mid-match) |
| `test-core.cjs` | Headless simulation: every sport finishes vs AI on all difficulties, 2P, golden goal, replays, power-ups, spike, basketball AI under wind/moving hoop, pool spin and ball in hand, tournament/career unlocks, daily seed, locker, backup validation |
| `test-browser.mjs` | Playwright at 360, 390, 844 (landscape) and 1440 px: all sports, pause, results, persistence, 2P multitouch/keys, dialogs, RO/EN, backup, daily, tournament, offline, axe |

## Run and checks

```sh
python3 -m http.server 8000   # open http://localhost:8000/pentarena/
node --check pentarena/game.js
node pentarena/test-core.cjs
npm install --no-save playwright@1.55.0 @axe-core/playwright@4.10.2 && npx playwright install chromium
node pentarena/test-browser.mjs
```

The checks prove logic, layout at the tested widths, touch emulation and automated accessibility rules. They do not prove feel on physical phones, audible sound quality or real screen-reader use; those remain unverified.

Fonts: Fraunces, Inter and JetBrains Mono under the SIL Open Font License (see `fonts/`).


## Checkpoints and weekly progress

Match snapshots stay on this device, are restored paused, and expire after seven days (daily matches expire when the day changes). Version or progression mismatches discard only the snapshot. Transient held inputs and replay buffers are cleared. Pool restores the cue ball as the same object referenced in the balls array. Completed match snapshots are removed before rewards are applied. JSON progression backups preserve weekly rewards, training completion and the new preferences; old backups receive safe defaults.
