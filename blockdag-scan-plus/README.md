# BlockDAG Scan++

A developer-friendly block explorer with advanced debugging tools, contract analysis, and monitoring capabilities for the BlockDAG network.

## 🚀 Features

### Core Explorer Features
- **Block & Transaction Explorer**: Browse blocks, transactions, and addresses
- **Real-time Updates**: Live data streaming for latest blocks and transactions
- **Advanced Search**: Multi-parameter search with filters and sorting

### Developer Tools & Infrastructure
- **🔧 Plugin System**: Extensible architecture for custom debugging tools
- **📊 Contract Diff Tool**: Compare contract versions and analyze changes
- **⛽ Gas Analysis**: Detailed gas usage patterns and optimization suggestions
- **👛 Wallet Monitor**: Track wallet activities and transaction patterns
- **🐛 Debug Console**: Interactive debugging interface for transactions
- **📈 Analytics Dashboard**: Network statistics and performance metrics

## 🏗️ Architecture

```
blockdag-scan-plus/
├── frontend/                 # Next.js 14+ React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Next.js pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── styles/         # CSS and styling
│   └── public/             # Static assets
└── contracts/              # Smart contract environments
    ├── hardhat/           # Hardhat development environment
    └── foundry/           # Foundry development environment
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Query
- **Web3**: ethers.js, WalletConnect
- **UI Components**: Radix UI, Lucide Icons
- **Charts**: Recharts, D3.js
- **State Management**: Zustand
- **Testing**: Jest, React Testing Library

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd blockdag-scan-plus
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Add your environment variables
   npm run dev
   ```

3. **Setup Smart Contracts**
   ```bash
   # Hardhat
   cd contracts/hardhat
   npm install
   cp .env.example .env
   npx hardhat compile

   # Foundry
   cd ../foundry
   forge install
   cp .env.example .env
   forge build
   ```

## 🔧 Plugin Development

BlockDAG Scan++ supports custom plugins for extending functionality:

```typescript
interface Plugin {
  name: string;
  version: string;
  description: string;
  component: React.ComponentType<PluginProps>;
  hooks?: PluginHooks;
}
```

See `/docs/plugin-development.md` for detailed plugin development guide.

## 📊 Features Overview

### Block Explorer
- Block details with transaction lists
- Transaction trace and logs
- Address information and history
- Token transfers and balances

### Developer Tools
- **Contract Diff**: Side-by-side contract comparison
- **Gas Profiler**: Transaction gas analysis
- **Debug Console**: Step-through transaction execution
- **Network Monitor**: Real-time network statistics

### Analytics
- Network health metrics
- Transaction volume trends
- Gas price analysis
- Top addresses and contracts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [BlockDAG Network](https://blockdag.network)
- [Documentation](./docs)
- [API Reference](./docs/api.md)
- [Plugin Development](./docs/plugin-development.md)
