/* eslint-disable no-undef */
const CACHE_VERSION = 2;
const CURRENT_CACHES = {
  precache: 'cards-platform-precache-cache-v' + CACHE_VERSION
};


// define a prefix for your cache names. It is recommended to use your project name
workbox.core.setCacheNameDetails({ prefix: '', precache: CURRENT_CACHES.precache, suffix: '' });

// Start of Precaching##########################
// __precacheManifest is the list of resources you want to precache. This list will be generated and imported automatically by workbox during build time
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// End of Precaching############################

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate(),
);

self.addEventListener('install', function (event) {
  // All of these logging statements should be visible via the "Inspect" interface
  // for the relevant SW accessed via chrome://serviceworker-internals
  console.log('Template: Handling install event');

  const urlsToPrefetch = [
    'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
    'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css'
  ]

  workbox.core.skipWaiting();

  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
      return cache.addAll(urlsToPrefetch);
    })
  );

});



self.addEventListener('activate', function (event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Template: Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        // In order for the current ServiceWorker to start immediately without reloading the page.
        console.log('Template: Claiming Session');
        return self.clients.claim();
      });
    })
  );
});


const fetchAndCache = async (cache, { request }) => {
  let res = {};

  try {
    res = await fetch(request);

    if (`${res.status}`.startsWith('2') && request.method === 'GET') {
      await cache.put(request, res.clone());
    }
  } catch (err) {
    console.log('Template: Error While Fetching', err);
  }

  return res;
}

self.addEventListener('fetch', function (event) {
  if (event.request.headers.get('range')) {
    // eslint-disable-next-line no-useless-escape
    var pos = Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);

    console.log('Template: Range request for', event.request.url, ', starting position:', pos);

    event.respondWith(
      caches.open(CURRENT_CACHES.precache)
        .then(function (cache) {
          return cache.match(event.request.url);
        }).then(function (res) {
          if (!res) {
            return fetch(event.request)
              .then(res => {
                return res.arrayBuffer();
              });
          }
          return res.arrayBuffer();
        }).then(function (ab) {
          return new Response(
            ab.slice(pos),
            {
              status: 206,
              statusText: 'Partial Content',
              headers: [
                // ['Content-Type', 'video/webm'],
                ['Content-Range', 'bytes ' + pos + '-' +
                  (ab.byteLength - 1) + '/' + ab.byteLength]]
            });
        }));
  } else {
    console.log('Template: Non-range request for', event.request.url);
    // const cacheFirst = new workbox.strategies.CacheFirst();
    // event.respondWith(workbox.core.strategies.cacheFirst.handle({request: event.request}));
    event.respondWith(
      caches.open(workbox.core.cacheNames.precache).then(function (cache) {
        return cache.match(event.request).then(function (response) {
          if (response) {
            fetchAndCache(cache, event);

            console.log('Template: Response from cache', response);

            return response;
          }

          console.log('Template: No Response from cache, Fetching...');
          return fetchAndCache(cache, event);
        });
      })
    );
  }
});
