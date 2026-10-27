# Candy Route v4 — a doua listă de 60 de posibilități

27 octombrie 2026. Codul este pregătit pentru review în GitHub. Această matrice separă implementarea de verificările pe dispozitive și de activarea serviciilor externe. Matricea primei liste rămâne în `COVERAGE.md`.

| # | Cerință | Implementare / dovadă |
|---|---|---|
| 1 | Joacă / Campanie / Studio | Trei carduri în pagina de start; navigare separată pentru instrumentele avansate. |
| 2 | Continuă sesiunea | Deschide sesiunea Aventură neterminată sau jocul original, fără resetare. |
| 3 | Primul joc rapid | Un singur buton până la strada existentă; fără onboarding obligatoriu. |
| 4 | Tutorial contextual | Indicație vizibilă lângă casa relevantă și asociere aria-describedby. |
| 5 | Setări separate | Rută dedicată; interfața clasică completă rămâne disponibilă. |
| 6 | Rezumat | Scor, optim, ajustări, Retry, stele în campanie și Next în turneu. |
| 7 | Hartă ilustrată | Cinci cartiere cu butoane de nivel, stiluri și decor distincte. |
| 8 | Poveste | Cinci introduceri, recapitulare după capitol și final de campanie. |
| 9 | Personaje | Mira, Nox, Ada, Toma, Luna; replici la selecția caselor. |
| 10 | Misiuni de cartier | Obiective narative pentru invitați, pădure, ospăț, livrări și târg; regulile de provocare se aleg în Aventură. |
| 11 | Alegeri narative | Felinare/grădină pentru fiecare cartier, persistente și reflectate în dialog. |
| 12 | Final personalizat | Stelele și numărul grădinilor alese apar după toate cele 30 de niveluri. |
| 13 | Case distincte | Patru siluete/stiluri CSS; numerele, stările și valorile rămân text. |
| 14 | Parcurgerea rutei | Personajul se deplasează între pozițiile caselor, în ordinea declarată. |
| 15 | Locuitori | Saluturi și indicații text după selecție; nu există voce sintetizată implicit. |
| 16 | Vreme | Ploaie, ninsoare, frunze, ceață; opționale și oprite prin reduced motion/decor. |
| 17 | Zi / noapte | Preferință persistentă pentru scenă. |
| 18 | Decor interactiv | Felinar, pisică și dovleac schimbă starea cosmetică la apăsare. |
| 19 | Vizite pe cartier | Maximum două vizite consecutive în aceeași zonă, în ordinea de vizitare. |
| 20 | Minimum opriri | Restricție combinabilă cu K, case obligatorii și resurse. |
| 21 | Recuperare energie | Cost plătit înaintea vizitei, recompensă primită după; ordinea contează. |
| 22 | Diversitate | Bonus pentru fiecare tip distinct de dulce, afișat în reguli. |
| 23 | Destinație | Casa finală trebuie inclusă; este vizitată ultima. |
| 24 | Plecare și deplasare | Punct de plecare și buget pentru suma distanțelor dintre opriri. |
| 25 | Campionat | Trei runde locale și total final, persistente. |
| 26 | Adversari algoritmici | Greedy, Alternator și Strateg; regulile lor sunt explicate. |
| 27 | Duel simultan | Două grile independente pe același dispozitiv; selecția P2 supraviețuiește reloadului. |
| 28 | Cooperare | Aceeași rută, predare de rând și țintă comună; fără blocarea tastaturii sau atingerea simultană obligatorie. |
| 29 | Pachete turneu | JSON validat complet, maximum 20 de puzzle-uri, separat de backup. |
| 30 | Multiplayer / clasament | Server și interfață implementate, verificate local cu doi clienți; găzduirea publică NU este activată. Scorurile sunt calculate de server; numele nu sunt identități verificate. |
| 31 | Explicații pentru greșeli | Case incompatibile, lipsuri, diferențe de resurse și ajustări spre optim. |
| 32 | Repară ruta | Preset [4,5,4] cu selecția suboptimă [1]. |
| 33 | Debug algoritm | Exercițiu cu funcția care ia numai maximul individual și feedback argumentat. |
| 34 | Completează DP | Câte un câmp pentru optimul fiecărui prefix; verificarea celulelor greșite. |
| 35 | Reconstrucție | Alegi take/skip din dreapta; la egalitate se preferă skip în demonstrație. |
| 36 | Benchmark | Timpi reali din performance.now, mediană de cinci rulări, aceleași date; brute limitat la 16. |
| 37 | Editor vizual | Card pe casă; valori și previzualizare recalculate la editare. |
| 38 | Conexiuni arbore | Selectoare de părinte și diagramă SVG cu alternativă în câmpuri; părintele anterior garantează un arbore în editor. Importurile sunt validate separat. |
| 39 | Închise / obligatorii | Butoane toggle per casă. |
| 40 | Costuri individuale | Energie, minute, recompensă, cartier și tip de dulce per casă. |
| 41 | Campanii personale | Nume, ordinea nivelurilor, capitole, condiții de deblocare; maximum 20 de niveluri/campanie și 20 de campanii/profil. |
| 42 | Validarea nivelului | Soluții, imposibilitate, operații și diferență față de greedy; nu este o dificultate umană calibrată. |
| 43 | Istoric complet | Ultimele maximum 1.000 de încercări Aventură, inclusiv invalide și suboptime. |
| 44 | Progres pe regulă | Tabel cu încercări și optime fără ajutor, pe șapte zile. |
| 45 | Recomandare după erori | Sugerează regula cu proporția cea mai mică de rezultate optime; poate fi ignorată. |
| 46 | Obiective personale | 1–30 rezultate optime pe șapte zile; pauzele nu scad puncte. |
| 47 | Raport săptămânal | Generare în aplicație, export TXT; nu este creată o automatizare externă. |
| 48 | CSV | Export de rezultate, inclusiv greșeli; câmpuri citate și protecție la formule la deschidere în spreadsheet. |
| 49 | Mod textual | Aceleași butoane și reguli, fără ilustrații și atmosferă. |
| 50 | Vecini blocați | Stări aria și regiune live la focus, cu indicarea vecinilor caselor selectate. |
| 51 | Mărime text / case | Slidere independente de zoom, persistente. |
| 52 | Tastatură | Săgeți, Home/End, Enter/Space și scurtături documentate, inactive în câmpuri. |
| 53 | Orientare sonoră | Opt-in separat, frecvențe pentru stări și alternativă textuală; poate fi oprită. |
| 54 | Mișcare independentă | Personaj, decor, tranziții și efecte; preferința sistemului reduced motion este respectată. |
| 55 | S25 fizic | NEVERIFICAT. Emularea Chromium nu este echivalentă cu telefonul fizic. |
| 56 | Cititor de ecran real | NEVERIFICAT. Axe și tastatura nu înlocuiesc testarea manuală cu tehnologie asistivă. |
| 57 | Actualizare PWA | Mesaj pentru waiting worker, activare după închiderea vechilor ferestre, cache v4 separat; reload offline testat. |
| 58 | Backup cu previzualizare | Format v4 include core, Studio și Aventură; validare completă, sumar, Anulează/Înlocuiește, fără tokenuri Arena. |
| 59 | Demonstrație pentru portofoliu | Demonstrație interactivă greedy vs optim direct în pagina de start; nu este o captură video a unui utilizator real. |
| 60 | Studiu de caz | Pagină RO/EN, tabel înainte/după, rapoarte automate și jurnal de observații reale completat de utilizator. Nu sunt inventate rezultate de user testing. |

## Limite comune

Solverul Aventură are maximum 16 case / 65.536 de submulțimi. Ordinea este crescătoare după indice, cu destinația mutată la final; nu este un solver TSP pentru toate permutările. Formatul v2 al challenge-ului și formatul Studio v1 sunt păstrate. Backupul complet v4 este opțiunea care reunește toate cele trei componente.

Deploy-ul production, găzduirea publică Arena, S25 fizic, cititorul de ecran real și Jest în editorul CodePen rămân separate de verificările locale.
