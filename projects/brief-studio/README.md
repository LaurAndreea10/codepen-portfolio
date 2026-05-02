# Brief Studio

> A free marketing studio for small businesses. Three tools — campaign brief generator, visual mood boards, and competitor insights — built entirely on free public APIs. No accounts, no API keys, no costs.

[![Deploy](https://img.shields.io/badge/deploy-GitHub_Pages-6B1D2A?style=flat-square)](https://laurandreea10.github.io/brief-studio/)
[![Stack](https://img.shields.io/badge/stack-React_18_+_Vite-C9A961?style=flat-square)](#tech-stack)
[![Cost](https://img.shields.io/badge/cost-%240-2A2724?style=flat-square)](#how-it-works)
[![License](https://img.shields.io/badge/license-MIT-1A1816?style=flat-square)](#license)

---

## 🇷🇴 Despre proiect

**Brief Studio** este un mini-studio de marketing pentru small businesses, construit ca portfolio piece pentru a demonstra integrarea mai multor APIs publice gratuite într-o experiență coerentă, editorial-grade.

### Cele trei instrumente

**01 — Brief Generator**
Generează un brief de campanie complet în câteva secunde, structurat ca o publicație editorială:
- Campaign brief (obiectiv, audience insight, mesaj cheie, value props, KPI-uri, riscuri)
- 3 copy variants cu unghiuri strategice diferite (emoțional, direct, story-driven)
- 7-day editorial calendar (platformă, format, temă, conținut)
- Hashtag bundle pe 4 categorii (principale, niche, broad, trending)
- Context industrie alimentat cu date din **Wikipedia REST API**
- Export Markdown + copy to clipboard pentru fiecare element

**02 — Mood Board**
Compune un mood board vizual instant pentru orice combinație industrie + estetică:
- 6 imagini reale curate, autentice (cu atribuire către fotografi de pe Unsplash)
- Paletă cromatică sugerată cu 5 culori (cu hex codes copy-able și download SVG)
- 8 estetici predefinite (Minimalist, Maximalist, Vintage, Futuristic, Organic, Industrial, Pastel, Monochrome)
- Layout asimetric magazine-style cu hero image dominantă

**03 — Market Lens**
Explorează contextul de piață pentru orice brand sau topic:
- Descriere completă din **Wikipedia REST API** cu thumbnail
- 6 subiecte conexe (related topics) cu thumbnail-uri și descrieri scurte
- Date demografice ale pieței țintă din **REST Countries API** (populație, capitală, monedă, limbi, regiune)
- Steagul țării și cod ISO

### De ce este interesant tehnic

Proiectul demonstrează că o experiență „AI-style" de calitate poate fi construită fără costuri și fără AI live, prin:

1. **Template intelligence** — librării de value props, KPI templates și copy structures research-based, parametrizate dinamic
2. **API orchestration** — combinarea inteligentă a 3 surse publice (Wikipedia, REST Countries, Unsplash) într-un workflow coerent
3. **Editorial UX design** — fiecare output este structurat ca o pagină de revistă, nu ca un dashboard generic

---

## 🇬🇧 About

**Brief Studio** is a free marketing studio for small businesses, built as a portfolio piece demonstrating multi-API orchestration in a coherent, editorial-grade experience.

### Three tools

**01 — Brief Generator** — Full campaign brief in seconds: objective, key message, value props, KPIs, risks, 3 copy variants with distinct angles, 7-day editorial calendar, hashtag bundle. Industry context fed from **Wikipedia REST API**. Markdown export.

**02 — Mood Board** — Instant visual mood board for any industry + aesthetic combination. 6 curated real photos with photographer attribution from Unsplash, 5-color suggested palette with copyable hex codes, 8 predefined aesthetics. SVG palette download.

**03 — Market Lens** — Market context explorer for any brand or topic. Complete description from **Wikipedia REST API** with related topics and thumbnails. Target market demographics from **REST Countries API** (population, capital, currency, languages, region).

### Why it's technically interesting

The project demonstrates that an "AI-style" quality experience can be built without costs and without live AI, through:
1. **Template intelligence** — research-based value prop libraries, KPI templates, copy structures, dynamically parameterized
2. **API orchestration** — intelligent combination of 3 public sources (Wikipedia, REST Countries, Unsplash) into a coherent workflow
3. **Editorial UX design** — every output is structured as a magazine page, not a generic dashboard

---

## 🚀 Quick start

```bash
git clone https://github.com/LaurAndreea10/brief-studio.git
cd brief-studio
npm install
npm run dev
```

Open `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

---

## 🏗️ Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **React 18** | Industry standard |
| Build tool | **Vite 5** | Fast HMR, small bundles |
| Styling | **Tailwind CSS 3** | Utility-first, no runtime |
| Animation | **Framer Motion** | Production-grade transitions |
| Icons | **Lucide React** | Clean, tree-shakable |
| Data — text | **Wikipedia REST API** | Free, no key, RO+EN support |
| Data — country | **REST Countries API** | Free, no key, comprehensive |
| Data — visuals | **Unsplash** (curated photo IDs) | Free, real attribution, no key |
| Deploy | **GitHub Pages** | Free, automated via Actions |

**Bundle size:** ~107 KB gzipped JS, 5.4 KB gzipped CSS.

---

## 📐 Architecture

```
src/
├── App.jsx                       # Root, view routing
├── main.jsx                      # Entry point
├── index.css                     # Tailwind + custom design tokens
├── i18n.js                       # RO/EN translation dictionary
├── hooks.js                      # useTheme, useLanguage, useLocalStorage
├── export.js                     # Markdown export, palette SVG export, clipboard
├── components/
│   ├── Header.jsx                # Sticky header, theme/lang toggles
│   ├── Home.jsx                  # Landing + tools grid
│   ├── Footer.jsx
│   └── LoadingState.jsx          # Shared multi-stage loader
├── tools/                        # Engines (logic per tool)
│   ├── briefEngine.js            # Brief generation + Wikipedia fetch
│   ├── moodEngine.js             # Mood board composition
│   └── marketLensEngine.js       # Wikipedia + REST Countries
└── views/                        # Tool views (form + output)
    ├── BriefTool.jsx
    ├── MoodBoardTool.jsx
    └── MarketLensTool.jsx
```

### State flow

The app is a single SPA with view-based routing managed entirely by `useState` in `App.jsx`. Each tool view manages its own internal state (`form` → `loading` → `output`) independently.

No global state library, no router. The intentional simplicity reflects the project's philosophy: do more with less.

---

## 🔌 APIs used

### Wikipedia REST API
- **Endpoint:** `https://en.wikipedia.org/api/rest_v1` (and `/ro` for Romanian)
- **Auth:** None required
- **Rate limit:** Generous, no key needed
- **Used in:** Brief Generator (industry context), Market Lens (brand description + related topics)
- **Docs:** https://en.wikipedia.org/api/rest_v1/

### REST Countries API
- **Endpoint:** `https://restcountries.com/v3.1`
- **Auth:** None required
- **Used in:** Market Lens (country demographics)
- **Docs:** https://restcountries.com/

### Unsplash (curated photo IDs)
The mood board uses a curated set of stable Unsplash photo IDs. Direct image URLs are loaded from `images.unsplash.com` with proper attribution to photographers. No API calls, no key, no rate limits — just fast, optimized image delivery via Unsplash's CDN.

Each photo includes photographer name and link back to the original Unsplash page, in compliance with the [Unsplash License](https://unsplash.com/license).

---

## 🎨 Design system

### Colors

| Token | Light | Dark |
|---|---|---|
| Background | `#FBF8F3` (cream-50) | `#0E0D0C` (ink-700) |
| Surface | `#F5EFE4` (cream-100) | `#1A1816` (ink-600) |
| Text | `#1A1816` (ink-600) | `#F5EFE4` (cream-100) |
| Accent | `#6B1D2A` (oxblood-500) | `#C9A961` (gold-400) |

### Typography

- **Display:** Fraunces — variable optical sizing, italic accents
- **Body:** Inter Tight — tight line-height, optimized for UI
- **Mono:** JetBrains Mono — labels, indices, codes

### Motion

- Page transitions: `cubic-bezier(0.22, 1, 0.36, 1)` (eased-out)
- Stagger delays of 80-100ms for list items
- `prefers-reduced-motion` respected by Framer Motion

---

## 🚢 Deployment

### Setup (one time)

1. Fork or clone the repo
2. **Settings → Pages → Source:** select **GitHub Actions**
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` runs automatically

The base path in `vite.config.js` is set to `/brief-studio/`. If you fork and rename the repo, update this value.

---

## 🔐 Privacy

- **No tracking** — zero analytics scripts
- **No backend** — fully static, served from GitHub Pages
- **No accounts** — no signup, no cookies (except theme/language preferences in localStorage)
- **No data leaves your browser** — except calls to Wikipedia, REST Countries and Unsplash CDN

---

## 📝 License

MIT © 2026 Laura Andreea — see [LICENSE](LICENSE)

Photos from Unsplash are used under the [Unsplash License](https://unsplash.com/license) with proper attribution.
Wikipedia content is used under [CC BY-SA 4.0](https://en.wikipedia.org/wiki/Wikipedia:Copyrights).

---

<p align="center">
  <strong>Brief Studio</strong> · Vol. 01 · 2026<br>
  <sub>Built with ♥ in Romania · 100% free · No accounts · No tracking</sub>
</p>
