'use client'

import dynamic from 'next/dynamic'
import { LoadingPage } from '@/components/ui/loading'

// Lazy load developer tool components
export const LazyContractDiff = dynamic(
  () => import('@/app/tools/contract-diff/page'),
  {
    loading: () => <LoadingPage title="Loading Contract Diff..." description="Preparing contract comparison tools" />,
    ssr: false
  }
)

export const LazyGasAnalyzer = dynamic(
  () => import('@/app/tools/gas-analyzer/page'),
  {
    loading: () => <LoadingPage title="Loading Gas Analyzer..." description="Initializing gas analysis tools" />,
    ssr: false
  }
)

export const LazyDebugConsole = dynamic(
  () => import('@/app/tools/debug/page'),
  {
    loading: () => <LoadingPage title="Loading Debug Console..." description="Setting up debugging environment" />,
    ssr: false
  }
)

export const LazyWalletMonitor = dynamic(
  () => import('@/app/tools/wallet-monitor/page'),
  {
    loading: () => <LoadingPage title="Loading Wallet Monitor..." description="Connecting to wallet monitoring services" />,
    ssr: false
  }
)

export const LazyNetworkMonitor = dynamic(
  () => import('@/app/tools/network-monitor/page'),
  {
    loading: () => <LoadingPage title="Loading Network Monitor..." description="Establishing network connections" />,
    ssr: false
  }
)

// Lazy load dashboard components
export const LazyAnalyticsCharts = dynamic(
  () => import('@/components/dashboard/analytics-charts').then(mod => ({ default: mod.AnalyticsCharts })),
  {
    loading: () => (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 loading-skeleton" />
          <div className="h-4 w-20 loading-skeleton" />
        </div>
        <div className="space-y-4">
          <div className="h-64 loading-skeleton rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 loading-skeleton rounded" />
            <div className="h-32 loading-skeleton rounded" />
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
)

export const LazyPluginGrid = dynamic(
  () => import('@/components/plugins/plugin-grid').then(mod => ({ default: mod.PluginGrid })),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 w-24 loading-skeleton" />
              <div className="h-6 w-16 loading-skeleton rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full loading-skeleton" />
              <div className="h-4 w-3/4 loading-skeleton" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="h-4 w-16 loading-skeleton" />
              <div className="h-8 w-20 loading-skeleton rounded" />
            </div>
          </div>
        ))}
      </div>
    ),
    ssr: false
  }
)
