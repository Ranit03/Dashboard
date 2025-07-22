'use client'

import { useState } from 'react'
import { Eye, Plus, Bell, TrendingUp, TrendingDown, Activity, Wallet, AlertCircle } from 'lucide-react'

interface WalletData {
  address: string
  balance: string
  transactions: number
  lastActivity: string
  alerts: number
}

export default function WalletMonitorPage() {
  const [watchedWallets, setWatchedWallets] = useState<WalletData[]>([
    {
      address: '0x1234...5678',
      balance: '12.45 ETH',
      transactions: 1247,
      lastActivity: '2 minutes ago',
      alerts: 3
    },
    {
      address: '0xabcd...ef90',
      balance: '0.89 ETH',
      transactions: 89,
      lastActivity: '1 hour ago',
      alerts: 0
    }
  ])
  const [newWalletAddress, setNewWalletAddress] = useState('')
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const addWallet = () => {
    if (!newWalletAddress.trim()) return
    
    const newWallet: WalletData = {
      address: newWalletAddress,
      balance: '0.00 ETH',
      transactions: 0,
      lastActivity: 'Never',
      alerts: 0
    }
    
    setWatchedWallets([...watchedWallets, newWallet])
    setNewWalletAddress('')
  }

  const removeWallet = (address: string) => {
    setWatchedWallets(watchedWallets.filter(w => w.address !== address))
  }

  const recentActivities = [
    {
      id: 1,
      wallet: '0x1234...5678',
      type: 'transfer',
      amount: '+2.5 ETH',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      wallet: '0xabcd...ef90',
      type: 'contract_call',
      amount: '-0.1 ETH',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: 3,
      wallet: '0x1234...5678',
      type: 'transfer',
      amount: '-1.0 ETH',
      time: '3 hours ago',
      status: 'failed'
    }
  ]

  const alerts = [
    {
      id: 1,
      wallet: '0x1234...5678',
      type: 'large_transaction',
      message: 'Large outgoing transaction detected: 5.0 ETH',
      time: '5 minutes ago',
      severity: 'warning'
    },
    {
      id: 2,
      wallet: '0x1234...5678',
      type: 'balance_threshold',
      message: 'Balance dropped below 10 ETH threshold',
      time: '1 hour ago',
      severity: 'info'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Eye className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet Monitor</h1>
          <p className="text-muted-foreground">Track wallet activities and set up alerts</p>
        </div>
      </div>

      {/* Add Wallet */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Wallet to Monitor</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter wallet address (0x...)"
            value={newWalletAddress}
            onChange={(e) => setNewWalletAddress(e.target.value)}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={addWallet}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Wallet
          </button>
        </div>
      </div>

      {/* Watched Wallets */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Watched Wallets ({watchedWallets.length})</h3>
        </div>
        <div className="divide-y divide-border">
          {watchedWallets.map((wallet) => (
            <div key={wallet.address} className="p-6 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm">{wallet.address}</code>
                      {wallet.alerts > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-600 rounded-full text-xs">
                          <Bell className="h-3 w-3" />
                          {wallet.alerts}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last activity: {wallet.lastActivity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{wallet.balance}</p>
                  <p className="text-sm text-muted-foreground">
                    {wallet.transactions} transactions
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedWallet(wallet.address)}
                  className="px-3 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80"
                >
                  View Details
                </button>
                <button className="px-3 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80">
                  Set Alerts
                </button>
                <button
                  onClick={() => removeWallet(wallet.address)}
                  className="px-3 py-1 text-sm bg-red-500/10 text-red-600 rounded-md hover:bg-red-500/20"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
          </div>
          <div className="divide-y divide-border">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">{activity.wallet}</code>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activity.status === 'success' 
                          ? 'bg-green-500/10 text-green-600' 
                          : 'bg-red-500/10 text-red-600'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {activity.type.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${
                      activity.amount.startsWith('+') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {activity.amount.startsWith('+') ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-semibold">{activity.amount}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Active Alerts</h3>
            </div>
          </div>
          <div className="divide-y divide-border">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    alert.severity === 'warning' 
                      ? 'text-yellow-600' 
                      : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono">{alert.wallet}</code>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alert.severity === 'warning'
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-blue-500/10 text-blue-600'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
