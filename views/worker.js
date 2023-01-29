console.log("Service Worker Loaded...")

self.addEventListener("push", e => {
    const data = e.data.json()
    console.log("🦀 Received Push...", { data })
    self.registration.showNotification(data.body, {
        body: data.body,
        icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Glider.svg"
    })
})

// In your service worker JavaScript file
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('my-static-cache')
            .then(cache => {
                cache.addAll([
                    //   '/',
                    '/users.pug',
                ])
                // cache.add('/users', new Response(JSON.stringify(users)))
            })
    );
});

// In your service worker JavaScript file
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                //   if (event.request.url.endsWith('/profile')) {
                //     return new Response(JSON.stringify(users), { headers: { 'Content-Type': 'application/json' } });
                //   }
                return fetch(event.request);
            })
    );
});