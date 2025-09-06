// e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Form - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Naviguer vers la section contact
    const contactLink = page.locator('a[href*="contact"], a:has-text("Contact")').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
    } else {
      // Scroll vers le formulaire si pas de navigation
      await page.locator('#contact, form, [data-testid="contact-form"]').first().scrollIntoViewIfNeeded();
    }
  });

  test('should display contact form', async ({ page }) => {
    // Vérifier la présence du formulaire
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Vérifier la présence des champs obligatoires
    const nameInput = page.locator('input[name="name"], input[id="name"]');
    const emailInput = page.locator('input[name="email"], input[id="email"]');
    const messageTextarea = page.locator('textarea[name="message"], textarea[id="message"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();

    // Vérifier les labels
    await expect(page.locator('label[for="name"], label:has-text("Nom")')).toBeVisible();
    await expect(page.locator('label[for="email"], label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label[for="message"], label:has-text("Message")')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    
    // Essayer de soumettre le formulaire vide
    await submitButton.click();

    // Vérifier que la validation HTML5 empêche la soumission
    const nameInput = page.locator('input[name="name"], input[id="name"]');
    const isNameInvalid = await nameInput.evaluate(el => !(el as HTMLInputElement).validity.valid);
    
    if (isNameInvalid) {
      // Le navigateur empêche la soumission
      expect(isNameInvalid).toBe(true);
    } else {
      // Sinon, vérifier les messages d'erreur custom
      const errorMessages = page.locator('.form-error, .error, [role="alert"]');
      await expect(errorMessages.first()).toBeVisible({ timeout: 2000 });
    }
  });

  test('should show field-specific validation', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[id="email"]');
    
    // Saisir un email invalide
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Vérifier la validation d'email
    const isEmailValid = await emailInput.evaluate(el => (el as HTMLInputElement).validity.valid);
    expect(isEmailValid).toBe(false);
  });

  test('should submit form successfully with valid data', async ({ page }) => {
    // Remplir le formulaire avec des données valides
    await page.locator('input[name="name"], input[id="name"]').fill('Test User');
    await page.locator('input[name="email"], input[id="email"]').fill('test@example.com');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('Ceci est un message de test pour vérifier le fonctionnement du formulaire de contact.');

    // Intercepter la requête Formspree
    page.route('https://formspree.io/**', async route => {
      // Mock une réponse positive
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true })
      });
    });

    // Soumettre le formulaire
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    await submitButton.click();

    // Vérifier le message de succès
    const successMessage = page.locator(
      ':has-text("succès"), :has-text("envoyé"), .form-message--success, .success'
    );
    
    await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simuler une erreur réseau
    page.route('https://formspree.io/**', async route => {
      await route.abort('failed');
    });

    // Remplir et soumettre le formulaire
    await page.locator('input[name="name"], input[id="name"]').fill('Test User');
    await page.locator('input[name="email"], input[id="email"]').fill('test@example.com');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('Test message');

    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    await submitButton.click();

    // Vérifier le message d'erreur
    const errorMessage = page.locator(
      ':has-text("erreur"), :has-text("problème"), .form-message--error, .error'
    );
    
    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show retry information during network issues', async ({ page }) => {
    let requestCount = 0;
    
    // Simuler des échecs puis succès
    page.route('https://formspree.io/**', async route => {
      requestCount++;
      
      if (requestCount < 3) {
        // Les 2 premières tentatives échouent
        await route.abort('failed');
      } else {
        // La 3ème tentative réussit
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      }
    });

    // Remplir et soumettre le formulaire
    await page.locator('input[name="name"], input[id="name"]').fill('Test User');
    await page.locator('input[name="email"], input[id="email"]').fill('test@example.com');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('Test message');

    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    await submitButton.click();

    // Vérifier l'affichage des tentatives de retry
    const retryMessage = page.locator(':has-text("Tentative"), :has-text("retry"), :has-text("essai")');
    await expect(retryMessage.first()).toBeVisible({ timeout: 5000 });

    // Finalement, vérifier le succès
    const successMessage = page.locator(':has-text("succès"), :has-text("envoyé")');
    await expect(successMessage.first()).toBeVisible({ timeout: 15000 });
  });

  test('should be accessible via keyboard', async ({ page }) => {
    // Navigation au clavier
    const nameInput = page.locator('input[name="name"], input[id="name"]');
    
    await nameInput.focus();
    await expect(nameInput).toBeFocused();

    // Tab vers les champs suivants
    await page.keyboard.press('Tab');
    const emailInput = page.locator('input[name="email"], input[id="email"]');
    await expect(emailInput).toBeFocused();

    await page.keyboard.press('Tab');
    const messageTextarea = page.locator('textarea[name="message"], textarea[id="message"]');
    await expect(messageTextarea).toBeFocused();

    await page.keyboard.press('Tab');
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    await expect(submitButton).toBeFocused();

    // Vérifier que Enter soumet le formulaire
    await nameInput.focus();
    await nameInput.fill('Test');
    await emailInput.fill('test@example.com');
    await messageTextarea.fill('Test message');
    
    await submitButton.focus();
    await page.keyboard.press('Enter');

    // Le formulaire devrait tenter la soumission
    await expect(page.locator(':has-text("envoi"), :has-text("Envoi en cours")')).toBeVisible({ timeout: 2000 });
  });
});