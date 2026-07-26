(() => {
  'use strict';

  const SNAPSHOT_MAIN =
    'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@32d68e9388727fd0052b50b1c09b78da26dbf812/main.js';
  const DATE_ISO = '2026-07-23';
  const MOBILE_QUERY = '(max-width: 900px), (hover: none) and (pointer: coarse)';

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function installSafeMobileCSS() {
    if (!isMobile() || document.getElementById('safe-mobile-performance')) return;

    const style = document.createElement('style');
    style.id = 'safe-mobile-performance';
    style.textContent = `
      html { scrollbar-gutter: stable; }
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
      }
      h1, h2, h3, .hero-preview-top p, .final-cta-card h2, .now-title {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
      }
      html body #intro-overlay,
      html body #intro-skip {
        display: none !important;
      }
      html body.intro-active {
        overflow: auto !important;
      }
      .glass, .topbar, .pow-card, .scan-panel, .hero-preview, .hero-card {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      .project-card:hover, .btn:hover, .mini-btn:hover, .pill:hover,
      .nav-links a:hover, .cred-item:hover {
        transform: none !important;
      }
      .hero-preview-wrap,
      .hero-preview-frame,
      .hero-preview-fallback {
        min-height: 0;
      }
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

  const currentLang = () =>
    document.documentElement.lang === 'en' ? 'en' : 'ro';

  function updateNowDate() {
    const date = document.querySelector('#now-datetime');
    if (!date) return false;

    date.dateTime = DATE_ISO;
    date.textContent = currentLang() === 'en' ? '23 July 2026' : '23 Iulie 2026';
    return true;
  }

  function archiveCompletedToHistory() {
    const doneList = document.querySelector('#now-panel-done .now-checklist');
    const history = document.querySelector('#now-panel-history .now-history');
    if (!doneList || !history) return false;

    const isEnglish = currentLang() === 'en';
    const projects = [
      ['FileVerse 2.0', 'https://laurandreea10.github.io/CodePen-2.0-file-options-challenge/'],
      ['BlockForge — CodePen Challenge: Blocks', 'https://laurandreea10.github.io/BlockForge-CodePen-Challenge-Blocks/'],
      ['Elsewhere — CodePen Challenge: View Transitions', 'https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/']
    ];

    for (const [title, href] of projects) {
      if (doneList.querySelector(`[data-completed-project="${CSS.escape(title)}"]`)) continue;

      const li = document.createElement('li');
      li.className = 'now-item now-item-done';
      li.dataset.completedProject = title;
      li.innerHTML = `<span class="now-status" aria-hidden="true">✅</span><span><strong>${title}</strong> <a class="now-item-link" href="${href}" target="_blank" rel="noopener noreferrer">${isEnglish ? 'Open project' : 'Deschide proiectul'}</a><span class="now-tag now-tag-done">${isEnglish ? 'Completed' : 'Finalizat'}</span></span>`;
      doneList.prepend(li);
    }

    const items = Array.from(doneList.children);
    let archive = history.querySelector('[data-current-completed-archive]');

    if (!archive) {
      archive = document.createElement('div');
      archive.className = 'now-history-week';
      archive.dataset.currentCompletedArchive = 'true';
      archive.innerHTML = `<strong>${isEnglish ? 'Completed work · July 2026' : 'Proiecte finalizate · Iulie 2026'}</strong><ul class="now-checklist"></ul>`;
      history.prepend(archive);
    }

    const archiveList = archive.querySelector('.now-checklist');
    items.forEach(item => archiveList.appendChild(item));
    doneList.innerHTML = `<li class="now-item"><span class="now-status" aria-hidden="true">✓</span><span>${isEnglish ? 'Completed projects were moved to History.' : 'Proiectele finalizate au fost mutate în Istoric.'}</span></li>`;
    return true;
  }

  function addViewTransitionsCard() {
    if (document.querySelector('[data-project="elsewhere-view-transitions"]')) return true;

    const grid = document.querySelector('#latest-github .projects-grid');
    if (!grid) return false;

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
    return true;
  }

  function addPerformanceCaseStudyCard() {
    if (document.querySelector('[data-project="mobile-performance-case-study"]')) return true;

    const grid = document.querySelector('#latest-github .projects-grid');
    if (!grid) return false;

    const isEnglish = currentLang() === 'en';
    const card = document.createElement('article');
    card.className = 'project-card glass';
    card.dataset.project = 'mobile-performance-case-study';
    card.innerHTML = `
      <span class="badge-new">CASE STUDY</span>
      <div class="project-top">
        <div>
          <h3>${isEnglish ? 'Mobile Performance Optimization' : 'Optimizare performanță mobilă'}</h3>
          <span class="badge-github">Lighthouse · Core Web Vitals</span>
        </div>
        <span class="tag utility">performance</span>
      </div>
      <p class="project-desc">${isEnglish
        ? 'A transparent case study about raising mobile performance through isolated changes, repeated Lighthouse tests, CLS protection and fast rollback.'
        : 'Studiu de caz transparent despre creșterea performanței mobile prin modificări izolate, teste Lighthouse repetate, protejarea CLS și rollback rapid.'}</p>
      <div class="card-actions">
        <a class="btn btn-primary" href="./mobile-performance-case-study.html">${isEnglish ? 'Read case study' : 'Citește studiul de caz'}</a>
      </div>`;

    grid.prepend(card);
    return true;
  }

  function refreshAdditions() {
    return updateNowDate()
      && archiveCompletedToHistory()
      && addViewTransitionsCard()
      && addPerformanceCaseStudyCard();
  }

  function watchSections() {
    if (refreshAdditions()) return;

    const observer = new MutationObserver(() => {
      if (refreshAdditions()) observer.disconnect();
    });

    observer.observe(document.querySelector('main') || document.body, {
      childList: true,
      subtree: true
    });

    window.setTimeout(() => {
      observer.disconnect();
      refreshAdditions();
    }, 5000);
  }

  function loadSnapshot() {
    const script = document.createElement('script');
    script.src = SNAPSHOT_MAIN;
    script.async = true;
    script.onload = watchSections;
    script.onerror = watchSections;
    document.head.appendChild(script);
  }

  installSafeMobileCSS();
  bypassMobileGithubRequest();
  disableMobileIntro();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSnapshot, { once: true });
  } else {
    loadSnapshot();
  }
})();
