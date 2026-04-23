# Audit Architecture & Organisation — Plan de remédiation

> **But** : remonter la note architecture de 7,5/10 → 9/10 via des PR ciblées, une session = une phase.
> **Source** : audit architecture réalisé le 2026-04-22 sur la branche `chore/audit-tracker-5.2-done`.
> **Contrainte absolue** : zéro changement visuel. Chaque PR doit passer les tests existants + validation visuelle 3 breakpoints.
> **Mode opératoire** : voir [Rituel de session](#rituel-de-session) en bas.

---

## État courant

- **Phase active** : Phase 4 — terminée (useBreakpoint fusionné)
- **Branche** : `refactor/merge-breakpoint-hooks`
- **Dernière session** : 2026-04-23

---

## Garde-fous transverses

- Une PR = un thème. Pas de PR fourre-tout.
- Conventional commits (norme du repo).
- `pnpm build` + `pnpm lint` + `pnpm test:run` doivent passer à chaque commit.
- Validation visuelle manuelle sur mobile / tablette / desktop avant chaque merge.
- Pre-commit hooks stricts : ne JAMAIS bypasser avec `--no-verify`.
- **Règle d'or** : le rendu final dans le navigateur ne doit pas changer d'un seul pixel.

---

## Phase 1 — Nettoyage code mort (1 PR, ~30min, risque nul)

**Branche** : `refactor/dead-code-cleanup`

- [ ] ~~Supprimer `src/components/common/Picture.tsx` + `src/components/common/Picture.examples.md`~~ — **CONSERVÉ** : Picture est importé dans `ServiceThumbnail.tsx` et `OfferCard.tsx` (2 consommateurs actifs, pas du code mort)
- [x] Supprimer `src/hooks/useScrollProgress.ts` + `src/hooks/__tests__/useScrollProgress.test.ts` (0 imports applicatifs, hook inutilisé)
- [x] ~~Retirer `package-lock.json` du tracking git~~ — **DÉJÀ OK** : le fichier n'est pas versionné (vérifié via `git ls-files`)
- [x] Vérifier que `pnpm build` + `pnpm lint` + `pnpm test:run` passent

<details>
<summary><strong>Prompt Phase 1</strong> (copier/coller)</summary>

```
On fait la Phase 1 du plan docs/audits/audit-architecture-progress.md — "Nettoyage code mort".

Branche : refactor/dead-code-cleanup (à créer depuis main).

Tâches :
1. Supprimer src/components/common/Picture.tsx et src/components/common/Picture.examples.md
   → Ce composant a 0 consommateur. ResponsiveImage.tsx est l'unique composant image utilisé (17 fichiers).
   → Vérifie d'abord qu'aucun fichier n'importe Picture (hors examples.md).

2. Supprimer src/hooks/useScrollProgress.ts et src/hooks/__tests__/useScrollProgress.test.ts
   → Ce hook a 0 import applicatif. useManualScrollProgress et useScrollAnimation sont les hooks scroll utilisés.
   → Vérifie d'abord qu'aucun fichier n'importe useScrollProgress.

3. Retirer package-lock.json du tracking git (git rm --cached package-lock.json)
   → Le projet utilise pnpm exclusivement. Le fichier est dans .gitignore mais encore versionné.

4. À la fin, lance pnpm build && pnpm lint && pnpm test:run pour valider.

Contrainte : ZÉRO changement visuel. On supprime uniquement du code mort.
Quand c'est fait, mets à jour docs/audits/audit-architecture-progress.md (cases cochées + état courant).
```

</details>

---

## Phase 2 — Standardiser `clsx` → `cn()` (1 PR, ~20min, risque nul)

**Branche** : `refactor/standardize-cn`

4 fichiers importent `clsx` directement au lieu de `cn()` (`clsx` + `tailwind-merge`). Ils perdent la résolution de conflits Tailwind.

- [ ] `src/components/services/ServiceThumbnail.tsx:4` — `import clsx` → `import { cn } from '@/lib/cn'`
- [ ] `src/components/common/Logo.tsx:3` — `import { clsx }` → `import { cn } from '@/lib/cn'`
- [ ] `src/sections/shared/Footer.tsx:2` — `import { clsx }` → `import { cn } from '@/lib/cn'`
- [ ] `src/components/common/EyePattern.tsx:2` — `import { clsx }` → `import { cn } from '@/lib/cn'`
- [ ] Renommer chaque appel `clsx(...)` → `cn(...)` dans ces 4 fichiers
- [ ] Vérifier que `pnpm build` + `pnpm lint` + `pnpm test:run` passent

<details>
<summary><strong>Prompt Phase 2</strong> (copier/coller)</summary>

```
On fait la Phase 2 du plan docs/audits/audit-architecture-progress.md — "Standardiser clsx → cn()".

Branche : refactor/standardize-cn (à créer depuis main).

4 fichiers importent clsx directement au lieu d'utiliser cn() de @/lib/cn.ts (qui combine clsx + tailwind-merge pour résoudre les conflits de classes Tailwind).

Fichiers à modifier :
1. src/components/services/ServiceThumbnail.tsx — import clsx from 'clsx' → import { cn } from '@/lib/cn', renommer clsx(...) → cn(...)
2. src/components/common/Logo.tsx — import { clsx } from 'clsx' → import { cn } from '@/lib/cn', renommer clsx(...) → cn(...)
3. src/sections/shared/Footer.tsx — import { clsx } from 'clsx' → import { cn } from '@/lib/cn', renommer clsx(...) → cn(...)
4. src/components/common/EyePattern.tsx — import { clsx } from 'clsx' → import { cn } from '@/lib/cn', renommer clsx(...) → cn(...)

Pour chaque fichier :
- Lis le fichier d'abord
- Remplace l'import
- Remplace chaque appel clsx() → cn()
- Ne touche à RIEN d'autre

À la fin, lance pnpm build && pnpm lint && pnpm test:run.
Contrainte : ZÉRO changement visuel. On uniformise juste l'utilitaire de classes.
Quand c'est fait, mets à jour docs/audits/audit-architecture-progress.md (cases cochées + état courant).
```

</details>

---

## Phase 3 — Extraire `useNavbarTheme` du Navbar (1 PR, ~45min, risque modéré)

**Branche** : `refactor/extract-navbar-theme-hook`

Le `Navbar.tsx` (287 lignes) cumule 5 `useEffect`. La logique de détection de thème par IntersectionObserver (lignes 77-158, ~81 lignes) est un hook auto-contenu.

- [ ] Créer `src/hooks/useNavbarTheme.ts` — extraire la logique IO de `Navbar.tsx:77-158`
  - Input : `location.pathname`
  - Output : `{ theme: 'dark' | 'light', hiddenByFooter: boolean }`
- [ ] Modifier `Navbar.tsx` pour consommer le hook
- [ ] Vérifier que le comportement est identique : thème light/dark selon `data-navbar-theme`, masquage footer
- [ ] Créer un test minimal pour `useNavbarTheme` (rendu sans crash + valeur par défaut `dark`)
- [ ] Vérifier que `pnpm build` + `pnpm lint` + `pnpm test:run` passent
- [ ] **Validation visuelle** : naviguer sur toutes les pages, vérifier les transitions de thème navbar

<details>
<summary><strong>Prompt Phase 3</strong> (copier/coller)</summary>

```
On fait la Phase 3 du plan docs/audits/audit-architecture-progress.md — "Extraire useNavbarTheme".

Branche : refactor/extract-navbar-theme-hook (à créer depuis main).

Contexte : Navbar.tsx fait 287 lignes avec 5 useEffect. La logique de détection de thème par IntersectionObserver (lignes 77-158) est un candidat parfait pour un hook dédié.

Tâches :
1. Lis src/components/navbar/Navbar.tsx en entier pour comprendre la logique complète.

2. Crée src/hooks/useNavbarTheme.ts :
   - Extrais le useEffect de détection de thème (lignes 77-158 du Navbar actuel)
   - Le hook prend pathname: string en paramètre (pour le re-observe au changement de route)
   - Il retourne { theme: 'dark' | 'light', hiddenByFooter: boolean }
   - Inclus toute la logique IO : création observer, observation des [data-navbar-theme], résolution du thème, détection footer, resize handler
   - Conserve les constantes BAND_TOP et BAND_BOTTOM dans le hook

3. Modifie Navbar.tsx pour utiliser le nouveau hook :
   - import { useNavbarTheme } from '@/hooks/useNavbarTheme'
   - const { theme, hiddenByFooter } = useNavbarTheme(location.pathname)
   - Supprime le useEffect correspondant + les states theme/hiddenByFooter du Navbar
   - Ne touche PAS aux 4 autres useEffect ni au JSX

4. Crée un test minimal src/hooks/__tests__/useNavbarTheme.test.ts :
   - Rendu sans crash
   - Valeur par défaut : theme = 'dark', hiddenByFooter = false

5. Lance pnpm build && pnpm lint && pnpm test:run

CONTRAINTE CRITIQUE : le comportement visuel de la navbar doit être IDENTIQUE.
Le thème doit toujours changer en scrollant sur les sections dark/light.
La navbar doit toujours se masquer au-dessus du footer.

Quand c'est fait, mets à jour docs/audits/audit-architecture-progress.md (cases cochées + état courant).
```

</details>

---

## Phase 4 — Fusionner `useIsLg` / `useIsXl` → `useBreakpoint` (1 PR, ~30min, risque faible)

**Branche** : `refactor/merge-breakpoint-hooks`

Les deux hooks sont quasi-identiques (seul le seuil en px change).

- [x] Créer `src/hooks/useBreakpoint.ts` — `useBreakpoint(minWidth: number): boolean`
- [x] Refactorer `useIsLg.ts` → réexport : `export const useIsLg = () => useBreakpoint(1024)`
- [x] Refactorer `useIsXl.ts` → réexport : `export const useIsXl = () => useBreakpoint(1280)`
- [x] Migrer les tests existants (si présents) ou créer un test pour `useBreakpoint`
- [x] Vérifier que tous les consommateurs de `useIsLg` / `useIsXl` fonctionnent sans changement d'import
- [x] `pnpm build` + `pnpm lint` + `pnpm test:run`

<details>
<summary><strong>Prompt Phase 4</strong> (copier/coller)</summary>

```
On fait la Phase 4 du plan docs/audits/audit-architecture-progress.md — "Fusionner useIsLg/useIsXl → useBreakpoint".

Branche : refactor/merge-breakpoint-hooks (à créer depuis main).

Contexte : useIsLg.ts (24 lignes) et useIsXl.ts (27 lignes) sont quasi-identiques — seul le seuil en pixels change.

Tâches :
1. Lis src/hooks/useIsLg.ts et src/hooks/useIsXl.ts pour confirmer la duplication.

2. Crée src/hooks/useBreakpoint.ts :
   - export function useBreakpoint(minWidth: number): boolean
   - Même implémentation que useIsLg/useIsXl : useState + matchMedia + listener
   - SSR-safe (typeof window check)

3. Refactore useIsLg.ts pour qu'il devienne un réexport :
   import { useBreakpoint } from './useBreakpoint';
   export const useIsLg = () => useBreakpoint(1024);

4. Refactore useIsXl.ts pour qu'il devienne un réexport :
   import { useBreakpoint } from './useBreakpoint';
   export const useIsXl = () => useBreakpoint(1280);

5. Vérifie que TOUS les consommateurs existants de useIsLg / useIsXl n'ont AUCUN changement d'import nécessaire (les exports sont préservés).

6. Crée un test src/hooks/__tests__/useBreakpoint.test.ts :
   - Retourne false quand window.innerWidth < breakpoint
   - Retourne true quand window.innerWidth >= breakpoint
   - Mock window.matchMedia

7. Lance pnpm build && pnpm lint && pnpm test:run

Contrainte : ZÉRO changement visuel. Les hooks gardent la même signature publique.
Quand c'est fait, mets à jour docs/audits/audit-architecture-progress.md (cases cochées + état courant).
```

</details>

---

## Phase 5 — Split `ServicesMobileAnimated` page Services (1 PR, ~45min, risque modéré)

**Branche** : `refactor/split-services-mobile`

`src/sections/services/ServicesMobileAnimated.tsx` (348 lignes) contient 3 composants inline (`ProgressSegment`, `ProgressBar`, `ServiceSlide`) non extraits. La version homepage (`src/sections/home/services/`) a déjà été proprement splitée.

- [ ] Extraire `ServiceSlide` → `src/sections/services/ServiceSlide.tsx`
- [ ] Extraire `ProgressBar` + `ProgressSegment` → `src/sections/services/ProgressBar.tsx`
- [ ] `ServicesMobileAnimated.tsx` ne garde que l'orchestrateur (sticky + ref + slides map)
- [ ] Extraire les constantes timeline (`SLICE`, `ENTER_OFFSET`, `TEXT_*`, `EXIT_*`) → `src/sections/services/ServicesMobileAnimated.timeline.ts`
- [ ] Vérifier que la page /services fonctionne identiquement (scroll, animations, progress bar)
- [ ] `pnpm build` + `pnpm lint` + `pnpm test:run`

<details>
<summary><strong>Prompt Phase 5</strong> (copier/coller)</summary>

```
On fait la Phase 5 du plan docs/audits/audit-architecture-progress.md — "Split ServicesMobileAnimated page Services".

Branche : refactor/split-services-mobile (à créer depuis main).

Contexte : src/sections/services/ServicesMobileAnimated.tsx (348 lignes) contient 3 composants inline non extraits. La version homepage (src/sections/home/services/) a déjà été proprement splitée — on applique le même pattern.

Tâches :
1. Lis src/sections/services/ServicesMobileAnimated.tsx en entier.
2. Lis aussi src/sections/home/services/ pour voir le pattern de split déjà appliqué (ServiceSlide.tsx, MobileProgressBar.tsx, etc.).

3. Extrais les constantes timeline → src/sections/services/ServicesMobileAnimated.timeline.ts :
   - SLICE, ENTER_OFFSET, ENTER_DUR, TEXT_COUNTER, TEXT_TITLE, TEXT_DESC, TEXT_DETAILS, TEXT_CTA, TEXT_STAGGER, EXIT_START, EXIT_END
   - SERVICE_COUNT reste importé de ./constants

4. Extrais ServiceSlide → src/sections/services/ServiceSlide.tsx :
   - Prend { service: ServiceData, index: number, scrollYProgress: MotionValue<number> }
   - Importe les constantes depuis le .timeline.ts
   - Inclut tout le JSX du slide (photo, gradients, text content, CTA)

5. Extrais ProgressBar + ProgressSegment → src/sections/services/ProgressBar.tsx :
   - ProgressBar prend { scrollYProgress: MotionValue<number> }
   - ProgressSegment est un composant privé (non exporté) dans le même fichier

6. ServicesMobileAnimated.tsx ne garde que :
   - Le wrapper avec ref + useManualScrollProgress
   - Le sticky container
   - Le map des ServiceSlide + ProgressBar
   - Devrait faire ~40-50 lignes max

7. Lance pnpm build && pnpm lint && pnpm test:run
8. Vérifie que les tests existants de ServicesMobileAnimated passent toujours.

CONTRAINTE CRITIQUE : la page /services doit être VISUELLEMENT IDENTIQUE.
Scroll, animations, progress bar, transitions — tout doit fonctionner exactement pareil.

Quand c'est fait, mets à jour docs/audits/audit-architecture-progress.md (cases cochées + état courant).
```

</details>

---

## Phase 6 — Spring config orpheline + documentation hooks scroll (1 PR, ~20min, risque nul)

**Branche** : `refactor/spring-config-consistency`

- [ ] `src/components/common/CursorFollower.tsx:28` — remplacer le `springConfig` local par une constante nommée dans `@/lib/motion` (ex: `SPRING_CONFIG_CURSOR`) ou ajouter un commentaire expliquant pourquoi les valeurs diffèrent de `SPRING_CONFIG`
- [ ] `src/hooks/useScrollAnimation.ts:59` — le fallback `{ stiffness: 100, damping: 30 }` diffère de `SPRING_CONFIG` (`{ stiffness: 80, damping: 30, mass: 0.5 }`) — aligner sur `SPRING_CONFIG` ou extraire en constante nommée
- [ ] Ajouter un JSDoc en tête de `src/hooks/useManualScrollProgress.ts` expliquant quand l'utiliser vs `useScrollAnimation` (workaround framer-motion bug sur éléments deep-page sous sticky transforms)
- [ ] `pnpm build` + `pnpm lint` + `pnpm test:run`

<details>
<summary><strong>Prompt Phase 6</strong> (copier/coller)</summary>

```
On fait la Phase 6 du plan docs/audits/audit-architecture-progress.md — "Spring config + documentation hooks scroll".

Branche : refactor/spring-config-consistency (à créer depuis main).

Tâches :

1. Lis src/lib/motion.ts pour voir SPRING_CONFIG actuel ({ stiffness: 80, damping: 30, mass: 0.5 }).

2. src/components/common/CursorFollower.tsx:28 — il y a un springConfig local { damping: 25, stiffness: 150, mass: 0.5 }.
   Les valeurs sont intentionnellement différentes (cursor-following nécessite plus de réactivité).
   → Ajoute cette config comme export nommé dans src/lib/motion.ts : SPRING_CONFIG_CURSOR = { stiffness: 150, damping: 25, mass: 0.5 }
   → Importe-la dans CursorFollower.tsx au lieu de la définir inline.

3. src/hooks/useScrollAnimation.ts:59 — le fallback { stiffness: 100, damping: 30 } quand spring n'est pas activé.
   → Remplace par SPRING_CONFIG importé de @/lib/motion pour cohérence.
   → Fais pareil pour le default spring config (lignes 53-54).

4. Ajoute un bloc JSDoc en tête de src/hooks/useManualScrollProgress.ts qui explique :
   - Quand l'utiliser : quand l'élément est deep-page sous des ancêtres sticky avec transform (bug framer-motion useScroll)
   - Quand utiliser useScrollAnimation à la place : cas standard, éléments normaux dans le flow
   - Ne touche PAS à la logique, juste la doc.

5. Lance pnpm build && pnpm lint && pnpm test:run

Contrainte : ZÉRO changement visuel. On aligne des configs et on documente.
Quand c'est fait, mets à jour docs/audits/audit-architecture-progress.md (cases cochées + état courant).
```

</details>

---

## Phase 7 — Opportuniste (au fil de l'eau)

Pas de PR dédiée — à faire quand on touche le fichier concerné :

- [ ] Réduire `src/sections/contact/ContactInfo.tsx` (341l) — extraire la logique scroll dans un hook si on retouche la section contact
- [ ] Considérer la factorisation du pattern `useTransform` + `useSpring` répétitif dans les sections animées (OffersDesktop 307l, StoryDesktopAnimated 312l, etc.) — uniquement si un pattern clair et réutilisable émerge
- [ ] `src/styles/responsive-improvements.css` (234l) — migrer progressivement vers des classes Tailwind quand on touche les composants concernés

---

## Rituel de session

**Début** :

1. Tu dis : _"on reprend l'audit archi"_ (ou _"archi, Phase N"_)
2. Je lis ce fichier + `git status` + `git log -5`
3. Je confirme la phase/branche/objectif en 2-3 lignes

**Pendant** :

- Une seule branche par session
- Copie le prompt de la phase depuis ce fichier
- Si la session devient longue, couper proprement (draft PR avec TODO en haut)

**Fin** :

1. Commit + push de la branche
2. Mise à jour de ce fichier (cases cochées + bloc "État courant" en haut)
3. Si phase finie : ouverture PR

**Validation visuelle obligatoire** :

Avant chaque merge, vérifier manuellement sur les 3 breakpoints :

- Mobile (375px) — navigation, scroll, animations
- Tablette (768px) — mise en page, navbar theme
- Desktop (1440px) — animations scroll-driven, transitions

---

## Journal des sessions

| Date       | Phase | Branche                           | PR  | Notes                                                                                                                         |
| ---------- | ----- | --------------------------------- | --- | ----------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-22 | —     | —                                 | —   | Plan créé depuis audit architecture                                                                                           |
| 2026-04-23 | 1     | `refactor/dead-code-cleanup`      | —   | useScrollProgress supprimé ; Picture conservé (2 consommateurs actifs) ; package-lock.json déjà non-versionné                 |
| 2026-04-23 | 4     | `refactor/merge-breakpoint-hooks` | —   | useBreakpoint(minWidth) créé ; useIsLg/useIsXl deviennent des réexports ; tests ajoutés ; 0 changement d'import consommateurs |
