# CampaignPilot

> Workspace unificat pentru planificarea unei campanii marketing — de la idee la rezultate.

[Live Demo](https://laurandreea10.github.io/codepen-portfolio/campaignpilot.html)

![CampaignPilot preview](./screenshot.svg)

---

## Project Origin

Vin din background CRM și marketing. Ani buni am văzut cum echipele de growth pierd timp jonglând între 5 tab-uri: spreadsheet pentru buget, alt tool pentru content calendar, al treilea pentru briefs, al patrulea pentru KPI tracking.

**CampaignPilot** rezolvă fragmentarea: un workspace unde toate piesele unei campanii trăiesc împreună.

A pornit ca un brief generator simplu. La fiecare iterație devenea evident că marketing-ul are nevoie de **logică de produs**, nu doar de un template Excel mai frumos. Așa au apărut funnel-ul vizual, KPI-urile cu praguri și budget allocator-ul cu validare în timp real.

---

## Features

### 6 module integrate

| Module | Ce face |
|---|---|
| KPI Overview | 6 metrici cheie cu praguri configurabile + status auto-colorat |
| Funnel Builder | 5 etape cu drop-off calculat |
| Budget Allocation | Pie chart interactiv pe canale, cu validare buget |
| Content Calendar | Vizualizare săptămânală + grid lunar |
| Brief Generator | Template structurat, export markdown/PDF |
| Campaign Library | Istoric campanii cu filtre |

### UX Premium

- Bilingv RO/EN cu toggle persistent
- Dark/Light theme + high-contrast support
- Autosave în localStorage
- Keyboard shortcuts pentru navigare rapidă
- Empty states informative
- Responsive: desktop sidebar → mobile bottom nav

---

## Stack

- Vanilla JavaScript
- CSS Variables
- localStorage
- Chart.js lazy-loaded pentru chart-uri
- GitHub Pages

---

## Roadmap

Vezi [CHANGELOG.md](./CHANGELOG.md).

- [ ] Export campanie completă ca PDF unificat
- [ ] A/B test simulator
- [ ] Integrare opțională Google Sheets
- [ ] Multi-campaign comparator
- [ ] Template-uri pe industrii

---

## Author

**Laura Andreea** · [Portofoliu](https://laurandreea10.github.io/codepen-portfolio/) · [GitHub](https://github.com/LaurAndreea10)
