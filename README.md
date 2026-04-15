# Laura Andreea — CodePen Portfolio

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-laurandreea10.github.io-4f8cff?style=for-the-badge&labelColor=071226)](https://laurandreea10.github.io/codepen-portfolio/)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-8b5cf6?style=for-the-badge&logo=github&labelColor=071226)](https://laurandreea10.github.io/codepen-portfolio/)
[![Projects](https://img.shields.io/badge/Projects-48_live-22c55e?style=for-the-badge&labelColor=071226)](https://laurandreea10.github.io/codepen-portfolio/#projects)
[![Language](https://img.shields.io/badge/Lang-RO_%7C_EN-facc15?style=for-the-badge&labelColor=071226)](https://laurandreea10.github.io/codepen-portfolio/)

</div>

---

<details open>
<summary><strong>🇷🇴 Română</strong></summary>

<br>

> **Portofoliu front-end interactiv** cu 48 de proiecte live, preview instant, filtrare, căutare, mod întunecat/luminos și suport bilingv RO/EN.
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
├── projects.json     # Datele celor 48 de proiecte — editabil separat
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
`projects.json` conține toate cele 48 de proiecte cu titlu, descriere, tags, URL și mini case study în RO și EN. Adăugarea unui proiect nou = un obiect JSON, fără atingerea codului HTML sau JS.

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

> **Interactive front-end portfolio** with 48 live projects, instant preview, filtering, search, dark/light mode and bilingual RO/EN support.
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
├── projects.json     # Data for all 48 projects — editable independently
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
`projects.json` holds all 48 projects with title, description, tags, URL and a bilingual mini case study. Adding a new project = one JSON object, no HTML or JS changes needed.

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
