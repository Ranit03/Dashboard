'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, Hash, Wallet, FileCode } from 'lucide-react'
import { SearchResult } from '@/types'
import { Ripple, MorphingIcon } from '@/components/ui/micro-interactions'

const mockSearchResults: SearchResult[] = [
  {
    type: 'block',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    title: 'Block #1234567',
    subtitle: '25 transactions • 2 minutes ago',
    metadata: { number: 1234567, timestamp: Date.now() - 120000 }
  },
  {
    type: 'transaction',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    title: 'Transaction',
    subtitle: '0.5 ETH • Success',
    metadata: { value: '0.5', status: 'success' }
  },
  {
    type: 'address',
    hash: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4',
    title: 'Address',
    subtitle: 'Contract • 1,234 transactions',
    metadata: { isContract: true, txCount: 1234 }
  },
  {
    type: 'contract',
    hash: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4',
    title: 'USDC Token Contract',
    subtitle: 'ERC-20 • Verified',
    metadata: { name: 'USDC', type: 'ERC-20', verified: true }
  }
]

const recentSearches = [
  'Block #1234567',
  '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4',
  'USDC',
  '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
]

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true)
      // Simulate API search
      const timer = setTimeout(() => {
        const filteredResults = mockSearchResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.hash.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filteredResults)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setIsLoading(false)
    }
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Navigate to search results page
      console.log('Searching for:', searchQuery)
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'block':
        return <Hash className="h-4 w-4 text-blue-500" />
      case 'transaction':
        return <Hash className="h-4 w-4 text-green-500" />
      case 'address':
        return <Wallet className="h-4 w-4 text-purple-500" />
      case 'contract':
        return <FileCode className="h-4 w-4 text-orange-500" />
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search blocks, transactions, addresses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-input bg-background pl-10 pr-10 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 transition-all duration-300 hover:border-primary/50 focus:border-primary hover:shadow-soft focus:shadow-medium group-focus-within:bg-accent/20"
        />
        {query && (
          <Ripple>
            <button
              onClick={() => {
                setQuery('')
                setResults([])
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground professional-button p-1 rounded-md transition-all duration-200"
            >
              <MorphingIcon
                icon1={<X className="h-4 w-4" />}
                icon2={<Search className="h-4 w-4" />}
                isToggled={false}
              />
            </button>
          </Ripple>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover/95 backdrop-blur-md border rounded-xl shadow-large z-50 max-h-96 overflow-y-auto animate-fade-in-up professional-card">
          {query.length <= 2 ? (
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                    className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {search.length > 42 ? formatHash(search) : search}
                  </button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-2 py-1 mb-2">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              {results.map((result, index) => (
                <Ripple key={index}>
                  <button
                    onClick={() => handleSearch(result.hash)}
                    className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-accent/80 rounded-lg text-left transition-all duration-300 hover:scale-[1.02] transform interactive-scale group animate-fade-in-left"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="transition-transform duration-200 group-hover:scale-110">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-200">
                        {result.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {result.subtitle}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded-md group-hover:bg-primary/10 transition-colors duration-200">
                      {formatHash(result.hash)}
                    </div>
                  </button>
                </Ripple>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for a block number, transaction hash, or address
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
