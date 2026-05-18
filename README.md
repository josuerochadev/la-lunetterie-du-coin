<div align="center">

# La Lunetterie du Coin

**Site vitrine pour un opticien indépendant strasbourgeois — lunettes neuves et d'occasion, examens de vue, lentilles.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat&logo=framer)

[Portfolio](https://josuerocha.dev) · [Signaler un bug](https://github.com/josuerochadev/la-lunetterie-du-coin/issues)

</div>

---

## À propos

La Lunetterie du Coin est un opticien indépendant installé à Strasbourg depuis 2016, qui propose des montures neuves et de seconde main, des examens de vue et des lentilles de contact. Ce site a été conçu et développé dans le cadre de mon activité freelance sous la structure Jurema, avec une attention particulière portée à la performance, à l'accessibilité et à l'expérience utilisateur sur mobile.

L'interface intègre des animations au défilement, un système de préférences de mouvement (reduced motion), un formulaire de contact avec validation, et un pipeline qualité complet incluant Lighthouse CI, tests E2E et audit axe-core.

## Fonctionnalités

- Page d'accueil avec intro animée, héro en défilement parallaxe et sections collantes
- Pages dédiées aux services, aux offres en cours et à la boutique
- Formulaire de contact avec validation côté client (react-hook-form)
- SEO structuré — balises canoniques, JSON-LD LocalBusiness, Open Graph
- Respect des préférences de mouvement (`prefers-reduced-motion`)
- Images responsive en AVIF/WebP avec fallback JPEG/PNG
- Suivi des erreurs en production via Sentry
- Pages légales (Mentions légales, Conditions générales de vente)

## Stack technique

| Catégorie     | Outils                                           |
| ------------- | ------------------------------------------------ |
| Framework     | React 19, TypeScript 5.7                         |
| Build         | Vite 7, SVGR                                     |
| Styles        | Tailwind CSS 3, Framer Motion 12                 |
| Routage       | React Router DOM v7                              |
| Formulaires   | react-hook-form                                  |
| SEO           | @dr.pogodin/react-helmet, JSON-LD                |
| Monitoring    | Sentry (@sentry/react)                           |
| Tests         | Vitest, Testing Library, Playwright              |
| Qualité       | ESLint, Prettier, Husky, lint-staged, commitlint |
| Accessibilité | axe-core CLI, Lighthouse CI                      |

## Démarrer

### Prérequis

- Node.js >= 20 < 23
- pnpm >= 8

### Installation

```bash
git clone https://github.com/josuerochadev/la-lunetterie-du-coin.git
cd la-lunetterie-du-coin
pnpm install
pnpm dev
```

### Scripts disponibles

| Commande                  | Description                                |
| ------------------------- | ------------------------------------------ |
| `pnpm dev`                | Serveur de développement                   |
| `pnpm build`              | Build de production (typecheck + Vite)     |
| `pnpm preview`            | Prévisualisation du build sur le port 4173 |
| `pnpm typecheck`          | Vérification TypeScript sans émission      |
| `pnpm lint`               | ESLint, zéro warning toléré                |
| `pnpm format`             | Formatage Prettier                         |
| `pnpm test:run`           | Tests unitaires (Vitest, exécution unique) |
| `pnpm test:coverage`      | Rapport de couverture                      |
| `pnpm e2e`                | Tests end-to-end (Playwright)              |
| `pnpm a11y`               | Audit accessibilité axe-core               |
| `pnpm lighthouse`         | Audit Lighthouse mobile                    |
| `pnpm lighthouse:desktop` | Audit Lighthouse desktop                   |
| `pnpm img:optimize`       | Optimisation des images via Sharp          |
| `pnpm deploy:check`       | Pipeline complet avant déploiement         |

## Architecture

```
src/
├── a11y/               # Gestion des préférences de mouvement
├── components/
│   ├── common/         # Composants génériques (Button, Layout, Picture...)
│   ├── contact/        # Composants du formulaire de contact
│   ├── footer/         # Pied de page
│   ├── motion/         # Composants d'animation
│   ├── navbar/         # Navigation
│   ├── offers/         # Cartes d'offres
│   └── services/       # Carte de service
├── config/             # Constantes (menu, footer, store, SEO, design)
├── data/               # Données statiques (avis, équipe, contenu About)
├── hooks/              # Hooks React personnalisés
├── lib/                # Utilitaires (cn, keyboard, form helpers...)
├── pages/              # Composants de route (HomePage, AboutPage...)
├── sections/           # Sections par page (home/, about/, contact/...)
├── seo/                # Composants SEO et JSON-LD
├── styles/             # Fichiers CSS par composant/section
└── types/              # Déclarations TypeScript
```

---

Construit par **[Josué Rocha](https://josuerocha.dev)** · [LinkedIn](https://linkedin.com/in/josuerocha) · [GitHub](https://github.com/josuerochadev)
