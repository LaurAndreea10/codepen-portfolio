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
        'Focus curent: <strong>Industry Benchmarks Dashboard + UTM Builder v1.2</strong> în Marketing OS.',
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
        'Current focus: <strong>Industry Benchmarks Dashboard + UTM Builder v1.2</strong> inside Marketing OS.',
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
    const list = els.nowSection.querySelector('.now-list');
    const note = els.nowSection.querySelector('.now-note');
    if (eyebrow) eyebrow.textContent = translations[currentLang].nowLabel;
    if (title) title.textContent = translations[currentLang].nowTitle;
    if (badge) {
      badge.innerHTML = `${translations[currentLang].nowUpdatedPrefix} <time datetime="${copy.datetime}">${copy.label}</time>`;
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
    if (autoplayId) { window.clearInterval(autoplayId); autoplayId = null; }
  }

  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

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
    els.heroPreviewFrame.addEventListener('load', () => showPreviewFallback(false));
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
    els.sections.forEach(s => observer.observe(s));
  }

  function setupReducedMotionWatcher() {
    if (typeof prefersReducedMotion.addEventListener === 'function') {
      prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) stopAutoplay(); else startAutoplay();
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
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });

  document.addEventListener('DOMContentLoaded', initPortfolioCore);
})();
