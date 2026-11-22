# Changelog — Test Status

## 1.1.0 — 2026-11-22

- RO: Pagină nouă, `manual.html`, cu verificările manuale pe 12 proiecte (iPhone, Android, Safari, Firefox, doar tastatura, cititor de ecran, zoom 200%), lista în `manual-checks.json`. Bifele rămân în browser; „Copiază raportul” dă un Markdown gata de pus în CHANGELOG.
- EN: New `manual.html` with manual checks for 12 projects; ticks stay in the browser; "Copy the report" gives Markdown for the project CHANGELOG.

## 1.0.0 — 2026-11-21 · Finalizat / Completed

- RO: Workflow nou, `.github/workflows/all-tests.yml`, care rulează în paralel toate cele 8 suite de logică (Jest, Vitest + tsc, node:test, scripturi Node) la fiecare push pe `main`, la fiecare PR, săptămânal și la cerere. Lista suitelor stă în `test-status/suites.json`, iar `scripts/run-test-suites.mjs` le rulează local sau în CI.
- RO: Pagină nouă cu rezultatele: 241 de teste numărate, 8/8 suite care trec (rulare locală din 2026-11-21), plus insignele celor 8 workflow-uri de browser și audit.
- EN: New `all-tests.yml` workflow running all 8 logic suites in parallel on every push to `main`, every PR, weekly and on demand; suite list in `test-status/suites.json`, runner in `scripts/run-test-suites.mjs`. New page with the results (241 counted tests, 8/8 suites passing in the local run on 2026-11-21) and the badges of the 8 browser and audit workflows.
- Nu acoperă: telefoane fizice, Safari, Firefox, cititoare de ecran reale. / Not covered: physical phones, Safari, Firefox, real screen readers.
