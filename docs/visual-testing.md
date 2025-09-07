# 📸 Tests de Régression Visuelle

Ce document explique comment utiliser les tests de régression visuelle dans le projet La Lunetterie du Coin.

## Qu'est-ce que la régression visuelle ?

Les tests de régression visuelle permettent de détecter automatiquement les changements d'apparence de votre interface utilisateur en comparant des captures d'écran avant et après modification.

## Configuration

### Scripts disponibles

```bash
# Exécuter les tests visuels
npm run e2e:visual

# Mettre à jour les screenshots de référence (après changements intentionnels)
npm run e2e:visual:update

# Tests E2E complets (incluant les visuels)
npm run e2e
```

### Fichiers de test

- `e2e/visual-regression.spec.ts` - Tests de régression visuelle principaux
- `test-results/` - Dossier généré avec les résultats et différences

## Tests implémentés

### 1. Tests de pages complètes
- **Homepage complète** : Capture de la page d'accueil entière
- **Version mobile** : Test responsive sur viewport mobile (375x667)
- **Version tablette** : Test responsive sur viewport tablette (768x1024)

### 2. Tests de composants
- **Section Hero** : Zone principale d'accroche
- **Navigation** : Barre de navigation
- **Formulaire de contact** : Zone de contact
- **Footer** : Pied de page

### 3. Tests d'états interactifs
- **États du formulaire** :
  - Formulaire vide (état initial)
  - Formulaire avec focus
  - Formulaire rempli
  - État d'erreur (validation)

## Workflow CI/CD

### GitHub Actions

Deux workflows gèrent les tests visuels :

1. **Quality Pipeline** (`quality-pipeline.yml`) - Pipeline principal incluant tous les tests
2. **Visual Regression** (`visual-regression.yml`) - Pipeline dédié aux tests visuels

### Gestion des échecs

Quand des différences sont détectées :

1. **Artifacts générés** :
   - `screenshot-diffs/` - Images montrant les différences
   - `*-actual.png` - Capture actuelle
   - `*-expected.png` - Capture de référence
   - `*-diff.png` - Visualisation des différences

2. **Comment sur PR** : Le bot commente automatiquement avec :
   - Nombre de fichiers avec différences
   - Instructions pour résoudre
   - Lien vers les artifacts

## Utilisation pratique

### Première exécution

Lors de la première exécution, Playwright génère les screenshots de référence :

```bash
npm run e2e:visual:update
```

Ces images doivent être committées dans le repo comme référence.

### Après modifications intentionnelles

Si vous modifiez l'interface intentionnellement :

1. Exécutez les tests pour voir les différences :
```bash
npm run e2e:visual
```

2. Si les changements sont corrects, mettez à jour les références :
```bash
npm run e2e:visual:update
```

3. Committez les nouveaux screenshots :
```bash
git add test-results/
git commit -m "update: visual regression baselines"
```

### Debugging des échecs

Quand un test échoue :

1. **Vérifiez les artifacts** dans GitHub Actions
2. **Analysez les différences** avec les images `*-diff.png`
3. **Testez localement** avec `npm run e2e:visual --headed`

## Configuration avancée

### Tolérance aux différences

Dans `playwright.config.ts`, ajustez le seuil de tolérance :

```typescript
expect: {
  toHaveScreenshot: {
    threshold: 0.2, // 20% de différence tolérée
    animations: 'disabled',
    caret: 'hide',
  }
}
```

### Désactivation des animations

Les tests désactivent automatiquement les animations pour des captures cohérentes :

```css
*, *::before, *::after {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```

### Viewports personnalisés

Ajoutez des tailles d'écran spécifiques dans les tests :

```typescript
test('custom viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  // ... test
});
```

## Bonnes pratiques

### 1. Stabilité des captures
- Toujours attendre le chargement complet avec `waitForLoadState('networkidle')`
- Désactiver les animations
- Masquer les éléments dynamiques (curseurs, horodatages)

### 2. Granularité des tests
- Tester les composants individuellement pour des diagnostics précis
- Éviter les captures trop larges qui masquent les petits changements

### 3. Maintenance
- Réviser régulièrement les screenshots de référence
- Nettoyer les anciens fichiers de test
- Documenter les changements visuels intentionnels

### 4. Performance
- Utiliser des viewports cohérents
- Limiter le nombre de browsers pour les tests visuels (Chromium suffisant)
- Optimiser les timeouts

## Dépannage

### Problèmes courants

**1. Screenshots différents entre local et CI**
- Vérifiez les polices système
- Utilisez des conteneurs Docker identiques
- Désactivez les fonctionnalités système (scrollbars, etc.)

**2. Tests instables**
- Augmentez les timeouts
- Améliorez les sélecteurs
- Vérifiez les animations résiduelles

**3. Fichiers volumineux**
- Utilisez Git LFS pour les images
- Limitez la résolution des captures
- Nettoyez régulièrement les anciens screenshots

## Intégration continue

### Stratégie de branches

- **main/prod** : Screenshots stables, tolérance faible
- **dev** : Développement actif, tolérance plus élevée
- **feature/** : Tests optionnels, mise à jour fréquente

### Revue de code

Lors des PR incluant des changements visuels :

1. Vérifiez les artifacts des tests
2. Validez que les changements sont intentionnels
3. Assurez-vous que les nouvelles références sont committées
4. Testez sur différents navigateurs si nécessaire