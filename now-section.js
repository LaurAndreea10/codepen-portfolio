(function(){
  'use strict';

  var PATCH_MARKER = 'now-in-progress-history-v2';
  var applying = false;

  function applyNowPatch(){
    if(applying) return;
    applying = true;

    var now=document.getElementById('now');
    if(now){
      now.setAttribute('data-now-patch', PATCH_MARKER);

      var title=now.querySelector('#now-title,.now-title,h2');
      if(title) title.textContent='La ce lucrez acum + istoric';

      var eyebrow=now.querySelector('.eyebrow');
      if(eyebrow) eyebrow.innerHTML='<span class="now-pulse" aria-hidden="true"></span>⚡ Now';

      var badge=now.querySelector('.now-badge');
      if(badge) badge.innerHTML='Actualizat: <time datetime="2026-05-22">22 Mai 2026</time>';

      var list=now.querySelector('.now-list,ul');
      if(list){
        list.innerHTML=''
          +'<li>🔄 <strong>În curs:</strong> <a href="marketing-os.html">Industry Benchmarks Dashboard</a> — dashboard cu benchmarks pe canal, industrie și funnel stage. <span class="now-tag">Marketing-Tech</span></li>'
          +'<li>🔄 <strong>În curs:</strong> <a href="marketing-os.html">UTM Builder v1.2</a> — naming convention profiles + saved campaign templates. <span class="now-tag">UTM</span></li>'
          +'<li>🧭 <strong>Următorul pas:</strong> păstrez Marketing OS ca hub principal și adaug istoric vizibil pentru fiecare micro-tool finalizat.</li>'
          +'<li>✅ <strong>Istoric recent:</strong> Marketing OS — workspace principal Marketing-Tech: ROI, funnel logic, UTM builder și tools de campanie.</li>'
          +'<li>✅ <strong>Istoric recent:</strong> Alpis Fusion CRM — case study rafinat cu trade-offs, metrici explicate, dovadă live și lecții învățate.</li>'
          +'<li>✅ <strong>Istoric recent:</strong> ClientFlow — case study îmbunătățit cu protocol de test, fricțiuni reale și pași următori.</li>'
          +'<li>✅ <strong>Istoric recent:</strong> Link Video Editor Studio — Automation Pack export funcțional cu ZIP, CLI script și workflow video.</li>';
      }

      var tags=now.querySelector('.now-tags');
      if(tags){
        tags.innerHTML=''
          +'<span class="now-tag">În curs</span>'
          +'<span class="now-tag">Istoric</span>'
          +'<span class="now-tag">Marketing OS</span>'
          +'<span class="now-tag">Benchmarks</span>'
          +'<span class="now-tag">UTM v1.2</span>'
          +'<span class="now-tag">Case studies</span>'
          +'<span class="now-tag">GitHub Pages</span>';
      }

      var note=now.querySelector('.now-note');
      if(note) note.textContent='Secțiune de tip now page: arată ce este în lucru acum și păstrează istoricul livrărilor recente, ca progresul să fie clar fără să pară că proiectele dispar după implementare.';

      var helper=now.querySelector('.now-helper');
      if(helper) helper.textContent='Actualizat manual în now-section.js — menține vizibil atât lucrul în curs, cât și istoricul.';
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
        card.innerHTML='<span class="badge-new">ÎN CURS</span><div class="project-top"><div><h3>Marketing OS</h3><span class="badge-github">Industry Benchmarks · UTM Builder v1.2</span></div><span class="tag github">marketing-tech</span></div><p class="project-desc">Hub Marketing-Tech cu dashboard de benchmarks pe canal, industrie și funnel stage + UTM Builder v1.2 cu naming convention profiles și saved campaign templates. Include și istoric pentru micro-tool-urile finalizate.</p><div class="card-actions"><a class="btn btn-primary" href="marketing-os.html">Deschide Marketing OS</a><a class="btn btn-secondary" href="#now">Vezi istoricul</a></div>';
        grid.insertBefore(card,grid.firstElementChild);
      } else if(grid){
        var existing=grid.querySelector('[data-live-patch="marketing-os"]');
        if(existing){
          var badge=existing.querySelector('.badge-new');
          if(badge) badge.textContent='ÎN CURS';
          var desc=existing.querySelector('.project-desc');
          if(desc) desc.textContent='Hub Marketing-Tech cu dashboard de benchmarks pe canal, industrie și funnel stage + UTM Builder v1.2 cu naming convention profiles și saved campaign templates. Include și istoric pentru micro-tool-urile finalizate.';
        }
      }
    }

    applying = false;
  }

  function boot(){
    applyNowPatch();

    // Re-aplică patch-ul dacă main.js schimbă limba sau re-randează secțiunea Now.
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