/* Now roadmap v5 — versioned safety patch. Keeps original version in History and shows current work. */
(function(){
  'use strict';

  var VERSION = 'now-roadmap-v5-2026-09-04-project-audit';

  function addStyles(){
    if (document.getElementById('now-roadmap-v5-styles')) return;
    var style = document.createElement('style');
    style.id = 'now-roadmap-v5-styles';
    style.textContent = `
      .now-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 14px;padding:6px;border:1px solid var(--line,rgba(255,255,255,.1));background:var(--panel-2,rgba(255,255,255,.04));border-radius:14px}
      .now-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--muted,#9db0d4);font:inherit;font-size:.84rem;font-weight:800;letter-spacing:.02em;border-radius:10px;padding:9px 14px;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s}
      .now-tab:hover{color:var(--text,#eef4ff);border-color:var(--line,rgba(255,255,255,.14));transform:translateY(-1px)}
      .now-tab.is-active{background:rgba(79,140,255,.14);border-color:rgba(79,140,255,.38);color:var(--accent,#4f8cff);box-shadow:0 10px 28px -20px rgba(79,140,255,.7)}
      .now-panel{display:none}.now-panel.is-active{display:block}.now-panel .now-list{margin-top:0}
      .now-panel-head{margin:0 0 12px;color:var(--muted,#9db0d4);font-size:.9rem;line-height:1.7}.now-panel-head strong{color:var(--text,#eef4ff)}
      .now-version-note{margin:.75rem 0 0;color:var(--muted,#9db0d4);font-size:.85rem;line-height:1.6}
    `;
    document.head.appendChild(style);
  }

  function html(){
    return ''
      + '<div class="now-tabs" role="tablist" aria-label="La ce lucrez acum și istoric">'
      + '<button class="now-tab is-active" type="button" role="tab" aria-selected="true" aria-controls="now-panel-progress" id="now-tab-progress" data-now-tab="progress">🔄 În curs</button>'
      + '<button class="now-tab" type="button" role="tab" aria-selected="false" aria-controls="now-panel-history" id="now-tab-history" data-now-tab="history">✅ Istoric</button>'
      + '</div>'
      + '<div class="now-panel is-active" id="now-panel-progress" role="tabpanel" aria-labelledby="now-tab-progress">'
      + '<p class="now-panel-head"><strong>Focus curent:</strong> maturizarea proiectelor existente prin accesibilitate, PWA, documentație și QA.</p>'
      + '<ul class="now-list">'
      + '<li>🔄 <strong>Project Health Dashboard</strong> — inventar pentru accesibilitate, PWA, README, changelog și mentenanță în proiectele publice. <span class="now-tag">QA</span> <span class="now-tag">GitHub</span></li>'
      + '<li>🔄 <strong>Case studies verificabile</strong> — capturi reale, rezultate măsurabile și decizii tehnice pentru proiectele principale. <span class="now-tag">Proof of work</span></li>'
      + '<li>🧭 <strong>Direcție:</strong> proiectele principale primesc prioritate; variantele și experimentele similare rămân în istoric, fără a dilua selecția Top 3.</li>'
      + '</ul>'
      + '</div>'
      + '<div class="now-panel" id="now-panel-history" role="tabpanel" aria-labelledby="now-tab-history">'
      + '<p class="now-panel-head"><strong>Istoric recent:</strong> versiunea inițială este păstrată aici, nu eliminată.</p>'
      + '<ul class="now-list">'
      + '<li>✅ <strong>ARCADE WORLD v33</strong> — HTML redus 527 KB → 19 KB, bundle-uri minificate automat și Lighthouse median 61 → 77; Accessibility 100.</li>'
      + '<li>✅ <strong><a href="release-timeline.html" style="color:inherit">Release Timeline v1.0</a></strong> — istoric public pentru versiuni, remedieri și decizii.</li>'
      + '<li>✅ <strong>Garden Match Masters v2.1</strong> — accesibilitate cu tastatura, focus, reduced motion, touch targets, manifest și offline cache.</li>'
      + '<li>✅ <strong>Quality automation + rezultate reale</strong> — trei rulări: ARCADE WORLD 61/100 performanță, Garden Match 78–79/100, Excel Quest 99–100/100; toate au Accessibility 100.</li>'
      + '<li>✅ <strong>Standard QUALITY</strong> — release gates și evidence labels comune pentru Top 3 și cele trei jocuri auditate.</li>'
      + '<li>✅ <strong><a href="project-health.html" style="color:inherit">Project Health Dashboard v1.0</a></strong> — inventar pentru 97 de repository-uri, hartă canonică și standard comun de sănătate.</li>'
      + '<li>✅ <strong><a href="proof-registry.html" style="color:inherit">Proof Registry v1.0</a></strong> — dovezi și metrici nemăsurate marcate transparent pentru Top 3.</li>'
      + '<li>✅ <strong><a href="game-audits.html" style="color:inherit">Game QA Audits v1.0</a></strong> — criterii mobile, offline, input și persistență pentru ARCADE WORLD, Garden Match Masters și Excel Quest.</li>'
      + '<li>✅ <strong>Consolidare repository-uri</strong> — cinci proiecte canonice documentate prin PROJECT-STATUS.md; variantele rămân în istoric.</li>'
      + '<li>✅ <strong>Poodle Coach &amp; Care Premium v15</strong> — suita de accesibilitate conectată în aplicație și în cache-ul offline; istoric de versiuni adăugat.</li>'
      + '<li>✅ <strong>LAURAI / Bounce Signal v3.1</strong> — etichete pentru controale iconice, stare live a misiunii, theme color și changelog.</li>'
      + '<li>✅ <strong>MoonMail v1.1</strong> — controale de limbă, temă și motion etichetate pentru tehnologii asistive; changelog adăugat.</li>'
      + '<li>✅ <strong>Link Video Editor Studio</strong> — Automation Pack export funcțional: ZIP, CLI script, Playwright și FFmpeg workflow.</li>'
      + '<li>✅ <strong>Alpis Fusion CRM Premium</strong> — case study extins cu Decision Log complet.</li>'
      + '<li>✅ <strong>Lighthouse CI audit</strong> — preload hints pentru style.css, main.js și imaginea hero.</li>'
      + '<li>✅ <strong>Lead Magnet Landing</strong> — hero hook + social proof + preview tabs + email gate + thank-you flow.</li>'
      + '<li>✅ <strong>ClientFlow</strong> — case study cu protocol de test, fricțiuni reale și pași următori.</li>'
      + '</ul><p class="now-version-note">Versiunea inițială nu a fost eliminată — este inclusă aici ca istoric.</p>'
      + '</div>';
  }

  function upsert(){
    var now = document.getElementById('now');
    if (!now) return;
    addStyles();
    now.dataset.nowRoadmap = VERSION;
    var title = now.querySelector('#now-title,.now-title,h2');
    if (title) title.textContent = 'La ce lucrez acum';
    var badge = now.querySelector('.now-badge');
    if (badge) badge.innerHTML = 'Actualizat: <time datetime="2026-09-04">04 Septembrie 2026</time>';
    var shell = now.querySelector('.now-tabs-shell');
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'now-tabs-shell';
      var list = now.querySelector('.now-list');
      if (list) list.replaceWith(shell);
      else {
        var head = now.querySelector('.now-head');
        if (head) head.insertAdjacentElement('afterend', shell);
      }
    }
    if (shell.dataset.version !== VERSION) {
      shell.innerHTML = html();
      shell.dataset.version = VERSION;
    }
    var tags = now.querySelector('.now-tags');
    if (tags) tags.innerHTML = '<span class="now-tag">În curs</span><span class="now-tag">Istoric</span><span class="now-tag">Project Health</span><span class="now-tag">Accesibilitate</span><span class="now-tag">PWA</span><span class="now-tag">GitHub Pages</span>';
    var note = now.querySelector('.now-note');
    if (note) note.textContent = 'Tabul „În curs” arată focusul curent, iar tabul „Istoric” păstrează livrările recente și versiunea inițială.';
  }

  function bind(){
    var now = document.getElementById('now');
    if (!now || now.__nowRoadmapTabsBound) return;
    now.__nowRoadmapTabsBound = true;
    now.addEventListener('click', function(e){
      var btn = e.target.closest && e.target.closest('.now-tab');
      if (!btn || !now.contains(btn)) return;
      var selected = btn.getAttribute('data-now-tab');
      now.querySelectorAll('.now-tab').forEach(function(tab){
        var active = tab.getAttribute('data-now-tab') === selected;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      now.querySelectorAll('.now-panel').forEach(function(panel){
        panel.classList.toggle('is-active', panel.id === 'now-panel-' + selected);
      });
    });
  }

  function boot(){ upsert(); bind(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  [80,250,700,1500,3200,6000].forEach(function(ms){ setTimeout(boot, ms); });
})();
