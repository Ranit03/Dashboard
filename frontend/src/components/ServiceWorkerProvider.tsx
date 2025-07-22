'use client'

import { useEffect, useState } from 'react'

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      registerServiceWorker()
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set initial online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('[SW] Service worker registered:', registration)

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New service worker available')
              setUpdateAvailable(true)
            }
          })
        }
      })

      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[SW] Message from service worker:', event.data)
      })

    } catch (error) {
      console.error('[SW] Service worker registration failed:', error)
    }
  }

  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      })
    }
  }

  return (
    <>
      {children}
      
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            You are currently offline. Some features may not work.
          </div>
        </div>
      )}

      {/* Update available notification */}
      {updateAvailable && (
        <div className="fixed bottom-4 left-4 z-50 bg-blue-500 text-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Update Available</p>
              <p className="text-sm opacity-90">A new version of the app is ready.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setUpdateAvailable(false)}
                className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                Later
              </button>
              <button
                onClick={updateServiceWorker}
                className="px-3 py-1 text-sm bg-white text-blue-500 rounded hover:bg-white/90 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Hook for checking online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Hook for service worker updates
export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true)
                }
              })
            }
          })
        }
      })
    }
  }, [])

  const updateApp = async () => {
    if (!('serviceWorker' in navigator)) return

    setIsUpdating(true)
    
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
      }
    } catch (error) {
      console.error('[SW] Update failed:', error)
      setIsUpdating(false)
    }
  }

  return {
    updateAvailable,
    isUpdating,
    updateApp,
    dismissUpdate: () => setUpdateAvailable(false)
  }
}
