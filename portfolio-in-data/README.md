# Portofoliul în date

O poveste cu scrollytelling construită din datele reale ale acestui repository: câte commituri, în ce zile, în ce luni, ce proiecte au ieșit din ele.

**Autor:** Laura Andreea · Iași

## Ce face

- **Grafic fix, text care derulează:** nouă pași schimbă același grafic SVG, de la commituri pe zile la total cumulat, zile ale săptămânii, categorii, etichete și tipuri de fișiere.
- **Tranziții:** barele cresc eșalonat, linia se desenează, lunile se evidențiază fără redesenare. Cu `prefers-reduced-motion`, totul apare direct.
- **„Ghicește înainte să derulezi”:** trei întrebări generate din date, cu scor salvat local.
- **Bară de progres** cu `animation-timeline: scroll()` și rezervă în JavaScript.
- **Accesibil:** fiecare stare a graficului are un tabel cu aceleași date, iar cifra mare și descrierea sunt anunțate.
- RO/EN (`?lang=en`), dark/light, responsive (graficul rămâne lipit sus pe mobil).

## Date

Nimic nu este inventat sau estimat. `build.py` citește:

- `git log --format=%ad --date=short` pentru commituri (toate, indiferent de autor);
- `git ls-tree -r -l HEAD` pentru fișiere;
- `../projects.json` pentru proiecte, categorii și etichete.

Rezultatul este scris direct în `index.html`, între marcajele `/*DATA:START*/` și `/*DATA:END*/`.

```bash
python3 portfolio-in-data/build.py   # are nevoie de istoricul complet, nu de o clonă shallow
```

Textele despre lunile aprilie–iulie și despre luna cea mai activă sunt scrise pentru datele din noiembrie 2026; cifrele din ele se recalculează la fiecare rulare.

## Verificat

Teste automate în Chromium la 1280 și 390 px: toți cei nouă pași, evidențierile, testul cu întrebări, schimbarea limbii. Telefonul fizic, Safari, Firefox și cititoarele de ecran nu au fost verificate.
