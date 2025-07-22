# API Documentation

This document describes the API endpoints and data structures used by BlockDAG Scan++.

## Base URL

```
Production: https://api.blockdag-scan.com
Development: http://localhost:8080/api
```

## Authentication

Currently, the API is public and doesn't require authentication. Future versions may implement API keys for rate limiting.

## Endpoints

### Network Statistics

#### GET /api/stats/network
Get current network statistics.

**Response:**
```json
{
  "blockHeight": 1234567,
  "totalTransactions": 45200000,
  "gasPrice": 25.5,
  "networkHashRate": 245.7,
  "blockTime": 12.3,
  "activeAddresses": 892000,
  "marketCap": 2.4,
  "tps": 15.2,
  "lastUpdate": "2024-01-15T10:30:00Z"
}
```

### Blocks

#### GET /api/blocks
Get recent blocks with pagination.

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "blocks": [
    {
      "number": 1234567,
      "hash": "0x14f39f...f7cf68",
      "transactions": 163,
      "gasUsed": 59,
      "gasLimit": 100,
      "miner": "0x14f39f...f7cf68",
      "timestamp": "2024-01-15T10:30:00Z",
      "size": 1024,
      "difficulty": "0x1bc16d674ec80000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1234567,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/blocks/:blockNumber
Get specific block by number.

**Response:**
```json
{
  "number": 1234567,
  "hash": "0x14f39f...f7cf68",
  "parentHash": "0x9a7ab5...77edb8",
  "transactions": [
    {
      "hash": "0x2fd098...f3eba8",
      "from": "0x1234...5678",
      "to": "0xabcd...ef90",
      "value": "0.133",
      "gasPrice": 39,
      "gasUsed": 21000,
      "status": "success"
    }
  ],
  "gasUsed": 1500000,
  "gasLimit": 2000000,
  "miner": "0x14f39f...f7cf68",
  "timestamp": "2024-01-15T10:30:00Z",
  "size": 1024,
  "difficulty": "0x1bc16d674ec80000",
  "totalDifficulty": "0x1bc16d674ec80000"
}
```

### Transactions

#### GET /api/transactions
Get recent transactions with pagination.

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (success, failed, pending)

**Response:**
```json
{
  "transactions": [
    {
      "hash": "0x2fd098...f3eba8",
      "blockNumber": 1234567,
      "from": "0x1234...5678",
      "to": "0xabcd...ef90",
      "value": "0.133",
      "gasPrice": 39,
      "gasUsed": 21000,
      "gasLimit": 21000,
      "status": "success",
      "timestamp": "2024-01-15T10:30:00Z",
      "nonce": 42,
      "transactionIndex": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45200000,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/transactions/:hash
Get specific transaction by hash.

**Response:**
```json
{
  "hash": "0x2fd098...f3eba8",
  "blockNumber": 1234567,
  "blockHash": "0x14f39f...f7cf68",
  "from": "0x1234...5678",
  "to": "0xabcd...ef90",
  "value": "0.133",
  "gasPrice": 39,
  "gasUsed": 21000,
  "gasLimit": 21000,
  "status": "success",
  "timestamp": "2024-01-15T10:30:00Z",
  "nonce": 42,
  "transactionIndex": 0,
  "logs": [],
  "input": "0x",
  "receipt": {
    "status": 1,
    "gasUsed": 21000,
    "logs": []
  }
}
```

### Addresses

#### GET /api/addresses/:address
Get address information and transaction history.

**Response:**
```json
{
  "address": "0x1234...5678",
  "balance": "12.45",
  "transactionCount": 1247,
  "firstSeen": "2023-01-15T10:30:00Z",
  "lastActivity": "2024-01-15T10:30:00Z",
  "isContract": false,
  "transactions": [
    {
      "hash": "0x2fd098...f3eba8",
      "blockNumber": 1234567,
      "from": "0x1234...5678",
      "to": "0xabcd...ef90",
      "value": "0.133",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Search

#### GET /api/search
Search for blocks, transactions, or addresses.

**Parameters:**
- `q`: Search query (required)
- `type` (optional): Filter by type (block, transaction, address)
- `limit` (optional): Max results (default: 10, max: 50)

**Response:**
```json
{
  "results": [
    {
      "type": "block",
      "number": 1234567,
      "hash": "0x14f39f...f7cf68",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "type": "transaction",
      "hash": "0x2fd098...f3eba8",
      "blockNumber": 1234567,
      "from": "0x1234...5678",
      "to": "0xabcd...ef90"
    },
    {
      "type": "address",
      "address": "0x1234...5678",
      "balance": "12.45",
      "transactionCount": 1247
    }
  ],
  "total": 3
}
```

## WebSocket API

### Connection
```
Production: wss://ws.blockdag-scan.com
Development: ws://localhost:8080
```

### Events

#### Network Stats Updates
```json
{
  "type": "network_stats",
  "data": {
    "blockHeight": 1234568,
    "gasPrice": 26.0,
    "tps": 15.8,
    "timestamp": "2024-01-15T10:31:00Z"
  }
}
```

#### New Block
```json
{
  "type": "new_block",
  "data": {
    "number": 1234568,
    "hash": "0x9a7ab5...77edb8",
    "transactions": 142,
    "gasUsed": 65,
    "timestamp": "2024-01-15T10:31:00Z"
  }
}
```

#### New Transaction
```json
{
  "type": "new_transaction",
  "data": {
    "hash": "0x7e5660...258768",
    "from": "0x9012...3456",
    "to": "0x7890...bcde",
    "value": "3.598",
    "gasPrice": 52,
    "status": "pending"
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Block not found",
    "details": {
      "blockNumber": 9999999
    }
  }
}
```

### Error Codes
- `INVALID_REQUEST`: Malformed request
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

- **Public API**: 100 requests per minute per IP
- **WebSocket**: 1 connection per IP
- **Search**: 20 requests per minute per IP

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## Data Types

### Address
- Format: 40-character hexadecimal string prefixed with "0x"
- Example: `0x1234567890abcdef1234567890abcdef12345678`

### Hash
- Format: 64-character hexadecimal string prefixed with "0x"
- Example: `0x2fd098f3eba8c7c9c7c9c7c9c7c9c7c9c7c9c7c9c7c9c7c9c7c9c7c9c7c9f3eba8`

### Amount
- Format: String representation of decimal number
- Unit: ETH
- Example: `"12.345678901234567890"`

### Timestamp
- Format: ISO 8601 UTC timestamp
- Example: `"2024-01-15T10:30:00Z"`
