# 📸 État des Tests de Régression Visuelle

## Status Actuel  
🗑️ **SUPPRIMÉS** - Retirés du projet pour simplifier la maintenance

## Raison
Les tests de régression visuelle échouent en CI en raison de différences de rendu entre :
- Environnement local (macOS)  
- Environnement CI (Ubuntu Linux)

## Solutions Implémentées

### ✅ Corrections Appliquées
1. **Configuration Playwright plus tolérante** 
   - `threshold: 0.3` (était 0.2)
   - `maxDiffPixels: 500`

2. **Screenshots multi-plateforme générés**
   - Screenshots Darwin et Linux créés
   - Script `scripts/generate-visual-baselines.js` disponible

3. **Pipeline CI séparé**
   - Tests visuels isolés des tests E2E
   - Exécution uniquement sur Chromium

### 🔄 Réimplémentation Future

Si tu souhaites réimplémenter les tests visuels à l'avenir :

1. **Utiliser un service externe comme Percy ou Chromatic**
   - Rendu cross-platform cohérent
   - Gestion automatique des baselines
   - Interface de review visuelle

2. **Ou recréer avec approche Docker**
   - Environnement Linux reproductible
   - Configuration plus complexe mais stable

3. **Fichiers à recréer**
   ```bash
   e2e/visual-regression.spec.ts    # Fichier de tests
   scripts/visual-baselines.js     # Générateur de baselines
   ```

## Alternatives Considérées

### A. Percy/Chromatic (Services Externes)
- ✅ Rendu cross-platform cohérent
- ❌ Coût supplémentaire  
- ❌ Dépendance externe

### B. Docker avec Display Virtuel
- ✅ Environnement reproductible
- ❌ Complexité CI accrue
- ❌ Performance réduite

### C. Tests Visuels Locaux Uniquement
- ✅ Simple à maintenir
- ✅ Feedback immédiat développeur
- ❌ Pas de validation CI automatique

## Recommandation

**Phase 1 (Actuelle)** : Audit avec tests visuels désactivés en CI
**Phase 2 (Future)** : Évaluer Percy/Chromatic ou solution Docker selon budget

---
*Dernière mise à jour: Septembre 2025*