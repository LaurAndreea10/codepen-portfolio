---
title: "De ce am trecut de la single-file HTML la Vite + React"
published: false
description: "Decizia arhitecturală care a schimbat cum construiesc: de la fișiere HTML de 3000 de linii la componente reutilizabile cu Vite și React."
tags: webdev, frontend, architecture, learning
canonical_url: https://laurandreea10.github.io/codepen-portfolio/insights/single-file-la-vite-react.html
---

Primul meu proiect CRM serios — ClientFlow — era un singur fișier HTML de ~2800 de linii. CSS inline, JavaScript embedded, totul într-un loc. A funcționat. Dar nu a putut crește.

## Ce funcționează la single-file

Nu vreau să spun că single-file e greșit. Am construit zeci de proiecte funcționale și deployate în acest format: Excel Quest, Basket VS AI, Link Video Editor Studio. Pentru proiecte cu un singur scop, bine definit, e corect.

- Zero configurare — deschizi în browser, gata
- Deploy instant pe GitHub Pages fără build step
- Portabil — trimiți un fișier, nu un repo întreg

## Unde single-file cedează

Alpis Fusion CRM are 6 module: kanban, flow builder, RBAC, billing, booking, autosave. Fiecare modul are starea sa, logica sa, componentele sale. Într-un single-file, orice modificare în kanban putea rupe billing-ul.

> **Problema reală nu e dimensiunea fișierului, ci izolarea schimbărilor.** Când nu poți modifica un modul fără să riști un altul, productivitatea scade drastic.

## De ce Vite + React, nu altceva

Am evaluat Vue și Svelte. Am ales React pentru că:

- **Ecosistemul** — soluțiile la probleme comune există deja și sunt documentate
- **Vite** — build sub 2 secunde local, HMR instant, configurare minimă
- **Componente ca unitate de gândire** — un KanbanCard e un fișier, nu o funcție îngropată în 200 de linii

## Ce am câștigat concret

Build-ul final al Alpis Fusion (~287KB) e mai mic decât multe single-file-uri pe care le-am scris. Dar mai important: pot adăuga un câmp nou în Lead Pipeline fără să ating Billing. Pot refactoriza RBAC fără să testez manual întreaga aplicație.

GitHub Actions CI/CD face deploy automat la orice push pe main. Dacă ceva se rupe la build, știu înainte să ajungă live.

---

_Publicat inițial pe [portofoliul meu](https://laurandreea10.github.io/codepen-portfolio/insights/single-file-la-vite-react.html), unde găsești și proiectele despre care scriu._
