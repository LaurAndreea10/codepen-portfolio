# Candy Route v2.1 — Jest Trick-or-Treat

Joc fără dependențe de runtime: deschide `candy-route-standalone.html` direct în browser. Pentru varianta modulară `index.html`, pornește un server în acest folder cu `python3 -m http.server 8000` și deschide http://localhost:8000.

## Tot ce s-a adăugat

1. Tutorial în trei pași: selectează casa 1, încearcă vecinul blocat, selectează casa 3 pentru o sumă mai bună.
2. 30 de niveluri, deblocate progresiv: 1–5 bazele, 6–15 capcane, 16–20 valori negative, 21–30 cercuri.
3. Stele și progres: ★★★ fără ajutor, ★★ cu indiciu, Exersat dacă vezi soluția sau pașii. Reîncercarea poate îmbunătăți rezultatul. Progresul bun nu este șters de o încercare mai slabă.
4. Explicația algoritmului, cu pași anterior/următor, redare/pauză și tabel care se dezvăluie treptat. Pentru cerc se compară cazul fără prima casă cu cel fără ultima; tabelul arată cazul câștigător.
5. Provocare zilnică identică pentru toți, generată folosind data din România. Este un generator local: schimbarea ceasului dispozitivului schimbă ziua folosită.
6. Distribuire prin URL, export/import JSON validat și resetarea progresului cu confirmare. Linkul include numai strada și modul, nu scorurile sau preferințele. Un fișier deschis local produce un link local; un link public necesită găzduire.
7. Verificări automate pentru algoritm, starea salvată, interfață, tastatură, layout mobil și accesibilitate. Vezi `test-results.html` și `browser-results.json`.
8. Integrarea în portofoliu și Arcade World este livrată în pull request-urile menționate în `INTEGRATION.md`. Starea live depinde de merge și deploy, nu de existența acestui pachet.

Se păstrează funcțiile v1: mod liber Clasic/Trucuri/Circular, editor (1–40 valori întregi de la −99 la 99; negative în Trucuri), blocarea vecinilor, hint, soluție, undo, RO/EN, dark/light, contrast, reduced motion, sunete oprite implicit și progres local. Vecinii blocați rămân focalizabili pentru explicații. Butoanele au etichete și stări accesibile. Casele sunt desenate în CSS.

Nu există conturi, abonamente, API AI sau servicii externe de runtime. Fișierele locale funcționează offline; nu este adăugat un service worker și aplicația nu este prezentată drept PWA instalabilă.

## CodePen 2.0

Pornește din template-ul oficial al provocării. Păstrează testele oficiale și structura blocurilor:

- `candy.js`: funcția oficială `maxCandy` și extensia `bestRoute`.
- `game.js`: niveluri, ziua, distribuire, validarea backup-urilor și reguli de progres.
- `i18n.js`: textele RO/EN.
- `app.js`: interfața. Încarcă-l o singură dată ca ES module, prin scriptul din HTML.
- `index.pen.html`: blocul HTML; `style.css`: blocul CSS.
- `candy.test.js`: aceleași exemple din starter și teste suplimentare. `game.test.js`: teste pentru extensii. Se folosesc în blocuri Jest, nu în pagina HTML.
- `jest.config.json`: obiectul `globals.outputFilepath` furnizat în cerință; păstrează-l în configurarea Jest. Nu îl lipi în JavaScript.

Importurile relative presupun că fișierele sunt accesibile pe aceleași căi în Pen. Taguri: `cpc-jest-trick-or-treat`, `codepenchallenge`. `/test-results.html` din HTML-ul CodePen este ruta raportului Jest generat de CodePen. Raportul inclus în pachet este o fotografie a verificărilor locale, nu dovada rulării testelor în Pen.

Pentru soluția minimă copiază doar `maxCandy` în `candy.js`; interfața starter funcționează în continuare. `maxCandy` are timp O(n), memorie O(1), nu modifică tabloul și permite să sari toate casele. `bestRoute` reconstruiește un traseu în timp și memorie O(n), cu indici de la zero. La egalitate sare casa curentă; orice alt traseu legal cu suma maximă este acceptat în joc.

## Salvare și backup

