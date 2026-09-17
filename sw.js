/* Carton Link V3 service worker: network-first for the app page (picks up new versions), cache fallback offline */
var CACHE = "carton-link-v3";
var FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener("activate", function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if(url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function(res){
    var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copy); }); return res;
  }).catch(function(){ return caches.match(e.request).then(function(m){ return m || caches.match("./index.html"); }); }));
});
