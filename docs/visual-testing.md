# Tests de Regression Visuelle

## Statut actuel

**DESACTIVES** - Retires du projet pour simplifier la maintenance.

### Raison

Les tests de regression visuelle echouent en CI en raison de differences de rendu entre :

- Environnement local (macOS)
- Environnement CI (Ubuntu Linux)

### Corrections tentees

1. **Configuration Playwright plus tolerante** - `threshold: 0.3`, `maxDiffPixels: 500`
2. **Screenshots multi-plateforme** - Darwin et Linux generes via `scripts/generate-visual-baselines.js`
3. **Pipeline CI separe** - Tests visuels isoles des E2E, Chromium uniquement

### Reimplementation future

Deux approches recommandees :

**Option A - Service externe (Percy / Chromatic)**

- Rendu cross-platform coherent, gestion automatique des baselines
- Interface de review visuelle integree aux PRs
- Cout supplementaire

**Option B - Docker avec display virtuel**

- Environnement Linux reproductible localement et en CI
- Complexite CI accrue, performance reduite

### Fichiers a recreer

```
e2e/visual-regression.spec.ts    # Tests Playwright
scripts/visual-baselines.js      # Generateur de baselines
```

### Architecture prevue (pour reimplementation)

**Pages a tester :**

- Homepage complete (desktop, mobile 375x667, tablette 768x1024)

**Composants a tester :**

- Section Hero, Navigation, Formulaire de contact, Footer

**Etats interactifs :**

- Formulaire : vide, focus, rempli, erreur validation

**Configuration recommandee :**

```typescript
expect: {
  toHaveScreenshot: {
    threshold: 0.2,
    animations: 'disabled',
    caret: 'hide',
  }
}
```

**Bonnes pratiques :**

- `waitForLoadState('networkidle')` avant capture
- Desactiver animations CSS
- Masquer elements dynamiques (curseurs, horodatages)
- Limiter a Chromium pour les tests visuels
- Utiliser Git LFS si screenshots commites

---

_Derniere mise a jour: Avril 2026_
