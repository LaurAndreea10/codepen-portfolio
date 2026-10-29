---
title: "Retrospectivă octombrie 2026 — ce am construit și ce rămâne de verificat"
published: false
description: "O lună de proiecte în timpul liber: patru proiecte noi sau versiuni majore, un portofoliu cu accesibilitate 100 și o listă onestă cu ce nu am verificat încă."
tags: webdev, frontend, retrospectiva, learning
canonical_url: https://laurandreea10.github.io/codepen-portfolio/insights/retrospectiva-octombrie-2026.html
---

Construiesc în timpul liber, iar fiecare versiune intră în [changelog](https://laurandreea10.github.io/codepen-portfolio/changelog.html). La final de lună mă opresc să văd tot tabloul: ce am livrat, ce am învățat și, la fel de important, ce n-am verificat încă.

> **Octombrie în cifre: 4 proiecte noi sau versiuni majore, sezonul Halloween pe CodePen, portofoliul ajuns la 91 de proiecte live și accesibilitate Lighthouse 100 pe mobil.**

## Ce am livrat

- **PentArena 2.x**: cinci sporturi contra AI sau doi jucători, carieră în 3 ligi, PWA offline; apoi teren vertical pe telefon și proba bonus Carambol.
- **Puck & Pool Arena**: air hockey × biliard ca joc de țintire, 12 niveluri și campionat pe ture. L-am păstrat separat de PentArena, ca fiecare să rămână clar.
- **LIVADA**: landing page cinematic pentru un brand fictiv de suc, apoi jocul „Culesul”, cu patru moduri și suport offline.
- **Serpent Prism, SlideStorm Arena, Odyssey Quest**: iterații pe jocuri existente, cu nivel ghidat, sunet generat în browser și mesaje mai clare pentru WebRTC.
- **Sezonul Halloween** pe CodePen: BooScary, Ghost Talk și Pumpkin Weigh-In, ultimul cu teste Jest.
- **Portofoliul**: căutare Ctrl+K în tot catalogul, Arcade Pass, navigație pe un rând, pagină 404 proprie și previzualizări sociale reale.

## Ce am învățat

**Cifrele trebuie să aibă o singură sursă.** Numărul de proiecte ajunsese să apară diferit în pagină, README și intro. Acum e definit într-un singur fișier de configurare, iar un test automat semnalează orice pagină care spune altceva.

**CSS-ul încărcat târziu poate muta pagina.** Pe mobil, butonul de căutare afișa scurtătura „Ctrl K” până sosea stylesheet-ul care o ascunde, așa că meniul trecea pe un rând în plus și apoi sărea înapoi. Două reguli mutate în CSS-ul critic au adus deplasarea de layout (CLS) de la 0,26 la 0.

**Un proiect nou nu e gata când rulează.** E gata când apare în catalog, în paginile RO și EN, în sitemap și în istoricul versiunilor. Am transformat lista asta într-o rutină pe care o repet la fiecare lansare.

## Ce rămâne de verificat

Aproape fiecare intrare din changelog se încheie la fel: _telefonul fizic și cititorul de ecran rămân neconfirmate_. Testele automate în Chromium nu înlocuiesc un test real. Următorul pas e să trec 2–3 proiecte prin TalkBack și VoiceOver, după un [protocol scris](https://github.com/LaurAndreea10/codepen-portfolio/blob/main/docs/TEST-DISPOZITIV-REAL.md), și să public rezultatele, inclusiv ce nu merge.

## Direcția pentru noiembrie

- Mai puțină lățime, mai multă profunzime: aduc un singur proiect la nivel de produs, cu TypeScript, teste și PWA.
- Primele rezultate de pe telefon real și cititor de ecran.
- Statistici fără cookie-uri, ca să știu ce proiecte se deschid cu adevărat.

---

_Publicat inițial pe [portofoliul meu](https://laurandreea10.github.io/codepen-portfolio/insights/retrospectiva-octombrie-2026.html), unde găsești și proiectele despre care scriu._
