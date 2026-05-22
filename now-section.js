(function(){
  'use strict';
  function run(){
    var now=document.getElementById('now');
    if(now){
      var title=now.querySelector('#now-title,.now-title,h2');
      if(title) title.textContent='Marketing-Tech implementat';
      var badge=now.querySelector('.now-badge');
      if(badge) badge.innerHTML='Actualizat: <time datetime="2026-05-21">21 Mai 2026</time>';
      var list=now.querySelector('.now-list,ul');
      if(list){
        list.innerHTML=''
          +'<li>✅ <strong>Implementat:</strong> <a href="marketing-os.html">Industry Benchmarks Dashboard</a> — benchmarks pe canal, industrie și funnel stage.</li>'
          +'<li>✅ <strong>Implementat:</strong> <a href="marketing-os.html">UTM Builder v1.2</a> — naming convention profiles + saved campaign templates.</li>'
          +'<li>✅ <strong>Implementat:</strong> <a href="marketing-os.html">Marketing OS</a> — hub principal Marketing-Tech: benchmarks, UTM-uri, ROI, funnel și simulări.</li>'
          +'<li>➡️ <strong>Următorul pas:</strong> Conversion Funnel Visualizer — drop-off rates customizabile și export raport.</li>';
      }
      var note=now.querySelector('.now-note');
      if(note) note.textContent='Actualizat manual: zona Marketing-Tech este implementată în Marketing OS.';
    }

    var mt=document.getElementById('marketing-tech');
    if(mt){
      var mtTitle=mt.querySelector('#marketing-tech-title,h2');
      if(mtTitle) mtTitle.textContent='Marketing-Tech — tool-uri implementate';
      var subtitle=mt.querySelector('.section-subtitle');
      if(subtitle) subtitle.textContent='Marketing OS este hub-ul principal: Industry Benchmarks Dashboard + UTM Builder v1.2 + ROI + funnel logic într-un workspace 0 backend.';
      var grid=mt.querySelector('.projects-grid');
      if(grid && !grid.querySelector('[data-live-patch="marketing-os"]')){
        var card=document.createElement('article');
        card.className='project-card glass';
        card.setAttribute('data-live-patch','marketing-os');
        card.innerHTML='<span class="badge-new">IMPLEMENTAT</span><div class="project-top"><div><h3>Marketing OS</h3><span class="badge-github">Industry Benchmarks · UTM Builder v1.2</span></div><span class="tag github">marketing-tech</span></div><p class="project-desc">Workspace Marketing-Tech cu benchmarks pe canal, industrie și funnel stage + UTM Builder v1.2 cu naming convention profiles și saved campaign templates.</p><div class="card-actions"><a class="btn btn-primary" href="marketing-os.html">Deschide Marketing OS</a></div>';
        grid.insertBefore(card,grid.firstElementChild);
      }
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  setTimeout(run,500);
  setTimeout(run,1500);
})();
