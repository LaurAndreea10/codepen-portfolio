/* Growth Kit — shared theme + RO/EN switch. Pages call Growth.init({ onLang }) and use Growth.t(ro, en). */
(function () {
  'use strict';
  var ls = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var root = document.documentElement;
  var lang = ls.get('lg.lang', (navigator.language || 'ro').toLowerCase().indexOf('ro') === 0 ? 'ro' : 'en');
  var p = new URLSearchParams(location.search).get('lang');
  if (p === 'ro' || p === 'en') lang = p;
  var theme = ls.get('lg.theme', window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  var listeners = [];

  function t(ro, en) { return lang === 'ro' ? ro : en; }
  function num(n, d) {
    return Number(n).toLocaleString(lang === 'ro' ? 'ro-RO' : 'en-GB', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  }
  function applyTheme() {
    root.dataset.theme = theme;
    var b = document.getElementById('g-theme');
    if (b) { b.setAttribute('aria-label', t('Schimbă tema (acum: ' + (theme === 'dark' ? 'întunecată' : 'luminoasă') + ')', 'Switch theme (now: ' + theme + ')')); b.textContent = theme === 'dark' ? '☾' : '☀'; }
  }
  function applyLang() {
    root.lang = lang;
    var b = document.getElementById('g-lang');
    if (b) { b.textContent = lang === 'ro' ? 'EN' : 'RO'; b.setAttribute('aria-label', lang === 'ro' ? 'Switch to English' : 'Schimbă în română'); }
    document.querySelectorAll('[data-ro][data-en]').forEach(function (el) {
      var attr = el.dataset.attr;
      var v = lang === 'ro' ? el.dataset.ro : el.dataset.en;
      if (attr) el.setAttribute(attr, v); else el.textContent = v;
    });
    var tt = document.querySelector('meta[name="g-title"]');
    if (tt) document.title = lang === 'ro' ? tt.dataset.ro : tt.dataset.en;
    listeners.forEach(function (f) { f(lang); });
  }
  applyTheme();
  root.lang = lang;

  window.Growth = {
    t: t, num: num, ls: ls,
    get lang() { return lang; },
    init: function (opts) {
      if (opts && opts.onLang) listeners.push(opts.onLang);
      var tb = document.getElementById('g-theme'), lb = document.getElementById('g-lang');
      if (tb) tb.addEventListener('click', function () { theme = theme === 'dark' ? 'light' : 'dark'; ls.set('lg.theme', theme); applyTheme(); });
      if (lb) lb.addEventListener('click', function () { lang = lang === 'ro' ? 'en' : 'ro'; ls.set('lg.lang', lang); applyLang(); applyTheme(); });
      applyTheme(); applyLang();
    },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  };
})();
