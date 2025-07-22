'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Clock, Hash, Wallet, FileCode, ArrowRight, X } from 'lucide-react'
import { SearchBar } from '@/components/search/search-bar'
import { Ripple, TiltCard, StaggeredList } from '@/components/ui/micro-interactions'
import { LoadingSkeleton, PulseLoader } from '@/components/ui/loading'

interface SearchResult {
  type: 'block' | 'transaction' | 'address' | 'contract'
  hash: string
  title: string
  subtitle: string
  timestamp: string
  metadata: any
}

const mockResults: SearchResult[] = [
  {
    type: 'block',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    title: 'Block #1234567',
    subtitle: '25 transactions • 2.5 ETH fees',
    timestamp: '2 minutes ago',
    metadata: { number: 1234567, txCount: 25, fees: '2.5' }
  },
  {
    type: 'transaction',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    title: 'Transaction',
    subtitle: '0.5 ETH • Success • Gas: 21,000',
    timestamp: '5 minutes ago',
    metadata: { value: '0.5', status: 'success', gas: 21000 }
  },
  {
    type: 'address',
    hash: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4',
    title: 'Address',
    subtitle: 'Contract • 1,234 transactions • 45.2 ETH',
    timestamp: '1 hour ago',
    metadata: { isContract: true, txCount: 1234, balance: '45.2' }
  },
  {
    type: 'contract',
    hash: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4',
    title: 'USDC Token Contract',
    subtitle: 'ERC-20 • Verified • 2.1M holders',
    timestamp: '1 day ago',
    metadata: { name: 'USDC', type: 'ERC-20', verified: true, holders: 2100000 }
  }
]

const searchFilters = [
  { id: 'all', label: 'All Results', count: 1247 },
  { id: 'blocks', label: 'Blocks', count: 156 },
  { id: 'transactions', label: 'Transactions', count: 892 },
  { id: 'addresses', label: 'Addresses', count: 143 },
  { id: 'contracts', label: 'Contracts', count: 56 }
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setResults(mockResults)
        setIsLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [query])

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'block':
        return <Hash className="h-5 w-5 text-blue-500" />
      case 'transaction':
        return <Hash className="h-5 w-5 text-green-500" />
      case 'address':
        return <Wallet className="h-5 w-5 text-purple-500" />
      case 'contract':
        return <FileCode className="h-5 w-5 text-orange-500" />
    }
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Advanced Search</h1>
            <p className="text-muted-foreground mt-1">
              Search blocks, transactions, addresses, and contracts with advanced filters
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by hash, address, block number, or contract name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-background pl-12 pr-12 py-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 transition-all duration-300 hover:border-primary/50 focus:border-primary hover:shadow-soft focus:shadow-medium"
            />
            <Ripple>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 professional-button p-2 rounded-lg transition-all duration-300 ${
                  showAdvanced ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Filter className="h-5 w-5" />
              </button>
            </Ripple>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="bg-card border rounded-xl p-6 animate-fade-in-up professional-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Advanced Filters</h3>
              <button
                onClick={() => setShowAdvanced(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <select className="w-full p-2 border rounded-lg bg-background">
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Value Range</label>
                <select className="w-full p-2 border rounded-lg bg-background">
                  <option>Any value</option>
                  <option>0 - 1 ETH</option>
                  <option>1 - 10 ETH</option>
                  <option>10+ ETH</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select className="w-full p-2 border rounded-lg bg-background">
                  <option>All statuses</option>
                  <option>Success</option>
                  <option>Failed</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Filters */}
      {query && (
        <div className="flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {searchFilters.map((filter) => (
            <Ripple key={filter.id}>
              <button
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground shadow-medium'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {filter.label} ({filter.count.toLocaleString()})
              </button>
            </Ripple>
          ))}
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <PulseLoader />
              <span className="text-muted-foreground">Searching...</span>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="professional-card p-6 animate-pulse">
                <LoadingSkeleton lines={3} />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {results.length} results for "{query}"
              </p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Search completed in 0.8s</span>
              </div>
            </div>

            <StaggeredList staggerDelay={100}>
              {results.map((result, index) => (
                <TiltCard key={index} maxTilt={3}>
                  <Ripple>
                    <div className="professional-card p-6 hover:shadow-large transition-all duration-300 cursor-pointer group">
                      <div className="flex items-start space-x-4">
                        <div className="transition-transform duration-200 group-hover:scale-110">
                          {getResultIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold group-hover:text-primary transition-colors duration-200">
                              {result.title}
                            </h3>
                            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                              {result.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {result.subtitle}
                          </p>
                          <div className="flex items-center justify-between">
                            <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">
                              {formatHash(result.hash)}
                            </code>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Ripple>
                </TiltCard>
              ))}
            </StaggeredList>
          </div>
        ) : query.length > 2 ? (
          <div className="text-center py-12 animate-fade-in-up">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or using different filters
            </p>
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start searching</h3>
            <p className="text-muted-foreground">
              Enter a search term to find blocks, transactions, addresses, or contracts
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
