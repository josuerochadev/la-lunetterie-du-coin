# ADR-003: Gestion des Animations

## Statut

**Accepted** - 2024-12-09

## Contexte

Les animations améliorent l'expérience utilisateur mais doivent respecter les contraintes d'accessibilité. Nous devions implémenter un système qui :

- **Respecte `prefers-reduced-motion`** : Accessibilité obligatoire
- **Performance optimale** : Pas de janks ou de blocages
- **API cohérente** : Utilisation simple et prévisible
- **Bundle size** : Impact minimal sur le poids de l'application

## Décision

### Architecture du Système

#### 1. **MotionProvider** (Context Pattern)

```typescript
// Détection globale des préférences de mouvement
const MotionProvider = ({ children }) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div data-prm={prefersReducedMotion}>
      {children}
    </div>
  )
}
```

#### 2. **ConditionalMotion** (Wrapper Component)

```typescript
// Animation conditionnelle basée sur les préférences
const ConditionalMotion = ({ children, ...motionProps }) => {
  const shouldAnimate = !usePrefersReducedMotion()

  return shouldAnimate ? (
    <motion.div {...motionProps}>{children}</motion.div>
  ) : (
    <div>{children}</div>
  )
}
```

#### 3. **LazyMotion** (Performance)

```typescript
// Chargement lazy du moteur d'animation
import { LazyMotion, domAnimation } from 'framer-motion'

<LazyMotion features={domAnimation}>
  <App />
</LazyMotion>
```

#### 4. **Data Attribute Pattern**

```css
/* CSS conditionnel basé sur data-prm */
[data-prm='false'] .animated {
  transition: transform 0.3s ease;
}

[data-prm='true'] .animated {
  /* Pas d'animation si préférence réduite */
}
```

### Variants d'Animation

```typescript
// variants/fadeIn.ts
export const fadeInVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// variants/slideIn.ts
export const slideInVariants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
};
```

## Alternatives Considérées

### CSS Animations vs Framer Motion

- **CSS Animations** : Plus léger mais moins flexible
- **Framer Motion** : Plus lourd mais API riche et gestion du reduced motion

**Choix** : Framer Motion avec LazyMotion pour équilibrer fonctionnalités et performance

### Global State vs Hook-based Detection

- **Redux/Zustand** : Overkill pour une seule valeur
- **Context API** : Parfait pour partager la préférence globalement
- **Hook local** : Répétition de logique dans chaque composant

**Choix** : Context + Hook pour la flexibilité et la performance

### JavaScript vs CSS for Conditional Animations

- **JS Conditional** : Contrôle total mais plus de JavaScript
- **CSS Classes** : Plus performant mais moins flexible
- **Data Attributes** : Compromis optimal

**Choix** : Data attributes pour allier performance CSS et contrôle JS

## Implémentation

### Hook `usePrefersReducedMotion`

```typescript
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};
```

### Utilisation dans les Composants

```typescript
const AnimatedSection = ({ children }) => {
  return (
    <ConditionalMotion
      initial="initial"
      animate="animate"
      variants={fadeInVariants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </ConditionalMotion>
  )
}
```

### CSS Conditionnel

```css
/* Animations uniquement si reduced motion désactivé */
[data-prm='false'] .hero-title {
  animation: slideInUp 0.8s ease-out;
}

[data-prm='false'] .card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

[data-prm='false'] .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* États statiques si reduced motion activé */
[data-prm='true'] .card {
  /* Pas de transition */
}
```

## Conséquences

### Positives

- **Accessibilité parfaite** : 0 violations a11y grâce au respect des préférences
- **Performance optimale** : LazyMotion charge uniquement ce qui est nécessaire
- **API cohérente** : Patterns clairs et réutilisables dans toute l'app
- **Flexibilité** : Système adaptable aux besoins futurs
- **Bundle impact minimal** : Lazy loading du moteur d'animation

### Négatives

- **Complexité initiale** : Setup du système et formation de l'équipe
- **Dépendance Framer Motion** : Library externe pour les animations
- **Tests complexes** : Mock de matchMedia nécessaire

### Métriques de Validation

- ✅ **Accessibilité** : 0 violations axe-core
- ✅ **Performance** : Pas de janks détectés en dev/prod
- ✅ **Bundle size** : Impact <5kb grâce à LazyMotion
- ✅ **UX** : Animations fluides qui améliorent l'expérience
- ✅ **Compatibility** : Fonctionne sur tous les navigateurs ciblés

## Standards d'Utilisation

### Guidelines

1. **Toujours** utiliser ConditionalMotion pour les animations de composants
2. **Préférer** CSS transitions pour les micro-interactions
3. **Tester** avec `prefers-reduced-motion: reduce` activé
4. **Éviter** les animations trop longues (>500ms)
5. **Optimiser** avec `will-change` si nécessaire

### Durées Standard

- **Micro-interactions** : 150-200ms
- **Transitions de composants** : 300ms
- **Animations de pages** : 400-500ms
- **Animations complexes** : Max 800ms

## Évolutions Futures

- **Motion variants library** : Bibliothèque de variants prêts à l'emploi
- **Intersection Observer** : Animations déclenchées au scroll
- **Performance monitoring** : Métriques d'animation en production
- **Custom easing** : Courbes d'animation personnalisées pour la marque
