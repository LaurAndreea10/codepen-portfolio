# Laura Andreea — CodePen Portfolio

## Finalizat / Completed — 2026-10-10

**LIVADA v1.1.0** — [deschide / open](https://laurandreea10.github.io/codepen-portfolio/livada/) · [joacă Culesul / play The Harvest](https://laurandreea10.github.io/codepen-portfolio/livada/joc/) · [cum e construit / how it's built](livada/README.md). Din 1.1: joc de tăiat fructe cu viespi, mărul de aur, 4 moduri și 12 realizări. / Since 1.1: a fruit-slicing game with wasps, a golden apple, 4 modes and 12 achievements. Landing page cinematic pentru un brand fictiv de suc presat la rece: intro animat, titlu presat la scroll, arome care recolorează pagina, constructor de amestec, calendarul culesului; RO/EN. / Cinematic landing page for a fictional cold-pressed juice brand: animated intro, scroll-pressed title, flavours that recolour the page, blend builder, harvest calendar; RO/EN. Real-phone testing remains unverified.

## Finalizat / Completed — 2026-10-09

**LaurAI Growth Quest v2.0.1**: [public app](growth-quest/) · [Luna Bakery case study](growth-quest/demo-case.html) · [guide, inventory and limitations](growth-quest/README.md). Agency game, marketing and CRM Studio; RO/EN, local backups and offline support. Automated logic/import/recovery tests passed; real-device and screen-reader checks remain pending.


<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-laurandreea10.github.io-4f8cff?style=for-the-badge&labelColor=071226)](https://laurandreea10.github.io/codepen-portfolio/)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-8b5cf6?style=for-the-badge&logo=github&labelColor=071226)](https://laurandreea10.github.io/codepen-portfolio/)
[![Projects](https://img.shields.io/badge/Projects-45_live-22c55e?style=for-the-badge&labelColor=071226)](https://laurandreea10.github.io/codepen-portfolio/#projects)
[![Language](https://img.shields.io/badge/Lang-RO_%7C_EN-facc15?style=for-the-badge&labelColor=071226)](https://laurandreea10.github.io/codepen-portfolio/)

</div>

---

<details open>
<summary><strong>🇷🇴 Română</strong></summary>

<br>

> **Portofoliu front-end interactiv** cu 45 de proiecte live, preview instant, filtrare, căutare, mod întunecat/luminos și suport bilingv RO/EN.
> Construit din pasiune pentru front-end, cu o gândire formată în 5+ ani de CRM și Marketing.

### ✨ Features

| Feature | Detalii |
|---|---|
| 🔴 **Live Preview** | Fiecare proiect are preview generat local, vizibil chiar și când iframe-ul extern e blocat |
| 🔍 **Căutare instant** | Filtrare după nume, tag-uri sau descriere, cu contor live de rezultate |
| 🧩 **Filtre categorii** | Game · Utility · UI · Challenge |
| 🌙 **Dark / ☀️ Light** | Toggle cu persistență în `localStorage` |
| 🌍 **RO / EN** | Traduceri complete, preferință salvată în `localStorage` |
| 📱 **Fully Responsive** | Mobile-first, testat pe ecrane de la 320px la 1440px+ |
| ♿ **Accesibil** | Skip link, `aria-label`, `aria-live`, `aria-pressed`, `role="group"`, `focus-visible` |
| 🔎 **SEO complet** | Open Graph, Twitter Card, Schema.org Person, sitemap.xml, robots.txt, canonical |
| 📚 **Mini case studies** | Fiecare proiect Featured are secțiunea Problemă → Soluție → Decizie → Ce demonstrează |

### 🛠️ Tehnologii

```
HTML5        — structură semantică, accesibilitate, meta tags complete
CSS3         — custom properties, glassmorphism, dark/light theme, responsive grid
JavaScript   — ES6+, fetch async, i18n manual, localStorage, DOM dinamic
GitHub Pages — hosting static, deployment direct din branch main
```

**Nicio dependență externă. Zero npm. Zero build step.**

### 📁 Structură

```
codepen-portfolio/
├── index.html        # Structura HTML — fără CSS sau JS inline
├── style.css         # Toate stilurile, variabile CSS, responsive
├── main.js           # Logica aplicației, i18n, filtre, preview, render
├── projects.json     # Datele celor 45 de proiecte — editabil separat
├── favicon.svg       # Favicon vector gradient CP
├── og-cover.svg      # Cover 1200×630 pentru Open Graph / Twitter Card
├── robots.txt        # Directive pentru crawlere
└── sitemap.xml       # Sitemap pentru SEO
```

> **De ce fișiere separate?**
> CSS și JS sunt extrase din HTML pentru mentenanță ușoară.
> `projects.json` permite adăugarea unui proiect nou fără să atingi codul.

### 🗂️ Categorii de proiecte

| Categorie | Nr. | Exemple |
|---|---|---|
| 🎮 **Game** | 18 | Basket vs AI, Void Hunter, Bomberman Neo, Flappy Ball, Maze |
| 🛠️ **Utility** | 19 | ClientFlow SaaS, BudgetFlow Pro, Event Planner, CoachingAI, BAC Space |
| 🎨 **UI** | 5 | Synth Wave, Gravity Draw, Color Lab, Sad UI, Playground Ultra |
| 🧠 **Challenge** | 6 | Boolean Oracle, Opposite Directions, Code Words, Front-End Opposites |

### 🚀 Rulare locală

Proiectul folosește `fetch('projects.json')`, deci are nevoie de un server local (nu funcționează cu `file://`).

**Varianta 1 — Python (recomandat, fără instalare):**
```bash
git clone https://github.com/LaurAndreea10/codepen-portfolio.git
cd codepen-portfolio
python3 -m http.server 8080
# Deschide http://localhost:8080
```

**Varianta 2 — Node.js:**
```bash
npx serve .
```

**Varianta 3 — VS Code:**
Instalează extensia [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) și apasă *Go Live*.

### 📐 Decizii de arhitectură

**Date externalizate în JSON**
`projects.json` conține toate cele 45 de proiecte cu titlu, descriere, tags, URL și mini case study în RO și EN. Adăugarea unui proiect nou = un obiect JSON, fără atingerea codului HTML sau JS.

**i18n fără librărie**
Traducerile sunt stocate într-un obiect `translations` în `main.js`. Elementele HTML cu `data-i18n` sunt actualizate la toggle, inclusiv meta tags OG și Twitter Card.

**Preview iframe local**
Unele proiecte CodePen blochează embedding extern. Soluția: iframe-ul afișează un document HTML generat dinamic local, cu thumbnail-ul proiectului, descrierea și case study-ul.

**CSS custom properties pentru theming**
Dark/Light se face exclusiv prin clasa `.light` pe `body` și 9 variabile CSS (`--bg`, `--panel`, `--accent` etc.). Zero JavaScript pentru stiluri, control complet din JS.

### 👩‍💻 Autoare

**Laura Andreea** — Front-end autodidact cu background de 5+ ani în CRM și Marketing.

Construiesc proiecte care combină logică, structură și UX gândit din perspectiva utilizatorului real — nu doar estetică.

[![GitHub](https://img.shields.io/badge/GitHub-LaurAndreea10-181717?style=flat-square&logo=github)](https://github.com/LaurAndreea10)
[![CodePen](https://img.shields.io/badge/CodePen-Laura--Andreea-000000?style=flat-square&logo=codepen)](https://codepen.io/Laura-Andreea-the-typescripter)
[![Email](https://img.shields.io/badge/Email-andreealaurap@gmail.com-4f8cff?style=flat-square&logo=gmail&logoColor=white)](mailto:andreealaurap@gmail.com)

### ⭐ Dacă îți place

Lasă un ⭐ pe repo și deschide portofoliul live — fiecare proiect are un preview interactiv direct în pagină.

[![Live Demo](https://img.shields.io/badge/→_Deschide_portofoliul-4f8cff?style=for-the-badge)](https://laurandreea10.github.io/codepen-portfolio/)

</details>

---

<details>
<summary><strong>🇬🇧 English</strong></summary>

<br>

> **Interactive front-end portfolio** with 45 live projects, instant preview, filtering, search, dark/light mode and bilingual RO/EN support.
> Built from a passion for front-end development, shaped by 5+ years of experience in CRM and Marketing.

### ✨ Features

| Feature | Details |
|---|---|
| 🔴 **Live Preview** | Every project has a locally generated preview, visible even when external iframe embedding is blocked |
| 🔍 **Instant Search** | Filter by name, tags or description, with a live results counter |
| 🧩 **Category Filters** | Game · Utility · UI · Challenge |
| 🌙 **Dark / ☀️ Light** | Toggle with persistence via `localStorage` |
| 🌍 **RO / EN** | Full translations, language preference saved in `localStorage` |
| 📱 **Fully Responsive** | Mobile-first, tested from 320px to 1440px+ |
| ♿ **Accessible** | Skip link, `aria-label`, `aria-live`, `aria-pressed`, `role="group"`, `focus-visible` |
| 🔎 **Full SEO** | Open Graph, Twitter Card, Schema.org Person, sitemap.xml, robots.txt, canonical |
| 📚 **Mini case studies** | Every Featured project includes a Problem → Solution → Decision → What it demonstrates section |

### 🛠️ Technologies

```
HTML5        — semantic structure, accessibility, complete meta tags
CSS3         — custom properties, glassmorphism, dark/light theme, responsive grid
JavaScript   — ES6+, async fetch, manual i18n, localStorage, dynamic DOM
GitHub Pages — static hosting, deployment directly from main branch
```

**No external dependencies. Zero npm. Zero build step.**

### 📁 Structure

```
codepen-portfolio/
├── index.html        # HTML structure — no inline CSS or JS
├── style.css         # All styles, CSS variables, responsive rules
├── main.js           # App logic: i18n, filters, preview, rendering
├── projects.json     # Data for all 45 projects — editable independently
├── favicon.svg       # Vector gradient CP favicon
├── og-cover.svg      # 1200×630 cover for Open Graph / Twitter Card
├── robots.txt        # Crawler directives
└── sitemap.xml       # SEO sitemap
```

> **Why separate files?**
> CSS and JS are extracted from HTML for easier maintenance.
> `projects.json` lets you add a new project without touching any code.

### 🗂️ Project Categories

| Category | Count | Examples |
|---|---|---|
| 🎮 **Game** | 18 | Basket vs AI, Void Hunter, Bomberman Neo, Flappy Ball, Maze |
| 🛠️ **Utility** | 19 | ClientFlow SaaS, BudgetFlow Pro, Event Planner, CoachingAI, BAC Space |
| 🎨 **UI** | 5 | Synth Wave, Gravity Draw, Color Lab, Sad UI, Playground Ultra |
| 🧠 **Challenge** | 6 | Boolean Oracle, Opposite Directions, Code Words, Front-End Opposites |

### 🚀 Running locally

The project uses `fetch('projects.json')`, so it needs a local server (won't work with `file://`).

**Option 1 — Python (recommended, no install needed):**
```bash
git clone https://github.com/LaurAndreea10/codepen-portfolio.git
cd codepen-portfolio
python3 -m http.server 8080
# Open http://localhost:8080
```

**Option 2 — Node.js:**
```bash
npx serve .
```

**Option 3 — VS Code:**
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and click *Go Live*.

### 📐 Architecture decisions

**Data externalized to JSON**
`projects.json` holds all 45 projects with title, description, tags, URL and a bilingual mini case study. Adding a new project = one JSON object, no HTML or JS changes needed.

**i18n without a library**
Translations are stored in a `translations` object in `main.js`. Elements with `data-i18n` are updated on toggle, including OG and Twitter Card meta tags — useful for shared links in either language.

**Local iframe preview**
Some CodePen projects block external embedding. The solution: the iframe renders a dynamically generated local HTML document with the project thumbnail, description and case study — no embedding errors, full experience preserved.

**CSS custom properties for theming**
Dark/Light switching is done exclusively via the `.light` class on `body` and 9 CSS variables (`--bg`, `--panel`, `--accent`, etc.). Zero JavaScript for styles, full control from JS.

### 👩‍💻 Author

**Laura Andreea** — Self-taught front-end developer with a 5+ year background in CRM and Marketing.

I build projects that combine logic, structure and UX shaped by real user perspective — not just aesthetics.

[![GitHub](https://img.shields.io/badge/GitHub-LaurAndreea10-181717?style=flat-square&logo=github)](https://github.com/LaurAndreea10)
[![CodePen](https://img.shields.io/badge/CodePen-Laura--Andreea-000000?style=flat-square&logo=codepen)](https://codepen.io/Laura-Andreea-the-typescripter)
[![Email](https://img.shields.io/badge/Email-andreealaurap@gmail.com-4f8cff?style=flat-square&logo=gmail&logoColor=white)](mailto:andreealaurap@gmail.com)

### ⭐ If you like it

Drop a ⭐ on the repo and open the live portfolio — every project has an interactive preview right in the page.

[![Live Demo](https://img.shields.io/badge/→_Open_portfolio-4f8cff?style=for-the-badge)](https://laurandreea10.github.io/codepen-portfolio/)

</details>
\n## Featured accessible game

### LOOP — Cosmic Relay

An accessible cosmic PWA with nine game modes, progressive difficulty, switch scanning, adjustable safe zones, haptics, local profiles and import/export progress.

[Live game](https://laurandreea10.github.io/LOOP-Cosmic-Relay/) · [Bilingual case study](https://laurandreea10.github.io/codepen-portfolio/projects/loop-cosmic-relay.html) · [Repository](https://github.com/LaurAndreea10/LOOP-Cosmic-Relay)


### Grădina Curioasă / Curious Garden

- [Joacă / Play](https://laurandreea10.github.io/codepen-portfolio/curious-garden/) · [Cod sursă / Source](https://github.com/LaurAndreea10/codepen-portfolio/tree/main/curious-garden/) · [Studiu de caz / Case study](https://laurandreea10.github.io/codepen-portfolio/curious-garden/case-study.html) — joc educativ pentru 3–12 ani în RO/EN/HU/UK, cu 12 lumi, labirinturi generate, jocuri noi, recompense, raport pentru părinți, accesibilitate, mod offline și teste automate.
- [Arcade World](https://laurandreea10.github.io/ARCADE-WORLD/) — acces din catalogul de jocuri.


## Colecție Canva / Canva collection

[Joacă Excel Quest / Play Excel Quest](https://laurandreea10.github.io/Excel-Quest/enhanced-pro-v2.html) — acces direct din cele patru materiale Excel pe paginile colecției. Limba se schimbă în joc prin controlul RO/EN. / Direct access from the four Excel materials on the collection pages. Select the language using the game's RO/EN control.

[RO](https://laurandreea10.github.io/codepen-portfolio/canva-collection.html) · [EN](https://laurandreea10.github.io/codepen-portfolio/en/canva-collection.html)

14 materiale de design pentru educație, CRM și marketing, inclusiv șase drafturi asistate de AI. Pagini de colecție separate RO și EN; contribuțiile manuale personale rămân de documentat. Colecția este separată de contorizarea aplicațiilor live.

14 design materials for education, CRM and marketing, including six AI-assisted drafts. Separate RO and EN collection pages; personal manual contributions remain to be documented. This collection is separate from the live-app count.

- Carusel Excel Quest / Excel Quest carousel: https://canva.link/0gwodnr0lqil4xp
- Story Excel Quest / Excel Quest story: https://canva.link/3cj0bie3oa1wcmq
- Ghid vizual / Visual guide: https://canva.link/809kiypih93j4m6
- Prezentare Excel Quest / Excel Quest presentation: https://canva.link/2lqgfbcvgkueavx
- Infografic CRM / CRM infographic: https://canva.link/ms8gtpxn95cxqkz
- Ghid Excel / Excel guide: https://canva.link/o9fn6tcta2re2wd
- Studiu de caz reutilizabil / Reusable case study: https://canva.link/85g35ofppw7s4bp
- Șablon de raport CRM · RO/EN: https://www.canva.com/d/mQXyxSnI06wwPmA
- Carusel social media · RO/EN: https://www.canva.com/d/cUT5L_Mwx8U4lvX
- Story social media · RO/EN: https://www.canva.com/d/CqbCV0r9GlNvsl1
- Post pătrat: https://www.canva.com/d/Jh2gvDtVdcih_-v
- Cover LinkedIn: https://www.canva.com/d/IDayN8mvmHn-RXN
- Prezentare SaaS · RO/EN: https://www.canva.com/d/eU6lc8_WmIuVhcU
- Raport lunar de marketing · RO/EN: https://www.canva.com/d/N0vn8ha5duXGAkl


## PentArena · v2.1.0 · 2026-10-05

[Joacă / Play](https://laurandreea10.github.io/codepen-portfolio/pentarena/) · [README](pentarena/README.md) · [Istoric / History](pentarena/CHANGELOG.md)

RO — Cinci sporturi arcade (baschet, fotbal, air hockey, volei, biliard) contra AI sau în doi pe același ecran: carieră în trei ligi, provocare zilnică, reluări, bonusuri, vestiar, 16 realizări și PWA offline; din 2.1, teren pe verticală pe telefon. Testele automate de logică și browser (4 viewporturi, touch, multitouch, offline, axe) trec; telefonul real și cititorul de ecran rămân de confirmat.

EN — Five arcade sports (basketball, football, air hockey, volleyball, pool) against the AI or a friend on one screen: three-league career, daily challenge, replays, power-ups, locker, 16 achievements and an offline PWA; since 2.1 a vertical field on portrait phones. Automated logic and browser checks (4 viewports, touch, multitouch, offline, axe) pass; real phones and screen readers remain unverified.

## Odyssey Quest · 2026-09-30

[Joacă / Play](https://laurandreea10.github.io/codepen-portfolio/odyssey-quest/) · [Studiu de caz / Case study](odyssey-quest/case-study.html) · [Documentație / Docs](odyssey-quest/README.md)

12 insule, 120 de probe, 11 moduri, RO/EN, accesibil fără reacții rapide, PWA offline și, din 2.1, duel WebRTC între dispozitive.

12 islands, 120 trials, 11 modes, RO/EN, accessible with no quick reactions, offline PWA and, since 2.1, a WebRTC duel between devices.



## SlideStorm Arena · v2.4.0 · 2026-10-02

[Joacă / Play](https://laurandreea10.github.io/codepen-portfolio/slidestorm-arena/) · [Studiu de caz / Case study](https://laurandreea10.github.io/codepen-portfolio/slidestorm-arena/case-study.html) · [README](slidestorm-arena/README.md) · [Istoric / History](slidestorm-arena/CHANGELOG.md)

RO — 100 de niveluri, 8 sporturi, 11 moduri, constructor de trasee, progres local validat și opțiuni de accesibilitate. v2.2.0 aduce grafică nouă (10 teme, ținte pentru fiecare sport, vreme, calitate adaptivă); v2.3.0 adaugă sunete, ciclu zi–noapte și peisaje noi; v2.4.0 aduce muzică, ceață și vânt, cameră pe mobil, tobogane noi și fotografie de final. Testarea practică pe mobil rămâne de confirmat.

EN — 100 levels, eight sports, eleven modes, route builder and validated local progress. v2.2.0 adds new graphics (10 themes, per-sport targets, weather, adaptive quality); v2.3.0 adds sound, a day–night cycle and new scenery; v2.4.0 brings music, fog and wind, a mobile camera, new slides and a finish photo. Real-device mobile validation remains unverified.

## Serpent Prism · v1.5.0 · 2026-10-02

[Joacă / Play](https://laurandreea10.github.io/codepen-portfolio/serpent-prism/) · [README](serpent-prism/README.md) · [Changelog](serpent-prism/CHANGELOG.md)

RO: Zuma × Snake într-o singură arenă, șase moduri, tutorial bilingv, Ușor implicit, sunet și progres local.

EN: Zuma × Snake in one arena, six modes, bilingual tutorial, default Easy assistance, audio and local progress.

Verificările automate ale logicii și rutării audio au trecut; testarea reală pe mobil și cu cititor de ecran rămâne de confirmat. / Logic and audio routing checks pass; real-device mobile and screen-reader validation remain unverified.

Serpent Prism v1.5.0: primul nivel ghidat, obiective progresive, rezultate și regresie automată mobilă. / Guided first level, progressive goals, results and automated mobile regression.


Serpent Prism v1.6.0 (2026-10-03): assisted collection moves the snake to arena orbs; Aqua/Dune/Neon story worlds; accessible RO/EN level map and replay without losing unlocked progress. Reduced motion and turn-based collection resolve immediately.


Serpent Prism v1.7.0 — 2026-10-03: collection route/rerouting/cancel; Aqua waves, Dune warnings, Neon matching gate; stars, cosmetic milestones, daily rewards and no-time-pressure preference (RO/EN).


Serpent Prism v1.9.0 — 2026-10-03: compact mobile arena and controls, handcrafted formations/finales and three limited-ammo puzzles, validated JSON progress merge, offline PWA shell and explicit update activation. RO/EN and accessibility retained; prior versions preserved.

