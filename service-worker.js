var cacheName = 'PWA-Cache';
var filesToCache = [
  './',
  './index.html?launcher=true'
];

//Install
self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

//Activate
self.addEventListener('activate', function (event) {
  console.log('[ServiceWorker] Activate');
});

//Fetch
self.addEventListener('fetch', function (event) {
  console.log('[ServiceWorker] Fetch');
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function (networkResponse) {
        var cloneResponse = networkResponse.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, cloneResponse).catch((error) => {
            console.error('Error in fetch handler:', error.message);
          });
        });
        return networkResponse;
      });
    })
  );
});