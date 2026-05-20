# Quick Wins — Patch pentru index.html

Patch-uri minore, de aplicat direct pe `index.html` existent.

## FIX 1 — Elimină duplicatul GitHub Stats

Caută a doua apariție a blocului `#github-stats` și șterge duplicatul. Păstrează o singură secțiune GitHub Stats.

## FIX 2 — Consolidează mesajul 64 / 25 proiecte

În secțiunea Credibilitate, schimbă mesajul în:

```html
64 proiecte live, 25 selectate pe acest site →
Restul sunt experimente publice pe CodePen.
```

În footer, schimbă `CodePen · 64 proiecte live` în:

```html
CodePen · 64 experimente publice
```

## FIX 3 — Adaugă “Ce NU fac” în Despre

```html
<div class="not-section" style="margin-top: 2rem; padding: 1.5rem; border-left: 3px solid var(--accent, #06b6d4); background: rgba(6, 182, 212, 0.05); border-radius: 0 8px 8px 0;">
  <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; opacity: 0.9;">Ce NU fac (transparență)</h3>
  <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.7; opacity: 0.85;">
    <li>Nu construiesc backend-uri scalabile sau infrastructură cloud.</li>
    <li>Nu fac DevOps complex (Kubernetes, microservicii).</li>
    <li>Nu acopăr design grafic, ilustrație sau motion design avansat.</li>
    <li>Mă specializez pe <strong>front-end pentru CRM, dashboard-uri și marketing tools</strong> — produse cu logică clară de produs.</li>
  </ul>
</div>
```

## FIX 4 — Update title/meta

```html
<title>Laura Andreea — Construiesc CRM-uri și dashboard-uri front-end (colaborări)</title>
<meta name="description" content="Front-end CRM & dashboard developer disponibilă pentru colaborări punctuale. 64 proiecte live · Vite + React · UI/UX cu logică de produs. Bilingv RO/EN." />
```

## Commit recomandat

```bash
git add index.html
git commit -m "chore: quick wins — dedup stats, consolidate counts, add not section"
```
