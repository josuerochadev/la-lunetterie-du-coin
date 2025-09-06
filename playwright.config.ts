// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E
 * Tests sur multiple navigateurs avec stratégie d'optimisation
 */
export default defineConfig({
  // Répertoire des tests E2E
  testDir: './e2e',
  
  // Configuration globale des tests
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter pour les résultats
  reporter: [
    ['html', { outputFolder: 'e2e-results' }],
    ['json', { outputFile: 'e2e-results/results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  // Configuration globale des tests
  use: {
    // URL de base pour tous les tests
    baseURL: 'http://localhost:5173',
    
    // Configuration des traces pour debug
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Configuration viewport et navigation
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Timeout des actions
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },


  // Projets de test (différents navigateurs)
  projects: [
    // Desktop Chrome
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Desktop Firefox  
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    // Desktop Safari
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile Chrome
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    // Mobile Safari
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Serveur Web pour les tests (démarre automatiquement)
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  
  // Dossiers à ignorer
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
  ],
  
  // Configuration des timeouts
  timeout: 30000,
  expect: {
    timeout: 10000,
    // Configuration des screenshots pour la régression visuelle
    toHaveScreenshot: {
      threshold: 0.2,
      animations: 'disabled',
      caret: 'hide',
    },
  },
});