// quality.config.js - Configuration centralisée pour le monitoring qualité
export default {
  // Seuils de qualité par catégorie
  thresholds: {
    // Tests unitaires et couverture
    coverage: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
      // Seuils spécifiques par dossier
      perDirectory: {
        'src/components': { statements: 85, functions: 90 },
        'src/lib': { statements: 95, functions: 95 },
        'src/hooks': { statements: 80, functions: 85 }
      }
    },
    
    // Performance Lighthouse
    lighthouse: {
      performance: 85,
      accessibility: 95,
      bestPractices: 90,
      seo: 90,
      // Seuils spécifiques par page
      perPage: {
        '/': { performance: 90 }, // Page d'accueil plus stricte
        '/contact': { performance: 85 }
      }
    },
    
    // Qualité du code
    code: {
      // ESLint
      maxWarnings: 0,
      maxErrors: 0,
      // Complexité cyclomatique
      maxComplexity: 10,
      // Taille des fichiers
      maxFileSize: 500, // lignes
      maxFunctionSize: 50 // lignes
    },
    
    // Tests E2E
    e2e: {
      minSuccessRate: 95, // % de réussite minimum
      maxExecutionTime: 300, // secondes
      flakiness: 5 // % maximum de tests instables
    },
    
    // Bundle et assets
    bundle: {
      maxSizeKb: 500,
      maxChunkSizeKb: 200,
      maxAssetSizeKb: 100
    },
    
    // Accessibilité
    accessibility: {
      // Niveaux WCAG
      wcagLevel: 'AA',
      minScore: 95,
      // Tests axe-core
      maxViolations: 0,
      maxIncompletes: 2
    }
  },
  
  // Configuration des rapports
  reporting: {
    // Formats de sortie
    formats: ['markdown', 'json', 'html'],
    
    // Destinations
    output: {
      file: 'quality-report.md',
      json: 'quality-report.json',
      html: 'quality-report.html'
    },
    
    // Templates des badges
    badges: {
      quality: 'https://img.shields.io/badge/Quality-{score}%25-{color}',
      coverage: 'https://img.shields.io/badge/Coverage-{score}%25-{color}',
      lighthouse: 'https://img.shields.io/badge/Lighthouse-{score}-{color}',
      tests: 'https://img.shields.io/badge/Tests-{passed}/{total}-{color}'
    },
    
    // Couleurs des badges selon le score
    colors: {
      excellent: 'brightgreen', // >= 90
      good: 'green',           // >= 80
      average: 'yellow',       // >= 70
      poor: 'orange',          // >= 60
      critical: 'red'          // < 60
    }
  },
  
  // Configuration des outils
  tools: {
    // Vitest
    vitest: {
      configFile: 'vitest.config.ts',
      coverageDir: 'coverage',
      reportsDir: 'test-results'
    },
    
    // Playwright
    playwright: {
      configFile: 'playwright.config.ts',
      resultsDir: 'e2e-results',
      screenshotsDir: 'test-results'
    },
    
    // Lighthouse CI
    lighthouse: {
      configFile: 'lighthouserc.js',
      desktopConfig: 'lighthouserc.desktop.js',
      resultsDir: 'lighthouse-results'
    },
    
    // ESLint
    eslint: {
      configFile: 'eslint.config.js',
      extensions: ['ts', 'tsx'],
      ignore: ['dist', 'node_modules', 'coverage']
    },
    
    // axe-core
    axe: {
      browser: 'firefox',
      headless: true,
      standards: ['wcag2a', 'wcag2aa', 'section508']
    }
  },
  
  // Configuration CI/CD
  ci: {
    // Conditions d'échec des builds
    failOn: {
      coverageBelow: 70,
      lighthouseBelow: 80,
      e2eFailures: true,
      lintErrors: true,
      a11yViolations: true
    },
    
    // Notifications
    notifications: {
      slack: {
        enabled: false,
        webhook: process.env.SLACK_WEBHOOK,
        channels: ['#dev-quality', '#alerts']
      },
      email: {
        enabled: false,
        recipients: ['dev@lunetterie.com']
      }
    },
    
    // Artifacts à conserver
    artifacts: {
      retention: {
        reports: 30,      // jours
        screenshots: 7,   // jours
        coverage: 30,     // jours
        lighthouse: 30    // jours
      }
    }
  },
  
  // Monitoring continu
  monitoring: {
    // Métriques à tracker
    metrics: [
      'code_coverage',
      'lighthouse_scores',
      'bundle_size',
      'test_execution_time',
      'build_success_rate',
      'deployment_frequency'
    ],
    
    // Alertes
    alerts: {
      coverageDrop: 5,     // % de baisse
      performanceDrop: 10, // points Lighthouse
      testFailures: 3,     // nombre d'échecs consécutifs
      bundleSizeIncrease: 20 // % d'augmentation
    },
    
    // Historique
    history: {
      retention: 90, // jours
      aggregation: 'daily'
    }
  },
  
  // Intégrations externes
  integrations: {
    // GitHub
    github: {
      enabled: true,
      commentPRs: true,
      createChecks: true,
      updateStatus: true
    },
    
    // Sentry (monitoring d'erreurs)
    sentry: {
      enabled: true,
      trackPerformance: true,
      trackCoverage: false
    },
    
    // SonarQube (analyse statique)
    sonar: {
      enabled: false,
      projectKey: 'la-lunetterie-du-coin',
      organization: 'lunetterie-org'
    }
  }
};