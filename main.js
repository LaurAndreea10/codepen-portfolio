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
      heroSecondary: 'Deschide Alpis Fusion →'
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
      heroSecondary: 'Open Alpis Fusion →'
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
        { text: 'Check-in de 1 minut', done: false },
        { text: '10 minute focus', done: false },
        { text: 'Quiz scurt cu feedback calm', done: false },
        { text: 'Pauză scurtă și recap', done: false },
        { text: 'Întreabă coach-ul pentru următorul pas', done: false }
      ]
    };

    const $ = (sel) => section.querySelector(sel);
    const $$ = (sel) => [...section.querySelectorAll(sel)];

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
        q: 'Care este cea mai bună abordare pentru un utilizator copleșit de multe informații?',
        options: [
          'Să vadă toate panourile simultan',
          'Să primească pași mici și un singur CTA clar',
          'Să primească mai multe animații pentru orientare'
        ],
        correct: 1,
        good: 'Corect. Pașii mici și un CTA clar reduc supraîncărcarea cognitivă.',
        bad: 'Mai bine alegi pași mici și un CTA clar. Asta scade fricțiunea și ajută orientarea.'
      },
      {
        q: 'Ce setare este utilă pentru sensibilitate la mișcare?',
        options: ['High contrast', 'Reduce motion', 'Light mode only'],
        correct: 1,
        good: 'Corect. Reduce motion este util pentru utilizatorii sensibili la animații sau tranziții.',
        bad: 'Răspunsul mai potrivit este Reduce motion.'
      },
      {
        q: 'De ce este utilă salvarea preferințelor în localStorage?',
        options: [
          'Pentru o experiență mai predictibilă la revenire',
          'Doar pentru design vizual',
          'Ca să mărești scorul fără logică'
        ],
        correct: 0,
        good: 'Corect. Persistența preferințelor reduce efortul repetitiv și crește predictibilitatea.',
        bad: 'Varianta bună este salvarea pentru o experiență predictibilă la revenire.'
      },
      {
        q: 'Ce face un workspace cu tab-uri mai accesibil?',
        options: [
          'Ascunde tot conținutul important',
          'Separă zonele pe roluri și reduce aglomerarea',
          'Adaugă mai multe efecte vizuale'
        ],
        correct: 1,
        good: 'Corect. Tab-urile pot simplifica orientarea și pot grupa conținutul logic.',
        bad: 'Workspace-ul cu tab-uri ajută când separă zonele pe roluri și reduce aglomerarea.'
      },
      {
        q: 'Ce tip de feedback e mai potrivit într-o aplicație accesibilă?',
        options: [
          'Penalizare agresivă și mesaje dure',
          'Feedback calm, clar și orientat pe următorul pas',
          'Mesaje vagi fără direcție'
        ],
        correct: 1,
        good: 'Corect. Feedback-ul calm și clar susține autonomia și reduce stresul.',
        bad: 'Varianta mai potrivită este feedback calm, clar și orientat pe următorul pas.'
      }
    ];

    const moodMessages = {
      '🙂': 'Stare calmă detectată. Poți continua cu un traseu scurt sau cu un exercițiu Mandala Calm.',
      '😕': 'Pari obosită. Începe cu un pas mic și o sesiune de focus scurtă.',
      '😣': 'Pari copleșită. Prioritizează o singură acțiune și cere coach-ului un plan simplu.',
      '🔥': 'Ai energie bună. Este un moment potrivit pentru quiz și un flow creativ în Scratch Lab.'
    };

    const scratchIdeas = {
      story: 'Idee: personajul pornește într-o misiune de dimineață, găsește 3 pași clari și primește un badge calm.',
      motion: 'Idee: creează o secvență cu mișcare lentă, pauză și feedback vizual simplu.',
      dialog: 'Idee: construiește un dialog între utilizator și coach cu 3 replici utile și blânde.'
    };

    const mandalaTones = {
      calm: 'Mandala calmă: urmărește ritmul cercurilor și schimbă doar câteva elemente, fără grabă.',
      focus: 'Mandala focus: colorează vizual din exterior spre centru și respiră lent între pași.',
      energy: 'Mandala energy: alternează nodurile și creează un pattern viu, dar clar.'
    };

    function renderSummary() {
      const done = state.tasks.filter(t => t.done).length;
      summary.textContent = `Profil activ: ${state.profile}. Mood: ${state.mood}. Taskuri bifate: ${done}/${state.tasks.length}. XP total: ${state.xp}. Conceptul este prezentat aici ca proiect flagship de accesibilitate și product UX.`;
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
            <span class="task-text">${task.text}</span>
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
      quizQuestion.textContent = current.q;
      quizMeta.textContent = `Întrebare ${state.quizIndex + 1} din ${quizData.length}`;
      quizOptions.innerHTML = '';
      current.options.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => {
          [...quizOptions.children].forEach(el => el.classList.remove('selected'));
          btn.classList.add('selected');
          if (idx === current.correct) {
            quizFeedback.textContent = current.good;
            state.quizScore = Math.min(5, state.quizScore + 1);
            state.xp += 10;
          } else {
            quizFeedback.textContent = current.bad;
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

    $$('[data-flagship-tab]').forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.dataset.flagshipTab));
    });

    $$('.flagship-tab').forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.dataset.tab));
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
        moodNote.textContent = moodMessages[state.mood];
        renderSummary();
      });
    });

    $('#aacRewardTasks').addEventListener('click', () => {
      const done = state.tasks.filter(t => t.done).length;
      if (!done) {
        renderSummary();
        summary.textContent = 'Mai întâi bifează cel puțin un task, apoi reaplică recompensa.';
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
      if (/bloc|stres|panic|copleș/.test(text)) {
        coachOutput.textContent = 'Hai să reducem totul la minim. 1) oprește-te 30 de secunde, 2) alege o singură sarcină, 3) fă doar începutul ei pentru 5 minute.';
      } else if (/rutin|diminea|zi/.test(text)) {
        coachOutput.textContent = 'Rutină blândă: check-in de 1 minut, 10 minute focus, pauză scurtă, apoi un singur task mic.';
      } else if (/quiz|studi|învăț/.test(text)) {
        coachOutput.textContent = 'Plan de studiu: 1) subiect mic, 2) 5 minute citit, 3) un răspuns sau quiz, 4) recap într-o propoziție.';
      } else {
        coachOutput.textContent = 'Începe cu un pas mic și clar. Alege o acțiune sub 10 minute, fă-o, apoi revino pentru următorul pas.';
      }
    });

    $('#aacCoachCalm').addEventListener('click', () => {
      coachOutput.textContent = 'Respiră lent. Nu trebuie să rezolvi tot acum. Alege o singură acțiune și trateaz-o ca pe singurul obiectiv al momentului.';
    });

    $('#aacCoachPlan').addEventListener('click', () => {
      coachOutput.textContent = 'Plan în 3 pași: 1) definește următoarea acțiune, 2) setează 5-10 minute, 3) marchează finalizarea și fă o pauză.';
    });

    $('#aacQuizNext').addEventListener('click', () => {
      state.quizIndex = (state.quizIndex + 1) % quizData.length;
      quizFeedback.textContent = 'Alege un răspuns ca să primești feedback.';
      renderQuiz();
    });

    $('#aacQuizReset').addEventListener('click', () => {
      state.quizIndex = 0;
      state.quizScore = 0;
      quizFeedback.textContent = 'Alege un răspuns ca să primești feedback.';
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
        mandalaNote.textContent = mandalaTones[tone];
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
      mandalaNote.textContent = 'Alege un ton și folosește cercurile ca exercițiu vizual lent. Modul nu cere precizie perfectă, ci ritm calm.';
    });

    $('#aacMandalaReward').addEventListener('click', () => {
      state.xp += 12;
      state.missions += 1;
      renderStats();
      renderSummary();
      renderBars();
      mandalaNote.textContent = 'Sesiune încheiată. Ai primit XP pentru un exercițiu de reglare și focus.';
    });

    $$('.aacScratchPrompt').forEach(btn => {
      btn.addEventListener('click', () => {
        scratchPromptBox.textContent = scratchIdeas[btn.dataset.type];
      });
    });

    $$('.scratch-block').forEach(btn => {
      btn.addEventListener('click', () => {
        scratchFlow.push(btn.dataset.block);
        scratchSequence.textContent = `Flow: ${scratchFlow.join(' → ')}`;
      });
    });

    $('#aacScratchReset').addEventListener('click', () => {
      scratchFlow = [];
      scratchSequence.textContent = 'Flow: —';
    });

    $('#aacScratchReward').addEventListener('click', () => {
      state.xp += 18;
      state.missions += 1;
      renderStats();
      renderSummary();
      renderBars();
      scratchPromptBox.textContent = 'Flow-ul creativ a fost salvat conceptual ca demo de storytelling și secvențiere logică.';
    });

    renderTasks();
    renderQuiz();
    renderStats();
    renderSummary();
    renderBars();
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
