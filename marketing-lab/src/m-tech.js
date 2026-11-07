/* ===== 08–12 Tech skills ===== */
(() => {
  const { L, T, esc, $, $$, register, store, copy, download, toast, fmt, uid, pageHead } = App;

  /* ---------- 08 Design System / Component Library ---------- */
  const STORIES = {
    button: {
      name: { ro: 'Buton', en: 'Button' },
      controls: { variant: ['primary', 'default', 'amber', 'ghost', 'danger'], size: ['md', 'sm'], label: 'text', disabled: 'bool' },
      args: { variant: 'primary', size: 'md', label: 'Salvează', disabled: false },
      html: a => `<button class="btn ${a.variant === 'default' ? '' : a.variant} ${a.size === 'sm' ? 'sm' : ''}"${a.disabled ? ' disabled' : ''}>${esc(a.label)}</button>`,
      docs: { ro: 'Un singur buton primary pe ecran. Înălțime minimă 36px (țintă de atingere). Starea disabled păstrează contrastul textului lizibil.', en: 'One primary button per screen. Minimum height 36px (touch target). Disabled keeps text legible.' }
    },
    input: {
      name: { ro: 'Câmp text', en: 'Text input' },
      controls: { label: 'text', placeholder: 'text', hint: 'text', error: 'text' },
      args: { label: 'Email', placeholder: 'nume@firma.ro', hint: 'Nu trimitem spam.', error: '' },
      html: a => `<div class="field" style="width:280px"><label for="ds-in">${esc(a.label)}</label><input id="ds-in" placeholder="${esc(a.placeholder)}"${a.error ? ` aria-invalid="true" aria-describedby="ds-err" style="border-color:var(--red)"` : a.hint ? ' aria-describedby="ds-hint"' : ''}>${a.error ? `<div class="hint bad" id="ds-err">${esc(a.error)}</div>` : a.hint ? `<div class="hint" id="ds-hint">${esc(a.hint)}</div>` : ''}</div>`,
      docs: { ro: 'Eticheta e mereu vizibilă (nu doar placeholder). Erorile sunt legate prin aria-describedby și marcate cu aria-invalid.', en: 'Label always visible (never placeholder-only). Errors linked with aria-describedby and aria-invalid.' }
    },
    badge: {
      name: { ro: 'Badge', en: 'Badge' },
      controls: { tone: ['cyan', 'amber', 'green', 'red', 'neutral'], label: 'text' },
      args: { tone: 'green', label: 'Câștigat' },
      html: a => `<span class="badge ${a.tone === 'neutral' ? '' : a.tone}">${esc(a.label)}</span>`,
      docs: { ro: 'Pentru statusuri în tabele CRM. Culoarea nu e singurul indiciu: textul spune statusul.', en: 'For CRM table statuses. Colour is never the only cue: the text names the status.' }
    },
    toggle: {
      name: { ro: 'Comutator', en: 'Toggle' },
      controls: { checked: 'bool', label: 'text' },
      args: { checked: true, label: 'Notificări email' },
      html: a => `<div class="row"><button class="toggle" role="switch" aria-checked="${a.checked}" aria-label="${esc(a.label)}" onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked')!=='true')"></button><span>${esc(a.label)}</span></div>`,
      docs: { ro: 'role="switch" + aria-checked. Se comută cu Space/Enter, ca un buton nativ.', en: 'role="switch" + aria-checked. Toggles with Space/Enter like a native button.' }
    },
    kpi: {
      name: { ro: 'Card KPI', en: 'KPI card' },
      controls: { label: 'text', value: 'text', delta: 'text', positive: 'bool' },
      args: { label: 'MRR', value: '48.200 €', delta: '+12,4%', positive: true },
      html: a => `<div class="kpi" style="min-width:200px"><div class="l">${esc(a.label)}</div><div class="v">${esc(a.value)}</div><div class="${a.positive ? 'ok' : 'bad'}" style="font-size:.85rem">${a.positive ? '▲' : '▼'} ${esc(a.delta)}</div></div>`,
      docs: { ro: 'Săgeata dublează culoarea pentru utilizatorii daltoniști.', en: 'The arrow doubles the colour for colour-blind users.' }
    },
    table: {
      name: { ro: 'Tabel CRM', en: 'CRM table' },
      controls: { rows: ['3', '5'], striped: 'bool' },
      args: { rows: '3', striped: true },
      html: a => { const d = [['Nova SRL', 'Ioana Rusu', '12.000 €', 'green', 'Câștigat'], ['Orbit SA', 'Mihai Stan', '8.500 €', 'amber', 'Negociere'], ['Pixel SRL', 'Elena Dinu', '3.200 €', 'cyan', 'Lead'], ['Zenit SA', 'Radu Marin', '21.000 €', 'red', 'Pierdut'], ['Fluxo SRL', 'Alina Toma', '6.700 €', 'cyan', 'Propunere']].slice(0, +a.rows); return `<div class="tablewrap" style="width:100%;background:var(--panel)"><table><thead><tr><th>${L('Companie', 'Company')}</th><th>Contact</th><th>${L('Valoare', 'Value')}</th><th>Status</th></tr></thead><tbody>${d.map((r, i) => `<tr style="${a.striped && i % 2 ? 'background:var(--panel2)' : ''}"><td>${r[0]}</td><td>${r[1]}</td><td class="mono">${r[2]}</td><td><span class="badge ${r[3]}">${r[4]}</span></td></tr>`).join('')}</tbody></table></div>`; },
      docs: { ro: 'Header-ele folosesc <th>. Valorile numerice în font mono, aliniate pentru scanare rapidă.', en: 'Headers use <th>. Numeric values in mono for fast scanning.' }
    }
  };
  let dsStory = 'button', dsTab = 'stories';
  register({
    id: 'design-system', n: 8, cat: 'tech',
    title: { ro: 'Design System & Component Library', en: 'Design System & Component Library' },
    desc: { ro: 'Tokens (culori, tipografie, spațiere), componente CRM cu previzualizare live, controale în stil Storybook, cod gata de copiat și temă dark/light.', en: 'Tokens (colour, type, spacing), CRM components with live preview, Storybook-style controls, copyable code and dark/light theme.' },
    shows: ['design tokens', 'CSS custom properties', 'Storybook pattern', 'a11y docs'],
    render(root) {
      const draw = () => {
        const cs = getComputedStyle(document.documentElement);
        const tok = ['--bg', '--panel', '--panel2', '--line', '--text', '--muted', '--cyan', '--amber', '--green', '--red', '--violet'];
        const st = STORIES[dsStory];
        root.innerHTML = pageHead(this) + `
        <div class="row" style="margin-bottom:12px"><span class="hint">${L('Temă', 'Theme')}:</span><button class="btn sm" id="dsTheme">${App.state.theme === 'dark' ? '☀ Light' : '☾ Dark'}</button></div>
        <div class="tabs" role="tablist">${[['stories', L('Componente', 'Components')], ['tokens', 'Tokens'], ['type', L('Tipografie & spațiere', 'Type & spacing')]].map(([k, v]) => `<button role="tab" aria-selected="${dsTab === k}" data-dt="${k}">${v}</button>`).join('')}</div>
        ${dsTab === 'tokens' ? `<div class="grid g4">${tok.map(t => { const v = cs.getPropertyValue(t).trim(); return `<div><div class="swatch" style="background:var(${t})"></div><div class="mono" style="margin-top:6px">${t}</div><div class="hint mono">${v}</div><button class="btn sm" data-cp="var(${t})">${L('Copiază', 'Copy')}</button></div>`; }).join('')}</div>
          <h3 style="margin-top:20px">${L('Export tokens (JSON, format W3C Design Tokens)', 'Export tokens (JSON, W3C Design Tokens format)')}</h3><pre id="tokJson">${esc(JSON.stringify(Object.fromEntries(tok.map(t => [t.slice(2), { $type: 'color', $value: cs.getPropertyValue(t).trim() }])), null, 2))}</pre><button class="btn" id="cpTok">${L('Copiază JSON', 'Copy JSON')}</button>`
        : dsTab === 'type' ? `<div class="card stack">
            <div style="font:600 2.5rem var(--f-display)">Fraunces — Display</div><div class="hint mono">--f-display · h1 clamp(1.7rem, 3.5vw, 2.5rem)</div>
            <div style="font:400 1rem var(--f-body)">Inter — ${L('text de corp, interfețe, formulare', 'body text, UI, forms')} · 15px / 1.55</div>
            <div style="font:400 .9rem var(--f-mono)">JetBrains Mono — ${L('cifre, cod, etichete', 'numbers, code, labels')} 0123456789</div>
            <h3>${L('Scală de spațiere', 'Spacing scale')}</h3>${[1, 2, 3, 4, 5, 6, 7].map(i => `<div class="row"><span class="mono" style="width:60px">--s${i}</span><div style="height:12px;width:var(--s${i});background:var(--cyan);border-radius:3px"></div><span class="hint mono">${cs.getPropertyValue('--s' + i).trim()}</span></div>`).join('')}
          </div>`
        : `<div class="grid" style="grid-template-columns:minmax(150px,200px) 1fr">
            <nav class="card story-nav" aria-label="${L('Componente', 'Components')}">${Object.entries(STORIES).map(([k, s]) => `<button data-st="${k}" aria-current="${k === dsStory}">${esc(T(s.name))}</button>`).join('')}</nav>
            <div class="stack" style="min-width:0">
              <div class="canvas-area" id="dsCanvas">${st.html(st.args)}</div>
              <div class="grid g2">
                <div class="card"><h3>Controls</h3>${Object.entries(st.controls).map(([k, c]) => `<div class="field"><label for="dc-${k}">${k}</label>${Array.isArray(c) ? `<select id="dc-${k}" data-c="${k}">${c.map(o => `<option ${st.args[k] === o ? 'selected' : ''}>${o}</option>`).join('')}</select>` : c === 'bool' ? `<input type="checkbox" id="dc-${k}" data-c="${k}" ${st.args[k] ? 'checked' : ''}>` : `<input id="dc-${k}" data-c="${k}" value="${esc(st.args[k])}">`}</div>`).join('')}</div>
                <div class="card"><h3>Docs</h3><p>${esc(T(st.docs))}</p><h3>HTML</h3><pre id="dsCode">${esc(st.html(st.args))}</pre><button class="btn sm" id="dsCopy">${L('Copiază codul', 'Copy code')}</button></div>
              </div>
            </div></div>`}`;
        $('#dsTheme', root).onclick = () => { App.setTheme(App.state.theme === 'dark' ? 'light' : 'dark'); draw(); };
        $$('[data-dt]', root).forEach(b => b.onclick = () => { dsTab = b.dataset.dt; draw(); });
        $$('[data-st]', root).forEach(b => b.onclick = () => { dsStory = b.dataset.st; draw(); $(`[data-st="${dsStory}"]`, root).focus(); });
        $$('[data-cp]', root).forEach(b => b.onclick = () => copy(b.dataset.cp));
        const ct = $('#cpTok', root); if (ct) ct.onclick = () => copy($('#tokJson', root).textContent);
        $$('[data-c]', root).forEach(i => i.addEventListener(i.type === 'checkbox' || i.tagName === 'SELECT' ? 'change' : 'input', () => {
          st.args[i.dataset.c] = i.type === 'checkbox' ? i.checked : i.value;
          $('#dsCanvas', root).innerHTML = st.html(st.args); $('#dsCode', root).textContent = st.html(st.args);
        }));
        const dc = $('#dsCopy', root); if (dc) dc.onclick = () => copy(st.html(st.args));
      };
      draw();
    }
  });

  /* ---------- 09 TypeScript mini-CRM (logic compiled from ts-crm/src/crm.ts) ---------- */
  const STAGE_L = { lead: 'Lead', calificat: L('Calificat', 'Qualified'), propunere: L('Propunere', 'Proposal'), negociere: L('Negociere', 'Negotiation'), castigat: L('Câștigat', 'Won'), pierdut: L('Pierdut', 'Lost') };
  let crm = store.get('tscrm', null);
  if (!crm) {
    crm = [];
    [['Ioana Rusu', 'ioana@nova.ro', 'Nova SRL', 12000, 'negociere', ['saas', 'vip']], ['Mihai Stan', 'mihai@orbit.ro', 'Orbit SA', 8500, 'propunere', ['retail']], ['Elena Dinu', 'elena@pixel.ro', 'Pixel SRL', 3200, 'lead', []], ['Radu Marin', 'radu@zenit.ro', 'Zenit SA', 21000, 'castigat', ['enterprise']], ['Alina Toma', 'alina@fluxo.ro', 'Fluxo SRL', 6700, 'calificat', ['saas']], ['Vlad Ene', 'vlad@ardeal.ro', 'Ardeal Soft', 4100, 'pierdut', []]]
      .forEach(([name, email, company, value, stage, tags]) => { const r = TSCRM.createContact({ name, email, company, value, stage, tags }, crm); if (r.ok) crm.push(r.value); });
  }
  let crmQ = '', crmErr = [], crmTab = 'app', crmSort = 'updatedAt';
  register({
    id: 'typescript-crm', n: 9, cat: 'tech',
    title: { ro: 'Mini-CRM în TypeScript', en: 'TypeScript mini-CRM' },
    desc: { ro: 'Logica e scrisă în TypeScript strict (tipuri, Result, tranziții de pipeline), compilată cu tsc și acoperită de 13 teste Vitest.', en: 'Logic written in strict TypeScript (types, Result, pipeline transitions), compiled with tsc and covered by 13 Vitest tests.' },
    shows: ['TypeScript strict', 'Vitest', 'pure functions', 'discriminated unions'],
    render(root) {
      const save = () => store.set('tscrm', crm);
      const draw = () => {
        const STL = { lead: 'Lead', calificat: L('Calificat', 'Qualified'), propunere: L('Propunere', 'Proposal'), negociere: L('Negociere', 'Negotiation'), castigat: L('Câștigat', 'Won'), pierdut: L('Pierdut', 'Lost') };
        const sum = TSCRM.summarize(crm);
        const list = TSCRM.sortBy(TSCRM.search(crm, crmQ), crmSort, crmSort === 'name' ? 'asc' : 'desc');
        const errFor = f => crmErr.filter(e => e.field === f).map(e => `<div class="hint bad" id="err-${f}">${esc(e.message)}</div>`).join('');
        root.innerHTML = pageHead(this) + `
        <div class="tabs" role="tablist">${[['app', 'App'], ['ts', 'crm.ts'], ['tests', 'crm.test.ts']].map(([k, v]) => `<button role="tab" aria-selected="${crmTab === k}" data-ct="${k}">${v}</button>`).join('')}</div>
        ${crmTab === 'ts' ? `<p class="hint">${L('Sursa TypeScript din care a fost compilată logica acestei pagini:', 'TypeScript source this page’s logic was compiled from:')}</p><pre style="max-height:600px">${esc(TS_SOURCE)}</pre>`
        : crmTab === 'tests' ? `<p class="hint">${L('Rulează local: npm install && npm test → 13/13 teste trecute.', 'Run locally: npm install && npm test → 13/13 tests passing.')}</p><pre style="max-height:600px">${esc(TS_TESTS)}</pre>`
        : `<div class="grid g4" style="margin-bottom:16px">
            <div class="kpi"><div class="v">${fmt(sum.openValue)} €</div><div class="l">pipeline ${L('deschis', 'open')}</div></div>
            <div class="kpi"><div class="v">${fmt(sum.weightedForecast)} €</div><div class="l">${L('prognoză ponderată', 'weighted forecast')}</div></div>
            <div class="kpi"><div class="v">${(sum.winRate * 100).toFixed(0)}%</div><div class="l">win rate</div></div>
            <div class="kpi"><div class="v">${crm.length}</div><div class="l">${L('contacte', 'contacts')}</div></div></div>
          <div class="grid g2">
            <form class="card" id="crmF" novalidate><h2>${L('Contact nou', 'New contact')}</h2>
              ${[['name', L('Nume', 'Name')], ['email', 'Email'], ['company', L('Companie', 'Company')], ['value', L('Valoare (€)', 'Value (€)')], ['tags', L('Etichete (virgulă)', 'Tags (comma)')]].map(([k, l]) => `<div class="field"><label for="cf-${k}">${l}</label><input id="cf-${k}" name="${k}" ${k === 'value' ? 'type="number" min="0"' : k === 'email' ? 'type="email"' : ''} ${crmErr.some(e => e.field === k) ? `aria-invalid="true" aria-describedby="err-${k}"` : ''}>${errFor(k)}</div>`).join('')}
              <button class="btn primary">${L('Adaugă', 'Add')}</button>
              <p class="hint">${L('Validarea vine din validateContact() — încearcă un email duplicat.', 'Validation comes from validateContact() — try a duplicate email.')}</p></form>
            <div class="card" style="min-width:0"><div class="row" style="justify-content:space-between"><h2 style="margin:0">${L('Contacte', 'Contacts')}</h2>
              <div class="row"><input type="search" id="crmQ" aria-label="${L('Caută', 'Search')}" placeholder="${L('caută…', 'search…')}" value="${esc(crmQ)}" style="width:160px">
              <select id="crmS" aria-label="${L('Sortează', 'Sort')}"><option value="updatedAt" ${crmSort === 'updatedAt' ? 'selected' : ''}>${L('recente', 'recent')}</option><option value="value" ${crmSort === 'value' ? 'selected' : ''}>${L('valoare', 'value')}</option><option value="name" ${crmSort === 'name' ? 'selected' : ''}>${L('nume', 'name')}</option></select></div></div>
              <div class="tablewrap" style="margin-top:10px"><table><thead><tr><th>Contact</th><th>${L('Valoare', 'Value')}</th><th>${L('Etapă', 'Stage')}</th><th>${L('Mută în', 'Move to')}</th></tr></thead><tbody>
              ${list.map(c => `<tr><td><b>${esc(c.name)}</b><br><span class="hint">${esc(c.company)} · ${esc(c.email)}</span>${c.tags.length ? '<br>' + c.tags.map(t => `<span class="badge">${esc(t)}</span>`).join(' ') : ''}</td><td class="mono">${fmt(c.value)} €</td><td><span class="badge ${c.stage === 'castigat' ? 'green' : c.stage === 'pierdut' ? 'red' : 'cyan'}">${STL[c.stage]}</span></td>
                <td><div class="row">${TSCRM.nextStages(c.stage).map(s => `<button class="btn sm" data-mv="${c.id}:${s}">${STL[s]}</button>`).join('')}<button class="btn sm danger" data-del="${c.id}" aria-label="${L('Șterge', 'Delete')} ${esc(c.name)}">✕</button></div></td></tr>`).join('') || `<tr><td colspan="4" class="hint">${L('Niciun rezultat', 'No results')}</td></tr>`}</tbody></table></div></div>
          </div>
          <section class="card" style="margin-top:16px"><h2>Pipeline</h2><div class="grid" style="grid-template-columns:repeat(6,minmax(110px,1fr));overflow-x:auto">
            ${TSCRM.STAGES.map(s => `<div class="kpi"><div class="l">${STL[s]}</div><div class="v">${sum.byStage[s].count}</div><div class="hint mono">${fmt(sum.byStage[s].value)} € · p=${TSCRM.WIN_PROBABILITY[s]}</div></div>`).join('')}</div></section>`}`;
        $$('[data-ct]', root).forEach(b => b.onclick = () => { crmTab = b.dataset.ct; draw(); });
        const f = $('#crmF', root);
        if (!f) return;
        f.addEventListener('submit', e => {
          e.preventDefault(); const d = Object.fromEntries(new FormData(f));
          const r = TSCRM.createContact({ name: d.name, email: d.email, company: d.company, value: d.value === '' ? undefined : Number(d.value), tags: String(d.tags || '').split(',') }, crm);
          if (r.ok) { crm.unshift(r.value); crmErr = []; save(); draw(); toast(L('Contact adăugat', 'Contact added')); }
          else { crmErr = r.errors; const vals = d; draw(); Object.entries(vals).forEach(([k, v]) => { const i = $('#cf-' + k, root); if (i) i.value = v; }); const first = $('[aria-invalid="true"]', root); if (first) first.focus(); }
        });
        $('#crmQ', root).addEventListener('input', e => { crmQ = e.target.value; draw(); const n = $('#crmQ', root); n.focus(); n.setSelectionRange(crmQ.length, crmQ.length); });
        $('#crmS', root).onchange = e => { crmSort = e.target.value; draw(); };
        $$('[data-mv]', root).forEach(b => b.onclick = () => { const [id, s] = b.dataset.mv.split(':'); const i = crm.findIndex(c => c.id === id); const r = TSCRM.moveStage(crm[i], s); if (r.ok) { crm[i] = r.value; save(); draw(); } else toast(r.errors); });
        $$('[data-del]', root).forEach(b => b.onclick = () => { crm = crm.filter(c => c.id !== b.dataset.del); save(); draw(); });
      };
      draw();
    }
  });

  /* ---------- 10 Web Components ---------- */
  if (!customElements.get('kpi-card')) {
    class KpiCard extends HTMLElement {
      static get observedAttributes() { return ['label', 'value', 'delta', 'trend', 'tone']; }
      constructor() { super(); this.attachShadow({ mode: 'open' }); }
      connectedCallback() { this.render(); }
      attributeChangedCallback() { this.render(); }
      render() {
        const pts = (this.getAttribute('trend') || '').split(',').map(Number).filter(n => !isNaN(n));
        const max = Math.max(...pts, 1), min = Math.min(...pts, 0), W = 120, H = 36;
        const d = pts.map((v, i) => `${i ? 'L' : 'M'}${(i / Math.max(1, pts.length - 1) * W).toFixed(1)},${(H - (v - min) / (max - min || 1) * H).toFixed(1)}`).join('');
        const delta = this.getAttribute('delta') || ''; const up = !delta.trim().startsWith('-');
        const tone = this.getAttribute('tone') || '#4fd8eb';
        this.shadowRoot.innerHTML = `<style>
          :host{display:inline-block;font-family:Inter,system-ui,sans-serif;color:var(--text,#e7eef9)}
          .c{background:var(--panel2,#182c4c);border:1px solid var(--line,#24406a);border-radius:12px;padding:14px 16px;min-width:180px}
          .l{font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted,#9db0cc)}
          .v{font:600 1.5rem Fraunces,Georgia,serif;margin:2px 0}
          .d{font-size:.82rem;color:${up ? 'var(--green,#4ade80)' : 'var(--red,#f87171)'}}
          svg{display:block;margin-top:6px}</style>
          <div class="c" part="card" role="group" aria-label="${(this.getAttribute('label') || '').replace(/"/g, '')}">
          <div class="l"><slot name="label">${this.getAttribute('label') || ''}</slot></div><div class="v">${this.getAttribute('value') || '—'}</div>
          <div class="d">${up ? '▲' : '▼'} ${delta}</div>
          ${pts.length > 1 ? `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${d}" fill="none" stroke="${tone}" stroke-width="2"/></svg>` : ''}</div>`;
      }
    }
    customElements.define('kpi-card', KpiCard);

    class MonthPicker extends HTMLElement {
      constructor() { super(); this.attachShadow({ mode: 'open' }); const n = new Date(); this.y = n.getFullYear(); this.m = n.getMonth(); this.start = null; this.end = null; }
      connectedCallback() { this.render(); }
      pick(d) {
        if (!this.start || this.end) { this.start = d; this.end = null; } else if (d < this.start) { this.end = this.start; this.start = d; } else this.end = d;
        this.render();
        this.dispatchEvent(new CustomEvent('range-change', { detail: { start: this.start, end: this.end }, bubbles: true, composed: true }));
      }
      render() {
        const lang = this.getAttribute('lang') || 'ro';
        const first = new Date(this.y, this.m, 1), days = new Date(this.y, this.m + 1, 0).getDate(), off = (first.getDay() + 6) % 7;
        const wd = lang === 'ro' ? ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'] : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        const iso = d => `${this.y}-${String(this.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const inR = s => this.start && (s === this.start || s === this.end || (this.end && s > this.start && s < this.end));
        this.shadowRoot.innerHTML = `<style>:host{display:inline-block;font-family:Inter,system-ui,sans-serif;color:var(--text,#e7eef9)}
          .w{background:var(--panel2,#182c4c);border:1px solid var(--line,#24406a);border-radius:12px;padding:12px;width:260px}
          .h{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-weight:600}
          .g{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;font-size:.8rem}
          .wd{color:var(--muted,#9db0cc);font-size:.7rem;padding:4px 0}
          button{font:inherit;color:inherit;background:none;border:0;border-radius:6px;padding:6px 0;cursor:pointer}
          button:hover{background:var(--line,#24406a)} button:focus-visible{outline:2px solid var(--amber,#ffb547)}
          .in{background:color-mix(in srgb,var(--cyan,#4fd8eb) 30%,transparent)} .edge{background:var(--cyan,#4fd8eb);color:#06202a;font-weight:700}</style>
          <div class="w"><div class="h"><button data-nav="-1" aria-label="${lang === 'ro' ? 'Luna anterioară' : 'Previous month'}">‹</button><span aria-live="polite">${first.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', { month: 'long', year: 'numeric' })}</span><button data-nav="1" aria-label="${lang === 'ro' ? 'Luna următoare' : 'Next month'}">›</button></div>
          <div class="g" role="grid">${wd.map(d => `<div class="wd" role="columnheader">${d}</div>`).join('')}${'<div></div>'.repeat(off)}${Array.from({ length: days }, (_, i) => { const s = iso(i + 1); return `<button data-d="${s}" class="${s === this.start || s === this.end ? 'edge' : inR(s) ? 'in' : ''}" aria-pressed="${!!inR(s)}" aria-label="${s}">${i + 1}</button>`; }).join('')}</div></div>`;
        this.shadowRoot.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => { this.m += +b.dataset.nav; if (this.m < 0) { this.m = 11; this.y--; } if (this.m > 11) { this.m = 0; this.y++; } this.render(); });
        this.shadowRoot.querySelectorAll('[data-d]').forEach(b => b.onclick = () => this.pick(b.dataset.d));
      }
    }
    customElements.define('month-range-picker', MonthPicker);
  }
  let wc = { label: 'Lead-uri noi', value: '1.284', delta: '+8,2%', trend: '12,18,15,22,28,26,34', tone: '#4fd8eb' };
  let wcLog = [];
  register({
    id: 'web-components', n: 10, cat: 'tech',
    title: { ro: 'Web Components', en: 'Web Components' },
    desc: { ro: 'Două custom elements cu Shadow DOM: <kpi-card> cu sparkline și <month-range-picker> care emite evenimente. Merg în React, Vue sau HTML simplu.', en: 'Two Shadow DOM custom elements: <kpi-card> with sparkline and <month-range-picker> emitting events. Work in React, Vue or plain HTML.' },
    shows: ['Custom Elements', 'Shadow DOM', 'CustomEvent', 'framework-agnostic'],
    render(root) {
      const usage = () => `<kpi-card label="${wc.label}" value="${wc.value}" delta="${wc.delta}" trend="${wc.trend}" tone="${wc.tone}"></kpi-card>\n\n<month-range-picker lang="${App.state.lang}"></month-range-picker>\n<script>\n  document.querySelector('month-range-picker')\n    .addEventListener('range-change', e => console.log(e.detail));\n<\/script>`;
      root.innerHTML = pageHead(this) + `
        <div class="grid g2">
          <div class="card"><h2>&lt;kpi-card&gt;</h2><div class="canvas-area" id="wcArea"></div>
            ${Object.keys(wc).map(k => `<div class="field"><label for="wc-${k}">${k}</label><input id="wc-${k}" data-w="${k}" ${k === 'tone' ? 'type="color"' : ''} value="${esc(wc[k])}"></div>`).join('')}
            <p class="hint">${L('Fiecare câmp schimbă un atribut; attributeChangedCallback re-randează componenta.', 'Each field changes an attribute; attributeChangedCallback re-renders the component.')}</p></div>
          <div class="card"><h2>&lt;month-range-picker&gt;</h2><div class="canvas-area"><month-range-picker lang="${App.state.lang}" id="mrp"></month-range-picker></div>
            <h3 style="margin-top:12px">${L('Evenimente primite', 'Events received')}</h3><pre id="wcLog" aria-live="polite" style="min-height:80px">${esc(wcLog.join('\n') || L('Alege două zile…', 'Pick two days…'))}</pre></div>
        </div>
        <section class="card" style="margin-top:16px"><h2>${L('Utilizare', 'Usage')}</h2><pre id="wcUse">${esc(usage())}</pre><button class="btn" id="wcCopy">${L('Copiază', 'Copy')}</button></section>`;
      const area = $('#wcArea', root); const card = document.createElement('kpi-card'); Object.entries(wc).forEach(([k, v]) => card.setAttribute(k, v)); area.appendChild(card);
      const card2 = document.createElement('kpi-card'); Object.entries({ label: 'Churn', value: '2,1%', delta: '-0,4pp', trend: '3.1,2.9,2.7,2.6,2.4,2.1', tone: '#ffb547' }).forEach(([k, v]) => card2.setAttribute(k, v)); area.appendChild(card2);
      $$('[data-w]', root).forEach(i => i.addEventListener('input', () => { wc[i.dataset.w] = i.value; card.setAttribute(i.dataset.w, i.value); $('#wcUse', root).textContent = usage(); }));
      const onRange = e => { wcLog.unshift(`range-change → ${JSON.stringify(e.detail)}`); wcLog = wcLog.slice(0, 6); $('#wcLog', root).textContent = wcLog.join('\n'); };
      $('#mrp', root).addEventListener('range-change', onRange);
      $('#wcCopy', root).onclick = () => copy(usage());
    }
  });

  /* ---------- 11 PWA offline-first (IndexedDB + BroadcastChannel) ---------- */
  const DB = {
    db: null, mem: [], ok: true,
    open() { return new Promise(res => { try { const r = indexedDB.open('mlab-notes', 1); r.onupgradeneeded = () => r.result.createObjectStore('notes', { keyPath: 'id' }); r.onsuccess = () => { this.db = r.result; res(true); }; r.onerror = () => { this.ok = false; res(false); }; } catch (e) { this.ok = false; res(false); } }); },
    tx(mode) { return this.db.transaction('notes', mode).objectStore('notes'); },
    all() { if (!this.db) return Promise.resolve(this.mem.slice()); return new Promise(res => { const r = this.tx('readonly').getAll(); r.onsuccess = () => res(r.result); r.onerror = () => res([]); }); },
    put(n) { if (!this.db) { this.mem = this.mem.filter(x => x.id !== n.id).concat(n); return Promise.resolve(); } return new Promise(res => { const r = this.tx('readwrite').put(n); r.onsuccess = r.onerror = () => res(); }); },
    del(id) { if (!this.db) { this.mem = this.mem.filter(x => x.id !== id); return Promise.resolve(); } return new Promise(res => { const r = this.tx('readwrite').delete(id); r.onsuccess = r.onerror = () => res(); }); }
  };
  let bc = null; try { bc = new BroadcastChannel('mlab-notes'); } catch (e) {}
  const tabId = uid();
  let swStatus = null, forcedOffline = false;
  register({
    id: 'pwa-offline', n: 11, cat: 'tech',
    title: { ro: 'PWA offline-first', en: 'Offline-first PWA' },
    desc: { ro: 'Notițe CRM salvate în IndexedDB, care funcționează fără internet, cu coadă de sincronizare și actualizare live între taburi prin BroadcastChannel.', en: 'CRM notes stored in IndexedDB, working offline, with a sync queue and live cross-tab updates via BroadcastChannel.' },
    shows: ['IndexedDB', 'BroadcastChannel', 'Service Worker', 'online/offline events'],
    render(root) {
      let notes = [], events = [];
      const online = () => navigator.onLine && !forcedOffline;
      const log = m => { events.unshift(`${new Date().toLocaleTimeString()} · ${m}`); events = events.slice(0, 8); const el = $('#pwLog', root); if (el) el.textContent = events.join('\n'); };
      const load = async () => { notes = (await DB.all()).sort((a, b) => b.t - a.t); draw(); };
      const sync = async () => { if (!online()) return; const pend = notes.filter(n => !n.synced); for (const n of pend) { n.synced = true; await DB.put(n); } if (pend.length) { log(L(`${pend.length} notițe sincronizate`, `${pend.length} notes synced`)); bc && bc.postMessage({ from: tabId, type: 'change' }); } load(); };
      const draw = () => {
        const pend = notes.filter(n => !n.synced).length;
        root.innerHTML = pageHead(this) + `
        <div class="grid g4" style="margin-bottom:16px">
          <div class="kpi"><div class="v"><span class="status-dot" style="background:${online() ? 'var(--green)' : 'var(--red)'}"></span>${online() ? 'Online' : 'Offline'}</div><div class="l">${L('conexiune', 'connection')}</div></div>
          <div class="kpi"><div class="v">${notes.length}</div><div class="l">${L('notițe locale', 'local notes')}</div></div>
          <div class="kpi"><div class="v ${pend ? 'warn' : 'ok'}">${pend}</div><div class="l">${L('în coada de sync', 'in sync queue')}</div></div>
          <div class="kpi"><div class="v" style="font-size:.95rem">${DB.db ? 'IndexedDB ✓' : L('memorie (IndexedDB indisponibil)', 'memory (IndexedDB unavailable)')}</div><div class="l">${L('stocare', 'storage')}</div></div></div>
        <div class="grid g2">
          <div class="card"><h2>${L('Notiță nouă', 'New note')}</h2>
            <form id="pwF"><div class="field"><label for="pw-c">${L('Client', 'Client')}</label><input id="pw-c" required placeholder="Nova SRL"></div>
            <div class="field"><label for="pw-t">${L('Notiță', 'Note')}</label><textarea id="pw-t" required style="font-family:var(--f-body)" placeholder="${L('Sunat — revine joi cu bugetul.', 'Called — back Thursday with budget.')}"></textarea></div>
            <button class="btn primary">${L('Salvează local', 'Save locally')}</button></form>
            <div class="row" style="margin-top:14px"><label class="row" style="margin:0;color:var(--text)"><input type="checkbox" id="pwOff" ${forcedOffline ? 'checked' : ''}> ${L('Simulează offline', 'Simulate offline')}</label>
            <button class="btn sm" id="pwSync" ${online() && pend ? '' : 'disabled'}>${L('Sincronizează acum', 'Sync now')}</button>
            <a class="btn sm" href="#pwa-offline" target="_blank" rel="noopener">${L('Deschide în tab nou ↗', 'Open in new tab ↗')}</a></div>
            <p class="hint">${L('Deschide pagina în două taburi: o notiță salvată într-unul apare instant în celălalt. Sincronizarea e simulată (proiectul nu are server); coada arată exact ce ar pleca spre API.', 'Open the page in two tabs: a note saved in one appears instantly in the other. Sync is simulated (no server); the queue shows exactly what would go to an API.')}</p>
            <h3>Service Worker</h3><p class="hint" id="swS">${esc(swStatus || '…')}</p>
            <h3>${L('Jurnal', 'Log')}</h3><pre id="pwLog" aria-live="polite" style="min-height:60px">${esc(events.join('\n'))}</pre></div>
          <div class="card" style="min-width:0"><h2>${L('Notițe', 'Notes')}</h2>
            ${notes.length ? notes.map(n => `<div class="issue ${n.synced ? 'pass' : ''}"><div class="row" style="justify-content:space-between"><b>${esc(n.client)}</b><span class="hint">${n.synced ? '✓ sync' : '⏳ ' + L('în așteptare', 'pending')} · ${App.timeAgo(n.t)}</span></div><div>${esc(n.text)}</div><button class="btn sm danger" data-del="${n.id}" style="margin-top:4px">${L('Șterge', 'Delete')}</button></div>`).join('') : `<p class="hint">${L('Nicio notiță.', 'No notes.')}</p>`}</div>
        </div>`;
        $('#pwF', root).addEventListener('submit', async e => { e.preventDefault(); const n = { id: uid(), client: $('#pw-c', root).value.trim(), text: $('#pw-t', root).value.trim(), t: Date.now(), synced: false }; if (!n.client || !n.text) return; await DB.put(n); log(L('Salvat local: ', 'Saved locally: ') + n.client); bc && bc.postMessage({ from: tabId, type: 'change' }); if (online()) setTimeout(sync, 600); load(); });
        $('#pwOff', root).onchange = e => { forcedOffline = e.target.checked; log(forcedOffline ? 'offline (simulat)' : 'online'); if (!forcedOffline) sync(); else draw(); };
        $('#pwSync', root).onclick = sync;
        $$('[data-del]', root).forEach(b => b.onclick = async () => { await DB.del(b.dataset.del); bc && bc.postMessage({ from: tabId, type: 'change' }); load(); });
      };
      const onMsg = e => { if (e.data && e.data.from !== tabId) { log(L('Actualizare din alt tab', 'Update from another tab')); load(); } };
      const onNet = () => { log(navigator.onLine ? 'online' : 'offline'); if (navigator.onLine) sync(); else draw(); };
      if (bc) bc.addEventListener('message', onMsg);
      addEventListener('online', onNet); addEventListener('offline', onNet);
      (async () => {
        if (!DB.db && DB.ok) await DB.open();
        if (swStatus == null) {
          if (!('serviceWorker' in navigator)) swStatus = L('Browserul nu suportă Service Workers.', 'Browser does not support Service Workers.');
          else { try { const reg = await navigator.serviceWorker.register('sw.js'); swStatus = L('Activ — scope: ', 'Active — scope: ') + reg.scope; } catch (e) { swStatus = L('Nu s-a putut înregistra aici (pagină sandbox). Pe GitHub Pages, sw.js din proiect cache-uiește aplicația pentru offline complet.', 'Could not register here (sandboxed page). On GitHub Pages, the project’s sw.js caches the app for full offline use.'); } }
        }
        load();
      })();
      return () => { if (bc) bc.removeEventListener('message', onMsg); removeEventListener('online', onNet); removeEventListener('offline', onNet); };
    }
  });

  /* ---------- 12 SEO Inspector (Chrome extension + in-app) ---------- */
  let seoSrc = 'self', seoHtml = '';
  register({
    id: 'seo-inspector', n: 12, cat: 'tech',
    title: { ro: 'SEO Inspector — extensie Chrome', en: 'SEO Inspector — Chrome extension' },
    desc: { ro: 'Verifică meta tag-urile, titlurile, Open Graph, Schema.org și imaginile de pe orice pagină. Același analizor rulează aici și în extensia de Chrome (Manifest V3).', en: 'Checks meta tags, headings, Open Graph, Schema.org and images on any page. The same analyser runs here and in the Chrome extension (Manifest V3).' },
    shows: ['Manifest V3', 'DOMParser', 'chrome.scripting', 'SERP preview'],
    render(root) {
      const draw = () => {
        root.innerHTML = pageHead(this);           // render the heading first so the self-scan sees this page's real H1
        let doc = document;
        if (seoSrc === 'paste') doc = new DOMParser().parseFromString(seoHtml || '<html><head></head><body></body></html>', 'text/html');
        const r = seoAnalyze(doc, App.state.lang);
        const groups = [...new Set(r.checks.map(c => c.group))];
        const host = (() => { try { return new URL(r.url).host; } catch (e) { return 'laurandreea10.github.io'; } })();
        root.innerHTML = pageHead(this) + `
        <div class="card" style="margin-bottom:16px"><div class="row">
          <label class="row" style="margin:0;color:var(--text)"><input type="radio" name="ss" value="self" ${seoSrc === 'self' ? 'checked' : ''}> ${L('Analizează pagina aceasta', 'Analyse this page')}</label>
          <label class="row" style="margin:0;color:var(--text)"><input type="radio" name="ss" value="paste" ${seoSrc === 'paste' ? 'checked' : ''}> ${L('Lipește HTML', 'Paste HTML')}</label></div>
          ${seoSrc === 'paste' ? `<div class="field" style="margin-top:10px"><label for="seoIn">HTML</label><textarea id="seoIn" placeholder="${L('Lipește sursa paginii (Ctrl+U în browser, apoi copiază)', 'Paste page source (Ctrl+U in the browser, then copy)')}">${esc(seoHtml)}</textarea><button class="btn sm primary" id="seoRun">${L('Analizează', 'Analyse')}</button></div>` : ''}</div>
        <div class="grid g2">
          <div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">${L('Scor', 'Score')}</h2><span class="badge ${r.score >= 80 ? 'green' : r.score >= 50 ? 'amber' : 'red'}" style="font-size:1rem">${r.score}/100</span></div>
            ${groups.map(g => `<h3 style="margin-top:14px">${esc(g)}</h3>${r.checks.filter(c => c.group === g).map(c => `<div class="issue ${c.level === 'pass' ? 'pass' : c.level === 'err' ? 'err' : ''}">${c.level === 'pass' ? '✓' : c.level === 'err' ? '✕' : '⚠'} ${esc(c.msg)}</div>`).join('')}`).join('')}</div>
          <div class="stack">
            <div class="card"><h3>${L('Previzualizare Google', 'Google preview')}</h3>
              <div style="background:#fff;border-radius:8px;padding:14px;font-family:Arial,sans-serif"><div style="color:#202124;font-size:12px">${esc(host)}</div><div style="color:#1a0dab;font-size:19px;line-height:1.3;margin:3px 0">${esc((r.title || L('(fără titlu)', '(no title)')).slice(0, 60))}${r.title.length > 60 ? '…' : ''}</div><div style="color:#4d5156;font-size:13px;line-height:1.5">${esc((r.desc || L('Google va genera singur un fragment din conținut.', 'Google will generate a snippet from content.')).slice(0, 160))}${r.desc.length > 160 ? '…' : ''}</div></div></div>
            <div class="card"><h3>${L('Previzualizare social (Open Graph)', 'Social preview (Open Graph)')}</h3>
              <div style="border:1px solid var(--line);border-radius:10px;overflow:hidden"><div style="height:120px;background:linear-gradient(135deg,var(--cyan),var(--violet));display:grid;place-items:center;color:#06202a;font:600 .85rem var(--f-mono)">${r.og.image ? 'og:image ✓' : 'og:image ✕'}</div>
              <div style="padding:10px;background:var(--panel2)"><div class="hint">${esc(host.toUpperCase())}</div><b>${esc(r.og.title || r.title || '—')}</b><div class="hint">${esc((r.og.description || '').slice(0, 120))}</div></div></div></div>
            <div class="card"><h3>${L('Extensia de Chrome', 'The Chrome extension')}</h3><p class="hint">${L('În arhiva proiectului, folderul extension/ conține manifest.json, popup.html și popup.js. Instalare: chrome://extensions → Developer mode → Load unpacked → alegi folderul. Popup-ul rulează exact acest analizor pe tabul curent, prin chrome.scripting.executeScript.', 'In the project archive, the extension/ folder holds manifest.json, popup.html and popup.js. Install: chrome://extensions → Developer mode → Load unpacked → pick the folder. The popup runs this exact analyser on the active tab via chrome.scripting.executeScript.')}</p>
              <pre>${esc(EXT_MANIFEST)}</pre></div>
          </div></div>`;
        $$('[name=ss]', root).forEach(x => x.onchange = () => { seoSrc = x.value; draw(); });
        const run = $('#seoRun', root); if (run) run.onclick = () => { seoHtml = $('#seoIn', root).value; draw(); };
      };
      draw();
    }
  });
})();
