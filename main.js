(() => {
  'use strict';

  const PREVIOUS_MAIN =
    'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@c02951956477eacc6cb791b932b30c41d6d1b7da/main.js';

  const ACTIVE_WORK = [
    {
      title: 'Case study accessibility pass',
      tag: 'Accessibility',
      ro: 'Adaug skip links, focus states consecvente, alt text mai util pentru capturi și verific navigarea cu tastatura pe paginile projects/.',
      en: 'Add skip links, consistent focus states, stronger screenshot alt text and keyboard navigation checks across projects/ pages.'
    },
    {
      title: 'Technical proof cards',
      tag: 'Engineering proof',
      ro: 'Expun rapid pentru proiectele-cheie stack-ul, ownership-ul, arhitectura, state/data flow și deciziile tehnice care nu se văd doar din UI.',
      en: 'Expose stack, ownership, architecture, state/data flow and technical decisions that are not obvious from the UI alone.'
    },
    {
      title: 'GitHub repo hygiene & README consistency',
      tag: 'GitHub',
      ro: 'Uniformizez README-urile proiectelor principale: problemă, soluție, stack, setup, demo live, capturi, accesibilitate și roadmap.',
      en: 'Standardize flagship READMEs around problem, solution, stack, setup, live demo, screenshots, accessibility and roadmap.'
    },
    {
      title: 'Homepage density & hierarchy pass',
      tag: 'Portfolio UX',
      ro: 'Reduc repetițiile și zgomotul vizual, păstrez CRM/SaaS și Marketing-Tech în prim-plan și mut experimentele secundare mai jos.',
      en: 'Reduce repetition and visual noise, keep CRM/SaaS and Marketing-Tech in the foreground, and push secondary experiments lower.'
    },
    {
      title: 'Project card consistency system',
      tag: 'Design system',
      ro: 'Standardizez cardurile pe aceeași logică: Problemă → Soluție → Build → Stack → Live → Code, pentru scanare mai rapidă.',
      en: 'Standardize project cards around Problem → Solution → Build → Stack → Live → Code for faster scanning.'
    },
    {
      title: 'Trust & verification sweep',
      tag: 'Proof of work',
      ro: 'Verific linkurile live, repo-urile, CTA-urile, fallback-urile și etichetele live/demo și elimin orice dovadă neclară sau redundantă.',
      en: 'Verify live links, repositories, CTAs, fallbacks and live/demo labels, removing unclear or redundant proof.'
    }
  ];

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'ro';
  }

  function activeItem(task) {
    const en = currentLang() === 'en';
    const li = document.createElement('li');
    li.className = 'now-item now-item-active';
    li.dataset.activePortfolioTask = task.title;
    li.innerHTML = `
      <span class="now-status" aria-hidden="true">🔄</span>
      <span>
        <strong>${task.title}</strong>
        <span class="now-item-copy">${en ? task.en : task.ro}</span>
        <span class="now-tag">${task.tag}</span>
      </span>`;
    return li;
  }

  function populateActiveWork() {
    const list = document.querySelector('#now-panel-active .now-checklist');
    if (!list) return false;
    list.replaceChildren(...ACTIVE_WORK.map(activeItem));
    return true;
  }

  function installActiveStyles() {
    if (document.getElementById('active-work-styles')) return;
    const style = document.createElement('style');
    style.id = 'active-work-styles';
    style.textContent = `
      #now-panel-active .now-item > span:last-child { display:grid; gap:6px; }
      #now-panel-active .now-item-copy { display:block; color:var(--muted,#aeb7c8); font-size:13px; line-height:1.5; max-width:900px; }
      #now-panel-active .now-tag { width:max-content; font-size:11px; }
    `;
    document.head.appendChild(style);
  }

  function refreshActiveWork() {
    installActiveStyles();
    populateActiveWork();
  }

  function loadPreviousMain() {
    const script = document.createElement('script');
    script.src = PREVIOUS_MAIN;
    script.async = true;
    script.onload = () => {
      refreshActiveWork();
      window.setTimeout(refreshActiveWork, 700);
      window.setTimeout(refreshActiveWork, 1800);
    };
    script.onerror = refreshActiveWork;
    document.head.appendChild(script);
  }

  function init() {
    refreshActiveWork();
    loadPreviousMain();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();