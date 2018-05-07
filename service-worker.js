var cacheName = 'PWA-Cache';
var filesToCache = [
  './',
  './index.html?launcher=true'
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
});

self.addEventListener('fetch', function (event) {
  console.log('[ServiceWorker] Fetch');
  caches.open(cacheName).then(function (cache) {
    return cache.match(event.request).then(function (response) {
      if (response) {
        console.log('Found response in cache:', response);
        return response;
      }
      console.log('Fetching request from the network');
      return fetch(event.request).then(function (networkResponse) {
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      });
    }).catch(function (error) {
      console.error('Error in fetch handler:', error);
      throw error;
    });
  })
});