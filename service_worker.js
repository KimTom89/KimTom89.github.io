self.addEventListener('install', function(e) { console.log("Service Worker Installed") })
self.addEventListener('activate', function(e) { 
    console.log("Service Worker Activate");
    return self.clients.claim();
})
self.addEventListener('fetch', function(e) {
    console.log("Fetch : " + e.request.url);
    if (e.request.url.indexOf(".gif") > -1) {
        e.respondWith(fetch("static/image/megaman22.gif"));
    }
})