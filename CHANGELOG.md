# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Added

- Migration vers Vite 7.1.5 pour des performances améliorées
- Mise à jour vers @vitejs/plugin-react 5.0.2 pour une meilleure intégration React 19
- Tests de régression résolus avec 529 tests qui passent

### Changed

- Suppression des dépendances deprecated (@studio-freight/lenis)
- Mise à jour des dépendances de sécurité (Sentry, ESLint, TypeScript)
- Amélioration de la gestion d'erreur dans usePrefersReducedMotion hook

### Fixed

- Correction des échecs de tests dans usePrefersReducedMotion
- Amélioration de la compatibilité navigateur pour les API MediaQuery
- Résolution des problèmes de tests d'intersection observer
- Correction des alertes de sécurité CodeQL

### Security

- Audit de sécurité complet avec corrections des vulnérabilités low-severity
- Mise à jour des dépendances vers les dernières versions sécurisées

## [1.0.0] - 2024-12-09

### Added

- 🎉 **Version initiale** de La Lunetterie du Coin
- Interface moderne avec React 19, TypeScript et Vite
- Design system complet basé sur Tailwind CSS
- Système d'accessibilité avec 0 violations axe-core
- Suite de tests complète (95.49% de couverture)
- Pipeline CI/CD avec contrôles qualité automatisés
- Optimisations de performance (Lighthouse Score 90+)
- Support complet de l'internationalisation
- Animations fluides respectant prefers-reduced-motion
- SEO optimisé avec structured data JSON-LD

### Technical Stack

- **Frontend**: React 19, TypeScript 5.7, Vite 7
- **Styling**: Tailwind CSS 3.4, Framer Motion 12
- **Testing**: Vitest, Testing Library, Playwright
- **Quality**: ESLint, Prettier, Lighthouse CI
- **Monitoring**: Sentry, Analytics ready

### Performance & Quality Metrics

- ✅ Test Coverage: 95.49%
- ✅ Lighthouse Performance: 90+
- ✅ Bundle Size: ~300kb
- ✅ A11y Violations: 0
- ✅ ESLint Warnings: 0
- ✅ Build Time: <3s

---

## Format des types de changements

- **Added** pour les nouvelles fonctionnalités
- **Changed** pour les changements dans les fonctionnalités existantes
- **Deprecated** pour les fonctionnalités qui seront supprimées
- **Removed** pour les fonctionnalités supprimées
- **Fixed** pour les corrections de bugs
- **Security** pour les corrections de vulnérabilités
