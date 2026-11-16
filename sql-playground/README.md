# SQL Playground

SQLite adevărat, rulat în browser prin WebAssembly, peste o bază de date CRM fictivă. Scrii interogări, vezi rezultatul ca tabel sau ca grafic și rezolvi opt provocări verificate pe loc.

**Autor:** Laura Andreea · Iași

## Ce face

- **SQLite în browser** prin [sql.js](https://github.com/sql-js/sql.js) 1.16.0 (MIT), inclus în `vendor/`, deci fără niciun server și fără CDN pe GitHub Pages.
- **Bază CRM generată determinist:** 6 responsabili, 120 de clienți, 320 de oportunități, 963 de activități. „Reface baza” o readuce la starea inițială.
- **Schemă navigabilă** cu tipuri și număr de rânduri, exemple, istoric al interogărilor.
- **Grafic automat:** dacă rezultatul are o coloană de etichete și una numerică, devine grafic cu bare; dacă etichetele sunt luni sau date, devine grafic cu linie.
- **Opt provocări** de analiză CRM, de la `WHERE` la `LEFT JOIN`, `HAVING` și `julianday`. Verificarea rulează o interogare de referință și compară rezultatele, indiferent de numele coloanelor sau de felul în care ai scris soluția.
- Export CSV, `Ctrl+Enter` pentru rulare, RO/EN (`?lang=en`), dark/light, responsive.

## Structură

```
sql-playground/
├── index.html
├── index.pen.html            ← aceeași pagină; fără vendor/ încarcă sql.js de pe jsDelivr
└── vendor/
    ├── sql-wasm.js
    ├── sql-wasm.wasm
    └── LICENSE-sql.js.txt
```

Pagina trebuie servită prin HTTP (GitHub Pages sau `python3 -m http.server`), pentru că browserele nu încarcă WebAssembly din `file://`.

## Verificat

Teste automate în Chromium la 1440 și 390 px, cu pagina servită local: toate cele opt interogări de referință, soluții alternative acceptate, răspunsuri greșite respinse cu motivul corect, erori SQL, scrieri, grafice și afișarea sigură a textului din rezultate. Varianta de rezervă de pe jsDelivr (folosită pe CodePen) nu a putut fi testată din mediul de lucru. Telefonul fizic, Safari, Firefox și cititoarele de ecran nu au fost verificate.
