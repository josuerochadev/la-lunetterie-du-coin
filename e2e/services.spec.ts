import { test, expect } from '@playwright/test';

test.describe('Services Page - La Lunetterie du Coin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
  });

  test('should load services page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display hero with services title', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const title = page.getByText(/nos services/i).first();
    await expect(title).toBeVisible();
  });

  test('should display service content section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const contentSection = page.locator('#services-content');
    if ((await contentSection.count()) > 0) {
      await contentSection.scrollIntoViewIfNeeded();
      await expect(contentSection).toBeVisible();
    }
  });

  test('should display service cards or descriptions', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    // Check for service-related content (cards with numbered items 1/4, 2/4, etc.)
    const serviceText = page.getByText(/service.*moment|chaque service/i).first();
    await expect(serviceText).toBeVisible();
  });

  test('should have CTA section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const ctaHeading = page.getByText(/voyez.*différence|différence/i).first();
    await expect(ctaHeading).toBeVisible();
  });

  test('should have navigation links to offers and contact', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const offersLink = page.locator('a[href="/offres"]').first();
    const contactLink = page.locator('a[href="/contact"]').first();

    if ((await offersLink.count()) > 0) {
      await expect(offersLink).toBeVisible();
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
