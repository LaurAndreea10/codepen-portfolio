/* Now roadmap v5 — versioned safety patch. Keeps original version in History and shows current work. */
(function(){
  'use strict';

  var VERSION = 'now-roadmap-v5-2026-05-22';

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
      + '<p class="now-panel-head"><strong>Focus curent:</strong> două module noi în Marketing OS, utile pentru marketing managers și echipe growth.</p>'
      + '<ul class="now-list">'
      + '<li>🔄 <strong>Industry Benchmarks Dashboard</strong> — dashboard cu benchmarks pe canal, industrie și funnel stage. <a href="marketing-os.html#benchmarks" style="color:var(--accent,#4f8cff)">Deschide Marketing OS →</a> <span class="now-tag">Benchmarks</span> <span class="now-tag">Funnel stage</span></li>'
      + '<li>🔄 <strong>UTM Builder v1.2</strong> — naming convention profiles + saved campaign templates. <a href="marketing-os.html#utm" style="color:var(--accent,#4f8cff)">Testează modulul →</a> <span class="now-tag">UTM</span> <span class="now-tag">Templates</span></li>'
      + '<li>🧭 <strong>Direcție:</strong> Marketing OS rămâne hub-ul principal, iar micro-tool-urile noi intră ca module clare, nu ca proiecte separate pierdute.</li>'
      + '</ul>'
      + '</div>'
      + '<div class="now-panel" id="now-panel-history" role="tabpanel" aria-labelledby="now-tab-history">'
      + '<p class="now-panel-head"><strong>Istoric recent:</strong> versiunea inițială este păstrată aici, nu eliminată.</p>'
      + '<ul class="now-list">'
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
    if (badge) badge.innerHTML = 'Actualizat: <time datetime="2026-05-22">22 Mai 2026</time>';
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
    if (tags) tags.innerHTML = '<span class="now-tag">În curs</span><span class="now-tag">Istoric</span><span class="now-tag">Marketing OS</span><span class="now-tag">Benchmarks</span><span class="now-tag">UTM v1.2</span><span class="now-tag">GitHub Pages</span>';
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
