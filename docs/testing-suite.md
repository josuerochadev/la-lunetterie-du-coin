# 🧪 Suite de Tests Complète - La Lunetterie du Coin

Documentation complète de la stratégie de tests et qualité mise en place pour garantir la fiabilité, les performances et l'accessibilité du site.

## Vue d'ensemble

Notre suite de tests suit la pyramide des tests avec une approche multicouche :

```
           🎭 Tests E2E
          ├─ Playwright Multi-browser
          ├─ Tests visuels (régression)
          └─ Tests d'intégration

         🧪 Tests d'Intégration
        ├─ Components + Hooks
        ├─ API + Services
        └─ User Interactions

      🔬 Tests Unitaires (Base)
     ├─ Fonctions utilitaires
     ├─ Logique métier
     └─ Composants isolés
```

## Architecture de Tests

### 1. Tests Unitaires (Vitest + Testing Library)

- **Framework** : Vitest avec jsdom
- **Coverage** : Istanbul avec seuils configurés
- **Localisation** : `src/**/*.test.{ts,tsx}`

#### Scripts disponibles

```bash
pnpm run test            # Tests en mode watch
pnpm run test:run        # Tests une seule fois
pnpm run test:coverage   # Tests avec coverage
pnpm run test:ui         # Interface graphique Vitest
```

#### Configuration actuelle

- **632+ tests** répartis sur les utilitaires et composants
- **Quality gate CI/CD** : ≥ 10% de couverture (seuil bloquant, voir `CLAUDE.md`)
- **Objectif aspirationnel** : > 85% statements (voir `ADR-004`)
- **Mock** : fetch, IntersectionObserver, navigator APIs

### 2. Tests End-to-End (Playwright)

- **Multi-browser** : Chromium, Firefox, WebKit
- **Multi-device** : Desktop, Mobile, Tablet
- **Localisation** : `e2e/*.spec.ts`

#### Scripts disponibles

```bash
pnpm run e2e             # Tous les tests E2E
pnpm run e2e:headed      # Mode avec interface graphique
pnpm run e2e:ui          # Interface de debugging Playwright
pnpm run e2e:report      # Ouvrir le rapport HTML
```

#### Tests implémentés

- **Homepage** : Navigation, responsive, performance
- **Contact Form** : Validation, soumission, retry logic
- **Accessibilité** : Navigation clavier, screen readers

### 3. Tests de Régression Visuelle (prévu)

> **Note :** Les tests de régression visuelle ne sont pas encore implémentés.
> Le fichier `e2e/visual-regression.spec.ts` et le workflow `visual-regression.yml` sont planifiés mais pas encore créés.

- **Framework prévu** : Playwright Screenshots
- **Configuration prévue** : Seuil de tolérance 20%

### 4. Tests de Performance (Lighthouse CI)

- **Audit mobile et desktop** séparés
- **Métriques Core Web Vitals**
- **Seuils stricts** : Performance 85%+, A11y 95%+

#### Configuration

- **Mobile** : `lighthouserc.js` (émulation mobile)
- **Desktop** : `lighthouserc.desktop.js` (seuils plus stricts)

#### Scripts

```bash
pnpm run lighthouse              # Audit mobile
pnpm run lighthouse:desktop      # Audit desktop (seuils stricts)
```

### 5. Tests d'Accessibilité (axe-core)

- **Framework** : axe-core CLI avec Firefox
- **Standards** : WCAG 2.1 AA + Section 508
- **Integration** : Pipeline CI + tests Playwright

#### Script

```bash
pnpm run a11y                    # Tests d'accessibilité complets
```

## Pipeline CI/CD

### Workflows GitHub Actions

#### 1. Quality Pipeline (`quality-pipeline.yml`)

Pipeline principal intégrant tous les aspects qualité :

**Jobs parallélisés :**

- 🔍 **Lint & Format** : ESLint + Prettier
- 🧪 **Unit Tests** : Vitest + Coverage
- 🏗️ **Build** : Validation de build production
- 🚨 **Lighthouse CI** : Audits mobile + desktop
- 🎭 **E2E Tests** : Multi-browser testing
- ♿ **A11y Tests** : Validation WCAG
- 📊 **Quality Report** : Rapport global généré

**Déclencheurs :**

- Push sur `dev` et `main`
- Pull requests
- Workflow manual

#### 2. Visual Regression (`visual-regression.yml`) — prévu

> **Note :** Ce workflow n'est pas encore implémenté.

**Fonctionnalités prévues :**

- Tests sur Chromium uniquement (performance)
- Upload automatique des diff screenshots
- Commentaires PR avec détails des changements
- Artifacts conservés 30 jours

### Gestion des Échecs

#### Tests unitaires

- **Échec** si coverage < 10% (quality gate) ou tests en erreur
- **Artifacts** : rapports de coverage HTML + XML

#### Tests E2E

