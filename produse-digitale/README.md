# Produse digitale · Digital products

Șase produse digitale gratuite care combină lucrurile pe care le construiesc deja: șabloane Canva, front-end, instrumente CRM și de marketing, jocuri de browser și aplicații educaționale. Toate rulează în browser, pe GitHub Pages, fără backend și fără dependențe.

**Live:** https://laurandreea10.github.io/codepen-portfolio/produse-digitale/

| # | Produs | Combină | Ce descarci |
|---|--------|---------|-------------|
| 01 | [Template Hub](template-hub/) | Canva × HTML/CSS | 6 șabloane (post, story, carusel, cover LinkedIn, prezentare SaaS, raport lunar) ca HTML sau PNG |
| 02 | [Gamified Marketing Widgets](widgets/) | Jocuri × marketing | `lw-widgets.js`: `<lw-spin-wheel>`, `<lw-scratch-card>`, `<lw-quiz>`, `<lw-memory>` + snippet |
| 03 | [CRM Dashboard UI Kit](dashboard-kit/) | CRM × design system | `lw-dashboard.js`: 7 Web Components + ZIP cu exemplu |
| 04 | [Marketing Starter Kit](starter-kit/) | Marketing Lab × Canva × Email | ZIP cu 8 fișiere: UTM, email responsive, 3 SVG sociale, tracker CSV, UTM builder |
| 05 | [Fișe printabile](printables/) | Gimnaziu Space × Grădina Curioasă | 7 tipuri de fișe A4, salvate ca PDF, cu răspunsuri |
| 06 | [Game Jam Kit](game-jam-kit/) | CodePen Challenges × open source | `gamekit.js` + joc demo + ZIP de pornire |

## Structură

```
produse-digitale/
├── index.html          pagina hub (catalog, filtre, demo live)
├── index.pen.html      versiunea într-un singur fișier, pentru CodePen
├── assets/pd.css       stiluri comune (navy/cyan/amber, dark/light, contrast ridicat)
├── assets/pd.js        RO/EN, temă, toast, copiere, descărcare, ZIP writer (STORE + CRC-32)
├── template-hub/
├── widgets/            lw-widgets.js
├── dashboard-kit/      lw-dashboard.js
├── starter-kit/
├── printables/
└── game-jam-kit/       gamekit.js, demo-game.js
```

## Principii

- **Fără backend:** ZIP-urile se construiesc în browser, PDF-urile din fereastra de printare, PNG-urile din canvas.
- **Web Components cu Shadow DOM:** se lipesc pe orice site fără conflicte de CSS.
- **Accesibilitate:** RO/EN, dark/light, contrast ridicat, tastatură, regiuni `aria-live`, `prefers-reduced-motion`.
- **Confidențialitate:** nimic nu e trimis nicăieri; în browser se păstrează doar tema, limba și recordurile din joc.

Codurile de reducere din widgeturi sunt generate în browser, pentru demonstrație; într-un magazin real se validează pe server.

## Licență

MIT · Laura Andreea
