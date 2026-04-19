# Portfolio Upgrade Guide — de la 7.2 la 10/10

Pachet complet de modificări pentru `laurandreea10.github.io/codepen-portfolio`.
Păstrează tot ce există (hero, carusel 4 tab-uri, structura case study-urilor).
Adaugă piesele lipsă + 4 puncte de retenție spre CodePen.

---

## Ordinea finală a paginii

```
1. Hero                            ← PĂSTRAT ca în screenshot
2. Bara de credibilitate           ← NOU  (CTA CodePen #1)
3. Proiecte-cheie (carusel)        ← ÎMBUNĂTĂȚIT (meta-rând + buton CodePen per card = CTA #2)
4. Parcurs — de la CRM la cod      ← NOU (timeline)
5. Despre mine extins              ← REFĂCUT cu text real + stack complet
6. Explorări și experimente        ← NOU (CTA CodePen #3)
7. Ce am învățat pe drum           ← NOU (blog stub)
8. Mod de lucru                    ← PĂSTRAT
9. Contact                         ← REPARAT (CV PDF real + CodePen adăugat = CTA #4)
10. Footer                         ← CodePen primul
```

---

## 1. FIX TEHNIC — fallback-ul vizibil

Problema: la fetch fără JS apare blocul „Acest portofoliu folosește JavaScript...”
care se vede și la LinkedIn share preview. Învelește-l în `<noscript>`:

```html
<!-- ÎNAINTE -->
<div class="js-fallback">
  <p>Acest portofoliu folosește JavaScript pentru a încărca proiectele.</p>
  <p><strong>Fallback proiecte-cheie:</strong></p>
  <ul>
    <li><a href="https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/">Alpis Fusion CRM Premium</a></li>
    ...
  </ul>
</div>

<!-- DUPĂ -->
<noscript>
  <div class="js-fallback">
    <p>Acest portofoliu folosește JavaScript pentru a încărca proiectele.</p>
    <p><strong>Fallback proiecte-cheie:</strong></p>
    <ul>
      <li><a href="https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/">Alpis Fusion CRM Premium</a></li>
      <li><a href="https://laurandreea10.github.io/codepen-portfolio/projects/clientflow.html">ClientFlow</a></li>
      <li><a href="https://laurandreea10.github.io/codepen-portfolio/projects/alpis-impactpath.html">Alpis Impact Path</a></li>
    </ul>
  </div>
</noscript>
```

---

## 2. BARA DE CREDIBILITATE (sub hero, înainte de „Proiecte-cheie”)

HTML gata de folosit, cu stilul aliniat dark mode din screenshot:

```html
<section class="credibility-bar" aria-label="Credibilitate și cifre">
  <a href="https://codepen.io/Laura-Andreea-the-typescripter"
     target="_blank" rel="noopener"
     class="cred-card cred-card--cta">
    <div class="cred-number">48</div>
    <div class="cred-label">proiecte live pe CodePen</div>
    <div class="cred-arrow">→</div>
  </a>

  <div class="cred-card">
    <div class="cred-number">10+</div>
    <div class="cred-label">certificări<br><span>Google · freeCodeCamp · Anthropic · LinkedIn Learning</span></div>
  </div>

  <div class="cred-card">
    <div class="cred-number">6</div>
    <div class="cred-label">module SaaS<br><span>în Alpis Fusion CRM Premium</span></div>
  </div>

  <div class="cred-card">
    <div class="cred-number">2022 →</div>
    <div class="cred-label">tranziție<br><span>din CRM &amp; Marketing în front-end</span></div>
  </div>
</section>
```

CSS (dark mode, aliniat cu paleta din screenshot — albastru/violet accent):

