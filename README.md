# BlockDAG Developer Dashboard & Explorer Suite

A comprehensive developer ecosystem for BlockDAG blockchain applications, featuring an advanced block explorer, CLI scaffolding tool, and integrated development dashboard.

## 🚀 Quick Start

### Option 1: Use CLI Tool (Recommended)
```bash
# Create a new BlockDAG dApp instantly
npx create-blockdag-app my-dapp
cd my-dapp
npm run dev
```

### Option 2: Clone Repository
```bash
git clone <repository-url>
cd blockdag-developer-suite
```

## 📦 Project Structure

```
blockdag-developer-suite/
├── frontend/                   # BlockDAG Scan++ Explorer
├── dashboard/                  # Developer Dashboard
├── cli/                       # Create BlockDAG App CLI
├── contracts/                 # Smart Contract Templates
│   ├── hardhat/              # Hardhat environment
│   └── foundry/              # Foundry environment
└── docs/                     # Documentation
```

## 🛠 Components Overview

### 1. BlockDAG Scan++ Explorer (`/frontend`)
Advanced blockchain explorer with developer tools:
- **Real-time Block Explorer**: Live blockchain data with WebSocket integration
- **Contract Diff Analyzer**: Compare smart contract versions
- **Gas Usage Profiler**: Analyze and optimize gas consumption
- **Interactive Debugger**: Step-through transaction debugging
- **Wallet Activity Monitor**: Track wallet activities with alerts
- **Network Health Monitor**: Real-time network statistics

### 2. Developer Dashboard (`/dashboard`)
Unified project management interface:
- **Project Management**: Create, deploy, and monitor dApps
- **Analytics Dashboard**: Performance metrics and insights
- **Deployment Tools**: One-click contract deployment
- **Real-time Monitoring**: Live application health tracking

### 3. Create BlockDAG App CLI (`/cli`)
Scaffolding tool for instant dApp creation:
- **Full-stack Templates**: Next.js + Smart Contracts
- **Multiple Frameworks**: Hardhat and Foundry support
- **Pre-configured**: Ready for BlockDAG Primordial network
- **Best Practices**: TypeScript, testing, and deployment scripts

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Frontend Explorer Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

**Environment Variables:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Dashboard Setup
```bash
cd dashboard/frontend
npm install
cp .env.example .env.local
npm run dev
```

### Smart Contracts Setup

#### Hardhat Environment
```bash
cd contracts/hardhat
npm install
cp .env.example .env
# Add your private key and RPC URL
npx hardhat compile
npx hardhat test
```

#### Foundry Environment
```bash
cd contracts/foundry
forge install
cp .env.example .env
forge build
forge test
```

**Smart Contract Environment Variables:**
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.primordial.bdagscan.com
ETHERSCAN_API_KEY=your_api_key_here
```

## 🚀 Usage Guide

### Creating a New dApp
```bash
# Interactive creation
npx create-blockdag-app

# With options
npx create-blockdag-app my-dapp --typescript --tailwind --hardhat
```

### Exploring the Blockchain
1. Navigate to `http://localhost:3000`
2. Use the search bar to find blocks, transactions, or addresses
3. Access developer tools at `/tools/*`

### Developer Tools Usage

#### Contract Diff (`/tools/contract-diff`)
```
Contract A: 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
Contract B: 0xA0b86a33E6441b8C4505B4afDcA7FBcB9005C685
```

#### Gas Analyzer (`/tools/gas-analyzer`)
```
Transaction Hash: 0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

#### Debug Console (`/tools/debug`)
```bash
help                    # Show available commands
debug 0x[tx_hash]      # Debug transaction
trace 0x[tx_hash]      # Trace execution
state 0x[address]      # Get contract state
```

#### Wallet Monitor (`/tools/wallet-monitor`)
```
Wallet Address: 0x742d35Cc6634C0532925a3b8D4C9db4C4C4b3f8A
```

### Deploying Contracts

#### Using Hardhat
```bash
cd contracts/hardhat
npx hardhat run scripts/deploy.ts --network primordial
```

#### Using Foundry
```bash
cd contracts/foundry
forge script script/Deployer.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY
```

## 🌐 Network Configuration

### BlockDAG Primordial Network
- **Chain ID**: 1043
- **RPC URL**: https://rpc.primordial.bdagscan.com
- **Explorer**: https://primordial.bdagscan.com
- **Currency**: BDAG

### Adding to MetaMask
```json
{
  "chainId": "0x413",
  "chainName": "BlockDAG Primordial",
  "rpcUrls": ["https://rpc.primordial.bdagscan.com"],
  "nativeCurrency": {
    "name": "BDAG",
    "symbol": "BDAG",
    "decimals": 18
  },
  "blockExplorerUrls": ["https://primordial.bdagscan.com"]
}
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test                # Unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:e2e        # End-to-end tests
```

### Smart Contract Testing
```bash
# Hardhat
cd contracts/hardhat
npx hardhat test
npx hardhat coverage

