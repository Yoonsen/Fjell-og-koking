const CACHE_NAME = 'termofisk-nuke';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Tving aktivering umiddelbart
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName)) // Slett ALT i cachen
      );
    }).then(() => {
      return self.clients.claim(); // Ta kontroll over alle åpne faner
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Gå ALLTID direkte til nettverket, ignorer cache
  event.respondWith(
    fetch(event.request).catch(() => {
      // Fallback hvis helt offline og cachen akkurat ble slettet
      return new Response("Nettverksfeil. Vennligst koble til for å få den nye versjonen.");
    })
  );
});
