const cacheName = 'TextTools_v017';
const precacheResources = [
	// '/',
	'service-worker.js',
	'index.html',
	'assets/bg0.webp',
	'assets/bg1.webp',
	'assets/bg2.webp',
	'assets/bg3.webp',
	'assets/caticon.svg',
	'assets/favicon.ico',
	'assets/right.css',
	'assets/style.css',
	'assets/tiny-mde.css',
	'assets/fonts/fira-code-v21-latin-300.woff2',
	'assets/fonts/fira-code-v21-latin-700.woff2',
	'assets/fonts/fira-code-v21-latin-regular.woff2',
	'assets/fonts/inter-v12-latin-300.woff2',
	'assets/fonts/inter-v12-latin-600.woff2',
	'assets/fonts/inter-v12-latin-regular.woff2',
	'js/boxentriq.js',
	'js/cryptography.js',
	'js/cyberchef.js',
	'js/enigmator_c.js',
	'js/sw.js',
	'js/texttools.js',
	'js/lib/color-thief.min.js',
	'js/lib/tiny-mde.tiny.js',
	'js/lib/UndoRedo.min.js',
	'js/lib/base32/Base32.min.js',
	'js/lib/cryptojs/components/core-min.js',
	'js/lib/cryptojs/components/enc-base64-min.js',
	'js/lib/uuencode/uuencode.js',
	'js/lib/xor/XORCipher.js',
];

self.addEventListener('install', (e) => {
	console.log('[Service Worker] Install');
	e.waitUntil(
		caches
			.open(cacheName)
			.then((cache) => {
				console.log('[Service Worker] Caching app shell and content');
				return cache.addAll(precacheResources);
			})
			.then((e) => self.skipWaiting()),
	);
});

self.addEventListener('fetch', (e) => {
	if (!(e.request.url.indexOf('http') === 0)) return;
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

self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key === cacheName) {
						return;
					}
					console.log(`[Service Worker] Updating from ${key} to ${cacheName}`);
					return caches.delete(key);
				}),
			);
		}),
	);
});