```css
.credibility-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

.cred-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.cred-card--cta {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08));
  border-color: rgba(139, 92, 246, 0.35);
  position: relative;
  cursor: pointer;
}

.cred-card--cta:hover {
  transform: translateY(-2px);
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
}

.cred-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1;
}

.cred-card--cta .cred-number {
  background: linear-gradient(135deg, #818cf8, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cred-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.cred-label span {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 400;
  margin-top: 4px;
}

.cred-arrow {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.25rem;
  color: rgba(139, 92, 246, 0.8);
  transition: transform 0.2s ease;
}

.cred-card--cta:hover .cred-arrow {
  transform: translate(4px, -4px);
}

@media (max-width: 768px) {
  .credibility-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .credibility-bar {
    grid-template-columns: 1fr;
  }
}
```

---

## 3. CARUSELUL — meta-rând tehnic + buton CodePen per card

În fiecare card din preview live (ai 4 tab-uri: Premium, ARCADE WORLD, Coaching AI, ClientFlow SaaS CRM), adaugă între titlu și descriere un rând cu 3 micro-info-uri tehnice:

```jsx
// Structura pentru fiecare card
const projectMeta = {
  'alpis-fusion-premium': {
    title: 'Alpis Fusion CRM Premium',
    tags: ['Vite + React', '~287KB build', 'Deploy automatizat'],
    description: 'Colecție de module CRM premium pentru lead pipeline, task management și automatizări.',
    openUrl: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/',
    codepenUrl: 'https://codepen.io/Laura-Andreea-the-typescripter',
    repoUrl: 'https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium'
  },
  'arcade-world': {
    title: 'ARCADE WORLD',
    tags: ['Vanilla JS', 'Canvas API', 'Game loop propriu'],
    description: 'Colecție de mini jocuri arcade construite în JavaScript pur, fără framework-uri.',
    openUrl: '...',
    codepenUrl: 'https://codepen.io/Laura-Andreea-the-typescripter'
  },
  'coaching-ai': {
    title: 'Coaching AI',
    tags: ['Claude API', 'Conversational UI', 'State management'],
    description: 'Interfață conversațională pentru coaching asistat de AI, cu istoric și context persistent.',
    openUrl: '...',
    codepenUrl: 'https://codepen.io/Laura-Andreea-the-typescripter'
  },
  'clientflow': {
    title: 'ClientFlow SaaS CRM',
    tags: ['Kanban + triage', 'Shortcuts tastatură', 'Prioritizare vizuală'],
    description: 'Sistem CRM orientat pe task-uri, automatizări și acțiuni operaționale zilnice.',
    openUrl: 'https://laurandreea10.github.io/codepen-portfolio/projects/clientflow.html',
    codepenUrl: 'https://codepen.io/Laura-Andreea-the-typescripter'
  }
};
```

JSX pentru meta-rând (copiază în componenta caruselului, între titlu și descriere):

```jsx
<div className="preview-meta">
  {project.tags.map(tag => (
    <span key={tag} className="preview-meta-tag">{tag}</span>
  ))}
</div>
```

CSS:

```css
.preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 16px;
}

.preview-meta-tag {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(129, 140, 248, 0.1);
  color: #a5b4fc;
  border: 1px solid rgba(129, 140, 248, 0.2);
  letter-spacing: 0.01em;
}
```

Butoane în card — adaugă „Vezi codul pe CodePen” lângă „Deschide proiectul”:

```jsx
<div className="preview-actions">
  <a href={project.openUrl} target="_blank" rel="noopener"
     className="btn btn-primary">
    Deschide proiectul
  </a>
  <a href={project.codepenUrl} target="_blank" rel="noopener"
     className="btn btn-secondary">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 8.5v7L12 22l10-6.5v-7L12 2zm0 2.3l7.5 4.9-3.6 2.4L12 9l-3.9 2.6-3.6-2.4L12 4.3z"/>
    </svg>
    Vezi codul pe CodePen
  </a>
</div>
```

---

## 4. CASE STUDY-URI — „Dovezi observabile” rescrise (ZERO template)

Înlocuiește bullet-urile actuale cu cele de mai jos. Fiecare proiect are acum detalii DIFERITE, specifice, tehnice.

### Alpis Fusion CRM Premium

