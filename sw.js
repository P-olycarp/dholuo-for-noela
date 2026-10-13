/* Service worker: lets the app open offline. It always tries the network first, so updates show up right away. */
const CACHE = "dholuo-v9";
const FILES = [
  "./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png",
  "css/tokens.css", "css/base.css", "css/components.css", "css/lesson.css",
  "js/data.js", "js/icons.js", "js/state.js", "js/utils.js", "js/lesson.js", "js/feed.js", "js/views.js", "js/app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((hit) => hit || caches.match("index.html")))
  );
});