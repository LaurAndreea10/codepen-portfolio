# Grădina Curioasă / Curious Garden

Joc educativ bilingv pentru copii de 3–12 ani. Alege un profil local și lumea preferată, apoi explorează aventurile interactive, numerele, jocul Match, culorile, cele 12 lumi și evenimentele sezoniere.

## Joacă / Play

- [Joacă pe GitHub Pages](https://laurandreea10.github.io/codepen-portfolio/curious-garden/)

## Conținut

- Ecrane separate, cu meniu: Acasă, Aventuri, Numere, 12 lumi, Activități, Aniversare.
- Patru aventuri interactive: traseul unicornului, atelierul de brioșe, cursa cu mașini și lansarea rachetei.
- Ordonarea numerelor, perechi Match și culori, cu dificultate pentru 3–5, 6–8 și 9–12 ani.
- Activități pe vârstă: potrivire, numărare, anotimpuri, șiruri, construcții (ABAB), ordine (cum crește ceva), calcule, traseu pe hartă, fracții, „Găsește intrusul”. Dificultatea crește după fiecare 3 reușite.
- 12 lumi cu moduri Poveste, provocarea zilei, Constructor, Împreună, Liniștit și Eveniment; mecanici distincte: numărare, pereche, șir, „completează golul”, părți din întreg, traseu și memorie.
- Atelier aniversar cu tort sau brioșă, decorațiuni și felicitare salvabilă.
- RO/EN, temă light/dark, contrast ridicat, reduce motion, comenzi tactile și tastatură.
- Citire vocală: pornită automat pentru 3–5 ani (copiii încă nu citesc), cu butoane 🔊 la instrucțiuni. Butoanele se ascund dacă dispozitivul nu are voce pentru limba aleasă.
- Funcționează offline după prima vizită (service worker) și se poate instala pe ecranul tabletei.

Profilurile, data nașterii și progresul sunt păstrate în `localStorage` pe dispozitivul jucătorului. Nu există conturi pentru copii, reclame sau server de date. Un adult poate exporta ori șterge datele din setările jocului; setările sunt protejate de o întrebare de înmulțire aleatorie.

## Rulare locală

Rulează un server static în acest director, de exemplu `python3 -m http.server 8080`, și deschide `http://localhost:8080`. Service worker-ul funcționează doar pe `https` sau `localhost`. Nu sunt necesare dependențe sau build.

## Structură

- `index.html` — setup, jocurile de bază, evenimente, tort. Definește funcțiile comune: `shuffle`, `gardenCelebrate`, `gardenRouteGrid` și evenimentul `garden:change`.
- `expansion.js` — profiluri, lumi, activități extra, album, setări pentru adult, voce (`gardenSpeak`).
- `premium.js` — cele 12 lumi. `arcade.js` — aventurile interactive. `learning.js` — Numere, Match, Culori.
- `home.js` — meniul și ecranele (`gardenGo`). Fiecare secțiune are `data-view`, iar CSS-ul din `home.css` arată doar ecranul activ.
- Modulele nu își mai suprascriu unele altora butoanele: `index.html` emite `garden:change` cu motivul (`start`, `lang`, `switch`), iar fiecare modul ascultă prin `gardenOn`.
- `sw.js`, `manifest.webmanifest`, `icon.svg`, `icon-192.png`, `icon-512.png`, `og-image.png` — instalare, offline și previzualizare la distribuire.

Service worker-ul folosește întâi rețeaua, deci o versiune nouă apare imediat după publicare. Dacă adaugi fișiere noi, trece-le în lista `FILES` din `sw.js` și crește numărul din `CACHE`.

## English

Curious Garden is a bilingual learning game for ages 3–12. It has separate screens for four interactive adventures, number ordering, matching pairs, colors, age-based activities, twelve themed worlds, seasonal events and a birthday workshop. Voice reading is on by default for ages 3–5. It works offline after the first visit and can be installed on a tablet. Profiles and progress stay in each player's browser. No account or build step is required.
