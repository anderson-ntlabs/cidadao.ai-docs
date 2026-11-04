// Service Worker para Cidadão.AI Docs
// Otimizações de cache e performance mobile

const CACHE_NAME = 'cidadao-ai-docs-v1.4';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/css/carousel.css',
    '/assets/css/mobile-optimizations.css',
    '/assets/js/script.js',
    '/assets/js/carousel.js',
    '/assets/js/floating-button.js',
    '/assets/js/mobile-optimizations.js',
    '/assets/agents/abaporu.png',
    '/assets/agents/anita.png',
    '/assets/agents/senna.png',
    '/assets/agents/zumbi.jpeg',
    '/assets/agents/tiradentes.png',
    '/assets/agents/obaluaie.png',
    '/assets/agents/niemeyer.png',
    '/assets/agents/nana.png',
    '/assets/agents/lampiao.png',
    '/assets/agents/ceuci.png',
    '/assets/agents/dandara.png',
    '/assets/agents/machado.png',
    '/assets/agents/bonifacio.png',
    '/assets/agents/deodoro-fonseca.png',
    '/assets/agents/carlos-drummond.png',
    '/assets/agents/maria-quiteria.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Cached all files');
                self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Cache failed', error);
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return cachedResponse;
                }
                
                // Fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Check if response is valid
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone response for cache
                        const responseToCache = response.clone();
                        
                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        console.log('Service Worker: Fetched and cached', event.request.url);
                        return response;
                    })
                    .catch((error) => {
                        console.error('Service Worker: Fetch failed', error);
                        
                        // Return offline page if available
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Push notifications (future feature)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        console.log('Service Worker: Push received', data);
        
        const options = {
            body: data.body,
            icon: '/assets/img/icon-192.png',
            badge: '/assets/img/badge-72.png',
            tag: 'cidadao-ai-notification',
            renotify: true
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event.notification.tag);
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_UPDATE') {
        updateCache();
    }
});

// Utility functions
async function doBackgroundSync() {
    try {
        console.log('Service Worker: Performing background sync');
        // Add background sync logic here
    } catch (error) {
        console.error('Service Worker: Background sync failed', error);
    }
}

async function updateCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_URLS);
        console.log('Service Worker: Cache updated');
    } catch (error) {
        console.error('Service Worker: Cache update failed', error);
    }
}

// Network status monitoring
self.addEventListener('online', () => {
    console.log('Service Worker: Back online');
    updateCache();
});

self.addEventListener('offline', () => {
    console.log('Service Worker: Gone offline');
});

console.log('Service Worker: Loaded and ready');