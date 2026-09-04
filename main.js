(() => {
  'use strict';

  const PREVIOUS_MAIN = 'main-core.js?v=20260904-carousel';

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

  const ACTIVE_RO = [
    ['Project Health Dashboard','Construiesc un panou care arată starea demo-urilor, a documentației și a accesibilității.','Conectarea rezultatelor din link checker și Lighthouse într-o singură vedere.','Observability'],
    ['Case Study Story Mode','Transform Top 3 într-un traseu narativ scurt: problemă, decizie, implementare, rezultat.','Adăugarea unui mod de prezentare de 60–90 secunde pentru fiecare proiect.','Portfolio storytelling'],
  ];
  const ACTIVE_EN = [
    ['Project Health Dashboard','Build a panel showing demo, documentation and accessibility health.','Connect link checker and Lighthouse results in one view.','Observability'],
    ['Case Study Story Mode','Turn the Top 3 into a short narrative: problem, decision, implementation and outcome.','Add a 60–90 second presentation mode for each project.','Portfolio storytelling'],
  ];

  function en(){ return document.documentElement.lang === 'en'; }

  function todayDoneHtml(){
    return en()
      ? `<li class="now-item now-item-done" data-today-completed="2026-09-04"><span class="now-status" aria-hidden="true">✅</span><span><strong>Intro and portfolio navigation</strong> — separated the cinematic intro from the full portfolio and added a reliable 10-second transition with an active Explore button.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Live link health</strong> — fixed the CV Scout URL and verified all 30 linked GitHub Pages destinations with HTTP 200 responses.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>SEO and indexing alignment</strong> — added the full portfolio to the sitemap and aligned canonical and hreflang references.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Portfolio metrics sync</strong> — aligned the visible and metadata project totals to 84.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>JavaScript cleanup</strong> — removed the hidden legacy cinematic code and replaced the fragile CDN chain with local main-core.js.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>EN accessibility parity</strong> — added light/dark theme, high contrast, visible focus and reduced-motion support to the English page.</span></li>`
      : `<li class="now-item now-item-done" data-today-completed="2026-09-04"><span class="now-status" aria-hidden="true">✅</span><span><strong>Intro și navigare portofoliu</strong> — am separat intro-ul cinematic de portofoliul complet și am adăugat tranziția sigură după 10 secunde, cu butonul Explorează activ.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Verificarea linkurilor live</strong> — am reparat adresa CV Scout și am confirmat răspuns HTTP 200 pentru toate cele 30 de destinații GitHub Pages.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Aliniere SEO și indexare</strong> — am inclus portofoliul complet în sitemap și am aliniat referințele canonical și hreflang.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Sincronizarea metricilor</strong> — am aliniat la 84 totalurile vizibile și valorile din metadata.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Curățare JavaScript</strong> — am eliminat codul cinematic vechi, ascuns, și am înlocuit lanțul CDN fragil cu fișierul local main-core.js.</span></li><li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Paritate de accesibilitate EN</strong> — am adăugat temă light/dark, contrast ridicat, focus vizibil și suport reduced motion pe pagina engleză.</span></li>`;
  }

  function activeHtml(){
    const items = en() ? ACTIVE_EN : ACTIVE_RO;
    if(!items.length) return `<li class="now-item"><span class="now-status" aria-hidden="true">✓</span><span>${en()?'No blocked work right now. The next priority will come from the weekly review.':'Nu există activități blocate acum. Următoarea prioritate va veni din verificarea săptămânală.'}</span></li>`;
    return items.map(x => `<li class="now-item now-item-active" data-static-now-item="active"><span class="now-status" aria-hidden="true">🔄</span><span><strong>${x[0]}</strong><span class="now-item-copy">${x[1]}</span><span class="now-next"><b>${en()?'Next step':'Pasul următor'}:</b> ${x[2]}</span><span class="now-tag">${x[3]}</span></span></li>`).join('');
  }

  function performanceDoneHtml(){
    return en()
      ? `<li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Mobile performance pass</strong> — stabilized the hero CSS and font metrics, deferred the below-the-fold poster, reduced mobile paint effects and enabled rendering containment for long sections.</span></li>`
      : `<li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Optimizare performanță mobilă</strong> — am stabilizat CSS-ul și fonturile din hero, am amânat posterul de sub primul ecran, am redus efectele costisitoare pe mobil și am izolat randarea secțiunilor lungi.</span></li>`;
  }

  function qualityDoneHtml(){
    return en()
      ? `<li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Portfolio quality pass</strong> — clarified the Top 3 route, reduced simultaneous project cards, added three real live-demo captures with measurable proof, reached Lighthouse Accessibility 100 and confirmed three consecutive mobile scores above 90: 97, 96 and 95.</span></li>`
      : `<li class="now-item now-item-done"><span class="now-status" aria-hidden="true">✅</span><span><strong>Quality pass portofoliu</strong> — am evidențiat traseul Top 3, am redus cardurile afișate simultan, am adăugat trei capturi reale cu dovezi măsurabile, am obținut Lighthouse Accessibility 100 și am confirmat trei scoruri mobile consecutive peste 90: 97, 96 și 95.</span></li>`;
  }

  function deliveryDoneHtml(){
    return en()
      ? `<li class="now-item now-item-done" data-delivery-completed="2026-09-04"><span class="now-status" aria-hidden="true">✅</span><span><strong>Portfolio delivery sprint</strong> — shipped unified discovery filters, deduplication, WCAG scorecard, Featured Challenges, a public changelog and automated link health checks; also fixed duplicate ClientFlow markup.</span></li>`
      : `<li class="now-item now-item-done" data-delivery-completed="2026-09-04"><span class="now-status" aria-hidden="true">✅</span><span><strong>Sprint de implementare portofoliu</strong> — am livrat căutare și filtre unificate, deduplicare, scorecard WCAG, Featured Challenges, changelog public și verificarea automată a linkurilor; am reparat și marcajul duplicat ClientFlow.</span></li>`;
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
    if(done) done.innerHTML=todayDoneHtml()+deliveryDoneHtml()+qualityDoneHtml()+performanceDoneHtml()+doneHtml();
    const title=document.getElementById('now-title');
    if(title) title.textContent=en()?'What I am working on now':'La ce lucrez acum';
    const note=document.querySelector('#now .now-note');
    if(note) note.textContent=en()?'A small, intentionally current list: what is active, why it matters, and the next concrete step.':'O listă scurtă și intenționat actuală: ce este activ, de ce contează și care este următorul pas concret.';
    const date=document.getElementById('now-datetime');
    if(date){
      date.dateTime='2026-09-04';
      date.textContent='04 Septembrie 2026';
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
        if(document.querySelectorAll('#now-panel-active [data-static-now-item="active"]').length!==(en()?ACTIVE_EN:ACTIVE_RO).length || !document.querySelector('#now-panel-done [data-today-completed="2026-09-04"]')){
          restoreNow();
        }
      });
    }).observe(now,{childList:true,subtree:true});
  }

  function setupProjectCollections(){
    document.querySelectorAll('.collection-toggle[aria-controls]').forEach(button=>{
      if(button.dataset.ready) return;
      const list=document.getElementById(button.getAttribute('aria-controls'));
      if(!list) return;
      button.dataset.ready='1';
      button.addEventListener('click',()=>{
        const expanded=button.getAttribute('aria-expanded')==='true';
        list.classList.toggle('is-expanded',!expanded);
        button.setAttribute('aria-expanded',String(!expanded));
        button.textContent=!expanded?button.dataset.hideLabel:button.dataset.showLabel;
        if(expanded) list.scrollIntoView({block:'nearest'});
      });
    });
  }

  function init(){
    styles();
    restoreNow();
    fixProjectCounts();
    guardNow();
    setupProjectCollections();

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
