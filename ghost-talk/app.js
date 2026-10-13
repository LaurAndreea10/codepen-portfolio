/* Ghost Talk v3 — interface. Depends on engine.js (window.Ghost) and ghost.spec.js (window.GhostSuite). */
(function () {
  'use strict';
  const G = window.Ghost;
  const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
  const KEY = 'ghosttalk:v3';
  const CANONICAL = 'https://laurandreea10.github.io/codepen-portfolio/ghost-talk/';

  /* ======================= State ======================= */
  function load() {
    for (const k of [KEY, 'ghosttalk:v2']) { try { const v = localStorage.getItem(k); if (v) return G.normalizeState(JSON.parse(v)); } catch {} }
    let legacy = {};
    try { legacy = JSON.parse(localStorage.getItem('ghostTalk') || '{}') || {}; } catch {}
    ['lang', 'dialect', 'level', 'log'].forEach(k => { try { const v = localStorage.getItem('ghosttalk:' + k); if (v != null) legacy[k] = JSON.parse(v); } catch {} });
    return G.normalizeState(legacy);
  }
  let fresh = true;
  try { fresh = !localStorage.getItem(KEY) && !localStorage.getItem('ghosttalk:v2') && !localStorage.getItem('ghostTalk'); } catch {}
  let S = load();
  if (fresh && matchMedia('(max-width: 640px)').matches) S.effects = false;   // lighter first visit on phones
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
  const L = (ro, en) => S.lang === 'ro' ? ro : en;
  const T = pair => pair[S.lang === 'ro' ? 0 : 1];
  const reduceOS = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = () => S.motion || reduceOS;
  const fxOff = () => still() || !S.effects;
  const today = () => G.dayKey(Date.now());

  /* ======================= Copy ======================= */
  const META = {
    codepen: { n: ['Regula oficială', 'Official rule'], d: ['Regula provocării, din ghosttalk.js: vocală la început → „-boo” (owl → owl-boo); consoană → prima literă trece la final + „oo” (candy → andy-coo). Păstrează majusculele și punctuația. Nivelul EMF nu o schimbă.', 'The challenge rule, from ghosttalk.js: a vowel first → “-boo” (owl → owl-boo); a consonant first → that letter moves to the end + “oo” (candy → andy-coo). Capitals and punctuation are kept. The EMF level doesn’t change it.'], s: 'andy-coo' },
    classic: { n: ['Clasic', 'Classic'], d: ['Vocale prelungite și câte un 〰 pe fiecare nivel EMF.', 'Stretched vowels and one 〰 per EMF level.'], s: 'Booo〰' },
    mirror: { n: ['Oglindă', 'Mirror'], d: ['Vorbește de dincolo de oglindă, de la coadă la cap.', 'Speaks from behind the glass, back to front.'], s: '⟲ oob' },
    secret: { n: ['Cod secret', 'Secret code'], d: ['Fiecare literă devine un cod hexazecimal. Fantoma citește cu voce tare mesajul original.', 'Every letter becomes a hex code. The ghost reads the original message aloud.'], s: '🔐 62-6f-6f' },
    morse: { n: ['Spirit Box', 'Spirit Box'], d: ['Morse prin radioul vânătorilor de fantome: bu = punct, buuu = linie. Majusculele se pierd.', 'Morse through a ghost hunter’s radio: bu = dot, buuu = dash. Capitals are lost.'], s: '📻 bu-bu-bu' },
    runic: { n: ['Runic', 'Runic'], d: ['Alfabetul futhark, cu rune separate pentru ă, â, î, ș, ț. Majusculele se pierd.', 'The futhark alphabet, with separate runes for ă, â, î, ș, ț. Capitals are lost.'], s: '᛭ ᛒᛟᛟ' },
    emoji: { n: ['Emoji', 'Emoji'], d: ['Fiecare literă devine un emoji de Halloween. Majusculele se pierd.', 'Every letter becomes a Halloween emoji. Capitals are lost.'], s: '🎭 🦴🎃🎃' },
    poltergeist: { n: ['Poltergeist', 'Poltergeist'], d: ['Litere bântuite de semne care se înmulțesc cu nivelul. Fără semne, textul revine exact.', 'Letters possessed by marks that multiply with the level. Strip them and the text comes back exactly.'], s: 'b̷̛o̴͝o̸̕' },
    whisper: { n: ['Șoaptă', 'Whisper'], d: ['Totul încet, s devine sh, iar „psst” crește cu nivelul.', 'All hushed, s turns to sh, and the “psst” grows with the level.'], s: 'psst… shuu…' },
    banshee: { n: ['Banshee', 'Banshee'], d: ['Urlet cu majuscule și semne de exclamare.', 'A wail in capitals with exclamation marks.'], s: 'BOOOoo!!!' },
    strigoi: { n: ['Strigoi', 'Strigoi'], d: ['Din folclorul românesc: r rostogolit, voce clătinată. Așa vorbește Zăbrel.', 'From Romanian folklore: rolled r, wobbling voice. This is how Zăbrel talks.'], s: 'rrAr …brrr' },
    sleepy: { n: ['Somnoroasă', 'Sleepy'], d: ['Căscat lung și sforăit la final.', 'Long yawns and a snore at the end.'], s: 'buuun… zzz' },
    vampire: { n: ['Vampir', 'Vampire'], d: ['Accent transilvănean: w devine v, th devine z, plus un râs la final.', 'Transylvanian accent: w becomes v, th becomes z, plus a laugh at the end.'], s: '🦇 … mwahaha!' },
    victorian: { n: ['Victorian', 'Victorian'], d: ['Vorbă de conac: thee, thy, dumneata, închinăciune.', 'Manor talk: thee, thy, prithee, most honoured.'], s: '📜 Hark, amice' },
    echo: { n: ['Ecou', 'Echo'], d: ['Ultima silabă a fiecărui cuvânt se repetă ca într-o criptă.', 'The last syllable of every word echoes as if in a crypt.'], s: 'noapte-te-te' }
  };
  const dn = d => T(META[d].n);
  const CHIPS = {
    ro: ['owl candy witch pumpkin', 'Bună seara, muritorule', 'Bu!', 'Unde e bomboana mea?', 'Nu mă vezi, dar sunt aici', 'Salut prietene, tu ești?'],
    en: ['owl candy witch pumpkin', 'Happy Halloween', 'Boo!', 'Trick or treat', 'Who goes there?', 'Hello friend, are you there?']
  };
  const ERR = {
    SIGIL: ['Textul conține deja simboluri ale acestui dialect. Șterge-le sau alege alt dialect.', 'Your text already contains this dialect’s symbols. Remove them or pick another dialect.'],
    NOSIG: ['Nu recunosc fantoma. Lipește un mesaj tradus de Ghost Talk, întreg.', 'I don’t recognise this ghost. Paste a whole message translated by Ghost Talk.'],
    BROKEN: ['Mesajul e rupt: nu se potrivește cu regula dialectului. Verifică dacă l-ai copiat întreg.', 'The message is broken: it doesn’t match the dialect’s rule. Check that you copied all of it.'],
    DIALECT: ['Dialect necunoscut.', 'Unknown dialect.']
  };
  const GAME_INFO = {
    guess: [['Ghicește cuvântul', 'Guess the word'], ['Fantoma spune un cuvânt în dialectul ales. Scrie-l pe limba oamenilor.', 'The ghost says a word in the chosen dialect. Write it in human words.']],
    typing: [['Tastare fantomatică', 'Ghost typing'], ['Scrie cuvântul pe limba fantomei: dublează fiecare vocală (la Coșmar, triplează). Fără 〰.', 'Write the word in ghost: double every vowel (triple on Nightmare). No 〰.']],
    memory: [['Memorie de ecou', 'Echo memory'], ['Ține minte cifrele. Dispar după 3 secunde; scrie-le sau apasă butoanele.', 'Remember the digits. They vanish after 3 seconds; type them or tap the pads.']],
    letters: [['Litere bântuite', 'Haunted letters'], ['Literele vin de-a-ndoaselea. Reconstruiește cuvântul.', 'The letters come back to front. Rebuild the word.']],
    secret: [['Ședința secretă', 'Secret séance'], ['Descifrează codul hex al fantomei.', 'Crack the ghost’s hex code.']],
    choir: [['Corul fantomelor', 'Ghost choir'], ['Ascultă notele și repetă-le cu butoanele 1–4. Ai nevoie de sunet.', 'Listen to the notes and repeat them with pads 1–4. Sound needed.']],
    boo: [['BooScary', 'BooScary'], ['Multiplu de 3 → Boo, de 5 → Scary, de ambele → BooScary, altfel numărul.', 'Multiple of 3 → Boo, of 5 → Scary, of both → BooScary, otherwise the number.']],
    hangman: [['Spânzurătoarea fantomatică', 'Ghostly hangman'], ['Alege litere. La fiecare greșeală, fantoma se estompează puțin.', 'Pick letters. With every miss, the ghost fades a little.']],
    daily: [['Puzzle-ul zilei', 'Daily puzzle'], ['Un cuvânt pe zi, 6 încercări. Verde = literă la locul ei, galben = în cuvânt, gri = lipsește. La final copiezi rezultatul în pătrățele.', 'One word a day, 6 tries. Green = right spot, yellow = in the word, grey = missing. When you finish, copy your result as squares.']],
    vocab: [['Vocabular RO / EN', 'RO / EN vocabulary'], ['Tradu cuvântul în limba interfeței.', 'Translate the word into the interface language.']],
    arcade: [['Arcade', 'Arcade'], ['Runde amestecate la rând, 3 vieți. Câte puncte faci?', 'Mixed rounds back to back, 3 lives. How far can you go?']],
    duo: [['Doi jucători', 'Two players'], ['Jucătorul 1 ascunde un cuvânt, fantoma îl traduce, Jucătorul 2 îl ghicește.', 'Player 1 hides a word, the ghost translates it, Player 2 guesses it.']]
  };
  const BADGE_NAMES = { new: ['Spirit nou', 'New spirit'], echo: ['Explorator de ecouri', 'Echo explorer'], master: ['Maestru fantomă', 'Ghost master'], banshee: ['Banshee de onoare', 'Honorary banshee'], legend: ['Legendă bântuită', 'Haunted legend'] };
  const HAT_NAMES = { none: ['Fără pălărie', 'No hat'], top: ['Joben', 'Top hat'], crown: ['Coroană', 'Crown'], wizard: ['Vrăjitor', 'Wizard'] };
  const EXTRA_NAMES = { none: ['Nimic', 'Nothing'], scarf: ['Fular', 'Scarf'], glasses: ['Ochelari', 'Glasses'], lantern: ['Felinar', 'Lantern'] };
  const COLOR_NAMES = { auto: ['Ca dialectul', 'Match dialect'], lavender: ['Lavandă', 'Lavender'], mint: ['Mentă', 'Mint'], candy: ['Bomboană', 'Candy'], ember: ['Jar', 'Ember'], gold: ['Aur', 'Gold'] };
  const DECOR_NAMES = { night: ['Cer înstelat', 'Starry sky'], castle: ['Castel', 'Castle'], forest: ['Pădure', 'Forest'], pumpkins: ['Dovleci', 'Pumpkins'] };
  const MOOD_NAMES = { happy: ['fericit', 'happy'], bored: ['plictisit', 'bored'], sleepy: ['somnoros', 'sleepy'], excited: ['entuziasmat', 'excited'] };
  const ACH = {
    'first-words': [['Primele cuvinte', 'First words'], ['prima traducere', 'your first translation']],
    chatterbox: [['Gură-spartă', 'Chatterbox'], ['100 de traduceri', '100 translations']],
    polyglot: [['Poliglot', 'Polyglot'], ['toate cele 15 dialecte', 'all 15 dialects']],
    'streak-10': [['Serie de 10', 'Streak of 10'], ['10 răspunsuri corecte la rând', '10 correct answers in a row']],
    storyteller: [['Povestitor', 'Storyteller'], ['toate cele 5 finaluri', 'all 5 endings']],
    'first-ending': [['Primul final', 'First ending'], ['ai terminat povestea o dată', 'you finished the story once']],
    hangman: [['Salvatorul fantomei', 'Ghost saver'], ['o spânzurătoare câștigată', 'a hangman win']],
    'arcade-10': [['Arcade 10', 'Arcade 10'], ['10 puncte într-o partidă', '10 points in one run']],
    daily: [['Provocarea zilei', 'Daily solver'], ['un puzzle zilnic rezolvat', 'a daily puzzle solved']],
    collector: [['Colecționar', 'Collector'], ['5 mesaje favorite', '5 favorite messages']],
    artist: [['Artist', 'Artist'], ['primul card PNG', 'your first PNG card']],
    thereminist: [['Teremist', 'Thereminist'], ['ai cântat la teremin', 'you played the theremin']],
    alchemist: [['Alchimist', 'Alchemist'], ['ai folosit un lanț de dialecte', 'you used a dialect chain']],
    critic: [['Critic', 'Critic'], ['ai comparat toate dialectele', 'you compared every dialect']]
  };

  /* ======================= Look & language ======================= */
  let fogColor = '191,244,255';
  function applyLook() {
    const r = document.documentElement;
    r.lang = S.lang;
    r.classList.toggle('dawn', S.theme === 'dawn' && !S.contrast);
    r.classList.toggle('contrast', S.contrast);
    r.classList.toggle('still', still());
    r.classList.toggle('no-fx', !S.effects);
    r.classList.toggle('lexend', S.font === 'lexend');
    r.style.setProperty('--scale', String(S.scale));
    $('#h-theme').setAttribute('aria-pressed', String(S.theme === 'dawn'));
    $('#h-sound').setAttribute('aria-pressed', String(S.sfx));
    fogColor = getComputedStyle(r).getPropertyValue('--fog').trim() || '191,244,255';
    if (!S.effects) return;
    if (still()) drawFog(); else fogLoop();
  }
  function i18n() {
    $$('[data-ro]').forEach(el => { el.textContent = el.dataset[S.lang]; });
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === S.lang)));
    $('#human').placeholder = mode === 'encode' ? L('Scrie un cuvânt…', 'Type a word…') : L('Lipește un mesaj fantomatic…', 'Paste a ghostly message…');
    $('#human-label').textContent = mode === 'encode' ? L('Tu spui', 'You say') : L('Fantoma spune', 'The ghost says');
    $('.pad[data-n="back"]').setAttribute('aria-label', L('Șterge ultima cifră', 'Delete last digit'));
    $('#version').textContent = G.VERSION;
  }

  /* ======================= Tabs ======================= */
  const tabs = [...$$('[role=tab]')];
  function setTab(id, focus) {
    if (!G.TABS.includes(id)) id = 'talk';
    S.tab = id; save();
    tabs.forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    $$('[role=tabpanel]').forEach(p => { p.hidden = p.id !== 'p-' + id; });
    if (id === 'tests' && !lastRun) runTests();
    if (id === 'play' && !round) newRound();
    renderBubble();
  }
  tabs.forEach((b, i) => {
    b.onclick = () => setTab(b.dataset.tab);
    b.onkeydown = e => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); setTab(tabs[(i + k + tabs.length) % tabs.length].dataset.tab, true); }
      if (e.key === 'Home') { e.preventDefault(); setTab(tabs[0].dataset.tab, true); }
      if (e.key === 'End') { e.preventDefault(); setTab(tabs[tabs.length - 1].dataset.tab, true); }
    };
  });
  $('#foot-tests').onclick = e => { e.preventDefault(); setTab('tests'); $('.panel').scrollIntoView({ behavior: still() ? 'auto' : 'smooth' }); };

  /* ======================= Translator ======================= */
  let mode = 'encode';
  const cur = { src: '', out: '', err: '', d: 'classic', note: '' };
  function buildDialects() {
    [['#dg-rule', ['codepen']], ['#dg-rev', G.REVERSIBLE], ['#dg-one', G.ONE_WAY.filter(d => d !== 'codepen')]].forEach(([sel, keys]) => {
      const box = $(sel + ' .dchips'); box.innerHTML = '';
      keys.forEach(key => {
        const lab = document.createElement('label');
        lab.innerHTML = `<input type="radio" name="dialect" id="d-${key}" value="${key}"><span class="dchip"><span class="nm"></span></span>`;
        box.append(lab);
      });
    });
  }
  buildDialects();
  $('#dialect-box').addEventListener('change', e => {
    if (e.target.name !== 'dialect') return;
    S.dialect = e.target.value; save(); renderDialects(); compute();
    if (S.tab === 'play' && round && round.game === 'guess') newRound();
  });
  function renderDialects() {
    G.list().forEach(key => { const input = document.getElementById('d-' + key); input.checked = key === S.dialect; input.nextElementSibling.querySelector('.nm').textContent = dn(key); });
    const m = META[S.dialect];
    $('#dialect-desc').innerHTML = '';
    $('#dialect-desc').append(T(m.d) + ' ', Object.assign(document.createElement('code'), { textContent: m.s }));
    $('#level').value = S.level;
    ['#chain-1', '#chain-2'].forEach((sel, i) => {
      const el = $(sel); el.innerHTML = '';
      el.append(new Option(L(`${i + 2}. — fără —`, `${i + 2}. — none —`), ''));
      G.list().forEach(d => el.append(new Option(`${i + 2}. ${dn(d)}`, d)));
      el.value = S.chain[i] || '';
      el.disabled = i === 1 && !S.chain[0];
    });
  }
  function chainChange() {
    const a = $('#chain-1').value, b = $('#chain-2').value;
    S.chain = [a, a ? b : ''].filter(Boolean); save(); renderDialects(); compute();
  }
  $('#chain-1').onchange = chainChange; $('#chain-2').onchange = chainChange;

  function renderChips() {
    const box = $('#chips'); box.innerHTML = '';
    CHIPS[S.lang].forEach(p => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = p;
      b.onclick = () => { if (mode !== 'encode') setMode('encode', false); $('#human').value = p; compute(); queueLog(); };
      box.append(b);
    });
  }
  function setMode(m, carry = true) {
    const out = !cur.err && cur.out;
    mode = m;
    $('#m-enc').setAttribute('aria-pressed', String(m === 'encode'));
    $('#m-dec').setAttribute('aria-pressed', String(m === 'decode'));
    if (carry && out) $('#human').value = out;
    i18n(); compute();
  }
  $('#m-enc').onclick = () => mode !== 'encode' && setMode('encode');
  $('#m-dec').onclick = () => mode !== 'decode' && setMode('decode');
  $('#level').addEventListener('input', e => { S.level = +e.target.value; save(); compute(); });
  $('#human').addEventListener('input', () => { compute(); queueLog(); });
  $('#clear').onclick = () => { $('#human').value = ''; compute(); $('#human').focus(); };
  const peel = Object.assign(document.createElement('button'), { type: 'button', className: 'btn small', id: 'peel', hidden: true });
  $('#clear').after(peel);
  peel.onclick = () => { $('#human').value = cur.out; compute(); };

  function compute() {
    const src = $('#human').value;
    Object.assign(cur, { src, out: '', err: '', note: '' });
    let n = S.level;
    try {
      if (mode === 'encode') {
        cur.d = S.dialect;
        cur.out = G.chain(src, [S.dialect, ...S.chain], S.level);
        if (S.chain.length && cur.out) cur.note = L('Lanț: ', 'Chain: ') + [S.dialect, ...S.chain].map(dn).join(' → ');
      } else if (src.trim()) {
        const r = G.decodeAny(src);
        cur.out = r.text; cur.d = r.dialect;
        cur.note = L(`Dialect recunoscut: ${dn(r.dialect)} · `, `Recognised dialect: ${dn(r.dialect)} · `) + (r.exact ? L('traducere exactă', 'exact translation') : L('traducere aproximativă: dialectul pierde informație', 'approximate translation: this dialect loses information'));
        if (r.dialect === 'classic') n = (src.trim().match(/〰+$/) || [''])[0].length || n;
      } else cur.d = 'classic';
    } catch (e) { cur.err = T(ERR[e.code] || [e.message, e.message]); cur.d = mode === 'encode' ? S.dialect : 'classic'; }
    const more = mode === 'decode' && !cur.err && cur.out && G.identify(cur.out);
    peel.hidden = !more;
    if (more) peel.textContent = L(`Desface încă un strat (${dn(more)})`, `Peel another layer (${dn(more)})`);
    $$('.led').forEach((l, i) => l.classList.toggle('on', i < n));
    $('#emf-read').textContent = `${n} / 5`;
    $('#level').disabled = mode === 'decode' || (S.dialect === 'codepen' && !S.chain.length);
    if ($('#compare-box').open) renderCompare();
    renderSteps();
    renderBubble();
  }

  /* Step-by-step explanation for the challenge rule, from describeWord() in ghosttalk.js */
  function explainWord(d) {
    if (d.rule === 'none') return L('nu are litere, rămâne la fel', 'no letters to translate, so it stays the same');
    let why = d.rule === 'vowel'
      ? L(`începe cu vocala „${d.first}”, deci primește „-boo”`, `starts with the vowel “${d.first}”, so it gets “-boo”`)
      : L(`începe cu consoana „${d.first}”, deci „${d.moved}” trece la final și primește „oo”`, `starts with the consonant “${d.first}”, so “${d.moved}” moves to the end and gets “oo”`);
    if (d.capital) why += L('; majuscula rămâne în față', '; the capital stays at the front');
    if (d.before || d.after) why += L(`; „${d.before}${d.after}” rămâne pe loc`, `; “${d.before}${d.after}” stays in place`);
    return why;
  }
  function renderSteps() {
    const show = mode === 'encode' && S.dialect === 'codepen' && !S.chain.length && typeof window.describeWord === 'function';
    $('#steps-box').hidden = !show;
    if (!show) return;
    const words = cur.src.split(/\s+/).filter(Boolean).slice(0, 12);
    $('#steps').replaceChildren(...words.map(word => {
      const d = window.describeWord(word), li = document.createElement('li');
      const from = document.createElement('code'), to = document.createElement('code');
      from.textContent = word; to.textContent = d.result;
      li.append(from, ` ${explainWord(d)} → `, to);
      return li;
    }));
  }

  /* Compare every dialect */
  function renderCompare() {
    const src = mode === 'encode' ? cur.src : cur.out, ul = $('#compare'); ul.innerHTML = '';
    if (!src.trim()) { ul.innerHTML = `<li><p class="empty-note">${L('Scrie ceva în caseta de sus ca să vezi toate dialectele.', 'Type something above to see every dialect.')}</p></li>`; return; }
    G.list().forEach(d => {
      let t; try { t = G.translate(src, d, S.level); } catch (e) { t = T(ERR[e.code] || ['—', '—']); }
      const li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button'; b.innerHTML = '<b></b><span></span>';
      b.querySelector('b').textContent = dn(d); b.querySelector('span').textContent = t.length > 160 ? t.slice(0, 160) + '…' : t;
      b.onclick = () => { S.dialect = d; save(); if (mode !== 'encode') setMode('encode', false); $('#human').value = src; renderDialects(); compute(); toast(L(`Dialect ales: ${dn(d)}`, `Dialect selected: ${dn(d)}`)); };
      li.append(b); ul.append(li);
    });
  }
  let compared = false;
  $('#compare-box').addEventListener('toggle', () => {
    if (!$('#compare-box').open) return;
    renderCompare();
    if (!compared) { compared = true; S.stats.compare++; save(); checkAchievements(); }
  });

  /* Dictation */
  $('#dictate').onclick = () => {
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) return toast(L('Dictarea nu e disponibilă în acest browser.', 'Dictation isn’t available in this browser.'), true);
    try {
      const r = new R(); r.lang = S.lang === 'ro' ? 'ro-RO' : 'en-US';
      r.onresult = e => { if (mode !== 'encode') setMode('encode', false); $('#human').value = e.results[0][0].transcript.slice(0, 1500); compute(); queueLog(); };
      r.onerror = () => toast(L('Dictarea nu a reușit. Verifică permisiunea pentru microfon.', 'Dictation failed. Check the microphone permission.'), true);
      r.start(); toast(L('Te ascult…', 'Listening…'));
    } catch { toast(L('Dictarea nu a reușit.', 'Dictation failed.'), true); }
  };

  /* ======================= The bubble ======================= */
  const out = $('#ghost'), seance = $('#seance');
  const line = { text: '', err: '', speak: '', voice: 'classic', src: '', d: '', human: false };
  let lastPainted = null, presentText = null;
  const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const graphemes = s => seg ? Array.from(seg.segment(s), x => x.segment) : Array.from(s);
  const clean = s => G.stripMarks(s).replace(/[〰⟲᛭]|\u{1F510}|\u{1F4FB}|\u{1F3AD}|\u{1F987}|\u{1F4DC}/gu, '').trim();

  function renderBubble() {
    let label, text = '', err = '', speak = '', voice = S.dialect, src = '', d = '', note = '', human = false;
    if (presentText != null) {
      label = S.name; text = presentText; speak = clean(presentText);
    } else if (S.tab === 'play' && round) {
      label = round.game === 'arcade-over' ? L('Arcade', 'Arcade') : L(`${S.name} te provoacă`, `${S.name} challenges you`);
      text = round.game === 'daily' ? dailyPrompt() : round.game === 'hangman' ? G.hangmanView(round) : round.prompt;
      speak = round.speak ?? clean(text); voice = round.game === 'guess' ? (round.dialect || S.dialect) : 'classic';
      if (round.sub) note = L('Arcade · ', 'Arcade · ') + T(GAME_INFO[round.sub][0]);
    } else if (S.tab === 'story') {
      const node = G.STORY[S.story], rival = node.speaker === 'rival';
      voice = rival ? 'strigoi' : S.dialect;
      label = rival ? L(`${G.RIVAL} spune`, `${G.RIVAL} says`) : L(`${S.name} povestește`, `${S.name} tells the story`);
      src = G.storyText(S.story, S.lang, S.name); d = voice;
      try { text = G.translate(src, voice, S.level); } catch { text = src; }
      speak = src; human = true;
    } else {
      label = mode === 'encode' ? L(`${S.name} spune`, `${S.name} says`) : L('Pe limba oamenilor', 'In human words');
      text = cur.out; err = cur.err; voice = cur.d; note = cur.note;
      const last = mode === 'encode' ? (S.chain[S.chain.length - 1] || S.dialect) : null;
      if (mode === 'decode') { speak = cur.out; human = true; }
      else if (G.dialects[last].speaksHuman) { speak = cur.src; }
      else speak = clean(cur.out);
      if (mode === 'encode') { src = cur.src.trim(); d = S.dialect; } else { src = cur.out; d = cur.d; }
    }
    Object.assign(line, { text, err, speak, voice, src, d, human });
    $('#ghost-label').textContent = label;
    $('#bubble-note').textContent = note;
    paint(text, err);
    seance.dataset.d = voice;
    seance.style.setProperty('--ghost', G.dialects[voice].tint);
    seance.style.setProperty('--ghost-body', S.color === 'auto' ? G.dialects[voice].tint : G.COLORS[S.color][1]);
    const inN = G.chars(cur.src).length, outN = G.chars(text || '').length;
    $('#stats').textContent = S.tab === 'talk' && text && !err ? `${inN} → ${outN} ${L('caractere', 'chars')} · ${L('ectoplasmă', 'ectoplasm')} ×${(outN / Math.max(1, inN)).toFixed(1)}` : '';
    $('#mouth').setAttribute('ry', String(Math.min(20, 5 + outN / 8)));
    $('#mouth').setAttribute('rx', String(Math.min(18, 8 + outN / 20)));
    const fade = S.tab === 'play' && round && round.game === 'hangman' ? 1 - .8 * (round.wrong / round.lives) : 1;
    $('#ghost-wrap').style.opacity = String(fade);
    const none = !text || !!err;
    ['#speak', '#copy', '#png', '#txt', '#share'].forEach(s => { $(s).disabled = none; });
    $('#fav').disabled = none || S.tab === 'play';
  }
  function paint(text, err) {
    if (err) { out.className = 'err'; out.textContent = err; lastPainted = null; return; }
    if (!text) { out.className = 'empty'; out.textContent = L('…tăcere de mormânt. Scrie ceva.', '…dead silence. Type something.'); lastPainted = null; return; }
    out.className = '';
    if (text === lastPainted) return;
    if (fxOff()) { out.textContent = text; lastPainted = text; return; }
    const a = graphemes(lastPainted || ''), b = graphemes(text);
    let same = 0; while (same < a.length && same < b.length && a[same] === b[same]) same++;
    out.textContent = '';
    const frag = document.createDocumentFragment();
    if (same) frag.append(b.slice(0, same).join(''));
    b.slice(same, same + 400).forEach((g, i) => { const s = document.createElement('span'); s.className = 'g'; s.style.animationDelay = (i * 22) + 'ms'; s.textContent = g; frag.append(s); });
    if (b.length > same + 400) frag.append(b.slice(same + 400).join(''));
    out.append(frag);
    lastPainted = text;
  }

  /* ======================= Companion, XP, achievements ======================= */
  function renderPet() {
    seance.dataset.hat = S.hat; seance.dataset.extra = S.extra; seance.dataset.decor = S.decor;
    $('#pet-name').textContent = S.name;
    $('.ghost').setAttribute('aria-label', S.name);
    const { level, into } = G.levelOf(S.xp);
    $('#pet-lvl').textContent = `${L('Nivel', 'Level')} ${level} · ${S.xp} XP`;
    $('#xpbar span').style.width = into + '%';
    $('#xpbar').setAttribute('aria-valuenow', String(into));
    $('#xpbar').setAttribute('aria-label', L(`${into} din 100 XP până la nivelul ${level + 1}`, `${into} of 100 XP to level ${level + 1}`));
    $('#pet-badge').textContent = '✦ ' + T(BADGE_NAMES[G.badgeOf(S.xp)]);
    renderMood();
  }
  function award(n, why) {
    const before = G.levelOf(S.xp).level, badge = G.badgeOf(S.xp);
    S.xp = Math.min(100000, S.xp + n); save(); renderPet(); renderCollection();
    let msg = `+${n} XP${why ? ' · ' + why : ''}`;
    const after = G.levelOf(S.xp).level;
    if (after > before) { msg += L(` · ${S.name} a urcat la nivelul ${after}!`, ` · ${S.name} reached level ${after}!`); confetti(); tone(523, .15); tone(659, .15, .15); tone(784, .3, .3); }
    if (G.badgeOf(S.xp) !== badge) msg += L(` · Insignă nouă: ${T(BADGE_NAMES[G.badgeOf(S.xp)])}`, ` · New badge: ${T(BADGE_NAMES[G.badgeOf(S.xp)])}`);
    toast(msg);
    checkAchievements();
  }
  function checkAchievements() {
    const fresh = G.newAchievements(S);
    if (!fresh.length) return;
    S.achievements.push(...fresh); save();
    const names = fresh.map(id => T(ACH[id][0])).join(', ');
    award(20 * fresh.length, L(`realizare: ${names}`, `achievement: ${names}`));
    confetti();
  }

  /* Mood */
  let lastAct = Date.now();
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, () => { lastAct = Date.now(); if (seance.dataset.mood === 'sleepy' || seance.dataset.mood === 'bored') renderMood(); }, { passive: true }));
  function renderMood() {
    const m = G.moodOf({ hour: new Date().getHours(), idleMs: Date.now() - lastAct, streak });
    seance.dataset.mood = m;
    $('#pet-mood').textContent = L('Stare: ', 'Mood: ') + T(MOOD_NAMES[m]);
  }
  setInterval(renderMood, 5000);

  /* Confetti of ectoplasm */
  const fx = $('#fx'), fxc = fx.getContext('2d');
  let parts = [], fxOn = false;
  function confetti() {
    if (fxOff()) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    fx.width = innerWidth * dpr; fx.height = innerHeight * dpr;
    const r = $('.ghost').getBoundingClientRect(), x0 = (r.left + r.width / 2) * dpr, y0 = (r.top + r.height / 3) * dpr;
    const cs = getComputedStyle(document.documentElement), cols = ['--ecto', '--candle', '--violet', '--pass'].map(v => cs.getPropertyValue(v).trim());
    for (let i = 0; i < 90; i++) { const a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 6) * dpr; parts.push({ x: x0, y: y0, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4 * dpr, r: (2 + Math.random() * 4) * dpr, c: cols[i % cols.length], life: 70 + Math.random() * 40 }); }
    if (!fxOn) { fxOn = true; requestAnimationFrame(stepFx); }
  }
  function stepFx() {
    fxc.clearRect(0, 0, fx.width, fx.height);
    parts = parts.filter(p => p.life-- > 0);
    parts.forEach(p => { p.vy += .18; p.vx *= .99; p.x += p.vx; p.y += p.vy; fxc.globalAlpha = Math.min(1, p.life / 40); fxc.fillStyle = p.c; fxc.beginPath(); fxc.arc(p.x, p.y, p.r, 0, 7); fxc.fill(); });
    fxc.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(stepFx); else { fxOn = false; fxc.clearRect(0, 0, fx.width, fx.height); }
  }

  /* ======================= Actions ======================= */
  let toT;
  function toast(m, warn) { const t = $('#toast'); t.textContent = m; t.style.color = warn ? 'var(--candle)' : ''; clearTimeout(toT); toT = setTimeout(() => { t.textContent = ''; }, 3600); }
  async function copyText(text, okMsg) {
    try { await navigator.clipboard.writeText(text); toast(okMsg || L('Copiat în clipboard', 'Copied to clipboard')); return true; }
    catch { const r = document.createRange(); r.selectNodeContents(out); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast(L('Text selectat: apasă Ctrl+C', 'Text selected: press Ctrl+C'), true); return false; }
  }
  $('#copy').onclick = () => copyText(line.text);
  function addFavorite() {
    if (!line.text || line.err) return;
    if (S.favorites.some(f => f.g === line.text)) return toast(L('E deja în favorite.', 'Already in favorites.'), true);
    S.favorites.unshift({ g: line.text, src: line.src, d: line.d }); S.favorites = S.favorites.slice(0, 30); save();
    renderCollection(); award(5, L('salvat în favorite', 'saved to favorites'));
  }
  $('#fav').onclick = addFavorite;
  function download(data, type, name) {
    try { const a = document.createElement('a'), u = data instanceof Blob ? URL.createObjectURL(data) : URL.createObjectURL(new Blob([data], { type })); a.href = u; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); } catch {}
  }
  $('#txt').onclick = async () => {
    download(line.text, 'text/plain;charset=utf-8', 'ghost-message.txt');
    await copyText(line.text, L('Am pornit descărcarea .txt; textul e și în clipboard.', 'Started the .txt download; the text is in your clipboard too.'));
  };
  const shareBase = () => /github\.io$|^localhost$|^127\./.test(location.hostname) ? location.origin + location.pathname : CANONICAL;
  $('#share').onclick = () => {
    const src = S.tab === 'talk' && mode === 'encode' ? cur.src : line.src || clean(line.text);
    const url = shareBase() + '#msg-' + G.encodeShare({ t: src, d: line.d || S.dialect, l: S.level });
    copyText(url, L('Link copiat: cine îl deschide vede mesajul pe limba fantomei.', 'Link copied: whoever opens it sees the message in ghost.'));
  };

  /* PNG cards: square, story, banner */
  const BODY_D = 'M100 14C52 14 28 52 28 100V196Q40 182 52 196Q64 210 76 196Q88 182 100 196Q112 210 124 196Q136 182 148 196Q160 210 172 196V100C172 52 148 14 100 14Z';
  const CARDS = {
    square: { w: 1080, h: 1080, title: [540, 150, 96, 'center'], ghost: [415, 200, 1.25], text: [540, 640, 900, 46, 7, 'center'], foot: [540, 1030, 'center'] },
    story: { w: 1080, h: 1920, title: [540, 230, 110, 'center'], ghost: [365, 330, 1.75], text: [540, 1120, 900, 52, 10, 'center'], foot: [540, 1840, 'center'] },
    banner: { w: 1500, h: 500, title: [440, 140, 80, 'left'], ghost: [70, 60, 1.25], text: [440, 240, 980, 40, 4, 'left'], foot: [440, 460, 'left'] }
  };
  $('#png').onclick = async () => {
    if (!line.text) return;
    if (typeof Path2D === 'undefined') return toast(L('Browserul nu poate desena cardul.', 'This browser can’t draw the card.'), true);
    try { await document.fonts.ready; } catch {}
    const C = CARDS[$('#card-style').value] || CARDS.square, c = document.createElement('canvas'); c.width = C.w; c.height = C.h; const x = c.getContext('2d');
    const tint = S.color === 'auto' ? G.dialects[line.voice].tint : G.COLORS[S.color][1];
    const g = x.createRadialGradient(C.w / 2, C.h * .3, 60, C.w / 2, C.h / 2, Math.max(C.w, C.h) * .8); g.addColorStop(0, '#1b2645'); g.addColorStop(1, '#0a0f1f');
    x.fillStyle = g; x.fillRect(0, 0, C.w, C.h);
    const R = G.rng(G.hash(line.text)); x.fillStyle = 'rgba(231,236,246,.7)';
    for (let i = 0; i < 90; i++) { x.beginPath(); x.arc(R() * C.w, R() * C.h * .5, R() * 2.2 + .4, 0, 7); x.fill(); }
    x.fillStyle = '#f4b740'; x.globalAlpha = .8; x.beginPath(); x.arc(C.w - 140, 120, 46, 0, 7); x.fill(); x.globalAlpha = 1;
    const [tx, ty, ts, ta] = C.title;
    x.textAlign = ta; x.fillStyle = '#bff4ff'; x.font = `italic 800 ${ts}px Fraunces, Georgia, serif`;
    x.shadowColor = 'rgba(191,244,255,.45)'; x.shadowBlur = 30; x.fillText('Ghost Talk', tx, ty); x.shadowBlur = 0;
    const [gx, gy, gs] = C.ghost;
    x.save(); x.translate(gx, gy); x.scale(gs, gs);
    x.shadowColor = tint; x.shadowBlur = 40; x.fillStyle = tint; x.fill(new Path2D(BODY_D)); x.shadowBlur = 0;
    x.fillStyle = '#0a0f1f'; [[78, 92], [122, 92]].forEach(([a, b]) => { x.beginPath(); x.ellipse(a, b, 11, 15, 0, 0, 7); x.fill(); });
    x.beginPath(); x.ellipse(100, 142, 12, 12, 0, 0, 7); x.fill();
    x.fillStyle = '#fff'; [[82, 86], [126, 86]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 3.5, 0, 7); x.fill(); });
    x.restore();
    const [px, py, pw, ps, pmax, pa] = C.text;
    x.textAlign = pa; x.fillStyle = '#e7ecf6'; x.font = `italic 500 ${ps}px Fraunces, Georgia, serif`;
    const lines = []; let ln = '';
    line.text.slice(0, 600).split(/(\s+)/).forEach(w => { const test = ln + w; if (x.measureText(test).width > pw && ln.trim()) { lines.push(ln.trim()); ln = w.trimStart(); } else ln = test; });
    if (ln.trim()) lines.push(ln.trim());
    const show = lines.slice(0, pmax); if (lines.length > pmax) show[pmax - 1] += '…';
    show.forEach((l, i) => { let s = l; while (x.measureText(s).width > pw + 40 && s.length > 4) s = s.slice(0, -2); x.fillText(s === l ? l : s + '…', px, py + i * ps * 1.26); });
    const [fx0, fy, fa] = C.foot;
    x.textAlign = fa; x.fillStyle = '#8a96b3'; x.font = '600 26px "JetBrains Mono", monospace';
    x.fillText(`${S.name} · ${dn(line.voice)} · EMF ${S.level}`, fx0, fy);
    const url = c.toDataURL('image/png');
    $('#card-img').src = url; $('#card-img').alt = L(`Card Ghost Talk: ${line.text.slice(0, 80)}`, `Ghost Talk card: ${line.text.slice(0, 80)}`);
    $('#card-preview').hidden = false;
    try { const a = document.createElement('a'); a.href = url; a.download = `ghost-card-${$('#card-style').value}.png`; document.body.append(a); a.click(); a.remove(); } catch {}
    S.stats.cards++; save(); checkAchievements();
  };
  $('#card-close').onclick = () => { $('#card-preview').hidden = true; };

  /* Presentation mode */
  let presentT = null, presentList = [], presentI = 0;
  function startPresent() {
    if (document.body.classList.contains('presenting')) return;
    presentList = [line.text, ...S.favorites.map(f => f.g)].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    if (!presentList.length) return toast(L('Scrie ceva sau salvează favorite ca să ai ce prezenta.', 'Type something or save favorites to have something to present.'), true);
    document.body.classList.add('presenting'); $('#present-exit').hidden = false;
    presentI = 0; presentText = presentList[0]; lastPainted = null; renderBubble();
    try { seance.requestFullscreen && seance.requestFullscreen().catch(() => {}); } catch {}
    if (presentList.length > 1) presentT = setInterval(() => { presentI = (presentI + 1) % presentList.length; presentText = presentList[presentI]; renderBubble(); }, 7000);
    $('#present-exit').focus();
  }
  function stopPresent() {
    if (!document.body.classList.contains('presenting')) return;
    clearInterval(presentT); presentT = null; presentText = null;
    document.body.classList.remove('presenting'); $('#present-exit').hidden = true;
    try { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch {}
    lastPainted = null; renderBubble(); $('#present').focus();
  }
  $('#present').onclick = startPresent; $('#present-exit').onclick = stopPresent;
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('presenting')) stopPresent(); });

  /* ======================= Sound ======================= */
  let ac, verb;
  const ctx = () => { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac; };
  function echoBus(a) {                                 // feedback delay = the crypt echo
    if (verb && verb.ctx === a) return verb.input;
    const input = a.createGain(), delay = a.createDelay(1), fb = a.createGain(), wet = a.createGain();
    delay.delayTime.value = .28; fb.gain.value = .42; wet.gain.value = .55;
    input.connect(a.destination); input.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(a.destination);
    verb = { ctx: a, input }; return input;
  }
  const outNode = a => S.echo ? echoBus(a) : a.destination;
  const NOTE = [0, 392, 494, 587, 698];
  function tone(f, dur = .35, when = 0) {
    if (!S.sfx || !S.volume) return;
    try {
      const a = ctx(), t = a.currentTime + when, o = a.createOscillator(), g = a.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12 * S.volume, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(outNode(a)); o.start(t); o.stop(t + dur + .05);
    } catch {}
  }
  const BASE = { codepen: 360, classic: 330, whisper: 520, banshee: 760, poltergeist: 180, strigoi: 140, mirror: 420, sleepy: 220, secret: 600, morse: 700, runic: 160, emoji: 560, vampire: 200, victorian: 380, echo: 300 };
  function theremin(dur, d) {
    if (!S.sfx || !S.volume) return;
    try {
      const a = ctx(), now = a.currentTime, o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
      const base = BASE[d] || 330;
      o.type = d === 'poltergeist' || d === 'secret' || d === 'morse' ? 'sawtooth' : 'sine';
      o.frequency.setValueAtTime(base, now);
      o.frequency.exponentialRampToValueAtTime(base * (d === 'sleepy' ? .8 : 1.6), now + dur * .45);
      o.frequency.exponentialRampToValueAtTime(base * .7, now + dur);
      lfo.frequency.value = d === 'poltergeist' ? 13 : d === 'secret' || d === 'morse' ? 18 : 6; lg.gain.value = base * .04;
      lfo.connect(lg); lg.connect(o.frequency);
      const peak = (['whisper', 'sleepy', 'poltergeist', 'secret', 'morse'].includes(d) ? .03 : .08) * S.volume * 1.3;
      g.gain.setValueAtTime(.0001, now); g.gain.exponentialRampToValueAtTime(Math.max(.0002, peak), now + .25); g.gain.exponentialRampToValueAtTime(.0001, now + dur);
      o.connect(g); g.connect(outNode(a)); o.start(now); lfo.start(now); o.stop(now + dur + .05); lfo.stop(now + dur + .05);
    } catch {}
  }
  function speak(text, d, human) {
    if (!text) return;
    const dur = Math.min(3.2, 1 + text.length / 30);
    seance.classList.add('speaking');
    theremin(dur, d);
    let ended = false; const stop = () => { if (!ended) { ended = true; seance.classList.remove('speaking'); } };
    if (!('speechSynthesis' in window)) { toast(L('Vocea nu e disponibilă; se aude doar teremin-ul.', 'Speech isn’t available; you’ll hear the theremin only.'), true); setTimeout(stop, dur * 1000); return; }
    try {
      speechSynthesis.cancel();
      const v = G.dialects[d].voice, mk = (t, vol, pitchMul = 1) => {
        const u = new SpeechSynthesisUtterance(t);
        u.lang = S.lang === 'ro' ? 'ro-RO' : 'en-US';
        u.pitch = Math.max(0, Math.min(2, (human ? 1 : v.pitch) * pitchMul));
        u.rate = Math.min(2, Math.max(.3, (human ? .9 : v.rate) * S.rate));
        u.volume = vol * S.volume; return u;
      };
      const main = mk(text, human ? 1 : (v.volume ?? 1));
      const queue = [main];
      if (S.echo) { const last = (text.match(/[\p{L}\p{N}]+(?=[^\p{L}\p{N}]*$)/u) || [''])[0]; if (last) queue.push(mk(last, .45, .9), mk(last, .2, .8)); }
      queue[queue.length - 1].onend = stop; queue.forEach(u => { u.onerror = stop; });
      setTimeout(() => queue.forEach(u => speechSynthesis.speak(u)), S.sfx ? 300 : 0);
      setTimeout(stop, 15000);
    } catch { setTimeout(stop, dur * 1000); }
  }
  $('#speak').onclick = () => speak(line.speak, line.voice, line.human);
  $('#h-sound').onclick = () => { S.sfx = !S.sfx; save(); applyLook(); renderSettings(); toast(S.sfx ? L('Sunet pornit', 'Sound on') : L('Sunet oprit', 'Sound off')); if (S.sfx) tone(587, .2); else stopAmbient(); if (S.sfx && S.ambient) startAmbient(); };
  $('#h-theme').onclick = () => { S.theme = S.theme === 'dawn' ? 'night' : 'dawn'; save(); applyLook(); renderSettings(); };

  /* Theremin pad on the scene */
  let thereminOn = false, pad = null, playedTheremin = false;
  $('#theremin').onclick = () => {
    thereminOn = !thereminOn;
    $('#theremin').setAttribute('aria-pressed', String(thereminOn));
    seance.classList.toggle('theremin-on', thereminOn); $('#theremin-hint').hidden = !thereminOn;
    if (thereminOn && !S.sfx) toast(L('Pornește sunetul (♫) ca să auzi teremin-ul.', 'Turn on sound (♫) to hear the theremin.'), true);
  };
  const scene = $('#scene');
  function padSet(e) {
    if (!pad) return;
    const r = scene.getBoundingClientRect(), px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    const t = pad.a.currentTime;
    pad.o.frequency.setTargetAtTime(160 * Math.pow(2, px * 2.6), t, .03);
    pad.g.gain.setTargetAtTime((1 - py) * .2 * S.volume + .005, t, .05);
    $('#mouth').setAttribute('ry', String(4 + (1 - py) * 16));
  }
  scene.addEventListener('pointerdown', e => {
    if (!thereminOn || !S.sfx || e.target.closest('button')) return;
    e.preventDefault();
    try {
      const a = ctx(), o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
      o.type = 'sine'; lfo.frequency.value = 5.5; lg.gain.value = 6; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.value = .0001; o.connect(g); g.connect(outNode(a)); o.start(); lfo.start();
      pad = { a, o, g, lfo }; scene.setPointerCapture(e.pointerId); seance.classList.add('speaking'); padSet(e);
      if (!playedTheremin) { playedTheremin = true; S.stats.theremin++; save(); checkAchievements(); }
    } catch {}
  });
  scene.addEventListener('pointermove', e => { if (pad) padSet(e); });
  const padStop = () => { if (!pad) return; const { a, o, g, lfo } = pad; g.gain.setTargetAtTime(.0001, a.currentTime, .08); o.stop(a.currentTime + .4); lfo.stop(a.currentTime + .4); pad = null; seance.classList.remove('speaking'); renderBubble(); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => scene.addEventListener(ev, padStop));

  /* Ambience: wind, owl, creaking door */
  let amb = null;
  function startAmbient() {
    if (amb || !S.sfx) return;
    try {
      const a = ctx(), buf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = a.createBufferSource(); src.buffer = buf; src.loop = true;
      const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = .8;
      const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = .07; lg.gain.value = 260; lfo.connect(lg); lg.connect(bp.frequency);
      const g = a.createGain(); g.gain.value = .045 * S.volume;
      src.connect(bp); bp.connect(g); g.connect(a.destination); src.start(); lfo.start();
      amb = { src, lfo, g, timer: null };
      const owl = () => { const t = a.currentTime; [0, .45].forEach((d, i) => { const o = a.createOscillator(), og = a.createGain(); o.frequency.setValueAtTime(i ? 350 : 380, t + d); o.frequency.exponentialRampToValueAtTime(i ? 300 : 330, t + d + .35); og.gain.setValueAtTime(.0001, t + d); og.gain.exponentialRampToValueAtTime(.05 * S.volume + .0002, t + d + .05); og.gain.exponentialRampToValueAtTime(.0001, t + d + .38); o.connect(og); og.connect(a.destination); o.start(t + d); o.stop(t + d + .4); }); };
      const creak = () => { const t = a.currentTime, o = a.createOscillator(), w = a.createOscillator(), wg = a.createGain(), lp = a.createBiquadFilter(), og = a.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t); o.frequency.linearRampToValueAtTime(110, t + 1.2); w.frequency.value = 9; wg.gain.value = 18; w.connect(wg); wg.connect(o.frequency);
        lp.type = 'lowpass'; lp.frequency.value = 900; og.gain.setValueAtTime(.0001, t); og.gain.exponentialRampToValueAtTime(.03 * S.volume + .0002, t + .1); og.gain.exponentialRampToValueAtTime(.0001, t + 1.3);
        o.connect(lp); lp.connect(og); og.connect(a.destination); o.start(t); w.start(t); o.stop(t + 1.4); w.stop(t + 1.4); };
      const next = () => { amb.timer = setTimeout(() => { if (!amb) return; (Math.random() < .6 ? owl : creak)(); next(); }, 16000 + Math.random() * 24000); };
      next();
    } catch { amb = null; }
  }
  function stopAmbient() { if (!amb) return; try { clearTimeout(amb.timer); amb.src.stop(); amb.lfo.stop(); } catch {} amb = null; }
  addEventListener('pointerdown', () => { if (S.ambient && S.sfx && !amb) startAmbient(); }, { once: true });

  /* ======================= Séance log ======================= */
  let logT;
  function queueLog() { clearTimeout(logT); logT = setTimeout(commitLog, 1400); }
  function commitLog() {
    if (mode !== 'encode' || !cur.out || cur.err) return;
    const src = cur.src.trim(); if (!src) return;
    const dup = S.log.some(e => e.src === src && e.d === S.dialect && e.l === S.level);
    S.log = [{ src, d: S.dialect, l: S.level, g: cur.out }, ...S.log.filter(e => !(e.src === src && e.d === S.dialect && e.l === S.level))].slice(0, 8);
    if (!dup) {
      S.stats.translations++;
      [S.dialect, ...S.chain].forEach(d => { if (!S.stats.dialects.includes(d)) S.stats.dialects.push(d); });
      if (S.chain.length) S.stats.chain++;
    }
    save(); renderCollection(); checkAchievements();
  }

  /* ======================= Games ======================= */
  let round = null, streak = 0, hideT, nextT, arcade = { score: 0, lives: 3, active: false };
  const playSeq = seq => String(seq || '').split(' ').filter(Boolean).forEach((n, i) => tone(NOTE[+n], .38, i * .5));
  const opts = () => ({ lang: S.lang, difficulty: S.difficulty, dialect: S.dialect, rand: Math.random, now: Date.now() });

  function renderGameUI() {
    const sel = $('#game');
    if (sel.options.length !== G.GAMES.length || sel.dataset.lang !== S.lang) {
      sel.innerHTML = ''; G.GAMES.forEach(k => sel.append(new Option(T(GAME_INFO[k][0]), k))); sel.dataset.lang = S.lang;
    }
    sel.value = S.game;
    $$('#difficulty button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.diff === S.difficulty)));
    const extra = S.game === 'guess' ? ' ' + L(`Dialect: ${dn(S.dialect)} (îl schimbi în Traducător).`, `Dialect: ${dn(S.dialect)} (change it in the Translator).`) : '';
    $('#game-hint').textContent = T(GAME_INFO[S.game][1]) + extra;
    const g = round && round.game;
    $('#answer-area').hidden = g === 'hangman';
    $('#hangman-area').hidden = g !== 'hangman';
    $('#daily-area').hidden = g !== 'daily';
    $('#arcade-bar').hidden = S.game !== 'arcade';
    $('#pads').hidden = !(g === 'memory' || g === 'choir');
    $('#reveal').hidden = g === 'daily';
    $('#replay').hidden = g === 'daily';
    $('#streak').textContent = streak; $('#best').textContent = S.best;
    $('#arcade-score').textContent = arcade.score; $('#arcade-best').textContent = S.arcadeBest;
    $('#arcade-lives').textContent = '👻'.repeat(Math.max(0, arcade.lives)) + '·'.repeat(Math.max(0, 3 - arcade.lives));
    $('#arcade-lives').setAttribute('aria-label', L(`${arcade.lives} vieți`, `${arcade.lives} lives`));
    $('#daily-note').textContent = S.game === 'daily' ? (S.daily.done ? L('Puzzle-ul de azi e gata. Revino mâine!', 'Today’s puzzle is done. Come back tomorrow!') : '') : '';
    $('#answer-label').textContent = g === 'duo' && round.stage === 'p1' ? L('Cuvântul secret (Jucătorul 1)', 'Secret word (Player 1)') : g === 'daily' ? L(`Cuvânt de ${G.chars(round.expected).length} litere`, `${G.chars(round.expected).length}-letter word`) : L('Răspunsul tău', 'Your answer');
    if (g !== 'daily') { $('#answer').disabled = false; $('#check').disabled = false; }
    if (g === 'hangman') renderHangman();
    if (g === 'daily') renderDaily();
  }
  function newRound() {
    clearTimeout(hideT); clearTimeout(nextT);
    $('#answer').value = ''; $('#answer').type = 'text'; setResult('');
    const game = S.game;
    if (game === 'daily') {
      if (S.daily.date !== today() || S.daily.lang !== S.lang) { S.daily = { date: today(), lang: S.lang, rows: [], guesses: [], done: false, won: false }; save(); }
      round = G.makeRound('daily', opts()); round.speak = '';
    } else if (game === 'arcade') {
      if (!arcade.active) arcade = { score: 0, lives: 3, active: true };
      const sub = G.ARCADE_POOL[Math.floor(Math.random() * G.ARCADE_POOL.length)];
      round = G.makeRound(sub, opts()); round.sub = sub;
    } else if (game === 'duo') {
      round = { game: 'duo', stage: 'p1', expected: '', prompt: L('Jucătorul 1: scrie în secret un cuvânt și apasă Verifică.', 'Player 1: secretly type a word and press Check.') };
      $('#answer').type = 'password';
    } else round = G.makeRound(game, opts());
    if (['letters', 'secret', 'vocab', 'memory', 'choir'].includes(round.game)) round.speak = round.game === 'vocab' ? round.prompt : '';
    if (round.game === 'boo') round.speak = String(round.n);
    if (round.game === 'typing') round.speak = round.prompt;
    if (round.game === 'guess' && G.dialects[round.dialect].speaksHuman) round.speak = '';
    if (round.game === 'memory') {
      playSeq(round.seq);
      hideT = setTimeout(() => { if (round && round.game === 'memory' && !round.done) { round.prompt = round.seq.replace(/\d/g, '?'); renderBubble(); } }, round.hideAfter);
    }
    if (round.game === 'choir') { if (!S.sfx) toast(L('Pornește sunetul (♫) ca să auzi corul.', 'Turn on sound (♫) to hear the choir.'), true); const seq = round.seq; setTimeout(() => playSeq(seq), 250); }
    renderGameUI(); renderBubble();
  }
  function setResult(text, ok) { const r = $('#result'); r.textContent = text; r.className = 'result' + (ok === true ? ' ok' : ok === false ? ' no' : ''); }
  function win(xp, why) {
    round.done = true; streak++; if (streak > S.best) S.best = streak;
    save(); award(xp, why); tone(587, .15); tone(784, .3, .15); renderMood();
  }
  function lose() { streak = 0; tone(196, .3); renderMood(); }
  function check() {
    if (!round) return newRound();
    if (round.done) return newRound();
    const v = $('#answer').value;
    if (round.game === 'duo' && round.stage === 'p1') {
      if (!v.trim()) return setResult(L('Scrie mai întâi un cuvânt.', 'Type a word first.'), false);
      round.expected = v.trim(); round.stage = 'p2'; round.prompt = G.translate(round.expected, S.dialect, S.level); round.game = 'duo'; round.speak = undefined;
      $('#answer').value = ''; $('#answer').type = 'text';
      setResult(L('Jucătorul 2: ghicește ce a spus fantoma!', 'Player 2: guess what the ghost said!'));
      renderGameUI(); renderBubble(); $('#answer').focus(); return;
    }
    if (!v.trim()) return setResult(L('Scrie un răspuns.', 'Type an answer.'), false);
    if (round.game === 'daily') return dailyGuess(v);
    const ok = G.checkAnswer(round, v);
    if (S.game === 'arcade') return arcadeAnswer(ok);
    if (ok) {
      const xp = { easy: 8, medium: 10, nightmare: 15 }[S.difficulty];
      if (round.digits) round.prompt = round.seq;
      win(xp, L('răspuns corect', 'correct answer'));
      setResult(L(`Corect! +${xp} XP. Apasă Enter pentru runda următoare.`, `Correct! +${xp} XP. Press Enter for the next round.`), true);
    } else { lose(); setResult(L('Nu chiar. Mai încearcă!', 'Not quite. Try again!'), false); }
    renderGameUI(); renderBubble();
  }
  function arcadeAnswer(ok) {
    if (ok) {
      arcade.score++; round.done = true; streak++; if (streak > S.best) S.best = streak;
      setResult(L(`Corect! Scor: ${arcade.score}`, `Correct! Score: ${arcade.score}`), true); tone(659, .15);
      save(); renderGameUI(); nextT = setTimeout(newRound, 900);
    } else {
      arcade.lives--; lose(); round.done = true;
      if (arcade.lives <= 0) return arcadeOver();
      setResult(L(`Răspunsul era: ${round.expected}. Mai ai ${arcade.lives} ${arcade.lives === 1 ? 'viață' : 'vieți'}.`, `The answer was: ${round.expected}. ${arcade.lives} ${arcade.lives === 1 ? 'life' : 'lives'} left.`), false);
      renderGameUI(); nextT = setTimeout(newRound, 1800);
    }
  }
  function arcadeOver() {
    arcade.active = false;
    const best = arcade.score > S.arcadeBest; if (best) S.arcadeBest = arcade.score; save();
    round = { game: 'arcade-over', prompt: L(`Joc terminat! Scor: ${arcade.score}`, `Game over! Score: ${arcade.score}`), expected: '', done: true, speak: '' };
    setResult(L(`Răspunsul era altul. ${best ? 'Record nou! ' : ''}Apasă Rundă nouă pentru o partidă nouă.`, `Wrong answer. ${best ? 'New best! ' : ''}Press New round to play again.`), best || undefined);
    if (arcade.score) award(arcade.score * 3, L('partidă arcade', 'arcade run'));
    renderGameUI(); renderBubble();
  }
  $('#check').onclick = check;
  $('#answer').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
  $('#new-round').onclick = () => { if (S.game === 'arcade' && round && round.game !== 'arcade-over' && arcade.active && !round.done) { arcade.lives--; if (arcade.lives <= 0) return arcadeOver(); } newRound(); };
  $('#game').onchange = e => {
    S.game = e.target.value; save(); streak = 0; arcade.active = false; newRound();
    if (S.game === 'hangman') { const k = $('#keys .key:not(:disabled)'); if (k) k.focus(); }   // letters typed next go to the game, not the select
  };
  $$('#difficulty button').forEach(b => b.onclick = () => { S.difficulty = b.dataset.diff; save(); arcade.active = false; newRound(); });
  $('#replay').onclick = () => {
    if (!round) return;
    if (round.game === 'memory') { round.prompt = round.seq; renderBubble(); playSeq(round.seq); clearTimeout(hideT); hideT = setTimeout(() => { if (!round.done) { round.prompt = round.seq.replace(/\d/g, '?'); renderBubble(); } }, 2000); return; }
    if (round.game === 'choir') { if (!S.sfx) toast(L('Pornește sunetul (♫) ca să auzi corul.', 'Turn on sound (♫) to hear the choir.'), true); playSeq(round.seq); return; }
    speak(line.speak || clean(round.prompt || ''), round.game === 'guess' ? S.dialect : 'classic');
  };
  $('#reveal').onclick = () => {
    if (!round || round.done || (round.game === 'duo' && round.stage === 'p1')) return;
    if (S.game === 'arcade') return arcadeAnswer(false);
    round.done = true; lose();
    if (round.game === 'hangman') { round.guessed = [...new Set([...round.guessed, ...G.chars(G.fold(round.word)).filter(c => /\p{L}/u.test(c))])]; }
    if (round.digits) round.prompt = round.seq;
    setResult(L(`Răspunsul era: ${round.expected || round.word}`, `The answer was: ${round.expected || round.word}`));
    renderGameUI(); renderBubble();
  };
  $('#pads').addEventListener('click', e => {
    const b = e.target.closest('.pad'); if (!b) return;
    const a = $('#answer');
    if (b.dataset.n === 'back') { a.value = a.value.trim().split(' ').slice(0, -1).join(' '); return; }
    tone(NOTE[+b.dataset.n], .3);
    a.value = (a.value.trim() + ' ' + b.dataset.n).trim();
  });

  /* Hangman */
  const ALPHA = 'abcdefghijklmnopqrstuvwxyz';
  function renderHangman() {
    const st = G.hangmanStatus(round);
    $('#hangman-lives').textContent = L(`Greșeli: ${round.wrong} din ${round.lives}`, `Misses: ${round.wrong} of ${round.lives}`);
    const box = $('#keys');
    if (!box.children.length) [...ALPHA].forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.className = 'key'; b.textContent = c; b.dataset.k = c; box.append(b); });
    box.querySelectorAll('.key').forEach(b => {
      const k = b.dataset.k, used = round.guessed.includes(k), hit = used && G.chars(round.word).some(c => G.fold(c) === k);
      b.className = 'key' + (used ? (hit ? ' hit' : ' miss') : ''); b.disabled = used || st !== 'playing';
      b.setAttribute('aria-label', L(`Litera ${k}`, `Letter ${k}`) + (used ? (hit ? L(', găsită', ', found') : L(', nu e în cuvânt', ', not in the word')) : ''));
    });
  }
  function hangmanPick(k) {
    if (!round || round.game !== 'hangman' || round.done) return;
    round = Object.assign(G.hangmanGuess(round, k), { game: 'hangman', expected: round.word });
    const st = G.hangmanStatus(round);
    if (st === 'won') { win(15, L('fantoma e salvată', 'the ghost is saved')); S.stats.hangmanWins++; save(); checkAchievements(); setResult(L(`L-ai salvat pe ${S.name}! Apasă Rundă nouă.`, `You saved ${S.name}! Press New round.`), true); }
    else if (st === 'lost') { round.done = true; lose(); setResult(L(`${S.name} s-a estompat… Cuvântul era: ${round.word}`, `${S.name} faded away… The word was: ${round.word}`), false); }
    else tone(round.guessed[round.guessed.length - 1] && G.chars(round.word).some(c => G.fold(c) === k) ? 523 : 220, .15);
    renderGameUI(); renderBubble();
  }
  $('#keys').addEventListener('click', e => { const b = e.target.closest('.key'); if (b && !b.disabled) hangmanPick(b.dataset.k); });

  /* Daily puzzle */
  function dailyPrompt() {
    const w = G.chars(round.expected), hits = w.map((c, i) => i === 0 || S.daily.rows.some(r => r[i] === 'hit'));
    return (S.daily.won || S.daily.done) ? round.expected : w.map((c, i) => hits[i] ? c : '_').join(' ');
  }
  function renderDaily() {
    const box = $('#daily-rows'); box.innerHTML = '';
    S.daily.rows.forEach((r, i) => {
      const row = document.createElement('div'); row.className = 'grow-row';
      const g = G.chars(S.daily.guesses[i] || '');
      r.forEach((x, j) => { const t = document.createElement('span'); t.className = 'tile-l ' + x; t.textContent = g[j] || ''; t.setAttribute('aria-label', `${g[j] || ''}: ${{ hit: L('la locul ei', 'right spot'), near: L('în cuvânt', 'in the word'), miss: L('lipsește', 'missing') }[x]}`); row.append(t); });
      box.append(row);
    });
    $('#daily-share').hidden = !S.daily.done;
    $('#daily-share-text').hidden = !S.daily.done;
    if (S.daily.done) $('#daily-share-text').textContent = G.shareText(S.daily.date, S.daily.rows, S.daily.won);
    $('#answer').disabled = S.daily.done; $('#check').disabled = S.daily.done;
  }
  function dailyGuess(v) {
    if (S.daily.done) return;
    let row; try { row = G.wordleScore(v.trim(), round.expected); } catch { return setResult(L(`Cuvântul are ${G.chars(round.expected).length} litere.`, `The word has ${G.chars(round.expected).length} letters.`), false); }
    S.daily.rows.push(row); S.daily.guesses.push(v.trim().toLowerCase().slice(0, 30));
    $('#answer').value = '';
    if (row.every(x => x === 'hit')) {
      S.daily.done = true; S.daily.won = true; S.stats.dailyWins++; save();
      win(20, L('puzzle-ul zilei', 'daily puzzle'));
      setResult(L(`Ai găsit „${round.expected}” din ${S.daily.rows.length} încercări!`, `You found “${round.expected}” in ${S.daily.rows.length} tries!`), true);
    } else if (S.daily.rows.length >= 6) {
      S.daily.done = true; save(); lose();
      setResult(L(`Gata încercările. Cuvântul era „${round.expected}”.`, `Out of tries. The word was “${round.expected}”.`), false);
    } else { save(); setResult(L(`Încercarea ${S.daily.rows.length} din 6.`, `Try ${S.daily.rows.length} of 6.`)); }
    renderGameUI(); renderBubble();
  }
  $('#daily-hint').onclick = () => {
    if (!round || round.game !== 'daily') return;
    const i = G.WORDS[S.lang].indexOf(round.expected), other = G.WORDS[S.lang === 'ro' ? 'en' : 'ro'][i];
    setResult(L(`Indiciu: în engleză se spune „${other}”.`, `Hint: in Romanian it’s “${other}”.`));
  };
  $('#daily-share').onclick = () => copyText($('#daily-share-text').textContent, L('Rezultat copiat. Lipește-l unde vrei!', 'Result copied. Paste it anywhere!'));

  /* ======================= Story ======================= */
  function renderStory() {
    const node = G.STORY[S.story];
    $('#speaker').textContent = node.speaker === 'rival' ? G.RIVAL : '';
    $('#story-text').textContent = G.storyText(S.story, S.lang, S.name);
    $('#puzzle').hidden = !node.puzzle;
    if (node.puzzle) { $('#puzzle-msg').textContent = ''; $('#puzzle-input').value = ''; }
    const box = $('#choices'); box.innerHTML = '';
    (node.next || []).forEach(([n, ro, en]) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = node.puzzle ? 'btn small' : 'btn';
      b.textContent = (S.lang === 'ro' ? ro : en).replaceAll('{name}', S.name);
      b.onclick = () => goStory(n);
      box.append(b);
    });
    $('#endings').textContent = L(`Finaluri descoperite: ${S.endings.length} / ${G.ENDINGS.length}`, `Endings found: ${S.endings.length} / ${G.ENDINGS.length}`);
  }
  function goStory(n) {
    S.story = n;
    const firstVisit = !S.visited.includes(n); if (firstVisit) S.visited.push(n);
    save();
    if (G.STORY[n].end && !S.endings.includes(n)) { S.endings.push(n); save(); award(15, L('final nou descoperit', 'new ending found')); confetti(); }
    else if (firstVisit) award(5, L('capitol nou', 'new chapter'));
    renderStory(); renderBubble();
  }
  function answerPuzzle() {
    const v = $('#puzzle-input').value.replace(/〰/g, '');
    const want = G.storyAnswer(S.story, S.lang), p = G.STORY[S.story].puzzle;
    if (G.sameAnswer(v, want)) {
      if (!S.solved.includes(S.story)) { S.solved.push(S.story); save(); award(10, L('ghicitoare rezolvată', 'riddle solved')); }
      tone(587, .15); tone(784, .3, .15);
      goStory(p.success);
    } else {
      $('#puzzle-msg').textContent = L('Nu e bine. ', 'Not right. ') + T(p.hint); tone(196, .3);
    }
  }
  $('#puzzle-go').onclick = answerPuzzle;
  $('#puzzle-input').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); answerPuzzle(); } });
  $('#story-reset').onclick = () => { S.story = 0; save(); renderStory(); renderBubble(); };

  /* ======================= Collection ======================= */
  function optButton(label, small, pressed, locked, onClick, swatch) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.setAttribute('aria-pressed', String(pressed)); if (locked) b.setAttribute('aria-disabled', 'true');
    if (swatch) { const s = document.createElement('span'); s.className = 'sw'; s.style.background = swatch; b.append(s); }
    const bb = document.createElement('b'); bb.textContent = label; b.append(bb);
    if (small) { const sm = document.createElement('small'); sm.textContent = small; b.append(sm); }
    b.onclick = onClick; return b;
  }
  const costNote = (cost, locked) => cost ? (locked ? L(`🔒 la ${cost} XP`, `🔒 at ${cost} XP`) : L(`deblocat · ${cost} XP`, `unlocked · ${cost} XP`)) : L('gratuit', 'free');
  const lockedMsg = (cost, name) => toast(L(`Mai adună ${cost - S.xp} XP pentru: ${name}.`, `Earn ${cost - S.xp} more XP for: ${name}.`), true);
  function renderCollection() {
    $('#pet-input').value = S.name;
    const hats = $('#hats'); hats.innerHTML = '';
    Object.entries(G.HATS).forEach(([k, cost]) => { const lk = S.xp < cost; hats.append(optButton(T(HAT_NAMES[k]), costNote(cost, lk), S.hat === k, lk, () => { if (lk) return lockedMsg(cost, T(HAT_NAMES[k])); S.hat = k; save(); renderPet(); renderCollection(); })); });
    const ex = $('#extras'); ex.innerHTML = '';
    Object.entries(G.EXTRAS).forEach(([k, cost]) => { const lk = S.xp < cost; ex.append(optButton(T(EXTRA_NAMES[k]), costNote(cost, lk), S.extra === k, lk, () => { if (lk) return lockedMsg(cost, T(EXTRA_NAMES[k])); S.extra = k; save(); renderPet(); renderCollection(); })); });
    const cl = $('#colors'); cl.innerHTML = '';
    Object.entries(G.COLORS).forEach(([k, [cost, hex]]) => { const lk = S.xp < cost; cl.append(optButton(T(COLOR_NAMES[k]), costNote(cost, lk), S.color === k, lk, () => { if (lk) return lockedMsg(cost, T(COLOR_NAMES[k])); S.color = k; save(); renderPet(); renderCollection(); renderBubble(); }, hex || 'conic-gradient(#bff4ff, #f6c6ff, #c7ff9e, #ffb3a1, #bff4ff)')); });
    const dc = $('#decors'); dc.innerHTML = '';
    G.DECORS.forEach(k => dc.append(optButton(T(DECOR_NAMES[k]), '', S.decor === k, false, () => { S.decor = k; save(); renderPet(); renderCollection(); })));
    const bl = $('#badges'); bl.innerHTML = '';
    G.BADGES.forEach(bd => { const li = document.createElement('li'); const got = S.xp >= bd.xp; li.className = got ? 'got' : ''; li.textContent = (got ? '✦ ' : '🔒 ') + T(BADGE_NAMES[bd.id]) + (got ? '' : ` · ${bd.xp} XP`); bl.append(li); });
    const al = $('#achievements'); al.innerHTML = '';
    G.ACHIEVEMENTS.forEach(a => { const got = S.achievements.includes(a.id), li = document.createElement('li'); li.className = got ? 'got' : ''; li.textContent = `${got ? '✦' : '🔒'} ${T(ACH[a.id][0])} · ${T(ACH[a.id][1])}`; al.append(li); });
    $('#ach-count').textContent = `${S.achievements.length} / ${G.ACHIEVEMENTS.length}`;
    const fl = $('#favs'); fl.innerHTML = '';
    if (!S.favorites.length) fl.innerHTML = `<li><p class="empty-note">${L('Niciun favorit încă. Apasă „☆ Salvează” sub bulă (+5 XP).', 'No favorites yet. Press “☆ Save” under the bubble (+5 XP).')}</p></li>`;
    S.favorites.forEach((f, i) => fl.append(item(f.src, f.g, f.d ? dn(f.d) : '', [
      f.src && f.d ? [L('Readu', 'Restore'), () => restore(f.src, f.d, S.level)] : null,
      [L('Șterge', 'Remove'), () => { S.favorites.splice(i, 1); save(); renderCollection(); }]
    ])));
    const ll = $('#log'); ll.innerHTML = '';
    if (!S.log.length) ll.innerHTML = `<li><p class="empty-note">${L('Încă nicio ședință. Traducerile tale apar aici.', 'No séances yet. Your translations show up here.')}</p></li>`;
    S.log.forEach(e => ll.append(item(e.src, e.g, `${dn(e.d)} · EMF ${e.l}`, [[L('Readu', 'Restore'), () => restore(e.src, e.d, e.l)]])));
  }
  function item(src, g, meta, actions) {
    const li = document.createElement('li'); li.className = 'item';
    li.innerHTML = '<div class="txt"><span class="src"></span><span class="lg"></span><span class="meta"></span></div><div class="row"></div>';
    li.querySelector('.src').textContent = src || '';
    li.querySelector('.lg').textContent = g.length > 120 ? g.slice(0, 120) + '…' : g;
    li.querySelector('.meta').textContent = meta || '';
    actions.filter(Boolean).forEach(([label, fn]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn small'; b.textContent = label; b.onclick = fn; li.querySelector('.row').append(b); });
    return li;
  }
  function restore(src, d, l) {
    S.dialect = d; S.level = l; save(); renderDialects();
    if (mode !== 'encode') setMode('encode', false);
    $('#human').value = src; setTab('talk'); compute(); $('#human').focus();
  }
  $('#pet-input').addEventListener('change', e => { S.name = e.target.value.trim().slice(0, 30) || 'Boo'; save(); renderPet(); renderStory(); renderBubble(); });

  /* ======================= Settings ======================= */
  function renderSettings() {
    $('#s-effects').checked = S.effects; $('#s-motion').checked = S.motion; $('#s-contrast').checked = S.contrast; $('#s-dawn').checked = S.theme === 'dawn'; $('#s-sfx').checked = S.sfx;
    $('#s-echo').checked = S.echo; $('#s-ambient').checked = S.ambient; $('#s-lexend').checked = S.font === 'lexend';
    $('#s-scale').value = S.scale; $('#o-scale').textContent = Math.round(S.scale * 100) + '%';
    $('#s-rate').value = S.rate; $('#o-rate').textContent = '×' + S.rate.toFixed(1);
    $('#s-volume').value = S.volume; $('#o-volume').textContent = Math.round(S.volume * 100) + '%';
    const standalone = matchMedia('(display-mode: standalone)').matches;
    $('#install-note').textContent = standalone ? L('Rulezi aplicația instalată. Merge și offline.', 'You’re running the installed app. It works offline too.')
      : L('Pe GitHub Pages, Ghost Talk se poate instala și merge offline după prima vizită. În Safari: Partajează → Adaugă pe ecranul principal.', 'On GitHub Pages, Ghost Talk can be installed and works offline after the first visit. In Safari: Share → Add to Home Screen.');
  }
  $('#s-effects').onchange = e => { S.effects = e.target.checked; save(); applyLook(); if (!S.effects) cx.clearRect(0, 0, W, H); };
  $('#s-motion').onchange = e => { S.motion = e.target.checked; save(); applyLook(); if (!still()) fogLoop(); };
  $('#s-contrast').onchange = e => { S.contrast = e.target.checked; save(); applyLook(); };
  $('#s-dawn').onchange = e => { S.theme = e.target.checked ? 'dawn' : 'night'; save(); applyLook(); };
  $('#s-lexend').onchange = e => { S.font = e.target.checked ? 'lexend' : 'default'; save(); applyLook(); };
  $('#s-sfx').onchange = e => { S.sfx = e.target.checked; save(); applyLook(); if (!S.sfx) stopAmbient(); else if (S.ambient) startAmbient(); };
  $('#s-echo').onchange = e => { S.echo = e.target.checked; save(); if (S.echo) { tone(587, .25); } };
  $('#s-ambient').onchange = e => { S.ambient = e.target.checked; save(); if (S.ambient) { if (!S.sfx) toast(L('Pornește și sunetul (♫).', 'Turn sound on (♫) too.'), true); startAmbient(); } else stopAmbient(); };
  $('#s-scale').oninput = e => { S.scale = +e.target.value; save(); applyLook(); renderSettings(); };
  $('#s-rate').oninput = e => { S.rate = +e.target.value; save(); renderSettings(); };
  $('#s-volume').oninput = e => { S.volume = +e.target.value; save(); renderSettings(); if (amb) amb.g.gain.value = .045 * S.volume; };
  const backupJSON = () => JSON.stringify(S, null, 2);
  $('#export').onclick = () => { $('#backupText').value = backupJSON(); toast(L('Backup-ul e în caseta de mai jos.', 'Your backup is in the box below.')); };
  $('#export-dl').onclick = () => { $('#backupText').value = backupJSON(); download(backupJSON(), 'application/json', 'ghost-talk-backup.json'); toast(L('Am pornit descărcarea. Dacă nu apare, copiază textul.', 'Download started. If nothing appears, copy the text instead.')); };
  $('#backup-copy').onclick = () => { if (!$('#backupText').value) $('#backupText').value = backupJSON(); navigator.clipboard?.writeText($('#backupText').value).then(() => toast(L('Backup copiat.', 'Backup copied.')), () => { $('#backupText').select(); toast(L('Text selectat: apasă Ctrl+C', 'Text selected: press Ctrl+C'), true); }); };
  function importData(txt) {
    try {
      const s = JSON.parse(txt);
      if (!s || typeof s !== 'object' || Array.isArray(s)) throw 0;
      S = G.normalizeState(s); save(); renderAll();
      toast(L('Backup importat și verificat.', 'Backup imported and checked.'));
    } catch { toast(L('Backup invalid: trebuie să fie JSON exportat din Ghost Talk.', 'Invalid backup: it must be JSON exported from Ghost Talk.'), true); }
  }
  $('#import-text').onclick = () => importData($('#backupText').value);
  $('#import').onchange = async e => {
    const f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    if (f.size > 300000) return toast(L('Fișierul e prea mare pentru un backup (max. 300 KB).', 'That file is too big for a backup (max 300 KB).'), true);
    importData(await f.text());
  };
  $('#reset').onclick = () => { $('#confirm').hidden = false; $('#reset-no').focus(); };
  $('#reset-no').onclick = () => { $('#confirm').hidden = true; };
  $('#reset-yes').onclick = () => {
    const lang = S.lang; S = G.normalizeState({ v: 3, lang, tab: 'settings' }); save();
    $('#confirm').hidden = true; streak = 0; round = null; stopAmbient(); renderAll(); toast(L('Datele au fost șterse.', 'Data deleted.'));
  };

  /* PWA install + offline */
  let installEvt = null;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; $('#install').hidden = false; });
  $('#install').onclick = async () => { if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch {} installEvt = null; $('#install').hidden = true; };
  if ('serviceWorker' in navigator && /github\.io$|^localhost$|^127\./.test(location.hostname)) { try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch {} }

  /* ======================= Tests ======================= */
  let lastRun = null;
  function renderTests(r) {
    if (!r) return;
    const term = $('#term'); term.innerHTML = '';
    r.suites.forEach(s => {
      const h = document.createElement('div'); h.className = 'suite'; h.textContent = s.name; term.append(h);
      s.tests.forEach(tc => {
        const d = document.createElement('div'); d.className = 't';
        d.innerHTML = `<span class="${tc.ok ? 'ok' : 'no'}">${tc.ok ? '✓' : '✕'}</span> <span class="n"></span> <span class="ms">(${tc.ms} ms)</span>`;
        d.querySelector('.n').textContent = tc.name;
        if (!tc.ok) { const p = document.createElement('pre'); p.textContent = tc.error; d.append(p); }
        term.append(d);
      });
    });
    const b = $('#tbadge'); b.textContent = r.failed ? 'FAIL' : 'PASS'; b.className = 'tbadge ' + (r.failed ? 'fail' : 'pass');
    const sp = r.suites.filter(s => s.tests.every(t => t.ok)).length;
    $('#summary').innerHTML =
      `<div><b>Suites:</b>${sp < r.suites.length ? `<span class="f">${r.suites.length - sp} ${L('picate', 'failed')}</span>, ` : ''}<span class="p">${sp} ${L('trecute', 'passed')}</span>, ${r.suites.length} total</div>` +
      `<div><b>Tests:</b>${r.failed ? `<span class="f">${r.failed} ${L('picate', 'failed')}</span>, ` : ''}<span class="p">${r.passed} ${L('trecute', 'passed')}</span>, ${r.total} total</div>` +
      `<div><b>Time:</b>${(r.ms / 1000).toFixed(3)} s</div>`;
    const c = r.coverage, pct = Math.round(c.covered / c.total * 100);
    $('#cov-fill').style.width = pct + '%';
    $('#cov-pct').textContent = `${c.covered} / ${c.total} · ${pct}%`;
    const ul = $('#cov'); ul.innerHTML = '';
    c.functions.forEach(f => { const li = document.createElement('li'); li.className = f.calls ? '' : 'zero'; li.innerHTML = '<span></span><b></b>'; li.firstChild.textContent = f.name + '()'; li.lastChild.textContent = f.calls; ul.append(li); });
  }
  function runTests() { lastRun = window.GhostSuite(G, { ghostTalk: window.ghostTalk }); renderTests(lastRun); }
  $('#rerun').onclick = runTests;

  /* ======================= Shortcuts ======================= */
  const typing = el => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('presenting')) { stopPresent(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); $('#speak').click(); return; }
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      const n = /^Digit([1-6])$/.exec(e.code);
      if (n) { e.preventDefault(); setTab(G.TABS[+n[1] - 1], true); return; }
      const act = { KeyS: addFavorite, KeyC: () => line.text && copyText(line.text), KeyL: () => { S.lang = S.lang === 'ro' ? 'en' : 'ro'; save(); renderAll(); if (S.tab === 'play') newRound(); }, KeyP: startPresent,
        ArrowUp: () => { S.level = Math.min(5, S.level + 1); save(); renderDialects(); compute(); }, ArrowDown: () => { S.level = Math.max(1, S.level - 1); save(); renderDialects(); compute(); } }[e.code];
      if (act) { e.preventDefault(); act(); }
      return;
    }
    if (typing(e.target) || e.ctrlKey || e.metaKey) return;
    if (e.key === '?') { e.preventDefault(); openKeys(); return; }
    if (S.tab === 'play' && round && round.game === 'hangman' && /^[a-z]$/i.test(e.key)) hangmanPick(e.key.toLowerCase());
  });
  function openKeys() { const d = $('#keys-dialog'); try { d.showModal(); } catch { d.setAttribute('open', ''); } }
  $('#h-keys').onclick = openKeys;

  /* ======================= Eyes, stars, fog ======================= */
  const eyes = $('#eyes');
  addEventListener('pointermove', e => {
    const r = eyes.ownerSVGElement.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height * .45)) / innerHeight;
    const flip = seance.dataset.d === 'mirror' ? -1 : 1;
    eyes.setAttribute('transform', `translate(${(dx * 10 * flip).toFixed(1)} ${(dy * 8).toFixed(1)})`);
  }, { passive: true });
  (function stars() {
    const R = G.rng(77), g = $('#stars'), ns = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 46; i++) { const c = document.createElementNS(ns, 'circle'); c.setAttribute('class', 'star'); c.setAttribute('cx', (R() * 400).toFixed(1)); c.setAttribute('cy', (R() * 190).toFixed(1)); c.setAttribute('r', (R() * 1.2 + .3).toFixed(2)); c.setAttribute('opacity', (R() * .6 + .2).toFixed(2)); g.append(c); }
  })();
  const cv = $('#fog'), cx = cv.getContext('2d');
  let W, H, puffs = [], running = false;
  function sizeFog() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
    puffs = Array.from({ length: 14 }, (_, i) => ({ x: Math.random() * W, y: H * (.35 + Math.random() * .7), r: (140 + Math.random() * 220) * dpr, v: (.08 + Math.random() * .25) * dpr * (i % 2 ? 1 : -1), a: .025 + Math.random() * .04 }));
  }
  function drawFog() {
    if (!W) return;
    cx.clearRect(0, 0, W, H);
    puffs.forEach(p => {
      if (!still()) { p.x += p.v; if (p.x < -p.r) p.x = W + p.r; if (p.x > W + p.r) p.x = -p.r; }
      const g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(${fogColor},${p.a})`); g.addColorStop(1, `rgba(${fogColor},0)`);
      cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2); cx.fill();
    });
  }
  function fogLoop() { if (running || !S.effects) return; running = true; (function f() { drawFog(); if (still() || !S.effects) { running = false; return; } requestAnimationFrame(f); })(); }
  addEventListener('resize', () => { sizeFog(); if (S.effects) drawFog(); });

  /* ======================= Boot ======================= */
  $$('[data-lang]').forEach(b => b.onclick = () => { S.lang = b.dataset.lang; save(); renderAll(); if (S.tab === 'play') newRound(); });
  function renderAll() {
    applyLook(); i18n(); renderDialects(); renderChips(); renderGameUI(); renderStory(); renderCollection(); renderSettings(); renderPet();
    if (lastRun) renderTests(lastRun);
    lastPainted = null; compute(); setTab(S.tab);
  }

  sizeFog();
  try { const q = new URLSearchParams(location.search).get('lang'); if (q === 'en' || q === 'ro') S.lang = q; } catch {}
  $('#human').value = 'owl candy witch pumpkin';
  const hash = location.hash.slice(1);
  let received = null;
  if (hash.startsWith('msg-')) {
    received = G.decodeShare(hash.slice(4));
    if (received) { S.dialect = received.d; S.level = received.l; S.tab = 'talk'; $('#human').value = received.t; }
  } else {
    const hashTab = hash.replace(/^teste$/, 'tests');
    if (G.TABS.includes(hashTab)) S.tab = hashTab;
  }
  if (S.tab === 'tests') runTests();
  renderAll();
  if (received) toast(L(`Mesaj primit prin link, în dialectul ${dn(received.d)}.`, `Message received by link, in the ${dn(received.d)} dialect.`));
  else if (hash.startsWith('msg-')) toast(L('Linkul primit nu conține un mesaj valid.', 'The link doesn’t contain a valid message.'), true);
  fogLoop();
})();
