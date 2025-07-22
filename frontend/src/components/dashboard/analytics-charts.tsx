'use client'

import { useState, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react'

// Mock data for charts
const transactionVolumeData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  transactions: Math.floor(Math.random() * 1000) + 500,
  volume: Math.floor(Math.random() * 50) + 20
}))

const gasPriceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  gasPrice: Math.floor(Math.random() * 30) + 15,
  baseFee: Math.floor(Math.random() * 20) + 10
}))

const networkActivityData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  activeAddresses: Math.floor(Math.random() * 100000) + 50000,
  newContracts: Math.floor(Math.random() * 500) + 100
}))

export function AnalyticsCharts() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Network Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="metric-card">
              <div className="h-6 w-32 loading-skeleton mb-4" />
              <div className="h-64 loading-skeleton" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Network Analytics</h2>
        <div className="flex items-center space-x-2">
          <select className="text-sm border rounded-md px-2 py-1 bg-background">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Chart */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Transaction Volume</h3>
            </div>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+12.5%</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={transactionVolumeData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="transactions"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gas Price Chart */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Gas Price Trends</h3>
            </div>
            <div className="flex items-center space-x-1 text-sm text-red-600">
              <TrendingDown className="h-4 w-4" />
              <span>-5.2%</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={gasPriceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="gasPrice"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="baseFee"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Network Activity */}
        <div className="metric-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Weekly Network Activity</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-primary rounded-full" />
                <span>Active Addresses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-muted-foreground rounded-full" />
                <span>New Contracts</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={networkActivityData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar
                dataKey="activeAddresses"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="newContracts"
                fill="hsl(var(--muted-foreground))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
