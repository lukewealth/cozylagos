import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Cozy Lagos/);
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('should navigate to explorer', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Explorer');
    await expect(page).toHaveURL(/explorer/);
  });
});
