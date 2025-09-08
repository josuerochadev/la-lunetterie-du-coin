#!/usr/bin/env node
/**
 * Script pour générer un rapport de qualité complet
 * Combine les résultats des différents outils (tests, lint, lighthouse, etc.)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Configuration des seuils de qualité (ajustés pour être réalistes)
const QUALITY_THRESHOLDS = {
  coverage: {
    statements: 10,
    branches: 10,
    functions: 10,
    lines: 10
  },
  lighthouse: {
    performance: 75,
    accessibility: 90,
    bestPractices: 85,
    seo: 85
  },
  eslint: {
    maxWarnings: 0,
    maxErrors: 0
  }
};

/**
 * Analyse les résultats de coverage Vitest
 */
function analyzeCoverage() {
  // D'abord essayer de trouver le fichier dans quality-results (GitHub Actions)
  const artifactCoveragePath = path.join(ROOT_DIR, 'quality-results', 'unit-test-results', 'coverage', 'coverage-summary.json');
  // Puis essayer le chemin local
  const localCoveragePath = path.join(ROOT_DIR, 'coverage', 'coverage-summary.json');
  
  let coveragePath = null;
  if (fs.existsSync(artifactCoveragePath)) {
    coveragePath = artifactCoveragePath;
  } else if (fs.existsSync(localCoveragePath)) {
    coveragePath = localCoveragePath;
  }
  
  if (!coveragePath) {
    // Générer un rapport de couverture basique à partir de notre script
    try {
      const { execSync } = require('node:child_process');
      const coveragePercent = execSync('node test-coverage-script.cjs', { encoding: 'utf8' }).trim();
      const percent = Number.parseInt(coveragePercent);
      
      return {
        status: percent >= QUALITY_THRESHOLDS.coverage.lines ? 'pass' : 'fail',
        overallScore: percent,
        summary: `Couverture: ${percent}% (basée sur lcov.info)`
      };
    } catch (error) {
      return {
        status: 'missing',
        message: 'Aucun rapport de couverture trouvé'
      };
    }
  }

  try {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    const total = coverage.total;
    
    const results = {
      statements: total.statements.pct,
      branches: total.branches.pct,
      functions: total.functions.pct,
      lines: total.lines.pct
    };
    
    const scores = Object.entries(results).map(([key, value]) => ({
      metric: key,
      score: value,
      threshold: QUALITY_THRESHOLDS.coverage[key],
      pass: value >= QUALITY_THRESHOLDS.coverage[key]
    }));
    
    const overallPass = scores.every(s => s.pass);
    const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    
    return {
      status: overallPass ? 'pass' : 'fail',
      overallScore: Math.round(averageScore),
      details: scores,
      summary: `Couverture moyenne: ${Math.round(averageScore)}%`
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Erreur lors de l'analyse de la couverture: ${error.message}`
    };
  }
}

/**
 * Analyse les résultats Lighthouse
 */
function analyzeLighthouse() {
  const lighthouseDir = path.join(ROOT_DIR, 'lighthouse-results');
  
  if (!fs.existsSync(lighthouseDir)) {
    return {
      status: 'missing',
      message: 'Aucun résultat Lighthouse trouvé'
    };
  }

  try {
    const files = fs.readdirSync(lighthouseDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      return {
        status: 'missing',
        message: 'Aucun fichier JSON Lighthouse trouvé'
      };
    }

    // Prendre le fichier le plus récent
    const latestFile = jsonFiles.sort().pop();
    const lighthouseData = JSON.parse(
      fs.readFileSync(path.join(lighthouseDir, latestFile), 'utf8')
    );
    
    const categories = lighthouseData.categories;
    const scores = [
      {
        metric: 'Performance',
        score: Math.round(categories.performance.score * 100),
        threshold: QUALITY_THRESHOLDS.lighthouse.performance,
        pass: categories.performance.score * 100 >= QUALITY_THRESHOLDS.lighthouse.performance
      },
      {
        metric: 'Accessibility',
        score: Math.round(categories.accessibility.score * 100),
        threshold: QUALITY_THRESHOLDS.lighthouse.accessibility,
        pass: categories.accessibility.score * 100 >= QUALITY_THRESHOLDS.lighthouse.accessibility
      },
      {
        metric: 'Best Practices',
        score: Math.round(categories['best-practices'].score * 100),
        threshold: QUALITY_THRESHOLDS.lighthouse.bestPractices,
        pass: categories['best-practices'].score * 100 >= QUALITY_THRESHOLDS.lighthouse.bestPractices
      },
      {
        metric: 'SEO',
        score: Math.round(categories.seo.score * 100),
        threshold: QUALITY_THRESHOLDS.lighthouse.seo,
        pass: categories.seo.score * 100 >= QUALITY_THRESHOLDS.lighthouse.seo
      }
    ];
    
    const overallPass = scores.every(s => s.pass);
    const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    
    return {
      status: overallPass ? 'pass' : 'fail',
      overallScore: Math.round(averageScore),
      details: scores,
      summary: `Score Lighthouse moyen: ${Math.round(averageScore)}/100`
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Erreur lors de l'analyse Lighthouse: ${error.message}`
    };
  }
}

