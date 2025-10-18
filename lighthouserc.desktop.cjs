// lighthouserc.desktop.cjs - Configuration Desktop Simplifiée
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/'],
      numberOfRuns: 1,
      settings: {
        // Configuration desktop simple et cohérente
        emulatedFormFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 40960,
          cpuSlowdownMultiplier: 1,
        },
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
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
    assert: {
      assertions: {
        // Seuils adaptés pour desktop (éviter NaN)
        'categories:performance': ['warn', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-results/desktop',
    },
  },
};