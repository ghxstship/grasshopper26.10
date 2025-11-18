import { test, expect } from '@playwright/test';

test.describe('ATLVS Projects Flow', () => {
  test('should display projects page', async ({ page }) => {
    await page.goto('/atlvs/projects');
    
    await expect(page.locator('h1')).toContainText(/projects/i);
  });

  test('should display create project form', async ({ page }) => {
    await page.goto('/atlvs/projects/create');
    
    await expect(page.locator('h1')).toContainText(/create|new project/i);
    
    // Should have form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display tasks page', async ({ page }) => {
    await page.goto('/atlvs/tasks');
    
    await expect(page.locator('h1')).toContainText(/tasks/i);
  });

  test('should display create task form', async ({ page }) => {
    await page.goto('/atlvs/tasks/new');
    
    await expect(page.locator('h1')).toContainText(/create|new task/i);
    
    // Should have form fields
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display equipment booking', async ({ page }) => {
    await page.goto('/atlvs/assets/book');
    
    await expect(page.locator('h1')).toContainText(/book|equipment/i);
  });
});
