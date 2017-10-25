// Service Worker

var CACHE_NAME = 'web-app-cache-v1';
var urlsToCache = [
	'/dist/',
	'vendor.css',
	'site.css',
	'vendor.js',
	'main-client.js',
];

self.addEventListener('install', function (event) {
	console.log("SW: Service Worker is installed in new caching layer");

	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log('SW: Opened cache. Adding all:', urlsToCache, cache);
				return cache.addAll(urlsToCache);
			})
			.catch( function(err) {
				console.log('SW: Error Caching', err);
			})
	);
});

self.addEventListener('activate', function (event) {
	console.log("SW: Service Worker is activated. cache", caches);
});

self.addEventListener('fetch', function (event) {
	console.log("SW: service worker fetch", event);
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
				// Cache hit - return response
				if (response) {
					console.log("SW: response is in our cache so we'll return that", response)
					return response;
				}

				// IMPORTANT: Clone the request. A request is a stream and
				// can only be consumed once. Since we are consuming this
				// once by cache and once by the browser for fetch, we need
				// to clone the response.
				var fetchRequest = event.request.clone();

				return fetch(fetchRequest).then(
					function (response) {
						// Check if we received a valid response
						if (!response || response.status !== 200 || response.type !== 'basic') {
							console.log("SW: received bad response", response);
							return response;
						}

						// IMPORTANT: Clone the response. A response is a stream
						// and because we want the browser to consume the response
						// as well as the cache consuming the response, we need
						// to clone it so we have two streams.
						var responseToCache = response.clone();

						console.log("SW: caching response", responseToCache);
						caches.open(CACHE_NAME)
							.then(function (cache) {
								cache.put(event.request, responseToCache);
							});

						return response;
					}
				);
			})
	);
});

['error','message','notificationclick', 'notificationclose', 'push', 'rejectionhandled', 'sync', 'unhandledrejection'].forEach(function(ev) {
	self.addEventListener(ev, function() {
        console.log('SW event:', ev.type, ev)
    })
})

console.log("SW self", self);
