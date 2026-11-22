# Fonturi găzduite local

Toate fonturile site-ului se servesc de aici, de pe GitHub Pages, nu de la Google Fonts. Așa browserul vizitatorului nu mai trimite adresa IP către Google la fiecare vizită. Asta e cerința GDPR din hotărârea LG München, 3 O 17493/20, din 20.01.2022.

- `fonts.css`: un singur fișier cu 100 de reguli `@font-face`, pentru 25 de familii, cu subseturile latin și latin-ext (cel din urmă acoperă diacriticele ă, â, î, ș, ț). Browserul descarcă doar fișierele `.woff2` ale fonturilor pe care o pagină le folosește efectiv.
- `files/`: fișierele `.woff2`, în versiune variabilă acolo unde există.
- `licenses/`: licențele SIL Open Font License 1.1 ale fiecărei familii.

Subseturi românești: `scripts/build-ro-font-subsets.py` (rulat după generator) creează pentru fiecare față latin-ext un fișier `*-ro-*.woff2` doar cu Ă ă Ș ș Ț ț Ş ş Ţ ţ și scoate aceste litere din intervalul latin-ext, ca paginile în română să nu mai descarce fișierele latin-ext întregi.

Sursa fonturilor sunt pachetele npm `@fontsource-variable/*` și `@fontsource/*`, cu aceleași fonturi ca pe Google Fonts. Fișierul se regenerează cu `scripts/build-local-fonts.py`.

O pagină nouă folosește fonturile așa:

```html
<link rel="stylesheet" href="assets/fonts/fonts.css">          <!-- din rădăcină -->
<link rel="stylesheet" href="../assets/fonts/fonts.css">       <!-- dintr-un subfolder -->
```

Panourile pentru CodePen (`*.pen.html`) folosesc URL-ul absolut `https://laurandreea10.github.io/codepen-portfolio/assets/fonts/fonts.css`.

Regulile folosesc `font-display: optional`: dacă un font nu e gata la prima afișare, pagina rămâne pe fontul de rezervă în loc să sară când sosește (fără layout shift); la vizitele următoare fontul vine din cache. Pentru o pagină importantă, declară direct în pagină fețele de care are nevoie și pune `preload` pe fișierele principale, ca în `portfolio.html`.

Fraunces folosește axele `opsz` și `wght`. Axele decorative SOFT și WONK nu sunt incluse, ca fișierul să rămână mic.
