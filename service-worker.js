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
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch');
  var request = event.request;
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((response) => {
        var responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
            cache.put(request, responseToCache).catch((error) => {
              console.warn(request.url + ': ' + error.message);
            });
          });
        return response;
      });
    })
  );
});