import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login button when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });

  test('should open login modal', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Login")');

    await page.fill('input[type="email"]', 'admin@cozylagos.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Login")');

    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
