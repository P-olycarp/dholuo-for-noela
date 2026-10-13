/* Service worker: lets the app install and open offline. Saved files show instantly, then refresh in the background.
 * Bump CACHE whenever you change any file, so phones pick up the update on their next visit. */
const CACHE = "dholuo-v12";
const FILES = [
  "./", "index.html", "manifest.webmanifest",
  "icon-180.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png",
  "css/tokens.css", "css/base.css", "css/components.css", "css/lesson.css", "css/mobile.css",
  "js/data.js", "js/icons.js", "js/state.js", "js/utils.js", "js/lesson.js", "js/feed.js", "js/views.js", "js/app.js",
];

self.addEventListener("install", (event) => {
  // Save each file on its own, so one problem file can never stop the app from installing.
  event.waitUntil(caches.open(CACHE).then((cache) => Promise.allSettled(FILES.map((file) => cache.add(file)))));
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
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const saved = await cache.match(request, { ignoreSearch: true });
      const fresh = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => null);
      if (saved) return saved; // instant, and the background fetch above refreshes the copy
      return (await fresh) || (request.mode === "navigate" ? cache.match("index.html") : Response.error());
    })
  );
});