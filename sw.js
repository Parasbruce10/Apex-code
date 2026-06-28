const CACHE_NAME = 'apex-code-cache-v2'; // 🔁 version bump — purana v1 cache delete trigger karega
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/logo.png',
  '/manifest.json'
];

// Install: naya SW turant activate ho, purane ka wait na kare
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: purane saare caches delete + sab open tabs pe turant control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames =>
        Promise.all(cacheNames.map(name => name !== CACHE_NAME ? caches.delete(name) : null))
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: NETWORK-FIRST — hamesha fresh file pehle try karo, offline ho tabhi cache se serve karo
self.addEventListener('fetch', event => {
  const req = event.request;

  // ⚠️ Zaroori guard: API calls (POST/PUT/DELETE) aur backend (hf.space) requests
  // ko SW touch nahi karega — warna login/job-post/website-add forms break ho jayenge
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then(networkResponse => {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return networkResponse;
      })
      .catch(() => caches.match(req)) // offline fallback
  );
});