# ADR-005: Implémentation des principes SOLID

**Date**: 2024-09-08  
**Statut**: Accepté  
**Décideurs**: Équipe de développement, Tech Lead

## Contexte

Pour assurer la maintenabilité et l'évolutivité du code, nous devons implémenter les principes SOLID de manière pratique et adaptée à React/TypeScript.

### Défis identifiés :
- Composants React monolithiques difficiles à tester
- Logique métier mélangée avec la présentation  
- Difficultés de réutilisation des composants
- Couplage fort entre les modules

## Options considérées

### Option A: Application stricte SOLID
**Avantages:**
- Respect théorique parfait
- Séparation claire des responsabilités

**Inconvénients:**
- Sur-ingénierie pour une SPA
- Complexité excessive

### Option B: SOLID pragmatique adapté à React
**Avantages:**
- Équilibre maintenabilité/simplicité
- Adapté à l'écosystème React
- Testabilité améliorée

### Option C: Pas de contraintes SOLID
**Inconvénients:**
- Maintenabilité dégradée
- Tests difficiles

## Décision

**Choix: Option B - SOLID pragmatique adapté à React**

### Implémentation par principe :

#### **S - Single Responsibility Principle**
```typescript
// ❌ Avant: Composant monolithique
const ContactForm = () => {
  // validation, soumission, UI, formatage...
}

// ✅ Après: Responsabilités séparées
const ContactForm = () => <ContactFormUI />
const useFormValidation = () => { /* validation logic */ }
const useFormSubmission = () => { /* submission logic */ }
```

#### **O - Open/Closed Principle**  
```typescript
// Picture component extensible sans modification
interface PictureProps {
  src: string
  alt: string
}

interface OptimizedPictureProps extends PictureProps {
  priority?: boolean
  sizes?: string
}

interface ResponsivePictureProps extends PictureProps {
  breakpoints?: Breakpoint[]
}
```

#### **L - Liskov Substitution Principle**
```typescript
// Hiérarchie d'erreurs respectant LSP
class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

class FetchErrorWithResponse extends NetworkError {
  constructor(message: string, public response: Response) {
    super(message)
    this.name = 'FetchErrorWithResponse'
  }
}

// Tests LSP pour validation
describe('FetchErrorWithResponse - SOLID LSP', () => {
  it('should work as NetworkError (LSP compliance)', () => {
    const error = new FetchErrorWithResponse('Test', mockResponse)
    expect(error instanceof NetworkError).toBe(true)
  })
})
```

#### **I - Interface Segregation Principle**
```typescript
// Interfaces ségrégées selon les besoins
interface ImageOptimization {
  priority: boolean
  loading: 'lazy' | 'eager'
  sizes?: string
}

interface ResponsiveImage {
  breakpoints: Breakpoint[]
  defaultSize: string
}

// Composants utilisant seulement ce dont ils ont besoin
const OptimizedPicture: FC<PictureProps & ImageOptimization>
const ResponsivePicture: FC<PictureProps & ResponsiveImage>
```

#### **D - Dependency Inversion Principle**
```typescript
// Retry logic inversé - dépend d'abstractions
interface RetryPolicy {
  shouldRetry(error: Error, attempt: number): boolean
  getDelay(attempt: number): number
}

const withRetry = async <T>(
  fn: () => Promise<T>,
  policy: RetryPolicy // Interface, pas implémentation
): Promise<T> => { /* ... */ }
```

## Conséquences

### Positives ✅
- **Testabilité**: Chaque responsabilité testable isolément
- **Réutilisabilité**: Composants modulaires (Picture, Button)
- **Maintenabilité**: Code plus facile à comprendre et modifier
- **Évolutivité**: Extensions sans casser l'existant
- **Qualité**: 51 tests couvrent tous les principes SOLID

### Négatives ⚠️
- Code plus verbeux (plus de fichiers/interfaces)
- Courbe d'apprentissage pour l'équipe  
- Risque de sur-ingénierie si mal appliqué

### Exemples concrets implémentés
- **ContactForm**: Séparation validation/soumission/UI
- **Picture**: Hiérarchie d'interfaces (ISP)
- **RetryLogic**: Inversion de dépendance
- **NetworkErrors**: Hiérarchie LSP compliant

### Métriques de succès
- Tests unitaires passent avec substitution (LSP)
- Nouveaux composants réutilisent interfaces existantes (OCP)
- Une seule raison de changer par module (SRP)
- Zero couplage fort entre modules (DIP)