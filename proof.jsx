import React, { useState, useEffect } from "react";

// ============================================================
// PROOF — AI Portfolio Project Reviewer
// Career Toolkit suite. Same architecture. Accent: blue/violet.
// ============================================================

const API_HOST = "https://api.anthropic.com/v1/messages";
const inClaudeAI = typeof window !== "undefined" && /claude\.ai|anthropic/.test(window.location?.hostname || "");

const T = {
  ro: {
    brand: "PROOF", tagline: "Reviewer de proiecte de portofoliu cu AI",
    intro: "Descrie un proiect (ce e, ce tehnologii, ce ai rezolvat). Primești un scor, feedback structurat și o descriere îmbunătățită pentru portofoliu.",
    placeholder: "Descrie proiectul: nume, scop, tehnologii, provocări, rezultat…",
    titleLabel: "Nume proiect", titlePh: "ex: ARCADE-OPS: Excel Quest",
    generate: "Evaluează proiectul", generating: "Se evaluează…",
    steps: ["Se citește proiectul…", "Se evaluează execuția…", "Se scrie feedback-ul…"],
    score: "Scor proiect", verdict: "Verdict",
    cats: { concept: "Concept & originalitate", execution: "Execuție tehnică", presentation: "Prezentare", impact: "Impact / utilitate" },
    feedback: "Feedback", improve: "De îmbunătățit", rewrite: "Descriere îmbunătățită",
    copy: "Copiază", copied: "Copiat!", reset: "Începe din nou", noInput: "Descrie proiectul.",
    tryDemo: "Încearcă cu un proiect demo",
    history: "Istoric", historyEmpty: "Nimic salvat încă.", open: "Deschide", del: "Șterge", clearAll: "Șterge tot",
    savedNote: "Salvat automat pe acest dispozitiv", poweredLive: "Analiză live prin Claude", poweredLocal: "Motor local · fără cost",
    errorTitle: "Ceva n-a mers", errorBody: "Încearcă din nou.",
  },
  en: {
    brand: "PROOF", tagline: "AI portfolio project reviewer",
    intro: "Describe a project (what it is, the tech, what you solved). Get a score, structured feedback, and an improved portfolio description.",
    placeholder: "Describe the project: name, purpose, tech, challenges, outcome…",
    titleLabel: "Project name", titlePh: "e.g. ARCADE-OPS: Excel Quest",
    generate: "Review project", generating: "Reviewing…",
    steps: ["Reading the project…", "Assessing execution…", "Writing feedback…"],
    score: "Project score", verdict: "Verdict",
    cats: { concept: "Concept & originality", execution: "Technical execution", presentation: "Presentation", impact: "Impact / usefulness" },
    feedback: "Feedback", improve: "To improve", rewrite: "Improved description",
    copy: "Copy", copied: "Copied!", reset: "Start over", noInput: "Describe the project.",
    tryDemo: "Try with a demo project",
    history: "History", historyEmpty: "Nothing saved yet.", open: "Open", del: "Delete", clearAll: "Clear all",
    savedNote: "Auto-saved on this device", poweredLive: "Live analysis via Claude", poweredLocal: "Local engine · no cost",
    errorTitle: "Something went wrong", errorBody: "Try again.",
  },
};

const DEMO = { title: "ARCADE-OPS: Excel Quest", desc: "A gamified single-file HTML/CSS/JS learning app (8800+ lines) teaching Excel through puzzles, triage tasks and boss battles. Neon arcade aesthetic, Web Audio sound, 33 achievements, daily challenges, story mode, an AI Scout leaderboard, and a bilingual RO/EN toggle. Documented with about.html, case-study.html and 12 screenshots." };

const CATS = ["concept", "execution", "presentation", "impact"];

const HKEY = "proof:history";
let _mem = [];
const store = {
  async load() {
    try { if (window.storage?.get) { const r = await window.storage.get(HKEY); return r?.value ? JSON.parse(r.value) : []; } } catch (e) {}
    try { if (typeof localStorage !== "undefined") { const raw = localStorage.getItem(HKEY); return raw ? JSON.parse(raw) : []; } } catch (e) {}
    return [..._mem];
  },
  async save(list) {
    const j = JSON.stringify(list); _mem = list;
    try { if (window.storage?.set) { await window.storage.set(HKEY, j); return; } } catch (e) {}
    try { if (typeof localStorage !== "undefined") localStorage.setItem(HKEY, j); } catch (e) {}
  },
};

