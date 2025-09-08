# ADR-002: Approche Motion & Accessibilité First

**Date**: 2024-09-08  
**Statut**: Accepté  
**Décideurs**: Équipe de développement, Expert UX

## Contexte

L'application nécessite des animations fluides pour améliorer l'expérience utilisateur, mais doit respecter les préférences d'accessibilité des utilisateurs, notamment ceux sensibles au mouvement.

### Contraintes d'accessibilité :
- Respecter `prefers-reduced-motion`
- Support WCAG 2.1 AA
- Performance sur appareils bas de gamme
- Animations significatives, pas décoratives

## Options considérées

### Option A: CSS Animations uniquement
**Avantages:**
- Performance native
- Pas de dépendance JS

**Inconvénients:**
- Contrôle limité
- Difficile à synchroniser

### Option B: Framer Motion complet
**Avantages:**
- API riche et flexible
- Gestion avancée des gestes

**Inconvénients:**
- Bundle size important
- Peut être overkill

### Option C: Framer Motion + LazyMotion (approche hybride)
**Avantages:**
- Performance optimisée
- Chargement à la demande
- Contrôle granulaire

## Décision

**Choix: Option C - Framer Motion + LazyMotion avec MotionProvider**

### Architecture retenue :
```typescript
// MotionProvider global avec détection préférences
<MotionProvider>
  <LazyMotion features={loadMotionFeatures}>
    {/* App */}
  </LazyMotion>
</MotionProvider>
```

### Composants clés :
- `MotionProvider`: Contexte global pour préférences motion
- `ConditionalMotion`: Wrapper qui respecte les préférences
- `loadMotionFeatures`: Chargement paresseux des features

## Conséquences

### Positives ✅
- **Accessibilité**: Respect automatique de `prefers-reduced-motion`
- **Performance**: LazyMotion réduit le bundle de ~40%
- **UX**: Animations fluides qui améliorent la perception
- **Flexibilité**: API Framer Motion pour interactions complexes
- **Maintenabilité**: Code centralisé dans MotionProvider

### Négatives ⚠️
- Complexité supplémentaire avec le système de Provider
- Dépendance externe (Framer Motion)
- Courbe d'apprentissage pour l'équipe

### Implémentation technique
```css
/* CSS custom properties pour cohérence */
:root {
  --animation-duration: 0.3s;
  --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}

[data-prm="reduce"] {
  --animation-duration: 0.01s;
}
```

### Métriques de succès
- Bundle size des animations < 15kb gzipped
- Respect à 100% des préférences utilisateur
- Lighthouse Performance > 90
- Tests a11y 0 violations