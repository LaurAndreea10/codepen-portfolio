(() => {
  'use strict';

  const PREVIOUS_MAIN = 'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@c02951956477eacc6cb791b932b30c41d6d1b7da/main.js';

  // Single source of truth for CodePen growth.
  // 83 projects were already represented before this Pen was added.
  const CODEPEN_BASE_COUNT = 83;
  const CODEPEN_NEW_PROJECTS = [
    {
      id: '019d2b3a-2991-75d3-9c59-15de01ca8079',
      label: 'CodePen #84',
      url: 'https://codepen.io/editor/Laura-Andreea-the-typescripter/pen/019d2b3a-2991-75d3-9c59-15de01ca8079'
    }
  ];
  const CODEPEN_COUNT = CODEPEN_BASE_COUNT + CODEPEN_NEW_PROJECTS.length;

  const ACTIVE_RO = [];
  const ACTIVE_EN = [];

  function en(){ return document.documentElement.lang === 'en'; }

  function activeHtml(){
    const items = en() ? ACTIVE_EN : ACTIVE_RO;
    if(!items.length) return `<li class="now-item"><span class="now-status" aria-hidden="true">✓</span><span>${en()?'No blocked work right now. The next priority will come from the weekly review.':'Nu există activități blocate acum. Următoarea prioritate va veni din verificarea săptămânală.'}</span></li>`;
    return items.map(x => `<li class="now-item now-item-active" data-static-now-item="active"><span class="now-status" aria-hidden="true">🔄</span><span><strong>${x[0]}</strong><span class="now-item-copy">${x[1]}</span><span class="now-next"><b>${en()?'Next step':'Pasul următor'}:</b> ${x[2]}</span><span class="now-tag">${x[3]}</span></span></li>`).join('');
  }

  function doneHtml(){
    return en()
      ? `<li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Portfolio consistency pass</strong> — ClientOps status, accessibility for three case studies and technical proof/README alignment completed.</span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status" aria-hidden="true">✅</span><span><strong>LAURAI / BOUNCE SIGNAL</strong> — completed and published as an interactive email-bounce signal experience. <a class="now-item-link" href="https://laurandreea10.github.io/LAURAI-BOUNCE-SIGNAL/" target="_blank" rel="noopener noreferrer">Open project</a></span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>LaurAi · Signal Orbit</strong> — completed and published as an accessible email signature studio with RO/EN, high contrast, reduced motion, version history and README. <a class="now-item-link" href="https://laurandreea10.github.io/LAURAI-SIGNAL-ORBIT/" target="_blank" rel="noopener noreferrer">Open project</a></span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>Email Alerts</strong> — published with RO/EN, accessibility, dark mode and version history. <a class="now-item-link" href="https://laurandreea10.github.io/Email-Alerts/" target="_blank" rel="noopener noreferrer">Open project</a></span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>MoonMail — Cosmic Receipt Email</strong> — completed and published email challenge. <a class="now-item-link" href="https://laurandreea10.github.io/MoonMail-Cosmic-Receipt-Email/" target="_blank" rel="noopener noreferrer">Open project</a></span></li>`
      : `<li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Portfolio consistency pass</strong> — status ClientOps, accesibilitatea celor trei case study-uri și formatul unitar pentru dovezi tehnice/README finalizate.</span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status" aria-hidden="true">✅</span><span><strong>LAURAI / BOUNCE SIGNAL</strong> — finalizat și publicat ca experiență interactivă inspirată de semnalul de bounce al emailului. <a class="now-item-link" href="https://laurandreea10.github.io/LAURAI-BOUNCE-SIGNAL/" target="_blank" rel="noopener noreferrer">Deschide proiectul</a></span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>LaurAi · Signal Orbit</strong> — finalizat și publicat ca studio accesibil pentru semnături email, cu RO/EN, contrast ridicat, reducerea mișcării, istoric de versiuni și README. <a class="now-item-link" href="https://laurandreea10.github.io/LAURAI-SIGNAL-ORBIT/" target="_blank" rel="noopener noreferrer">Deschide proiectul</a></span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>Email Alerts</strong> — publicat cu RO/EN, accesibilitate, dark mode și istoric de versiuni. <a class="now-item-link" href="https://laurandreea10.github.io/Email-Alerts/" target="_blank" rel="noopener noreferrer">Deschide proiectul</a></span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>MoonMail — Cosmic Receipt Email</strong> — challenge email finalizat și publicat. <a class="now-item-link" href="https://laurandreea10.github.io/MoonMail-Cosmic-Receipt-Email/" target="_blank" rel="noopener noreferrer">Deschide proiectul</a></span></li>`;
  }

  function restoreNow(){
    const active=document.querySelector('#now-panel-active .now-checklist');
    const done=document.querySelector('#now-panel-done .now-checklist');
    if(active) active.innerHTML=activeHtml();
    if(done) done.innerHTML=doneHtml();
    const title=document.getElementById('now-title');
    if(title) title.textContent=en()?'What I am working on now':'La ce lucrez acum';
    const note=document.querySelector('#now .now-note');
    if(note) note.textContent=en()?'A small, intentionally current list: what is active, why it matters, and the next concrete step.':'O listă scurtă și intenționat actuală: ce este activ, de ce contează și care este următorul pas concret.';
    const date=document.getElementById('now-datetime');
    if(date){
      date.dateTime='2026-08-29';
      date.textContent=en()?'29 August 2026':'29 August 2026';
    }
  }

  function syncCodePenText(){
    const count = String(CODEPEN_COUNT);

    // Intro: only the CodePen counter is overridden; counters 2–4 keep their original animation.
    let style=document.getElementById('codepen-count-override');
    if(!style){
      style=document.createElement('style');
      style.id='codepen-count-override';
      document.head.appendChild(style);
    }
    style.textContent=`#intro-overlay .s3 .num1::before{content:"${count}"!important;}`;

    // Remove the historical CSS that used to force 66.
    const legacy=document.getElementById('la-force-codepen-count-css');
    if(legacy) legacy.remove();

    const scan=document.getElementById('scan-proj-count');
    if(scan) scan.textContent=count;
    document.querySelectorAll('[data-codepen-count]').forEach(el=>{ el.textContent=count; });

    // Synchronize every visible CodePen metric/tab that still carries an older total.
    document.querySelectorAll('strong,span,p,li,a,h1,h2,h3,h4,button').forEach(el=>{
      if(el.childElementCount) return;
      const text=el.textContent||'';
      const context=(el.closest('[id*="codepen" i],[class*="codepen" i],[data-category*="codepen" i]')?.textContent||'') + ' ' + text;
      if(/CodePen/i.test(context) && /\b(?:66|82|83)\b/.test(text)){
        el.textContent=text.replace(/\b(?:66|82|83)\b/g,count);
      }
    });

    // Keep SEO/social descriptions aligned where CodePen totals are mentioned.
    document.querySelectorAll('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').forEach(meta=>{
      const value=meta.getAttribute('content')||'';
      if(/CodePen/i.test(value) && /\b(?:66|82|83)\b/.test(value)){
        meta.setAttribute('content',value.replace(/\b(?:66|82|83)\b/g,count));
      }
    });
  }

  function ensureLatestCodePenProof(){
    const project=CODEPEN_NEW_PROJECTS.at(-1);
    if(!project) return;

    let link=document.getElementById('latest-codepen-project-link');
    if(!link){
      const scanCount=document.getElementById('scan-proj-count');
      const list=scanCount?.closest('ul');
      if(list){
        const li=document.createElement('li');
        li.id='latest-codepen-project-proof';
        li.innerHTML=`<strong>${en()?'Latest CodePen':'Cel mai nou CodePen'}:</strong> <a id="latest-codepen-project-link" href="${project.url}" target="_blank" rel="noopener noreferrer">${project.label} ↗</a>`;
        list.appendChild(li);
        link=li.querySelector('a');
      }
    }
    if(link){
      link.href=project.url;
      link.textContent=`${project.label} ↗`;
    }
  }

  function fixProjectCounts(){
    syncCodePenText();
    ensureLatestCodePenProof();
  }

  function styles(){
    if(document.getElementById('static-now-styles')) return;
    const s=document.createElement('style');
    s.id='static-now-styles';
    s.textContent='#now-panel-active .now-item>span:last-child{display:grid;gap:6px}#now .now-item-copy,#now .now-next{display:block;color:var(--muted,#aeb7c8);font-size:13px;line-height:1.5;max-width:900px}#now .now-next b{color:var(--text,#eef3fb);font-weight:600}#now-panel-active .now-tag{width:max-content;font-size:11px}';
    document.head.appendChild(s);
  }

  function guardNow(){
    const now=document.getElementById('now');
    if(!now||now.dataset.staticGuard) return;
    now.dataset.staticGuard='1';
    let busy=false;
    new MutationObserver(()=>{
      if(busy) return;
      busy=true;
      queueMicrotask(()=>{
        busy=false;
        if(document.querySelectorAll('#now-panel-active [data-static-now-item="active"]').length!==3 || document.querySelectorAll('#now-panel-done [data-static-now-item="done"]').length!==4){
          restoreNow();
        }
      });
    }).observe(now,{childList:true,subtree:true});
  }

  function init(){
    styles();
    restoreNow();
    fixProjectCounts();
    guardNow();

    const script=document.createElement('script');
    script.src=PREVIOUS_MAIN;
    script.async=true;
    script.onload=()=>{ restoreNow(); fixProjectCounts(); };
    script.onerror=()=>{ restoreNow(); fixProjectCounts(); };
    document.head.appendChild(script);

    window.addEventListener('load',()=>{ restoreNow(); fixProjectCounts(); },{once:true});
    [100,400,1200,3000].forEach(ms=>setTimeout(fixProjectCounts,ms));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
