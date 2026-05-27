import React, { useState, useEffect } from "react";

// ============================================================
// COUNTER — AI Salary Negotiation Coach
// Career Toolkit suite. Same architecture. Accent: pink/magenta.
// ============================================================

const API_HOST = "https://api.anthropic.com/v1/messages";
const inClaudeAI = typeof window !== "undefined" && /claude\.ai|anthropic/.test(window.location?.hostname || "");

const T = {
  ro: {
    brand: "COUNTER", tagline: "Coach de negociere salarială cu AI",
    intro: "Spune-mi situația: rolul, oferta primită și ce vrei. Primești o strategie, o sumă-țintă argumentată și un mesaj gata de trimis.",
    roleLabel: "Rol / poziție", rolePh: "ex: Front-End Developer, 3 ani experiență",
    offerLabel: "Oferta actuală", offerPh: "ex: 6000 RON net / lună",
    targetLabel: "Ce vrei (opțional)", targetPh: "ex: 7500 RON, sau nu știu încă",
    contextLabel: "Context (opțional)", contextPh: "ex: alte oferte, realizări, motivul cererii…",
    generate: "Pregătește negocierea", generating: "Se pregătește…",
    steps: ["Se evaluează poziția…", "Se calculează ținta…", "Se scrie strategia…", "Se compune mesajul…"],
    strategy: "Strategie", target: "Sumă-țintă", script: "Mesaj de negociere", tips: "Sfaturi", pitfalls: "De evitat",
    copy: "Copiază", copied: "Copiat!", reset: "Începe din nou", noInput: "Completează rolul și oferta.",
    tryDemo: "Încearcă cu date demo",
    history: "Istoric", historyEmpty: "Nimic salvat încă.", open: "Deschide", del: "Șterge", clearAll: "Șterge tot",
    savedNote: "Salvat automat pe acest dispozitiv", poweredLive: "Analiză live prin Claude", poweredLocal: "Motor local · fără cost",
    errorTitle: "Ceva n-a mers", errorBody: "Încearcă din nou.",
    disclaimer: "Sfaturi orientative, nu garanții. Adaptează la contextul tău.",
  },
  en: {
    brand: "COUNTER", tagline: "AI salary negotiation coach",
    intro: "Tell me the situation: the role, the offer you got, and what you want. Get a strategy, a justified target number, and a ready-to-send message.",
    roleLabel: "Role / position", rolePh: "e.g. Front-End Developer, 3 years experience",
    offerLabel: "Current offer", offerPh: "e.g. €1500 net / month",
    targetLabel: "What you want (optional)", targetPh: "e.g. €1900, or not sure yet",
    contextLabel: "Context (optional)", contextPh: "e.g. other offers, achievements, reason for the ask…",
    generate: "Prep the negotiation", generating: "Preparing…",
    steps: ["Assessing your position…", "Calculating the target…", "Writing the strategy…", "Composing the message…"],
    strategy: "Strategy", target: "Target number", script: "Negotiation message", tips: "Tips", pitfalls: "Avoid",
    copy: "Copy", copied: "Copied!", reset: "Start over", noInput: "Fill in the role and offer.",
    tryDemo: "Try with demo data",
    history: "History", historyEmpty: "Nothing saved yet.", open: "Open", del: "Delete", clearAll: "Clear all",
    savedNote: "Auto-saved on this device", poweredLive: "Live analysis via Claude", poweredLocal: "Local engine · no cost",
    errorTitle: "Something went wrong", errorBody: "Try again.",
    disclaimer: "Guidance, not guarantees. Adapt to your context.",
  },
};

const DEMO = { role: "Front-End Developer, 3 ani experiență, React + Vite", offer: "6500 RON net / lună", target: "8000 RON", context: "Am o altă ofertă la 7800 și am livrat 3 proiecte majore anul acesta." };

const HKEY = "counter:history";
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

async function callClaude(content, maxTokens = 1200) {
  const resp = await fetch(API_HOST, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, messages: [{ role: "user", content }] }) });
  const data = await resp.json();
  const raw = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

