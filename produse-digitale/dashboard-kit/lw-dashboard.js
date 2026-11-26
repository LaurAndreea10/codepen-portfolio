/*! CRM Dashboard UI Kit v1.0.0 · Laura Andreea · MIT
 *  Web Components fără dependențe pentru dashboard-uri CRM:
 *  <lwd-kpi>, <lwd-sparkline>, <lwd-bars>, <lwd-donut>, <lwd-pipeline>, <lwd-table>, <lwd-activity>
 *  Temă: variabile CSS --lwd-bg, --lwd-surface, --lwd-text, --lwd-muted, --lwd-line, --lwd-c1…--lwd-c5
 *  Date: atributul `data` (JSON) sau proprietatea .data = […]
 */
(() => {
  "use strict";
  if (customElements.get("lwd-kpi")) return;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PAL = ["var(--lwd-c1,#4fd1e8)", "var(--lwd-c2,#ffb547)", "var(--lwd-c3,#ff7aa8)", "var(--lwd-c4,#5ee0a0)", "var(--lwd-c5,#a78bfa)"];
  const CSS = `:host{display:block;font-family:var(--lwd-font,Inter,system-ui,sans-serif);color:var(--lwd-text,#eef3fb)}
    .s{background:var(--lwd-surface,#13203a);border:1px solid var(--lwd-line,#ffffff1c);border-radius:var(--lwd-radius,16px);padding:18px;height:100%;box-sizing:border-box}
    .t{font:600 .78rem var(--lwd-mono,"JetBrains Mono",monospace);letter-spacing:.08em;text-transform:uppercase;color:var(--lwd-muted,#9fb0c9);margin:0 0 10px}
    .m{color:var(--lwd-muted,#9fb0c9)}
    svg{display:block;overflow:visible}`;
  const nf = (v, lang) => typeof v === "number" ? new Intl.NumberFormat(lang || document.documentElement.lang || "ro").format(v) : v;

  class Base extends HTMLElement {
    constructor() { super(); this.root = this.attachShadow({ mode: "open" }); }
    static get observedAttributes() { return ["data", "label", "value", "delta", "unit", "trend", "title", "columns", "page-size"]; }
    get data() {
      if (this._data) return this._data;
      try { return JSON.parse(this.getAttribute("data") || "[]"); } catch (e) { return []; }
    }
    set data(v) { this._data = v; this.render(); }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    head() { const t = this.getAttribute("title"); return t ? `<p class="t">${esc(t)}</p>` : ""; }
  }

  /* KPI card */
  class Kpi extends Base {
    render() {
      const delta = parseFloat(this.getAttribute("delta") || "0");
      const good = this.hasAttribute("inverse") ? delta <= 0 : delta >= 0;
      const trend = (this.getAttribute("trend") || "").split(",").map(Number).filter(n => !isNaN(n));
      const unit = this.getAttribute("unit") || "";
      this.root.innerHTML = `<style>${CSS}.v{font:700 2rem/1.1 var(--lwd-serif,Fraunces,Georgia,serif);margin:2px 0 6px}.d{font:700 .85rem var(--lwd-mono,monospace);color:${good ? "var(--lwd-good,#5ee0a0)" : "var(--lwd-bad,#ff6b6b)"}}</style>
        <div class="s" role="group" aria-label="${esc(this.getAttribute("label"))}"><p class="t">${esc(this.getAttribute("label"))}</p>
        <div class="v">${esc(this.getAttribute("value"))}${unit ? `<small style="font-size:.5em" class="m"> ${esc(unit)}</small>` : ""}</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px"><span class="d">${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)}%</span>${trend.length > 1 ? `<lwd-sparkline trend="${trend.join(",")}" style="width:96px;height:30px"></lwd-sparkline>` : ""}</div></div>`;
    }
  }

  /* Sparkline */
  class Spark extends Base {
    render() {
      const v = (this.getAttribute("trend") || "").split(",").map(Number).filter(n => !isNaN(n));
      if (v.length < 2) { this.root.innerHTML = ""; return; }
      const w = 100, h = 30, mn = Math.min(...v), mx = Math.max(...v), r = mx - mn || 1;
      const pts = v.map((y, i) => [(i / (v.length - 1)) * w, h - ((y - mn) / r) * (h - 4) - 2]);
      const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
      const col = this.getAttribute("color") || PAL[0];
      this.root.innerHTML = `<style>:host{display:inline-block}</style><svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="none" role="img" aria-label="Trend: ${v.join(", ")}"><path d="${d} L${w} ${h} L0 ${h}Z" fill="${col}" opacity=".15"/><path d="${d}" fill="none" stroke="${col}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`;
    }
  }

  /* Bar chart: data = [{label, value}] */
  class Bars extends Base {
    render() {
      const d = this.data, mx = Math.max(1, ...d.map(x => x.value));
      this.root.innerHTML = `<style>${CSS}
        .wrap{display:flex;align-items:flex-end;gap:8px;height:var(--lwd-chart-h,180px);border-bottom:1px solid var(--lwd-line,#ffffff1c);padding-top:18px}
        .b{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;height:100%;gap:4px;position:relative}
        .bar{width:100%;border-radius:8px 8px 3px 3px;background:var(--lwd-c1,#4fd1e8);transition:height .5s cubic-bezier(.2,.8,.2,1)}
        .b:last-child .bar{background:var(--lwd-c2,#ffb547)}
        .val{font:600 .72rem var(--lwd-mono,monospace)}
        .labels{display:flex;gap:8px;margin-top:6px}.labels span{flex:1;text-align:center;font-size:.72rem}
        @media (prefers-reduced-motion:reduce){.bar{transition:none}}</style>
        <div class="s">${this.head()}<div class="wrap" role="img" aria-label="${esc(d.map(x => x.label + ": " + x.value).join(", "))}">${d.map(x => `<div class="b"><span class="val">${nf(x.value)}</span><div class="bar" style="height:${(x.value / mx) * 88}%"></div></div>`).join("")}</div>
        <div class="labels m">${d.map(x => `<span>${esc(x.label)}</span>`).join("")}</div></div>`;
    }
  }

  /* Donut: data = [{label, value}] */
  class Donut extends Base {
    render() {
      const d = this.data, tot = d.reduce((s, x) => s + x.value, 0) || 1;
      let acc = 0;
      const R = 40, C = 2 * Math.PI * R;
      const arcs = d.map((x, i) => {
        const len = (x.value / tot) * C, off = -acc; acc += len;
        return `<circle r="${R}" cx="50" cy="50" fill="none" stroke="${PAL[i % 5]}" stroke-width="16" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}" transform="rotate(-90 50 50)"/>`;
      }).join("");
      this.root.innerHTML = `<style>${CSS}.row{display:flex;gap:18px;align-items:center;flex-wrap:wrap}ul{list-style:none;margin:0;padding:0;display:grid;gap:6px;font-size:.88rem;flex:1;min-width:130px}li{display:flex;align-items:center;gap:8px}i{width:10px;height:10px;border-radius:3px;display:inline-block}b{margin-left:auto;font-family:var(--lwd-mono,monospace)}</style>
        <div class="s">${this.head()}<div class="row"><svg viewBox="0 0 100 100" width="130" height="130" role="img" aria-label="${esc(d.map(x => `${x.label} ${Math.round(x.value / tot * 100)}%`).join(", "))}">${arcs}<text x="50" y="54" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">${nf(tot)}</text></svg>
        <ul>${d.map((x, i) => `<li><i style="background:${PAL[i % 5]}"></i>${esc(x.label)}<b>${Math.round(x.value / tot * 100)}%</b></li>`).join("")}</ul></div></div>`;
    }
  }

  /* Pipeline: data = [{stage, count, value}] */
  class Pipeline extends Base {
    render() {
      const d = this.data, mx = Math.max(1, ...d.map(x => x.count));
      this.root.innerHTML = `<style>${CSS}.st{display:grid;grid-template-columns:110px 1fr auto;gap:10px;align-items:center;margin:8px 0;font-size:.88rem}.tr{height:22px;border-radius:7px;background:var(--lwd-line,#ffffff1c);overflow:hidden}.fl{height:100%;border-radius:7px;transition:width .5s}.cv{font:600 .72rem var(--lwd-mono,monospace)}@media(max-width:420px){.st{grid-template-columns:80px 1fr auto}}</style>
        <div class="s">${this.head()}${d.map((x, i) => {
          const conv = i ? Math.round((x.count / (d[i - 1].count || 1)) * 100) : 100;
          return `<div class="st"><span>${esc(x.stage)}</span><div class="tr" role="progressbar" aria-label="${esc(x.stage)}" aria-valuenow="${x.count}" aria-valuemin="0" aria-valuemax="${mx}"><div class="fl" style="width:${(x.count / mx) * 100}%;background:${PAL[i % 5]}"></div></div><span class="cv">${nf(x.count)}${i ? ` · ${conv}%` : ""}</span></div>`;
        }).join("")}</div>`;
    }
  }

  /* Table: data = [{…}], columns = "key:Label,key2:Label2" — sortare + căutare + paginare */
  class Table extends Base {
    render() {
      const cols = (this.getAttribute("columns") || "").split(",").filter(Boolean).map(c => { const [k, l] = c.split(":"); return { k, l: l || k }; });
      const keys = cols.length ? cols : Object.keys(this.data[0] || {}).map(k => ({ k, l: k }));
      this.st = this.st || { sort: null, dir: 1, q: "", page: 0 };
      const size = +(this.getAttribute("page-size") || 6);
      const q = this.st.q.toLowerCase();
      let rows = this.data.filter(r => !q || keys.some(c => String(r[c.k]).toLowerCase().includes(q)));
      if (this.st.sort) rows = rows.slice().sort((a, b) => { const x = a[this.st.sort], y = b[this.st.sort]; return (typeof x === "number" ? x - y : String(x).localeCompare(String(y))) * this.st.dir; });
      const pages = Math.max(1, Math.ceil(rows.length / size));
      this.st.page = Math.min(this.st.page, pages - 1);
      const view = rows.slice(this.st.page * size, this.st.page * size + size);
      const en = (document.documentElement.lang || "ro").startsWith("en");
      const hadFocus = this.root.activeElement?.classList.contains("q");
      this.root.innerHTML = `<style>${CSS}
        .tb{display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-bottom:10px}
        input{font:inherit;color:inherit;background:var(--lwd-bg,#0b1220);border:1px solid var(--lwd-line,#ffffff1c);border-radius:10px;padding:8px 10px;min-width:0;flex:1;max-width:240px}
        .sc{overflow:auto}table{width:100%;border-collapse:collapse;font-size:.88rem}
        th,td{text-align:left;padding:9px 8px;border-bottom:1px solid var(--lwd-line,#ffffff1c);white-space:nowrap}
        th button{all:unset;cursor:pointer;font-weight:700}th button:focus-visible,.pg button:focus-visible,input:focus-visible{outline:2px solid var(--lwd-c2,#ffb547);outline-offset:2px}
        .pill{padding:2px 9px;border-radius:999px;font-size:.75rem;font-weight:700;background:var(--lwd-line,#ffffff1c)}
        .pg{display:flex;gap:6px;align-items:center;justify-content:flex-end;margin-top:10px;font-size:.82rem}
        .pg button{font:inherit;color:inherit;background:transparent;border:1px solid var(--lwd-line,#ffffff1c);border-radius:8px;padding:4px 10px;cursor:pointer}
        .pg button:disabled{opacity:.4;cursor:default}</style>
        <div class="s"><div class="tb">${this.head() ? `<div>${this.head()}</div>` : "<span></span>"}<input class="q" type="search" value="${esc(this.st.q)}" placeholder="${en ? "Search…" : "Caută…"}" aria-label="${en ? "Search table" : "Caută în tabel"}"></div>
        <div class="sc"><table><thead><tr>${keys.map(c => `<th scope="col" aria-sort="${this.st.sort === c.k ? (this.st.dir > 0 ? "ascending" : "descending") : "none"}"><button type="button" data-k="${esc(c.k)}">${esc(c.l)} ${this.st.sort === c.k ? (this.st.dir > 0 ? "↑" : "↓") : ""}</button></th>`).join("")}</tr></thead>
        <tbody>${view.map(r => `<tr>${keys.map(c => `<td>${c.k === "status" ? `<span class="pill">${esc(r[c.k])}</span>` : esc(nf(r[c.k]))}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${keys.length}" class="m">${en ? "No results" : "Niciun rezultat"}</td></tr>`}</tbody></table></div>
        <div class="pg"><span class="m">${rows.length} ${en ? "rows" : "rânduri"}</span><button type="button" class="pv" ${this.st.page ? "" : "disabled"} aria-label="${en ? "Previous page" : "Pagina anterioară"}">←</button><span>${this.st.page + 1}/${pages}</span><button type="button" class="nx" ${this.st.page < pages - 1 ? "" : "disabled"} aria-label="${en ? "Next page" : "Pagina următoare"}">→</button></div></div>`;
      const inp = this.root.querySelector(".q");
      inp.oninput = () => { this.st.q = inp.value; this.st.page = 0; this.render(); };
      if (hadFocus) { const i = this.root.querySelector(".q"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
      this.root.querySelectorAll("th button").forEach(b => b.onclick = () => { this.st.dir = this.st.sort === b.dataset.k ? -this.st.dir : 1; this.st.sort = b.dataset.k; this.render(); this.root.querySelector(`th button[data-k="${b.dataset.k}"]`)?.focus(); });
      this.root.querySelector(".pv").onclick = () => { this.st.page--; this.render(); };
      this.root.querySelector(".nx").onclick = () => { this.st.page++; this.render(); };
    }
  }

  /* Activity feed: data = [{who, what, when, type}] */
  class Activity extends Base {
    render() {
      const icon = { deal: "💼", email: "✉️", call: "📞", note: "📝", win: "🏆" };
      this.root.innerHTML = `<style>${CSS}ol{list-style:none;margin:0;padding:0;display:grid;gap:12px}li{display:grid;grid-template-columns:34px 1fr;gap:10px;font-size:.88rem}.ic{width:34px;height:34px;border-radius:10px;background:var(--lwd-line,#ffffff1c);display:grid;place-items:center}</style>
        <div class="s">${this.head()}<ol>${this.data.map(a => `<li><span class="ic" aria-hidden="true">${icon[a.type] || "•"}</span><span><strong>${esc(a.who)}</strong> ${esc(a.what)}<br><small class="m">${esc(a.when)}</small></span></li>`).join("")}</ol></div>`;
    }
  }

  customElements.define("lwd-kpi", Kpi);
  customElements.define("lwd-sparkline", Spark);
  customElements.define("lwd-bars", Bars);
  customElements.define("lwd-donut", Donut);
  customElements.define("lwd-pipeline", Pipeline);
  customElements.define("lwd-table", Table);
  customElements.define("lwd-activity", Activity);
})();
