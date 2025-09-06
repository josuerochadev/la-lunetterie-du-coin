// lighthouserc.js
module.exports = {
  ci: {
    // Configuration pour les builds locaux et CI
    collect: {
      // URLs à auditer
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/#contact',
      ],
      
      // Nombre d'audits par URL (moyenne pour plus de stabilité)
      numberOfRuns: 3,
      
      // Configuration Lighthouse
      settings: {
        // Émulation mobile par défaut
        emulatedFormFactor: 'mobile',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        
        // Catégories à auditer
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        
        // Skip PWA pour ce type de site
        skipAudits: ['installable-manifest', 'splash-screen', 'themed-omnibox'],
      },
    },
    
    // Configuration des assertions (seuils de qualité)
    assert: {
      assertions: {
        // Performance - Core Web Vitals (seuils plus souples pour éviter NaN)
        'categories:performance': ['warn', { minScore: 0.7 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        
        // Accessibilité
        'categories:accessibility': ['error', { minScore: 0.9 }],
        
        // SEO
        'categories:seo': ['error', { minScore: 0.85 }],
        
        // Best Practices
        'categories:best-practices': ['warn', { minScore: 0.8 }],
      },
    },
    
    // Téléchargement des résultats
    upload: {
      // Stockage local des résultats
      target: 'filesystem',
      outputDir: './lighthouse-results',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
    
    // Configuration du serveur (pour intégration CI)
    server: {
      command: 'npm run preview',
      port: 4173,
      timeout: 60000,
    },
  },
};