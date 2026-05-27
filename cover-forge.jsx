import React, { useState, useRef, useMemo, useEffect } from "react";

// ============================================================
// COVER FORGE — AI Cover Letter Generator
// Part of the Career Toolkit suite. Same architecture as CV Scout:
// single-file · bilingual RO/EN · dual-mode cost-zero · dark editorial.
// Accent: amber/gold.
// ============================================================

const API_HOST = "https://api.anthropic.com/v1/messages";
const inClaudeAI =
  typeof window !== "undefined" &&
  /claude\.ai|anthropic/.test(window.location?.hostname || "");

const T = {
  ro: {
    brand: "COVER FORGE",
    tagline: "Generator de scrisori de intenție cu AI",
    intro:
      "Lipește CV-ul tău și anunțul de job, alege tonul, și primești o scrisoare de intenție adaptată — gata de trimis.",
    cvTab: "CV",
    jobTab: "Anunț job",
    cvPlaceholder: "Lipește aici CV-ul tău (sau încarcă PDF mai jos)…",
    jobPlaceholder: "Lipește aici descrierea jobului…",
    upload: "Încarcă PDF",
    toneLabel: "Ton",
    tones: { professional: "Profesional", warm: "Cald", confident: "Încrezător", concise: "Concis" },
    lengthLabel: "Lungime",
    lengths: { short: "Scurtă", medium: "Medie", long: "Detaliată" },
    generate: "Generează scrisoarea",
    generating: "Se scrie…",
    loadingSteps: [
      "Se citește CV-ul…",
      "Se analizează jobul…",
      "Se potrivesc punctele forte…",
      "Se compune scrisoarea…",
    ],
    result: "Scrisoarea ta",
    copy: "Copiază",
    copied: "Copiat!",
    regen: "Regenerează",
    reset: "Începe din nou",
    noInput: "Adaugă CV-ul și anunțul de job.",
    tryDemo: "Încearcă cu date demo",
    history: "Istoric",
    historyEmpty: "Nicio scrisoare salvată încă.",
    open: "Deschide",
    del: "Șterge",
    clearAll: "Șterge tot",
    savedNote: "Salvat automat pe acest dispozitiv",
    poweredLive: "Generare live prin Claude",
    poweredLocal: "Motor local · fără cost, fără cheie API",
    errorTitle: "Ceva n-a mers",
    errorBody: "Nu am putut genera scrisoarea. Încearcă din nou.",
    matchNote: "Puncte din CV folosite",
  },
  en: {
    brand: "COVER FORGE",
    tagline: "AI cover letter generator",
    intro:
      "Paste your CV and the job post, pick a tone, and get a tailored cover letter — ready to send.",
    cvTab: "CV",
    jobTab: "Job post",
    cvPlaceholder: "Paste your CV here (or upload a PDF below)…",
    jobPlaceholder: "Paste the job description here…",
    upload: "Upload PDF",
    toneLabel: "Tone",
    tones: { professional: "Professional", warm: "Warm", confident: "Confident", concise: "Concise" },
    lengthLabel: "Length",
    lengths: { short: "Short", medium: "Medium", long: "Detailed" },
    generate: "Generate letter",
    generating: "Writing…",
    loadingSteps: [
      "Reading the CV…",
      "Analyzing the job…",
      "Matching your strengths…",
      "Composing the letter…",
    ],
    result: "Your letter",
    copy: "Copy",
    copied: "Copied!",
    regen: "Regenerate",
    reset: "Start over",
    noInput: "Add your CV and the job post.",
    tryDemo: "Try with demo data",
    history: "History",
    historyEmpty: "No letters saved yet.",
    open: "Open",
    del: "Delete",
    clearAll: "Clear all",
    savedNote: "Auto-saved on this device",
    poweredLive: "Live generation via Claude",
    poweredLocal: "Local engine · no cost, no API key",
    errorTitle: "Something went wrong",
    errorBody: "Couldn't generate the letter. Try again.",
    matchNote: "CV points used",
  },
};

