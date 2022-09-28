const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};
const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

self.addEventListener('install', (e) => {
  console.log(`install: ${e}`);
  e.waitUntil(
    addResourcesToCache([
      './sw.js',
      './index.html',
      './main.js',
      './manifest.webmanifest',
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
  e.respondWith(cacheFirst({ request: e.request, fallbackUrl: '' }));
});
