(function(){
  'use strict';

  var PATCH_MARKER = 'now-marketing-tech-roadmap-v4-2026-05-22';
  var applying = false;

  var inProgressHTML = ''
    + '<li>🔄 <strong>Industry Benchmarks Dashboard</strong> — următorul tool Marketing-Tech: dashboard cu benchmarks pe canal, industrie și funnel stage. <a href="marketing-os.html" style="color:var(--accent,#4f8cff)">Deschide Marketing OS →</a> <span class="now-tag">Benchmarks</span> <span class="now-tag">Funnel stage</span></li>'
    + '<li>🔄 <strong>UTM Builder v1.2</strong> — naming convention profiles + saved campaign templates. <a href="marketing-os.html" style="color:var(--accent,#4f8cff)">Testează modulul →</a> <span class="now-tag">UTM</span> <span class="now-tag">Templates</span></li>'
    + '<li>🧭 <strong>Direcție:</strong> Marketing OS rămâne hub-ul principal, iar micro-tool-urile noi intră ca module clare, nu ca proiecte separate pierdute.</li>';

  var historyHTML = ''
    + '<li>✅ <strong>Marketing OS</strong> — workspace principal Marketing-Tech: ROI, funnel logic, UTM builder, benchmarks și tools de campanie.</li>'
    + '<li>✅ <strong>Alpis Fusion CRM</strong> — case study rafinat cu trade-offs, metrici explicate, dovadă live și lecții învățate.</li>'
    + '<li>✅ <strong>ClientFlow</strong> — case study îmbunătățit cu protocol de test, fricțiuni reale și pași următori.</li>'
    + '<li>✅ <strong>Link Video Editor Studio</strong> — Automation Pack export funcțional cu ZIP, CLI script și workflow video.</li>';

  function injectStyles(){
    if(document.getElementById('nowTabsPatchStyles')) return;
    var style=document.createElement('style');
    style.id='nowTabsPatchStyles';
    style.textContent=''
      + '.now-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 14px;padding:6px;border:1px solid var(--line,rgba(255,255,255,.1));background:var(--panel-2,rgba(255,255,255,.04));border-radius:14px}'
      + '.now-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--muted,#9db0d4);font:inherit;font-size:.84rem;font-weight:800;letter-spacing:.02em;border-radius:10px;padding:9px 14px;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s}'
      + '.now-tab:hover{color:var(--text,#eef4ff);border-color:var(--line,rgba(255,255,255,.14));transform:translateY(-1px)}'
      + '.now-tab.is-active{background:rgba(79,140,255,.14);border-color:rgba(79,140,255,.38);color:var(--accent,#4f8cff);box-shadow:0 10px 28px -20px rgba(79,140,255,.7)}'
      + '.now-panel{display:none}.now-panel.is-active{display:block}.now-panel .now-list{margin-top:0}'
      + '.now-panel-head{margin:0 0 12px;color:var(--muted,#9db0d4);font-size:.9rem;line-height:1.7}.now-panel-head strong{color:var(--text,#eef4ff)}'
      + '.not-section{margin-top:2rem;padding:1.5rem;border-left:3px solid var(--accent,#06b6d4);background:rgba(6,182,212,.05);border-radius:0 8px 8px 0}.not-section h3{margin:0 0 .75rem;font-size:1rem;opacity:.95}.not-section ul{margin:0;padding-left:1.2rem;line-height:1.7;opacity:.88}'
      + '.subtle-inline{color:var(--muted,#9db0d4);font-size:.9em}';
    document.head.appendChild(style);
  }

  function buildTabsHTML(){
    return ''
      + '<div class="now-tabs" role="tablist" aria-label="La ce lucrez acum și istoric">'
      + '<button class="now-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="now-panel-progress" id="now-tab-progress" data-now-tab="progress">🔄 În curs</button>'
      + '<button class="now-tab" type="button" role="tab" aria-selected="false" aria-controls="now-panel-history" id="now-tab-history" data-now-tab="history">✅ Istoric</button>'
      + '</div>'
      + '<div class="now-panel is-active" id="now-panel-progress" role="tabpanel" aria-labelledby="now-tab-progress">'
      + '<p class="now-panel-head"><strong>Focus curent:</strong> două module noi în Marketing OS, utile pentru marketing managers și echipe growth.</p>'
      + '<ul class="now-list">' + inProgressHTML + '</ul>'
      + '</div>'
      + '<div class="now-panel" id="now-panel-history" role="tabpanel" aria-labelledby="now-tab-history">'
      + '<p class="now-panel-head"><strong>Istoric recent:</strong> livrări păstrate vizibil ca să se vadă progresul, nu doar statusul curent.</p>'
      + '<ul class="now-list">' + historyHTML + '</ul>'
      + '</div>';
  }

  function setupTabs(scope){
    if(!scope || scope.__nowTabsBound) return;
    scope.__nowTabsBound = true;
    scope.addEventListener('click', function(e){
      var btn=e.target.closest && e.target.closest('.now-tab');
      if(!btn || !scope.contains(btn)) return;
      var selected=btn.getAttribute('data-now-tab');
      scope.querySelectorAll('.now-tab').forEach(function(tab){
        var active=tab.getAttribute('data-now-tab')===selected;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      scope.querySelectorAll('.now-panel').forEach(function(panel){
        panel.classList.toggle('is-active', panel.id === 'now-panel-' + selected);
      });
    });
  }

  function patchMeta(){
    document.title = 'Laura Andreea — Front-end CRM & Dashboard Developer';
    var desc=document.querySelector('meta[name="description"]');
    if(desc) desc.setAttribute('content','Construiesc interfețe CRM, dashboard-uri și Marketing-Tech tools: Marketing OS, Industry Benchmarks Dashboard, UTM Builder v1.2, Alpis Fusion și ClientFlow. Bilingv RO/EN.');
  }

  function patchDuplicateGithubStats(){
    var sections=[].slice.call(document.querySelectorAll('section#github-stats'));
    if(sections.length > 1){
      sections.slice(1).forEach(function(section){
        var prev=section.previousElementSibling;
        section.remove();
        if(prev && prev.classList && prev.classList.contains('section-divider')) prev.remove();
      });
    }
  }

  function patchCredibilityAndFooter(){
    var cred=document.querySelector('#hero-proof .cred-item p');
    if(cred && /proiecte live pe CodePen/i.test(cred.textContent)){
      cred.innerHTML='64 proiecte live, 25 selectate pe acest site →<br><span class="subtle-inline">Restul sunt experimente publice pe CodePen.</span>';
    }
    document.querySelectorAll('a').forEach(function(a){
      if(a.textContent.trim()==='CodePen · 64 proiecte live') a.textContent='CodePen · 64 experimente publice';
      if(a.href && a.href.indexOf('/in/laura-andreea/') !== -1) a.href='https://www.linkedin.com/in/laura-andreea-p-8b230014b/';
    });
  }

  function patchAboutTransparency(){
    var about=document.getElementById('about');
    if(!about || about.querySelector('.not-section')) return;
    var trail=about.querySelector('.learning-trail');
    var pList=about.querySelectorAll('.about-card > p');
    var anchor=trail || (pList.length ? pList[pList.length-1].nextSibling : null);
    var block=document.createElement('div');
    block.className='not-section';
    block.innerHTML=''
      + '<h3>Ce NU fac (transparență)</h3>'
      + '<ul>'
      + '<li>Nu construiesc backend-uri scalabile sau infrastructură cloud.</li>'
      + '<li>Nu fac DevOps complex (Kubernetes, microservicii).</li>'
      + '<li>Nu acopăr design grafic, ilustrație sau motion design avansat.</li>'
      + '<li>Mă specializez pe <strong>front-end pentru CRM, dashboard-uri și marketing tools</strong> — produse cu logică clară de produs.</li>'
      + '</ul>';
    if(anchor && anchor.parentNode) anchor.parentNode.insertBefore(block, anchor);
    else about.appendChild(block);
  }

  function patchNow(){
    var now=document.getElementById('now');
    if(!now) return;
    now.setAttribute('data-now-patch', PATCH_MARKER);

    var title=now.querySelector('#now-title,.now-title,h2');
    if(title) title.textContent='La ce lucrez acum';

    var eyebrow=now.querySelector('.eyebrow');
    if(eyebrow) eyebrow.innerHTML='<span class="now-pulse" aria-hidden="true"></span>⚡ Now';

    var badge=now.querySelector('.now-badge');
    if(badge) badge.innerHTML='Actualizat: <time datetime="2026-05-22">22 Mai 2026</time>';

    var shell=now.querySelector('.now-tabs-shell');
    if(!shell){
      var originalList=now.querySelector('.now-list');
      shell=document.createElement('div');
      shell.className='now-tabs-shell';
      if(originalList) originalList.replaceWith(shell);
      else {
        var head=now.querySelector('.now-head');
        if(head && head.parentNode) head.insertAdjacentElement('afterend', shell);
        else now.appendChild(shell);
      }
    }
    if(shell.getAttribute('data-version') !== PATCH_MARKER){
      shell.innerHTML=buildTabsHTML();
      shell.setAttribute('data-version', PATCH_MARKER);
    }

    var tags=now.querySelector('.now-tags');
    if(tags){
      tags.innerHTML=''
        + '<span class="now-tag">În curs</span>'
        + '<span class="now-tag">Istoric</span>'
        + '<span class="now-tag">Marketing OS</span>'
        + '<span class="now-tag">Benchmarks</span>'
        + '<span class="now-tag">UTM v1.2</span>'
        + '<span class="now-tag">GitHub Pages</span>';
    }

    var note=now.querySelector('.now-note');
    if(note) note.textContent='Secțiune de tip now page: tabul „În curs” arată focusul curent, iar tabul „Istoric” păstrează livrările recente.';

    setupTabs(now);
  }

  function patchMarketingTech(){
    var mt=document.getElementById('marketing-tech');
    if(!mt) return;

    var title=mt.querySelector('#marketing-tech-title,h2');
    if(title) title.textContent='Marketing-Tech — hub activ + roadmap în lucru';

    var subtitle=mt.querySelector('.section-subtitle');
    if(subtitle) subtitle.textContent='Marketing OS rămâne hub-ul principal: Industry Benchmarks Dashboard, UTM Builder v1.2, ROI, lead magnets și brief generator într-un workspace 0 backend.';

    var actions=mt.querySelector('.section-head .card-actions');
    if(actions && !actions.querySelector('a[href="marketing-os.html"]')){
      var link=document.createElement('a');
      link.className='btn btn-primary';
      link.href='marketing-os.html';
      link.textContent='Marketing OS';
      actions.insertBefore(link, actions.firstChild);
    }

    var grid=mt.querySelector('.projects-grid');
    if(!grid) return;
    var card=grid.querySelector('[data-live-patch="marketing-os"]');
    if(!card){
      card=document.createElement('article');
      card.className='project-card glass';
      card.setAttribute('data-live-patch','marketing-os');
      grid.insertBefore(card, grid.firstElementChild);
    }
    card.innerHTML=''
      + '<span class="badge-new">ÎN CURS</span>'
      + '<div class="project-top"><div><h3>Marketing OS</h3><span class="badge-github">Industry Benchmarks · UTM Builder v1.2</span></div><span class="tag github">marketing-tech</span></div>'
      + '<p class="project-desc">Hub Marketing-Tech cu dashboard de benchmarks pe canal, industrie și funnel stage + UTM Builder v1.2 cu naming convention profiles și saved campaign templates.</p>'
      + '<div class="card-actions"><a class="btn btn-primary" href="marketing-os.html">Deschide Marketing OS</a><a class="btn btn-secondary" href="#now">Vezi statusul</a></div>';
  }

  function applyPatch(){
    if(applying) return;
    applying=true;
    injectStyles();
    patchMeta();
    patchDuplicateGithubStats();
    patchCredibilityAndFooter();
    patchAboutTransparency();
    patchNow();
    patchMarketingTech();
    applying=false;
  }

  function boot(){
    applyPatch();

    var root=document.body;
    if(root && !root.__portfolioPatchObserver){
      root.__portfolioPatchObserver = new MutationObserver(function(){
        window.clearTimeout(root.__portfolioPatchTimer);
        root.__portfolioPatchTimer = window.setTimeout(applyPatch, 40);
      });
      root.__portfolioPatchObserver.observe(root, { childList:true, subtree:true, characterData:true });
    }

    [50,150,300,700,1200,2000,3500,6000,9000].forEach(function(ms){
      window.setTimeout(applyPatch, ms);
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();