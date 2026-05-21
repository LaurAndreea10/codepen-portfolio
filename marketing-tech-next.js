/* Marketing-Tech next tools — adds learning cards without changing index.html structure. */
(function(){
  'use strict';

  function lang(){ return document.documentElement.lang === 'en' ? 'en' : 'ro'; }

  function addStyles(){
    if (document.getElementById('marketing-tech-next-styles')) return;
    var style = document.createElement('style');
    style.id = 'marketing-tech-next-styles';
    style.textContent = `
      #marketing-tech [data-tool="industry-benchmarks"],
      #marketing-tech [data-tool="utm-builder-v12"]{
        border-color:rgba(34,211,238,.34);
        background:linear-gradient(135deg,rgba(34,211,238,.08),rgba(91,141,239,.05)),var(--panel,rgba(255,255,255,.03));
      }
      #marketing-tech .mt-roadmap-tag{display:inline-flex;align-items:center;gap:6px;margin-top:6px;color:var(--muted,#9db0d4);font-size:.78rem;font-weight:700}
    `;
    document.head.appendChild(style);
  }

  function cardHTML(type){
    var en = lang() === 'en';
    if (type === 'industry') {
      return '<span class="badge-new">NEXT TOOL</span><div class="project-top"><div><h3>Industry Benchmarks Dashboard</h3><span class="badge-github">Benchmarks by channel · industry · funnel stage</span></div><span class="tag github">marketing-tech</span></div><p class="project-desc">' +
        (en ? 'Learning dashboard for comparing campaign metrics against demo benchmarks by channel, industry and funnel stage. Includes quick insight states and JSON export.' : 'Dashboard de învățare pentru compararea metricilor de campanie cu benchmark-uri demo pe canal, industrie și funnel stage. Include insight states și export JSON.') +
        '</p><p class="mt-roadmap-tag">📊 0 backend · localStorage · RO/EN</p><div class="card-actions"><a class="btn btn-primary" href="./industry-benchmarks.html">' +
        (en ? 'Open dashboard' : 'Deschide dashboard') + '</a><a class="btn btn-secondary" href="#now">' +
        (en ? 'Current build →' : 'Build curent →') + '</a></div>';
    }
    return '<span class="badge-new">v1.2</span><div class="project-top"><div><h3>UTM Builder v1.2</h3><span class="badge-github">Naming profiles · saved campaign templates</span></div><span class="tag github">utility</span></div><p class="project-desc">' +
      (en ? 'Upgrade inside Industry Benchmarks: naming convention profiles, saved campaign templates, generated URL and copyable report.' : 'Upgrade integrat în Industry Benchmarks: profile de naming convention, template-uri de campanii salvate, URL generat și raport copiabil.') +
      '</p><p class="mt-roadmap-tag">🔗 strict lowercase · readable dash · RO campaign · SaaS B2B</p><div class="card-actions"><a class="btn btn-primary" href="./industry-benchmarks.html#utm">' +
      (en ? 'Open UTM Builder' : 'Deschide UTM Builder') + '</a><a class="btn btn-secondary" href="./industry-benchmarks.html">' +
      (en ? 'Dashboard context' : 'Context dashboard') + '</a></div>';
  }

  function upsert(){
    var section = document.getElementById('marketing-tech');
    var grid = section && section.querySelector('.projects-grid');
    if (!grid) return;
    addStyles();

    var industry = grid.querySelector('[data-tool="industry-benchmarks"]');
    if (!industry) {
      industry = document.createElement('article');
      industry.className = 'project-card glass';
      industry.dataset.tool = 'industry-benchmarks';
      grid.insertBefore(industry, grid.firstElementChild);
    }
    industry.innerHTML = cardHTML('industry');

    var utm = grid.querySelector('[data-tool="utm-builder-v12"]');
    if (!utm) {
      utm = document.createElement('article');
      utm.className = 'project-card glass';
      utm.dataset.tool = 'utm-builder-v12';
      grid.insertBefore(utm, industry.nextSibling);
    }
    utm.innerHTML = cardHTML('utm');
  }

  function boot(){ upsert(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('click', function(e){ if (e.target && e.target.id === 'langToggle') setTimeout(upsert, 120); });
})();
