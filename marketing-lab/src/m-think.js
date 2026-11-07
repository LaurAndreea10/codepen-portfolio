/* ===== 13–15 How I think ===== */
(() => {
  const { L, T, esc, $, $$, register, store, copy, toast, fmt, pageHead } = App;

  /* ---------- 13 Performance Lab + case study ---------- */
  const vitals = { fcp: null, lcp: null, cls: 0, longTasks: 0, longMs: 0 };
  try {
    new PerformanceObserver(l => l.getEntries().forEach(e => { if (e.name === 'first-contentful-paint') vitals.fcp = e.startTime; })).observe({ type: 'paint', buffered: true });
    new PerformanceObserver(l => { const es = l.getEntries(); if (es.length) vitals.lcp = es[es.length - 1].startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) vitals.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => l.getEntries().forEach(e => { vitals.longTasks++; vitals.longMs += e.duration; })).observe({ type: 'longtask', buffered: true });
  } catch (e) {}
  const OPT = [
    ['img', { ro: 'Imagini convertite în WebP/AVIF și dimensionate corect', en: 'Images converted to WebP/AVIF and sized correctly' }],
    ['lazy', { ro: 'loading="lazy" pe imaginile de sub fold', en: 'loading="lazy" on below-the-fold images' }],
    ['defer', { ro: 'Scripturi cu defer / încărcate după interacțiune', en: 'Scripts deferred / loaded on interaction' }],
    ['font', { ro: 'Fonturi cu font-display: swap și preconnect', en: 'Fonts with font-display: swap and preconnect' }],
    ['raf', { ro: 'Bucla de joc pe requestAnimationFrame, fără setInterval', en: 'Game loop on requestAnimationFrame, no setInterval' }],
    ['pool', { ro: 'Object pooling pentru particule și inamici (mai puțin garbage collection)', en: 'Object pooling for particles and enemies (less GC)' }],
    ['canvas', { ro: 'Canvas offscreen pentru fundaluri statice', en: 'Offscreen canvas for static backgrounds' }],
    ['audio', { ro: 'Audio generat procedural în loc de fișiere mari', en: 'Procedural audio instead of large files' }],
    ['min', { ro: 'CSS/JS minificat, cod mort eliminat', en: 'Minified CSS/JS, dead code removed' }],
    ['cls', { ro: 'Dimensiuni fixe pentru media → fără layout shift', en: 'Fixed media dimensions → no layout shift' }]
  ];
  const METRICS = [['perf', 'Performance', ''], ['a11y', 'Accessibility', ''], ['bp', 'Best Practices', ''], ['seo', 'SEO', ''], ['lcp', 'LCP', 's'], ['tbt', 'TBT', 'ms'], ['cls', 'CLS', ''], ['kb', L('Mărime pagină', 'Page weight'), 'KB']];
  let cs = store.get('casestudy', null) || { project: 'Surf Run', url: 'https://laurandreea10.github.io/codepen-portfolio/', before: {}, after: {}, opts: [], notes: '' };
  let perfTab = 'live';
  register({
    id: 'performance', n: 13, cat: 'think',
    title: { ro: 'Performance Lab & studiu de caz', en: 'Performance Lab & case study' },
    desc: { ro: 'Măsori live Core Web Vitals, FPS și long tasks, apoi documentezi optimizarea unui joc (ex. Surf Run): Lighthouse înainte și după, ce ai schimbat și de ce.', en: 'Measure live Core Web Vitals, FPS and long tasks, then document optimising a game (e.g. Surf Run): Lighthouse before/after, what changed and why.' },
    shows: ['PerformanceObserver', 'Core Web Vitals', 'rAF FPS meter', 'Markdown export'],
    render(root) {
      let raf = 0, fpsHist = [], last = performance.now(), frames = 0, alive = true;
      const loop = (t) => { if (!alive) return; frames++; if (t - last >= 500) { fpsHist.push(Math.round(frames * 1000 / (t - last))); fpsHist = fpsHist.slice(-60); frames = 0; last = t; paintLive(); } raf = requestAnimationFrame(loop); };
      const nav = performance.getEntriesByType('navigation')[0];
      const paintLive = () => {
        const el = $('#perfLive', root); if (!el) return;
        const fps = fpsHist[fpsHist.length - 1] || 0, W = 300, H = 60;
        const path = fpsHist.map((v, i) => `${i ? 'L' : 'M'}${(i / 59 * W).toFixed(1)},${(H - Math.min(v, 120) / 120 * H).toFixed(1)}`).join('');
        const mem = performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB' : 'n/a';
        const rate = (v, g, p) => v == null ? '' : v <= g ? 'ok' : v <= p ? 'warn' : 'bad';
        el.innerHTML = `<div class="grid g4">
          <div class="kpi"><div class="v ${fps >= 55 ? 'ok' : fps >= 30 ? 'warn' : 'bad'}">${fps}</div><div class="l">FPS</div></div>
          <div class="kpi"><div class="v ${rate(vitals.fcp, 1800, 3000)}">${vitals.fcp != null ? (vitals.fcp / 1000).toFixed(2) + 's' : 'n/a'}</div><div class="l">FCP</div></div>
          <div class="kpi"><div class="v ${rate(vitals.lcp, 2500, 4000)}">${vitals.lcp != null ? (vitals.lcp / 1000).toFixed(2) + 's' : 'n/a'}</div><div class="l">LCP</div></div>
          <div class="kpi"><div class="v ${rate(vitals.cls, .1, .25)}">${vitals.cls.toFixed(3)}</div><div class="l">CLS</div></div>
          <div class="kpi"><div class="v ${vitals.longTasks ? 'warn' : 'ok'}">${vitals.longTasks}</div><div class="l">long tasks · ${Math.round(vitals.longMs)}ms</div></div>
          <div class="kpi"><div class="v">${nav ? Math.round(nav.responseStart - nav.requestStart) + 'ms' : 'n/a'}</div><div class="l">TTFB</div></div>
          <div class="kpi"><div class="v">${nav ? Math.round(nav.domContentLoadedEventEnd) + 'ms' : 'n/a'}</div><div class="l">DOMContentLoaded</div></div>
          <div class="kpi"><div class="v">${fmt(document.getElementsByTagName('*').length)}</div><div class="l">${L('noduri DOM', 'DOM nodes')} · heap ${mem}</div></div></div>
          <svg viewBox="0 0 ${W} ${H}" width="100%" height="70" preserveAspectRatio="none" role="img" aria-label="FPS ${fps}" style="margin-top:10px;background:var(--panel2);border-radius:8px"><line x1="0" x2="${W}" y1="${H - 60 / 120 * H}" y2="${H - 60 / 120 * H}" stroke="var(--line)" stroke-dasharray="3 3"/><path d="${path}" fill="none" stroke="var(--cyan)" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>
          <p class="hint">${L('Linia punctată = 60 FPS. Valorile n/a apar în browserele care nu expun acel API (ex. LCP în Safari).', 'Dotted line = 60 FPS. n/a appears in browsers that do not expose that API (e.g. LCP in Safari).')}</p>`;
      };
      const md = () => {
        const row = ([k, n, u]) => `| ${n} | ${cs.before[k] ?? '—'}${u && cs.before[k] ? ' ' + u : ''} | ${cs.after[k] ?? '—'}${u && cs.after[k] ? ' ' + u : ''} |`;
        return `# ${L('Studiu de caz: optimizarea', 'Case study: optimising')} ${cs.project}\n\n${L('Autor', 'Author')}: Laura Andreea · ${cs.url}\n\n## ${L('Rezultate Lighthouse', 'Lighthouse results')}\n\n| ${L('Metrică', 'Metric')} | ${L('Înainte', 'Before')} | ${L('După', 'After')} |\n|---|---|---|\n${METRICS.map(row).join('\n')}\n\n## ${L('Ce am optimizat', 'What I optimised')}\n\n${cs.opts.map(k => '- ' + T(OPT.find(o => o[0] === k)[1])).join('\n') || '-'}\n\n## ${L('De ce', 'Why')}\n\n${cs.notes || '-'}\n`;
      };
      const draw = () => {
        root.innerHTML = pageHead(this) + `
        <div class="tabs" role="tablist">${[['live', L('Măsurători live', 'Live metrics')], ['case', L('Studiu de caz', 'Case study')]].map(([k, v]) => `<button role="tab" aria-selected="${perfTab === k}" data-pt="${k}">${v}</button>`).join('')}</div>
        ${perfTab === 'live' ? `<div class="card"><h2>${L('Această aplicație, acum', 'This app, right now')}</h2><div id="perfLive" aria-live="off"></div>
          <div class="row" style="margin-top:12px"><button class="btn amber" id="jank">${L('Provoacă un long task (300ms)', 'Trigger a long task (300ms)')}</button><span class="hint">${L('Urmărește cum scade FPS-ul și crește numărul de long tasks.', 'Watch FPS drop and the long-task count rise.')}</span></div></div>`
        : `<div class="grid g2">
          <div class="card"><h2>${L('Date', 'Data')}</h2>
            <div class="grid g2" style="gap:10px"><div class="field"><label for="cs-p">${L('Proiect', 'Project')}</label><input id="cs-p" data-cs="project" value="${esc(cs.project)}"></div><div class="field"><label for="cs-u">URL</label><input id="cs-u" data-cs="url" value="${esc(cs.url)}"></div></div>
            <p class="hint">${L('Rulează Lighthouse (Chrome DevTools → Lighthouse, mod Mobile) înainte și după optimizare și trece aici cifrele reale.', 'Run Lighthouse (Chrome DevTools → Lighthouse, Mobile) before and after optimising, and enter the real numbers here.')}</p>
            <div class="tablewrap"><table><thead><tr><th>${L('Metrică', 'Metric')}</th><th>${L('Înainte', 'Before')}</th><th>${L('După', 'After')}</th></tr></thead><tbody>
            ${METRICS.map(([k, n, u]) => `<tr><td>${n}${u ? ` <span class="hint">(${u})</span>` : ''}</td><td><input type="number" step="any" aria-label="${n} ${L('înainte', 'before')}" data-b="${k}" value="${cs.before[k] ?? ''}"></td><td><input type="number" step="any" aria-label="${n} ${L('după', 'after')}" data-a="${k}" value="${cs.after[k] ?? ''}"></td></tr>`).join('')}</tbody></table></div>
            <h3 style="margin-top:14px">${L('Ce ai optimizat', 'What you optimised')}</h3>
            ${OPT.map(([k, t]) => `<label class="row" style="margin:0 0 6px;color:var(--text);font-weight:400"><input type="checkbox" data-o="${k}" ${cs.opts.includes(k) ? 'checked' : ''}> ${esc(T(t))}</label>`).join('')}
            <div class="field" style="margin-top:10px"><label for="cs-n">${L('De ce — raționamentul tău', 'Why — your reasoning')}</label><textarea id="cs-n" data-cs="notes" style="font-family:var(--f-body)">${esc(cs.notes)}</textarea></div>
          </div>
          <div class="card"><h2>${L('Comparație', 'Comparison')}</h2><div id="csChart"></div><h3 style="margin-top:14px">Markdown</h3><pre id="csMd">${esc(md())}</pre><button class="btn primary" id="csCopy">${L('Copiază Markdown', 'Copy Markdown')}</button></div></div>`}`;
        $$('[data-pt]', root).forEach(b => b.onclick = () => { perfTab = b.dataset.pt; draw(); });
        if (perfTab === 'live') { paintLive(); $('#jank', root).onclick = () => { const s = performance.now(); while (performance.now() - s < 300) {} toast(L('Long task de 300ms rulat', '300ms long task ran')); }; return; }
        const chart = () => {
          const sc = ['perf', 'a11y', 'bp', 'seo'];
          const has = sc.some(k => cs.before[k] != null || cs.after[k] != null);
          $('#csChart', root).innerHTML = has ? sc.map(k => { const b = +cs.before[k] || 0, a = +cs.after[k] || 0; const n = METRICS.find(m => m[0] === k)[1]; return `<div style="margin-bottom:10px"><div class="row" style="justify-content:space-between"><span>${n}</span><span class="mono">${cs.before[k] ?? '—'} → <b class="${a >= b ? 'ok' : 'bad'}">${cs.after[k] ?? '—'}</b></span></div>
            <div style="background:var(--panel2);border-radius:4px;height:8px;margin:3px 0"><div style="width:${Math.min(100, b)}%;height:100%;background:var(--muted);border-radius:4px"></div></div><div style="background:var(--panel2);border-radius:4px;height:8px"><div style="width:${Math.min(100, a)}%;height:100%;background:${a >= 90 ? 'var(--green)' : a >= 50 ? 'var(--amber)' : 'var(--red)'};border-radius:4px"></div></div></div>`; }).join('') : `<p class="hint">${L('Completează scorurile ca să vezi graficul.', 'Fill in scores to see the chart.')}</p>`;
          $('#csMd', root).textContent = md();
        };
        chart();
        const save = () => { store.set('casestudy', cs); chart(); };
        $$('[data-cs]', root).forEach(i => i.addEventListener('input', () => { cs[i.dataset.cs] = i.value; save(); }));
        $$('[data-b]', root).forEach(i => i.addEventListener('input', () => { if (i.value === '') delete cs.before[i.dataset.b]; else cs.before[i.dataset.b] = +i.value; save(); }));
        $$('[data-a]', root).forEach(i => i.addEventListener('input', () => { if (i.value === '') delete cs.after[i.dataset.a]; else cs.after[i.dataset.a] = +i.value; save(); }));
        $$('[data-o]', root).forEach(i => i.addEventListener('change', () => { cs.opts = i.checked ? [...cs.opts, i.dataset.o] : cs.opts.filter(x => x !== i.dataset.o); save(); }));
        $('#csCopy', root).onclick = () => copy(md());
      };
      draw();
      raf = requestAnimationFrame(loop);
      return () => { alive = false; cancelAnimationFrame(raf); };
    }
  });

  /* ---------- 14 Accessibility audit ---------- */
  const parseRgb = s => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] == null ? 1 : p[3] }; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const hex2rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }; };
  const bgOf = el => { while (el && el.nodeType === 1) { const cs = getComputedStyle(el); if (cs.backgroundImage !== 'none') return null; const c = parseRgb(cs.backgroundColor); if (c && c.a > 0.5) return c; el = el.parentElement; } return parseRgb(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 }; };
  const accName = el => (el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') && (document.getElementById(el.getAttribute('aria-labelledby')) || {}).textContent) || el.textContent || el.getAttribute('title') || (el.querySelector && el.querySelector('img[alt]') && el.querySelector('img[alt]').alt) || el.value || '').trim();
  function audit(scope) {
    const out = []; const add = (sev, rule, msg, el) => out.push({ sev, rule, msg, el });
    const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && (r.width > 0 || r.height > 0); };
    scope.querySelectorAll('img').forEach(i => { if (!i.hasAttribute('alt')) add('err', '1.1.1', L('Imagine fără atribut alt', 'Image without alt attribute'), i); });
    scope.querySelectorAll('button,[role=button]').forEach(b => { if (visible(b) && !accName(b)) add('err', '4.1.2', L('Buton fără nume accesibil', 'Button without accessible name'), b); });
    scope.querySelectorAll('a[href]').forEach(a => { if (visible(a) && !accName(a)) add('err', '2.4.4', L('Link fără text', 'Link without text'), a); });
    scope.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea').forEach(i => {
      const lab = (i.id && scope.querySelector(`label[for="${CSS.escape(i.id)}"]`)) || i.closest('label') || i.getAttribute('aria-label') || i.getAttribute('aria-labelledby');
      if (!lab) add('err', '1.3.1', L('Câmp de formular fără etichetă', 'Form field without label'), i);
    });
    const hs = [...scope.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible);
    for (let k = 1; k < hs.length; k++) if (+hs[k].tagName[1] - +hs[k - 1].tagName[1] > 1) add('warn', '1.3.1', L(`Salt de nivel: ${hs[k - 1].tagName} → ${hs[k].tagName}`, `Level skip: ${hs[k - 1].tagName} → ${hs[k].tagName}`), hs[k]);
    scope.querySelectorAll('[tabindex]').forEach(e => { if (+e.getAttribute('tabindex') > 0) add('warn', '2.4.3', L('tabindex pozitiv strică ordinea de focus', 'Positive tabindex breaks focus order'), e); });
    scope.querySelectorAll('[onclick]:not(button):not(a):not(input)').forEach(e => { if (!e.getAttribute('role') && !e.hasAttribute('tabindex')) add('err', '2.1.1', L('Element clicabil inaccesibil de la tastatură', 'Clickable element not keyboard accessible'), e); });
    let checked = 0;
    [...scope.querySelectorAll('p,span,a,button,label,td,th,li,h1,h2,h3,h4,div')].filter(e => visible(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).slice(0, 400).forEach(e => {
      const s = getComputedStyle(e); const fg = parseRgb(s.color); if (!fg) return; checked++;
      const bg = bgOf(e); if (!bg) { checked--; return; } const r = ratio(fg, bg); const big = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && +s.fontWeight >= 700);
      if (r < (big ? 3 : 4.5)) add('err', '1.4.3', L(`Contrast ${r.toFixed(2)}:1 (minim ${big ? 3 : 4.5}:1)`, `Contrast ${r.toFixed(2)}:1 (min ${big ? 3 : 4.5}:1)`) + ` — "${e.textContent.trim().slice(0, 30)}"`, e);
    });
    return { issues: out, checked };
  }
  const BROKEN = `<div style="background:#fff;color:#111;padding:16px;border-radius:8px">
  <h2 style="color:#111">Oferta lunii</h2>
  <h4 style="color:#111">Detalii</h4>
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Crect width='120' height='40' fill='%234fd8eb'/%3E%3C/svg%3E">
  <p style="color:#aaa">Text gri deschis pe alb, greu de citit.</p>
  <input placeholder="Email">
  <button style="background:#4fd8eb;border:0;padding:8px">✉</button>
  <div onclick="void 0" style="color:#fff;background:#7dd3fc;padding:8px;display:inline-block">Cumpără acum</div>
  <a href="#a11y-audit" tabindex="3"></a>
</div>`;
  const FIXED = `<div style="background:#fff;color:#111;padding:16px;border-radius:8px">
  <h2 style="color:#111">Oferta lunii</h2>
  <h3 style="color:#111">Detalii</h3>
  <img alt="Banner ofertă: 20% reducere" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Crect width='120' height='40' fill='%234fd8eb'/%3E%3C/svg%3E">
  <p style="color:#4a5568">Text cu contrast suficient (7.5:1).</p>
  <label for="fx-email" style="color:#111">Email</label> <input id="fx-email" type="email" placeholder="nume@firma.ro">
  <button aria-label="Trimite emailul" style="background:#0a7f91;color:#fff;border:0;padding:8px">✉ Trimite</button>
  <button style="color:#fff;background:#08707f;padding:8px;border:0">Cumpără acum</button>
  <a href="#a11y-audit" style="color:#0a58ca">Vezi termenii ofertei</a>
</div>`;
  let a11yScope = 'broken', a11yTab = 'audit', cc = { fg: '#9db0cc', bg: '#13243f' }, sortK = 'v', sortD = 'descending';
  register({
    id: 'a11y-audit', n: 14, cat: 'think',
    title: { ro: 'Audit de accesibilitate (WCAG AA)', en: 'Accessibility audit (WCAG AA)' },
    desc: { ro: 'Un scanner care verifică live contrastul, etichetele, numele accesibile și ierarhia titlurilor, cu explicarea fiecărei reparații înainte și după.', en: 'A live scanner checking contrast, labels, accessible names and heading order, with every fix explained before and after.' },
    shows: ['WCAG 2.2', 'contrast ratio', 'aria-sort', 'keyboard nav'],
    render(root) {
      const draw = () => {
        root.innerHTML = pageHead(this) + `
        <div class="tabs" role="tablist">${[['audit', 'Audit'], ['contrast', L('Verificator contrast', 'Contrast checker')], ['table', L('Tabel accesibil', 'Accessible table')]].map(([k, v]) => `<button role="tab" aria-selected="${a11yTab === k}" data-at="${k}">${v}</button>`).join('')}</div><div id="aBody"></div>`;
        $$('[data-at]', root).forEach(b => b.onclick = () => { a11yTab = b.dataset.at; draw(); });
        const body = $('#aBody', root);
        if (a11yTab === 'audit') {
          body.innerHTML = `<div class="card" style="margin-bottom:16px"><div class="row">
            ${[['broken', L('Componentă cu probleme', 'Broken component')], ['fixed', L('Aceeași componentă, reparată', 'Same component, fixed')], ['app', L('Toată aplicația (pagina curentă)', 'The whole app (current page)')]].map(([k, v]) => `<label class="row" style="margin:0;color:var(--text)"><input type="radio" name="asc" value="${k}" ${a11yScope === k ? 'checked' : ''}> ${v}</label>`).join('')}</div></div>
            <div class="grid g2"><div class="card"><h2>${L('Componenta testată', 'Tested component')}</h2><div id="aSand">${a11yScope === 'broken' ? BROKEN : a11yScope === 'fixed' ? FIXED : `<p class="hint">${L('Se scanează tot documentul, inclusiv bara laterală și antetul.', 'Scanning the whole document, including sidebar and header.')}</p>`}</div>
              ${a11yScope !== 'app' ? `<h3 style="margin-top:12px">HTML</h3><pre>${esc(a11yScope === 'broken' ? BROKEN : FIXED)}</pre>` : ''}</div>
            <div class="card" id="aRes" aria-live="polite"></div></div>`;
          $$('[name=asc]', body).forEach(x => x.onchange = () => { a11yScope = x.value; draw(); });
          requestAnimationFrame(() => {
            const scope = a11yScope === 'app' ? document : $('#aSand', body);
            const { issues, checked } = audit(scope);
            const errs = issues.filter(i => i.sev === 'err').length, warns = issues.length - errs;
            const score = Math.max(0, 100 - errs * 12 - warns * 4);
            const fixes = { '1.1.1': L('Adaugă alt descriptiv (sau alt="" dacă e decorativă).', 'Add descriptive alt (or alt="" if decorative).'), '4.1.2': L('Pune text vizibil sau aria-label.', 'Add visible text or aria-label.'), '2.4.4': L('Linkul trebuie să spună unde duce.', 'The link must say where it goes.'), '1.3.1': L('Leagă <label for> de id-ul câmpului / păstrează ordinea H1→H2→H3.', 'Link <label for> to the field id / keep H1→H2→H3 order.'), '2.4.3': L('Folosește tabindex="0" sau ordinea naturală din DOM.', 'Use tabindex="0" or natural DOM order.'), '2.1.1': L('Folosește <button>, care primește focus și Enter/Space gratuit.', 'Use <button>: focus and Enter/Space for free.'), '1.4.3': L('Închide culoarea textului până la 4.5:1.', 'Darken the text colour to reach 4.5:1.') };
            $('#aRes', body).innerHTML = `<div class="row" style="justify-content:space-between"><h2 style="margin:0">${L('Rezultat', 'Result')}</h2><span class="badge ${score >= 90 ? 'green' : score >= 60 ? 'amber' : 'red'}" style="font-size:1rem">${score}/100</span></div>
              <p class="hint">${errs} ${L('erori', 'errors')} · ${warns} ${L('avertismente', 'warnings')} · ${checked} ${L('elemente de text verificate pentru contrast', 'text elements contrast-checked')}</p>
              ${issues.length ? issues.slice(0, 40).map((x, i) => `<div class="issue ${x.sev === 'err' ? 'err' : ''}"><b>WCAG ${x.rule}</b> · ${esc(x.msg)}<br><span class="hint">↳ ${esc(fixes[x.rule] || '')}</span> <button class="btn sm ghost" data-show="${i}">${L('arată', 'show')}</button></div>`).join('') : `<div class="issue pass">✓ ${L('Nicio problemă detectată automat. Testează și manual: tastatură + cititor de ecran (NVDA / VoiceOver).', 'No automatic issues found. Also test manually: keyboard + screen reader (NVDA / VoiceOver).')}</div>`}
              <p class="hint">${L('Testele automate prind ~30–40% din probleme; restul cer verificare umană.', 'Automated tests catch ~30–40% of issues; the rest need human review.')}</p>`;
            $$('[data-show]', body).forEach(b => b.onclick = () => { const el = issues[+b.dataset.show].el; el.scrollIntoView({ block: 'center', behavior: 'smooth' }); const o = el.style.outline; el.style.outline = '3px solid #f87171'; el.style.outlineOffset = '2px'; setTimeout(() => { el.style.outline = o; }, 2000); });
          });
        } else if (a11yTab === 'contrast') {
          const r = ratio(hex2rgb(cc.fg), hex2rgb(cc.bg));
          const sugg = () => { let c = hex2rgb(cc.fg); const bgL = lum(hex2rgb(cc.bg)); const dir = bgL > 0.5 ? -1 : 1; for (let i = 0; i < 60 && ratio(c, hex2rgb(cc.bg)) < 4.5; i++) c = { r: Math.max(0, Math.min(255, c.r + dir * 5)), g: Math.max(0, Math.min(255, c.g + dir * 5)), b: Math.max(0, Math.min(255, c.b + dir * 5)), a: 1 }; return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join(''); };
          const p = (ok) => `<span class="badge ${ok ? 'green' : 'red'}">${ok ? 'PASS' : 'FAIL'}</span>`;
          body.innerHTML = `<div class="grid g2"><div class="card"><div class="grid g2" style="gap:10px">
            <div class="field"><label for="ccf">${L('Text', 'Text')}</label><input type="color" id="ccf" value="${cc.fg}"><input aria-label="${L('Hex text', 'Text hex')}" id="ccfh" value="${cc.fg}" class="mono" style="margin-top:4px"></div>
            <div class="field"><label for="ccb">${L('Fundal', 'Background')}</label><input type="color" id="ccb" value="${cc.bg}"><input aria-label="${L('Hex fundal', 'Background hex')}" id="ccbh" value="${cc.bg}" class="mono" style="margin-top:4px"></div></div>
            <div class="kpi" style="text-align:center"><div class="v" style="font-size:2.4rem">${r.toFixed(2)}:1</div></div>
            <table style="margin-top:10px"><tbody><tr><td>AA ${L('text normal', 'normal text')} (4.5)</td><td>${p(r >= 4.5)}</td></tr><tr><td>AA ${L('text mare', 'large text')} (3)</td><td>${p(r >= 3)}</td></tr><tr><td>AAA ${L('text normal', 'normal text')} (7)</td><td>${p(r >= 7)}</td></tr><tr><td>${L('Componente UI', 'UI components')} (3)</td><td>${p(r >= 3)}</td></tr></tbody></table>
            ${r < 4.5 ? `<p style="margin-top:10px">${L('Sugestie AA', 'AA suggestion')}: <button class="btn sm" id="ccs" style="background:${sugg()};color:${cc.bg}">${sugg()}</button></p>` : ''}</div>
            <div class="card" style="background:${cc.bg};color:${cc.fg}"><h2 style="color:${cc.fg}">${L('Previzualizare', 'Preview')}</h2><p style="font-size:15px">${L('Text normal la 15px — așa arată un paragraf din interfață.', 'Normal text at 15px — this is how a UI paragraph looks.')}</p><p style="font-size:24px;font-weight:600">${L('Text mare 24px', 'Large text 24px')}</p><button style="background:transparent;border:2px solid ${cc.fg};color:${cc.fg};padding:8px 14px;border-radius:8px">${L('Buton', 'Button')}</button></div></div>`;
          const set = (k, v) => { if (/^#[0-9a-f]{6}$/i.test(v)) { cc[k] = v; draw(); } };
          $('#ccf', body).onchange = e => set('fg', e.target.value); $('#ccb', body).onchange = e => set('bg', e.target.value);
          $('#ccfh', body).onchange = e => set('fg', e.target.value.trim()); $('#ccbh', body).onchange = e => set('bg', e.target.value.trim());
          const s = $('#ccs', body); if (s) s.onclick = () => set('fg', sugg());
        } else {
          const rows = [['Nova SRL', 'Ioana Rusu', 12000, '2026-10-02'], ['Orbit SA', 'Mihai Stan', 8500, '2026-09-14'], ['Pixel SRL', 'Elena Dinu', 3200, '2026-11-01'], ['Zenit SA', 'Radu Marin', 21000, '2026-08-21'], ['Fluxo SRL', 'Alina Toma', 6700, '2026-10-28']];
          const cols = [['c', L('Companie', 'Company'), 0], ['p', 'Contact', 1], ['v', L('Valoare', 'Value'), 2], ['d', L('Ultimul contact', 'Last contact'), 3]];
          const idx = cols.find(c => c[0] === sortK)[2];
          const sorted = rows.slice().sort((a, b) => (typeof a[idx] === 'number' ? a[idx] - b[idx] : String(a[idx]).localeCompare(b[idx], 'ro')) * (sortD === 'ascending' ? 1 : -1));
          body.innerHTML = `<div class="card"><h2 id="tblH">${L('Clienți — tabel sortabil accesibil', 'Clients — accessible sortable table')}</h2>
            <p class="hint">${L('Antetele sunt butoane (Tab + Enter), coloana sortată are aria-sort, iar schimbarea e anunțată prin aria-live. Tabelul are caption pentru cititoarele de ecran.', 'Headers are buttons (Tab + Enter), the sorted column has aria-sort, and changes are announced via aria-live. The table has a caption for screen readers.')}</p>
            <div class="tablewrap"><table aria-labelledby="tblH"><caption class="sr-only">${L('Sortat după', 'Sorted by')} ${cols.find(c => c[0] === sortK)[1]}, ${sortD === 'ascending' ? L('crescător', 'ascending') : L('descrescător', 'descending')}</caption>
            <thead><tr>${cols.map(([k, n]) => `<th scope="col" ${k === sortK ? `aria-sort="${sortD}"` : ''}><button class="btn ghost sm" data-sk="${k}" style="font:inherit;text-transform:inherit;letter-spacing:inherit">${n} ${k === sortK ? (sortD === 'ascending' ? '▲' : '▼') : '⇅'}</button></th>`).join('')}</tr></thead>
            <tbody>${sorted.map(r => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td class="mono">${fmt(r[2])} €</td><td><time datetime="${r[3]}">${new Date(r[3]).toLocaleDateString(App.state.lang === 'ro' ? 'ro-RO' : 'en-US')}</time></td></tr>`).join('')}</tbody></table></div>
            <p class="sr-only" aria-live="polite" id="sortLive"></p></div>`;
          $$('[data-sk]', body).forEach(b => b.onclick = () => { if (sortK === b.dataset.sk) sortD = sortD === 'ascending' ? 'descending' : 'ascending'; else { sortK = b.dataset.sk; sortD = 'ascending'; } draw(); const nb = $(`[data-sk="${sortK}"]`, root); nb.focus(); $('#sortLive', root).textContent = L('Sortat după ', 'Sorted by ') + nb.textContent; });
        }
      };
      draw();
    }
  });

  /* ---------- 15 Canva → Code ---------- */
  const DEMO_W = 960, DEMO_H = 540;
  let cv = store.get('canva', null) || { title: 'Primăvara în livadă', sub: 'Sucuri presate la rece, din fructe culese în Moldova.', cta: 'Descoperă gama', bg: '#0f3d2e', accent: '#ffb547', text: '#f5f1e6' };
  let cvIsDemo = false, fontsHooked = false, cvImg = null, cvMode = 'overlay', cvOpacity = 50, cvSwipe = 50, cvPalette = [], cvPick = null;
  function demoDesign() {
    // stands in for a PNG exported from Canva until the user uploads their own
    const c = document.createElement('canvas'); c.width = DEMO_W; c.height = DEMO_H; const x = c.getContext('2d');
    x.fillStyle = '#0f3d2e'; x.fillRect(0, 0, DEMO_W, DEMO_H);
    x.fillStyle = '#ffb547'; x.beginPath(); x.arc(760, 270, 170, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#e8743b'; x.beginPath(); x.arc(840, 180, 70, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#f5f1e6'; x.font = '600 56px Fraunces, Georgia, serif'; x.fillText('Primăvara', 64, 190); x.fillText('în livadă', 64, 252);
    x.fillStyle = 'rgba(245,241,230,.8)'; x.font = '400 20px Inter, Arial, sans-serif'; x.fillText('Sucuri presate la rece, din fructe', 64, 310); x.fillText('culese în Moldova.', 64, 338);
    x.fillStyle = '#ffb547'; x.beginPath(); x.roundRect ? x.roundRect(64, 380, 210, 52, 26) : x.rect(64, 380, 210, 52); x.fill();
    x.fillStyle = '#2a1800'; x.font = '600 18px Inter, Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Descoperă gama', 64 + 105, 380 + 26);
    return c.toDataURL('image/png');
  }
  function palette(img) {
    const c = document.createElement('canvas'); const s = 80; c.width = s; c.height = Math.round(s * img.naturalHeight / img.naturalWidth) || s;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height); const d = x.getImageData(0, 0, c.width, c.height).data;
    const buckets = new Map();
    for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 128) continue; const k = (d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | (d[i + 2] >> 4); const b = buckets.get(k) || { n: 0, r: 0, g: 0, b: 0 }; b.n++; b.r += d[i]; b.g += d[i + 1]; b.b += d[i + 2]; buckets.set(k, b); }
    const top = [...buckets.values()].sort((a, b) => b.n - a.n); const out = [];
    for (const b of top) { const col = [b.r / b.n, b.g / b.n, b.b / b.n].map(Math.round); if (out.every(o => Math.hypot(o.c[0] - col[0], o.c[1] - col[1], o.c[2] - col[2]) > 48)) out.push({ c: col, n: b.n }); if (out.length >= 6) break; }
    const total = out.reduce((s, o) => s + o.n, 0);
    return out.map(o => ({ hex: '#' + o.c.map(v => v.toString(16).padStart(2, '0')).join(''), pct: Math.round(o.n / total * 100) }));
  }
  register({
    id: 'canva-to-code', n: 15, cat: 'think',
    title: { ro: 'De la Canva la cod', en: 'From Canva to code' },
    desc: { ro: 'Exporți un design din Canva ca PNG, îl suprapui peste implementarea în HTML/CSS și verifici fidelitatea: suprapunere, diferență, swipe, plus extragerea paletei de culori în tokens CSS.', en: 'Export a Canva design as PNG, overlay it on the HTML/CSS build and check fidelity: overlay, difference, swipe, plus palette extraction into CSS tokens.' },
    shows: ['Canvas API', 'mix-blend-mode', 'color quantisation', 'pixel-perfect QA'],
    render(root) {
      if (!cvImg) { cvImg = demoDesign(); cvIsDemo = true; }
      if (cvIsDemo && document.fonts && !fontsHooked) { fontsHooked = true; document.fonts.ready.then(() => { if (cvIsDemo && App.state.current === 'canva-to-code') { cvImg = demoDesign(); cvPalette = []; draw(); } }); }
      // every position below = design pixel / 960 × 100 → cqw, so the build scales exactly like the 960×540 artboard
      const u = px => (px / 9.6).toFixed(3) + 'cqw';
      const hero = () => `<section style="position:absolute;inset:0;background:${esc(cv.bg)};overflow:hidden;container-type:inline-size;font-family:Inter,Arial,sans-serif">
        <div style="position:absolute;left:${u(590)};top:${u(100)};width:${u(340)};height:${u(340)};border-radius:50%;background:${esc(cv.accent)}"></div>
        <div style="position:absolute;left:${u(770)};top:${u(110)};width:${u(140)};height:${u(140)};border-radius:50%;background:#e8743b"></div>
        <h2 style="position:absolute;left:${u(64)};top:${u(137)};width:${u(300)};margin:0;font:600 ${u(56)}/${u(62)} Fraunces,Georgia,serif;color:${esc(cv.text)}">${esc(cv.title)}</h2>
        <p style="position:absolute;left:${u(64)};top:${u(289)};width:${u(330)};margin:0;font-size:${u(20)};line-height:${u(28)};color:${esc(cv.text)};opacity:.8">${esc(cv.sub)}</p>
        <a href="#canva-to-code" style="position:absolute;left:${u(64)};top:${u(380)};width:${u(210)};height:${u(52)};display:flex;align-items:center;justify-content:center;background:${esc(cv.accent)};color:#2a1800;font-weight:600;font-size:${u(18)};border-radius:${u(26)};text-decoration:none">${esc(cv.cta)}</a></section>`;
      const css = () => `:root {\n${cvPalette.map((p, i) => `  --brand-${i + 1}: ${p.hex}; /* ${p.pct}% */`).join('\n')}\n}`;
      const draw = () => {
        root.innerHTML = pageHead(this) + `
        <div class="grid g2" style="margin-bottom:16px">
          <div class="card"><h2>1. ${L('Designul din Canva', 'The Canva design')}</h2>
            <div class="dropzone" id="cvdz">${L('Trage aici PNG-ul exportat din Canva (Partajează → Descarcă → PNG) sau', 'Drop the PNG exported from Canva (Share → Download → PNG) or')} <label class="btn sm" style="display:inline-flex;margin:0;color:var(--text)">${L('alege fișier', 'choose file')}<input type="file" accept="image/*" id="cvfile" class="sr-only"></label>
            <div class="hint">${L('Până încarci al tău, se folosește un design demo de 960×540 (hero pentru LIVADA).', 'Until you upload yours, a 960×540 demo design is used (LIVADA hero).')}</div></div>
            <button class="btn sm" id="cvDemo" style="margin-top:8px">${L('Revino la designul demo', 'Back to demo design')}</button>
            <h3 style="margin-top:14px">${L('Paletă extrasă', 'Extracted palette')} <span class="hint">(${L('click pe imagine = pipetă', 'click the image = eyedropper')})</span></h3>
            <div class="row" id="cvPal">${cvPalette.map(p => `<button class="btn sm" data-hex="${p.hex}" title="${L('Copiază', 'Copy')} ${p.hex}"><span class="status-dot" style="background:${p.hex};width:16px;height:16px;border:1px solid var(--line)"></span><span class="mono">${p.hex}</span> <span class="hint">${p.pct}%</span></button>`).join('')}</div>
            ${cvPick ? `<p>${L('Pipetă', 'Eyedropper')}: <span class="status-dot" style="background:${cvPick};width:16px;height:16px"></span><b class="mono">${cvPick}</b></p>` : ''}
            <pre id="cvCss">${esc(css())}</pre><button class="btn sm" id="cvCssCp">${L('Copiază tokens CSS', 'Copy CSS tokens')}</button></div>
          <div class="card"><h2>2. ${L('Implementarea în cod', 'The code build')}</h2>
            <div class="grid g2" style="gap:10px">${[['title', L('Titlu', 'Title')], ['sub', L('Subtitlu', 'Subtitle')], ['cta', 'CTA']].map(([k, l]) => `<div class="field"><label for="cv-${k}">${l}</label><input id="cv-${k}" data-cv="${k}" value="${esc(cv[k])}"></div>`).join('')}
            ${[['bg', L('Fundal', 'Background')], ['accent', 'Accent'], ['text', 'Text']].map(([k, l]) => `<div class="field"><label for="cv-${k}">${l}</label><input type="color" id="cv-${k}" data-cv="${k}" value="${esc(cv[k])}"></div>`).join('')}</div>
            <p class="hint">${L('Hero-ul e construit cu procente și unități cqw (container queries), deci se scalează exact ca designul, la orice lățime.', 'The hero uses percentages and cqw units (container queries), so it scales exactly like the design at any width.')}</p>
            <details><summary class="btn sm">HTML</summary><pre>${esc(hero().replace(/\s+/g, ' ').replace(/> </g, '>\n<'))}</pre></details></div></div>
        <section class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">3. ${L('Verificare fidelitate', 'Fidelity check')}</h2>
          <div class="row" role="radiogroup" aria-label="${L('Mod de comparare', 'Compare mode')}">${[['side', L('Alăturat', 'Side by side')], ['overlay', L('Suprapunere', 'Overlay')], ['diff', L('Diferență', 'Difference')], ['swipe', 'Swipe']].map(([k, v]) => `<button class="btn sm ${cvMode === k ? 'primary' : ''}" role="radio" aria-checked="${cvMode === k}" data-m="${k}">${v}</button>`).join('')}</div></div>
          ${cvMode === 'overlay' ? `<div class="field" style="max-width:300px;margin-top:10px"><label for="cvo">${L('Opacitate design', 'Design opacity')}: ${cvOpacity}%</label><input type="range" id="cvo" min="0" max="100" value="${cvOpacity}"></div>` : cvMode === 'swipe' ? `<div class="field" style="max-width:300px;margin-top:10px"><label for="cvs">${L('Poziție', 'Position')}: ${cvSwipe}%</label><input type="range" id="cvs" min="0" max="100" value="${cvSwipe}"></div>` : ''}
          <div style="margin-top:12px;${cvMode === 'side' ? 'display:grid;grid-template-columns:1fr 1fr;gap:12px' : ''}">
            ${cvMode === 'side' ? `<div><div class="hint">Canva</div><div class="overlay-wrap" style="aspect-ratio:16/9"><img src="${cvImg}" alt="${L('Design Canva', 'Canva design')}" id="cvImgEl" style="pointer-events:auto;cursor:crosshair"></div></div><div><div class="hint">${L('Cod', 'Code')}</div><div class="overlay-wrap" style="aspect-ratio:16/9">${hero()}</div></div>`
            : `<div class="overlay-wrap" style="aspect-ratio:16/9;isolation:isolate">${hero()}<img src="${cvImg}" alt="${L('Design Canva suprapus', 'Canva design overlaid')}" id="cvImgEl" style="${cvMode === 'overlay' ? `opacity:${cvOpacity / 100}` : cvMode === 'diff' ? 'mix-blend-mode:difference' : `clip-path:inset(0 ${100 - cvSwipe}% 0 0)`}">${cvMode === 'swipe' ? `<div id="cvLine" style="position:absolute;top:0;bottom:0;left:${cvSwipe}%;width:2px;background:#ffb547;pointer-events:none"></div>` : ''}</div>`}
          </div>
          <p class="hint" style="margin-top:8px">${cvMode === 'diff' ? L('În modul Diferență, zonele negre = identice; orice contur luminos arată unde implementarea se abate de design.', 'In Difference mode, black = identical; any bright outline shows where the build deviates from the design.') : L('Exportă din Canva la aceeași proporție ca secțiunea (aici 16:9) pentru o comparație corectă.', 'Export from Canva at the same ratio as the section (16:9 here) for a fair comparison.')}</p>
        </section>`;
        const im = new Image(); im.onload = () => { const np = palette(im); if (JSON.stringify(np) !== JSON.stringify(cvPalette)) { cvPalette = np; draw(); } }; im.src = cvImg;
        const load = f => { if (!f || !f.type.startsWith('image/')) return toast(L('Alege o imagine', 'Pick an image')); const r = new FileReader(); r.onload = () => { cvImg = r.result; cvIsDemo = false; cvPalette = []; cvPick = null; draw(); toast(L('Design încărcat', 'Design loaded')); }; r.readAsDataURL(f); };
        const dz = $('#cvdz', root);
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); }); dz.addEventListener('dragleave', () => dz.classList.remove('over'));
        dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('over'); load(e.dataTransfer.files[0]); });
        $('#cvfile', root).onchange = e => load(e.target.files[0]);
        $('#cvDemo', root).onclick = () => { cvImg = demoDesign(); cvIsDemo = true; cvPalette = []; cvPick = null; draw(); };
        $$('[data-hex]', root).forEach(b => b.onclick = () => copy(b.dataset.hex));
        $('#cvCssCp', root).onclick = () => copy(css());
        $$('[data-cv]', root).forEach(i => i.addEventListener(i.type === 'color' ? 'change' : 'input', () => { cv[i.dataset.cv] = i.value; store.set('canva', cv); const id = i.id, pos = i.selectionStart; draw(); const n = $('#' + id, root); n.focus(); try { n.setSelectionRange(pos, pos); } catch (_) {} }));
        $$('[data-m]', root).forEach(b => b.onclick = () => { cvMode = b.dataset.m; draw(); $(`[data-m="${cvMode}"]`, root).focus(); });
        const o = $('#cvo', root); if (o) o.addEventListener('input', () => { cvOpacity = +o.value; $('#cvImgEl', root).style.opacity = cvOpacity / 100; root.querySelector('label[for=cvo]').textContent = L('Opacitate design', 'Design opacity') + ': ' + cvOpacity + '%'; });
        const sw = $('#cvs', root); if (sw) sw.addEventListener('input', () => { cvSwipe = +sw.value; $('#cvImgEl', root).style.clipPath = `inset(0 ${100 - cvSwipe}% 0 0)`; $('#cvLine', root).style.left = cvSwipe + '%'; root.querySelector('label[for=cvs]').textContent = L('Poziție', 'Position') + ': ' + cvSwipe + '%'; });
        const imgEl = $('#cvImgEl', root);
        if (imgEl && cvMode === 'side') imgEl.addEventListener('click', e => {
          const r = imgEl.getBoundingClientRect(); const c = document.createElement('canvas'); c.width = imgEl.naturalWidth; c.height = imgEl.naturalHeight; const x = c.getContext('2d'); x.drawImage(imgEl, 0, 0);
          const scale = Math.min(r.width / c.width, r.height / c.height); const ox = (r.width - c.width * scale) / 2, oy = (r.height - c.height * scale) / 2;
          const px = Math.floor((e.clientX - r.left - ox) / scale), py = Math.floor((e.clientY - r.top - oy) / scale);
          if (px < 0 || py < 0 || px >= c.width || py >= c.height) return;
          const d = x.getImageData(px, py, 1, 1).data; cvPick = '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join(''); copy(cvPick); draw();
        });
      };
      draw();
    }
  });
})();
