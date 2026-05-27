import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";

// ============================================================
// CV SCOUT — AI CV Evaluator + Interview Simulator
// Single-file React · bilingual RO/EN · dark editorial
//
// COST-SAFE BY DESIGN:
//   - In Claude.ai artifacts -> uses the real Anthropic API
//     (no key needed, billed to the user's Claude usage, no
//      separate API invoice).
//   - Anywhere else (e.g. GitHub Pages) -> auto-detects the
//     absence of an API and falls back to a LOCAL engine.
//     No key is ever embedded, so it can never leak or bill.
// ============================================================

// Detect whether the live Anthropic API is reachable.
// On GitHub Pages this stays false -> local engine, zero cost.
const API_HOST = "https://api.anthropic.com/v1/messages";
const inClaudeAI =
  typeof window !== "undefined" &&
  /claude\.ai|anthropic/.test(window.location?.hostname || "");

const T = {
  ro: {
    brand: "CV SCOUT",
    tagline: "Evaluator de CV + simulator de interviu cu AI",
    intro:
      "Încarcă-ți CV-ul și primește o analiză onestă: scoruri pe categorii, feedback secțiune-cu-secțiune și rescrieri concrete. Apoi exersează la un interviu adaptat după CV-ul tău.",
    fileTab: "Fișier",
    pasteTab: "Lipește text",
    dropHint: "Trage fișierul aici sau apasă pentru a selecta",
    fileTypes: "PDF · imagine (JPG/PNG) · sau lipește text",
    pastePlaceholder: "Lipește aici conținutul CV-ului tău…",
    jdToggle: "Compară cu un anunț de job",
    jdPlaceholder: "Lipește descrierea jobului pentru o comparație CV ↔ cerințe…",
    evaluate: "Evaluează CV-ul",
    reset: "Începe din nou",
    loadingSteps: [
      "Se citește documentul…",
      "Se analizează structura…",
      "Se evaluează impactul…",
      "Se verifică compatibilitatea ATS…",
      "Se pregătesc sugestiile…",
    ],
    overall: "Scor general",
    categories: "Categorii",
    sections: "Feedback pe secțiuni",
    rewrites: "Rescrieri sugerate",
    jdMatch: "Potrivire cu jobul",
    before: "Înainte",
    after: "După",
    noFile: "Adaugă un fișier sau lipește text mai întâi.",
    errorTitle: "Ceva n-a mers",
    errorBody: "Nu am putut analiza CV-ul. Încearcă din nou sau verifică fișierul.",
    cat: {
      impact: "Impact & rezultate",
      clarity: "Claritate & concizie",
      ats: "Compatibilitate ATS",
      structure: "Structură & format",
      relevance: "Relevanță",
    },
    matchedKw: "Cuvinte-cheie găsite",
    missingKw: "Cuvinte-cheie lipsă",
    poweredLive: "Analiză live prin Claude",
    poweredLocal: "Motor local · fără cost, fără cheie API",
    selectFile: "Selectează fișier",
    remove: "Elimină",
    // interview
    startInterview: "🎤 Simulează un interviu",
    interviewTitle: "Simulare de interviu",
    interviewIntro:
      "Întrebări generate din CV-ul tău. Răspunde, iar următoarea întrebare se adaptează după ce spui.",
    question: "Întrebarea",
    of: "din",
    yourAnswer: "Răspunsul tău…",
    send: "Trimite răspuns",
    thinking: "Se pregătește următoarea întrebare…",
    finish: "Încheie și vezi feedback",
    interviewFeedback: "Feedback interviu",
    backToResults: "← Înapoi la rezultate",
    skip: "Sari peste",
    interviewScore: "Scor interviu",
    tips: "Recomandări",
    history: "Istoric",
    historyEmpty: "Niciun rezultat salvat încă.",
    clearAll: "Șterge tot",
    open: "Deschide",
    del: "Șterge",
    cvEval: "Evaluare CV",
    interviewLabel: "Interviu",
    savedNote: "Salvat automat pe acest dispozitiv",
    suggestedTitle: "💡 Răspuns sugerat",
    useSuggested: "Folosește ca punct de plecare",
    reviewTitle: "Recapitulare răspunsuri",
    modelAnswer: "Vezi un răspuns model",
    tryDemo: "Încearcă cu un CV demo",
    demoNote: "CV demo încărcat — apasă Evaluează",
  },
  en: {
    brand: "CV SCOUT",
    tagline: "AI CV evaluator + interview simulator",
    intro:
      "Upload your CV for an honest read: category scores, section-by-section feedback, and concrete rewrites. Then practice an interview adapted to your CV.",
    fileTab: "File",
    pasteTab: "Paste text",
    dropHint: "Drag a file here or click to select",
    fileTypes: "PDF · image (JPG/PNG) · or paste text",
    pastePlaceholder: "Paste your CV content here…",
    jdToggle: "Compare against a job post",
    jdPlaceholder: "Paste a job description for a CV ↔ requirements comparison…",
    evaluate: "Evaluate CV",
    reset: "Start over",
    loadingSteps: [
      "Reading the document…",
      "Analyzing structure…",
      "Scoring impact…",
      "Checking ATS compatibility…",
      "Preparing suggestions…",
    ],
    overall: "Overall score",
    categories: "Categories",
    sections: "Section feedback",
    rewrites: "Suggested rewrites",
    jdMatch: "Job match",
    before: "Before",
    after: "After",
    noFile: "Add a file or paste some text first.",
    errorTitle: "Something went wrong",
    errorBody: "Couldn't analyze the CV. Try again or check the file.",
    cat: {
      impact: "Impact & results",
      clarity: "Clarity & concision",
      ats: "ATS compatibility",
      structure: "Structure & format",
      relevance: "Relevance",
    },
    matchedKw: "Matched keywords",
    missingKw: "Missing keywords",
    poweredLive: "Live analysis via Claude",
    poweredLocal: "Local engine · no cost, no API key",
    selectFile: "Select file",
    remove: "Remove",
    startInterview: "🎤 Simulate an interview",
    interviewTitle: "Interview simulation",
    interviewIntro:
      "Questions generated from your CV. Answer, and the next question adapts to what you say.",
    question: "Question",
    of: "of",
    yourAnswer: "Your answer…",
    send: "Send answer",
    thinking: "Preparing the next question…",
    finish: "Finish & see feedback",
    interviewFeedback: "Interview feedback",
    backToResults: "← Back to results",
    skip: "Skip",
    interviewScore: "Interview score",
    tips: "Recommendations",
    history: "History",
    historyEmpty: "No saved results yet.",
    clearAll: "Clear all",
    open: "Open",
    del: "Delete",
    cvEval: "CV evaluation",
    interviewLabel: "Interview",
    savedNote: "Auto-saved on this device",
    suggestedTitle: "💡 Suggested answer",
    useSuggested: "Use as a starting point",
    reviewTitle: "Answer review",
    modelAnswer: "See a model answer",
    tryDemo: "Try with a demo CV",
    demoNote: "Demo CV loaded — press Evaluate",
  },
};

const CAT_KEYS = ["impact", "clarity", "ats", "structure", "relevance"];

// A realistic sample CV — built from the portfolio owner's real profile
// (self-taught front-end with a CRM/marketing background). Email is a
// placeholder to fill in; everything else reflects actual work.
const DEMO_CV = `Laura Andreea
Front-End Developer · Romania
your.email@example.com · github.com/LaurAndreea10 · laurandreea10.github.io

SUMMARY
Self-taught front-end developer with a background in CRM and digital marketing.
I build production-grade, bilingual (RO/EN) web apps with a dark, editorial
aesthetic — shipping 60+ projects to a live portfolio on GitHub Pages.

EXPERIENCE
Front-End Developer — Independent / Portfolio (2023–present)
- Built ARCADE-OPS: EXCEL QUEST, a gamified single-file HTML/CSS/JS learning app
  (8,800+ lines) with Web Audio, 33 achievements, daily challenges and a RO/EN toggle
- Shipped ClientOps Suite, a React + Vite + Tailwind SaaS dashboard with a
  drag-and-drop pipeline, command palette, and Recharts analytics
- Developed Alpis Fusion CRM (React 18 + Vite) with health scoring, lead-source
  tracking, segment builder, CSV import and executive KPIs; deployed via GitHub Actions
- Maintained a 64+ project portfolio, refactoring a monolithic build into modular
  files with externalized JSON data and full SEO infrastructure

Digital Marketing & CRM (prior)
- Managed CRM workflows and customer segmentation for marketing campaigns
- Translated business requirements into structured, data-driven processes

SKILLS
JavaScript, React, Vite, HTML5, CSS3, Tailwind, Recharts, Git, GitHub Pages,
GitHub Actions, REST APIs, JSON, SEO, CRM, bilingual RO/EN delivery

CERTIFICATIONS
Google · freeCodeCamp · Anthropic · LinkedIn Learning

EDUCATION
Self-directed learning — front-end development & web engineering

LANGUAGES
Romanian (native), English (fluent)`;

