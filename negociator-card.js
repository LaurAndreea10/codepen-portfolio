/* Negociator Pro portfolio card
   Adds the zero-cost simulator to the CRM Ecosystem section without changing the existing HTML structure. */
(function(){
  'use strict';

  const CARD_ID = 'negociator-pro-card';
  const STYLE_ID = 'negociator-pro-card-styles';

  function injectStyles(){
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${CARD_ID}{position:relative;overflow:hidden}
      #${CARD_ID}::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 12% 0%,rgba(184,132,26,.16),transparent 36%),radial-gradient(circle at 90% 95%,rgba(194,65,12,.12),transparent 42%);pointer-events:none}
      #${CARD_ID} > *{position:relative;z-index:1}
      .negociator-free-badge{display:inline-flex;align-items:center;gap:6px;margin-top:6px;padding:4px 9px;border-radius:8px;border:1px solid rgba(52,211,153,.32);background:rgba(52,211,153,.1);color:#86efac;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em}
      .negociator-free-badge::before{content:'●';font-size:.55rem;color:#34d399}
      .negociator-mini-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:7px;align-items:center;margin:12px 0 4px;font-size:.68rem;color:var(--muted,#9db0d4)}
      .negociator-mini-flow span:not(.arrow){padding:6px 7px;border-radius:8px;border:1px solid var(--line,rgba(255,255,255,.1));background:var(--panel-2,rgba(255,255,255,.04));text-align:center;font-weight:700}
      .negociator-mini-flow .arrow{color:var(--accent,#4f8cff);font-weight:900}
      body.light .negociator-free-badge{color:#166534;background:rgba(22,101,52,.08);border-color:rgba(22,101,52,.2)}
    `;
    document.head.appendChild(style);
  }

  function createCard(){
    const article = document.createElement('article');
    article.className = 'project-card glass';
    article.id = CARD_ID;
    article.setAttribute('aria-labelledby', 'negociator-pro-title');
    article.dataset.implementation = 'implemented';
    article.innerHTML = `
      <span class="badge-new">NEW</span>
      <div class="project-top">
        <div>
          <h3 id="negociator-pro-title">Negociator Pro</h3>
          <span class="badge-github">Client conversations · Local scoring</span>
          <span class="negociator-free-badge">0€ · fără API</span>
        </div>
        <span class="tag ops">training</span>
      </div>
      <p class="project-desc">Simulator bilingv RO/EN pentru conversații dificile cu clienți: scenarii, replici locale, scor pe empatie, fermitate, claritate și outcome. Fără Claude, fără cheie, fără backend.</p>
      <div class="negociator-mini-flow" aria-hidden="true">
        <span>Scenariu</span><span class="arrow">→</span><span>Dialog</span><span class="arrow">→</span><span>Scor</span>
      </div>
      <div class="card-actions">
        <a class="btn btn-primary" href="negociator-pro.html">Deschide Live</a>
        <a class="btn btn-secondary" href="negociator-pro.html#homeScreen">0€ Demo</a>
      </div>
    `;
    return article;
  }

  function init(){
    if (document.getElementById(CARD_ID)) return;
    const crmSection = document.getElementById('crm-projects');
    const grid = crmSection ? crmSection.querySelector('.projects-grid') : null;
    if (!grid) return;
    injectStyles();
    grid.appendChild(createCard());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
