# Local-First CRM

Pipeline de vânzări care răspunde instant, pentru că datele stau în browser: fiecare acțiune se vede imediat pe ecran, iar salvarea în IndexedDB se face în fundal.

**Autor:** Laura Andreea · Iași

## Ce face

- **Kanban cu drag & drop** pe Pointer Events: mouse și ecran tactil (apăsare lungă, apoi tragi), cu loc de inserare vizibil și derulare automată la margini.
- **Paletă de comenzi** (`Ctrl K`): căutare fuzzy prin comenzi și oportunități, inclusiv „Mută «cardul selectat» în…”.
- **Anulare/refacere** pentru orice modificare (200 de pași), cu buton „Anulează” în notificare.
- **Tastatură completă:** navigare între carduri cu săgeți, mutare cu `Shift` + săgeți, `N`, `/`, `1`/`2`, `Delete`, `?`.
- **IndexedDB** cu timp de salvare afișat și rezervă în memorie dacă baza de date nu e disponibilă.
- **Sincronizare între taburi** prin `BroadcastChannel`.
- **Fișă de oportunitate** cu editare, note și istoric de activitate; vizualizare Tabel sortabilă; filtru pe responsabil și căutare.
- **Indicatori:** pipeline deschis, prognoză ponderată pe etape, rată de câștig, țintă lunară editabilă.
- **Export** JSON și CSV (cu protecție la formule), **import** JSON validat.
- RO/EN (`?lang=en`), dark/light, mișcare redusă, responsive.

## Structură

```
local-first-crm/
├── index.html       ← aplicația completă, un singur fișier, fără dependențe
├── index.pen.html   ← aceeași versiune, pentru CodePen
└── og.png
```

## Verificat

Teste automate în Chromium la 1440, 800 (tactil simulat) și 390 px: drag cu mouse-ul, drag tactil cu apăsare lungă, mutare din tastatură, ștergere și anulare, paletă, fișă, note, tabel sortat, persistență după reîncărcare și sincronizare între două taburi. Telefonul fizic, Safari, Firefox și cititoarele de ecran nu au fost verificate. Datele sunt demonstrative, iar companiile sunt inventate.
