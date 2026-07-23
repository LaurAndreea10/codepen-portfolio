(() => {
  'use strict';

  const SNAPSHOT_MAIN =
    'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@35051b781a85a6271d48556d29919167226836ff/main.js';

  const DATE_ISO = '2026-07-23';
  const OBSERVER_TIMEOUT = 5000;

  const PERFORMANCE_CSS = `
html {
  scrollbar-gutter: stable;
}
@font-face {
  font-family: 'Inter-fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
@font-face {
  font-family: 'SpaceGrotesk-fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 95%;
  descent-override: 24%;
  line-gap-override: 0%;
}
body {
  font-family: Inter, 'Inter-fallback', system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
}
h1, h2, h3,
.hero-preview-top p,
.final-cta-card h2,
.now-title {
  font-family: 'Space Grotesk', 'SpaceGrotesk-fallback', system-ui, sans-serif;
}
.hero-preview-wrap {
  min-height: 0;
  aspect-ratio: 16 / 9;
}
.hero-preview-frame,
.hero-preview-fallback {
  width: 100%;
  height: 100%;
  min-height: 0;
}
@supports (content-visibility: auto) {
  main > section:not(.hero), .gh-section, .pow-section, .final-cta-section {
    content-visibility: auto;
    contain-intrinsic-size: auto 760px;
  }
}
.project-card, .pow-card, .cred-item { contain: layout paint; }
.now-panel-hidden, .learn-content[hidden], .scan-panel[hidden] { pointer-events: none; }
.project-card, .btn, .mini-btn, .pill, .cred-item { will-change: auto; }
@media (max-width: 900px), (hover: none) and (pointer: coarse) {
  .glass, .topbar, .pow-card, .scan-panel, .hero-preview, .hero-card {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  .project-card:hover, .btn:hover, .mini-btn:hover, .pill:hover,
  .nav-links a:hover, .cred-item:hover { transform: none; }
  #intro-overlay, #intro-skip { display: none !important; }
  body.intro-active { overflow: unset !important; }
  .hero-preview-wrap,
  .hero-preview-frame {
    min-height: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .scan-dot { animation: none !important; }
}`;

  function installPerformanceCSS() {
    if (document.getElementById('portfolio-performance-css')) return;
    const style = document.createElement('style');
    style.id = 'portfolio-performance-css';
    style.textContent = PERFORMANCE_CSS;
    document.head.appendChild(style);
  }

  function disableMobileIntro() {
    const isMobile = window.matchMedia(
      '(max-width: 900px), (hover: none) and (pointer: coarse)'
    ).matches;
    if (!isMobile) return;

    try {
      if (typeof window.stopIntroReplay === 'function') window.stopIntroReplay();
    } catch (_) {}

    document.body?.classList.remove('intro-active');
    document.getElementById('intro-overlay')?.remove();
    document.getElementById('intro-skip')?.remove();
    document.getElementById('intro-css')?.remove();

    try { sessionStorage.setItem('la_intro_seen', '1'); } catch (_) {}
  }

  installPerformanceCSS();
  disableMobileIntro();

  const currentLang = () =>
    document.documentElement.lang === 'en' ? 'en' : 'ro';

  function completedItem({ title, text, href, label }) {
    const li = document.createElement('li');
    li.className = 'now-item now-item-done';
    li.dataset.completedProject = title;

    const status = document.createElement('span');
    status.className = 'now-status';
    status.setAttribute('aria-hidden', 'true');
    status.textContent = '✅';

    const content = document.createElement('span');
    const strong = document.createElement('strong');
    const link = document.createElement('a');
    const tag = document.createElement('span');

    strong.textContent = title;
    link.className = 'now-item-link';
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    tag.className = 'now-tag now-tag-done';
    tag.textContent = currentLang() === 'en' ? 'Completed' : 'Finalizat';

    content.append(strong, ' ', link, ` — ${text}`, tag);
    li.append(status, content);
    return li;
  }

  function updateNowDate() {
    const date = document.querySelector('#now-datetime');
    if (!date) return false;

    const text = currentLang() === 'en' ? '23 July 2026' : '23 Iulie 2026';
    if (date.dateTime !== DATE_ISO) date.dateTime = DATE_ISO;
    if (date.textContent !== text) date.textContent = text;
    return true;
  }

  function addCompletedProjects() {
    const list = document.querySelector('#now-panel-done .now-checklist');
    if (!list) return false;

    const isEnglish = currentLang() === 'en';
    const projects = [
      {
        title: 'FileVerse 2.0',
        text: isEnglish
          ? 'CodePen 2.0 file-options challenge completed and published as a live GitHub Pages project.'
          : 'challenge-ul CodePen 2.0 dedicat opțiunilor pentru fișiere a fost finalizat și publicat live pe GitHub Pages.',
        href: 'https://laurandreea10.github.io/CodePen-2.0-file-options-challenge/',
        label: isEnglish ? 'Open project' : 'Deschide proiectul'
      },
      {
        title: 'BlockForge — CodePen Challenge: Blocks',
        text: isEnglish
          ? 'interactive blocks challenge completed and published as a live GitHub Pages project.'
          : 'challenge-ul interactiv dedicat blocurilor a fost finalizat și publicat live pe GitHub Pages.',
        href: 'https://laurandreea10.github.io/BlockForge-CodePen-Challenge-Blocks/',
        label: isEnglish ? 'Open project' : 'Deschide proiectul'
      },
      {
        title: 'Elsewhere — CodePen Challenge: View Transitions',
        text: isEnglish
          ? 'cinematic atlas with portal transitions, day/night views, compare mode, mini-map and optional soundscapes.'
          : 'atlas cinematografic cu tranziții portal, mod zi/noapte, compare view, mini-hartă și soundscape opțional.',
        href: 'https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/',
        label: isEnglish ? 'Open project' : 'Deschide proiectul'
      }
    ];

    const fragment = document.createDocumentFragment();
    for (const project of projects) {
      if (!list.querySelector(`[data-completed-project="${CSS.escape(project.title)}"]`)) {
        fragment.append(completedItem(project));
      }
    }

    if (fragment.childNodes.length) list.prepend(fragment);
    return projects.every(project =>
      list.querySelector(`[data-completed-project="${CSS.escape(project.title)}"]`)
    );
  }

  function addViewTransitionsCard() {
    if (document.querySelector('[data-project="elsewhere-view-transitions"]')) {
      return true;
    }

    const grid = document.querySelector('#latest-github .projects-grid');
    if (!grid) return false;

    const isEnglish = currentLang() === 'en';
    const card = document.createElement('article');
    card.className = 'project-card glass';
    card.dataset.project = 'elsewhere-view-transitions';
    card.innerHTML = `
      <span class="badge-new">NEW</span>
      <div class="project-top">
        <div>
          <h3>Elsewhere — View Transitions</h3>
          <span class="badge-github">CodePen Challenge</span>
        </div>
        <span class="tag github">challenge</span>
      </div>
      <p class="project-desc">${
        isEnglish
          ? 'Cinematic destination atlas with shared-element morphs, click-position portal reveals, day/night scenes, interactive mini-map, compare mode and optional soundscapes.'
          : 'Atlas cinematografic cu shared-element morphs, portal circular din punctul de click, scene zi/noapte, mini-hartă interactivă, compare mode și soundscape opțional.'
      }</p>
      <div class="card-actions">
        <a class="btn btn-primary"
           href="https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/"
           target="_blank" rel="noopener noreferrer">Live Demo</a>
        <a class="btn btn-secondary"
           href="https://github.com/LaurAndreea10/CodePen-Challenge-View-Transitions"
           target="_blank" rel="noopener noreferrer">GitHub &rarr;</a>
      </div>`;

    grid.prepend(card);
    return true;
  }

  function refreshAdditions() {
    const dateReady = updateNowDate();
    const completedReady = addCompletedProjects();
    const cardReady = addViewTransitionsCard();
    return dateReady && completedReady && cardReady;
  }

  function watchCompletedSection() {
    if (refreshAdditions()) return;

    const target = document.querySelector('main') || document.body;
    let scheduled = false;

    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;

      requestAnimationFrame(() => {
        scheduled = false;
        if (refreshAdditions()) observer.disconnect();
      });
    });

    observer.observe(target, { childList: true, subtree: true });

    window.setTimeout(() => {
      observer.disconnect();
      refreshAdditions();
    }, OBSERVER_TIMEOUT);
  }

  function loadSnapshot() {
    const script = document.createElement('script');
    script.src = SNAPSHOT_MAIN;
    script.defer = true;
    script.onload = () => {
      const idle = window.requestIdleCallback || (callback => setTimeout(callback, 150));
      idle(watchCompletedSection);
    };
    script.onerror = watchCompletedSection;
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSnapshot, { once: true });
  } else {
    loadSnapshot();
  }
})();