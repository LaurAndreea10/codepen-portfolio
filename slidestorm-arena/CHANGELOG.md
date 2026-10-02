# Changelog

## v2.2.0 — 2026-10-02

RO — Grafică nouă, într-un strat de randare separat; regulile, salvările și comenzile nu s-au schimbat. Zece teme de capitol cu decor propriu (palmieri, dune, stadion, recif, golf, canion, poduri printre nori, ecluze, insulă, finala nocturnă). Tobogan cu pereți, balustradă, apă în mișcare și obiecte pe margine. Energia, barierele, castelele, ecluzele, rampele și comorile sunt desenate și își păstrează simbolurile (◇, X, ▣, ◎, ↟, ☆); ecluza care blochează apare în fața mingii. Minge cu umbră, rotație și cusături pe sport; schimbare lină de bandă. Ținte distincte pentru toate cele opt sporturi; indicatorul arată lățimea reală a regulii (inclusiv golf sub 0,28 și ținta care se îngustează), portarul de handbal arată când poți arunca, polo arată pasa 1/2. Valul de pe banda centrală e vizibil cu două secunde înainte. Fantoma de cursă se mișcă după propriul timp. Ploaie, zăpadă de Crăciun, fulgere rare (cel mult unul la ~5 s), particule, randare HiDPI. Setarea Calitate controlează efectele; Auto coboară singur la Low dacă dispozitivul nu ține ritmul. Mișcarea redusă oprește particulele, tremurul, fulgerele și animațiile meteo; contrastul ridicat rămâne plat. Cache offline actualizat.

EN — New graphics in a separate rendering layer; rules, saves and controls are unchanged. Ten chapter themes with their own scenery. Walled slide with rails, flowing water and roadside props. Energy, barriers, castles, locks, ramps and treasures are drawn and keep their symbols (◇, X, ▣, ◎, ↟, ☆); a blocking lock is drawn in front of the ball. Shaded spinning ball with sport-specific seams; smooth lane changes. Distinct targets for all eight sports; meters show each rule's real width (including golf below 0.28 and the narrowing target), the handball keeper shows when the shot is open, polo shows pass 1/2. The centre-lane wave is visible two seconds ahead. The race ghost moves on its own timeline. Rain, Christmas snow, rare lightning (at most one per ~5 s), particles and HiDPI rendering. The Quality setting controls effects; Auto drops to Low by itself when the device cannot keep up. Reduced motion turns off particles, shake, lightning and animated weather; high contrast stays flat. Offline cache bumped.

Validation: state and Worker API tests pass, plus a new check that the graphics layer parses and reassigns only draw(). In headless Chromium the same scripted inputs give identical scores, goals and event states before and after across 11 modes, with no console errors; screenshots reviewed for all chapters, eight arenas, contrast and a 390 px viewport. Real phone GPU performance, touch and screen readers remain unverified. The separate standalone v2.1.0 file was not part of this repository; this release builds on the published v2.0.1.

## v2.0.1 — 2026-10-02

RO — Corectează descrierea imediată a benzii și instrucțiunile accesibile pentru toate cele opt sporturi. Importurile JSON păstrează controalele native focalizabile. Traduce elementele constructorului, calitatea grafică și numele accesibile ale selectorului de evenimente/comenzilor. Lungimea traseului creat influențează viteza parcurgerii în coordonatele interne normalizate; timerul păstrează timpul real. Actualizează cache-ul offline. Păstrează schema salvărilor v2 și istoricul v1.0.0/v2.0.0.

EN — Fix immediate lane descriptions and sport-specific nonvisual instructions. Keep JSON imports keyboard accessible through native file inputs. Translate builder elements, graphics quality and accessible control names. Custom-route length now scales traversal speed while elapsed time stays in real seconds. Bump the offline cache; retain the v2 save schema and earlier release history.

Validation: state and Worker API tests pass, including new lane-description, eight-sport instruction and route-length regressions. Actual phone touch, TalkBack/VoiceOver and offline browser QA remain unverified; no accessibility certification claim.

## v2.0.0 — 2026-10-01

Expanded the existing structure to 100 generated levels, 10 chapters, 8 sports and 11 modes. Added branching routes, breakable sandcastles, sluice switches, wave hazards, springboards, treasures, combo challenges, training, exploration and local two-player turns. Added route builder with JSON import/export, inventory, local ghosts, daily/weekly missions, round history and sport stats. Added separate assistance controls, step-by-step play, keyboard remapping, gamepad, sensitivity, text size, left-handed controls, focused play and optional haptics. Added PWA manifest and versioned offline shell. Added asynchronous private online rooms and player-reported leaderboard through a Worker and D1. Migrates v1 backups; validates all nested state and retains previous valid save.

Validation: state/API tests; visual/touch/screen-reader testing unavailable in current runtime. Online audience remains unchanged; no anti-cheat or accessibility certification claim.

## v1.0.0 — 2026-10-01

Original 12-level game: three sports, five modes, local Shop and progress, RO/EN, themes, high contrast, reduced motion, single-action assistance, touch gestures, keyboard and strict JSON backup validation.

Original source retained at `releases/v1.0.0.html`.
