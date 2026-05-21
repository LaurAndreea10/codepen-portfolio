(function(){
  if (sessionStorage.getItem('portfolioIntroSeen')) return;
  var s=document.createElement('style');
  s.textContent='#introOverlay{position:fixed;inset:0;z-index:99999;background:#050f20;color:#eef3fb;display:grid;place-items:center;text-align:center;font-family:system-ui,sans-serif;transition:.6s}#introOverlay.hide{opacity:0;visibility:hidden}#introOverlay h1{font-family:Georgia,serif;font-size:clamp(46px,10vw,110px);font-weight:300;margin:10px 0}#introOverlay em{color:#d8b878}#introOverlay p{color:#9fb2d0}#introOverlay button{margin-top:26px;border:1px solid #d8b878;background:transparent;color:#e7cf9e;border-radius:999px;padding:10px 18px;cursor:pointer}#introOverlay button:hover{background:#d8b878;color:#050f20}';
  document.head.appendChild(s);
  var el=document.createElement('div');
  el.id='introOverlay';
  el.innerHTML='<div><div style="letter-spacing:.3em;text-transform:uppercase;color:#d8b878;font-size:12px">Portfolio 2026</div><h1>Laura <em>Andreea</em></h1><p>Front-End CRM and Dashboard Developer</p><p>64 proiecte live · Vite · React · TypeScript</p><button type="button">Intra in portofoliu</button></div>';
  document.body.prepend(el);
  function close(){sessionStorage.setItem('portfolioIntroSeen','1');el.classList.add('hide');setTimeout(function(){el.remove();},700)}
  el.querySelector('button').onclick=close;
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  setTimeout(close,4200);
})();
