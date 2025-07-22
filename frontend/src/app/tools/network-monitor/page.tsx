'use client'

import { useState, useEffect } from 'react'
import { Monitor, Activity, Zap, Clock, Users, Database, TrendingUp, AlertTriangle } from 'lucide-react'

export default function NetworkMonitorPage() {
  const [networkStats, setNetworkStats] = useState({
    blockHeight: 1234567,
    tps: 15.2,
    gasPrice: 25,
    blockTime: 12.3,
    activeNodes: 1247,
    totalTransactions: 45200000,
    networkHealth: 98.5,
    lastUpdate: new Date()
  })

  const [isLive, setIsLive] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        blockHeight: prev.blockHeight + Math.random() > 0.7 ? 1 : 0,
        tps: Math.max(0, prev.tps + (Math.random() - 0.5) * 2),
        gasPrice: Math.max(1, prev.gasPrice + (Math.random() - 0.5) * 5),
        blockTime: Math.max(8, prev.blockTime + (Math.random() - 0.5) * 2),
        activeNodes: prev.activeNodes + Math.floor((Math.random() - 0.5) * 10),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 50),
        networkHealth: Math.max(90, Math.min(100, prev.networkHealth + (Math.random() - 0.5) * 2)),
        lastUpdate: new Date()
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const recentBlocks = [
    { number: 1234567, transactions: 163, gasUsed: 59, miner: '0x14f39f...f7cf68', time: '12s' },
    { number: 1234566, transactions: 73, gasUsed: 83, miner: '0xf63880...30f26f', time: '24s' },
    { number: 1234565, transactions: 94, gasUsed: 48, miner: '0x737a9e...2434d8', time: '36s' },
    { number: 1234564, transactions: 130, gasUsed: 20, miner: '0xaab912...c134f8', time: '48s' },
  ]

  const networkAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High gas prices detected (>30 gwei)',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'Block time slightly above average',
      time: '5 minutes ago'
    }
  ]

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600 bg-green-500/10'
    if (health >= 85) return 'text-yellow-600 bg-yellow-500/10'
    return 'text-red-600 bg-red-500/10'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Monitor className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Network Monitor</h1>
            <p className="text-muted-foreground">Real-time network statistics and health monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-sm text-muted-foreground">
              {isLive ? 'Live' : 'Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-md text-sm ${
              isLive 
                ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20' 
                : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
            }`}
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Network Health Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Network Health</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(networkStats.networkHealth)}`}>
            {networkStats.networkHealth.toFixed(1)}% Healthy
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
            style={{ width: `${networkStats.networkHealth}%` }}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">Block Height</span>
          </div>
          <p className="text-2xl font-bold">{networkStats.blockHeight.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">+1 (12s ago)</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">TPS</span>
          </div>
          <p className="text-2xl font-bold">{networkStats.tps.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground mt-1">Transactions/sec</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-muted-foreground">Gas Price</span>
          </div>
          <p className="text-2xl font-bold">{networkStats.gasPrice.toFixed(1)} gwei</p>
          <p className="text-sm text-red-600 mt-1">-5.2% (1h)</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted-foreground">Block Time</span>
          </div>
          <p className="text-2xl font-bold">{networkStats.blockTime.toFixed(1)}s</p>
          <p className="text-sm text-muted-foreground mt-1">Average</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-muted-foreground">Active Nodes</span>
          </div>
          <p className="text-2xl font-bold">{networkStats.activeNodes.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">+2.1% (24h)</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-muted-foreground">Total Transactions</span>
          </div>
          <p className="text-2xl font-bold">{(networkStats.totalTransactions / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-green-600 mt-1">+2.3% (24h)</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-cyan-600" />
            <span className="text-sm font-medium text-muted-foreground">Last Update</span>
          </div>
          <p className="text-lg font-bold">{networkStats.lastUpdate.toLocaleTimeString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Real-time data</p>
        </div>
      </div>

      {/* Recent Blocks & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blocks */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Recent Blocks</h3>
          </div>
          <div className="divide-y divide-border">
            {recentBlocks.map((block) => (
              <div key={block.number} className="p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">#{block.number.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">{block.transactions} txns</span>
                    </div>
                    <code className="text-sm text-muted-foreground">{block.miner}</code>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{block.gasUsed}% gas used</p>
                    <p className="text-sm text-muted-foreground">{block.time} ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Alerts */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Network Alerts</h3>
          </div>
          <div className="divide-y divide-border">
            {networkAlerts.map((alert) => (
              <div key={alert.id} className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
            {networkAlerts.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
