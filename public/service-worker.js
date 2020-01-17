
"use strict";//forces all error helps you write cleaner code

//files to cache for offline use
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/client.js",
  "/install.js",
  "/style.css",
  "/manifest.json"
];

//provides a cache name which allows for different versions of the service workers

const CACHE_NAME = "static-cache-v3";
const DATA_CACHE_NAME = 'data-cache-v1';

//adds an install event to the page that caches offline rescources
self.addEventListener("install", evt => {
  console.log("[ServiceWorker] Install");
  
  //precache static resource here
  evt.waitUntil(
  caches.open(CACHE_NAME).then(cache => {
    console.log("[ServiceWorker] Pre-caching offline page");
    return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); 
});


/* Once your service worker is read to control clients and handle 
* functional events like push and sync, you'll get an activate event 
*/
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
              
  // Remove previous cashed daa from disk. 
  evt.waitUntil(
   caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches.delete(key);
      }
    }));
  })
);
  
// stat controlling all loaded clients w/o reloading them 
  self.clients.claim();
  
});

/* handle fetch events by looking to the network first, and the 
* cache second 
*/
self.addEventListener("fetch", evt => {
  console.log("[ServiceWorker] Fetch", evt.request.url);
  if (evt.request.url.includes("/")) {
    console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            return cache.match(evt.request);
          });
      })
    );
    return;
  }
  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});
