(function(){
  'use strict';

  const SOURCES = ['data/now.json', 'data/now-2026-05-17.json'];
  const ICONS = { done: '✓', 'in-progress': '◐', next: '→' };
  const TXT = {
    ro: { current: 'Săptămâna curentă', archive: 'Istoric', title: 'La ce lucrez săptămâna asta', note: 'Actualizat săptămânal. Folosesc portofoliul ca arhivă de dezvoltare, nu ca pagină de vânzare.' },
    en: { current: 'Current week', archive: 'Archive', title: 'What I am working on this week', note: 'Updated weekly. I use this portfolio as a learning archive, not a sales page.' }
  };

  function lang(){ return document.documentElement.lang === 'en' ? 'en' : 'ro'; }
  function t(){ return TXT[lang()]; }
  function esc(v){ return String(v || '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c])); }
  function href(v){ const x = String(v || '').trim(); return /^(https?:\/\/|#|\.\/|projects\/|[a-z0-9-]+\.html)/i.test(x) ? x : ''; }

  function styles(){
    if (document.getElementById('now-learning-styles')) return;
    const s = document.createElement('style');
    s.id = 'now-learning-styles';
    s.textContent = `
      #now .now-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}
      #now .now-tabs{display:flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.03)}
      #now .now-tab{padding:7px 14px;border:0;border-radius:999px;background:transparent;color:var(--muted);font-weight:700;cursor:pointer}
      #now .now-tab.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff}
      #now .now-week-meta{display:inline-flex;gap:8px;margin:10px 0;padding:6px 14px;border:1px solid var(--line);border-radius:999px;color:var(--muted)}
      #now .now-list{list-style:none;padding:0;margin:14px 0;display:grid;gap:10px}
      #now .now-item{display:flex;gap:10px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.03)}
      #now .now-i{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:rgba(79,140,255,.14);color:var(--accent);font-weight:900;flex:0 0 auto}
      #now .now-item a{color:var(--accent);text-decoration:none}#now .now-item a:hover{text-decoration:underline}
      #now .now-archive[hidden]{display:none}.archive-week{border:1px solid var(--line);border-radius:14px;margin:10px 0;overflow:hidden}.archive-week summary{padding:14px 16px;cursor:pointer;font-weight:800}.archive-week__body{padding:0 16px 12px}
      #marketing-tech [data-tool="marketing-os"]{border-color:rgba(34,211,238,.34);background:linear-gradient(135deg,rgba(6,182,212,.08),rgba(91,141,239,.05)),var(--panel,rgba(255,255,255,.03))}
    `;
    document.head.appendChild(s);
  }

  function item(it){
    const link = href(it.link);
    const text = esc(it.text);
    const body = link ? `<a href="${esc(link)}" ${link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${text} →</a>` : text;
    return `<li class="now-item"><span class="now-i">${ICONS[it.status] || '→'}</span><span>${body}</span></li>`;
  }

  function render(data){
    const section = document.getElementById('now');
    if (!section || !data || !data.current) return;
    styles();
    const c = t();
    const archive = (data.archive || []).map((w, i) => `<details class="archive-week" ${i === 0 ? 'open' : ''}><summary>${esc(w.week)} · ${esc(w.label || '')}</summary><div class="archive-week__body"><ul class="now-list">${(w.items || []).map(item).join('')}</ul></div></details>`).join('');
    section.innerHTML = `<div class="container"><article class="about-card glass"><div class="now-head"><div><span class="eyebrow eyebrow-green"><span class="now-pulse" aria-hidden="true"></span>⚡ Now</span><h2 id="now-title" class="now-title">${c.title}</h2></div><div class="now-tabs"><button class="now-tab active" data-v="current">${c.current}</button><button class="now-tab" data-v="archive">${c.archive}</button></div></div><div id="now-current"><div class="now-week-meta">📅 <strong>${esc(data.current.week)}</strong><span>·</span><time datetime="${esc(data.current.datetime)}">${esc(data.current.label)}</time></div><ul class="now-list">${(data.current.items || []).map(item).join('')}</ul></div><div id="now-archive" class="now-archive" hidden>${archive}</div><div class="now-tags"><span class="now-tag">React 18</span><span class="now-tag">Vite</span><span class="now-tag">GitHub Actions</span><span class="now-tag">Vanilla JS</span></div><p class="now-note">${c.note}</p></article></div>`;
    section.querySelectorAll('.now-tab').forEach(btn => btn.addEventListener('click', () => {
      section.querySelectorAll('.now-tab').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      const a = btn.dataset.v === 'archive';
      section.querySelector('#now-current').style.display = a ? 'none' : 'block';
      section.querySelector('#now-archive').toggleAttribute('hidden', !a);
    }));
  }

  function portfolioTone(){
    const en = lang() === 'en';
    document.querySelectorAll('.nav-links a[href="work-with-me.html"]').forEach(x => x.remove());
    const nav = document.querySelector('.nav-links');
    const contactNav = nav && nav.querySelector('a[href="#contact"]');
    if (nav && !nav.querySelector('a[href="changelog.html"]')) {
      const a = document.createElement('a'); a.className = 'pill'; a.href = 'changelog.html'; a.textContent = 'Changelog'; nav.insertBefore(a, contactNav || nav.querySelector('#langToggle'));
    }
    const hero = document.getElementById('heroCtaPrimary');
    if (hero) { hero.href = '#now'; hero.textContent = en ? 'See what I am building now' : 'Vezi ce dezvolt acum'; }
    const contactTitle = document.getElementById('contact-title');
    if (contactTitle) contactTitle.textContent = en ? 'I use this portfolio to grow through real builds' : 'Folosesc portofoliul ca să mă dezvolt prin proiecte reale';
    const contact = document.querySelector('.contact-card#contact');
    if (contact) {
      const p = contact.querySelector('p'); if (p) p.textContent = en ? 'Not a sales page: a learning archive with CRM interfaces, dashboards, marketing-tech tools and public experiments.' : 'Nu e pagină de vânzare: este arhiva mea de dezvoltare cu interfețe CRM, dashboard-uri, tool-uri Marketing-Tech și experimente publice.';
      const first = contact.querySelector('a.btn-primary'); if (first) { first.href = '#now'; first.textContent = en ? 'See current builds' : 'Vezi ce construiesc acum'; }
    }
    const ey = document.querySelector('.final-cta-card .eyebrow'); if (ey) ey.textContent = en ? 'Learning by building' : 'Dezvoltare prin proiecte';
    const ft = document.getElementById('final-cta-title'); if (ft) ft.textContent = en ? 'What I want to build next' : 'Ce vreau să construiesc mai departe';
    const fc = document.querySelector('.final-cta-card');
    if (fc) {
      const p = fc.querySelector('p'); if (p) p.textContent = en ? 'A direction board for growth: CRM patterns, dashboards, landing pages and interactive prototypes.' : 'Un board de direcții pentru dezvoltarea mea: pattern-uri CRM, dashboard-uri, landing pages și prototipuri interactive.';
      const a = fc.querySelector('a.btn-primary'); if (a) { a.href = '#now'; a.textContent = en ? 'Follow current progress →' : 'Urmărește progresul curent →'; }
    }
  }

  function marketingOS(){
    const section = document.getElementById('marketing-tech');
    const grid = section && section.querySelector('.projects-grid');
    if (!section || !grid || grid.querySelector('[data-tool="marketing-os"]')) return;
    styles();
    const en = lang() === 'en';
    const title = section.querySelector('#marketing-tech-title');
    if (title) title.textContent = en ? 'Marketing-Tech experiments and learning tools' : 'Experimente Marketing-Tech și tool-uri de învățare';
    const card = document.createElement('article');
    card.className = 'project-card glass';
    card.dataset.tool = 'marketing-os';
    card.innerHTML = `<span class="badge-new">LEARNING BUILD</span><div class="project-top"><div><h3>Marketing OS</h3><span class="badge-github">Unified marketing workspace · 0 backend</span></div><span class="tag github">marketing-tech</span></div><p class="project-desc">${en ? 'Learning project: campaign planning, ROI tracking, lead magnet generation and structured briefs. Bilingual RO/EN, zero backend.' : 'Proiect de dezvoltare: campaign planning, ROI tracking, lead magnet builder și brief generator. Bilingv RO/EN, 0 backend.'}</p><div class="card-actions"><a class="btn btn-primary" href="./marketing-os.html">${en ? 'Open Marketing OS' : 'Deschide Marketing OS'}</a><a class="btn btn-secondary" href="./changelog.html">Changelog</a><a class="btn btn-secondary" href="#now">${en ? 'Current learning →' : 'Ce dezvolt acum →'}</a></div>`;
    grid.insertBefore(card, grid.firstElementChild);
  }

  function dedupeStats(){
    document.querySelectorAll('section#github-stats').forEach((s, i) => { if (i > 0) { const d = s.previousElementSibling; if (d && d.classList.contains('section-divider')) d.remove(); s.remove(); } });
  }

  function loadNow(){
    if (!document.getElementById('now')) return;
    SOURCES.reduce((p, src) => p.catch(() => fetch(src, { cache: 'no-cache' }).then(r => r.ok ? r.json() : Promise.reject())), Promise.reject()).then(render).catch(() => {});
  }

  function init(){ portfolioTone(); marketingOS(); dedupeStats(); loadNow(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  document.addEventListener('click', e => { if (e.target && e.target.id === 'langToggle') setTimeout(() => { portfolioTone(); marketingOS(); }, 80); });
})();

(function(){
  'use strict';

  function lang(){ return document.documentElement.lang === 'en' ? 'en' : 'ro'; }

  function ensureStyles(){
    if (document.getElementById('portfolio-quick-wins-styles')) return;
    const style = document.createElement('style');
    style.id = 'portfolio-quick-wins-styles';
    style.textContent = `
      .not-section{margin-top:2rem;padding:1.5rem;border-left:3px solid var(--accent,#06b6d4);background:rgba(6,182,212,.05);border-radius:0 8px 8px 0}
      .not-section h3{margin:0 0 .75rem 0;font-size:1rem;opacity:.9}
      .not-section ul{margin:0;padding-left:1.2rem;line-height:1.7;opacity:.85}
    `;
    document.head.appendChild(style);
  }

  function applyMeta(){
    const en = lang() === 'en';
    const title = en
      ? 'Laura Andreea — Front-end CRM, dashboards and Marketing-Tech tools'
      : 'Laura Andreea — CRM-uri, dashboard-uri și Marketing-Tech front-end';
    const descText = en
      ? 'Front-end CRM & dashboard developer in continuous growth. 64 public experiments, 25 curated projects · Vite + React · product-minded UI/UX. RO/EN bilingual.'
      : 'Front-end CRM & dashboard developer în dezvoltare continuă. 64 experimente publice, 25 proiecte selectate · Vite + React · UI/UX cu logică de produs. Bilingv RO/EN.';
    document.title = title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', descText);
    document.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]').forEach(m => m.setAttribute('content', title));
    document.querySelectorAll('meta[property="og:description"],meta[name="twitter:description"]').forEach(m => m.setAttribute('content', descText));
  }

  function consolidateCounts(){
    const en = lang() === 'en';
    const cred = document.querySelector('#hero-proof .cred-item p');
    if (cred) {
      cred.innerHTML = en
        ? 'public experiments, 25 curated on this site<br><span class="subtle-inline">The rest are public experiments on CodePen →</span>'
        : 'proiecte live, 25 selectate pe acest site<br><span class="subtle-inline">Restul sunt experimente publice pe CodePen →</span>';
    }
    const credLink = document.querySelector('#hero-proof .cred-item[aria-label]');
    if (credLink) credLink.setAttribute('aria-label', en ? 'Open the CodePen hub with 64 public experiments' : 'Deschide hubul CodePen cu 64 experimente publice');
    document.querySelectorAll('a[href*="codepen.dev"],a[href*="codepen.io/Laura-Andreea-the-typescripter"]').forEach(a => {
      const tx = a.textContent.trim();
      if (/CodePen · 64 proiecte live|CodePen · 64 public projects|CodePen · 64 experimente publice|CodePen · 64 public experiments/i.test(tx)) {
        a.textContent = en ? 'CodePen · 64 public experiments →' : 'CodePen · 64 experimente publice →';
      }
    });
  }

  function addNotSection(){
    const en = lang() === 'en';
    const about = document.getElementById('about');
    if (!about) return;
    let box = about.querySelector('.not-section');
    if (!box) {
      box = document.createElement('div');
      box.className = 'not-section';
      const trail = about.querySelector('.learning-trail');
      const skills = about.querySelector('.skills');
      const target = trail || skills || about.querySelector('article');
      if (target) target.insertAdjacentElement(trail ? 'afterend' : 'beforebegin', box);
    }
    box.innerHTML = en
      ? '<h3>What I do NOT do — transparency</h3><ul><li>I do not build scalable backend systems or cloud infrastructure from scratch.</li><li>I do not do complex DevOps such as Kubernetes or microservices.</li><li>I do not cover full graphic design, illustration or advanced motion design.</li><li>I specialize in <strong>front-end for CRM, dashboards and Marketing-Tech tools</strong> — products with clear product logic.</li></ul>'
      : '<h3>Ce NU fac — transparență</h3><ul><li>Nu construiesc backend-uri scalabile sau infrastructură cloud de la zero.</li><li>Nu fac DevOps complex precum Kubernetes sau microservicii.</li><li>Nu acopăr design grafic complet, ilustrație sau motion design avansat.</li><li>Mă specializez pe <strong>front-end pentru CRM, dashboard-uri și Marketing-Tech tools</strong> — produse cu logică clară de produs.</li></ul>';
  }

  function applyQuickWins(){
    ensureStyles();
    applyMeta();
    consolidateCounts();
    addNotSection();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyQuickWins); else applyQuickWins();
  document.addEventListener('click', e => {
    if (e.target && e.target.id === 'langToggle') setTimeout(applyQuickWins, 100);
  });
})();
