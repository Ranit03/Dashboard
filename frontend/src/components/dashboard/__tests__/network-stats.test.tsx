import { render, screen, fireEvent, waitFor } from '@/__tests__/utils/test-utils'
import { NetworkStats } from '../network-stats'
import * as useRealTimeDataModule from '@/hooks/useRealTimeData'

// Mock the useRealTimeData hook
jest.mock('@/hooks/useRealTimeData')
const mockUseRealTimeData = useRealTimeDataModule.useRealTimeData as jest.MockedFunction<typeof useRealTimeDataModule.useRealTimeData>

const mockNetworkData = {
  blockHeight: 1234567,
  totalTransactions: 45200000,
  gasPrice: 25.5,
  networkHashRate: 245.7,
  blockTime: 12.3,
  activeAddresses: 892000,
  marketCap: 2.4,
  tps: 15.2,
  lastUpdate: new Date()
}

describe('NetworkStats', () => {
  beforeEach(() => {
    mockUseRealTimeData.mockReturnValue({
      networkData: mockNetworkData,
      recentBlocks: [],
      recentTransactions: [],
      isLive: true,
      toggleLiveUpdates: jest.fn()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders network statistics correctly', async () => {
    render(<NetworkStats />)

    await waitFor(() => {
      expect(screen.getByText('Network Statistics')).toBeInTheDocument()
    })

    // Check if all stats are displayed
    expect(screen.getByText('1,234,567')).toBeInTheDocument() // Block height
    expect(screen.getByText('45.2M')).toBeInTheDocument() // Total transactions
    expect(screen.getByText('25.5 gwei')).toBeInTheDocument() // Gas price
    expect(screen.getByText('245.7 TH/s')).toBeInTheDocument() // Hash rate
    expect(screen.getByText('12.3s')).toBeInTheDocument() // Block time
    expect(screen.getByText('892K')).toBeInTheDocument() // Active addresses
    expect(screen.getByText('$2.4B')).toBeInTheDocument() // Market cap
    expect(screen.getByText('15.2')).toBeInTheDocument() // TPS
  })

  it('shows live indicator when data is live', async () => {
    render(<NetworkStats />)

    await waitFor(() => {
      expect(screen.getByText('Live')).toBeInTheDocument()
    })

    const pauseButton = screen.getByText('Pause')
    expect(pauseButton).toBeInTheDocument()
  })

  it('shows paused indicator when data is paused', async () => {
    mockUseRealTimeData.mockReturnValue({
      networkData: mockNetworkData,
      recentBlocks: [],
      recentTransactions: [],
      isLive: false,
      toggleLiveUpdates: jest.fn()
    })

    render(<NetworkStats />)

    await waitFor(() => {
      expect(screen.getByText('Paused')).toBeInTheDocument()
    })

    const resumeButton = screen.getByText('Resume')
    expect(resumeButton).toBeInTheDocument()
  })

  it('calls toggleLiveUpdates when pause/resume button is clicked', async () => {
    const mockToggleLiveUpdates = jest.fn()
    mockUseRealTimeData.mockReturnValue({
      networkData: mockNetworkData,
      recentBlocks: [],
      recentTransactions: [],
      isLive: true,
      toggleLiveUpdates: mockToggleLiveUpdates
    })

    render(<NetworkStats />)

    await waitFor(() => {
      expect(screen.getByText('Pause')).toBeInTheDocument()
    })

    const pauseButton = screen.getByText('Pause')
    fireEvent.click(pauseButton)

    expect(mockToggleLiveUpdates).toHaveBeenCalledTimes(1)
  })

  it('displays loading state initially', () => {
    render(<NetworkStats />)

    // Should show loading skeletons
    const loadingElements = screen.getAllByTestId(/loading-skeleton|animate-pulse/)
    expect(loadingElements.length).toBeGreaterThan(0)
  })

  it('applies correct styling classes', async () => {
    render(<NetworkStats />)

    await waitFor(() => {
      expect(screen.getByText('Network Statistics')).toBeInTheDocument()
    })

    // Check for metric cards
    const metricCards = document.querySelectorAll('.metric-card')
    expect(metricCards.length).toBeGreaterThan(0)

    // Check for hover effects
    const hoverElements = document.querySelectorAll('.hover-lift')
    expect(hoverElements.length).toBeGreaterThan(0)
  })

  it('formats numbers correctly', async () => {
    render(<NetworkStats />)

    await waitFor(() => {
      // Block height should be formatted with commas
      expect(screen.getByText('1,234,567')).toBeInTheDocument()
      
      // Transactions should be in millions
      expect(screen.getByText('45.2M')).toBeInTheDocument()
      
      // Gas price should have decimal
      expect(screen.getByText('25.5 gwei')).toBeInTheDocument()
      
      // Active addresses should be in thousands
      expect(screen.getByText('892K')).toBeInTheDocument()
    })
  })

  it('updates when network data changes', async () => {
    const { rerender } = render(<NetworkStats />)

    await waitFor(() => {
      expect(screen.getByText('1,234,567')).toBeInTheDocument()
    })

    // Update mock data
    const updatedNetworkData = {
      ...mockNetworkData,
      blockHeight: 1234568,
      gasPrice: 30.0
    }

    mockUseRealTimeData.mockReturnValue({
      networkData: updatedNetworkData,
      recentBlocks: [],
      recentTransactions: [],
      isLive: true,
      toggleLiveUpdates: jest.fn()
    })

    rerender(<NetworkStats />)

    await waitFor(() => {
      expect(screen.getByText('1,234,568')).toBeInTheDocument()
      expect(screen.getByText('30.0 gwei')).toBeInTheDocument()
    })
  })
})
