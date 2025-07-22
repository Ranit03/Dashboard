import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { Toaster } from 'react-hot-toast'
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'
import { PerformanceMonitor, WebVitalsReporter, SlowConnectionWarning } from '@/components/performance/PerformanceMonitor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'BlockDAG Scan++',
  description: 'Developer-friendly block explorer with advanced debugging tools and analytics',
  keywords: ['blockchain', 'explorer', 'blockdag', 'developer tools', 'analytics'],
  authors: [{ name: 'BlockDAG Scan++ Team' }],
  openGraph: {
    title: 'BlockDAG Scan++',
    description: 'Developer-friendly block explorer with advanced debugging tools',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlockDAG Scan++',
    description: 'Developer-friendly block explorer with advanced debugging tools',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ServiceWorkerProvider>
          <Providers>
            <div className="min-h-screen bg-background">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 lg:pl-72">
                  <div className="mx-auto max-w-7xl">
                    {children}
                  </div>
                </main>
              </div>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
            <PerformanceMonitor />
            <WebVitalsReporter />
            <SlowConnectionWarning />
          </Providers>
        </ServiceWorkerProvider>
      </body>
    </html>
  )
}
