/* Imported by each game's service worker; caches are isolated by scope/version. */
'use strict';
const CACHE=self.KYGO_CACHE;
const SHELL=self.KYGO_SHELL;
const CDN='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(SHELL);
  try{await cache.add(new Request(CDN,{mode:'no-cors'}));}catch{}
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const prefix=self.KYGO_PREFIX;
  await Promise.all((await caches.keys()).filter(k=>k.startsWith(prefix)&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const u=new URL(event.request.url);
  if(u.origin!==self.location.origin&&u.href!==CDN)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE),navigation=event.request.mode==='navigate';
    if(!navigation){const found=await cache.match(event.request);if(found)return found;}
    try{
      const response=await fetch(event.request);
      if(response.ok||response.type==='opaque')await cache.put(event.request,response.clone());
      return response;
    }catch{
      return await cache.match(event.request)||(navigation?await cache.match('./index.html'):null)||Response.error();
    }
  })());
});