Cheia v2 este `laurai-candy-v2`; progresul v1 valid este migrat o singură dată atunci când nu există v2. JSON-ul include versiunea, preferințele, încercarea, stelele pe nivel și rezultatele zilnice. Importul este atomic: fișier invalid/incomplet sau mai mare de 1 MB nu modifică datele existente. Se verifică vecinii, intervalele, tipurile și corespondența străzii cu nivelul sau ziua. Progresul este pe dispozitiv și origine; iframe-ul Arcade și un tab separat pot avea politici de stocare diferite în unele browsere.

Dacă localStorage este indisponibil, jocul continuă și afișează un mesaj; poți exporta JSON. Sunetul este oprit la fiecare pornire. Undo sau golirea selecției nu anulează folosirea ajutorului. În modul liber, Retry nu dublează o victorie deja creditată aceleiași încercări; în campanie și daily rezultatele sunt unice pe nivel/zi. Pentru străzi cu maxim zero folosește Verifică traseul.

## Reproducerea verificărilor

- `npm test`: Node, fără instalare, exemplele din cerință plus comparație exhaustivă brute-force pe 19.531 tablouri de lungime 0–6 și valori −2…2, fiecare liniar și circular.
- `npm install`, apoi `npm run test:jest`: testele Jest locale. Configurația locală este separată de configurația CodePen.
- `npx playwright install chromium`, apoi `npm run test:ui`: server HTTP temporar, interacțiuni Chromium și axe. Scriptul verifică toate cele 30 de niveluri, tutorialul, stelele, undo, ziua, linkurile distribuite, import/export, resetarea, persistența, lipsa stocării și layout-ul la 360/390/768/1280 px. Variabilele opționale `CANDY_BROWSER`, `CANDY_PLAYWRIGHT_MODULE`, `CANDY_AXE_MODULE` permit folosirea dependențelor deja instalate.
- `npm run build`: reconstruiește HTML-ul modular și cel independent din surse; nu edita separat versiunile generate.

Rezultatele locale: 68 teste Jest și 14 teste Node trecute; 18 grupuri de verificări în Chromium și zero încălcări axe în cele patru layout-uri testate. Aceste verificări nu certifică accesibilitatea completă. Telefonul fizic, cititorul de ecran real, rularea în editorul CodePen și deploy-ul public rămân de confirmat.

## Elemente preluate din fișierele atașate — v2.1

- Paleta navy/cyan/ambre, cardurile KPI, drumul și marcajul circular, indicii # de la zero și marcajele optime cyan cu stele.
- Butonul Evidențiază ruta nu modifică selecția manuală. Ascunderea marcajelor nu anulează faptul că a fost consultată soluția.
- Laborator de strategii: DP, memoizare, brute-force, alternare și greedy. Tabelul arată suma, diferența față de optim și tipul metodei.
- Comparațiile folosesc aceleași reguli ca jocul curent. În cerc, alternarea elimină capătul mai slab când ambele capete ar fi vizitate; greedy blochează și vecinul de peste capăt. Casele negative pot fi sărite.
- Tabel orizontal vizitez/sar, cu totalul mai bun evidențiat la fiecare casă. În cerc, tabelul arată una dintre cele două variante liniare câștigătoare, nu tratează cercul ca pe o stradă dreaptă.
- Tabelele care depășesc lățimea ecranului au regiuni focalizabile și nume accesibile pentru navigare din tastatură.
- API-urile atașate sunt disponibile din `candy.js`: `candyRoute`, `maxCandyCulDeSac`, `culDeSacRoute`, `sumOf`, `isValidRoute`, `maxCandyBruteForce`, `maxCandyMemo`, `everyOtherHouse`, `biggestPileFirst`. `compareStrategies` alimentează laboratorul.
- Validatorul refuză indici fracționari, NaN, duplicate și indici din afara străzii. Brute-force refuză explicit peste 20 de case; interfața îl omite peste 18 pentru a limita munca exponențială. Memoizarea folosește DP iterativ peste 1.000 de case pentru a evita depășirea stivei.
- `attachment.test.js` păstrează exact testele din atașament; `strategies.test.js` adaugă regresii pentru limite și comparații circulare. Cele 68 de teste includ testele din atașament, testele v2 și regresiile noi.

Verificările axe suplimentare includ dark și high contrast la 390 px. Fișierele atașate originale sunt păstrate; pachetul combină elementele lor cu funcțiile v2. Vezi `CHANGELOG.md` pentru istoricul v1 → v2.1.
