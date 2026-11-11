/* Kygo: Arhipelagul — offline cache (cache first, then network). Bump CACHE when index.html changes. */
const CACHE = 'kygo-arhipelagul-v2.0.0';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(SHELL);
    try { await c.add(new Request(CDN, { mode: 'no-cors' })); } catch (_) {}
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('kygo-arhipelagul-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const u = e.request.url;
    if (u.startsWith(self.registration.scope) || u.includes('fonts.g') || u === CDN) {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
    }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
