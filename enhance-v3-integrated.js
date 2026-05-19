/* ============================================================
   Portfolio v3 integration correction
   CampaignPilot + ROI Calculator live inside codepen-portfolio, not separate repos.
   ============================================================ */
(function(){
  'use strict';

  const LANG_KEY = 'portfolio-lang';

  function getLang(){
    try{
      const stored = localStorage.getItem(LANG_KEY);
      if(stored === 'en' || stored === 'ro') return stored;
    }catch(e){}
    return (document.documentElement.lang || 'ro').toLowerCase().startsWith('en') ? 'en' : 'ro';
  }

  function fixNowCopy(){
    const section = document.getElementById('now');
    if(!section) return;
    const lang = getLang();
    const items = [...section.querySelectorAll('.now-item-progress')];
    const alpis = items.find(item => item.textContent.includes('Alpis Fusion v2'));
    const marketing = items.find(item => item.textContent.includes('Marketing-Tech expansion'));

    if(alpis){
      alpis.innerHTML = lang === 'en'
        ? 'Iterating on <a href="https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/" target="_blank" rel="noopener noreferrer"><strong>Alpis Fusion v2</strong></a> — flow builder with compound triggers (status + time + property), first attempt at business logic visualized as a graph.'
        : 'Iterez pe <a href="https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/" target="_blank" rel="noopener noreferrer"><strong>Alpis Fusion v2</strong></a> — flow builder cu triggers compuse (status + timp + property), prima încercare de logică de business vizualizată ca graf.';
    }

    if(marketing){
      marketing.innerHTML = lang === 'en'
        ? 'Building <a href="https://laurandreea10.github.io/codepen-portfolio/#marketing-tech"><strong>Marketing-Tech expansion</strong></a> — CampaignPilot and ROI Calculator are integrated directly in the public <strong>codepen-portfolio</strong> repo, with README docs prepared in <code>docs/</code>.'
        : 'Construiesc <a href="https://laurandreea10.github.io/codepen-portfolio/#marketing-tech"><strong>Marketing-Tech expansion</strong></a> — CampaignPilot și ROI Calculator sunt integrate direct în repo-ul public <strong>codepen-portfolio</strong>, cu README-urile pregătite în <code>docs/</code>.';
    }
  }

  function fixMarketingTechLinks(){
    const section = document.getElementById('marketing-tech');
    if(!section) return;
    const lang = getLang();
    const title = section.querySelector('#marketing-tech-title');
    if(title){
      title.textContent = lang === 'en'
        ? '5 Marketing-Tech products integrated in the public portfolio repo'
        : '5 produse Marketing-Tech integrate în repo-ul public al portofoliului';
    }

    const config = {
      CampaignPilot: {
        source: 'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/campaignpilot.html',
        docs: 'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/docs/README-CampaignPilot.md'
      },
      'Campaign ROI Calculator': {
        source: 'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/Campaign%20ROI%20Calculator.html',
        docs: 'https://github.com/LaurAndreea10/codepen-portfolio/blob/main/docs/README-ROI-Calculator.md'
      }
    };

    [...section.querySelectorAll('.project-card')].forEach(card => {
      const h3 = card.querySelector('h3');
      const actions = card.querySelector('.card-actions');
      if(!h3 || !actions) return;
      const name = h3.textContent.trim();
      const cfg = config[name];
      if(!cfg) return;

      actions.querySelectorAll('a[href="https://github.com/LaurAndreea10/CampaignPilot"], a[href="https://github.com/LaurAndreea10/Campaign-ROI-Calculator"]').forEach(a => a.remove());

      if(!actions.querySelector(`a[href="${cfg.source}"]`)){
        const source = document.createElement('a');
        source.className = 'btn btn-secondary';
        source.href = cfg.source;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        source.textContent = lang === 'en' ? 'Code in repo →' : 'Cod în repo →';
        actions.appendChild(source);
      }

      if(!actions.querySelector(`a[href="${cfg.docs}"]`)){
        const docs = document.createElement('a');
        docs.className = 'btn btn-secondary';
        docs.href = cfg.docs;
        docs.target = '_blank';
        docs.rel = 'noopener noreferrer';
        docs.textContent = 'README →';
        actions.appendChild(docs);
      }

      let note = card.querySelector('.marketing-tech-repo-note');
      if(!note){
        note = document.createElement('span');
        note.className = 'marketing-tech-repo-note';
        card.querySelector('.project-desc')?.insertAdjacentElement('afterend', note);
      }
      note.textContent = lang === 'en'
        ? 'Integrated in codepen-portfolio'
        : 'Integrat în codepen-portfolio';
    });
  }

  function applyFixes(){
    setTimeout(() => {
      fixNowCopy();
      fixMarketingTechLinks();
    }, 260);
  }

  document.addEventListener('DOMContentLoaded', applyFixes);
  if(document.readyState !== 'loading') applyFixes();
  document.addEventListener('click', event => {
    if(event.target && event.target.id === 'langToggle') applyFixes();
  });
})();
