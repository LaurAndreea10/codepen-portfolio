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

      accessArcade: {
        eyebrow: '♿ Accessibility Flagship',
        title: 'Access Arcade Coach — flagship concept integrat în portofoliu',
        subtitle: 'O combinație între ARCADE OPS, BACapp și Coaching-AI, extinsă cu două module noi: Mandala Calm și Scratch Lab. Gândit ca produs accesibil, mobile-first, bilingv și orientat pe autonomie.',
        meta: 'dashboard · mood check-in · quiz · mandala · scratch lab',

        flagshipEyebrow: 'Flagship app',
        flagshipTitle: 'Un hub accesibil pentru rutină, studiu, reglare și expresivitate',
        flagshipText: 'Conceptul unește progresul gamificat, învățarea ghidată și suportul local cu două direcții noi: Mandala Calm pentru reglare vizuală și Scratch Lab pentru storytelling și secvențe creative.',

        quickWorkspace: 'Workspace',
        quickMandala: 'Mandala',
        quickScratch: 'Scratch Lab',

        statXp: 'progres total',
        statStreak: 'zile streak',
        statMissions: 'misiuni făcute',
        statQuiz: 'scor quiz',

        tabTasks: 'Task board',
        tabCoach: 'Coach',
        tabQuiz: 'Quiz',
        tabMandala: 'Mandala',
        tabScratch: 'Scratch',

        tasksTitle: 'Task board accesibil',
        tasksText: 'Bifează taskurile finalizate. Logica este gândită pentru pași mici, claritate și feedback blând.',
        taskReward: 'Recompensează taskurile',
        reset: 'Reset',

        profileTitle: 'Profiluri de accesibilitate',
        profileText: 'Preseturi rapide care schimbă experiența fără fricțiune.',
        profileCalmTitle: 'Calm & Clear',
        profileCalmText: 'Contrast echilibrat, text puțin mărit și ritm blând.',
        profileFocusTitle: 'Focus Boost',
        profileFocusText: 'Accent pe claritate și delimitare mai fermă.',
        profileReducedTitle: 'Reduced Motion',
        profileReducedText: 'Mai puțină mișcare și feedback mai static.',
        apply: 'Aplică',

        moodTitle: 'Mood check-in',
        moodText: 'Starea curentă schimbă tonul recomandărilor și ritmul general al experienței.',
        moodCalm: 'Calm',
        moodTired: 'Obosit',
        moodOverwhelmed: 'Copleșit',
        moodMotivated: 'Motivat',

        coachTitle: 'Coach local',
        coachText: 'Rule-based, calm și orientat pe următorul pas clar.',
        coachPlaceholder: 'Ex: Sunt blocată. Dă-mi un plan simplu pentru următoarele 10 minute.',
        coachGenerate: 'Generează răspuns',
        coachCalm: 'Mod calm',
        coachPlan: 'Plan în 3 pași',
        coachDefault: 'Răspunsul coach-ului apare aici cu pași simpli și feedback blând.',

        quizDefaultFeedback: 'Alege un răspuns ca să primești feedback.',
        quizNext: 'Următoarea întrebare',
        quizReset: 'Resetează quiz',

        badgeStarterTitle: 'Starter',
        badgeStarterText: 'Ai pornit flow-ul și ai configurat experiența.',
        badgeFocusTitle: 'Focus Pilot',
        badgeFocusText: 'Ai folosit zonele de reglare și focus.',
        badgeQuizTitle: 'Quiz Learner',
        badgeQuizText: 'Ai răspuns la întrebări și ai primit feedback calm.',
        badgeAdaptiveTitle: 'Adaptive Master',
        badgeAdaptiveText: 'Se deblochează prin mai multe sesiuni și profile active.',

        mandalaTitle: 'Mandala Calm',
        mandalaText: 'Un modul de reglare și concentrare bazat pe simetrie, ritm lent și alegere simplă de tonuri.',
        mandalaCalm: 'Calm',
        mandalaFocus: 'Focus',
        mandalaEnergy: 'Energy',
        mandalaReset: 'Reset Mandala',
        mandalaReward: 'Finalizează sesiunea',

        scratchTitle: 'Scratch Lab',
        scratchText: 'O zonă creativă inspirată de logica block-based: prompturi, secvențe și micro-interacțiuni pentru învățare expresivă.',
        scratchStory: 'Story',
        scratchMotion: 'Motion',
        scratchDialog: 'Dialog',
        scratchDefault: 'Alege un tip de proiect și modulul generează o idee simplă de construit în pași scurți.',
        scratchReset: 'Reset Flow',
        scratchReward: 'Save Creative Flow',

        analyticsTitle: 'Analytics blând',
        analyticsText: 'Vizualizare simplă a zonelor de progres, fără supraîncărcare inutilă.',
        analyticsRoutine: 'Rutină',
        analyticsStudy: 'Studiu',
        analyticsAutonomy: 'Autonomie',

        portfolioValueTitle: 'Valoare de portofoliu',
        portfolioValueText: 'Mandala Calm adaugă o dimensiune de reglare și focus. Scratch Lab extinde proiectul spre expresivitate, block-based thinking și product UX pentru accesibilitate.',
        portfolioValueNote: 'Proiectul arată product thinking, UX stratificat, logică modulară și capacitatea de a transforma teme diferite într-un concept coerent.'
      }
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

      accessArcade: {
        eyebrow: '♿ Accessibility Flagship',
        title: 'Access Arcade Coach — flagship concept integrated into the portfolio',
        subtitle: 'A combination of ARCADE OPS, BACapp and Coaching-AI, extended with two new modules: Mandala Calm and Scratch Lab. Built as an accessible, mobile-first, bilingual product focused on autonomy.',
        meta: 'dashboard · mood check-in · quiz · mandala · scratch lab',

        flagshipEyebrow: 'Flagship app',
        flagshipTitle: 'An accessible hub for routine, study, regulation and expression',
        flagshipText: 'The concept combines gamified progress, guided learning and local support with two new directions: Mandala Calm for visual regulation and Scratch Lab for storytelling and creative sequencing.',

        quickWorkspace: 'Workspace',
        quickMandala: 'Mandala',
        quickScratch: 'Scratch Lab',

        statXp: 'total progress',
        statStreak: 'day streak',
        statMissions: 'missions completed',
        statQuiz: 'quiz score',

        tabTasks: 'Task board',
        tabCoach: 'Coach',
        tabQuiz: 'Quiz',
        tabMandala: 'Mandala',
        tabScratch: 'Scratch',

        tasksTitle: 'Accessible task board',
        tasksText: 'Check completed tasks. The logic is designed for small steps, clarity and gentle feedback.',
        taskReward: 'Reward tasks',
        reset: 'Reset',

        profileTitle: 'Accessibility profiles',
        profileText: 'Quick presets that reshape the experience with less friction.',
        profileCalmTitle: 'Calm & Clear',
        profileCalmText: 'Balanced contrast, slightly larger text and a gentler pace.',
        profileFocusTitle: 'Focus Boost',
        profileFocusText: 'Stronger visual separation and clearer focus.',
        profileReducedTitle: 'Reduced Motion',
        profileReducedText: 'Less motion and more static feedback.',
        apply: 'Apply',

        moodTitle: 'Mood check-in',
        moodText: 'The current mood changes recommendation tone and the overall pace of the experience.',
        moodCalm: 'Calm',
        moodTired: 'Tired',
        moodOverwhelmed: 'Overwhelmed',
        moodMotivated: 'Motivated',

        coachTitle: 'Local coach',
        coachText: 'Rule-based, calm and focused on the next clear step.',
        coachPlaceholder: 'Example: I feel blocked. Give me a simple plan for the next 10 minutes.',
        coachGenerate: 'Generate response',
        coachCalm: 'Calm mode',
        coachPlan: '3-step plan',
        coachDefault: 'The coach response appears here with simple steps and gentle feedback.',

        quizDefaultFeedback: 'Choose an answer to receive feedback.',
        quizNext: 'Next question',
        quizReset: 'Reset quiz',

        badgeStarterTitle: 'Starter',
        badgeStarterText: 'You started the flow and configured the experience.',
        badgeFocusTitle: 'Focus Pilot',
        badgeFocusText: 'You used the focus and regulation areas.',
        badgeQuizTitle: 'Quiz Learner',
        badgeQuizText: 'You answered questions and received calm feedback.',
        badgeAdaptiveTitle: 'Adaptive Master',
        badgeAdaptiveText: 'Unlocked through multiple sessions and active profiles.',

        mandalaTitle: 'Mandala Calm',
        mandalaText: 'A regulation and focus module built around symmetry, slow rhythm and simple tone choices.',
        mandalaCalm: 'Calm',
        mandalaFocus: 'Focus',
        mandalaEnergy: 'Energy',
        mandalaReset: 'Reset Mandala',
        mandalaReward: 'Finish session',

        scratchTitle: 'Scratch Lab',
        scratchText: 'A creative area inspired by block-based logic: prompts, sequences and micro-interactions for expressive learning.',
        scratchStory: 'Story',
        scratchMotion: 'Motion',
        scratchDialog: 'Dialog',
        scratchDefault: 'Choose a project type and the module generates a simple idea to build in short steps.',
        scratchReset: 'Reset flow',
        scratchReward: 'Save creative flow',

        analyticsTitle: 'Gentle analytics',
        analyticsText: 'A simple view of progress areas without unnecessary overload.',
        analyticsRoutine: 'Routine',
        analyticsStudy: 'Study',
        analyticsAutonomy: 'Autonomy',

        portfolioValueTitle: 'Portfolio value',
        portfolioValueText: 'Mandala Calm adds a regulation and focus dimension. Scratch Lab extends the project toward expressiveness, block-based thinking and accessibility-oriented product UX.',
        portfolioValueNote: 'The project shows product thinking, layered UX, modular logic and the ability to turn different themes into one coherent concept.'
      }
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
    heroCtaSecondary: document.getElementById('heroCtaSecondary')
  };

  let currentLang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem(STORAGE_KEYS.lang) || 'ro';
  if (!translations[currentLang]) currentLang = 'ro';

  let previewIndex = 0;
  let autoplayId = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyThemeFromStorage() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme === 'light') {
      els.body.classList.add('light');
    } else {
      els.body.classList.remove('light');
    }
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

    if (window.__applyAccessArcadeLanguage) {
      window.__applyAccessArcadeLanguage(currentLang);
    }
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
    autoplayId = window.setInterval(() => {
      setPreview(previewIndex + 1);
    }, 5000);
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

    els.heroPreviewFrame.addEventListener('load', () => {
      showPreviewFallback(false);
    });

    els.heroPreviewFrame.addEventListener('error', () => {
      showPreviewFallback(true);
    });

    els.heroPreviewFrame.addEventListener('mouseenter', stopAutoplay);
    els.heroPreviewFrame.addEventListener('mouseleave', startAutoplay);
  }

  function setupAriaCurrent() {
    if (!('IntersectionObserver' in window) || !els.sections.length || !els.navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;
      const currentId = `#${visible[0].target.id}`;

      els.navLinks.forEach(link => {
        if (link.getAttribute('href') === currentId) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0.2, 0.35, 0.55]
    });

    els.sections.forEach(section => observer.observe(section));
  }

  function setupReducedMotionWatcher() {
    if (typeof prefersReducedMotion.addEventListener === 'function') {
      prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
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
    startAutoplay();
  }

  function initAccessArcade() {
    const section = document.getElementById('access-arcade-flagship');
    if (!section) return;

    const state = {
      xp: 420,
      streak: 9,
      missions: 24,
      quizScore: 0,
      quizIndex: 0,
      profile: 'calm',
      mood: '🙂',
      tasks: [
        { text: { ro: 'Check-in de 1 minut', en: '1-minute check-in' }, done: false },
        { text: { ro: '10 minute focus', en: '10-minute focus' }, done: false },
        { text: { ro: 'Quiz scurt cu feedback calm', en: 'Short quiz with calm feedback' }, done: false },
        { text: { ro: 'Pauză scurtă și recap', en: 'Short break and recap' }, done: false },
        { text: { ro: 'Întreabă coach-ul pentru următorul pas', en: 'Ask the coach for the next step' }, done: false }
      ]
    };

    const $ = (sel) => section.querySelector(sel);
    const $$ = (sel) => [...section.querySelectorAll(sel)];

    const textEls = {
      eyebrow: $('#access-arcade-title')?.previousElementSibling,
      title: $('#access-arcade-title'),
      subtitle: $('#access-arcade-title')?.nextElementSibling,
      meta: $('#access-arcade-title')?.parentElement?.querySelector('.gh-meta span'),

      flagshipEyebrow: section.querySelector('.flagship-card .eyebrow'),
      flagshipTitle: section.querySelector('.flagship-card h3'),
      flagshipText: section.querySelector('.flagship-card .project-desc'),

      quickWorkspace: section.querySelector('[data-flagship-tab="tasks"]'),
      quickMandala: section.querySelector('[data-flagship-tab="mandala"]'),
      quickScratch: section.querySelector('[data-flagship-tab="scratch"]'),

      statXp: $('#aacXp')?.nextElementSibling,
      statStreak: $('#aacStreak')?.nextElementSibling,
      statMissions: $('#aacMissions')?.nextElementSibling,
      statQuiz: $('#aacQuizScore')?.nextElementSibling,

      tabTasks: section.querySelector('.flagship-tab[data-tab="tasks"]'),
      tabCoach: section.querySelector('.flagship-tab[data-tab="coach"]'),
      tabQuiz: section.querySelector('.flagship-tab[data-tab="quiz"]'),
      tabMandala: section.querySelector('.flagship-tab[data-tab="mandala"]'),
      tabScratch: section.querySelector('.flagship-tab[data-tab="scratch"]'),

      tasksTitle: section.querySelector('[data-panel="tasks"] .module-box h4'),
      tasksText: section.querySelector('[data-panel="tasks"] .module-box p'),
      taskReward: $('#aacRewardTasks'),
      taskReset: $('#aacResetTasks'),

      profileTitle: section.querySelectorAll('[data-panel="tasks"] .module-box h4')[1],
      profileText: section.querySelectorAll('[data-panel="tasks"] .module-box p')[1],
      profileCalmTitle: section.querySelector('.profile-box[data-profile="calm"] h4'),
      profileCalmText: section.querySelector('.profile-box[data-profile="calm"] p'),
      profileFocusTitle: section.querySelector('.profile-box[data-profile="focus"] h4'),
      profileFocusText: section.querySelector('.profile-box[data-profile="focus"] p'),
      profileReducedTitle: section.querySelector('.profile-box[data-profile="reduced"] h4'),
      profileReducedText: section.querySelector('.profile-box[data-profile="reduced"] p'),
      profileButtons: $$('.aacProfileBtn'),

      moodTitle: section.querySelector('[data-panel="tasks"] .module-box[style] h4'),
      moodText: section.querySelector('[data-panel="tasks"] .module-box[style] p'),
      moodCalm: section.querySelector('.mood-btn[data-mood="🙂"] span'),
      moodTired: section.querySelector('.mood-btn[data-mood="😕"] span'),
      moodOverwhelmed: section.querySelector('.mood-btn[data-mood="😣"] span'),
      moodMotivated: section.querySelector('.mood-btn[data-mood="🔥"] span'),

      coachTitle: section.querySelector('[data-panel="coach"] h4'),
      coachText: section.querySelector('[data-panel="coach"] p'),
      coachInput: $('#aacCoachInput'),
      coachGenerate: $('#aacCoachSend'),
      coachCalm: $('#aacCoachCalm'),
      coachPlan: $('#aacCoachPlan'),

      quizNext: $('#aacQuizNext'),
      quizReset: $('#aacQuizReset'),

      badgeStarterTitle: section.querySelectorAll('.badge-item strong')[0],
      badgeStarterText: section.querySelectorAll('.badge-item p')[0],
      badgeFocusTitle: section.querySelectorAll('.badge-item strong')[1],
      badgeFocusText: section.querySelectorAll('.badge-item p')[1],
      badgeQuizTitle: section.querySelectorAll('.badge-item strong')[2],
      badgeQuizText: section.querySelectorAll('.badge-item p')[2],
      badgeAdaptiveTitle: section.querySelectorAll('.badge-item strong')[3],
      badgeAdaptiveText: section.querySelectorAll('.badge-item p')[3],

      mandalaTitle: section.querySelector('[data-panel="mandala"] h4'),
      mandalaText: section.querySelector('[data-panel="mandala"] p'),
      mandalaCalm: section.querySelector('.aacMandalaTone[data-tone="calm"]'),
      mandalaFocus: section.querySelector('.aacMandalaTone[data-tone="focus"]'),
      mandalaEnergy: section.querySelector('.aacMandalaTone[data-tone="energy"]'),
      mandalaReset: $('#aacMandalaReset'),
      mandalaReward: $('#aacMandalaReward'),

      scratchTitle: section.querySelector('[data-panel="scratch"] .module-box h4'),
      scratchText: section.querySelector('[data-panel="scratch"] .module-box p'),
      scratchStory: section.querySelector('.aacScratchPrompt[data-type="story"]'),
      scratchMotion: section.querySelector('.aacScratchPrompt[data-type="motion"]'),
      scratchDialog: section.querySelector('.aacScratchPrompt[data-type="dialog"]'),
      scratchReset: $('#aacScratchReset'),
      scratchReward: $('#aacScratchReward'),

      analyticsTitle: section.querySelector('.analytics-box h4'),
      analyticsText: section.querySelector('.analytics-box p'),
      analyticsRoutine: $('#aacBarRoutineLabel')?.parentElement?.querySelector('strong'),
      analyticsStudy: $('#aacBarStudyLabel')?.parentElement?.querySelector('strong'),
      analyticsAutonomy: $('#aacBarAutonomyLabel')?.parentElement?.querySelector('strong'),

      portfolioValueTitle: section.querySelectorAll('.analytics-box h4')[1],
      portfolioValueText: section.querySelectorAll('.analytics-box p')[1],
      portfolioValueNote: section.querySelectorAll('.analytics-box .integrated-note')[0]
    };

    const taskList = $('#aacTaskList');
    const summary = $('#aacSummary');
    const xpEl = $('#aacXp');
    const streakEl = $('#aacStreak');
    const missionsEl = $('#aacMissions');
    const quizScoreEl = $('#aacQuizScore');
    const moodNote = $('#aacMoodNote');
    const coachOutput = $('#aacCoachOutput');
    const coachInput = $('#aacCoachInput');
    const quizQuestion = $('#aacQuizQuestion');
    const quizMeta = $('#aacQuizMeta');
    const quizOptions = $('#aacQuizOptions');
    const quizFeedback = $('#aacQuizFeedback');
    const mandalaNote = $('#aacMandalaNote');
    const scratchPromptBox = $('#aacScratchPromptBox');
    const scratchSequence = $('#aacScratchSequence');

    let scratchFlow = [];

    const quizData = [
      {
        q: {
          ro: 'Care este cea mai bună abordare pentru un utilizator copleșit de multe informații?',
          en: 'What is the best approach for a user overwhelmed by too much information?'
        },
        options: {
          ro: [
            'Să vadă toate panourile simultan',
            'Să primească pași mici și un singur CTA clar',
            'Să primească mai multe animații pentru orientare'
          ],
          en: [
            'Show all panels at once',
            'Provide small steps and one clear CTA',
            'Add more animations for orientation'
          ]
        },
        correct: 1,
        good: {
          ro: 'Corect. Pașii mici și un CTA clar reduc supraîncărcarea cognitivă.',
          en: 'Correct. Small steps and one clear CTA reduce cognitive overload.'
        },
        bad: {
          ro: 'Mai bine alegi pași mici și un CTA clar. Asta scade fricțiunea și ajută orientarea.',
          en: 'A better choice is small steps and one clear CTA. That reduces friction and supports orientation.'
        }
      },
      {
        q: {
          ro: 'Ce setare este utilă pentru sensibilitate la mișcare?',
          en: 'Which setting is useful for motion sensitivity?'
        },
        options: {
          ro: ['High contrast', 'Reduce motion', 'Light mode only'],
          en: ['High contrast', 'Reduce motion', 'Light mode only']
        },
        correct: 1,
        good: {
          ro: 'Corect. Reduce motion este util pentru utilizatorii sensibili la animații sau tranziții.',
          en: 'Correct. Reduce motion is useful for users who are sensitive to animation or transitions.'
        },
        bad: {
          ro: 'Răspunsul mai potrivit este Reduce motion.',
          en: 'The better answer is Reduce motion.'
        }
      },
      {
        q: {
          ro: 'De ce este utilă salvarea preferințelor în localStorage?',
          en: 'Why is saving preferences in localStorage useful?'
        },
        options: {
          ro: [
            'Pentru o experiență mai predictibilă la revenire',
            'Doar pentru design vizual',
            'Ca să mărești scorul fără logică'
          ],
          en: [
            'For a more predictable return experience',
            'Only for visual design',
            'To increase score without logic'
          ]
        },
        correct: 0,
        good: {
          ro: 'Corect. Persistența preferințelor reduce efortul repetitiv și crește predictibilitatea.',
          en: 'Correct. Preference persistence reduces repetitive effort and increases predictability.'
        },
        bad: {
          ro: 'Varianta bună este salvarea pentru o experiență predictibilă la revenire.',
          en: 'The correct option is saving preferences for a predictable return experience.'
        }
      },
      {
        q: {
          ro: 'Ce face un workspace cu tab-uri mai accesibil?',
          en: 'What makes a tabbed workspace more accessible?'
        },
        options: {
          ro: [
            'Ascunde tot conținutul important',
            'Separă zonele pe roluri și reduce aglomerarea',
            'Adaugă mai multe efecte vizuale'
          ],
          en: [
            'Hide all important content',
            'Separate areas by role and reduce clutter',
            'Add more visual effects'
          ]
        },
        correct: 1,
        good: {
          ro: 'Corect. Tab-urile pot simplifica orientarea și pot grupa conținutul logic.',
          en: 'Correct. Tabs can simplify orientation and group content logically.'
        },
        bad: {
          ro: 'Workspace-ul cu tab-uri ajută când separă zonele pe roluri și reduce aglomerarea.',
          en: 'A tabbed workspace helps when it separates areas by role and reduces clutter.'
        }
      },
      {
        q: {
          ro: 'Ce tip de feedback e mai potrivit într-o aplicație accesibilă?',
          en: 'What kind of feedback is more appropriate in an accessible app?'
        },
        options: {
          ro: [
            'Penalizare agresivă și mesaje dure',
            'Feedback calm, clar și orientat pe următorul pas',
            'Mesaje vagi fără direcție'
          ],
          en: [
            'Aggressive penalties and harsh messages',
            'Calm, clear feedback focused on the next step',
            'Vague messages without direction'
          ]
        },
        correct: 1,
        good: {
          ro: 'Corect. Feedback-ul calm și clar susține autonomia și reduce stresul.',
          en: 'Correct. Calm and clear feedback supports autonomy and reduces stress.'
        },
        bad: {
          ro: 'Varianta mai potrivită este feedback calm, clar și orientat pe următorul pas.',
          en: 'The better choice is calm, clear feedback focused on the next step.'
        }
      }
    ];

    const moodMessages = {
      ro: {
        '🙂': 'Stare calmă detectată. Poți continua cu un traseu scurt sau cu un exercițiu Mandala Calm.',
        '😕': 'Pari obosită. Începe cu un pas mic și o sesiune de focus scurtă.',
        '😣': 'Pari copleșită. Prioritizează o singură acțiune și cere coach-ului un plan simplu.',
        '🔥': 'Ai energie bună. Este un moment potrivit pentru quiz și un flow creativ în Scratch Lab.'
      },
      en: {
        '🙂': 'Calm state detected. You can continue with a short path or a Mandala Calm exercise.',
        '😕': 'You seem tired. Start with one small step and a short focus session.',
        '😣': 'You seem overwhelmed. Prioritize one single action and ask the coach for a simple plan.',
        '🔥': 'You have good energy. This is a good moment for the quiz and a creative Scratch Lab flow.'
      }
    };

    const scratchIdeas = {
      ro: {
        story: 'Idee: personajul pornește într-o misiune de dimineață, găsește 3 pași clari și primește un badge calm.',
        motion: 'Idee: creează o secvență cu mișcare lentă, pauză și feedback vizual simplu.',
        dialog: 'Idee: construiește un dialog între utilizator și coach cu 3 replici utile și blânde.'
      },
      en: {
        story: 'Idea: the character starts a morning mission, finds 3 clear steps and earns a calm badge.',
        motion: 'Idea: create a sequence with slow movement, pause and simple visual feedback.',
        dialog: 'Idea: build a dialogue between the user and the coach with 3 helpful and gentle replies.'
      }
    };

    const mandalaTones = {
      ro: {
        calm: 'Mandala calmă: urmărește ritmul cercurilor și schimbă doar câteva elemente, fără grabă.',
        focus: 'Mandala focus: colorează vizual din exterior spre centru și respiră lent între pași.',
        energy: 'Mandala energy: alternează nodurile și creează un pattern viu, dar clar.'
      },
      en: {
        calm: 'Calm mandala: follow the rhythm of the circles and change only a few elements, without rushing.',
        focus: 'Focus mandala: color visually from the outside toward the center and breathe slowly between steps.',
        energy: 'Energy mandala: alternate nodes and create a vivid but clear pattern.'
      }
    };

    function renderSummary() {
      const done = state.tasks.filter(t => t.done).length;
      const profileMap = {
        ro: { calm: 'Calm & Clear', focus: 'Focus Boost', reduced: 'Reduced Motion' },
        en: { calm: 'Calm & Clear', focus: 'Focus Boost', reduced: 'Reduced Motion' }
      };
      summary.textContent =
        currentLang === 'ro'
          ? `Profil activ: ${profileMap.ro[state.profile]}. Mood: ${state.mood}. Taskuri bifate: ${done}/${state.tasks.length}. XP total: ${state.xp}. Conceptul este prezentat aici ca proiect flagship de accesibilitate și product UX.`
          : `Active profile: ${profileMap.en[state.profile]}. Mood: ${state.mood}. Completed tasks: ${done}/${state.tasks.length}. Total XP: ${state.xp}. This concept is presented here as an accessibility and product UX flagship project.`;
    }

    function renderStats() {
      xpEl.textContent = `${state.xp} XP`;
      streakEl.textContent = String(state.streak);
      missionsEl.textContent = String(state.missions);
      quizScoreEl.textContent = `${state.quizScore}/5`;
    }

    function renderBars() {
      const routine = Math.min(100, 60 + state.tasks.filter(t => t.done).length * 4);
      const study = Math.min(100, 65 + state.quizScore * 4);
      const autonomy = Math.min(100, 55 + Math.floor((state.xp - 420) / 3));

      const routineEl = $('#aacBarRoutine');
      const studyEl = $('#aacBarStudy');
      const autonomyEl = $('#aacBarAutonomy');
      const routineLabel = $('#aacBarRoutineLabel');
      const studyLabel = $('#aacBarStudyLabel');
      const autonomyLabel = $('#aacBarAutonomyLabel');

      if (routineEl) routineEl.style.width = `${routine}%`;
      if (studyEl) studyEl.style.width = `${study}%`;
      if (autonomyEl) autonomyEl.style.width = `${autonomy}%`;
      if (routineLabel) routineLabel.textContent = `${routine}%`;
      if (studyLabel) studyLabel.textContent = `${study}%`;
      if (autonomyLabel) autonomyLabel.textContent = `${autonomy}%`;
    }

    function renderTasks() {
      taskList.innerHTML = '';
      state.tasks.forEach((task, index) => {
        const item = document.createElement('label');
        item.className = `task-item${task.done ? ' done' : ''}`;
        item.innerHTML = `
          <div class="task-item-left">
            <input type="checkbox" ${task.done ? 'checked' : ''} aria-label="task ${index + 1}">
            <span class="task-text">${task.text[currentLang]}</span>
          </div>
          <span class="tag">+5 XP</span>
        `;
        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', () => {
          task.done = checkbox.checked;
          item.classList.toggle('done', task.done);
          renderSummary();
          renderBars();
        });
        taskList.appendChild(item);
      });
    }

    function renderQuiz() {
      const current = quizData[state.quizIndex];
      quizQuestion.textContent = current.q[currentLang];
      quizMeta.textContent = currentLang === 'ro'
        ? `Întrebare ${state.quizIndex + 1} din ${quizData.length}`
        : `Question ${state.quizIndex + 1} of ${quizData.length}`;
      quizOptions.innerHTML = '';
      current.options[currentLang].forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => {
          [...quizOptions.children].forEach(el => el.classList.remove('selected'));
          btn.classList.add('selected');
          if (idx === current.correct) {
            quizFeedback.textContent = current.good[currentLang];
            state.quizScore = Math.min(5, state.quizScore + 1);
            state.xp += 10;
          } else {
            quizFeedback.textContent = current.bad[currentLang];
          }
          renderStats();
          renderSummary();
          renderBars();
        });
        quizOptions.appendChild(btn);
      });
    }

    function activateTab(tabName) {
      document.querySelectorAll('.flagship-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
      });
      document.querySelectorAll('.flagship-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === tabName);
      });
    }

    function applyAccessArcadeLanguage(lang) {
      const t = translations[lang].accessArcade;

      if (textEls.eyebrow) textEls.eyebrow.textContent = t.eyebrow;
      if (textEls.title) textEls.title.textContent = t.title;
      if (textEls.subtitle) textEls.subtitle.innerHTML = `${t.subtitle.replace('Mandala Calm', '<strong>Mandala Calm</strong>').replace('Scratch Lab', '<strong>Scratch Lab</strong>')}`;
      if (textEls.meta) textEls.meta.textContent = t.meta;

      if (textEls.flagshipEyebrow) textEls.flagshipEyebrow.textContent = t.flagshipEyebrow;
      if (textEls.flagshipTitle) textEls.flagshipTitle.textContent = t.flagshipTitle;
      if (textEls.flagshipText) textEls.flagshipText.innerHTML = t.flagshipText.replace('Mandala Calm', '<strong>Mandala Calm</strong>').replace('Scratch Lab', '<strong>Scratch Lab</strong>');

      if (textEls.quickWorkspace) textEls.quickWorkspace.textContent = t.quickWorkspace;
      if (textEls.quickMandala) textEls.quickMandala.textContent = t.quickMandala;
      if (textEls.quickScratch) textEls.quickScratch.textContent = t.quickScratch;

      if (textEls.statXp) textEls.statXp.textContent = t.statXp;
      if (textEls.statStreak) textEls.statStreak.textContent = t.statStreak;
      if (textEls.statMissions) textEls.statMissions.textContent = t.statMissions;
      if (textEls.statQuiz) textEls.statQuiz.textContent = t.statQuiz;

      if (textEls.tabTasks) textEls.tabTasks.textContent = t.tabTasks;
      if (textEls.tabCoach) textEls.tabCoach.textContent = t.tabCoach;
      if (textEls.tabQuiz) textEls.tabQuiz.textContent = t.tabQuiz;
      if (textEls.tabMandala) textEls.tabMandala.textContent = t.tabMandala;
      if (textEls.tabScratch) textEls.tabScratch.textContent = t.tabScratch;

      if (textEls.tasksTitle) textEls.tasksTitle.textContent = t.tasksTitle;
      if (textEls.tasksText) textEls.tasksText.textContent = t.tasksText;
      if (textEls.taskReward) textEls.taskReward.textContent = t.taskReward;
      if (textEls.taskReset) textEls.taskReset.textContent = t.reset;

      if (textEls.profileTitle) textEls.profileTitle.textContent = t.profileTitle;
      if (textEls.profileText) textEls.profileText.textContent = t.profileText;
      if (textEls.profileCalmTitle) textEls.profileCalmTitle.textContent = t.profileCalmTitle;
      if (textEls.profileCalmText) textEls.profileCalmText.textContent = t.profileCalmText;
      if (textEls.profileFocusTitle) textEls.profileFocusTitle.textContent = t.profileFocusTitle;
      if (textEls.profileFocusText) textEls.profileFocusText.textContent = t.profileFocusText;
      if (textEls.profileReducedTitle) textEls.profileReducedTitle.textContent = t.profileReducedTitle;
      if (textEls.profileReducedText) textEls.profileReducedText.textContent = t.profileReducedText;
      textEls.profileButtons.forEach(btn => btn.textContent = t.apply);

      if (textEls.moodTitle) textEls.moodTitle.textContent = t.moodTitle;
      if (textEls.moodText) textEls.moodText.textContent = t.moodText;
      if (textEls.moodCalm) textEls.moodCalm.textContent = t.moodCalm;
      if (textEls.moodTired) textEls.moodTired.textContent = t.moodTired;
      if (textEls.moodOverwhelmed) textEls.moodOverwhelmed.textContent = t.moodOverwhelmed;
      if (textEls.moodMotivated) textEls.moodMotivated.textContent = t.moodMotivated;

      if (textEls.coachTitle) textEls.coachTitle.textContent = t.coachTitle;
      if (textEls.coachText) textEls.coachText.textContent = t.coachText;
      if (textEls.coachInput) textEls.coachInput.placeholder = t.coachPlaceholder;
      if (textEls.coachGenerate) textEls.coachGenerate.textContent = t.coachGenerate;
      if (textEls.coachCalm) textEls.coachCalm.textContent = t.coachCalm;
      if (textEls.coachPlan) textEls.coachPlan.textContent = t.coachPlan;

      if (textEls.quizNext) textEls.quizNext.textContent = t.quizNext;
      if (textEls.quizReset) textEls.quizReset.textContent = t.quizReset;

      if (textEls.badgeStarterTitle) textEls.badgeStarterTitle.textContent = t.badgeStarterTitle;
      if (textEls.badgeStarterText) textEls.badgeStarterText.textContent = t.badgeStarterText;
      if (textEls.badgeFocusTitle) textEls.badgeFocusTitle.textContent = t.badgeFocusTitle;
      if (textEls.badgeFocusText) textEls.badgeFocusText.textContent = t.badgeFocusText;
      if (textEls.badgeQuizTitle) textEls.badgeQuizTitle.textContent = t.badgeQuizTitle;
      if (textEls.badgeQuizText) textEls.badgeQuizText.textContent = t.badgeQuizText;
      if (textEls.badgeAdaptiveTitle) textEls.badgeAdaptiveTitle.textContent = t.badgeAdaptiveTitle;
      if (textEls.badgeAdaptiveText) textEls.badgeAdaptiveText.textContent = t.badgeAdaptiveText;

      if (textEls.mandalaTitle) textEls.mandalaTitle.textContent = t.mandalaTitle;
      if (textEls.mandalaText) textEls.mandalaText.textContent = t.mandalaText;
      if (textEls.mandalaCalm) textEls.mandalaCalm.textContent = t.mandalaCalm;
      if (textEls.mandalaFocus) textEls.mandalaFocus.textContent = t.mandalaFocus;
      if (textEls.mandalaEnergy) textEls.mandalaEnergy.textContent = t.mandalaEnergy;
      if (textEls.mandalaReset) textEls.mandalaReset.textContent = t.mandalaReset;
      if (textEls.mandalaReward) textEls.mandalaReward.textContent = t.mandalaReward;

      if (textEls.scratchTitle) textEls.scratchTitle.textContent = t.scratchTitle;
      if (textEls.scratchText) textEls.scratchText.textContent = t.scratchText;
      if (textEls.scratchStory) textEls.scratchStory.textContent = t.scratchStory;
      if (textEls.scratchMotion) textEls.scratchMotion.textContent = t.scratchMotion;
      if (textEls.scratchDialog) textEls.scratchDialog.textContent = t.scratchDialog;
      if (textEls.scratchReset) textEls.scratchReset.textContent = t.scratchReset;
      if (textEls.scratchReward) textEls.scratchReward.textContent = t.scratchReward;

      if (textEls.analyticsTitle) textEls.analyticsTitle.textContent = t.analyticsTitle;
      if (textEls.analyticsText) textEls.analyticsText.textContent = t.analyticsText;
      if (textEls.analyticsRoutine) textEls.analyticsRoutine.textContent = t.analyticsRoutine;
      if (textEls.analyticsStudy) textEls.analyticsStudy.textContent = t.analyticsStudy;
      if (textEls.analyticsAutonomy) textEls.analyticsAutonomy.textContent = t.analyticsAutonomy;

      if (textEls.portfolioValueTitle) textEls.portfolioValueTitle.textContent = t.portfolioValueTitle;
      if (textEls.portfolioValueText) textEls.portfolioValueText.textContent = t.portfolioValueText;
      if (textEls.portfolioValueNote) textEls.portfolioValueNote.textContent = t.portfolioValueNote;

      moodNote.textContent = moodMessages[lang][state.mood];
      if (!coachOutput.dataset.userEdited) coachOutput.textContent = t.coachDefault;
      if (!quizFeedback.dataset.userEdited) quizFeedback.textContent = t.quizDefaultFeedback;
      if (!mandalaNote.dataset.userEdited) mandalaNote.textContent = mandalaTones[lang].calm;
      if (!scratchPromptBox.dataset.userEdited) scratchPromptBox.textContent = t.scratchDefault;

      renderTasks();
      renderQuiz();
      renderSummary();
      renderBars();
    }

    $$('.flagship-tab').forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });

    $$('[data-flagship-tab]').forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.dataset.flagshipTab));
    });

    $$('.aacProfileBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.profile = btn.dataset.profile;
        document.querySelectorAll('.profile-box').forEach(box => {
          box.classList.toggle('active', box.dataset.profile === state.profile);
        });
        renderSummary();
      });
    });

    $$('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.mood = btn.dataset.mood;
        document.querySelectorAll('.mood-btn').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        moodNote.textContent = moodMessages[currentLang][state.mood];
        renderSummary();
      });
    });

    $('#aacRewardTasks').addEventListener('click', () => {
      const done = state.tasks.filter(t => t.done).length;
      if (!done) {
        renderSummary();
        summary.textContent = currentLang === 'ro'
          ? 'Mai întâi bifează cel puțin un task, apoi reaplică recompensa.'
          : 'First complete at least one task, then apply the reward again.';
        return;
      }
      state.xp += done * 5;
      state.missions += done;
      renderStats();
      renderSummary();
      renderBars();
    });

    $('#aacResetTasks').addEventListener('click', () => {
      state.tasks.forEach(t => t.done = false);
      renderTasks();
      renderSummary();
      renderBars();
    });

    $('#aacCoachSend').addEventListener('click', () => {
      const text = coachInput.value.toLowerCase().trim();
      coachOutput.dataset.userEdited = 'true';
      if (/bloc|stres|panic|copleș|block|stress|panic|overwhelm/.test(text)) {
        coachOutput.textContent = currentLang === 'ro'
          ? 'Hai să reducem totul la minim. 1) oprește-te 30 de secunde, 2) alege o singură sarcină, 3) fă doar începutul ei pentru 5 minute.'
          : 'Let’s reduce everything to the minimum. 1) pause for 30 seconds, 2) choose one single task, 3) only do its beginning for 5 minutes.';
      } else if (/rutin|diminea|zi|routine|morning|day/.test(text)) {
        coachOutput.textContent = currentLang === 'ro'
          ? 'Rutină blândă: check-in de 1 minut, 10 minute focus, pauză scurtă, apoi un singur task mic.'
          : 'Gentle routine: 1-minute check-in, 10-minute focus, short break, then one small task.';
      } else if (/quiz|studi|învăț|study|learn/.test(text)) {
        coachOutput.textContent = currentLang === 'ro'
          ? 'Plan de studiu: 1) subiect mic, 2) 5 minute citit, 3) un răspuns sau quiz, 4) recap într-o propoziție.'
          : 'Study plan: 1) one small topic, 2) 5 minutes reading, 3) one answer or quiz, 4) recap in one sentence.';
      } else {
        coachOutput.textContent = currentLang === 'ro'
          ? 'Începe cu un pas mic și clar. Alege o acțiune sub 10 minute, fă-o, apoi revino pentru următorul pas.'
          : 'Start with one small clear step. Choose an action under 10 minutes, do it, then return for the next step.';
      }
    });

    $('#aacCoachCalm').addEventListener('click', () => {
      coachOutput.dataset.userEdited = 'true';
      coachOutput.textContent = currentLang === 'ro'
        ? 'Respiră lent. Nu trebuie să rezolvi tot acum. Alege o singură acțiune și trateaz-o ca pe singurul obiectiv al momentului.'
        : 'Breathe slowly. You do not need to solve everything now. Choose one single action and treat it as the only goal of this moment.';
    });

    $('#aacCoachPlan').addEventListener('click', () => {
      coachOutput.dataset.userEdited = 'true';
      coachOutput.textContent = currentLang === 'ro'
        ? 'Plan în 3 pași: 1) definește următoarea acțiune, 2) setează 5-10 minute, 3) marchează finalizarea și fă o pauză.'
        : '3-step plan: 1) define the next action, 2) set 5-10 minutes, 3) mark completion and take a break.';
    });

    $('#aacQuizNext').addEventListener('click', () => {
      state.quizIndex = (state.quizIndex + 1) % quizData.length;
      quizFeedback.dataset.userEdited = '';
      quizFeedback.textContent = translations[currentLang].accessArcade.quizDefaultFeedback;
      renderQuiz();
    });

    $('#aacQuizReset').addEventListener('click', () => {
      state.quizIndex = 0;
      state.quizScore = 0;
      quizFeedback.dataset.userEdited = '';
      quizFeedback.textContent = translations[currentLang].accessArcade.quizDefaultFeedback;
      renderStats();
      renderQuiz();
      renderSummary();
      renderBars();
    });

    function getMandalaPalette(tone) {
      const palettes = {
        calm: ['var(--mandala1)', 'var(--mandala2)', 'var(--mandala3)'],
        focus: ['var(--mandala3)', 'var(--mandala1)', '#ffffff'],
        energy: ['var(--mandala4)', 'var(--mandala2)', 'var(--mandala1)']
      };
      return palettes[tone];
    }

    $$('.aacMandalaTone').forEach(btn => {
      btn.addEventListener('click', () => {
        const tone = btn.dataset.tone;
        const palette = getMandalaPalette(tone);
        document.querySelectorAll('.mandala-node').forEach((node, idx) => {
          node.setAttribute('fill', palette[idx % palette.length]);
          node.setAttribute('opacity', '0.92');
        });
        mandalaNote.dataset.userEdited = 'true';
        mandalaNote.textContent = mandalaTones[currentLang][tone];
      });
    });

    document.querySelectorAll('.mandala-node').forEach(node => {
      node.addEventListener('click', () => {
        const fills = ['rgba(255,255,255,.08)', 'var(--mandala1)', 'var(--mandala2)', 'var(--mandala3)', 'var(--mandala4)'];
        const current = node.getAttribute('fill');
        const index = fills.indexOf(current);
        node.setAttribute('fill', fills[(index + 1) % fills.length]);
      });
    });

    $('#aacMandalaReset').addEventListener('click', () => {
      document.querySelectorAll('.mandala-node').forEach(node => {
        node.setAttribute('fill', 'rgba(255,255,255,.08)');
      });
      mandalaNote.dataset.userEdited = '';
      mandalaNote.textContent = currentLang === 'ro'
        ? 'Alege un ton și folosește cercurile ca exercițiu vizual lent. Modul nu cere precizie perfectă, ci ritm calm.'
        : 'Choose a tone and use the circles as a slow visual exercise. The module does not require perfect precision, but a calm rhythm.';
    });

    $('#aacMandalaReward').addEventListener('click', () => {
      state.xp += 12;
      state.missions += 1;
      renderStats();
      renderSummary();
      renderBars();
      mandalaNote.dataset.userEdited = 'true';
      mandalaNote.textContent = currentLang === 'ro'
        ? 'Sesiune încheiată. Ai primit XP pentru un exercițiu de reglare și focus.'
        : 'Session complete. You earned XP for a regulation and focus exercise.';
    });

    $$('.aacScratchPrompt').forEach(btn => {
      btn.addEventListener('click', () => {
        scratchPromptBox.dataset.userEdited = 'true';
        scratchPromptBox.textContent = scratchIdeas[currentLang][btn.dataset.type];
      });
    });

    $$('.scratch-block').forEach(btn => {
      btn.addEventListener('click', () => {
        scratchFlow.push(btn.dataset.block);
        scratchSequence.textContent = `${currentLang === 'ro' ? 'Flow' : 'Flow'}: ${scratchFlow.join(' → ')}`;
      });
    });

    $('#aacScratchReset').addEventListener('click', () => {
      scratchFlow = [];
      scratchSequence.textContent = `${currentLang === 'ro' ? 'Flow' : 'Flow'}: —`;
    });

    $('#aacScratchReward').addEventListener('click', () => {
      state.xp += 18;
      state.missions += 1;
      renderStats();
      renderSummary();
      renderBars();
      scratchPromptBox.dataset.userEdited = 'true';
      scratchPromptBox.textContent = currentLang === 'ro'
        ? 'Flow-ul creativ a fost salvat conceptual ca demo de storytelling și secvențiere logică.'
        : 'The creative flow was conceptually saved as a storytelling and logical sequencing demo.';
    });

    window.__applyAccessArcadeLanguage = applyAccessArcadeLanguage;

    renderStats();
    renderTasks();
    renderQuiz();
    renderSummary();
    renderBars();
    applyAccessArcadeLanguage(currentLang);
  }

  function init() {
    initPortfolioCore();
    initAccessArcade();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  document.addEventListener('DOMContentLoaded', init);
})();
