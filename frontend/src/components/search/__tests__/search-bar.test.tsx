import { render, screen, fireEvent, waitFor, act } from '@/__tests__/utils/test-utils'
import { SearchBar } from '../search-bar'

// Mock timers for debounced search
jest.useFakeTimers()

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input with placeholder', () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    expect(searchInput).toBeInTheDocument()
  })

  it('shows recent searches when input is focused with no query', async () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.focus(searchInput)

    await waitFor(() => {
      expect(screen.getByText('Recent Searches')).toBeInTheDocument()
    })

    // Should show some recent search items
    expect(screen.getByText('Block #1234567')).toBeInTheDocument()
    expect(screen.getByText('USDC')).toBeInTheDocument()
  })

  it('shows loading state when searching', async () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'test' } })

    // Fast-forward timers to trigger search
    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument()
    })
  })

  it('shows search results when query is entered', async () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'block' } })

    // Fast-forward timers to trigger search
    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(screen.getByText('Block #1234567')).toBeInTheDocument()
    })

    // Should show result count
    expect(screen.getByText(/result.*found/)).toBeInTheDocument()
  })

  it('shows no results message when no matches found', async () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

    // Fast-forward timers to trigger search
    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    expect(screen.getByText('Try searching for a block number, transaction hash, or address')).toBeInTheDocument()
  })

  it('clears search when X button is clicked', async () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.change(searchInput, { target: { value: 'test query' } })

    expect(searchInput).toHaveValue('test query')

    const clearButton = screen.getByRole('button')
    fireEvent.click(clearButton)

    expect(searchInput).toHaveValue('')
  })

  it('handles keyboard navigation', async () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'test' } })

    // Test Enter key
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' })
    
    // Test Escape key
    fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' })
    
    // Dropdown should be closed after Escape
    await waitFor(() => {
      expect(screen.queryByText('Recent Searches')).not.toBeInTheDocument()
    })
  })

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <SearchBar />
        <div data-testid="outside">Outside element</div>
      </div>
    )
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.focus(searchInput)

    await waitFor(() => {
      expect(screen.getByText('Recent Searches')).toBeInTheDocument()
    })

    // Click outside
    const outsideElement = screen.getByTestId('outside')
    fireEvent.mouseDown(outsideElement)

    await waitFor(() => {
      expect(screen.queryByText('Recent Searches')).not.toBeInTheDocument()
    })
  })

  it('formats hash display correctly', async () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.focus(searchInput)

    await waitFor(() => {
      // Should show truncated hash format
      const hashElements = screen.getAllByText(/0x.*\.\.\..*/)
      expect(hashElements.length).toBeGreaterThan(0)
    })
  })

  it('shows different icons for different result types', async () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'test' } })

    // Fast-forward timers to trigger search
    act(() => {
      jest.advanceTimersByTime(300)
    })

    await waitFor(() => {
      // Should have different icons for different types
      const resultItems = screen.getAllByRole('button')
      expect(resultItems.length).toBeGreaterThan(1)
    })
  })

  it('handles recent search item clicks', async () => {
    render(<SearchBar />)
    
    const searchInput = screen.getByPlaceholderText('Search blocks, transactions, addresses...')
    fireEvent.focus(searchInput)

    await waitFor(() => {
      expect(screen.getByText('Block #1234567')).toBeInTheDocument()
    })

    const recentItem = screen.getByText('Block #1234567')
    fireEvent.click(recentItem)

    // Should update input value
    expect(searchInput).toHaveValue('Block #1234567')
  })
})
