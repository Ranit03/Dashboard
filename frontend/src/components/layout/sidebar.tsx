'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Blocks,
  ArrowRightLeft,
  Wallet,
  FileCode,
  Wrench,
  BarChart3,
  Search,
  Monitor,
  Zap,
  GitCompare,
  Bug,
  Eye,
  Settings,
  BookOpen,
  Puzzle
} from 'lucide-react'
import { cn } from '@/utils/cn'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Overview and quick stats'
  },
  {
    name: 'Search',
    href: '/search',
    icon: Search,
    description: 'Advanced search tools'
  },
]

const explorerNavigation = [
  {
    name: 'Blocks',
    href: '/blocks',
    icon: Blocks,
    description: 'Browse blockchain blocks'
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: ArrowRightLeft,
    description: 'Transaction explorer'
  },
  {
    name: 'Addresses',
    href: '/addresses',
    icon: Wallet,
    description: 'Address information'
  },
  {
    name: 'Contracts',
    href: '/contracts',
    icon: FileCode,
    description: 'Smart contracts'
  },
]

const developerTools = [
  {
    name: 'Contract Diff',
    href: '/tools/contract-diff',
    icon: GitCompare,
    description: 'Compare contract versions'
  },
  {
    name: 'Gas Analyzer',
    href: '/tools/gas-analyzer',
    icon: Zap,
    description: 'Analyze gas usage'
  },
  {
    name: 'Debug Console',
    href: '/tools/debug',
    icon: Bug,
    description: 'Interactive debugging'
  },
  {
    name: 'Wallet Monitor',
    href: '/tools/wallet-monitor',
    icon: Eye,
    description: 'Monitor wallet activity'
  },
  {
    name: 'Network Monitor',
    href: '/tools/network-monitor',
    icon: Monitor,
    description: 'Real-time network stats'
  },
]

const analyticsNavigation = [
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Network analytics'
  },
  {
    name: 'Plugins',
    href: '/plugins',
    icon: Puzzle,
    description: 'Manage plugins'
  },
]

const bottomNavigation = [
  {
    name: 'Documentation',
    href: '/docs',
    icon: BookOpen,
    description: 'API docs and guides'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Application settings'
  },
]

interface NavItemProps {
  item: {
    name: string
    href: string
    icon: any
    description: string
  }
  isActive: boolean
}

function NavItem({ item, isActive }: NavItemProps) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden',
        isActive
          ? 'bg-primary text-primary-foreground shadow-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:shadow-soft'
      )}
    >
      <Icon className={cn(
        "mr-3 h-4 w-4 flex-shrink-0 transition-all duration-300",
        isActive ? "scale-110" : "group-hover:scale-110"
      )} />
      <div className="flex-1 min-w-0">
        <div className="truncate transition-all duration-200">{item.name}</div>
        <div className={cn(
          'text-xs truncate transition-all duration-200',
          isActive ? 'text-primary-foreground/80' : 'text-muted-foreground/80 group-hover:text-muted-foreground'
        )}>
          {item.description}
        </div>
      </div>
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full animate-scale-in" />
      )}
      {/* Hover shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </Link>
  )
}

interface NavSectionProps {
  title: string
  items: any[]
  pathname: string
}

function NavSection({ title, items, pathname }: NavSectionProps) {
  return (
    <div className="space-y-1 animate-fade-in-left">
      <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 transition-colors duration-200 hover:text-foreground">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div
            key={item.name}
            className="animate-fade-in-left"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <NavItem
              item={item}
              isActive={pathname === item.href}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col animate-fade-in-left">
      <div className="flex min-h-0 flex-1 flex-col border-r bg-card/95 backdrop-blur-sm shadow-soft">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4 scrollbar-hide">
          <div className="flex flex-shrink-0 items-center px-4 mb-6 group">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary pulse-glow transition-all duration-300 group-hover:scale-110">
                <Zap className="h-5 w-5 text-primary-foreground animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-gradient transition-all duration-300">BlockDAG Scan++</div>
                <div className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">v1.0.0</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-6 px-3">
            {/* Main Navigation */}
            <NavSection
              title="Main"
              items={navigation}
              pathname={pathname}
            />

            {/* Explorer */}
            <NavSection
              title="Explorer"
              items={explorerNavigation}
              pathname={pathname}
            />

            {/* Developer Tools */}
            <NavSection
              title="Developer Tools"
              items={developerTools}
              pathname={pathname}
            />

            {/* Analytics */}
            <NavSection
              title="Analytics"
              items={analyticsNavigation}
              pathname={pathname}
            />
          </nav>

          {/* Bottom Navigation */}
          <div className="flex-shrink-0 px-3 space-y-1">
            <div className="border-t pt-4">
              {bottomNavigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          </div>

          {/* Network Status */}
          <div className="flex-shrink-0 px-3 pt-4 animate-fade-in-up">
            <div className="bg-muted/50 rounded-lg p-3 professional-card border-0 hover:bg-muted/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Network Status</span>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse pulse-glow" />
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between group">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">Block Height:</span>
                  <span className="font-mono text-gradient">1,234,567</span>
                </div>
                <div className="flex justify-between group">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">Gas Price:</span>
                  <span className="font-mono text-gradient">25 gwei</span>
                </div>
                <div className="flex justify-between group">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">TPS:</span>
                  <span className="font-mono text-gradient">15.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
