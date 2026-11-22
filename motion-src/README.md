# Motion layer · GSAP + Lenis + React Bits

Stratul de animație pentru `portfolio.html`. Sursa e aici; build-ul ajunge în `assets/motion/` și e servit direct de GitHub Pages (fără CDN, fără costuri).

```bash
cd motion-src
npm install
npm run build      # sau: npm run watch
```

## Ce face

| Unealtă | Unde | Detalii |
|---|---|---|
| **Lenis** | toată pagina | smooth scroll pe wheel; pe touch rămâne scroll-ul nativ. Linkurile `#ancoră` folosesc Lenis, păstrează `hashchange` (tab-urile din Colecții depind de el) și mută focusul pe titlu. Se oprește singur când e deschis un dialog (Ctrl+K, rezumatul de 30 s). |
| **GSAP ScrollTrigger** | bară de progres, capitole, carduri | progres de scroll sub navigare, numerele capitolelor intră și au parallax, cardurile apar în valuri (`ScrollTrigger.batch`). |
| **GSAP SplitText** | `.chapter-title` | cuvintele urcă printr-o mască pe linii, cu `aria: "auto"`; markup-ul original e restaurat după animație. |
| **GSAP quickTo** | `.hero-actions .btn`, `.btn-primary` | butoane magnetice, doar pe mouse. |
| **React Bits · Particles** | fundalul hero-ului | WebGL, se oprește când nu e vizibil; paletă navy/cyan/amber, variantă light. |
| **React Bits · CountUp** | cifrele din „Credibilitate” | „proiecte live” citește `PORTFOLIO_CONFIG.projectCount`. |
| **React Bits · ShinyText** | `.chapter-kicker` | luciu discret pe „Capitolul 0X”. |
| **React Bits · ScrollVelocity** | bandă între hero și Capitolul 01 | viteza reacționează la scroll; `aria-hidden` (decorativ). |
| **React Bits · ClickSpark** | butoane, pile, tab-uri | scântei la click, inclusiv la activare din tastatură. |

Insulele React se încarcă separat: pe dispozitive cu mouse, în timpul liber al browserului (`requestIdleCallback`); pe telefoane și tablete (doar touch), la prima atingere, derulare sau tastă, ca un telefon lent să nu plătească ~300 ms de procesor cât încă se încarcă pagina.

## Accesibilitate

- `prefers-reduced-motion`: fără Lenis, fără reveal-uri, fără particule și scântei; cifrele rămân statice.
- Contrast ridicat: particulele, luciul și scânteile se opresc.
- Cardurile ascunse pentru reveal reapar imediat la focus din tastatură și la print.
- Doar elementele măsurabile, sub fold, sunt ascunse inițial, deci tab-urile ascunse nu rămân niciodată invizibile.

## Licențe

- Componentele din `src/reactbits/` sunt din [React Bits](https://reactbits.dev) de David Haz (commit `701a8ac`), MIT + Commons Clause, vezi `src/reactbits/LICENSE-react-bits.md`. Folosite ca parte a acestui site, nu redistribuite separat. Singura modificare: clasele din `ScrollVelocity.css` au prefixul `rb-`.
- GSAP (inclusiv SplitText) e gratuit din 3.13 · Lenis e MIT.
