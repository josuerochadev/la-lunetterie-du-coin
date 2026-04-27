# Audit Qualité — Plan de remédiation

> **But** : remonter la note qualité de 7,5/10 → 9/10 via des PR ciblées, une session = une PR.
> **Source** : audit qualité réalisé le 2026-04-16 sur la branche `chore/final-audit`.
> **Mode opératoire** : voir [Rituel de session](#rituel-de-session) en bas.

---

## État courant

- **Phase active** : Phase 2a — `any` dans tests (terminée)
- **Branche en cours** : `chore/typing-tests-any`
- **Dernière session** : 2026-04-21 (Phase 2a complétée)

---

## Garde-fous transverses

- Une PR = un thème. Pas de PR fourre-tout.
- Jamais de découpage de composant >300 lignes sans tests préalables (filet Phase 4).
- Conventional commits (déjà la norme du repo).
- Validation visuelle manuelle sur les 3 breakpoints (mobile/tablet/desktop) avant chaque merge.
- Pre-commit hooks stricts : ne JAMAIS bypasser avec `--no-verify`.

---

## Phase 1 — Quick wins (1 PR, ~1h, risque nul)

**Branche** : `chore/cleanup-quick-wins`

- [x] Activer règle `no-console` dans `eslint.config.js` (error, exceptions warn/error possibles)
- [x] Nettoyer `console.*` non gardés :
  - [x] `src/lib/iconRegistry.ts:63` — déjà `console.warn` sous garde DEV, OK
  - [x] `src/lib/env.ts:45,46,54,64` — `console.log` L64 → `console.warn`
  - [x] `src/lib/formSubmissionHelpers.ts:56` — déjà `console.warn` sous garde DEV, OK
  - [x] `src/lib/analytics.ts:20` — `console.log` → `console.warn`
  - [x] `src/hooks/useFormSubmission.ts:53,58` — `console.log` → `console.warn` (sous garde DEV, OK)
  - [x] `src/main.tsx:77` — déjà `console.warn` sous garde DEV, OK
- [x] Corriger imports relatifs dans `src/App.tsx:5-7` + `src/main.tsx:9-10` → alias `@/`
- [x] Vérifier usage de `src/components/debug/SentryTest.tsx` → supprimé (non utilisé en prod)
- [x] `.gitignore` : déjà à jour (`quality-report.md`, `security-report.json`, `lighthouse-results/`, `coverage/`)

---

## Phase 2 — Hygiène typage (2 PR, ~3h, risque nul)

### Phase 2a — `any` dans tests

**Branche** : `chore/typing-tests-any`

- [x] `src/seo/__tests__/Seo.test.tsx` (47 occurrences) — helper typé `src/seo/test-utils/helmet-helpers.ts`
- [x] `src/seo/__tests__/LocalBusinessJsonLd.test.tsx` (4 occurrences) — interfaces JSON-LD typées
- [x] `src/components/contact/__tests__/ContactForm.test.tsx` — interfaces MockFormFieldProps etc.
- [x] `src/components/legal/__tests__/*` — types inline sur mocks
- [x] `src/hooks/__tests__/useIntersectionObserver.test.ts` — MockIntersectionObserver typé
- [x] `src/components/motion/__tests__/SimpleAnimation.test.tsx` — MockIntersectionObserver typé

### Phase 2b — `eslint-disable no-unused-vars`

**Branche** : `chore/typing-eslint-disable`

Remplacer par préfixe `_` sur les params callbacks. Fichiers concernés :

- [ ] `src/lib/{analytics.ts:48, toastContext.ts:6, retryLogic.ts:16,60}`
- [ ] `src/components/contact/FormField.tsx:16,18`
- [ ] `src/components/services/ServiceThumbnail.tsx:16`, `src/components/offers/OfferCard.tsx:21`
- [ ] `src/hooks/{useFormStatus.ts:18,20, useFormValidation.ts:13,16,18,20,49, useFormSubmission.ts:15}`
- [ ] `src/components/motion/GiantCounter.tsx:13`

---

## Phase 3 — Magic numbers (3 PR, ~3h, risque faible)

Pour chaque section, créer un fichier voisin `<section>.timeline.ts` avec constantes nommées + commentaires.

### Phase 3a — Offers

**Branche** : `refactor/offers-timeline-constants`

- [ ] Extraire `OFFERS_TIMELINE`, `STAGGER_OFFSET`, `SLICE`, `ENTER_OFFSET`, `TEXT_*` de `src/sections/offers/OffersContent.tsx:21-38, 61, 336, 339-349`

### Phase 3b — Services Mobile

**Branche** : `refactor/services-mobile-timeline-constants`

- [ ] Extraire `TOTAL_VH`, phases de `src/sections/home/services/ServicesMobileAnimated.tsx:21-33`

### Phase 3c — Petites sections (groupées)

**Branche** : `refactor/misc-magic-numbers`

- [ ] `src/components/navbar/Navbar.tsx:23` — `HOVER_ZONE_HEIGHT`
- [ ] `src/components/common/Toast.tsx:16` — `TOAST_DURATION` (suffixe `_MS`)
- [ ] `src/sections/home/story/StoryDesktopAnimated.tsx:76` — phases inline

---

## Phase 4 — Tests filet sur sections critiques (1 PR par section, ~1h chacune)

**Avant** tout découpage Phase 5. Tests comportementaux minimaux : rendu sans crash, CTA présents, variants responsive.

- [ ] `test/coverage-fullscreen-menu` → couvre Phase 5.1
- [ ] `test/coverage-contact-location` → couvre Phase 5.2
- [ ] `test/coverage-about-engagement` → couvre Phase 5.3
- [ ] `test/coverage-about-history` → couvre Phase 5.4
- [ ] `test/coverage-services-mobile` → couvre Phase 5.5
- [ ] `test/coverage-offers-content` → couvre Phase 5.6

---

## Phase 5 — Découpage composants monstres (1 session = 1 section)

**Règle stricte** : ne pas démarrer une section sans la PR Phase 4 correspondante mergée.

- [ ] **5.1** `src/components/navbar/FullScreenMenu.tsx` (370l) → `<MobileMenuLayout>` + `<DesktopMenuLayout>`
- [ ] **5.2** `src/sections/contact/ContactLocation.tsx` (478l) → `<MapBlock>`, `<DirectionsBlock>`
- [ ] **5.3** `src/sections/about/AboutEngagement.tsx` (368l) → extraire états timeline
- [ ] **5.4** `src/sections/about/AboutHistory.tsx` (590l) → split desktop/mobile en 2 fichiers
- [ ] **5.5** `src/sections/home/services/ServicesMobileAnimated.tsx` (538l) → `<ServiceSlide>` + déplacer phases
- [ ] **5.6** `src/sections/offers/OffersContent.tsx` (750l) — **LE PLUS RISQUÉ, en dernier**

---

## Phase 6 — Opportuniste (au fil de l'eau)

Pas de PR dédiée — à faire quand on touche le fichier de toute façon :

- [ ] Remplacer `key={i}` par clés stables (20 occurrences sur 11 fichiers)
- [ ] Refactor logique formulaire (4 fichiers → 2) le jour où on retouche le formulaire
- [ ] Améliorer ErrorBoundary quand un cas d'erreur réel se présente

---

## Rituel de session

**Début** :

1. Tu dis : _"on reprend l'audit"_ (ou _"audit, S<phase>"_)
2. Je lis ce fichier + `git status` + `git log -5`
3. Je confirme la phase/branche/objectif en 2-3 lignes

**Pendant** :

- Une seule branche par session
- TaskList interne pour les sessions à plusieurs étapes
- Si la session devient longue, couper proprement (draft PR avec TODO en haut)

**Fin** :

1. Commit + push de la branche
2. Mise à jour de ce fichier (cases cochées + bloc "État courant" en haut)
3. Si phase finie : ouverture PR

---

## Journal des sessions

| Date       | Phase | Branche                    | PR  | Notes                                                                                |
| ---------- | ----- | -------------------------- | --- | ------------------------------------------------------------------------------------ |
| 2026-04-16 | —     | —                          | —   | Plan créé                                                                            |
| 2026-04-21 | 1     | `chore/cleanup-quick-wins` | —   | Quick wins : no-console ESLint, console.log→warn, imports @/, suppression SentryTest |
| 2026-04-21 | 2a    | `chore/typing-tests-any`   | —   | Suppression de tous les `any` dans 9 fichiers de tests, helper typé Helmet créé      |
