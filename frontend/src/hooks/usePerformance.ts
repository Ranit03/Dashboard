'use client'

import { useEffect, useState, useCallback } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  connectionType: string
  isSlowConnection: boolean
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
    isSlowConnection: false
  })

  const [isLoading, setIsLoading] = useState(true)

  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined') return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart
    const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart

    // Memory usage (if available)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0

    // Connection information
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    const connectionType = connection?.effectiveType || 'unknown'
    const isSlowConnection = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g'

    setMetrics({
      loadTime,
      renderTime,
      memoryUsage,
      connectionType,
      isSlowConnection
    })

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
      return () => window.removeEventListener('load', measurePerformance)
    }
  }, [measurePerformance])

  const reportWebVitals = useCallback((metric: any) => {
    // Log web vitals for monitoring
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value)
    }

    // In production, you would send this to your analytics service
    // analytics.track('web-vital', {
    //   name: metric.name,
    //   value: metric.value,
    //   id: metric.id,
    //   label: metric.label
    // })
  }, [])

  return {
    metrics,
    isLoading,
    reportWebVitals
  }
}

// Hook for monitoring component render performance
export function useRenderPerformance(componentName: string) {
  const [renderCount, setRenderCount] = useState(0)
  const [lastRenderTime, setLastRenderTime] = useState(0)

  useEffect(() => {
    const startTime = performance.now()
    setRenderCount(prev => prev + 1)

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      setLastRenderTime(renderTime)

      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render`)
      }
    }
  })

  return {
    renderCount,
    lastRenderTime
  }
}

// Hook for lazy loading with intersection observer
export function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, threshold])

  return [setRef, isVisible] as const
}

// Hook for prefetching resources
export function usePrefetch() {
  const prefetchResource = useCallback((href: string, as: 'script' | 'style' | 'image' | 'fetch' = 'fetch') => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    link.as = as
    document.head.appendChild(link)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  const preloadResource = useCallback((href: string, as: 'script' | 'style' | 'image' | 'fetch' = 'fetch') => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  return {
    prefetchResource,
    preloadResource
  }
}

// Hook for optimizing images
export function useImageOptimization() {
  const [supportsWebP, setSupportsWebP] = useState(false)
  const [supportsAVIF, setSupportsAVIF] = useState(false)

  useEffect(() => {
    // Check WebP support
    const webpTest = new Image()
    webpTest.onload = () => setSupportsWebP(true)
    webpTest.onerror = () => setSupportsWebP(false)
    webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'

    // Check AVIF support
    const avifTest = new Image()
    avifTest.onload = () => setSupportsAVIF(true)
    avifTest.onerror = () => setSupportsAVIF(false)
    avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
  }, [])

  const getOptimalFormat = useCallback((originalSrc: string) => {
    if (supportsAVIF) return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif')
    if (supportsWebP) return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    return originalSrc
  }, [supportsWebP, supportsAVIF])

  return {
    supportsWebP,
    supportsAVIF,
    getOptimalFormat
  }
}
