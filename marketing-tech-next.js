/* Marketing-Tech next tools — adds Marketing OS cards without changing index.html structure. */
(function(){
  'use strict';

  function lang(){ return document.documentElement.lang === 'en' ? 'en' : 'ro'; }

  function addStyles(){
    if (document.getElementById('marketing-tech-next-styles')) return;
    var style = document.createElement('style');
    style.id = 'marketing-tech-next-styles';
    style.textContent = `
      #marketing-tech [data-tool="marketing-os-hub"],
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
    if (type === 'hub') {
      return '<span class="badge-new">LIVE</span><div class="project-top"><div><h3>Marketing OS</h3><span class="badge-github">Benchmarks · UTM v1.2 · ROI · Briefs</span></div><span class="tag github">product hub</span></div><p class="project-desc">' +
        (en ? 'Active Marketing-Tech hub: campaign planning, benchmarks, UTM v1.2, ROI, lead magnet and brief generator in one zero-backend workspace.' : 'Hub activ Marketing-Tech: campanii, benchmarks, UTM v1.2, ROI, lead magnet și brief generator într-un workspace 0 backend.') +
        '</p><p class="mt-roadmap-tag">✅ GitHub Pages · localStorage · RO/EN</p><div class="card-actions"><a class="btn btn-primary" href="./marketing-os.html">' +
        (en ? 'Open Marketing OS' : 'Deschide Marketing OS') + '</a><a class="btn btn-secondary" href="#now">' +
        (en ? 'See current status' : 'Vezi statusul') + '</a></div>';
    }
    if (type === 'industry') {
      return '<span class="badge-new">ÎN CURS</span><div class="project-top"><div><h3>Industry Benchmarks Dashboard</h3><span class="badge-github">Benchmarks by channel · industry · funnel stage</span></div><span class="tag github">marketing-tech</span></div><p class="project-desc">' +
        (en ? 'Dashboard for comparing campaign metrics against demo benchmarks by channel, industry and funnel stage. Built inside Marketing OS.' : 'Dashboard pentru compararea metricilor de campanie cu benchmark-uri demo pe canal, industrie și funnel stage. Integrat în Marketing OS.') +
        '</p><p class="mt-roadmap-tag">📊 0 backend · localStorage · RO/EN</p><div class="card-actions"><a class="btn btn-primary" href="./marketing-os.html#benchmarks">' +
        (en ? 'Open dashboard' : 'Deschide dashboard') + '</a><a class="btn btn-secondary" href="#now">' +
        (en ? 'Current build' : 'Build curent') + '</a></div>';
    }
    return '<span class="badge-new">v1.2</span><div class="project-top"><div><h3>UTM Builder v1.2</h3><span class="badge-github">Naming profiles · saved campaign templates</span></div><span class="tag github">utility</span></div><p class="project-desc">' +
      (en ? 'Upgrade inside Marketing OS: naming convention profiles, saved campaign templates, generated URL, validation and copyable report.' : 'Upgrade integrat în Marketing OS: profile de naming convention, template-uri de campanii salvate, URL generat, validare și raport copiabil.') +
      '</p><p class="mt-roadmap-tag">🔗 strict lowercase · paid media · content · CRM lifecycle</p><div class="card-actions"><a class="btn btn-primary" href="./marketing-os.html#utm">' +
      (en ? 'Open UTM Builder' : 'Deschide UTM Builder') + '</a><a class="btn btn-secondary" href="./marketing-os.html">' +
      (en ? 'Marketing OS context' : 'Context Marketing OS') + '</a></div>';
  }

  function upsert(){
    var section = document.getElementById('marketing-tech');
    var grid = section && section.querySelector('.projects-grid');
    if (!grid) return;
    addStyles();

    var title = section.querySelector('#marketing-tech-title,h2');
    if (title) title.textContent = lang() === 'en' ? 'Marketing-Tech — active hub + current roadmap' : 'Marketing-Tech — hub activ + roadmap în lucru';
    var subtitle = section.querySelector('.section-subtitle');
    if (subtitle) subtitle.textContent = lang() === 'en'
      ? 'Marketing OS is the main hub: Industry Benchmarks Dashboard, UTM Builder v1.2, ROI, lead magnets and brief generator in one zero-backend workspace.'
      : 'Marketing OS rămâne hub-ul principal: Industry Benchmarks Dashboard, UTM Builder v1.2, ROI, lead magnets și brief generator într-un workspace 0 backend.';

    var hub = grid.querySelector('[data-tool="marketing-os-hub"]');
    if (!hub) {
      hub = document.createElement('article');
      hub.className = 'project-card glass';
      hub.dataset.tool = 'marketing-os-hub';
      grid.insertBefore(hub, grid.firstElementChild);
    }
    hub.innerHTML = cardHTML('hub');

    var industry = grid.querySelector('[data-tool="industry-benchmarks"]');
    if (!industry) {
      industry = document.createElement('article');
      industry.className = 'project-card glass';
      industry.dataset.tool = 'industry-benchmarks';
      grid.insertBefore(industry, hub.nextSibling);
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
  document.addEventListener('click', function(e){ if (e.target && e.target.id === 'langToggle') setTimeout(boot, 120); });
  [150,600,1500,3200].forEach(function(ms){ setTimeout(boot, ms); });
})();
