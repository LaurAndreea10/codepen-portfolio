'use strict';
const CACHE='pentarena-2.1.0-r1',SHELL=['./','./index.html','./style.css','./game.js','./pwa.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./changelog.html',
'./fonts/fraunces-latin-800-normal.woff2','./fonts/fraunces-latin-ext-800-normal.woff2','./fonts/fraunces-latin-800-italic.woff2','./fonts/fraunces-latin-ext-800-italic.woff2',
'./fonts/inter-latin-400-normal.woff2','./fonts/inter-latin-ext-400-normal.woff2','./fonts/inter-latin-600-normal.woff2','./fonts/inter-latin-ext-600-normal.woff2',
'./fonts/jetbrains-mono-latin-700-normal.woff2','./fonts/jetbrains-mono-latin-ext-700-normal.woff2'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(p=>new Request(p,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const old=(await caches.keys()).filter(k=>k.startsWith('pentarena-')&&k!==CACHE);await Promise.all(old.map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('message',e=>{if(e.data&&e.data.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',e=>{const url=new URL(e.request.url),scope=new URL(self.registration.scope);if(e.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
  if(e.request.mode==='navigate'){const rel=url.pathname.slice(scope.pathname.length);if(rel===''||rel==='index.html'||rel==='changelog.html')e.respondWith(fresh(e.request,new URL(rel==='changelog.html'?'./changelog.html':'./index.html',scope).href));return;}
  const names=new Set(SHELL.map(p=>new URL(p,scope).pathname));if(names.has(url.pathname))e.respondWith(url.pathname.includes('/fonts/')?cached(e.request,url.origin+url.pathname):fresh(e.request,url.origin+url.pathname));});
async function fresh(request,key){const cache=await caches.open(CACHE);try{const res=await fetch(request.url,{cache:'no-cache',credentials:'same-origin'});if(res.ok)cache.put(key,res.clone());return res;}catch(err){const hit=await cache.match(key,{ignoreSearch:true});if(hit)return hit;throw err;}}
async function cached(request,key){const cache=await caches.open(CACHE);const hit=await cache.match(key);if(hit)return hit;const res=await fetch(request);if(res.ok)cache.put(key,res.clone());return res;}
