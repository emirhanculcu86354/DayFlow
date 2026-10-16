/* Dayflow service worker — uygulama kabuğunu önbelleğe alır, çevrimdışı açılmayı sağlar.
   Yeni sürüm yayınlarken VERSION'ı artır; eski önbellek otomatik silinir. */
const VERSION = "dayflow-1.2.0";
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "dayflow-icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "privacy.html",
  "terms.html"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Sayfa gezintisi: önce ağ (güncel sürüm), çevrimdışıysa önbellek
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
    return;
  }

  // Google Fonts ve kendi dosyalarımız: önbellek, arkada güncelle
  if (url.origin === location.origin || url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com") {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(res => { if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});

// Bildirime dokununca uygulamayı öne getir
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    const w = list.find(c => "focus" in c);
    return w ? w.focus() : self.clients.openWindow("./");
  }));
});
