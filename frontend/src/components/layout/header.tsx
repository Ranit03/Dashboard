'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { 
  Search, 
  Moon, 
  Sun, 
  Settings, 
  Bell, 
  User,
  Menu,
  X,
  Zap
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-all duration-300 shadow-soft">
        <div className="container flex h-16 items-center justify-between px-4 animate-fade-in-down">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden professional-button p-2 hover:bg-accent rounded-md transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6 transition-transform duration-200 hover:scale-110" />
            </button>

            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary pulse-glow transition-all duration-300 group-hover:scale-110">
                <Zap className="h-5 w-5 text-primary-foreground animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-gradient transition-all duration-300">BlockDAG Scan++</span>
                <div className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">Developer Tools</div>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/blocks"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group px-2 py-1 rounded-md hover:bg-accent/50"
            >
              Blocks
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/transactions"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group px-2 py-1 rounded-md hover:bg-accent/50"
            >
              Transactions
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/addresses"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group px-2 py-1 rounded-md hover:bg-accent/50"
            >
              Addresses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contracts"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group px-2 py-1 rounded-md hover:bg-accent/50"
            >
              Contracts
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/tools"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group px-2 py-1 rounded-md hover:bg-accent/50"
            >
              Dev Tools
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/analytics"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group px-2 py-1 rounded-md hover:bg-accent/50"
            >
              Analytics
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button - Mobile */}
            <button className="lg:hidden professional-button p-2 hover:bg-accent rounded-md transition-all duration-200">
              <Search className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
            </button>

            {/* Notifications */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="relative professional-button p-2 hover:bg-accent rounded-md transition-all duration-200 group">
                  <Bell className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground animate-pulse">
                    2
                  </span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[300px] bg-popover border rounded-lg p-2 shadow-large animate-scale-in"
                  sideOffset={5}
                >
                  <div className="px-2 py-1 text-sm font-medium">Notifications</div>
                  <DropdownMenu.Separator className="h-px bg-border my-1" />
                  <div className="space-y-1">
                    <div className="p-2 text-sm hover:bg-accent rounded-md transition-all duration-200 cursor-pointer group">
                      <div className="font-medium group-hover:text-primary transition-colors">New block mined</div>
                      <div className="text-muted-foreground text-xs">Block #12345 - 2 min ago</div>
                    </div>
                    <div className="p-2 text-sm hover:bg-accent rounded-md transition-all duration-200 cursor-pointer group">
                      <div className="font-medium group-hover:text-primary transition-colors">High gas alert</div>
                      <div className="text-muted-foreground text-xs">Gas price above 50 gwei - 5 min ago</div>
                    </div>
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="professional-button p-2 hover:bg-accent rounded-md transition-all duration-300 relative overflow-hidden group"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 group-hover:rotate-12" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 group-hover:-rotate-12" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="professional-button p-2 hover:bg-accent rounded-md transition-all duration-200 group"
            >
              <Settings className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            </button>

            {/* User Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="professional-button p-2 hover:bg-accent rounded-md transition-all duration-200 group">
                  <User className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[200px] bg-popover border rounded-lg p-1 shadow-large animate-scale-in"
                  sideOffset={5}
                >
                  <DropdownMenu.Item className="px-2 py-1 text-sm hover:bg-accent rounded-md cursor-pointer transition-all duration-200">
                    Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="px-2 py-1 text-sm hover:bg-accent rounded-md cursor-pointer transition-all duration-200">
                    Watchlist
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="px-2 py-1 text-sm hover:bg-accent rounded-md cursor-pointer transition-all duration-200">
                    API Keys
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-border my-1" />
                  <DropdownMenu.Item className="px-2 py-1 text-sm hover:bg-accent rounded-md cursor-pointer text-destructive transition-all duration-200">
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed left-0 top-0 h-full w-80 bg-background border-r z-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-lg font-semibold">Menu</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-accent rounded-md">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            
            <nav className="space-y-4">
              <Link href="/blocks" className="block py-2 text-sm font-medium">
                Blocks
              </Link>
              <Link href="/transactions" className="block py-2 text-sm font-medium">
                Transactions
              </Link>
              <Link href="/addresses" className="block py-2 text-sm font-medium">
                Addresses
              </Link>
              <Link href="/contracts" className="block py-2 text-sm font-medium">
                Contracts
              </Link>
              <Link href="/tools" className="block py-2 text-sm font-medium">
                Dev Tools
              </Link>
              <Link href="/analytics" className="block py-2 text-sm font-medium">
                Analytics
              </Link>
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Settings Dialog */}
      <Dialog.Root open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background border rounded-lg z-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-lg font-semibold">Settings</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-accent rounded-md">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Theme</label>
                <select 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md bg-background"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Auto-refresh</label>
                <select className="w-full mt-1 p-2 border rounded-md bg-background">
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="0">Disabled</option>
                </select>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
