import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[type="email"]', 'admin@cozylagos.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/dashboard/);
  });

  test('should display dashboard sidebar', async ({ page }) => {
    await expect(page.locator('aside')).toBeVisible();
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    await page.click('text=Overview');
    await expect(page.locator('h1:has-text("Overview")')).toBeVisible();

    await page.click('text=Listings');
    await expect(page.locator('h1:has-text("Listings")')).toBeVisible();
  });

  test('should display analytics', async ({ page }) => {
    await page.click('text=Overview');
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Active Listings')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.click('button[aria-label="Logout"]');
    await expect(page).toHaveURL('/');
  });
});
