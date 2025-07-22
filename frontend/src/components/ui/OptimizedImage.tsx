'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import { useLazyLoad, useImageOptimization } from '@/hooks/usePerformance'
import { cn } from '@/utils/cn'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  lazy?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  lazy = true,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [ref, isVisible] = useLazyLoad(0.1)
  const { getOptimalFormat } = useImageOptimization()

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }, [onError])

  // Don't render until visible (if lazy loading is enabled)
  if (lazy && !isVisible && !priority) {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-muted animate-pulse rounded',
          className
        )}
        style={{ width, height }}
      />
    )
  }

  if (hasError) {
    return (
      <div
        className={cn(
          'bg-muted rounded flex items-center justify-center text-muted-foreground text-sm',
          className
        )}
        style={{ width, height }}
      >
        Failed to load image
      </div>
    )
  }

  const optimizedSrc = getOptimalFormat(src)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-muted animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

// Optimized avatar component
interface OptimizedAvatarProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  className?: string
}

export function OptimizedAvatar({
  src,
  alt,
  size = 'md',
  fallback,
  className
}: OptimizedAvatarProps) {
  const [hasError, setHasError] = useState(false)

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const sizePixels = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64
  }

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium',
          sizeClasses[size],
          className
        )}
      >
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={sizePixels[size]}
      height={sizePixels[size]}
      className={cn('rounded-full', sizeClasses[size], className)}
      onError={() => setHasError(true)}
      lazy={false}
    />
  )
}

// Optimized icon component with lazy loading
interface OptimizedIconProps {
  src: string
  alt: string
  size?: number
  className?: string
}

export function OptimizedIcon({
  src,
  alt,
  size = 24,
  className
}: OptimizedIconProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      lazy={false}
      priority={true}
    />
  )
}
