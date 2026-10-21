# Pumpkin Weigh-In

**v1.1.0 · 2026-10-21** · [Joacă](https://laurandreea10.github.io/codepen-portfolio/pumpkin-weigh-in/) · [Rezultatele testelor](https://laurandreea10.github.io/codepen-portfolio/pumpkin-weigh-in/test-results.html) · [Cod pentru CodePen](index.pen.html)

Intrarea mea pentru săptămâna a treia din CodePen Challenge, Halloween 2026 (`cpc-weigh-pumpkin`): pune dovleacul pe cântar și vezi în ce categorie intră.

## Regula

| Greutate (lb) | Categorie |
| --- | --- |
| sub 1 | Tiny Gourd |
| 1 – sub 10 | Mini |
| 10 – sub 50 | Carving |
| 50 – sub 1000 | Giant |
| 1000 – sub 2749 | Record Breaker! |
| 2749 și peste | Legendary |
| text, negativ, gol | Invalid weight |

Pe o linie, dovleacul urcă la categoria mai mare: 10 lb e Carving, 1000 lb e Record Breaker!. Pragul Legendary e recordul mondial Guinness (2749 lb, Travis Gienger, 2023) și stă într-o constantă exportată, `WORLD_RECORD_POUNDS`.

## Cum funcționează `weighPumpkin(pounds)`

Totul e în [`pumpkin.js`](pumpkin.js), fără DOM.

1. Transformă intrarea în număr. Dacă nu e un număr finit și pozitiv, întoarce `"Invalid weight"`.
2. Caută în tabelul `CATEGORIES` primul prag pe care greutatea nu-l atinge. Ultimul prag e `Infinity`, deci găsește mereu ceva.
3. O categorie nouă înseamnă o linie nouă în tabel, nu un `if` în plus.

`weighPumpkinInKilograms(kg)` convertește (1 kg = 2.2046226218 lb) și apoi întreabă aceeași funcție, ca regula să existe o singură dată.

## Ce face pagina

- scenă de noapte cu lună, stele, lilieci și ceață; dovleacul din CSS crește și își schimbă fața la fiecare categorie
- afișaj digital lb/kg, cadran cu șase benzi, panglica de premiu, traseul categoriilor, public care aplaudă, confetti la Record și Legendary
- RO/EN; numele categoriilor rămân în engleză, fiindcă pe ele cad testele

**v1.1.0** adaugă idei preluate din alte pen-uri ale provocării, redesenate pe tema paginii:

- din *Pumpkin RED* (Pablo): butoane − / + pe câmp, cu accelerare când le ții apăsate; tremurat la greutate invalidă; linie de accent la focus
- din *Grow & Weigh* (zirak9): butonul „Udă dovleacul” (+10 lb / +5 kg) cu picături; scântei de la Carving în sus; obrăjori la Tiny și Mini; categoria „sare” când se schimbă
- din pen-ul cu spirite yokai: inel spiritual în jurul dovleacului, flăcări hitodama, coarne de oni la Record și Legendary, spiritul invocat pentru fiecare categorie

## Fișiere

| Fișier | Rol |
| --- | --- |
| `pumpkin.js` | Regula: `weighPumpkin`, `weighPumpkinInKilograms` și constantele |
| `pumpkin.test.js` | Cazurile provocării, liniile dintre categorii, Tiny Gourd și Legendary, intrări invalide, kilograme |
| `index.html` | Pagina, care importă regula din `./pumpkin.js` |
| `index.pen.html` | Aceeași pagină pentru CodePen, cu importul din `/pumpkin.js` |
| `test-results.html` | Rulează `pumpkin.test.js` în browser |
| `tests/test_page.py` | Verificări Playwright la 390 și 1280 px |

## Teste

```bash
cd pumpkin-weigh-in
npm install
npm test            # 14 teste Jest, acoperire 100% pentru pumpkin.js
```

Verificat automat în Chromium la 390 și 1280 px. Telefonul real și cititorul de ecran rămân de confirmat.
