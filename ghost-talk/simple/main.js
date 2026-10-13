// main.js — connects the page to ghosttalk.js. The rule itself lives only in ghosttalk.js.
import { ghostTalkText, describeWord } from "../ghosttalk.js";

const human = document.getElementById("human");
const ghost = document.getElementById("ghost");
const steps = document.getElementById("steps");

// One line per word, built from describeWord() in ghosttalk.js.
function explain(word) {
  const d = describeWord(word);
  if (d.rule === "none") return "no letters to translate, so it stays the same";
  let why = d.rule === "vowel"
    ? `starts with the vowel “${d.first}”, so it gets “-boo”`
    : `starts with the consonant “${d.first}”, so “${d.moved}” moves to the end and gets “oo”`;
  if (d.capital) why += "; the capital stays at the front";
  if (d.before || d.after) why += `; “${d.before}${d.after}” stays in place`;
  return why;
}

function render() {
  const text = human.value;
  ghost.textContent = ghostTalkText(text).trim() || "…";

  const words = text.split(/\s+/).filter(Boolean).slice(0, 12);
  steps.replaceChildren(...words.map((word) => {
    const li = document.createElement("li");
    const from = document.createElement("code");
    const to = document.createElement("code");
    from.textContent = word;
    to.textContent = describeWord(word).result;
    li.append(from, ` ${explain(word)} → `, to);
    return li;
  }));
}

human.addEventListener("input", render);

document.querySelector(".examples").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  human.value = button.textContent;
  render();
});

document.getElementById("copy").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(ghost.textContent);
    button.textContent = "Copied";
  } catch {
    getSelection().selectAllChildren(ghost);   // fallback: select it so Ctrl+C works
    button.textContent = "Selected — press Ctrl+C";
  }
  setTimeout(() => { button.textContent = "Copy"; }, 1800);
});

render();
