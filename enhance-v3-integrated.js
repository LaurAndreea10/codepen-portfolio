/* Portfolio v5 final Now + Marketing-Tech docs integration */
(function(){
  'use strict';
  const LANG_KEY='portfolio-lang';
  const lang=()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='ro')return v;}catch(e){}return (document.documentElement.lang||'ro').toLowerCase().startsWith('en')?'en':'ro';};

  const nowCopy={
    ro:{
      title:'La ce lucrez · ce am livrat recent',progress:'🔄 În curs',delivered:'✅ Livrate recent',
      progressItems:[
        '<strong>Email Subject Line Tester</strong> — următorul micro-tool Marketing-Tech: analiză lungime, cuvinte de impact, emoji și scor de claritate.',
        '<strong>Alpis Fusion v2.2</strong> — pregătesc conditions pe edges și versioning per flow.'
      ],
      deliveredItems:[
        '<strong>Alpis Fusion v2.1</strong> — Flow Builder extins cu time delays vizuale (<code>WAIT 24h</code> între triggers și actions) și test mode cu date mock. <a href="https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium/blob/main/FlowBuilderV21.jsx" target="_blank" rel="noopener noreferrer">Vezi v2.1 →</a>',
        '<strong>A/B Test Simulator</strong> — primul tool nou din Marketing-Tech roadmap, vanilla JS bilingv RO/EN, cu uplift, winner confidence, revenue impact și raport copyable. <a href="https://laurandreea10.github.io/codepen-portfolio/ab-test-simulator.html" target="_blank" rel="noopener noreferrer">Vezi live →</a>',
        '<strong>Alpis Fusion v2</strong> — flow builder cu triggers compuse (AND/OR/SEQUENCE) implementat ca modul React auto-conținut, 5 templates pre-built, canvas drag-and-drop, mini-map și export/import JSON. <a href="https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium/blob/main/FlowBuilderV2.jsx" target="_blank" rel="noopener noreferrer">Vezi modulul →</a>',
        '<strong>Marketing-Tech docs/</strong> — README + screenshots + changelog pentru CampaignPilot, ROI Calculator și A/B Test Simulator integrate în repo-ul public <code>codepen-portfolio</code>. <a href="https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs" target="_blank" rel="noopener noreferrer">Vezi docs →</a>'
      ],
      note:'Update v5: Alpis Fusion v2.1 și A/B Test Simulator sunt livrate. În curs: Email Subject Line Tester și Alpis Fusion v2.2.',helper:'Livrările rămân vizibile ca dovadă de ritm.'
    },
    en:{
      title:'What I am working on · recently delivered',progress:'🔄 In progress',delivered:'✅ Recently delivered',
      progressItems:[
        '<strong>Email Subject Line Tester</strong> — next Marketing-Tech micro-tool: length analysis, impact words, emoji and clarity score.',
        '<strong>Alpis Fusion v2.2</strong> — preparing edge conditions and per-flow versioning.'
      ],
      deliveredItems:[
        '<strong>Alpis Fusion v2.1</strong> — Flow Builder extended with visual time delays (<code>WAIT 24h</code> between triggers and actions) and mock-data test mode. <a href="https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium/blob/main/FlowBuilderV21.jsx" target="_blank" rel="noopener noreferrer">View v2.1 →</a>',
        '<strong>A/B Test Simulator</strong> — first new tool from the Marketing-Tech roadmap, bilingual RO/EN vanilla JS, with uplift, winner confidence, revenue impact and copyable report. <a href="https://laurandreea10.github.io/codepen-portfolio/ab-test-simulator.html" target="_blank" rel="noopener noreferrer">Open live →</a>',
        '<strong>Alpis Fusion v2</strong> — flow builder with compound triggers (AND/OR/SEQUENCE) delivered as a self-contained React module, 5 pre-built templates, drag-and-drop canvas, mini-map and JSON import/export. <a href="https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium/blob/main/FlowBuilderV2.jsx" target="_blank" rel="noopener noreferrer">View module →</a>',
        '<strong>Marketing-Tech docs/</strong> — README + screenshots + changelog for CampaignPilot, ROI Calculator and A/B Test Simulator integrated in the public <code>codepen-portfolio</code> repo. <a href="https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs" target="_blank" rel="noopener noreferrer">View docs →</a>'
      ],
      note:'V5 update: Alpis Fusion v2.1 and A/B Test Simulator are delivered. In progress: Email Subject Line Tester and Alpis Fusion v2.2.',helper:'Delivered work remains visible as proof of cadence.'
    }
  };

  function rebuildNow(){
    const section=document.getElementById('now'); if(!section)return;
    const l=lang(), c=nowCopy[l];
    const title=section.querySelector('.now-title'), list=section.querySelector('.now-list'), note=section.querySelector('.now-note'), helper=section.querySelector('.now-helper');
    if(title)title.textContent=c.title;
    if(!list)return;
    list.innerHTML=''; list.classList.add('now-list-grouped');
    const ph=document.createElement('li'); ph.className='now-group-header now-group-progress'; ph.innerHTML='<strong>'+c.progress+'</strong>'; list.appendChild(ph);
    c.progressItems.forEach(x=>{const li=document.createElement('li');li.className='now-list-item now-item-progress';li.innerHTML=x;list.appendChild(li);});
    const dh=document.createElement('li'); dh.className='now-group-header now-group-delivered'; dh.innerHTML='<strong>'+c.delivered+'</strong>'; list.appendChild(dh);
    c.deliveredItems.forEach(x=>{const li=document.createElement('li');li.className='now-list-item now-item-delivered';li.innerHTML=x;list.appendChild(li);});
    if(note)note.textContent=c.note; if(helper)helper.textContent=c.helper;
  }

  function fixMarketingTechLinks(){
    const section=document.getElementById('marketing-tech'); if(!section)return;
    const l=lang(), title=section.querySelector('#marketing-tech-title');
    if(title)title.textContent=l==='en'?'6 Marketing-Tech products with integrated docs in the public repo':'6 produse Marketing-Tech cu docs integrate în repo-ul public';
    const config={
      CampaignPilot:{source:'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/campaignpilot.html',docs:'https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs/CampaignPilot'},
      'Campaign ROI Calculator':{source:'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/Campaign%20ROI%20Calculator.html',docs:'https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs/ROI-Calculator'},
      'A/B Test Simulator':{source:'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/ab-test-simulator.html',docs:'https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs/AB-Test-Simulator'}
    };
    [...section.querySelectorAll('.project-card')].forEach(card=>{
      const h3=card.querySelector('h3'), actions=card.querySelector('.card-actions'); if(!h3||!actions)return;
      const cfg=config[h3.textContent.trim()]; if(!cfg)return;
      if(!actions.querySelector('a[href="'+cfg.source+'"]')){const a=document.createElement('a');a.className='btn btn-secondary';a.href=cfg.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent=l==='en'?'Code in repo →':'Cod în repo →';actions.appendChild(a);}
      if(!actions.querySelector('a[href="'+cfg.docs+'"]')){const a=document.createElement('a');a.className='btn btn-secondary';a.href=cfg.docs;a.target='_blank';a.rel='noopener noreferrer';a.textContent='📖 Docs →';actions.appendChild(a);}
      let note=card.querySelector('.marketing-tech-repo-note'); if(!note){note=document.createElement('span');note.className='marketing-tech-repo-note';card.querySelector('.project-desc')?.insertAdjacentElement('afterend',note);} note.textContent=l==='en'?'Docs + changelog integrated':'Docs + changelog integrate';
    });
  }

  function injectABCard(){
    const section=document.getElementById('marketing-tech'); if(!section)return;
    const grid=section.querySelector('.projects-grid'); if(!grid || grid.querySelector('[data-tool="ab-test-simulator"]'))return;
    const l=lang();
    const card=document.createElement('article');
    card.className='project-card glass'; card.dataset.tool='ab-test-simulator';
    card.innerHTML='<span class="badge-new">NEW</span><div class="project-top"><div><h3>A/B Test Simulator</h3><span class="badge-github">Growth experiment · uplift tool</span></div><span class="tag github">marketing-tech</span></div><p class="project-desc">'+(l==='en'?'Bilingual RO/EN tool for simulating A/B test variants: conversion rate, uplift, winner confidence and revenue impact.':'Tool bilingv RO/EN pentru simularea variantelor A/B: conversion rate, uplift, winner confidence și impact estimat în revenue.')+'</p><div class="card-actions"><a class="btn btn-primary" href="./ab-test-simulator.html">'+(l==='en'?'Open live':'Deschide Live')+'</a></div>';
    grid.appendChild(card);
  }

  function boot(){setTimeout(()=>{rebuildNow();injectABCard();fixMarketingTechLinks();},520);}
  document.addEventListener('DOMContentLoaded',boot); if(document.readyState!=='loading')boot();
  document.addEventListener('click',e=>{if(e.target&&e.target.id==='langToggle')boot();});
})();
