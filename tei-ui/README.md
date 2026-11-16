# Tei UI

Un design system mic, scris de la zero cu Web Components. Numele vine de la teii Iașului.

**Autor:** Laura Andreea · Iași

## Folosire

```html
<script src="tei-ui.js"></script>

<tei-button variant="primary">Salvează</tei-button>
<tei-switch checked>Notificări</tei-switch>
```

Un singur fișier (`tei-ui.js`, fără dependențe și fără pas de build), care definește elementele și injectează tokenurile implicite.

## Componente

`tei-button`, `tei-badge`, `tei-switch`, `tei-input`, `tei-tabs` / `tei-tab`, `tei-dialog`, `tei-toast`, `tei-progress`, `tei-avatar`, `tei-stat`, `tei-table`.

- Shadow DOM cu `adoptedStyleSheets`, stilizate numai prin proprietăți CSS (`--tei-*`).
- `tei-switch` și `tei-input` sunt asociate formularelor prin `ElementInternals`, deci apar în `FormData`.
- `tei-table` este îmbunătățire progresivă: fără JavaScript rămâne un `<table>` obișnuit.
- Tastatură și ARIA pentru fiecare: `role="switch"`, taburi cu săgeți/Home/End, dialog nativ cu întoarcerea focusului, `aria-sort`, `role="progressbar"`, notificări în zonă `aria-live`.

## Pagina de documentație

`index.html` este construită cu aceleași componente și conține: tokenurile cu contrastul calculat, un editor de temă cu export CSS și JSON (format de tip Design Tokens), demo și cod pentru fiecare componentă dintr-o singură sursă, tabele de atribute, note de accesibilitate și un playground live. RO/EN (`?lang=en`), dark/light.

`index.pen.html` are biblioteca inclusă direct în pagină, pentru CodePen.

## Limite cunoscute

- Panourile `tei-tab` sunt în light DOM, iar butoanele de tab în shadow DOM, deci legătura dintre ele se face prin `aria-label`, nu prin `aria-controls`.
- `tei-button type="submit"` trimite formularul prin `requestSubmit()`, dar nu participă la trimiterea implicită cu Enter.
- Are nevoie de un browser cu `adoptedStyleSheets` și `ElementInternals` (versiunile actuale de Chrome, Edge, Firefox și Safari).

## Verificat

Teste automate în Chromium la 1280 și 390 px: definirea tuturor elementelor, comutatorul din tastatură și starea dezactivată, navigarea taburilor, deschiderea și închiderea dialogului cu întoarcerea focusului, notificările, sortarea și filtrarea tabelului, valorile din `FormData`, atributele ARIA ale barei de progres, editorul de temă și playgroundul. Firefox, Safari, telefonul fizic și cititoarele de ecran nu au fost verificate.
