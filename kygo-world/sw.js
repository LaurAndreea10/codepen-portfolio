/* Kygo World service worker: offline play without any backend.
   - Pages: network first, so a new version is visible as soon as it is online; cached copy when offline.
   - Images, icons, manifest: served from cache, refreshed in the background.
   Bump VERSION whenever the list of core files changes. */
const VERSION = "kygo-world-2026.09.30.1";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./manifest-en.webmanifest",
  "./kygo-sprite.webp",
  "./sky-islands.webp",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("kygo-world-") && key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function store(request, response) {
  if (response && response.ok && response.type === "basic") {
    const cache = await caches.open(VERSION);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || !request.url.startsWith(self.registration.scope)) return;
  if (request.mode === "navigate") {
    const response = fetch(request).then(async (r) => {
      if (!r.ok) throw new Error("Navigation unavailable");
      await store(new URL("index.html", self.registration.scope).href, r);
      return r;
    }).catch(() => caches.open(VERSION).then((cache) => cache.match("./index.html").then((r) => r || cache.match("./"))));
    event.respondWith(response);
    event.waitUntil(response.then(() => {}));
    return;
  }
  const fresh = fetch(request).then((r) => store(request, r)).catch(() => undefined);
  event.waitUntil(fresh.then(() => {}));
  event.respondWith(caches.open(VERSION).then(async (cache) =>
    await cache.match(request, { ignoreSearch: true }) || await fresh || Response.error()
  ));
});
