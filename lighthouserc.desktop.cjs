// lighthouserc.desktop.js - Configuration Desktop
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/#contact',
      ],
      numberOfRuns: 2,
      settings: {
        // Émulation desktop
        emulatedFormFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
        },
        throttling: {
          rttMs: 40,
          throughputKbps: 40960, // Plus rapide pour desktop
          cpuSlowdownMultiplier: 1,
        },
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
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