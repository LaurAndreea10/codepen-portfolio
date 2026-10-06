'use strict';
const CACHE='booscary-v41-20261006';
const ROOT=new URL('./',self.location.href).href;
const ASSETS=['./','index.html','index.pen.html','manifest.webmanifest','icon.svg'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('booscary-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin||!url.href.startsWith(ROOT))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(event.request.mode==='navigate'){try{const response=await fetch(event.request);if(response.ok)await cache.put(new URL('index.html',ROOT).href,response.clone());return response}catch{return(await cache.match(new URL('index.html',ROOT).href))||Response.error()}}const key=url.origin+url.pathname;const existing=await cache.match(key);if(existing)return existing;return fetch(event.request)})())});
