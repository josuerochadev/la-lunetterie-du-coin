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
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,ts,jsx,tsx}'
    ],
    
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
        'src/pages/**/*',      // Exclure les pages (UI/présentation)
        'src/sections/**/*',   // Exclure les sections (UI/présentation)
        'src/App.tsx'          // Exclure App.tsx (point d'entrée)
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 15,
          statements: 15
        }
      }
    },
    
    // Configuration des globals pour éviter d'importer describe, it, expect
    globals: true,
    
    // Reporter de tests
    reporters: ['verbose'],
    
    // Timeout des tests
    testTimeout: 10000,
    hookTimeout: 10000
  },
  
  // Alias pour les imports (comme dans vite.config.ts)
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});