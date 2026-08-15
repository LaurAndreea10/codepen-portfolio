(() => {
  'use strict';

  const SNAPSHOT_MAIN =
    'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@32d68e9388727fd0052b50b1c09b78da26dbf812/main.js';
  const DATE_ISO = '2026-08-15';
  const MOBILE_QUERY = '(max-width: 900px), (hover: none) and (pointer: coarse)';

  const COMPLETED_PROJECTS = [
    { title: 'Case study screenshots & before/after visuals', href: '#ux-proof' },
    { title: 'Project metrics & validation notes', href: '#ux-proof' },
    { title: 'Portfolio content cleanup RO/EN', href: '#reviewer-path' },
    { title: 'Recruiter / reviewer quick path', href: '#reviewer-path' },
    { title: 'Email Alerts', href: 'https://laurandreea10.github.io/Email-Alerts/' },
    { title: 'MoonMail — Cosmic Receipt Email', href: 'https://laurandreea10.github.io/MoonMail-Cosmic-Receipt-Email/' },
    { title: 'HexWords 2048', href: 'https://laurandreea10.github.io/HexWords-2048/' },
    { title: 'TWO 2.0 — CodePen Challenge', href: 'https://laurandreea10.github.io/TWO-2.0/' },
    { title: 'Elsewhere — CodePen Challenge: View Transitions', href: 'https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/' },
    { title: 'BlockForge — CodePen Challenge: Blocks', href: 'https://laurandreea10.github.io/BlockForge-CodePen-Challenge-Blocks/' },
    { title: 'FileVerse 2.0', href: 'https://laurandreea10.github.io/CodePen-2.0-file-options-challenge/' }
  ];

  const UX_PROOF_PROJECTS = [
    {
      title: 'Alpis Fusion CRM Premium',
      live: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/',
      github: 'https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium',
      visual: 'image',
      source: 'alpis-fusion-demo-poster.svg',
      ro: {
        problem: 'Informația CRM era ușor de fragmentat între lead-uri, task-uri, billing și booking.',
        decision: 'Am grupat acțiunile într-un workspace modular, cu ierarhie vizuală și stări ușor de scanat.',
        proof: '6 module SaaS vizibile în produs; navigarea, stările și fluxurile pot fi verificate direct în demo.',
        verify: 'Deschide demo-ul și urmărește traseul Dashboard → Lead pipeline → Task / Billing / Booking.'
      },
      en: {
        problem: 'CRM information could easily become fragmented across leads, tasks, billing and booking.',
        decision: 'I grouped actions into a modular workspace with stronger hierarchy and scannable states.',
        proof: '6 SaaS modules are visible in the product; navigation, states and flows are directly verifiable in the demo.',
        verify: 'Open the demo and follow Dashboard → Lead pipeline → Task / Billing / Booking.'
      }
    },
    {
      title: 'ClientFlow PRO',
      live: 'https://laurandreea10.github.io/ClientFlow-PRO/login',
      github: 'https://github.com/LaurAndreea10',
      visual: 'frame',
      source: 'https://laurandreea10.github.io/ClientFlow-PRO/login',
      ro: {
        problem: 'Un flux de lucru cu clienți devine greu de urmărit când statusul, prioritatea, timpul și follow-up-ul sunt separate.',
        decision: 'Am tratat produsul ca un dashboard operațional: status, prioritate, automatizări și acțiuni într-un singur traseu.',
        proof: 'Flow-ul poate fi verificat live prin login/demo și prin modulele de calendar, task-uri, reminder și client portal.',
        verify: 'Intră în versiunea live și verifică succesiunea onboarding/login → dashboard → client/task → follow-up.'
      },
      en: {
        problem: 'Client work becomes hard to follow when status, priority, time and follow-up live in separate places.',
        decision: 'I treated the product as an operational dashboard: status, priority, automations and actions in one path.',
        proof: 'The flow is verifiable live through the login/demo and the calendar, task, reminder and client-portal modules.',
        verify: 'Open the live version and check onboarding/login → dashboard → client/task → follow-up.'
      }
    },
    {
      title: 'Link Video Editor Studio',
      live: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/',
      github: 'https://github.com/LaurAndreea10/Link-Video-Editor-Studio',
      visual: 'frame',
      source: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/',
      ro: {
        problem: 'Pregătirea unui workflow video din linkuri și parametri produce ușor pași manuali și rezultate greu de reutilizat.',
        decision: 'Am transformat inputurile într-un studio cu preseturi, sumar, exporturi și acțiuni grupate pe rezultat.',
        proof: 'Inputurile, presetul, Copy Summary și exporturile JSON/HTML/Automation Pack sunt verificabile direct.',
        verify: 'Completează URL + nume + mesaj + durată, apoi testează Generate, presetul și exporturile.'
      },
      en: {
        problem: 'Preparing a video workflow from links and parameters can create manual steps and hard-to-reuse outputs.',
        decision: 'I turned the inputs into a studio with presets, summaries, exports and outcome-based actions.',
        proof: 'Inputs, presets, Copy Summary and JSON/HTML/Automation Pack exports are directly verifiable.',
        verify: 'Enter URL + name + message + duration, then test Generate, a preset and the exports.'
      }
    }
  ];

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'ro';
  }

  function installSafeMobileCSS() {
    if (!isMobile() || document.getElementById('safe-mobile-performance')) return;
    const style = document.createElement('style');
    style.id = 'safe-mobile-performance';
    style.textContent = `
      html { scrollbar-gutter: stable; }
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important; }
      h1, h2, h3, .hero-preview-top p, .final-cta-card h2, .now-title {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
      }
      html body #intro-overlay, html body #intro-skip { display: none !important; }
      html body.intro-active { overflow: auto !important; }
      .glass, .topbar, .pow-card, .scan-panel, .hero-preview, .hero-card {
        backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
      }
      .project-card:hover, .btn:hover, .mini-btn:hover, .pill:hover,
      .nav-links a:hover, .cred-item:hover { transform: none !important; }
      .hero-preview-wrap, .hero-preview-frame, .hero-preview-fallback { min-height: 0; }
    `;
    document.head.appendChild(style);
  }

  function installProofStyles() {
    if (document.getElementById('portfolio-proof-styles')) return;
    const style = document.createElement('style');
    style.id = 'portfolio-proof-styles';
    style.textContent = `
      .reviewer-path, .ux-proof { scroll-margin-top: 90px; }
      .reviewer-shell, .ux-proof-shell { border:1px solid rgba(148,163,184,.22); border-radius:24px; padding:clamp(22px,4vw,42px); background:linear-gradient(145deg,rgba(11,23,43,.92),rgba(7,18,38,.72)); box-shadow:0 24px 80px rgba(0,0,0,.18); }
      .reviewer-kicker, .proof-kicker { font:600 12px/1.2 'JetBrains Mono',ui-monospace,monospace; letter-spacing:.12em; text-transform:uppercase; color:#8fbaff; }
      .reviewer-head, .proof-head { display:flex; gap:24px; align-items:flex-end; justify-content:space-between; margin-bottom:24px; }
      .reviewer-head h2, .proof-head h2 { margin:.4rem 0 0; max-width:780px; }
      .reviewer-copy, .proof-intro { max-width:760px; color:var(--muted,#aeb7c8); }
      .reviewer-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:12px; }
      .reviewer-step { min-height:128px; display:flex; flex-direction:column; justify-content:space-between; gap:16px; padding:18px; border:1px solid rgba(148,163,184,.18); border-radius:18px; background:rgba(255,255,255,.035); color:inherit; text-decoration:none; }
      .reviewer-step:hover { border-color:rgba(106,166,255,.5); transform:translateY(-2px); }
      .reviewer-num { font:500 12px/1 'JetBrains Mono',monospace; color:#8fbaff; }
      .reviewer-step strong { font-size:15px; }
      .reviewer-step span:last-child { color:var(--muted,#aeb7c8); font-size:13px; line-height:1.45; }
      .proof-grid { display:grid; gap:22px; }
      .proof-card { border:1px solid rgba(148,163,184,.18); border-radius:22px; padding:20px; background:rgba(255,255,255,.025); }
      .proof-card-head { display:flex; gap:16px; justify-content:space-between; align-items:flex-start; margin-bottom:18px; }
      .proof-card-head h3 { margin:0 0 6px; }
      .proof-links { display:flex; flex-wrap:wrap; gap:8px; }
      .proof-links a { font-size:12px; }
      .compare-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
      .compare-panel { overflow:hidden; border:1px solid rgba(148,163,184,.18); border-radius:18px; background:#08111f; }
      .compare-label { display:flex; justify-content:space-between; gap:10px; padding:10px 12px; font:600 11px/1.2 'JetBrains Mono',monospace; letter-spacing:.08em; text-transform:uppercase; border-bottom:1px solid rgba(148,163,184,.14); }
      .compare-label.before { color:#f5c27a; } .compare-label.after { color:#8fdfb1; }
      .before-wire { min-height:260px; padding:18px; display:grid; grid-template-columns:78px 1fr; gap:12px; opacity:.82; }
      .wire-side, .wire-block, .wire-line { border:1px dashed rgba(148,163,184,.26); background:rgba(148,163,184,.05); border-radius:10px; }
      .wire-side { min-height:220px; }
      .wire-main { display:grid; gap:10px; }
      .wire-line { height:30px; } .wire-block { min-height:82px; }
      .after-shot { width:100%; height:260px; display:block; object-fit:cover; object-position:top; border:0; background:#071226; }
      iframe.after-shot { pointer-events:none; }
      .proof-notes { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; margin-top:14px; }
      .proof-note { padding:14px; border-radius:14px; background:rgba(255,255,255,.035); border:1px solid rgba(148,163,184,.12); }
      .proof-note b { display:block; margin-bottom:6px; font-size:12px; color:#9cc2ff; text-transform:uppercase; letter-spacing:.06em; }
      .proof-note p { margin:0; font-size:13px; line-height:1.5; color:var(--muted,#aeb7c8); }
      @media (max-width:980px){ .reviewer-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.proof-notes{grid-template-columns:repeat(2,minmax(0,1fr))} }
      @media (max-width:700px){ .reviewer-head,.proof-head,.proof-card-head{align-items:flex-start;flex-direction:column}.reviewer-grid,.compare-grid,.proof-notes{grid-template-columns:1fr}.before-wire,.after-shot{min-height:220px;height:220px}.reviewer-step{min-height:100px} }
      @media (prefers-reduced-motion:reduce){ .reviewer-step:hover{transform:none} }
    `;
    document.head.appendChild(style);
  }

  function bypassMobileGithubRequest() {
    if (!isMobile()) return;
    const nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      const url = typeof input === 'string' ? input : input?.url || '';
      if (url.includes('api.github.com/users/LaurAndreea10')) {
        return Promise.resolve(new Response(JSON.stringify({ public_repos: 0 }), {
          status: 200, headers: { 'Content-Type': 'application/json' }
        }));
      }
      return nativeFetch(input, init);
    };
    window.setTimeout(() => { window.fetch = nativeFetch; }, 10000);
  }

  function disableMobileIntro() {
    if (!isMobile()) return;
    document.body?.classList.remove('intro-active');
    document.getElementById('intro-overlay')?.remove();
    document.getElementById('intro-skip')?.remove();
    document.getElementById('intro-css')?.remove();
    try { sessionStorage.setItem('la_intro_seen', '1'); } catch (_) {}
  }

  function updateNowDate() {
    const date = document.querySelector('#now-datetime');
    if (!date) return;
    date.dateTime = DATE_ISO;
    date.textContent = currentLang() === 'en' ? '15 August 2026' : '15 August 2026';
  }

  function projectItem(project, includeTag = true) {
    const isEnglish = currentLang() === 'en';
    const li = document.createElement('li');
    li.className = 'now-item now-item-done';
    li.dataset.completedProject = project.title;
    const tag = includeTag ? `<span class="now-tag now-tag-done">${isEnglish ? 'Completed' : 'Finalizat'}</span>` : '';
    li.innerHTML = `<span class="now-status" aria-hidden="true">✅</span><span><strong>${project.title}</strong> <a class="now-item-link" href="${project.href}"${project.href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${isEnglish ? 'Open proof' : 'Vezi dovada'}</a>${tag}</span>`;
    return li;
  }

  function populateCompletedSections() {
    const doneList = document.querySelector('#now-panel-done .now-checklist');
    const history = document.querySelector('#now-panel-history .now-history');
    if (!doneList || !history) return false;
    doneList.replaceChildren(...COMPLETED_PROJECTS.map(project => projectItem(project, true)));
    const archive = document.createElement('div');
    archive.className = 'now-history-week';
    archive.dataset.currentCompletedArchive = 'true';
    const heading = document.createElement('strong');
    heading.textContent = currentLang() === 'en' ? 'Recently completed projects' : 'Proiecte finalizate recent';
    const archiveList = document.createElement('ul');
    archiveList.className = 'now-checklist';
    archiveList.append(...COMPLETED_PROJECTS.map(project => projectItem(project, false)));
    archive.append(heading, archiveList);
    history.replaceChildren(archive);
    return true;
  }

  function removeImplementedTasksFromActive() {
    const activeList = document.querySelector('#now-panel-active .now-checklist');
    if (!activeList) return;
    const needles = ['Case study screenshots', 'Project metrics', 'Portfolio content cleanup', 'Recruiter / reviewer quick path'];
    [...activeList.children].forEach(item => {
      if (needles.some(needle => item.textContent.includes(needle))) item.remove();
    });
  }

  function addEmailAlertsToScanColumn() {
    const completedColumnTitle = Array.from(document.querySelectorAll('.scan-col-title')).find(title => title.textContent.includes('Finalizat recent'));
    const completedList = completedColumnTitle?.closest('.scan-col')?.querySelector('.scan-list');
    if (!completedList || completedList.querySelector('[data-scan-email-alerts]')) return false;
    const item = document.createElement('li');
    item.dataset.scanEmailAlerts = 'true';
    item.innerHTML = `✅ <strong>Email Alerts</strong> &mdash; <a href="https://laurandreea10.github.io/Email-Alerts/" target="_blank" rel="noopener noreferrer">${currentLang() === 'en' ? 'live project' : 'proiect live'}</a>`;
    completedList.prepend(item);
    return true;
  }

  function addPerformanceCaseStudyLink() {
    const completedColumnTitle = Array.from(document.querySelectorAll('.scan-col-title')).find(title => title.textContent.includes('Finalizat recent'));
    const completedColumn = completedColumnTitle?.closest('.scan-col');
    if (!completedColumn) return false;
    let linkWrap = completedColumn.querySelector('[data-scan-performance-case-study]');
    if (!linkWrap) {
      linkWrap = document.createElement('p');
      linkWrap.className = 'scan-case-study-link';
      linkWrap.dataset.scanPerformanceCaseStudy = 'true';
      completedColumn.appendChild(linkWrap);
    }
    const isEnglish = currentLang() === 'en';
    linkWrap.innerHTML = `<a href="https://laurandreea10.github.io/codepen-portfolio/mobile-performance-case-study.html">${isEnglish ? 'Open the mobile performance case study' : 'Deschide studiul de caz despre performanța mobilă'}</a>`;
    return true;
  }

  function addViewTransitionsCard() {
    if (document.querySelector('[data-project="elsewhere-view-transitions"]')) return;
    const grid = document.querySelector('#latest-github .projects-grid');
    if (!grid) return;
    const card = document.createElement('article');
    card.className = 'project-card glass';
    card.dataset.project = 'elsewhere-view-transitions';
    card.innerHTML = `<span class="badge-new">NEW</span><div class="project-top"><div><h3>Elsewhere — View Transitions</h3><span class="badge-github">CodePen Challenge</span></div><span class="tag github">challenge</span></div><p class="project-desc">Atlas cinematografic cu shared-element morphs, portal circular, scene zi/noapte, mini-hartă interactivă și compare mode.</p><div class="card-actions"><a class="btn btn-primary" href="https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/" target="_blank" rel="noopener noreferrer">Live Demo</a><a class="btn btn-secondary" href="https://github.com/LaurAndreea10/CodePen-Challenge-View-Transitions" target="_blank" rel="noopener noreferrer">GitHub &rarr;</a></div>`;
    grid.prepend(card);
  }

  function addReviewerQuickPath() {
    const anchor = document.querySelector('#latest-github') || document.querySelector('main > section');
    if (!anchor || document.getElementById('reviewer-path')) return;
    const en = currentLang() === 'en';
    const section = document.createElement('section');
    section.id = 'reviewer-path';
    section.className = 'reviewer-path';
    section.setAttribute('aria-labelledby', 'reviewer-path-title');
    section.innerHTML = `<div class="container"><div class="reviewer-shell"><div class="reviewer-head"><div><span class="reviewer-kicker">${en ? '30–60 second review' : 'Review în 30–60 secunde'}</span><h2 id="reviewer-path-title">${en ? 'A fast path through the strongest proof of work' : 'Traseu rapid prin cele mai relevante dovezi de lucru'}</h2></div><p class="reviewer-copy">${en ? 'Start with three product-focused projects, then verify the decisions in live demos or code.' : 'Începe cu trei proiecte orientate pe produs, apoi verifică deciziile direct în demo-uri sau cod.'}</p></div><div class="reviewer-grid"><a class="reviewer-step" href="#ux-proof"><span class="reviewer-num">01</span><strong>${en ? 'Top 3 projects' : 'Top 3 proiecte'}</strong><span>${en ? 'CRM, SaaS workflow, creator tooling' : 'CRM, workflow SaaS, creator tooling'}</span></a><a class="reviewer-step" href="#ux-proof"><span class="reviewer-num">02</span><strong>${en ? 'UX proof' : 'UX proof'}</strong><span>${en ? 'Problem → decision → verification' : 'Problemă → decizie → verificare'}</span></a><a class="reviewer-step" href="https://github.com/LaurAndreea10" target="_blank" rel="noopener noreferrer"><span class="reviewer-num">03</span><strong>GitHub</strong><span>${en ? 'Public repositories and implementation' : 'Repo-uri publice și implementare'}</span></a><a class="reviewer-step" href="#latest-github"><span class="reviewer-num">04</span><strong>${en ? 'Live demos' : 'Demo-uri live'}</strong><span>${en ? 'Open the working products' : 'Deschide produsele funcționale'}</span></a><a class="reviewer-step" href="mailto:andreealaurap@gmail.com?subject=Portfolio%20review"><span class="reviewer-num">05</span><strong>${en ? 'Contact' : 'Contact'}</strong><span>${en ? 'One-click email path' : 'Contact direct prin email'}</span></a></div></div></div>`;
    anchor.parentNode.insertBefore(section, anchor);
  }

  function beforeVisual() {
    return `<div class="before-wire" aria-hidden="true"><div class="wire-side"></div><div class="wire-main"><div class="wire-line"></div><div class="wire-block"></div><div class="wire-line"></div><div class="wire-block"></div></div></div>`;
  }

  function proofCard(project, index) {
    const en = currentLang() === 'en';
    const copy = en ? project.en : project.ro;
    const after = project.visual === 'image'
      ? `<img class="after-shot" src="${project.source}" alt="${project.title} — ${en ? 'current interface preview' : 'preview interfață actuală'}" loading="lazy" decoding="async">`
      : `<iframe class="after-shot proof-live-frame" title="${project.title} — live preview" data-src="${project.source}" loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms" tabindex="-1"></iframe>`;
    return `<article class="proof-card"><div class="proof-card-head"><div><span class="proof-kicker">0${index + 1} · ${en ? 'Case study visual' : 'Studiu de caz vizual'}</span><h3>${project.title}</h3></div><div class="proof-links"><a class="btn btn-primary" href="${project.live}" target="_blank" rel="noopener noreferrer">Live Demo</a><a class="btn btn-secondary" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a></div></div><div class="compare-grid"><div class="compare-panel"><div class="compare-label before"><span>${en ? 'Before' : 'Înainte'}</span><span>${en ? 'Fragmented flow' : 'Flow fragmentat'}</span></div>${beforeVisual()}</div><div class="compare-panel"><div class="compare-label after"><span>${en ? 'After' : 'După'}</span><span>${en ? 'Current product' : 'Produs actual'}</span></div>${after}</div></div><div class="proof-notes"><div class="proof-note"><b>${en ? 'Problem' : 'Problemă'}</b><p>${copy.problem}</p></div><div class="proof-note"><b>${en ? 'UX decision' : 'Decizie UX'}</b><p>${copy.decision}</p></div><div class="proof-note"><b>${en ? 'Observable proof' : 'Dovadă observabilă'}</b><p>${copy.proof}</p></div><div class="proof-note"><b>${en ? 'Verify live' : 'Verificare live'}</b><p>${copy.verify}</p></div></div></article>`;
  }

  function addUxProofSection() {
    const anchor = document.querySelector('#key-projects') || document.querySelector('#latest-github');
    if (!anchor || document.getElementById('ux-proof')) return;
    const en = currentLang() === 'en';
    const section = document.createElement('section');
    section.id = 'ux-proof';
    section.className = 'ux-proof';
    section.setAttribute('aria-labelledby', 'ux-proof-title');
    section.innerHTML = `<div class="container"><div class="ux-proof-shell"><div class="proof-head"><div><span class="proof-kicker">${en ? 'Visual case studies + validation' : 'Studii de caz vizuale + validare'}</span><h2 id="ux-proof-title">${en ? 'Scan the change, then verify it live' : 'Scanează schimbarea, apoi verific-o live'}</h2></div><p class="proof-intro">${en ? 'No invented conversion rates or user-testing claims: each note points to something observable in the working product.' : 'Fără procente inventate sau afirmații de user testing: fiecare notă indică ceva observabil în produsul funcțional.'}</p></div><div class="proof-grid">${UX_PROOF_PROJECTS.map(proofCard).join('')}</div></div></div>`;
    anchor.parentNode.insertBefore(section, anchor.nextSibling);
    hydrateProofFrames();
  }

  function hydrateProofFrames() {
    const frames = [...document.querySelectorAll('.proof-live-frame[data-src]')];
    if (!frames.length) return;
    if (!('IntersectionObserver' in window)) {
      frames.forEach(frame => { frame.src = frame.dataset.src; frame.removeAttribute('data-src'); });
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const frame = entry.target;
        frame.src = frame.dataset.src;
        frame.removeAttribute('data-src');
        observer.unobserve(frame);
      });
    }, { rootMargin: '250px 0px' });
    frames.forEach(frame => observer.observe(frame));
  }

  function refreshContent() {
    installProofStyles();
    updateNowDate();
    populateCompletedSections();
    removeImplementedTasksFromActive();
    addEmailAlertsToScanColumn();
    addPerformanceCaseStudyLink();
    addViewTransitionsCard();
    addReviewerQuickPath();
    addUxProofSection();
  }

  function loadSnapshot() {
    const script = document.createElement('script');
    script.src = SNAPSHOT_MAIN;
    script.async = true;
    script.onload = refreshContent;
    script.onerror = refreshContent;
    document.head.appendChild(script);
  }

  function init() {
    installSafeMobileCSS();
    bypassMobileGithubRequest();
    disableMobileIntro();
    refreshContent();
    loadSnapshot();
    window.setTimeout(refreshContent, 500);
    window.setTimeout(refreshContent, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();