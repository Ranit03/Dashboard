// Service Worker for BlockDAG Scan++
const CACHE_NAME = 'blockdag-scan-plus-v1'
const STATIC_CACHE_NAME = 'blockdag-static-v1'
const DYNAMIC_CACHE_NAME = 'blockdag-dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/_next/static/css/',
  '/_next/static/js/',
]

// API endpoints to cache with different strategies
const API_CACHE_PATTERNS = [
  /^\/api\/blocks/,
  /^\/api\/transactions/,
  /^\/api\/stats/,
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS.filter(url => !url.includes('_next')))
      })
      .then(() => {
        console.log('[SW] Static assets cached')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] Service worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/_next/static/')) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
  } else if (url.pathname.startsWith('/api/')) {
    // API requests - network first with cache fallback
    if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      event.respondWith(networkFirstWithCache(request, DYNAMIC_CACHE_NAME))
    } else {
      // Don't cache other API requests
      event.respondWith(fetch(request))
    }
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    // Static resources - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
  } else {
    // HTML pages - network first
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME))
  }
})

// Cache first strategy - good for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('[SW] Cache hit:', request.url)
      return cachedResponse
    }
    
    console.log('[SW] Cache miss, fetching:', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Cache first failed:', error)
    return new Response('Offline', { status: 503 })
  }
}

// Network first strategy - good for dynamic content
async function networkFirst(request, cacheName) {
  try {
    console.log('[SW] Network first:', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    return new Response('Offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Network first with cache strategy - good for API data
async function networkFirstWithCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      // Only cache for 5 minutes for API data
      const response = networkResponse.clone()
      response.headers.set('sw-cache-timestamp', Date.now().toString())
      cache.put(request, response)
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed for API, trying cache:', request.url)
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      // Check if cache is still fresh (5 minutes)
      const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp')
      if (cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < 5 * 60 * 1000) {
        return cachedResponse
      }
    }
    
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered')
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Implement background sync logic here
  console.log('[SW] Performing background sync')
}

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    console.log('[SW] Push notification received:', data)
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: data.url
      })
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    )
  }
})