```markdown
**Dovezi observabile**
- Arhitectură modulară cu **6 zone funcționale** integrate într-un singur dashboard: CRM, booking, content studio, billing, automatizări, RBAC — cu flow builder și kanban la nivel de aplicație.
- **Stack de producție:** Vite + React, build ~287KB minified, deploy automatizat prin GitHub Actions pe GitHub Pages.
- **Booking** cu detectare automată de conflicte și duplicate, **facturare** cu print PDF, export CSV/JSON și autosave pe toate formularele.
```

### ClientFlow

```markdown
**Dovezi observabile**
- **Stadii standardizate** pentru pipeline-ul de lead-uri, cu semnale vizuale diferențiate pentru urgențe (culoare + iconiță + poziție în board).
- **Shortcut-uri de tastatură** pentru acțiunile repetitive (triage, reasignare, status update) — mai puține click-uri pe zilele aglomerate.
- **Un singur ecran principal** pentru triage zilnic — fără navigare între liste separate pentru lead-uri și task-uri.
```

### Alpis Impact Path

```markdown
**Dovezi observabile**
- Parcursul static spart în **misiuni scurte cu progres vizibil** (bară + procent + număr pas curent din total).
- **Tranziții ghidate** între pași, cu ritm controlat, ca utilizatorul să nu se piardă la mijlocul parcursului.
- **CTA-uri contextuale** care apar doar când pasul curent e complet — nu toate în bloc la final.
```

---

## 5. SECȚIUNE NOUĂ — „Parcurs: de la CRM la cod”

HTML timeline orizontal, se inserează după secțiunea Proiecte-cheie:

```html
<section id="journey" class="journey-section">
  <div class="section-header">
    <span class="section-eyebrow">Parcurs</span>
    <h2>De la CRM la cod — cum am ajuns aici</h2>
  </div>

  <div class="timeline">
    <div class="timeline-step">
      <div class="timeline-year">2019–2022</div>
      <div class="timeline-content">
        <h3>Marketing &amp; CRM</h3>
        <p>Pro bono Marketing Specialist &amp; Strategist, Social Media Manager. Administrare baze de date, Facebook Ads, A/B Testing, e-commerce SEO, generare de leaduri, platforme imobiliare.</p>
      </div>
    </div>

    <div class="timeline-step">
      <div class="timeline-year">2022</div>
      <div class="timeline-content">
        <h3>Primele certificări tehnice</h3>
        <p>JavaScript Essential Training, Programming Foundations, Google Digital Marketing, Google Ads Measurement.</p>
      </div>
    </div>

    <div class="timeline-step">
      <div class="timeline-year">2023–2024</div>
      <div class="timeline-content">
        <h3>Proiecte personale publicate</h3>
        <p>Mini jocuri, aplicații SaaS, platforme educaționale, interfețe interactive — publicate pe CodePen și GitHub. Data Analysis with Python (freeCodeCamp).</p>
      </div>
    </div>

    <div class="timeline-step timeline-step--current">
      <div class="timeline-year">2024–2026</div>
      <div class="timeline-content">
        <h3>Portofoliu production-ready</h3>
        <p>Alpis Fusion CRM Premium, ClientFlow, Alpis Impact Path. Migrare la Vite + React, GitHub Actions, deploy automatizat. Claude Code in Action (Anthropic).</p>
      </div>
    </div>
  </div>
</section>
```

CSS:

```css
.journey-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #818cf8;
  margin-bottom: 12px;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 48px;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 16px;
  left: 5%;
  right: 5%;
  height: 2px;
  background: linear-gradient(90deg,
    rgba(129, 140, 248, 0.2),
    rgba(139, 92, 246, 0.4),
    rgba(196, 181, 253, 0.6));
  z-index: 0;
}

.timeline-step {
  position: relative;
  z-index: 1;
}

.timeline-step::before {
  content: '';
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(15, 15, 20, 1);
  border: 2px solid rgba(139, 92, 246, 0.6);
  margin: 8px auto 20px;
}

.timeline-step--current::before {
  background: #818cf8;
  box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.2);
}

.timeline-year {
  font-size: 0.85rem;
  font-weight: 600;
  color: #a5b4fc;
  text-align: center;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
}

.timeline-content h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.timeline-content p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .timeline {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .timeline::before {
    top: 0;
    bottom: 0;
    left: 8px;
    right: auto;
    width: 2px;
    height: auto;
  }

  .timeline-step::before {
    margin: 0 auto 12px 0;
  }
}
```

