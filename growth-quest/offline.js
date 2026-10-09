(()=>{'use strict';
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
function label(ro,en){return document.documentElement.lang==='en'?en:ro}
function update(){let el=document.getElementById('network-state');if(!el){el=document.createElement('span');el.id='network-state';el.className='chip';el.setAttribute('role','status');const host=document.querySelector('.toptools')||document.querySelector('.brand-row');if(host)host.appendChild(el)}el.textContent=navigator.onLine?label('Local · online','Local · online'):label('Offline','Offline')}
window.addEventListener('online',update);window.addEventListener('offline',update);new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});update();
let installEvent=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;if(document.getElementById('install-app'))return;const b=document.createElement('button');b.id='install-app';b.className='small';b.textContent=label('Instalează','Install');b.onclick=async()=>{if(!installEvent)return;await installEvent.prompt();await installEvent.userChoice;installEvent=null;b.remove()};const host=document.querySelector('.toptools')||document.querySelector('.brand-row');host?.appendChild(b)});
})();