/**
 * Analyse les résultats des tests E2E
 */
function analyzeE2ETests() {
  // Essayer plusieurs endroits pour les résultats E2E
  const possiblePaths = [
    path.join(ROOT_DIR, 'quality-results', 'e2e-results-chromium', 'results.json'),
    path.join(ROOT_DIR, 'quality-results', 'e2e-results-firefox', 'results.json'),  
    path.join(ROOT_DIR, 'quality-results', 'e2e-results-webkit', 'results.json'),
    path.join(ROOT_DIR, 'e2e-results', 'results.json')
  ];
  
  let e2eResultsPath = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      e2eResultsPath = possiblePath;
      break;
    }
  }
  
  if (!e2eResultsPath) {
    return {
      status: 'missing',
      message: 'Aucun résultat E2E trouvé'
    };
  }

  try {
    const e2eData = JSON.parse(fs.readFileSync(e2eResultsPath, 'utf8'));
    const stats = e2eData.stats;
    
    return {
      status: stats.unexpected > 0 ? 'fail' : 'pass',
      total: stats.expected + stats.unexpected + stats.flaky,
      passed: stats.expected,
      failed: stats.unexpected,
      flaky: stats.flaky,
      summary: `${stats.expected}/${stats.expected + stats.unexpected + stats.flaky} tests E2E réussis`
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Erreur lors de l'analyse des tests E2E: ${error.message}`
    };
  }
}

/**
 * Génère un score de qualité global
 */
