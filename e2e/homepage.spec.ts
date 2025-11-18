import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/GVTEWAY/)
  })

  test('should display all three platform sections', async ({ page }) => {
    // Check for GVTEWAY section
    await expect(page.getByText(/GVTEWAY/i).first()).toBeVisible()
    
    // Check for COMPVSS section
    await expect(page.getByText(/COMPVSS/i).first()).toBeVisible()
    
    // Check for ATLVS section
    await expect(page.getByText(/ATLVS/i).first()).toBeVisible()
  })

  test('should have navigation links', async ({ page }) => {
    // Check for navigation elements
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Page should still be visible and functional
    await expect(page.getByText(/GVTEWAY/i).first()).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Page should still be visible and functional
    await expect(page.getByText(/GVTEWAY/i).first()).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Page should still be visible and functional
    await expect(page.getByText(/GVTEWAY/i).first()).toBeVisible()
  })
})
