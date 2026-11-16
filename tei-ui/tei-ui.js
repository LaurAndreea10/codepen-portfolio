/*! Tei UI 1.0.0 — a small Web Components design system · Laura Andreea, Iași · no dependencies */
(() => {
'use strict';
if (customElements.get('tei-button')) return;

/* ---------- design tokens (override any of them on :root or on a wrapper) ---------- */
const TOKENS = `
:root{
  --tei-bg:#0a1220;--tei-surface:#111f36;--tei-surface-2:#16263f;--tei-line:#243756;--tei-text:#e8eef8;--tei-muted:#93a4bf;
  --tei-accent:#22d3ee;--tei-accent-ink:#04202a;--tei-focus:#f5b041;
  --tei-success:#34d399;--tei-warning:#f5b041;--tei-danger:#f87171;--tei-info:#60a5fa;
  --tei-radius:10px;--tei-space:4px;--tei-control:38px;
  --tei-font:'Inter',system-ui,sans-serif;--tei-mono:'JetBrains Mono',ui-monospace,monospace;--tei-serif:'Fraunces',Georgia,serif;
  --tei-shadow:0 10px 30px rgba(0,0,0,.35);
}
:root[data-theme=light]{
  --tei-bg:#f4f6fb;--tei-surface:#ffffff;--tei-surface-2:#eef2f9;--tei-line:#d5deec;--tei-text:#0f1a2e;--tei-muted:#54657f;
  --tei-accent:#0e7490;--tei-accent-ink:#ffffff;--tei-focus:#b45309;
  --tei-success:#047857;--tei-warning:#b45309;--tei-danger:#b91c1c;--tei-info:#1d4ed8;--tei-shadow:0 10px 30px rgba(15,26,46,.12);
}
tei-table{display:block}
tei-table table{width:100%;border-collapse:collapse;font:14px/1.5 var(--tei-font);color:var(--tei-text);background:var(--tei-surface);border:1px solid var(--tei-line);border-radius:var(--tei-radius);overflow:hidden}
tei-table th,tei-table td{text-align:left;padding:calc(var(--tei-space)*2) calc(var(--tei-space)*3);border-bottom:1px solid var(--tei-line)}
tei-table th{font:600 11px var(--tei-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--tei-muted);background:var(--tei-surface-2)}
tei-table th button{all:unset;cursor:pointer;display:inline-flex;gap:6px;align-items:center;min-height:28px}
tei-table th button:focus-visible{outline:2px solid var(--tei-focus);outline-offset:2px;border-radius:4px}
tei-table .tei-filter{display:flex;gap:10px;align-items:center;margin-bottom:8px;font:13px var(--tei-font);color:var(--tei-muted)}
tei-table .tei-filter input{background:var(--tei-surface-2);border:1px solid var(--tei-line);border-radius:var(--tei-radius);color:var(--tei-text);padding:0 12px;min-height:var(--tei-control);font:inherit;min-width:0;flex:1;max-width:280px}
#tei-toasts{position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;z-index:2147483000;max-width:min(360px,calc(100vw - 32px))}
`;
const st = document.createElement('style'); st.id = 'tei-tokens'; st.textContent = TOKENS; (document.head || document.documentElement).prepend(st);

const sheet = css => { const s = new CSSStyleSheet(); s.replaceSync(css); return s; };
const BASE = sheet(`:host{box-sizing:border-box;font-family:var(--tei-font);color:var(--tei-text)}*{box-sizing:border-box}:host([hidden]){display:none!important}:focus-visible{outline:2px solid var(--tei-focus);outline-offset:2px}@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}`);
class Base extends HTMLElement {
  constructor(){ super(); const C = this.constructor; this.attachShadow({ mode:'open' }); this.shadowRoot.adoptedStyleSheets = [BASE, C._sheet || (C._sheet = sheet(C.css || ''))]; if (C.html) this.shadowRoot.innerHTML = C.html; }
  $(s){ return this.shadowRoot.querySelector(s); }
  bool(n){ return this.hasAttribute(n); }
  emit(n, detail){ this.dispatchEvent(new CustomEvent(n, { bubbles:true, composed:true, detail })); }
}
const def = (name, C) => customElements.define(name, C);

/* ---------- tei-button ---------- */
def('tei-button', class extends Base {
  static css = `:host{display:inline-block;vertical-align:middle}button{font:600 14px var(--tei-font);min-height:var(--tei-control);padding:0 calc(var(--tei-space)*4);border-radius:var(--tei-radius);border:1px solid var(--tei-line);background:var(--tei-surface-2);color:var(--tei-text);cursor:pointer;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;width:100%;justify-content:center;transition:border-color .15s,filter .15s}
button:hover:not(:disabled){border-color:var(--tei-accent)}button:disabled{opacity:.5;cursor:not-allowed}
:host([variant=primary]) button{background:var(--tei-accent);border-color:var(--tei-accent);color:var(--tei-accent-ink)}:host([variant=primary]) button:hover:not(:disabled){filter:brightness(1.1)}
:host([variant=ghost]) button{background:transparent;border-color:transparent}:host([variant=ghost]) button:hover:not(:disabled){background:var(--tei-surface-2)}
:host([variant=danger]) button{border-color:var(--tei-danger);color:var(--tei-danger);background:transparent}
:host([size=sm]) button{min-height:30px;padding:0 calc(var(--tei-space)*2.5);font-size:13px}
.sp{display:none;width:14px;height:14px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:r .7s linear infinite}:host([loading]) .sp{display:block}@keyframes r{to{transform:rotate(1turn)}}`;
  static html = `<button part="button"><span class="sp" aria-hidden="true"></span><slot></slot></button>`;
  static observedAttributes = ['disabled', 'loading'];
  connectedCallback(){ this.sync(); if (!this._w){ this._w = true; this.addEventListener('click', e => { if (this.bool('disabled') || this.bool('loading')){ e.stopImmediatePropagation(); e.preventDefault(); return; } const f = this.closest('form'); if (f && this.getAttribute('type') === 'submit') f.requestSubmit(); }, true); } }
  attributeChangedCallback(){ this.sync(); }
  sync(){ const b = this.$('button'); b.disabled = this.bool('disabled') || this.bool('loading'); this.bool('loading') ? b.setAttribute('aria-busy', 'true') : b.removeAttribute('aria-busy'); }
  focus(o){ this.$('button').focus(o); }
});

/* ---------- tei-badge ---------- */
def('tei-badge', class extends Base {
  static css = `:host{display:inline-flex;align-items:center;gap:6px;font:600 12px var(--tei-mono);padding:2px 9px;border-radius:999px;border:1px solid var(--c,var(--tei-line));color:var(--c,var(--tei-muted));line-height:1.5}
:host([tone=info]){--c:var(--tei-info)}:host([tone=success]){--c:var(--tei-success)}:host([tone=warning]){--c:var(--tei-warning)}:host([tone=danger]){--c:var(--tei-danger)}:host([dot])::before{content:'';width:7px;height:7px;border-radius:50%;background:currentColor}`;
  static html = `<slot></slot>`;
});

/* ---------- tei-switch (form-associated) ---------- */
def('tei-switch', class extends Base {
  static formAssociated = true;
  static css = `:host{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;min-height:var(--tei-control);user-select:none;border-radius:var(--tei-radius)}:host([disabled]){opacity:.5;cursor:not-allowed}
.t{width:42px;height:24px;border-radius:999px;background:var(--tei-surface-2);border:1px solid var(--tei-line);position:relative;flex:none;transition:background .15s,border-color .15s}.t i{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:var(--tei-muted);transition:transform .15s,background .15s}
:host([checked]) .t{background:var(--tei-accent);border-color:var(--tei-accent)}:host([checked]) .t i{transform:translateX(18px);background:var(--tei-accent-ink)}`;
  static html = `<span class="t" part="track"><i></i></span><slot></slot>`;
  static observedAttributes = ['checked', 'disabled'];
  constructor(){ super(); this._i = this.attachInternals ? this.attachInternals() : null; }
  connectedCallback(){ this.setAttribute('role', 'switch'); this.sync(); if (this._w) return; this._w = true;
    this.addEventListener('click', () => this.toggle()); this.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); this.toggle(); } }); }
  attributeChangedCallback(){ this.sync(); }
  sync(){ this.setAttribute('aria-checked', this.checked); this.tabIndex = this.bool('disabled') ? -1 : 0; this.bool('disabled') ? this.setAttribute('aria-disabled', 'true') : this.removeAttribute('aria-disabled'); if (this._i && this._i.setFormValue) this._i.setFormValue(this.checked ? (this.getAttribute('value') || 'on') : null); }
  get checked(){ return this.bool('checked'); } set checked(v){ this.toggleAttribute('checked', !!v); }
  toggle(){ if (this.bool('disabled')) return; this.checked = !this.checked; this.emit('change', { checked:this.checked }); }
});

