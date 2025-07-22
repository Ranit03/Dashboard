'use client'

import { useEffect, useState } from 'react'
import { usePerformance } from '@/hooks/usePerformance'
import { Activity, Clock, Cpu, Wifi, WifiOff } from 'lucide-react'

export function PerformanceMonitor() {
  const { metrics, isLoading } = usePerformance()
  const [isVisible, setIsVisible] = useState(false)

  // Only show in development
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development')
  }, [])

  if (!isVisible || isLoading) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-3 w-3 text-primary" />
        <span className="font-medium">Performance</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Load:
          </span>
          <span className="font-mono">{metrics.loadTime.toFixed(0)}ms</span>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            Render:
          </span>
          <span className="font-mono">{metrics.renderTime.toFixed(0)}ms</span>
        </div>
        
        {metrics.memoryUsage > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span>Memory:</span>
            <span className="font-mono">{(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</span>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            {metrics.isSlowConnection ? (
              <WifiOff className="h-3 w-3 text-red-500" />
            ) : (
              <Wifi className="h-3 w-3 text-green-500" />
            )}
            Network:
          </span>
          <span className="font-mono">{metrics.connectionType}</span>
        </div>
      </div>
    </div>
  )
}

// Web Vitals reporter component
export function WebVitalsReporter() {
  const { reportWebVitals } = usePerformance()

  useEffect(() => {
    // Web vitals reporting would go here
    // For now, just log that the component is active
    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance] Web vitals reporter active')
    }
  }, [reportWebVitals])

  return null
}

// Performance-aware component wrapper
interface PerformanceWrapperProps {
  children: React.ReactNode
  name: string
  threshold?: number
}

export function PerformanceWrapper({ children, name, threshold = 100 }: PerformanceWrapperProps) {
  const [startTime] = useState(() => performance.now())
  
  useEffect(() => {
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    if (renderTime > threshold && process.env.NODE_ENV === 'development') {
      console.warn(`[Performance] ${name} took ${renderTime.toFixed(2)}ms to render (threshold: ${threshold}ms)`)
    }
  })

  return <>{children}</>
}

// Slow connection detector
export function SlowConnectionWarning() {
  const { metrics } = usePerformance()
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (metrics.isSlowConnection) {
      setShowWarning(true)
      const timer = setTimeout(() => setShowWarning(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [metrics.isSlowConnection])

  if (!showWarning) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm">
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 text-yellow-600" />
        <span>Slow connection detected. Some features may load slowly.</span>
      </div>
    </div>
  )
}
