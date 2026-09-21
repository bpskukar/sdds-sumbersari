/* SDDS — service worker: tampilan tetap terbuka saat sinyal lemah.
   Berkas situs diambil dari internet lebih dulu (selalu versi terbaru),
   salinan tersimpan hanya dipakai bila internet putus.
   Permintaan ke Google Apps Script / Drive tidak disentuh. */
var CACHE = "sdds-v2";
var INTI = [
  "./", "index.html", "manifest.webmanifest",
  "assets/css/style.css", "assets/js/app.js", "assets/js/akses.js", "assets/js/dasbor.js", "assets/js/pwa.js",
  "data/katalog.js", "assets/img/favicon.svg", "assets/img/icon-192.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(INTI); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE && k.indexOf("sdds-") === 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req).then(function (res) {
      if (res && res.ok) { var salin = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, salin); }); }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (r) {
        return r || (req.mode === "navigate" ? caches.match("index.html") : Response.error());
      });
    }));
    return;
  }
  if (/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(function (r) {
      return r || fetch(req).then(function (res) { var salin = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, salin); }); return res; });
    }));
  }
});
