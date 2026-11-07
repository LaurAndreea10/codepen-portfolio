/* ===== Core: helpers, i18n, store, router + navigation history ===== */
const App = (() => {
  const routes = [];
  const byId = {};
  const state = { lang: 'ro', theme: 'dark', current: null, cleanup: null };

  /* ---------- storage (safe) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('mlab:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mlab:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  state.lang = store.get('lang', (navigator.language || 'ro').startsWith('ro') ? 'ro' : 'en');
  state.theme = store.get('theme', matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  /* ---------- helpers ---------- */
  const L = (ro, en) => (state.lang === 'ro' ? ro : (en == null ? ro : en));
  const T = (o) => (o && typeof o === 'object' ? (o[state.lang] || o.ro) : o);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const fmt = (n, d = 0) => Number(n).toLocaleString(state.lang === 'ro' ? 'ro-RO' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: d });
  const uid = () => Math.random().toString(36).slice(2, 9);
  let toastTimer;
  function toast(msg) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast(L('Copiat în clipboard', 'Copied to clipboard')); }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
      ta.remove(); toast(ok ? L('Copiat', 'Copied') : L('Copierea a fost blocată — selectează manual textul', 'Copy blocked — select the text manually'));
    }
  }
  function download(name, text, mime = 'text/plain') {
    try {
      const url = URL.createObjectURL(new Blob([text], { type: mime }));
      const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast(L('Descărcare pornită: ', 'Download started: ') + name + L(' (dacă e blocată, folosește Copiază)', ' (if blocked, use Copy)'));
    } catch (e) { copy(text); }
  }
  function announce(msg) { const r = $('#live'); if (r) { r.textContent = ''; setTimeout(() => (r.textContent = msg), 30); } }
  function pageHead(r, extraHtml = '') {
    return `<header class="pagehead">
      <div class="eyebrow">${String(r.n).padStart(2, '0')} · ${esc(T(CATS[r.cat]))}</div>
      <h1 tabindex="-1" id="pageTitle">${esc(T(r.title))}</h1>
      <p>${esc(T(r.desc))}</p>
      <div class="shows">${(r.shows || []).map(s => `<span class="badge cyan">${esc(s)}</span>`).join('')}</div>
      ${extraHtml}
    </header>`;
  }

  const CATS = {
    mkt: { ro: 'Marketing-tech', en: 'Marketing tech' },
    data: { ro: 'Analiză de date', en: 'Data analysis' },
    tech: { ro: 'Competențe tehnice', en: 'Tech skills' },
    think: { ro: 'Mod de gândire', en: 'How I think' }
  };

  function register(r) { routes.push(r); byId[r.id] = r; }

  /* ---------- navigation history ----------
     session stack  : back / forward inside this visit (syncs with browser back/forward)
     persistent log : every visit with timestamp + time on page (localStorage)            */
  const ss = { get(k, d) { try { const v = sessionStorage.getItem('mlab:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { sessionStorage.setItem('mlab:' + k, JSON.stringify(v)); } catch (e) {} } };
  const nav = ss.get('nav', { stack: [], idx: -1 });   // survives reloads within the tab
  let log = store.get('history', []);           // [{id, t, dur}]
  let enteredAt = Date.now();

  function currentId() {
    const h = (location.hash || '').replace(/^#/, '');
    return byId[h] ? h : 'home';
  }
  function go(id) { if (!byId[id]) id = 'home'; if (currentId() !== id) location.hash = id; }
  // in-app buttons drive the real browser history, so ← → and the browser's own buttons stay in sync
  function back() { if (nav.idx > 0) history.back(); }
  function forward() { if (nav.idx < nav.stack.length - 1) history.forward(); }

  function trackNav(id, isLoad) {
    let st = null; try { st = history.state; } catch (e) {}
    if (st && typeof st.mlabIdx === 'number' && nav.stack[st.mlabIdx] === id) {
      nav.idx = st.mlabIdx;                                   // browser back/forward (or reload) to a known entry
    } else {
      nav.stack = nav.stack.slice(0, nav.idx + 1);
      if (nav.stack[nav.idx] !== id) { nav.stack.push(id); nav.idx++; }
      if (nav.stack.length > 100) { nav.stack.shift(); nav.idx--; }
      try { history.replaceState({ mlabIdx: nav.idx }, ''); } catch (e) {}
    }
    ss.set('nav', nav);
    if (isLoad && log.length && log[log.length - 1].id === id) return;   // a reload is not a new visit
    const now = Date.now();
    if (log.length) { const last = log[log.length - 1]; if (!last.dur) last.dur = Math.round((now - enteredAt) / 1000); }
    log.push({ id, t: now });
    if (log.length > 200) log = log.slice(-200);
    enteredAt = now;
    store.set('history', log);
  }
  function clearHistory() { log = [{ id: state.current, t: Date.now() }]; enteredAt = Date.now(); store.set('history', log); renderChrome(); toast(L('Istoric șters', 'History cleared')); }
  function visits(id) { return log.filter(e => e.id === id).length; }
  function recent(n = 6) {
    const seen = new Set(); const out = [];
    for (let i = log.length - 1; i >= 0 && out.length < n; i--) { const e = log[i]; if (!seen.has(e.id) && e.id !== 'home') { seen.add(e.id); out.push(e); } }
    return out;
  }
  function timeAgo(t) {
    const s = Math.round((Date.now() - t) / 1000);
    if (s < 60) return L('acum', 'now');
    if (s < 3600) return Math.floor(s / 60) + ' min';
    if (s < 86400) return Math.floor(s / 3600) + ' h';
    return new Date(t).toLocaleDateString(state.lang === 'ro' ? 'ro-RO' : 'en-US', { day: 'numeric', month: 'short' });
  }

  /* ---------- chrome (sidebar, crumbs, drawer) ---------- */
  function renderChrome() {
    const cur = state.current;
    const sb = $('#sidebar');
    let html = `<a href="#home" ${cur === 'home' ? 'aria-current="page"' : ''}><span class="n">⌂</span>${L('Acasă', 'Home')}</a>`;
    for (const c of Object.keys(CATS)) {
      html += `<h4>${esc(T(CATS[c]))}</h4>`;
      for (const r of routes.filter(x => x.cat === c)) {
        html += `<a href="#${r.id}" ${cur === r.id ? 'aria-current="page"' : ''}><span class="n">${String(r.n).padStart(2, '0')}</span>${esc(T(r.title))}</a>`;
      }
    }
    sb.innerHTML = html;
    $('#backBtn').disabled = nav.idx <= 0;
    $('#fwdBtn').disabled = nav.idx >= nav.stack.length - 1;
    $('#backBtn').title = nav.idx > 0 ? L('Înapoi la: ', 'Back to: ') + T(byId[nav.stack[nav.idx - 1]].title) : L('Înapoi', 'Back');
    $('#fwdBtn').title = nav.idx < nav.stack.length - 1 ? L('Înainte la: ', 'Forward to: ') + T(byId[nav.stack[nav.idx + 1]].title) : L('Înainte', 'Forward');
    // crumbs = session trail
    const trail = nav.stack.slice(Math.max(0, nav.idx - 2), nav.idx + 1).map((id, i, a) => i === a.length - 1 ? `<b>${esc(T(byId[id].title))}</b>` : esc(T(byId[id].title)));
    $('#crumb').innerHTML = trail.join(' › ');
    $('#langBtn').textContent = state.lang === 'ro' ? 'EN' : 'RO';
    $('#langBtn').setAttribute('aria-label', L('Switch to English', 'Comută în română'));
    $('#themeBtn').textContent = state.theme === 'dark' ? '☀' : '☾';
    $('#themeBtn').setAttribute('aria-label', L('Schimbă tema', 'Toggle theme'));
    $('#histBtn').setAttribute('aria-label', L('Istoric de navigare', 'Navigation history'));
    $('#histCount').textContent = log.length;
    renderDrawer();
  }
  function renderDrawer() {
    const d = $('#drawer');
    const items = log.slice().reverse().slice(0, 80);
    const durTotal = {};
    log.forEach(e => { if (e.dur) durTotal[e.id] = (durTotal[e.id] || 0) + e.dur; });
    const top = Object.entries(durTotal).filter(([id]) => id !== 'home').sort((a, b) => b[1] - a[1]).slice(0, 3);
    d.innerHTML = `<header><h2 style="margin:0;flex:1">${L('Istoric de navigare', 'Navigation history')}</h2>
      <button class="btn sm danger" id="clearHist">${L('Șterge', 'Clear')}</button>
      <button class="btn sm icon" id="closeDrawer" aria-label="${L('Închide', 'Close')}">✕</button></header>
      <div style="padding:8px 16px 0" class="row">
        <span class="badge">${L('Sesiune', 'Session')}: ${nav.idx + 1}/${nav.stack.length}</span>
        <span class="badge amber">${L('Total vizite', 'Total visits')}: ${log.length}</span>
      </div>
      <ol aria-label="${L('Pagini vizitate, cele mai recente primele', 'Visited pages, newest first')}">
        ${items.length ? items.map((e, i) => { const r = byId[e.id]; if (!r) return ''; return `<li class="${i === 0 ? 'cur' : ''}"><a href="#${e.id}" data-close><span class="mono" style="color:var(--amber)">${r.n ? String(r.n).padStart(2, '0') : '⌂'}</span><span>${esc(T(r.title))}${e.dur ? ` <span class="hint">· ${e.dur}s</span>` : ''}</span><time datetime="${new Date(e.t).toISOString()}">${timeAgo(e.t)}</time></a></li>`; }).join('') : `<li class="hint" style="padding:12px">${L('Nimic încă.', 'Nothing yet.')}</li>`}
      </ol>
      <div class="stats"><b>${L('Cel mai mult timp petrecut', 'Most time spent')}:</b><br>${top.length ? top.map(([id, s]) => `${esc(T(byId[id].title))} — ${s}s`).join('<br>') : '—'}
      <div class="hint">${L('Scurtături: H = istoric, [ și ] = înapoi / înainte', 'Shortcuts: H = history, [ and ] = back / forward')}</div></div>`;
    $('#clearHist', d).onclick = clearHistory;
    $('#closeDrawer', d).onclick = closeDrawer;
    $$('[data-close]', d).forEach(a => a.addEventListener('click', closeDrawer));
  }
  function openDrawer() { $('#drawer').classList.add('open'); $('#scrim').classList.add('show'); $('#histBtn').setAttribute('aria-expanded', 'true'); renderDrawer(); setTimeout(() => $('#closeDrawer') && $('#closeDrawer').focus(), 50); }
  function closeDrawer() { $('#drawer').classList.remove('open'); $('#scrim').classList.remove('show'); $('#histBtn').setAttribute('aria-expanded', 'false'); }

  /* ---------- render ---------- */
  function render(focus = true) {
    const id = currentId();
    if (state.cleanup) { try { state.cleanup(); } catch (e) {} state.cleanup = null; }
    const routeChanged = state.current !== id;
    if (routeChanged) trackNav(id, state.current == null);
    state.current = id;
    const r = byId[id];
    const main = $('#main');
    main.innerHTML = '';
    const root = document.createElement('div');
    main.appendChild(root);
    try { state.cleanup = r.render(root) || null; }
    catch (e) { console.error(e); root.innerHTML = `<div class="card bad">${L('Eroare la încărcare: ', 'Load error: ')}${esc(e.message)}</div>`; }
    main.insertAdjacentHTML('beforeend', `<footer class="footer">Marketing Lab · ${L('creat de', 'built by')} <b>Laura Andreea</b> · Iași · <a href="https://laurandreea10.github.io/codepen-portfolio/">${L('Portofoliu', 'Portfolio')}</a></footer>`);
    document.title = (id === 'home' ? 'Marketing Lab' : T(r.title) + ' · Marketing Lab') + ' — Laura Andreea';
    document.documentElement.lang = state.lang;
    renderChrome();
    $('#sidebar').classList.remove('open');
    if (routeChanged && focus) { window.scrollTo(0, 0); const h = $('#pageTitle'); if (h) h.focus({ preventScroll: true }); announce(T(r.title)); }
  }

  function setLang(l) { state.lang = l; store.set('lang', l); render(false); }
  function setTheme(t) { state.theme = t; store.set('theme', t); document.documentElement.dataset.theme = t; renderChrome(); }

  function init() {
    document.documentElement.dataset.theme = state.theme;
    $('#backBtn').onclick = back;
    $('#fwdBtn').onclick = forward;
    $('#histBtn').onclick = () => ($('#drawer').classList.contains('open') ? closeDrawer() : openDrawer());
    $('#scrim').onclick = () => { closeDrawer(); $('#sidebar').classList.remove('open'); };
    $('#langBtn').onclick = () => setLang(state.lang === 'ro' ? 'en' : 'ro');
    $('#themeBtn').onclick = () => setTheme(state.theme === 'dark' ? 'light' : 'dark');
    $('#menuBtn').onclick = () => { $('#sidebar').classList.toggle('open'); };
    window.addEventListener('hashchange', () => render());
    window.addEventListener('beforeunload', () => { if (log.length) { const last = log[log.length - 1]; if (!last.dur) { last.dur = Math.round((Date.now() - enteredAt) / 1000); store.set('history', log); } } });
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag) || e.target.isContentEditable || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Escape') closeDrawer();
      else if (e.key === 'h' || e.key === 'H') { e.preventDefault(); $('#drawer').classList.contains('open') ? closeDrawer() : openDrawer(); }
      else if (e.key === '[') back();
      else if (e.key === ']') forward();
    });
    render(false);
  }

  return { register, routes, byId, state, store, L, T, esc, $, $$, fmt, uid, toast, copy, download, pageHead, go, init, visits, recent, timeAgo, CATS, setTheme };
})();
