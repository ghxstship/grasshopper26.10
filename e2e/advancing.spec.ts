import { test, expect } from '@playwright/test';

test.describe('COMPVSS Advancing Flow', () => {
  test('should display advancing dashboard', async ({ page }) => {
    await page.goto('/compvss/advancing/dashboard');
    
    await expect(page.locator('h1')).toContainText(/advancing|dashboard/i);
  });

  test('should display new request categories', async ({ page }) => {
    await page.goto('/compvss/advancing/new');
    
    await expect(page.locator('h1')).toContainText(/new request|categories/i);
    
    // Should have category cards
    const categoryCards = page.locator('a[href*="/advancing/"]');
    await expect(categoryCards.first()).toBeVisible();
  });

  test('should navigate to access request form', async ({ page }) => {
    await page.goto('/compvss/advancing/new');
    
    const accessLink = page.locator('a[href*="/advancing/access"]');
    if (await accessLink.isVisible()) {
      await accessLink.click();
      await expect(page).toHaveURL(/\/advancing\/access/);
      
      // Should have form fields
      await expect(page.locator('input[name="title"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    }
  });

  test('should display request tracking', async ({ page }) => {
    await page.goto('/compvss/advancing/tracking');
    
    await expect(page.locator('h1')).toContainText(/tracking/i);
    
    // Should have search/filter
    const searchInput = page.locator('input[placeholder*="search" i]');
    await expect(searchInput).toBeVisible();
  });

  test('should display analytics', async ({ page }) => {
    await page.goto('/compvss/advancing/analytics');
    
    await expect(page.locator('h1')).toContainText(/analytics/i);
    
    // Should have metrics cards
    const metricsCards = page.locator('[class*="card"]');
    await expect(metricsCards.first()).toBeVisible();
  });
});
