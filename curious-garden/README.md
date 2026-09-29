# Grădina Curioasă / Curious Garden

Joc educativ pentru copii de 3–12 ani, în română, engleză, maghiară și ucraineană. Copilul își alege un profil local și lumea preferată, apoi explorează aventuri, numere, litere, ceasul, banii, puzzle-uri, povești și cele 12 lumi. Merge offline și nu are server, conturi sau reclame.

- [Joacă pe GitHub Pages](https://laurandreea10.github.io/codepen-portfolio/curious-garden/)
- [Studiu de caz](https://laurandreea10.github.io/codepen-portfolio/curious-garden/case-study.html)

## Ecrane

| Ecran | Ce conține |
| --- | --- |
| Acasă | „Jocul zilei” (altul în fiecare zi, potrivit vârstei), plăci mari către fiecare ecran, numărătoarea până la aniversare |
| Aventuri | Labirinturi generate pentru unicorn și mașini, atelierul de brioșe, lansarea rachetei |
| Numere | Ordonarea numerelor, perechi Match, culori (cu mod pentru daltonism) |
| Descoperă | Litere, ceasul analogic, bani, puzzle pe siluetă, povești cu 7 finaluri |
| 12 lumi | Poveste, provocarea zilei, Constructor, Împreună, Liniștit, Eveniment |
| Activități | Jocuri scurte pe vârstă, 8 sărbători (Paștele ortodox în RO/UK, cel catolic în HU/EN), album, setări pentru adult |
| Colecția | Abțibilduri de aranjat pe pajiște, grădina care înflorește, 17 insigne, fiecare cu diplomă de tipărit (`diploma.html`, salvabilă ca PDF) |
| Limbi străine | Engleză, franceză, germană, spaniolă: Ascultă și atinge, Memory cu cuvinte, Scrie cuvântul, Propoziții, Dialoguri, Cuvintele zilei (repetare spațiată), 12 teme de vocabular (inclusiv mâncare, vreme, familie, transport), pronunție |
| Contra Robo | X și 0, Memory și Bețișoarele (Nim) contra unui robot calculat local, care se adaptează la copil |
| Ateliere | 9 meserii: **Desen** (desen liber cu găleată, oglindă și ștampile; colorează liber sau după cod/calcule; unește punctele numărând din 2, 3, 5 sau 10; pixel art, în oglindă de la 9 ani; galerie cu 8 desene), **Muzică** (xilofon/pian/flaut cu tastele 1–8, 5 cântece din domeniul public de cântat după lumini, repetă melodia, sus sau jos, ritmuri pe 4 instrumente), **Olărit** (roata olarului, glazuri, modele, cuptor, comenzi de la clienți), **Croșetat** (fulare cu modele de culori), **Grădinărit**, **Construcții**, **Doctor** (ursulețul Tedi), **Service** (telefon, bicicletă, mașină) și **Gătit**, fiecare cu pași de ordonat, unelte de ales și calcule pe vârstă. La construcții, doctor, service și gătit apare o notă de siguranță. |
| Aniversare | Tort sau brioșă, decorațiuni, felicitare salvabilă |

Toate sunetele din Atelierul de muzică sunt sintetizate cu Web Audio: fără fișiere audio și fără înregistrări.

Bia, buburuza, însoțește copilul: îl salută, îl laudă și îl încurajează după greșeli.

## Pentru părinți (Setări, după o înmulțire aleatorie)

- Raport pe 9 abilități (inclusiv limbi străine și muzică), zonele dificile și timpul de joc din ultimele 7 zile.
- Activități fără ecran, alese după abilitatea care are nevoie de exercițiu.
- Limită zilnică de timp cu o pauză blândă; un adult poate adăuga 15 minute.
- Export și import al progresului complet între dispozitive.
- „Scrie-ți părerea”: deschide `feedback.html`, care trimite mesajul pe e-mail prin Web3Forms (vezi secțiunea Opinii / Feedback).
- Voce, sunete sintetizate, fără animații, ritm liniștit.

## Accesibilitate

Pe tabletă ținută orizontal, meniul încape pe un rând și tablele de joc se potrivesc pe înălțimea ecranului. Font OpenDyslexic, text mai mare, contrast ridicat, mod pentru daltonism, reduce motion, navigare completă din tastatură, cititor de ecran și navigare cu un singur buton (switch), cu viteză reglabilă. Citirea vocală pornește automat pentru 3–5 ani.

## Date

Profilurile și progresul sunt în `localStorage`, pe dispozitivul jucătorului. Cheile per copil au forma `garden_<modul>_<id>`, iar exportul le include pe toate.

## Structură

- `index.html` — setup, jocurile de bază, evenimente, tort; funcțiile comune `shuffle`, `gardenCelebrate`, `gardenMiss`, `gardenRouteGrid` și evenimentul `garden:change` (motive: `start`, `lang`, `switch`).
- `i18n.js` — lista de limbi și traducerile HU/UK pentru modulele vechi (cheile lipsă cad pe engleză).
- `art.js` — ilustrațiile SVG (`gardenArt`).
- `expansion.js` — profiluri, lumi, activități extra, album, setări, voce (`gardenSpeak`).
- `premium.js` — cele 12 lumi. `arcade.js` — aventurile și labirinturile. `learning.js` — Numere, Match, Culori.
- `home.js` — meniul și ecranele (`gardenGo`); CSS-ul din `home.css` arată doar ecranul activ.
- `languages.js` — Limbi străine: vocabular în 4 limbi țintă, jocuri pe vârste, dialoguri cu explicații în limba jocului și repetare spațiată (1, 3, 7, 14, 30 de zile).
- `versus.js` — Contra lui Robo: minimax la X și 0, memorie imperfectă la Memory, strategia optimă la Nim; nivelul crește după 2 victorii la rând ale copilului și scade după 2 înfrângeri. Fără server și fără costuri.
- `discover.js` — Descoperă. `rewards.js` — abțibilduri, grădină, insigne, Bia, sunete, statistici. `parents.js` — raport, timp, import, accesibilitate.
- `feedback.js` — intrarea „Scrie-ți părerea” din Setări, care deschide `feedback.html` în limba jocului (RO sau EN).
- `aproba.html` — pregătește o părere aprobată pentru portofoliu (nu publică și nu trimite nimic). `diploma.html` — diplomă A4 pentru o insignă, în 4 limbi.
- `drawing.js` — Atelierul de desen (canvas, pagini SVG proprii, galerie `garden_drawing_<id>`). `music.js` — Atelierul de muzică (Web Audio). `crafts.js` — hub-ul Ateliere și cele 7 meserii (`garden_crafts_<id>`). Stilurile lor sunt în `studio.css`.
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
python curious-garden/tests/test_versus.py
python curious-garden/tests/test_languages.py
python curious-garden/tests/test_feedback.py
python curious-garden/tests/test_polish.py
python curious-garden/tests/test_studio.py
```

Testele rulează automat în GitHub Actions (`.github/workflows/curious-garden-tests.yml`) la fiecare modificare din `curious-garden/`. Dacă adaugi fișiere noi, trece-le în lista `FILES` din `sw.js` și crește numărul din `CACHE`.

Traducerile în maghiară și ucraineană merită verificate de vorbitori nativi.

## Licență / License

Codul original al jocului din acest director este disponibil sub [licența MIT](LICENSE), © 2026 Laura Andreea Plugaru. Păstrează nota de copyright și textul licenței în copiile sau porțiunile substanțiale redistribuite.

Fonturile OpenDyslexic din `fonts/` sunt distribuite separat sub [SIL Open Font License 1.1](fonts/OFL-LICENSE.txt), cu numele rezervat OpenDyslexic. Licența MIT nu înlocuiește licența fonturilor. Fișierele media și mărcile sau elementele deținute de terți nu sunt relicențiate prin această licență.

## Opinii / Feedback

- [Formular pentru părinți](feedback.html): trimite mesajul direct din pagină prin Web3Forms la adresa asociată cheii de acces (plugaru.laura10@gmail.com), fără aplicația de e-mail și fără activare. Cheia publică stă în `feedback.html` (`W3F_KEY`); permite doar trimiterea de mesaje către Laura. FormSubmit a fost înlocuit pentru că returna erori de server.
- Numai mesajele cu acord explicit de publicare pot apărea în [portofoliul RO](../portfolio.html#curious-garden-opinions) și [EN](../en/#garden-feedback). Publicarea este manuală, după verificare. Nu publica date despre copii.
- Cel mai simplu: deschide [`aproba.html`](aproba.html), lipește e-mailul primit, verifică textul (linkurile, e-mailurile și telefoanele sunt scoase automat) și copiază fișierul complet în `approved-feedback.json` pe GitHub. Fără acord de publicare pagina nu generează nimic. Manual: adaugă în `approved-feedback.json` un obiect `{"name":"Pseudonim","quote":"Textul aprobat","approved":true}` în lista `items`. Nu copia adrese de e-mail, data nașterii sau alte date personale. Mesajele fără acord rămân private și nu se adaugă în fișier.
- `feedback-display.js` afișează numai intrările aprobate, ca text simplu, fără interpretarea HTML-ului. Pagina de feedback nu păstrează mesajul în browser; acesta este procesat de Web3Forms pentru livrare.

## English

Curious Garden is a learning game for ages 3–12 in Romanian, English, Hungarian and Ukrainian. It has eleven screens (a Workshops area with drawing, music, pottery, crochet, gardening, building, doctor, repair-shop and cooking activities, a foreign-languages area teaching English, French, German and Spanish, a versus mode against a locally computed, adaptive robot, adventures with generated mazes, numbers, letters, clock, money, silhouette puzzles, branching stories, twelve worlds, age-based activities, a sticker and garden collection, and a birthday workshop), a parent report with time limits, and accessibility options including a dyslexia-friendly font, colour-blind mode and single-switch navigation. It works offline, stores data only in the browser, and is covered by automated Playwright tests in GitHub Actions. Original game code is MIT-licensed; OpenDyslexic fonts remain under SIL OFL 1.1.
