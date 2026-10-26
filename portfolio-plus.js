/* Portfolio Plus — 2026-10-25
   Additive layer for portfolio.html and en/index.html. It changes nothing that
   already exists on the page; it only fills its own mount points:
     [data-plus-open="palette"]   → opens the Ctrl+K / "/" search over the whole catalogue
     [data-plus="arcade-pass"]    → Arcade Pass: games opened from here + achievements
     [data-plus="github-live"]    → live numbers from the public GitHub API
     .project-card (collections)  → small badges derived from the card's own text
   Data: data/catalog.json (built by scripts/build-catalog.mjs) + the cards on the page.
   Storage: localStorage only (this browser), always wrapped in try/catch. */
(() => {
  'use strict';

  const SCRIPT = document.currentScript;
  const BASE = new URL('.', SCRIPT && SCRIPT.src ? SCRIPT.src : location.href);
  const GH_USER = 'LaurAndreea10';
  const isEn = () => (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (_) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* private mode */ } },
    del(key) { try { localStorage.removeItem(key); } catch (_) { /* ignore */ } }
  };
  const norm = (s) => String(s || '').toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const abs = (href) => { try { return new URL(href, BASE).href; } catch (_) { return href; } };

  const COPY = {
    ro: {
      searchLabel: 'Caută în portofoliu', placeholder: 'Proiect, tehnologie, pagină…', close: 'Închide căutarea',
      cats: { all: 'Toate', game: 'Jocuri', crm: 'CRM', utility: 'Utilitare', ui: 'UI', challenge: 'Challenge', page: 'Pagini' },
      catTag: { game: 'Joc', crm: 'CRM', utility: 'Utilitar', ui: 'UI', challenge: 'Challenge', page: 'Pagină', section: 'Secțiune' },
      results: (n) => n === 1 ? '1 rezultat' : `${n} rezultate`, empty: 'Nimic găsit. Încearcă alt cuvânt sau altă categorie.',
      quick: 'Salturi rapide', played: 'jucat', external: 'se deschide în tab nou',
      hint: '<kbd>↑</kbd><kbd>↓</kbd> alegi · <kbd>Enter</kbd> deschizi · <kbd>Esc</kbd> închizi', loading: 'Se încarcă catalogul…',
      passTitle: 'Arcade Pass', passEmpty: 'Deschide un joc de aici și primul ștampilaj apare pe card.',
      passProgress: (a, b) => `${a} din ${b} jocuri deschise`, play: 'Joacă', playedLabel: 'Jucat ✓', reset: 'Resetează progresul',
      resetConfirm: 'Ștergi progresul Arcade Pass din acest browser?', unlocked: (n) => `Realizare deblocată: ${n}`,
      badges: 'Realizări', locked: 'blocată', unlockedShort: 'deblocată',
      ach: {
        first: ['Primul pas', 'Deschide primul joc'], explorer: ['Explorator', 'Deschide 5 jocuri diferite'],
        marathon: ['Maratonist', 'Deschide 10 jocuri diferite'], halloween: ['Sezonul Halloween', 'Toate cele 3 challenge-uri de Halloween'],
        athlete: ['Atlet', 'Toate cele 4 jocuri sportive'], complete: ['Arcade complet', 'Toate jocurile din pass']
      },
      gh: {
        title: 'Live din GitHub', repos: 'repo-uri publice', active: 'actualizate în ultimele 30 de zile', last: 'ultimul push',
        langs: 'Limbaje în repo-uri', recent: 'Actualizate recent', fail: 'GitHub nu răspunde acum (limita API publică). Codul e oricând pe', cached: 'date salvate',
        ago: (m) => m < 60 ? `acum ${Math.max(1, m)} min` : m < 1440 ? `acum ${Math.round(m / 60)} h` : Math.round(m / 1440) === 1 ? 'acum o zi' : `acum ${Math.round(m / 1440)} zile`, live: 'demo'
      }
    },
    en: {
      searchLabel: 'Search the portfolio', placeholder: 'Project, technology, page…', close: 'Close search',
      cats: { all: 'All', game: 'Games', crm: 'CRM', utility: 'Utilities', ui: 'UI', challenge: 'Challenge', page: 'Pages' },
      catTag: { game: 'Game', crm: 'CRM', utility: 'Utility', ui: 'UI', challenge: 'Challenge', page: 'Page', section: 'Section' },
      results: (n) => n === 1 ? '1 result' : `${n} results`, empty: 'Nothing found. Try another word or category.',
      quick: 'Quick jumps', played: 'played', external: 'opens in a new tab',
      hint: '<kbd>↑</kbd><kbd>↓</kbd> choose · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close', loading: 'Loading the catalogue…',
      passTitle: 'Arcade Pass', passEmpty: 'Open a game from here and the first stamp appears on its card.',
      passProgress: (a, b) => `${a} of ${b} games opened`, play: 'Play', playedLabel: 'Played ✓', reset: 'Reset progress',
      resetConfirm: 'Clear the Arcade Pass progress in this browser?', unlocked: (n) => `Achievement unlocked: ${n}`,
      badges: 'Achievements', locked: 'locked', unlockedShort: 'unlocked',
      ach: {
        first: ['First step', 'Open your first game'], explorer: ['Explorer', 'Open 5 different games'],
        marathon: ['Marathon', 'Open 10 different games'], halloween: ['Halloween season', 'All 3 Halloween challenges'],
        athlete: ['Athlete', 'All 4 sports games'], complete: ['Arcade complete', 'Every game in the pass']
      },
      gh: {
        title: 'Live from GitHub', repos: 'public repositories', active: 'updated in the last 30 days', last: 'last push',
        langs: 'Languages across repos', recent: 'Recently updated', fail: 'GitHub is not answering right now (public API limit). The code is always on', cached: 'saved data',
        ago: (m) => m < 60 ? `${Math.max(1, m)} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : Math.round(m / 1440) === 1 ? '1 day ago' : `${Math.round(m / 1440)} days ago`, live: 'demo'
      }
    }
  };
  const t = () => (isEn() ? COPY.en : COPY.ro);

  /* ---------- Shared live region ---------- */
  let liveRegion = null;
  function announce(msg) {
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.className = 'plus-sr';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = '';
    setTimeout(() => { liveRegion.textContent = msg; }, 60);
  }
  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'plus-toast';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    setTimeout(() => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 400); }, 3200);
    announce(msg);
  }

  /* =========================================================
     Arcade Pass
     ========================================================= */
  const GAMES = [
    { id: 'candy-route', icon: '🍬', ro: 'Candy Route', en: 'Candy Route', path: 'candy-route/', halloween: true },
    { id: 'kygo', icon: '🐩', ro: 'Kygo World', en: 'Kygo World', path: 'kygo-world/' },
    { id: 'pentarena', icon: '🏟️', ro: 'PentArena', en: 'PentArena', path: 'pentarena/', sport: true },
    { id: 'slidestorm', icon: '🌊', ro: 'SlideStorm Arena', en: 'SlideStorm Arena', path: 'slidestorm-arena/', sport: true },
    { id: 'puckpool', icon: '🎱', ro: 'Puck & Pool Arena', en: 'Puck & Pool Arena', path: 'puck-pool-arena/', sport: true },
    { id: 'basket', icon: '🏀', ro: 'BASKET VS AI', en: 'BASKET VS AI', url: 'https://laurandreea10.github.io/BASKET-VS-AI/', sport: true },
    { id: 'serpent', icon: '🐍', ro: 'Serpent Prism', en: 'Serpent Prism', path: 'serpent-prism/' },
    { id: 'odyssey', icon: '⛵', ro: 'Odyssey Quest', en: 'Odyssey Quest', path: 'odyssey-quest/' },
    { id: 'garden', icon: '🌱', ro: 'Grădina Curioasă', en: 'Curious Garden', path: 'curious-garden/', alt: ['https://gradina-curioasa.plugaru-laura10.chatgpt.site/'] },
    { id: 'culesul', icon: '🍎', ro: 'LIVADA: Culesul', en: 'LIVADA: The Harvest', path: 'livada/joc/' },
    { id: 'skydreams', icon: '☁️', ro: 'SkyDreams Portal', en: 'SkyDreams Portal', path: 'skydreams-portal/' },
    { id: 'growthquest', icon: '📈', ro: 'LaurAI Growth Quest', en: 'LaurAI Growth Quest', path: 'growth-quest/' },
    { id: 'trilink', icon: '🔗', ro: 'Tri-Link Quest', en: 'Tri-Link Quest', url: 'https://laurandreea10.github.io/Tri-Link-Quest/' },
    { id: 'loop', icon: '🌀', ro: 'LOOP — Cosmic Relay', en: 'LOOP — Cosmic Relay', url: 'https://laurandreea10.github.io/LOOP-Cosmic-Relay/' },
    { id: 'booscary', icon: '🎃', ro: 'Halloween BooScary', en: 'Halloween BooScary', path: 'booscary/', halloween: true },
    { id: 'ghosttalk', icon: '👻', ro: 'Ghost Talk', en: 'Ghost Talk', path: 'ghost-talk/', halloween: true },
    { id: 'pumpkin', icon: '⚖️', ro: 'Pumpkin Weigh-In', en: 'Pumpkin Weigh-In', path: 'pumpkin-weigh-in/', halloween: true }
  ];
  GAMES.forEach((g) => { g.href = g.url || abs(g.path); });
  const PASS_KEY = 'la-arcade-pass-v1';

  const pass = {
    read() { const s = store.get(PASS_KEY, null); return s && typeof s === 'object' && s.visited ? s : { visited: {}, unlocked: {} }; },
    write(s) { store.set(PASS_KEY, s); },
    count(s) { return GAMES.filter((g) => s.visited[g.id]).length; }
  };

  const ACHIEVEMENTS = [
    { id: 'first', icon: '⭐', test: (s) => pass.count(s) >= 1 },
    { id: 'explorer', icon: '🧭', test: (s) => pass.count(s) >= 5 },
    { id: 'marathon', icon: '🏃', test: (s) => pass.count(s) >= 10 },
    { id: 'halloween', icon: '🎃', test: (s) => GAMES.filter((g) => g.halloween).every((g) => s.visited[g.id]) },
    { id: 'athlete', icon: '🏅', test: (s) => GAMES.filter((g) => g.sport).every((g) => s.visited[g.id]) },
    { id: 'complete', icon: '🏆', test: (s) => GAMES.every((g) => s.visited[g.id]) }
  ];

  function gameForUrl(href) {
    let u;
    try { u = new URL(href, location.href); } catch (_) { return null; }
    const full = u.origin + u.pathname;
    let best = null; let bestLen = 0;
    for (const g of GAMES) {
      for (const cand of [g.href].concat(g.alt || [])) {
        let c; try { c = new URL(cand); } catch (_) { continue; }
        const prefix = c.origin + c.pathname;
        const hit = full === prefix || full.startsWith(prefix) || (prefix.endsWith('/') && full === prefix + 'index.html');
        if (hit && prefix.length > bestLen) { best = g; bestLen = prefix.length; }
      }
    }
    // Only the game itself counts, not its README, changelog or test report.
    if (best && /\.(md|json|cjs|js)$|test-results|case-study|README/i.test(u.pathname)) return null;
    return best;
  }

  function recordVisit(game) {
    const s = pass.read();
    const firstTime = !s.visited[game.id];
    s.visited[game.id] = s.visited[game.id] || new Date().toISOString();
    s.unlocked = s.unlocked || {};
    const fresh = [];
    for (const a of ACHIEVEMENTS) {
      if (!s.unlocked[a.id] && a.test(s)) { s.unlocked[a.id] = new Date().toISOString(); fresh.push(a); }
    }
    pass.write(s);
    if (firstTime) { renderPass(); markPlayed(); }
    fresh.forEach((a, i) => setTimeout(() => toast(`${a.icon} ${t().unlocked(t().ach[a.id][0])}`), i * 900));
  }

  function initVisitTracking() {
    const handler = (e) => {
      if (e.type === 'auxclick' && e.button !== 1) return;
      const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || a.closest('[data-plus-ignore]')) return;
      const g = gameForUrl(a.getAttribute('href'));
      if (g) recordVisit(g);
    };
    document.addEventListener('click', handler, true);
    document.addEventListener('auxclick', handler, true);
  }

  function renderPass() {
    document.querySelectorAll('[data-plus="arcade-pass"]').forEach((mount) => {
      const c = t(); const s = pass.read(); const done = pass.count(s); const total = GAMES.length;
      const pct = Math.round((done / total) * 100);
      const lang = isEn() ? 'en' : 'ro';
      mount.innerHTML = `
        <div class="plus-pass-head">
          <div class="plus-pass-meter" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}" aria-label="${esc(c.passProgress(done, total))}">
            <span style="width:${pct}%"></span>
          </div>
          <p class="plus-pass-count"><strong>${done}</strong> / ${total} · ${esc(c.passProgress(done, total))}</p>
        </div>
        ${done ? '' : `<p class="plus-muted">${esc(c.passEmpty)}</p>`}
        <ul class="plus-pass-grid" role="list">
          ${GAMES.map((g) => {
            const played = !!s.visited[g.id];
            const ext = !!g.url;
            return `<li class="plus-pass-tile${played ? ' is-played' : ''}${g.halloween ? ' is-halloween' : ''}">
              <span class="plus-pass-icon" aria-hidden="true">${g.icon}</span>
              <span class="plus-pass-name">${esc(g[lang])}</span>
              <a class="plus-pass-play" href="${esc(g.href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''} aria-label="${esc(`${c.play}: ${g[lang]}${played ? ` (${c.played})` : ''}${ext ? ` — ${c.external}` : ''}`)}">${played ? esc(c.playedLabel) : esc(c.play)}${ext ? ' ↗' : ''}</a>
            </li>`;
          }).join('')}
        </ul>
        <h3 class="plus-pass-subtitle">${esc(c.badges)}</h3>
        <ul class="plus-ach-list" role="list">
          ${ACHIEVEMENTS.map((a) => {
            const on = !!(s.unlocked && s.unlocked[a.id]) || a.test(s);
            const [name, desc] = c.ach[a.id];
            return `<li class="plus-ach${on ? ' is-on' : ''}"><span class="plus-ach-icon" aria-hidden="true">${on ? a.icon : '🔒'}</span><span><strong>${esc(name)}</strong><span class="plus-sr"> (${on ? c.unlockedShort : c.locked})</span><br><small>${esc(desc)}</small></span></li>`;
          }).join('')}
        </ul>
        ${done ? `<button class="plus-link-btn" type="button" data-plus-reset>${esc(c.reset)}</button>` : ''}`;
      const reset = mount.querySelector('[data-plus-reset]');
      if (reset) reset.addEventListener('click', () => {
        if (window.confirm(c.resetConfirm)) { store.del(PASS_KEY); renderPass(); markPlayed(); announce(c.passProgress(0, total)); }
      });
    });
  }

  /* Small "played" stamp on project cards elsewhere on the page. */
  function markPlayed() {
    const s = pass.read();
    const cache = new Map();
    const gameOf = (href) => { if (!cache.has(href)) cache.set(href, gameForUrl(href)); return cache.get(href); };
    document.querySelectorAll('.project-card, .card').forEach((card) => {
      if (card.closest('[data-plus="arcade-pass"]')) return;
      const link = [...card.querySelectorAll('a[href]')].find((a) => gameOf(a.getAttribute('href')));
      const old = card.querySelector('.plus-played-stamp');
      const g = link && gameOf(link.getAttribute('href'));
      if (g && s.visited[g.id]) {
        if (!old) {
          const stamp = document.createElement('span');
          stamp.className = 'plus-played-stamp';
          stamp.textContent = isEn() ? 'Played ✓' : 'Jucat ✓';
          const top = card.querySelector('.bento-top');
          if (top) { stamp.classList.add('is-inline'); top.appendChild(stamp); }
          else {
            if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
            card.appendChild(stamp);
          }
        }
      } else if (old) old.remove();
    });
  }

  /* =========================================================
     Badges derived from each card's own text
     ========================================================= */
  const BADGE_RULES = [
    { re: /\bRO\s*\/\s*EN\b|bilingv|bilingual/i, ro: 'RO/EN', en: 'RO/EN' },
    { re: /\bPWA\b|offline/i, ro: 'Offline', en: 'Offline' },
    { re: /\bteste?\b|\btests?\b|Jest|Playwright/i, ro: 'Testat', en: 'Tested' },
    { re: /accesib|accessib|WCAG|a11y|cititor de ecran|screen reader/i, ro: 'Accesibil', en: 'Accessible' },
    { re: /TypeScript/i, ro: 'TypeScript', en: 'TypeScript' },
    { re: /\bReact\b/i, ro: 'React', en: 'React' },
    { re: /\bCanvas\b/i, ro: 'Canvas', en: 'Canvas' }
  ];
  function addBadges() {
    const cards = document.querySelectorAll('#crm-projects .project-card, #marketing-tech .project-card, #latest-github .project-card, #recent .card');
    cards.forEach((card) => {
      if (card.querySelector('.plus-badges')) return;
      const text = card.textContent || '';
      const existing = norm([...card.querySelectorAll('.bento-tag, .bento-badge, .tag, .bento-k')].map((x) => x.textContent).join(' '));
      const found = [];
      for (const r of BADGE_RULES) {
        if (found.length >= 3) break;
        const label = isEn() ? r.en : r.ro;
        if (r.re.test(text) && !existing.includes(norm(label))) found.push(label);
      }
      if (!found.length) return;
      const row = document.createElement('div');
      row.className = 'plus-badges';
      row.setAttribute('aria-label', isEn() ? 'Highlights' : 'Repere');
      row.innerHTML = found.map((b) => `<span class="plus-badge">${esc(b)}</span>`).join('');
      const actions = card.querySelector('.bento-links, .card-actions, .links, .bento-actions');
      if (actions && actions.parentElement) actions.parentElement.insertBefore(row, actions);
      else card.appendChild(row);
    });
  }

  /* =========================================================
     Live GitHub numbers
     ========================================================= */
  const GH_KEY = 'la-gh-live-v1';
  const GH_TTL = 60 * 60 * 1000;

  async function loadGitHub() {
    const cached = store.get(GH_KEY, null);
    if (cached && Date.now() - cached.at < GH_TTL) return { data: cached.data, stale: false };
    try {
      const opts = { headers: { Accept: 'application/vnd.github+json' } };
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GH_USER}`, opts),
        fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, opts)
      ]);
      if (!userRes.ok || !reposRes.ok) throw new Error('github ' + userRes.status + '/' + reposRes.status);
      const user = await userRes.json();
      const repos = (await reposRes.json()).filter((r) => !r.fork);
      const now = Date.now();
      const langs = {};
      repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
      const data = {
        publicRepos: user.public_repos,
        active30: repos.filter((r) => now - new Date(r.pushed_at).getTime() < 30 * 86400000).length,
        lastPush: repos[0] ? repos[0].pushed_at : null,
        langs: Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6),
        recent: repos.slice(0, 4).map((r) => ({ name: r.name, url: r.html_url, home: r.homepage || null, lang: r.language, pushed: r.pushed_at, desc: r.description || '' }))
      };
      store.set(GH_KEY, { at: now, data });
      return { data, stale: false };
    } catch (err) {
      return cached ? { data: cached.data, stale: true } : { data: null, stale: true };
    }
  }

  async function renderGitHub() {
    const mounts = document.querySelectorAll('[data-plus="github-live"]');
    if (!mounts.length) return;
    const c = t().gh;
    mounts.forEach((m) => { m.setAttribute('aria-busy', 'true'); });
    const { data, stale } = await loadGitHub();
    const mins = (iso) => Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    mounts.forEach((m) => {
      m.removeAttribute('aria-busy');
      if (!data) {
        m.innerHTML = `<p class="plus-muted">${esc(c.fail)} <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener noreferrer">github.com/${GH_USER}</a>.</p>`;
        return;
      }
      const totalLang = data.langs.reduce((s, x) => s + x[1], 0) || 1;
      m.innerHTML = `
        <div class="plus-gh-stats">
          <div class="plus-gh-stat"><strong>${esc(data.publicRepos)}</strong><span>${esc(c.repos)}</span></div>
          <div class="plus-gh-stat"><strong>${esc(data.active30)}</strong><span>${esc(c.active)}</span></div>
          <div class="plus-gh-stat"><strong>${data.lastPush ? esc(c.ago(mins(data.lastPush))) : '—'}</strong><span>${esc(c.last)}</span></div>
        </div>
        ${data.langs.length ? `<p class="plus-gh-label">${esc(c.langs)}</p>
        <div class="plus-gh-langbar" aria-hidden="true">${data.langs.map(([l, n], i) => `<span class="plus-lang-${i}" style="flex:${n}"></span>`).join('')}</div>
        <ul class="plus-gh-langs" role="list">${data.langs.map(([l, n], i) => `<li><span class="plus-dot plus-lang-${i}" aria-hidden="true"></span>${esc(l)} <small>${Math.round((n / totalLang) * 100)}%</small></li>`).join('')}</ul>` : ''}
        <p class="plus-gh-label">${esc(c.recent)}</p>
        <ul class="plus-gh-recent" role="list">${data.recent.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>${r.home ? ` · <a href="${esc(r.home)}" target="_blank" rel="noopener noreferrer">${esc(c.live)} ↗</a>` : ''}<small>${r.lang ? esc(r.lang) + ' · ' : ''}${esc(c.ago(mins(r.pushed)))}</small></li>`).join('')}</ul>
        ${stale ? `<p class="plus-muted plus-small">${esc(c.cached)}</p>` : ''}`;
    });
  }

  /* =========================================================
     Ctrl+K search palette
     ========================================================= */
  let palette = null;
  let index = null;
  let indexPromise = null;
  const state = { cat: 'all', active: 0, results: [], lastFocus: null };

  async function buildIndex() {
    if (index) return index;
    if (indexPromise) return indexPromise;
    indexPromise = (async () => {
      const lang = isEn() ? 'en' : 'ro';
      const list = [];
      const seen = new Set();
      const push = (item) => {
        // "Pumpkin Weigh-In v1.1.0 — completed" and "Pumpkin Weigh-In" are the same project.
        const key = norm(item.title).split(/\s+v\d[\w.]*|\s+[—-]\s+(?:completed|finalizat)/)[0].trim();
        if (!key || seen.has(key)) return;
        seen.add(key);
        item.hay = norm([item.title, item.desc, (item.tags || []).join(' '), item.catLabel].join(' '));
        list.push(item);
      };

      // 1. Sections of this page (always first in "quick jumps").
      document.querySelectorAll('main section[id]').forEach((sec) => {
        const h = sec.querySelector(':scope > .container h2, :scope > .container-fluid h2, :scope h2');
        if (!h || sec.hidden || sec.id === 'curious-garden-opinions') return;
        const title = h.textContent.replace(/\s+/g, ' ').trim();
        if (!title || title.length > 90) return;
        push({ kind: 'section', cat: 'page', title, desc: '', href: '#' + sec.id, section: true });
      });

      // 2. Cards already on the page.
      document.querySelectorAll('main .project-card, main .card').forEach((card) => {
        const h = card.querySelector('h3');
        const a = card.querySelector('a[href]');
        if (!h || !a) return;
        const tag = card.querySelector('.bento-tag, .tag');
        const desc = card.querySelector('.project-desc, p');
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const g = gameForUrl(href);
        const inCollection = !!card.closest('#crm-projects, #marketing-tech, #latest-github, #key-projects, #recent, #projects');
        push({ kind: 'project', cat: g ? 'game' : inCollection ? guessCat(tag ? tag.textContent : '') : 'page', title: h.textContent.trim(), desc: desc ? desc.textContent.trim() : '', href, game: g });
      });

      // 3. Full catalogue.
      try {
        const res = await fetch(abs('data/catalog.json'), { cache: 'no-cache' });
        if (res.ok) {
          const data = await res.json();
          (data.items || []).forEach((it) => {
            const href = it.href || it.live;
            if (!href) return;
            const local = !/^https?:/i.test(href);
            const g = gameForUrl(local ? abs(href) : href);
            push({ kind: it.kind, cat: it.cat, title: it.title[lang] || it.title.ro, desc: it.desc[lang] || it.desc.ro, tags: it.tags, href: local ? abs(href) : href, game: g || (it.game ? true : null) });
          });
        }
      } catch (_) { /* offline: page cards still searchable */ }

      list.forEach((it) => { it.catLabel = t().catTag[it.section ? 'section' : it.cat] || ''; it.hay += ' ' + norm(it.catLabel); });
      index = list;
      return list;
    })();
    return indexPromise;
  }

  function guessCat(tag) {
    const x = norm(tag);
    if (/crm|saas|ops|premium/.test(x)) return 'crm';
    if (/game|joc/.test(x)) return 'game';
    if (/challenge/.test(x)) return 'challenge';
    if (/ui|landing|design/.test(x)) return 'ui';
    return 'utility';
  }

  function score(item, terms) {
    if (!terms.length) return 1;
    const title = norm(item.title);
    let s = 0;
    for (const term of terms) {
      if (title.startsWith(term)) s += 6;
      else if (title.includes(term)) s += 4;
      else if (item.hay.includes(term)) s += 1;
      else return 0;
    }
    if (item.section) s += 0.5;
    return s;
  }

  function search() {
    const input = palette.querySelector('.plus-pal-input');
    const terms = norm(input.value).split(/\s+/).filter(Boolean);
    const matchesCat = (it) => state.cat === 'all' || (state.cat === 'page' ? it.cat === 'page' : state.cat === 'game' ? (it.cat === 'game' || !!it.game) : it.cat === state.cat);
    let results;
    if (!terms.length && state.cat === 'all') {
      results = index.filter((it) => it.section).concat(index.filter((it) => it.kind === 'page').slice(0, 6));
    } else {
      results = index.map((it) => ({ it, s: matchesCat(it) ? score(it, terms) : 0 })).filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s).map((x) => x.it);
    }
    // Typo-tolerant fallback: "kygo wrld" still finds Kygo World.
    if (!results.length && terms.length) {
      const loose = terms.map((x) => x.slice(0, Math.min(3, x.length)));
      results = index.map((it) => ({ it, s: matchesCat(it) ? score(it, loose) : 0 })).filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s).map((x) => x.it);
    }
    state.results = results.slice(0, 60);
    state.active = 0;
    renderResults(!terms.length && state.cat === 'all');
  }

  function renderResults(quick) {
    const c = t();
    const list = palette.querySelector('.plus-pal-list');
    const count = palette.querySelector('.plus-pal-count');
    const played = pass.read().visited;
    if (!state.results.length) {
      list.innerHTML = `<li class="plus-pal-empty" role="presentation">${esc(c.empty)}</li>`;
      count.textContent = c.results(0);
      palette.querySelector('.plus-pal-input').removeAttribute('aria-activedescendant');
      return;
    }
    list.innerHTML = (quick ? `<li class="plus-pal-group" role="presentation">${esc(c.quick)}</li>` : '') + state.results.map((it, i) => {
      const ext = /^https?:/i.test(it.href) && !it.href.startsWith(BASE.origin + BASE.pathname) && !it.href.startsWith(location.origin);
      const g = it.game && typeof it.game === 'object' ? it.game : null;
      const isPlayed = g && played[g.id];
      return `<li class="plus-pal-opt" role="option" id="plus-opt-${i}" aria-selected="${i === state.active}" data-i="${i}">
        <span class="plus-pal-kind plus-cat-${esc(it.section ? 'section' : it.cat)}">${esc(it.catLabel)}</span>
        <span class="plus-pal-text"><span class="plus-pal-title">${esc(it.title)}${isPlayed ? ` <span class="plus-pal-played">✓ ${esc(c.played)}</span>` : ''}${ext ? ' <span aria-hidden="true">↗</span>' : ''}</span>${it.desc ? `<span class="plus-pal-desc">${esc(it.desc.length > 120 ? it.desc.slice(0, 117) + '…' : it.desc)}</span>` : ''}</span>
      </li>`;
    }).join('');
    count.textContent = c.results(state.results.length);
    setActive(0);
  }

  function setActive(i) {
    const opts = palette.querySelectorAll('.plus-pal-opt');
    if (!opts.length) return;
    state.active = (i + opts.length) % opts.length;
    opts.forEach((o, j) => o.setAttribute('aria-selected', String(j === state.active)));
    const cur = opts[state.active];
    palette.querySelector('.plus-pal-input').setAttribute('aria-activedescendant', cur.id);
    cur.scrollIntoView({ block: 'nearest' });
  }

  function openResult(i) {
    const it = state.results[i];
    if (!it) return;
    const g = it.game && typeof it.game === 'object' ? it.game : gameForUrl(it.href);
    if (g) recordVisit(g);
    closePalette(false);
    if (it.href.startsWith('#')) {
      const target = document.getElementById(it.href.slice(1));
      if (target) {
        // Collections hidden by the chapter tabs are revealed through the hash, as the tabs expect.
        history.pushState(null, '', it.href);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
        const focusable = target.querySelector('h2') || target;
        focusable.setAttribute('tabindex', '-1');
        focusable.focus({ preventScroll: true });
      }
      return;
    }
    const ext = /^https?:/i.test(it.href) && !it.href.startsWith(location.origin);
    if (ext) window.open(it.href, '_blank', 'noopener');
    else location.assign(it.href);
  }

  function createPalette() {
    const c = t();
    const cats = ['all', 'game', 'crm', 'utility', 'ui', 'challenge', 'page'];
    const el = document.createElement('div');
    el.className = 'plus-pal';
    el.hidden = true;
    el.innerHTML = `
      <div class="plus-pal-backdrop" data-plus-close></div>
      <div class="plus-pal-dialog" role="dialog" aria-modal="true" aria-labelledby="plus-pal-title">
        <h2 class="plus-sr" id="plus-pal-title">${esc(c.searchLabel)}</h2>
        <div class="plus-pal-bar">
          <span class="plus-pal-icon" aria-hidden="true">⌕</span>
          <input class="plus-pal-input" type="search" role="combobox" aria-expanded="true" aria-controls="plus-pal-list" aria-autocomplete="list" aria-label="${esc(c.searchLabel)}" placeholder="${esc(c.placeholder)}" autocomplete="off" spellcheck="false">
          <button class="plus-pal-close" type="button" data-plus-close aria-label="${esc(c.close)}">Esc</button>
        </div>
        <div class="plus-pal-cats" role="group" aria-label="${esc(isEn() ? 'Filter by category' : 'Filtrează după categorie')}">
          ${cats.map((k) => `<button type="button" class="plus-chip" data-cat="${k}" aria-pressed="${k === 'all'}">${esc(c.cats[k])}</button>`).join('')}
        </div>
        <ul class="plus-pal-list" id="plus-pal-list" role="listbox" aria-label="${esc(c.searchLabel)}"><li class="plus-pal-empty" role="presentation">${esc(c.loading)}</li></ul>
        <div class="plus-pal-foot"><span class="plus-pal-count" role="status" aria-live="polite"></span><span class="plus-pal-hint">${c.hint}</span></div>
      </div>`;
    document.body.appendChild(el);

    const input = el.querySelector('.plus-pal-input');
    input.addEventListener('input', () => index && search());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(state.active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(state.active - 1); }
      else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(0); }
      else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); setActive(state.results.length - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); openResult(state.active); }
    });
    el.querySelectorAll('.plus-chip').forEach((chip) => chip.addEventListener('click', () => {
      setCat(chip.dataset.cat);
      if (index) search();
      input.focus();
    }));
    el.querySelector('.plus-pal-list').addEventListener('click', (e) => {
      const opt = e.target.closest('.plus-pal-opt');
      if (opt) openResult(Number(opt.dataset.i));
    });
    el.querySelector('.plus-pal-list').addEventListener('mousemove', (e) => {
      const opt = e.target.closest('.plus-pal-opt');
      if (opt && Number(opt.dataset.i) !== state.active) setActive(Number(opt.dataset.i));
    });
    el.querySelectorAll('[data-plus-close]').forEach((b) => b.addEventListener('click', () => closePalette(true)));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closePalette(true); return; }
      if (e.key !== 'Tab') return;
      const focusables = [...el.querySelectorAll('input, button')].filter((x) => !x.disabled && x.offsetParent !== null);
      const first = focusables[0]; const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    return el;
  }

  function setCat(cat) {
    state.cat = cat || 'all';
    if (palette) palette.querySelectorAll('.plus-chip').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.cat === state.cat)));
  }

  async function openPalette(prefill, cat) {
    if (!palette) palette = createPalette();
    if (!palette.hidden) return;
    setCat(cat || 'all');
    state.lastFocus = document.activeElement;
    palette.hidden = false;
    document.documentElement.classList.add('plus-lock');
    document.querySelectorAll('[data-plus-open="palette"]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    const input = palette.querySelector('.plus-pal-input');
    if (typeof prefill === 'string') input.value = prefill;
    requestAnimationFrame(() => { palette.classList.add('is-open'); input.focus(); input.select(); });
    await buildIndex();
    if (!palette.hidden) search();
  }

  function closePalette(restoreFocus) {
    if (!palette || palette.hidden) return;
    palette.classList.remove('is-open');
    palette.hidden = true;
    document.documentElement.classList.remove('plus-lock');
    document.querySelectorAll('[data-plus-open="palette"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (restoreFocus && state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  function initPalette() {
    document.querySelectorAll('[data-plus-open="palette"]').forEach((btn) => {
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', (e) => { e.preventDefault(); openPalette('', btn.dataset.plusCat); });
    });
    document.addEventListener('keydown', (e) => {
      const typing = e.target && (e.target.isContentEditable || /^(input|textarea|select)$/i.test(e.target.tagName));
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (palette && !palette.hidden) closePalette(true); else openPalette();
      } else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openPalette();
      }
    });
    // Deep link: …portfolio.html?q=kygo opens the search pre-filled.
    try {
      const q = new URLSearchParams(location.search).get('q');
      if (q) openPalette(q);
    } catch (_) { /* ignore */ }
    // Show the right modifier key.
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    document.querySelectorAll('[data-plus-key]').forEach((k) => { k.textContent = mac ? '⌘K' : 'Ctrl K'; });
  }

  /* ---------- Boot ----------
     Only the cheap parts run at load (keyboard shortcut, visit tracking).
     Everything that touches many nodes waits for an idle moment, and the
     Arcade Pass / GitHub panels render only when they come near the viewport,
     so the first paint and the mobile main thread stay as before. */
  const idle = (fn, timeout) => ('requestIdleCallback' in window)
    ? window.requestIdleCallback(fn, { timeout: timeout || 2000 })
    : setTimeout(fn, 200);

  function whenNear(selector, fn) {
    const els = [...document.querySelectorAll(selector)];
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { idle(fn); return; }
    let done = false;
    const io = new IntersectionObserver((entries) => {
      if (done || !entries.some((e) => e.isIntersecting)) return;
      done = true; io.disconnect(); fn();
    }, { rootMargin: '600px 0px' });
    els.forEach((el) => io.observe(el));
    // A hash link straight to the section renders it at once.
    if (els.some((el) => el.closest('section') && location.hash === '#' + el.closest('section').id)) { done = true; io.disconnect(); fn(); }
  }

  function hasVisits() { return Object.keys(pass.read().visited || {}).length > 0; }

  function init() {
    initVisitTracking();
    initPalette();
    whenNear('[data-plus="arcade-pass"]', renderPass);
    whenNear('[data-plus="github-live"]', renderGitHub);
    idle(() => {
      addBadges();
      if (hasVisits()) markPlayed();
    }, 3000);
    // Some cards are re-rendered by older scripts after load.
    setTimeout(() => idle(() => { addBadges(); if (hasVisits()) markPlayed(); }), 2500);
  }
  window.PortfolioPlus = { open: openPalette, close: closePalette, games: GAMES };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