/* ---------- tei-tabs / tei-tab ---------- */
def('tei-tab', class extends Base { static css = `:host{display:none;padding:calc(var(--tei-space)*4) 0}:host([active]){display:block}`; static html = `<slot></slot>`; });
let tabsId = 0;
def('tei-tabs', class extends Base {
  static css = `:host{display:block}[role=tablist]{display:flex;gap:2px;border-bottom:1px solid var(--tei-line);overflow-x:auto}button{all:unset;cursor:pointer;padding:0 calc(var(--tei-space)*4);min-height:42px;display:inline-flex;align-items:center;font:600 14px var(--tei-font);color:var(--tei-muted);border-bottom:3px solid transparent;white-space:nowrap}button[aria-selected=true]{color:var(--tei-text);border-bottom-color:var(--tei-accent)}button:focus-visible{outline:2px solid var(--tei-focus);outline-offset:-2px}`;
  static html = `<div role="tablist" part="tablist"></div><slot></slot>`;
  connectedCallback(){ this._id = this._id || ++tabsId; queueMicrotask(() => this.build()); if (!this._mo){ this._mo = new MutationObserver(() => this.build()); this._mo.observe(this, { childList:true }); } }
  disconnectedCallback(){ this._mo && this._mo.disconnect(); this._mo = null; }
  get tabs(){ return [...this.children].filter(c => c.localName === 'tei-tab'); }
  build(){ const list = this.$('[role=tablist]'), tabs = this.tabs; list.setAttribute('aria-label', this.getAttribute('label') || ''); list.innerHTML = '';
    tabs.forEach((tb, i) => { const b = document.createElement('button'); b.setAttribute('role', 'tab'); b.id = `tei-t${this._id}-${i}`; b.textContent = tb.getAttribute('label') || `Tab ${i + 1}`; b.onclick = () => this.select(i, true);
      b.onkeydown = e => { const n = tabs.length, k = e.key, to = k === 'ArrowRight' ? (i + 1) % n : k === 'ArrowLeft' ? (i - 1 + n) % n : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1; if (to >= 0){ e.preventDefault(); this.select(to, true); list.children[to].focus(); } };
      list.appendChild(b); tb.setAttribute('role', 'tabpanel'); tb.setAttribute('aria-label', b.textContent); tb.tabIndex = 0; });
    this.select(Math.min(Math.max(0, +this.getAttribute('selected') || 0), Math.max(0, tabs.length - 1))); }
  select(i, user){ const tabs = this.tabs; [...this.$('[role=tablist]').children].forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; }); tabs.forEach((tb, k) => tb.toggleAttribute('active', k === i)); if (user){ this.setAttribute('selected', i); this.emit('tei-change', { index:i }); } }
});

