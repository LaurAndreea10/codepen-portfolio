import React, { useState, useMemo, useEffect } from "react";

// ============================================================
// BIO LAB — AI LinkedIn / Bio Optimizer
// Career Toolkit suite. Same architecture. Accent: teal/cyan.
// ============================================================

const API_HOST = "https://api.anthropic.com/v1/messages";
const inClaudeAI = typeof window !== "undefined" && /claude\.ai|anthropic/.test(window.location?.hostname || "");

const T = {
  ro: {
    brand: "BIO LAB", tagline: "Optimizator de profil & headline cu AI",
    intro: "Spune-mi despre tine sau lipește bio-ul actual. Primești un headline magnetic și o secțiune \"Despre\" optimizată — în 3 variante de ton.",
    placeholder: "Descrie-te pe scurt: rol, experiență, ce te face diferit/ă…",
    roleLabel: "Platformă", platforms: { linkedin: "LinkedIn", twitter: "X / Twitter", portfolio: "Portofoliu", github: "GitHub" },
    generate: "Optimizează", generating: "Se optimizează…",
    steps: ["Se analizează profilul…", "Se găsesc punctele forte…", "Se scriu variantele…"],
    headline: "Headline", about: "Despre", variants: "Variante",
    tones: { punchy: "Direct", warm: "Cald", expert: "Expert" },
    copy: "Copiază", copied: "Copiat!", reset: "Începe din nou", noInput: "Scrie câteva cuvinte despre tine.",
    tryDemo: "Încearcă cu date demo",
    history: "Istoric", historyEmpty: "Nimic salvat încă.", open: "Deschide", del: "Șterge", clearAll: "Șterge tot",
    savedNote: "Salvat automat pe acest dispozitiv", poweredLive: "Generare live prin Claude", poweredLocal: "Motor local · fără cost",
    errorTitle: "Ceva n-a mers", errorBody: "Încearcă din nou.",
  },
  en: {
    brand: "BIO LAB", tagline: "AI profile & headline optimizer",
    intro: "Tell me about yourself or paste your current bio. Get a magnetic headline and an optimized \"About\" — in 3 tone variants.",
    placeholder: "Describe yourself briefly: role, experience, what makes you different…",
    roleLabel: "Platform", platforms: { linkedin: "LinkedIn", twitter: "X / Twitter", portfolio: "Portfolio", github: "GitHub" },
    generate: "Optimize", generating: "Optimizing…",
    steps: ["Analyzing the profile…", "Finding strengths…", "Writing variants…"],
    headline: "Headline", about: "About", variants: "Variants",
    tones: { punchy: "Punchy", warm: "Warm", expert: "Expert" },
    copy: "Copy", copied: "Copied!", reset: "Start over", noInput: "Write a few words about yourself.",
    tryDemo: "Try with demo data",
    history: "History", historyEmpty: "Nothing saved yet.", open: "Open", del: "Delete", clearAll: "Clear all",
    savedNote: "Auto-saved on this device", poweredLive: "Live generation via Claude", poweredLocal: "Local engine · no cost",
    errorTitle: "Something went wrong", errorBody: "Try again.",
  },
};

const DEMO_BIO = "Self-taught front-end developer with a CRM and digital marketing background. I build bilingual (RO/EN) web apps with a dark, editorial aesthetic — 60+ projects shipped on GitHub Pages. React, Vite, Tailwind. Certified by Google, freeCodeCamp, Anthropic.";

const HKEY = "biolab:history";
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

async function callClaude(content, maxTokens = 1000) {
  const resp = await fetch(API_HOST, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, messages: [{ role: "user", content }] }) });
  const data = await resp.json();
  const raw = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

