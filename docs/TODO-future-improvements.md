# TODO - Ameliorations Futures

**Date de creation**: 24 avril 2026
**Source**: Analyse complete du codebase (code, tests, CI/CD, performance, a11y)

Ce document regroupe les ameliorations identifiees mais non encore implementees,
avec des prompts prets a l'emploi pour chaque tache.

---

## Haute priorite

### 1. Memoization des composants animation-heavy

**Probleme**: Seulement ~11 utilisations de `useCallback`/`useMemo`/`React.memo` dans tout le projet. Les composants avec beaucoup d'animations declenchent des re-renders inutiles.

**Fichiers concernes**:

- `src/sections/services/ServicesMobileAnimated.tsx` (~538 lignes)
- `src/sections/offers/OffersContent.tsx` (~750 lignes)
- Composants avec Framer Motion lourds

**Statut**: A FAIRE

<details>
<summary>Prompt Claude Code</summary>

```
Analyse les composants suivants pour identifier les re-renders inutiles et ajouter de la memoization la ou c'est pertinent :

1. src/sections/services/ServicesMobileAnimated.tsx
2. src/sections/offers/OffersContent.tsx

Pour chaque composant :
- Identifie les objets/arrays recrees a chaque render (variants, styles, callbacks)
- Wrap les callbacks avec useCallback
- Wrap les valeurs calculees avec useMemo
- Utilise React.memo pour les sous-composants purs qui recoivent des props stables
- Ne memoize PAS les choses triviales (strings, booleans simples)
- Verifie que les tests passent apres modification (pnpm test:run)
```

</details>

---

### 2. Remplacer les cles basees sur l'index

**Probleme**: 19 instances de `key={i}` ou `key={index}` dans les `.map()`. Cela peut casser la reconciliation React lors de reordonnancements ou suppressions dans les listes.

**Statut**: A FAIRE

<details>
<summary>Prompt Claude Code</summary>

```
Cherche toutes les instances de key={i} ou key={index} dans le codebase (src/).
Pour chaque occurrence :
- Si la liste a des identifiants uniques dans les donnees, utilise-les
- Si les elements ont un champ unique (title, name, id, href), utilise-le
- Si aucun identifiant naturel n'existe, cree une cle stable basee sur le contenu (ex: `${item.title}-${item.category}`)
- Ne PAS utiliser crypto.randomUUID() ou Math.random() comme cle

Verifie que pnpm lint && pnpm test:run passent apres les modifications.
```

</details>

---

### 3. ErrorBoundary - Utiliser React Router au lieu de window.location

**Probleme**: `ErrorBoundary.tsx` utilise `window.location.reload()` et `window.location.href = '/'`, ce qui provoque un rechargement complet de l'application au lieu d'une navigation SPA.

**Fichier**: `src/components/common/ErrorBoundary.tsx`

**Statut**: A FAIRE

<details>
<summary>Prompt Claude Code</summary>

```
Dans src/components/common/ErrorBoundary.tsx :

1. Remplace window.location.href = '/' par une navigation React Router
2. Note : les class components ne supportent pas les hooks, donc il faut soit :
   a. Creer un wrapper fonctionnel qui passe navigate via props
   b. Ou utiliser un <Link> / <a> avec un onClick qui reset l'error state
3. Garde window.location.reload() comme fallback pour les erreurs critiques si necessaire
4. Assure-toi que le reset de l'error boundary fonctionne correctement apres navigation
5. Verifie que le reporting Sentry n'est pas affecte
6. Lance pnpm test:run pour valider
```

</details>

---

## Priorite moyenne

### 4. Augmenter la couverture de tests a 55%

**Probleme**: Objectif de couverture 55% pas encore atteint. Fichiers prioritaires identifies.

**Fichiers prioritaires**:

- `ServicesPage.tsx` (161 lignes) - ~2h
- `OffersPage.tsx` (148 lignes) - ~2h
- `AboutPage.tsx` (271 lignes) - ~2h
- Navbar interactions - ~1h
- `lib/monitoring.ts` (309 lignes) - ~1-2h

