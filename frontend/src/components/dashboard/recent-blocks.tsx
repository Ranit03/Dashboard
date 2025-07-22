'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Blocks, ArrowRight, Clock, Hash, User } from 'lucide-react'
import { Block } from '@/types'
import { useRealTimeData } from '@/hooks/useRealTimeData'

// Mock data for recent blocks
const mockBlocks: Block[] = Array.from({ length: 10 }, (_, i) => ({
  hash: `0x${Math.random().toString(16).substr(2, 64)}`,
  number: 1234567 - i,
  timestamp: Date.now() - (i * 12000), // 12 seconds apart
  parentHash: `0x${Math.random().toString(16).substr(2, 64)}`,
  miner: `0x${Math.random().toString(16).substr(2, 40)}`,
  difficulty: '12345678901234567890',
  totalDifficulty: '123456789012345678901234567890',
  size: Math.floor(Math.random() * 50000) + 10000,
  gasLimit: '30000000',
  gasUsed: Math.floor(Math.random() * 25000000) + 5000000,
  transactions: [],
  transactionCount: Math.floor(Math.random() * 200) + 50,
  uncles: [],
  nonce: `0x${Math.random().toString(16).substr(2, 16)}`,
  mixHash: `0x${Math.random().toString(16).substr(2, 64)}`,
  extraData: '0x',
  baseFeePerGas: Math.floor(Math.random() * 50) + 10 + ' gwei'
}))

export function RecentBlocks() {
  const { recentBlocks } = useRealTimeData()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const calculateGasUsedPercentage = (gasUsed: string, gasLimit: string) => {
    const used = parseInt(gasUsed)
    const limit = parseInt(gasLimit)
    return Math.round((used / limit) * 100)
  }

  if (isLoading) {
    return (
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 loading-skeleton" />
          <div className="h-4 w-20 loading-skeleton" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 loading-skeleton rounded" />
                <div className="space-y-1">
                  <div className="h-4 w-20 loading-skeleton" />
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
          <Blocks className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Recent Blocks</h3>
        </div>
        <Link 
          href="/blocks" 
          className="text-sm text-primary hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {recentBlocks.slice(0, 8).map((block, index) => (
          <Link
            key={block.hash}
            href={`/block/${block.number}`}
            className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                <Hash className="h-4 w-4 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">
                    #{formatNumber(block.number)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {block.transactions} txns
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(block.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium">
                {formatHash(block.miner)}
              </div>
              <div className="text-xs text-muted-foreground">
                {block.gasUsed}% gas used
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Average block time: 12.3s</span>
          <span>Latest: #{formatNumber(recentBlocks[0]?.number || 0)}</span>
        </div>
      </div>
    </div>
  )
}
