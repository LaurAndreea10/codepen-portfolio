(() => {
  'use strict';

  const STORAGE_KEYS = {
    theme: 'portfolio-theme',
    contrast: 'portfolio-contrast',
    lang: 'portfolio-lang'
  };

  const CODEPEN_COUNT = '66';

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
      statusEditHint: 'Implementation status updated automatically from main.js.',
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

  function getNowDatetime() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function getNowLabel(lang) {
    const now = new Date();
    const monthsRo = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
    const monthsEn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    if (lang === 'en') return `${monthsEn[now.getMonth()]} ${String(now.getDate()).padStart(2,'0')}, ${now.getFullYear()}`;
    return `${String(now.getDate()).padStart(2,'0')} ${monthsRo[now.getMonth()]} ${now.getFullYear()}`;
  }

  const shippedRo = [
    { title: '🌊🏄🌊 SURF RUN', body: 'joc arcade surf finalizat și publicat pe GitHub Pages. Experiență mobile-first, valuri dinamice, moduri de joc, sunet și efecte de stropi.', tag: 'Iun 2026', link: { href: 'https://laurandreea10.github.io/SURF-RUN/', label: 'Deschide SURF RUN' } },
    { title: 'PulseBoard', body: 'roadmap finalizat: detectare anomalii cu sezonalitate, conectori Stripe/Shopify, briefing automat și export PDF/PNG.', tag: 'Mai 2026', link: { href: 'https://laurandreea10.github.io/PulseBoard/', label: 'Deschide PulseBoard' }, secondaryLink: { href: 'https://github.com/LaurAndreea10/PulseBoard', label: 'Repo GitHub' } },
    { title: 'Career Toolkit', body: 'suită de instrumente pentru pregătirea carierei livrată: CV builder, cover letter generator, job tracker și interview prep.', tag: 'Mai 2026', link: { href: 'https://laurandreea10.github.io/Career-Toolkit/', label: 'Deschide Career Toolkit' } },
    { title: 'ClientOps Suite Premium — Demo live', body: 'demo live livrat pentru suita CRM cu fluxuri operaționale avansate. Repo public disponibil.', tag: 'Mai 2026', link: { href: 'https://github.com/LaurAndreea10/clientops-suite-app-premium', label: 'Repo GitHub' } },
    { title: 'Lead Magnet Landing', body: 'landing page modular livrat: hero hook, proof, email gate, thank-you flow și structură reutilizabilă pentru campanii.', tag: 'Mai 2026' },
    { title: 'Excel Quest V2', body: 'aplicația gamificată extinsă cu progres salvat, lecții structurate, certificate preview și flow „continuă de unde ai rămas”.', tag: 'Mai 2026', link: { href: 'https://laurandreea10.github.io/Excel-Quest/', label: 'Deschide Excel Quest' } },
    { title: 'Portfolio Polish / Accessibility Pass', body: 'contrast, skip links, focus states, mobile UX și microcopy bilingv RO/EN livrate.', tag: 'Mai 2026' },
    { title: 'Open-source contribution', body: 'PR livrat: fix forwarded refs în componente React, cu test și reproducere.', tag: 'Mai 2026' },
    { title: 'Marketing OS — suită unificată', body: 'CampaignPilot, ROI Calculator, Brief Generator și Lead Magnet Landing unificate.', tag: 'Mai 2026', link: { href: 'tools/marketing-os.html', label: 'Deschide Marketing OS' } },
    { title: 'LearnFlow Accessible', body: 'aplicație educațională accesibilă, cu navigare clară, UX incluziv și structură mobile-friendly.', tag: 'Mai 2026', link: { href: 'https://laurandreea10.github.io/learnflow-accessible/', label: 'Deschide LearnFlow' } },
    { title: 'CV Scout', body: 'aplicație de analiză CV cu scoring automat, feedback structurat și recomandări de îmbunătățire.', tag: 'Mai 2026', link: { href: 'https://laurandreea10.github.io/cv-scout', label: 'Deschide CV Scout' }, secondaryLink: { href: 'https://github.com/LaurAndreea10/CV-SCOUT', label: 'Repo GitHub' } },
    { title: 'Link Video Editor Studio — Automation Pack Export', body: 'generare automată timeline din brief și export JSON structurat pentru handoff video.', tag: 'Mai 2026', link: { href: 'tools/link-video-automation-pack.html', label: 'Deschide Automation Pack' } },
    { title: 'Alpis Fusion CRM Premium — Case Study & Decision Log', body: 'studiu de caz extins cu decision log, alegeri de produs și trade-off-uri UX.', tag: 'Mai 2026', link: { href: 'projects/alpis-fusion-case-study.html', label: 'Deschide case study' } },
    { title: 'Brief Studio', body: 'platformă SaaS bilingvă RO/EN cu Brief Generator, Mood Board și Market Lens.', tag: 'Apr 2026' },
    { title: 'CampaignPilot', body: 'workspace unificat pentru planificarea campaniilor: KPI overview, funnel, budget allocation și content calendar.', tag: 'Apr 2026' }
  ];

  const shippedEn = [
    { title: '🌊🏄🌊 SURF RUN', body: 'arcade surf game shipped and published on GitHub Pages. Mobile-first experience with dynamic waves, game modes, sound and splash effects.', tag: 'Jun 2026', link: { href: 'https://laurandreea10.github.io/SURF-RUN/', label: 'Open SURF RUN' } },
    { title: 'PulseBoard', body: 'roadmap shipped: seasonality, Stripe/Shopify connectors, scheduled briefing and PDF/PNG export.', tag: 'May 2026', link: { href: 'https://laurandreea10.github.io/PulseBoard/', label: 'Open PulseBoard' }, secondaryLink: { href: 'https://github.com/LaurAndreea10/PulseBoard', label: 'GitHub repo' } },
    { title: 'Career Toolkit', body: 'career preparation suite shipped: CV builder, cover letter generator, job tracker and interview prep.', tag: 'May 2026', link: { href: 'https://laurandreea10.github.io/Career-Toolkit/', label: 'Open Career Toolkit' } },
    { title: 'ClientOps Suite Premium — Live demo', body: 'live demo shipped for the CRM suite with advanced operational flows. Public repo available.', tag: 'May 2026', link: { href: 'https://github.com/LaurAndreea10/clientops-suite-app-premium', label: 'GitHub repo' } },
    { title: 'Lead Magnet Landing', body: 'modular landing page shipped: hero hook, proof, email gate, thank-you flow and reusable campaign structure.', tag: 'May 2026' },
    { title: 'Excel Quest V2', body: 'gamified app expanded with saved progress, structured lessons and continue-where-you-left-off flow.', tag: 'May 2026', link: { href: 'https://laurandreea10.github.io/Excel-Quest/', label: 'Open Excel Quest' } },
    { title: 'Portfolio Polish / Accessibility Pass', body: 'contrast, skip links, focus states, mobile UX and bilingual RO/EN microcopy shipped.', tag: 'May 2026' },
    { title: 'Open-source contribution', body: 'PR shipped: fix for forwarded refs in React components, with test and reproduction case.', tag: 'May 2026' },
    { title: 'Marketing OS — unified suite', body: 'CampaignPilot, ROI Calculator, Brief Generator and Lead Magnet Landing unified.', tag: 'May 2026', link: { href: 'tools/marketing-os.html', label: 'Open Marketing OS' } },
    { title: 'LearnFlow Accessible', body: 'accessible learning app focused on clear navigation, inclusive UX and mobile-friendly structure.', tag: 'May 2026', link: { href: 'https://laurandreea10.github.io/learnflow-accessible/', label: 'Open LearnFlow' } },
    { title: 'CV Scout', body: 'CV analysis app with automatic scoring, structured feedback and improvement recommendations.', tag: 'May 2026', link: { href: 'https://laurandreea10.github.io/cv-scout', label: 'Open CV Scout' }, secondaryLink: { href: 'https://github.com/LaurAndreea10/CV-SCOUT', label: 'GitHub repo' } },
    { title: 'Link Video Editor Studio — Automation Pack Export', body: 'auto-generate a timeline from a brief and structured JSON export for video handoff.', tag: 'May 2026', link: { href: 'tools/link-video-automation-pack.html', label: 'Open Automation Pack' } },
    { title: 'Alpis Fusion CRM Premium — Case Study & Decision Log', body: 'extended case study with decision log, product choices and UX trade-offs.', tag: 'May 2026', link: { href: 'projects/alpis-fusion-case-study.html', label: 'Open case study' } },
    { title: 'Brief Studio', body: 'bilingual RO/EN SaaS platform with Brief Generator, Mood Board and Market Lens.', tag: 'Apr 2026' },
    { title: 'CampaignPilot', body: 'unified workspace for campaign planning: KPI overview, funnel, budget allocation and content calendar.', tag: 'Apr 2026' }
  ];

  const nowContent = {
    ro: {
      get datetime() { return getNowDatetime(); },
      get label() { return getNowLabel('ro'); },
      tabs: { active: '🔄 În curs', done: '✅ Finalizat recent', history: '📅 Istoric' },
      active: [
        { title: 'Portfolio v2 — case studies & proof-of-work', body: 'rescriu portofoliul ca o colecție de studii de caz scurte: problemă, decizie UX, implementare, rezultat și link live.', tag: 'Iun 2026', link: { href: 'alpis-fusion-crm.html', label: 'Vezi case study' } },
        { title: 'CRM & Dashboard UX polish', body: 'îmbunătățesc proiectele CRM cu statusuri mai clare, microcopy, empty states, focus states și flow-uri mai ușor de urmărit.', tag: 'În lucru' },
        { title: 'GitHub repo cleanup', body: 'actualizez README-uri, descrieri, demo links și structura repo-urilor pentru ca proiectele live să fie mai ușor de înțeles și verificat.', tag: 'În lucru', link: { href: 'https://github.com/LaurAndreea10', label: 'Vezi GitHub' } },
        { title: 'Accessibility pass', body: 'verific contrastul, navigarea din tastatură, stările de focus și experiența mobile pentru proiectele principale.', tag: 'UX' }
      ],
      done: shippedRo,
      history: [
        { label: 'Săpt. 2 Iunie 2026', items: ['SURF RUN — adăugat la Finalizat recent cu link GitHub Pages', 'Portofoliu — număr CodePen actualizat la 66 proiecte live'] },
        { label: 'Săpt. 31 Mai 2026', items: ['PulseBoard — roadmap finalizat', 'Career Toolkit — suită carieră livrată cu deploy live', 'ClientOps Suite Premium — demo live livrat', 'Excel Quest V2 — UX reluare + dashboard progres livrate'] }
      ],
      note: 'Actualizat manual ca secțiune de tip now page — arată ce prioritizez activ, nu doar ce am construit.'
    },
    en: {
      get datetime() { return getNowDatetime(); },
      get label() { return getNowLabel('en'); },
      tabs: { active: '🔄 In progress', done: '✅ Recently shipped', history: '📅 History' },
      active: [
        { title: 'Portfolio v2 — case studies & proof-of-work', body: 'I am turning the portfolio into a clearer proof-of-work collection: problem, UX decision, implementation, outcome and live link.', tag: 'Jun 2026', link: { href: 'alpis-fusion-crm.html', label: 'View case study' } },
        { title: 'CRM & Dashboard UX polish', body: 'I am improving CRM projects with clearer statuses, better microcopy, empty states, focus states and easier-to-follow user flows.', tag: 'In progress' },
        { title: 'GitHub repo cleanup', body: 'I am updating README files, descriptions, demo links and repository structure so the live projects are easier to understand and verify.', tag: 'In progress', link: { href: 'https://github.com/LaurAndreea10', label: 'View GitHub' } },
        { title: 'Accessibility pass', body: 'I am checking contrast, keyboard navigation, focus states and mobile experience across the main projects.', tag: 'UX' }
      ],
      done: shippedEn,
      history: [
        { label: 'Week of June 2, 2026', items: ['SURF RUN — added to Recently shipped with GitHub Pages link', 'Portfolio — CodePen count updated to 66 live projects'] },
        { label: 'Week of May 31, 2026', items: ['PulseBoard — roadmap shipped', 'Career Toolkit — career suite shipped with live deploy', 'ClientOps Suite Premium — live demo shipped', 'Excel Quest V2 — resume UX + progress dashboard shipped'] }
      ],
      note: 'Updated manually as a now-page style section — it shows what I actively prioritize, not just what I have built.'
    }
  };

  const previewSlides = [
    { title: 'PulseBoard', label: 'AI dashboard', description: { ro: 'Dashboard de venituri & operațiuni cu import CSV/Google Sheet, anomalii și briefing executiv.', en: 'Revenue & ops dashboard with CSV/Google Sheet import, anomalies and executive briefing.' }, meta: 'Dashboard · AI fallback · GitHub Pages', frameUrl: 'https://laurandreea10.github.io/PulseBoard/', primaryUrl: 'projects/pulseboard.html', secondaryUrl: 'https://github.com/LaurAndreea10/PulseBoard', codeUrl: 'https://laurandreea10.github.io/PulseBoard/' },
    { title: 'Alpis Fusion CRM Premium', label: 'CRM premium', description: { ro: 'Colecție modulară pentru lead pipeline, task management, billing și automatizări.', en: 'Modular collection for lead pipeline, task management, billing and automations.' }, meta: 'Vite + React · build optimizat · Deploy automatizat', frameUrl: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/', primaryUrl: 'alpis-fusion-crm.html', secondaryUrl: 'https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium', codeUrl: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/' },
    { title: 'ClientFlow SaaS CRM', label: 'SaaS CRM', description: { ro: 'Sistem CRM orientat pe task-uri, automatizări și acțiuni operaționale zilnice.', en: 'CRM system focused on tasks, automations and daily operational actions.' }, meta: 'Kanban + triage · Shortcuts · Prioritizare vizuală', frameUrl: 'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/', primaryUrl: 'projects/clientflow.html', secondaryUrl: 'https://github.com/LaurAndreea10/ClientFlow-PRO', codeUrl: 'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/' },
    { title: 'Link Video Editor Studio', label: 'Video studio', description: { ro: 'Studio pentru workflow video, navigare rapidă și Automation Pack export.', en: 'Studio for video workflow, quick navigation and Automation Pack export.' }, meta: 'HTML · CSS · JavaScript · Automation Pack', frameUrl: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/', primaryUrl: 'tools/link-video-automation-pack.html', secondaryUrl: 'https://github.com/LaurAndreea10/Link-Video-Editor-Studio', codeUrl: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/' }
  ];

  const cardStatusContent = { 'PulseBoard': 'progress', 'LearnFlow Accessible': 'implemented', 'Excel-Quest': 'implemented', 'BASKET VS AI': 'implemented', 'Link Video Editor Studio': 'implemented', 'CampaignPilot': 'implemented', 'Campaign ROI Calculator': 'implemented', 'Marketing OS': 'implemented', 'Marketing-Tech Templates': 'implemented', 'Lighthouse CI Audit Guide': 'implemented', 'Lead Magnet Landing': 'roadmap', 'Alpis Fusion CRM Premium': 'implemented', 'Brief Studio': 'implemented', 'ClientOps Suite Premium': 'progress', 'ClientFlow SaaS CRM': 'implemented', 'ClientOps': 'implemented', 'ClientFlow': 'implemented', 'ARCADE WORLD': 'implemented', 'Coaching AI': 'progress', '🌊🏄🌊 SURF RUN': 'implemented', 'SURF RUN': 'implemented' };

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

  function pad(n) { return String(n).padStart(2, '0'); }

  function getLiveDate() {
    const now = new Date();
    const months = currentLang === 'ro'
      ? ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie']
      : ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return currentLang === 'ro'
      ? `${pad(now.getDate())} ${months[now.getMonth()]} ${now.getFullYear()}`
      : `${months[now.getMonth()]} ${pad(now.getDate())}, ${now.getFullYear()}`;
  }

  function syncThemeButton() {
    if (!els.themeToggle) return;
    const isLight = els.body.classList.contains('light');
    els.themeToggle.textContent = isLight ? translations[currentLang].themeDark : translations[currentLang].themeLight;
    els.themeToggle.setAttribute('aria-label', currentLang === 'ro' ? 'Schimbă tema vizuală' : 'Change visual theme');
  }
  function applyThemeFromStorage() { els.body.classList.toggle('light', localStorage.getItem(STORAGE_KEYS.theme) === 'light'); syncThemeButton(); }
  function applyContrastFromStorage() {
    const isHigh = localStorage.getItem(STORAGE_KEYS.contrast) === 'high';
    els.body.classList.toggle('high-contrast', isHigh);
    if (els.contrastToggle) {
      els.contrastToggle.setAttribute('aria-pressed', String(isHigh));
      els.contrastToggle.textContent = isHigh ? translations[currentLang].contrastOn : translations[currentLang].contrastOff;
    }
  }

  function showPreviewFallback(show) {
    if (!els.heroPreviewFallback || !els.heroPreviewHint || !els.heroPreviewFrame) return;
    els.heroPreviewFallback.style.opacity = show ? '1' : '0';
    els.heroPreviewHint.style.opacity = show ? '1' : '0';
    els.heroPreviewFrame.style.opacity = show ? '0' : '1';
  }

  function renderPreviewChips() {
    if (!els.heroPreviewLinks) return;
    els.heroPreviewLinks.innerHTML = '';
    previewSlides.forEach((slide, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (index === previewIndex ? ' active' : '');
      btn.textContent = slide.title;
      btn.setAttribute('aria-pressed', String(index === previewIndex));
      btn.addEventListener('click', () => { setPreview(index); restartAutoplay(); });
      els.heroPreviewLinks.appendChild(btn);
    });
  }

  function setPreview(index) {
    previewIndex = (index + previewSlides.length) % previewSlides.length;
    const slide = previewSlides[previewIndex];
    if (els.heroPreviewTitle) els.heroPreviewTitle.textContent = slide.title;
    if (els.heroPreviewHeading) els.heroPreviewHeading.textContent = slide.title;
    if (els.heroPreviewMeta) els.heroPreviewMeta.textContent = slide.meta;
    if (els.heroPreviewDescription) els.heroPreviewDescription.textContent = slide.description[currentLang];
    if (els.heroPreviewType) els.heroPreviewType.textContent = slide.label;
    if (els.heroPreviewUrl) { els.heroPreviewUrl.href = slide.secondaryUrl; els.heroPreviewUrl.textContent = slide.secondaryUrl.replace(/^https?:\/\//, ''); }
    if (els.heroPreviewOpen) { els.heroPreviewOpen.href = slide.primaryUrl; els.heroPreviewOpen.textContent = translations[currentLang].previewCaseStudy; }
    if (els.heroPreviewOpenSecondary) { els.heroPreviewOpenSecondary.href = slide.secondaryUrl; els.heroPreviewOpenSecondary.textContent = translations[currentLang].previewOpen; }
    if (els.heroPreviewCode) { els.heroPreviewCode.href = slide.codeUrl; els.heroPreviewCode.textContent = translations[currentLang].previewCode; }
    if (els.heroPreviewFrame) { showPreviewFallback(true); els.heroPreviewFrame.src = slide.frameUrl; }
    renderPreviewChips();
  }

  function normalizeImplementationState(value) {
    if (!value) return null;
    const normalized = String(value).trim().toLowerCase();
    if (['implemented','implementat','done','live'].includes(normalized)) return 'implemented';
    if (['progress','in-progress','in_progress','dev','draft','wip','dezvoltare'].includes(normalized)) return 'progress';
    if (['roadmap','soon','planned','planificat'].includes(normalized)) return 'roadmap';
    return null;
  }
  function getCardTitle(card) { const titleEl = card.querySelector('h3'); return titleEl ? titleEl.textContent.trim() : ''; }
  function getImplementationLabel(state) { const copy = translations[currentLang]; return state === 'implemented' ? copy.implementationImplemented : state === 'roadmap' ? copy.implementationRoadmap : copy.implementationProgress; }
  function decorateImplementationCards() {
    [...document.querySelectorAll('.projects-grid .project-card')].forEach(card => {
      const explicitState = normalizeImplementationState(card.dataset.status || card.dataset.implementation);
      const titleState = normalizeImplementationState(cardStatusContent[getCardTitle(card)]);
      const state = explicitState || titleState || (card.classList.contains('project-card-soon') ? 'roadmap' : 'implemented');
      card.dataset.implementation = state;
      card.title = translations[currentLang].statusEditHint;
      let badge = card.querySelector('.implementation-badge');
      if (!badge) { badge = document.createElement('span'); badge.className = 'implementation-badge'; badge.setAttribute('aria-label', currentLang === 'ro' ? 'Stare implementare' : 'Implementation status'); card.appendChild(badge); }
      badge.textContent = getImplementationLabel(state);
    });
  }

  function buildNowItem(entry, done) {
    const li = document.createElement('li');
    li.className = 'now-item ' + (done ? 'now-item-done' : 'now-item-active');
    const status = document.createElement('span');
    status.className = 'now-status';
    status.setAttribute('aria-label', done ? (currentLang === 'ro' ? 'Finalizat' : 'Done') : (currentLang === 'ro' ? 'În lucru' : 'In progress'));
    status.textContent = done ? '✅' : '🔄';
    const div = document.createElement('div');
    const strong = document.createElement('strong');
    if (entry.link) {
      const a = document.createElement('a'); a.className = 'now-item-link'; a.href = entry.link.href;
      if (entry.link.href.startsWith('http')) a.target = '_blank', a.rel = 'noopener noreferrer';
      a.textContent = entry.title; strong.appendChild(a);
    } else strong.textContent = entry.title;
    div.appendChild(strong);
    div.appendChild(document.createTextNode(' — ' + entry.body + ' '));
    if (entry.tag) { const tag = document.createElement('span'); tag.className = 'now-tag' + (done ? ' now-tag-done' : ''); tag.textContent = entry.tag; div.appendChild(tag); }
    [entry.link, entry.secondaryLink].forEach(linkObj => {
      if (!linkObj) return;
      const action = document.createElement('a'); action.className = 'now-tag now-link-action'; action.href = linkObj.href; action.textContent = linkObj.label; action.setAttribute('aria-label', linkObj.label);
      if (linkObj.href.startsWith('http')) action.target = '_blank', action.rel = 'noopener noreferrer';
      div.appendChild(document.createTextNode(' ')); div.appendChild(action);
    });
    li.appendChild(status); li.appendChild(div); return li;
  }

  function setupNowTabs() {
    if (!els.nowSection || els.nowSection.dataset.tabsReady) return;
    els.nowSection.dataset.tabsReady = 'true';
    const tabs = [...els.nowSection.querySelectorAll('.now-tab')];
    const panels = els.nowSection.querySelectorAll('.now-panel');
    function activateTab(tab) {
      const target = tab.getAttribute('aria-controls');
      tabs.forEach(t => { t.classList.remove('now-tab-active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.add('now-panel-hidden'));
      tab.classList.add('now-tab-active'); tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(target); if (panel) panel.classList.remove('now-panel-hidden');
    }
    tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));
    const tablist = els.nowSection.querySelector('.now-tabs');
    if (tablist) {
      tablist.addEventListener('keydown', event => {
        const index = tabs.indexOf(document.activeElement);
        if (index === -1) return;
        let nextIndex = null;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
      });
    }
  }

  function setupNowSection() {
    if (!els.nowSection) return;
    const copy = nowContent[currentLang] || nowContent.ro;
    const t = translations[currentLang];
    const eyebrow = els.nowSection.querySelector('.eyebrow');
    const title = els.nowSection.querySelector('.now-title');
    const badge = els.nowSection.querySelector('.now-badge');
    const note = els.nowSection.querySelector('.now-note');
    if (eyebrow) eyebrow.textContent = t.nowLabel;
    if (title) title.textContent = t.nowTitle;
    if (badge) badge.innerHTML = `${t.nowUpdatedPrefix} <time datetime="${copy.datetime}">${copy.label}</time>`;
    if (note) note.innerHTML = copy.note;
    const tabA = els.nowSection.querySelector('#now-tab-active'), tabD = els.nowSection.querySelector('#now-tab-done'), tabH = els.nowSection.querySelector('#now-tab-history');
    if (tabA) tabA.textContent = copy.tabs.active; if (tabD) tabD.textContent = copy.tabs.done; if (tabH) tabH.textContent = copy.tabs.history;
    const activePanel = els.nowSection.querySelector('#now-panel-active .now-checklist');
    if (activePanel) { activePanel.innerHTML = ''; copy.active.forEach(entry => activePanel.appendChild(buildNowItem(entry, false))); }
    const donePanel = els.nowSection.querySelector('#now-panel-done .now-checklist');
    if (donePanel) { donePanel.innerHTML = ''; copy.done.forEach(entry => donePanel.appendChild(buildNowItem(entry, true))); }
    const historyPanel = els.nowSection.querySelector('#now-panel-history .now-history');
    if (historyPanel) {
      historyPanel.innerHTML = '';
      copy.history.forEach(week => {
        const wrap = document.createElement('div'); wrap.className = 'now-history-week';
        const label = document.createElement('span'); label.className = 'now-history-label'; label.textContent = week.label;
        const ul = document.createElement('ul'); week.items.forEach(text => { const li = document.createElement('li'); li.textContent = text.replace(/64/g, CODEPEN_COUNT); ul.appendChild(li); });
        wrap.appendChild(label); wrap.appendChild(ul); historyPanel.appendChild(wrap);
      });
    }
    setupNowTabs();
  }

  function fixPulseBoardLinks() {
    const pulseCard = [...document.querySelectorAll('.project-card')].find(card => getCardTitle(card) === 'PulseBoard');
    if (!pulseCard) return;
    pulseCard.dataset.implementation = 'progress';
    pulseCard.querySelectorAll('a[href]').forEach(link => {
      const text = link.textContent.trim().toLowerCase();
      if (text.includes('live')) link.href = 'https://laurandreea10.github.io/PulseBoard/';
      if (text.includes('github')) link.href = 'https://github.com/LaurAndreea10/PulseBoard';
    });
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
    syncThemeButton(); applyContrastFromStorage(); setPreview(previewIndex); setupNowSection(); decorateImplementationCards();
    updateScanDates();
    applyCodePenCount();
  }

  function setupThemeToggle() { if (!els.themeToggle) return; els.themeToggle.addEventListener('click', () => { const isLight = els.body.classList.toggle('light'); localStorage.setItem(STORAGE_KEYS.theme, isLight ? 'light' : 'dark'); syncThemeButton(); }); }
  function setupContrastToggle() { if (!els.contrastToggle) return; els.contrastToggle.addEventListener('click', () => { const isHigh = els.body.classList.toggle('high-contrast'); localStorage.setItem(STORAGE_KEYS.contrast, isHigh ? 'high' : 'normal'); applyContrastFromStorage(); }); }
  function setupLangToggle() { if (!els.langToggle) return; els.langToggle.addEventListener('click', () => applyLanguage(currentLang === 'ro' ? 'en' : 'ro')); }
  function setupPreviewFrame() { if (!els.heroPreviewFrame) return; els.heroPreviewFrame.addEventListener('load', () => showPreviewFallback(false)); els.heroPreviewFrame.addEventListener('error', () => showPreviewFallback(true)); els.heroPreviewFrame.addEventListener('mouseenter', stopAutoplay); els.heroPreviewFrame.addEventListener('mouseleave', startAutoplay); }
  function setupAriaCurrent() { if (!('IntersectionObserver' in window) || !els.sections.length || !els.navLinks.length) return; const observer = new IntersectionObserver(entries => { const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio); if (!visible.length) return; const currentId = `#${visible[0].target.id}`; els.navLinks.forEach(link => link.getAttribute('href') === currentId ? link.setAttribute('aria-current','true') : link.removeAttribute('aria-current')); }, { rootMargin: '-20% 0px -60% 0px', threshold: [0.2,0.35,0.55] }); els.sections.forEach(section => observer.observe(section)); }
  function startAutoplay() { if (prefersReducedMotion.matches || previewSlides.length < 2) return; stopAutoplay(); autoplayId = window.setInterval(() => setPreview(previewIndex + 1), 5000); }
  function stopAutoplay() { if (autoplayId) { window.clearInterval(autoplayId); autoplayId = null; } }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }
  function setupReducedMotionWatcher() { if (typeof prefersReducedMotion.addEventListener === 'function') prefersReducedMotion.addEventListener('change', () => prefersReducedMotion.matches ? stopAutoplay() : startAutoplay()); }
  function updateFooterYear() { const footer = document.querySelector('.footer-copy'); if (footer) footer.textContent = '© ' + new Date().getFullYear() + ' Laura Andreea · laurandreea10.github.io'; }

  function updateScanDates() {
    const liveDate = getLiveDate();
    const yearsActive = (new Date().getFullYear() - 2022) + (currentLang === 'ro' ? '+ ani activi' : '+ active years');
    document.querySelectorAll('[id="scan-date"]').forEach(el => { el.textContent = liveDate; });
    document.querySelectorAll('[id="scan-years"]').forEach(el => { el.textContent = yearsActive; });
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

  function forceIntroCodePenCounter() {
    const existing = document.getElementById('la-force-codepen-count-css');
    if (existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'la-force-codepen-count-css';
    style.textContent = `
      #intro-overlay .s3 .num1 { animation: none !important; counter-reset: c1 ${CODEPEN_COUNT} !important; }
      #intro-overlay .s3 .num1::before { content: "${CODEPEN_COUNT}" !important; }
    `;
    document.head.appendChild(style);
  }

  function applyCodePenCount() {
    forceIntroCodePenCounter();
    document.querySelectorAll('#scan-proj-count').forEach(el => { el.textContent = CODEPEN_COUNT; });
    document.querySelectorAll('[aria-label]').forEach(el => {
      const aria = el.getAttribute('aria-label');
      if (aria && (aria.includes('CodePen') || aria.includes('proiecte live'))) el.setAttribute('aria-label', aria.replace(/64/g, CODEPEN_COUNT));
    });
    document.querySelectorAll('strong, h4, p, span, a, li, .pow-metric').forEach(el => {
      if (!el.childElementCount && el.textContent && (el.textContent.includes('64 proiecte') || el.textContent.includes('64 live') || el.textContent.includes('CodePen · 64') || el.textContent === '64')) {
        el.textContent = el.textContent.replace(/64/g, CODEPEN_COUNT);
      }
    });
    document.querySelectorAll('.cred-item, .pow-card, .footer-actions a, .contact-actions a').forEach(block => {
      if ((block.textContent || '').includes('64')) {
        block.querySelectorAll('*').forEach(el => {
          if (!el.childElementCount && el.textContent) el.textContent = el.textContent.replace(/64/g, CODEPEN_COUNT);
        });
      }
    });
  }

  function applyAccessibilityAuditFixes() {
    if (!document.getElementById('accessibility-audit-fixes')) {
      const style = document.createElement('style');
      style.id = 'accessibility-audit-fixes';
      style.textContent = `
        .card-lang,
        .thumbSubtitle,
        .badge-new,
        .badge-github,
        .now-tag,
        .scan-eyebrow,
        .scan-meta,
        .chip[style*="uppercase"],
        .chip.is-uppercase {
          font-size: .78rem !important;
        }
        .search-wrap:focus-within {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        .search-wrap input:focus {
          outline: none;
        }
        [tabindex="0"]:focus-visible,
        .lead-card:focus-visible,
        .kanban-card:focus-visible,
        .task-row:focus-visible {
          outline: 2px solid var(--accent, #4f8cff);
          outline-offset: 3px;
          border-radius: inherit;
        }
        :focus:not(:focus-visible) {
          outline: none;
        }
      `;
      document.head.appendChild(style);
    }

    const replay = document.getElementById('replay');
    if (replay) {
      replay.type = 'button';
      if (!replay.getAttribute('aria-label')) replay.setAttribute('aria-label', 'Reîncepere intro cinematografic');
    }

    const scanPanel = document.getElementById('scan-panel');
    if (scanPanel) {
      scanPanel.setAttribute('role', 'dialog');
      scanPanel.setAttribute('aria-modal', 'true');
      if (!scanPanel.getAttribute('aria-label') && !scanPanel.getAttribute('aria-labelledby')) {
        scanPanel.setAttribute('aria-label', 'Rezumat portofoliu 30 de secunde');
      }
    }
  }

  function applyScoreBoosts() {
    applyCodePenCount();
    const nowLink = document.querySelector('a.pill[href="#now"]');
    if (nowLink && !nowLink.querySelector('[data-live]')) {
      const dot = document.createElement('span');
      dot.setAttribute('data-live','1');
      dot.style.cssText = 'display:inline-block;width:6px;height:6px;border-radius:50%;background:#34d399;margin-left:5px;vertical-align:middle;animation:scan-pulse 1.8s ease infinite;';
      nowLink.appendChild(dot);
    }
  }

  function initScanPanel() {
    const btn = document.getElementById('scanToggle'), panel = document.getElementById('scan-panel'), close = document.getElementById('scanClose');
    if (!btn || !panel) return;
    panel.hidden = true;
    let open = false;
    let lastFocused = null;
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    function getFocusable() { return [...panel.querySelectorAll(focusableSelector)].filter(el => el.offsetParent !== null || el === document.activeElement); }
    function closePanel(){
      open = false;
      panel.hidden = true;
      btn.setAttribute('aria-expanded','false');
      btn.classList.remove('active');
      (lastFocused && typeof lastFocused.focus === 'function' ? lastFocused : btn).focus();
    }
    function openPanel(){
      lastFocused = document.activeElement;
      open = true;
      panel.hidden = false;
      btn.setAttribute('aria-expanded','true');
      btn.classList.add('active');
      updateScanDates();
      applyCodePenCount();
      const first = getFocusable()[0] || panel;
      if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1');
      window.setTimeout(() => first.focus(), 0);
    }
    btn.addEventListener('click', e => { e.stopPropagation(); open ? closePanel() : openPanel(); });
    if (close) close.addEventListener('click', closePanel);
    panel.addEventListener('keydown', event => {
      if (!open) return;
      if (event.key === 'Escape') { event.preventDefault(); closePanel(); return; }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) { event.preventDefault(); panel.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  function initPortfolioCore() {
    applyThemeFromStorage();
    applyContrastFromStorage();
    setupThemeToggle();
    setupContrastToggle();
    setupLangToggle();
    setupPreviewFrame();
    setupAriaCurrent();
    setupReducedMotionWatcher();
    fixPulseBoardLinks();
    applyAccessibilityAuditFixes();
    applyLanguage(currentLang);
    setPreview(0);
    decorateImplementationCards();
    setupNowSection();
    updateFooterYear();
    updateScanDates();
    initScanPanel();
    fetchGithubRepos();
    applyScoreBoosts();
    startAutoplay();
    window.setTimeout(applyCodePenCount, 0);
    window.setTimeout(applyCodePenCount, 300);
    window.setTimeout(applyCodePenCount, 1200);
  }

  document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPortfolioCore); else initPortfolioCore();
})();