// e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  // Configuration pour les tests visuels
  test.use({
    // Définir une taille de viewport fixe pour la cohérence
    viewport: { width: 1280, height: 720 }
  });

  test.beforeEach(async ({ page }) => {
    // Attendre que les animations soient terminées avant capture
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Désactiver les animations pour des captures cohérentes
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
  });

  test('should match homepage screenshot', async ({ page }) => {
    // Attendre que le contenu soit chargé
    await page.waitForSelector('[data-testid="hero-section"], h1, .hero');
    
    // Faire défiler vers le haut pour s'assurer du positionnement
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Capturer la page complète
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('should match hero section', async ({ page }) => {
    // Localiser la section hero
    const heroSection = page.locator('[data-testid="hero-section"], .hero, section').first();
    await expect(heroSection).toBeVisible();

    // Capturer uniquement la section hero
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('should match navigation bar', async ({ page }) => {
    // Localiser la navigation
    const navbar = page.locator('nav, [role="navigation"], header nav');
    await expect(navbar).toBeVisible();

    // Capturer la navigation
    await expect(navbar).toHaveScreenshot('navbar.png', {
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('should match contact form', async ({ page }) => {
    // Naviguer vers le formulaire de contact
    const contactSection = page.locator('#contact, form, [data-testid="contact-form"]').first();
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Capturer le formulaire
    await expect(contactSection).toHaveScreenshot('contact-form.png', {
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('should match footer', async ({ page }) => {
    // Faire défiler vers le bas
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Localiser le footer
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).toBeVisible();

    // Capturer le footer
    await expect(footer).toHaveScreenshot('footer.png', {
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('should match mobile viewport', async ({ page }) => {
    // Redimensionner pour mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Attendre que la mise en page mobile soit appliquée
    await page.waitForTimeout(1000);

    // Capturer la version mobile
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('should match tablet viewport', async ({ page }) => {
    // Redimensionner pour tablette
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Attendre que la mise en page tablette soit appliquée
    await page.waitForTimeout(1000);

    // Capturer la version tablette
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('should handle form states visually', async ({ page }) => {
    // Naviguer vers le formulaire
    const contactSection = page.locator('#contact, form, [data-testid="contact-form"]').first();
    await contactSection.scrollIntoViewIfNeeded();

    const nameInput = page.locator('input[name="name"], input[id="name"]');
    const emailInput = page.locator('input[name="email"], input[id="email"]');
    
    // État initial (vide)
    await expect(contactSection).toHaveScreenshot('form-empty.png', {
      animations: 'disabled',
      caret: 'hide'
    });

    // État avec focus
    await nameInput.focus();
    await expect(contactSection).toHaveScreenshot('form-focused.png', {
      animations: 'disabled',
      caret: 'hide'
    });

    // État avec données
    await nameInput.fill('Test User');
    await emailInput.fill('test@example.com');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('Message de test');
    
    await expect(contactSection).toHaveScreenshot('form-filled.png', {
      animations: 'disabled',
      caret: 'hide'
    });
  });

  test('should handle error states visually', async ({ page }) => {
    // Naviguer vers le formulaire
    const contactSection = page.locator('#contact, form, [data-testid="contact-form"]').first();
    await contactSection.scrollIntoViewIfNeeded();

    const emailInput = page.locator('input[name="email"], input[id="email"]');
    
    // Créer un état d'erreur avec email invalide
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    
    // Attendre l'affichage de l'erreur
    await page.waitForTimeout(500);

    // Capturer l'état d'erreur
    await expect(contactSection).toHaveScreenshot('form-error.png', {
      animations: 'disabled',
      caret: 'hide'
    });
  });
});