- **Retry automatique** : 2 tentatives en CI
- **Artifacts** : traces, videos, screenshots
- **Parallélisation** : 1 worker en CI, illimité en local

#### Tests visuels (prévu)

- **Commentaire PR** automatique avec nombre de différences
- **Screenshots diff** uploadés comme artifacts
- **Instructions** de résolution incluses

#### Lighthouse

- **Échec** si scores sous les seuils
- **Commentaire PR** avec tableau des scores
- **Historique** des audits conservé

## Métriques de Qualité

### Dashboard automatisé

Le script `pnpm run quality:report` génère un rapport complet :

#### Métriques trackées

- **Coverage** : Statements, branches, functions, lines
- **Performance** : Lighthouse scores (4 catégories)
- **Tests E2E** : Taux de réussite, temps d'exécution
- **Bundle** : Taille, chunks, assets
- **Accessibilité** : Violations axe, score WCAG

#### Score global

Algorithme combinant tous les aspects avec pondération :

- Tests unitaires : 30%
- Performance : 25%
- Tests E2E : 20%
- Accessibilité : 15%
- Qualité code : 10%

#### Badges automatiques

- ![Quality](https://img.shields.io/badge/Quality-XX%25-color)
- ![Coverage](https://img.shields.io/badge/Coverage-XX%25-color)
- ![Lighthouse](https://img.shields.io/badge/Lighthouse-XX-color)
- ![Tests](https://img.shields.io/badge/Tests-XX/XX-color)

### Configuration des seuils

Fichier `quality.config.js` centralisé :

```javascript
export default {
  thresholds: {
    coverage: { statements: 80, branches: 70 },
    lighthouse: { performance: 85, accessibility: 95 },
    e2e: { minSuccessRate: 95, maxExecutionTime: 300 },
  },
};
```

## Bonnes Pratiques

### Écriture de Tests

#### Tests unitaires

```typescript
// ✅ Bon : test isolé, descriptif
test('should merge classes correctly', () => {
  expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
});

// ❌ Éviter : test trop large
test('should work', () => {
  /* ... */
});
```

#### Tests E2E

```typescript
// ✅ Bon : sélecteurs stables
await page.locator('[data-testid="submit-button"]').click();

// ❌ Éviter : sélecteurs fragiles
await page.locator('button:nth-child(3)').click();
```

#### Tests visuels

```typescript
// ✅ Bon : désactiver animations
await page.addStyleTag({
  content: '*, *::before, *::after { animation-duration: 0s !important; }',
});

// ✅ Bon : attendre stabilité
await page.waitForLoadState('networkidle');
```

### Maintenance

#### Fréquence recommandée

- **Daily** : Surveillance des métriques
- **Weekly** : Révision des tests flaky
- **Monthly** : Nettoyage des screenshots, mise à jour seuils
- **Quarterly** : Audit complet de la stratégie

#### Surveillance continue

```bash
# Vérification rapide avant commit
pnpm run quality:check

# Rapport complet
pnpm run quality:report

# Tests visuels après changements UI
pnpm run e2e:visual:update
```

## Dépannage

### Problèmes courants

#### Tests flaky

1. **Identifier** : `pnpm run e2e --repeat-each=5`
2. **Analyser** : traces et videos dans `e2e-results/`
3. **Corriger** : améliorer les attentes, timeouts

#### Coverage insuffisant

1. **Analyser** : ouvrir `coverage/lcov-report/index.html`
2. **Prioriser** : fonctions critiques non couvertes
3. **Ajouter** : tests pour les cas limites

#### Screenshots différents

1. **Comparer** : fichiers `*-diff.png` dans artifacts
2. **Valider** : changements intentionnels ?
3. **Mettre à jour** : `pnpm run e2e:visual:update`

#### Performance dégradée

1. **Analyser** : rapport Lighthouse détaillé
2. **Identifier** : métriques régressées
3. **Optimiser** : bundle size, images, code

### Support

#### Documentation

- [Vitest](https://vitest.dev/) - Tests unitaires
- [Playwright](https://playwright.dev/) - Tests E2E
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Performance
- [axe-core](https://github.com/dequelabs/axe-core) - Accessibilité

#### Debug local

```bash
# Tests unitaires avec UI
pnpm run test:ui

# Tests E2E avec interface
pnpm run e2e:ui

# Coverage avec rapport HTML
pnpm run test:coverage && open coverage/lcov-report/index.html

# Lighthouse local
pnpm run lighthouse
```

---

## Statistiques Actuelles

- ✅ **632+ tests** (606 passed, 26 skipped)
- ✅ **Tests E2E multi-browser** (Chrome, Firefox, Safari)
- ⏳ **Tests de régression visuelle** (prévu)
- ✅ **Audits Lighthouse** (mobile + desktop)
- ✅ **Tests d'accessibilité** (axe-core)
- ✅ **Pipeline CI/CD** complet
- ✅ **Rapports de qualité** automatisés

**Score de qualité cible : 90+/100**
