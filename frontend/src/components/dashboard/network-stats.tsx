'use client'

import { useEffect, useState } from 'react'
import {
  Blocks,
  ArrowRightLeft,
  Zap,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Activity
} from 'lucide-react'
import { useRealTimeData } from '@/hooks/useRealTimeData'

interface NetworkStat {
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: any
  description: string
}

export function NetworkStats() {
  const { networkData, isLive, toggleLiveUpdates } = useRealTimeData()
  const [stats, setStats] = useState<NetworkStat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Update stats based on real-time data
    const updateStats = () => {
      setStats([
        {
          label: 'Latest Block',
          value: networkData.blockHeight.toLocaleString(),
          change: '+1 (12s ago)',
          changeType: 'positive',
          icon: Blocks,
          description: 'Most recent block number'
        },
        {
          label: 'Total Transactions',
          value: `${(networkData.totalTransactions / 1000000).toFixed(1)}M`,
          change: '+2.3% (24h)',
          changeType: 'positive',
          icon: ArrowRightLeft,
          description: 'Total network transactions'
        },
        {
          label: 'Average Gas Price',
          value: `${networkData.gasPrice.toFixed(1)} gwei`,
          change: '-5.2% (1h)',
          changeType: 'positive',
          icon: Zap,
          description: 'Current average gas price'
        },
        {
          label: 'Network Hash Rate',
          value: `${networkData.networkHashRate.toFixed(1)} TH/s`,
          change: '+1.8% (24h)',
          changeType: 'positive',
          icon: Activity,
          description: 'Total network hash rate'
        },
        {
          label: 'Block Time',
          value: `${networkData.blockTime.toFixed(1)}s`,
          change: 'Stable',
          changeType: 'neutral',
          icon: Clock,
          description: 'Average block time'
        },
        {
          label: 'Active Addresses',
          value: `${(networkData.activeAddresses / 1000).toFixed(0)}K`,
          change: '+4.1% (24h)',
          changeType: 'positive',
          icon: Users,
          description: 'Unique active addresses'
        },
        {
          label: 'Market Cap',
          value: `$${networkData.marketCap.toFixed(1)}B`,
          change: '+12.5% (24h)',
          changeType: 'positive',
          icon: DollarSign,
          description: 'Total market capitalization'
        },
        {
          label: 'TPS',
          value: networkData.tps.toFixed(1),
          change: '+0.8 (5m)',
          changeType: 'positive',
          icon: TrendingUp,
          description: 'Transactions per second'
        }
      ])

      setIsLoading(false)
    }

    updateStats()
  }, [networkData])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="metric-card animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-20 loading-skeleton shimmer-effect" />
              <div className="h-8 w-8 loading-skeleton rounded-lg shimmer-effect" />
            </div>
            <div className="h-8 w-24 loading-skeleton mb-1 shimmer-effect" />
            <div className="h-3 w-16 loading-skeleton shimmer-effect" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gradient animate-fade-in-left">Network Statistics</h2>
        <div className="flex items-center space-x-4 animate-fade-in-right">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground professional-card px-3 py-1 rounded-full border-0">
            <div className={`h-2 w-2 rounded-full transition-all duration-300 ${isLive ? 'bg-green-500 animate-pulse pulse-glow' : 'bg-gray-500'}`} />
            <span className="font-medium">{isLive ? 'Live' : 'Paused'}</span>
          </div>
          <button
            onClick={toggleLiveUpdates}
            className={`professional-button px-4 py-2 text-xs rounded-full transition-all duration-300 font-medium shadow-soft hover:shadow-medium ${
              isLive
                ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20'
                : 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/20'
            }`}
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="metric-card hover-lift animate-fade-in-up cursor-pointer group interactive-scale shadow-soft hover:shadow-large transition-all duration-300 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {stat.label}
                  </span>
                  <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-soft">
                    <Icon className="h-4 w-4 text-primary transition-all duration-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold group-hover:text-primary transition-all duration-300 font-mono">
                    {stat.value}
                  </div>
                  <div className={`text-xs flex items-center space-x-1 transition-all duration-300 font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 group-hover:text-green-500'
                      : stat.changeType === 'negative'
                      ? 'text-red-600 group-hover:text-red-500'
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}>
                    <span className="animate-pulse">{stat.change}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/50 group-hover:border-primary/20 transition-colors duration-300">
                  <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">
                    {stat.description}
                  </p>
                </div>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
