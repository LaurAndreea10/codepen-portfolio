/*! GameKit v1.0.0 — starter pentru jocuri de browser · Laura Andreea · MIT
 *  Extras din jocurile mele de la CodePen Challenges. Fără dependențe, un singur fișier.
 *  Module: loop (pas fix), input (tastatură, pointer, butoane tactile), i18n (RO/EN),
 *  save (localStorage versionat), audio (Web Audio), a11y (mișcare redusă, anunțuri), hud.
 */
(function (global) {
  "use strict";

  /* ---------- loop cu pas fix + pauză automată când tabul e ascuns ---------- */
  function createLoop({ update, render, fps = 60 }) {
    const step = 1000 / fps;
    let acc = 0, last = 0, raf = 0, running = false;
    function frame(now) {
      if (!running) return;
      acc += Math.min(250, now - (last || now)); last = now;
      while (acc >= step) { update(step / 1000); acc -= step; }
      render(acc / step);
      raf = requestAnimationFrame(frame);
    }
    const loop = {
      start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); },
      stop() { running = false; cancelAnimationFrame(raf); },
      get running() { return running; }
    };
    document.addEventListener("visibilitychange", () => { if (document.hidden && running) { loop.stop(); loop.pausedByTab = true; } });
    return loop;
  }

  /* ---------- input: acțiuni mapate pe taste, pointer și butoane on-screen ---------- */
  function createInput(map = { left: ["ArrowLeft", "KeyA"], right: ["ArrowRight", "KeyD"], up: ["ArrowUp", "KeyW"], down: ["ArrowDown", "KeyS"], action: ["Space", "Enter"], pause: ["KeyP", "Escape"] }) {
    const down = new Set(), pressed = new Set();
    const byKey = {};
    Object.entries(map).forEach(([act, keys]) => keys.forEach(k => (byKey[k] = act)));
    const onDown = e => {
      const a = byKey[e.code]; if (!a) return;
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code) && e.target === document.body) e.preventDefault();
      if (!down.has(a)) pressed.add(a); down.add(a);
    };
    const onUp = e => { const a = byKey[e.code]; if (a) down.delete(a); };
    addEventListener("keydown", onDown); addEventListener("keyup", onUp);
    addEventListener("blur", () => down.clear());
    const pointer = { x: 0, y: 0, down: false };
    return {
      isDown: a => down.has(a),
      wasPressed: a => pressed.has(a),
      endFrame() { pressed.clear(); },
      pointer,
      /** Leagă un element canvas: pointer.x/y în coordonatele canvas-ului */
      bindPointer(canvas) {
        const pos = e => { const r = canvas.getBoundingClientRect(); pointer.x = (e.clientX - r.left) * ((+canvas.dataset.w || canvas.width) / r.width); pointer.y = (e.clientY - r.top) * ((+canvas.dataset.h || canvas.height) / r.height); };
        canvas.addEventListener("pointerdown", e => { pos(e); pointer.down = true; pressed.add("pointer"); });
        canvas.addEventListener("pointermove", pos);
        addEventListener("pointerup", () => (pointer.down = false));
      },
      /** Butoane tactile: <button data-gk-action="left"> */
      bindButtons(root = document) {
        root.querySelectorAll("[data-gk-action]").forEach(b => {
          const a = b.dataset.gkAction;
          b.addEventListener("pointerdown", e => { e.preventDefault(); if (!down.has(a)) pressed.add(a); down.add(a); });
          ["pointerup", "pointerleave", "pointercancel"].forEach(ev => b.addEventListener(ev, () => down.delete(a)));
          b.addEventListener("click", e => { if (e.detail === 0) { pressed.add(a); } });
        });
      }
    };
  }

  /* ---------- i18n RO/EN pe data-i18n ---------- */
  function createI18n(dict, key = "gk-lang") {
    let lang;
    try { lang = localStorage.getItem(key); } catch (e) {}
    lang = lang || ((navigator.language || "ro").startsWith("ro") ? "ro" : "en");
    const api = {
      get lang() { return lang; },
      t(k, vars = {}) { const s = (dict[lang] && dict[lang][k]) ?? (dict.ro && dict.ro[k]) ?? k; return s.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? ""); },
      apply(root = document) {
        document.documentElement.lang = lang;
        root.querySelectorAll("[data-i18n]").forEach(el => (el.textContent = api.t(el.dataset.i18n)));
        root.querySelectorAll("[data-i18n-label]").forEach(el => el.setAttribute("aria-label", api.t(el.dataset.i18nLabel)));
      },
      set(l) { lang = l; try { localStorage.setItem(key, l); } catch (e) {} api.apply(); }
    };
    return api;
  }

  /* ---------- salvare versionată ---------- */
  function createSave(name, version = 1, defaults = {}) {
    const key = `gk-save-${name}`;
    let data;
    try { const raw = JSON.parse(localStorage.getItem(key)); data = raw && raw.v === version ? raw.d : null; } catch (e) {}
    data = Object.assign({}, defaults, data || {});
    return {
      data,
      save() { try { localStorage.setItem(key, JSON.stringify({ v: version, d: data })); } catch (e) {} },
      reset() { data = Object.assign(this.data, defaults); this.save(); }
    };
  }

  /* ---------- audio: sunete generate, fără fișiere ---------- */
  function createAudio() {
    let ctx = null, muted = false;
    const ensure = () => { if (!ctx) { const C = global.AudioContext || global.webkitAudioContext; if (C) ctx = new C(); } if (ctx && ctx.state === "suspended") ctx.resume(); return ctx; };
    const tone = (freq = 440, dur = .1, type = "sine", vol = .15) => {
      if (muted) return; const c = ensure(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = vol;
      g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + dur);
      o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + dur);
    };
    return {
      tone,
      coin() { tone(880, .08, "square", .08); setTimeout(() => tone(1320, .1, "square", .08), 70); },
      hit() { tone(140, .2, "sawtooth", .12); },
      win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, .15, "triangle", .12), i * 110)); },
      get muted() { return muted; }, set muted(v) { muted = v; }
    };
  }

  /* ---------- accesibilitate ---------- */
  const a11y = {
    get reducedMotion() { return matchMedia("(prefers-reduced-motion: reduce)").matches; },
    /** Anunță un mesaj cititoarelor de ecran printr-o regiune aria-live */
    announce(msg) {
      let el = document.getElementById("gk-live");
      if (!el) { el = document.createElement("div"); el.id = "gk-live"; el.setAttribute("aria-live", "polite"); el.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"; document.body.appendChild(el); }
      el.textContent = ""; setTimeout(() => (el.textContent = msg), 30);
    }
  };

  /* ---------- HUD: legare simplă de elemente ---------- */
  function createHud(fields) {
    const els = {};
    Object.entries(fields).forEach(([k, sel]) => (els[k] = typeof sel === "string" ? document.querySelector(sel) : sel));
    return { set(k, v) { if (els[k] && els[k].textContent !== String(v)) els[k].textContent = v; } };
  }

  /* ---------- utilitare ---------- */
  const util = {
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    rand: (a, b) => a + Math.random() * (b - a),
    hit: (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < (a.r + b.r),
    /** Canvas clar pe ecrane retina */
    fitCanvas(canvas, w, h) { const d = Math.min(global.devicePixelRatio || 1, 2); canvas.width = w * d; canvas.height = h * d; canvas.dataset.w = w; canvas.dataset.h = h; const c = canvas.getContext("2d"); c.setTransform(d, 0, 0, d, 0, 0); return c; }
  };

  global.GameKit = { version: "1.0.0", createLoop, createInput, createI18n, createSave, createAudio, createHud, a11y, util };
})(typeof window !== "undefined" ? window : globalThis);