function localNegotiate(role, offer, target, context, lang) {
  const L = lang === "ro";
  const num = (offer.match(/[\d.,]+/) || ["?"])[0];
  const tgt = target.trim() ? target : (L ? `cu ~15-20% peste ofertă` : `~15-20% above the offer`);
  return {
    strategy: L
      ? `Ancorează discuția pe valoarea pe care o aduci, nu pe nevoile tale. Cere ținta cu încredere, justific-o cu realizări concrete, și lasă spațiu pentru o contra-ofertă. Nu accepta pe loc — cere 24-48h de gândire.`
      : `Anchor the conversation on the value you bring, not your needs. Ask for the target confidently, justify it with concrete achievements, and leave room for a counter-offer. Don't accept on the spot — ask for 24-48h to think.`,
    target: tgt,
    script: L
      ? `Bună ziua,\n\nVă mulțumesc pentru ofertă — sunt foarte entuziasmat/ă de rol. Pe baza experienței mele și a rezultatelor pe care le-am livrat, speram la o remunerație în jur de ${tgt}. Cred că reflectă valoarea pe care o pot aduce echipei. Sunt deschis/ă să discutăm și pachetul total.\n\nCu stimă`
      : `Hello,\n\nThank you for the offer — I'm very excited about the role. Based on my experience and the results I've delivered, I was hoping for compensation around ${tgt}. I believe it reflects the value I can bring to the team. I'm open to discussing the total package as well.\n\nBest regards`,
    tips: L
      ? ["Cere mereu puțin peste ținta reală.", "Justifică cu cifre, nu cu nevoi personale.", "Negociază pachetul total, nu doar salariul de bază."]
      : ["Always ask slightly above your real target.", "Justify with numbers, not personal needs.", "Negotiate the total package, not just base salary."],
    pitfalls: L
      ? ["Nu accepta sau refuza pe loc.", "Nu te scuza pentru că ceri mai mult.", "Nu da prima cifră dacă poți evita."]
      : ["Don't accept or refuse on the spot.", "Don't apologize for asking for more.", "Don't give the first number if you can avoid it."],
  };
}

