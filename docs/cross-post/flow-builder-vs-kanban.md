---
title: "Flow builder vs Kanban — când folosești ce"
published: false
description: "Kanban-ul organizează munca. Flow builder-ul organizează deciziile. O distincție care m-a schimbat ca developer de produs."
tags: webdev, frontend, uxdecisions, learning
canonical_url: https://laurandreea10.github.io/codepen-portfolio/insights/flow-builder-vs-kanban.html
---

Am implementat ambele în Alpis Fusion CRM. Am văzut unde fiecare funcționează și unde cedează. Concluzia e simplă, dar nu evidentă înainte s-o trăiești.

> **Kanban-ul organizează munca. Flow builder-ul organizează deciziile.**

## Kanban: vizibilitate a stării curente

Kanban-ul e excelent pentru a răspunde la întrebarea: _Unde sunt lucrurile acum?_ Coloanele reprezintă stări, cardurile reprezintă entități, mișcarea reprezintă progres.

În ClientFlow, kanban-ul de task-uri permite triage rapid: ce e urgent, ce e în lucru, ce e blocat. Informația e vizuală, nu textual-ascunsă în câmpuri. Un manager poate înțelege statusul echipei în 10 secunde.

## Flow builder: automatizarea logicii

Flow builder-ul răspunde la o altă întrebare: _Ce se întâmplă când X?_ E un sistem de reguli vizuale: dacă lead-ul ajunge în etapa "Calificat", trimite email de follow-up și creează task "Demo call".

Diferența critică: kanban-ul e pasiv (arată), flow builder-ul e activ (face). Un utilizator mișcă un card în kanban; flow builder-ul reacționează automat la acea mișcare.

## Greșeala pe care am evitat-o

Prima versiune a Alpis Fusion încerca să transforme kanban-ul în flow builder — coloane cu acțiuni automate atașate. Era confuz pentru că amesteca două modele mentale diferite.

Separarea lor în module distincte, cu interfețe dedicate, a redus confuzia și a crescut adoptarea. **Interfețele clare nu sunt cel mai simplu de construit, dar sunt cel mai simplu de folosit.**

## Când să alegi ce

- Ai nevoie să **vizualizezi starea** unui set de lucruri → Kanban
- Ai nevoie să **automatizezi o reacție** la o schimbare de stare → Flow builder
- Ai nevoie de amândouă → construiește-le separat și lasă-le să comunice

---

_Publicat inițial pe [portofoliul meu](https://laurandreea10.github.io/codepen-portfolio/insights/flow-builder-vs-kanban.html), unde găsești și proiectele despre care scriu._
