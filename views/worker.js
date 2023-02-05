console.log('Service Worker Loaded...')

self.addEventListener('push', e => {
	const data = e.data.json()
	console.log('🦀 Received Push...', { data })
	self.registration.showNotification(data.title, {
		body: data.body,
		icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Glider.svg',
		image: 'https://images.pexels.com/photos/1860618/pexels-photo-1860618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		// vibrate: [200, 100, 200, 100, 200, 100, 200],
		tag: 'sample',
		actions: [
			{ title: 'clickmeee', name: 'guessYouClicked', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Glider.svg', action: 'clicker' },
			{ title: 'clickme2', name: 'guessYouClicked2', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Glider.svg', action: 'clicker2' },
		]
	})
})

self.addEventListener('notificationclick', function (event) {
	event.notification.close()
	if (event.action === 'clicker') {
		/* eslint-disable  */
		clients.openWindow('/inbox')
		/* eslint-enable  */
		// TODO: fetch create-event endpoint on the server; which should create a new event on the calendar app in user's cloud
	}
})

// In your service worker JavaScript file
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('my-static-cache')
			.then(cache => {
				cache.addAll([
					//   '/',
					'/index.pug',
				])
				// cache.add('/users', new Response(JSON.stringify(users)))
			})
	)
})

// In your service worker JavaScript file
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				if (response) {
					return response
				}
				//   if (event.request.url.endsWith('/profile')) {
				//     return new Response(JSON.stringify(users), { headers: { 'Content-Type': 'application/json' } });
				//   }
				return fetch(event.request)
			})
	)
})