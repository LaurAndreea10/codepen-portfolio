/* Cache only this game's assets; never delete another portfolio app's caches. */
const PREFIX='carpati-enduro-',CACHE=PREFIX+'v2.0.0';
const CORE=['./','./index.html','./expedition-core.js','./case-study.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
// Waiting workers activate only when the user leaves the old page or explicitly updates.
self.addEventListener('message',event=>{if(event.data&&event.data.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url),scope=new URL(self.registration.scope);
 if(url.origin===scope.origin&&!url.pathname.startsWith(scope.pathname))return;
 const local=url.origin===scope.origin,external=['cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname);if(!local&&!external)return;
 const network=async()=>{const response=await fetch(request);if(response.ok||response.type==='opaque'){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{}))}return response};
 if(request.mode==='navigate'){event.respondWith(network().catch(async()=>await caches.match(request)||await caches.match(new URL('index.html',scope).href)));return}
 if(local&&/\.(js|json|webmanifest|html)$/.test(url.pathname)){event.respondWith(network().catch(()=>caches.match(request)));return}
 event.respondWith(caches.match(request).then(hit=>hit||network()));
});
