/* Now section: JSON + weekly archive
   Reads data/now.json and upgrades the existing #now block without touching the page structure. */
(function(){
  'use strict';

  const STYLE_ID = 'now-section-json-styles';
  const ICONS = { done: '✓', 'in-progress': '◐', next: '→' };
  const LABELS = {
    ro: { done: 'Finalizat', 'in-progress': 'În lucru', next: 'Următor', current: 'Săptămâna curentă', archive: 'Istoric', title: 'La ce lucrez săptămâna asta', note: 'Actualizat săptămânal din data/now.json. Săptămânile vechi rămân în Istoric.' },
    en: { done: 'Done', 'in-progress': 'In progress', next: 'Next', current: 'Current week', archive: 'Archive', title: 'What I am working on this week', note: 'Updated weekly from data/now.json. Older weeks stay in the Archive.' }
  };

  function lang(){
    return document.documentElement.lang === 'en' ? 'en' : 'ro';
  }

  function copy(){
    return LABELS[lang()] || LABELS.ro;
  }

  function escapeHtml(value){
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function safeHref(value){
    const href = String(value || '').trim();
    if (!href) return '';
    if (/^(https?:\/\/|mailto:|\.\/|\.\.\/|\/|projects\/|[a-z0-9-]+\.html)/i.test(href)) return href;
    return '';
  }

  function injectStyles(){
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #now .now-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:8px}
      #now .now-tabs{display:flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.03);margin-top:4px}
      #now .now-tab{padding:7px 14px;border-radius:999px;border:0;cursor:pointer;background:transparent;color:var(--muted);font-family:inherit;font-size:.85rem;font-weight:700;transition:all .2s}
      #now .now-tab:hover{color:var(--text)}
      #now .now-tab.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;box-shadow:0 4px 12px rgba(79,140,255,.3)}
      #now .now-tab__badge{display:inline-block;margin-left:6px;padding:1px 7px;border-radius:999px;font-size:.7rem;background:rgba(255,255,255,.15)}
      #now .now-week-meta{display:inline-flex;align-items:center;gap:8px;margin-top:14px;padding:6px 14px;border:1px solid var(--line);border-radius:999px;background:rgba(74,222,128,.08);color:var(--muted);font-size:.85rem}
      #now .now-list{margin-top:18px;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;color:var(--text);line-height:1.6}
      #now .now-item{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.03)}
      #now .now-item__icon{flex-shrink:0;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:.75rem;font-weight:800;margin-top:1px}
      #now .now-item--done .now-item__icon{background:rgba(74,222,128,.18);color:var(--green)}
      #now .now-item--in-progress .now-item__icon{background:rgba(245,158,11,.18);color:var(--amber)}
      #now .now-item--next .now-item__icon{background:rgba(139,92,246,.18);color:#c084fc}
      #now .now-item__text{flex:1}
      #now .now-item__text a{color:var(--accent);text-decoration:none}
      #now .now-item__text a:hover{text-decoration:underline}
      #now .now-archive{margin-top:18px}
      #now .now-archive[hidden]{display:none}
      #now .archive-week{border:1px solid var(--line);border-radius:14px;margin-bottom:10px;overflow:hidden;background:rgba(255,255,255,.02)}
      #now .archive-week summary{padding:14px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;font-weight:700;list-style:none;transition:background .15s}
      #now .archive-week summary:hover{background:rgba(255,255,255,.03)}
      #now .archive-week summary::-webkit-details-marker{display:none}
      #now .archive-week[open] summary{background:rgba(79,140,255,.06);border-bottom:1px solid var(--line)}
      #now .archive-week summary::after{content:'▼';font-size:.75rem;color:var(--muted);transition:transform .2s}
      #now .archive-week[open] summary::after{transform:rotate(180deg)}
      #now .archive-week__title{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
      #now .archive-week__label{font-size:.75rem;color:var(--muted);font-weight:600}
      #now .archive-week__count{padding:2px 9px;border-radius:999px;font-size:.72rem;font-weight:800;background:rgba(74,222,128,.12);color:var(--green);border:1px solid rgba(74,222,128,.24)}
      #now .archive-week__body{padding:12px 16px 14px}
      #now .now-note code{padding:1px 6px;border-radius:6px;background:rgba(255,255,255,.08);color:var(--text)}
      @media(max-width:700px){#now .now-tabs{width:100%;justify-content:space-between}#now .now-tab{flex:1}}
    `;
    document.head.appendChild(style);
  }

  function renderItem(item){
    const c = copy();
    const status = ICONS[item.status] ? item.status : 'next';
    const text = escapeHtml(item.text);
    const href = safeHref(item.link);
    const body = href ? `<a href="${escapeHtml(href)}" target="${href.startsWith('http') ? '_blank' : '_self'}" rel="noopener noreferrer">${text} →</a>` : text;
    return `
      <li class="now-item now-item--${status}">
        <span class="now-item__icon" title="${c[status]}" aria-label="${c[status]}">${ICONS[status]}</span>
        <span class="now-item__text">${body}</span>
      </li>`;
  }

  function renderArchive(archive){
    if (!Array.isArray(archive) || !archive.length) return '';
    return archive.map((week, index) => `
      <details class="archive-week" ${index === 0 ? 'open' : ''}>
        <summary>
          <span class="archive-week__title">
            <strong>${escapeHtml(week.week)}</strong>
            <span class="archive-week__label">${escapeHtml(week.label)}</span>
          </span>
          <span class="archive-week__count">${Array.isArray(week.items) ? week.items.length : 0}</span>
        </summary>
        <div class="archive-week__body">
          <ul class="now-list">${(week.items || []).map(renderItem).join('')}</ul>
        </div>
      </details>`).join('');
  }

  function render(data){
    const section = document.getElementById('now');
    if (!section || !data || !data.current) return;
    const c = copy();
    injectStyles();
    section.innerHTML = `
      <div class="container">
        <article class="about-card glass">
          <div class="now-head">
            <div style="flex:1;min-width:240px">
              <span class="eyebrow eyebrow-green"><span class="now-pulse" aria-hidden="true"></span>⚡ Now</span>
              <h2 id="now-title" class="now-title">${c.title}</h2>
            </div>
            <div class="now-tabs" role="tablist" aria-label="Now section views">
              <button class="now-tab active" type="button" role="tab" aria-selected="true" data-view="current">${c.current}</button>
              <button class="now-tab" type="button" role="tab" aria-selected="false" data-view="archive">${c.archive} <span class="now-tab__badge">${(data.archive || []).length}</span></button>
            </div>
          </div>

          <div class="now-current" id="viewCurrent">
            <div class="now-week-meta">
              📅 <strong>${escapeHtml(data.current.week)}</strong>
              <span>·</span>
              <time datetime="${escapeHtml(data.current.datetime)}">${escapeHtml(data.current.label)}</time>
            </div>
            <ul class="now-list">${(data.current.items || []).map(renderItem).join('')}</ul>
          </div>

          <div class="now-archive" id="viewArchive" hidden>${renderArchive(data.archive || [])}</div>

          <div class="now-tags" aria-label="Tehnologii active acum">
            <span class="now-tag">React 18</span>
            <span class="now-tag">Vite</span>
            <span class="now-tag">GitHub Actions</span>
            <span class="now-tag">Tailwind CSS</span>
            <span class="now-tag">Lighthouse CI</span>
            <span class="now-tag">Vanilla JS</span>
          </div>

          <p class="now-note">${c.note}</p>
        </article>
      </div>`;

    const tabs = section.querySelectorAll('.now-tab');
    const currentView = section.querySelector('#viewCurrent');
    const archiveView = section.querySelector('#viewArchive');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const showArchive = tab.dataset.view === 'archive';
        currentView.style.display = showArchive ? 'none' : 'block';
        archiveView.toggleAttribute('hidden', !showArchive);
      });
    });
  }

  function init(){
    if (!document.getElementById('now')) return;
    fetch('data/now.json', { cache: 'no-cache' })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('now.json not found')))
      .then(render)
      .catch(error => console.warn('Now section could not load data/now.json:', error));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
