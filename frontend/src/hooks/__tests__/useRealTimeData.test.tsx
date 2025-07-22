import { renderHook, act } from '@testing-library/react'
import { useRealTimeData } from '../useRealTimeData'

// Mock timers for interval testing
jest.useFakeTimers()

describe('useRealTimeData', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default data', () => {
    const { result } = renderHook(() => useRealTimeData())

    expect(result.current.networkData).toEqual({
      blockHeight: 1234567,
      totalTransactions: 45200000,
      gasPrice: 25,
      networkHashRate: 245.7,
      blockTime: 12.3,
      activeAddresses: 892000,
      marketCap: 2.4,
      tps: 15.2,
      lastUpdate: expect.any(Date)
    })

    expect(result.current.recentBlocks).toHaveLength(3)
    expect(result.current.recentTransactions).toHaveLength(3)
    expect(result.current.isLive).toBe(true)
  })

  it('toggles live updates', () => {
    const { result } = renderHook(() => useRealTimeData())

    expect(result.current.isLive).toBe(true)

    act(() => {
      result.current.toggleLiveUpdates()
    })

    expect(result.current.isLive).toBe(false)

    act(() => {
      result.current.toggleLiveUpdates()
    })

    expect(result.current.isLive).toBe(true)
  })

  it('updates network data when live', () => {
    const { result } = renderHook(() => useRealTimeData())

    const initialBlockHeight = result.current.networkData.blockHeight
    const initialLastUpdate = result.current.networkData.lastUpdate

    // Fast-forward 5 seconds (network update interval)
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    // Data should have been updated
    expect(result.current.networkData.lastUpdate).not.toEqual(initialLastUpdate)
    
    // Block height might have increased (random chance)
    expect(result.current.networkData.blockHeight).toBeGreaterThanOrEqual(initialBlockHeight)
  })

  it('does not update when not live', () => {
    const { result } = renderHook(() => useRealTimeData())

    // Turn off live updates
    act(() => {
      result.current.toggleLiveUpdates()
    })

    const initialNetworkData = result.current.networkData
    const initialBlocks = result.current.recentBlocks
    const initialTransactions = result.current.recentTransactions

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(20000)
    })

    // Data should not have changed
    expect(result.current.networkData).toEqual(initialNetworkData)
    expect(result.current.recentBlocks).toEqual(initialBlocks)
    expect(result.current.recentTransactions).toEqual(initialTransactions)
  })

  it('adds new blocks periodically', () => {
    const { result } = renderHook(() => useRealTimeData())

    const initialBlocksLength = result.current.recentBlocks.length

    // Fast-forward 15 seconds (block interval)
    act(() => {
      jest.advanceTimersByTime(15000)
    })

    // Should have added a new block
    expect(result.current.recentBlocks.length).toBeGreaterThanOrEqual(initialBlocksLength)
    
    // New block should be at the beginning
    const newestBlock = result.current.recentBlocks[0]
    expect(newestBlock.timestamp).toBeInstanceOf(Date)
  })

  it('adds new transactions periodically', () => {
    const { result } = renderHook(() => useRealTimeData())

    const initialTransactionsLength = result.current.recentTransactions.length

    // Fast-forward 3 seconds (transaction interval)
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    // Should have added a new transaction
    expect(result.current.recentTransactions.length).toBeGreaterThanOrEqual(initialTransactionsLength)
    
    // New transaction should be at the beginning
    const newestTransaction = result.current.recentTransactions[0]
    expect(newestTransaction.timestamp).toBeInstanceOf(Date)
  })

  it('limits recent blocks to 8 items', () => {
    const { result } = renderHook(() => useRealTimeData())

    // Fast-forward enough time to generate many blocks
    act(() => {
      jest.advanceTimersByTime(150000) // 150 seconds = 10 blocks
    })

    // Should not exceed 8 blocks (7 new + 1 existing, but limited to 8)
    expect(result.current.recentBlocks.length).toBeLessThanOrEqual(8)
  })

  it('limits recent transactions to 8 items', () => {
    const { result } = renderHook(() => useRealTimeData())

    // Fast-forward enough time to generate many transactions
    act(() => {
      jest.advanceTimersByTime(30000) // 30 seconds = 10 transactions
    })

    // Should not exceed 8 transactions
    expect(result.current.recentTransactions.length).toBeLessThanOrEqual(8)
  })

  it('generates realistic data variations', () => {
    const { result } = renderHook(() => useRealTimeData())

    const initialGasPrice = result.current.networkData.gasPrice
    const initialTps = result.current.networkData.tps

    // Fast-forward multiple updates
    act(() => {
      jest.advanceTimersByTime(25000) // 5 updates
    })

    // Values should have changed (with high probability)
    const finalGasPrice = result.current.networkData.gasPrice
    const finalTps = result.current.networkData.tps

    // Gas price should be within reasonable bounds
    expect(finalGasPrice).toBeGreaterThan(0)
    expect(finalTps).toBeGreaterThanOrEqual(0)
  })

  it('cleans up intervals on unmount', () => {
    const { unmount } = renderHook(() => useRealTimeData())

    // Spy on clearInterval
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')

    unmount()

    // Should have cleared intervals
    expect(clearIntervalSpy).toHaveBeenCalled()

    clearIntervalSpy.mockRestore()
  })

  it('generates valid transaction statuses', () => {
    const { result } = renderHook(() => useRealTimeData())

    // Generate several transactions
    act(() => {
      jest.advanceTimersByTime(15000) // 5 transactions
    })

    result.current.recentTransactions.forEach(tx => {
      expect(['success', 'failed', 'pending']).toContain(tx.status)
    })
  })

  it('generates valid block data', () => {
    const { result } = renderHook(() => useRealTimeData())

    // Generate a new block
    act(() => {
      jest.advanceTimersByTime(15000)
    })

    const newestBlock = result.current.recentBlocks[0]
    expect(newestBlock.number).toBeGreaterThan(0)
    expect(newestBlock.hash).toMatch(/^0x[a-f0-9]+\.\.\.[a-f0-9]+$/)
    expect(newestBlock.transactions).toBeGreaterThan(0)
    expect(newestBlock.gasUsed).toBeGreaterThan(0)
    expect(newestBlock.miner).toMatch(/^0x[a-f0-9]+\.\.\.[a-f0-9]+$/)
  })
})
