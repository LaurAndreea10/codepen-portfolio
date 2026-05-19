/* Portfolio v6 · 10+ layer: hero video, extreme metrics, safe SoftwareApplication schema */
(function(){
  'use strict';
  const LANG_KEY='portfolio-lang';
  const lang=()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='ro')return v;}catch(e){}return (document.documentElement.lang||'ro').toLowerCase().startsWith('en')?'en':'ro';};

  const nowCopy={
    ro:{
      title:'La ce lucrez · ce am livrat recent',progress:'🔄 În curs',delivered:'✅ Livrate recent',
      progressItems:[
        '<strong>A/B Test Simulator v1.1</strong> — adaug confidence interval calculator + Bayesian mode.',
        '<strong>Email Subject Line Tester</strong> — următorul micro-tool Marketing-Tech: analiză lungime, cuvinte de impact, emoji și scor de claritate.'
      ],
      deliveredItems:[
        '<strong>Hero video demo loop</strong> — animație CSS/SVG de 15 sec în hero: drag pipeline + ⌘K palette + Flow Builder v2 în acțiune. <a href="./video/hero-video-loop.html" target="_blank" rel="noopener noreferrer">Vezi loop →</a>',
        '<strong>Headline metrics extreme</strong> — 1900+ linii / 8 module / 0 dependencies critice în hero, cu tooltips contextuale.',
        '<strong>Schema.org SoftwareApplication</strong> — structured data pentru 6 proiecte cu featureList, categorii și offers gratuite, fără ratinguri self-assessed pentru risc SEO minim.',
        '<strong>Alpis Fusion v2.1</strong> — Flow Builder extins cu time delays vizuale (<code>WAIT 24h</code> între triggers și actions) și test mode cu date mock. <a href="https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium/blob/main/FlowBuilderV21.jsx" target="_blank" rel="noopener noreferrer">Vezi v2.1 →</a>',
        '<strong>A/B Test Simulator</strong> — primul tool nou din Marketing-Tech roadmap, vanilla JS bilingv RO/EN, cu uplift, winner confidence, revenue impact și raport copyable. <a href="https://laurandreea10.github.io/codepen-portfolio/ab-test-simulator.html" target="_blank" rel="noopener noreferrer">Vezi live →</a>'
      ],
      note:'Update v6: Hero video loop, headline metrics extreme și Schema.org SoftwareApplication sunt livrate.',helper:'Livrările rămân vizibile ca dovadă de ritm.'
    },
    en:{
      title:'What I am working on · recently delivered',progress:'🔄 In progress',delivered:'✅ Recently delivered',
      progressItems:[
        '<strong>A/B Test Simulator v1.1</strong> — adding confidence interval calculator + Bayesian mode.',
        '<strong>Email Subject Line Tester</strong> — next Marketing-Tech micro-tool: length analysis, impact words, emoji and clarity score.'
      ],
      deliveredItems:[
        '<strong>Hero video demo loop</strong> — 15-second CSS/SVG hero animation: pipeline drag + ⌘K palette + Flow Builder v2 in action. <a href="./video/hero-video-loop.html" target="_blank" rel="noopener noreferrer">View loop →</a>',
        '<strong>Extreme headline metrics</strong> — 1900+ lines / 8 modules / 0 critical dependencies in the hero, with contextual tooltips.',
        '<strong>Schema.org SoftwareApplication</strong> — structured data for 6 projects with featureList, categories and free offers, without self-assessed ratings for minimal SEO risk.',
        '<strong>Alpis Fusion v2.1</strong> — Flow Builder extended with visual time delays (<code>WAIT 24h</code> between triggers and actions) and mock-data test mode. <a href="https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium/blob/main/FlowBuilderV21.jsx" target="_blank" rel="noopener noreferrer">View v2.1 →</a>',
        '<strong>A/B Test Simulator</strong> — first new tool from the Marketing-Tech roadmap, bilingual RO/EN vanilla JS, with uplift, winner confidence, revenue impact and copyable report. <a href="https://laurandreea10.github.io/codepen-portfolio/ab-test-simulator.html" target="_blank" rel="noopener noreferrer">Open live →</a>'
      ],
      note:'V6 update: Hero video loop, extreme headline metrics and Schema.org SoftwareApplication are delivered.',helper:'Delivered work remains visible as proof of cadence.'
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

  function injectStyles(){
    if(document.getElementById('v6-10plus-styles'))return;
    const style=document.createElement('style'); style.id='v6-10plus-styles';
    style.textContent=`
      .enh-metric-bar.enh-metric-bar-extreme{grid-template-columns:repeat(3,1fr)!important;gap:16px!important;padding:22px 24px!important;margin:24px 0 8px!important;border-radius:20px!important;background:radial-gradient(circle at 15% 0%,rgba(79,140,255,.12),transparent 50%),radial-gradient(circle at 85% 100%,rgba(139,92,246,.10),transparent 50%),rgba(255,255,255,.02)!important;border:1px solid rgba(79,140,255,.18)!important;position:relative;overflow:visible}
      .enh-metric-extreme{position:relative;text-align:center;padding:8px 10px;cursor:default;transition:transform .2s}.enh-metric-extreme:hover,.enh-metric-extreme:focus-visible{transform:translateY(-2px)}
      .enh-metric-bar-extreme .enh-metric-num{font-size:clamp(2.2rem,5vw,3.4rem)!important;font-weight:900!important;letter-spacing:-.04em!important;line-height:.95!important;background:linear-gradient(135deg,var(--accent,#4f8cff),var(--accent2,#8b5cf6));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;display:block}
      .enh-metric-unit{display:inline-block;font-size:.7rem;color:var(--muted,#9db0d4);font-weight:700;margin-top:2px;letter-spacing:.04em;text-transform:uppercase}.enh-metric-bar-extreme .enh-metric-label{display:block;margin-top:8px;font-size:.78rem;font-weight:600;color:var(--text,#eef4ff);opacity:.85;letter-spacing:0;text-transform:none}
      .enh-metric-tooltip{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:rgba(10,21,48,.97);color:#fff;padding:8px 12px;border-radius:8px;font-size:.74rem;font-weight:500;border:1px solid rgba(79,140,255,.3);white-space:normal;width:max-content;max-width:260px;text-align:left;line-height:1.45;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:50;box-shadow:0 10px 28px rgba(0,0,0,.5)}
      .enh-metric-tooltip:after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:rgba(10,21,48,.97)}.enh-metric-extreme:hover .enh-metric-tooltip,.enh-metric-extreme:focus-visible .enh-metric-tooltip{opacity:1;transform:translateX(-50%) translateY(-2px)}
      .hero-preview-wrap.v6-video-mode .hero-preview-stage,.hero-preview-wrap.v6-video-mode .hero-preview-fallback,.hero-preview-wrap.v6-video-mode .hero-preview-hint{display:none!important}.hero-preview-wrap.v6-video-mode iframe{opacity:1!important;min-height:460px;background:#071226}.v6-schema-badge{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:5px 10px;border-radius:999px;border:1px solid rgba(74,222,128,.22);background:rgba(74,222,128,.08);color:var(--green,#4ade80);font-size:.72rem;font-weight:900;letter-spacing:.04em;text-transform:uppercase}
      body.high-contrast .enh-metric-bar-extreme{background:transparent!important;border-width:2px!important}body.high-contrast .enh-metric-bar-extreme .enh-metric-num{background:none;-webkit-text-fill-color:currentColor;color:currentColor}@media(max-width:640px){.enh-metric-bar.enh-metric-bar-extreme{grid-template-columns:1fr!important;gap:12px!important;padding:16px 18px!important}.enh-metric-tooltip{position:static;transform:none;opacity:1;pointer-events:auto;width:100%;max-width:none;margin-top:6px;font-size:.7rem}.enh-metric-tooltip:after{display:none}}@media(prefers-reduced-motion:reduce){.enh-metric-extreme:hover{transform:none}.enh-metric-tooltip{transition:none}}`;
    document.head.appendChild(style);
  }

  function injectExtremeMetrics(){
    const existing=document.querySelector('.enh-metric-bar'); if(existing) existing.remove();
    const heroActions=document.querySelector('.hero-actions'); if(!heroActions)return;
    const l=lang();
    const metrics=l==='en'?
      [{num:'1900+',unit:'lines',label:'App.jsx in Alpis Fusion',tooltip:'Single component file. Refactored 3 times. Now split in modules.'},{num:'8',unit:'modules',label:'SaaS integrated',tooltip:'Pipeline · Tasks · Calendar · Flow Builder · RBAC · Billing · Booking · Autosave'},{num:'0',unit:'',label:'critical dependencies',tooltip:'Vanilla JS + React + Vite. No analytics, no trackers, no SaaS lock-in.'}]:
      [{num:'1900+',unit:'linii',label:'App.jsx în Alpis Fusion',tooltip:'Un singur fișier component. Refactor de 3 ori. Acum split în module.'},{num:'8',unit:'module',label:'SaaS integrate',tooltip:'Pipeline · Tasks · Calendar · Flow Builder · RBAC · Billing · Booking · Autosave'},{num:'0',unit:'',label:'dependencies critice',tooltip:'Vanilla JS + React + Vite. Fără analytics, trackers, SaaS lock-in.'}];
    const bar=document.createElement('div');bar.className='enh-metric-bar enh-metric-bar-extreme';bar.setAttribute('role','list');bar.setAttribute('aria-label',l==='en'?'Key technical metrics':'Metrici tehnice cheie');
    bar.innerHTML=metrics.map(m=>'<div class="enh-metric enh-metric-extreme" role="listitem" tabindex="0" aria-label="'+m.num+' '+m.unit+' '+m.label+'. '+m.tooltip+'"><span class="enh-metric-num" aria-hidden="true">'+m.num+'</span>'+(m.unit?'<span class="enh-metric-unit">'+m.unit+'</span>':'')+'<span class="enh-metric-label">'+m.label+'</span><span class="enh-metric-tooltip">'+m.tooltip+'</span></div>').join('');
    heroActions.parentNode.insertBefore(bar,heroActions);
  }

  function injectHeroVideo(){
    const frame=document.getElementById('heroPreviewFrame'); const wrap=document.querySelector('.hero-preview-wrap'); if(!frame||!wrap)return;
    wrap.classList.add('v6-video-mode'); frame.src='./video/hero-video-loop.html'; frame.title='Alpis Fusion CRM · Demo loop 15 sec'; frame.loading='eager'; frame.setAttribute('scrolling','no');
    const title=document.getElementById('heroPreviewTitle'); if(title)title.textContent='Alpis Fusion · 15s demo loop';
    const label=document.getElementById('heroPreviewLabel'); if(label)label.textContent=lang()==='en'?'15s product loop':'Loop produs 15s';
  }

  function injectSafeSchema(){
    if(document.getElementById('software-app-schema-v6'))return;
    const data={"@context":"https://schema.org","@graph":[
      {"@type":"SoftwareApplication","@id":"https://laurandreea10.github.io/codepen-portfolio/#alpis-fusion-crm","name":"Alpis Fusion CRM Premium","url":"https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/","sameAs":"https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium","description":"CRM modular cu 8 module SaaS integrate: kanban pipeline, flow builder cu triggers compuse, RBAC, billing, booking și autosave.","applicationCategory":"BusinessApplication","applicationSubCategory":"CRM Software","operatingSystem":"Web Browser","softwareVersion":"2.1","author":{"@id":"https://laurandreea10.github.io/codepen-portfolio/#person"},"offers":{"@type":"Offer","price":"0","priceCurrency":"EUR","availability":"https://schema.org/InStock"},"featureList":["Kanban pipeline cu drag-and-drop","Flow Builder v2 cu triggers compuse","RBAC","Generare factură PDF","Booking integrat","Autosave 30s","Command palette","Export CSV/JSON"]},
      {"@type":"SoftwareApplication","@id":"https://laurandreea10.github.io/codepen-portfolio/#clientflow","name":"ClientFlow PRO","url":"https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/","sameAs":"https://github.com/LaurAndreea10/ClientFlow-PRO","description":"Dashboard CRM operațional pentru triage zilnic într-un singur ecran, cu shortcut-uri keyboard și PWA offline-ready.","applicationCategory":"BusinessApplication","applicationSubCategory":"Task Management","operatingSystem":"Web Browser","softwareVersion":"1.0","author":{"@id":"https://laurandreea10.github.io/codepen-portfolio/#person"},"offers":{"@type":"Offer","price":"0","priceCurrency":"EUR","availability":"https://schema.org/InStock"},"featureList":["Triage zilnic în 1 ecran","Keyboard shortcuts","PWA offline-ready","Bilingv RO/EN","Dark/Light theme","Priorities color-coded"]},
      {"@type":"SoftwareApplication","@id":"https://laurandreea10.github.io/codepen-portfolio/#alpis-impact-path","name":"Alpis Impact Path","url":"https://laurandreea10.github.io/codepen-portfolio/projects/alpis-impactpath.html","description":"Flow interactiv în 5 pași cu o singură decizie per ecran și CTA contextual.","applicationCategory":"DesignApplication","applicationSubCategory":"Onboarding Flow","operatingSystem":"Web Browser","softwareVersion":"1.0","author":{"@id":"https://laurandreea10.github.io/codepen-portfolio/#person"},"offers":{"@type":"Offer","price":"0","priceCurrency":"EUR","availability":"https://schema.org/InStock"},"featureList":["5 pași flow","O decizie per ecran","CTA contextual","Progres vizibil"]},
      {"@type":"SoftwareApplication","@id":"https://laurandreea10.github.io/codepen-portfolio/#campaignpilot","name":"CampaignPilot","url":"https://laurandreea10.github.io/codepen-portfolio/campaignpilot.html","description":"Workspace unificat pentru planificarea unei campanii marketing: KPI overview, funnel builder, budget allocation, content calendar și brief generator.","applicationCategory":"BusinessApplication","applicationSubCategory":"Marketing Planning","operatingSystem":"Web Browser","softwareVersion":"1.3.0","author":{"@id":"https://laurandreea10.github.io/codepen-portfolio/#person"},"offers":{"@type":"Offer","price":"0","priceCurrency":"EUR","availability":"https://schema.org/InStock"},"featureList":["KPI overview","Funnel builder","Budget allocation","Content calendar","Brief generator","Campaign library"]},
      {"@type":"SoftwareApplication","@id":"https://laurandreea10.github.io/codepen-portfolio/#roi-calculator","name":"Campaign ROI Calculator","url":"https://laurandreea10.github.io/codepen-portfolio/Campaign%20ROI%20Calculator.html","description":"Calculator interactiv pentru ROI, ROAS, CAC, cost per lead și profit margin, cu auto-interpretare și presets.","applicationCategory":"FinanceApplication","applicationSubCategory":"Marketing Analytics","operatingSystem":"Web Browser","softwareVersion":"1.2.0","author":{"@id":"https://laurandreea10.github.io/codepen-portfolio/#person"},"offers":{"@type":"Offer","price":"0","priceCurrency":"EUR","availability":"https://schema.org/InStock"},"featureList":["ROI/ROAS/CAC live","Auto-interpretare","Industry presets","Revenue forecast","Export PDF","Bilingv RO/EN"]},
      {"@type":"SoftwareApplication","@id":"https://laurandreea10.github.io/codepen-portfolio/#excel-quest","name":"Excel-Quest","url":"https://laurandreea10.github.io/Excel-Quest/","sameAs":"https://github.com/LaurAndreea10/Excel-Quest","description":"Aplicație educațională gamificată pentru învățarea Excel, cu quest-uri și progres salvat.","applicationCategory":"EducationalApplication","applicationSubCategory":"Skill Training","operatingSystem":"Web Browser","author":{"@id":"https://laurandreea10.github.io/codepen-portfolio/#person"},"offers":{"@type":"Offer","price":"0","priceCurrency":"EUR","availability":"https://schema.org/InStock"},"featureList":["Quest-based learning","Progress saved localStorage","Central hub","Bilingv RO/EN"]},
      {"@type":"ItemList","@id":"https://laurandreea10.github.io/codepen-portfolio/#projects-list","name":"Projects portfolio · Laura Andreea","numberOfItems":6,"itemListElement":[1,2,3,4,5,6].map((p,i)=>({"@type":"ListItem","position":p,"item":{"@id":["https://laurandreea10.github.io/codepen-portfolio/#alpis-fusion-crm","https://laurandreea10.github.io/codepen-portfolio/#clientflow","https://laurandreea10.github.io/codepen-portfolio/#alpis-impact-path","https://laurandreea10.github.io/codepen-portfolio/#campaignpilot","https://laurandreea10.github.io/codepen-portfolio/#roi-calculator","https://laurandreea10.github.io/codepen-portfolio/#excel-quest"][i]}}))}
    ]};
    const s=document.createElement('script');s.id='software-app-schema-v6';s.type='application/ld+json';s.textContent=JSON.stringify(data);document.head.appendChild(s);
    const proof=document.querySelector('#hero-proof .container'); if(proof&&!proof.querySelector('.v6-schema-badge')){const b=document.createElement('span');b.className='v6-schema-badge';b.textContent='Schema.org · 6 SoftwareApplication';proof.appendChild(b);}
  }

  function fixMarketingTechLinks(){
    const section=document.getElementById('marketing-tech'); if(!section)return;
    const l=lang(), title=section.querySelector('#marketing-tech-title');
    if(title)title.textContent=l==='en'?'6 Marketing-Tech products with integrated docs in the public repo':'6 produse Marketing-Tech cu docs integrate în repo-ul public';
    const config={CampaignPilot:{source:'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/campaignpilot.html',docs:'https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs/CampaignPilot'},'Campaign ROI Calculator':{source:'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/Campaign%20ROI%20Calculator.html',docs:'https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs/ROI-Calculator'},'A/B Test Simulator':{source:'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/ab-test-simulator.html',docs:'https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs/AB-Test-Simulator'}};
    [...section.querySelectorAll('.project-card')].forEach(card=>{const h3=card.querySelector('h3'), actions=card.querySelector('.card-actions'); if(!h3||!actions)return; const cfg=config[h3.textContent.trim()]; if(!cfg)return; if(!actions.querySelector('a[href="'+cfg.source+'"]')){const a=document.createElement('a');a.className='btn btn-secondary';a.href=cfg.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent=l==='en'?'Code in repo →':'Cod în repo →';actions.appendChild(a);} if(!actions.querySelector('a[href="'+cfg.docs+'"]')){const a=document.createElement('a');a.className='btn btn-secondary';a.href=cfg.docs;a.target='_blank';a.rel='noopener noreferrer';a.textContent='📖 Docs →';actions.appendChild(a);}});
  }
  function injectABCard(){const section=document.getElementById('marketing-tech'); if(!section)return; const grid=section.querySelector('.projects-grid'); if(!grid||grid.querySelector('[data-tool="ab-test-simulator"]'))return; const l=lang(); const card=document.createElement('article'); card.className='project-card glass'; card.dataset.tool='ab-test-simulator'; card.innerHTML='<span class="badge-new">NEW</span><div class="project-top"><div><h3>A/B Test Simulator</h3><span class="badge-github">Growth experiment · uplift tool</span></div><span class="tag github">marketing-tech</span></div><p class="project-desc">'+(l==='en'?'Bilingual RO/EN tool for simulating A/B test variants: conversion rate, uplift, winner confidence and revenue impact.':'Tool bilingv RO/EN pentru simularea variantelor A/B: conversion rate, uplift, winner confidence și impact estimat în revenue.')+'</p><div class="card-actions"><a class="btn btn-primary" href="./ab-test-simulator.html">'+(l==='en'?'Open live':'Deschide Live')+'</a></div>'; grid.appendChild(card);}

  function boot(){setTimeout(()=>{injectStyles();injectSafeSchema();rebuildNow();injectHeroVideo();injectExtremeMetrics();injectABCard();fixMarketingTechLinks();},560);}
  document.addEventListener('DOMContentLoaded',boot); if(document.readyState!=='loading')boot(); document.addEventListener('click',e=>{if(e.target&&e.target.id==='langToggle')boot();});
})();
