(function(){
  'use strict';
  if (document.getElementById('introOverlay')) return;
  if (sessionStorage.getItem('portfolioIntroSeen') === '1') return;

  var style = document.createElement('style');
  style.textContent = [
    '#introOverlay{position:fixed;inset:0;z-index:99999;overflow:hidden;background:radial-gradient(140% 100% at 50% -20%,#0f2444 0%,transparent 50%),radial-gradient(120% 90% at 50% 120%,#0a1a33 0%,transparent 45%),#050f20;color:#eef3fb;font-family:Sora,system-ui,sans-serif}',
    '#introOverlay .ioAura{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;mix-blend-mode:screen}',
    '#introOverlay .ioA1{width:50vw;height:50vw;background:rgba(77,159,255,.25);top:-12%;left:8%;animation:ioBreath 11s ease-in-out infinite}',
    '#introOverlay .ioA2{width:42vw;height:42vw;background:rgba(120,200,255,.16);bottom:-10%;right:6%;animation:ioBreath 13s ease-in-out infinite -4s}',
    '@keyframes ioBreath{0%,100%{transform:translate(0,0) scale(1);opacity:.7}50%{transform:translate(3vw,-4vh) scale(1.18);opacity:1}}',
    '#introOverlay:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.4;z-index:1;background-image:linear-gradient(rgba(150,180,225,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(150,180,225,.12) 1px,transparent 1px);background-size:64px 64px}',
    '#introOverlay canvas{position:absolute;inset:0;z-index:1;pointer-events:none}',
    '#introOverlay .ioStage{position:relative;height:100%;display:grid;place-items:center;padding:24px;z-index:3}',
    '#introOverlay .ioContent{text-align:center;position:relative;will-change:transform}',
    '#introOverlay .ioCrest{display:flex;align-items:center;justify-content:center;gap:18px;opacity:0;animation:ioFade .9s .2s forwards}',
    '#introOverlay .ioRule{width:clamp(40px,10vw,90px);height:1px;background:linear-gradient(90deg,transparent,rgba(90,169,255,.3))}',
    '#introOverlay .ioRule.r{background:linear-gradient(90deg,rgba(90,169,255,.3),transparent)}',
    '#introOverlay .ioMono{font-family:Fraunces,Georgia,serif;font-style:italic;font-size:22px;color:#5aa9ff}',
    '#introOverlay .ioEyebrow{margin-top:26px;font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.42em;text-transform:uppercase;color:#5f7398;opacity:0;animation:ioFade .9s .5s forwards}',
    '#introOverlay .ioName{margin-top:14px;font-family:Fraunces,Georgia,serif;font-weight:300;font-size:clamp(46px,10vw,118px);line-height:.98;letter-spacing:-.02em;position:relative}',
    '#introOverlay .ioRow{display:block;position:relative}',
    '#introOverlay .ioCh{display:inline-block;opacity:0;transform:translateY(40px) rotateX(-40deg);transform-origin:bottom;animation:ioDrop .7s cubic-bezier(.16,1,.3,1) forwards}',
    '#introOverlay .ioLast .ioCh{color:#5aa9ff}',
    '#introOverlay .ioLast{font-style:italic}',
    '@keyframes ioDrop{to{opacity:1;transform:none}}',
    '#introOverlay .ioName:after{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.55) 50%,transparent 62%);background-size:280% 100%;background-position:160% 0;mix-blend-mode:overlay;opacity:0;animation:ioShine 1.5s 1.2s ease forwards}',
    '@keyframes ioShine{0%{opacity:0;background-position:160% 0}25%{opacity:1}100%{opacity:0;background-position:-60% 0}}',
    '#introOverlay .ioRole{margin-top:24px;font-size:clamp(13px,1.7vw,16px);color:#9fb2d0;letter-spacing:.06em;opacity:0;animation:ioFade 1s 1.15s forwards}',
    '#introOverlay .ioRole b{color:#eef3fb;font-weight:500}',
    '#introOverlay .ioSep{color:#5aa9ff;margin:0 10px}',
    '#introOverlay .ioChips{margin-top:30px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center}',
    '#introOverlay .ioChip{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.04em;color:#9fb2d0;border:1px solid rgba(150,180,225,.12);border-radius:999px;padding:8px 15px;background:rgba(255,255,255,.025);opacity:0;transform:translateY(10px);animation:ioFadeUp .6s forwards}',
    '#introOverlay .ioChip:nth-child(1){animation-delay:1.4s}#introOverlay .ioChip:nth-child(2){animation-delay:1.52s}#introOverlay .ioChip:nth-child(3){animation-delay:1.64s}#introOverlay .ioChip:nth-child(4){animation-delay:1.76s}',
    '#introOverlay .ioChip b{color:#9ccbff;font-weight:500}',
    '@keyframes ioFade{to{opacity:1}}@keyframes ioFadeUp{to{opacity:1;transform:none}}',
    '#introOverlay .ioCurtain{position:absolute;left:0;width:100%;height:50%;z-index:60;background:transparent;transition:transform 1s cubic-bezier(.76,0,.12,1);pointer-events:none}',
    '#introOverlay .ioTop{top:0}#introOverlay .ioBot{bottom:0}',
    '#introOverlay.closing .ioCurtain{background:#050f20}',
    '#introOverlay.done .ioTop{transform:translateY(-100%)}#introOverlay.done .ioBot{transform:translateY(100%)}',
    '#introOverlay.done .ioContent{opacity:0;transform:scale(.97);transition:opacity .5s,transform .8s}',
    '#introOverlay .ioFooter{position:absolute;left:0;right:0;bottom:clamp(24px,5vh,42px);display:flex;align-items:center;gap:20px;padding:0 clamp(24px,6vw,60px);z-index:65}',
    '#introOverlay .ioProg{flex:1;height:1px;background:rgba(255,255,255,.08);position:relative;overflow:hidden}',
    '#introOverlay .ioProg i{position:absolute;inset:0;width:0;background:linear-gradient(90deg,#0f2444,#5aa9ff);animation:ioLoad 4s cubic-bezier(.4,0,.2,1) forwards;box-shadow:0 0 12px rgba(77,159,255,.6)}',
    '@keyframes ioLoad{to{width:100%}}',
    '#introOverlay .ioSkip{background:transparent;border:1px solid rgba(90,169,255,.3);color:#9ccbff;font-family:Sora,system-ui,sans-serif;font-size:13px;letter-spacing:.04em;padding:10px 20px;border-radius:999px;cursor:pointer;transition:.3s;white-space:nowrap}',
    '#introOverlay .ioSkip:hover,#introOverlay .ioSkip:focus{background:#5aa9ff;color:#050f20;border-color:#5aa9ff;outline:none;box-shadow:0 0 24px -4px rgba(90,169,255,.55)}',
    '@media(max-width:560px){#introOverlay .ioFooter{gap:12px;padding:0 18px}#introOverlay .ioSkip{padding:9px 14px;font-size:12px}#introOverlay .ioRole{max-width:310px;margin-left:auto;margin-right:auto;line-height:1.7}}',
    '@media(prefers-reduced-motion:reduce){#introOverlay .ioCrest,#introOverlay .ioEyebrow,#introOverlay .ioRole,#introOverlay .ioChip,#introOverlay .ioProg i,#introOverlay .ioCh{animation:none!important;opacity:1!important;transform:none!important;width:auto!important}#introOverlay .ioName:after{display:none}#introOverlay .ioProg i{width:100%!important}}'
  ].join('');
  document.head.appendChild(style);

  var intro = document.createElement('section');
  intro.id = 'introOverlay';
  intro.setAttribute('aria-label','Intro portofoliu');
  intro.innerHTML = '<div class="ioAura ioA1"></div><div class="ioAura ioA2"></div><canvas></canvas><div class="ioStage"><div class="ioContent"><div class="ioCrest"><span class="ioRule"></span><span class="ioMono">L · A</span><span class="ioRule r"></span></div><div class="ioEyebrow">Portfolio · 2026</div><h1 class="ioName"><span class="ioRow ioFirst" data-text="Laura"></span><span class="ioRow ioLast" data-text="Andreea"></span></h1><div class="ioRole">Front-End <b>CRM &amp; Dashboard</b> Developer <span class="ioSep">·</span> <b>RO</b> / <b>EN</b></div><div class="ioChips"><span class="ioChip"><b>64</b> proiecte live</span><span class="ioChip"><b>6</b> module SaaS</span><span class="ioChip">Vite · React · TS</span><span class="ioChip">CI/CD automat</span></div></div></div><div class="ioCurtain ioTop"></div><div class="ioCurtain ioBot"></div><div class="ioFooter"><div class="ioProg"><i></i></div><button class="ioSkip" type="button">Intră în portofoliu →</button></div>';
  document.body.prepend(intro);
  document.body.style.overflow = 'hidden';

  var rows = intro.querySelectorAll('.ioName .ioRow');
  var runStart = 0.35;
  var per = 0.05;
  rows.forEach(function(row){
    var txt = row.getAttribute('data-text') || '';
    Array.from(txt).forEach(function(ch, i){
      var span = document.createElement('span');
      span.className = 'ioCh';
      span.textContent = ch === ' ' ? '\u00a0' : ch;
      span.style.animationDelay = (runStart + i * per) + 's';
      row.appendChild(span);
    });
    runStart += txt.length * per + 0.18;
  });

  var canvas = intro.querySelector('canvas');
  var ctx = canvas.getContext && canvas.getContext('2d');
  var W = 0, H = 0, raf = 0, parts = [];
  function size(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function makeParts(){
    parts = [];
    for (var i = 0; i < 60; i++) parts.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.4,vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.15,a:Math.random()*.5+.1});
  }
  function draw(){
    if (!ctx) return;
    ctx.clearRect(0,0,W,H);
    parts.forEach(function(p){
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fillStyle = 'rgba(130,185,255,' + p.a + ')'; ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  size(); makeParts(); draw();
  window.addEventListener('resize', function(){ size(); makeParts(); }, {passive:true});

  var content = intro.querySelector('.ioContent');
  var tx=0,ty=0,cx=0,cy=0,done=false;
  intro.addEventListener('mousemove', function(e){ tx=(e.clientX/window.innerWidth-.5)*18; ty=(e.clientY/window.innerHeight-.5)*18; });
  function parallax(){
    cx += (tx-cx)*.06; cy += (ty-cy)*.06;
    if (content) content.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    if (!done) requestAnimationFrame(parallax);
  }
  parallax();

  function finish(){
    if (done) return;
    done = true;
    sessionStorage.setItem('portfolioIntroSeen','1');
    intro.classList.add('closing');
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ intro.classList.add('done'); }); });
    document.body.style.overflow = '';
    setTimeout(function(){ cancelAnimationFrame(raf); if (intro.parentNode) intro.remove(); }, 1150);
  }

  var timer = setTimeout(finish, 4000);
  intro.querySelector('.ioSkip').addEventListener('click', function(){ clearTimeout(timer); finish(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ clearTimeout(timer); finish(); } });
  setTimeout(function(){ if(!done) finish(); }, 7500);
})();