# Foundry
cd contracts/foundry
forge test
forge coverage
```

## 📊 Available Scripts

### Frontend/Dashboard
```bash
npm run dev             # Development server
npm run build           # Production build
npm run start           # Production server
npm run lint            # ESLint
npm run type-check      # TypeScript check
npm run analyze         # Bundle analysis
```

### Smart Contracts
```bash
# Hardhat
npx hardhat compile     # Compile contracts
npx hardhat test        # Run tests
npx hardhat deploy      # Deploy contracts
npx hardhat verify      # Verify on explorer

# Foundry
forge build            # Compile contracts
forge test             # Run tests
forge script           # Run deployment scripts
```

## 🏗 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks + Context
- **Web3**: ethers.js, WalletConnect
- **UI Components**: Radix UI, Lucide Icons
- **Charts**: Recharts, D3.js
- **Testing**: Jest, React Testing Library, Playwright

### Smart Contracts
- **Hardhat**: Development environment, testing, deployment
- **Foundry**: Fast compilation, advanced testing, gas optimization
- **OpenZeppelin**: Security-audited contract libraries
- **Solidity**: ^0.8.19

### Infrastructure
- **WebSocket**: Real-time data streaming
- **Service Worker**: Intelligent caching
- **Performance**: Bundle optimization, lazy loading
- **Monitoring**: Web vitals, error tracking

## 🔍 Features Deep Dive

### Real-time Data
- WebSocket connections for live updates
- Automatic reconnection handling
- Efficient data caching and synchronization

### Developer Tools
- **Contract Diffing**: Visual comparison of contract versions
- **Gas Profiling**: Detailed gas usage analysis with optimization tips
- **Transaction Debugging**: Step-by-step execution tracing
- **Wallet Monitoring**: Real-time activity tracking with alerts

### Performance Optimizations
- Code splitting and lazy loading
- Image optimization with WebP/AVIF
- Service Worker caching strategies
- Bundle analysis and tree shaking

### Security Features
- Input validation and sanitization
- Secure environment variable handling
- Rate limiting and DDoS protection
- Audit trail for all operations

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create feature branch: `git checkout -b feature/amazing-feature`
5. Make changes and test thoroughly
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Create Pull Request

### Code Standards
- Follow TypeScript strict mode
- Use Prettier for formatting
- Write comprehensive tests
- Follow conventional commit messages
- Update documentation for new features

### Testing Requirements
- Unit tests for all new functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Minimum 80% code coverage

## 📝 API Reference

### REST Endpoints
```
GET /api/blocks/:id          # Get block details
GET /api/transactions/:hash  # Get transaction details
GET /api/addresses/:address  # Get address information
GET /api/contracts/:address  # Get contract details
POST /api/contracts/diff     # Compare contracts
POST /api/debug/transaction  # Debug transaction
```

### WebSocket Events
```javascript
// Subscribe to real-time updates
socket.on('newBlock', (block) => { /* handle new block */ });
socket.on('newTransaction', (tx) => { /* handle new transaction */ });
socket.on('networkStats', (stats) => { /* handle network stats */ });
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
npm run dev -- -p 3001
```

#### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### Environment Variables Not Loading
- Ensure `.env.local` exists and has correct format
- Restart development server after changes
- Check for typos in variable names

#### Smart Contract Compilation Errors
```bash
# Clear Hardhat cache
npx hardhat clean
npx hardhat compile

# Clear Foundry cache
forge clean
forge build
```

#### WebSocket Connection Issues
- Check firewall settings
- Verify WebSocket URL in environment variables
- Ensure backend WebSocket server is running

### Getting Help
1. Check existing [GitHub Issues](link-to-issues)
2. Review documentation in `/docs`
3. Join our [Discord Community](link-to-discord)
4. Create detailed bug reports with reproduction steps

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- BlockDAG team for the innovative blockchain architecture
- Next.js team for the excellent React framework
- Hardhat and Foundry teams for smart contract development tools
- OpenZeppelin for security-audited contract libraries
- The entire Web3 developer community



---

**Built with ❤️ for the BlockDAG developer community**

*Making BlockDAG development accessible, powerful, and enjoyable for developers worldwide.*
