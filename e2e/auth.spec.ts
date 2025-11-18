import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    
    await expect(page.locator('h1')).toContainText(/login|sign in/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/auth/register');
    
    await expect(page.locator('h1')).toContainText(/register|sign up/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.click('button[type="submit"]');
    
    // Should show validation errors or prevent submission
    await expect(page.locator('input[type="email"]:invalid')).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.click('a[href*="register"]');
    await expect(page).toHaveURL(/register/);
    
    await page.click('a[href*="login"]');
    await expect(page).toHaveURL(/login/);
  });
});
