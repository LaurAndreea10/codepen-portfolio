// ghosttalk.js — the CodePen Challenge rule (October 2026, “Ghost Talk”).
//   • a word that starts with a vowel gets "-boo" at the end:            owl   → owl-boo
//   • a word that starts with a consonant moves that letter to the end
//     and adds "oo":                                                     candy → andy-coo
// Extras from the challenge’s ideas list: capital letters and punctuation are kept,
// and ghostTalkText() translates whole sentences word by word.

const VOWELS = 'aeiou';

// "ă", "â", "î", "é"… count as vowels too: compare the base letter without its accent.
function startsWithVowel(word) {
  const base = word.normalize('NFD')[0].toLowerCase();
  return VOWELS.includes(base);
}

function isShouted(word) {
  return word.length > 1 && word === word.toUpperCase() && word !== word.toLowerCase();
}

function isCapitalised(letter) {
  return letter !== letter.toLowerCase();
}

// Translates the letters of one word (no spaces, no surrounding punctuation).
function translateCore(word) {
  const letters = Array.from(word);
  const first = letters[0];
  if (!/\p{L}/u.test(first)) return word;            // "42" stays "42"

  const shout = isShouted(word);
  if (startsWithVowel(word)) return word + (shout ? '-BOO' : '-boo');

  const rest = letters.slice(1).join('');
  if (!rest) return word + (shout ? 'OO' : 'oo');   // "b" → "boo"

  if (!shout && isCapitalised(first)) {             // "Candy" → "Andy-coo"
    return rest[0].toUpperCase() + rest.slice(1) + '-' + first.toLowerCase() + 'oo';
  }
  return rest + '-' + first + (shout ? 'OO' : 'oo'); // "candy" → "andy-coo", "BOO" → "OO-BOO"
}

export function ghostTalk(word) {
  if (typeof word !== 'string') return '';
  // before = leading punctuation, core = the word, after = trailing punctuation
  const parts = word.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}](?:[\p{L}\p{N}'’-]*[\p{L}\p{N}])?)([^\p{L}\p{N}]*)$/u);
  if (!parts) return word;                           // empty, only symbols, or several words
  const [, before, core, after] = parts;
  return before + translateCore(core) + after;
}

export function ghostTalkText(text) {
  if (typeof text !== 'string') return '';
  return text.split(/(\s+)/).map((piece, i) => (i % 2 ? piece : ghostTalk(piece))).join('');
}
