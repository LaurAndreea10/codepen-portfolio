const CACHE='candy-route-v3-1';
const ASSETS=['./','./index.html','./style.css','./app.js','./candy.js','./game.js','./i18n.js','./studio.js','./studio-rules.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
// Waiting workers activate when all old clients close, avoiding mixed module versions.
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('candy-route-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==location.origin||!ASSETS.some(p=>new URL(p,self.registration.scope).pathname===url.pathname))return;e.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(url.pathname);return cached||fetch(e.request);}));});
