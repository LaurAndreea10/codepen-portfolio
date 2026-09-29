// Grădina Curioasă — service worker pentru joc offline.
// Strategie: întâi rețeaua (versiunea nouă apare imediat după publicare),
// iar fără internet se folosește copia salvată.
const CACHE = 'gradina-curioasa-v7';
const FILES = [
  './', 'index.html', 'feedback.html', 'approved-feedback.json', 'feedback-display.js',
  'expansion.css', 'premium.css', 'arcade.css', 'home.css', 'learning.css', 'extras.css',
  'i18n.js', 'art.js', 'expansion.js', 'premium.js', 'arcade.js', 'home.js', 'learning.js', 'discover.js', 'rewards.js', 'parents.js', 'versus.js', 'languages.js', 'feedback.js',
  'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png',
  'fonts/opendyslexic-latin-400-normal.woff2', 'fonts/opendyslexic-latin-700-normal.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request, { ignoreSearch: true })
        .then(hit => hit || (request.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
