/* Portfolio chapters + Now bar — 2026-10-14
   - Now bar: always-visible band under the navigation. It reads the same
     "În curs" list as the Jurnal section (#now-panel-active), so updating
     that list updates the band too.
   - Collection tabs: filter the three collections in chapter 03; "Toate"
     shows everything (default, nothing is hidden).
   The Alpis hero carousel is not touched here. */
(() => {
  'use strict';

  const isEn = () => document.documentElement.lang === 'en';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ROTATE_MS = 6000;

  const copy = () => isEn()
    ? { now: 'Now', empty: 'Working on the next priority', updated: d => d === 0 ? 'updated today' : d === 1 ? 'updated yesterday' : `updated ${d} days ago`, more: n => `+${n}` }
    : { now: 'Acum', empty: 'Pregătesc următoarea prioritate', updated: d => d === 0 ? 'actualizat azi' : d === 1 ? 'actualizat ieri' : `actualizat acum ${d} zile`, more: n => `+${n}` };

  /* ---------- Now bar ---------- */
  function initNowBar() {
    const bar = document.getElementById('nowbar');
    const trigger = document.getElementById('nowbarTrigger');
    const itemEl = document.getElementById('nowbarItem');
    const countEl = document.getElementById('nowbarCount');
    const panel = document.getElementById('nowbarPanel');
    const list = document.getElementById('nowbarList');
    const updatedEl = document.getElementById('nowbarUpdated');
    const label = bar && bar.querySelector('.nowbar-label');
    if (!bar || !trigger || !itemEl || !panel || !list) return;

    let items = [];
    let index = 0;
    let timer = null;
    let paused = false;

    function readItems() {
      const source = document.querySelectorAll('#now-panel-active .now-item');
      return [...source].map(li => {
        const strong = li.querySelector('strong');
        const body = li.querySelector('span:last-child') || li;
        return { title: (strong ? strong.textContent : body.textContent).trim(), html: body.innerHTML };
      }).filter(x => x.title);
    }

    function daysSince(iso) {
      const then = new Date(iso + 'T00:00:00');
      if (Number.isNaN(then.getTime())) return null;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return Math.max(0, Math.round((today - then) / 86400000));
    }

    function renderUpdated() {
      const time = document.getElementById('now-datetime');
      if (!updatedEl || !time) return;
      const d = daysSince(time.getAttribute('datetime') || '');
      updatedEl.textContent = d === null ? time.textContent.trim() : copy().updated(d);
    }

    function showItem(i, animate) {
      if (!items.length) {
        itemEl.textContent = copy().empty;
        if (countEl) countEl.textContent = '';
        return;
      }
      index = (i + items.length) % items.length;
      const apply = () => {
        itemEl.textContent = items[index].title;
        if (countEl) {
          countEl.textContent = reduceMotion.matches
            ? (items.length > 1 ? copy().more(items.length - 1) : '')
            : (items.length > 1 ? `${index + 1}/${items.length}` : '');
        }
        itemEl.classList.remove('is-fading');
      };
      if (animate && !reduceMotion.matches) {
        itemEl.classList.add('is-fading');
        setTimeout(apply, 350);
      } else {
        apply();
      }
    }

    function renderPanel() {
      list.innerHTML = '';
      items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = item.html;
        li.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
        list.appendChild(li);
      });
      if (!items.length) {
        const li = document.createElement('li');
        li.textContent = copy().empty;
        list.appendChild(li);
      }
    }

    function stop() { clearInterval(timer); timer = null; }
    function start() {
      stop();
      if (reduceMotion.matches || items.length < 2 || paused || document.hidden) return;
      timer = setInterval(() => showItem(index + 1, true), ROTATE_MS);
    }

    function refresh() {
      items = readItems();
      if (label) label.textContent = copy().now;
      renderUpdated();
      renderPanel();
      showItem(Math.min(index, Math.max(items.length - 1, 0)), false);
      // Screen readers get the full title on the button; rotation stays silent.
      trigger.setAttribute('aria-label', `${copy().now}: ${items.map(x => x.title).join('; ') || copy().empty}`);
      start();
    }

    function setOpen(open) {
      trigger.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      paused = open;
      open ? stop() : start();
    }

    trigger.addEventListener('click', () => setOpen(panel.hidden));
    panel.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', e => { if (!panel.hidden && !bar.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !panel.hidden) { setOpen(false); trigger.focus(); }
    });
    ['mouseenter', 'focusin'].forEach(ev => bar.addEventListener(ev, () => { paused = true; stop(); }));
    ['mouseleave', 'focusout'].forEach(ev => bar.addEventListener(ev, () => {
      if (!panel.hidden || bar.matches(':hover') || bar.contains(document.activeElement)) return;
      paused = false; start();
    }));
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', refresh);

    // main.js may rewrite the Now lists (and switches language) — follow it.
    const nowSection = document.getElementById('now');
    if (nowSection && 'MutationObserver' in window) {
      let pending = null;
      new MutationObserver(() => {
        clearTimeout(pending);
        pending = setTimeout(refresh, 120);
      }).observe(nowSection, { childList: true, subtree: true, characterData: true });
    }
    new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    refresh();
  }

  /* Keep the band directly under the sticky navigation (or at the top when
     the navigation scrolls away, as it does on mobile). */
  function initOffset() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;
    const update = () => {
      const sticky = getComputedStyle(topbar).position === 'sticky';
      document.documentElement.style.setProperty('--nowbar-top', sticky ? `${topbar.offsetHeight}px` : '0px');
    };
    update();
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(topbar);
    window.addEventListener('resize', update, { passive: true });
  }

  /* ---------- Collection tabs ---------- */
  function initCollectionTabs() {
    const tabs = [...document.querySelectorAll('#ch-colectii .collection-tab')];
    if (!tabs.length) return;
    const ids = tabs.map(t => t.dataset.collection).filter(id => id !== 'all');

    // Counts on the tabs follow the real cards, so they never go stale.
    const countIn = id => document.querySelectorAll(`#${id} .project-collection .project-card`).length;
    tabs.forEach(t => {
      const n = t.querySelector('.collection-tab-n');
      if (!n) return;
      const total = t.dataset.collection === 'all' ? ids.reduce((s, id) => s + countIn(id), 0) : countIn(t.dataset.collection);
      if (total) n.textContent = `· ${total}`;
    });

    function select(tab, focus) {
      const target = tab.dataset.collection;
      tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      ids.forEach(id => {
        const sec = document.getElementById(id);
        if (!sec) return;
        if (target === 'all' || target === id) sec.removeAttribute('data-collection-hidden');
        else sec.setAttribute('data-collection-hidden', '');
      });
      if (focus) tab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.tabIndex = tab.classList.contains('is-active') ? 0 : -1;
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', e => {
        const k = e.key;
        if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'Home' && k !== 'End') return;
        e.preventDefault();
        const next = k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : (i + (k === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        select(tabs[next], true);
      });
    });

    // A link straight to one collection (e.g. #crm-projects) always shows it.
    const reveal = () => {
      const id = location.hash.slice(1);
      if (ids.includes(id)) select(tabs.find(t => t.dataset.collection === 'all'), false);
    };
    window.addEventListener('hashchange', reveal);
    reveal();
  }

  /* The search/filter tool (portfolio-upgrades.js) belongs to the whole
     Colecții chapter: place it right under the tabs. */
  function placeDiscoveryTool() {
    const tool = document.getElementById('portfolio-tools');
    const head = document.querySelector('#ch-colectii .bento-chapter-head') || document.querySelector('#ch-colectii .collection-tabs');
    if (!tool || !head) return;
    let slot = document.getElementById('collections-tools-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'collections-tools-slot';
      slot.className = 'container';
      head.insertAdjacentElement('afterend', slot);
    }
    if (tool.parentElement !== slot) slot.appendChild(tool);
  }

  function init() {
    initOffset();
    initNowBar();
    initCollectionTabs();
    placeDiscoveryTool();
    // portfolio-upgrades.js may run after us.
    setTimeout(placeDiscoveryTool, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
