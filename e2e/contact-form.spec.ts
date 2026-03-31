// e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Form - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer directement vers la page contact
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Scroll vers le formulaire (scope à #formulaire pour éviter strict mode)
    const formulaireSection = page.locator('#formulaire');
    const form = (await formulaireSection.count())
      ? formulaireSection.locator('form').first()
      : page.locator('form').first();
    await form.scrollIntoViewIfNeeded();
  });

  test('should display contact form', async ({ page }) => {
    // Vérifier la présence du formulaire
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Scope les inputs au premier formulaire visible pour éviter les doublons desktop/mobile
    const nameInput = form.locator('input[name="name"]');
    const emailInput = form.locator('input[name="email"]');
    const messageTextarea = form.locator('textarea[name="message"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const form = page.locator('form').first();
    const submitButton = form.locator('button[type="submit"]');

    // Le bouton devrait être désactivé sans consentement
    await expect(submitButton).toBeDisabled();

    // Cocher la checkbox RGPD pour activer le bouton
    const consentCheckbox = form.locator('input[name="consent"]');
    await consentCheckbox.check();

    // Maintenant le bouton est activé, on peut cliquer
    await submitButton.click();

    // Vérifier que la validation HTML5 empêche la soumission
    const nameInput = form.locator('input[name="name"]');
    const isNameInvalid = await nameInput.evaluate(
      (el) => !(el as HTMLInputElement).validity.valid,
    );

    if (isNameInvalid) {
      expect(isNameInvalid).toBe(true);
    } else {
      const errorMessages = page.locator('.form-error, .error, [role="alert"]');
      await expect(errorMessages.first()).toBeVisible({ timeout: 2000 });
    }
  });

  test('should show field-specific validation', async ({ page }) => {
    const form = page.locator('form').first();
    const emailInput = form.locator('input[name="email"]');

    // Saisir un email invalide
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Vérifier la validation d'email
    const isEmailValid = await emailInput.evaluate((el) => (el as HTMLInputElement).validity.valid);
    expect(isEmailValid).toBe(false);
  });

  test('should submit form successfully with valid data', async ({ page }) => {
    const form = page.locator('form').first();

    // Remplir le formulaire avec des données valides
    await form.locator('input[name="name"]').fill('Test User');
    await form.locator('input[name="email"]').fill('test@example.com');
    await form
      .locator('textarea[name="message"]')
      .fill(
        'Ceci est un message de test pour vérifier le fonctionnement du formulaire de contact.',
      );

    // Cocher la checkbox RGPD (obligatoire)
    await form.locator('input[name="consent"]').check();

    // Intercepter la requête Formspree
    await page.route('https://formspree.io/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    // Soumettre le formulaire
    const submitButton = form.locator('button[type="submit"]');
    await submitButton.click();

    // Vérifier le message de succès
    const successMessage = page.locator(
      ':has-text("succès"), :has-text("envoyé"), .form-message--success, .success',
    );

    await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    const form = page.locator('form').first();

    // Simuler une erreur réseau
    await page.route('https://formspree.io/**', async (route) => {
      await route.abort('failed');
    });

    // Remplir et soumettre le formulaire
    await form.locator('input[name="name"]').fill('Test User');
    await form.locator('input[name="email"]').fill('test@example.com');
    await form.locator('textarea[name="message"]').fill('Test message');
    await form.locator('input[name="consent"]').check();

    const submitButton = form.locator('button[type="submit"]');
    await submitButton.click();

    // Vérifier le message d'erreur
    const errorMessage = page.locator(
      ':has-text("erreur"), :has-text("problème"), .form-message--error, .error',
    );

    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle network failures with retry and eventually succeed', async ({ page }) => {
    const form = page.locator('form').first();
    let requestCount = 0;

    // Simuler des échecs puis succès pour tester le système de retry
    await page.route('https://formspree.io/**', async (route) => {
      requestCount++;

      if (requestCount < 3) {
        await route.abort('failed');
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
      }
    });

    // Remplir et soumettre le formulaire
    await form.locator('input[name="name"]').fill('Test User');
    await form.locator('input[name="email"]').fill('test@example.com');
    await form.locator('textarea[name="message"]').fill('Test message');
    await form.locator('input[name="consent"]').check();

    const submitButton = form.locator('button[type="submit"]');
    await submitButton.click();

    // Vérifier que le système de retry fonctionne et finit par afficher le succès
    const successMessage = page.locator(':has-text("succès"), :has-text("envoyé")');
    await expect(successMessage.first()).toBeVisible({ timeout: 20000 });

    // Vérifier qu'il y a eu exactement 3 requêtes (2 échecs + 1 succès)
    expect(requestCount).toBe(3);
  });

  test('should be accessible via keyboard', async ({ page }) => {
    const form = page.locator('form').first();

    // Intercepter la requête avant de commencer
    await page.route('https://formspree.io/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    // Navigation au clavier — scoped au premier formulaire
    const nameInput = form.locator('input[name="name"]');
    const emailInput = form.locator('input[name="email"]');
    const messageTextarea = form.locator('textarea[name="message"]');
    const consentCheckbox = form.locator('input[name="consent"]');
    const submitButton = form.locator('button[type="submit"]');

    // Tester que chaque champ peut recevoir le focus
    await nameInput.focus();
    await expect(nameInput).toBeFocused();

    await emailInput.focus();
    await expect(emailInput).toBeFocused();

    await messageTextarea.focus();
    await expect(messageTextarea).toBeFocused();

    // Tester la checkbox RGPD
    await consentCheckbox.focus();
    await expect(consentCheckbox).toBeFocused();

    // Cocher avec Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);

    // Vérifier que le bouton submit devient enabled et peut recevoir le focus
    await expect(submitButton).toBeEnabled({ timeout: 1000 });
    await submitButton.focus();
    await expect(submitButton).toBeFocused();

    // Remplir les champs requis puis soumettre
    await nameInput.fill('Test User');
    await emailInput.fill('test@example.com');
    await messageTextarea.fill('Test message');

    await submitButton.focus();
    await page.keyboard.press('Enter');

    // Vérifier que le formulaire a été soumis avec succès
    const successMessage = page.locator(
      ':has-text("succès"), :has-text("envoyé"), .form-message--success, .success',
    );
    await expect(successMessage.first()).toBeVisible({ timeout: 5000 });
  });
});
