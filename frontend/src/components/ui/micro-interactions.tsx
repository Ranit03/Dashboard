'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'

// Ripple effect component
interface RippleProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function Ripple({ className, children, onClick }: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 600)

    onClick?.()
  }

  return (
    <div
      className={cn('relative overflow-hidden cursor-pointer', className)}
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  )
}

// Magnetic button effect
interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  strength?: number
}

export function MagneticButton({ children, className, onClick, strength = 0.3 }: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <button
      className={cn('transition-transform duration-200 ease-out', className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Tilt card effect
interface TiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
}

export function TiltCard({ children, className, maxTilt = 10 }: TiltCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const tiltX = ((e.clientY - centerY) / rect.height) * maxTilt
    const tiltY = ((e.clientX - centerX) / rect.width) * -maxTilt
    
    setTilt({ x: tiltX, y: tiltY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      className={cn('transition-transform duration-300 ease-out', className)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

// Floating action button with tooltip
interface FloatingActionButtonProps {
  icon: React.ReactNode
  tooltip: string
  onClick?: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}

export function FloatingActionButton({ 
  icon, 
  tooltip, 
  onClick, 
  position = 'bottom-right',
  className 
}: FloatingActionButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  return (
    <div className={cn('fixed z-50', positionClasses[position])}>
      <button
        className={cn(
          'w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-large hover:shadow-glow transition-all duration-300 hover:scale-110 floating-element',
          className
        )}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {icon}
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-popover text-popover-foreground text-sm rounded-lg shadow-medium animate-fade-in-up whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover" />
        </div>
      )}
    </div>
  )
}

// Morphing icon button
interface MorphingIconProps {
  icon1: React.ReactNode
  icon2: React.ReactNode
  isToggled: boolean
  onClick?: () => void
  className?: string
}

export function MorphingIcon({ icon1, icon2, isToggled, onClick, className }: MorphingIconProps) {
  return (
    <button
      className={cn('relative overflow-hidden transition-all duration-300', className)}
      onClick={onClick}
    >
      <div
        className={cn(
          'transition-all duration-300 transform',
          isToggled ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        )}
      >
        {icon1}
      </div>
      <div
        className={cn(
          'absolute inset-0 transition-all duration-300 transform',
          isToggled ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
        )}
      >
        {icon2}
      </div>
    </button>
  )
}

// Staggered list animation
interface StaggeredListProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
}

export function StaggeredList({ children, className, staggerDelay = 100 }: StaggeredListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-fade-in-left"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Progress ring
interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({ progress, size = 40, strokeWidth = 4, className }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-500 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}
