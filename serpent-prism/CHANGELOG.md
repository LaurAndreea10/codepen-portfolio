# Serpent Prism — Changelog

## 2.0.0 — 2026-10-03

**RO.** Interfață „Prism Glass”: fundal de pagină care preia culorile decorului curent, panouri de sticlă mată, logo-prismă animat, titluri Fraunces și cifre JetBrains Mono, scor care „sare” la fiecare punct, selector de moduri segmentat, butonul Lansează cu puls, bile de sticlă și în panoul de muniție (următoarea lovitură evidențiată), atelier cu mostre de culoare, bară de progres curcubeu, ecran de rezultat animat cu stele, dialoguri și ghid restilizate. Tema luminoasă, contrastul ridicat și mișcarea redusă au variante proprii; pe telefon, rezultatul apare centrat pe ecran.

**EN.** “Prism Glass” interface: page backdrop tinted by the current scene, frosted glass panels, animated prism logo, Fraunces headings and JetBrains Mono numerals, score bump on every gain, segmented mode switcher, pulsing Launch button, glass orbs in the ammunition panel (next shot highlighted), skin swatches in the workshop, rainbow progress bar, animated result card with stars, restyled dialogs and guide. Light theme, high contrast and reduced motion have their own variants; on phones the result card is centred on screen.

- Fonts load from Google Fonts; offline play falls back to system fonts. Service-worker cache renamed so installed copies pick up the new shell.
- Game logic, controls and saved progress unchanged; core, audio and five-viewport browser/axe checks pass locally.

## 1.9.0 — 2026-10-03

- Mobile game view opens on Start, with wider arena, compact controls and a menu that pauses play.
- Handcrafted story formations and finales at levels 4, 8, 12 and 100; three solvable limited-ammo puzzles.
- Validated JSON export/import, preview and merge retaining unlocked levels, best stars and owned cosmetics. No active-round restore.
- Scoped offline PWA shell, install icons and explicit update activation. Initial online visit required; installation depends on browser support.
- RO/EN, reduced motion, high contrast and textual turn controls preserved.

## 1.8.0 — 2026-10-03

**RO.** Grafică refăcută: bile de sticlă cu reflexii și rostogolire, decoruri animate pe straturi (raze și bule Aqua, dune și soare, furtună cu fulgere, recif de corali, nori, grilă Neon), traseu 3D, portal-vârtej și semnal de pericol lângă final. Mișcare naturală: șarpele alunecă fluid între celule, cu ondulare, clipit și limbă; bilele lansate zboară până în șir, golurile se închid lin, iar combinațiile explodează în cascadă cu particule și scor plutitor. Mișcarea redusă și contrastul ridicat păstrează afișarea statică.

**EN.** Graphics overhaul: glass orbs with reflections and rolling, layered animated scenery (Aqua light rays and bubbles, dunes and sun, storm lightning, coral reef, clouds, Neon grid), bevelled 3D route, vortex portal and end-of-route danger glow. Natural motion: the snake glides smoothly between cells with slither, blinking and tongue flicks; launched orbs fly into the chain, gaps close smoothly and combos burst in sequence with particles and floating score. Reduced motion and high contrast keep a static presentation.

- Background, panel and route cached once per scene; live layers drawn on top. Measured ~60 fps in headless Chromium at 1300×900; physical-device performance not verified.
- Game logic, controls and saved progress unchanged.

## 1.7.0 — 2026-10-03

- Collection path and destination highlight, tap to reroute, explicit cancellation.
- Aqua slowdown waves, Dune wall countdown, Neon cross-route matching gate.
- No-time-pressure option, persisted best stars, free cosmetic milestones and once-per-day daily reward.
- RO/EN labels, textual status and reduced-motion support retained.

## 1.6.0 — 2026-10-03

- Assisted collection travels to visible arena orbs; the outer route freezes until arrival. Tap an orb or use Collect.
- Aqua levels 1–4, Dune 5–8, Neon 9–100 with two routes.
- RO/EN map: locked levels, replay, continue and preserved highest unlocked level.
- Turn-based and reduced-motion collection resolve without animation.

## 1.5.0 — 2026-10-02

**RO.** Primul nivel ghidat, fără presiune de timp până la prima potrivire; bonusuri pentru combo-uri și porți, niveluri cu două trasee, rezultate de rundă și progres păstrat. Bile și controale mai mari; verificare automată touch/mobil și axe prin GitHub Actions.

**EN.** Guided first level with time frozen until the first match; combo and gate bonuses, dual-route levels, round results and saved progress. Larger orbs and controls; automated touch/mobile and axe checks through GitHub Actions.

