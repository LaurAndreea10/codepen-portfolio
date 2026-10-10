/* LIVADA — studiu de landing page (brand fictiv). Vanilla JS, fără dependențe. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* fără stocare */ } },
    sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch { /* fără stocare */ } }
  };

  /* ---------------- date ---------------- */
  const FLAVORS = [
    {
      sym: 'f-catina', bg: '#f28c1b', fg: '#24102a', juice: '#f7a531', months: [8, 9, 10],
      name: { ro: 'Cătină', en: 'Sea buckthorn' },
      tag: { ro: 'Acrișoară, aproape tropicală', en: 'Tart, almost tropical' },
      desc: {
        ro: 'Boabele portocalii se culeg cu ramură cu tot și se presează întregi. Iese un suc dens, ca de fruct de mango acru, care te trezește mai bine decât cafeaua.',
        en: 'The orange berries are picked branch and all, then pressed whole. The juice is thick, like a sour mango, and wakes you up better than coffee.'
      },
      origin: { ro: 'Dealurile Hârlăului', en: 'Hârlău hills' },
      harvest: { ro: 'august – octombrie', en: 'August – October' },
      meters: [2, 5, 4],
      mood: { ro: 'Răsărit', en: 'Sunrise' }
    },
    {
      sym: 'f-visine', bg: '#9e0f2c', fg: '#ffe7cf', juice: '#d0213f', months: [6, 7],
      name: { ro: 'Vișine', en: 'Sour cherry' },
      tag: { ro: 'Acru, cu final de sâmbure', en: 'Sour, with a stone-fruit finish' },
      desc: {
        ro: 'Vișinele de iunie au gustul verii de la bunici. Le scoatem sâmburii la mână, ca sucul să rămână curat și fără amăreală.',
        en: 'June sour cherries taste like summer at your grandparents’. We pit them by hand so the juice stays clean and never bitter.'
      },
      origin: { ro: 'Livezile din Cotnari', en: 'Cotnari orchards' },
      harvest: { ro: 'iunie – iulie', en: 'June – July' },
      meters: [3, 4, 3],
      mood: { ro: 'Apus de iunie', en: 'June sunset' }
    },
    {
      sym: 'f-afine', bg: '#23307a', fg: '#ffe7cf', juice: '#5b2470', months: [7, 8, 9],
      name: { ro: 'Afine', en: 'Blueberry' },
      tag: { ro: 'Dulce, catifelat, de pădure', en: 'Sweet, velvety, from the forest' },
      desc: {
        ro: 'Afine de munte, mai mici și mai aromate decât cele cultivate. Sucul e aproape negru în sticlă și violet în pahar.',
        en: 'Mountain blueberries, smaller and more fragrant than farmed ones. Almost black in the bottle, violet in the glass.'
      },
      origin: { ro: 'Pădurile Rarăului', en: 'Rarău forests' },
      harvest: { ro: 'iulie – septembrie', en: 'July – September' },
      meters: [4, 2, 4],
      mood: { ro: 'Noapte pe Rarău', en: 'Night on Rarău' }
    },
    {
      sym: 'f-mere', bg: '#8db33a', fg: '#24102a', juice: '#e9c46a', months: [9, 10],
      name: { ro: 'Mere ionatan', en: 'Jonathan apple' },
      tag: { ro: 'Crocant, luminos, echilibrat', en: 'Crisp, bright, balanced' },
      desc: {
        ro: 'Ionatanul e mărul cu care a crescut Moldova. Îl presăm cu tot cu coajă roșie, de aici culoarea aurie și gustul ușor acrișor.',
        en: 'Jonathan is the apple Moldova grew up with. We press it with its red skin on, which gives the golden colour and gentle tang.'
      },
      origin: { ro: 'Livezile din Bucium, Iași', en: 'Bucium orchards, Iași' },
      harvest: { ro: 'septembrie – octombrie', en: 'September – October' },
      meters: [4, 3, 2],
      mood: { ro: 'Toamnă la Bucium', en: 'Autumn in Bucium' }
    }
  ];

  const I18N = {
    ro: {
      skip: 'Sari la conținut', introSkip: 'Sari peste', navLabel: 'Secțiuni',
      navFlavors: 'Arome', navMix: 'Amestecă', navSeason: 'Sezon',
      heroKicker: 'Presat la rece în Iași, din livezi de pe dealurile Moldovei',
      heroLine: 'Un singur fruct pe sticlă. Fără apă, fără zahăr, fără pasteurizare.',
      scrollCue: 'Derulează ca să presezi',
      manifest: 'Nu diluăm. Nu îndulcim. Nu încălzim. Luăm fructul așa cum a crescut, îl presăm la rece și îl îmbuteliem în aceeași zi.',
      fact1: 'de fructe într-o sticlă de 330 ml', fact2: 'zahăr adăugat', fact3: 'de la cules până la presă',
      flavorsTitle: 'Cele patru arome', flavorsTab: 'Arome', metaOrigin: 'Livada', metaHarvest: 'Cules',
      meters: ['Dulce', 'Acru', 'Corp'],
      mixTitle: 'Joacă-te cu fructele',
      mixLead: 'Pune până la patru porții în sticlă, apoi amestecă. Vezi ce culoare, ce gust și ce nume iese.',
      mixGroup: 'Adaugă o porție', mixEmpty: 'Sticla e goală. Alege un fruct.',
      mixShake: 'Amestecă', mixUndo: 'Scoate ultima porție', mixClear: 'Golește sticla',
      mixLayered: n => `${n} ${n === 1 ? 'porție' : 'porții'} în straturi. Apasă Amestecă.`,
      mixFull: 'Sticla e plină.',
      mixPure: 'pur', bottleEmpty: 'Sticla goală',
      bottleDesc: list => `Sticlă cu ${list}`,
      seasonTitle: 'Presăm doar în sezon',
      seasonLead: 'Fiecare aromă există atât cât ține culesul. Sucul presat atunci e congelat imediat și ajunge la tine tot anul.',
      calLabel: 'Calendarul culesului',
      months: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'],
      monthsLong: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
      harvestOn: 'cules', harvestOff: 'fără cules',
      outro1: 'Fructul nu e un obicei.', outro2: 'E un anotimp.',
      backPortfolio: 'Înapoi la portofoliu', seeCode: 'Vezi codul pe GitHub', readme: 'Cum e construit',
      disclaimer: 'LIVADA este un brand fictiv, creat de Laura Andreea ca studiu de landing page. Produsele, livezile și cifrele sunt inventate; nu se vinde nimic.',
      langBtn: 'EN', langLabel: 'Switch to English', logoLabel: 'LIVADA, începutul paginii'
    },
    en: {
      skip: 'Skip to content', introSkip: 'Skip', navLabel: 'Sections',
      navFlavors: 'Flavours', navMix: 'Mix', navSeason: 'Season',
      heroKicker: 'Cold-pressed in Iași, from orchards on the hills of Moldova',
      heroLine: 'One fruit per bottle. No water, no sugar, no pasteurisation.',
      scrollCue: 'Scroll to press',
      manifest: 'We don’t dilute. We don’t sweeten. We don’t heat. We take the fruit as it grew, cold-press it and bottle it the same day.',
      fact1: 'of fruit in one 330 ml bottle', fact2: 'added sugar', fact3: 'from picking to the press',
      flavorsTitle: 'The four flavours', flavorsTab: 'Flavours', metaOrigin: 'Orchard', metaHarvest: 'Harvest',
      meters: ['Sweet', 'Tart', 'Body'],
      mixTitle: 'Play with the fruit',
      mixLead: 'Add up to four portions to the bottle, then mix. See what colour, taste and name come out.',
      mixGroup: 'Add a portion', mixEmpty: 'The bottle is empty. Pick a fruit.',
      mixShake: 'Mix', mixUndo: 'Remove last portion', mixClear: 'Empty the bottle',
      mixLayered: n => `${n} ${n === 1 ? 'portion' : 'portions'} in layers. Press Mix.`,
      mixFull: 'The bottle is full.',
      mixPure: 'pure', bottleEmpty: 'Empty bottle',
      bottleDesc: list => `Bottle with ${list}`,
      seasonTitle: 'We only press in season',
      seasonLead: 'Each flavour lasts as long as the harvest. Juice pressed then is frozen straight away and reaches you all year.',
      calLabel: 'Harvest calendar',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      monthsLong: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      harvestOn: 'harvest', harvestOff: 'no harvest',
      outro1: 'Fruit isn’t a habit.', outro2: 'It’s a season.',
      backPortfolio: 'Back to the portfolio', seeCode: 'See the code on GitHub', readme: 'How it’s built',
      disclaimer: 'LIVADA is a fictional brand, made by Laura Andreea as a landing-page study. The products, orchards and figures are invented; nothing is for sale.',
      langBtn: 'RO', langLabel: 'Comută în română', logoLabel: 'LIVADA, top of page'
    }
  };

  const params = new URLSearchParams(location.search);
  let lang = params.get('lang') === 'en' || (params.get('lang') !== 'ro' && store.get('livada-lang') === 'en') ? 'en' : 'ro';
  const t = k => I18N[lang][k];

  /* ---------------- intro ---------------- */
  const intro = $('#intro');
  function endIntro(instant) {
    if (!intro || intro.classList.contains('gone')) return;
    store.sset('livada-intro', '1');
    if (instant) { intro.classList.add('gone'); document.body.classList.remove('intro-on'); return; }
    intro.classList.add('open');
    document.body.classList.remove('intro-on');
    setTimeout(() => intro.classList.add('gone'), 1050);
  }
  if (reduced || store.sget('livada-intro') || params.has('nointro')) {
    endIntro(true);
  } else {
    document.body.classList.add('intro-on');
    const timer = setTimeout(() => endIntro(false), 2050);
    const skip = () => { clearTimeout(timer); endIntro(false); window.removeEventListener('keydown', skip); };
    intro.addEventListener('click', skip);
    window.addEventListener('keydown', skip);
  }

  /* ---------------- hero: presa ---------------- */
  const hero = $('.hero');
  const hbFill = $('#hb-fill');
  const fruits = $$('.hero .fruit');
  let pointer = { x: 0, y: 0 };

  function updateHero() {
    const h = hero.offsetHeight;
    const p = clamp(window.scrollY / (h * 0.5), 0, 1);
    hero.style.setProperty('--p', p.toFixed(3));
    hbFill.setAttribute('transform', `translate(0 ${(300 - p * 175).toFixed(1)})`);
    fruits.forEach(f => {
      const d = +f.dataset.depth;
      const sx = pointer.x * d, sy = pointer.y * d - window.scrollY * d * 0.02;
      f.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) rotate(${(d * p).toFixed(1)}deg)`;
    });
  }
  if (!reduced) {
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      pointer = { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 };
      requestUpdate();
    });
  }

  /* ---------------- manifest: cuvinte aprinse la scroll ---------------- */
  const manifest = $('.manifest-text');
  let words = [];
  function splitManifest() {
    manifest.textContent = '';
    words = t('manifest').split(' ').map((w, i, arr) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      manifest.append(s);
      if (i < arr.length - 1) manifest.append(' ');
      return s;
    });
  }
  function updateManifest() {
    const r = manifest.getBoundingClientRect();
    const start = innerHeight * 0.85, end = innerHeight * 0.35;
    const prog = reduced ? 1 : clamp((start - r.top) / (start - end + r.height * 0.6), 0, 1);
    const n = Math.round(prog * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  }

  /* ---------------- arome: secțiune sticky ---------------- */
  const flavorsSec = $('.flavors');
  const tabs = $$('.flavor-tabs button');
  const panel = $('#flavor-panel');
  let current = -1;

  function meterHTML(values) {
    return values.map((v, i) =>
      `<div class="meter"><span>${t('meters')[i]}</span><span class="meter-bar" role="img" aria-label="${t('meters')[i]}: ${Math.round(v * 10) / 10} / 5">${
        [1, 2, 3, 4, 5].map(n => `<i class="${n <= Math.round(v) ? 'on' : ''}"></i>`).join('')
      }</span></div>`).join('');
  }

  function showFlavor(i, force) {
    if (i === current && !force) return;
    const f = FLAVORS[i];
    const changed = i !== current;
    current = i;
    flavorsSec.style.setProperty('--bg', f.bg);
    flavorsSec.style.setProperty('--fg', f.fg);
    flavorsSec.style.setProperty('--juice', f.juice);
    $('#flavor-ghost').textContent = f.name[lang].toUpperCase();
    $('#flavor-name').textContent = f.name[lang];
    $('#flavor-tag').textContent = f.tag[lang];
    $('#flavor-desc').textContent = f.desc[lang];
    $('#flavor-origin').textContent = f.origin[lang];
    $('#flavor-harvest').textContent = f.harvest[lang];
    $('#flavor-meters').innerHTML = meterHTML(f.meters);
    $('#fb-label').textContent = f.name[lang].toLowerCase();
    $('#ff-a').setAttribute('href', '#' + f.sym);
    $('#ff-b').setAttribute('href', '#' + f.sym);
    tabs.forEach((b, j) => {
      b.setAttribute('aria-selected', String(j === i));
      b.tabIndex = j === i ? 0 : -1;
      b.textContent = FLAVORS[j].name[lang].split(' ')[0];
    });
    panel.setAttribute('aria-labelledby', 'flavor-name');
    if (changed && !reduced) {
      panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
      $('.flavor-bottle').style.transform = `rotate(${[-4, 3, -2, 4][i]}deg)`;
    }
  }

  function flavorRange() {
    const top = flavorsSec.offsetTop;
    const span = flavorsSec.offsetHeight - innerHeight;
    return { top, span };
  }
  function updateFlavors() {
    const { top, span } = flavorRange();
    const p = clamp((window.scrollY - top) / span, 0, 1);
    $('#flavor-progress').style.width = (p * 100).toFixed(1) + '%';
    if (Date.now() < flavorLock) return;
    showFlavor(Math.min(FLAVORS.length - 1, Math.floor(p * FLAVORS.length)));
  }
  let flavorLock = 0;
  window.addEventListener('scrollend', () => { if (flavorLock) { flavorLock = 0; requestUpdate(); } });
  function goToFlavor(i) {
    const { top, span } = flavorRange();
    const target = top + span * ((i + 0.5) / FLAVORS.length);
    if (Math.abs(window.scrollY - target) > 2) flavorLock = Date.now() + 2500;
    showFlavor(i);
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
  }
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => goToFlavor(i));
    b.addEventListener('keydown', e => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const n = (i + dir + tabs.length) % tabs.length;
      goToFlavor(n);
      tabs[n].focus({ preventScroll: true });
    });
  });

  /* ---------------- amestec ---------------- */
  const MAX = 4, TOP = 120, BOTTOM = 416, SLOT = (BOTTOM - TOP) / MAX;
  const layersG = $('#mix-layers');
  const NS = 'http://www.w3.org/2000/svg';
  let blend = [];
  let mixed = false;

  const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const rgb2hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  function mixColor(list) {
    const sum = [0, 0, 0];
    list.forEach(i => hex2rgb(FLAVORS[i].juice).forEach((v, k) => { sum[k] += v * v; }));
    return rgb2hex(sum.map(v => Math.sqrt(v / list.length)));
  }

  function composition() {
    const counts = FLAVORS.map((_, i) => blend.filter(b => b === i).length);
    return counts.map((c, i) => c ? `${c} × ${FLAVORS[i].name[lang]}` : null).filter(Boolean).join(', ');
  }
  function blendName() {
    const counts = FLAVORS.map((_, i) => blend.filter(b => b === i).length);
    const order = counts.map((c, i) => [c, i]).filter(x => x[0]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    if (order.length === 1) return `${FLAVORS[order[0][1]].mood[lang]} ${t('mixPure')}`;
    const lead = FLAVORS[order[0][1]].mood[lang];
    const rest = order.slice(1).map(x => FLAVORS[x[1]].name[lang].split(' ')[0].toLowerCase());
    return lang === 'ro' ? `${lead} cu ${rest.join(' și ')}` : `${lead} with ${rest.join(' and ')}`;
  }

  function renderMix() {
    const rects = $$('rect', layersG);
    while (rects.length > blend.length) rects.pop().remove();
    blend.forEach((f, i) => {
      let r = rects[i];
      if (!r) {
        r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', '0'); r.setAttribute('width', '200');
        r.setAttribute('y', String(TOP - 40)); r.setAttribute('height', '0');
        layersG.append(r);
        void r.getBoundingClientRect();
      }
      r.setAttribute('y', String(BOTTOM - (i + 1) * SLOT));
      r.setAttribute('height', String(SLOT + 2));
      r.setAttribute('fill', mixed ? mixColor(blend) : FLAVORS[f].juice);
    });
    const n = blend.length;
    $('#mix-count').textContent = `${n} / ${MAX}`;
    $('#mix-shake').disabled = n < 1 || mixed;
    $('#mix-undo').disabled = n < 1;
    $('#mix-clear').disabled = n < 1;
    $$('.pick').forEach(b => { b.disabled = n >= MAX; });
    const name = $('#mix-name');
    const meters = $('#mix-meters');
    if (!n) {
      name.textContent = t('mixEmpty');
      meters.innerHTML = '';
    } else if (!mixed) {
      name.innerHTML = '';
      name.append(document.createTextNode(n >= MAX ? t('mixFull') : t('mixLayered')(n)));
      const s = document.createElement('small'); s.textContent = composition(); name.append(s);
      meters.innerHTML = '';
    } else {
      name.innerHTML = '';
      name.append(document.createTextNode(blendName()));
      const s = document.createElement('small'); s.textContent = composition(); name.append(s);
      const avg = [0, 1, 2].map(k => blend.reduce((a, i) => a + FLAVORS[i].meters[k], 0) / n);
      meters.innerHTML = meterHTML(avg);
    }
    $('#mix-bottle-desc').textContent = n ? t('bottleDesc')(composition()) : t('bottleEmpty');
  }

  $$('.pick').forEach(b => b.addEventListener('click', () => {
    if (blend.length >= MAX) return;
    if (mixed) { mixed = false; }
    blend.push(+b.dataset.add);
    renderMix();
  }));
  $('#mix-shake').addEventListener('click', () => {
    if (!blend.length) return;
    const bottle = $('.mix-bottle');
    if (!reduced) { bottle.classList.remove('shaking'); void bottle.getBoundingClientRect(); bottle.classList.add('shaking'); }
    mixed = true;
    setTimeout(renderMix, reduced ? 0 : 320);
  });
  $('#mix-undo').addEventListener('click', () => { blend.pop(); mixed = false; renderMix(); });
  $('#mix-clear').addEventListener('click', () => { blend = []; mixed = false; renderMix(); });

  /* ---------------- calendar ---------------- */
  function renderCalendar() {
    const nowM = new Date().getMonth() + 1;
    $('#cal-months').innerHTML = '<span role="columnheader"></span>' +
      t('months').map((m, i) => `<span role="columnheader"${i + 1 === nowM ? ' aria-current="date"' : ''}>${m}</span>`).join('');
    $('#cal-body').innerHTML = FLAVORS.map(f => {
      const cells = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1, on = f.months.includes(m);
        const cls = ['cal-cell', on ? 'on' : '', on && !f.months.includes(m - 1) ? 'edge-l' : '', on && !f.months.includes(m + 1) ? 'edge-r' : '', m === nowM ? 'now' : ''].join(' ');
        return `<span role="cell" class="${cls}" style="--c:${f.bg}" aria-label="${t('monthsLong')[i]}: ${on ? t('harvestOn') : t('harvestOff')}"></span>`;
      }).join('');
      return `<div class="cal-row" role="row"><span class="cal-name" role="rowheader"><svg aria-hidden="true"><use href="#${f.sym}"/></svg><span>${f.name[lang]}</span></span>${cells}</div>`;
    }).join('');
  }

  /* ---------------- limbă ---------------- */
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const v = I18N[lang][el.dataset.i18n];
      if (typeof v === 'string') el.textContent = v;
    });
    $$('[data-i18n-attr]').forEach(el => {
      const [attr, key] = el.dataset.i18nAttr.split(':');
      el.setAttribute(attr, t(key));
    });
    const btn = $('#lang');
    btn.textContent = t('langBtn');
    btn.setAttribute('aria-label', t('langLabel'));
    $('.logo').setAttribute('aria-label', t('logoLabel'));
    $('#hb-label').textContent = FLAVORS[0].name[lang].toLowerCase();
    $$('.pick span').forEach((s, i) => { s.textContent = FLAVORS[i].name[lang].split(' ')[0]; });
    $$('.marquee-track span').forEach((s, i) => { s.textContent = FLAVORS[i % 4].name[lang]; });
    splitManifest();
    showFlavor(Math.max(0, current), true);
    renderMix();
    renderCalendar();
    updateManifest();
  }
  $('#lang').addEventListener('click', () => {
    lang = lang === 'ro' ? 'en' : 'ro';
    store.set('livada-lang', lang);
    const u = new URL(location.href); u.searchParams.set('lang', lang);
    history.replaceState(null, '', u);
    applyLang();
  });

  /* ---------------- bucla de scroll ---------------- */
  let ticking = false;
  function frame() { ticking = false; updateHero(); updateManifest(); updateFlavors(); }
  function requestUpdate() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  applyLang();
  frame();
})();
