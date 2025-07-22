'use client'

import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className="relative">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-primary/20 border-t-primary',
          sizeClasses[size],
          className
        )}
      />
      <div
        className={cn(
          'absolute inset-0 animate-ping rounded-full border border-primary/40',
          sizeClasses[size]
        )}
      />
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg shimmer-effect animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('metric-card animate-pulse shimmer-effect', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-32 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg" />
        <div className="h-8 w-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-xl" />
      </div>
      <div className="space-y-3">
        <div className="h-8 w-24 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg" />
        <div className="h-3 w-16 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg" />
        <div className="h-3 w-full bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg" />
      </div>
    </div>
  )
}

interface LoadingTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function LoadingTable({ rows = 5, columns = 4, className }: LoadingTableProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center space-x-4 p-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 loading-skeleton"
              style={{ 
                width: colIndex === 0 ? '20%' : colIndex === columns - 1 ? '15%' : '25%' 
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface LoadingPageProps {
  title?: string
  description?: string
}

export function LoadingPage({ title = 'Loading...', description }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}

interface LoadingButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function LoadingButton({ 
  children, 
  isLoading = false, 
  className, 
  disabled,
  onClick 
}: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}

// Lazy loading wrapper component
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LazyWrapper({ children, fallback, className }: LazyWrapperProps) {
  return (
    <div className={cn('min-h-[200px]', className)}>
      <React.Suspense fallback={fallback || <LoadingCard />}>
        {children}
      </React.Suspense>
    </div>
  )
}

// Import React for Suspense
import React from 'react'

// Professional pulse loader
interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PulseLoader({ size = 'md', className }: PulseLoaderProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary rounded-full animate-pulse',
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}

// Gradient loading bar
interface LoadingBarProps {
  className?: string
  progress?: number
}

export function LoadingBar({ className, progress }: LoadingBarProps) {
  return (
    <div className={cn('w-full bg-muted rounded-full h-2 overflow-hidden', className)}>
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-300 ease-out animate-shimmer"
        style={{
          width: progress ? `${progress}%` : '100%',
          backgroundSize: '200% 100%'
        }}
      />
    </div>
  )
}

// Sophisticated skeleton grid
interface SkeletonGridProps {
  rows?: number
  columns?: number
  className?: string
}

export function SkeletonGrid({ rows = 3, columns = 4, className }: SkeletonGridProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg shimmer-effect animate-pulse"
              style={{
                animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
