'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/search/search-bar'
import { NetworkStats } from '@/components/dashboard/network-stats'
import { RecentBlocks } from '@/components/dashboard/recent-blocks'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'
import { PluginGrid } from '@/components/plugins/plugin-grid'
import { WelcomeCard } from '@/components/dashboard/welcome-card'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 loading-skeleton" />
          <div className="h-10 w-96 loading-skeleton" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 loading-skeleton" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 loading-skeleton" />
          <div className="h-96 loading-skeleton" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-fade-in-up">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient animate-text-shimmer bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto]">
            BlockDAG Scan++
          </h1>
          <p className="text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Developer-friendly block explorer with advanced debugging tools
          </p>
        </div>
        <div className="w-full lg:w-96 animate-fade-in-right">
          <SearchBar />
        </div>
      </div>

      {/* Welcome Card for new users */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <WelcomeCard />
      </div>

      {/* Network Statistics */}
      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <NetworkStats />
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <QuickActions />
      </div>

      {/* Analytics Charts */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <AnalyticsCharts />
      </div>

      {/* Recent Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <div className="animate-fade-in-left">
          <RecentBlocks />
        </div>
        <div className="animate-fade-in-right">
          <RecentTransactions />
        </div>
      </div>

      {/* Plugin Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Developer Tools</h2>
          <button className="text-sm text-primary hover:underline">
            View All Plugins →
          </button>
        </div>
        <PluginGrid />
      </div>

      {/* Footer Info */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground mb-2">Features</h3>
            <ul className="space-y-1">
              <li>• Real-time block & transaction explorer</li>
              <li>• Advanced contract debugging tools</li>
              <li>• Gas analysis & optimization</li>
              <li>• Wallet monitoring & alerts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">Developer Tools</h3>
            <ul className="space-y-1">
              <li>• Contract diff analyzer</li>
              <li>• Interactive debug console</li>
              <li>• Plugin development SDK</li>
              <li>• API documentation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">Analytics</h3>
            <ul className="space-y-1">
              <li>• Network performance metrics</li>
              <li>• Transaction volume trends</li>
              <li>• Gas price analysis</li>
              <li>• Top addresses & contracts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
