'use client'

import { useState, useEffect } from 'react'
import { 
  FileCode, 
  Shield, 
  Search, 
  Filter, 
  Eye, 
  Copy, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  Code,
  Download,
  Star
} from 'lucide-react'
import { Ripple, TiltCard, StaggeredList, MorphingIcon } from '@/components/ui/micro-interactions'
import { LoadingCard, PulseLoader, LoadingSkeleton } from '@/components/ui/loading'

interface Contract {
  address: string
  name: string
  type: string
  verified: boolean
  compiler: string
  optimization: boolean
  runs: number
  createdAt: string
  transactions: number
  balance: string
  creator: string
  tags: string[]
  description: string
  sourceCode?: string
}

const mockContracts: Contract[] = [
  {
    address: '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4',
    name: 'USDC Token Contract',
    type: 'ERC-20',
    verified: true,
    compiler: 'v0.8.19+commit.7dd6d404',
    optimization: true,
    runs: 200,
    createdAt: '2024-01-15T10:30:00Z',
    transactions: 2156789,
    balance: '0.0',
    creator: '0x1234567890abcdef1234567890abcdef12345678',
    tags: ['token', 'stablecoin', 'defi'],
    description: 'USD Coin (USDC) is a fully collateralized US dollar stablecoin.'
  },
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'UniswapV3Pool',
    type: 'DEX',
    verified: true,
    compiler: 'v0.7.6+commit.7338295f',
    optimization: true,
    runs: 1000000,
    createdAt: '2024-01-10T14:20:00Z',
    transactions: 892456,
    balance: '125.7',
    creator: '0xabcdef1234567890abcdef1234567890abcdef12',
    tags: ['dex', 'amm', 'liquidity'],
    description: 'Uniswap V3 liquidity pool for automated market making.'
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'MultiSigWallet',
    type: 'Wallet',
    verified: false,
    compiler: 'v0.8.20+commit.a1b79de6',
    optimization: false,
    runs: 0,
    createdAt: '2024-01-20T09:15:00Z',
    transactions: 45,
    balance: '50.2',
    creator: '0x9876543210fedcba9876543210fedcba98765432',
    tags: ['wallet', 'multisig', 'security'],
    description: 'Multi-signature wallet for enhanced security.'
  },
  {
    address: '0x9876543210fedcba9876543210fedcba98765432',
    name: 'NFT Marketplace',
    type: 'ERC-721',
    verified: true,
    compiler: 'v0.8.18+commit.87f61d96',
    optimization: true,
    runs: 500,
    createdAt: '2024-01-05T16:45:00Z',
    transactions: 15678,
    balance: '12.8',
    creator: '0x5555666677778888999900001111222233334444',
    tags: ['nft', 'marketplace', 'art'],
    description: 'Decentralized marketplace for trading NFTs.'
  }
]

const contractTypes = [
  { id: 'all', label: 'All Contracts', count: 15847 },
  { id: 'erc20', label: 'ERC-20 Tokens', count: 8923 },
  { id: 'erc721', label: 'ERC-721 NFTs', count: 3456 },
  { id: 'dex', label: 'DEX/AMM', count: 1234 },
  { id: 'defi', label: 'DeFi Protocols', count: 2234 }
]

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    const timer = setTimeout(() => {
      setContracts(mockContracts)
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = selectedType === 'all' || 
                       contract.type.toLowerCase().includes(selectedType.toLowerCase()) ||
                       contract.tags.includes(selectedType)
    
    const matchesVerification = !showVerifiedOnly || contract.verified

    return matchesSearch && matchesType && matchesVerification
  })

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-4">
          <LoadingSkeleton lines={1} className="h-8 w-64" />
          <LoadingSkeleton lines={1} className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Smart Contracts</h1>
          <p className="text-muted-foreground mt-1">
            Explore and analyze smart contracts on the BlockDAG network
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contracts by name, address, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 transition-all duration-300 hover:border-primary/50 focus:border-primary hover:shadow-soft focus:shadow-medium"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="transactions">Most Transactions</option>
              <option value="balance">Highest Balance</option>
            </select>

            <Ripple>
              <button
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  showVerifiedOnly
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Verified Only</span>
              </button>
            </Ripple>
          </div>
        </div>

        {/* Contract Type Filters */}
        <div className="flex flex-wrap gap-2">
          {contractTypes.map((type) => (
            <Ripple key={type.id}>
              <button
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === type.id
                    ? 'bg-primary text-primary-foreground shadow-medium'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {type.label} ({type.count.toLocaleString()})
              </button>
            </Ripple>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <p className="text-sm text-muted-foreground">
          Found {filteredContracts.length} contracts
        </p>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Live data</span>
        </div>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <StaggeredList staggerDelay={100}>
          {filteredContracts.map((contract, index) => (
            <TiltCard key={contract.address} maxTilt={3}>
              <Ripple>
                <div className="professional-card p-6 hover:shadow-large transition-all duration-300 cursor-pointer group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                        <FileCode className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors duration-200">
                          {contract.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-muted/50 px-2 py-1 rounded-full">
                            {contract.type}
                          </span>
                          {contract.verified ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span className="text-xs">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-yellow-600">
                              <AlertCircle className="h-3 w-3" />
                              <span className="text-xs">Unverified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(contract.address)}
                      className="p-1 hover:bg-accent rounded transition-colors duration-200"
                    >
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Address */}
                  <div className="mb-4">
                    <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">
                      {formatAddress(contract.address)}
                    </code>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {contract.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Transactions</div>
                      <div className="font-semibold">{contract.transactions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Balance</div>
                      <div className="font-semibold">{contract.balance} ETH</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {contract.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(contract.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-accent rounded transition-colors duration-200">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-accent rounded transition-colors duration-200">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </Ripple>
            </TiltCard>
          ))}
        </StaggeredList>
      </div>

      {/* Empty State */}
      {filteredContracts.length === 0 && !isLoading && (
        <div className="text-center py-12 animate-fade-in-up">
          <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No contracts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  )
}
