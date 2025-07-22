import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data generators
export const mockBlockData = {
  number: 1234567,
  hash: '0x14f39f...f7cf68',
  transactions: 163,
  gasUsed: 59,
  miner: '0x14f39f...f7cf68',
  timestamp: new Date(Date.now() - 12000)
}

export const mockTransactionData = {
  hash: '0x2fd098...f3eba8',
  from: '0x1234...5678',
  to: '0xabcd...ef90',
  value: '0.133',
  gasPrice: 39,
  status: 'success' as const,
  timestamp: new Date(Date.now() - 5000)
}

export const mockNetworkData = {
  blockHeight: 1234567,
  totalTransactions: 45200000,
  gasPrice: 25,
  networkHashRate: 245.7,
  blockTime: 12.3,
  activeAddresses: 892000,
  marketCap: 2.4,
  tps: 15.2,
  lastUpdate: new Date()
}

// Test helpers
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

export const createMockWebSocket = () => {
  const mockWebSocket = {
    send: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    readyState: WebSocket.OPEN,
  }
  
  global.WebSocket = jest.fn(() => mockWebSocket) as any
  return mockWebSocket
}
