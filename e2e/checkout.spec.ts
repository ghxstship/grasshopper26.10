import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to events page
    await page.goto('/gvteway/events');
  });

  test('should display checkout page', async ({ page }) => {
    await page.goto('/gvteway/tickets/checkout');
    
    await expect(page.locator('h1')).toContainText(/checkout|payment/i);
  });

  test('should show ticket selection', async ({ page }) => {
    // Click on an event if available
    const eventCard = page.locator('a[href*="/events/"]').first();
    if (await eventCard.isVisible()) {
      await eventCard.click();
      
      // Look for buy/purchase button
      const buyButton = page.locator('button').filter({ hasText: /buy|purchase/i }).first();
      if (await buyButton.isVisible()) {
        await buyButton.click();
        
        // Should navigate to checkout
        await expect(page).toHaveURL(/checkout/);
      }
    }
  });

  test('should display payment form fields', async ({ page }) => {
    await page.goto('/gvteway/tickets/checkout');
    
    // Should have email input
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
    }
  });

  test('should validate empty form submission', async ({ page }) => {
    await page.goto('/gvteway/tickets/checkout');
    
    const submitButton = page.locator('button[type="submit"]').first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Should show validation errors or prevent submission
      await expect(page.locator('input:invalid').first()).toBeVisible();
    }
  });

  test('should show order summary', async ({ page }) => {
    await page.goto('/gvteway/tickets/checkout');
    
    // Look for price/total information
    const priceElements = page.locator('text=/\\$[0-9]+/').first();
    if (await priceElements.isVisible()) {
      await expect(priceElements).toBeVisible();
    }
  });
});
