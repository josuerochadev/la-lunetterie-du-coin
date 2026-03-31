import { test, expect } from '@playwright/test';

test.describe('Offers Page - La Lunetterie du Coin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/offres');
    await page.waitForLoadState('networkidle');
  });

  test('should load offers page', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display hero with offers title', async ({ page }) => {
    const title = page.getByText(/nos offres/i).first();
    await expect(title).toBeVisible();
  });

  test('should display offer cards', async ({ page }) => {
    // Check for offer content (numbered offers like 01/02, 02/02)
    const offerContent = page.getByText(/01|02/).first();
    await expect(offerContent).toBeVisible();
  });

  test('should have contact CTA links', async ({ page }) => {
    // "En profiter" links or "Nous contacter" links pointing to /contact
    const contactLinks = page.locator('a[href="/contact"]');
    const count = await contactLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display CTA section', async ({ page }) => {
    // Vérifier le CTA via la section avec aria-label et le lien contact
    const ctaSection = page.locator('section[aria-label="Nous contacter"]');
    await expect(ctaSection).toBeAttached();

    const ctaLink = ctaSection.locator('a[href="/contact"]');
    await expect(ctaLink).toBeAttached();
  });

  test('should have proper heading structure', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    expect(h1Count).toBeLessThanOrEqual(2);
  });
});