// ---- helpers ------------------------------------------------

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1]);
    r.onerror = () => rej(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

// --- PDF.js: loaded on demand from CDN, runs entirely in-browser.
// No server, no API, no cost. Used to extract real text from PDFs
// so the local engine (and the GitHub Pages demo) works on real CVs.
const PDFJS_VER = "3.11.174";
let _pdfjsPromise = null;
function loadPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (_pdfjsPromise) return _pdfjsPromise;
  _pdfjsPromise = new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VER}/pdf.min.js`;
    s.onload = () => {
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VER}/pdf.worker.min.js`;
        res(window.pdfjsLib);
      } catch (e) {
        rej(e);
      }
    };
    s.onerror = () => rej(new Error("pdf.js failed to load"));
    document.head.appendChild(s);
  });
  return _pdfjsPromise;
}

async function extractPdfText(file) {
  const pdfjsLib = await loadPdfJs();
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let out = "";
  const max = Math.min(pdf.numPages, 6); // CVs are short; cap for speed
  for (let p = 1; p <= max; p++) {
    const page = await pdf.getPage(p);
    const tc = await page.getTextContent();
    out += tc.items.map((it) => it.str).join(" ") + "\n";
  }
  return out.trim();
}

// --- Persistent history storage, cross-environment.
// Claude.ai -> window.storage (persists across sessions).
// GitHub Pages -> localStorage. Neither -> in-memory (session only).
// No server, no cost in any case.
const HKEY = "cvscout:history";
let _memStore = [];

const store = {
  async load() {
    try {
      if (typeof window !== "undefined" && window.storage?.get) {
        const r = await window.storage.get(HKEY);
        return r?.value ? JSON.parse(r.value) : [];
      }
    } catch (e) {
      /* key missing or storage unavailable */
    }
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(HKEY);
        return raw ? JSON.parse(raw) : [];
      }
    } catch (e) {
      /* localStorage blocked (e.g. inside an artifact) */
    }
    return [..._memStore];
  },
  async save(list) {
    const json = JSON.stringify(list);
    _memStore = list;
    try {
      if (typeof window !== "undefined" && window.storage?.set) {
        await window.storage.set(HKEY, json);
        return;
      }
    } catch (e) {
      /* fall through */
    }
    try {
      if (typeof localStorage !== "undefined") localStorage.setItem(HKEY, json);
    } catch (e) {
      /* in-memory only */
    }
  },
};

function scoreColor(n) {
  if (n >= 80) return "#36f1cd";
  if (n >= 60) return "#7af0ff";
  if (n >= 40) return "#ffd166";
  return "#ff6b9d";
}

function clamp(n) {
  const v = Math.round(Number(n) || 0);
  return Math.max(0, Math.min(100, v));
}

// Generic Anthropic call returning parsed JSON (used only in Claude.ai)
async function callClaude(content, maxTokens = 1000) {
  const resp = await fetch(API_HOST, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content }],
    }),
  });
  const data = await resp.json();
  const raw = data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .replace(/```json|```/g, "")
    .trim();
  return JSON.parse(raw);
}

// ---- LOCAL ENGINE (no API, no cost) -------------------------
// Heuristic CV analysis used when the live API is unavailable.

function localEvaluate(text, lang, jd) {
  const t = (text || "").toLowerCase();
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  const wc = words.length;

  // metric-ish signals
  const numbers = (text.match(/\b\d+([.,]\d+)?%?\b/g) || []).length;
  const actionVerbs = [
    "led","built","created","designed","launched","improved","increased",
    "reduced","managed","developed","implemented","optimized","delivered",
    "condus","construit","creat","proiectat","lansat","îmbunătățit","crescut",
    "redus","gestionat","dezvoltat","implementat","optimizat","livrat",
  ];
  const verbHits = actionVerbs.filter((v) => t.includes(v)).length;
  const hasEmail = /@/.test(text);
  const hasSections = ["experience","education","skills","experiență","educație","competențe"]
    .filter((s) => t.includes(s)).length;

  const impact = clamp(28 + numbers * 7 + verbHits * 4);
  const clarity = clamp(wc < 120 ? 45 : wc > 900 ? 55 : 82 - Math.abs(420 - wc) / 14);
  const ats = clamp(40 + hasSections * 12 + (hasEmail ? 10 : 0) + verbHits * 2);
  const structure = clamp(35 + hasSections * 15 + (hasEmail ? 8 : 0));
  const relevance = jd ? localJDScore(t, jd) : clamp(50 + verbHits * 4 + numbers * 3);
  const overall = clamp((impact + clarity + ats + structure + relevance) / 5);

  const L = lang === "ro";
  const verdict = L
    ? overall >= 75
      ? "CV solid — câteva ajustări îl duc la nivel premium."
      : overall >= 55
      ? "Bază bună, dar lipsesc rezultate cuantificate și verbe de acțiune."
      : "Are nevoie de muncă: adaugă cifre, structură clară și impact."
    : overall >= 75
    ? "Strong CV — a few tweaks push it to premium."
    : overall >= 55
    ? "Good base, but it lacks quantified results and action verbs."
    : "Needs work: add numbers, clear structure, and impact.";

  const note = (k) => {
    const m = {
      impact: L
        ? numbers < 3
          ? "Foarte puține rezultate cuantificate. Adaugă cifre (%, sume, timp economisit)."
          : "Bun — ai rezultate măsurabile. Mai adaugă context la impact."
        : numbers < 3
        ? "Very few quantified results. Add numbers (%, amounts, time saved)."
        : "Good — you have measurable results. Add a bit more context.",
      clarity: L
        ? wc > 900
          ? "CV-ul e prea lung. Taie la esențial, max 1-2 pagini."
          : "Lungime rezonabilă. Verifică frazele lungi."
        : wc > 900
        ? "The CV is too long. Trim to the essentials, 1-2 pages max."
        : "Reasonable length. Watch out for long sentences.",
      ats: L
        ? "Folosește titluri standard de secțiune și cuvinte-cheie din anunț."
        : "Use standard section titles and keywords from the job post.",
      structure: L
        ? hasSections < 3
          ? "Lipsesc secțiuni clare (Experiență, Educație, Competențe)."
          : "Structură clară. Asigură ordine cronologică inversă."
        : hasSections < 3
        ? "Missing clear sections (Experience, Education, Skills)."
        : "Clear structure. Ensure reverse-chronological order.",
      relevance: L
        ? "Aliniază experiența la rolul țintă; scoate ce nu e relevant."
        : "Align experience to the target role; cut what's irrelevant.",
    };
    return m[k];
  };

  const cats = {};
  const vals = { impact, clarity, ats, structure, relevance };
  CAT_KEYS.forEach((k) => (cats[k] = { score: vals[k], note: note(k) }));

  const sections = [
    {
      name: L ? "Rezumat / Profil" : "Summary / Profile",
      rating: wc > 120 ? "ok" : "weak",
      feedback: L
        ? "Adaugă un rezumat de 2-3 rânduri cu rolul țintă și 1-2 realizări cheie."
        : "Add a 2-3 line summary with the target role and 1-2 key achievements.",
    },
    {
      name: L ? "Experiență" : "Experience",
      rating: numbers >= 3 ? "strong" : numbers >= 1 ? "ok" : "weak",
      feedback: L
        ? numbers >= 3
          ? "Bine cuantificată. Începe fiecare bullet cu un verb de acțiune."
          : "Transformă responsabilitățile în rezultate cu cifre."
        : numbers >= 3
        ? "Well quantified. Start each bullet with an action verb."
        : "Turn responsibilities into results with numbers.",
    },
    {
      name: L ? "Competențe" : "Skills",
      rating: t.includes("skill") || t.includes("competen") ? "ok" : "weak",
      feedback: L
        ? "Grupează competențele și prioritizează-le pe cele cerute de rol."
        : "Group skills and prioritize those required by the role.",
    },
  ];

  const rewrites = [
    {
      context: L ? "Bullet de experiență" : "Experience bullet",
      before: L ? "Responsabil de gestionarea clienților" : "Responsible for managing clients",
      after: L
        ? "Am gestionat 40+ conturi de clienți, crescând retenția cu 18% în 6 luni"
        : "Managed 40+ client accounts, increasing retention by 18% in 6 months",
    },
    {
      context: L ? "Rezumat" : "Summary",
      before: L ? "Persoană muncitoare și dedicată" : "Hard-working and dedicated person",
      after: L
        ? "Dezvoltator front-end cu 3 ani experiență, specializat în interfețe performante"
        : "Front-end developer with 3 years building high-performance interfaces",
    },
  ];

  const result = { overall, verdict, categories: cats, sections, rewrites };
  if (jd) {
    result.jdMatch = localJDMatch(t, jd, lang);
  }
  return result;
}

