'use client'

import { useState, useEffect, useCallback } from 'react'

export interface NetworkData {
  blockHeight: number
  totalTransactions: number
  gasPrice: number
  networkHashRate: number
  blockTime: number
  activeAddresses: number
  marketCap: number
  tps: number
  lastUpdate: Date
}

export interface BlockData {
  number: number
  hash: string
  transactions: number
  gasUsed: number
  miner: string
  timestamp: Date
}

export interface TransactionData {
  hash: string
  from: string
  to: string
  value: string
  gasPrice: number
  status: 'success' | 'failed' | 'pending'
  timestamp: Date
}

export function useRealTimeData() {
  const [networkData, setNetworkData] = useState<NetworkData>({
    blockHeight: 1234567,
    totalTransactions: 45200000,
    gasPrice: 25,
    networkHashRate: 245.7,
    blockTime: 12.3,
    activeAddresses: 892000,
    marketCap: 2.4,
    tps: 15.2,
    lastUpdate: new Date()
  })

  const [recentBlocks, setRecentBlocks] = useState<BlockData[]>([
    {
      number: 1234567,
      hash: '0x14f39f...f7cf68',
      transactions: 163,
      gasUsed: 59,
      miner: '0x14f39f...f7cf68',
      timestamp: new Date(Date.now() - 12000)
    },
    {
      number: 1234566,
      hash: '0xf63880...30f26f',
      transactions: 73,
      gasUsed: 83,
      miner: '0xf63880...30f26f',
      timestamp: new Date(Date.now() - 24000)
    },
    {
      number: 1234565,
      hash: '0x737a9e...2434d8',
      transactions: 94,
      gasUsed: 48,
      miner: '0x737a9e...2434d8',
      timestamp: new Date(Date.now() - 36000)
    }
  ])

  const [recentTransactions, setRecentTransactions] = useState<TransactionData[]>([
    {
      hash: '0x2fd098...f3eba8',
      from: '0x1234...5678',
      to: '0xabcd...ef90',
      value: '0.133',
      gasPrice: 39,
      status: 'success',
      timestamp: new Date(Date.now() - 5000)
    },
    {
      hash: '0x9a7ab5...77edb8',
      from: '0x5678...1234',
      to: '0xef90...abcd',
      value: '7.712',
      gasPrice: 23,
      status: 'failed',
      timestamp: new Date(Date.now() - 8000)
    },
    {
      hash: '0x7e5660...258768',
      from: '0x9012...3456',
      to: '0x7890...bcde',
      value: '3.598',
      gasPrice: 52,
      status: 'success',
      timestamp: new Date(Date.now() - 12000)
    }
  ])

  const [isLive, setIsLive] = useState(true)

  // Simulate real-time updates
  const updateNetworkData = useCallback(() => {
    if (!isLive) return

    setNetworkData(prev => ({
      ...prev,
      blockHeight: prev.blockHeight + (Math.random() > 0.8 ? 1 : 0),
      totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 50),
      gasPrice: Math.max(1, prev.gasPrice + (Math.random() - 0.5) * 5),
      networkHashRate: Math.max(200, prev.networkHashRate + (Math.random() - 0.5) * 10),
      blockTime: Math.max(8, prev.blockTime + (Math.random() - 0.5) * 2),
      activeAddresses: prev.activeAddresses + Math.floor((Math.random() - 0.5) * 100),
      marketCap: Math.max(1, prev.marketCap + (Math.random() - 0.5) * 0.1),
      tps: Math.max(0, prev.tps + (Math.random() - 0.5) * 3),
      lastUpdate: new Date()
    }))
  }, [isLive])

  const addNewBlock = useCallback(() => {
    if (!isLive) return

    const newBlock: BlockData = {
      number: networkData.blockHeight + 1,
      hash: `0x${Math.random().toString(16).substr(2, 6)}...${Math.random().toString(16).substr(2, 6)}`,
      transactions: Math.floor(Math.random() * 200) + 50,
      gasUsed: Math.floor(Math.random() * 80) + 20,
      miner: `0x${Math.random().toString(16).substr(2, 6)}...${Math.random().toString(16).substr(2, 6)}`,
      timestamp: new Date()
    }

    setRecentBlocks(prev => [newBlock, ...prev.slice(0, 7)])
  }, [networkData.blockHeight, isLive])

  const addNewTransaction = useCallback(() => {
    if (!isLive) return

    const statuses: ('success' | 'failed' | 'pending')[] = ['success', 'success', 'success', 'failed', 'pending']
    const newTransaction: TransactionData = {
      hash: `0x${Math.random().toString(16).substr(2, 6)}...${Math.random().toString(16).substr(2, 6)}`,
      from: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
      to: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
      value: (Math.random() * 10).toFixed(3),
      gasPrice: Math.floor(Math.random() * 60) + 15,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: new Date()
    }

    setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 7)])
  }, [isLive])

  // Set up intervals for real-time updates
  useEffect(() => {
    if (!isLive) return

    const networkInterval = setInterval(updateNetworkData, 5000) // Update every 5 seconds
    const blockInterval = setInterval(addNewBlock, 15000) // New block every 15 seconds
    const transactionInterval = setInterval(addNewTransaction, 3000) // New transaction every 3 seconds

    return () => {
      clearInterval(networkInterval)
      clearInterval(blockInterval)
      clearInterval(transactionInterval)
    }
  }, [isLive, updateNetworkData, addNewBlock, addNewTransaction])

  const toggleLiveUpdates = useCallback(() => {
    setIsLive(prev => !prev)
  }, [])

  return {
    networkData,
    recentBlocks,
    recentTransactions,
    isLive,
    toggleLiveUpdates
  }
}
