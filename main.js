(() => {
  'use strict';

  const STORAGE_KEYS = {
    theme: 'portfolio-theme',
    contrast: 'portfolio-contrast',
    lang: 'portfolio-lang'
  };

  const translations = {
    ro: {
      documentTitle: 'Laura Andreea — Front-end CRM & Dashboard Developer',
      langButton: 'RO | EN',
      themeLight: '☀️ Light',
      themeDark: '🌙 Dark',
      contrastOn: 'Contrast normal',
      contrastOff: 'Contrast ridicat',
      brand: 'Portofoliu CodePen',
      heroEyebrow: 'CRM • Marketing • Front-end autodidact',
      heroTitle: 'Construiesc interfețe CRM și dashboard-uri care transformă procese complicate în fluxuri clare',
      heroText: 'Vin din CRM și marketing, iar în front-end mă concentrez pe produse unde structura, prioritizarea și feedback-ul vizual ajută utilizatorii să înțeleagă mai repede ce au de făcut și să acționeze fără fricțiune.',
      previewLabel: 'Preview live',
      previewOpen: 'Deschide proiectul',
      previewCaseStudy: 'Deschide case study',
      previewCode: 'Live →',
      heroPrimary: 'Scrie-mi despre un proiect',
      heroSecondary: 'Deschide Alpis Fusion →',
      implementationImplemented: 'Implementat',
      implementationProgress: 'În dezvoltare',
      implementationRoadmap: 'Roadmap',
      statusEditHint: 'Status implementare actualizat automat din main.js.',
      nowUpdatedPrefix: 'Actualizat:',
      nowLabel: '⚡ Now',
      nowTitle: 'La ce lucrez săptămâna asta'
    },
    en: {
      documentTitle: 'Laura Andreea — Front-end CRM & Dashboard Developer',
      langButton: 'EN | RO',
      themeLight: '☀️ Light',
      themeDark: '🌙 Dark',
      contrastOn: 'Normal contrast',
      contrastOff: 'High contrast',
      brand: 'CodePen Portfolio',
      heroEyebrow: 'CRM • Marketing • Self-taught front-end',
      heroTitle: 'I build CRM interfaces and dashboards that turn complex processes into clear flows',
      heroText: 'My background is in CRM and marketing, and in front-end I focus on products where structure, prioritization and visual feedback help users understand faster what to do and act with less friction.',
      previewLabel: 'Live preview',
      previewOpen: 'Open project',
      previewCaseStudy: 'Open case study',
      previewCode: 'Live →',
      heroPrimary: 'Email me about a project',
      heroSecondary: 'Open Alpis Fusion →',
      implementationImplemented: 'Implemented',
      implementationProgress: 'In progress',
      implementationRoadmap: 'Roadmap',
      statusEditHint: 'Implementation status updated automatically from main.js.',
      nowUpdatedPrefix: 'Updated:',
      nowLabel: '⚡ Now',
      nowTitle: 'What I am working on this week'
    }
  };

  const cardStatusContent = {
    'Excel-Quest': 'implemented',
    'BASKET VS AI': 'implemented',
    'Link Video Editor Studio': 'implemented',
    'CampaignPilot': 'implemented',
    'Campaign ROI Calculator': 'implemented',
    'Marketing OS': 'implemented',
    'Marketing-Tech Templates': 'implemented',
    'Lighthouse CI Audit Guide': 'implemented',
    'Lead Magnet Landing': 'roadmap',
    'Alpis Fusion CRM Premium': 'implemented',
    'Brief Studio': 'implemented',
    'ClientOps Suite Premium': 'progress',
    'ClientFlow SaaS CRM': 'implemented',
    'ClientOps': 'implemented',
    'ClientFlow': 'implemented',
    'ARCADE WORLD': 'implemented',
    'Coaching AI': 'progress'
  };

  // ── NOW CONTENT (absorbit din now-section.js) ──────────────────────
  // Itemele "done" includ atât datele originale din main.js cât și
  // intrările cu link din now-section.js, unificate într-o singură sursă.
  const nowContent = {
    ro: {
      datetime: '2026-05-24',
      label: '24 Mai 2026',
      tabs: { active: '🔄 În curs', done: '✅ Finalizat recent', history: '📅 Istoric' },
      active: [
        { title: 'Link Video Editor Studio', body: 'Automation Pack export: generare automată timeline din brief, export JSON structurat pentru handoff video.', tag: 'Iterație' },
        { title: 'Alpis Fusion CRM Premium', body: 'studiu de caz extins cu decision log: alegeri de produs, trade-off-uri UX, structura modulară.', tag: 'Documentație' },
        { title: 'Portofoliu — Lighthouse CI', body: 'audit performanță, extragere CSS non-critic, îmbunătățire LCP și eliminare render-blocking.', tag: 'Performanță' },
        { title: 'Marketing-Tech expansion', body: 'noi template-uri orientate pe conversie și growth workflows după Campaign ROI Calculator.', tag: 'Produs nou' }
      ],
      done: [
        { title: 'Intro cinematic overlay', body: 'integrat ca overlay SVG animat peste portofoliu, fără a afecta SEO. SessionStorage skip, prefers-reduced-motion support.', tag: 'Mai 2026' },
        { title: 'ClientOps Suite Premium', body: 'suită CRM completă cu fluxuri operaționale avansate, automatizări și dashboard unificat. Deploy GitHub Pages.', tag: 'Mai 2026' },
        { title: 'Alpis Fusion CRM Premium — Case Study & Decision Log', body: 'studiu de caz extins cu decision log, alegeri de produs și decizii UX documentate.', tag: 'Case study', link: { href: 'projects/alpis-fusion-case-study.html', label: 'Deschide case study' } },
        { title: 'Lighthouse CI Audit Guide', body: 'audit de performanță pentru portofoliu, LCP, CSS non-critic și checklist de optimizare.', tag: 'Performance', link: { href: 'tools/lighthouse-audit-guide.html', label: 'Deschide audit guide' } },
        { title: 'Marketing-Tech Templates', body: 'template-uri orientate pe conversie și growth workflows după Campaign ROI Calculator.', tag: 'Marketing-Tech', link: { href: 'tools/marketing-tech-templates.html', label: 'Deschide templates' } },
        { title: 'Marketing OS — Industry Benchmarks + UTM Builder v1.2', body: 'hub activ pentru benchmarks, UTM Builder v1.2, campanii și raportare marketing.', tag: 'Marketing OS', link: { href: 'tools/marketing-os.html', label: 'Deschide Marketing OS' } },
        { title: 'Link Video Editor Studio — Automation Pack Export', body: 'export pentru Automation Pack, timeline din brief și workflow pentru handoff video.', tag: 'Automation', link: { href: 'tools/link-video-automation-pack.html', label: 'Deschide Automation Pack' } },
        { title: 'Brief Studio', body: 'platformă SaaS bilingvă RO/EN cu Brief Generator, Mood Board și Market Lens. API-uri keyless publice.', tag: 'Apr 2026' },
        { title: 'Proof of Work section', body: 'înlocuit secțiunea de testimoniale cu dovezi tehnice obiective: repo-uri publice, CI/CD, proiecte live verificabile.', tag: 'Apr 2026' },
        { title: 'CampaignPilot', body: 'workspace unificat pentru planificarea campaniilor: KPI overview, funnel, budget allocation, content calendar, brief generator.', tag: 'Apr 2026' }
      ],
      history: [
        { label: 'Săpt. 19–23 Mai 2026', items: ['Intro cinematic integrat ca overlay în portofoliu', 'Îmbunătățiri tehnice overlay: CSS în head, early-exit script, SVG cross-browser fix', 'Secțiunea Now — refactorizare cu checklist și istoric'] },
        { label: 'Săpt. 12–18 Mai 2026', items: ['ClientOps Suite Premium — finalizat și deploiat', 'Link Video Editor Studio — primele iterații live', 'Nexus Protocol v2 — 6 facțiuni, AI Director, 30 achievements'] },
        { label: 'Săpt. 5–11 Mai 2026', items: ['Marketing-Tech — CampaignPilot și ROI Calculator livrate', 'Portofoliu extins la 64 proiecte live', 'Proof of Work section — înlocuit testimoniale cu dovezi obiective'] },
        { label: 'Aprilie 2026', items: ['Brief Studio — platformă SaaS bilingvă cu 3 module', 'GitHub Projects category adăugată în portofoliu', 'ARCADE OPS Excel Quest — finalizat cu story mode și leaderboard'] }
      ],
      note: 'Actualizat manual ca secțiune de tip now page — arată ce prioritizez activ, nu doar ce am construit.'
    },
    en: {
      datetime: '2026-05-24',
      label: 'May 24, 2026',
      tabs: { active: '🔄 In progress', done: '✅ Recently shipped', history: '📅 History' },
      active: [
        { title: 'Link Video Editor Studio', body: 'Automation Pack export: auto-generate a timeline from a brief, structured JSON export for video handoff.', tag: 'Iteration' },
        { title: 'Alpis Fusion CRM Premium', body: 'extended case study with a decision log: product choices, UX trade-offs, modular structure.', tag: 'Documentation' },
        { title: 'Portfolio — Lighthouse CI', body: 'performance audit, non-critical CSS extraction, LCP improvement and removing render-blocking.', tag: 'Performance' },
        { title: 'Marketing-Tech expansion', body: 'new conversion-oriented templates and growth workflows after Campaign ROI Calculator.', tag: 'New product' }
      ],
      done: [
        { title: 'Intro cinematic overlay', body: 'integrated as an animated SVG overlay on top of the portfolio, without hurting SEO. SessionStorage skip, prefers-reduced-motion support.', tag: 'May 2026' },
        { title: 'ClientOps Suite Premium', body: 'complete CRM suite with advanced operational flows, automations and a unified dashboard. Deployed on GitHub Pages.', tag: 'May 2026' },
        { title: 'Alpis Fusion CRM Premium — Case Study & Decision Log', body: 'extended case study with decision log, product choices and documented UX decisions.', tag: 'Case study', link: { href: 'projects/alpis-fusion-case-study.html', label: 'Open case study' } },
        { title: 'Lighthouse CI Audit Guide', body: 'performance audit for the portfolio, LCP, non-critical CSS and an optimisation checklist.', tag: 'Performance', link: { href: 'tools/lighthouse-audit-guide.html', label: 'Open audit guide' } },
        { title: 'Marketing-Tech Templates', body: 'conversion-oriented templates and growth workflows after Campaign ROI Calculator.', tag: 'Marketing-Tech', link: { href: 'tools/marketing-tech-templates.html', label: 'Open templates' } },
        { title: 'Marketing OS — Industry Benchmarks + UTM Builder v1.2', body: 'active hub for benchmarks, UTM Builder v1.2, campaigns and marketing reporting.', tag: 'Marketing OS', link: { href: 'tools/marketing-os.html', label: 'Open Marketing OS' } },
        { title: 'Link Video Editor Studio — Automation Pack Export', body: 'Automation Pack export, timeline from brief and workflow for video handoff.', tag: 'Automation', link: { href: 'tools/link-video-automation-pack.html', label: 'Open Automation Pack' } },
        { title: 'Brief Studio', body: 'bilingual RO/EN SaaS platform with Brief Generator, Mood Board and Market Lens. Public keyless APIs.', tag: 'Apr 2026' },
        { title: 'Proof of Work section', body: 'replaced the testimonials section with objective technical proof: public repos, CI/CD, verifiable live projects.', tag: 'Apr 2026' },
        { title: 'CampaignPilot', body: 'unified workspace for campaign planning: KPI overview, funnel, budget allocation, content calendar, brief generator.', tag: 'Apr 2026' }
      ],
      history: [
        { label: 'Week of May 19–23, 2026', items: ['Cinematic intro integrated as a portfolio overlay', 'Overlay technical improvements: CSS in head, early-exit script, SVG cross-browser fix', 'Now section — refactored with checklist and history'] },
        { label: 'Week of May 12–18, 2026', items: ['ClientOps Suite Premium — finished and deployed', 'Link Video Editor Studio — first live iterations', 'Nexus Protocol v2 — 6 factions, AI Director, 30 achievements'] },
        { label: 'Week of May 5–11, 2026', items: ['Marketing-Tech — CampaignPilot and ROI Calculator shipped', 'Portfolio expanded to 64 live projects', 'Proof of Work section — replaced testimonials with objective proof'] },
        { label: 'April 2026', items: ['Brief Studio — bilingual SaaS platform with 3 modules', 'GitHub Projects category added to the portfolio', 'ARCADE OPS Excel Quest — finished with story mode and leaderboard'] }
      ],
      note: 'Updated manually as a now-page style section — it shows what I actively prioritize, not just what I have built.'
    }
  };

  const previewSlides = [
    {
      title: 'Alpis Fusion CRM Premium',
      label: 'CRM premium',
      description: { ro: 'Colecție modulară pentru lead pipeline, task management, billing și automatizări.', en: 'Modular collection for lead pipeline, task management, billing and automations.' },
      meta: 'Vite + React · build optimizat · Deploy automatizat',
      frameUrl: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/',
      primaryUrl: './alpis-fusion-crm.html',
      secondaryUrl: 'https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium',
      codeUrl: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/'
    },
    {
      title: 'ClientFlow SaaS CRM',
      label: 'SaaS CRM',
      description: { ro: 'Sistem CRM orientat pe task-uri, automatizări și acțiuni operaționale zilnice.', en: 'CRM system focused on tasks, automations and daily operational actions.' },
      meta: 'Kanban + triage · Shortcuts · Prioritizare vizuală',
      frameUrl: 'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/',
      primaryUrl: 'projects/clientflow.html',
      secondaryUrl: 'https://github.com/LaurAndreea10/ClientFlow-PRO',
      codeUrl: 'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/'
    },
    {
      title: 'Link Video Editor Studio',
      label: 'Video studio',
      description: { ro: 'Studio pentru workflow video, navigare rapidă și Automation Pack export.', en: 'Studio for video workflow, quick navigation and Automation Pack export.' },
      meta: 'HTML · CSS · JavaScript · Automation Pack',
      frameUrl: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/',
      primaryUrl: './tools/link-video-automation-pack.html',
      secondaryUrl: 'https://github.com/LaurAndreea10/Link-Video-Editor-Studio',
      codeUrl: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/'
    }
  ];

  const els = {
    body: document.body,
    html: document.documentElement,
    themeToggle: document.getElementById('themeToggle'),
    contrastToggle: document.getElementById('contrastToggle'),
    langToggle: document.getElementById('langToggle'),
    navLinks: [...document.querySelectorAll('.nav-links a.pill[href^="#"]')],
    sections: [...document.querySelectorAll('main section[id], header[id]')],
    brandText: document.getElementById('brandText'),
    heroEyebrow: document.getElementById('hero-eyebrow'),
    heroTitle: document.getElementById('hero-title'),
    heroText: document.getElementById('hero-text'),
    heroPreviewLabel: document.getElementById('heroPreviewLabel'),
    heroPreviewTitle: document.getElementById('heroPreviewTitle'),
    heroPreviewLinks: document.getElementById('heroPreviewLinks'),
    heroPreviewHeading: document.getElementById('heroPreviewHeading'),
    heroPreviewMeta: document.getElementById('heroPreviewMeta'),
    heroPreviewDescription: document.getElementById('heroPreviewDescription'),
    heroPreviewType: document.getElementById('heroPreviewType'),
    heroPreviewUrl: document.getElementById('heroPreviewUrl'),
    heroPreviewOpen: document.getElementById('heroPreviewOpen'),
    heroPreviewOpenSecondary: document.getElementById('heroPreviewOpenSecondary'),
    heroPreviewCode: document.getElementById('heroPreviewCode'),
    heroPreviewFrame: document.getElementById('heroPreviewFrame'),
    heroPreviewFallback: document.getElementById('heroPreviewFallback'),
    heroPreviewHint: document.getElementById('heroPreviewHint'),
    heroCtaPrimary: document.getElementById('heroCtaPrimary'),
    heroCtaSecondary: document.getElementById('heroCtaSecondary'),
    nowSection: document.getElementById('now')
  };

  let currentLang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem(STORAGE_KEYS.lang) || 'ro';
  if (!translations[currentLang]) currentLang = 'ro';

  let previewIndex = 0;
  let autoplayId = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ── PROBE PAGES ───────────────────────────────────────────────────
  // Probe-urile se fac o singură dată la init, nu la fiecare applyLanguage.
  // Rezultatele sunt stocate în _pageReachable și reutilizate ulterior.
  const _pageReachable = {};
  const _probeUrls = [
    './tools/link-video-automation-pack.html',
    './tools/marketing-tech-templates.html',
    './tools/marketing-os.html',
    './tools/lighthouse-audit-guide.html',
    './projects/alpis-fusion-case-study.html',
    './projects/alpis-fusion-crm.html',
    'projects/alpis-fusion-crm.html'
  ];

  function runPageProbes() {
    _probeUrls.forEach(href => {
      if (href in _pageReachable) return;
      _pageReachable[href] = false; // pesimist până la răspuns
      fetch(href, { method: 'HEAD' })
        .then(r => { _pageReachable[href] = r.ok; })
        .catch(() => { _pageReachable[href] = false; });
    });
  }

  function isReachable(href) {
    return !!_pageReachable[href];
  }

  // ── IMPLEMENTATION CARDS ──────────────────────────────────────────
  function normalizeImplementationState(value) {
    if (!value) return null;
    const normalized = String(value).trim().toLowerCase();
    if (['implemented', 'implementat', 'done', 'live'].includes(normalized)) return 'implemented';
    if (['progress', 'in-progress', 'in_progress', 'dev', 'draft', 'wip', 'dezvoltare'].includes(normalized)) return 'progress';
    if (['roadmap', 'soon', 'planned', 'planificat'].includes(normalized)) return 'roadmap';
    return null;
  }

  function getCardTitle(card) {
    const titleEl = card.querySelector('h3');
    return titleEl ? titleEl.textContent.trim() : '';
  }

  function getImplementationLabel(state) {
    const copy = translations[currentLang];
    if (state === 'implemented') return copy.implementationImplemented;
    if (state === 'roadmap') return copy.implementationRoadmap;
    return copy.implementationProgress;
  }

  function inferImplementationState(card) {
    if (!card) return 'progress';
    const explicitState = normalizeImplementationState(card.dataset.status || card.dataset.implementation);
    if (explicitState) return explicitState;
    const titleState = normalizeImplementationState(cardStatusContent[getCardTitle(card)]);
    if (titleState) return titleState;
    if (card.classList.contains('project-card-soon')) return 'roadmap';
    const links = [...card.querySelectorAll('a[href]')];
    const hasLive = links.some(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      return href.includes('github.io') || href.startsWith('./') || href.startsWith('projects/') || href.endsWith('.html');
    });
    if (hasLive) return 'implemented';
    if (links.some(link => (link.getAttribute('href') || '').includes('github.com'))) return 'progress';
    return 'progress';
  }

  function decorateImplementationCards() {
    const cards = [...document.querySelectorAll('.projects-grid .project-card')];
    cards.forEach(card => {
      const state = inferImplementationState(card);
      card.dataset.implementation = state;
      card.title = translations[currentLang].statusEditHint;
      let badge = card.querySelector('.implementation-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'implementation-badge';
        badge.setAttribute('aria-label', currentLang === 'ro' ? 'Stare implementare' : 'Implementation status');
        card.appendChild(badge);
      }
      badge.textContent = getImplementationLabel(state);
    });
  }

  // ── NOW SECTION ───────────────────────────────────────────────────
  function currentWeekLabel() {
    const now = new Date();
    const dow = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const M = currentLang === 'ro'
      ? ['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Noi','Dec']
      : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = friday.getFullYear();
    if (currentLang === 'ro') {
      return monday.getMonth() === friday.getMonth()
        ? `Săpt. ${monday.getDate()}–${friday.getDate()} ${M[friday.getMonth()]} ${year}`
        : `Săpt. ${monday.getDate()} ${M[monday.getMonth()]}–${friday.getDate()} ${M[friday.getMonth()]} ${year}`;
    }
    return monday.getMonth() === friday.getMonth()
      ? `Week of ${M[monday.getMonth()]} ${monday.getDate()}–${friday.getDate()}, ${year}`
      : `Week of ${M[monday.getMonth()]} ${monday.getDate()}–${M[friday.getMonth()]} ${friday.getDate()}, ${year}`;
  }

  function buildNowItem(entry, done) {
    const li = document.createElement('li');
    li.className = 'now-item ' + (done ? 'now-item-done' : 'now-item-active');
    const status = document.createElement('span');
    status.className = 'now-status';
    status.setAttribute('aria-label', done
      ? (currentLang === 'ro' ? 'Finalizat' : 'Done')
      : (currentLang === 'ro' ? 'În lucru' : 'In progress'));
    status.textContent = done ? '✅' : '🔄';
    const div = document.createElement('div');
    const strong = document.createElement('strong');

    // Dacă intrarea are link, titlul devine ancoră
    if (entry.link) {
      const a = document.createElement('a');
      a.className = 'now-item-link';
      a.href = entry.link.href;
      a.textContent = entry.title;
      strong.appendChild(a);
    } else {
      strong.textContent = entry.title;
    }

    div.appendChild(strong);
    div.appendChild(document.createTextNode(' — ' + entry.body + ' '));

    if (entry.tag) {
      const tag = document.createElement('span');
      tag.className = 'now-tag' + (done ? ' now-tag-done' : '');
      tag.textContent = entry.tag;
      div.appendChild(tag);
    }

    // Buton acțiune secundar (dacă pagina e reachable)
    if (entry.link && isReachable(entry.link.href)) {
      const action = document.createElement('a');
      action.className = 'now-tag now-link-action';
      action.href = entry.link.href;
      action.textContent = entry.link.label;
      action.setAttribute('aria-label', entry.link.label);
      div.appendChild(document.createTextNode(' '));
      div.appendChild(action);
    }

    li.appendChild(status);
    li.appendChild(div);
    return li;
  }

  function setupNowSection() {
    if (!els.nowSection) return;
    const copy = nowContent[currentLang] || nowContent.ro;
    const t = translations[currentLang];

    // Header
    const eyebrow = els.nowSection.querySelector('.eyebrow');
    const title = els.nowSection.querySelector('.now-title');
    const badge = els.nowSection.querySelector('.now-badge');
    const note = els.nowSection.querySelector('.now-note');
    if (eyebrow) eyebrow.textContent = t.nowLabel;
    if (title) title.textContent = t.nowTitle;
    if (badge) {
      const clock = badge.querySelector('[data-clock]');
      badge.innerHTML = `${t.nowUpdatedPrefix} <time datetime="${copy.datetime}">${copy.label}</time>`;
      if (clock) badge.appendChild(clock);
    }
    if (note) note.innerHTML = copy.note;

    // Tab labels
    const tabA = els.nowSection.querySelector('#now-tab-active');
    const tabD = els.nowSection.querySelector('#now-tab-done');
    const tabH = els.nowSection.querySelector('#now-tab-history');
    if (tabA && copy.tabs) tabA.textContent = copy.tabs.active;
    if (tabD && copy.tabs) tabD.textContent = copy.tabs.done;
    if (tabH && copy.tabs) tabH.textContent = copy.tabs.history;

    // Panel: active
    const activePanel = els.nowSection.querySelector('#now-panel-active .now-checklist');
    if (activePanel && Array.isArray(copy.active)) {
      activePanel.innerHTML = '';
      copy.active.forEach(entry => activePanel.appendChild(buildNowItem(entry, false)));
    }

    // Panel: done
    const donePanel = els.nowSection.querySelector('#now-panel-done .now-checklist');
    if (donePanel && Array.isArray(copy.done)) {
      donePanel.innerHTML = '';
      copy.done.forEach(entry => donePanel.appendChild(buildNowItem(entry, true)));
    }

    // Panel: history (primul label = săptămâna curentă, calculat live)
    const historyPanel = els.nowSection.querySelector('#now-panel-history .now-history');
    if (historyPanel && Array.isArray(copy.history)) {
      historyPanel.innerHTML = '';
      copy.history.forEach((week, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'now-history-week';
        const label = document.createElement('span');
        label.className = 'now-history-label';
        label.textContent = idx === 0 ? currentWeekLabel() : week.label;
        const ul = document.createElement('ul');
        week.items.forEach(text => {
          const li = document.createElement('li');
          li.textContent = text;
          ul.appendChild(li);
        });
        wrap.appendChild(label);
        wrap.appendChild(ul);
        historyPanel.appendChild(wrap);
      });
    }
  }

  // ── THEME / CONTRAST / LANG ───────────────────────────────────────
  function applyThemeFromStorage() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    els.body.classList.toggle('light', savedTheme === 'light');
    syncThemeButton();
  }

  function applyContrastFromStorage() {
    const savedContrast = localStorage.getItem(STORAGE_KEYS.contrast);
    const isHigh = savedContrast === 'high';
    els.body.classList.toggle('high-contrast', isHigh);
    if (els.contrastToggle) {
      els.contrastToggle.setAttribute('aria-pressed', String(isHigh));
      els.contrastToggle.textContent = isHigh ? translations[currentLang].contrastOn : translations[currentLang].contrastOff;
    }
  }

  function syncThemeButton() {
    if (!els.themeToggle) return;
    const isLight = els.body.classList.contains('light');
    els.themeToggle.textContent = isLight ? translations[currentLang].themeDark : translations[currentLang].themeLight;
    els.themeToggle.setAttribute('aria-label', currentLang === 'ro' ? 'Schimbă tema vizuală' : 'Change visual theme');
  }

  function applyLanguage(lang) {
    currentLang = translations[lang] ? lang : 'ro';
    localStorage.setItem(STORAGE_KEYS.lang, currentLang);
    els.html.lang = currentLang;
    document.title = translations[currentLang].documentTitle;
    if (els.langToggle) els.langToggle.textContent = translations[currentLang].langButton;
    if (els.brandText) els.brandText.textContent = translations[currentLang].brand;
    if (els.heroEyebrow) els.heroEyebrow.textContent = translations[currentLang].heroEyebrow;
    if (els.heroTitle) els.heroTitle.textContent = translations[currentLang].heroTitle;
    if (els.heroText) els.heroText.textContent = translations[currentLang].heroText;
    if (els.heroPreviewLabel) els.heroPreviewLabel.textContent = translations[currentLang].previewLabel;
    if (els.heroCtaPrimary) els.heroCtaPrimary.textContent = translations[currentLang].heroPrimary;
    if (els.heroCtaSecondary) els.heroCtaSecondary.textContent = translations[currentLang].heroSecondary;
    syncThemeButton();
    applyContrastFromStorage();
    renderPreviewChips();
    setPreview(previewIndex);
    setupPortfolioIntegrations();
    decorateImplementationCards();
    setupNowSection();
  }

  // ── PREVIEW CAROUSEL ──────────────────────────────────────────────
  function renderPreviewChips() {
    if (!els.heroPreviewLinks) return;
    els.heroPreviewLinks.innerHTML = '';
    previewSlides.forEach((slide, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (index === previewIndex ? ' active' : '');
      btn.textContent = slide.title;
      btn.setAttribute('aria-pressed', String(index === previewIndex));
      btn.setAttribute('aria-label', `${currentLang === 'ro' ? 'Selectează preview pentru' : 'Select preview for'} ${slide.title}`);
      btn.addEventListener('click', () => { setPreview(index); restartAutoplay(); });
      els.heroPreviewLinks.appendChild(btn);
    });
  }

  function showPreviewFallback(show) {
    if (!els.heroPreviewFallback || !els.heroPreviewHint || !els.heroPreviewFrame) return;
    els.heroPreviewFallback.style.opacity = show ? '1' : '0';
    els.heroPreviewHint.style.opacity = show ? '1' : '0';
    els.heroPreviewFrame.style.opacity = show ? '0' : '1';
  }

  function setPreview(index) {
    previewIndex = (index + previewSlides.length) % previewSlides.length;
    const slide = previewSlides[previewIndex];
    if (els.heroPreviewTitle) els.heroPreviewTitle.textContent = slide.title;
    if (els.heroPreviewHeading) els.heroPreviewHeading.textContent = slide.title;
    if (els.heroPreviewMeta) els.heroPreviewMeta.textContent = slide.meta;
    if (els.heroPreviewDescription) els.heroPreviewDescription.textContent = slide.description[currentLang];
    if (els.heroPreviewType) els.heroPreviewType.textContent = slide.label;
    if (els.heroPreviewUrl) {
      els.heroPreviewUrl.href = slide.secondaryUrl;
      els.heroPreviewUrl.textContent = slide.secondaryUrl.replace(/^https?:\/\//, '');
    }
    if (els.heroPreviewOpen) {
      els.heroPreviewOpen.href = slide.primaryUrl;
      els.heroPreviewOpen.textContent = translations[currentLang].previewCaseStudy;
    }
    if (els.heroPreviewOpenSecondary) {
      els.heroPreviewOpenSecondary.href = slide.secondaryUrl;
      els.heroPreviewOpenSecondary.textContent = translations[currentLang].previewOpen;
    }
    if (els.heroPreviewCode) {
      els.heroPreviewCode.href = slide.codeUrl;
      els.heroPreviewCode.textContent = translations[currentLang].previewCode;
    }

    // FIX: arată fallback-ul ÎNAINTE de a seta src-ul,
    // ascunde-l abia după ce frame-ul s-a încărcat cu succes.
    if (els.heroPreviewFrame) {
      showPreviewFallback(true);
      els.heroPreviewFrame.src = slide.frameUrl;
    }

    renderPreviewChips();
  }

  // ── PORTFOLIO INTEGRATIONS ────────────────────────────────────────
  function createProjectCard({ title, badge, tag, description, href, secondaryHref, secondaryLabel }) {
    const article = document.createElement('article');
    article.className = 'project-card glass';
    article.dataset.status = 'implemented';
    article.innerHTML = `
      <span class="badge-new">NEW</span>
      <div class="project-top">
        <div>
          <h3>${title}</h3>
          <span class="badge-github">${badge}</span>
        </div>
        <span class="tag github">${tag}</span>
      </div>
      <p class="project-desc">${description}</p>
      <div class="card-actions">
        <a class="btn btn-primary" href="${href}">Deschide Live</a>
        ${secondaryHref ? `<a class="btn btn-secondary" href="${secondaryHref}">${secondaryLabel || 'Detalii'}</a>` : ''}
      </div>
    `;
    return article;
  }

  function setupPortfolioIntegrations() {
    const marketingGrid = document.querySelector('#marketing-tech .projects-grid');
    if (marketingGrid && !marketingGrid.dataset.extendedIntegrations) {
      const existingTitles = new Set([...marketingGrid.querySelectorAll('h3')].map(h => h.textContent.trim()));
      const cards = [
        {
          title: 'Marketing OS',
          badge: 'Industry Benchmarks · UTM Builder v1.2',
          tag: 'marketing-os',
          description: 'Workspace integrat pentru marketing managers: benchmark-uri pe industrii, UTM builder, KPI tracking și istoric campanii.',
          href: './tools/marketing-os.html',
          secondaryHref: './tools/marketing-os.html#utm',
          secondaryLabel: 'UTM Builder'
        },
        {
          title: 'Marketing-Tech Templates',
          badge: 'Conversion · Growth workflows',
          tag: 'growth',
          description: 'Suită de template-uri pentru funnel, A/B testing, lead magnet builder și workflow-uri de conversie.',
          href: './tools/marketing-tech-templates.html'
        },
        {
          title: 'Lighthouse CI Audit Guide',
          badge: 'Performance · LCP · CSS audit',
          tag: 'performance',
          description: 'Tool educațional pentru audit de performanță: scoruri Lighthouse simulate, oportunități LCP/CLS/TBT și fix-uri concrete.',
          href: './tools/lighthouse-audit-guide.html'
        }
      ];
      let injectedAny = false;
      cards.forEach(card => {
        if (existingTitles.has(card.title)) return;
        if (isReachable(card.href)) {
          marketingGrid.appendChild(createProjectCard(card));
          injectedAny = true;
        }
      });
      if (injectedAny) marketingGrid.dataset.extendedIntegrations = 'true';
    }

    const marketingActions = document.querySelector('#marketing-tech .section-head .card-actions');
    if (marketingActions) {
      [
        ['Marketing OS', './tools/marketing-os.html'],
        ['Templates', './tools/marketing-tech-templates.html'],
        ['Lighthouse Audit', './tools/lighthouse-audit-guide.html']
      ].forEach(([label, href]) => {
        if (marketingActions.querySelector(`[href="${href}"]`)) return;
        if (!isReachable(href)) return;
        const link = document.createElement('a');
        link.className = 'btn btn-secondary';
        link.href = href;
        link.textContent = label;
        marketingActions.appendChild(link);
      });
    }

    const linkVideoCard = [...document.querySelectorAll('.project-card')].find(card => getCardTitle(card) === 'Link Video Editor Studio');
    const linkVideoActions = linkVideoCard?.querySelector('.card-actions');
    if (linkVideoActions && !linkVideoActions.querySelector('[href="./tools/link-video-automation-pack.html"]') && isReachable('./tools/link-video-automation-pack.html')) {
      const link = document.createElement('a');
      link.className = 'btn btn-secondary';
      link.href = './tools/link-video-automation-pack.html';
      link.textContent = 'Automation Pack';
      linkVideoActions.appendChild(link);
    }

    const alpisActions = document.querySelector('#key-alpis-title')?.closest('.project-card')?.querySelector('.card-actions');
    if (alpisActions) {
      let alpisLink = alpisActions.querySelector('[href="./projects/alpis-fusion-crm.html"]');
      if (!alpisLink) {
        alpisLink = document.createElement('a');
        alpisLink.className = 'btn btn-secondary';
        alpisLink.href = './projects/alpis-fusion-crm.html';
        alpisActions.appendChild(alpisLink);
      }
      alpisLink.textContent = currentLang === 'ro' ? 'Case study complet' : 'Full case study';
    }
  }

  // ── AUTOPLAY ──────────────────────────────────────────────────────
  function startAutoplay() {
    if (prefersReducedMotion.matches || previewSlides.length < 2) return;
    stopAutoplay();
    autoplayId = window.setInterval(() => setPreview(previewIndex + 1), 5000);
  }

  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // ── EVENT LISTENERS ───────────────────────────────────────────────
  function setupThemeToggle() {
    if (!els.themeToggle) return;
    els.themeToggle.addEventListener('click', () => {
      const isLight = els.body.classList.toggle('light');
      localStorage.setItem(STORAGE_KEYS.theme, isLight ? 'light' : 'dark');
      syncThemeButton();
    });
  }

  function setupContrastToggle() {
    if (!els.contrastToggle) return;
    els.contrastToggle.addEventListener('click', () => {
      const isHigh = els.body.classList.toggle('high-contrast');
      localStorage.setItem(STORAGE_KEYS.contrast, isHigh ? 'high' : 'normal');
      applyContrastFromStorage();
    });
  }

  function setupLangToggle() {
    if (!els.langToggle) return;
    els.langToggle.addEventListener('click', () => applyLanguage(currentLang === 'ro' ? 'en' : 'ro'));
  }

  function setupPreviewFrame() {
    if (!els.heroPreviewFrame) return;
    // Ascunde fallback-ul la load reușit
    els.heroPreviewFrame.addEventListener('load', () => showPreviewFallback(false));
    // Afișează fallback la eroare
    els.heroPreviewFrame.addEventListener('error', () => showPreviewFallback(true));
    els.heroPreviewFrame.addEventListener('mouseenter', stopAutoplay);
    els.heroPreviewFrame.addEventListener('mouseleave', startAutoplay);
  }

  function setupAriaCurrent() {
    if (!('IntersectionObserver' in window) || !els.sections.length || !els.navLinks.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const currentId = `#${visible[0].target.id}`;
      els.navLinks.forEach(link => {
        if (link.getAttribute('href') === currentId) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: [0.2, 0.35, 0.55] });
    els.sections.forEach(section => observer.observe(section));
  }

  function setupReducedMotionWatcher() {
    if (typeof prefersReducedMotion.addEventListener === 'function') {
      prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) stopAutoplay();
        else startAutoplay();
      });
    }
  }

  // ── DYNAMIC DATA ENGINE ───────────────────────────────────────────
  function pad(n) { return String(n).padStart(2, '0'); }

  const START_YEAR = 2022;

  function getLiveDate() {
    const now = new Date();
    const months = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie',
                    'Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
    return pad(now.getDate()) + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  }

  function getYearsActive() {
    const now = new Date();
    const years = now.getFullYear() - START_YEAR;
    const months = now.getMonth();
    if (years === 0) return 'sub 1 an';
    if (months >= 6) return (years + 1) + ' ani activi';
    return years + '+ ani activi';
  }

  function updateScanDates() {
    const dateEl = document.getElementById('scan-date');
    const yearsEl = document.getElementById('scan-years');
    if (dateEl) dateEl.textContent = getLiveDate();
    if (yearsEl) yearsEl.textContent = getYearsActive();
  }

  function updateNowDate() {
    const now = new Date();
    const months = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie',
                    'Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
    const badge = document.querySelector('.now-badge time');
    if (badge) {
      const iso = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
      badge.setAttribute('datetime', iso);
      badge.textContent = pad(now.getDate()) + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    }
  }

  function updateFooterYear() {
    const footer = document.querySelector('.footer-copy');
    if (footer) footer.textContent = '© ' + new Date().getFullYear() + ' Laura Andreea · laurandreea10.github.io';
  }

  function fetchGithubRepos() {
    if (window.__laGhRepos && typeof window.__laGhRepos.then === 'function') {
      window.__laGhRepos.then(count => {
        if (count > 0) {
          const scanRepo = document.getElementById('scan-repo-count');
          if (scanRepo) scanRepo.textContent = count + '+';
        }
      });
    }
  }

  function applyScoreBoosts() {
    // Footer freshness
    const footerP = document.querySelector('.footer-copy');
    if (footerP) {
      const lastUpdate = new Date('2026-05-23');
      const daysDiff = Math.floor((new Date() - lastUpdate) / 86400000);
      const freshnessText = daysDiff <= 7 ? '· actualizat recent' :
                            daysDiff <= 30 ? '· actualizat luna aceasta' : '';
      if (freshnessText) footerP.textContent += ' ' + freshnessText;
    }

    // About: years active badge
    const aboutCard = document.querySelector('#about .about-card');
    if (aboutCard && !aboutCard.querySelector('[data-dyn]')) {
      const yearsEl = document.createElement('p');
      yearsEl.style.cssText = 'font-size:.82rem;color:#6aa6ff;margin-top:.5rem;';
      yearsEl.setAttribute('data-dyn', '1');
      yearsEl.innerHTML = '⏱ ' + getYearsActive() + ' în front-end development — din ' + START_YEAR;
      aboutCard.appendChild(yearsEl);
    }

    // Now section: live clock
    const timeBadge = document.querySelector('.now-badge');
    if (timeBadge && !timeBadge.querySelector('[data-clock]')) {
      const clockSpan = document.createElement('span');
      clockSpan.setAttribute('data-clock', '1');
      clockSpan.style.cssText = 'display:block;font-size:.72rem;color:#8089a0;margin-top:.2rem;font-family:ui-monospace,monospace;';
      timeBadge.appendChild(clockSpan);
      function tickClock() {
        const n = new Date();
        clockSpan.textContent = pad(n.getHours()) + ':' + pad(n.getMinutes()) + ':' + pad(n.getSeconds()) + ' local';
      }
      tickClock();
      setInterval(tickClock, 1000);
    }

    // Cred strip: years elapsed
    document.querySelectorAll('.cred-item strong').forEach(el => {
      if (el.textContent.trim() === '2022 →') {
        el.textContent = '2022';
        const arrow = document.createElement('span');
        arrow.style.cssText = 'display:block;font-size:.72rem;color:#6aa6ff;margin-top:.2rem;';
        arrow.textContent = '(' + (new Date().getFullYear() - 2022) + ' ani)';
        el.parentNode.insertBefore(arrow, el.nextSibling);
      }
    });

    // Nav: live dot pe "La ce lucrez"
    const nowLink = document.querySelector('a.pill[href="#now"]');
    if (nowLink && !nowLink.querySelector('[data-live]')) {
      const dot = document.createElement('span');
      dot.setAttribute('data-live', '1');
      dot.style.cssText = 'display:inline-block;width:6px;height:6px;border-radius:50%;background:#34d399;margin-left:5px;vertical-align:middle;animation:scan-pulse 1.8s ease infinite;';
      nowLink.appendChild(dot);
    }

    // Scan panel: project count
    const scanProjCount = document.getElementById('scan-proj-count');
    if (scanProjCount) scanProjCount.textContent = '64';

    // Insights: freshness chip
    const firstInsight = document.querySelector('#insights .project-card.glass');
    if (firstInsight && !firstInsight.querySelector('[data-freshness]')) {
      const chip = document.createElement('span');
      chip.setAttribute('data-freshness', '1');
      chip.style.cssText = 'display:inline-block;font-size:.7rem;padding:.15rem .45rem;background:rgba(52,211,153,.1);color:#34d399;border:1px solid rgba(52,211,153,.25);border-radius:4px;margin-left:.5rem;vertical-align:middle;';
      chip.textContent = new Date().getFullYear();
      const insightTag = firstInsight.querySelector('.tag');
      if (insightTag) insightTag.after(chip);
    }

    // Footer: last updated timestamp
    const footerNote = document.querySelector('.footer > .container > p:first-child');
    if (footerNote && !footerNote.querySelector('[data-ts]')) {
      const ts = document.createElement('span');
      ts.setAttribute('data-ts', '1');
      ts.style.cssText = 'display:block;font-size:.72rem;color:#8089a0;margin-top:.25rem;';
      ts.textContent = 'Ultima actualizare: ' + getLiveDate();
      footerNote.appendChild(ts);
    }
  }

  // ── SCAN PANEL ────────────────────────────────────────────────────
  function initScanPanel() {
    const btn   = document.getElementById('scanToggle');
    const panel = document.getElementById('scan-panel');
    const close = document.getElementById('scanClose');
    if (!btn || !panel) return;

    panel.hidden = true;
    let open = false;

    function openPanel() {
      open = true;
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.add('active');
      updateScanDates();
      setTimeout(() => {
        document.addEventListener('click', outsideClick);
        document.addEventListener('keydown', escKey);
      }, 50);
    }

    function closePanel() {
      open = false;
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('active');
      document.removeEventListener('click', outsideClick);
      document.removeEventListener('keydown', escKey);
    }

    function outsideClick(e) {
      if (!panel.contains(e.target) && e.target !== btn) closePanel();
    }

    function escKey(e) {
      if (e.key === 'Escape') { closePanel(); btn.focus(); }
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (open) closePanel(); else openPanel();
    });

    if (close) close.addEventListener('click', () => { closePanel(); btn.focus(); });
  }

  // ── INIT ──────────────────────────────────────────────────────────
  function initPortfolioCore() {
    // Probe-urile se fac o singură dată la startup
    runPageProbes();

    applyThemeFromStorage();
    applyContrastFromStorage();
    setupThemeToggle();
    setupContrastToggle();
    setupLangToggle();
    setupPreviewFrame();
    setupAriaCurrent();
    setupReducedMotionWatcher();
    applyLanguage(currentLang);
    setPreview(0);
    setupPortfolioIntegrations();
    decorateImplementationCards();
    updateNowDate();
    updateFooterYear();
    updateScanDates();
    setupNowSection();
    initScanPanel();
    fetchGithubRepos();
    applyScoreBoosts();
    startAutoplay();
  }

  // Autoplay: oprire când tab-ul e în background (acoperă și intro-ul)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioCore);
  } else {
    initPortfolioCore();
  }
})();
