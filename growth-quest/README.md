# LaurAI Growth Quest v2.0.1

[Aplicație / App](https://laurandreea10.github.io/codepen-portfolio/growth-quest/) · [Ghid / Guide](guide.html) · [Luna Bakery](demo-case.html) · [Istoric / History](CHANGELOG.md)

## Română

Prototip funcțional de agenție care combină un joc cu instrumente locale pentru marketing și CRM. Creat de Laura Andreea Plugaru cu asistență AI pentru implementare și ilustrația biroului. Rulează în browser, fără instalarea unor dependențe sau abonamente pentru funcțiile locale.

| Modul | Livrat |
| --- | --- |
| Funnel Forge | Sezon de 12 săptămâni, antrenament cu anulare, mod liber, patru scenarii progresive și scenarii personalizate |
| Marketing în simulator | Email, social, ads, conținut/SEO, evenimente; buget, lead-uri, evenimente de piață |
| CRM în simulator | Calificare, ofertă, închidere, nurture, scor, vechime și acțiuni limitate |
| Tool-uri | Scoring, A/B, segmentare, analytics, automatizare, chatbot simulat, SDR simulat |
| Studio | Proiecte, echipă pentru planificare locală, CRM cu pipeline-uri, suport și sarcini |
| Campanii | Brief-uri, șabloane, calendar, bibliotecă și checklist-uri |
| Analiză | KPI, costuri, filtre pe monedă, calcule UTM/preț/marjă și comparație A/B descriptivă |
| Export | JSON, CSV, calendar ICS, rapoarte HTML imprimabile, studiu de caz și prezentare HTML |
| Progres și date | Joacă/Lucrează separate, backup validat, previzualizare și îmbinare, istoric și recuperare tranzacțională |
| Interfață | RO/EN, dark/light, contrast ridicat, mișcare redusă, controale de tastatură și layout adaptiv |
| Offline | Manifest și service worker; disponibil după încărcarea online și activarea cache-ului |
| Dovadă | Dosar Luna Bakery marcat SIMULARE; transfer repetabil fără proiect duplicat |

Datele rămân în LocalStorage, pe dispozitivul și originea browserului curent. Copia GitHub Pages și Site-ul privat au stocare separată. Exportă un backup înainte de mutarea datelor. Nu sunt trimise emailuri sau date CRM către servicii externe.

### Ce este verificat

Testele automate folosesc motorul real într-un mediu DOM simulat: logică, validare nested, formule, CSV, transfer fără duplicate, păstrarea modului Lucrează, undo/redo, import, rollback după eroare de scriere și recuperare la reîncărcare. Cache-ul offline este verificat cu cereri și răspunsuri simulate, inclusiv respingerea paginilor de login. Aceste teste nu sunt testare vizuală sau tactilă într-un browser real.

### Limite explicite

- Nu există conturi, echipă online, sincronizare între dispozitive, API AI, email sau conexiuni automate Canva/Sheets.
- Asistentul Studio folosește reguli locale. Chatbotul și SDR-ul sunt mecanici de joc.
- Biroul este o ilustrație izometrică cu zone HTML interactive, nu un motor 3D.
- A/B afișează diferențe observate, fără test de semnificație statistică.
- Rapoartele sunt HTML/text/JSON/CSV; PDF-ul se obține prin imprimarea din browser.
- Rezultatele Luna Bakery folosesc aleatoriu fixat; nu sunt rezultate comerciale sau prognoze.
- Testarea vizuală în browser, pe Samsung S25 real și cu TalkBack rămâne neconfirmată. Pașii manuali sunt în studiul de caz.

## English

A working agency prototype combining a game with local marketing and CRM tools. Built by Laura Andreea Plugaru with AI assistance for implementation and the office illustration. Browser-only local functions require no paid subscription or dependency installation.

Delivered: agency seasons/training/free play, progressive and custom scenarios, five marketing channels, simulated CRM and seven upgrades; project Studio, planning team, CRM pipelines, tickets, campaigns, editorial calendar, KPIs and calculators; validated JSON backups, CSV/ICS/HTML exports, undo/redo and recovery; RO/EN, themes, high contrast, reduced motion and offline support.

Automated checks cover actual engine logic in a mocked DOM, schema validation, formulas, CSV, dossier transfer, Work preservation, undo/redo, import, failed-write rollback and reload recovery. Mocked cache lifecycle checks cover offline fallback and login-page rejection. Real visual-browser, phone and screen-reader testing is pending.

There are no external integrations, sent emails, remote AI, online accounts or collaboration. The assistant uses local rules; the chatbot/SDR are game mechanics. The office is an isometric illustration with interactive HTML zones. A/B differences are descriptive, not statistical significance. Reports are HTML/text/JSON/CSV with browser print-to-PDF. Luna Bakery is simulated with fixed randomness, not a commercial result or forecast.

## Verificări / Checks

From the repository root, Node.js 20+:

```sh
node growth-quest/tests/verify-local.cjs
node growth-quest/tests/verify-offline.cjs
node growth-quest/tests/verify-demo.cjs
node growth-quest/tests/verify-portfolio.cjs
```

No dependencies or network access are needed. The demo test uses isolated mocked storage; it does not alter browser data. `--write` regenerates the downloadable fixture files and is intended for maintainers only.

