(() => {
  'use strict';

  const SNAPSHOT_MAIN =
    'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@32d68e9388727fd0052b50b1c09b78da26dbf812/main.js';
  const DATE_ISO = '2026-07-28';
  const MOBILE_QUERY = '(max-width: 900px), (hover: none) and (pointer: coarse)';

  const JULY_PROJECTS = [
    { title: 'TWO 2.0 — CodePen Challenge', href: 'https://laurandreea10.github.io/TWO-2.0/' },
    { title: 'Elsewhere — CodePen Challenge: View Transitions', href: 'https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/' },
    { title: 'BlockForge — CodePen Challenge: Blocks', href: 'https://laurandreea10.github.io/BlockForge-CodePen-Challenge-Blocks/' },
    { title: 'FileVerse 2.0', href: 'https://laurandreea10.github.io/CodePen-2.0-file-options-challenge/' }
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
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      .project-card:hover, .btn:hover, .mini-btn:hover, .pill:hover,
      .nav-links a:hover, .cred-item:hover { transform: none !important; }
      .hero-preview-wrap, .hero-preview-frame, .hero-preview-fallback { min-height: 0; }
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
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return nativeFetch(input, init);
    };

    window.setTimeout(() => {
      window.fetch = nativeFetch;
    }, 10000);
  }

  function disableMobileIntro() {
    if (!isMobile()) return;

    document.body?.classList.remove('intro-active');
    document.getElementById('intro-overlay')?.remove();
    document.getElementById('intro-skip')?.remove();
    document.getElementById('intro-css')?.remove();

    try {
      sessionStorage.setItem('la_intro_seen', '1');
    } catch (_) {}
  }

  function updateNowDate() {
    const date = document.querySelector('#now-datetime');
    if (!date) return;

    date.dateTime = DATE_ISO;
    date.textContent = currentLang() === 'en' ? '28 July 2026' : '28 Iulie 2026';
  }

  function projectItem(project, includeTag = true) {
    const isEnglish = currentLang() === 'en';
    const li = document.createElement('li');
    li.className = 'now-item now-item-done';
    li.dataset.completedProject = project.title;

    const tag = includeTag
      ? `<span class="now-tag now-tag-done">${isEnglish ? 'Completed' : 'Finalizat'}</span>`
      : '';

    li.innerHTML = `
      <span class="now-status" aria-hidden="true">✅</span>
      <span>
        <strong>${project.title}</strong>
        <a class="now-item-link" href="${project.href}" target="_blank" rel="noopener noreferrer">
          ${isEnglish ? 'Open project' : 'Deschide proiectul'}
        </a>
        ${tag}
      </span>`;

    return li;
  }

  function populateJulySections() {
    const doneList = document.querySelector('#now-panel-done .now-checklist');
    const history = document.querySelector('#now-panel-history .now-history');
    if (!doneList || !history) return false;

    doneList.replaceChildren(...JULY_PROJECTS.map(project => projectItem(project, true)));

    const archive = document.createElement('div');
    archive.className = 'now-history-week';
    archive.dataset.currentCompletedArchive = 'true';

    const heading = document.createElement('strong');
    heading.textContent = currentLang() === 'en'
      ? 'Completed projects · July 2026'
      : 'Proiecte finalizate · Iulie 2026';

    const archiveList = document.createElement('ul');
    archiveList.className = 'now-checklist';
    archiveList.append(...JULY_PROJECTS.map(project => projectItem(project, false)));

    archive.append(heading, archiveList);
    history.replaceChildren(archive);
    return true;
  }

  function addPerformanceCaseStudyLink() {
    const completedColumnTitle = Array.from(document.querySelectorAll('.scan-col-title'))
      .find(title => title.textContent.includes('Finalizat recent'));
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
    linkWrap.innerHTML = `<a href="./mobile-performance-case-study.html">${
      isEnglish
        ? 'Open the mobile performance case study'
        : 'Deschide studiul de caz despre performanța mobilă'
    }</a>`;
    return true;
  }

  function addViewTransitionsCard() {
    if (document.querySelector('[data-project="elsewhere-view-transitions"]')) return;

    const grid = document.querySelector('#latest-github .projects-grid');
    if (!grid) return;

    const card = document.createElement('article');
    card.className = 'project-card glass';
    card.dataset.project = 'elsewhere-view-transitions';
    card.innerHTML = `
      <span class="badge-new">NEW</span>
      <div class="project-top"><div><h3>Elsewhere — View Transitions</h3><span class="badge-github">CodePen Challenge</span></div><span class="tag github">challenge</span></div>
      <p class="project-desc">Atlas cinematografic cu shared-element morphs, portal circular, scene zi/noapte, mini-hartă interactivă și compare mode.</p>
      <div class="card-actions">
        <a class="btn btn-primary" href="https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/" target="_blank" rel="noopener noreferrer">Live Demo</a>
        <a class="btn btn-secondary" href="https://github.com/LaurAndreea10/CodePen-Challenge-View-Transitions" target="_blank" rel="noopener noreferrer">GitHub &rarr;</a>
      </div>`;
    grid.prepend(card);
  }

  function refreshJulyContent() {
    updateNowDate();
    populateJulySections();
    addPerformanceCaseStudyLink();
    addViewTransitionsCard();
  }

  function loadSnapshot() {
    const script = document.createElement('script');
    script.src = SNAPSHOT_MAIN;
    script.async = true;
    script.onload = refreshJulyContent;
    script.onerror = refreshJulyContent;
    document.head.appendChild(script);
  }

  function init() {
    installSafeMobileCSS();
    bypassMobileGithubRequest();
    disableMobileIntro();
    refreshJulyContent();
    loadSnapshot();
    window.setTimeout(refreshJulyContent, 500);
    window.setTimeout(refreshJulyContent, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();