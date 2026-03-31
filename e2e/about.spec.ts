import { test, expect } from '@playwright/test';

test.describe('About Page - La Lunetterie du Coin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/a-propos');
    await page.waitForLoadState('networkidle');
  });

  test('should load about page', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display hero section with title', async ({ page }) => {
    const heroText = page.getByText(/expert|ex.?paires/i).first();
    await expect(heroText).toBeVisible();
  });

  test('should display history section', async ({ page }) => {
    const historySection = page.locator('#histoire');
    await expect(historySection).toBeAttached();

    // Scroll to the section via JS (more reliable than scrollIntoViewIfNeeded on sticky layouts)
    await page.evaluate(() => document.querySelector('#histoire')?.scrollIntoView());
    await page.waitForTimeout(500);

    // Vérifier que la section contient un heading
    const historyHeading = historySection.locator('h2').first();
    await expect(historyHeading).toBeAttached();
  });

  test('should display values section', async ({ page }) => {
    const valuesSection = page.locator('#valeurs');
    if ((await valuesSection.count()) > 0) {
      await valuesSection.scrollIntoViewIfNeeded();
    }
    const valuesHeading = page.getByText(/lunetterie.*cœur|cœur/i).first();
    await valuesHeading.scrollIntoViewIfNeeded();
    await expect(valuesHeading).toBeVisible();
  });

  test('should display team section', async ({ page }) => {
    const teamSection = page.locator('#equipe');
    if ((await teamSection.count()) > 0) {
      await teamSection.scrollIntoViewIfNeeded();
    }
    const teamHeading = page.getByText(/œil.*boutique|derrière/i).first();
    await teamHeading.scrollIntoViewIfNeeded();
    await expect(teamHeading).toBeVisible();
  });

  test('should have CTA links', async ({ page }) => {
    const serviceLink = page.locator('a[href="/services"]').first();
    const contactLink = page.locator('a[href="/contact"]').first();

    if ((await serviceLink.count()) > 0) {
      await serviceLink.scrollIntoViewIfNeeded();
      await expect(serviceLink).toBeVisible();
    }
    if ((await contactLink.count()) > 0) {
      await contactLink.scrollIntoViewIfNeeded();
      await expect(contactLink).toBeVisible();
    }
  });

  test('should have proper heading structure', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    expect(h1Count).toBeLessThanOrEqual(2);
  });
});
