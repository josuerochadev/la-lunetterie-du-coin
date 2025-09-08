import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }) => {
  // Configuration simplifiée : le plugin Sentry se configurera automatiquement 
  // via les variables d'environnement en production
  const isProduction = mode === "production";

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
        },
      }),
      // Sentry plugin pour source maps (production seulement et si configuré)
      // eslint-disable-next-line no-undef
      ...(isProduction && process.env?.SENTRY_AUTH_TOKEN ? [sentryVitePlugin({
        telemetry: false,
        sourcemaps: {
          assets: ["./dist/**"],
        },
      })] : []),
    ].filter(Boolean),
    optimizeDeps: {
      include: [
        'lucide-react/dist/esm/icons/facebook',
        'lucide-react/dist/esm/icons/instagram',
      ],
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    build: {
      sourcemap: true, // Important pour Sentry
      target: 'es2020', // Support moderne pour bundles plus petits
      minify: 'esbuild', // Minification plus agressive
      rollupOptions: {
        output: {
          // Stratégie de chunking ultra-optimisée
          manualChunks(id) {
            // Sentry chunk séparé (chargé conditionnellement)
            if (id.includes('@sentry')) {
              return 'sentry';
            }
            
            // Core React (stable, cache long terme)
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            
            // Routing système  
            if (id.includes('react-router')) {
              return 'router';
            }
            
            // Animation (grosse librairie)
            if (id.includes('framer-motion') || id.includes('split-type')) {
              return 'motion';
            }
            
            // Forms (lazy-loaded sur page contact)
            if (id.includes('react-hook-form')) {
              return 'forms';
            }
            
            // Utilitaires légers (groupés)
            if (id.includes('clsx') || 
                id.includes('@dr.pogodin/react-helmet') || 
                id.includes('tailwind-merge')) {
              return 'utils';
            }
            
            // Icons Lucide (lazy-loaded)
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            
            // Node modules dans vendor par défaut
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          
          // Noms de fichiers avec hash pour cache busting
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // Externaliser les gros modules pour CDN (optionnel)
        external: [], // Pour l'instant, gardons tout bundlé
      },
      // Bundle size warnings plus strictes
      chunkSizeWarningLimit: 250,
    },
  };
});