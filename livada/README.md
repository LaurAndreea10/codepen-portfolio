# LIVADA — landing page cinematic (brand fictiv)

[Deschide / Open](https://laurandreea10.github.io/codepen-portfolio/livada/) · [EN](https://laurandreea10.github.io/codepen-portfolio/livada/?lang=en)

**RO** — Studiu de landing page pentru un brand fictiv de suc presat la rece din livezile Moldovei: cătină, vișine, afine și mere ionatan. Pornit de la un clip despre site-uri de produs „cinematice” și adaptat pentru portofoliu cu temă, conținut și interacțiuni proprii.

**EN** — Landing-page study for a fictional cold-pressed juice brand from Moldova's orchards: sea buckthorn, sour cherry, blueberry and Jonathan apple. Inspired by a clip about "cinematic" product sites, adapted with its own theme, copy and interactions.

> Brandul, livezile, prețurile și cifrele sunt inventate. Nu se vinde nimic. / The brand, orchards and figures are invented. Nothing is for sale.

## Ce conține / What's inside

| Moment | RO | EN |
|---|---|---|
| Intro | O picătură cade, devine o linie de lumină, ecranul se deschide (~2 s, se poate sări, o dată pe sesiune) | A drop falls, becomes a line of light, the screen opens (~2 s, skippable, once per session) |
| Hero | Titlul „se presează” la scroll (axa `wdth` a fontului variabil + scale) și sticla se umple | The title is "pressed" on scroll (variable-font `wdth` axis + scale) while the bottle fills |
| Manifest | Cuvintele se aprind pe măsură ce derulezi | Words light up as you scroll |
| Arome | Secțiune sticky de 4 ecrane: fundal, sticlă, fructe și text se schimbă pe aromă; taburi cu săgeți | 4-screen sticky section: background, bottle, fruit and copy change per flavour; arrow-key tabs |
| Amestec | Până la 4 porții în straturi, apoi „Amestecă”: culoare medie, profil dulce/acru/corp și nume generat | Up to 4 layered portions, then "Mix": blended colour, sweet/tart/body profile and a generated name |
| Sezon | Calendarul culesului, cu luna curentă marcată | Harvest calendar with the current month marked |

## Jocul: Culesul / The Harvest (v1.1)

[Joacă / Play](https://laurandreea10.github.io/codepen-portfolio/livada/joc/) · [Istoric / History](CHANGELOG.md)

**RO** — Joc de tăiat fructe cu aceleași fructe ca landing page-ul. Viespile țin locul bombelor, mărul de aur dă puncte duble, iar fiecare fruct tăiat umple o sticlă. Patru moduri (Clasic, Contra timp, Comanda zilei, Zen), 12 realizări, recorduri locale, ritm lent, tăiere prin atingere, contrast ridicat, mișcare redusă, RO/EN, offline.

**EN** — Fruit-slicing game using the landing page's fruit. Wasps replace bombs, the golden apple doubles points, and every slice fills a bottle. Four modes, 12 achievements, local records, slow pace, tap to slice, high contrast, reduced motion, RO/EN, offline.

Tehnic: Canvas 2D cu DPR, sprite-uri din SVG-ul paginii (și variantă cu contur pentru contrast ridicat), detecție segment–cerc pe fiecare mișcare a pointerului (cu `getCoalescedEvents`), multitouch, Web Audio sintetizat, seed zilnic `mulberry32` pentru Comanda zilei, salvare validată în `localStorage`, service worker „rețea întâi”.

Limită cunoscută: jocul cere o mișcare de tragere sau atingere; nu are control complet din tastatură.

## Tehnic / Technical

- HTML + CSS + JavaScript vanilla, fără build și fără dependențe; ilustrațiile sunt SVG desenat în pagină.
- Font: Bricolage Grotesque (Google Fonts, variabil `wdth`/`wght`/`opsz`), cu fallback de sistem.
- RO/EN cu `data-i18n`, `?lang=en` și preferință salvată local (cu `try/catch`).
- `prefers-reduced-motion`: fără intro, marquee sau animații; tot conținutul rămâne accesibil.
- Tastatură: link „Sari la conținut”, focus vizibil, taburi cu săgeți, butoane native; contoarele au etichete text.
- `?nointro` sare peste intro (util pentru teste).

## Verificat / Checked

- Chromium headless (Playwright) la 390, 820 și 1440 px: fără erori JS și fără scroll orizontal; fluxul de amestec testat cu click.
- Neconfirmat: telefon real, Safari/iOS și cititor de ecran real.

## Fișiere / Files

`index.html` · `style.css` · `app.js` · `icon.svg` · `CHANGELOG.md` · `joc/` (`index.html`, `joc.css`, `joc.js`, `sw.js`, `manifest.webmanifest`)
