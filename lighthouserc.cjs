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
        // Performance - Core Web Vitals
        'categories:performance': ['error', { minScore: 0.85 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // Accessibilité
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': 'error',
        'heading-order': 'error',
        'label': 'error',
        
        // SEO
        'categories:seo': ['error', { minScore: 0.90 }],
        'meta-description': 'error',
        'document-title': 'error',
        
        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'uses-https': 'error',
        'uses-responsive-images': 'warn',
        
        // Spécifiques aux images
        'modern-image-formats': 'warn',
        'efficient-animated-content': 'warn',
        'unused-css-rules': 'warn',
        
        // Network
        'uses-text-compression': 'warn',
        'render-blocking-resources': 'warn',
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