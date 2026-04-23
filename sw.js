// Service Worker — offline-first caching
const CACHE = 'aqlli-test-v3';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './questions.js',
  './i18n.js',
  './achievements.js',
  './enhancements.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './og-image.jpg'
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (ev) => {
  if (ev.request.method !== 'GET') return;
  ev.respondWith(
    caches.match(ev.request).then(cached =>
      cached || fetch(ev.request).then(resp => {
        if (resp.ok && new URL(ev.request.url).origin === location.origin) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(ev.request, copy));
        }
        return resp;
      }).catch(() => cached)
    )
  );
});
