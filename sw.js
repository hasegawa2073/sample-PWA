const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};
const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return requestFromCache;
  }
  return fetch(request);
};

self.addEventListener('install', (e) => {
  console.log(`install: ${e}`);
  e.waitUntil(
    addResourcesToCache([
      './sw.js',
      './index.html',
      './main.js',
      './manifest/manifest.webmanifest',
      './manifest/icon-192x192.png',
      './manifest/icon-256x256.png',
      './manifest/icon-384x384.png',
      './manifest/icon-512x512.png',
    ])
  );
});
self.addEventListener('activate', (e) => {
  console.log(`activate: ${e}`);
});
self.addEventListener('fetch', (e) => {
  e.respondWith(cacheFirst(e.request));
});
