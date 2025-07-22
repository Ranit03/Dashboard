'use client'

import { useState } from 'react'
import { 
  GitCompare, 
  Zap, 
  Bug, 
  Eye, 
  Monitor, 
  BarChart3,
  Settings,
  Download,
  Star,
  Users,
  ExternalLink
} from 'lucide-react'

interface PluginCard {
  id: string
  name: string
  description: string
  category: 'debugging' | 'analysis' | 'monitoring' | 'visualization'
  icon: any
  version: string
  author: string
  downloads: number
  rating: number
  isInstalled: boolean
  isActive: boolean
}

const mockPlugins: PluginCard[] = [
  {
    id: 'contract-diff',
    name: 'Contract Diff Analyzer',
    description: 'Compare smart contract versions and analyze changes with detailed diff views.',
    category: 'analysis',
    icon: GitCompare,
    version: '1.2.0',
    author: 'BlockDAG Team',
    downloads: 1250,
    rating: 4.8,
    isInstalled: true,
    isActive: true
  },
  {
    id: 'gas-profiler',
    name: 'Gas Usage Profiler',
    description: 'Detailed gas analysis with optimization suggestions and cost breakdowns.',
    category: 'analysis',
    icon: Zap,
    version: '2.1.0',
    author: 'GasOptimizer',
    downloads: 2100,
    rating: 4.9,
    isInstalled: true,
    isActive: true
  },
  {
    id: 'debug-console',
    name: 'Interactive Debugger',
    description: 'Step-through transaction debugging with state inspection capabilities.',
    category: 'debugging',
    icon: Bug,
    version: '1.5.2',
    author: 'DebugTools Inc',
    downloads: 890,
    rating: 4.6,
    isInstalled: true,
    isActive: false
  },
  {
    id: 'wallet-tracker',
    name: 'Wallet Activity Monitor',
    description: 'Track wallet activities, set alerts, and monitor transaction patterns.',
    category: 'monitoring',
    icon: Eye,
    version: '1.0.8',
    author: 'WalletWatch',
    downloads: 1560,
    rating: 4.7,
    isInstalled: false,
    isActive: false
  },
  {
    id: 'network-health',
    name: 'Network Health Monitor',
    description: 'Real-time network statistics, performance metrics, and health indicators.',
    category: 'monitoring',
    icon: Monitor,
    version: '3.0.1',
    author: 'NetMonitor',
    downloads: 3200,
    rating: 4.9,
    isInstalled: false,
    isActive: false
  },
  {
    id: 'analytics-pro',
    name: 'Advanced Analytics',
    description: 'Comprehensive analytics dashboard with custom metrics and reporting.',
    category: 'visualization',
    icon: BarChart3,
    version: '2.3.0',
    author: 'Analytics Pro',
    downloads: 1800,
    rating: 4.5,
    isInstalled: false,
    isActive: false
  }
]

export function PluginGrid() {
  const [plugins, setPlugins] = useState(mockPlugins)
  const [filter, setFilter] = useState<'all' | 'installed' | 'active'>('all')

  const filteredPlugins = plugins.filter(plugin => {
    if (filter === 'installed') return plugin.isInstalled
    if (filter === 'active') return plugin.isActive
    return true
  })

  const togglePlugin = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId 
        ? { ...plugin, isActive: !plugin.isActive }
        : plugin
    ))
  }

  const installPlugin = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId 
        ? { ...plugin, isInstalled: true }
        : plugin
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'debugging':
        return 'bg-red-500/10 text-red-600 border-red-500/20'
      case 'analysis':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'monitoring':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'visualization':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
        {[
          { key: 'all', label: 'All Plugins' },
          { key: 'installed', label: 'Installed' },
          { key: 'active', label: 'Active' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlugins.map((plugin, index) => {
          const Icon = plugin.icon
          
          return (
            <div 
              key={plugin.id}
              className="plugin-container hover:shadow-md transition-all duration-200 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="plugin-header">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg border ${getCategoryColor(plugin.category)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{plugin.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      v{plugin.version} by {plugin.author}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {plugin.isActive && (
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                  )}
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="plugin-content">
                <p className="text-sm text-muted-foreground mb-3">
                  {plugin.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{plugin.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span>{plugin.rating}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs border ${getCategoryColor(plugin.category)}`}>
                    {plugin.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {plugin.isInstalled ? (
                    <>
                      <button
                        onClick={() => togglePlugin(plugin.id)}
                        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          plugin.isActive
                            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        {plugin.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="p-1.5 hover:bg-accent rounded-md">
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => installPlugin(plugin.id)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                    >
                      Install
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPlugins.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-2">No plugins found</div>
          <p className="text-sm text-muted-foreground">
            {filter === 'installed' 
              ? 'You haven\'t installed any plugins yet.'
              : filter === 'active'
              ? 'No plugins are currently active.'
              : 'No plugins available.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
