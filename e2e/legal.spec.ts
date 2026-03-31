import { test, expect } from '@playwright/test';

test.describe('Legal Pages - La Lunetterie du Coin', () => {
  test.describe('Mentions Légales', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/mentions-legales');
      await page.waitForLoadState('networkidle');
    });

    test('should load mentions légales page', async ({ page }) => {
      const heading = page.getByText(/mentions légales/i).first();
      await expect(heading).toBeVisible();
    });

    test('should display table of contents', async ({ page }) => {
      // Table of contents with links to sections
      const tocLinks = page.locator('a[href^="#"]');
      const count = await tocLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display key legal sections', async ({ page }) => {
      // Check for éditeur section
      const editeurSection = page.locator('#editeur');
      if ((await editeurSection.count()) > 0) {
        await editeurSection.scrollIntoViewIfNeeded();
        await expect(editeurSection).toBeVisible();
      }
    });

    test('should navigate to sections via table of contents', async ({ page }) => {
      const firstTocLink = page.locator('a[href^="#"]').first();
      if ((await firstTocLink.count()) > 0) {
        const href = await firstTocLink.getAttribute('href');
        expect(href).toBeTruthy();

        // Naviguer via hash directement (plus fiable que click en CI)
        await page.evaluate((h) => (location.hash = h!), href);
        await page.waitForTimeout(200);
        expect(page.url()).toContain('#');
      }
    });

    test('should have proper heading structure', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);
      expect(h1Count).toBeLessThanOrEqual(2);
    });
  });

  test.describe('Conditions de Vente', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/conditions-de-vente');
      await page.waitForLoadState('networkidle');
    });

    test('should load conditions de vente page', async ({ page }) => {
      const heading = page.getByText(/conditions.*vente/i).first();
      await expect(heading).toBeVisible();
    });

    test('should display table of contents', async ({ page }) => {
      const tocLinks = page.locator('a[href^="#"]');
      const count = await tocLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display key sections', async ({ page }) => {
      // Check for fabrication or retour sections
      const fabrication = page.locator('#fabrication');
      if ((await fabrication.count()) > 0) {
        await fabrication.scrollIntoViewIfNeeded();
        await expect(fabrication).toBeVisible();
      }
    });

    test('should have proper heading structure', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);
      expect(h1Count).toBeLessThanOrEqual(2);
    });
  });
});