function localOptimize(bio, platform, lang) {
  const L = lang === "ro";
  const role = (bio.match(/(developer|engineer|designer|manager|marketer|analyst|specialist)/i) || [, L ? "Profesionist" : "Professional"])[1];
  const mk = (tone) => {
    const heads = L ? {
      punchy: `${role} • Construiesc produse care contează`,
      warm: `${role} pasionat/ă de produse cu impact real`,
      expert: `${role} | Specializat/ă în interfețe performante & bilingve`,
    } : {
      punchy: `${role} • I build products that matter`,
      warm: `${role} passionate about real-impact products`,
      expert: `${role} | Specializing in high-performance, bilingual interfaces`,
    };
    const abouts = L ? {
      punchy: `Construiesc, livrez, repet. ${bio.split(".")[0]}. Hai să facem ceva care contează.`,
      warm: `Îmi place să transform idei în produse pe care oamenii chiar le folosesc. ${bio.split(".")[0]}. Mereu deschis/ă la colaborări.`,
      expert: `${bio.split(".")[0]}. Expertiză în arhitectură front-end, performanță și livrare bilingvă RO/EN, cu accent pe rezultate măsurabile.`,
    } : {
      punchy: `I build, ship, repeat. ${bio.split(".")[0]}. Let's make something that matters.`,
      warm: `I love turning ideas into products people actually use. ${bio.split(".")[0]}. Always open to collaborating.`,
      expert: `${bio.split(".")[0]}. Expertise in front-end architecture, performance, and bilingual RO/EN delivery, focused on measurable outcomes.`,
    };
    return { tone, headline: heads[tone], about: abouts[tone] };
  };
  return { variants: ["punchy", "warm", "expert"].map(mk) };
}

