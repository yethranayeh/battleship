/** @format */

const staticCacheName = "static-v1.1";
const assets = [
	"/",
	"./index.html",
	"./main.js",
	"./icons/favicon.ico",
	"./icons/android-chrome-192x192.png",
	"./icons/android-chrome-512x512.png",
	"./icons/apple-touch-icon.png",
	"./icons/brand.png",
	"./icons/favicon-16x16.png",
	"./icons/favicon-32x32.png",
	"./icons/mstile-150x150.png",
	"./icons/safari-pinned-tab.svg",
	"./browserconfig.xml",
	"./manifest.json",
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/webfonts/fa-brands-400.woff2",
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/webfonts/fa-solid-900.woff2",
	"./89135c096883532cc657.woff2",
	"./ff971242700f520e3f61.woff2"
];

self.addEventListener("install", (event) => {
	// installing

	// Cache
	const preCache = async () => {
		const cache = await caches.open(staticCacheName);
		return cache.addAll(assets);
	};
	event.waitUntil(preCache());
});

self.addEventListener("activate", (event) => {
	// activating

	event.waitUntil(
		caches.keys().then((keys) => {
			// Cycle through every cache for this app, then delete anything that does not match current cache name
			return Promise.all(
				keys
					.filter((key) => {
						return key !== staticCacheName;
					})
					.map((key) => {
						caches.delete(key);
					})
			);
		})
	);
});

self.addEventListener("fetch", (event) => {
	// fetching -> event.request.url

	event.respondWith(
		caches.match(event.request).then((cacheResponse) => {
			return cacheResponse || fetch(event.request);
		})
	);
});
