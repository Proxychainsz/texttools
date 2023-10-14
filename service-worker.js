const cacheName = 'TextTools_v005';
const precacheResources = [
	// '/',
	'service-worker.js',
	'index.html',
	'assets/bg3.webp',
	'assets/caticon.png',
	'assets/right.css',
	'assets/style.css',
	'assets/fonts/fira-code-v21-latin-300.woff2',
	'assets/fonts/fira-code-v21-latin-700.woff2',
	'assets/fonts/fira-code-v21-latin-regular.woff2',
	'assets/fonts/inter-v12-latin-300.woff2',
	'assets/fonts/inter-v12-latin-600.woff2',
	'assets/fonts/inter-v12-latin-regular.woff2',
	'assets/manifest/icon-192x192.png',
	'assets/manifest/icon-256x256.png',
	'assets/manifest/icon-384x384.png',
	'assets/manifest/icon-512x512.png',
	'js/boxentriq.js',
	'js/cryptography.js',
	'js/cyberchef.js',
	'js/enigmator_c.js',
	'js/sw.js',
	'js/texttools.js',
	'js/lib/color-thief.min.js',
	'js/lib/base32/Base32.min.js',
	'js/lib/cryptojs/components/core-min.js',
	'js/lib/cryptojs/components/enc-base64-min.js',
	'js/lib/uuencode/uuencode.js',
	'js/lib/xor/XORCipher.js',
];

self.addEventListener('install', function (e) {
	console.log('[Service Worker] Install');
	e.waitUntil(
		caches
			.open(cacheName)
			.then(function (cache) {
				console.log('[Service Worker] Caching app shell and content');
				return cache.addAll(precacheResources);
			})
			.then(function (e) {
				return self.skipWaiting();
			}),
	);
});

self.addEventListener('fetch', e => {
	e.respondWith(
		(async () => {
			const r = await caches.match(e.request);
			// console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
			if (r) {
				return r;
			}
			const response = await fetch(e.request);
			const cache = await caches.open(cacheName);
			// console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
			cache.put(e.request, response.clone());
			return response;
		})(),
	);
});

self.addEventListener('activate', e => {
	e.waitUntil(
		caches.keys().then(keyList => {
			return Promise.all(
				keyList.map(key => {
					if (key === cacheName) {
						return;
					}
					// console.log(`[Service Worker] Updating from ${key} to ${cacheName}`);
					return caches.delete(key);
				}),
			);
		}),
	);
});
