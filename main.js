(() => {
  'use strict';

  const SNAPSHOT_MAIN =
    'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@32d68e9388727fd0052b50b1c09b78da26dbf812/main.js';
  const FULL_CSS =
    'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@82c3eaf8541e90b498c30d05f078966a0164a15d/style.css';
  const DATE_ISO = '2026-07-23';

  const currentLang = () => document.documentElement.lang === 'en' ? 'en' : 'ro';

  function loadDeferredFullCSS() {
    if (document.getElementById('portfolio-full-css')) return;
    const load = () => {
      const link = document.createElement('link');
      link.id = 'portfolio-full-css';
      link.rel = 'stylesheet';
      link.href = FULL_CSS;
      document.head.appendChild(link);
    };
    requestAnimationFrame(() => setTimeout(load, 0));
  }

  function installPerformanceCSS() {
    if (document.getElementById('portfolio-performance-css')) return;
    const style = document.createElement('style');
    style.id = 'portfolio-performance-css';
    style.textContent = `
      @font-face{font-family:'Inter-fallback';src:local('Arial');size-adjust:107%;ascent-override:90%;descent-override:22%;line-gap-override:0%}
      @font-face{font-family:'SpaceGrotesk-fallback';src:local('Arial');size-adjust:105%;ascent-override:95%;descent-override:24%;line-gap-override:0%}
      body{font-family:Inter,'Inter-fallback',system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      h1,h2,h3,.hero-preview-top p,.final-cta-card h2,.now-title{font-family:'Space Grotesk','SpaceGrotesk-fallback',system-ui,sans-serif}
      .hero-preview-wrap{min-height:0;aspect-ratio:16/9}
      .hero-preview-frame,.hero-preview-fallback{width:100%;height:100%;min-height:0}
      #intro-overlay .s2 .rule{width:min(560px,70vw)!important;transform:scaleX(0);transform-origin:left center;animation-name:portfolio-rule-grow!important}
      @keyframes portfolio-rule-grow{to{transform:scaleX(1)}}
      .project-card,.pow-card,.cred-item{contain:layout paint}
      .now-history-week .now-checklist{margin-top:.75rem}
      @media(max-width:900px),(hover:none) and (pointer:coarse){
        #intro-overlay,#intro-skip{display:none!important}
        body.intro-active{overflow:visible!important}
        .glass,.topbar,.pow-card,.scan-panel,.hero-preview,.hero-card{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function bypassSlowGithubApi() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slow = Boolean(connection && (connection.saveData || /(?:^|-)2g|slow-2g|3g/.test(connection.effectiveType || '')));
    if (!slow && !matchMedia('(max-width:900px)').matches) return;
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = typeof input === 'string' ? input : input?.url || '';
      if (url.includes('api.github.com/users/LaurAndreea10')) {
        return Promise.resolve(new Response('{"public_repos":0}', {status:200, headers:{'Content-Type':'application/json'}}));
      }
      return nativeFetch(input, init);
    };
    setTimeout(() => { window.fetch = nativeFetch; }, 10000);
  }

  function disableMobileIntro() {
    if (!matchMedia('(max-width:900px),(hover:none) and (pointer:coarse)').matches) return;
    document.body?.classList.remove('intro-active');
    document.getElementById('intro-overlay')?.remove();
    document.getElementById('intro-skip')?.remove();
    document.getElementById('intro-css')?.remove();
    try { sessionStorage.setItem('la_intro_seen', '1'); } catch (_) {}
  }

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
    const en = currentLang() === 'en';
    const extras = [
      ['FileVerse 2.0','https://laurandreea10.github.io/CodePen-2.0-file-options-challenge/',en?'CodePen 2.0 file-options challenge completed and published on GitHub Pages.':'challenge-ul CodePen 2.0 dedicat opțiunilor pentru fișiere a fost finalizat și publicat pe GitHub Pages.'],
      ['BlockForge — CodePen Challenge: Blocks','https://laurandreea10.github.io/BlockForge-CodePen-Challenge-Blocks/',en?'Interactive blocks challenge completed and published on GitHub Pages.':'challenge-ul interactiv dedicat blocurilor a fost finalizat și publicat pe GitHub Pages.'],
      ['Elsewhere — CodePen Challenge: View Transitions','https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/',en?'Cinematic atlas with portal transitions, day/night scenes and compare mode.':'atlas cinematografic cu tranziții portal, scene zi/noapte și compare mode.']
    ];
    for (const [title, href, text] of extras) {
      if (doneList.querySelector(`[data-completed-project="${CSS.escape(title)}"]`)) continue;
      const li = document.createElement('li');
      li.className = 'now-item now-item-done';
      li.dataset.completedProject = title;
      li.innerHTML = `<span class="now-status" aria-hidden="true">✅</span><span><strong>${title}</strong> <a class="now-item-link" href="${href}" target="_blank" rel="noopener noreferrer">${en?'Open project':'Deschide proiectul'}</a> — ${text}<span class="now-tag now-tag-done">${en?'Completed':'Finalizat'}</span></span>`;
      doneList.prepend(li);
    }
    const items = [...doneList.children];
    if (!items.length) return true;
    let archive = history.querySelector('[data-current-completed-archive]');
    if (!archive) {
      archive = document.createElement('div');
      archive.className = 'now-history-week';
      archive.dataset.currentCompletedArchive = 'true';
      archive.innerHTML = `<strong>${en?'Completed work · July 2026':'Proiecte finalizate · Iulie 2026'}</strong><ul class="now-checklist"></ul>`;
      history.prepend(archive);
    }
    const archiveList = archive.querySelector('.now-checklist');
    items.forEach(item => archiveList.appendChild(item));
    doneList.innerHTML = `<li class="now-item"><span class="now-status" aria-hidden="true">✓</span><span>${en?'Completed projects were moved to History.':'Proiectele finalizate au fost mutate în Istoric.'}</span></li>`;
    return true;
  }

  function addViewTransitionsCard() {
    if (document.querySelector('[data-project="elsewhere-view-transitions"]')) return true;
    const grid = document.querySelector('#latest-github .projects-grid');
    if (!grid) return false;
    const en = currentLang() === 'en';
    const card = document.createElement('article');
    card.className = 'project-card glass';
    card.dataset.project = 'elsewhere-view-transitions';
    card.innerHTML = `<span class="badge-new">NEW</span><div class="project-top"><div><h3>Elsewhere — View Transitions</h3><span class="badge-github">CodePen Challenge</span></div><span class="tag github">challenge</span></div><p class="project-desc">${en?'Cinematic destination atlas with shared-element morphs, portal reveals, day/night scenes, interactive mini-map and compare mode.':'Atlas cinematografic cu shared-element morphs, portal circular, scene zi/noapte, mini-hartă interactivă și compare mode.'}</p><div class="card-actions"><a class="btn btn-primary" href="https://laurandreea10.github.io/CodePen-Challenge-View-Transitions/" target="_blank" rel="noopener noreferrer">Live Demo</a><a class="btn btn-secondary" href="https://github.com/LaurAndreea10/CodePen-Challenge-View-Transitions" target="_blank" rel="noopener noreferrer">GitHub →</a></div>`;
    grid.prepend(card);
    return true;
  }

  function refreshAdditions() {
    return updateNowDate() && archiveCompletedToHistory() && addViewTransitionsCard();
  }

  function watchSections() {
    if (refreshAdditions()) return;
    const observer = new MutationObserver(() => {
      if (refreshAdditions()) observer.disconnect();
    });
    observer.observe(document.querySelector('main') || document.body, {childList:true, subtree:true});
    setTimeout(() => { observer.disconnect(); refreshAdditions(); }, 5000);
  }

  function loadSnapshot() {
    const script = document.createElement('script');
    script.src = SNAPSHOT_MAIN;
    script.defer = true;
    script.onload = () => (window.requestIdleCallback || (cb => setTimeout(cb,150)))(watchSections);
    script.onerror = watchSections;
    document.head.appendChild(script);
  }

  bypassSlowGithubApi();
  installPerformanceCSS();
  disableMobileIntro();
  loadDeferredFullCSS();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSnapshot, {once:true});
  } else {
    loadSnapshot();
  }
})();
