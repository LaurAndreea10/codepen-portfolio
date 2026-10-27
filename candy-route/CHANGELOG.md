# v4.0.0 — 2026-10-27

- Ecran de start Joacă/Campanie/Studio, navigare separată, interfață clasică păstrată, tutorial contextual și rezumat.
- Cinci cartiere cu personaje, alegeri persistente, final personalizat, case distincte, decor, vreme și mers pe traseu.
- Șapte reguli Aventură: clasic, cartiere, minimum opriri, recuperare energie, diversitate, livrare și deplasare. Solver exact limitat la 16 case.
- Editor vizual pentru costuri, tipuri, resurse și conexiuni, campanii personale și pachete de turneu validate.
- Campionat contra Greedy/Alternator/Strateg, cooperare și două grile locale, inclusiv restaurarea selecțiilor.
- Server Arena opțional: camere, tokenuri per filă, reluare după reload, scoruri calculate de server și clasament. Găzduirea publică nu este activată.
- Exerciții de reparare/debug/DP/reconstrucție, benchmark măsurat, istoric de greșeli, recomandări, obiective, CSV și raport săptămânal în aplicație.
- Mod textual, dimensiuni independente, săgeți/scurtături, orientare sonoră opt-in și mișcare configurabilă.
- Backup complet v4 cu previzualizare și confirmare; tokenurile Arena sunt excluse. Cache offline v4, mesaj de actualizare, demonstrație și jurnal de observații reale.
- Acoperirea cerințelor și limitele sunt în ADVENTURE-COVERAGE.md. Telefonul real, cititorul de ecran, CodePen, deploy și Arena publică rămân neconfirmate.

# v3.0.0 — 2026-10-26

- Studio cu 12 variante și solver exhaustiv limitat la 16 case; regula originală maxCandy rămâne neschimbată.
- Hartă de campanie, moduri Relaxat/Expert, editor, generator reproductibil, soluții multiple, PNG, colecții și pachete.
- Patru profiluri locale, backup complet validat atomic, păstrarea indiciilor și explorării, duel local și coduri de rezultat.
- Laborator cu dependențe, pseudocod pas cu pas, recursie, cache, operații, scalare și exerciții.
- Calendar, obiective, insigne, companion cosmetic, sezoane, sunete diferențiate și ecran extins.
- PWA offline; actualizarea așteaptă închiderea clienților vechi.
- Acoperire detaliată: COVERAGE.md. Telefonul fizic, screen reader real, CodePen Jest și deploy production rămân de confirmat.

# Candy Route — istoric / history

## 2.1.0 — 26 octombrie 2026

- Integrate elementele din candy.js, candy.test.js și index (20).html atașate: paletă navy/cyan/ambre, drum, indicii # și marcaje optime cu stele.
- Evidențierea rutei păstrează selecția manuală; ascunderea nu șterge asistența.
- Laborator cu cinci strategii și pierderea față de optim; aceleași reguli pentru liniar/circular, cu negative omise.
- Tabel vizitez/sar cu totalurile câștigătoare și regiuni derulabile accesibile din tastatură.
- API-uri compatibile cu testele atașate. Validarea indicilor întregi, limită brute-force și fallback pentru memoizarea pe străzi lungi.
- 68 teste Jest, 14 teste Node, 18 grupuri de verificări browser; zero erori de pagină și zero încălcări axe în layout-urile și temele testate.
- Campania, ziua, stelele și formatul de backup v2 sunt păstrate.

## 2.0.0 — 26 octombrie 2026

- Tutorial interactiv în trei pași, cu demonstrarea vecinului blocat.
- Campanie de 30 de niveluri: bazele, capcane, valori negative, cercuri.
- Deblocare progresivă și stele: trei fără ajutor, două cu indiciu, Exersat dacă soluția sau pașii au fost dezvăluiți. Cele mai bune rezultate se păstrează.
- Continue / Retry, pași înainte/înapoi, redare și pauză; resetarea explicației nu șterge faptul că a fost văzută soluția.
- Provocare zilnică deterministă, folosind data Europe/Bucharest. Reîncercarea aceluiași nivel sau a aceleiași zile nu dublează victoriile.
- Link distribuibil cu strada și modul, fără progres personal. Câmp de copiere manuală când Clipboard API nu este disponibil.
- Backup JSON versionat, validare completă înainte de înlocuire, limită de 1 MB, migrare din progresul v1.
- Resetare cu dialog de confirmare; limba și preferințele vizuale se păstrează.
- Case desenate în CSS, fără dependență de emoji sau imagini externe; corectarea fundalului temei luminoase.
- Teste Jest și oracle exhaustiv, teste Chromium pentru toate nivelurile și fluxurile principale, audit axe la patru lățimi.
- Integrare pregătită în catalog, Challenge, Arcade Pass, Finalizat recent și Istoric, RO/EN; sitemap și metrică centrală actualizate. Launcher în Arcade World cu progres separat.

## 1.0.0 — 26 octombrie 2026

- `maxCandy`, reconstrucția unui traseu optim, mod Clasic / Trucuri / Circular.
- Selecție manuală, indicii, soluție, undo, editor de străzi.
- RO/EN, dark/light, contrast, mișcare redusă, sunete opționale și salvare locală.
- HTML independent și surse separate pentru CodePen; testare algoritmică locală. Testarea interfeței nu era confirmată în această versiune.
