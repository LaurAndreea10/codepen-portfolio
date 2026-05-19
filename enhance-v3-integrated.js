/* Portfolio v4 final Now + Marketing-Tech docs integration */
(function(){
  'use strict';
  const LANG_KEY='portfolio-lang';
  const lang=()=>{try{const v=localStorage.getItem(LANG_KEY);if(v==='en'||v==='ro')return v;}catch(e){}return (document.documentElement.lang||'ro').toLowerCase().startsWith('en')?'en':'ro';};

  const nowCopy={
    ro:{
      title:'La ce lucrez · ce am livrat recent',progress:'🔄 În curs',delivered:'✅ Livrate recent',
      progressItems:[
        '<strong>Alpis Fusion v2.1</strong> — extind Flow Builder cu time delays vizuale (<code>WAIT 24h</code> între triggers și actions) și test mode cu date mock.',
        '<strong>A/B Test Simulator</strong> — primul tool nou din Marketing-Tech roadmap, vanilla JS bilingv RO/EN.'
      ],
      deliveredItems:[
        '<strong>Alpis Fusion v2</strong> — flow builder cu triggers compuse (AND/OR/SEQUENCE) implementat ca modul React auto-conținut, 5 templates pre-built, canvas drag-and-drop, mini-map și export/import JSON. <a href="https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium/blob/main/FlowBuilderV2.jsx" target="_blank" rel="noopener noreferrer">Vezi modulul →</a>',
        '<strong>Marketing-Tech docs/</strong> — README + screenshots + changelog pentru CampaignPilot și ROI Calculator integrate în repo-ul public <code>codepen-portfolio</code>. <a href="https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs" target="_blank" rel="noopener noreferrer">Vezi docs →</a>'
      ],
      note:'Update v4: Flow Builder v2 și Marketing-Tech docs sunt livrate. În curs au rămas v2.1 și A/B Test Simulator.',helper:'Livrările rămân vizibile ca dovadă de ritm.'
    },
    en:{
      title:'What I am working on · recently delivered',progress:'🔄 In progress',delivered:'✅ Recently delivered',
      progressItems:[
        '<strong>Alpis Fusion v2.1</strong> — extending Flow Builder with visual time delays (<code>WAIT 24h</code> between triggers and actions) and mock-data test mode.',
        '<strong>A/B Test Simulator</strong> — the first new tool from the Marketing-Tech roadmap, bilingual RO/EN vanilla JS.'
      ],
      deliveredItems:[
        '<strong>Alpis Fusion v2</strong> — flow builder with compound triggers (AND/OR/SEQUENCE) delivered as a self-contained React module, 5 pre-built templates, drag-and-drop canvas, mini-map and JSON import/export. <a href="https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium/blob/main/FlowBuilderV2.jsx" target="_blank" rel="noopener noreferrer">View module →</a>',
        '<strong>Marketing-Tech docs/</strong> — README + screenshots + changelog for CampaignPilot and ROI Calculator integrated in the public <code>codepen-portfolio</code> repo. <a href="https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs" target="_blank" rel="noopener noreferrer">View docs →</a>'
      ],
      note:'V4 update: Flow Builder v2 and Marketing-Tech docs are delivered. Current work moved to v2.1 and A/B Test Simulator.',helper:'Delivered work remains visible as proof of cadence.'
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
    if(title)title.textContent=l==='en'?'5 Marketing-Tech products with integrated docs in the public repo':'5 produse Marketing-Tech cu docs integrate în repo-ul public';
    const config={
      CampaignPilot:{source:'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/campaignpilot.html',docs:'https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs/CampaignPilot'},
      'Campaign ROI Calculator':{source:'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/Campaign%20ROI%20Calculator.html',docs:'https://github.com/LaurAndreea10/codepen-portfolio/tree/main/docs/ROI-Calculator'}
    };
    [...section.querySelectorAll('.project-card')].forEach(card=>{
      const h3=card.querySelector('h3'), actions=card.querySelector('.card-actions'); if(!h3||!actions)return;
      const cfg=config[h3.textContent.trim()]; if(!cfg)return;
      actions.querySelectorAll('a[href*="CampaignPilot"],a[href*="Campaign-ROI-Calculator"],a[href*="README-CampaignPilot"],a[href*="README-ROI-Calculator"]').forEach(a=>a.remove());
      if(!actions.querySelector('a[href="'+cfg.source+'"]')){const a=document.createElement('a');a.className='btn btn-secondary';a.href=cfg.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent=l==='en'?'Code in repo →':'Cod în repo →';actions.appendChild(a);}
      if(!actions.querySelector('a[href="'+cfg.docs+'"]')){const a=document.createElement('a');a.className='btn btn-secondary';a.href=cfg.docs;a.target='_blank';a.rel='noopener noreferrer';a.textContent='📖 Docs →';actions.appendChild(a);}
      let note=card.querySelector('.marketing-tech-repo-note'); if(!note){note=document.createElement('span');note.className='marketing-tech-repo-note';card.querySelector('.project-desc')?.insertAdjacentElement('afterend',note);} note.textContent=l==='en'?'Docs + changelog integrated':'Docs + changelog integrate';
    });
  }

  function boot(){setTimeout(()=>{rebuildNow();fixMarketingTechLinks();},480);}
  document.addEventListener('DOMContentLoaded',boot); if(document.readyState!=='loading')boot();
  document.addEventListener('click',e=>{if(e.target&&e.target.id==='langToggle')boot();});
})();
