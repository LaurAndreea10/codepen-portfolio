/*!
 * Ghost Talk engine v3.0.0 — pure, DOM-free, works in the browser (window.Ghost) and in Node (module.exports).
 * Dialects, decoder, game rules, story graph, profile state. No dependencies.
 */
(function (root, factory) {
  const G = factory();
  if (typeof module === 'object' && module.exports) module.exports = G;
  else root.Ghost = G;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class GhostError extends Error { constructor(code) { super(code); this.code = code; this.name = 'GhostError'; } }
  const own = (o, k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(o, k);
  const VOWELS = new Set(Array.from('aeiouăâîAEIOUĂÂÎ'));
  const SIGIL = '〰';            // 〰 classic signature, one per EMF level
  const MIRROR = '⟲ ';          // ⟲ mirror
  const LOCK = '\u{1F510} ';         // 🔐 secret code
  const RADIO = '\u{1F4FB} ';        // 📻 spirit-box morse
  const RUNE = '᛭ ';            // ᛭ runic
  const MASK = '\u{1F3AD} ';         // 🎭 emoji
  const BAT = '\u{1F987} ';          // 🦇 vampire
  const SCROLL = '\u{1F4DC} ';       // 📜 victorian
  const isV = c => VOWELS.has(c);
  const chars = s => Array.from(s);
  const clamp = l => Math.min(5, Math.max(1, Math.round(Number(l)) || 1));
  const isSpace = c => /\s/.test(c);
  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const stripMarks = s => s.replace(/[̀-ͯ]/g, '');
  const fold = s => stripMarks(String(s ?? '').normalize('NFD')).toLowerCase().replace(/\s+/g, ' ').trim();
  const HEX = /^[0-9a-f]+(?:-[0-9a-f]+)*$/i;
  const invert = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k]));
  const capLike = (src, word) => src === src.toUpperCase() && src.length > 1 ? word.toUpperCase() : src[0] === src[0].toUpperCase() && src[0] !== src[0].toLowerCase() ? word[0].toUpperCase() + word.slice(1) : word;

  /* ---------- Tables ---------- */
  const MORSE = { a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
    0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '-': '-....-', '/': '-..-.', '@': '.--.-.', "'": '.----.' };
  const MORSE_R = invert(MORSE);
  const RUNES = { a: 'ᚨ', b: 'ᛒ', c: 'ᚳ', d: 'ᛞ', e: 'ᛖ', f: 'ᚠ', g: 'ᚷ', h: 'ᚺ', i: 'ᛁ', j: 'ᛃ', k: 'ᚲ', l: 'ᛚ', m: 'ᛗ', n: 'ᚾ', o: 'ᛟ', p: 'ᛈ', q: 'ᛩ', r: 'ᚱ', s: 'ᛋ', t: 'ᛏ', u: 'ᚢ', v: 'ᚡ', w: 'ᚹ', x: 'ᛪ', y: 'ᚤ', z: 'ᛉ', 'ă': 'ᚫ', 'â': 'ᚪ', 'î': 'ᛇ', 'ș': 'ᛌ', 'ț': 'ᛐ', ' ': '᛫' };
  const RUNES_R = invert(RUNES);
  const EMOJI = { a: '🦇', b: '🦴', c: '🍬', d: '🐉', e: '👀', f: '🔥', g: '👻', h: '🎩', i: '🧪', j: '🃏', k: '🔑', l: '🌕', m: '🍄', n: '🌑', o: '🎃', p: '🧙', q: '👑', r: '🐀', s: '💀', t: '🪦', u: '🦉', v: '🧛', w: '🐺', x: '❌', y: '🧶', z: '💤', 'ă': '🍎', 'â': '🌰', 'î': '🦔', 'ș': '🐍', 'ț': '🪲' };
  const EMOJI_R = invert(EMOJI);
  const VICTORIAN = {
    you: 'thee', your: 'thy', yours: 'thine', are: 'art', hello: 'hark', hi: 'hail', yes: 'aye', no: 'nay', do: 'dost', does: 'doth', have: 'hast',
    friend: 'companion', ghost: 'spectre', scary: 'dreadful', candy: 'confection', house: 'manor', mom: 'mother', dad: 'father', cool: 'splendid', ok: 'verily', boo: 'prithee',
    tu: 'dumneata', salut: 'închinăciune', da: 'întocmai', nu: 'nicidecum', prieten: 'amic', prietene: 'amice', 'mamă': 'maică', 'tată': 'taică',
    'fantomă': 'stafie', fantoma: 'stafia', 'casă': 'conac', 'bomboană': 'zaharicală', foarte: 'nespus de', frumos: 'chipeș', bu: 'ascultați'
  };
  const VICTORIAN_R = invert(VICTORIAN);

  const words = s => s.split(/(\p{L}+)/u);   // odd indices are words

  /* The official CodePen rule lives in ghosttalk.js (an ES module, the file the challenge tests import).
     The page and the tests hand it to the engine with useRule(), so there is one source for the rule. */
  let ghostRule = null;
  function useRule(fn) { if (typeof fn !== 'function') throw new GhostError('RULE'); ghostRule = fn; }
  const startsWithVowel = w => 'aeiou'.includes((w.normalize('NFD')[0] || '').toLowerCase());
  function unGhostWord(tok) {                           // andy-coo → candy; owl-boo → owl (approximate)
    const m = tok.match(/^([^\p{L}\p{N}]*)(.+?)-(\p{L})(oo)([^\p{L}\p{N}]*)$/iu);
    if (!m) return tok;
    const [, before, rest, x, oo, after] = m;
    if (x.toLowerCase() === 'b' && startsWithVowel(rest)) return before + rest + after;   // vowel rule (or a word starting with b: ambiguous)
    const shout = oo === 'OO';
    const word = !shout && rest[0] !== rest[0].toLowerCase() ? x.toUpperCase() + rest[0].toLowerCase() + rest.slice(1) : x + rest;
    return before + word + after;
  }

  /* ---------- Dialects ---------- */
  const dialects = {
    codepen: { official: true, voice: { pitch: .6, rate: .8 }, tint: '#bff4ff',
      encode(t) { if (!ghostRule) throw new GhostError('RULE'); return ghostRule(t); },
      approx: g => g.split(/(\s+)/).map((t, i) => (i % 2 ? t : unGhostWord(t))).join(''),
      is: g => { const toks = g.trim().split(/\s+/).filter(t => /\p{L}/u.test(t)); return toks.length > 0 && toks.every(t => /-\p{L}oo[^\p{L}\p{N}]*$/iu.test(t)); } },
    classic: { reversible: true, voice: { pitch: .55, rate: .72 }, tint: '#bff4ff',
      encode(t, l) { if (t.includes(SIGIL)) throw new GhostError('SIGIL'); return chars(t).map(c => isV(c) ? c.repeat(l + 1) : c).join('') + SIGIL.repeat(l); },
      decode(g) {
        g = g.trimEnd();
        const m = g.match(/〰+$/); if (!m) throw new GhostError('NOSIG');
        const l = m[0].length; if (l > 5) throw new GhostError('BROKEN');
        const k = l + 1, cs = chars(g.slice(0, g.length - l)); let out = '';
        for (let i = 0; i < cs.length;) {
          const c = cs[i]; if (!isV(c)) { out += c; i++; continue; }
          let j = i; while (j < cs.length && cs[j] === c) j++;
          if ((j - i) % k) throw new GhostError('BROKEN');
          out += c.repeat((j - i) / k); i = j;
        }
        return out;
      },
      is: g => /〰+$/.test(g.trim()) },
    mirror: { reversible: true, voice: { pitch: 1.1, rate: .8 }, tint: '#a9c8ff',
      encode(t) { return MIRROR + chars(t).reverse().join(''); },
      decode(g) { if (!g.startsWith(MIRROR)) throw new GhostError('NOSIG'); return chars(g.slice(MIRROR.length)).reverse().join(''); },
      is: g => g.startsWith(MIRROR) },
    secret: { reversible: true, speaksHuman: true, voice: { pitch: .8, rate: .9 }, tint: '#ffe39a',
      encode(t) { return LOCK + chars(t).map(c => c.codePointAt(0).toString(16)).join('-'); },
      decode(g) {
        const s = (g.startsWith(LOCK) ? g.slice(LOCK.length) : g).trim();
        if (!HEX.test(s)) throw new GhostError('BROKEN');
        try { return s.split('-').map(h => String.fromCodePoint(parseInt(h, 16))).join(''); } catch { throw new GhostError('BROKEN'); }
      },
      is: g => g.trim().startsWith(LOCK.trim()) || /^[0-9a-f]+(?:-[0-9a-f]+)+$/i.test(g.trim()) },
    morse: { reversible: true, lowercase: true, speaksHuman: false, voice: { pitch: .9, rate: 1.1 }, tint: '#ffd0a0',
      encode(t, l) {
        if (/[⟨⟩]/.test(t)) throw new GhostError('SIGIL');
        const dash = 'b' + 'u'.repeat(l + 2);
        return RADIO + t.toLowerCase().trim().split(/\s+/).map(w => chars(w).map(c => own(MORSE, c)
          ? MORSE[c].split('').map(s => s === '.' ? 'bu' : dash).join('-') : '⟨' + c + '⟩').join(' ')).join(' / ');
      },
      decode(g) {
        if (!g.startsWith(RADIO)) throw new GhostError('NOSIG');
        const body = g.slice(RADIO.length).trim(); if (!body) return '';
        return body.split(' / ').map(w => w.split(' ').map(tok => {
          const m = tok.match(/^⟨(.+)⟩$/u); if (m) return m[1];
          const code = tok.split('-').map(p => p === 'bu' ? '.' : /^buu+$/.test(p) ? '-' : null);
          if (code.includes(null) || !own(MORSE_R, code.join(''))) throw new GhostError('BROKEN');
          return MORSE_R[code.join('')];
        }).join('')).join(' ');
      },
      is: g => g.startsWith(RADIO) },
    runic: { reversible: true, lowercase: true, speaksHuman: true, voice: { pitch: .4, rate: .7 }, tint: '#d9c7a0',
      encode(t) {
        if (chars(t).some(c => own(RUNES_R, c))) throw new GhostError('SIGIL');
        return RUNE + chars(t.toLowerCase()).map(c => own(RUNES, c) ? RUNES[c] : c).join('');
      },
      decode(g) { if (!g.startsWith(RUNE)) throw new GhostError('NOSIG'); return chars(g.slice(RUNE.length)).map(c => own(RUNES_R, c) ? RUNES_R[c] : c).join(''); },
      is: g => g.startsWith(RUNE) },
    emoji: { reversible: true, lowercase: true, speaksHuman: true, voice: { pitch: 1.3, rate: .95 }, tint: '#ffc2e0',
      encode(t) {
        if (chars(t).some(c => own(EMOJI_R, c))) throw new GhostError('SIGIL');
        return MASK + chars(t.toLowerCase()).map(c => own(EMOJI, c) ? EMOJI[c] : c).join('');
      },
      decode(g) { if (!g.startsWith(MASK)) throw new GhostError('NOSIG'); return chars(g.slice(MASK.length)).map(c => own(EMOJI_R, c) ? EMOJI_R[c] : c).join(''); },
      is: g => g.startsWith(MASK) },
    poltergeist: { reversible: true, voice: { pitch: .2, rate: 1.15 }, tint: '#c7ff9e',
      encode(t, l) {
        const R = rng(hash(t) + l);
        return chars(t).map(c => { if (isSpace(c)) return c; let s = c; const n = Math.floor(R() * (l * 2 + 1)); for (let i = 0; i < n; i++) s += String.fromCharCode(0x300 + Math.floor(R() * 0x70)); return s; }).join('');
      },
      decode: g => stripMarks(g),
      is: g => /[̀-ͯ]/.test(g) },

    whisper: { voice: { pitch: .9, rate: .62, volume: .45 }, tint: '#c9d3ea',
      encode(t, l) { return 'p' + 's'.repeat(l) + 't… ' + chars(t.toLowerCase()).map(c => c === 's' ? 'sh' : isV(c) ? c + c : c).join('') + '…'; },
      approx: g => g.replace(/^ps+t… /, '').replace(/…$/, '').replace(/sh/g, 's').replace(/([aeiouăâî])\1/g, '$1'),
      is: g => /^ps+t… /.test(g) },
    banshee: { voice: { pitch: 2, rate: .85 }, tint: '#f6c6ff',
      encode(t, l) { return chars(t).map(c => isV(c) ? c.toUpperCase().repeat(l + 2) + c.toLowerCase().repeat(l) : c.toUpperCase()).join('') + '!'.repeat(l); },
      approx: g => g.replace(/!+$/, '').toLowerCase().replace(/([aeiouăâî])\1+/g, '$1'),
      is: g => /!+$/.test(g) && /([AEIOUĂÂÎ])\1{2,}/.test(g) },
    strigoi: { voice: { pitch: .15, rate: .58 }, tint: '#ffb3a1',
      encode(t, l) { let i = 0; return chars(t).map(c => { if (isSpace(c)) return c; const r = /[rR]/.test(c) ? c.repeat(l + 1) : c; return (i++ % 2) ? r.toUpperCase() : r.toLowerCase(); }).join('') + ' …b' + 'r'.repeat(l + 1); },
      approx: g => g.replace(/ …br+$/, '').toLowerCase().replace(/r{2,}/g, 'r'),
      is: g => / …br{2,}$/.test(g) },
    sleepy: { voice: { pitch: .7, rate: .5 }, tint: '#d7c8ff',
      encode(t, l) { return chars(t.toLowerCase()).map(c => isV(c) ? c.repeat(l + 1) : c).join('') + '… ' + 'z'.repeat(l + 2); },
      approx: g => g.replace(/… z+$/, '').replace(/([aeiouăâî])\1+/g, '$1'),
      is: g => /… z{3,}$/.test(g) },
    vampire: { voice: { pitch: .45, rate: .7 }, tint: '#ff8fa3',
      encode(t, l) {
        const s = t.replace(/th/g, 'z').replace(/Th/g, 'Z').replace(/TH/g, 'Z').replace(/w/g, 'v').replace(/W/g, 'V');
        return BAT + s + ' …mwa' + 'ha'.repeat(l + 1) + '!';
      },
      approx: g => g.slice(BAT.length).replace(/ …mwa(?:ha)+!$/, ''),
      is: g => g.startsWith(BAT) },
    victorian: { voice: { pitch: .95, rate: .78 }, tint: '#e8d9b0',
      encode(t, l) {
        const body = words(t).map((w, i) => { if (i % 2 === 0) return w; const k = w.toLowerCase(); return own(VICTORIAN, k) ? capLike(w, VICTORIAN[k]) : w; }).join('');
        const tail = ['', '', ', prithee', ', prithee, most honoured', ', prithee, most honoured soul', ', prithee, most honoured and esteemed soul'][l];
        return SCROLL + body + tail;
      },
      approx: g => words(g.slice(SCROLL.length).replace(/, prithee.*$/, '')).map((w, i) => { if (i % 2 === 0) return w; const k = w.toLowerCase(); return own(VICTORIAN_R, k) ? capLike(w, VICTORIAN_R[k]) : w; }).join(''),
      is: g => g.startsWith(SCROLL) },
    echo: { voice: { pitch: .8, rate: .8 }, tint: '#9ef0d0',
      encode(t, l) { return words(t).map((w, i) => { if (i % 2 === 0 || chars(w).length < 3) return w; const tail = chars(w).slice(-2).join('').toLowerCase(); return w + ('-' + tail).repeat(l); }).join(''); },
      approx: g => g.replace(/(\p{L}*?(\p{L}{2}))((?:-\2)+)(?!\p{L})/giu, '$1'),
      is: g => /(\p{L}{2})(?:-\1)+(?!\p{L})/iu.test(g) }
  };
  const IDENTIFY_ORDER = ['classic', 'mirror', 'secret', 'morse', 'runic', 'emoji', 'vampire', 'victorian', 'codepen', 'whisper', 'sleepy', 'strigoi', 'banshee', 'poltergeist', 'echo'];
  const REVERSIBLE = Object.keys(dialects).filter(k => dialects[k].reversible);
  const ONE_WAY = Object.keys(dialects).filter(k => !dialects[k].reversible);

  function translate(text, dialect = 'codepen', level = 3) {
    if (!own(dialects, dialect)) throw new GhostError('DIALECT');
    if (typeof text !== 'string' || !text.trim()) return '';
    return dialects[dialect].encode(text, clamp(level));
  }
  function chain(text, list, level = 3) {
    if (!Array.isArray(list) || !list.length) return typeof text === 'string' ? text : '';
    return list.reduce((acc, d) => translate(acc, d, level), text);
  }
  function identify(g) {
    if (typeof g !== 'string' || !g.trim()) return null;
    return IDENTIFY_ORDER.find(k => dialects[k].is(g)) || null;
  }
  function detect(g) {               // reversible dialects only
    const d = identify(g);
    return d && dialects[d].reversible ? d : null;
  }
  function decode(g) {
    const d = detect(g); if (!d) throw new GhostError('NOSIG');
    return dialects[d].decode(g);
  }
  function decodeAny(g) {
    const d = identify(g); if (!d) throw new GhostError('NOSIG');
    const D = dialects[d];
    return D.reversible ? { text: D.decode(g), dialect: d, exact: true } : { text: D.approx(g), dialect: d, exact: false };
  }

  /* ---------- Words, games ---------- */
  const WORDS = {
    ro: ['lună', 'castel', 'fantomă', 'dovleac', 'magie', 'secret', 'bufniță', 'umbră', 'lumânare', 'vrăjitoare', 'liliac', 'mister', 'păianjen', 'mătură', 'poțiune',
      'craniu', 'cimitir', 'noapte', 'coș', 'felinar', 'bomboană', 'pălărie', 'schelet', 'vampir', 'lup', 'mumie', 'ceață', 'cheie', 'cufăr', 'oglindă'],
    en: ['moon', 'castle', 'ghost', 'pumpkin', 'magic', 'secret', 'owl', 'shadow', 'candle', 'witch', 'bat', 'mystery', 'spider', 'broom', 'potion',
      'skull', 'graveyard', 'night', 'basket', 'lantern', 'candy', 'hat', 'skeleton', 'vampire', 'wolf', 'mummy', 'fog', 'key', 'chest', 'mirror']
  };
  const DIFFICULTY = {
    easy: { fits: w => fold(w).length <= 5, emf: 1, memory: 3, choir: 2, boo: 30, lives: 8, typing: 1 },
    medium: { fits: () => true, emf: 3, memory: 4, choir: 3, boo: 60, lives: 6, typing: 1 },
    nightmare: { fits: w => fold(w).length >= 7, emf: 5, memory: 6, choir: 5, boo: 200, lives: 4, typing: 2 }
  };
  const GAMES = ['guess', 'typing', 'memory', 'letters', 'secret', 'choir', 'boo', 'hangman', 'daily', 'vocab', 'arcade', 'duo'];
  const ARCADE_POOL = ['guess', 'typing', 'letters', 'secret', 'boo', 'vocab'];
  const booscary = n => n % 15 === 0 ? 'BooScary' : n % 3 === 0 ? 'Boo' : n % 5 === 0 ? 'Scary' : String(n);
  const sameAnswer = (a, b) => fold(a) !== '' && fold(a) === fold(b);
  const digits = s => String(s ?? '').replace(/[^1-9]/g, '');
  const dailyIndex = (ms, n) => Math.floor(ms / 86400000) % n;
  const pickWord = (lang, difficulty, rand) => {
    const list = WORDS[lang === 'en' ? 'en' : 'ro'], d = DIFFICULTY[difficulty] || DIFFICULTY.medium;
    const pool = list.filter(d.fits);
    return pool[Math.floor(rand() * pool.length)];
  };
  function makeRound(game, opts = {}) {
    const lang = opts.lang === 'en' ? 'en' : 'ro', diff = own(DIFFICULTY, opts.difficulty) ? opts.difficulty : 'medium', D = DIFFICULTY[diff];
    const rand = opts.rand || Math.random, dialect = own(dialects, opts.dialect) ? opts.dialect : 'classic';
    if (game === 'arcade') game = ARCADE_POOL[Math.floor(rand() * ARCADE_POOL.length)];
    const w = pickWord(lang, diff, rand), seq = n => Array.from({ length: n }, () => 1 + Math.floor(rand() * 4)).join(' ');
    switch (game) {
      case 'guess': return { game, prompt: translate(w, dialect, D.emf), expected: w, dialect };
      case 'typing': return { game, prompt: w, expected: translate(w, 'classic', D.typing).slice(0, -D.typing) };
      case 'memory': { const s = seq(D.memory); return { game, prompt: s, expected: s, seq: s, digits: true, hideAfter: 3000 }; }
      case 'letters': return { game, prompt: chars(w).reverse().join(' · '), expected: w };
      case 'secret': return { game, prompt: translate(w, 'secret'), expected: w };
      case 'choir': { const s = seq(D.choir); return { game, prompt: '♪ ♫ ♪ ?', expected: s, seq: s, digits: true, audio: true }; }
      case 'boo': { const n = 1 + Math.floor(rand() * D.boo); return { game, prompt: `${n} → ?`, expected: booscary(n), n }; }
      case 'vocab': { const i = WORDS[lang].indexOf(w), other = lang === 'ro' ? 'en' : 'ro'; return { game, prompt: WORDS[other][i], expected: w }; }
      case 'hangman': return { game, ...hangmanNew(w, D.lives) };
      case 'daily': return { game, ...dailyNew(lang, opts.now ?? Date.now()) };
      case 'duo': return { game, stage: 'p1', prompt: '', expected: '' };
      default: throw new GhostError('GAME');
    }
  }
  function checkAnswer(round, answer) {
    if (!round) return false;
    if (round.digits) return digits(answer) !== '' && digits(answer) === digits(round.expected);
    return sameAnswer(answer, round.expected);
  }

  /* Hangman — the ghost fades with every wrong letter */
  const isLetter = c => /\p{L}/u.test(c);
  function hangmanNew(word, lives = 6) { return { word, guessed: [], wrong: 0, lives }; }
  function hangmanGuess(h, letter) {
    const l = fold(letter).slice(0, 1);
    if (!l || !isLetter(l) || h.guessed.includes(l) || hangmanStatus(h) !== 'playing') return h;
    const hit = chars(h.word).some(c => fold(c) === l);
    return { ...h, guessed: [...h.guessed, l], wrong: h.wrong + (hit ? 0 : 1) };
  }
  const hangmanView = h => chars(h.word).map(c => !isLetter(c) || h.guessed.includes(fold(c)) ? c : '_').join(' ');
  const hangmanStatus = h => h.wrong >= h.lives ? 'lost' : chars(h.word).every(c => !isLetter(c) || h.guessed.includes(fold(c))) ? 'won' : 'playing';

  /* Daily puzzle — Wordle-style feedback, shareable squares */
  const dayKey = ms => new Date(ms).toISOString().slice(0, 10);
  function dailyWord(lang, ms) { const list = WORDS[lang === 'en' ? 'en' : 'ro']; return list[dailyIndex(ms, list.length)]; }
  function dailyNew(lang, ms) { const w = dailyWord(lang, ms); return { expected: w, date: dayKey(ms), rows: [], max: 6, prompt: chars(w).map((c, i) => i === 0 ? c : '_').join(' ') }; }
  function wordleScore(guess, answer) {
    const g = chars(fold(guess)), a = chars(fold(answer));
    if (g.length !== a.length) throw new GhostError('LENGTH');
    const res = g.map(() => 'miss'), left = {};
    a.forEach((c, i) => { if (g[i] === c) res[i] = 'hit'; else left[c] = (left[c] || 0) + 1; });
    g.forEach((c, i) => { if (res[i] !== 'hit' && left[c]) { res[i] = 'near'; left[c]--; } });
    return res;
  }
  const SQUARE = { hit: '🟩', near: '🟨', miss: '⬛' };
  function shareText(date, rows, solved, max = 6) {
    return `Ghost Talk ${date} · ${solved ? rows.length : 'X'}/${max} 👻\n` + rows.map(r => r.map(x => SQUARE[x]).join('')).join('\n');
  }

  /* ---------- Story ---------- */
  const RIVAL = 'Zăbrel';
  const STORY = [
    { ro: 'Într-un castel vechi găsești o scrisoare sigilată cu ceară verde. Pe plic scrie doar: „Pentru {name}”. Unde cauți cheia sigiliului?', en: 'In an old castle you find a letter sealed with green wax. The envelope only says: “For {name}”. Where do you look for the seal’s key?',
      next: [[1, 'Biblioteca', 'The library'], [2, 'Grădina', 'The garden']] },
    { ro: 'În bibliotecă, lumina lunii cade pe o hartă: o săgeată arată spre turn, alta spre criptă.', en: 'In the library, moonlight falls on a map: one arrow points to the tower, another to the crypt.',
      next: [[3, 'Urcă în turn', 'Climb the tower'], [4, 'Coboară în criptă', 'Go down to the crypt']] },
    { ro: 'La poarta grădinii, o fantomă îți cere parola PRIETEN. Dar numai pe limba fantomelor: dialectul Clasic, EMF 1, fără 〰.', en: 'At the garden gate, a ghost asks for the password FRIEND. But only in ghost: Classic dialect, EMF 1, no 〰.',
      puzzle: { kind: 'classic1', word: { ro: 'prieten', en: 'friend' }, success: 5, hint: ['Dublează fiecare vocală. Exemplu: bu → buu.', 'Double every vowel. Example: boo → boooo.'] },
      next: [[1, 'Înapoi la bibliotecă', 'Back to the library']] },
    { ro: 'Din umbra turnului apare {rival}, un strigoi cu pelerina roasă de molii: „Scrisoarea e a mea! Hai la un duel de ghicitori.”', en: 'From the tower’s shadow steps {rival}, a strigoi in a moth-eaten cape: “That letter is mine! Let’s duel with riddles.”',
      speaker: 'rival', next: [[6, 'Acceptă duelul', 'Accept the duel'], [4, 'Fugi în criptă', 'Flee to the crypt']] },
    { ro: 'Cripta răspunde cu ecou la fiecare pas. Pe un mormânt e o inscripție, iar pe perete o scară urcă spre grădină.', en: 'The crypt echoes every step. There’s an inscription on a tomb, and a ladder on the wall climbs to the garden.',
      next: [[7, 'Citește inscripția', 'Read the inscription'], [2, 'Urcă în grădină', 'Climb to the garden']] },
    { ro: 'Poarta se deschide. O bufniță îți lasă în palmă cheia sigiliului. Ce faci cu scrisoarea?', en: 'The gate opens. An owl drops the seal’s key into your hand. What do you do with the letter?',
      next: [[8, 'Du-i-o lui {name}', 'Bring it to {name}'], [9, 'Păstreaz-o în arhivă', 'Keep it in the archive']] },
    { ro: '{rival} rânjește: „Ce strigă fantoma când numără până la 15?”', en: '{rival} grins: “What does the ghost shout when it counts to 15?”',
      speaker: 'rival', puzzle: { kind: 'booscary', n: 15, success: 10, hint: ['Multiplu de 3 → Boo, de 5 → Scary, de ambele → …', 'Multiple of 3 → Boo, of 5 → Scary, of both → …'] },
      next: [[12, 'Renunță la duel', 'Give up the duel']] },
    { ro: 'Inscripția e un cod secret: {code}. Descifrează-l ca să afli unde trebuie să ajungă scrisoarea.', en: 'The inscription is a secret code: {code}. Crack it to learn where the letter must go.',
      puzzle: { kind: 'secret', word: { ro: 'acasă', en: 'home' }, success: 11, hint: ['Fiecare grup hex e o literă: 61 = a, 63 = c.', 'Each hex group is one letter: 68 = h, 6f = o.'] },
      next: [[4, 'Înapoi în criptă', 'Back into the crypt']] },
    { ro: 'Scrisoarea ajunge la {name}. Castelul răsună de râsete!', en: 'The letter reaches {name}. The castle fills with laughter!', end: true },
    { ro: 'Ai ales să păstrezi scrisoarea în arhivă. Misterul așteaptă o altă aventură.', en: 'You kept the letter in the archive. The mystery awaits another adventure.', end: true },
    { ro: '{rival} pufnește, apoi râde: „BooScary! Ai câștigat.” De azi sunteți prieteni și bântuiți castelul împreună.', en: '{rival} huffs, then laughs: “BooScary! You win.” From today you’re friends and haunt the castle together.', speaker: 'rival', end: true },
    { ro: 'Codul spunea „acasă”. Duci scrisoarea în căsuța lui {name}, unde o lumânare ardea de un secol. Era de la Bunica Fantomă.', en: 'The code said “home”. You bring the letter to {name}’s little house, where a candle had burned for a century. It was from Grandma Ghost.', end: true },
    { ro: '{rival} fuge cu scrisoarea în ceață. Poate îl prinzi la Halloweenul următor.', en: '{rival} runs off into the fog with the letter. Maybe you’ll catch him next Halloween.', speaker: 'rival', end: true }
  ];
  const ENDINGS = STORY.map((n, i) => n.end ? i : -1).filter(i => i >= 0);
  function storyText(i, lang, name) {
    const n = STORY[i], L = lang === 'en' ? 'en' : 'ro';
    let t = n[L].replaceAll('{name}', name || 'Boo').replaceAll('{rival}', RIVAL);
    if (n.puzzle && n.puzzle.kind === 'secret') t = t.replace('{code}', translate(n.puzzle.word[L], 'secret').replace(LOCK, ''));
    return t;
  }
  function storyAnswer(i, lang) {
    const p = STORY[i] && STORY[i].puzzle, L = lang === 'en' ? 'en' : 'ro';
    if (!p) return null;
    if (p.kind === 'classic1') return translate(p.word[L], 'classic', 1).slice(0, -1);
    if (p.kind === 'booscary') return booscary(p.n);
    return p.word[L];
  }

  /* ---------- Profile ---------- */
  const HATS = { none: 0, top: 0, crown: 40, wizard: 80 };
  const EXTRAS = { none: 0, scarf: 20, glasses: 60, lantern: 150 };
  const COLORS = { auto: [0, ''], lavender: [60, '#d9c8ff'], mint: [120, '#b8f5d6'], candy: [180, '#ffc6dd'], ember: [250, '#ffc59a'], gold: [400, '#ffe08a'] };
  const DECORS = ['night', 'castle', 'forest', 'pumpkins'];
  const BADGES = [{ id: 'new', xp: 0 }, { id: 'echo', xp: 40 }, { id: 'master', xp: 80 }, { id: 'banshee', xp: 200 }, { id: 'legend', xp: 500 }];
  const levelOf = xp => ({ level: 1 + Math.floor(xp / 100), into: xp % 100 });
  const badgeOf = xp => BADGES.filter(b => xp >= b.xp).pop().id;
  const ACHIEVEMENTS = [
    ['first-words', s => s.stats.translations >= 1], ['chatterbox', s => s.stats.translations >= 100],
    ['polyglot', s => Object.keys(dialects).every(d => s.stats.dialects.includes(d))], ['streak-10', s => s.best >= 10],
    ['storyteller', s => ENDINGS.every(e => s.endings.includes(e))], ['first-ending', s => s.endings.length >= 1],
    ['hangman', s => s.stats.hangmanWins >= 1], ['arcade-10', s => s.arcadeBest >= 10], ['daily', s => s.stats.dailyWins >= 1],
    ['collector', s => s.favorites.length >= 5], ['artist', s => s.stats.cards >= 1], ['thereminist', s => s.stats.theremin >= 1],
    ['alchemist', s => s.stats.chain >= 1], ['critic', s => s.stats.compare >= 1]
  ].map(([id, test]) => ({ id, test }));
  const newAchievements = s => ACHIEVEMENTS.filter(a => !s.achievements.includes(a.id) && a.test(s)).map(a => a.id);
  function moodOf({ hour = 12, idleMs = 0, streak = 0 } = {}) {
    if (streak >= 3) return 'excited';
    if (hour < 6 || hour >= 23 || idleMs > 300000) return 'sleepy';
    if (idleMs > 60000) return 'bored';
    return 'happy';
  }

  /* Share links: #msg-<base64url(JSON)> — only URL-safe characters */
  function toB64url(str) { const b = new TextEncoder().encode(str); let s = ''; b.forEach(x => { s += String.fromCharCode(x); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function fromB64url(tok) { const s = atob(tok.replace(/-/g, '+').replace(/_/g, '/')); return new TextDecoder().decode(Uint8Array.from(s, c => c.charCodeAt(0))); }
  function encodeShare(msg) { return toB64url(JSON.stringify({ t: String(msg.t || '').slice(0, 500), d: own(dialects, msg.d) ? msg.d : 'classic', l: clamp(msg.l) })); }
  function decodeShare(tok) {
    try {
      if (typeof tok !== 'string' || !/^[A-Za-z0-9_-]{2,2000}$/.test(tok)) return null;
      const o = JSON.parse(fromB64url(tok));
      if (!o || typeof o.t !== 'string' || !o.t.trim() || !own(dialects, o.d)) return null;
      return { t: o.t.slice(0, 500), d: o.d, l: clamp(o.l) };
    } catch { return null; }
  }

  const TABS = ['talk', 'play', 'story', 'collection', 'tests', 'settings'];
  const LEGACY_HAT = { '': 'none', '\u{1F3A9}': 'top', '\u{1F451}': 'crown', '\u{1F9D9}': 'wizard' };
  const LEGACY_DECOR = { '\u{1F30C}': 'night', '\u{1F3F0}': 'castle', '\u{1F332}': 'forest', '\u{1F383}': 'pumpkins' };
  const STAT_KEYS = ['translations', 'hangmanWins', 'dailyWins', 'cards', 'theremin', 'chain', 'compare'];
  const num = (v, min, max, d) => Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d;
  function defaults() {
    return { v: 3, lang: 'ro', tab: 'talk', xp: 0, favorites: [], log: [], name: 'Boo', hat: 'none', extra: 'none', color: 'auto', decor: 'night', theme: 'night',
      motion: false, effects: true, contrast: false, sfx: true, echo: false, ambient: false, font: 'default', scale: 1, rate: 1, volume: .7,
      story: 0, endings: [], visited: [0], solved: [], dialect: 'codepen', level: 3, chain: [], game: 'guess', difficulty: 'medium', best: 0, arcadeBest: 0,
      daily: { date: '', lang: 'ro', rows: [], guesses: [], done: false, won: false }, achievements: [],
      stats: { translations: 0, dialects: [], hangmanWins: 0, dailyWins: 0, cards: 0, theremin: 0, chain: 0, compare: 0 } };
  }
  function normalizeState(s) {
    const d = defaults();
    if (!s || typeof s !== 'object' || Array.isArray(s)) return d;
    const entry = e => typeof e === 'string' ? (e ? { g: e.slice(0, 2000), src: '', d: '' } : null)
      : (e && typeof e === 'object' && typeof e.g === 'string' && e.g) ? { g: e.g.slice(0, 2000), src: typeof e.src === 'string' ? e.src.slice(0, 1500) : '', d: own(dialects, e.d) ? e.d : '' } : null;
    const logEntry = e => e && typeof e === 'object' && typeof e.g === 'string' && typeof e.src === 'string' && own(dialects, e.d)
      ? { src: e.src.slice(0, 1500), g: e.g.slice(0, 2000), d: e.d, l: clamp(e.l) } : null;
    const legacy = s.v !== 3;                         // v1/v2 story: 3 = laughter ending, 4 = archive ending
    const mapNode = n => legacy ? ({ 3: 8, 4: 9 })[n] ?? n : n;
    const nodeOk = n => Number.isInteger(n) && n >= 0 && n < STORY.length;
    const st = s.stats && typeof s.stats === 'object' && !Array.isArray(s.stats) ? s.stats : {};
    const stats = { dialects: Array.isArray(st.dialects) ? [...new Set(st.dialects.filter(x => own(dialects, x)))] : [] };
    STAT_KEYS.forEach(k => { stats[k] = Number.isFinite(st[k]) ? Math.max(0, Math.min(1e7, Math.floor(st[k]))) : 0; });
    const dl = s.daily && typeof s.daily === 'object' ? s.daily : {};
    const validRow = r => Array.isArray(r) && r.length <= 20 && r.every(x => x === 'hit' || x === 'near' || x === 'miss');
    const daily = typeof dl.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dl.date) && Array.isArray(dl.rows) && dl.rows.length <= 6 && dl.rows.every(validRow)
      && Array.isArray(dl.guesses) && dl.guesses.length === dl.rows.length && dl.guesses.every(g => typeof g === 'string' && g.length <= 30)
      ? { date: dl.date, lang: dl.lang === 'en' ? 'en' : 'ro', rows: dl.rows, guesses: dl.guesses, done: dl.done === true, won: dl.won === true } : d.daily;
    return {
      v: 3,
      lang: s.lang === 'en' ? 'en' : 'ro',
      tab: TABS.includes(s.tab) ? s.tab : 'talk',
      xp: Number.isFinite(s.xp) ? Math.max(0, Math.min(100000, Math.floor(s.xp))) : 0,
      favorites: Array.isArray(s.favorites) ? s.favorites.map(entry).filter(Boolean).slice(0, 30) : [],
      log: Array.isArray(s.log) ? s.log.map(logEntry).filter(Boolean).slice(0, 8) : [],
      name: typeof s.name === 'string' && s.name.trim() ? s.name.trim().slice(0, 30) : 'Boo',
      hat: own(HATS, s.hat) ? s.hat : own(LEGACY_HAT, s.hat) ? LEGACY_HAT[s.hat] : d.hat,
      extra: own(EXTRAS, s.extra) ? s.extra : 'none',
      color: own(COLORS, s.color) ? s.color : 'auto',
      decor: DECORS.includes(s.decor) ? s.decor : own(LEGACY_DECOR, s.decor) ? LEGACY_DECOR[s.decor] : d.decor,
      theme: s.theme === 'dawn' || s.light === true ? 'dawn' : 'night',
      motion: s.motion === true, effects: s.effects !== false, contrast: s.contrast === true, sfx: s.sfx !== false, echo: s.echo === true, ambient: s.ambient === true,
      font: s.font === 'lexend' ? 'lexend' : 'default', scale: num(s.scale, 1, 1.5, 1),
      rate: num(s.rate, .5, 1.5, 1), volume: num(s.volume, 0, 1, .7),
      story: nodeOk(mapNode(s.story)) ? mapNode(s.story) : 0,
      endings: Array.isArray(s.endings) ? [...new Set(s.endings.map(mapNode).filter(n => ENDINGS.includes(n)))] : [],
      visited: Array.isArray(s.visited) ? [...new Set([0, ...s.visited.filter(nodeOk)])] : [0],
      solved: Array.isArray(s.solved) ? [...new Set(s.solved.filter(n => nodeOk(n) && STORY[n].puzzle))] : [],
      dialect: own(dialects, s.dialect) ? s.dialect : 'codepen',
      level: s.level == null ? 3 : clamp(s.level),
      chain: Array.isArray(s.chain) ? s.chain.filter(x => own(dialects, x)).slice(0, 2) : [],
      game: GAMES.includes(s.game) ? s.game : 'guess',
      difficulty: own(DIFFICULTY, s.difficulty) ? s.difficulty : 'medium',
      best: Number.isFinite(s.best) ? Math.max(0, Math.floor(s.best)) : 0,
      arcadeBest: Number.isFinite(s.arcadeBest) ? Math.max(0, Math.floor(s.arcadeBest)) : 0,
      daily, achievements: Array.isArray(s.achievements) ? [...new Set(s.achievements.filter(a => ACHIEVEMENTS.some(x => x.id === a)))] : [],
      stats
    };
  }

  return {
    VERSION: '4.1.0', useRule, translate, chain, identify, detect, decode, decodeAny, stripMarks, fold, list: () => Object.keys(dialects), dialects, REVERSIBLE, ONE_WAY,
    GhostError, SIGIL, MIRROR, LOCK, RADIO, RUNE, MASK, BAT, SCROLL, MORSE, RUNES, EMOJI, VICTORIAN, hash, rng, clamp, chars,
    WORDS, DIFFICULTY, GAMES, ARCADE_POOL, booscary, sameAnswer, dailyIndex, pickWord, makeRound, checkAnswer,
    hangmanNew, hangmanGuess, hangmanView, hangmanStatus, dayKey, dailyWord, dailyNew, wordleScore, shareText,
    RIVAL, STORY, ENDINGS, storyText, storyAnswer,
    HATS, EXTRAS, COLORS, DECORS, BADGES, ACHIEVEMENTS, levelOf, badgeOf, newAchievements, moodOf, encodeShare, decodeShare,
    TABS, defaults, normalizeState
  };
});
