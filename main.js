(() => {
  'use strict';

  const PREVIOUS_MAIN = 'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@c02951956477eacc6cb791b932b30c41d6d1b7da/main.js';
  const CODEPEN_COUNT = 82;
  const ACTIVE_RO = [
    ['ClientOps Suite Premium — status & demo alignment','Curăț starea proiectului astfel încât demo-ul, repo-ul și mesajele din portofoliu să spună același lucru.','verific demo-ul live, elimin ETA-ul vechi și aliniez CTA-urile cu starea reală.','Product polish'],
    ['Case study accessibility pass','Auditez case study-urile principale pentru navigare cu tastatura, focus vizibil și descrieri utile pentru capturi.','Alpis Fusion, ClientFlow și Link Video Editor — keyboard + focus + alt text.','Accessibility'],
    ['Technical proof & README consistency','Fac dovezile tehnice mai ușor de verificat: stack, arhitectură, ownership, setup și link direct spre cod.','aplic același format README și proof card pe cele 3 proiecte-cheie.','Engineering proof']
  ];
  const ACTIVE_EN = [
    ['ClientOps Suite Premium — status & demo alignment','Align the project state so the live demo, repository and portfolio messaging tell the same story.','verify the live demo, remove the stale ETA and align CTAs with the real project state.','Product polish'],
    ['Case study accessibility pass','Audit the main case studies for keyboard navigation, visible focus and useful screenshot descriptions.','Alpis Fusion, ClientFlow and Link Video Editor — keyboard + focus + alt text.','Accessibility'],
    ['Technical proof & README consistency','Make technical proof easier to verify: stack, architecture, ownership, setup and direct code links.','apply one README and proof-card format across the three flagship projects.','Engineering proof']
  ];

  function en(){ return document.documentElement.lang === 'en'; }
  function activeHtml(){
    const items = en() ? ACTIVE_EN : ACTIVE_RO;
    return items.map(x => `<li class="now-item now-item-active" data-static-now-item="active"><span class="now-status" aria-hidden="true">🔄</span><span><strong>${x[0]}</strong><span class="now-item-copy">${x[1]}</span><span class="now-next"><b>${en()?'Next step':'Pasul următor'}:</b> ${x[2]}</span><span class="now-tag">${x[3]}</span></span></li>`).join('');
  }
  function doneHtml(){
    return en()
      ? `<li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>Email Alerts</strong> — published with RO/EN, accessibility, dark mode and version history. <a class="now-item-link" href="https://laurandreea10.github.io/Email-Alerts/" target="_blank" rel="noopener noreferrer">Open project</a></span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>MoonMail — Cosmic Receipt Email</strong> — completed and published email challenge. <a class="now-item-link" href="https://laurandreea10.github.io/MoonMail-Cosmic-Receipt-Email/" target="_blank" rel="noopener noreferrer">Open project</a></span></li>`
      : `<li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>Email Alerts</strong> — publicat cu RO/EN, accesibilitate, dark mode și istoric de versiuni. <a class="now-item-link" href="https://laurandreea10.github.io/Email-Alerts/" target="_blank" rel="noopener noreferrer">Deschide proiectul</a></span></li><li class="now-item now-item-done" data-static-now-item="done"><span class="now-status">✅</span><span><strong>MoonMail — Cosmic Receipt Email</strong> — challenge email finalizat și publicat. <a class="now-item-link" href="https://laurandreea10.github.io/MoonMail-Cosmic-Receipt-Email/" target="_blank" rel="noopener noreferrer">Deschide proiectul</a></span></li>`;
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
  }

  function installCountLock(){
    let lock=document.getElementById('codepen-count-lock');
    if(!lock){
      lock=document.createElement('style');
      lock.id='codepen-count-lock';
      document.head.appendChild(lock);
    }
    lock.textContent=`
      html body #intro-overlay .s3 .num1{
        animation:none!important;
        counter-reset:c1 ${CODEPEN_COUNT}!important;
      }
      html body #intro-overlay .s3 .num1::before{
        content:"${CODEPEN_COUNT}"!important;
      }
    `;
  }

  function fixProjectCounts(){
    installCountLock();

    const legacy=document.getElementById('la-force-codepen-count-css');
    if(legacy && legacy.textContent.includes('66')){
      legacy.textContent=legacy.textContent.replace(/66/g,String(CODEPEN_COUNT));
    }

    const scan=document.getElementById('scan-proj-count');
    if(scan && scan.textContent!==String(CODEPEN_COUNT)) scan.textContent=String(CODEPEN_COUNT);

    document.querySelectorAll('[data-codepen-count]').forEach(el=>{
      if(el.textContent!==String(CODEPEN_COUNT)) el.textContent=String(CODEPEN_COUNT);
    });

    document.querySelectorAll('strong,span,p,li,a,h1,h2,h3,h4').forEach(el=>{
      if(el.childElementCount) return;
      const t=el.textContent||'';
      if(t==='66' || /66\s*(proiecte|projects|live)/i.test(t) || /CodePen\s*[·:-]?\s*66/i.test(t)){
        el.textContent=t.replace(/66/g,String(CODEPEN_COUNT));
      }
    });
  }

  function styles(){
    if(document.getElementById('static-now-styles')) return;
    const s=document.createElement('style');
    s.id='static-now-styles';
    s.textContent='#now-panel-active .now-item>span:last-child{display:grid;gap:6px}#now .now-item-copy,#now .now-next{display:block;color:var(--muted,#aeb7c8);font-size:13px;line-height:1.5;max-width:900px}#now .now-next b{color:var(--text,#eef3fb);font-weight:600}#now-panel-active .now-tag{width:max-content;font-size:11px}';
    document.head.appendChild(s);
  }

  function guard(){
    const now=document.getElementById('now');
    if(now && !now.dataset.staticGuard){
      now.dataset.staticGuard='1';
      let busy=false;
      new MutationObserver(()=>{
        if(busy)return;
        busy=true;
        queueMicrotask(()=>{
          busy=false;
          if(document.querySelectorAll('#now-panel-active [data-static-now-item="active"]').length!==3||document.querySelectorAll('#now-panel-done [data-static-now-item="done"]').length!==2) restoreNow();
          fixProjectCounts();
        });
      }).observe(now,{childList:true,subtree:true});
    }

    new MutationObserver(()=>{ restoreNow(); fixProjectCounts(); })
      .observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

    new MutationObserver(()=>{ fixProjectCounts(); })
      .observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  }

  function init(){
    styles();
    restoreNow();
    fixProjectCounts();
    guard();

    const script=document.createElement('script');
    script.src=PREVIOUS_MAIN;
    script.async=true;
    script.onload=()=>{ restoreNow(); fixProjectCounts(); };
    script.onerror=()=>{ restoreNow(); fixProjectCounts(); };
    document.head.appendChild(script);

    window.addEventListener('load',()=>{ restoreNow(); fixProjectCounts(); },{once:true});
    [50,100,250,500,900,1500,2500,4000,6500,10000].forEach(ms=>setTimeout(()=>{ restoreNow(); fixProjectCounts(); },ms));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();