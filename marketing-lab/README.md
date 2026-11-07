# Marketing Lab

15 proiecte de portofoliu: instrumente de marketing, analiză de date și front-end, într-o singură aplicație cu istoric de navigare. Totul rulează în browser, fără backend, gata pentru GitHub Pages. Interfața e în română și engleză, are temă dark/light și e accesibilă de la tastatură.

**Autor:** Laura Andreea · Iași

## Proiecte

| # | Proiect | Ce demonstrează |
|---|---|---|
| 01 | UTM Builder & Campaign Tracker | URL API, validarea convențiilor GA4, export CSV |
| 02 | Calculator A/B testing | test z pe două proporții, intervale de încredere, mărimea eșantionului |
| 03 | Email Template Builder | drag & drop, HTML pe tabele, buton VML pentru Outlook, verificări |
| 04 | Customer Journey Mapper | curba emoțiilor în SVG, editor inline, import/export JSON |
| 05 | Lead Scoring Simulator | motor de reguli, degradare în timp, scor explicat |
| 06 | Cohort Retention Heatmap | parsare CSV, cohorte lunare/săptămânale, curba de retenție |
| 07 | Marketing Mix Dashboard | curbe cu randament descrescător, optimizare greedy a bugetului |
| 08 | Design System & Component Library | tokens, componente în stil Storybook, export W3C Design Tokens |
| 09 | Mini-CRM în TypeScript | TS strict, tipul Result, tranziții de pipeline, 13 teste Vitest |
| 10 | Web Components | `<kpi-card>` și `<month-range-picker>` cu Shadow DOM și CustomEvent |
| 11 | PWA offline-first | IndexedDB, BroadcastChannel între taburi, Service Worker |
| 12 | SEO Inspector, extensie Chrome | Manifest V3, același analizor în aplicație și în extensie |
| 13 | Performance Lab & studiu de caz | Core Web Vitals live, contor FPS, raport Markdown înainte/după |
| 14 | Audit de accesibilitate | scanner WCAG AA, verificator de contrast, tabel sortabil accesibil |
| 15 | De la Canva la cod | suprapunere/diferență/swipe peste exportul PNG din Canva, extragerea paletei |

## Istoric de navigare

- Fiecare proiect are propria adresă (`#utm`, `#cohort`, `#canva-to-code`…), deci linkurile se pot trimite și salva ca bookmark.
- Butoanele ← → din bară sunt sincronizate cu butoanele Înapoi/Înainte ale browserului (`history.state`). Traseul sesiunii rămâne și după reîncărcarea paginii.
- Panoul Istoric (butonul 🕘 sau tasta **H**) arată toate vizitele, cu ora și timpul petrecut pe fiecare pagină. Se salvează în `localStorage`.
- Scurtături: **[** = înapoi, **]** = înainte, **Esc** = închide panoul.
- Pagina de start are secțiunea „Continuă de unde ai rămas” și marchează proiectele vizitate.

## Structură

```
marketing-lab/
├── index.html            ← aplicația completă, un singur fișier (generat)
├── index.pen.html        ← aceeași versiune, pentru CodePen
├── sw.js, manifest.webmanifest, icons/   ← PWA (#11)
├── og.png                ← imaginea pentru Open Graph
├── src/                  ← sursele: core.js (router + istoric), m-*.js (module), style.css
├── ts-crm/               ← proiectul TypeScript (#09): src/crm.ts, tests/, tsconfig.json
├── extension/            ← extensia Chrome (#12)
└── build.py              ← compilează TS și pune totul inline în index.html
```

## Comenzi

```bash
# TypeScript + teste
cd ts-crm && npm install && npm test        # 13/13 teste trecute

# reconstruiește index.html după ce modifici ceva în src/
python3 build.py
```

**Extensia:** deschide `chrome://extensions`, activează Developer mode, apasă „Load unpacked” și alege folderul `extension/`.

**Deploy:** copiază folderul în `codepen-portfolio/marketing-lab/` și dă push. Service Worker-ul se activează doar pe HTTPS, deci pe GitHub Pages.

## Note oneste

- Parametrii curbelor din #07 sunt ilustrativi. Într-un proiect real îi estimezi din datele istorice.
- Sincronizarea din #11 e simulată, pentru că proiectul nu are server. Coada arată exact ce ar trimite aplicația către un API.
- Studiul de caz din #13 nu are cifre precompletate. Rulezi Lighthouse pe jocul tău și treci rezultatele reale.