---

## 6. „DESPRE MINE” — extins cu text real din CodePen

Înlocuiește paragraful scurt actual:

```html
<section id="about" class="about-section">
  <div class="section-header">
    <span class="section-eyebrow">Despre mine</span>
    <h2>Combin experiența din CRM și Marketing cu explorarea front-end pentru a construi produse mai clare și mai umane</h2>
  </div>

  <div class="about-content">
    <p>Am lucrat ca <strong>Pro bono Marketing Specialist &amp; Strategist</strong> pentru afaceri mici și ca <strong>Social Media Manager</strong>. Experiența mea acoperă CRM, administrare baze de date, campanii digitale, Facebook Ads Manager, A/B Testing, e-commerce SEO, generare de leaduri, content management și colaborare pe platforme imobiliare. Asta mi-a format o gândire orientată spre utilizator, structură și rezultate reale.</p>

    <p>Din 2022 am început să acumulez certificări tehnice: <strong>JavaScript Essential Training</strong>, <strong>Programming Foundations</strong>, <strong>Data Analysis with Python</strong> (freeCodeCamp), <strong>Google Ads Measurement</strong>, <strong>Google Digital Marketing</strong> și <strong>Claude Code in Action</strong> (Anthropic). În paralel, din pasiune și disciplină, dezvolt proiecte personale în HTML, CSS și JavaScript — mini jocuri, aplicații SaaS, platforme educaționale și interfețe interactive.</p>
  </div>

  <div class="skills-grid">
    <span class="skill-badge">HTML5</span>
    <span class="skill-badge">CSS3</span>
    <span class="skill-badge">JavaScript</span>
    <span class="skill-badge">Python</span>
    <span class="skill-badge">React</span>
    <span class="skill-badge">Vite</span>
    <span class="skill-badge">Responsive Design</span>
    <span class="skill-badge">UI/UX Thinking</span>
    <span class="skill-badge">CRM</span>
    <span class="skill-badge">Marketing Digital</span>
    <span class="skill-badge">Google Ads</span>
    <span class="skill-badge">SEO</span>
    <span class="skill-badge">SEM</span>
    <span class="skill-badge">A/B Testing</span>
    <span class="skill-badge">Social Media</span>
    <span class="skill-badge">Content Marketing</span>
    <span class="skill-badge">Email Marketing</span>
    <span class="skill-badge">Data Analysis</span>
    <span class="skill-badge">GDPR</span>
    <span class="skill-badge">Facebook Ads</span>
    <span class="skill-badge">State &amp; Interaction</span>
    <span class="skill-badge">Product Thinking</span>
  </div>
</section>
```

CSS:

```css
.about-content {
  max-width: 800px;
  margin: 40px 0;
}

.about-content p {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
}

.about-content strong {
  color: #fff;
  font-weight: 600;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
  max-width: 900px;
}

.skill-badge {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.15s ease;
}

.skill-badge:hover {
  background: rgba(129, 140, 248, 0.1);
  border-color: rgba(129, 140, 248, 0.3);
  color: #c4b5fd;
}
```

---

## 7. SECȚIUNE NOUĂ — „Explorări și experimente” (CTA #3 spre CodePen)

