/* Alpis Fusion card video demo
   Adds the demo video under the Alpis card title without changing the existing HTML structure. */
(function(){
  'use strict';

  const STYLE_ID = 'alpis-video-card-styles';
  const VIDEO_ID = 'alpisFusionCardVideo';
  const MEDIA_VERSION = 'real-demo-2026-05-17-v2';

  function injectStyles(){
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .card-media{position:relative;border-radius:14px;overflow:hidden;border:1px solid var(--line);background:#081326;aspect-ratio:16/10;margin:4px 0 2px}
      .card-media__label{position:absolute;top:10px;left:10px;z-index:3;display:inline-flex;align-items:center;gap:6px;padding:5px 10px;background:rgba(7,18,38,.85);backdrop-filter:blur(8px);border:1px solid rgba(74,222,128,.35);border-radius:8px;font-size:.68rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--green)}
      .card-media__dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:cardMediaPulse 2s ease-in-out infinite}
      @keyframes cardMediaPulse{0%,100%{opacity:1}50%{opacity:.4}}
      .card-media__video,.card-media__fallback{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
      .card-media__fallback{display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 10% 10%,rgba(79,140,255,.28),transparent 45%),radial-gradient(circle at 90% 90%,rgba(139,92,246,.24),transparent 48%),#081326}
      .card-media__fallback img{width:80%;max-width:280px;opacity:.9}
      .card-media__hint{position:absolute;bottom:10px;right:10px;z-index:3;padding:4px 9px;border-radius:6px;background:rgba(7,18,38,.75);backdrop-filter:blur(8px);border:1px solid var(--line);font-size:.68rem;color:var(--muted);pointer-events:none}
      @media (prefers-reduced-motion: reduce){.card-media__dot{animation:none}.card-media__video{display:none}.card-media__fallback{display:flex}}
      body.light .card-media{background:#e5edf7}
      body.light .card-media__fallback{background:radial-gradient(circle at 10% 10%,rgba(37,99,235,.15),transparent 45%),radial-gradient(circle at 90% 90%,rgba(124,58,237,.12),transparent 48%),#e5edf7}
      body.high-contrast .card-media{background:#000;border-color:#fff}
      body.high-contrast .card-media__label{border-color:#00e5ff;color:#00e5ff}
      body.high-contrast .card-media__dot{background:#00e5ff}
    `;
    document.head.appendChild(style);
  }

  function mediaUrl(path){
    return path + '?v=' + encodeURIComponent(MEDIA_VERSION);
  }

  function createMedia(){
    const media = document.createElement('div');
    media.className = 'card-media';
    media.id = VIDEO_ID;
    media.innerHTML = `
      <span class="card-media__label" aria-hidden="true">
        <span class="card-media__dot"></span>
        <span class="card-media__label-text">Demo live · 48s</span>
      </span>
      <video class="card-media__video" autoplay muted loop playsinline preload="metadata" poster="alpis-fusion-demo-poster.svg" aria-label="Demo Alpis Fusion CRM: kanban, flow builder și dashboard în acțiune">
        <source src="${mediaUrl('media/alpis-fusion-demo.mp4')}" type="video/mp4">
        <source src="${mediaUrl('media/alpis-fusion-demo.webm')}" type="video/webm">
      </video>
      <div class="card-media__fallback" aria-hidden="true">
        <img src="alpis-fusion-demo-poster.svg" alt="" loading="lazy">
      </div>
      <span class="card-media__hint" aria-hidden="true">fără sunet · în buclă</span>
    `;
    const video = media.querySelector('video');
    const fallback = media.querySelector('.card-media__fallback');
    video.addEventListener('error', function(){
      video.style.display = 'none';
      fallback.style.display = 'flex';
    });
    return media;
  }

  function init(){
    if (document.getElementById(VIDEO_ID)) return;
    const title = document.getElementById('key-alpis-title');
    if (!title) return;
    injectStyles();
    title.insertAdjacentElement('afterend', createMedia());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* Enhancement layer loader: loads enhance.css + enhance.js without changing the existing HTML structure. */
(function(){
  'use strict';

  const VERSION = 'portfolio-enhancement-v2-2026-05-18';

  function loadCss(){
    if (document.querySelector('link[href^="enhance.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'enhance.css?v=' + encodeURIComponent(VERSION);
    document.head.appendChild(link);
  }

  function loadJs(){
    if (document.querySelector('script[src^="enhance.js"]')) return;
    const script = document.createElement('script');
    script.src = 'enhance.js?v=' + encodeURIComponent(VERSION);
    script.defer = true;
    document.body.appendChild(script);
  }

  function boot(){
    loadCss();
    loadJs();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
