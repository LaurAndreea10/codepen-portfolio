# CodePen Portfolio — Laura Andreea

> Front-end CRM &amp; Dashboard Developer · 64 proiecte live · Vite + React · GitHub Actions

🔗 **Live:** [laurandreea10.github.io/codepen-portfolio](https://laurandreea10.github.io/codepen-portfolio/)

![Lighthouse Performance](https://img.shields.io/badge/lighthouse-performance-85%2B-brightgreen)
![Accessibility](https://img.shields.io/badge/a11y-95%2B-brightgreen)
![SEO](https://img.shields.io/badge/SEO-95%2B-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Despre

Portofoliu front-end construit ca proiect personal de dezvoltare. 64 proiecte live pe CodePen, 25 selectate aici cu studii de caz, decision logs și demo-uri video.

**Stack:** HTML5 + CSS3 + JavaScript vanilla (zero dependencies pe homepage).
**Deploy:** GitHub Pages cu deploy automat la push pe `main`.
**Bilingv:** RO &amp; EN cu lang switch dinamic.

## Pagini

- `/` — Homepage cu hero carousel, key projects, proof of work, journey timeline
- `/process.html` — Procesul meu de lucru în 6 pași
- `/uses.html` — Stack tehnic, tools și config-uri
- `/projects/*.html` — Studii de caz individuale

## Local development

```bash
git clone https://github.com/LaurAndreea10/codepen-portfolio.git
cd codepen-portfolio
# Open with Live Server în VS Code, sau:
python3 -m http.server 8080
# Apoi: http://localhost:8080
```

## Decizii cheie

| Decizie | Trade-off acceptat |
|---|---|
| Vanilla JS pe homepage | + zero deps, + 0ms hydration ; − fără routing modern |
| Static-only data source | + securitate, + predictibilitate ; − sync manual cu CodePen |
| Inline critical CSS + lazy main | + LCP rapid ; − code split mai complex |
| Bilingv în același file | + SEO single-page ; − file size dublat |

## Performance

- Lighthouse CI rulează pe fiecare push (vezi `.github/workflows/lighthouse.yml`)
- Target: Performance 85+, A11y 95+, SEO 95+, Best Practices 92+
- Bundle: zero JS dependencies pe homepage

## A11y

- Skip-link funcțional
- `prefers-reduced-motion` respectat
- Focus-visible pe toate elementele interactive
- Contrast AA validat
- `<html lang>` schimbat dinamic la toggle EN/RO

## SEO

- JSON-LD Person + WebSite schema cu credentials
- Open Graph + Twitter Card cu imagine 1200×630
- hreflang tags pentru RO &amp; EN
- Sitemap.xml cu pagini și studii de caz

## Contact

📧 [andreealaurap@gmail.com](mailto:andreealaurap@gmail.com)  
💼 [LinkedIn](https://www.linkedin.com/in/laura-andreea/)  
🐙 [GitHub](https://github.com/LaurAndreea10)  
✏️ [CodePen](https://codepen.io/Laura-Andreea-the-typescripter)

## License

MIT — folosește liber pentru inspirație, atribuirea apreciată.
