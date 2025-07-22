'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Zap, 
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { TiltCard, Ripple, ProgressRing } from '@/components/ui/micro-interactions'
import { LoadingCard, PulseLoader } from '@/components/ui/loading'

interface AnalyticsData {
  totalTransactions: number
  totalValue: number
  activeAddresses: number
  networkHashRate: number
  avgBlockTime: number
  gasPrice: number
  marketCap: number
  volume24h: number
}

const mockAnalytics: AnalyticsData = {
  totalTransactions: 45678923,
  totalValue: 1234567.89,
  activeAddresses: 234567,
  networkHashRate: 456.7,
  avgBlockTime: 12.3,
  gasPrice: 25.4,
  marketCap: 89.2,
  volume24h: 2345.67
}

const timeRanges = [
  { id: '1h', label: '1H' },
  { id: '24h', label: '24H' },
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
  { id: '1y', label: '1Y' }
]

const chartData = [
  { name: 'Jan', transactions: 4000, value: 2400, users: 2400 },
  { name: 'Feb', transactions: 3000, value: 1398, users: 2210 },
  { name: 'Mar', transactions: 2000, value: 9800, users: 2290 },
  { name: 'Apr', transactions: 2780, value: 3908, users: 2000 },
  { name: 'May', transactions: 1890, value: 4800, users: 2181 },
  { name: 'Jun', transactions: 2390, value: 3800, users: 2500 }
]

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('24h')
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const analyticsCards = [
    {
      title: 'Total Transactions',
      value: analytics.totalTransactions.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Value Locked',
      value: `$${analytics.totalValue.toLocaleString()}B`,
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Active Addresses',
      value: `${(analytics.activeAddresses / 1000).toFixed(0)}K`,
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Network Hash Rate',
      value: `${analytics.networkHashRate} TH/s`,
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Avg Block Time',
      value: `${analytics.avgBlockTime}s`,
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: Activity,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Gas Price',
      value: `${analytics.gasPrice} gwei`,
      change: '-5.7%',
      changeType: 'positive' as const,
      icon: Zap,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Market Cap',
      value: `$${analytics.marketCap}B`,
      change: '+18.9%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10'
    },
    {
      title: '24h Volume',
      value: `$${analytics.volume24h}M`,
      change: '+7.4%',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    }
  ]

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg shimmer-effect" />
          <div className="h-4 w-96 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg shimmer-effect" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Network Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into BlockDAG network performance and metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
            {timeRanges.map((range) => (
              <Ripple key={range.id}>
                <button
                  onClick={() => setSelectedRange(range.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                    selectedRange === range.id
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {range.label}
                </button>
              </Ripple>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Ripple>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="professional-button p-2 rounded-lg border hover:bg-accent transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </Ripple>
            <Ripple>
              <button className="professional-button p-2 rounded-lg border hover:bg-accent transition-all duration-200">
                <Download className="h-4 w-4" />
              </button>
            </Ripple>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon
          const isPositive = card.changeType === 'positive'
          
          return (
            <TiltCard key={card.title} maxTilt={5}>
              <div
                className="professional-card p-6 hover:shadow-large transition-all duration-300 animate-fade-in-up interactive-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bgColor} transition-all duration-300 hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <ProgressRing progress={Math.random() * 100} size={32} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </h3>
                  <div className="text-2xl font-bold font-mono">
                    {card.value}
                  </div>
                  <div className={`flex items-center space-x-1 text-xs font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{card.change}</span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Chart */}
        <TiltCard maxTilt={3}>
          <div className="professional-card p-6 animate-fade-in-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Transaction Volume</h3>
                <p className="text-sm text-muted-foreground">Daily transaction count over time</p>
              </div>
              <LineChart className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
                <p className="text-xs text-muted-foreground mt-1">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Network Distribution */}
        <TiltCard maxTilt={3}>
          <div className="professional-card p-6 animate-fade-in-right">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Network Distribution</h3>
                <p className="text-sm text-muted-foreground">Transaction types breakdown</p>
              </div>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Pie chart visualization would go here</p>
                <p className="text-xs text-muted-foreground mt-1">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Performance Metrics */}
      <TiltCard maxTilt={2}>
        <div className="professional-card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Performance Metrics</h3>
              <p className="text-sm text-muted-foreground">Real-time network performance indicators</p>
            </div>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Network Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">15.2</div>
              <div className="text-sm text-muted-foreground">TPS Average</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">2.1s</div>
              <div className="text-sm text-muted-foreground">Avg Confirmation</div>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  )
}