- Ghidul se poate relua din Despre joc; acesta nu șterge progresul deblocărilor. / Replay the guide from About without deleting unlocked progress.
- Workflow: `.github/workflows/serpent-prism.yml`; viewporturi 360×800, 390×844, 412×915, 844×390 și 1440×1000. Capturi și raport axe în artifactul `serpent-prism-mobile-report`. / Screenshots and axe report are stored in that artifact.
- Browserul local nu s-a putut instala. Rezultatul automat este indicat de rularea GitHub Actions; testarea pe telefon fizic și cu cititor de ecran real rămâne de confirmat. / Local browser installation failed. Automated results are reported by GitHub Actions; physical-phone and real screen-reader validation remain unverified.


Toate iterațiile au fost realizate la 2026-10-02. Etichetele inițiale v1.0–v1.4 sunt normalizate aici la 1.0.0–1.4.0; nu reprezintă taguri GitHub create anterior.

All iterations were implemented on 2026-10-02. Initial v1.0–v1.4 labels are normalized here to 1.0.0–1.4.0; they are not historical GitHub tags.

## 1.4.0 — 2026-10-02

**RO — Arenă unificată și tutorial.** Traseul bilelor înconjoară șarpele; butonul Lansează este în colțul arenei. Ecran mai mare, panouri dedesubt, traiectorie sugerată și tutorial Despre joc în cinci pași RO/EN.

**EN — Unified arena and tutorial.** The orb route surrounds the snake; Launch sits in the arena corner. Larger arena, panels below, suggested trajectory and a five-step RO/EN About the game tutorial.

## 1.3.0 — 2026-10-02

**RO — Armonizare și sunet.** Modul și scorurile au fost integrate în panoul jocului. Efecte Web Audio pentru colectare, lansare, combinații și rezultate; ambianță discretă, buton de sunet și volume separate. Sunetul pornește după o interacțiune.

**EN — Visual harmony and audio.** Mode and scores moved into the game panel. Web Audio effects for collection, launch, matches and results; quiet ambience, a sound toggle and separate volumes. Audio starts after an interaction.

## 1.2.0 — 2026-10-02

**RO — Elemente adaptate din SlideStorm.** Șase decoruri, pereți și reflexii pe canal, apă animată, lumină zi/apus/noapte, vreme decorativă, calitate adaptivă și ecran de joc focalizat.

**EN — Elements adapted from SlideStorm.** Six environments, channel walls and reflections, animated water, day/sunset/night lighting, decorative weather, adaptive quality and focused game view.

## 1.1.0 — 2026-10-02

**RO — Mod Ușor și volum vizual.** Mod Ușor implicit, colectare asistată, țintă sugerată, mișcare la comandă și țintire care oprește timpul. Bile cu efect 3D în Canvas 2D, umbre, corp continuu și deplasare interpolată.

**EN — Easy mode and visual depth.** Default Easy mode, assisted collection, suggested targets, movement on command and aiming that stops time. 3D-like Canvas 2D orbs, shadows, connected body and interpolated movement.

## 1.0.0 — 2026-10-02

**RO — Prima versiune.** Snake cu muniție în coadă și potriviri de minimum trei bile. Șase moduri, RO/EN, dark/light, simboluri pentru culori, contrast, mișcare redusă, mod textual pe ture, progres local și magazin cosmetic.

**EN — Initial release.** Snake with tail ammunition and matches of at least three orbs. Six modes, RO/EN, dark/light, color symbols, contrast, reduced motion, text-based turns, local progress and cosmetic shop.

## Publicare în portofoliu / Portfolio publication — 2026-10-02

- Codul v1.4.0 adăugat în `serpent-prism/`; catalog, pagini RO/EN, Finalizat recent (maximum cinci), Istoric, README și sitemap actualizate.
- Published v1.4.0 source in `serpent-prism/`; catalogue, RO/EN pages, recent work (five maximum), history, README and sitemap updated.

## Verificări și limite / Checks and limits

Verificate automat: moduri, colectare/lansare, combinații, provocare zilnică deterministă, salvare locală, tutorial și pauză/reluare, evenimente audio și mute/volum. Grafica este Canvas 2D cu efect de volum, nu un motor WebGL. Testarea vizuală pe telefon, redarea audio reală și folosirea unui cititor de ecran real rămân de confirmat.

Automated checks cover modes, collection/launch, cascades, seeded daily layout, local persistence, tutorial and pause/resume, audio events and mute/volume. Graphics use Canvas 2D depth effects, not WebGL. Real-device visual/audio and screen-reader validation remain unverified.