/* ---------- tei-dialog ---------- */
def('tei-dialog', class extends Base {
  static css = `dialog{background:var(--tei-surface);color:var(--tei-text);border:1px solid var(--tei-line);border-radius:calc(var(--tei-radius) + 4px);padding:0;width:min(480px,calc(100vw - 28px));box-shadow:var(--tei-shadow)}dialog::backdrop{background:rgba(3,8,18,.65)}
header{display:flex;align-items:center;gap:12px;padding:calc(var(--tei-space)*4) calc(var(--tei-space)*5) 0}h2{font:700 20px var(--tei-serif);margin:0;flex:1}
.x{all:unset;cursor:pointer;width:34px;height:34px;display:grid;place-items:center;border-radius:8px;color:var(--tei-muted)}.x:hover{background:var(--tei-surface-2)}.x:focus-visible{outline:2px solid var(--tei-focus)}
.b{padding:calc(var(--tei-space)*3) calc(var(--tei-space)*5);font-size:14px;line-height:1.6}footer{display:flex;gap:8px;justify-content:flex-end;padding:0 calc(var(--tei-space)*5) calc(var(--tei-space)*4)}`;
  static html = `<dialog part="dialog" aria-labelledby="h"><header><h2 id="h"></h2><button class="x" type="button">✕</button></header><div class="b"><slot></slot></div><footer><slot name="footer"></slot></footer></dialog>`;
  static observedAttributes = ['heading', 'open', 'close-label'];
  connectedCallback(){ if (this._w) return this.sync(); this._w = true; const d = this.$('dialog'); this.$('.x').onclick = () => this.close(); d.addEventListener('click', e => { if (e.target === d) this.close(); });
    d.addEventListener('close', () => { this.removeAttribute('open'); this.emit('close'); if (this._ret && this._ret.focus) this._ret.focus(); }); this.sync(); }
  attributeChangedCallback(){ this.sync(); }
  sync(){ this.$('#h').textContent = this.getAttribute('heading') || ''; this.$('.x').setAttribute('aria-label', this.getAttribute('close-label') || 'Close'); const d = this.$('dialog'); if (!this.isConnected) return; if (this.bool('open') && !d.open){ this._ret = document.activeElement; d.showModal(); } else if (!this.bool('open') && d.open) d.close(); }
  show(){ this.setAttribute('open', ''); } close(){ this.removeAttribute('open'); }
});