export default function BioLab() {
  const [lang, setLang] = useState("ro");
  const [view, setView] = useState("input");
  const [bio, setBio] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState("");
  const [hist_, setHist_] = useState([]);
  const [showHist, setShowHist] = useState(false);
  useEffect(() => { store.load().then(setHist_); }, []);

  const t = T[lang];
  const live = inClaudeAI;
  const canRun = bio.trim().length > 15;

  async function pushHistory(entry) {
    const item = { id: Date.now(), ts: new Date().toISOString(), lang, ...entry };
    const next = [item, ...hist_].slice(0, 30); setHist_(next); await store.save(next);
  }
  async function deleteHistory(id) { const n = hist_.filter((h) => h.id !== id); setHist_(n); await store.save(n); }
  async function clearHistory() { setHist_([]); await store.save([]); }

  async function generate() {
    if (!canRun) return;
    setView("loading"); setStep(0); setActive(0);
    const timer = setInterval(() => setStep((s) => (s + 1) % t.steps.length), 1300);
    try {
      let out;
      if (live) {
        const langName = lang === "ro" ? "Romanian" : "English";
        out = await callClaude([{ type: "text", text:
          `Optimize this person's ${platform} profile. Write in ${langName}. Provide 3 variants (punchy, warm, expert). Respond with ONLY JSON: {"variants":[{"tone":"punchy","headline":"...","about":"..."},{"tone":"warm",...},{"tone":"expert",...}]}\n\nProfile:\n${bio}` }], 1000);
      } else {
        await new Promise((r) => setTimeout(r, 1100));
        out = localOptimize(bio, platform, lang);
      }
      setResult(out); setView("result");
      pushHistory({ platform, result: out, preview: out.variants?.[0]?.headline || "" });
    } catch (e) { console.error(e); setView("error"); }
    finally { clearInterval(timer); }
  }

  function copyText(txt, key) { navigator.clipboard?.writeText(txt).then(() => { setCopied(key); setTimeout(() => setCopied(""), 1600); }); }
  function reset() { setView("input"); setResult(null); setBio(""); }
  function openHistory(item) { setResult(item.result); setActive(0); setShowHist(false); setView("result"); }

  const V = result?.variants?.[active];

  return (
    <div className="bl-root" data-lang={lang}>
      <style>{CSS}</style>
      <div className="bl-grid" /><div className="bl-glow bl-glow-a" /><div className="bl-glow bl-glow-b" />
      <header className="bl-header">
        <div className="bl-brand"><span className="bl-logo">◐</span><div><h1>{t.brand}</h1><p>{t.tagline}</p></div></div>
        <div className="bl-hr">
          <span className={`bl-pill ${live ? "live" : "local"}`}>{live ? "● LIVE AI" : "● LOCAL"}</span>
          <button className="bl-lang" onClick={() => setShowHist(true)}>⧉ {t.history}{hist_.length > 0 && <span className="bl-badge">{hist_.length}</span>}</button>
          <button className="bl-lang" onClick={() => setLang((l) => (l === "ro" ? "en" : "ro"))}>{lang === "ro" ? "EN" : "RO"}</button>
        </div>
      </header>

      <main className="bl-main">
        {view === "input" && (
          <section className="bl-fade">
            <p className="bl-intro">{t.intro}</p>
            <div className="bl-panel">
              <span className="bl-opt-lbl">{t.roleLabel}</span>
              <div className="bl-chips" style={{ marginBottom: 16 }}>
                {Object.keys(t.platforms).map((k) => (
                  <button key={k} className={`bl-chip ${platform === k ? "on" : ""}`} onClick={() => setPlatform(k)}>{t.platforms[k]}</button>
                ))}
              </div>
              <textarea className="bl-ta" rows={7} placeholder={t.placeholder} value={bio} onChange={(e) => setBio(e.target.value)} />
              <button className="bl-run" disabled={!canRun} onClick={generate}>{t.generate} <span>→</span></button>
              {!canRun && (<><p className="bl-muted">{t.noInput}</p><button className="bl-demo" onClick={() => setBio(DEMO_BIO)}>{t.tryDemo}</button></>)}
            </div>
          </section>
        )}

        {view === "loading" && (
          <section className="bl-loading"><div className="bl-orb" /><p className="bl-step">{t.steps[step]}</p><span className="bl-muted">{live ? t.poweredLive : t.poweredLocal}</span></section>
        )}

        {view === "error" && (<section className="bl-error"><h2>{t.errorTitle}</h2><p>{t.errorBody}</p><button className="bl-run" onClick={reset}>{t.reset}</button></section>)}

        {view === "result" && result && (
          <section className="bl-fade">
            <div className="bl-vtabs">
              {result.variants.map((v, i) => (
                <button key={i} className={active === i ? "on" : ""} onClick={() => setActive(i)}>{t.tones[v.tone] || v.tone}</button>
              ))}
            </div>
            {V && (
              <>
                <div className="bl-card">
                  <div className="bl-card-top"><span className="bl-eyebrow">{t.headline}</span><button className="bl-copy" onClick={() => copyText(V.headline, "h")}>{copied === "h" ? t.copied : t.copy}</button></div>
                  <p className="bl-headline">{V.headline}</p>
                </div>
                <div className="bl-card">
                  <div className="bl-card-top"><span className="bl-eyebrow">{t.about}</span><button className="bl-copy" onClick={() => copyText(V.about, "a")}>{copied === "a" ? t.copied : t.copy}</button></div>
                  <p className="bl-about">{V.about}</p>
                </div>
              </>
            )}
            <button className="bl-ghost" onClick={reset}>↺ {t.reset}</button>
          </section>
        )}
      </main>

      <div className={`bl-ov ${showHist ? "open" : ""}`} onClick={() => setShowHist(false)} />
      <aside className={`bl-drawer ${showHist ? "open" : ""}`}>
        <div className="bl-drawer-top"><span className="bl-eyebrow" style={{ margin: 0 }}>{t.history}</span><button className="bl-close" onClick={() => setShowHist(false)}>✕</button></div>
        {hist_.length === 0 ? <p className="bl-muted">{t.historyEmpty}</p> : (
          <>
            <div className="bl-hist-list">
              {hist_.map((h) => (
                <div key={h.id} className="bl-hist-item">
                  <span className="bl-hist-tag">{T[h.lang || lang]?.platforms?.[h.platform] || h.platform}</span>
                  <p className="bl-hist-prev">{h.preview}</p>
                  <span className="bl-hist-date">{new Date(h.ts).toLocaleDateString()}</span>
                  <div className="bl-hist-act"><button onClick={() => openHistory(h)}>{t.open}</button><button className="del" onClick={() => deleteHistory(h.id)}>{t.del}</button></div>
                </div>
              ))}
            </div>
            <button className="bl-clear" onClick={clearHistory}>{t.clearAll}</button>
            <p className="bl-muted" style={{ fontSize: ".72rem" }}>{t.savedNote}</p>
          </>
        )}
      </aside>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap');
.bl-root{--bg:#04100f;--panel:rgba(12,28,26,0.72);--line:rgba(54,241,205,0.16);--txt:#e6f5f1;--mut:#7da89e;--tl:#36f1cd;--tl2:#2bd6c0;position:relative;min-height:100vh;background:var(--bg);color:var(--txt);font-family:'Outfit',sans-serif;overflow-x:hidden;padding-bottom:80px;}
.bl-root *{box-sizing:border-box;}
.bl-grid{position:fixed;inset:0;background-image:linear-gradient(rgba(54,241,205,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(54,241,205,.03) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000,transparent);pointer-events:none;}
.bl-glow{position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;}
.bl-glow-a{width:520px;height:520px;background:#0fb6a0;top:-180px;right:-120px;opacity:.3;}
.bl-glow-b{width:460px;height:460px;background:#1b6cff;bottom:-160px;left:-140px;opacity:.18;}
.bl-header{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:26px clamp(20px,5vw,64px);}
.bl-brand{display:flex;gap:14px;align-items:center;}
.bl-logo{font-size:1.7rem;color:var(--tl);filter:drop-shadow(0 0 10px var(--tl));}
.bl-brand h1{margin:0;font-family:'Fraunces',serif;font-weight:900;font-size:1.45rem;letter-spacing:.04em;}
.bl-brand p{margin:0;font-size:.78rem;color:var(--mut);}
.bl-hr{display:flex;align-items:center;gap:12px;}
.bl-pill{font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.1em;padding:5px 10px;border-radius:8px;border:1px solid var(--line);}
.bl-pill.live{color:var(--tl);border-color:rgba(54,241,205,.4);}.bl-pill.local{color:var(--mut);}
.bl-lang{background:transparent;border:1px solid var(--line);color:var(--tl);font-family:'JetBrains Mono',monospace;font-size:.8rem;padding:8px 14px;border-radius:10px;cursor:pointer;transition:.25s;}
.bl-lang:hover{background:rgba(54,241,205,.08);}
.bl-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;margin-left:6px;background:var(--tl);color:#04221d;border-radius:9px;font-size:.68rem;font-weight:700;}
.bl-main{position:relative;z-index:2;max-width:720px;margin:0 auto;padding:0 clamp(20px,5vw,40px);}
.bl-fade{animation:rise .5s ease both;}
.bl-intro{font-size:clamp(1.05rem,2.4vw,1.3rem);line-height:1.5;max-width:600px;margin:24px 0 28px;font-weight:300;}
.bl-intro::first-line{color:var(--tl);}
.bl-panel{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,.4);}
.bl-opt-lbl{display:block;font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:9px;}
.bl-chips{display:flex;flex-wrap:wrap;gap:7px;}
.bl-chip{background:rgba(0,0,0,.25);border:1px solid var(--line);color:var(--mut);padding:6px 13px;border-radius:9px;cursor:pointer;font-family:'Outfit';font-size:.82rem;transition:.2s;}
.bl-chip.on{background:rgba(54,241,205,.14);color:var(--tl);border-color:rgba(54,241,205,.4);}
.bl-ta{width:100%;background:rgba(0,0,0,.28);border:1px solid var(--line);border-radius:14px;color:var(--txt);padding:16px;font-family:'Outfit';font-size:.95rem;resize:vertical;line-height:1.5;}
.bl-ta:focus{outline:none;border-color:var(--tl);}
.bl-ta::placeholder{color:var(--mut);}
.bl-run{width:100%;margin-top:18px;background:linear-gradient(95deg,var(--tl),var(--tl2));color:#04221d;border:none;padding:16px;border-radius:14px;font-family:'Outfit';font-weight:600;font-size:1.02rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:.25s;}
.bl-run:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 30px rgba(54,241,205,.3);}
.bl-run:disabled{opacity:.35;cursor:not-allowed;}
.bl-run:hover:not(:disabled) span{transform:translateX(4px);}
.bl-muted{text-align:center;color:var(--mut);font-size:.82rem;margin:10px 0 0;}
.bl-demo{display:block;margin:12px auto 0;background:transparent;border:1px dashed var(--line);color:var(--tl);padding:9px 18px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;}
.bl-demo:hover{background:rgba(54,241,205,.06);}
.bl-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:48vh;gap:22px;animation:rise .4s ease both;}
.bl-orb{width:90px;height:90px;border-radius:50%;background:radial-gradient(circle at 35% 30%,var(--tl),transparent 70%);box-shadow:0 0 40px rgba(54,241,205,.4);animation:pulse 1.5s ease-in-out infinite;}
.bl-step{font-family:'JetBrains Mono',monospace;color:var(--tl);font-size:.92rem;}
.bl-error{text-align:center;padding:60px 20px;}
.bl-error h2{font-family:'Fraunces',serif;color:var(--tl2);}
.bl-error p{color:var(--mut);margin-bottom:24px;}
.bl-vtabs{display:flex;gap:6px;margin:14px 0 16px;background:rgba(0,0,0,.3);padding:5px;border-radius:12px;width:fit-content;}
.bl-vtabs button{background:transparent;border:none;color:var(--mut);padding:9px 20px;border-radius:8px;cursor:pointer;font-family:'Outfit';font-size:.9rem;transition:.2s;}
.bl-vtabs button.on{background:rgba(54,241,205,.14);color:var(--tl);}
.bl-card{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:18px;padding:22px;margin-bottom:14px;animation:rise .4s ease both;}
.bl-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.bl-eyebrow{display:block;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mut);}
.bl-copy{background:rgba(54,241,205,.12);border:1px solid rgba(54,241,205,.3);color:var(--tl);padding:7px 14px;border-radius:10px;cursor:pointer;font-family:'Outfit';font-size:.82rem;transition:.2s;}
.bl-copy:hover{background:rgba(54,241,205,.2);}
.bl-headline{font-family:'Fraunces',serif;font-size:1.3rem;line-height:1.35;margin:0;color:var(--txt);}
.bl-about{font-size:.96rem;line-height:1.65;margin:0;color:var(--txt);white-space:pre-wrap;}
.bl-ghost{width:100%;background:transparent;border:1px solid var(--line);color:var(--mut);padding:13px;border-radius:12px;cursor:pointer;font-family:'Outfit';transition:.2s;margin-top:4px;}
.bl-ghost:hover{border-color:var(--tl);color:var(--tl);}
.bl-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:.3s;z-index:9;}
.bl-ov.open{opacity:1;pointer-events:auto;}
.bl-drawer{position:fixed;top:0;right:0;height:100%;width:min(380px,90vw);background:#061715;border-left:1px solid var(--line);box-shadow:-20px 0 60px rgba(0,0,0,.5);transform:translateX(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1);z-index:10;padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;}
.bl-drawer.open{transform:translateX(0);}
.bl-drawer-top{display:flex;justify-content:space-between;align-items:center;}
.bl-close{background:transparent;border:1px solid var(--line);color:var(--mut);width:32px;height:32px;border-radius:9px;cursor:pointer;}
.bl-close:hover{color:var(--tl);border-color:var(--tl);}
.bl-hist-list{display:flex;flex-direction:column;gap:12px;}
.bl-hist-item{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;}
.bl-hist-tag{font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:7px;background:rgba(54,241,205,.1);color:var(--tl);}
.bl-hist-prev{font-size:.84rem;color:var(--txt);line-height:1.4;margin:8px 0 6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.bl-hist-date{font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--mut);}
.bl-hist-act{display:flex;gap:8px;margin-top:10px;}
.bl-hist-act button{flex:1;background:rgba(54,241,205,.08);border:1px solid var(--line);color:var(--tl);padding:7px;border-radius:9px;cursor:pointer;font-family:'Outfit';font-size:.8rem;}
.bl-hist-act button.del{background:transparent;color:#ff8a8a;border-color:rgba(255,138,138,.3);}
.bl-clear{background:transparent;border:1px solid rgba(255,138,138,.3);color:#ff8a8a;padding:10px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;}
@keyframes pulse{0%,100%{transform:scale(.92);opacity:.7;}50%{transform:scale(1.08);opacity:1;}}
@keyframes rise{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
@media(max-width:600px){.bl-actions{flex-direction:column;}}
`;
