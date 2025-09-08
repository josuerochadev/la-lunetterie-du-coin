# Guide de Contribution - La Lunetterie du Coin

Merci de votre intérêt pour contribuer à La Lunetterie du Coin ! Ce guide vous aidera à démarrer.

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** 20+ 
- **PNPM** (gestionnaire de paquets recommandé)
- **Git**

### Installation

```bash
# Cloner le repository
git clone https://github.com/josuerochadev/la-lunetterie-du-coin.git
cd la-lunetterie-du-coin

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm run dev
```

## 📋 Workflow de Contribution

### 1. **Créer une branche**

```bash
# Format: type/description-courte
git checkout -b feat/nouvelle-fonctionnalite
git checkout -b fix/correction-bug
git checkout -b docs/mise-a-jour-readme
```

### 2. **Développer et tester**

```bash
# Développement avec hot reload
pnpm run dev

# Lancer tous les tests
pnpm run test:run

# Vérifier le coverage
pnpm run test:coverage

# Linter et formater
pnpm run lint
pnpm run format

# Build de production
pnpm run build
```

### 3. **Commits de qualité**

Utilisez [Conventional Commits](https://conventionalcommits.org/) :

```bash
git commit -m "feat: add contact form validation"
git commit -m "fix: resolve image loading issue"
git commit -m "docs: update API documentation"
```

**Types de commit :**
- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `docs`: documentation
- `style`: formatting, pas de changement de code
- `refactor`: refactoring sans ajout de feature
- `test`: ajout ou modification de tests
- `chore`: tâches de maintenance

### 4. **Pull Request**

1. Pusher votre branche
2. Créer une PR sur GitHub
3. Remplir le template de PR
4. Attendre la review

## 🏗️ Architecture & Standards

### Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants UI de base
│   ├── motion/         # Composants d'animation
│   └── [feature]/      # Composants spécifiques
├── hooks/              # Hooks React personnalisés
├── lib/                # Utilitaires et helpers
├── pages/              # Composants de pages
├── styles/             # Feuilles de style CSS
└── types/              # Définitions TypeScript
```

### Standards de Code

#### **TypeScript**
- Utiliser des types explicites
- Préférer `interface` à `type` pour les objets
- Typer les props des composants

```typescript
// ✅ Bon
interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

// ❌ Éviter
const Button = (props: any) => { /* ... */ }
```

#### **React**
- Composants fonctionnels avec hooks
- Props destructurées
- Noms explicites pour les handlers

```typescript
// ✅ Bon
const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const handleSubmit = (data: FormData) => {
    onSubmit(data)
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

#### **CSS/Tailwind**
- Utiliser les classes sémantiques définies
- Préférer les CSS custom properties pour les couleurs
- Respecter le design system

```css
/* ✅ Utiliser les couleurs sémantiques */
.button-primary {
  @apply bg-brand text-brand-contrast;
}

/* ❌ Éviter les couleurs directes */
.button-primary {
  @apply bg-blue-600 text-white;
}
```

#### **Imports**
- Chemins relatifs pour modules proches
- Alias `@/` pour src/
- **IMPORTANT**: Imports Lucide spécifiques

```typescript
// ✅ Imports Lucide corrects
import { Mail } from 'lucide-react/dist/esm/icons/mail'
import { Phone } from 'lucide-react/dist/esm/icons/phone'

// ❌ Import global (interdit par ESLint)
import { Mail, Phone } from 'lucide-react'
```

## 🧪 Tests

### Types de Tests

#### **Tests Unitaires** (Vitest + Testing Library)
```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

#### **Tests E2E** (Playwright)
```typescript
// e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test'

test('should submit contact form', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Contact')
  // Test du parcours complet
})
```

### Couverture de Tests

- **Objectif**: Maintenir > 85% de couverture
- **Focus**: Logique métier et interactions critiques
- **Éviter**: Tests sur des détails d'implémentation

## 🎨 Design System

### Couleurs
```css
/* Couleurs sémantiques */
--color-brand: /* Couleur principale */
--color-accent: /* Couleur d'accentuation */
--color-success: /* Succès */
--color-warning: /* Avertissement */
--color-error: /* Erreur */
```

### Animations
- Respecter `prefers-reduced-motion`
- Utiliser `ConditionalMotion` pour les animations
- Durées cohérentes : 200ms, 300ms, 500ms

## ♿ Accessibilité

### Checklist A11y

- [ ] Contrastes WCAG AA (4.5:1 minimum)
- [ ] Navigation au clavier
- [ ] Lecteurs d'écran (aria-labels)
- [ ] Focus visible
- [ ] Respect de `prefers-reduced-motion`

```bash
# Tests d'accessibilité automatisés
pnpm run a11y
```

## 📊 Performance

### Objectifs
- Lighthouse Performance > 90
- Bundle JS critique < 100kb
- Images optimisées (AVIF/WebP)

```bash
# Audit performance
pnpm run lighthouse:mobile
pnpm run lighthouse:desktop

# Check qualité complète
pnpm run quality:check
```

## 🔧 Outils de Développement

### Scripts Utiles

```bash
# Développement
pnpm run dev              # Serveur de dev (port 5173)
pnpm run preview          # Preview prod (port 4173)

# Tests
pnpm run test             # Tests en mode watch
pnpm run test:run         # Tests une fois
pnpm run test:coverage    # Avec coverage

# Qualité
pnpm run lint             # ESLint
pnpm run format           # Prettier
pnpm run a11y            # Tests accessibilité

# Build
pnpm run build           # Build production
pnpm run img:optimize    # Optimiser images
```

### Extensions VSCode Recommandées

- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**

## 🐛 Signaler un Bug

1. Vérifier que le bug n'existe pas déjà dans les Issues
2. Créer une nouvelle Issue avec le template Bug Report
3. Inclure :
   - **Steps to reproduce**
   - **Expected behavior**
   - **Actual behavior**
   - **Browser/OS**
   - **Screenshots** si pertinentes

## 💡 Proposer une Fonctionnalité

1. Créer une Issue avec le template Feature Request
2. Expliquer le **problème** que ça résout
3. Décrire la **solution** proposée
4. Considérer les **alternatives**

## 📚 Ressources

- [Architecture Decision Records](./docs/adr/) - Décisions architecturales
- [Documentation Technique](./CLAUDE.md) - Guide architecture détaillé
- [Tests](./docs/testing-suite.md) - Stratégie de tests
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Code de Conduite

- Soyez respectueux et constructifs
- Accueillez les nouveaux contributeurs
- Focalisez sur le code, pas sur la personne
- Demandez de l'aide si besoin

---

**Merci de contribuer à La Lunetterie du Coin !** 🎯

Pour toute question, n'hésitez pas à ouvrir une Discussion GitHub ou à contacter l'équipe.