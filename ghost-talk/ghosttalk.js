// ghosttalk.js — CodePen Challenge, October 2026: Ghost Talk
//
// The rule
//   1. A word that starts with a vowel gets "-boo" at the end.        owl   → owl-boo
//   2. A word that starts with a consonant moves its first letter
//      to the end and adds "oo".                                      candy → andy-coo
//
// Extras from the challenge's list of ideas: capital letters and punctuation are kept
// ("Candy!" → "Andy-coo!"), and ghostTalkText() translates a whole sentence.

const VOWELS = "aeiou";

// Step 1: separate the word from the punctuation around it.
//   "Candy!" → { before: "", letters: "Candy", after: "!" }
export function splitWord(word) {
  const [, before, letters, after] = word.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/su);
  return { before, letters, after };
}

// Step 2: decide which rule applies. "y" is a consonant, as in the challenge.
//   Accented vowels count too: "ă", "î", "é" are compared without their accent.
export function startsWithVowel(letters) {
  const first = letters.normalize("NFD")[0].toLowerCase();
  return VOWELS.includes(first);
}

// Step 3: apply the rule to one word.
export function ghostTalk(word) {
  if (typeof word !== "string") return "";
  const { before, letters, after } = splitWord(word);

  // Nothing to translate: "", "42", "👻"
  if (!/^\p{L}/u.test(letters)) return word;

  // A shouted word stays shouted: "BOO" → "OO-BOO"
  const shout = letters.length > 1 && letters === letters.toUpperCase() && letters !== letters.toLowerCase();
  const boo = shout ? "BOO" : "boo";
  const oo = shout ? "OO" : "oo";

  // Rule 1 — vowel first: add "-boo"
  if (startsWithVowel(letters)) {
    return before + letters + "-" + boo + after;
  }

  // Rule 2 — consonant first: move that letter to the end and add "oo"
  const [first, ...others] = letters;
  let rest = others.join("");
  let moved = first;

  if (rest === "") return before + first + oo + after;     // a lone consonant: "b" → "boo"

  // "Candy" → "Andy-coo": the capital stays at the front of the new word
  if (!shout && first !== first.toLowerCase()) {
    rest = rest[0].toUpperCase() + rest.slice(1);
    moved = first.toLowerCase();
  }

  return before + rest + "-" + moved + oo + after;
}

// Translates a sentence word by word and keeps the spaces as they were.
export function ghostTalkText(text) {
  if (typeof text !== "string") return "";
  return text
    .split(/(\s+)/)
    .map((piece, i) => (i % 2 === 0 ? ghostTalk(piece) : piece))
    .join("");
}
