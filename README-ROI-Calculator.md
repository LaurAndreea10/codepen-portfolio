# Campaign ROI Calculator · Marketing Analytics Tool

> Calculator interactiv pentru evaluarea performanței campaniilor marketing.

[![Live Demo](https://img.shields.io/badge/Live-Demo-4f8cff?style=flat-square)](https://laurandreea10.github.io/codepen-portfolio/Campaign%20ROI%20Calculator.html)
[![Built with](https://img.shields.io/badge/Built_with-Vanilla_JS-f7df1e?style=flat-square)](#stack)
[![Bilingual](https://img.shields.io/badge/Bilingual-RO_·_EN-22d3ee?style=flat-square)](#)
[![Zero Backend](https://img.shields.io/badge/Backend-0€-4ade80?style=flat-square)](#)

## Project Origin

În experiența mea în CRM și marketing, întrebarea care apărea cel mai des în meeting-uri era: **"OK, dar ce ROI a făcut campania asta?"** — și răspunsul venea după 2 zile de săpat prin spreadsheet-uri, cu cifre care nu se potriveau între departamente.

**Campaign ROI Calculator** transformă întrebarea într-un formular de 30 de secunde. Introduci budget, revenue și costuri secundare → primești ROI, ROAS, CAC, cost/lead și profitabilitate, cu interpretare clară (verde / galben / roșu) pentru fiecare metric.

Tool-ul e gândit pentru două audiențe: **marketing manageri** care vor o privire rapidă înainte de meeting, și **founderi** care nu vor să învețe vocabular financiar înainte să înțeleagă dacă campania lor a fost profitabilă.

## Live Demo

[https://laurandreea10.github.io/codepen-portfolio/Campaign%20ROI%20Calculator.html](https://laurandreea10.github.io/codepen-portfolio/Campaign%20ROI%20Calculator.html)

## Features

### Calcule integrate

- **ROI** = (Revenue - Cost) / Cost × 100
- **ROAS** = Revenue / Ad Spend
- **CAC** (Customer Acquisition Cost) = Total Cost / Customers Acquired
- **Cost per Lead** = Total Cost / Leads Generated
- **Lead-to-Customer Rate** = Customers / Leads × 100
- **Profit Margin** = (Revenue - Total Cost) / Revenue × 100
- **Break-even Point** — câți customers trebuie să mai aduci ca să acoperi costurile
- **Revenue Forecast** — estimare la rate-uri de conversie diferite (±10%, ±25%)

### Interpretare automată

Fiecare metric primește un **status visual** bazat pe benchmarks de industrie:
- 🟢 Verde: peste benchmark (ROI > 200%, ROAS > 4x, etc.)
- 🟡 Galben: în zona de break-even sau ușor sub
- 🔴 Roșu: pierdere clară, campania nu se susține

Plus o **interpretare textuală** care explică ce înseamnă cifrele în limbaj non-tehnic:
> *"Pentru fiecare 1€ investit, recuperezi 2.40€ în revenue. Bună, dar profit margin sub 15% sugerează că ai costuri secundare prea mari — verifică tooling și salarii alocate."*

### UX

- Bilingv RO/EN
- Dark/Light theme
- Calcule în timp real (nu trebuie buton "Calculate")
- Export rezultat ca PDF printabil
- Copy results to clipboard pentru raport rapid
- Presets pentru scenarii uzuale (e-commerce, B2B SaaS, lead gen agency)
- Validare inputs (no negative, no division by zero)

## Stack

- **Vanilla JavaScript** — zero dependency, ~800 linii
- **CSS Variables** — theme support
- **localStorage** — păstrează ultima campanie introdusă
- **No charts library** — graficul simplu de revenue forecast e SVG generat

## Why no framework?

Acesta e un **single-purpose tool** — nu un produs. Un marketing manager care îl deschide vrea un răspuns în 30 sec, nu să încarce 200 KB de React pentru un calculator. Vanilla JS face load time-ul sub 100 ms și funcționează offline imediat ce-l ai deschis.

## Roadmap

- [x] ROI / ROAS / CAC / Cost per Lead
- [x] Interpretare automată cu status colorat
- [x] Bilingv RO/EN
- [x] Export PDF + copy to clipboard
- [x] Presets pe industrii
- [ ] Multi-campaign comparator (analizezi 3 campanii simultan)
- [ ] LTV calculator integrat (CAC vs LTV ratio)
- [ ] Excel/CSV import pentru date din Google Ads / Meta Ads

## Getting Started

```bash
git clone https://github.com/LaurAndreea10/Campaign-ROI-Calculator.git
cd Campaign-ROI-Calculator
# Deschide index.html în browser
```

## Structure

```
Campaign-ROI-Calculator/
├── index.html         # Calculator + UI complet
├── style.css
├── calc.js            # Logica de calcul
├── i18n.js            # RO/EN strings
└── README.md
```

## Formule (pentru verificare independentă)

```js
ROI = ((revenue - totalCost) / totalCost) * 100;
ROAS = revenue / adSpend;
CAC = totalCost / customersAcquired;
costPerLead = totalCost / leadsGenerated;
leadToCustomer = (customersAcquired / leadsGenerated) * 100;
profitMargin = ((revenue - totalCost) / revenue) * 100;
breakEvenCustomers = Math.ceil((totalCost - revenue) / avgOrderValue);
```

## License

MIT — vezi [LICENSE](LICENSE)

## Author

**Laura Andreea** · [Portofoliu](https://laurandreea10.github.io/codepen-portfolio/) · [GitHub](https://github.com/LaurAndreea10) · [LinkedIn](https://www.linkedin.com/in/laura-andreea-p-8b230014b/)