const DEMO_CV =
  "Laura Andreea — Front-End Developer. Self-taught, background in CRM & digital marketing. Built 60+ bilingual web apps on GitHub Pages: ARCADE-OPS (gamified learning app, 8800+ lines), ClientOps Suite (React+Vite+Tailwind SaaS dashboard), Alpis Fusion CRM (health scoring, segment builder, CSV import). Skills: React, Vite, Tailwind, Recharts, Git, REST APIs, SEO, RO/EN delivery. Certifications: Google, freeCodeCamp, Anthropic, LinkedIn Learning.";
const DEMO_JOB =
  "We're hiring a Front-End Developer (React) to build dashboards and customer-facing tools. You'll own UI components, collaborate with design, and ship features in 2-week sprints. Required: React, modern CSS, Git, attention to detail, bilingual a plus.";

// ---- shared helpers (same as CV Scout) ----------------------

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1]);
    r.onerror = () => rej(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

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
  const max = Math.min(pdf.numPages, 6);
  for (let p = 1; p <= max; p++) {
    const page = await pdf.getPage(p);
    const tc = await page.getTextContent();
    out += tc.items.map((it) => it.str).join(" ") + "\n";
  }
  return out.trim();
}

const HKEY = "coverforge:history";
let _memStore = [];
const store = {
  async load() {
    try {
      if (typeof window !== "undefined" && window.storage?.get) {
        const r = await window.storage.get(HKEY);
        return r?.value ? JSON.parse(r.value) : [];
      }
    } catch (e) {}
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(HKEY);
        return raw ? JSON.parse(raw) : [];
      }
    } catch (e) {}
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
    } catch (e) {}
    try {
      if (typeof localStorage !== "undefined") localStorage.setItem(HKEY, json);
    } catch (e) {}
  },
};

async function callClaude(content, maxTokens = 1200) {
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
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}

// ---- local generator (no API) -------------------------------

