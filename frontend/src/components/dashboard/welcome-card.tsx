'use client'

import { useState } from 'react'
import { X, Zap, GitCompare, Bug, Eye, BarChart3 } from 'lucide-react'

export function WelcomeCard() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-6 relative animate-fade-in-up professional-card shadow-large overflow-hidden">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground professional-button p-1 rounded-md transition-all duration-200 z-10"
      >
        <X className="h-4 w-4 transition-transform duration-200 hover:scale-110 hover:rotate-90" />
      </button>

      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-gradient-x opacity-50" />

      <div className="flex items-start space-x-4 relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary pulse-glow floating-element shadow-glow">
          <Zap className="h-6 w-6 text-primary-foreground animate-pulse" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-gradient animate-text-shimmer bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto]">
            Welcome to BlockDAG Scan++
          </h3>
          <p className="text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Your developer-friendly block explorer with advanced debugging tools and analytics.
            Explore the blockchain like never before with our comprehensive suite of tools.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 text-sm hover:text-primary transition-all duration-300 cursor-pointer group professional-card p-2 rounded-lg border-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <GitCompare className="h-4 w-4 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <span className="group-hover:font-medium transition-all duration-200">Contract Diff</span>
            </div>
            <div className="flex items-center space-x-2 text-sm hover:text-primary transition-all duration-300 cursor-pointer group professional-card p-2 rounded-lg border-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Zap className="h-4 w-4 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <span className="group-hover:font-medium transition-all duration-200">Gas Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm hover:text-primary transition-all duration-300 cursor-pointer group professional-card p-2 rounded-lg border-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <Bug className="h-4 w-4 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <span className="group-hover:font-medium transition-all duration-200">Debug Console</span>
            </div>
            <div className="flex items-center space-x-2 text-sm hover:text-primary transition-all duration-300 cursor-pointer group professional-card p-2 rounded-lg border-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <Eye className="h-4 w-4 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <span className="group-hover:font-medium transition-all duration-200">Wallet Monitor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
