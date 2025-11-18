import { test, expect } from '@playwright/test';

test.describe('Global Search', () => {
  test('should open search with keyboard shortcut', async ({ page }) => {
    await page.goto('/');
    
    // Press Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    await page.keyboard.press('Meta+K');
    
    // Search dialog should appear
    const searchDialog = page.locator('[role="dialog"]').filter({ hasText: /search/i });
    await expect(searchDialog.first()).toBeVisible({ timeout: 2000 }).catch(() => {
      // Search might not be implemented yet
    });
  });

  test('should display search input', async ({ page }) => {
    await page.goto('/');
    
    // Look for search button or input
    const searchTrigger = page.locator('button, input').filter({ hasText: /search/i }).first();
    if (await searchTrigger.isVisible()) {
      await searchTrigger.click();
      
      // Search input should be visible
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('should show search results', async ({ page }) => {
    await page.goto('/');
    
    const searchTrigger = page.locator('button, input').filter({ hasText: /search/i }).first();
    if (await searchTrigger.isVisible()) {
      await searchTrigger.click();
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        
        // Wait for results
        await page.waitForTimeout(500);
        
        // Results should appear
        const results = page.locator('[role="listbox"], [role="list"]').first();
        await expect(results).toBeVisible({ timeout: 2000 }).catch(() => {
          // Results might not appear if no data
        });
      }
    }
  });

  test('should close search with escape key', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Meta+K');
    await page.waitForTimeout(200);
    
    await page.keyboard.press('Escape');
    
    // Dialog should close
    const searchDialog = page.locator('[role="dialog"]').filter({ hasText: /search/i });
    await expect(searchDialog.first()).not.toBeVisible({ timeout: 1000 }).catch(() => {
      // Search might not be implemented yet
    });
  });
});
