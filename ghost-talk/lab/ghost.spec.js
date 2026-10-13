/*!
 * Ghost Talk specs — one set of test definitions, two runners:
 *   • real Jest in Node:  tests/ghost.test.js  →  GhostSpecs({ describe, it, expect }, require('../engine.js'))
 *   • in the browser:     GhostSuite(window.Ghost)  →  a tiny Jest-compatible runner + API coverage report
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.GhostSpecs = api.GhostSpecs; root.GhostSuite = api.GhostSuite; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function GhostSpecs({ describe, it, expect, test }, G, extras = {}) {
    const S = G.SIGIL;

    // The challenge’s own starter tests, word for word. Jest runs them from ghosttalk.test.js;
    // the page runs them here against the same ghostTalk() from ghosttalk.js.
    if (typeof extras.ghostTalk === 'function') {
      const ghostTalk = extras.ghostTalk, t = test || it;
      describe('👻 Ghost Talk (official starter tests)', () => {
        t('words that start with a vowel get -boo added to the end', () => {
          expect(ghostTalk('owl')).toBe('owl-boo');
          expect(ghostTalk('apple')).toBe('apple-boo');
          expect(ghostTalk('ice')).toBe('ice-boo');
        });
        t('words that start with a consonant move the first letter to the end and add -oo', () => {
          expect(ghostTalk('candy')).toBe('andy-coo');
          expect(ghostTalk('witch')).toBe('itch-woo');
          expect(ghostTalk('pumpkin')).toBe('umpkin-poo');
        });
      });
    }

    describe('official rule — sentences, capitals, punctuation', () => {
      it('is the default dialect and matches the starter examples', () => {
        expect(['owl', 'apple', 'ice', 'candy', 'witch', 'pumpkin'].map(w => G.translate(w)))
          .toEqual(['owl-boo', 'apple-boo', 'ice-boo', 'andy-coo', 'itch-woo', 'umpkin-poo']);
      });
      it('translates sentences word by word and keeps punctuation', () => expect(G.translate('Happy Halloween, candy!', 'codepen')).toBe('Appy-hoo Alloween-hoo, andy-coo!'));
      it('keeps capitals where they belong', () => expect(G.translate('Owl Witch', 'codepen')).toBe('Owl-boo Itch-woo'));
      it('keeps shouted words shouted', () => expect(G.translate('BOO OWL', 'codepen')).toBe('OO-BOO OWL-BOO'));
      it('a one-letter consonant just says oo', () => expect(G.translate('b', 'codepen')).toBe('boo'));
      it('treats Romanian and accented vowels as vowels', () => expect(G.translate('ăla Înger école', 'codepen')).toBe('ăla-boo Înger-boo école-boo'));
      it('leaves numbers and symbols alone', () => expect(G.translate('room 13 👻', 'codepen')).toBe('oom-roo 13 👻'));
      it('keeps inner apostrophes and hyphens inside one word', () => expect(G.translate("don't", 'codepen')).toBe("on't-doo"));
      it('is recognised and translated back approximately', () => {
        const r = G.decodeAny(G.translate('Candy, witch and pumpkin!', 'codepen'));
        expect([r.dialect, r.exact, r.text]).toEqual(['codepen', false, 'Candy, witch and pumpkin!']);
      });
      it('reads -boo after a vowel as the vowel rule', () => expect(G.decodeAny('owl-boo').text).toBe('owl'));
      it('useRule() refuses anything that is not a function', () => expect(() => G.useRule('rule')).toThrow('RULE'));
    });
    const seeded = seed => G.rng(seed);
    const randomPhrases = (seed, alphabet, n, maxLen = 24) => {
      const R = seeded(seed), abc = G.chars(alphabet), out = [];
      for (let k = 0; k < n; k++) {
        let s = ''; const len = 1 + Math.floor(R() * maxLen);
        for (let i = 0; i < len; i++) s += abc[Math.floor(R() * abc.length)];
        if (s.trim()) out.push(s);
      }
      return out;
    };

    describe('translate() — basics', () => {
      it('returns an empty string for empty input', () => expect(G.translate('')).toBe(''));
      it('returns an empty string for whitespace-only input', () => expect(G.translate('   \n ', 'banshee', 4)).toBe(''));
      it('throws DIALECT for an unknown dialect', () => expect(() => G.translate('boo', 'vampyre')).toThrow('DIALECT'));
      it('throws DIALECT for inherited keys like "toString"', () => expect(() => G.translate('boo', 'toString')).toThrow('DIALECT'));
      it('has 15 dialects: the official rule, 7 reversible and 7 more one-way', () => {
        expect(G.list().length).toBe(15);
        expect(G.REVERSIBLE).toEqual(['classic', 'mirror', 'secret', 'morse', 'runic', 'emoji', 'poltergeist']);
        expect(G.ONE_WAY).toEqual(['codepen', 'whisper', 'banshee', 'strigoi', 'sleepy', 'vampire', 'victorian', 'echo']);
      });
      it('clamps the EMF level into 1–5', () => {
        expect(G.translate('o', 'classic', 99)).toBe(G.translate('o', 'classic', 5));
        expect(G.translate('o', 'classic', 0)).toBe(G.translate('o', 'classic', 1));
      });
      it('every dialect returns a string for mixed input', () => G.list().forEach(d => expect(typeof G.translate('Bună, ghost! 42', d, 3)).toBe('string')));
    });

    describe('classic dialect', () => {
      it('stretches each vowel to level + 1 and signs with 〰', () => expect(G.translate('boo', 'classic', 2)).toBe('b' + 'o'.repeat(6) + S + S));
      it('leaves consonants alone', () => expect(G.translate('xyz', 'classic', 1)).toBe('xyz' + S));
      it('keeps letter case', () => expect(G.translate('Ok', 'classic', 1)).toBe('OOk' + S));
      it('stretches Romanian vowels ă, â, î', () => expect(G.translate('ăî', 'classic', 1)).toBe('ăăîî' + S));
      it('refuses input that already contains the 〰 sigil', () => expect(() => G.translate('hi' + S, 'classic', 1)).toThrow('SIGIL'));
    });

    describe('reversible dialects — exact round trips', () => {
      it('classic, mirror, secret and poltergeist round-trip 300 random phrases (any case, emoji)', () => {
        const list = randomPhrases(1031, 'abcdeioumnrstxyzăâîșțABOEU !?,.👻', 300);
        list.forEach((s, n) => {
          ['classic', 'mirror', 'secret'].forEach(d => expect(G.decode(G.translate(s, d, 1 + (n % 5)))).toBe(s));
          expect(G.dialects.poltergeist.decode(G.translate(s, 'poltergeist', 1 + (n % 5)))).toBe(s);
        });
        expect(list.length).toBeGreaterThan(250);
      });
      it('runic and emoji round-trip 300 lowercase phrases with diacritics', () => {
        randomPhrases(77, 'abcdefghijklmnopqrstuvwxyzăâîșț ,.!?0123', 300).forEach(s => {
          expect(G.decode(G.translate(s, 'runic'))).toBe(s);
          expect(G.decode(G.translate(s, 'emoji'))).toBe(s);
        });
      });
      it('morse round-trips single-spaced lowercase phrases at every level', () => {
        randomPhrases(5, 'abcdefghijklmnopqrstuvwxyz0123456789ăș.,?!', 200, 8).forEach((w, n) => {
          const s = w + ' ' + w.slice(0, 3);
          expect(G.decode(G.translate(s, 'morse', 1 + (n % 5)))).toBe(s);
        });
      });
      it('morse spells SOS as the spirit box would', () => expect(G.translate('sos', 'morse', 1)).toBe(G.RADIO + 'bu-bu-bu buuu-buuu-buuu bu-bu-bu'));
      it('mirror reverses the text behind ⟲', () => expect(G.translate('abc', 'mirror')).toBe(G.MIRROR + 'cba'));
      it('secret encodes dashed hex behind 🔐', () => expect(G.translate('boo', 'secret')).toBe(G.LOCK + '62-6f-6f'));
      it('secret still decodes legacy codes without 🔐', () => expect(G.decode('62-6f-6f')).toBe('boo'));
      it('runic turns spaces into ᛫', () => expect(G.translate('a b', 'runic')).toBe(G.RUNE + 'ᚨ᛫ᛒ'));
      it('emoji turns "boo" into bones and pumpkins', () => expect(G.translate('boo', 'emoji')).toBe(G.MASK + '🦴🎃🎃'));
      it('runic and emoji refuse input that already uses their symbols', () => {
        expect(() => G.translate('ᚨ', 'runic')).toThrow('SIGIL');
        expect(() => G.translate('👻', 'emoji')).toThrow('SIGIL');
      });
    });

    describe('decoder errors', () => {
      it('throws NOSIG when the text has no ghost signature', () => expect(() => G.decode('just a human')).toThrow('NOSIG'));
      it('throws BROKEN on a vowel run that does not fit the level', () => expect(() => G.decode('bo' + S)).toThrow('BROKEN'));
      it('throws BROKEN on an invalid secret code', () => expect(() => G.decode(G.LOCK + 'zz-qq')).toThrow('BROKEN'));
      it('throws BROKEN on a code point out of range', () => expect(() => G.decode(G.LOCK + '110000')).toThrow('BROKEN'));
      it('throws BROKEN on an unknown morse letter', () => expect(() => G.decode(G.RADIO + 'bu-bu-bu-bu-bu-bu-bu')).toThrow('BROKEN'));
      it('ignores trailing whitespace after the sigil', () => expect(G.decode('boo' + S + '  ')).toBe('bo'));
    });

    describe('identify() and approximate decoding', () => {
      it('recognises every dialect from its own output', () => {
        G.list().forEach(d => expect(G.identify(G.translate('Bună seara, muritorule! What are you doing', d, 3))).toBe(d));
      });
      it('returns null for ordinary text', () => expect(G.identify('just a human sentence')).toBe(null));
      it('approximates one-way dialects back to readable words', () => {
        ['whisper', 'banshee', 'strigoi', 'sleepy'].forEach(d => {
          const r = G.decodeAny(G.translate('noapte bună, ghost', d, 3));
          expect([r.dialect, r.exact, G.fold(r.text)]).toEqual([d, false, G.fold('noapte bună, ghost')]);
        });
      });
      it('victorian reverses its dictionary', () => expect(G.decodeAny(G.translate('Are you my friend?', 'victorian', 4)).text).toBe('Are you my friend?'));
      it('echo drops its echoes', () => expect(G.decodeAny(G.translate('noapte rece', 'echo', 3)).text).toBe('noapte rece'));
      it('vampire strips its bat and laugh', () => expect(G.decodeAny(G.translate('hello', 'vampire', 2)).text).toBe('hello'));
      it('marks exact decodes as exact', () => expect(G.decodeAny(G.translate('hey', 'mirror')).exact).toBe(true));
    });

    describe('one-way dialects', () => {
      it('whisper lowercases, hushes s → sh and fades out', () => expect(G.translate('Sus', 'whisper', 1)).toBe('pst… shuush…'));
      it('whisper grows its "psst" with the EMF level', () => expect(G.translate('a', 'whisper', 4)).toBe('psssst… aa…'));
      it('banshee shouts in capitals and ends with ! per level', () => expect(G.translate('boo', 'banshee', 1)).toBe('BOOOoOOOo!'));
      it('strigoi rolls its r and wobbles the case', () => expect(G.translate('rar', 'strigoi', 1)).toBe('rrArr …brr'));
      it('sleepy yawns its vowels and snores', () => expect(G.translate('Hai', 'sleepy', 1)).toBe('haaii… zzz'));
      it('vampire swaps w → v and th → z', () => expect(G.translate('with them', 'vampire', 1)).toBe(G.BAT + 'viz zem …mwahaha!'));
      it('victorian keeps capitals when it swaps words', () => expect(G.translate('Hello friend', 'victorian', 1)).toBe(G.SCROLL + 'Hark companion'));
      it('victorian speaks Romanian too', () => expect(G.translate('Salut prietene', 'victorian', 1)).toBe(G.SCROLL + 'Închinăciune amice'));
      it('echo repeats the last syllable per level', () => expect(G.translate('noapte', 'echo', 2)).toBe('noapte-te-te'));
      it('poltergeist is deterministic and grows with the level', () => {
        expect(G.translate('boo', 'poltergeist', 5)).toBe(G.translate('boo', 'poltergeist', 5));
        expect(G.translate('haunted house party', 'poltergeist', 5).length).toBeGreaterThan(G.translate('haunted house party', 'poltergeist', 1).length);
      });
    });

    describe('chain()', () => {
      it('applies dialects in order', () => expect(G.chain('abc', ['mirror', 'emoji'])).toBe(G.MASK + G.translate('⟲ cba', 'emoji').slice(G.MASK.length)));
      it('an empty chain returns the text unchanged', () => expect(G.chain('boo', [])).toBe('boo'));
      it('classic twice fails on its own sigil', () => expect(() => G.chain('boo', ['classic', 'classic'])).toThrow('SIGIL'));
      it('a reversible chain decodes link by link', () => expect(G.decode(G.decode(G.chain('Bună', ['secret', 'mirror'])))).toBe('Bună'));
    });

    describe('games — rules and simulated rounds', () => {
      it('BooScary follows the counting rule', () => expect([1, 3, 5, 9, 10, 15, 30, 7].map(G.booscary)).toEqual(['1', 'Boo', 'Scary', 'Boo', 'Scary', 'BooScary', 'BooScary', '7']));
      it('answers ignore case, spaces and diacritics', () => expect(G.sameAnswer('  FANTOMA ', 'fantomă')).toBe(true));
      it('accepts ş (cedilla) and ș (comma) as the same letter', () => expect(G.sameAnswer('bufniţă', 'bufniță')).toBe(true));
      it('an empty answer never counts as correct', () => expect(G.sameAnswer('', '')).toBe(false));
      it('RO and EN word lists line up for the vocabulary game', () => expect(G.WORDS.ro.length).toBe(G.WORDS.en.length));
      it('every difficulty has words in both languages', () => Object.keys(G.DIFFICULTY).forEach(d => ['ro', 'en'].forEach(l => expect(G.WORDS[l].filter(G.DIFFICULTY[d].fits).length).toBeGreaterThan(4))));
      it('plays 200 rounds of every game and accepts the expected answer', () => {
        const R = seeded(2026);
        ['guess', 'typing', 'memory', 'letters', 'secret', 'choir', 'boo', 'vocab', 'arcade'].forEach(game => ['easy', 'medium', 'nightmare'].forEach(difficulty => {
          for (let i = 0; i < 25; i++) {
            const r = G.makeRound(game, { lang: i % 2 ? 'en' : 'ro', difficulty, dialect: G.list()[i % G.list().length], rand: R });
            expect(G.checkAnswer(r, r.expected)).toBe(true);
            expect(G.checkAnswer(r, r.digits ? r.expected + ' 1' : r.expected + 'x')).toBe(false);
          }
        }));
      });
      it('memory accepts digits typed with or without spaces', () => {
        const r = G.makeRound('memory', { rand: seeded(1), difficulty: 'nightmare' });
        expect(r.expected.split(' ').length).toBe(6);
        expect(G.checkAnswer(r, r.expected.replace(/ /g, ''))).toBe(true);
      });
      it('easy rounds use short words and EMF 1', () => {
        const r = G.makeRound('guess', { rand: seeded(3), difficulty: 'easy', dialect: 'classic' });
        expect(G.fold(r.expected).length <= 5).toBe(true);
        expect(r.prompt.endsWith(S) && !r.prompt.endsWith(S + S)).toBe(true);
      });
      it('typing expects the ghost spelling without 〰', () => expect(G.makeRound('typing', { rand: () => 0, lang: 'ro' }).expected).toBe('luunăă'));
      it('unknown games throw GAME', () => expect(() => G.makeRound('chess')).toThrow('GAME'));
    });

    describe('hangman', () => {
      it('reveals every accented form of a guessed letter', () => {
        let h = G.hangmanNew('mătură', 6);
        h = G.hangmanGuess(h, 'a');
        expect(G.hangmanView(h)).toBe('_ ă _ _ _ ă');
      });
      it('counts wrong guesses once and ignores repeats', () => {
        let h = G.hangmanNew('lup', 2);
        h = G.hangmanGuess(G.hangmanGuess(h, 'z'), 'z');
        expect(h.wrong).toBe(1);
      });
      it('is won when every letter is found', () => {
        let h = G.hangmanNew('lup', 6);
        ['l', 'u', 'p'].forEach(c => { h = G.hangmanGuess(h, c); });
        expect(G.hangmanStatus(h)).toBe('won');
      });
      it('is lost when lives run out, and ignores guesses after that', () => {
        let h = G.hangmanNew('lup', 2);
        ['x', 'y', 'l'].forEach(c => { h = G.hangmanGuess(h, c); });
        expect([G.hangmanStatus(h), h.guessed.includes('l')]).toEqual(['lost', false]);
      });
    });

    describe('daily puzzle', () => {
      it('scores hits, near misses and misses like Wordle', () => expect(G.wordleScore('pulo', 'lupo')).toEqual(['near', 'hit', 'near', 'hit']));
      it('counts repeated letters only as often as they appear', () => expect(G.wordleScore('ooo', 'oak')).toEqual(['hit', 'miss', 'miss']));
      it('ignores diacritics when scoring', () => expect(G.wordleScore('luna', 'lună')).toEqual(['hit', 'hit', 'hit', 'hit']));
      it('refuses guesses of the wrong length', () => expect(() => G.wordleScore('lun', 'lună')).toThrow('LENGTH'));
      it('the daily word is the same all day', () => expect(G.dailyWord('ro', Date.UTC(2026, 9, 31, 1))).toBe(G.dailyWord('ro', Date.UTC(2026, 9, 31, 23))));
      it('builds a shareable square grid', () => expect(G.shareText('2026-10-31', [['miss', 'near'], ['hit', 'hit']], true)).toBe('Ghost Talk 2026-10-31 · 2/6 👻\n⬛🟨\n🟩🟩'));
    });

    describe('story', () => {
      it('every node has RO and EN text and valid exits', () => G.STORY.forEach(n => {
        expect(typeof n.ro + typeof n.en).toBe('stringstring');
        (n.next || []).forEach(([to]) => expect(to < G.STORY.length).toBe(true));
        if (n.puzzle) expect(n.puzzle.success < G.STORY.length).toBe(true);
      }));
      it('has five endings, all reachable from the start', () => {
        const seen = new Set([0]), queue = [0];
        while (queue.length) { const n = G.STORY[queue.shift()]; [...(n.next || []).map(x => x[0]), ...(n.puzzle ? [n.puzzle.success] : [])].forEach(t => { if (!seen.has(t)) { seen.add(t); queue.push(t); } }); }
        expect(G.ENDINGS.length).toBe(5);
        expect(G.ENDINGS.every(e => seen.has(e))).toBe(true);
      });
      it('the garden password is "friend" in Classic EMF 1', () => expect(G.storyAnswer(2, 'en')).toBe('friieend'));
      it('the rival’s riddle is BooScary', () => expect(G.storyAnswer(6, 'ro')).toBe('BooScary'));
      it('the crypt shows the code for its answer', () => expect(G.storyText(7, 'en', 'Boo')).toMatch(/68-6f-6d-65/));
      it('fills in the ghost’s and the rival’s names', () => expect(G.storyText(3, 'ro', 'Pufi')).toMatch(/Zăbrel/));
    });

    describe('companion, achievements and sharing', () => {
      it('levels up every 100 XP', () => expect(G.levelOf(245)).toEqual({ level: 3, into: 45 }));
      it('awards badges by XP', () => expect([0, 40, 80, 200, 999].map(G.badgeOf)).toEqual(['new', 'echo', 'master', 'banshee', 'legend']));
      it('moods follow streaks, the clock and idleness', () => expect([
        G.moodOf({ streak: 3 }), G.moodOf({ hour: 2 }), G.moodOf({ idleMs: 90000 }), G.moodOf({ hour: 15 })
      ]).toEqual(['excited', 'sleepy', 'bored', 'happy']));
      it('unlocks achievements once', () => {
        const s = G.normalizeState({ stats: { translations: 1 } });
        expect(G.newAchievements(s)).toEqual(['first-words']);
        s.achievements.push('first-words');
        expect(G.newAchievements(s)).toEqual([]);
      });
      it('share links round-trip text, dialect and level', () => expect(G.decodeShare(G.encodeShare({ t: 'Bună, 👻', d: 'runic', l: 4 }))).toEqual({ t: 'Bună, 👻', d: 'runic', l: 4 }));
      it('share links use only URL-safe characters', () => expect(G.encodeShare({ t: '???>>>ăăă', d: 'classic', l: 1 })).toMatch(/^[A-Za-z0-9_-]+$/));
      it('rejects broken share links', () => expect([G.decodeShare('!!'), G.decodeShare('e30'), G.decodeShare(null)]).toEqual([null, null, null]));
    });

    describe('utilities', () => {
      it('clamp() keeps levels between 1 and 5', () => expect([G.clamp(-3), G.clamp('4'), G.clamp(2.6), G.clamp(NaN)]).toEqual([1, 4, 3, 1]));
      it('hash() is stable and spreads nearby inputs', () => { expect(G.hash('boo')).toBe(G.hash('boo')); expect(G.hash('boo') === G.hash('bop')).toBe(false); });
      it('stripMarks() removes only combining marks', () => expect(G.stripMarks('b́òă')).toBe('boă'));
      it('detect() names only reversible dialects', () => expect([G.detect(G.translate('hey', 'runic')), G.detect(G.translate('hey', 'banshee'))]).toEqual(['runic', null]));
      it('dayKey() and dailyIndex() agree on the same UTC day', () => {
        const a = Date.UTC(2026, 9, 31, 0, 5), b = Date.UTC(2026, 9, 31, 23, 55);
        expect([G.dayKey(a), G.dailyIndex(a, 30) === G.dailyIndex(b, 30)]).toEqual(['2026-10-31', true]);
      });
      it('dailyNew() shows the first letter and hides the rest', () => expect(G.dailyNew('en', Date.UTC(2026, 9, 31)).prompt).toMatch(/^\p{L}( _)+$/u));
      it('pickWord() respects the difficulty', () => expect(G.fold(G.pickWord('ro', 'nightmare', () => .5)).length >= 7).toBe(true));
    });

    describe('saved data', () => {
      it('rejects garbage backups', () => {
        const s = G.normalizeState({ favorites: null, xp: -4, stats: 'x', daily: { date: 'nope' } });
        expect([s.favorites.length, s.xp, s.stats.translations, s.daily.date]).toEqual([0, 0, 0, '']);
        expect(G.normalizeState([1, 2])).toEqual(G.defaults());
      });
      it('migrates Haunted Language Lab saves (emoji hats, decor, light theme)', () => {
        const s = G.normalizeState({ hat: '\u{1F451}', decor: '\u{1F383}', light: true, favorites: ['Boo~ aaa'], xp: 50 });
        expect([s.hat, s.decor, s.theme, s.favorites[0].g, s.xp]).toEqual(['crown', 'pumpkins', 'dawn', 'Boo~ aaa', 50]);
      });
      it('migrates v2 story endings to the new story map', () => expect(G.normalizeState({ endings: [3, 4], story: 3 }).endings).toEqual([8, 9]));
      it('ignores prototype keys such as hat: "toString"', () => expect([G.normalizeState({ hat: 'toString' }).hat, G.normalizeState({ dialect: '__proto__' }).dialect]).toEqual(['none', 'codepen']));
      it('caps favorites at 30, names at 30 chars, XP at 100000, text size at 150%', () => {
        const s = G.normalizeState({ favorites: Array(50).fill('x'), name: 'B'.repeat(80), xp: 1e9, scale: 9 });
        expect([s.favorites.length, s.name.length, s.xp, s.scale]).toEqual([30, 30, 100000, 1.5]);
      });
      it('keeps a valid daily puzzle and drops a tampered one', () => {
        const ok = { date: '2026-10-12', lang: 'en', rows: [['hit']], guesses: ['a'], done: true, won: true };
        expect(G.normalizeState({ v: 3, daily: ok }).daily).toEqual(ok);
        expect(G.normalizeState({ v: 3, daily: { ...ok, rows: [['boom']] } }).daily.date).toBe('');
      });
    });
  }

  /* ---------- Browser runner: tiny Jest-compatible API + API coverage ---------- */
  function GhostSuite(G, extras = {}) {
    const suites = []; let cur = null;
    const fmt = v => JSON.stringify(v);
    const describe = (name, fn) => { cur = { name, tests: [] }; suites.push(cur); fn(); cur = null; };
    const it = (name, fn) => cur.tests.push({ name, fn });
    const expect = a => {
      const fail = m => { throw new Error(m); };
      return {
        toBe: e => { if (!Object.is(a, e)) fail(`expect(received).toBe(expected)\n  Expected: ${fmt(e)}\n  Received: ${fmt(a)}`); },
        toEqual: e => { if (fmt(a) !== fmt(e)) fail(`expect(received).toEqual(expected)\n  Expected: ${fmt(e)}\n  Received: ${fmt(a)}`); },
        toMatch: r => { if (!r.test(a)) fail(`expect(received).toMatch(${r})\n  Received: ${fmt(a)}`); },
        toBeGreaterThan: e => { if (!(a > e)) fail(`expect(${a}).toBeGreaterThan(${e})`); },
        toThrow: code => {
          let err = null; try { a(); } catch (x) { err = x; }
          if (!err) fail('expect(fn).toThrow()\n  Received function did not throw');
          if (code && !String(err.message).includes(code)) fail(`expect(fn).toThrow(${fmt(code)})\n  Received message: ${fmt(err.message)}`);
        }
      };
    };
    // Coverage: count calls to every exported function while the specs run.
    const calls = {}, wrapped = {};
    Object.keys(G).forEach(k => {
      if (typeof G[k] !== 'function' || /^[A-Z]/.test(k)) return;
      calls[k] = 0; const fn = G[k];
      wrapped[k] = fn;
      G[k] = function () { calls[k]++; return fn.apply(this, arguments); };
    });
    GhostSpecs({ describe, it, expect, test: it }, G, extras);
    const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const t0 = now();
    let out;
    try {
      out = suites.map(s => ({ name: s.name, tests: s.tests.map(t => {
        const a = now(); let error = null;
        try { t.fn(); } catch (e) { error = e.message; }
        return { name: t.name, ok: !error, error, ms: Math.max(0, Math.round(now() - a)) };
      }) }));
    } finally { Object.keys(wrapped).forEach(k => { G[k] = wrapped[k]; }); }
    const all = out.flatMap(s => s.tests);
    const fns = Object.keys(calls).sort();
    return { suites: out, passed: all.filter(t => t.ok).length, failed: all.filter(t => !t.ok).length, total: all.length, ms: Math.round(now() - t0),
      coverage: { functions: fns.map(name => ({ name, calls: calls[name] })), covered: fns.filter(k => calls[k] > 0).length, total: fns.length } };
  }

  return { GhostSpecs, GhostSuite };
});