**Statut**: A FAIRE (reporte de l'ancien TODO Phase 2)

<details>
<summary>Prompt Claude Code</summary>

```
Augmente la couverture de tests du projet. Objectif : passer de 45% a 55%.

Fichiers prioritaires a tester (par ordre d'impact) :
1. src/pages/ServicesPage.tsx - teste le rendu, les interactions, les responsive breakpoints
2. src/pages/OffersPage.tsx - teste le rendu, les filtres/categories si applicable
3. src/pages/AboutPage.tsx - teste le rendu des sections, les animations conditionnelles
4. src/components/navbar/ - teste les interactions menu, toggle mobile, navigation
5. src/lib/monitoring.ts - teste les fonctions utilitaires de monitoring

Pour chaque fichier :
- Utilise le pattern de test existant du projet (Vitest + @testing-library/react)
- Mocke les dependances externes (Framer Motion, IntersectionObserver)
- Teste le rendu initial, les interactions utilisateur, et les edge cases
- Lance pnpm test:coverage pour verifier la progression
```

</details>

---

### 5. Decouper les composants trop larges

**Probleme**: Certaines sections depassent 500 lignes, ce qui nuit a la maintenabilite.

**Fichiers concernes**:

- `src/sections/offers/OffersContent.tsx` (~750 lignes)
- `src/sections/services/ServicesMobileAnimated.tsx` (~538 lignes)

**Statut**: A FAIRE (Phase 5 de audit-quality-progress.md)

<details>
<summary>Prompt Claude Code</summary>

```
Decoupe les composants suivants en sous-composants plus petits (objectif : <250 lignes par fichier) :

1. src/sections/offers/OffersContent.tsx (~750 lignes)
   - Identifie les blocs logiques independants (header, liste, filtres, cards, etc.)
   - Extrais chaque bloc en composant dans le meme dossier
   - Garde le composant principal comme orchestrateur

2. src/sections/services/ServicesMobileAnimated.tsx (~538 lignes)
   - Separe la logique d'animation des composants de presentation
   - Extrais les sous-sections en composants dedies

Regles :
- Suis le pattern etabli du projet (voir sections/home/ pour exemples)
- Chaque sous-composant doit etre type avec TypeScript
- Ne casse pas les animations existantes
- Lance pnpm build && pnpm test:run pour valider
```

</details>

---

### 6. Consolider la logique formulaire

**Probleme**: 4 fichiers lies aux formulaires pourraient etre simplifies en 2.

**Fichiers concernes**:

- `src/lib/networkErrors.ts`
- `src/lib/retryLogic.ts`
- `src/hooks/useFormSubmission.ts`
- `src/hooks/useContactForm.ts`

**Statut**: A FAIRE

<details>
<summary>Prompt Claude Code</summary>

```
Analyse les 4 fichiers de logique formulaire et propose une consolidation :

- src/lib/networkErrors.ts
- src/lib/retryLogic.ts
- src/hooks/useFormSubmission.ts
- src/hooks/useContactForm.ts

Objectif : reduire a 2 fichiers si possible, par exemple :
1. src/lib/formSubmission.ts (network errors + retry logic)
2. src/hooks/useContactForm.ts (hook unifie)

Regles :
- Ne perds aucune fonctionnalite (retry, error classification, backoff)
- Garde les types TypeScript stricts
- Mets a jour tous les imports dans le projet
- Verifie que les tests existants passent (pnpm test:run)
- Lance pnpm lint pour valider zero warnings
```

</details>

---

### 7. Lazy-load Sentry plus agressivement

**Probleme**: Sentry est deja lazy-loaded avec `requestIdleCallback`, mais pourrait etre differe encore davantage pour ameliorer le Time to Interactive.

**Fichier**: `src/main.tsx`

**Statut**: A FAIRE (optionnel)

<details>
<summary>Prompt Claude Code</summary>

```
Dans src/main.tsx, analyse le chargement actuel de Sentry et propose des optimisations :

1. Differe le chargement apres le premier render complet (pas juste requestIdleCallback)
2. Considere un delai minimum (ex: 5 secondes apres le load) avant d'initialiser Sentry
3. Garde le chargement conditionnel (pas sur mobile, pas sur slow-2g)
4. Assure-toi que les erreurs survenant avant l'init Sentry ne sont pas perdues silencieusement
5. Mesure l'impact avec pnpm lighthouse:desktop avant/apres
```

</details>

---

## Basse priorite

### 8. Raffinements SOLID optionnels

**Probleme**: Score SOLID actuel 9.3/10, ameliorable a 9.8/10 avec 3 ajustements.

**Actions**:

1. **OCP**: Subject configurable dans `createFormRequest()`
2. **ISP**: Segregation `useFormStatus` en hooks specialises
3. **DIP**: Endpoint injectable dans `useFormSubmission()`

**Statut**: A FAIRE (optionnel, reporte de l'ancien TODO)

<details>
<summary>Prompt Claude Code</summary>

```
Applique 3 raffinements SOLID au code formulaire :

1. Open/Closed Principle - Dans la fonction createFormRequest() (src/lib/),
   rends le subject configurable via parametre au lieu d'etre hard-code.

2. Interface Segregation - Si useFormStatus expose trop de proprietes,
   decoupe-le en hooks plus granulaires (ex: useFormLoading, useFormError, useFormSuccess).

3. Dependency Inversion - Dans useFormSubmission (src/hooks/),
   rends l'endpoint Formspree injectable via parametre avec une valeur par defaut,
   au lieu de l'importer directement depuis la config.

Verifie que pnpm build && pnpm test:run && pnpm lint passent.
```

</details>

---

### 9. Verifier les dependances inutilisees

**Probleme**: Le projet a accumule des dependances au fil du temps. Certaines pourraient ne plus etre necessaires.

**Statut**: A FAIRE

<details>
<summary>Prompt Claude Code</summary>

```
Analyse les dependances du projet pour identifier celles qui ne sont plus utilisees :

1. Lis package.json et liste toutes les dependencies et devDependencies
2. Pour chaque dependance, cherche si elle est importee quelque part dans src/, tests/, scripts/, config files
3. Verifie aussi les dependances utilisees uniquement dans les configs (vite.config, eslint.config, etc.)
4. Liste les dependances potentiellement inutilisees
5. Ne supprime RIEN automatiquement - presente juste le rapport pour validation

Commande utile : npx depcheck (si disponible) ou analyse manuelle.
```

</details>

---

### 10. Tests de regression visuelle

**Probleme**: Tests visuels desactives a cause de differences macOS/Linux. Aucune protection contre les regressions CSS.

**Voir**: `docs/visual-testing.md` pour le contexte complet.

**Statut**: A FAIRE (quand budget disponible)

<details>
<summary>Prompt Claude Code</summary>

```
Reimplemente les tests de regression visuelle avec une approche Docker :

1. Cree un Dockerfile leger base sur mcr.microsoft.com/playwright qui servira
   d'environnement de test identique local et CI
2. Cree e2e/visual-regression.spec.ts avec des tests pour :
   - Homepage (desktop, mobile 375x667, tablette 768x1024)
   - Section Hero, Navigation, Footer
   - Formulaire contact (etats : vide, focus, rempli, erreur)
3. Configure le threshold a 0.2 avec animations desactivees
4. Ajoute un script pnpm e2e:visual qui lance les tests dans le container Docker
5. Integre dans le pipeline CI (.github/workflows/) en mode non-bloquant (continue-on-error)
6. Documente la procedure dans docs/visual-testing.md

Voir docs/visual-testing.md pour l'architecture prevue et le contexte historique.
```

</details>

---

### 11. Validation pre-build des configurations externes

**Probleme**: Les configurations Formspree et Sentry sont validees au runtime mais pas au build. Une config invalide ne sera detectee qu'en production.

**Statut**: A FAIRE (optionnel)

<details>
<summary>Prompt Claude Code</summary>

```
Ajoute une validation pre-build des configurations externes :

1. Dans src/lib/env.ts ou un nouveau fichier de validation :
   - Valide le format de l'endpoint Formspree (doit matcher /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/)
   - Valide le format du DSN Sentry (doit matcher le pattern standard)
2. Integre cette validation dans le script pnpm env:validate
3. Ajoute cette validation comme etape pre-build dans vite.config.ts (via un plugin custom ou defineConfig)
4. Les erreurs de validation doivent etre claires et actionables
5. Ne bloque PAS le dev server pour les variables optionnelles, seulement le build prod
```

</details>

---

### 12. Breadcrumbs Sentry plus granulaires

**Probleme**: Le tracking d'erreurs Sentry pourrait capturer plus de contexte pour faciliter le debugging en production.

**Statut**: A FAIRE (optionnel)

<details>
<summary>Prompt Claude Code</summary>

```
Ameliore le tracking Sentry avec des breadcrumbs plus detailles :

1. Ajoute des breadcrumbs pour :
   - Navigation entre pages (React Router events)
   - Soumission de formulaire (debut, succes, echec)
   - Changement de viewport/breakpoint
   - Erreurs reseau classifiees (offline, timeout, server error)
2. Utilise Sentry.addBreadcrumb() aux endroits strategiques
3. Garde le lazy-loading - les breadcrumbs ne doivent etre actifs qu'apres l'init Sentry
4. Ne log PAS de donnees sensibles (email, nom, telephone)
5. Verifie que le sampling rate (0.5%) n'est pas impacte
```

</details>

---

## Tableau recapitulatif

| #   | Amelioration                  | Priorite | Effort | Impact          |
| --- | ----------------------------- | -------- | ------ | --------------- |
| 1   | Memoization composants lourds | HAUTE    | 2-3h   | Performance     |
| 2   | Remplacer cles index          | HAUTE    | 1-2h   | Stabilite React |
| 3   | ErrorBoundary React Router    | HAUTE    | 1h     | UX              |
| 4   | Couverture tests 55%          | MOYENNE  | 6-8h   | Robustesse      |
| 5   | Decouper composants larges    | MOYENNE  | 4-6h   | Maintenabilite  |
| 6   | Consolider logique formulaire | MOYENNE  | 2-3h   | Simplicite      |
| 7   | Lazy-load Sentry++            | MOYENNE  | 1h     | TTI             |
| 8   | Raffinements SOLID            | BASSE    | 3-4h   | Score qualite   |
| 9   | Audit dependances             | BASSE    | 1h     | Proprete        |
| 10  | Tests regression visuelle     | BASSE    | 4-6h   | Protection CSS  |
| 11  | Validation pre-build configs  | BASSE    | 1-2h   | Fiabilite       |
| 12  | Breadcrumbs Sentry            | BASSE    | 2h     | Observabilite   |

---

_Derniere mise a jour: 24 avril 2026_
