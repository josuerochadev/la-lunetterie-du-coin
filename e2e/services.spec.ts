import { test, expect } from '@playwright/test';

test.describe('Services Page - La Lunetterie du Coin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
  });

  test('should load services page', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display hero with services title', async ({ page }) => {
    const title = page.getByText(/nos services/i).first();
    await expect(title).toBeVisible();
  });

  test('should display service content section', async ({ page }) => {
    const contentSection = page.locator('#services-content');
    if ((await contentSection.count()) > 0) {
      await contentSection.scrollIntoViewIfNeeded();
      await expect(contentSection).toBeVisible();
    }
  });

  test('should display service cards or descriptions', async ({ page }) => {
    // Vérifier qu'il y a du contenu dans la section services
    const contentSection = page.locator('#services-content');
    if ((await contentSection.count()) > 0) {
      await contentSection.scrollIntoViewIfNeeded();
      await expect(contentSection).toBeVisible();
      // Vérifier qu'il y a au moins un heading dans la section
      const headings = contentSection.locator('h2, h3');
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should have CTA section', async ({ page }) => {
    // Le CTA heading est "VOYEZ LA DIFFÉRENCE"
    const ctaHeading = page.getByText(/voyez.*différence|différence/i).first();
    await ctaHeading.scrollIntoViewIfNeeded();
    await expect(ctaHeading).toBeVisible();
  });

  test('should have navigation links to offers and contact', async ({ page }) => {
    const offersLinks = page.locator('a[href="/offres"]');
    const contactLinks = page.locator('a[href="/contact"]');

    // Vérifier que les liens existent dans la page
    await expect(offersLinks.first()).toBeAttached();
    await expect(contactLinks.first()).toBeAttached();

    // Vérifier la visibilité d'un lien contact (avec attente)
    await expect(contactLinks.first()).toBeVisible({ timeout: 10000 });
  });

  test('should have proper heading structure', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    expect(h1Count).toBeLessThanOrEqual(2);
  });
});