/* ---------- tei-toast ---------- */
class Toast extends Base {
  static css = `:host{display:flex;gap:10px;align-items:center;background:var(--tei-surface-2);border:1px solid var(--c,var(--tei-accent));border-left-width:4px;border-radius:var(--tei-radius);padding:calc(var(--tei-space)*2.5) calc(var(--tei-space)*3);font-size:14px;box-shadow:var(--tei-shadow)}
:host([tone=success]){--c:var(--tei-success)}:host([tone=warning]){--c:var(--tei-warning)}:host([tone=danger]){--c:var(--tei-danger)}button{all:unset;cursor:pointer;margin-left:auto;width:28px;height:28px;display:grid;place-items:center;border-radius:6px;color:var(--tei-muted)}button:focus-visible{outline:2px solid var(--tei-focus)}`;
  static html = `<slot></slot><button type="button" aria-label="Close">✕</button>`;
  connectedCallback(){ this.$('button').onclick = () => this.remove(); }
  static show(message, { tone = 'info', duration = 4000, closeLabel = 'Close' } = {}){
    let box = document.getElementById('tei-toasts'); if (!box){ box = document.createElement('div'); box.id = 'tei-toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const el = document.createElement('tei-toast'); el.setAttribute('tone', tone); el.textContent = message; box.appendChild(el); el.$('button').setAttribute('aria-label', closeLabel); if (duration) setTimeout(() => el.remove(), duration); return el; }
}
def('tei-toast', Toast); window.TeiToast = Toast;

/* ---------- tei-progress ---------- */
def('tei-progress', class extends Base {
  static css = `:host{display:block}.l{display:flex;justify-content:space-between;font-size:13px;color:var(--tei-muted);margin-bottom:6px}.l b{font:600 12px var(--tei-mono);color:var(--tei-text)}.t{height:8px;border-radius:999px;background:var(--tei-surface-2);overflow:hidden}.t i{display:block;height:100%;background:var(--tei-accent);border-radius:999px;transition:width .3s}:host([tone=success]) .t i{background:var(--tei-success)}:host([tone=danger]) .t i{background:var(--tei-danger)}`;
  static html = `<div class="l"><span id="lab"></span><b id="pct"></b></div><div class="t" role="progressbar" aria-labelledby="lab"><i></i></div>`;
  static observedAttributes = ['value', 'max', 'label'];
  connectedCallback(){ this.sync(); } attributeChangedCallback(){ this.sync(); }
  sync(){ const max = +this.getAttribute('max') || 100, v = Math.min(max, Math.max(0, +this.getAttribute('value') || 0)), p = Math.round(v / max * 100), bar = this.$('.t'); this.$('#lab').textContent = this.getAttribute('label') || ''; this.$('#pct').textContent = p + '%'; this.$('i').style.width = p + '%'; bar.setAttribute('aria-valuemin', 0); bar.setAttribute('aria-valuemax', max); bar.setAttribute('aria-valuenow', v); }
});

/* ---------- tei-avatar ---------- */
def('tei-avatar', class extends Base {
  static css = `:host{display:inline-grid;place-items:center;width:var(--size,36px);height:var(--size,36px);border-radius:50%;font:600 calc(var(--size,36px)*.38) var(--tei-mono);color:#04121c;background:hsl(var(--h,190) 70% 62%);overflow:hidden;vertical-align:middle;flex:none}img{width:100%;height:100%;object-fit:cover}`;
  static observedAttributes = ['name', 'src'];
  connectedCallback(){ this.sync(); } attributeChangedCallback(){ this.sync(); }
  sync(){ const name = (this.getAttribute('name') || '').trim(), src = this.getAttribute('src'), ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?'; let h = 0; for (const c of name) h = (h * 31 + c.codePointAt(0)) % 360;
    this.style.setProperty('--h', h); this.setAttribute('role', 'img'); this.setAttribute('aria-label', name || 'Avatar'); const r = this.shadowRoot; r.textContent = '';
    if (src && /^(https?:|data:image\/|\.{0,2}\/)/i.test(src)){ const img = new Image(); img.alt = ''; img.onerror = () => { r.textContent = ini; }; img.src = src; r.appendChild(img); } else r.textContent = ini; }
});

/* ---------- tei-stat ---------- */
def('tei-stat', class extends Base {
  static css = `:host{display:block;background:var(--tei-surface);border:1px solid var(--tei-line);border-radius:calc(var(--tei-radius) + 2px);padding:calc(var(--tei-space)*3.5) calc(var(--tei-space)*4)}small{display:block;font:400 11px var(--tei-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--tei-muted)}.r{display:flex;align-items:flex-end;gap:10px;justify-content:space-between}b{font:700 28px/1.2 var(--tei-serif)}.d{font:600 12px var(--tei-mono)}.d.up{color:var(--tei-success)}.d.dn{color:var(--tei-danger)}svg{width:96px;height:32px;flex:none}polyline{fill:none;stroke:var(--tei-accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}`;
  static html = `<small id="l"></small><div class="r"><div><b id="v"></b> <span class="d" id="d"></span></div><svg viewBox="0 0 96 32" aria-hidden="true"><polyline/></svg></div>`;
  static observedAttributes = ['label', 'value', 'delta', 'trend'];
  connectedCallback(){ this.sync(); } attributeChangedCallback(){ this.sync(); }
  sync(){ this.$('#l').textContent = this.getAttribute('label') || ''; this.$('#v').textContent = this.getAttribute('value') || ''; const d = parseFloat(this.getAttribute('delta')), el = this.$('#d');
    if (isFinite(d)){ el.textContent = (d > 0 ? '▲ +' : d < 0 ? '▼ ' : '') + d + '%'; el.className = 'd ' + (d > 0 ? 'up' : d < 0 ? 'dn' : ''); } else el.textContent = '';
    const pts = (this.getAttribute('trend') || '').split(',').map(Number).filter(isFinite), svg = this.$('svg'); svg.style.display = pts.length > 1 ? '' : 'none';
    if (pts.length > 1){ const mn = Math.min(...pts), mx = Math.max(...pts), s = mx - mn || 1; this.$('polyline').setAttribute('points', pts.map((p, i) => `${(2 + i / (pts.length - 1) * 92).toFixed(1)},${(29 - (p - mn) / s * 26).toFixed(1)}`).join(' ')); } }
});

/* ---------- tei-input (form-associated) ---------- */
def('tei-input', class extends Base {
  static formAssociated = true;
  static css = `:host{display:block}label{display:block;font-size:13px;color:var(--tei-muted);margin-bottom:5px}label i{color:var(--tei-danger);font-style:normal}input{width:100%;font:14px var(--tei-font);min-height:var(--tei-control);padding:0 12px;border-radius:var(--tei-radius);border:1px solid var(--tei-line);background:var(--tei-surface-2);color:var(--tei-text)}input:disabled{opacity:.5}input[aria-invalid=true]{border-color:var(--tei-danger)}small{display:block;font-size:12px;margin-top:5px;color:var(--tei-muted)}#e{color:var(--tei-danger)}small:empty{display:none}`;
  static html = `<label for="i"><span id="lab"></span> <i id="req" aria-hidden="true"></i></label><input id="i" part="input" aria-describedby="h e"><small id="h"></small><small id="e" role="alert"></small>`;
  static observedAttributes = ['label', 'type', 'value', 'placeholder', 'required', 'hint', 'error', 'disabled'];
  constructor(){ super(); this._i = this.attachInternals ? this.attachInternals() : null; }
  connectedCallback(){ this.sync(); if (this._w) return; this._w = true; const i = this.$('input'); i.addEventListener('input', () => this.form()); i.addEventListener('change', () => this.emit('change', { value:i.value })); }
  attributeChangedCallback(n, o, v){ if (n === 'value') this.$('input').value = v ?? ''; this.sync(); }
  sync(){ const i = this.$('input'), g = n => this.getAttribute(n) || '', err = g('error'); this.$('#lab').textContent = g('label'); this.$('#req').textContent = this.bool('required') ? '*' : ''; this.$('#h').textContent = g('hint'); this.$('#e').textContent = err;
    i.type = ['text', 'email', 'url', 'tel', 'number', 'password', 'search'].includes(g('type')) ? g('type') : 'text'; i.placeholder = g('placeholder'); i.required = this.bool('required'); i.disabled = this.bool('disabled'); err ? i.setAttribute('aria-invalid', 'true') : i.removeAttribute('aria-invalid'); this.form(); }
  form(){ const i = this.$('input'); if (!this._i || !this._i.setFormValue) return; this._i.setFormValue(i.value); if (this._i.setValidity) i.validity.valid ? this._i.setValidity({}) : this._i.setValidity(i.validity, i.validationMessage, i); }
  get value(){ return this.$('input').value; } set value(v){ this.$('input').value = v ?? ''; this.form(); }
  focus(o){ this.$('input').focus(o); }
});

/* ---------- tei-table: progressive enhancement of a plain <table> ---------- */
def('tei-table', class extends HTMLElement {
  connectedCallback(){ if (this._w) return; queueMicrotask(() => { const table = this.querySelector('table'); if (!table || this._w) return; this._w = true; const body = table.tBodies[0], heads = [...table.querySelectorAll('thead th')];
    const val = (tr, i) => { const c = tr.cells[i]; if (!c) return ''; const raw = c.dataset.value ?? c.textContent.trim(), n = parseFloat(String(raw).replace(/\s/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.')); return c.dataset.value != null && isFinite(+raw) ? +raw : /^[-+]?[\d.,\s]+%?$/.test(raw) && isFinite(n) ? n : raw.toLowerCase(); };
    heads.forEach((th, i) => { if (th.hasAttribute('data-nosort')) return; const b = document.createElement('button'); b.type = 'button'; b.append(...th.childNodes); const ar = document.createElement('span'); ar.setAttribute('aria-hidden', 'true'); b.append(ar); th.append(b); th.setAttribute('aria-sort', 'none');
      b.onclick = () => { const dir = th.getAttribute('aria-sort') === 'ascending' ? -1 : 1; heads.forEach(h => { if (h.hasAttribute('aria-sort')) h.setAttribute('aria-sort', 'none'); const s = h.querySelector('button span'); if (s) s.textContent = ''; }); th.setAttribute('aria-sort', dir > 0 ? 'ascending' : 'descending'); ar.textContent = dir > 0 ? '↑' : '↓';
        [...body.rows].sort((a, c) => { const x = val(a, i), y = val(c, i); return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric:true })) * dir; }).forEach(r => body.appendChild(r)); this.dispatchEvent(new CustomEvent('tei-sort', { bubbles:true, detail:{ column:i, direction:dir > 0 ? 'ascending' : 'descending' } })); }; });
    if (this.hasAttribute('filter')){ const wrap = document.createElement('label'); wrap.className = 'tei-filter'; const sp = document.createElement('span'); sp.textContent = this.getAttribute('filter') || 'Filter'; const inp = document.createElement('input'); inp.type = 'search'; const out = document.createElement('span'); out.setAttribute('role', 'status'); wrap.append(sp, inp, out); this.prepend(wrap);
      inp.addEventListener('input', () => { const q = inp.value.trim().toLowerCase(); let n = 0; [...body.rows].forEach(r => { const ok = !q || r.textContent.toLowerCase().includes(q); r.hidden = !ok; if (ok) n++; }); out.textContent = q ? `${n} / ${body.rows.length}` : ''; }); } }); }
});
})();
