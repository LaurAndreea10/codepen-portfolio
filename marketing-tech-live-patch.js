(function(){
  'use strict';

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function setNowImplemented(){
    var now = document.getElementById('now');
    if(!now) return;
    var title = now.querySelector('h2, .now-title');
    if(title) title.textContent = 'Marketing-Tech implementat';

    var badge = now.querySelector('.now-badge, time');
    if(badge){
      if(badge.tagName && badge.tagName.toLowerCase() === 'time') badge.textContent = '21 Mai 2026';
      else badge.innerHTML = 'Actualizat: <time datetime="2026-05-21">21 Mai 2026</time>';
    }

    var list = now.querySelector('.now-list, ul');
    if(list){
      list.innerHTML = [
        '<li>✅ <strong>Implementat:</strong> <a href="marketing-os.html">Industry Benchmarks Dashboard</a> — benchmarks pe canal, industrie și funnel stage.</li>',
        '<li>✅ <strong>Implementat:</strong> <a href="marketing-os.html">UTM Builder v1.2</a> — naming convention profiles + saved campaign templates.</li>',
        '<li>✅ <strong>Implementat:</strong> <a href="marketing-os.html">Marketing OS</a> — hub principal Marketing-Tech: benchmarks, UTM-uri, ROI, funnel și simulări într-un singur workspace.</li>',
        '<li>➡️ <strong>Următorul pas:</strong> Conversion Funnel Visualizer — drop-off rates customizabile și export raport.</li>'
      ].join('');
    }

    var note = now.querySelector('.now-note');
    if(note) note.textContent = 'Actualizat manual: zona Marketing-Tech este acum implementată în Marketing OS.';
  }

  function setMarketingCards(){
    var section = document.getElementById('marketing-tech');
    if(!section) return;
    var title = section.querySelector('#marketing-tech-title, h2');
    if(title) title.textContent = 'Marketing-Tech — tool-uri implementate';

    var subtitle = section.querySelector('.section-subtitle');
    if(subtitle) subtitle.textContent = 'Marketing OS este hub-ul principal: Industry Benchmarks Dashboard + UTM Builder v1.2 + ROI + funnel logic într-un workspace 0 backend.';

    var grid = section.querySelector('.projects-grid');
    if(grid && !grid.querySelector('[data-live-patch="marketing-os"]')){
      var card = document.createElement('article');
      card.className = 'project-card glass';
      card.setAttribute('data-live-patch','marketing-os');
      card.setAttribute('data-status','implemented');
      card.innerHTML = '<span class="badge-new">IMPLEMENTAT</span><div class="project-top"><div><h3>Marketing OS</h3><span class="badge-github">Industry Benchmarks · UTM Builder v1.2</span></div><span class="tag github">marketing-tech</span></div><p class="project-desc">Workspace Marketing-Tech cu benchmarks pe canal, industrie și funnel stage + UTM Builder v1.2 cu naming convention profiles și saved campaign templates.</p><div class="card-actions"><a class="btn btn-primary" href="marketing-os.html">Deschide Marketing OS</a></div>';
      grid.insertBefore(card, grid.firstElementChild);
    }

    section.querySelectorAll('.project-card').forEach(function(card){
      var h = card.querySelector('h3');
      if(!h) return;
      var name = h.textContent.trim();
      if(/Lead Magnet Landing|Webinar Registration Funnel/i.test(name)){
        var badge = card.querySelector('.implementation-badge') || card.querySelector('.badge-new');
        if(badge) badge.textContent = 'Roadmap';
      }
      if(/CampaignPilot|Campaign ROI Calculator|Marketing OS/i.test(name)){
        var badge2 = card.querySelector('.implementation-badge');
        if(!badge2){ badge2 = document.createElement('span'); badge2.className = 'implementation-badge'; card.appendChild(badge2); }
        badge2.textContent = 'Implementat';
      }
    });
  }

  ready(function(){
    setNowImplemented();
    setMarketingCards();
    setTimeout(function(){ setNowImplemented(); setMarketingCards(); }, 350);
    setTimeout(function(){ setNowImplemented(); setMarketingCards(); }, 1200);
  });
})();
