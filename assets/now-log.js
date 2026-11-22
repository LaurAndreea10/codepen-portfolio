/* Older entries of the "Finalizat recent" and "Istoric" tabs live in data/now-log.json,
   so portfolio.html stays under its 150 KB budget. The newest entries stay inline;
   this script appends the rest once the page is idle. The content is the portfolio's own HTML.
   main.js re-renders both lists from a snapshot (on load and on language changes), so the
   archived entries are re-appended whenever a list is rebuilt without them. */
(function () {
  'use strict';
  var log = null, requested = false;
  var MARK = 'data-nowlog';

  function lists() {
    return {
      done: document.querySelector('#now-panel-done .now-checklist'),
      hist: document.querySelector('#now-panel-history .now-history')
    };
  }
  function apply() {
    if (!log) return;
    var l = lists();
    if (l.done && log.done && log.done.length && !l.done.querySelector('[' + MARK + ']')) {
      l.done.insertAdjacentHTML('beforeend', log.done.join(''));
      mark(l.done, log.done.length);
    }
    if (l.hist && log.history && log.history.length && !l.hist.querySelector('[' + MARK + ']')) {
      var more = l.hist.querySelector('.now-history-more');
      var html = log.history.join('');
      if (more) more.insertAdjacentHTML('beforebegin', html); else l.hist.insertAdjacentHTML('beforeend', html);
      mark(l.hist, log.history.length, more);
    }
  }
  // tag the appended nodes so a rebuilt list (which loses them) can be detected
  function mark(parent, n, before) {
    var kids = Array.prototype.slice.call(parent.children).filter(function (k) { return k !== before && !k.classList.contains('now-history-more'); });
    kids.slice(-n).forEach(function (k) { k.setAttribute(MARK, ''); });
  }
  function load() {
    if (requested) return; requested = true;
    fetch('data/now-log.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        log = data; apply();
        var l = lists();
        if ('MutationObserver' in window) {
          var mo = new MutationObserver(function () { apply(); });
          if (l.done) mo.observe(l.done, { childList: true });
          if (l.hist) mo.observe(l.hist, { childList: true });
        }
        document.dispatchEvent(new CustomEvent('nowlog:loaded'));
      })
      .catch(function () { /* the inline entries and the CHANGELOG link still work */ });
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#now-tab-done, #now-tab-history')) load();
  });
  function idle() { ('requestIdleCallback' in window) ? requestIdleCallback(load, { timeout: 3000 }) : setTimeout(load, 1500); }
  if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle);
})();
