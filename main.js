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
      date.dateTime = '2026-07-15';
      date.textContent = currentLang() === 'en' ? '15 July 2026' : '15 Iulie 2026';
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
      }
    ];

    projects.slice().reverse().forEach(project => {
      if (!list.querySelector(`[data-completed-project="${project.title}"]`)) {
        list.prepend(completedItem(project));
      }
    });
  }

  function watchCompletedSection() {
    addCompletedProjects();
    const list = document.querySelector('#now-panel-done .now-checklist');
    if (!list) return;

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        addCompletedProjects();
      });
    });
    observer.observe(list, { childList: true });
  }

  function loadSnapshot() {
    const script = document.createElement('script');
    script.src = SNAPSHOT_MAIN;
    script.defer = true;
    script.onload = () => {
      window.setTimeout(watchCompletedSection, 1800);
      window.setTimeout(addCompletedProjects, 2600);
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
