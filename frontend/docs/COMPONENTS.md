# Component Documentation

This document provides detailed information about the components used in BlockDAG Scan++.

## Component Architecture

The application follows a modular component architecture with clear separation of concerns:

- **UI Components**: Reusable, unstyled components
- **Feature Components**: Business logic components
- **Layout Components**: Page structure and navigation
- **Page Components**: Route-specific components

## Core Components

### NetworkStats
Real-time network statistics display with live updates.

**Location**: `src/components/dashboard/network-stats.tsx`

**Props**: None (uses `useRealTimeData` hook)

**Features**:
- Live data updates every 5 seconds
- Pause/resume functionality
- Animated metric cards
- Responsive grid layout

**Usage**:
```tsx
import { NetworkStats } from '@/components/dashboard/network-stats'

<NetworkStats />
```

### SearchBar
Intelligent search component with autocomplete and recent searches.

**Location**: `src/components/search/search-bar.tsx`

**Props**: None

**Features**:
- Debounced search (300ms)
- Recent searches history
- Keyboard navigation
- Click outside to close
- Loading states

**Usage**:
```tsx
import { SearchBar } from '@/components/search/search-bar'

<SearchBar />
```

### RecentBlocks
Display of recent blockchain blocks with real-time updates.

**Location**: `src/components/dashboard/recent-blocks.tsx`

**Props**: None (uses `useRealTimeData` hook)

**Features**:
- Real-time block updates
- Formatted timestamps
- Gas usage indicators
- Click to view details

**Usage**:
```tsx
import { RecentBlocks } from '@/components/dashboard/recent-blocks'

<RecentBlocks />
```

### RecentTransactions
Display of recent transactions with status indicators.

**Location**: `src/components/dashboard/recent-transactions.tsx`

**Props**: None (uses `useRealTimeData` hook)

**Features**:
- Real-time transaction updates
- Status badges (success/failed/pending)
- Value formatting
- Gas price display

**Usage**:
```tsx
import { RecentTransactions } from '@/components/dashboard/recent-transactions'

<RecentTransactions />
```

## UI Components

### LoadingSpinner
Customizable loading spinner component.

**Location**: `src/components/ui/loading.tsx`

**Props**:
- `size?: 'sm' | 'md' | 'lg'` - Spinner size (default: 'md')
- `className?: string` - Additional CSS classes

**Usage**:
```tsx
import { LoadingSpinner } from '@/components/ui/loading'

<LoadingSpinner size="lg" />
```

### LoadingSkeleton
Skeleton loading component for content placeholders.

**Location**: `src/components/ui/loading.tsx`

**Props**:
- `className?: string` - Additional CSS classes
- `lines?: number` - Number of skeleton lines (default: 1)

**Usage**:
```tsx
import { LoadingSkeleton } from '@/components/ui/loading'

<LoadingSkeleton lines={3} />
```

### LoadingButton
Button component with loading state support.

**Location**: `src/components/ui/loading.tsx`

**Props**:
- `children: React.ReactNode` - Button content
- `isLoading?: boolean` - Loading state
- `disabled?: boolean` - Disabled state
- `onClick?: () => void` - Click handler
- `className?: string` - Additional CSS classes

**Usage**:
```tsx
import { LoadingButton } from '@/components/ui/loading'

<LoadingButton isLoading={isSubmitting} onClick={handleSubmit}>
  Submit
</LoadingButton>
```

### OptimizedImage
Performance-optimized image component with lazy loading.

**Location**: `src/components/ui/OptimizedImage.tsx`

**Props**:
- `src: string` - Image source URL
- `alt: string` - Alt text
- `width?: number` - Image width
- `height?: number` - Image height
- `priority?: boolean` - Priority loading (default: false)
- `lazy?: boolean` - Lazy loading (default: true)
- `className?: string` - Additional CSS classes

**Features**:
- WebP/AVIF format detection
- Lazy loading with intersection observer
- Loading states and error handling
- Responsive sizing

**Usage**:
```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage'

<OptimizedImage
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

## Layout Components

### Header
Main application header with navigation and search.

**Location**: `src/components/layout/header.tsx`

**Features**:
- Responsive navigation
- Search integration
- Theme toggle
- Mobile menu

### Sidebar
Application sidebar with navigation menu.

**Location**: `src/components/layout/sidebar.tsx`

**Features**:
- Collapsible navigation
- Active route highlighting
- Icon-based menu items
- Mobile responsive

## Performance Components

### PerformanceMonitor
Development-only performance monitoring overlay.

**Location**: `src/components/performance/PerformanceMonitor.tsx`

**Features**:
- Load time tracking
- Render time monitoring
- Memory usage display
- Network connection info
- Only visible in development

**Usage**:
```tsx
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor'

