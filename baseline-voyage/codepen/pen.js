/* ==========================================================
   CHRONOSCROLL × Baseline Voyage · script.js · v3 (9 November 2026)
   The scroll effects themselves are pure CSS (animation-timeline).
   This file handles: language, settings & themes, the CSS lab,
   learning mode, passport, optional sound, sharing, and the
   legacy fallback (only when CSS can't do it natively).
   ========================================================== */
(() => {
  "use strict";
  const root = document.documentElement;
  // Snapshot of the untouched page, used by "Download complete HTML"
  const PRISTINE = "<!DOCTYPE html>\n" + root.outerHTML;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ---------- Storage (safe in private mode / sandboxed iframes) ---------- */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
  };

  /* ---------- Feature detection ---------- */
  const sup = (q) => { try { return CSS.supports(q); } catch { return false; } };
  const NATIVE = sup("animation-timeline: scroll()");
  const SCOPED = NATIVE && sup("timeline-scope: --a");
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Preferences ---------- */
  const THEMES = ["cosmic", "aurora", "observatory", "retro", "paper", "neon", "mono"];
  const MODES = ["full", "compact", "edu", "lite"];
  const DEFAULTS = { lang: "en", scheme: "dark", theme: "cosmic", mode: "full", cinema: false, fx: 1, fs: 1, calm: null, no3d: false, noparticles: false, contrast: false, explain: false, sound: false, sfx: 0.5, amb: 0.3, mute: false, fallback: false, static: false };
  let prefs = { ...DEFAULTS, ...(store.get("bv-prefs") || {}) };
  const params = new URLSearchParams(location.search);
  if (["en", "ro"].includes(params.get("lang"))) prefs.lang = params.get("lang");
  if (THEMES.includes(params.get("theme"))) prefs.theme = params.get("theme");
  const MODE_ALIAS = { learning: "edu", simple: "lite" };
  const urlMode = MODE_ALIAS[params.get("mode")] || params.get("mode");
  if (MODES.includes(urlMode)) prefs.mode = urlMode;
  if (["dark", "light"].includes(params.get("scheme"))) prefs.scheme = params.get("scheme");
  const savePrefs = () => store.set("bv-prefs", prefs);
  const isCalm = () => (prefs.calm === null ? mqReduce.matches : prefs.calm);
  const t = (en, ro) => (root.lang === "ro" ? ro : en);

  const LAST_AT_LOAD = store.get("bv-last"); // read before this visit overwrites it

  /* ---------- Passport ---------- */
  let passport = { stops: {}, crystals: {}, challenges: {}, lab: false, polyglot: false, stylist: false, pilot: false, ...(store.get("bv-passport") || {}) };
  const savePassport = () => { store.set("bv-passport", passport); renderPassport(); };

  const CHAPTERS = {
    intro: ["Intro", "Intro"], timeline: ["Timeline", "Cronologie"], universe: ["Universe", "Univers"],
    chrome: ["Chrome & Edge", "Chrome & Edge"], safari: ["Safari", "Safari"], firefox: ["Firefox", "Firefox"],
    gallery: ["Gallery", "Galerie"], remote: ["Named timelines", "Cronologii denumite"], lab: ["CSS lab", "Laborator CSS"],
    learn: ["Learn", "Învățare"], game: ["CHRONO PILOT", "CHRONO PILOT"], compat: ["Compatibility", "Compatibilitate"],
  };
  const chapterName = (id) => (CHAPTERS[id] ? t(...CHAPTERS[id]) : id);

  /* ---------- Toast ---------- */
  const toastEl = $(".toast");
  let toastTimer;
  function toast(msg, actions = [], ms = 3200) {
    clearTimeout(toastTimer);
    toastEl.replaceChildren();
    const span = document.createElement("span");
    span.textContent = msg;
    toastEl.append(span);
    actions.forEach(({ label, fn, primary }) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn--small" + (primary ? " btn--primary" : "");
      b.textContent = label;
      b.addEventListener("click", () => { toastEl.hidden = true; fn?.(); });
      toastEl.append(b);
    });
    toastEl.hidden = false;
    if (ms) toastTimer = setTimeout(() => { toastEl.hidden = true; }, ms);
  }

  /* ---------- Clipboard ---------- */
  async function copy(text, okMsg) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; }
    catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
    }
    if (ok) { toast(okMsg || t("Copied!", "Copiat!")); return; }
    // Clipboard blocked (e.g. sandboxed iframe): show the text so it can be copied by hand
    const box = $(".copy-fallback");
    const area = Object.assign(document.createElement("textarea"), { value: text, readOnly: true });
    area.setAttribute("aria-label", t("Text to copy", "Text de copiat"));
    box.replaceChildren(area);
    box.hidden = false;
    toast(t("Automatic copy is blocked here. The text is selected at the bottom of the page.", "Copierea automată e blocată aici. Textul e selectat jos în pagină."), [], 6000);
    area.focus(); area.select();
  }
  const pageUrl = () => location.href.split("#")[0];

  /* ---------- Split title letters (aria-safe) ---------- */
  $$(".split").forEach((el) => {
    const text = el.textContent;
    const n = text.length;
    el.innerHTML = `<span class="visually-hidden">${esc(text)}</span>` +
      [...text].map((ch, i) => {
        const d = ((i - (n - 1) / 2) / ((n - 1) / 2)).toFixed(3);
        const r = (0.25 + ((i * 37) % 10) / 13).toFixed(2);
        return `<span class="ch" aria-hidden="true" style="--d:${d};--r:${r}">${esc(ch)}</span>`;
      }).join("");
  });

  /* ---------- Explanations for each effect (learning mode) ---------- */
  const EXPLAIN = {
    universe: ["The section is 340vh tall with a sticky 3D stage. <code>view-timeline: --universe</code> drives a custom <code>&lt;angle&gt;</code> property per orbit, a <code>translateZ</code> tunnel, the tilt of the system, SVG <code>stroke-dashoffset</code> constellations and three light trails with separate <code>animation-range</code>s.",
      "Secțiunea are 340vh, cu o scenă 3D lipită (sticky). <code>view-timeline: --universe</code> conduce o proprietate <code>&lt;angle&gt;</code> pentru fiecare orbită, un tunel cu <code>translateZ</code>, înclinarea sistemului, constelații SVG cu <code>stroke-dashoffset</code> și trei trasee luminoase cu <code>animation-range</code> diferite."],
    chrome: ["The title zooms in with <code>view()</code> over <code>entry 0% cover 30%</code>. The paragraph is revealed by sliding a <code>background-clip: text</code> gradient. The five bars share one timeline but start at staggered <code>entry</code> offsets.",
      "Titlul crește cu <code>view()</code> pe intervalul <code>entry 0% cover 30%</code>. Paragraful se dezvăluie glisând un gradient cu <code>background-clip: text</code>. Cele cinci bare împart aceeași cronologie, dar pornesc decalat în faza <code>entry</code>."],
    safari: ["The dial needle reads the chapter's named timeline <code>--chap</code>, so it turns as long as the whole chapter crosses the screen. The page-turn before this chapter is a <code>rotateY</code> driven by the portal's <code>view-timeline</code>.",
      "Acul cadranului citește cronologia denumită a capitolului, <code>--chap</code>, deci se rotește cât timp tot capitolul traversează ecranul. Pagina întoarsă dinaintea capitolului e un <code>rotateY</code> condus de <code>view-timeline</code>-ul portalului."],
    firefox: ["The three engine dots use three different keyframes on the same timeline and range, so they converge at the same moment. The portal before uses <code>scale</code>, <code>rotate</code> and an animated <code>clip-path: inset()</code>.",
      "Cele trei puncte folosesc cadre-cheie diferite pe aceeași cronologie și același interval, deci se aliniază în același moment. Portalul dinainte folosește <code>scale</code>, <code>rotate</code> și un <code>clip-path: inset()</code> animat."],
    gallery: ["The scroller has <code>scroll-timeline: --gal inline</code>. The meter above lives outside it and reads <code>--gal</code> through <code>timeline-scope</code>. Each card uses <code>view(inline)</code>, a view timeline on the horizontal axis of its nearest scroller.",
      "Scrollerul are <code>scroll-timeline: --gal inline</code>. Indicatorul de deasupra e în afara lui și citește <code>--gal</code> prin <code>timeline-scope</code>. Fiecare card folosește <code>view(inline)</code>, o cronologie de vizibilitate pe axa orizontală a celui mai apropiat scroller."],
    remote: ["One timeline, many followers: the gauge, the bar and the planet all read <code>--mini</code>. They animate registered custom properties (<code>--g</code>, <code>--gx</code>) on a parent, and the children compute their transforms from them.",
      "O cronologie, mai mulți urmăritori: indicatorul, bara și planeta citesc toate <code>--mini</code>. Ele animă proprietăți personalizate înregistrate (<code>--g</code>, <code>--gx</code>) pe un părinte, iar copiii își calculează transformările din ele."],
    lab: ["The lab writes a real <code>&lt;style&gt;</code> element. What you copy is exactly what runs in the preview, just with a simpler selector.",
      "Laboratorul scrie un element <code>&lt;style&gt;</code> real. Ce copiezi e exact ce rulează în previzualizare, doar cu un selector mai simplu."],
    compat: ["Every scroll-driven rule sits inside <code>@supports (animation-timeline: scroll())</code> and behind <code>:root:not(.fb, .static)</code>, so the same stylesheet can be switched to fallback or static on demand.",
      "Fiecare regulă condusă de scroll stă în <code>@supports (animation-timeline: scroll())</code> și în spatele <code>:root:not(.fb, .static)</code>, deci aceeași foaie de stil poate trece la fallback sau static la cerere."],
  };
  Object.entries(EXPLAIN).forEach(([id, [en, ro]]) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const d = document.createElement("details");
    d.className = "explain";
    d.innerHTML = `<summary><span data-lang="en">How is this animated?</span><span data-lang="ro">Cum e animat?</span></summary><p><span data-lang="en">${en}</span><span data-lang="ro">${ro}</span></p>`;
    const anchor = id === "universe" ? $(".universe__caption", sec) : $(".chapter-head", sec);
    anchor.after(d);
  });

  /* ---------- Apply preferences ---------- */
  const settingsForm = $("#settings form");
  function apply() {
    root.lang = prefs.lang;
    root.dataset.theme = prefs.theme;
    root.dataset.scheme = prefs.scheme;
    root.dataset.mode = prefs.mode;
    const lite = prefs.mode === "lite";
    root.classList.toggle("lite", lite);
    root.classList.toggle("calm", isCalm());
    root.classList.toggle("no3d", prefs.no3d || lite);
    root.classList.toggle("noparticles", prefs.noparticles || lite);
    root.classList.toggle("contrast", prefs.contrast);
    root.classList.toggle("static", prefs.static);
    root.classList.toggle("fb", !NATIVE || prefs.fallback);
    root.classList.toggle("cinema", prefs.cinema && NATIVE && !prefs.fallback && !prefs.static && !isCalm());
    $$("[data-cinema]").forEach((b) => b.setAttribute("aria-pressed", String(prefs.cinema)));
    root.style.setProperty("--fx", prefs.fx);
    root.style.setProperty("--fs", prefs.fs);
    $$(".explain").forEach((d) => { if (prefs.explain || prefs.mode === "edu") d.open = true; });
    $$('[data-toggle="fallback"]').forEach((b) => b.setAttribute("aria-pressed", String(prefs.fallback)));
    $$('[data-toggle="static"]').forEach((b) => b.setAttribute("aria-pressed", String(prefs.static)));
    syncSettingsForm();
    renderTexts();
    Sound.update();
    requestUpdate();
  }

  function syncSettingsForm() {
    const f = settingsForm.elements;
    f.mode.value = prefs.mode;
    f.theme.value = prefs.theme;
    f.scheme.value = prefs.scheme;
    ["fx", "fs", "sfx", "amb"].forEach((k) => { f[k].value = prefs[k]; });
    f.calm.checked = isCalm();
    ["no3d", "noparticles", "contrast", "explain", "sound", "mute", "fallback", "static", "cinema"].forEach((k) => { f[k].checked = !!prefs[k]; });
    f.fallback.disabled = !NATIVE;
    $$("output[data-out]", settingsForm).forEach((o) => {
      const v = prefs[o.dataset.out];
      o.textContent = Math.round(v * 100) + "%";
    });
  }

  settingsForm.addEventListener("input", (e) => {
    const el = e.target;
    if (!el.name) return;
    const v = el.type === "checkbox" ? el.checked : el.type === "range" ? Number(el.value) : el.value;
    if ((el.name === "theme" || el.name === "scheme") && v !== prefs[el.name]) { passport.stylist = true; savePassport(); }
    prefs[el.name] = v;
    savePrefs();
    apply();
  });

  mqReduce.addEventListener?.("change", () => { if (prefs.calm === null) apply(); });

  /* ---------- Language toggle ---------- */
  $(".lang-toggle").addEventListener("click", () => {
    prefs.lang = prefs.lang === "en" ? "ro" : "en";
    passport.polyglot = true;
    savePrefs(); savePassport(); apply();
  });

  $('[data-action="scheme"]').addEventListener("click", () => {
    prefs.scheme = prefs.scheme === "dark" ? "light" : "dark";
    passport.stylist = true;
    savePrefs(); savePassport(); apply();
  });
  $('[data-action="guide"]').addEventListener("click", () => Tour.open());
  $$("[data-cinema]").forEach((b) => b.addEventListener("click", () => {
    prefs.cinema = !prefs.cinema;
    savePrefs(); apply();
    if (prefs.cinema && !root.classList.contains("cinema")) toast(t("Cinema mode needs native support and motion turned on.", "Modul cinema are nevoie de suport nativ și de mișcare activată."));
    $("#gallery").scrollIntoView({ behavior: "auto" });
  }));

  /* ---------- Dialogs ---------- */
  $$("[data-open]").forEach((b) => b.addEventListener("click", () => {
    const d = document.getElementById(b.dataset.open);
    if (d.id === "passport") renderPassport();
    d.showModal();
  }));
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  $('[data-action="reset"]').addEventListener("click", () => {
    ["bv-prefs", "bv-passport", "bv-last", "bv-tour"].forEach(store.del);
    prefs = { ...DEFAULTS };
    passport = { stops: {}, crystals: {}, challenges: {}, lab: false, polyglot: false, stylist: false };
    $$(".crystal").forEach((c) => c.classList.remove("is-found"));
    $$(".challenge").forEach((c) => { c.classList.remove("is-done"); $(".challenge__result", c).textContent = ""; });
    apply(); renderPassport();
    toast(t("Preferences reset.", "Preferințele au fost resetate."));
  });
  $('[data-action="tutorial"]').addEventListener("click", () => { $("#settings").close(); Tour.open(); });

  $$("[data-toggle]").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.toggle;
    if (k === "fallback" && !NATIVE) { toast(t("Your browser already uses the fallback.", "Browserul tău folosește deja fallbackul.")); return; }
    prefs[k] = !prefs[k];
    savePrefs(); apply();
  }));

  /* ---------- Texts that depend on language / support ---------- */
  const FEATURES = [
    ["animation-timeline: scroll()", () => sup("animation-timeline: scroll()")],
    ["animation-timeline: view()", () => sup("animation-timeline: view()")],
    ["animation-range", () => sup("animation-range: entry 0% exit 100%")],
    ["scroll-timeline", () => sup("scroll-timeline: --a block")],
    ["view-timeline", () => sup("view-timeline: --a block")],
    ["timeline-scope", () => sup("timeline-scope: --a")],
    ["view-timeline-inset", () => sup("view-timeline-inset: 10%")],
    ["@property", () => "registerProperty" in CSS],
    ["translate / rotate / scale", () => sup("translate: 1px")],
    ["clip-path", () => sup("clip-path: circle(10%)")],
    ["color-mix()", () => sup("color: color-mix(in srgb, red, blue)")],
    ["container queries", () => sup("container-type: inline-size")],
    [":has()", () => sup("selector(:has(a))")],
  ];
  const featureState = FEATURES.map(([name, test]) => [name, !!test()]);

  function renderTexts() {
    const pill = $(".support-pill");
    pill.hidden = false;
    const simulated = NATIVE && prefs.fallback;
    pill.dataset.mode = NATIVE && !simulated ? "native" : "fallback";
    pill.textContent = prefs.static ? t("■ Static mode", "■ Mod static")
      : simulated ? t("↺ Simulated fallback", "↺ Fallback simulat")
      : NATIVE ? t("✓ Native scroll-driven animations", "✓ Animații native conduse de scroll")
      : t("↺ Fallback mode · IntersectionObserver", "↺ Mod fallback · IntersectionObserver");

    $(".you-status").textContent = NATIVE
      ? t("✓ Yes! Every scroll effect here is driven by CSS animation-timeline, with no scroll listeners.", "✓ Da! Fiecare efect de scroll de aici e condus de CSS animation-timeline, fără listeneri de scroll.")
      : t("↺ Not yet. You're seeing a JavaScript fallback. Update your browser for the native version.", "↺ Încă nu. Vezi un fallback în JavaScript. Actualizează browserul pentru versiunea nativă.");

    const msg = $("[data-compat-message]");
    msg.textContent = prefs.static ? t("Static mode is on: no animations, all content stays readable.", "Modul static e activ: fără animații, tot conținutul rămâne lizibil.")
      : simulated ? t("Fallback simulation is on: the native CSS is switched off and script.js takes over.", "Simularea fallbackului e activă: CSS-ul nativ e oprit și preia script.js.")
      : SCOPED ? t("Full native support: animation-timeline and timeline-scope both work here.", "Suport nativ complet: aici funcționează și animation-timeline, și timeline-scope.")
      : NATIVE ? t("Native animation-timeline works; timeline-scope is missing, so the remote-controlled parts use a small script.", "animation-timeline nativ funcționează; lipsește timeline-scope, așa că părțile telecomandate folosesc un script mic.")
      : t("No native animation-timeline: you see the IntersectionObserver fallback. Everything stays readable.", "Fără animation-timeline nativ: vezi fallbackul cu IntersectionObserver. Totul rămâne lizibil.");

    const yes = t("✓ supported", "✓ suportat"), no = t("✕ missing", "✕ lipsește");
    $("[data-compat-rows]").innerHTML = featureState.map(([n, ok]) => `<tr><td>${esc(n)}</td><td class="${ok ? "yes" : "no"}">${ok ? yes : no}</td></tr>`).join("") +
      `<tr><td>prefers-reduced-motion</td><td>${mqReduce.matches ? t("reduce (respected)", "reduce (respectat)") : t("no preference", "fără preferință")}</td></tr>`;
    $("[data-live-support]").innerHTML = featureState.slice(0, 6).map(([n, ok]) => `<li class="${ok ? "yes" : "no"}">${ok ? "✓" : "✕"} ${esc(n)}</li>`).join("");

    Lab.render();
    renderPassport();
    Gallery.count();
    Tour.render();
    if (typeof Pilot !== "undefined") Pilot.refresh();
  }

  /* ---------- Copy buttons ---------- */
  $$(".copy-link").forEach((b) => b.addEventListener("click", () => {
    copy(`${pageUrl()}#${b.dataset.link}`, t("Chapter link copied.", "Linkul capitolului a fost copiat."));
  }));
  $$(".copy-code").forEach((b) => b.addEventListener("click", () => {
    const code = b.dataset.copy ? $(b.dataset.copy) : $("pre code", b.closest(".card, .code-panel"));
    copy(code.textContent, t("Code copied.", "Codul a fost copiat."));
  }));
  $("[data-share]").addEventListener("click", () => copy(pageUrl(), t("Page link copied.", "Linkul paginii a fost copiat.")));

  /* ==========================================================
     CSS LAB
     ========================================================== */
  const EASES = ["linear", "ease-in-out", "ease-out", "cubic-bezier(.3,1.6,.6,1)", "steps(5)"];
  const PHASES = ["entry", "cover", "contain", "exit"];
  const LAB_DEFAULT = { tl: "view", axis: "block", rs: "entry", rsp: 0, re: "cover", rep: 50, ease: "linear", op: 0, dist: 80, rot: 0, scale: 0.6 };

  const Lab = (() => {
    const form = $(".lab__controls");
    const preview = $(".lab-preview");
    const scroller = $(".lab-preview__scroller");
    const styleEl = document.createElement("style");
    styleEl.id = "lab-style";
    document.head.append(styleEl);
    let state = { ...LAB_DEFAULT };
    let n = 0;

    // ?lab=view,block,entry,0,cover,50,0,0,80,0,0.6  (ease = index)
    const fromParam = (s) => {
      const p = (s || "").split(",");
      if (p.length !== 11) return null;
      const num = (v, a, b, d) => { const x = Number(v); return Number.isFinite(x) ? clamp(x, a, b) : d; };
      return {
        tl: ["scroll", "named"].includes(p[0]) ? p[0] : "view", axis: p[1] === "inline" ? "inline" : "block",
        rs: PHASES.includes(p[2]) ? p[2] : "entry", rsp: num(p[3], 0, 100, 0),
        re: PHASES.includes(p[4]) ? p[4] : "cover", rep: num(p[5], 0, 100, 50),
        ease: EASES[num(p[6], 0, EASES.length - 1, 0) | 0], op: num(p[7], 0, 1, 0), dist: num(p[8], 0, 200, 80),
        rot: num(p[9], -360, 360, 0), scale: num(p[10], 0, 2, 0.6),
      };
    };
    const toParam = () => [state.tl, state.axis, state.rs, state.rsp, state.re, state.rep, EASES.indexOf(state.ease), state.op, state.dist, state.rot, state.scale].join(",");
    state = { ...state, ...(fromParam(params.get("lab")) || {}) };

    const isScrollType = () => state.tl !== "view";
    const css = (sel, name, scrollerSel) => {
      const tl = state.tl === "view" ? `view(${state.axis})` : state.tl === "named" ? "--sandbox" : `scroll(nearest ${state.axis})`;
      const range = state.tl === "view" ? `${state.rs} ${state.rsp}% ${state.re} ${state.rep}%` : `${state.rsp}% ${state.rep}%`;
      const tr = state.axis === "block" ? `0 ${state.dist}px` : `${state.dist}px 0`;
      const scroller = state.tl === "named" ? `${scrollerSel} {\n  overflow: auto;\n  scroll-timeline: --sandbox ${state.axis};\n}\n\n` : "";
      return `${scroller}${sel} {\n  animation: ${name} ${state.ease} both;\n  animation-timeline: ${tl};\n  animation-range: ${range};\n}\n\n@keyframes ${name} {\n  from {\n    opacity: ${state.op};\n    translate: ${tr};\n    rotate: ${state.rot}deg;\n    scale: ${state.scale};\n  }\n  to {\n    opacity: 1;\n    translate: 0 0;\n    rotate: 0deg;\n    scale: 1;\n  }\n}`;
    };
    const highlight = (code) => esc(code)
      .replace(/^(\s*)([a-z-]+)(:)/gm, '$1<span class="tok-p">$2</span>$3')
      .replace(/(?<![\w.-])(-?\d*\.?\d+)(px|deg|%)?/g, '<span class="tok-n">$1$2</span>');

    function write() {
      const f = form.elements;
      f.tl.value = state.tl; f.axis.value = state.axis; f.rs.value = state.rs; f.re.value = state.re;
      f.rsp.value = state.rsp; f.rep.value = state.rep; f.ease.value = state.ease;
      f.op.value = state.op; f.dist.value = state.dist; f.rot.value = state.rot; f.scale.value = state.scale;
    }
    function read() {
      const f = form.elements;
      state = {
        tl: f.tl.value, axis: f.axis.value, rs: f.rs.value, rsp: +f.rsp.value, re: f.re.value, rep: +f.rep.value,
        ease: f.ease.value, op: +f.op.value, dist: +f.dist.value, rot: +f.rot.value, scale: +f.scale.value,
      };
      // keep the range valid: the end can't come before the start on the same phase
      const same = state.tl !== "view" || state.rs === state.re;
      const order = PHASES.indexOf(state.re) - PHASES.indexOf(state.rs);
      if (same && state.rep <= state.rsp) { state.rep = Math.min(100, state.rsp + 5); if (state.rep <= state.rsp) state.rsp = state.rep - 5; f.rep.value = state.rep; f.rsp.value = state.rsp; }
      else if (state.tl === "view" && order < 0 && !(state.rs === "contain" && state.re === "cover")) { state.re = state.rs; f.re.value = state.re; if (state.rep <= state.rsp) { state.rep = Math.min(100, state.rsp + 5); f.rep.value = state.rep; } }
    }
    function render() {
      const f = form.elements;
      const units = { rsp: "%", rep: "%", dist: "px", rot: "deg", op: "", scale: "" };
      $$("output[data-out]", form).forEach((o) => { o.textContent = state[o.dataset.out] + units[o.dataset.out]; });
      f.rs.disabled = f.re.disabled = isScrollType();
      $("[data-scroll-hint]").hidden = !isScrollType();
      preview.dataset.axis = state.axis;
      preview.dataset.tl = state.tl;
      $(".lab-preview__tag").textContent = state.tl === "scroll"
        ? t("controller: the scroller", "controler: scrollerul")
        : state.tl === "named" ? t("controller: --sandbox (named scroller)", "controler: --sandbox (scroller denumit)")
        : t("controller: the box in its scrollport", "controler: cutia în zona vizibilă");
      const name = `lab-anim-${++n}`;
      const names = `--lab-scroll ${state.axis}${state.tl === "named" ? `, --sandbox ${state.axis}` : ""}`;
      styleEl.textContent = `@supports (animation-timeline: view()) {
:root:not(.fb, .static) .lab-preview__scroller { scroll-timeline: ${names}; }
:root:not(.fb, .static) ${css(".lab-preview .lab-subject", name, ".lab-preview__scroller").replace(/^\.lab-preview__scroller \{[\s\S]*?\}\n\n/, "")}
}
@supports (timeline-scope: --a) and (animation-timeline: view()) {
:root:not(.fb, .static) .lab-preview { timeline-scope: --lab-scroll; }
:root:not(.fb, .static) .lab-readout i { animation: grow-x linear both; animation-timeline: --lab-scroll; }
}`;
      $("#lab-code").innerHTML = highlight(css(".box", "reveal", ".scroller"));
      const what = [state.op < 1 && t("fades in", "apare treptat"), state.dist && t(`travels ${state.dist}px`, `parcurge ${state.dist}px`), state.rot && t(`turns ${state.rot}°`, `se rotește ${state.rot}°`), state.scale !== 1 && t(`grows from ${state.scale}×`, `crește de la ${state.scale}×`)].filter(Boolean).join(", ") || t("does not change (all values neutral)", "nu se schimbă (toate valorile sunt neutre)");
      $("[data-lab-explain]").textContent = state.tl === "view"
        ? t(`The box ${what} while its visibility on the ${state.axis} axis goes from ${state.rs} ${state.rsp}% to ${state.re} ${state.rep}%.`, `Cutia ${what} cât timp vizibilitatea ei pe axa ${state.axis} trece de la ${state.rs} ${state.rsp}% la ${state.re} ${state.rep}%.`)
        : t(`The box ${what} while the preview scroller (${state.axis} axis${state.tl === "named" ? ", named --sandbox" : ""}) moves from ${state.rsp}% to ${state.rep}% of its scroll.`, `Cutia ${what} cât timp scrollerul previzualizării (axa ${state.axis}${state.tl === "named" ? ", denumit --sandbox" : ""}) trece de la ${state.rsp}% la ${state.rep}% din derulare.`);
      $(".lab__nosupport").hidden = !root.classList.contains("fb");
      fallbackFrame();
    }

    /* JS fallback for the preview: same math as the CSS, applied inline */
    const EASE_FN = {
      linear: (x) => x,
      "ease-in-out": (x) => x * x * (3 - 2 * x),
      "ease-out": (x) => 1 - Math.pow(1 - x, 3),
      "cubic-bezier(.3,1.6,.6,1)": (x) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
      "steps(5)": (x) => Math.min(1, Math.floor(x * 5) / 5),
    };
    const subject = $(".lab-subject");
    function phaseToCover(phase, pct, s, v) {
      const total = v + s, k = pct / 100;
      const span = { entry: [0, s], exit: [v, v + s], cover: [0, v + s], contain: s <= v ? [s, v] : [v, s] }[phase];
      return (span[0] + (span[1] - span[0]) * k) / total;
    }
    function fallbackFrame() {
      const fb = root.classList.contains("fb");
      const inline = state.axis === "inline";
      const max = inline ? scroller.scrollWidth - scroller.clientWidth : scroller.scrollHeight - scroller.clientHeight;
      const sp = max > 0 ? clamp((inline ? scroller.scrollLeft : scroller.scrollTop) / max) : 0;
      if (fb || !SCOPED) preview.style.setProperty("--lp", sp.toFixed(4));
      if (!fb || prefs.static) { subject.style.removeProperty("opacity"); subject.style.removeProperty("translate"); subject.style.removeProperty("rotate"); subject.style.removeProperty("scale"); return; }
      let p;
      if (isScrollType()) {
        p = (sp - state.rsp / 100) / Math.max(0.0001, (state.rep - state.rsp) / 100);
      } else {
        const v = inline ? scroller.clientWidth : scroller.clientHeight;
        const s = inline ? subject.offsetWidth : subject.offsetHeight;
        const pos = inline ? subject.offsetLeft - scroller.scrollLeft : subject.offsetTop - scroller.scrollTop;
        const cover = clamp((v - pos) / (v + s));
        const a = phaseToCover(state.rs, state.rsp, s, v), b = phaseToCover(state.re, state.rep, s, v);
        p = (cover - a) / Math.max(0.0001, b - a);
      }
      const e = (EASE_FN[state.ease] || EASE_FN.linear)(clamp(p));
      const k = 1 - e;
      subject.style.opacity = String(state.op + (1 - state.op) * e);
      subject.style.translate = inline ? `${state.dist * k}px 0` : `0 ${state.dist * k}px`;
      subject.style.rotate = `${state.rot * k}deg`;
      subject.style.scale = String(state.scale + (1 - state.scale) * e);
    }
    scroller.addEventListener("scroll", fallbackFrame, { passive: true });
    form.addEventListener("input", (e) => {
      const axisBefore = state.axis;
      read(); render();
      if (state.axis !== axisBefore) scroller.scrollTo(0, 0);
      if (!passport.lab) { passport.lab = true; savePassport(); }
      if (e.target.name) history.replaceState(null, "", `?${mergeParams({ lab: toParam() })}${location.hash}`);
    });
    form.addEventListener("submit", (e) => e.preventDefault());
    $('[data-lab="reset"]').addEventListener("click", () => { state = { ...LAB_DEFAULT }; write(); render(); scroller.scrollTo(0, 0); });
    $('[data-lab="start"]').addEventListener("click", () => scroller.scrollTo({ top: 0, left: 0, behavior: isCalm() ? "auto" : "smooth" }));
    $('[data-lab="end"]').addEventListener("click", () => scroller.scrollTo({ top: scroller.scrollHeight, left: scroller.scrollWidth, behavior: isCalm() ? "auto" : "smooth" }));
    $('[data-lab="share"]').addEventListener("click", () => copy(`${location.origin}${location.pathname}?${mergeParams({ lab: toParam() })}#lab`, t("Lab link copied with your settings.", "Linkul laboratorului a fost copiat cu setările tale.")));
    write();
    return { render, get state() { return state; } };
  })();

  function mergeParams(extra) {
    const p = new URLSearchParams(location.search);
    Object.entries(extra).forEach(([k, v]) => p.set(k, v));
    return p.toString();
  }

  /* ---------- Challenges ---------- */
  const CHECKS = {
    1: (s) => s.tl !== "view" && s.rsp >= 50 && s.rep > s.rsp,
    2: (s) => s.tl === "view" && s.axis === "inline" && Math.abs(s.rot) >= 180,
    3: (s) => s.tl === "view" && s.rs === "exit" && s.re === "exit" && s.rep > s.rsp,
  };
  const HINTS = {
    1: ["Pick scroll() (or --sandbox) and move Start to 50% or more.", "Alege scroll() (sau --sandbox) și mută Începutul la 50% sau mai mult."],
    2: ["Pick view(), the inline axis and a rotation of ±180° or more.", "Alege view(), axa inline și o rotație de ±180° sau mai mult."],
    3: ["Set both Start and End to exit, with End greater than Start.", "Pune Început și Sfârșit pe exit, cu Sfârșitul mai mare decât Începutul."],
  };
  function markChallenge(id) {
    const li = $(`[data-challenge="${id}"]`);
    li.classList.add("is-done");
    $(".challenge__result", li).textContent = t("✓ Solved! Scroll the preview to see it.", "✓ Rezolvat! Derulează previzualizarea ca să vezi.");
  }
  $$("[data-check]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.check;
    if (CHECKS[id](Lab.state)) {
      passport.challenges[id] = true; savePassport(); markChallenge(id);
      $("#lab").scrollIntoView({ behavior: isCalm() ? "auto" : "smooth" });
    } else {
      $(".challenge__result", b.closest(".challenge")).textContent = "✕ " + t(...HINTS[id]);
    }
  }));

  /* ==========================================================
     GALLERY: buttons, keyboard, counter
     ========================================================== */
  const Gallery = (() => {
    const vp = $(".gallery__viewport");
    const cards = $$(".card", vp);
    const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle($(".track", vp)).columnGap || 16);
    const go = (dir) => {
      if (root.classList.contains("cinema")) { scrollBy({ top: dir * innerHeight * 0.4, behavior: isCalm() ? "auto" : "smooth" }); return; }
      vp.scrollBy({ left: dir * step(), behavior: isCalm() ? "auto" : "smooth" });
    };
    $('[data-gal="prev"]').addEventListener("click", () => go(-1));
    $('[data-gal="next"]').addEventListener("click", () => go(1));
    vp.addEventListener("keydown", (e) => {
      const map = { ArrowRight: 1, ArrowLeft: -1 };
      if (map[e.key]) { e.preventDefault(); go(map[e.key]); }
      if (e.key === "Home") { e.preventDefault(); vp.scrollTo({ left: 0 }); }
      if (e.key === "End") { e.preventDefault(); vp.scrollTo({ left: vp.scrollWidth }); }
    });
    function count() {
      if (root.classList.contains("cinema")) {
        const r = $("#gallery").getBoundingClientRect();
        const prog = clamp(((-r.top / Math.max(1, r.height - innerHeight)) - 0.05) / 0.9);
        $(".gallery__count").textContent = `${Math.round(prog * (cards.length - 1)) + 1} / ${cards.length}`;
        return;
      }
      const max = vp.scrollWidth - vp.clientWidth;
      const i = max <= 0 ? 0 : vp.scrollLeft >= max - 2 ? cards.length - 1 : Math.min(cards.length - 1, Math.round(vp.scrollLeft / step()));
      $(".gallery__count").textContent = `${i + 1} / ${cards.length}`;
      if (needsScopeJS()) $(".gallery__meter").style.setProperty("--gm", max > 0 ? (vp.scrollLeft / max).toFixed(3) : 0);
    }
    vp.addEventListener("scroll", count, { passive: true });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((en) => en.isIntersecting && en.target.classList.add("is-in")), { root: vp, threshold: 0.4 });
      $$(".card__art", vp).forEach((a) => io.observe(a));
    }
    return { count };
  })();

  /* ---------- Remote demos fallback (no timeline-scope) ---------- */
  const needsScopeJS = () => !SCOPED || root.classList.contains("fb");
  const miniY = $(".mini__scroller"), miniX = $(".mini-x");
  const syncMini = () => {
    if (!needsScopeJS()) return;
    const gy = clamp(miniY.scrollTop / Math.max(1, miniY.scrollHeight - miniY.clientHeight));
    const fy = $(".followers:not(.followers--x)");
    fy.style.setProperty("--g", gy.toFixed(4)); fy.style.setProperty("--gp", Math.round(gy * 100));
    const gx = clamp(miniX.scrollLeft / Math.max(1, miniX.scrollWidth - miniX.clientWidth));
    $(".followers--x").style.setProperty("--gx", gx.toFixed(4));
  };
  miniY.addEventListener("scroll", syncMini, { passive: true });
  miniX.addEventListener("scroll", syncMini, { passive: true });

  /* ==========================================================
     PAGE FALLBACK + always-on chapter tracking
     ========================================================== */
  const chapters = $$(".chapter");
  const events = $$(".event");
  const badges = $$(".badge");
  const progressBar = $(".progress-bar"), ring = $(".ring"), year = $(".year"), timeline = $(".timeline"), journey = $(".journey");
  let ticking = false;
  function requestUpdate() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  const coverProgress = (el) => { const r = el.getBoundingClientRect(); return clamp((innerHeight - r.top) / (innerHeight + r.height)); };

  function update() {
    ticking = false;
    const fb = root.classList.contains("fb");
    if (fb) {
      const max = root.scrollHeight - innerHeight;
      const p = max > 0 ? clamp(scrollY / max) : 0;
      root.style.setProperty("--scroll", p.toFixed(4));
      progressBar.style.setProperty("--p", p.toFixed(4));
      ring.style.setProperty("--p", p.toFixed(4));
      ring.style.setProperty("--pct", Math.round(p * 100));
      const r = journey.getBoundingClientRect();
      const jp = clamp(-r.top / Math.max(1, r.height - innerHeight));
      timeline.style.setProperty("--jp", clamp(jp / 0.85).toFixed(4));
      year.style.setProperty("--year", jp < 0.12 ? 2023 : jp < 0.5 ? 2023 + Math.round(((jp - 0.12) / 0.38) * 2) : jp < 0.8 ? 2025 + Math.round((jp - 0.5) / 0.3) : 2026);
      $$(".chapter-progress i").forEach((i) => i.style.setProperty("--cp", clamp((coverProgress(i.closest(".chapter")) - 0.1) / 0.8).toFixed(3)));
      let best = null, bestD = Infinity;
      events.forEach((ev) => { const b = ev.getBoundingClientRect(); const d = Math.abs(b.top + b.height / 2 - innerHeight / 2); if (d < bestD && d < innerHeight * 0.35) { bestD = d; best = ev; } });
      events.forEach((ev) => ev.classList.toggle("is-current", ev === best));
    }
    if (root.classList.contains("cinema")) Gallery.count();
    if (needsScopeJS()) {
      events.slice(0, 3).forEach((ev, i) => badges[i].classList.toggle("is-lit", ev.getBoundingClientRect().top < innerHeight * 0.75));
      badges[3].classList.toggle("is-lit", events[2].getBoundingClientRect().top < innerHeight * 0.5);
      $$(".route a[data-stop]").forEach((a) => {
        const sec = document.getElementById(a.dataset.stop);
        a.classList.toggle("is-done", !!sec && sec.getBoundingClientRect().top < innerHeight * 0.5);
      });
      syncMini();
      Gallery.count();
    }
  }
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate);

  // Events reveal in fallback (classes are harmless in native mode)
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => en.isIntersecting && en.target.classList.add("is-in")), { threshold: 0.2 });
    events.forEach((e) => io.observe(e));
  } else events.forEach((e) => e.classList.add("is-in"));

  // Current chapter: route map, compact nav, passport stamps, resume, chimes
  let current = null;
  const setCurrent = (id) => {
    if (id === current) return;
    current = id;
    $$(".route a, .compact-nav a").forEach((a) => {
      const on = a.getAttribute("href") === `#${id}`;
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    if (!passport.stops[id]) { passport.stops[id] = true; savePassport(); }
    store.set("bv-last", id);
    Sound.chime(Object.keys(CHAPTERS).indexOf(id));
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((es) => es.forEach((en) => en.isIntersecting && setCurrent(en.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    chapters.forEach((c) => cio.observe(c));
  }

  /* ==========================================================
     PASSPORT + CRYSTALS
     ========================================================== */
  const BADGES = [
    ["explorer", "Explorer", "Explorator", () => visibleChapters().every((id) => passport.stops[id])],
    ["crystals", "Crystal hunter", "Vânător de cristale", () => Object.keys(passport.crystals).length >= 5],
    ["lab", "Lab rat", "Laborant", () => passport.lab],
    ["student", "Student", "Student", () => Object.keys(passport.challenges).length >= 3],
    ["polyglot", "Polyglot", "Poliglot", () => passport.polyglot],
    ["stylist", "Stylist", "Stilist", () => passport.stylist],
    ["pilot", "Time pilot", "Pilot temporal", () => passport.pilot],
  ];
  const visibleChapters = () => chapters.filter((c) => c.offsetParent !== null || getComputedStyle(c).display !== "none").map((c) => c.id);
  function renderPassport() {
    const stamps = $("[data-stamps]");
    if (!stamps) return;
    stamps.innerHTML = visibleChapters().map((id) => `<li class="${passport.stops[id] ? "is-on" : ""}">${passport.stops[id] ? "✓ " : "○ "}${esc(chapterName(id))}</li>`).join("");
    const found = Object.keys(passport.crystals).length;
    $("[data-crystal-count]").textContent = `${found}/5`;
    const earned = BADGES.filter((b) => b[3]());
    $("[data-badges]").innerHTML = BADGES.map(([, en, ro, test]) => `<li class="${test() ? "is-on" : ""}">${test() ? "★" : "☆"} ${esc(t(en, ro))}</li>`).join("");
    $("[data-passport-count]").textContent = earned.length;
  }
  $$(".crystal").forEach((c) => {
    if (passport.crystals[c.dataset.crystal]) c.classList.add("is-found");
    c.addEventListener("click", () => {
      if (passport.crystals[c.dataset.crystal]) return;
      passport.crystals[c.dataset.crystal] = true;
      c.classList.add("is-found");
      savePassport();
      Sound.chime(10);
      toast(t(`Time crystal found · ${Object.keys(passport.crystals).length}/5`, `Cristal temporal găsit · ${Object.keys(passport.crystals).length}/5`));
    });
  });
  Object.keys(passport.challenges).forEach(markChallenge);

  /* ==========================================================
     OPTIONAL SOUND (Web Audio, synthesized — no files)
     ========================================================== */
  const Sound = (() => {
    let ctx = null, amb = null;
    const NOTES = [392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1047];
    const on = () => prefs.sound && !prefs.mute;
    const ensure = () => {
      if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    };
    function chime(i) {
      if (!on() || !ctx || prefs.sfx <= 0) return;
      const now = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = NOTES[Math.max(0, i) % NOTES.length];
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.1 * prefs.sfx, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      o.connect(g).connect(ctx.destination);
      o.start(now); o.stop(now + 1.5);
    }
    function update() {
      if (!on()) { if (amb) { amb.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4); const a = amb; setTimeout(() => a.oscs.forEach((o) => o.stop()), 1500); amb = null; } return; }
      if (!ensure()) return;
      if (!amb) {
        const gain = ctx.createGain(); gain.gain.value = 0;
        const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 420;
        const lfo = ctx.createOscillator(), lfoGain = ctx.createGain();
        lfo.frequency.value = 0.07; lfoGain.gain.value = 160; lfo.connect(lfoGain).connect(filter.frequency);
        const oscs = [55, 82.4, 110.3].map((f, k) => { const o = ctx.createOscillator(); o.type = k === 2 ? "sine" : "triangle"; o.frequency.value = f; o.connect(filter); o.start(); return o; });
        lfo.start(); oscs.push(lfo);
        filter.connect(gain).connect(ctx.destination);
        amb = { gain, oscs };
      }
      amb.gain.gain.setTargetAtTime(0.05 * prefs.amb, ctx.currentTime, 0.6);
    }
    document.addEventListener("visibilitychange", () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend().catch(() => {}); else if (on()) ctx.resume().catch(() => {});
    });
    // Browsers only allow audio after a gesture: retry on the first interaction
    const unlock = () => { if (on()) update(); removeEventListener("pointerdown", unlock); removeEventListener("keydown", unlock); };
    addEventListener("pointerdown", unlock); addEventListener("keydown", unlock);
    return { chime, update };
  })();

  /* ==========================================================
     TUTORIAL (offered, never forced)
     ========================================================== */
  const Tour = (() => {
    const d = $("#tour");
    const STEPS = [
      ["↕", "You control time", "Tu controlezi timpul", "Scroll normally. The bar, the ring and the route map follow your progress; every effect is driven by CSS animation-timeline.", "Derulează normal. Bara, inelul și harta traseului îți urmăresc progresul; fiecare efect e condus de CSS animation-timeline."],
      ["◎", "Explore three engines", "Explorează cele trei motoare", "Pick a moon in the observatory or follow the timeline. Each chapter has a direct link you can copy.", "Alege o lună din observator sau urmează cronologia. Fiecare capitol are un link direct pe care îl poți copia."],
      ["--mini", "Remote control", "Telecomandă", "Scroll the small windows in “Named timelines”. The gauges outside follow their timelines, not the page.", "Derulează ferestrele mici din „Cronologii denumite”. Indicatorii din afară urmează cronologiile lor, nu pagina."],
      ["{ CSS }", "Experiment in the lab", "Experimentează în laborator", "Change the timeline, axis, range and keyframes. Copy the CSS, share it as a link, then solve the challenges.", "Schimbă cronologia, axa, intervalul și cadrele. Copiază CSS-ul, distribuie-l ca link, apoi rezolvă provocările."],
      ["◐", "Your comfort, your rules", "Confortul tău, regulile tale", "◐ switches dark/light. ⚙ Settings has 7 palettes, reduced motion, no 3D, contrast, text size and optional sound. Five crystals are hidden for your 🜨 passport.", "◐ comută întunecat/luminos. ⚙ Setările au 7 palete, mișcare redusă, fără 3D, contrast, mărimea textului și sunet opțional. Cinci cristale sunt ascunse pentru pașaportul 🜨."],
    ];
    let i = 0;
    function render() {
      if (!d) return;
      const s = STEPS[i];
      $("[data-tour-count]", d).textContent = `${i + 1} / ${STEPS.length}`;
      $("[data-tour-visual]", d).textContent = s[0];
      $("[data-tour-title]", d).textContent = t(s[1], s[2]);
      $("[data-tour-text]", d).textContent = t(s[3], s[4]);
      $('[data-tour="back"]', d).disabled = i === 0;
      $('[data-tour="next"] [data-lang="en"]', d).textContent = i === STEPS.length - 1 ? "Done" : "Next";
      $('[data-tour="next"] [data-lang="ro"]', d).textContent = i === STEPS.length - 1 ? "Gata" : "Înainte";
    }
    const close = () => { d.close(); store.set("bv-tour", true); };
    $('[data-tour="skip"]', d).addEventListener("click", close);
    $('[data-tour="back"]', d).addEventListener("click", () => { i = Math.max(0, i - 1); render(); });
    $('[data-tour="next"]', d).addEventListener("click", () => { if (i < STEPS.length - 1) { i++; render(); } else close(); });
    return { render, open() { i = 0; render(); d.showModal(); } };
  })();

  /* ==========================================================
     GAME · CHRONO PILOT
     The arena's transparent scroller is the joystick. In native
     mode CSS (animation-timeline: --pilot) moves the ship; the loop
     below only reads the same scroll progress for collisions.
     ========================================================== */
  const Pilot = (() => {
    const arena = $(".pilot-arena");
    if (!arena) return { refresh() {} };
    const canvas = $(".pilot-canvas", arena), ctx2d = canvas.getContext("2d");
    const scroller = $(".pilot-scroller", arena), layer = $(".pilot-ship-layer", arena);
    const overlay = $(".pilot-overlay", arena), live = $("[data-pilot-live]");
    const hud = { year: $('[data-hud="year"]'), score: $('[data-hud="score"]'), lives: $('[data-hud="lives"]'), msg: $('[data-hud="msg"]') };
    const pauseBtn = $('[data-pilot="pause"]'), startBtn = $('[data-pilot="start"]'), shareBtn = $('[data-pilot="share"]');
    const nameInput = $("#pilot-name");
    const STORY_SECONDS = 75, START_YEAR = 2023, END_YEAR = 2026.83;
    const MILESTONES = [
      { at: (2023.54 - START_YEAR) / (END_YEAR - START_YEAR), eng: "blink", en: "Chrome 115 ships scroll timelines!", ro: "Chrome 115 livrează cronologiile de scroll!" },
      { at: (2025.71 - START_YEAR) / (END_YEAR - START_YEAR), eng: "webkit", en: "Safari 26 joins!", ro: "Safari 26 se alătură!" },
      { at: (2026.75 - START_YEAR) / (END_YEAR - START_YEAR), eng: "gecko", en: "Firefox 159: catch the last engine!", ro: "Firefox 159: prinde ultimul motor!" },
    ];
    const ENG = ["blink", "webkit", "gecko"], ENG_LETTER = { blink: "B", webkit: "W", gecko: "G" };
    let W = 0, H = 0, dpr = 1, colors = {}, raf = 0, last = 0;
    let g = null; // game state
    let board = store.get("bv-pilot") || { story: [], daily: {}, endless: [] };

    const mode = () => $('input[name="pilot-mode"]:checked').value;
    const slow = () => $('input[name="pilot-slow"]').checked;
    const today = () => { const d = new Date(); return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`; };
    function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

    function readColors() {
      const cs = getComputedStyle(root);
      ["--text", "--muted", "--accent", "--accent2", "--blink", "--webkit", "--gecko", "--line", "--bg"].forEach((k) => { colors[k] = cs.getPropertyValue(k).trim(); });
    }
    function resize() {
      const r = arena.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
      if (!g || !g.running) draw();
    }
    const progress = () => { const max = scroller.scrollHeight - scroller.clientHeight; return max > 0 ? clamp(scroller.scrollTop / max) : 0.5; };
    const shipY = () => 0.08 + progress() * 0.84;
    // JS always writes --py; in native mode the CSS animation overrides it
    const syncShip = () => layer.style.setProperty("--py", progress().toFixed(4));
    scroller.addEventListener("scroll", syncShip, { passive: true });

    function centerShip() { scroller.scrollTop = (scroller.scrollHeight - scroller.clientHeight) / 2; syncShip(); }

    /* stars for the background (static when motion is reduced) */
    const stars = Array.from({ length: 70 }, (_, i) => ({ x: ((i * 97) % 100) / 100, y: ((i * 61) % 100) / 100, z: 0.3 + ((i * 13) % 10) / 14 }));

    function say(text) { live.textContent = text; }
    function flashMsg(text, ms = 1800) {
      hud.msg.textContent = text; hud.msg.classList.add("is-on");
      clearTimeout(flashMsg.t); flashMsg.t = setTimeout(() => hud.msg.classList.remove("is-on"), ms);
      say(text);
    }
    function renderHud() {
      if (!g) return;
      const yr = g.mode === "endless" ? START_YEAR + g.t / 25 : START_YEAR + g.p * (END_YEAR - START_YEAR);
      hud.year.textContent = g.mode === "endless" && yr > 2027 ? `∞ ${Math.floor(yr)}` : String(Math.floor(yr));
      hud.score.textContent = `${g.score}${g.combo > 1 ? ` ×${g.combo}` : ""}`;
      hud.lives.textContent = "♥".repeat(g.lives) + "♡".repeat(Math.max(0, 3 - g.lives));
      ENG.forEach((e) => $(`[data-eng="${e}"]`).classList.toggle("is-on", !!g.engines[e]));
      layer.classList.toggle("is-shield", g.shield);
      layer.classList.toggle("is-hurt", g.hurt > 0);
    }

    function newGame() {
      const m = mode();
      const seed = m === "daily" ? Number(today()) : (Math.random() * 1e9) | 0;
      g = { mode: m, rand: rng(seed), t: 0, p: 0, score: 0, combo: 1, lives: 3, shield: false, hurt: 0, objs: [], spawn: 0.8,
        engines: {}, milestone: 0, running: true, paused: false, over: false, shake: 0 };
      centerShip(); readColors(); renderHud();
      overlay.hidden = true;
      pauseBtn.disabled = false; pauseBtn.setAttribute("aria-pressed", "false");
      arena.focus({ preventScroll: true });
      flashMsg(t("2023 · Scroll to steer!", "2023 · Derulează ca să manevrezi!"));
      last = performance.now();
      cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
    }

    function speed() {
      const base = g.mode === "endless" ? 0.28 + Math.min(0.5, g.t / 160) : 0.28 + g.p * 0.22;
      return base * (slow() ? 0.7 : 1);
    }
    function spawn() {
      const r = g.rand, y = 0.1 + r() * 0.8, roll = r();
      if (roll < 0.46) g.objs.push({ kind: "flag", x: 1.08, y, r: 0.045 });
      else if (roll < 0.94) g.objs.push({ kind: "orb", eng: ENG[(r() * 3) | 0], x: 1.08, y, r: 0.032 });
      else g.objs.push({ kind: "shield", x: 1.08, y, r: 0.035 });
      // a second barrier at higher speeds, never closing the whole column
      if (g.p > 0.4 || g.t > 40) if (r() < 0.35) g.objs.push({ kind: "flag", x: 1.08 + 0.12, y: (y + 0.35 + r() * 0.3) % 0.85 + 0.08, r: 0.045 });
    }

    function hit(o) {
      if (o.kind === "orb") {
        const pts = 50 * g.combo; g.score += pts; g.combo = Math.min(5, g.combo + 1);
        Sound.chime(ENG.indexOf(o.eng) + 3);
      } else if (o.kind === "big") {
        g.score += 500; g.engines[o.eng] = true; Sound.chime(10);
        flashMsg(t(`★ ${o.eng.toUpperCase()} engine collected! +500`, `★ Motorul ${o.eng.toUpperCase()} adunat! +500`));
      } else if (o.kind === "shield") {
        g.shield = true; flashMsg(t("@supports shield ready", "Scut @supports activ"), 1200);
      } else if (o.kind === "flag") {
        if (g.hurt > 0) return false;
        if (g.shield) { g.shield = false; g.hurt = 0.8; flashMsg(t("Shield absorbed the hit", "Scutul a absorbit lovitura"), 1200); return true; }
        g.lives -= 1; g.combo = 1; g.hurt = 1.2;
        if (!isCalm() && prefs.fx > 0) g.shake = 0.25;
        say(t(`Hit! ${g.lives} lives left.`, `Lovit! Mai ai ${g.lives} vieți.`));
        if (g.lives <= 0) { end(false); }
      }
      return true;
    }

    function loop(now) {
      if (!g || !g.running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!g.paused) step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }
    function step(dt) {
      g.t += dt;
      if (g.mode !== "endless") g.p = Math.min(1, g.t / (STORY_SECONDS * (slow() ? 1.15 : 1)));
      g.hurt = Math.max(0, g.hurt - dt); g.shake = Math.max(0, g.shake - dt);
      // milestones (story / daily)
      const ms = MILESTONES[g.milestone];
      if (g.mode !== "endless" && ms && g.p >= ms.at) {
        g.objs.push({ kind: "big", eng: ms.eng, x: 1.1, y: 0.2 + g.rand() * 0.6, r: 0.05 });
        flashMsg(t(ms.en, ms.ro), 2200); g.milestone++;
      }
      g.spawn -= dt;
      if (g.spawn <= 0) { spawn(); g.spawn = Math.max(0.32, 0.75 - (g.mode === "endless" ? g.t / 200 : g.p * 0.35)) * (slow() ? 1.25 : 1); }
      const vx = speed() * dt, sy = shipY(), sx = 0.15, aspect = W / H;
      g.objs.forEach((o) => {
        o.x -= vx * (o.kind === "big" ? 0.8 : 1);
        const dx = (o.x - sx) * aspect, dy = o.y - sy;
        if (!o.done && Math.hypot(dx, dy) < o.r + 0.035) { if (hit(o)) o.done = true; }
      });
      g.objs = g.objs.filter((o) => o.x > -0.1 && !o.done);
      if (Math.floor(g.t) !== Math.floor(g.t - dt)) g.score += 10; // +10 per second survived
      if (g.mode !== "endless" && g.p >= 1 && g.running) end(true);
      renderHud();
    }

    function draw() {
      ctx2d.clearRect(0, 0, W, H);
      const sh = g && g.shake ? (Math.random() - 0.5) * 6 : 0;
      ctx2d.save(); ctx2d.translate(sh, 0);
      const moving = g && g.running && !g.paused && !isCalm() && !prefs.static;
      stars.forEach((s) => {
        const x = moving ? (((s.x - (g.t * 0.05 * s.z)) % 1) + 1) % 1 : s.x;
        ctx2d.globalAlpha = 0.25 + s.z * 0.4; ctx2d.fillStyle = colors["--text"] || "#fff";
        ctx2d.fillRect(x * W, s.y * H, 1.5 * s.z, 1.5 * s.z);
      });
      ctx2d.globalAlpha = 1;
      // year grid
      ctx2d.strokeStyle = colors["--line"] || "#335"; ctx2d.lineWidth = 1;
      for (let i = 1; i < 4; i++) { ctx2d.beginPath(); ctx2d.moveTo(0, (i * H) / 4); ctx2d.lineTo(W, (i * H) / 4); ctx2d.stroke(); }
      if (g) g.objs.forEach(drawObj);
      ctx2d.restore();
    }
    function drawObj(o) {
      const x = o.x * W, y = o.y * H, r = o.r * H;
      ctx2d.save();
      if (o.kind === "flag") {
        ctx2d.fillStyle = "#c2334d"; ctx2d.strokeStyle = "#ffd0d8"; ctx2d.lineWidth = 2;
        ctx2d.beginPath(); ctx2d.roundRect ? ctx2d.roundRect(x - r, y - r, r * 2, r * 2, 6) : ctx2d.rect(x - r, y - r, r * 2, r * 2); ctx2d.fill(); ctx2d.stroke();
        ctx2d.beginPath(); ctx2d.moveTo(x - r * .5, y - r * .5); ctx2d.lineTo(x + r * .5, y + r * .5); ctx2d.moveTo(x + r * .5, y - r * .5); ctx2d.lineTo(x - r * .5, y + r * .5); ctx2d.stroke();
      } else if (o.kind === "shield") {
        ctx2d.strokeStyle = colors["--accent2"]; ctx2d.lineWidth = 3;
        ctx2d.beginPath(); ctx2d.arc(x, y, r, 0, Math.PI * 2); ctx2d.stroke();
        ctx2d.fillStyle = colors["--accent2"]; ctx2d.font = `700 ${r}px ui-monospace, monospace`; ctx2d.textAlign = "center"; ctx2d.textBaseline = "middle"; ctx2d.fillText("@", x, y + 1);
      } else {
        const col = colors[`--${o.eng}`] || "#4fc3ff";
        const grad = ctx2d.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r);
        grad.addColorStop(0, "#ffffff"); grad.addColorStop(0.45, col); grad.addColorStop(1, "#0a1020");
        ctx2d.fillStyle = grad; ctx2d.beginPath(); ctx2d.arc(x, y, r, 0, Math.PI * 2); ctx2d.fill();
        if (o.kind === "big") { ctx2d.strokeStyle = colors["--accent2"]; ctx2d.lineWidth = 3; ctx2d.beginPath(); ctx2d.arc(x, y, r + 6, 0, Math.PI * 2); ctx2d.stroke(); }
        ctx2d.fillStyle = "#fff"; ctx2d.font = `700 ${r * (o.kind === "big" ? .7 : .9)}px ui-monospace, monospace`; ctx2d.textAlign = "center"; ctx2d.textBaseline = "middle";
        ctx2d.fillText(o.kind === "big" ? "★" : ENG_LETTER[o.eng], x, y + 1);
      }
      ctx2d.restore();
    }

    function setPause(v) {
      if (!g || !g.running) return;
      g.paused = v; pauseBtn.setAttribute("aria-pressed", String(v));
      if (v) showOverlay("pause"); else { overlay.hidden = true; last = performance.now(); arena.focus({ preventScroll: true }); }
    }
    function end(won) {
      g.running = false; g.over = true;
      const baseline = won && ENG.every((e) => g.engines[e]);
      if (baseline) g.score *= 2;
      if (won && g.mode !== "endless") { passport.pilot = true; savePassport(); }
      pauseBtn.disabled = true;
      g.result = { won, baseline };
      showOverlay("over");
      draw();
    }
    function showOverlay(screen) {
      overlay.dataset.screen = screen; overlay.hidden = false;
      const kicker = $('[data-ov="kicker"]', overlay), title = $('[data-ov="title"]', overlay), text = $('[data-ov="text"]', overlay), form = $('[data-ov="form"]', overlay);
      form.hidden = true; shareBtn.hidden = true;
      if (screen === "pause") {
        kicker.textContent = t("Paused", "Pauză");
        title.textContent = t("Time is frozen", "Timpul e înghețat");
        text.textContent = t("Press P, Escape or Start to continue.", "Apasă P, Escape sau Start ca să continui.");
        startBtn.querySelector('[data-lang="en"]').textContent = "Continue"; startBtn.querySelector('[data-lang="ro"]').textContent = "Continuă";
      } else if (screen === "over") {
        const { won, baseline } = g.result;
        kicker.textContent = `${t("Score", "Scor")} · ${g.score}`;
        title.textContent = baseline ? t("Baseline reached! ×2", "Baseline atins! ×2") : won ? t("You reached October 2026", "Ai ajuns în octombrie 2026") : t("Lost in time", "Pierdut în timp");
        text.textContent = baseline ? t("All three engines collected. animation-timeline is Baseline newly available.", "Toate cele trei motoare adunate. animation-timeline e Baseline newly available.")
          : won ? t("You missed at least one release orb. Catch all three for the ×2 bonus.", "Ai ratat cel puțin o orbită de lansare. Prinde-le pe toate trei pentru bonusul ×2.")
          : t("The flags won this time. Try “Slower speed” if you need more time to react.", "De data asta au câștigat flag-urile. Încearcă „Viteză redusă” dacă ai nevoie de mai mult timp de reacție.");
        form.hidden = !qualifies(g.score); shareBtn.hidden = false;
        nameInput.value = store.get("bv-pilot-name") || "";
        startBtn.querySelector('[data-lang="en"]').textContent = "Play again"; startBtn.querySelector('[data-lang="ro"]').textContent = "Joacă din nou";
        say(`${title.textContent}. ${kicker.textContent}.`);
        if (!form.hidden) setTimeout(() => nameInput.focus(), 50); else startBtn.focus();
      }
    }

    /* leaderboard (top 5 per mode; daily resets every day) */
    const list = (m) => (m === "daily" ? (board.daily[today()] || []) : board[m]) || [];
    function qualifies(score) { const l = list(g.mode); return score > 0 && (l.length < 5 || score > l[l.length - 1].score); }
    function saveScore() {
      if (!g || !g.over || g.saved || !qualifies(g.score)) return;
      const name = (nameInput.value || "Pilot").trim().slice(0, 12) || "Pilot";
      store.set("bv-pilot-name", name);
      const entry = { name, score: g.score, at: Date.now() };
      const l = [...list(g.mode), entry].sort((a, b) => b.score - a.score).slice(0, 5);
      if (g.mode === "daily") board.daily = { [today()]: l }; else board[g.mode] = l;
      store.set("bv-pilot", board); g.saved = entry.at;
      renderBoard();
    }
    function renderBoard() {
      const m = mode();
      $("[data-board-mode]").textContent = { story: t("Story", "Poveste"), daily: t("Daily", "Ziua"), endless: t("Endless", "Infinit") }[m];
      const el = $("[data-board]");
      el.replaceChildren(...list(m).map((e) => {
        const li = document.createElement("li");
        li.textContent = e.name;
        const s = document.createElement("span"); s.textContent = e.score; li.append(s);
        if (g && g.saved === e.at) li.classList.add("is-new");
        return li;
      }));
      if (!el.children.length) { const li = document.createElement("li"); li.className = "muted"; li.textContent = t("No scores yet. Be the first!", "Încă nu sunt scoruri. Fii primul!"); el.append(li); }
    }

    /* input */
    startBtn.addEventListener("click", () => {
      if (g && g.running && g.paused) { setPause(false); return; }
      if (g && g.over) saveScore();
      newGame();
    });
    pauseBtn.addEventListener("click", () => setPause(!(g && g.paused)));
    shareBtn.addEventListener("click", () => {
      saveScore();
      const label = { story: t("Story", "Poveste"), daily: `${t("Daily", "Ziua")} ${today()}`, endless: t("Endless", "Infinit") }[g.mode];
      copy(t(`I scored ${g.score} in CHRONO PILOT (${label}) · CHRONOSCROLL × Baseline Voyage by Laura Andreea #cpc-animation-timeline`, `Am făcut ${g.score} puncte în CHRONO PILOT (${label}) · CHRONOSCROLL × Baseline Voyage de Laura Andreea #cpc-animation-timeline`), t("Score copied.", "Scorul a fost copiat."));
    });
    nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); saveScore(); startBtn.focus(); } });
    nameInput.addEventListener("change", saveScore);
    $$('input[name="pilot-mode"]').forEach((r) => r.addEventListener("change", renderBoard));
    arena.addEventListener("keydown", (e) => {
      if (e.target === nameInput) return;
      const stepPx = (scroller.scrollHeight - scroller.clientHeight) * 0.12;
      if (["ArrowUp", "w", "W"].includes(e.key)) { e.preventDefault(); scroller.scrollBy({ top: -stepPx, behavior: isCalm() ? "auto" : "smooth" }); }
      else if (["ArrowDown", "s", "S"].includes(e.key)) { e.preventDefault(); scroller.scrollBy({ top: stepPx, behavior: isCalm() ? "auto" : "smooth" }); }
      else if (["p", "P", "Escape"].includes(e.key) && g && g.running) { e.preventDefault(); setPause(!g.paused); }
      else if (e.key === "Enter" && !overlay.hidden && e.target === arena) { e.preventDefault(); startBtn.click(); }
    });
    // auto-pause when the tab is hidden or the arena leaves the screen
    document.addEventListener("visibilitychange", () => { if (document.hidden) setPause(true); });
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => es.forEach((en) => { if (!en.isIntersecting && g && g.running && !g.paused) setPause(true); }), { threshold: 0.3 }).observe(arena);
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(arena); else addEventListener("resize", resize);

    resize(); centerShip(); renderBoard();
    return { refresh() { readColors(); renderBoard(); if (!g || !g.running) draw(); if (g && g.paused) showOverlay("pause"); if (g && g.over) showOverlay("over"); } };
  })();

  /* ==========================================================
     INIT
     ========================================================== */
  apply();
  update();
  syncMini();

  // Resume button in the hero (never a forced jump)
  const resumeTarget = LAST_AT_LOAD && LAST_AT_LOAD !== "intro" && document.getElementById(LAST_AT_LOAD);
  const resumeBtn = $("[data-resume]");
  function renderResume() {
    if (!resumeTarget || resumeTarget.offsetParent === null) { resumeBtn.hidden = true; return; }
    resumeBtn.hidden = false;
    resumeBtn.href = `#${LAST_AT_LOAD}`;
    $("[data-resume-name]").textContent = chapterName(LAST_AT_LOAD);
  }
  renderResume();
  $(".lang-toggle").addEventListener("click", renderResume);

  // Download the complete page as one HTML file
  $("[data-download]").addEventListener("click", () => {
    const blob = new Blob([PRISTINE], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "chronoscroll-baseline-voyage.html" });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast(t("Download started.", "Descărcarea a pornit."));
  });
  $("[data-copy-desc]").addEventListener("click", () => copy(t(
    "CHRONOSCROLL × Baseline Voyage, created 9 November 2026 by Laura Andreea. A scroll-driven voyage through the history of CSS animation-timeline: scroll(), view(), animation-range, named timelines and timeline-scope, a 3D universe, an interactive CSS lab, RO/EN, 7 palettes in dark/light and an accessible fallback. Created with AI assistance. #cpc-animation-timeline #codepenchallenge",
    "CHRONOSCROLL × Baseline Voyage, creat pe 9 noiembrie 2026 de Laura Andreea. O călătorie condusă de scroll prin istoria CSS animation-timeline: scroll(), view(), animation-range, cronologii denumite și timeline-scope, un univers 3D, un laborator CSS interactiv, RO/EN, 7 palete în dark/light și un fallback accesibil. Realizat cu asistență AI. #cpc-animation-timeline #codepenchallenge"
  ), t("CodePen description copied.", "Descrierea CodePen a fost copiată.")));

  // Offer the tour once (non-blocking); educational mode opens it directly
  setTimeout(() => {
    if (store.get("bv-tour")) return;
    if (prefs.mode === "edu") { Tour.open(); return; }
    toast(t("New here? A 5-step guide explains everything.", "Ești nou aici? Un ghid în 5 pași explică totul."), [
      { label: t("Start guide", "Pornește ghidul"), primary: true, fn: () => Tour.open() },
      { label: t("Not now", "Nu acum"), fn: () => store.set("bv-tour", true) },
    ], 9000);
  }, 1200);
})();