```html
<section class="explorations-section">
  <div class="explorations-card">
    <div class="explorations-content">
      <span class="section-eyebrow">Explorări</span>
      <h2>Dincolo de cele 3 proiecte-cheie</h2>
      <p>Pe CodePen am publicat mini jocuri (<strong>ARCADE WORLD</strong>, <strong>Basket vs AI</strong>), explorări UI, fork-uri și prototipuri rapide. Le țin separate de proiectele-produs, ca să fie clar ce e original și ce e studiu.</p>

      <a href="https://codepen.io/Laura-Andreea-the-typescripter"
         target="_blank" rel="noopener"
         class="btn btn-large btn-codepen">
        Vezi cele 48 de proiecte pe CodePen
        <span class="arrow">→</span>
      </a>
    </div>

    <div class="explorations-stats">
      <div class="stat-item">
        <div class="stat-number">48</div>
        <div class="stat-label">proiecte live</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">4</div>
        <div class="stat-label">categorii<br>Game · Utility · UI · Challenge</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">∞</div>
        <div class="stat-label">experimente</div>
      </div>
    </div>
  </div>
</section>
```

CSS:

```css
.explorations-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.explorations-card {
  background: linear-gradient(135deg,
    rgba(99, 102, 241, 0.08),
    rgba(139, 92, 246, 0.04));
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 48px;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 48px;
  align-items: center;
}

.explorations-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 8px 0 16px;
  line-height: 1.2;
}

.explorations-content p {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 28px;
}

.btn-large {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-codepen {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.btn-codepen:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.btn-codepen .arrow {
  transition: transform 0.2s ease;
}

.btn-codepen:hover .arrow {
  transform: translateX(4px);
}

.explorations-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 32px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #c4b5fd;
  letter-spacing: -0.02em;
  min-width: 60px;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .explorations-card {
    grid-template-columns: 1fr;
    padding: 32px 24px;
  }

  .explorations-stats {
    padding-left: 0;
    padding-top: 24px;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
}
```

---

## 8. SECȚIUNE NOUĂ — „Ce am învățat pe drum” (blog stub)

```html
<section class="blog-section">
  <div class="section-header">
    <span class="section-eyebrow">Blog</span>
    <h2>Ce am învățat pe drum</h2>
    <p class="section-subtitle">Note despre deciziile tehnice și UX din proiectele mele. Articole complete în curând.</p>
  </div>

  <div class="blog-grid">
    <article class="blog-card blog-card--soon">
      <div class="blog-meta">
        <span class="blog-tag">Architecture</span>
        <span class="blog-date">În curând</span>
      </div>
      <h3>De ce am trecut de la single-file HTML la Vite + React pentru Alpis Fusion</h3>
      <p>Când 1917 linii într-un singur fișier încep să doară — migrarea, structura nouă și ce am câștigat.</p>
    </article>

    <article class="blog-card blog-card--soon">
      <div class="blog-meta">
        <span class="blog-tag">UX decisions</span>
        <span class="blog-date">În curând</span>
      </div>
      <h3>Flow builder vs Kanban: când alegi unul și când pe celălalt</h3>
      <p>Două pattern-uri aparent similare, două probleme diferite. Cum decid în funcție de tipul deciziei utilizatorului.</p>
    </article>

    <article class="blog-card blog-card--soon">
      <div class="blog-meta">
        <span class="blog-tag">Lessons</span>
        <span class="blog-date">În curând</span>
      </div>
      <h3>3 lecții din construirea unui SaaS CRM de la zero, ca autodidact</h3>
      <p>Ce aș face diferit, ce păstrez, și de ce CRM-ul m-a învățat să codez mai bine decât orice tutorial.</p>
    </article>
  </div>
</section>
```

CSS:

```css
.blog-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.section-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 12px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.blog-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;
}

.blog-card:hover {
  border-color: rgba(139, 92, 246, 0.3);
  background: rgba(139, 92, 246, 0.04);
  transform: translateY(-2px);
}

.blog-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.blog-tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(129, 140, 248, 0.12);
  color: #a5b4fc;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.blog-date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.blog-card h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  line-height: 1.35;
}

.blog-card p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .blog-grid { grid-template-columns: 1fr; }
}
```

---

## 9. CONTACT — reparat (CV PDF + CodePen)