async function callClaude(content, maxTokens = 1100) {
  const resp = await fetch(API_HOST, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, messages: [{ role: "user", content }] }) });
  const data = await resp.json();
  const raw = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

function clamp(n) { const v = Math.round(Number(n) || 0); return Math.max(0, Math.min(100, v)); }
function scoreColor(n) { if (n >= 80) return "#7af0ff"; if (n >= 60) return "#8d8dff"; if (n >= 40) return "#ffd166"; return "#ff6b9d"; }

function localReview(title, desc, lang) {
  const L = lang === "ro";
  const t = desc.toLowerCase();
  const techWords = ["react", "vite", "tailwind", "javascript", "html", "css", "api", "canvas", "web audio", "pwa"];
  const tech = techWords.filter((w) => t.includes(w)).length;
  const hasNumbers = (desc.match(/\d/g) || []).length;
  const len = desc.split(/\s+/).length;
  const concept = clamp(50 + (t.includes("gamif") || t.includes("neon") || t.includes("ai") ? 25 : 10) + Math.min(15, tech * 3));
  const execution = clamp(40 + tech * 6 + (hasNumbers > 2 ? 12 : 0));
  const presentation = clamp(35 + (t.includes("screenshot") || t.includes("case") || t.includes("about") ? 30 : 0) + Math.min(15, len / 12));
  const impact = clamp(45 + hasNumbers * 4 + (t.includes("user") || t.includes("bilingual") || t.includes("ro/en") ? 15 : 0));
  const overall = clamp((concept + execution + presentation + impact) / 4);
  return {
    overall,
    verdict: L ? (overall >= 75 ? "Proiect puternic de portofoliu — bine documentat și ambițios." : "Solid, dar prezentarea și cifrele l-ar ridica.") : (overall >= 75 ? "Strong portfolio piece — well documented and ambitious." : "Solid, but presentation and metrics would lift it."),
    categories: { concept: { score: concept }, execution: { score: execution }, presentation: { score: presentation }, impact: { score: impact } },
    feedback: L ? "Concept ambițios cu execuție tehnică vizibilă. Punctele forte: scope și polish. Adaugă metrici concrete (utilizatori, linii, timp) ca să cuantifici impactul." : "Ambitious concept with visible technical execution. Strengths: scope and polish. Add concrete metrics (users, lines, time) to quantify impact.",
    improve: L ? ["Adaugă cifre măsurabile în descriere.", "Include un GIF/demo scurt, nu doar screenshot-uri.", "Începe descrierea cu problema rezolvată, nu cu tehnologia."] : ["Add measurable numbers to the description.", "Include a short GIF/demo, not just screenshots.", "Lead with the problem solved, not the tech stack."],
    rewrite: L ? `${title} — o aplicație ${t.includes("gamif") ? "gamificată" : "interactivă"} care transformă [problema] în [rezultat]. Construită cu ${techWords.filter((w) => t.includes(w)).slice(0, 3).join(", ") || "tehnologii moderne"}, livrează [impact măsurabil] printr-o experiență [calitate].` : `${title} — a ${t.includes("gamif") ? "gamified" : "interactive"} app that turns [problem] into [result]. Built with ${techWords.filter((w) => t.includes(w)).slice(0, 3).join(", ") || "modern tech"}, it delivers [measurable impact] through a [quality] experience.`,
  };
}

function Ring({ value, size = 120 }) {
  const r = (size - 14) / 2, c = 2 * Math.PI * r, off = c - (value / 100) * c, col = scoreColor(value);
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)", filter: `drop-shadow(0 0 8px ${col}88)` }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill={col} style={{ font: "700 1.9rem 'JetBrains Mono', monospace" }}>{value}</text>
    </svg>
  );
}

