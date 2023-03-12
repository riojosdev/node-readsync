console.log('Service Worker Loaded...')

self.addEventListener('push', e => {
	const data = e.data.json()
	console.log('🦀 Received Push...', { data })
	self.registration.showNotification(data.title, {
		body: data.body,
		icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Glider.svg',
		image: 'https://images.pexels.com/photos/1860618/pexels-photo-1860618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		tag: 'sample',
		actions: [
			{ title: 'Sync 2 Google', name: 'guessYouClicked', action: 'sync2google' },
		]
	})
})

self.addEventListener('notificationclick', function (event) {
	event.notification.close()
	if (event.action === 'sync2google') {
		/* eslint-disable  */
		clients.openWindow('/google-oauth')
		/* eslint-enable  */
		// TODO: fetch create-event endpoint on the server; which should create a new event on the calendar app in user's cloud
	}
})

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('my-static-cache')
			.then(cache => {
				cache.addAll([
					'/index.pug',
				])
			})
	)
})

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				if (response) {
					return response
				}
				return fetch(event.request)
			})
	)
})