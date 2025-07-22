import { renderHook, act } from '@testing-library/react'
import { usePerformance, useRenderPerformance, useLazyLoad } from '../usePerformance'

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  getEntriesByType: jest.fn(() => [
    {
      loadEventEnd: 1000,
      loadEventStart: 900,
      domContentLoadedEventEnd: 800,
      domContentLoadedEventStart: 700,
    }
  ]),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000,
  },
}

// Mock navigator
const mockNavigator = {
  onLine: true,
  connection: {
    effectiveType: '4g',
  },
}

describe('usePerformance', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'performance', {
      writable: true,
      value: mockPerformance,
    })
    
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: mockNavigator,
    })

    // Mock document.readyState
    Object.defineProperty(document, 'readyState', {
      writable: true,
      value: 'complete',
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with loading state', () => {
    const { result } = renderHook(() => usePerformance())

    expect(result.current.isLoading).toBe(true)
  })

  it('measures performance metrics correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePerformance())

    await waitForNextUpdate()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.metrics).toEqual({
      loadTime: 100, // 1000 - 900
      renderTime: 100, // 800 - 700
      memoryUsage: 1000000,
      connectionType: '4g',
      isSlowConnection: false,
    })
  })

  it('detects slow connection', async () => {
    // Mock slow connection
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        ...mockNavigator,
        connection: {
          effectiveType: '2g',
        },
      },
    })

    const { result, waitForNextUpdate } = renderHook(() => usePerformance())

    await waitForNextUpdate()

    expect(result.current.metrics.isSlowConnection).toBe(true)
    expect(result.current.metrics.connectionType).toBe('2g')
  })

  it('handles missing performance API gracefully', async () => {
    Object.defineProperty(window, 'performance', {
      writable: true,
      value: {
        getEntriesByType: jest.fn(() => []),
      },
    })

    const { result, waitForNextUpdate } = renderHook(() => usePerformance())

    await waitForNextUpdate()

    expect(result.current.metrics.loadTime).toBe(0)
    expect(result.current.metrics.renderTime).toBe(0)
  })

  it('reports web vitals correctly', () => {
    const { result } = renderHook(() => usePerformance())

    const mockMetric = {
      name: 'CLS',
      value: 0.1,
      id: 'test-id',
      label: 'test-label',
    }

    // Should not throw
    act(() => {
      result.current.reportWebVitals(mockMetric)
    })
  })
})

describe('useRenderPerformance', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'performance', {
      writable: true,
      value: mockPerformance,
    })
  })

  it('tracks render count and time', () => {
    const { result, rerender } = renderHook(() => useRenderPerformance('TestComponent'))

    expect(result.current.renderCount).toBe(1)

    rerender()
    expect(result.current.renderCount).toBe(2)

    rerender()
    expect(result.current.renderCount).toBe(3)
  })

  it('measures render time', () => {
    let startTime = 100
    let endTime = 120

    mockPerformance.now
      .mockReturnValueOnce(startTime)
      .mockReturnValueOnce(endTime)

    const { result } = renderHook(() => useRenderPerformance('TestComponent'))

    expect(result.current.lastRenderTime).toBe(20) // 120 - 100
  })
})

describe('useLazyLoad', () => {
  let mockObserver: any

  beforeEach(() => {
    mockObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }

    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      mockObserver.callback = callback
      return mockObserver
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with not visible state', () => {
    const { result } = renderHook(() => useLazyLoad())

    const [setRef, isVisible] = result.current
    expect(typeof setRef).toBe('function')
    expect(isVisible).toBe(false)
  })

  it('observes element when ref is set', () => {
    const { result } = renderHook(() => useLazyLoad())

    const [setRef] = result.current
    const mockElement = document.createElement('div')

    act(() => {
      setRef(mockElement)
    })

    expect(mockObserver.observe).toHaveBeenCalledWith(mockElement)
  })

  it('becomes visible when intersecting', () => {
    const { result } = renderHook(() => useLazyLoad())

    const [setRef] = result.current
    const mockElement = document.createElement('div')

    act(() => {
      setRef(mockElement)
    })

    // Simulate intersection
    act(() => {
      mockObserver.callback([{ isIntersecting: true }])
    })

    const [, isVisible] = result.current
    expect(isVisible).toBe(true)
    expect(mockObserver.disconnect).toHaveBeenCalled()
  })

  it('uses custom threshold', () => {
    const customThreshold = 0.5
    renderHook(() => useLazyLoad(customThreshold))

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: customThreshold }
    )
  })

  it('cleans up observer on unmount', () => {
    const { result, unmount } = renderHook(() => useLazyLoad())

    const [setRef] = result.current
    const mockElement = document.createElement('div')

    act(() => {
      setRef(mockElement)
    })

    unmount()

    expect(mockObserver.disconnect).toHaveBeenCalled()
  })
})
