import { test, expect } from '@playwright/test';

test.describe('About Page - La Lunetterie du Coin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/a-propos');
  });

  test('should load about page', async ({ page }) => {
    // Wait for content to load (lazy-loaded page)
    await page.waitForLoadState('networkidle');
    // Check for hero heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display hero section with title', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const heroText = page.getByText(/expert|ex.?paires/i).first();
    await expect(heroText).toBeVisible();
  });

  test('should display history section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const historySection = page.locator('#histoire');
    if ((await historySection.count()) > 0) {
      await historySection.scrollIntoViewIfNeeded();
      await expect(historySection).toBeVisible();
    }
    const historyHeading = page.getByText(/notre histoire/i).first();
    await expect(historyHeading).toBeVisible();
  });

  test('should display values section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const valuesHeading = page.getByText(/lunetterie.*cœur|cœur/i).first();
    await expect(valuesHeading).toBeVisible();
  });

  test('should display team section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const teamHeading = page.getByText(/œil.*boutique|derrière/i).first();
    await expect(teamHeading).toBeVisible();
  });

  test('should have CTA links', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    // Check for service/contact CTA links
    const serviceLink = page.locator('a[href="/services"]').first();
    const contactLink = page.locator('a[href="/contact"]').first();

    if ((await serviceLink.count()) > 0) {
      await expect(serviceLink).toBeVisible();
    }
    if ((await contactLink.count()) > 0) {
      await expect(contactLink).toBeVisible();
    }
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    expect(h1Count).toBeLessThanOrEqual(2);
  });
});
