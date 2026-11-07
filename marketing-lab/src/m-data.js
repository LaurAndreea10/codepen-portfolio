/* ===== 06–07 Data analysis ===== */
(() => {
  const { L, T, esc, $, $$, register, store, copy, toast, fmt, pageHead } = App;

  /* ---------- 06 Cohort Retention Heatmap ---------- */
  const seeded = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;
  function sampleCsv() {
    const r = seeded(7); const rows = ['user_id,date'];
    const start = new Date(2026, 0, 1); let id = 1;
    for (let m = 0; m < 10; m++) {
      const users = 120 + Math.floor(r() * 80);
      for (let u = 0; u < users; u++, id++) {
        const signup = new Date(start.getFullYear(), start.getMonth() + m, 1 + Math.floor(r() * 27));
        rows.push(`u${id},${signup.toISOString().slice(0, 10)}`);
        let p = 0.55 + m * 0.015;                        // later cohorts retain a bit better (product improves)
        for (let k = 1; m + k < 10; k++) {
          if (r() < p) { const d = new Date(signup.getFullYear(), signup.getMonth() + k, 1 + Math.floor(r() * 27)); rows.push(`u${id},${d.toISOString().slice(0, 10)}`); }
          p *= 0.86;
        }
      }
    }
    return rows.join('\n');
  }
  function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/); const head = lines.shift().toLowerCase().split(/[;,]/).map(s => s.trim().replace(/"/g, ''));
    const iu = head.findIndex(h => /user|client|customer|id/.test(h)); const id = head.findIndex(h => /^(date|data|activity|event|activity_date|timestamp)/.test(h));
    const is = head.findIndex(h => /signup|registr|first/.test(h));
    if (iu < 0 || id < 0) throw new Error(L('Am nevoie de coloanele user_id și date', 'Need user_id and date columns'));
    return lines.map(l => l.split(/[;,]/).map(s => s.trim().replace(/"/g, ''))).filter(c => c[iu] && c[id]).map(c => ({ u: c[iu], d: new Date(c[id]), s: is >= 0 && c[is] ? new Date(c[is]) : null })).filter(x => !isNaN(x.d));
  }
  function cohorts(rows, gran) {
    const key = d => gran === 'week' ? Math.floor((d - new Date(2020, 0, 6)) / 604800000) : d.getFullYear() * 12 + d.getMonth();
    const label = k => { if (gran === 'week') { const d = new Date(new Date(2020, 0, 6).getTime() + k * 604800000); return d.toISOString().slice(5, 10); } return `${Math.floor(k / 12)}-${String(k % 12 + 1).padStart(2, '0')}`; };
    const first = new Map();
    rows.forEach(r => { const s = r.s || r.d; const k = key(s); if (!first.has(r.u) || first.get(r.u) > k) first.set(r.u, k); });
    const act = new Map();
    rows.forEach(r => { const c = first.get(r.u); const p = key(r.d) - c; if (p < 0) return; if (!act.has(c)) act.set(c, new Map()); const m = act.get(c); if (!m.has(p)) m.set(p, new Set()); m.get(p).add(r.u); });
    const keys = [...act.keys()].sort((a, b) => a - b);
    const maxP = Math.max(...keys.map(k => Math.max(...act.get(k).keys())));
    return keys.map(k => { const m = act.get(k); const size = [...first.values()].filter(v => v === k).length; return { label: label(k), size, vals: Array.from({ length: maxP + 1 }, (_, p) => (m.has(p) ? m.get(p).size : (keys[keys.length - 1] - k >= p ? 0 : null))) }; });
  }
  let cohortCsv = sampleCsv(), cohortGran = 'month', cohortMode = 'pct', cohortErr = '';
  register({
    id: 'cohort', n: 6, cat: 'data',
    title: { ro: 'Cohort Retention Heatmap', en: 'Cohort Retention Heatmap' },
    desc: { ro: 'Încarci un CSV cu activitatea utilizatorilor și primești analiza pe cohorte: heatmap de retenție și curba medie.', en: 'Upload a CSV of user activity and get a cohort analysis: retention heatmap and average curve.' },
    shows: ['CSV parsing', 'Map/Set', 'SVG nativ', 'File API'],
    render(root) {
      const draw = () => {
        let data = []; cohortErr = '';
        try { data = cohorts(parseCsv(cohortCsv), cohortGran); } catch (e) { cohortErr = e.message; }
        const maxP = data.length ? data[0].vals.length : 0;
        const avg = Array.from({ length: maxP }, (_, p) => { const xs = data.filter(c => c.vals[p] != null && c.size); return xs.length ? xs.reduce((s, c) => s + c.vals[p] / c.size, 0) / xs.length : null; });
        const color = (v) => { if (v == null) return 'transparent'; const a = Math.min(1, v * 1.15); return `color-mix(in srgb, var(--cyan) ${Math.round(a * 100)}%, var(--panel2))`; };
        const totalUsers = data.reduce((s, c) => s + c.size, 0);
        const W = 560, H = 180, X = p => 40 + p * (W - 60) / Math.max(1, maxP - 1), Y = v => 160 - v * 140;
        const curve = avg.map((v, p) => v == null ? '' : `${p ? 'L' : 'M'}${X(p)},${Y(v)}`).join(' ');
        root.innerHTML = pageHead(this) + `
        <div class="grid g2">
          <div class="card"><h2>${L('Date', 'Data')}</h2>
            <div class="dropzone" id="cdz">${L('Trage un fișier CSV aici sau', 'Drop a CSV file here or')} <label class="btn sm" style="display:inline-flex;margin:0;color:var(--text)">${L('alege fișier', 'choose file')}<input type="file" accept=".csv,text/csv" id="cfile" class="sr-only"></label>
              <div class="hint">${L('Coloane: user_id, date (opțional signup_date). O linie = o activitate.', 'Columns: user_id, date (optional signup_date). One row = one activity.')}</div></div>
            <div class="row" style="margin-top:12px">
              <div class="field" style="flex:1"><label for="cgran">${L('Granularitate', 'Granularity')}</label><select id="cgran"><option value="month" ${cohortGran === 'month' ? 'selected' : ''}>${L('lunar', 'monthly')}</option><option value="week" ${cohortGran === 'week' ? 'selected' : ''}>${L('săptămânal', 'weekly')}</option></select></div>
              <div class="field" style="flex:1"><label for="cmode">${L('Afișare', 'Display')}</label><select id="cmode"><option value="pct" ${cohortMode === 'pct' ? 'selected' : ''}>%</option><option value="abs" ${cohortMode === 'abs' ? 'selected' : ''}>${L('absolut', 'absolute')}</option></select></div></div>
            <button class="btn sm" id="csample">${L('Reîncarcă datele demo', 'Reload demo data')}</button>
            ${cohortErr ? `<p class="bad" role="alert">${esc(cohortErr)}</p>` : ''}
            <div class="grid g4" style="margin-top:12px"><div class="kpi"><div class="v">${data.length}</div><div class="l">${L('cohorte', 'cohorts')}</div></div><div class="kpi"><div class="v">${fmt(totalUsers)}</div><div class="l">${L('utilizatori', 'users')}</div></div>
            <div class="kpi"><div class="v">${avg[1] != null ? (avg[1] * 100).toFixed(1) + '%' : '—'}</div><div class="l">${L('retenție P1', 'P1 retention')}</div></div><div class="kpi"><div class="v">${avg[3] != null ? (avg[3] * 100).toFixed(1) + '%' : '—'}</div><div class="l">${L('retenție P3', 'P3 retention')}</div></div></div>
          </div>
          <div class="card"><h2>${L('Curba medie de retenție', 'Average retention curve')}</h2>
            <svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${L('Retenția medie pe perioade', 'Average retention by period')}">
              ${[0, .25, .5, .75, 1].map(v => `<line x1="40" x2="${W - 20}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="4" y="${Y(v) + 4}">${v * 100}%</text>`).join('')}
              <path d="${curve}" fill="none" stroke="var(--amber)" stroke-width="3"/>
              ${avg.map((v, p) => v == null ? '' : `<circle cx="${X(p)}" cy="${Y(v)}" r="4" fill="var(--amber)"><title>P${p}: ${(v * 100).toFixed(1)}%</title></circle><text x="${X(p)}" y="176" text-anchor="middle">P${p}</text>`).join('')}
            </svg>
            <p class="hint">${data.length > 2 && data[data.length - 3].vals[1] != null && data[0].vals[1] != null ? (data[data.length - 3].vals[1] / data[data.length - 3].size > data[0].vals[1] / data[0].size ? '↗ ' + L('Cohortele recente rețin mai bine decât primele — produsul se îmbunătățește.', 'Recent cohorts retain better than early ones — the product is improving.') : '↘ ' + L('Cohortele recente rețin mai slab — verifică onboarding-ul.', 'Recent cohorts retain worse — check onboarding.')) : ''}</p>
          </div>
        </div>
        <section class="card" style="margin-top:16px;min-width:0"><h2>Heatmap</h2>
          <div class="tablewrap"><table class="heat"><caption class="sr-only">${L('Retenție pe cohorte', 'Retention by cohort')}</caption><thead><tr><th scope="col">${L('Cohortă', 'Cohort')}</th><th scope="col">${L('Utilizatori', 'Users')}</th>${Array.from({ length: maxP }, (_, p) => `<th scope="col">P${p}</th>`).join('')}</tr></thead>
          <tbody>${data.map(c => `<tr><th scope="row" class="mono">${c.label}</th><td>${c.size}</td>${c.vals.map(v => { const pct = c.size ? v / c.size : 0; return `<td style="background:${v == null ? 'transparent' : color(pct)};color:${pct > .45 ? '#06202a' : 'var(--text)'}">${v == null ? '' : cohortMode === 'pct' ? (pct * 100).toFixed(0) + '%' : v}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>
        </section>`;
        const dz = $('#cdz', root);
        const load = async f => { cohortCsv = await f.text(); draw(); toast(L('Fișier încărcat: ', 'File loaded: ') + f.name); };
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('over'));
        dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('over'); if (e.dataTransfer.files[0]) load(e.dataTransfer.files[0]); });
        $('#cfile', root).addEventListener('change', e => e.target.files[0] && load(e.target.files[0]));
        $('#cgran', root).onchange = e => { cohortGran = e.target.value; draw(); };
        $('#cmode', root).onchange = e => { cohortMode = e.target.value; draw(); };
        $('#csample', root).onclick = () => { cohortCsv = sampleCsv(); draw(); };
      };
      draw();
    }
  });

  /* ---------- 07 Marketing Mix Dashboard ---------- */
  // revenue(spend) = a * (1 - exp(-spend / b))  → diminishing returns
  let mix = store.get('mix', null) || {
    budget: 50000,
    ch: [
      { k: 'google', n: 'Google Ads', a: 160000, b: 22000, s: 15000, c: '#4fd8eb' },
      { k: 'meta', n: 'Meta Ads', a: 110000, b: 16000, s: 12000, c: '#a78bfa' },
      { k: 'linkedin', n: 'LinkedIn Ads', a: 70000, b: 20000, s: 8000, c: '#60a5fa' },
      { k: 'email', n: 'Email', a: 45000, b: 3000, s: 3000, c: '#ffb547' },
      { k: 'seo', n: L('SEO / Conținut', 'SEO / Content'), a: 90000, b: 14000, s: 7000, c: '#4ade80' },
      { k: 'tiktok', n: 'TikTok Ads', a: 60000, b: 12000, s: 5000, c: '#f87171' }
    ]
  };
  const rev = (c, s = c.s) => c.a * (1 - Math.exp(-s / c.b));
  const marg = (c, s = c.s) => (c.a / c.b) * Math.exp(-s / c.b);
  register({
    id: 'marketing-mix', n: 7, cat: 'data',
    title: { ro: 'Marketing Mix Dashboard', en: 'Marketing Mix Dashboard' },
    desc: { ro: 'Compari ROI-ul pe canale cu curbe de randament descrescător și redistribui bugetul cu slidere sau automat.', en: 'Compare ROI across channels with diminishing-return curves and reallocate budget with sliders or automatically.' },
    shows: ['modelare', 'optimizare greedy', 'SVG charts'],
    render(root) {
      const save = () => store.set('mix', mix);
      const optimize = () => {
        const step = mix.budget / 200; mix.ch.forEach(c => c.s = 0);
        for (let i = 0; i < 200; i++) { const best = mix.ch.reduce((a, c) => (marg(c) > marg(a) ? c : a)); best.s += step; }
        mix.ch.forEach(c => c.s = Math.round(c.s / 100) * 100);
        const diff = mix.budget - mix.ch.reduce((t, c) => t + c.s, 0); const big = mix.ch.reduce((a, c) => (c.s > a.s ? c : a)); big.s += diff;
      };
      const draw = (focus) => {
        const spent = mix.ch.reduce((s, c) => s + c.s, 0), total = mix.ch.reduce((s, c) => s + rev(c), 0);
        const roi = spent ? (total - spent) / spent : 0;
        const over = spent > mix.budget;
        const maxS = Math.max(mix.budget, ...mix.ch.map(c => c.s)) * 1.05;
        const W = 560, H = 240, X = s => 50 + s / maxS * (W - 70), maxR = Math.max(...mix.ch.map(c => c.a)), Y = r => 210 - r / maxR * 190;
        const curves = mix.ch.map(c => { let d = ''; for (let i = 0; i <= 40; i++) { const s = maxS * i / 40; d += `${i ? 'L' : 'M'}${X(s).toFixed(1)},${Y(rev(c, s)).toFixed(1)}`; } return `<path d="${d}" fill="none" stroke="${c.c}" stroke-width="2" opacity=".85"/><circle cx="${X(c.s)}" cy="${Y(rev(c))}" r="5" fill="${c.c}"><title>${esc(c.n)}: ${fmt(c.s)} € → ${fmt(rev(c))} €</title></circle>`; }).join('');
        root.innerHTML = pageHead(this) + `
        <div class="grid g4" style="margin-bottom:16px">
          <div class="kpi"><div class="v ${over ? 'bad' : ''}">${fmt(spent)} €</div><div class="l">${L('cheltuit', 'spent')} / ${fmt(mix.budget)} €</div></div>
          <div class="kpi"><div class="v">${fmt(total)} €</div><div class="l">${L('venit estimat', 'est. revenue')}</div></div>
          <div class="kpi"><div class="v ${roi >= 0 ? 'ok' : 'bad'}">${(roi * 100).toFixed(0)}%</div><div class="l">ROI</div></div>
          <div class="kpi"><div class="v">${spent ? (total / spent).toFixed(2) : '—'}×</div><div class="l">ROAS</div></div>
        </div>
        <div class="grid g2">
          <div class="card"><h2>${L('Buget pe canale', 'Budget by channel')}</h2>
            <div class="field"><label for="mbud">${L('Buget total', 'Total budget')}: ${fmt(mix.budget)} €</label><input type="range" id="mbud" min="5000" max="150000" step="1000" value="${mix.budget}"></div>
            ${mix.ch.map((c, i) => { const r = rev(c); return `<div class="field"><label for="ms${i}"><span class="status-dot" style="background:${c.c}"></span>${esc(c.n)}: ${fmt(c.s)} € → ${fmt(r)} € · ROAS ${c.s ? (r / c.s).toFixed(2) : '—'} · ${L('marginal', 'marginal')} ${marg(c).toFixed(2)}</label><input type="range" id="ms${i}" data-i="${i}" min="0" max="${mix.budget}" step="500" value="${c.s}"></div>`; }).join('')}
            ${over ? `<p class="bad" role="alert">${L('Ai depășit bugetul cu ', 'Over budget by ')}${fmt(spent - mix.budget)} €</p>` : ''}
            <div class="row"><button class="btn primary" id="mopt">⚡ ${L('Optimizează automat', 'Auto-optimise')}</button><button class="btn" id="meven">${L('Distribuie egal', 'Split evenly')}</button><button class="btn" id="mcopy">${L('Copiază raport', 'Copy report')}</button></div>
            <p class="hint">${L('Optimizarea alocă bugetul pas cu pas canalului cu cel mai mare venit marginal, până când randamentul marginal se egalizează între canale.', 'The optimiser allocates budget step by step to the channel with the highest marginal revenue, until marginal returns equalise.')}</p>
          </div>
          <div class="card"><h2>${L('Curbe de răspuns', 'Response curves')}</h2>
            <svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${L('Venit în funcție de cheltuială pe canal', 'Revenue vs spend per channel')}">
              ${[0, .25, .5, .75, 1].map(v => `<line x1="50" x2="${W - 20}" y1="${Y(maxR * v)}" y2="${Y(maxR * v)}" stroke="var(--line)"/><text x="2" y="${Y(maxR * v) + 4}">${fmt(maxR * v / 1000)}k</text>`).join('')}
              ${[0, .5, 1].map(v => `<text x="${X(maxS * v)}" y="232" text-anchor="middle">${fmt(maxS * v / 1000)}k €</text>`).join('')}
              ${curves}</svg>
            <div class="row">${mix.ch.map(c => `<span class="hint"><span class="status-dot" style="background:${c.c}"></span>${esc(c.n)}</span>`).join('')}</div>
            <h3 style="margin-top:16px">ROAS</h3>
            ${mix.ch.map(c => { const r = c.s ? rev(c) / c.s : 0; return `<div class="row" style="flex-wrap:nowrap;margin-bottom:4px"><span style="width:110px;font-size:.8rem">${esc(c.n)}</span><div style="flex:1;background:var(--panel2);border-radius:4px;height:14px"><div style="width:${Math.min(100, r / 8 * 100)}%;background:${c.c};height:100%;border-radius:4px"></div></div><span class="mono" style="width:50px;text-align:right">${r.toFixed(2)}×</span></div>`; }).join('')}
          </div>
        </div>
        <p class="hint" style="margin-top:12px">${L('Parametrii curbelor sunt ilustrativi. Într-un proiect real îi estimezi din datele istorice (regresie pe cheltuială și venit, pe fiecare canal).', 'Curve parameters are illustrative. In a real project you estimate them from historical data (regression of spend vs revenue per channel).')}</p>`;
        $('#mbud', root).addEventListener('change', e => { mix.budget = +e.target.value; save(); draw('mbud'); });
        $('#mbud', root).addEventListener('input', e => { const l = root.querySelector('label[for=mbud]'); l.textContent = L('Buget total', 'Total budget') + ': ' + fmt(+e.target.value) + ' €'; });
        $$('[data-i]', root).forEach(s => { s.addEventListener('change', () => { mix.ch[+s.dataset.i].s = +s.value; save(); draw(s.id); }); s.addEventListener('input', () => { const c = mix.ch[+s.dataset.i]; const l = root.querySelector(`label[for=${s.id}]`); l.lastChild.textContent = `${c.n}: ${fmt(+s.value)} € → ${fmt(rev(c, +s.value))} €`; }); });
        $('#mopt', root).onclick = () => { optimize(); save(); draw(); toast(L('Buget optimizat', 'Budget optimised')); };
        $('#meven', root).onclick = () => { mix.ch.forEach(c => c.s = Math.floor(mix.budget / mix.ch.length / 100) * 100); mix.ch[0].s += mix.budget - mix.ch.reduce((t, c) => t + c.s, 0); save(); draw(); };
        $('#mcopy', root).onclick = () => copy(mix.ch.map(c => `${c.n}: ${fmt(c.s)} € → ${fmt(rev(c))} € (ROAS ${c.s ? (rev(c) / c.s).toFixed(2) : '—'})`).join('\n') + `\nTOTAL: ${fmt(spent)} € → ${fmt(total)} € · ROI ${(roi * 100).toFixed(0)}%`);
        if (focus) $('#' + focus, root)?.focus();
      };
      draw();
    }
  });
})();
