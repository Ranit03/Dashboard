# BlockDAG Scan++ Frontend

A modern, developer-friendly blockchain explorer built with Next.js 14, featuring advanced debugging tools, real-time analytics, and comprehensive performance optimizations.

## 🚀 Features

### Core Features
- **Real-time Block Explorer**: Live blockchain data with WebSocket integration
- **Advanced Search**: Intelligent search with autocomplete and recent history
- **Network Analytics**: Comprehensive network statistics and performance metrics
- **Responsive Design**: Mobile-first approach with dark/light theme support

### Developer Tools
- **Contract Diff Analyzer**: Compare smart contract versions with detailed diff views
- **Gas Usage Profiler**: Analyze transaction gas consumption with optimization suggestions
- **Interactive Debugger**: Step-through transaction debugging with state inspection
- **Wallet Activity Monitor**: Track wallet activities with customizable alerts
- **Network Health Monitor**: Real-time network statistics and performance indicators

### Performance Features
- **Lazy Loading**: Dynamic imports and intersection observer-based loading
- **Service Worker**: Intelligent caching strategies for optimal performance
- **Bundle Optimization**: Code splitting and tree shaking for minimal bundle size
- **Image Optimization**: WebP/AVIF support with responsive loading
- **Performance Monitoring**: Real-time performance metrics and web vitals tracking

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with custom real-time data providers
- **Testing**: Jest + React Testing Library + Playwright
- **Performance**: Service Worker + Bundle optimization
- **Development**: ESLint + Prettier + Husky

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Dashboard/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Testing
```bash
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run test:ci           # Run tests for CI
npm run test:integration  # Run integration tests
npm run test:unit         # Run unit tests only
```

### Performance
```bash
npm run analyze      # Analyze bundle size
npm run perf         # Build and start for performance testing
```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── tools/             # Developer tools pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/            # Layout components
│   ├── search/            # Search functionality
│   ├── ui/                # UI primitives
│   └── performance/       # Performance monitoring
├── hooks/                 # Custom React hooks
│   ├── useRealTimeData.ts # Real-time data management
│   ├── useWebSocket.ts    # WebSocket integration
│   └── usePerformance.ts  # Performance monitoring
├── utils/                 # Utility functions
├── types/                 # TypeScript type definitions
└── __tests__/             # Test files
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### TypeScript Configuration
The project uses strict TypeScript configuration for better type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Mock implementations for external dependencies

### Integration Tests
- Full page workflow testing
- Component interaction testing
- API integration testing

### End-to-End Tests
- Cross-browser testing with Playwright
- User journey testing
- Performance testing

### Coverage Requirements
- Minimum 70% code coverage
- All critical paths tested
- Performance regression testing

## 🚀 Performance Optimizations

### Bundle Optimization
- Dynamic imports for code splitting
- Tree shaking for unused code elimination
- Bundle analysis with webpack-bundle-analyzer

### Runtime Performance
- Service Worker for intelligent caching
- Image optimization with next/image
- Lazy loading with Intersection Observer
- Performance monitoring and alerting

### Network Optimization
- API response caching
- WebSocket connection management
- Prefetching for critical resources

## 🎨 Design System

### Colors
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Typography
- Font Family: Inter
- Headings: 24px, 20px, 18px, 16px
- Body: 14px, 12px
- Code: JetBrains Mono

### Components
- Consistent spacing scale (4px base)
- Rounded corners (4px, 8px, 12px)
- Shadow system for depth
- Animation system for interactions

## 🔍 Developer Tools Usage

### Contract Diff
1. Navigate to `/tools/contract-diff`
2. Input contract addresses or paste source code
3. Click "Compare Contracts"
4. Review detailed diff analysis

### Gas Analyzer
1. Navigate to `/tools/gas-analyzer`
2. Enter transaction hash
3. View gas usage breakdown
4. Review optimization suggestions

### Debug Console
1. Navigate to `/tools/debug`
2. Use interactive commands
3. Debug transactions step-by-step
4. Inspect contract state

## 📊 Monitoring & Analytics

### Performance Metrics
- Core Web Vitals tracking
- Bundle size monitoring
- Runtime performance analysis
- Network connection optimization

### Error Tracking
- Component error boundaries
- Performance regression detection
- User experience monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Code Standards
- Follow TypeScript strict mode
- Write comprehensive tests
- Use semantic commit messages
- Follow the established code style

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test examples

---

Built with ❤️ using Next.js and modern web technologies.
