/* Produse digitale — utilitare comune: temă, RO/EN, contrast, toast, copiere, descărcare, ZIP fără dependențe.
   Laura Andreea · MIT */
(() => {
  "use strict";
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem("pd-" + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("pd-" + k, v); } catch (e) {} }
  };

  /* ---------- temă / contrast ---------- */
  const theme = store.get("theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  root.dataset.theme = theme;
  if (store.get("contrast") === "high") root.dataset.contrast = "high";

  /* ---------- limbă ---------- */
  let lang = store.get("lang") === "en" ? "en" : "ro";
  const t = (ro, en) => (lang === "en" ? en : ro);

  function applyLang() {
    root.lang = lang;
    document.querySelectorAll("[data-en]").forEach(el => {
      if (el.dataset.ro === undefined) el.dataset.ro = el.innerHTML;
      el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.ro;
    });
    document.querySelectorAll("[data-en-placeholder]").forEach(el => {
      if (el.dataset.roPlaceholder === undefined) el.dataset.roPlaceholder = el.placeholder;
      el.placeholder = lang === "en" ? el.dataset.enPlaceholder : el.dataset.roPlaceholder;
    });
    document.querySelectorAll("[data-en-label]").forEach(el => {
      if (el.dataset.roLabel === undefined) el.dataset.roLabel = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", lang === "en" ? el.dataset.enLabel : el.dataset.roLabel);
    });
    if (document.body?.dataset.titleEn) {
      if (!document.body.dataset.titleRo) document.body.dataset.titleRo = document.title;
      document.title = lang === "en" ? document.body.dataset.titleEn : document.body.dataset.titleRo;
    }
    const lb = document.getElementById("langBtn");
    if (lb) { lb.textContent = lang === "en" ? "RO" : "EN"; lb.setAttribute("aria-label", lang === "en" ? "Schimbă în română" : "Switch to English"); }
    document.dispatchEvent(new CustomEvent("pd:lang", { detail: lang }));
  }

  function syncThemeBtn() {
    const b = document.getElementById("themeBtn");
    if (!b) return;
    const dark = root.dataset.theme === "dark";
    b.textContent = dark ? "☀" : "☾";
    b.setAttribute("aria-label", t(dark ? "Temă luminoasă" : "Temă întunecată", dark ? "Light theme" : "Dark theme"));
  }

  /* ---------- toast ---------- */
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (er) {}
      ta.remove();
    }
    toast(t("Copiat ✓", "Copied ✓"));
  }

  function download(name, data, type = "text/plain;charset=utf-8") {
    const blob = data instanceof Blob ? data : new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- ZIP (metoda STORE, fără compresie, fără dependențe) ---------- */
  const CRC_TABLE = (() => {
    const tbl = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      tbl[n] = c >>> 0;
    }
    return tbl;
  })();
  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }
  /** files: [{ name: "folder/file.txt", data: string | Uint8Array }] → Blob */
  function zip(files) {
    const enc = new TextEncoder();
    const parts = [], central = [];
    let offset = 0;
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    for (const f of files) {
      const nameBytes = enc.encode(f.name);
      const data = typeof f.data === "string" ? enc.encode(f.data) : f.data;
      const crc = crc32(data);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(6, 0x0800, true); // nume UTF-8
      local.setUint16(8, 0, true);
      local.setUint16(10, dosTime, true);
      local.setUint16(12, dosDate, true);
      local.setUint32(14, crc, true);
      local.setUint32(18, data.length, true);
      local.setUint32(22, data.length, true);
      local.setUint16(26, nameBytes.length, true);
      local.setUint16(28, 0, true);
      parts.push(new Uint8Array(local.buffer), nameBytes, data);

      const cd = new DataView(new ArrayBuffer(46));
      cd.setUint32(0, 0x02014b50, true);
      cd.setUint16(4, 20, true);
      cd.setUint16(6, 20, true);
      cd.setUint16(8, 0x0800, true);
      cd.setUint16(10, 0, true);
      cd.setUint16(12, dosTime, true);
      cd.setUint16(14, dosDate, true);
      cd.setUint32(16, crc, true);
      cd.setUint32(20, data.length, true);
      cd.setUint32(24, data.length, true);
      cd.setUint16(28, nameBytes.length, true);
      cd.setUint32(42, offset, true);
      central.push(new Uint8Array(cd.buffer), nameBytes);
      offset += 30 + nameBytes.length + data.length;
    }
    const cdSize = central.reduce((s, p) => s + p.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true);
    end.setUint16(10, files.length, true);
    end.setUint32(12, cdSize, true);
    end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: "application/zip" });
  }

  /* ---------- pornire ---------- */
  function init() {
    document.getElementById("themeBtn")?.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      store.set("theme", root.dataset.theme);
      syncThemeBtn();
      document.dispatchEvent(new CustomEvent("pd:theme", { detail: root.dataset.theme }));
    });
    document.getElementById("langBtn")?.addEventListener("click", () => {
      lang = lang === "en" ? "ro" : "en";
      store.set("lang", lang);
      applyLang(); syncThemeBtn();
    });
    const cb = document.getElementById("contrastBtn");
    if (cb) {
      cb.setAttribute("aria-pressed", String(root.dataset.contrast === "high"));
      cb.addEventListener("click", () => {
        const on = root.dataset.contrast !== "high";
        if (on) root.dataset.contrast = "high"; else delete root.dataset.contrast;
        cb.setAttribute("aria-pressed", String(on));
        store.set("contrast", on ? "high" : "normal");
      });
    }
    document.querySelectorAll("[data-copy-target]").forEach(b => b.addEventListener("click", () => {
      const el = document.querySelector(b.dataset.copyTarget);
      if (el) copy(el.value ?? el.textContent);
    }));
    document.querySelectorAll(".pd-year").forEach(el => { el.textContent = new Date().getFullYear(); });
    applyLang(); syncThemeBtn();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.PD = { t, get lang() { return lang; }, toast, copy, download, zip, crc32, esc, store };
})();
