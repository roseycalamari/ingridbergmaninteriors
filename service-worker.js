/**
 * Service Worker for Ingrid Bergman Interiors
 * Provides caching for better performance and offline capabilities
 */

const CACHE_NAME = 'ingrid-bergman-interiors-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/loader.js',
  '/js/navigation.js',
  '/js/page-transitions.js',
  '/js/contact.js',
  '/js/translations.js',
  '/js/performance-optimizer.js',
  '/images/logo white i.png',
  '/images/newportrait.jpg',
  '/images/the service (2).jpg',
  '/images/the brands.jpg',
  '/manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  // Perform install steps - open cache, cache files, confirm caching complete
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // If this cache is not in whitelist, delete it
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip certain URLs that shouldn't be cached
  if (event.request.url.includes('/php/') || 
      event.request.url.includes('chrome-extension://')) {
    return;
  }
  
  // Use "stale-while-revalidate" strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Cache the new response for future use
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // Network request failed, return the cached response or an offline fallback
            return cachedResponse;
          });
        
        // Return the cached response immediately, but update it in the background
        return cachedResponse || fetchPromise;
      })
  );
});

// Handle push notifications (if relevant in the future)
self.addEventListener('push', event => {
  if (event && event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/images/logo white i.png',
      badge: '/images/logo white i.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Ingrid Bergman Interiors', options)
    );
  }
}); 