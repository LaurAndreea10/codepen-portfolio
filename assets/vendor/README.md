# Biblioteci găzduite local / Self-hosted libraries

RO: Toate bibliotecile externe ale portofoliului sunt servite de aici, de pe același domeniu. Nicio pagină nu mai cere scripturi sau stiluri de la un CDN terț (cdnjs, jsDelivr, unpkg), deci vizitatorii nu-și mai trimit IP-ul unor terți. Fișierele sunt copiate neschimbate din pachetele npm oficiale, iar fiecare folder păstrează licența.

EN: Every third-party library used by the portfolio is served from here, on the same domain; no page requests scripts or styles from a third-party CDN any more. Files are unchanged copies from the official npm packages; each folder keeps its licence.

| Bibliotecă | Versiune | Sursă npm | Folosită de |
|---|---|---|---|
| Three.js (UMD) | r128 | `three@0.128.0` `build/three.min.js` | Kygo: Arhipelagul, Kygo World, Kygo: Pe Urme, cache-ul offline Kygo |
| Three.js (ES module) | 0.170.0 | `three@0.170.0` `build/` + 10 fișiere din `examples/jsm/` (postprocessing, shaders) | DICE DRIFT 3D, Carpați Enduro |
| Three.js (ES module) | 0.160.0 | `three@0.160.0` `build/` | GENOBOARD: Evo Rush |
| Chart.js | 4.4.1 | `chart.js@4.4.1` `dist/chart.umd.js` | Marketing OS |
| React + ReactDOM (development UMD) | 18.3.1 | `react@18.3.1`, `react-dom@18.3.1` `umd/` | prototipurile video și „Operațiunea Nucile de Aur” |
| Babel standalone | 7.29.0 | `@babel/standalone@7.29.0` `babel.min.js` | aceleași prototipuri |

sql.js 1.16.0 stă separat, în `sql-playground/vendor/`.

Atributele `integrity` (SRI) de la React, ReactDOM și Babel au rămas pe paginile prototipurilor: fișierele locale au exact aceleași amprente SHA-384 ca pe unpkg.

Ca să adaugi o versiune nouă: `npm pack <pachet>@<versiune>`, dezarhivează și copiază fișierele de care ai nevoie într-un folder nou cu numărul versiunii, plus `LICENSE`. Nu suprascrie o versiune existentă: paginile vechi depind de ea.
