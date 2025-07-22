'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

export interface UseWebSocketOptions {
  url: string
  protocols?: string | string[]
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  shouldReconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useWebSocket(options: UseWebSocketOptions) {
  const {
    url,
    protocols,
    onOpen,
    onClose,
    onError,
    onMessage,
    shouldReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options

  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeoutId = useRef<NodeJS.Timeout | null>(null)
  const isMounted = useRef(true)

  const connect = useCallback(() => {
    if (!isMounted.current) return

    try {
      ws.current = new WebSocket(url, protocols)
      
      ws.current.onopen = (event) => {
        setReadyState(WebSocket.OPEN)
        setConnectionAttempts(0)
        onOpen?.(event)
      }

      ws.current.onclose = (event) => {
        setReadyState(WebSocket.CLOSED)
        onClose?.(event)

        if (shouldReconnect && connectionAttempts < maxReconnectAttempts && isMounted.current) {
          reconnectTimeoutId.current = setTimeout(() => {
            setConnectionAttempts(prev => prev + 1)
            connect()
          }, reconnectInterval)
        }
      }

      ws.current.onerror = (event) => {
        setReadyState(WebSocket.CLOSED)
        onError?.(event)
      }

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          onMessage?.(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setReadyState(WebSocket.CLOSED)
    }
  }, [url, protocols, onOpen, onClose, onError, onMessage, shouldReconnect, reconnectInterval, maxReconnectAttempts, connectionAttempts])

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
      return true
    }
    return false
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutId.current) {
      clearTimeout(reconnectTimeoutId.current)
    }
    
    if (ws.current) {
      ws.current.close()
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      isMounted.current = false
      disconnect()
    }
  }, [connect, disconnect])

  return {
    readyState,
    lastMessage,
    sendMessage,
    disconnect,
    connectionAttempts,
    isConnecting: readyState === WebSocket.CONNECTING,
    isOpen: readyState === WebSocket.OPEN,
    isClosing: readyState === WebSocket.CLOSING,
    isClosed: readyState === WebSocket.CLOSED
  }
}
