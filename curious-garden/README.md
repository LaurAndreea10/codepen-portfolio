# Grădina Curioasă / Curious Garden

Joc educativ pentru copii de 3–12 ani, în română, engleză, maghiară și ucraineană. Copilul își alege un profil local și lumea preferată, apoi explorează aventuri, numere, litere, ceasul, banii, puzzle-uri, povești și cele 12 lumi. Merge offline și nu are server, conturi sau reclame.

- [Joacă pe GitHub Pages](https://laurandreea10.github.io/codepen-portfolio/curious-garden/)
- [Studiu de caz](https://laurandreea10.github.io/codepen-portfolio/curious-garden/case-study.html)

## Ecrane

| Ecran | Ce conține |
| --- | --- |
| Acasă | Plăci mari către fiecare ecran, numărătoarea până la aniversare |
| Aventuri | Labirinturi generate pentru unicorn și mașini, atelierul de brioșe, lansarea rachetei |
| Numere | Ordonarea numerelor, perechi Match, culori (cu mod pentru daltonism) |
| Descoperă | Litere, ceasul analogic, bani, puzzle pe siluetă, povești cu 7 finaluri |
| 12 lumi | Poveste, provocarea zilei, Constructor, Împreună, Liniștit, Eveniment |
| Activități | Jocuri scurte pe vârstă, 8 sărbători, album, setări pentru adult |
| Colecția | Abțibilduri de aranjat pe pajiște, grădina care înflorește, 17 insigne |
| Aniversare | Tort sau brioșă, decorațiuni, felicitare salvabilă |

Bia, buburuza, însoțește copilul: îl salută, îl laudă și îl încurajează după greșeli.

## Pentru părinți (Setări, după o înmulțire aleatorie)

- Raport pe 7 abilități, zonele dificile și timpul de joc din ultimele 7 zile.
- Activități fără ecran, alese după abilitatea care are nevoie de exercițiu.
- Limită zilnică de timp cu o pauză blândă; un adult poate adăuga 15 minute.
- Export și import al progresului complet între dispozitive.
- Voce, sunete sintetizate, fără animații, ritm liniștit.

## Accesibilitate

Font OpenDyslexic, text mai mare, contrast ridicat, mod pentru daltonism, reduce motion, navigare completă din tastatură, cititor de ecran și navigare cu un singur buton (switch), cu viteză reglabilă. Citirea vocală pornește automat pentru 3–5 ani.

## Date

Profilurile și progresul sunt în `localStorage`, pe dispozitivul jucătorului. Cheile per copil au forma `garden_<modul>_<id>`, iar exportul le include pe toate.

## Structură

- `index.html` — setup, jocurile de bază, evenimente, tort; funcțiile comune `shuffle`, `gardenCelebrate`, `gardenMiss`, `gardenRouteGrid` și evenimentul `garden:change` (motive: `start`, `lang`, `switch`).
- `i18n.js` — lista de limbi și traducerile HU/UK pentru modulele vechi (cheile lipsă cad pe engleză).
- `art.js` — ilustrațiile SVG (`gardenArt`).
- `expansion.js` — profiluri, lumi, activități extra, album, setări, voce (`gardenSpeak`).
- `premium.js` — cele 12 lumi. `arcade.js` — aventurile și labirinturile. `learning.js` — Numere, Match, Culori.
- `home.js` — meniul și ecranele (`gardenGo`); CSS-ul din `home.css` arată doar ecranul activ.
- `discover.js` — Descoperă. `rewards.js` — abțibilduri, grădină, insigne, Bia, sunete, statistici. `parents.js` — raport, timp, import, accesibilitate.
- `sw.js`, `manifest.webmanifest`, iconițe — instalare și joc offline.
- `fonts/` — OpenDyslexic (licență SIL OFL, în `fonts/OFL-LICENSE.txt`).
- `media/` — video demo pentru studiul de caz.

Fiecare reușită declanșează `garden:win`, fiecare greșeală `garden:miss` (cu `detail.game`). Recompensele și raportul doar ascultă aceste evenimente.

## Rulare locală și teste

```
python3 -m http.server 8000        # din rădăcina repo-ului
# deschide http://localhost:8000/curious-garden/

pip install playwright && python -m playwright install chromium
python curious-garden/tests/test_core.py
python curious-garden/tests/test_features.py
```

Testele rulează automat în GitHub Actions (`.github/workflows/curious-garden-tests.yml`) la fiecare modificare din `curious-garden/`. Dacă adaugi fișiere noi, trece-le în lista `FILES` din `sw.js` și crește numărul din `CACHE`.

Traducerile în maghiară și ucraineană merită verificate de vorbitori nativi.

## English

Curious Garden is a learning game for ages 3–12 in Romanian, English, Hungarian and Ukrainian. It has eight screens (adventures with generated mazes, numbers, letters, clock, money, silhouette puzzles, branching stories, twelve worlds, age-based activities, a sticker and garden collection, and a birthday workshop), a parent report with time limits, and accessibility options including a dyslexia-friendly font, colour-blind mode and single-switch navigation. It works offline, stores data only in the browser, and is covered by automated Playwright tests in GitHub Actions.
