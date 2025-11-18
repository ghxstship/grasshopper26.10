import { test, expect } from '@playwright/test';

test.describe('Events Flow', () => {
  test('should display events page', async ({ page }) => {
    await page.goto('/gvteway/events');
    
    await expect(page.locator('h1')).toContainText(/events/i);
  });

  test('should display event search', async ({ page }) => {
    await page.goto('/gvteway/events');
    
    const searchInput = page.locator('input[placeholder*="search" i]');
    await expect(searchInput).toBeVisible();
  });

  test('should filter events by category', async ({ page }) => {
    await page.goto('/gvteway/events');
    
    // Look for category filters
    const filters = page.locator('select, button').filter({ hasText: /category|filter/i });
    await expect(filters.first()).toBeVisible();
  });

  test('should navigate to event details', async ({ page }) => {
    await page.goto('/gvteway/events');
    
    // Click first event card if exists
    const eventCard = page.locator('a[href*="/events/"]').first();
    if (await eventCard.isVisible()) {
      await eventCard.click();
      await expect(page).toHaveURL(/\/events\/[^/]+/);
    }
  });
});
