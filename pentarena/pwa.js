'use strict';
/* PentArena PWA: install prompt, offline status and safe updates (never reloads during a match). */
(()=>{let installPrompt=null,registration=null,reloading=false,failed=false;const lang=()=>document.documentElement.lang==='en'?'en':'ro',
copy={ro:{install:'Instalează jocul',update:'Actualizare disponibilă',ready:'Joc pregătit pentru utilizare offline pe acest dispozitiv.',online:'Online · pregătesc jocul pentru offline',offline:'Offline · progresul rămâne pe acest dispozitiv.',fail:'Pregătirea offline nu a reușit. Jocul online rămâne disponibil.',none:'Modul offline nu este disponibil în acest browser.'},
en:{install:'Install game',update:'Update available',ready:'Game ready for offline use on this device.',online:'Online · preparing offline play',offline:'Offline · progress stays on this device.',fail:'Offline setup failed. Online play remains available.',none:'Offline mode is unavailable in this browser.'}},
label=k=>copy[lang()][k],status=document.getElementById('offlineStatus'),install=document.getElementById('installBtn'),update=document.getElementById('updateApp');
const render=()=>{install.textContent=label('install');update.textContent=label('update');if(failed){status.textContent=label(failed);return;}status.textContent=label(navigator.onLine===false?'offline':navigator.serviceWorker&&navigator.serviceWorker.controller?'ready':'online');};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;install.hidden=false;render();});
window.addEventListener('appinstalled',()=>{installPrompt=null;install.hidden=true;});
install.onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;install.hidden=true;};
update.onclick=()=>{if(registration&&registration.waiting){registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});reloading=true;}else location.reload();};
window.addEventListener('online',render);window.addEventListener('offline',render);new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
if('serviceWorker' in navigator){const had=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{const busy=window.PentArena&&window.PentArena.busy();if(reloading||(had&&!busy)){reloading=true;location.reload();}else{if(had)update.hidden=false;render();}});
  navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(r=>{registration=r;r.update().catch(()=>{});if(r.waiting)update.hidden=false;
    r.addEventListener('updatefound',()=>{const w=r.installing;w&&w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller){update.hidden=false;render();}});});
    navigator.serviceWorker.ready.then(render);}).catch(()=>{failed='fail';render();});}
else{failed='none';}
render();})();
