# ADR-002: Architecture des Composants

## Statut

**Accepted** - 2024-12-09

## Contexte

L'organisation des composants React est cruciale pour la maintenabilité et la réutilisabilité. Nous devions définir une structure claire qui facilite :

- **Réutilisabilité** : Composants partagés entre différentes sections
- **Maintenabilité** : Code organisé et facile à modifier
- **Performances** : Lazy loading et tree shaking efficaces
- **Accessibilité** : Composants a11y-compliant par défaut

## Décision

### Structure des Dossiers

```
src/components/
├── common/          # Composants UI de base réutilisables
│   ├── Button/     # Composant bouton avec variantes
│   ├── Picture/    # Images optimisées avec fallbacks
│   └── Layout/     # Layouts de base
├── motion/         # Composants d'animation
│   ├── ConditionalMotion  # Wrapper respectant prefers-reduced-motion
│   └── variants/   # Variantes d'animation réutilisables
├── navbar/         # Navigation spécifique
└── [feature]/      # Composants spécifiques par fonctionnalité
```

### Patterns Adoptés

#### 1. **Composition Pattern**

```typescript
// Composants composables et flexibles
<Card>
  <Card.Header>
    <Card.Title>Titre</Card.Title>
  </Card.Header>
  <Card.Content>
    Contenu
  </Card.Content>
</Card>
```

#### 2. **Polymorphic Components**

```typescript
// Composants adaptatifs (Button, Link, etc.)
<Button as="a" href="/contact">
  Contact
</Button>
```

#### 3. **Conditional Motion**

```typescript
// Animations respectant les préférences utilisateur
<ConditionalMotion
  animate={{ opacity: 1 }}
  initial={{ opacity: 0 }}
>
  Contenu
</ConditionalMotion>
```

## Alternatives Considérées

### Atomic Design vs Feature-Based

- **Atomic Design** : Atoms/Molecules/Organisms - trop abstrait
- **Feature-Based** : Organisation par domaine métier - plus claire

**Choix** : Hybride common + feature pour équilibrer réutilisabilité et clarté

### Barrel Exports vs Direct Imports

- **Barrel Exports** : `index.ts` avec re-exports - peut impacter le tree shaking
- **Direct Imports** : Import direct des composants - optimisation garantie

**Choix** : Direct imports pour les performances, barrel limité aux utilitaires

### CSS-in-JS vs Tailwind Classes

- **CSS-in-JS** : Encapsulation mais runtime overhead
- **Tailwind** : Performance et consistency

**Choix** : Tailwind avec classes sémantiques custom

## Conséquences

### Positives

- **Réutilisabilité élevée** : Composants `common/` utilisés partout
- **Performance optimale** : Tree shaking efficace, pas de code mort
- **Accessibilité par défaut** : Tous les composants incluent les patterns a11y
- **Développement rapide** : Patterns établis et composants prêts
- **Maintenance facile** : Structure claire et prévisible

### Négatives

- **Setup initial** : Temps de création des composants de base
- **Conventions strictes** : Nécessite de la discipline d'équipe
- **Complexité apparente** : Structure peut sembler over-engineered

### Standards Établis

#### Import Patterns

```typescript
// ✅ Bon - Import spécifique
import { Button } from '@/components/common/Button';

// ❌ Éviter - Barrel import qui peut impacter le bundle
import { Button } from '@/components';
```

#### Component Structure

```typescript
// Structure standard d'un composant
export interface ComponentProps {
  // Props typées
}

export const Component = ({ ...props }: ComponentProps) => {
  // Logic
  return (
    <div className="semantic-class">
      {/* JSX */}
    </div>
  )
}

// Export par défaut optionnel
export default Component
```

#### Testing Pattern

```typescript
// Test pattern standard
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should be accessible', async () => {
    const { container } = render(<Component />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## Validation

Cette architecture a permis d'atteindre :

- ✅ **0 violations a11y** grâce aux composants conformes
- ✅ **Bundle size optimal** avec tree shaking efficace
- ✅ **95.49% test coverage** avec patterns de test clairs
- ✅ **Développement rapide** grâce à la réutilisabilité
- ✅ **Maintenance simplifiée** avec structure prévisible

## Évolutions Futures

- **Storybook** : Documentation interactive des composants
- **Component variants** : System basé sur cva ou similar
- **Design tokens** : Intégration plus poussée avec Tailwind
- **Automated testing** : Snapshots visuels pour les composants