function localCoverLetter(cv, job, tone, length, lang) {
  const L = lang === "ro";
  // pull a few keywords from the job
  const stop = new Set("the a an and or for with to of in on at is are be we you our your role job experience și sau pentru cu de la în pe este sunt".split(/\s+/));
  const freq = {};
  (job.toLowerCase().match(/[a-zăâîșț]{4,}/gi) || []).forEach((w) => { if (!stop.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const kws = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);
  const name = (cv.match(/^([A-ZĂÂÎȘȚ][a-zăâîșț]+ [A-ZĂÂÎȘȚ][a-zăâîșț]+)/) || [, L ? "Candidatul" : "The candidate"])[1];
  const role = (job.match(/(developer|engineer|manager|designer|analyst|specialist)/i) || [, "Front-End Developer"])[1];

  const open = L
    ? `Stimate domn/doamnă,\n\nVă scriu cu mare interes pentru poziția de ${role}. `
    : `Dear Hiring Manager,\n\nI'm writing with great interest in the ${role} position. `;
  const body = L
    ? `Cu experiența mea relevantă și pasiunea pentru livrarea de produse de calitate, cred că aș aduce o contribuție reală echipei. Am lucrat cu ${kws.slice(0, 3).join(", ") || "tehnologii moderne"} și am livrat constant rezultate măsurabile.`
    : `With relevant experience and a passion for shipping quality products, I believe I'd be a strong fit for your team. I've worked with ${kws.slice(0, 3).join(", ") || "modern technologies"} and have consistently delivered measurable results.`;
  const extra = length === "long"
    ? (L ? `\n\nÎn rolurile anterioare am demonstrat capacitatea de a învăța rapid, de a colabora eficient și de a transforma cerințele în soluții concrete. Sunt entuziasmat/ă de oportunitatea de a aduce această energie la voi.`
         : `\n\nIn previous roles I've shown the ability to learn fast, collaborate effectively, and turn requirements into concrete solutions. I'm excited about the opportunity to bring that energy to your team.`)
    : "";
  const close = L
    ? `\n\nAș fi încântat/ă să discutăm cum pot contribui. Vă mulțumesc pentru timpul acordat.\n\nCu stimă,\n${name}`
    : `\n\nI'd welcome the chance to discuss how I can contribute. Thank you for your time and consideration.\n\nSincerely,\n${name}`;

  let letter = open + body + extra + close;
  if (length === "short") letter = open + body + close;
  return { letter, used: kws };
}

// ---- UI -----------------------------------------------------

export default function CoverForge() {
  const [lang, setLang] = useState("ro");
  const [view, setView] = useState("input"); // input|loading|result|error
  const [cv, setCv] = useState("");
  const [job, setJob] = useState("");
  const [tab, setTab] = useState("cv");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [step, setStep] = useState(0);
  const [letter, setLetter] = useState("");
  const [used, setUsed] = useState([]);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const [hist_, setHist_] = useState([]);
  const [showHist, setShowHist] = useState(false);
  useEffect(() => { store.load().then(setHist_); }, []);

  const t = T[lang];
  const live = inClaudeAI;
  const canRun = cv.trim().length > 20 && job.trim().length > 20;

  async function onPdf(f) {
    if (!f || f.type !== "application/pdf") return;
    try {
      const text = await extractPdfText(f);
      if (text) { setCv(text); setTab("cv"); }
    } catch (e) { console.warn(e); }
  }

  async function pushHistory(entry) {
    const item = { id: Date.now(), ts: new Date().toISOString(), lang, ...entry };
    const next = [item, ...hist_].slice(0, 30);
    setHist_(next); await store.save(next);
  }
  async function deleteHistory(id) { const next = hist_.filter((h) => h.id !== id); setHist_(next); await store.save(next); }
  async function clearHistory() { setHist_([]); await store.save([]); }

  async function generate() {
    if (!canRun) return;
    setView("loading"); setStep(0); setCopied(false);
    const timer = setInterval(() => setStep((s) => (s + 1) % t.loadingSteps.length), 1400);
    try {
      let out;
      if (live) {
        const langName = lang === "ro" ? "Romanian" : "English";
        const txt = await callClaude([{ type: "text", text:
          `Write a cover letter in ${langName}. Tone: ${tone}. Length: ${length}. Tailor it to the job using real points from the CV. Output ONLY the letter text, no preamble.\n\nCV:\n${cv}\n\nJOB:\n${job}` }], 1200);
        out = { letter: txt, used: [] };
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        out = localCoverLetter(cv, job, tone, length, lang);
      }
      setLetter(out.letter); setUsed(out.used || []);
      setView("result");
      pushHistory({ letter: out.letter, tone, length, preview: out.letter.slice(0, 90) });
    } catch (e) { console.error(e); setView("error"); }
    finally { clearInterval(timer); }
  }

  function copyLetter() {
    navigator.clipboard?.writeText(letter).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  }
  function reset() { setView("input"); setLetter(""); setCv(""); setJob(""); setUsed([]); }
  function openHistory(item) { setLetter(item.letter); setUsed([]); setShowHist(false); setView("result"); }

  return (
    <div className="cf-root" data-lang={lang}>
      <style>{CSS}</style>
      <div className="cf-grid" />
      <div className="cf-glow cf-glow-a" />
      <div className="cf-glow cf-glow-b" />

      <header className="cf-header">
        <div className="cf-brand"><span className="cf-logo">✎</span>
          <div><h1>{t.brand}</h1><p>{t.tagline}</p></div>
        </div>
        <div className="cf-hr">
          <span className={`cf-pill ${live ? "live" : "local"}`}>{live ? "● LIVE AI" : "● LOCAL"}</span>
          <button className="cf-lang" onClick={() => setShowHist(true)}>⧉ {t.history}{hist_.length > 0 && <span className="cf-badge">{hist_.length}</span>}</button>
          <button className="cf-lang" onClick={() => setLang((l) => (l === "ro" ? "en" : "ro"))}>{lang === "ro" ? "EN" : "RO"}</button>
        </div>
      </header>

      <main className="cf-main">
        {view === "input" && (
          <section className="cf-fade">
            <p className="cf-intro">{t.intro}</p>
            <div className="cf-panel">
              <div className="cf-tabs">
                <button className={tab === "cv" ? "on" : ""} onClick={() => setTab("cv")}>{t.cvTab}</button>
                <button className={tab === "job" ? "on" : ""} onClick={() => setTab("job")}>{t.jobTab}</button>
              </div>
              {tab === "cv" ? (
                <>
                  <textarea className="cf-ta" rows={8} placeholder={t.cvPlaceholder} value={cv} onChange={(e) => setCv(e.target.value)} />
                  <input ref={inputRef} type="file" accept=".pdf" hidden onChange={(e) => onPdf(e.target.files?.[0])} />
                  <button className="cf-upload" onClick={() => inputRef.current?.click()}>⬆ {t.upload}</button>
                </>
              ) : (
                <textarea className="cf-ta" rows={8} placeholder={t.jobPlaceholder} value={job} onChange={(e) => setJob(e.target.value)} />
              )}

              <div className="cf-opts">
                <div>
                  <span className="cf-opt-lbl">{t.toneLabel}</span>
                  <div className="cf-chips">
                    {Object.keys(t.tones).map((k) => (
                      <button key={k} className={`cf-chip ${tone === k ? "on" : ""}`} onClick={() => setTone(k)}>{t.tones[k]}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="cf-opt-lbl">{t.lengthLabel}</span>
                  <div className="cf-chips">
                    {Object.keys(t.lengths).map((k) => (
                      <button key={k} className={`cf-chip ${length === k ? "on" : ""}`} onClick={() => setLength(k)}>{t.lengths[k]}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button className="cf-run" disabled={!canRun} onClick={generate}>{t.generate} <span>→</span></button>
              {!canRun && (
                <>
                  <p className="cf-muted">{t.noInput}</p>
                  <button className="cf-demo" onClick={() => { setCv(DEMO_CV); setJob(DEMO_JOB); }}>{t.tryDemo}</button>
                </>
              )}
            </div>
          </section>
        )}

        {view === "loading" && (
          <section className="cf-loading">
            <div className="cf-pen"><div className="cf-pen-line" /></div>
            <p className="cf-step">{t.loadingSteps[step]}</p>
            <span className="cf-muted">{live ? t.poweredLive : t.poweredLocal}</span>
          </section>
        )}

        {view === "error" && (
          <section className="cf-error"><h2>{t.errorTitle}</h2><p>{t.errorBody}</p><button className="cf-run" onClick={reset}>{t.reset}</button></section>
        )}

        {view === "result" && (
          <section className="cf-fade">
            <div className="cf-letter-card">
              <div className="cf-letter-top">
                <span className="cf-eyebrow">{t.result}</span>
                <button className="cf-copy" onClick={copyLetter}>{copied ? t.copied : t.copy}</button>
              </div>
              <pre className="cf-letter">{letter}</pre>
            </div>
            {used.length > 0 && (
              <div className="cf-used">
                <span className="cf-eyebrow">{t.matchNote}</span>
                <div className="cf-chips">{used.map((u, i) => <span key={i} className="cf-chip on">{u}</span>)}</div>
              </div>
            )}
            <div className="cf-actions">
              <button className="cf-ghost" onClick={() => { setView("input"); }}>{t.regen}</button>
              <button className="cf-ghost" onClick={reset}>↺ {t.reset}</button>
            </div>
          </section>
        )}
      </main>

      <div className={`cf-ov ${showHist ? "open" : ""}`} onClick={() => setShowHist(false)} />
      <aside className={`cf-drawer ${showHist ? "open" : ""}`}>
        <div className="cf-drawer-top"><span className="cf-eyebrow" style={{ margin: 0 }}>{t.history}</span><button className="cf-close" onClick={() => setShowHist(false)}>✕</button></div>
        {hist_.length === 0 ? <p className="cf-muted">{t.historyEmpty}</p> : (
          <>
            <div className="cf-hist-list">
              {hist_.map((h) => (
                <div key={h.id} className="cf-hist-item">
                  <span className="cf-hist-tone">{T[h.lang || lang]?.tones?.[h.tone] || h.tone}</span>
                  <p className="cf-hist-prev">{h.preview}…</p>
                  <span className="cf-hist-date">{new Date(h.ts).toLocaleDateString()}</span>
                  <div className="cf-hist-act"><button onClick={() => openHistory(h)}>{t.open}</button><button className="del" onClick={() => deleteHistory(h.id)}>{t.del}</button></div>
                </div>
              ))}
            </div>
            <button className="cf-clear" onClick={clearHistory}>{t.clearAll}</button>
            <p className="cf-muted" style={{ fontSize: ".72rem" }}>{t.savedNote}</p>
          </>
        )}
      </aside>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap');
.cf-root{--bg:#0a0805;--panel:rgba(28,22,14,0.72);--line:rgba(255,209,102,0.16);--txt:#f5efe6;--mut:#a89a82;--am:#ffd166;--am2:#ff9e3d;position:relative;min-height:100vh;background:var(--bg);color:var(--txt);font-family:'Outfit',sans-serif;overflow-x:hidden;padding-bottom:80px;}
.cf-root *{box-sizing:border-box;}
.cf-grid{position:fixed;inset:0;background-image:linear-gradient(rgba(255,209,102,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,209,102,.03) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000,transparent);pointer-events:none;}
.cf-glow{position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;}
.cf-glow-a{width:520px;height:520px;background:#ff9e3d;top:-180px;right:-120px;opacity:.28;}
.cf-glow-b{width:460px;height:460px;background:#b5651d;bottom:-160px;left:-140px;opacity:.25;}
.cf-header{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:26px clamp(20px,5vw,64px);}
.cf-brand{display:flex;gap:14px;align-items:center;}
.cf-logo{font-size:1.7rem;color:var(--am);filter:drop-shadow(0 0 10px var(--am));}
.cf-brand h1{margin:0;font-family:'Fraunces',serif;font-weight:900;font-size:1.45rem;letter-spacing:.04em;}
.cf-brand p{margin:0;font-size:.78rem;color:var(--mut);}
.cf-hr{display:flex;align-items:center;gap:12px;}
.cf-pill{font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.1em;padding:5px 10px;border-radius:8px;border:1px solid var(--line);}
.cf-pill.live{color:var(--am);border-color:rgba(255,209,102,.4);}
.cf-pill.local{color:var(--mut);}
.cf-lang{background:transparent;border:1px solid var(--line);color:var(--am);font-family:'JetBrains Mono',monospace;font-size:.8rem;padding:8px 14px;border-radius:10px;cursor:pointer;transition:.25s;}
.cf-lang:hover{background:rgba(255,209,102,.08);}
.cf-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;margin-left:6px;background:var(--am);color:#2a1d05;border-radius:9px;font-size:.68rem;font-weight:700;}
.cf-main{position:relative;z-index:2;max-width:760px;margin:0 auto;padding:0 clamp(20px,5vw,40px);}
.cf-fade{animation:rise .5s ease both;}
.cf-intro{font-size:clamp(1.05rem,2.4vw,1.3rem);line-height:1.5;max-width:600px;margin:24px 0 28px;font-weight:300;}
.cf-intro::first-line{color:var(--am);}
.cf-panel{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,.4);}
.cf-tabs{display:flex;gap:6px;margin-bottom:16px;background:rgba(0,0,0,.3);padding:5px;border-radius:12px;width:fit-content;}
.cf-tabs button{background:transparent;border:none;color:var(--mut);padding:8px 18px;border-radius:8px;cursor:pointer;font-family:'Outfit';font-size:.9rem;transition:.2s;}
.cf-tabs button.on{background:rgba(255,209,102,.14);color:var(--am);}
.cf-ta{width:100%;background:rgba(0,0,0,.28);border:1px solid var(--line);border-radius:14px;color:var(--txt);padding:16px;font-family:'Outfit';font-size:.95rem;resize:vertical;line-height:1.5;}
.cf-ta:focus{outline:none;border-color:var(--am);}
.cf-ta::placeholder{color:var(--mut);}
.cf-upload{margin-top:10px;background:transparent;border:1px dashed var(--line);color:var(--am);padding:9px 16px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;transition:.2s;}
.cf-upload:hover{background:rgba(255,209,102,.06);}
.cf-opts{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px;}
.cf-opt-lbl{display:block;font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:9px;}
.cf-chips{display:flex;flex-wrap:wrap;gap:7px;}
.cf-chip{background:rgba(0,0,0,.25);border:1px solid var(--line);color:var(--mut);padding:6px 13px;border-radius:9px;cursor:pointer;font-family:'Outfit';font-size:.82rem;transition:.2s;}
.cf-chip.on{background:rgba(255,209,102,.14);color:var(--am);border-color:rgba(255,209,102,.4);}
.cf-run{width:100%;margin-top:22px;background:linear-gradient(95deg,var(--am),var(--am2));color:#2a1d05;border:none;padding:16px;border-radius:14px;font-family:'Outfit';font-weight:600;font-size:1.02rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:.25s;}
.cf-run:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 30px rgba(255,209,102,.3);}
.cf-run:disabled{opacity:.35;cursor:not-allowed;}
.cf-run:hover:not(:disabled) span{transform:translateX(4px);}
.cf-muted{text-align:center;color:var(--mut);font-size:.82rem;margin:10px 0 0;}
.cf-demo{display:block;margin:12px auto 0;background:transparent;border:1px dashed var(--line);color:var(--am);padding:9px 18px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;transition:.2s;}
.cf-demo:hover{background:rgba(255,209,102,.06);}
.cf-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:48vh;gap:22px;animation:rise .4s ease both;}
.cf-pen{position:relative;width:130px;height:90px;border:1.5px solid var(--line);border-radius:8px;background:rgba(255,209,102,.03);overflow:hidden;}
.cf-pen-line{position:absolute;left:16px;top:20px;height:7px;width:60%;background:rgba(255,209,102,.2);border-radius:4px;box-shadow:0 16px 0 rgba(255,209,102,.2),0 32px 0 rgba(255,209,102,.14);animation:write 1.6s ease-in-out infinite;}
.cf-step{font-family:'JetBrains Mono',monospace;color:var(--am);font-size:.92rem;}
.cf-error{text-align:center;padding:60px 20px;}
.cf-error h2{font-family:'Fraunces',serif;color:var(--am2);}
.cf-error p{color:var(--mut);margin-bottom:24px;}
.cf-letter-card{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:18px;padding:24px;margin-top:14px;animation:rise .5s ease both;}
.cf-letter-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
.cf-eyebrow{display:block;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mut);}
.cf-copy{background:rgba(255,209,102,.12);border:1px solid rgba(255,209,102,.3);color:var(--am);padding:8px 16px;border-radius:10px;cursor:pointer;font-family:'Outfit';font-size:.85rem;transition:.2s;}
.cf-copy:hover{background:rgba(255,209,102,.2);}
.cf-letter{white-space:pre-wrap;font-family:'Outfit';font-size:.96rem;line-height:1.7;color:var(--txt);margin:0;}
.cf-used{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:20px;margin-top:16px;}
.cf-used .cf-eyebrow{margin-bottom:12px;}
.cf-actions{display:flex;gap:12px;margin-top:18px;}
.cf-ghost{flex:1;background:transparent;border:1px solid var(--line);color:var(--mut);padding:13px;border-radius:12px;cursor:pointer;font-family:'Outfit';transition:.2s;}
.cf-ghost:hover{border-color:var(--am);color:var(--am);}
.cf-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:.3s;z-index:9;}
.cf-ov.open{opacity:1;pointer-events:auto;}
.cf-drawer{position:fixed;top:0;right:0;height:100%;width:min(380px,90vw);background:#0f0b06;border-left:1px solid var(--line);box-shadow:-20px 0 60px rgba(0,0,0,.5);transform:translateX(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1);z-index:10;padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;}
.cf-drawer.open{transform:translateX(0);}
.cf-drawer-top{display:flex;justify-content:space-between;align-items:center;}
.cf-close{background:transparent;border:1px solid var(--line);color:var(--mut);width:32px;height:32px;border-radius:9px;cursor:pointer;}
.cf-close:hover{color:var(--am);border-color:var(--am);}
.cf-hist-list{display:flex;flex-direction:column;gap:12px;}
.cf-hist-item{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;}
.cf-hist-tone{font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:7px;background:rgba(255,209,102,.1);color:var(--am);}
.cf-hist-prev{font-size:.84rem;color:var(--txt);line-height:1.4;margin:8px 0 6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cf-hist-date{font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--mut);}
.cf-hist-act{display:flex;gap:8px;margin-top:10px;}
.cf-hist-act button{flex:1;background:rgba(255,209,102,.08);border:1px solid var(--line);color:var(--am);padding:7px;border-radius:9px;cursor:pointer;font-family:'Outfit';font-size:.8rem;transition:.2s;}
.cf-hist-act button.del{background:transparent;color:#ff8a8a;border-color:rgba(255,138,138,.3);}
.cf-clear{background:transparent;border:1px solid rgba(255,138,138,.3);color:#ff8a8a;padding:10px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;}
@keyframes write{0%,100%{opacity:.4;}50%{opacity:1;}}
@keyframes rise{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
@media(max-width:600px){.cf-opts{grid-template-columns:1fr;}.cf-actions{flex-direction:column;}}
`;
