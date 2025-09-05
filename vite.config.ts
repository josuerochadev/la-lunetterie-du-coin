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
      ...(isProduction && import.meta.env.SENTRY_AUTH_TOKEN ? [sentryVitePlugin({
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
      rollupOptions: {
        output: {
          // Stratégie de chunking optimisée pour cache et performance
          manualChunks: {
            // Core React (rarement mis à jour)
            vendor: ['react', 'react-dom'],
            
            // Routing (change avec les features)
            router: ['react-router-dom'],
            
            // Animation (gros module séparé)
            motion: ['framer-motion', 'split-type'],
            
            // Forms (utilisé uniquement sur contact)
            forms: ['react-hook-form'],
            
            // Monitoring (production uniquement)
            sentry: ['@sentry/react'],
            
            // UI utilities (stable)
            utils: ['clsx', '@dr.pogodin/react-helmet', 'tailwind-merge'],
            
            // Icons (chargés à la demande)
            icons: ['lucide-react/dist/esm/icons/facebook', 'lucide-react/dist/esm/icons/instagram'],
          },
        },
      },
      // Réduire le seuil d'avertissement pour forcer le splitting
      chunkSizeWarningLimit: 300,
    },
  };
});