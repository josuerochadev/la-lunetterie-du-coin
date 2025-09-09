# ADR-004: Stratégie d'Accessibilité

## Statut

**Accepted** - 2024-12-09

## Contexte

L'accessibilité est une exigence légale et éthique pour une application web moderne. En tant que site vitrine pour une lunetterie, nous devions garantir l'accès à tous les utilisateurs, incluant ceux avec des handicaps visuels, auditifs, moteurs ou cognitifs.

**Objectifs** :

- Conformité **WCAG 2.1 AA** complète
- **0 violations** détectées par axe-core
- Navigation **100% clavier** fonctionnelle
- Support **lecteurs d'écran** optimal
- Respect des **préférences utilisateur**

## Décision

### Architecture d'Accessibilité

#### 1. **Provider Pattern pour A11y Context**

```typescript
// a11y/MotionProvider.tsx
const MotionProvider = ({ children }) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    document.documentElement.setAttribute('data-prm', String(prefersReducedMotion))
  }, [prefersReducedMotion])

  return <>{children}</>
}
```

#### 2. **Hooks d'Accessibilité Dédiés**

```typescript
// hooks/usePrefersReducedMotion.ts
export const usePrefersReducedMotion = (): boolean => {
  // Détection matchMedia avec fallbacks SSR
};

// hooks/useKeyboardNavigation.ts
export const useKeyboardNavigation = () => {
  // Gestion focus et navigation clavier
};
```

#### 3. **Composants A11y-First**

```typescript
// Tous les composants incluent l'accessibilité par défaut
const Button = ({ children, ...props }) => (
  <button
    className="focus:ring-2 focus:ring-brand focus:outline-none"
    {...props}
  >
    {children}
  </button>
)
```

### Standards Implémentés

#### **WCAG 2.1 AA Compliance**

##### Niveau A

- ✅ **1.1.1** Images avec alt text approprié
- ✅ **1.3.1** Structure sémantique HTML5
- ✅ **1.4.1** Couleur non utilisée seule pour l'information
- ✅ **2.1.1** Navigation clavier complète
- ✅ **2.4.1** Skip links implémentés
- ✅ **3.1.1** Langue de la page déclarée
- ✅ **4.1.1** HTML valide
- ✅ **4.1.2** Nom, rôle, valeur pour tous les éléments

##### Niveau AA

- ✅ **1.4.3** Contraste 4.5:1 minimum (texte normal)
- ✅ **1.4.11** Contraste 3:1 minimum (éléments graphiques)
- ✅ **2.4.6** Headings et labels descriptifs
- ✅ **2.4.7** Focus visible sur tous les éléments interactifs
- ✅ **3.2.3** Navigation cohérente
- ✅ **3.3.2** Labels ou instructions pour les formulaires

#### **Techniques Spécifiques**

##### Gestion du Focus

```css
/* Focus ring cohérent et visible */
.focus-visible {
  @apply ring-2 ring-brand ring-offset-2 ring-offset-white;
  @apply outline-none;
}

/* Focus trap pour modals */
.modal-overlay {
  @apply fixed inset-0 z-50;
}
```

##### ARIA Patterns

```typescript
// Navigation avec ARIA
<nav aria-label="Navigation principale">
  <ul role="list">
    <li><a aria-current="page">Accueil</a></li>
    <li><a href="/services">Services</a></li>
  </ul>
</nav>

// État des boutons
<button
  aria-expanded={isOpen}
  aria-controls="menu-content"
  aria-label="Ouvrir le menu"
>
  Menu
</button>
```

##### Images Accessibles

```typescript
// Component Picture avec alt approprié
const Picture = ({ src, alt, decorative = false }) => (
  <img
    src={src}
    alt={decorative ? "" : alt}
    role={decorative ? "presentation" : undefined}
  />
)
```

## Tests d'Accessibilité

### Tests Automatisés

#### 1. **axe-core Integration**

```javascript
// Chaque test de composant inclut axe
it('should be accessible', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### 2. **CI/CD Pipeline**

```yaml
# .github/workflows/quality-pipeline.yml
- name: Accessibility Tests
  run: |
    npm run build
    npm run preview &
    npx wait-on http://localhost:4173
    npm run a11y
