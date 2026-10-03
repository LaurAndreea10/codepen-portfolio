# Serpent Prism · v1.8.0

[Joacă / Play](https://laurandreea10.github.io/codepen-portfolio/serpent-prism/) · [Changelog](CHANGELOG.md) · [Istoric public / Public history](changelog.html)

## RO

Joc original care combină deplasarea Snake cu potrivirea bilelor Zuma. Șarpele furnizează muniția din coadă; minimum trei bile identice sunt eliminate. O singură arenă, traseu în jurul șarpelui și lansare din colț.

- Moduri: Poveste (progres până la nivelul 100), Arcade, Puzzle, Zen, Provocarea zilei și Pe ture.
- Ușor implicit: Colectează → Lansează; țintă sugerată și mișcare la comandă. În Clasic, șarpele înaintează automat.
- Tutorial Despre joc, RO/EN, dark/light, simboluri pe bile, contrast ridicat și mișcare redusă.
- Control prin tastatură, swipe și butoane; mod textual pe ture pentru selectarea țintelor.
- Șase decoruri adaptate din SlideStorm Arena, grafica de tip 3D în Canvas 2D, efecte sonore și ambianță generate cu Web Audio.
- Progres și preferințe locale, magazin cosmetic; fără cont sau sincronizare între dispozitive.

Taste: săgeți (sau W/A/S/D, I/J/K/L din Preferințe), Spațiu pentru lansare când arena are focus, Q/E pentru țintă, P pentru pauză, R pentru inversarea muniției. Sunetul începe după o apăsare; mute și volume separate sunt disponibile.

## EN

An original game combining Snake movement with Zuma-style orb matching. Tail orbs become ammunition; matches of at least three are cleared. One arena, a route around the snake and a corner Launch control.

Six modes, default Easy assistance, a five-step tutorial, Romanian/English, dark/light, color symbols, high contrast, reduced motion, keyboard/touch controls and text-based turns. Six SlideStorm-inspired environments use Canvas 2D depth effects. Web Audio provides effects and ambience. Progress and cosmetic unlocks stay in localStorage on this device.

Arrows (or configurable W/A/S/D, I/J/K/L), Space when the canvas is focused, Q/E targets, P pause, R ammunition reversal. Audio starts after user interaction and has mute and separate volumes.

## Run and checks

Serve the repository with `python3 -m http.server 8000` and open `/serpent-prism/`. No dependencies or build step. `?lang=en` and `?lang=ro` select the initial language.

```sh
node --check serpent-prism/game.js
node serpent-prism/test-core.cjs
node serpent-prism/test-audio.cjs
```

Tests use DOM/Canvas and AudioContext stubs to verify logic and audio routing. They do not prove visual quality, audible playback or real screen-reader usability. Those remain unverified on physical devices. The game is not presented as an installable PWA.

## History

Versions 1.0.0–1.4.0 are documented from the development iterations on 2026-10-02. The first GitHub portfolio publication contained the 1.4.0 source; older source snapshots are retained in the original Site history, not fabricated as GitHub tags.

## v1.5.0 — Ghid și progresie / Guide and progression

Primul nivel ghidat, fără presiune de timp până la prima potrivire; bonusuri pentru combo-uri și porți, niveluri cu două trasee, rezultate de rundă și progres păstrat. Bile și controale mai mari; verificare automată touch/mobil și axe prin GitHub Actions.

Guided first level with time frozen until the first match; combo and gate bonuses, dual-route levels, round results and saved progress. Larger orbs and controls; automated touch/mobile and axe checks through GitHub Actions.

Nivelul ghidat se poate relua din Despre joc. Bonusurile sunt opționale; eliminarea șirului permite continuarea. / Replay the guide from About. Bonuses are optional; clearing the chain allows progression.

[Browser/mobile workflow](https://github.com/LaurAndreea10/codepen-portfolio/actions/workflows/serpent-prism.yml) runs real browser tests at five viewports, dispatched touch input, audio-context activation, axe checks and screenshots. It does not replace physical-device, audible playback or screen-reader testing.


Serpent Prism v1.6.0 (2026-10-03): assisted collection moves the snake to arena orbs; Aqua/Dune/Neon story worlds; accessible RO/EN level map and replay without losing unlocked progress. Reduced motion and turn-based collection resolve immediately.


## v1.7.0 — 2026-10-03

RO: Destinație și drum evidențiate; atingere pentru schimbarea destinației și oprire explicită. Aqua încetinește bilele 4s/12s; Dune avertizează cu 2s înainte de mutarea zidului; fiecare a treia lansare reușită în Neon trimite o bilă spre o pereche de aceeași culoare de pe celălalt traseu, dacă există. Fără presiune de timp oprește avansarea traseului.

EN: Highlighted collection route/destination, tap to reroute and explicit stop. Aqua slows orbs for 4s/12s; Dune warns 2s before moving its wall; every third successful Neon shot echoes into a matching pair on the other route, when available. No-time-pressure setting stops route advancement.

Stars: 1 for clearing; 2 with a ×2 cascade; 3 with a ×2 cascade plus the level bonus, or at least four matches on levels without a combo/gate bonus. Best stars persist; new stars award five prisms each. Free skins at 6/15/30 total stars. Daily goal: clear the seeded cascade chain with a ×2 cascade; 15 prisms once per local calendar day. Rewards and progress are local to this browser. No server verification or account synchronization.


## v1.8.0 — 2026-10-03

RO: Grafică refăcută: bile de sticlă cu reflexii și rostogolire, decoruri animate pe straturi (raze și bule Aqua, dune și soare, furtună cu fulgere, recif de corali, nori, grilă Neon), traseu 3D, portal-vârtej și semnal de pericol lângă final. Mișcare naturală: șarpele alunecă fluid între celule, cu ondulare, clipit și limbă; bilele lansate zboară până în șir, golurile se închid lin, iar combinațiile explodează în cascadă cu particule și scor plutitor. Mișcarea redusă și contrastul ridicat păstrează afișarea statică.

EN: Graphics overhaul: glass orbs with reflections and rolling, layered animated scenery (Aqua light rays and bubbles, dunes and sun, storm lightning, coral reef, clouds, Neon grid), bevelled 3D route, vortex portal and end-of-route danger glow. Natural motion: the snake glides smoothly between cells with slither, blinking and tongue flicks; launched orbs fly into the chain, gaps close smoothly and combos burst in sequence with particles and floating score. Reduced motion and high contrast keep a static presentation.
