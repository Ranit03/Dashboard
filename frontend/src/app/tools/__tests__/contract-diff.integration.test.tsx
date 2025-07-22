import { render, screen, fireEvent, waitFor } from '@/__tests__/utils/test-utils'
import ContractDiffPage from '../contract-diff/page'

// Mock timers for async operations
jest.useFakeTimers()

describe('Contract Diff Integration', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders contract diff page with all elements', () => {
    render(<ContractDiffPage />)

    // Check header
    expect(screen.getByText('Contract Diff')).toBeInTheDocument()
    expect(screen.getByText('Compare smart contract versions and analyze changes')).toBeInTheDocument()

    // Check input sections
    expect(screen.getByText('Contract A')).toBeInTheDocument()
    expect(screen.getByText('Contract B')).toBeInTheDocument()

    // Check textareas
    const textareas = screen.getAllByRole('textbox')
    expect(textareas).toHaveLength(4) // 2 address inputs + 2 code textareas

    // Check compare button
    const compareButton = screen.getByText('Compare Contracts')
    expect(compareButton).toBeInTheDocument()
    expect(compareButton).toBeDisabled() // Should be disabled initially
  })

  it('enables compare button when both contracts have content', () => {
    render(<ContractDiffPage />)

    const textareas = screen.getAllByRole('textbox')
    const leftTextarea = textareas[1] // First code textarea
    const rightTextarea = textareas[3] // Second code textarea

    // Add content to both textareas
    fireEvent.change(leftTextarea, { target: { value: 'contract A code' } })
    fireEvent.change(rightTextarea, { target: { value: 'contract B code' } })

    const compareButton = screen.getByText('Compare Contracts')
    expect(compareButton).not.toBeDisabled()
  })

  it('shows loading state when comparing contracts', async () => {
    render(<ContractDiffPage />)

    const textareas = screen.getAllByRole('textbox')
    const leftTextarea = textareas[1]
    const rightTextarea = textareas[3]

    // Add content and click compare
    fireEvent.change(leftTextarea, { target: { value: 'contract A code' } })
    fireEvent.change(rightTextarea, { target: { value: 'contract B code' } })

    const compareButton = screen.getByText('Compare Contracts')
    fireEvent.click(compareButton)

    // Should show loading state
    expect(screen.getByText('Comparing...')).toBeInTheDocument()
    expect(compareButton).toBeDisabled()
  })

  it('displays comparison results after analysis', async () => {
    render(<ContractDiffPage />)

    const textareas = screen.getAllByRole('textbox')
    const leftTextarea = textareas[1]
    const rightTextarea = textareas[3]

    // Add content and compare
    fireEvent.change(leftTextarea, { target: { value: 'contract A code' } })
    fireEvent.change(rightTextarea, { target: { value: 'contract B code' } })

    const compareButton = screen.getByText('Compare Contracts')
    fireEvent.click(compareButton)

    // Fast-forward the mock timer
    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      // Should show results
      expect(screen.getByText('Additions')).toBeInTheDocument()
      expect(screen.getByText('Deletions')).toBeInTheDocument()
      expect(screen.getByText('Modifications')).toBeInTheDocument()
      expect(screen.getByText('Detailed Changes')).toBeInTheDocument()
    })

    // Should show summary numbers
    expect(screen.getByText('12')).toBeInTheDocument() // Additions
    expect(screen.getByText('8')).toBeInTheDocument() // Deletions
    expect(screen.getByText('3')).toBeInTheDocument() // Modifications
  })

  it('shows detailed diff changes', async () => {
    render(<ContractDiffPage />)

    const textareas = screen.getAllByRole('textbox')
    const leftTextarea = textareas[1]
    const rightTextarea = textareas[3]

    fireEvent.change(leftTextarea, { target: { value: 'contract A code' } })
    fireEvent.change(rightTextarea, { target: { value: 'contract B code' } })

    const compareButton = screen.getByText('Compare Contracts')
    fireEvent.click(compareButton)

    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      // Should show specific changes
      expect(screen.getByText(/\+ function newFunction/)).toBeInTheDocument()
      expect(screen.getByText(/- function oldFunction/)).toBeInTheDocument()
      expect(screen.getByText(/~ mapping\(address => uint256\)/)).toBeInTheDocument()
    })
  })

  it('handles upload button clicks', () => {
    render(<ContractDiffPage />)

    const uploadButtons = screen.getAllByText('Upload')
    expect(uploadButtons).toHaveLength(2)

    // Click upload buttons (they should be clickable)
    uploadButtons.forEach(button => {
      expect(button).toBeInTheDocument()
      fireEvent.click(button)
    })
  })

  it('handles copy and export actions', async () => {
    render(<ContractDiffPage />)

    const textareas = screen.getAllByRole('textbox')
    const leftTextarea = textareas[1]
    const rightTextarea = textareas[3]

    fireEvent.change(leftTextarea, { target: { value: 'contract A code' } })
    fireEvent.change(rightTextarea, { target: { value: 'contract B code' } })

    const compareButton = screen.getByText('Compare Contracts')
    fireEvent.click(compareButton)

    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      const copyButton = screen.getByText('Copy')
      const exportButton = screen.getByText('Export')

      expect(copyButton).toBeInTheDocument()
      expect(exportButton).toBeInTheDocument()

      // Should be clickable
      fireEvent.click(copyButton)
      fireEvent.click(exportButton)
    })
  })

  it('updates address inputs correctly', () => {
    render(<ContractDiffPage />)

    const addressInputs = screen.getAllByPlaceholderText('Contract address or name')
    expect(addressInputs).toHaveLength(2)

    fireEvent.change(addressInputs[0], { target: { value: '0x1234567890abcdef' } })
    fireEvent.change(addressInputs[1], { target: { value: '0xfedcba0987654321' } })

    expect(addressInputs[0]).toHaveValue('0x1234567890abcdef')
    expect(addressInputs[1]).toHaveValue('0xfedcba0987654321')
  })

  it('shows appropriate color coding for different change types', async () => {
    render(<ContractDiffPage />)

    const textareas = screen.getAllByRole('textbox')
    const leftTextarea = textareas[1]
    const rightTextarea = textareas[3]

    fireEvent.change(leftTextarea, { target: { value: 'contract A code' } })
    fireEvent.change(rightTextarea, { target: { value: 'contract B code' } })

    const compareButton = screen.getByText('Compare Contracts')
    fireEvent.click(compareButton)

    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      // Check for color-coded elements
      const additionElements = document.querySelectorAll('.bg-green-500\\/10')
      const deletionElements = document.querySelectorAll('.bg-red-500\\/10')
      const modificationElements = document.querySelectorAll('.bg-yellow-500\\/10')

      expect(additionElements.length).toBeGreaterThan(0)
      expect(deletionElements.length).toBeGreaterThan(0)
      expect(modificationElements.length).toBeGreaterThan(0)
    })
  })
})
