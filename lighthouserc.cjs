// lighthouserc.js
module.exports = {
  ci: {
    // Configuration pour les builds locaux et CI
    collect: {
      // URLs à auditer
      url: ['http://localhost:4173/'],

      // Nombre d'audits par URL (réduit pour CI)
      numberOfRuns: 1,
      
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

        // Configuration Chrome pour CI/CD headless
        chromeFlags: [
          '--headless=new',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--window-size=1920,1080',
        ],

        // Timeouts plus longs pour CI
        maxWaitForLoad: 90000,
        maxWaitForFcp: 45000,
        pauseAfterFcpMs: 2000,
        pauseAfterLoadMs: 2000,

        // Attendre que le réseau soit inactif (important pour SPA)
        waitForNetworkIdle: true,
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
  },
};