```

#### 3. **Lighthouse CI**

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        accessibility: ['error', { minScore: 1 }],
      },
    },
  },
};
```

### Tests Manuels

#### Checklist de Validation

- [ ] **Navigation clavier** : Tab, Shift+Tab, Enter, Espace
- [ ] **Lecteur d'écran** : VoiceOver (macOS), NVDA (Windows)
- [ ] **Zoom** : 200% sans scroll horizontal
- [ ] **Contraste** : Vérification avec outils dédiés
- [ ] **prefers-reduced-motion** : Test avec paramètre OS

## Outils et Configuration

### Extensions VSCode

- **axe Accessibility Linter**
- **WAVE Evaluation Tool**
- **Color Oracle** (test daltonisme)

### Outils CLI

```bash
# Tests automatisés
npm run a11y              # axe-core via CLI
npm run lighthouse        # Audit complet avec a11y
npm run test:run          # Tests unitaires avec axe

# Outils manuels
npx @axe-core/cli         # Test pages spécifiques
npx lighthouse-ci         # CI integration
```

### Browser Extensions

- **axe DevTools** : Audit détaillé
- **WAVE** : Évaluation visuelle
- **Lighthouse** : Audit complet

## Conséquences

### Positives

- **Conformité légale** : WCAG 2.1 AA respecté
- **Inclusivité maximale** : Accessible à tous les utilisateurs
- **SEO amélioré** : Structure sémantique favorable au référencement
- **UX pour tous** : Interface utilisable dans tous les contextes
- **Quality gate** : 0 violations garanties par la CI

### Négatives

- **Effort initial** : Apprentissage et mise en place des standards
- **Complexité** : Tests et validations supplémentaires
- **Maintenance** : Vigilance constante sur les nouvelles features

### Métriques de Validation

- ✅ **axe-core violations** : 0/0
- ✅ **Lighthouse Accessibility** : Score 100/100
- ✅ **Keyboard navigation** : 100% des éléments accessibles
- ✅ **Screen reader** : Navigation fluide testée sur VoiceOver/NVDA
- ✅ **Color contrast** : 4.5:1+ partout (7.2:1 moyenne)

## Standards d'Équipe

### Guidelines de Développement

#### Composants

```typescript
// ✅ Bon - Accessibilité incluse par défaut
const Button = ({ children, variant = 'primary', ...props }) => (
  <button
    className={cn(
      'focus:ring-2 focus:ring-brand focus:outline-none',
      'transition-colors duration-200',
      variants[variant]
    )}
    {...props}
  >
    {children}
  </button>
)

// ❌ Éviter - Pas de gestion du focus
const Button = ({ children }) => (
  <div className="cursor-pointer" onClick={handleClick}>
    {children}
  </div>
)
```

#### Formulaires

```typescript
// ✅ Labels appropriés et messages d'erreur
const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-sm font-medium">
      {label} {required && <span aria-label="requis">*</span>}
    </label>
    {children}
    {error && (
      <div role="alert" className="text-error text-sm">
        {error}
      </div>
    )}
  </div>
)
```

#### Navigation

```typescript
// ✅ Skip links et navigation sémantique
const Layout = ({ children }) => (
  <div>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only"
    >
      Aller au contenu principal
    </a>
    <Header />
    <main id="main-content" tabIndex={-1}>
      {children}
    </main>
    <Footer />
  </div>
)
```

### Processus de Review

1. **Développement** : axe DevTools pendant le dev
2. **Tests** : axe-core dans tous les tests de composants
3. **Review** : Checklist a11y dans les PR
4. **CI/CD** : Validation automatique avant merge
5. **Production** : Monitoring continu avec Lighthouse

## Évolutions Futures

- **Screen reader testing** : Tests automatisés avec speech recognition
- **Voice navigation** : Support des commandes vocales
- **Cognitive load** : Métriques de complexité cognitive
- **User testing** : Sessions avec utilisateurs en situation de handicap
- **Advanced ARIA** : Patterns complexes (datepicker, carousel, etc.)
