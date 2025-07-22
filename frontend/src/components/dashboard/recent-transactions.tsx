'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRightLeft, ArrowRight, Clock, CheckCircle, XCircle, Hash } from 'lucide-react'
import { Transaction } from '@/types'
import { useRealTimeData } from '@/hooks/useRealTimeData'

// Mock data for recent transactions
const mockTransactions: Transaction[] = Array.from({ length: 15 }, (_, i) => ({
  hash: `0x${Math.random().toString(16).substr(2, 64)}`,
  blockHash: `0x${Math.random().toString(16).substr(2, 64)}`,
  blockNumber: 1234567 - Math.floor(i / 3),
  transactionIndex: i % 10,
  from: `0x${Math.random().toString(16).substr(2, 40)}`,
  to: Math.random() > 0.1 ? `0x${Math.random().toString(16).substr(2, 40)}` : null,
  value: (Math.random() * 10).toFixed(4),
  gas: '21000',
  gasPrice: Math.floor(Math.random() * 50) + 10 + '000000000',
  gasUsed: Math.floor(Math.random() * 21000) + 21000,
  input: Math.random() > 0.7 ? `0x${Math.random().toString(16).substr(2, 200)}` : '0x',
  nonce: Math.floor(Math.random() * 1000),
  status: Math.random() > 0.05 ? 1 : 0,
  timestamp: Date.now() - (i * 3000), // 3 seconds apart
  logs: [],
  type: Math.random() > 0.8 ? 2 : 0,
  maxFeePerGas: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 + '000000000' : undefined,
  maxPriorityFeePerGas: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 2 + '000000000' : undefined
}))

export function RecentTransactions() {
  const { recentTransactions } = useRealTimeData()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  const formatValue = (value: string) => {
    const num = parseFloat(value)
    if (num === 0) return '0'
    if (num < 0.001) return '<0.001'
    return num.toFixed(3)
  }

  const formatGasPrice = (gasPrice: string) => {
    const gwei = parseInt(gasPrice) / 1000000000
    return `${gwei.toFixed(1)} gwei`
  }

  const getTransactionType = (tx: Transaction) => {
    if (tx.to === null) return 'Contract Creation'
    if (tx.input !== '0x') return 'Contract Call'
    return 'Transfer'
  }

  if (isLoading) {
    return (
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-40 loading-skeleton" />
          <div className="h-4 w-20 loading-skeleton" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 loading-skeleton rounded" />
                <div className="space-y-1">
                  <div className="h-4 w-24 loading-skeleton" />
                  <div className="h-3 w-32 loading-skeleton" />
                </div>
              </div>
              <div className="h-4 w-16 loading-skeleton" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Recent Transactions</h3>
        </div>
        <Link 
          href="/transactions" 
          className="text-sm text-primary hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {recentTransactions.slice(0, 8).map((tx, index) => (
          <Link
            key={tx.hash}
            href={`/tx/${tx.hash}`}
            className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                {tx.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : tx.status === 'failed' ? (
                  <XCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-600" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm font-mono">
                    {formatHash(tx.hash)}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${
                    tx.status === 'success'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : tx.status === 'failed'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Transfer</span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium">
                {tx.value} ETH
              </div>
              <div className="text-xs text-muted-foreground">
                {tx.gasPrice}.0 gwei
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Success rate: 95.2%</span>
          <span>Avg gas: 25.3 gwei</span>
        </div>
      </div>
    </div>
  )
}
