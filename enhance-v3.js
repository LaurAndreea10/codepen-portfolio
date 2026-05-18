/* ============================================================
   Portfolio Enhancement Layer v3
   Safe additive patch over v2: Now grouping + dynamic repo count + Marketing-Tech repo links
   ============================================================ */
(function(){
  'use strict';

  const LANG_KEY = 'portfolio-lang';
  const CACHE_KEY = 'portfolio-gh-public-repos-v3';
  const CACHE_TTL = 5 * 60 * 1000;

  const NOW = {
    ro: {
      label: 'Mai 2026',
      datetime: '2026-05-18',
      title: 'La ce lucrez · ce am livrat recent',
      updatedPrefix: 'Actualizat:',
      inProgressTitle: '🔄 În curs',
      deliveredTitle: '✅ Livrate recent',
      inProgress: [
        'Iterez pe <a href="https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/" target="_blank" rel="noopener noreferrer"><strong>Alpis Fusion v2</strong></a> — flow builder cu triggers compuse (status + timp + property), prima încercare de logică de business vizualizată ca graf.',
        'Construiesc <a href="https://laurandreea10.github.io/codepen-portfolio/lead-magnet-landing.html"><strong>Marketing-Tech expansion</strong></a> — adaug repo public pentru CampaignPilot & ROI Calculator, plus 2 template-uri noi orientate pe conversie.'
      ],
      delivered: [
        '<strong>Demo loops interactive</strong> pe portofoliu — 3 animații self-contained pentru Alpis Fusion, ClientFlow și Impact Path, integrate direct în cardurile Top proiecte.',
        '<strong>Enhancement layer v2</strong> — metric bar, availability pill, recruiter quick view modal, comparator, anti-portfolio card, dedupe GitHub stats.',
        '<strong>Link Video Editor Studio</strong> — Automation Pack export funcțional cu script CLI, config Playwright și FFmpeg workflow. <a href="https://laurandreea10.github.io/Link-Video-Editor-Studio/" target="_blank" rel="noopener noreferrer">Deschide →</a>',
        '<strong>Alpis Fusion Decision Log</strong> — case study extins cu 6 decizii tehnice și de produs, alternative considerate, ce aș face diferit azi. <a href="projects/alpis-fusion-crm.html">Citește →</a>',
        '<strong>Lighthouse CI audit</strong> — preload hints pentru style.css, main.js și imaginea hero, DNS prefetch pentru GitHub API și CodePen, fetchpriority="high" pe LCP.'
      ],
      note: 'Now page actualizată manual. Activ pe 2 fronturi în paralel; livrările recente sunt păstrate ca istoric pentru a arăta ritmul.',
      helper: 'Actualizezi săptămânal doar conținutul Now.'
    },
    en: {
      label: 'May 2026',
      datetime: '2026-05-18',
      title: 'What I am working on · recent deliveries',
      updatedPrefix: 'Updated:',
      inProgressTitle: '🔄 In progress',
      deliveredTitle: '✅ Recently delivered',
      inProgress: [
        'Iterating on <a href="https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/" target="_blank" rel="noopener noreferrer"><strong>Alpis Fusion v2</strong></a> — flow builder with compound triggers (status + time + property), first attempt at business logic visualized as a graph.',
        'Building <a href="https://laurandreea10.github.io/codepen-portfolio/lead-magnet-landing.html"><strong>Marketing-Tech expansion</strong></a> — adding public repos for CampaignPilot & ROI Calculator, plus 2 new conversion-oriented templates.'
      ],
      delivered: [
        '<strong>Interactive demo loops</strong> on portfolio — 3 self-contained animations for Alpis Fusion, ClientFlow and Impact Path, integrated directly in Top projects cards.',
        '<strong>Enhancement layer v2</strong> — metric bar, availability pill, recruiter quick view modal, comparator, anti-portfolio card, GitHub stats dedupe.',
        '<strong>Link Video Editor Studio</strong> — Automation Pack export working with CLI script, Playwright config and FFmpeg workflow. <a href="https://laurandreea10.github.io/Link-Video-Editor-Studio/" target="_blank" rel="noopener noreferrer">Open →</a>',
        '<strong>Alpis Fusion Decision Log</strong> — extended case study with 6 technical and product decisions, alternatives considered, what I would do differently today. <a href="projects/alpis-fusion-crm.html">Read →</a>',
        '<strong>Lighthouse CI audit</strong> — preload hints for style.css, main.js and hero image, DNS prefetch for GitHub API and CodePen, fetchpriority="high" on LCP.'
      ],
      note: 'Now page updated manually. Active on 2 fronts in parallel; recent deliveries are kept as history to show the cadence.',
      helper: 'Update the Now content weekly.'
    }
  };

  function getLang(){
    try{
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if(urlLang === 'ro' || urlLang === 'en') return urlLang;
      const stored = localStorage.getItem(LANG_KEY);
      if(stored === 'ro' || stored === 'en') return stored;
    }catch(e){}
    return (document.documentElement.lang || 'ro').toLowerCase().startsWith('en') ? 'en' : 'ro';
  }

  function renderNowV3(){
    const section = document.getElementById('now');
    if(!section) return;
    const copy = NOW[getLang()] || NOW.ro;
    const title = section.querySelector('.now-title');
    const badge = section.querySelector('.now-badge');
    const list = section.querySelector('.now-list');
    const note = section.querySelector('.now-note');
    const helper = section.querySelector('.now-helper');
    if(title) title.textContent = copy.title;
    if(badge) badge.innerHTML = `${copy.updatedPrefix} <time datetime="${copy.datetime}">${copy.label}</time>`;
    if(list){
      list.innerHTML = '';
      list.classList.add('now-list-grouped');
      const progressHeader = document.createElement('li');
      progressHeader.className = 'now-group-header now-group-progress';
      progressHeader.innerHTML = `<strong>${copy.inProgressTitle}</strong>`;
      list.appendChild(progressHeader);
      copy.inProgress.forEach(item => {
        const li = document.createElement('li');
        li.className = 'now-list-item now-item-progress';
        li.innerHTML = item;
        list.appendChild(li);
      });
      const deliveredHeader = document.createElement('li');
      deliveredHeader.className = 'now-group-header now-group-delivered';
      deliveredHeader.innerHTML = `<strong>${copy.deliveredTitle}</strong>`;
      list.appendChild(deliveredHeader);
      copy.delivered.forEach(item => {
        const li = document.createElement('li');
        li.className = 'now-list-item now-item-delivered';
        li.innerHTML = item;
        list.appendChild(li);
      });
    }
    if(note) note.textContent = copy.note;
    if(helper) helper.textContent = copy.helper;
  }

  function markRepoMetricLoading(){
    document.querySelectorAll('.enh-metric').forEach(metric => {
      const label = metric.querySelector('.enh-metric-label');
      const num = metric.querySelector('.enh-metric-num');
      if(!label || !num) return;
      const text = label.textContent.toLowerCase();
      if(text.includes('repo')){
        num.dataset.dynamic = 'repos';
        num.dataset.loading = 'true';
        if(num.textContent.trim() === '20+' || num.textContent.trim() === '') num.textContent = '…';
      }
    });
  }

  function setRepoCount(count){
    if(!Number.isFinite(count)) return;
    document.querySelectorAll('[data-dynamic="repos"]').forEach(el => {
      el.textContent = String(count);
      el.dataset.loading = 'false';
      el.classList.add('is-updated');
      setTimeout(() => el.classList.remove('is-updated'), 650);
    });
  }

  function readCache(){
    try{
      const raw = sessionStorage.getItem(CACHE_KEY);
      if(!raw) return null;
      const parsed = JSON.parse(raw);
      if(!parsed || Date.now() - parsed.ts > CACHE_TTL) return null;
      return parsed.count;
    }catch(e){return null;}
  }

  function writeCache(count){
    try{ sessionStorage.setItem(CACHE_KEY, JSON.stringify({count, ts: Date.now()})); }catch(e){}
  }

  function updateRepoCount(){
    markRepoMetricLoading();
    const cached = readCache();
    if(Number.isFinite(cached)){ setRepoCount(cached); return; }
    fetch('https://api.github.com/users/LaurAndreea10')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if(!data || typeof data.public_repos !== 'number') return;
        writeCache(data.public_repos);
        setRepoCount(data.public_repos);
      })
      .catch(() => {});
  }

  function addMarketingRepoLinks(){
    const section = document.getElementById('marketing-tech');
    if(!section) return;
    const title = section.querySelector('#marketing-tech-title');
    if(title) title.textContent = getLang() === 'en' ? '5 Marketing-Tech products, 2 with public repos' : '5 produse Marketing-Tech, 2 cu repo public';
    const cards = [...section.querySelectorAll('.project-card')];
    cards.forEach(card => {
      const h3 = card.querySelector('h3');
      const actions = card.querySelector('.card-actions');
      if(!h3 || !actions) return;
      const name = h3.textContent.trim();
      const links = {
        CampaignPilot: 'https://github.com/LaurAndreea10/CampaignPilot',
        'Campaign ROI Calculator': 'https://github.com/LaurAndreea10/Campaign-ROI-Calculator'
      };
      if(!links[name] || actions.querySelector(`a[href="${links[name]}"]`)) return;
      const a = document.createElement('a');
      a.className = 'btn btn-secondary';
      a.href = links[name];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'GitHub →';
      actions.appendChild(a);
      if(!card.querySelector('.marketing-tech-repo-note')){
        const note = document.createElement('span');
        note.className = 'marketing-tech-repo-note';
        note.textContent = getLang() === 'en' ? 'Repo planned/public link' : 'Repo pregătit/public link';
        card.querySelector('.project-desc')?.insertAdjacentElement('afterend', note);
      }
    });
  }

  function bootV3(){
    setTimeout(() => {
      renderNowV3();
      updateRepoCount();
      addMarketingRepoLinks();
    }, 120);
  }

  document.addEventListener('DOMContentLoaded', bootV3);
  if(document.readyState !== 'loading') bootV3();
  document.addEventListener('click', event => {
    if(event.target && event.target.id === 'langToggle') setTimeout(bootV3, 180);
  });
})();
