'use strict';
// Ghost Talk service worker: network-first for pages, stale-while-revalidate for files, so updates arrive without a version bump.
const CACHE = 'ghost-talk-v410';
const ROOT = new URL('./', self.location.href).href;
const ASSETS = ['./', 'index.html', 'styles.css', 'engine.js', 'ghosttalk.js', 'ghost.spec.js', 'app.js', 'manifest.webmanifest', 'icon.svg'].map(p => new URL(p, ROOT).href);

self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => (k.startsWith('ghost-talk-') || k.startsWith('ghost-lab-')) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(ROOT)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.mode === 'navigate') {
      try {
        const res = await fetch(event.request);
        if (res.ok) await cache.put(new URL('index.html', ROOT).href, res.clone());
        return res;
      } catch { return (await cache.match(new URL('index.html', ROOT).href)) || Response.error(); }
    }
    const key = url.origin + url.pathname;
    const hit = await cache.match(key);
    const refresh = fetch(event.request).then(res => { if (res.ok) cache.put(key, res.clone()); return res; }).catch(() => null);
    if (hit) { event.waitUntil(refresh); return hit; }
    return (await refresh) || Response.error();
  })());
});