<PerformanceMonitor />
```

### ServiceWorkerProvider
Service worker registration and update management.

**Location**: `src/components/ServiceWorkerProvider.tsx`

**Features**:
- Service worker registration
- Update notifications
- Offline status indicator
- Background sync support

**Usage**:
```tsx
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'

<ServiceWorkerProvider>
  <App />
</ServiceWorkerProvider>
```

## Developer Tool Components

### ContractDiffPage
Smart contract comparison and analysis tool.

**Location**: `src/app/tools/contract-diff/page.tsx`

**Features**:
- Side-by-side contract comparison
- Syntax highlighting
- Diff visualization
- Export functionality

### GasAnalyzerPage
Transaction gas usage analysis tool.

**Location**: `src/app/tools/gas-analyzer/page.tsx`

**Features**:
- Gas usage breakdown
- Optimization suggestions
- Network comparison
- Visual charts

### DebugConsolePage
Interactive debugging console for transactions.

**Location**: `src/app/tools/debug/page.tsx`

**Features**:
- Command-line interface
- Transaction tracing
- State inspection
- History management

### WalletMonitorPage
Wallet activity monitoring and alerting.

**Location**: `src/app/tools/wallet-monitor/page.tsx`

**Features**:
- Wallet tracking
- Activity alerts
- Transaction history
- Balance monitoring

### NetworkMonitorPage
Real-time network health monitoring.

**Location**: `src/app/tools/network-monitor/page.tsx`

**Features**:
- Live network metrics
- Health indicators
- Alert system
- Historical data

## Hooks

### useRealTimeData
Hook for managing real-time blockchain data.

**Location**: `src/hooks/useRealTimeData.ts`

**Returns**:
- `networkData: NetworkData` - Current network statistics
- `recentBlocks: BlockData[]` - Recent blocks array
- `recentTransactions: TransactionData[]` - Recent transactions array
- `isLive: boolean` - Live update status
- `toggleLiveUpdates: () => void` - Toggle function

**Usage**:
```tsx
import { useRealTimeData } from '@/hooks/useRealTimeData'

const { networkData, isLive, toggleLiveUpdates } = useRealTimeData()
```

### useWebSocket
Hook for WebSocket connection management.

**Location**: `src/hooks/useWebSocket.ts`

**Parameters**:
- `options: UseWebSocketOptions` - Configuration options

**Returns**:
- `readyState: number` - Connection state
- `lastMessage: WebSocketMessage | null` - Last received message
- `sendMessage: (message: any) => boolean` - Send message function
- `disconnect: () => void` - Disconnect function

**Usage**:
```tsx
import { useWebSocket } from '@/hooks/useWebSocket'

const { readyState, sendMessage } = useWebSocket({
  url: 'ws://localhost:8080',
  onMessage: (message) => console.log(message)
})
```

### usePerformance
Hook for performance monitoring and metrics.

**Location**: `src/hooks/usePerformance.ts`

**Returns**:
- `metrics: PerformanceMetrics` - Performance data
- `isLoading: boolean` - Loading state
- `reportWebVitals: (metric: any) => void` - Web vitals reporter

**Usage**:
```tsx
import { usePerformance } from '@/hooks/usePerformance'

const { metrics, reportWebVitals } = usePerformance()
```

## Styling Guidelines

### CSS Classes
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic color names (primary, secondary, etc.)
- Implement consistent spacing scale

### Animations
- Use CSS transitions for hover effects
- Implement loading animations for better UX
- Follow the established animation timing (200-300ms)
- Use transform properties for performance

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly interactive elements

## Testing Guidelines

### Unit Tests
- Test component rendering
- Test user interactions
- Mock external dependencies
- Achieve 70%+ code coverage

### Integration Tests
- Test component interactions
- Test data flow
- Test error handling
- Test performance requirements

### E2E Tests
- Test user workflows
- Test cross-browser compatibility
- Test responsive design
- Test performance metrics

## Best Practices

### Component Design
- Single responsibility principle
- Composition over inheritance
- Props interface documentation
- Error boundary implementation

### Performance
- Lazy load non-critical components
- Optimize images and assets
- Implement proper caching
- Monitor bundle size

### Accessibility
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
