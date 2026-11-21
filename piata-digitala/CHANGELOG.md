# Changelog — Piața digitală / Digital Market

## 1.0.0 — 2026-11-21 · Finalizat / Completed

- RO: Primul dashboard pe date publice reale: API-ul Eurostat (JSON-stat 2.0, CORS), citit live la fiecare deschidere. Cumpărători online (% din utilizatorii de internet) pentru orice stat UE comparat cu media UE-27, pe ani din 2014, pe vârste și în clasamentul celor 27 de state; folosirea internetului pe ani. KPI-uri, o frază de interpretare construită doar din date, tooltip-uri, tabele pentru fiecare grafic, RO/EN, dark/light.
- RO: Copie de rezervă: `scripts/fetch-eurostat.mjs` și workflow-ul lunar `piata-digitala-data.yml` salvează `data/snapshot.json`; pagina o folosește când API-ul nu răspunde și spune deschis ce sursă arată.
- EN: First dashboard on real public data: the Eurostat API, read live on every visit. Online shoppers for any EU state against the EU-27 average, by year since 2014, by age and in the 27-state ranking; internet use by year. Fallback snapshot refreshed monthly by a workflow; the page always says which source it shows.
- Culorile seriilor sunt validate pentru daltonism în ambele teme. Calea live a fost verificată doar până la nivel de cod: din mediul de lucru nu am avut acces la Eurostat, iar aspectul a fost testat cu date de probă în Chrome. / Series colours are validated for colour-blindness in both themes. The live path was not exercised from the build environment (no access to Eurostat); the layout was tested with sample data in Chrome.
