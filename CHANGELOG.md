# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Added

- Extraction de hooks reutilisables (`useScrollEntrance`, `useFadeInOut`, `usePointerEvents`)
- Composant `GiantCounter` reutilisable pour les animations de compteur
- Indicateur de progression scroll-driven pour le scrollytelling desktop des services
- Animations word-by-word TextReveal sur tous les titres de pages
- Parallax, grain textures et CTA etendu sur HomeServices

### Changed

- Redesign mobile hero avec typographie bold maximalist empilee
- Redesign complet des pages Services, Offres et Contact avec design system unifie
- Reecriture du copy pour le nouveau ton de marque (Home, About, Services, Offres, Contact)
- Decomposition de HomeStory, HomeServices, HomeOffers en sous-composants modulaires
- Centralisation des constantes dans `config/design.ts`
- Centralisation des types formulaire dans `types/forms.ts`
- Remplacement de Calendly par lien de reservation generique
- Migration vers Vite 7.1, React 19.1, Framer Motion 12.23

### Fixed

- Correction des fuites memoire liees aux setTimeout non nettoyes au demontage
- Amelioration du contraste, aria-labels et images responsives (a11y)
- Amelioration SEO, securite et couverture sitemap
- Prevention de l'export duplique dans OffersDesktop
- Remplacement de `elementFromPoint` par `IntersectionObserver` pour le theme navbar

### Removed

- Nettoyage analytics et suppression du monitoring de performance inutilise
- Suppression des dependances deprecated (@studio-freight/lenis)

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
