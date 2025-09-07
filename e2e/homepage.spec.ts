// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Homepage - La Lunetterie du Coin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/La Lunetterie du Coin/);
  });

  test('should display hero section', async ({ page }) => {
    // Vérifier la présence du logo
    const logo = page.locator('[data-testid="logo"]').or(page.locator('img').first());
    await expect(logo).toBeVisible();

    // Vérifier la présence du titre principal
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText(/lunetterie/i);
  });

  test('should navigate through main sections', async ({ page }) => {
    // Test de navigation vers les sections principales
    const sections = ['Services', 'Concept', 'Offres', 'Contact'];
    
    for (const section of sections) {
      // Cliquer sur le lien de navigation
      const navLink = page.locator(`nav a:has-text("${section}")`).first();
      if (await navLink.isVisible()) {
        await navLink.click();
        
        // Vérifier que la section est visible
        const sectionElement = page.locator(`#${section.toLowerCase()}`).or(
          page.locator(`section:has-text("${section}")`).first()
        );
        await expect(sectionElement).toBeInViewport({ ratio: 0.3 });
      }
    }
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();

    // Vérifier que le menu mobile fonctionne
    const menuButton = page.locator('[aria-label*="menu"]', { hasText: /menu/i }).or(
      page.locator('button').filter({ hasText: /menu/i })
    );
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      // Vérifier que le menu s'ouvre
      const mobileMenu = page.locator('[role="dialog"]').or(
        page.locator('.mobile-menu, [data-testid="mobile-menu"]')
      );
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('should have good performance metrics', async ({ page }) => {
    // Mesurer les Core Web Vitals
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Moins de 3 secondes

    // Vérifier que les images importantes se chargent
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Vérifier que au moins la première image est chargée
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      
      // Vérifier que l'image a un attribut alt
      await expect(firstImage).toHaveAttribute('alt', /.+/);
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Vérifier les attributs d'accessibilité essentiels
    
    // Skip links pour la navigation clavier
    const skipLinks = page.locator('a[href="#main-content"], .skip-link');
    if (await skipLinks.count() > 0) {
      await expect(skipLinks.first()).toBeInTheDOM();
    }

    // Vérifier la structure des headings
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();
    expect(h1Count).toBeGreaterThan(0);
    expect(h1Count).toBeLessThanOrEqual(2); // Pas plus de 2 H1

    // Vérifier que les boutons ont des labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const hasText = await button.textContent();
        const hasAriaLabel = await button.getAttribute('aria-label');
        expect(hasText || hasAriaLabel).toBeTruthy();
      }
    }
  });
});