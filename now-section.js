(function(){
  'use strict';

  var PATCH_MARKER = 'now-tabs-in-progress-history-v3';
  var applying = false;

  var inProgressHTML = ''
    + '<li>🔄 <strong>Industry Benchmarks Dashboard</strong> — următorul tool Marketing-Tech: dashboard cu benchmarks pe canal, industrie și funnel stage. <span class="now-tag">Marketing-Tech</span> <span class="now-tag">Benchmarks</span></li>'
    + '<li>🔄 <strong>UTM Builder v1.2</strong> — naming convention profiles + saved campaign templates. <span class="now-tag">UTM</span> <span class="now-tag">Templates</span></li>'
    + '<li>🧭 <strong>Direcție:</strong> Marketing OS rămâne hub-ul principal, iar micro-tool-urile noi intră ca module clare, nu ca proiecte separate pierdute.</li>';

  var historyHTML = ''
    + '<li>✅ <strong>Marketing OS</strong> — workspace principal Marketing-Tech: ROI, funnel logic, UTM builder și tools de campanie.</li>'
    + '<li>✅ <strong>Alpis Fusion CRM</strong> — case study rafinat cu trade-offs, metrici explicate, dovadă live și lecții învățate.</li>'
    + '<li>✅ <strong>ClientFlow</strong> — case study îmbunătățit cu protocol de test, fricțiuni reale și pași următori.</li>'
    + '<li>✅ <strong>Link Video Editor Studio</strong> — Automation Pack export funcțional cu ZIP, CLI script și workflow video.</li>';

  function injectTabStyles(){
    if(document.getElementById('nowTabsPatchStyles')) return;
    var style=document.createElement('style');
    style.id='nowTabsPatchStyles';
    style.textContent=''
      + '.now-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 14px;padding:6px;border:1px solid var(--line,rgba(255,255,255,.1));background:var(--panel-2,rgba(255,255,255,.04));border-radius:14px}'
      + '.now-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--muted,#9db0d4);font:inherit;font-size:.84rem;font-weight:800;letter-spacing:.02em;border-radius:10px;padding:9px 14px;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s}'
      + '.now-tab:hover{color:var(--text,#eef4ff);border-color:var(--line,rgba(255,255,255,.14));transform:translateY(-1px)}'
      + '.now-tab.is-active{background:rgba(79,140,255,.14);border-color:rgba(79,140,255,.38);color:var(--accent,#4f8cff);box-shadow:0 10px 28px -20px rgba(79,140,255,.7)}'
      + '.now-panel{display:none}'
      + '.now-panel.is-active{display:block}'
      + '.now-panel .now-list{margin-top:0}'
      + '.now-panel-head{margin:0 0 12px;color:var(--muted,#9db0d4);font-size:.9rem;line-height:1.7}'
      + '.now-panel-head strong{color:var(--text,#eef4ff)}';
    document.head.appendChild(style);
  }

  function buildTabsHTML(){
    return ''
      + '<div class="now-tabs" role="tablist" aria-label="La ce lucrez acum și istoric">'
      + '<button class="now-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="now-panel-progress" id="now-tab-progress" data-now-tab="progress">🔄 În curs</button>'
      + '<button class="now-tab" type="button" role="tab" aria-selected="false" aria-controls="now-panel-history" id="now-tab-history" data-now-tab="history">✅ Istoric</button>'
      + '</div>'
      + '<div class="now-panel is-active" id="now-panel-progress" role="tabpanel" aria-labelledby="now-tab-progress">'
      + '<p class="now-panel-head"><strong>Focus curent:</strong> două module noi în Marketing OS, utile pentru manageri de marketing și echipe growth.</p>'
      + '<ul class="now-list">' + inProgressHTML + '</ul>'
      + '</div>'
      + '<div class="now-panel" id="now-panel-history" role="tabpanel" aria-labelledby="now-tab-history">'
      + '<p class="now-panel-head"><strong>Istoric recent:</strong> livrări păstrate vizibil ca să se vadă progresul, nu doar statusul curent.</p>'
      + '<ul class="now-list">' + historyHTML + '</ul>'
      + '</div>';
  }

  function setupTabs(now){
    if(!now || now.__nowTabsBound) return;
    now.__nowTabsBound = true;
    now.addEventListener('click', function(e){
      var btn=e.target.closest && e.target.closest('.now-tab');
      if(!btn || !now.contains(btn)) return;
      var selected=btn.getAttribute('data-now-tab');
      now.querySelectorAll('.now-tab').forEach(function(tab){
        var active=tab.getAttribute('data-now-tab')===selected;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      now.querySelectorAll('.now-panel').forEach(function(panel){
        var active=panel.id === 'now-panel-' + selected;
        panel.classList.toggle('is-active', active);
      });
    });
  }

  function applyNowPatch(){
    if(applying) return;
    applying = true;
    injectTabStyles();

    var now=document.getElementById('now');
    if(now){
      now.setAttribute('data-now-patch', PATCH_MARKER);

      var title=now.querySelector('#now-title,.now-title,h2');
      if(title) title.textContent='La ce lucrez acum';

      var eyebrow=now.querySelector('.eyebrow');
      if(eyebrow) eyebrow.innerHTML='<span class="now-pulse" aria-hidden="true"></span>⚡ Now';

      var badge=now.querySelector('.now-badge');
      if(badge) badge.innerHTML='Actualizat: <time datetime="2026-05-22">22 Mai 2026</time>';

      var originalList=now.querySelector('.now-list');
      if(originalList && !now.querySelector('.now-tabs')){
        var holder=document.createElement('div');
        holder.className='now-tabs-shell';
        holder.innerHTML=buildTabsHTML();
        originalList.replaceWith(holder);
      } else if(now.querySelector('.now-tabs-shell')){
        var shell=now.querySelector('.now-tabs-shell');
        if(!shell.querySelector('#now-panel-progress') || shell.getAttribute('data-version') !== PATCH_MARKER){
          shell.innerHTML=buildTabsHTML();
        }
        shell.setAttribute('data-version', PATCH_MARKER);
      }

      var tags=now.querySelector('.now-tags');
      if(tags){
        tags.innerHTML=''
          +'<span class="now-tag">În curs</span>'
          +'<span class="now-tag">Istoric</span>'
          +'<span class="now-tag">Marketing OS</span>'
          +'<span class="now-tag">Benchmarks</span>'
          +'<span class="now-tag">UTM v1.2</span>'
          +'<span class="now-tag">GitHub Pages</span>';
      }

      var note=now.querySelector('.now-note');
      if(note) note.textContent='Secțiune de tip now page: tabul „În curs” arată focusul curent, iar tabul „Istoric” păstrează livrările recente.';

      var helper=now.querySelector('.now-helper');
      if(helper) helper.textContent='Actualizat manual în now-section.js — taburi pentru focus curent și istoric.';

      setupTabs(now);
    }

    var mt=document.getElementById('marketing-tech');
    if(mt){
      var mtTitle=mt.querySelector('#marketing-tech-title,h2');
      if(mtTitle) mtTitle.textContent='Marketing-Tech — hub activ + roadmap în lucru';

      var subtitle=mt.querySelector('.section-subtitle');
      if(subtitle) subtitle.textContent='Marketing OS rămâne hub-ul principal: tool-uri implementate, micro-tool-uri în curs și istoric de livrări pentru zona Marketing-Tech.';

      var grid=mt.querySelector('.projects-grid');
      if(grid && !grid.querySelector('[data-live-patch="marketing-os"]')){
        var card=document.createElement('article');
        card.className='project-card glass';
        card.setAttribute('data-live-patch','marketing-os');
        card.innerHTML='<span class="badge-new">ÎN CURS</span><div class="project-top"><div><h3>Marketing OS</h3><span class="badge-github">Industry Benchmarks · UTM Builder v1.2</span></div><span class="tag github">marketing-tech</span></div><p class="project-desc">Hub Marketing-Tech cu dashboard de benchmarks pe canal, industrie și funnel stage + UTM Builder v1.2 cu naming convention profiles și saved campaign templates.</p><div class="card-actions"><a class="btn btn-primary" href="marketing-os.html">Deschide Marketing OS</a><a class="btn btn-secondary" href="#now">Vezi statusul</a></div>';
        grid.insertBefore(card,grid.firstElementChild);
      } else if(grid){
        var existing=grid.querySelector('[data-live-patch="marketing-os"]');
        if(existing){
          var badge=existing.querySelector('.badge-new');
          if(badge) badge.textContent='ÎN CURS';
          var desc=existing.querySelector('.project-desc');
          if(desc) desc.textContent='Hub Marketing-Tech cu dashboard de benchmarks pe canal, industrie și funnel stage + UTM Builder v1.2 cu naming convention profiles și saved campaign templates.';
        }
      }
    }

    applying = false;
  }

  function boot(){
    applyNowPatch();

    var now=document.getElementById('now');
    if(now && !now.__nowPatchObserver){
      now.__nowPatchObserver = new MutationObserver(function(){
        window.clearTimeout(now.__nowPatchTimer);
        now.__nowPatchTimer = window.setTimeout(applyNowPatch, 30);
      });
      now.__nowPatchObserver.observe(now, { childList:true, subtree:true, characterData:true });
    }

    [100, 300, 700, 1200, 2000, 3500, 6000, 9000].forEach(function(ms){
      window.setTimeout(applyNowPatch, ms);
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();