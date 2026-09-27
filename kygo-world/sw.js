/* Kygo World service worker: offline play without any backend.
   - Pages: network first, so a new version is visible as soon as it is online; cached copy when offline.
   - Images, icons, manifest: served from cache, refreshed in the background.
   Bump VERSION whenever the list of core files changes. */
const VERSION = "kygo-world-2026.09.27.4";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
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

function store(request, response) {
  if (response && response.ok && response.type === "basic") {
    const copy = response.clone();
    caches.open(VERSION).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || !request.url.startsWith(self.registration.scope)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => store("./index.html", response))
        .catch(() => caches.match("./index.html").then((cached) => cached || caches.match("./")))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      const fresh = fetch(request)
        .then((response) => store(request, response))
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
