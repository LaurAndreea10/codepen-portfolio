# Campaign ROI Calculator

> Calculator interactiv pentru evaluarea performanței campaniilor marketing.

[Live Demo](https://laurandreea10.github.io/codepen-portfolio/Campaign%20ROI%20Calculator.html)

![ROI Calculator preview](./screenshot.svg)

---

## Project Origin

În meeting-uri de marketing, întrebarea care apărea cel mai des era: **„OK, dar ce ROI a făcut campania asta?”** — și răspunsul venea după 2 zile de săpat prin spreadsheet-uri, cu cifre care nu se potriveau între departamente.

**Campaign ROI Calculator** transformă întrebarea într-un formular de 30 de secunde. Introduci budget, revenue și costuri secundare → primești ROI, ROAS, CAC, cost/lead și profitabilitate, cu interpretare clară pentru fiecare metric.

---

## Calcule integrate

| Metric | Formulă | Threshold default |
|---|---|---|
| ROI | (Revenue − Cost) / Cost × 100 | < 0% roșu · 0-100% galben · > 100% verde |
| ROAS | Revenue / Ad Spend | < 2x roșu · 2-4x galben · > 4x verde |
| CAC | Total Cost / Customers Acquired | depinde de industrie |
| Cost per Lead | Total Cost / Leads | depinde de canal |
| Lead-to-Customer | Customers / Leads × 100 | < 5% roșu · 5-15% galben · > 15% verde |
| Profit Margin | (Revenue − Total Cost) / Revenue × 100 | < 0% roșu · 0-20% galben · > 20% verde |
| Break-even | Math.ceil((Cost − Revenue) / AOV) | — |
| Revenue Forecast | Revenue × conversion variance | ±10%, ±25% scenarios |

---

## Features

- Calcul în timp real
- Bilingv RO/EN
- Dark/Light theme + high-contrast support
- Industry presets — e-commerce, B2B SaaS, lead gen agency
- Export PDF printabil + copy to clipboard
- Validare inputs
- Persistență localStorage
- Revenue forecast SVG generat manual
- Responsive desktop/mobile

---

## Stack

- Vanilla JavaScript
- CSS Variables
- localStorage
- SVG manual pentru forecast graph
- GitHub Pages

---

## Roadmap

Vezi [CHANGELOG.md](./CHANGELOG.md).

- [ ] Multi-campaign comparator
- [ ] LTV calculator integrat
- [ ] Excel/CSV import
- [ ] Scenario planner
- [ ] Industry benchmarks live

---

## Formule

```js
ROI = ((revenue - totalCost) / totalCost) * 100;
ROAS = revenue / adSpend;
CAC = totalCost / customersAcquired;
costPerLead = totalCost / leadsGenerated;
leadToCustomer = (customersAcquired / leadsGenerated) * 100;
profitMargin = ((revenue - totalCost) / revenue) * 100;
breakEvenCustomers = Math.ceil((totalCost - revenue) / avgOrderValue);
```

---

## Author

**Laura Andreea** · [Portofoliu](https://laurandreea10.github.io/codepen-portfolio/) · [GitHub](https://github.com/LaurAndreea10)
