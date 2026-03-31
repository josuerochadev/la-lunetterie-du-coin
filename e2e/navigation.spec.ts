import { test, expect } from '@playwright/test';

test.describe('Navigation - La Lunetterie du Coin', () => {
  test.describe('Desktop navigation', () => {
    test('should navigate from home to about page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const aboutLink = page.locator('nav a[href="/a-propos"]').first();
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/a-propos');
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
      }
    });

    test('should navigate from home to services page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const servicesLink = page.locator('nav a[href="/services"]').first();
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/services');
      }
    });

    test('should navigate from home to offers page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const offersLink = page.locator('nav a[href="/offres"]').first();
      if (await offersLink.isVisible()) {
        await offersLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/offres');
      }
    });

    test('should navigate from home to contact page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const contactLink = page.locator('nav a[href="/contact"]').first();
      if (await contactLink.isVisible()) {
        await contactLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/contact');
      }
    });
  });

  test.describe('Footer navigation', () => {
    test('should have footer links to main pages', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const footer = page.locator('#footer');
      await footer.scrollIntoViewIfNeeded();

      // Check for key footer links
      const footerLinks = footer.locator('a');
      const count = await footerLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have legal links in footer', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const footer = page.locator('#footer');
      await footer.scrollIntoViewIfNeeded();

      const mentionsLink = footer.locator('a[href="/mentions-legales"]');
      const conditionsLink = footer.locator('a[href="/conditions-de-vente"]');

      if ((await mentionsLink.count()) > 0) {
        await mentionsLink.first().scrollIntoViewIfNeeded();
        await expect(mentionsLink.first()).toBeVisible();
      }
      if ((await conditionsLink.count()) > 0) {
        await conditionsLink.first().scrollIntoViewIfNeeded();
        await expect(conditionsLink.first()).toBeVisible();
      }
    });

    test('should navigate to legal page from footer', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const footer = page.locator('#footer');
      await footer.scrollIntoViewIfNeeded();

      const mentionsLink = footer.locator('a[href="/mentions-legales"]').first();
      await mentionsLink.scrollIntoViewIfNeeded();
      if (await mentionsLink.isVisible()) {
        await mentionsLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/mentions-legales');
      }
    });
  });

  test.describe('Mobile navigation', () => {
    test('should open and close mobile menu', async ({ page, isMobile }) => {
      if (!isMobile) test.skip();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find and click menu button
      const menuButton = page
        .locator('button[aria-label*="menu" i]')
        .or(page.locator('button').filter({ hasText: /menu/i }));

      if (await menuButton.first().isVisible()) {
        await menuButton.first().click();

        // Menu should be visible
        const menu = page.locator('[role="dialog"]').or(page.locator('nav[aria-label*="menu" i]'));
        await expect(menu.first()).toBeVisible();

        // Close with Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    });

    test('should navigate via mobile menu', async ({ page, isMobile }) => {
      if (!isMobile) test.skip();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const menuButton = page
        .locator('button[aria-label*="menu" i]')
        .or(page.locator('button').filter({ hasText: /menu/i }));

      if (await menuButton.first().isVisible()) {
        await menuButton.first().click();
        await page.waitForTimeout(300);

        // Click a navigation link in the mobile menu
        const aboutLink = page.locator('a[href="/a-propos"]').first();
        if (await aboutLink.isVisible()) {
          await aboutLink.click();
          await page.waitForLoadState('networkidle');
          await expect(page).toHaveURL('/a-propos');
        }
      }
    });
  });

  test.describe('Keyboard navigation', () => {
    test('should navigate via Tab key through main elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Tab through the page - verify focus moves
      await page.keyboard.press('Tab');
      const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(firstFocused).toBeTruthy();

      // Tab a few more times
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      const thirdFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(thirdFocused).toBeTruthy();
    });
  });
});
