(() => {
  'use strict';

  const ORIGINAL_MAIN = 'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@32d68e9388727fd0052b50b1c09b78da26dbf812/main.js';

  const data = {
    ro: {
      active: [
        { title: 'Golden Hour Waves — polish & showcase', body: 'rafinez prezentarea vizuală, capturile și microcopy-ul pentru ca proiectul să se simtă ca o experiență completă, nu doar un demo.', tag: 'Visual polish' },
        { title: 'Beach games collection QA', body: 'verific pe mobil proiectele cu valuri, surf și plajă: touch controls, animații, contrast și încărcare rapidă.', tag: 'Mobile QA' },
        { title: 'Challenge cards metadata refresh', body: 'actualizez cardurile de challenge cu linkuri live, descrieri scurte și categorii clare pentru scanare rapidă.', tag: 'Portfolio update' },
        { title: 'README + CodePen descriptions pass', body: 'pregătesc descrieri bilingve mai curate pentru proiectele recente, cu features, stack și mod de testare live.', tag: 'Docs' }
      ],
      done: [
        { title: 'Neon Island Run 3D', body: 'joc 3D neon publicat pe GitHub Pages, cu atmosferă insulară, energie arcade și direcție vizuală futuristă.', tag: 'Iun 2026', link: { href: 'https://laurandreea10.github.io/Neon-Island-Run-3D/', label: 'Deschide Neon Island Run 3D' } },
        { title: 'Garden Match Masters', body: 'joc match-3 de grădină publicat pe GitHub Pages, cu energie colorată, obiective rapide și atmosferă arcade casual.', tag: 'Iun 2026', link: { href: 'https://laurandreea10.github.io/Garden-Match-Masters/', label: 'Deschide Garden Match Masters' } },
        { title: 'Golden Hour Waves', body: 'proiect vizual finalizat și publicat pe GitHub Pages, cu atmosferă golden hour, valuri animate și estetică relaxată de plajă.', tag: 'Iun 2026', link: { href: 'https://laurandreea10.github.io/Golden-hour-waves/', label: 'Deschide Golden Hour Waves' } },
        { title: 'Golden Hour Waves 2', body: 'a doua versiune a experimentului vizual cu valuri golden hour, rafinată ca atmosferă, mișcare și prezentare.', tag: 'Iun 2026', link: { href: 'https://laurandreea10.github.io/Golden-hour-waves-2/', label: 'Deschide Golden Hour Waves 2' } },
        { title: 'Case study screenshots & before/after visuals', body: 'capturi, comparații before/after și mini explicații vizuale pregătite pentru proiectele principale.', tag: 'Finalizat' },
        { title: 'Project metrics & validation notes', body: 'dovezi simple adăugate: problema rezolvată, flow simplificat, decizie UX și mod de verificare live.', tag: 'Finalizat' },
        { title: 'Portfolio content cleanup RO/EN', body: 'texte bilingve, titluri, microcopy și CTA-uri rafinate pentru un portofoliu mai coerent și profesional.', tag: 'Finalizat' },
        { title: 'Recruiter / reviewer quick path', body: 'traseu rapid construit pentru vizitatori: top 3 proiecte, proof-of-work, GitHub, live demos și contact vizibile rapid.', tag: 'Finalizat' }
      ],
      historyLabel: 'Săpt. 12 Iunie 2026',
      historyItems: [
        { text: 'Neon Island Run 3D — adăugat la Finalizat recent cu link GitHub Pages', href: 'https://laurandreea10.github.io/Neon-Island-Run-3D/' },
        { text: 'Garden Match Masters — adăugat la Finalizat recent cu link GitHub Pages', href: 'https://laurandreea10.github.io/Garden-Match-Masters/' },
        { text: 'Golden Hour Waves — adăugat la Finalizat recent cu link GitHub Pages', href: 'https://laurandreea10.github.io/Golden-hour-waves/' },
        { text: 'Golden Hour Waves 2 — adăugat la Finalizat recent cu link GitHub Pages', href: 'https://laurandreea10.github.io/Golden-hour-waves-2/' },
        { text: 'Cele 4 priorități de portofoliu au fost mutate din În curs în Finalizat recent', href: '#now-panel-done' },
        { text: 'În curs — actualizat cu priorități noi pentru polish, QA mobil, metadata și documentație', href: '#now-panel-active' }
      ],
      scanItems: [
        'Neon Island Run 3D — joc 3D neon publicat live',
        'Garden Match Masters — joc match-3 de grădină publicat live',
        'Golden Hour Waves — experiență vizuală golden hour publicată live',
        'Golden Hour Waves 2 — versiune rafinată publicată live'
      ]
    },
    en: {
      active: [
        { title: 'Golden Hour Waves — polish & showcase', body: 'I am refining the visual presentation, screenshots and microcopy so the project feels like a complete experience, not just a demo.', tag: 'Visual polish' },
        { title: 'Beach games collection QA', body: 'I am checking the wave, surf and beach projects on mobile: touch controls, animations, contrast and fast loading.', tag: 'Mobile QA' },
        { title: 'Challenge cards metadata refresh', body: 'I am updating challenge cards with live links, short descriptions and clearer categories for faster scanning.', tag: 'Portfolio update' },
        { title: 'README + CodePen descriptions pass', body: 'I am preparing cleaner bilingual descriptions for recent projects, with features, stack and live testing notes.', tag: 'Docs' }
      ],
      done: [
        { title: 'Neon Island Run 3D', body: 'neon 3D game published on GitHub Pages, with an island atmosphere, arcade energy and a futuristic visual direction.', tag: 'Jun 2026', link: { href: 'https://laurandreea10.github.io/Neon-Island-Run-3D/', label: 'Open Neon Island Run 3D' } },
        { title: 'Garden Match Masters', body: 'garden match-3 game published on GitHub Pages, with colorful arcade energy, quick objectives and a casual play feel.', tag: 'Jun 2026', link: { href: 'https://laurandreea10.github.io/Garden-Match-Masters/', label: 'Open Garden Match Masters' } },
        { title: 'Golden Hour Waves', body: 'visual project shipped and published on GitHub Pages, with a golden hour atmosphere, animated waves and a relaxed beach aesthetic.', tag: 'Jun 2026', link: { href: 'https://laurandreea10.github.io/Golden-hour-waves/', label: 'Open Golden Hour Waves' } },
        { title: 'Golden Hour Waves 2', body: 'second version of the golden hour waves visual experiment, refined in atmosphere, motion and presentation.', tag: 'Jun 2026', link: { href: 'https://laurandreea10.github.io/Golden-hour-waves-2/', label: 'Open Golden Hour Waves 2' } },
        { title: 'Case study screenshots & before/after visuals', body: 'screenshots, before/after comparisons and short visual explanations prepared for the main projects.', tag: 'Done' },
        { title: 'Project metrics & validation notes', body: 'simple proof added: solved problem, simplified flow, UX decision and live verification path.', tag: 'Done' },
        { title: 'Portfolio content cleanup RO/EN', body: 'bilingual text, titles, microcopy and CTAs refined for a more coherent and professional portfolio.', tag: 'Done' },
        { title: 'Recruiter / reviewer quick path', body: 'faster visitor path built: top 3 projects, proof-of-work, GitHub, live demos and contact visible quickly.', tag: 'Done' }
      ],
      historyLabel: 'Week of June 12, 2026',
      historyItems: [
        { text: 'Neon Island Run 3D — added to Recently shipped with GitHub Pages link', href: 'https://laurandreea10.github.io/Neon-Island-Run-3D/' },
        { text: 'Garden Match Masters — added to Recently shipped with GitHub Pages link', href: 'https://laurandreea10.github.io/Garden-Match-Masters/' },
        { text: 'Golden Hour Waves — added to Recently shipped with GitHub Pages link', href: 'https://laurandreea10.github.io/Golden-hour-waves/' },
        { text: 'Golden Hour Waves 2 — added to Recently shipped with GitHub Pages link', href: 'https://laurandreea10.github.io/Golden-hour-waves-2/' },
        { text: 'The 4 portfolio priorities were moved from In progress to Recently shipped', href: '#now-panel-done' },
        { text: 'In progress — updated with new priorities for polish, mobile QA, metadata and documentation', href: '#now-panel-active' }
      ],
      scanItems: [
        'Neon Island Run 3D — neon 3D game published live',
        'Garden Match Masters — garden match-3 game published live',
        'Golden Hour Waves — golden hour visual experience published live',
        'Golden Hour Waves 2 — refined version published live'
      ]
    }
  };

  function lang() {
    return document.documentElement.lang === 'en' ? 'en' : 'ro';
  }

  function external(a, href) {
    if (href && href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  }

  function buildNowItem(entry, done) {
    const current = lang();
    const li = document.createElement('li');
    li.className = 'now-item ' + (done ? 'now-item-done' : 'now-item-active');

    const status = document.createElement('span');
    status.className = 'now-status';
    status.setAttribute('aria-label', done ? (current === 'ro' ? 'Finalizat' : 'Done') : (current === 'ro' ? 'În lucru' : 'In progress'));
    status.textContent = done ? '✅' : '🔄';

    const div = document.createElement('div');
    const strong = document.createElement('strong');

    if (entry.link) {
      const a = document.createElement('a');
      a.className = 'now-item-link';
      a.href = entry.link.href;
      a.textContent = entry.title;
      external(a, entry.link.href);
      strong.appendChild(a);
    } else {
      strong.textContent = entry.title;
    }

    div.appendChild(strong);
    div.appendChild(document.createTextNode(' — ' + entry.body + ' '));

    if (entry.tag) {
      const tag = document.createElement('span');
      tag.className = 'now-tag' + (done ? ' now-tag-done' : '');
      tag.textContent = entry.tag;
      div.appendChild(tag);
    }

    if (entry.link) {
      const action = document.createElement('a');
      action.className = 'now-tag now-link-action';
      action.href = entry.link.href;
      action.textContent = entry.link.label;
      action.setAttribute('aria-label', entry.link.label);
      external(action, entry.link.href);
      div.appendChild(document.createTextNode(' '));
      div.appendChild(action);
    }

    li.appendChild(status);
    li.appendChild(div);
    return li;
  }

  function buildHistoryItem(entry) {
    const li = document.createElement('li');
    const item = typeof entry === 'string' ? { text: entry, href: '#now' } : entry;

    if (item && item.href) {
      const a = document.createElement('a');
      a.className = 'now-history-link';
      a.href = item.href;
      a.textContent = item.text;
      external(a, item.href);
      li.appendChild(a);
    } else {
      li.textContent = item && item.text ? item.text : '';
    }

    return li;
  }

  function patchNowSection() {
    const copy = data[lang()];
    const activePanel = document.querySelector('#now-panel-active .now-checklist');
    const donePanel = document.querySelector('#now-panel-done .now-checklist');
    const historyPanel = document.querySelector('#now-panel-history .now-history');

    if (activePanel) {
      activePanel.innerHTML = '';
      copy.active.forEach(item => activePanel.appendChild(buildNowItem(item, false)));
    }

    if (donePanel && !donePanel.dataset.goldenPatched) {
      copy.done.slice().reverse().forEach(item => donePanel.insertBefore(buildNowItem(item, true), donePanel.firstChild));
      donePanel.dataset.goldenPatched = lang();
    } else if (donePanel && donePanel.dataset.goldenPatched !== lang()) {
      donePanel.dataset.goldenPatched = '';
      patchNowSection();
      return;
    }

    if (historyPanel && !historyPanel.dataset.goldenPatched) {
      const wrap = document.createElement('div');
      wrap.className = 'now-history-week';
      const label = document.createElement('span');
      label.className = 'now-history-label';
      label.textContent = copy.historyLabel;
      const ul = document.createElement('ul');
      copy.historyItems.forEach(item => ul.appendChild(buildHistoryItem(item)));
      wrap.appendChild(label);
      wrap.appendChild(ul);
      historyPanel.insertBefore(wrap, historyPanel.firstChild);
      historyPanel.dataset.goldenPatched = lang();
    } else if (historyPanel && historyPanel.dataset.goldenPatched !== lang()) {
      historyPanel.dataset.goldenPatched = '';
      patchNowSection();
    }
  }

  function patchScanPanel() {
    const copy = data[lang()];
    const titles = [...document.querySelectorAll('.scan-col-title')];
    const doneTitle = titles.find(el => (el.textContent || '').includes('Finalizat') || (el.textContent || '').includes('Recently'));
    const list = doneTitle && doneTitle.parentElement ? doneTitle.parentElement.querySelector('.scan-list') : null;
    if (!list || list.dataset.goldenPatched === lang()) return;

    list.querySelectorAll('[data-golden-scan]').forEach(el => el.remove());
    copy.scanItems.slice().reverse().forEach(text => {
      const li = document.createElement('li');
      li.setAttribute('data-golden-scan', '1');
      li.innerHTML = '✅ <strong>' + text.split(' — ')[0] + '</strong> — ' + text.split(' — ').slice(1).join(' — ');
      list.insertBefore(li, list.firstChild);
    });
    list.dataset.goldenPatched = lang();
  }

  function patchAll() {
    patchNowSection();
    patchScanPanel();
  }

  function loadOriginalMain() {
    const script = document.createElement('script');
    script.src = ORIGINAL_MAIN;
    script.defer = true;
    script.onload = () => {
      patchAll();
      window.setTimeout(patchAll, 100);
      window.setTimeout(patchAll, 500);
      window.setTimeout(patchAll, 1300);
      document.addEventListener('click', () => window.setTimeout(patchAll, 80), true);
    };
    script.onerror = () => {
      console.warn('Portfolio original main.js could not be loaded from snapshot.');
      document.addEventListener('DOMContentLoaded', patchAll);
    };
    document.head.appendChild(script);
  }

  loadOriginalMain();
})();