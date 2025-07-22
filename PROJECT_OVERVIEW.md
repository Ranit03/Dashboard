# BlockDAG Scan++ - Project Overview

## 🎯 Project Description

BlockDAG Scan++ is a developer-friendly block explorer with advanced debugging tools, contract analysis, and monitoring capabilities for the BlockDAG network. This project was created using the BlockDAG dApp template and enhanced with comprehensive developer tools and infrastructure features.

## 🏗️ Architecture

### Frontend (Next.js 14 + TypeScript)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Data Fetching**: React Query (TanStack Query)
- **UI Components**: Radix UI primitives
- **Charts**: Recharts for analytics visualization
- **Web3**: ethers.js and WalletConnect integration

### Smart Contracts (Dual Environment)
- **Hardhat**: JavaScript/TypeScript development environment
- **Foundry**: Rust-based development environment
- **Contracts**: ExplorerRegistry for managing verified contracts and plugins

### Key Features Implemented

#### 🔍 Core Explorer Features
- Real-time block and transaction explorer
- Advanced search with filters
- Address and contract information
- Network statistics dashboard

#### 🛠️ Developer Tools
- **Contract Diff Analyzer**: Compare contract versions
- **Gas Usage Profiler**: Detailed gas analysis and optimization
- **Interactive Debugger**: Step-through transaction debugging
- **Wallet Activity Monitor**: Track wallet activities and alerts
- **Network Health Monitor**: Real-time network statistics

#### 🔌 Plugin System
- Extensible plugin architecture
- Plugin registry and management
- User-installable debugging tools
- Custom plugin development SDK

#### 📊 Analytics & Monitoring
- Network performance metrics
- Transaction volume trends
- Gas price analysis
- Top addresses and contracts tracking

## 📁 Project Structure

```
blockdag-scan-plus/
├── frontend/                     # Next.js React application
│   ├── src/
│   │   ├── app/                 # Next.js 14 app router pages
│   │   ├── components/          # Reusable React components
│   │   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── layout/          # Layout components (header, sidebar)
│   │   │   ├── plugins/         # Plugin system components
│   │   │   └── search/          # Search functionality
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Utility functions
│   │   └── styles/              # CSS and styling
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
├── contracts/                   # Smart contract environments
│   ├── hardhat/                # Hardhat development environment
│   │   ├── contracts/          # Solidity contracts
│   │   ├── scripts/            # Deployment scripts
│   │   ├── test/               # Contract tests
│   │   └── hardhat.config.ts   # Hardhat configuration
│   └── foundry/                # Foundry development environment
│       ├── src/                # Solidity contracts
│       ├── test/               # Contract tests
│       ├── script/             # Deployment scripts
│       └── foundry.toml        # Foundry configuration
├── README.md                   # Project documentation
├── setup.sh                    # Automated setup script
└── .gitignore                  # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Foundry (optional, for Foundry development)

### Quick Setup
1. **Run the setup script**:
   ```bash
   ./setup.sh
   ```

2. **Configure environment variables**:
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Copy `contracts/hardhat/.env.example` to `contracts/hardhat/.env`
   - Copy `contracts/foundry/.env.example` to `contracts/foundry/.env`
   - Update with your configuration

3. **Start development**:
   ```bash
   # Start frontend
   cd frontend && npm run dev
   
   # Start local blockchain (in another terminal)
   cd contracts/hardhat && npx hardhat node
   
   # Deploy contracts (in another terminal)
   cd contracts/hardhat && npx hardhat run scripts/deploy.ts --network localhost
   ```

### Manual Setup
If you prefer manual setup:

1. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

2. **Hardhat Setup**:
   ```bash
   cd contracts/hardhat
   npm install
   cp .env.example .env
   npx hardhat compile
   ```

3. **Foundry Setup** (optional):
   ```bash
   cd contracts/foundry
   cp .env.example .env
   forge install
   forge build
   ```

## 🔧 Development Workflow

### Frontend Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter

### Smart Contract Development

#### Hardhat
- `npx hardhat compile` - Compile contracts
- `npx hardhat test` - Run tests
- `npx hardhat node` - Start local blockchain
- `npx hardhat run scripts/deploy.ts` - Deploy contracts

#### Foundry
- `forge build` - Build contracts
- `forge test` - Run tests
- `forge script` - Run deployment scripts

## 🌟 Key Components

### Frontend Components
- **NetworkStats**: Real-time network statistics
- **SearchBar**: Advanced search functionality
- **RecentBlocks/Transactions**: Live data displays
- **PluginGrid**: Plugin management interface
- **AnalyticsCharts**: Data visualization

### Smart Contracts
- **ExplorerRegistry**: Main registry contract for verified contracts, labels, and plugins

## 🔌 Plugin Development

The project includes a comprehensive plugin system that allows developers to create custom tools:

```typescript
interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  component: React.ComponentType<PluginProps>;
  hooks?: PluginHooks;
  permissions: PluginPermission[];
}
```

## 📝 Environment Configuration

### Frontend (.env.local)
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` - WalletConnect project ID
- `NEXT_PUBLIC_BLOCKDAG_RPC_URL` - BlockDAG RPC endpoint
- `NEXT_PUBLIC_BLOCKDAG_CHAIN_ID` - Chain ID

### Contracts (.env)
- `PRIVATE_KEY` - Deployment private key
- `RPC_URL` - Network RPC URL
- `ETHERSCAN_API_KEY` - Block explorer API key

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
npm start
```

### Contract Deployment
```bash
# Hardhat
cd contracts/hardhat
npx hardhat run scripts/deploy.ts --network <network>

# Foundry
cd contracts/foundry
forge script script/Deploy.s.sol --rpc-url <rpc-url> --broadcast
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Resources

- [BlockDAG Network](https://blockdag.network)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Foundry Documentation](https://book.getfoundry.sh/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**BlockDAG Scan++** - Empowering developers with advanced blockchain exploration tools.
