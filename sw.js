const CACHE_NAME = 'termofisk-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './icon.svg',
  './manifest.json'
];

// Installerer Service Worker og lagrer filene i cachen (for offline bruk)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacher offline-ressurser');
      return cache.addAll(ASSETS);
    })
  );
});

// Svarer på nettverksforespørsler fra cachen hvis vi er offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Returner filen fra cache hvis den finnes, ellers hent fra nettverket
      return response || fetch(event.request);
    })
  );
});

// Rydder opp i gamle cacher hvis vi oppdaterer versjonsnummeret
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
