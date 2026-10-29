---
title: "3 lecții din construirea unui SaaS CRM de la zero"
published: false
description: "Ce am învățat construind Alpis Fusion CRM: un CRM e un sistem de decizii, nu o interfață cu tabele."
tags: webdev, frontend, lessons, learning
canonical_url: https://laurandreea10.github.io/codepen-portfolio/insights/saas-crm-lectii.html
---

Când am început Alpis Fusion CRM, credeam că un CRM e în esență o listă de contacte cu câmpuri editabile. După 6 module, 3 iterații majore și sute de decizii de produs, am ajuns la o concluzie diferită.

> **Un CRM nu e o interfață cu lead-uri. E un sistem de decizii.**

## Lecția 1: Structura contează mai mult decât funcționalitatea

Prima versiune a Alpis Fusion avea toate funcțiile: kanban, task-uri, facturi. Problema era că funcțiile nu vorbeau între ele. Un lead dintr-un pipeline nu avea legătură cu task-urile aferente sau cu factura finală.

Soluția nu a fost să adaug mai multe funcții — a fost să reconectez cele existente într-un flux coerent. **3 arii separate → 1 workspace unificat** unde lead, follow-up, booking și factură există în același context.

## Lecția 2: Starea vizibilă reduce erorile

Orice sistem CRM are stări: lead nou, contactat, calificat, pierdut. Problema e că aceste stări trăiesc adesea doar în capul utilizatorului sau într-un câmp text liber.

Am implementat un sistem de stări vizuale clare — culoare, icon, poziție în kanban — care face imposibil să uiți unde ești cu un client. **Urgența nu trebuie citită, trebuie văzută.**

## Lecția 3: Automatizarea bună e invizibilă

Flow builder-ul din Alpis Fusion poate automatiza secvențe de follow-up, generare de documente și actualizare de statusuri. Dar cea mai importantă decizie a fost să fac automatizările _ușor de înțeles_, nu doar de configurat.

Un flow builder vizual în care fiecare pas are un preview al efectului reduce anxietatea de a activa ceva ce nu înțelegi complet. Utilizatorul vrea să fie sigur, nu să fie impresionat.

> Codul și deciziile de arhitectură sunt publice pe [GitHub](https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium). Fiecare commit are un mesaj care explică de ce, nu doar ce.

---

_Publicat inițial pe [portofoliul meu](https://laurandreea10.github.io/codepen-portfolio/insights/saas-crm-lectii.html), unde găsești și proiectele despre care scriu._