function localJDScore(cvText, jd) {
  const kws = extractKeywords(jd);
  if (!kws.length) return 55;
  const hit = kws.filter((k) => cvText.includes(k)).length;
  return clamp((hit / kws.length) * 100);
}

function localJDMatch(cvText, jd, lang) {
  const kws = extractKeywords(jd);
  const matched = kws.filter((k) => cvText.includes(k)).slice(0, 8);
  const missing = kws.filter((k) => !cvText.includes(k)).slice(0, 8);
  const score = kws.length ? clamp((matched.length / kws.length) * 100) : 50;
  return {
    score,
    matched,
    missing,
    summary:
      lang === "ro"
        ? `Ai acoperit ${matched.length} din ${kws.length} cuvinte-cheie identificate. Integrează termenii lipsă acolo unde îi ai real în experiență.`
        : `You covered ${matched.length} of ${kws.length} detected keywords. Weave in the missing terms where you genuinely have the experience.`,
  };
}

function extractKeywords(jd) {
  const stop = new Set(
    ("the a an and or for with to of in on at is are be we you our your role job " +
      "experience years team work will must should have has able strong good plus " +
      "și sau pentru cu de la în pe este sunt vei trebuie ani echipă rol")
      .split(/\s+/)
  );
  const freq = {};
  (jd.toLowerCase().match(/[a-zăâîșț]{4,}/gi) || []).forEach((w) => {
    if (!stop.has(w)) freq[w] = (freq[w] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([w]) => w);
}

// Local adaptive interview engine -----------------------------

// Bilingual question bank, index-aligned so RO/EN can be swapped live.
// Index 0 is the opener; 1..N are follow-ups. -1 = the "go deeper" probe.
const Q_BANK = {
  ro: [
    "Spune-mi pe scurt despre tine și despre ce te-a adus la acest rol.",
    "Descrie un proiect de care ești mândru/ă. Care a fost rezultatul concret?",
    "Povestește despre o provocare tehnică pe care ai depășit-o. Cum ai abordat-o?",
    "Cum prioritizezi când ai mai multe sarcini cu termene apropiate?",
    "Dă-mi un exemplu în care ai învățat o tehnologie nouă rapid.",
    "Cum gestionezi feedback-ul critic la munca ta?",
    "Unde te vezi profesional în următorii 2-3 ani?",
  ],
  en: [
    "Tell me briefly about yourself and what brought you to this role.",
    "Describe a project you're proud of. What was the concrete outcome?",
    "Tell me about a technical challenge you overcame. How did you approach it?",
    "How do you prioritize when several tasks have tight deadlines?",
    "Give an example where you learned a new technology quickly.",
    "How do you handle critical feedback on your work?",
    "Where do you see yourself professionally in the next 2-3 years?",
  ],
};
const Q_PROBE = {
  ro: "Poți detalia? Adaugă un exemplu concret și un rezultat măsurabil.",
  en: "Can you go deeper? Add a concrete example and a measurable result.",
};

// Suggested model answers, index-aligned with Q_BANK.
const A_BANK = {
  ro: [
    "Sunt dezvoltator front-end cu X ani de experiență, axat pe interfețe performante. M-a atras acest rol pentru că pune accent pe [tehnologie/produs], domeniu în care am livrat deja rezultate concrete.",
    "Am construit [proiect], o aplicație care a redus timpul de [task] cu 30%. Am fost responsabil/ă de arhitectură și de implementarea UI, iar rezultatul a fost adoptat de 500+ utilizatori în prima lună.",
    "M-am confruntat cu o problemă de performanță la randare. Am profilat aplicația, am identificat re-render-urile inutile și am introdus memoizare — timpul de încărcare a scăzut de la 4s la sub 1s.",
    "Folosesc o matrice impact/efort: notez sarcinile, comunic termenele realiste părților interesate și livrez întâi ce aduce cea mai mare valoare. Reevaluez zilnic dacă apar urgențe.",
    "Când am avut nevoie de React într-un proiect, am dedicat un weekend documentației oficiale și am construit un mini-proiect. În două săptămâni livram deja componente în producție.",
    "Cer feedback devreme și des. Îl tratez ca date, nu ca atac personal — întreb clarificări, prioritizez schimbările cu impact mare și revin cu o versiune îmbunătățită.",
    "Vreau să cresc spre un rol de senior/lead, unde să combin expertiza tehnică cu mentoratul. Pe termen scurt, vreau să aprofundez [domeniu] și să contribui la decizii de arhitectură.",
  ],
  en: [
    "I'm a front-end developer with X years of experience focused on high-performance interfaces. This role drew me in because it emphasizes [technology/product], an area where I've already delivered concrete results.",
    "I built [project], an app that cut [task] time by 30%. I owned the architecture and UI implementation, and it was adopted by 500+ users in the first month.",
    "I hit a rendering performance issue. I profiled the app, found unnecessary re-renders, and introduced memoization — load time dropped from 4s to under 1s.",
    "I use an impact/effort matrix: I list tasks, communicate realistic deadlines to stakeholders, and ship the highest-value work first. I re-evaluate daily if urgent items appear.",
    "When a project needed React, I spent a weekend in the official docs building a mini-project. Within two weeks I was shipping components to production.",
    "I ask for feedback early and often. I treat it as data, not a personal attack — I ask clarifying questions, prioritize high-impact changes, and come back with an improved version.",
    "I want to grow toward a senior/lead role combining technical depth with mentoring. Short term, I want to deepen [area] and contribute to architecture decisions.",
  ],
};
const A_PROBE = {
  ro: "Reia răspunsul cu structura STAR: Situație (contextul), Sarcină (ce trebuia rezolvat), Acțiune (ce ai făcut tu concret) și Rezultat (cifra/efectul măsurabil).",
  en: "Reframe with STAR: Situation (the context), Task (what needed solving), Action (what you specifically did), and Result (the measurable number/effect).",
};

// Returns a question DESCRIPTOR {idx, probe} instead of a string,
// so the displayed text can be (re)derived from the current language.
function localFirstQ() {
  return { idx: 0, probe: false };
}
function localNextQ(history) {
  const idx = Math.min(history.length, Q_BANK.ro.length - 1);
  const last = history[history.length - 1]?.a?.toLowerCase() || "";
  const probe = !!last && last.split(/\s+/).filter(Boolean).length < 12;
  return { idx, probe };
}
// Resolve a descriptor to text in the requested language.
function qText(desc, lang) {
  if (!desc) return "";
  if (desc.probe) return Q_PROBE[lang];
  return Q_BANK[lang][desc.idx] ?? Q_BANK[lang][0];
}
function aText(desc, lang) {
  if (!desc) return "";
  if (desc.probe) return A_PROBE[lang];
  return A_BANK[lang][desc.idx] ?? A_BANK[lang][0];
}

function localFeedbackBilingual(history) {
  const avgLen =
    history.reduce((s, h) => s + (h.a?.split(/\s+/).length || 0), 0) /
    Math.max(1, history.length);
  const hasNumbers = history.some((h) => /\d/.test(h.a || ""));
  const score = clamp(45 + Math.min(30, avgLen) + (hasNumbers ? 15 : 0));
  const thin = avgLen < 15;
  return {
    score,
    summary: {
      ro: thin
        ? "Răspunsuri prea scurte. Folosește metoda STAR (Situație, Sarcină, Acțiune, Rezultat)."
        : "Răspunsuri bine dezvoltate. Continuă să închei cu rezultate concrete.",
      en: thin
        ? "Answers were too short. Use the STAR method (Situation, Task, Action, Result)."
        : "Well-developed answers. Keep closing with concrete results.",
    },
    tips: {
      ro: [
        "Cuantifică rezultatele (cifre, procente, timp economisit).",
        "Structurează cu STAR pentru întrebări comportamentale.",
        "Leagă fiecare răspuns de cerințele rolului.",
      ],
      en: [
        "Quantify outcomes (numbers, percentages, time saved).",
        "Structure behavioral answers with STAR.",
        "Tie each answer back to the role's requirements.",
      ],
    },
  };
}

// ---- prompt builders (live API) -----------------------------

function buildEvalPrompt(lang, hasJD) {
  const langName = lang === "ro" ? "Romanian" : "English";
  return `You are a senior technical recruiter and CV coach. Evaluate the attached CV rigorously and honestly. ${
    hasJD ? "A job description is provided — compare the CV against it." : ""
  }
Write ALL human-readable text in ${langName}. Be specific and reference actual CV content.
Respond with ONLY valid JSON, no markdown/backticks/preamble. Schema:
{"overall":<0-100>,"verdict":"<one sentence ${langName}>","categories":{"impact":{"score":<0-100>,"note":"<${langName}>"},"clarity":{"score":<0-100>,"note":"<${langName}>"},"ats":{"score":<0-100>,"note":"<${langName}>"},"structure":{"score":<0-100>,"note":"<${langName}>"},"relevance":{"score":<0-100>,"note":"<${langName}>"}},"sections":[{"name":"<${langName}>","rating":"strong|ok|weak","feedback":"<${langName}>"}],"rewrites":[{"context":"<${langName}>","before":"<original>","after":"<${langName}>"}]${
    hasJD
      ? `,"jdMatch":{"score":<0-100>,"matched":["<kw>"],"missing":["<kw>"],"summary":"<${langName}>"}`
      : ""
  }}
3-6 sections, 2-5 rewrites, max 8 keywords each.`;
}

// ---- UI atoms -----------------------------------------------

function Ring({ value, size = 132 }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const col = scoreColor(value);
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)", filter: `drop-shadow(0 0 8px ${col}88)` }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill={col}
        style={{ font: "700 2.1rem 'JetBrains Mono', monospace" }}>{value}</text>
    </svg>
  );
}

