// lighthouserc.desktop.cjs - Configuration Desktop Simplifiée
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/#contact',
      ],
      numberOfRuns: 2,
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