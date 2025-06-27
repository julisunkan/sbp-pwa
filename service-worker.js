const CACHE_NAME = 'sbp-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/settings.js',
  './js/builder.js',
  './js/form-generator.js',
  './js/zip-generator.js',
  './js/main.js',
  // Add other assets you want cached (icons, bootstrap, etc.)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
