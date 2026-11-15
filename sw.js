// Wildwood service worker: keeps the app shell and any text you have opened available offline.
// Requests to the database are never cached.
const V = 'wildwood-v8';
const SHELL = ['./', 'index.html', 'app.css', 'app.js', 'content.js', 'lessons.js', 'vendor/supabase.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // network first so updates arrive (texts can gain plain-English versions), cache as the offline fallback
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const copy = r.clone(); caches.open(V).then((c) => c.put(e.request, copy)); } return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html'))));
});
