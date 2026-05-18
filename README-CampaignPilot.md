# CampaignPilot · Marketing Planner & KPI Hub

> Workspace unificat pentru planificarea unei campanii de la idee la rezultate.

[![Live Demo](https://img.shields.io/badge/Live-Demo-4f8cff?style=flat-square)](https://laurandreea10.github.io/codepen-portfolio/campaignpilot.html)
[![Built with](https://img.shields.io/badge/Built_with-Vanilla_JS-f7df1e?style=flat-square)](#stack)
[![Bilingual](https://img.shields.io/badge/Bilingual-RO_·_EN-22d3ee?style=flat-square)](#)
[![Zero Backend](https://img.shields.io/badge/Backend-0€-4ade80?style=flat-square)](#)

## Project Origin

Vin din background CRM și marketing — ani buni am văzut cum echipele de growth pierd timp jonglând între 5 tab-uri: spreadsheet pentru buget, alt tool pentru content calendar, al treilea pentru briefs, al patrulea pentru KPI tracking. **CampaignPilot** încearcă să rezolve fragmentarea: un workspace unde toate piesele unei campanii trăiesc împreună.

A pornit ca un brief generator simplu, dar la fiecare iterație devenea evident că marketing-ul are nevoie de **logică de produs**, nu doar de un template Excel mai frumos. Așa au apărut funnel-ul vizual, KPI-urile cu pragguri și budget allocator-ul cu validare în timp real.

## Live Demo

[https://laurandreea10.github.io/codepen-portfolio/campaignpilot.html](https://laurandreea10.github.io/codepen-portfolio/campaignpilot.html)

## Features

### Module integrate

- **KPI Overview** — 6 metrici cheie (reach, CTR, conversie, CAC, ROAS, MRR) cu praguri configurabile și status auto-colorat (verde / galben / roșu)
- **Funnel Builder** — 5 etape (awareness → interest → consideration → conversion → retention) cu drop-off rate calculat
- **Budget Allocation** — pie chart interactiv pe canale (paid social, search, content, email, influencer), cu validare să nu depășești bugetul total
- **Content Calendar** — vizualizare săptămânală + grid lunar, drag-and-drop între date
- **Brief Generator** — template structurat (audience, goal, message, channels, KPIs, timeline), export ca markdown sau PDF
- **Campaign Library** — istoricul campaniilor cu filter pe canal, status, perioada

### UX Premium

- Bilingv RO/EN cu toggle persistent
- Dark/Light theme
- Autosave în localStorage la fiecare schimbare
- Keyboard shortcuts pentru navigare rapidă între module
- Empty states informative cu acțiuni sugerate
- Responsive: desktop sidebar → mobile bottom nav

## Stack

- **Vanilla JavaScript** — zero framework, ~1200 linii organizate în module
- **CSS Variables** — design system cu dark/light theme și gradient mesh
- **localStorage** — persistență fără backend
- **Chart.js** (lazy loaded) — pentru funnel și budget pie chart
- **GitHub Pages** — deploy

## Why no React?

CampaignPilot e construit ca **template**, nu ca SaaS. Decizia a fost ca un marketing manager să poată fork-ui repo-ul, edita 2 fișiere și să aibă propriul workspace pe propriul domeniu. Vanilla JS face fork-ul accesibil pentru oameni care nu știu npm.

Pentru comparație: același tip de produs cu logică mai complexă l-am construit cu React + Vite în [Alpis Fusion CRM Premium](https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium).

## Roadmap

- [x] KPI overview cu praguri
- [x] Funnel builder vizual
- [x] Budget allocation
- [x] Content calendar
- [x] Brief generator
- [x] Bilingv RO/EN
- [ ] Export campanie completă ca PDF unificat
- [ ] A/B test simulator (variantele de copy + estimare uplift)
- [ ] Integrare opțională Google Sheets ca backup

## Getting Started

Nu necesită build. Doar:

```bash
git clone https://github.com/LaurAndreea10/CampaignPilot.git
cd CampaignPilot
# Deschide index.html în browser, sau:
npx serve .
```

## Structure

```
CampaignPilot/
├── index.html
├── styles/
│   ├── base.css
│   ├── theme.css
│   └── components.css
├── scripts/
│   ├── kpi.js
│   ├── funnel.js
│   ├── budget.js
│   ├── calendar.js
│   ├── brief.js
│   └── i18n.js
└── README.md
```

## License

MIT — vezi [LICENSE](LICENSE)

## Author

**Laura Andreea** · [Portofoliu](https://laurandreea10.github.io/codepen-portfolio/) · [GitHub](https://github.com/LaurAndreea10) · [LinkedIn](https://www.linkedin.com/in/laura-andreea-p-8b230014b/)
