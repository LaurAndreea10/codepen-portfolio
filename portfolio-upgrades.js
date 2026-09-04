(() => {
  'use strict';
  const ro = () => document.documentElement.lang !== 'en';
  const copy = {
    ro:{search:'Caută proiecte',placeholder:'Nume, tehnologie sau rezultat…',category:'Categorie',status:'Status',all:'Toate',live:'Live',caseStudy:'Case study',soon:'Roadmap',results:n=>n+' proiecte afișate',empty:'Niciun proiect nu corespunde filtrelor.',featured:'Featured Challenges',featuredTitle:'Patru experimente recente, grupate într-o colecție clară',featuredText:'Studii vizuale și interactive separate de produsele CRM și de secțiunea Forks.',open:'Deschide proiectul',a11y:'Scorecard accesibilitate',a11yTitle:'WCAG verificabil pentru proiectele-cheie',a11yText:'Criterii urmărite explicit: tastatură, focus, contrast, reduced motion, semantică și alternative text.',details:'Vezi scorecard-ul complet',change:'Vezi changelog-ul'},
    en:{search:'Search projects',placeholder:'Name, technology or outcome…',category:'Category',status:'Status',all:'All',live:'Live',caseStudy:'Case study',soon:'Roadmap',results:n=>n+' projects shown',empty:'No projects match these filters.',featured:'Featured Challenges',featuredTitle:'Four recent experiments in one clear collection',featuredText:'Visual and interactive studies kept separate from CRM products and the Forks section.',open:'Open project',a11y:'Accessibility scorecard',a11yTitle:'Verifiable WCAG checks for key projects',a11yText:'Explicit checks: keyboard, focus, contrast, reduced motion, semantics and text alternatives.',details:'Open the full scorecard',change:'Open changelog'}
  };
  const t=()=>ro()?copy.ro:copy.en;
  const norm=s=>(s||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  function setupDiscovery(){
    const first=document.querySelector('#marketing-tech .project-collection');
    if(!first||document.getElementById('portfolio-tools'))return;
    const tools=document.createElement('div'); tools.id='portfolio-tools'; tools.className='portfolio-tools glass';
    tools.innerHTML=`<div class="portfolio-tools-grid"><label>${t().search}<input id="portfolio-search" type="search" autocomplete="off" placeholder="${t().placeholder}"></label><label>${t().category}<select id="portfolio-category"><option value="">${t().all}</option><option value="crm">CRM</option><option value="marketing">Marketing-Tech</option><option value="challenge">Challenges</option></select></label><label>${t().status}<select id="portfolio-status"><option value="">${t().all}</option><option value="live">${t().live}</option><option value="case-study">${t().caseStudy}</option><option value="soon">${t().soon}</option></select></label></div><p class="portfolio-results" id="portfolio-results" role="status" aria-live="polite"></p>`;
    first.parentElement.insertBefore(tools,first);
    const cards=[...document.querySelectorAll('#marketing-tech .project-card,#crm-projects .project-card,#key-projects .project-card')];
    const seen=new Set();
    cards.forEach(card=>{
      const title=norm(card.querySelector('h3')?.textContent);
      const primary=card.querySelector('a[href]')?.href||'';
      const key=title+'|'+primary;
      if(seen.has(key)){card.remove();return;} seen.add(key);
      const section=card.closest('section')?.id||'';
      card.dataset.search=norm(card.textContent);
      card.dataset.category=section==='marketing-tech'?'marketing':section==='crm-projects'?'crm':'case-study';
      card.dataset.status=card.classList.contains('project-card-soon')?'soon':section==='key-projects'?'case-study':'live';
    });
    const search=tools.querySelector('#portfolio-search'), category=tools.querySelector('#portfolio-category'), status=tools.querySelector('#portfolio-status'), out=tools.querySelector('#portfolio-results');
    function apply(){
      const q=norm(search.value); let visible=0;
      cards.filter(c=>c.isConnected).forEach(card=>{
        const show=(!q||card.dataset.search.includes(q))&&(!category.value||card.dataset.category===category.value)&&(!status.value||card.dataset.status===status.value);
        card.hidden=!show;if(show)visible++;
      });
      out.textContent=visible?t().results(visible):t().empty;
    }
    [search,category,status].forEach(el=>el.addEventListener(el===search?'input':'change',apply)); apply();
  }
  function addFeatured(){
    const now=document.getElementById('now'); if(!now||document.getElementById('featured-challenges'))return;
    const items=[
      ['Email Alerts','Alerte email bilingve, dark mode și accesibilitate.','https://laurandreea10.github.io/Email-Alerts/'],
      ['MoonMail','Receipt email cosmic, construit ca challenge vizual.','https://laurandreea10.github.io/MoonMail-Cosmic-Receipt-Email/'],
      ['Signal Orbit','Studio accesibil pentru semnături email.','https://laurandreea10.github.io/LAURAI-SIGNAL-ORBIT/'],
      ['Bounce Signal','Experiență interactivă inspirată de email bounce.','https://laurandreea10.github.io/LAURAI-BOUNCE-SIGNAL/']
    ];
    const sec=document.createElement('section');sec.id='featured-challenges';sec.className='featured-challenges';sec.setAttribute('aria-labelledby','featured-title');
    sec.innerHTML=`<div class="container"><span class="eyebrow">${t().featured}</span><h2 id="featured-title">${t().featuredTitle}</h2><p class="section-subtitle">${t().featuredText}</p><div class="challenge-grid">${items.map((x,i)=>`<article class="challenge-card glass"><span class="tag">0${i+1}</span><h3>${x[0]}</h3><p>${x[1]}</p><div class="card-actions"><a class="btn btn-secondary" href="${x[2]}" target="_blank" rel="noopener noreferrer">${t().open} ↗</a></div></article>`).join('')}</div></div>`;
    now.insertAdjacentElement('afterend',sec);
  }
  function addScorecard(){
    const proof=document.getElementById('proof-of-work');if(!proof||document.getElementById('accessibility-scorecard'))return;
    const sec=document.createElement('section');sec.id='accessibility-scorecard';sec.className='a11y-scorecard';sec.setAttribute('aria-labelledby','a11y-title');
    sec.innerHTML=`<div class="container"><span class="eyebrow">${t().a11y}</span><h2 id="a11y-title">${t().a11yTitle}</h2><p class="section-subtitle">${t().a11yText}</p><div class="scorecard-grid">${['Alpis Fusion CRM','ClientFlow','Alpis Impact Path','Portfolio'].map((n,i)=>`<article class="scorecard-card glass"><span class="score-value">${i===3?'100 Lighthouse':'6/6 checks'}</span><h3>${n}</h3><ul class="score-list"><li>Keyboard + focus</li><li>Contrast</li><li>Reduced motion</li><li>Semantic HTML + alt text</li></ul></article>`).join('')}</div><div class="portfolio-meta-links"><a class="btn btn-primary" href="accessibility-scorecard.html">${t().details}</a><a class="btn btn-secondary" href="CHANGELOG.md">${t().change}</a></div></div>`;
    proof.insertAdjacentElement('afterend',sec);
  }
  function init(){setupDiscovery();addFeatured();addScorecard();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();