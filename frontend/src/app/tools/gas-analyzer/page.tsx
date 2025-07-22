'use client'

import { useState } from 'react'
import { Zap, Search, TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react'

export default function GasAnalyzerPage() {
  const [txHash, setTxHash] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      setAnalysisResult({
        transaction: {
          hash: txHash || '0x1234...5678',
          gasUsed: 142850,
          gasLimit: 200000,
          gasPrice: 25000000000, // 25 gwei
          totalCost: '0.003571 ETH'
        },
        breakdown: [
          { operation: 'Contract Creation', gasUsed: 53000, percentage: 37.1, color: 'bg-blue-500' },
          { operation: 'Storage Writes', gasUsed: 40000, percentage: 28.0, color: 'bg-green-500' },
          { operation: 'Function Calls', gasUsed: 25000, percentage: 17.5, color: 'bg-yellow-500' },
          { operation: 'Event Emissions', gasUsed: 15000, percentage: 10.5, color: 'bg-purple-500' },
          { operation: 'Other Operations', gasUsed: 9850, percentage: 6.9, color: 'bg-gray-500' }
        ],
        optimizations: [
          { type: 'warning', message: 'Consider using packed structs to reduce storage costs', savings: '~15%' },
          { type: 'info', message: 'Function visibility can be optimized', savings: '~5%' },
          { type: 'warning', message: 'Multiple storage writes can be batched', savings: '~20%' }
        ],
        comparison: {
          network: 'BlockDAG',
          averageGas: 95000,
          percentile: 75
        }
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Zap className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gas Analyzer</h1>
          <p className="text-muted-foreground">Analyze transaction gas usage and optimize costs</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Transaction Hash</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="0x1234567890abcdef..."
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Transaction Overview */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gas Used</p>
                <p className="text-xl font-bold">{analysisResult.transaction.gasUsed.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gas Limit</p>
                <p className="text-xl font-bold">{analysisResult.transaction.gasLimit.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gas Price</p>
                <p className="text-xl font-bold">{(analysisResult.transaction.gasPrice / 1e9).toFixed(1)} gwei</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-xl font-bold">{analysisResult.transaction.totalCost}</p>
              </div>
            </div>
          </div>

          {/* Gas Usage Breakdown */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Gas Usage Breakdown</h3>
            <div className="space-y-4">
              {analysisResult.breakdown.map((item: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.operation}</span>
                    <div className="text-right">
                      <span className="font-bold">{item.gasUsed.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Optimization Suggestions</h3>
            <div className="space-y-3">
              {analysisResult.optimizations.map((opt: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    opt.type === 'warning' 
                      ? 'bg-yellow-500/10 border-yellow-500/20' 
                      : 'bg-blue-500/10 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {opt.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{opt.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Potential savings: <span className="font-semibold text-green-600">{opt.savings}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Comparison */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Network Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Your Transaction</p>
                <p className="text-2xl font-bold">{analysisResult.transaction.gasUsed.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Network Average</p>
                <p className="text-2xl font-bold">{analysisResult.comparison.averageGas.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm text-muted-foreground">Percentile</p>
                  {analysisResult.comparison.percentile > 50 ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-2xl font-bold">{analysisResult.comparison.percentile}th</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
