'use client'

import { useState, useRef, useEffect } from 'react'
import { Bug, Play, Square, RotateCcw, Terminal, ChevronRight } from 'lucide-react'

interface LogEntry {
  id: number
  type: 'command' | 'result' | 'error' | 'info'
  content: string
  timestamp: Date
}

export default function DebugConsolePage() {
  const [command, setCommand] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      type: 'info',
      content: 'Debug Console initialized. Type "help" for available commands.',
      timestamp: new Date()
    }
  ])
  const [isExecuting, setIsExecuting] = useState(false)
  const [selectedTx, setSelectedTx] = useState('')
  const consoleRef = useRef<HTMLDivElement>(null)

  const availableCommands = [
    'help - Show available commands',
    'debug <tx_hash> - Debug a transaction',
    'trace <tx_hash> - Get transaction trace',
    'state <address> - Get contract state',
    'call <address> <method> - Call contract method',
    'clear - Clear console',
    'reset - Reset debug session'
  ]

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [logs])

  const addLog = (type: LogEntry['type'], content: string) => {
    const newLog: LogEntry = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    }
    setLogs(prev => [...prev, newLog])
  }

  const executeCommand = async () => {
    if (!command.trim()) return

    setIsExecuting(true)
    addLog('command', `> ${command}`)

    // Simulate command execution
    setTimeout(() => {
      const cmd = command.toLowerCase().trim()
      
      if (cmd === 'help') {
        availableCommands.forEach(cmdHelp => {
          addLog('info', cmdHelp)
        })
      } else if (cmd === 'clear') {
        setLogs([])
      } else if (cmd.startsWith('debug ')) {
        const txHash = cmd.split(' ')[1]
        addLog('info', `Debugging transaction: ${txHash}`)
        addLog('result', `Gas used: 142,850 / 200,000`)
        addLog('result', `Status: Success`)
        addLog('result', `Block: #1,234,567`)
        addLog('result', `Function: transfer(address,uint256)`)
      } else if (cmd.startsWith('trace ')) {
        const txHash = cmd.split(' ')[1]
        addLog('info', `Tracing transaction: ${txHash}`)
        addLog('result', `CALL 0x1234...5678`)
        addLog('result', `├─ SLOAD slot: 0x0`)
        addLog('result', `├─ SSTORE slot: 0x1`)
        addLog('result', `└─ RETURN`)
      } else if (cmd.startsWith('state ')) {
        const address = cmd.split(' ')[1]
        addLog('info', `Getting state for: ${address}`)
        addLog('result', `Balance: 1.234 ETH`)
        addLog('result', `Nonce: 42`)
        addLog('result', `Code size: 1,234 bytes`)
      } else {
        addLog('error', `Unknown command: ${cmd}. Type "help" for available commands.`)
      }
      
      setIsExecuting(false)
      setCommand('')
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      executeCommand()
    }
  }

  const clearConsole = () => {
    setLogs([])
    addLog('info', 'Console cleared.')
  }

  const resetSession = () => {
    setLogs([
      {
        id: Date.now(),
        type: 'info',
        content: 'Debug session reset.',
        timestamp: new Date()
      }
    ])
    setCommand('')
    setSelectedTx('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <Bug className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Debug Console</h1>
          <p className="text-muted-foreground">Interactive debugging for transactions and contracts</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Transaction hash to debug..."
            value={selectedTx}
            onChange={(e) => setSelectedTx(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => setCommand(`debug ${selectedTx}`)}
            disabled={!selectedTx}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            Debug
          </button>
        </div>
        <button
          onClick={clearConsole}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
        >
          <Square className="h-4 w-4" />
          Clear
        </button>
        <button
          onClick={resetSession}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* Console */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
          <Terminal className="h-4 w-4" />
          <span className="font-medium">Debug Console</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Connected</span>
          </div>
        </div>
        
        {/* Console Output */}
        <div
          ref={consoleRef}
          className="h-96 overflow-y-auto p-4 font-mono text-sm bg-background"
        >
          {logs.map((log) => (
            <div key={log.id} className="mb-2">
              <div className={`${
                log.type === 'command' ? 'text-blue-400' :
                log.type === 'result' ? 'text-green-400' :
                log.type === 'error' ? 'text-red-400' :
                'text-muted-foreground'
              }`}>
                {log.type === 'command' && (
                  <ChevronRight className="inline h-3 w-3 mr-1" />
                )}
                {log.content}
              </div>
              <div className="text-xs text-muted-foreground/60">
                {log.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          {isExecuting && (
            <div className="text-yellow-400 animate-pulse">
              Executing command...
            </div>
          )}
        </div>

        {/* Command Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" />
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter debug command..."
              disabled={isExecuting}
              className="flex-1 bg-transparent border-none outline-none font-mono text-sm disabled:opacity-50"
            />
            <button
              onClick={executeCommand}
              disabled={!command.trim() || isExecuting}
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              Execute
            </button>
          </div>
        </div>
      </div>

      {/* Help Panel */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Available Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCommands.map((cmd, index) => (
            <div key={index} className="flex items-center gap-2">
              <code className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                {cmd.split(' - ')[0]}
              </code>
              <span className="text-sm text-muted-foreground">
                {cmd.split(' - ')[1]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
