# 🥽 La Lunetterie du Coin

> Application web moderne pour une lunetterie française, construite avec React 19, TypeScript et Vite

[![Quality Pipeline](https://github.com/josuerochadev/la-lunetterie-du-coin/actions/workflows/quality-pipeline.yml/badge.svg)](https://github.com/josuerochadev/la-lunetterie-du-coin/actions/workflows/quality-pipeline.yml)
[![codecov](https://codecov.io/gh/josuerochadev/la-lunetterie-du-coin/branch/main/graph/badge.svg)](https://codecov.io/gh/josuerochadev/la-lunetterie-du-coin)

## ✨ Fonctionnalités

- 🎨 **Design moderne** avec animations fluides respectant l'accessibilité
- ♿ **Accessibilité WCAG 2.1 AA** avec 0 violations détectées
- ⚡ **Performance optimisée** (Lighthouse Score 90+)
- 📱 **Responsive Design** pour tous les appareils
- 🔧 **TypeScript** pour une base de code robuste
- 🧪 **Tests complets** (95.49% de couverture)

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- PNPM (recommandé)

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

L'application sera disponible sur [http://localhost:5173](http://localhost:5173)

## 🏗️ Stack Technique

### Frontend

- **React 19** - Framework UI moderne
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animations performantes

### Outils de Qualité

- **Vitest** + **Testing Library** - Tests unitaires
- **Playwright** - Tests E2E
- **ESLint** + **Prettier** - Linting et formatting
- **Lighthouse CI** - Audit performance automatisé
- **axe-core** - Tests d'accessibilité

## 📊 Métriques de Qualité

| Métrique                   | Valeur Actuelle | Objectif |
| -------------------------- | --------------- | -------- |
| **Test Coverage**          | 95.49%          | ≥ 10%    |
| **Lighthouse Performance** | 90+             | ≥ 90     |
| **Bundle Size**            | ~300kb          | ≤ 10MB   |
| **A11y Violations**        | 0               | 0        |
| **ESLint Warnings**        | 0               | 0        |

## 🧪 Tests

```bash
# Tests unitaires
pnpm run test              # Mode watch
pnpm run test:run          # Une fois
pnpm run test:coverage     # Avec coverage

# Tests E2E
pnpm run e2e               # Headless
pnpm run e2e:headed        # Avec navigateur
pnpm run e2e:ui            # Interface Playwright

# Tests accessibilité
pnpm run a11y

# Suite complète de qualité
pnpm run quality:check
```

## 🏗️ Build & Déploiement

```bash
# Build de production
pnpm run build

# Preview local du build
pnpm run preview

# Audit performance
pnpm run lighthouse:mobile
pnpm run lighthouse:desktop
```

## 🎨 Design System

Le projet utilise un design system basé sur Tailwind CSS avec :

- **Couleurs sémantiques** : `brand`, `accent`, `success`, `warning`, `error`
- **Typographie fluide** avec clamp() pour la responsivité
- **Animations accessibles** respectant `prefers-reduced-motion`
- **Composants réutilisables** : Button, Picture, Cards

## ♿ Accessibilité

L'accessibilité est une priorité absolue :

- ✅ Support complet du clavier
- ✅ Lecteurs d'écran compatibles
- ✅ Contrastes WCAG AA (4.5:1)
- ✅ Respect des préférences de mouvement
- ✅ Structure HTML sémantique

## 📈 Performance

Optimisations implémentées :

- **Code splitting** intelligent
- **Lazy loading** des images et composants
- **Bundle analysis** et tree shaking
- **Formats d'images modernes** (AVIF, WebP)
- **Critical CSS** inliné

## 🤝 Contribution

Nous accueillons les contributions ! Consultez notre [Guide de Contribution](./CONTRIBUTING.md) pour commencer.

### Workflow de contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feat/amazing-feature`)
3. Commit des changements (`git commit -m 'feat: add amazing feature'`)
4. Push sur la branche (`git push origin feat/amazing-feature`)
5. Ouvrir une Pull Request

## 📚 Documentation

- [Guide de contribution](./CONTRIBUTING.md) - Installation, workflow, standards de code
- [Architecture Decision Records](./docs/adr/) - Decisions techniques documentees
- [Configuration environnement](./docs/environment-setup.md) - Variables d'environnement
- [Standards icones](./docs/standards/icons.md) - Patterns d'import Lucide
- [Audits qualite](./docs/audits/) - Resultats des audits (KISS, SOLID, lisibilite, architecture)
- [Strategie de tests](./docs/testing-suite.md) - Tests unitaires, E2E, visuels

## 📝 Licence

Projet prive.

## 👥 Équipe

- **Développeur Principal** : [@josuerochadev](https://github.com/josuerochadev)

---

**Developpe avec soin pour La Lunetterie du Coin**
