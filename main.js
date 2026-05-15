(() => {
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
      previewCode: 'CodePen →',
      heroPrimary: 'Scrie-mi despre un proiect',
      heroSecondary: 'Deschide Alpis Fusion →',
      implementationImplemented: 'Implementat',
      implementationProgress: 'În dezvoltare',
      implementationRoadmap: 'Roadmap',
      nowEditHint: 'Actualizezi săptămânal doar obiectul nowContent din main.js.',
      statusEditHint: 'Actualizezi statusurile cardurilor doar din obiectul cardStatusContent din main.js.',
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
      previewCode: 'CodePen →',
      heroPrimary: 'Email me about a project',
      heroSecondary: 'Open Alpis Fusion →',
      implementationImplemented: 'Implemented',
      implementationProgress: 'In progress',
      implementationRoadmap: 'Roadmap',
      nowEditHint: 'Update only the nowContent object in main.js each week.',
      statusEditHint: 'Update card statuses only from the cardStatusContent object in main.js.',
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

  const nowContent = {
    ro: {
      datetime: '2026-05',
      label: 'Mai 2026',
      items: [
        'Iterez pe <a href="https://laurandreea10.github.io/Link-Video-Editor-Studio/" target="_blank" rel="noopener noreferrer"><strong>Link Video Editor Studio</strong></a> — adaug Automation Pack export.',
        'Pregătesc un studiu de caz extins pentru <a href="projects/alpis-fusion-crm.html"><strong>Alpis Fusion CRM Premium</strong></a> — decision log cu alegeri de produs și UX.',
        'Fac audit Lighthouse CI pe <a href="./index.html" aria-label="Deschide homepage-ul portofoliului"><strong>portofoliu</strong></a> și extrag CSS-ul non-critic pentru LCP mai bun.',
        'Extind zona <a href="./index.html#marketing-tech"><strong>marketing-tech</strong></a> după <a href="./Campaign%20ROI%20Calculator.html"><strong>Campaign ROI Calculator</strong></a> cu noi template-uri orientate pe conversie și growth workflows.'
      ],
      note: 'Actualizat manual, ca secțiune de tip now page, pentru a arăta clar ce prioritizez în perioada curentă.'
    },
    en: {
      datetime: '2026-05',
      label: 'May 2026',
      items: [
        'Iterating on <a href="https://laurandreea10.github.io/Link-Video-Editor-Studio/" target="_blank" rel="noopener noreferrer"><strong>Link Video Editor Studio</strong></a> — adding Automation Pack export.',
        'Preparing an extended case study for <a href="projects/alpis-fusion-crm.html"><strong>Alpis Fusion CRM Premium</strong></a> — a decision log with product and UX choices.',
        'Running a Lighthouse CI audit on the <a href="./index.html" aria-label="Open the portfolio homepage"><strong>portfolio</strong></a> and extracting non-critical CSS for better LCP.',
        'Expanding the <a href="./index.html#marketing-tech"><strong>marketing-tech</strong></a> area after <a href="./Campaign%20ROI%20Calculator.html"><strong>Campaign ROI Calculator</strong></a> with new conversion-oriented templates and growth workflows.'
      ],
      note: 'Updated manually as a now-page style section to show clearly what I am prioritizing in the current period.'
    }
  };

  const previewSlides = [
    {
      title: 'Alpis Fusion CRM Premium',
      label: 'CRM premium',
      description: {
        ro: 'Colecție modulară pentru lead pipeline, task management, billing și automatizări.',
        en: 'Modular collection for lead pipeline, task management, billing and automations.'
      },
      meta: 'Vite + React · build optimizat · Deploy automatizat',
      frameUrl: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/',
      primaryUrl: 'projects/alpis-fusion-crm.html',
      secondaryUrl: 'https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium',
      codeUrl: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/'
    },
    {
      title: 'ClientFlow SaaS CRM',
      label: 'SaaS CRM',
      description: {
        ro: 'Sistem CRM orientat pe task-uri, automatizări și acțiuni operaționale zilnice.',
        en: 'CRM system focused on tasks, automations and daily operational actions.'
      },
      meta: 'Kanban + triage · Shortcuts · Prioritizare vizuală',
      frameUrl: 'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/',
      primaryUrl: 'projects/clientflow.html',
      secondaryUrl: 'https://github.com/LaurAndreea10/ClientFlow-PRO',
      codeUrl: 'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/'
    },
    {
      title: 'Link Video Editor Studio',
      label: 'Video studio',
      description: {
        ro: 'Studio pentru workflow video, navigare rapidă și prezentare premium.',
        en: 'Studio for video workflow, quick navigation and premium presentation.'
      },
      meta: 'HTML · CSS · JavaScript · GitHub Pages',
      frameUrl: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/',
      primaryUrl: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/',
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

  function applyThemeFromStorage() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme === 'light') els.body.classList.add('light');
    else els.body.classList.remove('light');
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

  function getImplementationLabel(state) {
    const copy = translations[currentLang];
    if (state === 'implemented') return copy.implementationImplemented;
    if (state === 'roadmap') return copy.implementationRoadmap;
    return copy.implementationProgress;
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

  function setupNowSection() {
    if (!els.nowSection) return;
    const copy = nowContent[currentLang] || nowContent.ro;
    const eyebrow = els.nowSection.querySelector('.eyebrow');
    const title = els.nowSection.querySelector('.now-title');
    const badge = els.nowSection.querySelector('.now-badge');
    const time = els.nowSection.querySelector('.now-badge time');
    const list = els.nowSection.querySelector('.now-list');
    const note = els.nowSection.querySelector('.now-note');
    if (eyebrow) eyebrow.textContent = translations[currentLang].nowLabel;
    if (title) title.textContent = translations[currentLang].nowTitle;
    if (badge && time) {
      badge.innerHTML = `${translations[currentLang].nowUpdatedPrefix} <time datetime="${copy.datetime}">${copy.label}</time>`;
      const updatedTime = badge.querySelector('time');
      if (updatedTime) updatedTime.title = translations[currentLang].nowEditHint;
    }
    if (list) {
      list.innerHTML = '';
      copy.items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'now-list-item';
        li.innerHTML = item;
        list.appendChild(li);
      });
    }
    if (note) note.textContent = copy.note;
    let helper = els.nowSection.querySelector('.now-helper');
    if (!helper && note) {
      helper = document.createElement('p');
      helper.className = 'now-helper';
      note.insertAdjacentElement('afterend', helper);
    }
    if (helper) helper.textContent = translations[currentLang].nowEditHint;
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
    decorateImplementationCards();
    setupNowSection();
  }

  function renderPreviewChips() {
    if (!els.heroPreviewLinks) return;
    els.heroPreviewLinks.innerHTML = '';
    previewSlides.forEach((slide, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill chip' + (index === previewIndex ? ' active' : '');
      btn.textContent = slide.title;
      btn.setAttribute('aria-pressed', String(index === previewIndex));
      btn.setAttribute('aria-label', `${currentLang === 'ro' ? 'Selectează preview pentru' : 'Select preview for'} ${slide.title}`);
      btn.addEventListener('click', () => {
        setPreview(index);
        restartAutoplay();
      });
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
      els.heroPreviewOpen.setAttribute('aria-label', `${currentLang === 'ro' ? 'Deschide proiectul' : 'Open project'} ${slide.title}`);
    }
    if (els.heroPreviewOpenSecondary) {
      els.heroPreviewOpenSecondary.href = slide.secondaryUrl;
      els.heroPreviewOpenSecondary.textContent = translations[currentLang].previewOpen;
      els.heroPreviewOpenSecondary.setAttribute('aria-label', `${currentLang === 'ro' ? 'Deschide proiectul' : 'Open project'} ${slide.title}`);
    }
    if (els.heroPreviewCode) {
      els.heroPreviewCode.href = slide.codeUrl;
      els.heroPreviewCode.textContent = translations[currentLang].previewCode;
      els.heroPreviewCode.setAttribute('aria-label', `${currentLang === 'ro' ? 'Deschide demo live pentru' : 'Open live demo for'} ${slide.title}`);
    }
    if (els.heroPreviewFrame) {
      showPreviewFallback(false);
      els.heroPreviewFrame.src = slide.frameUrl;
    }
    renderPreviewChips();
  }

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
    els.langToggle.addEventListener('click', () => {
      applyLanguage(currentLang === 'ro' ? 'en' : 'ro');
    });
  }

  function setupPreviewFrame() {
    if (!els.heroPreviewFrame) return;
    els.heroPreviewFrame.addEventListener('load', () => showPreviewFallback(false));
    els.heroPreviewFrame.addEventListener('error', () => showPreviewFallback(true));
    els.heroPreviewFrame.addEventListener('mouseenter', stopAutoplay);
    els.heroPreviewFrame.addEventListener('mouseleave', startAutoplay);
  }

  function setupAriaCurrent() {
    if (!('IntersectionObserver' in window) || !els.sections.length || !els.navLinks.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
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

  function initPortfolioCore() {
    applyThemeFromStorage();
    applyContrastFromStorage();
    applyLanguage(currentLang);
    setupThemeToggle();
    setupContrastToggle();
    setupLangToggle();
    setupPreviewFrame();
    setupAriaCurrent();
    setupReducedMotionWatcher();
    setPreview(0);
    decorateImplementationCards();
    setupNowSection();
    startAutoplay();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  document.addEventListener('DOMContentLoaded', initPortfolioCore);
})();

/* Portfolio Captivant — 10 interactive features */
(function () {
  'use strict';

  var CONFIG = {
    nowUpdated: '2026-05-15',
    featuredProjectId: 'featuredProjectCard',
    featuredMonth: 'Mai 2026',
    quotes: [
      'Un CRM fără flow builder este o listă glorificată.',
      'Structura de date e mai importantă decât UI-ul.',
      'Autosave schimbă comportamentul utilizatorului — și a costat 15 linii de cod.',
      'Kanban-ul organizează munca de azi; flow builder-ul organizează procesul de luni.',
      'Cel mai greu nu a fost React — a fost să înțeleg de ce compun componentele așa cum le compun.'
    ],
    email: 'andreealaurap@gmail.com'
  };

  function css(el, text) { if (el) el.style.cssText += ';' + text; }

  function initHeroQuote() {
    var h1 = document.getElementById('hero-title');
    if (!h1 || document.getElementById('heroQuote')) return;
    var q = document.createElement('div');
    q.id = 'heroQuote';
    q.setAttribute('aria-live', 'polite');
    q.style.cssText = 'margin:14px 0 4px;min-height:28px;font-size:.88rem;font-style:italic;color:var(--muted,#9db0d4);opacity:0;transition:opacity .5s ease;border-left:2px solid var(--accent,#4f8cff);padding-left:12px;';
    q.textContent = '„' + CONFIG.quotes[Math.floor(Math.random() * CONFIG.quotes.length)] + '”';
    h1.insertAdjacentElement('afterend', q);
    setTimeout(function () { q.style.opacity = '1'; }, 300);
  }

  function initFeaturedBadge() {
    var title = document.getElementById('key-alpis-title');
    var card = title ? title.closest('.project-card') : null;
    if (!card) return;
    card.id = CONFIG.featuredProjectId;
    card.style.position = card.style.position || 'relative';
    if (document.getElementById('featuredBadge')) return;
    var badge = document.createElement('span');
    badge.id = 'featuredBadge';
    badge.textContent = '📌 Proiectul lunii — ' + CONFIG.featuredMonth;
    badge.style.cssText = 'display:inline-block;position:absolute;top:12px;right:12px;font-size:.7rem;font-weight:700;background:linear-gradient(90deg,rgba(79,140,255,.18),rgba(139,92,246,.18));border:1px solid rgba(79,140,255,.35);color:var(--accent,#4f8cff);padding:3px 9px;border-radius:20px;white-space:nowrap;pointer-events:none;';
    title.insertAdjacentElement('beforebegin', badge);
  }

  function initSmartCta() {
    var contact = document.getElementById('contact');
    if (!contact || document.getElementById('smartCta')) return;
    var actions = contact.querySelector('.contact-actions');
    if (!actions) return;
    var wrap = document.createElement('div');
    wrap.id = 'smartCta';
    wrap.style.cssText = 'margin:16px 0;padding:16px 18px;border-radius:14px;border:1px solid var(--line,rgba(255,255,255,.1));background:var(--panel-2,rgba(255,255,255,.04))';
    wrap.innerHTML = '<p style="font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted,#9db0d4);margin-bottom:10px">Ce vrei să construim împreună?</p><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px" id="ctaTypeButtons" role="group" aria-label="Alege tipul de proiect"><button class="cta-type-btn" data-type="CRM intern">CRM intern</button><button class="cta-type-btn" data-type="Dashboard operațional">Dashboard operațional</button><button class="cta-type-btn" data-type="Landing page">Landing page</button><button class="cta-type-btn" data-type="Tool / prototip interactiv">Tool / prototip interactiv</button></div><a id="ctaGeneratedLink" class="btn btn-primary" href="mailto:' + CONFIG.email + '?subject=Propunere%20proiect" style="transition:all .3s">Scrie-mi despre un proiect</a><p id="ctaHint" style="font-size:.75rem;color:var(--muted,#9db0d4);margin-top:8px;opacity:0;transition:opacity .3s">← Selectează tipul de proiect pentru a personaliza mesajul</p>';
    actions.insertAdjacentElement('beforebegin', wrap);
    var btns = wrap.querySelectorAll('.cta-type-btn');
    var link = wrap.querySelector('#ctaGeneratedLink');
    var hint = wrap.querySelector('#ctaHint');
    btns.forEach(function (btn) {
      btn.style.cssText = 'padding:6px 14px;border-radius:8px;font-size:.82rem;font-weight:600;border:1px solid var(--line,rgba(255,255,255,.15));background:transparent;color:var(--muted,#9db0d4);cursor:pointer;transition:all .2s;font-family:inherit';
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.style.background = 'transparent'; b.style.color = 'var(--muted,#9db0d4)'; b.style.borderColor = 'var(--line,rgba(255,255,255,.15))'; });
        btn.style.background = 'rgba(79,140,255,.14)';
        btn.style.color = 'var(--accent,#4f8cff)';
        btn.style.borderColor = 'rgba(79,140,255,.4)';
        var type = btn.getAttribute('data-type');
        var subject = encodeURIComponent('Propunere proiect — ' + type);
        var body = encodeURIComponent('Bună Laura,\n\nAm văzut portofoliul tău și m-ar interesa să discutăm despre un proiect de tip: ' + type + '.\n\n[Descrie pe scurt ce ai nevoie]\n\nMulțumesc!');
        link.href = 'mailto:' + CONFIG.email + '?subject=' + subject + '&body=' + body;
        link.textContent = 'Scrie-mi despre ' + type + ' →';
        if (hint) hint.style.opacity = '0';
      });
    });
    if (hint) setTimeout(function () { hint.style.opacity = '1'; }, 600);
  }

  function initFreshness() {
    var now = document.getElementById('now');
    if (!now) return;
    var badge = now.querySelector('.now-badge');
    if (!badge || document.getElementById('nowFreshness')) return;
    var time = badge.querySelector('time');
    if (time) { time.id = 'nowDate'; time.setAttribute('datetime', CONFIG.nowUpdated); }
    var el = document.createElement('span');
    el.id = 'nowFreshness';
    el.style.cssText = 'margin-left:8px;font-size:.72rem;font-weight:700;padding:2px 8px;border-radius:10px;background:rgba(52,211,153,.12);color:#34d399;border:1px solid rgba(52,211,153,.25)';
    badge.appendChild(el);
    var diffDays = Math.floor((Date.now() - new Date(CONFIG.nowUpdated).getTime()) / 86400000);
    var stale = diffDays >= 30;
    el.textContent = diffDays === 0 ? 'azi' : diffDays === 1 ? 'ieri' : diffDays < 7 ? 'acum ' + diffDays + ' zile' : diffDays < 30 ? 'acum ' + Math.floor(diffDays / 7) + ' săpt.' : 'acum ' + Math.floor(diffDays / 30) + ' luni';
    if (stale) { el.style.background = 'rgba(239,68,68,.12)'; el.style.color = '#f87171'; el.style.borderColor = 'rgba(239,68,68,.25)'; el.title = 'Secțiunea Now nu a fost actualizată de mai mult de 30 de zile.'; }
  }

  function initActivityBar() {
    var firstStats = document.querySelector('section#github-stats');
    if (!firstStats || document.getElementById('ghActivityBar')) return;
    var langCard = firstStats.querySelector('.gh-lang-card');
    if (!langCard) return;
    var bar = document.createElement('div');
    bar.id = 'ghActivityBar';
    bar.style.cssText = 'margin-bottom:14px;padding:16px 20px;border-radius:18px;border:1px solid var(--line,rgba(255,255,255,.1));background:var(--panel-2,rgba(255,255,255,.04))';
    bar.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><strong style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted,#9db0d4)">Activitate recentă</strong><span id="ghActivityLabel" style="font-size:.75rem;color:var(--muted,#9db0d4)">se încarcă…</span></div><div id="ghActivityDots" style="display:flex;gap:5px;flex-wrap:wrap;align-items:center" aria-label="Ultimele 15 evenimente GitHub" role="list"></div>';
    langCard.insertAdjacentElement('beforebegin', bar);
    var dots = document.getElementById('ghActivityDots');
    var label = document.getElementById('ghActivityLabel');
    var map = { PushEvent: '#34d399', CreateEvent: '#60a5fa', PullRequestEvent: '#a78bfa', IssuesEvent: '#fbbf24', ForkEvent: '#f472b6', WatchEvent: '#9db0d4' };
    fetch('https://api.github.com/users/LaurAndreea10/events/public?per_page=15').then(function (r) { return r.ok ? r.json() : null; }).then(function (events) {
      if (!events || !events.length) { if (label) label.textContent = 'date indisponibile'; return; }
      var pushCount = events.filter(function (e) { return e.type === 'PushEvent'; }).length;
      if (label) label.textContent = pushCount + ' push-uri în ultimele 15 evenimente';
      events.slice(0, 15).forEach(function (ev) {
        var dot = document.createElement('span');
        var repoName = ev.repo && ev.repo.name ? ev.repo.name.split('/')[1] : 'repo';
        var dateStr = new Date(ev.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
        dot.setAttribute('role', 'listitem');
        dot.title = ev.type.replace('Event', '') + ' — ' + repoName + ' (' + dateStr + ')';
        dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:' + (map[ev.type] || '#9db0d4') + ';flex-shrink:0;opacity:.85;cursor:default;transition:transform .15s,opacity .15s;display:inline-block';
        dot.addEventListener('mouseenter', function () { dot.style.transform = 'scale(1.5)'; dot.style.opacity = '1'; });
        dot.addEventListener('mouseleave', function () { dot.style.transform = 'scale(1)'; dot.style.opacity = '.85'; });
        dots.appendChild(dot);
      });
      var legend = document.createElement('div');
      legend.style.cssText = 'width:100%;margin-top:8px;display:flex;gap:12px;flex-wrap:wrap;font-size:.7rem;color:var(--muted,#9db0d4)';
      [['#34d399', 'Push'], ['#60a5fa', 'Create'], ['#a78bfa', 'PR']].forEach(function (item) { var li = document.createElement('span'); li.style.cssText = 'display:flex;align-items:center;gap:4px'; li.innerHTML = '<span style="width:8px;height:8px;border-radius:50%;background:' + item[0] + ';display:inline-block"></span>' + item[1]; legend.appendChild(li); });
      dots.parentNode.appendChild(legend);
    }).catch(function () { if (label) label.textContent = 'rate limit — încearcă mai târziu'; });
  }

  function initSkillTimeline() {
    var trail = document.querySelector('.learning-trail');
    if (!trail || trail.dataset.timelineEnhanced === 'true') return;
    trail.dataset.timelineEnhanced = 'true';
    var steps = [
      { year: '2022', label: 'HTML/CSS', detail: 'Baza: layout, flexbox, grid, variabile CSS.' },
      { year: '2023', label: 'JS ES6+', detail: 'DOM, events, fetch, async/await, localStorage.' },
      { year: '2023', label: 'React 18', detail: 'Componente, hooks, state management, props.' },
      { year: '2024', label: 'TypeScript', detail: 'Type safety, interfaces, generics în proiecte CRM.' },
      { year: '2024', label: 'Vite + CI/CD', detail: 'GitHub Actions, build optimizat, deploy automat.' },
      { year: '2025', label: 'AI tools', detail: 'Integrare API Anthropic, prompting, AI-native UI.' }
    ];
    var tip = document.createElement('div');
    tip.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;padding:7px 12px;border-radius:9px;background:var(--panel,rgba(13,24,46,.95));border:1px solid var(--line,rgba(255,255,255,.15));color:var(--text,#eef4ff);font-size:.78rem;max-width:200px;line-height:1.5;opacity:0;transition:opacity .18s;box-shadow:0 8px 24px rgba(0,0,0,.4)';
    document.body.appendChild(tip);
    trail.innerHTML = '<div class="lt-title">Traseu autodidact — 2022 → prezent</div>';
    var timeline = document.createElement('div');
    timeline.style.cssText = 'display:flex;align-items:flex-start;gap:0;overflow-x:auto;padding-bottom:4px;scrollbar-width:none';
    steps.forEach(function (s, i) {
      var node = document.createElement('div');
      node.style.cssText = 'display:flex;flex-direction:column;align-items:center;flex:1;min-width:72px;cursor:pointer;position:relative';
      if (i < steps.length - 1) { var line = document.createElement('div'); line.style.cssText = 'position:absolute;top:15px;left:50%;width:100%;height:2px;background:var(--line,rgba(255,255,255,.1));z-index:0'; node.appendChild(line); }
      var dot = document.createElement('div');
      dot.textContent = s.year.slice(2);
      dot.style.cssText = 'width:32px;height:32px;border-radius:50%;background:var(--panel-2,rgba(255,255,255,.06));border:2px solid var(--accent,#4f8cff);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;color:var(--accent,#4f8cff);transition:background .2s,transform .2s;z-index:1;position:relative';
      var lbl = document.createElement('span');
      lbl.textContent = s.label;
      lbl.style.cssText = 'font-size:.72rem;font-weight:600;color:var(--muted,#9db0d4);margin-top:6px;text-align:center;line-height:1.3';
      node.appendChild(dot); node.appendChild(lbl);
      node.addEventListener('mouseenter', function () { dot.style.background = 'rgba(79,140,255,.18)'; dot.style.transform = 'scale(1.15)'; tip.textContent = s.label + ': ' + s.detail; tip.style.opacity = '1'; });
      node.addEventListener('mousemove', function (e) { tip.style.left = (e.clientX + 12) + 'px'; tip.style.top = (e.clientY - 36) + 'px'; });
      node.addEventListener('mouseleave', function () { dot.style.background = 'var(--panel-2,rgba(255,255,255,.06))'; dot.style.transform = 'scale(1)'; tip.style.opacity = '0'; });
      timeline.appendChild(node);
    });
    trail.appendChild(timeline);
  }

  function initDynamicCounter() {
    fetch('https://api.github.com/users/LaurAndreea10').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d) return;
      var count = d.public_repos;
      document.querySelectorAll('#ghRepos').forEach(function (el) { el.textContent = count; });
      var powMetrics = document.querySelectorAll('.pow-metric.green');
      powMetrics.forEach(function (m) { if (m.textContent.indexOf('repo') !== -1) m.textContent = count + '+ repo-uri publice'; });
    }).catch(function () {});
  }

  function initChangelog() {
    var copy = document.querySelector('.footer-copy');
    if (!copy || document.getElementById('changelog')) return;
    var details = document.createElement('details');
    details.id = 'changelog';
    details.style.cssText = 'margin:18px 0 10px;font-size:.78rem;color:var(--muted,#9db0d4);text-align:left';
    details.innerHTML = '<summary style="cursor:pointer;font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:.72rem;color:var(--accent,#4f8cff);list-style:none;display:inline-flex;align-items:center;gap:6px"><span>📋</span> Changelog</summary><ul id="changelogList" style="margin:10px 0 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px"><li style="display:flex;gap:10px"><time style="color:var(--accent,#4f8cff);font-weight:600;white-space:nowrap">Mai 2026</time><span>Lead Magnet Landing adăugat · Lighthouse CI audit · Now page actualizată</span></li><li style="display:flex;gap:10px"><time style="color:var(--accent,#4f8cff);font-weight:600;white-space:nowrap">Apr 2026</time><span>Alpis Fusion Decision Log extins · Brief Studio deploy rezolvat</span></li><li style="display:flex;gap:10px"><time style="color:var(--accent,#4f8cff);font-weight:600;white-space:nowrap">Mar 2026</time><span>ARCADE OPS v4 · BASKET-VS-AI Enhanced Pro · Excel-Quest hub</span></li><li style="display:flex;gap:10px"><time style="color:var(--accent,#4f8cff);font-weight:600;white-space:nowrap">Feb 2026</time><span>CampaignPilot · ROI Calculator · Link Video Editor Studio</span></li><li style="display:flex;gap:10px"><time style="color:var(--accent,#4f8cff);font-weight:600;white-space:nowrap">Ian 2026</time><span>ClientOps Suite Premium · Proof of Work section · GitHub Stats live</span></li></ul>';
    copy.insertAdjacentElement('beforebegin', details);
  }

  function bootCaptivant() {
    initHeroQuote();
    initFeaturedBadge();
    initSmartCta();
    initActivityBar();
    initFreshness();
    initSkillTimeline();
    initDynamicCounter();
    initChangelog();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootCaptivant);
  else bootCaptivant();
})();