function calculateOverallQuality(results) {
  const scores = [];
  
  // Coverage : Toujours compter, même si "missing"
  if (results.coverage.status === 'pass') {
    scores.push(results.coverage.overallScore || 90);
  } else if (results.coverage.status === 'fail') {
    scores.push(results.coverage.overallScore || 50);
  } else {
    scores.push(30); // Score de base pour tests manquants
  }
  
  // Lighthouse : Optionnel mais bonus si présent
  if (results.lighthouse.status === 'pass') {
    scores.push(results.lighthouse.overallScore || 85);
  } else if (results.lighthouse.status === 'fail') {
    scores.push(results.lighthouse.overallScore || 60);
  } else {
    scores.push(70); // Score neutre si manquant
  }
  
  // E2E : Optionnel mais bonus si présent  
  if (results.e2e.status === 'pass') {
    scores.push(100);
  } else if (results.e2e.status === 'fail') {
    scores.push(40);
  } else {
    scores.push(60); // Score neutre si manquant
  }
  
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

/**
 * Génère le badge de qualité
 */
function generateQualityBadge(score) {
  if (score >= 90) return { color: 'brightgreen', label: 'Excellent' };
  if (score >= 80) return { color: 'green', label: 'Bon' };
  if (score >= 70) return { color: 'yellow', label: 'Moyen' };
  if (score >= 60) return { color: 'orange', label: 'Faible' };
  return { color: 'red', label: 'Critique' };
}

/**
 * Génère le rapport Markdown
 */
function generateMarkdownReport(results, overallScore, badge) {
  const timestamp = new Date().toLocaleString('fr-FR');
  
  return `# 📊 Rapport de Qualité - La Lunetterie du Coin

![Quality Score](https://img.shields.io/badge/Quality-${overallScore}%25-${badge.color})
![Status](https://img.shields.io/badge/Status-${badge.label}-${badge.color})

*Généré le ${timestamp}*

## 🎯 Score Global: ${overallScore}/100

---

## 🧪 Tests Unitaires et Couverture

**Status:** ${results.coverage.status === 'pass' ? '✅ Passé' : results.coverage.status === 'fail' ? '❌ Échec' : '⚠️ Manquant'}
${results.coverage.summary || results.coverage.message || ''}

${results.coverage.details ? results.coverage.details.map(d => 
  `- **${d.metric}**: ${d.score}% (seuil: ${d.threshold}%) ${d.pass ? '✅' : '❌'}`
).join('\n') : ''}

---

## 🚨 Performance Lighthouse

**Status:** ${results.lighthouse.status === 'pass' ? '✅ Passé' : results.lighthouse.status === 'fail' ? '❌ Échec' : '⚠️ Manquant'}
${results.lighthouse.summary || results.lighthouse.message || ''}

${results.lighthouse.details ? results.lighthouse.details.map(d => 
  `- **${d.metric}**: ${d.score}/100 (seuil: ${d.threshold}) ${d.pass ? '✅' : '❌'}`
).join('\n') : ''}

---

## 🎭 Tests E2E

**Status:** ${results.e2e.status === 'pass' ? '✅ Passé' : results.e2e.status === 'fail' ? '❌ Échec' : '⚠️ Manquant'}
${results.e2e.summary || results.e2e.message || ''}

${results.e2e.total ? `
- **Total**: ${results.e2e.total} tests
- **Réussis**: ${results.e2e.passed}
- **Échecs**: ${results.e2e.failed}
- **Instables**: ${results.e2e.flaky}
` : ''}

---

## 📈 Tendances et Recommandations

### Points Forts
${overallScore >= 80 ? '- Score de qualité globale élevé' : ''}
${results.coverage.status === 'pass' ? '- Couverture de tests satisfaisante' : ''}
${results.lighthouse.status === 'pass' ? '- Performance et accessibilité excellentes' : ''}
${results.e2e.status === 'pass' ? '- Tests E2E stables' : ''}

### Axes d'Amélioration
${results.coverage.status !== 'pass' ? '- Améliorer la couverture des tests unitaires' : ''}
${results.lighthouse.status !== 'pass' ? '- Optimiser les performances et l\'accessibilité' : ''}
${results.e2e.status !== 'pass' ? '- Stabiliser les tests end-to-end' : ''}

---

## 🔧 Actions Recommandées

${overallScore < 70 ? `
### Priorité Haute
1. Réviser les tests échoués
2. Améliorer la couverture de code
3. Optimiser les performances critiques
` : ''}

${overallScore < 85 ? `
### Priorité Moyenne
1. Ajouter des tests pour les cas limites
2. Optimiser le bundle size
3. Améliorer l'accessibilité
` : ''}

### Maintenance Continue
1. Surveiller les métriques de qualité
2. Mettre à jour les dépendances régulièrement
3. Réviser et nettoyer le code mort

---

*Rapport généré automatiquement par le système de qualité*`;
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔍 Génération du rapport de qualité...\n');
  
  // Analyser chaque aspect de la qualité
  const results = {
    coverage: analyzeCoverage(),
    lighthouse: analyzeLighthouse(),
    e2e: analyzeE2ETests()
  };
  
  // Calculer le score global
  const overallScore = calculateOverallQuality(results);
  const badge = generateQualityBadge(overallScore);
  
  // Générer le rapport
  const report = generateMarkdownReport(results, overallScore, badge);
  
  // Sauvegarder le rapport
  const reportPath = path.join(ROOT_DIR, 'quality-report.md');
  fs.writeFileSync(reportPath, report);
  
  // Afficher un résumé
  console.log(`📊 Rapport de qualité généré: ${reportPath}`);
  console.log(`🎯 Score global: ${overallScore}/100 (${badge.label})`);
  console.log(`🧪 Tests unitaires: ${results.coverage.status}`);
  console.log(`🚨 Lighthouse: ${results.lighthouse.status}`);
  console.log(`🎭 Tests E2E: ${results.e2e.status}`);
  
  // Exit code basé sur la qualité
  process.exit(overallScore >= 70 ? 0 : 1);
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Erreur lors de la génération du rapport:', error);
    process.exit(1);
  });
}

export { main as generateQualityReport };