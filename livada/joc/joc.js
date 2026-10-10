/* LIVADA: Culesul — joc de tăiat fructe. Vanilla JS + Canvas 2D, fără dependențe. Laura Andreea, 2026. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const VERSION = '1.1.0';
  const SAVE_KEY = 'livada-culesul-v1';
  const BOTTLE_SIZE = 15;
  const params = new URLSearchParams(location.search);

  /* =====================================================================
     Grafică: aceleași fructe ca în landing page, randate din SVG
     ===================================================================== */
  const SVG = {
    catina: '<path d="M14 104 C40 80 70 52 106 14" stroke="#6b4a2b" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M78 40 q22 -14 30 -8 q-10 14 -30 8z" fill="#7f9a5a"/><path d="M44 70 q-26 -6 -30 2 q14 10 30 -2z" fill="#7f9a5a"/><g fill="#f28c1b"><ellipse cx="34" cy="86" rx="8" ry="10"/><ellipse cx="48" cy="72" rx="8" ry="10"/><ellipse cx="62" cy="58" rx="8" ry="10"/><ellipse cx="76" cy="44" rx="8" ry="10"/><ellipse cx="24" cy="98" rx="7" ry="9"/><ellipse cx="52" cy="86" rx="8" ry="10"/><ellipse cx="66" cy="74" rx="8" ry="10"/><ellipse cx="80" cy="60" rx="8" ry="10"/><ellipse cx="38" cy="58" rx="7" ry="9"/></g><g fill="#ffd08a" opacity=".8"><circle cx="31" cy="82" r="2.4"/><circle cx="45" cy="68" r="2.4"/><circle cx="59" cy="54" r="2.4"/><circle cx="73" cy="40" r="2.4"/><circle cx="49" cy="82" r="2.4"/><circle cx="63" cy="70" r="2.4"/><circle cx="77" cy="56" r="2.4"/></g>',
    visine: '<path d="M60 12 C54 40 40 58 34 74 M60 12 C70 42 80 58 86 72" stroke="#4d6b2a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 12 q24 -6 34 8 q-22 8 -34 -8z" fill="#5f8a33"/><circle cx="34" cy="86" r="20" fill="#b0122e"/><circle cx="86" cy="84" r="20" fill="#9e0f2c"/><ellipse cx="27" cy="79" rx="5" ry="7" fill="#ff8a9b" opacity=".55"/><ellipse cx="79" cy="77" rx="5" ry="7" fill="#ff8a9b" opacity=".5"/>',
    afine: '<circle cx="44" cy="70" r="26" fill="#2d3c8f"/><circle cx="80" cy="56" r="22" fill="#3a4aa6"/><circle cx="72" cy="92" r="18" fill="#26347d"/><g fill="none" stroke="#151d4f" stroke-width="3" stroke-linecap="round"><path d="M38 50 l6 6 l6 -6 M44 50 v-4"/><path d="M75 38 l5 5 l5 -5 M80 38 v-4"/><path d="M67 77 l5 4 l5 -4"/></g><g fill="#a9b6ff" opacity=".35"><ellipse cx="34" cy="64" rx="6" ry="9"/><ellipse cx="72" cy="52" rx="5" ry="7"/></g>',
    mere: '<path d="M60 30 C40 18 14 30 16 62 C18 96 44 110 60 100 C76 110 102 96 104 62 C106 30 80 18 60 30z" fill="#8db33a"/><path d="M60 30 C40 18 14 30 16 62 C17 74 21 84 27 91 C24 60 40 40 60 36z" fill="#c74a2b" opacity=".55"/><path d="M60 32 C60 22 62 14 66 8" stroke="#5a3b1e" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M64 18 q22 -14 34 -4 q-16 16 -34 4z" fill="#4f7d2a"/><ellipse cx="38" cy="56" rx="7" ry="12" fill="#eaffc0" opacity=".35"/>',
    gold: '<path d="M60 30 C40 18 14 30 16 62 C18 96 44 110 60 100 C76 110 102 96 104 62 C106 30 80 18 60 30z" fill="#ffc83d"/><path d="M60 30 C40 18 14 30 16 62 C17 74 21 84 27 91 C24 60 40 40 60 36z" fill="#ff9f1c" opacity=".6"/><path d="M60 32 C60 22 62 14 66 8" stroke="#5a3b1e" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M64 18 q22 -14 34 -4 q-16 16 -34 4z" fill="#4f7d2a"/><ellipse cx="38" cy="56" rx="7" ry="12" fill="#fff7d6" opacity=".7"/><path d="M96 92 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3z M20 20 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2z" fill="#fff4c2"/>',
    wasp: '<defs><clipPath id="wb"><ellipse cx="70" cy="66" rx="34" ry="21"/></clipPath></defs><ellipse cx="56" cy="38" rx="15" ry="24" transform="rotate(-25 56 38)" fill="#e8f4ff" opacity=".7"/><ellipse cx="76" cy="36" rx="13" ry="22" transform="rotate(20 76 36)" fill="#e8f4ff" opacity=".55"/><path d="M102 66 l14 0 l-14 6z" fill="#1a1020"/><ellipse cx="70" cy="66" rx="34" ry="21" fill="#ffc83d"/><g clip-path="url(#wb)" fill="#1a1020"><rect x="58" y="40" width="9" height="60"/><rect x="76" y="40" width="9" height="60"/><rect x="94" y="40" width="9" height="60"/></g><circle cx="30" cy="62" r="15" fill="#1a1020"/><circle cx="25" cy="58" r="4.5" fill="#fff"/><circle cx="24" cy="58" r="2" fill="#1a1020"/><path d="M26 49 q-6 -14 -16 -16 M34 48 q2 -14 -4 -22" stroke="#1a1020" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M44 80 l-6 12 M60 84 l-4 12 M76 84 l0 12" stroke="#1a1020" stroke-width="3" stroke-linecap="round"/>'
  };
  function svgURL(inner, outline) {
    const stroke = outline ? `<g opacity="1" stroke="#fff" stroke-width="7" stroke-linejoin="round" fill="none">${inner.replace(/fill="[^"]*"/g, 'fill="none"').replace(/opacity="[^"]*"/g, '')}</g>` : '';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="240" height="240">${stroke}${inner}</svg>`);
  }
  const SPRITES = { normal: {}, hc: {} };
  const spriteReady = Promise.all(Object.keys(SVG).flatMap(k => ['normal', 'hc'].map(set => new Promise(res => {
    const img = new Image();
    img.onload = img.onerror = () => res();
    img.src = svgURL(SVG[k], set === 'hc');
    SPRITES[set][k] = img;
  }))));

  const KINDS = [
    { id: 'catina', juice: '#f7a531', pts: 2, size: .82 },
    { id: 'visine', juice: '#d0213f', pts: 1, size: .9 },
    { id: 'afine', juice: '#6a2a84', pts: 2, size: .82 },
    { id: 'mere', juice: '#e9c46a', pts: 1, size: 1.05 }
  ];
  const KIND_BY_ID = Object.fromEntries(KINDS.map((k, i) => [k.id, i]));

  /* =====================================================================
     Texte RO/EN
     ===================================================================== */
  const I18N = {
    ro: {
      skip: 'Sari la meniu', back: 'Înapoi la LIVADA', title: 'Culesul',
      lead: 'Taie fructele cu degetul sau cu mouse-ul, ocolește viespile și umple sticlele cu suc.',
      m_classic: 'Clasic', m_classic_r: 'Trei vieți. Pierzi una pentru fiecare fruct scăpat sau viespe tăiată.',
      m_timed: 'Contra timp', m_timed_r: '60 de secunde. O viespe tăiată îți ia 5 secunde.',
      m_recipe: 'Comanda zilei', m_recipe_r: '90 de secunde, aceleași comenzi pentru toți azi. Taie doar ce cere rețeta.',
      m_zen: 'Zen', m_zen_r: '90 de secunde, fără viespi și fără penalizări. Doar fructe.',
      best: 'Record', how: 'Cum se joacă', achievements: 'Realizări', settings: 'Setări', close: 'Închide',
      scoreLabel: 'Scor', pause: 'Pauză', paused: 'Pauză', resume: 'Continuă', restart: 'Ia-o de la capăt', quit: 'Ieși în meniu',
      again: 'Joacă din nou', menu: 'Meniu',
      s_sound: 'Sunet', s_sound_d: 'Efecte generate în browser.',
      s_slow: 'Ritm lent', s_slow_d: 'Fructele zboară cu 30% mai încet.',
      s_tap: 'Tăiere prin atingere', s_tap_d: 'O atingere sau un click pe fruct îl taie, fără să tragi.',
      s_contrast: 'Contrast ridicat', s_contrast_d: 'Fundal simplu și contur alb pe fructe și viespi.',
      s_motion: 'Mișcare redusă', s_motion_d: 'Fără tremur de ecran și cu mai puține picături.',
      reset: 'Șterge progresul', resetConfirm: 'Ștergi recordurile, realizările și statisticile? Nu se poate anula.',
      lives: n => `${n} ${n === 1 ? 'viață' : 'vieți'}`,
      bottleAria: (n) => `Sticla: ${n} din ${BOTTLE_SIZE}`,
      howList: [
        ['catina', 'Trage peste fructe ca să le tai. Cătina și afinele dau 2 puncte, vișinele și merele 1.'],
        ['wasp', 'Nu tăia viespile. În Clasic și Comanda zilei pierzi o viață, în Contra timp pierzi 5 secunde.'],
        ['mere', 'Taie 3 sau mai multe fructe dintr-o singură mișcare pentru bonus de combo.'],
        ['gold', 'Mărul de aur dublează punctele timp de 7 secunde și aduce o ploaie de fructe.'],
        ['visine', 'Fiecare fruct tăiat umple sticla. La 15 fructe, sticla se îmbuteliază: +5 puncte.'],
        ['afine', 'Esc sau P pune pauză. Jocul se oprește singur dacă schimbi fila.']
      ],
      combo: n => `Combo ×${n}`, bottleFull: 'Sticlă plină', goldOn: 'Mărul de aur: puncte ×2',
      lifeLost: 'O viață pierdută', timeLost: '−5 s', orderDone: 'Comandă livrată',
      timeLow: 'Mai sunt 10 secunde', missed: 'Scăpat',
      newBest: 'Record nou!', bestWas: n => `Record: ${n}`,
      st_fruits: 'Fructe tăiate', st_combo: 'Cel mai bun combo', st_bottles: 'Sticle umplute', st_wasps: 'Viespi tăiate', st_orders: 'Comenzi livrate', st_missed: 'Fructe scăpate',
      menuStats: (f, b, r) => r ? `Până acum: ${f} fructe tăiate, ${b} sticle umplute, ${r} ${r === 1 ? 'rundă' : 'runde'}.` : 'Nicio rundă jucată încă. Alege un mod.',
      gameOverAnn: s => `Rundă terminată. Scor ${s}.`,
      started: m => `Începe runda: ${m}.`,
      orderAria: list => `Comanda: ${list}`,
      fruit: { catina: 'cătină', visine: 'vișine', afine: 'afine', mere: 'mere', gold: 'mărul de aur', wasp: 'viespe' },
      ach: {
        first: ['Prima felie', 'Taie primul fruct.'],
        combo3: ['Mână sigură', 'Fă un combo de 3.'],
        combo5: ['Presa umană', 'Fă un combo de 5.'],
        salad: ['Salată de fructe', 'Taie toate cele patru fructe dintr-o mișcare.'],
        bottles5: ['Linie de îmbuteliere', 'Umple 5 sticle într-o rundă.'],
        classic100: ['Culegător', 'Fă 100 de puncte în Clasic.'],
        score250: ['Livadă plină', 'Fă 250 de puncte într-o rundă.'],
        gold: ['Mărul de aur', 'Taie mărul de aur.'],
        bees: ['Pace cu viespile', 'Fă 50 de puncte în Clasic fără să tai nicio viespe.'],
        zen200: ['Liniște în livadă', 'Fă 200 de puncte în Zen.'],
        orders3: ['Comandă la timp', 'Livrează 3 comenzi într-o rundă.'],
        fruits1000: ['Un sezon întreg', 'Taie 1000 de fructe în total.']
      },
      langBtn: 'EN', langLabel: 'Switch to English'
    },
    en: {
      skip: 'Skip to menu', back: 'Back to LIVADA', title: 'The Harvest',
      lead: 'Slice the fruit with your finger or mouse, avoid the wasps and fill the bottles with juice.',
      m_classic: 'Classic', m_classic_r: 'Three lives. You lose one for every fruit you drop or wasp you slice.',
      m_timed: 'Time attack', m_timed_r: '60 seconds. A sliced wasp costs you 5 seconds.',
      m_recipe: 'Order of the day', m_recipe_r: '90 seconds, the same orders for everyone today. Slice only what the recipe asks for.',
      m_zen: 'Zen', m_zen_r: '90 seconds, no wasps and no penalties. Just fruit.',
      best: 'Best', how: 'How to play', achievements: 'Achievements', settings: 'Settings', close: 'Close',
      scoreLabel: 'Score', pause: 'Pause', paused: 'Paused', resume: 'Resume', restart: 'Start over', quit: 'Quit to menu',
      again: 'Play again', menu: 'Menu',
      s_sound: 'Sound', s_sound_d: 'Effects generated in the browser.',
      s_slow: 'Slow pace', s_slow_d: 'Fruit flies 30% slower.',
      s_tap: 'Tap to slice', s_tap_d: 'A tap or click on a fruit slices it, no dragging needed.',
      s_contrast: 'High contrast', s_contrast_d: 'Plain background and white outlines on fruit and wasps.',
      s_motion: 'Reduced motion', s_motion_d: 'No screen shake and fewer juice drops.',
      reset: 'Erase progress', resetConfirm: 'Erase best scores, achievements and stats? This can’t be undone.',
      lives: n => `${n} ${n === 1 ? 'life' : 'lives'}`,
      bottleAria: (n) => `Bottle: ${n} of ${BOTTLE_SIZE}`,
      howList: [
        ['catina', 'Swipe across fruit to slice it. Sea buckthorn and blueberries score 2, cherries and apples 1.'],
        ['wasp', 'Don’t slice the wasps. In Classic and Order of the day you lose a life; in Time attack you lose 5 seconds.'],
        ['mere', 'Slice 3 or more fruits in one swipe for a combo bonus.'],
        ['gold', 'The golden apple doubles your points for 7 seconds and brings a shower of fruit.'],
        ['visine', 'Every sliced fruit fills the bottle. At 15 fruits it gets bottled: +5 points.'],
        ['afine', 'Esc or P pauses. The game pauses itself if you switch tabs.']
      ],
      combo: n => `Combo ×${n}`, bottleFull: 'Bottle full', goldOn: 'Golden apple: points ×2',
      lifeLost: 'Life lost', timeLost: '−5 s', orderDone: 'Order delivered',
      timeLow: '10 seconds left', missed: 'Dropped',
      newBest: 'New best!', bestWas: n => `Best: ${n}`,
      st_fruits: 'Fruit sliced', st_combo: 'Best combo', st_bottles: 'Bottles filled', st_wasps: 'Wasps sliced', st_orders: 'Orders delivered', st_missed: 'Fruit dropped',
      menuStats: (f, b, r) => r ? `So far: ${f} fruit sliced, ${b} bottles filled, ${r} ${r === 1 ? 'round' : 'rounds'}.` : 'No rounds played yet. Pick a mode.',
      gameOverAnn: s => `Round over. Score ${s}.`,
      started: m => `Round started: ${m}.`,
      orderAria: list => `Order: ${list}`,
      fruit: { catina: 'sea buckthorn', visine: 'sour cherry', afine: 'blueberry', mere: 'apple', gold: 'golden apple', wasp: 'wasp' },
      ach: {
        first: ['First slice', 'Slice your first fruit.'],
        combo3: ['Steady hand', 'Make a 3-fruit combo.'],
        combo5: ['Human press', 'Make a 5-fruit combo.'],
        salad: ['Fruit salad', 'Slice all four fruits in one swipe.'],
        bottles5: ['Bottling line', 'Fill 5 bottles in one round.'],
        classic100: ['Picker', 'Score 100 in Classic.'],
        score250: ['Full orchard', 'Score 250 in one round.'],
        gold: ['Golden apple', 'Slice the golden apple.'],
        bees: ['Peace with the wasps', 'Score 50 in Classic without slicing a wasp.'],
        zen200: ['Quiet orchard', 'Score 200 in Zen.'],
        orders3: ['On-time delivery', 'Deliver 3 orders in one round.'],
        fruits1000: ['A whole season', 'Slice 1000 fruits in total.']
      },
      langBtn: 'RO', langLabel: 'Comută în română'
    }
  };
  const ACH_IDS = Object.keys(I18N.ro.ach);
  const ACH_CHECK = {
    first: (r) => r.sliced >= 1,
    combo3: (r) => r.bestCombo >= 3,
    combo5: (r) => r.bestCombo >= 5,
    salad: (r) => r.salad,
    bottles5: (r) => r.bottles >= 5,
    classic100: (r) => r.mode === 'classic' && r.score >= 100,
    score250: (r) => r.score >= 250,
    gold: (r) => r.gold >= 1,
    bees: (r) => r.mode === 'classic' && r.score >= 50 && r.wasps === 0,
    zen200: (r) => r.mode === 'zen' && r.score >= 200,
    orders3: (r) => r.mode === 'recipe' && r.orders >= 3,
    fruits1000: (r, s) => s.total.fruits >= 1000
  };

  /* =====================================================================
     Salvare locală, validată
     ===================================================================== */
  const MODES = ['classic', 'timed', 'recipe', 'zen'];
  const sysReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function defaults() {
    return {
      v: 1,
      best: { classic: 0, timed: 0, recipe: 0, zen: 0 },
      total: { fruits: 0, bottles: 0, rounds: 0 },
      ach: [],
      settings: { sound: true, slow: false, tap: false, contrast: false, motion: sysReduced },
      lang: null
    };
  }
  const nat = v => (Number.isFinite(+v) && +v >= 0 ? Math.floor(+v) : 0);
  function load() {
    const d = defaults();
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch { raw = null; }
    if (!raw || typeof raw !== 'object') return d;
    if (raw.best && typeof raw.best === 'object') MODES.forEach(m => { d.best[m] = nat(raw.best[m]); });
    if (raw.total && typeof raw.total === 'object') ['fruits', 'bottles', 'rounds'].forEach(k => { d.total[k] = nat(raw.total[k]); });
    if (Array.isArray(raw.ach)) d.ach = raw.ach.filter(a => ACH_IDS.includes(a)).filter((a, i, arr) => arr.indexOf(a) === i);
    if (raw.settings && typeof raw.settings === 'object') Object.keys(d.settings).forEach(k => { if (typeof raw.settings[k] === 'boolean') d.settings[k] = raw.settings[k]; });
    if (raw.lang === 'ro' || raw.lang === 'en') d.lang = raw.lang;
    return d;
  }
  let save = load();
  function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch { /* fără stocare: jocul merge oricum */ } }

  let lang = params.get('lang') === 'en' ? 'en' : params.get('lang') === 'ro' ? 'ro' : (save.lang || 'ro');
  const t = k => I18N[lang][k];
  const S = () => save.settings;

  /* =====================================================================
     Sunet generat (Web Audio)
     ===================================================================== */
  let actx = null, noiseBuf = null;
  function audio() {
    if (!S().sound) return null;
    try {
      if (!actx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        actx = new AC();
        noiseBuf = actx.createBuffer(1, actx.sampleRate * 0.4, actx.sampleRate);
        const ch = noiseBuf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      }
      if (actx.state === 'suspended') actx.resume();
      return actx;
    } catch { return null; }
  }
  function tone(type, f0, f1, dur, vol, delay = 0) {
    const a = audio(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain(), t0 = a.currentTime + delay;
    o.type = type; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + dur + .02);
  }
  function noise(dur, f0, f1, vol) {
    const a = audio(); if (!a) return;
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), t0 = a.currentTime;
    s.buffer = noiseBuf; f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(f0, t0); f.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f).connect(g).connect(a.destination); s.start(t0); s.stop(t0 + dur);
  }
  let lastSliceSfx = 0;
  const sfx = {
    slice() { const n = performance.now(); if (n - lastSliceSfx < 45) return; lastSliceSfx = n; noise(.13, rand(2200, 3000), 500, .22); tone('sine', 190, 60, .12, .18); },
    wasp() { tone('sawtooth', 240, 70, .4, .14); noise(.25, 800, 200, .2); },
    miss() { tone('square', 150, 110, .18, .06); },
    combo(n) { [0, 4, 7, 12, 16].slice(0, Math.min(5, n)).forEach((s, i) => tone('triangle', 523 * 2 ** (s / 12), 523 * 2 ** (s / 12), .16, .12, i * .06)); },
    bottle() { tone('sine', 520, 1300, .09, .2); tone('sine', 880, 880, .18, .08, .08); },
    gold() { [0, 7, 12, 19].forEach((s, i) => tone('triangle', 660 * 2 ** (s / 12), 660 * 2 ** (s / 12), .25, .12, i * .07)); },
    order() { [0, 4, 7, 12].forEach((s, i) => tone('sine', 440 * 2 ** (s / 12), 440 * 2 ** (s / 12), .2, .14, i * .09)); },
    over() { [12, 7, 4, 0].forEach((s, i) => tone('triangle', 392 * 2 ** (s / 12), 392 * 2 ** (s / 12), .3, .1, i * .12)); },
    tick() { tone('sine', 1000, 1000, .05, .06); }
  };

  /* =====================================================================
     Canvas și fundal
     ===================================================================== */
  const canvas = $('#stage');
  const ctx = canvas.getContext('2d');
  const bg = document.createElement('canvas'), bgx = bg.getContext('2d');
  const stain = document.createElement('canvas'), stx = stain.getContext('2d');
  let W = 0, H = 0, DPR = 1, R = 40;
  const FONT = '"Bricolage Grotesque", "Arial Narrow", Arial, sans-serif';

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    for (const c of [canvas, bg, stain]) { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    bgx.setTransform(DPR, 0, 0, DPR, 0, 0);
    stx.setTransform(DPR, 0, 0, DPR, 0, 0);
    R = clamp(Math.min(W, H) * 0.09, 34, 62);
    paintBackground();
  }
  function paintBackground() {
    const hc = S().contrast;
    if (hc) { bgx.fillStyle = '#0d0410'; bgx.fillRect(0, 0, W, H); return; }
    const g = bgx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1a0a20'); g.addColorStop(.6, '#2a1231'); g.addColorStop(1, '#3b1a44');
    bgx.fillStyle = g; bgx.fillRect(0, 0, W, H);
    // stele
    let seed = 7;
    const r1 = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    bgx.fillStyle = 'rgba(255,231,207,.5)';
    for (let i = 0; i < 70; i++) { bgx.globalAlpha = .2 + r1() * .5; bgx.beginPath(); bgx.arc(r1() * W, r1() * H * .55, r1() * 1.4 + .3, 0, 7); bgx.fill(); }
    bgx.globalAlpha = 1;
    // lună
    const mg = bgx.createRadialGradient(W * .82, H * .18, 0, W * .82, H * .18, R * 3);
    mg.addColorStop(0, 'rgba(255,214,150,.35)'); mg.addColorStop(1, 'rgba(255,214,150,0)');
    bgx.fillStyle = mg; bgx.fillRect(0, 0, W, H);
    bgx.fillStyle = '#ffe2b8'; bgx.beginPath(); bgx.arc(W * .82, H * .18, R * .7, 0, 7); bgx.fill();
    // dealuri cu livezi
    const hills = [[.72, '#2f1437', .06], [.8, '#3a1942', .05], [.9, '#461f4f', .04]];
    hills.forEach(([y0, col, amp], k) => {
      bgx.fillStyle = col; bgx.beginPath(); bgx.moveTo(0, H);
      for (let x = 0; x <= W + 20; x += 20) bgx.lineTo(x, H * y0 + Math.sin(x / W * Math.PI * (2 + k) + k) * H * amp);
      bgx.lineTo(W, H); bgx.closePath(); bgx.fill();
      // copaci
      const n = Math.round(W / (90 - k * 15));
      for (let i = 0; i < n; i++) {
        const x = (i + .5) / n * W + Math.sin(i * 12.9 + k) * 20;
        const y = H * y0 + Math.sin(x / W * Math.PI * (2 + k) + k) * H * amp;
        const s = (10 + k * 6) * (R / 45);
        bgx.fillRect(x - s * .12, y - s * 1.1, s * .24, s * 1.2);
        bgx.beginPath(); bgx.arc(x, y - s * 1.3, s * .75, 0, 7); bgx.fill();
      }
    });
  }

  /* =====================================================================
     Stare
     ===================================================================== */
  const G = {
    mode: null, playing: false, paused: false, over: false,
    t: 0, score: 0, lives: 3, timeLeft: 0, objects: [], halves: [], parts: [], texts: [],
    spawnIn: 1, queue: [], lastGold: -99, mult: 1, multLeft: 0, shake: 0,
    bottle: 0, bottleColor: KINDS[0].juice, order: null, orderIdx: 0, rng: Math.random, lowWarned: false,
    stats: null, id: 0
  };
  const strokes = new Map();
  let ambientIn = 0;

  function newStats(mode) {
    return { mode, score: 0, sliced: 0, bestCombo: 0, salad: false, bottles: 0, gold: 0, wasps: 0, orders: 0, missed: 0 };
  }

  /* ---------- seed zilnic pentru Comanda zilei ---------- */
  function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let r = Math.imul(a ^ a >>> 15, 1 | a); r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r; return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }
  function dailySeed() { const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
  function makeOrder(rng, idx) {
    const kinds = [0, 1, 2, 3].sort(() => rng() - .5).slice(0, idx < 2 ? 2 : 3);
    const items = kinds.map(k => ({ k, need: 2 + Math.floor(rng() * (3 + Math.min(idx, 3))), got: 0 }));
    return { items, total: items.reduce((a, i) => a + i.need, 0) };
  }

  /* =====================================================================
     Generarea fructelor
     ===================================================================== */
  function launch(type, kind, opts = {}) {
    const size = type === 'fruit' ? KINDS[kind].size : type === 'gold' ? 1.05 : .95;
    const r = R * size;
    const g = gravity();
    const x0 = opts.x ?? rand(W * .14, W * .86);
    const y0 = H + r;
    const peak = opts.peak ?? rand(H * .14, H * .46);
    const vy = -Math.sqrt(2 * g * (y0 - peak));
    const flight = 2 * -vy / g;
    const vx = ((W / 2 - x0) * rand(.35, 1.05)) / flight + rand(-20, 20);
    G.objects.push({ id: ++G.id, type, kind, x: x0, y: y0, vx, vy, r, rot: rand(0, 6.28), spin: rand(-2.6, 2.6), age: 0 });
  }
  function gravity() { return H * .95; }
  function difficulty() { return G.mode === 'zen' ? clamp(G.t / 120, 0, .5) : clamp(G.t / 90, 0, 1); }

  function pickKind() {
    if (G.mode === 'recipe' && G.order && Math.random() < .65) {
      const open = G.order.items.filter(i => i.got < i.need);
      if (open.length) return open[Math.floor(Math.random() * open.length)].k;
    }
    return Math.floor(Math.random() * KINDS.length);
  }
  function spawnWave() {
    const d = difficulty();
    const n = 1 + Math.floor(Math.random() * (1.4 + d * 3.6));
    const waspP = G.mode === 'zen' || G.t < 4 ? 0 : G.mode === 'recipe' ? .14 : lerp(.07, .2, d);
    let delay = 0;
    const burst = Math.random() < .25 + d * .2;
    const baseX = rand(W * .2, W * .8);
    for (let i = 0; i < n; i++) {
      const isWasp = Math.random() < waspP;
      G.queue.push({ at: G.t + delay, type: isWasp ? 'wasp' : 'fruit', kind: isWasp ? -1 : pickKind(), x: burst ? clamp(baseX + rand(-W * .12, W * .12), W * .1, W * .9) : undefined });
      delay += burst ? .06 : rand(.12, .32);
    }
    if (G.t > 15 && G.t - G.lastGold > 25 && Math.random() < .07) {
      G.lastGold = G.t;
      G.queue.push({ at: G.t + delay + .2, type: 'gold', kind: -1 });
    }
    G.spawnIn = G.mode === 'zen' ? rand(1.1, 1.5) : lerp(1.55, .78, d) * rand(.85, 1.15);
  }

  /* =====================================================================
     Tăiere
     ===================================================================== */
  function segDist(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
    const k = l2 ? clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1) : 0;
    const x = ax + dx * k - px, y = ay + dy * k - py;
    return Math.sqrt(x * x + y * y);
  }

  function tryCut(stroke, ax, ay, bx, by, fast) {
    if (!G.playing || G.paused) return;
    for (let i = G.objects.length - 1; i >= 0; i--) {
      const o = G.objects[i];
      if (o.age < .05) continue;
      if (!fast) continue;
      if (segDist(o.x, o.y, ax, ay, bx, by) < o.r * 1.02) {
        G.objects.splice(i, 1);
        cut(o, Math.atan2(by - ay, bx - ax), stroke);
      }
    }
  }
  function tapCut(stroke, x, y) {
    if (!G.playing || G.paused) return;
    let best = -1, bd = Infinity;
    G.objects.forEach((o, i) => { const d = Math.hypot(o.x - x, o.y - y); if (d < o.r * 1.2 && d < bd) { bd = d; best = i; } });
    if (best >= 0) { const o = G.objects.splice(best, 1)[0]; cut(o, rand(-.6, .6), stroke); }
  }

  function addText(text, x, y, color, size = 28) {
    G.texts.push({ text, x: clamp(x, 60, W - 60), y: clamp(y, 90, H - 40), life: 1.1, color, size });
  }
  let annTimer = 0;
  function announce(msg) {
    const el = $('#announcer');
    el.textContent = '';
    clearTimeout(annTimer);
    annTimer = setTimeout(() => { el.textContent = msg; }, 30);
  }

  function splash(x, y, color, n, angle) {
    const few = S().motion;
    const count = few ? Math.ceil(n / 3) : n;
    for (let i = 0; i < count && G.parts.length < 320; i++) {
      const a = angle + Math.PI / 2 * (Math.random() < .5 ? 1 : -1) + rand(-.9, .9);
      const sp = rand(80, 420);
      G.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, r: rand(2, 5.5) * (R / 45), life: rand(.5, 1), max: 1, color });
    }
    stx.fillStyle = color;
    for (let i = 0; i < (few ? 3 : 7); i++) {
      stx.globalAlpha = rand(.12, .28);
      stx.beginPath(); stx.arc(x + rand(-R, R), y + rand(-R, R), rand(R * .15, R * .55), 0, 7); stx.fill();
    }
    stx.globalAlpha = 1;
  }

  function makeHalves(o, angle) {
    const nx = Math.cos(angle + Math.PI / 2), ny = Math.sin(angle + Math.PI / 2);
    [-1, 1].forEach(side => {
      G.halves.push({
        sprite: o.type === 'fruit' ? KINDS[o.kind].id : o.type, x: o.x, y: o.y, r: o.r,
        vx: o.vx * .4 + nx * side * 140, vy: o.vy * .3 + ny * side * 140 - 60,
        rot: o.rot, spin: o.spin + side * 3, cut: angle - o.rot, side, life: 1.6,
        juice: o.type === 'fruit' ? KINDS[o.kind].juice : o.type === 'gold' ? '#ffe08a' : '#ffd84d'
      });
    });
  }

  function cut(o, angle, stroke) {
    makeHalves(o, angle);
    if (o.type === 'wasp') { hitWasp(o, angle, stroke); return; }
    if (o.type === 'gold') {
      G.mult = 2; G.multLeft = 7; G.stats.gold++;
      G.score += 5;
      splash(o.x, o.y, '#ffd75e', 26, angle);
      addText('×2', o.x, o.y - o.r, '#ffc83d', 44);
      announce(t('goldOn'));
      sfx.gold();
      for (let i = 0; i < 6; i++) G.queue.push({ at: G.t + .15 + i * .1, type: 'fruit', kind: Math.floor(Math.random() * 4), x: rand(W * .2, W * .8) });
      updateHUD();
      return;
    }
    const k = KINDS[o.kind];
    const pts = k.pts * G.mult;
    G.score += pts;
    G.stats.sliced++;
    sfx.slice();
    splash(o.x, o.y, k.juice, 16, angle);
    addText('+' + pts, o.x, o.y - o.r * .6, '#ffe7cf', 26);
    if (stroke) {
      stroke.count++; stroke.kinds.add(o.kind); stroke.lastHit = performance.now(); stroke.lx = o.x; stroke.ly = o.y;
      if (stroke.kinds.size === 4) G.stats.salad = true;
    }
    // sticla
    G.bottle++;
    G.bottleColor = k.juice;
    if (G.bottle >= BOTTLE_SIZE) {
      G.bottle = 0; G.stats.bottles++;
      G.score += 5 * G.mult;
      addText(`${t('bottleFull')} +${5 * G.mult}`, W - 120, 110, '#ffc83d', 24);
      const hb = $('#hud-bottle'); hb.classList.remove('full'); void hb.offsetWidth; hb.classList.add('full');
      sfx.bottle();
      announce(t('bottleFull'));
    }
    // comanda
    if (G.mode === 'recipe' && G.order) {
      const it = G.order.items.find(i => i.k === o.kind && i.got < i.need);
      if (it) {
        it.got++;
        if (G.order.items.every(i => i.got >= i.need)) {
          const bonus = G.order.total * 2 * G.mult;
          G.score += bonus; G.stats.orders++;
          addText(`${t('orderDone')} +${bonus}`, W / 2, H * .3, '#9fb0ff', 30);
          sfx.order(); announce(t('orderDone'));
          G.orderIdx++;
          G.order = makeOrder(G.rng, G.orderIdx);
        }
        renderOrder();
      }
    }
    updateHUD();
  }

  function hitWasp(o, angle, stroke) {
    G.stats.wasps++;
    sfx.wasp();
    splash(o.x, o.y, '#ffd84d', 12, angle);
    if (!S().motion) G.shake = .35;
    if (stroke) { stroke.count = 0; stroke.kinds.clear(); }
    if (G.mode === 'timed') {
      G.timeLeft = Math.max(0, G.timeLeft - 5);
      addText(t('timeLost'), o.x, o.y, '#ff6b7d', 34);
      announce(t('timeLost'));
    } else {
      loseLife(o.x, o.y);
    }
    updateHUD();
  }
  function loseLife(x, y) {
    if (G.mode === 'zen' || G.mode === 'timed') return;
    G.lives = Math.max(0, G.lives - 1);
    addText(t('lifeLost'), x, y, '#ff6b7d', 26);
    announce(`${t('lifeLost')}. ${t('lives')(G.lives)}.`);
    const lost = $$('#hud-lives i')[G.lives];
    if (lost) { lost.classList.remove('hit'); void lost.offsetWidth; lost.classList.add('hit'); }
    if (G.lives <= 0) { const rid = G.round; setTimeout(() => { if (G.round === rid) endRound(); }, 450); }
  }

  function finishStroke(stroke) {
    if (stroke.count >= 3) {
      const bonus = stroke.count * G.mult;
      G.score += bonus;
      G.stats.bestCombo = Math.max(G.stats.bestCombo, stroke.count);
      addText(`${t('combo')(stroke.count)} +${bonus}`, stroke.lx, stroke.ly - 40, '#ffc83d', 32);
      sfx.combo(stroke.count);
      updateHUD();
    } else if (stroke.count > 0) {
      G.stats.bestCombo = Math.max(G.stats.bestCombo, stroke.count);
    }
    stroke.count = 0; stroke.kinds.clear();
  }

  /* =====================================================================
     Input
     ===================================================================== */
  function newStroke() { return { pts: [], count: 0, kinds: new Set(), lastHit: 0, lx: 0, ly: 0, down: true }; }
  canvas.addEventListener('pointerdown', e => {
    audio();
    if (!G.playing || G.paused) return;
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch { /* ignorat */ }
    const s = newStroke();
    s.pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    strokes.set(e.pointerId, s);
    if (S().tap) tapCut(s, e.clientX, e.clientY);
  });
  canvas.addEventListener('pointermove', e => {
    const s = strokes.get(e.pointerId);
    if (!s) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of (evs.length ? evs : [e])) {
      const now = performance.now();
      const last = s.pts[s.pts.length - 1];
      const p = { x: ev.clientX, y: ev.clientY, t: now };
      const dist = Math.hypot(p.x - last.x, p.y - last.y);
      if (dist < 1) continue;
      const dt = Math.max(1, now - last.t) / 1000;
      const fast = S().tap || dist / dt > 220 || dist > R * .6;
      tryCut(s, last.x, last.y, p.x, p.y, fast);
      s.pts.push(p);
      if (s.pts.length > 40) s.pts.shift();
    }
  });
  function endPointer(e) {
    const s = strokes.get(e.pointerId);
    if (!s) return;
    finishStroke(s);
    s.down = false;
    setTimeout(() => { if (strokes.get(e.pointerId) === s) strokes.delete(e.pointerId); }, 200);
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);

  /* =====================================================================
     Bucla de joc
     ===================================================================== */
  let lastT = performance.now();
  function loop(now) {
    const realDt = Math.min(.05, (now - lastT) / 1000);
    lastT = now;
    if (!G.paused) update(realDt);
    draw();
    requestAnimationFrame(loop);
  }

  function update(realDt) {
    const ts = S().slow ? .7 : 1;
    const dt = realDt * ts;
    const g = gravity();

    if (G.playing) {
      G.t += dt;
      // timp
      if (G.mode !== 'classic') {
        G.timeLeft -= realDt;
        if (G.timeLeft <= 10 && !G.lowWarned) { G.lowWarned = true; announce(t('timeLow')); sfx.tick(); }
        if (G.timeLeft <= 0) { G.timeLeft = 0; endRound(); }
      }
      if (G.multLeft > 0) { G.multLeft -= realDt; if (G.multLeft <= 0) { G.mult = 1; updateHUD(); } }
      // generare
      G.spawnIn -= dt;
      if (G.spawnIn <= 0) spawnWave();
      for (let i = G.queue.length - 1; i >= 0; i--) {
        const q = G.queue[i];
        if (G.t >= q.at) { G.queue.splice(i, 1); launch(q.type, q.kind, { x: q.x }); }
      }
      // combo după pauză în mișcare
      const nowMs = performance.now();
      strokes.forEach(s => { if (s.count && nowMs - s.lastHit > 380) finishStroke(s); });
      if (Math.ceil(G.timeLeft) !== hudTime) updateHUD();
    } else if (!G.over) {
      // fructe ambientale în meniu
      ambientIn -= dt;
      if (ambientIn <= 0 && G.objects.length < 4) { launch('fruit', Math.floor(Math.random() * 4), { peak: rand(H * .25, H * .55) }); ambientIn = rand(1.1, 2); }
    }

    for (let i = G.objects.length - 1; i >= 0; i--) {
      const o = G.objects[i];
      o.age += dt;
      o.vy += g * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.rot += o.spin * dt;
      if (o.type === 'wasp') o.x += Math.sin(o.age * 9) * 40 * dt;
      if (o.y > H + o.r * 2.2 && o.vy > 0) {
        G.objects.splice(i, 1);
        if (G.playing && o.type === 'fruit') {
          G.stats.missed++;
          if (G.mode === 'classic') { sfx.miss(); addText(t('missed'), o.x, H - 60, '#ff6b7d', 22); loseLife(o.x, H - 90); updateHUD(); }
        }
      }
    }
    for (let i = G.halves.length - 1; i >= 0; i--) {
      const h = G.halves[i];
      h.vy += g * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.rot += h.spin * dt; h.life -= dt;
      if (h.y > H + h.r * 3 || h.life <= 0) G.halves.splice(i, 1);
    }
    for (let i = G.parts.length - 1; i >= 0; i--) {
      const p = G.parts[i];
      p.vy += g * .8 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) G.parts.splice(i, 1);
    }
    for (let i = G.texts.length - 1; i >= 0; i--) {
      const x = G.texts[i]; x.life -= realDt; x.y -= 40 * realDt;
      if (x.life <= 0) G.texts.splice(i, 1);
    }
    if (G.shake > 0) G.shake = Math.max(0, G.shake - realDt);
    // petele se estompează
    stx.save(); stx.setTransform(1, 0, 0, 1, 0, 0);
    stx.globalCompositeOperation = 'destination-out';
    stx.fillStyle = `rgba(0,0,0,${(realDt * .25).toFixed(4)})`;
    stx.fillRect(0, 0, stain.width, stain.height);
    stx.restore();
  }

  function sprite(name) { return SPRITES[S().contrast ? 'hc' : 'normal'][name]; }

  function draw() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(stain, 0, 0);
    ctx.restore();
    ctx.save();
    if (G.shake > 0) ctx.translate(rand(-8, 8) * G.shake / .35, rand(-8, 8) * G.shake / .35);

    // jumătăți
    for (const h of G.halves) {
      const img = sprite(h.sprite);
      const s = h.r * 2.5;
      ctx.save();
      ctx.globalAlpha = clamp(h.life / .4, 0, 1);
      ctx.translate(h.x, h.y); ctx.rotate(h.rot);
      ctx.rotate(h.cut);
      ctx.beginPath(); ctx.rect(-s, h.side < 0 ? -s : 0, s * 2, s); ctx.clip();
      ctx.strokeStyle = h.juice; ctx.lineWidth = Math.max(3, h.r * .14); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-h.r * .75, 0); ctx.lineTo(h.r * .75, 0); ctx.stroke();
      ctx.rotate(-h.cut);
      if (img && img.complete) ctx.drawImage(img, -s / 2, -s / 2, s, s);
      ctx.restore();
    }
    // obiecte întregi
    for (const o of G.objects) {
      const img = sprite(o.type === 'fruit' ? KINDS[o.kind].id : o.type);
      const s = o.r * 2.5;
      ctx.save();
      ctx.translate(o.x, o.y);
      if (o.type === 'gold') {
        const gl = ctx.createRadialGradient(0, 0, 0, 0, 0, o.r * 1.8);
        gl.addColorStop(0, 'rgba(255,200,61,.5)'); gl.addColorStop(1, 'rgba(255,200,61,0)');
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 0, o.r * 1.8, 0, 7); ctx.fill();
      }
      ctx.rotate(o.type === 'wasp' ? Math.sin(o.age * 6) * .25 + (o.vx < 0 ? 0 : 0) : o.rot);
      if (o.type === 'wasp' && o.vx > 0) ctx.scale(-1, 1);
      if (img && img.complete) ctx.drawImage(img, -s / 2, -s / 2, s, s);
      ctx.restore();
    }
    // picături
    for (const p of G.parts) {
      ctx.globalAlpha = clamp(p.life * 1.5, 0, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // urma lamei
    const now = performance.now();
    strokes.forEach(s => {
      const pts = s.pts.filter(p => now - p.t < 150);
      if (pts.length < 2) return;
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 1; i < pts.length; i++) {
          const k = i / pts.length;
          ctx.strokeStyle = pass ? '#fff' : (S().contrast ? '#ffc83d' : 'rgba(255,200,120,.35)');
          ctx.lineWidth = (pass ? 4 : 14) * k + 1;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
        }
      }
    });
    // texte
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const x of G.texts) {
      ctx.globalAlpha = clamp(x.life / .35, 0, 1);
      ctx.font = `800 ${x.size}px ${FONT}`;
      ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(36,16,42,.85)'; ctx.strokeText(x.text, x.x, x.y);
      ctx.fillStyle = x.color; ctx.fillText(x.text, x.x, x.y);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* =====================================================================
     HUD
     ===================================================================== */
  let hudTime = -1;
  function updateHUD() {
    $('#hud-score').textContent = G.score;
    const mult = $('#hud-mult'); mult.hidden = G.mult < 2;
    const time = $('#hud-time');
    time.hidden = G.mode === 'classic';
    hudTime = Math.ceil(G.timeLeft);
    time.textContent = hudTime;
    time.classList.toggle('low', G.timeLeft <= 10);
    const lives = $('#hud-lives');
    const hasLives = G.mode === 'classic' || G.mode === 'recipe';
    lives.hidden = !hasLives;
    if (hasLives) {
      if (lives.children.length !== 3) lives.innerHTML = '<i></i><i></i><i></i>';
      [...lives.children].forEach((el, i) => el.classList.toggle('lost', i >= G.lives));
      lives.setAttribute('aria-label', t('lives')(G.lives));
    }
    $('#hud-bottle-fill').style.height = (G.bottle / BOTTLE_SIZE * 100) + '%';
    $('#hud-bottle-fill').style.background = G.bottleColor;
    $('#hud-bottle').setAttribute('aria-label', t('bottleAria')(G.bottle));
    $('#hud-bottles').textContent = G.stats ? G.stats.bottles : 0;
  }
  function renderOrder() {
    const el = $('#hud-order');
    el.hidden = G.mode !== 'recipe' || !G.order;
    if (el.hidden) return;
    el.innerHTML = G.order.items.map(i =>
      `<div class="order-item${i.got >= i.need ? ' done' : ''}"><img src="${sprite(KINDS[i.k].id).src}" alt=""><span>${Math.min(i.got, i.need)}/${i.need}</span></div>`).join('');
    el.setAttribute('aria-label', t('orderAria')(G.order.items.map(i => `${t('fruit')[KINDS[i.k].id]} ${Math.min(i.got, i.need)}/${i.need}`).join(', ')));
    el.setAttribute('role', 'status');
  }

  /* =====================================================================
     Runde
     ===================================================================== */
  function startRound(mode) {
    audio();
    G.round = (G.round || 0) + 1;
    G.mode = mode; G.playing = true; G.paused = false; G.over = false;
    G.t = 0; G.score = 0; G.lives = 3; G.timeLeft = mode === 'timed' ? 60 : 90;
    G.objects = []; G.halves = []; G.parts = []; G.texts = []; G.queue = [];
    G.spawnIn = .8; G.lastGold = -99; G.mult = 1; G.multLeft = 0; G.shake = 0; G.lowWarned = false;
    G.bottle = 0; G.bottleColor = KINDS[0].juice;
    G.stats = newStats(mode);
    G.rng = mulberry32(dailySeed());
    G.orderIdx = 0;
    G.order = mode === 'recipe' ? makeOrder(G.rng, 0) : null;
    strokes.clear();
    stx.save(); stx.setTransform(1, 0, 0, 1, 0, 0); stx.clearRect(0, 0, stain.width, stain.height); stx.restore();
    $('#menu').hidden = true; $('#over').hidden = true; $('#pause').hidden = true;
    $('#hud').hidden = false;
    updateHUD(); renderOrder();
    announce(t('started')(t('m_' + mode)));
    canvas.focus?.();
  }

  function endRound() {
    if (!G.playing) return;
    G.playing = false; G.over = true;
    strokes.forEach(finishStroke);
    strokes.clear();
    const r = G.stats; r.score = G.score;
    const prevBest = save.best[G.mode];
    const isBest = G.score > prevBest;
    if (isBest) save.best[G.mode] = G.score;
    save.total.fruits += r.sliced; save.total.bottles += r.bottles; save.total.rounds++;
    const fresh = ACH_IDS.filter(id => !save.ach.includes(id) && ACH_CHECK[id](r, save));
    save.ach.push(...fresh);
    persist();
    sfx.over();

    $('#over-mode').textContent = t('m_' + G.mode);
    $('#over-title').textContent = G.score;
    const bestEl = $('#over-best');
    bestEl.textContent = isBest && G.score > 0 ? t('newBest') : t('bestWas')(save.best[G.mode]);
    bestEl.classList.toggle('new', isBest && G.score > 0);
    const rows = [['st_fruits', r.sliced], ['st_combo', r.bestCombo], ['st_bottles', r.bottles]];
    if (G.mode === 'recipe') rows.push(['st_orders', r.orders]);
    else if (G.mode === 'classic') rows.push(['st_missed', r.missed]);
    if (G.mode !== 'zen') rows.push(['st_wasps', r.wasps]);
    $('#over-stats').innerHTML = rows.map(([k, v]) => `<div><dt>${t(k)}</dt><dd>${v}</dd></div>`).join('');
    $('#over-ach').innerHTML = fresh.map(id => `<li>${t('ach')[id][0]}<small>${t('ach')[id][1]}</small></li>`).join('');
    const rid = G.round;
    setTimeout(() => {
      if (!G.over || G.round !== rid) return;
      $('#hud').hidden = true;
      $('#over').hidden = false;
      $('#btn-again').focus();
      announce(t('gameOverAnn')(G.score));
    }, 500);
    renderMenu();
  }

  function pause() {
    if (!G.playing || G.paused) return;
    G.paused = true;
    strokes.clear();
    $('#pause').hidden = false;
    $('#btn-resume').focus();
  }
  function resume() {
    if (!G.paused) return;
    G.paused = false;
    $('#pause').hidden = true;
    lastT = performance.now();
  }
  function toMenu() {
    G.round = (G.round || 0) + 1;
    G.playing = false; G.paused = false; G.over = false; G.mode = null;
    G.objects = []; G.halves = []; G.queue = [];
    $('#pause').hidden = true; $('#over').hidden = true; $('#hud').hidden = true;
    $('#menu').hidden = false;
    renderMenu();
    $('.mode').focus();
  }

  /* =====================================================================
     Meniu, dialoguri, limbă
     ===================================================================== */
  function renderMenu() {
    $$('[data-best]').forEach(el => { el.textContent = save.best[el.dataset.best]; });
    $('#ach-count').textContent = `${save.ach.length}/${ACH_IDS.length}`;
    $('#menu-stats').textContent = t('menuStats')(save.total.fruits, save.total.bottles, save.total.rounds);
    $('#ach-list').innerHTML = ACH_IDS.map(id => `<li class="${save.ach.includes(id) ? 'got' : ''}"><span><b>${t('ach')[id][0]}</b><small>${t('ach')[id][1]}</small></span></li>`).join('');
    $('#how-list').innerHTML = t('howList').map(([s, txt]) => `<li><img src="${sprite(s).src}" alt=""><span>${txt}</span></li>`).join('');
  }
  function applySettings() {
    document.body.classList.toggle('hc', S().contrast);
    $('#set-sound').checked = S().sound;
    $('#set-slow').checked = S().slow;
    $('#set-tap').checked = S().tap;
    $('#set-contrast').checked = S().contrast;
    $('#set-motion').checked = S().motion;
    paintBackground();
  }
  function applyLang() {
    document.documentElement.lang = lang;
    document.title = lang === 'en' ? 'LIVADA: The Harvest — fruit-slicing game | Laura Andreea' : 'LIVADA: Culesul — joc de tăiat fructe | Laura Andreea';
    $$('[data-i18n]').forEach(el => { const v = I18N[lang][el.dataset.i18n]; if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-attr]').forEach(el => { const [a, k] = el.dataset.i18nAttr.split(':'); el.setAttribute(a, t(k)); });
    $('#lang').textContent = t('langBtn');
    $('#lang').setAttribute('aria-label', t('langLabel'));
    $('.back').href = lang === 'en' ? '../?lang=en' : '../';
    renderMenu();
    if (G.playing) { updateHUD(); renderOrder(); }
  }

  $$('.mode').forEach(b => b.addEventListener('click', () => startRound(b.dataset.mode)));
  $$('[data-open]').forEach(b => b.addEventListener('click', () => { const d = $('#' + b.dataset.open); if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }));
  $('#lang').addEventListener('click', () => {
    lang = lang === 'ro' ? 'en' : 'ro'; save.lang = lang; persist();
    const u = new URL(location.href); u.searchParams.set('lang', lang); history.replaceState(null, '', u);
    applyLang();
  });
  const bindSetting = (id, key) => $(id).addEventListener('change', e => { save.settings[key] = e.target.checked; persist(); applySettings(); if (key === 'contrast') renderMenu(); });
  bindSetting('#set-sound', 'sound');
  bindSetting('#set-slow', 'slow');
  bindSetting('#set-tap', 'tap');
  bindSetting('#set-contrast', 'contrast');
  bindSetting('#set-motion', 'motion');
  $('#btn-reset').addEventListener('click', () => {
    if (!window.confirm(t('resetConfirm'))) return;
    const keep = { settings: save.settings, lang: save.lang };
    save = { ...defaults(), ...keep };
    persist(); renderMenu();
  });
  $('#btn-pause').addEventListener('click', pause);
  $('#btn-resume').addEventListener('click', resume);
  $('#btn-restart').addEventListener('click', () => startRound(G.mode));
  $('#btn-quit').addEventListener('click', toMenu);
  $('#btn-again').addEventListener('click', () => startRound(G.mode));
  $('#btn-menu').addEventListener('click', toMenu);
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      if (G.playing && !G.paused) { e.preventDefault(); pause(); }
      else if (G.paused && e.key !== 'Escape') resume();
      else if (G.paused && e.key === 'Escape') { e.preventDefault(); resume(); }
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('blur', pause);
  window.addEventListener('resize', resize);

  // hook pentru teste automate (fără efect în joc)
  window.__culesul = { G, save: () => save, start: startRound, end: endRound, launch: (type, kind, x, peak) => launch(type, kind, { x, peak }), version: VERSION };

  /* ---------- PWA ---------- */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  resize();
  applySettings();
  applyLang();
  spriteReady.then(() => { renderMenu(); });
  requestAnimationFrame(loop);
  const startMode = params.get('mode');
  if (MODES.includes(startMode)) spriteReady.then(() => startRound(startMode));
})();