export default function Proof() {
  const [lang, setLang] = useState("ro");
  const [view, setView] = useState("input");
  const [title, setTitle] = useState(""); const [desc, setDesc] = useState("");
  const [step, setStep] = useState(0); const [result, setResult] = useState(null); const [copied, setCopied] = useState(false);
  const [hist_, setHist_] = useState([]); const [showHist, setShowHist] = useState(false);
  useEffect(() => { store.load().then(setHist_); }, []);

  const t = T[lang]; const live = inClaudeAI;
  const canRun = desc.trim().length > 25;

  async function pushHistory(entry) { const item = { id: Date.now(), ts: new Date().toISOString(), lang, ...entry }; const next = [item, ...hist_].slice(0, 30); setHist_(next); await store.save(next); }
  async function deleteHistory(id) { const n = hist_.filter((h) => h.id !== id); setHist_(n); await store.save(n); }
  async function clearHistory() { setHist_([]); await store.save([]); }

  async function generate() {
    if (!canRun) return;
    setView("loading"); setStep(0); setCopied(false);
    const timer = setInterval(() => setStep((s) => (s + 1) % t.steps.length), 1300);
    try {
      let out;
      if (live) {
        const langName = lang === "ro" ? "Romanian" : "English";
        out = await callClaude([{ type: "text", text:
          `You are a portfolio reviewer. Write in ${langName}. Review this project. Respond with ONLY JSON: {"overall":<0-100>,"verdict":"...","categories":{"concept":{"score":<0-100>},"execution":{"score":<0-100>},"presentation":{"score":<0-100>},"impact":{"score":<0-100>}},"feedback":"...","improve":["..","..",".."],"rewrite":"<improved portfolio description>"}\n\nTitle: ${title}\nProject: ${desc}` }], 1100);
      } else { await new Promise((r) => setTimeout(r, 1200)); out = localReview(title || "Project", desc, lang); }
      setResult(out); setView("result");
      pushHistory({ title: title || "Project", result: out, overall: clamp(out.overall), preview: title || desc.slice(0, 60) });
    } catch (e) { console.error(e); setView("error"); }
    finally { clearInterval(timer); }
  }

  function copyRewrite() { navigator.clipboard?.writeText(result?.rewrite || "").then(() => { setCopied(true); setTimeout(() => setCopied(false), 1700); }); }
  function reset() { setView("input"); setResult(null); setTitle(""); setDesc(""); }
  function openHistory(item) { setResult(item.result); setShowHist(false); setView("result"); }

  return (
    <div className="pf-root" data-lang={lang}>
      <style>{CSS}</style>
      <div className="pf-grid" /><div className="pf-glow pf-glow-a" /><div className="pf-glow pf-glow-b" />
      <header className="pf-header">
        <div className="pf-brand"><span className="pf-logo">◆</span><div><h1>{t.brand}</h1><p>{t.tagline}</p></div></div>
        <div className="pf-hr">
          <span className={`pf-pill ${live ? "live" : "local"}`}>{live ? "● LIVE AI" : "● LOCAL"}</span>
          <button className="pf-lang" onClick={() => setShowHist(true)}>⧉ {t.history}{hist_.length > 0 && <span className="pf-badge">{hist_.length}</span>}</button>
          <button className="pf-lang" onClick={() => setLang((l) => (l === "ro" ? "en" : "ro"))}>{lang === "ro" ? "EN" : "RO"}</button>
        </div>
      </header>

      <main className="pf-main">
        {view === "input" && (
          <section className="pf-fade">
            <p className="pf-intro">{t.intro}</p>
            <div className="pf-panel">
              <label className="pf-field"><span>{t.titleLabel}</span><input className="pf-in" placeholder={t.titlePh} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
              <textarea className="pf-ta" rows={8} placeholder={t.placeholder} value={desc} onChange={(e) => setDesc(e.target.value)} />
              <button className="pf-run" disabled={!canRun} onClick={generate}>{t.generate} <span>→</span></button>
              {!canRun && (<><p className="pf-muted">{t.noInput}</p><button className="pf-demo" onClick={() => { setTitle(DEMO.title); setDesc(DEMO.desc); }}>{t.tryDemo}</button></>)}
            </div>
          </section>
        )}

        {view === "loading" && (<section className="pf-loading"><div className="pf-diamond" /><p className="pf-step">{t.steps[step]}</p><span className="pf-muted">{live ? t.poweredLive : t.poweredLocal}</span></section>)}
        {view === "error" && (<section className="pf-error"><h2>{t.errorTitle}</h2><p>{t.errorBody}</p><button className="pf-run" onClick={reset}>{t.reset}</button></section>)}

        {view === "result" && result && (
          <section className="pf-fade">
            <div className="pf-overall">
              <Ring value={clamp(result.overall)} />
              <div><span className="pf-eyebrow">{t.score}</span><p className="pf-verdict">{result.verdict}</p></div>
            </div>
            <div className="pf-card">
              <span className="pf-eyebrow">{t.feedback}</span>
              <div className="pf-bars">
                {CATS.map((k) => result.categories?.[k] ? (
                  <div key={k} className="pf-bar">
                    <div className="pf-bar-h"><span>{t.cats[k]}</span><span style={{ color: scoreColor(clamp(result.categories[k].score)), fontFamily: "'JetBrains Mono',monospace" }}>{clamp(result.categories[k].score)}</span></div>
                    <div className="pf-track"><div className="pf-fill" style={{ width: `${clamp(result.categories[k].score)}%`, background: scoreColor(clamp(result.categories[k].score)) }} /></div>
                  </div>
                ) : null)}
              </div>
              <p className="pf-body">{result.feedback}</p>
            </div>
            {result.improve?.length > 0 && (
              <div className="pf-card"><span className="pf-eyebrow">{t.improve}</span><ul className="pf-list">{result.improve.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
            )}
            <div className="pf-card">
              <div className="pf-card-top"><span className="pf-eyebrow">{t.rewrite}</span><button className="pf-copy" onClick={copyRewrite}>{copied ? t.copied : t.copy}</button></div>
              <p className="pf-body">{result.rewrite}</p>
            </div>
            <button className="pf-ghost" onClick={reset}>↺ {t.reset}</button>
          </section>
        )}
      </main>

      <div className={`pf-ov ${showHist ? "open" : ""}`} onClick={() => setShowHist(false)} />
      <aside className={`pf-drawer ${showHist ? "open" : ""}`}>
        <div className="pf-drawer-top"><span className="pf-eyebrow" style={{ margin: 0 }}>{t.history}</span><button className="pf-close" onClick={() => setShowHist(false)}>✕</button></div>
        {hist_.length === 0 ? <p className="pf-muted">{t.historyEmpty}</p> : (
          <>
            <div className="pf-hist-list">
              {hist_.map((h) => (
                <div key={h.id} className="pf-hist-item">
                  <div className="pf-hist-meta"><span className="pf-hist-prev">{h.preview}</span><span className="pf-hist-score" style={{ color: scoreColor(h.overall) }}>{h.overall}</span></div>
                  <span className="pf-hist-date">{new Date(h.ts).toLocaleDateString()}</span>
                  <div className="pf-hist-act"><button onClick={() => openHistory(h)}>{t.open}</button><button className="del" onClick={() => deleteHistory(h.id)}>{t.del}</button></div>
                </div>
              ))}
            </div>
            <button className="pf-clear" onClick={clearHistory}>{t.clearAll}</button>
            <p className="pf-muted" style={{ fontSize: ".72rem" }}>{t.savedNote}</p>
          </>
        )}
      </aside>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap');
.pf-root{--bg:#06070f;--panel:rgba(16,18,32,0.72);--line:rgba(141,141,255,0.18);--txt:#e8e9f5;--mut:#888aa8;--bl:#8d8dff;--bl2:#6c7aff;position:relative;min-height:100vh;background:var(--bg);color:var(--txt);font-family:'Outfit',sans-serif;overflow-x:hidden;padding-bottom:80px;}
.pf-root *{box-sizing:border-box;}
.pf-grid{position:fixed;inset:0;background-image:linear-gradient(rgba(141,141,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(141,141,255,.03) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000,transparent);pointer-events:none;}
.pf-glow{position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;}
.pf-glow-a{width:520px;height:520px;background:#6c7aff;top:-180px;right:-120px;opacity:.28;}
.pf-glow-b{width:460px;height:460px;background:#7af0ff;bottom:-160px;left:-140px;opacity:.16;}
.pf-header{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:26px clamp(20px,5vw,64px);}
.pf-brand{display:flex;gap:14px;align-items:center;}
.pf-logo{font-size:1.6rem;color:var(--bl);filter:drop-shadow(0 0 10px var(--bl));}
.pf-brand h1{margin:0;font-family:'Fraunces',serif;font-weight:900;font-size:1.45rem;letter-spacing:.04em;}
.pf-brand p{margin:0;font-size:.78rem;color:var(--mut);}
.pf-hr{display:flex;align-items:center;gap:12px;}
.pf-pill{font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.1em;padding:5px 10px;border-radius:8px;border:1px solid var(--line);}
.pf-pill.live{color:var(--bl);border-color:rgba(141,141,255,.4);}.pf-pill.local{color:var(--mut);}
.pf-lang{background:transparent;border:1px solid var(--line);color:var(--bl);font-family:'JetBrains Mono',monospace;font-size:.8rem;padding:8px 14px;border-radius:10px;cursor:pointer;transition:.25s;}
.pf-lang:hover{background:rgba(141,141,255,.08);}
.pf-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;margin-left:6px;background:var(--bl);color:#0a0a1f;border-radius:9px;font-size:.68rem;font-weight:700;}
.pf-main{position:relative;z-index:2;max-width:760px;margin:0 auto;padding:0 clamp(20px,5vw,40px);}
.pf-fade{animation:rise .5s ease both;}
.pf-intro{font-size:clamp(1.05rem,2.4vw,1.3rem);line-height:1.5;max-width:600px;margin:24px 0 28px;font-weight:300;}
.pf-intro::first-line{color:var(--bl);}
.pf-panel{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,.4);}
.pf-field{display:block;margin-bottom:14px;}
.pf-field span{display:block;font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);margin-bottom:7px;}
.pf-in{width:100%;background:rgba(0,0,0,.28);border:1px solid var(--line);border-radius:12px;color:var(--txt);padding:13px 15px;font-family:'Outfit';font-size:.94rem;}
.pf-in:focus{outline:none;border-color:var(--bl);}
.pf-in::placeholder{color:var(--mut);}
.pf-ta{width:100%;background:rgba(0,0,0,.28);border:1px solid var(--line);border-radius:14px;color:var(--txt);padding:16px;font-family:'Outfit';font-size:.95rem;resize:vertical;line-height:1.5;}
.pf-ta:focus{outline:none;border-color:var(--bl);}
.pf-ta::placeholder{color:var(--mut);}
.pf-run{width:100%;margin-top:8px;background:linear-gradient(95deg,var(--bl),var(--bl2));color:#0a0a1f;border:none;padding:16px;border-radius:14px;font-family:'Outfit';font-weight:600;font-size:1.02rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:.25s;}
.pf-run:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 30px rgba(141,141,255,.3);}
.pf-run:disabled{opacity:.35;cursor:not-allowed;}
.pf-run:hover:not(:disabled) span{transform:translateX(4px);}
.pf-muted{text-align:center;color:var(--mut);font-size:.82rem;margin:10px 0 0;}
.pf-demo{display:block;margin:12px auto 0;background:transparent;border:1px dashed var(--line);color:var(--bl);padding:9px 18px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;}
.pf-demo:hover{background:rgba(141,141,255,.06);}
.pf-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:48vh;gap:22px;animation:rise .4s ease both;}
.pf-diamond{width:70px;height:70px;background:linear-gradient(135deg,var(--bl),var(--bl2));transform:rotate(45deg);box-shadow:0 0 36px rgba(141,141,255,.5);animation:spin 2s linear infinite;}
.pf-step{font-family:'JetBrains Mono',monospace;color:var(--bl);font-size:.92rem;}
.pf-error{text-align:center;padding:60px 20px;}
.pf-error h2{font-family:'Fraunces',serif;color:var(--bl2);}
.pf-error p{color:var(--mut);margin-bottom:24px;}
.pf-overall{display:flex;align-items:center;gap:24px;flex-wrap:wrap;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:24px;margin:14px 0;animation:rise .4s ease both;}
.pf-overall>div{flex:1;min-width:200px;}
.pf-verdict{font-family:'Fraunces',serif;font-size:clamp(1.15rem,2.6vw,1.45rem);line-height:1.35;font-weight:600;margin:8px 0 0;}
.pf-card{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:18px;padding:22px;margin-bottom:14px;}
.pf-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.pf-eyebrow{display:block;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mut);margin-bottom:14px;}
.pf-card-top .pf-eyebrow{margin:0;}
.pf-bars{display:flex;flex-direction:column;gap:14px;margin-bottom:16px;}
.pf-bar-h{display:flex;justify-content:space-between;font-size:.9rem;margin-bottom:6px;}
.pf-track{height:6px;background:rgba(255,255,255,.06);border-radius:5px;overflow:hidden;}
.pf-fill{height:100%;border-radius:5px;transition:width 1s cubic-bezier(.2,.8,.2,1);}
.pf-body{font-size:.95rem;line-height:1.6;margin:0;color:var(--txt);}
.pf-list{margin:0;padding-left:18px;}
.pf-list li{font-size:.9rem;line-height:1.5;margin-bottom:8px;color:var(--txt);}
.pf-list li::marker{color:var(--bl);}
.pf-copy{background:rgba(141,141,255,.12);border:1px solid rgba(141,141,255,.3);color:var(--bl);padding:7px 14px;border-radius:10px;cursor:pointer;font-family:'Outfit';font-size:.82rem;transition:.2s;}
.pf-copy:hover{background:rgba(141,141,255,.2);}
.pf-ghost{width:100%;background:transparent;border:1px solid var(--line);color:var(--mut);padding:13px;border-radius:12px;cursor:pointer;font-family:'Outfit';transition:.2s;}
.pf-ghost:hover{border-color:var(--bl);color:var(--bl);}
.pf-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:.3s;z-index:9;}
.pf-ov.open{opacity:1;pointer-events:auto;}
.pf-drawer{position:fixed;top:0;right:0;height:100%;width:min(380px,90vw);background:#0a0b16;border-left:1px solid var(--line);box-shadow:-20px 0 60px rgba(0,0,0,.5);transform:translateX(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1);z-index:10;padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;}
.pf-drawer.open{transform:translateX(0);}
.pf-drawer-top{display:flex;justify-content:space-between;align-items:center;}
.pf-close{background:transparent;border:1px solid var(--line);color:var(--mut);width:32px;height:32px;border-radius:9px;cursor:pointer;}
.pf-close:hover{color:var(--bl);border-color:var(--bl);}
.pf-hist-list{display:flex;flex-direction:column;gap:12px;}
.pf-hist-item{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;}
.pf-hist-meta{display:flex;justify-content:space-between;align-items:center;gap:10px;}
.pf-hist-prev{font-size:.84rem;color:var(--txt);line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.pf-hist-score{font-family:'JetBrains Mono',monospace;font-size:1.1rem;font-weight:700;}
.pf-hist-date{font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--mut);display:block;margin-top:6px;}
.pf-hist-act{display:flex;gap:8px;margin-top:10px;}
.pf-hist-act button{flex:1;background:rgba(141,141,255,.08);border:1px solid var(--line);color:var(--bl);padding:7px;border-radius:9px;cursor:pointer;font-family:'Outfit';font-size:.8rem;}
.pf-hist-act button.del{background:transparent;color:#ff8a8a;border-color:rgba(255,138,138,.3);}
.pf-clear{background:transparent;border:1px solid rgba(255,138,138,.3);color:#ff8a8a;padding:10px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;}
@keyframes spin{from{transform:rotate(45deg);}to{transform:rotate(405deg);}}
@keyframes rise{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
@media(max-width:600px){.pf-overall{justify-content:center;text-align:center;}}
`;
