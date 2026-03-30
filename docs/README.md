# Documentation

Documentation technique du projet La Lunetterie du Coin.

## Architecture Decision Records (ADR)

Les ADR documentent les decisions architecturales importantes. Voir [docs/adr/README.md](./adr/README.md) pour l'index complet.

| ADR                                                   | Titre                                     | Statut  |
| ----------------------------------------------------- | ----------------------------------------- | ------- |
| [001](./adr/001-frontend-tech-stack.md)               | Choix de la stack technique frontend      | Accepte |
| [002](./adr/002-motion-accessibility-first.md)        | Approche Motion & Accessibilite           | Accepte |
| [003](./adr/003-performance-optimization-strategy.md) | Strategie d'optimisation des performances | Accepte |
| [004](./adr/004-testing-strategy.md)                  | Strategie de tests multicouche            | Accepte |
| [005](./adr/005-solid-principles-implementation.md)   | Implementation des principes SOLID        | Accepte |

## Autres documents

- [Configuration environnement](./environment-setup.md) - Variables d'environnement par plateforme
- [Strategie de tests](./testing-suite.md) - Tests unitaires, E2E, visuels
- [Tests visuels](./visual-testing.md) - Tests de regression visuelle
- [Standards icones](./standards/icons.md) - Patterns d'import Lucide
- [Audits qualite](./audits/) - Resultats et historique des audits

## Ajouter une ADR

1. Creer un fichier `adr/XXX-titre.md`
2. Suivre le template (Statut, Contexte, Decision, Consequences)
3. Mettre a jour `adr/README.md`
4. Creer une PR