function Bar({ value, label, note }) {
  const col = scoreColor(value);
  return (
    <div className="cvs-bar">
      <div className="cvs-bar-head">
        <span>{label}</span>
        <span style={{ color: col, fontFamily: "'JetBrains Mono',monospace" }}>{value}</span>
      </div>
      <div className="cvs-track">
        <div className="cvs-fill" style={{ width: `${value}%`, background: col, boxShadow: `0 0 12px ${col}99` }} />
      </div>
      {note && <p className="cvs-note">{note}</p>}
    </div>
  );
}

const RATING_DOT = { strong: "#36f1cd", ok: "#ffd166", weak: "#ff6b9d" };

// ---- main ---------------------------------------------------

export default function CVScout() {
  const [lang, setLang] = useState("ro");
  const [view, setView] = useState("input"); // input | loading | results | error | interview | interviewFeedback
  const [mode, setMode] = useState("file");
  const [file, setFile] = useState(null);
  const [pasted, setPasted] = useState("");
  const [useJD, setUseJD] = useState(false);
  const [jd, setJd] = useState("");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);
  const [cvText, setCvText] = useState(""); // best-effort text for local interview
  const inputRef = useRef(null);

  // interview state
  // history items: { qd, a }  where qd is a question descriptor
  //   local:  { idx, probe }      live: { text: {ro, en} }
  const [history, setHistory] = useState([]);
  const [currentQD, setCurrentQD] = useState(null);
  const [answer, setAnswer] = useState("");
  const [qThinking, setQThinking] = useState(false);
  const [ivFeedback, setIvFeedback] = useState(null);
  const [showSuggested, setShowSuggested] = useState(false);

  // Resolve a question descriptor to text in the CURRENT language.
  function resolveQ(qd) {
    if (!qd) return "";
    if (qd.text) return qd.text[lang] || qd.text.en || qd.text.ro || "";
    return qText(qd, lang); // local descriptor {idx, probe}
  }
  // Resolve a suggested answer for a descriptor in the current language.
  function resolveA(qd) {
    if (!qd) return "";
    if (qd.suggested) return qd.suggested[lang] || qd.suggested.en || qd.suggested.ro || "";
    return aText(qd, lang); // local descriptor
  }

  // persistent history
  const [hist_, setHist_] = useState([]);
  const [showHist, setShowHist] = useState(false);
  useEffect(() => {
    store.load().then(setHist_);
  }, []);

  async function pushHistory(entry) {
    const item = { id: Date.now(), ts: new Date().toISOString(), lang, ...entry };
    const next = [item, ...hist_].slice(0, 30); // cap at 30 entries
    setHist_(next);
    await store.save(next);
  }
  async function deleteHistory(id) {
    const next = hist_.filter((h) => h.id !== id);
    setHist_(next);
    await store.save(next);
  }
  async function clearHistory() {
    setHist_([]);
    await store.save([]);
  }

  const t = T[lang];
  const live = inClaudeAI; // real API only inside Claude.ai

  const canRun = useMemo(
    () => (mode === "file" ? !!file : pasted.trim().length > 20),
    [mode, file, pasted]
  );

  const onPick = (f) => { if (f) setFile(f); };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onPick(f);
  }, []);

  // gather CV content blocks + a plaintext fallback
  async function gatherContent() {
    const content = [];
    let plain = "";
    if (mode === "file" && file) {
      if (file.type === "application/pdf") {
        // Extract real text in-browser via pdf.js (free, no API).
        // Used by the local engine and to give the interview real content.
        try {
          plain = await extractPdfText(file);
        } catch (e) {
          console.warn("pdf extract failed, falling back", e);
          plain = "";
        }
        if (live) {
          // Live mode: send the native PDF document block (highest fidelity).
          const b64 = await fileToBase64(file);
          content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } });
        } else {
          content.push({ type: "text", text: `CV CONTENT:\n${plain}` });
        }
      } else if (file.type.startsWith("image/")) {
        const b64 = await fileToBase64(file);
        content.push({ type: "image", source: { type: "base64", media_type: file.type, data: b64 } });
        plain = file.name;
      } else {
        plain = await file.text();
        content.push({ type: "text", text: `CV CONTENT:\n${plain}` });
      }
    } else {
      plain = pasted;
      content.push({ type: "text", text: `CV CONTENT:\n${plain}` });
    }
    return { content, plain };
  }

  async function evaluate() {
    if (!canRun) return;
    setView("loading");
    setStep(0);
    const timer = setInterval(() => setStep((s) => (s + 1) % t.loadingSteps.length), 1600);
    try {
      const { content, plain } = await gatherContent();
      setCvText(plain);
      const hasJD = useJD && jd.trim();
      if (hasJD) content.push({ type: "text", text: `JOB DESCRIPTION:\n${jd}` });

      let parsed;
      if (live) {
        content.push({ type: "text", text: buildEvalPrompt(lang, !!hasJD) });
        parsed = await callClaude(content, 1000);
      } else {
        // local engine — uses extracted/pasted text
        await new Promise((r) => setTimeout(r, 1400)); // let the scan animation play
        let text = plain && plain.trim().length > 30 ? plain : (mode === "paste" ? pasted : "");
        // Scanned/image-only PDF yields little text -> guide the user instead of scoring noise
        if (mode === "file" && file?.type === "application/pdf" && text.trim().length < 40) {
          setView("error");
          clearInterval(timer);
          return;
        }
        parsed = localEvaluate(text || "Experience Skills Education", lang, hasJD ? jd : null);
      }
      setResult(parsed);
      setView("results");
      pushHistory({
        kind: "cv",
        overall: clamp(parsed.overall),
        verdict: parsed.verdict,
        result: parsed,
        cvText: plain?.slice(0, 4000) || "",
      });
    } catch (e) {
      console.error(e);
      setView("error");
    } finally {
      clearInterval(timer);
    }
  }

  // ---- interview flow ----
  async function startInterview() {
    setHistory([]);
    setAnswer("");
    setIvFeedback(null);
    setShowSuggested(false);
    setView("interview");
    setQThinking(true);
    try {
      if (live) {
        const q = await callClaude(
          [
            { type: "text", text: `CV CONTENT:\n${cvText || "(not provided)"}\n\nYou are an interviewer. Ask the FIRST interview question tailored to this CV. Also provide a strong model answer the candidate could give. Respond with ONLY JSON, both languages: {"question_ro":"...","question_en":"...","suggested_ro":"...","suggested_en":"..."}` },
          ],
          600
        );
        setCurrentQD({
          text: { ro: q.question_ro, en: q.question_en },
          suggested: { ro: q.suggested_ro, en: q.suggested_en },
        });
      } else {
        await new Promise((r) => setTimeout(r, 600));
        setCurrentQD(localFirstQ());
      }
    } catch {
      setCurrentQD(localFirstQ());
    } finally {
      setQThinking(false);
    }
  }

  async function submitAnswer(skip = false) {
    const a = skip ? (lang === "ro" ? "(omis)" : "(skipped)") : answer.trim();
    if (!skip && !a) return;
    const newHist = [...history, { qd: currentQD, a }];
    setHistory(newHist);
    setAnswer("");
    setShowSuggested(false);

    if (newHist.length >= 5) {
      finishInterview(newHist);
      return;
    }

    setQThinking(true);
    try {
      if (live) {
        const convo = newHist
          .map((h) => `Q: ${resolveQ(h.qd)}\nA: ${h.a}`)
          .join("\n");
        const q = await callClaude(
          [
            { type: "text", text: `CV CONTENT:\n${cvText}\n\nInterview so far:\n${convo}\n\nAsk the NEXT interview question, adapting to the candidate's last answer (probe deeper if it was thin). Also provide a strong model answer. Respond with ONLY JSON, both languages: {"question_ro":"...","question_en":"...","suggested_ro":"...","suggested_en":"..."}` },
          ],
          600
        );
        setCurrentQD({
          text: { ro: q.question_ro, en: q.question_en },
          suggested: { ro: q.suggested_ro, en: q.suggested_en },
        });
      } else {
        await new Promise((r) => setTimeout(r, 700));
        setCurrentQD(localNextQ(newHist));
      }
    } catch {
      setCurrentQD(localNextQ(newHist));
    } finally {
      setQThinking(false);
    }
  }

  async function finishInterview(hist) {
    setQThinking(true);
    setView("interviewFeedback");
    let fb = null;
    try {
      if (live) {
        const convo = hist.map((h) => `Q: ${resolveQ(h.qd)}\nA: ${h.a}`).join("\n");
        const raw = await callClaude(
          [
            { type: "text", text: `Interview transcript:\n${convo}\n\nGive feedback. Respond with ONLY JSON in both languages: {"score":<0-100>,"summary_ro":"...","summary_en":"...","tips_ro":["...","...","..."],"tips_en":["...","...","..."]}` },
          ],
          700
        );
        fb = {
          score: clamp(raw.score),
          summary: { ro: raw.summary_ro, en: raw.summary_en },
          tips: { ro: raw.tips_ro || [], en: raw.tips_en || [] },
        };
      } else {
        await new Promise((r) => setTimeout(r, 700));
        fb = localFeedbackBilingual(hist);
      }
    } catch {
      fb = localFeedbackBilingual(hist);
    } finally {
      setIvFeedback(fb);
      setQThinking(false);
      if (fb) {
        pushHistory({
          kind: "interview",
          overall: clamp(fb.score),
          verdict: fb.summary[lang] || fb.summary.en,
          feedback: fb,
          transcript: hist,
        });
      }
    }
  }

  function openHistory(item) {
    setShowHist(false);
    if (item.kind === "cv") {
      setResult(item.result);
      setCvText(item.cvText || "");
      setView("results");
    } else {
      setIvFeedback(item.feedback);
      setHistory(item.transcript || []);
      setView("interviewFeedback");
    }
  }

  function reset() {
    setView("input");
    setResult(null);
    setFile(null);
    setPasted("");
    setJd("");
    setUseJD(false);
    setHistory([]);
    setIvFeedback(null);
    setCvText("");
  }

  return (
    <div className="cvs-root" data-lang={lang}>
      <style>{CSS}</style>
      <div className="cvs-grid-bg" />
      <div className="cvs-glow cvs-glow-a" />
      <div className="cvs-glow cvs-glow-b" />

      <header className="cvs-header">
        <div className="cvs-brand">
          <span className="cvs-logo">◈</span>
          <div>
            <h1>{t.brand}</h1>
            <p>{t.tagline}</p>
          </div>
        </div>
        <div className="cvs-head-right">
          <span className={`cvs-mode-pill ${live ? "live" : "local"}`}>
            {live ? "● LIVE AI" : "● LOCAL"}
          </span>
          <button className="cvs-lang" onClick={() => setShowHist(true)}>
            ⧉ {t.history}{hist_.length > 0 && <span className="cvs-hist-badge">{hist_.length}</span>}
          </button>
          <button className="cvs-lang" onClick={() => setLang((l) => (l === "ro" ? "en" : "ro"))}>
            {lang === "ro" ? "EN" : "RO"}
          </button>
        </div>
      </header>

      <main className="cvs-main">
        {view === "input" && (
          <section className="cvs-intro-wrap">
            <p className="cvs-intro">{t.intro}</p>
            <div className="cvs-panel">
              <div className="cvs-tabs">
                <button className={mode === "file" ? "on" : ""} onClick={() => setMode("file")}>{t.fileTab}</button>
                <button className={mode === "paste" ? "on" : ""} onClick={() => setMode("paste")}>{t.pasteTab}</button>
              </div>

              {mode === "file" ? (
                <div
                  className={`cvs-drop ${drag ? "drag" : ""} ${file ? "has" : ""}`}
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={onDrop}
                >
                  <input ref={inputRef} type="file" accept=".pdf,image/*,.txt" hidden onChange={(e) => onPick(e.target.files?.[0])} />
                  {file ? (
                    <div className="cvs-file">
                      <span className="cvs-file-ic">▦</span>
                      <div><strong>{file.name}</strong><small>{(file.size / 1024).toFixed(0)} KB</small></div>
                      <button className="cvs-rm" onClick={(e) => { e.stopPropagation(); setFile(null); }}>{t.remove}</button>
                    </div>
                  ) : (
                    <>
                      <div className="cvs-drop-ic">⬆</div>
                      <p className="cvs-drop-hint">{t.dropHint}</p>
                      <small>{t.fileTypes}</small>
                    </>
                  )}
                </div>
              ) : (
                <textarea className="cvs-ta" placeholder={t.pastePlaceholder} value={pasted} onChange={(e) => setPasted(e.target.value)} rows={9} />
              )}

              {!live && mode === "file" && (
                <p className="cvs-hint-muted" style={{ marginTop: 10 }}>
                  {lang === "ro"
                    ? "Notă: PDF-urile sunt citite direct în browser (fără cost). Pentru imagini (poză cu CV-ul), lipește textul pentru cea mai bună analiză."
                    : "Note: PDFs are read directly in your browser (no cost). For images (a photo of the CV), paste the text for the best analysis."}
                </p>
              )}

              <button className={`cvs-jd-toggle ${useJD ? "on" : ""}`} onClick={() => setUseJD((v) => !v)}>
                <span className="cvs-check">{useJD ? "✓" : ""}</span>{t.jdToggle}
              </button>
              {useJD && (
                <textarea className="cvs-ta cvs-jd" placeholder={t.jdPlaceholder} value={jd} onChange={(e) => setJd(e.target.value)} rows={5} />
              )}

              <button className="cvs-run" disabled={!canRun} onClick={evaluate}>{t.evaluate} <span>→</span></button>
              {!canRun && (
                <>
                  <p className="cvs-hint-muted">{t.noFile}</p>
                  <button
                    className="cvs-demo-btn"
                    onClick={() => { setMode("paste"); setPasted(DEMO_CV); }}
                  >
                    {t.tryDemo}
                  </button>
                </>
              )}
              {canRun && mode === "paste" && pasted === DEMO_CV && (
                <p className="cvs-hint-muted" style={{ color: "var(--mint)" }}>{t.demoNote}</p>
              )}
            </div>
          </section>
        )}

        {view === "loading" && (
          <section className="cvs-loading">
            <div className="cvs-scan"><div className="cvs-scan-line" /><div className="cvs-scan-doc" /></div>
            <p className="cvs-step">{t.loadingSteps[step]}</p>
            <span className="cvs-powered">{live ? t.poweredLive : t.poweredLocal}</span>
          </section>
        )}

        {view === "error" && (
          <section className="cvs-error">
            <h2>{t.errorTitle}</h2>
            <p>{t.errorBody}</p>
            <button className="cvs-run" onClick={reset}>{t.reset}</button>
          </section>
        )}

        {view === "results" && result && (
          <section className="cvs-results">
            <div className="cvs-overall cvs-card">
              <Ring value={clamp(result.overall)} />
              <div className="cvs-overall-txt">
                <span className="cvs-eyebrow">{t.overall}</span>
                <p className="cvs-verdict">{result.verdict}</p>
                <button className="cvs-iv-btn" onClick={startInterview}>{t.startInterview}</button>
              </div>
            </div>

            {result.jdMatch && (
              <div className="cvs-card cvs-jdmatch">
                <div className="cvs-jdmatch-head">
                  <span className="cvs-eyebrow">{t.jdMatch}</span>
                  <strong style={{ color: scoreColor(clamp(result.jdMatch.score)) }}>{clamp(result.jdMatch.score)}%</strong>
                </div>
                <p className="cvs-note">{result.jdMatch.summary}</p>
                <div className="cvs-kw-row">
                  <div>
                    <small className="cvs-kw-lbl ok">{t.matchedKw}</small>
                    <div className="cvs-kws">{(result.jdMatch.matched || []).map((k, i) => <span key={i} className="cvs-kw match">{k}</span>)}</div>
                  </div>
                  <div>
                    <small className="cvs-kw-lbl miss">{t.missingKw}</small>
                    <div className="cvs-kws">{(result.jdMatch.missing || []).map((k, i) => <span key={i} className="cvs-kw miss">{k}</span>)}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="cvs-card">
              <span className="cvs-eyebrow">{t.categories}</span>
              <div className="cvs-bars">
                {CAT_KEYS.map((k) => result.categories?.[k] ? (
                  <Bar key={k} label={t.cat[k]} value={clamp(result.categories[k].score)} note={result.categories[k].note} />
                ) : null)}
              </div>
            </div>

            {result.sections?.length > 0 && (
              <div className="cvs-card">
                <span className="cvs-eyebrow">{t.sections}</span>
                <div className="cvs-sections">
                  {result.sections.map((s, i) => (
                    <div key={i} className="cvs-sec">
                      <span className="cvs-sec-dot" style={{ background: RATING_DOT[s.rating] || "#7af0ff" }} />
                      <div><strong>{s.name}</strong><p>{s.feedback}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.rewrites?.length > 0 && (
              <div className="cvs-card">
                <span className="cvs-eyebrow">{t.rewrites}</span>
                <div className="cvs-rewrites">
                  {result.rewrites.map((r, i) => (
                    <div key={i} className="cvs-rw">
                      {r.context && <span className="cvs-rw-ctx">{r.context}</span>}
                      <div className="cvs-rw-row">
                        <div className="cvs-rw-before"><small>{t.before}</small><p>{r.before}</p></div>
                        <span className="cvs-rw-arrow">→</span>
                        <div className="cvs-rw-after"><small>{t.after}</small><p>{r.after}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="cvs-reset" onClick={reset}>↺ {t.reset}</button>
          </section>
        )}

        {view === "interview" && (
          <section className="cvs-results">
            <div className="cvs-card cvs-iv">
              <span className="cvs-eyebrow">{t.interviewTitle}</span>
              <p className="cvs-note" style={{ marginTop: 0, marginBottom: 18 }}>{t.interviewIntro}</p>

              <div className="cvs-iv-progress">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={`cvs-iv-pip ${i < history.length ? "done" : i === history.length ? "active" : ""}`} />
                ))}
              </div>

              {history.map((h, i) => (
                <div key={i} className="cvs-iv-past">
                  <p className="cvs-iv-q">{resolveQ(h.qd)}</p>
                  <p className="cvs-iv-a">{h.a}</p>
                </div>
              ))}

              {qThinking ? (
                <div className="cvs-iv-thinking"><span className="cvs-dot" /><span className="cvs-dot" /><span className="cvs-dot" />{" "}{t.thinking}</div>
              ) : (
                <>
                  <div className="cvs-iv-current">
                    <span className="cvs-iv-num">{t.question} {history.length + 1} {t.of} 5</span>
                    <p className="cvs-iv-q live">{resolveQ(currentQD)}</p>
                  </div>
                  <textarea className="cvs-ta" rows={4} placeholder={t.yourAnswer} value={answer} onChange={(e) => setAnswer(e.target.value)} />

                  {/* suggested answer */}
                  <div className="cvs-suggest">
                    <button className="cvs-suggest-toggle" onClick={() => setShowSuggested((v) => !v)}>
                      <span>{showSuggested ? "▾" : "▸"}</span> {t.suggestedTitle}
                    </button>
                    {showSuggested && (
                      <div className="cvs-suggest-body">
                        <p>{resolveA(currentQD)}</p>
                        <button className="cvs-suggest-use" onClick={() => { setAnswer(resolveA(currentQD)); setShowSuggested(false); }}>
                          {t.useSuggested}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="cvs-iv-actions">
                    <button className="cvs-reset" onClick={() => submitAnswer(true)}>{t.skip}</button>
                    <button className="cvs-run" style={{ width: "auto", flex: 1 }} disabled={!answer.trim()} onClick={() => submitAnswer(false)}>
                      {history.length >= 4 ? t.finish : t.send} <span>→</span>
                    </button>
                  </div>
                </>
              )}
            </div>
            <button className="cvs-reset" onClick={() => setView("results")}>{t.backToResults}</button>
          </section>
        )}

        {view === "interviewFeedback" && (
          <section className="cvs-results">
            <div className="cvs-overall cvs-card">
              {qThinking ? (
                <div className="cvs-iv-thinking" style={{ margin: "20px auto" }}><span className="cvs-dot" /><span className="cvs-dot" /><span className="cvs-dot" /></div>
              ) : ivFeedback ? (
                <>
                  <Ring value={clamp(ivFeedback.score)} />
                  <div className="cvs-overall-txt">
                    <span className="cvs-eyebrow">{t.interviewScore}</span>
                    <p className="cvs-verdict">{ivFeedback.summary?.[lang] || ivFeedback.summary?.en || ivFeedback.summary}</p>
                  </div>
                </>
              ) : null}
            </div>

            {/* transcript with suggested answers for review */}
            {history.length > 0 && !qThinking && (
              <div className="cvs-card">
                <span className="cvs-eyebrow">{t.reviewTitle}</span>
                <div className="cvs-sections">
                  {history.map((h, i) => (
                    <div key={i} className="cvs-iv-review">
                      <p className="cvs-iv-q">{resolveQ(h.qd)}</p>
                      <p className="cvs-iv-a">{h.a}</p>
                      <details className="cvs-iv-model">
                        <summary>{t.modelAnswer}</summary>
                        <p>{resolveA(h.qd)}</p>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const tips = ivFeedback?.tips?.[lang] || ivFeedback?.tips?.en || ivFeedback?.tips || [];
              return tips.length > 0 ? (
                <div className="cvs-card">
                  <span className="cvs-eyebrow">{t.tips}</span>
                  <div className="cvs-sections">
                    {tips.map((tip, i) => (
                      <div key={i} className="cvs-sec">
                        <span className="cvs-sec-dot" style={{ background: "#7af0ff" }} />
                        <div><p style={{ color: "var(--txt)" }}>{tip}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <div className="cvs-iv-actions">
              <button className="cvs-reset" style={{ flex: 1 }} onClick={() => setView("results")}>{t.backToResults}</button>
              <button className="cvs-run" style={{ width: "auto", flex: 1 }} onClick={startInterview}>{t.startInterview}</button>
            </div>
          </section>
        )}
      </main>

      {/* history drawer */}
      <div className={`cvs-hist-overlay ${showHist ? "open" : ""}`} onClick={() => setShowHist(false)} />
      <aside className={`cvs-hist-drawer ${showHist ? "open" : ""}`}>
        <div className="cvs-hist-top">
          <span className="cvs-eyebrow" style={{ margin: 0 }}>{t.history}</span>
          <button className="cvs-hist-close" onClick={() => setShowHist(false)}>✕</button>
        </div>
        {hist_.length === 0 ? (
          <p className="cvs-hint-muted">{t.historyEmpty}</p>
        ) : (
          <>
            <div className="cvs-hist-list">
              {hist_.map((h) => (
                <div key={h.id} className="cvs-hist-item">
                  <div className="cvs-hist-meta">
                    <span className={`cvs-hist-kind ${h.kind}`}>
                      {h.kind === "cv" ? t.cvEval : t.interviewLabel}
                    </span>
                    <span className="cvs-hist-score" style={{ color: scoreColor(h.overall) }}>{h.overall}</span>
                  </div>
                  <p className="cvs-hist-verdict">{h.verdict}</p>
                  <span className="cvs-hist-date">
                    {new Date(h.ts).toLocaleDateString()} · {new Date(h.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className="cvs-hist-actions">
                    <button onClick={() => openHistory(h)}>{t.open}</button>
                    <button className="del" onClick={() => deleteHistory(h.id)}>{t.del}</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="cvs-hist-clear" onClick={clearHistory}>{t.clearAll}</button>
            <p className="cvs-hint-muted" style={{ fontSize: ".72rem" }}>{t.savedNote}</p>
          </>
        )}
      </aside>
    </div>
  );
}

// ---- styles -------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap');

.cvs-root{--bg:#070a0f;--panel:rgba(18,24,33,0.72);--line:rgba(122,240,255,0.14);--txt:#e8eef5;--mut:#8b97a8;--neon:#7af0ff;--mint:#36f1cd;position:relative;min-height:100vh;background:var(--bg);color:var(--txt);font-family:'Outfit',sans-serif;overflow-x:hidden;padding-bottom:80px;}
.cvs-root *{box-sizing:border-box;}
.cvs-grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(122,240,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(122,240,255,.035) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000,transparent);pointer-events:none;}
.cvs-glow{position:fixed;border-radius:50%;filter:blur(120px);opacity:.45;pointer-events:none;}
.cvs-glow-a{width:520px;height:520px;background:#1b6cff;top:-180px;right:-120px;}
.cvs-glow-b{width:460px;height:460px;background:#0fb6a0;bottom:-160px;left:-140px;opacity:.32;}
.cvs-header{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:26px clamp(20px,5vw,64px);}
.cvs-brand{display:flex;gap:14px;align-items:center;}
.cvs-logo{font-size:1.8rem;color:var(--neon);filter:drop-shadow(0 0 10px var(--neon));}
.cvs-brand h1{margin:0;font-family:'Fraunces',serif;font-weight:900;font-size:1.5rem;letter-spacing:.04em;}
.cvs-brand p{margin:0;font-size:.78rem;color:var(--mut);}
.cvs-head-right{display:flex;align-items:center;gap:12px;}
.cvs-mode-pill{font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.1em;padding:5px 10px;border-radius:8px;border:1px solid var(--line);}
.cvs-mode-pill.live{color:var(--mint);border-color:rgba(54,241,205,.4);}
.cvs-mode-pill.local{color:var(--mut);}
.cvs-lang{background:transparent;border:1px solid var(--line);color:var(--neon);font-family:'JetBrains Mono',monospace;font-size:.8rem;padding:8px 14px;border-radius:10px;cursor:pointer;transition:.25s;}
.cvs-lang:hover{background:rgba(122,240,255,.08);border-color:var(--neon);}
.cvs-main{position:relative;z-index:2;max-width:860px;margin:0 auto;padding:0 clamp(20px,5vw,40px);}
.cvs-intro-wrap{animation:rise .6s ease both;}
.cvs-intro{font-size:clamp(1.05rem,2.4vw,1.35rem);line-height:1.5;max-width:620px;margin:24px 0 30px;font-weight:300;}
.cvs-intro::first-line{color:var(--neon);}
.cvs-panel{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,.4);}
.cvs-tabs{display:flex;gap:6px;margin-bottom:18px;background:rgba(0,0,0,.25);padding:5px;border-radius:12px;width:fit-content;}
.cvs-tabs button{background:transparent;border:none;color:var(--mut);padding:8px 18px;border-radius:8px;cursor:pointer;font-family:'Outfit';font-size:.9rem;transition:.2s;}
.cvs-tabs button.on{background:rgba(122,240,255,.12);color:var(--neon);}
.cvs-drop{border:1.5px dashed var(--line);border-radius:16px;padding:40px 20px;text-align:center;cursor:pointer;transition:.25s;background:rgba(0,0,0,.15);}
.cvs-drop:hover,.cvs-drop.drag{border-color:var(--neon);background:rgba(122,240,255,.05);}
.cvs-drop.has{cursor:default;border-style:solid;}
.cvs-drop-ic{font-size:2rem;color:var(--neon);margin-bottom:10px;}
.cvs-drop-hint{margin:0 0 6px;font-size:1rem;}
.cvs-drop small{color:var(--mut);font-size:.8rem;}
.cvs-file{display:flex;align-items:center;gap:14px;text-align:left;}
.cvs-file-ic{font-size:1.6rem;color:var(--mint);}
.cvs-file strong{display:block;font-size:.95rem;}
.cvs-file small{color:var(--mut);font-family:'JetBrains Mono',monospace;font-size:.75rem;}
.cvs-rm{margin-left:auto;background:transparent;border:1px solid rgba(255,107,157,.4);color:#ff6b9d;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:.8rem;}
.cvs-ta{width:100%;background:rgba(0,0,0,.25);border:1px solid var(--line);border-radius:14px;color:var(--txt);padding:16px;font-family:'Outfit';font-size:.95rem;resize:vertical;line-height:1.5;}
.cvs-ta:focus{outline:none;border-color:var(--neon);}
.cvs-ta::placeholder{color:var(--mut);}
.cvs-jd{margin-top:12px;animation:rise .35s ease both;}
.cvs-jd-toggle{display:flex;align-items:center;gap:10px;margin-top:16px;background:transparent;border:none;color:var(--mut);cursor:pointer;font-family:'Outfit';font-size:.92rem;transition:.2s;}
.cvs-jd-toggle.on{color:var(--neon);}
.cvs-check{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border:1px solid var(--line);border-radius:6px;font-size:.75rem;color:var(--mint);}
.cvs-jd-toggle.on .cvs-check{border-color:var(--mint);background:rgba(54,241,205,.12);}
.cvs-run{width:100%;margin-top:22px;background:linear-gradient(95deg,var(--neon),var(--mint));color:#04181c;border:none;padding:16px;border-radius:14px;font-family:'Outfit';font-weight:600;font-size:1.02rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:.25s;}
.cvs-run:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 30px rgba(122,240,255,.3);}
.cvs-run:disabled{opacity:.35;cursor:not-allowed;}
.cvs-run:hover:not(:disabled) span{transform:translateX(4px);}
.cvs-hint-muted{text-align:center;color:var(--mut);font-size:.82rem;margin:10px 0 0;}
.cvs-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:48vh;gap:22px;animation:rise .4s ease both;}
.cvs-scan{position:relative;width:120px;height:150px;}
.cvs-scan-doc{position:absolute;inset:0;border:1.5px solid var(--line);border-radius:8px;background:rgba(122,240,255,.03);}
.cvs-scan-doc::before{content:"";position:absolute;left:16px;right:16px;top:22px;height:8px;border-radius:4px;background:rgba(122,240,255,.12);box-shadow:0 18px 0 rgba(122,240,255,.12),0 36px 0 rgba(122,240,255,.12),0 54px 0 rgba(122,240,255,.08),0 72px 0 rgba(122,240,255,.08);}
.cvs-scan-line{position:absolute;left:-4px;right:-4px;height:2px;background:var(--neon);box-shadow:0 0 16px var(--neon);border-radius:2px;animation:scan 1.8s ease-in-out infinite;z-index:2;}
.cvs-step{font-family:'JetBrains Mono',monospace;color:var(--neon);font-size:.95rem;}
.cvs-powered{color:var(--mut);font-size:.78rem;}
.cvs-error{text-align:center;padding:60px 20px;}
.cvs-error h2{font-family:'Fraunces',serif;color:#ff6b9d;}
.cvs-error p{color:var(--mut);margin-bottom:24px;}
.cvs-results{display:flex;flex-direction:column;gap:18px;margin-top:14px;animation:rise .5s ease both;}
.cvs-card{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:18px;padding:24px;}
.cvs-eyebrow{display:block;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mut);margin-bottom:16px;}
.cvs-overall{display:flex;align-items:center;gap:28px;flex-wrap:wrap;}
.cvs-overall-txt{flex:1;min-width:220px;}
.cvs-verdict{font-family:'Fraunces',serif;font-size:clamp(1.2rem,2.6vw,1.55rem);line-height:1.35;font-weight:600;margin:0 0 16px;}
.cvs-iv-btn{background:rgba(122,240,255,.1);border:1px solid var(--line);color:var(--neon);padding:11px 18px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.92rem;transition:.2s;}
.cvs-iv-btn:hover{background:rgba(122,240,255,.18);border-color:var(--neon);transform:translateY(-1px);}
.cvs-jdmatch-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;}
.cvs-jdmatch-head .cvs-eyebrow{margin:0;}
.cvs-jdmatch-head strong{font-family:'JetBrains Mono',monospace;font-size:1.4rem;}
.cvs-kw-row{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:16px;}
.cvs-kw-lbl{display:block;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;}
.cvs-kw-lbl.ok{color:var(--mint);}.cvs-kw-lbl.miss{color:#ff6b9d;}
.cvs-kws{display:flex;flex-wrap:wrap;gap:6px;}
.cvs-kw{font-size:.78rem;padding:4px 10px;border-radius:8px;font-family:'JetBrains Mono',monospace;}
.cvs-kw.match{background:rgba(54,241,205,.1);color:var(--mint);border:1px solid rgba(54,241,205,.25);}
.cvs-kw.miss{background:rgba(255,107,157,.08);color:#ff6b9d;border:1px solid rgba(255,107,157,.22);}
.cvs-bars{display:flex;flex-direction:column;gap:18px;}
.cvs-bar-head{display:flex;justify-content:space-between;font-size:.92rem;margin-bottom:7px;}
.cvs-track{height:7px;background:rgba(255,255,255,.06);border-radius:6px;overflow:hidden;}
.cvs-fill{height:100%;border-radius:6px;transition:width 1s cubic-bezier(.2,.8,.2,1);}
.cvs-note{color:var(--mut);font-size:.84rem;line-height:1.45;margin:7px 0 0;}
.cvs-sections{display:flex;flex-direction:column;gap:16px;}
.cvs-sec{display:flex;gap:13px;}
.cvs-sec-dot{width:9px;height:9px;border-radius:50%;margin-top:7px;flex-shrink:0;box-shadow:0 0 8px currentColor;}
.cvs-sec strong{font-size:.98rem;display:block;margin-bottom:3px;}
.cvs-sec p{color:var(--mut);font-size:.88rem;line-height:1.5;margin:0;}
.cvs-rewrites{display:flex;flex-direction:column;gap:16px;}
.cvs-rw{background:rgba(0,0,0,.2);border:1px solid var(--line);border-radius:14px;padding:16px;}
.cvs-rw-ctx{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:var(--mut);display:block;margin-bottom:10px;}
.cvs-rw-row{display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:center;}
.cvs-rw-before small,.cvs-rw-after small{font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;display:block;margin-bottom:6px;}
.cvs-rw-before small{color:#ff6b9d;}.cvs-rw-after small{color:var(--mint);}
.cvs-rw-before p{color:var(--mut);font-size:.86rem;line-height:1.4;margin:0;text-decoration:line-through;text-decoration-color:rgba(255,107,157,.4);}
.cvs-rw-after p{color:var(--txt);font-size:.88rem;line-height:1.45;margin:0;}
.cvs-rw-arrow{color:var(--neon);font-size:1.2rem;}
.cvs-iv-progress{display:flex;gap:8px;margin-bottom:20px;}
.cvs-iv-pip{flex:1;height:4px;border-radius:3px;background:rgba(255,255,255,.08);transition:.3s;}
.cvs-iv-pip.done{background:var(--mint);box-shadow:0 0 8px rgba(54,241,205,.5);}
.cvs-iv-pip.active{background:var(--neon);box-shadow:0 0 8px var(--neon);}
.cvs-iv-past{padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05);margin-bottom:12px;}
.cvs-iv-q{font-family:'Fraunces',serif;font-size:1rem;color:var(--mut);margin:0 0 6px;}
.cvs-iv-a{color:var(--txt);font-size:.9rem;line-height:1.5;margin:0;padding-left:14px;border-left:2px solid var(--line);}
.cvs-iv-current{margin-bottom:14px;}
.cvs-iv-num{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:var(--neon);letter-spacing:.1em;}
.cvs-iv-q.live{font-size:1.2rem;color:var(--txt);margin-top:8px;}
.cvs-iv-actions{display:flex;gap:12px;align-items:center;margin-top:16px;}
.cvs-iv-actions .cvs-run{margin-top:0;}
.cvs-iv-thinking{display:flex;align-items:center;gap:8px;color:var(--neon);font-family:'JetBrains Mono',monospace;font-size:.88rem;padding:20px 0;}
.cvs-dot{width:7px;height:7px;border-radius:50%;background:var(--neon);animation:pulse 1.2s infinite;}
.cvs-dot:nth-child(2){animation-delay:.2s;}.cvs-dot:nth-child(3){animation-delay:.4s;}
.cvs-reset{align-self:center;background:transparent;border:1px solid var(--line);color:var(--mut);padding:12px 24px;border-radius:12px;cursor:pointer;font-family:'Outfit';transition:.2s;}
.cvs-reset:hover{border-color:var(--neon);color:var(--neon);}
@keyframes scan{0%,100%{top:0;}50%{top:calc(100% - 2px);}}
@keyframes rise{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8);}50%{opacity:1;transform:scale(1.1);}}
@media(max-width:600px){.cvs-kw-row{grid-template-columns:1fr;}.cvs-rw-row{grid-template-columns:1fr;text-align:left;}.cvs-rw-arrow{transform:rotate(90deg);justify-self:start;}.cvs-overall{justify-content:center;text-align:center;}.cvs-iv-actions{flex-direction:column;}.cvs-iv-actions>*{width:100%;}}
.cvs-hist-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;margin-left:6px;background:var(--neon);color:#04181c;border-radius:9px;font-size:.68rem;font-weight:700;}
.cvs-suggest{margin-top:14px;border:1px solid var(--line);border-radius:12px;background:rgba(54,241,205,.04);overflow:hidden;}
.cvs-suggest-toggle{width:100%;text-align:left;background:transparent;border:none;color:var(--mint);padding:13px 16px;cursor:pointer;font-family:'Outfit';font-size:.9rem;display:flex;align-items:center;gap:8px;}
.cvs-suggest-toggle span{font-family:'JetBrains Mono',monospace;font-size:.8rem;}
.cvs-suggest-body{padding:0 16px 16px;animation:rise .25s ease both;}
.cvs-suggest-body p{color:var(--txt);font-size:.9rem;line-height:1.55;margin:0 0 12px;}
.cvs-suggest-use{background:rgba(54,241,205,.12);border:1px solid rgba(54,241,205,.3);color:var(--mint);padding:8px 14px;border-radius:9px;cursor:pointer;font-family:'Outfit';font-size:.82rem;transition:.2s;}
.cvs-suggest-use:hover{background:rgba(54,241,205,.2);}
.cvs-iv-review{padding:14px;background:rgba(0,0,0,.18);border:1px solid var(--line);border-radius:12px;}
.cvs-iv-review .cvs-iv-q{color:var(--txt);}
.cvs-iv-model{margin-top:10px;}
.cvs-iv-model summary{cursor:pointer;color:var(--mint);font-size:.82rem;list-style:none;}
.cvs-iv-model summary::-webkit-details-marker{display:none;}
.cvs-iv-model p{color:var(--txt);font-size:.86rem;line-height:1.5;margin:10px 0 0;padding-left:14px;border-left:2px solid rgba(54,241,205,.3);}
.cvs-demo-btn{display:block;margin:12px auto 0;background:transparent;border:1px dashed var(--line);color:var(--neon);padding:9px 18px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;transition:.2s;}
.cvs-demo-btn:hover{border-color:var(--neon);background:rgba(122,240,255,.06);}
.cvs-hist-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:.3s;z-index:9;}
.cvs-hist-overlay.open{opacity:1;pointer-events:auto;}
.cvs-hist-drawer{position:fixed;top:0;right:0;height:100%;width:min(380px,90vw);background:#0b0f16;border-left:1px solid var(--line);box-shadow:-20px 0 60px rgba(0,0,0,.5);transform:translateX(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1);z-index:10;padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;}
.cvs-hist-drawer.open{transform:translateX(0);}
.cvs-hist-top{display:flex;justify-content:space-between;align-items:center;}
.cvs-hist-close{background:transparent;border:1px solid var(--line);color:var(--mut);width:32px;height:32px;border-radius:9px;cursor:pointer;transition:.2s;}
.cvs-hist-close:hover{color:var(--neon);border-color:var(--neon);}
.cvs-hist-list{display:flex;flex-direction:column;gap:12px;}
.cvs-hist-item{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;}
.cvs-hist-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.cvs-hist-kind{font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:7px;}
.cvs-hist-kind.cv{background:rgba(122,240,255,.1);color:var(--neon);}
.cvs-hist-kind.interview{background:rgba(54,241,205,.1);color:var(--mint);}
.cvs-hist-score{font-family:'JetBrains Mono',monospace;font-size:1.1rem;font-weight:700;}
.cvs-hist-verdict{font-size:.84rem;color:var(--txt);line-height:1.4;margin:0 0 6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cvs-hist-date{font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--mut);}
.cvs-hist-actions{display:flex;gap:8px;margin-top:10px;}
.cvs-hist-actions button{flex:1;background:rgba(122,240,255,.08);border:1px solid var(--line);color:var(--neon);padding:7px;border-radius:9px;cursor:pointer;font-family:'Outfit';font-size:.8rem;transition:.2s;}
.cvs-hist-actions button:hover{background:rgba(122,240,255,.16);}
.cvs-hist-actions button.del{background:transparent;color:#ff6b9d;border-color:rgba(255,107,157,.3);}
.cvs-hist-actions button.del:hover{background:rgba(255,107,157,.1);}
.cvs-hist-clear{background:transparent;border:1px solid rgba(255,107,157,.3);color:#ff6b9d;padding:10px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;transition:.2s;}
.cvs-hist-clear:hover{background:rgba(255,107,157,.1);}
`;
