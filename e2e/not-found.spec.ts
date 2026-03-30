import { test, expect } from '@playwright/test';

test.describe('404 Not Found Page', () => {
  test('should display not found page for invalid routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await page.waitForLoadState('networkidle');

    const notFoundText = page.getByText(/page non trouvée|n'existe pas|introuvable|404/i).first();
    await expect(notFoundText).toBeVisible();
  });

  test('should have navigation links back to the site', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await page.waitForLoadState('networkidle');

    // Should have links to services or contact
    const serviceLink = page.locator('a[href="/services"]');
    const contactLink = page.locator('a[href="/contact"]');

    const hasService = (await serviceLink.count()) > 0;
    const hasContact = (await contactLink.count()) > 0;
    expect(hasService || hasContact).toBe(true);
  });
});
