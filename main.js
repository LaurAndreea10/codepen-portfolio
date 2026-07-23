(() => {
  'use strict';

  const SNAPSHOT_MAIN = 'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@35051b781a85a6271d48556d29919167226836ff/main.js';

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'ro';
  }

  function completedItem({ title, text, href, label }) {
    const li = document.createElement('li');
    li.className = 'now-item now-item-done';
    li.dataset.completedProject = title;
    li.innerHTML = `
      <span class="now-status" aria-hidden="true">✅</span>
      <span><strong>${title}</strong> <a class="now-item-link" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a> — ${text}<span class="now-tag now-tag-done">${currentLang() === 'en' ? 'Completed' : 'Finalizat'}</span></span>
    `;
    return li;
  }

  function addCompletedProjects() {
    const date = document.querySelector('#now-datetime');
    if (date) {
      date.dateTime = '2026-07-23';
      date.textContent = currentLang() === 'en' ? '23 July 2026' : '23 Iulie 2026';
    }

    const list = document.querySelector('#now-panel-done .now-checklist');
    if (!list) return;

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

    projects.slice().reverse().forEach(project => {
      if (!list.querySelector(`[data-completed-project="${project.title}"]`)) {
        list.prepend(completedItem(project));
      }
    });
  }

  function addViewTransitionsCard() {
    if (document.querySelector('[data-project="elsewhere-view-transitions"]')) return;
    const grid = document.querySelector('#latest-github .projects-grid');
    if (!grid) return;
    const isEnglish = currentLang() === 'en';
    const card = document.createElement('article');
    card.className = 'project-card glass';
    card.dataset.project = 'elsewhere-view-transitions';
    card.innerHTML = `
      <span class="badge-new">NEW</span>
      <div class="project-top"><div><h3>Elsewhere — View Transitions</h3><span class="badge-github">CodePen Challenge</span></div><span class="tag github">challenge</span></div>
      <p class="project-desc">${isEnglish
        ? 'Cinematic destination atlas with shared-element morphs, click-position portal reveals, day/night scenes, interactive mini-map, compare mode and optional soundscapes.'
        : 'Atlas cinematografic cu shared-element morphs, portal circular din punctul de click, scene zi/noapte, mini-hartă interactivă, compare mode și soundscape opțional.'}</p>
      <div class="card-actions">
        <a class="btn btn-primary" href="https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/" target="_blank" rel="noopener noreferrer">Live Demo</a>
        <a class="btn btn-secondary" href="https://github.com/LaurAndreea10/CodePen-Challenge-View-Transitions" target="_blank" rel="noopener noreferrer">GitHub &rarr;</a>
      </div>`;
    grid.prepend(card);
  }

  function refreshAdditions() {
    addCompletedProjects();
    addViewTransitionsCard();
  }

  function watchCompletedSection() {
    refreshAdditions();
    const target = document.querySelector('main') || document.body;
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        refreshAdditions();
      });
    });
    observer.observe(target, { childList: true, subtree: true });
  }

  function loadSnapshot() {
    const script = document.createElement('script');
    script.src = SNAPSHOT_MAIN;
    script.defer = true;
    script.onload = () => {
      window.setTimeout(watchCompletedSection, 1800);
      window.setTimeout(refreshAdditions, 2600);
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
