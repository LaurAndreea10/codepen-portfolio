/*! Gamified Marketing Widgets v1.0.0 · Laura Andreea · MIT
 *  Web Components fără dependențe: <lw-spin-wheel>, <lw-scratch-card>, <lw-quiz>, <lw-memory>.
 *  Fiecare widget emite evenimentul `lw-win` cu { widget, prize, code } — îl poți lega de analytics.
 *  Atribute comune: lang="ro|en", primary, accent, code, once (o singură încercare per vizitator).
 */
(() => {
  "use strict";
  if (window.customElements?.get("lw-spin-wheel")) return;

  const TXT = {
    ro: { spin: "Învârte roata", spinning: "Se învârte…", won: "Ai câștigat", code: "Codul tău", copy: "Copiază codul", copied: "Copiat ✓", again: "Mai încearcă", used: "Ai folosit deja încercarea.", reveal: "Dezvăluie", scratch: "Răzuiește cu degetul sau mouse-ul", next: "Următoarea", result: "Recomandarea noastră", restart: "Reia", moves: "Mutări", pairs: "Perechi", memWin: "Bravo! Ai găsit toate perechile.", memLose: "Aproape! Încearcă din nou în mai puține mutări.", noPrize: "Nu de data asta" },
    en: { spin: "Spin the wheel", spinning: "Spinning…", won: "You won", code: "Your code", copy: "Copy code", copied: "Copied ✓", again: "Try again", used: "You have already used your try.", reveal: "Reveal", scratch: "Scratch with your finger or mouse", next: "Next", result: "Our recommendation", restart: "Restart", moves: "Moves", pairs: "Pairs", memWin: "Well done! You found every pair.", memLose: "So close! Try again in fewer moves.", noPrize: "Not this time" }
  };
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const contrastText = hex => {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map(x => x + x).join("") : h, 16);
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
    return .2126 * r + .7152 * g + .0722 * b > .4 ? "#111111" : "#ffffff";
  };

  const BASE_CSS = `
    :host{display:block;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--lw-text,#0d1a2d);--p:var(--lw-primary,#4fd1e8);--a:var(--lw-accent,#ffb547)}
    .box{background:var(--lw-bg,#ffffff);border-radius:20px;padding:22px;box-shadow:0 14px 40px #0d1a2d22;text-align:center;max-width:420px;margin:0 auto;box-sizing:border-box}
    h3{font:700 1.3rem/1.2 Fraunces,Georgia,serif;margin:0 0 6px}
    p{margin:0 0 12px;opacity:.8}
    button{font:700 1rem Inter,system-ui,sans-serif;border:0;border-radius:999px;padding:12px 22px;cursor:pointer;background:var(--p);color:var(--on-p,#111);min-height:44px}
    button:focus-visible{outline:3px solid var(--a);outline-offset:3px}
    button:disabled{opacity:.55;cursor:not-allowed}
    .ghost{background:transparent;color:inherit;border:2px solid currentColor}
    .result{margin-top:14px;min-height:1.5em;font-weight:600}
    .code{display:inline-flex;gap:8px;align-items:center;margin-top:8px;padding:8px 8px 8px 16px;border:2px dashed var(--a);border-radius:12px;font:700 1.05rem "JetBrains Mono",ui-monospace,monospace}
    .code button{padding:6px 12px;min-height:34px;font-size:.85rem;background:var(--a);color:var(--on-a,#111)}
    @media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important}}
  `;

  class LwBase extends HTMLElement {
    constructor() { super(); this.root = this.attachShadow({ mode: "open" }); }
    get L() { return TXT[(this.getAttribute("lang") || document.documentElement.lang || "ro").startsWith("en") ? "en" : "ro"]; }
    attr(n, d) { return this.getAttribute(n) ?? d; }
    connectedCallback() { this.paint(); }
    attributeChangedCallback() { if (this.isConnected) this.paint(); }
    paint() {
      const p = this.attr("primary", "#4fd1e8"), a = this.attr("accent", "#ffb547");
      this.style.setProperty("--lw-primary", p); this.style.setProperty("--lw-accent", a);
      this.style.setProperty("--on-p", contrastText(p)); this.style.setProperty("--on-a", contrastText(a));
      this.render();
    }
    get storeKey() { return "lw-" + this.localName + "-" + (this.id || this.attr("code", "x")); }
    used() { try { return this.hasAttribute("once") && localStorage.getItem(this.storeKey) === "1"; } catch (e) { return false; } }
    markUsed() { try { if (this.hasAttribute("once")) localStorage.setItem(this.storeKey, "1"); } catch (e) {} }
    codeHTML(code) { return `<div class="code"><span>${esc(code)}</span><button type="button" data-copy="${esc(code)}">${this.L.copy}</button></div>`; }
    bindCopy() {
      this.root.querySelectorAll("[data-copy]").forEach(b => b.onclick = async () => {
        try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) {}
        b.textContent = this.L.copied;
      });
    }
    win(prize, code) {
      this.markUsed();
      this.dispatchEvent(new CustomEvent("lw-win", { bubbles: true, composed: true, detail: { widget: this.localName, prize, code } }));
    }
  }

  /* ---------------- Roata norocului ---------------- */
  class LwSpinWheel extends LwBase {
    static get observedAttributes() { return ["prizes", "primary", "accent", "title", "lang", "code"]; }
    render() {
      const L = this.L;
      const prizes = this.attr("prizes", L === TXT.en ? "10% off|Free shipping|Try again|15% off|Gift|5% off" : "10% reducere|Transport gratuit|Mai încearcă|15% reducere|Cadou|5% reducere").split("|").map(s => s.trim()).filter(Boolean).slice(0, 12);
      this.prizes = prizes;
      const n = prizes.length, seg = 360 / n;
      const p = this.attr("primary", "#4fd1e8"), a = this.attr("accent", "#ffb547");
      const stops = prizes.map((_, i) => `${i % 2 ? a : p} ${i * seg}deg ${(i + 1) * seg}deg`).join(",");
      const labels = `<svg viewBox="0 0 200 200" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">${prizes.map((x, i) => { const mid = i * seg + seg / 2; const txt = x.length > 13 ? x.slice(0, 12) + "…" : x; return `<text transform="rotate(${mid - 90} 100 100)" x="186" y="100" text-anchor="end" dominant-baseline="middle" font-family="Inter,system-ui,sans-serif" font-weight="700" font-size="${n > 8 ? 7 : 8}" fill="${contrastText(i % 2 ? a : p)}">${esc(txt)}</text>`; }).join("")}</svg>`;
      this.root.innerHTML = `<style>${BASE_CSS}
        .wheel-wrap{position:relative;width:var(--lw-wheel-size,min(300px,78vw));aspect-ratio:1;margin:12px auto 16px}
        .wheel{position:absolute;inset:0;border-radius:50%;background:conic-gradient(${stops});border:6px solid #fff;box-shadow:0 0 0 4px var(--p),0 10px 30px #0003;transition:transform 4.2s cubic-bezier(.12,.75,.1,1)}
        .hub{position:absolute;inset:38%;border-radius:50%;background:#fff;box-shadow:0 2px 10px #0003;display:grid;place-items:center;font-size:1.4rem}
        .pin{position:absolute;left:50%;top:-14px;translate:-50% 0;width:0;height:0;border:14px solid transparent;border-top:26px solid #e11d48;filter:drop-shadow(0 2px 2px #0004);z-index:2}
      </style>
      <div class="box" part="box"><h3>${esc(this.attr("title", L.spin))}</h3>
        <div class="wheel-wrap"><div class="pin"></div><div class="wheel" role="img" aria-label="${esc(prizes.join(", "))}">${labels}</div><div class="hub" aria-hidden="true">🎁</div></div>
        <button type="button" class="go">${L.spin}</button>
        <div class="result" role="status" aria-live="polite"></div></div>`;
      this.rot = 0;
      const go = this.root.querySelector(".go");
      if (this.used()) { go.disabled = true; this.root.querySelector(".result").textContent = L.used; }
      go.onclick = () => this.spin();
    }
    spin() {
      const L = this.L, go = this.root.querySelector(".go"), wheel = this.root.querySelector(".wheel"), out = this.root.querySelector(".result");
      const n = this.prizes.length, seg = 360 / n;
      const idx = crypto.getRandomValues(new Uint32Array(1))[0] % n;
      go.disabled = true; go.textContent = L.spinning; out.textContent = "";
      // segmentul idx trebuie să ajungă sub indicatorul de sus (0deg)
      const target = 360 - (idx * seg + seg / 2) + (Math.random() - .5) * seg * .6;
      this.rot += 360 * (reduced() ? 1 : 6) + ((target - (this.rot % 360)) + 360) % 360;
      wheel.style.transform = `rotate(${this.rot}deg)`;
      const done = () => {
        const prize = this.prizes[idx];
        const lose = /încearcă|try again|nimic|nothing/i.test(prize);
        if (lose) { out.textContent = L.noPrize + " — " + prize; go.disabled = this.hasAttribute("once"); go.textContent = L.again; if (this.hasAttribute("once")) this.markUsed(); return; }
        const code = this.attr("code", "SPIN") + "-" + (idx + 1) + Math.random().toString(36).slice(2, 5).toUpperCase();
        out.innerHTML = `${L.won}: <strong>${esc(prize)}</strong><br>${this.codeHTML(code)}`;
        this.bindCopy(); go.textContent = L.spin; go.disabled = this.hasAttribute("once");
        this.win(prize, code);
      };
      setTimeout(done, reduced() ? 300 : 4300);
    }
  }

  /* ---------------- Card de răzuit ---------------- */
  class LwScratchCard extends LwBase {
    static get observedAttributes() { return ["prize", "primary", "accent", "title", "lang", "code"]; }
    render() {
      const L = this.L;
      const prize = this.attr("prize", L === TXT.en ? "20% off your first order" : "20% reducere la prima comandă");
      const code = this.attr("code", "SCRATCH20");
      this.root.innerHTML = `<style>${BASE_CSS}
        .card{position:relative;width:min(320px,80vw);aspect-ratio:16/10;margin:12px auto;border-radius:16px;overflow:hidden;background:linear-gradient(135deg,var(--p),var(--a));display:grid;place-items:center;color:var(--on-p,#111);touch-action:none}
        .prize{font:700 1.35rem/1.2 Fraunces,Georgia,serif;padding:16px}
        canvas{position:absolute;inset:0;width:100%;height:100%;cursor:grab}
      </style>
      <div class="box"><h3>${esc(this.attr("title", L === TXT.en ? "Scratch & win" : "Răzuiește și câștigă"))}</h3><p>${L.scratch}</p>
        <div class="card"><div class="prize">${esc(prize)}</div><canvas aria-hidden="true"></canvas></div>
        <button type="button" class="ghost rv">${L.reveal}</button>
        <div class="result" role="status" aria-live="polite"></div></div>`;
      const canvas = this.root.querySelector("canvas"), card = this.root.querySelector(".card");
      const out = this.root.querySelector(".result"), rv = this.root.querySelector(".rv");
      let done = false;
      const finish = () => {
        if (done) return; done = true;
        canvas.style.transition = "opacity .4s"; canvas.style.opacity = "0";
        setTimeout(() => canvas.remove(), 420);
        rv.hidden = true;
        out.innerHTML = `${L.won}: <strong>${esc(prize)}</strong><br>${this.codeHTML(code)}`;
        this.bindCopy(); this.win(prize, code);
      };
      if (this.used()) { canvas.remove(); rv.hidden = true; out.textContent = L.used; return; }
      requestAnimationFrame(() => {
        const r = card.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, r.width * dpr); canvas.height = Math.max(1, r.height * dpr);
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        const g = ctx.createLinearGradient(0, 0, r.width, r.height);
        g.addColorStop(0, "#c9ced8"); g.addColorStop(.5, "#eef1f5"); g.addColorStop(1, "#b7bdc8");
        ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
        ctx.fillStyle = "#6b7280"; ctx.font = "700 18px Inter, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("✦ " + (L === TXT.en ? "SCRATCH HERE" : "RĂZUIEȘTE AICI") + " ✦", r.width / 2, r.height / 2 + 6);
        ctx.globalCompositeOperation = "destination-out";
        let drawing = false, last = null, moves = 0;
        const pos = e => { const b = canvas.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
        const cleared = () => {
          const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let c = 0, tot = 0;
          for (let i = 3; i < d.length; i += 64) { tot++; if (d[i] === 0) c++; }
          return c / tot;
        };
        canvas.addEventListener("pointerdown", e => { drawing = true; last = pos(e); canvas.setPointerCapture(e.pointerId); });
        canvas.addEventListener("pointermove", e => {
          if (!drawing) return; const p = pos(e);
          ctx.lineWidth = 34; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke(); last = p;
          if (++moves % 12 === 0 && cleared() > .5) finish();
        });
        const up = () => { drawing = false; if (!done && cleared() > .5) finish(); };
        canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
      });
      rv.onclick = finish;
    }
  }

  /* ---------------- Quiz de produs ---------------- */
  const QUIZ_DEFAULT = {
    ro: { title: "Ce plan ți se potrivește?", questions: [
      { q: "Câți oameni sunt în echipa ta?", a: [["Doar eu", 0], ["2–10", 1], ["Peste 10", 2]] },
      { q: "Ce vrei să rezolvi mai întâi?", a: [["Să țin evidența clienților", 0], ["Să automatizez emailuri", 1], ["Rapoarte pentru management", 2]] },
      { q: "Cât de des trimiți campanii?", a: [["Rar", 0], ["Lunar", 1], ["Săptămânal", 2]] }
    ], results: [["Starter", "Simplu și gratuit pentru început."], ["Growth", "Automatizări și segmente pentru echipe mici."], ["Scale", "Rapoarte avansate și roluri pentru echipe mari."]] },
    en: { title: "Which plan fits you?", questions: [
      { q: "How many people are on your team?", a: [["Just me", 0], ["2–10", 1], ["More than 10", 2]] },
      { q: "What do you want to solve first?", a: [["Keep track of customers", 0], ["Automate emails", 1], ["Reports for management", 2]] },
      { q: "How often do you send campaigns?", a: [["Rarely", 0], ["Monthly", 1], ["Weekly", 2]] }
    ], results: [["Starter", "Simple and free to start."], ["Growth", "Automations and segments for small teams."], ["Scale", "Advanced reports and roles for large teams."]] }
  };
  class LwQuiz extends LwBase {
    static get observedAttributes() { return ["primary", "accent", "lang", "code"]; }
    get config() {
      const s = this.querySelector('script[type="application/json"]');
      if (s) { try { return JSON.parse(s.textContent); } catch (e) {} }
      return QUIZ_DEFAULT[this.L === TXT.en ? "en" : "ro"];
    }
    render() { this.step = 0; this.scores = []; this.draw(); }
    draw() {
      const L = this.L, c = this.config, qs = c.questions;
      const prog = `<div style="height:6px;border-radius:6px;background:#0d1a2d14;margin:10px 0 18px"><div style="height:100%;width:${(this.step / qs.length) * 100}%;background:var(--p);border-radius:6px;transition:width .3s"></div></div>`;
      let body;
      if (this.step < qs.length) {
        const q = qs[this.step];
        body = `<p style="font-weight:700;opacity:1">${esc(q.q)}</p><div class="opts" role="group" aria-label="${esc(q.q)}">${q.a.map((o, i) => `<button type="button" class="ghost opt" data-i="${i}">${esc(o[0])}</button>`).join("")}</div>`;
      } else {
        const tally = {}; this.scores.forEach(s => tally[s] = (tally[s] || 0) + 1);
        const best = +Object.keys(tally).sort((x, y) => tally[y] - tally[x] || y - x)[0];
        const r = c.results[best] || c.results[0];
        const code = this.attr("code", "QUIZ") + "-" + r[0].toUpperCase().replace(/\W/g, "").slice(0, 6);
        body = `<p style="opacity:.7">${L.result}</p><div style="font:700 2rem Fraunces,Georgia,serif;color:var(--p)">${esc(r[0])}</div><p>${esc(r[1])}</p>${this.codeHTML(code)}<div style="margin-top:14px"><button type="button" class="ghost rs">${L.restart}</button></div>`;
        queueMicrotask(() => this.win(r[0], code));
      }
      this.root.innerHTML = `<style>${BASE_CSS}.opts{display:grid;gap:10px}.opt{border-radius:14px;text-align:left}.opt:hover{background:var(--p);color:var(--on-p);border-color:transparent}</style>
        <div class="box"><h3>${esc(c.title)}</h3>${prog}<div class="q" role="status" aria-live="polite">${body}</div></div>`;
      this.root.querySelectorAll(".opt").forEach(b => b.onclick = () => { this.scores.push(qs[this.step].a[+b.dataset.i][1]); this.step++; this.draw(); this.root.querySelector(".opt, .rs")?.focus(); });
      const rs = this.root.querySelector(".rs"); if (rs) rs.onclick = () => this.render();
      this.bindCopy();
    }
  }

  /* ---------------- Memory ---------------- */
  class LwMemory extends LwBase {
    static get observedAttributes() { return ["icons", "primary", "accent", "lang", "code", "max-moves"]; }
    render() {
      const L = this.L;
      const icons = [...(this.attr("icons", "🍓🍋🥝🫐🍑🍇"))].filter(ch => ch.trim()).slice(0, 8);
      const icons2 = Array.from(this.attr("icons", "🍓🍋🥝🫐🍑🍇").matchAll(/\p{Extended_Pictographic}(️|‍\p{Extended_Pictographic})*/gu), m => m[0]).slice(0, 8);
      const set = icons2.length >= 2 ? icons2 : icons;
      const deck = [...set, ...set].map((v, i) => ({ v, k: i })).sort(() => Math.random() - .5);
      const max = +this.attr("max-moves", set.length * 2 + 4);
      let open = [], found = 0, moves = 0, lock = false;
      const cols = deck.length > 12 ? 4 : deck.length > 8 ? 4 : 3;
      this.root.innerHTML = `<style>${BASE_CSS}
        .grid{display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;margin:14px 0}
        .c{aspect-ratio:1;border-radius:14px;font-size:clamp(1.4rem,6vw,2rem);padding:0;background:var(--p);color:transparent;transition:transform .25s,background .25s}
        .c[aria-pressed="true"],.c.ok{background:#fff;color:inherit;box-shadow:inset 0 0 0 3px var(--p);transform:rotateY(180deg)}
        .c.ok{box-shadow:inset 0 0 0 3px var(--a)}
        .stats{display:flex;justify-content:center;gap:18px;font:600 .9rem "JetBrains Mono",monospace;opacity:.8}
      </style>
      <div class="box"><h3>${esc(this.attr("title", L === TXT.en ? "Match the pairs" : "Găsește perechile"))}</h3>
        <div class="stats"><span>${L.moves}: <b class="mv">0</b>/${max}</span><span>${L.pairs}: <b class="pr">0</b>/${set.length}</span></div>
        <div class="grid">${deck.map((c, i) => `<button type="button" class="c" data-i="${i}" aria-pressed="false" aria-label="${L === TXT.en ? "Card" : "Carte"} ${i + 1}"><span>${c.v}</span></button>`).join("")}</div>
        <div class="result" role="status" aria-live="polite"></div></div>`;
      const out = this.root.querySelector(".result");
      if (this.used()) { this.root.querySelectorAll(".c").forEach(b => b.disabled = true); out.textContent = L.used; return; }
      this.root.querySelectorAll(".c").forEach(b => b.onclick = () => {
        if (lock || b.classList.contains("ok") || b.getAttribute("aria-pressed") === "true") return;
        b.setAttribute("aria-pressed", "true"); b.setAttribute("aria-label", deck[+b.dataset.i].v);
        open.push(b);
        if (open.length < 2) return;
        moves++; this.root.querySelector(".mv").textContent = moves;
        const [x, y] = open; open = [];
        if (deck[+x.dataset.i].v === deck[+y.dataset.i].v) {
          x.classList.add("ok"); y.classList.add("ok"); found++;
          this.root.querySelector(".pr").textContent = found;
          if (found === set.length) {
            if (moves <= max) {
              const code = this.attr("code", "MEMORY10");
              out.innerHTML = `${L.memWin}<br>${this.codeHTML(code)}`; this.bindCopy(); this.win("memory", code);
            } else {
              out.innerHTML = `${L.memLose} <button type="button" class="ghost rs">${L.restart}</button>`;
              this.root.querySelector(".rs").onclick = () => this.render();
            }
          }
        } else {
          lock = true;
          setTimeout(() => { [x, y].forEach(c => { c.setAttribute("aria-pressed", "false"); c.setAttribute("aria-label", (L === TXT.en ? "Card " : "Carte ") + (+c.dataset.i + 1)); }); lock = false; }, reduced() ? 500 : 800);
        }
      });
    }
  }

  customElements.define("lw-spin-wheel", LwSpinWheel);
  customElements.define("lw-scratch-card", LwScratchCard);
  customElements.define("lw-quiz", LwQuiz);
  customElements.define("lw-memory", LwMemory);
})();
