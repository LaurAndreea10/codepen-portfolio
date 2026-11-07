/* ===== Home ===== */
(() => {
  const { L, T, esc, register, routes, CATS } = App;
  let q = '';
  register({
    id: 'home', n: 0, cat: null,
    title: { ro: 'Acasă', en: 'Home' },
    desc: { ro: '', en: '' },
    render(root) {
      const draw = () => {
        const list = routes.filter(r => r.cat && (!q || (T(r.title) + ' ' + T(r.desc) + ' ' + (r.shows || []).join(' ')).toLowerCase().includes(q.toLowerCase())));
        const rec = App.recent(6);
        root.innerHTML = `
        <section class="hero">
          <div class="pagehead" style="margin:0">
            <div class="eyebrow">Marketing Lab · 15 ${L('proiecte', 'projects')}</div>
            <h1 tabindex="-1" id="pageTitle">${L('Instrumente de marketing, date și front-end — într-un singur loc', 'Marketing, data & front-end tools — in one place')}</h1>
            <p>${L('Fiecare proiect e o unealtă care funcționează, nu o captură de ecran. Totul rulează în browser, fără backend, gata pentru GitHub Pages. Navighezi cu istoric: butoanele ← →, tasta H sau butonul de istoric din dreapta sus.', 'Every project is a working tool, not a screenshot. Everything runs in the browser with no backend, ready for GitHub Pages. Navigation keeps history: the ← → buttons, the H key, or the history button top-right.')}</p>
          </div>
          <div class="field" style="max-width:420px;margin-top:16px">
            <label for="homeSearch">${L('Caută un proiect', 'Search a project')}</label>
            <input id="homeSearch" type="search" value="${esc(q)}" placeholder="${L('ex.: email, TypeScript, cohortă…', 'e.g. email, TypeScript, cohort…')}">
          </div>
        </section>
        ${rec.length ? `<section class="card" style="margin-bottom:24px" aria-labelledby="recH"><h2 id="recH">${L('Continuă de unde ai rămas', 'Pick up where you left off')}</h2>
          <div class="row">${rec.map(e => `<a class="btn" href="#${e.id}"><span class="mono" style="color:var(--amber)">${String(App.byId[e.id].n).padStart(2, '0')}</span> ${esc(T(App.byId[e.id].title))} <span class="hint">· ${App.timeAgo(e.t)}</span></a>`).join('')}</div></section>` : ''}
        <div id="homeList">${Object.keys(CATS).map(c => {
          const items = list.filter(r => r.cat === c);
          if (!items.length) return '';
          return `<section style="margin-bottom:28px" aria-labelledby="cat-${c}"><h2 id="cat-${c}">${esc(T(CATS[c]))}</h2>
          <div class="grid g3">${items.map(r => { const v = App.visits(r.id); return `<a class="card pcard" href="#${r.id}">
            <span class="num">${String(r.n).padStart(2, '0')}</span><h3 style="margin:0">${esc(T(r.title))}</h3><p>${esc(T(r.desc))}</p>
            <span class="${v ? 'visited' : 'hint'}">${v ? '✓ ' + L('vizitat de ', 'visited ') + v + L(' ori', 'x') : L('nevizitat', 'not visited yet')}</span></a>`; }).join('')}</div></section>`;
        }).join('') || `<p class="hint">${L('Niciun rezultat.', 'No results.')}</p>`}</div>`;
        const s = root.querySelector('#homeSearch');
        s.addEventListener('input', () => { q = s.value; const pos = s.selectionStart; draw(); const n = root.querySelector('#homeSearch'); n.focus(); n.setSelectionRange(pos, pos); });
      };
      draw();
    }
  });
})();
