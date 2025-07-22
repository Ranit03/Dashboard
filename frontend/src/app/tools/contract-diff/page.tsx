'use client'

import { useState } from 'react'
import { GitCompare, Upload, Copy, Download, AlertCircle, CheckCircle } from 'lucide-react'

export default function ContractDiffPage() {
  const [leftContract, setLeftContract] = useState('')
  const [rightContract, setRightContract] = useState('')
  const [leftAddress, setLeftAddress] = useState('')
  const [rightAddress, setRightAddress] = useState('')
  const [isComparing, setIsComparing] = useState(false)
  const [diffResult, setDiffResult] = useState<any>(null)

  const handleCompare = async () => {
    setIsComparing(true)
    // Simulate API call
    setTimeout(() => {
      setDiffResult({
        changes: [
          { type: 'added', line: 15, content: '+ function newFunction() public {}' },
          { type: 'removed', line: 23, content: '- function oldFunction() public {}' },
          { type: 'modified', line: 45, content: '~ mapping(address => uint256) public balances;' }
        ],
        summary: {
          additions: 12,
          deletions: 8,
          modifications: 3
        }
      })
      setIsComparing(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <GitCompare className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contract Diff</h1>
          <p className="text-muted-foreground">Compare smart contract versions and analyze changes</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Contract */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Contract A</h3>
            <button className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80">
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Contract address or name"
              value={leftAddress}
              onChange={(e) => setLeftAddress(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Paste contract source code here..."
              value={leftContract}
              onChange={(e) => setLeftContract(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </div>
        </div>

        {/* Right Contract */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Contract B</h3>
            <button className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80">
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Contract address or name"
              value={rightAddress}
              onChange={(e) => setRightAddress(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Paste contract source code here..."
              value={rightContract}
              onChange={(e) => setRightContract(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={!leftContract || !rightContract || isComparing}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GitCompare className="h-4 w-4" />
          {isComparing ? 'Comparing...' : 'Compare Contracts'}
        </button>
      </div>

      {/* Results */}
      {diffResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-600">Additions</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">{diffResult.summary.additions}</p>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-600">Deletions</span>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-1">{diffResult.summary.deletions}</p>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-600">Modifications</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{diffResult.summary.modifications}</p>
            </div>
          </div>

          {/* Detailed Diff */}
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Detailed Changes</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80">
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
                <button className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2 font-mono text-sm">
              {diffResult.changes.map((change: any, index: number) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    change.type === 'added' ? 'bg-green-500/10 text-green-600' :
                    change.type === 'removed' ? 'bg-red-500/10 text-red-600' :
                    'bg-yellow-500/10 text-yellow-600'
                  }`}
                >
                  <span className="text-muted-foreground mr-2">Line {change.line}:</span>
                  {change.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
