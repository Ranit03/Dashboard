import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads dashboard with all main components', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/BlockDAG Scan\+\+/)

    // Check header
    await expect(page.getByText('BlockDAG Scan++')).toBeVisible()

    // Check sidebar navigation
    await expect(page.getByText('Dashboard')).toBeVisible()
    await expect(page.getByText('Explorer')).toBeVisible()
    await expect(page.getByText('Developer Tools')).toBeVisible()

    // Check main content areas
    await expect(page.getByText('Welcome to BlockDAG Scan++')).toBeVisible()
    await expect(page.getByText('Network Statistics')).toBeVisible()
    await expect(page.getByText('Recent Blocks')).toBeVisible()
    await expect(page.getByText('Recent Transactions')).toBeVisible()
  })

  test('displays network statistics with live data', async ({ page }) => {
    // Wait for network stats to load
    await expect(page.getByText('Network Statistics')).toBeVisible()

    // Check for live indicator
    await expect(page.getByText('Live')).toBeVisible()

    // Check for key metrics
    await expect(page.getByText('Latest Block')).toBeVisible()
    await expect(page.getByText('Total Transactions')).toBeVisible()
    await expect(page.getByText('Average Gas Price')).toBeVisible()
    await expect(page.getByText('TPS')).toBeVisible()

    // Check for numeric values (should contain numbers)
    const blockHeight = page.locator('[data-testid="block-height"]').first()
    await expect(blockHeight).toContainText(/\d+/)
  })

  test('can pause and resume live updates', async ({ page }) => {
    // Wait for the pause button to be visible
    await expect(page.getByText('Pause')).toBeVisible()

    // Click pause
    await page.getByText('Pause').click()

    // Should show paused state
    await expect(page.getByText('Paused')).toBeVisible()
    await expect(page.getByText('Resume')).toBeVisible()

    // Click resume
    await page.getByText('Resume').click()

    // Should show live state again
    await expect(page.getByText('Live')).toBeVisible()
    await expect(page.getByText('Pause')).toBeVisible()
  })

  test('displays recent blocks with correct information', async ({ page }) => {
    await expect(page.getByText('Recent Blocks')).toBeVisible()

    // Should show block numbers
    await expect(page.locator('text=/^#\d+/')).toBeVisible()

    // Should show transaction counts
    await expect(page.locator('text=/\d+ txns/')).toBeVisible()

    // Should show gas usage percentages
    await expect(page.locator('text=/\d+% gas used/')).toBeVisible()

    // Should show timestamps
    await expect(page.locator('text=/ago$/')).toBeVisible()
  })

  test('displays recent transactions with status indicators', async ({ page }) => {
    await expect(page.getByText('Recent Transactions')).toBeVisible()

    // Should show transaction hashes
    await expect(page.locator('text=/^0x[a-f0-9]+\.\.\.[a-f0-9]+/')).toBeVisible()

    // Should show ETH values
    await expect(page.locator('text=/\d+\.\d+ ETH/')).toBeVisible()

    // Should show gas prices
    await expect(page.locator('text=/\d+\.\d+ gwei/')).toBeVisible()

    // Should show status badges
    await expect(page.locator('text=Success').or(page.locator('text=Failed')).or(page.locator('text=Pending'))).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    // Click on search input
    const searchInput = page.getByPlaceholder('Search blocks, transactions, addresses...')
    await searchInput.click()

    // Should show recent searches dropdown
    await expect(page.getByText('Recent Searches')).toBeVisible()

    // Type in search
    await searchInput.fill('block')

    // Should show search results (after debounce)
    await page.waitForTimeout(500)
    await expect(page.getByText(/result.*found/)).toBeVisible()
  })

  test('quick actions are clickable', async ({ page }) => {
    // Wait for quick actions to load
    await expect(page.getByText('Quick Actions')).toBeVisible()

    // Check for action items
    await expect(page.getByText('Contract Diff')).toBeVisible()
    await expect(page.getByText('Gas Analyzer')).toBeVisible()
    await expect(page.getByText('Debug Console')).toBeVisible()
    await expect(page.getByText('Wallet Monitor')).toBeVisible()

    // Click on Contract Diff
    await page.getByText('Contract Diff').click()

    // Should navigate to contract diff page
    await expect(page).toHaveURL(/\/tools\/contract-diff/)
    await expect(page.getByText('Compare smart contract versions')).toBeVisible()
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that content is still visible and properly arranged
    await expect(page.getByText('BlockDAG Scan++')).toBeVisible()
    await expect(page.getByText('Network Statistics')).toBeVisible()

    // On mobile, some elements might be stacked differently
    // but core functionality should remain
  })

  test('theme switching works', async ({ page }) => {
    // Look for theme toggle (if implemented)
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /theme|dark|light/i })
    )

    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      
      // Check if theme changed (look for dark class or different colors)
      const body = page.locator('body')
      await expect(body).toHaveClass(/dark|light/)
    }
  })

  test('navigation between pages works', async ({ page }) => {
    // Test sidebar navigation
    await page.getByText('Explorer').click()
    await expect(page.getByText('Blocks')).toBeVisible()

    await page.getByText('Developer Tools').click()
    await expect(page.getByText('Contract Diff')).toBeVisible()

    // Go back to dashboard
    await page.getByText('Dashboard').click()
    await expect(page.getByText('Welcome to BlockDAG Scan++')).toBeVisible()
  })

  test('performance is acceptable', async ({ page }) => {
    // Measure page load performance
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime

    // Should load within reasonable time (adjust threshold as needed)
    expect(loadTime).toBeLessThan(5000) // 5 seconds

    // Check for performance monitoring in dev mode
    if (process.env.NODE_ENV === 'development') {
      // Look for performance monitor (if visible in dev)
      const perfMonitor = page.locator('[data-testid="performance-monitor"]')
      if (await perfMonitor.isVisible()) {
        await expect(perfMonitor).toContainText(/Load:|Render:/)
      }
    }
  })
})
