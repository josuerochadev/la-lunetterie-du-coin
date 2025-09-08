# ADR-004: Stratégie de tests multicouche

**Date**: 2024-09-08  
**Statut**: Accepté  
**Décideurs**: Équipe de développement, QA Lead

## Contexte

Le projet nécessite une stratégie de tests robuste pour assurer la qualité, la maintenabilité et la confiance dans les déploiements.

### Objectifs qualité :
- Test coverage > 85%
- Tests automatisés dans CI/CD
- Détection précoce des régressions
- Tests de non-régression visuelle
- Accessibilité automatisée

## Options considérées

### Option A: Tests unitaires uniquement
**Avantages:**
- Rapide à implémenter
- Feedback instantané

**Inconvénients:**
- Pas de test d'intégration
- Manque de confiance

### Option B: Tests E2E uniquement
**Avantages:**
- Tests proche utilisateur final
- Détection bugs UI

**Inconvénients:**
- Lent et fragile
- Debug difficile

### Option C: Stratégie pyramidale
**Avantages:**
- Équilibre optimal
- Couverture complète
- Performance acceptable

## Décision

**Choix: Option C - Stratégie de test pyramidale**

### Architecture de test :

#### 1. **Tests Unitaires** (Vitest + Testing Library)
```typescript
// 70% de la couverture - Tests rapides et isolés
describe('Button component', () => {
  it('should render with correct classes', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-primary')
  })
})
```

#### 2. **Tests d'Intégration** (Vitest + MSW)
```typescript
// 20% de la couverture - Tests interactions composants
describe('ContactForm integration', () => {
  it('should submit form and show success message', async () => {
    // Test avec mock API
  })
})
```

#### 3. **Tests E2E** (Playwright)
```typescript
// 10% de la couverture - Parcours critiques utilisateur
test('should complete contact flow', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Contact')
  // Test parcours complet
})
```

#### 4. **Tests Spécialisés**
- **Accessibilité**: axe-core automatisé
- **Performance**: Lighthouse CI
- **Visuel**: Playwright visual comparisons

### Stack technique :
- **Unit**: Vitest + @testing-library/react
- **E2E**: Playwright (Chrome, Firefox, Safari)
- **A11y**: @axe-core/playwright
- **Coverage**: v8 (natif Vitest)
- **CI**: GitHub Actions matrix

## Conséquences

### Positives ✅
- **Couverture**: 95.49% de code coverage atteint
- **Confiance**: Déploiements sereins avec 51 tests
- **Performance**: Tests unitaires < 3s, E2E < 2min
- **Qualité**: 0 violations accessibilité détectées
- **Maintenabilité**: Tests lisibles et maintenables

### Négatives ⚠️
- Setup initial complexe (4 types de tests)
- Temps CI augmenté (~8min total)
- Maintenance des tests E2E

### Métriques de succès
- **Coverage**: Maintenir > 85% statements
- **Flakiness**: < 2% de tests flaky E2E
- **Vitesse**: Tests unitaires < 5s
- **CI**: Pipeline complète < 10min

### Évolution prévue
- Tests de charge avec k6
- Tests de sécurité OWASP
- Tests d'intégration API réelles