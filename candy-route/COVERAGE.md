# Candy Route v3 — implementarea listei de 60 de posibilități

26 octombrie 2026. Acoperirea de mai jos descrie codul din această versiune, nu publicarea în producție. Surse: `app.js`, `studio.js`, `studio-rules.js`, `sw.js`. Funcțiile Studio au interfață RO/EN.

| # | Posibilitate | Implementare și limite |
|---|---|---|
| 1 | Hartă | Cinci cartiere cu niveluri și deblocarea originală. |
| 2 | Capitole | Suburbie, Pădure, Castel, Oraș, Târg; câte șase niveluri. |
| 3 | Obiective secundare | Optim fără ajutor și încercare cu maximum trei opriri; modurile K aplică limita strictă. |
| 4 | Soluții multiple | Numărare exactă în Studio; primele 50 de rute afișate. |
| 5 | Contraexemple greedy | Preset [4,5,4], laboratorul original compară cinci metode. |
| 6 | Final de capitol | Fiecare al șaselea nivel, recapitulare și insignă. |
| 7 | Recomandare adaptabilă | Repetă ultimul nivel dacă are sub două stele; altfel sugerează următorul. |
| 8 | Relaxat | Indicii disponibile în Studio. |
| 9 | Expert | Indicii dezactivate înainte de verificare; optimul nu se afișează înainte de dezvăluire. |
| 10 | Rejucare | Secvența ultimelor maximum 100 de selecții Studio; variantă textuală cu mișcare redusă. |
| 11 | Distanță | Distanță de siguranță 2 sau 3. |
| 12 | Maximum K | Solver și verificare pentru maximum K opriri. |
| 13 | Exact K | Solver și mesaj explicit pentru puzzle imposibil. |
| 14 | Energie | Costurile fiecărei case afișate, buget strict. |
| 15 | Timp | Costuri în minute și buget de traseu; nu este un cronometru în timp real. |
| 16 | Case închise | Casa din mijloc indisponibilă; pachetele pot configura mai multe. |
| 17 | Case obligatorii | Casa din mijloc obligatorie; pachetele pot configura mai multe. |
| 18 | Preferințe dulci | Multiplicatori 1–3 separați pentru ciocolată, jeleuri și acadele; valorile finale rămân în intervalul valid. |
| 19 | Explorare | Trei cercetări, valori ascunse până la verificare; comparație cu optimul complet informat. |
| 20 | Cartier ramificat | Arbore binar; muchii afișate; pachetele acceptă alți arbori validați. |
| 21 | Explicația rezultatului | Diferență față de optim și lista caselor de eliminat/adăugat. |
| 22 | Dependențe DP | Tabel take/skip, formula numerică și evidențierea pasului. |
| 23 | Reconstrucție | Regula de întoarcere prin DP și ruta reconstruită. |
| 24 | Arbore recursiv | Arbore expandabil pe maximum șase valori. |
| 25 | Cache | Urmă de memoizare, stări, apeluri și cache hits. |
| 26 | Operații | Numărul real de submulțimi enumerate în solverul Studio. |
| 27 | Scalare | Bare pentru formulele n și 2ⁿ; etichetate ca formule, nu benchmark. |
| 28 | Pseudocod sincronizat | Pas anterior/următor, formulă numerică și rând DP activ. |
| 29 | Prezicerea pasului | Exercițiu pe take pentru o casă și feedback explicat. |
| 30 | Cazuri speciale | Explicații pentru una/două case, zero, egalități și cerc; teste automate. |
| 31 | Editare directă | Intrare numerică separată pentru fiecare casă din editor. |
| 32 | Reordonare | Butoane stânga/dreapta, ștergere și adăugare; apoi Aplică. |
| 33 | Generator | Seed reproductibil, lungime, minim și maxim; varianta aleasă păstrată. |
| 34 | Colecții | Nume și puzzle-uri per profil, maximum 100. |
| 35 | Pachete | Import/export separat de backup; validare completă înainte de adăugare. |
| 36 | Validare creator | Limite, reguli, soluții și detectarea imposibilității; complexitatea exactă și o dificultate euristică sunt afișate. Dificultatea nu este calibrată pe jucători. |
| 37 | Link cu reguli | Payload validat; nu include progres personal. |
| 38 | PNG | Strada, modul și selecția; explorarea păstrează valorile ascunse înainte de verificare. |
| 39 | Calendar | Rezultate grupate pe ultimele maximum 31 de zile cu activitate. |
| 40 | Statistici | Rezultate, optim fără ajutor, rezultate asistate și moduri jucate. |
| 41 | Insigne | Prima rută, zece rezultate optime, cinci moduri, trei cercuri, capitol și trei rute distincte. |
| 42 | Obiectiv săptămânal | Trei rezultate Circle optime fără ajutor în ultimele șapte zile. |
| 43 | Album cosmetic | Companion selectabil dintre recompensele deblocate, fără avantaj de scor. |
| 44 | Profiluri | Maximum patru, campanie și Studio separate; backup complet include toate profilurile. |
| 45 | Duel local | Aceeași stradă, predare jucătorului 2, rezultat și egalitate. |
| 46 | Duel asincron | Link de puzzle și cod rezultat validat; comparație pe încredere, fără antifraudă. |
| 47 | Personaj | Companion pe scena originală și animație la optim; respectă mișcarea redusă. |
| 48 | Case și cartiere | Casele CSS existente păstrate; hartă în cinci zone și diferențe sezoniere. |
| 49 | Sunet | Frecvențe pentru selecție/conflict/victorie; mute persistent și volum Studio. |
| 50 | Ecran extins | Scenă fixă pe viewport, focus controlat, Escape și restul paginii inert. |
| 51 | Rezumat | Rezultat, optim, diferență, soluții și Retry în Studio; stele și Continue în campanie. |
| 52 | Sezoane | Halloween, Iarnă, Paște; aceleași reguli. |
| 53 | Accesibilitate | Text, simboluri și aria-pressed; teme și opțiuni existente păstrate. |
| 54 | S25 real | NEVERIFICAT: mediul permite emulare Chromium, nu folosirea fizică a telefonului. |
| 55 | Offline/PWA | Manifest, icon, cache doar pentru resursele proprii; activare la închiderea vechilor clienți. Reload offline testat. |
| 56 | Recuperare | Backup complet, import atomic, avertizare și export brut pentru salvare Studio coruptă. |
| 57 | Teste reguli | Teste de comparație cu DP existent și cazuri pentru restricții/arbori/importuri. |
| 58 | Întreruperi | Refresh în explorare, indicii, limbă, profiluri, import invalid, storage indisponibil și offline. |
| 59 | Integrare | Catalog, Challenge, Finalizat și Istoric actualizate în RO/EN. Arcade World PR #26 era deja merged și folosește aceeași rută; nu adăugăm un card duplicat. Publicarea v3 rămâne neconfirmată până la deploy. |
| 60 | Studiu de caz | `case-study.html`, RO/EN separat, dovezi și proces AI-assisted. |

## Verificări externe rămase

Telefon fizic, cititor de ecran real, Jest în editorul CodePen și deploy production. Rapoartele locale nu confirmă aceste puncte. Nu este necesar un serviciu plătit, cont online nou sau server pentru funcțiile implementate.