```html
<section id="contact" class="contact-section">
  <div class="section-header">
    <span class="section-eyebrow">Contact</span>
    <h2>Lucrezi la un CRM, dashboard sau produs intern?</h2>
    <p class="section-subtitle">Scrie-mi dacă vrei să vezi case study-urile complete sau să discutăm o colaborare. Între timp, poți vedea cum gândesc codul pe <strong>CodePen</strong> și GitHub.</p>
  </div>

  <div class="contact-actions">
    <a href="mailto:andreealaurap@gmail.com?subject=Discutie%20proiect%20CRM%20%2F%20Dashboard"
       class="btn btn-primary btn-large">
      Trimite email
    </a>

    <a href="https://codepen.io/Laura-Andreea-the-typescripter"
       target="_blank" rel="noopener"
       class="btn btn-codepen btn-large">
      CodePen · 48 proiecte live
      <span class="arrow">→</span>
    </a>

    <a href="https://github.com/LaurAndreea10"
       target="_blank" rel="noopener"
       class="btn btn-secondary btn-large">
      GitHub
    </a>

    <a href="https://www.linkedin.com/in/laura-andreea/"
       target="_blank" rel="noopener"
       class="btn btn-secondary btn-large">
      LinkedIn
    </a>

    <!-- ÎNLOCUIEȘTE mailto cu link direct la PDF când îl ai -->
    <a href="/cv/laura-andreea-cv.pdf"
       download
       class="btn btn-secondary btn-large">
      Descarcă CV (PDF)
    </a>
  </div>
</section>
```

**Acțiune separată:** creează fișierul `cv/laura-andreea-cv.pdf` în repo și commit. Elimini complet mailto-ul inutil.

---

## 10. FOOTER — CodePen primul

```html
<footer class="site-footer">
  <p class="footer-tagline">Portofoliu selectat, construit în jurul proiectelor care mă reprezintă cel mai bine.</p>

  <nav class="footer-links">
    <a href="https://codepen.io/Laura-Andreea-the-typescripter" target="_blank" rel="noopener">
      <strong>CodePen</strong> <span class="footer-badge">48 proiecte live</span>
    </a>
    <a href="https://github.com/LaurAndreea10" target="_blank" rel="noopener">GitHub</a>
    <a href="https://www.linkedin.com/in/laura-andreea/" target="_blank" rel="noopener">LinkedIn</a>
    <a href="/cv/laura-andreea-cv.pdf" download>CV</a>
  </nav>
</footer>
```

CSS:

```css
.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.15s ease;
}

.footer-links a:hover { color: #c4b5fd; }
.footer-links a strong { color: #fff; }

.footer-badge {
  display: inline-block;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(129, 140, 248, 0.15);
  color: #a5b4fc;
  margin-left: 4px;
  vertical-align: middle;
}
```

---

## Rezumat — cele 4 puncte de retenție CodePen

| # | Locație | Tip CTA |
|---|---------|---------|
| 1 | Bara de credibilitate (primul card "48 proiecte live") | Card-link cu gradient accent |
| 2 | În fiecare card din carusel (buton lângă "Deschide proiectul") | Buton secundar cu logo CodePen |
| 3 | Secțiunea "Explorări și experimente" | Buton mare accent gradient |
| 4 | Contact + Footer (primul link, cu badge "48 proiecte live") | Buton prominent + footer link |

Oricât de repede ar scrolla recruiterul, dă peste cel puțin unul.

---

## Ordine de implementare (prioritate)

**Sesiune 1 (1–2h):** Bara de credibilitate + meta-rând în carusel + buton CodePen per card. Efect maxim pentru efort minim.

**Sesiune 2 (1–2h):** Rescrie „Dovezi observabile” cu detaliile specifice + extinde „Despre mine” cu textul real din CodePen + stack complet.

**Sesiune 3 (1–2h):** Timeline „Parcurs” + secțiunea „Explorări” cu CTA mare spre CodePen.

**Sesiune 4 (30min):** Blog stub + Contact reparat + Footer reorganizat + `<noscript>` pentru fallback.

Total: ~5h pentru toate modificările. Portofoliul trece de la 7.2 la 10/10.