export default function Counter() {
  const [lang, setLang] = useState("ro");
  const [view, setView] = useState("input");
  const [role, setRole] = useState(""); const [offer, setOffer] = useState(""); const [target, setTarget] = useState(""); const [context, setContext] = useState("");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hist_, setHist_] = useState([]); const [showHist, setShowHist] = useState(false);
  useEffect(() => { store.load().then(setHist_); }, []);

  const t = T[lang]; const live = inClaudeAI;
  const canRun = role.trim().length > 3 && offer.trim().length > 1;

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
          `You are a salary negotiation coach. Write in ${langName}. Given the situation, respond with ONLY JSON: {"strategy":"...","target":"...","script":"<ready-to-send message>","tips":["..","..",".."],"pitfalls":["..","..",".."]}\n\nRole: ${role}\nOffer: ${offer}\nWanted: ${target || "unspecified"}\nContext: ${context || "none"}` }], 1200);
      } else { await new Promise((r) => setTimeout(r, 1200)); out = localNegotiate(role, offer, target, context, lang); }
      setResult(out); setView("result");
      pushHistory({ role, offer, result: out, preview: `${role} · ${offer}` });
    } catch (e) { console.error(e); setView("error"); }
    finally { clearInterval(timer); }
  }

  function copyScript() { navigator.clipboard?.writeText(result?.script || "").then(() => { setCopied(true); setTimeout(() => setCopied(false), 1700); }); }
  function reset() { setView("input"); setResult(null); setRole(""); setOffer(""); setTarget(""); setContext(""); }
  function openHistory(item) { setResult(item.result); setShowHist(false); setView("result"); }

  return (
    <div className="co-root" data-lang={lang}>
      <style>{CSS}</style>
      <div className="co-grid" /><div className="co-glow co-glow-a" /><div className="co-glow co-glow-b" />
      <header className="co-header">
        <div className="co-brand"><span className="co-logo">⇄</span><div><h1>{t.brand}</h1><p>{t.tagline}</p></div></div>
        <div className="co-hr">
          <span className={`co-pill ${live ? "live" : "local"}`}>{live ? "● LIVE AI" : "● LOCAL"}</span>
          <button className="co-lang" onClick={() => setShowHist(true)}>⧉ {t.history}{hist_.length > 0 && <span className="co-badge">{hist_.length}</span>}</button>
          <button className="co-lang" onClick={() => setLang((l) => (l === "ro" ? "en" : "ro"))}>{lang === "ro" ? "EN" : "RO"}</button>
        </div>
      </header>

      <main className="co-main">
        {view === "input" && (
          <section className="co-fade">
            <p className="co-intro">{t.intro}</p>
            <div className="co-panel">
              <label className="co-field"><span>{t.roleLabel}</span><input className="co-in" placeholder={t.rolePh} value={role} onChange={(e) => setRole(e.target.value)} /></label>
              <label className="co-field"><span>{t.offerLabel}</span><input className="co-in" placeholder={t.offerPh} value={offer} onChange={(e) => setOffer(e.target.value)} /></label>
              <label className="co-field"><span>{t.targetLabel}</span><input className="co-in" placeholder={t.targetPh} value={target} onChange={(e) => setTarget(e.target.value)} /></label>
              <label className="co-field"><span>{t.contextLabel}</span><textarea className="co-in" rows={3} placeholder={t.contextPh} value={context} onChange={(e) => setContext(e.target.value)} /></label>
              <button className="co-run" disabled={!canRun} onClick={generate}>{t.generate} <span>→</span></button>
              {!canRun && (<><p className="co-muted">{t.noInput}</p><button className="co-demo" onClick={() => { setRole(DEMO.role); setOffer(DEMO.offer); setTarget(DEMO.target); setContext(DEMO.context); }}>{t.tryDemo}</button></>)}
            </div>
          </section>
        )}

        {view === "loading" && (<section className="co-loading"><div className="co-arrows"><span>⇄</span></div><p className="co-step">{t.steps[step]}</p><span className="co-muted">{live ? t.poweredLive : t.poweredLocal}</span></section>)}
        {view === "error" && (<section className="co-error"><h2>{t.errorTitle}</h2><p>{t.errorBody}</p><button className="co-run" onClick={reset}>{t.reset}</button></section>)}

        {view === "result" && result && (
          <section className="co-fade">
            <div className="co-target-card">
              <span className="co-eyebrow">{t.target}</span>
              <p className="co-target">{result.target}</p>
            </div>
            <div className="co-card"><span className="co-eyebrow">{t.strategy}</span><p className="co-body">{result.strategy}</p></div>
            <div className="co-card">
              <div className="co-card-top"><span className="co-eyebrow">{t.script}</span><button className="co-copy" onClick={copyScript}>{copied ? t.copied : t.copy}</button></div>
              <pre className="co-script">{result.script}</pre>
            </div>
            <div className="co-two">
              <div className="co-card"><span className="co-eyebrow">{t.tips}</span><ul className="co-list good">{(result.tips || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              <div className="co-card"><span className="co-eyebrow">{t.pitfalls}</span><ul className="co-list bad">{(result.pitfalls || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div>
            </div>
            <p className="co-disc">{t.disclaimer}</p>
            <button className="co-ghost" onClick={reset}>↺ {t.reset}</button>
          </section>
        )}
      </main>

      <div className={`co-ov ${showHist ? "open" : ""}`} onClick={() => setShowHist(false)} />
      <aside className={`co-drawer ${showHist ? "open" : ""}`}>
        <div className="co-drawer-top"><span className="co-eyebrow" style={{ margin: 0 }}>{t.history}</span><button className="co-close" onClick={() => setShowHist(false)}>✕</button></div>
        {hist_.length === 0 ? <p className="co-muted">{t.historyEmpty}</p> : (
          <>
            <div className="co-hist-list">
              {hist_.map((h) => (
                <div key={h.id} className="co-hist-item">
                  <p className="co-hist-prev">{h.preview}</p>
                  <span className="co-hist-date">{new Date(h.ts).toLocaleDateString()}</span>
                  <div className="co-hist-act"><button onClick={() => openHistory(h)}>{t.open}</button><button className="del" onClick={() => deleteHistory(h.id)}>{t.del}</button></div>
                </div>
              ))}
            </div>
            <button className="co-clear" onClick={clearHistory}>{t.clearAll}</button>
            <p className="co-muted" style={{ fontSize: ".72rem" }}>{t.savedNote}</p>
          </>
        )}
      </aside>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap');
.co-root{--bg:#0d0610;--panel:rgba(28,14,26,0.72);--line:rgba(255,107,157,0.16);--txt:#f5e6f0;--mut:#a8829a;--pk:#ff6b9d;--pk2:#ff4d8d;position:relative;min-height:100vh;background:var(--bg);color:var(--txt);font-family:'Outfit',sans-serif;overflow-x:hidden;padding-bottom:80px;}
.co-root *{box-sizing:border-box;}
.co-grid{position:fixed;inset:0;background-image:linear-gradient(rgba(255,107,157,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,157,.03) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000,transparent);pointer-events:none;}
.co-glow{position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;}
.co-glow-a{width:520px;height:520px;background:#ff4d8d;top:-180px;right:-120px;opacity:.24;}
.co-glow-b{width:460px;height:460px;background:#8d2bff;bottom:-160px;left:-140px;opacity:.2;}
.co-header{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:26px clamp(20px,5vw,64px);}
.co-brand{display:flex;gap:14px;align-items:center;}
.co-logo{font-size:1.7rem;color:var(--pk);filter:drop-shadow(0 0 10px var(--pk));}
.co-brand h1{margin:0;font-family:'Fraunces',serif;font-weight:900;font-size:1.45rem;letter-spacing:.04em;}
.co-brand p{margin:0;font-size:.78rem;color:var(--mut);}
.co-hr{display:flex;align-items:center;gap:12px;}
.co-pill{font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.1em;padding:5px 10px;border-radius:8px;border:1px solid var(--line);}
.co-pill.live{color:var(--pk);border-color:rgba(255,107,157,.4);}.co-pill.local{color:var(--mut);}
.co-lang{background:transparent;border:1px solid var(--line);color:var(--pk);font-family:'JetBrains Mono',monospace;font-size:.8rem;padding:8px 14px;border-radius:10px;cursor:pointer;transition:.25s;}
.co-lang:hover{background:rgba(255,107,157,.08);}
.co-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;margin-left:6px;background:var(--pk);color:#2a0518;border-radius:9px;font-size:.68rem;font-weight:700;}
.co-main{position:relative;z-index:2;max-width:760px;margin:0 auto;padding:0 clamp(20px,5vw,40px);}
.co-fade{animation:rise .5s ease both;}
.co-intro{font-size:clamp(1.05rem,2.4vw,1.3rem);line-height:1.5;max-width:600px;margin:24px 0 28px;font-weight:300;}
.co-intro::first-line{color:var(--pk);}
.co-panel{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,.4);}
.co-field{display:block;margin-bottom:14px;}
.co-field span{display:block;font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);margin-bottom:7px;}
.co-in{width:100%;background:rgba(0,0,0,.28);border:1px solid var(--line);border-radius:12px;color:var(--txt);padding:13px 15px;font-family:'Outfit';font-size:.94rem;resize:vertical;line-height:1.5;}
.co-in:focus{outline:none;border-color:var(--pk);}
.co-in::placeholder{color:var(--mut);}
.co-run{width:100%;margin-top:8px;background:linear-gradient(95deg,var(--pk),var(--pk2));color:#2a0518;border:none;padding:16px;border-radius:14px;font-family:'Outfit';font-weight:600;font-size:1.02rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:.25s;}
.co-run:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 30px rgba(255,107,157,.3);}
.co-run:disabled{opacity:.35;cursor:not-allowed;}
.co-run:hover:not(:disabled) span{transform:translateX(4px);}
.co-muted{text-align:center;color:var(--mut);font-size:.82rem;margin:10px 0 0;}
.co-demo{display:block;margin:12px auto 0;background:transparent;border:1px dashed var(--line);color:var(--pk);padding:9px 18px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;}
.co-demo:hover{background:rgba(255,107,157,.06);}
.co-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:48vh;gap:22px;animation:rise .4s ease both;}
.co-arrows{font-size:3rem;color:var(--pk);animation:swap 1.4s ease-in-out infinite;filter:drop-shadow(0 0 14px var(--pk));}
.co-step{font-family:'JetBrains Mono',monospace;color:var(--pk);font-size:.92rem;}
.co-error{text-align:center;padding:60px 20px;}
.co-error h2{font-family:'Fraunces',serif;color:var(--pk2);}
.co-error p{color:var(--mut);margin-bottom:24px;}
.co-target-card{background:linear-gradient(135deg,rgba(255,107,157,.12),rgba(141,43,255,.08));border:1px solid rgba(255,107,157,.3);border-radius:18px;padding:24px;margin:14px 0;text-align:center;animation:rise .4s ease both;}
.co-target{font-family:'Fraunces',serif;font-size:clamp(1.8rem,5vw,2.6rem);font-weight:900;margin:8px 0 0;color:var(--pk);}
.co-card{background:var(--panel);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:18px;padding:22px;margin-bottom:14px;}
.co-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.co-eyebrow{display:block;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mut);margin-bottom:10px;}
.co-card-top .co-eyebrow{margin:0;}
.co-body{font-size:.96rem;line-height:1.65;margin:0;color:var(--txt);}
.co-copy{background:rgba(255,107,157,.12);border:1px solid rgba(255,107,157,.3);color:var(--pk);padding:7px 14px;border-radius:10px;cursor:pointer;font-family:'Outfit';font-size:.82rem;transition:.2s;}
.co-copy:hover{background:rgba(255,107,157,.2);}
.co-script{white-space:pre-wrap;font-family:'Outfit';font-size:.94rem;line-height:1.7;color:var(--txt);margin:0;}
.co-two{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.co-list{margin:0;padding-left:18px;}
.co-list li{font-size:.88rem;line-height:1.5;margin-bottom:7px;color:var(--txt);}
.co-list.good li::marker{color:var(--pk);}
.co-list.bad li::marker{color:#ff5252;}
.co-disc{text-align:center;color:var(--mut);font-size:.78rem;margin:16px 0;font-style:italic;}
.co-ghost{width:100%;background:transparent;border:1px solid var(--line);color:var(--mut);padding:13px;border-radius:12px;cursor:pointer;font-family:'Outfit';transition:.2s;}
.co-ghost:hover{border-color:var(--pk);color:var(--pk);}
.co-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:.3s;z-index:9;}
.co-ov.open{opacity:1;pointer-events:auto;}
.co-drawer{position:fixed;top:0;right:0;height:100%;width:min(380px,90vw);background:#120813;border-left:1px solid var(--line);box-shadow:-20px 0 60px rgba(0,0,0,.5);transform:translateX(100%);transition:transform .32s cubic-bezier(.2,.8,.2,1);z-index:10;padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;}
.co-drawer.open{transform:translateX(0);}
.co-drawer-top{display:flex;justify-content:space-between;align-items:center;}
.co-close{background:transparent;border:1px solid var(--line);color:var(--mut);width:32px;height:32px;border-radius:9px;cursor:pointer;}
.co-close:hover{color:var(--pk);border-color:var(--pk);}
.co-hist-list{display:flex;flex-direction:column;gap:12px;}
.co-hist-item{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;}
.co-hist-prev{font-size:.84rem;color:var(--txt);line-height:1.4;margin:0 0 6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.co-hist-date{font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--mut);}
.co-hist-act{display:flex;gap:8px;margin-top:10px;}
.co-hist-act button{flex:1;background:rgba(255,107,157,.08);border:1px solid var(--line);color:var(--pk);padding:7px;border-radius:9px;cursor:pointer;font-family:'Outfit';font-size:.8rem;}
.co-hist-act button.del{background:transparent;color:#ff8a8a;border-color:rgba(255,138,138,.3);}
.co-clear{background:transparent;border:1px solid rgba(255,138,138,.3);color:#ff8a8a;padding:10px;border-radius:11px;cursor:pointer;font-family:'Outfit';font-size:.85rem;}
@keyframes swap{0%,100%{transform:rotate(0);}50%{transform:rotate(180deg);}}
@keyframes rise{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
@media(max-width:600px){.co-two{grid-template-columns:1fr;}}
`;
