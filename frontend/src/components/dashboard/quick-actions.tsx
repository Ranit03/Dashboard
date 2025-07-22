'use client'

import Link from 'next/link'
import {
  GitCompare,
  Zap,
  Bug,
  Eye,
  Monitor,
  Search,
  FileCode,
  BarChart3,
  ArrowRight
} from 'lucide-react'
import { TiltCard, Ripple } from '@/components/ui/micro-interactions'

const quickActions = [
  {
    title: 'Contract Diff',
    description: 'Compare contract versions and analyze changes',
    href: '/tools/contract-diff',
    icon: GitCompare,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  },
  {
    title: 'Gas Analyzer',
    description: 'Analyze transaction gas usage and optimize costs',
    href: '/tools/gas-analyzer',
    icon: Zap,
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
  },
  {
    title: 'Debug Console',
    description: 'Interactive debugging for transactions',
    href: '/tools/debug',
    icon: Bug,
    color: 'bg-red-500/10 text-red-600 border-red-500/20'
  },
  {
    title: 'Wallet Monitor',
    description: 'Track wallet activities and set alerts',
    href: '/tools/wallet-monitor',
    icon: Eye,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
  },
  {
    title: 'Network Monitor',
    description: 'Real-time network statistics and health',
    href: '/tools/network-monitor',
    icon: Monitor,
    color: 'bg-green-500/10 text-green-600 border-green-500/20'
  },
  {
    title: 'Advanced Search',
    description: 'Search with filters and advanced options',
    href: '/search',
    icon: Search,
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
  },
  {
    title: 'Contract Explorer',
    description: 'Browse and analyze smart contracts',
    href: '/contracts',
    icon: FileCode,
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Comprehensive network analytics',
    href: '/analytics',
    icon: BarChart3,
    color: 'bg-teal-500/10 text-teal-600 border-teal-500/20'
  }
]

export function QuickActions() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gradient">Quick Actions</h2>
        <Ripple>
          <Link
            href="/tools"
            className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1 professional-button px-3 py-1 rounded-lg transition-all duration-300 hover:bg-primary/10"
          >
            <span>View All Tools</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Ripple>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon

          return (
            <TiltCard key={action.title} maxTilt={5}>
              <Ripple>
                <Link
                  href={action.href}
                  className="group block p-6 border rounded-xl hover-lift transition-all duration-300 animate-fade-in-up bg-card hover:bg-card/80 professional-card shadow-soft hover:shadow-large interactive-scale"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${action.color}`}>
                      <Icon className="h-5 w-5 transition-transform duration-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors duration-200 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-200">
                        {action.description}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </Link>
              </Ripple>
            </TiltCard>
          )
        })}
      </div>
    </div>
  )
}
