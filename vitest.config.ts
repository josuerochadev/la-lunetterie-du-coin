/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Utilise jsdom comme environnement pour tester les composants React
    environment: 'jsdom',

    // Fichiers de setup global
    setupFiles: ['./src/test/setup.ts'],

    // Pattern des fichiers de test
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}', 'src/**/__tests__/**/*.{js,ts,jsx,tsx}'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.cjs',
        'e2e/',
        'coverage/',
        '*.config.ts',
        'src/pages/**/*', // Exclure les pages (UI/présentation)
        'src/sections/**/*', // Exclure les sections (UI/présentation)
        'src/App.tsx', // Exclure App.tsx (point d'entrée)
        'src/styles/**/*', // Exclure les fichiers CSS (pas de logique)
        'src/types/**/*', // Exclure les types (déclarations uniquement)
        'src/data/**/*', // Exclure les données statiques
        'src/assets/**/*', // Exclure les assets (fonts, SVGs, images)
        'src/config/footer.ts', // Données de config statiques
        'src/config/menu.ts', // Données de config statiques
        'src/config/store.ts', // Données de config statiques
        'src/lib/env.ts', // import.meta.env résolu au compile-time, non testable
        'src/components/navbar/**/*', // Composants présentationnels (testés en E2E)
        'src/components/offers/**/*', // Composants présentationnels (testés en E2E)
        'src/components/services/**/*', // Composants présentationnels (testés en E2E)
        'src/components/routing/**/*', // Scroll behavior (testé en E2E)
        'src/components/footer/**/*', // Composants présentationnels (testés en E2E)
        'src/components/debug/**/*', // Outils de debug (supprimé)
        'src/components/motion/**/*', // Wrappers framer-motion (testés visuellement)
        'src/components/legal/HighlightBox.tsx', // Présentationnel
        'src/components/legal/PageHeader.tsx', // Présentationnel
        'src/hooks/useFadeInOut.ts', // Wrapper framer-motion useTransform
        'src/hooks/usePointerEvents.ts', // Wrapper framer-motion useTransform
        'src/hooks/useScrollAnimation.ts', // Wrapper framer-motion useScroll
        'src/hooks/useScrollEntrance.ts', // Wrapper framer-motion useTransform
        '**/*.md', // Fichiers markdown
        '**/.DS_Store', // Fichiers système macOS
      ],
      thresholds: {
        global: {
          branches: 55,
          functions: 65,
          lines: 65,
          statements: 65,
        },
      },
    },

    // Configuration des globals pour éviter d'importer describe, it, expect
    globals: true,

    // Reporter de tests
    reporters: ['verbose'],

    // Timeout des tests
    testTimeout: 10000,
    hookTimeout: 10000,
  },

  // Alias pour les imports (comme dans vite.config.ts)
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
